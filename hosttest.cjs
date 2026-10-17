const fs = require("fs"), path = require("path"), Module = require("module");
const src = fs.readFileSync(process.argv[2], "utf8") + "\n;module.exports.__t={Ke,N,ue,Tr,yr};";
const stub = new Proxy(function () {}, { get: (t, k) => (k === Symbol.toPrimitive ? () => "" : stub), apply: () => stub, construct: () => stub });
const m = new Module("ext"); m.filename = "/x/extension.js"; m.paths = Module._nodeModulePaths(path.dirname(process.argv[2]));
const origLoad = Module._load;
Module._load = (req, parent, isMain) => (req === "vscode" ? stub : origLoad(req, parent, isMain));
m._compile(src, m.filename);
const { Ke, N, ue, Tr } = m.exports.__t;
const def = { id: "w", name: "W", stages: [{ stage: "s", actions: [{ id: "a", action: "a", task: { type: "series", commands: [
  { id: "A", type: "command", operator: "property_updater", data: { properties: { status: "approved" } }, mock: true },
  { id: "B", type: "command", operator: "property_updater", data: {}, mock: false },
  { type: "each", reference: "{{x}}", command: { type: "series", commands: [{ type: "command", operator: "x", data: {}, mock: true }] } } ] } }] }] };
const vm = Ke(def, new Map());
const kids = vm.stages[0].actions[0].flow.children;
console.log("view mock flags:", kids.map((k) => k.mock ?? false), "nested:", kids[2].children[0].mock ?? false);
console.log("step ids:", kids.map((k) => k.stepId ?? null), "(operators carry their id)");
// the exact mutator the setStepMock case runs
const p = ["stages", 0, "actions", 0, "task", "commands", 0];
const flip = (d, path, on) => ue(d, path, { ...N(d, path), mock: !!on });
const off = flip(def, p, false);
console.log("after enable:", JSON.stringify(N(off, p)), "| original untouched:", N(def, p).mock);
console.log("summary label:", Tr(N(def, p), new Map()));
