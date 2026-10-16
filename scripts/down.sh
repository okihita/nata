#!/usr/bin/env bash
#
# Stop any process listening on the given TCP ports (default: the Nata
# namespace 48700 48701 48702). Safe to run when nothing is listening.
#
# Called by `make down`.
set -euo pipefail

ports=("$@")
if [ ${#ports[@]} -eq 0 ]; then
	ports=(48700 48701 48702)
fi

found=0
for port in "${ports[@]}"; do
	pids=$(lsof -nP -tiTCP:"$port" -sTCP:LISTEN 2>/dev/null || true)
	if [ -n "$pids" ]; then
		found=1
		printf 'port %s: stopping pid(s) %s\n' "$port" "${pids//$'\n'/ }"
		# shellcheck disable=SC2086
		kill $pids 2>/dev/null || true
	else
		printf 'port %s: free\n' "$port"
	fi
done

if [ "$found" -eq 0 ]; then
	printf 'nothing to stop.\n'
fi
