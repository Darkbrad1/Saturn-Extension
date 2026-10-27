// v0.3.62: on the Menus screen, a space in a tab's caption, Undo / Redo of unsaved changes (Ctrl+Z,
// Ctrl+Shift+Z / Ctrl+Y, the top bar's buttons), and Copy or Move when tabs go under another parent. In the
// node view, a double-click on a stage (the layers panel's row, the workflow map's header) opens its settings.
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
const levels = async () => p.locator(".mn-tab").evaluateAll((els) => els.map((e) => e.getAttribute("aria-level")).join(""));
const dragTo = async (from, to, where) => {
  const a = await from.boundingBox(), z = await to.boundingBox();
  const y = where === "top" ? z.y + 3 : where === "bottom" ? z.y + z.height - 3 : z.y + z.height / 2;
  await p.mouse.move(a.x + 40, a.y + a.height / 2);
  await p.mouse.down();
  await p.mouse.move(z.x + 40, y, { steps: 8 });
  await p.mouse.up();
  await p.waitForTimeout(200);
};
const box = () => p.locator(".mn-tabs-to");
const topBtn = (name) => p.locator(".rs-top").getByRole("button", { name, exact: true });

await p.goto("http://localhost:8765/menus.html");
await p.waitForTimeout(700);

// ===== a space in a caption =====
await tab("Loans").click();
await p.waitForTimeout(200);
const caption = p.locator("#mn-caption");
await caption.fill("");
await caption.pressSequentially("All loans");
await p.waitForTimeout(150);
ok((await caption.inputValue()) === "All loans", "a space can be typed in a caption: " + (await caption.inputValue()));
ok((await tabNames()).includes("All loans"), "the tab row shows the caption with its space");
await caption.press("End");
await caption.pressSequentially(" ");
await p.waitForTimeout(100);
ok((await caption.inputValue()) === "All loans ", "a space at the end stays in the box while typing");
await caption.blur();
await p.waitForTimeout(100);
ok((await caption.inputValue()) === "All loans", "leaving the box shows the stored caption, trimmed");

// ===== undo / redo =====
ok(!(await topBtn("Undo").isDisabled()) && (await topBtn("Redo").isDisabled()), "the top bar has Undo (on) and Redo (off)");
await p.locator(".mn-tree").click({ position: { x: 5, y: 5 } }).catch(() => {});
await p.keyboard.press("Control+z");
await p.waitForTimeout(200);
ok((await tabNames()).includes("Loans") && !(await tabNames()).includes("All loans"), "Ctrl+Z undoes the typing as one step: " + (await tabNames()).join(","));
ok((await p.locator(".rs-unsaved").count()) === 0, "back to what's saved: nothing unsaved");
await p.keyboard.press("Control+Shift+z");
await p.waitForTimeout(200);
ok((await tabNames()).includes("All loans"), "Ctrl+Shift+Z redoes it");
await p.keyboard.press("Control+z");
await p.keyboard.press("Control+y");
await p.waitForTimeout(200);
ok((await tabNames()).includes("All loans"), "Ctrl+Y redoes too");
// a change in another menu, then undo shows that menu
await menu("Admin").click();
await p.waitForTimeout(200);
await tab("Ghosts").click();
await p.keyboard.press("Delete");
await p.waitForTimeout(150);
ok((await tab("Ghosts").getAttribute("class")).includes("is-deleted"), "a tab crossed out in Admin");
await menu("Loans").click();
await p.waitForTimeout(200);
await topBtn("Undo").click();
await p.waitForTimeout(200);
ok((await menu("Admin").getAttribute("aria-selected")) === "true" && !(await tab("Ghosts").getAttribute("class")).includes("is-deleted"), "Undo puts it back and shows the menu it changed");
await topBtn("Undo").click();
await p.waitForTimeout(200);
await menu("Loans").click();
await p.waitForTimeout(200);
ok((await tabNames()).includes("Loans") && (await p.locator(".rs-unsaved").count()) === 0, "undo again: the caption is back too, nothing unsaved");
ok((await topBtn("Undo").isDisabled()) && !(await topBtn("Redo").isDisabled()), "nothing left to undo; Redo is on");
// a search box keeps its own undo
await p.locator(".rs-search").fill("lo");
await p.locator(".rs-search").press("Control+z");
await p.waitForTimeout(100);
ok(!(await topBtn("Redo").isDisabled()), "Ctrl+Z in the search box isn't the screen's undo");
await p.locator(".rs-search").fill("");
// Discard can be undone
await tab("Overview").click();
await p.keyboard.press("Delete");
await p.waitForTimeout(100);
await topBtn("Discard").click();
await p.waitForTimeout(150);
ok((await p.locator(".rs-unsaved").count()) === 0, "Discard drops the change");
await topBtn("Undo").click();
await p.waitForTimeout(200);
ok((await tab("Overview").getAttribute("class")).includes("is-deleted"), "Undo brings back what Discard dropped");
await topBtn("Discard").click();
await p.waitForTimeout(150);

// ===== Copy or Move under another parent =====
ok((await tabNames()).join(",") === "Applications,Approved,Rejected,Loans,Overview" && (await levels()) === "12211", "Loans: Applications with two sub-tabs, Loans, Overview");
await dragTo(tab("Rejected"), tab("Approved"), "top");
ok((await box().count()) === 0 && (await tabNames()).join(",") === "Applications,Rejected,Approved,Loans,Overview", "reordering under the same tab doesn't ask");
await dragTo(tab("Overview"), tab("Loans"), "middle");
ok((await box().count()) === 1 && (await box().innerText()).includes("1 tab into Loans"), "a tab dropped into another tab asks Copy or Move: " + (await box().innerText()).replace(/\s+/g, " "));
await box().getByRole("menuitem", { name: /^Copy/ }).click();
await p.waitForTimeout(200);
ok((await tabNames()).join(",") === "Applications,Rejected,Approved,Loans,Overview,Overview" && (await levels()) === "122121", "Copy: a copy under Loans, the tab stays at the top level");
ok((await p.locator(".mn-tab[aria-selected=true]").getAttribute("aria-level")) === "2", "the copy is picked");
await dragTo(tab("Approved"), tab("Loans"), "middle");
ok((await box().innerText()).includes("into Loans"), "a sub-tab dropped into another tab asks too");
await box().getByRole("menuitem", { name: /^Move/ }).click();
await p.waitForTimeout(200);
ok((await tabNames()).join(",") === "Applications,Rejected,Loans,Overview,Approved,Overview" && (await levels()) === "121221", "Move: it leaves Applications and goes under Loans, at the end: " + (await tabNames()).join(",") + " " + (await levels()));
await dragTo(tab("Rejected"), tab("Applications"), "top");
ok((await box().innerText()).includes("to the top level"), "a sub-tab dragged out to the top level asks: " + (await box().innerText()).replace(/\s+/g, " "));
await box().getByRole("menuitem", { name: "Cancel" }).click();
await p.waitForTimeout(150);
ok((await tabNames()).join(",") === "Applications,Rejected,Loans,Overview,Approved,Overview" && (await box().count()) === 0, "Cancel leaves everything where it was");
await dragTo(tab("Rejected"), tab("Applications"), "top");
await box().getByRole("menuitem", { name: /^Copy/ }).click();
await p.waitForTimeout(200);
ok((await tabNames()).join(",") === "Rejected,Applications,Rejected,Loans,Overview,Approved,Overview" && (await levels()) === "1121221", "Copy out: a top-level copy, the sub-tab stays");
await topBtn("Undo").click();
await p.waitForTimeout(200);
ok((await tabNames()).join(",") === "Applications,Rejected,Loans,Overview,Approved,Overview", "a copy is undone in one step");
await p.screenshot({ path: `${out}/v0362-menus.png` });

// ===== the node view: double-click a stage =====
await p.goto("http://localhost:8765/csp.html?app");
await p.waitForTimeout(1000);
await p.locator(".nv-picker-item", { hasText: "Application" }).click();
await p.waitForTimeout(900);
const head = p.locator(".nv-ol-stagehead", { hasText: /^Underwriting/ }).first();
const openBefore = await p.locator(".nv-ol-stage", { has: head }).locator(".nv-ol-item").count();
await head.dblclick();
await p.waitForTimeout(400);
ok((await p.locator(".fg-head-sub").innerText()).startsWith("Stage"), "double-clicking a stage's row opens its settings in the side panel: " + (await p.locator(".fg-head-sub").innerText()));
ok((await p.locator(".fg-head-title").innerText()) === "Underwriting", "the stage's own settings");
ok((await p.locator(".nv-ol-edit").count()) === 0, "it no longer starts a rename");
ok((await p.locator(".nv-ol-stage", { has: head }).locator(".nv-ol-item").count()) === openBefore, "and the stage stays open or closed as it was");
await head.click({ button: "right" });
ok((await p.locator(".nv-ctx-item", { hasText: /^Rename$/ }).count()) === 1, "Rename is still in the right-click menu");
await p.locator(".nv-menu-back").click({ position: { x: 5, y: 5 } });
await p.waitForTimeout(150);
await p.locator(".nv-ol-workflow").click();
await p.waitForTimeout(1200);
ok((await p.locator(".mp-root").count()) === 1, "the workflow map");
const mapHead = p.locator(".mp-head", { hasText: /^Underwriting$/ });
await mapHead.click();
await p.waitForTimeout(80);
await mapHead.click();
await p.waitForTimeout(500);
ok((await p.locator(".fg-head-sub").innerText()).startsWith("Stage") && (await p.locator(".fg-head-title").innerText()) === "Underwriting", "double-clicking a stage's header on the map opens its settings");
await p.screenshot({ path: `${out}/v0362-stage.png` });

ok(errs.length === 0, "no page errors: " + errs.join(" | "));
await b.close();
