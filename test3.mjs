import { chromium } from "playwright";
const out = "/tmp/claude-0/-home-claude/a083e21d-6637-5cac-92a5-bbf1f2d008b9/scratchpad/shots";
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const p = await b.newPage({ viewport: { width: 1440, height: 860 } });
const errs = [];
p.on("pageerror", (e) => errs.push("pageerror: " + e.message));
p.on("console", (m) => /Content Security|Refused/.test(m.text()) && errs.push("CSP: " + m.text()));
const ok = (c, msg) => console.log((c ? "PASS " : "FAIL ") + msg);
const approve = (i) => p.evaluate((i) => window.__getDef().stages[0].actions[0].task.commands[i], i);
const log = () => p.evaluate(() => window.__mockLog.slice());

await p.goto("http://localhost:8765/csp.html");
await p.waitForTimeout(900);
// the node view opens first (0.3.3); these checks start from the list view
await p.getByRole("button", { name: "Back to list view" }).click();
await p.waitForTimeout(200);
await p.getByText("Order fulfilment").first().click();
await p.waitForTimeout(500);
await p.locator(".nv-launch").click();
await p.waitForTimeout(600);

// --- editing in the panel ---
await p.locator(".react-flow__node", { hasText: "Update Record" }).first().click();
await p.waitForTimeout(400);
const res = p.locator(".fg-panel .nv-field", { hasText: "Resource" }).locator("input");
ok((await res.inputValue()) === "orders", "panel loads current value");
const before = (await log()).filter((t) => t === "updateOperator").length;
await res.fill("orders_v2");
ok((await log()).filter((t) => t === "updateOperator").length === before, "typing alone doesn't apply");
await res.press("Enter");
await p.waitForTimeout(500);
ok((await approve(0)).data.resource === "orders_v2", "Enter applies the change");
ok(JSON.stringify((await approve(0)).data.fields) === JSON.stringify({ status: "approved" }), "other params untouched");
// node on canvas shows new value
ok(await p.locator(".react-flow__node", { hasText: "orders_v2" }).count() === 1, "node updates on canvas");
// blur applies too
// Fields is an object param: the list view's key/value editor
const kv = p.locator(".fg-panel .nv-kv-add input");
await kv.nth(0).fill("by");
await kv.nth(1).fill("node view");
await kv.nth(1).press("Enter");
await p.waitForTimeout(500);
ok((await approve(0)).data.fields?.by === "node view" && (await approve(0)).data.fields?.status === "approved", "adding a key/value row applies it");
// Escape reverts without applying
const n1 = (await log()).filter((t) => t === "updateOperator").length;
await res.fill("oops");
await res.press("Escape");
await p.waitForTimeout(300);
ok((await res.inputValue()) === "orders_v2" && (await log()).filter((t) => t === "updateOperator").length === n1, "Esc reverts the field");
// required field emptied -> inline error, value kept
await res.fill("");
await res.press("Enter");
await p.waitForTimeout(400);
ok(await p.locator(".fg-panel .nv-field.has-error", { hasText: "Resource" }).count() === 1, "required error shown inline");
ok((await approve(0)).data.resource === "orders_v2", "rejected change not applied");
await res.fill("orders");
await res.press("Enter");
await p.waitForTimeout(400);
ok(await p.locator(".fg-panel .nv-field.has-error").count() === 0 && (await approve(0)).data.resource === "orders", "fixing it clears the error");
// Ctrl+Z (outside a field) undoes the last panel edit
await p.locator(".react-flow__pane").click({ position: { x: 300, y: 700 } });
await p.keyboard.press("Control+z");
await p.waitForTimeout(400);
ok((await approve(0)).data.resource === "orders_v2", "Ctrl+Z undoes the panel edit");

// loop settings + delay
await p.locator(".react-flow__node", { hasText: "For Each" }).click();
await p.waitForTimeout(400);
const conc = p.locator(".fg-panel .nv-field", { hasText: "Concurrency" }).locator("input");
ok((await conc.inputValue()) === "4", "loop settings load");
await conc.fill("8"); await conc.press("Enter");
await p.waitForTimeout(400);
ok((await approve(2)).concurrency === 8, "loop concurrency applies");
await p.locator(".react-flow__node", { hasText: "Update Record" }).first().click();
await p.waitForTimeout(400);
const delay = p.locator(".fg-panel .nv-field", { hasText: "Delay (ms)" }).locator("input");
await delay.fill("1500"); await delay.press("Enter");
await p.waitForTimeout(400);
ok((await approve(0)).delay === 1500, "delay applies (ms)");
await p.screenshot({ path: out + "/33-panel-edited.png" });

// Enter on canvas focuses the first panel field
await p.locator(".react-flow__node", { hasText: "Notify User" }).click();
await p.waitForTimeout(300);
await p.keyboard.press("Enter");
await p.waitForTimeout(400);
ok(await p.evaluate(() => document.activeElement?.closest(".fg-panel") != null && document.activeElement.tagName === "INPUT"), "Enter focuses the panel editor");
await p.keyboard.press("Escape");

// eye toggles disabled
await p.locator(".react-flow__pane").click({ position: { x: 300, y: 700 } });
await p.locator(".react-flow__node", { hasText: "Notify User" }).click();
await p.waitForTimeout(300);
await p.locator(".fg-panel .fg-icon-btn").first().click();
await p.waitForTimeout(400);
const nu = await p.evaluate(() => window.__getDef().stages[0].actions[0].task.commands[1].false.commands[0]);
ok(nu.mock === true, "eye button disables the step");

// --- resize ---
const panel = p.locator(".fg-panel");
const w0 = (await panel.boundingBox()).width;
const h = await p.locator(".fg-resize").boundingBox();
await p.mouse.move(h.x + 3, h.y + 200);
await p.mouse.down();
await p.mouse.move(h.x - 150, h.y + 200, { steps: 8 });
await p.mouse.up();
await p.waitForTimeout(200);
const w1 = (await panel.boundingBox()).width;
ok(Math.abs(w1 - (w0 + 153)) < 6, `drag widens panel ${Math.round(w0)} -> ${Math.round(w1)}`);
await p.screenshot({ path: out + "/34-panel-wide.png" });
const h2 = await p.locator(".fg-resize").boundingBox();
await p.mouse.move(h2.x + 3, h2.y + 200);
await p.mouse.down();
await p.mouse.move(h2.x + 900, h2.y + 200, { steps: 8 });
await p.mouse.up();
ok(Math.round((await panel.boundingBox()).width) === 240, "minimum width 240");
await p.mouse.move(h2.x + 3, h2.y + 200);
const h3 = await p.locator(".fg-resize").boundingBox();
await p.mouse.dblclick(h3.x + 3, h3.y + 200);
await p.waitForTimeout(150);
ok(Math.round((await panel.boundingBox()).width) === 320, "double-click resets to 320");
// remembered across reload
const h4 = await p.locator(".fg-resize").boundingBox();
await p.mouse.move(h4.x + 3, h4.y + 200); await p.mouse.down(); await p.mouse.move(h4.x - 80, h4.y + 200, { steps: 4 }); await p.mouse.up();
const saved = await p.evaluate(() => window.acquireVsCodeApi === undefined ? null : null);
const st = await p.evaluate(() => { try { return JSON.stringify(window.__lastState ?? null); } catch { return null; } });
console.log("errors:", JSON.stringify(errs));
await b.close();
