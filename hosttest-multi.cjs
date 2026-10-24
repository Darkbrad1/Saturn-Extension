// v0.3.59: several steps at once on the canvas: moveStepsEdit (picked steps dragged together onto a wire, one edit,
// in document order, by identity) and updateOperatorsEdit (the same changed settings on several steps of one
// operator, each keeping the rest), plus the readNodes / moveSteps / updateOperators messages.
const fs = require("fs"), Module = require("module");
const src = fs.readFileSync(process.argv[2], "utf8") + "\n;module.exports.__t={moveStepsEdit,updateOperatorsEdit,outermostPaths};";
const stub = new Proxy(function () {}, { get: (t, k) => (k === Symbol.toPrimitive ? () => "" : stub), apply: () => stub, construct: () => stub });
const m = new Module("ext"); m.filename = "/x/extension.js";
const orig = Module._load; Module._load = (r, p, i) => (r === "vscode" ? stub : orig(r, p, i));
m._compile(src, m.filename);
const { moveStepsEdit, updateOperatorsEdit, outermostPaths } = m.exports.__t;
const ok = (c, msg) => console.log((c ? "PASS " : "FAIL ") + msg);
const op = (o, data = {}) => ({ type: "command", operator: o, data });
const mk = () => ({ actions: [{ task: { type: "series", commands: [op("A"), { type: "if", true: { type: "series", commands: [op("T1"), op("T2")] }, false: { type: "series", commands: [] } }, op("B"), op("C")] } }] });
const names = (cs) => cs.map((c) => c.operator ?? c.type).join();
const P = (...x) => ["actions", 0, "task", "commands", ...x];

// ---- moving several
let d = mk();
let out = moveStepsEdit(d, [P(3), P(0)], P(), 2);
ok(names(out.actions[0].task.commands) === "if,A,C,B", "two steps go to index 2 of the same list, in document order: " + names(out.actions[0].task.commands));
ok(names(d.actions[0].task.commands) === "A,if,B,C", "the original isn't changed");
out = moveStepsEdit(mk(), [P(0), P(2)], P(1, "false", "commands"), null);
ok(names(out.actions[0].task.commands) === "if,C" && names(out.actions[0].task.commands[0].false.commands) === "A,B", "into an empty branch: " + names(out.actions[0].task.commands[0].false.commands));
out = moveStepsEdit(mk(), [P(1, "true", "commands", 1), P(3)], P(), 0);
ok(names(out.actions[0].task.commands) === "T2,C,A,if,B" && names(out.actions[0].task.commands[3].true.commands) === "T1", "from different levels into one list");
out = moveStepsEdit(mk(), [P(1), P(1, "true", "commands", 0)], P(), 4);
ok(names(out.actions[0].task.commands) === "A,B,C,if" && names(out.actions[0].task.commands[3].true.commands) === "T1,T2", "a step inside a moved group goes with the group");
let threw = "";
try { moveStepsEdit(mk(), [P(1), P(3)], P(1, "true", "commands"), 0); } catch (e) { threw = e.message; }
ok(/inside itself/.test(threw), "moving a group into itself is refused");
threw = "";
try { moveStepsEdit(mk(), [P(9)], P(), 0); } catch (e) { threw = e.message; }
ok(/no longer where it was/.test(threw), "a stale path refuses the whole move");
ok(JSON.stringify(outermostPaths([P(1), P(1, "true", "commands", 0), P(2)])) === JSON.stringify([P(1), P(2)]), "outermostPaths leaves out the ones inside another");

// ---- the same settings on several steps
const catalog = new Map([["update_record", { name: "Update Record", params: [{ param: "resource", label: "Resource", type: "string", required: true }, { param: "fields", label: "Fields", type: "object" }] }]]);
const two = () => ({ actions: [{ task: { type: "series", commands: [op("update_record", { resource: "orders", fields: { status: "approved" } }), op("send_email", { to: "x" }), op("update_record", { resource: "inventory", fields: { reserved: 1 }, extra: "kept" })] } }] });
d = two();
out = updateOperatorsEdit(d, [P(0), P(2)], "update_record", { resource: "stock" }, catalog);
const cs = out.actions[0].task.commands;
ok(cs[0].data.resource === "stock" && cs[2].data.resource === "stock", "the changed setting goes to both");
ok(JSON.stringify(cs[0].data.fields) === '{"status":"approved"}' && JSON.stringify(cs[2].data.fields) === '{"reserved":1}' && cs[2].data.extra === "kept", "each keeps its other settings (and ones the catalog doesn't list)");
ok(d.actions[0].task.commands[0].data.resource === "orders" && cs[1].data.to === "x", "the original and other steps aren't changed");
threw = "";
try { updateOperatorsEdit(two(), [P(0), P(1)], "update_record", { resource: "stock" }, catalog); } catch (e) { threw = e.message; }
ok(/isn't the Update Record step it was/.test(threw), "a step of another operator refuses the whole change");
threw = "";
try { updateOperatorsEdit(two(), [P(0), P(2)], "update_record", { resource: "" }, catalog); } catch (e) { threw = e.message; }
ok(/Resource is required/.test(threw), "a required setting emptied is refused for all: " + threw);

// ---- the messages
const raw = fs.readFileSync(process.argv[2], "utf8");
ok(/case "moveSteps":[\s\S]{0,1500}moveStepsEdit\(draft, paths, toChildrenPath/.test(raw), "moveSteps is one draft edit through moveStepsEdit");
ok(/case "updateOperators":[\s\S]{0,1800}updateOperatorsEdit\(draft, paths, operator/.test(raw) && /RESERVED_PATH_KEYS\.has\(key\)/.test(raw.slice(raw.indexOf('case "updateOperators"'), raw.indexOf('case "updateOperators"') + 1500)), "updateOperators is one draft edit, prototype keys left out");
ok(/case "readNodes":[\s\S]{0,1200}type: "nodesParams"[\s\S]{0,400}stepFormValues\(definition, stepPath, catalog\)/.test(raw), "readNodes answers nodesParams with each step's settings");
