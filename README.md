# sonover-code (v0.3.31)

The Saturn / Sonover VS Code extension, built entirely from this repo: `./package.sh` → `dist/sonover-code-<version>.vsix`.

- `host/` — the extension host. `extension.js` is the original 0.1.1 host, recovered from its build (its source was lost): formatted, key names readable, this project's changes built in. `syslogs.js` is System Logs / the Logs tab.
- `src/` — the node view (the Workflows screen's default view; the list view is kept, one click away). `src-logs/` — the System Logs screen.
- `vsix/` — the rest of the package as shipped (manifest, `package.json`, the other webviews, the MCP server), with this project's edits.
- Built by `build.mjs` into `out/vsix/`; see `CLAUDE.md` for the layout, how it talks to Saturn and how to test.

## Build fix after 0.3.31
- `package.sh` runs `npm install` when any package in `package.json` is missing, not only when `node_modules` is. After 0.3.30 added `@fortawesome/free-solid-svg-icons`, a `git pull` then `./package.sh` stopped with "Could not resolve"; now it installs it and goes on.

## New in 0.3.31 — One icon picker everywhere
- The icon picker moved to `src-res/icons.tsx` (its styles into `src-res/editor.css`) and is shared: the Menus screen, and a new setting kind `{kind: "icon"}` in `src-res/spec.ts`, used by `propertyIcon` (Icon) and `tabIcon` (Tab icon). So the Resources screen and the node view's Form tab show the same button and popup. A value stored as `fa-name` keeps that form when another icon is picked. `test18.mjs` (10).

## New in 0.3.30 — A new Menus screen
- The Menus screen is a new app, `src-menus/` (React, styled with the Resources screen's `src-res/editor.css` plus `src-menus/menus.css`), built into `dist/webview/menus/index.js` in place of the old bundle (removed from `vsix/`; it's in git history). The host side (`MenusPanel`) and its messages are unchanged, plus `openInSaturn` (`<instance url>/menus`).
- Three columns: menus (search, +, drag or Alt+↑/↓ to reorder, right-click: Copy id, Undo the last save, Discard its changes, Delete menu), the tab tree (fold with ←/→, drag before / after / into a tab, Alt+↑/↓, several picked, right-click: Duplicate, Add a sub-tab, Copy / Paste settings, Delete / Restore, + and × on each row), and the settings (the menu's label, icon and access at the top; the picked tabs below).
- `src-menus/model.ts`: the old screen's helpers in TypeScript; each problem now names the setting it's about (`field`), so it shows under that setting, and on its menu card and tab row. The tabs are edited as a tree of nodes with fixed ids (`treeOf` / `referencesOf`) that writes an untouched menu back exactly as it was read.
- Unsaved changes per menu (`works`), kept while the screen is hidden; Save confirms the list, sends `save` for each in turn, then `reorder`. The icon picker (`src-menus/icons.tsx`, Font Awesome 7.3.1 solid, now an npm dependency) is a popup with names on hover. The node view's workflow "Resources" section is called "Hooks". `hosttest-menus.cjs` (1), `test17.mjs` (54).

## New in 0.3.29 — Open in Saturn
- Resources screen: an "Open in Saturn ↗" button next to Reload, once a resource is picked. It sends `openInSaturn {resource}`; the host opens `<instance url>/resources/<name>` in the browser (a name with `/`, `?` or `#` opens nothing). `hosttest-resources.cjs` (43 checks).
- Node view: an "Open in Saturn ↗" button in the top bar, which sends the existing `openWorkflow {workflowId}` (`<instance url>/workflows/<id>`). `test16.mjs` (4).

## New in 0.3.28 — Lookup functions, and code settings in their own file
- `src-res/spec.ts`: with `lookup_type: "function"`, Lookup shows "Lookup function" (the code in `lookup_reference`, which is where Saturn keeps it) and "Item data type" (`lookup_function_item_data_type`; `string` is the only value seen so far, any other stored value is kept and shown). Both screens get it.
- `PropertyEditor`: a setting that changed but whose `when` is false is no longer forced into view when another setting at the same path shows (`sharedShown`), so Values / Reference / Lookup function don't all appear.
- Form / Parameters tab: an "Open in a file" button under each code setting (`lookups.openCode`, only on that tab). New Workflows panel message `openFieldCode {workflowId, ownerPath, formKey, key, path, language, text, workflowName, contextName}` opens the text as a file tied to the field (`openParamDocument`, node kind `fieldCode`); saving it runs `saveFieldCode`: one draft edit setting that path on the field (the action or command found again by its id if it moved; an error if the field is gone). Refuses `key` / `label` / `type` and prototype paths. `hosttest-formtab.cjs` (20 checks), `test15.mjs` (32).

## New in 0.3.27 — A Form tab for actions, a Parameters tab for commands
- The side panel has a Form tab when an action is open, and a Parameters tab when a command is open (`src/formtab.tsx`). It uses the Resources screen's editor (`src-res/editor.tsx` with `noMenu`, `hints` and `lookups.noun`), styled by `src-res/editor.css` (now shared by both screens). The panel widens to two thirds of the window on it, with no resize handle and no shortcut bar.
- Everything from the Resources screen's property list carries over: several picked (Mixed), drag and Alt+↑/↓, + to add, the right-click menu (Duplicate, Copy / Paste settings, Copy key, Delete), the mapped chips. A field keeps a fixed id here, so it stays picked while its key is typed.
- New Workflows panel messages: `setFormFields {workflowId, ownerPath, formKey, fields, summary}` (the whole list as ONE draft edit; refuses missing or invalid keys, two fields with one key and prototype keys), `fetchSavedForm` → `savedForm {…, fields}` (from the draft's base, for "was …"), `fetchResourceFields {resource}` → `resourceFields`, `openResourceScreen {resource}` (`ResourcePropertiesHost.open(…, show)`: a new screen gets `show` in `init`, an open one a `show` message).
- The old Form / Parameters sections in Design are gone (with `src/fieldmore.tsx`). `hosttest-formtab.cjs` (12 checks), `test15.mjs` (28).

## New in 0.3.26 — Resources: open the resource's workflows
- New Resources messages: `workflows {resource}` → `workflows {resource, workflows: [{id, name, via: "workflow" | "hook", hooks: ["after create", …]}]}`, read from `GET /resourceDetails` (`bindingsFromResourceDetails`: the ResourceDetail's `workflow.reference`, and the workflows its lifecycle hooks name) with names from `GET /Workflows`; `openWorkflow {workflowId}` → `WorkflowsPanel.showWorkflow`.
- `WorkflowsPanel.showWorkflow(extensionUri, storageUri, manager, instance, workflowId)` opens (or reveals) the Workflows panel and posts `showWorkflow {workflow: summary}` once its list has been sent (`pendingShow`, `listSent`, `postPendingShow`). The node view (`src/App.tsx`) turns that into the `sonover:openWorkflow` event, so the list view opens it as when switching.
- The screen shows the linked workflows as green buttons above the properties (`.rs-workflows`). `hosttest-resources.cjs` (41 checks), `test14.mjs` (35).

## New in 0.3.25 — Resources: Show in instead of Hide in
- Visibility's "Hide in" switches are now "Show in" (`edit: {kind: "bool", invert: true}`): on when the stored `hideIn…` value isn't `true`; switching off stores `true`, on stores `false`, the same settings Saturn saves. "was on / off" follows the switch. `test14.mjs` (32).

## New in 0.3.24 — Resources: one column of settings
- The two-column layout is gone: `.pe-flow` is one column of blocks at any width (the cards stretch to the page's width), with the same gap under every card. `test14.mjs` (29) checks it at 1900 px.

## New in 0.3.23 — Resources: even gaps in two columns, core resources listed last
- The settings page is one flow of blocks (`.pe-flow`; a block is a card, the first of a group carries its heading). On a page 1150 px wide or more it uses CSS columns, so the cards run down the left column then the right, and every card has the same gap under it (the grid made each row as tall as its taller card). The menu now follows the first section in reading order that's still in view.
- `init` also sends `core`: which resources are Saturn's own, from `GET /resources/catalog` (`coreResourceNames`; null if the catalog can't be read). The picker shows two groups, Resources then Core resources. `hosttest-resources.cjs` (40 checks), `test14.mjs` (30).

## New in 0.3.22 — Resources: several properties at once, a right-click menu, mapped chips
- Multi-select (Ctrl/Cmd+click, Shift+click; `selected` is a list). `PropertyEditor` takes `items: [{original, draft}]`: a setting with different values shows "Mixed" (switches in the middle, `aria-checked="mixed"`; selects show a Mixed entry), a change goes to every item, and settings marked `single` (label, key, description) are left out. Dragging a picked property or Alt+↑/↓ moves all picked ones as a block (`move(keys, to)`, `nudge`).
- Right-click menu (`.rs-menu`): Duplicate (below the original, `<key>_copy`, "(copy)" label), Copy settings / Paste settings (a box with a switch per group, all on but General; the key is never pasted; the copy is kept across resources), Copy key(s), Go to <resource>, Delete / Restore. Delete and Backspace in the list delete too. Deleted properties are crossed out until Save; the confirm names them and warns.
- `save` takes `removes: [key]`: the host leaves them out of the schema (`applyRemoves`), still the one whole-schema PUT, never a DELETE request; the backup keeps them.
- Mapped chips (`mappedOf`: a dynamic source's `source_definition.reference`, else `map.reference`): blue (`--rs-static`) for a map, purple (`--rs-dynamic`) for a dynamic source, on the chip and the card's bar; Required is a red star. A chip (also next to a Reference setting) opens that resource; the top bar shows the trail with ‹ Back, and Alt+← goes back to the property you came from.
- Unsaved changes are kept per resource (`works: {resource: {drafts, added, order, deleted}}`), so switching resources no longer waits for Save. Save's confirm lists every resource with changes; they're saved one at a time (a failure stops the rest). Older webview state is carried over.
- Sections sit in two columns once the page is 1150 px wide or more (a container query). `hosttest-resources.cjs` (39 checks), `test13.mjs` (61), `test14.mjs` (29).

## New in 0.3.21 — Resources: change a property's key, every type, Visibility higher up
- General has a Key row (Saturn's "Field"), checked as you type (`edit.kind: "key"`: `KEY_PATTERN`, and not another property's key; a bad key disables Save). A property keeps a fixed id on screen (its key on the instance, or a new one's first key) and shows `shownKey`; new properties are kept as `{id, prop}`.
- `save` takes `renames: [{from, to}]`, applied last (`applyRenames`: the property keeps its place and settings; refuses a gone property, an invalid key, or two properties with one key). Workflows, views and other properties that name the old key aren't changed with it; the Key row says so.
- `TYPES` is every type Saturn's definitions use: string, number, boolean, date, array, object (another type a property has still shows as one more card). The Visibility group moved right after General. `hosttest-resources.cjs` (36 checks), `test13.mjs` (61).

## New in 0.3.20 — Resources: one settings page with a side menu
- Three columns: the properties list, the settings menu (`.pe-menu`: Find a setting, the groups with change counts, each group's sections under it, JSON) and one long page (`.pe-page`) with every group. The menu scrolls the page to a section and highlights the section in view; the search narrows the page to matching settings.
- Rows like VS Code / Obsidian settings: name, description and "was … / Put back" on the left, the control on the right (big controls under the text). Sections are rounded cards.
- On/off settings are switches (`Switch`: a checkbox with `role="switch"`); the long property lists keep checkboxes. The property type is three cards (`Cards`: String, Number, Boolean; another type a property already has shows as a fourth card), as are Static / Dynamic and the new property form's type. No round radio buttons.
- Styled like the node view (its side panel's colours, inputs and buttons), not the VS Code theme. Save, Discard and the unsaved count moved to the top bar; Save's confirm shows under it. `test13.mjs` (57 checks).

## New in 0.3.19 — Resources: every setting of a property, and new properties
- The right side of the Resources screen is now a full property editor (`src-res/editor.tsx`), drawn from a list of settings (`src-res/spec.ts`: each setting's path in the property, its control, and when it shows). Saturn's eight tabs are six groups here: General, Input, Data (Source + Lookup + Defaults), Display, Visibility, Access, plus JSON (the whole property). Settings show only when they apply; Find a setting searches all groups; a changed setting shows "was …" with Put back; tabs count their changes; "Undo all changes to it".
- The setting names come from real Saturn definitions (the Application schema). Settings Saturn's screens have whose stored names aren't known yet (property mask, validation rules, Is Password, Allow Custom Values, URL, the map's filter / search field / dropdown limit, label and lookup functions, colours, Access Control's shape, the other input types) are left out until a capture of Saturn's save shows them; the JSON tab edits anything meanwhile.
- **+** adds a property (label → key, type) with the settings Saturn's own app gives a new one (`newProperty`, in both `spec.ts` and `host/resources.js`).
- `save` now takes `changes: [{key, path, value | remove}]` (the old `{key, required}` still works), `adds: [{key, property}]` and `order`. The host applies each change at its path on the definition as just re-read (`applyChanges`; refuses `key` and prototype paths), adds new properties (`applyAdds`; refuses a taken or invalid key), and the read-back lets the instance add settings of its own to a new property. New messages: `fields {resource}` (another resource's properties) and `options {resource, value, label}` (records, e.g. attachment groups). `hosttest-resources.cjs` (33 checks), `test13.mjs` (52).

## New in 0.3.18 — Resources: properties down the side, in order
- Layout like Saturn's stage / action editor: the properties down the left (`.rs-side`: search, cards with name, key, type, a blue grip when required, a dot when changed), the picked one on the right (`.rs-detail`: Required, the whole definition). Dragging a card (HTML drag and drop; off while searching) or Alt+↑ / Alt+↓ reorders; Reset order. The order is kept in webview state with the other unsaved changes.
- `save` takes `order` (every key, in the new order) besides `changes`; `applyOrder` reorders the definition (refused if the keys no longer match), the schema map is sent in that order, and the read-back also checks the order was kept. `hosttest-resources.cjs` (23 checks), `test13.mjs` (38) cover it.

## New in 0.3.17 — Resources: saving the way Saturn does
- From Saturn's own app's network traffic: a resource is saved with `PUT /api/resources/<name>/schema` and the body `{"data": "<JSON text of {<property key>: <property without its key>, …}>"}` — the whole schema, as a map keyed by property, sent as a JSON string. `host/resources.js` now does exactly that (`schemaMap` turns GET's list back into the map); the method / shape guessing (OPTIONS, POST, the two bodies, remembered settings) is gone. Backup, read-back check and Restore stay. `hosttest-resources.cjs` (18 checks) models the real endpoint.

## New in 0.3.16 — Resources: what the instance answered
- loanapp.saturn.gd took the save's POST (both shapes) but the resource stayed the same. A save that changes nothing now quotes the instance's answer to each attempt (300 characters each), and `createdRecordId` also recognises `{data: [{id}]}` and `{id}` replies.

## New in 0.3.15 — Resources: saving the way the instance allows
- loanapp.saturn.gd's check: `OPTIONS /api/Resources/Application` allows `HEAD, GET, POST, DELETE` (no PUT), `/api/Resources` `HEAD, GET`, no MCP server. So a save now asks `OPTIONS` first and uses the first of PUT, PATCH, POST the address allows — never DELETE — and remembers the method that worked (`globalState` `sonover.resourceSaveMethod.<id>`; forgotten again on a 405). The backup, the two body shapes and the read-back check are as before; if nothing changed and the reply looks like a created record (`{data: {id}}`), it stops after that one write and names the record. `hosttest-resources.cjs` covers it (26 checks).

## New in 0.3.14 — Resources: finding how to save
- A real instance answered the save's `PUT /Resources/<name>` with 405: that address takes no PUT. A refused save now names what the address allows (the response's `Allow` header), and the error offers **Check what it takes** (`probe` in `host/resources.js`): read-only — `OPTIONS` on `/Resources/<name>` and `/Resources`, and the instance's own MCP server (`POST /api/mcp`: `initialize`, `tools/list` only), listing tools about resources / schemas / properties — shown with Copy. Nothing is written. `hosttest-resources.cjs` and `test13.mjs` cover it.

## New in 0.3.13 — Resources: required or not
- **Resources screen** (`src-res/`, host side `host/resources.js`, command `saturn.openResources`, sidebar entry "Resources", context menu on an instance): pick a resource, see its properties (label, key, type, required, the whole definition under Details) and tick Required on or off. Unsaved changes are kept in the webview's state; the resource can't be switched while some are unsaved.
- **Careful saving**: Saturn's API for changing a resource isn't documented, so Save confirms, re-reads the definition, backs it up (`<global storage>/resource-backups/<instance>/<resource>-<time>.json`, the Backups button opens the folder), PUTs `/Resources/<name>` with only the chosen `required` flags changed — first the `data` list alone, as workflows are saved, then, if the instance takes that but nothing changes, the whole `{type, data}` body once — remembers the shape that worked, and reads it back: a refusal changes nothing; any other difference is reported with Restore backup.
- **Fix**: `getResourceFields` read `GET /Resources/<name>`'s `data` only as a `{key: property}` map; Saturn sends a list of properties with their `key`s, which came out as 0, 1, 2…. It now reads both.
- Tests: `hosttest-resources.cjs` (the real host against a fake Saturn: both save shapes, refusal, unexpected change, restore), `test13.mjs` (the screen and the sidebar entry).

## New in 0.3.12 — the sidebar is back
- **Missing webviews**: `.gitignore`'s `dist/` also matched `vsix/extension/dist/`, so the shipped webviews (sidebar, list view, menus, pages, agent, kanban, preview) and the MCP server were never committed. A build from a fresh clone packaged an extension without them: VSCodium's console showed `Webview.loadLocalResource` / 404 for `dist/webview/sidebar/index.js` and the sidebar was blank. The ignore rules are now root-only (`/dist/`, `/out/`) and the files are in the repo.
- **Build guard**: `build.mjs` refuses to build if any of those shipped files is missing from `vsix/extension/`.

## New in 0.3.11 — built from its own source
- **Recovered host**: `host/extension.js` is the original 0.1.1 extension host, recovered from its build (formatted, key names readable, this project's changes built in); `build.mjs` builds the whole package from `host/` and `vsix/`, so `./package.sh` needs no input and `patch.py` is gone.
- **Startup failures are shown** (`activate` in `host/extension.js`): if starting throws, an error message says "Sonover Code could not start: …" (and the error is still logged), instead of the Sonover sidebar staying blank. `hosttest-activate.cjs` covers it (fails on 0.3.10).

## New in 0.3.10 — readable log messages, nothing lost
- **Messages** (`src-logs/message.tsx`, shared by both screens): `parseMessage` splits a message into text and the JSON objects/arrays inside it (brackets in strings respected; each named after a `const x =` / `x:` before it), `summarize` gives a row's one-liner (`flow {36 keys} · store {1 key} · resource {33 keys}`), and `MessageView` shows each value pretty-printed and highlighted in its own collapsible block with Copy (more than three values start collapsed; Expand / Collapse all). The Logs tab's detail shows the message first and folds the whole record under "Whole record"; the System Logs screen's detail pane shows it above the other fields, and its table's message column uses the summary.
- **Edits are applied when you're done** (`src/forms.tsx`): the property map's empty name/value row is added when focus leaves the editor or the editor goes away (it used to need Enter or ＋, so collapsing Parameters lost it); a value without a name says it needs one. `PanelEditor` applies any field still being edited when it unmounts (section collapsed, another step picked, panel closed) — the same draft edit leaving the field makes.
- **Refused changes** from the side panel are also toasted ("Not applied: To is required"), since the fields they belong to may be closed by then. `test12.mjs` covers all of this (each check fails on 0.3.9).

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

## Changes to the extension in 0.3.2 (then applied by `patch.py`; now in `host/extension.js`)
New in 0.3.2:
- the form-field view model (`go`) carries the stored field as `raw`
- a `setFormFieldProps` message `{ownerPath, formKey, key, changes:[{path, value?, remove?}]}` that copies along each path (nothing is mutated) and refuses `key`/`label`/`type` and prototype paths

Unchanged: getHtml script tag, `mock` in the view model, `setStepMock`, the move fix in `on()`, the Disabled badge in the list view, and the `sonover:openWorkflow` hook.

## Build and test
```
npm install
./package.sh                      # -> dist/sonover-code-<version>.vsix
codium --install-extension dist/sonover-code-<version>.vsix --force
```
Browser tests: `node tools/serve.mjs` (serves `harness/` with the real list view and sidebar), then `node testN.mjs`. Host tests run inside `package.sh`. Details in `CLAUDE.md`.

Up to 0.3.10 the extension was produced by patching the original `.vsix` with `patch.py`; from the recovery on, everything is source in this repo (see git history for the old patch kit).
