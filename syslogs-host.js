
/* ---- Sonover node view patch: System Logs (read-only) ----------------------
 * Appended to dist/extension.js by patch.py, so it shares the bundle's scope
 * and reads records exactly the way the rest of the extension does:
 *   Sc(manager, instance, resource, {limit, page, filter}) -> {records, total}
 *   Ln(manager, instance, resource)                        -> {fields}
 *   dn(manager, instance)                                  -> resource names
 *   xc(manager, instance)                                  -> core resource names
 * Nothing here creates, updates or deletes a record.
 */
var SysLogs$ = (() => {
  const vs = require("vscode");
  const panels = new Map(); // instance id -> panel state
  const norm = (s) => String(s).toLowerCase().replace(/[^a-z]/g, "");
  const isLogName = (s) => /log/i.test(s);

  async function resourceNames(manager, instance) {
    let all = [];
    let core = null;
    try { all = await dn(manager, instance); } catch {}
    try { core = await xc(manager, instance); } catch {}
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
      const r = await Sc(manager, instance, resource, { limit, page: pg, filter });
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
    const nonce = xe();
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy"
        content="default-src 'none'; script-src 'nonce-${nonce}'; style-src ${w.cspSource} 'unsafe-inline';">
</head>
<body>
    <div id="logs-root"></div>
    <script type="module" nonce="${nonce}" src="${js}"></script>
</body>
</html>`;
  }

  /** opts.search: text to put in the screen's search box (e.g. a workflow's name). */
  function open(extensionUri, manager, instance, globalState, opts) {
    const search = opts && typeof opts.search === "string" ? opts.search.slice(0, 200) : "";
    const existing = panels.get(instance.id);
    if (existing) {
      existing.panel.reveal();
      if (search) existing.panel.webview.postMessage({ type: "search", payload: { text: search } });
      return;
    }
    const panel = vs.window.createWebviewPanel(
      "saturn.systemLogs",
      `System Logs — ${I(instance)}`,
      vs.ViewColumn.One,
      { enableScripts: true, localResourceRoots: [vs.Uri.joinPath(extensionUri, "dist")], retainContextWhenHidden: true },
    );
    try { Re(panel, "output"); } catch {}
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
              instanceName: I(instance),
              instanceUrl: instance.url,
              resource,
              logResources: names.filter(isLogName),
              allResources: names,
              core,
              search,
            });
            break;
          }
          case "chooseResource": {
            if (globalState && typeof p.resource === "string") await globalState.update(memKey, p.resource);
            break;
          }
          case "fields": {
            const r = await Ln(manager, instance, String(p.resource));
            post("fields", { resource: p.resource, fields: r.fields || [] });
            break;
          }
          case "fetch": {
            const limit = Math.min(100, Math.max(1, Number(p.limit) || 50));
            const page = Math.max(1, Number(p.page) || 1);
            const filter = typeof p.filter === "string" && p.filter.trim() ? p.filter.trim().slice(0, 2000) : null;
            const r = await Sc(manager, instance, String(p.resource), { limit, page, filter });
            post("page", { reqId: p.reqId, resource: p.resource, page, limit, records: r.records, total: r.total });
            break;
          }
          case "fetchRange": {
            // records [start, end) of the whole list (lets an oldest-first list be shown newest first in full pages)
            const limit = Math.min(100, Math.max(1, Number(p.limit) || 50));
            const start = Math.max(0, Number(p.start) || 0);
            const end = Math.max(start, Number(p.end) || 0);
            const filter = typeof p.filter === "string" && p.filter.trim() ? p.filter.trim().slice(0, 2000) : null;
            const r = await readRange(manager, instance, String(p.resource), start, end, limit, filter, 3);
            post("page", { reqId: p.reqId, resource: p.resource, records: r.records, total: r.total });
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

  /** Is the first page oldest first? (first vs last record's date, else id) */
  function oldestFirst(records) {
    if (records.length < 2) return false;
    const a = records[0], b = records[records.length - 1];
    const t = (r) => {
      for (const k of ["created_at", "createdAt", "timestamp", "logged_at", "time", "date", "updated_at"]) {
        const v = r && r[k];
        const n = typeof v === "number" ? (v > 1e12 ? v : v * 1000) : typeof v === "string" ? Date.parse(v) : NaN;
        if (Number.isFinite(n)) return n;
      }
      return NaN;
    };
    const x = t(a), y = t(b);
    if (Number.isFinite(x) && Number.isFinite(y) && x !== y) return x < y;
    const xi = Number(a && a.id), yi = Number(b && b.id);
    return Number.isFinite(xi) && Number.isFinite(yi) && xi < yi;
  }

  /**
   * Messages from the Workflows webview (all read-only):
   *   fetchWorkflowLogs {reqId, workflowId, offset, window} -> workflowLogs {reqId, workflowId,
   *     resource, instanceName, records (newest first), total, scanned, done} | workflowLogsFailed
   *   openSystemLogs {search?}   opens the System Logs screen for the panel's instance
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
          const base = { reqId: p.reqId, workflowId: p.workflowId, instanceName: I(instance), resource };
          if (!resource) { post("workflowLogs", { ...base, records: [], total: 0, scanned: 0, done: true }); break; }
          const limit = 100;
          const size = Math.min(500, Math.max(1, Number(p.window) || 200));
          const offset = Math.max(0, Number(p.offset) || 0);
          const first = await Sc(manager, instance, resource, { limit, page: 1, filter: null });
          const total = typeof first.total === "number" ? first.total : null;
          let records;
          if (oldestFirst(first.records) && total !== null) {
            const end = Math.max(0, total - offset);
            const r = await readRange(manager, instance, resource, Math.max(0, end - size), end, limit, null, 6);
            records = r.records.reverse();
          } else {
            const r = offset === 0 && size <= limit ? { records: first.records.slice(0, size) } : await readRange(manager, instance, resource, offset, offset + size, limit, null, 6);
            records = r.records;
          }
          const scanned = offset + records.length;
          post("workflowLogs", { ...base, records, total, scanned, done: records.length < size || (total !== null && scanned >= total) });
          break;
        }
        case "openSystemLogs": {
          const { manager, instance } = targetOf(owner);
          if (!ctx) throw new Error("The System Logs screen isn't ready yet.");
          open(ctx.extensionUri, manager, instance, ctx.globalState, { search: p.search });
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

  return { open, pickLogResource, panels, attach, fromWorkflows, targetOf, oldestFirst };
})();
