// v0.3.60: several picked in the layers panel: right-click Duplicate / Delete for all, the Delete key (after a
// confirm naming them), several stages picked and dragged together, and the access rules several actions share.
import { chromium } from "playwright";
const out = process.env.SHOTS ?? "shots";
const b = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs = [];
p.on("pageerror", (e) => errs.push("pageerror: " + e.message));
const ok = (c, msg) => console.log((c ? "PASS " : "FAIL ") + msg);
const def = () => p.evaluate(() => JSON.parse(JSON.stringify(window.__defs.wf_orders)));
const posted = (type) => p.evaluate((t) => (window.__posted || []).filter((m) => m.type === t).length, type);
const row = (label) => p.locator(".nv-ol-item", { has: p.locator(".nv-ol-label", { hasText: new RegExp(`^${label}$`) }) }).first();
const stageHead = (label) => p.locator(".nv-ol-stagehead", { has: p.locator(".nv-ol-label", { hasText: new RegExp(`^${label}$`) }) }).first();
const labels = (list) => list.map((x) => x.label).join();
const open = async () => {
  await p.goto("http://localhost:8765/csp.html");
  await p.waitForTimeout(900);
  await p.locator(".nv-picker-item", { hasText: "Order fulfilment" }).click().catch(() => {});
  await p.waitForTimeout(600);
};

// ===== right-click on a picked row: for all of them =====
await open();
await row("Approve order").click({ modifiers: ["Control"] });
await row("Reject order").click({ modifiers: ["Control"] });
await row("Approve order").click({ button: "right" });
await p.waitForTimeout(150);
const menu = p.locator(".nv-ctx");
ok(/2 actions picked/i.test(await menu.innerText()) && !(await menu.innerText()).includes("Rename"), "right-click on a picked row: a menu for both, no Rename");
await p.screenshot({ path: out + "/k1-menu.png" });
await menu.getByRole("button", { name: "Duplicate 2 actions" }).click();
await p.waitForTimeout(500);
let d = await def();
ok(labels(d.stages[0].actions) === "Approve order,Approve order (copy),Reject order,Reject order (copy)", "Duplicate makes a copy of each, right below it: " + labels(d.stages[0].actions));
ok((await posted("duplicateItems")) === 1, "as one change");

// ===== the Delete key, after a confirm naming them =====
await open();
await row("Approve order").click({ modifiers: ["Control"] });
await row("Resend invoice").click({ modifiers: ["Control"] });
await p.keyboard.press("Delete");
await p.waitForTimeout(150);
const box = p.locator(".nv-confirm");
ok((await box.count()) === 1 && (await box.innerText()).includes("Delete 2 actions?") && (await box.innerText()).includes("Approve order, Resend invoice"), "Delete asks first, naming them");
await p.screenshot({ path: out + "/k2-confirm.png" });
await box.getByRole("button", { name: "Cancel" }).click();
d = await def();
ok(d.stages[0].actions.length === 2 && d.actions.length === 1 && (await p.locator(".nv-ol-item.is-picked").count()) === 2, "Cancel keeps them (still picked)");
await p.locator(".nv-outliner").focus();
await p.keyboard.press("Delete");
await p.locator(".nv-confirm").getByRole("button", { name: "Delete", exact: true }).click();
await p.waitForTimeout(500);
d = await def();
ok(labels(d.stages[0].actions) === "Reject order" && d.actions.length === 0 && (await posted("deleteItems")) === 1, "Delete removes both, as one change");

// ===== several stages =====
await open();
await p.evaluate(() => { window.__defs.wf_orders.stages.push({ stage: "closed", label: "Closed", color: "#999999", actions: [] }); window.__reply("wf_orders"); });
await p.waitForTimeout(400);
await stageHead("Shipped").click({ modifiers: ["Control"] });
await stageHead("Closed").click({ modifiers: ["Control"] });
ok((await p.locator(".nv-ol-stagehead.is-picked").count()) === 2, "Ctrl+click picks stages");
await stageHead("Shipped").dragTo(stageHead("New"));
await p.waitForTimeout(500);
d = await def();
ok(d.stages.map((s) => s.label).join() === "Shipped,Closed,New" && (await posted("moveStages")) === 1, "dragging one moves both, in order, before New: " + d.stages.map((s) => s.label).join());
await stageHead("Shipped").click({ modifiers: ["Control"] });
await stageHead("Closed").click({ modifiers: ["Control"] });
await stageHead("Closed").click({ button: "right" });
ok((await p.locator(".nv-ctx").innerText()).includes("Delete 2 stages") && !(await p.locator(".nv-ctx").innerText()).includes("Duplicate"), "right-click on picked stages: Delete for both (stages have no Duplicate)");
await p.keyboard.press("Escape");
await p.locator(".nv-menu-back").click({ position: { x: 5, y: 5 } }).catch(() => {});

// ===== the access rules several actions share =====
await open();
await row("Approve order").click({ modifiers: ["Control"] });
await row("Resend invoice").click({ modifiers: ["Control"] });
await p.waitForTimeout(300);
const panel = p.locator(".fg-panel");
ok((await panel.innerText()).includes("2 actions picked") && (await panel.innerText()).includes("Mixed"), "the side panel: 2 actions picked, their rules Mixed (one has a rule, one has none)");
await panel.locator("#multi-access").locator(".fg-plus").click().catch(async () => { await panel.getByTitle("Set who may perform all of them").click(); });
await p.waitForTimeout(300);
await panel.locator(".fg-access-method", { hasText: "User Group" }).locator("input[type=checkbox]").first().check();
await p.waitForTimeout(200);
await panel.locator(".fg-checklist .fg-check", { hasText: "Finance" }).locator("input").check();
await p.screenshot({ path: out + "/k3-access.png" });
await panel.getByRole("button", { name: "Save access" }).click();
await p.waitForTimeout(500);
d = await def();
const rules = (a) => JSON.stringify((a.access_control || []).map((r) => [r.method, r.data]));
ok(rules(d.stages[0].actions[0]) === '[["user_group",["g2"]]]' && rules(d.actions[0]) === '[["user_group",["g2"]]]' && (await posted("setAccessMany")) === 1, "saving gives both the same rules, as one change");
ok((await panel.innerText()).includes("1 selected") && !(await panel.innerText()).includes("Mixed"), "now they share them");

ok(errs.length === 0, "no page errors (" + errs.join(" | ") + ")");
await b.close();
