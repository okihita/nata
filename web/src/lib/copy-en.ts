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

  // ── Main navigation ────────────────────────────────────────────────────────
  nav: {
    groups: [
      { label: "Overview", items: ["dashboard"] },
      { label: "Operations", items: ["catat", "transaksi", "akun"] },
      { label: "Reports", items: ["laporan", "pajak"] },
      { label: "Other", items: ["usaha", "pengaturan"] },
    ],
    dashboard: "Dashboard",
    catat: "Record Receipt",
    transaksi: "Transactions",
    akun: "Chart of Accounts",
    laporan: "Financial Statements",
    pajak: "Taxes",
    perizinan: "Licensing",
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
    complianceTitle: "Business Status",
    complianceEntity: "Legal Entity",
    complianceTax: "Tax Treatment",
    complianceKbli: "KBLI Code",
    complianceKbliNone: "Not set",
    complianceKbliCta: "Select",
    complianceOpen: "View licensing",
    ownerHint: "For business owners — snap a receipt, automation handles the rest.",
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
  },

  laporan: {
    title: "Financial Statements",
    subtitle: "Compiled automatically from your ledger in compliance with SAK EMKM.",
    selectPeriod: "Period",
    allPeriods: "All periods",
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
    exported: "Statement exported as CSV.",
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
    kbliLabel: "KBLI 2020 Code",
    kbliNone: "Not set",
    kbliNoneHint: "Configure in the Licensing section.",
    kbliInvalidated:
      "Business type changed; previously selected KBLI code was reset. Please reselect in Licensing.",
  },

  // ── Landing page ──────────────────────────────────────────────────────────
  landing: {
    navHow: "How It Works",
    navWhy: "Why Nata",
    navStart: "Get Started",
    heroBadge: "Powered by Gemini on Google Cloud",
    heroTitle: "From receipt photos to balanced books.",
    heroBody:
      "Nata parses receipts, posts double-entry journal entries compliant with SAK EMKM, calculates 0.5% MSME Final Tax, and classifies your KBLI code — all grounded in statutory regulations. No accountants, no spreadsheets.",
    heroCta: "Start Free",
    heroSecondary: "See How It Works",
    heroFootnote: "For food stalls, retail stores, cafes, and service businesses across Indonesia.",
    problemTitle: "Bookkeeping is burdensome. That is why so many give up.",
    problems: [
      {
        title: "Manual entry is tedious",
        body: "After a long day serving customers, reconciling receipts into ledgers is the last thing you want to do.",
      },
      {
        title: "Accountants are expensive",
        body: "Monthly bookkeeping retainers can exceed a small business's margins — when all you need is reliable, accurate books.",
      },
      {
        title: "No financial records for banks",
        body: "Without standardized books, even profitable businesses struggle to secure capital because lenders cannot assess risk.",
      },
    ],
    howTitle: "How Nata Works",
    howBody: "Three straightforward steps. You only perform the first.",
    steps: [
      {
        title: "Enter business profile",
        body: "Business name and legal tax status. Once only, taking under a minute.",
      },
      {
        title: "Photograph receipts",
        body: "Purchases, sales invoices, fee receipts. Nata reads images and maps accounts automatically under SAK EMKM.",
      },
      {
        title: "Books, taxes & licenses handled",
        body: "Balanced double-entry journals, financial statements, 0.5% Final Tax, and KBLI 2020 codes — with full statutory citations.",
      },
    ],
    whyTitle: "Why Nata Stands Out",
    reasons: [
      {
        title: "Models propose, deterministic code decides",
        body: "Nata only posts strictly balanced entries. Ledger balance is enforced by programmatic validation, never left to generative output.",
      },
      {
        title: "Statutory citations on every calculation",
        body: "Taxes are computed directly from official PP 55/2022 text, and KBLI codes are validated against 1,790 catalog entries — with clear citations.",
      },
      {
        title: "Runs on Google Cloud",
        body: "Gemini models on Vertex AI running on Cloud Run — enterprise-grade infrastructure applied to MSME accounting.",
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
    ctaTitle: "Start automated bookkeeping today",
    ctaBody: "Free to start. One business, one phone.",
    ctaButton: "Get Started Free",
    footerTagline: "Automated bookkeeping for Indonesian enterprise.",
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
} as const;
