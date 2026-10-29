// v0.3.69: a Create or Property Updater step's properties, drawn like Saturn's own forms for them. On the owner's real
// Create step (a Note, saved by Saturn's dialog, csp.html?app): one setting for the resource, each property with its
// input type's control (text, a rich text editor, a record picker, a date), ⇋ for a typed {{ template }}, × to take
// one out, "Add a property" listing the resource's others, an emptied property left out. The rich text editor is
// Notion-like (a bar over picked text, a / menu, Markdown shortcuts) and writes Saturn's HTML. Property Updater gets
// the same, with its resource empty meaning the workflow's own record. The Add form uses it too, and the panel widens.
import { chromium } from "playwright";
const out = process.env.SHOTS ?? "shots";
const b = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const p = await b.newPage({ viewport: { width: 1500, height: 1000 } });
const errs = [];
p.on("pageerror", (e) => errs.push("pageerror: " + e.message));
p.on("console", (m) => /Content Security|Refused/.test(m.text()) && errs.push("CSP: " + m.text()));
const ok = (c, msg) => console.log((c ? "PASS " : "FAIL ") + msg);
const panel = p.locator(".fg-panel");
const prop = (key) => panel.locator(`[data-prop="${key}"]`);
const note = async () => {
  const def = await p.evaluate(() => JSON.parse(JSON.stringify(window.__getDef())));
  return def.stages[0].actions.find((a) => a.action === "withdraw").task.commands.find((s) => s.operator === "create");
};

await p.goto("http://localhost:8765/csp.html?app");
await p.waitForTimeout(1000);
await p.locator(".nv-picker-item", { hasText: "Application" }).click();
await p.waitForTimeout(900);
await p.locator(".nv-ol-item", { hasText: "Withdraw" }).first().click();
await p.waitForTimeout(900);
await p.locator(".react-flow__node", { has: p.locator(".nv-node-title", { hasText: /^Note$/ }) }).first().click();
await p.waitForTimeout(1000);

// ===== how it looks =====
const text = await panel.innerText();
ok(!/Resource Name/.test(text) && (text.match(/^Properties$/gm) ?? []).length === 1, "one Resource setting and one Properties list (not Saturn's resource_name / Properties as well)");
ok((await panel.locator(".nv-recform select").first().inputValue()) === "Note", "the resource is Note");
const names = await panel.locator(".nv-recform .nv-prop > .nv-field > .nv-field-label .nv-field-name, .nv-recform .nv-prop > .nv-field-label .nv-field-name").allInnerTexts();
ok(names.join(",") === "Creator,Creator Role,Application Stage,Description,Application,Created at", "each property by its name from the Note resource: " + names.join(","));
ok((await prop("description").locator(".ql-editor li").count()) === 4 && (await prop("description").locator(".nv-rich-bar").count()) === 0, "the rich text description is an editor showing its list, with no toolbar until text is picked");
ok((await prop("application").locator(".nv-record input").inputValue()) === "APP-000123-QK7Z2D", "the Application is a record picker showing the picked record's name");
ok((await prop("created_at").locator("input").inputValue()) === "" && (await prop("created_at").getByRole("button", { name: "Now" }).count()) === 1, "an unpicked date ({}) shows empty, with a date picker");
const w = (await panel.boundingBox()).width;
ok(Math.abs(w - 1500 * 0.66) < 6, "the panel is wide for it: " + Math.round(w));
await p.screenshot({ path: `${out}/v0369-create.png` });

// ===== a text property =====
await prop("creator").locator("input").fill("Ada");
await prop("creator").locator("input").press("Enter");
await p.waitForTimeout(600);
let n = await note();
ok(n.data.properties.creator === "Ada" && n.data.resource === "Note" && !("resource_name" in n.data) && !("Properties" in n.data), "a change is saved in properties, where Saturn keeps it");

// ===== the rich text editor =====
const ed = prop("description").locator(".ql-editor");
await ed.locator("li").first().click();
await p.keyboard.press("End");
await p.keyboard.down("Shift");
await p.keyboard.press("Home");
await p.keyboard.up("Shift");
await p.waitForTimeout(200);
const bar = prop("description").locator(".nv-rich-bar");
ok((await bar.count()) === 1, "picking text shows the small bar above it");
await p.screenshot({ path: `${out}/v0369-richbar.png` });
await bar.getByRole("button", { name: /^Bold/ }).click();
await p.waitForTimeout(100);
await prop("creator").locator("input").click();
await p.waitForTimeout(700);
n = await note();
ok(/<li data-list="bullet"><strong>adsflkdasj;lfk<\/strong><\/li>/.test(n.data.properties.description), "Bold, then leaving the editor saves Saturn's HTML: " + n.data.properties.description.slice(0, 80));

// the / menu
await ed.locator("li").last().click();
await p.keyboard.press("End");
await p.keyboard.press("Enter");
await p.keyboard.press("Enter");
await p.keyboard.type("/head");
await p.waitForTimeout(200);
const slash = prop("description").locator(".nv-rich-slash");
ok((await slash.count()) === 1 && (await slash.innerText()).includes("Heading 1"), "/ opens the block menu, narrowed by what's typed");
await p.screenshot({ path: `${out}/v0369-slash.png` });
await slash.getByRole("option", { name: /Heading 2/ }).click();
await p.keyboard.type("Next steps");
// a Markdown shortcut
await p.keyboard.press("Enter");
await p.keyboard.type("- ");
await p.keyboard.type("Call back");
await prop("creator").locator("input").click();
await p.waitForTimeout(700);
n = await note();
ok(/<h2>Next steps<\/h2>/.test(n.data.properties.description), "a heading from the / menu");
ok(/<ol><li data-list="bullet">Call back<\/li><\/ol>/.test(n.data.properties.description), "and a list from typing \"- \"");

// ===== ⇋, ×, emptying, adding =====
await prop("application").getByRole("button", { name: /Type a template for application/ }).click();
await p.waitForTimeout(200);
await prop("application").locator("textarea").fill("{{ _resource.id }}");
await prop("application").locator("textarea").blur();
await p.waitForTimeout(600);
n = await note();
ok(n.data.properties.application === "{{ _resource.id }}", "⇋ turns a property into a box for a {{ template }}");
await prop("creator_role").locator("input").fill("");
await prop("creator_role").locator("input").press("Enter");
await p.waitForTimeout(600);
n = await note();
ok(!("creator_role" in n.data.properties) && (await prop("creator_role").count()) === 1, "an emptied property is left out of the step (its row stays until the step is left)");
await prop("application_stage").getByRole("button", { name: "Remove application_stage" }).click();
await p.waitForTimeout(600);
n = await note();
ok(!("application_stage" in n.data.properties) && (await prop("application_stage").count()) === 0, "× takes a property out");
// (0.3.71: + Add at the right of the title opens a menu to tick properties in)
await panel.locator(".nv-addprops-btn").click();
await p.waitForTimeout(150);
const offered = await panel.locator(".nv-addprops-row").allInnerTexts();
ok(offered.some((o) => o.includes("Application Stage") && o.includes("application_stage")) && offered.some((o) => o.includes("Updated at")) && !offered.some((o) => o.includes("creator\n") || /\bcreator$/.test(o)), "+ Add offers the ones not shown: " + offered.join(" | "));
await panel.locator(".nv-addprops-row", { hasText: "application_stage" }).locator("input").check();
await panel.locator(".nv-addprops-foot").getByRole("button", { name: "Add", exact: true }).click();
await p.waitForTimeout(200);
const focused = await p.evaluate(() => document.activeElement?.closest("[data-prop]")?.getAttribute("data-prop"));
await p.keyboard.type("decision");
await p.keyboard.press("Enter");
await p.waitForTimeout(600);
n = await note();
ok(focused === "application_stage" && n.data.properties.application_stage === "decision", "picking one adds its row, ready to type in");

// ===== Property Updater =====
await p.goto("http://localhost:8765/csp.html");
await p.waitForTimeout(900);
await p.locator(".nv-picker-item", { hasText: "Support tickets" }).click();
await p.waitForTimeout(900);
await p.locator(".nv-ol-item", { hasText: "Triage" }).click();
await p.waitForTimeout(700);
await p.locator(".react-flow__node", { hasText: "Property Updater" }).first().click();
await p.waitForTimeout(800);
ok((await panel.innerText()).includes("Not set: the record the workflow runs on"), "Property Updater: an empty resource means the record the workflow runs on");
ok((await panel.locator(".nv-recform .nv-prop-key input").evaluateAll((l) => l.map((i) => i.value))).join(",") === "priority,queue", "its properties are listed (as keys of their own in boxes, as the resource isn't known)");
await panel.locator(".nv-recform select").first().selectOption("orders");
await p.waitForTimeout(800);
const tickets = async () => (await p.evaluate(() => JSON.parse(JSON.stringify(window.__getDef("wf_tickets"))))).stages[0].actions[0].task.commands[0];
let t = await tickets();
ok(t.data.resource_type === "orders", "picking a resource saves it as resource_type");
// two at once from the + Add menu
await panel.locator(".nv-addprops-btn").click();
await panel.locator(".nv-addprops-row", { hasText: "status" }).locator("input").check();
await panel.locator(".nv-addprops-row", { hasText: "rush" }).locator("input").check();
await panel.getByRole("button", { name: "Add 2 properties" }).click();
await p.waitForTimeout(200);
await prop("status").locator("select").selectOption("approved");
await p.waitForTimeout(600);
await prop("rush").locator("select").selectOption("true");
await p.waitForTimeout(600);
t = await tickets();
ok(t.data.properties.status === "approved" && t.data.properties.rush === true && t.data._properties.some((r) => r.key === "status"), "a choice and a true / false are saved as values (and _properties follows)");
await prop("status").getByRole("button", { name: /Type a template for status/ }).click();
await prop("status").locator("textarea").fill("{{ _form.status }}");
await prop("status").locator("textarea").blur();
await p.waitForTimeout(600);
t = await tickets();
ok(t.data.properties.status === "{{ _form.status }}", "⇋ lets a list of choices take a template");
await p.screenshot({ path: `${out}/v0369-updater.png` });

// ===== the Add form =====
await p.locator(".nv-ol-item", { hasText: "Triage" }).click();
await p.waitForTimeout(400);
await p.keyboard.press("Shift+A");
await p.waitForTimeout(200);
await p.keyboard.type("Create");
await p.waitForTimeout(150);
await p.locator(".nv-menu-item", { hasText: /^Create/ }).first().click();
await p.waitForTimeout(300);
const modal = p.locator(".nv-modal");
await modal.locator(".nv-recform select").first().selectOption("Note");
await p.waitForTimeout(400);
await modal.locator(".nv-addprops-btn").click();
await modal.locator(".nv-addprops-row", { hasText: "creator" }).first().locator("input").check();
await modal.locator(".nv-addprops-foot").getByRole("button", { name: "Add", exact: true }).click();
await p.waitForTimeout(200);
await p.keyboard.type("{{ _user.name }}");
await modal.getByRole("button", { name: "Add", exact: true }).last().click();
await p.waitForTimeout(700);
const added = (await p.evaluate(() => JSON.parse(JSON.stringify(window.__getDef("wf_tickets"))))).stages[0].actions[0].task.commands.find((s) => s.operator === "create");
ok(added && added.data.resource === "Note" && added.data.properties.creator === "{{ _user.name }}" && !("id" in added.data) && !("Properties" in added.data), "the Add form adds a Create step the way Saturn's form saves one: " + JSON.stringify(added?.data));

ok(errs.length === 0, "no page errors: " + errs.join(" | "));
await b.close();
