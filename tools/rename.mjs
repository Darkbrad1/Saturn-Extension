// Renames variables and adds comments in a JavaScript file, safely.
//
//   node tools/rename.mjs <file.js> <changes.json>... [--out out.js] [--dry]
//
// Each changes file is JSON: { "renames": [{ "line", "old", "new" }], "comments": [{ "line", "text" }] }.
// Line numbers refer to the file as it is now (all changes files are read against the same text).
//   - A rename names a variable by the line it is declared on (a parameter, let/const/var,
//     function or class name, catch clause, …) and renames it and every use of it, with
//     Babel's scope-aware rename. If several variables called `old` are declared on that line
//     (e.g. two arrow functions' `n`), each is renamed.
//   - A rename is refused, and reported, if `new` is not a valid name, or would clash: another
//     variable called `new` in the same scope, one in between that would hide it from a use,
//     or a use of an outer `new` that it would capture. Refused renames change nothing.
//   - A comment goes above the statement, class member, object property or switch case that
//     starts on that line (the outermost one); its text may have several lines. Above a
//     top-level name renamed on the same line it starts "newName (minified: old) — ".
// The result is written over the file (or to --out); --dry only reports. Check it with
// tools/same-code.mjs, which proves that only names and comments changed.
import { parse } from "@babel/parser";
import _traverse from "@babel/traverse";
import _generate from "@babel/generator";
import { readFileSync, writeFileSync } from "node:fs";

const traverse = _traverse.default, generate = _generate.default;
const args = process.argv.slice(2);
const flag = (f) => { const i = args.indexOf(f); if (i < 0) return undefined; const v = args[i + 1]; args.splice(i, 2); return v; };
const dry = args.includes("--dry") && (args.splice(args.indexOf("--dry"), 1), true);
const outFile = flag("--out");
const [file, ...changeFiles] = args;
if (!file || !changeFiles.length) { console.error("usage: node tools/rename.mjs <file.js> <changes.json>... [--out out.js] [--dry]"); process.exit(2); }

const src = readFileSync(file, "utf8");
const ast = parse(src, { sourceType: "script", allowReturnOutsideFunction: true });
const renames = [], comments = [];
for (const f of changeFiles) {
  const c = JSON.parse(readFileSync(f, "utf8"));
  for (const r of c.renames ?? []) renames.push({ ...r, from: f });
  for (const k of c.comments ?? []) comments.push({ ...k, from: f });
}

const RESERVED = new Set(("break case catch class const continue debugger default delete do else enum export extends false finally for function if import in instanceof new null return super switch this throw true try typeof var void while with yield let static implements interface package private protected public await arguments eval undefined NaN Infinity").split(" "));
const GLOBALS = new Set(Object.getOwnPropertyNames(globalThis).concat(["require", "module", "exports", "__dirname", "__filename", "process", "Buffer", "console", "fetch", "AbortSignal", "TextEncoder", "TextDecoder", "URL", "URLSearchParams", "setTimeout", "clearTimeout", "setInterval", "clearInterval", "setImmediate", "queueMicrotask", "structuredClone", "crypto", "performance"]));
const validName = (n) => /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(n) && !RESERVED.has(n);

// every binding, by "line:name"
const byLine = new Map(), scopes = [];
traverse(ast, {
  Scopable(p) {
    if (scopes.includes(p.scope)) return;
    scopes.push(p.scope);
    for (const [name, b] of Object.entries(p.scope.bindings)) {
      const line = b.identifier.loc?.start.line;
      const k = `${line}:${name}`;
      if (!byLine.has(k)) byLine.set(k, []);
      if (!byLine.get(k).includes(b)) byLine.get(k).push(b);
    }
  },
});

const isWithin = (scope, outer) => { for (let s = scope; s; s = s.parent) if (s === outer) return true; return false; };
function clash(b, to) {
  if (b.scope.hasOwnBinding(to)) return `"${to}" is already a variable in the same scope`;
  if (GLOBALS.has(to)) return `"${to}" is a global`;
  for (const ref of [...b.referencePaths, ...b.constantViolations]) {
    for (let s = ref.scope; s && s !== b.scope; s = s.parent) if (s.hasOwnBinding(to)) return `an inner "${to}" (line ${s.getOwnBinding(to).identifier.loc?.start.line}) would hide it at line ${ref.node.loc?.start.line}`;
  }
  let capture = null;
  b.scope.path.traverse({
    Identifier(p) {
      if (capture || p.node.name !== to || !p.isReferencedIdentifier()) return;
      const target = p.scope.getBinding(to);
      if (!target || !isWithin(target.scope, b.scope)) capture = `it would capture the outer "${to}" used at line ${p.node.loc?.start.line}`;
    },
  });
  if (b.scope.path.isProgram()) return null; // the program scope's subtree is the file: an outer `to` can only be a global, checked above
  return capture;
}

const refused = [], done = [], topLevel = new Map();
for (const r of renames) {
  const where = `${r.from} line ${r.line}: ${r.old} -> ${r.new}`;
  if (r.old === r.new) continue;
  if (!validName(r.new)) { refused.push(`${where}: not a valid name`); continue; }
  const bs = byLine.get(`${r.line}:${r.old}`);
  if (!bs?.length) { refused.push(`${where}: no variable "${r.old}" is declared on that line`); continue; }
  for (const b of bs) {
    const why = clash(b, r.new);
    if (why) { refused.push(`${where}: ${why}`); continue; }
    b.scope.rename(r.old, r.new);
    if (b.scope.path.isProgram()) topLevel.set(r.line, r);
    done.push(where);
  }
}

// comments: the outermost commentable node starting on each line
const COMMENTABLE = (p) => p.isStatement() || p.isClassMethod() || p.isClassPrivateMethod() || p.isClassProperty() || p.isObjectProperty() || p.isObjectMethod() || p.isSwitchCase();
const atLine = new Map();
traverse(ast, {
  enter(p) {
    const line = p.node.loc?.start.line;
    if (line == null || atLine.has(line) || !COMMENTABLE(p) || p.isBlockStatement() || p.isProgram()) return;
    atLine.set(line, p);
  },
});
let commented = 0;
for (const c of comments) {
  const p = atLine.get(c.line);
  if (!p) { refused.push(`${c.from} line ${c.line}: nothing to put a comment on`); continue; }
  const lines = String(c.text).trim().split("\n").map((l) => l.trim());
  // a top-level name renamed on this line: the note says what it was (minified: X), as elsewhere in the file
  const r = topLevel.get(c.line);
  if (r) lines[0] = `${r.new} (minified: ${r.old}) — ${lines[0]}`;
  // (leading comments are added in front of the ones already there)
  for (const l of lines.reverse()) p.addComment("leading", ` ${l}`, true);
  commented++;
}

console.log(`${done.length} renamed, ${commented} comments, ${refused.length} refused`);
for (const r of refused) console.log("  refused: " + r);
if (!dry) {
  const code = generate(ast, { comments: true, compact: false, jsescOption: { minimal: true } }, src).code;
  writeFileSync(outFile ?? file, code + "\n");
}
