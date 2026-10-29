// v0.3.29: "Open in Saturn" on the Resources screen (the resource's page) and in the node view (the workflow's page).
import { chromium } from "playwright";
const out = process.env.SHOTS ?? "shots";
const b = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs = [];
p.on("pageerror", (e) => errs.push("pageerror: " + e.message));
const ok = (c, msg) => console.log((c ? "PASS " : "FAIL ") + msg);

// ===== Resources =====
await p.goto("http://localhost:8765/resources.html");
await p.waitForTimeout(400);
const resBtn = p.getByRole("button", { name: "Open in Saturn ↗" });
ok((await resBtn.count()) === 0, "no button before a resource is picked");
await p.locator(".rs-picker-btn").click(); await p.locator(`.rs-picker-item[data-resource=${JSON.stringify("Application")}]`).click();
await p.waitForTimeout(300);
await resBtn.click();
await p.waitForTimeout(100);
ok(await p.evaluate(() => window.__posted.some((m) => m.type === "openInSaturn" && m.payload.resource === "Application")), "the Resources screen asks to open the picked resource in Saturn");
await p.screenshot({ path: out + "/o1-resources.png" });

// ===== Node view =====
await p.goto("http://localhost:8765/csp.html");
await p.waitForTimeout(900);
await p.locator(".nv-picker-item", { hasText: "Order fulfilment" }).click();
await p.waitForTimeout(900);
await p.getByRole("button", { name: "Open in Saturn ↗" }).click();
await p.waitForTimeout(100);
ok(await p.evaluate(() => window.__mockLog.includes("openWorkflow")), "the node view asks to open the workflow in Saturn");
await p.screenshot({ path: out + "/o2-nodeview.png" });

ok(errs.length === 0, "no page errors (" + errs.join(" | ") + ")");
await b.close();
