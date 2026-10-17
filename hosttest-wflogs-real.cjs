// The Logs tab host side inside the REAL patched extension.js, against a fake
// Saturn server (global fetch stubbed): node hosttest-wflogs-real.cjs <unpacked>/extension/dist/extension.js
const fs = require("fs"), Module = require("module");
const src = fs.readFileSync(process.argv[2], "utf8") + "\n;module.exports.__t={SysLogs$};";
const stub = new Proxy(function () {}, { get: (t, k) => (k === Symbol.toPrimitive ? () => "" : stub), apply: () => stub, construct: () => stub });
const vs = new Proxy({}, { get: (t, k) => k === "workspace" ? { getConfiguration: () => ({ get: () => "" }) } : stub });
const m = new Module("ext"); m.filename = "/x/extension.js";
const orig = Module._load; Module._load = (r, p, i) => (r === "vscode" ? vs : orig(r, p, i));
m._compile(src, m.filename);
const { SysLogs$ } = m.exports.__t;
const urls = [];
const all = Array.from({ length: 230 }, (_, i) => ({ id: i + 1, created_at: new Date(Date.UTC(2026, 0, 1) + i * 6e4).toISOString(), workflow: i % 2 ? "W" : "X" }));
global.fetch = async (u, o) => { urls.push([String(u), o.method || "GET", o.headers.Authorization]); const url = new URL(u);
  const json = url.pathname === "/api/Resources" ? { data: [{ name: "SystemLog" }, { name: "Workflow" }] } : url.pathname === "/api/resources/catalog" ? { data: ["SystemLog"] }
    : url.pathname === "/api/systemlogs" ? (() => { const l = +url.searchParams.get("limit"), p = +url.searchParams.get("page"); return { data: all.slice((p - 1) * l, p * l), count: all.length }; })() : null;
  return new Response(json ? JSON.stringify(json) : "nope", { status: json ? 200 : 404, headers: { "content-type": "application/json" } }); };
const instance = { id: "i1", name: "demo", url: "https://demo.saturn.gd" };
const manager = { list: () => [instance], get: (id) => (id === "i1" ? instance : undefined), getToken: async () => "TOKEN" };
// shaped like the real Workflows panel (It): panel, extensionUri, storageUri, manager, instance
const panelObj = { panel: {}, extensionUri: {}, storageUri: {}, manager, instance, drafts: new Map() };
const sent = [];
(async () => {
  await SysLogs$.fromWorkflows(panelObj, { postMessage: (x) => sent.push(x) }, "fetchWorkflowLogs", { reqId: 1, workflowId: "w", offset: 0, window: 200 });
  const r = sent[0];
  const ok = (c, msg) => console.log((c ? "PASS " : "FAIL ") + msg);
  ok(r.type === "workflowLogs", "real extension answers fetchWorkflowLogs: " + r.type + (r.payload.message ? " " + r.payload.message : ""));
  ok(r.payload.resource === "SystemLog" && r.payload.instanceName === "demo", "found the instance on the panel and the SystemLog resource");
  ok(r.payload.records.length === 200 && r.payload.records[0].id === 230 && r.payload.total === 230, "newest 200 of 230, newest first (oldest-first list read from the end)");
  ok(urls.every(([, meth, auth]) => meth === "GET" && auth === "Bearer TOKEN"), "only GETs, with the instance's token");
  console.log([...new Set(urls.map(([u]) => new URL(u).pathname + (new URL(u).search ? "?…" : "")))].join("  "));
})();
