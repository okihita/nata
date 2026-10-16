/**
 * SAK EMKM — chart of accounts and statement mapping.
 *
 * SAK EMKM (Standar Akuntansi Keuangan untuk Entitas Mikro, Kecil, dan
 * Menengah) is the Indonesian accounting standard for micro/small entities,
 * issued by DSAK IAI. It recognises five account groups, which the account
 * codes below follow:
 *
 *   1-xxxx  Aset         (assets)
 *   2-xxxx  Liabilitas   (liabilities)
 *   3-xxxx  Ekuitas      (equity)
 *   4-xxxx  Pendapatan   (revenue)
 *   5-xxxx  Beban        (expenses)
 *
 * This module is pure data + helpers: no React, no I/O. The ledger store
 * imports it to classify postings and build statements.
 */

export type AccountGroup = "aset" | "liabilitas" | "ekuitas" | "pendapatan" | "beban";

/** Normal balance side of an account group. */
export type NormalSide = "debit" | "credit";

export interface Account {
  code: string;
  /** Indonesian account name, as it appears on the receipt/ledger. */
  name: string;
  group: AccountGroup;
  /** Whether the account is a current (lancar) item — used by the balance sheet. */
  current?: boolean;
  /**
   * Contra account: its normal balance is *opposite* its group. Akumulasi
   * Penyusutan (Aset) and Prive (Ekuitas) both carry a debit-side-turned-credit
   * or vice versa, and reduce their group's total.
   */
  contra?: boolean;
  /** Optional alternative spellings the model may emit, mapped to this account. */
  aliases?: string[];
}

export const GROUP_LABEL: Record<AccountGroup, string> = {
  aset: "Aset",
  liabilitas: "Liabilitas",
  ekuitas: "Ekuitas",
  pendapatan: "Pendapatan",
  beban: "Beban",
};

/**
 * Normal balance per group. Assets and expenses grow on the debit side;
 * liabilities, equity and revenue grow on the credit side. Contra accounts
 * invert this — see `Account.contra`.
 */
export const NORMAL_SIDE: Record<AccountGroup, NormalSide> = {
  aset: "debit",
  liabilitas: "credit",
  ekuitas: "credit",
  pendapatan: "credit",
  beban: "debit",
};

/** The side a given account grows on, honouring contra accounts. */
export function normalSideOf(rawName: string): NormalSide {
  const account = resolveAccount(rawName);
  if (!account) return "debit";
  const base = NORMAL_SIDE[account.group];
  if (!account.contra) return base;
  return base === "debit" ? "credit" : "debit";
}

export const ACCOUNTS: Account[] = [
  // ── Aset ──────────────────────────────────────────────────────────────────
  { code: "1-1000", name: "Kas", group: "aset", current: true, aliases: ["kas tunai", "cash"] },
  { code: "1-1100", name: "Bank", group: "aset", current: true, aliases: ["bank bca", "rekening"] },
  { code: "1-1200", name: "Piutang Usaha", group: "aset", current: true },
  { code: "1-1210", name: "Piutang Lain-lain", group: "aset", current: true },
  { code: "1-1300", name: "Persediaan Barang Dagang", group: "aset", current: true, aliases: ["persediaan"] },
  { code: "1-1400", name: "Beban Dibayar di Muka", group: "aset", current: true },
  { code: "1-1500", name: "Perlengkapan", group: "aset", current: true, aliases: ["perlengkapan kantor", "beban perlengkapan"] },
  { code: "1-1600", name: "Peralatan", group: "aset", aliases: ["peralatan usaha"] },
  { code: "1-1610", name: "Kendaraan", group: "aset" },
  // Contra-asset: normal balance is a credit, so it reduces Aset.
  { code: "1-1690", name: "Akumulasi Penyusutan Aset Tetap", group: "aset", contra: true, aliases: ["akumulasi penyusutan peralatan"] },

  // ── Liabilitas ────────────────────────────────────────────────────────────
  { code: "2-1000", name: "Utang Usaha", group: "liabilitas", current: true, aliases: ["utang dagang"] },
  { code: "2-1100", name: "Utang Bank", group: "liabilitas" },
  { code: "2-1200", name: "Utang Gaji", group: "liabilitas", current: true },
  { code: "2-1300", name: "Utang Pajak", group: "liabilitas", current: true },
  { code: "2-1400", name: "Beban yang Masih Harus Dibayar", group: "liabilitas", current: true },
  { code: "2-1500", name: "Pendapatan Diterima di Muka", group: "liabilitas", current: true },

  // ── Ekuitas ───────────────────────────────────────────────────────────────
  { code: "3-1000", name: "Modal Pemilik", group: "ekuitas", aliases: ["modal"] },
  // Contra-equity: owner withdrawals reduce equity, so normal balance is debit.
  { code: "3-1100", name: "Prive", group: "ekuitas", contra: true, aliases: ["pengambilan pribadi"] },
  { code: "3-1200", name: "Laba Ditahan", group: "ekuitas" },
  // Populated at period close (R10); shown as a real account so the balance
  // sheet can present it rather than only deriving it.
  { code: "3-1300", name: "Laba (Rugi) Tahun Berjalan", group: "ekuitas" },

  // ── Pendapatan ────────────────────────────────────────────────────────────
  { code: "4-1000", name: "Pendapatan Penjualan", group: "pendapatan", aliases: ["penjualan", "pendapatan usaha"] },
  { code: "4-1100", name: "Pendapatan Jasa", group: "pendapatan" },
  // Contra-revenue: returns and discounts reduce revenue, so normal balance is debit.
  { code: "4-1200", name: "Retur dan Diskon Penjualan", group: "pendapatan", contra: true, aliases: ["retur penjualan", "diskon penjualan"] },
  { code: "4-1300", name: "Pendapatan Lain-lain", group: "pendapatan" },

  // ── Beban ─────────────────────────────────────────────────────────────────
  { code: "5-1000", name: "Harga Pokok Penjualan", group: "beban", aliases: ["hpp", "beban pokok penjualan"] },
  { code: "5-2000", name: "Beban Gaji dan Upah", group: "beban", aliases: ["beban gaji", "beban gaji karyawan"] },
  { code: "5-2100", name: "Beban Sewa", group: "beban", aliases: ["beban sewa tempat"] },
  { code: "5-2200", name: "Beban Listrik, Air & Telepon", group: "beban", aliases: ["beban listrik air dan telepon", "beban utilitas"] },
  { code: "5-2300", name: "Beban Perlengkapan", group: "beban" },
  { code: "5-2400", name: "Beban Penyusutan", group: "beban" },
  { code: "5-2500", name: "Beban Pemasaran dan Promosi", group: "beban", aliases: ["beban pemasaran", "beban promosi"] },
  { code: "5-2600", name: "Beban Transportasi", group: "beban", aliases: ["beban pengiriman"] },
  { code: "5-2700", name: "Beban Bunga", group: "beban" },
  { code: "5-2800", name: "Beban Pajak Final UMKM", group: "beban", aliases: ["beban pajak", "pph final"] },
  { code: "5-2900", name: "Beban Administrasi & Umum", group: "beban", aliases: ["beban administrasi"] },
  { code: "5-3000", name: "Beban Lain-lain", group: "beban" },
];

const BY_NAME = new Map<string, Account>();
for (const account of ACCOUNTS) {
  BY_NAME.set(account.name.toLowerCase(), account);
  for (const alias of account.aliases ?? []) BY_NAME.set(alias.toLowerCase(), account);
}
const BY_CODE = new Map(ACCOUNTS.map((a) => [a.code, a]));

/** Normalise an account name for lookup. */
const normalise = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9\s&,-]/g, "").replace(/\s+/g, " ").trim();

/**
 * Resolve a free-text account name from the model to a chart account.
 *
 * The model is instructed to use SAK EMKM names, but can drift. Matching is
 * exact-name first, then alias, then substring — and unknown names are kept
 * as-is rather than silently dropped, so nothing is posted to a wrong account.
 */
export function resolveAccount(rawName: string): Account | null {
  const key = normalise(rawName);
  if (!key) return null;
  const exact = BY_NAME.get(key);
  if (exact) return exact;

  for (const account of ACCOUNTS) {
    const candidates = [account.name, ...(account.aliases ?? [])].map(normalise);
    if (candidates.some((c) => c === key)) return account;
  }
  for (const account of ACCOUNTS) {
    const candidates = [account.name, ...(account.aliases ?? [])].map(normalise);
    if (candidates.some((c) => key.includes(c) || c.includes(key))) return account;
  }
  return null;
}

export function accountByCode(code: string): Account | null {
  return BY_CODE.get(code) ?? null;
}

/** Group a free-text account name (falls back to guessing by leading digit). */
export function groupOf(rawName: string): AccountGroup | null {
  const resolved = resolveAccount(rawName);
  if (resolved) return resolved.group;
  if (/^1/.test(rawName)) return "aset";
  if (/^2/.test(rawName)) return "liabilitas";
  if (/^3/.test(rawName)) return "ekuitas";
  if (/^4/.test(rawName)) return "pendapatan";
  if (/^5/.test(rawName)) return "beban";
  return null;
}

/** Account code to show next to a name, when known. */
export function codeOf(rawName: string): string | null {
  return resolveAccount(rawName)?.code ?? null;
}

// ── Statutory pieces ────────────────────────────────────────────────────────

/**
 * PPh Final UMKM rate under PP 55/2022 (as amended): 0.5% of gross turnover,
 * available to individual taxpayers and PT Perorangan while turnover stays
 * under Rp 4.8 billion a year. It is a *final* tax on turnover — not on profit
 * — which is why it is computed from revenue, never from net income.
 */
export const PPH_FINAL_RATE = 0.005;
export const PPH_TURNOVER_CEILING = 4_800_000_000;
/** Annual turnover exempt for individual taxpayers (not PT Perorangan). */
export const PPH_INDIVIDUAL_EXEMPTION = 500_000_000;

/**
 * The financial statements SAK EMKM requires an entity to present.
 * `ready` marks the ones this prototype can already assemble from the ledger.
 */
export interface StatementSpec {
  id: string;
  name: string;
  description: string;
  ready: boolean;
}

export const STATEMENTS: StatementSpec[] = [
  {
    id: "posisi-keuangan",
    name: "Laporan Posisi Keuangan",
    description: "Aset, liabilitas, dan ekuitas pada akhir periode.",
    ready: true,
  },
  {
    id: "laba-rugi",
    name: "Laporan Laba Rugi",
    description: "Pendapatan dikurangi beban selama satu periode.",
    ready: true,
  },
  {
    id: "calk",
    name: "Catatan atas Laporan Keuangan (CALK)",
    description: "Penjelasan ringkas atas angka pada laporan keuangan.",
    ready: false,
  },
];
