// v0.3.74 (and 0.3.75: dragging a step out of a switch case): no box round a container (If, switch, Parallel, group, loop): its head is a card like any other (picked,
// box-picked, dragged onto a wire to move the whole block). An If's or switch's branch with no steps is only its dot:
// no wire, no "Empty … branch" box; a click on the dot adds a step there, and a step dropped on it moves there. An
// empty group, loop or Parallel is a plain wire from its card to its join, whose + adds the first step.
import { chromium } from "playwright";
const out = process.env.SHOTS ?? "shots";
const b = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium" });
const p = await b.newPage({ viewport: { width: 1500, height: 1100 } });
const errs = [];
p.on("pageerror", (e) => errs.push("pageerror: " + e.message));
p.on("console", (m) => /Content Security|Refused/.test(m.text()) && errs.push("CSP: " + m.text()));
const ok = (c, msg) => console.log((c ? "PASS " : "FAIL ") + msg);
const def = () => p.evaluate(() => JSON.parse(JSON.stringify(window.__getDef())));
const node = (title) => p.locator(".react-flow__node", { has: p.locator(".nv-node-title", { hasText: title }) });

await p.goto("http://localhost:8765/csp.html");
await p.waitForTimeout(900);
await p.locator(".nv-card", { hasText: "Debug lab" }).click();
await p.waitForTimeout(700);
// the owner's case: an empty If, Parallel, group and switch at the end of an action
await p.evaluate(() => {
  const close = window.__defs[Object.keys(window.__defs).find((k) => window.__defs[k].name === "Debug lab")].stages[1].actions[0];
  close.task.commands.push(
    { type: "if", operator: "command", evaluator: "condition", data: { property: "s", operator: "==", value: "" }, true: { type: "series", commands: [] }, false: { type: "series", commands: [] } },
    { type: "parallel", operator: "parallel", commands: [] },
    { type: "series", commands: [] },
    { type: "switch", data: { value: "ss" }, cases: [], otherwise: { type: "series", commands: [] } },
  );
  window.__reply();
});
await p.waitForTimeout(500);
await p.locator(".nv-ol-item", { hasText: /^Close/ }).first().click();
await p.waitForTimeout(900);

ok((await p.locator(".react-flow__node-frame").count()) === 0, "no box is drawn round a container");
ok((await p.locator(".react-flow__node-slot").count()) === 0, "no Empty … boxes for empty branches, groups or Parallels");
const iff = node(/^If$/).last();
ok((await iff.locator(".nv-h.is-empty").count()) === 2, "an If with nothing in either branch has its two dots");
const wires = await p.evaluate(() => [...document.querySelectorAll(".react-flow__edge")].map((e) => e.getAttribute("data-id") ?? e.id));
const ifId = await iff.getAttribute("data-id");
ok(!wires.some((w) => w.includes(ifId + ":true") || w.includes(ifId + ":false")), "and no wire leaves them");
await iff.scrollIntoViewIfNeeded();
await p.locator(".react-flow__node", { has: p.locator(".nv-node-title", { hasText: /^Read$/ }) }).click();
await p.waitForTimeout(200);
await p.keyboard.press("Escape");
// fit so the end of the action shows
await iff.click();
await p.waitForTimeout(300);
await p.screenshot({ path: `${out}/v0374-containers.png` });
ok(await iff.locator(".nv-node").evaluate((el) => el.classList.contains("is-selected")), "a container's card is picked like any step");
ok((await p.locator(".fg-panel").innerText()).includes("If"), "and its settings show in the side panel");

// ===== click an empty dot: the Add menu adds there =====
await iff.locator(".nv-h.is-empty[data-empty='false']").click({ force: true });
await p.waitForTimeout(400);
ok((await p.locator(".nv-menu-title", { hasText: "Add" }).count()) === 1, "a click on an empty dot opens the Add menu");
await p.screenshot({ path: `${out}/v0374-dot-add.png` });
await p.keyboard.type("debug");
await p.waitForTimeout(200);
await p.keyboard.press("Enter");
await p.waitForTimeout(800);
const ifDef = async () => (await def()).stages[1].actions[0].task.commands.find((c) => c.type === "if" && c.data?.property === "s");
const added = await ifDef();
ok(added.false.commands.length === 1 && added.true.commands.length === 0, "the step goes into that branch: " + JSON.stringify(added.false.commands.map((c) => c.operator)));
await p.waitForTimeout(400);
const iff2 = node(/^If$/).last();
ok((await iff2.locator(".nv-h.is-empty").count()) === 1, "the other branch is still only a dot");
await iff2.scrollIntoViewIfNeeded();
await p.screenshot({ path: `${out}/v0374-one-branch.png` });

// ===== drop a step on the empty dot =====
const dbg = p.locator(".react-flow__node", { has: p.locator(".nv-node-title", { hasText: /^Debug$/ }) }).first();
const db = await dbg.locator(".nv-node-header").boundingBox();
const dot = await node(/^If$/).last().locator(".nv-h.is-empty").boundingBox();
await p.mouse.move(db.x + 30, db.y + db.height / 2);
await p.mouse.down();
await p.mouse.move(dot.x + dot.width / 2, dot.y + dot.height / 2, { steps: 20 });
await p.waitForTimeout(150);
const hot = await p.locator(".nv-h.is-empty.is-hot").count();
await p.mouse.up();
await p.waitForTimeout(800);
const after = await ifDef();
ok(hot === 1 && after.true.commands.length === 1, `a step dropped on an empty dot moves into that branch (lit up: ${hot})`);

// ===== the container's card drags the whole block onto a wire =====
const par = node(/^Parallel$/).last();
ok((await par.count()) === 1, "the empty Parallel is a card");
const parWires = await p.evaluate((id) => [...document.querySelectorAll(".react-flow__edge")].map((e) => e.getAttribute("data-id") ?? "").filter((w) => w.includes(id)), await par.getAttribute("data-id"));
ok(parWires.some((w) => /->j:/.test(w)), "an empty Parallel has a plain wire from its card to its join");

// ===== 0.3.75: drag a step out of a switch case (the owner's Assign staff: each case holds one plain step) =====
await p.goto("http://localhost:8765/csp.html?app");
await p.waitForTimeout(1000);
await p.locator(".nv-picker-item, .nv-card", { hasText: "Application" }).first().click();
await p.waitForTimeout(900);
await p.locator(".nv-ol-item", { hasText: "Assign staff" }).first().click();
await p.waitForTimeout(900);
const staff = async () => {
  const d = await def();
  return d.commands.find((c) => c.label === "Assign staff").command.commands.map((x) => (x.type === "switch" ? "switch[" + x.cases.map((k) => (k.command.commands ?? [k.command]).length).join(",") + "|" + (x.otherwise.commands ?? [x.otherwise]).length + "]" : x.operator));
};
const before = await staff();
await p.screenshot({ path: `${out}/v0375-drag-out-before.png` });
const pu = node(/^Property Updater$/).first();
const ph = await pu.locator(".nv-node-header").boundingBox();
const send = await node(/^Send Email$/).first().boundingBox();
await p.mouse.move(ph.x + 30, ph.y + ph.height / 2);
await p.mouse.down();
await p.mouse.move(send.x + send.width / 2, send.y - 20, { steps: 20 });
await p.mouse.move(send.x + send.width / 2, send.y - 18, { steps: 2 });
await p.mouse.up();
await p.waitForTimeout(900);
const moved = await staff();
ok(before.join() === "code,switch[1|1],code,send_email,debug" && moved.join() === "code,switch[0|1],code,property_updater,send_email,debug", "a step dragged out of a switch case moves there, and the case is left empty: " + moved.join());
ok(!/splice|Cannot move/.test(await p.locator("body").innerText()), "with no error");
ok((await node(/^Switch$/).first().locator(".nv-h.is-empty").count()) === 1, "the emptied case is just its dot");
await p.screenshot({ path: `${out}/v0375-drag-out-after.png` });
await p.keyboard.press("Control+z");
await p.waitForTimeout(700);
ok((await staff()).join() === before.join(), "Undo puts it back in its case");

ok(errs.length === 0, "no page errors: " + errs.join(" | "));
await b.close();
