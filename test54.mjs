// v0.3.66: what Saturn's operator list says, used in the node view: an operator's description in the side panel
// (and as the Add menu item's tooltip), its Output (what the next step gets), disabled operators left out of the
// Add menu, and a record picker for a map lookup (Create Task's Person): search the records, or type a template.
import { chromium } from "playwright";
const out = process.env.SHOTS ?? "shots";
const b = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const p = await b.newPage({ viewport: { width: 1500, height: 950 } });
const errs = [];
p.on("pageerror", (e) => errs.push("pageerror: " + e.message));
const ok = (c, msg) => console.log((c ? "PASS " : "FAIL ") + msg);
const steps = () => p.evaluate(() => JSON.parse(JSON.stringify(window.__getDef("wf_orders").stages[0].actions[0].task.commands)));

await p.goto("http://localhost:8765/csp.html");
await p.waitForTimeout(900);
await p.locator(".nv-picker-item", { hasText: "Order fulfilment" }).click();
await p.waitForTimeout(800);
await p.locator(".nv-ol-item", { hasText: "Approve order" }).click();
await p.waitForTimeout(600);

// ===== the Add menu =====
await p.keyboard.press("Shift+A");
await p.waitForTimeout(200);
const names = await p.locator(".nv-menu-item").allInnerTexts();
ok(!names.some((n) => n.includes("Save Locally")), "a disabled operator (Save Locally) isn't offered");
const ct = p.locator(".nv-menu-item", { hasText: "Create Task" });
ok((await ct.count()) === 1 && (await ct.getAttribute("title")).startsWith("Creates a durable platform task"), "an operator's description is its tooltip in the Add menu");
await ct.click();
await p.waitForTimeout(300);

// ===== the record picker, in the Add form =====
const modal = p.locator(".nv-modal");
ok((await modal.count()) === 1, "Create Task asks for its required settings first");
await modal.locator("input").first().fill("Call the customer");
const person = modal.locator(".nv-record input");
ok((await person.count()) === 1, "Person is a record picker, not a plain box");
await person.click();
await person.fill("gra");
await p.waitForTimeout(300);
const rows = await modal.locator(".nv-record-row").allInnerTexts();
ok(rows.length === 1 && rows[0].includes("Grace Hopper"), "typing searches the records: " + rows.join(" | "));
await p.screenshot({ path: `${out}/v0366-picker.png` });
await modal.locator(".nv-record-row", { hasText: "Grace Hopper" }).click();
await p.waitForTimeout(150);
ok((await person.inputValue()) === "u2" && (await modal.locator(".nv-record-name").innerText()) === "Grace Hopper", "picking one puts its id in the box and its name beside it");
await modal.getByRole("button", { name: "Add" }).click();
await p.waitForTimeout(600);
let task = (await steps()).find((s) => s.operator === "create_task");
ok(task && task.data.assignee_user === "u2" && task.data.title === "Call the customer", "the step is added with the picked person's id");

// ===== the side panel =====
await p.locator(".react-flow__node", { hasText: "Create Task" }).first().click();
await p.waitForTimeout(600);
const desc = p.locator(".fg-op-desc");
ok((await desc.count()) === 1 && (await desc.innerText()).startsWith("Creates a durable platform task"), "the side panel shows the operator's description under its name");
const outSec = p.locator(".fg-panel").locator("text=Output").first();
ok((await outSec.count()) === 1, "and an Output section");
ok((await p.locator(".fg-op-out").innerText()) === "The task that was created." && (await p.locator(".fg-op-field code").allInnerTexts()).join() === "id,status", "Output says what the next step gets, with its fields");
await p.screenshot({ path: `${out}/v0366-panel.png` });

// a template typed into the picker
const panelPerson = p.locator(".fg-panel .nv-record input");
await panelPerson.fill("{{ _resource.owner }}");
await p.waitForTimeout(150);
ok((await p.locator(".fg-panel .nv-record-list").count()) === 0, "while a {{ }} template is typed, no record list gets in the way");
await panelPerson.press("Enter");
await p.waitForTimeout(800);
task = (await steps()).find((s) => s.operator === "create_task");
ok(task.data.assignee_user === "{{ _resource.owner }}", "a typed template is kept as typed: " + task.data.assignee_user);

// a step without an output
await p.locator(".react-flow__node", { hasText: "Update Record" }).first().click();
await p.waitForTimeout(500);
ok((await p.locator(".fg-op-desc").innerText()).includes("Update fields") && (await p.locator(".fg-op-out").count()) === 0, "an operator without an output shows just its description");

ok(errs.length === 0, "no page errors: " + errs.join(" | "));
await b.close();
