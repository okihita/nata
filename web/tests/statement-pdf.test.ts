import test from "node:test";
import assert from "node:assert/strict";
import { generateStatementHtml } from "../src/lib/statement-pdf";
import type { JournalEntry } from "../src/lib/ledger";

const sampleEntries: JournalEntry[] = [
  {
    id: "entry-01",
    date: "2026-10-16",
    description: "Penjualan tunai produk",
    lines: [
      { account: "Kas", debit: 5000000, credit: 0 },
      { account: "Pendapatan Usaha", debit: 0, credit: 5000000 },
    ],
    source: "ocr",
    createdAt: "2026-10-16T10:00:00Z",
  },
  {
    id: "entry-02",
    date: "2026-10-17",
    description: "Beli perlengkapan toko",
    lines: [
      { account: "Beban Perlengkapan", debit: 1200000, credit: 0 },
      { account: "Kas", debit: 0, credit: 1200000 },
    ],
    source: "manual",
    createdAt: "2026-10-17T11:00:00Z",
  },
];

test("generateStatementHtml produces SAK EMKM formatted printable document", () => {
  const html = generateStatementHtml(sampleEntries, {
    businessName: "PT Seduh Rasa Nusantara",
    businessAddress: "Jl. Merdeka No. 10",
    npwp: "01.234.567.8-901.000",
    nib: "9120001234567",
    periodLabel: "Oktober 2026",
    locale: "id",
  });

  // Contains business metadata
  assert.ok(html.includes("PT Seduh Rasa Nusantara"));
  assert.ok(html.includes("Oktober 2026"));
  assert.ok(html.includes("NPWP: 01.234.567.8-901.000"));
  assert.ok(html.includes("NIB: 9120001234567"));

  // Contains both financial statements
  assert.ok(html.includes("LAPORAN LABA RUGI"));
  assert.ok(html.includes("LAPORAN POSISI KEUANGAN"));
  assert.ok(html.includes("CATATAN ATAS LAPORAN KEUANGAN"));

  // Check accounting balance check
  assert.ok(html.includes("Seimbang"));

  // Check print media action buttons
  assert.ok(html.includes("window.print()"));
  assert.ok(html.includes("@media print"));
});

test("generateStatementHtml handles English locale gracefully", () => {
  const html = generateStatementHtml(sampleEntries, {
    businessName: "Rona Kirana Beauty",
    periodLabel: "All periods",
    locale: "en",
  });

  assert.ok(html.includes("STATEMENT OF PROFIT OR LOSS"));
  assert.ok(html.includes("STATEMENT OF FINANCIAL POSITION"));
  assert.ok(html.includes("NOTES TO FINANCIAL STATEMENTS (CALK)"));
  assert.ok(html.includes("Print / Save PDF"));
});
