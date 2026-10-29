// v0.3.65: Operators JSON in the node view's top bar, right after Workflow JSON: it asks the host for Saturn's
// operator list (viewOperatorsJson), which opens it in a tab beside.
import { chromium } from "playwright";
const out = process.env.SHOTS ?? "shots";
const b = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs = [];
p.on("pageerror", (e) => errs.push("pageerror: " + e.message));
const ok = (c, msg) => console.log((c ? "PASS " : "FAIL ") + msg);

await p.goto("http://localhost:8765/csp.html");
await p.waitForTimeout(900);
await p.locator(".nv-picker-item").first().click();
await p.waitForTimeout(900);
const bar = p.locator(".nv-topbar");
const names = (await bar.locator("button").allInnerTexts()).map((t) => t.trim());
const at = names.indexOf("Operators JSON");
ok(at > 0 && names[at - 1] === "Workflow JSON", "Operators JSON sits right after Workflow JSON: " + names.join(" | "));
const btn = bar.getByRole("button", { name: "Operators JSON" });
ok((await btn.getAttribute("title")).includes("Every operator"), "its tooltip says what it shows");
await btn.click();
await p.waitForTimeout(200);
ok((await p.evaluate(() => (window.__opened || []).some((o) => o.type === "viewOperatorsJson"))), "a click asks the host for the operator list");
const box = await bar.boundingBox();
const last = await bar.locator("button").last().boundingBox();
ok(last.x + last.width <= box.x + box.width + 1, "the top bar still fits at 1440 px wide");
await p.screenshot({ path: `${out}/v0365-topbar.png`, clip: { x: 0, y: 0, width: 1440, height: 80 } });
ok(errs.length === 0, "no page errors: " + errs.join(" | "));
await b.close();
