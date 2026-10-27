// v0.3.30: the Menus panel's openInSaturn message opens <instance url>/menus in the browser.
// v0.3.40: openResourceScreen opens a tab's resource on the Resources screen.
// v0.3.61: a delete sent by Save (confirmed) doesn't ask again, and the Undo offer doesn't hold up the next change.
// v0.3.63: viewRaw opens the menu's JSON in an untitled JSON tab.
const fs = require("fs"), Module = require("module");
const src = fs.readFileSync(process.argv[2], "utf8") + "\n;module.exports.__t={MenusPanel,ResourcePropertiesHost};";
const opened = [], docs = [];
// a part of vscode with some functions of its own; everything else is the stub
const withStub = (own) => new Proxy(own, { get: (t, k) => (k in t ? t[k] : stub) });
const stub = new Proxy(function () {}, { get: (t, k) => (k === Symbol.toPrimitive ? () => "" : stub), apply: () => stub, construct: () => stub });
// the bundle reads vscode through an import wrapper that copies its listed keys, so env and Uri are listed
const part = (k) => k === "env" ? { openExternal: async (u) => { opened.push(u.parsed); return true; }, clipboard: { writeText: async () => {} } }
  : k === "Uri" ? { parse: (s) => ({ parsed: s }), joinPath: () => stub, file: () => stub }
  : k === "workspace" ? withStub({ openTextDocument: async (o) => { docs.push(o); return o; } })
  : k === "ViewColumn" ? { One: 1, Beside: -2 }
  : k === "window" ? withStub({ showTextDocument: async (d, o) => { docs.push({ shown: d, ...o }); } }) : stub;
const vs = new Proxy({}, {
  get: (t, k) => part(k),
  ownKeys: () => ["env", "Uri", "workspace", "window", "ViewColumn"],
  getOwnPropertyDescriptor: (t, k) => ({ configurable: true, enumerable: true, value: part(k) }),
});
const m = new Module("ext"); m.filename = "/x/extension.js";
const orig = Module._load; Module._load = (r, p, i) => (r === "vscode" ? vs : orig(r, p, i));
m._compile(src, m.filename);
const { MenusPanel, ResourcePropertiesHost } = m.exports.__t;
const ok = (c, msg) => console.log((c ? "PASS " : "FAIL ") + msg);
(async () => {
  for (const url of ["https://loanapp.saturn.gd", "https://loanapp.saturn.gd/"]) {
    const panel = Object.create(MenusPanel.prototype);
    Object.assign(panel, { instance: { id: "i", url }, post() {} });
    await panel.handle({ type: "openInSaturn" });
  }
  ok(opened.length === 2 && opened.every((u) => u === "https://loanapp.saturn.gd/menus"), `Open in Saturn opens <instance>/menus (${opened.join(", ")})`);
  const shown = [];
  ResourcePropertiesHost.open = (uri, manager, instance, resource) => shown.push({ uri, manager, instance, resource });
  const panel = Object.create(MenusPanel.prototype);
  Object.assign(panel, { extensionUri: "ext", manager: "mgr", instance: { id: "i", url: "https://x" }, post() {} });
  await panel.handle({ type: "openResourceScreen", resource: "Loan" });
  ok(shown.length === 1 && shown[0].resource === "Loan" && shown[0].uri === "ext" && shown[0].manager === "mgr" && shown[0].instance.id === "i", "openResourceScreen opens that resource on the Resources screen");
  await panel.handle({ type: "viewRaw", text: '{"label":"Loans"}' });
  ok(docs.length === 2 && docs[0].content === '{"label":"Loans"}' && docs[0].language === "json" && docs[1].preview === true, "viewRaw opens the menu's JSON in a JSON tab");
  const raw = fs.readFileSync(process.argv[2], "utf8");
  ok(/case "delete":\s*await this\.serial\(\(\) => this\.remove\(String\(message\.id \?\? ""\), message\.confirmed === true\)\)/.test(raw), "the Menus panel's delete passes confirmed on");
  ok(/async remove\(menuId, confirmed = false\)[\s\S]{0,400}if \(!confirmed && \(await vscode16\.window\.showWarningMessage/.test(raw), "a confirmed delete skips the question");
  ok(/Promise\.resolve\(vscode16\.window\.showInformationMessage\(`Saturn: "\$\{safeText\(menu\.label, 60\)\}" menu deleted\.`, "Undo"\)\)\.then/.test(raw), "the Undo offer isn't waited for");
})();
