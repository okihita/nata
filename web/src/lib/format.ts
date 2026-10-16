/** Formatting helpers. Amounts are Indonesian Rupiah (IDR). */

// Indonesian grouping (Rp 1.234.567) — matches how the numbers are written on
// the receipts themselves, so the figures read the same way to a shop owner.
const grouping = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 });

/** 1234567 -> "1.234.567" */
export const idr = (value: number): string => grouping.format(Math.round(value));

/** 1234567 -> "Rp 1.234.567" */
export const idrFull = (value: number): string => `Rp ${idr(value)}`;

export const clockTime = (ts?: number): string =>
  ts ? new Date(ts * 1000).toLocaleTimeString("en-GB", { hour12: false }) : "--:--:--";

export const ms = (value: number): string =>
  value < 1000 ? `${Math.round(value)} ms` : `${(value / 1000).toFixed(1)} s`;

/** Turn a snake_case tool name into a readable label. */
export const humanize = (value: string): string =>
  value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
