// v0.3.44: Find a setting also looks at the heading and group a setting is under, and the names of its choices: "show"
// finds the Show in switches, "data" the Data group. Several words match anywhere unless they appear together.
import { chromium } from "playwright";
const out = process.env.SHOTS ?? "shots";
const b = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs = [];
p.on("pageerror", (e) => errs.push("pageerror: " + e.message));
const ok = (c, msg) => console.log((c ? "PASS " : "FAIL ") + msg);
const labels = () => p.locator(".pe-page .pe-row .pe-label").allInnerTexts();
const groups = () => p.locator(".pe-page .pe-group-title").allInnerTexts();
const find = async (text) => { await p.fill(".pe-find", text); await p.waitForTimeout(200); };

await p.goto("http://localhost:8765/resources.html");
await p.waitForTimeout(400);
await p.locator(".rs-picker-btn").click(); await p.locator(`.rs-picker-item[data-resource=${JSON.stringify("Application")}]`).click();
await p.waitForTimeout(300);
await p.locator(".rs-item", { hasText: "Status" }).first().click();
await p.waitForTimeout(300);

await find("show");
let l = await labels();
ok(["Forms", "Tables", "Record views"].every((x) => l.includes(x)), "\"show\" finds the Show in switches: " + l.join(", "));
ok((await groups()).includes("Visibility"), "under Visibility");
await p.screenshot({ path: out + "/f1-find-show.png" });

await find("data");
ok((await groups()).includes("Data") && (await labels()).includes("Value source"), "\"data\" shows the Data group's settings: " + (await groups()).join(", "));

await find("currency");
ok((await labels()).some((x) => /renderer/i.test(x)), "a choice's name finds its setting (Currency → the renderers): " + (await labels()).join(", "));

await find("tables show");
l = await labels();
ok(l.includes("Tables") && !l.includes("Forms"), "several words match anywhere: \"tables show\" → " + l.join(", "));

await find("column width");
ok((await labels()).length === 1, "words typed together that appear together find just that: " + (await labels()).join(", "));

await find("zzzz");
ok((await p.locator(".rs-empty", { hasText: "No setting matches" }).count()) === 1, "no match says so");
await find("");
ok((await groups()).length >= 5, "clearing it shows everything again");

ok(errs.length === 0, "no page errors (" + errs.join(" | ") + ")");
await b.close();
