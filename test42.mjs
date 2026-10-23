// v0.3.54: a real Application schema (harness/appschema.js, the LoanApplication resource) is fully catered for: an
// inline component in the record view only, code kept under the Default renderer, per-variance currencies, the
// File manager's options, File access (acl), a source definition on a static map, a map's lookup reference,
// columns per screen size, and a label that's only a space.
import { chromium } from "playwright";
const out = process.env.SHOTS ?? "shots";
const b = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
const errs = [];
p.on("pageerror", (e) => errs.push("pageerror: " + e.message));
const ok = (c, msg) => console.log((c ? "PASS " : "FAIL ") + msg);
const sec = (title) => p.locator(".pe-page .pe-block", { has: p.locator(".pe-part-title, .pe-group-title", { hasText: new RegExp(`^${title}$`) }) });
const rowIn = (scope, label) => scope.locator(".pe-row", { has: p.locator(".pe-label", { hasText: new RegExp(`^${label}$`) }) });
const row = (label) => p.locator(".pe-page .pe-row", { has: p.locator(".pe-label", { hasText: new RegExp(`^${label}$`) }) });
const pick = async (key) => { await p.locator(".rs-item", { has: p.locator(".rs-item-key", { hasText: new RegExp(`^${key}$`) }) }).click(); await p.waitForTimeout(250); };
const stored = (key) => p.evaluate((k) => JSON.parse(JSON.stringify(window.__data.LoanApplication.find((x) => x.key === k))), key);
const save = async () => {
  await p.locator(".rs-top").getByRole("button", { name: "Save", exact: true }).click();
  await p.locator(".rs-confirm").getByRole("button", { name: "Save", exact: true }).click();
  await p.waitForTimeout(400);
};

await p.goto("http://localhost:8765/resources.html");
await p.waitForTimeout(400);
await p.selectOption(".rs-select select", "LoanApplication");
await p.waitForTimeout(300);

// a label that's only a space: the key shows
const ratios = p.locator(".rs-item", { has: p.locator(".rs-item-key", { hasText: /^ratios$/ }) });
ok((await ratios.locator(".rs-item-label").innerText()).trim() === "ratios", "a label that's only a space shows the key instead");

// ratios: inline component in the record view only
await pick("ratios");
const viewCode = row("Component code").filter({ has: p.locator("textarea") });
const codes = await viewCode.locator("textarea").evaluateAll((els) => els.map((e) => e.value));
ok(codes.some((c) => c.includes("<ApplicationRatios")), "the record view's inline component code shows");
ok((await row("Component code").getByRole("button", { name: "Open in a file" }).count()) >= 1, "with Open in a file");
await p.screenshot({ path: out + "/a1-ratios.png" });

// parties: code under the Default renderer
await pick("parties");
ok((await row("Component code").locator("textarea").inputValue()).includes("<ApplicationPartyDirectory"), "code kept under the Default renderer shows too");

// currency in each place
await pick("requested_loan_amount");
const currencies = await row("Currency").locator("input").evaluateAll((els) => els.map((e) => e.value));
ok(currencies.length === 3 && currencies.every((c) => c === "USD"), "a currency for the default, the table and the record view: " + currencies.join());
await row("Currency").nth(1).locator("input").fill("TTD");
await row("Currency").nth(1).locator("input").press("Enter");
await save();
let s = await stored("requested_loan_amount");
ok(s.rendering._variances.list.options.currency.value === "TTD" && s.rendering._variances.list.options.currency.type === "property" && s.rendering.options.currency.value === "USD", "the table's currency saves on its own");

// File manager
await pick("documents");
ok((await row("File manager title").locator("input").inputValue()) === "Application documents", "the File manager's title");
ok((await row("Helper text").locator("input").inputValue()).startsWith("Upload and manage"), "its helper text");
ok((await row("Most files").locator("input").inputValue()) === "20", "how many files");
ok((await row("File access").locator("input").inputValue()) === "public", "File access (acl)");
ok((await row("Files belong to").count()) === 1 && (await row("Property").count()) >= 1, "which resource and property they belong to");
await row("Most files").locator("input").fill("25");
await row("Most files").locator("input").press("Enter");
await save();
s = await stored("documents");
ok(s.rendering.options.maxFiles.value === 25 && s.rendering.options.title.value === "Application documents", "a change saves in place");
await p.screenshot({ path: out + "/a2-files.png" });

// a static map that carries a source definition
await pick("loan_officer");
ok((await row("Linked by").count()) === 1 && (await row("Source type").count()) === 1, "a source definition on a static map shows");

// a map's lookup reference
await pick("loan_type_id");
ok((await rowIn(sec("Lookup"), "Reference").locator("input").inputValue()) === "name", "a map's lookup reference shows");

// columns per screen size
await pick("stage_due_at");
ok((await row("Columns on medium screens").locator("input").inputValue()) === "6" && (await row("Columns on large screens").locator("input").inputValue()) === "6", "columns for medium and large screens show");

// nothing lost on a save that didn't touch them
s = await stored("ratios");
ok(s.rendering.options.size === "small" && s.rendering._variances.view.options.opacity === 0.2, "Saturn's other renderer options are kept");
ok(!errs.length, "no page errors " + JSON.stringify(errs));
await b.close();
