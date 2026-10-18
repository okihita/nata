# PRD: Autonomous Routines & Background Cron Jobs ("Rutinitas")

## 1. Executive Summary & Problem Space
Indonesian MSMEs fail at accounting and compliance not from lack of intention, but from **operational fatigue**. Operators forget to reconcile POS settlements, miss withholding tax deduction slips, fail to track turnover against the Rp 500.000.000 non-taxable PP 55/2022 threshold, and overlook permit renewals.

Current "AI accounting" software requires manual prompts ("What is my cash balance?"). **Nata Rutinitas** flips the paradigm: autonomous agents execute scheduled background jobs (cron routines) on Google Cloud, actively guarding the ledger, cash flow, and tax position while the operator sleeps.

## 2. Core Personas & Grounded Use Cases
1. **Persona A — Rona Kirana Beauty (Retail & E-commerce, Shopee/Tokopedia):**
   - Routine: Nightly Settlement & Marketplace Fee Audit (02:00 WIB).
   - Routine: PPh 22 & PMK 37/2025 E-Commerce Tax Withholding Tracker (Weekly).
   - Routine: Inventory Turnover & Fast-Moving SKU Reorder Sentinel.
2. **Persona B — Kedai Seduh (F&B Multi-Outlet, POS Moka/Pawoon):**
   - Routine: Daily Morning CFO Cashflow Briefing (07:00 WIB).
   - Routine: PBJT 10% Local Restaurant Tax Accrual Check (Monthly, 5th).
   - Routine: Food Cost Ratio & Waste Spike Anomaly Watchdog (Weekly).

## 3. Product Architecture & Component Specification
The `/routines` (Indonesian: `/rutinitas`) interface provides:
1. **Header & System Heartbeat:**
   - Active routine count, health indicator (Cloud Scheduler / Cloud Run Worker status), and quick action: `[ Run All Due Routines Now ]`.
2. **Routine Grid / Cards:**
   - Title, assigned autonomous agent badge (`Mas Nata` / `Mba Maya` / `Mas Dimas` / `Bang Arief`).
   - Cron schedule expression (e.g., `0 7 * * *` — Every day at 07:00 WIB).
   - Status pill: `Active` / `Idle` / `Running` / `Paused`.
   - Last run execution timestamp & result status (e.g. `2 hours ago · SAK EMKM Verified`).
   - Grounded output preview (summary of finding, journal impact, or alert).
   - Immediate trigger action (`[ Trigger Run ]`) allowing hackathon judges to execute and witness background agent execution on demand.
3. **Execution History & Audit Log:**
   - Tabular / timeline log showing exact execution run times, agent invocations, tokens used, and direct links to generated journal entries or statutory citations.
4. **Trigger Detail / Resolution Modal:**
   - Deep inspection of a routine run showing the agent's observation, internal chain of reasoning, deterministic verification rule, and resulting ledger action.

## 4. UI/UX Rules & Constraints
- **Zero Emojis Policy:** Strict text-only, concise, authoritative copy.
- **Zero Glassmorphism:** Opaque, crisp, solid borders and high-contrast surfaces (`bg-card`, `border-border`, solid badges).
- **Internationalization:** Complete bilingual parity across English (`copy-en.ts`) and Indonesian (`copy-id.ts`).
- **Deterministic Actionability:** Triggering a routine is interactive; judges can test real agent analysis directly in the browser.

## 5. Architectural Decision Record (ADR): Persistence Strategy

### Context
Autonomous Routines require persistent storage for routine definitions, cron configurations, execution logs, and heterogeneous agent artifacts (cash briefings, tax threshold sentinels, reconciliation diffs, and licensing certificates). We evaluated whether to adopt Firestore, Cloud SQL (PostgreSQL), or Cloud Pub/Sub + Cloud Tasks for routine state management.

### Decision
Adopt a **hybrid persistence pattern**:
1. **Firestore as the Agent Orchestration & State Document Layer:**
   - **Schema Agility:** Agent-generated execution artifacts (JSON payloads with varying structures per routine type) map naturally to Firestore documents (`/businesses/{businessId}/routines/{routineId}/executions/{execId}`).
   - **Real-Time Client Sync & Low Latency:** Sub-100ms listener reads and reactive updates for web dashboards during autonomous background executions.
   - **Offline & Local Development Fallback:** Built-in in-memory fallback pattern allows complete frontend test and demo execution without mandatory cloud emulator overhead.
2. **Cloud SQL (PostgreSQL) Reserved for the General Ledger Core:**
   - Enforces ACID transactions, double-entry bookkeeping invariant (`Assets = Liabilities + Equity`), strict foreign keys, and statutory financial reporting queries.
3. **Execution Driver:**
   - Google Cloud Scheduler triggers HTTP webhooks on Cloud Run, which fetch routine metadata from Firestore, execute the autonomous agent loop, record execution artifacts back into Firestore, and commit ledger entries to the core database via deterministic guardrails.

### Consequences
- Document model eliminates rigid SQL migrations for evolving AI agent output payloads.
- Clear boundary separation: General ledger retains strict ACID relational integrity, while agent orchestration operates on flexible document storage.

