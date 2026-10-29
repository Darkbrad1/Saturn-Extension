// v0.3.53: T folds the Menus screen's menus list; the Keyboard shortcuts page changes keys (press one to add it,
// × to take one off, Reset), refuses a key another shortcut on the same screen uses, and every screen uses the
// keys picked there.
import { chromium } from "playwright";
const out = process.env.SHOTS ?? "shots";
const b = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs = [];
p.on("pageerror", (e) => errs.push("pageerror: " + e.message));
p.on("console", (m) => /Content Security|Refused/.test(m.text()) && errs.push("CSP: " + m.text()));
const ok = (c, msg) => console.log((c ? "PASS " : "FAIL ") + msg);
const row = (id) => p.locator(`.ks-row[data-id="${id}"]`);
const keysIn = (id) => row(id).locator("kbd").allInnerTexts();

// ===== Menus: T =====
await p.goto("http://localhost:8765/menus.html");
await p.evaluate(() => localStorage.removeItem("__shortcuts"));
await p.goto("http://localhost:8765/menus.html");
await p.waitForTimeout(500);
await p.locator(".rs-top").click({ position: { x: 5, y: 5 } });
await p.keyboard.press("t");
await p.waitForTimeout(150);
ok(!(await p.locator(".mn-menus").isVisible()) && (await p.locator(".mn-side-open").isVisible()), "Menus: T hides the menus list, leaving a strip");
await p.keyboard.press("t");
await p.waitForTimeout(150);
ok(await p.locator(".mn-menus").isVisible(), "T again shows it");
await p.locator(".mn-list-fold").click();
ok(!(await p.locator(".mn-menus").isVisible()), "« hides it too");
await p.locator(".mn-side-open").click();
ok(await p.locator(".mn-menus").isVisible(), "» brings it back");

// ===== the page =====
await p.goto("http://localhost:8765/keys.html");
await p.waitForTimeout(400);
ok((await p.locator(".ks-group h2").allInnerTexts()).join() === "Node view (Workflows),Resources,Menus", "the page lists the shortcuts by screen");
ok((await keysIn("node.layers")).join() === "T" && (await keysIn("node.delete")).join() === "X,Delete,Backspace", "each with its keys");
await p.screenshot({ path: out + "/k1-page.png" });

// add L to the layers panel, take T off
await row("node.layers").getByRole("button", { name: /Add a key/ }).click();
ok((await row("node.layers").locator(".ks-add").innerText()).includes("Press a key"), "+ waits for a key");
await p.keyboard.press("l");
await p.waitForTimeout(150);
ok((await keysIn("node.layers")).join() === "T,L", "pressing L adds it");
await row("node.layers").getByRole("button", { name: "Take T off" }).click();
await p.waitForTimeout(150);
ok((await keysIn("node.layers")).join() === "L" && (await row("node.layers").locator(".ks-was").innerText()).includes("Default: T"), "× takes T off; the default shows");
const stored = await p.evaluate(() => JSON.parse(localStorage.getItem("__shortcuts")));
ok(JSON.stringify(stored["node.layers"]) === '["L"]', "the extension is sent the new keys");

// a clash is refused
await row("node.panel").getByRole("button", { name: /Add a key/ }).click();
await p.keyboard.press("l");
await p.waitForTimeout(150);
ok((await keysIn("node.panel")).join() === "N" && /already used by "Hide or show the layers panel"/.test(await row("node.panel").locator(".ks-problem").innerText()), "a key another shortcut has is refused, saying which");
// the same key on another screen is fine
await row("resources.list").getByRole("button", { name: /Add a key/ }).click();
await p.keyboard.press("l");
await p.waitForTimeout(150);
ok((await keysIn("resources.list")).join() === "T,L", "the same key on another screen is allowed");
// Esc cancels
await row("node.fit").getByRole("button", { name: /Add a key/ }).click();
await p.keyboard.press("Escape");
await p.waitForTimeout(100);
ok((await keysIn("node.fit")).join() === "Home" && !(await row("node.fit").locator(".ks-add").innerText()).includes("Press"), "Esc cancels");
// a combo
await row("node.save").getByRole("button", { name: /Add a key/ }).click();
await p.keyboard.press("Control+Shift+S");
await p.waitForTimeout(100);
ok((await keysIn("node.save")).some((k) => /Shift\+S/.test(k)), "a combo with Ctrl and Shift: " + (await keysIn("node.save")).join());
await row("node.save").getByRole("button", { name: "Reset" }).click();
await p.waitForTimeout(100);
ok((await keysIn("node.save")).length === 1, "Reset puts one shortcut back");
// search
await p.locator(".ks-search").fill("panel");
ok((await p.locator(".ks-row").count()) === 2, "search narrows the list");
await p.locator(".ks-search").fill("");
await p.screenshot({ path: out + "/k2-changed.png" });

// ===== the node view uses them =====
await p.goto("http://localhost:8765/csp.html?app");
await p.waitForTimeout(1000);
await p.locator(".nv-picker-item", { hasText: "Application" }).click();
await p.waitForTimeout(900);
await p.locator(".react-flow__pane").first().click({ position: { x: 30, y: 30 } });
await p.keyboard.press("t");
await p.waitForTimeout(200);
ok((await p.locator(".nv-outliner").count()) === 1, "node view: T no longer hides the layers panel");
await p.keyboard.press("l");
await p.waitForTimeout(200);
ok((await p.locator(".nv-outliner").count()) === 0, "L does");
ok((await p.locator(".nv-topbar").getByRole("button", { name: "Layers" }).getAttribute("title")).includes("(L)"), "and the tooltip says L");

// ===== Resources uses them =====
await p.goto("http://localhost:8765/resources.html");
await p.waitForTimeout(400);
await p.locator(".rs-picker-btn").click(); await p.locator(`.rs-picker-item[data-resource=${JSON.stringify("Application")}]`).click();
await p.waitForTimeout(300);
await p.locator(".rs-item").first().click();
await p.keyboard.press("l");
await p.waitForTimeout(150);
ok(!(await p.locator(".rs-side").isVisible()), "Resources: the added L hides the list too");

// reset all
await p.goto("http://localhost:8765/keys.html");
await p.waitForTimeout(400);
await p.getByRole("button", { name: /Reset all/ }).click();
await p.waitForTimeout(150);
ok((await keysIn("node.layers")).join() === "T" && (await p.evaluate(() => localStorage.getItem("__shortcuts"))) === "{}", "Reset all puts every shortcut back");
ok(!errs.length, "no page errors " + JSON.stringify(errs));
await b.close();
