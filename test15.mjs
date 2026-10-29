// v0.3.27: the node view's Form tab (an action's form) and Parameters tab (a command's parameters),
// with the Resources screen's property editor, no settings menu, and edits going to the draft.
import { chromium } from "playwright";
const out = process.env.SHOTS ?? "shots";
const b = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs = [];
p.on("pageerror", (e) => errs.push("pageerror: " + e.message));
p.on("console", (m) => /Content Security|Refused/.test(m.text()) && errs.push("CSP: " + m.text()));
const ok = (c, msg) => console.log((c ? "PASS " : "FAIL ") + msg);
const panel = p.locator(".fg-panel");
const tab = (name) => panel.locator(".fg-tab", { hasText: new RegExp(`^${name}`) });
const esc = (t) => t.replace(/[()]/g, "\\$&");
const item = (label) => panel.locator(".rs-item", { has: p.locator(".rs-item-label", { hasText: new RegExp(`^${esc(label)}\\*?(new)?$`) }) });
const sw = (name) => panel.getByRole("switch", { name, exact: true });
const form = async () => (await p.evaluate(() => window.__defs.wf_tickets)).actions[0].form.fields;

await p.goto("http://localhost:8765/csp.html");
await p.waitForTimeout(900);
await p.locator(".nv-picker-item", { hasText: "Support tickets" }).click();
await p.waitForTimeout(900);
await p.locator(".nv-ol-item", { hasText: "Escalate" }).click();
await p.waitForTimeout(600);

// ===== the tab =====
const names = await panel.locator(".fg-tab").allInnerTexts();
ok(names.some((n) => /^Form/.test(n)), `an action gets a Form tab (${names.join(", ")})`);
ok((await panel.innerText()).includes("Edit them in the Form tab"), "Design points to the Form tab instead of its old field list");
const narrow = (await panel.boundingBox()).width;
await tab("Form").click();
await p.waitForTimeout(500);
const wide = (await panel.boundingBox()).width;
ok(wide >= 1440 * 0.65 && wide > narrow, `the panel gets wider on the Form tab (${Math.round(narrow)} -> ${Math.round(wide)})`);
ok((await panel.locator(".fg-resize").count()) === 1 && (await panel.locator(".pe-menu").count()) === 0, "a resize handle (0.3.67) and no settings menu on the Form tab");
ok((await item("Staff").count()) === 1 && (await item("Staff").locator(".rs-chip.is-static").innerText()) === "User", "the field list shows Staff with its blue User chip");

// ===== editing one field =====
await item("Staff").click();
await p.waitForTimeout(300);
ok((await panel.locator(".pe-page").count()) === 1 && (await panel.getByLabel("Label", { exact: true }).inputValue()) === "Staff", "picking a field shows its settings");
await panel.getByLabel("Label", { exact: true }).fill("Staff member");
await p.waitForTimeout(1100);
ok((await form())[0].label === "Staff member" && (await form())[0].key === "staff", "a change goes to the draft a moment later");
ok((await panel.locator(".pe-was").first().innerText()).includes("Staff"), "\"was\" shows the saved value");
ok((await p.locator(".fg-tab-badge").innerText()) !== "0", "the change is in the Changes tab's count");
await sw("Required").click();
await tab("Design").click();
await p.waitForTimeout(400);
ok((await form())[0].required === true, "leaving the tab at once still sends the change");
await tab("Form").click();
await p.waitForTimeout(400);
await item("Staff member").click();
await p.waitForTimeout(200);
await panel.getByRole("button", { name: "Put back" }).first().click();
await p.waitForTimeout(1100);
ok((await form())[0].label === "Staff", "Put back returns it to the saved value");

// ===== adding, moving, several picked =====
await panel.getByRole("button", { name: "Add a field" }).click();
await panel.getByLabel("New field label").fill("Due date");
ok((await panel.getByLabel("New field key").inputValue()) === "due_date", "a new field's key is made from its label");
await panel.getByLabel("New field type").getByRole("radio", { name: /Date/ }).click();
await panel.getByRole("button", { name: "Add", exact: true }).click();
await p.waitForTimeout(1100);
let fs = await form();
ok(fs.length === 2 && fs[1].key === "due_date" && fs[1].type === "date", "+ adds a field at the end");
ok((await item("Due date").locator(".rs-new-pill").count()) === 1, "it's marked new");
await item("Due date").focus();
await p.keyboard.press("Alt+ArrowUp");
await p.waitForTimeout(1100);
ok((await form()).map((f) => f.key).join(",") === "due_date,staff", "Alt+↑ moves it up");
await item("Staff").click({ modifiers: ["Control"] });
await p.waitForTimeout(200);
ok((await panel.locator(".rs-item.is-selected").count()) === 2 && (await panel.getByLabel("Label", { exact: true }).count()) === 0, "Ctrl+click picks two; the label is left out");
ok((await panel.locator(".pe-page").innerText()).includes("Mixed"), "a setting they don't share shows Mixed");
await p.screenshot({ path: out + "/f1-form-tab.png" });

// ===== right-click =====
await item("Staff").click();
await item("Staff").click({ button: "right" });
await panel.locator(".rs-menu").getByRole("menuitem", { name: "Duplicate" }).click();
await p.waitForTimeout(1100);
fs = await form();
ok(fs.map((f) => f.key).join(",") === "due_date,staff,staff_copy" && fs[2].map?.reference === "User", "Duplicate puts a copy right below with key staff_copy");
await item("Staff").click();
await item("Staff").click({ button: "right" });
await panel.locator(".rs-menu").getByRole("menuitem", { name: "Copy settings" }).click();
await item("Due date").click();
await item("Due date").click({ button: "right" });
await panel.locator(".rs-menu").getByRole("menuitem", { name: /Paste settings/ }).click();
ok((await panel.getByRole("dialog", { name: "Paste settings" }).count()) === 1, "Paste settings asks which groups");
await panel.getByRole("dialog").getByRole("button", { name: "Paste" }).click();
await p.waitForTimeout(1100);
fs = await form();
ok(fs[0].key === "due_date" && fs[0].label === "Due date" && JSON.stringify(fs[0].views) === JSON.stringify(fs[1].views), "pasted settings come over, the label and key stay");
await item("Staff (copy)").click();
await p.keyboard.press("Delete");
await p.waitForTimeout(1100);
ok((await form()).map((f) => f.key).join(",") === "due_date,staff", "Delete removes the picked field");

// ===== a mapped chip =====
await item("Staff").locator(".rs-chip").click();
await p.waitForTimeout(200);
ok((await p.evaluate(() => (window.__opened || []).some((o) => o.type === "openResourceScreen" && o.resource === "User"))), "the chip opens User on the Resources screen");

// ===== a refused key =====
await item("Staff").click();
await panel.getByLabel("Key", { exact: true }).fill("due_date");
await p.waitForTimeout(1100);
ok((await form())[1].key === "staff" && (await panel.locator(".ft-bad").count()) === 1, "a key used twice isn't sent, and says why");
await panel.getByLabel("Key", { exact: true }).fill("staff_id");
await p.waitForTimeout(1100);
ok((await form())[1].key === "staff_id", "once fixed it's sent");

// ===== a lookup function (v0.3.27: Saturn keeps it in lookup_reference) =====
await p.goto("http://localhost:8765/csp.html");
await p.waitForTimeout(900);
const FN = "async (form, { Resource }) =>{\n    return [ form.id ];\n}";
await p.evaluate((fn) => Object.assign(window.__defs.wf_orders.stages[0].actions[0].form.fields[0], { lookup_type: "function", lookup_function_item_data_type: "string", lookup_reference: fn }), FN);
await p.locator(".nv-picker-item", { hasText: "Order fulfilment" }).click();
await p.waitForTimeout(900);
await p.locator(".nv-ol-item", { hasText: "Approve order" }).first().click();
await p.waitForTimeout(600);
await tab("Form").click();
await p.waitForTimeout(500);
await item("Note").click();
await p.waitForTimeout(300);
const fnBox = panel.getByLabel("Lookup function", { exact: true });
ok((await fnBox.count()) === 1 && (await fnBox.inputValue()).includes("return [ form.id ]"), "a function lookup shows its function");
ok((await panel.getByLabel("Item data type").inputValue()) === "string", "and its item data type");
await panel.locator(".pe-code", { has: p.getByLabel("Lookup function", { exact: true }) }).getByRole("button", { name: "Open in a file" }).click();
await p.waitForTimeout(300);
const opened = await p.evaluate(() => (window.__opened || []).find((o) => o.type === "openFieldCode"));
ok(opened && opened.key === "note" && opened.path.join(".") === "lookup_reference" && opened.text.includes("form.id") && opened.contextName, "Open in a file opens that function as a file, tied to the field");
await p.evaluate(() => window.__saveFieldFile("async () => {\n  return [1];\n}"));
await p.waitForTimeout(600);
const note = async () => (await p.evaluate(() => window.__defs.wf_orders.stages[0].actions[0].form.fields[0]));
ok((await note()).lookup_reference.includes("return [1]") && (await fnBox.inputValue()).includes("return [1]"), "saving the file writes it into the draft, and the tab shows it");
await p.screenshot({ path: out + "/f3-lookup-function.png" });

// ===== a command's parameters, and no tab elsewhere =====
await p.locator(".nv-ol-item", { hasText: "Notify customer" }).first().click();
await p.waitForTimeout(600);
await tab("Parameters").click();
await p.waitForTimeout(600);
ok((await tab("Parameters").count()) === 1 && (await item("Template").count()) === 1, "a command gets a Parameters tab with its parameters");
await p.screenshot({ path: out + "/f2-parameters.png" });
await p.getByText("Workflow settings").click();
await p.waitForTimeout(600);
ok((await tab("Form").count()) === 0 && (await tab("Parameters").count()) === 0 && (await panel.locator(".fg-tab.is-active").innerText()) === "Design", "the workflow's settings have no form tab, and the panel goes back to Design");

// ===== the Resources screen opened on a resource =====
await p.goto("http://localhost:8765/resources.html");
await p.waitForTimeout(400);
await p.evaluate(() => window.dispatchEvent(new MessageEvent("message", { data: { type: "show", payload: { resource: "Loan" } } })));
await p.waitForTimeout(400);
ok((await p.locator(".rs-select select").inputValue()) === "Loan" && (await p.locator(".rs-item").count()) > 0, "the Resources screen opens on the resource a chip names");

ok(errs.length === 0, "no page errors (" + errs.join(" | ") + ")");
await b.close();
