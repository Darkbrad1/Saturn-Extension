// v0.3.13 / 0.3.18 / 0.3.19: the Resources screen (a resource's properties down the left, in order,
// drag to reorder, + to add one; the one picked on the right with all its settings) and its
// sidebar entry.
import { chromium } from "playwright";
const out = process.env.SHOTS ?? "shots";
const b = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const p = await b.newPage({ viewport: { width: 1200, height: 800 } });
const errs = [];
p.on("pageerror", (e) => errs.push("pageerror: " + e.message));
p.on("console", (m) => /Content Security|Refused/.test(m.text()) && errs.push("CSP: " + m.text()));
const ok = (c, msg) => console.log((c ? "PASS " : "FAIL ") + msg);
const last = () => p.evaluate(() => window.__posted.at(-1));
// the Required switch of the property shown (General tab)
const box = () => p.getByRole("switch", { name: "Required", exact: true });
const tab = (name) => p.locator(".pe-menu").getByRole("button", { name: new RegExp(`^${name}`) }).click();
const topSave = () => p.locator(".rs-top").getByRole("button", { name: "Save", exact: true });
const confirmSave = () => p.locator(".rs-confirm").getByRole("button", { name: "Save", exact: true });
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
ok(await p.evaluate(() => window.__posted.some((m) => m.type === "load" && m.payload.resource === "Application")), "picking a resource loads it");
const cards = await p.locator(".rs-item").allInnerTexts();
ok(cards.length === 4 && cards[0].includes("Status") && cards[0].includes("status") && cards[0].includes("string"), "the properties are listed down the left: name, key and type");
ok((await listKeys()).join() === "status,application_number,requested_loan_amount,submitted_at", "in the schema's order");
ok((await p.locator(".rs-side-info").innerText()).includes("4 properties · 1 required"), "with a count");
ok((await p.locator(".rs-detail").innerText()).includes("Pick a property"), "the right side asks for a property");
await pick("Status");
ok((await p.locator(".rs-detail-label").innerText()) === "Status" && (await p.locator(".rs-detail-key").innerText()) === "status" && (await p.locator(".rs-pill").innerText()) === "string", "picking one shows it on the right");
ok(!(await box().isChecked()), "with whether it's required");
await pick("Submitted At");
ok(await box().isChecked(), "(Submitted At is)");
await p.screenshot({ path: out + "/r0-layout.png" });

// change and discard
await pick("Status");
await box().check();
ok(await p.locator(".rs-item .rs-dot").count() === 1 && (await p.locator(".pe-was").innerText()).includes("was off"), "a change is marked in the list, with what it was");
ok((await p.locator(".rs-unsaved").innerText()).includes("Unsaved: 1 setting on 1 property") && await topSave().isEnabled(), "the top bar counts unsaved changes, next to Save");
ok(!(await p.locator(".rs-select select").isDisabled()), "the resource can still be switched (each keeps its own changes, test14)");
await box().uncheck();
ok(await p.locator(".rs-unsaved").count() === 0, "changing it back leaves nothing unsaved");
await box().check();
await p.getByRole("button", { name: "Put back" }).click();
ok(!(await box().isChecked()) && await p.locator(".rs-unsaved").count() === 0, "Put back undoes one setting");
await box().check();
await p.getByRole("button", { name: "Discard" }).click();
ok(!(await box().isChecked()) && await p.locator(".rs-unsaved").count() === 0, "Discard drops the changes");

// the settings: a menu beside one long page
ok((await p.locator(".pe-page .pe-group-title").allInnerTexts()).map((t) => t.replace(/\s*Edit$/, "")).join() === "★ Favourites,Basics,Rules,Choices,In forms,In tables,In record views,Access,Advanced,JSON", "every group is on one long page, grouped by place (0.3.55)");
ok(await p.getByRole("switch").count() > 5 && await p.locator(".pe-page input[type=checkbox]:not([role=switch])").count() === await p.locator(".pe-picks input[type=checkbox]").count(), "on/off settings are switches (only the long property lists keep checkboxes)");
ok(await p.locator(".pe-page input[type=radio]").count() === 0, "there are no round radio buttons");
ok((await p.getByRole("radiogroup", { name: "Type" }).getByRole("radio").allInnerTexts()).map((t) => t.split("\n")[0]).join() === "String,Number,Boolean,Date,Array,Object" && (await p.getByRole("radio", { name: /^String/ }).getAttribute("aria-checked")) === "true", "the type is a card for each type, the chosen one marked");
await tab("In forms");
await p.waitForTimeout(100);
ok((await p.locator(".pe-menu-sub").allInnerTexts()).join() === "Input,Look", "picking a group in the menu opens its sections");
ok((await p.locator(".pe-page").innerText()).includes("Default renderer") && (await p.locator(".pe-page").innerText()).includes("Column width"), "the page has the display settings");
ok(!(await p.locator(".pe-page").innerText()).includes("Rows"), "a setting only shows when it applies (Rows only for a textarea)");
await p.getByLabel("Input type").selectOption("textarea");
ok((await p.locator(".pe-page").innerText()).includes("Rows"), "and shows once it does");
await p.getByRole("button", { name: "Put back" }).click();
await tab("Choices");
await p.getByRole("radio", { name: /^Another resource/ }).click();
await p.getByLabel("Reference").first().selectOption("LoanCategory");
await p.waitForTimeout(150);
ok((await p.evaluate(() => window.__posted.some((m) => m.type === "fields" && m.payload.resource === "LoanCategory"))) && (await p.getByLabel("Value field").first().locator("option").allInnerTexts()).includes("Code (code)"), "a map's fields are picked from the referenced resource's properties");
ok((await p.locator(".pe-menu-item", { hasText: "Choices" }).locator(".pe-count").innerText()) === "1", "the group's tab counts its changes (a new map is one)");
await p.fill(".pe-find", "column width");
ok((await p.locator(".pe-page .pe-row").count()) === 1 && (await p.locator(".pe-page .pe-group-title").allInnerTexts()).join() === "In tables", "Find a setting narrows the page to it, under its group");
await p.fill(".pe-find", "");
await tab("JSON");
ok((await p.locator(".pe-page").innerText()).includes('"reference": "LoanCategory"'), "the JSON tab shows the whole property as edited");
await p.getByRole("button", { name: "Undo all changes to it" }).click();
ok(await p.locator(".rs-unsaved").count() === 0, "Undo all changes to it puts the property back");
await tab("Basics");

// search
await p.fill(".rs-search", "loan");
ok(await p.locator(".rs-item").count() === 1 && (await item("Requested Loan Amount").getAttribute("draggable")) === "false", "the search narrows the list (and dragging is off while it does)");
await p.fill(".rs-search", "");

// reorder: drag, and Alt+arrows
await item("Submitted At").dragTo(item("Status"), { targetPosition: { x: 20, y: 4 } });
ok((await listKeys()).join() === "submitted_at,status,application_number,requested_loan_amount", "dragging a property moves it in the list");
ok((await p.locator(".rs-unsaved").innerText()).includes("Unsaved: the order"), "the new order is an unsaved change");
await pick("Status");
await p.keyboard.press("Alt+ArrowDown");
ok((await listKeys()).join() === "submitted_at,application_number,status,requested_loan_amount", "Alt+↓ moves the picked one down");
await p.keyboard.press("Alt+ArrowUp");
await p.keyboard.press("Alt+ArrowUp");
ok((await listKeys()).join() === "status,submitted_at,application_number,requested_loan_amount", "Alt+↑ moves it up");
await p.getByRole("button", { name: "Reset order" }).click();
ok((await listKeys()).join() === "status,application_number,requested_loan_amount,submitted_at" && await p.locator(".rs-unsaved").count() === 0, "Reset order puts it back");

// save: confirm first. Required and the order together
await pick("Status");
await box().check();
await pick("Submitted At");
await box().uncheck();
await item("Requested Loan Amount").dragTo(item("Status"), { targetPosition: { x: 20, y: 4 } });
await topSave().click();
ok((await p.locator(".rs-confirm").innerText()).includes("Save 2 settings on 2 properties, the order to Application."), "Save asks first, saying what will change and where");
ok((await p.evaluate(() => window.__posted.filter((m) => m.type === "save").length)) === 0, "nothing is sent before confirming");
await p.screenshot({ path: out + "/r1-confirm.png" });
await confirmSave().click();
await p.waitForTimeout(200);
const save = await p.evaluate(() => window.__posted.find((m) => m.type === "save"));
ok(save && JSON.stringify(save.payload.changes) === JSON.stringify([{ key: "status", path: ["required"], value: true }, { key: "submitted_at", path: ["required"], value: false }]) && save.payload.order.join() === "requested_loan_amount,status,application_number,submitted_at", "confirming sends each changed setting at its path, and the new order");
ok(await required("Application", "status") === true && (await listKeys()).join() === "requested_loan_amount,status,application_number,submitted_at" && await p.locator(".rs-unsaved").count() === 0, "saved: the list shows the instance's new order and values, nothing unsaved");
ok((await p.locator(".rs-notice").innerText()).includes("backup"), "and says a backup was kept");
await p.screenshot({ path: out + "/r2-saved.png" });

// unsaved changes survive the tab being hidden (webview state)
await item("Submitted At").dragTo(item("Requested Loan Amount"), { targetPosition: { x: 20, y: 4 } });
await pick("Requested Loan Amount");
await box().check();
const state = await p.evaluate(() => window.acquireVsCodeApi().getState());
ok(state.resource === "Application" && state.works.Application.drafts.requested_loan_amount.required === true && state.works.Application.order[0] === "submitted_at" && state.selected.join() === "requested_loan_amount", "unsaved changes, the new order and the picked property are kept in the webview's state");
await p.getByRole("button", { name: "Discard" }).click();

// the label and the key can be changed
await pick("Application Number");
await p.getByLabel("Label", { exact: true }).fill("App No");
await p.getByLabel("Key", { exact: true }).fill("status");
ok((await p.locator(".pe-key .pe-error").innerText()).includes("status is already a property") && await topSave().isDisabled(), "a key another property has is flagged, and Save waits");
await p.getByLabel("Key", { exact: true }).fill("app_no");
ok((await p.locator(".rs-item.is-selected").innerText()).includes("App No") && (await p.locator(".rs-item.is-selected").innerText()).includes("app_no") && (await p.locator(".rs-unsaved").innerText()).includes("1 new key"), "the list shows the new label and key, and the change is counted");
await topSave().click();
await confirmSave().click();
await p.waitForTimeout(200);
const renamed = await p.evaluate(() => window.__posted.filter((m) => m.type === "save").at(-1).payload);
ok(JSON.stringify(renamed.renames) === JSON.stringify([{ from: "application_number", to: "app_no" }]) && renamed.changes.some((c) => c.key === "application_number" && c.path.join() === "label" && c.value === "App No"), "Save sends the label change and the new key");
ok(await p.evaluate(() => window.__data.Application.some((x) => x.key === "app_no" && x.label === "App No")) && (await listKeys()).includes("app_no"), "and after saving the property has its new key");

// a new property
await p.getByRole("button", { name: "Add a property" }).click();
await p.getByLabel("New property label").fill("First Name");
ok((await p.getByLabel("New property key").inputValue()) === "first_name", "a new property's key is made from its label");
await p.getByLabel("New property key").fill("status");
ok((await p.locator(".rs-new").innerText()).includes("status is already a property") && await p.locator(".rs-new").getByRole("button", { name: "Add" }).isDisabled(), "a key that's taken can't be added");
await p.getByLabel("New property key").fill("first_name");
await p.locator(".rs-new").getByRole("button", { name: "Add" }).click();
ok((await listKeys()).at(-1) === "first_name" && (await p.locator(".rs-detail-label").innerText()) === "First Name" && (await p.locator(".rs-item", { hasText: "First Name" }).innerText()).includes("new"), "it's added at the end, marked new, and opened");
await box().check();
await topSave().click();
ok((await p.locator(".rs-confirm").innerText()).includes("1 new property"), "the confirm counts the new property");
await confirmSave().click();
await p.waitForTimeout(200);
const adding = await p.evaluate(() => window.__posted.filter((m) => m.type === "save").at(-1).payload);
ok(adding.adds?.[0]?.key === "first_name" && adding.adds[0].property.required === true && adding.adds[0].property.input_properties.type === "input" && !adding.changes.length, "Save sends it with Saturn's settings for a new property");
ok(await p.evaluate(() => window.__data.Application.at(-1).key === "first_name") && !(await p.locator(".rs-item", { hasText: "First Name" }).innerText()).includes("new"), "once saved it's an ordinary property");
await p.screenshot({ path: out + "/r3-added.png" });

// refused
await p.evaluate(() => (window.__saveMode = "refuse"));
await pick("Status");
await box().uncheck();
await topSave().click();
await confirmSave().click();
await p.waitForTimeout(200);
ok((await p.locator(".rs-notice.is-error").innerText()).includes("doesn't accept changes") && await p.locator(".rs-unsaved").count() === 1, "a refused save is shown, and the change stays unsaved to try again or discard");
await p.getByRole("button", { name: "Check what it takes" }).click();
await p.waitForTimeout(200);
ok((await last()).type === "probe" && (await p.locator(".rs-report").innerText()).includes("allows GET, PATCH"), "Check what it takes runs the read-only check and shows its report");
await p.locator(".rs-report").getByRole("button", { name: "Copy" }).click();
ok((await last()).type === "copy" && (await last()).payload.text.includes("update_resource_schema"), "and Copy copies it");
await p.getByRole("button", { name: "Discard" }).click();

// read back differently: offer the backup
await p.evaluate(() => (window.__saveMode = "mismatch"));
await pick("Requested Loan Amount");
await box().check();
await topSave().click();
await confirmSave().click();
await p.waitForTimeout(200);
ok((await p.locator(".rs-notice.is-error").innerText()).includes("changed differently") && await p.getByRole("button", { name: "Restore backup" }).count() === 1, "an unexpected result is shown with Restore backup");
await p.getByRole("button", { name: "Restore backup" }).click();
await p.waitForTimeout(200);
const restore = await last();
ok(restore.type === "restore" && restore.payload.backup === "/backups/Application-1.json", "Restore backup sends that backup");
ok((await p.locator(".rs-notice").innerText()).includes("put back"), "and says it was put back");
ok(errs.length === 0, "no page or CSP errors " + JSON.stringify(errs));
await b.close();
