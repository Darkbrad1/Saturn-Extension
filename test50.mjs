// v0.3.63: the Rich text editor input on the Resources screen (a real note resource's schema,
// harness/noteschema.js): the input type, Rows, the voice transcriber and AI actions, saved where Saturn
// keeps them. And a way to see the JSON on each screen: Workflow JSON (node view), Menu JSON (Menus),
// Schema JSON (System Logs; Resources already has it).
import { chromium } from "playwright";
const out = process.env.SHOTS ?? "shots";
const b = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
const errs = [];
p.on("pageerror", (e) => errs.push("pageerror: " + e.message));
p.on("console", (m) => /Content Security|Refused/.test(m.text()) && errs.push("CSP: " + m.text()));
const ok = (c, msg) => console.log((c ? "PASS " : "FAIL ") + msg);
const row = (label) => p.locator(".pe-page .pe-row", { has: p.locator(".pe-label", { hasText: new RegExp(`^${label}$`) }) });
const pick = async (key) => { await p.locator(".rs-item", { has: p.locator(".rs-item-key", { hasText: new RegExp(`^${key}$`) }) }).click(); await p.waitForTimeout(250); };
const draftOf = (key) => p.evaluate((k) => window.acquireVsCodeApi().getState().works.ApplicationNote?.drafts?.[k], key);

// ===== Rich text editor =====
await p.goto("http://localhost:8765/resources.html");
await p.waitForTimeout(400);
await p.locator(".rs-picker-btn").click(); await p.locator(`.rs-picker-item[data-resource=${JSON.stringify("ApplicationNote")}]`).click();
await p.waitForTimeout(300);
await pick("description");
const inputType = row("Input type").locator("select");
ok((await inputType.inputValue()) === "richtexteditor", "the description's input type shows as Rich text editor");
ok((await inputType.locator("option").allInnerTexts()).includes("Rich text editor"), "Rich text editor is in the Input type list");
ok((await row("Rows").locator("input").inputValue()) === "8", "Rows shows for it: 8");
ok((await row("Voice transcriber").locator("[role=switch]").isChecked()), "Voice transcriber is on");
ok((await row("Provider").locator("input").inputValue()) === "deepgram" && (await row("Mode").locator("input").inputValue()) === "flux", "its provider and mode: deepgram, flux");
ok((await row("Profile").locator("input").inputValue()) === "general" && (await row("Language").locator("input").inputValue()) === "en", "its profile and language: general, en");
ok(!(await row("Tell speakers apart").locator("[role=switch]").isChecked()), "Tell speakers apart (diarization) is off");
ok((await row("AI actions").count()) === 1, "AI actions shows (an empty list)");
ok((await p.locator(".rs-unsaved").count()) === 0, "nothing unsaved just by opening it");
await p.screenshot({ path: `${out}/v0363-richtext.png` });

await row("Tell speakers apart").locator("[role=switch]").click();
await row("Language").locator("input").fill("fr");
await row("Language").locator("input").blur();
await p.waitForTimeout(200);
const d1 = await draftOf("description");
ok(d1.input_properties.transcriber.diarization === true && d1.input_properties.transcriber.language === "fr" && d1.input_properties.transcriber.provider === "deepgram", "changes go where Saturn keeps them (input_properties.transcriber)");
await row("Voice transcriber").locator("[role=switch]").click();
await p.waitForTimeout(150);
ok((await row("Provider").count()) === 0, "switching the transcriber off hides its settings");

// another property switched to the Rich text editor: the transcriber starts as a real one has it
await pick("creator");
ok((await row("Voice transcriber").count()) === 0, "a plain input has no transcriber settings");
await row("Input type").locator("select").selectOption("richtexteditor");
await p.waitForTimeout(150);
ok((await row("Rows").count()) === 1 && (await row("Voice transcriber").count()) === 1, "picking Rich text editor shows Rows and Voice transcriber");
await row("Voice transcriber").locator("[role=switch]").click();
await p.waitForTimeout(150);
const d2 = await draftOf("creator");
const t = d2.input_properties.transcriber;
ok(t.enabled === true && t.provider === "deepgram" && t.mode === "flux" && t.profile === "general" && t.language === "en" && t.diarization === false, "switched on, it gets the settings a real one has: " + JSON.stringify(t));

await p.locator(".rs-top").getByRole("button", { name: "Save", exact: true }).click();
await p.locator(".rs-confirm").getByRole("button", { name: "Save", exact: true }).click();
await p.waitForTimeout(500);
const saved = await p.evaluate(() => window.__data.ApplicationNote);
const desc = saved.find((x) => x.key === "description"), creator = saved.find((x) => x.key === "creator");
ok(desc.input_properties.transcriber.enabled === false && desc.input_properties.transcriber.language === "fr" && desc.input_properties.rows === 8 && Array.isArray(desc.input_properties.ai_actions), "saved: the description's transcriber off, French, its rows and AI actions kept");
ok(creator.input_properties.type === "richtexteditor" && creator.input_properties.transcriber.provider === "deepgram", "saved: Creator is now a Rich text editor with a transcriber");

// ===== a way to see the JSON on each screen =====
ok((await p.locator(".rs-top").getByRole("button", { name: "Schema JSON" }).count()) === 1, "Resources: Schema JSON (already there)");

await p.goto("http://localhost:8765/csp.html");
await p.waitForTimeout(1000);
await p.locator(".nv-picker-item").first().click();
await p.waitForTimeout(900);
await p.locator(".nv-topbar").getByRole("button", { name: "Workflow JSON" }).click();
await p.waitForTimeout(200);
const opened = await p.evaluate(() => window.__opened || []);
ok(opened.some((o) => o.type === "viewRawWorkflow" && o.workflowId), "node view: Workflow JSON in the top bar opens the workflow's definition");

await p.goto("http://localhost:8765/menus.html");
await p.waitForTimeout(700);
await p.locator(".rs-top").getByRole("button", { name: "Menu JSON" }).click();
await p.waitForTimeout(150);
const raw = await p.evaluate(() => window.__posted.filter((m) => m.type === "viewRaw").pop());
const menu = raw && JSON.parse(raw.text);
ok(menu && menu.id === "menu-loans" && menu.label === "Loans" && Array.isArray(menu.references) && menu.references.length === 3, "Menus: Menu JSON shows the picked menu as Save would write it");
await p.locator(".mn-tab").first().click();
await p.locator("#mn-caption").fill("Apps");
await p.locator(".rs-top").getByRole("button", { name: "Menu JSON" }).click();
await p.waitForTimeout(150);
const raw2 = JSON.parse((await p.evaluate(() => window.__posted.filter((m) => m.type === "viewRaw").pop())).text);
ok(JSON.stringify(raw2.references[0].resource_label).includes("Apps"), "with the unsaved changes in it");

await p.goto("http://localhost:8765/logs.html");
await p.waitForTimeout(700);
await p.locator(".lg-top").getByRole("button", { name: "Schema JSON" }).click();
await p.waitForTimeout(150);
ok((await p.evaluate(() => window.__posted.some((m) => m.type === "schema" && m.payload?.resource === "SystemLog"))), "System Logs: Schema JSON asks for the log resource's schema");

ok(errs.length === 0, "no page errors: " + errs.join(" | "));
await b.close();
