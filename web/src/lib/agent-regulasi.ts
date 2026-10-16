"use client";

/**
 * Agent Regulasi transport for the console.
 *
 * The Perizinan screen is driven by the agent, not by a local lookup table: we
 * describe what the business does, Agent Regulasi returns candidate KBLI codes
 * from the shipped catalogue, then verifies the chosen one. Every code shown
 * comes from the tool's own grounded result, and the official title is the
 * tool's verbatim quote — the same discipline as the tax screen.
 */

import { APP_NAME, ensureSession, streamRun, type AdkEvent } from "./adk";

/**
 * Agent Regulasi is served as its own ADK app (`nata_regulasi`), not through the
 * cascade entry point. The cascade root is Agent Keuangan, which has no
 * `classify_kbli` tool — asking it to classify produced a hallucinated code.
 * Talking to the app that owns the tool removes that failure mode entirely.
 */
const REGULASI_APP = "nata_regulasi";

const USER_ID = "web-console";
const SESSION_KEY = "nata.regulasi.session";
const CACHE_KEY = "nata.regulasi.run.v1";

export interface KbliCandidate {
  code: string;
  title: string;
  desc: string;
}

export interface KbliVerdict {
  status: string;
  code: string;
  title: string;
  description?: string;
  source: string;
  file: string;
  title_verbatim: boolean;
  /** Ancestors from division down to the subclass — real taxonomy, not decoration. */
  hierarchy?: { level: string; code: string; title: string }[];
  /** null by design: KBLI carries no risk tier, so nothing is invented. */
  risk_level: string | null;
  risk_note: string;
}

export interface RegulasiRun {
  /** The verified code, once the agent has confirmed one. */
  verdict: KbliVerdict | null;
  /** Candidates the agent saw, as grounded by the tool. */
  candidates: KbliCandidate[];
  answer: string;
  latencyMs: number;
  error: string | null;
}

/**
 * Ask Agent Regulasi to classify the business's activities into a KBLI 2020
 * code. The description is passed explicitly so the classification reflects
 * what the owner actually does, not a guess from the receipt alone.
 */
export async function runRegulasi(opts: {
  description: string;
  entity?: string;
}): Promise<RegulasiRun> {  const started = performance.now();
  const sessionId = await ensureSession(
    USER_ID,
    typeof window === "undefined" ? null : window.localStorage.getItem(SESSION_KEY),
    REGULASI_APP,
  );
  if (typeof window !== "undefined") window.localStorage.setItem(SESSION_KEY, sessionId);

  let verdict: KbliVerdict | null = null;
  let candidates: KbliCandidate[] = [];
  let streamed = "";
  let finalText = "";

  const entityNote = opts.entity ? ` Bentuk badan usaha: ${opts.entity}.` : "";
  const prompt =
    `Tentukan kode KBLI 2020 untuk usaha saya. ` +
    `Kegiatan usahanya: "${opts.description}".${entityNote} ` +
    `Panggil classify_kbli dengan deskripsi itu untuk melihat kandidat, ` +
    `pilih satu, lalu panggil classify_kbli lagi dengan kodenya untuk ` +
    `memverifikasi. Jangan mengarang kode KBLI dari ingatan — hanya kode ` +
    `yang dikembalikan tool yang boleh dilaporkan. Laporkan kode dan judul ` +
    `resminya, dan sebutkan bahwa tingkat risiko perlu dicek di OSS-RBA.`;

  await streamRun(
    {
      appName: REGULASI_APP,
      userId: USER_ID,
      sessionId,
      streaming: true,
      newMessage: { role: "user", parts: [{ text: prompt }] },
    },
    (event: AdkEvent) => {
      for (const part of event.content?.parts ?? []) {
        const response = part.functionResponse?.response as
          | Record<string, unknown>
          | undefined;
        if (part.functionResponse?.name === "classify_kbli" && response) {
          if (response.status === "success" && response.code && response.title) {
            // A verified code — the tool confirmed it exists in the catalogue.
            verdict = response as unknown as KbliVerdict;
          }
          if (Array.isArray(response.candidates)) {
            candidates = response.candidates as KbliCandidate[];
          }
        }
        if (typeof part.text === "string" && part.text.length > 0) {
          if (event.partial) streamed += part.text;
          else finalText = part.text;
        }
      }
    },
  );

  return {
    verdict,
    candidates,
    answer: streamed || finalText,
    latencyMs: Math.round(performance.now() - started),
    error: null,
  };
}

/** Persist the last classification so the screen survives a reload. */
export function cacheRegulasi(run: RegulasiRun): void {
  current = run;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(CACHE_KEY, JSON.stringify(run));
    } catch {
      /* storage unavailable — the screen simply re-runs */
    }
  }
  emit();
}

// ── External store (read by useSyncExternalStore) ───────────────────────────

let current: RegulasiRun | null = null;
const listeners = new Set<() => void>();

function emit(): void {
  for (const listener of listeners) listener();
}

export function subscribeRegulasi(callback: () => void): () => void {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

export function getRegulasiSnapshot(): RegulasiRun | null {
  return current;
}

export function getServerRegulasiSnapshot(): null {
  return null;
}

/** Load the persisted classification into the store (call once, client-side). */
export function primeRegulasiStore(): void {
  current = readCachedRegulasi();
  emit();
}

export function readCachedRegulasi(): RegulasiRun | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as RegulasiRun;
    return parsed?.verdict?.code ? parsed : null;
  } catch {
    return null;
  }
}

/** Clear the cached classification (e.g. after the business profile changes). */
export function clearRegulasi(): void {
  current = null;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(CACHE_KEY);
    } catch {
      /* ignore */
    }
  }
  emit();
}
