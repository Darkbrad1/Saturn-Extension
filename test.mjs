import { chromium } from "playwright";
const out = "/tmp/claude-0/-home-claude/a083e21d-6637-5cac-92a5-bbf1f2d008b9/scratchpad/shots";
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const p = await b.newPage({ viewport: { width: 1440, height: 860 } });
const errs = [];
p.on("pageerror", (e) => errs.push("pageerror: " + e.message));
p.on("console", (m) => m.text().includes("NVDBG") && console.log(m.text()));
await p.goto("http://localhost:8765/index.html");
await p.waitForTimeout(1200);
await p.getByText("Order fulfilment").first().click();
await p.waitForTimeout(800);
await p.locator(".nv-launch").click();
await p.waitForTimeout(900);
await p.screenshot({ path: out + "/4-readable.png" });
const def = () => p.evaluate(() => JSON.stringify(window.__getDef().stages[0].actions[0].task.commands.map(c => c.operator || c.type)));
console.log("before", await def());

// select a node -> side panel
await p.locator(".react-flow__node", { hasText: "HTTP Request" }).first().click();
await p.waitForTimeout(300);
await p.screenshot({ path: out + "/5-selected.png" });

await p.locator(".react-flow__pane").click({position:{x:400,y:700}});
await p.keyboard.press("Home");
await p.waitForTimeout(500);
// drag first "Update Record" (root step 0) onto the wire between Each-loop and Notify customer
const src = p.locator(".react-flow__node", { hasText: "Update Record" }).first();
const sb = await src.boundingBox();
// find the edge into the reference node (Notify customer)
const ref = await p.locator('[data-id="h:stages.0.actions.0.task.commands.2"]').boundingBox();
const join = await p.locator('[data-id="j:stages.0.actions.0.task.commands.1"]').boundingBox();
const tx = (join.x + ref.x) / 2, ty = (join.y + ref.y + 14) / 2;
await p.mouse.move(sb.x + sb.width / 2, sb.y + 10);
await p.mouse.down();
for (let i = 1; i <= 15; i++) await p.mouse.move(sb.x + sb.width/2 + (tx - sb.x - sb.width/2) * i / 15, sb.y + 10 + (ty - sb.y - 10) * i / 15);
await p.waitForTimeout(200);
await p.screenshot({ path: out + "/6-drag-hot.png" });
console.log("hot edges:", await p.locator(".react-flow__edge.is-hot").count());
await p.mouse.up();
await p.waitForTimeout(700);
console.log("after move", await def(), await p.evaluate(() => window.__mockLog.slice(-5).join(",")));
await p.screenshot({ path: out + "/7-after-move.png" });

// undo
await p.keyboard.press("Control+z");
await p.waitForTimeout(500);
console.log("after undo", await def());

// Shift+A after selecting node -> add Set Variable (requires name -> form)
await p.locator(".react-flow__node", { hasText: "Update Record" }).first().click();
await p.mouse.move(700, 300);
await p.keyboard.press("Shift+A");
await p.waitForTimeout(300);
await p.screenshot({ path: out + "/8-addmenu.png" });
await p.keyboard.type("set var");
await p.keyboard.press("Enter");
await p.waitForTimeout(300);
await p.screenshot({ path: out + "/9-form.png" });
await p.locator(".nv-modal button[type=submit]").click(); // empty -> rejected
await p.waitForTimeout(300);
await p.screenshot({ path: out + "/10-form-error.png" });
await p.locator(".nv-modal input").first().fill("discount");
await p.locator(".nv-modal button[type=submit]").click();
await p.waitForTimeout(600);
console.log("after add", await def(), "modal open:", await p.locator(".nv-modal").count());

// edit via double click on the new step
await p.locator(".react-flow__node", { hasText: "Set Variable" }).first().dblclick();
await p.waitForTimeout(500);
console.log("edit values:", await p.locator(".fg-panel .nv-field input").first().inputValue());
await p.locator(".react-flow__pane").click({ position: { x: 300, y: 700 } });
await p.locator(".react-flow__node", { hasText: "Set Variable" }).first().click();

// delete with X
await p.locator(".react-flow__node", { hasText: "Set Variable" }).first().click();
await p.keyboard.press("x");
await p.waitForTimeout(500);
console.log("after delete", await def());

// Tab into the command
await p.locator(".react-flow__node", { hasText: "Notify customer" }).first().click();
await p.keyboard.press("Tab");
await p.waitForTimeout(700);
await p.screenshot({ path: out + "/11-command.png" });
console.log("crumbs:", await p.locator(".nv-crumbs").innerText());
await p.keyboard.press("Tab");
await p.waitForTimeout(400);
console.log("crumbs back:", await p.locator(".nv-crumbs").innerText());

// other trees
await p.getByRole("button", { name: /Mark delivered/ }).click();
await p.waitForTimeout(700);
await p.screenshot({ path: out + "/12-parallel.png" });
// back to list view; list editor still functional
await p.getByRole("button", { name: "List view" }).click();
await p.waitForTimeout(300);
await p.getByText("New").first().click();
await p.waitForTimeout(400);
await p.screenshot({ path: out + "/13-list-after.png" });
console.log("errors:", JSON.stringify(errs));
await b.close();
