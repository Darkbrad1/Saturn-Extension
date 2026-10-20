// v0.3.30: the Menus panel's openInSaturn message opens <instance url>/menus in the browser.
const fs = require("fs"), Module = require("module");
const src = fs.readFileSync(process.argv[2], "utf8") + "\n;module.exports.__t={MenusPanel};";
const opened = [];
const stub = new Proxy(function () {}, { get: (t, k) => (k === Symbol.toPrimitive ? () => "" : stub), apply: () => stub, construct: () => stub });
// the bundle reads vscode through an import wrapper that copies its listed keys, so env and Uri are listed
const part = (k) => k === "env" ? { openExternal: async (u) => { opened.push(u.parsed); return true; }, clipboard: { writeText: async () => {} } }
  : k === "Uri" ? { parse: (s) => ({ parsed: s }), joinPath: () => stub, file: () => stub } : stub;
const vs = new Proxy({}, {
  get: (t, k) => part(k),
  ownKeys: () => ["env", "Uri"],
  getOwnPropertyDescriptor: (t, k) => ({ configurable: true, enumerable: true, value: part(k) }),
});
const m = new Module("ext"); m.filename = "/x/extension.js";
const orig = Module._load; Module._load = (r, p, i) => (r === "vscode" ? vs : orig(r, p, i));
m._compile(src, m.filename);
const { MenusPanel } = m.exports.__t;
const ok = (c, msg) => console.log((c ? "PASS " : "FAIL ") + msg);
(async () => {
  for (const url of ["https://loanapp.saturn.gd", "https://loanapp.saturn.gd/"]) {
    const panel = Object.create(MenusPanel.prototype);
    Object.assign(panel, { instance: { id: "i", url }, post() {} });
    await panel.handle({ type: "openInSaturn" });
  }
  ok(opened.length === 2 && opened.every((u) => u === "https://loanapp.saturn.gd/menus"), `Open in Saturn opens <instance>/menus (${opened.join(", ")})`);
})();
