# Nata — developer task runner.
#
# Everything runs from the repo root. Ports live in the reserved 4870x block
# (see README); override any of them on the command line:
#
#   make dev WEB_PORT=49001
#   make agent API_PORT=49000

API_PORT  ?= 48700
WEB_PORT  ?= 48701
PLAY_PORT ?= 48702

.DEFAULT_GOAL := help

.PHONY: help setup test typecheck build check agent web playground dev down clean web-test lint

help: ## Show this help
	@grep -hE '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
		| awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-11s\033[0m %s\n", $$1, $$2}'

## --- setup ---

setup: ## Install Python deps (uv) and console deps (pnpm)
	uv sync
	cd web && pnpm install

## --- verify ---

test: ## Run the Python test suite
	uv run pytest

typecheck: ## Type-check the Next.js console
	cd web && pnpm exec tsc --noEmit

web-test: ## Run the web logic tests (entity, trace)
	cd web && pnpm test

lint: ## Lint the Next.js console
	cd web && pnpm lint

build: ## Production build of the Next.js console
	cd web && pnpm build

check: test typecheck build web-test lint ## All pre-commit checks (AGENTS.md)

## --- run (one service per terminal) ---

agent: ## Start the ADK backend the console proxies to (:48700)
	uv run adk api_server --port $(API_PORT)

web: ## Start the Next.js console (:48701)
	cd web && pnpm dev --port $(WEB_PORT)

playground: ## Start the adk web dev playground (:48702)
	uv run adk web --port $(PLAY_PORT)

## --- run (everything at once) ---

dev: ## Start backend + console together; Ctrl-C stops both
	API_PORT=$(API_PORT) WEB_PORT=$(WEB_PORT) ./scripts/dev.sh

down: ## Stop whatever is listening on the Nata ports
	./scripts/down.sh $(API_PORT) $(WEB_PORT) $(PLAY_PORT)

## --- housekeeping ---

clean: ## Remove build artefacts and local logs
	rm -rf web/.next .scratch
	find . -name __pycache__ -type d -prune -exec rm -rf {} +
