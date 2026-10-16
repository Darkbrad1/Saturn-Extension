// Mock of the extension host for the System Logs screen: SystemLog holds
// records oldest first (like a plain list endpoint), AuditLog newest first.
(function () {
  const t0 = Date.UTC(2026, 9, 16, 12, 0, 0);
  const steps = ["Update Record", "Send Email", "Debug", "HTTP Request"];
  const wf = ["Order fulfilment", "Support tickets"];
  const mk = (i) => ({
    id: i,
    level: i % 17 === 0 ? "error" : i % 7 === 0 ? "warn" : i % 3 === 0 ? "info" : "debug",
    message: i % 17 === 0 ? `Step failed: timeout after 1500 ms (record ${1000 + i})` : `debug: ${steps[i % 4]} ran for record ${1000 + i}`,
    workflow: wf[i % 2],
    action: i % 2 ? "triage" : "approve",
    operator: steps[i % 4].toLowerCase().replace(/ /g, "_"),
    context: { record: 1000 + i, store: { attempt: (i % 3) + 1 } },
    created_at: new Date(t0 + i * 60000).toISOString(),
  });
  const data = {
    SystemLog: Array.from({ length: 137 }, (_, i) => mk(i + 1)),
    AuditLog: Array.from({ length: 8 }, (_, i) => ({ id: 900 - i, event: "login", user: "ada", created_at: new Date(t0 - i * 3600000).toISOString() })),
  };
  window.__posted = [];
  window.__addLog = () => data.SystemLog.push(mk(data.SystemLog.length + 1));
  const reply = (type, payload) => setTimeout(() => window.dispatchEvent(new MessageEvent("message", { data: { type, payload } })), 15);
  let state;
  window.acquireVsCodeApi = () => ({
    getState: () => state,
    setState: (s) => { state = s; },
    postMessage: (m) => {
      window.__posted.push(m);
      const p = m.payload || {};
      switch (m.type) {
        case "init":
          reply("init", { instanceName: "demo.saturn.gd", instanceUrl: "https://demo.saturn.gd", resource: "SystemLog", logResources: ["AuditLog", "SystemLog"], allResources: ["Application", "AuditLog", "Menu", "SystemLog", "Workflow"] });
          break;
        case "fields":
          reply("fields", { resource: p.resource, fields: p.resource === "SystemLog" ? [{ key: "level", label: "Level", type: "string" }, { key: "message", label: "Message", type: "string" }, { key: "workflow", label: "Workflow", type: "string" }] : [] });
          break;
        case "fetchRange": {
          const all = data[p.resource] || [];
          reply("page", { reqId: p.reqId, resource: p.resource, records: all.slice(p.start, p.end), total: all.length });
          break;
        }
        case "fetch": {
          const all = data[p.resource];
          if (!all) { reply("error", { reqId: p.reqId, message: `No record route for ${p.resource} on this instance.` }); break; }
          let rows = all;
          if (p.filter) { const [k, v] = p.filter.split("="); rows = rows.filter((r) => String(r[k]) === v); }
          reply("page", { reqId: p.reqId, resource: p.resource, page: p.page, limit: p.limit, records: rows.slice((p.page - 1) * p.limit, p.page * p.limit), total: rows.length });
          break;
        }
      }
    },
  });
})();
