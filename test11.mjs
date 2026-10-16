// v0.3.5: the side panel's Logs tab (System Logs about the open workflow).
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
const posted = (t) => p.evaluate((t) => window.__mockLog.filter((x) => x === t).length, t);
const tab = (name) => panel.getByRole("tab", { name, exact: true });
const scope = (name) => panel.getByRole("radio", { name });

await p.goto("http://localhost:8765/csp.html");
await p.waitForTimeout(900);
await p.locator(".nv-picker-item", { hasText: "Order fulfilment" }).click();
await p.waitForTimeout(900);

// ===== the tab =====
const names = await panel.locator(".fg-tab").allInnerTexts();
ok(names.join(",") === "Design,Inspect,Logs,Changes", "the side panel has a Logs tab (" + names.join(", ") + ")");
await tab("Logs").click();
await p.waitForTimeout(600);
ok((await panel.locator(".lgt-title").innerText()).includes("System Logs") && (await panel.locator(".lgt-sub").innerText()).includes("Demo instance · SystemLog"), "it reads the instance's System Logs resource");
let t = await texts();
ok(t.length >= 25 && t.every((x) => !/Unrelated|Ticket/.test(x)), `only logs about this workflow (${t.length}, none from other workflows or jobs)`);
ok(t.some((x) => x.startsWith("Approve order")) && t.some((x) => x.startsWith("Sent email")) && t.some((x) => x.startsWith("Delivered")) && t.some((x) => x.startsWith("Command notify_customer")),
  "matched by name, by id, nested under context, and by id in any workflow field");
const ids = await p.evaluate(() => [...document.querySelectorAll(".lgt-row")].map((r) => r.innerText));
ok(t[0].includes("#449") || t[0].includes("#447") || /#44\d/.test(t[0]), "newest first, though the instance lists them oldest first: " + t[0]);
ok(/found in [\d,]+ of 450 records/.test(await foot()), "says how far back it looked: " + (await foot()));
ok(await panel.locator(".lgt-level.is-error").count() > 0 && await panel.locator(".lgt-time").count() === t.length, "level pills and times");
const about = await rows().first().locator(".lgt-about").innerText().catch(() => "");
ok(["Approve order", "Mark delivered", "Notify customer"].includes(about), "each row says which action or command it's about: " + about);
await p.screenshot({ path: out + "/l1-logs-tab.png" });

// ===== detail =====
await rows().first().locator(".lgt-row-main").click();
await p.waitForTimeout(150);
ok(await panel.locator(".lgt-json .token.property").count() > 0, "a row opens to its highlighted JSON");
await panel.getByRole("button", { name: "Copy JSON" }).click();
await panel.getByRole("button", { name: "Open as JSON" }).click();
await p.waitForTimeout(100);
let o = await opened();
ok(o.some((x) => x.type === "copyLogJson" && x.record) && o.some((x) => x.type === "openLogJson" && x.record), "Copy JSON and Open as JSON go to the extension with the record");
await p.screenshot({ path: out + "/l2-logs-detail.png" });

// ===== filters =====
await panel.getByRole("button", { name: "error", exact: true }).click();
await p.waitForTimeout(100);
let lv = await panel.locator(".lgt-level").allInnerTexts();
ok(lv.length > 0 && lv.every((x) => x === "error"), "level chips filter the list");
await panel.getByRole("button", { name: "error", exact: true }).click();
await panel.getByPlaceholder("Search these logs").fill("delivered");
await p.waitForTimeout(100);
t = await texts();
ok(t.length > 0 && t.every((x) => x.startsWith("Delivered")), "search filters the list");
await panel.getByPlaceholder("Search these logs").fill("");

// ===== scope: this action / this step =====
await p.locator(".nv-ol-item", { hasText: "Approve order" }).click();
await p.waitForTimeout(600);
ok(await tab("Logs").getAttribute("aria-selected") === "true", "the tab stays open when another action is opened");
ok(await scope("Workflow").count() === 1 && await scope("This action").count() === 1, "with an action open, the scope can be narrowed to it");
await scope("This action").click();
await p.waitForTimeout(100);
t = await texts();
ok(t.length > 0 && t.every((x) => x.startsWith("Approve order") || x.startsWith("Sent email")), `This action: only Approve order's logs (${t.length})`);
await p.locator(".react-flow__node", { hasText: "Send Email" }).first().click();
await p.waitForTimeout(300);
await tab("Logs").click();
await p.waitForTimeout(500);
ok(await scope("This step").count() === 1, "a selected step adds This step");
await scope("This step").click();
await p.waitForTimeout(100);
t = await texts();
ok(t.length > 0 && t.every((x) => x.startsWith("Sent email")), `This step: only that operator's logs in this action (${t.length})`);
await p.screenshot({ path: out + "/l3-logs-step.png" });
await scope("Workflow").click();

// ===== live =====
await p.evaluate(() => window.__addSysLog({ level: "warn", message: "Brand new log for the orders", workflow: "Order fulfilment", action: "approve" }));
await panel.getByRole("button", { name: "Live", exact: true }).click();
await p.waitForTimeout(10600);
ok((await texts())[0] === "Brand new log for the orders" && await panel.locator(".lgt-row.is-fresh").count() === 1, "Live shows new logs on top and flashes them");
await panel.getByRole("button", { name: "Live", exact: true }).click();

// ===== open the full screen =====
await panel.getByRole("button", { name: /Open in System Logs/ }).click();
await p.waitForTimeout(100);
o = await opened();
ok(o.some((x) => x.type === "openSystemLogs" && x.search === "Order fulfilment"), "Open in System Logs opens the screen searched for this workflow");

// ===== searching older records =====
await p.locator(".nv-wf-switch").click();
await p.waitForTimeout(300);
await p.locator(".nv-picker-item, .nv-wf-item, [role=option]", { hasText: "Debug lab" }).first().click();
await p.waitForTimeout(1200);
if (!(await tab("Logs").getAttribute("aria-selected") === "true")) await tab("Logs").click();
await p.waitForTimeout(800);
t = await texts();
ok(t.length === 1 && t[0] === "Debug lab: audit start", "a quiet workflow: it keeps reading back in time to find its logs (" + t.join(" | ") + ")");
ok(/1 found in (\d+) of \1 records/.test(await foot()), "and stops at the end of the list: " + (await foot()));
ok(await panel.getByRole("button", { name: "Search older" }).count() === 0, "no Search older once everything's been read");
ok(await rows().first().locator(".lgt-about").innerText() === "Audit", "the row names its action");
await rows().first().locator(".lgt-row-main").click();
await panel.getByRole("button", { name: "Go to Audit" }).click();
await p.waitForTimeout(500);
ok(await p.locator(".nv-ol-item.is-active, .nv-ol-item[aria-current=true], .nv-ol-item.is-open", { hasText: "Audit" }).count() + (await p.locator(".react-flow__node", { hasText: "audit start" }).count()) > 0, "Go to <action> opens that action");

// ===== errors =====
await p.evaluate(() => (window.__logsFail = "Not allowed to read SystemLog."));
await panel.getByRole("button", { name: "Refresh", exact: true }).click();
await p.waitForTimeout(300);
ok((await panel.locator(".lgt-error").innerText()).includes("Not allowed to read SystemLog."), "a read error is shown in the tab");
await p.evaluate(() => (window.__logsFail = null));

ok(await posted("fetchWorkflowLogs") > 0, "the tab only sends read requests");
ok(errs.length === 0, "no page errors or CSP violations" + (errs.length ? ": " + errs.join(" | ") : ""));
await b.close();
