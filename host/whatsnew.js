// What's new (added by this project): Sonover Code's release notes on their own page, a webview tab opened by the
// sidebar's What's new button (saturn:openWhatsNew) or the "Saturn: What's new" command (saturn.openWhatsNew). The
// page (src-news/, built to dist/webview/news/index.js) carries the notes itself, so it needs no messages.
// Appended after resources.js in the built extension.js, so it shares extension.js's scope (nonce, setPanelIcon, …).
var WhatsNewHost = (() => {
  const vs = require("vscode");
  let current = null;

  function html(panel, extensionUri) {
    const w = panel.webview;
    const js = w.asWebviewUri(vs.Uri.joinPath(extensionUri, "dist", "webview", "news", "index.js"));
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
    <div id="news-root"></div>
    <script type="module" nonce="${cspNonce}" src="${js}"></script>
</body>
</html>`;
  }

  /** Opens the page, or brings the open one to the front (there is only ever one). */
  function open(extensionUri) {
    if (current) {
      current.reveal();
      return current;
    }
    const panel = vs.window.createWebviewPanel("saturn.whatsNew", "What's new", vs.ViewColumn.One, {
      enableScripts: true,
      localResourceRoots: [vs.Uri.joinPath(extensionUri, "dist")],
    });
    try { setPanelIcon(panel, "megaphone"); } catch {}
    panel.webview.html = html(panel, extensionUri);
    panel.onDidDispose(() => { current = null; });
    current = panel;
    return panel;
  }

  return { open, html };
})();
