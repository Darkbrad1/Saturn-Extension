// v0.3.35: in the node view's layers panel, an action (from a stage or Global actions) dragged into Commands
// becomes a command too (the action stays), and actions and commands have Duplicate in their right-click menu.
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
const item = (label) => p.locator(".nv-ol-item", { has: p.locator(".nv-ol-label", { hasText: new RegExp(`^${label.replace(/[()]/g, "\\$&")}$`) }) });
const commandsGroup = () => p.locator(".nv-ol-group", { has: p.locator(".nv-ol-head-label", { hasText: /^Commands$/ }) });

await p.goto("http://localhost:8765/csp.html");
await p.waitForTimeout(900);
await p.locator(".nv-picker-item", { hasText: "Support tickets" }).click();
await p.waitForTimeout(900);

// ===== drag a stage action into Commands =====
ok((await def()).commands.length === 0, "the workflow starts with no commands");
await item("Triage").dragTo(commandsGroup().locator(".nv-ol-head"));
await choose("Copy");
await p.waitForTimeout(500);
let d = await def();
ok(d.commands.length === 1 && d.commands[0].label === "Triage" && d.commands[0].name === "triage", "dropping a stage action on Commands makes a command from it");
ok(d.commands[0].command.commands.length === 4 && d.commands[0].command.commands[0].operator === "property_updater", "with the action's steps");
ok(d.stages[0].actions.length === 1 && d.stages[0].actions[0].label === "Triage", "the action stays in its stage");
ok((await item("Triage").count()) === 2, "both show in the layers panel");

// ===== drag a global action onto a command: it goes before it =====
await item("Escalate").dragTo(commandsGroup().locator(".nv-ol-item").first());
await choose("Copy");
await p.waitForTimeout(500);
d = await def();
ok(d.commands.map((c) => c.label).join() === "Escalate,Triage", "a global action dropped on a command goes in before it");
ok(Array.isArray(d.commands[0].parameters?.fields) && d.commands[0].parameters.fields[0]?.key === "staff", "its form becomes the command's parameters");
ok(d.actions.length === 1, "the global action stays");

// while dragging, Commands says what will happen
await item("Escalate").first().hover();
await p.evaluate(() => {
  const src = [...document.querySelectorAll(".nv-ol-item")].find((e) => e.textContent.includes("Escalate"));
  const target = [...document.querySelectorAll(".nv-ol-group")].find((g) => g.querySelector(".nv-ol-head-label")?.textContent === "Commands");
  const dt = new DataTransfer();
  src.dispatchEvent(new DragEvent("dragstart", { bubbles: true, dataTransfer: dt }));
  target.querySelector(".nv-ol-head").dispatchEvent(new DragEvent("dragover", { bubbles: true, cancelable: true, dataTransfer: dt }));
});
await p.waitForTimeout(150);
ok((await p.locator(".nv-ol-group.is-drop-into .nv-ol-drop-hint").count()) === 1, "dragging over Commands highlights it with a hint");
await p.screenshot({ path: out + "/c1-drag-into-commands.png" });
await p.evaluate(() => {
  const src = [...document.querySelectorAll(".nv-ol-item")].find((e) => e.textContent.includes("Escalate"));
  src.dispatchEvent(new DragEvent("dragend", { bubbles: true }));
});
await p.waitForTimeout(100);

// a stage can't be dropped into Commands
await p.locator(".nv-ol-stagehead", { hasText: "Open" }).dragTo(commandsGroup().locator(".nv-ol-head"));
await p.waitForTimeout(400);
ok((await def()).commands.length === 2, "a stage dropped on Commands does nothing");

// ===== Duplicate in the right-click menu =====
await item("Escalate").first().click({ button: "right" });
ok((await p.locator(".nv-ctx").getByRole("button", { name: "Duplicate" }).count()) === 1, "an action's right-click menu has Duplicate");
await p.locator(".nv-ctx").getByRole("button", { name: "Duplicate" }).click();
await p.waitForTimeout(500);
d = await def();
ok(d.actions.length === 2 && d.actions[1].label === "Escalate (copy)" && d.actions[1].action === "escalate_copy" && d.actions[1].id !== d.actions[0].id, "Duplicate puts a copy right below, with a new name and id");
await item("Triage").last().click({ button: "right" });
await p.locator(".nv-ctx").getByRole("button", { name: "Duplicate" }).click();
await p.waitForTimeout(500);
d = await def();
ok(d.commands.map((c) => c.label).join() === "Escalate,Triage,Triage (copy)" && d.commands[2].name === "triage_copy", "a command duplicates too");
await item("Triage").first().click({ button: "right" });
await p.locator(".nv-ctx").getByRole("button", { name: "Duplicate" }).click();
await p.waitForTimeout(500);
ok((await def()).stages[0].actions.map((a) => a.label).join() === "Triage,Triage (copy)", "and a stage action, in its stage");
await p.locator(".nv-ol-stagehead", { hasText: "Open" }).click({ button: "right" });
ok((await p.locator(".nv-ctx").getByRole("button", { name: "Duplicate" }).count()) === 0, "a stage's menu has no Duplicate");
await p.keyboard.press("Escape");

ok(errs.length === 0, "no page errors (" + errs.join(" | ") + ")");
await b.close();
