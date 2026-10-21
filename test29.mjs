// v0.3.42: dragging actions or commands into another list (another stage, Global actions, Commands) asks
// Copy or Move, one item or several. Move removes the originals (one change); moving a command that reference
// steps call warns first. Reordering in the same list, or several already in that list, never asks.
import { chromium } from "playwright";
const out = process.env.SHOTS ?? "shots";
const b = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs = [];
p.on("pageerror", (e) => errs.push("pageerror: " + e.message));
p.on("console", (m) => /Content Security|Refused/.test(m.text()) && errs.push("CSP: " + m.text()));
const ok = (c, msg) => console.log((c ? "PASS " : "FAIL ") + msg);
const ask = () => p.locator(".nv-ask");
const choose = async (what) => { await ask().getByRole("button", { name: new RegExp(`^${what}`) }).click(); await p.waitForTimeout(500); };
const def = (id) => p.evaluate((i) => JSON.parse(JSON.stringify(window.__defs[i])), id);
const stage = (name) => p.locator(".nv-ol-stage", { has: p.locator(".nv-ol-stagehead", { hasText: name }) });
const group = (name) => p.locator(".nv-ol-group", { has: p.locator(".nv-ol-head-label", { hasText: new RegExp(`^${name}$`) }) });
const row = (scope, label) => scope.locator(".nv-ol-item", { has: p.locator(".nv-ol-label", { hasText: new RegExp(`^${label}$`) }) });
const labels = (list) => list.map((x) => x.label).join();

await p.goto("http://localhost:8765/csp.html");
await p.waitForTimeout(900);
await p.locator(".nv-picker-item", { hasText: "Debug lab" }).click();
await p.waitForTimeout(900);

// ===== one action to another stage asks; Copy keeps the original =====
let d = await def("wf_debug");
const checkId = d.stages[0].actions[1].id;
await row(stage("Draft"), "Check").dragTo(p.locator(".nv-ol-stagehead", { hasText: "Done" }));
await p.waitForTimeout(200);
ok((await ask().count()) === 1 && (await ask().locator(".nv-ask-title").innerText()) === "1 action to Done", "one action dropped on another stage asks Copy or Move");
await p.screenshot({ path: out + "/a1-ask.png" });
await choose("Copy");
d = await def("wf_debug");
ok(labels(d.stages[0].actions) === "Submit,Check" && labels(d.stages[1].actions) === "Close,Check", "Copy: it's in both stages");
ok(d.stages[1].actions[1].id !== checkId && d.stages[0].actions[1].id === checkId, "the copy has a new id; the original keeps its own");

// Cancel and Esc do nothing
await row(stage("Draft"), "Submit").dragTo(p.locator(".nv-ol-stagehead", { hasText: "Done" }));
await p.waitForTimeout(200);
await choose("Cancel");
ok((await ask().count()) === 0 && labels((await def("wf_debug")).stages[1].actions) === "Close,Check", "Cancel does nothing");
await row(stage("Draft"), "Submit").dragTo(p.locator(".nv-ol-stagehead", { hasText: "Done" }));
await p.waitForTimeout(200);
await p.keyboard.press("Escape");
await p.waitForTimeout(200);
ok((await ask().count()) === 0 && labels((await def("wf_debug")).stages[1].actions) === "Close,Check", "Esc closes it and does nothing");

// several from another list: Move
await row(stage("Draft"), "Submit").click({ modifiers: ["Control"] });
await row(stage("Draft"), "Check").click({ modifiers: ["Control"] });
await row(stage("Draft"), "Submit").dragTo(group("Global actions").locator(".nv-ol-head"));
await p.waitForTimeout(200);
ok((await ask().locator(".nv-ask-title").innerText()) === "2 actions to Global actions", "two picked ask too");
await choose("Move");
d = await def("wf_debug");
ok(d.stages[0].actions.length === 0 && labels(d.actions).endsWith("Submit,Check"), "Move: they leave Draft for Global actions");

// several already in that list: a block move, no question
await row(group("Global actions"), "Submit").click({ modifiers: ["Control"] });
await row(group("Global actions"), "Check").click({ modifiers: ["Control"] });
await row(group("Global actions"), "Submit").dragTo(row(group("Global actions"), "Audit"));
await p.waitForTimeout(500);
ok((await ask().count()) === 0 && labels((await def("wf_debug")).actions) === "Submit,Check,Audit", "several already in that list just move, no question");

// ===== actions into Commands: Move removes them =====
await row(group("Global actions"), "Submit").click();
await row(group("Global actions"), "Submit").dragTo(group("Commands").locator(".nv-ol-head"));
await p.waitForTimeout(200);
await choose("Move");
d = await def("wf_debug");
ok(!labels(d.actions).includes("Submit") && labels(d.commands).endsWith("Submit"), "Move into Commands: the action goes, a command comes");

// ===== a command that reference steps call warns =====
await p.goto("http://localhost:8765/csp.html");
await p.waitForTimeout(900);
await p.locator(".nv-picker-item", { hasText: "Order fulfilment" }).click();
await p.waitForTimeout(900);
const orders = await def("wf_orders");
if (orders.commands.length) {
  const cmd = orders.commands[0].label;
  await row(group("Commands"), cmd).dragTo(group("Global actions").locator(".nv-ol-head"));
  await p.waitForTimeout(200);
  ok((await ask().locator(".nv-ask-warn").innerText()).includes("reference step"), "moving a command that reference steps call warns: " + (await ask().locator(".nv-ask-warn").innerText().catch(() => "")));
  await p.screenshot({ path: out + "/a2-ask-warn.png" });
  await choose("Copy");
  const after = await def("wf_orders");
  ok(after.commands.length === orders.commands.length && labels(after.actions).endsWith(cmd), "Copy keeps the command; an action is made from it");
} else ok(false, "Order fulfilment has a command to test with");

ok((await p.locator(".nv-busy").count()) === 0, "nothing stuck on Applying…");
ok(errs.length === 0, "no page errors (" + errs.join(" | ") + ")");
await b.close();
