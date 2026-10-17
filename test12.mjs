// v0.3.6: the property map editor (e.g. Resource Property Updater) with no properties.
// v0.3.7: the node view says when the instance is back online.
import { chromium } from "playwright";
const out = process.env.SHOTS ?? "shots";
const b = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs = [];
p.on("pageerror", (e) => errs.push("pageerror: " + e.message));
p.on("console", (m) => /Content Security|Refused/.test(m.text()) && errs.push("CSP: " + m.text()));
const ok = (c, msg) => console.log((c ? "PASS " : "FAIL ") + msg);
const panel = p.locator(".fg-panel");
const step = async () => (await p.evaluate(() => window.__getDef("wf_tickets"))).stages[0].actions[0].task.commands[0];

await p.goto("http://localhost:8765/csp.html");
await p.waitForTimeout(900);
await p.locator(".nv-picker-item", { hasText: "Support tickets" }).click();
await p.waitForTimeout(900);
await p.locator(".nv-ol-item", { hasText: "Triage" }).click();
await p.waitForTimeout(600);
await p.locator(".react-flow__node", { hasText: "Property Updater" }).first().click();
await p.waitForTimeout(500);
ok(await panel.locator(".nv-kv-item").count() === 2, "the map shows its two properties");

// a step saved with an empty map ({}), as a new Property Updater is
const saved = await p.evaluate(() => { const c = window.__defs.wf_tickets.stages[0].actions[0].task.commands[0]; const was = c.data.properties; c.data.properties = {}; return was; });
await p.locator(".react-flow__pane").click({ position: { x: 300, y: 600 } });
await p.waitForTimeout(200);
await p.locator(".react-flow__node", { hasText: "Property Updater" }).first().click();
await p.waitForTimeout(500);
ok(await panel.getByPlaceholder("Resource Property").count() === 1 && await panel.locator(".nv-field", { hasText: "Properties" }).locator("textarea").count() === 0, "a step saved with {} shows the property inputs, not a raw {} box");
await p.evaluate((was) => { window.__defs.wf_tickets.stages[0].actions[0].task.commands[0].data.properties = was; }, saved);
await p.locator(".react-flow__pane").click({ position: { x: 300, y: 600 } });
await p.waitForTimeout(200);
await p.locator(".react-flow__node", { hasText: "Property Updater" }).first().click();
await p.waitForTimeout(500);

// remove them all, the last one included
await panel.locator(".nv-kv-item", { hasText: "queue" }).locator(".nv-kv-x").click();
await p.waitForTimeout(500);
await panel.locator(".nv-kv-item", { hasText: "priority" }).locator(".nv-kv-x").click();
await p.waitForTimeout(500);
let s = await step();
ok(JSON.stringify(s.data.properties) === "{}", "removing the last property empties the map: " + JSON.stringify(s.data.properties));
ok(await panel.locator(".nv-kv-item").count() === 0, "and no rows are left");

// an empty map still shows the property/value inputs, not raw JSON
await p.locator(".react-flow__pane").click({ position: { x: 300, y: 600 } });
await p.waitForTimeout(200);
await p.locator(".react-flow__node", { hasText: "Property Updater" }).first().click();
await p.waitForTimeout(500);
ok(await panel.getByPlaceholder("Resource Property").count() === 1 && await panel.getByPlaceholder("Property Value").count() === 1, "an empty map ({}) shows the Resource Property / Property Value inputs");
ok(await panel.locator(".nv-field", { hasText: "Properties" }).locator("textarea").count() === 0, "not a raw JSON box");
await p.screenshot({ path: out + "/m1-empty-map.png" });

// and it can be filled again
await panel.getByPlaceholder("Resource Property").fill("received_at");
await panel.getByPlaceholder("Property Value").fill("{{ _resource.date_uploaded }}");
await panel.getByPlaceholder("Property Value").press("Enter");
await p.waitForTimeout(500);
s = await step();
ok(s.data.properties.received_at === "{{ _resource.date_uploaded }}", "adding to an empty map works");

// v0.3.10: what you typed is applied when you're done, without Enter / ＋
const section = (name) => panel.locator(".fg-section-title", { hasText: name });
await panel.getByPlaceholder("Resource Property").fill("owner");
await panel.getByPlaceholder("Property Value").fill("{{ _user.id }}");
await section("Parameters").click(); // collapse it: the editor goes away
await p.waitForTimeout(500);
s = await step();
ok(s.data.properties.owner === "{{ _user.id }}", "a property typed in but not added with Enter / ＋ is added when the section is collapsed");
await section("Parameters").click();
await p.waitForTimeout(500);
ok(await panel.locator(".nv-kv-item", { hasText: "owner" }).count() === 1, "and is still there when it's opened again");
await panel.getByPlaceholder("Resource Property").fill("queue");
await panel.getByPlaceholder("Property Value").fill("tier2");
await panel.locator(".fg-head-title").click(); // click elsewhere in the panel
await p.waitForTimeout(500);
ok((await step()).data.properties.queue === "tier2", "or when you click away from the editor");
await panel.getByPlaceholder("Property Value").fill("orphan");
await p.waitForTimeout(100);
ok((await panel.locator(".nv-field-caption.is-warn", { hasText: "Give the property a name" }).count()) === 1, "a value without a name says it needs one");
await panel.getByPlaceholder("Property Value").fill("");

// any field: an edit not yet applied is applied when the editor goes away (no blur first)
const rid = panel.locator(".nv-field", { hasText: "Record id" }).locator("input").first();
await rid.fill("rec-42");
await p.evaluate(() => [...document.querySelectorAll(".fg-panel .fg-section-title")].find((b) => b.textContent.includes("Parameters")).click());
await p.waitForTimeout(500);
ok((await step()).data.resource_id === "rec-42", "a typed value is applied when the editor closes while it still has focus");
await section("Parameters").click();
await p.waitForTimeout(400);

// a change the host refuses is reported even when the editor has gone
await p.locator(".nv-wf-switch").click();
await p.waitForTimeout(300);
await p.locator(".nv-picker-item, .nv-wf-item, [role=option]", { hasText: "Order fulfilment" }).first().click();
await p.waitForTimeout(1200);
await p.locator(".nv-ol-item", { hasText: "Approve order" }).click();
await p.waitForTimeout(600);
await p.locator(".react-flow__node", { hasText: "Send Email" }).first().click();
await p.waitForTimeout(500);
await panel.getByRole("tab", { name: "Design", exact: true }).click();
await p.waitForTimeout(300);
const to = panel.locator(".nv-field", { hasText: "To" }).locator("input").first();
await to.fill("");
await section("Parameters").click();
await p.waitForTimeout(500);
ok((await p.locator(".nv-toast.is-error").allInnerTexts()).some((t) => /Not applied: To is required/.test(t)), "a refused change shows a toast, not only next to the (now closed) fields");
await section("Parameters").click();

// back online after working offline: the node view says so (it used to stay silent)
await p.evaluate(() => window.__post("connectionRestored", { synced: "Offline work applied to the instance: 1 workflow." }));
await p.waitForTimeout(200);
ok((await p.locator(".nv-toast, [class*=toast]").allInnerTexts()).some((t) => t.includes("Offline work applied to the instance: 1 workflow.")), "reconnecting shows what offline work was applied");
await p.evaluate(() => window.__post("connectionRestored", { synced: "" }));
await p.waitForTimeout(200);
ok((await p.locator(".nv-toast, [class*=toast]").allInnerTexts()).some((t) => t.includes("Back online")), "or just that it's back online");

ok(errs.length === 0, "no page errors or CSP violations" + (errs.length ? ": " + errs.join(" | ") : ""));
await b.close();
