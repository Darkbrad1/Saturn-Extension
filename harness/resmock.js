// Mock of the extension host for the Resources screen: Application (a list-shaped definition, like
// Saturn's), Loan and LoanCategory (for map references), AttachmentGroup records.
// window.__saveMode: "ok" (default) | "refuse" | "mismatch". Like the real host, a save applies each
// change at its path ({key, path, value | remove}; the old {key, required} too), adds new
// properties ({key, property}) at the end, removes properties ({removes: [key]}), then the order,
// then new keys ({from, to}).
(function () {
  const prop = (key, label, type, required = false) => ({ key, label, type, required, searchable: false, map_label_type: "property", source: "static", rendering: { component: "default" }, input_properties: { type: "input" } });
  const data = {
    Application: [prop("status", "Status", "string"), prop("application_number", "Application Number", "string"), prop("requested_loan_amount", "Requested Loan Amount", "number"), prop("submitted_at", "Submitted At", "date", true)],
    Loan: [
      prop("amount", "Amount", "number", true),
      prop("term", "Term", "number"),
      { ...prop("category", "Category", "string"), map: { type: "model", reference: "LoanCategory", value_field: "id", label_field: "label" } },
      { ...prop("payments", "Payments", "array"), source: "dynamic", source_type: "resource_lookup", source_definition: { reference: "Application", bounded_property: "loan", default_limit: 10 } },
    ],
    User: [prop("email", "Email", "string", true)],
    LoanCategory: [prop("id", "ID", "string"), prop("label", "Label", "string"), prop("code", "Code", "string")],
  };
  const view = (list) => list.map((p) => ({ key: p.key, label: p.label, type: p.type, required: p.required === true, editable: true, definition: p }));
  window.__posted = [];
  window.__saveMode = "ok";
  window.__data = data;
  const reply = (type, payload) => setTimeout(() => window.dispatchEvent(new MessageEvent("message", { data: { type, payload } })), 15);
  let state;
  window.acquireVsCodeApi = () => ({
    getState: () => state,
    setState: (s) => { state = s; return s; } /* like VS Code: it returns the state */,
    postMessage: (m) => {
      window.__posted.push(m);
      const p = m.payload || {};
      if (m.type === "init") reply("init", { instanceName: "demo", resources: Object.keys(data).sort(), core: ["User"] });
      if (m.type === "load") reply("properties", { resource: p.resource, properties: view(data[p.resource]) });
      if (m.type === "save") {
        if (window.__saveMode === "refuse") return reply("saveFailed", { resource: p.resource, message: "This instance doesn't accept changes to resources at /Resources/Application (405). Nothing was changed." });
        const setAt = (o, path, value, remove) => {
          const [head, ...rest] = path;
          const copy = { ...(o && typeof o === "object" ? o : {}) };
          if (!rest.length) { if (remove) delete copy[head]; else copy[head] = value; return copy; }
          copy[head] = setAt(copy[head], rest, value, remove);
          return copy;
        };
        let list = data[p.resource];
        for (const c of p.changes || []) {
          const i = list.findIndex((x) => x.key === c.key);
          list[i] = c.path ? setAt(list[i], c.path, c.value, c.remove) : { ...list[i], required: c.required };
        }
        for (const a of p.adds || []) list.push({ ...a.property, key: a.key });
        list = list.filter((x) => !(p.removes || []).includes(x.key));
        if (p.order) list = p.order.map((k) => list.find((x) => x.key === k));
        for (const r of p.renames || []) list = list.map((x) => (x.key === r.from ? { ...x, key: r.to } : x));
        data[p.resource] = list;
        const saved = data[p.resource];
        if (window.__saveMode === "mismatch") { saved[0].searchable = true; return reply("saveMismatch", { resource: p.resource, ok: false, unchanged: false, backup: "/backups/Application-1.json", message: "The resource changed differently from what was asked, in: status. You can put the backup back.", properties: view(saved) }); }
        reply("saved", { resource: p.resource, ok: true, backup: "/backups/Application-1.json", properties: view(saved) });
      }
      if (m.type === "fields") reply("fields", { resource: p.resource, fields: (data[p.resource] || []).map((x) => ({ key: x.key, label: x.label, type: x.type })) });
      if (m.type === "options") reply("options", { resource: p.resource, value: p.value, label: p.label, options: [["attachmentgroup-1", "Loan documents"], ["attachmentgroup-2", "ID documents"]] });
      if (m.type === "workflows") reply("workflows", { resource: p.resource, workflows: p.resource === "Application" ? [{ id: "wf-1", name: "Loan process", via: "workflow", hooks: [] }, { id: "wf-2", name: "Notify", via: "hook", hooks: ["after create"] }] : [] });
      if (m.type === "probe") reply("probe", { resource: p.resource, report: "OPTIONS /api/Resources/Application: 204 — allows GET, PATCH\nMCP (/api/mcp): 1 tools\n  • update_resource_schema — Change a resource's properties" });
      if (m.type === "restore") reply("restored", { resource: p.resource, ok: true, backup: "/backups/Application-2.json", properties: view(data[p.resource]) });
    },
  });
})();
