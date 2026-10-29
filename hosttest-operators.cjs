// v0.3.65: the node view's Operators JSON button. viewOperatorsJson reads Saturn's operator list (GET /api/Operators,
// a read only) and opens it as JSON in a tab beside; offline, the copy kept for offline use is shown, with a message;
// with neither, an error message.
const fs = require("fs"), Module = require("module");
const src = fs.readFileSync(process.argv[2], "utf8") + "\n;module.exports.__t={WorkflowsPanel};";
const stub = new Proxy(function () {}, { get: (t, k) => (k === Symbol.toPrimitive ? () => "" : stub), apply: () => stub, construct: () => stub });
const docs = [], shown = [], infos = [], errors = [];
const own = {
  workspace: { openTextDocument: async (o) => { docs.push(o); return o; } },
  window: {
    showTextDocument: async (d, o) => { shown.push(o); },
    showInformationMessage: (m) => { infos.push(m); return Promise.resolve(); },
    showErrorMessage: (m) => { errors.push(m); return Promise.resolve(); },
  },
  ViewColumn: { One: 1, Beside: -2 },
};
const part = (k) => (k in own ? new Proxy(own[k], { get: (t, key) => (key in t ? t[key] : stub) }) : stub);
const parts = ["window", "workspace", "commands", "Uri", "env", "ViewColumn", "EventEmitter", "Disposable"];
const vs = new Proxy({}, { get: (t, k) => part(k), ownKeys: () => parts, getOwnPropertyDescriptor: (t, k) => ({ configurable: true, enumerable: true, value: part(k) }) });
const m = new Module("ext"); m.filename = "/x/extension.js";
const orig = Module._load; Module._load = (r, p, i) => (r === "vscode" ? vs : orig(r, p, i));
m._compile(src, m.filename);
const { WorkflowsPanel } = m.exports.__t;
const ok = (c, msg) => console.log((c ? "PASS " : "FAIL ") + msg);

const list = [{ name: "debug", label: "Debug", category: "Workflow Tools", params: [{ param: "message" }] }, { name: "switch", label: "Switch" }];
const seen = [];
let online = true;
global.fetch = async (url, init) => {
  seen.push(`${init?.method ?? "GET"} ${new URL(url).pathname}`);
  if (!online) throw new Error("getaddrinfo ENOTFOUND");
  return new Response(JSON.stringify(list), { status: 200, headers: { "content-type": "application/json" } });
};
let savedCopy = null;
const panel = Object.create(WorkflowsPanel.prototype);
Object.assign(panel, {
  panel: { webview: { postMessage: () => {} } },
  manager: { getToken: async () => "tok" },
  instance: { id: "i", name: "Demo", url: "https://demo.saturn.gd" },
  offlineStore: () => ({ operators: async () => savedCopy }),
});
const reset = () => { docs.length = 0; shown.length = 0; infos.length = 0; errors.length = 0; seen.length = 0; };

(async () => {
  reset();
  await panel.handleMessage({ type: "viewOperatorsJson", payload: {} });
  ok(seen.length === 1 && seen[0] === "GET /api/Operators", "it reads /api/Operators with a GET: " + seen.join(", "));
  ok(docs.length === 1 && docs[0].language === "json" && JSON.parse(docs[0].content)[1].name === "switch", "the list opens as JSON, as Saturn gives it");
  ok(shown[0]?.viewColumn === -2 && shown[0]?.preview === true, "in a tab beside the canvas");
  ok(infos.length === 0 && errors.length === 0, "no message when the instance answers");

  reset();
  online = false;
  savedCopy = [{ name: "debug", label: "Debug (saved)" }];
  await panel.handleMessage({ type: "viewOperatorsJson", payload: {} });
  ok(docs.length === 1 && JSON.parse(docs[0].content)[0].label === "Debug (saved)", "offline, the copy saved for offline use is shown");
  ok(infos.length === 1 && /saved for offline use/.test(infos[0]), "and a message says so: " + infos[0]);

  reset();
  savedCopy = null;
  await panel.handleMessage({ type: "viewOperatorsJson", payload: {} });
  ok(docs.length === 0 && errors.length === 1 && /operator list/.test(errors[0]), "with neither, an error message: " + errors[0]);
})().catch((e) => { console.log("FAIL threw: " + e.stack); });
