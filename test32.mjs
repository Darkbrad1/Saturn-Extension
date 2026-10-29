// v0.3.45: an inline component's code (rendering.options.code.value) shows as "Component code" when the renderer is
// Inline component, highlighted as HTML; a new one is saved as Saturn stores it ({type: "property", value}), and so
// is a Currency renderer's currency.
import { chromium } from "playwright";
const out = process.env.SHOTS ?? "shots";
const b = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs = [];
p.on("pageerror", (e) => errs.push("pageerror: " + e.message));
p.on("console", (m) => /Content Security|Refused/.test(m.text()) && errs.push("CSP: " + m.text()));
const ok = (c, msg) => console.log((c ? "PASS " : "FAIL ") + msg);
const row = (label) => p.locator(".pe-page .pe-row", { has: p.locator(".pe-label", { hasText: new RegExp(`^${label}$`) }) });
const stored = (key) => p.evaluate((k) => JSON.parse(JSON.stringify(window.__data.Deal.find((x) => x.key === k).rendering ?? null)), key);
const save = async () => {
  await p.locator(".rs-top").getByRole("button", { name: "Save", exact: true }).click();
  await p.locator(".rs-confirm").getByRole("button", { name: "Save", exact: true }).click();
  await p.waitForTimeout(400);
};

await p.goto("http://localhost:8765/resources.html");
await p.waitForTimeout(400);
await p.locator(".rs-picker-btn").click(); await p.locator(`.rs-picker-item[data-resource=${JSON.stringify("Deal")}]`).click();
await p.waitForTimeout(300);
await p.locator(".rs-item", { hasText: "Parties" }).first().click();
await p.waitForTimeout(300);

// ===== an existing inline component =====
const code = row("Component code");
await code.scrollIntoViewIfNeeded();
ok((await code.count()) === 1, "an inline component's code shows as Component code");
const text = await code.locator("textarea").inputValue();
ok(text.includes("<ApplicationPartyDirectory") && text.includes("export default"), "with its template and script");
ok((await code.locator(".nv-hl-pre .token.tag").count()) > 0, "highlighted as HTML");
await p.screenshot({ path: out + "/c1-component-code.png" });
await code.locator("textarea").fill(text.replace("ApplicationPartyDirectory", "PartyList"));
await p.waitForTimeout(150);
ok((await p.locator(".pe-row.is-changed", { hasText: "Component code" }).count()) === 1, "editing it is a change");
await save();
let r = await stored("parties");
ok(r.options.code.value.includes("<PartyList") && r.options.code.type === "property" && r.component === "inline-component", "saved in place, its type kept");

// ===== Open in a file =====
await p.locator(".rs-item", { hasText: "Parties" }).first().click();
await p.waitForTimeout(300);
const openBtn = row("Component code").getByRole("button", { name: "Open in a file" });
ok((await openBtn.count()) === 1, "Component code has an Open in a file button, like the code step");
await openBtn.click();
await p.waitForTimeout(150);
const asked = await p.evaluate(() => (window.__opened || []).filter((o) => o.type === "openCode").at(-1));
ok(asked && asked.resource === "Deal" && asked.id === "parties" && asked.path.join(".") === "rendering.options.code.value" && asked.language === "html" && asked.text.includes("<PartyList"), "it asks the extension to open that code as a file");
await p.evaluate(() => window.__saveCodeFile("<template>\n  <PartyCards :record=\"record\" />\n</template>\n"));
await p.waitForTimeout(300);
ok((await row("Component code").locator("textarea").inputValue()).includes("<PartyCards"), "saving the file puts its code in the screen");
ok((await p.locator(".rs-unsaved").count()) === 1 && (await p.evaluate(() => window.__data.Deal.find((x) => x.key === "parties").rendering.options.code.value)).includes("<PartyList"), "as an unsaved change: the instance still has the old code");
await save();
ok((await p.evaluate(() => window.__data.Deal.find((x) => x.key === "parties").rendering.options.code.value)).includes("<PartyCards"), "Save sends it");

// ===== a new one =====
await p.locator(".rs-item", { hasText: "Amount" }).first().click();
await p.waitForTimeout(300);
ok((await row("Component code").count()) === 0, "a property without an inline component has no Component code");
await row("Default renderer").locator("select").selectOption("inline-component");
await p.waitForTimeout(200);
const fresh = row("Component code");
ok((await fresh.count()) === 1 && (await fresh.locator("textarea").inputValue()).includes("<template>"), "picking Inline component shows it, with a starting template");
await fresh.locator("textarea").fill("<template>\n  <b>{{ value }}</b>\n</template>\n");
await p.waitForTimeout(150);
await save();
r = await stored("amount");
ok(r.component === "inline-component" && JSON.stringify(r.options.code) === JSON.stringify({ value: "<template>\n  <b>{{ value }}</b>\n</template>\n", type: "property" }), "saved as Saturn stores it: " + JSON.stringify(r.options));

// ===== a Currency renderer's currency gets its type too =====
await row("Default renderer").locator("select").selectOption("currency");
await p.waitForTimeout(200);
await row("Currency").locator("input").fill("JMD");
await p.waitForTimeout(150);
await save();
r = await stored("amount");
ok(JSON.stringify(r.options.currency) === JSON.stringify({ value: "JMD", type: "property" }), "a currency is saved with its type, like Saturn's: " + JSON.stringify(r.options.currency));

// the search finds it
await p.fill(".pe-find", "component");
await p.waitForTimeout(200);
ok((await p.locator(".pe-page .pe-label").allInnerTexts()).some((t) => /renderer/i.test(t)), "Find a setting finds the renderers by \"component\"");

ok(errs.length === 0, "no page errors (" + errs.join(" | ") + ")");
await b.close();
