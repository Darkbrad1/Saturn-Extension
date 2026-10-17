/* System Logs (read-only): the System Logs screen and the node view's Logs tab.
 * build.mjs appends this to dist/extension.js after extension.js, so it shares
 * its scope and reads records exactly the way the rest of the extension does:
 *   listRecords(manager, instance, resource, {limit, page, filter}) -> {records, total}
 *   getResourceFields(manager, instance, resource)                  -> {fields}
 *   listResourceNames(manager, instance)                            -> resource names
 *   coreResourceNames(manager, instance)                            -> core resource names
 *   saturnRequest / recordRoutes / isMissingRoute / recordsFromBody / throwIfFailure
 *     -> the GET listRecords itself makes, used once with a sort so the instance
 *        returns the newest records first
 * Nothing here creates, updates or deletes a record. Every read is the newest
 * NEWEST (10) records: these records are big (a SystemLog carries its whole workflow).
 */
var SystemLogsHost = (() => {
  const vs = require("vscode");
  const panels = new Map(); // instance id -> panel state
  const norm = (s) => String(s).toLowerCase().replace(/[^a-z]/g, "");
  const isLogName = (s) => /log/i.test(s);
  const NEWEST = 10; // every read: the newest 10 records, nothing more

  async function resourceNames(manager, instance) {
    let all = [];
    let core = null;
    try { all = await listResourceNames(manager, instance); } catch {}
    try { core = await coreResourceNames(manager, instance); } catch {}
    const names = [...new Set([...(core ? [...core] : []), ...all])].sort((a, b) => a.localeCompare(b));
    return { names, core: core ? [...core] : [] };
  }

  /** The System Logs resource: the setting if set, else the name that reads "system log(s)". */
  function pickLogResource(names, remembered) {
    const set = vs.workspace.getConfiguration("saturn").get("systemLogResource");
    if (typeof set === "string" && set.trim()) return set.trim();
    if (remembered && names.includes(remembered)) return remembered;
    return (
      names.find((n) => norm(n) === "systemlog" || norm(n) === "systemlogs") ??
      names.find((n) => /system.*log/i.test(n)) ??
      null
    );
  }

  /** Records [start, end) of the whole list, read with as few pages as possible (at most maxPages). */
  async function readRange(manager, instance, resource, start, end, limit, filter, maxPages) {
    const firstPage = Math.floor(start / limit) + 1;
    const lastPage = Math.max(firstPage, Math.floor(Math.max(start, end - 1) / limit) + 1);
    let records = [], total = null;
    for (let pg = firstPage; pg <= lastPage && pg < firstPage + maxPages; pg++) {
      const r = await listRecords(manager, instance, resource, { limit, page: pg, filter });
      total = r.total;
      records = records.concat(r.records);
      if (r.records.length < limit) break;
    }
    const off = start - (firstPage - 1) * limit;
    return { records: records.slice(off, off + (end - start)), total };
  }

  function html(panel, extensionUri) {
    const w = panel.webview;
    const js = w.asWebviewUri(vs.Uri.joinPath(extensionUri, "dist", "webview", "logs", "index.js"));
    const cspNonce = nonce();
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy"
        content="default-src 'none'; script-src 'nonce-${cspNonce}'; style-src ${w.cspSource} 'unsafe-inline';">
</head>
<body>
    <div id="logs-root"></div>
    <script type="module" nonce="${cspNonce}" src="${js}"></script>
</body>
</html>`;
  }

  /** opts.search: text for the screen's search box; opts.filter: a server filter (e.g. a workflow's workflow.id = "…"). */
  function open(extensionUri, manager, instance, globalState, opts) {
    const search = opts && typeof opts.search === "string" ? opts.search.slice(0, 200) : "";
    const filter = opts && typeof opts.filter === "string" ? opts.filter.slice(0, 2000) : "";
    const existing = panels.get(instance.id);
    if (existing) {
      existing.panel.reveal();
      if (search || filter) existing.panel.webview.postMessage({ type: "search", payload: { text: search, filter } });
      return;
    }
    const panel = vs.window.createWebviewPanel(
      "saturn.systemLogs",
      `System Logs — ${instanceLabel(instance)}`,
      vs.ViewColumn.One,
      { enableScripts: true, localResourceRoots: [vs.Uri.joinPath(extensionUri, "dist")], retainContextWhenHidden: true },
    );
    try { setPanelIcon(panel, "output"); } catch {}
    const state = { panel, instance, manager };
    panels.set(instance.id, state);
    panel.onDidDispose(() => panels.delete(instance.id));
    const post = (type, payload) => panel.webview.postMessage({ type, payload });
    const memKey = `sonover.systemLogs.resource.${instance.id}`;

    panel.webview.onDidReceiveMessage(async (m) => {
      const p = (m && m.payload) || {};
      try {
        switch (m && m.type) {
          case "init": {
            const { names, core } = await resourceNames(manager, instance);
            const resource = pickLogResource(names, globalState && globalState.get(memKey));
            post("init", {
              instanceName: instanceLabel(instance),
              instanceUrl: instance.url,
              resource,
              logResources: names.filter(isLogName),
              allResources: names,
              core,
              search,
              filter,
            });
            break;
          }
          case "chooseResource": {
            if (globalState && typeof p.resource === "string") await globalState.update(memKey, p.resource);
            break;
          }
          case "fields": {
            const r = await getResourceFields(manager, instance, String(p.resource));
            post("fields", { resource: p.resource, fields: r.fields || [] });
            break;
          }
          case "fetch": {
            // the newest NEWEST records (newest first), with the server filter if any
            const filter = typeof p.filter === "string" && p.filter.trim() ? p.filter.trim().slice(0, 2000) : null;
            const r = await newest(manager, instance, String(p.resource), filter);
            post("page", { reqId: p.reqId, resource: p.resource, records: r.records, total: r.total, ordered: r.ordered });
            break;
          }
          case "openJson": {
            const doc = await vs.workspace.openTextDocument({ content: JSON.stringify(p.record, null, 2), language: "json" });
            await vs.window.showTextDocument(doc, { preview: true, viewColumn: vs.ViewColumn.Beside });
            break;
          }
          case "copy": {
            await vs.env.clipboard.writeText(String(p.text ?? ""));
            break;
          }
        }
      } catch (e) {
        post("error", { reqId: p.reqId, message: e && e.message ? e.message : String(e) });
      }
    });
    panel.webview.html = html(panel, extensionUri);
  }

  // ---- the Workflows screen's Logs tab ---------------------------------------
  // The node view asks the Workflows panel's host for the newest log records;
  // patch.py routes those messages here with the panel object. The panel's
  // field names are minified-agnostic: its instance is found by shape.
  let ctx = null; // { manager, globalState, extensionUri }, set when the commands are registered
  function attach(c) { ctx = c; }

  const isInstance = (v) => !!v && typeof v === "object" && typeof v.id === "string" && typeof v.url === "string";
  const isManager = (v) => !!v && typeof v === "object" && typeof v.list === "function" && typeof v.get === "function";

  /** The Saturn instance (and instance manager) a Workflows panel works on. */
  function targetOf(owner) {
    // the 0.1.1 Workflows panel (class It) keeps them as this.manager / this.instance
    if (owner && isManager(owner.manager) && isInstance(owner.instance))
      return { manager: owner.manager, instance: owner.manager.get(owner.instance.id) || owner.instance };
    // otherwise find them by shape (another build may name them differently)
    const vals = [];
    for (const k of Object.keys(owner || {})) {
      const v = owner[k];
      vals.push(v);
      if (v && typeof v === "object" && !Array.isArray(v) && !isInstance(v) && !isManager(v))
        for (const k2 of Object.keys(v).slice(0, 50)) vals.push(v[k2]);
    }
    const manager = (ctx && ctx.manager) || vals.find(isManager) || null;
    let known = [];
    try { known = manager ? manager.list() : []; } catch {}
    const byId = (id) => known.find((x) => x.id === id);
    let instance =
      vals.filter(isInstance).map((v) => byId(v.id) || v)[0] ||
      vals.filter((v) => typeof v === "string").map(byId).find(Boolean) ||
      (known.length === 1 ? known[0] : null);
    if (!manager || !instance) throw new Error("Couldn't tell which Saturn instance this workflow is on.");
    return { manager, instance };
  }

  /** A record's time (created_at or the like), or NaN. */
  function timeOf(r) {
    for (const k of ["created_at", "createdAt", "timestamp", "logged_at", "time", "date", "updated_at"]) {
      const v = r && r[k];
      const n = typeof v === "number" ? (v > 1e12 ? v : v * 1000) : typeof v === "string" ? Date.parse(v) : NaN;
      if (Number.isFinite(n)) return n;
    }
    return NaN;
  }

  /** Is the first page oldest first? (first vs last record's date, else id) */
  function oldestFirst(records) {
    if (records.length < 2) return false;
    const a = records[0], b = records[records.length - 1];
    const x = timeOf(a), y = timeOf(b);
    if (Number.isFinite(x) && Number.isFinite(y) && x !== y) return x < y;
    const xi = Number(a && a.id), yi = Number(b && b.id);
    return Number.isFinite(xi) && Number.isFinite(yi) && xi < yi;
  }

  /** Newest first by date, every record dated (so a list in id order doesn't pass). */
  function newestFirst(records) {
    const t = records.map(timeOf);
    return t.every(Number.isFinite) && t.every((x, i) => i === 0 || t[i - 1] >= x);
  }

  // the sort that worked per instance + resource ("" = none did), so it's tried once
  const sortFor = new Map();
  const SORTS = ["created_at DESC", "-created_at"];

  /** One page of `limit` records with ?sort=; null when the instance refuses it. Same GET as Sc. */
  async function sortedPage(manager, instance, resource, sort, filter) {
    const q = new URLSearchParams({ limit: String(NEWEST), page: "1", sort });
    if (filter) q.set("filter", filter);
    for (const route of recordRoutes(resource)) {
      const res = await saturnRequest(manager, instance, `${route}?${q.toString()}`);
      const body = await res.json().catch(() => null);
      if (isMissingRoute(res.status, body)) continue;
      if (!res.ok) return null;
      try { throwIfFailure(body, `Read ${resource} records`); } catch { return null; }
      return recordsFromBody(body);
    }
    return null;
  }

  /**
   * The newest NEWEST records, newest first: {records, total, ordered}.
   * Asks the instance to sort by created_at; if it won't, reads the list the
   * way it comes (an oldest-first list from its end). ordered = the dates
   * really run newest first (otherwise the list isn't in date order, and
   * these may not be the newest).
   */
  async function newest(manager, instance, resource, filter) {
    const key = `${instance.id}|${resource}`;
    const tries = sortFor.has(key) ? (sortFor.get(key) ? [sortFor.get(key)] : []) : SORTS;
    for (const sort of tries) {
      let r = null;
      try { r = await sortedPage(manager, instance, resource, sort, filter); } catch { r = null; }
      if (r && r.records.length > 1 && newestFirst(r.records)) {
        sortFor.set(key, sort);
        return { records: r.records.slice(0, NEWEST), total: r.total, ordered: true };
      }
      if (r && r.records.length <= 1) return { records: r.records, total: r.total, ordered: true };
    }
    if (!sortFor.has(key)) sortFor.set(key, "");
    const first = await listRecords(manager, instance, resource, { limit: NEWEST, page: 1, filter });
    const total = typeof first.total === "number" ? first.total : null;
    let records = first.records;
    if (oldestFirst(records)) {
      if (total !== null && total > records.length)
        records = (await readRange(manager, instance, resource, Math.max(0, total - NEWEST), total, NEWEST, filter, 2)).records;
      records = [...records].reverse();
    }
    records = records.slice(0, NEWEST);
    return { records, total, ordered: records.length < 2 || newestFirst(records) };
  }

  /**
   * A SystemLog record carries a full copy of its workflow (every stage, action
   * and step) plus permission lists: keep the workflow's id and name only, so a
   * window of records stays small in the webview.
   */
  function trim(r) {
    if (!r || typeof r !== "object") return r;
    const { _permissions_, field_restrictions, ...rest } = r;
    const w = rest.workflow;
    if (w && typeof w === "object" && !Array.isArray(w))
      rest.workflow = { id: w.id, name: w.name, "\u2026": "the full workflow definition is left out here" };
    return rest;
  }

  /**
   * Messages from the Workflows webview (all read-only):
   *   fetchWorkflowLogs {reqId, workflowId, filter?} -> workflowLogs {reqId, workflowId, resource,
   *     instanceName, records (the newest NEWEST, newest first, trimmed), total, ordered, filter} | workflowLogsFailed
   *     (filter: a server filter in Saturn's filter language, e.g. workflow.id = "workflow-…")
   *   openSystemLogs {search?, filter?}   opens the System Logs screen for the panel's instance
   *   openLogJson {record}       the record in an untitled JSON editor
   *   copyLogJson {record}       the record as JSON on the clipboard
   */
  async function fromWorkflows(owner, webview, type, p) {
    p = p || {};
    const post = (t, payload) => webview.postMessage({ type: t, payload });
    try {
      switch (type) {
        case "fetchWorkflowLogs": {
          const { manager, instance } = targetOf(owner);
          const { names } = await resourceNames(manager, instance);
          const resource = pickLogResource(names, ctx && ctx.globalState && ctx.globalState.get(`sonover.systemLogs.resource.${instance.id}`));
          const base = { reqId: p.reqId, workflowId: p.workflowId, instanceName: instanceLabel(instance), resource };
          if (!resource) { post("workflowLogs", { ...base, records: [], total: 0, ordered: true }); break; }
          const filter = typeof p.filter === "string" && p.filter.trim() ? p.filter.trim().slice(0, 2000) : null;
          const r = await newest(manager, instance, resource, filter);
          post("workflowLogs", { ...base, filter, records: r.records.map(trim), total: r.total, ordered: r.ordered });
          break;
        }
        case "openSystemLogs": {
          const { manager, instance } = targetOf(owner);
          if (!ctx) throw new Error("The System Logs screen isn't ready yet.");
          open(ctx.extensionUri, manager, instance, ctx.globalState, { search: p.search, filter: p.filter });
          break;
        }
        case "openLogJson": {
          const doc = await vs.workspace.openTextDocument({ content: JSON.stringify(p.record, null, 2), language: "json" });
          await vs.window.showTextDocument(doc, { preview: true, viewColumn: vs.ViewColumn.Beside });
          break;
        }
        case "copyLogJson": {
          await vs.env.clipboard.writeText(JSON.stringify(p.record, null, 2));
          vs.window.setStatusBarMessage("Saturn: copied the log record", 3000);
          break;
        }
      }
    } catch (e) {
      post("workflowLogsFailed", { reqId: p.reqId, workflowId: p.workflowId, message: e && e.message ? e.message : String(e) });
    }
  }

  return { open, pickLogResource, panels, attach, fromWorkflows, targetOf, oldestFirst, newestFirst, newest, trim, NEWEST };
})();
