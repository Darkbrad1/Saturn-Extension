/* Resource properties: pick a resource, see its properties, change whether each is required.
 * build.mjs appends this to dist/extension.js after extension.js, so it shares its scope:
 *   listResourceNames(manager, instance) -> names · saturnRequest · checked · jsonDeepEqual
 *   instanceLabel · nonce · setPanelIcon
 * A resource's definition is GET /Resources/<name> -> {type: "resource", data: [{key, label,
 * type, required, …}, …]} (a list of properties, each with its key; some instances may send a
 * {<key>: {…}} map instead — both are read, and written back in the shape they came in).
 * Saving is what Saturn's own app does (seen in its network traffic): PUT /resources/<name>/schema
 * with {data: "<JSON text of {<property key>: <property without its key>, …}>"} — the whole schema.
 * A save is careful:
 *   1. read the definition again (never write over someone else's newer change);
 *   2. back it up to <global storage>/resource-backups/<instance id>/<resource>-<time>.json;
 *   3. write it with only what was asked changed: properties' `required`, and/or the properties'
 *      order (the schema's order is the order the map is sent in);
 *   4. read it back and check exactly those changed and nothing else, and the order kept.
 * If the instance refuses, nothing changed. If the read-back differs in any other way, the screen
 * says how and offers to put the backup back (the same careful write and check).
 * When a save is refused, `probe` (read-only: OPTIONS, and the instance's MCP initialize +
 * tools/list) reports what the instance does take, to find its real way of saving resources.
 */
var ResourcePropertiesHost = (() => {
  const vs = require("vscode");
  const panels = new Map(); // instance id -> panel
  const isObject = (value) => !!value && typeof value === "object" && !Array.isArray(value);
  let storageUri = null;

  /** GET /Resources/<name> -> {body, data} (data: the property list or map). */
  async function readResource(manager, instance, resource) {
    const response = await checked(() => saturnRequest(manager, instance, `/Resources/${encodeURIComponent(resource)}`), `Read resource ${resource}`);
    const body = await response.json().catch(() => null);
    if (body?.status === "FAILURE") throw new Error(`Read resource ${resource}: ${typeof body.message === "string" ? body.message : "the instance refused"}`);
    if (!Array.isArray(body?.data) && !isObject(body?.data)) throw new Error(`${resource} has no property list the extension can read.`);
    return { body, data: body.data };
  }

  /** [key, property] pairs, in order, from a list (each with its key) or a map. */
  function entriesOf(data) {
    return Array.isArray(data)
      ? data.map((property, index) => [isObject(property) && typeof property.key === "string" ? property.key : `#${index + 1}`, property])
      : Object.entries(data);
  }

  /** What the screen shows of each property. */
  function propertiesOf(data) {
    return entriesOf(data).map(([key, property]) => ({
      key,
      label: isObject(property) && typeof property.label === "string" && property.label ? property.label : null,
      type: isObject(property) && typeof property.type === "string" ? property.type : null,
      required: isObject(property) && property.required === true,
      // a property that isn't an object (or has no key) can't be changed here
      editable: isObject(property) && !key.startsWith("#"),
      definition: property,
    }));
  }

  /** changes: [{key, required}] -> the data with only those flags changed, or an error message. */
  function applyRequired(data, changes) {
    const wanted = new Map(changes.map((change) => [change.key, !!change.required]));
    const present = new Map(entriesOf(data));
    for (const key of wanted.keys()) {
      if (!present.has(key)) return `${key} is no longer a property of this resource — reload and try again.`;
      if (!isObject(present.get(key))) return `${key} can't be marked required.`;
    }
    const change = (key, property) => (wanted.has(key) ? { ...property, required: wanted.get(key) } : property);
    return Array.isArray(data)
      ? data.map((property) => (isObject(property) && wanted.has(property.key) ? change(property.key, property) : property))
      : Object.fromEntries(Object.entries(data).map(([key, property]) => [key, change(key, property)]));
  }

  /** order: every property key, in the order wanted -> the data in that order, or an error
   *  message if the keys don't match the resource's (it changed since the screen read it). */
  function applyOrder(data, order) {
    const entries = entriesOf(data);
    const keys = entries.map(([key]) => key);
    if (order.length !== keys.length || new Set(order).size !== order.length || !order.every((key) => keys.includes(key))) {
      return "The resource's properties changed since you opened it — reload and order them again.";
    }
    const byKey = new Map(entries);
    return Array.isArray(data) ? order.map((key) => byKey.get(key)) : Object.fromEntries(order.map((key) => [key, byKey.get(key)]));
  }

  /** The property keys of a definition, in order. */
  const keysOf = (data) => entriesOf(data).map(([key]) => key);

  /** The keys of the properties that differ between two definitions. */
  function differences(expected, actual) {
    const left = new Map(entriesOf(expected));
    const right = new Map(entriesOf(actual));
    return [...new Set([...left.keys(), ...right.keys()])].filter((key) => !jsonDeepEqual(left.get(key), right.get(key)));
  }

  async function backup(instance, resource, body) {
    if (!storageUri) throw new Error("No storage folder for backups, so nothing was changed.");
    const folder = vs.Uri.joinPath(storageUri, "resource-backups", instance.id);
    await vs.workspace.fs.createDirectory(folder);
    const at = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z");
    const file = vs.Uri.joinPath(folder, `${resource.replace(/[^A-Za-z0-9_-]/g, "_")}-${at}.json`);
    const content = JSON.stringify({ instance: instance.url, resource, savedAt: new Date().toISOString(), body }, null, 2);
    await vs.workspace.fs.writeFile(file, new TextEncoder().encode(content));
    return file;
  }

  /** The definition in the shape Saturn saves it: {<property key>: <property without its key>}.
   *  (GET answers with a list whose items carry their key; Saturn's own app saves this map.)
   *  Throws if a property has no key — it couldn't be saved under one. */
  function schemaMap(data) {
    const map = {};
    for (const [key, property] of entriesOf(data)) {
      if (key.startsWith("#")) throw new Error("A property of this resource has no key, so it can't be saved from here. Nothing was changed.");
      if (isObject(property)) {
        const { key: _key, ...rest } = property;
        map[key] = rest;
      } else {
        map[key] = property;
      }
    }
    return map;
  }

  /** A reply, short enough to show: what the instance said to a write. */
  function replyText(reply) {
    const text = reply === null ? "(no JSON body)" : JSON.stringify(reply);
    return text.length > 300 ? `${text.slice(0, 300)}…` : text;
  }

  /** The save Saturn's own app makes: PUT /resources/<name>/schema {data: "<the schema map as
   *  JSON text>"} — the whole definition. Throws (nothing written) if the instance refuses;
   *  returns its reply body. */
  async function write(manager, instance, resource, data) {
    const what = `Save resource ${resource}`;
    const body = JSON.stringify({ data: JSON.stringify(schemaMap(data)) });
    let response;
    try {
      response = await saturnRequest(manager, instance, `/resources/${encodeURIComponent(resource)}/schema`, { method: "PUT", body });
    } catch (error) {
      throw new Error(`${what}: ${error instanceof Error ? error.message : String(error)}. Nothing was changed.`);
    }
    if (!response.ok) {
      const allowed = allowedMethods(response);
      throw new Error(response.status === 404 || response.status === 405
        ? `This instance doesn't accept changes to resources at /resources/${resource}/schema (${response.status}${allowed ? `; it allows ${allowed}` : ""}). Nothing was changed.`
        : `${what}: ${response.status} ${response.statusText}. Nothing was changed.`);
    }
    const reply = await response.json().catch(() => null);
    if (reply?.status === "FAILURE") throw new Error(`${what}: ${typeof reply.message === "string" ? reply.message : "the instance refused"}. Nothing was changed.`);
    return reply;
  }

  /** Writes nextData over the current definition (backed up first) and checks the result. */
  async function writeChecked(manager, instance, resource, current, nextData) {
    const backupFile = await backup(instance, resource, current.body);
    const reply = await write(manager, instance, resource, nextData);
    const after = await readResource(manager, instance, resource);
    const wrong = differences(nextData, after.data);
    const orderKept = keysOf(nextData).join("\n") === keysOf(after.data).join("\n");
    if (!wrong.length && orderKept) return { ok: true, backup: backupFile.fsPath, data: after.data };
    if (!wrong.length) {
      return { ok: false, backup: backupFile.fsPath, data: after.data, unchanged: false, message: "The properties were saved, but the instance didn't keep their new order. You can put the backup back." };
    }
    const unchanged = differences(current.data, after.data).length === 0;
    return {
      ok: false,
      backup: backupFile.fsPath,
      data: after.data,
      unchanged,
      message: unchanged
        ? `The instance answered, but the resource is unchanged. It answered: ${replyText(reply)}`
        : `The resource changed differently from what was asked, in: ${wrong.slice(0, 12).join(", ")}${wrong.length > 12 ? "…" : ""}. You can put the backup back.`,
    };
  }

  /** The methods a response says its address takes (Allow / CORS headers), or "". */
  function allowedMethods(response) {
    return (response.headers.get("allow") || response.headers.get("access-control-allow-methods") || "").trim();
  }

  /** One JSON-RPC call to the instance's own MCP server (POST /api/mcp); returns the reply or null. */
  async function mcpCall(manager, instance, session, id, method, params) {
    const response = await saturnRequest(manager, instance, "/mcp", {
      method: "POST",
      headers: { Accept: "application/json, text/event-stream", ...(session.id ? { "Mcp-Session-Id": session.id } : {}) },
      body: JSON.stringify({ jsonrpc: "2.0", id, method, params }),
      signal: AbortSignal.timeout(8000),
    });
    session.id = response.headers.get("mcp-session-id") || session.id;
    session.status = response.status;
    if (!response.ok) return null;
    const text = await response.text();
    const pick = (payload) => (Array.isArray(payload) ? payload.find((m) => m?.id === id) : payload);
    if ((response.headers.get("content-type") || "").includes("text/event-stream")) {
      for (const block of text.split(/\r?\n\r?\n/)) {
        const data = block.split(/\r?\n/).filter((l) => l.startsWith("data:")).map((l) => l.slice(5).trimStart()).join("\n");
        try { const reply = pick(JSON.parse(data)); if (reply?.id === id) return reply; } catch {}
      }
      return null;
    }
    try { return pick(JSON.parse(text)); } catch { return null; }
  }

  /** Read-only check of how this instance might take a resource change: which methods
   *  /Resources/<name> allows (OPTIONS), and the instance's own MCP tools that are about
   *  resources. Nothing is written: OPTIONS, and MCP initialize + tools/list only. */
  async function probe(manager, instance, resource) {
    const lines = [`Instance: ${instance.url}`, `Resource: ${resource}`];
    for (const path of [`/Resources/${encodeURIComponent(resource)}`, "/Resources"]) {
      try {
        const response = await saturnRequest(manager, instance, path, { method: "OPTIONS", signal: AbortSignal.timeout(8000) });
        lines.push(`OPTIONS /api${path}: ${response.status}${allowedMethods(response) ? ` — allows ${allowedMethods(response)}` : " — no Allow header"}`);
      } catch (error) {
        lines.push(`OPTIONS /api${path}: failed (${error instanceof Error ? error.message : String(error)})`);
      }
    }
    try {
      const session = { id: null, status: null };
      const init = await mcpCall(manager, instance, session, 1, "initialize", { protocolVersion: "2025-03-26", capabilities: {}, clientInfo: { name: "saturn-vscode", version: "0.1.0" } });
      if (!init?.result) {
        lines.push(`MCP (/api/mcp): no MCP server answered (${session.status ?? "no reply"})`);
      } else {
        await saturnRequest(manager, instance, "/mcp", {
          method: "POST",
          headers: { Accept: "application/json, text/event-stream", ...(session.id ? { "Mcp-Session-Id": session.id } : {}) },
          body: JSON.stringify({ jsonrpc: "2.0", method: "notifications/initialized" }),
          signal: AbortSignal.timeout(8000),
        }).catch(() => null);
        const list = await mcpCall(manager, instance, session, 2, "tools/list", {});
        const tools = Array.isArray(list?.result?.tools) ? list.result.tools.filter((t) => typeof t?.name === "string") : [];
        const about = tools.filter((t) => /resource|schema|propert|field|model/i.test(`${t.name} ${t.description ?? ""}`));
        lines.push(`MCP (/api/mcp): ${tools.length} tools`);
        for (const t of about) lines.push(`  • ${t.name}${t.annotations?.readOnlyHint ? " (read-only)" : ""} — ${String(t.description ?? "").replace(/\s+/g, " ").slice(0, 200)}`);
        if (!about.length && tools.length) lines.push(`  none about resources; all: ${tools.map((t) => t.name).join(", ").slice(0, 600)}`);
      }
    } catch (error) {
      lines.push(`MCP (/api/mcp): failed (${error instanceof Error ? error.message : String(error)})`);
    }
    return lines.join("\n");
  }

  function html(panel, extensionUri) {
    const webview = panel.webview;
    const script = webview.asWebviewUri(vs.Uri.joinPath(extensionUri, "dist", "webview", "resources", "index.js"));
    const cspNonce = nonce();
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy"
        content="default-src 'none'; script-src 'nonce-${cspNonce}'; style-src ${webview.cspSource} 'unsafe-inline';">
</head>
<body>
    <div id="resources-root"></div>
    <script type="module" nonce="${cspNonce}" src="${script}"></script>
</body>
</html>`;
  }

  /** Answers one message from the screen; `post` sends the reply. Also used by the host tests. */
  async function handle(manager, instance, message, post) {
    const payload = (message && message.payload) || {};
    switch (message && message.type) {
      case "init": {
        const names = (await listResourceNames(manager, instance)).slice().sort((a, b) => a.localeCompare(b));
        post("init", { instanceName: instanceLabel(instance), resources: names });
        break;
      }
      case "load": {
        const resource = String(payload.resource);
        const { data } = await readResource(manager, instance, resource);
        post("properties", { resource, properties: propertiesOf(data) });
        break;
      }
      case "save": {
        const resource = String(payload.resource);
        const changes = Array.isArray(payload.changes) ? payload.changes.filter((c) => c && typeof c.key === "string") : [];
        // order: every property key in the new order (sent only when the order was changed)
        const order = Array.isArray(payload.order) && payload.order.every((k) => typeof k === "string") ? payload.order : null;
        if (!changes.length && !order) return post("saveFailed", { resource, message: "Nothing to save." });
        // the definition as it is now, not as the screen first read it
        const current = await readResource(manager, instance, resource);
        let nextData = applyRequired(current.data, changes);
        if (typeof nextData === "string") return post("saveFailed", { resource, message: nextData });
        if (order) nextData = applyOrder(nextData, order);
        if (typeof nextData === "string") return post("saveFailed", { resource, message: nextData });
        const result = await writeChecked(manager, instance, resource, current, nextData);
        post(result.ok ? "saved" : "saveMismatch", { resource, ok: result.ok, backup: result.backup, unchanged: result.unchanged, message: result.message, properties: propertiesOf(result.data) });
        break;
      }
      case "restore": {
        const resource = String(payload.resource);
        const saved = JSON.parse(new TextDecoder().decode(await vs.workspace.fs.readFile(vs.Uri.file(String(payload.backup)))));
        const savedData = saved?.body?.data;
        if (saved?.resource !== resource || saved?.instance !== instance.url || (!Array.isArray(savedData) && !isObject(savedData))) {
          return post("saveFailed", { resource, message: "That backup is for another resource or instance." });
        }
        const current = await readResource(manager, instance, resource);
        const result = await writeChecked(manager, instance, resource, current, savedData);
        post(result.ok ? "restored" : "saveMismatch", { resource, ok: result.ok, backup: result.backup, unchanged: result.unchanged, message: result.message, properties: propertiesOf(result.data) });
        break;
      }
      case "probe": {
        const resource = String(payload.resource);
        post("probe", { resource, report: await probe(manager, instance, resource) });
        break;
      }
      case "copy": {
        await vs.env.clipboard.writeText(String(payload.text ?? ""));
        break;
      }
      case "openBackups": {
        if (storageUri) {
          const folder = vs.Uri.joinPath(storageUri, "resource-backups", instance.id);
          await vs.workspace.fs.createDirectory(folder);
          await vs.env.openExternal(folder);
        }
        break;
      }
    }
  }

  function open(extensionUri, manager, instance) {
    const existing = panels.get(instance.id);
    if (existing) return existing.reveal();
    const panel = vs.window.createWebviewPanel("saturn.resourceProperties", `Resources — ${instanceLabel(instance)}`, vs.ViewColumn.One, {
      enableScripts: true,
      localResourceRoots: [vs.Uri.joinPath(extensionUri, "dist")],
      retainContextWhenHidden: true,
    });
    try { setPanelIcon(panel, "symbol-property"); } catch {}
    panels.set(instance.id, panel);
    panel.onDidDispose(() => panels.delete(instance.id));
    const post = (type, payload) => panel.webview.postMessage({ type, payload });
    panel.webview.onDidReceiveMessage(async (message) => {
      try {
        await handle(manager, instance, message, post);
      } catch (error) {
        post(message?.type === "save" || message?.type === "restore" ? "saveFailed" : "failed", {
          resource: message?.payload?.resource,
          message: error instanceof Error ? error.message : String(error),
        });
      }
    });
    panel.webview.html = html(panel, extensionUri);
  }

  /** At command registration: where backups go. */
  function attach(options) {
    storageUri = options.globalStorageUri ?? null;
  }

  return { open, attach, handle, propertiesOf, applyRequired, applyOrder, differences, entriesOf };
})();
