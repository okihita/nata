# Nata console — deploy image.
#
# Two stages: the first builds, the second only runs. The runtime image carries
# no source and no build tooling, only the self-contained server that
# `output: "standalone"` produces (see web/next.config.ts).

# ── build ───────────────────────────────────────────────────────────────────
FROM node:22-slim AS builder
WORKDIR /app

# pnpm is this repo's package manager; corepack reads the pinned version from
# package.json (`packageManager`).
RUN corepack enable

# Manifests first: this layer is cached, so dependencies are only reinstalled
# when they actually change — not on every source edit.
#
# `pnpm-workspace.yaml` must be here too, not just package.json/lockfile: it
# holds this repo's `minimumReleaseAgeExclude` allow-list. Without it pnpm
# applies its supply-chain release-age policy and refuses four dependencies
# (shadcn, cn, lucide-react, @shadcn/registry).
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

# ── run ────────────────────────────────────────────────────────────────────
FROM node:22-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
# Cloud Run injects PORT (default 8080); the standalone server reads it.
ENV PORT=8080
ENV HOSTNAME=0.0.0.0

# The standalone bundle already contains the pruned node_modules it needs.
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 8080
CMD ["node", "server.js"]
