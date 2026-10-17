// The Logs tab's host side (SystemLogsHost.fromWorkflows in host/syslogs.js), run on
// its own with the extension's record helpers stubbed — no .vsix needed:
//   node hosttest-wflogs.cjs [host/syslogs.js]
const fs = require("fs"), path = require("path"), Module = require("module");
const file = process.argv[2] ?? path.join(__dirname, "host", "syslogs.js");
const calls = [];
const vscode = {
  workspace: { getConfiguration: () => ({ get: () => "" }), openTextDocument: async (d) => (calls.push(["openTextDocument", d]), d) },
  window: { showTextDocument: async () => {}, setStatusBarMessage: () => {}, createWebviewPanel: () => { throw new Error("not in this test"); } },
  env: { clipboard: { writeText: async (t) => calls.push(["clipboard", t]) } },
  ViewColumn: { One: 1, Beside: 2 },
  Uri: { joinPath: () => ({}) },
};
// A fake instance: 250 records, listed oldest first (like a plain list endpoint),
// or in id order (__order = "id", ids shuffled so they don't follow time).
// __sort: "honour" sorts by ?sort=created_at DESC, "reject" answers 400 to a sort,
// "ignore" pays it no attention.
const all = Array.from({ length: 250 }, (_, i) => ({ id: i + 1, created_at: new Date(Date.UTC(2026, 0, 1) + i * 60000).toISOString(), message: `m${i + 1}` }));
const fake = { sort: "honour", order: "time" };
function serve(route, q) {
  if (route !== "/systemlogs") return { status: 404, body: { message: "route not found" } };
  // "id" order: by a hash of the id, the way random UUID ids would sort
  const h = (x) => (Math.imul(x.id ^ 0x5bd1e995, 0x9e3779b1) >>> 0) % 100003;
  let list = fake.order === "id" ? [...all].sort((a, b) => h(a) - h(b)) : all;
  const sort = q.get("sort");
  if (sort) {
    if (fake.sort === "reject") return { status: 400, body: { message: "bad sort" } };
    if (fake.sort === "honour" && sort === "created_at DESC") list = [...list].sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at));
  }
  const l = +q.get("limit"), pg = +q.get("page");
  return { status: 200, body: { data: list.slice((pg - 1) * l, pg * l), count: list.length } };
}
global.__serve = serve;
const stubs = `
  const instanceLabel = (i) => i.name;
  const nonce = () => "nonce";
  const setPanelIcon = () => {};
  const listResourceNames = async () => ["Application", "SystemLog"];
  const coreResourceNames = async () => new Set(["SystemLog"]);
  const getResourceFields = async () => ({ fields: [] });
  const recordRoutes = (r) => ["/" + r.toLowerCase() + "s"];
  const isMissingRoute = (st, b) => st === 404;
  const recordsFromBody = (b) => ({ records: b.data, total: b.count });
  const throwIfFailure = () => {};
  const saturnRequest = async (m, inst, path) => { const [route, qs] = path.split("?"); __calls.push(["GET", inst.id, path]); const r = __serve(route, new URLSearchParams(qs));
    return { status: r.status, ok: r.status < 300, json: async () => r.body }; };
  const listRecords = async (m, inst, res, o) => { __calls.push(["Sc", inst.id, res, o]); const r = __serve(recordRoutes(res)[0], new URLSearchParams({ limit: o.limit, page: o.page }));
    return { records: r.body.data, total: r.body.count }; };
`;
const m = new Module("syslogs"); m.filename = "/x/syslogs-host.js";
const orig = Module._load; Module._load = (r, p, i) => (r === "vscode" ? vscode : orig(r, p, i));
global.__calls = calls; global.__all = all;
m._compile(stubs + fs.readFileSync(file, "utf8") + "\n;module.exports=SystemLogsHost;", m.filename);
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
  const reads = () => calls.filter((c) => c[0] === "GET" || c[0] === "Sc");

  // an instance that sorts: one read of 10, sorted by created_at
  calls.length = 0;
  await S.fromWorkflows(panel, webview, "fetchWorkflowLogs", { reqId: 7, workflowId: "w" });
  let r = sent.pop().payload;
  ok(r.reqId === 7 && r.resource === "SystemLog" && r.instanceName === "B", "replies to the request with the resource and instance");
  ok(r.records.length === 10 && r.records[0].id === 250 && r.records[9].id === 241 && r.ordered === true && r.total === 250, "the newest 10, newest first: " + r.records.map((x) => x.id).join(","));
  ok(reads().length === 1 && /limit=10&page=1&sort=created_at\+DESC/.test(reads()[0][2]), "in a single read of 10 records, sorted by the instance: " + reads().map((c) => c[2] ?? "Sc").join(" "));
  ok(calls.every((c) => c[0] !== "GET" || c[1] === "i2"), "on the panel's instance");
  calls.length = 0;
  await S.fromWorkflows(panel, webview, "fetchWorkflowLogs", { reqId: 8, workflowId: "w" });
  sent.pop();
  ok(reads().length === 1, "the sort that worked is remembered (one read per check)");

  // an instance that refuses the sort, listing oldest first: read from the end
  const S2 = () => { const m2 = new Module("s2"); m2._compile(stubs + fs.readFileSync(file, "utf8") + "\n;module.exports=SystemLogsHost;", "/x/s2.js"); return m2.exports; };
  fake.sort = "reject";
  let T = S2(); calls.length = 0;
  await T.fromWorkflows(panel, webview, "fetchWorkflowLogs", { reqId: 9 });
  r = sent.pop().payload;
  ok(r.records.length === 10 && r.records[0].id === 250 && r.records[9].id === 241 && r.ordered === true, "sort refused: still the newest 10, read from the end of the oldest-first list");
  ok(calls.filter((c) => c[0] === "Sc").every((c) => c[3].limit === 10) && reads().filter((c) => c[0] === "GET").length === 2, "with pages of 10 (after trying each sort once)");

  // an instance that ignores the sort and lists records in id order: says they may not be the newest
  fake.sort = "ignore"; fake.order = "id";
  T = S2();
  await T.fromWorkflows(panel, webview, "fetchWorkflowLogs", { reqId: 10 });
  r = sent.pop().payload;
  ok(r.records.length === 10 && r.ordered === false, "records not in date order are flagged (ordered: false), not passed off as the newest");
  fake.sort = "honour"; fake.order = "time";

  // the System Logs screen's fetch reads the same newest 10
  ok(typeof S.newest === "function" && S.NEWEST === 10, "one reader (newest) and one limit (10) for every screen");

  // a server filter is passed to every read
  calls.length = 0;
  await S.fromWorkflows(panel, webview, "fetchWorkflowLogs", { reqId: 11, filter: 'workflow.id = "w-1"' });
  r = sent.pop().payload;
  ok(r.filter === 'workflow.id = "w-1"' && reads().every((c) => (c[0] === "GET" ? new URLSearchParams(c[2].split("?")[1]).get("filter") : c[3].filter) === 'workflow.id = "w-1"'), "a server filter goes with every read (and comes back in the reply)");

  // records are trimmed: the workflow copy to its id and name, no permission lists
  const big = { id: "systemlog-1", message: "m", workflow: { id: "w-1", name: "Upload", stages: [], commands: [{ id: "X" }] }, _permissions_: [1], field_restrictions: [2], task: "{}" };
  const tr = S.trim(big);
  ok(tr.workflow.id === "w-1" && tr.workflow.name === "Upload" && !("commands" in tr.workflow) && !("_permissions_" in tr) && !("field_restrictions" in tr) && tr.message === "m" && big.workflow.commands, "trim keeps the workflow's id and name only, drops permission lists, leaves the original alone");

  await S.fromWorkflows({}, webview, "fetchWorkflowLogs", { reqId: 12 });
  r = sent.pop();
  ok(r.type === "workflowLogsFailed" && r.payload.reqId === 12 && /instance/.test(r.payload.message), "failures come back as workflowLogsFailed");

  await S.fromWorkflows(panel, webview, "copyLogJson", { record: { id: 1 } });
  await S.fromWorkflows(panel, webview, "openLogJson", { record: { id: 2 } });
  ok(calls.some((c) => c[0] === "clipboard" && JSON.parse(c[1]).id === 1) && calls.some((c) => c[0] === "openTextDocument" && c[1].language === "json"), "Copy JSON / Open as JSON");

  await S.fromWorkflows(panel, webview, "openSystemLogs", { search: "x" });
  r = sent.pop();
  ok(r.type === "workflowLogsFailed" && /isn't ready/.test(r.payload.message), "Open System Logs needs the command context (attach)");
  console.log(fails ? `${fails} failed` : "all passed");
  process.exitCode = fails ? 1 : 0;
})();
