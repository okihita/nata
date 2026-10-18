/**
 * Data model and curriculum definitions for Nata Interactive Academy & Knowledge Hub.
 *
 * Designed with 10/10 strategic capabilities:
 * - Structured curriculum across 2 tracks: Platform Mastery & Business Complexities (101 to Advanced).
 * - Persona targeting (Persona A: Retail Toko, Persona B: F&B PT/Multi-Outlet, or All).
 * - Actionable direct-simulator links ("Coba Langsung") to operational screens.
 * - Myth vs. Fact debunking with verbatim statutory citations (PP 55/2022, SAK EMKM, UU Cipta Kerja).
 */

export type AcademyTrack = "platform" | "business";

export type AcademyCategory =
  | "platform_basics"
  | "accounting_101"
  | "tax_compliance"
  | "licensing_legal"
  | "operations_team";

export interface AcademyLesson {
  id: string;
  track: AcademyTrack;
  category: AcademyCategory;
  /** Targets specific archetypes or general */
  targetPersona?: "persona_a" | "persona_b" | "all";
  difficulty: "101" | "intermediate" | "advanced";
  estimatedMinutes: number;
  statuteCitation?: string;
  actionLink?: {
    href: string;
    labelKey: "tryNow" | "tryRecordVoice" | "checkTaxes" | "checkLicensing" | "viewAccounts";
  };
}

export interface MythFactItem {
  id: string;
  targetPersona?: "persona_a" | "persona_b" | "all";
  statute: string;
}

export const ACADEMY_LESSONS: AcademyLesson[] = [
  // ── Track 1: Platform Mastery ──────────────────────────────────────────────
  {
    id: "plat_multimodal",
    track: "platform",
    category: "platform_basics",
    targetPersona: "all",
    difficulty: "101",
    estimatedMinutes: 3,
    actionLink: {
      href: "/record?mode=suara",
      labelKey: "tryRecordVoice",
    },
  },
  {
    id: "plat_trace",
    track: "platform",
    category: "platform_basics",
    targetPersona: "all",
    difficulty: "intermediate",
    estimatedMinutes: 4,
    statuteCitation: "Agent Keuangan -> Agent Fiskal -> Agent Regulasi",
    actionLink: {
      href: "/record",
      labelKey: "tryNow",
    },
  },
  {
    id: "plat_export",
    track: "platform",
    category: "platform_basics",
    targetPersona: "all",
    difficulty: "101",
    estimatedMinutes: 2,
    actionLink: {
      href: "/statements",
      labelKey: "tryNow",
    },
  },

  // ── Track 2: Business Complexities (101 to Advanced) ───────────────────────
  {
    id: "biz_cash_separation",
    track: "business",
    category: "accounting_101",
    targetPersona: "all",
    difficulty: "101",
    estimatedMinutes: 4,
    statuteCitation: "SAK EMKM Bab 2 (Entitas Ekonomi Terpisah)",
    actionLink: {
      href: "/accounts",
      labelKey: "viewAccounts",
    },
  },
  {
    id: "biz_tax_threshold",
    track: "business",
    category: "tax_compliance",
    targetPersona: "persona_a",
    difficulty: "101",
    estimatedMinutes: 5,
    statuteCitation: "PP 55/2022 Pasal 60 ayat (2) & UU HPP",
    actionLink: {
      href: "/taxes",
      labelKey: "checkTaxes",
    },
  },
  {
    id: "biz_pt_tax_trap",
    track: "business",
    category: "tax_compliance",
    targetPersona: "persona_b",
    difficulty: "intermediate",
    estimatedMinutes: 6,
    statuteCitation: "PP 55/2022 Pasal 56 & 60 (Subjek Badan Usaha)",
    actionLink: {
      href: "/taxes",
      labelKey: "checkTaxes",
    },
  },
  {
    id: "biz_cogs_recipe",
    track: "business",
    category: "accounting_101",
    targetPersona: "persona_b",
    difficulty: "intermediate",
    estimatedMinutes: 7,
    statuteCitation: "SAK EMKM Bab 7 (Persediaan Bahan Baku & HPP)",
    actionLink: {
      href: "/dashboard",
      labelKey: "tryNow",
    },
  },
  {
    id: "biz_marketplace_recon",
    track: "business",
    category: "accounting_101",
    targetPersona: "persona_a",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    statuteCitation: "SAK EMKM Bab 11 (Pendapatan Bruto vs Potongan Platform)",
    actionLink: {
      href: "/transactions",
      labelKey: "tryNow",
    },
  },
  {
    id: "biz_kbli_oss",
    track: "business",
    category: "licensing_legal",
    targetPersona: "all",
    difficulty: "advanced",
    estimatedMinutes: 5,
    statuteCitation: "PP 5/2021 (Penyelenggaraan Perizinan Berusaha Berbasis Risiko) & KBLI 2020",
    actionLink: {
      href: "/licensing",
      labelKey: "checkLicensing",
    },
  },
  {
    id: "biz_hiring_payroll",
    track: "business",
    category: "operations_team",
    targetPersona: "persona_b",
    difficulty: "advanced",
    estimatedMinutes: 8,
    statuteCitation: "PP 35/2021 (PKWT/PKWTT) & PP 36/2021 (Pengupahan UMKM)",
    actionLink: {
      href: "/accounts",
      labelKey: "viewAccounts",
    },
  },
];

export const MYTH_FACTS: MythFactItem[] = [
  {
    id: "myth_pt_threshold",
    targetPersona: "all",
    statute: "PP 55/2022 Pasal 60 ayat (2)",
  },
  {
    id: "myth_tax_expense",
    targetPersona: "all",
    statute: "PP 55/2022 Pasal 57 ayat (1)",
  },
  {
    id: "myth_kbli_arbitrary",
    targetPersona: "all",
    statute: "Peraturan BPS No. 2/2020 (KBLI 2020)",
  },
  {
    id: "myth_qris_tax",
    targetPersona: "all",
    statute: "UU HPP & Surat Edaran DJP No. SE-14/PJ/2022",
  },
  {
    id: "myth_cv_draw",
    targetPersona: "all",
    statute: "UU PPh Pasal 4 ayat (3) huruf i",
  },
  {
    id: "myth_bpjs_mandatory",
    targetPersona: "all",
    statute: "UU No. 24/2011 & PP 37/2021 (Jamsostek UMKM)",
  },
];
