/**
 * Usaha (business) — identitas yang memiliki pembukuan.
 *
 * Sampai sekarang aplikasi ini hanya punya satu pembukuan implisit di browser.
 * Model `Business` menjadikan "usaha" sebagai entitas sungguhan: setiap catatan
 * jurnal, laporan, dan perhitungan pajak adalah milik satu usaha.
 *
 * Modul ini murni model + penyimpanan (localStorage). Nanti, saat pindah ke
 * Firebase Auth + Firestore, bentuk datanya tidak berubah — hanya lapisan
 * penyimpanannya yang diganti. Itu sebabnya tipe-tipe di sini sengaja
 * disimpan terpisah dari React.
 */

/**
 * Bentuk badan usaha. Ini yang menentukan apakah pembebasan Rp 500 juta
 * berlaku (Pasal 60 ayat (2) — hanya orang pribadi). Bedanya dengan versi lama:
 * dulu hanya ada dua nilai (`orang_pribadi` / `badan`), sehingga **PT Perorangan**
 * tidak bisa dibedakan — padahal PT Perorangan adalah badan usaha dan tidak
 * mendapat pembebasan itu.
 */
export type EntityType = "orang_pribadi" | "pt_perorangan" | "pt_cv";

/** Bentuk usaha — memengaruhi saran akun dan bahasa yang dipakai. */
export type BusinessType = "warung" | "toko" | "kafe" | "jasa" | "lainnya";

export interface Business {
  id: string;
  /** Nama usaha, e.g. "Warung Bu Siti". Tampil di seluruh aplikasi. */
  name: string;
  /** Nama pemilik — dipakai untuk sapaan dan (nanti) dokumen resmi. */
  ownerName: string;
  type: BusinessType;
  /** Bentuk badan usaha — menentukan perlakuan pajak. */
  entity: EntityType;
  /** Alamat domisili atau operasional usaha. */
  address?: string;
  /** NPWP 16-digit (atau NIK untuk orang pribadi). */
  npwp?: string;
  /** Nomor Induk Berusaha (NIB) dari OSS RBA. */
  nib?: string;
  /**
   * Kode KBLI 2020 yang sudah **diverifikasi** Agent Regulasi terhadap katalog,
   * beserta judul resminya. Ini atribut tetap usaha (seperti NPWP), bukan hasil
   * sesaat — karena itu disimpan di profil, bukan hanya di cache layar.
   */
  kbliCode?: string;
  kbliTitle?: string;
  /**
   * Posisi kode itu dalam klasifikasi (divisi → kelompok). Disimpan bersama
   * kodenya supaya layar bisa menampilkan hierarkinya tanpa memanggil agen lagi —
   * termasuk bila kode itu diverifikasi oleh pencatatan struk, bukan oleh layar
   * Perizinan.
   */
  kbliHierarchy?: { level: string; code: string; title: string }[];
  /** Dokumen legalitas dan sertifikasi usaha beserta tanggal & status. */
  legalDocuments?: {
    id: string;
    type: string;
    number: string;
    issuer: string;
    issueDate: string;
    validUntil?: string;
    status: "verified" | "active" | "in_review";
  }[];
  createdAt: string;
}

export const BUSINESS_STORAGE_KEY = "nata.business.v1";

export const BUSINESS_TYPES: { id: BusinessType; label: string; hint: string }[] = [
  { id: "warung", label: "Warung", hint: "Makanan & minuman siap saji" },
  { id: "toko", label: "Toko", hint: "Barang dagangan, kelontong, retail" },
  { id: "kafe", label: "Kafe / Restoran", hint: "Kedai, kafe, rumah makan" },
  { id: "jasa", label: "Jasa", hint: "Layanan, perbaikan, konsultan" },
  { id: "lainnya", label: "Lainnya", hint: "Usaha lain" },
];

/**
 * Profil usaha demo bawaan (Persona A: Retail, Persona B: F&B) untuk hackathon,
 * review, dan development lokal agar aplikasi tidak terblokir onboarding kosong.
 */
export const DEMO_BUSINESS_PROFILES: Record<"persona_a" | "persona_b", Business> = {
  persona_a: {
    id: "biz-persona-a",
    name: "Rona Kirana Beauty",
    ownerName: "Kirana",
    type: "toko",
    entity: "orang_pribadi",
    address: "Jl. Tebet Raya No. 42, Jakarta Selatan, DKI Jakarta 12810",
    npwp: "31.782.910.4-015.000",
    nib: "9120003491823",
    kbliCode: "47725",
    kbliTitle: "Perdagangan Eceran Barang Kosmetik Untuk Manusia",
    kbliHierarchy: [
      { level: "kategori", code: "G", title: "Perdagangan Besar dan Eceran" },
      { level: "golongan_pokok", code: "47", title: "Perdagangan Eceran" },
      { level: "kelompok", code: "47725", title: "Perdagangan Eceran Barang Kosmetik Untuk Manusia" },
    ],
    legalDocuments: [
      {
        id: "doc-nib-01",
        type: "Nomor Induk Berusaha (NIB OSS RBA)",
        number: "9120003491823",
        issuer: "Kementerian Investasi / BKPM RI",
        issueDate: "2026-01-15",
        status: "verified",
      },
      {
        id: "doc-bpom-01",
        type: "Sertifikasi Distribusi Notifikasi Kosmetik",
        number: "NA18250109921",
        issuer: "Badan Pengawas Obat dan Makanan (BPOM)",
        issueDate: "2026-02-10",
        validUntil: "2029-02-10",
        status: "active",
      },
      {
        id: "doc-tax-01",
        type: "Surat Keterangan Terdaftar (SKT Pajak)",
        number: "S-1429/WPJ.04/KP.0303/2026",
        issuer: "KPP Pratama Jakarta Tebet",
        issueDate: "2026-01-20",
        status: "verified",
      },
    ],
    createdAt: "2026-07-01T00:00:00.000Z",
  },
  persona_b: {
    id: "biz-persona-b",
    name: "PT Seduh Rasa Nusantara",
    ownerName: "Budi Santoso",
    type: "kafe",
    entity: "pt_cv",
    address: "Ruko Graha Boulevard Blok B-12, Gading Serpong, Tangerang, Banten 15810",
    npwp: "02.491.823.1-411.000",
    nib: "1283000918231",
    kbliCode: "56303",
    kbliTitle: "Rumah Minum / Kafe",
    kbliHierarchy: [
      { level: "kategori", code: "I", title: "Penyediaan Akomodasi dan Makanan Minuman" },
      { level: "golongan_pokok", code: "56", title: "Penyediaan Makanan dan Minuman" },
      { level: "kelompok", code: "56303", title: "Rumah Minum / Kafe" },
    ],
    legalDocuments: [
      {
        id: "doc-ahu-02",
        type: "SK Pengesahan Pendirian Badan Hukum PT",
        number: "AHU-0019284.AH.01.01.TAHUN 2025",
        issuer: "Kementerian Hukum dan HAM RI (Kemenkumham)",
        issueDate: "2025-11-20",
        status: "verified",
      },
      {
        id: "doc-nib-02",
        type: "Nomor Induk Berusaha (NIB OSS RBA)",
        number: "1283000918231",
        issuer: "Kementerian Investasi / BKPM RI",
        issueDate: "2025-12-05",
        status: "verified",
      },
      {
        id: "doc-slhs-02",
        type: "Sertifikat Laik Higiene Sanitasi (SLHS)",
        number: "443.5/0281/Dinkes-Kab/2026",
        issuer: "Dinas Kesehatan Kabupaten Tangerang",
        issueDate: "2026-02-14",
        validUntil: "2029-02-14",
        status: "active",
      },
      {
        id: "doc-halal-02",
        type: "Ketetapan Halal Minuman & Makanan Olahan",
        number: "ID36110001928310226",
        issuer: "BPJPH Kementerian Agama RI",
        issueDate: "2026-03-01",
        validUntil: "2030-03-01",
        status: "verified",
      },
    ],
    createdAt: "2026-07-01T00:00:00.000Z",
  },
};

export const ENTITY_OPTIONS: {
  id: EntityType;
  label: string;
  hint: string;
  /** Apakah pembebasan Rp 500 juta berlaku (Pasal 60 ayat (2)). */
  exemption: boolean;
}[] = [
  {
    id: "orang_pribadi",
    label: "Orang pribadi",
    hint: "Usaha milik pribadi. Omzet sampai Rp 500 juta bebas pajak.",
    exemption: true,
  },
  {
    id: "pt_perorangan",
    label: "PT Perorangan",
    hint: "Perseroan terbatas milik satu orang. Tanpa pembebasan Rp 500 juta.",
    exemption: false,
  },
  {
    id: "pt_cv",
    label: "PT / CV / koperasi",
    hint: "Badan usaha bermitra atau berbadan hukum. Tanpa pembebasan.",
    exemption: false,
  },
];

export const ENTITY_LABEL: Record<EntityType, string> = {
  orang_pribadi: "Orang pribadi",
  pt_perorangan: "PT Perorangan",
  pt_cv: "PT / CV / koperasi",
};

/** Ringkasan satu baris untuk ditampilkan di bilah atas. */
export const ENTITY_TAX_LABEL: Record<EntityType, string> = {
  orang_pribadi: "Bebas pajak s.d. Rp 500 jt",
  pt_perorangan: "PPh Final 0,5% dari Rp 0",
  pt_cv: "PPh Final 0,5% dari Rp 0",
};

/** Apakah pembebasan Rp 500 juta berlaku untuk bentuk usaha ini. */
export function entityHasExemption(entity: EntityType): boolean {
  return ENTITY_OPTIONS.find((o) => o.id === entity)?.exemption ?? false;
}
export const TYPE_LABEL: Record<BusinessType, string> = {
  warung: "Warung",
  toko: "Toko",
  kafe: "Kafe / Restoran",
  jasa: "Jasa",
  lainnya: "Usaha",
};

export function newBusinessId(): string {
  return `biz-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function loadBusiness(): Business | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(BUSINESS_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Business> & { taxpayer?: string };
    if (!parsed || typeof parsed.id !== "string" || !parsed.name) return null;

    const base: Business = {
      id: parsed.id,
      name: parsed.name,
      ownerName: parsed.ownerName ?? "",
      type: (parsed.type as BusinessType) ?? "lainnya",
      // Migrasi dari model lama (dua nilai): `badan` tidak bisa dibedakan mana
      // PT Perorangan atau PT/CV, jadi dipetakan ke pt_cv — perlakuan pajaknya
      // sama (tanpa pembebasan), jadi angka pengguna tidak berubah.
      entity:
        (parsed.entity as EntityType) ??
        (parsed.taxpayer === "badan" ? "pt_cv" : "orang_pribadi"),
      createdAt: parsed.createdAt ?? new Date().toISOString(),
    };

    // Only attach the KBLI fields when they actually hold something. Spreading
    // them unconditionally made "no KBLI" indistinguishable from "KBLI cleared"
    // once serialised — `kbliCode: undefined` round-trips as a present-but-empty
    // key, and a cleared code must be *absent* so nothing can read a stale one.
    if (typeof parsed.address === "string") base.address = parsed.address;
    if (typeof parsed.npwp === "string") base.npwp = parsed.npwp;
    if (typeof parsed.nib === "string") base.nib = parsed.nib;
    if (typeof parsed.kbliCode === "string") base.kbliCode = parsed.kbliCode;
    if (typeof parsed.kbliTitle === "string") base.kbliTitle = parsed.kbliTitle;
    if (Array.isArray(parsed.kbliHierarchy)) base.kbliHierarchy = parsed.kbliHierarchy;
    if (Array.isArray(parsed.legalDocuments)) base.legalDocuments = parsed.legalDocuments;

    return base;
  } catch {
    return null;
  }
}

export function saveBusiness(business: Business): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(BUSINESS_STORAGE_KEY, JSON.stringify(business));
  } catch {
    /* storage unavailable — the session still works */
  }
}

export function clearBusiness(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(BUSINESS_STORAGE_KEY);
}

/** A business is ready to use once it has a name. */
export function isUsableBusiness(business: Business | null): business is Business {
  return business != null && business.name.trim().length > 0;
}
