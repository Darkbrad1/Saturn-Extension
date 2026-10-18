// The editor for one property, on the right of the Resources screen: a menu of its setting groups
// and their sections (spec.ts) beside one long page with all of them, like VS Code's settings.
// The menu jumps to a section and follows the scrolling; its search narrows the page. Each row
// has its name and hint on the left and its control on the right (switches for on/off, cards for
// a few choices), a dot and "was …" when it differs from what the instance has, and Put back.
// Everything is local until the screen's Save.
import { useEffect, useMemo, useRef, useState } from "react";
import { HighlightInput } from "../src/controls";
import { ALL, GROUPS, get, type Group, type Path, type Prop, type Setting } from "./spec";

export interface Field { key: string; label: string | null; type: string | null }
export interface Lookups {
  resources: string[];
  /** another resource's properties: null while they load (asking for them) */
  fieldsOf: (resource: string) => Field[] | null;
  /** this resource's properties */
  own: Field[];
  /** records of a core resource as [value, label]: null while they load */
  recordsOf: (resource: string, value: string, label: string) => [string, string][] | null;
}

/** A copy of `target` with `value` at `path` (or the last part removed). */
export function setAt(target: unknown, path: Path, value: unknown, remove = false): Prop {
  const copy: Prop = target && typeof target === "object" && !Array.isArray(target) ? { ...(target as Prop) } : {};
  const [head, ...rest] = path;
  if (!rest.length) {
    if (remove) delete copy[head];
    else copy[head] = value;
    return copy;
  }
  copy[head] = setAt(copy[head], rest, value, remove);
  return copy;
}

const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
const show = (v: unknown) => (v === undefined ? "not set" : typeof v === "boolean" ? (v ? "on" : "off") : v === "" ? "empty" : typeof v === "string" ? v : JSON.stringify(v));
const short = (s: string) => (s.length > 60 ? `${s.slice(0, 60)}…` : s);

/** How many settings of a group differ between the two. */
export function changedIn(group: Group, original: Prop, draft: Prop) {
  return group.parts.flatMap((part) => part.settings).filter((s) => !same(get(original, s.path), get(draft, s.path)) && !isQuiet(s, original)).length;
}

/** Inside a part that was just switched on (a new map, a new rule), only the switch counts as a change. */
const isQuiet = (setting: Setting, original: Prop) => setting.path.length > 1 && get(original, setting.path.slice(0, -1)) === undefined;

/** The anchor id of a group or a part of it on the page. */
const anchor = (group: string, part?: number) => `pe-sec-${group}${part === undefined ? "" : `-${part}`}`;

export function PropertyEditor(props: {
  original: Prop;
  draft: Prop;
  onChange: (draft: Prop) => void;
  lookups: Lookups;
  disabled: boolean;
  /** the group shown when it opens (and remembered as you scroll) */
  group: string;
  onGroup: (id: string) => void;
}) {
  const { original, draft } = props;
  const [find, setFind] = useState("");
  // the part of the page in view: "group" or "group-part"
  const [inView, setInView] = useState(props.group);
  const page = useRef<HTMLDivElement>(null);
  const set = (path: Path, value: unknown, remove = false) => {
    // "not set" again when it wasn't set before
    if (!remove && value === "" && get(original, path) === undefined) remove = true;
    props.onChange(setAt(draft, path, value, remove));
  };
  const revert = (path: Path) => {
    const before = get(original, path);
    props.onChange(setAt(draft, path, before, before === undefined));
  };

  const q = find.trim().toLowerCase();
  const matches = (s: Setting) => !q || `${s.label} ${s.hint ?? ""} ${s.edit.kind === "bool" ? s.edit.hint ?? "" : ""} ${s.path.join(".")}`.toLowerCase().includes(q);
  const otherChanges = !same(stripKnown(original), stripKnown(draft));
  // what the page shows: each group's parts, with the rows that apply (and match the search)
  const shownParts = (g: Group) =>
    g.parts
      .map((part, i) => ({ part, i, rows: part.settings.filter((s) => (!s.when || s.when(draft) || !same(get(original, s.path), get(draft, s.path))) && matches(s)) }))
      .filter((x) => x.rows.length);
  const showJson = !q || "json whole property".includes(q);

  const jump = (id: string) => {
    const el = page.current?.querySelector<HTMLElement>(`#${id}`);
    if (el && page.current) page.current.scrollTo({ top: el.offsetTop - page.current.offsetTop - 8 });
    setInView(id.replace("pe-sec-", ""));
  };
  // open where it was left
  useEffect(() => {
    if (props.group && props.group !== "general") jump(anchor(props.group));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // the menu follows the scrolling: the last section whose top has passed the top of the page
  const onScroll = () => {
    const box = page.current;
    if (!box) return;
    let at = "";
    for (const el of box.querySelectorAll<HTMLElement>("[data-sec]")) if (el.offsetTop - box.offsetTop - 24 <= box.scrollTop) at = el.dataset.sec!;
    if (box.scrollTop + box.clientHeight >= box.scrollHeight - 4) at = box.querySelectorAll<HTMLElement>("[data-sec]").item(box.querySelectorAll("[data-sec]").length - 1)?.dataset.sec ?? at;
    if (at && at !== inView) {
      setInView(at);
      const g = at.split("-")[0];
      if (g !== props.group) props.onGroup(g);
    }
  };
  const activeGroup = inView.split("-")[0];

  const row = (setting: Setting) => (
    <SettingRow key={setting.path.join(".") + setting.label} setting={setting} original={original} draft={draft} set={set} revert={revert} lookups={props.lookups} disabled={props.disabled} />
  );

  return (
    <div className="pe">
      <nav className="pe-menu" aria-label="Settings">
        <input className="pe-input pe-find" placeholder="Find a setting" aria-label="Find a setting" value={find} onChange={(e) => setFind(e.target.value)} />
        {GROUPS.map((g) => {
          const parts = shownParts(g);
          if (!parts.length) return null;
          const n = changedIn(g, original, draft);
          const open = activeGroup === g.id || !!q;
          const titled = parts.filter((x) => x.part.title);
          return (
            <div key={g.id} className={`pe-menu-group${open ? " is-open" : ""}`}>
              <button className={`pe-menu-item${activeGroup === g.id && !inView.includes("-") ? " is-on" : ""}`} aria-current={activeGroup === g.id ? "true" : undefined} onClick={() => jump(anchor(g.id))}>
                <span>{g.title}</span>
                {n > 0 && <span className="pe-count" title={`${n} changed`}>{n}</span>}
                {titled.length > 0 && <span className="pe-caret" aria-hidden="true">{open ? "▾" : "▸"}</span>}
              </button>
              {open &&
                titled.map(({ part, i }) => (
                  <button key={i} className={`pe-menu-sub${inView === `${g.id}-${i}` ? " is-on" : ""}`} onClick={() => jump(anchor(g.id, i))}>
                    {part.title}
                  </button>
                ))}
            </div>
          );
        })}
        {showJson && (
          <div className="pe-menu-group">
            <button className={`pe-menu-item${activeGroup === "json" ? " is-on" : ""}`} onClick={() => jump(anchor("json"))}>
              <span>JSON</span>
              {otherChanges && <span className="pe-count" title="Changed outside the groups">•</span>}
            </button>
          </div>
        )}
      </nav>

      <div className="pe-page" ref={page} onScroll={onScroll}>
        {GROUPS.map((g) => {
          const parts = shownParts(g);
          if (!parts.length) return null;
          return (
            <section key={g.id} id={anchor(g.id)} data-sec={g.id} className="pe-group" aria-label={g.title}>
              <h2 className="pe-group-title">{g.title}</h2>
              <p className="pe-blurb">{g.blurb}</p>
              {parts.map(({ part, i, rows }) => (
                <div key={i} id={anchor(g.id, i)} data-sec={part.title ? `${g.id}-${i}` : g.id} className="pe-part">
                  {part.title && <h3 className="pe-part-title">{part.title}</h3>}
                  <div className="pe-card">{rows.map(row)}</div>
                </div>
              ))}
            </section>
          );
        })}
        {showJson && (
          <section id={anchor("json")} data-sec="json" className="pe-group" aria-label="JSON">
            <h2 className="pe-group-title">JSON</h2>
            <p className="pe-blurb">The whole property as Saturn stores it. Anything the groups don't cover can be changed here.</p>
            <div className="pe-card is-pad">
              <WholeJson draft={draft} onChange={props.onChange} disabled={props.disabled} />
            </div>
          </section>
        )}
        {q && !GROUPS.some((g) => shownParts(g).length) && !showJson && <p className="rs-empty">No setting matches “{find}”.</p>}
        <div className="pe-tail" />
      </div>
    </div>
  );
}

/** The property without the settings the groups edit (to tell whether something else changed). */
function stripKnown(p: Prop) {
  let out: Prop = p;
  for (const { setting } of ALL) out = setAt(out, setting.path, undefined, true);
  return out;
}

function SettingRow(props: {
  setting: Setting;
  original: Prop;
  draft: Prop;
  set: (path: Path, value: unknown, remove?: boolean) => void;
  revert: (path: Path) => void;
  lookups: Lookups;
  disabled: boolean;
}) {
  const { setting, original, draft, set } = props;
  const value = get(draft, setting.path);
  const before = get(original, setting.path);
  const changed = !same(value, before);
  const quiet = isQuiet(setting, original);
  const id = `pe-${setting.path.join("-")}`;
  const edit = setting.edit;
  const hint = setting.hint ?? (edit.kind === "bool" ? edit.hint : undefined);
  // big controls (code, lists, cards…) go under the text; small ones on the right of it
  const wide = ["textarea", "code", "json", "tags", "csv", "fields", "ownFields", "choice", "cards"].includes(edit.kind);
  return (
    <div className={`pe-row${wide ? " is-wide" : ""}${changed && !quiet ? " is-changed" : ""}`}>
      <div className="pe-text">
        <label className="pe-label" htmlFor={id}>{setting.label}</label>
        {hint && <span className="pe-hint">{hint}</span>}
        {changed && !quiet && (
          <span className="pe-was">
            <span className="rs-dot is-inline" />
            was {short(show(setting.toggles ? before !== undefined : before))}
            <button className="rs-link" disabled={props.disabled} onClick={() => props.revert(setting.path)}>Put back</button>
          </span>
        )}
      </div>
      <div className="pe-control">
        <Control setting={setting} id={id} value={value} draft={draft} set={set} lookups={props.lookups} disabled={props.disabled} />
      </div>
    </div>
  );
}

/** An on/off switch (a checkbox underneath, so it works with the keyboard and labels). */
export function Switch(props: { id?: string; on: boolean; label: string; disabled?: boolean; onSet: (on: boolean) => void }) {
  return <input id={props.id} type="checkbox" role="switch" className="pe-switch" checked={props.on} aria-checked={props.on} aria-label={props.label} disabled={props.disabled} onChange={(e) => props.onSet(e.target.checked)} />;
}

/** One of a few choices, as cards: the chosen one is outlined. */
export function Cards(props: { label: string; value: string; options: [string, string, string?][]; disabled?: boolean; onPick: (v: string) => void }) {
  return (
    <div className="pe-cards" role="radiogroup" aria-label={props.label}>
      {props.options.map(([v, title, hint]) => (
        <button key={v} type="button" role="radio" aria-checked={props.value === v} className={`pe-card-choice${props.value === v ? " is-on" : ""}`} disabled={props.disabled} onClick={() => props.onPick(v)}>
          <b>{title}</b>
          {hint && <small>{hint}</small>}
        </button>
      ))}
    </div>
  );
}

function Control(props: { setting: Setting; id: string; value: unknown; draft: Prop; set: (path: Path, value: unknown, remove?: boolean) => void; lookups: Lookups; disabled: boolean }) {
  const { setting, value, set, id, disabled } = props;
  const path = setting.path;
  const edit = setting.edit;
  const str = value === undefined || value === null ? "" : String(value);
  switch (edit.kind) {
    case "bool":
      if (setting.toggles) {
        const on = value !== undefined && value !== null;
        return <Switch id={id} on={on} label={setting.label} disabled={disabled} onSet={(v) => (v ? set(path, setting.toggles!.on) : set(path, undefined, true))} />;
      }
      return <Switch id={id} on={value === true} label={setting.label} disabled={disabled} onSet={(v) => set(path, v)} />;
    case "text":
      return <input id={id} className={`pe-input${edit.mono ? " is-mono" : ""}`} value={str} placeholder={edit.placeholder} disabled={disabled} onChange={(e) => set(path, e.target.value)} />;
    case "textarea":
      return <textarea id={id} className="pe-input" rows={3} value={str} disabled={disabled} onChange={(e) => set(path, e.target.value)} />;
    case "number":
      return <NumberBox id={id} value={value} edit={edit} disabled={disabled} onSet={(n) => set(path, n, n === undefined)} />;
    case "select":
      return <Select id={id} value={str} options={edit.options} disabled={disabled} onPick={(v) => set(path, v)} />;
    case "choice":
      return <Cards label={setting.label} value={str || "static"} options={edit.options} disabled={disabled} onPick={(v) => set(path, v)} />;
    case "cards": {
      // a value the cards don't list (a type set elsewhere) is shown as one more card
      const options = edit.options.some(([v]) => v === str) || !str ? edit.options : [...edit.options, [str, str] as [string, string]];
      return <Cards label={setting.label} value={str} options={options} disabled={disabled} onPick={(v) => set(path, v)} />;
    }
    case "tags":
      return <Tags id={id} tags={Array.isArray(value) ? value.map(String) : []} placeholder={edit.placeholder} disabled={disabled} onSet={(t) => set(path, t)} />;
    case "csv":
      return <Tags id={id} tags={str ? str.split(",").map((t) => t.trim()).filter(Boolean) : []} placeholder="Add a value, press Enter" disabled={disabled} onSet={(t) => set(path, t.join(","))} />;
    case "code":
      return (
        <div className="pe-code">
          <HighlightInput multiline mono rows={Math.min(16, Math.max(4, str.split("\n").length + 1))} lang={edit.lang} value={str || edit.empty} disabled={disabled} ariaLabel={setting.label} onChange={(v) => set(path, v)} />
        </div>
      );
    case "resource":
      return <Select id={id} value={str} options={[["", "Pick a resource"], ...props.lookups.resources.map((r): [string, string] => [r, r])]} disabled={disabled} onPick={(v) => set(path, v)} />;
    case "field": {
      const of = edit.of(props.draft);
      if (!of) return <span className="pe-hint">Pick the reference first.</span>;
      const fields = props.lookups.fieldsOf(of);
      if (!fields) return <span className="pe-hint">Loading {of}'s properties…</span>;
      return <Select id={id} value={str} options={[["", "Pick a property"], ...fields.map((f): [string, string] => [f.key, f.label ? `${f.label} (${f.key})` : f.key])]} disabled={disabled} onPick={(v) => set(path, v)} />;
    }
    case "fields":
    case "ownFields": {
      const of = edit.kind === "fields" ? edit.of(props.draft) : null;
      if (edit.kind === "fields" && !of) return <span className="pe-hint">Pick the reference first.</span>;
      const fields = edit.kind === "fields" ? props.lookups.fieldsOf(of!) : props.lookups.own;
      if (!fields) return <span className="pe-hint">Loading {of}'s properties…</span>;
      return <Picks id={id} chosen={Array.isArray(value) ? value.map(String) : []} fields={fields} disabled={disabled} onSet={(v) => set(path, v)} />;
    }
    case "record": {
      const records = props.lookups.recordsOf(edit.resource, edit.value, edit.label);
      if (!records) return <span className="pe-hint">Loading…</span>;
      return <Select id={id} value={str} options={[["", "Not set"], ...records]} disabled={disabled} onPick={(v) => set(path, v)} />;
    }
    case "view": {
      const views = Array.isArray(props.draft.views) ? (props.draft.views as unknown[]) : [];
      const options = views.map((v): [string, string] =>
        typeof v === "string" ? [v, `Saved view ${v}`] : [String((v as Prop)?.id ?? ""), `${String((v as Prop)?.name || (v as Prop)?.view || "view")} (${String((v as Prop)?.view ?? "")})`],
      );
      return <Select id={id} value={str} options={options} disabled={disabled} onPick={(v) => set(path, v)} />;
    }
    case "json":
      return <JsonBox id={id} value={value} disabled={disabled} onSet={(v, remove) => set(path, v, remove)} />;
  }
}

function Select(props: { id: string; value: string; options: [string, string][]; disabled: boolean; onPick: (v: string) => void }) {
  // a value the list doesn't know is still shown (and kept)
  const options = props.options.some(([v]) => v === props.value) ? props.options : [[props.value, props.value || "Not set"] as [string, string], ...props.options];
  return (
    <select id={props.id} className="pe-input" value={props.value} disabled={props.disabled} onChange={(e) => props.onPick(e.target.value)}>
      {options.map(([v, label]) => <option key={v} value={v}>{label}</option>)}
    </select>
  );
}

function NumberBox(props: { id: string; value: unknown; edit: { min?: number; max?: number; step?: number }; disabled: boolean; onSet: (n: number | undefined) => void }) {
  const cur = typeof props.value === "number" ? String(props.value) : props.value === undefined ? "" : String(props.value);
  const [text, setText] = useState(cur);
  useEffect(() => setText(cur), [cur]);
  const step = props.edit.step ?? 1;
  const clamp = (n: number) => Math.min(props.edit.max ?? Infinity, Math.max(props.edit.min ?? -Infinity, n));
  const apply = (t: string) => {
    setText(t);
    if (t.trim() === "") return props.onSet(undefined);
    const n = Number(t);
    if (Number.isFinite(n)) props.onSet(clamp(n));
  };
  const bump = (d: number) => apply(String(clamp((Number(text) || 0) + d * step)));
  return (
    <span className="pe-num">
      <button type="button" className="rs-btn" aria-label="Less" disabled={props.disabled} onClick={() => bump(-1)}>−</button>
      <input id={props.id} className="pe-input is-mono" inputMode="decimal" value={text} disabled={props.disabled} onChange={(e) => apply(e.target.value)} onBlur={() => setText(cur)} />
      <button type="button" className="rs-btn" aria-label="More" disabled={props.disabled} onClick={() => bump(1)}>+</button>
    </span>
  );
}

function Tags(props: { id: string; tags: string[]; placeholder?: string; disabled: boolean; onSet: (tags: string[]) => void }) {
  const [add, setAdd] = useState("");
  const push = () => {
    const t = add.trim();
    setAdd("");
    if (t && !props.tags.includes(t)) props.onSet([...props.tags, t]);
  };
  return (
    <div className="pe-tags">
      {props.tags.map((t, i) => (
        <span key={t + i} className="pe-tag">
          {t}
          <button type="button" aria-label={`Remove ${t}`} disabled={props.disabled} onClick={() => props.onSet(props.tags.filter((_, j) => j !== i))}>×</button>
        </span>
      ))}
      <input
        id={props.id}
        className="pe-input pe-tag-input"
        value={add}
        placeholder={props.placeholder ?? "Add, press Enter"}
        disabled={props.disabled}
        onChange={(e) => setAdd(e.target.value)}
        onBlur={push}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            push();
          }
          if (e.key === "Backspace" && !add && props.tags.length) props.onSet(props.tags.slice(0, -1));
        }}
      />
    </div>
  );
}

/** Several properties picked from a list, with a search. */
function Picks(props: { id: string; chosen: string[]; fields: Field[]; disabled: boolean; onSet: (keys: string[]) => void }) {
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();
  // chosen ones Saturn has that aren't plain properties (like party.first_name) stay listed
  const known = new Set(props.fields.map((f) => f.key));
  const extra = props.chosen.filter((k) => !known.has(k)).map((k): Field => ({ key: k, label: null, type: null }));
  const list = [...props.fields, ...extra].filter((f) => !query || f.key.toLowerCase().includes(query) || (f.label ?? "").toLowerCase().includes(query));
  const toggle = (key: string) => props.onSet(props.chosen.includes(key) ? props.chosen.filter((k) => k !== key) : [...props.chosen, key]);
  return (
    <div className="pe-picks">
      <input id={props.id} className="pe-input" placeholder={`Search properties · ${props.chosen.length} picked`} value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="pe-picks-list">
        {list.map((f) => (
          <label key={f.key} className="pe-pick">
            <input type="checkbox" checked={props.chosen.includes(f.key)} disabled={props.disabled} onChange={() => toggle(f.key)} />
            <span>{f.label ?? f.key}</span>
            <code>{f.key}</code>
          </label>
        ))}
      </div>
    </div>
  );
}

/** A JSON value, edited as text: applied as soon as it's valid JSON. Empty = not set. */
function JsonBox(props: { id: string; value: unknown; disabled: boolean; onSet: (v: unknown, remove: boolean) => void }) {
  const cur = props.value === undefined ? "" : JSON.stringify(props.value, null, 2);
  const [text, setText] = useState(cur);
  const [bad, setBad] = useState(false);
  useEffect(() => {
    setText(cur);
    setBad(false);
  }, [cur]);
  return (
    <>
      <div className="pe-code">
        <HighlightInput
          multiline
          mono
          rows={Math.min(14, Math.max(1, text.split("\n").length))}
          lang="json"
          value={text}
          disabled={props.disabled}
          placeholder='"" (a JSON value)'
          onChange={(t) => {
            setText(t);
            if (t.trim() === "") { setBad(false); return props.onSet(undefined, true); }
            try {
              const v = JSON.parse(t);
              setBad(false);
              props.onSet(v, false);
            } catch {
              setBad(true);
            }
          }}
        />
      </div>
      {bad && <span className="pe-error">Not valid JSON yet (text needs "quotes"). It's applied once it is.</span>}
    </>
  );
}

/** The whole property as JSON. Its key stays as it is. */
function WholeJson(props: { draft: Prop; disabled: boolean; onChange: (p: Prop) => void }) {
  const cur = useMemo(() => JSON.stringify(props.draft, null, 2), [props.draft]);
  const [text, setText] = useState(cur);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    setText(cur);
    setError(null);
  }, [cur]);
  const apply = () => {
    let next: unknown;
    try {
      next = JSON.parse(text);
    } catch (e) {
      return setError(`Not valid JSON: ${(e as Error).message}`);
    }
    if (!next || typeof next !== "object" || Array.isArray(next)) return setError("A property must be a JSON object.");
    if ((next as Prop).key !== props.draft.key) return setError("The key can't be changed here.");
    setError(null);
    props.onChange(next as Prop);
  };
  return (
    <>
      <div className="pe-code">
        <HighlightInput multiline mono rows={24} lang="json" value={text} disabled={props.disabled} ariaLabel="The whole property" onChange={setText} />
      </div>
      {error && <span className="pe-error">{error}</span>}
      <div className="pe-btns">
        <button className="rs-btn" disabled={text === cur} onClick={() => { setText(cur); setError(null); }}>Undo typing</button>
        <button className="rs-btn is-primary" disabled={text === cur || props.disabled} onClick={apply}>Apply</button>
      </div>
    </>
  );
}
