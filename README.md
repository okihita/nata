# Nata — Slice A

**Receipt photo → SAK EMKM double-entry journal entry.**

Nata is an autonomous back-office & compliance engine for Indonesian SMBs,
built for the **Google Cloud AI Builder Cup 2026**. Slice A is the first
vertical: an agent ("Agent Keuangan") reads a receipt image and proposes a
balanced double-entry journal entry under **SAK EMKM** (the Indonesian
financial-accounting standard for micro, small & medium entities).

This is a Python [ADK](https://google.github.io/adk-docs/) project. Gemini
multimodal parses the receipt; a deterministic Python tool enforces the
accounting identity `Assets = Liabilities + Equity`.

## Architecture (Slice A)

```
receipt image ──▶ Agent Keuangan (LlmAgent, Gemini multimodal)
                        │  proposes journal lines
                        ▼
              commit_journal_entry(description, lines[])
                        │  HARD GUARDRAIL (deterministic):
                        │   • debit total == credit total
                        │   • ≥2 lines, each debit XOR credit
                        ▼
                  accepted ledger entry  |  clear error
```

**The model proposes, the code enforces.** `commit_journal_entry` never trusts
the LLM: it re-validates the posting and raises on any violation.

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
uv run adk web          # open http://localhost:8000, pick "nata_agent"
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
│   └── test_commit_journal_entry.py
└── web/                      # Next.js operator console (see web/README.md)
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

Slice A is step 1. Next: **Slice B** — Agent Keuangan hands off to *Agent
Fiskal*, which computes `PPh Final 0.5%` with a Pasal citation.
