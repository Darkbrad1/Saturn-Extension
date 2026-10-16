import { build } from "esbuild";
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
console.log("built");
