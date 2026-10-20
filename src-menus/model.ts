// The Menus screen's model: what a menu and its tabs look like, the helpers that read and change a
// tab, the filter builder, and the checks (each problem names the menu, tab or sub-tab and the
// setting it is about, so the screen can show it beside them). Ported from the screen this one
// replaced (vsix/…/webview/menus before 0.3.30), which wrote menus the same way.

export type Tab = Record<string, unknown>;
export interface Rule { method: string; data: string[]; lable?: string; label?: string; [key: string]: unknown }
export interface Menu { id: string; label: string; icon: string; order: number; access_control: Rule[]; references: Tab[] }
/** What a save writes: the parts of a menu this screen changes. */
export interface MenuBody { label: string; icon: string; order: number; access_control: Rule[]; references: Tab[] }
export interface Field { key: string; label: string | null; type: string | null }
export interface Page { slug: string; title: string; enabled: boolean }
export interface SavedView { id: string; name: string; view: string; resource: string }
export interface Group { id: string; name: string }
export interface Subject { id: string; name: string; detail?: string }
export interface Subjects { groups: Subject[]; users: Subject[]; permissions: Subject[]; error?: string | null }

const str = (v: unknown) => (typeof v === "string" ? v : "");
const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);
export const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v));
export const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

/** The parts of a menu the screen edits. */
export const bodyOf = (m: Menu): MenuBody => ({ label: m.label, icon: m.icon, order: m.order, access_control: m.access_control, references: m.references });

// ---- what a tab opens, and its caption ------------------------------------------------------------
export type TargetKind = "resource" | "custom_page" | "dashboard" | "unknown";
/** What a tab opens: a custom page, a dashboard or a resource (by its type, else by which key is set). */
export function tabTarget(tab: Tab): { kind: TargetKind; value: string } {
  const type = str(tab.type);
  if (type === "custom_page" || (!type && str(tab.page) && !str(tab.resource))) return { kind: "custom_page", value: str(tab.page) };
  if (type === "dashboard" || (!type && str(tab.dashboard) && !str(tab.resource))) return { kind: "dashboard", value: str(tab.dashboard) };
  if (str(tab.resource)) return { kind: "resource", value: str(tab.resource) };
  return { kind: "unknown", value: "" };
}
/** A tab's caption as plain text (resource_label, or title, is stored as HTML). */
export function tabCaption(tab: Tab) {
  return (str(tab.resource_label) || str(tab.title))
    .replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&").trim();
}
/** The name a tab is listed under. */
export const tabName = (tab: Tab) => tabCaption(tab) || tabTarget(tab).value || "Untitled tab";
const escapeHtml = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
/** The <p> the web app wraps a caption in. */
const CAPTION_P = '<p style="margin:0;padding:0;line-height:1">';
function captionHtml(text: string, previous?: unknown) {
  const before = str(previous);
  if (before.trim() && !/<[a-z][^>]*>/i.test(before)) return escapeHtml(text.trim());
  return `${/^\s*(<p\b[^>]*>)/i.exec(before)?.[1] ?? CAPTION_P}${escapeHtml(text.trim())}</p>`;
}
/** The resource_label to store for a caption typed in. */
export const captionFor = (tab: Tab, text: string) => (tabTarget(tab).kind === "custom_page" ? escapeHtml(text.trim()) : captionHtml(text, tab.resource_label));

/** The filter_function a new tab gets (it lets every record through). */
const DEFAULT_FILTER_FUNCTION = "(res, {_util})=>{\n//your code comes here\nreturn true\n}";
/** A new resource tab with the web app's defaults and one table view on the tab. */
export function newResourceTab(resource: string, caption: string, now = Date.now()): Tab {
  return {
    resource,
    resource_label: captionHtml(caption || resource),
    create_label: "",
    default_view: "data_table",
    views: [{ id: `inline-${now}`, name: "Table", view: "data_table", details: { aggregations: [], table_columns: [] } }],
    filter: "",
    filter_function: DEFAULT_FILTER_FUNCTION,
    sorts: [],
    sub_menus: [],
    tab_icon: "",
    tab_bg_color: "",
    tab_active_bg_color: "",
    openOnCreate: false,
    disableBatchActions: false,
    reloadOnStatusChange: false,
  };
}
/** A tab that opens a custom page (keeping the other settings of one that already did). */
export function customPageTab(page: Page | null, caption: string, previous?: Tab): Tab {
  return { ...(previous && tabTarget(previous).kind === "custom_page" ? previous : {}), type: "custom_page", page: page?.slug ?? "", title: page?.title ?? "", resource_label: escapeHtml(caption.trim()) };
}
/** The tab pointed at a resource, custom page or dashboard (the other target keys cleared). */
export function setTarget(tab: Tab, kind: "resource" | "custom_page" | "dashboard", value: string): Tab {
  const out: Tab = { ...tab };
  delete out.resource;
  delete out.page;
  delete out.dashboard;
  if (kind === "resource") {
    out.resource = value;
    if (typeof tab.type === "string") out.type = "resource";
  } else {
    out.type = kind;
    out[kind === "custom_page" ? "page" : "dashboard"] = value;
  }
  return out;
}

// ---- views ------------------------------------------------------------------------------------------
export const VIEW_LABELS: Record<string, string> = { data_table: "Table", calendar: "Calendar", gantt: "Gantt", grid: "Grid", kanban: "Kanban", map: "Map" };
export interface ViewRow { kind: "saved" | "inline"; index: number; id: string; view: string; name: string; exists: boolean }
/** The tab's views: saved ones (by id; savedViews null = not loaded, so taken to exist) and ones on the tab. */
export function viewRows(tab: Tab, saved: SavedView[] | null): ViewRow[] {
  const views = Array.isArray(tab.views) ? tab.views : [];
  const rows: ViewRow[] = [];
  views.forEach((v, index) => {
    if (typeof v === "string") {
      const s = saved?.find((x) => x.id === v);
      rows.push({ kind: "saved", index, id: v, view: s?.view ?? "", name: s?.name || (s ? VIEW_LABELS[s.view] ?? s.view : v), exists: saved === null || !!s });
    } else if (isObj(v)) {
      const type = str(v.view) || "data_table";
      rows.push({ kind: "inline", index, id: str(v.id), view: type, name: str(v.name) || VIEW_LABELS[type] || type, exists: true });
    }
  });
  return rows;
}
const firstViewKey = (views: unknown[]) => {
  const first = views[0];
  return typeof first === "string" ? first : isObj(first) ? (str(first.view) === "data_table" ? "data_table" : str(first.id)) : "";
};
/** The row of the view the tab opens with. */
export function defaultRow(rows: ViewRow[], defaultView: unknown) {
  const key = str(defaultView);
  return rows.find((r) => r.id === key) ?? (key === "data_table" || !key ? rows.find((r) => r.kind === "inline" && r.view === "data_table") : undefined) ?? rows[0] ?? null;
}
export const reorderViews = (tab: Tab, order: number[]): Tab => {
  const views = Array.isArray(tab.views) ? tab.views : [];
  return { ...tab, views: order.map((i) => views[i]).filter((v) => v !== undefined) };
};
/** Removes one view; if it was the default, the first left becomes the default. */
export function removeView(tab: Tab, index: number): Tab {
  const views = Array.isArray(tab.views) ? [...tab.views] : [];
  const [gone] = views.splice(index, 1);
  const out: Tab = { ...tab, views };
  const goneId = typeof gone === "string" ? gone : isObj(gone) ? str(gone.id) : "";
  if (goneId && str(tab.default_view) === goneId) out.default_view = firstViewKey(views);
  return out;
}
export function addSavedView(tab: Tab, id: string): Tab {
  const views = Array.isArray(tab.views) ? tab.views : [];
  if (views.includes(id)) return tab;
  const out: Tab = { ...tab, views: [...views, id] };
  if (!views.length) out.default_view = id;
  return out;
}
export function addTableView(tab: Tab, now = Date.now()): Tab {
  const views = Array.isArray(tab.views) ? tab.views : [];
  const out: Tab = { ...tab, views: [...views, { id: `inline-${now}`, name: "Table", view: "data_table", details: { aggregations: [], table_columns: [] } }] };
  if (!views.length) out.default_view = "data_table";
  return out;
}
const tableIndex = (tab: Tab) => {
  const views = Array.isArray(tab.views) ? tab.views : [];
  const d = views.findIndex((v) => isObj(v) && str(v.id) && str(v.id) === str(tab.default_view));
  return d >= 0 && isObj(views[d]) && str((views[d] as Tab).view) === "data_table" ? d : views.findIndex((v) => isObj(v) && str(v.view) === "data_table");
};
export const hasTable = (tab: Tab) => tableIndex(tab) >= 0;
/** The columns chosen for the tab's own table. */
export function tableColumns(tab: Tab): string[] {
  const i = tableIndex(tab);
  if (i < 0) return [];
  const details = ((tab.views as Tab[])[i]?.details ?? {}) as Tab;
  return Array.isArray(details.table_columns) ? details.table_columns.filter((c): c is string => typeof c === "string") : [];
}
export function setTableColumns(tab: Tab, columns: string[]): Tab {
  const i = tableIndex(tab);
  if (i < 0) return tab;
  const views = [...(tab.views as Tab[])];
  const view = { ...views[i] };
  view.details = { ...((view.details as Tab) ?? {}), table_columns: [...columns] };
  views[i] = view;
  return { ...tab, views };
}
export function moveItem<T>(list: T[], from: number, to: number): T[] {
  const copy = [...list];
  if (from < 0 || from >= copy.length || to < 0 || to >= copy.length || from === to) return copy;
  const [x] = copy.splice(from, 1);
  copy.splice(to, 0, x);
  return copy;
}

// ---- new saved views -----------------------------------------------------------------------------------
export const VIEW_TYPES = [
  { type: "data_table", label: "Table", description: "Rows and columns." },
  { type: "calendar", label: "Calendar", description: "Records placed on a calendar by a start and end date." },
  { type: "gantt", label: "Gantt", description: "Records as bars on a timeline, from a start to an end date." },
  { type: "kanban", label: "Kanban", description: "Cards in columns, one column per workflow stage." },
  { type: "grid", label: "Grid", description: "Cards in a grid, grouped by workflow stage." },
  { type: "map", label: "Map", description: "Records as markers, from a latitude and a longitude field." },
];
/** Fields every record has, whether or not the resource lists them. */
export const BUILT_IN_FIELDS = ["created_at", "updated_at", "id"];
export interface ViewSpec { type: string; name: string; resource: string; defaultMode?: string; start?: string; end?: string; title?: string; subtitle?: string; progress?: string; latitude?: string; longitude?: string; columns?: string[] }
/** What still stops a new view being created. */
export function newViewProblems(spec: ViewSpec, fields: Set<string> | null) {
  const problems: string[] = [];
  if (!spec.resource) problems.push("Choose the resource first.");
  const need = (field: string | undefined, what: string) => {
    if (!field) return problems.push(`Choose the ${what}.`);
    if (fields && !fields.has(field) && !BUILT_IN_FIELDS.includes(field)) problems.push(`${field} is not a field of ${spec.resource}.`);
  };
  if (spec.type === "calendar" || spec.type === "gantt") {
    need(spec.start, "start date field");
    need(spec.end, "end date field");
    need(spec.title, "field that names each record");
  } else if (spec.type === "kanban" || spec.type === "grid") need(spec.title, "field for the card heading");
  else if (spec.type === "map") {
    need(spec.latitude, "latitude field");
    need(spec.longitude, "longitude field");
  }
  for (const c of spec.columns ?? []) if (fields && !fields.has(c) && !BUILT_IN_FIELDS.includes(c)) problems.push(`${c} is not a field of ${spec.resource}.`);
  return problems;
}
export const isDateType = (t: string | null) => !!t && /date|time/i.test(t);

// ---- filters --------------------------------------------------------------------------------------------
export type FilterOp = "=" | "!=" | "!=set" | "is_missing" | "is_me";
export interface Condition { field: string; op: FilterOp; value: string }
export interface FilterModel { join: "AND" | "OR"; conditions: Condition[] }
export const FILTER_OPS: { op: FilterOp; label: string; needsValue: boolean }[] = [
  { op: "=", label: "is", needsValue: true },
  { op: "!=", label: "is not (or is empty)", needsValue: true },
  { op: "!=set", label: "is not (and is set)", needsValue: true },
  { op: "is_missing", label: "is empty", needsValue: false },
  { op: "is_me", label: "is the signed-in user", needsValue: false },
];
/** The instance replaces this with the signed-in user's id. */
const ME = "{{_util.user.id}}";
const qualified = (field: string, resource: string, dialect: string) => (dialect === "prefixed" ? `${resource.toLowerCase()}.${field}` : field);
const literal = (v: string) => (/^(true|false|-?\d+(\.\d+)?)$/.test(v.trim()) ? v.trim() : JSON.stringify(v));
/** The condition builder's model as a filter in Saturn's filter language. */
export function buildFilter(model: FilterModel, resource: string, dialect: string) {
  const clauses = model.conditions.filter((c) => c.field.trim()).map((c) => {
    const f = qualified(c.field.trim(), resource, dialect);
    switch (c.op) {
      case "is_missing": return `${f} IS MISSING`;
      case "is_me": return `${f} = ${JSON.stringify(ME)}`;
      // "is not" also matches records without the field
      case "!=": return `(${f} != ${literal(c.value)} OR ${f} IS MISSING)`;
      case "!=set": return `${f} != ${literal(c.value)}`;
      default: return `${f} = ${literal(c.value)}`;
    }
  });
  return clauses.length ? clauses.join(` ${model.join} `) : "";
}
/** Splits a filter on a top-level AND / OR, skipping quoted text and parentheses. */
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
    if (ch === '"' || ch === "'") { quote = ch; continue; }
    if (ch === "(") { depth++; continue; }
    if (ch === ")") { depth--; continue; }
    if (depth === 0 && text.slice(i, i + keyword.length + 2).toUpperCase() === ` ${keyword} `) {
      parts.push(text.slice(start, i));
      start = i + keyword.length + 2;
      i += keyword.length;
    }
  }
  parts.push(text.slice(start));
  return parts.map((p) => p.trim()).filter(Boolean);
}
function unquote(text: string) {
  const t = text.trim();
  if (t.startsWith('"') && t.endsWith('"')) {
    try { return JSON.parse(t) as string; } catch { return t.slice(1, -1); }
  }
  return t.startsWith("'") && t.endsWith("'") ? t.slice(1, -1) : t;
}
const bare = (f: string) => (f.includes(".") ? f.slice(f.indexOf(".") + 1) : f);
const FIELD = "([A-Za-z_][\\w]*(?:\\.[A-Za-z_][\\w]*)?)";
function parseCondition(text: string): Condition | null {
  let clause = text.trim();
  const notOr = new RegExp(`^\\(\\s*${FIELD}\\s*!=\\s*(.+?)\\s+OR\\s+${FIELD}\\s+IS\\s+MISSING\\s*\\)$`, "i").exec(clause);
  if (notOr && bare(notOr[1]) === bare(notOr[3])) return { field: bare(notOr[1]), op: "!=", value: unquote(notOr[2]) };
  while (clause.startsWith("(") && clause.endsWith(")")) clause = clause.slice(1, -1).trim();
  if (splitTop(clause, "AND").length > 1 || splitTop(clause, "OR").length > 1) return null;
  const missing = new RegExp(`^${FIELD}\\s+IS\\s+MISSING$`, "i").exec(clause);
  if (missing) return { field: bare(missing[1]), op: "is_missing", value: "" };
  const cmp = new RegExp(`^${FIELD}\\s*(!=|=)\\s*("(?:[^"\\\\]|\\\\.)*"|'[^']*'|[\\w.{}-]+)$`).exec(clause);
  if (!cmp) return null;
  const value = unquote(cmp[3]);
  if (cmp[2] === "=" && value === ME) return { field: bare(cmp[1]), op: "is_me", value: "" };
  return { field: bare(cmp[1]), op: cmp[2] === "!=" ? "!=set" : "=", value };
}
/** A filter as the builder's model; null when it's too involved (mixed AND / OR, nesting, other operators). */
export function parseFilter(text: string): FilterModel | null {
  const t = text.trim();
  if (!t) return { join: "AND", conditions: [] };
  for (const join of ["AND", "OR"] as const) {
    const parts = splitTop(t, join);
    if (parts.length > 1 || join === "OR") {
      if (parts.some((p) => /\s(AND|OR)\s/i.test(p.replace(/\([^()]*\)/g, "")))) continue;
      const conditions = parts.map(parseCondition);
      if (conditions.every((c) => c !== null)) return { join: parts.length > 1 ? join : "AND", conditions: conditions as Condition[] };
    }
  }
  return null;
}
/** The field names a filter compares. */
function filterFields(filter: string) {
  const names = new Set<string>();
  const unq = filter.replace(/"(?:[^"\\]|\\.)*"|'[^']*'/g, '""');
  for (const m of unq.matchAll(/([A-Za-z_][\w]*(?:\.[A-Za-z_][\w]*)?)\s*(?:!=|=|\bIS\b)/g)) {
    const f = bare(m[1]);
    if (!/^(AND|OR|NOT|IS|MISSING|true|false)$/i.test(f)) names.add(f);
  }
  return [...names];
}

// ---- sub-tabs -------------------------------------------------------------------------------------------
export const subTabs = (tab: Tab): Tab[] => (Array.isArray(tab.sub_menus) ? tab.sub_menus.filter(isObj) : []);

// ---- access rules ---------------------------------------------------------------------------------------
export const RULE_KINDS: Record<string, { label: string; icon: { __name: string; name: string }; kind: "ids" | "code" }> = {
  user_group: { label: "User Group", icon: { __name: "folder", name: "Folder" }, kind: "ids" },
  user: { label: "User", icon: { __name: "user", name: "User" }, kind: "ids" },
  permission: { label: "Permission", icon: { __name: "key", name: "Key" }, kind: "ids" },
  function: { label: "Custom Function", icon: { __name: "document", name: "Document" }, kind: "code" },
};
const known = (method: string) => Object.prototype.hasOwnProperty.call(RULE_KINDS, method);
/** Whether Custom Function code (comments removed) only returns true, so it restricts nobody. */
export function allowsAll(code: string) {
  const plain = code.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/[^\n]*/g, "");
  const body = (/=>\s*\{?([\s\S]*?)\}?\s*$/.exec(plain.trim())?.[1] ?? plain).trim();
  return /^return\s+true\s*;?$/.test(body) || /^true\s*;?$/.test(body);
}
export interface RuleRow { method: string; label: string | null; data: string[]; known: boolean }
/** Stored rules as rows (the instance spells the label key "lable"). */
export const ruleRows = (rules: Rule[]): RuleRow[] =>
  rules.map((r) => ({ method: r.method, label: str(r.lable) || str(r.label) || (known(r.method) ? RULE_KINDS[r.method].label : null), data: r.data, known: known(r.method) }));
/** Rows back to stored rules: known methods rebuilt with the app's label and icon; others kept as stored. */
export function rulesToSave(rows: { method: string; data: string[] }[], original: Rule[]): Rule[] {
  return rows.map((row) => {
    const stored = original.find((r) => r.method === row.method);
    if (known(row.method)) {
      const k = RULE_KINDS[row.method];
      return { ...(stored ?? {}), method: row.method, data: row.data.filter((d) => d.trim()), lable: k.label, icon: { ...k.icon } };
    }
    if (!stored) throw new Error(`A "${row.method}" rule can't be created here. Set it up in Saturn.`);
    return stored;
  });
}
/** One line saying who may see a menu. */
export const accessSummary = (rules: Rule[]) =>
  !rules.length ? "Everyone" : ruleRows(rules).map((r) => (r.method === "function" ? r.label ?? r.method : `${r.label ?? r.method} (${r.data.length})`)).join(" · ");

// ---- checks ---------------------------------------------------------------------------------------------
/** The setting a problem is about, so it can show under it. */
export type ProblemField = "label" | "icon" | "access" | "target" | "caption" | "views" | "filter" | "columns";
export interface Problem { level: "error" | "warning"; tab: number | null; sub: number | null; field: ProblemField; message: string }
export interface CheckContext {
  resources: Set<string> | null;
  fields: Map<string, Set<string>>;
  groups: Set<string> | null;
  pages: Map<string, Page> | null;
  savedViews: SavedView[] | null;
  iconExists: (name: string) => boolean;
}
/** A menu's problems: its label, icon and access rules, then every tab and sub-tab. Errors block saving. */
export function checkMenu(menu: MenuBody, ctx: CheckContext): Problem[] {
  const out: Problem[] = [];
  const add = (level: Problem["level"], field: ProblemField, message: string) => out.push({ level, tab: null, sub: null, field, message });
  if (!menu.label.trim()) add("error", "label", "The menu needs a label.");
  if (!menu.icon.trim()) add("error", "icon", "The menu needs an icon. Without one it shows blank.");
  else if (!ctx.iconExists(menu.icon)) add("error", "icon", `"${menu.icon}" is not a Font Awesome icon name.`);
  if (menu.access_control.some((r) => r.method === "function" && r.data.some(allowsAll))) add("warning", "access", "A Custom Function rule returns true for everyone, so it restricts nothing.");
  if (ctx.groups) {
    const missing = menu.access_control.filter((r) => r.method === "user_group").flatMap((r) => r.data).filter((g) => !ctx.groups!.has(g));
    if (missing.length) add("warning", "access", `Visible to ${missing.length} user group${missing.length === 1 ? "" : "s"} that no longer exist${missing.length === 1 ? "s" : ""}.`);
  }
  checkTabs(menu.references, null, ctx, out);
  menu.references.forEach((tab, i) => checkTabs(subTabs(tab), i, ctx, out));
  return out;
}
function checkTabs(tabs: Tab[], parent: number | null, ctx: CheckContext, out: Problem[]) {
  // resources some tab filters: an unfiltered tab beside them is worth a warning
  const filtered = new Set(tabs.filter((t) => str(t.filter).trim()).map((t) => tabTarget(t).value));
  tabs.forEach((tab, i) => {
    const where = parent === null ? { tab: i, sub: null } : { tab: parent, sub: i };
    const add = (level: Problem["level"], field: ProblemField, message: string) => out.push({ level, ...where, field, message });
    const target = tabTarget(tab);
    if (target.kind === "unknown" || !target.value) return add("error", "target", `Choose what this ${parent === null ? "tab" : "sub-tab"} opens.`);
    if (!tabCaption(tab)) add("warning", "caption", "No caption, so it may show up without a name.");
    if (target.kind === "custom_page") {
      if (!ctx.pages) return;
      const page = ctx.pages.get(target.value);
      if (!page) add("error", "target", `There is no custom page "${target.value}".`);
      else if (!page.enabled) add("warning", "target", `The custom page "${page.title}" is switched off, so the tab opens nothing.`);
      return;
    }
    if (target.kind !== "resource") return;
    if (ctx.resources && !ctx.resources.has(target.value)) return add("error", "target", `There is no resource called ${target.value}.`);
    if (ctx.savedViews) {
      const rows = viewRows(tab, ctx.savedViews);
      if (!rows.length) add("warning", "views", "No view, so it has nothing to show the records in.");
      for (const row of rows.filter((r) => r.kind === "saved")) {
        const s = ctx.savedViews.find((v) => v.id === row.id);
        if (!s) add("warning", "views", `A saved view it lists (${row.id.slice(0, 22)}…) no longer exists.`);
        else if (s.resource && s.resource !== target.value) add("warning", "views", `The ${VIEW_LABELS[s.view] ?? s.view} "${row.name}" is for ${s.resource}, not ${target.value}.`);
      }
    }
    const filter = str(tab.filter);
    if (!filter.trim() && filtered.has(target.value)) add("warning", "filter", "No filter, beside filtered tabs on the same resource: it shows everything they narrow down.");
    const fields = ctx.fields.get(target.value);
    if (!fields) return;
    const unknownFields = filterFields(filter).filter((f) => !fields.has(f));
    if (unknownFields.length) add("warning", "filter", `The filter names ${unknownFields.join(", ")}, which ${target.value} doesn't have, so it matches nothing.`);
    const unknownColumns = tableColumns(tab).filter((c) => !fields.has(c));
    if (unknownColumns.length) add("warning", "columns", `Columns ${unknownColumns.join(", ")} are not fields of ${target.value}.`);
  });
}

// ---- the tab tree as the screen edits it ------------------------------------------------------------------
/** A tab in the screen's tree: a fixed id (so it stays picked as it moves), the tab as stored (its own
 *  sub_menus value is ignored: `subs` holds them), whether it had a sub_menus key, its sub-tabs, and
 *  whether it's removed (crossed out until Save). Keeping the tab whole keeps its keys in their order,
 *  so a menu that wasn't changed is written back exactly as it was read. */
export interface Node { id: string; tab: Tab; hadSubs: boolean; subs: Node[]; removed: boolean }
/** A menu's tabs as a tree; ids are made from the menu id and the place, so a menu not yet edited keeps them. */
export function treeOf(menuId: string, references: Tab[]): Node[] {
  const node = (tab: Tab, id: string, subs: Node[]): Node => ({ id, tab, hadSubs: tab.sub_menus !== undefined, subs, removed: false });
  return references.map((tab, i) => node(tab, `${menuId}:${i}`, subTabs(tab).map((s, j) => node(s, `${menuId}:${i}.${j}`, []))));
}
/** A node as a stored tab: with these sub-tabs, or (for a sub-tab) its sub_menus left as they were. */
function tabOf(n: Node, subs: Tab[] | "keep"): Tab {
  if (subs === "keep") return n.tab;
  const t: Tab = { ...n.tab };
  if (subs.length || n.hadSubs) t.sub_menus = subs;
  else delete t.sub_menus;
  return t;
}
/** The tree back to the references Saturn stores (removed tabs left out), and where each tab ended up. */
export function referencesOf(nodes: Node[]): { references: Tab[]; places: Map<string, { tab: number; sub: number | null }> } {
  const places = new Map<string, { tab: number; sub: number | null }>();
  const references = nodes
    .filter((n) => !n.removed)
    .map((n, i) => {
      places.set(n.id, { tab: i, sub: null });
      const subs = n.subs.filter((s) => !s.removed);
      subs.forEach((s, j) => places.set(s.id, { tab: i, sub: j }));
      return tabOf(n, subs.map((s) => tabOf(s, "keep")));
    });
  return { references, places };
}
/** Every node, top-level ones first in order with their sub-tabs right after. */
export const flat = (nodes: Node[]) => nodes.flatMap((n) => [n, ...n.subs]);
/** The node with this id and the list it's in. */
export function find(nodes: Node[], id: string): { node: Node; parent: Node | null } | null {
  for (const n of nodes) {
    if (n.id === id) return { node: n, parent: null };
    for (const s of n.subs) if (s.id === id) return { node: s, parent: n };
  }
  return null;
}
