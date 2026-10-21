// v0.3.37: the layers panel picks several actions or commands (Ctrl/Cmd+click, Shift+click) and drags them
// together: actions into Commands make commands, commands into a stage or Global actions make actions. The
// originals stay. One at a time still reorders.
import { chromium } from "playwright";
const out = process.env.SHOTS ?? "shots";
const b = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs = [];
p.on("pageerror", (e) => errs.push("pageerror: " + e.message));
p.on("console", (m) => /Content Security|Refused/.test(m.text()) && errs.push("CSP: " + m.text()));
const ok = (c, msg) => console.log((c ? "PASS " : "FAIL ") + msg);
const choose = async (what) => { await p.locator(".nv-ask").getByRole("button", { name: new RegExp(`^${what}`) }).click(); await p.waitForTimeout(500); };
const def = () => p.evaluate(() => JSON.parse(JSON.stringify(window.__defs.wf_tickets)));
const group = (name) => p.locator(".nv-ol-group", { has: p.locator(".nv-ol-head-label", { hasText: new RegExp(`^${name}$`) }) });
const stage = () => p.locator(".nv-ol-stage", { has: p.locator(".nv-ol-stagehead", { hasText: "Open" }) });
const row = (scope, label) => scope.locator(".nv-ol-item", { has: p.locator(".nv-ol-label", { hasText: new RegExp(`^${label}$`) }) });
const labels = (list) => list.map((x) => x.label).join();

await p.goto("http://localhost:8765/csp.html");
await p.waitForTimeout(900);
await p.locator(".nv-picker-item", { hasText: "Support tickets" }).click();
await p.waitForTimeout(900);

// ===== pick several actions =====
await row(stage(), "Triage").click({ modifiers: ["Control"] });
await row(group("Global actions"), "Escalate").click({ modifiers: ["Control"] });
await p.waitForTimeout(150);
ok((await p.locator(".nv-ol-item.is-picked").count()) === 2, "Ctrl+click picks two actions (from a stage and Global actions)");
await row(stage(), "Triage").dragTo(group("Commands").locator(".nv-ol-head"));
await choose("Copy");
await p.waitForTimeout(500);
let d = await def();
ok(labels(d.commands) === "Triage,Escalate", "dragging one of them into Commands makes a command from each, in order: " + labels(d.commands));
ok(d.stages[0].actions.length === 1 && d.actions.length === 1, "the actions stay");
await row(group("Commands"), "Triage").click();
await p.waitForTimeout(200);
ok((await p.locator(".nv-ol-item.is-picked").count()) === 0, "a plain click clears the picks (and opens the row)");

// ===== a command into a stage =====
await row(group("Commands"), "Escalate").dragTo(p.locator(".nv-ol-stagehead", { hasText: "Open" }));
await choose("Copy");
await p.waitForTimeout(500);
d = await def();
ok(labels(d.stages[0].actions) === "Triage,Escalate" && d.commands.length === 2, "a command dropped on a stage becomes an action at its end; the command stays");
const made = d.stages[0].actions[1];
ok(made.action === "escalate" && made.task?.type === "series" && made.task.commands.length === 1 && Array.isArray(made.form?.fields) && made.form.fields[0].key === "staff", "with the command's steps as its task and its parameters as the form");

// a command onto an action row: before it
await row(group("Commands"), "Triage").dragTo(row(stage(), "Triage"));
await choose("Copy");
await p.waitForTimeout(500);
d = await def();
ok(labels(d.stages[0].actions) === "Triage,Triage,Escalate" && d.stages[0].actions[0].action === "triage_2", "a command dropped on an action goes in before it, with an unused name: " + d.stages[0].actions.map((a) => a.action).join());

// ===== several commands into Global actions =====
await row(group("Commands"), "Triage").click({ modifiers: ["Control"] });
await row(group("Commands"), "Escalate").click({ modifiers: ["Shift"] });
await p.waitForTimeout(150);
ok((await group("Commands").locator(".nv-ol-item.is-picked").count()) === 2, "Shift+click picks a run of commands");
// the hint counts them
await p.evaluate(() => {
  const groups = [...document.querySelectorAll(".nv-ol-group")];
  const src = [...groups.find((g) => g.querySelector(".nv-ol-head-label")?.textContent === "Commands").querySelectorAll(".nv-ol-item")][0];
  const target = groups.find((g) => g.querySelector(".nv-ol-head-label")?.textContent === "Global actions");
  const dt = new DataTransfer();
  src.dispatchEvent(new DragEvent("dragstart", { bubbles: true, dataTransfer: dt }));
  target.querySelector(".nv-ol-head").dispatchEvent(new DragEvent("dragover", { bubbles: true, cancelable: true, dataTransfer: dt }));
});
await p.waitForTimeout(150);
ok((await group("Global actions").locator(".nv-ol-drop-hint").innerText()).includes("copy or move 2 commands here as actions"), "dragging two shows what will happen to both");
await p.screenshot({ path: out + "/m1-commands-into-global.png" });
await p.evaluate(() => {
  const groups = [...document.querySelectorAll(".nv-ol-group")];
  const src = [...groups.find((g) => g.querySelector(".nv-ol-head-label")?.textContent === "Commands").querySelectorAll(".nv-ol-item")][0];
  src.dispatchEvent(new DragEvent("dragend", { bubbles: true }));
});
await row(group("Commands"), "Triage").dragTo(group("Global actions").locator(".nv-ol-head"));
await choose("Copy");
await p.waitForTimeout(500);
d = await def();
ok(labels(d.actions) === "Escalate,Triage,Escalate" && d.actions[2].action === "escalate_2" && d.commands.length === 2, "two picked commands into Global actions make two actions; names stay unused: " + d.actions.map((a) => a.action).join());

// ===== one at a time still reorders =====
await row(stage(), "Escalate").click();
await p.waitForTimeout(150);
await row(stage(), "Escalate").dragTo(row(stage(), "Triage").first());
await p.waitForTimeout(500);
ok(labels((await def()).stages[0].actions) === "Escalate,Triage,Triage", "dragging one action within its stage still reorders");
// (0.3.41: several picked in one stage now move as a block; test28.mjs covers it)
// a command dropped on Commands does nothing
const before = (await def()).commands.length;
await row(group("Commands"), "Escalate").dragTo(group("Commands").locator(".nv-ol-head"));
await p.waitForTimeout(400);
ok((await def()).commands.length === before, "a command dropped on Commands does nothing");
ok((await p.locator(".nv-busy").count()) === 0, "nothing left on Applying…");

ok(errs.length === 0, "no page errors (" + errs.join(" | ") + ")");
await b.close();
