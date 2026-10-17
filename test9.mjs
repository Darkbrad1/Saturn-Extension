// v0.3.3: node view first, vertical flow, Shift+click multi-select with bulk actions, stage guides, Changes tab.
import { chromium } from "playwright";
const out = process.env.SHOTS ?? "shots";
const b = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs = [];
p.on("pageerror", (e) => errs.push("pageerror: " + e.message));
p.on("console", (m) => /Content Security|Refused/.test(m.text()) && errs.push("CSP: " + m.text()));
const ok = (c, msg) => console.log((c ? "PASS " : "FAIL ") + msg);
const def = (id) => p.evaluate((id) => window.__getDef(id), id);
const panel = p.locator(".fg-panel");
const node = (t) => p.locator(".react-flow__node", { hasText: t }).first();
const box = async (t) => node(t).boundingBox();

await p.goto("http://localhost:8765/csp.html");
await p.waitForTimeout(900);

// ===== node view is the default view =====
ok(await p.locator(".nv-root").count() === 1 && await p.locator(".nv-launch").count() === 0, "the node view opens first");
ok(await p.locator(".nv-picker-item").count() === 3, "with the workflow picker when none is open");
await p.locator(".nv-picker-item", { hasText: "Order fulfilment" }).click();
await p.waitForTimeout(900);
ok((await p.locator(".nv-wf-switch").innerText()).includes("Order fulfilment"), "picking one opens it in the node view");
await p.getByRole("button", { name: "List view" }).click();
await p.waitForTimeout(200);
ok(await p.locator(".nv-launch").count() === 1 && (await p.locator("#root").innerText()).includes("Order fulfilment"), "List view is one click away, on the same workflow");
await p.reload();
await p.waitForTimeout(1200);
ok(await p.locator(".nv-root").count() === 1, "and the node view opens first again next time");
if (await p.locator(".nv-picker-item").count()) {
  await p.locator(".nv-picker-item", { hasText: "Order fulfilment" }).click();
  await p.waitForTimeout(900);
}

// ===== vertical by default =====
await p.locator(".nv-ol-item", { hasText: "Approve order" }).click();
await p.waitForTimeout(700);
ok((await p.locator(".nv-dir-toggle").innerText()).includes("Vertical"), "flows are vertical by default");
let a = await box("Update Record"), c = await box("For Each");
ok(c.y > a.y + a.height && Math.abs((c.x + c.width / 2) - (a.x + a.width / 2)) < 4, "steps run top to bottom, centred");
const tb = await box("Send Email"), fb = await box("Notify User");
ok(Math.abs(tb.y - fb.y) < 2 && tb.x < fb.x, "If branches sit side by side, true on the left");
ok(await p.locator(".react-flow__node", { hasText: "Update Record" }).first().locator(".react-flow__handle-top").count() === 1, "inputs on top, outputs at the bottom");
await p.screenshot({ path: out + "/93-vertical.png" });
// a wire still takes a dropped node in vertical mode
await p.locator(".nv-dir-toggle").click();
await p.waitForTimeout(700);
a = await box("Update Record"); c = await box("For Each");
ok(c.x > a.x + a.width && (await p.locator(".nv-dir-toggle").innerText()).includes("Horizontal"), "the toggle switches to left → right");
await p.locator(".nv-dir-toggle").click();
await p.waitForTimeout(700);
ok((await p.locator(".nv-dir-toggle").innerText()).includes("Vertical"), "and back");

// ===== stage guides =====
const guide = await p.locator(".nv-ol-stage").first().locator(".nv-ol-stage-body").evaluate((el) => {
  const s = getComputedStyle(el, "::before");
  return { w: s.width, h: el.getBoundingClientRect().height, bg: s.backgroundColor };
});
ok(guide.w === "1px" && guide.h > 40, `a guide line runs down a stage's actions (${JSON.stringify(guide)})`);
ok(await p.locator(".nv-ol-stage + .nv-ol-stage").evaluate((el) => getComputedStyle(el).borderTopWidth) === "1px", "and a divider separates stages");
ok(await p.locator(".nv-ol-stage-body.has-active").count() === 1, "the open action's stage guide is highlighted");

// ===== Shift+click multi-select =====
await p.keyboard.press("Home");
await p.waitForTimeout(400);
await node("Update Record").click();
await node("Send Email").click({ modifiers: ["Shift"] });
await node("Notify User").click({ modifiers: ["Shift"] });
await p.waitForTimeout(300);
ok(await p.locator(".react-flow__node.selected").count() === 3, "Shift+click selects several steps");
ok((await panel.locator(".fg-head-title").innerText()) === "3 steps selected", "the panel shows the selection");
await p.screenshot({ path: out + "/94-multi.png" });
await node("Send Email").click({ modifiers: ["Shift"] });
await p.waitForTimeout(200);
ok(await p.locator(".react-flow__node.selected").count() === 2, "Shift+click again removes one");
await node("Send Email").click({ modifiers: ["Shift"] });
await p.waitForTimeout(200);
// right-click one of them: the menu acts on all
await node("Notify User").click({ button: "right" });
await p.waitForTimeout(200);
ok((await p.locator(".nv-ctx-title").textContent()) === "3 steps selected", "right-click keeps the selection and titles the menu");
ok(await p.locator(".nv-ctx-item", { hasText: "Disable 3 steps" }).count() === 1, "with actions for all of them");
await p.screenshot({ path: out + "/95-multi-menu.png" });
await p.locator(".nv-ctx-item", { hasText: "Disable 3 steps" }).click();
await p.waitForTimeout(500);
let cmds = (await def("wf_orders")).stages[0].actions[0].task.commands;
ok(cmds[0].mock === true && cmds[1].true.commands[0].mock === true && cmds[1].false.commands[0].mock === true && !cmds[2].mock, "disables all three");
ok((await panel.locator(".fg-head-title").innerText()) === "3 steps selected", "the selection survives the edit");
await node("Update Record").click({ button: "right" });
await p.locator(".nv-ctx-item", { hasText: "Enable 3 steps" }).click();
await p.waitForTimeout(500);
cmds = (await def("wf_orders")).stages[0].actions[0].task.commands;
ok(!cmds[0].mock && !cmds[1].true.commands[0].mock, "Enable all brings them back");
// one Ctrl+Z for the whole bulk change
await p.keyboard.press("m");
await p.waitForTimeout(500);
cmds = (await def("wf_orders")).stages[0].actions[0].task.commands;
ok(cmds[0].mock && cmds[1].false.commands[0].mock, "M disables all of them");
await p.locator(".react-flow__pane").click({ position: { x: 60, y: 760 } });
await p.keyboard.press("Control+z");
await p.waitForTimeout(500);
cmds = (await def("wf_orders")).stages[0].actions[0].task.commands;
ok(!cmds[0].mock && !cmds[1].true.commands[0].mock && !cmds[1].false.commands[0].mock, "a single Ctrl+Z undoes it for all");
// duplicate several (indices shift correctly)
await node("Update Record").click();
await node("For Each").click({ modifiers: ["Shift"] });
await p.waitForTimeout(200);
await p.keyboard.press("Shift+D");
await p.waitForTimeout(600);
cmds = (await def("wf_orders")).stages[0].actions[0].task.commands;
ok(cmds.map((x) => x.operator ?? x.type).join() === "update_record,update_record,command,Each,Each,reference", "Shift+D duplicates each right after itself: " + cmds.map((x) => x.operator ?? x.type).join());
// copy several, paste at the end
await node("If").click();
await node("Notify customer").click({ modifiers: ["Shift"] });
await p.keyboard.press("Control+c");
await p.waitForTimeout(300);
ok((await p.locator(".nv-toasts").innerText()).includes("Copied 2 steps"), "Ctrl+C copies all selected");
// a container and something inside it: only the container counts
await node("If").click();
await node("Send Email").click({ modifiers: ["Shift"] });
await p.waitForTimeout(200);
ok((await panel.locator(".fg-head-title").first().innerText()) !== "2 steps selected", "a step inside a selected container isn't counted twice");
// delete several in one go
await node("Update Record").click();
await p.locator(".react-flow__node", { hasText: "Update Record" }).nth(1).click({ modifiers: ["Shift"] });
await node("Notify customer").click({ modifiers: ["Shift"] });
await p.waitForTimeout(200);
await panel.locator(".fg-btn", { hasText: "Delete all" }).click();
await p.waitForTimeout(600);
cmds = (await def("wf_orders")).stages[0].actions[0].task.commands;
ok(cmds.map((x) => x.operator ?? x.type).join() === "command,Each,Each", "Delete all removes exactly those: " + cmds.map((x) => x.operator ?? x.type).join());
ok(await p.locator(".react-flow__node.selected").count() === 0, "and clears the selection");
// Esc clears a selection
await node("If").click();
await p.locator(".react-flow__node", { hasText: "For Each" }).nth(0).click({ modifiers: ["Shift"] });
await p.keyboard.press("Escape");
await p.waitForTimeout(200);
ok(await p.locator(".react-flow__node.selected").count() === 0, "Esc clears the selection");

// ===== Changes tab =====
await panel.locator(".fg-tab", { hasText: "Changes" }).click();
await p.waitForTimeout(200);
ok((await panel.locator(".fg-tab-badge").innerText()) !== "", "the Changes tab shows how many unsaved changes");
const items = await panel.locator(".fg-changes li").allInnerTexts();
console.log("changes:", JSON.stringify(items));
ok(items.length >= 3 && items[0].includes("Deleted 3 steps") && items.some((t) => t.includes("Duplicated 2 steps")), "it lists the workflow's unsaved changes, newest first");
await panel.locator(".fg-changes li").first().locator(".fg-link", { hasText: "Undo" }).click();
await p.waitForTimeout(500);
cmds = (await def("wf_orders")).stages[0].actions[0].task.commands;
ok(cmds.length === 6, "Undo on the newest change undoes it");
const newest = /version:\s*"([\d.]+)"/.exec((await import("node:fs")).readFileSync(new URL("src/changelog.ts", import.meta.url), "utf8"))[1];
ok(await panel.locator(".fg-release").count() >= 4 && (await panel.locator(".fg-release").first().innerText()).includes(newest), `release notes are listed, newest (${newest}) first`);
await p.screenshot({ path: out + "/96-changes.png" });
await panel.locator(".fg-btn", { hasText: "Save to the instance" }).click();
await p.waitForTimeout(500);
ok(await panel.locator(".fg-changes").count() === 0, "after saving there is nothing pending");

console.log("errors:", JSON.stringify(errs));
await b.close();
