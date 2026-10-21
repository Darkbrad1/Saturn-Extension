// v0.3.40: wherever a resource is named, it links back to it on the Resources screen: a Menus screen tab's
// resource (one tab or several sharing it) and a step's resource setting in the node view.
import { chromium } from "playwright";
const out = process.env.SHOTS ?? "shots";
const b = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs = [];
p.on("pageerror", (e) => errs.push("pageerror: " + e.message));
p.on("console", (m) => /Content Security|Refused/.test(m.text()) && errs.push("CSP: " + m.text()));
const ok = (c, msg) => console.log((c ? "PASS " : "FAIL ") + msg);

// ===== Menus screen =====
await p.goto("http://localhost:8765/menus.html");
await p.waitForTimeout(700);
const tab = (label) => p.locator(".mn-tab", { has: p.locator(".rs-item-label", { hasText: new RegExp(`^${label}\\d*$`) }) });
const asked = () => p.evaluate(() => window.__posted.filter((m) => m.type === "openResourceScreen").map((m) => m.resource));
await tab("Applications").click();
await p.waitForTimeout(200);
const chip = p.locator(".mn-detail .rs-chip", { hasText: "Application" });
ok((await chip.count()) === 1 && (await chip.innerText()).startsWith("Application"), "a tab's resource has a chip beside it");
await chip.click();
await p.waitForTimeout(100);
ok((await asked()).join() === "Application", "the chip opens that resource on the Resources screen");
await p.locator(".mn-detail #mn-resource").selectOption("Loan");
await p.waitForTimeout(150);
ok((await p.locator(".mn-detail .rs-chip", { hasText: "Loan" }).count()) === 1, "it follows the resource picked");
await p.screenshot({ path: out + "/l1-menu-tab-resource.png" });
// several tabs sharing one resource
await tab("Approved").click();
await tab("Rejected").click({ modifiers: ["Control"] });
await p.waitForTimeout(200);
ok((await p.locator(".mn-detail .rs-chip", { hasText: "Application" }).count()) === 1, "several tabs on one resource show its chip too");
await tab("Loans").click({ modifiers: ["Control"] });
await p.waitForTimeout(200);
ok((await p.locator(".mn-detail .pe-ref .rs-chip").count()) === 0, "no chip when they open different resources");

// ===== node view: a step's resource setting =====
await p.goto("http://localhost:8765/csp.html");
await p.waitForTimeout(900);
await p.locator(".nv-picker-item", { hasText: "Support tickets" }).click();
await p.waitForTimeout(900);
await p.locator(".react-flow__node", { hasText: "Sync Resource" }).first().click();
await p.waitForTimeout(500);
const open = p.locator(".fg-panel .nv-res-open");
ok((await open.count()) === 1 && (await open.innerText()).startsWith("customers"), "a step's resource has a chip beside its picker");
await open.click();
await p.waitForTimeout(100);
const opened = await p.evaluate(() => (window.__opened || []).filter((o) => o.type === "openResourceScreen").map((o) => o.resource));
ok(opened.join() === "customers", "it opens that resource on the Resources screen");
ok((await p.locator(".nv-busy").count()) === 0, "nothing stuck on Applying…");
await p.locator(".fg-panel").screenshot({ path: out + "/l2-step-resource.png" });

ok(errs.length === 0, "no page errors (" + errs.join(" | ") + ")");
await b.close();
