// v0.3.56: Show everywhere (Basics, under Type): one switch for the six Show in switches (forms, add forms, edit
// forms, tables, drawers, record views). Half on when shown in some; stored as Saturn's hideIn… settings.
import { chromium } from "playwright";
const out = process.env.SHOTS ?? "shots";
const b = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
const errs = [];
p.on("pageerror", (e) => errs.push("pageerror: " + e.message));
const ok = (c, msg) => console.log((c ? "PASS " : "FAIL ") + msg);
const draft = () => p.evaluate(() => window.acquireVsCodeApi().getState().works?.Application?.drafts?.status ?? null);
const all = () => p.getByRole("switch", { name: "Show everywhere", exact: true });
const one = (name) => p.getByRole("switch", { name, exact: true });
const SIX = ["Show in forms", "Show in add forms", "Show in edit forms", "Show in tables", "Show in drawers", "Show in record views"];
const unfold = async () => { while (await p.locator(".pe-fold[aria-expanded=false]").count()) { await p.locator(".pe-fold[aria-expanded=false]").first().click(); await p.waitForTimeout(50); } };

await p.goto("http://localhost:8765/resources.html");
await p.waitForTimeout(400);
await p.selectOption(".rs-select select", "Application");
await p.waitForTimeout(300);
await p.locator(".rs-item", { hasText: "Status" }).first().click();
await p.waitForTimeout(300);

const basics = await p.locator(".pe-block", { has: p.locator(".pe-group-title", { hasText: /^Basics/ }) }).locator(".pe-label").allInnerTexts();
ok(basics.indexOf("Show everywhere") === basics.indexOf("Type") + 1, "Show everywhere is in Basics, right under Type: " + basics.join(", "));
ok((await all().isChecked()) && (await all().getAttribute("aria-checked")) === "true", "a property shown everywhere: on");

await all().click();
await p.waitForTimeout(100);
let d = await draft();
ok(["hideInForm", "hideInForm_add", "hideInForm_edit", "hideInTable", "hideInDrawer", "hideInView"].every((k) => d[k] === true), "off hides it in all six places (hideIn…: true)");
await unfold();
let states = await Promise.all(SIX.map((n) => one(n).isChecked()));
ok(states.every((s) => !s), "and every Show in switch is off");
ok((await p.locator(".pe-menu-item", { hasText: "In tables" }).locator(".pe-hidden-tag").count()) === 1, "the places say Hidden");
ok((await p.locator(".pe-row", { has: all() }).innerText()).includes("was on"), "it says it was on");
await p.screenshot({ path: out + "/h1-hidden-everywhere.png" });

await one("Show in tables").click();
await p.waitForTimeout(100);
ok((await all().getAttribute("aria-checked")) === "mixed", "shown in some places: half on");
await all().click();
await p.waitForTimeout(100);
d = await draft();
ok(["hideInForm", "hideInForm_add", "hideInForm_edit", "hideInTable", "hideInDrawer", "hideInView"].every((k) => d[k] === false) && (await all().isChecked()), "a click on half on shows it everywhere");

await all().click();
await p.locator(".pe-row", { has: all() }).getByRole("button", { name: "Put back" }).click();
await p.waitForTimeout(100);
d = await draft();
ok(d === null || (d.hideInForm_add === undefined && d.hideInTable === false), "Put back returns all six to what's saved");
ok((await p.locator(".rs-unsaved").count()) === 0, "nothing unsaved after Put back");

// several properties: they differ → half on, a click sets all
await all().click();
await p.locator(".rs-item", { hasText: "Application Number" }).first().click({ modifiers: ["Control"] });
await p.waitForTimeout(200);
ok((await all().getAttribute("aria-checked")) === "mixed", "two properties that differ: half on");
await all().click();
await p.waitForTimeout(100);
const both = await p.evaluate(() => window.acquireVsCodeApi().getState().works.Application.drafts);
ok(both.status.hideInTable === false && (both.application_number?.hideInTable ?? false) === false, "a click shows both everywhere");

// saved as Saturn keeps it
await p.locator(".rs-item", { hasText: "Status" }).first().click();
await all().click();
await p.locator(".rs-top").getByRole("button", { name: "Save", exact: true }).click();
await p.locator(".rs-confirm").getByRole("button", { name: "Save", exact: true }).click();
await p.waitForTimeout(400);
const saved = await p.evaluate(() => window.__data.Application.find((x) => x.key === "status"));
ok(saved.hideInForm === true && saved.hideInTable === true && saved.hideInView === true && saved.hideInDrawer === true && saved.hideInForm_add === true && saved.hideInForm_edit === true, "saved as the six hideIn… settings");

ok(errs.length === 0, "no page errors (" + errs.join(" | ") + ")");
await b.close();
