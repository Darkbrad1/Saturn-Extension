// v0.3.13 / 0.3.18: the Resources screen (a resource's properties down the left, in order — drag to
// reorder —, the one picked on the right, required or not) and its sidebar entry.
import { chromium } from "playwright";
const out = process.env.SHOTS ?? "shots";
const b = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const p = await b.newPage({ viewport: { width: 1200, height: 800 } });
const errs = [];
p.on("pageerror", (e) => errs.push("pageerror: " + e.message));
p.on("console", (m) => /Content Security|Refused/.test(m.text()) && errs.push("CSP: " + m.text()));
const ok = (c, msg) => console.log((c ? "PASS " : "FAIL ") + msg);
const last = () => p.evaluate(() => window.__posted.at(-1));
const box = (label) => p.getByRole("checkbox", { name: new RegExp(`^${label} required$`) });
const item = (label) => p.locator(".rs-item", { hasText: label }).first();
const pick = (label) => item(label).click();
const listKeys = () => p.locator(".rs-item .rs-item-key").allInnerTexts();
const required = (resource, key) => p.evaluate(([r, k]) => window.__data[r].find((x) => x.key === k).required, [resource, key]);

// ===== sidebar entry =====
await p.goto("http://localhost:8765/sidebar.html");
await p.waitForTimeout(800);
const entry = p.getByRole("button", { name: "Resources" });
ok(await entry.count() === 1, "the instance card has a Resources entry");
const labels = await p.locator("button").allInnerTexts();
ok(labels.indexOf("System Logs") < labels.indexOf("Resources") && labels.indexOf("Resources") < labels.indexOf("Components"), "listed after System Logs");
await entry.click();
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
const cards = await p.locator(".rs-item").allInnerTexts();
ok(cards.length === 4 && cards[0].includes("Status") && cards[0].includes("status") && cards[0].includes("string"), "the properties are listed down the left: name, key and type");
ok((await listKeys()).join() === "status,application_number,requested_loan_amount,submitted_at", "in the schema's order");
ok((await p.locator(".rs-side-info").innerText()).includes("4 properties · 1 required"), "with a count");
ok((await p.locator(".rs-detail").innerText()).includes("Pick a property"), "the right side asks for a property");
await pick("Status");
ok((await p.locator(".rs-detail-label").innerText()) === "Status" && (await p.locator(".rs-detail-key").innerText()) === "status" && (await p.locator(".rs-pill").innerText()) === "string", "picking one shows it on the right");
ok(!(await box("Status").isChecked()), "with whether it's required");
await pick("Submitted At");
ok(await box("Submitted At").isChecked(), "(Submitted At is)");
await p.screenshot({ path: out + "/r0-layout.png" });

// change and discard
await pick("Status");
await box("Status").check();
ok(await p.locator(".rs-item .rs-dot").count() === 1 && (await p.locator(".rs-was").innerText()) === "was optional", "a change is marked in the list, with what it was");
ok((await p.locator(".rs-bar").innerText()).includes("1 unsaved change"), "the bar counts unsaved changes");
ok(await p.locator(".rs-select select").isDisabled(), "the resource can't be switched while changes are unsaved");
await box("Status").uncheck();
ok(await p.locator(".rs-bar").count() === 0, "changing it back leaves nothing unsaved");
await box("Status").check();
await p.getByRole("button", { name: "Discard" }).click();
ok(!(await box("Status").isChecked()) && await p.locator(".rs-bar").count() === 0, "Discard drops the changes");

// the whole definition
await p.getByRole("button", { name: "Show the whole definition" }).click();
ok((await p.locator(".rs-detail .rs-json").innerText()).includes('"rendering"'), "the whole definition can be shown");
await p.getByRole("button", { name: "Hide the whole definition" }).click();

// search
await p.fill(".rs-search", "loan");
ok(await p.locator(".rs-item").count() === 1 && (await item("Requested Loan Amount").getAttribute("draggable")) === "false", "the search narrows the list (and dragging is off while it does)");
await p.fill(".rs-search", "");

// reorder: drag, and Alt+arrows
await item("Submitted At").dragTo(item("Status"), { targetPosition: { x: 20, y: 4 } });
ok((await listKeys()).join() === "submitted_at,status,application_number,requested_loan_amount", "dragging a property moves it in the list");
ok((await p.locator(".rs-bar").innerText()).includes("1 unsaved change (incl. the order)"), "the new order is an unsaved change");
await pick("Status");
await p.keyboard.press("Alt+ArrowDown");
ok((await listKeys()).join() === "submitted_at,application_number,status,requested_loan_amount", "Alt+↓ moves the picked one down");
await p.keyboard.press("Alt+ArrowUp");
await p.keyboard.press("Alt+ArrowUp");
ok((await listKeys()).join() === "status,submitted_at,application_number,requested_loan_amount", "Alt+↑ moves it up");
await p.getByRole("button", { name: "Reset order" }).click();
ok((await listKeys()).join() === "status,application_number,requested_loan_amount,submitted_at" && await p.locator(".rs-bar").count() === 0, "Reset order puts it back");

// save: confirm first — Required and the order together
await pick("Status");
await box("Status").check();
await pick("Submitted At");
await box("Submitted At").uncheck();
await item("Requested Loan Amount").dragTo(item("Status"), { targetPosition: { x: 20, y: 4 } });
await p.getByRole("button", { name: "Save" }).click();
ok((await p.locator(".rs-bar").innerText()).includes("Change Required on 2 properties and the order of the properties of Application on demo"), "Save asks first, saying what will change and where");
ok((await p.evaluate(() => window.__posted.filter((m) => m.type === "save").length)) === 0, "nothing is sent before confirming");
await p.screenshot({ path: out + "/r1-confirm.png" });
await p.locator(".rs-bar").getByRole("button", { name: "Save" }).click();
await p.waitForTimeout(200);
const save = await p.evaluate(() => window.__posted.find((m) => m.type === "save"));
ok(save && JSON.stringify(save.payload.changes) === JSON.stringify([{ key: "status", required: true }, { key: "submitted_at", required: false }]) && save.payload.order.join() === "requested_loan_amount,status,application_number,submitted_at", "confirming sends the changed properties and the new order");
ok(await required("Application", "status") === true && (await listKeys()).join() === "requested_loan_amount,status,application_number,submitted_at" && await p.locator(".rs-bar").count() === 0, "saved: the list shows the instance's new order and values, nothing unsaved");
ok((await p.locator(".rs-notice").innerText()).includes("backup"), "and says a backup was kept");
await p.screenshot({ path: out + "/r2-saved.png" });

// unsaved changes survive the tab being hidden (webview state)
await item("Submitted At").dragTo(item("Requested Loan Amount"), { targetPosition: { x: 20, y: 4 } });
await pick("Requested Loan Amount");
await box("Requested Loan Amount").check();
const state = await p.evaluate(() => window.acquireVsCodeApi().getState());
ok(state.resource === "Application" && state.pending.requested_loan_amount === true && state.order[0] === "submitted_at" && state.selected === "requested_loan_amount", "unsaved changes, the new order and the picked property are kept in the webview's state");
await p.getByRole("button", { name: "Discard" }).click();

// refused
await p.evaluate(() => (window.__saveMode = "refuse"));
await pick("Status");
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
await pick("Requested Loan Amount");
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
