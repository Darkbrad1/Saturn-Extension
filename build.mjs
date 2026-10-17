// Builds the whole extension into out/vsix/ (the unpacked .vsix):
//   - the node view and System Logs webviews (esbuild) -> dist/nodeview.js, dist/logs.js,
//     copied to extension/dist/webview/{nodeview,logs}/index.js
//   - the extension host: host/extension.js + host/syslogs.js -> extension/dist/extension.js
//   - everything else from vsix/ (manifest, package.json, readme, icon, the other webviews, the MCP server)
//   - the version, from the newest src/changelog.ts entry, stamped into package.json and the manifest
// `node build.mjs --min` minifies the two webviews. package.sh zips out/vsix into a .vsix.
import { build } from "esbuild";
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";

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

const version = /version:\s*"(\d+\.\d+\.\d+)"/.exec(readFileSync("src/changelog.ts", "utf8"))?.[1];
if (!version) throw new Error("no version in src/changelog.ts");

const out = "out/vsix";
rmSync(out, { recursive: true, force: true });
cpSync("vsix", out, { recursive: true });
const ext = `${out}/extension`;
for (const [name, file] of [["nodeview", "dist/nodeview.js"], ["logs", "dist/logs.js"]]) {
  mkdirSync(`${ext}/dist/webview/${name}`, { recursive: true });
  cpSync(file, `${ext}/dist/webview/${name}/index.js`);
}
// one scope: syslogs.js uses extension.js's helpers (listRecords, saturnRequest, …)
writeFileSync(`${ext}/dist/extension.js`, readFileSync("host/extension.js", "utf8") + "\n" + readFileSync("host/syslogs.js", "utf8"));

const pj = JSON.parse(readFileSync(`${ext}/package.json`, "utf8"));
pj.version = version;
writeFileSync(`${ext}/package.json`, JSON.stringify(pj, null, "\t") + "\n");
const manifest = readFileSync(`${out}/extension.vsixmanifest`, "utf8");
const stamped = manifest.replace(/(<Identity\b[^>]*\bVersion=")[^"]*(")/, `$1${version}$2`);
if (stamped === manifest && !manifest.includes(`Version="${version}"`)) throw new Error("no Identity Version in extension.vsixmanifest");
writeFileSync(`${out}/extension.vsixmanifest`, stamped);

console.log(`built ${version} -> ${out}`);
