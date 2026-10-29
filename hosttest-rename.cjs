// v0.3.71: renameWorkflow renames the workflow itself, as one draft edit (Undo puts it back); the id and everything
// else stay as they were; an empty name is refused with editFailed. Every request answers exactly once.
const fs = require("fs"), Module = require("module");
const src = fs.readFileSync(process.argv[2], "utf8") + "\n;module.exports.__t={WorkflowsPanel};";
const stub = new Proxy(function () {}, { get: (t, k) => (k === Symbol.toPrimitive ? () => "" : stub), apply: () => stub, construct: () => stub });
// vscode as a module whose parts are all stubs (listed, so the bundle's import sees window.showErrorMessage)
const parts = ["window", "workspace", "commands", "Uri", "env", "ViewColumn", "EventEmitter", "Disposable"];
const vs = new Proxy({}, { get: () => stub, ownKeys: () => parts, getOwnPropertyDescriptor: () => ({ configurable: true, enumerable: true, value: stub }) });
const m = new Module("ext"); m.filename = "/x/extension.js";
const orig = Module._load; Module._load = (r, p, i) => (r === "vscode" ? vs : orig(r, p, i));
m._compile(src, m.filename);
const { WorkflowsPanel } = m.exports.__t;
const ok = (c, msg) => console.log((c ? "PASS " : "FAIL ") + msg);

const saved = { id: "wf", name: "Order fulfilment", commands: [], actions: [], stages: [{ stage: "new", label: "New", actions: [] }] };
const posted = [];
const panel = Object.create(WorkflowsPanel.prototype);
Object.assign(panel, {
  panel: { webview: { postMessage: (msg) => posted.push(msg) } },
  drafts: new Map(), undoSnapshots: new Map(),
  persistDrafts() {}, postDraftState() {},
  getOperatorCatalog: async () => new Map(),
  readWorkflow: async () => ({ definition: JSON.parse(JSON.stringify(saved)), offline: false }),
  manager: {}, instance: { id: "i", url: "https://x" },
});
const answers = () => posted.filter((p) => p.type === "editSaved" || p.type === "editFailed");
const send = async (name) => { posted.length = 0; await panel.handleMessage({ type: "renameWorkflow", payload: { workflowId: "wf", name } }); return answers(); };

(async () => {
  let a = await send("  Orders  ");
  const d = panel.drafts.get("wf");
  ok(a.length === 1 && a[0].type === "editSaved", "a rename answers once with editSaved");
  ok(d.definition.name === "Orders" && d.definition.id === "wf" && d.definition.stages[0].stage === "new", "the name is changed (trimmed), the id and the rest kept");
  ok(d.history.length === 1 && /Renamed the workflow from "Order fulfilment" to "Orders"/.test(d.summaries[0]), "as one draft edit, named in the changes: " + d.summaries[0]);
  ok(posted.some((p) => p.type === "workflow" && p.payload?.name === "Orders"), "the webview gets the workflow with its new name");
  a = await send("   ");
  ok(a.length === 1 && a[0].type === "editFailed" && panel.drafts.get("wf").definition.name === "Orders" && panel.drafts.get("wf").history.length === 1, "an empty name is refused and changes nothing: " + a[0]?.payload?.message);
})().catch((e) => { console.log("FAIL threw: " + e.stack); });
