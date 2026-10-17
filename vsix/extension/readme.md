# sCode

A VS Code extension that brings the S platform into your editor. Manage tickets, track project progress, and stay in your development flow without switching to the browser.

## Features

- **Sidebar Authentication** -- Sign in with your S account directly from the sidebar. Sessions persist across editor restarts.
- **Tickets Board** -- A full Kanban-style board that displays your project tickets organized by workflow stages. Drag and drop tickets between columns to update their status.
- **My Tasks Filter** -- Quickly filter the board to show only tickets assigned to you.
- **Project Filter** -- Filter tickets by project when working across multiple projects.
- **Search** -- Search tickets by title or project name.
- **Ticket Deep Links** -- Double-click any ticket to open it on the S web app for full editing.
- **Saturn Workflows** -- Browse and edit a connected Saturn instance's workflows: stages, actions, reusable commands, and the operator flows inside them. Drag to reorder steps, configure operators from forms built out of the instance's own schemas, and write operator code in a real editor file that AI assistants can read and rewrite. See [docs/SATURN.md](https://github.com/dontexit/tempdontexist/blob/HEAD/docs/SATURN.md#workflows).
- **Saturn Menus** -- The instance's navigation menus, as the web app's Menus page shows them: search, drag to reorder, add a menu, and edit its label, Font Awesome icon, visible user groups and tabs. Tabs get a filter builder with a live record count, column picking, and tab colours; every save backs the menu up first, keeps the keys the web app writes, and reads the result back. See [docs/SATURN.md](https://github.com/dontexit/tempdontexist/blob/HEAD/docs/SATURN.md#menus).
- **Saturn Custom Pages** -- The instance's custom pages in their own panel: browse, create, change title, visibility, access and switch them on or off, and delete with undo. A page's code opens as a real `.vue` file with a live preview, and saving writes it straight back. Secrets and HTTP request settings stay in the web app and never reach the editor. See [docs/SATURN.md](https://github.com/dontexit/tempdontexist/blob/HEAD/docs/SATURN.md#custom-pages).
- **Node view** -- Open any workflow as a Blender-style node graph from the **Node view** button on the Workflows screen. Operators are nodes, run order is wires, loops, conditions and parallel blocks are frames, and command references are node groups you can Tab into. Edit in place with Blender keys: Shift+A add, X delete, Shift+D duplicate, M disable/enable, drag a node onto a wire to move it, Ctrl+Z undo, N for the side panel, Home to fit. Select a step to edit its settings right in the Figma-style side panel (Design / Inspect tabs, changes apply on Enter or when you leave a field, Esc reverts); drag the panel's left edge to resize it. Code parameters open in a real editor and emails open with their preview, as in the list view. Every edit goes through the same draft, undo and Save flow as the list view, so the two views stay in sync.
- **Find your way around** -- In the node view, stages open and close like folders (click a stage; collapse-all in the Stages header; remembered per workflow). Search ( / ) finds stages, actions and commands by name, and every action or command whose steps match — search an operator like `debug` to see every action that uses it, then click to jump to the step. In the Add menu (Shift+A) each command is listed like an operator, so typing its name adds it directly.
- **Everything the list view does, in the node view** -- Switch, create and delete workflows; stage colour and machine names; drag to reorder stages and actions; action access control and form fields; command parameters and where a command is used; triggers (schedule presets, webhooks, secrets) and resource lifecycle hooks; copy and paste (shared with the list view); the full parameter editors (lookups from the instance, resource pickers, key/value maps, command parameters, designed emails); offline and changed-elsewhere notices.
- **Building workflows in the node view** -- Create, rename (double-click) and delete stages, actions and commands from the node view's layers panel. Empty branches, loops and actions show a dashed slot to click or drop a step into, and every wire has a + button to insert a step right there.
- **Disabled steps** -- Steps switched off in Saturn (`"mock": true`) are shown as disabled in both the list view and the node view, and can be disabled or enabled from either.
- **System Logs** -- Open an instance's System Logs (from its card in the Sonover sidebar, its right-click menu, or **Saturn: Open System Logs**) to list the System Logs core resource's records: newest first, paging, Live refresh, level chips, search, a server filter, column picker and a detail pane. Read-only -- it never changes a record. Point it at another resource with `saturn.systemLogResource`, or pick one in the screen.
- **Node view first, multi-select** -- The Workflows screen opens in the node view (List view is a click away), and flows run top to bottom by default (the Vertical/Horizontal button switches). Shift+click several steps to disable/enable, duplicate, copy or delete them together from the right-click menu, the side panel or the keys -- each as one change that a single Ctrl+Z undoes. Stages in the layers panel have guide lines and dividers, and the side panel's Changes tab lists the workflow's unsaved edits and the node view's release notes.
- **Smarter inputs** -- Every text box in the node view's side panel is syntax highlighted (`{{ templates }}`, JSON, JavaScript, HTML, CSS and cron). Number and time fields scrub like Figma: hold the label and drag sideways (Shift for ×10, Alt for fine steps), or use the arrow keys; millisecond delays show as seconds/minutes. Date and time parameters get a calendar picker with **Now** / **Today**, and colours get a full colour picker (with an eyedropper where available).
- **Every form-field setting** -- Edit a form field (or command parameter) in the node view to reach all of its settings: validation (unique, searchable, email, IP), visibility (table, form, view, drawer, own tab), layout (column width, columns, span), read/write defaults, input type and template, lookup and map (reference, value/label fields, label function), rendering, meta tags, required columns, default view — or the whole field as JSON.
- **Logs tab** -- The node view's side panel has a **Logs** tab with the System Logs records about the open workflow (matched by its id or name), newest first. Narrow it to the open action or the selected step, filter by level or search, turn on Live, open a record's JSON, jump to the action it's about, or open the full System Logs screen. Read-only.
- **AI agents** -- Chat to an AI CLI about a Saturn instance and let it make changes. Model-agnostic by design: it drives the `claude`, `agy` (Antigravity), or `ollama` CLI you already have signed in, so no API key is stored by the extension. The agent is taught Saturn's workflow rules, can read and edit workflows through tools, and asks permission inline before acting. See [docs/AGENT.md](https://github.com/dontexit/tempdontexist/blob/HEAD/docs/AGENT.md).
- **Attachments** -- Attach documents and images to a chat message with the composer's `+`, a paste, or a drop. Text is inlined into the message so it works with any CLI; images are passed by path, and an agent that cannot open one says so rather than guessing. See [docs/AGENT.md](https://github.com/dontexit/tempdontexist/blob/HEAD/docs/AGENT.md#attachments).
- **Explain or Act** -- Pick per conversation whether the agent may change anything. **Explain** reads and answers, changing nothing; **Act** carries the change out, whether it lands in the instance, in a workspace file, or in a shell command. Explain is the default and is enforced, not only described: tools it lacks are removed or sandboxed. Changes are approved one at a time unless you confirm Auto for that chat. See [docs/AGENT.md](https://github.com/dontexit/tempdontexist/blob/HEAD/docs/AGENT.md#agents-for-different-jobs).
- **Tasks** -- Let the agent break a request into tasks and run them, each under its own agent and its own skills, in dependency order. See [docs/AGENT.md](https://github.com/dontexit/tempdontexist/blob/HEAD/docs/AGENT.md#tasks).
- **AI page** -- The **AI Skills** button opens Chat and Skills together in an editor tab, the way Tickets opens. Chat to an agent about a Saturn instance and pick which instance the conversation is about from the composer. See [docs/AGENT.md](https://github.com/dontexit/tempdontexist/blob/HEAD/docs/AGENT.md#the-chat-panel).
- **AI Skills** -- Link a repository of skills from GitHub, GitLab, Bitbucket, or any git remote (including self-hosted) and switch on the ones the agent should follow. Skills are found at any depth, including `agents/` trees of markdown files. Fetched with your own `git`, so private repos work without this extension ever handling a token. See [docs/AGENT.md](https://github.com/dontexit/tempdontexist/blob/HEAD/docs/AGENT.md#skills).
- **Theme Aware** -- Automatically adapts to your editor's light or dark theme.

## Getting Started

### Prerequisites

- VS Code 1.60+ (the manifest's `engines.vscode`)
- A Sonover account

### Install from VSIX

1. Download the `.vsix` file
2. Open VS Code / Cursor
3. `Cmd+Shift+P` -> **Extensions: Install from VSIX...**
4. Select the downloaded file

Or from the terminal:

```bash
cursor --install-extension S-code-0.0.1.vsix
```

### Usage

1. Click the **S Code** icon in the Activity Bar (left sidebar)
2. Sign in with your S email and password
3. Click **Tickets** to open the Kanban board
4. Drag tickets between columns to update their status
5. Double-click a ticket to view/edit it on the web

## Development

### Setup

```bash
bun install
```

### Build

```bash
bun run compile
```

### Run in development

```bash
bun run compile
cursor --extensionDevelopmentPath="$(pwd)"
```

### Watch mode

```bash
bun run watch:esbuild   # Rebuilds on file changes
bun run watch:tsc       # Type-checks on file changes
```

### Package for distribution

```bash
bun run vsix
```

This produces a `S-code-<version>.vsix` file.

### Cut a release

```bash
bun run release patch          # or minor, major, or an exact version like 1.2.0 / 1.3.0-beta.1
bun run release minor --dry-run   # show what would happen, change nothing
bun run release patch --no-push   # commit and tag locally, push yourself later
```

From an up-to-date, clean `main`, it bumps `package.json`'s version, moves what is under
`## [Unreleased]` in `CHANGELOG.md` under the new version, commits `Release vX.Y.Z`, tags `vX.Y.Z`
and pushes both. The tag starts the **Build & Release** workflow, which tests, builds and packages the
extension and publishes a GitHub release with the VSIX attached and that CHANGELOG section as its notes
(followed by GitHub's list of merged pull requests). A version with a pre-release part is published as a
pre-release. A tag that does not match `package.json`'s version fails the build, so write the release's
notes under `## [Unreleased]` first — the script refuses when there are none.

## Architecture

See `docs/ARCHITECTURE.md` in the source repository for a detailed guide covering:

- Project structure and file reference
- How webviews communicate with the extension host
- How to add new panels, navigation items, and API endpoints
- Authentication and secret storage
- Styling and theming with Tailwind CSS

## Tech Stack

- **TypeScript** -- Extension host and React webviews
- **React 19** -- Webview UI
- **Tailwind CSS v4** -- Styling with VS Code theme integration
- **shadcn/ui pattern** -- Reusable UI components (Button, Input, Card, Label)
- **esbuild** -- Bundling (dual build for Node + browser)
- **Bun** -- Package management and script runner
- **Lucide React** -- Icons

## Release Notes

### 0.0.1

- Initial release
- Sidebar authentication with session persistence
- Tickets Kanban board with drag-and-drop
- My Tasks filter, project filter, and search
- Deep links to S web app
