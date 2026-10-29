// v0.3.70: the rest of the release. The page before a workflow is open is cards; a Read step's Query, Sort and
// Columns are built from rows like the Menus screen's filter; a code setting has Format (the side panel and the
// Resources screen); a date's Now puts Saturn's "now" template in; a record picker lists every record by its name;
// switching a Create step's resource takes out the properties the new one hasn't (one Undo brings them back); the
// Resources screen starts with cards and picks a resource from a searchable list.
import { chromium } from "playwright";
const out = process.env.SHOTS ?? "shots";
const b = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium" });
const p = await b.newPage({ viewport: { width: 1500, height: 1000 } });
const errs = [];
p.on("pageerror", (e) => errs.push("pageerror: " + e.message));
p.on("console", (m) => /Content Security|Refused/.test(m.text()) && errs.push("CSP: " + m.text()));
const ok = (c, msg) => console.log((c ? "PASS " : "FAIL ") + msg);
const panel = p.locator(".fg-panel");
const def = () => p.evaluate(() => JSON.parse(JSON.stringify(window.__getDef())));
const field = (label) => panel.locator(".nv-field", { has: p.locator(".nv-field-name", { hasText: new RegExp(`^${label}$`) }) });

// ===== workflow cards =====
await p.goto("http://localhost:8765/csp.html");
await p.waitForTimeout(1000);
ok((await p.locator(".nv-card").count()) === 4 && (await p.locator(".nv-card.is-new").count()) === 1, "before a workflow is open, each workflow is a card, with New workflow first");
const of = await p.locator(".nv-card", { hasText: "Order fulfilment" }).locator(".nv-card-stage").allInnerTexts();
ok(of.join(",") === "New,Shipped", "a card shows the workflow's stages by name: " + of.join(","));
await p.screenshot({ path: `${out}/v0370-workflow-cards.png` });
await p.locator(".nv-cards-head input").fill("shipped");
ok((await p.locator(".nv-card:not(.is-new)").count()) === 1, "the search finds workflows by a stage's name too");
await p.locator(".nv-cards-head input").fill("");

// ===== the Read step's query builder =====
await p.locator(".nv-card", { hasText: "Debug lab" }).click();
await p.waitForTimeout(800);
await p.locator(".nv-ol-item", { hasText: /^Close/ }).first().click();
await p.waitForTimeout(700);
await p.locator(".react-flow__node", { has: p.locator(".nv-node-title", { hasText: /^Read$/ }) }).click();
await p.waitForTimeout(800);
const read = async () => (await def()).stages[1].actions[0].task.commands.find((c) => c.operator === "read").data;
const q = field("Query");
ok((await q.locator(".nv-query-row").count()) === 2, "the stored query shows as two conditions");
ok((await q.getByLabel("Property").first().inputValue()) === "status" && (await q.getByLabel("Comparison").nth(1).inputValue()) === ">", "each with its property and comparison");
await p.screenshot({ path: `${out}/v0370-query.png` });
await q.getByLabel("Comparison").nth(1).selectOption(">=");
await p.waitForTimeout(500);
ok((await read()).query === "`orders`.`status` = 'shipped' AND `orders`.`total` >= 100", "changing a comparison writes the query as Saturn reads it: " + (await read()).query);
await q.getByLabel("Value").first().fill("{{ _resource.status }}");
await q.getByLabel("Value").first().press("Enter");
await p.waitForTimeout(500);
ok((await read()).query.startsWith("`orders`.`status` = {{ _resource.status }}"), "a {{ template }} value is written as it is, not in quotes");
await q.locator(".nv-query-join select").selectOption("OR");
await p.waitForTimeout(500);
ok(/ OR /.test((await read()).query), "Match any joins them with OR");
await q.getByRole("button", { name: "+ Condition" }).click();
await p.waitForTimeout(400);
await q.getByLabel("Comparison").nth(2).selectOption("missing");
await p.waitForTimeout(500);
ok(/IS MISSING$/.test((await read()).query) && (await q.getByLabel("Value").count()) === 2, "+ Condition adds a row; is empty needs no value");
await q.getByRole("button", { name: "Edit as text" }).click();
const qt = q.locator("textarea");
ok((await qt.inputValue()) === (await read()).query, "Edit as text shows the query itself");
await qt.fill("IFMISSINGORNULL(`orders`.`deleted`, false) != true");
await qt.blur();
await p.waitForTimeout(500);
ok((await read()).query.startsWith("IFMISSINGORNULL") && (await q.getByText("Too involved").count()) === 1 && (await q.getByRole("button", { name: "Edit as conditions" }).count()) === 0, "a query too involved for rows is kept exactly as typed, as text");

const sort = field("Sort");
ok((await sort.getByLabel("Sort by").inputValue()) === "shipped_at" && (await sort.getByLabel("Direction").inputValue()) === "DESC", "Sort shows its property and direction");
await sort.getByLabel("Direction").selectOption("ASC");
await p.waitForTimeout(500);
ok((await read()).sort === "`orders`.`shipped_at` ASC", "and writes Saturn's ORDER BY: " + (await read()).sort);
const cols = field("Columns");
ok((await cols.locator("input:checked").count()) === 2, "Columns ticks the two stored ones");
await cols.locator(".nv-query-pick", { hasText: "Rush" }).locator("input").check();
await p.waitForTimeout(500);
ok((await read()).columns === "`orders`.`status`,`orders`.`total`,`orders`.`rush`", "ticking one adds it to the list: " + (await read()).columns);
await panel.locator(".nv-query").first().scrollIntoViewIfNeeded();
await p.screenshot({ path: `${out}/v0370-query-sort-columns.png` });

// ===== Format in the side panel =====
await p.goto("http://localhost:8765/csp.html");
await p.waitForTimeout(900);
await p.locator(".nv-card", { hasText: "Order fulfilment" }).click();
await p.waitForTimeout(800);
await p.locator(".nv-ol-item", { hasText: "Reject order" }).click();
await p.waitForTimeout(800);
await p.locator(".react-flow__node", { hasText: "Run Script" }).first().click();
await p.waitForTimeout(700);
const fmt = panel.getByRole("button", { name: "Format" });
ok((await fmt.count()) === 1, "a code setting has a Format button");
const box = panel.locator(".nv-field", { hasText: "Code" }).locator("textarea");
await box.fill("async function(flow,{_store}){const a=1;if(a){return {ok:true,total:a}}}");
await box.blur();
await p.waitForTimeout(500);
await fmt.click();
await p.waitForTimeout(900);
const formatted = (await def()).stages[0].actions.find((a) => a.action === "reject").task.commands.find((s) => s.operator === "run_script").data.code;
ok(/^async function \(flow, \{ _store \}\) \{\n  const a = 1;\n  if \(a\) \{\n    return \{ ok: true, total: a \};/.test(formatted), "Format lays a bare Saturn function out like Prettier, and it's saved:\n" + formatted);
await p.screenshot({ path: `${out}/v0370-format.png` });

// ===== Now, the record picker and switching the resource, on the owner's Note step =====
await p.goto("http://localhost:8765/csp.html?app");
await p.waitForTimeout(1000);
await p.locator(".nv-card", { hasText: "Application" }).click();
await p.waitForTimeout(900);
await p.locator(".nv-ol-item", { hasText: "Withdraw" }).first().click();
await p.waitForTimeout(900);
await p.locator(".react-flow__node", { has: p.locator(".nv-node-title", { hasText: /^Note$/ }) }).first().click();
await p.waitForTimeout(1000);
const note = async () => (await def()).stages[0].actions.find((a) => a.action === "withdraw").task.commands.find((s) => s.operator === "create" && s.id !== "RICHNOTE");
const prop = (key) => panel.locator(`[data-prop="${key}"]`);
await prop("created_at").getByRole("button", { name: "Now" }).click();
await p.waitForTimeout(600);
ok((await note()).data.properties.created_at === "{{ _util.moment().toISOString() }}", "a date's Now puts Saturn's now template in: " + (await note()).data.properties.created_at);

const app = prop("application").locator(".nv-record input");
await app.click();
await p.waitForTimeout(300);
const list = await prop("application").locator(".nv-record-row").allInnerTexts();
ok(list.length === 2 && list.every((t) => /^APP-/.test(t)), "opening the picker lists every record by its application number: " + list.join(", "));
await p.screenshot({ path: `${out}/v0370-record-list.png` });
await prop("application").locator(".nv-record-row", { hasText: "APP-000124" }).click();
await p.waitForTimeout(600);
ok((await app.inputValue()) === "APP-000124-M3P9TX" && (await note()).data.properties.application === "application-demo-20261028-11", "picking one shows its number and saves its id");
await app.click();
await p.waitForTimeout(300);
ok((await prop("application").locator(".nv-record-row").count()) === 2, "opening it again still lists them all (the picked one doesn't hide the rest)");
await app.press("Escape");

const before = Object.keys((await note()).data.properties);
await panel.locator(".nv-recform select").first().selectOption("orders");
await p.waitForTimeout(1200);
const after = (await note()).data;
ok(after.resource === "orders" && Object.keys(after.properties).join(",") === "created_at", "switching to orders takes out the Note properties orders hasn't, in one change: " + Object.keys(after.properties).join(","));
ok((await panel.getByText(/not one of/).count()) === 0, "no 'not one of its properties' rows are left");
await p.screenshot({ path: `${out}/v0370-switch.png` });
await p.locator(".nv-topbar").getByRole("button", { name: "Undo" }).click();
await p.waitForTimeout(900);
const back = (await note()).data;
ok(back.resource === "Note" && Object.keys(back.properties).join(",") === before.join(","), "one Undo brings Note and all its properties back");

// ===== the Resources screen: cards, then the picker =====
await p.goto("http://localhost:8765/resources.html");
await p.waitForTimeout(600);
const groups = await p.locator(".rs-cards-group").evaluateAll((g) => g.map((x) => x.dataset.label + ":" + x.querySelectorAll(".rs-card").length));
ok(groups.join(" ") === "Resources:6 Core resources:1", "before a resource is picked, each one is a card, own ones first: " + groups.join(" "));
await p.screenshot({ path: `${out}/v0370-resource-cards.png` });
await p.locator(".rs-card[data-resource=Loan]").click();
await p.waitForTimeout(500);
ok((await p.locator(".rs-picker-btn").getAttribute("data-value")) === "Loan" && (await p.locator(".rs-item").count()) > 0, "a card opens its resource");
await p.locator(".rs-picker-btn").click();
await p.waitForTimeout(200);
ok((await p.locator(".rs-picker-heading").allTextContents()).join(",") === "Resources,Core resources", "the picker is a list in two groups, not a dropdown");
await p.keyboard.type("categ");
await p.waitForTimeout(150);
ok((await p.locator(".rs-picker-item").count()) === 1, "typing narrows it");
await p.screenshot({ path: `${out}/v0370-resource-picker.png` });
await p.keyboard.press("Enter");
await p.waitForTimeout(500);
ok((await p.locator(".rs-picker-btn").getAttribute("data-value")) === "LoanCategory" && (await p.locator(".rs-picker-pop").count()) === 0, "Enter opens the one it found");

// ===== Format on the Resources screen =====
await p.locator(".rs-picker-btn").click();
await p.locator(".rs-picker-item[data-resource=Deal]").click();
await p.waitForTimeout(400);
await p.locator(".rs-item", { hasText: "Parties" }).first().click();
await p.waitForTimeout(400);
const code = p.locator(".pe-page .pe-row", { has: p.locator(".pe-label", { hasText: /^Component code$/ }) });
await code.scrollIntoViewIfNeeded();
await code.locator("textarea").fill("<template><div><span>{{ a }}</span></div></template>");
await p.waitForTimeout(150);
await code.getByRole("button", { name: "Format" }).click();
await p.waitForTimeout(900);
ok((await code.locator("textarea").inputValue()) === "<template>\n  <div>\n    <span>{{ a }}</span>\n  </div>\n</template>", "Format on the Resources screen lays out component code:\n" + (await code.locator("textarea").inputValue()));
await p.screenshot({ path: `${out}/v0370-format-resources.png` });

ok(errs.length === 0, "no page or CSP errors: " + errs.join(" | "));
await b.close();
