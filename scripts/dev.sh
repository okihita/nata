#!/usr/bin/env bash
#
# Run the ADK backend and the Next.js console together in one terminal.
#
# Both children log to .scratch/ and are torn down on Ctrl-C, so nothing is
# left holding the Nata ports. Called by `make dev`.
#
# Ports default to the reserved Nata namespace; override via API_PORT / WEB_PORT.
set -euo pipefail

cd "$(dirname "$0")/.."

API_PORT="${API_PORT:-48700}"
WEB_PORT="${WEB_PORT:-48701}"
LOGDIR=".scratch"

mkdir -p "$LOGDIR"

pids=""
add_pid() { pids="$pids $1"; }

cleanup() {
	printf '\nshutting down...\n'
	for pid in $pids; do
		kill "$pid" 2>/dev/null || true
	done
	wait 2>/dev/null || true
	printf 'stopped. logs kept in %s/\n' "$LOGDIR"
}
trap cleanup EXIT INT TERM

uv run adk api_server --port "$API_PORT" >"$LOGDIR/api.log" 2>&1 &
add_pid $!

( cd web && pnpm dev --port "$WEB_PORT" ) >"$LOGDIR/web.log" 2>&1 &
add_pid $!

printf 'backend : http://127.0.0.1:%s   (log: %s/api.log)\n' "$API_PORT" "$LOGDIR"
printf 'console : http://127.0.0.1:%s   (log: %s/web.log)\n' "$WEB_PORT" "$LOGDIR"
printf 'press Ctrl-C to stop both\n\n'

wait
