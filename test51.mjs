// v0.3.64: the switch step in the node view, on the real Application workflow (csp.html?app): its Assign staff
// command has the owner's switch (STAFFROLEBRANCH: {{ _store.who }}, case underwriter, Otherwise). One column per
// case and Otherwise last; the side panel's Value and Cases (rename, add, reorder, remove); a step added into an
// empty case; Undo; a new Switch from the Add menu; search.
import { chromium } from "playwright";
const out = process.env.SHOTS ?? "shots";
const b = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
const errs = [];
p.on("pageerror", (e) => errs.push("pageerror: " + e.message));
p.on("console", (m) => /Content Security|Refused/.test(m.text()) && errs.push("CSP: " + m.text()));
const ok = (c, msg) => console.log((c ? "PASS " : "FAIL ") + msg);
const def = () => p.evaluate(() => JSON.parse(JSON.stringify(window.__getDef())));
const assign = async () => (await def()).commands.find((c) => c.name === "assign_staff").command.commands;
const theSwitch = async () => (await assign()).find((s) => s.type === "switch");
const head = () => p.locator('.react-flow__node[data-id^="h:"]', { hasText: "Switch" }).first();
const outputs = () => head().locator(".nv-branch-foot span").allInnerTexts();
const caseInputs = () => p.locator(".fg-case:not(.is-new) input");
const caseValues = async () => (await caseInputs().evaluateAll((els) => els.map((e) => e.value)));

await p.goto("http://localhost:8765/csp.html?app");
await p.waitForTimeout(1000);
await p.locator(".nv-picker-item", { hasText: "Application" }).click();
await p.waitForTimeout(900);
await p.locator(".nv-ol-item", { hasText: "Assign staff" }).first().click();
await p.waitForTimeout(900);

// ===== on the canvas =====
ok((await p.locator(".react-flow__node-frame").count()) === 0 && (await head().count()) === 1, "the switch is a card, with no box round it (0.3.74)");
ok((await head().innerText()).includes("{{ _store.who }}"), "its card shows the value it checks");
ok((await outputs()).join(",") === "underwriter,Otherwise", "one output per case, then Otherwise: " + (await outputs()).join(","));
ok((await head().locator(".nv-h-case").count()) === 2, "each output has its own wire handle");
const pu = p.locator(".react-flow__node", { hasText: "Property Updater" });
ok((await pu.count()) >= 2, "the case's step and Otherwise's step both show (each is a single step, not a group)");
await p.screenshot({ path: `${out}/v0364-switch.png` });

// ===== the side panel =====
await head().click();
await p.waitForTimeout(600);
ok((await p.locator(".fg-head-title").innerText()) === "Switch", "picking it shows Switch in the side panel");
const valueBox = p.locator(".fg-panel input").first();
ok((await p.locator("#switch-cases, [data-sec='switch-cases']").count()) >= 0 && (await caseValues()).join(",") === "underwriter", "Cases lists its one case: " + (await caseValues()).join(","));

// rename
await caseInputs().first().fill("manager");
await caseInputs().first().press("Enter");
await p.waitForTimeout(500);
let sw = await theSwitch();
ok(sw.cases.length === 1 && sw.cases[0].value === "manager" && sw.cases[0].command.id === "ASSIGNBOTHROLES", "renaming a case changes its value and keeps its steps");
ok((await outputs()).join(",") === "manager,Otherwise", "the card follows");

// add
await p.locator(".fg-case.is-new input").fill("loan_officer");
await p.locator(".fg-case.is-new input").press("Enter");
await p.waitForTimeout(500);
sw = await theSwitch();
ok(sw.cases.length === 2 && sw.cases[1].value === "loan_officer" && sw.cases[1].command.type === "series" && sw.cases[1].command.commands.length === 0, "Add case adds an empty case at the end");
ok((await outputs()).join(",") === "manager,loan_officer,Otherwise", "a third column: " + (await outputs()).join(","));
ok((await head().locator(".nv-h.is-empty").count()) === 1, "the new case is only its dot (0.3.74)");

// a step into the empty case
await head().locator(".nv-h.is-empty").click({ force: true });
await p.waitForTimeout(300);
await p.keyboard.type("group");
await p.waitForTimeout(150);
await p.locator(".nv-menu-item", { hasText: /^Group/ }).first().click();
await p.waitForTimeout(600);
sw = await theSwitch();
ok(sw.cases[1].command.commands.length === 1 && sw.cases[1].command.commands[0].type === "series", "a step added from the empty dot goes into that case");

// reorder
await head().click();
await p.waitForTimeout(500);
await p.getByRole("button", { name: "Move case 2 up" }).click();
await p.waitForTimeout(500);
sw = await theSwitch();
ok(sw.cases.map((c) => c.value).join() === "loan_officer,manager" && sw.cases[1].command.id === "ASSIGNBOTHROLES" && sw.cases[0].command.commands.length === 1, "↑ moves a case up, with its steps");

// remove
await p.getByRole("button", { name: "Remove case 1" }).click();
await p.waitForTimeout(500);
sw = await theSwitch();
ok(sw.cases.length === 1 && sw.cases[0].value === "manager" && sw.otherwise.id === "70YMW8", "× removes a case (and its steps); the rest and Otherwise stay");

// the value it checks
await valueBox.fill("{{ _store.role }}");
await valueBox.press("Enter");
await p.waitForTimeout(500);
sw = await theSwitch();
ok(sw.data.value === "{{ _store.role }}" && sw.cases.length === 1, "Value changes what it checks, cases kept");

// undo
await p.locator(".react-flow__pane").click({ position: { x: 20, y: 20 } });
await p.keyboard.press("Control+z");
await p.waitForTimeout(500);
sw = await theSwitch();
ok(sw.data.value === "{{ _store.who }}", "Ctrl+Z undoes the last switch change");

// ===== a new switch from the Add menu =====
await p.locator(".nv-ol-item", { hasText: "Withdraw" }).first().click();
await p.waitForTimeout(700);
await p.keyboard.press("Shift+A");
await p.waitForTimeout(200);
ok((await p.locator(".nv-menu-item", { hasText: "Switch (cases)" }).count()) === 1, "the Add menu has Switch (cases)");
await p.locator(".nv-menu-item", { hasText: "Switch (cases)" }).click();
await p.waitForTimeout(300);
ok((await p.locator(".nv-modal").count()) === 1 && (await p.locator(".nv-modal").innerText()).includes("Value"), "it asks for the value to check first");
await p.locator(".nv-modal").getByRole("button", { name: "Add" }).click();
await p.waitForTimeout(400);
ok((await p.locator(".nv-modal").count()) === 1, "an empty value isn't accepted");
await p.locator(".nv-modal input").first().fill("{{ _resource.status }}");
await p.locator(".nv-modal").getByRole("button", { name: "Add" }).click();
await p.waitForTimeout(600);
// "Withdraw" is first a Draft action (the command of that name is further down)
const all = JSON.stringify(await def());
const found = [];
JSON.parse(all, (k, v) => { if (v && typeof v === "object" && v.type === "switch" && v.data?.value === "{{ _resource.status }}") found.push(v); return v; });
const added = found[0];
ok(added && added.data.value === "{{ _resource.status }}" && added.cases.length === 0 && added.otherwise.type === "series", "a new switch: the value, no cases yet, an empty Otherwise");
ok((await p.locator('.react-flow__node[data-id^="h:"]', { hasText: "Switch" }).locator(".nv-branch-foot span").allInnerTexts()).join(",") === "Otherwise", "it shows just Otherwise until a case is added");

// ===== search =====
await p.locator("#nv-search").fill("switch");
await p.waitForTimeout(300);
ok((await p.locator(".nv-ol-results").innerText()).includes("Switch"), "search finds switch steps");
await p.locator("#nv-search").fill("");

ok(errs.length === 0, "no page errors: " + errs.join(" | "));
await b.close();
