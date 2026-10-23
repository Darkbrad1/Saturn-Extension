// The browser-test server: http://localhost:8765 serving harness/, our two
// webviews (dist/) and the real list view and sidebar (vsix/) under the names
// the tests use. Run `node build.mjs` first, then `node tools/serve.mjs` and,
// in another terminal, e.g. `node test9.mjs`.
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const MAP = {
  "/nodeview.js": "dist/nodeview.js",
  "/logs.js": "dist/logs.js",
  "/resources.js": "dist/resources.js",
  "/menus.js": "dist/menus.js",
  "/news.js": "dist/news.js",
  "/keys.js": "dist/keys.js",
  "/wf.js": "vsix/extension/dist/webview/workflows/index.js",
  "/wf.css": "vsix/extension/dist/webview/workflows/index.css",
  "/sidebar.js": "vsix/extension/dist/webview/sidebar/index.js",
  "/sidebar.css": "vsix/extension/dist/webview/sidebar/index.css",
  "/index.html": "harness/csp.html",
};
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json" };
const port = Number(process.env.PORT ?? 8765);
createServer(async (req, res) => {
  const path = decodeURIComponent(new URL(req.url, "http://x").pathname);
  const rel = MAP[path] ?? join("harness", normalize(path).replace(/^(\.\.[/\\])+/, ""));
  try {
    const body = await readFile(join(root, rel));
    res.writeHead(200, { "content-type": TYPES[extname(rel)] ?? "application/octet-stream" });
    res.end(body);
  } catch {
    res.writeHead(404).end("not found");
  }
}).listen(port, () => console.log(`serving the test harness on http://localhost:${port}`));
