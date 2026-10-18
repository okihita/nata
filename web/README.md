# Nata — Web Console

The Canva-simple web console for **Nata** — the 24/7 autonomous business suite that **runs your business admin while you sleep**.

Built for Indonesian MSMEs (warung, kafe, retail, online shops) for the **Google Cloud AI Builder Cup 2026**.

This is a full **business operations suite**, not just an accounting calculator. It is written for **everyday business owners, not accountants or programmers** — **convenience first, compliance second**. No intimidating debit-credit debacles, no raw legal codes without plain-language explanations.

### The 4 Autonomous Bot Staff
- 🤖 **Akuntan Pribadi** (`/record`): Scans receipts, verifies mathematical balance, commits to SAK EMKM ledgers.
- 🏛️ **Konsultan Pajak** (`/taxes`): Tracks 0.5% PPh Final and safeguards your Rp 500M personal exemption under PP 55/2022.
- 🛡️ **Spesialis Legal & KBLI** (`/licensing`): Maps plain words to official 5-digit KBLI 2020 codes and clarifies NIB requirements.
- ✨ **Manajer Keuangan Digital** (`/agents`): Coordinates all staff workflows atomically 24/7.
- 🎓 **Kuliah Bisnis / Academy** (`/academy`): Bite-sized interactive business lessons & mythbusters to demystify financial terms.

## Information architecture

A persistent sidebar on desktop, collapsing to a **bottom tab bar** on phones
(this audience is Android-first), grouped and colour-coded the way Indonesian
accounting software colour-codes its menus:

| Group | Tone | Screens |
| --- | --- | --- |
| **Ringkasan** | hijau | Dasbor |
| **Operasional** | hijau | Catat Struk, Transaksi |
| **Data Induk** | biru | Daftar Akun |
| **Laporan** | ungu | Laporan Keuangan, Pajak, Perizinan |
| **Lainnya** | oranye | Profil Usaha, Pengaturan |

Every route is implemented. Three screens carry the product's substance —
Catat Struk (ingestion), Pajak (tax), Perizinan (licensing) — and each is driven
by its agent rather than by local arithmetic.

### Screens

- **Dasbor** — KPI cards (pendapatan, beban, laba, pajak), a four-month revenue
  vs. expense chart, quick actions, a **Perlu tindakan** panel, and recent
  activity.
- **Catat Struk** — the OCR ingestion surface: drop a receipt, watch the live
  agent steps, see the posting and the balance check. A committed entry is
  written into the ledger.
- **Transaksi** — every journal entry, searchable and filterable by source
  (dari struk / manual), with a detail dialog per transaction and a **CSV
export** of whatever the filter is currently showing.
- **Daftar Akun** — the SAK EMKM chart of accounts, grouped by the five classes,
  with balances shown on each account's normal side.
- **Laporan Keuangan** — **Laporan Laba Rugi** and **Laporan Posisi Keuangan**
  with a period selector, plus CALK. The balance sheet proves
  Aset = Liabilitas + Ekuitas on screen, and **Ekspor** writes both statements
  to a CSV an accountant can open.
- **Pajak** — PPh Final UMKM (0,5%) with the Rp 500 juta exemption quota shown
  as a progress meter, so a Rp 0 result is informative rather than blank. A
  treatment banner states which rule applies to *this* business form, because
  the exemption is for orang pribadi only (Pasal 60 ayat (2)).
- **Perizinan** — the KBLI 2020 classification. Describe the business in plain
  words, Agent Regulasi searches the official 5-digit catalogue, and the chosen
  code is **verified against the catalogue** before it is stored. The candidate
  list is interactive — the owner can pick a different candidate and it is
  verified the same way. Risk tier is shown as "Perlu dicek di OSS-RBA" rather
  than guessed, because KBLI carries no risk data.
- **Profil Usaha** — business identity: name, owner, business type, and the
  business form (orang pribadi / PT Perorangan / PT-CV). It doubles as
  onboarding, and it shows the verified KBLI code once one exists.

## Accounting model

`src/lib/sak-emkm.ts` and `src/lib/ledger.ts` are pure logic — no React, no I/O:

- **Chart of accounts** — 38 accounts across Aset / Liabilitas / Ekuitas /
  Pendapatan / Beban, following SAK EMKM's five-group vocabulary and its named
  balance-sheet positions. Contra accounts (*Prive*, *Akumulasi Penyusutan*,
  *Retur dan Diskon Penjualan*) are flagged so their normal side inverts.
- **The journal is the single source of truth.** Every statement is *derived on
  read* from the entries; nothing stores a running balance, so what's on screen
  cannot drift from the journal.
- **Three statements.** SAK EMKM prescribes exactly three components — Laporan
  Posisi Keuangan, Laporan Laba Rugi, and CALK — not five. A cash-flow statement
  would be over-engineering relative to the standard.
- **The equation.** Current-period profit is folded into equity as *Laba Tahun
  Berjalan* before the two sides are compared; the strict three-term equation
  only holds after period close.
- Amounts are integer rupiah, and the balance check is exact — not float.

## The agentic layer

The OCR path is real, not mocked. `POST /run_sse` streams the agent's events and
the UI folds them into a plain-language sequence:

```
Membaca struk Anda → Dicatat ke akun → Memastikan hitungan pas → Masuk ke pembukuan
```

The assistant proposes a posting; the deterministic Python tool decides. **If
the balance check rejects it, nothing is written to the ledger** — the UI shows
the reason in plain Indonesian. The model proposes; the code enforces.

## Running it

Prerequisites: the ADK backend reachable on `:48700` and Node 20+.

```bash
# terminal 1 — the agent
cd .. && uv run adk api_server --port 48700

# terminal 2 — the console
pnpm install
pnpm dev                                    # http://localhost:48701
pnpm build && pnpm start                    # production build, same port
```

Ports are deliberately high/uncommon (`48700` backend, `48701` console, `48702`
`adk web` playground) so they never collide with the usual dev suspects. They sit
just below the OS ephemeral port range (49152–65535) to avoid clashing with
transient outbound sockets:

| Port | Service |
| --- | --- |
| `48700` | ADK `api_server` — backend this console proxies to |
| `48701` | Next.js console |
| `48702` | `adk web` dev playground (framework harness) |

### Demo data

On first run the ledger seeds four months of realistic activity for a small
Jakarta café, so the dashboard, statements and tax page all show real shape.
Revenue is kept under the Rp 500 million individual exemption so the tax page
exercises the exemption rule. To start clean, clear `localStorage`.

## How it talks to the backend

```
browser ──▶ /api/adk/*  (Next route handler, same origin)
                │  streams the response through untouched, SSE included
                ▼
        ADK FastAPI server (default http://127.0.0.1:48700)
```

The browser never calls the Python server directly, which removes CORS from the
picture and gives one place to repoint at a deployed Cloud Run URL:

```bash
ADK_SERVER_URL=https://nata-agent-xxxx.a.run.app pnpm start
```

### Endpoints used

| Call | Purpose |
| --- | --- |
| `POST /apps/nata_agent/users/{user}/sessions` | Open a conversation + ledger session |
| `GET .../sessions/{id}` | Reuse an existing session if the backend still knows it |
| `POST /run_sse` | Run Agent Keuangan; stream events back as SSE |

## Layout

```
src/
├── app/
│   ├── (app)/                       # everything inside the shell
│   │   ├── layout.tsx               # sidebar + top bar + mobile tab bar
│   │   ├── page.tsx                 # Dasbor
│   │   ├── catat/page.tsx           # Catat Struk (OCR)
│   │   ├── transaksi/page.tsx       # Transaksi
│   │   ├── akun/page.tsx            # Daftar Akun
│   │   ├── laporan/page.tsx         # Laporan Keuangan
│   │   ├── pajak/page.tsx           # Pajak
│   │   ├── perizinan/page.tsx       # Perizinan (KBLI 2020)
│   │   ├── usaha/page.tsx           # Profil Usaha (identity + onboarding)
│   │   └── pengaturan/page.tsx      # Pengaturan (data actions)
│   ├── api/adk/[...path]/route.ts   # streaming proxy to the ADK server
│   ├── layout.tsx                   # <html lang="id">, providers, toaster
│   └── globals.css                  # shadcn light theme
├── components/
│   ├── app-sidebar.tsx              # nav + shared PageHeader
│   ├── mobile-tab-bar.tsx           # bottom tabs for phones
│   ├── workspace-switcher.tsx       # business identity in the top bar
│   ├── coming-soon.tsx              # placeholder for unmapped screens
│   └── ui/                          # shadcn/ui primitives
└── lib/
    ├── sak-emkm.ts                  # chart of accounts + statutory constants
    ├── ledger.ts                    # journal, statements, tax, seed data
    ├── store.tsx                    # LedgerProvider (localStorage)
    ├── nav.ts                       # navigation config + colour tones
    ├── adk.ts                       # SSE transport + typed events
    ├── copy.ts                      # ALL user-facing Indonesian strings
    ├── trace.ts                     # folds SSE frames into run state
    ├── format.ts                    # Rupiah / time formatting
    └── utils.ts                     # cn() helper (from shadcn)
```

### Language

The interface is **Indonesian**, written for shop owners rather than
accountants: "struk" not "dokumen sumber", "pembukuan" not "jurnal umum",
"bayar nanti" not "utang usaha". Every visible string lives in
`src/lib/copy.ts` — change the copy there, not in the components. Adding an
EN/ID toggle later is a matter of swapping that one module.

(Code comments stay in English, for the developers.)

## Verified

- `pnpm exec tsc --noEmit` — clean.
- `pnpm lint` — clean.
- `pnpm test` — 37 logic tests (entity/tax treatment, trace reduction, error
  classification, CSV export). Node's built-in runner executes the TypeScript
  directly; see `tests/register.mjs` for the resolver that teaches it the
  `@/*` alias.
- `pnpm build` — clean production build; all 12 routes generate.
- Every route returns 200 on the production server.
- End-to-end on the production bundle: sample receipt → Agent Keuangan →
  `commit_journal_entry` → Agent Fiskal → Agent Regulasi → a recorded entry,
  balanced, with a verified KBLI code, driven by live Gemini 3.8 Flash. Steps
  render in narrative order.
- Statements reconcile: Aset = Liabilitas + Ekuitas proven on the Laporan page,
  and the tax figure on Dasbor matches the Pajak page.
- Entity type changes the tax everywhere it should: the onboarding badge, the
  Pajak treatment banner, the quota meter (individual only), and the dashboard
  status row all agree.

> Note: hydration was verified against the **production** build. Under headless
> automation the dev server's HMR socket is unavailable, which stalls hydration —
> use `pnpm build && pnpm start` when demoing or automating.
