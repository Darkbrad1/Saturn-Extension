// v0.3.55 / 0.3.58: Favourites at the top of a property's settings: picked with Edit, reordered (↑ / ↓ and dragging), the
// same values as in the groups, one list for the Resources screen and the node view's Form tab. 0.3.58: the groups
// are back to General, Visibility, Input, Data, Display, Access.
import { chromium } from "playwright";
const out = process.env.SHOTS ?? "shots";
const b = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const ctx = await b.newContext({ viewport: { width: 1440, height: 1000 } });
const p = await ctx.newPage();
const errs = [];
p.on("pageerror", (e) => errs.push("pageerror: " + e.message));
const ok = (c, msg) => console.log((c ? "PASS " : "FAIL ") + msg);
const titles = async () => (await p.locator(".pe-page .pe-group-title").allInnerTexts()).map((t) => t.replace(/\s*(Edit|Done|Hidden)$/, "").trim());
const favLabels = () => p.locator(".pe-favs .pe-fav-row .pe-label").allInnerTexts();
const draft = (key) => p.evaluate((k) => window.acquireVsCodeApi().getState().works?.Application?.drafts?.[k] ?? null, key);
const stored = () => p.evaluate(() => JSON.parse(localStorage.getItem("__favourites") || "[]"));

await p.goto("http://localhost:8765/resources.html");
await p.waitForTimeout(400);
await p.locator(".rs-picker-btn").click(); await p.locator(`.rs-picker-item[data-resource=${JSON.stringify("Application")}]`).click();
await p.waitForTimeout(300);
await p.locator(".rs-item", { hasText: "Status" }).first().click();
await p.waitForTimeout(300);

// ===== the groups as before 0.3.55, Favourites first =====
ok((await titles()).join() === "★ Favourites,General,Visibility,Input,Data,Display,Access,JSON", "the groups: " + (await titles()).join());
ok((await p.locator(".pe-favs .pe-fav-empty").innerText()).includes("Press Edit"), "Favourites starts empty and says how to add some");
ok((await p.locator(".pe-fold").count()) === 0 && (await p.getByRole("radiogroup", { name: "Where the choices come from" }).count()) === 0, "no folded groups, no Choices picker");

// ===== Favourites =====
await p.locator(".pe-fav-edit").click();
const tick = (name) => p.locator(".pe-fav-all .pe-pick", { has: p.locator("span", { hasText: new RegExp(`^${name}$`) }) }).first().locator("input");
await tick("Required").check();
await tick("Input type").check();
await tick("Column width").check();
ok((await stored()).join() === "required,input_properties.type,tableColumnWidth", "ticked settings are kept, in the order picked: " + (await stored()).join());
await p.getByRole("button", { name: "Move Column width up" }).click();
ok((await stored()).join() === "required,tableColumnWidth,input_properties.type", "↑ moves one up");
await p.locator(".pe-fav-edit").click();
ok((await favLabels()).join() === "Required,Column width,Input type", "Favourites shows them in that order: " + (await favLabels()).join());
await p.screenshot({ path: out + "/g2-favourites.png" });

// the same value as in its group
await p.locator(".pe-favs").getByRole("switch", { name: "Required", exact: true }).click();
await p.waitForTimeout(100);
ok((await draft("status"))?.required === true && (await p.locator(".pe-block", { has: p.locator(".pe-part-title", { hasText: /^Rules$/ }) }).getByRole("switch", { name: "Required", exact: true }).isChecked()), "a favourite edits the same value as its group");
await p.getByRole("button", { name: "Discard" }).click();
await p.waitForTimeout(200);

// dragging one by its handle
const grip = (label) => p.locator(".pe-fav-row", { has: p.locator(".pe-label", { hasText: new RegExp(`^${label}$`) }) }).locator(".pe-fav-grip");
await grip("Input type").dragTo(p.locator(".pe-fav-row", { has: p.locator(".pe-label", { hasText: /^Required$/ }) }));
await p.waitForTimeout(150);
ok((await favLabels()).join() === "Input type,Required,Column width" && (await stored()).join() === "input_properties.type,required,tableColumnWidth", "dragging a favourite moves it: " + (await favLabels()).join());

// another property and another resource show the same list
await p.locator(".rs-picker-btn").click(); await p.locator(`.rs-picker-item[data-resource=${JSON.stringify("Loan")}]`).click();
await p.waitForTimeout(300);
await p.locator(".rs-item").first().click();
await p.waitForTimeout(300);
ok((await favLabels()).join() === "Input type,Required,Column width", "another resource shows the same favourites");

// ===== the Form tab: the same list =====
await p.goto("http://localhost:8765/csp.html");
await p.waitForTimeout(900);
await p.locator(".nv-picker-item", { hasText: "Support tickets" }).click();
await p.waitForTimeout(900);
await p.locator(".nv-ol-item", { hasText: "Escalate" }).click();
await p.waitForTimeout(600);
await p.locator(".fg-tab", { hasText: /^Form/ }).click();
await p.waitForTimeout(500);
await p.locator(".rs-item", { hasText: "Staff" }).first().click();
await p.waitForTimeout(300);
ok((await favLabels()).join() === "Input type,Required,Column width", "the Form tab shows the same favourites: " + (await favLabels()).join());
ok((await titles()).includes("Visibility") && (await titles()).includes("Data"), "and the same groups");
await p.locator(".pe-fav-edit").click();
await p.getByRole("button", { name: "Take Column width out" }).click();
await p.locator(".pe-fav-edit").click();
ok((await stored()).join() === "input_properties.type,required" && (await favLabels()).join() === "Input type,Required", "taking one out there changes the one list");
await p.screenshot({ path: out + "/g3-formtab-favourites.png" });

ok(errs.length === 0, "no page errors (" + errs.join(" | ") + ")");
await b.close();
