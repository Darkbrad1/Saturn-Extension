#!/usr/bin/env bash
# Build, patch and package everything into an installable .vsix.
#
#   ./package.sh path/to/sonover-code-0.1.1.vsix [output.vsix]
#
# Builds both bundles, unpacks the original .vsix to a temp folder, applies
# patch.py, runs the host tests against the patched extension, and zips the
# result (default: dist/sonover-code-<version>.vsix, version = newest entry in
# src/changelog.ts). Install it with "Extensions: Install from VSIX…" or
#   code --install-extension <file> --force
set -euo pipefail

here="$(cd "$(dirname "$0")" && pwd)"
cd "$here"

if [ $# -lt 1 ] || [ ! -f "$1" ]; then
  echo "usage: ./package.sh path/to/sonover-code-0.1.1.vsix [output.vsix]" >&2
  exit 2
fi
src_vsix="$(cd "$(dirname "$1")" && pwd)/$(basename "$1")"

for tool in node python3 zip unzip; do
  command -v "$tool" >/dev/null || { echo "package.sh: $tool is needed but not installed" >&2; exit 2; }
done

version="$(sed -n 's/^ *version: "\([0-9][^"]*\)".*/\1/p' src/changelog.ts | head -1)"
[ -n "$version" ] || { echo "package.sh: no version found in src/changelog.ts" >&2; exit 1; }
out="${2:-dist/sonover-code-$version.vsix}"
mkdir -p "$(dirname "$out")"
out="$(cd "$(dirname "$out")" && pwd)/$(basename "$out")"

echo "==> sonover-code $version"

[ -d node_modules ] || { echo "==> npm install"; npm install --no-audit --no-fund; }

echo "==> build"
node build.mjs --min

echo "==> typecheck"
npx --no-install tsc --noEmit --jsx react-jsx --strict --module esnext --moduleResolution bundler \
  --target es2020 --skipLibCheck src/env.d.ts src/main.tsx src-logs/main.tsx

work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT

echo "==> unpack $(basename "$src_vsix")"
unzip -q "$src_vsix" -d "$work/vsix"
[ -f "$work/vsix/extension/dist/extension.js" ] || { echo "package.sh: that doesn't look like the sonover-code .vsix" >&2; exit 1; }

echo "==> patch"
python3 -I patch.py "$work/vsix" dist/nodeview.js "$version"

echo "==> host tests"
ext="$work/vsix/extension/dist/extension.js"
failed=0
for t in hosttest.cjs hosttest-move.cjs hosttest-reorder.cjs hosttest-command.cjs hosttest-field.cjs hosttest-bulk.cjs hosttest-logs.cjs hosttest-wflogs.cjs hosttest-wflogs-real.cjs; do
  if [ "$t" = hosttest-wflogs.cjs ]; then arg=syslogs-host.js; else arg="$ext"; fi
  if ! log="$(node "$t" "$arg" 2>&1)" || grep -q '^FAIL' <<<"$log"; then
    echo "   $t: FAILED"
    grep -E '^FAIL|Error' <<<"$log" | head -20 | sed 's/^/     /'
    failed=1
  else
    echo "   $t: ok ($(grep -c '^PASS' <<<"$log" || true) checks)"
  fi
done
[ "$failed" = 0 ] || { echo "package.sh: host tests failed; no .vsix written" >&2; exit 1; }

echo "==> package"
rm -f "$out"
(cd "$work/vsix" && zip -qrX "$out" . -x '*.DS_Store')

echo
echo "Done: $out"
echo "Install: code --install-extension \"$out\" --force   (or Extensions view > ... > Install from VSIX...)"
