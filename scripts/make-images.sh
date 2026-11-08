#!/usr/bin/env bash
# Regenerate public/og.png (1200x630) and public/apple-touch-icon.png (180x180) from the HTML
# sources in scripts/ with the installed Google Chrome. Run after changing the logo or the title.
set -euo pipefail
cd "$(dirname "$0")/.."
CHROME=${CHROME:-"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"}
"$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
  --window-size=1200,630 --screenshot="$PWD/public/og.png" "file://$PWD/scripts/og.html"
"$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
  --window-size=180,180 --screenshot="$PWD/public/apple-touch-icon.png" "file://$PWD/scripts/icon.html"
"$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
  --window-size=32,32 --screenshot="$PWD/public/favicon-32.png" "file://$PWD/scripts/icon32.html"
