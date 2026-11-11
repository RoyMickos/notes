#!/bin/bash

# Repo wrapper for scripts/screen.ts: runs from any folder, with the vault's
# profile and tags. Options given on the command line come later and override
# these defaults. --out is required: the folder also holds the batch state, so
# a resumed run must use the same one.
SKILL_DIR=$(cd "$(dirname "$0")" && pwd)
ROOT=$(cd "$SKILL_DIR/../../.." && pwd)

case " $* " in
  *" --out "* | *" --out="*) ;;
  *) echo 'Give --out "raw/video/<entry name>", for example --out "raw/video/'"$(date +%F)"' videos"' >&2; exit 1 ;;
esac

# 1Password keys (authenticated via desktop app)
export ANTHROPIC_API_KEY=$(op read "op://Employee/reaktor claude academy/credential")

exec node "$SKILL_DIR/scripts/screen.ts" \
  --profile "$ROOT/_profile.md" \
  --tags "$ROOT/_tags.md" \
  "$@"
