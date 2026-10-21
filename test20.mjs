// v0.3.33: a property's access rules are edited like the node view's and the menus' (a switch per kind,
// checkboxes for the groups, users and permissions), on the Resources screen and the Form tab, and saved
// the way Saturn stores them: access_control: {list: [{method, lable, icon, data: [{ref, access_details}]}]}.
import { chromium } from "playwright";
const out = process.env.SHOTS ?? "shots";
const b = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs = [];
p.on("pageerror", (e) => errs.push("pageerror: " + e.message));
p.on("console", (m) => /Content Security|Refused/.test(m.text()) && errs.push("CSP: " + m.text()));
const ok = (c, msg) => console.log((c ? "PASS " : "FAIL ") + msg);
const access = () => p.locator(".pe-access");
const save = async () => {
  await p.locator(".rs-top").getByRole("button", { name: "Save", exact: true }).click();
  await p.locator(".rs-confirm").getByRole("button", { name: "Save", exact: true }).click();
  await p.waitForTimeout(400);
};
const stored = (resource, key) => p.evaluate(([r, k]) => JSON.parse(JSON.stringify(window.__data[r].find((x) => x.key === k).access_control ?? null)), [resource, key]);

// ===== a property with rules =====
await p.goto("http://localhost:8765/resources.html");
await p.waitForTimeout(400);
await p.selectOption(".rs-select select", "Loan");
await p.waitForTimeout(300);
await p.locator(".rs-item", { hasText: "Term" }).first().click();
await p.waitForTimeout(300);
await access().scrollIntoViewIfNeeded();
ok((await access().count()) === 1 && (await p.locator(".pe-row", { hasText: "Access rules" }).locator("textarea").count()) === 0, "Access rules is the rules editor, not a text box");
ok((await access().getByRole("switch", { name: "User groups" }).getAttribute("aria-checked")) === "true", "the stored user group rule shows switched on");
ok(await access().getByRole("checkbox", { name: /Staff/ }).isChecked(), "its group is ticked, read from data[].ref");
ok(!(await access().getByRole("checkbox", { name: /Admins/ }).isChecked()), "other groups are not");
ok((await access().locator(".mn-other", { hasText: "Custom Function" }).count()) === 1, "a Custom Function rule is listed as kept");
ok((await access().getByRole("switch", { name: "Custom Function" }).count()) === 0, "and isn't built here");
await access().getByRole("checkbox", { name: /Admins/ }).check();
await p.waitForTimeout(150);
ok((await p.locator(".pe-row.is-changed", { hasText: "Access rules" }).count()) === 1, "ticking a group is a change");
await p.screenshot({ path: out + "/a1-property-access.png" });
await save();
let ac = await stored("Loan", "term");
const ug = ac?.list?.find((r) => r.method === "user_group");
ok(ug && ug.lable === "User Group" && ug.icon?.__name === "folder", "saved with Saturn's label and icon");
ok(ug && JSON.stringify(ug.data) === JSON.stringify([{ ref: "g-staff", access_details: ["kept"] }, { ref: "g-admin", access_details: [] }]), "a kept group keeps its access_details; a new one gets []");
ok(ac?.list?.some((r) => r.method === "function" && r.data[0] === "(res) => true"), "the Custom Function rule is saved as it was");

// switching the kind off removes the rule
await access().getByRole("switch", { name: "User groups" }).click();
await p.waitForTimeout(150);
await save();
ac = await stored("Loan", "term");
ok(ac?.list?.length === 1 && ac.list[0].method === "function", "switching User groups off removes that rule only");

// ===== a property with no rules =====
await p.locator(".rs-item", { hasText: "Amount" }).first().click();
await p.waitForTimeout(300);
await access().scrollIntoViewIfNeeded();
ok((await access().innerText()).includes("No rules."), "no rules says so");
await access().getByRole("switch", { name: "Permissions" }).click();
await p.waitForTimeout(150);
await access().getByRole("checkbox", { name: /loans\.approve/ }).check();
await p.waitForTimeout(150);
await save();
ac = await stored("Loan", "amount");
ok(JSON.stringify(ac) === JSON.stringify({ list: [{ method: "permission", lable: "Permission", icon: { name: "Key", __name: "key" }, data: [{ ref: "p-approve", access_details: [] }] }] }), "a new rule is stored as {list: [...]} " + JSON.stringify(ac));

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
await access().scrollIntoViewIfNeeded();
ok((await access().count()) === 1, "the Form tab has the same editor");
await access().getByRole("switch", { name: "User groups" }).click();
await p.waitForTimeout(300);
await access().getByRole("checkbox", { name: /Finance/ }).check();
await p.waitForTimeout(1100);
const staff = await p.evaluate(() => window.__defs.wf_tickets.actions[0].form.fields[0].access_control);
ok(staff?.list?.[0]?.method === "user_group" && staff.list[0].data[0]?.ref === "g2", "the rule goes into the workflow's draft " + JSON.stringify(staff));
await p.screenshot({ path: out + "/a2-formtab-access.png" });

ok(errs.length === 0, "no page errors (" + errs.join(" | ") + ")");
await b.close();
