// v0.3.2: highlighted inputs, Figma scrubbing, date/time pickers, colour pickers, every form-field setting.
import { chromium } from "playwright";
const out = process.env.SHOTS ?? "shots";
const b = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const p = await b.newPage({ viewport: { width: 1440, height: 900 }, timezoneId: "America/Grenada" });
const errs = [];
p.on("pageerror", (e) => errs.push("pageerror: " + e.message));
p.on("console", (m) => /Content Security|Refused/.test(m.text()) && errs.push("CSP: " + m.text()));
const ok = (c, msg) => console.log((c ? "PASS " : "FAIL ") + msg);
const def = (id) => p.evaluate((id) => window.__getDef(id), id);
const panel = p.locator(".fg-panel");
const field = (label) => panel.locator(".nv-field", { has: p.locator(".nv-field-name", { hasText: new RegExp(`^${label}\\*?$`) }) });
const section = (title) => panel.locator(".fg-section", { has: p.locator(".fg-section-title", { hasText: title }) });
const step = async () => (await def("wf_tickets")).actions[0].task.commands[0].data;
const pad = (n) => String(n).padStart(2, "0");
const drag = async (loc, dx) => {
  await loc.scrollIntoViewIfNeeded();
  const bx = await loc.boundingBox();
  const x = bx.x + bx.width / 2, y = bx.y + bx.height / 2;
  await p.mouse.move(x, y);
  await p.mouse.down();
  for (let i = 1; i <= 10; i++) await p.mouse.move(x + (dx * i) / 10, y);
  await p.mouse.up();
  await p.waitForTimeout(500);
};

await p.goto("http://localhost:8765/csp.html");
await p.waitForTimeout(900);
// the node view opens first (0.3.3); these checks start from the list view
await p.getByRole("button", { name: "Back to list view" }).click();
await p.waitForTimeout(200);
await p.getByText("Support tickets").first().click();
await p.waitForTimeout(500);
await p.locator(".nv-launch").click();
await p.waitForTimeout(600);
await p.locator(".nv-ol-item", { hasText: "Escalate" }).click();
await p.waitForTimeout(600);
await p.locator(".react-flow__node", { hasText: "Schedule Follow-up" }).first().click();
await p.waitForTimeout(700);

// ===== syntax highlighting =====
ok(await field("Template").locator(".nv-hl-pre .token.tag").count() > 0, "HTML code is highlighted");
ok(await field("Template").locator(".nv-hl-pre .token.template").count() === 1, "{{ templates }} are highlighted inside code");
ok(await field("Payload").locator(".nv-hl-pre .token.property").count() === 1, "array/JSON params are highlighted as JSON");
const hlColor = await field("Template").locator("textarea").evaluate((el) => getComputedStyle(el).webkitTextFillColor);
ok(/rgba\(0, 0, 0, 0\)|transparent/.test(hlColor), "the real textarea text is hidden under the highlight");
// typing keeps the overlay in sync
await field("Due at").locator("input").fill("{{ record.due }}");
ok(await field("Due at").locator(".nv-hl-pre .token.template").count() === 1, "typing a template highlights it");
await field("Due at").locator("input").press("Escape");
await p.waitForTimeout(200);
ok((await field("Due at").locator("input").inputValue()) === "2026-10-20T13:30:00.000Z", "Esc still reverts");
// alignment: overlay text starts where the input text does
const [ib, pb] = await Promise.all([
  field("Retries").locator("input").evaluate((el) => { const c = getComputedStyle(el); return [el.getBoundingClientRect().left + parseFloat(c.paddingLeft) + parseFloat(c.borderLeftWidth), c.fontSize]; }),
  field("Retries").locator(".nv-hl-pre").evaluate((el) => { const c = getComputedStyle(el); return [el.getBoundingClientRect().left + parseFloat(c.paddingLeft) + parseFloat(c.borderLeftWidth), c.fontSize]; }),
]);
ok(Math.abs(ib[0] - pb[0]) < 0.5 && ib[1] === pb[1], `overlay matches the input's metrics (${ib} vs ${pb})`);

// ===== scrubbing =====
ok((await field("Timeout \\(ms\\)").locator(".nv-hl-suffix").innerText()) === "1.5 s", "milliseconds also shown as seconds");
await drag(field("Retries").locator(".nv-scrub"), 60);
let d = await step();
ok(d.retries > 3, `dragging the label right increases the number (3 → ${d.retries})`);
const after = d.retries;
await drag(field("Retries").locator(".nv-scrub"), -400);
d = await step();
ok(d.retries === 0 || d.retries === "0", `and left decreases it, not below the minimum (→ ${d.retries})`);
await drag(field("Timeout \\(ms\\)").locator(".nv-scrub"), 40);
d = await step();
ok(Number(d.timeout_ms) > 1500 && Number(d.timeout_ms) % 50 === 0, `ms fields scrub in 50 ms steps (→ ${d.timeout_ms})`);
await field("Retries").locator("input").click();
await p.keyboard.press("ArrowUp");
await p.keyboard.press("ArrowUp");
await p.keyboard.press("Enter");
await p.waitForTimeout(400);
ok(String((await step()).retries) === "2", "arrow keys step the number");
// delay field scrubs too
await drag(field("Delay \\(ms\\)").locator(".nv-scrub"), 30);
ok(((await def("wf_tickets")).actions[0].task.commands[0].delay ?? 0) > 0, "the step's delay can be scrubbed");
// a template can't be scrubbed
await field("Retries").locator("input").fill("{{ x }}");
await field("Retries").locator("input").press("Enter");
await p.waitForTimeout(400);
ok(await field("Retries").locator(".nv-scrub.is-off").count() === 1, "a template value turns scrubbing off");
await p.screenshot({ path: out + "/84-scrub.png" });

// ===== dates =====
let t0 = Date.now();
await field("Due at").locator(".nv-now-btn").click();
await p.waitForTimeout(500);
d = await step();
ok(Math.abs(Date.parse(d.due_at) - t0) < 60_000 && /T.*Z$/.test(d.due_at), `Now writes the current date-time (${d.due_at})`);
await field("Remind on").locator(".nv-now-btn").click();
await p.waitForTimeout(500);
const today = await p.evaluate(() => { const n = new Date(); return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}-${String(n.getDate()).padStart(2, "0")}`; });
ok((await step()).remind_on === today, `Today writes today's date (${today})`);
await field("Start time").locator(".nv-now-btn").click();
await p.waitForTimeout(500);
ok(/^\d\d:\d\d$/.test((await step()).start_time), `Now on a time writes HH:mm (${(await step()).start_time})`);
// calendar: pick the 15th of next month
await field("Remind on").locator("button[aria-label='Pick a date']").click();
await p.waitForTimeout(200);
ok(await p.locator(".nv-pop .nv-cal-day.is-today").count() === 1, "calendar marks today");
await p.locator(".nv-pop .nv-cal-nav[aria-label='Next month']").click();
await p.locator(".nv-pop .nv-cal-day:not(.is-other)", { hasText: /^15$/ }).click();
await p.waitForTimeout(500);
const nm = await p.evaluate(() => { const n = new Date(); const m = new Date(n.getFullYear(), n.getMonth() + 1, 15); return `${m.getFullYear()}-${String(m.getMonth() + 1).padStart(2, "0")}-15`; });
ok((await step()).remind_on === nm && await p.locator(".nv-pop").count() === 0, `picking a day writes it and closes (${nm})`);
ok((await field("Remind on").locator(".nv-date-hint").innerText()).includes("15"), "the picked date is spelled out under the field");
// date-time: pick a day and keep the time from the time row
await field("Due at").locator("input").fill("2026-10-20T13:30:00.000Z");
await field("Due at").locator("input").press("Enter");
await p.waitForTimeout(400);
await field("Due at").locator("button[aria-label='Pick a date']").click();
await p.waitForTimeout(200);
ok((await p.locator(".nv-pop .nv-cal-num[aria-label='Hours']").inputValue()) === "09", "date-time picker shows the local time (09:30 in Grenada)");
await p.locator(".nv-pop .nv-cal-num[aria-label='Minutes']").fill("45");
await p.waitForTimeout(300);
ok((await step()).due_at === "2026-10-20T13:45:00.000Z", `changing the time applies (${(await step()).due_at})`);
await p.locator(".nv-pop .nv-cal-day:not(.is-other)", { hasText: /^22$/ }).click();
await p.waitForTimeout(400);
ok((await step()).due_at === "2026-10-22T13:45:00.000Z", "picking a day keeps the time");
ok(await p.locator(".nv-pop").count() === 1, "date-time picker stays open for the time");
await p.screenshot({ path: out + "/85-datetime.png" });
await p.keyboard.press("Escape");
ok(await p.locator(".nv-pop").count() === 0 && await panel.locator(".fg-head-title", { hasText: "Schedule Follow-up" }).count() === 1, "Esc closes the picker and keeps the step selected");
await field("Remind on").locator("button[aria-label='Pick a date']").click();
await p.locator(".nv-pop .nv-mini-btn", { hasText: "Clear" }).click();
await p.waitForTimeout(400);
ok(((await step()).remind_on ?? "") === "", "Clear empties it");
await field("Due at").locator("button[aria-label='Pick a date']").click();
await p.locator(".nv-pop .nv-mini-btn", { hasText: "Clear" }).click();
await p.waitForTimeout(400);
ok((await step()).due_at === "2026-10-22T13:45:00.000Z" && (await field("Due at").innerText()).includes("required"), "a required date can't be cleared (the host says so)");
// the date field is still a text box that takes templates
await field("Due at").locator("input").fill("{{ record.created_at }}");
await field("Due at").locator("input").press("Enter");
await p.waitForTimeout(400);
ok((await step()).due_at === "{{ record.created_at }}", "dates still accept templates");

// ===== colour =====
await field("Label colour").locator(".nv-color-chip").click();
await p.waitForTimeout(200);
ok(await p.locator(".nv-pop .nv-color-sv").count() === 1, "colour param opens a picker");
await p.locator(".nv-pop .nv-color-swatch[title='#a855f7']").click();
await p.waitForTimeout(400);
ok((await step()).color === "#a855f7", "picking a swatch applies");
const sv = await p.locator(".nv-pop .nv-color-sv").boundingBox();
await p.mouse.click(sv.x + sv.width - 2, sv.y + 2);
await p.waitForTimeout(400);
ok(/^#[0-9a-f]{6}$/.test((await step()).color) && (await step()).color !== "#a855f7", `dragging in the colour area applies (${(await step()).color})`);
const hue = await p.locator(".nv-pop .nv-color-hue").boundingBox();
await p.mouse.click(hue.x + 2, hue.y + hue.height / 2);
await p.waitForTimeout(400);
{ const c = (await step()).color; const [r, g, bb] = [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16)); ok(r > 240 && g < 40 && bb < 20, `hue at the left is red (${c})`); }
await p.locator(".nv-pop .nv-color-hex").fill("#123abc");
await p.locator(".nv-pop .nv-color-hex").press("Enter");
await p.waitForTimeout(400);
ok((await step()).color === "#123abc", "typing a hex applies");
await p.screenshot({ path: out + "/86-color.png" });
await p.keyboard.press("Escape");

// ===== stage colour =====
await p.locator(".nv-ol-stagehead", { hasText: "Open" }).hover();
await p.locator(".nv-ol-stagehead", { hasText: "Open" }).locator(".nv-ol-gear").click();
await p.waitForTimeout(300);
await panel.locator(".fg-hex .nv-color-chip").click();
await p.locator(".nv-pop .nv-color-swatch[title='#14b8a6']").click();
await p.waitForTimeout(400);
ok((await def("wf_tickets")).stages[0].color === "#14b8a6", "stage colour has the full picker");
await p.keyboard.press("Escape");
ok(await panel.locator(".fg-row", { hasText: "Label" }).first().locator(".nv-hl").count() === 1, "settings inputs are highlighted too");

// ===== triggers: date-time and number params, cron highlight =====
await p.locator(".nv-ol-workflow").click();
await p.waitForTimeout(500);
await section("Triggers").locator(".fg-plus[title='Add a trigger']").click();
const te = panel.locator(".fg-trigger-editor");
ok(await te.locator(".nv-hl-pre .token.cron-special").count() > 0, "cron expression is highlighted");
await te.locator(".fg-provider", { hasText: "Once" }).click();
t0 = Date.now();
await te.locator(".fg-row", { hasText: "Run at" }).locator(".nv-now-btn").click();
ok(Math.abs(Date.parse(await te.locator(".fg-row", { hasText: "Run at" }).locator("input").inputValue()) - t0) < 60_000, "trigger date-time has Now");
await drag(te.locator(".fg-row", { hasText: "Max attempts" }).locator(".nv-scrub"), 40);
ok(Number(await te.locator(".fg-row", { hasText: "Max attempts" }).locator("input").inputValue()) > 1, "trigger numbers scrub");
await te.locator(".fg-checklist .fg-check", { hasText: "Escalate" }).locator("input").check();
await te.locator(".fg-btn.is-primary").click();
await p.waitForTimeout(500);
const tr = await p.evaluate(() => window.__getTriggers?.("wf_tickets") ?? null);
ok(await section("Triggers").locator(".fg-trigger").count() === 1, "trigger saved");
await p.screenshot({ path: out + "/87-trigger.png" });

// ===== every form-field setting =====
await p.locator(".nv-ol-item", { hasText: "Escalate" }).click();
await p.waitForTimeout(500);
await p.locator(".react-flow__pane").click({ position: { x: 300, y: 760 } });
await p.waitForTimeout(400);
await section("Form").locator(".fg-list-row", { hasText: "Staff" }).locator("button[title^='Edit']").click();
await p.waitForTimeout(300);
const more = panel.locator(".fg-field-more");
ok(await more.count() === 1, "editing a field shows its other settings");
const sub = (t) => more.locator(".fg-sub", { has: p.locator(".fg-sub-head", { hasText: t }) });
const open = async (t) => { if (!(await sub(t).getAttribute("class")).includes("is-open")) await sub(t).locator(".fg-sub-head").click(); };
const fld = async () => (await def("wf_tickets")).actions[0].form.fields[0];
await open("Visibility");
await sub("Visibility").locator(".fg-check", { hasText: "Hide in table" }).locator("input").check();
await p.waitForTimeout(400);
ok((await fld()).hideInTable === true, "Hide in table applies");
ok(await more.count() === 1, "the field editor stays open after a setting changes");
await open("Validation");
await sub("Validation").locator(".fg-check", { hasText: "Unique" }).locator("input").check();
await p.waitForTimeout(400);
ok((await fld()).unique === true && (await fld()).hideInTable === true, "Unique applies, other settings kept");
await open("Layout");
await drag(sub("Layout").locator(".fg-row", { hasText: "Form columns" }).locator(".nv-scrub"), 25);
ok((await fld()).form_number_of_columns.default > 1 && (await fld()).form_number_of_columns.full_width === false, `form columns scrub (→ ${(await fld()).form_number_of_columns.default}), sibling kept`);
const span = sub("Layout").locator(".fg-row", { hasText: "View span" }).locator("input");
ok((await span.inputValue()) === "2", "nested rendering setting shown (view span 2)");
await span.fill("3");
await span.press("Enter");
await p.waitForTimeout(400);
ok((await fld()).rendering._variances.view.span === 3 && (await fld()).rendering._variances.list.component === "default", "nested setting changes as a number, rest of rendering kept");
await open("Lookup & map");
const lm = sub("Lookup & map");
ok(await lm.locator(".nv-hl-pre .token.template-string, .nv-hl-pre .token.keyword, .nv-hl-pre .token.comment").count() > 0, "lookup label function is highlighted as JavaScript");
await lm.locator(".fg-row", { hasText: "Map reference" }).locator("input").fill("Staff");
await lm.locator(".fg-row", { hasText: "Map reference" }).locator("input").press("Enter");
await p.waitForTimeout(400);
ok((await fld()).map.reference === "Staff" && (await fld()).map.value_field === "id", "map reference applies");
await lm.locator(".fg-row", { hasText: "Lookup label type" }).locator("select").selectOption("property");
await p.waitForTimeout(400);
ok((await fld()).lookup_label_type === "property" && await lm.locator(".fg-row", { hasText: "Lookup label" }).last().locator("input").count() === 1, "label type switch turns the function into a plain field");
await open("Rendering");
await sub("Rendering").locator(".fg-row", { hasText: "Shape" }).locator("select").selectOption("square");
await p.waitForTimeout(400);
ok((await fld()).rendering.options.shape === "square", "rendering shape applies");
await open("Tags & views");
await sub("Tags & views").locator(".fg-row", { hasText: "Meta tags" }).locator("input").fill("pii");
await sub("Tags & views").locator(".fg-row", { hasText: "Meta tags" }).locator("input").press("Enter");
await p.waitForTimeout(400);
ok(JSON.stringify((await fld()).meta_tags) === '["pii"]', "meta tag added");
await open("Input");
await sub("Input").locator(".fg-row", { hasText: "Input type" }).locator("select").selectOption("textarea");
await p.waitForTimeout(400);
ok((await fld()).input_properties.type === "textarea" && (await fld()).input_properties.options.code.startsWith("<template>"), "input type applies, template kept");
await p.screenshot({ path: out + "/88-field.png", fullPage: false });
await panel.screenshot({ path: out + "/89-field-panel.png" });
// JSON escape hatch
await open("All settings (JSON)");
const js = sub("All settings (JSON)").locator("textarea");
let j = JSON.parse(await js.inputValue());
ok(j.hideInTable === true && j.meta_tags[0] === "pii", "JSON shows the stored field");
j.access_control = { read: ["admins"] };
delete j.ipaddress;
await js.fill(JSON.stringify(j, null, 2));
await sub("All settings (JSON)").locator(".fg-btn", { hasText: "Apply JSON" }).click();
await p.waitForTimeout(400);
ok(JSON.stringify((await fld()).access_control) === '{"read":["admins"]}' && !("ipaddress" in (await fld())), "Apply JSON sets and removes settings");
j = JSON.parse(await js.inputValue());
j.key = "boss";
await js.fill(JSON.stringify(j));
await sub("All settings (JSON)").locator(".fg-btn", { hasText: "Apply JSON" }).click();
ok((await sub("All settings (JSON)").locator(".fg-error").innerText()).includes("Label, Key and Type"), "renaming the key from JSON is refused (use the checked fields)");
await js.fill("{ nope");
await sub("All settings (JSON)").locator(".fg-btn", { hasText: "Apply JSON" }).click();
ok((await sub("All settings (JSON)").locator(".fg-error").innerText()).startsWith("Not valid JSON"), "bad JSON is reported");
ok((await fld()).key === "staff", "field key unchanged");
// the basic editor still saves and closes
await panel.locator(".fg-field-editor .fg-btn", { hasText: "Revert" }).count();
await panel.locator(".fg-field-editor input").first().fill("Staff member");
await panel.locator(".fg-field-editor .fg-btn.is-primary").click();
await p.waitForTimeout(500);
ok((await fld()).label === "Staff member" && (await fld()).unique === true, "label save keeps the other settings");
ok(await panel.locator(".fg-field-editor").count() === 0, "and closes the editor");

console.log("errors:", JSON.stringify(errs));
await b.close();
