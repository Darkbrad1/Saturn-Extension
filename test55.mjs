// v0.3.67: a Create step's card is named after the resource it creates; the Form / Parameters tab can be resized
// (two thirds of the window at first, kept when dragged, double-click puts it back).
import { chromium } from "playwright";
const out = process.env.SHOTS ?? "shots";
const b = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
const errs = [];
p.on("pageerror", (e) => errs.push("pageerror: " + e.message));
const ok = (c, msg) => console.log((c ? "PASS " : "FAIL ") + msg);

// ===== a Create step's card =====
await p.goto("http://localhost:8765/csp.html?app");
await p.waitForTimeout(1000);
await p.locator(".nv-picker-item", { hasText: "Application" }).click();
await p.waitForTimeout(900);
await p.locator(".nv-ol-item", { hasText: "Request documents" }).last().click();
await p.waitForTimeout(900);
const titles = await p.locator(".react-flow__node .nv-node-title").allInnerTexts();
ok(titles.includes("DocumentRequest"), "the Create step's card is titled with its resource: " + titles.join(", "));
ok(!titles.includes("Create"), "and no longer just Create");
const card = p.locator(".react-flow__node", { has: p.locator(".nv-node-title", { hasText: /^DocumentRequest$/ }) }).first();
ok((await card.locator(".nv-node-sub").innerText()) === "Records", "the category stays on the right");
await card.screenshot({ path: `${out}/v0367-create-card.png` });

// ===== the Form tab resizes =====
await p.goto("http://localhost:8765/csp.html");
await p.waitForTimeout(900);
await p.locator(".nv-picker-item", { hasText: "Support tickets" }).click();
await p.waitForTimeout(900);
await p.locator(".nv-ol-item", { hasText: "Escalate" }).click();
await p.waitForTimeout(600);
const panel = p.locator(".fg-panel");
const narrow = (await panel.boundingBox()).width;
await panel.locator(".fg-tab", { hasText: /^Form/ }).click();
await p.waitForTimeout(500);
const start = (await panel.boundingBox()).width;
ok(Math.abs(start - 1440 * 0.66) < 4, "the Form tab starts at two thirds of the window: " + Math.round(start));
const handle = panel.locator(".fg-resize");
ok((await handle.count()) === 1, "it has a resize handle");
const hb = await handle.boundingBox();
await p.mouse.move(hb.x + hb.width / 2, hb.y + 200);
await p.mouse.down();
await p.mouse.move(hb.x + 300, hb.y + 200, { steps: 8 });
await p.mouse.up();
await p.waitForTimeout(300);
const smaller = (await panel.boundingBox()).width;
ok(Math.abs(smaller - (start - 300 + hb.width / 2)) < 12, `dragging it right makes it narrower (${Math.round(start)} -> ${Math.round(smaller)})`);
await p.screenshot({ path: `${out}/v0367-form-resized.png` });
await panel.locator(".fg-tab", { hasText: /^Design/ }).click();
await p.waitForTimeout(300);
ok(Math.abs((await panel.boundingBox()).width - narrow) < 2, "the other tabs keep their own width");
await panel.locator(".fg-tab", { hasText: /^Form/ }).click();
await p.waitForTimeout(300);
ok(Math.abs((await panel.boundingBox()).width - smaller) < 2, "back on Form, the dragged width is kept");
await handle.dblclick();
await p.waitForTimeout(300);
ok(Math.abs((await panel.boundingBox()).width - start) < 4, "double-click puts it back to two thirds");

ok(errs.length === 0, "no page errors: " + errs.join(" | "));
await b.close();
