// v0.3.49: the workflow map's setStageTransition (a stage arrow dragged to another stage): the property_updater
// step gets the new stage in properties and _properties, as one draft edit; anything stale or wrong is refused
// with editFailed and changes nothing. Every request answers exactly once.
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

const pu = (status) => ({ id: "PU1", type: "command", operator: "property_updater", data: { properties: { status, note: "x" }, resource_id: "", _properties: [{ key: "status", value: status, editing: false }, { key: "note", value: "x", editing: false }] } });
const saved = {
  id: "wf", name: "W", commands: [], actions: [],
  stages: [
    { stage: "underwriting", label: "Underwriting", actions: [{ id: "A1", action: "approve", label: "Approve", task: { id: "T", type: "series", commands: [{ id: "E", type: "command", operator: "send_email", data: { to: "a" } }, pu("approved")] } }] },
    { stage: "approved", label: "Approved", actions: [] },
    { stage: "submitted", label: "Submitted", actions: [] },
  ],
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
const path = ["stages", 0, "actions", 0, "task", "commands", 1];
const send = async (payload) => { posted.length = 0; await panel.handleMessage({ type: "setStageTransition", payload: { workflowId: "wf", ...payload } }); return answers(); };
const step = () => panel.drafts.get("wf")?.definition.stages[0].actions[0].task.commands[1];

(async () => {
  let a = await send({ path, field: "status", from: "approved", to: "submitted" });
  ok(a.length === 1 && a[0].type === "editSaved", "a move answers once with editSaved " + JSON.stringify(posted.map((x) => [x.type, x.payload?.message])));
  ok(step().data.properties.status === "submitted" && step().data.properties.note === "x", "the step's properties say the new stage, the rest kept");
  ok(step().data._properties[0].value === "submitted" && step().data._properties[1].value === "x", "and its _properties rows too");
  ok(step().id === "PU1" && step().data.resource_id === "", "nothing else changes");
  ok(panel.drafts.get("wf").history.length === 1, "as one draft edit");

  for (const [payload, why] of [
    [{ path, field: "status", from: "approved", to: "submitted" }, "a stale map (it no longer sets the old stage)"],
    [{ path, field: "status", from: "submitted", to: "nowhere" }, "a stage that doesn't exist"],
    [{ path: ["stages", 0, "actions", 0, "task", "commands", 0], field: "status", from: "submitted", to: "approved" }, "a step that isn't a Property Updater"],
    [{ path, field: "__proto__", from: "submitted", to: "approved" }, "a prototype field"],
    [{ path: [], field: "status", from: "submitted", to: "approved" }, "no step"],
  ]) {
    a = await send(payload);
    ok(a.length === 1 && a[0].type === "editFailed" && step().data.properties.status === "submitted", `refuses ${why}: ${a[0]?.payload?.message}`);
  }
})().catch((e) => { console.log("FAIL threw: " + e.stack); });
