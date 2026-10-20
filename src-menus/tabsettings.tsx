// The settings of the picked tab (or tabs), on the right of the Menus screen, in the Resources
// screen's style: sections as cards, one row per setting (name and hint on the left, the control on
// the right), switches for on/off, cards for a few choices. A problem shows under the setting it's
// about. With several tabs picked, only the settings they can share are shown; one they don't
// share shows Mixed.
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Cards, Switch } from "../src-res/editor";
import { IconField } from "../src-res/icons";
import {
  BUILT_IN_FIELDS, FILTER_OPS, VIEW_LABELS, VIEW_TYPES, addSavedView, addTableView, buildFilter, captionFor, customPageTab, defaultRow, hasTable, isDateType,
  moveItem, newResourceTab, newViewProblems, parseFilter, removeView, reorderViews, same, setTableColumns, setTarget, tabCaption, tabTarget, tableColumns, viewRows,
  type Field, type FilterModel, type Page, type Problem, type ProblemField, type SavedView, type Tab, type ViewSpec,
} from "./model";

export interface Host {
  resources: string[] | null;
  pages: Page[] | null;
  savedViews: SavedView[] | null;
  dialect: string;
  fields: Map<string, Field[]>;
  loadFields: (resource: string) => void;
  count: (resource: string, filter: string) => Promise<{ count: number | null; error?: string }>;
  createView: (spec: ViewSpec) => Promise<{ view?: SavedView; error?: string }>;
}

/** The problems a row shows, under it. */
export function Problems(props: { list: Problem[] }) {
  if (!props.list.length) return null;
  return (
    <ul className="mn-problems">
      {props.list.map((p, i) => (
        <li key={i} className={`is-${p.level}`}><Mark level={p.level} /> {p.message}</li>
      ))}
    </ul>
  );
}
/** A red (error) or yellow (warning) triangle. */
export function Mark(props: { level: "error" | "warning"; title?: string }) {
  return <span className={`mn-mark is-${props.level}`} title={props.title} aria-label={props.title ?? (props.level === "error" ? "Error" : "Warning")} role="img">▲</span>;
}

/** One setting: name and hint on the left, the control on the right (or underneath when wide), problems under it. */
export function Row(props: { label: string; hint?: ReactNode; id?: string; wide?: boolean; mixed?: boolean; problems?: Problem[]; children: ReactNode }) {
  const bad = props.problems?.some((p) => p.level === "error") ? " is-error" : props.problems?.length ? " is-warning" : "";
  return (
    <div className={`pe-row${props.wide ? " is-wide" : ""}${bad}`}>
      {props.wide ? (
        <>
          <div className="pe-text">
            <label className="pe-label" htmlFor={props.id}>{props.label}{props.mixed && <span className="pe-mixed">Mixed</span>}</label>
            {props.hint && <span className="pe-hint">{props.hint}</span>}
          </div>
          <div className="pe-control">{props.children}</div>
        </>
      ) : (
        <>
          <div className="pe-text">
            <label className="pe-label" htmlFor={props.id}>{props.label}{props.mixed && <span className="pe-mixed">Mixed</span>}</label>
            {props.hint && <span className="pe-hint">{props.hint}</span>}
          </div>
          <div className="pe-control">{props.children}</div>
        </>
      )}
      {props.problems && props.problems.length > 0 && <div className="mn-row-problems"><Problems list={props.problems} /></div>}
    </div>
  );
}
/** A titled card of rows. */
export function Section(props: { title: string; blurb?: string; children: ReactNode; id?: string }) {
  return (
    <div className="pe-block" data-sec={props.id}>
      <h3 className="pe-part-title">{props.title}</h3>
      {props.blurb && <p className="pe-blurb">{props.blurb}</p>}
      <div className="pe-card">{props.children}</div>
    </div>
  );
}

const str = (v: unknown) => (typeof v === "string" ? v : "");
const FLAGS: [string, string, string][] = [
  ["openOnCreate", "Open the record after creating it", "After someone creates a record here, its page opens."],
  ["disableBatchActions", "Turn off batch actions", "No actions on several records at once."],
  ["reloadOnStatusChange", "Reload when a status changes", "The list reads its records again when one moves stage."],
];

/** The settings of one tab, or what several tabs can share. `problems` are the picked tabs' problems. */
export function TabSettings(props: { tabs: Tab[]; nested: boolean; parentName?: string; host: Host; problems: Problem[]; onChange: (tabs: Tab[]) => void; onPickParent?: () => void }) {
  const { tabs, host } = props;
  const one = tabs.length === 1 ? tabs[0] : null;
  const of = (f: ProblemField) => props.problems.filter((p) => p.field === f);
  /** a value they all share, or null for Mixed */
  const shared = (get: (t: Tab) => unknown) => (tabs.every((t) => same(get(t), get(tabs[0]))) ? get(tabs[0]) : null);
  const mixed = (get: (t: Tab) => unknown) => !tabs.every((t) => same(get(t), get(tabs[0])));
  const patchAll = (patch: Tab) => props.onChange(tabs.map((t) => ({ ...t, ...patch })));

  const look = (
    <Section title="Look" id="look">
      <Row label="Tab icon" hint="Shown before the caption." mixed={mixed((t) => t.tab_icon)}>
        <IconField label="Tab icon" allowEmpty mixed={mixed((t) => t.tab_icon)} value={str(shared((t) => t.tab_icon))} onChange={(n) => patchAll({ tab_icon: n })} />
      </Row>
      <ColourRow label="Tab colour" mixed={mixed((t) => t.tab_bg_color)} value={str(shared((t) => t.tab_bg_color))} onChange={(c) => patchAll({ tab_bg_color: c })} />
      <ColourRow label="Active tab colour" mixed={mixed((t) => t.tab_active_bg_color)} value={str(shared((t) => t.tab_active_bg_color))} onChange={(c) => patchAll({ tab_active_bg_color: c })} />
    </Section>
  );
  const allResources = tabs.every((t) => tabTarget(t).kind === "resource" || tabTarget(t).kind === "unknown");
  const behaviour = allResources && (
    <Section title="Behaviour" id="behaviour">
      <Row label="Create button label" hint="Empty keeps the default." id="mn-create-label" mixed={mixed((t) => t.create_label)}>
        <input id="mn-create-label" className="pe-input" placeholder={mixed((t) => t.create_label) ? "Mixed" : "Default"} value={str(shared((t) => t.create_label))} onChange={(e) => patchAll({ create_label: e.target.value })} />
      </Row>
      {FLAGS.map(([key, label, hint]) => (
        <Row key={key} label={label} hint={hint} id={`mn-flag-${key}`}>
          <Switch id={`mn-flag-${key}`} label={label} on={tabs.every((t) => t[key] === true)} mixed={mixed((t) => t[key] === true)} onSet={(v) => patchAll({ [key]: v })} />
        </Row>
      ))}
    </Section>
  );

  if (!one) {
    return (
      <>
        <p className="pe-many">Editing {tabs.length} tabs. A change here goes to all of them; a setting they don't share shows Mixed. Pick one tab to change what it opens, its caption, filter and views.</p>
        {look}
        {behaviour}
      </>
    );
  }
  return <OneTab {...props} tab={one} look={look} behaviour={behaviour} of={of} />;
}

function OneTab(props: { tab: Tab; nested: boolean; parentName?: string; host: Host; onChange: (tabs: Tab[]) => void; onPickParent?: () => void; look: ReactNode; behaviour: ReactNode; of: (f: ProblemField) => Problem[] }) {
  const { tab, host, of } = props;
  const set = (t: Tab) => props.onChange([t]);
  const patch = (p: Tab) => set({ ...tab, ...p });
  const target = tabTarget(tab);
  const kind = target.kind === "unknown" ? "resource" : target.kind;
  const resource = target.kind === "resource" ? target.value : "";
  useEffect(() => { if (resource) host.loadFields(resource); }, [resource, host]);
  const fields = resource ? host.fields.get(resource) ?? null : null;
  const changeKind = (k: string) => {
    const caption = tabCaption(tab);
    if (k === kind) return;
    if (k === "custom_page") return set(customPageTab(null, caption));
    if (k === "resource") return set(newResourceTab("", caption));
    set(setTarget(tab, "dashboard", ""));
  };
  const choosePage = (slug: string) => {
    const page = host.pages?.find((p) => p.slug === slug) ?? { slug, title: slug, enabled: true };
    set(customPageTab(page, tabCaption(tab) || page.title, tab));
  };
  const known = new Set(["type", "resource", "page", "dashboard", "resource_label", "title", "filter", "views", "default_view", "tab_icon", "tab_bg_color", "tab_active_bg_color", "create_label", "openOnCreate", "disableBatchActions", "reloadOnStatusChange", "sub_menus"]);
  const others = Object.keys(tab).filter((k) => !known.has(k));

  return (
    <>
      {props.nested && props.parentName && (
        <p className="mn-sub-of">Sub-tab of <button type="button" className="rs-link" onClick={props.onPickParent}>{props.parentName}</button></p>
      )}
      <Section title="What it opens" id="opens">
        <Row label="Opens" wide>
          <Cards label="Opens" value={kind} options={[["resource", "A resource", "Its records, in views."], ["custom_page", "A custom page", "A page built in Saturn."], ["dashboard", "A dashboard", "By its id."]]} onPick={changeKind} />
        </Row>
        {kind === "custom_page" ? (
          <Row label="Custom page" id="mn-page" hint={host.pages ? undefined : "Custom pages couldn't be listed; type the page's slug."} problems={of("target")}>
            {host.pages ? (
              <select id="mn-page" className="pe-input" value={target.value} onChange={(e) => choosePage(e.target.value)}>
                {!target.value && <option value="">Pick a custom page</option>}
                {target.value && !host.pages.some((p) => p.slug === target.value) && <option value={target.value}>{target.value} (not found)</option>}
                {host.pages.map((p) => <option key={p.slug} value={p.slug}>{p.title}{p.title !== p.slug ? ` (${p.slug})` : ""}{p.enabled ? "" : " (switched off)"}</option>)}
              </select>
            ) : <input id="mn-page" className="pe-input" value={target.value} onChange={(e) => choosePage(e.target.value)} />}
          </Row>
        ) : kind === "dashboard" ? (
          <Row label="Dashboard id" id="mn-dash" hint="Check the tab shows it once saved." problems={of("target")}>
            <input id="mn-dash" className="pe-input is-mono" value={target.value} onChange={(e) => set(setTarget(tab, "dashboard", e.target.value))} />
          </Row>
        ) : (
          <Row label="Resource" id="mn-resource" problems={of("target")}>
            {host.resources ? (
              <select id="mn-resource" className="pe-input" value={resource} onChange={(e) => set(setTarget(tab, "resource", e.target.value))}>
                {!resource && <option value="">Pick a resource</option>}
                {resource && !host.resources.includes(resource) && <option value={resource}>{resource} (not found)</option>}
                {host.resources.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            ) : <input id="mn-resource" className="pe-input" value={resource} onChange={(e) => set(setTarget(tab, "resource", e.target.value))} />}
          </Row>
        )}
        <Row label="Caption" id="mn-caption" hint={kind === "custom_page" ? "The tab's name." : "The tab's name. Saturn stores it as HTML; that's kept."} problems={of("caption")}>
          <input id="mn-caption" className="pe-input" placeholder={target.value || "Caption"} value={tabCaption(tab)} onChange={(e) => patch({ resource_label: captionFor(tab, e.target.value) })} />
        </Row>
      </Section>
      {kind === "resource" && resource && (
        <>
          <Section title="Filter" id="filter" blurb="Which records the tab shows. Who may read them is set by the resource's own access rules.">
            <Row label="Records shown" wide problems={of("filter")}>
              <FilterEditor resource={resource} value={str(tab.filter)} onChange={(f) => patch({ filter: f })} host={host} />
            </Row>
          </Section>
          <Section title="Views" id="views" blurb="How the records are shown, and which view opens first.">
            <Row label="Views" wide problems={of("views")}>
              <ViewsEditor tab={tab} resource={resource} host={host} onChange={set} />
            </Row>
            <Row label="Columns" wide hint={hasTable(tab) ? "The table's columns, in order. None picked: Saturn's default columns." : "This tab has no table of its own, so it has no columns to pick."} problems={of("columns")}>
              {hasTable(tab) && <Columns tab={tab} fields={fields} resource={resource} onChange={set} />}
            </Row>
          </Section>
        </>
      )}
      {props.look}
      {props.behaviour}
      {others.length > 0 && <p className="pe-hint mn-others">Kept as they are: {others.join(", ")}.</p>}
    </>
  );
}

/** A colour as text, with a swatch you can click to pick one. */
function ColourRow(props: { label: string; value: string; mixed: boolean; onChange: (c: string) => void }) {
  const id = `mn-colour-${props.label.replace(/\W+/g, "-").toLowerCase()}`;
  const hex = /^#[0-9a-f]{6}$/i.test(props.value) ? props.value : "#000000";
  return (
    <Row label={props.label} hint="Any CSS colour. Empty: Saturn's default." id={id} mixed={props.mixed}>
      <span className="mn-colour">
        <label className="mn-swatch" style={{ background: props.value || "transparent" }} title="Pick a colour">
          <input type="color" value={hex} aria-label={`${props.label}: pick`} onChange={(e) => props.onChange(e.target.value)} />
        </label>
        <input id={id} className="pe-input is-mono" placeholder={props.mixed ? "Mixed" : "rgb(163, 63, 1)"} value={props.value} onChange={(e) => props.onChange(e.target.value)} />
      </span>
    </Row>
  );
}

/** The filter as conditions (match all / any), or as text when it's too involved to show as conditions. Counts the records it matches. */
function FilterEditor(props: { resource: string; value: string; onChange: (v: string) => void; host: Host }) {
  const { resource, value, host } = props;
  const parsed = useMemo(() => parseFilter(value), [value]);
  const [asText, setAsText] = useState(parsed === null);
  useEffect(() => { if (parsed === null) setAsText(true); }, [parsed]);
  const fields = host.fields.get(resource) ?? null;
  const [count, setCount] = useState<{ value: number | null; error?: string; busy: boolean }>({ value: null, busy: false });
  useEffect(() => {
    let gone = false;
    setCount((c) => ({ ...c, busy: true }));
    const timer = window.setTimeout(() => host.count(resource, value).then((r) => { if (!gone) setCount({ value: r.count, error: r.error, busy: false }); }), 500);
    return () => { gone = true; window.clearTimeout(timer); };
  }, [resource, value, host]);
  const model: FilterModel = parsed ?? { join: "AND", conditions: [] };
  const emit = (m: FilterModel) => props.onChange(buildFilter(m, resource, host.dialect));
  const update = (i: number, change: Partial<FilterModel["conditions"][number]>) => emit({ ...model, conditions: model.conditions.map((c, j) => (j === i ? { ...c, ...change } : c)) });
  return (
    <div className="mn-filter">
      <div className="mn-filter-head">
        <span className="pe-hint">{host.dialect === "prefixed" ? `Written as ${resource.toLowerCase()}.field, the way this instance's tabs are.` : "Written as plain field names, the way this instance's tabs are."}</span>
        {parsed !== null && <button type="button" className="rs-link" onClick={() => setAsText(!asText)}>{asText ? "Edit as conditions" : "Edit as text"}</button>}
      </div>
      {asText ? (
        <>
          <textarea className="pe-input is-mono" rows={3} spellCheck={false} aria-label="Filter" placeholder='e.g. status = "open" AND (priority != "low" OR priority IS MISSING)' value={value} onChange={(e) => props.onChange(e.target.value)} />
          {parsed === null && value.trim() && <span className="pe-hint">Too involved to show as conditions, so it's kept exactly as written.</span>}
        </>
      ) : (
        <div className="mn-conditions">
          {model.conditions.length > 1 && (
            <label className="mn-join">Match <select className="pe-input" value={model.join} onChange={(e) => emit({ ...model, join: e.target.value as "AND" | "OR" })}><option value="AND">all of these</option><option value="OR">any of these</option></select></label>
          )}
          {!model.conditions.length && <span className="pe-hint">No filter: the tab shows every record the user may list.</span>}
          {model.conditions.map((c, i) => {
            const op = FILTER_OPS.find((o) => o.op === c.op) ?? FILTER_OPS[0];
            const knownField = !fields || fields.some((f) => f.key === c.field);
            return (
              <div key={i} className="mn-condition">
                {fields ? (
                  <select className="pe-input" aria-label="Field" aria-invalid={!knownField} value={c.field} onChange={(e) => update(i, { field: e.target.value })}>
                    {!knownField && <option value={c.field}>{c.field} (not a field)</option>}
                    {fields.map((f) => <option key={f.key} value={f.key}>{f.label ? `${f.label} (${f.key})` : f.key}</option>)}
                  </select>
                ) : <input className="pe-input" aria-label="Field" placeholder="field" value={c.field} onChange={(e) => update(i, { field: e.target.value })} />}
                <select className="pe-input" aria-label="Comparison" value={c.op} onChange={(e) => update(i, { op: e.target.value as typeof c.op })}>
                  {FILTER_OPS.map((o) => <option key={o.op} value={o.op}>{o.label}</option>)}
                </select>
                {op.needsValue && <input className="pe-input" aria-label="Value" placeholder="value" value={c.value} onChange={(e) => update(i, { value: e.target.value })} />}
                <button type="button" className="rs-x" title="Remove this condition" aria-label="Remove this condition" onClick={() => emit({ ...model, conditions: model.conditions.filter((_, j) => j !== i) })}>×</button>
              </div>
            );
          })}
          <button type="button" className="rs-btn rs-add mn-add-small" title="Add a condition" aria-label="Add a condition" onClick={() => emit({ ...model, conditions: [...model.conditions, { field: fields?.[0]?.key ?? "", op: "=", value: "" }] })}>+</button>
        </div>
      )}
      <span className={`mn-count${count.value === 0 && !count.busy ? " is-zero" : ""}`} title={count.error}>
        {count.busy ? "Counting…" : count.value !== null ? `Matches ${count.value.toLocaleString()} record${count.value === 1 ? "" : "s"}${count.value === 0 ? ". Check the values against the real data or workflow stages." : ""}` : count.error ? "Couldn't count" : "Count not available"}
      </span>
    </div>
  );
}

/** The tab's views: which opens first, reorder (drag or Alt+↑/↓), remove, add a saved view or a table, create a new view. */
function ViewsEditor(props: { tab: Tab; resource: string; host: Host; onChange: (t: Tab) => void }) {
  const { tab, resource, host } = props;
  const [creating, setCreating] = useState(false);
  const [drag, setDrag] = useState<number | null>(null);
  const [dropAt, setDropAt] = useState<number | null>(null);
  const rows = viewRows(tab, host.savedViews);
  const first = defaultRow(rows, tab.default_view);
  const used = new Set(rows.map((r) => r.id));
  const available = (host.savedViews ?? []).filter((v) => v.resource === resource && !used.has(v.id)).sort((a, b) => a.view.localeCompare(b.view) || a.name.localeCompare(b.name));
  const hasOwnTable = rows.some((r) => r.kind === "inline" && r.view === "data_table");
  const move = (from: number, to: number) => {
    const order = rows.map((r) => r.index);
    const [x] = order.splice(from, 1);
    order.splice(to > from ? to - 1 : to, 0, x);
    props.onChange(reorderViews(tab, order));
  };
  return (
    <div className="mn-views">
      {!rows.length && <span className="pe-hint">No view yet. Add one so the tab has something to show.</span>}
      <div className="mn-view-list" role="listbox" aria-label="Views">
        {rows.map((r, pos) => (
          <div key={`${r.index}-${r.id}`}>
            {dropAt === pos && drag !== null && <div className="rs-drop" />}
            <div
              className={`mn-view${r.exists ? "" : " is-missing"}${drag === pos ? " is-dragging" : ""}`}
              role="option"
              aria-selected={first?.index === r.index}
              tabIndex={0}
              draggable
              onDragStart={(e) => { setDrag(pos); e.dataTransfer.effectAllowed = "move"; e.dataTransfer.setData("text/plain", String(pos)); }}
              onDragEnd={() => { setDrag(null); setDropAt(null); }}
              onDragOver={(e) => { if (drag === null) return; e.preventDefault(); const b = e.currentTarget.getBoundingClientRect(); setDropAt(e.clientY < b.top + b.height / 2 ? pos : pos + 1); }}
              onDrop={(e) => { e.preventDefault(); if (drag !== null && dropAt !== null) move(drag, dropAt); setDrag(null); setDropAt(null); }}
              onKeyDown={(e) => {
                if (e.altKey && e.key === "ArrowUp" && pos > 0) { e.preventDefault(); move(pos, pos - 1); }
                if (e.altKey && e.key === "ArrowDown" && pos < rows.length - 1) { e.preventDefault(); move(pos, pos + 2); }
              }}
              title="Drag to reorder (or Alt+↑ / Alt+↓)"
            >
              <span className="rs-grip" aria-hidden="true" />
              <span className="mn-view-name">{r.name}<small>{r.kind === "inline" ? "on this tab" : r.exists ? `saved ${VIEW_LABELS[r.view]?.toLowerCase() ?? "view"}` : "missing"}</small></span>
              <button type="button" className={`mn-first${first?.index === r.index ? " is-on" : ""}`} title="The view the tab opens with" aria-pressed={first?.index === r.index}
                onClick={() => props.onChange({ ...tab, default_view: r.kind === "inline" && r.view === "data_table" && r.id === "" ? "data_table" : r.id })}>
                Opens first
              </button>
              <button type="button" className="rs-x" title={r.kind === "saved" ? "Remove from this tab (the saved view is kept)" : "Remove this table"} aria-label={`Remove ${r.name}`} onClick={() => props.onChange(removeView(tab, r.index))}>×</button>
            </div>
          </div>
        ))}
        {dropAt === rows.length && drag !== null && <div className="rs-drop" />}
      </div>
      <div className="mn-view-add">
        <select className="pe-input" aria-label="Add a view" value="" onChange={(e) => { const v = e.target.value; if (v === "__table") props.onChange(addTableView(tab)); else if (v) props.onChange(addSavedView(tab, v)); }}>
          <option value="">Add a view…</option>
          {!hasOwnTable && <option value="__table">A table on this tab</option>}
          {available.length > 0 && <optgroup label={`Saved views of ${resource}`}>{available.map((v) => <option key={v.id} value={v.id}>{VIEW_LABELS[v.view] ?? v.view}{v.name ? `: ${v.name}` : ""}</option>)}</optgroup>}
        </select>
        {!creating && <button type="button" className="rs-btn" onClick={() => setCreating(true)}>New view</button>}
      </div>
      {host.savedViews === null && <span className="pe-hint">Saved views couldn't be listed, so only a table can be added.</span>}
      {creating && <NewView resource={resource} host={host} onCancel={() => setCreating(false)} onCreated={(v) => { setCreating(false); props.onChange(addSavedView(tab, v.id)); }} />}
    </div>
  );
}

/** Creates a saved view of the resource on the instance (now); the tab lists it when the menu is saved. */
function NewView(props: { resource: string; host: Host; onCancel: () => void; onCreated: (v: SavedView) => void }) {
  const { resource, host } = props;
  const [spec, setSpec] = useState<ViewSpec>({ type: "calendar", name: "", resource, defaultMode: "week" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fields = host.fields.get(resource) ?? null;
  const problems = newViewProblems(spec, fields ? new Set(fields.map((f) => f.key)) : null);
  const up = (p: Partial<ViewSpec>) => setSpec({ ...spec, ...p });
  const type = VIEW_TYPES.find((t) => t.type === spec.type)!;
  const dateFirst = [...(fields ?? []).filter((f) => isDateType(f.type)), ...(fields ?? []).filter((f) => !isDateType(f.type))];
  const pick = (label: string, key: keyof ViewSpec, options: Field[], optional = false) => (
    <Row label={label + (optional ? " (optional)" : "")} id={`mn-nv-${key}`}>
      <select id={`mn-nv-${key}`} className="pe-input" value={String(spec[key] ?? "")} onChange={(e) => up({ [key]: e.target.value })}>
        <option value="">{optional ? "None" : "Pick a field"}</option>
        {options.map((f) => <option key={f.key} value={f.key}>{f.label ? `${f.label} (${f.key})` : f.key}{f.type ? ` · ${f.type}` : ""}</option>)}
        {BUILT_IN_FIELDS.map((f) => <option key={f} value={f}>{f} · system</option>)}
      </select>
    </Row>
  );
  return (
    <div className="mn-new-view">
      <div className="mn-new-view-head"><b>New view of {resource}</b><button type="button" className="rs-link" onClick={props.onCancel}>Cancel</button></div>
      <Cards label="View type" value={spec.type} options={VIEW_TYPES.map((t) => [t.type, t.label, t.description])} onPick={(t) => up({ type: t })} />
      {!fields && <span className="pe-hint">Reading {resource}'s fields…</span>}
      <div className="pe-card">
        <Row label="Name" id="mn-nv-name"><input id="mn-nv-name" className="pe-input" placeholder={type.label} value={spec.name} onChange={(e) => up({ name: e.target.value })} /></Row>
        {(spec.type === "calendar" || spec.type === "gantt") && (
          <>
            {pick("Starts", "start", dateFirst)}
            {pick("Ends", "end", dateFirst)}
            {pick("Named by", "title", fields ?? [])}
            {spec.type === "calendar" ? pick("Second line", "subtitle", fields ?? [], true) : pick("Progress (0–100)", "progress", fields ?? [], true)}
            <Row label="Opens showing" id="mn-nv-mode">
              <select id="mn-nv-mode" className="pe-input" value={spec.defaultMode ?? "week"} onChange={(e) => up({ defaultMode: e.target.value })}><option value="day">A day</option><option value="week">A week</option><option value="month">A month</option></select>
            </Row>
          </>
        )}
        {(spec.type === "kanban" || spec.type === "grid") && (
          <>
            {pick("Card heading", "title", fields ?? [])}
            {pick("Card sub-heading", "subtitle", fields ?? [], true)}
          </>
        )}
        {spec.type === "map" && (
          <>
            {pick("Latitude", "latitude", fields ?? [])}
            {pick("Longitude", "longitude", fields ?? [])}
            {pick("Marker label", "title", fields ?? [], true)}
          </>
        )}
        {(spec.type === "data_table" || spec.type === "kanban" || spec.type === "grid") && fields && (
          <Row label={spec.type === "data_table" ? "Columns (optional)" : "Fields on each card (optional)"} wide>
            <div className="pe-picks-list">
              {fields.map((f) => (
                <label key={f.key} className="pe-pick">
                  <input type="checkbox" checked={(spec.columns ?? []).includes(f.key)} onChange={() => up({ columns: (spec.columns ?? []).includes(f.key) ? (spec.columns ?? []).filter((c) => c !== f.key) : [...(spec.columns ?? []), f.key] })} />
                  <span>{f.label ?? f.key}</span><code>{f.key}</code>
                </label>
              ))}
            </div>
          </Row>
        )}
      </div>
      {spec.type === "kanban" || spec.type === "grid" ? <span className="pe-hint">Cards are grouped by workflow stage.</span> : spec.type === "map" ? <span className="pe-hint">OpenStreetMap, which needs no key. Mapbox or ArcGIS can be set up in Saturn.</span> : null}
      {problems.length > 0 && fields && <span className="pe-hint">{problems[0]}</span>}
      {error && <span className="pe-error">{error}</span>}
      <div className="pe-btns">
        <span className="pe-hint mn-grow">It's made on the instance now; the tab lists it when you save the menu.</span>
        <button type="button" className="rs-btn is-primary" disabled={problems.length > 0 || busy} onClick={async () => {
          setBusy(true);
          setError(null);
          const r = await host.createView({ ...spec, resource });
          setBusy(false);
          if (r.view) props.onCreated(r.view);
          else setError(r.error ?? "The view couldn't be made.");
        }}>{busy ? "Making…" : `Make the ${type.label.toLowerCase()}`}</button>
      </div>
    </div>
  );
}

/** The table's columns: drag (or Alt+←/→) to reorder, × to remove, a list to add one. */
function Columns(props: { tab: Tab; fields: Field[] | null; resource: string; onChange: (t: Tab) => void }) {
  const cols = tableColumns(props.tab);
  const [drag, setDrag] = useState<number | null>(null);
  const set = (next: string[]) => props.onChange(setTableColumns(props.tab, next));
  return (
    <div className="mn-columns">
      <div className="mn-chips">
        {cols.map((c, i) => {
          const ok = !props.fields || props.fields.some((f) => f.key === c);
          return (
            <span key={`${c}-${i}`} className={`mn-col${ok ? "" : " is-bad"}`} title={ok ? `${c}. Drag to reorder (or Alt+← / Alt+→)` : `${c} is not a field of ${props.resource}`} draggable tabIndex={0}
              onDragStart={() => setDrag(i)} onDragEnd={() => setDrag(null)} onDragOver={(e) => drag !== null && e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); if (drag !== null) set(moveItem(cols, drag, i)); setDrag(null); }}
              onKeyDown={(e) => {
                if (e.altKey && e.key === "ArrowLeft" && i > 0) { e.preventDefault(); set(moveItem(cols, i, i - 1)); }
                if (e.altKey && e.key === "ArrowRight" && i < cols.length - 1) { e.preventDefault(); set(moveItem(cols, i, i + 1)); }
                if (e.key === "Delete" || e.key === "Backspace") { e.preventDefault(); set(cols.filter((_, j) => j !== i)); }
              }}>
              {c}
              <button type="button" aria-label={`Remove column ${c}`} onClick={() => set(cols.filter((_, j) => j !== i))}>×</button>
            </span>
          );
        })}
      </div>
      {props.fields && (
        <select className="pe-input" aria-label="Add a column" value="" onChange={(e) => e.target.value && set([...cols, e.target.value])}>
          <option value="">Add a column…</option>
          {props.fields.filter((f) => !cols.includes(f.key)).map((f) => <option key={f.key} value={f.key}>{f.label ? `${f.label} (${f.key})` : f.key}</option>)}
        </select>
      )}
    </div>
  );
}
