// v0.3.39: Workflow settings lists every resource the workflow is linked to (runs on it, or its hooks run the
// workflow's actions) as green buttons that open the resource on the Resources screen. The names in Hooks open it too.
import { chromium } from "playwright";
const out = process.env.SHOTS ?? "shots";
const b = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs = [];
p.on("pageerror", (e) => errs.push("pageerror: " + e.message));
p.on("console", (m) => /Content Security|Refused/.test(m.text()) && errs.push("CSP: " + m.text()));
const ok = (c, msg) => console.log((c ? "PASS " : "FAIL ") + msg);
const opened = () => p.evaluate(() => (window.__opened || []).filter((o) => o.type === "openResourceScreen").map((o) => o.resource));

await p.goto("http://localhost:8765/csp.html");
await p.waitForTimeout(900);
await p.locator(".nv-picker-item", { hasText: "Order fulfilment" }).first().click();
await p.waitForTimeout(900);
await p.locator(".nv-ol-workflow").click();
await p.waitForTimeout(700);

const section = p.locator(".fg-panel [data-sec='wf-linked'], .fg-panel #wf-linked").first();
const buttons = p.locator(".fg-panel .fg-linked-btn");
ok((await buttons.count()) === 2, "both linked resources are listed: " + (await buttons.locator("b").allInnerTexts()).join());
ok((await buttons.locator("b").allInnerTexts()).join() === "invoices,orders", "by name");
ok((await buttons.filter({ hasText: "orders" }).locator("small").innerText()).includes("runs on this workflow (on status)"), "orders runs on this workflow, on its status");
ok((await buttons.filter({ hasText: "invoices" }).locator("small").innerText()) === "1 hook", "invoices only runs one of its actions from a hook");
const linkedTop = await buttons.first().boundingBox();
const triggersHead = await p.locator(".fg-panel", { hasText: "Triggers" }).locator("text=Triggers").first().boundingBox();
ok(linkedTop && triggersHead && linkedTop.y < triggersHead.y, "the section is near the top, open, above Triggers");
await p.screenshot({ path: out + "/r1-linked-resources.png" });

await buttons.filter({ hasText: "orders" }).click();
await p.waitForTimeout(200);
ok((await opened()).join() === "orders", "clicking one opens it on the Resources screen");

// the names in Hooks open it too
await p.locator(".fg-panel .fg-sec-head, .fg-panel button", { hasText: /^Hooks$/ }).first().click();
await p.waitForTimeout(300);
await p.locator(".fg-panel .fg-resource-name", { hasText: "invoices" }).click();
await p.waitForTimeout(200);
ok((await opened()).join() === "orders,invoices", "a resource's name in Hooks opens it too");
ok((await p.locator(".nv-busy").count()) === 0, "nothing stuck on Applying…");

ok(errs.length === 0, "no page errors (" + errs.join(" | ") + ")");
await b.close();
