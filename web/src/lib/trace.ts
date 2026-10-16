import type { AdkEvent, JournalOutcome, TaxAssessment } from "./adk";
import { copy } from "./copy";

/**
 * The screen's model of one receipt: a plain-language activity feed plus the
 * journal entry that was posted. Built by folding the SSE event stream.
 *
 * Copy rules: this is read by shop owners and judges, not engineers. Steps
 * describe what is happening to *their receipt* — never tool names, JSON or
 * protocol detail. All user-facing strings live in ./copy.
 */

export type StepKind =
  | "reading"
  | "matching"
  | "checking"
  | "posted"
  | "handoff"
  | "tax"
  | "regulasi"
  | "problem";

export interface TraceStep {
  id: string;
  kind: StepKind;
  title: string;
  detail?: string;
  outcome?: JournalOutcome;
  /** Set for tool steps so duplicate frames of one call collapse. */
  callId?: string;
  at: number;
}

/** One line of the proposed posting. */
export interface DraftLine {
  account: string;
  debit: number;
  credit: number;
}

export interface RunState {
  status: "idle" | "working" | "done" | "error";
  steps: TraceStep[];
  answer: string;
  commit: JournalOutcome | null;
  /** The posting the assistant proposed, before the balance check replied. */
  proposed: DraftLine[] | null;
  /** Set once Agent Keuangan hands the entry to Agent Fiskal. */
  handoff: string | null;
  /** Agent Fiskal's grounded tax assessment (with Pasal/Ayat citations). */
  tax: TaxAssessment | null;
  /** Agent Fiskal's plain-Indonesian narrative answer. */
  taxAnswer: string;
  /** Verified KBLI classification from Agent Regulasi, if it ran. */
  kbli: {
    code: string;
    title: string;
    hierarchy?: { level: string; code: string; title: string }[];
  } | null;
  latencyMs: number | null;
  error: string | null;
}

export const emptyRun: RunState = {
  status: "idle",
  steps: [],
  answer: "",
  commit: null,
  proposed: null,
  handoff: null,
  tax: null,
  taxAnswer: "",
  kbli: null,
  latencyMs: null,
  error: null,
};

let seq = 0;
const nextId = () => `step-${++seq}`;

/** Plain-language wording for a rejected posting, in place of the raw rule text. */
function friendlyProblem(message: string): string {
  const text = message.toLowerCase();
  if (text.includes("unbalanced")) return copy.problems.unbalanced;
  if (text.includes("at least 2 lines")) return copy.problems.tooFewLines;
  if (text.includes("negative")) return copy.problems.negative;
  if (text.includes("zero debit and zero credit")) return copy.problems.emptyAmount;
  return copy.problems.fallback;
}

/** Insert the balance-check step before any outcome step, exactly once. */
function ensureChecking(next: RunState, at: number): void {
  if (next.steps.some((s) => s.kind === "checking")) return;
  const step: TraceStep = {
    id: nextId(),
    kind: "checking",
    title: copy.steps.checking.title,
    detail: copy.steps.checking.detail,
    at,
  };
  const outcomeAt = next.steps.findIndex((s) => s.kind === "posted" || s.kind === "problem");
  if (outcomeAt === -1) next.steps.push(step);
  else next.steps.splice(outcomeAt, 0, step);
}

/** Fold one SSE frame into the current run state. Returns a new state object. */
export function reduceEvent(state: RunState, event: AdkEvent): RunState {
  const next: RunState = { ...state, steps: [...state.steps] };
  const at = event.timestamp ?? Date.now() / 1000;

  if (event.errorMessage) {
    next.status = "error";
    next.error = copy.banner.offline;
    next.steps.push({
      id: nextId(),
      kind: "problem",
      title: copy.steps.failure.title,
      detail: copy.steps.failure.detail,
      at,
    });
    return next;
  }

  for (const part of event.content?.parts ?? []) {
    // 1. The assistant proposes a posting. Show it as a friendly result, not as
    //    a tool call. Identical frames are re-sent, so collapse by call id.
    if (part.functionCall) {
      const call = part.functionCall;
      if (call.id && next.steps.some((s) => s.callId === call.id)) continue;

      // The tax agent running its own tool.
      if (call.name === "compute_pph_final") {
        next.steps.push({
          id: nextId(),
          kind: "tax",
          title: copy.steps.taxChecking.title,
          detail: copy.steps.taxChecking.detail,
          callId: call.id,
          at,
        });
        continue;
      }

      // The licensing agent verifying a KBLI code against the catalogue.
      if (call.name === "classify_kbli") {
        const args = (call.args ?? {}) as { code?: string };
        // Two different acts share one tool: proposing candidates from a
        // description, then verifying a chosen code. Naming them the same made
        // the trace read as a duplicated step.
        const isVerify = typeof args.code === "string" && args.code.length > 0;
        next.steps.push({
          id: nextId(),
          kind: "regulasi",
          title: isVerify
            ? copy.steps.kbliVerify.title
            : copy.steps.kbliChecking.title,
          detail: isVerify
            ? copy.steps.kbliVerify.detail
            : copy.steps.kbliChecking.detail,
          callId: call.id,
          at,
        });
        continue;
      }

      // The licensing agent handing off from the tax agent.
      if (call.name === "transfer_to_agent") {
        const target = (call.args as { agent_name?: string } | undefined)?.agent_name ?? null;
        next.handoff = target;
        // Regulasi follows Fiskal, so it gets its own wording rather than the
        // "handed to the tax agent" line meant for the first hop.
        const toRegulasi = target === "agent_regulasi";
        next.steps.push({
          id: nextId(),
          kind: "handoff",
          title: toRegulasi
            ? copy.steps.handoffRegulasi.title
            : copy.steps.handoff.title,
          detail: toRegulasi
            ? copy.steps.handoffRegulasi.detail
            : copy.steps.handoff.detail,
          callId: call.id,
          at,
        });
        continue;
      }

      const args = call.args as { lines?: DraftLine[] } | undefined;
      const lines = args?.lines ?? null;
      if (lines) next.proposed = lines;

      const wording = lines?.length
        ? copy.steps.matching(lines.length)
        : copy.steps.matchingNoLines;
      next.steps.push({
        id: nextId(),
        kind: "matching",
        title: wording.title,
        detail: wording.detail,
        callId: call.id,
        at,
      });
      continue;
    }

    // 2. A tool replies. The tax tool carries the grounded assessment; the
    //    ledger tool carries the balance outcome. The check itself is recorded
    //    first, so the story reads match -> check -> outcome.
    if (part.functionResponse) {
      const toolName = part.functionResponse.name;
      const response = (part.functionResponse.response ?? {}) as Record<string, unknown>;

      if (toolName === "classify_kbli") {
        // Only a verified code is recorded; a candidate list is an intermediate
        // step, not a result.
        if (response.status === "success" && response.code) {
          const rec = response as {
            code: string;
            title: string;
            hierarchy?: { level: string; code: string; title: string }[];
          };
          next.kbli = { code: rec.code, title: rec.title, hierarchy: rec.hierarchy };
          next.steps.push({
            id: nextId(),
            kind: "regulasi",
            title: copy.steps.kbliDone.title,
            detail: `${rec.code} — ${rec.title}`,
            at,
          });
        }
        continue;
      }

      if (toolName === "compute_pph_final") {
        if (response.status === "success") {
          next.tax = response as unknown as TaxAssessment;
          next.steps.push({
            id: nextId(),
            kind: "tax",
            title: copy.steps.taxDone.title,
            detail: copy.steps.taxDone.detail,
            at,
          });
        } else {
          next.steps.push({
            id: nextId(),
            kind: "problem",
            title: copy.pajak.agentTitle,
            detail: String(response.error_message ?? copy.problems.fallback),
            at,
          });
        }
        continue;
      }

      // Only the journal tool carries a posting outcome. Everything else —
      // transfer_to_agent, and any tool added later — is matched above or
      // ignored, rather than being mistaken for a commitment result. Assuming
      // "anything not matched is the journal tool" produced a spurious
      // "posting rejected" step on every handoff.
      if (toolName !== "commit_journal_entry") continue;

      const outcome = response as unknown as JournalOutcome;
      next.commit = outcome;

      ensureChecking(next, at);

      if (outcome.status === "success") {
        next.steps.push({
          id: nextId(),
          kind: "posted",
          title: copy.steps.posted.title,
          detail: copy.steps.posted.detail,
          outcome,
          at,
        });
      } else {
        next.steps.push({
          id: nextId(),
          kind: "problem",
          title: copy.steps.problem.title,
          detail: friendlyProblem(outcome.error_message ?? ""),
          outcome,
          at,
        });
      }
      continue;
    }

    // 3. Streamed narration. Agent Fiskal's narration is kept separate so the
    //    tax view can show the tax agent's own words; Keuangan's stays as the
    //    receipt summary. The balance check is shown once, before the outcome.
    //
    //    Each agent's final (non-partial) frame *replaces* what accumulated,
    //    mirroring the tax path. Handling only the partial frames dropped
    //    Keuangan's final wording, so the receipt summary could end up as a
    //    half-sentence while the tax summary was complete.
    if (typeof part.text === "string" && part.text.length > 0) {
      if (event.author === "agent_fiskal") {
        next.taxAnswer = event.partial ? state.taxAnswer + part.text : part.text;
      } else if (typeof event.author === "string" && event.author.includes("regulasi")) {
        // Regulasi's narration is its own; it should not overwrite the receipt
        // summary the owner already read.
      } else {
        next.answer = event.partial ? state.answer + part.text : part.text;
      }
      ensureChecking(next, at);
    }
  }

  return next;
}

/** A step that marks the run as started, shown before any server event lands. */
export function readingStep(): TraceStep {
  return {
    id: nextId(),
    kind: "reading",
    title: copy.steps.reading.title,
    detail: copy.steps.reading.detail,
    at: Date.now() / 1000,
  };
}

/** The two sides of a posting, for the summary strip. */
export function totals(lines: DraftLine[] | null | undefined) {
  const debit = lines?.reduce((sum, line) => sum + (line.debit || 0), 0) ?? 0;
  const credit = lines?.reduce((sum, line) => sum + (line.credit || 0), 0) ?? 0;
  // Must agree with `ledger.entryTotals`, which the guardrail enforces: a
  // posting is only balanced when both sides match *and* carry an amount. An
  // empty list has matching zeroes, and calling that "balanced" would let the
  // trace show a green tick for a posting that was never made.
  return { debit, credit, balanced: debit === credit && debit > 0 };
}
