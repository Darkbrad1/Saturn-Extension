// Runs the real (patched) host move function on the case that used to corrupt data.
const fs = require("fs"), Module = require("module");
const src = fs.readFileSync(process.argv[2], "utf8") + "\n;module.exports.__t={on};";
const stub = new Proxy(function () {}, { get: (t, k) => (k === Symbol.toPrimitive ? () => "" : stub), apply: () => stub, construct: () => stub });
const m = new Module("ext"); m.filename = "/x/extension.js";
const orig = Module._load; Module._load = (r, p, i) => (r === "vscode" ? stub : orig(r, p, i));
m._compile(src, m.filename);
const { on } = m.exports.__t;
const B = ["actions", 0, "task", "commands"];
const wf = (cmds) => ({ actions: [{ task: { type: "series", commands: cmds } }] });
const show = (r) => JSON.stringify(r.actions[0].task.commands);
const t = (name, f) => { try { console.log(name.padEnd(34), show(f())); } catch (e) { console.log(name.padEnd(34), "throws:", e.message); } };
t("earlier step -> later container", () => on(wf([{ operator: "A" }, { type: "parallel", commands: [] }, { operator: "C" }]), [...B, 0], [...B, 1, "commands"], 0));
t("later step -> earlier container", () => on(wf([{ type: "parallel", commands: [] }, { operator: "B" }]), [...B, 1], [...B, 0, "commands"], 0));
t("reorder in same list (0 -> end)", () => on(wf([{ operator: "A" }, { operator: "B" }, { operator: "C" }]), [...B, 0], B, 3));
t("into own child (must refuse)", () => on(wf([{ type: "parallel", commands: [{ operator: "X" }] }]), [...B, 0], [...B, 0, "commands"], 0));
