// v0.3.46: Resource settings. A button in the top bar shows the resource's own settings on the right
// (its ResourceDetail record): description, open records in a drawer, and the sections (add, remove,
// reorder, name, description, columns, own tab, which properties are in each, in order). The changes
// join the screen's unsaved count, Discard and Save. Clicking a property goes back to its settings.
import { chromium } from "playwright";
const out = process.env.SHOTS ?? "shots";
const b = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs = [];
p.on("pageerror", (e) => errs.push("pageerror: " + e.message));
p.on("console", (m) => /Content Security|Refused/.test(m.text()) && errs.push("CSP: " + m.text()));
const ok = (c, msg) => console.log((c ? "PASS " : "FAIL ") + msg);
const detail = () => p.evaluate(() => JSON.parse(JSON.stringify(window.__details.Application)));
const settingsBtn = () => p.locator(".rs-top").getByRole("button", { name: "Resource settings" });
const save = async () => {
  await p.locator(".rs-top").getByRole("button", { name: "Save", exact: true }).click();
  await p.locator(".rs-confirm").getByRole("button", { name: "Save", exact: true }).click();
  await p.waitForTimeout(400);
};

await p.goto("http://localhost:8765/resources.html");
await p.waitForTimeout(400);
await p.locator(".rs-picker-btn").click(); await p.locator(`.rs-picker-item[data-resource=${JSON.stringify("Application")}]`).click();
await p.waitForTimeout(300);
ok((await settingsBtn().count()) === 1, "a Resource settings button in the top bar");
await settingsBtn().click();
await p.waitForTimeout(300);
ok((await p.locator(".rs-detail-label", { hasText: "Application settings" }).count()) === 1, "the right side shows the resource's settings");
ok((await p.locator(".rs-side .rs-item").count()) > 0, "the properties list stays on the left");
ok((await p.locator("#rs-set-description").inputValue()) === "Loan applications", "the description as stored");
ok((await p.locator(".rs-section").count()) === 2, "both sections shown");
ok((await p.locator("#rs-sec-name-0").inputValue()) === "Basics" && (await p.locator("#rs-sec-cols-1").inputValue()) === "1", "with their names and columns");
ok((await p.locator(".rs-section").nth(0).locator(".rs-sec-props li").count()) === 2, "and their properties, in order");
await p.screenshot({ path: out + "/s1-settings.png" });

// ===== edit =====
await p.locator("#rs-set-description").fill("Applications for a loan");
await p.locator(".pe-row", { hasText: "Open records in a drawer" }).getByRole("switch").click();
await p.locator("#rs-sec-name-0").fill("The basics");
await p.locator(".rs-section").nth(0).getByRole("button", { name: "Move status down" }).click();
await p.locator(".rs-section").nth(0).getByRole("textbox", { name: /Find or add/ }).fill("submitted");
await p.locator(".rs-section").nth(0).getByRole("textbox", { name: /Find or add/ }).press("Enter");
await p.locator(".rs-section").nth(1).getByRole("button", { name: "Move section up" }).click();
await p.waitForTimeout(150);
ok((await p.locator("#rs-sec-name-0").inputValue()) === "Money", "a section moves up");
ok(/settings/.test(await p.locator(".rs-unsaved").innerText()), "the unsaved count names the settings");
ok((await detail()).description === "Loan applications", "nothing is sent before Save");
// a section with no name stops Save
await p.locator("#rs-sec-name-0").fill("");
await p.waitForTimeout(100);
ok(await p.locator(".rs-top").getByRole("button", { name: "Save", exact: true }).isDisabled(), "a section with no name stops Save");
await p.locator("#rs-sec-name-0").fill("Money");
// a property's settings still work, and coming back keeps the draft
await p.locator(".rs-item", { hasText: "Status" }).first().click();
await p.waitForTimeout(200);
ok((await p.locator(".rs-detail-label", { hasText: "Status" }).count()) === 1, "clicking a property goes back to its settings");
await settingsBtn().click();
await p.waitForTimeout(200);
ok((await p.locator("#rs-set-description").inputValue()) === "Applications for a loan", "the settings draft is kept");
await p.locator(".rs-top").getByRole("button", { name: "Save", exact: true }).click();
ok(/the settings/.test(await p.locator(".rs-confirm").innerText()), "the confirm lists the settings");
await p.screenshot({ path: out + "/s2-confirm.png" });
await p.locator(".rs-confirm").getByRole("button", { name: "Save", exact: true }).click();
await p.waitForTimeout(400);
let d = await detail();
const sent = await p.evaluate(() => window.__posted.filter((m) => m.type === "saveSettings").at(-1).payload);
ok(sent.id === "resourcedetail-71501093" && Object.keys(sent.changes).sort().join() === "description,drawer_enabled,sections", "only the changed settings are sent, to the record's id");
ok(d.description === "Applications for a loan" && d.drawer_enabled === true && d.render_details.drawer_enabled === true, "description and drawer saved");
ok(d.sections.map((s) => s.name).join() === "Money,The basics" && d.sections[1].properties.join() === "application_number,status,submitted_at", "sections saved in their new order, with their properties");
ok((await p.locator(".rs-unsaved").count()) === 0, "nothing left unsaved");

// ===== add, remove, own tab, columns; discard =====
await p.getByRole("button", { name: "+ Add a section" }).click();
await p.waitForTimeout(100);
ok((await p.locator(".rs-section").count()) === 3 && (await p.locator("#rs-sec-name-2").inputValue()) === "New section", "+ adds a section");
await p.locator("#rs-sec-cols-2").fill("3");
await p.locator(".rs-section").nth(2).getByRole("switch").click();
await p.locator(".rs-section").nth(0).getByRole("button", { name: "Remove section" }).click();
await p.waitForTimeout(100);
ok((await p.locator(".rs-section").count()) === 2, "× removes a section");
await p.locator(".rs-top").getByRole("button", { name: "Discard" }).click();
await p.waitForTimeout(100);
ok((await p.locator(".rs-section").count()) === 2 && (await p.locator("#rs-sec-name-0").inputValue()) === "Money", "Discard puts them back");
await p.getByRole("button", { name: "+ Add a section" }).click();
await p.locator("#rs-sec-name-2").fill("Notes");
await p.locator("#rs-sec-cols-2").fill("3");
await p.locator(".rs-section").nth(2).getByRole("switch").click();
await save();
d = await detail();
ok(d.sections.length === 3 && d.sections[2].name === "Notes" && d.sections[2].number_of_columns === 3 && d.sections[2].placeInTab === true, "a new section saved with its columns and own tab");

// ===== together with a property change =====
await p.locator(".rs-item", { hasText: "Status" }).first().click();
await p.waitForTimeout(200);
await p.locator(".pe-page .pe-row", { has: p.locator(".pe-label", { hasText: /^Label$/ }) }).locator("input").fill("State");
await p.locator(".pe-page .pe-row", { has: p.locator(".pe-label", { hasText: /^Label$/ }) }).locator("input").press("Enter");
await settingsBtn().click();
await p.waitForTimeout(200);
await p.locator("#rs-set-description").fill("Both");
await save();
ok((await p.evaluate(() => window.__data.Application.find((x) => x.key === "status").label)) === "State" && (await detail()).description === "Both", "a property and the settings saved in one Save");

// ===== a mismatch is reported =====
await p.evaluate(() => (window.__settingsMode = "mismatch"));
await p.locator("#rs-set-description").fill("Not kept");
await save();
ok((await p.locator(".rs-notice.is-error").count()) === 1 && (await p.locator(".rs-unsaved").count()) === 1, "a change the instance didn't keep is reported and stays unsaved");
await p.evaluate(() => (window.__settingsMode = "ok"));
await p.locator(".rs-top").getByRole("button", { name: "Discard" }).click();

// ===== a resource with no record =====
await p.locator(".rs-picker-btn").click(); await p.locator(`.rs-picker-item[data-resource=${JSON.stringify("Loan")}]`).click();
await p.waitForTimeout(400);
ok(/no ResourceDetail record/.test(await p.locator(".rs-detail").innerText()), "a resource with no settings record says so");
await p.screenshot({ path: out + "/s3-none.png" });

ok(!errs.length, "no page errors " + JSON.stringify(errs));
await b.close();
