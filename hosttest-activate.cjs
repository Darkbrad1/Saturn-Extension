// activate() shows a startup failure instead of leaving the Sonover views blank (0.3.11).
const fs = require("fs"), path = require("path"), Module = require("module");
const src = fs.readFileSync(process.argv[2], "utf8");
const shown = [];
const stub = new Proxy(function () {}, { get: (t, k) => (k === Symbol.toPrimitive ? () => "" : stub), apply: () => stub, construct: () => stub });
const vscode = { window: new Proxy({}, { get: (w, f) => (f === "showErrorMessage" ? (msg) => (shown.push(msg), Promise.resolve()) : stub) }) };
const m = new Module("ext"); m.filename = "/x/extension.js"; m.paths = Module._nodeModulePaths(path.dirname(process.argv[2]));
const origLoad = Module._load;
Module._load = (req, parent, isMain) => (req === "vscode" ? vscode : origLoad(req, parent, isMain));
const log = console.log, err = console.error; console.log = () => {}; console.error = () => {};
m._compile(src, m.filename);
// vscode here has only a window, so the first thing activation builds (the instance manager) throws
const context = new Proxy({ subscriptions: [] }, { get: (t, k) => (k in t ? t[k] : stub) });
m.exports.activate(context).then(
  () => { console.log = log; console.log("FAIL activate resolved although starting failed"); },
  (e) => {
    console.log = log; console.error = err;
    console.log("PASS activate still rejects, so VS Code logs it too: " + e?.message);
    console.log(shown.length === 1 && shown[0] === `Sonover Code could not start: ${e?.message}` ? "PASS the failure is shown: " + shown[0] : `FAIL shown: ${JSON.stringify(shown)}`);
  });
