// v0.3.43: What's new is its own page (a VS Code tab), opened from the sidebar's What's new button; the node view's
// Changes tab keeps only the workflow's unsaved changes.
import { chromium } from "playwright";
import { readFileSync } from "node:fs";
const out = process.env.SHOTS ?? "shots";
const b = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const p = await b.newPage({ viewport: { width: 1200, height: 860 } });
const errs = [];
p.on("pageerror", (e) => errs.push("pageerror: " + e.message));
p.on("console", (m) => /Content Security|Refused/.test(m.text()) && errs.push("CSP: " + m.text()));
const ok = (c, msg) => console.log((c ? "PASS " : "FAIL ") + msg);
const versions = [...readFileSync(new URL("src/changelog.ts", import.meta.url), "utf8").matchAll(/version:\s*"([^"]+)"/g)].map((m) => m[1]);

// ===== the page =====
await p.goto("http://localhost:8765/news.html");
await p.waitForTimeout(500);
ok((await p.locator("h1").innerText()) === "What's new", "the page is titled What's new");
ok((await p.locator(".wn-head p").innerText()).includes(versions[0]), "it names the installed version, " + versions[0]);
ok((await p.locator(".wn-release").count()) === versions.length, `every release is listed (${versions.length})`);
ok((await p.locator(".wn-version").allInnerTexts()).join() === versions.join(), "newest first");
const firstOpen = await p.locator(".wn-release").first().evaluate((d) => d.open);
const secondOpen = await p.locator(".wn-release").nth(1).evaluate((d) => d.open);
ok(firstOpen && !secondOpen, "the newest is open, the rest folded");
ok((await p.locator(".wn-release").first().locator(".wn-badge").innerText()) === "Installed", "the newest says Installed");
await p.screenshot({ path: out + "/w1-whats-new.png" });
await p.getByLabel("Search the release notes").fill("icon picker");
await p.waitForTimeout(150);
const found = await p.locator(".wn-version").allInnerTexts();
ok(found.length >= 1 && found.length < versions.length && found.includes("0.3.31"), "search narrows it to the releases that mention it: " + found.join(", "));
ok(await p.locator(".wn-release").first().evaluate((d) => d.open), "and opens them");
await p.getByLabel("Search the release notes").fill("zzzz nothing");
await p.waitForTimeout(150);
ok((await p.locator(".wn-none").count()) === 1, "a search with no match says so");

// ===== the sidebar button =====
await p.goto("http://localhost:8765/sidebar.html");
await p.waitForTimeout(800);
const button = p.getByRole("button", { name: "What's new" });
ok((await button.count()) === 1, "the sidebar has a What's new button");
const labels = await p.locator("button").allInnerTexts();
ok(labels.indexOf("AI Skills") >= 0 && labels.indexOf("What's new") === labels.indexOf("AI Skills") + 1, "right after AI Skills, above the instances");
await button.click();
const sent = await p.evaluate(() => window.__posted.at(-1));
ok(sent?.type === "saturn:openWhatsNew", "it asks the extension to open the page");

// ===== the node view's Changes tab =====
await p.goto("http://localhost:8765/csp.html");
await p.waitForTimeout(900);
await p.locator(".nv-picker-item", { hasText: "Support tickets" }).click();
await p.waitForTimeout(800);
await p.locator(".fg-tab", { hasText: /^Changes/ }).click();
await p.waitForTimeout(300);
const panel = await p.locator(".fg-panel").innerText();
ok(panel.includes("Unsaved changes") && !panel.includes("What's new") && (await p.locator(".fg-release").count()) === 0, "the Changes tab shows only the unsaved changes");

ok(errs.length === 0, "no page errors (" + errs.join(" | ") + ")");
await b.close();
