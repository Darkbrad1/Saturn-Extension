// v0.3.68: "Show only when". Saturn's operator list gives some step settings a rule (form_visibility), and the side
// panel and the Add form show such a setting only while its rule is true, like Saturn's own form. Create Task's
// completion settings, from the owner's list: Completion Property / Value for record_update, Completion Action for
// workflow_action, Completion Actor for anything but manual; Start Date when Period is custom (a rule with a body).
import { chromium } from "playwright";
const out = process.env.SHOTS ?? "shots";
const b = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const p = await b.newPage({ viewport: { width: 1500, height: 1000 } });
const errs = [];
p.on("pageerror", (e) => errs.push("pageerror: " + e.message));
p.on("console", (m) => /Content Security|Refused/.test(m.text()) && errs.push("CSP: " + m.text()));
const ok = (c, msg) => console.log((c ? "PASS " : "FAIL ") + msg);
const task = async () => (await p.evaluate(() => JSON.parse(JSON.stringify(window.__getDef("wf_orders").stages[0].actions[0].task.commands)))).find((s) => s.operator === "create_task");
const names = (scope) => scope.locator(".nv-field-name").allInnerTexts();
const field = (scope, label) => scope.locator(".nv-field", { has: p.locator(".nv-field-name", { hasText: new RegExp(`^${label}`) }) });

await p.goto("http://localhost:8765/csp.html");
await p.waitForTimeout(900);
await p.locator(".nv-picker-item", { hasText: "Order fulfilment" }).click();
await p.waitForTimeout(800);
await p.locator(".nv-ol-item", { hasText: "Approve order" }).click();
await p.waitForTimeout(600);

// ===== the Add form =====
await p.keyboard.press("Shift+A");
await p.waitForTimeout(200);
await p.locator(".nv-menu-item", { hasText: "Create Task" }).click();
await p.waitForTimeout(300);
const modal = p.locator(".nv-modal");
let shown = await names(modal);
ok(shown.includes("Completion Indicator") && !shown.some((n) => /Completion (Property|Value|Action|Actor)/.test(n)), "with Completion Indicator on manual, its completion settings are hidden: " + shown.join(", "));
ok(!shown.includes("Start Date"), "Start Date is hidden until Period is custom");
await field(modal, "Completion Indicator").locator("select").selectOption("record_update");
await p.waitForTimeout(200);
shown = await names(modal);
ok(shown.includes("Completion Property") && shown.includes("Completion Value") && shown.includes("Completion Actor") && !shown.includes("Completion Action"), "record_update shows Property, Value and Actor (not Action): " + shown.join(", "));
await p.screenshot({ path: `${out}/v0368-addform.png` });
await modal.locator("input").first().fill("Confirm payment");
await field(modal, "Completion Property").locator("input").fill("payment_status");
await modal.getByRole("button", { name: "Add" }).click();
await p.waitForTimeout(700);
let t = await task();
ok(t && t.data.completion_indicator === "record_update" && t.data.completion_property === "payment_status", "the step is added with them");

// ===== the side panel =====
await p.locator(".react-flow__node", { hasText: "Create Task" }).first().click();
await p.waitForTimeout(700);
const panel = p.locator(".fg-panel");
shown = await names(panel);
ok(shown.includes("Completion Property") && shown.includes("Completion Value"), "the side panel shows them too, for record_update");
await field(panel, "Completion Indicator").locator("select").selectOption("workflow_action");
await p.waitForTimeout(800);
shown = await names(panel);
ok(shown.includes("Completion Action") && !shown.includes("Completion Property") && !shown.includes("Completion Value"), "switching to workflow_action swaps them at once: " + shown.join(", "));
await p.screenshot({ path: `${out}/v0368-panel.png` });
t = await task();
ok(t.data.completion_indicator === "workflow_action" && t.data.completion_property === "payment_status", "a hidden setting keeps its value (Completion Property is still payment_status)");
await field(panel, "Completion Indicator").locator("select").selectOption("record_update");
await p.waitForTimeout(800);
ok((await field(panel, "Completion Property").locator("input").inputValue()) === "payment_status", "switching back shows it again with its value");

// a rule with a body: return params.period == "custom"
await field(panel, "Period").locator("select").selectOption("custom");
await p.waitForTimeout(800);
ok((await names(panel)).includes("Start Date"), "Period custom shows Start Date (a rule written as a function with return)");
await field(panel, "Period").locator("select").selectOption("today");
await p.waitForTimeout(800);
ok(!(await names(panel)).includes("Start Date"), "and another period hides it");

ok(errs.length === 0, "no page errors: " + errs.join(" | "));
await b.close();
