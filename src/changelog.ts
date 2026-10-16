/** Release notes shown in the side panel's Changes tab (newest first). */
export const CHANGELOG: { version: string; title: string; items: string[] }[] = [
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
