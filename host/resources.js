/* Resource properties: pick a resource, see its properties, change whether each is required.
 * build.mjs appends this to dist/extension.js after extension.js, so it shares its scope:
 *   listResourceNames(manager, instance) -> names · saturnRequest · checked · jsonDeepEqual
 *   instanceLabel · nonce · setPanelIcon
 * A resource's definition is GET /Resources/<name> -> {type: "resource", data: [{key, label,
 * type, required, …}, …]} (a list of properties, each with its key; some instances may send a
 * {<key>: {…}} map instead — both are read, and written back in the shape they came in).
 * Saturn's way of saving one isn't documented, so a save is careful:
 *   1. read the definition again (never write over someone else's newer change);
 *   2. back it up to <global storage>/resource-backups/<instance id>/<resource>-<time>.json;
 *   3. send it to /Resources/<name> — with the first of PUT, PATCH, POST the address allows
 *      (OPTIONS; never DELETE; the one that worked is remembered) — only the chosen properties'
 *      `required` changed — first as
 *      the `data` alone (the way a workflow is saved), and if the instance takes that but nothing
 *      changes, once more as the whole {type, data} body; the shape that worked is remembered;
 *   4. read it back and check exactly those changed and nothing else (if nothing changed and the
 *      reply looks like a created record, stop at once and say so).
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
  let globalState = null;
  const shapeKey = (instance) => `sonover.resourceSaveShape.${instance.id}`;
  const methodKey = (instance) => `sonover.resourceSaveMethod.${instance.id}`;

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

  /** The method a resource is saved with on this instance: the remembered one, else the first of
   *  PUT, PATCH, POST that OPTIONS /Resources/<name> says the address takes (PUT if it says nothing).
   *  DELETE is never used. */
  async function saveMethod(manager, instance, resource) {
    const remembered = globalState?.get(methodKey(instance));
    if (remembered) return remembered;
    let allowed = "";
    try {
      const response = await saturnRequest(manager, instance, `/Resources/${encodeURIComponent(resource)}`, { method: "OPTIONS", signal: AbortSignal.timeout(8000) });
      allowed = allowedMethods(response).toUpperCase();
    } catch {}
    const methods = allowed.split(/[\s,]+/);
    return ["PUT", "PATCH", "POST"].find((m) => methods.includes(m)) ?? "PUT";
  }

  /** One write; throws (and nothing was written) if the instance refuses. Returns its reply body. */
  async function write(manager, instance, resource, method, payload) {
    const what = `Save resource ${resource}`;
    let response;
    try {
      response = await saturnRequest(manager, instance, `/Resources/${encodeURIComponent(resource)}`, { method, body: JSON.stringify(payload) });
    } catch (error) {
      throw new Error(`${what}: ${error instanceof Error ? error.message : String(error)}. Nothing was changed.`);
    }
    if (!response.ok) {
      const allowed = allowedMethods(response);
      // a remembered method that stopped working is forgotten, so the next save asks again
      if (response.status === 405) await globalState?.update(methodKey(instance), undefined);
      throw new Error(response.status === 404 || response.status === 405
        ? `This instance doesn't accept changes to resources at /Resources/${resource} with ${method} (${response.status}${allowed ? `; it allows ${allowed}` : ""}). Nothing was changed.`
        : `${what} (${method}): ${response.status} ${response.statusText}. Nothing was changed.`);
    }
    const reply = await response.json().catch(() => null);
    if (reply?.status === "FAILURE") throw new Error(`${what}: ${typeof reply.message === "string" ? reply.message : "the instance refused"}. Nothing was changed.`);
    return reply;
  }

  /** The id of a record a reply looks like it created ({data: {id: "application-…"}}), or null. */
  function createdRecordId(reply) {
    const data = reply?.data;
    return isObject(data) && typeof data.id === "string" && data.id ? data.id : null;
  }

  /** Writes nextData over the current definition (backed up first) and checks the result. */
  async function writeChecked(manager, instance, resource, current, nextData) {
    const backupFile = await backup(instance, resource, current.body);
    const method = await saveMethod(manager, instance, resource);
    const remembered = globalState?.get(shapeKey(instance));
    const shapes = remembered === "body" ? ["body", "data"] : ["data", "body"];
    let after = current, recordId = null;
    for (const shape of shapes) {
      const reply = await write(manager, instance, resource, method, shape === "data" ? nextData : { ...current.body, data: nextData });
      after = await readResource(manager, instance, resource);
      if (!differences(nextData, after.data).length) {
        await globalState?.update(shapeKey(instance), shape);
        await globalState?.update(methodKey(instance), method);
        return { ok: true, backup: backupFile.fsPath, data: after.data };
      }
      // taken but changed something else: stop, don't write again
      if (differences(current.data, after.data).length) break;
      // nothing changed, and the reply looks like a new record: that's what this address does with
      // a POST, so stop rather than make another
      recordId = createdRecordId(reply);
      if (recordId) break;
      // taken but nothing changed: try the other shape once
    }
    const unchanged = differences(current.data, after.data).length === 0;
    const wrong = differences(nextData, after.data);
    return {
      ok: false,
      backup: backupFile.fsPath,
      data: after.data,
      unchanged,
      message: unchanged && recordId
        ? `The instance answered the ${method} as if it created a record (${recordId}) — the resource's properties are unchanged. That record may need deleting in Saturn.`
        : unchanged
          ? `The instance took the ${method}, but the resource is unchanged: it doesn't seem to take changes this way.`
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
        if (!changes.length) return post("saveFailed", { resource, message: "Nothing to save." });
        // the definition as it is now, not as the screen first read it
        const current = await readResource(manager, instance, resource);
        const nextData = applyRequired(current.data, changes);
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

  /** At command registration: where backups go, and where the working save shape is remembered. */
  function attach(options) {
    storageUri = options.globalStorageUri ?? null;
    globalState = options.globalState ?? null;
  }

  return { open, attach, handle, propertiesOf, applyRequired, differences, entriesOf };
})();
