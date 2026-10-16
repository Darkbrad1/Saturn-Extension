# Workflows node view (v0.3.5)

A Blender-style node editor layered onto the Workflows webview. It does everything the list view does.

## New in 0.3.5 — Logs tab
- **Where**: a **Logs** tab in the node view's side panel (Design · Inspect · Logs · Changes), `src/logs.tsx`.
- **What**: the System Logs records about the open workflow, newest first. A record belongs to the workflow when a field whose key mentions "workflow" (at any depth, e.g. `workflow`, `workflow_id`, `context.workflow.name`) holds the workflow's id or name, or when the workflow's id (8+ characters) appears anywhere in it. Scope chips narrow it to the open action/command (`action`/`command`/`task` keys) or the selected step (`operator`/`step` keys). Level chips, search, Live (every 10 s, new rows flash), a JSON detail with Copy / Open as JSON, **Go to <action>**, and **Open in System Logs** (the full screen, searched for the workflow).
- **Reading**: the host reads the newest records in windows of 200 (oldest-first lists are read from the end); the tab keeps going back until 25 match or 1,000 more records have been read, then offers **Search older**. Matching helpers are shared with the System Logs screen (`src-logs/records.ts`).
- **Read-only**, like the System Logs screen: only the record-reading helper (`Sc`) is called.

Extension changes (`patch.py`, #12): the Workflows panel answers `fetchWorkflowLogs` `{reqId, workflowId, offset, window}` → `workflowLogs` `{reqId, workflowId, resource, instanceName, records, total, scanned, done}` (or `workflowLogsFailed`), plus `openSystemLogs` `{search?}`, `openLogJson` and `copyLogJson` `{record}` — all handled by `SysLogs$.fromWorkflows` in `syslogs-host.js`, which finds the panel's instance by shape. The `saturn.openSystemLogs` registration now also hands the instance manager and global state to `SysLogs$.attach`. The System Logs screen takes an optional `search` (in `init`, or a `search` message when it is already open).

## New in 0.3.4 — System Logs
- **Where**: a "System Logs" item on each instance card in the Sonover sidebar (beside Workflows, Menus, Pages, Components), "Saturn: Open System Logs" on the instance's context menu in the Components tree, and in the command palette.
- **What** (`src-logs/`, bundled to `dist/webview/logs/index.js`): the records of the System Logs core resource, newest first in full pages (an oldest-first list is read from the end, stitching two pages when needed), with paging, page size, Live refresh every 5 s (new rows flash), level chips, search across the page, the instance's server filter, a column picker, and a detail pane with highlighted JSON, Copy JSON and Open as JSON (an untitled editor).
- **Which resource**: the `saturn.systemLogResource` setting if set; else the one picked in the screen (remembered per instance); else the resource named "System Log(s)". The picker lists log-like resources first, then all.
- **Read-only**: the host side (`syslogs-host.js`, appended to `extension.js`) only calls the extension's record-reading helpers (`Sc`, `Ln`, `dn`, `xc`) — every request is a GET.

## New in 0.3.3
- **Node view first**: the Workflows screen opens in the node view (with the workflow picker when none is open); List view is one click away.
- **Vertical flow by default** (`layout.ts`, `LayoutDir`): steps run top to bottom, If branches and parallel branches side by side, sockets on top/bottom. The ↕/↔ button switches direction; remembered.
- **Shift+click multi-select**: Shift (or Ctrl/⌘)+click adds/removes steps. Right-click inside the selection, the side panel ("N steps selected") and the keys X, M, Shift+D, Ctrl+C act on all of them. A step inside a selected container isn't counted twice.
- **Stage guides**: a VS Code-style guide line runs down each stage's actions (in the stage colour when one of its actions is open) and a divider separates stages.
- **Changes tab** in the side panel: the workflow's unsaved edits, newest first, with Undo / Save / Discard, and release notes (`src/changelog.ts`).

Extension changes (`patch.py`): `bulkSteps` `{op: "delete"|"duplicate"|"mock", paths, mock?}` applies to all paths as ONE draft edit (last path first so earlier paths stay valid; any stale path refuses the whole change); `copyNodes` `{paths}` puts several steps on the shared clipboard in document order.

## New in 0.3.2
- **Syntax-highlighted inputs** (`src/controls.tsx`, Prism): every text box in the side panel is highlighted. A transparent native input/textarea sits under a highlighted copy with the same metrics, so typing, selection, undo, IME and Enter/Esc behave as before. Grammars: `{{ templates }}` (everywhere, including inside code and JSON), JSON for arrays/objects, JavaScript/HTML/CSS for code params by language, and cron for schedule triggers. Tab indents in code boxes.
- **Figma-style scrubbing**: hold a numeric field's label and drag sideways (Shift ×10, Alt fine); one draft edit on release. Arrow keys step too. Applies to delay (50 ms steps, shown as s/min/h), loop/parallel concurrency, numeric operator params (by type or name: retries, timeout, limit, count…), trigger numbers, and form-field layout numbers. Turned off when the value is a template.
- **Date and time pickers**: params whose type, input type or name says date/date-time/time (`_at`, `date`, `deadline`, `timestamp`, `_on`, `time`…) get a calendar (Monday-first, today marked, time row in local time with your time zone) plus a **Now**/**Today** button and **Clear**. Dates are written as `YYYY-MM-DD`, date-times as ISO (UTC), times as `HH:mm`. The box still takes templates. Trigger params too.
- **Colour pickers**: colour params (type/input type `color`, or a colour-ish name) and stage colours get a picker — saturation/brightness area, hue, hex, swatches, and the browser eyedropper where available.
- **Every form-field setting** (`src/fieldmore.tsx`): editing a form field or command parameter shows all its other settings, each applied as its own draft edit — validation (unique, searchable, email, IP), visibility (hide everywhere / table / form / view / drawer, own tab), layout (table column width, view/form columns and full width, view span), read/write defaults, input type and template, lookup & map (source, lookup type, map type/reference/value/label fields, label type, label function in a JS editor), rendering (component, size, shape, opacity), meta tags, required columns, default view — plus the whole field as JSON (Apply JSON sets and removes settings; key/label/type stay with the checked editor above).

## Changes to the extension (`patch.py`)
New in 0.3.2:
- the form-field view model (`go`) carries the stored field as `raw`
- a `setFormFieldProps` message `{ownerPath, formKey, key, changes:[{path, value?, remove?}]}` that copies along each path (nothing is mutated) and refuses `key`/`label`/`type` and prototype paths

Unchanged: getHtml script tag, `mock` in the view model, `setStepMock`, the move fix in `on()`, the Disabled badge in the list view, and the `sonover:openWorkflow` hook.

## Build and test
```
npm install
node build.mjs --min
python3 -I patch.py <unpacked-0.1.1-vsix> dist/nodeview.js 0.3.5
node hosttest.cjs | hosttest-move.cjs | hosttest-reorder.cjs | hosttest-command.cjs | hosttest-field.cjs | hosttest-bulk.cjs | hosttest-logs.cjs  <unpacked>/extension/dist/extension.js
node hosttest-wflogs.cjs        # the Logs tab's host side, on syslogs-host.js alone (no .vsix needed)
```
`test2`–`test10.mjs`: 292 Playwright checks running the real list view and the node view together against `mockhost.js` under the webview's CSP. `test10.mjs` covers the System Logs screen and sidebar entry (`harness/logs.html` / `harness/sidebar.html`); `test11.mjs` covers the Logs tab. Without the .vsix, serve `harness/wf-stub.js` as `wf.js` (and an empty `wf.css`) to stand in for the list view. `test11.mjs` takes `SHOTS` (screenshot dir) and `CHROME` (browser path) from the environment.
