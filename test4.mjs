import { chromium } from "playwright";
const out = process.env.SHOTS ?? "shots";
const b = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const p = await b.newPage({ viewport: { width: 1440, height: 860 } });
const errs = [];
p.on("pageerror", (e) => errs.push("pageerror: " + e.message));
p.on("console", (m) => /Content Security|Refused/.test(m.text()) && errs.push("CSP: " + m.text()));
const ok = (c, msg) => console.log((c ? "PASS " : "FAIL ") + msg);
const def = () => p.evaluate(() => window.__getDef());
const crumbs = () => p.locator(".nv-crumbs").innerText();

await p.goto("http://localhost:8765/csp.html");
await p.waitForTimeout(900);
// the node view opens first (0.3.3); these checks start from the list view
await p.getByRole("button", { name: "Back to list view" }).click();
await p.waitForTimeout(200);
await p.getByText("Order fulfilment").first().click();
await p.waitForTimeout(500);
await p.locator(".nv-launch").click();
await p.waitForTimeout(500);

// ===== If branches =====
await p.getByRole("button", { name: /Resend invoice/ }).click();
await p.waitForTimeout(700);
await p.screenshot({ path: out + "/41-if-slot.png" });
const slot = p.locator(".react-flow__node-slot", { hasText: "Empty false branch" });
ok(await slot.count() === 1, "empty False branch shows a slot");
await slot.locator("button").click();
await p.waitForTimeout(300);
ok(await p.locator(".nv-menu").count() === 1, "clicking the slot opens the Add menu");
await p.keyboard.type("send email");
await p.keyboard.press("Enter");
await p.waitForTimeout(300);
await p.locator(".nv-modal input").nth(0).fill("{{ record.billing_email }}");
await p.locator(".nv-modal input").nth(1).fill("Small invoice");
await p.locator(".nv-modal button[type=submit]").click();
await p.waitForTimeout(600);
let ifn = (await def()).actions[0].task.commands[1];
ok(ifn.false.commands.length === 1 && ifn.false.commands[0].operator === "send_email" && ifn.true.commands.length === 1, "step added to the False branch");
await p.screenshot({ path: out + "/42-if-false-added.png" });

// wire inside the frame: hover shows +, click it adds after Notify User in the True branch
await p.locator(".react-flow__pane").click({ position: { x: 200, y: 750 } });
await p.keyboard.press("Home"); await p.waitForTimeout(500);
const trueOut = p.locator('.react-flow__edge[data-id^="e:n:actions.0.task.commands.1.true.commands.0:out"]');
const tp = await trueOut.locator("path").first().evaluate((el) => { const l = el.getTotalLength(); const q = el.getPointAtLength(l * 0.3); const m = el.getScreenCTM(); return { x: q.x * m.a + m.e, y: q.y * m.d + m.f }; });
await p.mouse.move(tp.x, tp.y);
await p.waitForTimeout(250);
ok(await p.locator(".nv-wire-add.is-visible").count() === 1, "hovering a wire inside a frame shows its + button");
await p.mouse.click(tp.x, tp.y);
await p.waitForTimeout(200);
ok(await p.locator(".react-flow__edge.selected").count() === 1, "a wire inside a frame can be selected");
await p.locator(".nv-wire-add.is-visible").click();
await p.waitForTimeout(300);
await p.keyboard.type("parallel");
await p.keyboard.press("Enter");
await p.waitForTimeout(600);
ifn = (await def()).actions[0].task.commands[1];
ok(ifn.true.commands.length === 2 && ifn.true.commands[1].type === "parallel", "+ on a True-branch wire inserts there");
// drag a step onto the empty slot of the new parallel block
await p.waitForTimeout(300);
const pslot = p.locator(".react-flow__node-slot", { hasText: "No branches" });
ok(await pslot.count() === 1, "empty parallel block shows a slot");
await p.keyboard.press("Home"); await p.waitForTimeout(400);
const src = await p.locator(".react-flow__node", { hasText: "Run Script" }).boundingBox();
const dst = await pslot.boundingBox();
await p.mouse.move(src.x + 40, src.y + 10); await p.mouse.down();
for (let i = 1; i <= 12; i++) await p.mouse.move(src.x + 40 + (dst.x + dst.width / 2 - src.x - 40) * i / 12, src.y + 10 + (dst.y + dst.height / 2 - src.y - 10) * i / 12);
ok(await p.locator(".react-flow__node-slot.is-hot").count() === 1, "slot lights up while dragging over it");
await p.mouse.up();
await p.waitForTimeout(600);
const acts = (await def()).actions[0].task.commands;
ok(acts[0].type === "if" && acts[0].true.commands[1].commands[0]?.operator === "run_script", "dropping on the slot moves the step into it");
await p.keyboard.press("Control+z"); await p.waitForTimeout(400);

// ===== create stage / action / command =====
await p.locator(".nv-ol-head", { hasText: "Stages" }).locator("button[title='New stage']").click();
await p.keyboard.type("Cancelled");
await p.keyboard.press("Enter");
await p.waitForTimeout(600);
let d = await def();
ok(d.stages.length === 3 && d.stages[2].stage === "cancelled" && /^#/.test(d.stages[2].color), "new stage created (with a colour)");
ok(await p.locator(".nv-ol-inline input[placeholder='New action name']").count() === 1, "after a new stage, the outliner asks for its first action");
await p.keyboard.type("Refund customer");
await p.keyboard.press("Enter");
await p.waitForTimeout(700);
d = await def();
ok(d.stages[2].actions[0]?.action === "refund_customer", "action created in the new stage");
ok((await crumbs()).includes("Refund customer"), "new action opens on the canvas");
ok(await p.locator(".react-flow__node-slot", { hasText: "No steps yet" }).count() === 1, "empty action shows a 'No steps yet' slot");
await p.locator(".react-flow__node-slot button").click();
await p.keyboard.type("notify user");
await p.keyboard.press("Enter");
await p.waitForTimeout(600);
d = await def();
ok(d.stages[2].actions[0].task.commands[0]?.operator === "notify_user", "first step added to the new action");
await p.screenshot({ path: out + "/43-new-stage-action.png" });

// duplicate name -> inline error
await p.locator(".nv-ol-head", { hasText: "Commands" }).locator(".nv-ol-add").click();
await p.keyboard.type("Notify customer");
await p.keyboard.press("Enter");
await p.waitForTimeout(600);
ok(/already exists/.test(await p.locator(".nv-ol-err").innerText().catch(() => "")), "duplicate command name shows an inline error");
await p.screenshot({ path: out + "/44-dup-error.png" });
await p.locator(".nv-ol-inline input").fill("Escalate to manager");
await p.keyboard.press("Enter");
await p.waitForTimeout(600);
d = await def();
ok(d.commands.some((c) => c.name === "escalate_to_manager"), "command created after fixing the name");
ok((await crumbs()).includes("Escalate to manager"), "new command opens");

// global action
await p.locator(".nv-ol-head", { hasText: "Global actions" }).locator(".nv-ol-add").click();
await p.keyboard.type("Archive");
await p.keyboard.press("Enter");
await p.waitForTimeout(600);
ok((await def()).actions.some((a) => a.action === "archive"), "global action created");

// rename by double-click, delete by context menu
await p.locator(".nv-ol-item", { hasText: "Archive" }).dblclick();
await p.locator(".nv-ol-inline input").fill("Archive order");
await p.keyboard.press("Enter");
await p.waitForTimeout(500);
ok((await def()).actions.some((a) => a.label === "Archive order"), "double-click renames");
await p.locator(".nv-ol-item", { hasText: "Archive order" }).click({ button: "right" });
await p.locator(".nv-ctx-item", { hasText: "Delete action" }).click();
await p.waitForTimeout(500);
ok(!(await def()).actions.some((a) => a.label === "Archive order"), "context menu deletes");
await p.screenshot({ path: out + "/45-outliner.png" });
console.log("errors:", JSON.stringify(errs));
await b.close();
