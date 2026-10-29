// v0.3.69: the node view's cards moved and resized by hand are kept in the same file as the workflow map's boxes
// (map-layouts.json), keyed "<workflow id>::<tree>::<direction>". cleanMapLayout keeps x / y (how far a card was
// moved) and now a width `w` (120 to 2000), and drops anything else.
const fs = require("fs"), Module = require("module");
const src = fs.readFileSync(process.argv[2], "utf8") + "\n;module.exports.__t={WorkflowsPanel};";
const stub = new Proxy(function () {}, { get: (t, k) => (k === Symbol.toPrimitive ? () => "" : stub), apply: () => stub, construct: () => stub });
const parts = ["window", "workspace", "commands", "Uri", "env", "ViewColumn", "EventEmitter", "Disposable"];
const vs = new Proxy({}, { get: () => stub, ownKeys: () => parts, getOwnPropertyDescriptor: () => ({ configurable: true, enumerable: true, value: stub }) });
const m = new Module("ext"); m.filename = "/x/extension.js";
const orig = Module._load; Module._load = (r, p, i) => (r === "vscode" ? vs : orig(r, p, i));
m._compile(src, m.filename);
const { WorkflowsPanel } = m.exports.__t;
const ok = (c, msg) => console.log((c ? "PASS " : "FAIL ") + msg);
const clean = WorkflowsPanel.cleanMapLayout;

const out = clean({ "s:ABC": { x: 12.4, y: -30.6, w: 412.7 }, "n:0": { x: 5, y: 6 } });
ok(JSON.stringify(out) === JSON.stringify({ "s:ABC": { x: 12, y: -31, w: 413 }, "n:0": { x: 5, y: 6 } }), "a card's move and width are kept, rounded: " + JSON.stringify(out));
const odd = clean({ a: { x: 1, y: 2, w: 50 }, b: { x: 1, y: 2, w: 99999 }, c: { x: 1, y: 2, w: "wide" }, d: { x: "1", y: 2 }, __proto__x: { x: 1, y: 1 } });
ok(!("w" in odd.a) && !("w" in odd.b) && !("w" in odd.c) && !("d" in odd), "a width out of range or not a number is dropped, and so is a place that isn't numbers");
ok(clean(null) === null && clean([]) === null && clean({}) === null, "nothing to keep gives null (the layout is forgotten)");
const proto = JSON.parse('{"__proto__": {"x": 1, "y": 1}, "ok": {"x": 1, "y": 1}}');
ok(JSON.stringify(Object.keys(clean(proto))) === '["ok"]', "a prototype key is never kept");
