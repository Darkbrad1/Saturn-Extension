// v0.3.32: with several tabs picked on the Menus screen, every section shows (the caption aside): what
// they open, and filter, views and columns when they open the same resource. A change goes to all.
import { chromium } from "playwright";
const out = process.env.SHOTS ?? "shots";
const b = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const p = await b.newPage({ viewport: { width: 1500, height: 900 } });
const errs = [];
p.on("pageerror", (e) => errs.push("pageerror: " + e.message));
const ok = (c, msg) => console.log((c ? "PASS " : "FAIL ") + msg);
const tab = (label) => p.locator(".mn-tab", { has: p.locator(".rs-item-label", { hasText: new RegExp(`^${label}\\d*$`) }) });
const sections = async () => p.locator(".mn-detail .pe-part-title").allInnerTexts();
const instance = () => p.evaluate(() => JSON.parse(JSON.stringify(window.__menus)));

await p.goto("http://localhost:8765/menus.html");
await p.waitForTimeout(700);

// two tabs on the same resource, with different filters
await tab("Approved").click();
await tab("Rejected").click({ modifiers: ["Control"] });
await p.waitForTimeout(200);
const s = await sections();
ok(["What it opens", "Filter", "Views", "Look", "Behaviour"].every((x) => s.includes(x)), `every section shows for two tabs on one resource (${s.join(", ")})`);
ok((await p.locator("#mn-caption").count()) === 0, "the caption is left out");
ok((await p.locator("#mn-resource").inputValue()) === "Application", "the shared resource shows");
ok((await p.locator(".pe-row", { hasText: "Records shown" }).locator(".pe-mixed").count()) === 1, "different filters show Mixed");
ok((await p.locator(".mn-view-name").count()) > 0, "the shared views can be edited");
await p.locator(".pe-row", { hasText: "Records shown" }).getByRole("button", { name: /text/i }).first().click().catch(() => {});
const area = p.locator(".pe-row", { hasText: "Records shown" }).locator("textarea");
if (await area.count()) {
  await area.fill('status = "closed"');
  await p.waitForTimeout(200);
  await p.screenshot({ path: `${out}/v0332-many-tabs.png` });
  await p.getByRole("button", { name: "Save" }).first().click();
  await p.waitForTimeout(200);
  const confirm = p.getByRole("button", { name: /^Save/ }).last();
  await confirm.click();
  await p.waitForTimeout(800);
  const subs = (await instance()).find((m) => m.id === "menu-loans").references[0].sub_menus;
  ok(subs.every((t) => t.filter === 'status = "closed"'), "a filter typed for both is saved on both");
} else ok(false, "the filter can be typed as text");

// different views: a button gives all of them the first one's
await tab("Approved").click();
await p.waitForTimeout(150);
await p.getByLabel("Add a view").selectOption({ index: 1 });
await tab("Rejected").click({ modifiers: ["Control"] });
await p.waitForTimeout(200);
const give = p.getByRole("button", { name: /Give all of them Approved's views/ });
ok((await give.count()) === 1 && (await p.locator(".mn-view-name").count()) === 0, "different views: Mixed, with a button instead of the editor");
await give.click();
await p.waitForTimeout(200);
ok((await p.locator(".mn-view-name").count()) === 2, "after the button, both have Approved's two views and they can be edited");

// tabs on different resources: what they open shows Mixed, filter and views wait
await p.locator(".mn-menu").first().click();
await p.waitForTimeout(200);
await tab("Applications").click();
await tab("Loans").click({ modifiers: ["Control"] });
await p.waitForTimeout(200);
ok((await p.locator(".pe-row", { hasText: "Resource" }).locator(".pe-mixed").count()) === 1 && !(await sections()).includes("Filter"), "different resources: Resource shows Mixed; no filter or views");
ok((await p.locator(".mn-note").innerText()).includes("same resource"), "a note says why");
await p.locator("#mn-resource").selectOption("Loan");
await p.waitForTimeout(200);
ok((await sections()).includes("Filter") && (await sections()).includes("Views"), "picking one resource for both brings back filter and views");

// a resource tab and a custom page: the kinds differ
await tab("Loans").click();
await tab("Overview").click({ modifiers: ["Control"] });
await p.waitForTimeout(200);
ok((await p.locator(".pe-row", { hasText: "Opens" }).locator(".pe-mixed").count()) === 1 && (await p.getByRole("radio", { checked: true }).count()) === 0, "a resource and a custom page: Opens shows Mixed");
ok((await sections()).includes("Look"), "Look still shows");

ok(errs.length === 0, "no page errors " + JSON.stringify(errs));
await b.close();
