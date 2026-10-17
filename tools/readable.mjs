// Turn the original (minified) extension.js into a readable reference copy:
// formatted, with descriptive names for the parts that matter and a one-line
// note above each of them.
//
//   node tools/readable.mjs <extension.js | sonover-code.vsix> [out.js]
//
// Default output: reference/extension.readable.js (git-ignored). This copy is
// for READING only — patch.py and the build always work on the original
// minified file, whose exact text the patches match.
//
// Names are renamed with Babel's scope-aware rename (every use of the
// top-level binding, nothing that merely shares its short name). Only names
// whose meaning was checked against their code are listed; everything else
// keeps its minified name.
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { parse } from "@babel/parser";
import traverseMod from "@babel/traverse";
import generateMod from "@babel/generator";

const traverse = traverseMod.default ?? traverseMod;
const generate = generateMod.default ?? generateMod;

// minified name -> [readable name, what it is]
const NAMES = {
  // ---- start-up
  Yf: ["activate", "Entry point: VS Code calls this once. Creates the instance manager, the sidebar, the tree and every command."],
  Qf: ["deactivate", "Called when the extension stops."],

  // ---- instances and logging in
  fr: ["InstanceManager", "The connected Saturn instances ({id, name, url, displayName?}), kept in globalState[\"saturn.instances\"]; each token in VS Code secrets."],
  Cn: ["INSTANCES_KEY", "globalState key of the instance list."],
  po: ["tokenSecretKey", "Secret-storage key of an instance's token: saturn:token:<id>."],
  hr: ["normalizeInstanceUrl", "Checks and normalises an instance URL typed by the user."],
  zu: ["hostOf", "The host part of a URL (default instance name)."],
  Ju: ["newInstanceId", "A random id for a newly added instance."],
  I: ["instanceLabel", "An instance's display name (displayName, else name)."],
  hc: ["loginWithPassword", "POST <url>/api/Users/authenticate {email, password} -> {token, user}."],
  mc: ["checkApiKey", "Checks an API key with GET <url>/api/Resources."],
  Qe: ["SaturnAuthError", "Error: not signed in / bad credentials."],
  J: ["SaturnNetworkError", "Error talking to an instance; .retryable says whether trying again may help (offline)."],
  ur: ["ResponseTooLargeError", "Error: a response was bigger than the size cap."],

  // ---- the request layer: every call to Saturn goes through _()
  _: ["saturnRequest", "THE request to a Saturn instance: <url>/api<path>, Authorization: Bearer <token>, 60 s timeout, no redirects, size-capped."],
  Fo: ["apiUrl", "Builds <instance url>/api<path>, refusing paths that would leave /api."],
  ot: ["capResponseSize", "Wraps a fetch Response so reading more than the cap (50 MB by default) fails."],
  O: ["checked", "Runs a request; turns network failures and non-2xx answers into SaturnNetworkError with a readable message."],
  Ze: ["throwIfFailure", "Throws when a response body is {status: \"FAILURE\", message}."],
  Cc: ["probeInstance", "HEAD <instance url>: is the instance reachable? (used by the connection monitor)."],
  Is: ["ConnectionMonitor", "Polls the instance (probeInstance) and reports online / offline changes."],
  Do: ["REQUEST_TIMEOUT_MS", "60 000 ms."],
  L: ["errorMessage", "An error's message, or a fallback text."],

  // ---- endpoints
  Un: ["WORKFLOWS", "\"/Workflows\""],
  Fp: ["OPERATORS", "\"/Operators\""],
  Dp: ["USER_GROUPS", "\"/UserGroups\""],
  Np: ["USERS", "\"/Users\""],
  jp: ["PERMISSIONS", "\"/Permissions\""],
  Bn: ["MENUS", "\"/menus\""],
  jn: ["UI_COMPONENTS", "\"/Saturnuicomponents\""],
  Ic: ["RESOURCE_DETAILS", "\"/resourceDetails\" (resource lifecycle hooks)"],
  qn: ["WORKFLOW_TRIGGERS", "\"/workflowTriggers\""],
  Up: ["TRIGGER_PROVIDERS", "\"/triggers\""],

  // ---- workflows on the instance
  ft: ["listWorkflows", "GET /Workflows"],
  kc: ["createWorkflow", "POST /Workflows -> the new id"],
  bc: ["deleteWorkflow", "DELETE /Workflows/<id>"],
  Xe: ["loadWorkflow", "GET /Workflows/<id>"],
  Wn: ["saveWorkflow", "PUT /Workflows/<id> with the whole definition (what Save does)"],
  Ye: ["unwrapWorkflow", "The workflow definition out of a GET /Workflows/<id> response."],
  Ae: ["checkDefinitionForSave", "Checks a definition is an object for this workflow id before it is saved."],
  $t: ["listOperators", "GET /Operators (the operator catalog)"],
  Wt: ["operatorCatalog", "Operator list -> Map(operator -> {name, description, params, …})."],
  ln: ["listUserGroups", "GET /UserGroups"],
  Hr: ["listUsers", "GET /Users"],
  qr: ["listPermissions", "GET /Permissions"],
  zr: ["listTriggerProviders", "GET /triggers"],
  Yr: ["listResourceDetails", "GET /resourceDetails (which workflow actions run on a resource's create / update / …)"],
  _c: ["saveLifecycleHooks", "PUT /resourceDetails/<id> {lifecycle}"],
  ws: ["bindingsFromResourceDetails", "ResourceDetail records -> per-resource lifecycle bindings."],

  // ---- records of any resource
  dn: ["listResourceNames", "GET /Resources -> resource names"],
  Ln: ["getResourceFields", "GET /Resources/<name> -> its fields"],
  xc: ["coreResourceNames", "GET /resources/catalog -> the core resources (or null)"],
  Ur: ["recordRoutes", "The routes a resource's records may live at: SystemLog -> /systemlogs, /systemlog, …"],
  pt: ["isResourceName", "Is this a plausible resource name?"],
  Ro: ["isMissingRoute", "404 or \"route not found\": try the next route name."],
  To: ["isRouteNotFound", "The body says \"route not found\"."],
  cc: ["recordQuery", "?limit=&page=&filter= for a record list."],
  lc: ["recordsFromBody", "{data, count|total} -> {records, total}"],
  Sc: ["listRecords", "GET /<records>?limit&page&filter -> {records, total}"],
  Pc: ["getRecord", "GET /<records>/<id>"],
  Vr: ["writeRecord", "POST / PUT / DELETE a record"],

  // ---- the view model the screens draw (built from a workflow definition)
  Ke: ["workflowView", "A workflow definition -> the view model posted to the screens as `workflow`."],
  At: ["workflowSummary", "One row of the workflows list."],
  $a: ["actionView", "An action -> its view (label, access, form, flow)."],
  go: ["formFieldView", "A form field -> {key, label, type, inputType, required}."],
  yr: ["stepView", "One step (operator, if, each, parallel, series, reference) -> its flow view."],
  _n: ["seriesView", "A series of steps -> its flow view."],
  Ra: ["ifView", "An If step -> its flow view (true / false branches)."],
  cp: ["paramViews", "An operator step's data -> its parameter rows."],
  Pa: ["catalogEntry", "The operator catalog entry for a step."],
  xa: ["stepTitle", "A step's title (operator name, else its own name)."],
  Tr: ["stepSummary", "A short description of a step for change summaries (\"Update Record\", \"loop\", …)."],
  Ga: ["stepsSummary", "The same for several steps."],
  ke: ["humanize", "\"some_name\" -> \"Some name\""],
  A: ["asArray", "The value if it's an array, else []."],
  m: ["nonEmptyString", "The value if it's a non-empty string, else null."],
  jt: ["finiteNumber", "The value if it's a finite number, else null."],

  // ---- editing a definition (all copy, never mutate)
  N: ["getAt", "The value at a path in a definition."],
  ue: ["setAt", "A copy of the definition with the value at a path replaced."],
  wo: ["parentOf", "The parent object / array and key of a path."],
  sn: ["removeAt", "A copy with the item at a path removed."],
  Ge: ["insertAt", "A copy with items inserted into the array at a path."],
  on: ["moveStep", "Moves a step from one path to another (refuses moving it into itself)."],
  Ia: ["insertAfter", "Where \"after this step\" is: {childrenPath, index}."],
  Ut: ["cloneStep", "A deep copy of a step with fresh ids (duplicate / paste)."],
  So: ["referencedCommands", "The command ids a set of steps references."],
  Ma: ["stampStepIds", "Gives every step without an id one."],
  Mn: ["newOperatorStep", "{type: \"command\", operator, data, delay?}"],
  rn: ["paramsToData", "The panel's text values -> a step's data (types, JSON, required checks); an empty value keeps the stored one."],
  ko: ["containerPatch", "The Each / Parallel / If editor's values -> the step fields to change."],
  Rr: ["updateFields", "Changes the form-field list of an action / command at a path."],
  fo: ["MERGED_PARAMS", "property_updater: properties is edited as one map (resource_property / value are merged into it)."],
  Yu: ["mergedParam", "Is this param merged into another (hidden in the editor)?"],
  ba: ["mergeParams", "Folds merged params into their map."],

  // ---- screens
  It: ["WorkflowsPanel", "The Workflows screen (list view + node view): handleMessage() answers the webview; edits go to a local draft (applyEdit) and reach Saturn on saveChanges()."],
  bn: ["MenusPanel", "The Menus screen."],
  Sn: ["PagesPanel", "The custom Pages screen."],
  tn: ["TicketsPanel", "The Tickets (kanban) screen — Sonover's own server, not an instance."],
  _t: ["AgentChatPanel", "The AI agent chat."],
  Ds: ["SidebarProvider", "The Sonover sidebar (instance cards, Open Workflows / Menus / Pages / …)."],
  Ws: ["ComponentsTree", "The Components tree view."],
  zt: ["ConnectionStatusBar", "The status-bar item showing offline instances / queued edits."],
  Re: ["setPanelIcon", "Gives a panel a codicon (where VS Code supports it)."],
  xe: ["nonce", "A random nonce for a webview's Content-Security-Policy."],

  // ---- offline work and files on disk
  Bs: ["OfflineCache", "Cached instance data and the write queue, kept on disk for when the instance is unreachable."],
  Cs: ["OfflineEdits", "Workflow edits made while offline, replayed (and reconciled) when the instance is back."],
  Es: ["ParamFiles", "Code / HTML parameters opened as files in an editor (index.json + one file each)."],
  Ls: ["SaturnFileSystem", "The saturn:// file system: instance resources as files."],
  Vs: ["ResourceFolderSync", "Syncs resources to a folder on disk."],
  js: ["PageFiles", "Custom pages as .vue files on disk."],
  Hs: ["PreviewPanel", "HTML / component previews."],
  ps: ["RecordBackups", "Backups of records the agent changed (restore)."],
  Oe: ["instanceDataDir", "The folder for an instance's local data."],
  wn: ["workflowsDataDir", "<instance data folder>/workflows (drafts.json, offline edits)."],
  Vl: ["offlineSyncSummary", "\"Offline work applied to the instance: …\""],

  // ---- Sonover's own server (Tickets), not an instance
  gr: ["sonoverRequest", "A request to https://sonoverapi.saturn.gd/api with the user's Sonover login."],
  Gu: ["sonoverToken", "The Sonover login token from secrets."],
  lo: ["sonoverUser", "The signed-in Sonover user from secrets."],
};

const input = process.argv[2];
if (!input) {
  console.error("usage: node tools/readable.mjs <extension.js | sonover-code.vsix> [out.js]");
  process.exit(2);
}
const out = process.argv[3] ?? "reference/extension.readable.js";
const src = input.endsWith(".vsix")
  ? execFileSync("unzip", ["-p", input, "extension/dist/extension.js"], { maxBuffer: 64 << 20 }).toString("utf8")
  : readFileSync(input, "utf8");

const ast = parse(src, { sourceType: "script", allowReturnOutsideFunction: true, errorRecovery: false });

// refuse a readable name that is already a variable (in any scope) or a global the file uses
const taken = new Set();
traverse(ast, {
  Scopable(p) {
    for (const n of Object.keys(p.scope.bindings)) taken.add(n);
  },
  Program(p) {
    // (activate / deactivate are "globals" only through esbuild's dead
    // `0&&(module.exports={activate,deactivate})` hint, which means these very functions)
    for (const n of Object.keys(p.scope.globals)) if (n !== "activate" && n !== "deactivate") taken.add(n);
  },
});

const renamed = [], missing = [];
traverse(ast, {
  Program(path) {
    for (const [min, [name, what]] of Object.entries(NAMES)) {
      const b = path.scope.getBinding(min);
      if (!b) { missing.push(min); continue; }
      if (taken.has(name)) throw new Error(`${name} already exists in the file — pick another name for ${min}`);
      path.scope.rename(min, name);
      // the note above the declaration
      let decl = b.path;
      if (decl.isVariableDeclarator() && decl.parentPath.node.declarations.length === 1) decl = decl.parentPath;
      decl.addComment("leading", ` ${name} (minified: ${min}) — ${what}`, true);
      renamed.push(min);
    }
    // module imports: `var k = W(require("vscode"))` -> vscode, vscode2, …; node:fs -> fs, …
    const used = new Map();
    for (const [min, b] of Object.entries(path.scope.bindings)) {
      const init = b.path.isVariableDeclarator() ? b.path.node.init : null;
      const call = init && init.type === "CallExpression" && init.arguments[0]?.type === "CallExpression" ? init.arguments[0] : init;
      if (!call || call.type !== "CallExpression" || call.callee.type !== "Identifier" || call.callee.name !== "require") continue;
      const mod = call.arguments[0]?.type === "StringLiteral" ? call.arguments[0].value : null;
      if (!mod || NAMES[min]) continue;
      const base = mod.replace(/^node:/, "").replace(/[^A-Za-z0-9]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""));
      let n = used.get(base) ?? 0, name;
      do name = ++n === 1 ? base : `${base}${n}`; while (taken.has(name));
      used.set(base, n);
      taken.add(name);
      path.scope.rename(min, name);
      renamed.push(min);
    }
    path.stop();
  },
});

const header = `/*
 * sonover-code extension.js — READABLE REFERENCE COPY, generated by tools/readable.mjs.
 *
 * Formatted, with descriptive names (and a note above each) for the parts that
 * matter; everything else keeps its minified name. Do not edit or patch this
 * file: patch.py and the build work on the original minified extension.js,
 * whose exact text the patches match. Each renamed item names its minified
 * original, e.g. "saturnRequest (minified: _)", so you can find it there.
 *
 * Start with: activate · InstanceManager · saturnRequest · WorkflowsPanel
 * (handleMessage, applyEdit, saveChanges) · workflowView · listRecords.
 */
`;
const code = generate(ast, { comments: true, compact: false, jsescOption: { minimal: true } }, src).code;
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, header + code + "\n");
console.log(`${out}: ${code.split("\n").length.toLocaleString()} lines, ${renamed.length} names made readable` + (missing.length ? ` (not in this build: ${missing.join(" ")})` : ""));
