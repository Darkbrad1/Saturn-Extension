// The Resources screen's host side (host/resources.js) inside the REAL built extension.js, against a
// fake Saturn server (global fetch stubbed) and a temp folder for backups:
//   node hosttest-resources.cjs <unpacked>/extension/dist/extension.js
const fs = require("fs"), os = require("os"), path = require("path"), Module = require("module");
const src = fs.readFileSync(process.argv[2], "utf8") + "\n;module.exports.__t={ResourcePropertiesHost,getResourceFields};";
const stub = new Proxy(function () {}, { get: (t, k) => (k === Symbol.toPrimitive ? () => "" : stub), apply: () => stub, construct: () => stub });
const uri = (p) => ({ fsPath: p, path: p, toString: () => "file://" + p });
const vs = new Proxy({}, {
  get: (t, k) => k === "workspace" ? {
    getConfiguration: () => ({ get: () => "" }),
    fs: {
      createDirectory: async (u) => fs.mkdirSync(u.fsPath, { recursive: true }),
      writeFile: async (u, data) => fs.writeFileSync(u.fsPath, data),
      readFile: async (u) => fs.readFileSync(u.fsPath),
    },
  } : k === "Uri" ? { joinPath: (u, ...parts) => uri(path.join(u.fsPath, ...parts)), file: (p) => uri(p) } : stub,
});
const m = new Module("ext"); m.filename = "/x/extension.js";
const orig = Module._load; Module._load = (r, p, i) => (r === "vscode" ? vs : orig(r, p, i));
m._compile(src, m.filename);
const { ResourcePropertiesHost: host, getResourceFields } = m.exports.__t;

// the fake instance: Application with three properties. GET /Resources/<name> answers with a list
// whose items carry their key; PUT /resources/<name>/schema takes {data: "<JSON of {key: property}>"},
// as Saturn does (seen in its own app's network traffic). mode: "ok" | "refuse" | "ignore" | "mangle".
const prop = (key, label, extra = {}) => ({ type: "string", label, required: false, searchable: false, rendering: { component: "default" }, key, ...extra });
let stored, mode, lastSchema;
const reset = (m = "ok") => { mode = m; lastSchema = null; stored = { type: "resource", data: [prop("status", "Status"), prop("application_number", "Application Number", { unique: true }), prop("loan_purpose", "Loan Purpose")] }; };
const calls = [];
global.fetch = async (u, o = {}) => {
  const url = new URL(u), method = o.method || "GET";
  calls.push([method, url.pathname, o.headers?.Authorization]);
  const reply = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
  if (url.pathname === "/api/Resources" && method === "GET") return reply({ data: [{ name: "Application" }, { name: "Loan" }] });
  if (url.pathname === "/api/Resources/Application" && method === "GET") return reply(JSON.parse(JSON.stringify(stored)));
  if (url.pathname === "/api/resources/Application/schema" && method === "PUT") {
    if (mode === "refuse") return new Response(JSON.stringify({ message: "no" }), { status: 405, headers: { "content-type": "application/json", allow: "GET" } });
    const body = JSON.parse(o.body);
    if (typeof body.data !== "string") return reply({ status: "FAILURE", message: "data must be a string" }, 400);
    lastSchema = JSON.parse(body.data);
    if (mode === "ok") stored = { ...stored, data: Object.entries(lastSchema).map(([key, p]) => ({ ...p, key })) };
    if (mode === "mangle") stored = { ...stored, data: Object.entries(lastSchema).map(([key, p]) => ({ ...p, key, searchable: true })) };
    return reply({ status: "SUCCESS", data: "updated" });
  }
  if (url.pathname.startsWith("/api/Resources") && method === "OPTIONS") return new Response(null, { status: 204, headers: url.pathname === "/api/Resources" ? { allow: "HEAD, GET" } : { allow: "HEAD, GET, POST, DELETE" } });
  if (url.pathname === "/api/mcp" && method === "POST") {
    const rpc = JSON.parse(o.body);
    if (rpc.method === "initialize") return new Response(JSON.stringify({ jsonrpc: "2.0", id: rpc.id, result: { protocolVersion: "2025-03-26" } }), { headers: { "content-type": "application/json", "mcp-session-id": "S1" } });
    if (rpc.method === "tools/list") {
      if (o.headers["Mcp-Session-Id"] !== "S1") return reply({ message: "no session" }, 400);
      // an event-stream answer, as MCP servers may give
      return new Response(`event: message\ndata: ${JSON.stringify({ jsonrpc: "2.0", id: rpc.id, result: { tools: [{ name: "update_resource_schema", description: "Change a resource's properties" }, { name: "list_records", description: "List records", annotations: { readOnlyHint: true } }] } })}\n\n`, { headers: { "content-type": "text/event-stream" } });
    }
    return new Response("", { status: 202 });
  }
  return reply({ message: "nope" }, 404);
};
const instance = { id: "i1", name: "demo", url: "https://demo.saturn.gd" };
const manager = { list: () => [instance], get: () => instance, getToken: async () => "TOKEN" };
const backups = fs.mkdtempSync(path.join(os.tmpdir(), "res-backups-"));
host.attach({ globalStorageUri: uri(backups) });
const ok = (c, msg) => console.log((c ? "PASS " : "FAIL ") + msg);
const ask = async (type, payload) => { const out = []; await host.handle(manager, instance, { type, payload }, (t, p) => out.push({ type: t, payload: p })); return out[0]; };
const requiredOf = (key) => stored.data.find((p) => p.key === key).required;
const writes = () => calls.filter(([m]) => m !== "GET" && m !== "OPTIONS");

(async () => {
  reset();
  const init = await ask("init", {});
  ok(init.type === "init" && init.payload.resources.join() === "Application,Loan", "init lists the instance's resources");
  const props = await ask("load", { resource: "Application" });
  ok(props.payload.properties.map((p) => p.key).join() === "status,application_number,loan_purpose" && props.payload.properties.every((p) => p.required === false && p.editable), "load reads a list-shaped definition by each property's own key");
  const fields = await getResourceFields(manager, instance, "Application");
  ok(fields.fields.map((f) => f.key).sort().join() === "application_number,loan_purpose,status", "getResourceFields reads a list by key too (it used to give 0, 1, 2)");

  // a save, the way Saturn's app makes it
  calls.length = 0;
  let r = await ask("save", { resource: "Application", changes: [{ key: "status", required: true }] });
  ok(r.type === "saved" && requiredOf("status") === true && requiredOf("loan_purpose") === false, "save marks status required, and only that");
  ok(writes().length === 1 && writes()[0][0] === "PUT" && writes()[0][1] === "/api/resources/Application/schema" && writes()[0][2] === "Bearer TOKEN", "one PUT /api/resources/Application/schema, with the instance's token");
  ok(Object.keys(lastSchema).join() === "status,application_number,loan_purpose" && Object.values(lastSchema).every((p) => !("key" in p)), "it sends the whole schema as {key: property}, without the key inside each property (data as JSON text)");
  ok(lastSchema.status.required === true && lastSchema.application_number.unique === true && lastSchema.status.rendering.component === "default", "every other setting is kept");
  const backup = JSON.parse(fs.readFileSync(r.payload.backup, "utf8"));
  ok(backup.resource === "Application" && backup.body.data.find((p) => p.key === "status").required === false, "the definition before the change was backed up");
  r = await ask("restore", { resource: "Application", backup: r.payload.backup });
  ok(r.type === "restored" && requiredOf("status") === false, "restore puts the backup back");

  // an instance that refuses
  reset("refuse");
  r = await ask("save", { resource: "Application", changes: [{ key: "status", required: true }] }).catch((e) => ({ type: "threw", payload: { message: e.message } }));
  ok(r.type === "threw" && /doesn't accept changes/.test(r.payload.message) && requiredOf("status") === false, "a refused save says so and changes nothing: " + r.payload.message);
  calls.length = 0;
  const probe = await ask("probe", { resource: "Application" });
  const report = probe.payload.report;
  ok(/OPTIONS \/api\/Resources\/Application: 204 — allows HEAD, GET, POST, DELETE/.test(report) && /OPTIONS \/api\/Resources: 204 — allows HEAD, GET/.test(report), "the check reports what each address allows");
  ok(/MCP \(\/api\/mcp\): 2 tools/.test(report) && /update_resource_schema — Change a resource's properties/.test(report) && !/list_records/.test(report), "and the instance's MCP tools about resources (read from an event stream, in its session)");
  ok(calls.every(([m, p]) => m === "OPTIONS" || (m === "POST" && p === "/api/mcp")), "the check writes nothing: OPTIONS and MCP initialize / tools/list only");

  // an instance that takes it and changes nothing: the message shows what it answered
  reset("ignore"); calls.length = 0;
  r = await ask("save", { resource: "Application", changes: [{ key: "status", required: true }] });
  ok(r.type === "saveMismatch" && r.payload.unchanged && /It answered: \{"status":"SUCCESS","data":"updated"\}/.test(r.payload.message) && writes().length === 1, "a write that changes nothing is reported with the instance's answer, and not repeated");

  // an instance that changes something else too
  reset("mangle"); calls.length = 0;
  r = await ask("save", { resource: "Application", changes: [{ key: "status", required: true }] });
  ok(r.type === "saveMismatch" && !r.payload.unchanged && /changed differently/.test(r.payload.message) && r.payload.backup, "an unexpected change is reported, with the backup to restore: " + r.payload.message);
  ok(writes().length === 1, "and nothing more is written");

  // bad requests
  reset();
  r = await ask("save", { resource: "Application", changes: [{ key: "gone", required: true }] });
  ok(r.type === "saveFailed" && /no longer a property/.test(r.payload.message), "a property that's gone is refused before anything is written");
  r = await ask("save", { resource: "Application", changes: [] });
  ok(r.type === "saveFailed", "nothing to save is refused");
  fs.rmSync(backups, { recursive: true, force: true });
})();
