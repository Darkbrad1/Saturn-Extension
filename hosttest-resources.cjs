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
    if (mode === "sorted") stored = { ...stored, data: Object.entries(lastSchema).sort(([a], [b]) => a.localeCompare(b)).map(([key, p]) => ({ ...p, key })) };
    // "fill": the instance adds a setting of its own to each property (as an instance may for a new one)
    if (mode === "fill") stored = { ...stored, data: Object.entries(lastSchema).map(([key, p]) => ({ ...p, key, created_by: "server" })) };
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

  // reordering: the schema's order is the order the map is sent in
  reset(); calls.length = 0;
  r = await ask("save", { resource: "Application", changes: [{ key: "loan_purpose", required: true }], order: ["loan_purpose", "status", "application_number"] });
  ok(r.type === "saved" && Object.keys(lastSchema).join() === "loan_purpose,status,application_number" && stored.data.map((p) => p.key).join() === "loan_purpose,status,application_number", "a new order is sent as the map's order, and kept");
  ok(requiredOf("loan_purpose") === true && r.payload.properties.map((p) => p.key).join() === "loan_purpose,status,application_number", "with the Required change in the same save, and the screen gets the new order back");
  r = await ask("save", { resource: "Application", order: ["status", "application_number", "loan_purpose"] });
  ok(r.type === "saved" && stored.data.map((p) => p.key).join() === "status,application_number,loan_purpose", "an order change alone saves too");
  r = await ask("save", { resource: "Application", order: ["status", "loan_purpose"] });
  ok(r.type === "saveFailed" && /changed since you opened it/.test(r.payload.message), "an order that doesn't name every property (the resource changed) is refused before writing");
  reset("sorted");
  r = await ask("save", { resource: "Application", order: ["status", "loan_purpose", "application_number"] });
  ok(r.type === "saveMismatch" && /didn't keep their new order/.test(r.payload.message), "if the instance doesn't keep the order, the screen says so");

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

  // any setting, at its path
  reset(); calls.length = 0;
  r = await ask("save", { resource: "Application", changes: [
    { key: "status", path: ["map"], value: { type: "model", reference: "LoanCategory", value_field: "id", label_field: "label" } },
    { key: "status", path: ["rendering", "_variances", "list", "component"], value: "currency" },
    { key: "application_number", path: ["unique"], remove: true },
  ] });
  const status = stored.data.find((p) => p.key === "status");
  ok(r.type === "saved" && status.map.reference === "LoanCategory" && status.rendering._variances.list.component === "currency" && status.rendering.component === "default", "settings are changed at their path, nested ones made, the rest of the object kept");
  ok(!("unique" in stored.data.find((p) => p.key === "application_number")) && stored.data.find((p) => p.key === "loan_purpose").label === "Loan Purpose", "a removed setting is gone, other properties untouched");
  r = await ask("save", { resource: "Application", changes: [{ key: "status", path: ["key"], value: "state" }] });
  ok(r.type === "saveFailed" && /key can't be changed/.test(r.payload.message), "a property's key can't be changed");
  r = await ask("save", { resource: "Application", changes: [{ key: "status", path: ["__proto__", "x"], value: 1 }] });
  ok(r.type === "saveFailed" && /can't be written/.test(r.payload.message), "a path into the prototype is refused");

  // new properties
  reset(); calls.length = 0;
  r = await ask("save", { resource: "Application", adds: [{ key: "first_name", property: { label: "First Name", type: "string", required: true } }], order: ["first_name", "status", "application_number", "loan_purpose"] });
  const added = stored.data.find((p) => p.key === "first_name");
  ok(r.type === "saved" && stored.data[0].key === "first_name" && added.required === true && added.label === "First Name", "a new property is added, with its settings, where the order puts it");
  ok(added.input_properties.type === "input" && added.views[0].id === "SLKJDSF" && added.source === "static" && !("key" in lastSchema.first_name), "with the settings Saturn's own app gives a new one");
  r = await ask("save", { resource: "Application", adds: [{ key: "status", property: {} }] });
  ok(r.type === "saveFailed" && /already a property/.test(r.payload.message), "a key that's taken is refused");
  r = await ask("save", { resource: "Application", adds: [{ key: "9 lives", property: {} }] });
  ok(r.type === "saveFailed" && /can't be a property key/.test(r.payload.message), "a key that isn't a key is refused");
  reset("fill");
  r = await ask("save", { resource: "Application", adds: [{ key: "notes", property: { label: "Notes", type: "string" } }] });
  ok(r.type === "saveMismatch" && /asked, in: status, application_number, loan_purpose\. /.test(r.payload.message) && !/notes/.test(r.payload.message), "settings the instance adds to a new property aren't a mismatch (on the others they are): " + r.type + " " + r.payload.message);

  // a new key for a property
  reset(); calls.length = 0;
  r = await ask("save", { resource: "Application", changes: [{ key: "status", path: ["label"], value: "State" }], renames: [{ from: "status", to: "state" }] });
  ok(r.type === "saved" && stored.data.map((p) => p.key).join() === "state,application_number,loan_purpose" && stored.data[0].label === "State" && Object.keys(lastSchema)[0] === "state", "a key is changed after the other changes, in its place, with its settings");
  r = await ask("save", { resource: "Application", renames: [{ from: "state", to: "loan_purpose" }] });
  ok(r.type === "saveFailed" && /same key/.test(r.payload.message), "a new key another property has is refused");
  r = await ask("save", { resource: "Application", renames: [{ from: "state", to: "no good" }] });
  ok(r.type === "saveFailed" && /can't be a property key/.test(r.payload.message) && writes().length === 1, "a key that isn't a key is refused, before writing");

  // lookups for the screen
  reset();
  const fl = await ask("fields", { resource: "Application" });
  ok(fl.type === "fields" && fl.payload.fields.map((f) => f.key).join() === "status,application_number,loan_purpose" && fl.payload.fields[0].label === "Status", "fields lists another resource's properties");

  // bad requests
  reset();
  r = await ask("save", { resource: "Application", changes: [{ key: "gone", required: true }] });
  ok(r.type === "saveFailed" && /no longer a property/.test(r.payload.message), "a property that's gone is refused before anything is written");
  r = await ask("save", { resource: "Application", changes: [] });
  ok(r.type === "saveFailed", "nothing to save is refused");
  fs.rmSync(backups, { recursive: true, force: true });
})();
