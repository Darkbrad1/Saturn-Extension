// v0.3.61: several menus picked on the Menus screen (Ctrl/Cmd and Shift+click): moved together, crossed out
// together (deleted when you press Save, which names them first), their icon and who can see them edited
// together (Mixed where they differ); and tabs dragged onto another menu: Copy or Move.
import { chromium } from "playwright";
const out = process.env.SHOTS ?? "shots";
const b = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const p = await b.newPage({ viewport: { width: 1500, height: 900 } });
const errs = [];
p.on("pageerror", (e) => errs.push("pageerror: " + e.message));
const ok = (c, msg) => console.log((c ? "PASS " : "FAIL ") + msg);
const menu = (label) => p.locator(".mn-menu", { has: p.locator(".rs-item-label", { hasText: new RegExp(`^${label}(new)?$`) }) });
const tab = (label) => p.locator(".mn-tab", { has: p.locator(".rs-item-label", { hasText: new RegExp(`^${label}\\d*$`) }) });
const menuNames = async () => p.locator(".mn-menu .rs-item-label").allInnerTexts();
const posted = (type) => p.evaluate((t) => window.__posted.filter((m) => m.type === t), type);
const instance = () => p.evaluate(() => JSON.parse(JSON.stringify(window.__menus)));
const save = async () => {
  await p.locator(".rs-top").getByRole("button", { name: "Save", exact: true }).click();
  await p.locator(".rs-confirm").getByRole("button", { name: "Save", exact: true }).click();
  await p.waitForTimeout(600);
};
const open = async () => { await p.goto("http://localhost:8765/menus.html"); await p.waitForTimeout(700); };

// ===== picking several, moving them together =====
await open();
await menu("Loans").click();
await menu("Admin").click({ modifiers: ["Control"] });
ok((await p.locator(".mn-menu.is-selected").count()) === 2, "Ctrl+click picks a second menu");
ok((await p.locator(".mn-tabs").innerText()).includes("2 menus picked"), "the tabs column says so (it shows one menu's tabs)");
await menu("Loans").click({ modifiers: ["Shift"] });
await p.locator(".mn-menus .rs-list").focus();
await menu("Reports").click();
await menu("Loans").click({ modifiers: ["Shift"] });
ok((await p.locator(".mn-menu.is-selected").count()) === 3, "Shift+click picks a run");
await menu("Reports").click();
await menu("Admin").click({ modifiers: ["Control"] });
// drag one of the two: both go before Loans, in order
const a = await menu("Admin").boundingBox(), z = await menu("Loans").boundingBox();
await p.mouse.move(a.x + 40, a.y + a.height / 2);
await p.mouse.down();
await p.mouse.move(z.x + 40, z.y + 3, { steps: 8 });
await p.mouse.up();
await p.waitForTimeout(200);
ok((await menuNames()).join() === "Admin,Reports,Loans", "dragging one moves both, in order: " + (await menuNames()).join());
await menu("Admin").focus();
await p.keyboard.press("Alt+ArrowDown");
ok((await menuNames()).join() === "Loans,Admin,Reports", "Alt+↓ moves both down together: " + (await menuNames()).join());
ok((await posted("reorder")).length === 0, "the order waits for Save");
if (await p.getByRole("button", { name: "Discard", exact: true }).count()) await p.getByRole("button", { name: "Discard", exact: true }).click();

// ===== editing them together =====
await menu("Admin").click();
await menu("Reports").click({ modifiers: ["Control"] });
const detail = p.locator(".mn-detail");
ok((await detail.innerText()).includes("2 menus picked") && (await detail.innerText()).includes("Mixed: they differ"), "the settings: their icon, Mixed (gear, chart-line)");
await detail.locator(".rs-btn", { hasText: "Change…" }).click();
await p.waitForTimeout(200);
await p.locator(".mn-access").getByRole("switch").first().check().catch(() => {});
await p.waitForTimeout(100);
await p.screenshot({ path: out + "/l1-access.png" });
const groupBox = p.locator(".mn-access input[type=checkbox]:not([role=switch])").first();
if (await groupBox.count()) await groupBox.check();
await p.locator(".mn-access").getByRole("button", { name: "Done" }).click();
await p.waitForTimeout(200);
ok((await p.locator(".rs-unsaved").innerText()).includes("2 menus"), "who can see them: a change on both");
await p.getByRole("button", { name: "Discard", exact: true }).click();

// ===== crossed out together, deleted at Save =====
await menu("Admin").click();
await menu("Reports").click({ modifiers: ["Control"] });
await menu("Reports").click({ button: "right" });
await p.locator(".rs-menu").getByRole("menuitem", { name: "Delete 2 menus" }).click();
ok((await p.locator(".mn-menu.is-deleted").count()) === 2 && (await posted("delete")).length === 0, "Delete 2 menus crosses both out; nothing sent yet");
ok((await p.locator(".rs-unsaved").innerText()).includes("2 menus to delete"), "they count as unsaved: " + (await p.locator(".rs-unsaved").innerText()));
await menu("Reports").click({ button: "right" });
await p.locator(".rs-menu").getByRole("menuitem", { name: "Restore 2 menus" }).click();
ok((await p.locator(".mn-menu.is-deleted").count()) === 0, "Restore brings both back");
await menu("Admin").click();
await menu("Reports").click({ modifiers: ["Control"] });
await p.locator(".mn-menus .rs-list").focus();
await p.keyboard.press("Delete");
ok((await p.locator(".mn-menu.is-deleted").count()) === 2, "the Delete key crosses them out too");
await p.locator(".rs-top").getByRole("button", { name: "Save", exact: true }).click();
const confirm = await p.locator(".rs-confirm").innerText();
ok(confirm.includes("Delete 2 menus") && confirm.includes("“Admin”, “Reports”"), "Save's confirm names them");
await p.screenshot({ path: out + "/l2-confirm.png" });
await p.locator(".rs-confirm").getByRole("button", { name: "Save", exact: true }).click();
await p.waitForTimeout(800);
const dels = await posted("delete");
ok(dels.length === 2 && dels.every((d) => d.confirmed === true) && (await instance()).map((m) => m.label).join() === "Loans", "Save deletes them, one after another, without asking again: " + (await instance()).map((m) => m.label).join());
ok(!(await p.locator(".rs-unsaved").count()), "nothing left unsaved");

// ===== tabs onto another menu: Copy or Move =====
await open();
await menu("Loans").click();
await tab("Loans").click();
await tab("Overview").click({ modifiers: ["Control"] });
const t = await tab("Loans").boundingBox(), m = await menu("Admin").boundingBox();
await p.mouse.move(t.x + 40, t.y + t.height / 2);
await p.mouse.down();
await p.mouse.move(m.x + 60, m.y + m.height / 2, { steps: 10 });
await p.mouse.up();
await p.waitForTimeout(200);
const box = p.locator(".mn-tabs-to");
ok((await box.count()) === 1 && (await box.innerText()).includes("2 tabs to Admin"), "dropping two tabs on Admin asks Copy or Move");
await p.screenshot({ path: out + "/l3-ask.png" });
await box.getByRole("menuitem", { name: /^Copy/ }).click();
await p.waitForTimeout(200);
ok((await p.locator(".mn-tab").count()) >= 5, "Copy keeps them here");
await menu("Admin").click();
await p.waitForTimeout(150);
const adminTabs = (await p.locator(".mn-tab .rs-item-label").allInnerTexts()).map((x) => x.replace(/\d+$/, ""));
ok(adminTabs.join() === "Users,Ghosts,Loans,Overview", "and Admin gets copies at the end: " + adminTabs.join());
await menu("Loans").click();
await tab("Applications").click();
const t2 = await tab("Applications").boundingBox(), m2 = await menu("Reports").boundingBox();
await p.mouse.move(t2.x + 40, t2.y + t2.height / 2);
await p.mouse.down();
await p.mouse.move(m2.x + 60, m2.y + m2.height / 2, { steps: 10 });
await p.mouse.up();
await p.waitForTimeout(200);
await p.locator(".mn-tabs-to").getByRole("menuitem", { name: /^Move/ }).click();
await p.waitForTimeout(200);
const loansTabs = (await p.locator(".mn-tab .rs-item-label").allInnerTexts()).map((x) => x.replace(/\d+$/, ""));
ok(!loansTabs.includes("Applications") && !loansTabs.includes("Approved"), "Move takes it (and its sub-tabs) out of Loans: " + loansTabs.join());
await menu("Reports").click();
await p.waitForTimeout(150);
const reportsTabs = (await p.locator(".mn-tab .rs-item-label").allInnerTexts()).map((x) => x.replace(/\d+$/, ""));
ok(reportsTabs.includes("Applications") && reportsTabs.includes("Approved") && reportsTabs.includes("Rejected"), "into Reports, with its sub-tabs: " + reportsTabs.join());
// the test menus' own errors (Admin's Ghost resource, Reports' unknown field) would block Save: cross those tabs out
await tab("").first().locator(".mn-row-btn.is-danger").click().catch(() => {});
await menu("Admin").click();
await tab("Ghosts").locator(".mn-row-btn.is-danger").click();
await save();
const inst = await instance();
const refs = (label) => inst.find((x) => x.label === label).references.map((r) => (r.resource_label ?? "").replace(/<[^>]+>/g, ""));
ok(refs("Admin").join() === "Users,Loans,Overview" && refs("Reports").includes("Applications") && !refs("Loans").includes("Applications"), "saved: " + ["Admin", "Reports", "Loans"].map((l) => `${l}: ${refs(l).join("/")}`).join(" · "));

ok(errs.length === 0, "no page errors (" + errs.join(" | ") + ")");
await b.close();
