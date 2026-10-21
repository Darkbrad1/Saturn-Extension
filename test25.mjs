// v0.3.38: a property map (like Property Updater's properties) shows on its card as one row per property, the
// name in grey and the value in its box, up to 10 then "+N more properties". Every card value is syntax
// highlighted ({{ templates }}, JSON, numbers, true / false / null, code).
import { chromium } from "playwright";
const out = process.env.SHOTS ?? "shots";
const b = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs = [];
p.on("pageerror", (e) => errs.push("pageerror: " + e.message));
p.on("console", (m) => /Content Security|Refused/.test(m.text()) && errs.push("CSP: " + m.text()));
const ok = (c, msg) => console.log((c ? "PASS " : "FAIL ") + msg);
const card = () => p.locator(".react-flow__node", { hasText: "Property Updater" }).first();
const open = async () => {
  await p.evaluate(() => window.__reply("wf_tickets"));
  await p.waitForTimeout(300);
  await p.locator(".nv-ol-item", { hasText: "Triage" }).first().click();
  await p.waitForTimeout(700);
};

await p.goto("http://localhost:8765/csp.html");
await p.waitForTimeout(900);
await p.locator(".nv-picker-item", { hasText: "Support tickets" }).click();
await p.waitForTimeout(900);
await open();

// ===== one row per property =====
const keys = () => card().locator(".nv-row.is-entry .nv-row-k").allInnerTexts();
const vals = () => card().locator(".nv-row.is-entry .nv-row-v").allInnerTexts();
ok((await keys()).join() === "priority,queue" && (await vals()).join() === "high,tier1", "each property is its own row: name, then value " + (await keys()).join());
ok((await card().locator(".nv-row-k", { hasText: /^Properties$/ }).count()) === 0, "no squeezed JSON row any more");
const [kColor, vBg] = await card().locator(".nv-row.is-entry").first().evaluate((r) => [getComputedStyle(r.querySelector(".nv-row-k")).color, getComputedStyle(r.querySelector(".nv-row-v")).backgroundColor]);
ok(kColor !== "rgb(255, 255, 255)" && vBg !== "rgba(0, 0, 0, 0)", `the name is grey (${kColor}), the value in its box (${vBg})`);
await card().screenshot({ path: out + "/h1-property-rows.png" });

// ===== highlighting =====
await p.evaluate(() => {
  const c = window.__defs.wf_tickets.stages[0].actions[0].task.commands[0];
  c.data.properties = { stage_due_at: "{{ _resource.date_uploaded }}", attempts: 3, urgent: true, meta: { a: 1 }, note: "plain text" };
});
await open();
const tokensIn = (name) => card().locator(".nv-row.is-entry", { has: p.locator(".nv-row-k", { hasText: new RegExp(`^${name}$`) }) }).locator(".nv-row-v .token");
ok((await tokensIn("stage_due_at").locator(".token.template-punctuation, .token.template").count()) > 0 || (await card().locator(".nv-row-v .token.template").count()) > 0, "a {{ template }} is highlighted");
ok((await tokensIn("attempts").first().getAttribute("class"))?.includes("number"), "a number is highlighted");
ok((await tokensIn("urgent").first().getAttribute("class"))?.includes("boolean"), "true / false is highlighted");
ok((await tokensIn("meta").count()) > 0, "a JSON value is highlighted");
ok((await tokensIn("note").count()) === 0, "plain text stays plain");
const tplColor = await card().locator(".nv-row-v .token.template").first().evaluate((e) => getComputedStyle(e).color);
ok(tplColor !== (await card().locator(".nv-row-v").last().evaluate((e) => getComputedStyle(e).color)), "and it has its own colour: " + tplColor);
await card().screenshot({ path: out + "/h2-highlighted.png" });

// ===== up to 10, then "+N more properties" =====
await p.evaluate(() => {
  const c = window.__defs.wf_tickets.stages[0].actions[0].task.commands[0];
  c.data.properties = Object.fromEntries(Array.from({ length: 12 }, (_, i) => [`field_${i + 1}`, `v${i + 1}`]));
});
await open();
ok((await card().locator(".nv-row.is-entry .nv-row-k").count()) === 10, "the first 10 properties show");
ok((await card().locator(".nv-more").innerText()).includes("+2 more properties"), "then +2 more properties");
const box = await card().boundingBox();
const next = await p.locator(".react-flow__node", { hasText: "Assign Owner" }).first().boundingBox();
ok(box && next && box.y + box.height <= next.y, "the taller card doesn't overlap the next step");

// ===== other cards are highlighted too, and still cut at 6 rows =====
await p.locator(".nv-ol-item", { hasText: "Escalate" }).first().click();
await p.waitForTimeout(700);
const sched = p.locator(".react-flow__node", { hasText: "Schedule Follow-up" }).first();
ok((await sched.locator(".nv-row-v .token.number").count()) > 0, "another step's number value is highlighted");
ok((await sched.locator(".nv-row-v .token").count()) > 1, "with its JSON and other values");
ok((await sched.locator(".nv-row:not(.nv-more)").count()) <= 6, "a step without a map still shows at most 6 rows");
await sched.screenshot({ path: out + "/h3-other-step.png" });

// ===== the side panel: a number value is coloured too =====
await sched.click();
await p.waitForTimeout(500);
ok((await p.locator(".fg-panel .nv-hl-pre .token.number").count()) > 0, "in the side panel a number value is highlighted too");

ok(errs.length === 0, "no page errors (" + errs.join(" | ") + ")");
await b.close();
