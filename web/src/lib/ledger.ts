/**
 * Buku besar (ledger) — transaksi, saldo, dan laporan keuangan SAK EMKM.
 *
 * Pure logic + a localStorage-backed store. The UI reads derived values
 * (trial balance, laba rugi, posisi keuangan, PPh Final) from here so the
 * numbers on screen are always consistent with the journal.
 *
 * All amounts are integer rupiah (IDR has no practical minor unit).
 */

import {
  groupOf,
  normalSideOf,
  PPH_FINAL_RATE,
  PPH_INDIVIDUAL_EXEMPTION,
  type AccountGroup,
} from "./sak-emkm";

export interface JournalLine {
  account: string;
  debit: number;
  credit: number;
}

export type EntrySource = "ocr" | "manual" | "seed";

export interface JournalEntry {
  id: string;
  /** ISO date, e.g. "2026-10-16". */
  date: string;
  description: string;
  lines: JournalLine[];
  source: EntrySource;
  /** Optional link back to the uploaded receipt image. */
  receiptName?: string;
  createdAt: string;
}

export interface LedgerState {
  entries: JournalEntry[];
}

/** Two sides of an entry, with the balance assertion. */
export function entryTotals(lines: JournalLine[]) {
  const debit = lines.reduce((sum, line) => sum + (line.debit || 0), 0);
  const credit = lines.reduce((sum, line) => sum + (line.credit || 0), 0);
  return { debit, credit, balanced: debit === credit && debit > 0 };
}

// ── Derivation ──────────────────────────────────────────────────────────────

export interface AccountBalance {
  account: string;
  group: AccountGroup | null;
  debit: number;
  credit: number;
  /** Raw movement: debit - credit. Negative for credit-normal accounts. */
  balance: number;
  /**
   * Balance expressed on the account's *normal* side, so it always reads as a
   * positive number: 25.000.000 rather than -25.000.000 for Modal Pemilik.
   * Contra accounts are inverted, so Prive and Akumulasi Penyusutan read
   * positive too — which is what their line on a statement means.
   */
  natural: number;
}

/** Trial balance (neraca saldo): net movement per account across all entries. */
export function trialBalance(entries: JournalEntry[]): AccountBalance[] {
  const map = new Map<string, AccountBalance>();
  for (const entry of entries) {
    for (const line of entry.lines) {
      const key = line.account.trim();
      if (!key) continue;
      const row =
        map.get(key) ??
        ({
          account: key,
          group: groupOf(key),
          debit: 0,
          credit: 0,
          balance: 0,
          natural: 0,
        } as AccountBalance);
      row.debit += line.debit || 0;
      row.credit += line.credit || 0;
      map.set(key, row);
    }
  }
  for (const row of map.values()) {
    row.balance = row.debit - row.credit;
    row.natural = normalSideOf(row.account) === "debit" ? row.balance : -row.balance;
  }
  return [...map.values()].sort((a, b) => a.account.localeCompare(b.account, "id"));
}

export interface StatementLine {
  account: string;
  amount: number;
}

export interface IncomeStatement {
  revenue: StatementLine[];
  expenses: StatementLine[];
  totalRevenue: number;
  totalExpenses: number;
  netIncome: number;
}

/**
 * Laporan Laba Rugi. Revenue accounts (pendapatan) are credit-normal, so their
 * movement is credit - debit; expenses are the opposite.
 */
export function incomeStatement(entries: JournalEntry[]): IncomeStatement {
  const revenue: StatementLine[] = [];
  const expenses: StatementLine[] = [];

  for (const row of trialBalance(entries)) {
    if (row.group === "pendapatan") {
      const amount = row.credit - row.debit;
      if (amount !== 0) revenue.push({ account: row.account, amount });
    } else if (row.group === "beban") {
      const amount = row.debit - row.credit;
      if (amount !== 0) expenses.push({ account: row.account, amount });
    }
  }

  const totalRevenue = revenue.reduce((s, r) => s + r.amount, 0);
  const totalExpenses = expenses.reduce((s, r) => s + r.amount, 0);
  return {
    revenue: revenue.sort((a, b) => b.amount - a.amount),
    expenses: expenses.sort((a, b) => b.amount - a.amount),
    totalRevenue,
    totalExpenses,
    netIncome: totalRevenue - totalExpenses,
  };
}

export interface BalanceSheet {
  assets: StatementLine[];
  liabilities: StatementLine[];
  equity: StatementLine[];
  totalAssets: number;
  totalLiabilities: number;
  totalEquity: number;
  /** The identity the whole system exists to protect. */
  balanced: boolean;
  difference: number;
}

/**
 * Laporan Posisi Keuangan. Current-period profit is not yet a ledger account,
 * so it is added to equity as "Laba Tahun Berjalan" — exactly as SAK EMKM
 * presentation expects.
 */
export function balanceSheet(entries: JournalEntry[]): BalanceSheet {
  const assets: StatementLine[] = [];
  const liabilities: StatementLine[] = [];
  const equity: StatementLine[] = [];

  for (const row of trialBalance(entries)) {
    if (row.group === "aset") {
      const amount = row.debit - row.credit;
      if (amount !== 0) assets.push({ account: row.account, amount });
    } else if (row.group === "liabilitas") {
      const amount = row.credit - row.debit;
      if (amount !== 0) liabilities.push({ account: row.account, amount });
    } else if (row.group === "ekuitas") {
      const amount = row.credit - row.debit;
      if (amount !== 0) equity.push({ account: row.account, amount });
    }
  }

  const net = incomeStatement(entries).netIncome;
  if (net !== 0) equity.push({ account: "Laba Tahun Berjalan", amount: net });

  const totalAssets = assets.reduce((s, r) => s + r.amount, 0);
  const totalLiabilities = liabilities.reduce((s, r) => s + r.amount, 0);
  const totalEquity = equity.reduce((s, r) => s + r.amount, 0);
  const difference = totalAssets - (totalLiabilities + totalEquity);

  return {
    assets: assets.sort((a, b) => b.amount - a.amount),
    liabilities: liabilities.sort((a, b) => b.amount - a.amount),
    equity: equity.sort((a, b) => b.amount - a.amount),
    totalAssets,
    totalLiabilities,
    totalEquity,
    balanced: Math.abs(difference) < 1,
    difference,
  };
}

/**
 * PPh Final UMKM = 0.5% × peredaran bruto (gross turnover), under PP 55/2022.
 * Turnover is total revenue — not profit — which is the whole point of a
 * final tax. The exemption line applies to individual taxpayers only.
 */
export interface TaxPosition {
  turnover: number;
  /** Taxable base after any exemption. */
  taxableBase: number;
  rate: number;
  payable: number;
  exemptApplied: number;
  monthlyEstimate: number;
  /** How many months of data the figures are drawn from. */
  months: number;
}

export function taxPosition(entries: JournalEntry[], opts?: { individual?: boolean }): TaxPosition {
  const turnover = incomeStatement(entries).totalRevenue;
  const exemption = opts?.individual ? PPH_INDIVIDUAL_EXEMPTION : 0;
  const exemptApplied = Math.min(turnover, exemption);
  const taxableBase = Math.max(0, turnover - exemptApplied);
  const payable = Math.round(taxableBase * PPH_FINAL_RATE);
  const months = Math.max(1, new Set(entries.map((e) => e.date.slice(0, 7))).size);
  return {
    turnover,
    taxableBase,
    rate: PPH_FINAL_RATE,
    payable,
    exemptApplied,
    monthlyEstimate: Math.round(payable / months),
    months,
  };
}

/** Totals for the dashboard cards. */
export function summary(entries: JournalEntry[]) {
  const inc = incomeStatement(entries);
  const bs = balanceSheet(entries);
  const tax = taxPosition(entries);
  const cash =
    bs.assets.find((a) => a.account.toLowerCase() === "kas")?.amount ?? 0;
  return { ...inc, ...bs, tax, cash, count: entries.length };
}

// ── Persistence ─────────────────────────────────────────────────────────────

const STORAGE_KEY = "nata.ledger.v3";

/**
 * Per-business storage key. The ledger belongs to a business, so two businesses
 * on the same browser never share a journal.
 */
function storageKeyFor(namespace?: string): string {
  return namespace ? `${STORAGE_KEY}.${namespace}` : STORAGE_KEY;
}

export function loadLedger(namespace?: string): LedgerState {
  if (typeof window === "undefined") return { entries: [] };
  try {
    const raw = window.localStorage.getItem(storageKeyFor(namespace));
    if (!raw) return { entries: [] };
    const parsed = JSON.parse(raw) as LedgerState;
    return { entries: Array.isArray(parsed.entries) ? parsed.entries : [] };
  } catch {
    return { entries: [] };
  }
}

export function saveLedger(state: LedgerState, namespace?: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(storageKeyFor(namespace), JSON.stringify(state));
  } catch {
    /* storage full or unavailable — the UI still works for this session */
  }
}

export function clearLedger(namespace?: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(storageKeyFor(namespace));
}

/** Append an entry, returning the new state. */
export function addEntry(state: LedgerState, entry: JournalEntry): LedgerState {
  return { entries: [...state.entries, entry].sort((a, b) => a.date.localeCompare(b.date)) };
}

export function newId(): string {
  return `je-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

// ── Demo data ───────────────────────────────────────────────────────────────

/**
 * Four months of realistic activity for a small Jakarta café ("Warung Kopi
 * Nusantara"), so the dashboard chart, the statements and the tax page all
 * show real shape on first run. Revenue is deliberately kept under the Rp 500
 * million individual exemption across the period, so the tax page exercises the
 * exemption rule rather than showing a bare zero.
 *
 * Every entry balances by construction.
 */
export function seedEntries(): JournalEntry[] {
  const mk = (
    id: string,
    date: string,
    description: string,
    lines: [string, number, number][],
    source: EntrySource = "seed",
  ): JournalEntry => ({
    id,
    date,
    description,
    lines: lines.map(([account, debit, credit]) => ({ account, debit, credit })),
    source,
    createdAt: `${date}T08:00:00.000Z`,
  });

  const monthly = (
    month: string,
    idx: number,
    sales: number[],
    opts: { rent: number; utilities: number; payroll: number; marketing: number; restock: number },
  ): JournalEntry[] => [
    mk(`je-${month}-rent`, `${month}-05`, "Sewa tempat bulanan", [
      ["Beban Sewa", opts.rent, 0],
      ["Kas", 0, opts.rent],
    ]),
    mk(`je-${month}-sales1`, `${month}-08`, "Penjualan kopi minggu pertama (tunai)", [
      ["Kas", sales[0], 0],
      ["Pendapatan Penjualan", 0, sales[0]],
    ]),
    mk(`je-${month}-util`, `${month}-12`, "Bayar listrik, air dan internet", [
      ["Beban Listrik, Air & Telepon", opts.utilities, 0],
      ["Kas", 0, opts.utilities],
    ]),
    // Restock: keeps inventory positive against the HPP written off in October.
    mk(`je-${month}-restock`, `${month}-13`, "Beli persediaan biji kopi dan susu (tunai)", [
      ["Persediaan Barang Dagang", opts.restock, 0],
      ["Kas", 0, opts.restock],
    ]),
    mk(`je-${month}-sales2`, `${month}-15`, "Penjualan kopi minggu kedua (tunai)", [
      ["Kas", sales[1], 0],
      ["Pendapatan Penjualan", 0, sales[1]],
    ]),
    mk(`je-${month}-payroll`, `${month}-16`, "Gaji barista periode pertama", [
      ["Beban Gaji dan Upah", opts.payroll, 0],
      ["Kas", 0, opts.payroll],
    ]),
    mk(`je-${month}-sales3`, `${month}-20`, "Penjualan kopi minggu ketiga (tunai)", [
      ["Kas", sales[2], 0],
      ["Pendapatan Penjualan", 0, sales[2]],
    ]),
    mk(`je-${month}-promo`, `${month}-22`, "Biaya promosi media sosial", [
      ["Beban Pemasaran dan Promosi", opts.marketing, 0],
      ["Kas", 0, opts.marketing],
    ]),
    mk(`je-${month}-sales4`, `${month}-25`, "Penjualan kopi minggu keempat (tunai)", [
      ["Kas", sales[3], 0],
      ["Pendapatan Penjualan", 0, sales[3]],
    ]),
    ...(idx === 3
      ? [
          mk(`je-${month}-hpp`, `${month}-27`, "Harga pokok penjualan bulan ini", [
            ["Harga Pokok Penjualan", 9_300_000, 0],
            ["Persediaan Barang Dagang", 0, 9_300_000],
          ]),
          mk(`je-${month}-prive`, `${month}-28`, "Prive pemilik", [
            ["Prive", 4_000_000, 0],
            ["Kas", 0, 4_000_000],
          ]),
        ]
      : []),
  ];

  return [
    // ── Juli: buka usaha ─────────────────────────────────────────────────────
    mk("je-2026-07-01", "2026-07-01", "Setoran modal awal pemilik", [
      ["Kas", 25_000_000, 0],
      ["Modal Pemilik", 0, 25_000_000],
    ]),
    mk("je-2026-07-02", "2026-07-02", "Beli peralatan mesin espresso tunai", [
      ["Peralatan", 12_000_000, 0],
      ["Kas", 0, 12_000_000],
    ]),
    mk("je-2026-07-03", "2026-07-03", "Beli persediaan biji kopi dan susu (kredit 30 hari)", [
      ["Persediaan Barang Dagang", 4_500_000, 0],
      ["Utang Usaha", 0, 4_500_000],
    ]),

    // ── Juli–Oktober: operasional rutin ──────────────────────────────────────
    ...monthly("2026-07", 0, [3_400_000, 3_900_000, 3_250_000, 4_100_000], {
      rent: 3_000_000,
      utilities: 900_000,
      payroll: 5_400_000,
      marketing: 400_000,
      restock: 2_800_000,
    }),
    ...monthly("2026-08", 1, [4_650_000, 5_100_000, 4_400_000, 5_350_000], {
      rent: 3_000_000,
      utilities: 1_100_000,
      payroll: 5_700_000,
      marketing: 600_000,
      restock: 3_600_000,
    }),
    ...monthly("2026-09", 2, [5_800_000, 6_250_000, 5_450_000, 6_600_000], {
      rent: 3_000_000,
      utilities: 1_200_000,
      payroll: 6_000_000,
      marketing: 700_000,
      restock: 4_200_000,
    }),
    ...monthly("2026-10", 3, [9_750_000, 11_400_000, 10_050_000, 12_300_000], {
      rent: 3_000_000,
      utilities: 1_250_000,
      payroll: 6_300_000,
      marketing: 750_000,
      restock: 4_800_000,
    }),

    // ── Oktober: kejadian lain ───────────────────────────────────────────────
    mk("je-2026-10-10", "2026-10-10", "Beli perlengkapan gelas dan kemasan (tunai)", [
      ["Beban Perlengkapan", 850_000, 0],
      ["Kas", 0, 850_000],
    ]),
    mk("je-2026-10-18", "2026-10-18", "Bayar sebagian utang usaha", [
      ["Utang Usaha", 2_000_000, 0],
      ["Kas", 0, 2_000_000],
    ]),
  ];
}

/** Monthly revenue series, for the dashboard chart. */
export function monthlyRevenue(entries: JournalEntry[]): { month: string; revenue: number; expense: number }[] {
  const map = new Map<string, { revenue: number; expense: number }>();
  for (const entry of entries) {
    const month = entry.date.slice(0, 7);
    const bucket = map.get(month) ?? { revenue: 0, expense: 0 };
    for (const line of entry.lines) {
      const group = groupOf(line.account);
      if (group === "pendapatan") bucket.revenue += line.credit - line.debit;
      if (group === "beban") bucket.expense += line.debit - line.credit;
    }
    map.set(month, bucket);
  }
  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, v]) => ({ month, ...v }));
}

