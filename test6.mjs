// Parity tests, part 2: stage / action / command settings, workflow settings,
// triggers, resource hooks, new workflow, status banners.
import { chromium } from "playwright";
const out = process.env.SHOTS ?? "shots";
const b = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs = [];
p.on("pageerror", (e) => errs.push("pageerror: " + e.message));
p.on("console", (m) => /Content Security|Refused/.test(m.text()) && errs.push("CSP: " + m.text()));
const ok = (c, msg) => console.log((c ? "PASS " : "FAIL ") + msg);
const def = (id) => p.evaluate((id) => window.__getDef(id), id);
const opened = () => p.evaluate(() => window.__opened ?? []);
const panel = p.locator(".fg-panel");
const row = (label) => panel.locator(".fg-row", { has: p.locator(".fg-label", { hasText: new RegExp(`^${label}$`) }) });
const section = (title) => panel.locator(".fg-section", { has: p.locator(".fg-section-title", { hasText: title }) });

await p.goto("http://localhost:8765/csp.html");
await p.waitForTimeout(900);
// the node view opens first (0.3.3); these checks start from the list view
await p.getByRole("button", { name: "Back to list view" }).click();
await p.waitForTimeout(200);
await p.getByText("Order fulfilment").first().click();
await p.waitForTimeout(500);
await p.locator(".nv-launch").click();
await p.waitForTimeout(600);

// ===== action settings (no node selected) =====
await p.locator(".nv-ol-item", { hasText: "Approve order" }).click();
await p.waitForTimeout(400);
ok(await section("Access").count() === 1 && await section("Form").count() === 1, "action panel shows Access and Form");
ok((await section("Access").innerText()).includes("1 selected"), "current access rule shown");
await p.screenshot({ path: out + "/60-action.png" });

// machine name
const mn = row("Machine name").locator("input");
await mn.fill("approve_order");
await mn.press("Enter");
await p.waitForTimeout(500);
ok((await def()).stages[0].actions[0].action === "approve_order", "machine name edit applies");

// form fields: add, edit, remove
await section("Form").locator(".fg-plus").click();
await panel.locator(".fg-field-editor input").first().fill("Priority");
await panel.locator(".fg-field-editor select").selectOption("number");
await panel.locator(".fg-field-editor .fg-check input").check();
await panel.locator(".fg-field-editor .fg-btn.is-primary").click();
await p.waitForTimeout(500);
let f = (await def()).stages[0].actions[0].form.fields;
ok(f.some((x) => x.key === "priority" && x.type === "number" && x.required), "form field added");
ok(await panel.locator(".fg-field-editor").count() === 0, "field editor closes after saving");
await section("Form").locator(".fg-list-row", { hasText: "Priority" }).locator("button[title^='Edit']").click();
await panel.locator(".fg-field-editor input").first().fill("Urgency");
await panel.locator(".fg-field-editor .fg-btn.is-primary").click();
await p.waitForTimeout(500);
f = (await def()).stages[0].actions[0].form.fields;
ok(f.some((x) => x.label === "Urgency"), "form field edited");
// duplicate → inline error
await section("Form").locator(".fg-plus").click();
await panel.locator(".fg-field-editor input").first().fill("Note");
await panel.locator(".fg-field-editor .fg-btn.is-primary").click();
await p.waitForTimeout(500);
ok((await panel.locator(".fg-field-editor .fg-error").innerText().catch(() => "")).includes("already exists"), "duplicate field shows an inline error");
await panel.locator(".fg-field-editor .fg-btn", { hasText: "Cancel" }).click();
await section("Form").locator(".fg-list-row", { hasText: "Urgency" }).locator("button[title^='Remove']").click();
await p.waitForTimeout(500);
ok(!(await def()).stages[0].actions[0].form.fields.some((x) => x.label === "Urgency"), "form field removed");

// access
await section("Access").locator(".fg-plus").click();
await p.waitForTimeout(300);
const access = panel.locator(".fg-access");
ok(await access.locator(".fg-access-method.is-on", { hasText: "User Group" }).count() === 1, "editor starts from the current rules");
await access.locator(".fg-access-method", { hasText: /^User$|User\b(?! Group)/ }).locator("> .fg-check input").first().check();
await access.locator(".fg-access-method", { hasText: "Named individuals" }).locator(".fg-checklist .fg-check", { hasText: "Grace Hopper" }).locator("input").check().catch(async () => {});
await p.screenshot({ path: out + "/61-access.png" });
await access.locator(".fg-access-method", { hasText: "Custom Function" }).locator("> .fg-check input").check();
await access.locator(".fg-btn.is-primary").click();
await p.waitForTimeout(500);
const ac = (await def()).stages[0].actions[0].access_control;
ok(ac.some((r) => r.method === "user_group" && r.data.includes("g1")), "group rule kept");
ok(ac.some((r) => r.method === "user" && r.data.includes("u2")), "user rule added");
ok(ac.some((r) => r.method === "function" && /return true/.test(r.data[0])), "function rule added with the template");
await section("Access").locator(".fg-plus").click();
await p.waitForTimeout(200);
await panel.locator(".fg-access .fg-link").click();
ok((await opened()).some((o) => o.type === "openAccessFunction" && o.path.join(".") === "stages.0.actions.0"), "custom function opens in the editor");
await panel.locator(".fg-access .fg-btn", { hasText: "Cancel" }).click();

// ===== command settings =====
await p.locator(".nv-ol-item", { hasText: "Notify customer" }).click();
await p.waitForTimeout(400);
ok((await section("Parameters").innerText()).includes("template"), "command parameters listed");
await section("Parameters").locator(".fg-plus").click();
await panel.locator(".fg-field-editor input").first().fill("Channel");
await panel.locator(".fg-field-editor .fg-btn.is-primary").click();
await p.waitForTimeout(500);
ok((await def()).commands[0].parameters.fields.some((x) => x.key === "channel"), "command parameter added");
ok((await section("Used in").innerText()).includes("Approve order"), "usages listed");
await section("Used in").locator(".fg-link-row").first().click();
await p.waitForTimeout(800);
ok((await p.locator(".nv-crumbbar").innerText()).includes("Approve order"), "usage jumps to the action");
ok(await p.locator(".react-flow__node.selected", { hasText: "Notify customer" }).count() === 1, "and selects the reference");
await p.screenshot({ path: out + "/62-usage.png" });

// ===== stage settings =====
await p.locator(".nv-ol-stagehead", { hasText: "Shipped" }).hover();
await p.locator(".nv-ol-stagehead", { hasText: "Shipped" }).locator(".nv-ol-gear").click();
await p.waitForTimeout(300);
ok((await panel.locator(".fg-head-title").innerText()) === "Shipped", "stage panel opens from the stage's gear");
await panel.locator(".fg-swatch[title='#a855f7']").click();
await p.waitForTimeout(500);
ok((await def()).stages[1].color === "#a855f7", "colour swatch applies");
await panel.locator(".fg-hex input").fill("#123456");
await panel.locator(".fg-hex input").press("Enter");
await p.waitForTimeout(500);
ok((await def()).stages[1].color === "#123456", "hex colour applies");
await p.screenshot({ path: out + "/63-stage.png" });
await section("Order").locator(".fg-btn", { hasText: "Move up" }).click();
await p.waitForTimeout(500);
ok((await def()).stages.map((s) => s.stage).join() === "shipped,new", "stage moves up");
// drag a stage in the outliner back down
const s1 = p.locator(".nv-ol-stagehead", { hasText: "Shipped" });
const s2 = p.locator(".nv-ol-stagehead", { hasText: "New" });
await s1.dragTo(s2);
await p.waitForTimeout(500);
ok((await def()).stages.map((s) => s.stage).join() === "new,shipped", "dragging in the outliner reorders stages: " + (await def()).stages.map((s) => s.stage).join());
// reorder actions inside a stage by drag
const a1 = p.locator(".nv-ol-item", { hasText: "Approve order" });
const a2 = p.locator(".nv-ol-item", { hasText: "Reject order" });
await a2.dragTo(a1);
await p.waitForTimeout(500);
ok((await def()).stages[0].actions.map((a) => a.id).join() === "reject,approve", "dragging reorders actions");

// ===== workflow settings: triggers, resources, actions =====
await p.locator(".nv-ol-workflow").click();
await p.waitForTimeout(500);
ok((await section("Triggers").innerText()).includes("Schedule 0 8 * * 1-5"), "existing trigger listed");
ok((await section("Triggers").innerText()).includes("Resend invoice"), "trigger shows the action it runs");
// add a webhook with a token (showWhen)
await section("Triggers").locator(".fg-plus[title='Add a trigger']").click();
const te = panel.locator(".fg-trigger-editor");
await te.locator(".fg-provider", { hasText: "Webhook" }).click();
const tokenRow = te.locator(".fg-row", { has: p.locator(".fg-label", { hasText: /^Token$/ }) });
ok(await tokenRow.count() === 0, "token hidden until auth = token");
await te.locator(".fg-row", { hasText: "Auth" }).locator("select").selectOption("token");
ok(await tokenRow.count() === 1, "token shown when auth = token");
await te.locator(".fg-row", { hasText: "Path" }).locator("input").fill("orders-hook");
ok((await te.locator(".fg-webhook code").innerText()) === "https://demo.sonover.app/api/_path/orders-hook", "webhook URL shown");
await tokenRow.locator("input").fill("tok123");
await te.locator(".fg-btn.is-primary").click();
await p.waitForTimeout(400);
ok((await te.locator(".fg-error").innerText().catch(() => "")).includes("action"), "trigger without actions is rejected inline");
await te.locator(".fg-checklist .fg-check", { hasText: "Resend invoice" }).locator("input").check();
await te.locator(".fg-btn.is-primary").click();
await p.waitForTimeout(600);
const tr = await p.evaluate(() => window.__triggers().wf_orders);
ok(tr.length === 2 && tr[1].trigger_provider === "http" && tr[1].configuration.token === "tok123" && tr[1].actions[0] === "resend", "webhook trigger created");
ok(await panel.locator(".fg-trigger-editor").count() === 0, "editor closes after saving");
await p.screenshot({ path: out + "/64-triggers.png" });
// edit the schedule with a preset
await section("Triggers").locator(".fg-trigger", { hasText: "Schedule" }).locator("button[title='Edit this trigger']").click();
await panel.locator(".fg-chip", { hasText: "Hourly" }).click();
ok((await panel.locator(".fg-trigger-editor .fg-hint").innerText()).includes("At 0 minutes past every hour"), "cron is described");
await panel.locator(".fg-trigger-editor .fg-btn.is-primary").click();
await p.waitForTimeout(600);
ok((await p.evaluate(() => window.__triggers().wf_orders[0].configuration.expression)) === "0 * * * *", "schedule edited with a preset");
await section("Triggers").locator(".fg-trigger", { hasText: "Webhook" }).locator("button[title='Delete this trigger']").click();
await p.waitForTimeout(500);
ok((await p.evaluate(() => window.__triggers().wf_orders.length)) === 1, "trigger deleted");

// resources
await section("Hooks").locator(".fg-section-title").click();
await p.waitForTimeout(200);
const res = section("Hooks");
ok((await res.innerText()).includes("orders") && (await res.innerText()).includes("update.after"), "bound resource and hook listed");
ok((await res.innerText()).includes("invoices") && (await res.innerText()).includes("hooks only"), "hooks-only resource listed");
await res.locator(".fg-resource", { hasText: "orders" }).locator(".fg-plus").click();
await res.locator(".fg-hook-add select").nth(0).selectOption("before");
await res.locator(".fg-hook-add select").nth(1).selectOption("delete");
await res.locator(".fg-hook-add select").nth(2).selectOption("approve");
await res.locator(".fg-hook-add .fg-btn.is-primary").click();
await p.waitForTimeout(500);
ok(JSON.stringify((await p.evaluate(() => window.__bindings()[0].lifecycle.delete))) === JSON.stringify({ before: [{ data: "approve", source: "workflow-action" }] }), "hook added");
ok((await res.innerText()).includes("Added approve on orders delete.before"), "saved message shown");
await res.locator(".fg-hook", { hasText: "delete.before" }).locator(".fg-hook-chip button").click();
await p.waitForTimeout(500);
ok((await p.evaluate(() => window.__bindings()[0].lifecycle.delete.before.length)) === 0, "hook removed");
await p.screenshot({ path: out + "/65-resources.png" });

// workflow actions
for (const [label, type] of [["Open in Sonover", "openWorkflow"], ["Open raw JSON", "viewRawWorkflow"], ["Offline copies", "revealOfflineFiles"]]) {
  await section("Workflow").locator(".fg-btn", { hasText: label }).click();
  ok((await opened()).some((o) => o.type === type), `${label} sends ${type}`);
}

// ===== status: offline + changed remotely =====
await p.evaluate(() => window.__post("connection", { offline: true, pending: [{ workflowId: "wf_orders", workflowName: "Order fulfilment", edits: 3 }] }));
await p.waitForTimeout(200);
ok((await p.locator(".nv-offline").innerText()).includes("3 queued"), "offline pill shows queued edits");
await p.evaluate(() => window.__post("workflowChangedRemotely", { workflowId: "wf_orders", summary: "Ada edited Approve order", hasDraft: true }));
await p.waitForTimeout(200);
ok((await p.locator(".nv-remote").innerText()).includes("Ada edited Approve order"), "remote change banner shown");
await p.screenshot({ path: out + "/66-status.png" });
await p.locator(".nv-remote .nv-btn", { hasText: "Reload" }).click();
await p.waitForTimeout(300);
ok(await p.locator(".nv-remote").count() === 0, "reload clears the banner");

// ===== new workflow (opens in both views) =====
await p.locator(".nv-wf-switch").click();
await p.locator(".nv-picker .nv-btn", { hasText: "New workflow" }).click();
await p.locator(".nv-modal input").nth(0).fill("Order fulfilment");
await p.locator(".nv-modal button[type=submit]").click();
await p.waitForTimeout(400);
ok((await p.locator(".nv-modal .nv-field-err").innerText().catch(() => "")).includes("already exists"), "duplicate workflow name is reported");
await p.locator(".nv-modal input").nth(0).fill("Returns");
await p.locator(".nv-modal input").nth(1).fill("Requested");
await p.locator(".nv-modal button[type=submit]").click();
await p.waitForTimeout(900);
ok((await p.locator(".nv-wf-switch").innerText()).includes("Returns"), "new workflow opens in the node view");
ok(await p.locator(".nv-ol-stagehead", { hasText: "Requested" }).count() === 1, "with its first stage");
await p.screenshot({ path: out + "/67-new-wf.png" });
// delete it from workflow settings → back to the picker
await p.locator(".nv-ol-workflow").click();
await section("Danger zone").locator(".fg-section-title").click();
await section("Danger zone").locator(".fg-btn.is-danger").click();
await p.waitForTimeout(800);
ok(await p.locator(".nv-picker-page").count() === 1, "deleting the workflow returns to the workflow picker");
await p.locator(".nv-picker-item", { hasText: "Order fulfilment" }).click();
await p.waitForTimeout(800);
ok((await p.locator(".nv-wf-switch").innerText()).includes("Order fulfilment"), "picker opens a workflow");

console.log("errors:", JSON.stringify(errs));
await b.close();
