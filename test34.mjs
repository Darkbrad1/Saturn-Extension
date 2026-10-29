// v0.3.47: a section's properties: the find-or-add box sits at the top, searching narrows the list and
// offers the properties to add; rows drag to a new place (not while searching).
import { chromium } from "playwright";
const out = process.env.SHOTS ?? "shots";
const b = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs = [];
p.on("pageerror", (e) => errs.push("pageerror: " + e.message));
const ok = (c, msg) => console.log((c ? "PASS " : "FAIL ") + msg);
const sec = () => p.locator(".rs-section").nth(0);
const rows = async () => (await sec().locator(".rs-sec-props li .rs-item-key").allInnerTexts()).map((t) => t.trim());

await p.goto("http://localhost:8765/resources.html");
await p.waitForTimeout(400);
await p.locator(".rs-picker-btn").click(); await p.locator(`.rs-picker-item[data-resource=${JSON.stringify("Application")}]`).click();
await p.waitForTimeout(300);
await p.locator(".rs-top").getByRole("button", { name: "Resource settings" }).click();
await p.waitForTimeout(300);
const find = sec().getByRole("textbox", { name: /Find or add/ });
const boxY = (await find.boundingBox()).y, listY = (await sec().locator(".rs-sec-props").boundingBox()).y;
ok(boxY < listY, "the find-or-add box is above the list");
ok((await sec().getByRole("combobox").count()) === 0, "no dropdown at the bottom any more");

// adding: focus shows what can be added; typing narrows it
await find.click();
await p.waitForTimeout(100);
ok((await sec().locator(".rs-sec-offers button").count()) === 2, "focusing it offers the properties not in the section");
await find.fill("loan");
await p.waitForTimeout(100);
ok((await sec().locator(".rs-sec-offers button").count()) === 1, "typing narrows the offers");
await p.screenshot({ path: out + "/s4-find.png" });
await sec().locator(".rs-sec-offers button").first().click();
await p.waitForTimeout(100);
ok((await rows()).join() === "status,application_number,requested_loan_amount" && (await find.inputValue()) === "", "a click adds it at the end and clears the box");

// searching narrows the list and turns dragging off
await find.fill("number");
await p.waitForTimeout(100);
ok((await rows()).join() === "application_number", "searching narrows the section's list");
ok((await sec().locator(".rs-sec-props li[draggable=true]").count()) === 0, "no dragging while searching");
await find.press("Escape");
await p.waitForTimeout(100);
ok((await rows()).length === 3, "Esc clears the search");

// drag the last row to the top
const li = sec().locator(".rs-sec-props li");
await li.nth(2).dragTo(li.nth(0), { targetPosition: { x: 40, y: 4 } });
await p.waitForTimeout(150);
ok((await rows()).join() === "requested_loan_amount,status,application_number", "dragging a row moves it");
const h = (await li.nth(2).boundingBox()).height;
await li.nth(0).dragTo(li.nth(2), { targetPosition: { x: 40, y: h - 2 } });
await p.waitForTimeout(150);
ok((await rows()).join() === "status,application_number,requested_loan_amount", "and back to the end");
ok(/settings/.test(await p.locator(".rs-unsaved").innerText()), "the changes are unsaved, as before");

ok(!errs.length, "no page errors " + JSON.stringify(errs));
await b.close();
