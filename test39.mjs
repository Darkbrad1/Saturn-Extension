// v0.3.51: the Resources screen's Schema JSON button opens the whole schema (every property, in order) as JSON,
// with the unsaved changes in it.
import { chromium } from "playwright";
const b = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs = [];
p.on("pageerror", (e) => errs.push("pageerror: " + e.message));
const ok = (c, msg) => console.log((c ? "PASS " : "FAIL ") + msg);
const opened = async () => { const o = await p.evaluate(() => (window.__opened || []).filter((x) => x.type === "viewRaw").at(-1)); return o && { title: o.title, schema: JSON.parse(o.text) }; };

await p.goto("http://localhost:8765/resources.html");
await p.waitForTimeout(400);
await p.selectOption(".rs-select select", "Application");
await p.waitForTimeout(300);
const btn = p.locator(".rs-top").getByRole("button", { name: "Schema JSON" });
ok((await btn.count()) === 1, "a Schema JSON button in the top bar");
await btn.click();
await p.waitForTimeout(100);
let o = await opened();
const stored = await p.evaluate(() => JSON.parse(JSON.stringify(window.__data.Application)));
ok(o.title === "Application schema" && JSON.stringify(o.schema) === JSON.stringify(stored), "it opens the whole schema, as the instance has it");

// with changes: a new label, a deleted property, a new one
await p.locator(".rs-item", { hasText: "Status" }).first().click();
await p.waitForTimeout(200);
const label = p.locator(".pe-page .pe-row", { has: p.locator(".pe-label", { hasText: /^Label$/ }) }).locator("input");
await label.fill("State");
await label.press("Enter");
await p.locator(".rs-item", { hasText: "Submitted At" }).first().click({ button: "right" });
await p.locator(".rs-menu").getByRole("menuitem", { name: /^Delete/ }).click();
await btn.click();
await p.waitForTimeout(100);
o = await opened();
ok(o.schema[0].label === "State" && !o.schema.some((x) => x.key === "submitted_at") && o.schema.length === stored.length - 1, "it has the unsaved changes in it (a new label, a deleted property left out)");
ok(!errs.length, "no page errors " + JSON.stringify(errs));
await b.close();
