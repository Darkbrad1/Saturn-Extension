// Parity tests, part 1: step editors, clipboard, context menu, workflow switching.
import { chromium } from "playwright";
const out = process.env.SHOTS ?? "shots";
const b = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs = [];
p.on("pageerror", (e) => errs.push("pageerror: " + e.message));
p.on("console", (m) => /Content Security|Refused/.test(m.text()) && errs.push("CSP: " + m.text()));
const ok = (c, msg) => console.log((c ? "PASS " : "FAIL ") + msg);
const def = (id) => p.evaluate((id) => window.__getDef(id), id);
const opened = () => p.evaluate(() => window.__opened ?? []);
const node = (t) => p.locator(".react-flow__node", { hasText: t }).first();
const field = (label) => p.locator(".fg-panel .nv-field", { has: p.locator(".nv-field-name", { hasText: new RegExp(`^${label}\\*?$`) }) });

await p.goto("http://localhost:8765/csp.html");
await p.waitForTimeout(900);
// the node view opens first (0.3.3); these checks start from the list view
await p.getByRole("button", { name: "Back to list view" }).click();
await p.waitForTimeout(200);
await p.getByText("Order fulfilment").first().click();
await p.waitForTimeout(500);
await p.locator(".nv-launch").click();
await p.waitForTimeout(500);

// ---- workflow switcher (goes through the list view)
await p.locator(".nv-wf-switch").click();
await p.waitForTimeout(200);
ok(await p.locator(".nv-picker-item").count() === 3, "switcher lists the instance's workflows");
await p.locator(".nv-picker-item", { hasText: "Support tickets" }).click();
await p.waitForTimeout(800);
ok((await p.locator(".nv-wf-switch").innerText()).includes("Support tickets"), "node view switched workflow");
await p.getByRole("button", { name: "List view" }).click();
await p.waitForTimeout(200);
ok(await p.locator("#root h1, #root h2", { hasText: "Support tickets" }).count() >= 1 || (await p.locator("#root").innerText()).includes("Support tickets"), "list view switched with it");
await p.locator(".nv-launch").click();
await p.waitForTimeout(500);
await p.screenshot({ path: out + "/50-tickets.png" });

// ---- key/value editor (property map)
await node("Property Updater").click();
await p.waitForTimeout(500);
ok(await p.locator(".fg-panel .nv-kv-item").count() === 2, "property map shows its rows");
ok(await p.locator(".fg-panel .nv-field-name", { hasText: "Properties (legacy)" }).count() === 0, "merged param hidden, like the list view");
await p.locator(".fg-panel .nv-kv-add input").nth(0).fill("sla");
await p.locator(".fg-panel .nv-kv-add input").nth(1).fill("4h");
await p.locator(".fg-panel .nv-kv-add input").nth(1).press("Enter");
await p.waitForTimeout(500);
let t = (await def("wf_tickets")).stages[0].actions[0].task.commands;
ok(t[0].data.properties.sla === "4h" && t[0].data.properties.priority === "high", "adding a row writes the property map");
ok(Array.isArray(t[0].data._properties) && t[0].data._properties.some((x) => x.key === "sla"), "legacy _properties kept in step by the host");
await p.locator(".fg-panel .nv-kv-item", { hasText: "queue" }).locator(".nv-kv-x").click();
await p.waitForTimeout(500);
t = (await def("wf_tickets")).stages[0].actions[0].task.commands;
ok(!("queue" in t[0].data.properties), "removing a row writes the property map");
await p.screenshot({ path: out + "/51-kv.png" });

// ---- lookup (single) from the instance's records
await node("Assign Owner").click();
await p.waitForTimeout(600);
ok(await p.locator(".fg-panel .nv-lookup-row").count() === 3, "user lookup lists the instance's users");
ok(await p.locator(".fg-panel .nv-lookup-row", { hasText: "Grace Hopper" }).locator("input").isChecked(), "current user is selected");
await p.locator(".fg-panel .nv-lookup-row", { hasText: "Ada Lovelace" }).click();
await p.waitForTimeout(500);
t = (await def("wf_tickets")).stages[0].actions[0].task.commands;
ok(t[1].data.user === "u1", "picking a user applies it");

// ---- lookup (multiple) with a stale id
await node("Notify Groups").click();
await p.waitForTimeout(600);
ok((await p.locator(".fg-panel .nv-lookup-note.is-warn").innerText()).includes("g9"), "stale ids are flagged");
await p.locator(".fg-panel .nv-lookup-row", { hasText: "Finance" }).click();
await p.waitForTimeout(500);
t = (await def("wf_tickets")).stages[0].actions[0].task.commands;
ok(JSON.stringify(t[2].data.groups) === JSON.stringify(["g1", "g9", "g2"]), "ticking a group adds it: " + JSON.stringify(t[2].data.groups));

// ---- resource picker, boolean, secret
await node("Sync Resource").click();
await p.waitForTimeout(500);
const target = field("Target resource").locator("select");
ok((await target.locator("option").allInnerTexts()).includes("invoices"), "resource picker lists resources");
await target.selectOption("invoices");
await p.waitForTimeout(500);
ok((await def("wf_tickets")).stages[0].actions[0].task.commands[3].data.target === "invoices", "resource pick applies");
ok((await field("API key").locator("input").getAttribute("type")) === "password", "sensitive param is masked");
await field("Dry run").locator("select").selectOption("false");
await p.waitForTimeout(500);
ok((await def("wf_tickets")).stages[0].actions[0].task.commands[3].data.dry_run === false, "boolean applies");
await p.screenshot({ path: out + "/52-lookups.png" });

// ---- clipboard: copy a step, paste on a wire (Ctrl+C / Ctrl+V)
await node("Assign Owner").click();
await p.keyboard.press("Control+c");
await p.waitForTimeout(300);
await p.locator(".react-flow__pane").click({ position: { x: 300, y: 760 } });
await p.keyboard.press("Home");
await p.waitForTimeout(400);
const e = p.locator('.react-flow__edge[data-id^="e:start:out"]');
const pt = await e.locator("path").first().evaluate((el) => { const l = el.getTotalLength(); const q = el.getPointAtLength(l * 0.3); const m = el.getScreenCTM(); return { x: q.x * m.a + m.e, y: q.y * m.d + m.f }; });
await p.mouse.click(pt.x, pt.y);
await p.keyboard.press("Control+v");
await p.waitForTimeout(500);
t = (await def("wf_tickets")).stages[0].actions[0].task.commands;
ok(t[0].operator === "assign_owner" && t.length === 5, "Ctrl+V pastes on the selected wire");

// ---- right-click menu: duplicate, disable, paste after
await node("Sync Resource").click({ button: "right" });
await p.waitForTimeout(200);
await p.screenshot({ path: out + "/53-context.png" });
ok(await p.locator(".nv-ctx-item", { hasText: "Disable" }).count() === 1, "context menu offers disable");
await p.locator(".nv-ctx-item", { hasText: "Disable" }).click();
await p.waitForTimeout(500);
t = (await def("wf_tickets")).stages[0].actions[0].task.commands;
ok(t[4].mock === true, "context menu disables the step");
await node("Sync Resource").click({ button: "right" });
await p.locator(".nv-ctx-item", { hasText: /^Paste .* after/ }).click();
await p.waitForTimeout(500);
t = (await def("wf_tickets")).stages[0].actions[0].task.commands;
ok(t.length === 6 && t[5].operator === "assign_owner", "context menu pastes after the step");
// Add menu offers paste too
await p.keyboard.press("Shift+A");
await p.waitForTimeout(200);
ok(await p.locator(".nv-menu-item", { hasText: /^Paste / }).count() === 1, "Add menu offers Paste");
await p.keyboard.press("Escape");

// ---- back to Order fulfilment: If operator select, reference params, designed email
await p.locator(".nv-wf-switch").click();
await p.locator(".nv-picker-item", { hasText: "Order fulfilment" }).click();
await p.waitForTimeout(800);
await p.locator(".nv-ol-item", { hasText: "Approve order" }).click();
await p.waitForTimeout(500);
await p.keyboard.press("Home");
await p.waitForTimeout(300);
await node("If").click();
await p.waitForTimeout(500);
ok((await field("Operator").locator("option").allInnerTexts()).join(" ") === "== != > >= < <=", "If operator is a select like the list view");
await field("Operator").locator("select").selectOption(">=");
await p.waitForTimeout(500);
ok((await def("wf_orders")).stages[0].actions[0].task.commands[1].data.operator === ">=", "If operator applies");
await node("Notify customer").click();
await p.waitForTimeout(500);
ok(await field("Template").count() === 1, "reference shows the command's declared parameter");
ok((await field("Template").locator(".nv-field-caption").innerText()).includes("_params.template"), "parameter caption explains _params");
await p.screenshot({ path: out + "/54-reference.png" });

await p.locator(".nv-ol-item", { hasText: "Reject order" }).click();
await p.waitForTimeout(500);
await node("Send Designed Email").click();
await p.waitForTimeout(500);
await p.locator(".fg-panel .nv-mini-btn", { hasText: "Open Designer" }).click();
await p.waitForTimeout(200);
const o = await opened();
ok(o.some((x) => x.type === "openWorkflow" && x.workflowId === "wf_orders"), "Open Designer opens the workflow in the instance");
ok(await p.locator(".fg-panel .nv-email-title", { hasText: "Designed email" }).count() === 1, "designed email box shown");
await p.screenshot({ path: out + "/55-email.png" });

console.log("errors:", JSON.stringify(errs));
await b.close();
