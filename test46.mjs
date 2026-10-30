// v0.3.59: picking several steps on the canvas: a box drawn on the empty canvas (Ctrl/Cmd adds), Ctrl/Cmd+A picks
// every step in view, the settings several steps of one kind share (Mixed where they differ, one edit for all), and
// several picked steps dragged together onto a wire (one edit, in their order).
import { chromium } from "playwright";
const out = process.env.SHOTS ?? "shots";
const b = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs = [];
p.on("pageerror", (e) => errs.push("pageerror: " + e.message));
const ok = (c, msg) => console.log((c ? "PASS " : "FAIL ") + msg);
const panel = p.locator(".fg-panel");
const approve = async () => (await p.evaluate(() => window.__getDef("wf_orders"))).stages[0].actions[0].task.commands;
const card = (text, i = 0) => p.locator(".react-flow__node", { hasText: text }).nth(i);
const pickedCount = async () => {
  const t = await panel.locator(".fg-head-title").first().innerText().catch(() => "");
  const m = /^(\d+) steps selected/.exec(t);
  return m ? Number(m[1]) : (await p.locator(".react-flow__node.selected").count());
};
// a box around a step, drawn from the empty corner below and right of it (a box can't start on a group)
const box = async (loc, pad = 40) => {
  const r = await loc.boundingBox();
  await p.mouse.move(r.x + r.width + pad, r.y + r.height + 14);
  await p.mouse.down();
  await p.mouse.move(r.x - pad, r.y - 14, { steps: 10 });
  await p.mouse.up();
  await p.waitForTimeout(250);
};

await p.goto("http://localhost:8765/csp.html");
await p.waitForTimeout(900);
await p.locator(".nv-picker-item", { hasText: "Order fulfilment" }).click().catch(() => {});
await p.waitForTimeout(600);
await p.locator(".nv-ol-item", { hasText: "Approve order" }).click();
await p.waitForTimeout(700);
// fit everything in view, so every card can be reached
await p.locator(".react-flow__pane").click({ position: { x: 30, y: 30 } });
await p.keyboard.press("Home");
await p.waitForTimeout(500);

// ===== a box on the empty canvas =====
await box(card("Update Record", 0));
ok((await p.locator(".react-flow__node.selected").count()) === 1 && (await panel.innerText()).includes("Resource"), "a box around one step picks it (its settings show)");
await p.keyboard.down("Control");
await box(card("Notify customer", 0));
await p.keyboard.up("Control");
ok((await pickedCount()) === 2, "Ctrl + a second box adds to what's picked: " + (await pickedCount()));
await p.screenshot({ path: out + "/j1-box.png" });
await p.keyboard.press("Escape");
await p.waitForTimeout(150);

// ===== Ctrl/Cmd+A =====
await p.locator(".react-flow__pane").click({ position: { x: 30, y: 30 } });
await p.keyboard.press("Control+a");
await p.waitForTimeout(250);
const all = await pickedCount();
ok(all >= 4 && (await panel.innerText()).includes("steps selected"), "Ctrl+A picks every step in view: " + all);
await p.keyboard.press("Escape");
await p.waitForTimeout(150);

// ===== the settings two steps of one kind share =====
await card("Update Record", 0).click();
await card("Update Record", 1).click({ modifiers: ["Control"] });
await p.waitForTimeout(400);
ok((await pickedCount()) === 2, "Ctrl+click picks a second step");
const shared = panel.locator("#multi-settings, .fg-section", { hasText: "settings they share" }).first();
ok((await panel.innerText()).includes("Update Record settings they share"), "the panel shows the settings two Update Record steps share");
const resource = panel.locator(".nv-multi-form .nv-field", { hasText: "Resource" }).locator("input, textarea").first();
ok((await resource.inputValue()) === "" && ((await resource.getAttribute("placeholder")) ?? "").includes("Mixed"), "Resource differs (orders, inventory): Mixed");
await p.screenshot({ path: out + "/j2-shared.png" });
await resource.fill("stock");
await resource.press("Enter");
await p.waitForTimeout(500);
let cmds = await approve();
const inner = cmds.find((c) => c.type === "each").command.commands[0];
ok(cmds[0].data.resource === "stock" && inner.data.resource === "stock", "a change goes to both");
ok(JSON.stringify(cmds[0].data.fields) === '{"status":"approved"}' && JSON.stringify(inner.data.fields) === '{"reserved":"{{ item.qty }}"}', "each keeps its other settings");
ok((await p.evaluate(() => (window.__posted || []).filter((m) => m.type === "updateOperators").length)) === 1, "as one edit");
ok((await panel.locator(".nv-multi-form .nv-field", { hasText: "Resource" }).locator("input, textarea").first().inputValue()) === "stock", "now they share it");
await p.keyboard.press("Escape");
await p.waitForTimeout(150);

// ===== dragging two picked steps together onto a wire =====
const before = (await approve()).map((c) => c.type === "command" ? c.operator : c.type);
// pick the first step and the reference at the end, drag the first below the reference (onto the wire to End)
await card("Update Record", 0).click();
const ref = p.locator(".react-flow__node", { hasText: "Notify customer" }).first();
await ref.click({ modifiers: ["Control"] });
await p.waitForTimeout(250);
// onto the wire between the Condition group and the Loop group (a wire touching a picked step can't take them)
// (0.3.74: no boxes round them; the If's join dot and the loop's card mark the gap)
const condJoin = await p.locator('.react-flow__node[data-id^="j:"]').nth(0).boundingBox();
const loopHead = await p.locator(".react-flow__node", { has: p.locator(".nv-node-title", { hasText: /^For Each$/ }) }).first().boundingBox();
const cond = { x: loopHead.x, width: loopHead.width, y: condJoin.y, height: condJoin.height };
const loop = loopHead;
const src = await card("Update Record", 0).boundingBox();
const tx = cond.x + cond.width / 2, ty = (cond.y + cond.height + loop.y) / 2;
await p.mouse.move(src.x + src.width / 2, src.y + 12);
await p.mouse.down();
await p.mouse.move(tx, ty, { steps: 15 });
await p.mouse.move(tx, ty + 2, { steps: 2 });
await p.mouse.up();
await p.waitForTimeout(500);
const after = (await approve()).map((c) => c.type === "command" ? c.operator : c.type);
ok((await p.evaluate(() => (window.__posted || []).filter((m) => m.type === "moveSteps").length)) === 1, "dropping them sends one move for both");
ok(after.join() === [before[1], before[0], before[3], before[2]].join(), "both go to the wire, in their order: " + before.join() + " -> " + after.join());
await p.screenshot({ path: out + "/j3-moved.png" });

ok(errs.length === 0, "no page errors (" + errs.join(" | ") + ")");
await b.close();
