// v0.3.22: the Resources screen with several properties picked (one change goes to all, Mixed,
// moving them together), the right-click menu (duplicate, copy / paste settings, delete /
// restore), chips for mapped properties with jumping there and back, each resource keeping its
// own unsaved changes, and one column of cards with even gaps (0.3.24).
import { chromium } from "playwright";
const out = process.env.SHOTS ?? "shots";
const b = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const p = await b.newPage({ viewport: { width: 1400, height: 860 } });
const errs = [];
p.on("pageerror", (e) => errs.push("pageerror: " + e.message));
p.on("console", (m) => (m.type() === "error" || /Content Security|Refused/.test(m.text())) && errs.push(m.text()));
const ok = (c, msg) => console.log((c ? "PASS " : "FAIL ") + msg);
const item = (label) => p.locator(".rs-item", { hasText: label }).first();
const listKeys = () => p.locator(".rs-item .rs-item-key").allInnerTexts();
const sw = (name) => p.getByRole("switch", { name, exact: true });
const topSave = () => p.locator(".rs-top").getByRole("button", { name: "Save", exact: true });
const confirmSave = () => p.locator(".rs-confirm").getByRole("button", { name: "Save", exact: true });
const saves = () => p.evaluate(() => window.__posted.filter((m) => m.type === "save").map((m) => m.payload));
const menu = async (label, entry) => {
  await item(label).click({ button: "right" });
  await p.locator(".rs-menu").getByRole("menuitem", { name: entry }).click();
};

await p.goto("http://localhost:8765/resources.html");
await p.waitForTimeout(400);
await p.selectOption(".rs-select select", "Application");
await p.waitForTimeout(300);

// ===== several picked =====
await item("Status").click();
await item("Submitted At").click({ modifiers: ["Control"] });
ok((await p.locator(".rs-item.is-selected").count()) === 2 && (await p.locator(".rs-side-info").innerText()).includes("2 picked"), "Ctrl+click picks a second property");
ok((await p.locator(".pe-many").innerText()).includes("Editing 2 properties"), "the settings say they're for both");
ok((await p.getByLabel("Label", { exact: true }).count()) === 0 && (await p.getByLabel("Key", { exact: true }).count()) === 0, "label, key and description are left out with several picked");
ok((await sw("Required").getAttribute("aria-checked")) === "mixed" && (await p.locator(".pe-row", { has: sw("Required") }).innerText()).includes("Mixed"), "a setting they don't share shows as Mixed");
await sw("Required").click();
ok(await p.evaluate(() => true) && (await sw("Required").getAttribute("aria-checked")) === "true", "a click on a Mixed switch turns it on for all");
await sw("Unique").click();
ok((await p.locator(".rs-unsaved").innerText()).includes("on 2 properties") && (await p.locator(".pe-was").first().innerText()).includes("changed on"), "the change goes to both");
await p.screenshot({ path: out + "/m1-multi.png" });
await item("Application Number").click({ modifiers: ["Shift"] });
ok((await p.locator(".rs-item.is-selected").count()) === 3, "Shift+click picks the run from the last one picked");
await p.getByRole("button", { name: "Discard" }).click();

// move several together
await item("Status").click();
await item("Requested Loan Amount").click({ modifiers: ["Control"] });
await item("Requested Loan Amount").dragTo(item("Submitted At"), { targetPosition: { x: 20, y: 30 } });
ok((await listKeys()).join() === "application_number,submitted_at,status,requested_loan_amount", "dragging one of the picked moves them all, side by side, in their order");
await p.keyboard.press("Alt+ArrowUp");
ok((await listKeys()).join() === "application_number,status,requested_loan_amount,submitted_at", "Alt+↑ moves the picked ones up together");
await p.getByRole("button", { name: "Discard" }).click();

// ===== right-click menu =====
await item("Status").click();
await menu("Status", "Duplicate");
ok((await listKeys()).join() === "status,status_copy,application_number,requested_loan_amount,submitted_at" && (await item("Status (copy)").innerText()).includes("new"), "Duplicate puts a copy right below, with a free key");
await item("Requested Loan Amount").click();
await sw("Searchable").click();
await menu("Requested Loan Amount", "Copy settings");
await item("Application Number").click();
await item("Submitted At").click({ modifiers: ["Control"] });
await menu("Submitted At", /^Paste settings/);
ok((await p.getByRole("dialog", { name: "Paste settings" }).innerText()).includes("Paste settings from Requested Loan Amount") && !(await p.getByRole("dialog").getByRole("switch", { name: "General" }).isChecked()) && (await p.getByRole("dialog").getByRole("switch", { name: "Display" }).isChecked()), "Paste asks which groups to bring over: all but General");
await p.getByRole("dialog").getByRole("button", { name: "Paste" }).click();
const pasted = await p.evaluate(() => window.acquireVsCodeApi().getState().works.Application.drafts);
ok(pasted.application_number?.searchable === true && pasted.submitted_at?.searchable === true && pasted.application_number.label === "Application Number", "the settings go to both picked properties; their labels stay");
await menu("Status", "Delete");
ok((await p.locator(".rs-item.is-deleted").count()) === 1 && (await p.locator(".rs-detail").innerText()).includes("removed when you save"), "Delete marks it to be removed when you save");
await topSave().click();
ok((await p.locator(".rs-confirm").innerText()).includes("Removes Status") && (await p.locator(".rs-confirm").innerText()).includes("may be lost"), "the confirm names what's removed, and warns");
await p.locator(".rs-confirm").getByRole("button", { name: "Cancel" }).click();
await menu("Status", "Restore");
ok((await p.locator(".rs-item.is-deleted").count()) === 0, "Restore brings it back before saving");
await menu("Status", "Delete");
await topSave().click();
await confirmSave().click();
await p.waitForTimeout(250);
const sent = (await saves()).at(-1);
ok(JSON.stringify(sent.removes) === '["status"]' && sent.adds?.[0]?.key === "status_copy" && sent.order && !sent.order.includes("status"), "Save sends the removal, the copy and the order without it");
ok(await p.evaluate(() => !window.__data.Application.some((x) => x.key === "status") && window.__data.Application.some((x) => x.key === "status_copy")), "and after saving it's gone, the copy is there");

// ===== mapped chips, jumping there and back =====
await p.selectOption(".rs-select select", "Loan");
await p.waitForTimeout(300);
ok((await item("Category").locator(".rs-chip.is-static").innerText()) === "LoanCategory" && (await item("Payments").locator(".rs-chip.is-dynamic").innerText()) === "Application", "a mapped property has a chip naming its resource: blue for a map, purple for a dynamic source");
ok((await item("Category").locator(".rs-grip.is-static").count()) === 1 && (await item("Payments").locator(".rs-grip.is-dynamic").count()) === 1 && (await item("Amount").locator(".rs-req").count()) === 1, "the bar shows the kind of map, and Required is a star");
await item("Amount").click();
await sw("Unique").click();
await item("Category").click();
await item("Category").locator(".rs-chip").click();
await p.waitForTimeout(300);
ok((await p.locator(".rs-select select").inputValue()) === "LoanCategory" && (await p.locator(".rs-crumbbar").innerText()).includes("Loan"), "the chip opens that resource, with the way back shown");
ok((await p.locator(".rs-unsaved").innerText()).includes("Loan"), "Loan's unsaved change is kept while you're away");
await p.screenshot({ path: out + "/m2-jumped.png" });
await p.keyboard.press("Alt+ArrowLeft");
await p.waitForTimeout(300);
ok((await p.locator(".rs-select select").inputValue()) === "Loan" && (await p.locator(".rs-item.is-selected").innerText()).includes("Category") && (await p.locator(".rs-crumbbar .rs-crumb").count()) === 0, "Alt+← comes back to the property you came from");
await item("Payments").click({ button: "right" });
await p.locator(".rs-menu").getByRole("menuitem", { name: "Go to Application" }).click();
await p.waitForTimeout(300);
await item("Application Number").click();
await p.getByLabel("Label", { exact: true }).fill("App number");
ok((await p.locator(".rs-unsaved").innerText()).includes("Unsaved in 2 resources"), "changes in two resources are counted together");
await topSave().click();
ok((await p.locator(".rs-confirm").innerText()).includes("to Loan") && (await p.locator(".rs-confirm").innerText()).includes("to Application"), "the confirm lists each resource");
await confirmSave().click();
await p.waitForTimeout(400);
const last = (await saves()).slice(-2).map((x) => x.resource).sort().join();
ok(last === "Application,Loan" && (await p.locator(".rs-notice").innerText()).includes("Saved 2 resources") && (await p.locator(".rs-unsaved").count()) === 0, "Save saves both, one after the other");
await p.getByRole("button", { name: "‹ Back" }).click();
await p.waitForTimeout(300);
ok((await p.locator(".rs-select select").inputValue()) === "Loan", "Back goes back too");

// ===== one column, the full width, with the same gap under every card =====
await item("Amount").click();
const gaps = () =>
  p.evaluate(() => {
    // the space from each card to the next block below it, in the same column
    // (Favourites with none picked has no card)
    const blocks = [...document.querySelectorAll(".pe-flow > .pe-block:not(.is-wide)")].filter((el) => el.querySelector(".pe-card")).map((el) => {
      const card = el.querySelector(".pe-card").getBoundingClientRect();
      const box = el.getBoundingClientRect();
      return { left: Math.round(box.left), top: box.top, cardBottom: card.bottom };
    });
    const out = [];
    for (let i = 1; i < blocks.length; i++) if (blocks[i].left === blocks[i - 1].left) out.push(Math.round(blocks[i].top - blocks[i - 1].cardBottom));
    return out;
  });
await p.setViewportSize({ width: 1900, height: 900 });
await p.waitForTimeout(200);
const lefts = await p.evaluate(() => [...new Set([...document.querySelectorAll(".pe-flow > .pe-block")].map((el) => Math.round(el.getBoundingClientRect().left)))]);
const g = await gaps();
ok(lefts.length === 1 && g.length > 2 && g.every((x) => x === g[0]), `even on a wide page it's one column, with the same gap under each card (${g.join(", ")} px)`);
await p.screenshot({ path: out + "/m3-wide.png" });

// ===== the resource picker: the instance's own resources first, then the core ones =====
const groups = await p.evaluate(() => [...document.querySelectorAll(".rs-select optgroup")].map((g) => g.label + ": " + [...g.querySelectorAll("option")].map((o) => o.value).join(",")));
ok(groups.join(" | ") === "Resources: Application,Deal,Loan,LoanApplication,LoanCategory | Core resources: User", "the resource picker lists the non-core resources first, then the core ones: " + groups.join(" | "));

// ===== Show in: Saturn's hide… settings, shown the other way round (0.3.25) =====
await p.selectOption(".rs-select select", "Loan");
await p.waitForTimeout(300);
await item("Term").click();
const formsSwitch = p.locator(".pe-block", { hasText: "Show in" }).getByRole("switch", { name: "Forms", exact: true });
ok((await p.locator(".pe-part-title").allInnerTexts()).includes("Show in") && (await formsSwitch.isChecked()), "Visibility has Show in, and a property that isn't hidden is on");
await formsSwitch.click();
const termDraft = await p.evaluate(() => window.acquireVsCodeApi().getState().works.Loan.drafts.term);
ok(termDraft.hideInForm === true && (await p.locator(".pe-block", { hasText: "Show in" }).locator(".pe-row").first().innerText()).includes("was on"), "switching it off stores hideInForm: true, as Saturn does, and says it was on");
await formsSwitch.click();
ok((await p.evaluate(() => window.acquireVsCodeApi().getState().works.Loan?.drafts?.term?.hideInForm)) === false, "switching it back on stores hideInForm: false");
await p.getByRole("button", { name: "Discard" }).click();

// ===== the resource's workflows: a button opens each on the Workflows screen (0.3.26) =====
await p.selectOption(".rs-select select", "Application");
await p.waitForTimeout(300);
const wfButtons = await p.locator(".rs-workflows .rs-wf").allInnerTexts();
ok(wfButtons.length === 2 && wfButtons[0].includes("Workflow") && wfButtons[0].includes("Loan process") && wfButtons[1].includes("Hook") && (await p.locator(".rs-wf").nth(1).getAttribute("title")).includes("after create"), "the resource's workflow and its hooks' workflows each have a button");
await p.locator(".rs-wf", { hasText: "Loan process" }).click();
ok(await p.evaluate(() => window.__posted.some((m) => m.type === "openWorkflow" && m.payload.workflowId === "wf-1")), "the button asks the extension to open that workflow");
// and the Workflows screen opens the workflow it's sent
const w = await b.newPage({ viewport: { width: 1400, height: 860 } });
await w.goto("http://localhost:8765/csp.html");
await w.waitForTimeout(900);
await w.evaluate(() => window.dispatchEvent(new MessageEvent("message", { data: { type: "showWorkflow", payload: { workflow: { id: "wf_tickets", name: "Support tickets", stages: [] } } } })));
await w.waitForTimeout(900);
ok((await w.locator(".nv-wf-switch").innerText()).includes("Support tickets"), "the Workflows screen opens the workflow it's sent (showWorkflow)");
await w.close();

ok(errs.length === 0, "no page or CSP errors " + JSON.stringify(errs));
await b.close();
