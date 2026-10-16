# CLAUDE.md

Guidance for working in this repo. **Keep this file current:** whenever a change adds, removes or renames a file, a host message, a patch in `patch.py`, a build/test step or a convention described here, update this file in the same commit.

## What this is

A patch kit for the **sonover-code** VS Code extension (Saturn / Sonover platform, original build **0.1.1**). It is not a standalone extension: it builds two webview bundles and patches them, plus host-side changes, into an *unpacked copy of the original `.vsix`*. Current version: **0.3.4** (see `README.md` and `src/changelog.ts`).

It adds:
- **Node view** (`src/`) — a Blender-style node editor (React 19 + `@xyflow/react`) layered onto the existing Workflows webview. It runs in the same webview as the original (minified, not in this repo) list-view bundle and does everything the list view does. It opens first; "List view" is one click away.
- **System Logs** (`src-logs/` + `syslogs-host.js`) — a separate, read-only webview panel listing the System Logs core resource's records.

## Layout

| Path | Role |
|---|---|
| `build.mjs` | esbuild: `src/main.tsx` → `dist/nodeview.js`, `src-logs/main.tsx` → `dist/logs.js` (IIFE, es2020, CSS imported as text). `--min` minifies. |
| `patch.py` | Applies everything to an unpacked vsix. Every edit uses `replace_once` (must match exactly once, else fails loudly). |
| `syslogs-host.js` | Host-side System Logs panel; `patch.py` appends it to `extension/dist/extension.js` so it shares the minified bundle's scope. |
| `src/bridge.ts` | **Must be imported first.** Takes the single `acquireVsCodeApi()` handle and hands a wrapped copy to the list-view bundle; tracks the open workflow; stores node-view state under key `__sonoverNodeView`. Exposes `send`, `onSelectionChange`, `loadNodeViewState`, `saveNodeViewState`. |
| `src/main.tsx` | Injects CSS, mounts `<App/>` into `#sonover-node-view`. |
| `src/App.tsx` | Main component: host message handling (`workflow`, `workflows`, `operators`, `draftState`, `editSaved`, `editFailed`, …), selection/multi-select, keyboard shortcuts, canvas, Add menu, workflow picker. |
| `src/layout.ts` | Flow → nodes/edges layout. `LayoutDir` `"v"` (default, top-to-bottom) or `"h"`. Node ids encode paths (`h:`/`j:` + `pathKey`). |
| `src/nodes.tsx` | React Flow node/edge renderers (`nv`, `reroute`, `frame`, `slot`, `wire`). |
| `src/panel.tsx` | Side panel: Design / Inspect / Changes tabs, multi-select panel (`BulkOps`), resize handle. |
| `src/settings.tsx` | Stage / action / command / workflow panels: names, colours, access rules, form fields, triggers, resource hooks. |
| `src/forms.tsx` | Parameter editors (`fieldsFor`, `FieldControl`, `StepForm`, `PanelEditor`), lookups, key/value editor, delay. |
| `src/fieldmore.tsx` | "Every form-field setting" editor; emits `FieldChange[]` → `setFormFieldProps`. |
| `src/controls.tsx` | Prism-highlighted inputs (`HighlightInput`), Figma-style `Scrub`, date/time pickers, colour picker, detection helpers (`dateModeOf`, `isColorParam`, `scrubOf`). |
| `src/outliner.tsx` | Layers panel (stages/actions/commands, create/rename/reorder) and search results view. |
| `src/search.ts` | Workflow search (names and steps, e.g. by operator). |
| `src/types.ts` | Shapes of the host's view model (`WorkflowView`, `Flow` union, `Catalog`, …). |
| `src/changelog.ts` | Release notes shown in the Changes tab — add an entry for each release. |
| `src/prism-setup.ts` | Sets `window.Prism = {manual: true}` before prismjs loads. |
| `src-logs/main.tsx`, `logs.css` | System Logs webview UI. |
| `harness/` | Browser test harness: `mockhost.js` (mock of the extension host for the Workflows webview), `logsmock.js`, `csp.html` / `logs.html` / `sidebar.html` (pages with the webview's CSP). |
| `test*.mjs`, `test-csp.mjs` | Playwright checks (print `PASS`/`FAIL` lines). `test10.mjs` = 0.3.4 System Logs. |
| `hosttest*.cjs` | Node scripts that load the **patched** `extension.js` (with `vscode` stubbed) and exercise its internal functions. |

## How the host is patched (`patch.py`)

The host code is minified, so patches refer to minified names (`Ke`, `yr`, `N`, `ue`, `on`, `Rr`, `Sc`, `Ln`, `dn`, `xc`, …). New helpers use a `$` suffix (`yr$base`, `on$after`, `ff$set`, `bk$cmp`, `SysLogs$`, `SL$`) to avoid clashing with minified names. Changes:
1. `getHtml`: load `dist/webview/nodeview/index.js` before the Workflows bundle (same nonce).
2. View model carries a step's `mock` flag (Saturn's "disabled").
3. `setStepMock` message `{workflowId, path, mock}`.
4. Fix for moving a step into a later container in the same list (`on$after`).
5. Form-field view model carries the stored field as `raw`.
6. `setFormFieldProps` `{ownerPath, formKey, key, changes:[{path, value?, remove?}]}` — refuses `key`/`label`/`type` and prototype paths.
7. `bulkSteps` `{op: "delete"|"duplicate"|"mock", paths, mock?}` as ONE draft edit (last path first), and `copyNodes` `{paths}`.
8. System Logs command `saturn.openSystemLogs`, sidebar message `saturn:openSystemLogs`, and the appended `syslogs-host.js`.
9–11. List view: disabled-card style, Disabled badge + Enable/Disable button, `sonover:openWorkflow` window event so the node view switches workflows through the list view.
Plus: copies the two bundles into `extension/dist/webview/{nodeview,logs}/index.js`, edits `extension/package.json` (command, context menu, `saturn.systemLogResource` setting), bumps the version from `0.1.1` in `package.json` and `extension.vsixmanifest`, and extends `extension/readme.md`.

When adding a host change: add a numbered `replace_once` block with a comment, add a `hosttest-*.cjs` that runs the patched function, and mirror the behaviour in `harness/mockhost.js` so the browser tests cover it.

## Build and test

```sh
npm install
node build.mjs --min                                   # -> dist/nodeview.js, dist/logs.js
npx tsc --noEmit --jsx react-jsx --strict --module esnext --moduleResolution bundler \
  --target es2020 --skipLibCheck src/env.d.ts src/main.tsx src-logs/main.tsx   # typecheck (no tsconfig)
python3 -I patch.py <unpacked-0.1.1-vsix> dist/nodeview.js 0.3.4
node hosttest.cjs <unpacked>/extension/dist/extension.js   # likewise hosttest-move/-reorder/-command/-field/-bulk/-logs
```

Caveats:
- The original `.vsix` is **not in the repo**; `patch.py` and the `hosttest*` scripts need it. Without it only the build, typecheck and the harness can be used.
- The Playwright tests expect a static server on `http://localhost:8765` serving `harness/` plus `nodeview.js`, `logs.js` (from `dist/`) and the original list-view bundle as `wf.js` / `wf.css` (from the vsix). `test.mjs` also expects an `index.html` that isn't in the repo.
- Tests hard-code a screenshot directory (`out = "/tmp/claude-0/-home-claude/.../shots"`) and `executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"`; adjust locally if they differ.
- `npm test` is a placeholder; there is no test runner — run the scripts directly and look for `FAIL`.
- `dist/` and `node_modules/` are build output and should not be committed (there is no `.gitignore` yet).

## Conventions

- The webview runs under a strict CSP (`default-src 'none'; script-src 'nonce-…'; style-src 'self' 'unsafe-inline'`): styles may be inline, but scripts need the nonce — no `eval`, no external loads. `test-csp.mjs` checks this.
- Every edit goes through the host's draft (`applyEdit`) so undo / Save / Discard and the list view stay in sync; multi-step operations must be a single draft edit.
- The node view never calls `acquireVsCodeApi()` itself — use `send()` from `bridge.ts`. Don't write to the list view's saved state keys.
- System Logs is read-only: host side only uses the record-reading helpers (GET requests). Keep it that way.
- Release checklist: bump the version in the `patch.py` command line / README, add a `README.md` "New in x.y.z" section, add a `CHANGELOG` entry in `src/changelog.ts`, add a `testN.mjs` for the release, and update this file.
- UI copy: plain, short, sentence case; British spelling is used in places ("colour").
