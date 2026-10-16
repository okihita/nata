# Nata

**Receipt photo → SAK EMKM double-entry journal entry → PPh Final tax, with
statutory citations.**

Nata is an autonomous back-office & compliance engine for Indonesian SMBs,
built for the **Google Cloud AI Builder Cup 2026**.

Two vertical slices are built:

| Slice | What it does |
| --- | --- |
| **A — Agent Keuangan** | Reads a receipt image and commits a balanced double-entry journal entry under **SAK EMKM** (the Indonesian financial-accounting standard for micro, small & medium entities). |
| **B — Agent Fiskal** | Receives the committed journal, computes the **PPh Final UMKM 0,5%** liability (PP 55/2022) and grounds every figure in an exact Pasal/Ayat citation. |

This is a Python [ADK](https://google.github.io/adk-docs/) project with a
Next.js console. Gemini multimodal parses the receipt; deterministic Python
tools enforce the accounting identity `Assets = Liabilities + Equity` and do
the tax arithmetic.

> **Branching:** this repo uses a lite git flow (`main` / `develop` /
> `feature/*`). See [AGENTS.md](./AGENTS.md) before making changes.

## Architecture

```
receipt image ──▶ Agent Keuangan (LlmAgent, Gemini multimodal)
                        │  proposes journal lines
                        ▼
              commit_journal_entry(description, lines[])
                        │  HARD GUARDRAIL (deterministic):
                        │   • debit total == credit total
                        │   • ≥2 lines, each debit XOR credit
                        ▼
              accepted entry ──▶ session state (ledger_entries)
                        │  one-way handoff
                        ▼
                  Agent Fiskal (tax compliance)
                        │  calls compute_pph_final(turnover)
                        ▼
              PPh Final 0,5%  +  verbatim Pasal/Ayat citations
                        (read from nata_agent/statutes/ — no managed RAG)
```

**The model proposes, the code enforces.** `commit_journal_entry` never trusts
the LLM: it re-validates the posting and raises on any violation. The tax
agent likewise never does its own arithmetic and never invents a citation —
`compute_pph_final` recomputes everything and attaches quotes that are checked
verbatim against the in-repo statute text.

## Prerequisites

1. **Python 3.12** via [`uv`](https://docs.astral.sh/uv/) (system `python3` is
   3.9 — too old). `uv` will provision 3.12 automatically.
2. **Google Cloud Application Default Credentials (ADC)** authorised for
   project `nata-hackathon`:
   ```bash
   gcloud auth application-default login
   ```
   No API keys live in code — ADK/Gemini authenticate via ADC.

## Run it (3 steps)

```bash
# 1. Install dependencies into .venv (Python 3.12)
uv sync

# 2. Configure env — copy the template and keep it OUT of git
cp .env.example .env    # .env is gitignored; never commit real values

# 3. Launch the ADK dev UI from the repo root
uv run adk web --port 48702   # open http://localhost:48702, pick "nata_agent"
```

CLI instead of a browser:

```bash
uv run adk run nata_agent
```

`adk web` is the framework's dev harness (a generic chat playground). The
product UI is the Next.js dashboard in [`web/`](./web) — Indonesian, light mode,
written for shop owners: **Dasbor**, **Catat Struk** (receipt OCR), **Transaksi**,
**Daftar Akun**, **Laporan Keuangan** (SAK EMKM statements) and **Pajak**
(PPh Final UMKM), plus routed "segera hadir" placeholders. It talks to the same
agent API; run `adk api_server --port 48700` behind it.

Ports are a reserved, high/uncommon namespace so they never collide with other
dev servers on the same machine:

| Port | Service |
| --- | --- |
| `48700` | ADK `api_server` (backend the console proxies to) |
| `48701` | Next.js console |
| `48702` | `adk web` dev playground |

See [`web/README.md`](./web/README.md) for the information architecture, the
accounting model, and how to run it.

## Tests

```bash
uv run pytest
```

## Repo layout

```
.
├── pyproject.toml            # uv-managed; pins adk + google-genai + pydantic
├── .env.example              # placeholder env (no secrets)
├── README.md
├── nata_agent/
│   ├── __init__.py           # exports root_agent
│   └── agent.py              # Agent Keuangan + commit_journal_entry tool
├── tests/
│   ├── test_commit_journal_entry.py
│   └── test_compute_pph_final.py
└── web/                      # Next.js console (see web/README.md)
    └── src/
```

## Environment variables

See `.env.example`. All values are placeholders; secrets are never committed.

| Variable | Purpose |
| --- | --- |
| `GOOGLE_CLOUD_PROJECT` | GCP project (`nata-hackathon`) |
| `GOOGLE_CLOUD_LOCATION` | Vertex AI endpoint for Gemini. Gemini is served **only** on `global` for this project (`asia-southeast2` returns `400 FAILED_PRECONDITION`). Use `asia-southeast2` for regional services (Cloud Run, Firestore). |
| `GOOGLE_GENAI_USE_ENTERPRISE` | Route Gemini through Google Cloud / Vertex AI (ADK 2.x name for the old `GOOGLE_GENAI_USE_VERTEXAI`) |
| `NATA_MODEL` *(optional)* | Gemini model id; default `gemini-3.8-flash` (e.g. `gemini-4-argon` for deeper reasoning) |

## Roadmap

Slice A and Slice B are done and verified. Next: **Agent Regulasi** (KBLI 2020
classification, OSS-RBA licensing) and a production deploy to Cloud Run /
Firebase, staying live through the judging window (19 Oct – 6 Nov).

## Contributing

This repository uses a lite git flow — `main` for releases, `develop` for
integration, and short-lived `feature/*` / `fix/*` / `hotfix/*` branches.
The full workflow, commit-message convention, and pre-commit checks are in
[AGENTS.md](./AGENTS.md).

```bash
uv run pytest                        # Python: agent + tax engine
git switch develop && git switch -c feature/<slice>
```
