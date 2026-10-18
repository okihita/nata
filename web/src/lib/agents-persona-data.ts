export type AgentPersonId = "nata" | "maya" | "dimas" | "arief";

export interface ChatMessage {
  id: string;
  sender: "agent" | "user";
  text: string;
  timestamp: string;
  attachments?: { name: string; type: "image" | "pdf" | "doc" }[];
}

export interface ThinkingStep {
  title: string;
  detail: string;
  status: "verified" | "processing";
  statuteCitation?: string;
}

export interface LivingArtifact {
  id: string;
  title: string;
  titleEn: string;
  type: "journal" | "tax_voucher" | "licensing_card" | "orchestration_pipeline";
  summary: string;
  summaryEn: string;
  badge: string;
  badgeEn: string;
  actionButtonLabel: string;
  actionButtonLabelEn: string;
  actionSuccessMessage: string;
  actionSuccessMessageEn: string;
  executionStatus: "ready_to_post" | "ready_to_file" | "ready_to_verify" | "active_pipeline";
  metrics: { label: string; labelEn: string; value: string }[];
  breakdown: { label: string; labelEn: string; value: string; secondary?: string }[];
  groundingProof: {
    model: string;
    guardrail: string;
    guardrailEn: string;
    statute: string;
    variance: string;
  };
}

export interface AgentPersonaData {
  id: AgentPersonId;
  name: string;
  title: string;
  titleEn: string;
  roleDescription: string;
  roleDescriptionEn: string;
  badge: string;
  badgeEn: string;
  statusText: string;
  statusTextEn: string;
  welcomeMessage: string;
  welcomeMessageEn: string;
  suggestedPrompts: { label: string; labelEn: string; prompt: string }[];
  defaultChatHistory: ChatMessage[];
  thinkingFlow: ThinkingStep[];
  livingArtifact: LivingArtifact;
}

export const AGENT_PERSONAS: Record<AgentPersonId, AgentPersonaData> = {
  nata: {
    id: "nata",
    name: "Mas Nata",
    title: "Kepala Tim Keuangan",
    titleEn: "Chief of Staff",
    roleDescription: "Mengatur & Mengawasi Seluruh Pekerjaan",
    roleDescriptionEn: "Supervises all business operations",
    badge: "Kepala Tim",
    badgeEn: "Chief of Staff",
    statusText: "Online · Siap membantu usaha Anda",
    statusTextEn: "Online · Ready to assist your business",
    welcomeMessage: "Halo kak! Saya Nata, kepala tim keuangan usaha Anda. Saya yang memastikan Maya (pembukuan), Dimas (pajak), dan Arief (izin usaha) berkoordinasi mulus secara otomatis. Ada nota atau hal yang ingin diperiksa hari ini?",
    welcomeMessageEn: "Hello! I am Nata, your business Chief of Staff. I coordinate Maya (bookkeeping), Dimas (taxes), and Arief (permits) seamlessly in the background. What would you like to review today?",
    suggestedPrompts: [
      {
        label: "Ringkasan Bisnis Hari Ini",
        labelEn: "Today's Business Summary",
        prompt: "Mas Nata, tolong rangkumkan kondisi keuangan usaha saya hari ini dari data Mbak Maya dan Mas Dimas.",
      },
      {
        label: "Simulasi Jual Beli Besar",
        labelEn: "Simulate Major Deal",
        prompt: "Kalau saya dapat pesanan catering kantor 50 juta minggu depan, bagaimana dampaknya ke pembukuan dan pajaknya?",
      },
      {
        label: "Cek Kelayakan Pinjaman Modal",
        labelEn: "Bank Loan Readiness",
        prompt: "Apakah laporan pembukuan usaha saya saat ini sudah layak untuk mengajukan KUR modal kerja ke bank?",
      },
    ],
    defaultChatHistory: [
      {
        id: "n1",
        sender: "agent",
        text: "Halo kak! Saya Nata, kepala tim keuangan usaha Anda. Saya yang memastikan Maya (pembukuan), Dimas (pajak), dan Arief (izin usaha) berkoordinasi secara otomatis. Ada yang ingin Nata bantu atau periksa hari ini?",
        timestamp: "10:00",
      },
    ],
    thinkingFlow: [
      {
        title: "1. Multi-Agent Sequential Routing",
        detail: "Ingested daily sales payload and dispatched to accounting pipeline.",
        status: "verified",
      },
      {
        title: "2. Handoff to Maya (Bookkeeping)",
        detail: "Validated double-entry balance: Debit = Credit (0 variance).",
        status: "verified",
        statuteCitation: "SAK EMKM Double-Entry Standard",
      },
      {
        title: "3. Handoff to Dimas (Taxation)",
        detail: "Updated year-to-date turnover and verified Rp 500M tax-free band.",
        status: "verified",
        statuteCitation: "PP 55/2022 Ps. 60",
      },
      {
        title: "4. Multi-Hop Consensus Verified",
        detail: "All records synchronized atomically with zero desynchronization.",
        status: "verified",
      },
    ],
    livingArtifact: {
      id: "art-pipeline-1",
      title: "Peta Koordinasi Tim Finansial",
      titleEn: "Multi-Agent Coordination Pipeline",
      type: "orchestration_pipeline",
      summary: "3 Asisten Bekerja Kompak Menjaga Pembukuan & Pajak",
      summaryEn: "Autonomous multi-agent execution with atomic state sync",
      badge: "Sistem Aktif 24/7",
      badgeEn: "Live Pipeline",
      actionButtonLabel: "Sinkronisasi Seluruh Laporan",
      actionButtonLabelEn: "Sync All Financial Records",
      actionSuccessMessage: "Seluruh laporan pembukuan dan pajak berhasil disinkronkan!",
      actionSuccessMessageEn: "All ledgers and tax records synchronized atomically!",
      executionStatus: "active_pipeline",
      metrics: [
        { label: "Kecepatan Alur", labelEn: "Pipeline Latency", value: "1,2 Detik" },
        { label: "Ketepatan Data", labelEn: "Data Accuracy", value: "100% Pas" },
        { label: "Asisten Aktif", labelEn: "Active Agents", value: "3 Spesialis" },
      ],
      breakdown: [
        { label: "Tahap 1: Pembukuan", labelEn: "Step 1: Bookkeeping", value: "Selesai (Mbak Maya)", secondary: "Debit = Kredit Rp 2.400.000" },
        { label: "Tahap 2: Perpajakan", labelEn: "Step 2: Tax Calculation", value: "Selesai (Mas Dimas)", secondary: "PPh Final 0% (Di Bawah 500 Juta)" },
        { label: "Tahap 3: Perizinan", labelEn: "Step 3: Legal Compliance", value: "Terverifikasi (Pak Arief)", secondary: "NIB Aktif & Sah" },
      ],
      groundingProof: {
        model: "Gemini 3.8 Flash (Vertex AI Global)",
        guardrail: "Deterministic State Machine with Atomic Rollback",
        guardrailEn: "Deterministic State Machine with Atomic Rollback",
        statute: "Multi-Hop Cascade Protocol",
        variance: "Zero Sync Drift",
      },
    },
  },
  maya: {
    id: "maya",
    name: "Mbak Maya",
    title: "Akuntan Pribadi",
    titleEn: "Personal Bookkeeper",
    roleDescription: "Pencatatan Pembukuan Harian",
    roleDescriptionEn: "Automated Daily Bookkeeping",
    badge: "Pembukuan",
    badgeEn: "Bookkeeper",
    statusText: "Online · Siap merapikan nota",
    statusTextEn: "Online · Ready to book receipts",
    welcomeMessage: "Halo kak! Saya Maya, akuntan pribadi usaha Anda. Ada nota belanja atau faktur penjualan hari ini? Cukup ketik belanjaan atau unggah fotonya, biar Maya buatkan jurnal pembukuannya sampai pas.",
    welcomeMessageEn: "Hi! I am Maya, your personal bookkeeper. Any store purchases or sales invoices today? Just type the purchase or snap the receipt, and I will balance the debit-credit ledger automatically.",
    suggestedPrompts: [
      {
        label: "Catat Beli Bahan 350rb",
        labelEn: "Log 350k Raw Materials",
        prompt: "Mbak Maya, tadi sore saya beli biji kopi 2kg dan susu 5 liter total 350.000 bayar tunai dari kas toko. Tolong catatkan ya.",
      },
      {
        label: "Cek Saldo Kas Toko",
        labelEn: "Check Store Cash Balance",
        prompt: "Berapa posisi saldo kas dan persediaan bahan kita sekarang Mbak Maya?",
      },
      {
        label: "Beli Mesin Kopi 5 Juta",
        labelEn: "Coffee Machine Asset 5M",
        prompt: "Saya beli mesin espresso 5 juta transfer dari rekening bank BCA toko, ini masuk aset atau beban?",
      },
    ],
    defaultChatHistory: [
      {
        id: "m1",
        sender: "agent",
        text: "Halo kak! Saya Maya. Ada nota belanja, faktur, atau transaksi baru hari ini? Kirim ke Maya ya, langsung Maya rapikan pembukuannya sampai seimbang pas.",
        timestamp: "10:00",
      },
    ],
    thinkingFlow: [
      {
        title: "1. Ekstraksi Data Transaksi (Multimodal)",
        detail: "Membaca pembelian bahan baku Rp 350.000 secara tunai.",
        status: "verified",
      },
      {
        title: "2. Pemetaan Akun Standar SAK EMKM",
        detail: "Akun 1-1300 (Persediaan) dan Akun 1-1000 (Kas Tunai).",
        status: "verified",
        statuteCitation: "SAK EMKM Bab 4 - Aset Lancar",
      },
      {
        title: "3. Verifikasi Keseimbangan (Zero-Variance)",
        detail: "Debit Rp 350.000 = Kredit Rp 350.000. Selisih Rp 0.",
        status: "verified",
      },
      {
        title: "4. Siap Dibukukan ke Buku Besar",
        detail: "Entri jurnal siap dibukukan dengan 1-klik.",
        status: "verified",
      },
    ],
    livingArtifact: {
      id: "art-journal-1",
      title: "Slip Jurnal Pembukuan SAK EMKM",
      titleEn: "Official SAK EMKM Journal Voucher",
      type: "journal",
      summary: "Pembelian Bahan Baku Kopi & Susu Tunai",
      summaryEn: "Raw Materials Purchase via Store Cash",
      badge: "Siap Dibukukan",
      badgeEn: "Ready to Post",
      actionButtonLabel: "Posting ke Buku Besar (1-Klik)",
      actionButtonLabelEn: "Post to General Ledger (1-Click)",
      actionSuccessMessage: "Jurnal berhasil dibukukan! Neraca dan laporan laba rugi otomatis terupdate.",
      actionSuccessMessageEn: "Journal posted to general ledger! Statements updated with zero delta.",
      executionStatus: "ready_to_post",
      metrics: [
        { label: "Total Transaksi", labelEn: "Total Amount", value: "Rp 350.000" },
        { label: "Selisih Pembukuan", labelEn: "Variance Delta", value: "Rp 0 (Pas)" },
        { label: "Standar Akuntansi", labelEn: "Accounting Rule", value: "SAK EMKM" },
      ],
      breakdown: [
        { label: "Debit: 1-1300 Persediaan", labelEn: "Debit: 1-1300 Inventory", value: "Rp 350.000", secondary: "Aset Lancar Bertambah" },
        { label: "Kredit: 1-1000 Kas Toko", labelEn: "Credit: 1-1000 Cash", value: "Rp 350.000", secondary: "Kas Toko Berkurang" },
      ],
      groundingProof: {
        model: "Gemini 3.8 Flash Vision (Vertex AI)",
        guardrail: "Pydantic Schema Enforced: Zero-Variance (Debit == Credit)",
        guardrailEn: "Pydantic Schema Enforced: Zero-Variance (Debit == Credit)",
        statute: "SAK EMKM DSAK IAI",
        variance: "0.00 IDR",
      },
    },
  },
  dimas: {
    id: "dimas",
    name: "Mas Dimas",
    title: "Konsultan Pajak",
    titleEn: "Tax Consultant",
    roleDescription: "Pajak UMKM 0,5% & Batas Bebas Pajak",
    roleDescriptionEn: "0.5% Final Tax Calculator",
    badge: "Pajak",
    badgeEn: "Taxes",
    statusText: "Online · Memantau ambang batas omzet",
    statusTextEn: "Online · Monitoring turnover threshold",
    welcomeMessage: "Halo kak! Saya Dimas, konsultan pajak usaha Anda. Dimas memastikan kakak membayar pajak UMKM pas 0,5% dan melindungi hak bebas pajak Rp 500 juta. Mau hitung pajak bulan ini?",
    welcomeMessageEn: "Hello! I am Dimas, your tax specialist. I make sure you pay exact 0.5% final tax while protecting your Rp 500M annual tax-free allowance.",
    suggestedPrompts: [
      {
        label: "Berapa Pajak Bulan Ini?",
        labelEn: "How much tax this month?",
        prompt: "Mas Dimas, omzet jualan saya bulan ini 42 juta. Bentuk usaha saya Orang Pribadi, berapa pajak yang harus saya bayar?",
      },
      {
        label: "Sisa Batas Bebas Pajak",
        labelEn: "Remaining Tax-Free Band",
        prompt: "Mas Dimas, sisa kuota bebas pajak Rp 500 juta saya untuk tahun 2026 masih berapa ya?",
      },
      {
        label: "Pajak PT Perorangan",
        labelEn: "PT Perorangan Tax Rules",
        prompt: "Kalau saya ubah usaha jadi PT Perorangan, apakah masih dapat fasilitas bebas pajak 500 juta?",
      },
    ],
    defaultChatHistory: [
      {
        id: "d1",
        sender: "agent",
        text: "Halo kak! Saya Dimas. Ada data omzet atau pertanyaan perpajakan UMKM (PPh Final 0,5% PP 55/2022)? Tanyakan ke Dimas ya.",
        timestamp: "10:00",
      },
    ],
    thinkingFlow: [
      {
        title: "1. Verifikasi Entitas Wajib Pajak",
        detail: "Bentuk: Orang Pribadi (Hak fasilitas bebas pajak aktif).",
        status: "verified",
        statuteCitation: "UU HPP No. 7 Tahun 2021",
      },
      {
        title: "2. Evaluasi Ambang Batas Omzet",
        detail: "Akumulasi tahunan: Rp 280M (< batas Rp 500M).",
        status: "verified",
        statuteCitation: "PP 55/2022 Pasal 60 ayat (2)",
      },
      {
        title: "3. Perhitungan Pajak Terutang",
        detail: "Tarif 0,5% x Rp 0 kena pajak = Rp 0.",
        status: "verified",
      },
      {
        title: "4. Penerbitan Sertifikat Bebas Pajak",
        detail: "Dokumen sah siap diunduh untuk bukti pembukuan.",
        status: "verified",
      },
    ],
    livingArtifact: {
      id: "art-tax-1",
      title: "Surat Keterangan Kepatuhan PPh Final",
      titleEn: "PP 55/2022 Final Tax Clearance Voucher",
      type: "tax_voucher",
      summary: "Fasilitas Pembebasan Pajak Omzet < Rp 500 Juta",
      summaryEn: "Statutory Tax Exemption Voucher (< Rp 500M)",
      badge: "Bebas Pajak Sah",
      badgeEn: "Exempt & Compliant",
      actionButtonLabel: "Terbitkan Bukti Bebas Pajak",
      actionButtonLabelEn: "Generate Tax Clearance Proof",
      actionSuccessMessage: "Surat keterangan bebas pajak berhasil diterbitkan dan diarsipkan!",
      actionSuccessMessageEn: "Tax clearance proof archived with official PP 55/2022 timestamp!",
      executionStatus: "ready_to_file",
      metrics: [
        { label: "Pajak Terutang", labelEn: "Tax Liability", value: "Rp 0 (Bebas)" },
        { label: "Sisa Kuota Bebas", labelEn: "Remaining Allowance", value: "Rp 220 Juta" },
        { label: "Batas Lapor", labelEn: "Payment Deadline", value: "15 Bulan Depan" },
      ],
      breakdown: [
        { label: "Omzet Bulan Ini", labelEn: "Current Month Sales", value: "Rp 42.000.000", secondary: "Diverifikasi dari pembukuan" },
        { label: "Akumulasi Omzet 2026", labelEn: "Year-To-Date Turnover", value: "Rp 280.000.000", secondary: "Batas Maksimal Rp 500 Juta" },
        { label: "Dasar Hukum", labelEn: "Statutory Reference", value: "PP 55/2022 Ps. 60", secondary: "Ketetapan Ditjen Pajak RI" },
      ],
      groundingProof: {
        model: "Gemini 3.8 Flash (Vertex AI)",
        guardrail: "Deterministic Threshold Engine (Hardcoded Rp 500M Cap)",
        guardrailEn: "Deterministic Threshold Engine (Hardcoded Rp 500M Cap)",
        statute: "PP 55/2022 Pasal 57 & 60",
        variance: "0.00 Tax Due",
      },
    },
  },
  arief: {
    id: "arief",
    name: "Pak Arief",
    title: "Spesialis Izin Usaha",
    titleEn: "Licensing Specialist",
    roleDescription: "Legalitas Izin & Kode KBLI Resmi",
    roleDescriptionEn: "Business Permits & Official Codes",
    badge: "Izin Usaha",
    badgeEn: "Licensing",
    statusText: "Online · Siap cek syarat perizinan",
    statusTextEn: "Online · Ready to check business permits",
    welcomeMessage: "Selamat datang kak! Saya Pak Arief. Saya membantu memilihkan kode KBLI 5 digit resmi BPS dan memastikan izin usaha OSS kakak lengkap tanpa risiko denda.",
    welcomeMessageEn: "Welcome! I am Pak Arief. I help you identify your official 5-digit KBLI code and ensure your OSS RBA business permits are complete without legal penalties.",
    suggestedPrompts: [
      {
        label: "Cari KBLI Cafe & Kopi",
        labelEn: "Find KBLI for Coffee Cafe",
        prompt: "Pak Arief, usaha saya jualan kopi seduh, aneka minuman kekinian, dan roti bakar di ruko. Kode KBLI-nya apa ya?",
      },
      {
        label: "Izin Toko Skincare Online",
        labelEn: "Online Cosmetics Store Permit",
        prompt: "Pak Arief, kalau saya jualan kosmetik dan skincare reseller di Shopee/Tokopedia, cukup punya NIB saja atau butuh izin BPOM sendiri?",
      },
      {
        label: "Apakah Butuh Sertifikat Halal?",
        labelEn: "Do I Need Halal Certification?",
        prompt: "Untuk usaha kuliner katering rumahan, kapan batas waktu wajib punya sertifikat halal?",
      },
    ],
    defaultChatHistory: [
      {
        id: "a1",
        sender: "agent",
        text: "Halo kak, salam kenal. Sedang merencanakan buka usaha atau mau melengkapi izin KBLI OSS? Ceritakan jualan apa saja, biar Pak Arief carikan kodenya.",
        timestamp: "10:00",
      },
    ],
    thinkingFlow: [
      {
        title: "1. Analisis Deskripsi Usaha",
        detail: "Penyediaan minuman kopi olahan dan makanan ringan di tempat.",
        status: "verified",
      },
      {
        title: "2. Pencocokan Taksonomi 1.790 KBLI",
        detail: "Terpetakan ke KBLI 56303: Rumah Minum/Kafe.",
        status: "verified",
        statuteCitation: "Perka BPS No. 2 Tahun 2020",
      },
      {
        title: "3. Penilaian Risiko OSS RBA",
        detail: "Kategori Risiko Rendah (Low Risk) skala UMKM.",
        status: "verified",
        statuteCitation: "PP No. 5 Tahun 2021",
      },
      {
        title: "4. Verifikasi Persyaratan Dokumen",
        detail: "NIB berlaku sebagai izin operasional dan komersial sah.",
        status: "verified",
      },
    ],
    livingArtifact: {
      id: "art-licensing-1",
      title: "Sertifikat Kelayakan Izin NIB OSS RBA",
      titleEn: "Official OSS RBA NIB Permit Assessment",
      type: "licensing_card",
      summary: "KBLI 56303 - Rumah Minum/Kafe (Risiko Rendah)",
      summaryEn: "KBLI 56303 - Cafe / Coffeehouse (Low Risk)",
      badge: "Izin Sah Pemerintah",
      badgeEn: "Government Verified",
      actionButtonLabel: "Simpan Rekomendasi Izin Usaha",
      actionButtonLabelEn: "Save Verified Permit Record",
      actionSuccessMessage: "Rekomendasi kode KBLI dan syarat NIB berhasil disimpan ke profil usaha!",
      actionSuccessMessageEn: "KBLI classification and NIB requirements saved to business profile!",
      executionStatus: "ready_to_verify",
      metrics: [
        { label: "Kode KBLI", labelEn: "KBLI Code", value: "56303" },
        { label: "Tingkat Risiko", labelEn: "Risk Level", value: "Rendah" },
        { label: "Syarat Izin", labelEn: "Permit Type", value: "Cukup NIB" },
      ],
      breakdown: [
        { label: "Klasifikasi BPS", labelEn: "BPS Classification", value: "Rumah Minum / Kafe", secondary: "Golongan Pokok 56" },
        { label: "Legalitas Usaha", labelEn: "Operational Legality", value: "NIB OSS RBA", secondary: "Izin operasional langsung sah" },
        { label: "Dasar Regulasi", labelEn: "Regulatory Basis", value: "PP No. 5 Tahun 2021", secondary: "Penyelenggaraan Perizinan Berusaha" },
      ],
      groundingProof: {
        model: "Gemini 3.8 Flash (Vertex AI)",
        guardrail: "Offline 1,790 BPS KBLI 2020 Index Match (Zero Hallucination)",
        guardrailEn: "Offline 1,790 BPS KBLI 2020 Index Match (Zero Hallucination)",
        statute: "PP 5/2021 & Perka BPS 2/2020",
        variance: "100% Taxon Match",
      },
    },
  },
};
