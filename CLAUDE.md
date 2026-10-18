# CLAUDE.md

Guidance for working in this repo. **Keep this file current:** whenever a change adds, removes or renames a file, a host message, a change to the host, a build/test step or a convention described here, update this file in the same commit.

## What this is

The **sonover-code** VS Code extension (Saturn / Sonover platform) — the whole extension, built from this repo. Current version: **0.3.18** (see `README.md` and `src/changelog.ts`).

The original 0.1.1 was built elsewhere and its source was lost. Its extension host was **recovered** into `host/extension.js` (formatted, every name made readable, commented, this project's changes built in) and is maintained here; its other built files (the list view, sidebar, menus, pages, agent chat, tickets and preview webviews, the MCP server, `package.json`, manifest, icon) are kept under `vsix/` with this project's edits applied — the webviews and MCP server formatted, their app code named and commented, their bundled libraries labelled. The owner has Sonover's permission to maintain it; `LICENSE.txt` is Sonover's proprietary licence — keep the repo private.

This project's own parts:
- **Node view** (`src/`) — a Blender-style node editor (React 19 + `@xyflow/react`) on the Workflows screen. It runs in the same webview as the original list-view bundle (`vsix/…/webview/workflows`) and does everything the list view does. It opens by default; "List view" is one click away and is kept.
- **System Logs** (`src-logs/` + `host/syslogs.js`) — a separate, read-only webview panel listing the System Logs core resource's records.
- **Resources** (`src-res/` + `host/resources.js`) — a webview panel: pick a resource; its properties down the left in schema order (drag to reorder), the picked one on the right (required or not); saved with a backup and a read-back check.
- **Logs tab** (`src/logs.tsx`) — a side-panel tab in the node view showing the System Logs records about the open workflow (or action / step). Read-only; served by the same `host/syslogs.js` module.

## Branches

- **`dev`** is the working branch: all new work is committed and pushed to `dev`.
- **`main`** is the stable branch; changes reach it from `dev` (e.g. by a pull request) when the owner decides.

## Layout

| Path | Role |
|---|---|
| `build.mjs` | Builds the whole extension into `out/vsix/` (the unpacked .vsix): esbuild `src/main.tsx` → `dist/nodeview.js`, `src-logs/main.tsx` → `dist/logs.js` and `src-res/main.tsx` → `dist/resources.js` (IIFE, es2020, CSS imported as text; `--min` minifies), copied to `extension/dist/webview/{nodeview,logs,resources}/index.js`; `host/extension.js` + `host/syslogs.js` + `host/resources.js` → `extension/dist/extension.js`; everything else from `vsix/` (it stops if a shipped webview or the MCP server is missing there), with the webviews' JS/CSS and the MCP server minified (esbuild: names and whitespace only, licence notices kept); version from the newest `src/changelog.ts` entry stamped into `package.json` and the manifest. |
| `package.sh` | `./package.sh [out.vsix]` → build, typecheck, all host tests on the built `extension.js`, `tools/same-code.mjs` on each minified webview / MCP server against its readable source, zip `out/vsix` (default `dist/sonover-code-<version>.vsix`). Writes nothing if a test fails. No input needed. |
| `host/extension.js` | **The extension host's source** (Node.js; ~16,600 lines). Recovered from the 0.1.1 build: formatted, every variable readable (~5,800 renamed), a comment on every function, class and method; each top-level name's note gives its minified original (`saturnRequest (minified: _) — …`); this project's changes built in (see "Changes to the original" below). Rename with `tools/rename.mjs`, not by hand. |
| `host/syslogs.js` | Host side of System Logs (`SystemLogsHost`); appended after `host/extension.js` in the built file, so it shares its scope and uses its helpers (`listRecords`, `saturnRequest`, `recordRoutes`, …). `newest()` = the only record read: the newest `NEWEST` (10), sorted by the instance if it will (`?sort=created_at DESC`, checked and remembered), else the list as it comes, with `ordered`; `open()` = the System Logs panel (its `fetch` → `newest`); `fromWorkflows()` = answers the Logs tab's messages from the Workflows panel; `attach()` receives the instance manager / globalState / extensionUri at command registration; `targetOf()` finds a Workflows panel's instance: its `manager` / `instance` fields, else by shape. |
| `host/resources.js` | Host side of the Resources screen (`ResourcePropertiesHost`), appended after `syslogs.js` (same scope). `GET /Resources/<name>` → `{type: "resource", data: [{key, label, type, required, …}]}` (a list; a `{key: property}` map is read too). `handle(manager, instance, message, post)`: `init` → `init {instanceName, resources}`; `load {resource}` → `properties {resource, properties: [{key, label, type, required, editable, definition}]}`; `save {resource, changes: [{key, required}], order?: [every key, in the new order]}` (`applyRequired`, `applyOrder`) → re-read, back up to `<globalStorage>/resource-backups/<instance id>/<resource>-<time>.json`, then the save Saturn's own app makes: `PUT /resources/<name>/schema` with `{data: "<JSON text of {<key>: <property without key>, …}>"}` — the whole schema as a map, a JSON string (`schemaMap`), read back (values and the order) → `saved` / `saveMismatch {message, unchanged, backup}` / `saveFailed {message}`; `restore {resource, backup}` → `restored`; `probe {resource}` → `probe {report}` (read-only: `OPTIONS` on `/Resources/<name>` and `/Resources`, and the instance's MCP server `POST /api/mcp` `initialize` + `tools/list`, listing tools about resources — what the instance takes; a refused save's message names the `Allow` header too); `copy {text}`; `openBackups`. `attach({globalStorageUri})` at command registration. |
| `vsix/` | The rest of the package, with this project's edits applied: `[Content_Types].xml`, `extension.vsixmanifest`, `extension/package.json` (+ the System Logs command, menu entry and `saturn.systemLogResource` setting), `readme.md`, `LICENSE.txt`, `SECURITY.md`, `media/icon.svg`, `dist/mcp/saturn-mcp.js` (the MCP server: JSON-RPC over stdio, the `saturn_*` tools), and `dist/webview/{workflows,sidebar,menus,pages,agent,kanban,preview}/index.{js,css}` (`workflows` = the list view: disabled-card style, Disabled badge + Enable/Disable button, `sonover:openWorkflow` hook; `sidebar`: the System Logs entry). **Readable**: each was a minified esbuild bundle; now formatted, with a header, `──── Library: … ────` / `──── App: … ────` comments marking regions. App code: every variable named and commented (~6,000 names), icons named after themselves (`CheckIcon`, `faArrowRight`). Library code (React, lucide-react, clsx, cva, tailwind-merge, react-markdown/micromark/remark-gfm, Font Awesome, Vue, the Tailwind browser compiler): left as it was, names minified, apart from the bindings the app uses (`React`, `cn`, `twMerge`, …). The CSS is formatted Tailwind output (the same in each folder). Edit app code directly; rename with `tools/rename.mjs`. |
| `tools/rename.mjs` | Renames variables and adds comments safely: `node tools/rename.mjs <file> <changes.json>… [--out f] [--dry]`, changes = `{renames: [{line, old, new}], comments: [{line, text}]}` against the file as it is. Babel's scope-aware rename of the variable declared on that line; refuses clashes (same scope, hiding, capturing, globals). A top-level rename's comment becomes `newName (minified: old) — …`. |
| `tools/same-code.mjs` | `node tools/same-code.mjs <before> <after>`: proves two files are the same program apart from variable names, comments and blank lines (every variable → a numbered placeholder, then compared). Run it after every rename/comment pass. Ignores how literals are spelled (`!0`/`true`, `.5`/`0.5`) and statement-label names, so it can also check a minified file against its source. |
| `tools/readable.mjs` | Makes minified code readable: formats it and renames, with Babel's scope-aware rename, the names in its `NAMES` table (each checked against its code) plus module imports. It produced `host/extension.js`; use it again for another original build or as a reference for naming. Output defaults to `reference/` (git-ignored). |
| `tools/serve.mjs` | The browser-test server (http://localhost:8765): `harness/`, `dist/nodeview.js` / `dist/logs.js`, and the real list view / sidebar from `vsix/` as `wf.js` / `sidebar.js`. |
| `src/bridge.ts` | **Must be imported first.** Takes the single `acquireVsCodeApi()` handle and hands a wrapped copy to the list-view bundle; tracks the open workflow; stores node-view state under key `__sonoverNodeView`. Exposes `send`, `onSelectionChange`, `loadNodeViewState`, `saveNodeViewState`. |
| `src/main.tsx` | Injects CSS, mounts `<App/>` into `#sonover-node-view`. |
| `src/App.tsx` | Main component: host message handling (`workflow`, `workflows`, `operators`, `draftState`, `editSaved`, `editFailed`, `connection` / `connectionRestored`, …), selection/multi-select, keyboard shortcuts, canvas, Add menu, workflow picker. |
| `src/layout.ts` | Flow → nodes/edges layout. `LayoutDir` `"v"` (default, top-to-bottom) or `"h"`. Node ids encode paths (`h:`/`j:` + `pathKey`). |
| `src/nodes.tsx` | React Flow node/edge renderers (`nv`, `reroute`, `frame`, `slot`, `wire`). |
| `src/panel.tsx` | Side panel: Design / Inspect / Logs / Changes tabs, multi-select panel (`BulkOps`), resize handle. |
| `src/logs.tsx` | Logs tab (`LogsTab`): asks for the newest 10 with `workflow.id = "<id>"` (server mode); if refused or empty, reads the instance's newest 10 and keeps this workflow's (scan mode). No paging. Refresh retries the filter. Scope chips: workflow / action (steps it runs, incl. called commands) / step — by the record's `task` id vs `stepId`; level chips, search, Live (10 s, checks at once, "checked N s ago"), "may not be the newest" warning when `ordered` is false, trace, the formatted message (`MessageView`) and the whole record folded under it, Go to action, Open in System Logs (with the filter). |
| `src/settings.tsx` | Stage / action / command / workflow panels: names, colours, access rules, form fields, triggers, resource hooks. |
| `src/forms.tsx` | Parameter editors (`fieldsFor`, `FieldControl`, `StepForm`, `PanelEditor`), lookups, key/value editor (`KeyValueEditor`: an empty map is `{}` and still shows its inputs; clearing it sends `{}`, never `""`, which the host skips), delay. Edits apply on Enter / blur / pick, and also when the editor unmounts with edits pending (`PanelEditor`) or focus leaves a property map with a typed row (`KeyValueEditor` adds it). |
| `src/fieldmore.tsx` | "Every form-field setting" editor; emits `FieldChange[]` → `setFormFieldProps`. |
| `src/controls.tsx` | Prism-highlighted inputs (`HighlightInput`), Figma-style `Scrub`, date/time pickers, colour picker, detection helpers (`dateModeOf`, `isColorParam`, `scrubOf`). |
| `src/outliner.tsx` | Layers panel (stages/actions/commands, create/rename/reorder) and search results view. |
| `src/search.ts` | Workflow search (names and steps, e.g. by operator). |
| `src/types.ts` | Shapes of the host's view model (`WorkflowView`, `Flow` union, `Catalog`, …). |
| `src/changelog.ts` | Release notes shown in the Changes tab — add an entry for each release. |
| `src/prism-setup.ts` | Sets `window.Prism = {manual: true}` before prismjs loads. |
| `src-res/main.tsx`, `res.css` | Resources webview UI: resource picker (locked while changes are unsaved); the properties down the left (`.rs-side`: search, cards with name / key / type, drag or Alt+↑/↓ to reorder — not while searching —, Reset order); the picked one on the right (`.rs-detail`: Required with "was …", the whole definition); bar with Discard / Save → inline confirm; notices (Restore backup on a mismatch, Check what it takes on a refusal). Pending changes, order and the picked property in webview state. |
| `src-logs/main.tsx`, `logs.css` | System Logs webview UI: the newest 10 records (no paging), Live every 5 s with "checked N s ago". Accepts `search` / `filter` in `init` or as a `search` message. |
| `src-logs/message.tsx` | A log message formatted: `parseMessage` (text + the JSON values inside it, named from `const x =`), `summarize` (one line for a row), `MessageView` (each value pretty-printed, highlighted, collapsible, Copy; takes a `json` highlighter). Used by both the Logs tab and the System Logs screen. |
| `src-logs/records.ts` | Pure record helpers shared by the System Logs screen and the Logs tab: `shape` (date/level/message keys), `ascending`, `rel`/`abs`, `levelClass`, `taskOf` (the step a record's `task` names), `cellText`, and name matching (`target`, `mentions(r, keys, target, skip?)`, `WORKFLOW_KEYS` / `ACTION_KEYS` / `STEP_KEYS`, `WORKFLOW_COPY` to skip the record's workflow copy). |
| `harness/` | Browser test harness (served by `tools/serve.mjs`): `mockhost.js` (mock of the extension host for the Workflows webview — like the real host, an empty object param keeps the stored value — incl. 450 SystemLog-shaped records for the Logs tab, `__addSysLog`, `__logsFail`, `__filterRejected` / `__filterIgnored` / `__unordered`, `__logFilters`; it returns the newest 10 like the real host), `logsmock.js`, `csp.html` / `logs.html` / `resources.html` / `sidebar.html` (pages with the webview's CSP), `resmock.js` (mock host for the Resources screen: `__saveMode` `ok` / `refuse` / `mismatch`, `__data`, a canned `probe` report), `wf-stub.js` (a minimal stand-in for the list view, for tests that don't need it). |
| `test*.mjs`, `test-csp.mjs` | Playwright checks (print `PASS`/`FAIL` lines). `test10.mjs` = 0.3.4 System Logs; `test11.mjs` = 0.3.5 / 0.3.8 / 0.3.9 Logs tab; `test12.mjs` = 0.3.6 property map editor + 0.3.7 back-online toast + 0.3.10 apply-when-done; `test13.mjs` = 0.3.13 / 0.3.18 Resources screen (layout, reorder) + sidebar entry (all read `SHOTS` (screenshot folder, default `shots/`) and `CHROME` (browser path) from the environment). |
| `hosttest*.cjs` | Node scripts that load the **built** `out/vsix/extension/dist/extension.js` (with `vscode` stubbed) and exercise its internal functions (by their readable names). `hosttest-wflogs-real.cjs` runs the Logs tab's host side inside it against a fake Saturn server (stubbed `fetch`); `hosttest-activate.cjs` checks a startup failure is shown (0.3.11); `hosttest-resources.cjs` runs the Resources host side against a fake Saturn (0.3.13). Exception: `hosttest-wflogs.cjs` runs `host/syslogs.js` alone with stubbed helpers. |

## How the extension talks to Saturn (`host/extension.js`)

Only the extension host talks to Saturn; webviews can't reach the network (CSP) and go through `postMessage`. All of it is in `host/extension.js`. Below, names are given as minified original → readable name where it has one (search the file for either).
- **Instances**: the instance manager (class `fr`, the `e` / `this.manager` passed around) keeps `{id, name, url, displayName?}` in `globalState["saturn.instances"]`; each instance's token is in VS Code secrets under `saturn:token:<id>` (`getToken` / `setToken`).
- **Login**: `hc()` → `POST <url>/api/Users/authenticate {email, password}` → `{token, data: user}`; or an API key, checked with `GET <url>/api/Resources` (`mc()`).
- **Every request**: `_(manager, instance, path, init)` → `fetch(Fo(instance.url, path))` = `<url>/api<path>` with `Authorization: Bearer <token>`, a 60 s timeout, `redirect: "error"`, and a response size cap (`ot`). `Fo` refuses paths that leave `/api`. `O(fn, what)` wraps a call and turns failures into errors; `Ze()` treats `{status: "FAILURE"}` bodies as errors.
- **Workflows**: `/Workflows` — list `ft`, get `Xe` (`/Workflows/<id>`), create `kc` (POST), save `Wn` (PUT the whole definition), delete `bc`. Also `/Operators`, `/UserGroups`, `/Users`, `/workflowTriggers` + `/triggers`, `/resourceDetails` (lifecycle hooks, PUT), `/Resources` and `/Resources/<name>` (fields), `/resources/catalog` (core resources), `/menus`, `/custom-pages`, `/Saturnuicomponents`, `/resourceviews`.
- **Records**: `Sc` (list a page: `?limit&page&filter`, tries plural route names from `Ur()`, e.g. `SystemLog` → `/systemlogs`; returns `{records, total}` from `data` + `count`/`total`), `Pc` (one record), `Vr` (create/update/delete). System Logs and the Logs tab use only `Sc`, `Ln`, `dn`, `xc`.
- **Drafts**: the Workflows panel (class `It`; fields `panel`, `extensionUri`, `storageUri`, `manager`, `instance`) never writes per edit. `applyEdit` changes a local draft (`this.drafts`, persisted to `drafts.json` in the instance's storage folder) and posts `workflow` / `editSaved` / `draftState`. `saveChanges` PUTs the draft with `Wn`, re-reads it, and clears it; `discardChanges` drops it.
- **Offline**: a connection monitor probes `HEAD <url>` (`Cc`); when the instance is unreachable, edits go to an offline store (`saveOffline`) and are pushed later. Creating a workflow offline is refused (the instance assigns the id).
- **Parameter values** (`rn()`): an empty value keeps the stored one, which is why `KeyValueEditor` sends `{}` to clear a map. For `property_updater` the host also writes `_properties` from `properties`.
- **Not Saturn**: the Tickets/kanban screen talks to `https://sonoverapi.saturn.gd/api` with the user's Sonover login (`gr()`), not to an instance.

Readable names of the main pieces: `InstanceManager` (fr), `loginWithPassword` (hc), `checkApiKey` (mc), `saturnRequest` (_), `apiUrl` (Fo), `checked` (O), `throwIfFailure` (Ze), `listWorkflows` (ft), `loadWorkflow` (Xe), `saveWorkflow` (Wn), `createWorkflow` (kc), `deleteWorkflow` (bc), `listRecords` (Sc), `getRecord` (Pc), `writeRecord` (Vr), `recordRoutes` (Ur), `workflowView` (Ke), `stepView` (yr), `paramsToData` (rn), `WorkflowsPanel` (It), `probeInstance` (Cc), `ConnectionMonitor` (Is), `OfflineWorkflowStore` (ks, offline workflow copies), `OfflineTriggerQueue` (Cs, trigger changes made offline), `TaskLog` (ps, the agent's task list).

## Changes to the original (built into `host/extension.js` and `vsix/`)

Until 0.3.10 these were applied by a `patch.py` to the original build (see git history); they are now part of the source. Helpers added by this project used a `$` suffix and are now named `stepViewBase`, `movedTargetPath`, `setFieldProps`, `comparePaths`, `bulkStepEdit`.
1. `WorkflowsPanel.getHtml`: loads `dist/webview/nodeview/index.js` before the Workflows bundle (same nonce).
2. `stepView` adds a step's `mock` flag (Saturn's "disabled") and, for operators, the step's `id` as `stepId` (`stepViewBase` is the original).
3. `setStepMock` message `{workflowId, path, mock}`.
4. `moveStep` fix for moving a step into a later container in the same list (`movedTargetPath`).
5. `formFieldView` carries the stored field as `raw`.
6. `setFormFieldProps` `{ownerPath, formKey, key, changes:[{path, value?, remove?}]}` (`setFieldProps`) — refuses `key`/`label`/`type` and prototype paths.
7. `bulkSteps` `{op: "delete"|"duplicate"|"mock", paths, mock?}` as ONE draft edit (`bulkStepEdit`, last path first), and `copyNodes` `{paths}`.
8. System Logs: command `saturn.openSystemLogs` (its registration also calls `SystemLogsHost.attach({manager, globalState, extensionUri})`), the sidebar's `saturn:openSystemLogs` message, and `host/syslogs.js`.
9–11. List view (`vsix/…/webview/workflows`): disabled-card style, Disabled badge + Enable/Disable button, `sonover:openWorkflow` window event so the node view switches workflows through the list view. Sidebar (`vsix/…/webview/sidebar`): the System Logs entry.
12. Workflows panel messages for the Logs tab, all → `SystemLogsHost.fromWorkflows(this, t, type, e.payload)`: `fetchWorkflowLogs {reqId, workflowId, filter?}` → `workflowLogs {reqId, workflowId, resource, instanceName, records (the newest 10, newest first, trimmed by `SystemLogsHost.trim`), total, ordered, filter}` or `workflowLogsFailed {reqId, message}`; `openSystemLogs {search?, filter?}`; `openLogJson` / `copyLogJson {record}`.
13. `activate` wraps the original's (now `startExtension`): a failure while starting shows "Sonover Code could not start: …" and is rethrown (logged by VS Code), so the views are never just blank.
14. Resources screen: command `saturn.openResources` (registration also calls `ResourcePropertiesHost.attach`), the sidebar's `saturn:openResources` message and its "Resources" entry (`ResourcesIcon`), `host/resources.js`; `getResourceFields` reads list-shaped definitions by `key` (the original gave 0, 1, 2…).
Plus in `vsix/extension/`: `package.json` (command, context menu, `saturn.systemLogResource` setting) and `readme.md` (the feature list).

When changing the host: edit `host/extension.js` / `host/syslogs.js` directly (renames and comment passes through `tools/rename.mjs`, checked with `tools/same-code.mjs`), add or extend a `hosttest-*.cjs` that runs the function, and mirror the behaviour in `harness/mockhost.js` so the browser tests cover it.

## Build and test

```sh
npm install
./package.sh                         # build + typecheck + host tests -> dist/sonover-code-<version>.vsix
codium --install-extension dist/sonover-code-<version>.vsix --force   # or code; then reload the window
```

The steps `package.sh` runs, and the browser tests:

```sh
node build.mjs --min                                   # -> out/vsix (the unpacked extension), dist/nodeview.js, dist/logs.js
npx tsc --noEmit --jsx react-jsx --strict --module esnext --moduleResolution bundler \
  --target es2020 --skipLibCheck src/env.d.ts src/main.tsx src-logs/main.tsx   # typecheck (no tsconfig)
node hosttest.cjs out/vsix/extension/dist/extension.js   # likewise hosttest-move/-reorder/-command/-field/-bulk/-logs/-wflogs-real/-activate/-resources
node hosttest-wflogs.cjs                                  # host/syslogs.js on its own
node tools/serve.mjs &                                    # the browser-test server on :8765
node test9.mjs                                            # any of test2–test12.mjs, test-csp.mjs (CSP: prints its errors, [] = pass)
```

Caveats:
- The Playwright tests print `PASS` / `FAIL` lines; `npm test` is a placeholder. They read `SHOTS` (screenshot folder, default `shots/`) and `CHROME` (browser path, default the cloud container's) from the environment.
- The shipped webviews and MCP server are kept readable in `vsix/`; never commit minified copies there (the build minifies).
- `dist/`, `out/`, `node_modules/`, `reference/` and `shots/` are generated and git-ignored; don't commit them. The `dist/` and `out/` rules are root-only (`/dist/`, `/out/`): `vsix/extension/dist/` holds shipped files and must stay committed.

## Conventions

- The webview runs under a strict CSP (`default-src 'none'; script-src 'nonce-…'; style-src 'self' 'unsafe-inline'`): styles may be inline, but scripts need the nonce — no `eval`, no external loads. `test-csp.mjs` checks this.
- Every edit goes through the host's draft (`applyEdit`) so undo / Save / Discard and the list view stay in sync; multi-step operations must be a single draft edit.
- The node view never calls `acquireVsCodeApi()` itself — use `send()` from `bridge.ts`. Don't write to the list view's saved state keys.
- The Resources screen is the only thing that writes a resource's definition (`PUT /resources/<name>/schema`, the whole schema): always re-read first, back up, change only what was asked, read back and compare (`host/resources.js`). Keep it that way for any new resource edit.
- System Logs and the Logs tab are read-only: host side only uses the record-reading helpers (GET requests). Keep it that way.
- Every System Logs read is the newest 10 records (`NEWEST`), through `SystemLogsHost.newest` — no paging, no bigger windows. SystemLog records are large.
- A real SystemLog record (resource `SystemLog`, route `/systemlogs`, ids `systemlog-…`) has `log_type`, `name`, `message`, `trace`, `file`, `created_at`, `task` (JSON text of the step that wrote it, with its `id`) and `workflow` (a copy of the whole definition — never match actions/steps against it), plus `_permissions_` / `field_restrictions`. Prefer `task.id` and `workflow.id`; keep the name-based fallbacks for other resources picked in the screen.
- Saturn's filter language (menus, `?filter=` on record lists): `field = "value"`, `AND`, `OR`, `IN ["a", "b"]`, dotted paths (`workflow.id = "…"`). Treat a filter the instance rejects as unsupported and fall back.
- Release checklist: the newest `src/changelog.ts` entry sets the packaged version (`build.mjs` stamps it); add a `README.md` "New in x.y.z" section, add a `CHANGELOG` entry in `src/changelog.ts`, add a `testN.mjs` for the release, and update this file.
- Never lose an edit the user typed: anything that can unmount an editor (collapsing a section, changing selection, closing the panel) must apply its pending value first, and a refused change must be reported where it's visible (a toast), not only inside a possibly closed editor.
- UI copy: plain, short, sentence case; British spelling is used in places ("colour").
