// v0.3.13: the Resources screen (a resource's properties, required or not) and its sidebar entry.
import { chromium } from "playwright";
const out = process.env.SHOTS ?? "shots";
const b = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const p = await b.newPage({ viewport: { width: 1200, height: 800 } });
const errs = [];
p.on("pageerror", (e) => errs.push("pageerror: " + e.message));
p.on("console", (m) => /Content Security|Refused/.test(m.text()) && errs.push("CSP: " + m.text()));
const ok = (c, msg) => console.log((c ? "PASS " : "FAIL ") + msg);
const last = () => p.evaluate(() => window.__posted.at(-1));
const box = (key) => p.getByRole("checkbox", { name: new RegExp(`^${key} required$`) });
const required = (resource, key) => p.evaluate(([r, k]) => window.__data[r].find((x) => x.key === k).required, [resource, key]);

// ===== sidebar entry =====
await p.goto("http://localhost:8765/sidebar.html");
await p.waitForTimeout(800);
const item = p.getByRole("button", { name: "Resources" });
ok(await item.count() === 1, "the instance card has a Resources entry");
const labels = await p.locator("button").allInnerTexts();
ok(labels.indexOf("System Logs") < labels.indexOf("Resources") && labels.indexOf("Resources") < labels.indexOf("Components"), "listed after System Logs");
await item.click();
const sent = await last();
ok(sent.type === "saturn:openResources" && sent.payload.instanceId === "i1", "it asks the extension to open the Resources screen for that instance");

// ===== the screen =====
await p.goto("http://localhost:8765/resources.html");
await p.waitForTimeout(500);
ok((await p.locator(".rs-title").innerText()).includes("Resources") && (await p.locator(".rs-title").innerText()).includes("demo"), "titled Resources, with the instance");
ok((await p.locator(".rs-empty").innerText()).includes("Pick a resource"), "asks for a resource first");
await p.selectOption(".rs-select select", "Application");
await p.waitForTimeout(300);
ok((await last()).type === "load" && (await last()).payload.resource === "Application", "picking a resource loads it");
const rows = await p.locator(".rs-table tbody tr").allInnerTexts();
ok(rows.length === 4 && rows[0].includes("Status") && rows[0].includes("status") && rows[0].includes("string"), "each property shows its label, key and type");
ok(!(await box("Status").isChecked()) && (await box("Submitted At").isChecked()), "and whether it's required");
ok((await p.locator(".rs-count").innerText()) === "4 properties · 1 required", "with a count");

// change and discard
await box("Status").check();
ok(await p.locator("tr.is-changed").count() === 1 && (await p.locator(".rs-was").innerText()) === "was optional", "a change is marked, with what it was");
ok((await p.locator(".rs-bar").innerText()).includes("1 unsaved change"), "the bar counts unsaved changes");
ok(await p.locator(".rs-select select").isDisabled(), "the resource can't be switched while changes are unsaved");
await box("Status").uncheck();
ok(await p.locator(".rs-bar").count() === 0, "changing it back leaves nothing unsaved");
await box("Status").check();
await p.getByRole("button", { name: "Discard" }).click();
ok(!(await box("Status").isChecked()) && await p.locator(".rs-bar").count() === 0, "Discard drops the changes");

// details
await p.getByRole("button", { name: "Details" }).first().click();
ok((await p.locator(".rs-json").innerText()).includes('"rendering"'), "Details shows the property's whole definition");
await p.getByRole("button", { name: "Hide" }).click();

// filter
await p.fill(".rs-search", "loan");
ok(await p.locator(".rs-table tbody tr").count() === 1, "the filter narrows the list");
await p.fill(".rs-search", "");

// save: confirm first
await box("Status").check();
await box("Submitted At").uncheck();
await p.getByRole("button", { name: "Save" }).click();
ok((await p.locator(".rs-bar").innerText()).includes("Change 2 properties of Application on demo"), "Save asks first, saying what will change and where");
ok((await p.evaluate(() => window.__posted.filter((m) => m.type === "save").length)) === 0, "nothing is sent before confirming");
await p.screenshot({ path: out + "/r1-confirm.png" });
await p.locator(".rs-bar").getByRole("button", { name: "Save" }).click();
await p.waitForTimeout(200);
const save = await p.evaluate(() => window.__posted.find((m) => m.type === "save"));
ok(save && save.payload.resource === "Application" && JSON.stringify(save.payload.changes) === JSON.stringify([{ key: "status", required: true }, { key: "submitted_at", required: false }]), "confirming sends only the changed properties");
ok(await required("Application", "status") === true && (await box("Status").isChecked()) && await p.locator(".rs-bar").count() === 0, "saved: the table shows the instance's new values, nothing unsaved");
ok((await p.locator(".rs-notice").innerText()).includes("backup"), "and says a backup was kept");
await p.screenshot({ path: out + "/r2-saved.png" });

// unsaved changes survive the tab being hidden (webview state)
await box("Requested Loan Amount").check();
const state = await p.evaluate(() => window.acquireVsCodeApi().getState());
ok(state.resource === "Application" && state.pending.requested_loan_amount === true, "unsaved changes are kept in the webview's state");
await p.getByRole("button", { name: "Discard" }).click();

// refused
await p.evaluate(() => (window.__saveMode = "refuse"));
await box("Status").uncheck();
await p.getByRole("button", { name: "Save" }).click();
await p.locator(".rs-bar").getByRole("button", { name: "Save" }).click();
await p.waitForTimeout(200);
ok((await p.locator(".rs-notice.is-error").innerText()).includes("doesn't accept changes") && await p.locator(".rs-bar").count() === 1, "a refused save is shown, and the change stays unsaved to try again or discard");
await p.getByRole("button", { name: "Check what it takes" }).click();
await p.waitForTimeout(200);
ok((await last()).type === "probe" && (await p.locator(".rs-report").innerText()).includes("allows GET, PATCH"), "Check what it takes runs the read-only check and shows its report");
await p.locator(".rs-report").getByRole("button", { name: "Copy" }).click();
ok((await last()).type === "copy" && (await last()).payload.text.includes("update_resource_schema"), "and Copy copies it");
await p.getByRole("button", { name: "Discard" }).click();

// read back differently: offer the backup
await p.evaluate(() => (window.__saveMode = "mismatch"));
await box("Requested Loan Amount").check();
await p.getByRole("button", { name: "Save" }).click();
await p.locator(".rs-bar").getByRole("button", { name: "Save" }).click();
await p.waitForTimeout(200);
ok((await p.locator(".rs-notice.is-error").innerText()).includes("changed differently") && await p.getByRole("button", { name: "Restore backup" }).count() === 1, "an unexpected result is shown with Restore backup");
await p.getByRole("button", { name: "Restore backup" }).click();
await p.waitForTimeout(200);
const restore = await last();
ok(restore.type === "restore" && restore.payload.backup === "/backups/Application-1.json", "Restore backup sends that backup");
ok((await p.locator(".rs-notice").innerText()).includes("put back"), "and says it was put back");
ok(errs.length === 0, "no page or CSP errors " + JSON.stringify(errs));
await b.close();
