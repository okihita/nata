export type RoutineCadence = "daily" | "weekly" | "monthly" | "realtime";
export type RoutineStatus = "active" | "idle" | "running" | "paused";

export interface RoutineExecutionRecord {
  id: string;
  timestamp: string;
  status: "success" | "warning" | "error";
  durationMs: number;
  tokensUsed: number;
  findingSummary: string;
  findingSummaryEn: string;
  impactMetrics: { label: string; labelEn: string; value: string }[];
  statutoryGrounding?: string;
  actionTaken?: string;
  actionTakenEn?: string;
}

export interface AutonomousRoutine {
  id: string;
  title: string;
  titleEn: string;
  category: "treasury" | "tax" | "compliance" | "operations";
  assignedAgent: {
    id: "nata" | "maya" | "dimas" | "arief";
    name: string;
    role: string;
    roleEn: string;
  };
  cronSchedule: string;
  scheduleHuman: string;
  scheduleHumanEn: string;
  cadence: RoutineCadence;
  status: RoutineStatus;
  lastRunTime: string;
  lastRunStatus: "success" | "warning" | "error";
  description: string;
  descriptionEn: string;
  purpose: string;
  purposeEn: string;
  statutoryGrounding: string;
  recentExecutions: RoutineExecutionRecord[];
}

export const DEMO_ROUTINES: AutonomousRoutine[] = [
  {
    id: "rtn-cfo-briefing",
    title: "CFO Morning Briefing & Cash Burn Watch",
    titleEn: "CFO Morning Briefing & Cash Burn Watch",
    category: "treasury",
    assignedAgent: {
      id: "nata",
      name: "Mas Nata",
      role: "Kepala Tim Keuangan",
      roleEn: "Chief Financial Lead",
    },
    cronSchedule: "0 7 * * *",
    scheduleHuman: "Setiap hari pukul 07:00 WIB",
    scheduleHumanEn: "Daily at 07:00 WIB",
    cadence: "daily",
    status: "active",
    lastRunTime: "Hari ini, 07:00 WIB",
    lastRunStatus: "success",
    description: "Mengevaluasi mutasi rekening giro, saldo kas operasional, dan burn rate harian serta memprediksi runway 30 hari ke depan.",
    descriptionEn: "Evaluates bank ledger movements, operational cash reserves, and daily burn rate while forecasting 30-day runway.",
    purpose: "Menjaga likuiditas kas operasional tetap berada di atas batas minimum kas 14 hari.",
    purposeEn: "Maintains operational cash buffer above the 14-day safety threshold.",
    statutoryGrounding: "SAK EMKM Bab 11 (Laporan Arus Kas Operasional)",
    recentExecutions: [
      {
        id: "exec-cfo-01",
        timestamp: "Hari ini, 07:00 WIB",
        status: "success",
        durationMs: 4120,
        tokensUsed: 1240,
        findingSummary: "Saldo kas tersedia Rp 82.450.000 (cukup untuk 48 hari operasional). Tidak ada anomali pengeluaran kas kemarin.",
        findingSummaryEn: "Available cash reserves Rp 82,450,000 (sufficient for 48 days). Zero expenditure anomalies identified yesterday.",
        impactMetrics: [
          { label: "Kas Tersedia", labelEn: "Available Cash", value: "Rp 82.450.000" },
          { label: "Runway Proyeksi", labelEn: "Projected Runway", value: "48 Hari" },
          { label: "Rasio Kas", labelEn: "Cash Ratio", value: "2.4x" },
        ],
        statutoryGrounding: "SAK EMKM Bab 11 Pasal 4",
        actionTaken: "Ringkasan eksekutif dipublikasikan ke dasbor harian.",
        actionTakenEn: "Executive brief published to the daily dashboard.",
      },
      {
        id: "exec-cfo-02",
        timestamp: "Kemarin, 07:00 WIB",
        status: "success",
        durationMs: 3890,
        tokensUsed: 1180,
        findingSummary: "Saldo kas tersedia Rp 78.100.000. Pengeluaran kas terverifikasi sesuai struk operasional.",
        findingSummaryEn: "Available cash reserves Rp 78,100,000. Verified operational receipt disbursements.",
        impactMetrics: [
          { label: "Kas Tersedia", labelEn: "Available Cash", value: "Rp 78.100.000" },
          { label: "Runway Proyeksi", labelEn: "Projected Runway", value: "45 Hari" },
          { label: "Rasio Kas", labelEn: "Cash Ratio", value: "2.3x" },
        ],
        statutoryGrounding: "SAK EMKM Bab 11 Pasal 4",
      },
    ],
  },
  {
    id: "rtn-pph-threshold",
    title: "Pemantau Ambang Batas PPh Final PP 55/2022",
    titleEn: "PP 55/2022 Tax Ceiling & Threshold Sentinel",
    category: "tax",
    assignedAgent: {
      id: "maya",
      name: "Mba Maya",
      role: "Spesialis Pajak UMKM",
      roleEn: "Tax Specialist",
    },
    cronSchedule: "0 23 * * 0",
    scheduleHuman: "Setiap Minggu pukul 23:00 WIB",
    scheduleHumanEn: "Every Sunday at 23:00 WIB",
    cadence: "weekly",
    status: "active",
    lastRunTime: "Kemarin, 23:00 WIB",
    lastRunStatus: "warning",
    description: "Menghitung akumulasi omzet bruto tahunan terhadap batas pembebasan pajak Rp 500.000.000 bagi Wajib Pajak Orang Pribadi.",
    descriptionEn: "Audits year-to-date gross revenue against the Rp 500,000,000 non-taxable threshold for individual business owners.",
    purpose: "Mencegah keterlambatan setor dan denda bunga Pasal 19 UU KUP ketika omzet melampaui Rp 500 juta.",
    purposeEn: "Prevents tax payment delays and statutory interest penalties under Article 19 UU KUP once revenue exceeds Rp 500M.",
    statutoryGrounding: "PP 55/2022 Pasal 60 Ayat (2) & UU HPP Bab III",
    recentExecutions: [
      {
        id: "exec-tax-01",
        timestamp: "Kemarin, 23:00 WIB",
        status: "warning",
        durationMs: 5210,
        tokensUsed: 1890,
        findingSummary: "Omzet kumulatif mencapai Rp 412.500.000 (82,5% dari plafon bebas pajak). Peringatan dini diaktifkan.",
        findingSummaryEn: "Year-to-date gross turnover reached Rp 412,500,000 (82.5% of tax-free ceiling). Early alert activated.",
        impactMetrics: [
          { label: "Omzet Kumulatif", labelEn: "Cumulative Turnover", value: "Rp 412.500.000" },
          { label: "Sisa Bebas Pajak", labelEn: "Tax-Free Allowance Left", value: "Rp 87.500.000" },
          { label: "Estimasi PPh 0,5%", labelEn: "Est. PPh 0.5% Payable", value: "Rp 0 (Belum Terutang)" },
        ],
        statutoryGrounding: "PP 55/2022 Pasal 60 Ayat (2)",
        actionTaken: "Peringatan ambang batas 80% dicatat di ringkasan kepatuhan pajak.",
        actionTakenEn: "80% threshold notice registered to tax compliance summary.",
      },
    ],
  },
  {
    id: "rtn-marketplace-reconcile",
    title: "Rekonsiliasi Settlement Marketplace & Fee Toko",
    titleEn: "Marketplace Settlement & Platform Fee Reconciliation",
    category: "operations",
    assignedAgent: {
      id: "dimas",
      name: "Mas Dimas",
      role: "Auditor Pembukuan & Rekonsiliasi",
      roleEn: "Audit & Ledger Specialist",
    },
    cronSchedule: "0 2 * * *",
    scheduleHuman: "Setiap hari pukul 02:00 WIB",
    scheduleHumanEn: "Daily at 02:00 WIB",
    cadence: "daily",
    status: "active",
    lastRunTime: "Hari ini, 02:00 WIB",
    lastRunStatus: "success",
    description: "Mencocokkan pencairan saldo escrow dari Shopee, Tokopedia, dan TikTok Shop dengan saldo mutasi bank serta memisahkan potongan admin fee.",
    descriptionEn: "Cross-checks escrow payout batches from Shopee, Tokopedia, and TikTok Shop against bank deposits while separating merchant fee deductions.",
    purpose: "Menjamin seluruh biaya platform e-commerce tercatat rapi ke akun Beban Operasional sesuai prinsip matching SAK EMKM.",
    purposeEn: "Guarantees all e-commerce deductions are attributed to Operating Expenses per SAK EMKM matching principles.",
    statutoryGrounding: "SAK EMKM Bab 4 (Pengakuan Beban & Pendapatan)",
    recentExecutions: [
      {
        id: "exec-mkt-01",
        timestamp: "Hari ini, 02:00 WIB",
        status: "success",
        durationMs: 4670,
        tokensUsed: 1560,
        findingSummary: "Batch settlement Shopee #SP-9921 senilai Rp 14.850.000 cocok dengan mutasi BCA. Biaya admin Rp 520.000 teralokasi ke Beban Penjualan.",
        findingSummaryEn: "Shopee settlement batch #SP-9921 of Rp 14,850,000 perfectly reconciled with bank ledger. Rp 520,000 fee mapped to Operating Expense.",
        impactMetrics: [
          { label: "Nominal Settlement", labelEn: "Settled Amount", value: "Rp 14.850.000" },
          { label: "Biaya Layanan", labelEn: "Platform Fee", value: "Rp 520.000" },
          { label: "Selisih Mutasi", labelEn: "Ledger Discrepancy", value: "Rp 0 (Sempurna)" },
        ],
        statutoryGrounding: "SAK EMKM Bab 4 Paragraf 4.3",
        actionTaken: "Jurnal penyesuaian posting otomatis diposting ke Buku Besar.",
        actionTakenEn: "Adjusting entry automatically posted to General Ledger.",
      },
    ],
  },
  {
    id: "rtn-kbli-compliance",
    title: "Audit Kepatuhan Perizinan KBLI & Verifikasi OSS",
    titleEn: "KBLI Licensing Compliance & OSS Risk Verification",
    category: "compliance",
    assignedAgent: {
      id: "arief",
      name: "Bang Arief",
      role: "Spesialis Perizinan & KBLI",
      roleEn: "Licensing Specialist",
    },
    cronSchedule: "0 9 1 * *",
    scheduleHuman: "Tanggal 1 setiap bulan pukul 09:00 WIB",
    scheduleHumanEn: "1st of every month at 09:00 WIB",
    cadence: "monthly",
    status: "active",
    lastRunTime: "1 Okt 2026, 09:00 WIB",
    lastRunStatus: "success",
    description: "Memverifikasi apakah transaksi harian yang dicatat masih selaras dengan cakupan deskripsi KBLI 2020 resmi dan tidak melanggar tingkat risiko OSS.",
    descriptionEn: "Validates ongoing business activity against official KBLI 2020 scope and verifies OSS risk-tier obligations.",
    purpose: "Menghindarkan sanksi administratif atau pembekuan NIB akibat perluasan lini bisnis yang belum didaftarkan izinnya.",
    purposeEn: "Prevents administrative sanctions or NIB suspension caused by unregistered business expansion.",
    statutoryGrounding: "PP 5/2021 tentang Penyelenggaraan Perizinan Berusaha Berbasis Risiko",
    recentExecutions: [
      {
        id: "exec-kbli-01",
        timestamp: "1 Okt 2026, 09:00 WIB",
        status: "success",
        durationMs: 3150,
        tokensUsed: 980,
        findingSummary: "Aktivitas penjualan kosmetik konsisten dengan KBLI 47725 (Perdagangan Eceran Kosmetik). Tingkat risiko: Rendah (NIB berlaku sebagai izin edar & izin usaha).",
        findingSummaryEn: "Retail cosmetic operations align with KBLI 47725. Risk tier: Low (NIB serves as final legal operating permit).",
        impactMetrics: [
          { label: "Kode KBLI Terverifikasi", labelEn: "Verified KBLI Code", value: "47725" },
          { label: "Tingkat Risiko", labelEn: "Risk Classification", value: "Rendah (Low Risk)" },
          { label: "Validitas Legal", labelEn: "Legal Compliance", value: "100% Terpenuhi" },
        ],
        statutoryGrounding: "PP 5/2021 Lampiran I Sektor Perdagangan",
        actionTaken: "Status perizinan NIB dan KBLI diperbarui di profil usaha.",
        actionTakenEn: "NIB and KBLI compliance status verified on business profile.",
      },
    ],
  },
];
