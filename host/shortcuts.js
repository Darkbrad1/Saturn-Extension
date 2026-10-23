// Keyboard shortcuts (added by this project, 0.3.53): the keys you picked on the Keyboard shortcuts page, kept in
// globalState "saturn.shortcuts" ({id: [combo, …]}; a shortcut not in it uses its default, src/keys.ts) and sent to
// every screen that asks (fetchShortcuts → shortcuts {bindings}); a change goes to all of them at once. The page
// (src-keys/, built to dist/webview/keys/index.js) opens from the sidebar's Keyboard shortcuts button
// (saturn:openShortcuts) or the "Saturn: Keyboard shortcuts" command (saturn.openShortcuts).
// Appended after whatsnew.js in the built extension.js, so it shares extension.js's scope (nonce, setPanelIcon, …).
var ShortcutsHost = (() => {
  const vs = require("vscode");
  const KEY = "saturn.shortcuts";
  let state = null;
  let current = null;
  // every screen that asked for the shortcuts, so a change reaches them all
  const screens = new Set();

  function attach(options) {
    state = options.globalState ?? null;
  }

  /** The keys you picked, {id: [combo, …]} ({} when none). */
  function get() {
    const stored = state?.get(KEY);
    return stored && typeof stored === "object" && !Array.isArray(stored) ? stored : {};
  }

  /** Only {id: [combo, …]}: ids made of letters, digits, dots and dashes; up to 5 combos of up to 40 characters. */
  function clean(bindings) {
    const out = {};
    if (!bindings || typeof bindings !== "object" || Array.isArray(bindings)) return out;
    for (const [id, keys] of Object.entries(bindings)) {
      if (!/^[a-z][a-z0-9.-]{0,60}$/i.test(id) || !Array.isArray(keys)) continue;
      out[id] = keys.filter((k) => typeof k === "string" && k.length > 0 && k.length <= 40).slice(0, 5);
    }
    return out;
  }

  /** Sends the shortcuts to one screen (and remembers it, for changes). */
  function send(webview) {
    screens.add(webview);
    post(webview);
  }
  function post(webview) {
    try {
      Promise.resolve(webview.postMessage({ type: "shortcuts", payload: { bindings: get() } })).catch(() => screens.delete(webview));
    } catch {
      screens.delete(webview);
    }
  }

  /** Keeps new keys and sends them to every screen. */
  async function set(bindings) {
    await state?.update(KEY, clean(bindings));
    for (const w of screens) post(w);
  }

  function html(panel, extensionUri) {
    const w = panel.webview;
    const js = w.asWebviewUri(vs.Uri.joinPath(extensionUri, "dist", "webview", "keys", "index.js"));
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
    <div id="keys-root"></div>
    <script type="module" nonce="${cspNonce}" src="${js}"></script>
</body>
</html>`;
  }

  /** Answers the page's messages: fetchShortcuts, setShortcuts {bindings}. */
  async function handle(webview, message) {
    if (message?.type === "fetchShortcuts") send(webview);
    if (message?.type === "setShortcuts") await set(message.payload?.bindings);
  }

  /** Opens the page, or brings the open one to the front. */
  function open(extensionUri) {
    if (current) {
      current.reveal();
      return current;
    }
    const panel = vs.window.createWebviewPanel("saturn.shortcuts", "Keyboard shortcuts", vs.ViewColumn.One, {
      enableScripts: true,
      localResourceRoots: [vs.Uri.joinPath(extensionUri, "dist")],
    });
    try { setPanelIcon(panel, "keyboard"); } catch {}
    panel.webview.onDidReceiveMessage((m) => handle(panel.webview, m));
    panel.webview.html = html(panel, extensionUri);
    panel.onDidDispose(() => { screens.delete(panel.webview); current = null; });
    current = panel;
    return panel;
  }

  return { attach, get, set, send, clean, handle, open, html, screens };
})();
