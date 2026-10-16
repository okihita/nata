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

export const copy = {
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

  // ── Navigasi utama ────────────────────────────────────────────────────────
  nav: {
    groups: [
      { label: "Ringkasan", items: ["dashboard"] },
      { label: "Operasional", items: ["catat", "transaksi", "akun"] },
      { label: "Laporan", items: ["laporan", "pajak"] },
      { label: "Lainnya", items: ["usaha", "pengaturan"] },
    ],
    dashboard: "Dasbor",
    catat: "Catat Struk",
    transaksi: "Transaksi",
    akun: "Daftar Akun",
    laporan: "Laporan Keuangan",
    pajak: "Pajak",
    usaha: "Profil Usaha",
    pengaturan: "Pengaturan",
    comingSoon: "Segera hadir",
  },

  common: {
    comingSoonTitle: "Fitur ini segera hadir",
    comingSoonBody:
      "Kami sedang menyiapkannya. Untuk sekarang, silakan pakai menu Catat Struk, Transaksi, dan Laporan Keuangan.",
    backToDashboard: "Kembali ke dasbor",
    save: "Simpan",
    cancel: "Batal",
    close: "Tutup",
    loading: "Memuat…",
    reset: "Mulai ulang",
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
    needsUnpaid: (count: number, amount: string) =>
      `${count} utang usaha belum dibayar (${amount})`,
    letNataHandle: "Biarkan Nata yang mencatat",
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
    exportSoon: "Ekspor segera hadir",
  },

  pajak: {
    title: "Pajak",
    subtitle: "Perhitungan PPh Final UMKM Anda.",
    scheme: "PPh Final UMKM — PP 55/2022",
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
    exemptionRemaining: (amount: string) => `Sisa ${amount} sebelum mulai kena pajak.`,
    exemptionUsed: (percent: string) => `${percent} dari kuota bebas pajak sudah terpakai.`,
    exemptBanner:
      "Omzet Anda masih di bawah batas bebas pajak, jadi pajak terutang Rp 0. Nata akan menghitungnya otomatis begitu omzet melewati batas.",
    perMonth: (amount: string) => `≈ ${amount} per bulan`,
    basedOn: (months: number) => `dihitung dari ${months} bulan data`,
  },

  comingSoon: {
    usaha: "Profil Usaha",
    usahaBody:
      "Kelola data usaha, NPWP, dan identitas pemilik di sini. Segera hadir.",
    pengaturan: "Pengaturan",
    pengaturanBody:
      "Atur bahasa, mata uang, dan preferensi tampilan Anda di sini. Segera hadir.",
  },

  status: {
    working: "Diproses…",
    recorded: "Tercatat",
    notRecorded: "Belum tercatat",
    waiting: "Menunggu",
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
  },
} as const;
