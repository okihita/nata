export type AgentPersonId = "maya" | "dimas" | "arief" | "nata";

export interface ChatMessage {
  id: string;
  sender: "agent" | "user";
  text: string;
  timestamp: string;
}

export interface ThinkingStep {
  title: string;
  detail: string;
  status: "verified" | "processing";
  statuteCitation?: string;
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
  activeArtifact: {
    title: string;
    type: "journal" | "tax_voucher" | "licensing_card" | "orchestration_pipeline";
    summary: string;
    highlight: string;
    statutePill: string;
    details: { key: string; value: string }[];
  };
}

export const AGENT_PERSONAS: Record<AgentPersonId, AgentPersonaData> = {
  maya: {
    id: "maya",
    name: "Mbak Maya",
    title: "Akuntan Pribadi",
    titleEn: "Personal Bookkeeper",
    roleDescription: "Pencatatan Pembukuan SAK EMKM",
    roleDescriptionEn: "Automated SAK EMKM Accounting",
    badge: "Keuangan",
    badgeEn: "Bookkeeping",
    statusText: "Online · Siap merapikan nota",
    statusTextEn: "Online · Ready to book receipts",
    welcomeMessage: "Halo kak! Saya Maya, akuntan pribadi usaha kakak. Ada nota belanja atau faktur penjualan hari ini? Cukup ketik belanjaan atau unggah fotonya, biar Maya buatkan jurnal debit-kreditnya sampai pas.",
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
        text: "Halo kak! Saya Maya, akuntan pribadi usaha kakak. Ada nota belanja atau transaksi penjualan hari ini? Kirim ke Maya ya, nanti langsung Maya rapikan pembukuannya sesuai SAK EMKM.",
        timestamp: "09:12",
      },
      {
        id: "m2",
        sender: "user",
        text: "Halo Mbak Maya, tadi saya belanja bahan baku di Pasar Baru: Biji kopi arabika 250rb sama susu segar 100rb, total 350.000 bayar tunai dari laci kas.",
        timestamp: "09:14",
      },
      {
        id: "m3",
        sender: "agent",
        text: "Siap kak, sudah Maya catatkan! Transaksi Rp 350.000 sudah masuk ke Persediaan Bahan Dagang (Debit) dan mengurangi Kas Tunai (Kredit). Sisi Debit dan Kredit seimbang pas tanpa selisih 1 rupiah pun. Kakak bisa lihat rincian jurnalnya di panel kanan ya.",
        timestamp: "09:14",
      },
    ],
    thinkingFlow: [
      {
        title: "1. Membaca Uraian Transaksi",
        detail: "Mendeteksi pembelian bahan baku senilai Rp 350.000 dibayar tunai dari kas toko.",
        status: "verified",
      },
      {
        title: "2. Menentukan Kode Akun SAK EMKM",
        detail: "Memetakan ke Akun 1-1300 (Persediaan Bahan) dan Akun 1-1000 (Kas Tunai).",
        status: "verified",
        statuteCitation: "SAK EMKM Bab 4 - Aset Lancar",
      },
      {
        title: "3. Pemeriksaan Keseimbangan (Zero-Delta)",
        detail: "Debit Rp 350.000 = Kredit Rp 350.000. Selisih Rp 0 terbukti seimbang.",
        status: "verified",
      },
      {
        title: "4. Jurnal Resmi Dibukukan",
        detail: "Tercatat aman di buku besar digital Nata.",
        status: "verified",
      },
    ],
    activeArtifact: {
      title: "Jurnal Pembukuan SAK EMKM",
      type: "journal",
      summary: "Pembelian Bahan Baku Kopi & Susu Tunai",
      highlight: "Rp 350.000 (Seimbang Pas)",
      statutePill: "SAK EMKM Bab 4",
      details: [
        { key: "Nomor Jurnal", value: "JN-20261018-0042" },
        { key: "Akun Debit", value: "1-1300 Persediaan Barang Dagang (Rp 350.000)" },
        { key: "Akun Kredit", value: "1-1000 Kas Tunai Toko (Rp 350.000)" },
        { key: "Selisih Perhitungan", value: "Rp 0 (100% Cocok)" },
      ],
    },
  },
  dimas: {
    id: "dimas",
    name: "Mas Dimas",
    title: "Konsultan Pajak",
    titleEn: "Tax Consultant",
    roleDescription: "Pajak UMKM 0,5% & Batas Bebas Pajak",
    roleDescriptionEn: "0.5% Final Tax & Threshold Guard",
    badge: "Fiskal",
    badgeEn: "Tax Guard",
    statusText: "Online · Memantau ambang batas omzet",
    statusTextEn: "Online · Monitoring turnover threshold",
    welcomeMessage: "Halo kak! Saya Dimas, konsultan pajak usaha kakak. Dimas bertugas memastikan kakak bayar pajak UMKM pas 0,5% dan tidak kehilangan hak bebas pajak Rp 500 juta. Mau hitung pajak bulan ini?",
    welcomeMessageEn: "Hello! I am Dimas, your dedicated tax consultant. I make sure you leverage the 0.5% final tax rate and protect your Rp 500M annual tax-free allowance.",
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
        text: "Halo kak! Saya Dimas. Omzet bulan ini sudah masuk ke sistem pembukuan Mbak Maya. Mau Dimas hitungkan setoran pajaknya?",
        timestamp: "10:05",
      },
      {
        id: "d2",
        sender: "user",
        text: "Halo Mas Dimas, omzet bulan ini sekitar Rp 42 juta. Usaha saya terdaftar atas nama pribadi, apakah bulan ini saya sudah harus setor pajak?",
        timestamp: "10:08",
      },
      {
        id: "d3",
        sender: "agent",
        text: "Kabar gembira kak! Karena usaha kakak berbentuk Orang Pribadi dan total omzet kumulatif tahun ini baru Rp 280 juta (masih di bawah batas Rp 500 juta), pajak bulan ini Rp 0 alias BEBAS PAJAK sesuai PP 55/2022. Kuota bebas pajak kakak masih tersisa Rp 220 juta lagi. Lembar rinciannya sudah Dimas siapkan di sebelah kanan ya.",
        timestamp: "10:09",
      },
    ],
    thinkingFlow: [
      {
        title: "1. Verifikasi Bentuk Entitas Usaha",
        detail: "Wajib Pajak Orang Pribadi (Usaha Mikro/Kecil Perorangan).",
        status: "verified",
        statuteCitation: "UU HPP No. 7/2021",
      },
      {
        title: "2. Pengecekan Omzet Kumulatif Berjalan",
        detail: "Omzet s/d bulan ini Rp 280.000.000 (< ambang batas Rp 500.000.000).",
        status: "verified",
        statuteCitation: "PP 55/2022 Pasal 60 ayat (2)",
      },
      {
        title: "3. Perhitungan Pajak Terutang",
        detail: "Peredaran bruto belum kena pajak. PPh Final terutang: Rp 0.",
        status: "verified",
      },
      {
        title: "4. Penerbitan Bukti Bebas Pajak",
        detail: "Hak bebas pajak Rp 500 juta aman terlindungi.",
        status: "verified",
      },
    ],
    activeArtifact: {
      title: "Rangkuman Kepatuhan PPh Final 0,5%",
      type: "tax_voucher",
      summary: "Peredaran Bruto Di Bawah Ambang Batas",
      highlight: "Rp 0 (Bebas Pajak)",
      statutePill: "PP 55/2022 Ps. 60",
      details: [
        { key: "Bentuk Usaha", value: "Wajib Pajak Orang Pribadi" },
        { key: "Omzet Bulan Berjalan", value: "Rp 42.000.000" },
        { key: "Akumulasi Omzet 2026", value: "Rp 280.000.000" },
        { key: "Sisa Kuota Bebas Pajak", value: "Rp 220.000.000 tersisa" },
        { key: "PPh Final Terutang", value: "Rp 0 (Bebas Pajak)" },
      ],
    },
  },
  arief: {
    id: "arief",
    name: "Pak Arief",
    title: "Spesialis Izin Usaha",
    titleEn: "Licensing Specialist",
    roleDescription: "Legalitas OSS RBA & Kode KBLI 2020",
    roleDescriptionEn: "OSS RBA Compliance & KBLI Codes",
    badge: "Regulasi",
    badgeEn: "Licensing",
    statusText: "Online · Siap cek syarat perizinan",
    statusTextEn: "Online · Ready to check business permits",
    welcomeMessage: "Selamat datang kak! Saya Pak Arief. Saya membantu memilihkan kode KBLI 5 digit resmi BPS dan memastikan izin usaha OSS RBA kakak lengkap, tanpa istilah hukum yang membingungkan.",
    welcomeMessageEn: "Welcome! I am Pak Arief. I help you map the official 5-digit BPS KBLI code and ensure your OSS RBA business permits are 100% compliant without legal confusion.",
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
        text: "Halo kak, salam kenal. Sedang merencanakan buka usaha atau mau melengkapi izin yang sudah ada? Ceritakan jualan apa saja, biar Pak Arief carikan kodenya.",
        timestamp: "11:20",
      },
      {
        id: "a2",
        sender: "user",
        text: "Pak Arief, saya mau buka kedai kopi santai di garasi rumah, ada meja kursi buat nongkrong, ada kopi susu, espresso, sama cemilan kentang goreng.",
        timestamp: "11:22",
      },
      {
        id: "a3",
        sender: "agent",
        text: "Pilihan pas kak! Berdasarkan klasifikasi resmi BPS, usaha kakak masuk ke KBLI 56303 (Rumah Minum/Kafe). Tingkat risikonya tergolong Rendah, artinya kakak CUKUP memiliki Nomor Induk Berusaha (NIB) dari sistem OSS RBA. NIB ini sudah otomatis berfungsi sebagai legalitas operasional dan izin komersial resmi. Bagan perizinannya bisa kakak cek di panel kanan.",
        timestamp: "11:23",
      },
    ],
    thinkingFlow: [
      {
        title: "1. Analisis Aktivitas Usaha",
        detail: "Penyediaan minuman kopi olahan dengan fasilitas konsumsi di tempat.",
        status: "verified",
      },
      {
        title: "2. Pencocokan Taksonomi KBLI 2020",
        detail: "Terpetakan ke KBLI 56303: Rumah Minum/Kafe (Golongan Pokok 56).",
        status: "verified",
        statuteCitation: "Perka BPS No. 2 Tahun 2020",
      },
      {
        title: "3. Penilaian Tingkat Risiko OSS RBA",
        detail: "Kategori Risiko Rendah (Low Risk) skala UMKM.",
        status: "verified",
        statuteCitation: "PP No. 5 Tahun 2021",
      },
      {
        title: "4. Persyaratan Dokumen Izin Usaha",
        detail: "Cukup NIB (Nomor Induk Berusaha) langsung terbit otomatis.",
        status: "verified",
      },
    ],
    activeArtifact: {
      title: "Kartu Verifikasi Perizinan Berusaha",
      type: "licensing_card",
      summary: "KBLI 56303 - Rumah Minum/Kafe",
      highlight: "Tingkat Risiko: Rendah (Cukup NIB)",
      statutePill: "PP 5/2021 & KBLI 2020",
      details: [
        { key: "Kode KBLI 2020", value: "56303 (Rumah Minum / Kafe)" },
        { key: "Kategori Risiko", value: "Rendah (Low Risk)" },
        { key: "Izin Operasional", value: "NIB berlaku sebagai izin sah" },
        { key: "Instansi Pembina", value: "Kemenparekraf / Dinas Pariwisata" },
        { key: "Dasar Regulasi", value: "PP No. 5 Tahun 2021 (OSS RBA)" },
      ],
    },
  },
  nata: {
    id: "nata",
    name: "Mas Nata",
    title: "Manajer Keuangan Digital",
    titleEn: "Digital CFO Lead",
    roleDescription: "Koordinator Seluruh Tim Finansial",
    roleDescriptionEn: "Autonomous Team Orchestration",
    badge: "Koordinator",
    badgeEn: "Lead CFO",
    statusText: "Online · Menghubungkan seluruh tim",
    statusTextEn: "Online · Orchestrating your team",
    welcomeMessage: "Halo kak! Saya Nata, koordinator tim asisten digital kakak. Saya yang memastikan Mbak Maya, Mas Dimas, dan Pak Arief bekerja kompak menyelesaikan semua urusan keuangan dan izin usaha kakak secara otomatis.",
    welcomeMessageEn: "Hello! I am Nata, your digital CFO coordinator. I ensure Maya, Dimas, and Arief collaborate seamlessly so your bookkeeping, taxes, and permits run on autopilot.",
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
        text: "Selamat sore kak! Nata sudah merangkum seluruh aktivitas bisnis hari ini dari Mbak Maya dan Mas Dimas. Pembukuan seimbang pas, omzet bertambah Rp 2,4 juta, dan porsi pajak aman terlindungi. Ada yang ingin Nata koordinasikan lagi?",
        timestamp: "16:15",
      },
      {
        id: "n2",
        sender: "user",
        text: "Keren Mas Nata! Semua tim bekerja lancar ya. Kalau minggu depan omzet saya naik tembus 50 juta, apakah sistem langsung otomatis update?",
        timestamp: "16:18",
      },
      {
        id: "n3",
        sender: "agent",
        text: "Tentu kak! Begitu struk masuk, Mbak Maya langsung catat ke jurnal, Mas Dimas langsung hitung porsi pajaknya, dan Nata perbarui laporan laba rugi secara real-time. Kakak cukup cek lewat ponsel kapan saja. Alur kerja tim bisa kakak lihat di diagram sebelah kanan ya.",
        timestamp: "16:19",
      },
    ],
    thinkingFlow: [
      {
        title: "1. Penerimaan Transaksi Multi-Channel",
        detail: "Menerima nota penjualan harian Rp 2.400.000.",
        status: "verified",
      },
      {
        title: "2. Handoff Otomatis ke Mbak Maya",
        detail: "Jurnal kas & penjualan tercatat seimbang (SAK EMKM).",
        status: "verified",
      },
      {
        title: "3. Handoff Otomatis ke Mas Dimas",
        detail: "Akumulasi omzet dicatat, hak bebas pajak Rp 500M diupdate.",
        status: "verified",
      },
      {
        title: "4. Pembaruan Dasbor Eksekutif",
        detail: "Laporan keuangan dan posisi kas langsung sinkron 100%.",
        status: "verified",
      },
    ],
    activeArtifact: {
      title: "Alur Koordinasi Tim Otomatis (Pipeline)",
      type: "orchestration_pipeline",
      summary: "Sinkronisasi Penuh 3 Asisten Pintar",
      highlight: "Otomatisasi 24/7 (Tanpa Spreadsheet Manual)",
      statutePill: "Nata Multi-Agent Flow",
      details: [
        { key: "Status Koordinasi", value: "3 Staf Terhubung Sinkron" },
        { key: "Alur Kerja", value: "Foto Struk -> Pembukuan -> Pajak -> Izin" },
        { key: "Integritas Data", value: "Terkunci & Aman (Zero Human Error)" },
        { key: "Waktu Proses", value: "Rata-rata 1,4 detik per transaksi" },
      ],
    },
  },
};
