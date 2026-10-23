// v0.3.49: the node view's top bar (Reload, no "Node view" label), the breadcrumb on its own row with clickable
// steps, the side panel's collapse button, a Create step's properties as rows, and the workflow map (Workflow
// settings): stages with their actions, global actions, commands, the lines between them, click to highlight,
// double-click to open, the commands-calling-commands switch, and dragging a stage arrow to another stage.
// Uses the real Application workflow (harness/appflow.js, csp.html?app).
import { chromium } from "playwright";
const out = process.env.SHOTS ?? "shots";
const b = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
const errs = [];
p.on("pageerror", (e) => errs.push("pageerror: " + e.message));
p.on("console", (m) => /Content Security|Refused/.test(m.text()) && errs.push("CSP: " + m.text()));
const ok = (c, msg) => console.log((c ? "PASS " : "FAIL ") + msg);
const def = () => p.evaluate(() => JSON.parse(JSON.stringify(window.__getDef())));

await p.goto("http://localhost:8765/csp.html?app");
await p.waitForTimeout(1000);
await p.locator(".nv-picker-item", { hasText: "Application" }).click();
await p.waitForTimeout(900);

// ===== top bar =====
ok((await p.locator(".nv-topbar .nv-brand").count()) === 0 && !(await p.locator(".nv-topbar").innerText()).includes("Node view"), "no Node view label in the top bar");
const reload = p.locator(".nv-topbar").getByRole("button", { name: "Reload" });
ok((await reload.count()) === 1, "a Reload button in the top bar");
const before = await p.evaluate(() => window.__mockLog.length);
await reload.click();
await p.waitForTimeout(300);
ok((await p.evaluate((n) => window.__mockLog.slice(n), before)).includes("fetchWorkflow"), "Reload reads the workflow again");

// ===== breadcrumb row =====
await p.locator(".nv-ol-item", { hasText: "Assign Loan Officer" }).first().click();
await p.waitForTimeout(600);
await p.locator(".react-flow__node", { hasText: "Assign staff" }).first().click();
await p.keyboard.press("Tab");
await p.waitForTimeout(600);
const bar = p.locator(".nv-crumbbar");
const [topY, barY] = [(await p.locator(".nv-topbar").boundingBox()).y, (await bar.boundingBox()).y];
ok(barY > topY, "the breadcrumb is on its own row, under the top bar");
ok((await bar.innerText()).replace(/\s+/g, " ").includes("Application › Assign Loan Officer › Assign staff"), "it shows the way: " + (await bar.innerText()).replace(/\s+/g, " "));
await bar.getByRole("button", { name: "Assign Loan Officer" }).click();
await p.waitForTimeout(500);
ok(!(await bar.innerText()).includes("Assign staff") && (await p.locator(".react-flow__node", { hasText: "Write Store" }).count()) > 0, "clicking a step in it goes back to it");
await p.screenshot({ path: out + "/w1-bars.png", clip: { x: 0, y: 0, width: 1600, height: 120 } });

// ===== side panel collapse =====
await p.locator(".fg-collapse").click();
await p.waitForTimeout(200);
ok((await p.locator(".fg-panel").count()) === 0 && (await p.locator(".nv-panel-open").count()) === 1, "» hides the panel, leaving a strip");
await p.locator(".nv-panel-open").click();
await p.waitForTimeout(200);
ok((await p.locator(".fg-panel").count()) === 1, "« brings it back");

// ===== a Create step =====
await p.locator(".nv-ol-item", { hasText: "Request documents" }).last().click();
await p.waitForTimeout(700);
const create = p.locator(".react-flow__node", { hasText: "DocumentRequest" }).first();
const keys = await create.locator(".nv-row.is-entry .nv-row-k").allInnerTexts();
ok(keys.join() === "belongs_to,document_type,reason,requested_at,status", "a Create step shows each property as its own row: " + keys.join());

// ===== the map =====
await p.locator(".nv-ol-workflow").click();
await p.waitForTimeout(1200);
ok((await p.locator(".mp-root").count()) === 1, "Workflow settings shows the workflow map");
ok((await bar.innerText()).includes("Workflow settings"), "the breadcrumb says so");
ok((await p.locator(".mp-box").count()) === 14, "a box per stage, and one for the global actions");
ok((await p.locator(".mp-box", { has: p.locator(".mp-head", { hasText: /^Underwriting$/ }) }).locator(".mp-row").count()) === 5, "each with its actions");
ok((await p.locator(".mp-cmd").count()) === 14, "a box per command");
const moves = await p.locator(".react-flow__edge.mp-move").count();
const calls = await p.locator(".react-flow__edge.mp-call").count();
ok(moves >= 12 && calls >= 10, `arrows for stage moves (${moves}) and lines for commands run (${calls})`);
ok((await p.locator(".react-flow__edge.mp-cc").count()) === 0, "commands calling commands are off at first");
await p.screenshot({ path: out + "/w2-map.png" });

// click highlights
await p.locator(".mp-row", { hasText: "Assign Loan Officer" }).click();
await p.waitForTimeout(300);
ok((await p.locator(".mp-row.is-lit", { hasText: "Assign Loan Officer" }).count()) === 1 && (await p.locator(".mp-cmd.is-lit", { hasText: "Assign staff" }).count()) === 1, "a click lights the action and the command it runs");
ok((await p.locator(".mp-box.is-lit", { hasText: "Intake Review" }).count()) === 1, "and the stage it moves the record to");
ok((await p.locator(".react-flow__edge.is-dim").count()) > 10, "the other lines fade");
await p.screenshot({ path: out + "/w3-lit.png" });
await p.locator(".react-flow__pane").click({ position: { x: 20, y: 20 } });
await p.waitForTimeout(200);
ok((await p.locator(".mp-row.is-lit, .mp-cmd.is-lit").count()) === 0, "clicking the background clears it");

// the switch
await p.getByRole("switch", { name: /Commands calling commands/ }).check();
await p.waitForTimeout(300);
ok((await p.locator(".react-flow__edge.mp-cc").count()) >= 4, "the switch shows commands calling commands");
await p.getByRole("switch", { name: /Commands calling commands/ }).uncheck();

// drag Approve's arrow (to Approved) onto Submitted
const approveEdge = await p.evaluate(() => {
  const d = window.__getDef();
  return d.stages.find((s) => s.stage === "underwriting").actions.find((a) => a.action === "approve").id;
});
const edge = p.locator(`.react-flow__edge[data-id="move:s:underwriting:${approveEdge}:0"]`);
ok((await edge.count()) === 1, "Approve has an arrow");
await p.locator(".mp-box", { has: p.locator(".mp-head", { hasText: /^Underwriting$/ }) }).locator(".mp-row", { hasText: /^Approve$/ }).click();
await p.waitForTimeout(300);
ok((await p.locator(".react-flow__edge.mp-move .react-flow__edgeupdater-target").count()) === 1, "with Approve picked, only its arrow can be dragged");
const handle = edge.locator(".react-flow__edgeupdater-target");
const hb = await handle.boundingBox();
const target = await p.locator(".mp-box", { hasText: "Submitted" }).first().locator(".mp-in").boundingBox();
await p.mouse.move(hb.x + hb.width / 2, hb.y + hb.height / 2);
await p.mouse.down();
await p.mouse.move(hb.x + 30, hb.y + 30, { steps: 5 });
await p.mouse.move(target.x + target.width / 2, target.y + target.height / 2, { steps: 4 });
await p.mouse.up();
await p.waitForTimeout(600);
const approve = (await def()).stages.find((s) => s.stage === "underwriting").actions.find((a) => a.action === "approve");
const pu = approve.task.commands.find((c) => c.operator === "property_updater");
ok(pu.data.properties.status === "submitted" && pu.data._properties[0].value === "submitted", "dragging the arrow to Submitted makes Approve move the record there (properties and _properties)");
ok((await p.locator(".nv-draft").innerText()).includes("unsaved"), "as an unsaved change");

// double-click opens
await p.locator(".mp-row", { hasText: "Assign Loan Officer" }).dblclick();
await p.waitForTimeout(700);
ok((await p.locator(".mp-root").count()) === 0 && (await bar.innerText()).includes("Assign Loan Officer"), "a double-click opens the action (the map closes)");
await p.locator(".nv-ol-workflow").click();
await p.waitForTimeout(800);
await p.locator(".mp-cmd", { hasText: "Assign staff" }).dblclick();
await p.waitForTimeout(700);
ok((await bar.innerText()).includes("Assign staff"), "and a command too");

ok(!errs.length, "no page errors " + JSON.stringify(errs));
await b.close();
