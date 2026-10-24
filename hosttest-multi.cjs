// v0.3.60: several picked in the layers panel: deleteItemsEdit, duplicateItemsEdit, moveStagesEdit, saveAccessMany.
// v0.3.59: several steps at once on the canvas: moveStepsEdit (picked steps dragged together onto a wire, one edit,
// in document order, by identity) and updateOperatorsEdit (the same changed settings on several steps of one
// operator, each keeping the rest), plus the readNodes / moveSteps / updateOperators messages.
const fs = require("fs"), Module = require("module");
const src = fs.readFileSync(process.argv[2], "utf8") + "\n;module.exports.__t={moveStepsEdit,updateOperatorsEdit,outermostPaths,deleteItemsEdit,duplicateItemsEdit,moveStagesEdit,isItemPath};";
const stub = new Proxy(function () {}, { get: (t, k) => (k === Symbol.toPrimitive ? () => "" : stub), apply: () => stub, construct: () => stub });
const m = new Module("ext"); m.filename = "/x/extension.js";
const orig = Module._load; Module._load = (r, p, i) => (r === "vscode" ? stub : orig(r, p, i));
m._compile(src, m.filename);
const { moveStepsEdit, updateOperatorsEdit, outermostPaths, deleteItemsEdit, duplicateItemsEdit, moveStagesEdit, isItemPath } = m.exports.__t;
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

// ---- the layers panel (0.3.60)
const labels = (list) => list.map((x) => x.label).join();
const wf = () => ({
  stages: [{ stage: "a", label: "A", actions: [{ id: "x1", action: "one", label: "One", task: { type: "series", commands: [] } }, { id: "x2", action: "two", label: "Two", task: { type: "series", commands: [] } }] }, { stage: "b", label: "B", actions: [] }, { stage: "c", label: "C", actions: [] }],
  actions: [{ id: "g1", action: "glob", label: "Glob", task: { type: "series", commands: [op("A")] } }],
  commands: [{ id: "c1", name: "cmd", label: "Cmd", command: { type: "series", commands: [] } }],
});
ok(isItemPath("action", ["stages", 0, "actions", 1]) && isItemPath("action", ["actions", 0]) && isItemPath("stage", ["stages", 2]) && !isItemPath("stage", ["actions", 0]) && !isItemPath("command", ["commands", "__proto__"]), "isItemPath knows where each kind sits");
let w = deleteItemsEdit(wf(), "action", [["stages", 0, "actions", 0], ["actions", 0]]);
ok(labels(w.stages[0].actions) === "Two" && w.actions.length === 0, "deleteItemsEdit removes actions from different lists in one change");
w = deleteItemsEdit(wf(), "stage", [["stages", 0], ["stages", 2]]);
ok(labels(w.stages) === "B", "and stages (with their actions)");
threw = "";
try { deleteItemsEdit(wf(), "action", [["stages", 0, "actions", 5]]); } catch (e) { threw = e.message; }
ok(/no longer where it was/.test(threw), "a stale path refuses the delete");
threw = "";
try { deleteItemsEdit(wf(), "stage", [["actions", 0]]); } catch (e) { threw = e.message; }
ok(/no longer where it was/.test(threw), "a path of another kind refuses it");
w = duplicateItemsEdit(wf(), "action", [["stages", 0, "actions", 0], ["stages", 0, "actions", 1], ["actions", 0]]);
ok(labels(w.stages[0].actions) === "One,One (copy),Two,Two (copy)" && labels(w.actions) === "Glob,Glob (copy)", "duplicateItemsEdit puts a copy right below each");
ok(new Set([...w.stages[0].actions, ...w.actions].map((a) => a.id)).size === 6 && w.stages[0].actions[1].action === "one_copy", "with new ids and unused names");
w = moveStagesEdit(wf(), [1, 2], 0);
ok(labels(w.stages) === "B,C,A", "moveStagesEdit moves several stages together, in order, before the one at toIndex: " + labels(w.stages));
w = moveStagesEdit(wf(), [0, 2], null);
ok(labels(w.stages) === "B,A,C", "to the end");
threw = "";
try { moveStagesEdit(wf(), [7], 0); } catch (e) { threw = e.message; }
ok(/no longer where it was/.test(threw), "a stale index refuses the move");
const raw2 = fs.readFileSync(process.argv[2], "utf8");
ok(/case "deleteItems":[\s\S]{0,400}deleteItemsEdit\(draft, kind, paths\)/.test(raw2) && /case "duplicateItems":[\s\S]{0,400}duplicateItemsEdit\(draft, kind, paths\)/.test(raw2) && /case "moveStages":[\s\S]{0,800}moveStagesEdit\(draft/.test(raw2), "deleteItems / duplicateItems / moveStages are each one draft edit");
ok(/case "setAccessMany":[\s\S]{0,800}this\.saveAccessMany\(/.test(raw2) && /async saveAccessMany\(workflowId, actionPaths, rules\)[\s\S]{0,900}Open to everyone[\s\S]{0,1500}applyEdit\(/.test(raw2), "setAccessMany asks before opening them to everyone, then one draft edit");
