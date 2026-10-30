// v0.3.64: the switch step. Its view (the value, each case with its steps, Otherwise), as Saturn stores it
// ({type: "switch", data: {value}, cases: [{value, command}], otherwise}); setSwitchCases (rename, reorder, add,
// remove as one draft edit, steps kept by where each case came from); updateOperator / addOperator for a switch;
// moving a step into a case that holds one plain step (it becomes a group first), and out of one (0.3.75); and the walkers that count steps,
// find command references and name a step's place.
const fs = require("fs"), Module = require("module");
const src = fs.readFileSync(process.argv[2], "utf8") +
  "\n;module.exports.__t={WorkflowsPanel,stepView,switchCasesEdit,moveStep,moveStepsEdit,countNestedSteps,findCommandReferences,describeStepPath};";
const stub = new Proxy(function () {}, { get: (t, k) => (k === Symbol.toPrimitive ? () => "" : stub), apply: () => stub, construct: () => stub });
const parts = ["window", "workspace", "commands", "Uri", "env", "ViewColumn", "EventEmitter", "Disposable"];
const vs = new Proxy({}, { get: () => stub, ownKeys: () => parts, getOwnPropertyDescriptor: () => ({ configurable: true, enumerable: true, value: stub }) });
const m = new Module("ext"); m.filename = "/x/extension.js";
const orig = Module._load; Module._load = (r, p, i) => (r === "vscode" ? vs : orig(r, p, i));
m._compile(src, m.filename);
const { WorkflowsPanel, stepView, switchCasesEdit, moveStep, moveStepsEdit, countNestedSteps, findCommandReferences, describeStepPath } = m.exports.__t;
const ok = (c, msg) => console.log((c ? "PASS " : "FAIL ") + msg);

// the owner's real switch (Assign staff): one case holding a plain step, Otherwise a plain step
const sw = () => ({
  id: "STAFFROLEBRANCH", type: "switch", data: { value: "{{ _store.who }}" },
  cases: [{ value: "underwriter", command: { id: "ASSIGNBOTH", type: "command", operator: "property_updater", data: { properties: { underwriter: "x" } } } }],
  otherwise: { id: "OTHER", type: "command", operator: "property_updater", data: { properties: { manager: "x" } } },
});
const saved = {
  id: "wf", name: "W", stages: [], actions: [],
  commands: [
    { id: "C1", name: "assign", label: "Assign", command: { id: "S", type: "series", commands: [{ id: "D", type: "command", operator: "debug", data: { message: "hi" } }, sw()] } },
    { id: "C2", name: "other", label: "Other", command: { id: "S2", type: "series", commands: [] } },
  ],
};
const swPath = ["commands", 0, "command", "commands", 1];

(async () => {
  // ---- the view
  const v = stepView(sw(), new Map(), swPath, 0);
  ok(v.kind === "switch" && v.value === "{{ _store.who }}", "a switch's view: its kind and the value it checks");
  ok(v.cases.length === 1 && v.cases[0].value === "underwriter" && v.cases[0].steps.length === 1 && v.cases[0].steps[0].stepId === "ASSIGNBOTH", "each case with its value and its steps (a plain step as one step)");
  ok(JSON.stringify(v.cases[0].childrenPath) === JSON.stringify([...swPath, "cases", 0, "command", "commands"]), "a case's steps go under cases[i].command.commands");
  ok(v.otherwise.length === 1 && v.otherwise[0].stepId === "OTHER" && JSON.stringify(v.otherwisePath) === JSON.stringify([...swPath, "otherwise", "commands"]), "Otherwise and where its steps go");
  const odd = stepView({ type: "switch", data: { value: 3 }, cases: [{ value: 1 }, null], otherwise: null }, new Map(), [], 0);
  ok(odd.value === "3" && odd.cases.length === 2 && odd.cases[0].value === "1" && odd.cases[1].value === "" && odd.cases[1].steps.length === 0 && odd.otherwise.length === 0, "odd shapes (numbers, a case with no steps, no Otherwise) still show");

  // ---- the cases rebuilt
  const def = JSON.parse(JSON.stringify(saved));
  let next = switchCasesEdit(def, swPath, [{ value: "manager", from: null }, { value: "underwriter", from: 0 }]);
  let cs = next.commands[0].command.commands[1].cases;
  ok(cs.length === 2 && cs[0].value === "manager" && cs[0].command.type === "series" && cs[0].command.commands.length === 0, "a new case starts with an empty group");
  ok(cs[1].value === "underwriter" && cs[1].command.id === "ASSIGNBOTH", "a moved case keeps its steps");
  ok(def.commands[0].command.commands[1].cases.length === 1, "the definition passed in isn't changed");
  next = switchCasesEdit(def, swPath, [{ value: "underwriting", from: 0 }]);
  ok(next.commands[0].command.commands[1].cases[0].value === "underwriting" && next.commands[0].command.commands[1].cases[0].command.id === "ASSIGNBOTH", "a rename keeps the steps");
  ok(switchCasesEdit(def, swPath, []).commands[0].command.commands[1].cases.length === 0, "a case left out is removed");
  const num = { commands: [{ command: { type: "series", commands: [{ type: "switch", data: { value: "x" }, cases: [{ value: 2, command: { type: "series", commands: [] } }] }] } }] };
  ok(switchCasesEdit(num, ["commands", 0, "command", "commands", 0], [{ value: "2", from: 0 }]).commands[0].command.commands[0].cases[0].value === 2, "a value typed the same keeps its stored type (a number stays a number)");
  let threw = null;
  try { switchCasesEdit(def, ["commands", 0, "command", "commands", 0], []); } catch (e) { threw = e.message; }
  ok(threw && /no longer where it was/.test(threw), "refused when the path isn't a switch: " + threw);
  next = switchCasesEdit(def, swPath, [{ value: "a", from: 0 }, { value: "b", from: 0 }]);
  ok(next.commands[0].command.commands[1].cases[1].command.type === "series" && next.commands[0].command.commands[1].cases[1].command.commands.length === 0, "one case's steps never go to two cases (the second starts empty)");

  // ---- moving a step into a case that holds one plain step
  next = moveStep(def, ["commands", 0, "command", "commands", 0], [...swPath, "cases", 0, "command", "commands"], 1);
  let c0 = next.commands[0].command.commands[0].cases[0].command;
  ok(c0.type === "series" && c0.commands.length === 2 && c0.commands[0].id === "ASSIGNBOTH" && c0.commands[1].id === "D", "moveStep: the case's plain step becomes a group, the moved step goes after it");
  next = moveStepsEdit(def, [["commands", 0, "command", "commands", 0]], [...swPath, "otherwise", "commands"], 0);
  const ow = next.commands[0].command.commands[0].otherwise;
  ok(ow.type === "series" && ow.commands.map((x) => x.id).join() === "D,OTHER", "moveSteps: the same for Otherwise");

  // ---- moving a step out of a case that holds one plain step (0.3.75): the case is left empty, not broken
  const casePath = [...swPath, "cases", 0, "command"];
  next = moveStep(def, casePath, ["commands", 0, "command", "commands"], 0);
  let steps = next.commands[0].command.commands;
  ok(steps[0].id === "ASSIGNBOTH" && steps[2].cases[0].command.type === "series" && steps[2].cases[0].command.commands.length === 0 && steps[2].cases[0].value === "underwriter", "moveStep: a case's only step moves out; the case keeps its value and is left empty");
  next = moveStepsEdit(def, [[...swPath, "otherwise"]], ["commands", 1, "command", "commands"], 0);
  ok(next.commands[1].command.commands[0].id === "OTHER" && next.commands[0].command.commands[1].otherwise.type === "series" && next.commands[0].command.commands[1].otherwise.commands.length === 0, "moveSteps: Otherwise's only step moves to another command; Otherwise is left empty");
  let refused = null;
  try { moveStepsEdit(def, [casePath], [...casePath, "commands"], 0); } catch (e) { refused = e.message; }
  ok(/inside itself/.test(refused ?? ""), "moveSteps: dropping it into its own case is refused: " + refused);

  // ---- the walkers
  ok(countNestedSteps(sw()) === 2, "counting steps reaches the cases and Otherwise: " + countNestedSteps(sw()));
  const withRef = JSON.parse(JSON.stringify(saved));
  withRef.commands[0].command.commands[1].cases[0].command = { type: "series", commands: [{ id: "C2", type: "reference", operator: "reference" }] };
  withRef.commands[0].command.commands[1].otherwise = { id: "C2", type: "reference", operator: "reference" };
  const refs = findCommandReferences(withRef, "C2");
  ok(refs.length === 2, "a command used inside a case and in Otherwise is found both times: " + JSON.stringify(refs));
  ok(describeStepPath([...swPath, "cases", 0, "command", "commands", 0]).includes("case 1") && describeStepPath([...swPath, "otherwise"]).includes("the otherwise branch"), "a step's place in words names its case: " + describeStepPath([...swPath, "cases", 0, "command", "commands", 0]));

  // ---- the panel's messages
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
  const answers = () => posted.filter((p) => p.type === "editSaved" || p.type === "editFailed" || p.type === "editRejected");
  const send = async (type, payload) => { posted.length = 0; await panel.handleMessage({ type, payload: { workflowId: "wf", ...payload } }); return answers(); };
  const draftSw = () => panel.drafts.get("wf")?.definition.commands[0].command.commands[1];
  let a = await send("setSwitchCases", { path: swPath, cases: [{ value: "underwriter", from: 0 }, { value: "manager", from: null }] });
  ok(a.length === 1 && a[0].type === "editSaved" && draftSw().cases.length === 2 && draftSw().cases[1].value === "manager", "setSwitchCases answers once and changes the cases " + JSON.stringify(a.map((x) => x.type)));
  ok(panel.drafts.get("wf").history.length === 1, "as one draft edit");
  a = await send("setSwitchCases", { path: ["commands", 0, "command", "commands", 0], cases: [] });
  ok(a.length === 1 && a[0].type === "editFailed", "a path that isn't a switch is refused with editFailed");
  a = await send("updateOperator", { path: swPath, operator: "switch", values: { value: "{{ _store.role }}" } });
  ok(a.length === 1 && a[0].type === "editSaved" && draftSw().data.value === "{{ _store.role }}" && draftSw().cases.length === 2 && draftSw().otherwise.id === "OTHER", "updateOperator changes the value it checks and keeps the cases and Otherwise");
  a = await send("updateOperator", { path: swPath, operator: "switch", values: { value: "  " } });
  ok(a.length === 1 && a[0].type === "editRejected" && draftSw().data.value === "{{ _store.role }}", "an empty value is refused (editRejected) and nothing changes");
  a = await send("addOperator", { childrenPath: ["commands", 1, "command", "commands"], index: 0, operator: "switch", values: { value: "{{ _flow.kind }}" } });
  const added = panel.drafts.get("wf").definition.commands[1].command.commands[0];
  ok(a.length === 1 && a[0].type === "editSaved" && added.type === "switch" && added.data.value === "{{ _flow.kind }}" && Array.isArray(added.cases) && added.cases.length === 0 && added.otherwise.type === "series", "addOperator adds a switch: the value, no cases, an empty Otherwise");
})().catch((e) => { console.log("FAIL threw: " + e.stack); });
