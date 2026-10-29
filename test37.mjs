// v0.3.49 on the Resources screen: the breadcrumb on its own row (each step clickable, back to the property you
// were on), Open raw JSON in Resource settings, folding the properties list away, and a narrow settings area
// showing only the settings search.
import { chromium } from "playwright";
const out = process.env.SHOTS ?? "shots";
const b = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs = [];
p.on("pageerror", (e) => errs.push("pageerror: " + e.message));
const ok = (c, msg) => console.log((c ? "PASS " : "FAIL ") + msg);

await p.goto("http://localhost:8765/resources.html");
await p.waitForTimeout(400);
await p.locator(".rs-picker-btn").click(); await p.locator(`.rs-picker-item[data-resource=${JSON.stringify("Loan")}]`).click();
await p.waitForTimeout(300);
await p.locator(".rs-item", { hasText: "Category" }).first().click();
await p.waitForTimeout(200);

// ===== breadcrumb row =====
const bar = p.locator(".rs-crumbbar");
ok((await bar.boundingBox()).y > (await p.locator(".rs-top").boundingBox()).y, "the breadcrumb is its own row, under the top bar");
ok((await bar.innerText()).replace(/\s+/g, " ").includes("Loan › Category"), "it names the resource and the property: " + (await bar.innerText()).replace(/\s+/g, " "));
await p.locator(".rs-item", { hasText: "Category" }).first().locator(".rs-chip").click();
await p.waitForTimeout(300);
ok((await bar.innerText()).replace(/\s+/g, " ").includes("Loan › category › LoanCategory"), "after a chip: where you came from, then here: " + (await bar.innerText()).replace(/\s+/g, " "));
await bar.locator(".rs-crumb-btn", { hasText: "Loan" }).click();
await p.waitForTimeout(300);
ok((await p.locator(".rs-picker-btn").getAttribute("data-value")) === "Loan" && (await p.locator(".rs-item.is-selected").innerText()).includes("Category"), "clicking it goes back, to the property you were on");
await p.screenshot({ path: out + "/r1-crumbs.png", clip: { x: 0, y: 0, width: 1440, height: 120 } });

// ===== raw JSON =====
await p.locator(".rs-picker-btn").click(); await p.locator(`.rs-picker-item[data-resource=${JSON.stringify("Application")}]`).click();
await p.waitForTimeout(300);
await p.locator(".rs-top").getByRole("button", { name: "Resource settings" }).click();
await p.waitForTimeout(300);
await p.locator("#rs-set-description").fill("Changed here");
await p.getByRole("button", { name: "Open raw JSON" }).click();
await p.waitForTimeout(100);
const raw = await p.evaluate(() => (window.__opened || []).filter((o) => o.type === "viewRaw").at(-1));
const parsed = raw && JSON.parse(raw.text);
ok(parsed && parsed.id === "resourcedetail-71501093" && parsed.description === "Changed here" && Array.isArray(parsed.sections), "Open raw JSON opens the settings record, with the unsaved change in it");
await p.locator(".rs-top").getByRole("button", { name: "Discard" }).click();

// ===== folding the properties list =====
await p.locator(".rs-fold").click();
await p.waitForTimeout(150);
ok(!(await p.locator(".rs-side").isVisible()) && (await p.locator(".rs-side-open").isVisible()), "« folds the properties list away, leaving a strip");
await p.locator(".rs-side-open").click();
await p.waitForTimeout(150);
ok(await p.locator(".rs-side").isVisible(), "» brings it back");

// ===== narrow =====
await p.locator(".rs-top").getByRole("button", { name: "Resource settings" }).click();
await p.locator(".rs-item", { hasText: "Status" }).first().click();
await p.waitForTimeout(200);
ok(await p.locator(".pe-menu-item").first().isVisible(), "wide: the settings menu shows its groups");
await p.setViewportSize({ width: 900, height: 800 });
await p.waitForTimeout(300);
ok((await p.locator(".pe-find").isVisible()) && !(await p.locator(".pe-menu-item").first().isVisible()), "narrow: only the settings search shows");
await p.screenshot({ path: out + "/r2-narrow.png" });

ok(!errs.length, "no page errors " + JSON.stringify(errs));
await b.close();
