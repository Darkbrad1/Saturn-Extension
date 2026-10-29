// v0.3.48: a form dropdown's custom style (rendering._variances.form.use_custom_dropdown and
// custom_dropdown_template), on the Resources screen: shown for properties the form shows as a dropdown, the
// template highlighted with Open in a file; switching it on fills in Saturn's starter template.
import { chromium } from "playwright";
const out = process.env.SHOTS ?? "shots";
const b = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs = [];
p.on("pageerror", (e) => errs.push("pageerror: " + e.message));
const ok = (c, msg) => console.log((c ? "PASS " : "FAIL ") + msg);
const row = (label) => p.locator(".pe-page .pe-row", { has: p.locator(".pe-label", { hasText: new RegExp(`^${label}$`) }) });
const form = (key) => p.evaluate((k) => JSON.parse(JSON.stringify(window.__data.Deal.find((x) => x.key === k).rendering?._variances?.form ?? null)), key);
const save = async () => {
  await p.locator(".rs-top").getByRole("button", { name: "Save", exact: true }).click();
  await p.locator(".rs-confirm").getByRole("button", { name: "Save", exact: true }).click();
  await p.waitForTimeout(400);
};

await p.goto("http://localhost:8765/resources.html");
await p.waitForTimeout(400);
await p.locator(".rs-picker-btn").click(); await p.locator(`.rs-picker-item[data-resource=${JSON.stringify("Deal")}]`).click();
await p.waitForTimeout(300);

// ===== a stored one =====
await p.locator(".rs-item", { hasText: "Request For" }).first().click();
await p.waitForTimeout(300);
const sw = row("Custom dropdown style");
await sw.scrollIntoViewIfNeeded();
ok((await sw.count()) === 1 && (await sw.getByRole("switch").isChecked()), "a lookup shows Custom dropdown style, on");
const tpl = row("Dropdown option template");
ok((await tpl.locator("textarea").inputValue()).includes("item.label || item.value"), "with its template");
ok((await tpl.locator(".nv-hl-pre .token.tag").count()) > 0, "highlighted as HTML");
ok((await tpl.getByRole("button", { name: "Open in a file" }).count()) === 1, "with Open in a file");
await p.screenshot({ path: out + "/d1-dropdown.png" });
await tpl.locator("textarea").fill("<template>\n  <b>{{ item.label }}</b>\n</template>");
await save();
ok((await form("request_for")).custom_dropdown_template.includes("<b>{{ item.label }}</b>") && (await form("request_for")).use_custom_dropdown === true, "an edited template is saved in place");

await p.locator(".rs-item", { hasText: "Request For" }).first().click();
await p.waitForTimeout(300);
await tpl.getByRole("button", { name: "Open in a file" }).click();
await p.waitForTimeout(100);
const asked = await p.evaluate(() => (window.__opened || []).filter((o) => o.type === "openCode").at(-1));
ok(asked && asked.path.join(".") === "rendering._variances.form.custom_dropdown_template" && asked.language === "html", "Open in a file opens the template");

// ===== switching it off hides the template, and keeps it =====
await row("Custom dropdown style").getByRole("switch").click();
await p.waitForTimeout(100);
ok((await row("Dropdown option template").count()) === 0, "off: the template is hidden");
await save();
let f = await form("request_for");
ok(f.use_custom_dropdown === false && f.custom_dropdown_template.includes("<b>"), "saved off, the template kept");

// ===== a new one =====
await p.locator(".rs-item", { hasText: "Owner" }).first().click();
await p.waitForTimeout(300);
ok((await row("Custom dropdown style").count()) === 1 && !(await row("Custom dropdown style").getByRole("switch").isChecked()), "a mapped property offers it, off");
await row("Custom dropdown style").getByRole("switch").click();
await p.waitForTimeout(100);
ok((await row("Dropdown option template").locator("textarea").inputValue()).includes("This represents ONE option in the dropdown list"), "on: Saturn's starter template shows");
await save();
f = await form("owner");
ok(f.use_custom_dropdown === true && f.custom_dropdown_template.startsWith("<template>\n  <!-- Display details -->"), "saved with the starter template");

// ===== not for a plain property =====
await p.locator(".rs-item", { hasText: "Amount" }).first().click();
await p.waitForTimeout(300);
ok((await row("Custom dropdown style").count()) === 0, "a plain input doesn't show it");

// ===== search finds it =====
await p.locator(".rs-item", { hasText: "Owner" }).first().click();
await p.waitForTimeout(300);
await p.getByRole("searchbox", { name: /Find a setting/ }).or(p.locator(".pe-find")).first().fill("dropdown");
await p.waitForTimeout(200);
ok((await row("Custom dropdown style").count()) === 1, "Find a setting finds it");

ok(!errs.length, "no page errors " + JSON.stringify(errs));
await b.close();
