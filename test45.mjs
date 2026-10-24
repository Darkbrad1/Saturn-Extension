// v0.3.57: a Countries lookup as Saturn's own editor has it: Value field (lookup_value) and Label field
// (lookup_label) pick a country's field; lookup_label isn't shown as a label function. Picking Countries fills them in.
import { chromium } from "playwright";
const out = process.env.SHOTS ?? "shots";
const b = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
const errs = [];
p.on("pageerror", (e) => errs.push("pageerror: " + e.message));
const ok = (c, msg) => console.log((c ? "PASS " : "FAIL ") + msg);
const row = (label) => p.locator(".pe-page .pe-block", { has: p.locator(".pe-part-title", { hasText: /^Lookup$/ }) }).locator(".pe-row", { has: p.locator(".pe-label", { hasText: new RegExp(`^${label}$`) }) });
const labels = () => p.locator(".pe-page .pe-block", { has: p.locator(".pe-part-title", { hasText: /^Lookup$/ }) }).locator(".pe-label").allInnerTexts();
const pick = async (key) => { await p.locator(".rs-item", { has: p.locator(".rs-item-key", { hasText: new RegExp(`^${key}$`) }) }).click(); await p.waitForTimeout(250); };

await p.goto("http://localhost:8765/resources.html");
await p.waitForTimeout(400);
await p.selectOption(".rs-select select", "LoanApplication");
await p.waitForTimeout(300);
await pick("student_institution_country");

ok((await row("Lookup source").locator("select").inputValue()) === "countries", "Lookup source: Countries");
ok((await row("Value field").locator("select").inputValue()) === "country_code", "Value field: country_code (lookup_value)");
ok((await row("Label field").locator("select").inputValue()) === "country_name", "Label field: country_name (lookup_label)");
ok(!(await labels()).includes("Label function"), "lookup_label isn't shown as a label function: " + (await labels()).join(", "));
ok((await p.locator(".rs-unsaved").count()) === 0, "nothing unsaved just by opening it");
await p.screenshot({ path: out + "/i1-countries.png" });

await row("Label field").locator("select").selectOption("country_code");
await p.locator(".rs-top").getByRole("button", { name: "Save", exact: true }).click();
await p.locator(".rs-confirm").getByRole("button", { name: "Save", exact: true }).click();
await p.waitForTimeout(400);
const saved = await p.evaluate(() => window.__data.LoanApplication.find((x) => x.key === "student_institution_country"));
ok(saved.lookup_label === "country_code" && saved.lookup_value === "country_code" && saved.lookup_type === "countries", "saved where Saturn keeps it (lookup_label, lookup_value)");

// a fixed list switched to Countries gets Saturn's starting fields
await p.locator(".rs-search").fill("");
const listKey = await p.evaluate(() => window.__data.LoanApplication.find((x) => x.lookup_type === "values").key);
await pick(listKey);
await row("Lookup source").locator("select").selectOption("countries");
await p.waitForTimeout(100);
const d = await p.evaluate((k) => window.acquireVsCodeApi().getState().works.LoanApplication.drafts[k], listKey);
ok(d.lookup_type === "countries" && d.lookup_value === "country_code" && d.lookup_label === "country_name", "picking Countries fills in country_code and country_name");
await row("Lookup source").getByRole("button", { name: "Put back" }).click();
await p.waitForTimeout(100);
const back = await p.evaluate((k) => window.acquireVsCodeApi().getState().works.LoanApplication?.drafts?.[k] ?? null, listKey);
ok(!back || (back.lookup_type === "values" && back.lookup_value === undefined && back.lookup_label === undefined), "Put back on Lookup source takes them out again");

ok(errs.length === 0, "no page errors (" + errs.join(" | ") + ")");
await b.close();
