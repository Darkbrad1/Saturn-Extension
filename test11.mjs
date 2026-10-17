// v0.3.5: the side panel's Logs tab (System Logs about the open workflow).
// v0.3.8: records shaped like the real SystemLog resource (a copy of the workflow, the step
// that wrote it in `task`), the workflow.id server filter with a fallback, steps matched by id.
import { chromium } from "playwright";
const out = process.env.SHOTS ?? "/tmp/claude-0/-home-claude/a083e21d-6637-5cac-92a5-bbf1f2d008b9/scratchpad/shots";
const b = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs = [];
p.on("pageerror", (e) => errs.push("pageerror: " + e.message));
p.on("console", (m) => /Content Security|Refused/.test(m.text()) && errs.push("CSP: " + m.text()));
const ok = (c, msg) => console.log((c ? "PASS " : "FAIL ") + msg);
const panel = p.locator(".fg-panel");
const rows = () => panel.locator(".lgt-row");
const texts = () => rows().locator(".lgt-msg").allInnerTexts();
const foot = () => panel.locator(".lgt-foot").innerText();
const opened = () => p.evaluate(() => window.__opened ?? []);
const filters = () => p.evaluate(() => window.__logFilters ?? []);
const posted = (t) => p.evaluate((t) => window.__mockLog.filter((x) => x === t).length, t);
const tab = (name) => panel.getByRole("tab", { name, exact: true });
const scope = (name) => panel.getByRole("radio", { name });
const refresh = async () => { await panel.getByRole("button", { name: "Refresh", exact: true }).click(); await p.waitForTimeout(700); };
const setMock = (k, v) => p.evaluate(([k, v]) => (window[k] = v), [k, v]);

await p.goto("http://localhost:8765/csp.html");
await p.waitForTimeout(900);
await p.locator(".nv-picker-item", { hasText: "Order fulfilment" }).click();
await p.waitForTimeout(900);

// ===== the tab, with the instance filtering by workflow.id =====
const names = await panel.locator(".fg-tab").allInnerTexts();
ok(names.join(",") === "Design,Inspect,Logs,Changes", "the side panel has a Logs tab (" + names.join(", ") + ")");
await tab("Logs").click();
await p.waitForTimeout(700);
ok((await panel.locator(".lgt-sub").innerText()).includes("Demo instance · SystemLog"), "it reads the instance's SystemLog resource");
ok((await filters())[0] === 'workflow.id = "wf_orders"', "it asks the instance for this workflow's logs: " + (await filters())[0]);
let t = await texts();
ok(t.length === 200 && t.every((x) => /^(Approve order|Reject order|Mark delivered|Resend invoice|Notify customer): /.test(x)), `only logs about this workflow (${t.length}, none from tickets or unrelated jobs)`);
ok(/#44\d/.test(t[0]), "newest first, though the instance lists them oldest first: " + t[0]);
ok(/^200 of 225 logs/.test(await foot()) && (await panel.getByRole("button", { name: "Load older" }).count()) === 1, "says how many there are, with Load older: " + (await foot()).split("\n")[0]);
const about = await rows().first().locator(".lgt-about").innerText();
ok(/^(Approve order|Reject order|Mark delivered|Resend invoice|Notify customer) · /.test(about) && about.split(" · ")[0] === t[0].split(":")[0], "each row names the action and step that wrote it (from its task id): " + about);
await panel.getByRole("button", { name: "Load older" }).click();
await p.waitForTimeout(500);
ok((await texts()).length === 225 && /^225 of 225 logs/.test(await foot()), "Load older reads the rest");
await p.screenshot({ path: out + "/l1-logs-tab.png" });

// ===== detail =====
await rows().first().locator(".lgt-row-main").click();
await p.waitForTimeout(150);
let json = await panel.locator(".lgt-json").last().innerText();
ok(await panel.locator(".lgt-json .token.property").count() > 0, "a row opens to its highlighted JSON");
ok(json.includes("the full workflow definition is left out here") && !json.includes('"stages"') && !json.includes("_permissions_"), "the record's copy of the workflow and its permission lists are trimmed");
await panel.getByRole("button", { name: "Copy JSON" }).click();
await panel.getByRole("button", { name: "Open as JSON" }).click();
await p.waitForTimeout(100);
let o = await opened();
ok(o.some((x) => x.type === "copyLogJson" && x.record) && o.some((x) => x.type === "openLogJson" && x.record), "Copy JSON and Open as JSON go to the extension with the record");
await rows().first().locator(".lgt-row-main").click();

// ===== filters =====
await panel.getByRole("button", { name: "error", exact: true }).click();
await p.waitForTimeout(100);
let lv = await panel.locator(".lgt-level").allInnerTexts();
ok(lv.length > 0 && lv.every((x) => x === "error"), "level chips filter the list");
await rows().first().locator(".lgt-row-main").click();
await p.waitForTimeout(100);
ok((await panel.locator(".lgt-trace").innerText()).startsWith("Error:"), "an error's trace is shown above its JSON");
await p.screenshot({ path: out + "/l2-logs-detail.png" });
await rows().first().locator(".lgt-row-main").click();
await panel.getByRole("button", { name: "error", exact: true }).click();
await panel.getByPlaceholder("Search these logs").fill("Mark delivered");
await p.waitForTimeout(100);
t = await texts();
ok(t.length > 0 && t.every((x) => x.startsWith("Mark delivered")), "search filters the list (it doesn't match every record through its copy of the workflow)");
await panel.getByPlaceholder("Search these logs").fill("");

// ===== scope: this action / this step, by step id =====
await p.locator(".nv-ol-item", { hasText: "Approve order" }).click();
await p.waitForTimeout(600);
ok(await tab("Logs").getAttribute("aria-selected") === "true", "the tab stays open when another action is opened");
await scope("This action").click();
await p.waitForTimeout(100);
t = await texts();
ok(t.length > 0 && t.every((x) => /^(Approve order|Notify customer): /.test(x)) && t.some((x) => x.startsWith("Notify customer")),
  `This action: the steps Approve order runs, including the Notify customer command it calls (${t.length}) — not every log, though each holds the whole workflow`);
await p.locator(".react-flow__node", { hasText: "Send Email" }).first().click();
await p.waitForTimeout(300);
await tab("Logs").click();
await p.waitForTimeout(500);
await scope("This step").click();
await p.waitForTimeout(100);
t = await texts();
ok(t.length > 0 && t.every((x) => x.startsWith("Approve order: Send Email")), `This step: only that very step's logs, not the other Send Email steps (${t.length})`);
await p.screenshot({ path: out + "/l3-logs-step.png" });
await scope("Workflow").click();

// ===== live =====
await p.evaluate(() => window.__addSysLog({ log_type: "warn", name: "Debug", message: "Brand new log for the orders", workflow: { id: "wf_orders", name: "Order fulfilment" }, task: "{}" }));
await panel.getByRole("button", { name: "Live", exact: true }).click();
await p.waitForTimeout(10600);
ok((await texts())[0] === "Brand new log for the orders" && await panel.locator(".lgt-row.is-fresh").count() === 1, "Live shows new logs on top and flashes them");
await panel.getByRole("button", { name: "Live", exact: true }).click();

// ===== open the full screen =====
await panel.getByRole("button", { name: /Open in System Logs/ }).click();
await p.waitForTimeout(100);
o = await opened();
ok(o.some((x) => x.type === "openSystemLogs" && x.filter === 'workflow.id = "wf_orders"'), "Open in System Logs opens the screen filtered to this workflow");

// ===== an instance that refuses the filter, or ignores it =====
await setMock("__filterRejected", true);
await refresh();
t = await texts();
ok(t.length >= 25 && t.every((x) => /^(Approve order|Reject order|Mark delivered|Resend invoice|Notify customer): |^Brand new log/.test(x)) && /found in [\d,]+ of 451 records/.test(await foot()),
  "refused: it falls back to reading the newest records and matching them here: " + (await foot()).split("\n")[0]);
ok(await panel.locator(".lgt-error").count() === 0, "without showing an error for the refused filter");
await panel.getByRole("button", { name: /Open in System Logs/ }).click();
await p.waitForTimeout(100);
o = await opened();
ok(o.at(-1).search === "Order fulfilment" && !o.at(-1).filter, "and Open in System Logs searches by name instead");
await setMock("__filterRejected", false);
await setMock("__filterIgnored", true);
await p.evaluate(() => (window.__logFilters = []));
await p.locator(".nv-wf-switch").click();
await p.waitForTimeout(300);
await p.locator(".nv-picker-item, .nv-wf-item, [role=option]", { hasText: "Support tickets" }).first().click();
await p.waitForTimeout(1200);
if (!(await tab("Logs").getAttribute("aria-selected") === "true")) await tab("Logs").click();
await p.waitForTimeout(800);
t = await texts();
ok(t.length > 0 && t.every((x) => /^(Triage|Escalate): /.test(x)), `ignored: other workflows' records are still left out (${t.length})`);
await setMock("__filterIgnored", false);

// ===== a quiet workflow =====
await p.locator(".nv-wf-switch").click();
await p.waitForTimeout(300);
await p.locator(".nv-picker-item, .nv-wf-item, [role=option]", { hasText: "Debug lab" }).first().click();
await p.waitForTimeout(1200);
if (!(await tab("Logs").getAttribute("aria-selected") === "true")) await tab("Logs").click();
await p.waitForTimeout(800);
t = await texts();
ok(t.length === 1 && t[0] === "Audit: Debug ran (#3)" && /^1 of 1 logs/.test(await foot()), "the filter finds a quiet workflow's only log at once: " + t.join(" | "));
ok(await rows().first().locator(".lgt-about").innerText() === "Audit · Debug", "the row names its action and step");
await setMock("__filterRejected", true);
await refresh();
t = await texts();
ok(t.length === 1 && /1 found in (\d+) of \1 records/.test(await foot()), "without the filter it reads back to the end to find it: " + (await foot()).split("\n")[0]);
await setMock("__filterRejected", false);
await rows().first().locator(".lgt-row-main").click();
await panel.getByRole("button", { name: "Go to Audit" }).click();
await p.waitForTimeout(500);
ok(await p.locator(".react-flow__node", { hasText: "audit start" }).count() > 0, "Go to <action> opens that action");

// ===== errors =====
await setMock("__logsFail", "Not allowed to read SystemLog.");
await refresh();
ok((await panel.locator(".lgt-error").innerText()).includes("Not allowed to read SystemLog."), "a read error is shown in the tab");
await setMock("__logsFail", null);

ok(await posted("fetchWorkflowLogs") > 0, "the tab only sends read requests");
ok(errs.length === 0, "no page errors or CSP violations" + (errs.length ? ": " + errs.join(" | ") : ""));
await b.close();
