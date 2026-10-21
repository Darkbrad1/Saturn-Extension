/** Release notes shown in the side panel's Changes tab (newest first). */
export const CHANGELOG: { version: string; title: string; items: string[] }[] = [
  {
    version: "0.3.38",
    title: "Property rows on the card, and colours",
    items: [
      "A step's property map (like Property Updater's properties) now shows on its card as one row per property: the name in grey, the value in its box, like Write Store Value. Up to 10 show; more say \"+N more properties\".",
      "Every value on the cards is coloured: {{ templates }}, JSON, numbers, true / false / null, and code in its own language. In the side panel a value that is just a number or true / false is coloured too.",
    ],
  },
  {
    version: "0.3.37",
    title: "Pick several, and make actions from commands",
    items: [
      "In the layers panel, Ctrl/Cmd+click picks several actions or commands, and Shift+click picks a run of them. A plain click goes back to one.",
      "Drag one of the picked actions into Commands to make a command from each. Drag commands into a stage or Global actions to make an action from each: dropped on the stage or the heading they go at the end, dropped on an action they go before it.",
      "As before, the originals stay where they were. An action made from a command gets its steps and its parameters as the form, with no actors or access rules yet.",
    ],
  },
  {
    version: "0.3.36",
    title: "Undo no longer gets stuck, and property names can be changed",
    items: [
      "Fixed: after Undo the top bar could stay on \"Applying…\" for good. Undo now always finishes.",
      "A property map (like Property Updater's properties) lets you change a property's name, not only its value. Click it, type, and press Enter or click away. A name that's empty or already in the list is put back, with a note saying why.",
    ],
  },
  {
    version: "0.3.35",
    title: "Make a command from an action, and Duplicate",
    items: [
      "In the layers panel, drag an action (from a stage or from Global actions) into Commands to make a command from it. It gets the action's steps, and the action's form becomes its parameters. The action stays where it was. Drop it on a command to put the new one before it.",
      "Actions and commands now have Duplicate in their right-click menu. The copy goes right below, named \"… (copy)\", with its own id and steps.",
    ],
  },
  {
    version: "0.3.34",
    title: "Pick id for Linked by",
    items: ["Settings that pick a property of another resource (a dynamic source's Linked by and Value field, a map's fields) now also offer id, created_at and updated_at. Every record has them, but its resource doesn't list them, so they were missing."],
  },
  {
    version: "0.3.33",
    title: "Access rules for properties",
    items: [
      "A property's Access rules (on the Resources screen and on the node view's Form tab) are no longer a text box. They work like the node view's and the Menus screen's: a switch for User groups, Users and Permissions, and a list to tick, with a search.",
      "They are saved the way Saturn stores them. Rules this screen can't build yet (a Custom Function) are listed and kept as they are.",
    ],
  },
  {
    version: "0.3.32",
    title: "Every setting for several tabs",
    items: [
      "On the Menus screen, picking several tabs now shows all their settings, not only Look and Behaviour. A change goes to all of them; a setting they don't share shows Mixed. Each tab's caption is still changed one at a time.",
      "What it opens can be set for all of them at once. Filter, Views and Columns show when the picked tabs open the same resource.",
      "If the picked tabs have different views, a button gives them all the first tab's views, so you can then change them together.",
    ],
  },
  {
    version: "0.3.31",
    title: "One icon picker everywhere",
    items: ["A property's Icon and Tab icon, on the Resources screen and on the node view's Form tab, now use the Menus screen's icon picker: a button that opens a popup with a search, and the icon's name when you hover it."],
  },
  {
    version: "0.3.30",
    title: "A new Menus screen",
    items: [
      "The Menus screen is rebuilt in the Resources screen's style, the full width of the view, in three columns: the menus, the picked menu's tabs, and the settings.",
      "Tabs fold open and closed to show their sub-tabs. Drag them to reorder, onto a tab to make them its sub-tab, or out again. Alt+↑/↓ moves the picked ones; ←/→ folds; Delete crosses them out until Save.",
      "Pick several tabs with Ctrl/Cmd or Shift+click: a change goes to all of them. Right-click a tab to duplicate it, copy or paste its settings, add a sub-tab or delete it.",
      "The menu's label, icon and who can see it are always at the top of the settings; the picked tab's settings are below.",
      "Problems show beside what they're about: a red or yellow mark on the menu or tab, and the message under the setting.",
      "The icon picker opens as a popup; hover an icon to see its name.",
      "Each menu keeps its own unsaved changes. Save lists them all, then saves them one after another, and the new order last.",
      "Open in Saturn opens Saturn's menus page. In the node view, the workflow's lifecycle hooks section is now called Hooks.",
    ],
  },
  {
    version: "0.3.29",
    title: "Open in Saturn",
    items: [
      "The Resources screen has an Open in Saturn button next to Reload: it opens the resource you picked in Saturn, in your browser.",
      "The node view has one in its top bar: it opens the workflow you have open in Saturn.",
    ],
  },
  {
    version: "0.3.28",
    title: "Lookup functions, and code settings in their own file",
    items: [
      "A field (or resource property) whose lookup source is Function now shows its lookup function and its item data type, the way Saturn stores them.",
      "On the Form and Parameters tabs, every code setting (the lookup function, the label function, the HTML template, …) has an Open in a file button, like the code step. Saving the file writes it back into the workflow's draft.",
      "Fixed: changing one of the settings that share a stored place (Values, Reference and Lookup function) no longer brings up the other two.",
    ],
  },
  {
    version: "0.3.27",
    title: "A Form tab for actions, a Parameters tab for commands",
    items: [
      "An action's form now has its own tab in the side panel (Form), and a command's parameters too (Parameters). The panel gets wider while it's open.",
      "It works like the Resources screen: the fields down the left, the picked ones' settings on the right, with the same switches, type cards, Show in and JSON. There's no settings menu, just the one long page.",
      "Pick several with Ctrl/Cmd or Shift+click: a change goes to all of them, and a setting they don't share shows Mixed. Drag or Alt+↑/↓ to reorder, + to add a field, Delete to remove one.",
      "Right-click a field: Duplicate, Copy settings, Paste settings, Copy key, Delete. A mapped field's chip opens that resource on the Resources screen.",
      "Changes go into the workflow's draft a moment after you stop (or when you leave the tab), like every other edit: undo, Save and Discard work as before. \"was …\" shows the value the saved workflow has.",
      "The Design tab no longer lists the form's fields; it points to the new tab.",
    ],
  },
  {
    version: "0.3.26",
    title: "Resources: open the resource's workflows",
    items: [
      "Above a resource's properties, a green button for each workflow linked to it: its own workflow, and any workflow its lifecycle hooks run (hover to see when). Click it to open that workflow on the Workflows screen.",
    ],
  },
  {
    version: "0.3.25",
    title: "Resources: Show in instead of Hide in",
    items: ["Visibility's Hide in is now Show in: a switch that's on means the property shows there. Saturn still stores it as its hide setting, so nothing about how it's saved changed."],
  },
  {
    version: "0.3.24",
    title: "Resources: one column of settings",
    items: ["The settings are one column again on every screen size, as wide as the page, with the same gap under every card."],
  },
  {
    version: "0.3.23",
    title: "Resources: even gaps in two columns, core resources listed last",
    items: [
      "On a wide page the setting cards run down two columns, like a newspaper, so the gap under every card is the same. Before, a short card next to a tall one left a big hole.",
      "The resource picker lists the instance's own resources first and Saturn's core resources after them, in two groups.",
    ],
  },
  {
    version: "0.3.22",
    title: "Resources: several properties at once, a right-click menu, mapped chips",
    items: [
      "Pick several properties with Ctrl/Cmd+click or Shift+click. A change goes to all of them; a setting they don't share shows as Mixed. Label, key and description are left out then.",
      "Drag one of the picked properties (or Alt+↑/↓) and they all move together.",
      "Right-click a property: Duplicate, Copy settings, Paste settings (pick which groups), Copy key, Go to the mapped resource, Delete or Restore. A deleted property is crossed out until you save, and the confirm names it.",
      "A mapped property shows a chip with its resource: blue for a map, purple for a dynamic source. The chip opens that resource; Back (or Alt+←) brings you back to where you were. Required is now a red star.",
      "Each resource keeps its own unsaved changes, so you can move between them. Save saves every resource with changes, one after the other, each with its backup and check.",
      "On a wide screen the sections sit side by side in two columns.",
    ],
  },
  {
    version: "0.3.21",
    title: "Resources: change a property's key, every type, Visibility higher up",
    items: [
      "General has the property's Key (Saturn's Field) under its Label, and both can be changed. A key that isn't valid, or that another property has, is flagged and stops Save.",
      "The type cards are every type: String, Number, Boolean, Date, Array and Object.",
      "Visibility now comes right after General, in the menu and on the page.",
    ],
  },
  {
    version: "0.3.20",
    title: "Resources: one settings page with a side menu",
    items: [
      "Three columns: the properties, a menu of the settings groups and their sections, and one long page with every setting, like VS Code's settings. The menu jumps to a section and follows as you scroll; its search narrows the page.",
      "Each setting is a row: its name and description on the left, its control on the right. Sections are cards.",
      "On/off settings are switches. The type is three cards (String, Number, Boolean), and so are Static and Dynamic: the chosen card is outlined.",
      "The screen now looks like the node view. Save, Discard and the unsaved count are in the top bar, next to Backups.",
    ],
  },
  {
    version: "0.3.19",
    title: "Resources: every setting of a property, and new properties",
    items: [
      "The property you pick shows all its settings, in six groups: General, Input, Data (where its value and choices come from, and its defaults), Display, Visibility and Access, plus the whole property as JSON. A setting only shows when it does something.",
      "Find a setting searches every group. A changed setting shows what it was, with Put back; each group's tab counts its changes.",
      "Settings that name another resource (a map's reference, a dynamic source) list that resource's properties to pick from.",
      "+ adds a property: give it a label (the key is made from it) and a type. It gets the settings Saturn gives a new property, and is saved with the rest.",
      "Saving changes only the settings you changed, on the definition as the instance has it at that moment, with the same backup and check as before.",
    ],
  },
  {
    version: "0.3.18",
    title: "Resources: properties down the side, in order",
    items: [
      "The Resources screen lists a resource's properties down the left, in the schema's order — name, key and type — with a search; the one you pick shows on the right.",
      "Drag a property (or Alt+↑ / Alt+↓) to change its place in the schema; Reset order puts it back. The new order is saved with the same backup and check, which also makes sure the instance kept it.",
    ],
  },
  {
    version: "0.3.17",
    title: "Resources: saving the way Saturn does",
    items: [
      "Saving a resource now makes the same request Saturn's own app makes: the whole schema, with only the Required changes, to the resource's schema address.",
      "The backup before saving, the check after it and Restore backup are as before; the guessing of other ways to save is gone.",
    ],
  },
  {
    version: "0.3.16",
    title: "Resources: what the instance answered",
    items: [
      "When a save is taken but changes nothing, the message shows what the instance answered to each attempt.",
      "A reply that looks like a newly created record is recognised in more shapes.",
    ],
  },
  {
    version: "0.3.15",
    title: "Resources: saving the way the instance allows",
    items: [
      "Saving a resource uses the method the instance allows for it (PUT, PATCH or POST, never DELETE), and remembers the one that worked.",
      "If the instance answers as if it made a new record instead, the save stops at once and says which record.",
    ],
  },
  {
    version: "0.3.14",
    title: "Resources: finding how to save",
    items: [
      "When an instance refuses a resource change, the message says which methods it does take there.",
      "Check what it takes: a read-only look at what the instance accepts for resources — the methods each address allows, and the instance's own MCP tools about resources — with Copy, to find its real way of saving.",
    ],
  },
  {
    version: "0.3.13",
    title: "Resources: required or not",
    items: [
      "A new Resources screen (sidebar → Resources): pick a resource, see its properties — label, key, type — and tick whether each is required.",
      "Changes are kept until you save or discard them; Save asks first, backs up the resource's definition, and checks the instance has exactly the change afterwards — with Restore backup if anything else changed.",
      "Field pickers read a resource's properties by their real keys (they showed 0, 1, 2… on instances that send properties as a list).",
    ],
  },
  {
    version: "0.3.12",
    title: "The sidebar is back",
    items: [
      "The Sonover sidebar, Workflows list view, Menus, Pages, Agent Chat, Tickets and preview screens were missing from 0.3.10 and 0.3.11 when built from a fresh copy of the project, which left the sidebar blank. They're included again.",
      "Building now stops with a clear message if any of those files are missing.",
    ],
  },
  {
    version: "0.3.11",
    title: "Built from its own source",
    items: [
      "The whole extension is now built from this project: the original extension's lost code was recovered, so it no longer needs the 0.1.1 package to build.",
      "If Sonover Code can't start, it says why in an error message instead of leaving its sidebar blank.",
    ],
  },
  {
    version: "0.3.10",
    title: "Readable log messages, nothing lost",
    items: [
      "Log messages are formatted: JSON inside them (like a Debug step's flow, store and resource) is pretty-printed and highlighted, one block per value, each with Copy. Rows sum a message up by its values.",
      "The message comes first in a log's detail; the whole record is folded away below it.",
      "A property typed into a property map is added when you're done with it — leaving the editor, collapsing the section or picking another step — not only on Enter or ＋.",
      "Any setting still being edited is applied when its editor closes, and a change that's refused is shown as a toast as well as next to the field.",
    ],
  },
  {
    version: "0.3.9",
    title: "Only the newest 10 logs",
    items: [
      "The System Logs screen and the Logs tab only ever read the newest 10 logs: no paging, no page size.",
      "They ask the instance to sort logs by date; if it doesn't list them in date order, they say these may not be the newest.",
      "Live checks as soon as it's turned on, and shows when it last checked.",
      "Refresh in the Logs tab tries the workflow filter again.",
    ],
  },
  {
    version: "0.3.8",
    title: "Logs tab, matched exactly",
    items: [
      "The Logs tab asks the instance for this workflow's logs (workflow.id), so older logs are found too; if the instance doesn't take the filter it reads and matches the newest ones as before.",
      "This action and This step go by the step that wrote each log, so a log only counts for its own step — and for every action that runs it through a command.",
      "Each log says which action and step wrote it; errors show their trace.",
      "Logs are lighter: their copy of the whole workflow is left out of the tab.",
      "Open in System Logs opens the screen already filtered to the workflow.",
    ],
  },
  {
    version: "0.3.7",
    title: "Back online",
    items: [
      "When the instance is reachable again, the node view says so, and what offline work was sent to it.",
      "The Logs tab finds the workflow's instance directly instead of searching for it.",
    ],
  },
  {
    version: "0.3.6",
    title: "Property map fixes",
    items: [
      "A Resource Property Updater with no properties shows the Resource Property / Property Value inputs instead of a raw {} box.",
      "Removing the last property now empties the map (it used to stay).",
    ],
  },
  {
    version: "0.3.5",
    title: "Logs tab",
    items: [
      "New Logs tab in the side panel: the System Logs records about the open workflow, newest first, matched by the workflow's id or name.",
      "Narrow it to the open action or command, or to the selected step; filter by level or search; Live checks for new logs every 10 s.",
      "Open a log to see its JSON (Copy / Open as JSON), jump to the action it's about, or open the full System Logs screen searched for this workflow.",
      "Quiet workflows: it keeps reading further back until it finds their logs; Search older goes back more.",
    ],
  },
  {
    version: "0.3.4",
    title: "System Logs",
    items: [
      "New System Logs screen, opened from the instance card in the Sonover sidebar (next to Workflows, Menus, Pages, Components), the instance's right-click menu, or \"Saturn: Open System Logs\".",
      "Lists the System Logs core resource's records newest first, in full pages, with paging, Live refresh, level chips, search, a server filter, column picker and a detail pane (Copy / Open as JSON).",
      "Read-only: it only reads records; nothing in it can change a log.",
    ],
  },
  {
    version: "0.3.3",
    title: "Multi-select, vertical flow, node view first",
    items: [
      "Shift+click steps to select several; the right-click menu, the side panel and the keys (X, M, Shift+D, Ctrl+C) act on all of them, as a single undoable change.",
      "Flows run top to bottom by default. The ↕ / ↔ button in the top bar switches direction (remembered).",
      "The node view opens first; List view is one click away in the top bar.",
      "Stages in the layers panel have a guide line down their actions and a divider between stages.",
      "This Changes tab: unsaved edits for the workflow (newest first, with Undo / Save / Discard) and these release notes.",
    ],
  },
  {
    version: "0.3.2",
    title: "Smarter inputs, every form-field setting",
    items: [
      "Syntax highlighting in every side-panel input: {{ templates }}, JSON, JavaScript, HTML, CSS and cron.",
      "Figma-style scrubbing: hold a number field's label and drag sideways (Shift ×10, Alt fine); arrow keys step too.",
      "Date and time pickers with Now / Today / Clear; colour pickers with hue, hex, swatches and eyedropper.",
      "Form fields and command parameters expose all their settings (validation, visibility, layout, defaults, input, lookup & map, rendering, tags, JSON).",
    ],
  },
  {
    version: "0.3.1",
    title: "Find your way around",
    items: [
      "Stages open and close like folders in the layers panel.",
      "Search ( / ) finds stages, actions, commands and the steps inside them — e.g. every action using the debug operator.",
      "Commands are listed in the Add menu like operators.",
    ],
  },
  {
    version: "0.3.0",
    title: "Everything the list view does",
    items: [
      "Switch, create and delete workflows; stage colours and machine names; reorder stages and actions.",
      "Action access and form fields, command parameters and usages, triggers and resource hooks.",
      "Copy and paste shared with the list view; the full parameter editors.",
    ],
  },
  {
    version: "0.2.x",
    title: "Building in the node view",
    items: [
      "Edit in the Figma-style, resizable side panel; code opens in an editor and emails with their preview.",
      "Disabled steps (\"mock\": true) shown and toggled in both views.",
      "Create stages, actions and commands; empty branches have slots and every wire a + button.",
    ],
  },
];
