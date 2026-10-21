// v0.3.46: Resource settings (host/resources.js "settings" / "saveSettings") inside the REAL built extension.js,
// against a fake Saturn (global fetch stubbed): the resource's ResourceDetail record is read; a save re-reads it,
// backs it up, PUTs only the changed keys (drawer_enabled also into render_details), reads it back and compares.
//   node hosttest-resettings.cjs <unpacked>/extension/dist/extension.js
const fs = require("fs"), os = require("os"), path = require("path"), Module = require("module");
const src = fs.readFileSync(process.argv[2], "utf8") + "\n;module.exports.__t={ResourcePropertiesHost};";
const stub = new Proxy(function () {}, { get: (t, k) => (k === Symbol.toPrimitive ? () => "" : stub), apply: () => stub, construct: () => stub });
const uri = (p) => ({ fsPath: p, path: p, toString: () => "file://" + p });
const vs = new Proxy({}, {
  get: (t, k) => k === "workspace" ? {
    getConfiguration: () => ({ get: () => "" }),
    fs: { createDirectory: async (u) => fs.mkdirSync(u.fsPath, { recursive: true }), writeFile: async (u, data) => fs.writeFileSync(u.fsPath, data), readFile: async (u) => fs.readFileSync(u.fsPath) },
  } : k === "Uri" ? { joinPath: (u, ...parts) => uri(path.join(u.fsPath, ...parts)), file: (p) => uri(p), parse: (s) => ({ parsed: s }) } : stub,
});
const m = new Module("ext"); m.filename = "/x/extension.js";
const orig = Module._load; Module._load = (r, p, i) => (r === "vscode" ? vs : orig(r, p, i));
m._compile(src, m.filename);
const { ResourcePropertiesHost: host } = m.exports.__t;

const ID = "resourcedetail-71501093";
let record, mode, puts;
const reset = (md = "ok") => {
  mode = md; puts = [];
  record = {
    id: ID, resource: "Application", description: "Loan applications", drawer_enabled: false, lifecycle: { create: {} },
    render_details: { drawer_enabled: false, form_component: null, section_layout: "sections" }, default_view: { view: "table", details: {} }, sort: null,
    sections: [{ name: "Basics", description: "", number_of_columns: 2, placeInTab: false, properties: ["status"] }],
    _permissions_: { read: true }, field_restrictions: [],
  };
};
let details = () => [record, { id: "rd-2", resource: "Loan" }, { id: "rd-3", resource: "Dup" }, { id: "rd-4", resource: "Dup" }];
global.fetch = async (u, o = {}) => {
  const url = new URL(u), method = o.method || "GET";
  const reply = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
  if (url.pathname === "/api/resourceDetails" && method === "GET") return reply({ data: details() });
  if (url.pathname === `/api/resourceDetails/${ID}` && method === "GET") return reply({ data: JSON.parse(JSON.stringify(record)) });
  if (url.pathname === `/api/resourceDetails/${ID}` && method === "PUT") {
    const body = JSON.parse(o.body);
    puts.push(body);
    if (mode === "refuse") return reply({ status: "FAILURE", message: "not allowed" });
    if (mode === "ok") record = { ...record, ...body };
    return reply({ status: "SUCCESS" });
  }
  return reply({ message: "nope" }, 404);
};
const instance = { id: "i1", name: "demo", url: "https://demo.saturn.gd" };
const manager = { list: () => [instance], get: () => instance, getToken: async () => "TOKEN" };
const backups = fs.mkdtempSync(path.join(os.tmpdir(), "res-settings-"));
host.attach({ globalStorageUri: uri(backups) });
const ok = (c, msg) => console.log((c ? "PASS " : "FAIL ") + msg);
const ask = async (type, payload) => { const out = []; await host.handle(manager, instance, { type, payload }, (t, p) => out.push({ type: t, payload: p })); return out[0]; };

(async () => {
  reset();
  const got = await ask("settings", { resource: "application" });
  ok(got.type === "settings" && got.payload.id === ID && got.payload.detail.sections[0].name === "Basics", "settings reads the resource's ResourceDetail record (the name's case doesn't matter)");
  ok(!("_permissions_" in got.payload.detail) && !("field_restrictions" in got.payload.detail), "without the reader's permissions");
  ok(/no ResourceDetail record/.test((await ask("settings", { resource: "User" })).payload.problem), "a resource with no record says so");
  ok(/2 ResourceDetail records/.test((await ask("settings", { resource: "Dup" })).payload.problem), "two records for one resource: not edited");

  const sections = [{ name: "Money", description: "Amounts", number_of_columns: 1, placeInTab: true, properties: ["amount", "term"] }, record.sections[0]];
  const saved = await ask("saveSettings", { resource: "Application", id: ID, changes: { sections, description: "New", drawer_enabled: true } });
  ok(saved.type === "settingsSaved" && saved.payload.detail.sections[0].name === "Money", "a save answers settingsSaved with the record read back");
  ok(puts.length === 1 && Object.keys(puts[0]).sort().join() === "description,drawer_enabled,render_details,sections", "PUT sends only the changed keys (and render_details for the drawer)");
  ok(puts[0].render_details.drawer_enabled === true && puts[0].render_details.section_layout === "sections", "render_details keeps its other settings");
  ok(record.lifecycle && record.default_view.view === "table", "the rest of the record is left alone");
  const files = fs.readdirSync(path.join(backups, "resource-backups", "i1"));
  ok(files.some((f) => /^Application-settings-.*\.json$/.test(f)), "the record is backed up first: " + files.join());
  const kept = JSON.parse(fs.readFileSync(path.join(backups, "resource-backups", "i1", files[0]), "utf8"));
  ok(kept.body.description === "Loan applications", "the backup holds the record as it was");

  reset("ignore");
  const ignored = await ask("saveSettings", { resource: "Application", id: ID, changes: { description: "Lost" } });
  ok(ignored.type === "settingsMismatch" && ignored.payload.unchanged === true && /didn't keep/.test(ignored.payload.message), "a change the instance didn't keep is reported");
  reset("refuse");
  const refused = await ask("saveSettings", { resource: "Application", id: ID, changes: { description: "No" } });
  ok(refused.type === "saveFailed" && /not allowed/.test(refused.payload.message), "a refusal is reported");

  reset();
  for (const [changes, why] of [
    [{ lifecycle: {} }, "another key of the record"],
    [{ sections: [{ name: "", number_of_columns: 1, properties: [] }] }, "a section with no name"],
    [{ sections: [{ name: "A", number_of_columns: 0, properties: [] }] }, "0 columns"],
    [{ sections: [{ name: "A", number_of_columns: 1, properties: [3] }] }, "a property that isn't a key"],
    [{ drawer_enabled: "yes" }, "a drawer that isn't on or off"],
    [{}, "nothing"],
  ]) {
    const r = await ask("saveSettings", { resource: "Application", id: ID, changes });
    ok(r.type === "saveFailed" && puts.length === 0, `refuses ${why}, sending nothing`);
  }
  details = () => [{ ...record, resource: "Loan" }];
  record = { ...record, resource: "Loan" };
  const other = await ask("saveSettings", { resource: "Application", id: ID, changes: { description: "x" } });
  ok(other.type === "saveFailed" && /another resource/.test(other.payload.message) && puts.length === 0, "refuses a record of another resource");
})().catch((e) => console.log("FAIL threw: " + e.stack));
