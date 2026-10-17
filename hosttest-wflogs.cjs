// The Logs tab's host side (SysLogs$.fromWorkflows in syslogs-host.js), run on
// its own with the extension's record helpers stubbed — no .vsix needed:
//   node hosttest-wflogs.cjs [syslogs-host.js]
const fs = require("fs"), path = require("path"), Module = require("module");
const file = process.argv[2] ?? path.join(__dirname, "syslogs-host.js");
const calls = [];
const vscode = {
  workspace: { getConfiguration: () => ({ get: () => "" }), openTextDocument: async (d) => (calls.push(["openTextDocument", d]), d) },
  window: { showTextDocument: async () => {}, setStatusBarMessage: () => {}, createWebviewPanel: () => { throw new Error("not in this test"); } },
  env: { clipboard: { writeText: async (t) => calls.push(["clipboard", t]) } },
  ViewColumn: { One: 1, Beside: 2 },
  Uri: { joinPath: () => ({}) },
};
// 250 records, oldest first, like a plain list endpoint
const all = Array.from({ length: 250 }, (_, i) => ({ id: i + 1, created_at: new Date(Date.UTC(2026, 0, 1) + i * 60000).toISOString(), message: `m${i + 1}` }));
const stubs = `
  const I = (i) => i.name;
  const xe = () => "nonce";
  const Re = () => {};
  const dn = async () => ["Application", "SystemLog"];
  const xc = async () => new Set(["SystemLog"]);
  const Ln = async () => ({ fields: [] });
  const Sc = async (m, inst, res, o) => { __calls.push(["Sc", inst.id, res, o]); return { records: __all.slice((o.page - 1) * o.limit, o.page * o.limit), total: __all.length }; };
`;
const m = new Module("syslogs"); m.filename = "/x/syslogs-host.js";
const orig = Module._load; Module._load = (r, p, i) => (r === "vscode" ? vscode : orig(r, p, i));
global.__calls = calls; global.__all = all;
m._compile(stubs + fs.readFileSync(file, "utf8") + "\n;module.exports=SysLogs$;", m.filename);
const S = m.exports;

let fails = 0;
const ok = (c, msg) => { if (!c) fails++; console.log((c ? "PASS " : "FAIL ") + msg); };
const inst = { id: "i1", url: "https://a.example", name: "A" }, other = { id: "i2", url: "https://b.example", name: "B" };
const manager = { list: () => [inst, other], get: () => undefined };
(async () => {
  const sent = [];
  const webview = { postMessage: (x) => sent.push(x) };
  // the Workflows panel object: field names are whatever the minifier left
  const panel = { extensionUri: {}, o: { foo: 1 }, inst: { id: "i2", url: "https://b.example" }, mgr: { list: () => [inst, other], get: () => other } };

  ok(S.targetOf({ manager: { list: () => [inst, other], get: () => other }, instance: { id: "i2", url: "https://b.example" } }).instance === other, "uses the panel's own manager / instance fields (0.1.1's names)");
  ok(S.targetOf(panel).instance === other, "finds the panel's instance by shape (and uses the manager's own object)");
  ok(S.targetOf({ m: { list: () => [inst, other], get: () => inst }, wfInstanceId: "i1" }).instance === inst, "or by an instance id string");
  ok(S.targetOf({ holder: { instance: inst, manager: { list: () => [inst, other], get: () => inst } } }).instance === inst, "or one level down");
  let threw = false; try { S.targetOf({ m: { list: () => [inst, other], get: () => inst } }); } catch (e) { threw = /which Saturn instance/.test(e.message); }
  ok(threw, "and refuses to guess between several instances");

  ok(S.oldestFirst(all.slice(0, 100)) === true && S.oldestFirst(all.slice(0, 100).reverse()) === false, "tells oldest-first lists from newest-first");

  await S.fromWorkflows(panel, webview, "fetchWorkflowLogs", { reqId: 7, workflowId: "w", offset: 0, window: 200 });
  let r = sent.pop().payload;
  ok(r.reqId === 7 && r.resource === "SystemLog" && r.instanceName === "B", "replies to the request with the resource and instance");
  ok(r.records.length === 200 && r.records[0].id === 250 && r.records[199].id === 51, "the newest 200 records, newest first, from an oldest-first list");
  ok(r.total === 250 && r.scanned === 200 && r.done === false, "with how far it read");
  await S.fromWorkflows(panel, webview, "fetchWorkflowLogs", { reqId: 8, workflowId: "w", offset: 200, window: 200 });
  r = sent.pop().payload;
  ok(r.records.length === 50 && r.records[0].id === 50 && r.records[49].id === 1 && r.done === true && r.scanned === 250, "then the older rest, and done");
  ok(calls.filter((c) => c[0] === "Sc").every((c) => c[1] === "i2" && c[2] === "SystemLog" && c[3].filter === null && c[3].limit === 100), "it only reads records (Sc) on the panel's instance");

  // newest-first list
  global.__all.reverse();
  await S.fromWorkflows(panel, webview, "fetchWorkflowLogs", { reqId: 9, offset: 100, window: 120 });
  r = sent.pop().payload;
  ok(r.records.length === 120 && r.records[0].id === 150 && r.records[119].id === 31, "a newest-first list is read straight from the offset");
  global.__all.reverse();

  await S.fromWorkflows({}, webview, "fetchWorkflowLogs", { reqId: 10 });
  r = sent.pop();
  ok(r.type === "workflowLogsFailed" && r.payload.reqId === 10 && /instance/.test(r.payload.message), "failures come back as workflowLogsFailed");

  await S.fromWorkflows(panel, webview, "copyLogJson", { record: { id: 1 } });
  await S.fromWorkflows(panel, webview, "openLogJson", { record: { id: 2 } });
  ok(calls.some((c) => c[0] === "clipboard" && JSON.parse(c[1]).id === 1) && calls.some((c) => c[0] === "openTextDocument" && c[1].language === "json"), "Copy JSON / Open as JSON");

  await S.fromWorkflows(panel, webview, "openSystemLogs", { search: "x" });
  r = sent.pop();
  ok(r.type === "workflowLogsFailed" && /isn't ready/.test(r.payload.message), "Open System Logs needs the command context (attach)");
  console.log(fails ? `${fails} failed` : "all passed");
  process.exitCode = fails ? 1 : 0;
})();
