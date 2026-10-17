// Runs the real host reorder helpers with the indices the node view sends.
const fs = require("fs"), Module = require("module");
const src = fs.readFileSync(process.argv[2], "utf8") + "\n;module.exports.__t={_a:reorderStage,Ea:reorderAction};";
const stub = new Proxy(function () {}, { get: (t, k) => (k === Symbol.toPrimitive ? () => "" : stub), apply: () => stub, construct: () => stub });
const m = new Module("ext"); m.filename = "/x/extension.js";
const orig = Module._load; Module._load = (r, p, i) => (r === "vscode" ? stub : orig(r, p, i));
m._compile(src, m.filename);
const { _a, Ea } = m.exports.__t;
const moveTarget = (from, to) => (to > from ? to + 1 : to); // App.tsx
const wf = () => ({ stages: ["a", "b", "c"].map((s) => ({ stage: s, actions: [{ action: s + "1" }, { action: s + "2" }, { action: s + "3" }] })), actions: [{ action: "g1" }, { action: "g2" }] });
const st = (d) => d.stages.map((s) => s.stage).join("");
console.log("stage 0 down ->", st(_a(wf(), 0, moveTarget(0, 1))), "(want bac)");
console.log("stage 2 up   ->", st(_a(wf(), 2, moveTarget(2, 1))), "(want acb)");
console.log("stage drag 0 onto 2 ->", st(_a(wf(), 0, moveTarget(0, 2))), "(want bca)");
console.log("action 0 down in stage 1 ->", Ea(wf(), 1, 0, moveTarget(0, 1)).stages[1].actions.map((a) => a.action).join(","), "(want b2,b1,b3)");
console.log("global 1 up ->", Ea(wf(), null, 1, moveTarget(1, 0)).actions.map((a) => a.action).join(","), "(want g2,g1)");
