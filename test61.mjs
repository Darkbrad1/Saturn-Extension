// v0.3.71: a Create or Property Updater step's properties are one tight line each (name left, box right), the grey
// key · type line shows only while typing in that box; + Add sits at the right of the Properties title and opens a
// menu to search and tick several properties at once, where typed text that isn't a property becomes a key of its
// own; such a key is a highlighted box that can be renamed. A workflow can be renamed in Workflow settings, by
// double-clicking its name in the top bar, or from a card's right-click menu; one Undo puts the name back.
import { chromium } from "playwright";
const out = process.env.SHOTS ?? "shots";
const b = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium" });
const p = await b.newPage({ viewport: { width: 1500, height: 1000 } });
const errs = [];
p.on("pageerror", (e) => errs.push("pageerror: " + e.message));
p.on("console", (m) => /Content Security|Refused/.test(m.text()) && errs.push("CSP: " + m.text()));
const ok = (c, msg) => console.log((c ? "PASS " : "FAIL ") + msg);
const panel = p.locator(".fg-panel");
const prop = (key) => panel.locator(`[data-prop="${key}"]`);
const def = (id) => p.evaluate((id) => JSON.parse(JSON.stringify(window.__getDef(id))), id);

// ===== the rows, on the owner's Note step =====
await p.goto("http://localhost:8765/csp.html?app");
await p.waitForTimeout(1000);
await p.locator(".nv-card", { hasText: "Application" }).click();
await p.waitForTimeout(900);
await p.locator(".nv-ol-item", { hasText: "Withdraw" }).first().click();
await p.waitForTimeout(900);
await p.locator(".react-flow__node", { has: p.locator(".nv-node-title", { hasText: /^Note$/ }) }).first().click();
await p.waitForTimeout(1000);
const creator = await prop("creator").boundingBox(), role = await prop("creator_role").boundingBox();
ok(creator.height < 40 && role.y - (creator.y + creator.height) < 8, `each property is one tight line (${Math.round(creator.height)} px high, ${Math.round(role.y - creator.y - creator.height)} px apart)`);
const app = await prop("application").boundingBox();
const appLabel = await prop("application").locator(".nv-field-name").boundingBox(), appBox = await prop("application").locator(".nv-record input").boundingBox();
ok(app.height < 40 && Math.abs(appLabel.y + appLabel.height / 2 - (appBox.y + appBox.height / 2)) < 6, "a record picker too: its name beside its box");
ok(!(await prop("creator").locator(".nv-field-caption").isVisible()), "the grey key · type line is hidden");
await p.locator(".nv-recform").first().screenshot({ path: `${out}/v0371-rows.png` });
await prop("creator").locator("input").last().click();
await p.waitForTimeout(150);
ok((await prop("creator").locator(".nv-field-caption").isVisible()) && (await prop("creator").locator(".nv-field-caption").innerText()) === "creator · string", "and shows while typing in that box");
const after = await prop("creator_role").boundingBox();
ok(Math.abs(after.y - role.y) < 1, "showing it moves nothing");
await p.locator(".nv-recform").first().screenshot({ path: `${out}/v0371-caption.png` });

// ===== + Add =====
const head = panel.locator(".nv-recform-head");
const btn = head.locator(".nv-addprops-btn");
const hb = await head.boundingBox(), bb = await btn.boundingBox();
ok((await btn.innerText()).includes("Add") && hb.x + hb.width - (bb.x + bb.width) < 4, "+ Add is a button at the far right of the Properties title");
await btn.click();
await p.waitForTimeout(150);
const menu = panel.locator(".nv-addprops-pop");
ok((await menu.count()) === 1 && (await menu.locator(".nv-addprops-row").allInnerTexts()).join() .includes("updated_at") && !(await menu.innerText()).includes("creator_role"), "it opens a menu of the properties not shown yet");
await p.keyboard.type("{{ _params.role }}");
await p.waitForTimeout(150);
const own = menu.locator(".nv-addprops-row.is-own");
ok((await own.count()) === 1 && (await own.innerText()).includes("{{ _params.role }}"), "typed text that isn't a property is offered as a key of its own");
await own.locator("input").check();
await p.locator(".nv-addprops-pop .nv-menu-search").fill("");
await menu.locator(".nv-addprops-row", { hasText: "updated_at" }).locator("input").check();
await p.screenshot({ path: `${out}/v0371-add-menu.png` });
await menu.getByRole("button", { name: "Add 2 properties" }).click();
await p.waitForTimeout(300);
ok((await prop("{{ _params.role }}").count()) === 1 && (await prop("updated_at").count()) === 1 && (await menu.count()) === 0, "Add puts both in at once and closes the menu");

// ===== a key of its own =====
const key = prop("{{ _params.role }}").locator(".nv-prop-key");
ok((await key.locator("input").inputValue()) === "{{ _params.role }}" && (await key.locator(".token").count()) > 0, "a key of its own is a box, with its {{ template }} highlighted");
await prop("{{ _params.role }}").locator("input").last().fill("{{ _form.staff }}");
await prop("{{ _params.role }}").locator("input").last().press("Enter");
await p.waitForTimeout(600);
const note = async () => (await def()).stages[0].actions.find((a) => a.action === "withdraw").task.commands.find((s) => s.operator === "create" && s.id !== "RICHNOTE");
ok((await note()).data.properties["{{ _params.role }}"] === "{{ _form.staff }}", "its value is saved under it");
await p.locator(".nv-recform").first().screenshot({ path: `${out}/v0371-own-key.png` });
await key.locator("input").fill("{{ _params.staff_role }}");
await key.locator("input").press("Enter");
await p.waitForTimeout(600);
let props = (await note()).data.properties;
ok(props["{{ _params.staff_role }}"] === "{{ _form.staff }}" && !("{{ _params.role }}" in props), "changing the key renames it, keeping its value");
ok(Object.keys(props).indexOf("{{ _params.staff_role }}") === Object.keys(props).length - 1, "and its place");
const k2 = prop("{{ _params.staff_role }}").locator(".nv-prop-key input");
await k2.fill("creator");
await k2.press("Enter");
await p.waitForTimeout(400);
ok((await k2.inputValue()) === "{{ _params.staff_role }}" && "{{ _params.staff_role }}" in (await note()).data.properties, "a key already in the step is refused and put back");

// ===== renaming a workflow =====
await p.goto("http://localhost:8765/csp.html");
await p.waitForTimeout(900);
await p.locator(".nv-card", { hasText: "Support tickets" }).click({ button: "right" });
await p.waitForTimeout(150);
await p.screenshot({ path: `${out}/v0371-card-menu.png` });
await p.getByRole("menuitem", { name: "Rename" }).click();
const cardBox = p.locator(".nv-card .nv-rename-box");
ok((await cardBox.count()) === 1 && (await cardBox.inputValue()) === "Support tickets", "a card's right-click menu has Rename, which edits its name in place");
await cardBox.fill("Help desk");
await cardBox.press("Enter");
await p.waitForTimeout(600);
ok((await def("wf_tickets")).name === "Help desk" && (await p.locator(".nv-card", { hasText: "Help desk" }).count()) === 1, "the new name is kept and shows on its card");

await p.locator(".nv-card", { hasText: "Order fulfilment" }).click();
await p.waitForTimeout(800);
await p.locator(".nv-wf-switch").dblclick();
await p.waitForTimeout(150);
const top = p.locator(".nv-topbar .nv-rename-box");
ok((await top.count()) === 1 && (await p.locator(".nv-wf-menu").count()) === 0, "double-clicking the name in the top bar edits it there");
await top.fill("Orders");
await p.screenshot({ path: `${out}/v0371-top-rename.png` });
await top.press("Enter");
await p.waitForTimeout(600);
ok((await def("wf_orders")).name === "Orders" && (await p.locator(".nv-wf-switch").innerText()).includes("Orders"), "Enter renames it");
await p.locator(".nv-wf-switch").click();
await p.waitForTimeout(500);
ok((await p.locator(".nv-wf-menu .nv-picker-item", { hasText: "Orders" }).count()) === 1 && (await p.locator(".nv-wf-menu .nv-picker-item", { hasText: "Help desk" }).count()) === 1, "the switcher lists both by their new names");
await p.keyboard.press("Escape");
await p.mouse.click(700, 500);

await p.locator(".nv-ol-workflow").click();
await p.waitForTimeout(500);
const nameBox = panel.locator(".fg-row", { has: p.locator(".fg-label", { hasText: /^Name$/ }) }).locator("input");
ok((await nameBox.inputValue()) === "Orders", "Workflow settings has a Name box");
await nameBox.fill("Order fulfilment (EU)");
await nameBox.press("Enter");
await p.waitForTimeout(600);
ok((await def("wf_orders")).name === "Order fulfilment (EU)", "and it renames the workflow too");
await panel.locator("#wf-info").scrollIntoViewIfNeeded().catch(() => {});
await p.screenshot({ path: `${out}/v0371-settings-rename.png` });
await p.locator(".nv-topbar").getByRole("button", { name: "Undo" }).click();
await p.waitForTimeout(600);
ok((await def("wf_orders")).name === "Orders", "one Undo puts the last name back");

// ===== a new Debug step's message =====
await p.locator(".nv-ol-item", { hasText: "Approve order" }).click();
await p.waitForTimeout(600);
const before = JSON.stringify(await def("wf_orders"));
await p.keyboard.press("Shift+A");
await p.waitForTimeout(200);
await p.keyboard.type("Debug");
await p.waitForTimeout(150);
await p.locator(".nv-menu-item", { hasText: /^Debug/ }).first().click();
await p.waitForTimeout(600);
const found = [];
JSON.stringify(await def("wf_orders"), (k, v) => (v && v.operator === "debug" && !before.includes(JSON.stringify(v.data)) && found.push(v), v));
ok(found.some((d) => d.data.message === "const form = {{JSON.stringify(_form)}}; const flow = {{JSON.stringify(_flow)}}; const store = {{JSON.stringify(_store)}}; const resource = {{JSON.stringify(_resource)}}; const parameters = {{JSON.stringify(_params)}};"), "a new Debug step's message logs the form, flow, store, resource and parameters");
await p.locator(".react-flow__node", { hasText: "Debug" }).last().click();
await p.waitForTimeout(500);
await p.screenshot({ path: `${out}/v0371-debug.png` });

ok(errs.length === 0, "no page or CSP errors: " + errs.join(" | "));
await b.close();
