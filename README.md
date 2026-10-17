# Workflows node view (v0.3.9)

A Blender-style node editor layered onto the Workflows webview. It does everything the list view does.

## New in 0.3.9 — only the newest 10 logs
- **Every read is the newest 10** (`NEWEST` in `syslogs-host.js`): the System Logs screen's `fetch` and the Logs tab's `fetchWorkflowLogs` both go through `SysLogs$.newest(manager, instance, resource, filter)`. The screen has no paging or page size any more (`fetchRange` is gone); the tab has no Load older / Search older, and in its fallback (filter refused) it keeps this workflow's among the instance's newest 10.
- **Sorted by the instance**: `newest` first asks for `?limit=10&page=1&sort=created_at DESC` (then `sort=-created_at`), the same GET `Sc` makes plus a sort, and keeps the result only if its dates really run newest first; the sort that worked is remembered per instance and resource. Otherwise it reads the list as it comes (an oldest-first list from its end, in pages of 10). Replies carry `ordered`; when it's false (the instance lists logs in some other order, such as by id) both screens say these may not be the newest.
- **Live** was hard to see working: it waited a full interval before its first check and showed nothing when there was nothing new, and on an instance that doesn't list logs by date the "newest" page never changed. It now checks as soon as it's turned on and shows "checked N s ago"; with the instance sorting by date, new logs appear on top.
- The Logs tab's Refresh tries the workflow filter again instead of staying in the fallback.

## New in 0.3.8 — Logs tab, matched exactly
Built on a real SystemLog record: it has `log_type`, `name` (the step's title), `message`, `trace`, `file`, `created_at`, `task` (the step that wrote it, as JSON text with its `id`) and `workflow` (a copy of the whole workflow definition, with `id` and `name`), plus `_permissions_` / `field_restrictions`.
- **Server filter first**: the tab sends `filter: workflow.id = "<id>"` (Saturn's filter language, as menu tabs use: `field = "value"`, `AND`, `IN [...]`, dotted paths). If the instance refuses it (`workflowLogsFailed`) or returns nothing about the workflow, the tab falls back to reading the newest records and matching them itself. "Load older" pages through the filtered list.
- **Steps by id**: patch #2 now also puts each operator step's `id` on the view model as `stepId`. "This step" keeps records whose `task.id` is that step; "This action" keeps the steps the action runs, including those of commands it calls. Name matching (for records without a task id) skips the record's `workflow` copy, which names every action and step.
- **Rows** say which action and step wrote them (`Approve order · Send Email`); an error's `trace` is shown above its JSON.
- **Trimmed records**: `SysLogs$.trim` keeps only the workflow copy's `id` and `name` and drops the permission lists before records reach the webview.
- **Open in System Logs** passes the filter, and the System Logs screen applies it (`init.filter`, or `search {text, filter}`); its table shows objects by name and a `task` as `operator · id` (`cellText`).

## New in 0.3.7 — back online
- The node view handles the host's `connectionRestored` `{synced}` message (sent after it reconnects and replays queued offline edits) with a toast: the host's summary, or "Back online". It used to be ignored, so going back online was silent in the node view. Checked in `test12.mjs`.
- `SysLogs$.targetOf` uses the Workflows panel's own `manager` / `instance` fields (their names in 0.1.1) first, and only falls back to finding them by shape.

## New in 0.3.6 — property map fixes
- The key/value editor for object parameters (`KeyValueEditor` in `src/forms.tsx`, e.g. Resource Property Updater's properties) shows its inputs for an empty map (`{}`) instead of falling back to the raw JSON box; only values that aren't a plain object use the JSON box.
- Removing the last row saves `{}`. It used to send an empty value, which the host skips, so the old map stayed. `harness/mockhost.js` now mirrors that host behaviour; `test12.mjs` covers both.

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
One step: `./package.sh path/to/sonover-code-0.1.1.vsix` builds, patches, runs the host tests and writes `dist/sonover-code-<version>.vsix`; install it with `code --install-extension dist/sonover-code-<version>.vsix --force` or Extensions → ⋯ → Install from VSIX…. By hand:
```
npm install
node build.mjs --min
python3 -I patch.py <unpacked-0.1.1-vsix> dist/nodeview.js 0.3.9
node hosttest.cjs | hosttest-move.cjs | hosttest-reorder.cjs | hosttest-command.cjs | hosttest-field.cjs | hosttest-bulk.cjs | hosttest-logs.cjs  <unpacked>/extension/dist/extension.js
node hosttest-wflogs.cjs        # the Logs tab's host side, on syslogs-host.js alone (no .vsix needed)
```
`test2`–`test10.mjs`: 292 Playwright checks running the real list view and the node view together against `mockhost.js` under the webview's CSP. `test10.mjs` covers the System Logs screen and sidebar entry (`harness/logs.html` / `harness/sidebar.html`); `test11.mjs` covers the Logs tab; `test12.mjs` the property map editor. Without the .vsix, serve `harness/wf-stub.js` as `wf.js` (and an empty `wf.css`) to stand in for the list view. `test11.mjs` takes `SHOTS` (screenshot dir) and `CHROME` (browser path) from the environment.
