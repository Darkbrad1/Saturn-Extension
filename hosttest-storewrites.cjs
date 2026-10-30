// v0.3.72: setStoreWrites, the host side of Write store values: a Parallel of Write Store steps written in one draft
// edit, replacing one (the rows keep the steps ids by place) or adding one; bad rows are refused. Each answers once.
const fs = require("fs"), Module = require("module");
const src = fs.readFileSync(process.argv[2], "utf8") + "\n;module.exports.__t={WorkflowsPanel,stepView};";
const stub = new Proxy(function () {}, { get: (t, k) => (k === Symbol.toPrimitive ? () => "" : stub), apply: () => stub, construct: () => stub });
// vscode as a module whose parts are all stubs (listed, so the bundle's import sees window.showErrorMessage)
const parts = ["window", "workspace", "commands", "Uri", "env", "ViewColumn", "EventEmitter", "Disposable"];
const vs = new Proxy({}, { get: () => stub, ownKeys: () => parts, getOwnPropertyDescriptor: () => ({ configurable: true, enumerable: true, value: stub }) });
const m = new Module("ext"); m.filename = "/x/extension.js";
const orig = Module._load; Module._load = (r, p, i) => (r === "vscode" ? vs : orig(r, p, i));
m._compile(src, m.filename);
const { WorkflowsPanel } = m.exports.__t;
const ok = (c, msg) => console.log((c ? "PASS " : "FAIL ") + msg);
const { stepView } = m.exports.__t;

const ws = (id, key, value, extra = {}) => ({ id, type: "command", operator: "write_store", data: { key, value }, ...extra });
const saved = {
  id: "wf", name: "W", commands: [], actions: [],
  stages: [{ stage: "s", label: "S", actions: [{ id: "A1", action: "a", label: "A", task: { id: "T", type: "series", commands: [
    { id: "PAR", type: "parallel", operator: "parallel", concurrency: 2, commands: [ws("W1", "who", "x", { mock: true }), ws("W2", "when", "y")] },
    { id: "E", type: "command", operator: "send_email", data: { to: "a" } },
  ] } }] }],
};
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
const send = async (payload) => { posted.length = 0; await panel.handleMessage({ type: "setStoreWrites", payload: { workflowId: "wf", ...payload } }); return answers(); };
const list = () => panel.drafts.get("wf")?.definition.stages[0].actions[0].task.commands;
const path = ["stages", 0, "actions", 0, "task", "commands", 0];

(async () => {
  const view = stepView(saved.stages[0].actions[0].task.commands[0], new Map(), path);
  ok(view.kind === "parallel" && view.stepId === "PAR", "a Parallel's view carries its id, so the node view can remember it");

  let a = await send({ path, rows: [{ key: "who", value: "loan_officer" }, { key: "when", value: "{{ _util.moment().toISOString() }}" }, { key: "why", value: "{{ _form.reason }}" }] });
  let par = list()[0];
  ok(a.length === 1 && a[0].type === "editSaved", "replacing the rows answers once with editSaved");
  ok(par.id === "PAR" && par.concurrency === 2 && par.type === "parallel" && par.commands.length === 3, "the Parallel stays (id, concurrency), now with a step per row");
  ok(par.commands[0].id === "W1" && par.commands[0].mock === true && par.commands[1].id === "W2" && par.commands[2].id && !["W1", "W2", "PAR", "E", "T", "A1"].includes(par.commands[2].id), "rows keep the ids (and the disabled flag) of the steps they replace by place; a new row gets a fresh id");
  ok(par.commands.every((c) => c.type === "command" && c.operator === "write_store") && par.commands[2].data.key === "why" && par.commands[2].data.value === "{{ _form.reason }}", "each is an ordinary Write Store step with its key and value");
  ok(panel.drafts.get("wf").history.length === 1, "as one draft edit");

  a = await send({ childrenPath: ["stages", 0, "actions", 0, "task", "commands"], index: 2, rows: [{ key: "a", value: "1" }, { key: "b", value: "2" }] });
  const added = list()[2];
  ok(a.length === 1 && a[0].type === "editSaved" && added.type === "parallel" && added.operator === "parallel" && added.id && added.commands.map((c) => c.data.key).join() === "a,b", "without a path a new Parallel of Write Store steps goes in where asked: " + JSON.stringify(added));
  ok(panel.drafts.get("wf").history.length === 2, "also one draft edit");

  for (const [payload, why] of [
    [{ path, rows: [{ key: "", value: "x" }] }, "a row without a key"],
    [{ path, rows: [{ key: "k", value: "1" }, { key: " k ", value: "2" }] }, "a key twice"],
    [{ path, rows: [] }, "no rows"],
    [{ path, rows: [{ key: "__proto__", value: "1" }] }, "a prototype key"],
    [{ path: ["stages", 0, "actions", 0, "task", "commands", 1], rows: [{ key: "k", value: "1" }] }, "a step that isn't a Parallel of Write Store steps"],
  ]) {
    const before = JSON.stringify(list());
    a = await send(payload);
    ok(a.length === 1 && a[0].type === "editFailed" && JSON.stringify(list()) === before, `refuses ${why}: ${a[0]?.payload?.message}`);
  }
})().catch((e) => { console.log("FAIL threw: " + e.stack); });
