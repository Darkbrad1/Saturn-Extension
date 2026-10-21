// v0.3.34: a property of another resource can be the built-in id (and created_at, updated_at): every
// record has them though its resource's schema doesn't list them. Shown for a dynamic source's
// Linked by and Value field, and a map's fields.
import { chromium } from "playwright";
const out = process.env.SHOTS ?? "shots";
const b = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs = [];
p.on("pageerror", (e) => errs.push("pageerror: " + e.message));
const ok = (c, msg) => console.log((c ? "PASS " : "FAIL ") + msg);
const row = (label) => p.locator(".pe-row", { has: p.locator(".pe-label", { hasText: new RegExp(`^${label}$`) }) });

await p.goto("http://localhost:8765/resources.html");
await p.waitForTimeout(400);
await p.selectOption(".rs-select select", "Loan");
await p.waitForTimeout(300);
await p.locator(".rs-item", { hasText: "Payments" }).first().click();
await p.waitForTimeout(400);
const linked = row("Linked by").locator("select");
await linked.scrollIntoViewIfNeeded();
const values = await linked.locator("option").evaluateAll((os) => os.map((o) => o.value));
ok(values.includes("id") && values.includes("created_at") && values.includes("updated_at"), "Linked by offers id, created_at and updated_at " + JSON.stringify(values));
ok(values.indexOf("id") > values.indexOf("status"), "after the resource's own properties");
await linked.selectOption("id");
await p.waitForTimeout(150);
ok((await linked.inputValue()) === "id", "id can be picked");
ok((await row("Value field").locator("select option[value=id]").count()) === 1, "Value field offers id too");
await p.screenshot({ path: out + "/l1-linked-by-id.png" });
await p.locator(".rs-top").getByRole("button", { name: "Save", exact: true }).click();
await p.locator(".rs-confirm").getByRole("button", { name: "Save", exact: true }).click();
await p.waitForTimeout(400);
const sd = await p.evaluate(() => window.__data.Loan.find((x) => x.key === "payments").source_definition);
ok(sd.bounded_property === "id", "saved as source_definition.bounded_property = id");

// a map's Value field: id, without a second id when the resource lists one itself
await p.locator(".rs-item", { hasText: "Category" }).first().click();
await p.waitForTimeout(400);
const mapValue = row("Value field").locator("select");
await mapValue.scrollIntoViewIfNeeded();
ok((await mapValue.locator("option[value=id]").count()) === 1, "a map's Value field lists id once (LoanCategory has its own id)");

ok(errs.length === 0, "no page errors (" + errs.join(" | ") + ")");
await b.close();
