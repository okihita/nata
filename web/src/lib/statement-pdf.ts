/**
 * Printable financial statement HTML and PDF generator.
 *
 * Formatted cleanly in accordance with SAK EMKM:
 * - Laporan Posisi Keuangan (Balance Sheet)
 * - Laporan Laba Rugi (Income Statement)
 * - Catatan atas Laporan Keuangan (CALK)
 *
 * Designed to open in a new tab with @media print CSS so users can
 * immediately view, review, and print or save as PDF via browser print dialog.
 */

import type { JournalEntry } from "./ledger";
import { balanceSheet, incomeStatement } from "./ledger";

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export interface StatementPdfOptions {
  businessName: string;
  businessAddress?: string;
  npwp?: string;
  nib?: string;
  periodLabel: string;
  calkPoints?: readonly string[];
  locale?: string;
}

export function generateStatementHtml(
  entries: JournalEntry[],
  options: StatementPdfOptions
): string {
  const income = incomeStatement(entries);
  const bs = balanceSheet(entries);
  const isEn = options.locale === "en";

  const t = {
    title: isEn ? "FINANCIAL STATEMENTS" : "LAPORAN KEUANGAN",
    standard: "SAK EMKM (Standar Akuntansi Keuangan Entitas Mikro, Kecil, dan Menengah)",
    period: isEn ? "Period" : "Periode",
    dateGenerated: isEn ? "Generated Date" : "Tanggal Cetak",
    incomeStatement: isEn ? "STATEMENT OF PROFIT OR LOSS" : "LAPORAN LABA RUGI",
    balanceSheet: isEn ? "STATEMENT OF FINANCIAL POSITION" : "LAPORAN POSISI KEUANGAN",
    calk: isEn ? "NOTES TO FINANCIAL STATEMENTS (CALK)" : "CATATAN ATAS LAPORAN KEUANGAN",
    revenue: isEn ? "Revenue" : "Pendapatan",
    expenses: isEn ? "Operating Expenses" : "Beban Operasional",
    totalRevenue: isEn ? "Total Revenue" : "Total Pendapatan",
    totalExpenses: isEn ? "Total Expenses" : "Total Beban",
    netIncome: isEn ? "Net Income (Loss)" : "Laba (Rugi) Bersih",
    assets: isEn ? "Assets" : "Aset",
    totalAssets: isEn ? "Total Assets" : "Total Aset",
    liabilities: isEn ? "Liabilities" : "Liabilitas",
    totalLiabilities: isEn ? "Total Liabilities" : "Total Liabilitas",
    equity: isEn ? "Equity" : "Ekuitas",
    totalEquity: isEn ? "Total Equity" : "Total Ekuitas",
    totalLiabEquity: isEn ? "Total Liabilities & Equity" : "Total Liabilitas dan Ekuitas",
    balanced: isEn ? "Balanced (Assets = Liabilities + Equity)" : "Seimbang (Aset = Liabilitas + Ekuitas)",
    unbalanced: isEn ? "Variance Detected" : "Selisih Terdeteksi",
    printBtn: isEn ? "Print / Save PDF" : "Cetak / Simpan PDF",
    closeBtn: isEn ? "Close" : "Tutup",
    empty: isEn ? "No records in this section." : "Tidak ada catatan.",
  };

  const calkPoints = options.calkPoints || [
    "Laporan keuangan disusun dengan dasar akrual dan metode biaya perolehan historis sesuai SAK EMKM.",
    "Aset tetap dicatat sebesar harga perolehan dan disusutkan menggunakan metode garis lurus.",
    "Perhitungan pajak penghasilan mengikuti ketentuan PP No. 55 Tahun 2022 (PPh Final UMKM 0,5%).",
  ];

  const currentDate = new Date().toLocaleDateString(isEn ? "en-US" : "id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return `<!DOCTYPE html>
<html lang="${isEn ? "en" : "id"}">
<head>
  <meta charset="utf-8">
  <title>${options.businessName} - ${t.title} (${options.periodLabel})</title>
  <style>
    @page {
      size: A4;
      margin: 1.5cm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #111827;
      background: #f9fafb;
      font-size: 11pt;
      line-height: 1.5;
      padding: 24px;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      background: #ffffff;
      padding: 40px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    }
    .action-bar {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-bottom: 24px;
      max-width: 800px;
      margin-left: auto;
      margin-right: auto;
    }
    .btn {
      padding: 8px 16px;
      font-size: 13px;
      font-weight: 600;
      border-radius: 6px;
      cursor: pointer;
      border: none;
      transition: background 0.2s;
    }
    .btn-primary {
      background: #0f172a;
      color: #ffffff;
    }
    .btn-primary:hover {
      background: #334155;
    }
    .btn-secondary {
      background: #e2e8f0;
      color: #1e293b;
    }
    .header {
      text-align: center;
      border-bottom: 2px solid #0f172a;
      padding-bottom: 16px;
      margin-bottom: 24px;
    }
    .header h1 {
      font-size: 18pt;
      font-weight: 700;
      letter-spacing: -0.02em;
      color: #0f172a;
      text-transform: uppercase;
    }
    .header h2 {
      font-size: 13pt;
      font-weight: 600;
      color: #475569;
      margin-top: 4px;
    }
    .header .meta {
      font-size: 9.5pt;
      color: #64748b;
      margin-top: 6px;
    }
    .section-title {
      font-size: 12pt;
      font-weight: 700;
      color: #0f172a;
      border-bottom: 1.5px solid #cbd5e1;
      padding-bottom: 4px;
      margin-top: 24px;
      margin-bottom: 12px;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }
    .subsection-title {
      font-size: 10pt;
      font-weight: 700;
      color: #334155;
      margin-top: 10px;
      margin-bottom: 4px;
      text-transform: uppercase;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 12px;
      font-size: 10pt;
    }
    th, td {
      padding: 5px 8px;
      text-align: left;
    }
    th {
      border-bottom: 1px solid #cbd5e1;
      font-weight: 600;
      color: #475569;
    }
    td.amount, th.amount {
      text-align: right;
      font-variant-numeric: tabular-nums;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    }
    .total-row td {
      border-top: 1px solid #94a3b8;
      font-weight: 700;
      color: #0f172a;
      padding-top: 6px;
      padding-bottom: 6px;
    }
    .grand-total td {
      border-top: 1.5px solid #0f172a;
      border-bottom: 2px double #0f172a;
      font-weight: 800;
      color: #0f172a;
      font-size: 10.5pt;
      padding-top: 8px;
      padding-bottom: 8px;
    }
    .badge {
      display: inline-block;
      font-size: 8.5pt;
      font-weight: 600;
      padding: 3px 8px;
      border-radius: 4px;
      margin-top: 8px;
    }
    .badge-success {
      background: #dcfce7;
      color: #166534;
      border: 1px solid #bbf7d0;
    }
    .badge-danger {
      background: #fee2e2;
      color: #991b1b;
      border: 1px solid #fecaca;
    }
    .calk-list {
      padding-left: 20px;
      margin-top: 8px;
      color: #334155;
      font-size: 9.5pt;
    }
    .calk-list li {
      margin-bottom: 6px;
    }
    .footer {
      margin-top: 36px;
      padding-top: 16px;
      border-top: 1px solid #e2e8f0;
      font-size: 8.5pt;
      color: #94a3b8;
      display: flex;
      justify-content: space-between;
    }
    @media print {
      body {
        background: #ffffff;
        padding: 0;
      }
      .action-bar {
        display: none !important;
      }
      .container {
        border: none;
        box-shadow: none;
        padding: 0;
        max-width: 100%;
      }
      .page-break {
        page-break-before: always;
      }
    }
  </style>
</head>
<body>
  <div class="action-bar">
    <button class="btn btn-secondary" onclick="window.close()">${t.closeBtn}</button>
    <button class="btn btn-primary" onclick="window.print()">${t.printBtn}</button>
  </div>

  <div class="container">
    <div class="header">
      <h1>${options.businessName}</h1>
      <h2>${t.title}</h2>
      <div class="meta">
        ${options.businessAddress ? `<span>${options.businessAddress}</span> • ` : ""}
        ${options.npwp ? `<span>NPWP: ${options.npwp}</span> • ` : ""}
        ${options.nib ? `<span>NIB: ${options.nib}</span> • ` : ""}
        <span>${t.period}: <strong>${options.periodLabel}</strong></span>
      </div>
      <div class="meta" style="font-size: 8.5pt; margin-top: 4px;">
        ${t.standard}
      </div>
    </div>

    <!-- 1. LAPORAN LABA RUGI -->
    <div class="section-title">${t.incomeStatement}</div>
    
    <div class="subsection-title">${t.revenue}</div>
    <table>
      ${
        income.revenue.length > 0
          ? income.revenue.map(r => `<tr><td>${r.account}</td><td class="amount">${formatRupiah(r.amount)}</td></tr>`).join("")
          : `<tr><td colspan="2" style="color: #94a3b8; font-style: italic;">${t.empty}</td></tr>`
      }
      <tr class="total-row">
        <td>${t.totalRevenue}</td>
        <td class="amount">${formatRupiah(income.totalRevenue)}</td>
      </tr>
    </table>

    <div class="subsection-title">${t.expenses}</div>
    <table>
      ${
        income.expenses.length > 0
          ? income.expenses.map(r => `<tr><td>${r.account}</td><td class="amount">${formatRupiah(r.amount)}</td></tr>`).join("")
          : `<tr><td colspan="2" style="color: #94a3b8; font-style: italic;">${t.empty}</td></tr>`
      }
      <tr class="total-row">
        <td>${t.totalExpenses}</td>
        <td class="amount">${formatRupiah(income.totalExpenses)}</td>
      </tr>
      <tr class="grand-total">
        <td>${t.netIncome}</td>
        <td class="amount" style="${income.netIncome >= 0 ? "color: #166534;" : "color: #991b1b;"}">
          ${formatRupiah(income.netIncome)}
        </td>
      </tr>
    </table>

    <!-- 2. LAPORAN POSISI KEUANGAN -->
    <div class="section-title" style="margin-top: 32px;">${t.balanceSheet}</div>

    <div class="subsection-title">${t.assets}</div>
    <table>
      ${
        bs.assets.length > 0
          ? bs.assets.map(r => `<tr><td>${r.account}</td><td class="amount">${formatRupiah(r.amount)}</td></tr>`).join("")
          : `<tr><td colspan="2" style="color: #94a3b8; font-style: italic;">${t.empty}</td></tr>`
      }
      <tr class="grand-total">
        <td>${t.totalAssets}</td>
        <td class="amount">${formatRupiah(bs.totalAssets)}</td>
      </tr>
    </table>

    <div class="subsection-title">${t.liabilities}</div>
    <table>
      ${
        bs.liabilities.length > 0
          ? bs.liabilities.map(r => `<tr><td>${r.account}</td><td class="amount">${formatRupiah(r.amount)}</td></tr>`).join("")
          : `<tr><td colspan="2" style="color: #94a3b8; font-style: italic;">${t.empty}</td></tr>`
      }
      <tr class="total-row">
        <td>${t.totalLiabilities}</td>
        <td class="amount">${formatRupiah(bs.totalLiabilities)}</td>
      </tr>
    </table>

    <div class="subsection-title">${t.equity}</div>
    <table>
      ${
        bs.equity.length > 0
          ? bs.equity.map(r => `<tr><td>${r.account}</td><td class="amount">${formatRupiah(r.amount)}</td></tr>`).join("")
          : `<tr><td colspan="2" style="color: #94a3b8; font-style: italic;">${t.empty}</td></tr>`
      }
      <tr class="total-row">
        <td>${t.totalEquity}</td>
        <td class="amount">${formatRupiah(bs.totalEquity)}</td>
      </tr>
      <tr class="grand-total">
        <td>${t.totalLiabEquity}</td>
        <td class="amount">${formatRupiah(bs.totalLiabilities + bs.totalEquity)}</td>
      </tr>
    </table>

    <div>
      <span class="badge ${bs.balanced ? "badge-success" : "badge-danger"}">
        ${bs.balanced ? t.balanced : `${t.unbalanced} (${formatRupiah(bs.difference)})`}
      </span>
    </div>

    <!-- 3. CATATAN ATAS LAPORAN KEUANGAN (CALK) -->
    <div class="section-title" style="margin-top: 32px;">${t.calk}</div>
    <ul class="calk-list">
      ${calkPoints.map(p => `<li>${p}</li>`).join("")}
    </ul>

    <div class="footer">
      <span>Nata — Autonomous MSME Accounting System</span>
      <span>${t.dateGenerated}: ${currentDate}</span>
    </div>
  </div>
</body>
</html>`;
}

/** Open the printable statement document in a new tab for reading and printing. */
export function openStatementPdfInNewTab(
  entries: JournalEntry[],
  options: StatementPdfOptions
): void {
  if (typeof window === "undefined") return;
  const html = generateStatementHtml(entries, options);
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, "_blank");
  if (!win) {
    // If pop-up blocked, fallback to normal navigation
    window.location.href = url;
  }
}
