// v0.3.69: what a Create / Property Updater step's form needs from the host. getResourceFields gives each property's
// place in the schema, input type, a values lookup's choices and a map lookup's resource and fields (from the
// owner's real Note resource), and the operator catalog keeps Saturn's own form name (params_form).
const fs = require("fs"), Module = require("module");
const src = fs.readFileSync(process.argv[2], "utf8") + "\n;module.exports.__t={getResourceFields,operatorCatalog,catalogToObject};";
const stub = new Proxy(function () {}, { get: (t, k) => (k === Symbol.toPrimitive ? () => "" : stub), apply: () => stub, construct: () => stub });
const parts = ["window", "workspace", "commands", "Uri", "env", "ViewColumn", "EventEmitter", "Disposable"];
const vs = new Proxy({}, { get: () => stub, ownKeys: () => parts, getOwnPropertyDescriptor: () => ({ configurable: true, enumerable: true, value: stub }) });
const m = new Module("ext"); m.filename = "/x/extension.js";
const orig = Module._load; Module._load = (r, p, i) => (r === "vscode" ? vs : orig(r, p, i));
m._compile(src, m.filename);
const { getResourceFields, operatorCatalog, catalogToObject } = m.exports.__t;
const ok = (c, msg) => console.log((c ? "PASS " : "FAIL ") + msg);

const note = [
  { key: "creator", label: "Creator", type: "string", input_properties: { type: "input" } },
  { key: "description", label: "Description", type: "string", input_properties: { type: "richtexteditor" } },
  { key: "application", label: "Application", type: "string", input_properties: { type: "input" }, lookup_type: "map", map: { type: "model", value_field: "id", label_field: "application_number", reference: "Application" } },
  { key: "status", label: "Status", type: "string", required: true, lookup_type: "values", lookup_reference: "open, closed ,done" },
];
const seen = [];
global.fetch = async (url) => {
  seen.push(new URL(url).pathname);
  return new Response(JSON.stringify({ type: "resource", data: note }), { status: 200, headers: { "content-type": "application/json" } });
};
(async () => {
  const r = await getResourceFields({ getToken: async () => "t" }, { id: "i", url: "https://demo.saturn.gd" }, "Note");
  ok(seen[0] === "/api/Resources/Note", "it reads the resource's definition: " + seen[0]);
  const by = Object.fromEntries(r.fields.map((f) => [f.key, f]));
  ok(by.creator.index === 0 && by.status.index === 3, "each property keeps its place in the schema (the list is sorted by key)");
  ok(by.description.inputType === "richtexteditor", "the input type");
  ok(JSON.stringify(by.application.map) === JSON.stringify({ resource: "Application", valueField: "id", labelField: "application_number" }), "a map lookup's resource and fields: " + JSON.stringify(by.application.map));
  ok(JSON.stringify(by.status.choices) === '["open","closed","done"]' && by.status.required === true && by.creator.choices === null, "a values lookup's choices, and required");

  const cat = catalogToObject(operatorCatalog({ data: [
    { operator: "create", name: "Create", params_form: "CreateResourceOperatorForm", params: [{ param: "resource_name", type: "string" }] },
    { operator: "debug", name: "Debug", params: [] },
  ] }));
  ok(cat.create.form === "CreateResourceOperatorForm" && cat.debug.form === null, "the catalog keeps Saturn's form name (params_form)");
})().catch((e) => console.log("FAIL threw: " + e.stack));
