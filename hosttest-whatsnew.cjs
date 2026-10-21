// v0.3.43: the What's new page (host/whatsnew.js): one webview tab with the release notes bundle under a nonce CSP;
// opening it again brings that tab forward; the sidebar's saturn:openWhatsNew runs the saturn.openWhatsNew command.
const fs = require("fs"), Module = require("module");
const src = fs.readFileSync(process.argv[2], "utf8") + "\n;module.exports.__t={WhatsNewHost};";
const made = [], commands = [];
const stub = new Proxy(function () {}, { get: (t, k) => (k === Symbol.toPrimitive ? () => "" : stub), apply: () => stub, construct: () => stub });
const panelFor = (viewType, title) => {
  const p = { viewType, title, revealed: 0, disposeFns: [], iconPath: null,
    webview: { html: "", cspSource: "vscode-resource:", asWebviewUri: (u) => ({ toString: () => `webview://${u.path}` }) },
    reveal() { this.revealed++; }, onDidDispose(fn) { this.disposeFns.push(fn); }, dispose() { this.disposeFns.forEach((f) => f()); } };
  made.push(p);
  return p;
};
const part = (k) => k === "window" ? { createWebviewPanel: (viewType, title) => panelFor(viewType, title), showErrorMessage() {}, showInformationMessage() {} }
  : k === "Uri" ? { joinPath: (base, ...segs) => ({ path: [base.path, ...segs].join("/") }), file: (f) => ({ path: f }), parse: (s) => ({ path: s }) }
  : k === "ViewColumn" ? { One: 1 } : k === "commands" ? { executeCommand: async (...a) => { commands.push(a); } } : stub;
const vs = new Proxy({}, {
  get: (t, k) => part(k),
  ownKeys: () => ["window", "Uri", "ViewColumn", "commands"],
  getOwnPropertyDescriptor: (t, k) => ({ configurable: true, enumerable: true, value: part(k) }),
});
const m = new Module("ext"); m.filename = "/x/extension.js";
const orig = Module._load; Module._load = (r, p, i) => (r === "vscode" ? vs : orig(r, p, i));
m._compile(src, m.filename);
const { WhatsNewHost } = m.exports.__t;
const ok = (c, msg) => console.log((c ? "PASS " : "FAIL ") + msg);

const ext = { path: "/ext" };
const first = WhatsNewHost.open(ext);
ok(made.length === 1 && first.viewType === "saturn.whatsNew" && first.title === "What's new", "opens one tab called What's new");
const html = first.webview.html;
const n = /script-src 'nonce-([^']+)'/.exec(html)?.[1];
ok(!!n && html.includes(`nonce="${n}"`) && html.includes("default-src 'none'"), "its page has a strict CSP with a nonce on its script");
ok(html.includes("/ext/dist/webview/news/index.js") && html.includes('id="news-root"'), "and loads the What's new bundle");
const again = WhatsNewHost.open(ext);
ok(made.length === 1 && again === first && first.revealed === 1, "opening it again brings the same tab forward");
first.dispose();
WhatsNewHost.open(ext);
ok(made.length === 2, "after it's closed, opening makes a new one");

const raw = fs.readFileSync(process.argv[2], "utf8");
ok(/case "saturn:openWhatsNew":\s*await vscode4\.commands\.executeCommand\("saturn\.openWhatsNew"\)/.test(raw), "the sidebar's What's new button runs saturn.openWhatsNew");
ok(/registerCommand\("saturn\.openWhatsNew"[\s\S]{0,200}WhatsNewHost\.open\(context\.extensionUri\)/.test(raw), "and that command opens the page");
const pkg = JSON.parse(fs.readFileSync("vsix/extension/package.json", "utf8"));
ok(pkg.contributes.commands.some((c) => c.command === "saturn.openWhatsNew" && c.title === "Saturn: What's new"), "the command is in the command palette");
