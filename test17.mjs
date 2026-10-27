// v0.3.30: the new Menus screen (three columns, like Resources): menus, the picked menu's tab tree, the
// settings; problems beside what they're about; drag and drop; several picked; right-click; the icon
// picker popup; unsaved changes per menu, saved one after another; Open in Saturn. And the node view's
// Hooks section name.
import { chromium } from "playwright";
const out = process.env.SHOTS ?? "shots";
const b = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const p = await b.newPage({ viewport: { width: 1500, height: 900 } });
const errs = [];
p.on("pageerror", (e) => errs.push("pageerror: " + e.message));
p.on("console", (m) => /Content Security|Refused/.test(m.text()) && errs.push("CSP: " + m.text()));
const ok = (c, msg) => console.log((c ? "PASS " : "FAIL ") + msg);
const menu = (label) => p.locator(".mn-menu", { has: p.locator(".rs-item-label", { hasText: new RegExp(`^${label}(new)?$`) }) });
const tab = (label) => p.locator(".mn-tab", { has: p.locator(".rs-item-label", { hasText: new RegExp(`^${label}\\d*$`) }) });
const tabNames = async () => (await p.locator(".mn-tab .rs-item-label").allInnerTexts()).map((t) => t.replace(/\d+$/, ""));
const posted = (type) => p.evaluate((t) => window.__posted.filter((m) => m.type === t), type);
const instance = () => p.evaluate(() => JSON.parse(JSON.stringify(window.__menus)));
const dragTo = async (from, to, where) => {
  const a = await from.boundingBox(), z = await to.boundingBox();
  const y = where === "top" ? z.y + 3 : where === "bottom" ? z.y + z.height - 3 : z.y + z.height / 2;
  await p.mouse.move(a.x + 40, a.y + a.height / 2);
  await p.mouse.down();
  await p.mouse.move(z.x + 40, y, { steps: 8 });
  await p.mouse.up();
  await p.waitForTimeout(150);
};

await p.goto("http://localhost:8765/menus.html");
await p.waitForTimeout(700);

// ===== layout =====
ok((await p.locator(".mn-menu").count()) === 3 && (await p.locator(".mn-menus").count()) === 1 && (await p.locator(".mn-tabs").count()) === 1 && (await p.locator(".mn-detail").count()) === 1, "three columns: menus, tabs, settings");
const root = await p.locator(".rs-root").boundingBox();
ok(root.width >= 1490, `the screen is the full width (${Math.round(root.width)})`);
ok((await menu("Loans").getAttribute("aria-selected")) === "true" && (await tabNames()).join(",") === "Applications,Approved,Rejected,Loans,Overview", "the first menu is picked; its tabs show with sub-tabs under their tab");
ok((await p.locator(".mn-detail").getByLabel("Label", { exact: true }).inputValue()) === "Loans", "the menu's label is at the top of the settings");
ok((await menu("Loans").locator(".mn-menu-icon svg title").textContent()) === "briefcase", "hovering a menu's icon shows its name");
ok((await p.getByRole("button", { name: "Add a menu" }).innerText()) === "+" && (await p.getByRole("button", { name: "Add a tab" }).innerText()) === "+", "the add buttons are just +");

// ===== problems beside what they're about =====
ok((await menu("Admin").locator(".mn-mark.is-error").count()) === 1 && (await menu("Reports").locator(".mn-mark.is-warning").count()) === 1, "a menu card shows a red or yellow mark for its problems");
await menu("Admin").click();
await p.waitForTimeout(200);
ok((await tab("Ghosts").locator(".mn-mark.is-error").count()) === 1 && (await tab("Users").locator(".mn-mark").count()) === 0, "the tab with the problem has the mark, the others don't");
await tab("Ghosts").click();
await p.waitForTimeout(200);
ok((await p.locator(".pe-row", { has: p.locator("#mn-resource") }).locator(".mn-problems").innerText()).includes("There is no resource called Ghost"), "the message shows under the setting it's about");
await menu("Reports").click();
await p.waitForTimeout(300);
await p.locator(".mn-tab").first().click();
await p.waitForTimeout(300);
ok((await p.locator(".pe-row", { has: p.locator("#mn-caption") }).locator(".mn-problems").innerText()).includes("No caption"), "a missing caption is flagged under Caption");

// ===== folding and keyboard =====
await menu("Loans").click();
await p.waitForTimeout(200);
await tab("Applications").click();
await p.keyboard.press("ArrowLeft");
await p.waitForTimeout(100);
ok((await tabNames()).join(",") === "Applications,Loans,Overview" && (await tab("Applications").locator(".mn-sub-count").innerText()) === "2", "← folds a tab, showing how many sub-tabs it has");
await p.keyboard.press("ArrowRight");
await p.keyboard.press("ArrowDown");
await p.waitForTimeout(100);
ok((await tab("Approved").getAttribute("aria-selected")) === "true", "→ unfolds it, ↓ moves to the next row");
await p.keyboard.press("ArrowLeft");
await p.waitForTimeout(100);
ok((await tab("Applications").getAttribute("aria-selected")) === "true", "← on a sub-tab goes to its tab");

// ===== moving tabs: Alt+arrows, dragging, into and out of a tab =====
await tab("Loans").click();
await p.keyboard.press("Alt+ArrowUp");
await p.waitForTimeout(100);
ok((await tabNames()).join(",") === "Loans,Applications,Approved,Rejected,Overview", "Alt+↑ moves a tab up past a tab and its sub-tabs");
await dragTo(tab("Overview"), tab("Loans"), "middle");
// another parent: the Copy or Move box (0.3.62)
await p.locator(".mn-tabs-to").getByRole("menuitem", { name: /^Move/ }).click();
await p.waitForTimeout(150);
ok((await tabNames()).join(",") === "Loans,Overview,Applications,Approved,Rejected", "dragging onto the middle of a tab makes it a sub-tab");
ok((await tab("Overview").getAttribute("aria-level")) === "2", "it's now one level in");
await dragTo(tab("Overview"), tab("Applications"), "top");
// another parent: the Copy or Move box (0.3.62)
await p.locator(".mn-tabs-to").getByRole("menuitem", { name: /^Move/ }).click();
await p.waitForTimeout(150);
ok((await tabNames()).join(",") === "Loans,Overview,Applications,Approved,Rejected" && (await tab("Overview").getAttribute("aria-level")) === "1", "dragging it above a tab brings it back out");
await dragTo(tab("Applications"), tab("Loans"), "middle");
ok((await tab("Applications").getAttribute("aria-level")) === "1" && (await tabNames()).join(",") === "Applications,Approved,Rejected,Loans,Overview", "a tab with sub-tabs can't become a sub-tab (two levels only): it lands beside it");
await dragTo(tab("Rejected"), tab("Approved"), "top");
ok((await tabNames()).join(",") === "Applications,Rejected,Approved,Loans,Overview", "sub-tabs reorder within their tab");
ok((await menu("Loans").locator(".rs-dot").count()) === 1 && (await p.locator(".rs-unsaved").innerText()).includes("1 menu"), "the menu has unsaved changes");

// ===== several picked, Mixed =====
await tab("Loans").click();
await tab("Overview").click({ modifiers: ["Control"] });
await p.waitForTimeout(150);
ok((await p.locator(".pe-many").innerText()).includes("Editing 2 tabs") && (await p.locator("#mn-caption").count()) === 0, "Ctrl+click picks two; the caption is left out");
ok((await p.locator(".pe-row", { hasText: "Tab icon" }).locator(".pe-mixed").count()) === 1, "a setting they don't share shows Mixed");
await tab("Rejected").click();
await tab("Approved").click({ modifiers: ["Shift"] });
await p.waitForTimeout(150);
await p.getByRole("switch", { name: "Turn off batch actions" }).click();
await p.waitForTimeout(150);
ok((await p.getByRole("switch", { name: "Turn off batch actions" }).getAttribute("aria-checked")) === "true", "Shift+click picks a run; a switch changes all of them");

// ===== right-click =====
await tab("Loans").click();
await tab("Loans").click({ button: "right" });
await p.locator(".rs-menu").getByRole("menuitem", { name: "Duplicate" }).click();
await p.waitForTimeout(150);
ok((await tabNames()).join(",") === "Applications,Rejected,Approved,Loans,Loans (copy),Overview", "Duplicate puts a copy right below");
await tab("Applications").click({ button: "right" });
await p.locator(".rs-menu").getByRole("menuitem", { name: "Copy settings" }).click();
await tab("Loans \\(copy\\)").click({ button: "right" });
await p.locator(".rs-menu").getByRole("menuitem", { name: /Paste settings/ }).click();
ok((await p.getByRole("switch", { name: "What it opens" }).getAttribute("aria-checked")) === "false" && (await p.getByRole("switch", { name: "Look" }).getAttribute("aria-checked")) === "true", "Paste settings asks which groups; What it opens starts off");
await p.getByRole("switch", { name: "What it opens" }).click();
await p.getByRole("dialog").getByRole("button", { name: "Paste" }).click();
await p.waitForTimeout(150);
ok((await tab("Loans \\(copy\\)").locator(".rs-item-key").innerText()).startsWith("Application · filtered") && (await tabNames()).includes("Loans (copy)"), "it brings over what it opens and the filter, not the caption");

// ===== removing and restoring =====
await tab("Loans \\(copy\\)").click();
await p.keyboard.press("Delete");
await p.waitForTimeout(100);
ok((await tab("Loans \\(copy\\)").getAttribute("class")).includes("is-deleted") && (await p.locator(".rs-gone").innerText()).includes("removed"), "Delete crosses a tab out until Save");
await tab("Loans \\(copy\\)").locator(".mn-row-btn", { hasText: "↺" }).click();
await p.waitForTimeout(100);
ok(!(await tab("Loans \\(copy\\)").getAttribute("class")).includes("is-deleted"), "↺ on its row restores it");
await tab("Loans \\(copy\\)").hover();
await tab("Loans \\(copy\\)").locator(".mn-row-btn.is-danger").click();
await p.waitForTimeout(100);
ok((await tab("Loans \\(copy\\)").getAttribute("class")).includes("is-deleted"), "× on the row removes it");

// ===== the icon picker =====
await p.locator(".mn-detail").getByRole("button", { name: /Menu icon/ }).click();
await p.waitForTimeout(150);
const picker = p.getByRole("dialog", { name: "Pick an icon" });
const pickerBox = await picker.boundingBox();
ok((await picker.count()) === 1 && (await picker.evaluate((e) => getComputedStyle(e).position)) === "fixed" && pickerBox.width < 400, "the icon picker is a popup over the page");
await picker.getByLabel("Search icons").fill("rocket");
await p.waitForTimeout(100);
await picker.getByRole("button", { name: "rocket", exact: true }).hover();
ok((await picker.locator(".mn-picker-name").innerText()) === "rocket" && (await picker.getByRole("button", { name: "rocket", exact: true }).getAttribute("title")) === "rocket", "hovering an icon shows its name");
await picker.getByRole("button", { name: "rocket", exact: true }).click();
await p.waitForTimeout(100);
ok((await picker.count()) === 0 && (await menu("Loans").locator(".mn-menu-icon svg title").textContent()) === "rocket", "picking one closes the popup and sets the menu's icon");
await p.locator(".mn-detail").getByRole("button", { name: /Menu icon/ }).click();
await p.keyboard.press("Escape");
await p.waitForTimeout(100);
ok((await p.getByRole("dialog", { name: "Pick an icon" }).count()) === 0, "Esc closes it");

// ===== who can see it =====
await p.getByRole("button", { name: "Change…" }).click();
await p.waitForTimeout(200);
await p.getByRole("dialog", { name: "Who can see this menu" }).getByLabel("Admins").check();
await p.getByRole("dialog", { name: "Who can see this menu" }).getByRole("button", { name: "Done" }).click();
await p.waitForTimeout(100);
ok((await p.locator(".pe-row", { hasText: "Who can see it" }).innerText()).includes("User Group (2)"), "the access box adds a group");
await p.screenshot({ path: out + "/n1-menus.png" });

// ===== moving menus, a new menu =====
await dragTo(menu("Reports"), menu("Loans"), "top");
ok((await p.locator(".mn-menu .rs-item-label").allInnerTexts()).join(",") === "Reports,Loans,Admin", "dragging a menu changes the order (until Save)");
await p.getByRole("button", { name: "Add a menu" }).click();
await p.waitForTimeout(150);
ok((await p.locator(".mn-menu.is-selected .rs-new-pill").count()) === 1 && (await p.locator(".mn-top-errors").count()) === 1 && (await p.getByRole("button", { name: "Save", exact: true }).isDisabled()), "a new menu needs a label and icon: Save waits");
await p.locator("#mn-menu-label").fill("Ops");
await p.locator(".mn-detail").getByRole("button", { name: /Menu icon/ }).click();
await p.getByRole("dialog", { name: "Pick an icon" }).getByLabel("Search icons").fill("truck");
await p.keyboard.press("Enter");
await p.getByRole("button", { name: "Add a tab" }).click();
await p.locator("#mn-resource").selectOption("User");
await p.locator("#mn-caption").fill("People");
await p.waitForTimeout(150);
ok(!(await p.getByRole("button", { name: "Save", exact: true }).isDisabled()), "with a label, an icon and a tab it can be saved");

// ===== saving =====
await p.getByRole("button", { name: "Save", exact: true }).click();
const confirm = await p.locator(".rs-confirm").innerText();
ok(/Save 2 menus and the menu order/.test(confirm) && confirm.includes("Loans") && confirm.includes("removes “Loans (copy)”") && confirm.includes("Ops") && confirm.includes("new menu"), "the confirm lists each menu, what it removes, and the order");
await p.locator(".rs-confirm").getByRole("button", { name: "Save" }).click();
await p.waitForTimeout(900);
const saves = await posted("save");
const mi = await instance();
const loans = mi.find((m) => m.id === "menu-loans");
ok(saves.length === 2 && saves[0].id === "menu-loans" && saves[1].id === null, "each menu is saved in turn (the new one with no id)");
ok(loans.icon === "rocket" && loans.references.map((r) => r.resource_label.replace(/<[^>]*>/g, "")).join(",") === "Applications,Loans,Overview", "the instance got the new icon and tabs; the removed tab is gone");
ok(loans.references[0].sub_menus.map((s) => s.resource_label.replace(/<[^>]*>/g, "")).join(",") === "Rejected,Approved" && loans.references[1].sub_menus.length === 0 && loans.references[2].sub_menus === undefined, "sub-tabs are saved where they were moved; a tab that had no sub-tab list still has none");
ok(loans.references[0].sub_menus.every((s) => s.disableBatchActions === true), "the switch changed on both sub-tabs");
ok(loans.access_control[0].data.join(",") === "g-staff,g-admin" && loans.access_control[0].lable === "User Group", "the access rule is saved as Saturn stores it");
const reorder = (await posted("reorder"))[0];
ok(reorder && reorder.ids.join(",") === "menu-reports,menu-loans,menu-admin,menu-new-1", `then the order, with the new menu's id (${reorder?.ids})`);
ok((await p.locator(".rs-unsaved").count()) === 0 && (await p.locator(".rs-notice.is-ok").count()) === 1 && (await p.locator(".mn-menu.is-selected .rs-item-label").innerText()) === "Ops", "nothing is left unsaved and the new menu stays picked");

// a menu nobody touched is written back as it was read
const admin = mi.find((m) => m.id === "menu-admin");
ok(!saves.some((s) => s.id === "menu-admin") && admin.references.length === 2, "untouched menus aren't sent");
const untouched = JSON.stringify(mi.find((m) => m.id === "menu-reports").references);
await menu("Reports").click();
await tab("Loan").click();
await p.locator("#mn-caption").fill("Loan book");
await p.locator("#mn-caption").fill("");
await p.waitForTimeout(100);
ok((await p.locator(".rs-unsaved").count()) === 0, "a change put back leaves nothing unsaved");
ok(JSON.stringify((await instance()).find((m) => m.id === "menu-reports").references) === untouched, "and nothing was sent");

// ===== Open in Saturn, delete, unsaved kept per menu =====
await p.getByRole("button", { name: "Open in Saturn ↗" }).click();
ok((await posted("openInSaturn")).length === 1, "Open in Saturn asks the host to open the menus page");
await menu("Admin").click();
await p.locator("#mn-menu-label").fill("Admin area");
await menu("Reports").click();
await p.locator("#mn-menu-label").fill("Reports 2");
await menu("Admin area").click();
await p.waitForTimeout(100);
ok((await p.locator("#mn-menu-label").inputValue()) === "Admin area" && (await p.locator(".rs-unsaved").innerText()).includes("2 menus"), "each menu keeps its own unsaved changes");
await menu("Admin area").click({ button: "right" });
await p.locator(".rs-menu").getByRole("menuitem", { name: "Discard its changes" }).click();
await p.waitForTimeout(100);
ok((await menu("Admin").count()) === 1 && (await p.locator(".rs-unsaved").innerText()).includes("1 menu"), "right-click › Discard its changes drops just that menu's");
await p.getByRole("button", { name: "Discard", exact: true }).click();
await menu("Admin").click({ button: "right" });
await p.locator(".rs-menu").getByRole("menuitem", { name: /Delete menu/ }).click();
await p.waitForTimeout(300);
// 0.3.61: crossed out until Save (test48.mjs saves it)
ok((await posted("delete")).length === 0 && (await menu("Admin").getAttribute("class")).includes("is-deleted"), "Delete menu crosses the card out until Save");

// ===== the node view's Hooks section =====
await p.goto("http://localhost:8765/csp.html");
await p.waitForTimeout(900);
await p.locator(".nv-picker-item", { hasText: "Order fulfilment" }).click();
await p.waitForTimeout(800);
await p.getByText("Workflow settings").click();
await p.waitForTimeout(400);
ok((await p.locator(".fg-panel").innerText()).includes("Hooks") && !(await p.locator(".fg-panel").getByText("Resources", { exact: true }).count()), "the workflow's hooks section is called Hooks");

ok(errs.length === 0, "no page errors (" + errs.join(" | ") + ")");
await b.close();
