// v0.3.35: duplicateWorkflowItem (an action or command copied right below it) and actionToCommand (a command
// made from an action, which stays), each one draft edit.
const fs = require("fs"), Module = require("module");
const src = fs.readFileSync(process.argv[2], "utf8") + "\n;module.exports.__t={duplicateWorkflowItem,actionToCommand,freeMachineName};";
const stub = new Proxy(function () {}, { get: (t, k) => (k === Symbol.toPrimitive ? () => "" : stub), apply: () => stub, construct: () => stub });
const m = new Module("ext"); m.filename = "/x/extension.js";
const orig = Module._load; Module._load = (r, p, i) => (r === "vscode" ? stub : orig(r, p, i));
m._compile(src, m.filename);
const { duplicateWorkflowItem, actionToCommand, freeMachineName } = m.exports.__t;
const ok = (c, msg) => console.log((c ? "PASS " : "FAIL ") + msg);
const op = (o, id) => ({ type: "command", operator: o, id, data: { x: 1 } });
const form = { fields: [{ key: "reason", label: "Reason", type: "string" }], sections: [] };
const mk = () => ({
  stages: [{ stage: "new", label: "New", actions: [
    { id: "act001", action: "approve", label: "Approve", actors: ["a"], access_control: [{ method: "user_group", data: ["g1"] }], form, task: { type: "series", id: "ser001", commands: [op("UpdateRecord", "stp001")] } },
    { id: "act002", action: "approve_copy", label: "Other", task: { type: "series", commands: [] } },
  ] }],
  actions: [{ id: "act003", action: "notify", label: "Notify", task: { type: "series", commands: [op("SendEmail", "stp002")] } }],
  commands: [{ id: "cmd001", name: "approve", label: "Approve cmd", command: { type: "series", commands: [op("Log", "stp003")] }, parameters: [] }],
});
const ids = (o, out = []) => { if (o && typeof o === "object") { if (typeof o.id === "string") out.push(o.id); Object.values(o).forEach((v) => ids(v, out)); } return out; };

ok(freeMachineName("a", ["a", "a_2"]) === "a_3" && freeMachineName("b", ["a"]) === "b", "freeMachineName adds _2, _3, …");

// duplicate an action in a stage
let d = mk();
let out = duplicateWorkflowItem(d, "action", ["stages", 0, "actions", 0]);
let list = out.stages[0].actions;
ok(list.length === 3 && list[1].label === "Approve (copy)", "the copy is right below, labelled (copy)");
ok(list[1].action === "approve_copy_2", "its machine name is unused in that list (approve_copy was taken): " + list[1].action);
ok(list[1].id !== "act001" && list[1].task.id && list[1].task.id !== "ser001" && list[1].task.commands[0].id !== "stp001", "new ids for it and its steps");
ok(JSON.stringify(list[1].access_control) === JSON.stringify(list[0].access_control) && JSON.stringify(list[1].form) === JSON.stringify(form) && list[1].task.commands[0].data.x === 1, "settings, form and step data copied");
const all = ids(out);
ok(all.length === new Set(all).size, "no id twice in the workflow");
ok(d.stages[0].actions.length === 2, "the original isn't changed");

// duplicate a global action and a command
out = duplicateWorkflowItem(mk(), "action", ["actions", 0]);
ok(out.actions.length === 2 && out.actions[1].action === "notify_copy", "a global action duplicates in its list");
out = duplicateWorkflowItem(mk(), "command", ["commands", 0]);
ok(out.commands.length === 2 && out.commands[1].name === "approve_copy" && out.commands[1].label === "Approve cmd (copy)" && out.commands[1].command.commands[0].id !== "stp003", "a command duplicates, name and steps too");

// action to command
d = mk();
out = actionToCommand(d, ["stages", 0, "actions", 0], null);
const c = out.commands[1];
ok(out.commands.length === 2 && out.stages[0].actions.length === 2, "a command is added; the action stays");
ok(c.label === "Approve" && c.name === "approve_2", "label kept; name made unused among commands (approve was taken): " + c.name);
ok(c.command.type === "series" && c.command.commands[0].operator === "UpdateRecord" && c.command.commands[0].id !== "stp001" && c.id !== "act001", "its steps, with fresh ids, and a new id");
ok(JSON.stringify(c.parameters) === JSON.stringify(form), "its form becomes the parameters");
ok(!("actors" in c) && !("access_control" in c) && !("task" in c) && !("action" in c), "action-only settings are not carried over");
out = actionToCommand(mk(), ["actions", 0], 0);
ok(out.commands[0].name === "notify" && out.commands[1].name === "approve", "a global action, placed at the index dropped on");
let threw = false;
try { actionToCommand(mk(), ["commands", 0], null); } catch (e) { threw = /no longer where it was/.test(e.message); }
ok(threw, "only an action can become a command");
threw = false;
try { duplicateWorkflowItem(mk(), "action", ["actions", 5]); } catch (e) { threw = /no longer where it was/.test(e.message); }
ok(threw, "a stale path is refused");
const raw = fs.readFileSync(process.argv[2], "utf8");
ok(raw.includes('case "duplicateItem"') && raw.includes('case "actionToCommand"'), "the Workflows panel answers duplicateItem and actionToCommand");
