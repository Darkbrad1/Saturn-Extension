// A Read step's Query, Sort and Columns (0.3.70), built like the Menus screen's filter: conditions in rows (a property,
// a comparison, a value) joined by all / any, or the text itself when a query is too involved for rows. Saturn's Read
// takes N1QL: a WHERE clause written with the resource in lower case, as in `user`.`group` = 'x' (and META(`user`).id
// for the id), an ORDER BY clause for Sort, and a comma-separated list for Columns (written `user`.`email`, as
// Saturn's own code lists them).
import { useContext, useEffect, useMemo, useState } from "react";
import { HighlightInput } from "./controls";
import { FormEnvContext } from "./forms";
import type { ResourceField } from "./recordform";

export type QueryOp = "=" | "!=" | ">" | ">=" | "<" | "<=" | "contains" | "missing" | "set";
export const QUERY_OPS: { op: QueryOp; label: string; needsValue: boolean }[] = [
  { op: "=", label: "is", needsValue: true },
  { op: "!=", label: "is not", needsValue: true },
  { op: ">", label: "is more than", needsValue: true },
  { op: ">=", label: "is at least", needsValue: true },
  { op: "<", label: "is less than", needsValue: true },
  { op: "<=", label: "is at most", needsValue: true },
  { op: "contains", label: "contains", needsValue: true },
  { op: "missing", label: "is empty", needsValue: false },
  { op: "set", label: "is set", needsValue: false },
];
export interface QueryCondition { field: string; op: QueryOp; value: string }
export interface QueryModel { join: "AND" | "OR"; conditions: QueryCondition[] }

const alias = (resource: string) => resource.toLowerCase();
const ref = (field: string, resource: string) => (field === "id" ? `META(\`${alias(resource)}\`).id` : `\`${alias(resource)}\`.\`${field}\``);
/** A value as N1QL: a template, a number or true / false as it is, anything else in single quotes. */
function literal(v: string) {
  const t = v.trim();
  if (/^\{\{[\s\S]*\}\}$/.test(t) || /^(true|false|null|-?\d+(\.\d+)?)$/.test(t)) return t;
  return `'${t.replace(/'/g, "''")}'`;
}
function unliteral(v: string): string | null {
  const t = v.trim();
  if (/^'(?:[^']|'')*'$/.test(t)) return t.slice(1, -1).replace(/''/g, "'");
  if (/^"(?:[^"\\]|\\.)*"$/.test(t)) return JSON.parse(t);
  if (/^\{\{[\s\S]*\}\}$/.test(t) || /^(true|false|null|-?\d+(\.\d+)?)$/.test(t)) return t;
  return null;
}

export function buildQuery(model: QueryModel, resource: string) {
  return model.conditions
    .filter((c) => c.field.trim())
    .map((c) => {
      const f = ref(c.field.trim(), resource);
      switch (c.op) {
        case "missing": return `${f} IS MISSING`;
        case "set": return `${f} IS NOT MISSING`;
        case "contains": return `${f} LIKE ${literal(`%${c.value}%`)}`;
        default: return `${f} ${c.op} ${literal(c.value)}`;
      }
    })
    .join(` ${model.join} `);
}

/** Splits on a top-level AND / OR, skipping quoted text, brackets and {{ templates }}. */
function splitTop(text: string, keyword: string) {
  const parts: string[] = [];
  let depth = 0, quote: string | null = null, start = 0;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quote) {
      if (ch === "\\") { i++; continue; }
      if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") { quote = ch; continue; }
    if (ch === "(" || ch === "{") depth++;
    else if (ch === ")" || ch === "}") depth--;
    else if (depth === 0 && text.slice(i, i + keyword.length + 2).toUpperCase() === ` ${keyword} `) {
      parts.push(text.slice(start, i));
      start = i + keyword.length + 2;
      i = start - 1;
    }
  }
  parts.push(text.slice(start));
  return parts.map((p) => p.trim()).filter(Boolean);
}

function parseCondition(text: string, resource: string): QueryCondition | null {
  const a = alias(resource);
  const m = new RegExp(`^(?:\`${a}\`\\.\`([^\`]+)\`|META\\(\`${a}\`\\)\\.id)\\s*(.*)$`, "i").exec(text.trim());
  if (!m) return null;
  const field = m[1] ?? "id";
  const rest = m[2].trim();
  if (/^IS\s+MISSING$/i.test(rest)) return { field, op: "missing", value: "" };
  if (/^IS\s+NOT\s+MISSING$/i.test(rest)) return { field, op: "set", value: "" };
  const like = /^LIKE\s+(.+)$/i.exec(rest);
  if (like) {
    const v = unliteral(like[1]);
    return v !== null && /^%.*%$/.test(v) ? { field, op: "contains", value: v.slice(1, -1) } : null;
  }
  const cmp = /^(>=|<=|!=|=|>|<)\s*([\s\S]+)$/.exec(rest);
  if (!cmp) return null;
  const v = unliteral(cmp[2]);
  return v === null ? null : { field, op: cmp[1] as QueryOp, value: v };
}

/** A query as rows, or null when it's more than rows can show (functions, mixed AND / OR, brackets). */
export function parseQuery(text: string, resource: string): QueryModel | null {
  const t = text.trim();
  if (!t) return { join: "AND", conditions: [] };
  for (const join of ["AND", "OR"] as const) {
    const parts = splitTop(t, join);
    if (parts.length > 1 || join === "OR") {
      if (parts.some((p) => splitTop(p, join === "AND" ? "OR" : "AND").length > 1)) continue;
      const conditions = parts.map((p) => parseCondition(p, resource));
      if (conditions.every((c) => c !== null)) return { join: parts.length > 1 ? join : "AND", conditions: conditions as QueryCondition[] };
    }
  }
  return null;
}

// ---- Sort and Columns ---------------------------------------------------------------------------------------------

export interface SortKey { field: string; dir: "ASC" | "DESC" }
export function parseSort(text: string, resource: string): SortKey[] | null {
  const t = text.trim();
  if (!t) return [];
  const keys = t.split(",").map((p) => {
    const m = new RegExp(`^(?:\`${alias(resource)}\`\\.\`([^\`]+)\`|META\\(\`${alias(resource)}\`\\)\\.id)(?:\\s+(ASC|DESC))?$`, "i").exec(p.trim());
    return m ? { field: m[1] ?? "id", dir: ((m[2] ?? "ASC").toUpperCase() as "ASC" | "DESC") } : null;
  });
  return keys.every((k) => k) ? (keys as SortKey[]) : null;
}
export const buildSort = (keys: SortKey[], resource: string) => keys.filter((k) => k.field).map((k) => `${ref(k.field, resource)} ${k.dir}`).join(", ");
export function parseColumns(text: string, resource: string): string[] | null {
  const t = text.trim();
  if (!t) return [];
  const cols = t.split(",").map((p) => {
    const m = new RegExp(`^(?:\`${alias(resource)}\`\\.)?\`?([A-Za-z_][\\w]*)\`?$`).exec(p.trim());
    return m ? m[1] : null;
  });
  return cols.every((c) => c) ? (cols as string[]) : null;
}
export const buildColumns = (cols: string[], resource: string) => cols.map((c) => `\`${alias(resource)}\`.\`${c}\``).join(",");

// ---- the editors --------------------------------------------------------------------------------------------------

const withId = (fields: ResourceField[] | null | undefined): ResourceField[] | null =>
  fields ? [{ key: "id", label: "Id", type: "string" }, ...fields.filter((f) => f.key !== "id").sort((a, b) => (a.index ?? 0) - (b.index ?? 0))] : null;

function useFields(resource: string) {
  const env = useContext(FormEnvContext);
  return withId(resource && !/\{\{/.test(resource) ? env.fields?.(resource) : null);
}

function FieldSelect(props: { fields: ResourceField[] | null; value: string; onChange: (v: string) => void; label: string }) {
  const known = !props.fields || props.fields.some((f) => f.key === props.value);
  return props.fields ? (
    <select aria-label={props.label} value={props.value} onChange={(e) => props.onChange(e.target.value)}>
      {!known && <option value={props.value}>{props.value} (not a property)</option>}
      {props.fields.map((f) => (
        <option key={f.key} value={f.key}>
          {f.label || f.key}
        </option>
      ))}
    </select>
  ) : (
    <input aria-label={props.label} placeholder="property" value={props.value} onChange={(e) => props.onChange(e.target.value)} />
  );
}

/** Text or rows: text when the value can't be shown as rows, otherwise whichever was last chosen (rows at first). */
function useMode(parsed: unknown) {
  const [text, setText] = useState(false);
  return [parsed === null || text, setText] as const;
}

export function QueryEditor(props: { resource: string; value: string; onChange: (v: string) => void; onCommit: (v?: string) => void }) {
  const { resource, value } = props;
  const fields = useFields(resource);
  const parsed = useMemo(() => (resource ? parseQuery(value, resource) : null), [value, resource]);
  const [asText, setAsText] = useMode(parsed);
  const model: QueryModel = parsed ?? { join: "AND", conditions: [] };
  const emit = (m: QueryModel) => {
    const q = buildQuery(m, resource);
    props.onChange(q);
    props.onCommit(q);
  };
  const update = (i: number, change: Partial<QueryCondition>) => emit({ ...model, conditions: model.conditions.map((c, j) => (j === i ? { ...c, ...change } : c)) });
  return (
    <div className="nv-query">
      <div className="nv-query-head">
        <span className="nv-muted">{resource ? `Records of ${resource} where…` : "Pick the resource first."}</span>
        {parsed !== null && resource && (
          <button type="button" className="nv-link" onClick={() => setAsText(!asText)}>
            {asText ? "Edit as conditions" : "Edit as text"}
          </button>
        )}
      </div>
      {asText || !resource ? (
        <>
          <HighlightInput multiline mono rows={Math.min(10, Math.max(3, Math.ceil(value.length / 48)))} lang="n1ql" className="nv-query-text" ariaLabel="Query" placeholder={`e.g. \`${alias(resource || "user")}\`.\`status\` = 'active'`} value={value} onChange={props.onChange} onBlur={() => props.onCommit()} />
          {parsed === null && value.trim() && <span className="nv-muted">Too involved to show as conditions, so it's kept exactly as written.</span>}
        </>
      ) : (
        <div className="nv-query-rows">
          {model.conditions.length > 1 && (
            <label className="nv-query-join">
              Match{" "}
              <select value={model.join} onChange={(e) => emit({ ...model, join: e.target.value as "AND" | "OR" })}>
                <option value="AND">all of these</option>
                <option value="OR">any of these</option>
              </select>
            </label>
          )}
          {!model.conditions.length && <span className="nv-muted">No conditions: every record is read (up to the limit).</span>}
          {model.conditions.map((c, i) => {
            const op = QUERY_OPS.find((o) => o.op === c.op) ?? QUERY_OPS[0];
            return (
              <div key={i} className="nv-query-row">
                <FieldSelect fields={fields} label="Property" value={c.field} onChange={(v) => update(i, { field: v })} />
                <select aria-label="Comparison" value={c.op} onChange={(e) => update(i, { op: e.target.value as QueryOp })}>
                  {QUERY_OPS.map((o) => (
                    <option key={o.op} value={o.op}>
                      {o.label}
                    </option>
                  ))}
                </select>
                {op.needsValue && <QueryValue value={c.value} onDone={(v) => update(i, { value: v })} />}
                <button type="button" className="nv-prop-tool" title="Remove this condition" aria-label="Remove this condition" onClick={() => emit({ ...model, conditions: model.conditions.filter((_, j) => j !== i) })}>
                  ×
                </button>
              </div>
            );
          })}
          <button type="button" className="nv-mini-btn nv-query-add" onClick={() => emit({ ...model, conditions: [...model.conditions, { field: fields?.[1]?.key ?? fields?.[0]?.key ?? "", op: "=", value: "" }] })}>
            + Condition
          </button>
        </div>
      )}
    </div>
  );
}

/** A condition's value: applied when the box is left or Enter is pressed (a value or a {{ template }}). */
function QueryValue(props: { value: string; onDone: (v: string) => void }) {
  const [v, setV] = useState(props.value);
  useEffect(() => setV(props.value), [props.value]);
  return (
    <HighlightInput
      ariaLabel="Value"
      placeholder="value or {{ template }}"
      value={v}
      onChange={setV}
      onBlur={() => v !== props.value && props.onDone(v)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          if (v !== props.value) props.onDone(v);
        }
      }}
    />
  );
}

export function SortEditor(props: { resource: string; value: string; onChange: (v: string) => void; onCommit: (v?: string) => void }) {
  const { resource, value } = props;
  const fields = useFields(resource);
  const parsed = useMemo(() => (resource ? parseSort(value, resource) : null), [value, resource]);
  const [asText, setAsText] = useMode(parsed);
  const keys = parsed ?? [];
  const emit = (k: SortKey[]) => {
    const s = buildSort(k, resource);
    props.onChange(s);
    props.onCommit(s);
  };
  if (asText || !resource)
    return (
      <div className="nv-query">
        <HighlightInput mono lang="n1ql" ariaLabel="Sort" placeholder={`e.g. \`${alias(resource || "user")}\`.\`created_at\` DESC`} value={value} onChange={props.onChange} onBlur={() => props.onCommit()} />
        {parsed !== null && resource && <button type="button" className="nv-link" onClick={() => setAsText(false)}>Pick properties</button>}
      </div>
    );
  return (
    <div className="nv-query-rows">
      {!keys.length && <span className="nv-muted">In the order Saturn keeps them.</span>}
      {keys.map((k, i) => (
        <div key={i} className="nv-query-row">
          <FieldSelect fields={fields} label="Sort by" value={k.field} onChange={(v) => emit(keys.map((x, j) => (j === i ? { ...x, field: v } : x)))} />
          <select aria-label="Direction" title="Ascending: A to Z, oldest or smallest first. Descending: the other way round." value={k.dir} onChange={(e) => emit(keys.map((x, j) => (j === i ? { ...x, dir: e.target.value as "ASC" | "DESC" } : x)))}>
            <option value="ASC">Ascending</option>
            <option value="DESC">Descending</option>
          </select>
          <button type="button" className="nv-prop-tool" title="Remove" aria-label="Remove this sort" onClick={() => emit(keys.filter((_, j) => j !== i))}>
            ×
          </button>
        </div>
      ))}
      <span className="nv-query-foot">
        <button type="button" className="nv-mini-btn" onClick={() => emit([...keys, { field: fields?.find((f) => f.key === "created_at")?.key ?? fields?.[1]?.key ?? "id", dir: "DESC" }])}>
          + Sort by
        </button>
        <button type="button" className="nv-link" onClick={() => setAsText(true)}>Edit as text</button>
      </span>
    </div>
  );
}

export function ColumnsEditor(props: { resource: string; value: string; onChange: (v: string) => void; onCommit: (v?: string) => void }) {
  const { resource, value } = props;
  const fields = useFields(resource);
  const parsed = useMemo(() => (resource ? parseColumns(value, resource) : null), [value, resource]);
  const [asText, setAsText] = useMode(parsed);
  if (asText || !resource || !fields)
    return (
      <div className="nv-query">
        <HighlightInput mono lang="n1ql" ariaLabel="Columns" placeholder="Empty: every property" value={value} onChange={props.onChange} onBlur={() => props.onCommit()} />
        {parsed !== null && resource && fields && <button type="button" className="nv-link" onClick={() => setAsText(false)}>Pick properties</button>}
      </div>
    );
  const chosen = new Set(parsed ?? []);
  const set = (cols: string[]) => {
    const v = buildColumns(cols, resource);
    props.onChange(v);
    props.onCommit(v);
  };
  return (
    <div className="nv-query-cols">
      <span className="nv-muted">{chosen.size ? `${chosen.size} picked` : "None picked: every property is read."}</span>
      <div className="nv-query-picks">
        {fields.map((f) => (
          <label key={f.key} className="nv-query-pick">
            <input type="checkbox" checked={chosen.has(f.key)} onChange={(e) => set(e.target.checked ? [...(parsed ?? []), f.key] : (parsed ?? []).filter((c) => c !== f.key))} />
            {f.label ?? f.key} <code>{f.key}</code>
          </label>
        ))}
      </div>
      <button type="button" className="nv-link" onClick={() => setAsText(true)}>Edit as text</button>
    </div>
  );
}
