// A log message, formatted. Messages are often debug output with JSON in them,
// e.g. `const flow = {…}; const store = {…}; const resource = {…};` from a
// Debug step's `{{JSON.stringify(_flow)}}`. They are split into plain text and
// the JSON values inside it (named after the `const x =` / `x:` before them),
// each value pretty-printed and highlighted. Shared by the System Logs screen
// and the node view's Logs tab.
import { useState } from "react";

export type MessagePart = { kind: "text"; text: string } | { kind: "value"; label: string | null; value: unknown };

/** Where the JSON value starting at s[i] ("{" or "[") ends, strings and escapes respected; -1 if it doesn't. */
function valueEnd(s: string, i: number): number {
  let depth = 0;
  let inStr = false;
  for (let k = i; k < s.length; k++) {
    const c = s[k];
    if (inStr) {
      if (c === "\\") k++;
      else if (c === '"') inStr = false;
    } else if (c === '"') inStr = true;
    else if (c === "{" || c === "[") depth++;
    else if (c === "}" || c === "]") {
      depth--;
      if (depth === 0) return k + 1;
      if (depth < 0) return -1;
    }
  }
  return -1;
}

const LABEL = /(?:^|[;,\s(])(?:(?:const|let|var)\s+)?([A-Za-z_$][\w$.]*)\s*[=:]\s*$/;

export function parseMessage(text: string): MessagePart[] {
  const parts: MessagePart[] = [];
  let i = 0;
  let from = 0;
  const pushText = (t: string) => {
    const v = t.replace(/^[\s;,]+|[\s;,]+$/g, "");
    if (v) parts.push({ kind: "text", text: v });
  };
  while (i < text.length) {
    const j = text.slice(i).search(/[{[]/);
    if (j < 0) break;
    const start = i + j;
    const end = valueEnd(text, start);
    let value: unknown;
    let ok = false;
    if (end > start) {
      try {
        value = JSON.parse(text.slice(start, end));
        ok = value !== null && typeof value === "object";
      } catch {
        ok = false;
      }
    }
    if (!ok) {
      i = start + 1;
      continue;
    }
    let before = text.slice(from, start);
    const m = LABEL.exec(before);
    const label = m ? m[1] : null;
    if (m) before = before.slice(0, m.index + (m[0].length - m[0].trimStart().length));
    pushText(before);
    parts.push({ kind: "value", label, value });
    i = from = end;
  }
  pushText(text.slice(from));
  return parts;
}

const sizeOf = (v: unknown) =>
  Array.isArray(v) ? `${v.length} item${v.length === 1 ? "" : "s"}` : `${Object.keys(v as object).length} key${Object.keys(v as object).length === 1 ? "" : "s"}`;

/** One line for a list row: the text, with each value as `name {N keys}`. */
export function summarize(text: string): string {
  const parts = parseMessage(text);
  if (!parts.some((p) => p.kind === "value")) return text;
  return parts
    .map((p) => (p.kind === "text" ? p.text : `${p.label ? p.label + " " : ""}${Array.isArray(p.value) ? "[" : "{"}${sizeOf(p.value)}${Array.isArray(p.value) ? "]" : "}"}`))
    .join(" · ");
}

/** The message, formatted: text as text, each JSON value in its own collapsible, highlighted block. */
export function MessageView(props: {
  text: string;
  /** highlighted HTML for a value (pretty-printed JSON) */
  json: (v: unknown) => string;
  onCopy?: (v: unknown) => void;
}) {
  const parts = parseMessage(props.text);
  const values = parts.filter((p) => p.kind === "value").length;
  const [all, setAll] = useState<boolean | null>(null);
  if (values === 0) return <div className="lgm-text">{props.text}</div>;
  // a few values open; a long run of them starts closed (each can be opened)
  const openByDefault = all ?? values <= 3;
  return (
    <div className="lgm">
      {values > 1 && (
        <div className="lgm-bar">
          <button type="button" className="lgm-link" onClick={() => setAll(!openByDefault)}>
            {openByDefault ? "Collapse all" : "Expand all"}
          </button>
        </div>
      )}
      {parts.map((p, i) =>
        p.kind === "text" ? (
          <div key={i} className="lgm-text">
            {p.text}
          </div>
        ) : (
          <details key={`${i}:${openByDefault}`} className="lgm-value" open={openByDefault}>
            <summary>
              <span className="lgm-name">{p.label ?? (Array.isArray(p.value) ? "list" : "value")}</span>
              <span className="lgm-size">{sizeOf(p.value)}</span>
              {props.onCopy && (
                <button
                  type="button"
                  className="lgm-link"
                  onClick={(e) => {
                    e.preventDefault();
                    props.onCopy!(p.value);
                  }}
                >
                  Copy
                </button>
              )}
            </summary>
            <pre className="lgm-json" dangerouslySetInnerHTML={{ __html: props.json(p.value) }} />
          </details>
        ),
      )}
    </div>
  );
}
