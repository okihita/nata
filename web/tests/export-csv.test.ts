/**
 * CSV export tests.
 *
 * The export is the hand-off to an accountant or a bank, so two things matter:
 * the numbers must match the screen exactly, and the file must open correctly in
 * Indonesian Excel — where a comma-delimited file collapses into one column,
 * because the comma is that locale's decimal separator.
 */

import { test } from "node:test";
import assert from "node:assert/strict";

import { journalToCsv, reportFilename, statementsToCsv } from "../src/lib/export-csv.ts";

const ENTRIES = [
  {
    id: "je-1",
    date: "2026-10-01",
    description: "Setoran modal awal",
    lines: [
      { account: "Kas", debit: 25_000_000, credit: 0 },
      { account: "Modal Pemilik", debit: 0, credit: 25_000_000 },
    ],
    source: "manual",
    createdAt: "2026-10-01T00:00:00.000Z",
  },
  {
    id: "je-2",
    date: "2026-10-05",
    description: "Penjualan kopi minggu pertama",
    lines: [
      { account: "Kas", debit: 4_500_000, credit: 0 },
      { account: "Pendapatan Penjualan", debit: 0, credit: 4_500_000 },
    ],
    source: "ocr",
    createdAt: "2026-10-05T00:00:00.000Z",
  },
] as never[];

// ── Locale-safety ───────────────────────────────────────────────────────────

test("uses a semicolon delimiter so Indonesian Excel keeps the columns", () => {
  const csv = statementsToCsv(ENTRIES, { periodLabel: "Semua periode", businessName: "Warung" });
  const dataLine = csv.split("\r\n").find((l) => l.startsWith("Total pendapatan"));
  assert.ok(dataLine, "expected the total revenue row");
  assert.equal(dataLine, "Total pendapatan;4.500.000");
});

test("starts with a UTF-8 BOM so Excel reads the text correctly", () => {
  const csv = statementsToCsv(ENTRIES, { periodLabel: "Semua periode", businessName: "Warung" });
  assert.equal(csv.charCodeAt(0), 0xfeff);
});

test("formats amounts the Indonesian way", () => {
  const csv = statementsToCsv(ENTRIES, { periodLabel: "Semua periode", businessName: "Warung" });
  // 25.000.000 not 25,000,000 — matching what is on screen.
  assert.ok(csv.includes("25.000.000"), "expected Indonesian grouping");
  assert.ok(!csv.includes("25,000,000"), "must not use English grouping");
});

test("quotes a field containing the delimiter", () => {
  const csv = journalToCsv([
    {
      id: "je-3",
      date: "2026-10-06",
      description: "Beli kopi; susu; dan gula",
      lines: [{ account: "Kas", debit: 1000, credit: 0 }],
      source: "manual",
      createdAt: "2026-10-06T00:00:00.000Z",
    },
  ] as never[]);
  assert.ok(
    csv.includes('"Beli kopi; susu; dan gula"'),
    "a semicolon inside a value must be quoted or the columns shift",
  );
});

// ── The numbers must match the screen ───────────────────────────────────────

test("the statement export reports the same totals as the ledger", () => {
  const csv = statementsToCsv(ENTRIES, { periodLabel: "Semua periode", businessName: "Warung" });
  assert.ok(csv.includes("Total pendapatan;4.500.000"), "revenue");
  // Cash 25.000.000 + 4.500.000 = 29.500.000 (the second entry is a cash sale).
  assert.ok(csv.includes("Total aset;29.500.000"), "assets");
  assert.ok(csv.includes("Total ekuitas;29.500.000"), "capital + current profit");
});

test("the accounting identity is stated explicitly", () => {
  const csv = statementsToCsv(ENTRIES, { periodLabel: "Semua periode", businessName: "Warung" });
  assert.ok(
    csv.includes("Aset = Liabilitas + Ekuitas;seimbang"),
    "the identity is the first thing an accountant checks",
  );
});

test("an unbalanced ledger reports its difference rather than claiming balance", () => {
  // Remove the matching credit so the books no longer balance.
  const broken = [
    {
      id: "je-x",
      date: "2026-10-07",
      description: "Posting tidak seimbang",
      lines: [{ account: "Kas", debit: 1000, credit: 0 }],
      source: "manual",
      createdAt: "2026-10-07T00:00:00.000Z",
    },
  ] as never[];
  const csv = statementsToCsv(broken, { periodLabel: "Semua periode", businessName: "Warung" });
  assert.ok(csv.includes("selisih"), "an unbalanced export must say so");
  assert.ok(!csv.includes("seimbang;"), "must not claim balance");
});

// ── Journal export ─────────────────────────────────────────────────────────

test("the journal export is one row per posting line", () => {
  const csv = journalToCsv(ENTRIES);
  const rows = csv.split("\r\n").filter((l) => l.trim().length > 0);
  // header + 2 entries x 2 lines
  assert.equal(rows.length, 5);
  // Strip the BOM before comparing the header.
  assert.ok(rows[0].replace("\uFEFF", "").startsWith("Tanggal;Keterangan;Akun;Debit;Kredit;Sumber"));
});

test("debit and credit columns never both carry a value", () => {
  for (const line of journalToCsv(ENTRIES).split("\r\n").slice(1)) {
    if (!line.trim()) continue;
    const [, , , debit, credit] = line.split(";");
    assert.ok(!(debit && credit), `a row had both sides set: ${line}`);
  }
});

// ── Filenames ──────────────────────────────────────────────────────────────

test("the filename is slugged and says what it contains", () => {
  assert.equal(
    reportFilename("Warung Kopi Nusantara", "Semua periode"),
    "nata-warung-kopi-nusantara-semua-periode.csv",
  );
  assert.equal(reportFilename("Toko Bu Ani", "Oktober 2026"), "nata-toko-bu-ani-oktober-2026.csv");
});

test("the filename survives a name with no usable characters", () => {
  assert.equal(reportFilename("***", "***"), "nata-usaha-semua-periode.csv");
});
