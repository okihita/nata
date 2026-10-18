# Product Requirements Document: Internationalization (i18n) & Language Switcher

## 1. Executive Summary

Nata is an automated bookkeeping and tax compliance copilot built for Indonesian micro, small, and medium enterprises (MSME / UMKM). While the domestic target audience operates in Indonesian (using localized colloquial business terms such as *struk*, *pembukuan*, *uang masuk*, *bayar nanti*), the primary evaluation platform for the Google AI Builder Cup consists of international hackathon juries, technical evaluators, and automated benchmark bots.

To maximize scoring velocity and eliminate evaluation friction:
- **Default System Language:** English (`en`). All initial visits, uninitialized sessions, and automated crawls must render in English immediately without requiring manual locale configuration.
- **Secondary Language:** Indonesian (`id`). Full fidelity localized experience tailored for domestic Indonesian MSME operators.
- **Switching Mechanism:** A top-navigation toggle button control (`[EN | ID]`) positioned within the global application header.
- **Persistence:** Local client persistence via `localStorage` under the key `nata.lang.v1`, with deterministic fallback to `en`.

---

## 2. Strategic Rationale & System Archetypes

### 2.1 Evaluator vs Operator Archetypes

| Dimension | International Hackathon Jury (Default) | Domestic UMKM Operator (Secondary) |
| --- | --- | --- |
| Primary Objective | Evaluate architectural integrity, AI agent reasoning, compliance accuracy, and UX flow | Daily receipt entry, cash flow tracking, PPh Final tax filing readiness |
| Language Requirement | English (`en`) | Bahasa Indonesia (`id`) |
| Cognitive Focus | Trace observability, agent handoffs, SAK EMKM double-entry validation, tax law provenance | Simplicity, colloquial clarity, zero accounting jargon |
| Friction Risk | High drop-off if UI requires cognitive deciphering of unfamiliar Indonesian terminology | Alienation if UI presents rigid Western enterprise terminology |

---

## 3. Architecture & State Management Specification

### 3.1 Persistent Storage Specification
- **Storage Target:** `window.localStorage`
- **Key Identifier:** `nata.lang.v1`
- **Supported Values:** `'en'` | `'id'`
- **Default Value:** `'en'`

### 3.2 Hydration & External Store Strategy
To prevent hydration mismatches between Next.js SSR prerendering and client-side hydration:
1. **Server Snapshot:** Must return default language `'en'`. Prerendered HTML outputs standard English copy.
2. **Client Store Integration:** Implemented via `useSyncExternalStore` (mirroring `web/src/lib/store.tsx`) to subscribe to `localStorage` changes and cross-tab storage events without triggering cascade re-renders or layout shifts.
3. **Fallback Policy:** If `localStorage` is empty, inaccessible (e.g. private browsing storage lock), or contains an invalid string, the resolver strictly defaults to `'en'`.

### 3.3 State Machine Definition

```
[Initial Request / SSR] ──▶ Resolve Server Snapshot ('en')
                                  │
                                  ▼
[Client Mount] ───────────▶ Read localStorage('nata.lang.v1')
                                  │
         ┌────────────────────────┴────────────────────────┐
         ▼                                                 ▼
[Key == 'id']                                     [Key == 'en' or Null/Invalid]
Render Indonesian Copy                            Render English Copy (Default)
         │                                                 │
         └────────────────────────┬────────────────────────┘
                                  ▼
                     [User Toggles Language]
                                  │
                                  ▼
                     Write 'nata.lang.v1' to Storage
                     Emit External Store Update
                     Re-render Subscribed Components
```

---

## 4. UI / Component Specification

### 4.1 Placement & Hierarchy
The `LanguageSwitcher` component is mounted directly in the global application header (`web/src/app/(app)/layout.tsx`), positioned adjacent to the `WorkspaceSwitcher` on the right side of the navigation bar.

### 4.2 Component Design & Styling Rules
- **Prohibited Effects:** Strictly no glassmorphism, translucent gradients, or backdrop blur overlays on the switcher elements. Solid, high-contrast, opaque surfaces only.
- **Zero Emojis:** Flag emojis (e.g., country flags) are strictly forbidden. Use ISO language codes: `EN` and `ID`.
- **Desktop Layout:** Segmented toggle pill with distinct active and inactive states:
  - Active locale: Solid primary background (`bg-primary text-primary-foreground`) or high-contrast muted fill (`bg-muted font-semibold text-foreground`).
  - Inactive locale: Subtle ghost styling (`text-muted-foreground hover:text-foreground`).
- **Mobile Layout:** Compact button toggle displaying the inactive target language (e.g., button showing `ID` when currently in `EN`, and `EN` when currently in `ID`) or a compact segmented pill sized to touch targets (minimum 36px height).
- **Accessibility:**
  - `role="group"` with `aria-label="Language selection"`
  - Individual toggle buttons with `aria-pressed="true|false"`
  - Keyboard accessible via `Tab`, `Enter`, and `Space`.

---

## 5. Translation Dictionary Architecture (`web/src/lib/copy.ts`)

### 5.1 Type-Safe Schema Definition
The translation schema must enforce 100% structural parity between languages via TypeScript:

```typescript
export type Locale = "en" | "id";

export interface TranslationDictionary {
  app: {
    name: string;
    tagline: string;
    badge: string;
    metadataTitle: string;
    metadataDescription: string;
    workspace: string;
    workspaceType: string;
  };
  nav: {
    groups: Array<{ label: string; items: string[] }>;
    dashboard: string;
    catat: string;
    transaksi: string;
    akun: string;
    laporan: string;
    pajak: string;
    perizinan: string;
    usaha: string;
    pengaturan: string;
  };
  common: {
    save: string;
    cancel: string;
    close: string;
    loading: string;
    reset: string;
    tryDemo: string;
    loadDemo: string;
    seeAll: string;
    total: string;
    account: string;
    code: string;
    debit: string;
    credit: string;
    balance: string;
    date: string;
    description: string;
    amount: string;
    source: string;
    group: string;
    empty: string;
  };
  dashboard: {
    title: string;
    subtitle: string;
    firstRunTitle: string;
    firstRunBody: string;
    firstRunDemoHint: string;
    emptyChart: string;
    emptyActivity: string;
    revenue: string;
    expenses: string;
    netIncome: string;
    cash: string;
    taxDue: string;
    entries: string;
    thisMonth: string;
    allTime: string;
    recentActivity: string;
    recentEmpty: string;
    quickActions: string;
    actionScan: string;
    actionScanHint: string;
    actionReport: string;
    actionReportHint: string;
    actionTax: string;
    actionTaxHint: string;
    agentTitle: string;
    agentBody: string;
    chartTitle: string;
    chartRevenue: string;
    chartExpense: string;
    balanced: string;
    balancedHint: string;
    accountsActive: (n: number) => string;
    needsAction: string;
    needsActionEmpty: string;
    needsTaxDue: (amount: string) => string;
    needsTaxExempt: string;
    needsKbli: string;
    needsUnpaid: (count: number, amount: string) => string;
    complianceTitle: string;
    complianceEntity: string;
    complianceTax: string;
    complianceKbli: string;
    complianceKbliNone: string;
    complianceKbliCta: string;
    complianceOpen: string;
    ownerHint: string;
  };
  // Remaining sections: add, activity, books, transaksi, akun, laporan,
  // perizinan, pajak, onboarding, usaha, landing, pengaturan, errorScreen,
  // notFound, status, agents, steps, problems, balance, banner.
}
```

### 5.2 Dynamic Formatter Functions Parity
All parametric formatters must share identical functional signatures across dictionaries:
- `accountsActive: (n: number) => string`
- `needsTaxDue: (amount: string) => string`
- `needsUnpaid: (count: number, amount: string) => string`
- `matching: (count: number) => { title: string; detail: string }`
- `finished: (seconds: string) => string`
- `taxPayerStatus: (owner: string, entity: string) => string`

---

## 6. Comprehensive Domain Terminology Mappings

### 6.1 Navigational Keys & Groups

| Key / Group | English Terminology (`en`) | Indonesian Terminology (`id`) | Context & Rationale |
| --- | --- | --- | --- |
| `nav.groups[0]` | Overview | Ringkasan | Top-level summary grouping |
| `nav.groups[1]` | Operations | Operasional | Daily bookkeeping activities |
| `nav.groups[2]` | Master Data | Data Induk | Core accounts and ledgers |
| `nav.groups[3]` | Reports | Laporan | Financial and tax statements |
| `nav.groups[4]` | Organization | Pengaturan | Profile and system settings |
| `nav.dashboard` | Dashboard | Dasbor | Main operational cockpit |
| `nav.catat` | Scan Receipt | Catat Struk | Receipt ingestion & OCR agent |
| `nav.transaksi` | Transactions | Transaksi | General journal ledger records |
| `nav.akun` | Chart of Accounts | Daftar Akun | SAK EMKM standard account list |
| `nav.laporan` | Financial Statements | Laporan Keuangan | Income Statement & Financial Position |
| `nav.pajak` | Tax Compliance | Pajak | PPh Final UMKM calculation & filing |
| `nav.perizinan` | Regulatory & KBLI | Perizinan | OSS & KBLI risk-based validation |
| `nav.usaha` | Business Profile | Profil Usaha | Entity registration and tax tier |
| `nav.pengaturan` | Settings | Pengaturan | System defaults and persona reset |

### 6.2 Status Pills & Badges

| Token / Key | English Terminology (`en`) | Indonesian Terminology (`id`) | Semantic Role |
| --- | --- | --- | --- |
| `status.balanced` | Balanced | Seimbang | Journal debit equals credit |
| `status.unbalanced` | Unbalanced | Tidak Seimbang | Journal imbalance alert |
| `status.verified` | Verified | Terverifikasi | OSS / KBLI compliance check passed |
| `status.pending` | In Review | Menunggu Verifikasi | Regulatory review underway |
| `status.unverified` | Unverified | Belum Ditentukan | KBLI code missing |
| `status.exempt` | Tax Exempt (0%) | Bebas Pajak (0%) | Gross revenue under IDR 500M ceiling |
| `status.taxDue` | Tax Payable (0.5%) | Terutang (0,5%) | Subject to PPh Final UMKM PP 55/2022 |
| `status.needsAction` | Action Required | Perlu Tindakan | Unsettled payables or missing data |

### 6.3 Financial & Accounting Terminology

| Domain Term | English Terminology (`en`) | Indonesian Terminology (`id`) | Technical Accounting Basis |
| --- | --- | --- | --- |
| Debit | Debit | Debit | SAK EMKM Asset / Expense increase |
| Credit | Credit | Kredit | SAK EMKM Liability / Equity / Revenue increase |
| Balance | Balance | Saldo | Residual account balance |
| Revenue | Revenue | Pendapatan | Gross business turnover |
| Operating Expense | Operating Expenses | Beban Usaha | Operational deductions |
| Net Income | Net Profit | Laba Bersih | Bottom-line earnings |
| Cash Balance | Cash on Hand | Saldo Kas | Liquid assets |
| Accounts Payable | Accounts Payable | Utang Usaha | Short-term vendor obligations |
| Accounts Receivable | Accounts Receivable | Piutang Usaha | Customer amounts due |
| Double-Entry System | Double-Entry System | Pembukuan Berpasangan | Luca Pacioli standard double-entry |
| SAK EMKM | SAK EMKM Standard | Standar SAK EMKM | Indonesian micro-entity financial standard |

### 6.4 Tax Notices & Statutory Provisions

| Statutory Provision | English Terminology (`en`) | Indonesian Terminology (`id`) | Statutory Citation |
| --- | --- | --- | --- |
| UMKM Final Tax Rate | Final Income Tax 0.5% | PPh Final UMKM 0,5% | PP No. 55 / 2022 Pasal 56 |
| Annual Revenue Ceiling | Gross turnover up to IDR 4.8 Billion | Omzet bruto s.d. Rp 4,8 Miliar | UU HPP / PP 55/2022 |
| Individual Tax Exemption | Tax-free threshold up to IDR 500 Million / year | Batas peredaran bruto bebas pajak Rp 500 Juta / tahun | PP 55/2022 Pasal 60 (Orang Pribadi) |
| Corporate Sole Proprietor | Taxed at 0.5% without exemption threshold | Dikenakan tarif 0,5% tanpa batas bebas pajak | PT Perorangan tax rule under PP 55/2022 |
| Citation Link | Verbatim Statute Quote | Kutipan Resmi Regulasi | In-repo statutory verification engine |

### 6.5 Action Buttons & Control Signals

| Control Key | English Terminology (`en`) | Indonesian Terminology (`id`) | Action |
| --- | --- | --- | --- |
| `common.save` | Save Changes | Simpan | Persist entity or transaction data |
| `common.cancel` | Cancel | Batal | Abort active dialog / modal |
| `common.close` | Close | Tutup | Dismiss viewport overlay |
| `common.loading` | Processing... | Memuat... | Async background operation |
| `common.reset` | Reset Data | Mulai Ulang | Flush active session / storage |
| `common.tryDemo` | Load Sample Data | Coba Data Contoh | Populate demo receipts and ledgers |
| `add.submit` | Record to Ledger | Catat ke Pembukuan | Dispatch receipt to agent pipeline |
| `export.csv` | Export Journal to CSV | Unduh CSV | Generate standard ledger export |

---

## 7. Implementation & Rollout Roadmap

1. **Phase 1: Dictionary Split & Typing (`web/src/lib/copy.ts`)**
   - Extract `TranslationDictionary` interface.
   - Refactor existing Indonesian copy into `copyId`.
   - Author complete English counterpart `copyEn`.
   - Export active selector `getCopy(locale: Locale): TranslationDictionary`.

2. **Phase 2: Reactive State Hook (`web/src/lib/i18n.tsx`)**
   - Implement `useLanguage()` and `useCopy()` backed by `useSyncExternalStore`.
   - Subscribe to storage changes; deterministic fallback to `'en'`.
   - Export `setLanguage(lang: Locale)` mutator.

3. **Phase 3: Navigation Switcher Component (`web/src/components/language-switcher.tsx`)**
   - Build accessible toggle pill control.
   - Mount in `web/src/app/(app)/layout.tsx` next to `WorkspaceSwitcher`.
   - Mount in landing page navigation header (`web/src/app/page.tsx`).

4. **Phase 4: Component Verification & Rigorous Testing**
   - Execute Next.js build: `cd web && pnpm exec tsc --noEmit && pnpm build`.
   - Validate clean build, zero layout regressions, zero hydration warnings.
   - Verify persistence in `localStorage` across refresh and tab lifecycles.
