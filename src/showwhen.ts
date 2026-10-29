// "Show only when" (0.3.68): Saturn's operator list gives some step settings a rule, `form_visibility: {evaluator:
// "function", data: "(params) => params.completion_indicator === \"record_update\""}`, and its form only shows the
// setting while the rule is true. The webview can't run code (the CSP has no eval), so this reads the simple rules
// Saturn uses: the settings by name (`params.x`, `params.a.b`), strings, numbers, true / false / null / undefined,
// === !== == != < > <= >=, && || ! and brackets, as an arrow function or a function with one `return`. A rule it can't
// read shows the setting, as if there were no rule.

type Tok = { t: "name" | "str" | "num" | "op"; v: string };

function tokens(src: string): Tok[] {
  const out: Tok[] = [];
  let i = 0;
  while (i < src.length) {
    const c = src[i];
    if (/\s/.test(c)) { i++; continue; }
    if (c === '"' || c === "'") {
      let j = i + 1, s = "";
      while (j < src.length && src[j] !== c) {
        if (src[j] === "\\") { s += src[j + 1] ?? ""; j += 2; } else s += src[j++];
      }
      if (j >= src.length) throw new Error("open string");
      out.push({ t: "str", v: s });
      i = j + 1;
      continue;
    }
    const num = /^\d+(\.\d+)?/.exec(src.slice(i));
    if (num) { out.push({ t: "num", v: num[0] }); i += num[0].length; continue; }
    const name = /^[A-Za-z_$][\w$]*/.exec(src.slice(i));
    if (name) { out.push({ t: "name", v: name[0] }); i += name[0].length; continue; }
    const op = /^(===|!==|==|!=|<=|>=|=>|&&|\|\||\?\.|[()<>!.{};])/.exec(src.slice(i));
    if (!op) throw new Error("unknown " + c);
    out.push({ t: "op", v: op[0] });
    i += op[0].length;
  }
  return out;
}

type Node =
  | { k: "lit"; v: unknown }
  | { k: "path"; parts: string[] }
  | { k: "not"; a: Node }
  | { k: "bin"; op: string; a: Node; b: Node };

/** The rule's expression and the name it gives the settings (usually `params`). */
function parse(src: string): { arg: string; body: Node } {
  const ts = tokens(src);
  let p = 0;
  const peek = (v?: string) => (v === undefined ? ts[p] : ts[p]?.v === v ? ts[p] : undefined);
  const take = (v: string) => {
    if (ts[p]?.v !== v) throw new Error("expected " + v);
    p++;
  };
  // the head: (params) => …, params => …, function (params) { … }
  if (peek("function")) p++;
  let arg = "params";
  if (peek("(")) {
    p++;
    if (ts[p]?.t === "name") arg = ts[p++].v;
    take(")");
  } else if (ts[p]?.t === "name") arg = ts[p++].v;
  if (peek("=>")) p++;
  let block = false;
  if (peek("{")) {
    p++;
    block = true;
    take("return");
  }
  const or = (): Node => {
    let a = and();
    while (peek("||")) { p++; a = { k: "bin", op: "||", a, b: and() }; }
    return a;
  };
  const and = (): Node => {
    let a = unary();
    while (peek("&&")) { p++; a = { k: "bin", op: "&&", a, b: unary() }; }
    return a;
  };
  const unary = (): Node => {
    if (peek("!")) { p++; return { k: "not", a: unary() }; }
    const a = primary();
    const op = ts[p]?.v;
    if (op && ["===", "!==", "==", "!=", "<", ">", "<=", ">="].includes(op)) {
      p++;
      return { k: "bin", op, a, b: primary() };
    }
    return a;
  };
  const primary = (): Node => {
    const t = ts[p++];
    if (!t) throw new Error("ends early");
    if (t.v === "(") { const e = or(); take(")"); return e; }
    if (t.t === "str") return { k: "lit", v: t.v };
    if (t.t === "num") return { k: "lit", v: Number(t.v) };
    if (t.t === "name") {
      if (t.v === "true" || t.v === "false") return { k: "lit", v: t.v === "true" };
      if (t.v === "null") return { k: "lit", v: null };
      if (t.v === "undefined") return { k: "lit", v: undefined };
      if (t.v !== arg) throw new Error("unknown name " + t.v);
      const parts: string[] = [];
      while (peek(".") || peek("?.")) {
        p++;
        const n = ts[p++];
        if (n?.t !== "name") throw new Error("bad path");
        parts.push(n.v);
      }
      return { k: "path", parts };
    }
    throw new Error("unexpected " + t.v);
  };
  const body = or();
  if (block) {
    if (peek(";")) p++;
    take("}");
  }
  if (peek(";")) p++;
  if (p !== ts.length) throw new Error("left over");
  return { arg, body };
}

/** A setting's value as the rule sees it: the panel holds text, so "" is unset and JSON literals are read. */
function asValue(text: string | undefined): unknown {
  if (text === undefined || text === "") return undefined;
  if (/^(true|false|null|-?\d+(\.\d+)?)$/.test(text.trim())) return JSON.parse(text.trim());
  if (/^[[{]/.test(text.trim())) {
    try { return JSON.parse(text); } catch { /* text */ }
  }
  return text;
}

function run(n: Node, values: Record<string, string>): unknown {
  switch (n.k) {
    case "lit": return n.v;
    case "path": {
      if (n.parts.length === 0) return values;
      let v: unknown = asValue(values[n.parts[0]]);
      for (const part of n.parts.slice(1)) v = v && typeof v === "object" ? (v as Record<string, unknown>)[part] : undefined;
      return v;
    }
    case "not": return !run(n.a, values);
    case "bin": {
      if (n.op === "&&") return run(n.a, values) && run(n.b, values);
      if (n.op === "||") return run(n.a, values) || run(n.b, values);
      const a = run(n.a, values) as never, b = run(n.b, values) as never;
      switch (n.op) {
        case "===": return a === b;
        case "!==": return a !== b;
        case "==": return a == b;
        case "!=": return a != b;
        case "<": return a < b;
        case ">": return a > b;
        case "<=": return a <= b;
        default: return a >= b;
      }
    }
  }
}

const parsed = new Map<string, ReturnType<typeof parse> | null>();

/** Whether a setting with this rule shows, given the step's settings as the panel holds them. No rule, or one this
 *  can't read: it shows. */
export function shownWhen(rule: string | null | undefined, values: Record<string, string>): boolean {
  if (!rule) return true;
  if (!parsed.has(rule)) {
    try { parsed.set(rule, parse(rule)); } catch { parsed.set(rule, null); }
  }
  const r = parsed.get(rule);
  if (!r) return true;
  try { return !!run(r.body, values); } catch { return true; }
}

/** For the tests: whether a rule can be read. */
export function readable(rule: string): boolean {
  try { parse(rule); return true; } catch { return false; }
}
