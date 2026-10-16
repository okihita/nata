/**
 * Navigasi utama aplikasi.
 *
 * Satu sumber kebenaran untuk sidebar, bottom bar (mobile), dan judul halaman —
 * supaya label menu selalu sama di seluruh aplikasi.
 *
 * Warna tiap kelompok mengikuti kebiasaan software akuntansi Indonesia
 * (mis. Accurate Online memakai warna untuk menandai *jenis* menu): hijau untuk
 * pekerjaan sehari-hari, biru untuk data induk, ungu untuk laporan, oranye untuk
 * pengaturan. Ini membantu pemilik usaha mengenali menu lebih cepat.
 */

export type NavKey =
  | "dashboard"
  | "catat"
  | "transaksi"
  | "akun"
  | "laporan"
  | "pajak"
  | "usaha"
  | "pengaturan";

export interface NavItem {
  /** Route path. */
  href: string;
  /** Copy key in `copy.nav`. */
  key: NavKey;
  /** Icon name from `@/lib/nav-icons`, resolved by the sidebar. */
  icon: string;
  /** Not built yet — the page shows a "coming soon" state. */
  soon?: boolean;
  /** Show in the mobile bottom bar. */
  mobile?: boolean;
}

/** Semantic colour roles, matched to Tailwind classes in the sidebar. */
export type NavTone = "hijau" | "biru" | "ungu" | "oranye";

export interface NavGroup {
  label: string;
  tone: NavTone;
  items: NavItem[];
}

export const NAV: NavGroup[] = [
  {
    label: "Ringkasan",
    tone: "hijau",
    items: [{ href: "/dasbor", key: "dashboard", icon: "LayoutDashboard", mobile: true }],
  },
  {
    label: "Operasional",
    tone: "hijau",
    items: [
      { href: "/catat", key: "catat", icon: "ScanLine", mobile: true },
      { href: "/transaksi", key: "transaksi", icon: "ReceiptText", mobile: true },
    ],
  },
  {
    label: "Data Induk",
    tone: "biru",
    items: [{ href: "/akun", key: "akun", icon: "BookOpen" }],
  },
  {
    label: "Laporan",
    tone: "ungu",
    items: [
      { href: "/laporan", key: "laporan", icon: "FileBarChart", mobile: true },
      { href: "/pajak", key: "pajak", icon: "Landmark", mobile: true },
    ],
  },
  {
    label: "Lainnya",
    tone: "oranye",
    items: [
      { href: "/usaha", key: "usaha", icon: "Store" },
      { href: "/pengaturan", key: "pengaturan", icon: "Settings" },
    ],
  },
];

/** Items shown in the mobile bottom bar (max five). */
export const MOBILE_NAV: NavItem[] = NAV.flatMap((group) => group.items)
  .filter((item) => item.mobile)
  .slice(0, 5);

/** Tone → Tailwind colour classes for the active state. */
export const TONE_CLASS: Record<NavTone, string> = {
  hijau: "text-emerald-700 data-[active=true]:bg-emerald-50 data-[active=true]:text-emerald-800",
  biru: "text-sky-700 data-[active=true]:bg-sky-50 data-[active=true]:text-sky-800",
  ungu: "text-violet-700 data-[active=true]:bg-violet-50 data-[active=true]:text-violet-800",
  oranye: "text-amber-700 data-[active=true]:bg-amber-50 data-[active=true]:text-amber-800",
};

/** Small coloured dot per group, as a legend/key. */
export const TONE_DOT: Record<NavTone, string> = {
  hijau: "bg-emerald-500",
  biru: "bg-sky-500",
  ungu: "bg-violet-500",
  oranye: "bg-amber-500",
};
