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
    welcomeMessage: "Halo kak! Saya Nata, kepala tim keuangan usaha kakak. Saya yang memastikan Mbak Maya (pembukuan), Mas Dimas (pajak), dan Pak Arief (izin usaha) bekerja kompak menyelesaikan semua urusan keuangan Anda secara otomatis. Ada nota baru atau hal yang ingin diperiksa hari ini?",
    welcomeMessageEn: "Hello! I am Nata, your business Chief of Staff. I ensure Maya (bookkeeping), Dimas (taxes), and Arief (permits) coordinate seamlessly to keep your finances in order. Any new receipts or questions today?",
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
        title: "1. Penerimaan Transaksi Otomatis",
        detail: "Menerima nota penjualan harian Rp 2.400.000.",
        status: "verified",
      },
      {
        title: "2. Koordinasi ke Mbak Maya (Pembukuan)",
        detail: "Jurnal kas & penjualan tercatat seimbang tanpa selisih.",
        status: "verified",
      },
      {
        title: "3. Koordinasi ke Mas Dimas (Pajak)",
        detail: "Akumulasi omzet dicatat, hak bebas pajak Rp 500M diperbarui.",
        status: "verified",
      },
      {
        title: "4. Pembaruan Laporan Keuangan",
        detail: "Posisi kas dan laba bersih langsung sinkron 100%.",
        status: "verified",
      },
    ],
    activeArtifact: {
      title: "Alur Koordinasi Tim Otomatis",
      type: "orchestration_pipeline",
      summary: "Sinkronisasi Penuh Tim Keuangan Digital",
      highlight: "Semua Berjalan Otomatis 24/7",
      statutePill: "Kerja Terintegrasi",
      details: [
        { key: "Status Tim", value: "3 Staf Bekerja Kompak" },
        { key: "Alur Kerja", value: "Foto Struk -> Pembukuan -> Pajak -> Izin Usaha" },
        { key: "Keamanan Angka", value: "Terkunci & Pas (Tanpa Human Error)" },
        { key: "Kecepatan Respon", value: "Di bawah 2 detik per transaksi" },
      ],
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
        text: "Halo kak! Saya Maya, akuntan pribadi usaha kakak. Ada nota belanja atau transaksi penjualan hari ini? Kirim ke Maya ya, nanti langsung Maya rapikan pembukuannya sampai pas.",
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
        title: "2. Menentukan Pos Pembukuan yang Tepat",
        detail: "Memetakan ke Persediaan Bahan dan Kas Tunai Toko.",
        status: "verified",
        statuteCitation: "Standar Akuntansi UMKM",
      },
      {
        title: "3. Pemeriksaan Keseimbangan Angka",
        detail: "Debit Rp 350.000 = Kredit Rp 350.000. Selisih Rp 0 terbukti seimbang.",
        status: "verified",
      },
      {
        title: "4. Catatan Resmi Disimpan",
        detail: "Tercatat rapi di laporan posisi keuangan usaha Anda.",
        status: "verified",
      },
    ],
    activeArtifact: {
      title: "Jurnal Pembukuan Resmi",
      type: "journal",
      summary: "Pembelian Bahan Baku Kopi & Susu Tunai",
      highlight: "Rp 350.000 (Seimbang Pas)",
      statutePill: "Debit = Kredit Pas",
      details: [
        { key: "Nomor Catatan", value: "JN-20261018-0042" },
        { key: "Uraian Debit", value: "Persediaan Barang Dagang (Rp 350.000)" },
        { key: "Uraian Kredit", value: "Kas Tunai Toko (Rp 350.000)" },
        { key: "Selisih Perhitungan", value: "Rp 0 (100% Pas)" },
      ],
    },
  },
  dimas: {
    id: "dimas",
    name: "Mas Dimas",
    title: "Konsultan Pajak",
    titleEn: "Tax Consultant",
    roleDescription: "Perhitungan Pajak UMKM 0,5%",
    roleDescriptionEn: "0.5% Final Tax Calculator",
    badge: "Pajak",
    badgeEn: "Taxes",
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
        text: "Kabar gembira kak! Karena usaha kakak berbentuk Orang Pribadi dan total omzet kumulatif tahun ini baru Rp 280 juta (masih di bawah batas Rp 500 juta), pajak bulan ini Rp 0 alias BEBAS PAJAK sesuai aturan pemerintah. Kuota bebas pajak kakak masih tersisa Rp 220 juta lagi. Lembar rinciannya sudah Dimas siapkan di sebelah kanan ya.",
        timestamp: "10:09",
      },
    ],
    thinkingFlow: [
      {
        title: "1. Cek Bentuk Usaha",
        detail: "Usaha terdaftar atas nama Orang Pribadi.",
        status: "verified",
        statuteCitation: "Aturan Pajak UMKM PP 55",
      },
      {
        title: "2. Cek Total Penjualan Tahun Ini",
        detail: "Total omzet s/d bulan ini Rp 280 juta (belum tembus batas 500 juta).",
        status: "verified",
      },
      {
        title: "3. Hitung Pajak yang Wajib Disetor",
        detail: "Omzet belum kena pajak. Tagihan pajak bulan ini: Rp 0.",
        status: "verified",
      },
      {
        title: "4. Perlindungan Kuota Bebas Pajak",
        detail: "Sisa kuota bebas pajak Rp 220 juta aman tercatat.",
        status: "verified",
      },
    ],
    activeArtifact: {
      title: "Rincian Tagihan Pajak Bulan Ini",
      type: "tax_voucher",
      summary: "Peredaran Bruto Belum Melebihi Batas 500 Juta",
      highlight: "Rp 0 (Bebas Pajak)",
      statutePill: "Fasilitas Bebas Pajak",
      details: [
        { key: "Bentuk Usaha", value: "Wajib Pajak Orang Pribadi" },
        { key: "Penjualan Bulan Ini", value: "Rp 42.000.000" },
        { key: "Total Penjualan 2026", value: "Rp 280.000.000" },
        { key: "Sisa Bebas Pajak", value: "Rp 220.000.000 tersisa" },
        { key: "Pajak Wajib Disetor", value: "Rp 0 (Bebas Pajak)" },
      ],
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
    welcomeMessage: "Selamat datang kak! Saya Pak Arief. Saya membantu memilihkan kode KBLI 5 digit resmi dan memastikan izin usaha OSS kakak lengkap, tanpa istilah hukum yang rumit.",
    welcomeMessageEn: "Welcome! I am Pak Arief. I help you map the official 5-digit KBLI code and ensure your business permits are 100% complete without legal confusion.",
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
        text: "Pilihan pas kak! Berdasarkan klasifikasi resmi, usaha kakak masuk ke KBLI 56303 (Rumah Minum/Kafe). Tingkat risikonya tergolong Rendah, artinya kakak CUKUP memiliki Nomor Induk Berusaha (NIB). NIB ini sudah otomatis berlaku sebagai izin operasional resmi. Rincian izinnya bisa kakak cek di sebelah kanan.",
        timestamp: "11:23",
      },
    ],
    thinkingFlow: [
      {
        title: "1. Memahami Cerita Usaha Anda",
        detail: "Minuman kopi olahan dan makanan ringan dinikmati di tempat.",
        status: "verified",
      },
      {
        title: "2. Menemukan Kode Resmi yang Cocok",
        detail: "Terdaftar resmi pada KBLI 56303 (Rumah Minum / Kafe).",
        status: "verified",
      },
      {
        title: "3. Penilaian Syarat Dokumen",
        detail: "Kategori Usaha Rendah Risiko untuk skala UMKM.",
        status: "verified",
      },
      {
        title: "4. Izin Usaha Terverifikasi Sah",
        detail: "Cukup memiliki NIB, sudah boleh langsung jualan secara sah.",
        status: "verified",
      },
    ],
    activeArtifact: {
      title: "Kartu Syarat Izin Usaha",
      type: "licensing_card",
      summary: "KBLI 56303 - Rumah Minum/Kafe",
      highlight: "Cukup Punya NIB (Izin Lengkap)",
      statutePill: "Izin Sah Pemerintah",
      details: [
        { key: "Kode KBLI Resmi", value: "56303 (Rumah Minum / Kafe)" },
        { key: "Tingkat Risiko", value: "Rendah (Low Risk)" },
        { key: "Syarat Izin", value: "NIB berlaku sebagai izin sah penuh" },
        { key: "Sertifikasi Tambahan", value: "Tidak butuh izin rumit tambahan" },
      ],
    },
  },
};
