// Proves two JavaScript files are the same program apart from variable names and comments.
//
//   node tools/same-code.mjs <before.js> <after.js>
//
// Every variable in each file is renamed to a numbered placeholder, in the order it is
// declared, comments are dropped, and the two are printed and compared. Renaming (with
// tools/rename.mjs) and commenting change nothing else, so they print the same; any other
// difference — a renamed property, a variable captured by another, an edited string — shows
// up as the first differing line (blank lines and how literals are spelled aside). Exits 1 if they differ.
import { parse } from "@babel/parser";
import _traverse from "@babel/traverse";
import _generate from "@babel/generator";
import { readFileSync } from "node:fs";

const traverse = _traverse.default, generate = _generate.default;

function canonical(file) {
  const ast = parse(readFileSync(file, "utf8"), { sourceType: process.env.SAME_CODE_MODULE ? "module" : "script", allowReturnOutsideFunction: true });
  const seen = new Set(), labels = {};
  let n = 0, nl = 0;
  traverse(ast, {
    // a literal is compared by its value, not its spelling (0.5 / .5, 'a' / "a")
    "StringLiteral|NumericLiteral|BigIntLiteral|DirectiveLiteral"(p) {
      delete p.node.extra;
    },
    // statement labels (`a: for (…) { … break a; }`) are numbered like variables
    LabeledStatement: {
      enter(p) {
        const name = p.node.label.name;
        (labels[name] ??= []).push(`$L${nl++}`);
        p.node.label.name = labels[name].at(-1);
        p.node.label.__orig = name;
      },
      exit(p) {
        labels[p.node.label.__orig].pop();
      },
    },
    "BreakStatement|ContinueStatement"(p) {
      const l = p.node.label;
      if (l && labels[l.name]?.length) l.name = labels[l.name].at(-1);
    },
    // and minifiers' spellings of true / false (!0 / !1) are the same values
    UnaryExpression: {
      exit(p) {
        const a = p.node.argument;
        if (p.node.operator === "!" && a.type === "NumericLiteral" && (a.value === 0 || a.value === 1)) p.replaceWith({ type: "BooleanLiteral", value: a.value === 0 });
      },
    },
    Scopable(p) {
      if (seen.has(p.scope)) return;
      seen.add(p.scope);
      for (const b of Object.values(p.scope.bindings)) {
        const name = `$v${n++}`;
        // every identifier that is this binding: its declaration, uses and assignments
        const ids = new Set([b.identifier]);
        for (const r of b.referencePaths) ids.add(r.node);
        for (const v of b.constantViolations) for (const id of Object.values(v.getBindingIdentifiers?.() ?? {})) if (id.name === b.identifier.name) ids.add(id);
        for (const id of ids) id.name = name;
      }
    },
  });
  // a declaration can be listed twice (e.g. `var` re-declared); the placeholders still match on both sides
  // blank lines move with comments; they mean nothing
  return generate(ast, { comments: false, compact: false }).code.split("\n").filter((l) => l.trim() !== "");
}

const [a, b] = process.argv.slice(2);
if (!a || !b) { console.error("usage: node tools/same-code.mjs <before.js> <after.js>"); process.exit(2); }
const x = canonical(a), y = canonical(b);
const i = x.findIndex((l, k) => l !== y[k]);
if (i < 0 && x.length === y.length) { console.log(`same program (${x.length.toLocaleString()} lines, names and comments aside)`); process.exit(0); }
const k = i < 0 ? Math.min(x.length, y.length) : i;
console.log(`differ at canonical line ${k + 1}:\n  before: ${x[k] ?? "(end)"}\n  after:  ${y[k] ?? "(end)"}`);
process.exit(1);
