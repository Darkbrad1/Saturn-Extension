// v0.3.55: the favourite settings (host/favourites.js): kept in globalState as a clean list of ids, sent to every
// screen that asked, and a change reaches them all. The Resources screen and the Workflows panel (Form tab) answer.
const fs = require("fs"), Module = require("module");
const src = fs.readFileSync(process.argv[2], "utf8") + "\n;module.exports.__t={FavouritesHost};";
const stub = new Proxy(function () {}, { get: (t, k) => (k === Symbol.toPrimitive ? () => "" : stub), apply: () => stub, construct: () => stub });
const m = new Module("ext"); m.filename = "/x/extension.js";
const orig = Module._load; Module._load = (r, p, i) => (r === "vscode" ? stub : orig(r, p, i));
m._compile(src, m.filename);
const { FavouritesHost: F } = m.exports.__t;
const ok = (c, msg) => console.log((c ? "PASS " : "FAIL ") + msg);

(async () => {
  const store = new Map();
  F.attach({ globalState: { get: (k) => store.get(k), update: async (k, v) => store.set(k, v) } });
  ok(JSON.stringify(F.get()) === "[]", "none yet: []");
  const a = [], b = [];
  F.send({ postMessage: (msg) => a.push(msg) });
  F.send({ postMessage: (msg) => b.push(msg) });
  ok(a[0]?.type === "favourites" && Array.isArray(a[0].payload.ids), "a screen that asks gets the list");
  await F.set(["required", "input_properties.type", "required", "bad id!", 5, "__proto__x", "lookup_reference.values"]);
  ok(JSON.stringify(store.get("saturn.favouriteSettings")) === '["required","input_properties.type","__proto__x","lookup_reference.values"]', "only clean ids, each once: " + JSON.stringify(store.get("saturn.favouriteSettings")));
  ok(a.at(-1).payload.ids[0] === "required" && b.at(-1).payload.ids[1] === "input_properties.type", "a change is sent to every screen that asked");
  const gone = { postMessage: () => { throw new Error("disposed"); } };
  F.send(gone);
  await F.set([]);
  ok(!F.screens.has(gone), "a closed screen is forgotten");
  await F.set("not a list");
  ok(JSON.stringify(store.get("saturn.favouriteSettings")) === "[]", "anything but a list keeps none");
  const raw = fs.readFileSync(process.argv[2], "utf8");
  ok(/case "fetchFavourites":\s*FavouritesHost\.send\(webview\)/.test(raw) && /case "setFavourites":\s*await FavouritesHost\.set\(message\.payload\?\.ids\)/.test(raw), "the Workflows panel (Form tab) answers");
  ok(/case "fetchFavourites": \{\s*if \(message\.webview\) FavouritesHost\.send/.test(raw) && /case "setFavourites":\s*await FavouritesHost\.set\(payload\.ids\)/.test(raw), "the Resources screen answers");
  ok(/FavouritesHost\.attach\(\{\s*globalState: context\.globalState/.test(raw), "attached at start");
})().catch((e) => console.log("FAIL threw: " + e.stack));
