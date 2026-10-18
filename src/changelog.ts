/** Release notes shown in the side panel's Changes tab (newest first). */
export const CHANGELOG: { version: string; title: string; items: string[] }[] = [
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
