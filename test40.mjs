// v0.3.52: T hides and shows the node view's layers panel and the Resources screen's properties list (not while
// typing in a box).
import { chromium } from "playwright";
const b = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs = [];
p.on("pageerror", (e) => errs.push("pageerror: " + e.message));
const ok = (c, msg) => console.log((c ? "PASS " : "FAIL ") + msg);

// ===== node view =====
await p.goto("http://localhost:8765/csp.html?app");
await p.waitForTimeout(1000);
await p.locator(".nv-picker-item", { hasText: "Application" }).click();
await p.waitForTimeout(900);
await p.locator(".nv-ol-item", { hasText: "Submit" }).first().click();
await p.waitForTimeout(500);
await p.locator(".react-flow__pane").click({ position: { x: 30, y: 30 } });
await p.keyboard.press("t");
await p.waitForTimeout(200);
ok((await p.locator(".nv-outliner").count()) === 0, "T hides the layers panel");
await p.keyboard.press("t");
await p.waitForTimeout(200);
ok((await p.locator(".nv-outliner").count()) === 1, "T again shows it");
await p.locator(".nv-ol-search input, .nv-outliner input").first().click();
await p.keyboard.type("t");
await p.waitForTimeout(200);
ok((await p.locator(".nv-outliner").count()) === 1, "typing a t in a box doesn't hide it");

// ===== Resources =====
await p.goto("http://localhost:8765/resources.html");
await p.waitForTimeout(400);
await p.selectOption(".rs-select select", "Application");
await p.waitForTimeout(300);
await p.locator(".rs-item", { hasText: "Status" }).first().click();
await p.keyboard.press("t");
await p.waitForTimeout(150);
ok(!(await p.locator(".rs-side").isVisible()), "T hides the properties list");
await p.keyboard.press("t");
await p.waitForTimeout(150);
ok(await p.locator(".rs-side").isVisible(), "T again shows it");
await p.locator(".rs-search").fill("t");
await p.waitForTimeout(150);
ok(await p.locator(".rs-side").isVisible(), "typing a t in the search doesn't hide it");
ok(!errs.length, "no page errors " + JSON.stringify(errs));
await b.close();
