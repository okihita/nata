export type AgentId = "keuangan" | "fiskal" | "regulasi" | "orchestrator";

export interface AgentMetric {
  label: string;
  value: string;
}

export interface AgentToolDoc {
  name: string;
  signature: string;
  description: string;
  guardrail: string;
}

export interface AgentConfigMock {
  id: AgentId;
  nameKey: "keuangan" | "fiskal" | "regulasi";
  title: string;
  category: string;
  status: "active" | "standby";
  model: string;
  version: string;
  endpoint: string;
  framework: string;
  description: string;
  mandate: string;
  metrics: AgentMetric[];
  tools: AgentToolDoc[];
  samplePayload: string;
  sampleOutput: string;
}

export const AGENT_CONFIGS: Record<AgentId, AgentConfigMock> = {
  keuangan: {
    id: "keuangan",
    nameKey: "keuangan",
    title: "Agent Keuangan (Bookkeeping)",
    category: "Autonomous Accounting",
    status: "active",
    model: "gemini-3.8-flash",
    version: "ADK 2.x (Multi-Turn)",
    endpoint: "Vertex AI Global (asia-southeast2 fallback)",
    framework: "Google Agent Development Kit (ADK)",
    description: "Multimodal ingestion agent that reads commercial transaction receipts, decomposes item lines, and prepares SAK EMKM compliant double-entry journals.",
    mandate: "Enforces fundamental accounting identity: Assets = Liabilities + Equity. Postings with non-zero delta are deterministically rejected.",
    metrics: [
      { label: "Execution Latency", value: "840 ms avg" },
      { label: "Deterministic Balance Check", value: "100% Pass" },
      { label: "Standard Standardized", value: "SAK EMKM DSAK IAI" },
      { label: "Multimodal Vision", value: "Gemini 3.8 Flash Vision" },
    ],
    tools: [
      {
        name: "commit_journal_entry",
        signature: "commit_journal_entry(date, memo, lines: list[JournalLine]) -> str",
        description: "Deterministic guardrail tool that inspects debit and credit sums, verifies exact zero variance, and writes to SQLite journal store.",
        guardrail: "Zero-variance assertion. If debits != credits, returns JournalEntryError and stops mutation.",
      },
      {
        name: "read_receipt_metadata",
        signature: "read_receipt_metadata(image_bytes: bytes) -> ReceiptMetadata",
        description: "Extracts merchant name, transaction date, tax invoice indicators, and raw line items directly from unstructured receipt photography.",
        guardrail: "Schema validation via Pydantic model with strict type constraints.",
      },
    ],
    samplePayload: `{
  "action": "ingest_receipt",
  "merchant": "Toko Bahan Baku Barokah",
  "total": 350000,
  "items": [
    { "name": "Biji Kopi Arabika 2kg", "amount": 250000 },
    { "name": "Susu UHT Fresh 5L", "amount": 100000 }
  ]
}`,
    sampleOutput: `{
  "status": "BALANCED_POSTED",
  "entry_id": "jn_20261018_0942",
  "lines": [
    { "account": "Persediaan Barang Dagang", "debit": 350000, "credit": 0 },
    { "account": "Kas Tunai", "debit": 0, "credit": 350000 }
  ],
  "variance": 0,
  "guardrail_status": "APPROVED"
}`,
  },
  fiskal: {
    id: "fiskal",
    nameKey: "fiskal",
    title: "Agent Fiskal (Taxation)",
    category: "Tax Compliance",
    status: "active",
    model: "gemini-3.8-flash",
    version: "ADK 2.x (Multi-Turn)",
    endpoint: "Vertex AI Global (asia-southeast2 fallback)",
    framework: "Google Agent Development Kit (ADK)",
    description: "Evaluates fiscal obligations under PP 55/2022, UU HPP, and PMK 37/2025. Tracks cumulative gross turnover and calculates PPh Final 0.5% liabilities.",
    mandate: "Applies statutory exemption bands: Rp 500 million zero-rate threshold for Orang Pribadi, standard 0.5% for PT Perorangan and PT/CV.",
    metrics: [
      { label: "Calculation Accuracy", value: "100% Deterministic" },
      { label: "Statute In-Context", value: "PP 55/2022 & UU HPP" },
      { label: "Entity Types Supported", value: "3 Forms (OP, PT Perorangan, PT/CV)" },
      { label: "Tax Rate", value: "0.5% Gross Turnover" },
    ],
    tools: [
      {
        name: "compute_pph_final",
        signature: "compute_pph_final(gross_turnover: int, entity_type: str, cumulative_turnover: int) -> TaxResult",
        description: "Evaluates statutory turnover bands and calculates precise PPh Final payable, referencing exact statutory articles.",
        guardrail: "Hardcoded exemption logic. Orang Pribadi below Rp 500M turnover returns 0 liability.",
      },
    ],
    samplePayload: `{
  "entity_type": "orang_pribadi",
  "monthly_turnover": 45000000,
  "cumulative_year_turnover": 380000000
}`,
    sampleOutput: `{
  "tax_liability": 0,
  "statute_reference": "PP 55/2022 Pasal 57 & 60",
  "threshold_remaining": 120000000,
  "explanation": "Peredaran bruto kumulatif belum melampaui batas Rp 500.000.000 untuk Wajib Pajak Orang Pribadi."
}`,
  },
  regulasi: {
    id: "regulasi",
    nameKey: "regulasi",
    title: "Agent Regulasi (OSS & KBLI)",
    category: "Regulatory Licensing",
    status: "active",
    model: "gemini-3.8-flash",
    version: "ADK 2.x (Multi-Turn)",
    endpoint: "Vertex AI Global (asia-southeast2 fallback)",
    framework: "Google Agent Development Kit (ADK)",
    description: "Navigates 1,790 official 5-digit KBLI 2020 classifications and OSS Risk-Based Assessment (RBA) requirements for business permits.",
    mandate: "Synthesizes statutory licensing prerequisites without external RAG hallucination, grounding decisions directly from verified regulatory catalogues.",
    metrics: [
      { label: "KBLI Catalogue Depth", value: "1,790 Official Codes" },
      { label: "System Standard", value: "OSS RBA PP 5/2021" },
      { label: "Average Inference", value: "620 ms" },
      { label: "Grounding Integrity", value: "Zero Unverified Codes" },
    ],
    tools: [
      {
        name: "classify_kbli",
        signature: "classify_kbli(business_description: str, product_types: list[str]) -> list[KBLIClassification]",
        description: "Analyzes business activity descriptions against BPS KBLI 2020 taxonomy and returns canonical code, risk level, and required permits.",
        guardrail: "Whitelist validation against offline verified 1,790 code index.",
      },
    ],
    samplePayload: `{
  "business_description": "Kedai kopi seduh manual, penjualan espresso, cold brew, dan pastry pendamping",
  "entity_type": "pt_perorangan"
}`,
    sampleOutput: `{
  "primary_kbli": "56303",
  "title": "Rumah Minum/Kafe",
  "risk_level": "Rendah",
  "licensing_requirement": "NIB (Nomor Induk Berusaha) berlaku sebagai legalitas operasional penuh.",
  "governing_statute": "PP No. 5 Tahun 2021"
}`,
  },
  orchestrator: {
    id: "orchestrator",
    nameKey: "keuangan",
    title: "Orchestration Pipeline",
    category: "Autonomous Multi-Hop",
    status: "active",
    model: "Cascade Coordinator",
    version: "ADK Pipeline v1.2",
    endpoint: "Cloud Run Inter-Service Router",
    framework: "Deterministic State Machine",
    description: "Supervises multi-agent sequential handoffs. When an invoice is processed, Keuangan balances the ledger, Fiskal calculates tax, and Regulasi validates compliance.",
    mandate: "Maintains atomic transactions across autonomous sub-agents, preventing out-of-order execution or desynchronized state.",
    metrics: [
      { label: "Handoff Latency", value: "42 ms" },
      { label: "Pipeline Reliability", value: "99.98%" },
      { label: "Cascading Steps", value: "3 Coordinated Agents" },
      { label: "Failure Isolation", value: "Atomic Rollback" },
    ],
    tools: [
      {
        name: "handoff_agent",
        signature: "handoff_agent(target_agent: str, context: ExecutionContext) -> PipelineStepResult",
        description: "Dispatches control between Keuangan, Fiskal, and Regulasi with typed payload verification.",
        guardrail: "Context immutability check and step deduplication.",
      },
    ],
    samplePayload: `{
  "trigger": "transaction_ingested",
  "source": "receipt_upload",
  "pipeline": ["keuangan", "fiskal", "regulasi"]
}`,
    sampleOutput: `{
  "status": "COMPLETED",
  "step_1": "keuangan -> journal posted (Kas vs Persediaan)",
  "step_2": "fiskal -> PPh Final 0.5% evaluated (0 IDR under threshold)",
  "step_3": "regulasi -> KBLI 56303 confirmed",
  "total_duration_ms": 1420
}`,
  },
};
