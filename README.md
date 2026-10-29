# sonover-code (v0.3.68)

The Saturn / Sonover VS Code extension, built entirely from this repo. It lets you work on a Saturn instance's workflows, resources, menus and logs from inside VS Code (or VSCodium).

This file has three parts: how to build and install it, what it does today (screen by screen), and what changed in each version. `CLAUDE.md` has the technical details: how the code is laid out, how it talks to Saturn, how to test, and the decisions we've settled.

## How to build and install

All new work is on the `dev` branch (`main` only gets changes when the owner decides).

```sh
git fetch origin
git checkout dev
git pull origin dev
./package.sh                         # builds, checks and tests it -> dist/sonover-code-<version>.vsix
codium --install-extension dist/sonover-code-<version>.vsix --force   # or `code` for VS Code
```

Then reload the VS Code window. `package.sh` runs `npm install` first when a package is missing, and writes nothing if a test fails. On Windows, run `./package.sh` from Git Bash or WSL (it's a bash script).

Browser tests: `node tools/serve.mjs &` (a small test server on port 8765), then `node testN.mjs` (each prints PASS / FAIL lines). The host tests run inside `package.sh`.

## What it does

### Sidebar
The Saturn sidebar opens every screen: Workflows, Resources, Menus, System Logs, and (under AI Skills) What's new and Keyboard shortcuts.

### Workflows: the node view
The Workflows screen opens as a node editor, like Blender's: each action or command is a flow of step cards joined by wires (a Create step's card is titled with the resource it creates). The old list view is one click away (List view).
- **Top bar:** workflow switcher, Undo, + Add, direction (vertical or horizontal), Reload, Open in Saturn ↗, Workflow JSON (the whole workflow with your unsaved changes), Operators JSON (every operator the instance offers, as Saturn lists them), Layers, Panel, List view. Under it, a breadcrumb row; each step in it takes you back there.
- **Editing steps:** pick a step to edit it in the side panel, which starts with Saturn's description of its operator and ends with its Output (what the next step gets); a setting that points at a record (a Person, an Agent) is a searchable record picker that also takes a typed {{ template }}; a setting Saturn shows only after another choice (Create Task's Completion Property, for record_update) shows only then, in the side panel and the Add form, keeping its value while hidden; a change applies when you're done with it (Enter, clicking away). Nothing goes to Saturn until you Save the workflow; Undo and Discard work on these unsaved changes. Steps can be added (Shift+A, or + on a wire), duplicated, disabled, copied and pasted, deleted, and dragged onto a wire to move them. Code and emails open in their own editor tab.
- **Cards:** every value is colour-highlighted; a property map (like a Property Updater's) shows one row per property.
- **Branches:** an If shows its True and False side by side; a switch shows one column per case and Otherwise last. Pick a switch to change the value it checks and its cases (rename, add, reorder, remove); the Add menu has Switch (cases).
- **Picking several steps:** Shift or Ctrl/Cmd+click, a box drawn on the empty canvas, or Ctrl/Cmd+A. Then: one right-click menu or key for all of them, drag them together onto a wire, and (when they're the same kind of step) edit the settings they share, with Mixed where they differ. Middle-drag or Space+drag moves around the canvas.
- **Layers panel (left, T):** stages, actions and commands. Add, rename, reorder, Duplicate, delete; double-click a stage (here or on the workflow map) for its settings. Pick several (one kind at a time) to drag, duplicate or delete them together; several actions can have their access rules set together. Dragging actions or commands into another list asks Copy or Move (an action can become a command and back).
- **Side panel (right, N):** Design (the picked step's settings), Inspect, Form or Parameters (the action's form or the command's parameters, edited with the Resources screen's editor; the panel widens to two thirds of the window there and can be resized), Logs (the System Logs about this workflow, action or step), Changes (the unsaved changes).
- **Workflow settings:** names, triggers, Hooks, Linked resources (a button per resource, opening it on the Resources screen). While it's open, the canvas shows the workflow map: Global actions, the stages with their actions, the commands underneath, arrows for how a record moves between stages and dashed lines for the commands each action runs. Boxes can be dragged (kept on this computer); drag an action's arrow to another stage to change where it moves the record.

### Resources
Pick a resource; its properties are listed down the left in the schema's order, and the picked one's settings are on the right (a settings menu beside one long page).
- **Properties:** add (+), drag or Alt+↑/↓ to reorder, pick several (a change goes to all; Mixed where they differ), right-click for Duplicate, Copy / Paste settings, Copy key, Delete (crossed out until Save) and Restore. A mapped property has a chip that opens its resource. T folds the list away.
- **Settings:** six groups (General, Visibility, Input, Data, Display, Access) plus JSON; a setting only shows when it does something, Find a setting searches them all. Favourites at the top hold the settings you use most (one list everywhere). Visibility starts with Everywhere, one switch for all six places. Code settings can be opened in their own file. Covered: labels, keys, types, rules, inputs (including the Rich text editor with its voice transcriber and AI actions, and a Dynamic Component's code), a lookup's filter, maps, lookups (including Countries), dynamic sources, defaults, renderers (currency, inline component, file manager), table and record view settings, custom dropdown style, access rules.
- **Resource settings:** the resource's own settings (description, open records in a drawer, sections and which properties are in each).
- **Saving:** nothing is saved until Save and its confirm. Each resource is read again and backed up first, saved the way Saturn's own app does, and read back to check. Backups can be restored. Schema JSON and Open in Saturn ↗ are in the top bar; green buttons open the workflows linked to the resource.

### Menus
Three columns: the menus, the picked menu's tabs (with their sub-tabs), the settings.
- **Menus:** add, drag or Alt+↑/↓ to reorder, pick several to move, delete or edit together (icon and who can see them). Deleting is crossed out until Save. T folds the list away.
- **Tabs:** add, sub-tabs, drag to reorder or into another tab, pick several to edit together, Duplicate, Copy / Paste settings, delete (crossed out until Save). Dragging tabs under another tab, out of one, or onto another menu asks Copy or Move. A caption can have spaces. Problems show beside what they're about; errors stop Save.
- **Menu JSON** (top bar): the picked menu as Save would write it.
- **Undo:** Undo and Redo (top bar, Ctrl+Z, Ctrl+Shift+Z or Ctrl+Y) go back through every unsaved change on the screen, in any menu.
- **Saving:** each changed menu is saved in turn, then the deletes, then the order. Saving clears the undo history; Undo the last save is on a menu's right-click menu.

### System Logs
A read-only screen with the newest 10 System Logs records, a search, Live (checks every 5 s), and each message formatted (the JSON inside it pretty-printed). Schema JSON shows the log resource's properties. The node view's Logs tab shows the same records for one workflow.

### Keyboard shortcuts
A page to change every shortcut of the node view, Resources and Menus. A key another shortcut on the same screen uses is refused. Open screens pick changes up at once.

### What's new
The release notes on their own page, newest first, with a search.

## Version history

### New in 0.3.68: Settings that show only when they matter
Step settings Saturn's form shows only after another choice now do the same in the side panel and the Add form; a hidden one keeps its value.
- Host (`operatorCatalog`): each param keeps `showWhen`, the text of its `form_visibility` rule when `evaluator` is `function` (else null).
- `src/showwhen.ts` (new): `shownWhen(rule, values)` reads the rule without running code (the CSP has no eval): `params.x` paths, strings, numbers, true / false / null / undefined, `=== !== == != < > <= >=`, `&& || !`, brackets, an arrow function or a body with one `return`; a rule it can't read shows the setting. It reads all six rules in the owner's operator list.
- `src/forms.tsx` `fieldsFor`: a catalog setting whose rule is false is left out (the panel, the Add form and the several-steps editor); its value stays in the step. Mock: Create Task's completion settings and a Period / Start Date pair with the owner's rules. `test56.mjs` (10), `hosttest-operators.cjs` (+2).

### New in 0.3.67: Create cards named after their resource, a resizable Form tab
A Create step's card shows the resource it creates where it said Create; the Form / Parameters tab can be resized like the other tabs.
- `src/layout.ts`: `cardTitle` (a `create` step with a `resource` that isn't a template is titled with it).
- `src/panel.tsx` / `src/App.tsx`: the Form tab's own width (`formWidth` in the node view's saved state; null = two thirds of the window, `FORM_MIN` 420 to 90%), a `ResizeHandle` on it (double-click: back to two thirds). `test55.mjs`; `test15.mjs` now expects the handle.

### New in 0.3.66: What Saturn says about each operator
The side panel shows each operator's description and its Output; disabled operators leave the Add menu; settings that point at a record are a searchable record picker.
- Host (`operatorCatalog`): each entry keeps `disabled` (Saturn's `status: "disabled"`) and `output` (`operatorOutput`: `{description, type, fields: [{path, type, description}]}`); a param with `lookup_type: "map"` and `map.reference` gets `lookupResource {resource, valueField, labelField, typed: true}` (from `lookup_value_field` / `map.value_field`, `lookup_label_field` / `map.label_field` / `lookup_search_field`) and no "enter a value directly" hint. `catalogToObject` passes both on.
- Node view: `CatalogEntry.disabled` / `.output` (`src/types.ts`); the Add menu leaves disabled operators out and shows each one's description as its tooltip (`src/App.tsx`); the Add form now gets the same `FormEnvContext` as the side panel (before, its record lists never loaded); `src/panel.tsx`: the description (`.fg-op-desc`) under the step's name and an Output section (`#op-output`); `src/forms.tsx`: `RecordPicker` for a `typed` lookup (search the records, click one for its id, or type any value or template; the picked record's name under the box; Enter or leaving the box applies it, once).
- Mock: Create Task (Person, an output) and a disabled Save Locally, from the owner's list. `hosttest-operators.cjs` (+6), `test54.mjs` (15).

### New in 0.3.65: Saturn's operator list
The node view's top bar has Operators JSON: the instance's whole operator list (each operator with its settings), read-only, in a tab beside the canvas.
- `src/App.tsx`: the button, after Workflow JSON, sends `viewOperatorsJson`. Host (`WorkflowsPanel.handleMessage`): `viewOperatorsJson` → `listOperators` (`GET /api/Operators`, as the instance gives it) in an untitled JSON tab beside; offline, the copy kept in the instance's `operators.json` (`offlineStore().operators()`), with a message; with neither, an error message. Mirrored in `harness/mockhost.js` (logged in `__opened`).
- `hosttest-operators.cjs` (7), `test53.mjs` (5).

### New in 0.3.64: The switch step
Switch steps (a value checked against a list of cases, with Otherwise) show and can be edited in the node view, one column per case. A lookup's Filter and a Dynamic Component input's code can be changed on the Resources screen and the Form tab.
- Host (`host/extension.js`): `switchView` (`{kind: "switch", value, cases: [{value, steps, childrenPath}], otherwise, otherwisePath}` from Saturn's `{type: "switch", data: {value}, cases: [{value, command}], otherwise}`), `branchSteps` (a branch's steps: a series' or the one step), `TYPE_SWITCH`; `stepFormValues`, `containerPatch` (Value required), `newSwitchStep` (no cases, an empty Otherwise) for `readNode`, `updateOperator` (only `data.value` changes) and `addOperator`; new message `setSwitchCases {workflowId, path, cases: [{value, from}]}` (`switchCasesEdit`, one draft edit: each case keeps the steps of the one it came from, a new one starts as an empty group, one left out is removed); `seriesForSteps` (a branch holding one plain step becomes a group before steps are moved in, in `moveStep` and `moveStepsEdit`, as `insertAt` already did); the walkers know switches (`walkFlow`, `countNestedSteps` (which now also counts a single step sitting directly in a branch, If included), `findCommandReferences`, `describeStepPath` ("case 2", "the otherwise branch"), the id stamper, step names).
- Node view: `SwitchFlow` and `switchSteps` (`src/types.ts`); `src/layout.ts` (a lane per case and Otherwise, `branches` on the head node, `KIND_COLORS.switch`); `src/nodes.tsx` (an output handle per case); `src/panel.tsx` (`SwitchCases`: rename, ↑ / ↓, ×, Add case, a warning for two cases with one value; `onSwitchCases` → `setSwitchCases`); `src/forms.tsx` (Value); the Add menu's Switch (cases); search, logs and the map walk into cases.
- `src-res/spec.ts`: `lookup_filter` (Data > Lookup > Filter) and `input_properties.component_definition` (Input > Input component code), from the owner's real definitions. Harness: the real switch in `appflow.js` (Assign staff), the real Notes property in `appschema.js`, the Staff field's filter in `mockhost.js`; the mock mirrors the switch.
- `hosttest-switch.cjs` (24), `test51.mjs` (24), `test52.mjs` (8).

### New in 0.3.63: Rich text editor, and the JSON on every screen
The Resources screen (and the Form tab) knows Saturn's Rich text editor input and its settings. Every screen has a button that shows its JSON.
- `src-res/spec.ts`: `INPUT_TYPES` + `richtexteditor`; Rows for it too; `isRichText`; Voice transcriber (`input_properties.transcriber.enabled`, `alongside` `TRANSCRIBER_DEFAULTS` when switched on), its text settings (`TRANSCRIBER_TEXT`: provider, mode, profile, language), Tell speakers apart (`diarization`), AI actions (`input_properties.ai_actions`, JSON). Taken from a real note resource's schema (`harness/noteschema.js`, the mock's `ApplicationNote`).
- Node view: Workflow JSON in the top bar (`viewRawWorkflow`, the host's existing message). Menus: Menu JSON (`viewRaw {text}`, new in `MenusPanel.handle`). System Logs: Schema JSON (`schema {resource}` in `host/syslogs.js`, a GET through `ResourcePropertiesHost.readResource`, now exported).
- `test50.mjs` (22); `hosttest-menus.cjs` (viewRaw), `hosttest-logs.cjs` (schema).

### New in 0.3.62: Undo on the Menus screen
The Menus screen has Undo and Redo for changes not saved yet. Spaces can be typed in a tab's caption again. Tabs dragged under another tab, or out of one, ask Copy or Move. In the node view, double-clicking a stage opens its settings.
- `src-menus/main.tsx`: one undo history for the screen (`history`, `travel`, `Snap`: the unsaved `works`, `order` and `deletedMenus`). An effect records each change (`changeBy`: `user` adds a step, `history` is undo / redo itself, `save` clears it); typing in one box within `UNDO_PAUSE` (1 s) is one step; up to `UNDO_LIMIT` (200). Undo / Redo in the top bar and the shortcuts `menus.undo` (Mod+Z) and `menus.redo` (Mod+Shift+Z, Mod+Y) in `src/keys.ts`; a search box keeps the browser's own undo. Undo shows the menu it changed.
- `src-menus/tabsettings.tsx`: `CaptionInput` shows the caption as typed (spaces too) while the stored one is trimmed; before, a space at the end was dropped on each key press.
- Tabs dropped under another parent in the same menu (`changesParent`): the Copy or Move box (`tabsHere`); `copyTo` puts copies (new ids, with their sub-tabs) there; reordering under the same parent just moves.
- Node view: a double-click on a stage's row in the layers panel (`src/outliner.tsx`) or its header on the workflow map (`src/map.tsx`, `stage:<stage>` sent to `onOpen`) opens the stage's settings. Rename is in the right-click menu and the settings.
- `test49.mjs` (35); `test17.mjs` picks Move in the new box.

### New in 0.3.61: Picking several menus
- `src-menus/main.tsx`: `pickedMenus` (Ctrl/Cmd and Shift+click, `clickMenu`; `manyMenus`, `menusFor`); `moveMenus` (drag or Alt+↑/↓ moves them as a block); `deletedMenus` (crossed out until Save, `toggleDeleted`; a new menu is just dropped), Save's queue deletes them after the saves (`delete {id, confirmed: true}`, `deletedOne`) and its confirm names them; `ManyMenus` (icon and who can see them, Mixed where they differ); tabs dropped on another menu's card → `.mn-tabs-to` Copy or Move (`tabsToMenu`: at the end, with their sub-tabs, new ids).
- Host (`MenusPanel`): `delete` with `confirmed` skips the question (Save named them); the Undo offer after a delete no longer holds up the next change. `hosttest-menus.cjs` (5), `test48.mjs` (21); `test17.mjs`: Delete menu crosses it out.

### New in 0.3.60: Picking several in the layers panel
- `src/outliner.tsx`: stages in `items` (`st:<stage>`); one kind picked at a time; `onPick` tells App what's picked (`outlinerPicks`); right-click on a picked row → a menu for all (`menu.many`: Duplicate for actions / commands, Delete); the Delete / Backspace key (the panel is focusable, `onPanelKey`) → `.nv-confirm` naming them; several stages dragged → `onMoveStages`. `src/settings.tsx`: `MultiActionPanel` (the access rules several actions share, Mixed where they differ; `AccessEditor`'s Open in editor only for one action). `src/panel.tsx`: shown for several picked actions (`pickedActions`).
- Host: `deleteItems {kind, paths}` (`deleteItemsEdit`, `isItemPath`), `duplicateItems {kind, paths}` (`duplicateItemsEdit`), `moveStages {indexes, toIndex}` (`moveStagesEdit`), `setAccessMany {paths, rules}` (`saveAccessMany`: asks before opening them to everyone; a rule this extension can't build is kept as each has it); each one draft edit. Mirrored in `harness/mockhost.js` (`dupItem`). `hosttest-multi.cjs` (28), `test47.mjs` (14).

### New in 0.3.59: Picking several steps on the canvas
- `src/App.tsx` (`Canvas`): box select (`selectionOnDrag`, `SelectionMode.Full`, `panOnDrag={[1]}`, Space+drag pans; `onSelectionEnd` → `onPickMany(nodes, add)` with Ctrl/Cmd/Shift held at the start = add; `pickableInBox`: steps and groups); `node.selectAll` (Mod+A, `src/keys.ts`) picks every step in view (`canvasNodes`); dragging a picked step drags them all (`dragging.many`, the wires touching any picked step are skipped) → `moveSteps`; several of one operator (`sameOperator`) → `readNodes` → `MultiEditor` (`src/forms.tsx`: Mixed where they differ, one setting per change) → `updateOperators`. `src/panel.tsx`: `MultiPanel` takes the shared settings section.
- Host (`host/extension.js`): `readNodes {paths, reqId}` → `nodesParams {reqId, list}`; `moveSteps {paths, toChildrenPath, toIndex}` (`moveStepsEdit`: by identity, in document order, a step inside another moved one goes with it; `outermostPaths`); `updateOperators {paths, operator, changes}` (`updateOperatorsEdit`: each step's own values with the changes over them, through `paramsToData`; one refusal refuses all). Mirrored in `harness/mockhost.js` (`formOf`, `operatorData`). `hosttest-multi.cjs` (16), `test46.mjs` (13).

### New in 0.3.58: Property settings back to their groups
- `src-res/spec.ts`: `GROUPS` back to the 0.3.54 layout (General, Visibility, Input, Data, Display, Access). Kept: Show everywhere, now "Everywhere", first in Visibility > Show in (`showAll`, `SHOW_PATHS`); the Countries settings in Data > Lookup; Favourites (setting ids unchanged: `lookup_reference.values` / `.text` / `.function`, `lookup_value.countries`, `lookup_label.countries`). Gone: the Choices picker (`choicesOf`, `withChoices`, `CHOICE_KINDS`), a group's `place`, `folded` and `copies`, a part's `when`. `src-res/editor.tsx`: no folding; Put back also restores a setting's `alongside` paths. Paste settings: all on but General again. test13 / 14 / 31 / 42 back to their 0.3.54 form (Favourites allowed for); `test43.mjs` (Favourites, 19), `test44.mjs` (13), `test45.mjs` (8).

### New in 0.3.57: Countries lookups
- `src-res/spec.ts`: a Countries lookup (`lookup_type: "countries"`) has Value field (`lookup_value`) and Label field (`lookup_label`), each a pick of a country's field (`COUNTRY_FIELDS`: `country_code`, `country_name`; another stored value still shows), as Saturn's own editor stores them; Label function no longer shows for Countries. Picking Countries fills them in (`alongside` with `if`: only for that value). Choices' `sets` include `lookup_value` / `lookup_label`. `harness/appschema.js`: the real `student_institution_country` property. `test45.mjs` (10).

### New in 0.3.56: Show everywhere
- `src-res/spec.ts`: a Show everywhere switch in Basics, under Type (`id: "showEverywhere"`, `edit: {kind: "showAll"}`, an empty path, `sets: SHOW_PATHS`): `shownEverywhere` (on / off / null for some), `withShownEverywhere` (off: all six `hideIn…` true; on: each one set becomes false, one not set stays not set). A setting's `sets` (also on Choices) is what "was …" compares and Put back restores. `src-res/editor.tsx`: the switch, half on (Mixed) when shown in some places or the properties differ. `test44.mjs` (14).

### New in 0.3.55: Property settings by place, and Favourites
- `src-res/spec.ts`: `GROUPS` regrouped by place: Basics (label, key, type, description, tags, icon; "Shown everywhere with": the default renderer and its options, date format), Rules (required, unique, email; Defaults), Choices (`choices`, a setting with `edit: {kind: "choices"}` and an empty path: `choicesOf` / `withChoices` read and set `lookup_type`, `map` and `source`; parts with a `when`: A fixed list, Another resource, A function, Other lookup, Linked records), In forms / In tables / In record views (`place`: the `hideIn…` setting, its Show in switch first), Access, Advanced (`folded`). Every path is as before. `settingId` (a setting's `id`, else its path), `pastePaths` (Paste settings; Choices also copies `lookup_type`, `map`, `source`).
- `src-res/editor.tsx`: a part's `when`; a hidden place says Hidden (page and menu) and folds all but its switch; Advanced folded until opened, searched or changed; the Choices cards (with "was …" and Put back); Favourites at the top (`FavouriteRows`: drag by the handle; `FavouritesEditor`: ↑ / ↓ / × and a checklist by group); `useFavourites(send)`. Element ids are `<prefix>-<setting id>`.
- Host: `host/favourites.js` (`FavouritesHost`, appended after `shortcuts.js`): `globalState["saturn.favouriteSettings"]`, `fetchFavourites` → `favourites {ids}`, `setFavourites {ids}` (sent to every screen that asked), answered by the Resources screen and the Workflows panel (Form tab). `hosttest-favourites.cjs` (9), `test43.mjs` (31); test13 / 14 / 31 / 42 follow the new groups.

### New in 0.3.54: Every setting of a real Application schema
- `src-res/spec.ts`, checked against a real Application schema (`harness/appschema.js`, the mock's `LoanApplication` resource): per-variance Currency (`rendering._variances.{list,view}.options.currency.value`) and Component code (`….options.code.value`, shown for the Inline component renderer or when stored; the top one too, `INLINE_START`); the File manager's options (`rendering.options.{title,helperText,resourceName,property,maxFiles}.value`); `acl` (File access); `source_definition` / `source_type` also when stored on a static property (`hasSource`); a map's `lookup_reference`; `number_of_columns.md` / `.lg` when set. Saturn's `size` / `shape` / `opacity` renderer options are kept untouched. `src-res/main.tsx`: a blank label shows the key (`tidy`). `test42.mjs` (17).

### New in 0.3.53: Keyboard shortcuts page
- `src/keys.ts`: every changeable shortcut (`SHORTCUTS`: node view, Resources, Menus) with its default keys; `comboOf` (a key press → "Mod+Shift+S"), `pressed`, `shown`, `hint`, `clashOf`, `listenForShortcuts` (asks with `fetchShortcuts`, listens for `shortcuts {bindings}`). The node view, Resources and Menus screens use it instead of fixed keys (Escape, arrows in lists and Alt+↑/↓ stay fixed).
- New page `src-keys/` (`main.tsx`, `keys.css`; built to `dist/webview/keys/index.js`): the shortcuts by screen, + records a key (Esc cancels), × takes one off, Reset / Reset all, a clash on the same screen refused with its name, search. Host `host/shortcuts.js` (`ShortcutsHost`, appended after `whatsnew.js`): `globalState["saturn.shortcuts"]`, `clean`, `send` / `set` (a change goes to every screen that asked), `open`; command `saturn.openShortcuts`, the sidebar's Keyboard shortcuts button (`KeyboardIcon`, `saturn:openShortcuts`); `fetchShortcuts` answered by the Workflows, Resources and Menus panels.
- Menus screen: the menus list folds away (« / », T by default, `listHidden` in its state). `hosttest-shortcuts.cjs` (10), `test41.mjs` (24), `harness/keys.html`.

### New in 0.3.52: T hides the left panel
- `src/App.tsx`: T toggles `layers` (beside N for the side panel; the canvas hints say so). `src-res/main.tsx`: T toggles `listHidden`, skipped while typing in an input, textarea, select or editable element. `test40.mjs` (7).

### New in 0.3.51: A resource's whole schema as JSON
- `src-res/main.tsx`: a "Schema JSON" button in the top bar (after Resource settings) → `viewRaw {title, text}` with `schemaJson(plan)`: the properties as the instance lists them, in the new order, deleted ones left out, new ones in, each as edited (`key` as typed). `test39.mjs` (4).

### New in 0.3.50: A map you can arrange
- `src/map.tsx`: left to right (Global actions at the left, the stages from there in rows of `STAGES_PER_ROW`, the commands under them). Boxes are draggable (`onNodesChange` / `onNodeDragStop`); their positions are kept per workflow by the host (`fetchMapLayout {workflowId}` → `mapLayout {workflowId, positions}`, `saveMapLayout {workflowId, positions | null}`, in `map-layouts.json` beside `drafts.json`; `cleanMapLayout` keeps only `{id: {x, y}}` with finite numbers). Reset layout forgets them.
- Node view: the layers panel can be hidden (« on it, Layers in the top bar, the » strip brings it back; kept in state as `layers`).
- Create steps: `forms.tsx` `fieldsFor` lists a step's settings the catalog doesn't name (`extraField`: a map gets the key / value editor). `paramsToData` (host) keeps such settings as stored and writes sent ones (JSON for an object or list) instead of refusing them; saving a Create step used to drop its `properties`. `hosttest-params.cjs` (6), `test38.mjs` (23).

### New in 0.3.49: The workflow map
- `src/map.tsx` (`WorkflowMap`): shown on the canvas while Workflow settings is open (`scope.kind === "workflow"`). React Flow, read-only nodes: a box per stage (rows per action, each row its own handle), Global actions, a node per command. Edges: stage moves (`mapOf`: an action's `property_updater` setting `STAGE_FIELD` (`status`) to a stage key), commands run (reference steps, by command id or name), and commands calling commands (a switch). A click lights an item's lines (`MapContext`, so nodes aren't rebuilt); two clicks within 400 ms open it (`openTree`). With an action picked, its arrows can be dragged to another stage (`onReconnect`) → `setStageTransition {workflowId, path, field, from, to}` in `host/extension.js` (one draft edit: `data.properties[field]` and the `_properties` row; refuses a stale `from`, an unknown stage, a step that isn't a Property Updater, a prototype field). `hosttest-map.cjs` (10), `test36.mjs` (28, on the real Application workflow: `harness/appflow.js`, `csp.html?app`).
- Node view: top bar Reload (`fetchWorkflows` + `fetchWorkflow`; off while there are unsaved changes), no "Node view" label; the breadcrumb is its own row (`.nv-crumbbar`, `goTo`); the side panel's » (`onCollapse`) and the « strip (`.nv-panel-open`). `layout.ts`: any parameter whose value is a JSON object (not code, lookups or merged) is one row per property (a Create step's `properties`).
- Resources screen: `.rs-crumbbar` (the trail with each step's property, this resource and the picked property; click to go back), Open raw JSON in Resource settings (`viewRaw {title, text}` → an untitled JSON tab; the record with the draft in it, `withDraft`), « / » folds the properties list (`listHidden`, kept in state), and a container query on `.rs-detail` folds the settings menu to its search under 720 px. `test37.mjs` (10).

### New in 0.3.48: Custom dropdown style
- `src-res/spec.ts` Display > Form: "Custom dropdown style" (`rendering._variances.form.use_custom_dropdown`) and "Dropdown option template" (`rendering._variances.form.custom_dropdown_template`, `code` / `html`, shown when it's on), from a real definition (Request For). Shown for a dropdown (`hasDropdown`: select input, map, lookup, dynamic source, or the setting stored). Switching it on fills in Saturn's starter template (`DROPDOWN_TEMPLATE`, via `alongside`). `harness/resmock.js` Deal gains Request For and Owner. `test35.mjs` (14).

### New in 0.3.47: Finding and dragging a section's properties
- `src-res/settings.tsx` `SectionProps`: the find-or-add box above a section's list (it narrows the list and offers the properties not in it; click or Enter adds, Esc clears), replacing the "Add a property…" dropdown under it. Rows drag to a new place (`draggable`, off while searching). `test34.mjs` (14); `test33.mjs` adds through the box.

### New in 0.3.46: Resource settings
- Resources screen: a "Resource settings" button (top bar, next to Reload) shows `src-res/settings.tsx` (`SettingsPage`) on the right: Description, Open records in a drawer (`drawer_enabled`, also written into `render_details`), and Sections (add, remove, reorder, name, description, `number_of_columns`, `placeInTab`, the ordered `properties`). Clicking a property goes back. Drafts per resource (`settingsWorks`) join the unsaved count, Discard and Save's queue.
- Host (`host/resources.js`): `settings {resource}` → `settings {resource, id, detail}` (the resource's ResourceDetail record, `GET /resourceDetails/<id>`) or `{resource, problem}` (none, or two); `saveSettings {resource, id, changes}` (only `sections`, `description`, `drawer_enabled`, checked) → re-read, back up to `<resource>-settings-<time>.json`, `PUT /resourceDetails/<id>` with only those keys, read back → `settingsSaved` / `settingsMismatch` / `saveFailed`. `hosttest-resettings.cjs` (19), `test33.mjs` (26).

### New in 0.3.45: Inline component code
- `src-res/spec.ts`: "Component code" (`rendering.options.code.value`, `code` / `html`), shown when `rendering.component` is `inline-component`, from a real definition (Application's Parties). A setting's new `alongside` writes what Saturn keeps next to it when that's missing: `type: "property"` beside the component code and the Currency renderer's currency (`src-res/editor.tsx` `set`). `harness/resmock.js` has a `Deal` resource with that property.
- Open in a file on the Resources screen: `lookups.openCode` → `openCode {resource, id, path, language, text}`; `ResourcePropertiesHost.openCode` writes `<globalStorage>/resource-code/<instance>/<resource>/<id>.<path>.<html|js>`, opens it beside, and on its save posts `codeFromFile {resource, id, path, text}`, which the screen puts in that property's draft (with `alongside`). Refuses `key` / `label` / `type` and prototype paths. `hosttest-rescode.cjs` (9), `test32.mjs` (16).

### New in 0.3.44: Find a setting finds more
- `src-res/editor.tsx`: the settings search (`matches`, `textOf`) also reads the setting's section heading, its group's title and its choices' labels (`options`). Several words: as a phrase when some setting has them together (`asPhrase`), else each word anywhere. `test31.mjs` (9).

### New in 0.3.43: What's new has its own page
- New screen `src-news/` (`main.tsx`, `news.css`; built to `dist/webview/news/index.js`): the release notes from `src/changelog.ts`, newest first, the newest open and marked Installed, with a search. Host side `host/whatsnew.js` (`WhatsNewHost.open`: one webview tab, revealed if open), appended after `resources.js`; command `saturn.openWhatsNew` ("Saturn: What's new"); the sidebar's What's new button (under AI Skills, `WhatsNewIcon`) posts `saturn:openWhatsNew`.
- The node view's Changes tab keeps only the unsaved changes. `hosttest-whatsnew.cjs` (8), `test30.mjs` (14), `harness/news.html`.

### New in 0.3.42: Copy or Move
- Layers panel (`src/outliner.tsx`): `land` decides where dragged items go. Into another list (any item from elsewhere) opens the Copy or Move box (`ask`, `.nv-ask`, Esc / Cancel / a click outside close it); `finish` sends `copyActions` / `moveActions` between action lists, or `actionToCommand` / `commandToAction` with `move`. Several all already in the target list move as a block with no box. Moving a command whose `usageCount` > 0 shows a warning.
- Host: `copyActions(definition, paths, stageIndex, index)` (copies with new ids and step ids, unused names; message `copyActions`); `copyItemsAs(…, move)` removes the originals afterwards (`removeItems`); the `actionToCommand` / `commandToAction` messages take `move`. `hosttest-items.cjs` (52), `test29.mjs` (13); `test22` / `test24` / `test28` click Copy or Move where the box now asks.

### New in 0.3.41: Move actions between stages
- Host: `moveActions(definition, paths, stageIndex, index)` (one draft edit): the picked actions out of their lists and into one list (a stage, or the global actions when `stageIndex` is null) before `index` (null: the end), in order; ids kept; a name taken there gets `_2` (`freeMachineName`); the drop point counts without the moved ones above it. Message `moveActions {workflowId, paths, stageIndex, index}`. `hosttest-items.cjs` (44).
- Layers panel: an action (or several picked) dragged onto another stage, Global actions or an action row there → `onMoveActions`; several picked within one stage move as a block. One action in its own list still uses `moveAction`. `test28.mjs` (15); `test24.mjs` no longer expects several to stay put.

### New in 0.3.40: Every resource links back to itself
- Menus screen: `ResourceChip` (`src-menus/tabsettings.tsx`, the Resources screen's `rs-chip` look) beside a tab's Resource, for one tab and for several sharing a resource; `Host.openResource` → `openResourceScreen {resource}`, which `MenusPanel.handle` now answers with `ResourcePropertiesHost.open`. `hosttest-menus.cjs` (2) checks it, and now runs in `package.sh` too.
- Node view (`src/forms.tsx`): a `resource` setting (a step parameter with `lookupKind: "resources"`) shows a chip (`.nv-res-open`) beside its picker when a resource is picked (not for a `{{ template }}`); `FormEnv.openResource` → `openResourceScreen`. `test27.mjs` (9).

### New in 0.3.39: Linked resources in Workflow settings
- `src/settings.tsx`: `LinkedSection` ("Linked resources", open, right after Workflow) lists `linkedResources(bindings, wfId)` (also used by the Hooks section: resources whose ResourceDetail names the workflow, or whose lifecycle hooks run its actions), one green button per resource with how it's linked. A click, or a resource name in Hooks, calls `ops.openResource` → `openResourceScreen {resource}` (the Form tab's message, so no host change). `test26.mjs` (9).

### New in 0.3.38: Property rows on the card, and colours
- `src/layout.ts` `operatorRows`: a parameter of type `object` (not code, a lookup or merged; the one the side panel edits with `KeyValueEditor`) whose value is a map with properties becomes one row per property (`entryRows`, `NvRow.entry`), up to `MAX_ENTRIES` (10), then a `more` row. A card with such rows isn't cut at `MAX_ROWS` (6).
- `src/nodes.tsx` `Row`: the value is highlighted (`highlight` from `controls.tsx`; `langOf`: code in its language, JSON when it starts with `{` or `[`, else `tpl`). `src/controls.tsx`: `tpl` also colours a value that is only a number or `true` / `false` / `null`. The token colours in `styles.css` apply to `.nv-row-v` too.
- `harness/mockhost.js`: `__reply(id)` sends the workflow again after a test changed `__defs`. `test25.mjs` (20).

### New in 0.3.37: Pick several, and make actions from commands
- Layers panel (`src/outliner.tsx`): `picked` (row keys; Ctrl/Cmd+click toggles, Shift+click a run of one kind, a plain click clears and opens). One drag code path (`dragProps`, `commandDrop`, `actionListDrop`) for: a stage or one action reordering in its list (several picked don't reorder); actions (every picked one of the dragged kind, in panel order) into Commands → `actionToCommand {paths, index}`; commands into a stage or Global actions → `commandToAction {paths, stageIndex, index}` (on the list: the end; on an action row: before it). Picked rows show `.is-picked`; the target shows a hint that counts them.
- Host (`host/extension.js`): `commandToAction` (label, `name` as the machine name made unused in that list, new id, the steps with fresh ids as `task`, non-empty `parameters` as `form`, no actors or access rules) and `copyItemsAs` (several, as ONE draft edit, in order from `index`). The two messages share one case; a missing selection now answers with `editFailed` (it used to send nothing). `hosttest-items.cjs` (31), `test24.mjs` (15).

### New in 0.3.36: Undo no longer gets stuck, and property names can be changed
- Host: `WorkflowsPanel.undoLastEdit` answered an undo of a draft edit with `workflow` / `draftState` but no `editSaved`, so the node view (which counts each request until it hears `editSaved` or `editFailed`) stayed on "Applying…". It now sends `editSaved {canUndo}`, or `editFailed` if the undo throws. The session-snapshot path sent `editSaved` twice (once from `applyEdit`); the extra one is gone. `hosttest-undo.cjs` (8), which fails on the old code.
- `src/forms.tsx` `KeyValueEditor`: each property's name is an input (`KvKey`, like `KvValue`): applied on Enter / blur, Esc puts it back; renamed in place with its value; an empty or doubled name is refused with a note. `test23.mjs` (12).

### New in 0.3.35: Make a command from an action, and Duplicate
- Layers panel (`src/outliner.tsx`): an action row dragged into Commands (the section, or a command row: before it) sends `actionToCommand {workflowId, path, index}`; the section is highlighted with a hint while dragging. The right-click menu of an action or command has Duplicate → `duplicateItem {workflowId, kind, path}`.
- Host (`host/extension.js`): both are one draft edit. `duplicateWorkflowItem` (copy right below, "<label> (copy)", machine name `<name>_copy` made unused in its list by `freeMachineName`, new id, steps copied with fresh ids through `cloneStep` + `stampStepIds`) and `actionToCommand` (a new command: label, machine name made unused among commands, new id, the task's steps with fresh ids as `command`, `form` as `parameters`; actors, access rules and other action-only settings aren't carried over; the action stays). `hosttest-items.cjs` (18), `test22.mjs` (16). (The existing `duplicateNode` message is a step's duplicate, so this one is `duplicateItem`.)

### New in 0.3.34: Pick id for Linked by
- `src-res/editor.tsx`: a `field` setting (one property of another resource) also lists `BUILT_IN` (`id`, `created_at`, `updated_at`) after the resource's own properties, unless it lists them itself. So a dynamic source's Linked by (`source_definition.bounded_property`) can be `id`. `test21.mjs` (7).

### New in 0.3.33: Access rules for properties
- The Access group's Access rules setting is a new kind, `{kind: "access"}` (`src-res/access.tsx`), in place of a JSON box. It reuses the Menus screen's rules editor, split out of `AccessBox` as `AccessRules` (`src-menus/access.tsx`), limited to User groups, Users and Permissions. Its styles moved from `menus.css` to `src-res/editor.css`.
- Stored as seen on a real definition: `access_control: {list: [{method, lable, icon, data: [{ref, access_details}]}]}`, and `{}` with no rules. Kept as they were: other keys, an id's `access_details`, and rules of other kinds (Custom Function). The lists come from the host's `subjects` message (Resources) or `listAccessSubjects` (Form tab). `test20.mjs` (16).

### New in 0.3.32: Every setting for several tabs
- Menus screen: with several tabs picked, `TabSettings` (`ManyTabs` in `src-menus/tabsettings.tsx`) shows every section but the caption. What it opens (kind and resource / page / dashboard) shows Mixed when they differ and a pick goes to all. Filter, Views and Columns show when all the picked tabs open the same resource: the filter is set on all; views and columns are edited on the first tab and copied to all, and when the tabs' views differ a button ("Give all of them …'s views") does that first. `test19.mjs` (14).

### Build fix after 0.3.31
- `package.sh` runs `npm install` when any package in `package.json` is missing, not only when `node_modules` is. After 0.3.30 added `@fortawesome/free-solid-svg-icons`, a `git pull` then `./package.sh` stopped with "Could not resolve"; now it installs it and goes on.

### New in 0.3.31: One icon picker everywhere
- The icon picker moved to `src-res/icons.tsx` (its styles into `src-res/editor.css`) and is shared: the Menus screen, and a new setting kind `{kind: "icon"}` in `src-res/spec.ts`, used by `propertyIcon` (Icon) and `tabIcon` (Tab icon). So the Resources screen and the node view's Form tab show the same button and popup. A value stored as `fa-name` keeps that form when another icon is picked. `test18.mjs` (10).

### New in 0.3.30: A new Menus screen
- The Menus screen is a new app, `src-menus/` (React, styled with the Resources screen's `src-res/editor.css` plus `src-menus/menus.css`), built into `dist/webview/menus/index.js` in place of the old bundle (removed from `vsix/`; it's in git history). The host side (`MenusPanel`) and its messages are unchanged, plus `openInSaturn` (`<instance url>/menus`).
- Three columns: menus (search, +, drag or Alt+↑/↓ to reorder, right-click: Copy id, Undo the last save, Discard its changes, Delete menu), the tab tree (fold with ←/→, drag before / after / into a tab, Alt+↑/↓, several picked, right-click: Duplicate, Add a sub-tab, Copy / Paste settings, Delete / Restore, + and × on each row), and the settings (the menu's label, icon and access at the top; the picked tabs below).
- `src-menus/model.ts`: the old screen's helpers in TypeScript; each problem now names the setting it's about (`field`), so it shows under that setting, and on its menu card and tab row. The tabs are edited as a tree of nodes with fixed ids (`treeOf` / `referencesOf`) that writes an untouched menu back exactly as it was read.
- Unsaved changes per menu (`works`), kept while the screen is hidden; Save confirms the list, sends `save` for each in turn, then `reorder`. The icon picker (`src-menus/icons.tsx`, Font Awesome 7.3.1 solid, now an npm dependency) is a popup with names on hover. The node view's workflow "Resources" section is called "Hooks". `hosttest-menus.cjs` (1), `test17.mjs` (54).

### New in 0.3.29: Open in Saturn
- Resources screen: an "Open in Saturn ↗" button next to Reload, once a resource is picked. It sends `openInSaturn {resource}`; the host opens `<instance url>/resources/<name>` in the browser (a name with `/`, `?` or `#` opens nothing). `hosttest-resources.cjs` (43 checks).
- Node view: an "Open in Saturn ↗" button in the top bar, which sends the existing `openWorkflow {workflowId}` (`<instance url>/workflows/<id>`). `test16.mjs` (4).

### New in 0.3.28: Lookup functions, and code settings in their own file
- `src-res/spec.ts`: with `lookup_type: "function"`, Lookup shows "Lookup function" (the code in `lookup_reference`, which is where Saturn keeps it) and "Item data type" (`lookup_function_item_data_type`; `string` is the only value seen so far, any other stored value is kept and shown). Both screens get it.
- `PropertyEditor`: a setting that changed but whose `when` is false is no longer forced into view when another setting at the same path shows (`sharedShown`), so Values / Reference / Lookup function don't all appear.
- Form / Parameters tab: an "Open in a file" button under each code setting (`lookups.openCode`, only on that tab). New Workflows panel message `openFieldCode {workflowId, ownerPath, formKey, key, path, language, text, workflowName, contextName}` opens the text as a file tied to the field (`openParamDocument`, node kind `fieldCode`); saving it runs `saveFieldCode`: one draft edit setting that path on the field (the action or command found again by its id if it moved; an error if the field is gone). Refuses `key` / `label` / `type` and prototype paths. `hosttest-formtab.cjs` (20 checks), `test15.mjs` (32).

### New in 0.3.27: A Form tab for actions, a Parameters tab for commands
- The side panel has a Form tab when an action is open, and a Parameters tab when a command is open (`src/formtab.tsx`). It uses the Resources screen's editor (`src-res/editor.tsx` with `noMenu`, `hints` and `lookups.noun`), styled by `src-res/editor.css` (now shared by both screens). The panel widens to two thirds of the window on it, with no resize handle and no shortcut bar.
- Everything from the Resources screen's property list carries over: several picked (Mixed), drag and Alt+↑/↓, + to add, the right-click menu (Duplicate, Copy / Paste settings, Copy key, Delete), the mapped chips. A field keeps a fixed id here, so it stays picked while its key is typed.
- New Workflows panel messages: `setFormFields {workflowId, ownerPath, formKey, fields, summary}` (the whole list as ONE draft edit; refuses missing or invalid keys, two fields with one key and prototype keys), `fetchSavedForm` → `savedForm {…, fields}` (from the draft's base, for "was …"), `fetchResourceFields {resource}` → `resourceFields`, `openResourceScreen {resource}` (`ResourcePropertiesHost.open(…, show)`: a new screen gets `show` in `init`, an open one a `show` message).
- The old Form / Parameters sections in Design are gone (with `src/fieldmore.tsx`). `hosttest-formtab.cjs` (12 checks), `test15.mjs` (28).

### New in 0.3.26: Resources: open the resource's workflows
- New Resources messages: `workflows {resource}` → `workflows {resource, workflows: [{id, name, via: "workflow" | "hook", hooks: ["after create", …]}]}`, read from `GET /resourceDetails` (`bindingsFromResourceDetails`: the ResourceDetail's `workflow.reference`, and the workflows its lifecycle hooks name) with names from `GET /Workflows`; `openWorkflow {workflowId}` → `WorkflowsPanel.showWorkflow`.
- `WorkflowsPanel.showWorkflow(extensionUri, storageUri, manager, instance, workflowId)` opens (or reveals) the Workflows panel and posts `showWorkflow {workflow: summary}` once its list has been sent (`pendingShow`, `listSent`, `postPendingShow`). The node view (`src/App.tsx`) turns that into the `sonover:openWorkflow` event, so the list view opens it as when switching.
- The screen shows the linked workflows as green buttons above the properties (`.rs-workflows`). `hosttest-resources.cjs` (41 checks), `test14.mjs` (35).

### New in 0.3.25: Resources: Show in instead of Hide in
- Visibility's "Hide in" switches are now "Show in" (`edit: {kind: "bool", invert: true}`): on when the stored `hideIn…` value isn't `true`; switching off stores `true`, on stores `false`, the same settings Saturn saves. "was on / off" follows the switch. `test14.mjs` (32).

### New in 0.3.24: Resources: one column of settings
- The two-column layout is gone: `.pe-flow` is one column of blocks at any width (the cards stretch to the page's width), with the same gap under every card. `test14.mjs` (29) checks it at 1900 px.

### New in 0.3.23: Resources: even gaps in two columns, core resources listed last
- The settings page is one flow of blocks (`.pe-flow`; a block is a card, the first of a group carries its heading). On a page 1150 px wide or more it uses CSS columns, so the cards run down the left column then the right, and every card has the same gap under it (the grid made each row as tall as its taller card). The menu now follows the first section in reading order that's still in view.
- `init` also sends `core`: which resources are Saturn's own, from `GET /resources/catalog` (`coreResourceNames`; null if the catalog can't be read). The picker shows two groups, Resources then Core resources. `hosttest-resources.cjs` (40 checks), `test14.mjs` (30).

### New in 0.3.22: Resources: several properties at once, a right-click menu, mapped chips
- Multi-select (Ctrl/Cmd+click, Shift+click; `selected` is a list). `PropertyEditor` takes `items: [{original, draft}]`: a setting with different values shows "Mixed" (switches in the middle, `aria-checked="mixed"`; selects show a Mixed entry), a change goes to every item, and settings marked `single` (label, key, description) are left out. Dragging a picked property or Alt+↑/↓ moves all picked ones as a block (`move(keys, to)`, `nudge`).
- Right-click menu (`.rs-menu`): Duplicate (below the original, `<key>_copy`, "(copy)" label), Copy settings / Paste settings (a box with a switch per group, all on but General; the key is never pasted; the copy is kept across resources), Copy key(s), Go to <resource>, Delete / Restore. Delete and Backspace in the list delete too. Deleted properties are crossed out until Save; the confirm names them and warns.
- `save` takes `removes: [key]`: the host leaves them out of the schema (`applyRemoves`), still the one whole-schema PUT, never a DELETE request; the backup keeps them.
- Mapped chips (`mappedOf`: a dynamic source's `source_definition.reference`, else `map.reference`): blue (`--rs-static`) for a map, purple (`--rs-dynamic`) for a dynamic source, on the chip and the card's bar; Required is a red star. A chip (also next to a Reference setting) opens that resource; the top bar shows the trail with ‹ Back, and Alt+← goes back to the property you came from.
- Unsaved changes are kept per resource (`works: {resource: {drafts, added, order, deleted}}`), so switching resources no longer waits for Save. Save's confirm lists every resource with changes; they're saved one at a time (a failure stops the rest). Older webview state is carried over.
- Sections sit in two columns once the page is 1150 px wide or more (a container query). `hosttest-resources.cjs` (39 checks), `test13.mjs` (61), `test14.mjs` (29).

### New in 0.3.21: Resources: change a property's key, every type, Visibility higher up
- General has a Key row (Saturn's "Field"), checked as you type (`edit.kind: "key"`: `KEY_PATTERN`, and not another property's key; a bad key disables Save). A property keeps a fixed id on screen (its key on the instance, or a new one's first key) and shows `shownKey`; new properties are kept as `{id, prop}`.
- `save` takes `renames: [{from, to}]`, applied last (`applyRenames`: the property keeps its place and settings; refuses a gone property, an invalid key, or two properties with one key). Workflows, views and other properties that name the old key aren't changed with it; the Key row says so.
- `TYPES` is every type Saturn's definitions use: string, number, boolean, date, array, object (another type a property has still shows as one more card). The Visibility group moved right after General. `hosttest-resources.cjs` (36 checks), `test13.mjs` (61).

### New in 0.3.20: Resources: one settings page with a side menu
- Three columns: the properties list, the settings menu (`.pe-menu`: Find a setting, the groups with change counts, each group's sections under it, JSON) and one long page (`.pe-page`) with every group. The menu scrolls the page to a section and highlights the section in view; the search narrows the page to matching settings.
- Rows like VS Code / Obsidian settings: name, description and "was … / Put back" on the left, the control on the right (big controls under the text). Sections are rounded cards.
- On/off settings are switches (`Switch`: a checkbox with `role="switch"`); the long property lists keep checkboxes. The property type is three cards (`Cards`: String, Number, Boolean; another type a property already has shows as a fourth card), as are Static / Dynamic and the new property form's type. No round radio buttons.
- Styled like the node view (its side panel's colours, inputs and buttons), not the VS Code theme. Save, Discard and the unsaved count moved to the top bar; Save's confirm shows under it. `test13.mjs` (57 checks).

### New in 0.3.19: Resources: every setting of a property, and new properties
- The right side of the Resources screen is now a full property editor (`src-res/editor.tsx`), drawn from a list of settings (`src-res/spec.ts`: each setting's path in the property, its control, and when it shows). Saturn's eight tabs are six groups here: General, Input, Data (Source + Lookup + Defaults), Display, Visibility, Access, plus JSON (the whole property). Settings show only when they apply; Find a setting searches all groups; a changed setting shows "was …" with Put back; tabs count their changes; "Undo all changes to it".
- The setting names come from real Saturn definitions (the Application schema). Settings Saturn's screens have whose stored names aren't known yet (property mask, validation rules, Is Password, Allow Custom Values, URL, the map's filter / search field / dropdown limit, label and lookup functions, colours, Access Control's shape, the other input types) are left out until a capture of Saturn's save shows them; the JSON tab edits anything meanwhile.
- **+** adds a property (label → key, type) with the settings Saturn's own app gives a new one (`newProperty`, in both `spec.ts` and `host/resources.js`).
- `save` now takes `changes: [{key, path, value | remove}]` (the old `{key, required}` still works), `adds: [{key, property}]` and `order`. The host applies each change at its path on the definition as just re-read (`applyChanges`; refuses `key` and prototype paths), adds new properties (`applyAdds`; refuses a taken or invalid key), and the read-back lets the instance add settings of its own to a new property. New messages: `fields {resource}` (another resource's properties) and `options {resource, value, label}` (records, e.g. attachment groups). `hosttest-resources.cjs` (33 checks), `test13.mjs` (52).

### New in 0.3.18: Resources: properties down the side, in order
- Layout like Saturn's stage / action editor: the properties down the left (`.rs-side`: search, cards with name, key, type, a blue grip when required, a dot when changed), the picked one on the right (`.rs-detail`: Required, the whole definition). Dragging a card (HTML drag and drop; off while searching) or Alt+↑ / Alt+↓ reorders; Reset order. The order is kept in webview state with the other unsaved changes.
- `save` takes `order` (every key, in the new order) besides `changes`; `applyOrder` reorders the definition (refused if the keys no longer match), the schema map is sent in that order, and the read-back also checks the order was kept. `hosttest-resources.cjs` (23 checks), `test13.mjs` (38) cover it.

### New in 0.3.17: Resources: saving the way Saturn does
- From Saturn's own app's network traffic: a resource is saved with `PUT /api/resources/<name>/schema` and the body `{"data": "<JSON text of {<property key>: <property without its key>, …}>"}` — the whole schema, as a map keyed by property, sent as a JSON string. `host/resources.js` now does exactly that (`schemaMap` turns GET's list back into the map); the method / shape guessing (OPTIONS, POST, the two bodies, remembered settings) is gone. Backup, read-back check and Restore stay. `hosttest-resources.cjs` (18 checks) models the real endpoint.

### New in 0.3.16: Resources: what the instance answered
- loanapp.saturn.gd took the save's POST (both shapes) but the resource stayed the same. A save that changes nothing now quotes the instance's answer to each attempt (300 characters each), and `createdRecordId` also recognises `{data: [{id}]}` and `{id}` replies.

### New in 0.3.15: Resources: saving the way the instance allows
- loanapp.saturn.gd's check: `OPTIONS /api/Resources/Application` allows `HEAD, GET, POST, DELETE` (no PUT), `/api/Resources` `HEAD, GET`, no MCP server. So a save now asks `OPTIONS` first and uses the first of PUT, PATCH, POST the address allows — never DELETE — and remembers the method that worked (`globalState` `sonover.resourceSaveMethod.<id>`; forgotten again on a 405). The backup, the two body shapes and the read-back check are as before; if nothing changed and the reply looks like a created record (`{data: {id}}`), it stops after that one write and names the record. `hosttest-resources.cjs` covers it (26 checks).

### New in 0.3.14: Resources: finding how to save
- A real instance answered the save's `PUT /Resources/<name>` with 405: that address takes no PUT. A refused save now names what the address allows (the response's `Allow` header), and the error offers **Check what it takes** (`probe` in `host/resources.js`): read-only — `OPTIONS` on `/Resources/<name>` and `/Resources`, and the instance's own MCP server (`POST /api/mcp`: `initialize`, `tools/list` only), listing tools about resources / schemas / properties — shown with Copy. Nothing is written. `hosttest-resources.cjs` and `test13.mjs` cover it.

### New in 0.3.13: Resources: required or not
- **Resources screen** (`src-res/`, host side `host/resources.js`, command `saturn.openResources`, sidebar entry "Resources", context menu on an instance): pick a resource, see its properties (label, key, type, required, the whole definition under Details) and tick Required on or off. Unsaved changes are kept in the webview's state; the resource can't be switched while some are unsaved.
- **Careful saving**: Saturn's API for changing a resource isn't documented, so Save confirms, re-reads the definition, backs it up (`<global storage>/resource-backups/<instance>/<resource>-<time>.json`, the Backups button opens the folder), PUTs `/Resources/<name>` with only the chosen `required` flags changed — first the `data` list alone, as workflows are saved, then, if the instance takes that but nothing changes, the whole `{type, data}` body once — remembers the shape that worked, and reads it back: a refusal changes nothing; any other difference is reported with Restore backup.
- **Fix**: `getResourceFields` read `GET /Resources/<name>`'s `data` only as a `{key: property}` map; Saturn sends a list of properties with their `key`s, which came out as 0, 1, 2…. It now reads both.
- Tests: `hosttest-resources.cjs` (the real host against a fake Saturn: both save shapes, refusal, unexpected change, restore), `test13.mjs` (the screen and the sidebar entry).

### New in 0.3.12: the sidebar is back
- **Missing webviews**: `.gitignore`'s `dist/` also matched `vsix/extension/dist/`, so the shipped webviews (sidebar, list view, menus, pages, agent, kanban, preview) and the MCP server were never committed. A build from a fresh clone packaged an extension without them: VSCodium's console showed `Webview.loadLocalResource` / 404 for `dist/webview/sidebar/index.js` and the sidebar was blank. The ignore rules are now root-only (`/dist/`, `/out/`) and the files are in the repo.
- **Build guard**: `build.mjs` refuses to build if any of those shipped files is missing from `vsix/extension/`.

### New in 0.3.11: built from its own source
- **Recovered host**: `host/extension.js` is the original 0.1.1 extension host, recovered from its build (formatted, key names readable, this project's changes built in); `build.mjs` builds the whole package from `host/` and `vsix/`, so `./package.sh` needs no input and `patch.py` is gone.
- **Startup failures are shown** (`activate` in `host/extension.js`): if starting throws, an error message says "Sonover Code could not start: …" (and the error is still logged), instead of the Sonover sidebar staying blank. `hosttest-activate.cjs` covers it (fails on 0.3.10).

### New in 0.3.10: readable log messages, nothing lost
- **Messages** (`src-logs/message.tsx`, shared by both screens): `parseMessage` splits a message into text and the JSON objects/arrays inside it (brackets in strings respected; each named after a `const x =` / `x:` before it), `summarize` gives a row's one-liner (`flow {36 keys} · store {1 key} · resource {33 keys}`), and `MessageView` shows each value pretty-printed and highlighted in its own collapsible block with Copy (more than three values start collapsed; Expand / Collapse all). The Logs tab's detail shows the message first and folds the whole record under "Whole record"; the System Logs screen's detail pane shows it above the other fields, and its table's message column uses the summary.
- **Edits are applied when you're done** (`src/forms.tsx`): the property map's empty name/value row is added when focus leaves the editor or the editor goes away (it used to need Enter or ＋, so collapsing Parameters lost it); a value without a name says it needs one. `PanelEditor` applies any field still being edited when it unmounts (section collapsed, another step picked, panel closed) — the same draft edit leaving the field makes.
- **Refused changes** from the side panel are also toasted ("Not applied: To is required"), since the fields they belong to may be closed by then. `test12.mjs` covers all of this (each check fails on 0.3.9).

### New in 0.3.9: only the newest 10 logs
- **Every read is the newest 10** (`NEWEST` in `syslogs-host.js`): the System Logs screen's `fetch` and the Logs tab's `fetchWorkflowLogs` both go through `SysLogs$.newest(manager, instance, resource, filter)`. The screen has no paging or page size any more (`fetchRange` is gone); the tab has no Load older / Search older, and in its fallback (filter refused) it keeps this workflow's among the instance's newest 10.
- **Sorted by the instance**: `newest` first asks for `?limit=10&page=1&sort=created_at DESC` (then `sort=-created_at`), the same GET `Sc` makes plus a sort, and keeps the result only if its dates really run newest first; the sort that worked is remembered per instance and resource. Otherwise it reads the list as it comes (an oldest-first list from its end, in pages of 10). Replies carry `ordered`; when it's false (the instance lists logs in some other order, such as by id) both screens say these may not be the newest.
- **Live** was hard to see working: it waited a full interval before its first check and showed nothing when there was nothing new, and on an instance that doesn't list logs by date the "newest" page never changed. It now checks as soon as it's turned on and shows "checked N s ago"; with the instance sorting by date, new logs appear on top.
- The Logs tab's Refresh tries the workflow filter again instead of staying in the fallback.

### New in 0.3.8: Logs tab, matched exactly
Built on a real SystemLog record: it has `log_type`, `name` (the step's title), `message`, `trace`, `file`, `created_at`, `task` (the step that wrote it, as JSON text with its `id`) and `workflow` (a copy of the whole workflow definition, with `id` and `name`), plus `_permissions_` / `field_restrictions`.
- **Server filter first**: the tab sends `filter: workflow.id = "<id>"` (Saturn's filter language, as menu tabs use: `field = "value"`, `AND`, `IN [...]`, dotted paths). If the instance refuses it (`workflowLogsFailed`) or returns nothing about the workflow, the tab falls back to reading the newest records and matching them itself. "Load older" pages through the filtered list.
- **Steps by id**: patch #2 now also puts each operator step's `id` on the view model as `stepId`. "This step" keeps records whose `task.id` is that step; "This action" keeps the steps the action runs, including those of commands it calls. Name matching (for records without a task id) skips the record's `workflow` copy, which names every action and step.
- **Rows** say which action and step wrote them (`Approve order · Send Email`); an error's `trace` is shown above its JSON.
- **Trimmed records**: `SysLogs$.trim` keeps only the workflow copy's `id` and `name` and drops the permission lists before records reach the webview.
- **Open in System Logs** passes the filter, and the System Logs screen applies it (`init.filter`, or `search {text, filter}`); its table shows objects by name and a `task` as `operator · id` (`cellText`).

### New in 0.3.7: back online
- The node view handles the host's `connectionRestored` `{synced}` message (sent after it reconnects and replays queued offline edits) with a toast: the host's summary, or "Back online". It used to be ignored, so going back online was silent in the node view. Checked in `test12.mjs`.
- `SysLogs$.targetOf` uses the Workflows panel's own `manager` / `instance` fields (their names in 0.1.1) first, and only falls back to finding them by shape.

### New in 0.3.6: property map fixes
- The key/value editor for object parameters (`KeyValueEditor` in `src/forms.tsx`, e.g. Resource Property Updater's properties) shows its inputs for an empty map (`{}`) instead of falling back to the raw JSON box; only values that aren't a plain object use the JSON box.
- Removing the last row saves `{}`. It used to send an empty value, which the host skips, so the old map stayed. `harness/mockhost.js` now mirrors that host behaviour; `test12.mjs` covers both.

### New in 0.3.5: Logs tab
- **Where**: a **Logs** tab in the node view's side panel (Design · Inspect · Logs · Changes), `src/logs.tsx`.
- **What**: the System Logs records about the open workflow, newest first. A record belongs to the workflow when a field whose key mentions "workflow" (at any depth, e.g. `workflow`, `workflow_id`, `context.workflow.name`) holds the workflow's id or name, or when the workflow's id (8+ characters) appears anywhere in it. Scope chips narrow it to the open action/command (`action`/`command`/`task` keys) or the selected step (`operator`/`step` keys). Level chips, search, Live (every 10 s, new rows flash), a JSON detail with Copy / Open as JSON, **Go to <action>**, and **Open in System Logs** (the full screen, searched for the workflow).
- **Reading**: the host reads the newest records in windows of 200 (oldest-first lists are read from the end); the tab keeps going back until 25 match or 1,000 more records have been read, then offers **Search older**. Matching helpers are shared with the System Logs screen (`src-logs/records.ts`).
- **Read-only**, like the System Logs screen: only the record-reading helper (`Sc`) is called.

Extension changes (`patch.py`, #12): the Workflows panel answers `fetchWorkflowLogs` `{reqId, workflowId, offset, window}` → `workflowLogs` `{reqId, workflowId, resource, instanceName, records, total, scanned, done}` (or `workflowLogsFailed`), plus `openSystemLogs` `{search?}`, `openLogJson` and `copyLogJson` `{record}` — all handled by `SysLogs$.fromWorkflows` in `syslogs-host.js`, which finds the panel's instance by shape. The `saturn.openSystemLogs` registration now also hands the instance manager and global state to `SysLogs$.attach`. The System Logs screen takes an optional `search` (in `init`, or a `search` message when it is already open).

### New in 0.3.4: System Logs
- **Where**: a "System Logs" item on each instance card in the Sonover sidebar (beside Workflows, Menus, Pages, Components), "Saturn: Open System Logs" on the instance's context menu in the Components tree, and in the command palette.
- **What** (`src-logs/`, bundled to `dist/webview/logs/index.js`): the records of the System Logs core resource, newest first in full pages (an oldest-first list is read from the end, stitching two pages when needed), with paging, page size, Live refresh every 5 s (new rows flash), level chips, search across the page, the instance's server filter, a column picker, and a detail pane with highlighted JSON, Copy JSON and Open as JSON (an untitled editor).
- **Which resource**: the `saturn.systemLogResource` setting if set; else the one picked in the screen (remembered per instance); else the resource named "System Log(s)". The picker lists log-like resources first, then all.
- **Read-only**: the host side (`syslogs-host.js`, appended to `extension.js`) only calls the extension's record-reading helpers (`Sc`, `Ln`, `dn`, `xc`) — every request is a GET.

### New in 0.3.3
- **Node view first**: the Workflows screen opens in the node view (with the workflow picker when none is open); List view is one click away.
- **Vertical flow by default** (`layout.ts`, `LayoutDir`): steps run top to bottom, If branches and parallel branches side by side, sockets on top/bottom. The ↕/↔ button switches direction; remembered.
- **Shift+click multi-select**: Shift (or Ctrl/⌘)+click adds/removes steps. Right-click inside the selection, the side panel ("N steps selected") and the keys X, M, Shift+D, Ctrl+C act on all of them. A step inside a selected container isn't counted twice.
- **Stage guides**: a VS Code-style guide line runs down each stage's actions (in the stage colour when one of its actions is open) and a divider separates stages.
- **Changes tab** in the side panel: the workflow's unsaved edits, newest first, with Undo / Save / Discard, and release notes (`src/changelog.ts`).

Extension changes (`patch.py`): `bulkSteps` `{op: "delete"|"duplicate"|"mock", paths, mock?}` applies to all paths as ONE draft edit (last path first so earlier paths stay valid; any stale path refuses the whole change); `copyNodes` `{paths}` puts several steps on the shared clipboard in document order.

### New in 0.3.2
- **Syntax-highlighted inputs** (`src/controls.tsx`, Prism): every text box in the side panel is highlighted. A transparent native input/textarea sits under a highlighted copy with the same metrics, so typing, selection, undo, IME and Enter/Esc behave as before. Grammars: `{{ templates }}` (everywhere, including inside code and JSON), JSON for arrays/objects, JavaScript/HTML/CSS for code params by language, and cron for schedule triggers. Tab indents in code boxes.
- **Figma-style scrubbing**: hold a numeric field's label and drag sideways (Shift ×10, Alt fine); one draft edit on release. Arrow keys step too. Applies to delay (50 ms steps, shown as s/min/h), loop/parallel concurrency, numeric operator params (by type or name: retries, timeout, limit, count…), trigger numbers, and form-field layout numbers. Turned off when the value is a template.
- **Date and time pickers**: params whose type, input type or name says date/date-time/time (`_at`, `date`, `deadline`, `timestamp`, `_on`, `time`…) get a calendar (Monday-first, today marked, time row in local time with your time zone) plus a **Now**/**Today** button and **Clear**. Dates are written as `YYYY-MM-DD`, date-times as ISO (UTC), times as `HH:mm`. The box still takes templates. Trigger params too.
- **Colour pickers**: colour params (type/input type `color`, or a colour-ish name) and stage colours get a picker — saturation/brightness area, hue, hex, swatches, and the browser eyedropper where available.
- **Every form-field setting** (`src/fieldmore.tsx`): editing a form field or command parameter shows all its other settings, each applied as its own draft edit — validation (unique, searchable, email, IP), visibility (hide everywhere / table / form / view / drawer, own tab), layout (table column width, view/form columns and full width, view span), read/write defaults, input type and template, lookup & map (source, lookup type, map type/reference/value/label fields, label type, label function in a JS editor), rendering (component, size, shape, opacity), meta tags, required columns, default view — plus the whole field as JSON (Apply JSON sets and removes settings; key/label/type stay with the checked editor above).

### Changes to the extension in 0.3.2 (then applied by `patch.py`; now in `host/extension.js`)
New in 0.3.2:
- the form-field view model (`go`) carries the stored field as `raw`
- a `setFormFieldProps` message `{ownerPath, formKey, key, changes:[{path, value?, remove?}]}` that copies along each path (nothing is mutated) and refuses `key`/`label`/`type` and prototype paths

Unchanged: getHtml script tag, `mock` in the view model, `setStepMock`, the move fix in `on()`, the Disabled badge in the list view, and the `sonover:openWorkflow` hook.

Up to 0.3.10 the extension was produced by patching the original `.vsix` with `patch.py`; from the recovery on, everything is source in this repo (see git history for the old patch kit).
