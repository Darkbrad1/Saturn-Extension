// v0.3.41: actions move between stages and Global actions by dragging, one or several picked (Ctrl/Cmd or
// Shift+click); several also move as a block within one stage. They keep their ids; one move is one Undo.
import { chromium } from "playwright";
const out = process.env.SHOTS ?? "shots";
const b = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs = [];
p.on("pageerror", (e) => errs.push("pageerror: " + e.message));
p.on("console", (m) => /Content Security|Refused/.test(m.text()) && errs.push("CSP: " + m.text()));
const ok = (c, msg) => console.log((c ? "PASS " : "FAIL ") + msg);
const choose = async (what) => { await p.locator(".nv-ask").getByRole("button", { name: new RegExp(`^${what}`) }).click(); await p.waitForTimeout(500); };
const def = () => p.evaluate(() => JSON.parse(JSON.stringify(window.__defs.wf_debug)));
const stage = (name) => p.locator(".nv-ol-stage", { has: p.locator(".nv-ol-stagehead", { hasText: name }) });
const global = () => p.locator(".nv-ol-group", { has: p.locator(".nv-ol-head-label", { hasText: /^Global actions$/ }) });
const row = (scope, label) => scope.locator(".nv-ol-item", { has: p.locator(".nv-ol-label", { hasText: new RegExp(`^${label}$`) }) });
const labels = (list) => list.map((x) => x.label).join();

await p.goto("http://localhost:8765/csp.html");
await p.waitForTimeout(900);
await p.locator(".nv-picker-item", { hasText: "Debug lab" }).click();
await p.waitForTimeout(900);
let d = await def();
const ids0 = Object.fromEntries([...d.stages.flatMap((s) => s.actions), ...d.actions].map((a) => [a.label, a.id]));
ok(labels(d.stages[0].actions) === "Submit,Check" && labels(d.stages[1].actions) === "Close", "starts: Draft = Submit, Check; Done = Close");

// ===== one action to another stage =====
await row(stage("Draft"), "Check").dragTo(p.locator(".nv-ol-stagehead", { hasText: "Done" }));
await choose("Move");
await p.waitForTimeout(500);
d = await def();
ok(labels(d.stages[0].actions) === "Submit" && labels(d.stages[1].actions) === "Close,Check", "an action dragged onto another stage moves to its end");
ok(d.stages[1].actions[1].id === ids0.Check, "it keeps its id");

// onto an action in another stage: before it
await row(stage("Done"), "Check").dragTo(row(stage("Draft"), "Submit"));
await choose("Move");
await p.waitForTimeout(500);
d = await def();
ok(labels(d.stages[0].actions) === "Check,Submit" && labels(d.stages[1].actions) === "Close", "dropped on an action in another stage, it goes in before it");

// ===== into Global actions and back =====
await row(stage("Done"), "Close").dragTo(global().locator(".nv-ol-head"));
await choose("Move");
await p.waitForTimeout(500);
d = await def();
ok(d.stages[1].actions.length === 0 && labels(d.actions).endsWith("Close"), "an action moves into Global actions: " + labels(d.actions));
await row(global(), "Close").dragTo(p.locator(".nv-ol-stagehead", { hasText: "Done" }));
await choose("Move");
await p.waitForTimeout(500);
d = await def();
ok(labels(d.stages[1].actions) === "Close" && !labels(d.actions).includes("Close"), "and back from Global actions into a stage");

// ===== several picked =====
await row(stage("Draft"), "Check").click({ modifiers: ["Control"] });
await row(stage("Draft"), "Submit").click({ modifiers: ["Control"] });
await p.waitForTimeout(150);
// the hint counts them
await p.evaluate(() => {
  const rows = [...document.querySelectorAll(".nv-ol-item")];
  const src = rows.find((r) => r.textContent.includes("Check"));
  const target = [...document.querySelectorAll(".nv-ol-stage")].find((s) => s.querySelector(".nv-ol-stagehead")?.textContent.includes("Done"));
  const dt = new DataTransfer();
  src.dispatchEvent(new DragEvent("dragstart", { bubbles: true, dataTransfer: dt }));
  target.querySelector(".nv-ol-stagehead").dispatchEvent(new DragEvent("dragover", { bubbles: true, cancelable: true, dataTransfer: dt }));
});
await p.waitForTimeout(150);
ok((await stage("Done").locator(".nv-ol-drop-hint").innerText()).includes("move 2 actions here"), "dragging two says it moves both");
await p.screenshot({ path: out + "/m2-move-two.png" });
await p.evaluate(() => [...document.querySelectorAll(".nv-ol-item")].find((r) => r.textContent.includes("Check")).dispatchEvent(new DragEvent("dragend", { bubbles: true })));
await row(stage("Draft"), "Check").dragTo(row(stage("Done"), "Close"));
await choose("Move");
await p.waitForTimeout(500);
d = await def();
ok(d.stages[0].actions.length === 0 && labels(d.stages[1].actions) === "Check,Submit,Close", "two picked move together, in order, before the one dropped on: " + labels(d.stages[1].actions));
ok(d.stages[1].actions.map((a) => a.id).join() === [ids0.Check, ids0.Submit, ids0.Close].join(), "all keep their ids");

// several within one stage: a block
await row(stage("Done"), "Check").click({ modifiers: ["Control"] });
await row(stage("Done"), "Submit").click({ modifiers: ["Control"] });
await p.waitForTimeout(150);
await row(stage("Done"), "Check").dragTo(p.locator(".nv-ol-stagehead", { hasText: "Done" }));
await p.waitForTimeout(500);
ok(labels((await def()).stages[1].actions) === "Close,Check,Submit", "several picked in one stage move to its end as a block");

// one action alone in its own stage still reorders
await row(stage("Done"), "Submit").click();
await row(stage("Done"), "Submit").dragTo(row(stage("Done"), "Close"));
await p.waitForTimeout(500);
ok(labels((await def()).stages[1].actions) === "Submit,Close,Check", "one action still reorders within its stage");

// one Undo puts a move back
await row(stage("Done"), "Close").dragTo(p.locator(".nv-ol-stagehead", { hasText: "Draft" }));
await choose("Move");
await p.waitForTimeout(500);
ok(labels((await def()).stages[0].actions) === "Close", "moved Close to Draft");
await p.locator("#sonover-node-view .nv-btn", { hasText: /^Undo$/ }).click();
await p.waitForTimeout(500);
d = await def();
ok(d.stages[0].actions.length === 0 && labels(d.stages[1].actions) === "Submit,Close,Check", "one Undo puts it back");
ok((await p.locator(".nv-busy").count()) === 0, "nothing stuck on Applying…");

ok(errs.length === 0, "no page errors (" + errs.join(" | ") + ")");
await b.close();
