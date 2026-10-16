# Deploy state — what is live vs what is local

Recorded 2026-10-17. This exists because **the deployed backend and the local
code are not the same thing**, and nothing in the repo said so.

## The gap

| | Local (`feat/agent-regulasi`) | Deployed (`nata-agent` on Cloud Run) |
| --- | --- | --- |
| ADK apps served | `nata_agent`, `nata_regulasi` | **only `nata_agent`** |
| Agents | Keuangan → Fiskal → **Regulasi** | Keuangan → Fiskal |
| Tax tool args | `entity` (orang pribadi / PT Perorangan / PT-CV) | **`taxpayer`** (old coarse flag) |
| KBLI catalogue | shipped (1,790 codes + hierarchy) | **absent** |
| Entity profiles | 3 forms, tax differs per form | binary individual/badan |

Verified by probing the live service: `/list-apps` returns `["nata_agent"]`, and
a live turn passes `{"taxpayer", "turnover"}` to `compute_pph_final` rather than
`entity`.

**This is expected** — deploying requires explicit human approval, and none has
been given. It is recorded rather than left implicit because it has two concrete
consequences.

## Consequence 1 — a local console points at the stale backend

`web/.env.local` sets:

```
ADK_SERVER_URL=https://nata-agent-615744448396.asia-southeast2.run.app
```

So `pnpm dev` renders the **new** UI against the **old** backend. Symptoms:

- **Perizinan** cannot work: it requests app `nata_regulasi`, which the deployed
  service does not serve, so session creation fails and the screen reports the
  service as busy/unreachable.
- **Pajak** and onboarding still work, but a PT Perorangan gets the individual's
  Rp 500 million band, because the deployed tool only knows `taxpayer`.

To exercise the new features locally, point at a local backend instead:

```bash
# terminal 1
uv run adk api_server --port 48700
# terminal 2 — web/.env.local:  ADK_SERVER_URL=http://127.0.0.1:48700
cd web && pnpm dev
```

## Consequence 2 — judging needs a redeploy

The submission rule is that the URL judges click must be live on Cloud Run or
Firebase. As of this note the live deployment does **not** contain the Regulasi
agent, the entity model, or the KBLI catalogue — so anything demoed from the
deployed URL would show the older two-agent behaviour.

A redeploy is a single command (see `README.md`), but it is **gated on explicit
approval** per `AGENTS.md`:

```
adk deploy cloud_run --project=nata-hackathon --region=asia-southeast2 \
  --service_name=nata-agent --with_ui \
  --env GOOGLE_CLOUD_LOCATION=global \
  --env GOOGLE_GENAI_USE_ENTERPRISE=TRUE \
  nata_agent -- --allow-unauthenticated --min-instances=1 --max-instances=1
```

Two things to check after a redeploy:

1. `/list-apps` should return **`["nata_agent","nata_regulasi"]`**.
2. A live turn should pass **`entity`** (not just `taxpayer`) to
   `compute_pph_final`.

## Why this is written down

The failure mode is silent: the app looks correct, the UI is current, and only
the *numbers* are wrong-ish (an exemption applied to a PT Perorangan). Naming the
mismatch is cheaper than re-deriving it during a demo.
