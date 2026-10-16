// v0.3.2 host patches: the form field view model carries the stored field, and
// setFormFieldProps changes settings by path without touching the rest.
const fs = require("fs"), Module = require("module");
const src = fs.readFileSync(process.argv[2], "utf8") + "\n;module.exports.__t={go,Rr,ff$set,$a};";
const stub = new Proxy(function () {}, { get: (t, k) => (k === Symbol.toPrimitive ? () => "" : stub), apply: () => stub, construct: () => stub });
const m = new Module("ext"); m.filename = "/x/extension.js";
const orig = Module._load; Module._load = (r, p, i) => (r === "vscode" ? stub : orig(r, p, i));
m._compile(src, m.filename);
const { go, Rr, ff$set, $a } = m.exports.__t;
const ok = (c, msg) => console.log((c ? "PASS " : "FAIL ") + msg);
const staff = { key: "staff", label: "Staff", type: "string", hideInTable: false, number_of_columns: { full_width: false, default: 1 },
  rendering: { component: "default", _variances: { view: { span: 2 }, list: { component: "default" } } }, meta_tags: [], ipaddress: false };
const def = { actions: [{ id: "a", action: "a", label: "A", task: { type: "series", commands: [] }, form: { sections: [], fields: [staff, { key: "other", label: "Other", type: "number" }] } }] };

const v = go(staff);
ok(v.raw === staff && v.key === "staff" && v.inputType === null, "view model carries the stored field as raw");
ok($a(def.actions[0], new Map(), ["actions", 0]).form[0].raw.rendering._variances.view.span === 2, "action view model's form fields carry raw");

const out = Rr(def, ["actions", 0], "form", (f) => { const R = [...f]; R[0] = ff$set(f[0], [
  { path: ["hideInTable"], value: true },
  { path: ["number_of_columns", "default"], value: 3 },
  { path: ["rendering", "_variances", "view", "span"], value: 4 },
  { path: ["meta_tags"], value: ["pii"] },
  { path: ["ipaddress"], remove: true },
  { path: ["new", "deep", "thing"], value: 1 },
]); return R; });
const f = out.actions[0].form.fields[0];
ok(f.hideInTable === true && f.number_of_columns.default === 3 && f.number_of_columns.full_width === false, "sets top-level and nested settings, keeps siblings");
ok(f.rendering._variances.view.span === 4 && f.rendering._variances.list.component === "default" && f.rendering.component === "default", "deep nested setting, rest of rendering kept");
ok(JSON.stringify(f.meta_tags) === '["pii"]' && !("ipaddress" in f) && f.new.deep.thing === 1, "arrays, removals and new paths");
ok(staff.hideInTable === false && staff.rendering._variances.view.span === 2 && "ipaddress" in staff, "the original object is not mutated");
ok(out.actions[0].form.fields[1].key === "other" && out.actions[0].form.sections.length === 0, "other fields and sections untouched");
ok(def.actions[0].form.fields[0] === staff, "the original workflow is not mutated");
// the message handler refuses key/label/type and prototype paths
const i = src.indexOf('case"setFormFieldProps"');
const body = src.slice(i, src.indexOf('case"deleteFormField"', i));
ok(i > 0 && /\["key","label","type"\]\.includes/.test(body) && /__proto__/.test(body), "handler guards key/label/type and prototype paths");
