// The editor for one property (or several at once), on the right of the Resources screen: a menu of its setting groups
// and their sections (spec.ts) beside one long page with all of them, like VS Code's settings.
// The menu jumps to a section and follows the scrolling; its search narrows the page. Each row
// has its name and hint on the left and its control on the right (switches for on/off, cards for
// a few choices), a dot and "was …" when it differs from what the instance has, and Put back.
// Everything is local until the screen's Save.
import { useEffect, useMemo, useRef, useState } from "react";
import { HighlightInput } from "../src/controls";
import { IconField } from "./icons";
import { PropertyAccess, accessSummary } from "./access";
import type { Subjects } from "../src-menus/model";
import { ALL, GROUPS, KEY_PATTERN, get, type Group, type Path, type Prop, type Setting } from "./spec";

export interface Field { key: string; label: string | null; type: string | null }
export interface Lookups {
  resources: string[];
  /** another resource's properties: null while they load (asking for them) */
  fieldsOf: (resource: string) => Field[] | null;
  /** this resource's properties */
  own: Field[];
  /** whether another property of this resource has this key */
  keyTaken: (key: string) => boolean;
  /** opens another resource (a map's or a source's reference) */
  openResource?: (resource: string) => void;
  /** records of a core resource as [value, label]: null while they load */
  recordsOf: (resource: string, value: string, label: string) => [string, string][] | null;
  /** opens a code setting as its own file (the node view's Form tab; not on the Resources screen) */
  openCode?: (path: Path, lang: "javascript" | "html", text: string) => void;
  /** the user groups, users and permissions access rules can name: null while they load (asking for them) */
  subjects?: () => Subjects | null;
  /** what the things edited are called (default: property, properties, of this resource) */
  noun?: { one: string; many: string; of: string };
}
const NOUN = { one: "property", many: "properties", of: "this resource" };

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

/** One property being edited: what the instance has, and how it is here. */
export interface Item { original: Prop; draft: Prop }

const differs = (s: Setting, it: Item) => !same(get(it.original, s.path), get(it.draft, s.path));

/** How many settings of a group differ, on any of the properties. */
export function changedIn(group: Group, items: Item[]) {
  return group.parts.flatMap((part) => part.settings).filter((s) => items.some((it) => differs(s, it)) && !items.every((it) => isQuiet(s, it.original))).length;
}

/** Inside a part that was just switched on (a new map, a new rule), only the switch counts as a change. */
const isQuiet = (setting: Setting, original: Prop) => setting.path.length > 1 && get(original, setting.path.slice(0, -1)) === undefined;

/** The anchor id of a group or a part of it on the page. */
const anchor = (group: string, part?: number) => `pe-sec-${group}${part === undefined ? "" : `-${part}`}`;

/** The settings of one property, or of several at once: then a setting they don't share shows as
 *  Mixed, a change goes to all of them, and the ones each keeps its own of (label, key,
 *  description) are left out. */
export function PropertyEditor(props: {
  items: Item[];
  onChange: (drafts: Prop[]) => void;
  lookups: Lookups;
  disabled: boolean;
  /** the group shown when it opens (and remembered as you scroll) */
  group: string;
  onGroup: (id: string) => void;
  /** no settings menu beside the page (the node view's Form tab) */
  noMenu?: boolean;
  /** a different hint for some settings, by path ("key": the Key row in a workflow's form) */
  hints?: Record<string, string>;
}) {
  const { items } = props;
  const many = items.length > 1;
  const first = items[0];
  const [find, setFind] = useState("");
  // the part of the page in view: "group" or "group-part"
  const [inView, setInView] = useState(props.group);
  const page = useRef<HTMLDivElement>(null);
  const set = (path: Path, value: unknown, remove = false) =>
    props.onChange(
      items.map((it) =>
        // "not set" again when it wasn't set before
        setAt(it.draft, path, value, remove || (value === "" && get(it.original, path) === undefined)),
      ),
    );
  const revert = (path: Path) => props.onChange(items.map((it) => setAt(it.draft, path, get(it.original, path), get(it.original, path) === undefined)));

  const q = find.trim().toLowerCase();
  // what a search looks in: a setting's name, hints, stored name, its choices' names, and the heading and group it's
  // under (so "show" finds the Show in switches, "data" the Data group)
  const words = q.split(/\s+/).filter(Boolean);
  const textOf = (s: Setting, g: Group, partTitle?: string) => {
    const choices = "options" in s.edit ? s.edit.options.map((o) => `${o[1]} ${o[2] ?? ""}`).join(" ") : "";
    return `${s.label} ${s.hint ?? ""} ${s.edit.kind === "bool" ? s.edit.hint ?? "" : ""} ${s.path.join(".")} ${choices} ${partTitle ?? ""} ${g.title}`.toLowerCase();
  };
  // the words as typed, together, when some setting has them like that; else each word anywhere
  const asPhrase = words.length > 1 && GROUPS.some((g) => g.parts.some((part) => part.settings.some((s) => textOf(s, g, part.title).includes(q))));
  const matches = (s: Setting, g: Group, partTitle?: string) => {
    if (!words.length) return true;
    const text = textOf(s, g, partTitle);
    return asPhrase ? text.includes(q) : words.every((w) => text.includes(w));
  };
  const otherChanges = items.some((it) => !same(stripKnown(it.original), stripKnown(it.draft)));
  // what the page shows: each group's parts, with the rows that apply (and match the search)
  const shownParts = (g: Group) =>
    g.parts
      .map((part, i) => ({
        part,
        i,
        rows: part.settings.filter((s) => !(many && s.single) && (!s.when || items.some((it) => s.when!(it.draft) || (differs(s, it) && !sharedShown(s, it.draft)))) && matches(s, g, part.title)),
      }))
      .filter((x) => x.rows.length);
  const showJson = !many && (!words.length || words.every((w) => "json whole property".includes(w)));

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
    // the first section, in reading order, that's still in view
    const top = box.getBoundingClientRect().top + 24;
    const secs = [...box.querySelectorAll<HTMLElement>("[data-sec]")];
    let at = secs.find((el) => el.getBoundingClientRect().bottom > top)?.dataset.sec ?? "";
    if (box.scrollTop + box.clientHeight >= box.scrollHeight - 4 && box.scrollTop > 0) at = secs[secs.length - 1]?.dataset.sec ?? at;
    if (at && at !== inView) {
      setInView(at);
      const g = at.split("-")[0];
      if (g !== props.group) props.onGroup(g);
    }
  };
  const activeGroup = inView.split("-")[0];

  const row = (setting: Setting) => (
    <SettingRow key={setting.path.join(".") + setting.label} setting={props.hints?.[setting.path.join(".")] ? { ...setting, hint: props.hints[setting.path.join(".")] } : setting} items={items} set={set} revert={revert} lookups={props.lookups} disabled={props.disabled} />
  );

  return (
    <div className="pe">
      {!props.noMenu && <nav className="pe-menu" aria-label="Settings">
        <input className="pe-input pe-find" placeholder="Find a setting" aria-label="Find a setting" value={find} onChange={(e) => setFind(e.target.value)} />
        {GROUPS.map((g) => {
          const parts = shownParts(g);
          if (!parts.length) return null;
          const n = changedIn(g, items);
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
      </nav>}

      <div className="pe-page" ref={page} onScroll={onScroll}>
        {many && <p className="pe-many">Editing {items.length} {(props.lookups.noun ?? NOUN).many}. A change here goes to all of them; a setting they don't share shows as Mixed.</p>}
        {/* every card is a block in one column, so the gap under each is the same */}
        <div className="pe-flow">
          {GROUPS.flatMap((g) => {
            const parts = shownParts(g);
            return parts.map(({ part, i, rows }, n) => (
              <div key={`${g.id}-${i}`} id={n === 0 ? anchor(g.id) : undefined} data-sec={part.title ? `${g.id}-${i}` : g.id} className={`pe-block${n === 0 ? " is-first" : ""}`}>
                {n === 0 && (
                  <header className="pe-group-head" aria-label={g.title}>
                    <h2 className="pe-group-title">{g.title}</h2>
                    <p className="pe-blurb">{g.blurb}</p>
                  </header>
                )}
                <div id={anchor(g.id, i)} className="pe-part">
                  {part.title && <h3 className="pe-part-title">{part.title}</h3>}
                  <div className="pe-card">{rows.map(row)}</div>
                </div>
              </div>
            ));
          })}
          {showJson && (
            <div id={anchor("json")} data-sec="json" className="pe-block is-first is-wide">
              <header className="pe-group-head">
                <h2 className="pe-group-title">JSON</h2>
                <p className="pe-blurb">The whole {(props.lookups.noun ?? NOUN).one} as Saturn stores it. Anything the groups don't cover can be changed here.</p>
              </header>
              <div className="pe-card is-pad">
                <WholeJson draft={first.draft} onChange={(d) => props.onChange([d])} disabled={props.disabled} />
              </div>
            </div>
          )}
        </div>
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
  items: Item[];
  set: (path: Path, value: unknown, remove?: boolean) => void;
  revert: (path: Path) => void;
  lookups: Lookups;
  disabled: boolean;
}) {
  const { setting, items, set } = props;
  const values = items.map((it) => get(it.draft, setting.path));
  const mixed = values.some((v) => !same(v, values[0]));
  const value = mixed ? undefined : values[0];
  const changedOn = items.filter((it) => differs(setting, it)).length;
  const quiet = items.every((it) => isQuiet(setting, it.original));
  const shown = changedOn > 0 && !quiet;
  const before = get(items[0].original, setting.path);
  const id = `pe-${setting.path.join("-")}`;
  const edit = setting.edit;
  const hint = setting.hint ?? (edit.kind === "bool" ? edit.hint : undefined);
  // big controls (code, lists, cards…) go under the text; small ones on the right of it
  const wide = ["textarea", "code", "json", "tags", "csv", "fields", "ownFields", "choice", "cards", "access"].includes(edit.kind);
  return (
    <div className={`pe-row${wide ? " is-wide" : ""}${shown ? " is-changed" : ""}`}>
      <div className="pe-text">
        <label className="pe-label" htmlFor={id}>
          {setting.label}
          {mixed && <span className="pe-mixed">Mixed</span>}
        </label>
        {hint && <span className="pe-hint">{hint}</span>}
        {shown && (
          <span className="pe-was">
            <span className="rs-dot is-inline" />
            {items.length > 1 ? `changed on ${changedOn} of ${items.length}` : `was ${edit.kind === "access" ? accessSummary(before) : short(show(setting.toggles ? before !== undefined : edit.kind === "bool" && edit.invert ? before !== true : before))}`}
            <button className="rs-link" disabled={props.disabled} onClick={() => props.revert(setting.path)}>Put back</button>
          </span>
        )}
      </div>
      <div className="pe-control">
        <Control setting={setting} id={id} value={value} mixed={mixed} drafts={items.map((it) => it.draft)} set={set} lookups={props.lookups} disabled={props.disabled} />
      </div>
    </div>
  );
}

/** An on/off switch (a checkbox underneath, so it works with the keyboard and labels). */
export function Switch(props: { id?: string; on: boolean; mixed?: boolean; label: string; disabled?: boolean; onSet: (on: boolean) => void }) {
  // mixed (some on, some off): shown in the middle; a click turns it on for all
  return (
    <input
      id={props.id}
      type="checkbox"
      role="switch"
      className={`pe-switch${props.mixed ? " is-mixed" : ""}`}
      checked={props.on && !props.mixed}
      aria-checked={props.mixed ? "mixed" : props.on}
      aria-label={props.label}
      disabled={props.disabled}
      onChange={(e) => props.onSet(props.mixed ? true : e.target.checked)}
    />
  );
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

function Control(props: { setting: Setting; id: string; value: unknown; mixed: boolean; drafts: Prop[]; set: (path: Path, value: unknown, remove?: boolean) => void; lookups: Lookups; disabled: boolean }) {
  const { setting, value, set, id, disabled, mixed } = props;
  const path = setting.path;
  const edit = setting.edit;
  const str = value === undefined || value === null ? "" : String(value);
  // what a setting that names another resource points at: one resource for all, or null
  const ofAll = (of: (p: Prop) => string | null) => {
    const refs = [...new Set(props.drafts.map(of))];
    return refs.length === 1 ? refs[0] : undefined;
  };
  const MIXED = mixed ? "Mixed" : undefined;
  switch (edit.kind) {
    case "bool":
      if (setting.toggles) {
        const on = value !== undefined && value !== null;
        return <Switch id={id} on={on} mixed={mixed} label={setting.label} disabled={disabled} onSet={(v) => (v ? set(path, setting.toggles!.on) : set(path, undefined, true))} />;
      }
      // an inverted one ("Show in" for Saturn's hide… settings) is on when the stored value isn't true
      if (edit.invert) return <Switch id={id} on={value !== true} mixed={mixed} label={setting.label} disabled={disabled} onSet={(v) => set(path, !v)} />;
      return <Switch id={id} on={value === true} mixed={mixed} label={setting.label} disabled={disabled} onSet={(v) => set(path, v)} />;
    case "text":
      return <input id={id} className={`pe-input${edit.mono ? " is-mono" : ""}`} value={str} placeholder={MIXED ?? edit.placeholder} disabled={disabled} onChange={(e) => set(path, e.target.value)} />;
    case "textarea":
      return <textarea id={id} className="pe-input" rows={3} value={str} placeholder={MIXED} disabled={disabled} onChange={(e) => set(path, e.target.value)} />;
    case "number":
      return <NumberBox id={id} value={value} placeholder={MIXED} edit={edit} disabled={disabled} onSet={(n) => set(path, n, n === undefined)} />;
    case "select":
      return <Select id={id} value={mixed ? MIXED_VALUE : str} options={edit.options} disabled={disabled} onPick={(v) => set(path, v)} />;
    case "choice":
      return <Cards label={setting.label} value={mixed ? "" : str || "static"} options={edit.options} disabled={disabled} onPick={(v) => set(path, v)} />;
    case "cards": {
      // a value the cards don't list (a type set elsewhere) is shown as one more card
      const options = mixed || edit.options.some(([v]) => v === str) || !str ? edit.options : [...edit.options, [str, str] as [string, string]];
      return <Cards label={setting.label} value={str} options={options} disabled={disabled} onPick={(v) => set(path, v)} />;
    }
    case "tags":
      return <Tags id={id} tags={Array.isArray(value) ? value.map(String) : []} placeholder={MIXED ? "Mixed: tags typed here replace each one's" : edit.placeholder} disabled={disabled} onSet={(t) => set(path, t)} />;
    case "icon":
      // a value stored as "fa-name" keeps that form
      return <IconField label={setting.label} allowEmpty mixed={mixed} disabled={disabled} value={mixed ? "" : str} onChange={(n) => set(path, n && str.startsWith("fa-") ? `fa-${n}` : n)} />;
    case "csv":
      return <Tags id={id} tags={str ? str.split(",").map((t) => t.trim()).filter(Boolean) : []} placeholder="Add a value, press Enter" disabled={disabled} onSet={(t) => set(path, t.join(","))} />;
    case "code":
      return (
        <div className="pe-code">
          <HighlightInput multiline mono rows={Math.min(16, Math.max(4, str.split("\n").length + 1))} lang={edit.lang} value={mixed ? str : str || edit.empty} placeholder={MIXED && "Mixed: what you type here goes to all of them"} disabled={disabled} ariaLabel={setting.label} onChange={(v) => set(path, v)} />
          {props.lookups.openCode && props.drafts.length === 1 && (
            <button type="button" className="rs-btn pe-open-file" disabled={disabled} title="Open it in its own editor tab; saving the file writes it back" onClick={() => props.lookups.openCode!(path, edit.lang, str || edit.empty)}>
              Open in a file
            </button>
          )}
        </div>
      );
    case "resource":
      return (
        <span className="pe-ref">
          <Select id={id} value={mixed ? MIXED_VALUE : str} options={[["", "Pick a resource"], ...props.lookups.resources.map((r): [string, string] => [r, r])]} disabled={disabled} onPick={(v) => set(path, v)} />
          {str && props.lookups.openResource && (
            <button type="button" className="rs-chip is-static" title={`Open ${str}`} onClick={() => props.lookups.openResource!(str)}>
              {str} ›
            </button>
          )}
        </span>
      );
    case "field": {
      const of = ofAll(edit.of);
      if (of === undefined) return <span className="pe-hint">They point at different resources.</span>;
      if (!of) return <span className="pe-hint">Pick the reference first.</span>;
      const fields = props.lookups.fieldsOf(of);
      if (!fields) return <span className="pe-hint">Loading {of}'s properties…</span>;
      // the keys every record has (not in the schema) can be picked too, like id for Linked by
      const builtIn = BUILT_IN.filter(([k]) => !fields.some((f) => f.key === k));
      return <Select id={id} value={mixed ? MIXED_VALUE : str} options={[["", "Pick a property"], ...fields.map((f): [string, string] => [f.key, f.label ? `${f.label} (${f.key})` : f.key]), ...builtIn]} disabled={disabled} onPick={(v) => set(path, v)} />;
    }
    case "fields":
    case "ownFields": {
      const of = edit.kind === "fields" ? ofAll(edit.of) : null;
      if (of === undefined) return <span className="pe-hint">They point at different resources.</span>;
      if (edit.kind === "fields" && !of) return <span className="pe-hint">Pick the reference first.</span>;
      const fields = edit.kind === "fields" ? props.lookups.fieldsOf(of!) : props.lookups.own;
      if (!fields) return <span className="pe-hint">Loading {of}'s properties…</span>;
      return <Picks id={id} chosen={Array.isArray(value) ? value.map(String) : []} mixed={mixed} fields={fields} disabled={disabled} onSet={(v) => set(path, v)} />;
    }
    case "record": {
      const records = props.lookups.recordsOf(edit.resource, edit.value, edit.label);
      if (!records) return <span className="pe-hint">Loading…</span>;
      return <Select id={id} value={mixed ? MIXED_VALUE : str} options={[["", "Not set"], ...records]} disabled={disabled} onPick={(v) => set(path, v)} />;
    }
    case "view": {
      const views = Array.isArray(props.drafts[0].views) ? (props.drafts[0].views as unknown[]) : [];
      const options = views.map((v): [string, string] =>
        typeof v === "string" ? [v, `Saved view ${v}`] : [String((v as Prop)?.id ?? ""), `${String((v as Prop)?.name || (v as Prop)?.view || "view")} (${String((v as Prop)?.view ?? "")})`],
      );
      return <Select id={id} value={mixed ? MIXED_VALUE : str} options={options} disabled={disabled} onPick={(v) => set(path, v)} />;
    }
    case "key": {
      const problem = !KEY_PATTERN.test(str) ? "Use letters, digits and _, starting with a letter." : props.lookups.keyTaken(str) ? `${str} is already a ${(props.lookups.noun ?? NOUN).one} of ${(props.lookups.noun ?? NOUN).of}.` : null;
      return (
        <span className="pe-key">
          <input id={id} className="pe-input is-mono" value={str} disabled={disabled} spellCheck={false} aria-invalid={!!problem} onChange={(e) => set(path, e.target.value)} />
          {problem && <span className="pe-error">{problem}</span>}
        </span>
      );
    }
    case "access":
      return <PropertyAccess id={id} value={value} mixed={mixed} subjects={props.lookups.subjects?.() ?? null} disabled={disabled} noun={(props.lookups.noun ?? NOUN).many} onSet={(v) => set(path, v)} />;
    case "json":
      return <JsonBox id={id} value={value} mixed={mixed} disabled={disabled} onSet={(v, remove) => set(path, v, remove)} />;
  }
}

/** Whether another setting stored at the same path shows for this property (like Values, Reference and Lookup
 *  function, all lookup_reference): then a change there isn't a reason to show this one too. */
function sharedShown(setting: Setting, draft: Prop) {
  return ALL.some(({ setting: other }) => other !== setting && other.path.join(".") === setting.path.join(".") && (!other.when || other.when(draft)));
}

/** Keys every record has without them being in its resource's schema. */
const BUILT_IN: [string, string][] = [["id", "ID (id), built in"], ["created_at", "Created at (created_at), built in"], ["updated_at", "Updated at (updated_at), built in"]];

/** The value a select shows when the properties don't share one. */
const MIXED_VALUE = "\u0000mixed";

function Select(props: { id: string; value: string; options: [string, string][]; disabled: boolean; onPick: (v: string) => void }) {
  // a value the list doesn't know is still shown (and kept); Mixed can't be picked
  const options = props.options.some(([v]) => v === props.value) ? props.options : [[props.value, props.value === MIXED_VALUE ? "Mixed" : props.value || "Not set"] as [string, string], ...props.options];
  return (
    <select id={props.id} className="pe-input" value={props.value} disabled={props.disabled} onChange={(e) => props.onPick(e.target.value)}>
      {options.map(([v, label]) => <option key={v} value={v} disabled={v === MIXED_VALUE}>{label}</option>)}
    </select>
  );
}

function NumberBox(props: { id: string; value: unknown; placeholder?: string; edit: { min?: number; max?: number; step?: number }; disabled: boolean; onSet: (n: number | undefined) => void }) {
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
      <input id={props.id} className="pe-input is-mono" inputMode="decimal" value={text} placeholder={props.placeholder} disabled={props.disabled} onChange={(e) => apply(e.target.value)} onBlur={() => setText(cur)} />
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
function Picks(props: { id: string; chosen: string[]; mixed?: boolean; fields: Field[]; disabled: boolean; onSet: (keys: string[]) => void }) {
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();
  // chosen ones Saturn has that aren't plain properties (like party.first_name) stay listed
  const known = new Set(props.fields.map((f) => f.key));
  const extra = props.chosen.filter((k) => !known.has(k)).map((k): Field => ({ key: k, label: null, type: null }));
  const list = [...props.fields, ...extra].filter((f) => !query || f.key.toLowerCase().includes(query) || (f.label ?? "").toLowerCase().includes(query));
  const toggle = (key: string) => props.onSet(props.chosen.includes(key) ? props.chosen.filter((k) => k !== key) : [...props.chosen, key]);
  return (
    <div className="pe-picks">
      <input id={props.id} className="pe-input" placeholder={props.mixed ? "Mixed: what you pick here replaces each one's" : `Search properties · ${props.chosen.length} picked`} value={q} onChange={(e) => setQ(e.target.value)} />
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
function JsonBox(props: { id: string; value: unknown; mixed?: boolean; disabled: boolean; onSet: (v: unknown, remove: boolean) => void }) {
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
          placeholder={props.mixed ? "Mixed: what you type here goes to all of them" : '"" (a JSON value)'}
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
