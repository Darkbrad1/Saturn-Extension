// v0.3.69: cards on the canvas can be moved and resized by hand. A card let go away from a wire stays where it was
// put, a picked card's right edge makes it wider or narrower, both are kept (per workflow, tree and direction, on this
// computer) after reopening, and Reset layout puts every card back. Dropping a card on a wire still moves the step.
import { chromium } from "playwright";
const out = process.env.SHOTS ?? "shots";
const b = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const p = await b.newPage({ viewport: { width: 1500, height: 950 } });
const errs = [];
p.on("pageerror", (e) => errs.push("pageerror: " + e.message));
const ok = (c, msg) => console.log((c ? "PASS " : "FAIL ") + msg);
const open = async () => {
  await p.locator(".nv-picker-item", { hasText: "Order fulfilment" }).click();
  await p.waitForTimeout(800);
  await p.locator(".nv-ol-item", { hasText: "Approve order" }).click();
  await p.waitForTimeout(900);
};
const card = () => p.locator(".react-flow__node", { has: p.locator(".nv-node-title", { hasText: /^Send Email$/ }) }).first();
const box = async () => card().boundingBox();

await p.goto("http://localhost:8765/csp.html");
await p.evaluate(() => localStorage.removeItem("__mapLayouts"));
await p.goto("http://localhost:8765/csp.html");
await p.waitForTimeout(900);
await open();
ok((await p.locator(".nv-reset-layout").count()) === 0, "no Reset layout button while nothing has been moved");
const before = await box();
const first = () => p.locator(".react-flow__node", { has: p.locator(".nv-node-title", { hasText: /^Approve order$/ }) }).first();
const rel = async () => (await box()).x - (await first().boundingBox()).x;
const relBefore = await rel();
await p.screenshot({ path: `${out}/v0369-cards-before.png` });

// ===== move a card into empty space =====
const head = card().locator(".nv-node-header");
const hb = await head.boundingBox();
await p.mouse.move(hb.x + 30, hb.y + hb.height / 2);
await p.mouse.down();
await p.mouse.move(hb.x - 230, hb.y + hb.height / 2 - 30, { steps: 14 });
await p.mouse.up();
await p.waitForTimeout(500);
let now = await box();
ok(before.x - now.x > 120, `a card let go away from a wire stays where it was put (moved ${Math.round(before.x - now.x)} px)`);
ok((await p.locator(".nv-reset-layout").count()) === 1, "Reset layout shows once something has been moved");

// ===== resize it =====
await card().click();
await p.waitForTimeout(300);
const edge = card().locator(".nv-resize-edge");
ok((await edge.count()) === 1, "a picked card has a handle on its right edge");
const eb = await edge.boundingBox();
const w0 = now.width;
await p.mouse.move(eb.x + eb.width / 2, eb.y + eb.height / 2);
await p.mouse.down();
await p.mouse.move(eb.x + eb.width / 2 + 160, eb.y + eb.height / 2, { steps: 10 });
await p.mouse.up();
await p.waitForTimeout(500);
now = await box();
ok(now.width - w0 > 120, `dragging it makes the card wider (${Math.round(w0)} -> ${Math.round(now.width)})`);
await p.screenshot({ path: `${out}/v0369-cards-moved.png` });

// ===== kept after reopening =====
const kept = now;
await p.goto("http://localhost:8765/csp.html");
await p.waitForTimeout(900);
await open();
now = await box();
const zoomish = (a, b) => Math.abs(a - b) < 4;
ok(zoomish(now.width, kept.width), `the width is kept after reopening (${Math.round(now.width)})`);
const offset = await rel();
ok(relBefore - offset > 100, `and so is where it was put (${Math.round(relBefore - offset)} px further left than before)`);
const other = await p.evaluate(() => Object.keys(JSON.parse(localStorage.getItem("__mapLayouts") || "{}")));
ok(other.length === 1 && /^wf_orders::.+::v$/.test(other[0]), "kept per workflow, tree and direction: " + other.join(", "));

// ===== reset =====
await p.locator(".nv-reset-layout").click();
await p.waitForTimeout(500);
now = await box();
ok(zoomish(now.width, before.width) && (await p.locator(".nv-reset-layout").count()) === 0, "Reset layout puts the card back at its normal width, and the button goes");
ok(Math.abs((await rel()) - relBefore) < 6, "and back where the layout places it");

ok(errs.length === 0, "no page errors: " + errs.join(" | "));
await b.close();
