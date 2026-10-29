// v0.3.70: the Workflows panel's page lets pictures load (a rich text note's pictures: https: links and data:
// addresses), while scripts still need the nonce and nothing else is allowed.
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

const page = WorkflowsPanel.prototype.getHtml.call({
  panel: { webview: { cspSource: "vscode-webview://x", asWebviewUri: () => "vscode-webview://x/file" } },
  extensionUri: {},
});
const csp = /content="(default-src[^"]+)"/.exec(page)?.[1] ?? "";
ok(/img-src vscode-webview:\/\/x https: data:;/.test(csp), "pictures may come from the extension, https: links and data: addresses: " + csp);
ok(/default-src 'none'/.test(csp) && /script-src 'nonce-[^']+';/.test(csp) && !/unsafe-eval/.test(csp), "everything else stays shut, and scripts still need the nonce");
