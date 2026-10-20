// v0.3.5: the side panel's Logs tab (System Logs about the open workflow).
// v0.3.8: records shaped like the real SystemLog resource (a copy of the workflow, the step
// that wrote it in `task`), the workflow.id server filter with a fallback, steps matched by id.
// v0.3.9: only ever the newest 10 logs; Live checks at once and says when it last checked;
// a list that isn't in date order is flagged.
// v0.3.10: messages formatted (JSON values in them pretty-printed, one block each).
import { chromium } from "playwright";
const out = process.env.SHOTS ?? "shots";
const b = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs = [];
p.on("pageerror", (e) => errs.push("pageerror: " + e.message));
p.on("console", (m) => /Content Security|Refused/.test(m.text()) && errs.push("CSP: " + m.text()));
const ok = (c, msg) => console.log((c ? "PASS " : "FAIL ") + msg);
const panel = p.locator(".fg-panel");
const rows = () => panel.locator(".lgt-row");
const texts = () => rows().locator(".lgt-msg").allInnerTexts();
const foot = async () => (await panel.locator(".lgt-foot").innerText()).split("\n")[0];
const opened = () => p.evaluate(() => window.__opened ?? []);
const filters = () => p.evaluate(() => window.__logFilters ?? []);
const posted = (t) => p.evaluate((t) => window.__mockLog.filter((x) => x === t).length, t);
const tab = (name) => panel.getByRole("tab", { name, exact: true });
const scope = (name) => panel.getByRole("radio", { name });
const refresh = async () => { await panel.getByRole("button", { name: "Refresh", exact: true }).click(); await p.waitForTimeout(600); };
const setMock = (k, v) => p.evaluate(([k, v]) => (window[k] = v), [k, v]);
const openWf = async (name) => {
  await p.locator(".nv-wf-switch").click();
  await p.waitForTimeout(300);
  await p.locator(".nv-picker-item, .nv-wf-item, [role=option]", { hasText: name }).first().click();
  await p.waitForTimeout(1200);
  if (!((await tab("Logs").getAttribute("aria-selected")) === "true")) await tab("Logs").click();
  await p.waitForTimeout(700);
};
// log from a given step of a mock workflow (by the tree it's in and the operator's title)
const logFrom = (wfId, treeLabel, opName, message, extra = {}) =>
  p.evaluate(([wfId, treeLabel, opName, message, extra]) => {
    const d = window.__defs[wfId];
    const trees = [...d.stages.flatMap((s) => s.actions.map((a) => [a.label, a.task])), ...d.actions.map((a) => [a.label, a.task]), ...d.commands.map((c) => [c.label, c.command])];
    const find = (n) => { if (!n || typeof n !== "object") return null; if (n.type === "command" && n.operator === opName) return n;
      for (const k of ["commands", "command", "true", "false"]) { const c = n[k]; const r = Array.isArray(c) ? c.map(find).find(Boolean) : find(c); if (r) return r; } return null; };
    const st = find(trees.find(([l]) => l === treeLabel)[1]);
    window.__addSysLog({ log_type: "info", name: opName, message, task: JSON.stringify(st), workflow: structuredClone(d), ...extra });
  }, [wfId, treeLabel, opName, message, extra]);

await p.goto("http://localhost:8765/csp.html");
await p.waitForTimeout(900);
await p.locator(".nv-picker-item", { hasText: "Order fulfilment" }).click();
await p.waitForTimeout(900);

// ===== the tab: this workflow's newest 10 =====
const names = await panel.locator(".fg-tab").allInnerTexts();
ok(names.join(",") === "Design,Inspect,Form,Logs,Changes", "the side panel has a Logs tab (" + names.join(", ") + ")");
await tab("Logs").click();
await p.waitForTimeout(700);
ok((await panel.locator(".lgt-sub").innerText()).includes("Demo instance · SystemLog"), "it reads the instance's SystemLog resource");
ok((await filters())[0] === 'workflow.id = "wf_orders"', "it asks the instance for this workflow's logs: " + (await filters())[0]);
let t = await texts();
ok(t.length === 10 && t.every((x) => /^(Approve order|Reject order|Mark delivered|Resend invoice|Notify customer): /.test(x)), `only this workflow's logs, and only the newest 10 (${t.length})`);
ok(/#449/.test(t[0]), "newest first: " + t[0]);
ok((await foot()) === "The newest 10 of 225 logs", "says so: " + (await foot()));
ok((await panel.getByRole("button", { name: /Load older|Search older/ }).count()) === 0, "no older pages to load");
const about = await rows().first().locator(".lgt-about").innerText();
ok(/ · /.test(about) && about.split(" · ")[0] === t[0].split(":")[0], "each row names the action and step that wrote it (from its task id): " + about);
await p.screenshot({ path: out + "/l1-logs-tab.png" });

// ===== detail =====
await rows().first().locator(".lgt-row-main").click();
await p.waitForTimeout(150);
const json = await panel.locator(".lgt-whole .lgt-json").evaluate((e) => e.textContent);
ok((await panel.locator(".lgt-json .token.property").count()) > 0, "a row opens to its highlighted JSON");
ok(json.includes("the full workflow definition is left out here") && !json.includes('"stages"') && !json.includes("_permissions_"), "the record's copy of the workflow and its permission lists are trimmed");
await panel.getByRole("button", { name: "Copy JSON" }).click();
await panel.getByRole("button", { name: "Open as JSON" }).click();
await p.waitForTimeout(100);
let o = await opened();
ok(o.some((x) => x.type === "copyLogJson" && x.record) && o.some((x) => x.type === "openLogJson" && x.record), "Copy JSON and Open as JSON go to the extension with the record");
await rows().first().locator(".lgt-row-main").click();

// ===== the message, formatted (v0.3.10) =====
const flowObj = { belongs_to: { name: "INTAKE TEST", party: { id: "party-1", kind: "PERSON" } }, id: "documentrequest-1", status: "pending review", note: "a } and a [ inside a string" };
const debugMsg = `const flow = ${JSON.stringify(flowObj)}; const store = ${JSON.stringify({ documentRequest: { id: "documentrequest-1" } })}; const resource = ${JSON.stringify({ type: "upload", tags: [], url: "https://x.example/a?b=c" })};`;
await logFrom("wf_orders", "Approve order", "update_record", debugMsg, { log_type: "debug", name: "Debug" });
await refresh();
t = await texts();
ok(t[0] === "flow {4 keys} · store {1 key} · resource {3 keys}", "a debug message is summed up in its row by the values in it: " + t[0]);
await rows().first().locator(".lgt-row-main").click();
await p.waitForTimeout(150);
const parts = await panel.locator(".lgm-value summary .lgm-name").allInnerTexts();
ok(parts.join(",") === "flow,store,resource", "opened, each value gets its own block, named after it: " + parts.join(", "));
const flowJson = await panel.locator(".lgm-value").first().locator(".lgm-json").innerText();
ok(flowJson.split("\n").length > 8 && flowJson.includes('"note": "a } and a [ inside a string"') && (await panel.locator(".lgm-value").first().locator(".token.property").count()) > 0, "pretty-printed and highlighted (brackets inside strings don't confuse it)");
await panel.locator(".lgm-value").first().locator(".lgm-link", { hasText: "Copy" }).click();
await p.waitForTimeout(100);
o = await opened();
ok(o.at(-1).type === "copyLogJson" && o.at(-1).record.id === "documentrequest-1", "each value can be copied on its own");
ok((await panel.locator(".lgt-whole").count()) === 1 && !(await panel.locator(".lgt-whole").evaluate((d) => d.open)), "the whole record is still there, folded away under the message");
await p.screenshot({ path: out + "/l4-message.png" });
await rows().first().locator(".lgt-row-main").click();

// ===== level chips, trace and search =====
await logFrom("wf_orders", "Mark delivered", "http_request", "Mark delivered: HTTP Request failed", { log_type: "error", trace: "Error: 502 from the warehouse\n    at step" });
await refresh();
await panel.getByRole("button", { name: "error", exact: true }).click();
await p.waitForTimeout(100);
const lv = await panel.locator(".lgt-level").allInnerTexts();
ok(lv.length > 0 && lv.every((x) => x === "error"), "level chips filter the list");
await rows().first().locator(".lgt-row-main").click();
await p.waitForTimeout(100);
ok((await panel.locator(".lgt-trace").innerText()).startsWith("Error: 502"), "an error's trace is shown above its JSON");
await p.screenshot({ path: out + "/l2-logs-detail.png" });
await rows().first().locator(".lgt-row-main").click();
await panel.getByRole("button", { name: "error", exact: true }).click();
await panel.getByPlaceholder("Search these logs").fill("Mark delivered");
await p.waitForTimeout(100);
t = await texts();
ok(t.length > 0 && t.every((x) => x.startsWith("Mark delivered")), "search filters the list (not every record through its copy of the workflow)");
await panel.getByPlaceholder("Search these logs").fill("");

// ===== scope: this action / this step, by step id =====
await logFrom("wf_orders", "Approve order", "send_email", "Approve order: VIP email sent");
await logFrom("wf_orders", "Notify customer", "send_email", "Notify customer: email sent");
await logFrom("wf_orders", "Approve order", "update_record", "Approve order: record updated");
await logFrom("wf_orders", "Reject order", "send_email", "Reject order: email sent");
await p.locator(".nv-ol-item", { hasText: "Approve order" }).click();
await p.waitForTimeout(600);
ok((await tab("Logs").getAttribute("aria-selected")) === "true", "the tab stays open when another action is opened");
await refresh();
await scope("This action").click();
await p.waitForTimeout(100);
t = await texts();
ok(t.includes("Approve order: VIP email sent") && t.includes("Notify customer: email sent") && t.includes("Approve order: record updated") && !t.includes("Reject order: email sent"),
  `This action: the steps Approve order runs, incl. the Notify customer command it calls — not Reject order's (${t.join(" | ")})`);
await p.locator(".react-flow__node", { hasText: "Send Email" }).first().click();
await p.waitForTimeout(300);
await tab("Logs").click();
await p.waitForTimeout(500);
await scope("This step").click();
await p.waitForTimeout(100);
t = await texts();
ok(t.length >= 1 && t.every((x) => x === "Approve order: VIP email sent"), `This step: only that very step's logs, not the other Send Email steps (${t.join(" | ")})`);
await p.screenshot({ path: out + "/l3-logs-step.png" });
await scope("Workflow").click();

// ===== live =====
await setMock("__logFilters", []);
await panel.getByRole("button", { name: "Live", exact: true }).click();
await p.waitForTimeout(400);
ok((await filters()).length === 1 && /checked \d+ s ago/.test(await panel.locator(".lgt-sub").innerText()), "turning Live on checks at once and says when it checked: " + (await panel.locator(".lgt-sub").innerText()));
await logFrom("wf_orders", "Resend invoice", "send_email", "Brand new log for the orders");
await p.waitForTimeout(10500);
t = await texts();
ok(t[0] === "Brand new log for the orders" && (await panel.locator(".lgt-row.is-fresh").count()) === 1 && t.length === 10, "Live shows a new log on top, flashes it, and keeps the newest 10");
await panel.getByRole("button", { name: "Live", exact: true }).click();

// ===== open the full screen =====
await panel.getByRole("button", { name: /Open in System Logs/ }).click();
await p.waitForTimeout(100);
o = await opened();
ok(o.some((x) => x.type === "openSystemLogs" && x.filter === 'workflow.id = "wf_orders"'), "Open in System Logs opens the screen filtered to this workflow");

// ===== an instance that doesn't list logs in date order =====
await setMock("__unordered", true);
await refresh();
ok((await panel.locator(".fg-hint.is-warn").innerText()).includes("may not be the newest"), "a list that isn't in date order is flagged");
await setMock("__unordered", false);
await refresh();
ok((await panel.locator(".fg-hint.is-warn").count()) === 0, "and not otherwise");

// ===== an instance that refuses the filter =====
await setMock("__filterRejected", true);
await refresh();
t = await texts();
ok(t.length <= 10 && t.every((x) => /^(Approve order|Reject order|Mark delivered|Resend invoice|Notify customer): |^Brand new|^flow \{/.test(x)) && /of the newest 10 logs on the instance$/.test(await foot()),
  "refused: it keeps this workflow's among the instance's newest 10: " + (await foot()));
ok((await panel.locator(".lgt-error").count()) === 0, "without showing an error for the refused filter");
await panel.getByRole("button", { name: /Open in System Logs/ }).click();
await p.waitForTimeout(100);
o = await opened();
ok(o.at(-1).search === "Order fulfilment" && !o.at(-1).filter, "and Open in System Logs searches by name instead");

// ===== a quiet workflow =====
await openWf("Debug lab");
ok((await texts()).length === 0 && /None of the 10 newest logs on the instance are about Debug lab/.test(await panel.locator(".lgt").innerText()), "without the filter a quiet workflow's old log isn't found — it says why");
await setMock("__filterRejected", false);
await refresh();
t = await texts();
ok(t.length === 1 && t[0] === "Audit: Debug ran (#3)" && (await foot()) === "The newest 1 of 1 logs", "with the filter its only log is found at once: " + t.join(" | "));
ok((await rows().first().locator(".lgt-about").innerText()) === "Audit · Debug", "the row names its action and step");
await rows().first().locator(".lgt-row-main").click();
await panel.getByRole("button", { name: "Go to Audit" }).click();
await p.waitForTimeout(500);
ok((await p.locator(".react-flow__node", { hasText: "audit start" }).count()) > 0, "Go to <action> opens that action");

// ===== errors =====
await setMock("__logsFail", "Not allowed to read SystemLog.");
await refresh();
ok((await panel.locator(".lgt-error").innerText()).includes("Not allowed to read SystemLog."), "a read error is shown in the tab");
await setMock("__logsFail", null);

ok((await posted("fetchWorkflowLogs")) > 0, "the tab only sends read requests");
ok(errs.length === 0, "no page errors or CSP violations" + (errs.length ? ": " + errs.join(" | ") : ""));
await b.close();
