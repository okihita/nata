/**
 * Trace-reduction tests.
 *
 * `reduceEvent` turns the raw ADK event stream into the steps the owner reads on
 * the Catat screen. Two real bugs lived here and neither was covered:
 *
 *  1. Every handoff produced a spurious "posting rejected" step, because the
 *     handler assumed any unmatched `functionResponse` was the journal tool.
 *  2. "Mencari kode KBLI" appeared twice, because one tool serves two acts
 *     (propose candidates, then verify a code) and both were labelled alike.
 *
 * Both were invisible to the Python suite and obvious in a screenshot. These
 * tests pin the behaviour so they stay fixed.
 *
 * The module under test is React-free and its only imports are types plus
 * `copy`, so Node's built-in runner can load it directly.
 */

import { test } from "node:test";
import assert from "node:assert/strict";

import { emptyRun, reduceEvent, totals, readingStep } from "../src/lib/trace.ts";
import { copy } from "../src/lib/copy.ts";

const at = 1_700_000_000;

/** A function-call frame as the ADK server emits it. */
function call(name: string, args: Record<string, unknown> = {}, id = "c1") {
  return {
    content: { role: "model", parts: [{ functionCall: { id, name, args } }] },
    timestamp: at,
  } as never;
}

/** A function-response frame. */
function response(name: string, payload: Record<string, unknown>) {
  return {
    content: { role: "user", parts: [{ functionResponse: { name, response: payload } }] },
    timestamp: at,
  } as never;
}

function text(value: string, author = "agent_keuangan", partial = false) {
  return {
    author,
    partial,
    content: { parts: [{ text: value }] },
    timestamp: at,
  } as never;
}

const titles = (s: ReturnType<typeof reduceEvent>) => s.steps.map((x) => x.title);
const kinds = (s: ReturnType<typeof reduceEvent>) => s.steps.map((x) => x.kind);

// ── The handoff must not look like a rejection ──────────────────────────────

test("a handoff adds a handoff step, never a problem step", () => {
  let s = reduceEvent(emptyRun, call("transfer_to_agent", { agent_name: "agent_fiskal" }));
  // The server replies to the transfer; that reply must not be read as a posting.
  s = reduceEvent(s, response("transfer_to_agent", { status: "success" }));

  assert.ok(kinds(s).includes("handoff"), "expected a handoff step");
  assert.ok(
    !kinds(s).includes("problem"),
    `transfer must not produce a problem step, got: ${titles(s).join(" | ")}`,
  );
  assert.equal(s.commit, null, "a transfer is not a journal commitment");
});

test("the two hops are worded differently", () => {
  const toFiskal = reduceEvent(emptyRun, call("transfer_to_agent", { agent_name: "agent_fiskal" }, "h1"));
  const toRegulasi = reduceEvent(emptyRun, call("transfer_to_agent", { agent_name: "agent_regulasi" }, "h2"));
  assert.notEqual(
    titles(toFiskal)[0],
    titles(toRegulasi)[0],
    "the tax handoff and the licensing handoff should not read identically",
  );
});

// ── One tool, two acts ─────────────────────────────────────────────────────

test("searching and verifying a KBLI are labelled differently", () => {
  const search = reduceEvent(emptyRun, call("classify_kbli", { description: "warung kopi" }, "k1"));
  const verify = reduceEvent(emptyRun, call("classify_kbli", { code: "56102" }, "k2"));

  assert.notEqual(
    titles(search)[0],
    titles(verify)[0],
    "proposing candidates and verifying a code must not share a label",
  );
});

test("only a verified code is recorded as the result", () => {
  const candidates = reduceEvent(
    emptyRun,
    response("classify_kbli", { status: "success", candidates: [{ code: "56102" }] }),
  );
  assert.equal(candidates.kbli, null, "a candidate list is not a verified code");

  const verified = reduceEvent(
    emptyRun,
    response("classify_kbli", { status: "success", code: "56102", title: "Rumah/Warung Makan" }),
  );
  assert.deepEqual(verified.kbli, { code: "56102", title: "Rumah/Warung Makan", hierarchy: undefined });
});

test("a rejected KBLI is not recorded", () => {
  const s = reduceEvent(
    emptyRun,
    response("classify_kbli", { status: "error", error_message: "not in catalogue" }),
  );
  assert.equal(s.kbli, null);
  assert.ok(!kinds(s).includes("regulasi"), "an error should not become a result step");
});

test("verifying a second code replaces the first, not appends to it", () => {
  // Observed live: the agent verified 56303 then 56102, and the trace showed
  // two contradictory steps both labelled "Kode KBLI terverifikasi".
  let s = reduceEvent(
    emptyRun,
    response("classify_kbli", { status: "success", code: "56303", title: "Rumah Minum/Kafe" }),
  );
  s = reduceEvent(
    s,
    response("classify_kbli", { status: "success", code: "56102", title: "Rumah/Warung Makan" }),
  );

  const done = s.steps.filter((x) => x.title === copy.steps.kbliDone.title);
  assert.equal(done.length, 1, `expected one verified step, got ${done.length}`);
  assert.deepEqual(s.kbli?.code, "56102", "the latest verification is the result");
  assert.ok(
    (done[0].detail ?? "").includes("56102"),
    "the surviving step must describe the final code",
  );
});

// ── Journal outcomes ───────────────────────────────────────────────────────

test("a balanced commit becomes a posted step", () => {
  const s = reduceEvent(
    emptyRun,
    response("commit_journal_entry", {
      status: "success",
      description: "Pembelian perlengkapan",
      lines: [
        { account: "Beban Perlengkapan", debit: 100_000, credit: 0 },
        { account: "Kas", debit: 0, credit: 100_000 },
      ],
      total_debit: 100_000,
      total_credit: 100_000,
    }),
  );
  assert.ok(kinds(s).includes("posted"), titles(s).join(" | "));
  assert.equal(s.commit?.status, "success");
});

test("an unbalanced entry is reported as a problem, in plain language", () => {
  const s = reduceEvent(
    emptyRun,
    response("commit_journal_entry", {
      status: "error",
      error_message: "unbalanced journal entry: total debits (100.00) != total credits (90.00)",
    }),
  );
  assert.ok(kinds(s).includes("problem"));
  // The raw rule text must not be shown to a shop owner verbatim.
  assert.ok(
    !s.steps.some((x) => (x.detail ?? "").includes("unbalanced journal entry")),
    "raw validator text leaked into the UI copy",
  );
});

// ── Duplicate frames ───────────────────────────────────────────────────────

test("identical frames for one call do not duplicate a step", () => {
  const frame = call("classify_kbli", { description: "warung kopi" }, "same-id");
  let s = reduceEvent(emptyRun, frame);
  s = reduceEvent(s, frame);
  s = reduceEvent(s, frame);
  assert.equal(s.steps.length, 1, `expected one step, got ${s.steps.length}`);
});

// ── Small helpers ──────────────────────────────────────────────────────────

test("the reading step marks the run as started", () => {
  const step = readingStep();
  assert.equal(step.kind, "reading");
  assert.ok(step.title.length > 0);
});

test("totals reports balance only for a real, balanced posting", () => {
  assert.deepEqual(
    totals([
      { account: "Kas", debit: 100, credit: 0 },
      { account: "Pendapatan", debit: 0, credit: 100 },
    ]),
    { debit: 100, credit: 100, balanced: true },
  );
  assert.equal(
    totals([
      { account: "Kas", debit: 100, credit: 0 },
      { account: "Pendapatan", debit: 0, credit: 90 },
    ]).balanced,
    false,
  );
  assert.equal(totals([]).balanced, false, "an empty posting is not balanced");
  assert.equal(totals(null).balanced, false);
});

test("agent narration is kept apart from the receipt summary", () => {
  let s = reduceEvent(emptyRun, text("Struk terbaca: 2 baris.", "agent_keuangan"));
  s = reduceEvent(s, text("PPh Final Rp0 — Pasal 60 ayat (2).", "agent_fiskal"));
  assert.ok(s.answer.includes("Struk terbaca"), "the receipt summary belongs in answer");
  assert.ok(s.taxAnswer.includes("Pasal 60"), "the tax narrative belongs in taxAnswer");
  assert.ok(
    !s.answer.includes("Pasal 60"),
    "the tax narrative must not overwrite the receipt summary",
  );
});
