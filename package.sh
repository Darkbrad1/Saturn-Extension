#!/usr/bin/env bash
# Build, test and package the extension into an installable .vsix.
#
#   ./package.sh [output.vsix]
#
# Builds everything into out/vsix (build.mjs), typechecks, runs the host tests
# against the built extension.js, and zips it (default: dist/sonover-code-<version>.vsix,
# version = newest entry in src/changelog.ts). Install it with
# "Extensions: Install from VSIX…" or
#   code --install-extension <file> --force      (codium for VSCodium)
set -euo pipefail

here="$(cd "$(dirname "$0")" && pwd)"
cd "$here"

for tool in node zip; do
  command -v "$tool" >/dev/null || { echo "package.sh: $tool is needed but not installed" >&2; exit 2; }
done

version="$(sed -n 's/^ *version: "\([0-9][^"]*\)".*/\1/p' src/changelog.ts | head -1)"
[ -n "$version" ] || { echo "package.sh: no version found in src/changelog.ts" >&2; exit 1; }
out="${1:-dist/sonover-code-$version.vsix}"
mkdir -p "$(dirname "$out")"
out="$(cd "$(dirname "$out")" && pwd)/$(basename "$out")"

echo "==> sonover-code $version"

[ -d node_modules ] || { echo "==> npm install"; npm install --no-audit --no-fund; }

echo "==> build"
node build.mjs --min

echo "==> typecheck"
npx --no-install tsc --noEmit --jsx react-jsx --strict --module esnext --moduleResolution bundler \
  --target es2020 --skipLibCheck src/env.d.ts src/main.tsx src-logs/main.tsx

echo "==> host tests"
ext="out/vsix/extension/dist/extension.js"
node --check "$ext"
failed=0
for t in hosttest.cjs hosttest-move.cjs hosttest-reorder.cjs hosttest-command.cjs hosttest-field.cjs hosttest-bulk.cjs hosttest-logs.cjs hosttest-wflogs.cjs hosttest-wflogs-real.cjs hosttest-activate.cjs; do
  if [ "$t" = hosttest-wflogs.cjs ]; then arg=host/syslogs.js; else arg="$ext"; fi
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
(cd out/vsix && zip -qrX "$out" . -x '*.DS_Store')

echo
echo "Done: $out"
echo "Install: codium --install-extension \"$out\" --force   (code for VS Code; or Extensions view > ... > Install from VSIX...)"
