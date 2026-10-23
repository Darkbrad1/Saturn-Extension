// v0.3.55: a property's settings grouped by place (Basics, Rules, Choices, In forms, In tables, In record views,
// Access, Advanced), one "Where the choices come from" picker, a place the property is hidden in folded, Advanced
// folded, and Favourites at the top: picked with Edit, reordered (↑ / ↓ and dragging), the same values as in the
// groups, one list for the Resources screen and the node view's Form tab.
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
await p.selectOption(".rs-select select", "Application");
await p.waitForTimeout(300);
await p.locator(".rs-item", { hasText: "Status" }).first().click();
await p.waitForTimeout(300);

// ===== grouped by place =====
ok((await titles()).join() === "★ Favourites,Basics,Rules,Choices,In forms,In tables,In record views,Access,Advanced,JSON", "the groups go by place: " + (await titles()).join());
ok((await p.locator(".pe-menu > .pe-menu-group > .pe-menu-item").allInnerTexts()).map((t) => t.split("\n")[0]).join() === "★ Favourites,Basics,Rules,Choices,In forms,In tables,In record views,Access,Advanced,JSON", "the menu lists the same groups");
ok((await p.locator(".pe-favs .pe-fav-empty").innerText()).includes("Press Edit"), "Favourites starts empty and says how to add some");

// ===== Advanced starts folded; a search finds its settings anyway =====
ok((await p.locator(".pe-page .pe-label", { hasText: /^Hide from the API$/ }).count()) === 0, "Advanced starts folded");
await p.getByRole("button", { name: "Show advanced settings" }).click();
ok((await p.locator(".pe-page .pe-label", { hasText: /^Hide from the API$/ }).count()) === 1, "Show advanced settings opens it");
await p.getByRole("button", { name: "Fold advanced settings" }).click();
await p.fill(".pe-find", "api");
await p.waitForTimeout(150);
ok((await p.locator(".pe-page .pe-label", { hasText: /^Hide from the API$/ }).count()) === 1, "Find a setting finds a folded one");
await p.fill(".pe-find", "");

// ===== a place it's hidden in: says so and folds =====
await p.getByRole("switch", { name: "Show in tables", exact: true }).click();
await p.waitForTimeout(100);
ok((await draft("status"))?.hideInTable === true, "switching off Show in tables stores hideInTable: true, as before");
const tableBlock = p.locator(".pe-block", { has: p.locator(".pe-group-title", { hasText: /^In tables/ }) });
ok((await tableBlock.locator(".pe-hidden-tag").count()) === 1 && (await p.locator(".pe-menu-item", { hasText: "In tables" }).locator(".pe-hidden-tag").count()) === 1, "the group and its menu item say Hidden");
ok((await p.locator(".pe-page .pe-label", { hasText: /^Column width$/ }).count()) === 0 && (await p.getByRole("switch", { name: "Show in tables", exact: true }).count()) === 1, "its other settings fold; its switch stays");
await p.screenshot({ path: out + "/g1-hidden-place.png" });
await p.getByRole("button", { name: /^Hidden here\. Show its other settings/ }).click();
ok((await p.locator(".pe-page .pe-label", { hasText: /^Column width$/ }).count()) === 1, "they can be opened, kept as they are");
await p.getByRole("button", { name: "Discard" }).click();
await p.waitForTimeout(200);

// ===== where the choices come from =====
const choice = (name) => p.getByRole("radiogroup", { name: "Where the choices come from" }).getByRole("radio", { name: new RegExp(`^${name}`) });
ok((await choice("None").getAttribute("aria-checked")) === "true", "a plain property's choices: None");
ok((await p.locator(".pe-part-title", { hasText: /^A fixed list$/ }).count()) === 0, "and only the picker shows");
await choice("A fixed list").click();
await p.waitForTimeout(100);
ok((await draft("status"))?.lookup_type === "values" && (await p.locator(".pe-part-title", { hasText: /^A fixed list$/ }).count()) === 1, "A fixed list stores lookup_type: values and shows its Values");
const values = p.locator(".pe-row", { has: p.locator(".pe-label", { hasText: /^Values$/ }) }).locator("input");
await values.fill("Open");
await values.press("Enter");
await values.fill("Closed");
await values.press("Enter");
ok((await draft("status"))?.lookup_reference === "Open,Closed", "the values are stored as Saturn keeps them");
ok((await p.locator(".pe-menu-item", { hasText: "Choices" }).locator(".pe-count").count()) === 1, "the change counts in the Choices group");
await choice("Another resource").click();
await p.waitForTimeout(100);
let d = await draft("status");
ok(d.map && d.map.type === "model" && d.lookup_type === "" && (await p.locator(".pe-part-title", { hasText: /^A fixed list$/ }).count()) === 0 && (await p.locator(".pe-part-title", { hasText: /^Another resource$/ }).count()) === 1, "Another resource adds a map and switches the list off");
await choice("A fixed list").click();
await p.waitForTimeout(100);
d = await draft("status");
ok(d.lookup_type === "values" && d.lookup_reference === "Open,Closed" && d.map === undefined, "switching back brings the typed values back");
const choicesRow = p.locator(".pe-row", { has: p.getByRole("radiogroup", { name: "Where the choices come from" }) });
ok((await choicesRow.innerText()).includes("was None"), "the picker says what it was");
await p.locator(".rs-top").getByRole("button", { name: "Save", exact: true }).click();
await p.locator(".rs-confirm").getByRole("button", { name: "Save", exact: true }).click();
await p.waitForTimeout(400);
const saved = await p.evaluate(() => window.__data.Application.find((x) => x.key === "status"));
ok(saved.lookup_type === "values" && saved.lookup_reference === "Open,Closed" && saved.map === undefined, "saved where Saturn keeps it: lookup_type and lookup_reference");

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
ok((await draft("status"))?.required === true && (await p.locator(".pe-block", { has: p.locator(".pe-group-title", { hasText: /^Rules/ }) }).getByRole("switch", { name: "Required", exact: true }).isChecked()), "a favourite edits the same value as its group");
await p.getByRole("button", { name: "Discard" }).click();
await p.waitForTimeout(200);

// dragging one by its handle
const grip = (label) => p.locator(".pe-fav-row", { has: p.locator(".pe-label", { hasText: new RegExp(`^${label}$`) }) }).locator(".pe-fav-grip");
await grip("Input type").dragTo(p.locator(".pe-fav-row", { has: p.locator(".pe-label", { hasText: /^Required$/ }) }));
await p.waitForTimeout(150);
ok((await favLabels()).join() === "Input type,Required,Column width" && (await stored()).join() === "input_properties.type,required,tableColumnWidth", "dragging a favourite moves it: " + (await favLabels()).join());

// another property and another resource show the same list
await p.selectOption(".rs-select select", "Loan");
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
ok((await titles()).includes("In forms") && (await titles()).includes("Choices"), "and the same groups");
await p.locator(".pe-fav-edit").click();
await p.getByRole("button", { name: "Take Column width out" }).click();
await p.locator(".pe-fav-edit").click();
ok((await stored()).join() === "input_properties.type,required" && (await favLabels()).join() === "Input type,Required", "taking one out there changes the one list");
await p.screenshot({ path: out + "/g3-formtab-favourites.png" });

ok(errs.length === 0, "no page errors (" + errs.join(" | ") + ")");
await b.close();
