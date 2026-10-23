// v0.3.1: collapsible stages, search, commands in the Add menu.
import { chromium } from "playwright";
const out = process.env.SHOTS ?? "shots";
const b = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs = [];
p.on("pageerror", (e) => errs.push("pageerror: " + e.message));
p.on("console", (m) => /Content Security|Refused/.test(m.text()) && errs.push("CSP: " + m.text()));
const ok = (c, msg) => console.log((c ? "PASS " : "FAIL ") + msg);
const def = (id) => p.evaluate((id) => window.__getDef(id), id);
const olItem = (t) => p.locator(".nv-ol-item", { hasText: t });
const crumbs = () => p.locator(".nv-crumbbar").innerText();

await p.goto("http://localhost:8765/csp.html");
await p.waitForTimeout(900);
// the node view opens first (0.3.3); these checks start from the list view
await p.getByRole("button", { name: "Back to list view" }).click();
await p.waitForTimeout(200);
await p.getByText("Order fulfilment").first().click();
await p.waitForTimeout(500);
await p.locator(".nv-launch").click();
await p.waitForTimeout(600);

// ===== collapsible stages =====
const newHead = p.locator(".nv-ol-stagehead", { hasText: "New" });
ok(await olItem("Approve order").count() === 1, "stage starts open");
await newHead.click();
await p.waitForTimeout(150);
ok(await olItem("Approve order").count() === 0 && await olItem("Reject order").count() === 0, "clicking a stage closes it");
ok((await newHead.locator(".nv-ol-count").innerText()) === "2", "closed stage shows its action count");
ok(await olItem("Mark delivered").count() === 1, "other stages stay open");
await p.screenshot({ path: out + "/70-collapsed.png" });
await newHead.click();
await p.waitForTimeout(150);
ok(await olItem("Approve order").count() === 1, "clicking again opens it");
// collapse all / expand all
await p.locator(".nv-ol-head", { hasText: "Stages" }).locator("button[title='Collapse all stages']").click();
ok(await olItem("Approve order").count() === 0 && await olItem("Mark delivered").count() === 0, "collapse all closes every stage");
await p.locator(".nv-ol-head", { hasText: "Stages" }).locator("button[title='Expand all stages']").click();
ok(await olItem("Approve order").count() === 1 && await olItem("Mark delivered").count() === 1, "expand all opens them");
// sections
await p.locator(".nv-ol-head", { hasText: "Commands" }).click();
ok(await olItem("Notify customer").count() === 0, "Commands section collapses");
// remembered across closing the node view
await newHead.click();
await p.getByRole("button", { name: "List view" }).click();
await p.locator(".nv-launch").click();
await p.waitForTimeout(400);
ok(await olItem("Approve order").count() === 0 && await olItem("Notify customer").count() === 0, "collapsed state is remembered");
// the gear still opens stage settings, without toggling
await p.locator(".nv-ol-stagehead", { hasText: "Shipped" }).hover();
await p.locator(".nv-ol-stagehead", { hasText: "Shipped" }).locator(".nv-ol-gear").click();
ok((await p.locator(".fg-panel .fg-head-title").innerText()) === "Shipped" && await olItem("Mark delivered").count() === 1, "gear opens stage settings without closing it");

// ===== search =====
const search = p.locator("#nv-search");
await p.locator(".react-flow__pane").click({ position: { x: 300, y: 760 } });
await p.keyboard.press("/");
ok(await search.evaluate((el) => el === document.activeElement), "/ focuses the search box");
await search.fill("approve");
await p.waitForTimeout(150);
ok(await p.locator(".nv-ol-results .nv-ol-item", { hasText: "Approve order" }).count() >= 1, "search finds the action by name");
await search.fill("ship");
ok(await p.locator(".nv-ol-results .nv-ol-head", { hasText: "Stages" }).count() === 1 && (await p.locator(".nv-ol-results").innerText()).includes("Shipped"), "search finds stages");
await search.fill("notify cust");
ok((await p.locator(".nv-ol-results").innerText()).includes("Notify customer"), "search finds commands (and the references to them)");
// opening a result inside a collapsed stage expands it
await p.locator(".nv-ol-results .nv-ol-hitgroup", { hasText: "Approve order" }).locator(".nv-ol-result").click();
await p.waitForTimeout(700);
ok((await crumbs()).includes("Approve order"), "result opens the action");
ok(await p.locator(".react-flow__node.selected", { hasText: "Notify customer" }).count() === 1, "and selects the matching step");
await search.fill("");
await p.waitForTimeout(150);
ok(await olItem("Approve order").count() === 1, "its stage was opened so it shows in the tree");

// operator search across actions
await p.locator(".nv-wf-switch").click();
await p.locator(".nv-picker-item", { hasText: "Debug lab" }).click();
await p.waitForTimeout(800);
await search.fill("debug");
await p.waitForTimeout(200);
const groups = p.locator(".nv-ol-results .nv-ol-hitgroup");
ok(await groups.count() === 4, `"debug" lists the 4 places with a debug step (got ${await groups.count()})`);
const txt = await p.locator(".nv-ol-results").innerText();
ok(["Submit", "Check", "Audit", "Trace"].every((n) => txt.includes(n)) && !txt.includes("Close"), "the right four, and not the action without one");
ok((await groups.first().locator(".nv-ol-badge").innerText()) === "2", "most matches first, with a count (Audit has 2)");
ok(await p.locator(".nv-ol-hit-title.is-off").count() === 1, "disabled matches are marked");
await p.screenshot({ path: out + "/71-search.png" });
// click a specific hit: the loop's inner debug in Check
await groups.filter({ hasText: "Check" }).locator(".nv-ol-hit").first().click();
await p.waitForTimeout(800);
ok((await crumbs()).includes("Check"), "hit opens its action");
ok(await p.locator(".react-flow__node.selected", { hasText: "Debug" }).count() === 1, "and selects the nested step");
ok(await p.locator(".react-flow__node.is-match").count() === 1, "matches are highlighted on the canvas");
await p.screenshot({ path: out + "/72-search-canvas.png" });
// Enter opens the top result; Esc clears
await search.fill("debug");
await search.press("Enter");
await p.waitForTimeout(700);
ok((await crumbs()).includes("Audit"), "Enter opens the top result");
await search.press("Escape");
ok((await search.inputValue()) === "" && await p.locator(".react-flow__node.is-match").count() === 0, "Esc clears search and highlights");
await search.fill("zzz nothing");
ok((await p.locator(".nv-ol-noresults").innerText()) === "No matches.", "no matches is said plainly");
await search.fill("");

// ===== commands in the Add menu =====
await olItem("Submit").click();
await p.waitForTimeout(500);
await p.keyboard.press("Shift+A");
await p.waitForTimeout(200);
ok(await p.locator(".nv-menu-cat", { hasText: "Commands" }).count() === 1, "Add menu has a Commands section");
await p.keyboard.type("log it");
await p.waitForTimeout(150);
ok((await p.locator(".nv-menu-item.is-active").innerText()).includes("Log it"), "a command is found by its name");
await p.keyboard.press("Enter");
await p.waitForTimeout(500);
let st = (await def("wf_debug")).stages[0].actions[0].task.commands;
ok(st.some((c) => c.type === "reference" && c.reference === "log_it") && await p.locator(".nv-modal").count() === 0, "a command without required parameters is added directly");
await p.screenshot({ path: out + "/73-cmd-added.png" });
// with a required parameter: asks for it, command already chosen
await p.locator(".nv-wf-switch").click();
await p.locator(".nv-picker-item", { hasText: "Order fulfilment" }).click();
await p.waitForTimeout(800);
await olItem("Reject order").click();
await p.waitForTimeout(500);
await p.keyboard.press("Shift+A");
await p.keyboard.type("notify customer");
await p.waitForTimeout(150);
await p.screenshot({ path: out + "/74-addmenu-cmd.png" });
await p.keyboard.press("Enter");
await p.waitForTimeout(300);
ok(await p.locator(".nv-modal").count() === 1, "a command with a required parameter asks for it");
ok((await p.locator(".nv-modal select").inputValue()) === "notify_customer", "with the command already chosen");
await p.locator(".nv-modal .nv-field", { hasText: "Template" }).locator("input").fill("rejected");
await p.locator(".nv-modal button[type=submit]").click();
await p.waitForTimeout(500);
st = (await def("wf_orders")).stages[0].actions[1].task.commands;
ok(st.some((c) => c.type === "reference" && c.reference === "notify_customer" && c.parameters?.template === "rejected"), "command added with its parameter");

console.log("errors:", JSON.stringify(errs));
await b.close();
