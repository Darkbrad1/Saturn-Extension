// v0.3.27: the Workflows panel's messages for the node view's Form / Parameters tab: setFormFields (the whole field
// list as one draft edit, with its keys checked), fetchSavedForm (the form as saved), fetchResourceFields.
const fs = require("fs"), Module = require("module");
const src = fs.readFileSync(process.argv[2], "utf8") + "\n;module.exports.__t={WorkflowsPanel};";
const stub = new Proxy(function () {}, { get: (t, k) => (k === Symbol.toPrimitive ? () => "" : stub), apply: () => stub, construct: () => stub });
const m = new Module("ext"); m.filename = "/x/extension.js";
const orig = Module._load; Module._load = (r, p, i) => (r === "vscode" ? stub : orig(r, p, i));
m._compile(src, m.filename);
const { WorkflowsPanel } = m.exports.__t;
const ok = (c, msg) => console.log((c ? "PASS " : "FAIL ") + msg);

const staff = { key: "staff", label: "Staff", type: "string", map: { reference: "User" }, hideInTable: false };
const saved = { id: "wf", name: "W", stages: [], commands: [{ id: "c", name: "c", label: "C", parameters: { fields: [{ key: "template", label: "Template", type: "string" }] }, command: { type: "series", commands: [] } }],
  actions: [{ id: "a", action: "a", label: "A", task: { type: "series", commands: [] }, form: { sections: [{ id: "s1" }], fields: [staff] } }] };
const posted = [];
const panel = Object.create(WorkflowsPanel.prototype);
Object.assign(panel, {
  panel: { webview: { postMessage: (msg) => posted.push(msg) } },
  drafts: new Map(),
  persistDrafts() {},
  postDraftState() {},
  getOperatorCatalog: async () => ({}),
  readWorkflow: async () => ({ definition: JSON.parse(JSON.stringify(saved)), offline: false }),
  manager: {}, instance: { id: "i", url: "https://x" },
});
const last = (type) => [...posted].reverse().find((p) => p.type === type);

(async () => {
  const fields = [{ key: "due", label: "Due", type: "date" }, { ...staff, label: "Staff member", key: "staff_id" }];
  await panel.handleMessage({ type: "setFormFields", payload: { workflowId: "wf", ownerPath: ["actions", 0], formKey: "form", fields, summary: "Changed field \"Staff\"" } });
  const d = panel.drafts.get("wf");
  ok(d && d.definition.actions[0].form.fields.map((f) => f.key).join() === "due,staff_id" && d.definition.actions[0].form.fields[1].map.reference === "User", "setFormFields puts the whole list in the draft (order, new, renamed)");
  ok(d.definition.actions[0].form.sections[0].id === "s1", "the form's sections are kept");
  ok(d.summaries.at(-1).startsWith("Changed field \"Staff\"") && d.history.length === 1, "one draft edit, with its summary");
  ok(last("editSaved") && last("workflow"), "the edit is posted back like any other");

  const before = JSON.stringify(panel.drafts.get("wf").definition);
  for (const [bad, why] of [
    [[{ key: "a" }, { key: "a" }], "Two fields have the same key."],
    [[{ key: "1x" }], "A field has no valid key"],
    [[{ label: "no key" }], "A field has no valid key"],
    [[JSON.parse('{"key":"k","__proto__":{"x":1}}')], "can't be written"],
    ["nope", "weren't sent"],
  ]) {
    posted.length = 0;
    await panel.handleMessage({ type: "setFormFields", payload: { workflowId: "wf", ownerPath: ["actions", 0], formKey: "form", fields: bad } });
    ok(last("editFailed")?.payload.message.includes(why) && JSON.stringify(panel.drafts.get("wf").definition) === before, `refused: ${why}`);
  }

  posted.length = 0;
  await panel.handleMessage({ type: "fetchSavedForm", payload: { workflowId: "wf", ownerPath: ["actions", 0], formKey: "form" } });
  const s = last("savedForm")?.payload;
  ok(s && s.fields.length === 1 && s.fields[0].key === "staff" && s.fields[0].label === "Staff", "fetchSavedForm answers with the form as saved, not the draft");
  posted.length = 0;
  await panel.handleMessage({ type: "fetchSavedForm", payload: { workflowId: "other", ownerPath: ["commands", 0], formKey: "parameters" } });
  ok(last("savedForm")?.payload.fields[0]?.key === "template", "a workflow with no draft is read from the instance");

  await panel.handleMessage({ type: "setFormFields", payload: { workflowId: "wf", ownerPath: ["commands", 0], formKey: "parameters", fields: [] } });
  ok(Array.isArray(panel.drafts.get("wf").definition.commands[0].parameters.fields) && panel.drafts.get("wf").definition.commands[0].parameters.fields.length === 0, "a command's parameters can be emptied");

  // a field's code setting opened as a file, then saved
  panel.drafts.delete("wf");
  const node = { kind: "fieldCode", workflowId: "wf", path: ["actions", 0], ownerId: "a", formKey: "form", key: "staff", settingPath: ["lookup_reference"] };
  await panel.saveFieldCode(node, "async () => [1]");
  let f0 = panel.drafts.get("wf").definition.actions[0].form.fields[0];
  ok(f0.lookup_reference === "async () => [1]" && f0.map.reference === "User" && f0.label === "Staff", "saving the file writes that one setting into the field in the draft");
  await panel.saveFieldCode({ ...node, settingPath: ["rendering", "options", "code"] }, "<b/>");
  ok(panel.drafts.get("wf").definition.actions[0].form.fields[0].rendering.options.code === "<b/>" && panel.drafts.get("wf").history.length === 2, "a nested setting too, each save one draft edit");
  // the action moved since the file was opened: found by its id
  panel.drafts.get("wf").definition.actions.unshift({ id: "z", action: "z", label: "Z", task: { type: "series", commands: [] } });
  await panel.saveFieldCode(node, "moved");
  ok(panel.drafts.get("wf").definition.actions[1].form.fields[0].lookup_reference === "moved" && !panel.drafts.get("wf").definition.actions[0].form, "an action that moved is found by its id");
  posted.length = 0;
  await panel.saveFieldCode({ ...node, key: "gone" }, "x").catch(() => {}); // (the stub has no error popup)
  ok(/no longer in this form/.test(last("editFailed")?.payload.message ?? ""), "a field that's gone says the file writes nowhere");
  for (const bad of [["key"], ["__proto__", "x"], [], "lookup_reference"]) {
    posted.length = 0;
    await panel.handleMessage({ type: "openFieldCode", payload: { workflowId: "wf", ownerPath: ["actions", 1], formKey: "form", key: "staff", path: bad, text: "" } });
    ok(/can't be opened as a file/.test(last("editFailed")?.payload.message ?? ""), `openFieldCode refuses the path ${JSON.stringify(bad)}`);
  }
})();
