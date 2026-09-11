#!/usr/bin/env bash
# SAFE Vercel wrapper — never opens a browser window (2026-09-11).
#
# WHY THIS EXISTS: the `vercel` CLI opens the user's DEFAULT BROWSER to authenticate
# whenever it runs WITHOUT a token. A bare `npx vercel inspect ...` during verification
# popped a Firefox window on Jonathan's desktop ("authorize app") while he was working.
# He asked for it to stop.
#
# Two rules, both learned the hard way:
#   1. ALWAYS supply the token, so the CLI never has a reason to reach for a browser.
#   2. Supply it via the ENVIRONMENT, never as `--token` on the command line. An argv
#      token ends up in process listings and in npm's own "npm notice run ..." echo —
#      which is how this token leaked into a log once already.
#
# CI=1 keeps the CLI non-interactive: it errors out instead of prompting or opening a browser.
set -euo pipefail

TOKEN_FILE="$HOME/.vercel/token.txt"
if [ ! -f "$TOKEN_FILE" ]; then
  echo "vercel_safe: missing $TOKEN_FILE — refusing to run (it would open a browser)" >&2
  exit 2
fi

# Read from the file into the environment. `--token` is deliberately NOT used.
VERCEL_TOKEN="$(tr -d '\r\n' < "$TOKEN_FILE")"
export VERCEL_TOKEN
export VERCEL_ORG_ID="team_R9029s91J0FRbJQP559iHrr2"
export VERCEL_PROJECT_ID="prj_ibFq94nDfFUBpqh3D9vahTyclwAX"
export CI=1

exec npx --yes vercel "$@"
