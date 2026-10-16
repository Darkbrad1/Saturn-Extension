// Mock of the extension host side of the Workflows webview, for testing in a
// plain browser. Mirrors the host's view-model builders (Ke/_n/yr/$a/pp/fp)
// and message handlers closely enough to exercise the node view and the
// original list editor together.
(function () {
  const P = (param, label, extra = {}) => ({ param, label, type: "string", required: false, defaultValue: "", codeLanguage: null, mergedInto: null, lookupValues: null, ...extra });
  const catalog = {
    update_record: { name: "Update Record", category: "Records", description: "Update fields on the current record.", icon: null,
      params: [P("resource", "Resource", { required: true }), P("fields", "Fields", { type: "object" })] },
    send_email: { name: "Send Email", category: "Communication", description: "Send an email to one or more recipients.", icon: null,
      params: [P("to", "To", { required: true }), P("subject", "Subject", { required: true }), P("body", "Body")] },
    notify_user: { name: "Notify User", category: "Communication", description: "In-app notification.", icon: null,
      params: [P("user", "User", { defaultValue: "{{ record.owner }}" }), P("message", "Message")] },
    http_request: { name: "HTTP Request", category: "Integrations", description: "Call an external API.", icon: null,
      params: [P("method", "Method", { required: true, defaultValue: "POST", lookupValues: ["GET", "POST", "PUT", "DELETE"] }), P("url", "URL", { required: true })] },
    set_variable: { name: "Set Variable", category: "Data", description: "Store a value for later steps.", icon: null,
      params: [P("name", "Name", { required: true }), P("value", "Value")] },
    send_template_email: { name: "Send Designed Email", category: "Communication", description: "Send an email designed in the email designer.", icon: null,
      params: [P("to", "To", { required: true }), P("message", "Message", { type: "object", required: true })] },
    run_script: { name: "Run Script", category: "Data", description: "Run JavaScript against the record.", icon: null,
      params: [P("code", "Code", { required: true, defaultValue: "return record;", codeLanguage: "javascript" })] },
    // the list view's special editors
    property_updater: { name: "Property Updater", category: "Records", description: "Set properties on the record.", icon: null,
      params: [P("properties", "Properties", { type: "object" }), P("_properties", "Properties (legacy)", { type: "array", mergedInto: "properties" }), P("resource_id", "Record id")] },
    assign_owner: { name: "Assign Owner", category: "Records", description: "Make a user the record's owner.", icon: null,
      params: [P("user", "User", { required: true, lookupKind: "function", lookupResource: { resource: "users", valueField: "id", labelField: "name" } })] },
    notify_groups: { name: "Notify Groups", category: "Communication", description: "Notify everyone in some groups.", icon: null,
      params: [P("groups", "Groups", { type: "array", lookupKind: "function", lookupResource: { resource: "user_groups", valueField: "id", labelField: "name" } }), P("message", "Message")] },
    debug: { name: "Debug", category: "Developer", description: "Log the current context.", icon: null,
      params: [P("label", "Label"), P("level", "Level", { lookupValues: ["info", "warn", "error"] })] },
    schedule_followup: { name: "Schedule Follow-up", category: "Records", description: "Schedule a follow-up on the record.", icon: null,
      params: [P("due_at", "Due at", { type: "datetime", required: true }), P("remind_on", "Remind on", { type: "date" }), P("start_time", "Start time", { inputType: "time" }),
        P("color", "Label colour", { inputType: "color" }), P("retries", "Retries", { type: "number" }), P("timeout_ms", "Timeout (ms)", { type: "number" }),
        P("payload", "Payload", { type: "array" }), P("template", "Template", { codeLanguage: "html" })] },
    sync_resource: { name: "Sync Resource", category: "Integrations", description: "Copy records to another resource.", icon: null,
      params: [P("target", "Target resource", { lookupKind: "resources", required: true }), P("dry_run", "Dry run", { type: "boolean" }), P("api_key", "API key", { sensitive: true })] },
  };
  const lookupData = {
    users: [{ value: "u1", label: "Ada Lovelace" }, { value: "u2", label: "Grace Hopper" }, { value: "u3", label: "Alan Turing" }],
    user_groups: [{ value: "g1", label: "Support" }, { value: "g2", label: "Finance" }, { value: "g3", label: "Warehouse" }],
  };
  const resourceNames = ["customers", "inventory", "invoices", "orders"];
  const subjects = {
    groups: [{ id: "g1", name: "Support", description: null }, { id: "g2", name: "Finance", description: null }, { id: "g3", name: "Warehouse", description: null }],
    users: [{ id: "u1", name: "Ada Lovelace", email: "ada@example.com" }, { id: "u2", name: "Grace Hopper", email: "grace@example.com" }],
    permissions: [{ id: "p1", name: "orders.approve", description: "Approve orders" }, { id: "p2", name: "orders.refund", description: "Refund orders" }],
  };
  const triggerCatalog = [
    { id: "cron", name: "Schedule", description: "Run on a schedule", params: [
      { key: "expression", label: "Expression", type: "string", defaultValue: "0 8 * * *", description: "cron expression", choices: [], lookupResource: null, secret: false, showWhen: null },
      { key: "timezone", label: "Timezone", type: "string", defaultValue: "UTC", description: null, choices: ["UTC", "America/Grenada", "Europe/London"], lookupResource: null, secret: false, showWhen: null }] },
    { id: "http", name: "Webhook", description: "Run when a URL is called", params: [
      { key: "path", label: "Path", type: "string", defaultValue: "", description: "/_path/{{path}}", choices: [], lookupResource: null, secret: false, showWhen: null },
      { key: "auth", label: "Auth", type: "string", defaultValue: "none", description: null, choices: ["none", "token"], lookupResource: null, secret: false, showWhen: null },
      { key: "token", label: "Token", type: "string", defaultValue: "", description: null, choices: [], lookupResource: null, secret: true, showWhen: { param: "auth", equals: "token" } }] },
    { id: "once", name: "Once", description: "Run once at a set time", params: [
      { key: "run_at", label: "Run at", type: "datetime", defaultValue: "", description: null, choices: [], lookupResource: null, secret: false, showWhen: null },
      { key: "max_attempts", label: "Max attempts", type: "number", defaultValue: "1", description: null, choices: [], lookupResource: null, secret: false, showWhen: null }] },
  ];

  const STAFF_FIELD = {"key":"staff","type":"string","meta_tags":[],"defaults":{"read":"","write":""},"label":"Staff","required":false,"searchable":false,"unique":false,"hideInTable":false,"hideInForm":false,"hideInView":false,"hideInDrawer":false,"ipaddress":false,"hide":false,"email":false,"tableColumnWidth":0,"placeInOwnTab":false,"map_label_type":"property","source":"static","access_control":{},"number_of_columns":{"full_width":false,"default":1},"form_number_of_columns":{"full_width":false,"default":1},"required_columns":[],"rendering":{"component":"default","options":{"size":"small","shape":"circle","opacity":0.2},"_variances":{"list":{"component":"default","options":{"size":"small","shape":"circle","opacity":0.2}},"view":{"component":"default","span":2,"options":{"size":"small","shape":"circle","opacity":0.2}},"form":{}}},"default_view":"SLKJDSF","views":[{"id":"SLKJDSF","view":"data_table","details":{}}],"input_properties":{"type":"input","options":{"code":"<template></template> "}},"lookup_value_field":"id","lookup_label_type":"function","lookup_label":"(res,{_user,_,spice})=>{\n//your code comes here\nreturn `${res.first_name} ${res.last_name}`\n}","map":{"type":"model","value_field":"id","label_field":"label","reference":"User"},"lookup_type":"map"};
  const op = (operator, data, extra = {}) => ({ type: "command", operator, data, id: Math.random().toString(36).slice(2, 8), ...extra });
  const defs = {
    wf_orders: {
      id: "wf_orders", name: "Order fulfilment", status: "active",
      stages: [
        { stage: "new", label: "New", color: "#4a90d9", actions: [
          { id: "approve", action: "approve", label: "Approve order", access_control: [{ method: "user_group", lable: "User Group", data: ["g1"] }],
            form: { fields: [{ key: "note", label: "Note", type: "string", required: false }] },
            task: { type: "series", commands: [
            op("update_record", { resource: "orders", fields: { status: "approved" } }),
            { type: "if", operator: "command", evaluator: "condition", data: { property: "record.tier", operator: "==", value: "vip" },
              true: { type: "series", commands: [op("send_email", { to: "{{ record.email }}", subject: "Your VIP order is approved", body: "Thanks!" })] },
              false: { type: "series", commands: [op("notify_user", { user: "{{ record.owner }}", message: "Order approved" })] } },
            { type: "each", operator: "Each", reference: "{{ record.items }}", concurrency: 4, command: { type: "series", commands: [
              op("update_record", { resource: "inventory", fields: { reserved: "{{ item.qty }}" } }),
              op("http_request", { method: "POST", url: "https://warehouse.example.com/pick" }),
            ] } },
            { type: "reference", reference: "notify_customer", parameters: { template: "approved" } },
          ] } },
          { id: "reject", action: "reject", label: "Reject order", task: { type: "series", commands: [
            op("update_record", { resource: "orders", fields: { status: "rejected" } }),
            op("send_email", { to: "{{ record.email }}", subject: "About your order" }, { mock: true }),
            op("send_template_email", { to: "{{ record.email }}", message: { html: "<table><tr><td><h1>Sorry!</h1><p>Your order was rejected.</p></td></tr></table>", json: { schemaVersion: 16, body: { rows: [{}, {}, {}] } } } }),
            op("run_script", { code: "// refund\nawait refund(record.payment_id);\nreturn true;" }, { mock: false }),
          ] } },
        ] },
        { stage: "shipped", label: "Shipped", color: "#5cb85c", actions: [
          { id: "deliver", action: "deliver", label: "Mark delivered", task: { type: "series", commands: [
            { type: "parallel", operator: "parallel", concurrency: 2, commands: [
              op("send_email", { to: "{{ record.email }}", subject: "Delivered!" }),
              op("http_request", { method: "PUT", url: "https://crm.example.com/orders/{{ record.id }}" }),
            ] },
            op("update_record", { resource: "orders", fields: { status: "delivered" } }),
          ] } },
        ] },
      ],
      actions: [{ id: "resend", action: "resend_invoice", label: "Resend invoice", task: { type: "series", commands: [op("run_script", { code: "const pdf = invoice(record);\nreturn pdf;" }),
        { type: "if", operator: "command", evaluator: "condition", data: { property: "record.total", operator: ">", value: "100" },
          true: { type: "series", commands: [op("notify_user", { message: "Big invoice resent" })] }, false: { type: "series", commands: [] } },
        op("send_email", { to: "{{ record.billing_email }}", subject: "Invoice" })] } }],
      commands: [{ id: "notify_customer", name: "notify_customer", label: "Notify customer",
        parameters: { fields: [{ key: "template", label: "Template", type: "string", required: true }] },
        command: { type: "series", commands: [
          op("set_variable", { name: "tpl", value: "{{ params.template }}" }),
          op("send_email", { to: "{{ record.email }}", subject: "Order update: {{ tpl }}" }),
        ] } }],
    },
    wf_tickets: {
      id: "wf_tickets", name: "Support tickets", status: "active",
      stages: [{ stage: "open", label: "Open", color: "#f59e0b", actions: [
        { id: "triage", action: "triage", label: "Triage", task: { type: "series", commands: [
          op("property_updater", { properties: { priority: "high", queue: "tier1" }, _properties: [], resource_id: "" }),
          op("assign_owner", { user: "u2" }),
          op("notify_groups", { groups: ["g1", "g9"], message: "New ticket" }),
          op("sync_resource", { target: "customers", dry_run: true, api_key: "s3cret" }),
        ] } }] }],
      actions: [{ id: "escalate", action: "escalate", label: "Escalate", task: { type: "series", commands: [
        op("schedule_followup", { due_at: "2026-10-20T13:30:00.000Z", remind_on: "2026-10-19", start_time: "09:00", color: "#22c55e", retries: 3, timeout_ms: 1500, payload: [{ a: 1 }], template: "<p>Hi {{ record.name }}</p>" }),
      ] },
        form: { sections: [], fields: [STAFF_FIELD] } }],
      commands: [],
    },
  };
  defs.wf_debug = {
    id: "wf_debug", name: "Debug lab", status: "active",
    stages: [
      { stage: "draft", label: "Draft", color: "#64748b", actions: [
        { id: "submit", action: "submit", label: "Submit", task: { type: "series", commands: [op("debug", { label: "before submit" }), op("set_variable", { name: "x", value: "1" })] } },
        { id: "check", action: "check", label: "Check", task: { type: "series", commands: [
          { type: "each", operator: "Each", reference: "{{ _flow }}", concurrency: 1, command: { type: "series", commands: [op("debug", { label: "item" }, { mock: true })] } }] } },
      ] },
      { stage: "done", label: "Done", color: "#22c55e", actions: [
        { id: "close", action: "close", label: "Close", task: { type: "series", commands: [op("send_email", { to: "a@b.c", subject: "Closed" })] } },
      ] },
    ],
    actions: [{ id: "audit", action: "audit", label: "Audit", task: { type: "series", commands: [op("debug", { label: "audit start" }), op("debug", { label: "audit end", level: "warn" })] } }],
    commands: [
      { id: "trace", name: "trace", label: "Trace", parameters: [], command: { type: "series", commands: [op("debug", { label: "trace" })] } },
      { id: "log_it", name: "log_it", label: "Log it", parameters: [], command: { type: "series", commands: [] } },
    ],
  };
  let triggers = {
    wf_orders: [{ id: "t1", trigger_provider: "cron", status: "active", actions: ["resend"], configuration: { expression: "0 8 * * 1-5", timezone: "UTC" }, workflow: "wf_orders" }],
    wf_tickets: [],
  };
  let bindings = [
    { id: "rd1", resource: "orders", workflow: { reference: "wf_orders" }, bounded_property: "status",
      lifecycle: { update: { after: [{ data: "resend", source: "workflow-action" }] } } },
    { id: "rd2", resource: "invoices", workflow: { reference: "wf_billing" }, lifecycle: { create: { after: [{ data: { wf_orders: "approve" }, source: "workflow-action" }] } } },
  ];
  let clipboard = null;

  // ---------------------------------------------------------------- view model
  const ke = (s) => s.replace(/[_-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const txt = (v) => (v == null ? "" : typeof v === "string" ? v : JSON.stringify(v, null, 2));
  const isHtml = (v) => v && typeof v === "object" && !Array.isArray(v) && typeof v.html === "string";
  const htmlText = (v) => { const d = !!v.json && typeof v.json === "object"; const rows = Array.isArray(v.json?.body?.rows) ? v.json.body.rows.length : null;
    const parts = [d ? "Designed email" : "HTML email"]; if (rows !== null) parts.push(`${rows} row${rows === 1 ? "" : "s"}`); parts.push(`${Math.round(v.html.length / 1024)} kB of HTML`);
    if (typeof v.json?.schemaVersion === "number") parts.push(`Unlayer schema v${v.json.schemaVersion}`);
    return parts.join(" · ") + (d ? " — designed in the instance's email designer." : " — hand-written HTML."); };
  function series(n, t) {
    if (!n || typeof n !== "object") return null;
    if (n.type === "if") return iff(n, t);
    const cp = [...t, "commands"];
    return { kind: "series", label: n.type === "parallel" ? "Parallel" : "Series", children: (n.commands || []).map((c, i) => step(c, [...cp, i])).filter(Boolean), path: t, childrenPath: cp };
  }
  function iff(n, t) {
    const br = (l, k) => { if (!l) return []; const f = series(l, [...t, k]); return f && f.kind === "series" ? f.children : f ? [f] : []; };
    const d = n.data || {};
    return { kind: "if", label: "If", evaluatorKind: n.evaluator || null, evaluatorSource: d.command || null,
      condition: d.property ? { property: d.property, operator: d.operator || "==", value: txt(d.value) } : null,
      whenTrue: br(n.true, "true"), whenFalse: br(n.false, "false"), path: t, truePath: [...t, "true", "commands"], falsePath: [...t, "false", "commands"] };
  }
  function step(n, t) { const v = step0(n, t); if (v && n && n.mock === true) v.mock = true; return v; }
  function step0(n, t) {
    if (!n) return null;
    if (n.type === "if") return iff(n, t);
    if (n.type === "each") { const i = n.command ? series(n.command, [...t, "command"]) : null;
      return { kind: "each", label: "Each", concurrency: n.concurrency ?? null, collection: n.reference ?? null, children: i ? i.children : [], path: t, childrenPath: [...t, "command", "commands"] }; }
    if (n.type === "parallel" || n.type === "series") { const cp = [...t, "commands"];
      const ch = (n.commands || []).map((c, i) => step(c, [...cp, i])).filter(Boolean);
      return n.type === "series" ? { kind: "series", label: n.name ? ke(n.name) : "Series", children: ch, path: t, childrenPath: cp }
        : { kind: "parallel", label: "Parallel", concurrency: n.concurrency ?? null, children: ch, path: t, childrenPath: cp }; }
    if (n.type === "reference") return { kind: "reference", label: "Reference", targetId: n.reference ?? n.id, targetName: null,
      parameterValues: Object.entries(n.parameters || {}).map(([key, v]) => ({ key, value: txt(v) })), path: t };
    const c = catalog[n.operator];
    const params = Object.entries(n.data || {}).filter(([k]) => k !== "_properties").map(([k, v]) => ({ key: k, label: c?.params.find((p) => p.param === k)?.label ?? ke(k), type: null, value: isHtml(v) ? htmlText(v) : txt(v), truncated: false, unknown: false }));
    return { kind: "operator", label: c ? c.name : ke(n.operator || "command"), operator: n.operator, delay: n.delay ?? null, params, path: t };
  }
  const fields = (f) => (Array.isArray(f?.fields) ? f.fields : Array.isArray(f) ? f : []).map((x) => ({ key: x.key, label: x.label ?? ke(x.key), type: x.type ?? null, inputType: x.input_properties?.type ?? null, required: x.required === true, raw: x }));
  const accessOf = (a) => (a.access_control || []).map((r) => ({ method: r.method, label: r.lable ?? r.label ?? ke(r.method), data: (r.data || []).map(String), known: ["user_group", "user", "permission", "function"].includes(r.method) }));
  function action(a, t) {
    return { id: a.id, action: a.action, label: a.label, actorLabel: "Everyone", access: accessOf(a), isBatchAction: !!a.is_batch_action, confirmMessage: a.confirm_message ?? null,
      flow: series(a.task, [...t, "task"]), taskPath: [...t, "task"], form: fields(a.form) };
  }
  function view(def) {
    const cmds = def.commands.map((c, i) => ({ id: c.id, name: c.name, label: c.label, flow: series(c.command, ["commands", i, "command"]), taskPath: ["commands", i, "command"], parameters: fields(c.parameters), usageCount: 0, usages: [] }));
    const v = { id: def.id, name: def.name, status: def.status, start: null, createdAt: null, updatedAt: null,
      stages: def.stages.map((s, i) => ({ stage: s.stage, label: s.label, color: s.color, actions: s.actions.map((a, j) => action(a, ["stages", i, "actions", j])) })),
      actions: def.actions.map((a, i) => action(a, ["actions", i])), commands: cmds, triggers: [] };
    const srcs = [
      ...v.actions.map((a) => ({ flow: a.flow, label: `Global Action: ${a.label}`, target: { tab: "actions", actionId: a.id } })),
      ...v.stages.flatMap((s) => s.actions.map((a) => ({ flow: a.flow, label: `Stage ${s.label} / Action ${a.label}`, target: { tab: "workflow", stage: s.stage, actionId: a.id } }))),
      ...cmds.map((c) => ({ flow: c.flow, label: `Command: ${c.label}`, target: { tab: "commands", commandId: c.id } })),
    ];
    for (const src of srcs) {
      const walk = (f) => { if (!f) return; if (f.kind === "reference") { const c = cmds.find((x) => x.id === f.targetId || x.name === f.targetId); if (c) { f.label = c.label; f.targetName = c.name; c.usages.push({ label: src.label, pathLabel: f.path.slice(-2).join("."), path: f.path, target: src.target }); } }
        (f.children || []).forEach(walk); (f.whenTrue || []).forEach(walk); (f.whenFalse || []).forEach(walk); };
      walk(src.flow);
    }
    cmds.forEach((c) => (c.usageCount = c.usages.length));
    return v;
  }
  const summary = (d) => ({ id: d.id, name: d.name, status: d.status, stageCount: d.stages.length, globalActionCount: d.actions.length, stages: d.stages.map((s) => ({ stage: s.stage, label: s.label, color: s.color })) });
  const triggerRow = (r) => { const p = triggerCatalog.find((x) => x.id === r.trigger_provider);
    const conf = Object.fromEntries(Object.entries(r.configuration).map(([k, v]) => [k, p?.params.find((x) => x.key === k)?.secret ? "•••••" : v]));
    const summ = r.trigger_provider === "cron" ? `${p?.name} ${r.configuration.expression}${r.configuration.timezone ? " · " + r.configuration.timezone : ""}` : `${p?.name ?? r.trigger_provider} ${r.configuration.path ?? ""}`;
    return { id: r.id, provider: r.trigger_provider, providerName: p?.name ?? r.trigger_provider, status: r.status, actions: r.actions, configuration: conf, summary: summ }; };
  function bindingView() {
    return bindings.map((b) => {
      const hooks = [];
      for (const opn of ["create", "read", "get", "update", "delete", "list"]) for (const when of ["before", "after"]) {
        const arr = b.lifecycle?.[opn]?.[when] || []; const entries = [];
        for (const e of arr) { if (typeof e.data === "string") entries.push({ actionId: e.data, workflowId: null, source: e.source ?? null });
          else if (e.data && typeof e.data === "object") for (const [w, a] of Object.entries(e.data)) entries.push({ actionId: a, workflowId: w, source: e.source ?? null }); }
        if (entries.length) hooks.push({ op: opn, when, entries });
      }
      return { recordId: b.id, resource: b.resource, workflowId: b.workflow?.reference ?? null, boundedProperty: b.bounded_property ?? null, hooks, duplicate: false };
    });
  }

  // ---------------------------------------------------------------- plumbing
  const get = (o, p) => p.reduce((a, k) => (a == null ? a : a[k]), o);
  function ensureArray(o, p) { let cur = o; for (let i = 0; i < p.length - 1; i++) { const k = p[i]; if (cur[k] == null) cur[k] = typeof p[i + 1] === "number" ? [] : { type: "series" }; cur = cur[k]; } const last = p[p.length - 1]; if (!Array.isArray(cur[last])) cur[last] = []; return cur[last]; }
  const history = {}; const summaries = {};
  let cur = "wf_orders";
  const post = (type, payload) => setTimeout(() => window.dispatchEvent(new MessageEvent("message", { data: { type, payload } })), 15);
  function reply(id = cur) { post("workflow", view(defs[id])); post("draftState", { workflowId: id, pending: (summaries[id] || []).length, summaries: (summaries[id] || []).slice(0, 12) }); }
  function apply(id, text, fn) {
    (history[id] ||= []).push(JSON.stringify(defs[id]));
    const next = structuredClone(defs[id]);
    try { fn(next); } catch (e) { history[id].pop(); post("editFailed", { message: e.message }); return false; }
    defs[id] = next; (summaries[id] ||= []).unshift(text); reply(id); post("editSaved", { canUndo: true }); return true;
  }
  const ze = (x) => String(x ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 64);
  const fieldsAt = (d, ownerPath, formKey) => { const o = get(d, ownerPath); o[formKey] = o[formKey] && !Array.isArray(o[formKey]) ? o[formKey] : { fields: Array.isArray(o[formKey]) ? o[formKey] : [] }; o[formKey].fields ||= []; return o[formKey].fields; };
  const moveIn = (arr, from, to) => { const [x] = arr.splice(from, 1); let t = to; if (t > from) t -= 1; arr.splice(Math.min(t, arr.length), 0, x); };

  // System Logs records for the Logs tab, oldest first like a plain list
  // endpoint. They name their workflow in different ways (name, id, nested).
  const sysLogs = [];
  window.__addSysLog = (r) => sysLogs.push({ id: 5000 + sysLogs.length + 1, created_at: new Date(Date.UTC(2026, 9, 16, 12, 0, 0) + sysLogs.length * 60000).toISOString(), ...r });
  for (let i = 0; i < 450; i++) {
    const kind = i % 9;
    const lvl = i % 11 === 0 ? "error" : i % 5 === 0 ? "warn" : "info";
    if (kind === 0) window.__addSysLog({ level: lvl, message: `Approve order: Update Record ran (#${i})`, workflow: "Order fulfilment", action: "approve", operator: "update_record" });
    else if (kind === 1) window.__addSysLog({ level: lvl, message: `Sent email for order #${i}`, workflow_id: "wf_orders", action: "approve", operator: "send_email" });
    else if (kind === 2) window.__addSysLog({ level: lvl, message: `Delivered #${i}`, context: { workflow: { id: "wf_orders", name: "Order fulfilment" }, action: "deliver" }, operator: "http_request" });
    else if (kind === 3) window.__addSysLog({ level: lvl, message: `Ticket triaged #${i}`, workflow: "Support tickets", action: "triage", operator: "assign_owner" });
    else if (kind === 4) window.__addSysLog({ level: lvl, message: `Command notify_customer ran #${i}`, workflow: "wf_orders", command: "notify_customer", operator: "send_email" });
    else window.__addSysLog({ level: "debug", message: `Unrelated job ${i}`, source: "scheduler" });
  }
  // the Debug lab's only log is far back in time (tests searching older records)
  sysLogs[3].workflow = "Debug lab"; sysLogs[3].message = "Debug lab: audit start"; sysLogs[3].action = "audit";
  window.__sysLogs = sysLogs;

  window.__mockLog = [];
  window.__getDef = (id) => defs[id ?? cur];
  window.__defs = defs;
  window.__triggers = () => triggers;
  window.__bindings = () => bindings;
  window.__post = post;
  function handle(msg) {
    const p = msg.payload || {};
    window.__mockLog.push(msg.type);
    const id = p.workflowId ?? cur;
    const def = defs[id];
    const fail = (m) => { post("editFailed", { message: m }); post("editRejected", { errors: [{ param: "label", label: "Name", message: m }] }); };
    switch (msg.type) {
      case "fetchWorkflows":
        post("workflows", { workflows: Object.values(defs).map(summary).sort((a, b) => a.name.localeCompare(b.name)), instanceName: "Demo instance" });
        post("operators", catalog);
        post("bindings", { bindings: bindingView() });
        post("resourceNames", resourceNames);
        post("connection", { offline: false, pending: [] });
        break;
      case "fetchWorkflow": cur = p.workflowId; reply(p.workflowId); post("operators", catalog); break;
      case "fetchTriggers": post("triggers", { workflowId: id, instanceUrl: "https://demo.sonover.app", catalog: triggerCatalog, triggers: (triggers[id] || []).map(triggerRow), offline: false, rememberedAt: 0, queued: 0 }); break;
      case "fetchLookupOptions": post("lookupOptions", { resource: p.resource, options: lookupData[p.resource] ?? [] }); break;
      case "listAccessSubjects": post("accessSubjects", { ...subjects, error: null }); break;
      case "clipboardState": post("clipboard", clipboard && { label: clipboard.label, count: clipboard.nodes.length, sourceWorkflowName: clipboard.src, referencedIds: [] }); break;
      case "copyNode": { const n = get(def, p.path); const c = catalog[n.operator]; clipboard = { nodes: [structuredClone(n)], label: c ? c.name : n.type, src: def.name };
        post("clipboard", { label: clipboard.label, count: 1, sourceWorkflowName: def.name, referencedIds: [] }); break; }
      case "copyNodes": { const cmp = (a, b) => a.join(".") < b.join(".") ? -1 : 1; const nodes = [...p.paths].sort(cmp).map((x) => structuredClone(get(def, x)));
        clipboard = { nodes, label: `${nodes.length} steps`, src: def.name };
        post("clipboard", { label: clipboard.label, count: nodes.length, sourceWorkflowName: def.name, referencedIds: [] }); break; }
      case "copyContents": { const arr = get(def, p.childrenPath); clipboard = { nodes: structuredClone(arr), label: `${arr.length} steps from ${p.label}`, src: def.name };
        post("clipboard", { label: clipboard.label, count: arr.length, sourceWorkflowName: def.name, referencedIds: [] }); break; }
      case "pasteNode":
        if (!clipboard) { post("editFailed", { message: "Nothing has been copied yet." }); break; }
        apply(id, `Pasted ${clipboard.label}`, (d) => { const arr = ensureArray(d, p.childrenPath); const i = p.index == null || p.index > arr.length ? arr.length : p.index; arr.splice(i, 0, ...structuredClone(clipboard.nodes).map((n) => ({ ...n, id: Math.random().toString(36).slice(2, 8) }))); });
        break;
      case "readNode": {
        const n = get(def, p.path);
        if (!n || typeof n !== "object") { post("editFailed", { message: "Could not read that step" }); break; }
        let values = {}, operator = n.operator;
        if (n.type === "each") { operator = "each"; values = { collection: n.reference ?? "", concurrency: String(n.concurrency ?? "") }; }
        else if (n.type === "if") { operator = "if"; values = { evaluatorKind: n.evaluator ?? "command", command: n.data?.command ?? "", property: n.data?.property ?? "", conditionOperator: n.data?.operator ?? "==", value: txt(n.data?.value) }; }
        else if (n.type === "parallel") { operator = "parallel"; values = { concurrency: String(n.concurrency ?? "") }; }
        else if (n.type === "reference") { operator = "reference"; values = { command: n.reference, ...Object.fromEntries(Object.entries(n.parameters || {}).map(([k, v]) => [k, txt(v)])) }; }
        const designed = [];
        if (!["each", "if", "parallel", "reference"].includes(operator)) for (const [k, v] of Object.entries(n.data || {})) { if (k === "_properties") continue; if (isHtml(v)) { designed.push(k); values[k] = v.html; } else values[k] = typeof v === "string" ? v : JSON.stringify(v, null, 2); }
        post("nodeParams", { path: p.path, operator, values, delay: n.delay ?? null, designed, withDesignTree: designed.filter((k) => n.data[k].json) });
        break;
      }
      case "updateOperator": {
        const c = catalog[p.operator];
        const curN = get(def, p.path) || {};
        if (c) { const missing = c.params.filter((x) => x.required && !x.mergedInto && !(p.values?.[x.param] || "").trim() && !isHtml(curN.data?.[x.param])); if (missing.length) { post("editRejected", { errors: missing.map((m) => ({ param: m.param, label: m.label, message: "is required" })) }); break; } }
        if (p.operator === "reference" && p.values.command && !def.commands.some((x) => x.id === p.values.command)) { post("editRejected", { errors: [{ param: "command", label: "Command", message: "is not in this workflow" }] }); break; }
        apply(id, `Update step`, (d) => { const n = get(d, p.path);
          if (p.operator === "each") { n.reference = p.values.collection; n.concurrency = Number(p.values.concurrency || 1); }
          else if (p.operator === "if") { n.evaluator = p.values.evaluatorKind; n.data = p.values.evaluatorKind === "command" ? { command: p.values.command } : { property: p.values.property, operator: p.values.conditionOperator, value: p.values.value }; }
          else if (p.operator === "parallel") n.concurrency = Number(p.values.concurrency || 1);
          else if (p.operator === "reference") { const { command, ...rest } = p.values; n.reference = command; n.parameters = Object.fromEntries(Object.entries(rest).filter(([, v]) => v !== "")); }
          else { const data = {}; for (const [k, v] of Object.entries(n.data || {})) if (isHtml(v) && !(k in p.values)) data[k] = v;
            for (const [k, v] of Object.entries(p.values)) { if (v === "") continue; const prm = c?.params.find((x) => x.param === k);
              if (prm && (prm.type === "object" || prm.type === "array")) { try { data[k] = JSON.parse(v); } catch { data[k] = v; } }
              else if (prm?.type === "boolean") data[k] = v === "true"; else data[k] = v; }
            if (p.operator === "property_updater" && data.properties) data._properties = Object.entries(data.properties).map(([key, value]) => ({ editing: false, key, value }));
            n.data = data; if (p.delay) n.delay = p.delay; else delete n.delay; } });
        break;
      }
      case "addOperator": {
        const c = catalog[p.operator];
        if (c) { const missing = c.params.filter((x) => x.required && !x.mergedInto && !(p.values?.[x.param] || "").trim()); if (missing.length) { post("editRejected", { errors: missing.map((m) => ({ param: m.param, label: m.label, message: "is required" })) }); break; } }
        let node;
        if (p.operator === "each") node = { type: "each", operator: "Each", reference: p.values.collection, concurrency: Number(p.values.concurrency || 1), command: { type: "series", commands: [] } };
        else if (p.operator === "if") node = { type: "if", operator: "command", evaluator: p.values.evaluatorKind, data: { property: p.values.property, operator: p.values.conditionOperator, value: p.values.value }, true: { type: "series", commands: [] }, false: { type: "series", commands: [] } };
        else if (p.operator === "series") node = { type: "series", operator: "series", commands: [] };
        else if (p.operator === "parallel") node = { type: "parallel", operator: "parallel", concurrency: 1, commands: [] };
        else if (p.operator === "reference") {
          // like the host's vo(): keep only parameters the command declares
          const cmd = def.commands.find((c) => c.id === p.values.command || c.name === p.values.command);
          if (!cmd) { post("editRejected", { errors: [{ param: "command", label: "Command", message: "is required — pick the command to run" }] }); break; }
          const declared = new Set((cmd.parameters?.fields ?? cmd.parameters ?? []).map((f) => f.key));
          const { command, ...rest } = p.values;
          const params = Object.fromEntries(Object.entries(rest).filter(([k, v]) => typeof v === "string" && v.trim() && declared.has(k)));
          node = { type: "reference", operator: "reference", id: command, ...(Object.keys(params).length ? { parameters: params } : {}) };
          node.reference = command;
        }
        else node = op(p.operator, Object.fromEntries(Object.entries(p.values || {}).filter(([, v]) => v !== "")));
        apply(id, `Add "${c?.name ?? p.operator}"`, (d) => { const arr = ensureArray(d, p.childrenPath); const i = p.index == null || p.index > arr.length ? arr.length : p.index; arr.splice(i, 0, node); });
        break;
      }
      case "bulkSteps": {
        const cmp = (a, b) => { for (let i = 0; i < Math.min(a.length, b.length); i++) { const x = a[i], y = b[i]; if (x === y) continue; if (typeof x === "number" && typeof y === "number") return x - y; return String(x) < String(y) ? -1 : 1; } return a.length - b.length; };
        const ps = [...p.paths].sort(cmp).reverse(); const n = `${ps.length} steps`;
        apply(id, p.op === "delete" ? `Deleted ${n}` : p.op === "duplicate" ? `Duplicated ${n}` : `${p.mock ? "Disabled" : "Enabled"} ${n}`, (d) => {
          for (const x of ps) { const parent = get(d, x.slice(0, -1)); const i = x[x.length - 1];
            if (p.op === "delete") parent.splice(i, 1); else if (p.op === "duplicate") parent.splice(i + 1, 0, structuredClone(parent[i])); else parent[i].mock = !!p.mock; } });
        break;
      }
      case "deleteOperator": apply(id, "Deleted step", (d) => { const parent = get(d, p.path.slice(0, -1)); parent.splice(p.path[p.path.length - 1], 1); }); break;
      case "duplicateNode": apply(id, "Duplicated step", (d) => { const parent = get(d, p.path.slice(0, -1)); const i = p.path[p.path.length - 1]; parent.splice(i + 1, 0, structuredClone(parent[i])); }); break;
      case "setStepMock": apply(id, `${p.mock ? "Disabled" : "Enabled"} step`, (d) => { get(d, p.path).mock = !!p.mock; }); break;
      case "moveOperator":
        apply(id, "Moved step", (d) => {
          const from = p.fromPath; const fp = from.slice(0, -1); const fi = from[from.length - 1];
          const src = get(d, fp); const [n] = src.splice(fi, 1);
          let ti = p.toIndex; if (JSON.stringify(fp) === JSON.stringify(p.toChildrenPath) && ti > fi) ti -= 1;
          let to = p.toChildrenPath; const par = fp;
          if (to.length > par.length && par.every((x, i) => String(x) === String(to[i])) && typeof to[par.length] === "number" && to[par.length] > fi) { to = [...to]; to[par.length] -= 1; }
          const arr = ensureArray(d, to); arr.splice(ti == null ? arr.length : ti, 0, n);
        });
        break;
      case "moveStage": apply(id, "Moved stage", (d) => moveIn(d.stages, p.fromIndex, p.toIndex)); break;
      case "moveAction": apply(id, "Moved action", (d) => moveIn(typeof p.stageIndex === "number" ? d.stages[p.stageIndex].actions : d.actions, p.fromIndex, p.toIndex)); break;
      case "createStage": case "createAction": case "createCommand": {
        const name = ze(p.label);
        if (msg.type === "createStage") {
          if (def.stages.some((x) => x.stage === name)) { fail(`A stage named "${name}" already exists in this workflow.`); break; }
          apply(id, `Added stage "${p.label}"`, (d) => d.stages.push({ stage: name, label: p.label.trim(), color: p.color, actions: [] }));
        } else if (msg.type === "createAction") {
          const list = typeof p.stageIndex === "number" ? def.stages[p.stageIndex].actions : def.actions;
          if (list.some((x) => x.action === name)) { fail(`An action named "${name}" already exists in this workflow.`); break; }
          apply(id, `Added action "${p.label}"`, (d) => (typeof p.stageIndex === "number" ? d.stages[p.stageIndex].actions : d.actions).push({ id: Math.random().toString(36).slice(2, 8), action: name, label: p.label.trim(), task: { type: "series", commands: [] } }));
        } else {
          if (def.commands.some((x) => x.name === name)) { fail(`A command named "${name}" already exists in this workflow.`); break; }
          apply(id, `Added command "${p.label}"`, (d) => d.commands.push({ id: Math.random().toString(36).slice(2, 8), name, label: p.label.trim(), command: { type: "series", commands: [] }, parameters: [] }));
        }
        break;
      }
      case "renameNode":
        apply(id, `Renamed ${p.kind} to "${p.label}"`, (d) => { const n = get(d, p.path); n.label = p.label;
          if (p.machineName !== undefined) { const k = p.kind === "stage" ? "stage" : p.kind === "action" ? "action" : "name"; n[k] = p.machineName; }
          if (p.color !== undefined) { if (p.color && !/^#[0-9a-f]{6}$/i.test(p.color)) throw new Error(`"${p.color}" is not a colour`); n.color = p.color; } });
        break;
      case "deleteNode": apply(id, `Deleted ${p.kind}`, (d) => { const parent = get(d, p.path.slice(0, -1)); parent.splice(p.path[p.path.length - 1], 1); }); break;
      case "createFormField": {
        const key = ze(p.label);
        if (get(def, p.ownerPath)?.[p.formKey]?.fields?.some?.((f) => f.key === key)) { fail(`A field named "${key}" already exists in this workflow.`); break; }
        apply(id, `Added field "${p.label}"`, (d) => fieldsAt(d, p.ownerPath, p.formKey).push({ key, label: p.label.trim(), type: p.type, required: !!p.required }));
        break;
      }
      case "updateFormField": apply(id, `Updated field "${p.label}"`, (d) => { const fs = fieldsAt(d, p.ownerPath, p.formKey); const f = fs.find((x) => x.key === p.key); if (!f) throw new Error(`No field "${p.key}" here any more.`);
        Object.assign(f, { label: p.label.trim(), key: ze(p.newKey ?? p.label), type: p.type, required: !!p.required }); }); break;
      case "setFormFieldProps": {
        if (p.changes.some((c) => ["key", "label", "type"].includes(String(c.path[0])))) { fail("That field setting can\u2019t be changed here."); break; }
        apply(id, `Changed ${p.changes.length === 1 ? p.changes[0].path.join(".") : p.changes.length + " settings"} of field "${p.key}"`, (d) => {
          const fs = fieldsAt(d, p.ownerPath, p.formKey); const i = fs.findIndex((x) => x.key === p.key); if (i < 0) throw new Error(`No field "${p.key}" here any more.`);
          const f = fs[i];
          for (const c of p.changes) { let o = f; for (let j = 0; j < c.path.length - 1; j++) { const k = c.path[j]; if (!o[k] || typeof o[k] !== "object") o[k] = typeof c.path[j + 1] === "number" ? [] : {}; o = o[k]; }
            const k = c.path[c.path.length - 1]; if (c.remove) delete o[k]; else o[k] = c.value; } });
        break;
      }
      case "deleteFormField": apply(id, `Removed field "${p.key}"`, (d) => { const fs = fieldsAt(d, p.ownerPath, p.formKey); fs.splice(fs.findIndex((x) => x.key === p.key), 1); }); break;
      case "setAccess": apply(id, p.rules.length ? `Set access to ${p.rules.length} rule(s)` : "Removed every access restriction", (d) => {
        get(d, p.path).access_control = p.rules.map((r) => ({ method: r.method, lable: ke(r.method), data: r.data })); }); break;
      case "createTrigger": case "updateTrigger": {
        if (!p.actions.length) { post("editRejected", { errors: [{ param: "provider", label: "Trigger", message: "needs at least one action" }] }); break; }
        const rows = (triggers[id] ||= []);
        if (msg.type === "createTrigger") rows.push({ id: "t" + Math.random().toString(36).slice(2, 6), trigger_provider: p.provider, status: "active", actions: p.actions, configuration: { ...p.values }, workflow: id });
        else { const r = rows.find((x) => x.id === p.triggerId); const keep = Object.fromEntries(Object.entries(r.configuration).filter(([k]) => triggerCatalog.find((x) => x.id === p.provider)?.params.find((q) => q.key === k)?.secret && !p.values[k]));
          Object.assign(r, { trigger_provider: p.provider, actions: p.actions, configuration: { ...keep, ...Object.fromEntries(Object.entries(p.values).filter(([, v]) => v !== "")) } }); }
        handle({ type: "fetchTriggers", payload: { workflowId: id } }); setTimeout(() => post("triggerSaved"), 30);
        break;
      }
      case "deleteTrigger": triggers[id] = (triggers[id] || []).filter((x) => x.id !== p.triggerId); handle({ type: "fetchTriggers", payload: { workflowId: id } }); break;
      case "setLifecycleHook": {
        const b = bindings.find((x) => x.resource === p.resource);
        b.lifecycle ||= {}; b.lifecycle[p.op] ||= {}; const arr = (b.lifecycle[p.op][p.when] ||= []);
        if (p.remove) b.lifecycle[p.op][p.when] = arr.filter((e) => !(e.data === p.actionId || (e.data && typeof e.data === "object" && e.data[p.workflowId] === p.actionId)));
        else arr.push({ data: b.workflow?.reference === p.workflowId ? p.actionId : { [p.workflowId]: p.actionId }, source: "workflow-action" });
        post("bindings", { bindings: bindingView(), saved: `${p.remove ? "Removed" : "Added"} ${p.actionId} on ${p.resource} ${p.op}.${p.when}.` });
        break;
      }
      case "createWorkflow": {
        if (!String(p.name ?? "").trim()) { post("editRejected", { errors: [{ param: "label", label: "Name", message: "is required" }] }); break; }
        if (Object.values(defs).some((d) => d.name === p.name.trim())) { post("editFailed", { message: `A workflow named "${p.name}" already exists.` }); break; }
        const nid = "wf_" + ze(p.name);
        defs[nid] = { id: nid, name: p.name.trim(), status: "active", stages: p.firstStageLabel ? [{ stage: ze(p.firstStageLabel), label: p.firstStageLabel, color: p.firstStageColor ?? "", actions: [] }] : [], actions: [], commands: [] };
        handle({ type: "fetchWorkflows" });
        post("workflowCreated", { workflowId: nid, name: p.name.trim() });
        break;
      }
      case "deleteWorkflow": delete defs[p.workflowId]; post("workflowDeleted", { workflowId: p.workflowId, name: "" }); break;
      case "openParamEditor": case "openHtmlParam": case "openAccessFunction": case "openWorkflow": case "viewRawWorkflow": case "revealOfflineFiles":
        (window.__opened = window.__opened || []).push({ type: msg.type, ...p });
        break;
      case "fetchWorkflowLogs": {
        if (window.__logsFail) { post("workflowLogsFailed", { reqId: p.reqId, workflowId: p.workflowId, message: window.__logsFail }); break; }
        const size = p.window || 200, off = p.offset || 0, end = Math.max(0, sysLogs.length - off);
        const records = sysLogs.slice(Math.max(0, end - size), end).reverse();
        const scanned = off + records.length;
        post("workflowLogs", { reqId: p.reqId, workflowId: p.workflowId, instanceName: "Demo instance", resource: "SystemLog", records, total: sysLogs.length, scanned, done: records.length < size || scanned >= sysLogs.length });
        break;
      }
      case "openSystemLogs": case "openLogJson": case "copyLogJson":
        (window.__opened = window.__opened || []).push({ type: msg.type, ...p });
        break;
      case "undoLastEdit":
        if (!(history[id] || []).length) { post("editFailed", { message: "Nothing to undo in this session." }); break; }
        defs[id] = JSON.parse(history[id].pop()); summaries[id].shift(); reply(id); post("editSaved", { canUndo: history[id].length > 0 });
        break;
      case "saveChanges": summaries[id] = []; history[id] = []; reply(id); break;
      case "discardChanges": break;
    }
  }
  let state;
  window.acquireVsCodeApi = function () {
    if (window.__acquired) throw new Error("An instance of the VS Code API has already been acquired");
    window.__acquired = true;
    return { postMessage: (m) => handle(m), getState: () => state, setState: (s) => (state = s) };
  };
})();
