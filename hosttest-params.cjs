// v0.3.50: paramsToData keeps a step's settings the operator's catalog doesn't list (a Create step's properties):
// stored ones stay, sent ones are written (JSON for an object or a list), and none are refused any more.
// Before, saving a Create step from the side panel dropped its properties.
const fs = require("fs"), Module = require("module");
const src = fs.readFileSync(process.argv[2], "utf8") + "\n;module.exports.__t={paramsToData};";
const stub = new Proxy(function () {}, { get: (t, k) => (k === Symbol.toPrimitive ? () => "" : stub), apply: () => stub, construct: () => stub });
const m = new Module("ext"); m.filename = "/x/extension.js";
const orig = Module._load; Module._load = (r, p, i) => (r === "vscode" ? stub : orig(r, p, i));
m._compile(src, m.filename);
const { paramsToData } = m.exports.__t;
const ok = (c, msg) => console.log((c ? "PASS " : "FAIL ") + msg);

const create = { operator: "create", params: [{ param: "resource", label: "Resource", type: "string", required: true }] };
const stored = { resource: "DocumentRequest", properties: { status: "requested", belongs_to: "{{ _resource.id }}" }, note: "kept" };

let r = paramsToData(create, { resource: "DocumentRequest" }, stored);
ok(!r.errors.length && JSON.stringify(r.data.properties) === JSON.stringify(stored.properties) && r.data.note === "kept", "settings not sent are kept as stored");

r = paramsToData(create, { resource: "DocumentRequest", properties: JSON.stringify({ status: "waiting", belongs_to: "{{ _resource.id }}" }) }, stored);
ok(!r.errors.length && r.data.properties.status === "waiting" && r.data.properties.belongs_to === "{{ _resource.id }}", "a sent map is written as an object");

r = paramsToData(create, { resource: "DocumentRequest", note: "new text" }, stored);
ok(r.data.note === "new text", "a sent text is written as text");

r = paramsToData(create, { resource: "DocumentRequest", properties: "{ not json" }, stored);
ok(r.errors.length === 1 && r.errors[0].param === "properties" && /not valid JSON/.test(r.errors[0].message), "a broken map is refused, saying why");

r = paramsToData(create, { resource: "DocumentRequest", __proto__x: "", constructor: "x" }, stored);
ok(!("constructor" in r.data && r.data.constructor === "x"), "a reserved key isn't written");

const pu = { operator: "property_updater", params: [{ param: "properties", label: "Properties", type: "object" }] };
r = paramsToData(pu, { properties: JSON.stringify({ status: "done" }) }, { properties: { status: "x" }, _properties: [{ key: "status", value: "x" }], resource_type: "" });
ok(r.data._properties[0].value === "done" && r.data.resource_type === "", "a Property Updater's _properties still follow its properties; its other stored settings are kept");
