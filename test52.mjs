// v0.3.64: two property settings now known from the owner's real definitions: a Dynamic Component input's code
// (input_properties.component_definition, the Application schema's Notes) on the Resources screen, and a lookup's
// Filter (lookup_filter, the Assign Loan officer form's Staff field) on the node view's Form tab.
import { chromium } from "playwright";
const out = process.env.SHOTS ?? "shots";
const b = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
const errs = [];
p.on("pageerror", (e) => errs.push("pageerror: " + e.message));
const ok = (c, msg) => console.log((c ? "PASS " : "FAIL ") + msg);
const row = (scope, label) => scope.locator(".pe-row", { has: p.locator(".pe-label", { hasText: new RegExp(`^${label}$`) }) });

// ===== Resources: Component code =====
await p.goto("http://localhost:8765/resources.html");
await p.waitForTimeout(400);
await p.selectOption(".rs-select select", "LoanApplication");
await p.waitForTimeout(300);
await p.locator(".rs-item", { has: p.locator(".rs-item-key", { hasText: /^note$/ }) }).click();
await p.waitForTimeout(300);
const code = row(p.locator(".pe-page"), "Input component code");
ok((await code.count()) === 1, "a property with a Dynamic Component's code shows Input component code (Input)");
ok((await code.innerText()).includes("ApplicationNotes"), "with its Vue code");
ok((await p.locator(".rs-unsaved").count()) === 0, "nothing unsaved just by opening it");
await p.locator(".rs-item", { has: p.locator(".rs-item-key", { hasText: /^status$/ }) }).click();
await p.waitForTimeout(300);
ok((await row(p.locator(".pe-page"), "Input component code").count()) === 0, "a property without one doesn't show it");

// ===== the Form tab: a lookup's Filter =====
await p.goto("http://localhost:8765/csp.html");
await p.waitForTimeout(900);
await p.locator(".nv-picker-item", { hasText: "Support tickets" }).click();
await p.waitForTimeout(900);
await p.locator(".nv-ol-item", { hasText: "Escalate" }).click();
await p.waitForTimeout(600);
const panel = p.locator(".fg-panel");
await panel.locator(".fg-tab", { hasText: /^Form/ }).click();
await p.waitForTimeout(600);
await panel.locator(".rs-item", { has: p.locator(".rs-item-label", { hasText: /^Staff/ }) }).click();
await p.waitForTimeout(400);
const filter = row(panel, "Filter");
ok((await filter.count()) === 1, "a map lookup shows Filter (Data > Lookup)");
const box = filter.locator("input, textarea").first();
ok((await box.inputValue()).includes("user_group-344907c9"), "with the stored filter: " + (await box.inputValue()));
await box.fill("`user`.`status` = 'active'");
await box.blur();
await p.waitForTimeout(1200);
const field = await p.evaluate(() => window.__defs.wf_tickets.actions[0].form.fields.find((f) => f.key === "staff"));
ok(field.lookup_filter === "`user`.`status` = 'active'", "a change is saved where Saturn keeps it (lookup_filter)");
await p.screenshot({ path: `${out}/v0364-filter.png` });

ok(errs.length === 0, "no page errors: " + errs.join(" | "));
await b.close();
