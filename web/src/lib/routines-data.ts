export type RoutineCadence = "daily" | "weekly" | "monthly" | "realtime";
export type RoutineStatus = "active" | "idle" | "running" | "paused" | "archived";

export type RoutineArtifactType = "cash_briefing" | "tax_threshold" | "reconciliation_table" | "kbli_certificate";

export interface RoutineExecutionRecord {
  id: string;
  timestamp: string;
  status: "success" | "warning" | "error";
  durationMs: number;
  tokensUsed: number;
  findingSummary: string;
  findingSummaryEn: string;
  impactMetrics: { label: string; labelEn: string; value: string }[];
  statutoryGrounding: string;
  artifactType: RoutineArtifactType;
  artifactPayload: Record<string, unknown>;
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
    title: "CFO Morning Briefing",
    titleEn: "CFO Morning Briefing",
    category: "treasury",
    assignedAgent: {
      id: "nata",
      name: "Mas Nata",
      role: "Kepala Tim Keuangan",
      roleEn: "Chief Financial Lead",
    },
    cronSchedule: "0 7 * * *",
    scheduleHuman: "Setiap hari 07:00 WIB",
    scheduleHumanEn: "Daily at 07:00 WIB",
    cadence: "daily",
    status: "active",
    lastRunTime: "Hari ini, 07:00 WIB",
    lastRunStatus: "success",
    description: "Evaluasi saldo kas operasional, burn rate, dan estimasi runway 30 hari.",
    descriptionEn: "Evaluates operational cash, daily burn rate, and 30-day runway.",
    purpose: "Menjaga batas minimum kas operasional tetap berada di atas 14 hari kerja.",
    purposeEn: "Maintains operational cash buffer above 14 working days.",
    statutoryGrounding: "SAK EMKM Bab 11 (Arus Kas Operasional)",
    recentExecutions: [
      {
        id: "exec-cfo-01",
        timestamp: "Hari ini, 07:00 WIB",
        status: "success",
        durationMs: 4120,
        tokensUsed: 1240,
        findingSummary: "Saldo kas tersedia Rp 82.450.000. Runway operasional aman untuk 48 hari ke depan.",
        findingSummaryEn: "Available cash reserves Rp 82,450,000. Projected operating runway safe for 48 days.",
        impactMetrics: [
          { label: "Kas Tersedia", labelEn: "Available Cash", value: "Rp 82.450.000" },
          { label: "Runway Proyeksi", labelEn: "Projected Runway", value: "48 Hari" },
          { label: "Rasio Kas", labelEn: "Cash Ratio", value: "2.4x" },
        ],
        statutoryGrounding: "SAK EMKM Bab 11 Paragraf 11.4",
        artifactType: "cash_briefing",
        artifactPayload: {
          cashBalance: 82450000,
          dailyBurnRate: 1717700,
          runwayDays: 48,
          operatingBuffer: "Safe (>14 Days)",
          lineItems: [
            { label: "Kas Bank BCA Giro", labelEn: "BCA Operating Checking", amount: 64250000 },
            { label: "Kas Kecil (Petty Cash)", labelEn: "Petty Cash Drawer", amount: 8200000 },
            { label: "QRIS Settlement Pending", labelEn: "Pending QRIS Payouts", amount: 10000000 },
          ],
        },
        actionTaken: "Ringkasan eksekutif dipublikasikan ke dasbor harian.",
        actionTakenEn: "Executive brief published to the daily dashboard.",
      },
      {
        id: "exec-cfo-02",
        timestamp: "Kemarin, 07:00 WIB",
        status: "success",
        durationMs: 3890,
        tokensUsed: 1180,
        findingSummary: "Saldo kas tersedia Rp 78.100.000. Seluruh transaksi kas cocok dengan struk operasional.",
        findingSummaryEn: "Available cash reserves Rp 78,100,000. All disbursements reconciled against receipts.",
        impactMetrics: [
          { label: "Kas Tersedia", labelEn: "Available Cash", value: "Rp 78.100.000" },
          { label: "Runway Proyeksi", labelEn: "Projected Runway", value: "45 Hari" },
          { label: "Rasio Kas", labelEn: "Cash Ratio", value: "2.3x" },
        ],
        statutoryGrounding: "SAK EMKM Bab 11 Paragraf 11.4",
        artifactType: "cash_briefing",
        artifactPayload: {
          cashBalance: 78100000,
          dailyBurnRate: 1735500,
          runwayDays: 45,
          operatingBuffer: "Safe (>14 Days)",
          lineItems: [
            { label: "Kas Bank BCA Giro", labelEn: "BCA Operating Checking", amount: 60100000 },
            { label: "Kas Kecil (Petty Cash)", labelEn: "Petty Cash Drawer", amount: 8000000 },
            { label: "QRIS Settlement Pending", labelEn: "Pending QRIS Payouts", amount: 10000000 },
          ],
        },
      },
    ],
  },
  {
    id: "rtn-pph-threshold",
    title: "Ambang Batas PPh Final PP 55",
    titleEn: "PP 55 Tax Threshold Sentinel",
    category: "tax",
    assignedAgent: {
      id: "maya",
      name: "Mba Maya",
      role: "Spesialis Pajak UMKM",
      roleEn: "Tax Specialist",
    },
    cronSchedule: "0 23 * * 0",
    scheduleHuman: "Minggu 23:00 WIB",
    scheduleHumanEn: "Every Sunday at 23:00 WIB",
    cadence: "weekly",
    status: "active",
    lastRunTime: "Kemarin, 23:00 WIB",
    lastRunStatus: "warning",
    description: "Audit kumulatif omzet bruto tahun berjalan terhadap plafon bebas pajak Rp 500.000.000.",
    descriptionEn: "Audits year-to-date gross turnover against the Rp 500M non-taxable ceiling.",
    purpose: "Menghindarkan sanksi bunga Pasal 19 UU KUP ketika omzet melampaui Rp 500 juta.",
    purposeEn: "Prevents statutory interest penalties under Article 19 UU KUP once revenue exceeds Rp 500M.",
    statutoryGrounding: "PP 55/2022 Pasal 60 Ayat (2)",
    recentExecutions: [
      {
        id: "exec-tax-01",
        timestamp: "Kemarin, 23:00 WIB",
        status: "warning",
        durationMs: 5210,
        tokensUsed: 1890,
        findingSummary: "Omzet kumulatif mencapai Rp 412.500.000 (82,5% dari plafon bebas pajak Rp 500M). Peringatan dini diaktifkan.",
        findingSummaryEn: "YTD gross turnover reached Rp 412,500,000 (82.5% of tax-free ceiling). Early threshold warning activated.",
        impactMetrics: [
          { label: "Omzet Kumulatif", labelEn: "Cumulative Turnover", value: "Rp 412.500.000" },
          { label: "Sisa Bebas Pajak", labelEn: "Tax-Free Allowance Left", value: "Rp 87.500.000" },
          { label: "Tarif Pajak Saat Ini", labelEn: "Current Tax Rate", value: "0% (Exempt)" },
        ],
        statutoryGrounding: "PP 55/2022 Pasal 60 Ayat (2) & UU HPP",
        artifactType: "tax_threshold",
        artifactPayload: {
          turnoverYtd: 412500000,
          exemptionCeiling: 500000000,
          remainingExemption: 87500000,
          percentConsumed: 82.5,
          statuteCite: "Pasal 60 ayat (2) PP 55/2022: Bagian peredaran bruto sampai dengan Rp500.000.000 tidak dikenai Pajak Penghasilan.",
          statusText: "82.5% of Threshold Reached (Warning Tier)",
        },
        actionTaken: "Peringatan ambang batas 80% dicatat di ringkasan kepatuhan pajak.",
        actionTakenEn: "80% threshold notice registered to tax compliance summary.",
      },
    ],
  },
  {
    id: "rtn-marketplace-reconcile",
    title: "Rekonsiliasi Settlement Marketplace",
    titleEn: "Marketplace Settlement Reconciliation",
    category: "operations",
    assignedAgent: {
      id: "dimas",
      name: "Mas Dimas",
      role: "Auditor Pembukuan & Rekonsiliasi",
      roleEn: "Audit & Ledger Specialist",
    },
    cronSchedule: "0 2 * * *",
    scheduleHuman: "Setiap hari 02:00 WIB",
    scheduleHumanEn: "Daily at 02:00 WIB",
    cadence: "daily",
    status: "active",
    lastRunTime: "Hari ini, 02:00 WIB",
    lastRunStatus: "success",
    description: "Mencocokkan pencairan escrow Shopee/Tokopedia dengan mutasi rekening bank dan mencatat potongan admin fee.",
    descriptionEn: "Matches escrow payouts with bank deposits and books merchant admin fee deductions.",
    purpose: "Menjamin seluruh biaya platform e-commerce tercatat rapi ke akun Beban Operasional.",
    purposeEn: "Guarantees platform deductions are recorded into Operating Expenses per SAK EMKM.",
    statutoryGrounding: "SAK EMKM Bab 4 (Pengakuan Beban)",
    recentExecutions: [
      {
        id: "exec-mkt-01",
        timestamp: "Hari ini, 02:00 WIB",
        status: "success",
        durationMs: 4670,
        tokensUsed: 1560,
        findingSummary: "Batch settlement Shopee #SP-9921 senilai Rp 14.850.000 cocok dengan mutasi BCA. Biaya admin Rp 520.000 diposting.",
        findingSummaryEn: "Shopee settlement batch #SP-9921 of Rp 14,850,000 matches bank mutation. Platform fee Rp 520,000 booked.",
        impactMetrics: [
          { label: "Nominal Settlement", labelEn: "Settled Amount", value: "Rp 14.850.000" },
          { label: "Biaya Platform", labelEn: "Platform Fee", value: "Rp 520.000" },
          { label: "Selisih Mutasi", labelEn: "Ledger Discrepancy", value: "Rp 0 (Sempurna)" },
        ],
        statutoryGrounding: "SAK EMKM Bab 4 Paragraf 4.3",
        artifactType: "reconciliation_table",
        artifactPayload: {
          batchRef: "SP-9921",
          platform: "Shopee Indonesia",
          bankAccount: "BCA Giro 8820-192-11",
          grossSales: 15370000,
          platformFee: 520000,
          netDisbursed: 14850000,
          bankDepositMatched: 14850000,
          variance: 0,
          journalLines: [
            { account: "1-1100 Kas di Bank (BCA)", debit: 14850000, credit: 0 },
            { account: "5-2010 Beban Administrasi Penjualan", debit: 520000, credit: 0 },
            { account: "1-1300 Piutang Escrow Marketplace", debit: 0, credit: 15370000 },
          ],
        },
        actionTaken: "Jurnal penyesuaian posting otomatis diposting ke Buku Besar.",
        actionTakenEn: "Adjusting entry automatically posted to General Ledger.",
      },
    ],
  },
  {
    id: "rtn-kbli-compliance",
    title: "Audit Kepatuhan Perizinan KBLI",
    titleEn: "KBLI Licensing Compliance Audit",
    category: "compliance",
    assignedAgent: {
      id: "arief",
      name: "Bang Arief",
      role: "Spesialis Perizinan & KBLI",
      roleEn: "Licensing Specialist",
    },
    cronSchedule: "0 9 1 * *",
    scheduleHuman: "Tgl 1 bulanan 09:00 WIB",
    scheduleHumanEn: "1st of month at 09:00 WIB",
    cadence: "monthly",
    status: "active",
    lastRunTime: "1 Okt 2026, 09:00 WIB",
    lastRunStatus: "success",
    description: "Verifikasi transaksi harian terhadap lingkup resmi KBLI 2020 dan tingkat risiko OSS.",
    descriptionEn: "Validates ongoing sales against official KBLI 2020 scope and OSS risk tiers.",
    purpose: "Menghindarkan sanksi administratif atau pembekuan NIB akibat ekspansi tanpa izin.",
    purposeEn: "Prevents legal sanctions or NIB suspension from unregistered business activities.",
    statutoryGrounding: "PP 5/2021 (Perizinan Berbasis Risiko)",
    recentExecutions: [
      {
        id: "exec-kbli-01",
        timestamp: "1 Okt 2026, 09:00 WIB",
        status: "success",
        durationMs: 3150,
        tokensUsed: 980,
        findingSummary: "Operasional sesuai KBLI 47725 (Perdagangan Eceran Kosmetik). Risiko: Rendah (NIB berlaku sebagai izin edar & operasional).",
        findingSummaryEn: "Operations match KBLI 47725. Risk tier: Low (NIB serves as legal operating permit).",
        impactMetrics: [
          { label: "Kode KBLI", labelEn: "Verified KBLI", value: "47725" },
          { label: "Tingkat Risiko", labelEn: "Risk Classification", value: "Rendah (Low Risk)" },
          { label: "Kepatuhan Legal", labelEn: "Compliance Status", value: "100% Terpenuhi" },
        ],
        statutoryGrounding: "PP 5/2021 Lampiran I Sektor Perdagangan",
        artifactType: "kbli_certificate",
        artifactPayload: {
          kbliCode: "47725",
          kbliTitle: "Perdagangan Eceran Barang Kosmetik Untuk Manusia",
          riskLevel: "Rendah (Low Risk)",
          nibStatus: "NIB Aktif & Terverifikasi OSS",
          legalRequirements: [
            { req: "NIB (Nomor Induk Berusaha)", status: "Active" },
            { req: "Surat Pernyataan Kesanggupan Pengelolaan Lingkungan (SPPL)", status: "Verified" },
            { req: "Izin Edar BPOM untuk Kosmetik Terdaftar", status: "Compliant" },
          ],
        },
        actionTaken: "Status perizinan NIB dan KBLI diperbarui di profil usaha.",
        actionTakenEn: "NIB and KBLI compliance status verified on business profile.",
      },
    ],
  },
];
