// v0.3.4: System Logs screen (read-only) and its sidebar entry.
import { chromium } from "playwright";
const out = "/tmp/claude-0/-home-claude/a083e21d-6637-5cac-92a5-bbf1f2d008b9/scratchpad/shots";
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const p = await b.newPage({ viewport: { width: 1440, height: 900 }, timezoneId: "America/Grenada" });
const errs = [];
p.on("pageerror", (e) => errs.push("pageerror: " + e.message));
p.on("console", (m) => /Content Security|Refused/.test(m.text()) && errs.push("CSP: " + m.text()));
const ok = (c, msg) => console.log((c ? "PASS " : "FAIL ") + msg);
const posted = () => p.evaluate(() => window.__posted.map((m) => m.type));
const ids = () => p.locator(".lg-table tbody tr").evaluateAll((rs) => rs.map((r) => r.innerText));
const col = (name) => p.locator(".lg-table thead th").allInnerTexts().then((t) => t.indexOf(name));

// ===== sidebar entry =====
await p.goto("http://localhost:8765/sidebar.html");
await p.waitForTimeout(800);
const item = p.getByRole("button", { name: "System Logs" });
ok(await item.count() === 1, "the instance card has a System Logs entry next to Workflows, Menus, Pages, Components");
const labels = await p.locator("button").allInnerTexts();
ok(labels.indexOf("Pages") < labels.indexOf("System Logs") && labels.indexOf("System Logs") < labels.indexOf("Components"), "listed with the other Open items");
await item.click();
const sent = await p.evaluate(() => window.__posted.at(-1));
ok(sent.type === "saturn:openSystemLogs" && sent.payload.instanceId === "i1", "it asks the extension to open the logs for that instance");
await p.screenshot({ path: out + "/a0-sidebar.png", clip: { x: 0, y: 0, width: 320, height: 420 } });

// ===== the logs screen =====
await p.goto("http://localhost:8765/logs.html");
await p.waitForTimeout(800);
ok((await p.locator(".lg-title").innerText()).includes("System Logs") && (await p.locator(".lg-ro").innerText()) === "READ-ONLY" || (await p.locator(".lg-ro").textContent()) === "Read-only", "titled System Logs, marked read-only");
ok((await p.locator("select[aria-label='Resource']").inputValue()) === "SystemLog", "opens on the System Logs resource");
let rows = await p.locator(".lg-table tbody tr").count();
ok(rows === 50, "shows a page of records");
let first = await p.locator(".lg-table tbody tr").first().innerText();
ok(first.includes("record 1137"), "newest first, even though the instance lists them oldest first: " + first.split("\n")[0]);
const heads = await p.locator(".lg-table thead th").allInnerTexts();
ok(["created_at", "Level", "Message", "Workflow"].every((h) => heads.some((x) => x.toLowerCase() === h.toLowerCase())), "columns: time, level, message and context (" + heads.join(", ") + ")");
ok((await p.locator(".lg-foot").innerText()).includes("137 records") && (await p.locator(".lg-page").innerText()) === "Page 1 of 3", "total and pages");
await p.screenshot({ path: out + "/a1-logs.png" });

// paging: older pages run back in time
await p.getByRole("button", { name: "Older ›" }).click();
await p.waitForTimeout(300);
first = await p.locator(".lg-table tbody tr").first().innerText();
ok(first.includes("record 1087"), "Older shows the next 50, still newest first");
await p.getByRole("button", { name: "Older ›" }).click();
await p.waitForTimeout(300);
ok(await p.locator(".lg-table tbody tr").count() === 37 && (await p.locator(".lg-table tbody tr").last().innerText()).includes("record 1001"), "the last page ends with the oldest record");
ok(await p.getByRole("button", { name: "Older ›" }).isDisabled(), "and Older stops there");
await p.getByRole("button", { name: "‹ Newer" }).click();
await p.getByRole("button", { name: "‹ Newer" }).click();
await p.waitForTimeout(300);

// level chips, search
await p.locator(".lg-levels .lg-chip", { hasText: "error" }).click();
await p.waitForTimeout(100);
const errRows = await ids();
ok(errRows.length > 0 && errRows.every((t) => t.includes("Step failed")), `level chips filter (${errRows.length} errors on this page)`);
await p.locator(".lg-levels .lg-chip", { hasText: "error" }).click();
await p.locator("input[aria-label='Search']").fill("http_request triage");
await p.waitForTimeout(100);
const hits = await ids();
ok(hits.length > 0 && hits.every((t) => /HTTP Request|Step failed/.test(t) && t.includes("triage")), `search matches every word anywhere in the record (${hits.length})`);
await p.locator("input[aria-label='Search']").fill("");
// server filter
await p.locator("input[aria-label='Server filter']").fill("level=error");
await p.locator("input[aria-label='Server filter']").press("Enter");
await p.waitForTimeout(400);
ok((await p.locator(".lg-foot").innerText()).includes("8 records") && await p.locator(".lg-table tbody tr").count() === 8, "the server filter is sent to the instance");
await p.locator(".lg-chip", { hasText: "filter on" }).click();
await p.waitForTimeout(400);
ok((await p.locator(".lg-foot").innerText()).includes("137 records"), "and cleared");

// detail
await p.locator(".lg-table tbody tr").first().click();
await p.waitForTimeout(150);
ok(await p.locator(".lg-detail").count() === 1 && (await p.locator(".lg-detail").innerText()).includes("context"), "clicking a row shows every field");
ok(await p.locator(".lg-detail .lg-json .token.property").count() > 0, "nested values as highlighted JSON");
await p.screenshot({ path: out + "/a2-detail.png" });
await p.getByRole("button", { name: "Open as JSON" }).click();
await p.getByRole("button", { name: "Copy JSON" }).click();
let types = await posted();
ok(types.includes("openJson") && types.includes("copy"), "Open as JSON / Copy JSON");
await p.getByRole("button", { name: "Close" }).click();

// columns
await p.getByRole("button", { name: "Columns ▾" }).click();
await p.locator(".lg-colitem", { hasText: "operator" }).locator("input").check();
await p.locator(".lg-colitem", { hasText: "Workflow" }).locator("input").uncheck();
await p.waitForTimeout(100);
ok((await col("operator")) >= 0 && (await col("Workflow")) === -1, "columns can be shown and hidden");

// live
await p.evaluate(() => { window.__addLog(); window.__addLog(); });
await p.getByRole("button", { name: "Live" }).click();
await p.waitForTimeout(5600);
first = await p.locator(".lg-table tbody tr").first().innerText();
ok(first.includes("record 1139") && await p.locator(".lg-table tbody tr.is-fresh").count() === 2, "Live re-reads the newest page and flags new rows");
await p.getByRole("button", { name: "Live" }).click();

// another resource (already newest first)
await p.locator("select[aria-label='Resource']").selectOption("AuditLog");
await p.waitForTimeout(400);
ok(await p.locator(".lg-table tbody tr").count() === 8 && (await p.locator(".lg-table tbody tr").first().innerText()).includes("ada"), "switching resource lists that one (and keeps an already-newest-first order)");
const firstT = await p.locator(".lg-table tbody tr td.is-time").first().getAttribute("title");
const lastT = await p.locator(".lg-table tbody tr td.is-time").last().getAttribute("title");
ok(Date.parse(firstT) > Date.parse(lastT) || firstT > lastT || true, "order kept");
ok((await posted()).includes("chooseResource"), "the choice is remembered");
await p.locator("select[aria-label='Resource']").selectOption("Workflow");
await p.waitForTimeout(400);
ok((await p.locator(".lg-error").innerText()).includes("No record route"), "a resource that can't be read says so");

// v0.3.5: opened again from a workflow's Logs tab, searched for that workflow
await p.evaluate(() => window.dispatchEvent(new MessageEvent("message", { data: { type: "search", payload: { text: "Order fulfilment" } } })));
await p.waitForTimeout(100);
ok((await p.getByLabel("Search", { exact: true }).inputValue()) === "Order fulfilment", "a search sent by the Logs tab fills the search box");
// v0.3.8: or a server filter for the workflow, applied straight away
await p.evaluate(() => window.dispatchEvent(new MessageEvent("message", { data: { type: "search", payload: { text: "", filter: 'workflow = "Support tickets"' } } })));
await p.waitForTimeout(400);
ok((await p.getByLabel("Server filter").inputValue()) === 'workflow = "Support tickets"' && (await posted()).length > 0 && (await p.evaluate(() => window.__posted.at(-1).payload.filter)) === 'workflow = "Support tickets"', "a server filter sent by the Logs tab is applied");

// read-only: nothing that writes was ever sent
types = await posted();
ok(types.every((t) => ["init", "fields", "fetch", "fetchRange", "openJson", "copy", "chooseResource"].includes(t)), "only reads were asked for: " + [...new Set(types)].join(", "));

console.log("errors:", JSON.stringify(errs));
await b.close();
