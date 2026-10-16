
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

  function open(extensionUri, manager, instance, globalState) {
    const existing = panels.get(instance.id);
    if (existing) {
      existing.panel.reveal();
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
            // records [start, end) of the whole list, read with as few pages as possible
            // (lets an oldest-first list be shown newest first in full pages)
            const limit = Math.min(100, Math.max(1, Number(p.limit) || 50));
            const start = Math.max(0, Number(p.start) || 0);
            const end = Math.max(start, Number(p.end) || 0);
            const filter = typeof p.filter === "string" && p.filter.trim() ? p.filter.trim().slice(0, 2000) : null;
            const firstPage = Math.floor(start / limit) + 1;
            const lastPage = Math.max(firstPage, Math.floor(Math.max(start, end - 1) / limit) + 1);
            let records = [], total = null;
            for (let pg = firstPage; pg <= lastPage && pg < firstPage + 3; pg++) {
              const r = await Sc(manager, instance, String(p.resource), { limit, page: pg, filter });
              total = r.total;
              records = records.concat(r.records);
              if (r.records.length < limit) break;
            }
            const off = start - (firstPage - 1) * limit;
            post("page", { reqId: p.reqId, resource: p.resource, records: records.slice(off, off + (end - start)), total });
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

  return { open, pickLogResource, panels };
})();
