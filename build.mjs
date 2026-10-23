// Builds the whole extension into out/vsix/ (the unpacked .vsix):
//   - the node view, System Logs and Resources webviews (esbuild) -> dist/nodeview.js, dist/logs.js,
//     dist/resources.js, copied to extension/dist/webview/{nodeview,logs,resources}/index.js
//   - the extension host: host/extension.js + host/syslogs.js + host/resources.js -> extension/dist/extension.js
//   - everything else from vsix/ (manifest, package.json, readme, icon, the other webviews, the MCP server);
//     the webviews' JS/CSS and the MCP server are minified on the way
//   - the version, from the newest src/changelog.ts entry, stamped into package.json and the manifest
// `node build.mjs --min` minifies the two webviews. package.sh zips out/vsix into a .vsix.
import { build, transform } from "esbuild";
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";

const common = {
  bundle: true,
  format: "iife",
  minify: process.argv.includes("--min"),
  target: "es2020",
  jsx: "automatic",
  loader: { ".css": "text" },
  define: { "process.env.NODE_ENV": '"production"' },
  logLevel: "warning",
};
await build({ ...common, entryPoints: ["src/main.tsx"], outfile: "dist/nodeview.js" });
await build({ ...common, entryPoints: ["src-logs/main.tsx"], outfile: "dist/logs.js" });
await build({ ...common, entryPoints: ["src-res/main.tsx"], outfile: "dist/resources.js" });
await build({ ...common, entryPoints: ["src-menus/main.tsx"], outfile: "dist/menus.js" });
await build({ ...common, entryPoints: ["src-news/main.tsx"], outfile: "dist/news.js" });
await build({ ...common, entryPoints: ["src-keys/main.tsx"], outfile: "dist/keys.js" });

const version = /version:\s*"(\d+\.\d+\.\d+)"/.exec(readFileSync("src/changelog.ts", "utf8"))?.[1];
if (!version) throw new Error("no version in src/changelog.ts");

// the shipped files build.mjs doesn't make: a clone missing any of them would package a broken
// extension (0.3.10/0.3.11 went out with a blank sidebar when git ignored vsix/extension/dist)
const shipped = ["dist/mcp/saturn-mcp.js", "dist/webview/preview/index.js",
  ...["workflows", "sidebar", "pages", "agent", "kanban"].flatMap((w) => [`dist/webview/${w}/index.js`, `dist/webview/${w}/index.css`])];
const missing = shipped.filter((f) => !existsSync(`vsix/extension/${f}`));
if (missing.length) throw new Error(`missing from vsix/extension: ${missing.join(", ")}`);

const out = "out/vsix";
rmSync(out, { recursive: true, force: true });
cpSync("vsix", out, { recursive: true });
const ext = `${out}/extension`;
for (const [name, file] of [["nodeview", "dist/nodeview.js"], ["logs", "dist/logs.js"], ["resources", "dist/resources.js"], ["menus", "dist/menus.js"], ["news", "dist/news.js"], ["keys", "dist/keys.js"]]) {
  mkdirSync(`${ext}/dist/webview/${name}`, { recursive: true });
  cpSync(file, `${ext}/dist/webview/${name}/index.js`);
}
// the Menus panel's page links an index.css; the new screen's styles are inside its index.js
writeFileSync(`${ext}/dist/webview/menus/index.css`, "/* The Menus screen's styles are in index.js. */\n");
// the shipped webviews and the MCP server are kept readable in vsix/; they go into the package
// minified (names and whitespace only, licence notices kept). package.sh proves with
// tools/same-code.mjs that each minified file is the same program as its readable source.
for (const f of shipped) {
  const file = `${ext}/${f}`;
  const css = f.endsWith(".css");
  const { code } = await transform(readFileSync(file, "utf8"), css
    ? { loader: "css", minify: true, legalComments: "inline" }
    : { loader: "js", minifyWhitespace: true, minifyIdentifiers: true, legalComments: "eof" });
  writeFileSync(file, code);
}
// one scope: syslogs.js, resources.js and whatsnew.js use extension.js's helpers (listRecords, saturnRequest, …)
writeFileSync(`${ext}/dist/extension.js`, ["host/extension.js", "host/syslogs.js", "host/resources.js", "host/whatsnew.js", "host/shortcuts.js"].map((f) => readFileSync(f, "utf8")).join("\n"));

const pj = JSON.parse(readFileSync(`${ext}/package.json`, "utf8"));
pj.version = version;
writeFileSync(`${ext}/package.json`, JSON.stringify(pj, null, "\t") + "\n");
const manifest = readFileSync(`${out}/extension.vsixmanifest`, "utf8");
const stamped = manifest.replace(/(<Identity\b[^>]*\bVersion=")[^"]*(")/, `$1${version}$2`);
if (stamped === manifest && !manifest.includes(`Version="${version}"`)) throw new Error("no Identity Version in extension.vsixmanifest");
writeFileSync(`${out}/extension.vsixmanifest`, stamped);

console.log(`built ${version} -> ${out}`);
