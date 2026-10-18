/**
 * Semua teks yang dilihat pengguna, dikumpulkan di satu tempat.
 *
 * Audiensnya adalah pemilik usaha kecil di Indonesia (warung, toko, kafe),
 * jadi bahasanya menghindari istilah akuntansi yang kaku dan memakai kata
 * sehari-hari yang sudah mereka pakai: "struk", "pembukuan", "uang masuk",
 * "bayar nanti".
 *
 * Semua teks dikumpulkan di modul ini supaya nanti gampang menambah pilihan
 * bahasa (Indonesia / Inggris) tanpa menulis ulang tampilan.
 *
 * Catatan: komentar kode tetap berbahasa Inggris (untuk programmer), hanya
 * teks yang tampil di layar yang berbahasa Indonesia.
 */

export const copyId = {
  app: {
    name: "Nata",
    tagline: "Dari struk, jadi pembukuan rapi — otomatis.",
    badge: "Gemini di Google Cloud",
    metadataTitle: "Nata — Dari struk jadi pembukuan, otomatis",
    metadataDescription:
      "Foto struk, Nata catat sendiri ke pembukuan usaha Anda — rangkap dua, sesuai SAK EMKM, siap untuk pajak. Dibuat untuk UMKM Indonesia.",
    workspace: "Warung Kopi Nusantara",
    workspaceType: "Usaha mikro · Jakarta",
  },

  entityLabels: {
    orang_pribadi: "Orang pribadi",
    pt_perorangan: "PT Perorangan",
    pt_cv: "PT / CV / koperasi",
  },

  typeLabels: {
    warung: "Warung",
    toko: "Toko",
    kafe: "Kafe / Restoran",
    jasa: "Jasa",
    lainnya: "Usaha",
  },

  typeHints: {
    warung: "Makanan & minuman siap saji",
    toko: "Barang dagangan, kelontong, retail",
    kafe: "Kedai, kafe, rumah makan",
    jasa: "Layanan, perbaikan, konsultan",
    lainnya: "Usaha lain",
  },

  workspaceSwitcher: {
    badgeCallout: "Hackathon: Klik untuk ganti persona",
    activeLabel: "Usaha Aktif",
    archetypeBadge: "Arketipe Hackathon",
    guestBadge: "Lokal / Tamu",
    archetypeHeading: "Pilih Arketipe Instan (Juri & Bot)",
    syncHeading: "Penyimpanan & Sinkronisasi",
    createNew: "Buat Usaha Baru (Transien)",
    createNewHint: "Uji coba formulir onboarding sendiri",
    cloudSave: "Simpan Usaha ke Cloud",
    cloudSaveHint: "Permanenkan data ke Firebase Multi-Tenant",
    cloudAlert: "Fitur Cloud Profile: Siap disinkronkan ke Firebase Firestore saat produksi.",
    personaRetailHint: "Retail & E-Commerce (Shopee/TikTok)",
    personaFnbHint: "F&B Multi-Outlet (POS & Resto)",
  },

  // ── Navigasi utama ────────────────────────────────────────────────────────
  nav: {
    groups: [
      { label: "Ringkasan", items: ["dashboard"] },
      { label: "Operasional", items: ["catat", "transaksi", "akun"] },
      { label: "Laporan", items: ["laporan", "pajak"] },
      { label: "Lainnya", items: ["usaha", "pengaturan"] },
    ],
    groupLabels: {
      summary: "Ringkasan",
      operations: "Operasional",
      master: "Data Induk",
      reports: "Laporan",
      other: "Lainnya",
    },
    dashboard: "Dasbor",
    catat: "Catat Struk",
    transaksi: "Transaksi",
    akun: "Daftar Akun",
    laporan: "Laporan Keuangan",
    pajak: "Pajak",
    perizinan: "Perizinan",
    usaha: "Profil Usaha",
    pengaturan: "Pengaturan",
  },

  common: {
    save: "Simpan",
    cancel: "Batal",
    close: "Tutup",
    loading: "Memuat…",
    reset: "Mulai ulang",
    tryDemo: "Coba data contoh",
    loadDemo: "Muat data contoh",
    seeAll: "Lihat semua",
    total: "Total",
    account: "Akun",
    code: "Kode",
    debit: "Debit",
    credit: "Kredit",
    balance: "Saldo",
    date: "Tanggal",
    description: "Keterangan",
    amount: "Jumlah",
    source: "Sumber",
    group: "Kelompok",
    empty: "Belum ada data.",
  },

  dashboard: {
    title: "Dasbor",
    subtitle: "Ringkasan usaha Anda hari ini.",
    firstRunTitle: "Pembukuan Anda masih kosong",
    firstRunBody:
      "Belum ada satu pun catatan. Mulai dengan memfoto struk pertama Anda — Nata yang mengurus sisanya.",
    firstRunDemoHint: "Belum punya struk? Coba dengan data contoh.",
    emptyChart: "Grafik akan muncul setelah ada transaksi pertama.",
    emptyActivity: "Belum ada aktivitas. Aktivitas terakhir akan tampil di sini.",
    revenue: "Pendapatan",
    expenses: "Beban",
    netIncome: "Laba bersih",
    cash: "Saldo kas",
    taxDue: "Pajak final (0,5%)",
    entries: "Transaksi tercatat",
    thisMonth: "bulan ini",
    allTime: "total",
    recentActivity: "Aktivitas terakhir",
    recentEmpty: "Belum ada transaksi. Mulai dengan mencatat struk pertama Anda.",
    quickActions: "Aksi cepat",
    actionScan: "Foto struk baru",
    actionScanHint: "Catat pengeluaran atau penjualan dari foto",
    actionReport: "Lihat laporan",
    actionReportHint: "Laba rugi dan posisi keuangan",
    actionTax: "Hitung pajak",
    actionTaxHint: "PPh Final UMKM 0,5%",
    agentTitle: "Nata bekerja untuk Anda",
    agentBody:
      "Setiap struk dibaca otomatis, dicatat ke akun yang tepat, dan diperiksa agar kedua sisinya selalu seimbang.",
    chartTitle: "Pendapatan & beban per bulan",
    chartRevenue: "Pendapatan",
    chartExpense: "Beban",
    balanced: "Pembukuan seimbang",
    balancedHint: "Aset = Liabilitas + Ekuitas",
    accountsActive: (n: number) => `${n} akun aktif dipakai`,
    needsAction: "Perlu tindakan",
    needsActionEmpty: "Tidak ada yang perlu ditindak. Pembukuan Anda rapi.",
    needsTaxDue: (amount: string) => `Pajak final periode ini ${amount}`,
    needsTaxExempt: "Omzet masih di bawah batas bebas pajak",
    needsKbli: "Kode KBLI belum ditentukan — perlu untuk perizinan",
    needsUnpaid: (count: number, amount: string) =>
      `${count} utang usaha belum dibayar (${amount})`,
    complianceTitle: "Status usaha Anda",
    complianceEntity: "Bentuk usaha",
    complianceTax: "Perlakuan pajak",
    complianceKbli: "Kode KBLI",
    complianceKbliNone: "Belum ditentukan",
    complianceKbliCta: "Tentukan",
    complianceOpen: "Lihat perizinan",
    ownerHint: "Untuk pemilik usaha — cukup foto struk, sisanya otomatis.",
  },

  add: {
    title: "Catat Struk",
    subtitle: "Masukkan foto struk, Nata catat otomatis ke pembukuan Anda.",
    dropTitle: "Letakkan foto struk di sini",
    dropHint: "atau klik untuk pilih file",
    examplesLabel: "Atau coba contoh",
    submit: "Catat ke pembukuan saya",
    working: "Sedang dicatat…",
    submitted: "Struk berhasil dicatat ke pembukuan.",
    samples: [
      { id: "atk", label: "Beli perlengkapan", hint: "Bayar tunai" },
      { id: "peralatan", label: "Beli peralatan", hint: "Bayar nanti" },
      { id: "penjualan", label: "Penjualan hari ini", hint: "Uang masuk" },
    ],
  },

  activity: {
    title: "Yang Nata kerjakan",
    working: "Sedang mengerjakan struk Anda…",
    idle: "Tambah struk untuk melihat langkah-langkahnya.",
    empty: "Belum ada apa-apa. Pilih struk, lalu tekan ‘Catat ke pembukuan saya’.",
    stillWorking: "Masih diproses…",
    finished: (seconds: string) => `Selesai dalam ${seconds} detik.`,
  },

  books: {
    title: "Jurnal",
    recordedDescription: "Catatan ini sudah tersimpan.",
    rejectedDescription: "Catatan ini tidak jadi disimpan.",
    pendingDescription: "Sedang menyiapkan catatan ini…",
    emptyDescription: "Jurnal Anda akan muncul di sini.",
    empty: "Belum ada catatan.",
  },

  transaksi: {
    title: "Transaksi",
    subtitle: "Semua catatan yang sudah masuk ke pembukuan Anda.",
    searchPlaceholder: "Cari keterangan atau akun…",
    filterAll: "Semua",
    filterOcr: "Dari struk",
    filterManual: "Manual",
    countLabel: (n: number) => `${n} transaksi`,
    emptyTitle: "Belum ada transaksi",
    emptyBody: "Setelah Anda mencatat struk, semua transaksinya muncul di sini.",
    detailTitle: "Rincian transaksi",
    balanced: "Seimbang",
    viewReceipt: "Lihat struk",
    export: "Ekspor jurnal",
    exported: "Jurnal diekspor sebagai CSV.",
  },

  akun: {
    title: "Daftar Akun",
    subtitle: "Akun buku besar sesuai SAK EMKM untuk usaha mikro dan kecil.",
    aset: "Aset",
    liabilitas: "Liabilitas",
    ekuitas: "Ekuitas",
    pendapatan: "Pendapatan",
    beban: "Beban",
    normalDebit: "Saldo normal: Debit",
    normalCredit: "Saldo normal: Kredit",
    used: "Dipakai",
    unused: "Belum dipakai",
    emptyBalance: "—",
    emptyTitle: "Belum ada akun yang dipakai",
    emptyBody:
      "Daftar ini terisi sendiri begitu Anda mencatat transaksi — Nata memilih akun yang sesuai untuk tiap struk.",
  },

  laporan: {
    title: "Laporan Keuangan",
    subtitle: "Disusun otomatis dari pembukuan Anda, sesuai SAK EMKM.",
    selectPeriod: "Periode",
    allPeriods: "Semua periode",
    labaRugi: "Laporan Laba Rugi",
    posisi: "Laporan Posisi Keuangan",
    calk: "Catatan atas Laporan Keuangan",
    revenue: "Pendapatan",
    expenses: "Beban",
    totalRevenue: "Total pendapatan",
    totalExpenses: "Total beban",
    netIncome: "Laba bersih",
    assets: "Aset",
    liabilities: "Liabilitas",
    equity: "Ekuitas",
    totalAssets: "Total aset",
    totalLiabilities: "Total liabilitas",
    totalEquity: "Total ekuitas",
    currentYearProfit: "Laba tahun berjalan",
    balancedNote: "Aset = Liabilitas + Ekuitas terpenuhi.",
    unbalancedNote: "Ada selisih pada pembukuan. Periksa kembali catatan Anda.",
    difference: "Selisih",
    period: "Periode",
    calkIntro:
      "Laporan keuangan disusun berdasarkan Standar Akuntansi Keuangan Entitas Mikro, Kecil, dan Menengah (SAK EMKM).",
    calkPoints: [
      "Catatan disusun dengan metode akrual dan dasar biaya historis.",
      "Penyusutan peralatan dihitung dengan metode garis lurus tanpa nilai residu.",
      "Pajak penghasilan menggunakan skema PPh Final UMKM 0,5% dari peredaran bruto.",
    ],
    export: "Ekspor",
    exported: "Laporan diekspor sebagai CSV.",
    emptyTitle: "Laporan muncul setelah ada catatan",
    emptyBody:
      "Laporan keuangan disusun dari pembukuan Anda. Catat struk pertama dulu, lalu laporan ini akan terisi sendiri.",
  },

  perizinan: {
    title: "Perizinan",
    subtitle: "Kode KBLI 2020 untuk usaha Anda, dari katalog resmi.",
    describeTitle: "Usaha Anda melakukan apa?",
    describeHint:
      "Tulis dengan bahasa sehari-hari. Nata mencocokkannya ke kode KBLI resmi — bukan menebak.",
    describePlaceholder:
      "Contoh: warung yang menjual makanan dan minuman, pembeli makan di tempat.",
    run: "Cari kode KBLI",
    running: "Mencari kode…",
    rerun: "Cari ulang",
    reset: "Mulai ulang",
    done: (seconds: string) => `Selesai dalam ${seconds} detik.`,
    candidatesTitle: "Kode yang dipertimbangkan",
    candidatesHint:
      "Diambil dari katalog KBLI 2020 \u2014 1.790 kode resmi. Anda bisa melihat pilihannya.",
    chosen: "Dipilih",
    useThis: "Pakai ini",
    verifyFailed: (code: string) =>
      `Kode ${code} tidak bisa diverifikasi di katalog. Coba kandidat lain.`,
    emptyTitle: "Belum ada kode KBLI",
    emptyBody:
      "Jelaskan kegiatan usaha Anda, lalu tekan Cari kode KBLI. Nata akan mencocokkannya ke katalog resmi.",
    resultTitle: "Kode KBLI Anda",
    resultHintVerified: "Kode ini ada di katalog resmi KBLI 2020.",
    resultHintEmpty: "Hasil akan muncul di sini setelah pencarian.",
    fromCascade: "Diverifikasi dari pencatatan struk",
    codeLabel: "Kode",
    officialNameLabel: "Nama resmi",
    verified: "Terverifikasi",
    hierarchyLabel: "Posisi dalam klasifikasi",
    noResult: "Belum ada kode terverifikasi. Jalankan pencarian dulu.",
    riskTitle: "Tingkat risiko & izin",
    riskLevelLabel: "Tingkat risiko",
    riskUnknown: "Perlu dicek di OSS-RBA",
    riskNote:
      "Katalog KBLI tidak memuat tingkat risiko (Rendah/Menengah/Tinggi) maupun syarat izinnya. Nata sengaja tidak menebak keduanya, karena keduanya berasal dari OSS-RBA dan berdampak hukum.",
    ossHint:
      "Langkah berikutnya: buka oss.go.id, masukkan kode di atas, lalu ikuti persyaratan yang muncul untuk usaha Anda.",
    agentTitle: "Penjelasan Agent Regulasi",
  },

  pajak: {
    title: "Pajak",
    subtitle: "Perhitungan PPh Final UMKM Anda.",
    scheme: "PPh Final UMKM — PP 55/2022",
    entityTitle: "Perlakuan pajak usaha Anda",
    entityExemptTitle: "Bebas pajak sampai Rp 500 juta",
    entityExemptBody:
      "Sebagai Wajib Pajak orang pribadi, omzet sampai Rp 500 juta dalam satu tahun tidak dikenai PPh Final. Pajak baru dihitung dari kelebihannya.",
    entityTaxedTitle: "Kena pajak sejak rupiah pertama",
    entityTaxedBody:
      "Sebagai badan usaha, tidak ada pembebasan Rp 500 juta. Seluruh omzet dikenai tarif 0,5% sejak awal.",
    entityChangeHint: "Ubah bentuk usaha Anda di Profil Usaha.",
    rateLabel: "Tarif",
    turnoverLabel: "Peredaran bruto (omzet)",
    baseLabel: "Dasar pengenaan pajak",
    exemptionLabel: "Omzet bebas pajak",
    payableLabel: "Pajak terutang",
    monthlyLabel: "Estimasi per bulan",
    exemptNote:
      "Omzet sampai Rp 500 juta bebas pajak untuk Wajib Pajak orang pribadi. PT Perorangan tidak mendapat pembebasan ini.",
    note:
      "PPh Final dihitung dari omzet (peredaran bruto), bukan dari laba. Angka di halaman ini adalah estimasi dan bukan pengganti konsultasi pajak.",
    breakdown: "Rincian perhitungan",
    estimateOnly: "Estimasi",
    exemptionUsage: "Pemakaian kuota bebas pajak",
    emptyTitle: "Pajak muncul setelah ada catatan",
    emptyBody:
      "PPh Final dihitung dari omzet yang tercatat di pembukuan Anda. Catat struk pertama dulu — penjualan atau pengeluaran — lalu pajaknya dihitung otomatis.",
    noQuotaTitle: "Tidak ada kuota bebas pajak",
    noQuotaBody:
      "Badan usaha tidak mendapat pembebasan Rp 500 juta, jadi seluruh omzet dikenai tarif 0,5% sejak rupiah pertama.",
    noQuotaCitation:
      "Dasar hukum: PP 55/2022 Pasal 60 ayat (2) — pembebasan hanya untuk Wajib Pajak orang pribadi.",
    exemptionRemaining: (amount: string) => `Sisa ${amount} sebelum mulai kena pajak.`,
    exemptionUsed: (percent: string) => `${percent} dari kuota bebas pajak sudah terpakai.`,
    exemptBanner:
      "Omzet Anda masih di bawah batas bebas pajak, jadi pajak terutang Rp 0. Nata akan menghitungnya otomatis begitu omzet melewati batas.",
    perMonth: (amount: string) => `≈ ${amount} per bulan`,
    basedOn: (months: number) => `dihitung dari ${months} bulan data`,
    agentTitle: "Pemeriksaan pajak oleh Agent Fiskal",
    agentRun: "Hitung pajak dengan Agent Fiskal",
    agentRerun: "Hitung ulang",
    agentRunning: "Agent Fiskal sedang menghitung…",
    agentDone: (seconds: string) => `Selesai dalam ${seconds} detik.`,
    agentNote:
      "Nata memakai omzet (peredaran bruto) yang tercatat di pembukuan, bukan laba. Setiap angka disertai dasar hukumnya.",
    legalBasis: "Dasar hukum",
    verbatimQuote: "Kutipan Pasal",
    officialCalc: "Perhitungan resmi Agent Fiskal",
    noAgentYet:
      "Belum dihitung oleh Agent Fiskal. Angka di atas dihitung langsung dari pembukuan Anda; jalankan agent untuk melihat dasar hukum tiap angka.",
    handoffFrom: (from: string, to: string) => `${from} menyerahkan catatan ke ${to}`,
    fromBooks: "Dari pembukuan Anda",
  },

  // ── Onboarding & Profil Usaha ─────────────────────────────────────────────
  onboarding: {
    title: "Kenalan dulu, yuk",
    subtitle: "Isi data usaha Anda sebentar. Setelah ini, Nata langsung bisa bekerja.",
    submit: "Mulai pakai Nata",
    note: "Data ini hanya tersimpan di perangkat Anda.",
  },

  usaha: {
    title: "Profil Usaha",
    subtitle: "Data usaha Anda dipakai di seluruh pembukuan dan laporan.",
    identity: "Identitas usaha",
    identityHint: "Nama ini akan tampil di laporan dan dokumen Anda.",
    nameLabel: "Nama usaha",
    ownerLabel: "Nama pemilik",
    ownerPlaceholder: "Nama Anda",
    typeLabel: "Jenis usaha",
    entityLabel: "Bentuk badan usaha",
    entityHint:
      "Ini menentukan apakah omzet Rp 500 juta pertama bebas pajak. Pilih yang paling sesuai dengan surat izin usaha Anda.",
    entityExempt: "Bebas pajak s.d. Rp 500 jt",
    entityTaxed: "Kena pajak dari Rp 0",
    entityCitation:
      "Dasar hukum: PP 55/2022 Pasal 60 ayat (2) — pembebasan Rp 500 juta hanya untuk Wajib Pajak orang pribadi.",
    entityHints: {
      orang_pribadi: "Usaha milik pribadi. Omzet sampai Rp 500 juta bebas pajak.",
      pt_perorangan: "Perseroan terbatas milik satu orang. Tanpa pembebasan Rp 500 juta.",
      pt_cv: "Badan usaha bermitra atau berbadan hukum. Tanpa pembebasan.",
    },
    kbliLabel: "Kode KBLI 2020",
    kbliNone: "Belum ditentukan",
    kbliNoneHint: "Tentukan di halaman Perizinan.",
    kbliInvalidated:
      "Jenis usaha berubah, jadi kode KBLI sebelumnya dihapus. Tentukan ulang di Perizinan.",
  },

  // ── Halaman muka (landing) ────────────────────────────────────────────────
  landing: {
    navHow: "Cara kerja",
    navWhy: "Kenapa Nata",
    navStart: "Mulai sekarang",
    heroBadge: "Pakai Gemini di Google Cloud",
    heroTitle: "Dari foto struk, jadi pembukuan rapi.",
    heroBody:
      "Nata membaca struk Anda, mencatatnya ke pembukuan rangkap dua sesuai SAK EMKM, menghitung PPh Final 0,5%, lalu menentukan kode KBLI usaha Anda — lengkap dengan dasar hukumnya. Tanpa akuntan, tanpa spreadsheet.",
    heroCta: "Mulai gratis",
    heroSecondary: "Lihat cara kerjanya",
    heroFootnote: "Untuk warung, toko, kafe, dan usaha jasa di Indonesia.",
    problemTitle: "Pembukuan itu merepotkan. Itu sebabnya banyak yang menyerah.",
    problems: [
      {
        title: "Mencatat manual membosankan",
        body: "Setelah seharian melayani pembeli, menyusun pembukuan dari tumpukan struk adalah hal terakhir yang ingin Anda kerjakan.",
      },
      {
        title: "Jasa akuntan mahal",
        body: "Konsultan pembukuan bulanan bisa lebih mahal daripada laba usaha kecil — padahal yang dibutuhkan hanya pembukuan yang rapi.",
      },
      {
        title: "Tidak ada bukti untuk bank",
        body: "Tanpa catatan resmi, usaha yang sehat pun sulit mengajukan modal — karena bank tidak bisa menilai usahanya.",
      },
    ],
    howTitle: "Cara kerja Nata",
    howBody: "Tiga langkah. Yang Anda lakukan hanya yang pertama.",
    steps: [
      {
        title: "Isi data usaha",
        body: "Nama usaha, dan status pajak Anda. Sekali saja, kurang dari satu menit.",
      },
      {
        title: "Foto struknya",
        body: "Belanja, penjualan, honor — apa saja. Nata membaca foto dan menentukan akunnya sendiri, sesuai SAK EMKM.",
      },
      {
        title: "Pembukuan, pajak & izin beres",
        body: "Pembukuan dua sisi yang seimbang, laporan keuangan, PPh Final 0,5%, dan kode KBLI 2020 untuk perizinan — semuanya beserta dasar hukumnya.",
      },
    ],
    whyTitle: "Kenapa Nata berbeda",
    reasons: [
      {
        title: "Model mengusulkan, kode yang memutuskan",
        body: "Nata hanya menyimpan catatan yang benar-benar seimbang. Setiap angka diperiksa oleh kode, bukan oleh model.",
      },
      {
        title: "Dasar hukum di setiap angka",
        body: "Pajak dihitung dari teks resmi PP 55/2022, dan kode KBLI diperiksa ke katalog resmi 1.790 kode — setiap angka dan kode disertai sumbernya.",
      },
      {
        title: "Berjalan di Google Cloud",
        body: "Gemini di Vertex AI, di atas Cloud Run — infrastruktur yang sama dengan yang dipakai perusahaan besar.",
      },
    ],
    proofTitle: "Bukan sekadar catatan. Ini pembukuan sungguhan.",
    proofBody:
      "Setiap struk melewati pemeriksaan yang sama seperti pembukuan manual: kedua sisi harus seimbang, dan setiap angka pajak disertai dasar hukumnya.",
    proofItems: [
      {
        icon: "scan",
        title: "Kedua sisi selalu seimbang",
        body: "Model hanya mengusulkan. Kode yang memutuskan — catatan yang tidak seimbang ditolak, bukan disimpan.",
      },
      {
        icon: "book",
        title: "Laporan sesuai SAK EMKM",
        body: "Laba rugi, posisi keuangan, dan CALK disusun otomatis dari jurnal — bukan dari kolom yang diisi manual.",
      },
      {
        icon: "tax",
        title: "Pajak dengan kutipan Pasal",
        body: "PPh Final 0,5% dihitung dari teks resmi PP 55/2022, dan setiap angka menyertakan Pasal/Ayat-nya.",
      },
      {
        icon: "license",
        title: "Kode KBLI yang terverifikasi",
        body: "Kegiatan usaha Anda dicocokkan ke katalog resmi KBLI 2020, dan kodenya diperiksa sebelum disimpan — bukan dikarang.",
      },
    ],
    ctaTitle: "Mulai pembukuan Anda hari ini",
    ctaBody: "Gratis untuk memulai. Cukup satu usaha, satu ponsel.",
    ctaButton: "Mulai gratis sekarang",
    footerTagline: "Pembukuan otomatis untuk usaha Indonesia.",
  },

  pengaturan: {
    title: "Pengaturan",
    subtitle: "Kelola data usaha Anda di perangkat ini.",
    dataTitle: "Data usaha",
    dataBody: (name: string, count: number) =>
      `${name} — ${count} catatan tersimpan di perangkat ini.`,
    demoTitle: "Muat data contoh",
    demoBody: "Isi pembukuan dengan contoh usaha kafe untuk mencoba semua layar.",
    demoLoaded: "Data contoh dimuat.",
    clearTitle: "Kosongkan pembukuan",
    clearBody: "Hapus semua catatan, tetapi tetap simpan profil usaha Anda.",
    clearAction: "Kosongkan",
    clearConfirmTitle: "Kosongkan pembukuan?",
    clearConfirmBody:
      "Semua transaksi akan dihapus dan tidak bisa dikembalikan. Profil usaha Anda tetap tersimpan.",
    cleared: "Pembukuan dikosongkan.",
    dangerTitle: "Hapus usaha ini",
    dangerBody:
      "Menghapus usaha beserta seluruh pembukuannya dari perangkat ini, dan mengembalikan Anda ke halaman awal.",
    resetAction: "Hapus semua data",
    resetConfirmTitle: "Hapus semua data?",
    resetConfirmBody:
      "Profil usaha dan seluruh catatan akan dihapus permanen dari perangkat ini. Tindakan ini tidak bisa dibatalkan.",
    reset: "Semua data dihapus.",
  },

  errorScreen: {
    title: "Layar ini gagal dimuat",
    body:
      "Ada gangguan teknis saat menampilkan halaman ini. Catatan Anda tidak berubah — tidak ada yang setengah tersimpan.",
    retry: "Coba muat ulang",
    reference: "Kode rujukan",
  },

  notFound: {
    title: "Halaman tidak ditemukan",
    body:
      "Tautan yang Anda buka tidak ada, atau sudah berpindah. Pembukuan Anda tetap aman.",
    toApp: "Buka pembukuan saya",
    toLanding: "Ke halaman utama",
  },

  status: {
    working: "Diproses…",
    recorded: "Tercatat",
    notRecorded: "Belum tercatat",
    waiting: "Menunggu",
  },

  agents: {
    keuangan: "Agent Keuangan",
    fiskal: "Agent Fiskal",
    regulasi: "Agent Regulasi",
    keuanganRole: "Mencatat pembukuan",
    fiskalRole: "Menghitung pajak",
    regulasiRole: "Menentukan kode KBLI",
  },

  steps: {
    reading: {
      title: "Membaca struk Anda",
      detail: "Mencari nama toko, tanggal, barang, dan totalnya.",
    },
    matching: (lineCount: number) => ({
      title: "Dicatat ke akun",
      detail: `${lineCount} baris disiapkan sesuai SAK EMKM.`,
    }),
    matchingNoLines: {
      title: "Dicatat ke akun",
      detail: "Catatan sudah siap.",
    },
    checking: {
      title: "Memastikan hitungan pas",
      detail: "Memastikan kedua sisi cocok sebelum disimpan.",
    },
    posted: {
      title: "Masuk ke pembukuan",
      detail: "Hitungannya pas, jadi sudah tercatat.",
    },
    problem: { title: "Dihentikan sebelum dicatat" },
    handoff: {
      title: "Diteruskan ke pemeriksa pajak",
      detail: "Catatan diteruskan ke Agent Fiskal untuk dihitung pajaknya.",
    },
    handoffRegulasi: {
      title: "Diteruskan ke pemeriksa izin",
      detail: "Pajak selesai. Catatan diteruskan ke Agent Regulasi untuk kode KBLI.",
    },
    kbliChecking: {
      title: "Mencari kode KBLI 2020",
      detail: "Mencocokkan kegiatan usaha ke katalog resmi KBLI 2020.",
    },
    kbliVerify: {
      title: "Memeriksa kode ke katalog",
      detail: "Memastikan kodenya benar-benar ada di katalog KBLI 2020.",
    },
    kbliDone: {
      title: "Kode KBLI terverifikasi",
      detail: "Kode ditemukan di katalog resmi.",
    },
    taxChecking: {
      title: "Menghitung PPh Final 0,5%",
      detail: "Memakai omzet yang tercatat dan mengecek pembebasan Rp 500 juta.",
    },
    taxDone: {
      title: "Pajak selesai dihitung",
      detail: "Tiap angka disertai dasar hukum Pasal/Ayat.",
    },
    failure: {
      title: "Kali ini belum berhasil",
      detail: "Struk tidak dicatat. Tidak ada yang masuk ke pembukuan Anda.",
    },
  },

  problems: {
    unbalanced:
      "Kedua sisi catatan belum pas, jadi belum disimpan. Coba struk ini sekali lagi.",
    tooFewLines: "Catatan ini butuh minimal dua baris. Coba struk ini sekali lagi.",
    negative: "Ada angka minus, jadi catatan dihentikan. Periksa struknya, ya.",
    emptyAmount:
      "Ada baris yang tidak ada jumlahnya, jadi catatan dihentikan. Coba struk ini sekali lagi.",
    fallback: "Catatan ini belum lolos pemeriksaan, jadi belum disimpan.",
  },

  balance: {
    checking: "Memastikan kedua sisi pas…",
    ok: "Sudah pas — semuanya cocok. Tercatat di pembukuan Anda.",
    bad: "Kedua sisi belum pas, jadi belum disimpan.",
  },

  banner: {
    title: "Ada yang perlu dicek",
    offline:
      "Kami belum bisa terhubung ke layanan pembukuan. Pastikan Nata sedang berjalan, lalu coba lagi.",
    busy:
      "Layanan sedang sibuk dan belum bisa memproses permintaan ini. Catatan Anda tidak berubah — tunggu sebentar, lalu coba lagi.",
    timeout:
      "Prosesnya memakan waktu lebih lama dari biasanya. Catatan Anda tidak berubah — coba lagi sebentar lagi.",
  },
} as const;
