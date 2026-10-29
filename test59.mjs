// v0.3.70: the rich text editor, on the owner's real test note (csp.html?app: headings, colours, a link, a picture and
// a Dark Header table, with line spacing). The bar over picked text stays inside the panel; its block menu works; a
// link can be taken off; a picture shows, can be pointed at another address and removed; a table can grow and be
// deleted, and a new one is Saturn's Dark Header; line spacing is 1.0 to 3.0. What's saved is Saturn's HTML.
import { chromium } from "playwright";
const out = process.env.SHOTS ?? "shots";
const b = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium" });
const p = await b.newPage({ viewport: { width: 1500, height: 1000 } });
const errs = [];
p.on("pageerror", (e) => errs.push("pageerror: " + e.message));
p.on("console", (m) => /Content Security|Refused/.test(m.text()) && errs.push("CSP: " + m.text()));
const ok = (c, msg) => console.log((c ? "PASS " : "FAIL ") + msg);
const panel = p.locator(".fg-panel");
const desc = panel.locator('[data-prop="description"]');
const body = desc.locator(".nv-rich-body");
const saved = async () => {
  const def = await p.evaluate(() => JSON.parse(JSON.stringify(window.__getDef())));
  for (const st of def.stages) for (const a of st.actions) for (const c of a.task?.commands ?? []) if (c.id === "RICHNOTE") return c.data.properties.description;
  return null;
};
/** Picks the text of the element matching sel inside the editor. */
const pickText = async (sel, nth = 0) => {
  await body.evaluate((root, [sel, nth]) => {
    const el = root.querySelectorAll(sel)[nth];
    const r = document.createRange();
    r.selectNodeContents(el);
    const s = getSelection();
    s.removeAllRanges();
    s.addRange(r);
    root.focus();
    document.dispatchEvent(new Event("selectionchange"));
  }, [sel, nth]);
  await p.waitForTimeout(250);
};
const leave = async () => {
  await panel.locator(".fg-op-name, .fg-head, h2").first().click({ force: true }).catch(() => {});
  await p.mouse.click(700, 150);
  await p.waitForTimeout(700);
};

await p.goto("http://localhost:8765/csp.html?app");
await p.waitForTimeout(1000);
await p.locator(".nv-picker-item", { hasText: "Application" }).click();
await p.waitForTimeout(900);
// find the step holding the test note (the one with a table)
let found = false;
for (let i = 0; i < (await p.locator(".nv-ol-item", { hasText: "Withdraw" }).count()) && !found; i++) {
  await p.locator(".nv-ol-item", { hasText: "Withdraw" }).nth(i).click();
  await p.waitForTimeout(800);
  const cards = p.locator(".react-flow__node", { has: p.locator(".nv-node-title", { hasText: /^Note$/ }) });
  for (let j = 0; j < (await cards.count()) && !found; j++) {
    await cards.nth(j).click();
    await p.waitForTimeout(900);
    found = (await body.locator("table").count()) > 0;
  }
}
ok(found, "the test note's step opens, with its table");

// ===== how the note shows =====
ok((await body.locator("h1, h2, h3, h4").count()) >= 4, "its headings show");
const img = body.locator("img").first();
ok((await img.count()) === 1 && (await img.evaluate((i) => i.complete && i.naturalWidth > 0)), "the picture shows (it used to be blocked)");
ok((await body.locator("table thead th").count()) > 0 && (await body.locator("table").getAttribute("data-style")) === "dark-header", "the Dark Header table shows with its header row");
await desc.scrollIntoViewIfNeeded();
await p.screenshot({ path: `${out}/v0370-rich-note.png` });

// ===== the bar stays inside the panel =====
await pickText("p", 0);
const bar = desc.locator(".nv-rich-bar").first();
ok((await bar.count()) === 1, "picking text shows the bar");
const bb = await bar.boundingBox(), pb = await panel.boundingBox();
ok(bb.x >= pb.x - 1 && bb.x + bb.width <= pb.x + pb.width + 1, `the bar fits inside the panel (${Math.round(bb.x)}..${Math.round(bb.x + bb.width)} in ${Math.round(pb.x)}..${Math.round(pb.x + pb.width)})`);
ok((await bar.locator("svg").count()) >= 12, "its tools are Font Awesome icons");
await p.screenshot({ path: `${out}/v0370-rich-bar.png` });

// ===== the block menu =====
await bar.locator(".nv-rich-menu").click();
await p.waitForTimeout(200);
ok((await bar.getByRole("menuitem").count()) === 7, "the block menu opens, listing Text, Heading 1 to 4, Quote and Code");
await p.screenshot({ path: `${out}/v0370-rich-blocks.png` });
const h2Before = await body.locator("h2").count();
await bar.getByRole("menuitem", { name: "Heading 2" }).click();
await p.waitForTimeout(250);
ok((await body.locator("h2").count()) === h2Before + 1, "picking Heading 2 turns the paragraph into a heading");

// ===== line spacing =====
await pickText("p", 0);
await bar.getByRole("button", { name: "Line spacing" }).click();
await p.waitForTimeout(150);
const sp = await bar.getByRole("menuitem").allInnerTexts();
ok(sp.join(",") === "1.0,1.5,2.0,2.5,3.0", "line spacing offers 1.0 to 3.0: " + sp.join(","));
await bar.getByRole("menuitem", { name: "2.5" }).click();
await p.waitForTimeout(200);
ok(await body.evaluate((r) => [...r.querySelectorAll("p")].some((x) => x.style.lineHeight === "2.5")), "2.5 sets the paragraph's line spacing");

// ===== unlink =====
const links = await body.locator("a").count();
await pickText("a", 0);
await bar.getByRole("button", { name: /link/i }).first().click();
await p.waitForTimeout(200);
const unlink = desc.getByRole("button", { name: /Unlink/ });
ok((await unlink.count()) === 1, "a picked link offers Unlink");
await p.screenshot({ path: `${out}/v0370-rich-unlink.png` });
await unlink.click();
await p.waitForTimeout(250);
ok((await body.locator("a").count()) === links - 1, "Unlink takes the link off and keeps the text");

// ===== the picture: change and remove =====
await img.click();
await p.waitForTimeout(250);
const ib = desc.getByRole("toolbar", { name: "The picked picture" });
ok((await ib.count()) === 1, "clicking the picture shows its bar");
await ib.getByRole("button", { name: "Change the picture" }).click();
await desc.getByLabel("Picture link").fill("https://example.com/logo.png");
await desc.getByLabel("Picture link").press("Enter");
await p.waitForTimeout(250);
ok((await body.locator("img").first().getAttribute("src")) === "https://example.com/logo.png", "Change points the picture at the typed address");
await p.screenshot({ path: `${out}/v0370-rich-picture.png` });
await body.locator("img").first().click();
await p.waitForTimeout(200);
await desc.getByRole("button", { name: "Remove the picture" }).click();
await p.waitForTimeout(250);
ok((await body.locator("img").count()) === 0, "Remove takes the picture out");

// ===== the table =====
const rows = await body.locator("table tr").count();
await body.locator("table tbody td").first().click();
await p.waitForTimeout(250);
const tb = desc.getByRole("toolbar", { name: "The table" });
ok((await tb.count()) === 1, "a click in the table shows the table bar");
await tb.getByRole("button", { name: "Add a row below" }).click();
await p.waitForTimeout(200);
ok((await body.locator("table tr").count()) === rows + 1, "+ Row adds a row");
await p.screenshot({ path: `${out}/v0370-rich-table.png` });
await body.locator("table tbody td").first().click();
await p.waitForTimeout(200);
await tb.getByRole("button", { name: "Delete the table" }).click();
await p.waitForTimeout(250);
ok((await body.locator("table").count()) === 0, "Delete table takes the table out");

// ===== a new Dark Header table from the / menu =====
await body.evaluate((root) => {
  const pEl = document.createElement("p");
  pEl.innerHTML = "<br>";
  root.appendChild(pEl);
  const r = document.createRange();
  r.setStart(pEl, 0);
  r.collapse(true);
  getSelection().removeAllRanges();
  getSelection().addRange(r);
  root.focus();
});
await p.keyboard.type("/tab");
await p.waitForTimeout(250);
await desc.getByRole("option", { name: /Table/ }).click();
await p.waitForTimeout(250);
ok((await desc.getByText("Dark Header").count()) >= 1, "the table picker offers Saturn's Dark Header style");
await p.screenshot({ path: `${out}/v0370-rich-newtable.png` });
await desc.locator(".nv-rich-table .is-primary, .nv-rich-table button.nv-mini-btn.is-primary").first().click();
await p.waitForTimeout(300);
ok((await body.locator("table[data-style=dark-header]").count()) === 1, "Insert puts a Dark Header table in");

// ===== saved as Saturn's HTML =====
await leave();
const html = (await saved()) ?? "";
ok(/<h2>/.test(html) && /line-height: 2.5/.test(html), "the heading and the spacing are saved");
ok(!/<img/.test(html) && /class="sa-rich-editor-table sa-rich-editor-table--dark-header"/.test(html) && /data-style="dark-header"/.test(html), "the removed picture is gone and the new table is saved the way Saturn writes a Dark Header table");
ok(!/nv-rich|ql-ui/.test(html), "none of the editor's own marks are saved");

ok(errs.length === 0, "no page or CSP errors: " + errs.join(" | "));
await b.close();
