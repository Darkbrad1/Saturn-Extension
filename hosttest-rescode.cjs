// v0.3.45: the Resources screen's "Open in a file" (host/resources.js openCode): the code goes into a file in the
// extension's storage, opened beside the screen; saving it posts codeFromFile to the screen (an unsaved change there).
const fs = require("fs"), Module = require("module");
const src = fs.readFileSync(process.argv[2], "utf8") + "\n;module.exports.__t={ResourcePropertiesHost};";
const written = new Map(), shown = [], warnings = [], posted = [];
let onSave = null;
const stub = new Proxy(function () {}, { get: (t, k) => (k === Symbol.toPrimitive ? () => "" : stub), apply: () => stub, construct: () => stub });
const uri = (path) => ({ path, toString: () => `file://${path}` });
const part = (k) => k === "workspace" ? {
    fs: { createDirectory: async () => {}, writeFile: async (u, bytes) => written.set(u.toString(), new TextDecoder().decode(bytes)) },
    openTextDocument: async (u) => ({ uri: u }),
    onDidSaveTextDocument: (fn) => { onSave = fn; return { dispose() {} }; },
  }
  : k === "window" ? {
    showTextDocument: async (doc, opts) => { shown.push({ doc, opts }); },
    setStatusBarMessage() {}, showWarningMessage: (m) => warnings.push(m), showErrorMessage() {},
    createWebviewPanel: () => ({ webview: { postMessage: (m) => posted.push(m), onDidReceiveMessage() {}, asWebviewUri: (u) => u, cspSource: "" }, onDidDispose(fn) { this.dispose = fn; }, reveal() {}, iconPath: null }),
  }
  : k === "Uri" ? { joinPath: (base, ...segs) => uri([base.path, ...segs].join("/")), file: (f) => uri(f), parse: (s) => uri(s) }
  : k === "ViewColumn" ? { One: 1, Beside: -2 } : stub;
const vs = new Proxy({}, {
  get: (t, k) => part(k),
  ownKeys: () => ["workspace", "window", "Uri", "ViewColumn"],
  getOwnPropertyDescriptor: (t, k) => ({ configurable: true, enumerable: true, value: part(k) }),
});
const m = new Module("ext"); m.filename = "/x/extension.js";
const orig = Module._load; Module._load = (r, p, i) => (r === "vscode" ? vs : orig(r, p, i));
m._compile(src, m.filename);
const { ResourcePropertiesHost: R } = m.exports.__t;
const ok = (c, msg) => console.log((c ? "PASS " : "FAIL ") + msg);

(async () => {
  const instance = { id: "inst1", url: "https://x", name: "demo" };
  R.attach({ globalStorageUri: uri("/store") });
  R.open(uri("/ext"), {}, instance);
  await R.openCode(instance, { resource: "Application", id: "parties", path: ["rendering", "options", "code", "value"], language: "html", text: "<template><b>hi</b></template>" });
  const file = [...written.keys()][0];
  ok(written.size === 1 && file.includes("/store/resource-code/inst1/Application/parties.rendering.options.code.value.html") && written.get(file) === "<template><b>hi</b></template>", "the code is written to an .html file in the extension's storage: " + file);
  ok(shown.length === 1 && shown[0].opts.viewColumn === -2 && shown[0].opts.preview === false, "and opened beside the screen");
  onSave({ uri: { toString: () => file }, getText: () => "<template><i>new</i></template>" });
  const back = posted.find((p) => p.type === "codeFromFile");
  ok(back && back.payload.resource === "Application" && back.payload.id === "parties" && back.payload.path.join(".") === "rendering.options.code.value" && back.payload.text === "<template><i>new</i></template>", "saving the file sends its text back to the screen");
  posted.length = 0;
  onSave({ uri: { toString: () => "file:///elsewhere.js" }, getText: () => "x" });
  ok(posted.length === 0, "saving any other file does nothing");
  for (const [bad, why] of [[["key"], "the key"], [["__proto__", "x"], "a prototype path"], [[], "an empty path"]]) {
    let threw = false;
    try { await R.openCode(instance, { resource: "Application", id: "parties", path: bad, language: "html", text: "" }); } catch (e) { threw = /can't be opened/.test(e.message); }
    ok(threw, `refuses ${why}`);
  }
  await R.openCode(instance, { resource: "Loan", id: "term", path: ["form_visibility", "data"], language: "javascript", text: "(res)=>true" });
  ok([...written.keys()].some((k) => k.endsWith("/Loan/term.form_visibility.data.js")), "JavaScript goes in a .js file");
  const raw = fs.readFileSync(process.argv[2], "utf8");
  ok(/case "openCode":\s*\{\s*await openCode\(instance, payload\)/.test(raw), "the screen's openCode message reaches it");
})().catch((e) => console.log("FAIL threw: " + e.stack));
