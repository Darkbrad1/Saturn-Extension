import { chromium } from "playwright";
const out = "/tmp/claude-0/-home-claude/a083e21d-6637-5cac-92a5-bbf1f2d008b9/scratchpad/shots";
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const p = await b.newPage({ viewport: { width: 1440, height: 860 } });
const errs = [];
p.on("pageerror", (e) => errs.push("pageerror: " + e.message));
p.on("console", (m) => /Content Security|Refused/.test(m.text()) && errs.push("CSP: " + m.text()));
const step = (i) => p.evaluate((i) => window.__getDef().stages[0].actions[1].task.commands[i], i);
const opened = () => p.evaluate(() => JSON.stringify(window.__opened ?? []));
const ok = (c, msg) => console.log((c ? "PASS " : "FAIL ") + msg);

await p.goto("http://localhost:8765/csp.html");
await p.waitForTimeout(1000);
// the node view opens first (0.3.3); these checks start from the list view
await p.getByRole("button", { name: "Back to list view" }).click();
await p.waitForTimeout(200);
await p.getByText("Order fulfilment").first().click();
await p.waitForTimeout(700);
await p.locator(".nv-launch").click();
await p.waitForTimeout(600);
await p.getByRole("button", { name: /Reject order/ }).click();
await p.waitForTimeout(800);
await p.screenshot({ path: out + "/20-reject.png" });

// disabled styling
ok(await p.locator('.nv-node.is-disabled', { hasText: "Send Email" }).count() === 1, "disabled Send Email drawn as disabled");
ok(await p.locator('.nv-node.is-disabled', { hasText: "Run Script" }).count() === 0, "mock:false Run Script drawn as enabled");

// code row button -> openParamEditor
await p.locator('.react-flow__node', { hasText: "Run Script" }).locator(".nv-row-btn.is-code").click();
await p.waitForTimeout(200);
let o = JSON.parse(await opened());
ok(o[0]?.type === "openParamEditor" && o[0].param === "code" && o[0].language === "javascript" && o[0].operator === "run_script" && o[0].workflowId === "wf_orders" && o[0].contextName === "new-reject" && JSON.stringify(o[0].path) === JSON.stringify(["stages",0,"actions",1,"task","commands",3]), "code button sends openParamEditor " + JSON.stringify(o[0]));

// email row button -> openHtmlParam
await p.locator('.react-flow__node', { hasText: "Send Designed Email" }).locator(".nv-row-btn.is-email").click();
await p.waitForTimeout(200);
o = JSON.parse(await opened());
ok(o[1]?.type === "openHtmlParam" && o[1].param === "message" && o[1].workflowName === "Order fulfilment", "email button sends openHtmlParam " + JSON.stringify(o[1]));

// side panel file buttons
await p.locator('.react-flow__node', { hasText: "Send Designed Email" }).click();
await p.waitForTimeout(200);
await p.screenshot({ path: out + "/21-email-panel.png" });
ok(await p.locator(".fg-panel .fg-file", { hasText: "Message" }).count() === 1, "panel offers email preview");

// edit in the panel on the designed email keeps the design object
await p.locator('.react-flow__node', { hasText: "Send Designed Email" }).click();
await p.waitForTimeout(400);
ok(await p.locator(".fg-panel .nv-email-box", { hasText: "Edit HTML" }).count() === 1, "panel shows the email box (Edit HTML), not text");
const to = p.locator(".fg-panel .nv-field", { hasText: "To" }).locator("input");
await to.fill("{{ record.alt_email }}");
await to.press("Enter");
await p.waitForTimeout(500);
let s2 = await step(2);
ok(s2.data.to === "{{ record.alt_email }}" && typeof s2.data.message === "object" && s2.data.message.json?.schemaVersion === 16, "panel edit kept designed email object");

// code field: Open in editor from the panel
await p.locator('.react-flow__node', { hasText: "Run Script" }).click();
await p.waitForTimeout(400);
await p.locator(".fg-panel .nv-link").click();
await p.waitForTimeout(200);
o = JSON.parse(await opened());
ok(o[2]?.type === "openParamEditor" && o[2].param === "code", "panel 'Open in editor' opens the code editor");

// M toggles disabled
await p.locator('.react-flow__node', { hasText: "Send Email" }).first().click();
await p.waitForTimeout(150);
ok(await p.locator(".fg-panel .fg-banner").count() === 1, "panel explains disabled");
await p.keyboard.press("m");
await p.waitForTimeout(500);
ok((await step(1)).mock === false, "M enables (mock:false)");
ok(await p.locator('.nv-node.is-disabled').count() === 0, "node no longer drawn disabled");
await p.keyboard.press("m");
await p.waitForTimeout(500);
ok((await step(1)).mock === true, "M disables again (mock:true)");
await p.screenshot({ path: out + "/24-disabled-selected.png" });

// list view: badge + toggle (workflowId filled in by the bridge)
await p.getByRole("button", { name: "List view" }).click();
await p.waitForTimeout(300);
await p.getByText("New", { exact: true }).first().click();
await p.waitForTimeout(300);
await p.getByText("Reject order").first().click();
await p.waitForTimeout(600);
await p.screenshot({ path: out + "/25-list-disabled.png", fullPage: true });
ok(await p.getByText("Disabled", { exact: true }).count() >= 1, "list view shows Disabled badge");
const en = p.getByRole("button", { name: "Enable", exact: true });
ok(await en.count() === 1, "list view has Enable button on the disabled step");
await en.click();
await p.waitForTimeout(600);
ok((await step(1)).mock === false, "list view Enable writes mock:false");
ok(await p.getByRole("button", { name: "Disable", exact: true }).count() === 4, "every list operator now offers Disable");
await p.screenshot({ path: out + "/26-list-enabled.png", fullPage: true });
console.log("errors:", JSON.stringify(errs));
await b.close();
