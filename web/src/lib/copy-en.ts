/**
 * English translation dictionary for Nata.
 *
 * Mirrors copy-id.ts with exact type parity:
 * - Professional, concise financial and accounting English terminology.
 * - SAK EMKM and Indonesian tax statute references (PP 55/2022, UU HPP, PMK 37/2025)
 *   retained with accurate English explanations.
 * - Zero emojis anywhere.
 */

export const copyEn = {
  app: {
    name: "Nata",
    tagline: "From receipts to balanced books — automated.",
    badge: "Gemini on Google Cloud",
    metadataTitle: "Nata — From receipts to balanced books, automated",
    metadataDescription:
      "Snap a receipt, and Nata automatically records double-entry journals compliant with SAK EMKM and ready for tax filing. Built for Indonesian MSMEs.",
    workspace: "Nusantara Coffee Shop",
    workspaceType: "Micro enterprise · Jakarta",
  },

  entityLabels: {
    orang_pribadi: "Sole Proprietorship",
    pt_perorangan: "Individual Limited Liability (PT Perorangan)",
    pt_cv: "Corporation / Partnership (PT / CV)",
  },

  typeLabels: {
    warung: "Kiosk",
    toko: "Retail Store",
    kafe: "Cafe / Restaurant",
    jasa: "Services",
    lainnya: "Business",
  },

  typeHints: {
    warung: "Ready-to-serve food & beverages",
    toko: "Merchandise, grocery, retail",
    kafe: "Coffee shop, cafe, dining",
    jasa: "Professional services, maintenance, consulting",
    lainnya: "Other enterprise",
  },

  workspaceSwitcher: {
    badgeCallout: "Hackathon: Click to switch persona",
    activeLabel: "Active Business",
    archetypeBadge: "Hackathon Archetype",
    guestBadge: "Local / Guest",
    archetypeHeading: "Select Instant Archetype (Jury & Evaluation)",
    syncHeading: "Storage & Synchronization",
    createNew: "Create New Business (Transient)",
    createNewHint: "Test self-service onboarding flow",
    returnToOnboarding: "Return to Onboarding",
    returnToOnboardingHint: "Switch persona or start fresh",
    cloudSave: "Save Business to Cloud",
    cloudSaveHint: "Persist state to Firebase Multi-Tenant",
    cloudAlert: "Cloud Profile Feature: Ready for live sync with Firebase Firestore in production.",
    personaRetailHint: "Retail & E-Commerce (Shopee/TikTok)",
    personaFnbHint: "F&B Multi-Outlet (POS & Resto)",
  },

  // ── Main navigation ────────────────────────────────────────────────────────
  nav: {
    groups: [
      { label: "Overview", items: ["dashboard"] },
      { label: "Operations", items: ["catat", "transaksi", "akun"] },
      { label: "Reports", items: ["laporan", "pajak"] },
      { label: "Other", items: ["usaha", "pengaturan"] },
    ],
    groupLabels: {
      summary: "Overview",
      operations: "Operations",
      master: "Company & Master Data",
      reports: "Financial Reports",
      learning: "Academy",
      other: "Preferences",
    },
    agents: "Agents",
    dashboard: "Dashboard",
    rutinitas: "Routines",
    catat: "Record Receipt",
    transaksi: "Transactions",
    akun: "Chart of Accounts",
    laporan: "Financial Statements",
    pajak: "Taxes",
    library: "Library & Artifacts",
    perizinan: "Licensing",
    academy: "Business School",
    platformGuide: "Platform Guide",
    usaha: "Business Profile",
    pengaturan: "Settings",
  },

  common: {
    save: "Save",
    cancel: "Cancel",
    close: "Close",
    loading: "Loading…",
    reset: "Reset",
    tryDemo: "Try sample data",
    loadDemo: "Load sample data",
    seeAll: "See all",
    total: "Total",
    account: "Account",
    code: "Code",
    debit: "Debit",
    credit: "Credit",
    balance: "Balance",
    date: "Date",
    description: "Description",
    amount: "Amount",
    source: "Source",
    group: "Group",
    empty: "No data available.",
  },

  dashboard: {
    title: "Dashboard",
    subtitle: "Overview of your business performance today.",
    firstRunTitle: "Your books are empty",
    firstRunBody:
      "No entries recorded yet. Start by taking a photo of your first receipt — Nata takes care of the rest.",
    firstRunDemoHint: "No receipts yet? Try with sample data.",
    emptyChart: "The chart will appear after your first transaction.",
    emptyActivity: "No activity yet. Recent activities will appear here.",
    revenue: "Revenue",
    expenses: "Expenses",
    netIncome: "Net Income",
    cash: "Cash Balance",
    taxDue: "Final Tax (0.5%)",
    entries: "Recorded Entries",
    thisMonth: "this month",
    allTime: "total",
    recentActivity: "Recent Activity",
    recentEmpty: "No transactions yet. Start by recording your first receipt.",
    quickActions: "Quick Actions",
    actionScan: "Scan new receipt",
    actionScanHint: "Record expenses or sales from a photo",
    actionReport: "View statements",
    actionReportHint: "Income statement and balance sheet",
    actionTax: "Calculate tax",
    actionTaxHint: "MSME Final Income Tax 0.5%",
    agentTitle: "Nata works for you",
    agentBody:
      "Every receipt is parsed automatically, mapped to the correct ledger accounts, and validated for double-entry balance.",
    chartTitle: "Monthly revenue & expenses",
    chartSubtitle: "Trend comparison over past months",
    chartRevenue: "Revenue",
    chartExpense: "Expenses",
    balanced: "Balanced books",
    balancedHint: "Assets = Liabilities + Equity",
    accountsActive: (n: number) => `${n} active accounts in use`,
    needsAction: "Action Required",
    needsActionEmpty: "No pending actions. Your books are balanced.",
    needsTaxDue: (amount: string) => `Final tax due for this period: ${amount}`,
    needsTaxExempt: "Gross revenue is below the tax-exempt threshold",
    needsKbli: "KBLI classification code not set — required for licensing",
    needsUnpaid: (count: number, amount: string) =>
      `${count} accounts payable outstanding (${amount})`,
    complianceTitle: "Business Status & Health",
    complianceEntity: "Legal Entity",
    complianceTax: "Tax Treatment",
    complianceKbli: "KBLI Code",
    complianceKbliNone: "Not set",
    complianceKbliCta: "Select",
    complianceOpen: "View licensing",
    complianceNib: "NIB Permit",
    complianceNibReady: "Ready / Registered",
    complianceNibMissing: "Not submitted",
    complianceNibCta: "Prepare docs",
    ownerHint: "For business owners — snap a receipt, automation handles the rest.",
    thisMonthMetrics: (period?: string) => period ? `This Month (${period})` : "This Month",
    allTimeMetrics: "All-Time Cumulative",
    toggleViewThisMonth: (period?: string) => period ? `This Month (${period})` : "This Month",
    toggleViewAllTime: "All-Time",
    todoTitle: "Next Steps & Action Plan",
    todoSubtitle: "Priority tasks recommended by your AI staff for compliance and financing readiness.",
    todoTasks: {
      financialStatementLastYear: {
        title: "Input last year's financial statement (2025)",
        desc: "Add your opening balance or previous year report so banks (KUR) can see multi-year business growth.",
        cta: "Add opening balance",
        prompt: "Mbak Maya, how do I record our 2025 opening balances so our statements qualify for bank microloans (KUR)?",
      },
      perizinanDocs: {
        title: "Prepare business license documents (NIB OSS RBA)",
        desc: "Complete NIB requirements, address verification, and NPWP to legally protect operations from local raids.",
        cta: "Complete licensing",
        prompt: "Pak Arief, what is the checklist for verifying my NIB OSS RBA business license documents?",
      },
      taxThresholdMonitor: {
        title: "Safeguard Rp 500M annual tax-free allowance",
        desc: "Gross turnover is at Rp 101.75M. You have Rp 398.25M tax-free quota remaining before 0.5% PPh Final applies.",
        cta: "View tax position",
        prompt: "Mas Dimas, how do I calculate my remaining Rp 500M tax-free allowance under PP 55/2022?",
      },
      monthlyExportPrint: {
        title: "Print SAK EMKM financial statement PDF",
        desc: "Download or print ready-to-sign monthly profit/loss and balance sheet for stakeholders.",
        cta: "Export PDF",
        prompt: "Mbak Maya, please review my monthly profit/loss and balance sheet before I export them to PDF.",
      },
    },
    todoPending: (n: number) => `${n} pending`,
    todoCompletedCount: (n: number) => `${n} task completed`,
    consultAgent: (name: string) => `Ask ${name}`,
  },

  add: {
    title: "Record Receipt",
    subtitle: "Upload a receipt photo, and Nata records it automatically into your books.",
    dropTitle: "Drop receipt photo here",
    dropHint: "or click to select file",
    examplesLabel: "Or try an example",
    submit: "Post to my books",
    working: "Posting entry…",
    submitted: "Receipt posted successfully to your books.",
    samples: [
      { id: "atk", label: "Buy supplies", hint: "Paid cash" },
      { id: "peralatan", label: "Buy equipment", hint: "Pay later" },
      { id: "penjualan", label: "Today's sales", hint: "Cash received" },
    ],
  },

  activity: {
    title: "Nata Execution Trace",
    working: "Processing your receipt…",
    idle: "Add a receipt to inspect processing steps.",
    empty: "Nothing here yet. Select a receipt, then click ‘Post to my books’.",
    stillWorking: "Still processing…",
    finished: (seconds: string) => `Completed in ${seconds}s.`,
  },

  books: {
    title: "Journal",
    recordedDescription: "This entry has been posted.",
    rejectedDescription: "This entry was rejected.",
    pendingDescription: "Preparing this entry…",
    emptyDescription: "Your journal entries will appear here.",
    empty: "No entries yet.",
  },

  transaksi: {
    title: "Transactions",
    subtitle: "All records posted to your general ledger.",
    searchPlaceholder: "Search description or account…",
    filterAll: "All",
    filterOcr: "From receipts",
    filterManual: "Manual",
    countLabel: (n: number) => `${n} transactions`,
    emptyTitle: "No transactions yet",
    emptyBody: "Once you record receipts, all posted transactions will appear here.",
    detailTitle: "Transaction Details",
    balanced: "Balanced",
    viewReceipt: "View receipt",
    export: "Export journal",
    exported: "Journal exported as CSV.",
  },

  akun: {
    title: "Chart of Accounts",
    subtitle: "General ledger accounts conforming to SAK EMKM for micro and small entities.",
    aset: "Assets",
    liabilitas: "Liabilities",
    ekuitas: "Equity",
    pendapatan: "Revenue",
    beban: "Expenses",
    normalDebit: "Normal balance: Debit",
    normalCredit: "Normal balance: Credit",
    used: "Active",
    unused: "Unused",
    emptyBalance: "—",
    emptyTitle: "No accounts in use yet",
    emptyBody:
      "This list populates automatically as transactions are posted — Nata selects matching accounts for each receipt.",
    positionTitle: "Financial Position (Balance Sheet)",
    positionSubtitle: "Real accounts: Assets, Liabilities, and Equity",
    performanceTitle: "Financial Performance (Income Statement)",
    performanceSubtitle: "Nominal accounts: Revenue and Operating Expenses",
    activeAccountsCount: (n: number) => `${n} active accounts`,
  },

  laporan: {
    title: "Financial Statements",
    subtitle: "Compiled automatically from your ledger in compliance with SAK EMKM.",
    selectPeriod: "Period",
    allPeriods: "All Periods",
    allPeriodsCumulative: "All Recorded Periods (Cumulative)",
    allPeriodsRange: (start: string, end: string, months: number) =>
      `${start} – ${end} (${months} ${months === 1 ? "month" : "months"} total)`,
    labaRugi: "Income Statement",
    posisi: "Balance Sheet",
    calk: "Notes to Financial Statements (CALK)",
    revenue: "Revenue",
    expenses: "Expenses",
    totalRevenue: "Total Revenue",
    totalExpenses: "Total Expenses",
    netIncome: "Net Income",
    assets: "Assets",
    liabilities: "Liabilities",
    equity: "Equity",
    totalAssets: "Total Assets",
    totalLiabilities: "Total Liabilities",
    totalEquity: "Total Equity",
    currentYearProfit: "Current Year Earnings",
    balancedNote: "Assets = Liabilities + Equity balance is satisfied.",
    unbalancedNote: "Variance detected in the ledger. Please review your entries.",
    difference: "Variance",
    period: "Period",
    calkIntro:
      "Financial statements prepared in accordance with the Indonesian Financial Accounting Standards for Micro, Small, and Medium Entities (SAK EMKM).",
    calkPoints: [
      "Records are compiled under the accrual basis of accounting and historical cost convention.",
      "Equipment depreciation is calculated using the straight-line method with zero residual value.",
      "Income tax is calculated under the MSME Final Income Tax scheme at 0.5% of gross turnover.",
    ],
    export: "Export",
    exportCsv: "Export CSV (Excel)",
    exportPdf: "Export PDF (Printable)",
    exported: "Statement exported as CSV.",
    exportedPdf: "Opening printable financial statement PDF…",
    learnTerms: "Learn SAK EMKM Terms",
    learnTermsHint: "Master SAK EMKM accounting standards & CALK rules in Business School",
    calkBannerTitle: "Unsure about these accounting terms? Learn the essentials:",
    calkPills: {
      accrual: "Accrual Accounting",
      depreciation: "Asset Depreciation",
      taxFinal: "0.5% Final Tax",
      fullAcademy: "Open Business School",
    },
    emptyTitle: "Statements will appear once records exist",
    emptyBody:
      "Financial statements are generated from your general ledger. Record your first receipt to generate statements automatically.",
  },

  perizinan: {
    title: "Licensing",
    subtitle: "KBLI 2020 classification codes for your business, verified against the official catalog.",
    describeTitle: "What does your business do?",
    describeHint:
      "Describe in plain words. Nata matches your operations directly to the official KBLI catalog.",
    describePlaceholder:
      "Example: eatery selling prepared meals and beverages for dine-in customers.",
    run: "Find KBLI code",
    running: "Searching catalog…",
    rerun: "Search again",
    reset: "Reset",
    done: (seconds: string) => `Completed in ${seconds}s.`,
    candidatesTitle: "Candidate classifications",
    candidatesHint:
      "Retrieved from the official KBLI 2020 catalog \u2014 1,790 classified codes.",
    chosen: "Selected",
    useThis: "Use this code",
    verifyFailed: (code: string) =>
      `Code ${code} could not be verified in the catalog. Please select another candidate.`,
    emptyTitle: "No KBLI code selected",
    emptyBody:
      "Describe your business activities and click Find KBLI code. Nata will match them against the official catalog.",
    resultTitle: "Your KBLI Code",
    resultHintVerified: "This code exists in the official KBLI 2020 catalog.",
    resultHintEmpty: "Results will appear here after running the search.",
    fromCascade: "Verified from receipt processing",
    codeLabel: "Code",
    officialNameLabel: "Official Title",
    verified: "Verified",
    hierarchyLabel: "Classification Hierarchy",
    noResult: "No verified code yet. Run a search to get started.",
    riskTitle: "Risk Level & Licensing Requirements",
    riskLevelLabel: "Risk Level",
    riskUnknown: "Requires verification on OSS-RBA",
    riskNote:
      "The KBLI catalog does not encode risk levels (Low/Medium/High) or licensing requirements. Nata deliberately avoids guessing both, as they originate from OSS-RBA and carry legal consequences.",
    ossHint:
      "Next step: visit oss.go.id, enter the code above, and fulfill the regulatory requirements displayed for your enterprise.",
    agentTitle: "Regulasi Agent Explanation",
  },

  pajak: {
    title: "Taxes",
    subtitle: "MSME Final Income Tax calculation.",
    scheme: "MSME Final Income Tax — PP 55/2022",
    entityTitle: "Business Tax Treatment",
    entityExemptTitle: "Tax exemption up to Rp 500M",
    entityExemptBody:
      "As an individual taxpayer, gross revenue up to Rp 500 million per fiscal year is exempt from Final Income Tax. Tax is assessed only on excess turnover.",
    entityTaxedTitle: "Taxable from the first rupiah",
    entityTaxedBody:
      "As a corporate entity, the Rp 500 million exemption does not apply. The entire gross turnover is subject to the 0.5% rate.",
    entityChangeHint: "Update your business entity type in Business Profile.",
    rateLabel: "Rate",
    turnoverLabel: "Gross turnover (revenue)",
    baseLabel: "Tax base (DPP)",
    exemptionLabel: "Exempt turnover",
    payableLabel: "Tax payable",
    monthlyLabel: "Estimated per month",
    exemptNote:
      "Turnover up to Rp 500M is exempt for individual taxpayers. Sole proprietorship corporations (PT Perorangan) do not qualify for this exemption.",
    note:
      "Final Income Tax is calculated on gross turnover, not net profit. Figures shown are estimates and do not substitute for formal tax advice.",
    breakdown: "Calculation Breakdown",
    estimateOnly: "Estimate",
    exemptionUsage: "Exemption Quota Utilization",
    emptyTitle: "Tax calculation appears after entries exist",
    emptyBody:
      "Final Income Tax is computed from turnover recorded in your ledger. Record your first receipt — sales or expenses — to calculate taxes automatically.",
    noQuotaTitle: "No tax-exempt quota",
    noQuotaBody:
      "Corporate entities do not receive the Rp 500 million threshold; all gross turnover is subject to 0.5% tax from the first rupiah.",
    noQuotaCitation:
      "Legal basis: Government Regulation (PP) No. 55/2022 Article 60 paragraph (2) — exemption applies solely to individual taxpayers.",
    exemptionRemaining: (amount: string) => `${amount} remaining before taxable threshold.`,
    exemptionUsed: (percent: string) => `${percent} of tax-exempt quota utilized.`,
    exemptBanner:
      "Gross revenue is below the exemption threshold; tax payable is Rp 0. Nata computes taxes automatically once turnover exceeds the limit.",
    perMonth: (amount: string) => `≈ ${amount} per month`,
    basedOn: (months: number) => `computed from ${months} months of data`,
    agentTitle: "Tax Audit by Fiskal Agent",
    agentRun: "Calculate tax with Fiskal Agent",
    agentRerun: "Recalculate",
    agentRunning: "Fiskal Agent is calculating…",
    agentDone: (seconds: string) => `Completed in ${seconds}s.`,
    agentNote:
      "Nata uses gross turnover recorded in your general ledger, not profit. Every calculated figure links directly to statutory authority.",
    legalBasis: "Legal Basis",
    verbatimQuote: "Statutory Citation",
    officialCalc: "Official Fiskal Agent Calculation",
    noAgentYet:
      "Not yet verified by Fiskal Agent. The figures above are derived directly from your ledger; run the agent to inspect legal citations for each number.",
    handoffFrom: (from: string, to: string) => `${from} handed off ledger entries to ${to}`,
    fromBooks: "From your general ledger",
  },

  // ── Onboarding & Business Profile ─────────────────────────────────────────
  onboarding: {
    title: "Welcome to Nata",
    subtitle: "Complete your business setup. Nata is ready to work immediately.",
    submit: "Get Started with Nata",
    note: "All business data remains securely stored on your device.",
    backToHome: "Back to Home",
    skipToDemo: "Skip to Demo →",
    badge: "Interactive Evaluation",
    selectorTitle: "Choose how to experience Nata",
    selectorSubtitle:
      "Explore pre-configured business archetypes with real transaction ledgers, or initialize a clean business profile from scratch.",
    cards: {
      retail: {
        badge: "Jury Recommended",
        title: "Retail & E-Commerce",
        archetype: "Persona A · Rona Kirana Beauty",
        entity: "PT Perorangan · KBLI 47725 (Cosmetics)",
        features: [
          "TikTok & Shopee settlement reconciliations",
          "PPh 22 PMK 37/2025 marketplace withholding",
          "Automated double-entry inventory & COGS journals",
        ],
        cta: "Explore Retail Demo →",
      },
      fnb: {
        badge: "Multi-Outlet F&B",
        title: "Cafe & Restaurant",
        archetype: "Persona B · Kedai Seduh Nusantara",
        entity: "Orang Pribadi (Individual) · KBLI 56303 (Cafe)",
        features: [
          "POS revenue settlement & QRIS daily receipts",
          "Recipe costing & raw ingredient supplier invoices",
          "PBJT municipal hospitality tax calculations",
        ],
        cta: "Explore F&B Demo →",
      },
      scratch: {
        badge: "Clean Slate",
        title: "Start from Scratch",
        archetype: "Custom Enterprise Profile",
        entity: "Your chosen business name & tax entity",
        features: [
          "Live official KBLI 2020 catalog lookup",
          "Automatic tax status & exemption determination",
          "Photograph live receipts to post new transactions",
        ],
        cta: "Set Up My Business →",
      },
    },
    footnote:
      "All demo archetypes execute deterministic double-entry accounting compliant with SAK EMKM.",
  },

  usaha: {
    title: "Business Profile",
    subtitle: "Business profile details applied across your books and financial reports.",
    identity: "Business Identity",
    identityHint: "This name will appear on all reports and financial documents.",
    nameLabel: "Business Name",
    ownerLabel: "Owner Name",
    ownerPlaceholder: "Your Name",
    typeLabel: "Business Type",
    entityLabel: "Legal Entity Type",
    entityHint:
      "Determines whether the first Rp 500 million turnover is tax-exempt. Select the classification matching your business registration.",
    entityExempt: "Tax-exempt up to Rp 500M",
    entityTaxed: "Taxable from Rp 0",
    entityCitation:
      "Legal basis: PP 55/2022 Article 60 paragraph (2) — Rp 500 million exemption applies exclusively to individual taxpayers.",
    entityHints: {
      orang_pribadi: "Individual enterprise. Turnover up to Rp 500 million is tax-exempt.",
      pt_perorangan: "Single-member limited liability company. No Rp 500 million tax exemption.",
      pt_cv: "Corporate entity or commercial partnership. No tax exemption.",
    },
    kbliLabel: "KBLI 2020 Code",
    kbliNone: "Not set",
    kbliNoneHint: "Configure in the Licensing section.",
    kbliInvalidated:
      "Business type changed; previously selected KBLI code was reset. Please reselect in Licensing.",
    addressLabel: "Address",
    addressPlaceholder: "Jl. Sudirman No. 10, Jakarta",
    npwpLabel: "NPWP",
    npwpMeaning: "Taxpayer Identification Number (Nomor Pokok Wajib Pajak)",
    npwpPlaceholder: "00.000.000.0-000.000",
    nibLabel: "NIB (OSS RBA)",
    nibMeaning: "Nomor Induk Berusaha via Online Single Submission Risk-Based Approach (PP 5/2021)",
    nibPlaceholder: "13-digit OSS RBA number",
    nibExplainer: "Official 13-digit single registry number issued by BKPM/Ministry of Investment integrating business identity, import rights, and basic operational licensing.",
    macroHeading: "Business Info",
    macroSubtitle: "Basic information, address, and legal entity classification.",
    techHeading: "Legal & Licenses",
    techSubtitle: "Registered tax IDs, permits, and official company documents.",
    timelineTitle: "Compliance Timeline",
    timelineSubtitle: "Official documents and permits in order of issuance.",
    docType: "Document",
    docNumber: "Number",
    docIssuer: "Issuer",
    docIssueDate: "Issued",
    docExpiry: "Expires",
    statusVerified: "Verified",
    statusActive: "Active",
    statusInReview: "In Review",
    emptyDocs: "No documents added yet. Select a demo persona or add licenses.",
    editButton: "Edit Profile",
    cancelEdit: "Cancel",
    saveChanges: "Save Changes",
    confirmTitle: "Confirm Profile Changes",
    confirmDescription: "Review the modifications below before updating your business profile.",
    beforeLabel: "Current",
    afterLabel: "New",
    noChanges: "No changes detected.",
    confirmAction: "Confirm and Save",
  },

  // ── Landing page ──────────────────────────────────────────────────────────
  landing: {
    navHow: "How It Works",
    navWhy: "Why Nata",
    navAgents: "AI Staff",
    navAcademy: "Academy",
    navStart: "Get Started",
    heroBadge: "⚡ 24/7 Autonomous Business Staff · Powered by Gemini",
    heroTitle: "Runs your business admin while you sleep.",
    heroBody:
      "Nata is your dedicated AI back-office team. Snap raw receipts, talk to your bots, and rest easy. Books are balanced to the exact rupiah, taxes are safeguarded, and licenses are verified — zero payroll, zero late-night dread.",
    heroCta: "Start Free",
    heroSecondary: "See How It Works",
    heroFootnote: "For coffee shops, retail stores, food stalls, and online sellers across Indonesia.",
    teamTitle: "Meet your 4-person autonomous bot staff",
    teamSubtitle: "Specialized AI staff members working together 24/7 so you never have to touch a spreadsheet.",
    teamMembers: [
      {
        name: "Akuntan Pribadi",
        role: "Automated Bookkeeper",
        tagline: "Reads receipts in seconds and balances ledgers down to the rupiah.",
        benefit: "Bank-ready SAK EMKM financial statements on tap.",
      },
      {
        name: "Konsultan Pajak",
        role: "Tax Specialist",
        tagline: "Tracks 0.5% PPh Final and protects your Rp 500M personal exemption.",
        benefit: "Zero tax fines, zero surprise recalculations.",
      },
      {
        name: "Spesialis Legal",
        role: "Licensing & KBLI Officer",
        tagline: "Matches your business to official 5-digit KBLI 2020 codes from plain words.",
        benefit: "Official NIB permits verified against OSS RBA.",
      },
      {
        name: "Manajer Keuangan",
        role: "Digital CFO & Orchestrator",
        tagline: "Coordinates all agents atomically behind the scenes 24/7.",
        benefit: "One single touchpoint: photo in, balanced business out.",
      },
    ],
    problemTitle: "Running a business is exhausting. Bookkeeping shouldn't be.",
    problems: [
      {
        title: "Tired of manual bookkeeping",
        body: "After 14 hours serving customers, the last thing you want is spending your evening categorizing receipts into spreadsheets.",
      },
      {
        title: "Tax anxiety & surprise penalties",
        body: "Tax regulations sound like legal riddles. You worry about missed deadlines and unexpected fines on turnover.",
      },
      {
        title: "No formal records for bank loans",
        body: "Even a thriving shop gets rejected for credit or expansion capital if its records are scribbled in paper notebooks.",
      },
    ],
    howTitle: "How Nata Works",
    howBody: "Three straightforward steps. You only perform the first.",
    steps: [
      {
        title: "1. Tell us your business name",
        body: "Takes 30 seconds. Choose your business type and tax form once.",
      },
      {
        title: "2. Drop photos or speak notes",
        body: "Snap grocery invoices, supplier receipts, or payment proofs. Nata reads them instantly.",
      },
      {
        title: "3. Relax — bots handle the rest",
        body: "Balanced double-entry journals, SAK EMKM reports, 0.5% PPh Final, and verified KBLI codes are updated automatically.",
      },
    ],
    whyTitle: "Why Nata Stands Out",
    reasons: [
      {
        title: "Convenience first, compliance second",
        body: "You get a fast, delightful Canva-like experience. Strict SAK EMKM accounting and tax articles are handled silently under the hood.",
      },
      {
        title: "Models propose, deterministic code decides",
        body: "Mathematical ledger balance (Assets = Liabilities + Equity) is strictly enforced by programmatic Python code, never left to generative guesswork.",
      },
      {
        title: "Statutory citations on every calculation",
        body: "Taxes are computed directly from official PP 55/2022 provisions, and KBLI codes are verified against 1,790 catalog items.",
      },
    ],
    proofTitle: "Not just simple notes. Genuine accounting.",
    proofBody:
      "Every receipt undergoes standard financial verification: dual-sided balance validation and statutory citation backing every tax calculation.",
    proofItems: [
      {
        icon: "scan",
        title: "Both sides strictly balanced",
        body: "Models propose line items; deterministic code enforces integrity. Unbalanced journal entries are rejected, never stored.",
      },
      {
        icon: "book",
        title: "Statements compliant with SAK EMKM",
        body: "Income statements, balance sheets, and CALK generated directly from journals — not manually keyed spreadsheet cells.",
      },
      {
        icon: "tax",
        title: "Tax grounded in statutory articles",
        body: "0.5% Final Tax computed from official PP 55/2022 provisions, with every calculation citing specific articles and paragraphs.",
      },
      {
        icon: "license",
        title: "Verified KBLI classifications",
        body: "Operations mapped directly to the official KBLI 2020 catalog and verified before committing — preventing hallucinations.",
      },
    ],
    capabilities: {
      receiptToJournal: "Receipt photo → journal",
      sakStatements: "SAK EMKM statements",
      finalTaxArticles: "0.5% Final Tax + Statutory Articles",
      verifiedKbli: "Verified KBLI 2020 codes",
    },
    ctaTitle: "Sleep peacefully while Nata manages your books",
    ctaBody: "Free to start. One business, one phone, zero headaches.",
    ctaButton: "Get Started Free",
    footerTagline: "Autonomous 24/7 business suite for Indonesian enterprise.",
  },

  pengaturan: {
    title: "Settings",
    subtitle: "Manage your business data stored on this device.",
    dataTitle: "Business Data",
    dataBody: (name: string, count: number) =>
      `${name} — ${count} records saved on this device.`,
    demoTitle: "Load sample data",
    demoBody: "Populate your ledger with sample cafe transactions to explore all screens.",
    demoLoaded: "Sample data loaded.",
    clearTitle: "Clear ledger",
    clearBody: "Delete all journal entries while keeping your business profile intact.",
    clearAction: "Clear",
    clearConfirmTitle: "Clear ledger entries?",
    clearConfirmBody:
      "All transactions will be permanently deleted and cannot be recovered. Your business profile will be preserved.",
    cleared: "Ledger cleared.",
    dangerTitle: "Delete this business",
    dangerBody:
      "Deletes business profile and all recorded transactions from this device, resetting back to onboarding.",
    resetAction: "Delete all data",
    resetConfirmTitle: "Delete all business data?",
    resetConfirmBody:
      "Business profile and all financial records will be permanently removed from this device. This action cannot be undone.",
    reset: "All data deleted.",
  },

  errorScreen: {
    title: "Failed to load view",
    body:
      "A technical issue occurred while rendering this page. Your ledger remains unchanged — no partial data was saved.",
    retry: "Try reloading",
    reference: "Reference code",
  },

  notFound: {
    title: "Page Not Found",
    body:
      "The requested page does not exist or has moved. Your financial records are safe.",
    toApp: "Go to my books",
    toLanding: "Go to home",
  },

  status: {
    working: "Processing…",
    recorded: "Posted",
    notRecorded: "Unposted",
    waiting: "Pending",
  },

  agents: {
    keuangan: "Keuangan Agent",
    fiskal: "Fiskal Agent",
    regulasi: "Regulasi Agent",
    keuanganRole: "Records bookkeeping journals",
    fiskalRole: "Calculates tax liability",
    regulasiRole: "Determines KBLI code",
  },

  steps: {
    reading: {
      title: "Reading receipt image",
      detail: "Extracting merchant name, date, line items, and totals.",
    },
    matching: (lineCount: number) => ({
      title: "Mapping to accounts",
      detail: `${lineCount} lines prepared under SAK EMKM.`,
    }),
    matchingNoLines: {
      title: "Mapping to accounts",
      detail: "Journal entry prepared.",
    },
    checking: {
      title: "Verifying double-entry balance",
      detail: "Confirming debits equal credits before posting.",
    },
    posted: {
      title: "Posted to general ledger",
      detail: "Double-entry verified; transaction committed to ledger.",
    },
    problem: { title: "Halted prior to posting" },
    handoff: {
      title: "Handoff to tax auditor",
      detail: "Entry passed to Fiskal Agent for tax assessment.",
    },
    handoffRegulasi: {
      title: "Handoff to licensing specialist",
      detail: "Tax verification complete. Entry passed to Regulasi Agent for KBLI classification.",
    },
    kbliChecking: {
      title: "Searching KBLI 2020 catalog",
      detail: "Matching business activities against official KBLI 2020 classifications.",
    },
    kbliVerify: {
      title: "Validating against catalog",
      detail: "Confirming existence in the official KBLI 2020 catalog.",
    },
    kbliDone: {
      title: "KBLI code verified",
      detail: "Classification confirmed in official catalog.",
    },
    taxChecking: {
      title: "Computing 0.5% Final Tax",
      detail: "Assessing recorded gross revenue and checking Rp 500M exemption quota.",
    },
    taxDone: {
      title: "Tax calculation complete",
      detail: "Every figure backed by statutory Article/Paragraph citation.",
    },
    failure: {
      title: "Processing unsuccessful",
      detail: "Receipt not posted. No changes made to your general ledger.",
    },
  },

  problems: {
    unbalanced:
      "Journal entry is unbalanced; debits do not equal credits. Please retry this receipt.",
    tooFewLines: "A valid journal entry requires at least two lines. Please retry this receipt.",
    negative: "Negative amount detected; processing aborted. Please verify receipt values.",
    emptyAmount:
      "Line item is missing an amount; processing aborted. Please retry this receipt.",
    fallback: "Entry failed validation checks and was not posted.",
  },

  balance: {
    checking: "Verifying double-entry balance…",
    ok: "Balanced — debits equal credits. Posted to your ledger.",
    bad: "Unbalanced — debits do not equal credits; entry not posted.",
  },

  banner: {
    title: "Attention Required",
    offline:
      "Cannot connect to the accounting service. Ensure Nata backend is running and retry.",
    busy:
      "The service is currently busy. Your records remain safe — please wait a moment and retry.",
    timeout:
      "The operation timed out. Your records remain safe — please try again in a moment.",
  },
  academy: {
    title: "Business School",
    subtitle: "Essential knowledge on Indonesian accounting standards (SAK EMKM), tax rules, and legal compliance.",
    badge: "101 to Advanced",
    categoryFilter: {
      all: "All Topics",
      accounting_101: "Accounting",
      tax_compliance: "Taxes",
      licensing_legal: "Licensing",
      operations_team: "Team",
    },
    filterHint: "Practical knowledge for Indonesian business owners.",
    tracks: {
      platform: "Platform Mastery",
      platformDesc: "How to get the most out of Nata's autonomous bookkeeping and multi-agent engine.",
      business: "Business School",
      businessDesc: "Indonesian accounting (SAK EMKM), tax (PP 55/2022), KBLI licensing, and hiring.",
    },
    categories: {
      platform_basics: "Platform Workflows",
      accounting_101: "Accounting & Cash Flow",
      tax_compliance: "Tax Compliance & Pitfalls",
      licensing_legal: "Licensing & KBLI",
      operations_team: "Team & Operations",
    },
    difficultyLabels: {
      "101": "101 Fundamentals",
      intermediate: "Intermediate",
      advanced: "Advanced",
    },
    minRead: "min read",
    statuteGrounded: "Grounded Statute",
    actionButtons: {
      readLesson: "Read Guide",
      viewWalkthrough: "Visual Tour",
      tryNow: "Try in Nata",
      tryRecordVoice: "Try Voice Recording",
      checkTaxes: "Check Tax Calculations",
      checkLicensing: "Verify KBLI Code",
      viewAccounts: "View Chart of Accounts",
    },
    lessons: {
      plat_multimodal: {
        title: "Fast Receipt & Expense Extraction",
        summary: "Record transactions effortlessly via receipt photo capture or casual text notes.",
        content:
          "Nata allows business owners to record financial transactions using the fastest and most practical methods. Snap physical receipt photos, handwritten paper bills, or paste unstructured transaction notes from WhatsApp. Vision & Language AI deterministically extracts line items, quantities, vendors, and payment methods without tedious manual data entry.",
      },
      plat_trace: {
        title: "Agent Cascade Verification",
        summary: "Observe autonomous handoffs: Keuangan -> Fiskal -> Regulasi.",
        content:
          "When you submit a transaction, Agent Keuangan parses the data and commits balanced double-entry lines (Assets = Liabilities + Equity). Once posted, it performs a one-way handoff to Agent Fiskal to compute tax obligations, which in turn hands off to Agent Regulasi to classify the business's official KBLI 2020 code.",
      },
      plat_agents: {
        title: "Autonomous Multi-Agent AI Staff",
        summary: "Collaborate with 4 AI specialists: Mas Nata, Mbak Maya, Mas Dimas, and Pak Arief.",
        content:
          "Run your business operations with an integrated digital AI team in Nata. Mas Nata orchestrates transaction recording and business strategy, Mbak Maya verifies SAK EMKM-compliant double-entry accounting journals, Mas Dimas monitors MSME tax compliance (PP 55/2022) & the Rp 500M exempt band, and Pak Arief ensures legal compliance, OSS NIB, and official KBLI 2020 codes remain valid.",
      },
      plat_tax_monitor: {
        title: "Rp 500M Tax-Free Threshold Monitor",
        summary: "Track cumulative annual gross turnover against the PP 55/2022 tax-exempt ceiling.",
        content:
          "Under Indonesian Government Regulation PP 55/2022 Article 60, individual MSME taxpayers enjoy a 0% Final PPh rate on gross turnover up to Rp 500 million per fiscal year. Nata's Tax Module tracks cumulative revenue in real time, issues timely warnings before you reach the threshold, and computes the 0.5% Final PPh strictly on turnover exceeding Rp 500 million.",
      },
      plat_licensing_kbli: {
        title: "NIB Licensing & KBLI 2020 Validation",
        summary: "Synchronize day-to-day business activities with official OSS-RBA licensing standards.",
        content:
          "Avoid regulatory fines and licensing roadblocks. Nata's Licensing Module matches your operational entries and business description to official 5-digit KBLI 2020 codes from BPS & BKPM, determines your OSS-RBA risk tier (Low, Medium, High), and provides actionable guidance on standard operational certifications.",
      },
      plat_routines: {
        title: "Automated Routines & Tax Reminders",
        summary: "Automate monthly book closing, cash reconciliation, and statutory tax deadlines.",
        content:
          "Maintain accounting discipline with scheduled recurring workflows. Nata Routines automates daily and monthly responsibilities such as cash drawer verifications, marketplace payout reconciliations, 15th-of-the-month Final PPh remittances, and annual tax returns, delegating each routine directly to the designated AI specialist.",
      },
      plat_kur_readiness: {
        title: "Bank Loan & KUR Readiness",
        summary: "Generate bank-ready SAK EMKM financial statements for credit underwriting.",
        content:
          "Maximize your approval odds for People's Business Credit (KUR) and commercial bank loans. Nata automatically compiles the 3 foundational SAK EMKM financial reports: Statement of Financial Position (Balance Sheet), Income Statement (Profit & Loss), and Notes to Financial Statements (CALK), ready to print or export to Excel.",
      },
      plat_export: {
        title: "SAK EMKM Excel Exports",
        summary: "Export income statements and balance sheets formatted for Indonesian tax filing.",
        content:
          "Nata generates exportable reports that adhere to Indonesian standards: semicolon-delimited CSVs, UTF-8 BOM encoding for seamless Microsoft Excel compatibility, and standard Indonesian currency conventions (Rp X.XXX.XXX).",
      },
      biz_cash_separation: {
        title: "Cash Separation 101",
        summary: "Prevent audit failures by strictly separating personal and business funds.",
        content:
          "Under SAK EMKM Chapter 2, an enterprise is treated as a separate economic entity from its owner. Paying for groceries or school tuition directly out of the business cash drawer distorts profit margins and creates tax liabilities. Maintain a distinct Cash or Bank account and record owner withdrawals as Drawings (Prive) rather than business operational expenses.",
      },
      biz_tax_threshold: {
        title: "PP 55/2022 Tax Threshold",
        summary: "Sole proprietors pay 0% PPh Final on the first Rp 500 million annual turnover.",
        content:
          "Under Government Regulation PP 55/2022 Article 60 paragraph (2), individual MSME taxpayers pay 0% PPh Final on their first Rp 500 million in gross turnover within a fiscal tax year. Turnover exceeding Rp 500 million is taxed at a flat 0.5% rate.",
      },
      biz_pt_tax_trap: {
        title: "The PT Perorangan Tax Trap",
        summary: "PT Perorangan is a corporate entity taxed 0.5% starting from rupiah zero.",
        content:
          "Many entrepreneurs register a PT Perorangan thinking it carries individual tax benefits. Legally, PT Perorangan is a corporate body (Badan Usaha). Under PP 55/2022, corporate entities do not qualify for the Rp 500M exemption and are taxed 0.5% PPh Final starting from the very first rupiah of revenue.",
      },
      biz_cogs_recipe: {
        title: "F&B COGS & Recipe Costing",
        summary: "Calculate raw material consumption and gross margins across food and drink menus.",
        content:
          "In food & beverage businesses, selling price minus ingredient costs equals your gross margin. Small fluctuations in dairy, poultry, or coffee bean prices directly erode operating income. SAK EMKM Chapter 7 mandates recording raw inventory upon purchase and expensing it to COGS (Beban Pokok Penjualan) as batches are consumed.",
      },
      biz_marketplace_recon: {
        title: "E-Commerce Settlement",
        summary: "Report gross sales and platform deductions instead of net bank transfers.",
        content:
          "Marketplace escrow payouts already deduct admin commissions, payment fees, and promotional subsidies. Recording only the net cash arriving in your bank account understates your gross turnover, which violates Indonesian tax regulations. Revenue must be posted at gross invoice value, with marketplace deductions recorded as selling expenses.",
      },
      biz_kbli_oss: {
        title: "KBLI 2020 & Risk-Based Licensing",
        summary: "Match your 5-digit KBLI code to correct OSS-RBA licensing requirements.",
        content:
          "Government Regulation PP 5/2021 categorizes Indonesian business activities by hazard risk (Low, Medium-Low, Medium-High, High). A low-risk retail shop (KBLI 47725) needs only a basic NIB, whereas an F&B dining establishment (KBLI 56303) requires hygiene certificates and environmental declarations.",
      },
      biz_hiring_payroll: {
        title: "MSME Labor & Wage Rules",
        summary: "Understand statutory minimum wage exemptions under PP 36/2021.",
        content:
          "Under PP 36/2021 Article 36, micro and small enterprises are legally exempt from provincial/district minimum wage (UMR) mandates, provided agreed wages are at least 50% of the provincial average consumption rate. Fixed-term agreements (PKWT) must still be registered with the Ministry of Manpower.",
      },
    },
    mythsSectionTitle: "Indonesian Business & Tax: Myth vs Fact",
    mythsSectionSubtitle: "Debunking common compliance misconceptions with verbatim statutory citations.",
    mythLabel: "Common Myth",
    factLabel: "Legal Reality & Statute",
    viewMoreMyths: "View More Fun Facts",
    viewLessMyths: "Show Fewer",
    myths: {
      myth_pt_threshold: {
        myth: "Creating an Individual PT (PT Perorangan) gives you the Rp 500M tax exemption while protecting your personal assets.",
        fact: "False. PT Perorangan is a corporate entity (Badan Usaha). PP 55/2022 Article 60 paragraph (2) explicitly restricts the Rp 500M exemption to Orang Pribadi. PT Perorangan pays 0.5% PPh Final starting from rupiah 0.",
        statuteText:
          "PP 55/2022 Pasal 60 ayat (2): 'Wajib Pajak orang pribadi yang memiliki peredaran bruto tertentu... tidak dikenai Pajak Penghasilan atas bagian peredaran bruto sampai dengan Rp 500.000.000,00 dalam 1 tahun Pajak.'",
      },
      myth_tax_expense: {
        myth: "Under PPh Final UMKM 0.5%, collecting operational expense receipts is useless because taxes are based purely on gross revenue.",
        fact: "Dangerous misconception. SAK EMKM financial statements require complete expense accounting to compute true net operating profit, apply for bank credit facilities, and prepare for mandatory general tax regime transitions after 4-7 years.",
        statuteText:
          "SAK EMKM Bab 3 & PP 55/2022 Pasal 59: Skema PPh Final 0,5% memiliki batas waktu maksimal (7 tahun untuk orang pribadi, 3-4 tahun untuk badan), setelah itu wajib pembukuan umum.",
      },
      myth_kbli_arbitrary: {
        myth: "You can pick any KBLI code that sounds close on the OSS portal without business impact.",
        fact: "Misclassification can freeze bank merchant accounts, trigger OSS licensing audits, or classify your business under foreign investment negative list restrictions.",
        statuteText:
          "Peraturan BPS No. 2 Tahun 2020: Kode KBLI 5-digit adalah standar klasifikasi baku nasional yang mengikat perizinan berusaha dan pelaporan pajak.",
      },
      myth_qris_tax: {
        myth: "QRIS settlement fees (MDR 0.3%) are an Indonesian tax collected by the tax authority (DJP).",
        fact: "False. The 0.3% MDR is a payment processing fee paid to acquirers and payment switches regulated by Bank Indonesia. It is not income tax (PPh) and cannot offset your business tax obligations.",
        statuteText:
          "PADG BI No. 21/18/PADG/2019 & UU HPP: Biaya MDR QRIS adalah beban jasa sistem pembayaran perbankan, bukan penerimaan pajak negara.",
      },
      myth_cv_draw: {
        myth: "Profit withdrawals (Prive) taken by founders from a CV are taxed again as personal dividend income.",
        fact: "False. Under Article 4 paragraph (3) letter i of the Indonesian Income Tax Law, profit distributions to CV partners are explicitly non-taxable object income because the CV already paid its corporate tax.",
        statuteText:
          "UU PPh Pasal 4 ayat (3) huruf i: 'Bagian laba yang diterima atau diperoleh anggota dari perseroan komanditer... dikecualikan dari objek pajak.'",
      },
      myth_bpjs_mandatory: {
        myth: "Micro businesses (UMKM) are legally required to pay full enterprise-rate BPJS Ketenagakerjaan packages.",
        fact: "Government Regulation PP 37/2021 provides dedicated affordable social security schemes for micro enterprises (BPU / informal wage workers) starting from just Rp 16,800/month per staff for work injury & death protection.",
        statuteText:
          "PP 37/2021 & Permenaker No. 5/2021: Program jaminan sosial ketenagakerjaan bagi pekerja bukan penerima upah (BPU) disesuaikan dengan kemampuan usaha mikro.",
      },
      myth_ppn_threshold: {
        myth: "Every registered business selling goods must charge 11% or 12% Value Added Tax (PPN) on invoices.",
        fact: "False. Under PMK 197/2013, only businesses with gross annual turnover exceeding Rp 4.8 billion are required to register as Taxable Enterprises (PKP) and collect PPN. MSMEs below this threshold are exempt from charging PPN.",
        statuteText:
          "PMK No. 197/PMK.03/2013 Pasal 1: 'Pengusaha yang melakukan penyerahan BKP dan/atau JKP dengan jumlah peredaran bruto tidak melebihi Rp 4.800.000.000,00 ditetapkan sebagai Pengusaha Kecil.'",
      },
      myth_invoice_materai: {
        myth: "Invoices or receipts without a Rp 10,000 duty stamp (e-Meterai) are legally void and inadmissible.",
        fact: "False. A duty stamp is a state tax on legal documents, not an agreement validity condition under the Civil Code (Pasal 1320 KUHPer). Non-stamped invoices remain legally valid proof of sale and accounting records.",
        statuteText:
          "UU Bea Meterai No. 10 Tahun 2020 Pasal 3 ayat (2): Bea meterai dikenakan pada dokumen bernilai nominal lebih dari Rp 5.000.000, namun ketiadaan meterai tidak membatalkan keabsahan perdata dokumen.",
      },
      myth_depreciation: {
        myth: "Office laptops and shop machinery can be 100% written off as expenses immediately in the month purchased.",
        fact: "Under SAK EMKM Chapter 9, fixed assets with useful lives over 1 year must be capitalized and depreciated systematically over their productive lifespan to avoid distorting monthly profitability.",
        statuteText:
          "SAK EMKM Bab 9 (Aset Tetap): Aset tetap diakui sebesar biaya perolehan dan disusutkan secara garis lurus atau saldo menurun selama masa manfaatnya.",
      },
      myth_halal_selfdeclare: {
        myth: "Halal certification is expensive and takes months of laboratory chemical testing for simple street food stalls.",
        fact: "Under UU No. 33/2014 & BPJPH regulations, micro and small F&B businesses using known low-risk ingredients qualify for the Free Halal Certification (SEHATI) Self-Declare pathway assisted by registered halal companions.",
        statuteText:
          "Keputusan Kepala BPJPH No. 150/2022: Skema sertifikasi halal Self Declare gratis bagi pelaku usaha mikro dan kecil dengan bahan baku berisiko rendah.",
      },
      myth_freelance_pph21: {
        myth: "Paying informal freelancers or daily casual workers has no withholding tax implications for businesses.",
        fact: "Businesses must report honorariums under Income Tax Article 21 (PPh 21). Under PMK 168/2023, daily wages up to Rp 450,000/day carry 0% withholding, but formal payment slips must still be maintained.",
        statuteText:
          "PMK No. 168/2023 Pasal 5 & 12: Pemotongan PPh Pasal 21 atas penghasilan pegawai tidak tetap atau tenaga kerja lepas menggunakan tarif efektif harian/bulanan.",
      },
      myth_npwp_nik: {
        myth: "Having a 16-digit NIK automatically means your bank accounts will be audited and taxed by the tax office.",
        fact: "Integrating NIK as NPWP simplifies tax administration. Tax liability is triggered strictly by taxable income exceeding Non-Taxable Income (PTKP) or gross sales exceeding Rp 500 million/year, not simply by holding a national ID.",
        statuteText:
          "PMK No. 112/PMK.03/2022 jo. PMK 136/2023: Aktivasi NIK sebagai NPWP tidak otomatis menimbulkan kewajiban membayar pajak jika penghasilan di bawah PTKP/ambang batas.",
      },
    },
    funFactsPage: {
      title: "Business Compliance Fun Facts & Mythbusters",
      subtitle: "A comprehensive encyclopedia debunking Indonesian tax, accounting (SAK EMKM), labor, and licensing misconceptions with verbatim statutory citations.",
      badge: "Knowledge Hub",
      searchPlaceholder: "Search myths, statutes, or keywords (e.g. PT, PPh, QRIS, KBLI, BPJS)...",
      filterAll: "All Categories",
      filterTax: "Taxes & PP 55",
      filterAccounting: "Accounting & SAK",
      filterLegal: "Licensing & Law",
      filterOperations: "Team & Labor",
      backToAcademy: "← Back to Business School",
      stats: {
        totalVerified: "Statutory Myths Debunked",
        groundedInLaw: "Grounded in Regulations",
        freeForMSMEs: "100% Free Public Knowledge",
      },
      noResultsTitle: "No Fun Facts Found",
      noResultsDesc: "Try searching with different terms or select 'All Categories'.",
      browseLessonsCta: "Explore Practical Courses in Business School →",
    },
  },
} as const;
