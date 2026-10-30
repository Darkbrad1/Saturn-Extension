// v0.3.73: a Read step's query is highlighted (the text box, the value boxes and the card); the mouse's back button
// goes back along the breadcrumb (and the Resources screen's trail); a picked card can be resized from either edge,
// Shift for both evenly; clicking the command's (or action's) name at the top of the canvas shows its settings; a
// log value's Copy says it copied, and Open as JSON sits beside it; the System Logs record pane can be resized.
import { chromium } from "playwright";
const out = process.env.SHOTS ?? "shots";
const b = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium" });
const p = await b.newPage({ viewport: { width: 1500, height: 1000 } });
const errs = [];
p.on("pageerror", (e) => errs.push("pageerror: " + e.message));
p.on("console", (m) => /Content Security|Refused/.test(m.text()) && errs.push("CSP: " + m.text()));
const ok = (c, msg) => console.log((c ? "PASS " : "FAIL ") + msg);
const panel = p.locator(".fg-panel");
const field = (label) => panel.locator(".nv-field", { has: p.locator(".nv-field-name", { hasText: new RegExp(`^${label}$`) }) });
const mouseBack = () =>
  p.evaluate(() => {
    for (const type of ["mousedown", "mouseup"]) document.body.dispatchEvent(new MouseEvent(type, { button: 3, bubbles: true, cancelable: true }));
  });

// ===== the query, highlighted =====
await p.goto("http://localhost:8765/csp.html");
await p.waitForTimeout(1000);
await p.locator(".nv-card", { hasText: "Debug lab" }).click();
await p.waitForTimeout(800);
await p.locator(".nv-ol-item", { hasText: /^Close/ }).first().click();
await p.waitForTimeout(700);
const readCard = p.locator(".react-flow__node", { has: p.locator(".nv-node-title", { hasText: /^Read$/ }) });
ok((await readCard.locator(".nv-row", { hasText: "Query" }).locator(".token.identifier").count()) > 0, "the Read card's query is highlighted");
await readCard.click();
await p.waitForTimeout(800);
const q = field("Query");
await q.getByLabel("Value").first().fill("{{ _form.staff }}");
await p.waitForTimeout(200);
ok((await q.locator(".nv-query-row .nv-hl .token.template").count()) > 0, "a condition's value box highlights a {{ template }}");
await q.locator(".nv-query-row").first().screenshot({ path: `${out}/v0373-query-value.png` });
await q.getByLabel("Value").first().press("Enter");
await p.waitForTimeout(400);
await q.getByRole("button", { name: "Edit as text" }).click();
const qt = q.locator("textarea");
await qt.fill("`user`.`group` = 'user_group-2131' AND IFMISSINGORNULL(`user`.`deleted`, false) != true AND lower(IFMISSINGORNULL(`user`.`status`, 'active')) = 'active'");
await p.waitForTimeout(200);
const pre = q.locator(".nv-hl-pre");
const kinds = await pre.locator(".token").evaluateAll((els) => [...new Set(els.map((e) => e.className.replace("token ", "")))]);
ok(["identifier", "string", "keyword", "function", "boolean"].every((k) => kinds.includes(k)), "the query as text is highlighted: " + kinds.join(", "));
await qt.blur();
await p.waitForTimeout(400);
await q.screenshot({ path: `${out}/v0373-query-text.png` });
const sortBox = field("Sort");
await sortBox.getByRole("button", { name: "Edit as text" }).click();
await p.waitForTimeout(200);
ok((await sortBox.locator(".nv-hl .token.identifier").count()) > 0, "Sort as text is highlighted too");

// ===== resize a card from either edge =====
await p.goto("http://localhost:8765/csp.html");
await p.evaluate(() => localStorage.removeItem("__mapLayouts"));
await p.goto("http://localhost:8765/csp.html");
await p.waitForTimeout(900);
await p.locator(".nv-picker-item, .nv-card", { hasText: "Order fulfilment" }).first().click();
await p.waitForTimeout(800);
await p.locator(".nv-ol-item", { hasText: "Approve order" }).click();
await p.waitForTimeout(900);
const card = () => p.locator(".react-flow__node", { has: p.locator(".nv-node-title", { hasText: /^Send Email$/ }) }).first();
await card().click();
await p.waitForTimeout(300);
ok((await card().locator(".nv-resize-edge.is-left").count()) === 1 && (await card().locator(".nv-resize-edge.is-right").count()) === 1, "a picked card has a handle on each edge");
const drag = async (side, dx, shift = false) => {
  const eb = await card().locator(`.nv-resize-edge.is-${side}`).boundingBox();
  await p.mouse.move(eb.x + eb.width / 2, eb.y + eb.height / 2);
  if (shift) await p.keyboard.down("Shift");
  await p.mouse.down();
  await p.mouse.move(eb.x + eb.width / 2 + dx, eb.y + eb.height / 2, { steps: 10 });
  await p.mouse.up();
  if (shift) await p.keyboard.up("Shift");
  await p.waitForTimeout(500);
};
let b0 = await card().boundingBox();
await p.screenshot({ path: `${out}/v0373-resize-before.png` });
await drag("left", -120);
let b1 = await card().boundingBox();
ok(b0.width - b1.width < -80 && Math.abs(b0.x + b0.width - (b1.x + b1.width)) < 4, `the left edge makes it wider, the right edge stays (${Math.round(b0.width)} -> ${Math.round(b1.width)})`);
await p.screenshot({ path: `${out}/v0373-resize-left.png` });
await drag("right", 60, true);
let b2 = await card().boundingBox();
const leftMoved = b1.x - b2.x, rightMoved = b2.x + b2.width - (b1.x + b1.width);
ok(leftMoved > 30 && Math.abs(leftMoved - rightMoved) < 4, `Shift moves both edges evenly (left ${Math.round(leftMoved)} px, right ${Math.round(rightMoved)} px)`);
await p.screenshot({ path: `${out}/v0373-resize-shift.png` });
const kept = await p.evaluate(() => JSON.parse(localStorage.getItem("__mapLayouts") || "{}"));
const place = Object.values(Object.values(kept)[0] ?? {})[0];
ok(place && place.w > 200 && place.x < 0, "the width and where it starts are kept: " + JSON.stringify(place));
await p.goto("http://localhost:8765/csp.html");
await p.waitForTimeout(900);
await p.locator(".nv-picker-item, .nv-card", { hasText: "Order fulfilment" }).first().click();
await p.waitForTimeout(800);
await p.locator(".nv-ol-item", { hasText: "Approve order" }).click();
await p.waitForTimeout(900);
const b3 = await card().boundingBox();
ok(Math.abs(b3.width - b2.width) < 4, "kept after reopening");
await p.locator(".nv-reset-layout").click();
await p.waitForTimeout(400);

// ===== the command's name opens its settings; the mouse's back button =====
await p.goto("http://localhost:8765/csp.html?app");
await p.waitForTimeout(1000);
await p.locator(".nv-picker-item, .nv-card", { hasText: "Application" }).first().click();
await p.waitForTimeout(900);
await p.locator(".nv-ol-item", { hasText: "Assign Loan Officer" }).first().click();
await p.waitForTimeout(600);
await p.locator(".react-flow__node", { hasText: "Assign staff" }).first().click();
await p.keyboard.press("Tab");
await p.waitForTimeout(700);
const bar = p.locator(".nv-crumbbar");
ok((await bar.innerText()).includes("Assign staff"), "into the command: " + (await bar.innerText()).replace(/\s+/g, " "));
await p.locator(".fg-tab", { hasText: "Logs" }).click();
await p.locator(".react-flow__node", { has: p.locator(".nv-node-title", { hasText: /^Write Store/ }) }).first().click().catch(() => {});
await p.waitForTimeout(300);
const start = p.locator(".react-flow__node[data-id='start']");
await start.click();
await p.waitForTimeout(500);
ok((await panel.locator(".fg-tab.is-active").innerText()) === "Design" && (await panel.innerText()).includes("Reusable command"), "clicking the command's name at the top shows its settings");
await p.screenshot({ path: `${out}/v0373-command-settings.png` });
await mouseBack();
await p.waitForTimeout(600);
ok(!(await bar.innerText()).includes("Assign staff") && (await bar.innerText()).includes("Assign Loan Officer"), "the mouse's back button goes back to the action");
await p.waitForTimeout(200);
await start.click();
await p.waitForTimeout(400);
ok((await panel.innerText()).includes("Assign Loan Officer"), "and the action's name shows the action's settings");

// ===== the Resources screen's trail =====
await p.goto("http://localhost:8765/resources.html");
await p.waitForTimeout(900);
await p.locator(".rs-picker-btn").click();
await p.locator(`.rs-picker-item[data-resource="Loan"]`).click();
await p.waitForTimeout(500);
const chip = p.locator(".rs-chip").first();
if (await chip.count()) {
  const from = await p.locator(".rs-picker-btn").getAttribute("data-value");
  await chip.click();
  await p.waitForTimeout(600);
  const there = await p.locator(".rs-picker-btn").getAttribute("data-value");
  await mouseBack();
  await p.waitForTimeout(600);
  ok(there !== from && (await p.locator(".rs-picker-btn").getAttribute("data-value")) === from, `the mouse's back button goes back on the Resources screen too (${there} -> ${from})`);
} else ok(false, "no mapped chip on the Resources screen's first resource");

// ===== System Logs: Copy says so, Open as JSON, a resizable pane =====
await p.goto("http://localhost:8765/logs.html");
await p.waitForTimeout(900);
await p.evaluate(() => window.__addDebugLog());
await p.getByRole("button", { name: "Refresh" }).click();
await p.waitForTimeout(400);
const withValues = p.locator(".lg-table tbody tr", { hasText: "flow" }).first();
await withValues.click();
await p.waitForTimeout(400);
const val = p.locator(".lgm-value").first();
const copy = val.locator(".lgm-link", { hasText: "Copy" });
await copy.click();
ok((await val.locator(".lgm-link.is-done").innerText()).includes("Copied"), "Copy says Copied");
await p.locator(".lg-detail").screenshot({ path: `${out}/v0373-logs-copied.png` });
await p.waitForTimeout(1700);
ok((await copy.innerText()) === "Copy", "and goes back to Copy after a moment");
await val.locator(".lgm-link", { hasText: "Open as JSON" }).click();
await p.waitForTimeout(200);
const opened = await p.evaluate(() => window.__posted.filter((m) => m.type === "openJson").pop());
ok(opened && opened.payload.record && opened.payload.record.id === "documentrequest-1", "Open as JSON beside it opens that value: " + JSON.stringify(opened?.payload).slice(0, 80));
await p.locator(".lg-btn", { hasText: "Copy JSON" }).click();
ok((await p.locator(".lg-btn.is-done").innerText()).includes("Copied"), "the record's Copy JSON says Copied too");
const w0 = (await p.locator(".lg-detail").boundingBox()).width;
const h = await p.locator(".lg-detail-resize").boundingBox();
await p.mouse.move(h.x + h.width / 2, h.y + 200);
await p.mouse.down();
await p.mouse.move(h.x - 250, h.y + 200, { steps: 10 });
await p.mouse.up();
await p.waitForTimeout(300);
const w1 = (await p.locator(".lg-detail").boundingBox()).width;
ok(w1 - w0 > 200, `dragging the pane's edge makes it wider (${Math.round(w0)} -> ${Math.round(w1)})`);
await p.screenshot({ path: `${out}/v0373-logs-wider.png` });
// the screen is shown again (VS Code keeps its state)
await p.locator(".lg-x").click();
await p.locator(".lg-table tbody tr", { hasText: "flow" }).first().click();
await p.waitForTimeout(300);
ok(Math.abs((await p.locator(".lg-detail").boundingBox()).width - w1) < 4, "the width is kept");
await p.locator(".lg-detail-resize").dblclick();
await p.waitForTimeout(200);
ok(Math.abs((await p.locator(".lg-detail").boundingBox()).width - w0) < 4, "a double-click puts it back");

ok(errs.length === 0, "no page errors: " + errs.join(" | "));
await b.close();
