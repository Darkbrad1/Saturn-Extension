// The host's addOperator path for operator "reference" (what the Add menu's command entries send).
const fs = require("fs"), Module = require("module");
const src = fs.readFileSync(process.argv[2], "utf8") + "\n;module.exports.__t={vo,xr,Ar,Ge};";
const stub = new Proxy(function () {}, { get: (t, k) => (k === Symbol.toPrimitive ? () => "" : stub), apply: () => stub, construct: () => stub });
const m = new Module("ext"); m.filename = "/x/extension.js";
const orig = Module._load; Module._load = (r, p, i) => (r === "vscode" ? stub : orig(r, p, i));
m._compile(src, m.filename);
const { vo, xr, Ar, Ge } = m.exports.__t;
const def = { commands: [{ id: "notify_customer", name: "notify_customer", parameters: { fields: [{ key: "template" }] }, command: { type: "series", commands: [] } }, { id: "log_it", name: "log_it", parameters: [], command: { type: "series", commands: [] } }],
  actions: [{ task: { type: "series", commands: [] } }] };
const add = (values) => { const { command: f, ...R } = values; return vo(f, xr(R, Ar(def, f))); };
console.log("with parameter:   ", JSON.stringify(add({ command: "notify_customer", template: "rejected", stray: "x" })));
console.log("without:          ", JSON.stringify(add({ command: "log_it" })));
const out = Ge(def, ["actions", 0, "task", "commands"], 0, add({ command: "log_it" }));
console.log("inserted:         ", JSON.stringify(out.actions[0].task.commands));
