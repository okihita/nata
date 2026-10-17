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
    kbliCode: "47725",
    kbliTitle: "Perdagangan Eceran Barang Kosmetik Untuk Manusia",
    createdAt: "2026-07-01T00:00:00.000Z",
  },
  persona_b: {
    id: "biz-persona-b",
    name: "PT Seduh Rasa Nusantara",
    ownerName: "Budi",
    type: "kafe",
    entity: "pt_cv",
    kbliCode: "56303",
    kbliTitle: "Rumah Minum / Kafe",
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
    if (typeof parsed.kbliCode === "string") base.kbliCode = parsed.kbliCode;
    if (typeof parsed.kbliTitle === "string") base.kbliTitle = parsed.kbliTitle;
    if (Array.isArray(parsed.kbliHierarchy)) base.kbliHierarchy = parsed.kbliHierarchy;

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
