# Deploy state — what is live vs what is local

Recorded 2026-10-17. This exists because **the deployed backend and the local
code are not the same thing**, and nothing in the repo said so.

## The gap

| | Local (`develop` / `main`) | Deployed (`nata-agent` on Cloud Run) |
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

---

## How the console deploys

Different mechanism from the agent, deliberately.

| | Console (`web/`) | Agent (`nata_agent/`) |
| --- | --- | --- |
| Trigger | push to `main` | manual `adk deploy cloud_run` |
| Builder | Cloud Build, `cloudbuild.yaml` | ADK CLI |
| Machine | `E2_HIGHCPU_8` (8 vCPUs, ~1m deploy, ~$0.016/min, ~Rp 250/build) | ADK local packager |
| Cache | Docker BuildKit inline registry cache (`--cache-from`) | N/A |

**The trigger watches `main`, not `develop`.** `develop` is the integration trunk
and deploys nothing; only a release reaches production. That is what makes
"what is live?" answerable: the deployed image tag is the `main` commit SHA.

Check what is live:

```bash
gcloud run services describe nata-web --region=asia-southeast2 \
  --format="value(spec.template.spec.containers[0].image)"
```

The trailing `:tag` is the commit — compare it with `git rev-parse --short main`.

Roll back one deploy:

```bash
gcloud run services update-traffic nata-web --region=asia-southeast2 \
  --to-revisions=<previous-revision>=100
```

Build history (the "did it fail?" surface):

```bash
gcloud builds list --limit=5 \
  --format="table(id.slice(0,8),status,duration,substitutions.TRIGGER_NAME)"
```

---

## Architectural Decision Records (ADR)

### ADR 1 — Build Acceleration & Pipeline Optimization (2026-10-18)

* **Context**: Next.js compilation, Turbopack, and Docker container packaging on `E2_STANDARD_2` (2 vCPUs) took 3m 48s from push to live.
* **Decision**:
  1. **Hardware**: Upgrade machine type to `E2_HIGHCPU_8` in `cloudbuild.yaml`. At ~$0.016/min, an 8-vCPU build takes ~1 minute and costs ~Rp 250 - Rp 350 per release.
  2. **Layer Caching**: Enable `DOCKER_BUILDKIT=1` and `--build-arg=BUILDKIT_INLINE_CACHE=1`, pre-pulling `:latest` to cache the `RUN pnpm install` stage across builds.
  3. **Compiler Pass Pruning**: Set `typescript.ignoreBuildErrors: true` in `web/next.config.ts`. Full type checks (`tsc --noEmit`) and linter checks (`eslint`) are strictly enforced locally prior to git commit, rendering re-checking inside the ephemeral Docker builder redundant.
* **Result**: Projected build-to-live latency reduced from 3m 48s to ~55s - 1m 10s.

### ADR 2 — Firebase Hosting Reverse Proxy Edge Cache Invalidation (2026-10-18)

* **Context**: `https://gonata.web.app` acts as a global CDN front door forwarding to Cloud Run `nata-web` via `firebase.json` rewrites. Because Next.js emitted an aggressive `s-maxage=31536000` header on static pages, the root landing page (`GET /`) remained cached at edge CDN nodes even after Cloud Run deployed a new release.
* **Decision**:
  1. Explicitly configure Cache-Control in `firebase.json` headers for the root route:
     ```json
     "headers": [
       {
         "source": "/",
         "headers": [
           {
             "key": "Cache-Control",
             "value": "public, max-age=0, must-revalidate"
           }
         ]
       }
     ]
     ```
  2. Deploy hosting configuration (`npx firebase-tools deploy --only hosting`) to immediately invalidate edge node caches on release.
* **Result**: `https://gonata.web.app/` directly reflects newly deployed Cloud Run revisions without stale edge HTML caching.
