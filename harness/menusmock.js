// Mock of the extension host for the Menus screen (MenusPanel): three menus, one with sub-tabs and
// one with problems, user groups, resources, custom pages and saved views. Like the real host, a save
// writes the menu (a new one gets an id and goes last) and posts the state, then `saved`; reorder
// renumbers; delete asks nothing here (the real host asks first). window.__posted logs every message;
// window.__menus is the "instance".
(function () {
  const p = (text) => `<p style="margin:0;padding:0;line-height:1">${text}</p>`;
  const table = (id) => ({ id, name: "Table", view: "data_table", details: { aggregations: [], table_columns: [] } });
  const tab = (resource, caption, extra = {}) => ({ resource, resource_label: p(caption), create_label: "", default_view: "data_table", views: [table(`inline-${resource}`)], filter: "", sorts: [], sub_menus: [], tab_icon: "", tab_bg_color: "", tab_active_bg_color: "", openOnCreate: false, disableBatchActions: false, reloadOnStatusChange: false, ...extra });
  const menus = [
    { id: "menu-loans", label: "Loans", icon: "briefcase", order: 1, access_control: [{ method: "user_group", lable: "User Group", data: ["g-staff"], icon: { __name: "folder", name: "Folder" } }],
      references: [
        tab("Application", "Applications", { filter: 'status = "open"', sub_menus: [tab("Application", "Approved", { filter: 'status = "approved"' }), tab("Application", "Rejected", { filter: 'status = "rejected"' })] }),
        tab("Loan", "Loans", { tab_icon: "coins" }),
        { type: "custom_page", page: "dashboard-home", title: "Home", resource_label: "Overview" },
      ] },
    { id: "menu-admin", label: "Admin", icon: "gear", order: 2, access_control: [], references: [tab("User", "Users"), tab("Ghost", "Ghosts")] },
    { id: "menu-reports", label: "Reports", icon: "chart-line", order: 3, access_control: [], references: [tab("Loan", "", { filter: 'nothing = "x"' })] },
  ];
  window.__menus = menus;
  window.__posted = [];
  const fields = {
    Application: [{ key: "status", label: "Status", type: "string" }, { key: "amount", label: "Amount", type: "number" }, { key: "submitted_at", label: "Submitted", type: "date" }],
    Loan: [{ key: "amount", label: "Amount", type: "number" }, { key: "term", label: "Term", type: "number" }],
    User: [{ key: "email", label: "Email", type: "string" }],
  };
  const savedViews = [{ id: "view-cal", name: "Due dates", view: "calendar", resource: "Application" }];
  const send = (m) => setTimeout(() => window.dispatchEvent(new MessageEvent("message", { data: m })), 15);
  const state = () => send({ type: "state", instanceName: "demo", menus: JSON.parse(JSON.stringify([...menus].sort((a, b) => a.order - b.order))), groups: [{ id: "g-staff", name: "Staff" }, { id: "g-admin", name: "Admins" }],
    resources: ["Application", "Loan", "User"], pages: [{ slug: "dashboard-home", title: "Home", enabled: true }], savedViews, dialect: "bare", undoable: window.__undoable ?? [] });
  let n = 0;
  let saved;
  window.acquireVsCodeApi = () => ({
    getState: () => saved,
    setState: (s) => { saved = s; return s; },
    postMessage: (m) => {
      window.__posted.push(JSON.parse(JSON.stringify(m)));
      switch (m.type) {
        case "ready": case "refresh": send({ type: "loading", busy: true }); state(); send({ type: "loading", busy: false }); break;
        case "loadFields": send({ type: "fields", resource: m.resource, fields: fields[m.resource] ?? [] }); break;
        case "count": send({ type: "count", requestId: m.requestId, count: /nothing/.test(m.filter) ? 0 : 12 }); break;
        case "listAccessSubjects": send({ type: "accessSubjects", subjects: { groups: [{ id: "g-staff", name: "Staff" }, { id: "g-admin", name: "Admins" }], users: [{ id: "u1", name: "Ann", detail: "ann@x" }], permissions: [] } }); break;
        case "save": {
          if (window.__saveFail) { send({ type: "error", message: window.__saveFail }); break; }
          const body = JSON.parse(JSON.stringify(m.menu));
          let id = m.id;
          if (!id) { id = `menu-new-${++n}`; menus.push({ ...body, id, order: Math.max(...menus.map((x) => x.order)) + 1 }); }
          else Object.assign(menus.find((x) => x.id === id), { label: body.label, icon: body.icon, access_control: body.access_control, references: body.references });
          state();
          send({ type: "saved", id, created: !m.id, unsaved: [] });
          break;
        }
        case "reorder": m.ids.forEach((id, i) => { const x = menus.find((y) => y.id === id); if (x) x.order = i + 1; }); state(); break;
        case "delete": { const i = menus.findIndex((x) => x.id === m.id); if (i >= 0) menus.splice(i, 1); state(); send({ type: "deleted", id: m.id }); break; }
        case "createView": { const view = { id: `view-${++n}`, name: m.view.name || "View", view: m.view.type, resource: m.view.resource }; savedViews.push(view); state(); send({ type: "viewCreated", requestId: m.requestId, view }); break; }
      }
    },
  });
})();
