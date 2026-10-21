// v0.3.36: undo answers every request exactly once (editSaved or editFailed). The node view counts each
// request as a pending edit and shows "Applying…" until it hears back; undoing a draft edit used to send
// no answer, so it stayed on "Applying…".
const fs = require("fs"), Module = require("module");
const src = fs.readFileSync(process.argv[2], "utf8") + "\n;module.exports.__t={WorkflowsPanel};";
const stub = new Proxy(function () {}, { get: (t, k) => (k === Symbol.toPrimitive ? () => "" : stub), apply: () => stub, construct: () => stub });
const m = new Module("ext"); m.filename = "/x/extension.js";
const orig = Module._load; Module._load = (r, p, i) => (r === "vscode" ? stub : orig(r, p, i));
m._compile(src, m.filename);
const { WorkflowsPanel } = m.exports.__t;
const ok = (c, msg) => console.log((c ? "PASS " : "FAIL ") + msg);

const saved = { id: "wf", name: "W", stages: [], commands: [], actions: [{ id: "a", action: "a", label: "A", task: { type: "series", commands: [] } }] };
const posted = [];
const make = (extra = {}) => {
  const panel = Object.create(WorkflowsPanel.prototype);
  Object.assign(panel, {
    panel: { webview: { postMessage: (msg) => posted.push(msg) } },
    drafts: new Map(), undoSnapshots: new Map(),
    persistDrafts() {}, postDraftState() {},
    getOperatorCatalog: async () => ({}),
    readWorkflow: async () => ({ definition: JSON.parse(JSON.stringify(saved)), offline: false }),
    manager: {}, instance: { id: "i", url: "https://x" },
    ...extra,
  });
  return panel;
};
const answers = () => posted.filter((p) => p.type === "editSaved" || p.type === "editFailed");

(async () => {
  const panel = make();
  await panel.handleMessage({ type: "renameNode", payload: { workflowId: "wf", kind: "action", path: ["actions", 0], label: "B" } });
  await panel.handleMessage({ type: "renameNode", payload: { workflowId: "wf", kind: "action", path: ["actions", 0], label: "C" } });
  ok(panel.drafts.get("wf")?.history.length === 2, "two draft edits");

  posted.length = 0;
  await panel.handleMessage({ type: "undoLastEdit", payload: { workflowId: "wf" } });
  ok(answers().length === 1 && answers()[0].type === "editSaved" && answers()[0].payload.canUndo === true, "undoing a draft edit answers once with editSaved (more to undo)");
  ok(posted.some((p) => p.type === "workflow" && p.payload.actions?.[0]?.label === "B"), "and sends the workflow as it was");

  posted.length = 0;
  await panel.handleMessage({ type: "undoLastEdit", payload: { workflowId: "wf" } });
  ok(answers().length === 1 && answers()[0].type === "editSaved" && answers()[0].payload.canUndo === false, "undoing the last one answers once (nothing left)");
  ok(!panel.drafts.has("wf"), "the draft is gone");

  posted.length = 0;
  await panel.handleMessage({ type: "undoLastEdit", payload: { workflowId: "wf" } });
  ok(answers().length === 1 && answers()[0].type === "editFailed", "with nothing to undo it answers once with editFailed");

  // a failure while undoing still answers
  const broken = make({ getOperatorCatalog: async () => { throw new Error("catalog down"); } });
  broken.drafts.set("wf", { base: saved, definition: saved, history: [saved], summaries: ["x"] });
  posted.length = 0;
  await broken.handleMessage({ type: "undoLastEdit", payload: { workflowId: "wf" } });
  ok(answers().length === 1 && answers()[0].type === "editFailed" && /catalog down/.test(answers()[0].payload.message), "a failure while undoing answers with editFailed");

  // the session snapshot (after an edit saved offline): applyEdit answers, and only once
  const snap = make();
  snap.undoSnapshots.set("wf", JSON.parse(JSON.stringify(saved)));
  posted.length = 0;
  await snap.handleMessage({ type: "undoLastEdit", payload: { workflowId: "wf" } });
  ok(answers().length === 1 && answers()[0].type === "editSaved", "undoing from the session snapshot answers once " + JSON.stringify(answers().map((a) => a.type)));
})().catch((e) => { console.log("FAIL threw: " + e.stack); });
