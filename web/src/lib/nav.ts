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
  | "perizinan"
  | "academy"
  | "platformGuide"
  | "usaha"
  | "pengaturan";

export interface NavItem {
  /** Route path. */
  href: string;
  /** Copy key in `copy.nav`. */
  key: NavKey;
  /** Icon name from `@/lib/nav-icons`, resolved by the sidebar. */
  icon: string;
  /** Show in the mobile bottom bar. */
  mobile?: boolean;
}

/** Semantic colour roles, matched to Tailwind classes in the sidebar. */
export type NavTone = "hijau" | "biru" | "ungu" | "oranye";

export type NavGroupKey = "summary" | "operations" | "master" | "reports" | "learning" | "other";

export interface NavGroup {
  key: NavGroupKey;
  label: string;
  tone: NavTone;
  items: NavItem[];
}

export const NAV: NavGroup[] = [
  {
    key: "summary",
    label: "Ringkasan",
    tone: "hijau",
    items: [{ href: "/dashboard", key: "dashboard", icon: "LayoutDashboard", mobile: true }],
  },
  {
    key: "operations",
    label: "Operasional",
    tone: "hijau",
    items: [
      { href: "/record", key: "catat", icon: "ScanLine", mobile: true },
      { href: "/transactions", key: "transaksi", icon: "ReceiptText", mobile: true },
    ],
  },
  {
    key: "master",
    label: "Perusahaan",
    tone: "biru",
    items: [
      { href: "/business", key: "usaha", icon: "Store" },
      { href: "/licensing", key: "perizinan", icon: "ShieldCheck" },
      { href: "/accounts", key: "akun", icon: "BookOpen" },
    ],
  },
  {
    key: "reports",
    label: "Laporan",
    tone: "ungu",
    items: [
      { href: "/statements", key: "laporan", icon: "FileBarChart", mobile: true },
      { href: "/taxes", key: "pajak", icon: "Landmark", mobile: true },
    ],
  },
  {
    key: "learning",
    label: "Akademi",
    tone: "biru",
    items: [
      { href: "/academy", key: "academy", icon: "GraduationCap" },
      { href: "/guide", key: "platformGuide", icon: "Compass" },
    ],
  },
  {
    key: "other",
    label: "Lainnya",
    tone: "oranye",
    items: [
      { href: "/settings", key: "pengaturan", icon: "Settings" },
    ],
  },
];

/** Items shown in the mobile bottom bar (max five). */
export const MOBILE_NAV: NavItem[] = NAV.flatMap((group) => group.items)
  .filter((item) => item.mobile)
  .slice(0, 5);

/** Tone → Tailwind colour classes for the active state. */
export const TONE_CLASS: Record<NavTone, string> = {
  hijau: "text-tone-hijau data-[active=true]:bg-tone-hijau-bg data-[active=true]:text-tone-hijau",
  biru: "text-tone-biru data-[active=true]:bg-tone-biru-bg data-[active=true]:text-tone-biru",
  ungu: "text-tone-ungu data-[active=true]:bg-tone-ungu-bg data-[active=true]:text-tone-ungu",
  oranye:
    "text-tone-oranye data-[active=true]:bg-tone-oranye-bg data-[active=true]:text-tone-oranye",
};

/** Small coloured dot per group, as a legend/key. */
export const TONE_DOT: Record<NavTone, string> = {
  hijau: "bg-tone-hijau",
  biru: "bg-tone-biru",
  ungu: "bg-tone-ungu",
  oranye: "bg-tone-oranye",
};
