// v0.3.6: the property map editor (e.g. Resource Property Updater) with no properties.
// v0.3.7: the node view says when the instance is back online.
import { chromium } from "playwright";
const out = process.env.SHOTS ?? "/tmp/claude-0/-home-claude/a083e21d-6637-5cac-92a5-bbf1f2d008b9/scratchpad/shots";
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

// back online after working offline: the node view says so (it used to stay silent)
await p.evaluate(() => window.__post("connectionRestored", { synced: "Offline work applied to the instance: 1 workflow." }));
await p.waitForTimeout(200);
ok((await p.locator(".nv-toast, [class*=toast]").allInnerTexts()).some((t) => t.includes("Offline work applied to the instance: 1 workflow.")), "reconnecting shows what offline work was applied");
await p.evaluate(() => window.__post("connectionRestored", { synced: "" }));
await p.waitForTimeout(200);
ok((await p.locator(".nv-toast, [class*=toast]").allInnerTexts()).some((t) => t.includes("Back online")), "or just that it's back online");

ok(errs.length === 0, "no page errors or CSP violations" + (errs.length ? ": " + errs.join(" | ") : ""));
await b.close();
