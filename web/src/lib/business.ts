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

/** Jenis wajib pajak menentukan apakah pembebasan Rp 500 juta berlaku. */
export type Taxpayer = "orang_pribadi" | "badan";

/** Bentuk usaha — memengaruhi saran akun dan bahasa yang dipakai. */
export type BusinessType = "warung" | "toko" | "kafe" | "jasa" | "lainnya";

export interface Business {
  id: string;
  /** Nama usaha, e.g. "Warung Bu Siti". Tampil di seluruh aplikasi. */
  name: string;
  /** Nama pemilik — dipakai untuk sapaan dan (nanti) dokumen resmi. */
  ownerName: string;
  type: BusinessType;
  /** orang_pribadi mendapat pembebasan Rp 500 juta (Pasal 60 ayat (2)). */
  taxpayer: Taxpayer;
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

export const TAXPAYER_OPTIONS: {
  id: Taxpayer;
  label: string;
  hint: string;
}[] = [
  {
    id: "orang_pribadi",
    label: "Perorangan",
    hint: "Milik pribadi. Omzet sampai Rp 500 juta bebas pajak.",
  },
  {
    id: "badan",
    label: "Badan usaha",
    hint: "PT Perorangan, CV, koperasi. Tidak ada pembebasan Rp 500 juta.",
  },
];

export const TAXPAYER_LABEL: Record<Taxpayer, string> = {
  orang_pribadi: "Wajib pajak perorangan",
  badan: "Wajib pajak badan",
};

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
    const parsed = JSON.parse(raw) as Partial<Business>;
    if (!parsed || typeof parsed.id !== "string" || !parsed.name) return null;
    return {
      id: parsed.id,
      name: parsed.name,
      ownerName: parsed.ownerName ?? "",
      type: (parsed.type as BusinessType) ?? "lainnya",
      taxpayer: (parsed.taxpayer as Taxpayer) ?? "orang_pribadi",
      createdAt: parsed.createdAt ?? new Date().toISOString(),
    };
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
