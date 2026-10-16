// v0.3.3 host patch: bulkSteps (delete / duplicate / mock several steps as one edit) and copyNodes ordering.
const fs = require("fs"), Module = require("module");
const raw = fs.readFileSync(process.argv[2], "utf8");
const i = raw.indexOf('case"bulkSteps"');
const j = raw.indexOf("a=>{let d=a;", i);
const k = raw.indexOf("return d})", j);
const body = raw.slice(j, k + "return d}".length);
const src = raw + `\n;module.exports.__t={bk$cmp};module.exports.__bulk=(a,s$,o$,m$)=>(${body})(a);`;
const stub = new Proxy(function () {}, { get: (t, k) => (k === Symbol.toPrimitive ? () => "" : stub), apply: () => stub, construct: () => stub });
const m = new Module("ext"); m.filename = "/x/extension.js";
const orig = Module._load; Module._load = (r, p, i) => (r === "vscode" ? stub : orig(r, p, i));
m._compile(src, m.filename);
const { bk$cmp } = m.exports.__t;
const bulk = (d, paths, op, mock) => m.exports.__bulk(d, [...paths].sort(bk$cmp).reverse(), op, mock);
const ok = (c, msg) => console.log((c ? "PASS " : "FAIL ") + msg);
const op = (o) => ({ type: "command", operator: o, data: {} });
const mk = () => ({ actions: [{ task: { type: "series", commands: [op("A"), { type: "if", true: { type: "series", commands: [op("T1"), op("T2")] }, false: { type: "series", commands: [] } }, op("B"), op("C")] } }] });
const names = (cs) => cs.map((c) => c.operator ?? c.type).join();
const P = (...x) => ["actions", 0, "task", "commands", ...x];

ok(JSON.stringify([P(2), P(0), P(1, "true", "commands", 1), P(10)].sort(bk$cmp)) === JSON.stringify([P(0), P(1, "true", "commands", 1), P(2), P(10)]), "paths sort numerically, nested in place");
let d = mk();
let out = bulk(d, [P(0), P(2), P(1, "true", "commands", 0)], "delete");
ok(names(out.actions[0].task.commands) === "if,C" && names(out.actions[0].task.commands[0].true.commands) === "T2", "delete several, across levels: " + names(out.actions[0].task.commands));
ok(names(d.actions[0].task.commands) === "A,if,B,C", "original not mutated");
out = bulk(mk(), [P(0), P(2)], "duplicate");
ok(names(out.actions[0].task.commands) === "A,A,if,B,B,C", "duplicate several, each after itself: " + names(out.actions[0].task.commands));
out = bulk(mk(), [P(0), P(1, "true", "commands", 1), P(3)], "mock", true);
const c = out.actions[0].task.commands;
ok(c[0].mock === true && c[1].true.commands[1].mock === true && c[3].mock === true && !c[2].mock && !c[1].true.commands[0].mock, "mock several");
let threw = false;
try { bulk(mk(), [P(9)], "delete"); } catch (e) { threw = /no longer where it was/.test(e.message); }
ok(threw, "a stale path refuses the whole change");
ok(raw.includes('case"copyNodes"') && /sort\(bk\$cmp\)\.map/.test(raw.slice(raw.indexOf('case"copyNodes"'), raw.indexOf('case"copyNodes"') + 600)), "copyNodes copies in document order");
