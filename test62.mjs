// v0.3.72: Write store values. A Parallel holding only Write Store steps is drawn as one "Write store values" card
// (a row per key); its side panel edits the rows (key, value, + Add a key, ×, ↑ / ↓), each change one edit of the
// Parallel; the Add menu adds a new one from a small form; right-click: Show as separate steps (the real Parallel and
// its Write Store steps) and back. What's saved is always the Parallel of Write Store steps.
import { chromium } from "playwright";
const out = process.env.SHOTS ?? "shots";
const b = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium" });
const p = await b.newPage({ viewport: { width: 1500, height: 950 } });
const errs = [];
p.on("pageerror", (e) => errs.push("pageerror: " + e.message));
p.on("console", (m) => /Content Security|Refused/.test(m.text()) && errs.push("CSP: " + m.text()));
const ok = (c, msg) => console.log((c ? "PASS " : "FAIL ") + msg);
const panel = p.locator(".fg-panel");
const card = () => p.locator(".react-flow__node", { has: p.locator(".nv-node-title", { hasText: /^Write store values$/ }) });
const close = async () => (await p.evaluate(() => JSON.parse(JSON.stringify(window.__getDef("wf_debug"))))).stages[1].actions[0].task.commands;
const par = async () => (await close()).find((c) => c.id === "PWS001");
const open = async () => {
  await p.locator(".nv-card", { hasText: "Debug lab" }).click();
  await p.waitForTimeout(700);
  await p.locator(".nv-ol-item", { hasText: /^Close/ }).first().click();
  await p.waitForTimeout(800);
};

await p.goto("http://localhost:8765/csp.html");
await p.evaluate(() => localStorage.clear());
await p.goto("http://localhost:8765/csp.html");
await p.waitForTimeout(900);
await open();

// ===== one card =====
ok((await card().count()) === 1 && (await p.locator(".react-flow__node", { has: p.locator(".nv-node-title", { hasText: /^Write Store Value$/ }) }).count()) === 0, "a Parallel of Write Store steps shows as one Write store values card");
const rows = await card().locator(".nv-row-key, .nv-node-row .nv-row-name, .nv-row > :first-child").allInnerTexts();
ok(["who", "closed_at", "reason"].every((k) => rows.some((r) => r.trim() === k)), "with a row per key: " + rows.join(", "));
await card().click();
await p.waitForTimeout(900);
await p.screenshot({ path: `${out}/v0372-card.png` });

// ===== the side panel's rows =====
const sec = panel.locator(".fg-section", { hasText: "Store values" });
const keyBox = (i) => sec.locator(".nv-sw-row").nth(i).locator(".nv-sw-key input");
const valBox = (i) => sec.locator(".nv-sw-row").nth(i).locator(".nv-sw-value input");
ok((await sec.locator(".nv-sw-row").count()) === 3 && (await keyBox(0).inputValue()) === "who" && (await valBox(1).inputValue()) === "{{ _util.moment().toISOString() }}", "the side panel lists each key and its whole value");
ok((await valBox(1).locator("xpath=..").locator(".token").count()) > 0, "values are syntax highlighted");
await sec.screenshot({ path: `${out}/v0372-panel.png` });
await valBox(0).fill("underwriter");
await valBox(0).press("Enter");
await p.waitForTimeout(600);
let pw = await par();
ok(pw.type === "parallel" && pw.commands[0].operator === "write_store" && pw.commands[0].data.value === "underwriter" && pw.commands.length === 3, "a changed value is saved in its Write Store step, inside the Parallel");

await sec.getByRole("button", { name: "+ Add a key" }).click();
await p.waitForTimeout(150);
const focusedRow = await p.evaluate(() => document.activeElement?.closest(".nv-sw-row")?.getAttribute("data-row"));
await p.keyboard.type("stage");
await valBox(3).fill("'closed'");
await valBox(3).press("Enter");
await p.waitForTimeout(600);
pw = await par();
ok(focusedRow === "3" && pw.commands.length === 4 && pw.commands[3].operator === "write_store" && pw.commands[3].data.key === "stage" && pw.commands[3].data.value === "'closed'", "+ Add a key adds a row, ready to type, saved as a fourth Write Store step");

await keyBox(3).fill("who");
await keyBox(3).press("Enter");
await p.waitForTimeout(400);
ok((await sec.locator(".nv-sw-problem").innerText()).includes("written twice") && (await par()).commands[3].data.key === "stage", "a key used twice is flagged and not saved");
await keyBox(3).fill("stage");
await keyBox(3).press("Enter");
await p.waitForTimeout(300);

await sec.getByRole("button", { name: "Move reason up" }).click();
await p.waitForTimeout(600);
ok((await par()).commands.map((c) => c.data.key).join() === "who,reason,closed_at,stage", "↑ moves a row up");
await sec.getByRole("button", { name: "Remove closed_at" }).click();
await p.waitForTimeout(600);
pw = await par();
ok(pw.commands.map((c) => c.data.key).join() === "who,reason,stage", "× takes a key out");
await p.locator(".nv-topbar").getByRole("button", { name: "Undo" }).click();
await p.waitForTimeout(700);
ok((await par()).commands.map((c) => c.data.key).join() === "who,reason,closed_at,stage", "one Undo puts it back");

// ===== show as separate steps, and back =====
await card().click({ button: "right" });
await p.waitForTimeout(200);
await p.screenshot({ path: `${out}/v0372-menu.png` });
await p.getByRole("button", { name: "Show as separate steps" }).click();
await p.waitForTimeout(700);
const single = p.locator(".react-flow__node", { has: p.locator(".nv-node-title", { hasText: /^Write Store Value$/ }) });
ok((await card().count()) === 0 && (await single.count()) === 4, "Show as separate steps draws the real Parallel and its Write Store steps");
await p.screenshot({ path: `${out}/v0372-apart.png` });
await p.locator(".nv-ol-item", { hasText: /^Submit/ }).first().click();
await p.waitForTimeout(600);
await p.locator(".nv-ol-item", { hasText: /^Close/ }).first().click();
await p.waitForTimeout(800);
ok((await card().count()) === 0 && (await single.count()) === 4, "and stays that way after going to another action and back");
const parCard = p.locator(".react-flow__node", { has: p.locator(".nv-node-title", { hasText: /^Parallel$/ }) }).first();
await parCard.click({ button: "right" });
await p.waitForTimeout(200);
await p.getByRole("button", { name: "Show as one Write store values card" }).click();
await p.waitForTimeout(700);
ok((await card().count()) === 1 && (await single.count()) === 0, "the Parallel's right-click menu turns it back into one card");

// ===== adding one =====
await card().click();
await p.waitForTimeout(400);
await p.keyboard.press("Shift+A");
await p.waitForTimeout(200);
await p.keyboard.type("store values");
await p.waitForTimeout(150);
const item = p.locator(".nv-menu-item", { hasText: "Write store values" });
ok((await item.count()) === 1, "the Add menu offers Write store values");
await item.click();
await p.waitForTimeout(300);
const modal = p.locator(".nv-modal");
ok((await modal.count()) === 1 && (await modal.getByRole("button", { name: "Add", exact: true }).isDisabled()), "it asks for the keys first (Add waits for one)");
await p.keyboard.type("total");
await modal.locator(".nv-sw-value input").first().fill("{{ _flow.length }}");
await modal.getByRole("button", { name: "+ Add a key" }).click();
await p.keyboard.type("checked_at");
await modal.locator(".nv-sw-value input").nth(1).fill("{{ _util.moment().toISOString() }}");
await p.screenshot({ path: `${out}/v0372-add.png` });
await modal.getByRole("button", { name: "Add", exact: true }).click();
await p.waitForTimeout(700);
const added = (await close()).find((c) => c.type === "parallel" && c.id !== "PWS001");
ok(added && added.operator === "parallel" && added.commands.length === 2 && added.commands.every((c) => c.type === "command" && c.operator === "write_store") && added.commands[0].data.key === "total" && added.commands[1].data.value === "{{ _util.moment().toISOString() }}", "Add saves a Parallel of Write Store steps, one per key: " + JSON.stringify(added));
ok((await card().count()) === 2, "and it shows as one more Write store values card");
await p.screenshot({ path: `${out}/v0372-added.png` });

ok(errs.length === 0, "no page or CSP errors: " + errs.join(" | "));
await b.close();
