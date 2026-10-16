"use client";

/**
 * Agent Fiskal transport for the console.
 *
 * The Pajak screen is driven by the *agent*, not by a local formula: we ask
 * Agent Fiskal to assess the ledger's turnover, it calls `compute_pph_final`,
 * and we surface the tool's own grounded result (figures + verbatim Pasal/Ayat
 * citations). The latest assessment is cached by turnover so the Pajak screen
 * can show it instantly after a receipt is recorded on the Catat screen.
 */

import { APP_NAME, ensureSession, streamRun, type AdkEvent, type TaxAssessment } from "./adk";

const USER_ID = "web-console";
const SESSION_KEY = "nata.pajak.session";
const CACHE_KEY = "nata.pajak.assessment.v1";

export interface FiskalRun {
  tax: TaxAssessment | null;
  answer: string;
  latencyMs: number;
  error: string | null;
}

/**
 * Ask Agent Fiskal to assess a given gross turnover. The turnover is passed
 * explicitly so the agent assesses exactly the figure the ledger shows, and the
 * tax tool stays the deterministic source of truth for the arithmetic.
 */
export async function runFiskal(opts: {
  turnover: number;
  individual?: boolean;
}): Promise<FiskalRun> {
  const started = performance.now();
  const individual = opts.individual ?? true;
  const sessionId = await ensureSession(
    USER_ID,
    typeof window === "undefined" ? null : window.localStorage.getItem(SESSION_KEY),
  );
  if (typeof window !== "undefined") window.localStorage.setItem(SESSION_KEY, sessionId);

  let tax: TaxAssessment | null = null;
  let streamed = "";
  let finalText = "";

  const prompt =
    `Hitung PPh Final UMKM untuk usaha saya. ` +
    `Peredaran bruto (omzet) menurut pembukuan: ${opts.turnover} rupiah. ` +
    `Jenis wajib pajak: ${individual ? "orang pribadi" : "badan"}. ` +
    `Panggil compute_pph_final dengan angka omzet itu dan jenis wajib pajak itu, ` +
    `lalu laporkan hasilnya beserta kutipan Pasal/Ayat untuk setiap angka.`;

  await streamRun(
    {
      appName: APP_NAME,
      userId: USER_ID,
      sessionId,
      streaming: true,
      newMessage: { role: "user", parts: [{ text: prompt }] },
    },
    (event: AdkEvent) => {
      for (const part of event.content?.parts ?? []) {
        const response = part.functionResponse?.response as
          | (TaxAssessment & { status?: string })
          | undefined;
        if (part.functionResponse?.name === "compute_pph_final" && response?.status === "success") {
          tax = response as TaxAssessment;
        }
        if (typeof part.text === "string" && part.text.length > 0) {
          if (event.partial) streamed += part.text;
          else finalText = part.text;
        }
      }
    },
  );

  return {
    tax,
    answer: streamed || finalText,
    latencyMs: Math.round(performance.now() - started),
    error: null,
  };
}

/** Persist the latest assessment so the Pajak screen can show it without a run. */
export function cacheTax(tax: TaxAssessment): void {
  current = tax;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(CACHE_KEY, JSON.stringify(tax));
    } catch {
      /* storage unavailable — the screen simply falls back to the estimate */
    }
  }
  emit();
}

/** Read the cached assessment, but only if it matches the current turnover. */
export function readCachedTax(turnover: number): TaxAssessment | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as TaxAssessment;
    if (parsed?.status !== "success") return null;
    // Stale if the ledger's turnover has moved since the assessment.
    if (Math.round(parsed.turnover) !== Math.round(turnover)) return null;
    return parsed;
  } catch {
    return null;
  }
}

// ── External store (read by useSyncExternalStore) ───────────────────────────
// The Pajak screen reads the cached assessment through an external store rather
// than syncing state inside an effect, which keeps it free of cascading renders.

let current: TaxAssessment | null = null;
const listeners = new Set<() => void>();

function emit(): void {
  for (const listener of listeners) listener();
}

/** Subscribe to cache changes (no-op on the server). */
export function subscribeTax(callback: () => void): () => void {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

/** Client snapshot: the last cached assessment, or null. */
export function getTaxSnapshot(): TaxAssessment | null {
  return current;
}

/** Server snapshot: always null, so SSR and first client paint agree. */
export function getServerTaxSnapshot(): null {
  return null;
}

/**
 * Load the persisted assessment into the store (call once, client-side). This
 * is a side effect on a module store — not React state — so it does not trip
 * the set-state-in-effect rule; subscribers are notified via ``emit``.
 */
export function primeTaxStore(): void {
  current = readCachedTaxRaw();
  emit();
}

function readCachedTaxRaw(): TaxAssessment | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as TaxAssessment;
    return parsed?.status === "success" ? parsed : null;
  } catch {
    return null;
  }
}
