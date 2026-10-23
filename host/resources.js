/* Resource properties: pick a resource, see its properties, change any of their settings, add
 * new ones, and reorder them.
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
 *   3. write it with only what was asked changed: the settings the screen changed (each at its
 *      path in the property, on the definition as just re-read), new properties, the
 *      properties left out (removed), the properties' order (the schema's order is the order
 *      the map is sent in) and/or new keys;
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
  let extensionRoot = null;
  // instance id -> the resource to open the screen on (asked before the screen was made)
  const pendingShow = new Map();
  // a code setting opened as a file ("Open in a file"): file uri -> {instanceId, resource, id, path}
  const codeFiles = new Map();
  let codeSaveSub = null;

  /** A file's name part: letters, digits, dot, dash and underscore only. */
  const safeName = (text) => String(text).replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80) || "_";

  /** Opens one property's code setting as a file beside the screen; saving the file sends its text back to the
   *  screen (codeFromFile), as an unsaved change there, like typing it. Nothing goes to Saturn until Save. */
  async function openCode(instance, payload) {
    const { resource, id, path, language, text } = payload ?? {};
    if (typeof resource !== "string" || !resource || typeof id !== "string" || !id) throw new Error("Pick one property to open its code.");
    if (!Array.isArray(path) || !path.length || !path.every((part) => typeof part === "string" && part && !["__proto__", "constructor", "prototype"].includes(part)) || ["key", "label", "type"].includes(path[0]))
      throw new Error("That setting can't be opened as a file.");
    if (!storageUri) throw new Error("The extension has no storage folder to put the file in.");
    const ext = language === "html" ? "html" : "js";
    const folder = vs.Uri.joinPath(storageUri, "resource-code", safeName(instance.id), safeName(resource));
    const file = vs.Uri.joinPath(folder, `${safeName(id)}.${safeName(path.join("."))}.${ext}`);
    await vs.workspace.fs.createDirectory(folder);
    await vs.workspace.fs.writeFile(file, new TextEncoder().encode(typeof text === "string" ? text : ""));
    codeFiles.set(file.toString(), { instanceId: instance.id, resource, id, path });
    if (!codeSaveSub)
      codeSaveSub = vs.workspace.onDidSaveTextDocument((document) => {
        const target = codeFiles.get(document.uri.toString());
        if (!target) return;
        const panel = panels.get(target.instanceId);
        if (!panel) {
          vs.window.showWarningMessage(`The Resources screen is closed, so ${target.resource}'s ${target.id} wasn't changed. Open it again and use Open in a file.`);
          return;
        }
        panel.webview.postMessage({ type: "codeFromFile", payload: { resource: target.resource, id: target.id, path: target.path, text: document.getText() } });
      });
    const document = await vs.workspace.openTextDocument(file);
    await vs.window.showTextDocument(document, { viewColumn: vs.ViewColumn.Beside, preview: false });
    vs.window.setStatusBarMessage(`$(edit) ${resource}.${id}: save this file to put it in the Resources screen (then Save there)`, 6000);
  }

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

  /** Path parts that must never be written: they would reach into Object.prototype. */
  const UNSAFE = new Set(["__proto__", "prototype", "constructor"]);

  /** A copy of `target` with `value` set at `path` (objects on the way are copied, missing ones
   *  made), or with the last part removed when `remove` is set. */
  function setAt(target, path, value, remove) {
    const copy = isObject(target) ? { ...target } : {};
    const [head, ...rest] = path;
    if (!rest.length) {
      if (remove) delete copy[head];
      else copy[head] = value;
      return copy;
    }
    copy[head] = setAt(copy[head], rest, value, remove);
    return copy;
  }

  /** One change from the screen in its long form: {key, path, value} or {key, path, remove}.
   *  The short form {key, required} (the first version of this screen) is path ["required"]. */
  function normalChange(change) {
    if (Array.isArray(change.path)) return { key: change.key, path: change.path.map(String), value: change.value, remove: change.remove === true };
    return { key: change.key, path: ["required"], value: !!change.required, remove: false };
  }

  /** changes: [{key, path, value | remove}] -> the data with only those settings changed, or an
   *  error message. Each change is made on the definition as it is now (just re-read), so a
   *  setting someone else changed meanwhile is kept unless this screen changed the same one. */
  function applyChanges(data, changes) {
    const wanted = changes.map(normalChange);
    const present = new Map(entriesOf(data));
    for (const change of wanted) {
      if (!present.has(change.key)) return `${change.key} is no longer a property of this resource — reload and try again.`;
      if (!isObject(present.get(change.key))) return `${change.key} can't be changed here.`;
      if (!change.path.length || change.path.some((part) => UNSAFE.has(part))) return `A change to ${change.key} has a path that can't be written.`;
      if (change.path[0] === "key") return `A property's key can't be changed here (${change.key}).`;
    }
    const changed = new Map();
    for (const change of wanted) changed.set(change.key, setAt(changed.get(change.key) ?? present.get(change.key), change.path, change.value, change.remove));
    return Array.isArray(data)
      ? data.map((property) => (isObject(property) && changed.has(property.key) ? changed.get(property.key) : property))
      : Object.fromEntries(Object.entries(data).map(([key, property]) => [key, changed.get(key) ?? property]));
  }

  /** The first version's name for applyChanges (changes: [{key, required}]). */
  const applyRequired = applyChanges;

  /** What a property key may look like: a letter or _, then letters, digits and _. */
  const KEY_PATTERN = /^[A-Za-z_][A-Za-z0-9_]*$/;

  /** A new property with the settings Saturn's own app gives one (seen in its save of a new
   *  property), with this label and type. */
  function newProperty(label, type) {
    const look = { component: "default", options: { size: "small", shape: "circle", opacity: 0.2 } };
    return {
      type,
      meta_tags: [],
      defaults: { read: type === "number" ? 0 : type === "boolean" ? false : "", write: "" },
      label,
      required: false,
      searchable: false,
      unique: false,
      hideInTable: false,
      hideInForm: false,
      hideInView: false,
      hideInDrawer: false,
      ipaddress: false,
      hide: false,
      email: false,
      tableColumnWidth: 0,
      placeInOwnTab: false,
      map_label_type: "property",
      source: "static",
      access_control: {},
      number_of_columns: { full_width: false, default: 1 },
      form_number_of_columns: { full_width: false, default: 1 },
      required_columns: [],
      rendering: { ...look, _variances: { list: { ...look }, view: { ...look, span: 2 }, form: {} } },
      default_view: "SLKJDSF",
      views: [{ id: "SLKJDSF", view: "data_table", details: {} }],
      input_properties: { type: type === "boolean" ? "switch" : "input", options: { code: "<template></template> " } },
    };
  }

  /** adds: [{key, property}] -> the data with those properties added at the end, or an error
   *  message (a key that's taken or not a valid key). A property sent without settings gets
   *  Saturn's defaults (newProperty). */
  function applyAdds(data, adds) {
    const keys = new Set(keysOf(data));
    const out = Array.isArray(data) ? [...data] : { ...data };
    for (const add of adds) {
      const key = String(add?.key ?? "");
      if (!KEY_PATTERN.test(key)) return `"${key}" can't be a property key: use letters, digits and _, starting with a letter.`;
      if (keys.has(key)) return `${key} is already a property of this resource — pick another key.`;
      keys.add(key);
      const given = isObject(add.property) ? add.property : {};
      if (Object.keys(given).some((part) => UNSAFE.has(part))) return `The new property ${key} has a setting that can't be written.`;
      const property = { ...newProperty(typeof given.label === "string" && given.label ? given.label : key, typeof given.type === "string" ? given.type : "string"), ...given };
      delete property.key;
      if (Array.isArray(out)) out.push({ ...property, key });
      else out[key] = property;
    }
    return out;
  }

  /** removes: [key] -> the data without those properties. The save leaves them out of the schema
   *  (the same whole-schema PUT, never a DELETE request); the backup keeps them. A key that's
   *  already gone is skipped. */
  function applyRemoves(data, removes) {
    const gone = new Set(removes.map(String));
    return Array.isArray(data)
      ? data.filter((property) => !(isObject(property) && gone.has(property.key)))
      : Object.fromEntries(Object.entries(data).filter(([key]) => !gone.has(key)));
  }

  /** renames: [{from, to}] -> the data with those properties' keys changed (each keeps its place
   *  and its settings), or an error message: a property that's gone, a key that isn't a key, or
   *  one another property has. Done last, after the other changes, which name the old keys. */
  function applyRenames(data, renames) {
    const keys = keysOf(data);
    const to = new Map();
    for (const rename of renames) {
      const from = String(rename?.from ?? ""), next = String(rename?.to ?? "");
      if (!keys.includes(from)) return `${from} is no longer a property of this resource — reload and try again.`;
      if (!KEY_PATTERN.test(next)) return `"${next}" can't be a property key: use letters, digits and _, starting with a letter.`;
      to.set(from, next);
    }
    const after = keys.map((key) => to.get(key) ?? key);
    if (new Set(after).size !== after.length) return "Two properties would have the same key. Pick another key.";
    return Array.isArray(data)
      ? data.map((property) => (isObject(property) && to.has(property.key) ? { ...property, key: to.get(property.key) } : property))
      : Object.fromEntries(Object.entries(data).map(([key, property]) => [to.get(key) ?? key, property]));
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

  /** Whether `actual` has every setting `expected` has, with the same values (it may have more). */
  function covers(expected, actual) {
    if (!isObject(expected) || !isObject(actual)) return jsonDeepEqual(expected, actual);
    return Object.keys(expected).every((part) => covers(expected[part], actual[part]));
  }

  /** The keys of the properties that differ between two definitions. Properties named in
   *  `added` only need to have what was sent: the instance may fill in more settings. */
  function differences(expected, actual, added = new Set()) {
    const left = new Map(entriesOf(expected));
    const right = new Map(entriesOf(actual));
    return [...new Set([...left.keys(), ...right.keys()])].filter((key) =>
      added.has(key) && right.has(key) ? !covers(left.get(key), right.get(key)) : !jsonDeepEqual(left.get(key), right.get(key)));
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
  async function writeChecked(manager, instance, resource, current, nextData, added = new Set()) {
    const backupFile = await backup(instance, resource, current.body);
    const reply = await write(manager, instance, resource, nextData);
    const after = await readResource(manager, instance, resource);
    const wrong = differences(nextData, after.data, added);
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

  // ── Resource settings: the resource's ResourceDetail record (GET /resourceDetails/<id>) ──
  // Only these keys are written (PUT /resourceDetails/<id> with just them, like saveLifecycleHooks);
  // drawer_enabled is also written into render_details, where Saturn keeps a copy of it.
  const SETTING_KEYS = ["sections", "description", "drawer_enabled"];
  // keys on the record that are about who's reading, not the record
  const SERVER_KEYS = new Set(["_permissions_", "field_restrictions"]);

  /** The record from a GET answer ({data: record} or the record itself). */
  const recordOf = (body) => (isObject(body?.data) ? body.data : isObject(body) ? body : null);

  /** The resource's ResourceDetail record: {detail} | {problem}. */
  async function findDetail(manager, instance, resource) {
    const listed = await listResourceDetails(manager, instance);
    const rows = (Array.isArray(listed) ? listed : Array.isArray(listed?.data) ? listed.data : []).filter((d) => typeof d?.resource === "string" && d.resource.toLowerCase() === resource.toLowerCase());
    if (!rows.length) return { problem: `${resource} has no ResourceDetail record on this instance, so it has no settings to change here.` };
    if (rows.length > 1) return { problem: `${resource} has ${rows.length} ResourceDetail records. Which one Saturn uses can't be told from here, so its settings aren't changed here. Sort the extra one out on the instance first.` };
    if (typeof rows[0].id !== "string" || !rows[0].id) return { problem: `${resource}'s ResourceDetail record has no id to save to.` };
    return { detail: await readDetail(manager, instance, rows[0].id) };
  }

  /** One ResourceDetail record, read now. */
  async function readDetail(manager, instance, id) {
    const response = await checked(() => saturnRequest(manager, instance, `${RESOURCE_DETAILS}/${encodeURIComponent(id)}`), "Read resource settings");
    if (!response.ok) throw new Error(`Read resource settings: ${response.status} ${response.statusText}`);
    const detail = recordOf(await response.json());
    if (!detail) throw new Error("Read resource settings: the instance sent no record.");
    return detail;
  }

  /** The record as the screen gets it (without the reader's permissions). */
  const shownDetail = (detail) => Object.fromEntries(Object.entries(detail).filter(([k]) => !SERVER_KEYS.has(k)));

  /** Why a settings change can't be saved, or null. Sections: [{name, description, number_of_columns,
   *  placeInTab, properties: [keys]}] (other keys a section has are kept as sent). */
  function settingsProblem(changes) {
    if (!isObject(changes)) return "Nothing to save.";
    const keys = Object.keys(changes);
    if (!keys.length) return "Nothing to save.";
    const other = keys.find((k) => !SETTING_KEYS.includes(k));
    if (other) return `${other} can't be changed here.`;
    if ("description" in changes && typeof changes.description !== "string") return "The description must be text.";
    if ("drawer_enabled" in changes && typeof changes.drawer_enabled !== "boolean") return "Open records in a drawer must be on or off.";
    if ("sections" in changes) {
      if (!Array.isArray(changes.sections)) return "Sections must be a list.";
      for (const [i, s] of changes.sections.entries()) {
        const n = `Section ${i + 1}`;
        if (!isObject(s)) return `${n} isn't a section.`;
        if (typeof s.name !== "string" || !s.name.trim()) return `${n} needs a name.`;
        if ("description" in s && typeof s.description !== "string") return `${n}: the description must be text.`;
        if (!Number.isInteger(s.number_of_columns) || s.number_of_columns < 1) return `${n}: the columns must be a whole number, 1 or more.`;
        if ("placeInTab" in s && typeof s.placeInTab !== "boolean") return `${n}: own tab must be on or off.`;
        if (!Array.isArray(s.properties) || !s.properties.every((k) => typeof k === "string")) return `${n}: the properties must be a list of keys.`;
      }
    }
    return null;
  }

  /** The body to PUT: only the keys asked for (render_details with its drawer_enabled updated). */
  function settingsBody(current, changes) {
    const body = {};
    for (const k of SETTING_KEYS) if (k in changes) body[k] = changes[k];
    if ("drawer_enabled" in changes) body.render_details = { ...(isObject(current.render_details) ? current.render_details : {}), drawer_enabled: changes.drawer_enabled };
    return body;
  }

  /** Re-reads the record, backs it up, PUTs only the changed keys, reads it back and compares. */
  async function saveSettings(manager, instance, resource, id, changes) {
    const problem = settingsProblem(changes);
    if (problem) return { ok: false, failed: true, message: problem };
    const current = await readDetail(manager, instance, id);
    if (typeof current.resource !== "string" || current.resource.toLowerCase() !== resource.toLowerCase()) return { ok: false, failed: true, message: "That settings record is for another resource. Nothing was changed." };
    const body = settingsBody(current, changes);
    const backupFile = await backup(instance, `${resource}-settings`, current);
    const what = `Save ${resource}'s settings`;
    let response;
    try {
      response = await saturnRequest(manager, instance, `${RESOURCE_DETAILS}/${encodeURIComponent(id)}`, { method: "PUT", body: JSON.stringify(body) });
    } catch (error) {
      return { ok: false, failed: true, message: `${what}: ${error instanceof Error ? error.message : String(error)}. Nothing was changed.` };
    }
    if (!response.ok) return { ok: false, failed: true, message: `${what}: ${response.status} ${response.statusText}. Nothing was changed.` };
    const reply = await response.json().catch(() => null);
    if (reply?.status === "FAILURE") return { ok: false, failed: true, message: `${what}: ${typeof reply.message === "string" ? reply.message : "the instance refused"}. Nothing was changed.` };
    const after = await readDetail(manager, instance, id);
    // the instance may add settings of its own (to the record, or to a section), so only what was sent is checked
    const kept = (sent, got) => (Array.isArray(sent) ? Array.isArray(got) && sent.length === got.length && sent.every((x, i) => kept(x, got[i])) : covers(sent, got));
    const wrong = Object.keys(body).filter((k) => !kept(body[k], after[k]));
    if (!wrong.length) return { ok: true, backup: backupFile.fsPath, detail: after };
    const untouched = wrong.every((k) => jsonDeepEqual(current[k], after[k]));
    return {
      ok: false,
      backup: backupFile.fsPath,
      detail: after,
      unchanged: untouched,
      message: untouched
        ? `The instance answered but didn't keep the change to ${wrong.join(", ")}. Nothing was changed.`
        : `The settings came back different from what was sent, in: ${wrong.join(", ")}. The old record is backed up at ${backupFile.fsPath}.`,
    };
  }

  /** Answers one message from the screen; `post` sends the reply. Also used by the host tests. */
  async function handle(manager, instance, message, post) {
    const payload = (message && message.payload) || {};
    switch (message && message.type) {
      case "init": {
        const names = (await listResourceNames(manager, instance)).slice().sort((a, b) => a.localeCompare(b));
        // which of them are Saturn's own (core) resources, so the picker lists the others first;
        // null when the instance's catalog can't be read (then it's one list)
        const core = await coreResourceNames(manager, instance);
        const show = pendingShow.get(instance.id) ?? null;
        pendingShow.delete(instance.id);
        post("init", { instanceName: instanceLabel(instance), resources: names, core: core ? names.filter((n) => core.has(n)) : null, show });
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
        // adds: new properties [{key, property}], added at the end (then placed by `order`)
        const adds = Array.isArray(payload.adds) ? payload.adds.filter((a) => a && typeof a.key === "string") : [];
        // order: every property key in the new order (sent only when the order was changed)
        const order = Array.isArray(payload.order) && payload.order.every((k) => typeof k === "string") ? payload.order : null;
        // renames: [{from, to}], a property's key changed (applied last)
        const renames = Array.isArray(payload.renames) ? payload.renames.filter((r) => r && typeof r.from === "string" && typeof r.to === "string" && r.from !== r.to) : [];
        // removes: the keys of properties to take out of the schema
        const removes = Array.isArray(payload.removes) ? payload.removes.filter((k) => typeof k === "string") : [];
        if (!changes.length && !adds.length && !order && !renames.length && !removes.length) return post("saveFailed", { resource, message: "Nothing to save." });
        // the definition as it is now, not as the screen first read it
        const current = await readResource(manager, instance, resource);
        let nextData = applyChanges(current.data, changes);
        if (typeof nextData === "string") return post("saveFailed", { resource, message: nextData });
        if (adds.length) nextData = applyAdds(nextData, adds);
        if (typeof nextData === "string") return post("saveFailed", { resource, message: nextData });
        if (removes.length) nextData = applyRemoves(nextData, removes);
        if (order) nextData = applyOrder(nextData, order);
        if (typeof nextData === "string") return post("saveFailed", { resource, message: nextData });
        if (renames.length) nextData = applyRenames(nextData, renames);
        if (typeof nextData === "string") return post("saveFailed", { resource, message: nextData });
        const result = await writeChecked(manager, instance, resource, current, nextData, new Set(adds.map((a) => a.key)));
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
      // the resource's own settings (its ResourceDetail record)
      case "settings": {
        const resource = String(payload.resource);
        const found = await findDetail(manager, instance, resource);
        post("settings", found.detail ? { resource, id: found.detail.id, detail: shownDetail(found.detail) } : { resource, problem: found.problem });
        break;
      }
      case "saveSettings": {
        const resource = String(payload.resource);
        const result = await saveSettings(manager, instance, resource, String(payload.id), payload.changes);
        if (result.failed) return post("saveFailed", { resource, message: result.message });
        post(result.ok ? "settingsSaved" : "settingsMismatch", { resource, id: String(payload.id), backup: result.backup, unchanged: result.unchanged, message: result.message, detail: shownDetail(result.detail) });
        break;
      }
      case "fields": {
        // another resource's properties, for the settings that name one (map, source, lookups)
        const resource = String(payload.resource);
        const { data } = await readResource(manager, instance, resource);
        post("fields", { resource, fields: entriesOf(data).filter(([key]) => !key.startsWith("#")).map(([key, property]) => ({ key, label: isObject(property) && typeof property.label === "string" ? property.label : null, type: isObject(property) && typeof property.type === "string" ? property.type : null })) });
        break;
      }
      case "options": {
        // records of a core resource as [value, label], for settings that name one (attachment groups)
        const resource = String(payload.resource);
        const rows = await listLookupOptions(manager, instance, resource, String(payload.value || "id"), String(payload.label || "name")).catch(() => []);
        post("options", { resource, value: payload.value, label: payload.label, options: rows.map((row) => [row.value, row.label]) });
        break;
      }
      case "workflows": {
        // the workflows linked to a resource: its ResourceDetail's workflow, and the workflows its
        // lifecycle hooks run (create, update, …), with their names
        const resource = String(payload.resource);
        const bindings = bindingsFromResourceDetails(await listResourceDetails(manager, instance)).filter((b) => b.resource.toLowerCase() === resource.toLowerCase());
        const linked = new Map();
        for (const b of bindings) {
          if (b.workflowId) linked.set(b.workflowId, { id: b.workflowId, via: "workflow", hooks: [] });
          for (const group of b.hooks) for (const entry of group.entries) {
            if (!entry.workflowId) continue;
            const item = linked.get(entry.workflowId) ?? { id: entry.workflowId, via: "hook", hooks: [] };
            item.hooks.push(`${group.when} ${group.op}`);
            linked.set(entry.workflowId, item);
          }
        }
        let names = new Map();
        try {
          const body = await listWorkflows(manager, instance);
          for (const w of asArray(Array.isArray(body) ? body : body?.data)) if (w?.id) names.set(w.id, nonEmptyString(w.name) ?? w.id);
        } catch {}
        post("workflows", { resource, workflows: [...linked.values()].map((w) => ({ ...w, name: names.get(w.id) ?? w.id, hooks: [...new Set(w.hooks)] })) });
        break;
      }
      case "openWorkflow": {
        // opens the Workflows screen on that workflow
        if (extensionRoot && storageUri) WorkflowsPanel.showWorkflow(extensionRoot, storageUri, manager, instance, String(payload.workflowId));
        break;
      }
      case "subjects": {
        // the user groups, users and permissions an access rule can name
        post("subjects", await loadAccessSubjects(manager, instance));
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
      // a code setting (like an inline component) in its own editor tab
      case "openCode": {
        await openCode(instance, payload);
        break;
      }
      // The resource's page in Saturn's web app: <instance url>/resources/<name>.
      case "openInSaturn": {
        const resource = message.payload?.resource;
        if (typeof resource !== "string" || !resource || /[\/?#]/.test(resource)) break;
        await vs.env.openExternal(vs.Uri.parse(`${String(instance.url).replace(/\/+$/, "")}/resources/${encodeURIComponent(resource)}`));
        break;
      }
      // some JSON (a resource's settings record) in an untitled, read-only-ish editor tab beside the screen
      case "viewRaw": {
        const doc = await vs.workspace.openTextDocument({ content: String(payload.text ?? ""), language: "json" });
        await vs.window.showTextDocument(doc, { preview: true, viewColumn: vs.ViewColumn.Beside });
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

  /** Opens the instance's Resources screen; `show` opens it on that resource (a mapped form field's chip on the
   *  Workflows screen). A screen that's just been made picks it up in its init. */
  function open(extensionUri, manager, instance, show = null) {
    extensionRoot = extensionUri;
    if (show) pendingShow.set(instance.id, show);
    const existing = panels.get(instance.id);
    if (existing) {
      if (show) { pendingShow.delete(instance.id); existing.webview.postMessage({ type: "show", payload: { resource: show } }); }
      return existing.reveal();
    }
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
        post(message?.type === "save" || message?.type === "restore" || message?.type === "saveSettings" ? "saveFailed" : "failed", {
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

  return { open, attach, handle, openCode, codeFiles, settingsProblem, settingsBody, propertiesOf, applyChanges, applyRequired, applyAdds, applyOrder, applyRemoves, applyRenames, newProperty, differences, entriesOf };
})();
