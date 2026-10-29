// v0.3.31: one icon picker everywhere. The Resources screen's Icon and Tab icon settings, and the same
// settings on the node view's Form tab, use the Menus screen's popup picker (names on hover).
import { chromium } from "playwright";
const out = process.env.SHOTS ?? "shots";
const b = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs = [];
p.on("pageerror", (e) => errs.push("pageerror: " + e.message));
p.on("console", (m) => /Content Security|Refused/.test(m.text()) && errs.push("CSP: " + m.text()));
const ok = (c, msg) => console.log((c ? "PASS " : "FAIL ") + msg);
const picker = () => p.getByRole("dialog", { name: "Pick an icon" });
/** Opens the picker from a setting's button, searches, and picks an icon by name. */
const pick = async (button, name) => {
  await button.scrollIntoViewIfNeeded();
  await button.click();
  await picker().getByLabel("Search icons").fill(name);
  await picker().getByRole("button", { name, exact: true }).hover();
  const shown = await picker().locator(".mn-picker-name").innerText();
  await picker().getByRole("button", { name, exact: true }).click();
  return shown;
};

// ===== Resources screen =====
await p.goto("http://localhost:8765/resources.html");
await p.waitForTimeout(400);
await p.locator(".rs-picker-btn").click(); await p.locator(`.rs-picker-item[data-resource=${JSON.stringify("Application")}]`).click();
await p.waitForTimeout(300);
await p.locator(".rs-item", { hasText: "Status" }).first().click();
await p.waitForTimeout(200);
const resButton = p.getByRole("button", { name: /^Icon: none\. Pick an icon/ });
ok((await resButton.count()) === 1 && (await p.locator(".pe-row", { hasText: "A Font Awesome icon." }).locator("input.pe-input").count()) === 0, "the property's Icon setting is the picker button, not a text box");
const shownRes = await pick(resButton, "folder-open");
ok(shownRes === "folder-open", "hovering an icon shows its name");
await p.waitForTimeout(150);
ok((await picker().count()) === 0 && (await p.getByRole("button", { name: /^Icon: folder-open\./ }).count()) === 1, "picking it closes the popup and the setting shows it");
ok((await p.locator(".pe-row.is-changed", { hasText: "A Font Awesome icon." }).count()) === 1, "it counts as a change");
await p.screenshot({ path: out + "/i1-resources.png" });
await p.locator(".rs-top").getByRole("button", { name: "Save", exact: true }).click();
await p.locator(".rs-confirm").getByRole("button", { name: "Save", exact: true }).click();
await p.waitForTimeout(300);
const save = await p.evaluate(() => window.__posted.filter((m) => m.type === "save").pop());
ok(save && save.payload.changes.some((c) => c.path.join(".") === "propertyIcon" && c.value === "folder-open"), "Save writes the icon's name to propertyIcon");

// ===== the node view's Form tab =====
await p.goto("http://localhost:8765/csp.html");
await p.waitForTimeout(900);
await p.locator(".nv-picker-item", { hasText: "Support tickets" }).click();
await p.waitForTimeout(900);
await p.locator(".nv-ol-item", { hasText: "Escalate" }).click();
await p.waitForTimeout(500);
await p.locator(".fg-tab", { hasText: /^Form/ }).click();
await p.waitForTimeout(400);
await p.locator(".fg-panel .rs-item", { hasText: "Staff" }).first().click();
await p.waitForTimeout(300);
const formButton = p.locator(".fg-panel").getByRole("button", { name: /^Icon: none\. Pick an icon/ });
ok((await formButton.count()) === 1, "the Form tab has the same picker button");
const shownForm = await pick(formButton, "user-tie");
ok(shownForm === "user-tie", "and the same popup, with names on hover");
await p.waitForTimeout(1100);
const staff = await p.evaluate(() => window.__defs.wf_tickets.actions[0].form.fields[0]);
ok(staff.propertyIcon === "user-tie", "the picked icon goes into the workflow's draft");
await p.screenshot({ path: out + "/i2-formtab.png" });

// ===== the Menus screen still uses it =====
await p.goto("http://localhost:8765/menus.html");
await p.waitForTimeout(700);
await p.locator(".mn-detail").getByRole("button", { name: /Menu icon/ }).click();
ok((await picker().count()) === 1, "the Menus screen's picker is the same one");

ok(errs.length === 0, "no page errors (" + errs.join(" | ") + ")");
await b.close();
