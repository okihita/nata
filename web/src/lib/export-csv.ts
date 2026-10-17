/**
 * CSV export for the financial statements.
 *
 * The owner's accountant or bank asks for the numbers in a file, so this is the
 * shortest path from what is on screen to something they can actually send.
 * Deliberately dependency-free: the statements are already plain rows here, and
 * a CSV writer is a few lines.
 *
 * Format choices match what Indonesian accounting software expects:
 *  - **Semicolon** delimiter. Excel locale builds where the decimal separator is
 *    a comma treat a comma-delimited file as one column.
 *  - **Indonesian number formatting** (1.234.567) with no thousands separator
 *    ambiguity, because the figures are integers with no decimal part.
 *  - **UTF-8 BOM**, or Excel on Windows renders "Rp" and accented names wrong.
 */

import type { JournalEntry } from "./ledger";
import { balanceSheet, incomeStatement } from "./ledger";

const DELIMITER = ";";
const BOM = "\uFEFF";

/** Quote a field when it contains the delimiter, a quote, or a newline. */
function field(value: string | number): string {
  const text = String(value);
  if (text.includes(DELIMITER) || text.includes('"') || text.includes("\n")) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function row(values: (string | number)[]): string {
  return values.map(field).join(DELIMITER);
}

/** 1234567 -> "1.234.567" (Indonesian grouping, as on screen). */
function idr(value: number): string {
  return new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(Math.round(value));
}

/** The statements as a CSV the owner can hand to their accountant. */
export function statementsToCsv(
  entries: JournalEntry[],
  opts: { periodLabel: string; businessName: string },
): string {
  const income = incomeStatement(entries);
  const bs = balanceSheet(entries);

  const lines: string[] = [];
  lines.push(row(["Nata — Laporan Keuangan"]));
  lines.push(row(["Usaha", opts.businessName]));
  lines.push(row(["Periode", opts.periodLabel]));
  lines.push("");
  lines.push(row(["LAPORAN LABA RUGI"]));
  lines.push(row(["Akun", "Jumlah (IDR)"]));
  for (const r of income.revenue) lines.push(row([r.account, idr(r.amount)]));
  lines.push(row(["Total pendapatan", idr(income.totalRevenue)]));
  for (const r of income.expenses) lines.push(row([r.account, idr(r.amount)]));
  lines.push(row(["Total beban", idr(income.totalExpenses)]));
  lines.push(row(["Laba bersih", idr(income.netIncome)]));
  lines.push("");
  lines.push(row(["LAPORAN POSISI KEUANGAN"]));
  lines.push(row(["Akun", "Jumlah (IDR)"]));
  for (const r of bs.assets) lines.push(row([r.account, idr(r.amount)]));
  lines.push(row(["Total aset", idr(bs.totalAssets)]));
  for (const r of bs.liabilities) lines.push(row([r.account, idr(r.amount)]));
  lines.push(row(["Total liabilitas", idr(bs.totalLiabilities)]));
  for (const r of bs.equity) lines.push(row([r.account, idr(r.amount)]));
  lines.push(row(["Total ekuitas", idr(bs.totalEquity)]));
  lines.push("");
  // State the identity explicitly: this is the figure an accountant checks first.
  lines.push(row(["Aset = Liabilitas + Ekuitas", bs.balanced ? "seimbang" : `selisih ${idr(bs.difference)}`]));

  return BOM + lines.join("\r\n") + "\r\n";
}

/** The journal itself, one line per posting line — for reconciliation. */
export function journalToCsv(entries: JournalEntry[]): string {
  const lines: string[] = [];
  lines.push(row(["Tanggal", "Keterangan", "Akun", "Debit", "Kredit", "Sumber"]));
  for (const entry of entries) {
    for (const line of entry.lines) {
      lines.push(
        row([
          entry.date,
          entry.description,
          line.account,
          line.debit ? idr(line.debit) : "",
          line.credit ? idr(line.credit) : "",
          entry.source,
        ]),
      );
    }
  }
  return BOM + lines.join("\r\n") + "\r\n";
}

/** Trigger a browser download. No-op during SSR. */
export function downloadCsv(filename: string, contents: string): void {
  if (typeof window === "undefined") return;
  const blob = new Blob([contents], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // Revoke on the next tick so the click has been handled.
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

/** A filename that sorts sensibly and says what it is. */
export function reportFilename(businessName: string, periodLabel: string): string {
  const slug = businessName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40) || "usaha";
  const when = periodLabel
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "semua-periode";
  return `nata-${slug}-${when}.csv`;
}
