# CLAUDE.md

Guidance for working in this repo. **Keep this file current:** whenever a change adds, removes or renames a file, a host message, a patch in `patch.py`, a build/test step or a convention described here, update this file in the same commit.

## What this is

A patch kit for the **sonover-code** VS Code extension (Saturn / Sonover platform, original build **0.1.1**). It is not a standalone extension: it builds two webview bundles and patches them, plus host-side changes, into an *unpacked copy of the original `.vsix`*. Current version: **0.3.6** (see `README.md` and `src/changelog.ts`).

It adds:
- **Node view** (`src/`) — a Blender-style node editor (React 19 + `@xyflow/react`) layered onto the existing Workflows webview. It runs in the same webview as the original (minified, not in this repo) list-view bundle and does everything the list view does. It opens first; "List view" is one click away.
- **System Logs** (`src-logs/` + `syslogs-host.js`) — a separate, read-only webview panel listing the System Logs core resource's records.
- **Logs tab** (`src/logs.tsx`) — a side-panel tab in the node view showing the System Logs records about the open workflow (or action / step). Read-only; served by the same `syslogs-host.js` module.

## Branches

- **`dev`** is the working branch: all new work is committed and pushed to `dev`.
- **`main`** is the stable branch; changes reach it from `dev` (e.g. by a pull request) when the owner decides.

## Layout

| Path | Role |
|---|---|
| `build.mjs` | esbuild: `src/main.tsx` → `dist/nodeview.js`, `src-logs/main.tsx` → `dist/logs.js` (IIFE, es2020, CSS imported as text). `--min` minifies. |
| `package.sh` | One step from the original `.vsix` to an installable one: `./package.sh <sonover-code-0.1.1.vsix> [out.vsix]` → build, typecheck, unpack, `patch.py`, all host tests, zip (default `dist/sonover-code-<version>.vsix`; version = newest `src/changelog.ts` entry). Writes nothing if a patch or test fails. |
| `patch.py` | Applies everything to an unpacked vsix. Every edit uses `replace_once` (must match exactly once, else fails loudly). |
| `syslogs-host.js` | Host side of System Logs (`SysLogs$`); `patch.py` appends it to `extension/dist/extension.js` so it shares the minified bundle's scope. `open()` = the System Logs panel; `fromWorkflows()` = answers the Logs tab's messages from the Workflows panel; `attach()` receives the instance manager / globalState / extensionUri at command registration; `targetOf()` finds a Workflows panel's instance by shape (no minified field names). |
| `src/bridge.ts` | **Must be imported first.** Takes the single `acquireVsCodeApi()` handle and hands a wrapped copy to the list-view bundle; tracks the open workflow; stores node-view state under key `__sonoverNodeView`. Exposes `send`, `onSelectionChange`, `loadNodeViewState`, `saveNodeViewState`. |
| `src/main.tsx` | Injects CSS, mounts `<App/>` into `#sonover-node-view`. |
| `src/App.tsx` | Main component: host message handling (`workflow`, `workflows`, `operators`, `draftState`, `editSaved`, `editFailed`, …), selection/multi-select, keyboard shortcuts, canvas, Add menu, workflow picker. |
| `src/layout.ts` | Flow → nodes/edges layout. `LayoutDir` `"v"` (default, top-to-bottom) or `"h"`. Node ids encode paths (`h:`/`j:` + `pathKey`). |
| `src/nodes.tsx` | React Flow node/edge renderers (`nv`, `reroute`, `frame`, `slot`, `wire`). |
| `src/panel.tsx` | Side panel: Design / Inspect / Logs / Changes tabs, multi-select panel (`BulkOps`), resize handle. |
| `src/logs.tsx` | Logs tab (`LogsTab`): requests windows of 200 newest records (`fetchWorkflowLogs`), keeps the ones about the workflow, auto-reads older until 25 match or 1,000 more were read; scope chips (workflow / action / step), level chips, search, Live (10 s), JSON detail, Go to action, Open in System Logs. |
| `src/settings.tsx` | Stage / action / command / workflow panels: names, colours, access rules, form fields, triggers, resource hooks. |
| `src/forms.tsx` | Parameter editors (`fieldsFor`, `FieldControl`, `StepForm`, `PanelEditor`), lookups, key/value editor (`KeyValueEditor`: an empty map is `{}` and still shows its inputs; clearing it sends `{}`, never `""`, which the host skips), delay. |
| `src/fieldmore.tsx` | "Every form-field setting" editor; emits `FieldChange[]` → `setFormFieldProps`. |
| `src/controls.tsx` | Prism-highlighted inputs (`HighlightInput`), Figma-style `Scrub`, date/time pickers, colour picker, detection helpers (`dateModeOf`, `isColorParam`, `scrubOf`). |
| `src/outliner.tsx` | Layers panel (stages/actions/commands, create/rename/reorder) and search results view. |
| `src/search.ts` | Workflow search (names and steps, e.g. by operator). |
| `src/types.ts` | Shapes of the host's view model (`WorkflowView`, `Flow` union, `Catalog`, …). |
| `src/changelog.ts` | Release notes shown in the Changes tab — add an entry for each release. |
| `src/prism-setup.ts` | Sets `window.Prism = {manual: true}` before prismjs loads. |
| `src-logs/main.tsx`, `logs.css` | System Logs webview UI. Accepts `search` in `init` or as a `search` message. |
| `src-logs/records.ts` | Pure record helpers shared by the System Logs screen and the Logs tab: `shape` (date/level/message keys), `ascending`, `rel`/`abs`, `levelClass`, and workflow matching (`target`, `mentions`, `WORKFLOW_KEYS` / `ACTION_KEYS` / `STEP_KEYS`). |
| `harness/` | Browser test harness: `mockhost.js` (mock of the extension host for the Workflows webview — like the real host, an empty object param keeps the stored value — incl. 450 System Logs records for the Logs tab, `__addSysLog`, `__logsFail`), `logsmock.js`, `csp.html` / `logs.html` / `sidebar.html` (pages with the webview's CSP), `wf-stub.js` (stand-in for the list-view bundle when the .vsix isn't available). |
| `test*.mjs`, `test-csp.mjs` | Playwright checks (print `PASS`/`FAIL` lines). `test10.mjs` = 0.3.4 System Logs; `test11.mjs` = 0.3.5 Logs tab; `test12.mjs` = 0.3.6 property map editor (both read `SHOTS` / `CHROME` env vars). |
| `hosttest*.cjs` | Node scripts that load the **patched** `extension.js` (with `vscode` stubbed) and exercise its internal functions. Exception: `hosttest-wflogs.cjs` runs `syslogs-host.js` alone with stubbed helpers — no .vsix needed. |

## How the host is patched (`patch.py`)

The host code is minified, so patches refer to minified names (`Ke`, `yr`, `N`, `ue`, `on`, `Rr`, `Sc`, `Ln`, `dn`, `xc`, …). New helpers use a `$` suffix (`yr$base`, `on$after`, `ff$set`, `bk$cmp`, `SysLogs$`, `SL$`) to avoid clashing with minified names. Changes:
1. `getHtml`: load `dist/webview/nodeview/index.js` before the Workflows bundle (same nonce).
2. View model carries a step's `mock` flag (Saturn's "disabled").
3. `setStepMock` message `{workflowId, path, mock}`.
4. Fix for moving a step into a later container in the same list (`on$after`).
5. Form-field view model carries the stored field as `raw`.
6. `setFormFieldProps` `{ownerPath, formKey, key, changes:[{path, value?, remove?}]}` — refuses `key`/`label`/`type` and prototype paths.
7. `bulkSteps` `{op: "delete"|"duplicate"|"mock", paths, mock?}` as ONE draft edit (last path first), and `copyNodes` `{paths}`.
8. System Logs command `saturn.openSystemLogs` (its registration also calls `SysLogs$.attach({manager, globalState, extensionUri})`), sidebar message `saturn:openSystemLogs`, and the appended `syslogs-host.js`.
9–11. List view: disabled-card style, Disabled badge + Enable/Disable button, `sonover:openWorkflow` window event so the node view switches workflows through the list view.
12. Workflows panel messages for the Logs tab, all → `SysLogs$.fromWorkflows(this, t, type, e.payload)`: `fetchWorkflowLogs {reqId, workflowId, offset, window}` → `workflowLogs {reqId, workflowId, resource, instanceName, records (newest first), total, scanned, done}` or `workflowLogsFailed {reqId, message}`; `openSystemLogs {search?}`; `openLogJson` / `copyLogJson {record}`. (Numbered 12 but placed after 8 in the file, in the host section.)
Plus: copies the two bundles into `extension/dist/webview/{nodeview,logs}/index.js`, edits `extension/package.json` (command, context menu, `saturn.systemLogResource` setting), bumps the version from `0.1.1` in `package.json` and `extension.vsixmanifest`, and extends `extension/readme.md`.

When adding a host change: add a numbered `replace_once` block with a comment, add a `hosttest-*.cjs` that runs the patched function, and mirror the behaviour in `harness/mockhost.js` so the browser tests cover it.

## Build and test

To produce an installable package, use `./package.sh path/to/sonover-code-0.1.1.vsix`, then install the result with `code --install-extension dist/sonover-code-<version>.vsix --force` (or Extensions view → ⋯ → Install from VSIX…). The steps it runs:

```sh
npm install
node build.mjs --min                                   # -> dist/nodeview.js, dist/logs.js
npx tsc --noEmit --jsx react-jsx --strict --module esnext --moduleResolution bundler \
  --target es2020 --skipLibCheck src/env.d.ts src/main.tsx src-logs/main.tsx   # typecheck (no tsconfig)
python3 -I patch.py <unpacked-0.1.1-vsix> dist/nodeview.js 0.3.6
node hosttest.cjs <unpacked>/extension/dist/extension.js   # likewise hosttest-move/-reorder/-command/-field/-bulk/-logs
node hosttest-wflogs.cjs                                    # Logs tab host side; no .vsix needed
```

Caveats:
- The original `.vsix` is **not in the repo**; `patch.py` and the `hosttest*` scripts (except `hosttest-wflogs.cjs`) need it. Without it only the build, typecheck, `hosttest-wflogs.cjs` and the harness can be used.
- The Playwright tests expect a static server on `http://localhost:8765` serving `harness/` plus `nodeview.js`, `logs.js` (from `dist/`) and the original list-view bundle as `wf.js` / `wf.css` (from the vsix). `test.mjs` also expects an `index.html` that isn't in the repo. Without the vsix: copy `harness/*` and `dist/*.js` into a folder, copy `harness/wf-stub.js` there as `wf.js`, add an empty `wf.css`, and run `python3 -m http.server 8765` in it. That is enough for `test11.mjs`, `test12.mjs` and the logs part of `test10.mjs`; older tests (and test10's sidebar part, which needs `sidebar.js`) need the real bundles.
- Tests hard-code a screenshot directory (`out = "/tmp/claude-0/-home-claude/.../shots"`) and `executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"`; adjust locally if they differ.
- `npm test` is a placeholder; there is no test runner — run the scripts directly and look for `FAIL`.
- `dist/` and `node_modules/` are build output and are git-ignored (`.gitignore`); don't commit them.

## Conventions

- The webview runs under a strict CSP (`default-src 'none'; script-src 'nonce-…'; style-src 'self' 'unsafe-inline'`): styles may be inline, but scripts need the nonce — no `eval`, no external loads. `test-csp.mjs` checks this.
- Every edit goes through the host's draft (`applyEdit`) so undo / Save / Discard and the list view stay in sync; multi-step operations must be a single draft edit.
- The node view never calls `acquireVsCodeApi()` itself — use `send()` from `bridge.ts`. Don't write to the list view's saved state keys.
- System Logs and the Logs tab are read-only: host side only uses the record-reading helpers (GET requests). Keep it that way.
- The real System Logs record schema is unknown, so log handling is shape-based (key names like `workflow*`, `action`, `operator`, date/level/message key guessing). Don't hard-code one schema.
- Release checklist: the newest `src/changelog.ts` entry sets the packaged version (`package.sh` reads it); bump the version in the README's `patch.py` command line, add a `README.md` "New in x.y.z" section, add a `CHANGELOG` entry in `src/changelog.ts`, add a `testN.mjs` for the release, and update this file.
- UI copy: plain, short, sentence case; British spelling is used in places ("colour").
