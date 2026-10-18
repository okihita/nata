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
  category: "tax" | "accounting" | "legal" | "operations";
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
      href: "/record",
      labelKey: "tryNow",
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
    id: "plat_agents",
    track: "platform",
    category: "operations_team",
    targetPersona: "all",
    difficulty: "101",
    estimatedMinutes: 4,
    statuteCitation: "Autonomous AI Staff (Nata, Maya, Dimas, Arief)",
    actionLink: {
      href: "/agents",
      labelKey: "tryNow",
    },
  },
  {
    id: "plat_tax_monitor",
    track: "platform",
    category: "tax_compliance",
    targetPersona: "all",
    difficulty: "101",
    estimatedMinutes: 3,
    statuteCitation: "PP 55/2022 Batas Rp 500 Juta Bebas Pajak",
    actionLink: {
      href: "/taxes",
      labelKey: "checkTaxes",
    },
  },
  {
    id: "plat_licensing_kbli",
    track: "platform",
    category: "licensing_legal",
    targetPersona: "all",
    difficulty: "intermediate",
    estimatedMinutes: 4,
    statuteCitation: "OSS-RBA & Validasi Klasifikasi Baku KBLI 2020",
    actionLink: {
      href: "/licensing",
      labelKey: "checkLicensing",
    },
  },
  {
    id: "plat_routines",
    track: "platform",
    category: "operations_team",
    targetPersona: "all",
    difficulty: "101",
    estimatedMinutes: 3,
    statuteCitation: "Pusat Otomasi Rutinitas & Pengingat Pajak",
    actionLink: {
      href: "/routines",
      labelKey: "tryNow",
    },
  },
  {
    id: "plat_kur_readiness",
    track: "platform",
    category: "accounting_101",
    targetPersona: "all",
    difficulty: "intermediate",
    estimatedMinutes: 4,
    statuteCitation: "SAK EMKM Bab 3, 4, 5 & Dokumen Pengajuan KUR",
    actionLink: {
      href: "/statements",
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
    category: "tax",
    targetPersona: "all",
    statute: "PP 55/2022 Pasal 60 ayat (2)",
  },
  {
    id: "myth_tax_expense",
    category: "accounting",
    targetPersona: "all",
    statute: "PP 55/2022 Pasal 57 ayat (1)",
  },
  {
    id: "myth_kbli_arbitrary",
    category: "legal",
    targetPersona: "all",
    statute: "Peraturan BPS No. 2/2020 (KBLI 2020)",
  },
  {
    id: "myth_qris_tax",
    category: "tax",
    targetPersona: "all",
    statute: "UU HPP & Surat Edaran DJP No. SE-14/PJ/2022",
  },
  {
    id: "myth_cv_draw",
    category: "tax",
    targetPersona: "all",
    statute: "UU PPh Pasal 4 ayat (3) huruf i",
  },
  {
    id: "myth_bpjs_mandatory",
    category: "operations",
    targetPersona: "all",
    statute: "UU No. 24/2011 & PP 37/2021 (Jamsostek UMKM)",
  },
  {
    id: "myth_ppn_threshold",
    category: "tax",
    targetPersona: "all",
    statute: "PMK No. 197/PMK.03/2013 & UU HPP",
  },
  {
    id: "myth_invoice_materai",
    category: "legal",
    targetPersona: "all",
    statute: "UU Bea Meterai No. 10/2020 Pasal 3 ayat (2)",
  },
  {
    id: "myth_depreciation",
    category: "accounting",
    targetPersona: "all",
    statute: "SAK EMKM Bab 9 (Aset Tetap & Penyusutan)",
  },
  {
    id: "myth_halal_selfdeclare",
    category: "legal",
    targetPersona: "all",
    statute: "UU No. 33/2014 & PP 39/2021 (Jaminan Produk Halal)",
  },
  {
    id: "myth_freelance_pph21",
    category: "operations",
    targetPersona: "all",
    statute: "PER-16/PJ/2016 & PMK 168/2023 (Tarif Efektif PPh 21)",
  },
  {
    id: "myth_npwp_nik",
    category: "tax",
    targetPersona: "all",
    statute: "PMK No. 112/PMK.03/2022 & PMK 136/2023",
  },
];
