# Nata — repository guide

Working notes for anyone (human or agent) changing this repo.

## Product Narrative & Design Philosophy

> **Core Mantra:** *"Runs your business admin while you sleep."*  
> **Rule of Thumb:** **Sell convenience first, compliance second.**

1. **Speak human, not bureaucrat:** Indonesian business owners (warung, kafe, retail toko) are exhausted. Never present raw statutory jargon (e.g. "SAK EMKM Bab 2", "PPh Final PP 55") without framing its direct everyday benefit first (e.g. "Laporan siap print buat modal bank", "Pajak 0,5% tanpa denda").
2. **Canva-like simplicity:** The UI must feel approachable and playful, not like enterprise SAP/Photoshop. Buttons, cards, and workflows prioritize fast single-click action and progressive disclosure.
3. **The 4-Bot Staff framing:** Nata operates as a 4-person autonomous back-office staff:
   - 🤖 **Akuntan Pribadi (`Agent Keuangan`)**: Keeps debit-credit balanced down to the rupiah.
   - 🏛️ **Konsultan Pajak (`Agent Fiskal`)**: Shields the Rp 500M exemption and handles 0.5% PPh Final.
   - 🛡️ **Spesialis Legal (`Agent Regulasi`)**: Resolves official KBLI 2020 codes and guides NIB legality.
   - ✨ **Manajer Keuangan Digital (`Orchestrator`)**: Coordinates all agent handoffs automatically.
4. **Deterministic guardrails under the hood:** While the UI is warm, casual, and friendly, the underlying code strictly enforces the accounting equation `Assets = Liabilities + Equity` and exact legal citations. The AI proposes; deterministic Python code verifies and commits.

## Branching model — git flow (lite)

This repository uses a trimmed git flow: two long-lived branches and short-lived
topic branches. There is no `git-flow` CLI dependency; the model is enforced by
convention and the rules below.

```
main      ──●────────────────●──────────▶  production-ready. Every commit is releasable.
             ╲              ╱
develop   ────●────●──────●─────────────▶  integration. All work lands here first.
                 ╲    ╱
feature/*         ●──●                      one slice / one concern
```

| Branch | Branched from | Merges into | Purpose |
| --- | --- | --- | --- |
| `main` | — | — | Release history. Tags live here. Never commit directly. |
| `develop` | `main` | `main` (release) | Integration trunk. Default working branch. |
| `feature/<slice>` | `develop` | `develop` | A new vertical slice (e.g. `feature/slice-b-agent-fiskal`). |
| `fix/<issue>` | `develop` | `develop` | A bug fix that is not production-urgent. |
| `hotfix/<issue>` | `main` | `main` **and** `develop` | Production-urgent. Only code that already exists on `main` can be carried here. |
| `release/<version>` | `develop` | `main` + `develop` | Optional: stabilise before a tag. |

### Working on a change

```bash
git switch develop && git pull
git switch -c feature/<slice>        # or fix/<issue>, hotfix/<issue>
# ... work ...
uv run pytest && (cd web && pnpm exec tsc --noEmit && pnpm build)
git commit
git switch develop && git merge --no-ff feature/<slice>
git branch -d feature/<slice>
```

`--no-ff` keeps the topic branch's shape in history, so a merged slice reads as
one unit rather than a flat run of commits.

### Releasing

```bash
git switch -c release/<version> develop
# Bump versions in pyproject.toml and web/package.json
uv lock                                         # sync uv.lock whenever pyproject.toml changes
(cd web && pnpm install)                        # sync pnpm-lock.yaml if deps change
git commit -am "chore(release): bump version to <version>"
git switch develop && git merge --no-ff release/<version>
git switch main && git merge --no-ff release/<version>
git tag -a v<version> -m "Nata v<version>"
git switch develop && git merge --no-ff main    # back-merge so develop has the tag
git branch -d release/<version>
```

### Choosing the base branch — the rule that actually bites

A `hotfix/` branches off `main`, so it can only carry code that **already exists
on `main`**. If the broken code lives only on `develop`, a hotfix off `main`
cannot fix it. Check before branching:

```bash
git ls-tree --name-only main
```

If the code is not on `main`, use `fix/<issue>` off `develop` instead.

## Commit messages

Conventional Commits: `<type>(<scope>): <summary>`, imperative mood, summary
under ~72 characters.

| Type | Use for |
| --- | --- |
| `feat` | A new user-visible capability |
| `fix` | A bug fix |
| `docs` | Documentation only |
| `test` | Tests only |
| `refactor` | Behaviour-preserving change |
| `chore` | Tooling, deps, housekeeping |

Scope examples in this repo: `slice-b`, `web`, `agent`, `ci`.

The body explains **why**, not what — the diff already shows what. State the
evidence for a behavioural claim (test counts, a live run, a measured figure).

## Before every commit

```bash
uv run pytest                              # Python: agent + tax engine
cd web && pnpm test                        # web: entity/trace logic
cd web && pnpm exec tsc --noEmit           # types
cd web && pnpm build                       # production build must pass
cd web && pnpm lint                        # must be clean
```

A change is not done without evidence: a passing test, a clean build, or a named
blocker.

## Never commit

`.env` / `.env.*` (except `.env.example`), credentials, `.venv/`, `node_modules/`,
`.next/`, `.adk/`, `.scratch/`. The root `.gitignore` already covers these — if
`git status` ever shows one, stop and fix the ignore rule rather than committing.

## Guardrails

- **Never** commit, push, or deploy without explicit human approval.
- Never commit secrets. Auth is ADC (`gcloud auth application-default login`).
- Deploy targets are Cloud Run / Firebase only (competition rule).
- Grounding for statute text is **in-repo, in-context**. Do not wire Vertex AI
  Search / Discovery Engine / any managed RAG index.
- **The console deploys from `main` only.** The Cloud Build trigger watches
  `^main$`; `develop` is integration and deploys nothing. The deployed image tag
  is the `main` commit SHA, which is what makes "what is live?" answerable.
  See `docs/deploy-state.md`.
- The agent (`nata_agent/`) deploys separately and manually — it changes rarely,
  and a UI typo should not be able to take the backend down.
