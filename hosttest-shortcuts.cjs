// v0.3.53: the keyboard shortcuts (host/shortcuts.js): kept in globalState, only a clean {id: [combo]} shape,
// sent to every screen that asked, and a change reaches them all. The Workflows, Resources and Menus screens and
// the sidebar are wired to it.
const fs = require("fs"), Module = require("module");
const src = fs.readFileSync(process.argv[2], "utf8") + "\n;module.exports.__t={ShortcutsHost};";
const stub = new Proxy(function () {}, { get: (t, k) => (k === Symbol.toPrimitive ? () => "" : stub), apply: () => stub, construct: () => stub });
const m = new Module("ext"); m.filename = "/x/extension.js";
const orig = Module._load; Module._load = (r, p, i) => (r === "vscode" ? stub : orig(r, p, i));
m._compile(src, m.filename);
const { ShortcutsHost: K } = m.exports.__t;
const ok = (c, msg) => console.log((c ? "PASS " : "FAIL ") + msg);

(async () => {
  const store = new Map();
  K.attach({ globalState: { get: (k) => store.get(k), update: async (k, v) => store.set(k, v) } });
  ok(JSON.stringify(K.get()) === "{}", "no keys picked yet: {} (every screen uses its defaults)");
  const a = [], b = [];
  const wa = { postMessage: (msg) => a.push(msg) }, wb = { postMessage: (msg) => b.push(msg) };
  K.send(wa); K.send(wb);
  ok(a[0]?.type === "shortcuts" && JSON.stringify(a[0].payload.bindings) === "{}", "a screen that asks gets the keys");
  await K.set({ "node.layers": ["L"], "bad id!": ["X"], "node.panel": ["N", 5, "", "x".repeat(41)], "resources.list": "T", __proto__: { polluted: true } });
  ok(JSON.stringify(store.get("saturn.shortcuts")) === '{"node.layers":["L"],"node.panel":["N"]}', "only a clean {id: [combo]} is kept: " + JSON.stringify(store.get("saturn.shortcuts")));
  ok(a.at(-1).payload.bindings["node.layers"][0] === "L" && b.at(-1).payload.bindings["node.layers"][0] === "L", "a change is sent to every screen that asked");
  const gone = { postMessage: () => { throw new Error("disposed"); } };
  K.send(gone);
  await K.set({});
  ok(!K.screens.has(gone) && a.at(-1).payload.bindings && JSON.stringify(a.at(-1).payload.bindings) === "{}", "a closed screen is forgotten; Reset all sends {}");
  const page = [];
  await K.handle({ postMessage: (msg) => page.push(msg) }, { type: "setShortcuts", payload: { bindings: { "menus.list": ["M"] } } });
  ok(store.get("saturn.shortcuts")["menus.list"][0] === "M", "the page's setShortcuts keeps them");
  const raw = fs.readFileSync(process.argv[2], "utf8");
  ok(/case "fetchShortcuts":\s*ShortcutsHost\.send\(webview\)/.test(raw), "the Workflows screen answers fetchShortcuts");
  ok(/case "fetchShortcuts":\s*ShortcutsHost\.send\(this\.panel\.webview\)/.test(raw), "the Menus screen answers it");
  ok(/case "fetchShortcuts": \{\s*if \(message\.webview\) ShortcutsHost\.send/.test(raw), "the Resources screen answers it");
  ok(/case "saturn:openShortcuts":\s*await vscode4\.commands\.executeCommand\("saturn\.openShortcuts"\)/.test(raw) && /registerCommand\("saturn\.openShortcuts"/.test(raw), "the sidebar's button and the command open the page");
})().catch((e) => console.log("FAIL threw: " + e.stack));
