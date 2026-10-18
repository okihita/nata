export type ApprovalId = "AP-A-1212" | "AP-A-tax" | "AP-B-laba" | "AP-B-close" | "AP-B-pbjt";

export type ApprovalAgent = "strategy" | "finance" | "legal" | "tax";

export interface ApprovalItem {
  id: ApprovalId;
  agent: ApprovalAgent;
  agentName: string;
  titleId: string;
  titleEn: string;
  descId: string;
  descEn: string;
  impactId: string;
  impactEn: string;
  amount?: number;
  status: "pending" | "approved" | "rejected";
  source: string;
  statuteCitation?: string;
  noteId?: string;
  noteEn?: string;
}

export const INITIAL_APPROVALS: Record<"A" | "B", ApprovalItem[]> = {
  A: [
    {
      id: "AP-A-1212",
      agent: "strategy",
      agentName: "Nata (Strategy)",
      titleId: "Strategi Promo 12.12: Diskon Khusus Shopee Saja",
      titleEn: "12.12 Promo Strategy: Shopee-Only Discount",
      descId: "Batasi diskon 15% hanya pada kanal Shopee dengan batas subsidi platform agar margin kotor tetap di atas 38%.",
      descEn: "Cap 15% discount strictly to Shopee with platform subsidy match to preserve gross margin above 38%.",
      impactId: "Mencegah bakar uang Rp 3.200.000 pada kanal Tokopedia/TikTok.",
      impactEn: "Prevents negative gross margin and Rp 3.200.000 cash burn on Tokopedia/TikTok.",
      status: "pending",
      source: "boardroom:A-1212",
      statuteCitation: "Guardrail: Margin Protection Rule >= 35%",
    },
    {
      id: "AP-A-tax",
      agent: "tax",
      agentName: "Mas Dimas (Pajak)",
      titleId: "Draf Billing PPh Final September + Kurang Bayar Juli",
      titleEn: "Draft Billing: Sep Final Tax + July Shortfall",
      descId: "Penyiapan kode setor PPh Final 0,5% PP 55/2022 setelah peredaran bruto kumulatif melampaui batas bebas pajak Rp 500M.",
      descEn: "Preparation of 0.5% PP 55/2022 final tax payment voucher following cumulative turnover passing Rp 500M threshold.",
      impactId: "Kewajiban setor kas Rp 1.180.930 ke kas negara sebelum tanggal 15.",
      impactEn: "Cash disbursement requirement of Rp 1.180.930 to state treasury before the 15th.",
      amount: 1180930,
      status: "pending",
      source: "tax",
      statuteCitation: "PP 55/2022 Ps. 56 & PMK 164/2023",
      noteId: "Draf internal Nata, bukan kode billing DJP resmi sebelum Anda setujui.",
      noteEn: "Internal Nata draft, not an official DJP billing code until approved.",
    },
  ],
  B: [
    {
      id: "AP-B-laba",
      agent: "strategy",
      agentName: "Nata (Strategy)",
      titleId: "Rencana Pemulihan Laba Operasional September",
      titleEn: "September Operating Profit Recovery Plan",
      descId: "Penyesuaian resep susu oat dan rasio sirup untuk menahan kenaikan HPP bahan baku kopi sebesar 4,2%.",
      descEn: "Recipe re-engineering for oat milk and syrup ratios to absorb 4.2% raw material coffee bean inflation.",
      impactId: "Mengembalikan margin bersih ke target 22% pada Oktober.",
      impactEn: "Restores net operating margin to target 22% in October.",
      status: "pending",
      source: "boardroom:B-laba",
      statuteCitation: "F&B Benchmark: Food Cost Cap 32%",
    },
    {
      id: "AP-B-close",
      agent: "finance",
      agentName: "Mbak Maya (Akuntansi)",
      titleId: "Jurnal Koreksi J1 (Fee MDR QRIS) & J2 (Kas Belum Disetor)",
      titleEn: "Adjusting Entries J1 (QRIS MDR Fee) & J2 (Undeposited Cash)",
      descId: "Posting penyesuaian biaya settlement QRIS 0,7% dan selisih kas fisik kasir shift malam tanggal 28-30 September.",
      descEn: "Post adjustment for 0.7% QRIS settlement deductions and night-shift physical cash discrepancies (Sep 28-30).",
      impactId: "Rekonsiliasi mutasi bank klop 100% senilai Rp 5.018.168.",
      impactEn: "Reconciles bank ledger discrepancy of Rp 5.018.168 with zero variance.",
      amount: 5018168,
      status: "pending",
      source: "close",
      statuteCitation: "SAK EMKM Bab 4: Akrual & Rekonsiliasi Kas",
    },
    {
      id: "AP-B-pbjt",
      agent: "tax",
      agentName: "Mas Dimas (Pajak)",
      titleId: "Draf Surat Pemberitahuan Pajak Daerah (SPTPD PBJT Makanan & Minuman)",
      titleEn: "Draft Local Restaurant Tax Return (SPTPD PBJT F&B)",
      descId: "Validasi pungutan PBJT 10% atas penjualan dine-in & takeaway untuk Bapenda Kota.",
      descEn: "Validation of 10% PBJT local entertainment & food tax on dine-in & takeaway orders.",
      impactId: "Kesiapan laporan pajak daerah Rp 26.232.360 tanpa denda keterlambatan.",
      impactEn: "Local municipal tax filing readiness of Rp 26.232.360 with zero late penalty.",
      amount: 26232360,
      status: "pending",
      source: "tax",
      statuteCitation: "UU HKPD No. 1/2022 (Pajak Barang & Jasa Tertentu)",
    },
  ],
};
