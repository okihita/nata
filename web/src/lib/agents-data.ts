export type AgentStaffId = "akuntan" | "konsultan_pajak" | "legal_izin" | "manajer_keuangan";

export interface TeamMember {
  id: AgentStaffId;
  name: string;
  role: string;
  roleEn: string;
  badge: string;
  badgeEn: string;
  tagline: string;
  taglineEn: string;
  avatarIcon: string;
  responsibilities: string[];
  responsibilitiesEn: string[];
  autonomousRules: string[];
  autonomousRulesEn: string[];
  delegationExample: string;
  delegationExampleEn: string;
  statusText: string;
  statusTextEn: string;
  stats: { label: string; labelEn: string; value: string }[];
}

export const AGENT_TEAM: Record<AgentStaffId, TeamMember> = {
  akuntan: {
    id: "akuntan",
    name: "Akuntan Pribadi (Agent Keuangan)",
    role: "Pencatatan Pembukuan Otomatis",
    roleEn: "Automated Bookkeeping Staff",
    badge: "Pembukuan SAK EMKM",
    badgeEn: "SAK EMKM Bookkeeper",
    tagline: "Membaca foto nota & struk, mencatat debit-kredit tanpa salah hitung.",
    taglineEn: "Reads receipt photos, books double-entry ledgers with zero math errors.",
    avatarIcon: "ReceiptText",
    statusText: "Aktif menjaga keseimbangan neraca",
    statusTextEn: "Actively balancing your ledgers",
    stats: [
      { label: "Keseimbangan Buku", labelEn: "Ledger Balance", value: "100% Pas" },
      { label: "Waktu Pencatatan", labelEn: "Posting Time", value: "< 2 Detik" },
      { label: "Standar Akuntansi", labelEn: "Accounting Rules", value: "SAK EMKM" },
    ],
    responsibilities: [
      "Membaca foto struk belanja, faktur, dan bukti transfer secara otomatis.",
      "Memilihkan nama akun pembukuan yang tepat (misal: Kas, Beban Perlengkapan, Persediaan).",
      "Memastikan sisi debit dan kredit selalu seimbang sebelum disimpan ke laporan keuangan.",
    ],
    responsibilitiesEn: [
      "Instantly extracts merchant, items, dates, and totals from receipt photos and invoices.",
      "Maps expenses to canonical accounts (e.g., Cash, Supplies Expense, Inventory).",
      "Mathematically verifies debits equal credits before saving to your financial statements.",
    ],
    autonomousRules: [
      "Aturan Anti-Selisih: Jika ada selisih nominal satu rupiah pun, transaksi tidak akan dicatat sembarangan melainkan ditandai untuk diperiksa.",
      "Aturan Tanpa Rumus Rumit: Pemilik usaha tidak perlu mengerti debit-kredit; semua jurnal dibuat otomatis di belakang layar.",
    ],
    autonomousRulesEn: [
      "Zero-Delta Rule: If debits and credits do not match to the exact rupiah, the entry is stopped and flagged for review.",
      "Zero Accounting Jargon: Business owners do not need to understand debit/credit mechanics; double-entry journals are created autonomously.",
    ],
    delegationExample: "Cukup foto struk belanja bahan baku saat belanja, asisten ini yang merapikan pembukuannya sampai jadi laporan neraca.",
    delegationExampleEn: "Snap a photo of your wholesale ingredients invoice, and this agent logs balanced journals without manual spreadsheets.",
  },
  konsultan_pajak: {
    id: "konsultan_pajak",
    name: "Konsultan Pajak (Agent Fiskal)",
    role: "Perhitungan & Batas Pajak UMKM",
    roleEn: "MSME Tax Specialist",
    badge: "PPh Final PP 55/2022",
    badgeEn: "0.5% Final Tax Guard",
    tagline: "Menghitung PPh Final 0,5% dan melindungi hak bebas pajak Rp 500 juta Anda.",
    taglineEn: "Calculates 0.5% final income tax and safeguards your Rp 500M tax-free allowance.",
    avatarIcon: "Landmark",
    statusText: "Memantau ambang batas omzet",
    statusTextEn: "Monitoring turnover thresholds",
    stats: [
      { label: "Tarif Pajak UMKM", labelEn: "Final Tax Rate", value: "0,5%" },
      { label: "Bebas Pajak Pribadi", labelEn: "Tax-Free Band", value: "Rp 500 Juta" },
      { label: "Dasar Hukum", labelEn: "Statutory Basis", value: "PP 55/2022" },
    ],
    responsibilities: [
      "Menghitung kewajiban PPh Final 0,5% setiap bulan dari total omzet usaha Anda.",
      "Mencatat peredaran bruto kumulatif setahun penuh secara otomatis.",
      "Memberitahu jika usaha Orang Pribadi Anda masih dalam batas bebas pajak Rp 500.000.000.",
    ],
    responsibilitiesEn: [
      "Computes monthly 0.5% PPh Final tax obligations directly from cumulative sales turnover.",
      "Tracks year-to-date gross turnover against statutory fiscal brackets.",
      "Automatically applies the Rp 500M tax-free exemption for individual sole proprietors.",
    ],
    autonomousRules: [
      "Perlindungan Batas Bebas Pajak: Omzet di bawah Rp 500 juta per tahun untuk Orang Pribadi dikenakan pajak Rp 0 (bebas pajak).",
      "Peringatan Tepat Waktu: Mengingatkan batas penyetoran tanggal 15 setiap bulan tanpa perlu menghafal pasal perpajakan.",
    ],
    autonomousRulesEn: [
      "Exemption Guard: Annual turnover under Rp 500M for individual entrepreneurs is taxed at exactly IDR 0.",
      "Timely Advisory: Tracks monthly payment deadlines (15th of each month) without requiring manual tax calculations.",
    ],
    delegationExample: "Setiap ada penjualan masuk, asisten ini langsung menghitung berapa porsi pajak yang harus disisihkan tanpa kejutan denda di akhir tahun.",
    delegationExampleEn: "As sales roll in, this agent automatically calculates exact tax set-asides so there are zero penalty surprises.",
  },
  legal_izin: {
    id: "legal_izin",
    name: "Spesialis Izin & Legal (Agent Regulasi)",
    role: "Panduan NIB & Perizinan Berusaha",
    roleEn: "Licensing & Compliance Officer",
    badge: "OSS RBA & KBLI 2020",
    badgeEn: "OSS RBA Verified",
    tagline: "Menentukan kode KBLI resmi dan syarat izin OSS RBA sesuai jenis usaha Anda.",
    taglineEn: "Resolves official 5-digit KBLI codes and operational licensing requirements.",
    avatarIcon: "ShieldCheck",
    statusText: "Siap memverifikasi legalitas usaha",
    statusTextEn: "Ready to verify business legality",
    stats: [
      { label: "Katalog KBLI Resmi", labelEn: "KBLI Taxonomy", value: "1.790 Kode" },
      { label: "Sistem Legalitas", labelEn: "Regulatory System", value: "OSS RBA" },
      { label: "Tingkat Risiko", labelEn: "Risk Categories", value: "Rendah - Tinggi" },
    ],
    responsibilities: [
      "Mencari kode KBLI 5 digit yang paling cocok hanya dari cerita atau deskripsi produk usaha Anda.",
      "Menjelaskan dokumen izin yang wajib dimiliki (cukup NIB atau butuh sertifikasi tambahan).",
      "Memastikan izin operasional aman dari risiko penutupan atau denda kepatuhan.",
    ],
    responsibilitiesEn: [
      "Maps your plain-language business description into the official 5-digit KBLI 2020 code.",
      "Clarifies operational permits required under OSS RBA (e.g. NIB vs additional health/safety permits).",
      "Ensures business legality protects you from compliance penalties or unexpected closures.",
    ],
    autonomousRules: [
      "Pencocokan Resmi: Hanya memilih dari 1.790 kode KBLI resmi BPS, tidak mengarang kode palsu.",
      "Bahasa Manusia: Menerjemahkan istilah birokrasi perizinan menjadi langkah praktis yang mudah dijalankan pemilik usaha.",
    ],
    autonomousRulesEn: [
      "Official Catalog: Verified against 1,790 official Indonesian BPS codes with zero hallucinated codes.",
      "Plain Language: Translates complex bureaucratic regulations into clear, step-by-step action items.",
    ],
    delegationExample: "Cukup tulis 'Saya jualan kopi susu dan kue basah', asisten ini mencarikan kode KBLI 56303 dan menjelaskan bahwa izin NIB Anda sudah cukup.",
    delegationExampleEn: "Type 'I sell bottled milk coffee and pastries', and this agent identifies KBLI 56303 and confirms your NIB permit suffices.",
  },
  manajer_keuangan: {
    id: "manajer_keuangan",
    name: "Manajer Keuangan Digital (Orchestrator)",
    role: "Koordinasi Seluruh Pekerjaan",
    roleEn: "Digital CFO Coordinator",
    badge: "Kerja Otomatis 24/7",
    badgeEn: "24/7 Automation",
    tagline: "Menghubungkan pembukuan, pajak, dan izin usaha dalam satu alur kerja mulus.",
    taglineEn: "Seamlessly links bookkeeping, tax computation, and licensing in one workflow.",
    avatarIcon: "Sparkles",
    statusText: "Menghubungkan semua asisten",
    statusTextEn: "Orchestrating team members",
    stats: [
      { label: "Asisten Terkoordinasi", labelEn: "Connected Staff", value: "3 Spesialis" },
      { label: "Alur Otomatis", labelEn: "Workflow", value: "Foto -> Buku -> Pajak" },
      { label: "Keamanan Data", labelEn: "Data Safety", value: "Terisolasi" },
    ],
    responsibilities: [
      "Mengarahkan foto struk ke Akuntan, meneruskan omzet ke Konsultan Pajak, dan mengecek izin di Spesialis Legal.",
      "Mencegah data terduplikasi atau salah urutan.",
      "Memberikan rangkuman kesehatan keuangan usaha setiap kali ada transaksi baru.",
    ],
    responsibilitiesEn: [
      "Hands receipts to the Bookkeeper, routes revenue to the Tax Specialist, and checks licensing compliance.",
      "Guarantees atomic, error-free handoffs without duplicate postings.",
      "Synthesizes an ongoing health summary whenever new transactions occur.",
    ],
    autonomousRules: [
      "Satu Pintu: Pemilik usaha hanya perlu berinteraksi di satu tempat, tim asisten yang bekerja di belakang layar.",
      "Keamanan Penuh: Data keuangan tidak pernah diubah tanpa verifikasi perhitungan yang sah.",
    ],
    autonomousRulesEn: [
      "Single Touchpoint: You interact with one clear interface while specialized agents collaborate in the background.",
      "Absolute Integrity: Financial records cannot be mutated without strict deterministic validation.",
    ],
    delegationExample: "Begitu Anda mencatat penjualan harian, pembukuan terisi, tabungan pajak dihitung, dan riwayat izin tetap rapi tanpa Anda repot.",
    delegationExampleEn: "The moment daily sales are recorded, books are balanced, taxes calculated, and permits verified automatically.",
  },
};
