/**
 * ADK transport layer.
 *
 * The browser never talks to the ADK server directly — every call goes through
 * the same-origin proxy at `/api/adk/*` (see app/api/adk/[...path]/route.ts),
 * which forwards to the Python backend. That keeps CORS out of the picture and
 * gives us one place to point at a deployed Cloud Run URL later.
 */

export const ADK_BASE = "/api/adk";
export const APP_NAME = "nata_agent";

/** One Server-Sent Event frame emitted by POST /run_sse. */
export interface AdkEvent {
  id?: string;
  author?: string;
  timestamp?: number;
  partial?: boolean;
  modelVersion?: string;
  finishReason?: string;
  usageMetadata?: Record<string, number>;
  nodeInfo?: { path?: string };
  /** Routing metadata; set on the frame that performs a sub-agent handoff. */
  actions?: { transferToAgent?: string; transferReason?: string };
  errorCode?: string;
  errorMessage?: string;
  content?: {
    role?: string;
    parts?: AdkPart[];
  };
}

export interface AdkPart {
  text?: string;
  functionCall?: { id?: string; name?: string; args?: Record<string, unknown> };
  functionResponse?: { id?: string; name?: string; response?: Record<string, unknown> };
}

export interface RunRequest {
  appName: string;
  userId: string;
  sessionId: string;
  newMessage: { role: "user"; parts: AdkPart[] };
  streaming: boolean;
}

/** The journal entry that `commit_journal_entry` accepted (or rejected). */
export interface JournalLine {
  account: string;
  debit: number;
  credit: number;
}

export interface JournalCommit {
  status: "success";
  message: string;
  description: string;
  lines: JournalLine[];
  total_debit: number;
  total_credit: number;
  balanced: boolean;
  accounting_equation: string;
}

export interface JournalRejection {
  status: "error";
  error_message: string;
}

export type JournalOutcome = JournalCommit | JournalRejection;

/** One grounded statutory reference returned by `compute_pph_final`. */
export interface TaxCitation {
  article: string;
  label: string;
  quote: string;
  source: string;
  file: string;
}

/**
 * The result of Agent Fiskal's `compute_pph_final` tool (PP 55/2022). Every
 * figure the agent reports is paired with the Pasal/Ayat that grounds it.
 */
export interface TaxAssessment {
  status: "success";
  taxpayer: "orang_pribadi" | "badan";
  taxpayer_label: string;
  scheme: string;
  turnover: number;
  exemption_applied: number;
  taxable_base: number;
  rate: number;
  rate_percent: string;
  payable: number;
  exemption_remaining: number;
  over_ceiling: boolean;
  year: number;
  months: number;
  monthly_estimate: number;
  citations: TaxCitation[];
  summary: string;
}

async function json<T>(res: Response): Promise<T> {
  const text = await res.text();
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(`Expected JSON, got: ${text.slice(0, 200)}`);
  }
}

/**
 * Reuse `sessionId` if the backend still knows it, otherwise open a fresh
 * session. Sessions carry the conversation + ledger state for one user.
 */
export async function ensureSession(
  userId: string,
  existing?: string | null,
): Promise<string> {
  if (existing) {
    const probe = await fetch(
      `${ADK_BASE}/apps/${APP_NAME}/users/${userId}/sessions/${existing}`,
      { cache: "no-store" },
    );
    if (probe.ok) return existing;
  }

  const res = await fetch(`${ADK_BASE}/apps/${APP_NAME}/users/${userId}/sessions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{}",
  });
  if (!res.ok) {
    throw new Error(`Could not create session (HTTP ${res.status}). Is the ADK server running?`);
  }
  const session = await json<{ id: string }>(res);
  return session.id;
}

/**
 * POST /run_sse and invoke `onEvent` for each decoded frame until the stream
 * closes. Resolves when the agent has finished the invocation.
 */
export async function streamRun(
  payload: RunRequest,
  onEvent: (event: AdkEvent) => void,
  signal?: AbortSignal,
): Promise<void> {
  const res = await fetch(`${ADK_BASE}/run_sse`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "text/event-stream" },
    body: JSON.stringify(payload),
    signal,
  });

  if (!res.ok || !res.body) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Agent run failed (HTTP ${res.status}). ${detail.slice(0, 300)}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    // SSE frames are separated by a blank line.
    let boundary = buffer.indexOf("\n\n");
    while (boundary !== -1) {
      const frame = buffer.slice(0, boundary);
      buffer = buffer.slice(boundary + 2);
      const dataLine = frame
        .split("\n")
        .find((line) => line.startsWith("data:"));
      if (dataLine) {
        const raw = dataLine.slice(5).trim();
        if (raw) {
          try {
            onEvent(JSON.parse(raw) as AdkEvent);
          } catch {
            /* ignore keepalive / non-JSON frames */
          }
        }
      }
      boundary = buffer.indexOf("\n\n");
    }
  }
}
