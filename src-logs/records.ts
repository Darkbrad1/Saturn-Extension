// Reading System Logs records: shared by the System Logs screen and the
// node view's Logs tab. Pure helpers, no webview API.
export type Rec = Record<string, unknown>;
export interface Field { key: string; label: string | null; type: string | null }

const DATE_KEYS = ["created_at", "createdAt", "timestamp", "logged_at", "time", "date", "datetime", "updated_at", "updatedAt"];
const LEVEL_KEYS = ["level", "log_level", "severity", "type", "log_type", "status", "category"];
const MSG_KEYS = ["message", "msg", "log", "text", "description", "content", "details", "detail", "body", "data", "payload"];
const CONTEXT = /workflow|resource|action|operator|source|step|user|stage|command|origin|module/i;

export const str = (v: unknown) => (v === null || v === undefined ? "" : typeof v === "string" ? v : JSON.stringify(v));
export const dateOf = (v: unknown): number | null => {
  if (typeof v === "number") return v > 1e12 ? v : v > 1e9 ? v * 1000 : null;
  if (typeof v !== "string" || !v.trim()) return null;
  const t = Date.parse(v);
  return Number.isFinite(t) ? t : null;
};

export function shape(records: Rec[], fields: Field[]) {
  const keys: string[] = [];
  for (const f of fields) if (!keys.includes(f.key)) keys.push(f.key);
  for (const r of records) for (const k of Object.keys(r)) if (!keys.includes(k)) keys.push(k);
  const present = (k: string) => records.some((r) => r[k] !== undefined && r[k] !== null && r[k] !== "");
  const dateKey =
    DATE_KEYS.find((k) => keys.includes(k) && present(k) && records.some((r) => dateOf(r[k]) !== null)) ??
    keys.find((k) => /(_at|At|date|time)$/.test(k) && records.some((r) => dateOf(r[k]) !== null)) ??
    null;
  const levelKey =
    LEVEL_KEYS.find(
      (k) => keys.includes(k) && present(k) && records.every((r) => r[k] === undefined || r[k] === null || (typeof r[k] === "string" && (r[k] as string).length <= 24)),
    ) ?? null;
  const messageKey = MSG_KEYS.find((k) => keys.includes(k) && present(k)) ?? keys.find((k) => k !== "id" && records.some((r) => typeof r[k] === "string" && (r[k] as string).length > 24)) ?? null;
  const context = keys.filter((k) => CONTEXT.test(k) && k !== levelKey && k !== messageKey && present(k)).slice(0, 3);
  const defaults = [dateKey, levelKey, messageKey, ...context].filter((k): k is string => !!k);
  return { keys, dateKey, levelKey, messageKey, defaults: defaults.length ? defaults : keys.slice(0, 5) };
}

/** Do the records come oldest first? (compare the page's first and last dates, else ids) */
export function ascending(records: Rec[], dateKey: string | null): boolean | null {
  if (records.length < 2) return null;
  const a = records[0], b = records[records.length - 1];
  if (dateKey) {
    const x = dateOf(a[dateKey]), y = dateOf(b[dateKey]);
    if (x !== null && y !== null && x !== y) return x < y;
  }
  const xi = Number(a.id), yi = Number(b.id);
  if (Number.isFinite(xi) && Number.isFinite(yi) && xi !== yi) return xi < yi;
  return null;
}

export function rel(t: number, now: number) {
  const s = Math.round((now - t) / 1000);
  if (s < 5) return "just now";
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`;
  if (s < 86400 * 7) return `${Math.floor(s / 86400)} d ago`;
  return new Date(t).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}
export function abs(t: number) {
  const d = new Date(t);
  return d.toLocaleString(undefined, { year: "numeric", month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" });
}
export function levelClass(v: string) {
  const l = v.toLowerCase();
  if (/err|fail|fatal|crit|exception/.test(l)) return "is-error";
  if (/warn/.test(l)) return "is-warn";
  if (/debug|trace|verbose/.test(l)) return "is-debug";
  if (/info|ok|success|done|notice/.test(l)) return "is-info";
  return "";
}

// ---- which records are about a workflow, an action or a step ------------------

/** What identifies something in a log record: ids (distinctive) and names. */
export interface LogTarget {
  ids: string[];
  names: string[];
}

/** Every text leaf of a record as [key path, lower-cased text], at most 4 levels deep. */
function leaves(v: unknown, path: string, out: [string, string][], depth: number) {
  if (v === null || v === undefined) return;
  if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") {
    out.push([path, String(v).trim().toLowerCase()]);
    return;
  }
  if (depth >= 4 || typeof v !== "object") return;
  if (Array.isArray(v)) v.slice(0, 50).forEach((x) => leaves(x, path, out, depth + 1));
  else for (const [k, x] of Object.entries(v as Rec)) leaves(x, path ? `${path}.${k}` : k, out, depth + 1);
}

const lower = (xs: (string | null | undefined)[]) => [...new Set(xs.filter((x): x is string => !!x && !!x.trim()).map((x) => x.trim().toLowerCase()))];

export function target(ids: (string | null | undefined)[], names: (string | null | undefined)[]): LogTarget {
  return { ids: lower(ids), names: lower(names) };
}

/**
 * Does the record name the target under a key matching `keys` (e.g. /workflow/
 * matches `workflow`, `workflow_id`, `context.workflow.name`)? Long ids also
 * count anywhere in the record, since they can't be confused with anything else.
 */
export function mentions(r: Rec, keys: RegExp, t: LogTarget, skip?: RegExp): boolean {
  const out: [string, string][] = [];
  leaves(r, "", out, 0);
  for (const [k, v] of out) {
    if (!v || !keys.test(k) || (skip && skip.test(k))) continue;
    if (t.ids.includes(v) || t.names.includes(v)) return true;
  }
  const longIds = t.ids.filter((id) => id.length >= 8);
  return longIds.length > 0 && out.some(([, v]) => longIds.some((id) => v.includes(id)));
}

export const WORKFLOW_KEYS = /workflow|flow_id|flowid/i;
export const ACTION_KEYS = /action|command|task|trigger/i;
export const STEP_KEYS = /operator|step|node/i;
/**
 * A SystemLog record's `workflow` is a copy of the whole workflow: every
 * action and step name is in it, so it says nothing about which one logged.
 * Skip it when matching actions and steps.
 */
export const WORKFLOW_COPY = /^workflow\./i;

/**
 * The step that wrote a SystemLog record: its `task` is that step, usually as
 * JSON text ({"id":"RGJMO5","type":"command","operator":"debug",…}).
 */
export function taskOf(r: Rec): { id: string | null; operator: string | null } | null {
  let t: unknown = r.task;
  if (typeof t === "string") {
    if (!t.trim().startsWith("{")) return null;
    try {
      t = JSON.parse(t);
    } catch {
      return null;
    }
  }
  if (!t || typeof t !== "object" || Array.isArray(t)) return null;
  const o = t as Rec;
  return { id: typeof o.id === "string" && o.id ? o.id : null, operator: typeof o.operator === "string" ? o.operator : null };
}

/** A cell's text: objects by their name (e.g. a record's workflow), the step a task names, else JSON. */
export function cellText(k: string, v: unknown): string {
  if (v && typeof v === "object" && !Array.isArray(v)) {
    const o = v as Rec;
    for (const n of ["name", "label", "title"]) if (typeof o[n] === "string" && o[n]) return o[n] as string;
  }
  if (k === "task") {
    const t = taskOf({ task: v });
    if (t) return [t.operator, t.id].filter(Boolean).join(" · ");
  }
  return str(v);
}
