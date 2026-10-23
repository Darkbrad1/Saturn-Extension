// v0.3.50: the workflow map reads left to right (Global actions, then the stages, the commands under them); its
// boxes can be dragged and stay where they're put (kept per workflow by the extension), with Reset layout; the
// layers panel can be hidden and shown; a Create step's properties show (and are kept) in the side panel.
import { chromium } from "playwright";
const out = process.env.SHOTS ?? "shots";
const b = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
const errs = [];
p.on("pageerror", (e) => errs.push("pageerror: " + e.message));
p.on("console", (m) => /Content Security|Refused/.test(m.text()) && errs.push("CSP: " + m.text()));
const ok = (c, msg) => console.log((c ? "PASS " : "FAIL ") + msg);
const box = (sel) => p.locator(sel).first().boundingBox();
const nodeAt = (id) => p.locator(`.react-flow__node[data-id="${id}"]`);
const transform = (id) => nodeAt(id).evaluate((n) => n.style.transform);
const near = (a, b) => { const [x1, y1] = a.match(/-?[\d.]+/g).map(Number); const [x2, y2] = b.match(/-?[\d.]+/g).map(Number); return Math.abs(x1 - x2) < 1.5 && Math.abs(y1 - y2) < 1.5; };
const start = async () => {
  await p.goto("http://localhost:8765/csp.html?app");
  await p.waitForTimeout(1000);
  if (await p.locator(".nv-picker-item", { hasText: "Application" }).count()) {
    await p.locator(".nv-picker-item", { hasText: "Application" }).click();
    await p.waitForTimeout(900);
  }
};
await p.goto("http://localhost:8765/csp.html?app");
await p.evaluate(() => localStorage.removeItem("__mapLayouts"));
await start();

// ===== map: left to right =====
await p.locator(".nv-ol-workflow").click();
await p.waitForTimeout(1200);
const g = await box('.react-flow__node[data-id="global"]');
const draft = await box('.react-flow__node[data-id="stage:draft"]');
const submitted = await box('.react-flow__node[data-id="stage:submitted"]');
const cmd = await box(".mp-cmd");
const lastStage = await box('.react-flow__node[data-id="stage:withdrawn"]');
ok(g.x < draft.x && draft.x < submitted.x && Math.abs(g.y - draft.y) < 5, "Global actions first, then the stages, left to right");
ok(cmd.y > lastStage.y + lastStage.height && cmd.x >= draft.x - 5, "the commands are under the stages");
await p.screenshot({ path: out + "/v1-map.png" });

// ===== drag a box; it stays =====
const resetBtn = p.getByRole("button", { name: "Reset layout" });
ok(await resetBtn.isDisabled(), "Reset layout is off while nothing was moved");
const before = await transform("stage:draft");
const head = p.locator('.react-flow__node[data-id="stage:draft"] .mp-head');
const hb = await head.boundingBox();
await p.mouse.move(hb.x + 40, hb.y + 10);
await p.mouse.down();
await p.mouse.move(hb.x + 60, hb.y + 60, { steps: 5 });
await p.mouse.move(hb.x + 140, hb.y + 160, { steps: 10 });
await p.mouse.up();
await p.waitForTimeout(400);
const after = await transform("stage:draft");
ok(after !== before, `a stage box can be dragged (${before} → ${after})`);
const kept = await p.evaluate(() => JSON.parse(localStorage.getItem("__mapLayouts") || "{}"));
const wfId = await p.evaluate(() => window.__getDef().id);
ok(kept[wfId]?.["stage:draft"], "its place is kept by the extension, for this workflow");
ok(await resetBtn.isEnabled(), "Reset layout is on now");
ok((await p.locator(".mp-row", { hasText: "Submit" }).count()) >= 1 && (await p.locator('.react-flow__node[data-id="stage:draft"] .mp-row').count()) === 2, "the actions moved with their stage");

// a reload of the page: still there
await start();
await p.locator(".nv-ol-workflow").click();
await p.waitForTimeout(1200);
ok(near(await transform("stage:draft"), after), "after opening it again, the box is where it was put");
await p.screenshot({ path: out + "/v2-moved.png" });

// reset
await p.getByRole("button", { name: "Reset layout" }).click();
await p.waitForTimeout(500);
ok((await transform("stage:draft")) === before, "Reset layout puts it back");
ok(!(await p.evaluate((id) => JSON.parse(localStorage.getItem("__mapLayouts") || "{}")[id], wfId)), "and forgets the kept layout");

// clicks and double clicks still work on a draggable map
await p.locator(".mp-row", { hasText: "Assign Loan Officer" }).click();
await p.waitForTimeout(300);
ok((await p.locator(".mp-row.is-lit", { hasText: "Assign Loan Officer" }).count()) === 1, "a click still lights things up");

// ===== the layers panel =====
await p.locator(".nv-ol-collapse").click();
await p.waitForTimeout(200);
ok((await p.locator(".nv-outliner").count()) === 0 && (await p.locator(".nv-layers-open").isVisible()), "« hides the layers panel, leaving a strip");
await p.locator(".nv-layers-open").click();
await p.waitForTimeout(200);
ok((await p.locator(".nv-outliner").count()) === 1, "» brings it back");
const layersBtn = p.locator(".nv-topbar").getByRole("button", { name: "Layers" });
await layersBtn.click();
await p.waitForTimeout(200);
ok((await p.locator(".nv-outliner").count()) === 0, "the top bar's Layers button hides it too");
await p.locator(".nv-topbar").getByRole("button", { name: "List view" }).click();
await p.waitForTimeout(400);
await p.locator(".nv-launch").click();
await p.waitForTimeout(800);
ok((await p.locator(".nv-outliner").count()) === 0, "and it stays hidden next time the node view opens");
await p.locator(".nv-topbar").getByRole("button", { name: "Layers" }).click();
await p.waitForTimeout(200);
ok((await p.locator(".nv-outliner").count()) === 1, "Layers shows it again");

// ===== a Create step in the side panel =====
await p.locator(".nv-ol-item", { hasText: "Request documents" }).last().click();
await p.waitForTimeout(700);
await p.locator(".react-flow__node", { hasText: "DocumentRequest" }).first().click();
await p.waitForTimeout(600);
const panel = p.locator(".fg-panel");
ok((await panel.getByText("Properties", { exact: true }).count()) >= 1, "the side panel shows the Create step's Properties");
const names = await panel.locator(".nv-kv-item input.nv-kv-k").evaluateAll((els) => els.map((e) => e.value));
ok(names.includes("belongs_to") && names.includes("status"), "as names and values: " + names.join());
await p.screenshot({ path: out + "/v3-create-panel.png" });
// change one value: the step keeps its resource and every property (it used to lose properties on save)
const statusRow = panel.locator(".nv-kv-item", { has: p.locator('input.nv-kv-k[value="status"]') });
await statusRow.locator("input.nv-kv-v").fill("waiting");
await statusRow.locator("input.nv-kv-v").press("Enter");
await p.waitForTimeout(600);
const step = await p.evaluate(() => {
  const d = window.__getDef();
  const c = d.commands.find((x) => x.name === "request_documents");
  return c.command.commands[3].command.commands[0].data;
});
ok(step.properties.status === "waiting" && step.properties.belongs_to === "{{ _resource.id }}" && Object.keys(step.properties).length === 5 && step.resource === "DocumentRequest", "editing it saves the map, with the rest of the step kept: " + JSON.stringify(step));
ok(!errs.length, "no page errors " + JSON.stringify(errs));
await b.close();
