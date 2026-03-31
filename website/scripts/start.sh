#!/bin/sh
set -e

STANDALONE_DIR=".next/standalone/website"

if [ ! -d "$STANDALONE_DIR" ]; then
  echo "Error: standalone build not found. Run 'pnpm build' first."
  exit 1
fi

[ -d "$STANDALONE_DIR/public" ] || cp -r public "$STANDALONE_DIR/public"
[ -d "$STANDALONE_DIR/.next/static" ] || cp -r .next/static "$STANDALONE_DIR/.next/static"

exec node "$STANDALONE_DIR/server.js"
