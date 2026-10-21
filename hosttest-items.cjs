// v0.3.35: duplicateWorkflowItem (an action or command copied right below it) and actionToCommand (a command
// made from an action, which stays), each one draft edit. v0.3.37: commandToAction, and copyItemsAs for several. v0.3.41: moveActions. v0.3.42: copyActions, and copyItemsAs with move.
const fs = require("fs"), Module = require("module");
const src = fs.readFileSync(process.argv[2], "utf8") + "\n;module.exports.__t={duplicateWorkflowItem,actionToCommand,commandToAction,copyItemsAs,moveActions,copyActions,freeMachineName};";
const stub = new Proxy(function () {}, { get: (t, k) => (k === Symbol.toPrimitive ? () => "" : stub), apply: () => stub, construct: () => stub });
const m = new Module("ext"); m.filename = "/x/extension.js";
const orig = Module._load; Module._load = (r, p, i) => (r === "vscode" ? stub : orig(r, p, i));
m._compile(src, m.filename);
const { duplicateWorkflowItem, actionToCommand, commandToAction, copyItemsAs, moveActions, copyActions, freeMachineName } = m.exports.__t;
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
// command to action
d = mk();
out = commandToAction(d, ["commands", 0], 0, null);
const a = out.stages[0].actions[2];
ok(out.stages[0].actions.length === 3 && out.commands.length === 1, "an action is added to the stage; the command stays");
ok(a.label === "Approve cmd" && a.action === "approve_2" && a.id !== "cmd001", "label kept; name made unused in that stage (approve was taken), a new id: " + a.action);
ok(a.task.commands[0].operator === "Log" && a.task.commands[0].id !== "stp003" && Array.isArray(a.actors) && Array.isArray(a.access_control) && !("form" in a), "its steps as the task (fresh ids), no actors or rules, no form for empty parameters");
ok(!("command" in a) && !("name" in a) && !("parameters" in a), "command-only keys aren't carried over");
const withParams = mk(); withParams.commands[0].parameters = form;
out = commandToAction(withParams, ["commands", 0], null, 0);
ok(out.actions[0].label === "Approve cmd" && out.actions[0].action === "approve" && JSON.stringify(out.actions[0].form) === JSON.stringify(form), "into the global actions, at the index; its parameters become the form");
threw = false;
try { commandToAction(mk(), ["actions", 0], null, null); } catch (e) { threw = /no longer where it was/.test(e.message); }
ok(threw, "only a command can become an action");
threw = false;
try { commandToAction(mk(), ["commands", 0], 7, null); } catch (e) { threw = /stage is no longer there/.test(e.message); }
ok(threw, "a stage that isn't there is refused");

// several at once, one change
out = copyItemsAs(mk(), "command", [["stages", 0, "actions", 0], ["actions", 0]], null, 0);
ok(out.commands.map((c) => c.label).join() === "Approve,Notify,Approve cmd", "several actions become commands, in order, from the index");
ok(out.commands[0].name === "approve_2" && out.commands[1].name === "notify", "each gets an unused name");
const many = mk(); many.commands.push({ id: "cmd002", name: "ping", label: "Ping", command: { type: "series", commands: [] }, parameters: [] });
out = copyItemsAs(many, "action", [["commands", 0], ["commands", 1]], 0, null);
ok(out.stages[0].actions.map((x) => x.label).join() === "Approve,Other,Approve cmd,Ping" && out.commands.length === 2, "several commands become actions at the end of a stage; the commands stay");
const all2 = ids(out);
ok(all2.length === new Set(all2).size, "still no id twice");
threw = false;
try { copyItemsAs(mk(), "command", [], null, null); } catch (e) { threw = /Nothing selected/.test(e.message); }
ok(threw, "an empty selection is refused (so the node view hears back)");

// moving actions between lists
const names = (list) => list.map((x) => x.action).join();
d = mk();
out = moveActions(d, [["actions", 0]], 0, 1);
ok(names(out.stages[0].actions) === "approve,notify,approve_copy" && out.actions.length === 0, "a global action moves into a stage, at the index: " + names(out.stages[0].actions));
ok(out.stages[0].actions[1].id === "act003" && out.stages[0].actions[1].task.commands[0].id === "stp002", "it keeps its id and its steps' ids");
ok(d.actions.length === 1, "the original isn't changed");
out = moveActions(mk(), [["stages", 0, "actions", 0], ["stages", 0, "actions", 1]], null, null);
ok(out.stages[0].actions.length === 0 && names(out.actions) === "notify,approve,approve_copy", "two stage actions move to the end of Global actions, in order: " + names(out.actions));
const clash = mk(); clash.actions.push({ id: "act009", action: "approve", label: "Approve again", task: { type: "series", commands: [] } });
out = moveActions(clash, [["stages", 0, "actions", 0]], null, 0);
ok(names(out.actions) === "approve_2,notify,approve", "a name taken in the target list gets _2: " + names(out.actions));
// several within one list: a block
const three = mk(); three.stages[0].actions.push({ id: "act004", action: "third", label: "Third", task: { type: "series", commands: [] } });
out = moveActions(three, [["stages", 0, "actions", 0], ["stages", 0, "actions", 1]], 0, 3);
ok(names(out.stages[0].actions) === "third,approve,approve_copy", "two picked in one stage move as a block, and keep their names: " + names(out.stages[0].actions));
out = moveActions(three, [["stages", 0, "actions", 2]], 0, 0);
ok(names(out.stages[0].actions) === "third,approve,approve_copy", "one moves up in its own list");
// from both lists at once
out = moveActions(mk(), [["stages", 0, "actions", 1], ["actions", 0]], 0, 0);
ok(names(out.stages[0].actions) === "approve_copy,notify,approve" && out.actions.length === 0, "picked from a stage and Global actions together: " + names(out.stages[0].actions));
const all3 = ids(out);
ok(all3.length === new Set(all3).size, "no id twice after moving");
threw = false;
try { moveActions(mk(), [["commands", 0]], 0, null); } catch (e) { threw = /no longer where it was/.test(e.message); }
ok(threw, "only actions move");
threw = false;
try { moveActions(mk(), [], 0, null); } catch (e) { threw = /Nothing selected/.test(e.message); }
ok(threw, "an empty selection is refused");
threw = false;
try { moveActions(mk(), [["actions", 0]], 4, null); } catch (e) { threw = /stage is no longer there/.test(e.message); }
ok(threw, "a stage that isn't there is refused");

// copying actions into another list
d = mk();
out = copyActions(d, [["stages", 0, "actions", 0], ["actions", 0]], null, 0);
ok(names(out.actions) === "approve,notify_2,notify" && names(out.stages[0].actions) === "approve,approve_copy", "two actions copied to the start of Global actions; the originals stay: " + names(out.actions));
ok(out.actions[0].label === "Approve" && out.actions[0].id !== "act001" && out.actions[0].task.commands[0].id !== "stp001" && out.actions[0].task.id !== "ser001", "a copy keeps its label, with a new id and fresh step ids");
ok(JSON.stringify(out.actions[0].access_control) === JSON.stringify(d.stages[0].actions[0].access_control), "and its settings");
const all4 = ids(out);
ok(all4.length === new Set(all4).size, "no id twice after copying");
// move into Commands / into a stage: the originals go
out = copyItemsAs(mk(), "command", [["stages", 0, "actions", 0], ["stages", 0, "actions", 1]], null, null, true);
ok(out.stages[0].actions.length === 0 && out.commands.map((c) => c.label).join() === "Approve cmd,Approve,Other", "moving two actions into Commands removes them from their stage");
const twoCmds = mk(); twoCmds.commands.push({ id: "cmd002", name: "ping", label: "Ping", command: { type: "series", commands: [] }, parameters: [] });
out = copyItemsAs(twoCmds, "action", [["commands", 0], ["commands", 1]], null, null, true);
ok(out.commands.length === 0 && out.actions.map((x) => x.label).join() === "Notify,Approve cmd,Ping", "moving two commands into Global actions removes the commands");
out = copyItemsAs(mk(), "command", [["stages", 0, "actions", 1], ["actions", 0]], null, 0, true);
ok(names(out.stages[0].actions) === "approve" && out.actions.length === 0 && out.commands.map((c) => c.label).join() === "Other,Notify,Approve cmd", "from a stage and Global actions together");

const raw = fs.readFileSync(process.argv[2], "utf8");
ok(raw.includes('case "copyActions"'), "the Workflows panel answers copyActions");
ok(raw.includes('case "moveActions"'), "the Workflows panel answers moveActions");
ok(raw.includes('case "commandToAction"'), "the Workflows panel answers commandToAction");
ok(raw.includes('case "duplicateItem"') && raw.includes('case "actionToCommand"'), "the Workflows panel answers duplicateItem and actionToCommand");
