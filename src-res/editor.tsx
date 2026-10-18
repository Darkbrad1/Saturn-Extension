// The editor for one property, on the right of the Resources screen: its settings in groups
// (spec.ts), each control showing its value as edited here, a dot and "was …" when it differs
// from what the instance has, and a way to put it back. A search finds a setting in any group.
// Everything is local until the screen's Save.
import { useEffect, useMemo, useState } from "react";
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

export function PropertyEditor(props: {
  original: Prop;
  draft: Prop;
  onChange: (draft: Prop) => void;
  lookups: Lookups;
  disabled: boolean;
  group: string;
  onGroup: (id: string) => void;
}) {
  const { original, draft } = props;
  const [find, setFind] = useState("");
  const group = GROUPS.find((g) => g.id === props.group) ?? GROUPS[0];
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
  const found = q ? ALL.filter(({ setting }) => `${setting.label} ${setting.hint ?? ""} ${setting.path.join(".")}`.toLowerCase().includes(q)) : [];
  const otherChanges = !same(stripKnown(original), stripKnown(draft));

  const row = (setting: Setting, groupTitle?: string) => (
    <SettingRow key={setting.path.join(".") + setting.label} setting={setting} groupTitle={groupTitle} original={original} draft={draft} set={set} revert={revert} lookups={props.lookups} disabled={props.disabled} />
  );

  return (
    <div className="pe">
      <div className="pe-nav" role="tablist" aria-label="Settings">
        {GROUPS.map((g) => {
          const n = changedIn(g, original, draft);
          return (
            <button key={g.id} role="tab" aria-selected={!q && g.id === group.id} className={`pe-tab${!q && g.id === group.id ? " is-on" : ""}`} onClick={() => { setFind(""); props.onGroup(g.id); }}>
              {g.title}
              {n > 0 && <span className="pe-count" title={`${n} changed`}>{n}</span>}
            </button>
          );
        })}
        <button role="tab" aria-selected={!q && props.group === "json"} className={`pe-tab${!q && props.group === "json" ? " is-on" : ""}`} onClick={() => { setFind(""); props.onGroup("json"); }}>
          JSON
          {otherChanges && <span className="pe-count" title="Changed outside the groups">•</span>}
        </button>
        <input className="rs-search pe-find" placeholder="Find a setting" aria-label="Find a setting" value={find} onChange={(e) => setFind(e.target.value)} />
      </div>

      {q ? (
        <div className="pe-body">
          {found.length ? found.map(({ group: g, setting }) => row(setting, g.title)) : <p className="rs-empty">No setting matches “{find}”.</p>}
        </div>
      ) : props.group === "json" ? (
        <div className="pe-body">
          <p className="pe-blurb">The whole property as Saturn stores it. Anything the groups don't cover can be changed here.</p>
          <WholeJson draft={draft} onChange={props.onChange} disabled={props.disabled} />
        </div>
      ) : (
        <div className="pe-body">
          <p className="pe-blurb">{group.blurb}</p>
          {group.parts.map((part, i) => {
            const rows = part.settings.filter((s) => !s.when || s.when(draft) || !same(get(original, s.path), get(draft, s.path)));
            if (!rows.length) return null;
            return (
              <div key={i} className={`pe-part${part.grid ? " is-grid" : ""}`}>
                {part.title && <div className="pe-part-title">{part.title}</div>}
                <div className="pe-part-rows">{rows.map((s) => row(s))}</div>
              </div>
            );
          })}
        </div>
      )}
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
  groupTitle?: string;
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
  const inline = edit.kind === "bool";
  const control = <Control setting={setting} id={id} value={value} draft={draft} set={set} lookups={props.lookups} disabled={props.disabled} />;
  return (
    <div className={`pe-row${inline ? " is-inline" : ""}${changed ? " is-changed" : ""}`}>
      {inline ? (
        <label className="pe-check" htmlFor={id}>
          {control}
          <span>
            <span className="pe-label">{setting.label}</span>
            {props.groupTitle && <span className="pe-where">{props.groupTitle}</span>}
            {(setting.hint || (edit.kind === "bool" && edit.hint)) && <span className="pe-hint">{setting.hint ?? (edit.kind === "bool" ? edit.hint : "")}</span>}
          </span>
        </label>
      ) : (
        <>
          <label className="pe-label" htmlFor={id}>
            {setting.label}
            {props.groupTitle && <span className="pe-where">{props.groupTitle}</span>}
          </label>
          {setting.hint && <span className="pe-hint">{setting.hint}</span>}
          {control}
        </>
      )}
      {changed && !quiet && (
        <div className="pe-was">
          <span className="rs-dot is-inline" />
          was {short(show(setting.toggles ? before !== undefined : before))}
          <button className="rs-link" disabled={props.disabled} onClick={() => props.revert(setting.path)}>Put back</button>
        </div>
      )}
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
        return <input id={id} type="checkbox" checked={on} disabled={disabled} aria-label={setting.label} onChange={(e) => (e.target.checked ? set(path, setting.toggles!.on) : set(path, undefined, true))} />;
      }
      return <input id={id} type="checkbox" checked={value === true} disabled={disabled} aria-label={setting.label} onChange={(e) => set(path, e.target.checked)} />;
    case "text":
      return <input id={id} className={`pe-input${edit.mono ? " is-mono" : ""}`} value={str} placeholder={edit.placeholder} disabled={disabled} onChange={(e) => set(path, e.target.value)} />;
    case "textarea":
      return <textarea id={id} className="pe-input" rows={3} value={str} disabled={disabled} onChange={(e) => set(path, e.target.value)} />;
    case "number":
      return <NumberBox id={id} value={value} edit={edit} disabled={disabled} onSet={(n) => set(path, n, n === undefined)} />;
    case "select":
      return <Select id={id} value={str} options={edit.options} disabled={disabled} onPick={(v) => set(path, v)} />;
    case "choice":
      return (
        <div className="pe-choices" role="radiogroup" aria-label={setting.label}>
          {edit.options.map(([v, label, hint]) => (
            <label key={v} className={`pe-choice${(str || "static") === v ? " is-on" : ""}`}>
              <input type="radio" name={id} checked={(str || "static") === v} disabled={disabled} onChange={() => set(path, v)} />
              <span><b>{label}</b>{hint && <small>{hint}</small>}</span>
            </label>
          ))}
        </div>
      );
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
