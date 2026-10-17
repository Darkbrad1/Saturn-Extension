// v0.3.4: the System Logs panel host code, driven end to end against a fake instance API.
const fs = require("fs"), Module = require("module");
const src = fs.readFileSync(process.argv[2], "utf8") + "\n;module.exports.__t={SysLogs$};";
const ok = (c, msg) => console.log((c ? "PASS " : "FAIL ") + msg);
const posted = [], calls = [];
let handler = null, html = "", setting = "";
const memento = new Map();
const panel = {
  webview: {
    cspSource: "vscode-resource:",
    asWebviewUri: (u) => u,
    postMessage: (m) => { posted.push(m); return Promise.resolve(true); },
    onDidReceiveMessage: (f) => { handler = f; },
    set html(v) { html = v; }, get html() { return html; },
  },
  onDidDispose: () => {}, reveal: () => {}, iconPath: null,
};
const over = {
  window: { createWebviewPanel: (...a) => { calls.push(["createWebviewPanel", ...a]); return panel; }, showTextDocument: async () => {} },
  workspace: { getConfiguration: () => ({ get: () => setting }), openTextDocument: async (o) => { calls.push(["openTextDocument", o]); return {}; } },
  Uri: { joinPath: (...a) => a.slice(1).join("/") },
  ViewColumn: { One: 1, Beside: -2 },
  env: { clipboard: { writeText: async (t) => calls.push(["clipboard", t]) } },
};
const stub = new Proxy(function () {}, { get: (t, k) => (k === Symbol.toPrimitive ? () => "" : k in over ? over[k] : stub), apply: () => stub, construct: () => stub });
const m = new Module("ext"); m.filename = "/x/extension.js";
const orig = Module._load; Module._load = (r, p, i) => (r === "vscode" ? stub : orig(r, p, i));
m._compile(src, m.filename);
const { SysLogs$ } = m.exports.__t;

// fake instance: SystemLog is a core resource with 137 records, oldest first
const logs = Array.from({ length: 137 }, (_, i) => ({ id: i + 1, level: i % 10 === 0 ? "error" : "debug", message: `step ${i + 1}`, created_at: new Date(Date.UTC(2026, 9, 16, 12, 0, i)).toISOString() }));
const seen = [];
global.fetch = async (url, init) => {
  const u = new URL(url);
  seen.push(`${init?.method ?? "GET"} ${u.pathname}${u.search}`);
  const j = (o, status = 200) => new Response(JSON.stringify(o), { status, headers: { "content-type": "application/json" } });
  if (u.pathname === "/api/resources/catalog") return j({ data: ["SystemLog", "Workflow", "Menu"] });
  if (u.pathname === "/api/Resources") return j({ data: [{ name: "Application" }, { name: "AuditLog" }] });
  if (u.pathname === "/api/Resources/SystemLog") return j({ data: { level: { label: "Level", type: "string" }, message: { label: "Message", type: "string" } } });
  if (u.pathname === "/api/systemlogs") {
    // this instance ignores ?sort= and lists oldest first; ?filter=level=error is understood
    const limit = +u.searchParams.get("limit"), page = +u.searchParams.get("page"), f = u.searchParams.get("filter");
    const list = f === "level=error" ? logs.filter((x) => x.level === "error") : logs;
    return j({ data: list.slice((page - 1) * limit, page * limit), count: list.length });
  }
  return j({ message: "Route not found" }, 404);
};
const manager = { getToken: async () => "tok", list: () => [] };
const instance = { id: "i1", name: "demo", url: "https://demo.example.com" };
const globalState = { get: (k) => memento.get(k), update: async (k, v) => memento.set(k, v) };
const wait = () => new Promise((r) => setTimeout(r, 30));
const last = (type) => [...posted].reverse().find((x) => x.type === type)?.payload;

(async () => {
  SysLogs$.open("ext", manager, instance, globalState);
  ok(calls[0][0] === "createWebviewPanel" && calls[0][2] === "System Logs — demo", "opens a panel titled for the instance");
  ok(/script-src 'nonce-[^']+'/.test(html) && html.includes("webview/logs/index.js") && !/unsafe-eval/.test(html), "strict CSP, loads the logs bundle");
  await handler({ type: "init" });
  await wait();
  let p = last("init");
  ok(p.resource === "SystemLog", `finds the System Logs core resource (${p.resource})`);
  ok(JSON.stringify(p.logResources) === '["AuditLog","SystemLog"]', "and offers the other log-like resources");
  await handler({ type: "fields", payload: { resource: "SystemLog" } });
  ok(last("fields").fields.some((f) => f.key === "message" && f.label === "Message"), "reads the resource's fields for column names");
  seen.length = 0;
  await handler({ type: "fetch", payload: { reqId: 1, resource: "SystemLog" } });
  p = last("page");
  ok(p.reqId === 1 && p.records.length === 10 && p.records[0].id === 137 && p.records[9].id === 128 && p.total === 137 && p.ordered === true, "reads the newest 10, newest first: " + p.records.map((x) => x.id).join(","));
  ok(seen.filter((x) => x.includes("/api/systemlogs")).every((x) => /limit=10&/.test(x)), "never more than 10 records a request: " + seen.filter((x) => x.includes("systemlogs")).join("  "));
  ok(seen.some((x) => /sort=created_at\+DESC/.test(x)), "asks the instance to sort by date first");
  await handler({ type: "fetch", payload: { reqId: 2, resource: "SystemLog", page: 3, limit: 5000, filter: "level=error" } });
  p = last("page");
  ok(p.reqId === 2 && p.records.length === 10 && p.records[0].id === 131 && p.records.every((x) => x.level === "error") && p.total === 14, "with a server filter: the newest 10 matching records (paging and page size are ignored)");
  ok(seen.some((x) => x.endsWith("filter=level%3Derror")), "the filter is passed to the instance");
  await handler({ type: "fetchRange", payload: { reqId: 9, resource: "SystemLog", start: 0, end: 137, limit: 100 } });
  ok(last("page").reqId !== 9, "there is no ranged read any more");
  ok(seen.every((s) => s.startsWith("GET ")), "every request is a read (GET)");
  await handler({ type: "fetch", payload: { reqId: 3, resource: "Nope", page: 1, limit: 10 } });
  ok(/No record route/.test(last("error").message) && last("error").reqId === 3, "a missing resource comes back as an error for that request");
  await handler({ type: "chooseResource", payload: { resource: "AuditLog" } });
  posted.length = 0;
  setting = "";
  await handler({ type: "init" });
  ok(last("init").resource === "AuditLog", "a resource picked in the screen is remembered for the instance");
  setting = "AuditLog";
  await handler({ type: "init" });
  ok(last("init").resource === "AuditLog", "the saturn.systemLogResource setting overrides it");
  await handler({ type: "openJson", payload: { record: logs[0] } });
  ok(calls.some((c) => c[0] === "openTextDocument" && c[1].language === "json"), "Open as JSON opens an untitled editor (nothing is saved anywhere)");
  ok(SysLogs$.pickLogResource(["Menu"], "Menu") === "AuditLog", "with the setting on, the setting wins");
  setting = "";
  ok(SysLogs$.pickLogResource(["Menu", "System_Logs"], null) === "System_Logs" && SysLogs$.pickLogResource(["Menu", "SystemLogs", "AuditLog"], null) === "SystemLogs", "System Logs found by name");
  ok(SysLogs$.pickLogResource(["Menu"], null) === null && SysLogs$.pickLogResource(["Menu", "AuditLog"], "AuditLog") === "AuditLog", "falls back to the remembered pick, else none");
})();
