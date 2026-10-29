/** Release notes, newest first, shown on the What's new page (src-news/); the newest sets the packaged version. */
export const CHANGELOG: { version: string; title: string; items: string[] }[] = [
  {
    version: "0.3.69",
    title: "Create and Property Updater like Saturn's forms, a Notion-like rich text editor, cards you can move and resize",
    items: [
      "A Create or Property Updater step now shows one Resource setting and then the properties it sets, each with the control its input type calls for: a text box, a rich text editor, a record picker (showing the picked record's name), a list of choices, true / false, or a date.",
      "Each property has ⇋ (type a value or a {{ template }} instead) and × (take it out). Only the properties with a value are listed; + Add a property offers the resource's other properties by name. A property left empty isn't saved.",
      "Property Updater: leaving Resource empty means the record the workflow runs on, as in Saturn.",
      "Rich text is edited like Notion: no toolbar until you pick some text, then a small bar above it (headings, bold, italic, underline, strike, link, colour and highlight, align, indent, clear). Type / for blocks (headings, lists, quote, code, table, image) or Markdown like \"# \" and \"- \". It saves the same HTML Saturn's editor does.",
      "The side panel widens for these steps, like on the Form tab, and can be resized.",
      "Cards on the canvas can be moved: let go away from a wire and a card stays where you put it. Pick a card and drag its right edge to make it wider or narrower. Both are kept on this computer, and Reset layout (top right of the canvas) puts every card back.",
      "Fixed: keys typed in a rich text box no longer reach the canvas's shortcuts (X used to delete the step).",
    ],
  },
  {
    version: "0.3.68",
    title: "Settings that show only when they matter",
    items: [
      "Some step settings only matter after another choice, and now they only show then, like in Saturn's own form. For example, Create Task's Completion Property and Completion Value appear when Completion Indicator is record_update, and Completion Action when it is workflow_action.",
      "This works in the side panel and in the Add form, and changes as soon as you pick another choice.",
      "A setting that gets hidden keeps its value, so switching back shows it again as it was.",
    ],
  },
  {
    version: "0.3.67",
    title: "Create cards named after their resource, a resizable Form tab",
    items: [
      "A Create step's card is titled with the resource it creates (for example DocumentRequest) instead of Create. When the resource is a {{ template }}, it still says Create.",
      "The Form / Parameters tab can be resized: drag its left edge. It starts at two thirds of the window, keeps the width you drag it to (separately from the other tabs), and double-clicking the edge puts it back.",
    ],
  },
  {
    version: "0.3.66",
    title: "What Saturn says about each operator",
    items: [
      "Pick a step and the side panel shows Saturn's description of its operator, under its name. The same description is the tooltip on each item in the Add menu (Shift+A).",
      "A new Output section in the side panel says what the step hands to the next one (its _flow), with each field Saturn lists, for example a created task's id and status.",
      "Operators Saturn has switched off (like Save Locally) are no longer offered in the Add menu. A step that already uses one still shows and works.",
      "Settings that point at a record, like Create Task's Person or Invoke Agent's Agent, are a record picker: type to search the records and click one, or type a value or {{ template }}. The picked record's name shows under the box. This works in the Add form too.",
    ],
  },
  {
    version: "0.3.65",
    title: "Saturn's operator list",
    items: [
      "The node view's top bar has Operators JSON, right after Workflow JSON: every operator your instance offers, with its settings, exactly as Saturn lists them, in a read-only tab beside the canvas.",
      "When the instance can't be reached, it shows the copy the extension keeps for working offline, and says so.",
    ],
  },
  {
    version: "0.3.64",
    title: "The switch step",
    items: [
      "Workflows with a switch step (it checks a value, like {{ _store.who }}, and runs the first case that matches, or Otherwise) now show it on the canvas: one column per case, side by side like an If's True and False, with Otherwise last.",
      "Pick a switch to change the value it checks, and its cases in the side panel: rename a case, add one, move it up or down, or remove it with its steps. Each change is one step for Undo.",
      "Add steps to a case like anywhere else: drop them on its wire, or click its empty box. A case that holds a single step becomes a group the first time you add another.",
      "Add a new switch from the Add menu (Shift+A): Switch (cases). It asks for the value first.",
      "On the Resources screen and the Form tab: a lookup's Filter (only the records that match are offered) and a Dynamic Component input's code (Input component code), both stored where Saturn keeps them.",
    ],
  },
  {
    version: "0.3.63",
    title: "Rich text editor, and the JSON on every screen",
    items: [
      "On the Resources screen and the Form tab, Input type has Rich text editor. With it come Rows, the Voice transcriber (on or off, provider, mode, profile, language, and Tell speakers apart) and AI actions, stored where Saturn keeps them. Switching the transcriber on for the first time fills in the settings Saturn's own editor uses (deepgram, flux, general, en).",
      "Every screen has a way to see its JSON: Workflow JSON in the node view's top bar (the whole workflow, with your unsaved changes), Menu JSON on the Menus screen (the picked menu as Save would write it), Schema JSON on System Logs (the log resource's properties), and Schema JSON on Resources as before. Each opens in a tab beside, read-only.",
    ],
  },
  {
    version: "0.3.62",
    title: "Undo on the Menus screen",
    items: [
      "The Menus screen has Undo and Redo, in the top bar and on Ctrl+Z (Cmd+Z) and Ctrl+Shift+Z or Ctrl+Y. They go back through every change you haven't saved yet, in any menu, and show the menu that changed. Typing in one box is one step. Discard can be undone too. Saving clears the history; use Undo the last save for that.",
      "Spaces can be typed in a tab's caption again. Before, a space at the end was taken off as you typed, so the next word ran into the last one.",
      "Dragging tabs under another tab, or out of one to the top level, asks Copy or Move. Copy leaves them where they were. Reordering under the same tab never asks.",
      "In the node view, a double-click on a stage opens its settings in the side panel: on its row in the layers panel, and on its header in the workflow map. Rename a stage from its right-click menu, or in its settings.",
    ],
  },
  {
    version: "0.3.61",
    title: "Picking several menus",
    items: [
      "On the Menus screen, Ctrl/Cmd+click or Shift+click picks several menus. Drag one (or Alt+↑/↓) and they move together, in order.",
      "With several picked, the settings column changes their icon and who can see them for all of them; what they don't share says Mixed. Each keeps its own label and tabs.",
      "Deleting a menu is now crossed out until you press Save, like a tab, one menu or several (right-click › Delete, or the Delete key). Restore brings it back. Save's confirm names the menus it deletes.",
      "Drag tabs (one or several picked) onto another menu's card: a box asks Copy or Move. They go at the end of that menu, with their sub-tabs.",
    ],
  },
  {
    version: "0.3.60",
    title: "Picking several in the layers panel",
    items: [
      "Right-click one of several picked actions or commands: Duplicate and Delete act on all of them, as one change (one Ctrl+Z undoes it). Rename stays for one at a time.",
      "Press Delete (or Backspace) with several picked: a box names them and asks first.",
      "Stages can be picked too (Ctrl/Cmd or Shift+click on a stage's name; a plain click still opens and closes it). Drag one of them and they all move there together, in order; right-click deletes them all.",
      "With several actions picked, the side panel shows who can perform them. Rules they don't share say Mixed; saving gives all of them the same rules, as one change.",
      "One kind is picked at a time: picking a stage after actions starts again with the stage.",
    ],
  },
  {
    version: "0.3.59",
    title: "Picking several steps on the canvas",
    items: [
      "Drag on an empty part of the canvas to draw a box: every step inside it is picked. Hold Ctrl (Cmd on a Mac) or Shift to add to what's picked. To move around the canvas, drag with the middle mouse button, or hold Space and drag.",
      "Ctrl+A (Cmd+A) picks every step in the view you're in. It can be changed on the Keyboard shortcuts page.",
      "Several steps of the same kind picked (say, two Update Records): the side panel shows the settings they share. One they don't share says Mixed; a change goes to all of them as one change, and each keeps its other settings.",
      "Drag one of the picked steps onto a wire and all of them move there together, in their order, as one change.",
    ],
  },
  {
    version: "0.3.58",
    title: "Property settings back to their groups",
    items: [
      "A property's settings are back in their earlier groups: General, Visibility, Input, Data, Display and Access, with nothing folded away.",
      "The \"Where the choices come from\" picker is gone: the map, the lookup and the value source are their own sections in Data again.",
      "Kept: Favourites at the top, the Countries lookup's Value field and Label field (Data > Lookup), and the one switch for every place, now called Everywhere, first in Visibility > Show in.",
      "Put back on a setting also takes out what was filled in with it (like a Countries lookup's two fields).",
    ],
  },
  {
    version: "0.3.57",
    title: "Countries lookups",
    items: [
      "A property whose choices are Countries now shows them like Saturn's own editor: a Value field (what's stored, like country_code) and a Label field (what people see, like country_name).",
      "Before, the label field was shown as a label function's code. It's now a list to pick from, and it's saved where Saturn keeps it.",
      "Picking Countries as the lookup source starts with country_code and country_name, as Saturn does.",
    ],
  },
  {
    version: "0.3.56",
    title: "Show everywhere",
    items: [
      "A property's Basics has a Show everywhere switch, right under Type. It shows or hides the property in forms (add and edit forms too), tables, drawers and record views at once.",
      "When it's shown in some places but not others, the switch is half on; a click shows it everywhere. The six Show in switches are still there in their own groups, and it's stored exactly as before.",
    ],
  },
  {
    version: "0.3.55",
    title: "Property settings by place, and Favourites",
    items: [
      "A property's settings (the Resources screen and the Form tab) are now grouped by where they apply: Basics, Rules, Choices, In forms, In tables, In record views, Access and Advanced. Nothing is stored differently.",
      "Choices has one picker, \"Where the choices come from\": None, A fixed list, Another resource, A function, Other lookup or Linked records. Only the chosen one's settings show; switching back brings back what you'd typed, until you save.",
      "Each place starts with its own Show in switch. When the property is hidden there, the group says Hidden and folds its other settings (kept as they are; a link opens them).",
      "Advanced (Hide from the API, IP address, Value source, columns per screen size) starts folded. Find a setting still finds what's inside.",
      "Favourites at the top: press Edit to tick the settings you use most, reorder them with ↑ / ↓ or by dragging. They edit the same values as the groups below, and it's one list for every resource and form on this computer.",
    ],
  },
  {
    version: "0.3.54",
    title: "Every setting of a real Application schema",
    items: [
      "Checked against a real Application schema, these now show and can be changed on the Resources screen and the Form tab:",
      "Table and Record view each have their own Currency, and their own Component code for the Inline component renderer (the record view's inline component, like Ratios). Component code also shows when it's stored under the Default renderer.",
      "The File manager renderer's title, helper text, the resource and property the files belong to, and how many files; File access (acl) on file uploads.",
      "A source definition kept on a static map, a map's lookup reference, and columns for medium and large screens when they're set.",
      "A property whose label is only a space shows its key in the list.",
    ],
  },
  {
    version: "0.3.53",
    title: "Keyboard shortcuts page",
    items: [
      "A new Keyboard shortcuts page (the sidebar's Keyboard shortcuts button, under What's new, or the \"Saturn: Keyboard shortcuts\" command) lists every shortcut of the node view, the Resources screen and the Menus screen.",
      "Click + and press a key to add it, × to take one off, Reset to put a shortcut back, or Reset all. A key another shortcut on the same screen already uses is refused, saying which one has it.",
      "Open screens pick up a change straight away, and the tooltips and the node view's hint line show your keys.",
      "The Menus screen's menus list can be hidden: « on it, T, and the strip at the left brings it back.",
    ],
  },
  {
    version: "0.3.52",
    title: "T hides the left panel",
    items: [
      "Press T to hide or show the layers panel in the node view (like N for the side panel), and the properties list on the Resources screen. It does nothing while you're typing in a box.",
    ],
  },
  {
    version: "0.3.51",
    title: "A resource's whole schema as JSON",
    items: [
      "The Resources screen's top bar has a Schema JSON button: it opens the resource's whole schema (every property, in order) as JSON in a new tab, with your unsaved changes in it.",
    ],
  },
  {
    version: "0.3.50",
    title: "A map you can arrange",
    items: [
      "The workflow map reads left to right: Global actions first, then the stages, with the commands underneath.",
      "Drag any box on the map (a stage, Global actions, a command) to arrange it your way. Where you put it is kept for that workflow on this computer; Reset layout puts everything back. Saturn doesn't change.",
      "The layers panel on the left can be hidden: « on the panel, or Layers in the top bar; the strip at the left edge brings it back.",
      "Fixed: a Create step's Properties now show in the side panel and can be edited there. Saving a Create step from the panel used to drop its properties; settings a step has that Saturn's list of settings doesn't name are now kept.",
    ],
  },
  {
    version: "0.3.49",
    title: "The workflow map",
    items: [
      "Open Workflow settings and the canvas shows a map of the whole workflow: each stage with its actions, the global actions, and the commands.",
      "Arrows show where each action moves the record (its Property Updater sets status to another stage). Dashed lines show the commands an action or global action runs. A switch adds the lines for commands calling commands.",
      "Click an action, a command or a stage to light up its lines; a double-click opens it. To change where an action moves the record, click it, then drag its arrow's end onto another stage. It goes into the workflow's unsaved changes.",
      "The node view's top bar has a Reload button, and no longer says Node view. The breadcrumb has its own row under it, and each step in it can be clicked to go back.",
      "The side panel has a » button to hide it; the strip at the edge brings it back.",
      "A Create step's properties show one per row on its card, like the Property Updater's.",
      "Resources screen: the breadcrumb has its own row (with the property you were on; click to go back), Resource settings has Open raw JSON, the properties list can be folded away with «, and when the settings area is narrow only the settings search shows.",
    ],
  },
  {
    version: "0.3.48",
    title: "Custom dropdown style",
    items: [
      "A property the form shows as a dropdown (a select, a map, a lookup or a dynamic source) now has Custom dropdown style under Display > Form, on the Resources screen and the Form tab.",
      "Switched on, the Dropdown option template shows: the Vue template that draws each option, highlighted, with Open in a file. A new one starts with Saturn's own starter template.",
      "Switching it off keeps the template, as Saturn does.",
    ],
  },
  {
    version: "0.3.47",
    title: "Finding and dragging a section's properties",
    items: [
      "In Resource settings, each section's property list now has a find-or-add box at the top. Typing narrows the list and offers the properties not in the section yet; click one, or press Enter for the first, to add it. Esc clears it.",
      "Drag a property in the list to move it. Dragging is off while you search (like the properties list); the ↑ / ↓ buttons still work.",
    ],
  },
  {
    version: "0.3.46",
    title: "Resource settings",
    items: [
      "The Resources screen has a Resource settings button in the top bar. It shows the resource's own settings on the right, in place of a property's: its description, Open records in a drawer, and its sections.",
      "Sections: add, remove and reorder them; change a section's name, description, columns and whether it has its own tab; pick which properties are in it, in order. A hint lists the properties in no section.",
      "Changes join the screen's unsaved count, Discard and Save. Saving re-reads the settings, keeps a backup, sends only what changed and checks it after. Default view, sort and layout are kept as they are.",
      "Click a property to go back to its settings.",
    ],
  },
  {
    version: "0.3.45",
    title: "Inline component code",
    items: [
      "A property whose renderer is Inline component now shows its Vue component as Component code (in Display), highlighted, on the Resources screen and the Form tab.",
      "Picking Inline component for a property shows it with a starting template. It's saved the way Saturn stores it (rendering.options.code, with type \"property\"), and so is a Currency renderer's currency.",
      "On the Resources screen, code settings (Component code, the visibility function, lookup functions, …) now have Open in a file, like the code step. Saving the file puts the code in the screen as an unsaved change; Save sends it.",
    ],
  },
  {
    version: "0.3.44",
    title: "Find a setting finds more",
    items: [
      "Fixed: Find a setting (on the Resources screen and the Form tab) only looked at each setting's own name, so \"show\" missed the Show in switches and \"data\" didn't show the Data group.",
      "It now also looks at the heading and group a setting is under, and the names of its choices (\"currency\" finds the renderers).",
      "Several words match anywhere, unless they appear together somewhere: then just those show.",
    ],
  },
  {
    version: "0.3.43",
    title: "What's new has its own page",
    items: [
      "These release notes moved out of the node view onto their own page, a VS Code tab. Open it with the What's new button in the sidebar (under AI Skills) or the \"Saturn: What's new\" command.",
      "The newest release is open and marked Installed; a search finds the releases that mention something.",
      "The node view's Changes tab now shows only the workflow's unsaved changes.",
    ],
  },
  {
    version: "0.3.42",
    title: "Copy or Move",
    items: [
      "In the layers panel, dragging actions or commands into another list (another stage, Global actions, Commands) now asks Copy or Move, for one item or several.",
      "Copy keeps the originals (the copies get new ids). Move removes them, as one change. Moving a command that reference steps call warns first, because those steps would stop working.",
      "Reordering inside the same list, or several that are all already in that list, still just moves without asking. Esc or Cancel closes the box and changes nothing.",
    ],
  },
  {
    version: "0.3.41",
    title: "Move actions between stages",
    items: [
      "In the layers panel, drag an action onto another stage or Global actions to move it there: dropped on the stage or the heading it goes at the end, dropped on an action it goes before it.",
      "It works with several picked (Ctrl/Cmd or Shift+click), also from different stages. Several picked in one stage now move together as a block.",
      "Moved actions keep their ids, so triggers and hooks that use them keep working. If the name is already taken where it lands, it gets _2. One Undo puts a move back.",
    ],
  },
  {
    version: "0.3.40",
    title: "Every resource links back to itself",
    items: [
      "Menus screen: a tab's resource has a chip beside it (also when several picked tabs share one). Click it to open that resource on the Resources screen.",
      "Node view: a step setting that picks a resource (like Update Record's Resource) has the same chip beside it.",
      "With 0.3.39's Linked resources, the Hooks names, and the chips the Resources screen and the Form tab already had, every place that names a resource now opens it.",
    ],
  },
  {
    version: "0.3.39",
    title: "Linked resources in Workflow settings",
    items: [
      "Workflow settings has a new Linked resources section near the top: a green button for each resource the workflow is linked to, saying how (it runs on this workflow, or its hooks run this workflow's actions). Click one to open that resource on the Resources screen.",
      "The resource names in the Hooks section open it too.",
    ],
  },
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
