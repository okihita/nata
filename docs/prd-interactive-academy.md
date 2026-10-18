# Product Requirements Document: Nata Interactive Academy & Knowledge Hub

## 1. Executive Summary

Nata delivers autonomous bookkeeping, PPh Final tax compliance (PP 55/2022), and KBLI 2020 licensing classification for Indonesian micro, small, and medium businesses (MSMEs / UMKM). While Nata automates data extraction and financial posting, Indonesian SMB operators and hackathon evaluators face significant domain friction: understanding complex Indonesian statutory nuances (Orang Pribadi vs. PT Perorangan, zero-tax threshold rules, double-entry SAK EMKM, labor regulations, and KBLI licensing codes).

To transform Nata from a utility tool into a full **strategic co-pilot ("CFO in your pocket")**, the **Nata Interactive Academy** provides an integrated learning, simulation, and guidance hub accessible directly within the application navigation.

---

## 2. Core Pillars & Architecture

### 2.1 The Two Knowledge Tracks
1. **Platform Mastery (`Cara Pakai Nata` / `Platform Guide`)**:
   - Multi-Modal Fast Entry (Receipt Photo OCR, Voice Recording with conversational self-corrections, Quick WhatsApp-style Text).
   - Agent Cascade Observability (Agent Keuangan -> Agent Fiskal -> Agent Regulasi execution traces and guardrails).
   - Financial Statements & Tax Exports (Exporting SAK EMKM Excel statements with Indonesian comma/semicolon delimiters).
2. **Business & Compliance Complexities (`Akademi Bisnis UMKM` / `Business Academy`)**:
   - **Accounting 101**: Separation of personal and business cash flow, double-entry bookkeeping fundamentals under SAK EMKM.
   - **Taxation (PPh Final UMKM)**: PP 55/2022 Rp 500M zero-tax threshold rules, Orang Pribadi vs PT Perorangan tax traps, gross vs net margin pitfalls.
   - **Licensing & Legal**: KBLI 2020 classification, OSS-RBA risk-based licensing, NIB issuance.
   - **Operations & Team**: Basic hiring rules, BPJS Ketenagakerjaan compliance, UMR considerations, and payroll structure.

### 2.2 10/10 Interactive Features
1. **Persona-Adaptive Curriculum**:
   - When **Persona A (Retail / E-commerce Toko)** is active: Highlights lessons on marketplace fee reconciliation, advertising spend tracking, and the Rp 500M personal exemption.
   - When **Persona B (F&B / PT / Multi-Outlet)** is active: Highlights lessons on corporate taxation from rupiah 0, HPP/COGS recipe costing, menu engineering, and shift payroll.
2. **Interactive Deep-Links ("Coba Langsung")**:
   - Every guide embeds direct action buttons taking the user to `/record`, `/licensing`, `/taxes`, or `/statements` with relevant pre-filled context.
3. **Myth vs. Fact Flashcards ("Mitos vs Fakta UMKM")**:
   - Actionable myth-busting cards confronting common Indonesian small business fallacies with verbatim statutory citations (PP 55/2022, SAK EMKM).

---

## 3. User Experience & Navigation

### 3.1 Routing & Navigation Placement
- **Canonical English Route:** `/academy`
- **Legacy / Localized Route Rewrite:** `/akademi` -> `/academy`
- **Navigation Location:** Placed in the sidebar under a new section `Edukasi` / `Learning` alongside an educational graduation-cap icon (`GraduationCap` or `BookOpen`).

### 3.2 Bilingual Support (i18n)
- Completely translated across English (`copy-en.ts`) and Indonesian (`copy-id.ts`).
- Reactively switches language via the global `LanguageSwitcher` without page reload.

---

## 4. Verification Plan

1. **Automated Unit Tests**:
   - Curriculum data integrity tests (verifying titles, categories, statutory citations, and action deep-links).
   - Persona filtering and badge logic tests.
   - Navigation item and route rewrite validation.
2. **Quality Gates**:
   - `make check` passing 100% (Python pytest, TypeScript typecheck, Vitest, ESLint, Next.js production build).
3. **Visual Verification**:
   - Headless browser screenshots of `/academy` under both English and Indonesian locales.
   - Verified active persona badge and filter interaction.
