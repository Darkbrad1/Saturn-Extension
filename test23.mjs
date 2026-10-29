// v0.3.36: after Undo (button, Ctrl+Z or the Changes tab) the top bar's "Applying…" goes away and more edits
// work. (The real host's bug, no answer to an undo, is covered by hosttest-undo.cjs; this checks the node view.)
import { chromium } from "playwright";
const out = process.env.SHOTS ?? "shots";
const b = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs = [];
p.on("pageerror", (e) => errs.push("pageerror: " + e.message));
const ok = (c, msg) => console.log((c ? "PASS " : "FAIL ") + msg);
const applying = () => p.locator(".nv-busy").count();
const labels = () => p.evaluate(() => window.__defs.wf_tickets.actions.map((a) => a.label).join());

await p.goto("http://localhost:8765/csp.html");
await p.waitForTimeout(900);
// Property Updater has a form like Saturn's since 0.3.69 (test57.mjs); the property map editor is checked on an Update Record
await p.evaluate(() => { const c = window.__defs.wf_tickets.stages[0].actions[0].task.commands[0]; c.operator = "update_record"; c.data = { resource: "tickets", fields: c.data.properties }; });
await p.locator(".nv-picker-item", { hasText: "Support tickets" }).click();
await p.waitForTimeout(900);
const dup = async () => {
  await p.locator(".nv-ol-item", { hasText: "Escalate" }).first().click({ button: "right" });
  await p.locator(".nv-ctx").getByRole("button", { name: "Duplicate" }).click();
  await p.waitForTimeout(400);
};
await dup();
await dup();
ok((await labels()) === "Escalate,Escalate (copy),Escalate (copy)", "two edits");
await p.locator("#sonover-node-view .nv-btn", { hasText: /^Undo$/ }).click();
await p.waitForTimeout(400);
ok((await applying()) === 0, "after Undo, Applying… is gone");
await p.locator(".nv-canvas").click({ position: { x: 300, y: 600 } });
await p.keyboard.press("Control+z");
await p.waitForTimeout(400);
ok((await labels()) === "Escalate" && (await applying()) === 0, "Ctrl+Z undoes the other; still not stuck");
await dup();
ok((await labels()) === "Escalate,Escalate (copy)" && (await applying()) === 0, "a new edit after undoing works");
// ===== a property map's names can be changed (an Update Record's fields) =====
const panel = p.locator(".fg-panel");
await p.locator(".nv-ol-item", { hasText: "Triage" }).first().click();
await p.waitForTimeout(600);
await p.locator(".react-flow__node", { hasText: "Update Record" }).first().click();
await p.waitForTimeout(500);
const props = () => p.evaluate(() => JSON.stringify(window.__defs.wf_tickets.stages[0].actions[0].task.commands[0].data.fields));
const keyBox = (name) => panel.locator(".nv-kv-item input.nv-kv-k").filter({ has: p.locator(`xpath=self::*[@value="${name}"]`) });
const keys = () => panel.locator(".nv-kv-item input.nv-kv-k").evaluateAll((es) => es.map((e) => e.value));
ok((await keys()).join() === "priority,queue", "each property's name is a box you can type in " + (await keys()).join());
const first = panel.locator(".nv-kv-item input.nv-kv-k").first();
await first.fill("urgency");
await first.press("Enter");
await p.waitForTimeout(500);
ok((await props()) === JSON.stringify({ urgency: "high", queue: "tier1" }), "renaming a property keeps its value and its place " + (await props()));
await panel.locator(".nv-kv-item input.nv-kv-k").first().fill("queue");
await panel.locator(".nv-kv-item input.nv-kv-k").first().press("Enter");
await p.waitForTimeout(400);
ok((await props()) === JSON.stringify({ urgency: "high", queue: "tier1" }) && (await keys())[0] === "urgency", "a name already in the list is refused and put back");
ok((await panel.locator(".nv-field-caption.is-warn", { hasText: "already in the list" }).count()) === 1, "with a note saying why");
await panel.locator(".nv-kv-item input.nv-kv-k").first().fill("");
await panel.locator(".nv-kv-item input.nv-kv-k").first().press("Enter");
await p.waitForTimeout(400);
ok((await keys())[0] === "urgency" && (await props()).includes("urgency"), "an empty name is refused too");
await panel.locator(".nv-kv-item input.nv-kv-k").first().fill("level");
await panel.locator(".nv-kv-item input.nv-kv-k").first().press("Escape");
await p.waitForTimeout(200);
ok((await keys())[0] === "urgency", "Esc puts the name back");
await panel.locator(".nv-kv-item input.nv-kv-v").last().fill("tier2");
await panel.locator(".nv-kv-item input.nv-kv-v").last().press("Enter");
await p.waitForTimeout(400);
ok((await props()) === JSON.stringify({ urgency: "high", queue: "tier2" }), "values are still editable");
await p.screenshot({ path: out + "/u1-kv-names.png" });

ok(errs.length === 0, "no page errors (" + errs.join(" | ") + ")");
await b.close();
