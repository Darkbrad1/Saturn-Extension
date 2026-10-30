// Resources: pick a resource; its properties are listed down the left, in the schema's order
// (name, key and type, a chip naming the resource a mapped one points at). Pick one, or several
// (Ctrl/Cmd+click, Shift+click), and their settings show on the right (editor.tsx, spec.ts); a
// change goes to every picked property. Drag (or Alt+↑/↓) moves the picked ones together; + adds
// one; right-click has Duplicate, Copy / Paste settings, Copy key, Go to the mapped resource,
// Delete / Restore. A chip jumps to the mapped resource and Back (or Alt+←) comes back.
// The host side is host/resources.js (it reads a resource and saves it the way Saturn's own app
// does, with a backup and a read-back check). Changes stay here until Save, kept for each resource
// separately (and in the webview's state); Save saves every resource with changes, one by one.
import { ResourceCards, ResourcePicker } from "./picker";
import type { Subjects } from "../src-menus/model";
import { createRoot } from "react-dom/client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Cards, PropertyEditor, Switch, useFavourites, type Field, type Lookups } from "./editor";
import { setAt } from "./editor";
import { ALL, GROUPS, KEY_PATTERN, pastePaths, TYPES, diff, get, keyFrom, mappedOf, newProperty, type Prop } from "./spec";
import { SettingsPage, settingsError, settingsSummary, trimDraft, type Loaded, type SettingsDraft } from "./settings";
import { hint, listenForShortcuts, onMouseBack, pressed, type Bindings } from "../src/keys";
import css from "./res.css";
import editorCss from "./editor.css";

declare function acquireVsCodeApi(): { postMessage: (m: unknown) => void; getState: () => unknown; setState: (s: unknown) => void };
const vscode = acquireVsCodeApi();
const send = (type: string, payload: Record<string, unknown> = {}) => vscode.postMessage({ type, payload });

/** key: which property this is (its key on the instance, or for a new one its key when it was
 *  added); shownKey: its key as edited here (a key can be changed before saving). */
interface Property { key: string; shownKey: string; label: string | null; type: string | null; required: boolean; editable: boolean; definition: unknown }
interface Added { id: string; prop: Prop }
/** The unsaved changes to one resource. */
interface Work {
  /** property key -> the property as edited here (only the ones that differ from the instance) */
  drafts: Record<string, Prop>;
  /** new properties, not on the instance yet */
  added: Added[];
  /** every property id in the new order (null: as the instance has it) */
  order: string[] | null;
  /** properties to take out when saving */
  deleted: string[];
}
/** Where you were before jumping to another resource. */
interface Step { resource: string; selected: string[] }
interface Saved {
  resource?: string | null;
  works?: Record<string, Work>;
  selected?: string[];
  group?: string;
  trail?: Step[];
  clipboard?: Clip | null;
  /** the resources' own settings as changed here (only the changed keys) */
  settingsWorks?: Record<string, SettingsDraft>;
  /** what the right side shows: a property's settings or the resource's */
  view?: "properties" | "settings";
  listHidden?: boolean;
  // the first versions kept one resource's changes at the top level
  drafts?: Record<string, Prop>;
  added?: Added[];
  order?: string[] | null;
}
/** Copied settings: the property they came from. */
interface Clip { from: string; resource: string; prop: Prop }
type Notice = { kind: "ok" | "error"; text: string; backup?: string; resource?: string; refused?: boolean } | null;

const EMPTY: Work = { drafts: {}, added: [], order: null, deleted: [] };
const loadSaved = (): Saved => {
  try {
    return (vscode.getState() as Saved) ?? {};
  } catch {
    return {};
  }
};
const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
const asProp = (p: Property): Prop => (p.definition && typeof p.definition === "object" && !Array.isArray(p.definition) ? { ...(p.definition as Prop), key: p.key } : { key: p.key });
const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;
const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v));
const isEmpty = (w: Work) => !Object.keys(w.drafts).length && !w.added.length && !w.order && !w.deleted.length;

/** Everything a resource's unsaved changes add up to, as Save sends it. */
function planOf(properties: Property[] | undefined, work: Work) {
  const props = properties ?? [];
  const originals = new Map(props.map((p) => [p.key, asProp(p)]));
  const deleted = new Set(work.deleted);
  const live = (key: string) => !deleted.has(key);
  const all: Property[] = [
    ...props.map((p) => (work.drafts[p.key] ? viewOf(p.key, work.drafts[p.key], p.editable) : { ...p, shownKey: p.key })),
    ...work.added.map((a) => viewOf(a.id, a.prop, true)),
  ];
  const byKey = new Map(all.map((p) => [p.key, p]));
  const ordered = work.order ? [...work.order.map((k) => byKey.get(k)!).filter(Boolean), ...all.filter((p) => !work.order!.includes(p.key))] : all;
  const isNew = (key: string) => work.added.some((a) => a.id === key);
  const changes = Object.entries(work.drafts).filter(([key]) => live(key) && originals.has(key)).flatMap(([key, draft]) => diff(originals.get(key), draft).map((c) => ({ key, ...c })));
  const adds = work.added.map((a) => ({ key: String(a.prop.key), property: a.prop }));
  const removes = work.deleted.filter((k) => originals.has(k));
  const renames = Object.entries(work.drafts).filter(([key, d]) => live(key) && typeof d.key === "string" && d.key !== key).map(([from, d]) => ({ from, to: String(d.key) }));
  const instanceOrder = [...props.map((p) => p.key), ...work.added.map((a) => a.id)].filter(live);
  const kept = ordered.filter((p) => live(p.key));
  // the order names properties by their key on the instance (new ones by their key as typed)
  const order = work.order && kept.map((p) => p.key).join("\n") !== instanceOrder.join("\n") ? kept.map((p) => (isNew(p.key) ? p.shownKey : p.key)) : null;
  // a key that can't be saved (not a valid key, or used twice) stops Save
  const counts = new Map<string, number>();
  for (const p of kept) counts.set(p.shownKey, (counts.get(p.shownKey) ?? 0) + 1);
  const badKey = kept.find((p) => !KEY_PATTERN.test(p.shownKey) || counts.get(p.shownKey)! > 1) ?? null;
  const changedProps = new Set(changes.map((c) => c.key)).size;
  const summary = [
    changes.length ? `${plural(changes.length, "setting")} on ${plural(changedProps, "property", "properties")}` : "",
    adds.length ? `${plural(adds.length, "new property", "new properties")}` : "",
    renames.length ? `${plural(renames.length, "new key")}` : "",
    removes.length ? `${plural(removes.length, "property", "properties")} removed` : "",
    order ? "the order" : "",
  ].filter(Boolean);
  const removedNames = removes.map((k) => byKey.get(k)?.label ?? k);
  return { all, byKey, originals, ordered, isNew, deleted, changes, adds, removes, renames, order, badKey, summary, removedNames, dirty: summary.length > 0 };
}

function App() {
  const saved = useMemo(loadSaved, []);
  const [instanceName, setInstanceName] = useState("");
  const [resources, setResources] = useState<string[] | null>(null);
  // the core (Saturn's own) resources among them, or null when the instance didn't say
  const [core, setCore] = useState<string[] | null>(null);
  const [resource, setResource] = useState<string | null>(saved.resource ?? null);
  // each resource's properties as the instance has them (read when it's opened)
  const [loaded, setLoaded] = useState<Record<string, Property[]>>({});
  // for messages handled outside a render (a code file saved): what each resource has on the instance
  const loadedRef = useRef(loaded);
  loadedRef.current = loaded;
  const [works, setWorks] = useState<Record<string, Work>>(() => {
    if (saved.works) return saved.works;
    // carried over from the first versions (one resource's changes)
    if (saved.resource && (saved.drafts || saved.added || saved.order)) {
      return { [saved.resource]: { drafts: saved.drafts ?? {}, added: (saved.added ?? []).map((a) => ("prop" in a ? a : { id: String((a as unknown as Prop).key), prop: a as unknown as Prop })), order: saved.order ?? null, deleted: [] } };
    }
    return {};
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>(saved.selected ?? []);
  // where Shift+click selects from
  const anchor = useRef<string | null>((saved.selected ? saved.selected[saved.selected.length - 1] : null) ?? null);
  const [group, setGroup] = useState(saved.group ?? "general");
  const [trail, setTrail] = useState<Step[]>(saved.trail ?? []);
  const [clipboard, setClipboard] = useState<Clip | null>(saved.clipboard ?? null);
  // drag and drop: the properties being dragged, and where they would land (an index in the list)
  const [dragKeys, setDragKeys] = useState<string[] | null>(null);
  const [dropAt, setDropAt] = useState<number | null>(null);
  const [menu, setMenu] = useState<{ x: number; y: number } | null>(null);
  const [pasting, setPasting] = useState<Record<string, boolean> | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  // the read-only check of what the instance takes (after a refused save)
  const [report, setReport] = useState<string | null>(null);
  const [probing, setProbing] = useState(false);
  // the "new property" form
  const [adding, setAdding] = useState<{ label: string; key: string; keyTouched: boolean; type: string } | null>(null);
  // other resources' properties and core records, for the settings that pick one
  const [fields, setFields] = useState<Record<string, Field[] | "loading">>({});
  const [subjects, setSubjects] = useState<Subjects | null>(null);
  const [records, setRecords] = useState<Record<string, [string, string][] | "loading">>({});
  // the workflows linked to each resource (its own, and the ones its lifecycle hooks run)
  const [linkedWorkflows, setLinkedWorkflows] = useState<Record<string, { id: string; name: string; via: "workflow" | "hook"; hooks: string[] }[]>>({});
  // what was asked for already (asked during render, so not state)
  const asked = useRef(new Set<string>());
  // the resources still to save, one at a time (each waits for the one before)
  const queue = useRef<{ type: "save" | "saveSettings"; resource: string; payload: Record<string, unknown> }[]>([]);
  const savedCount = useRef(new Set<string>());
  // the resources' own settings (their ResourceDetail records), as read, and as changed here
  const [details, setDetails] = useState<Record<string, Loaded>>({});
  const [settingsWorks, setSettingsWorks] = useState<Record<string, SettingsDraft>>(saved.settingsWorks ?? {});
  const [view, setView] = useState<"properties" | "settings">(saved.view ?? "properties");
  // the properties list folded away (the strip at the left brings it back)
  const [listHidden, setListHidden] = useState(saved.listHidden ?? false);
  // the keys the shortcuts use (the Keyboard shortcuts page's, else the defaults)
  const [shortcuts, setShortcuts] = useState<Bindings>({});
  useEffect(() => listenForShortcuts(send, setShortcuts), []);
  // the favourite settings, one list for every resource and form (host/favourites.js)
  const [favourites, setFavourites] = useFavourites(send);

  // (in braces: VS Code's setState returns the state, which React would take for a cleanup function)
  useEffect(() => {
    vscode.setState({ resource, works, selected, group, trail, clipboard, settingsWorks, view, listHidden } satisfies Saved);
  }, [resource, works, selected, group, trail, clipboard, settingsWorks, view, listHidden]);

  const setWork = (r: string, change: (w: Work) => Work) =>
    setWorks((before) => {
      const next = change(before[r] ?? EMPTY);
      const out = { ...before };
      if (isEmpty(next)) delete out[r];
      else out[r] = next;
      return out;
    });

  /** A resource's settings draft, dropped when nothing in it differs any more. */
  const setSettingsWork = (r: string, draft: SettingsDraft) =>
    setSettingsWorks((before) => {
      const out = { ...before };
      if (Object.keys(draft).length) out[r] = draft;
      else delete out[r];
      return out;
    });

  /** Sends the next save in the queue (a resource's properties or its settings), or says all were saved. */
  const sendNext = () => {
    const next = queue.current.shift();
    if (next) return send(next.type, next.payload);
    setSaving(false);
    setNotice({ kind: "ok", text: savedCount.current.size > 1 ? `Saved ${savedCount.current.size} resources. The instance has the changes, and a backup of each old version was kept.` : "Saved. The instance has the change, and a backup of the old version was kept." });
  };

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      const { type, payload } = event.data ?? {};
      const r: string = payload?.resource;
      switch (type) {
        case "init":
          setInstanceName(payload.instanceName);
          setResources(payload.resources);
          setCore(Array.isArray(payload.core) ? payload.core : null);
          // opened on a resource (a mapped form field's chip on the Workflows screen)
          if (typeof payload.show === "string" && payload.show) { setResource(payload.show); setSelected([]); }
          break;
        case "show":
          setResource(payload.resource);
          setSelected([]);
          break;
        // a code setting's file was saved ("Open in a file"): its text goes into that property's draft
        case "codeFromFile": {
          const { id, path, text } = payload as { id: string; path: string[]; text: string };
          const original = (loadedRef.current[r] ?? []).find((p) => p.key === id);
          const along = ALL.find(({ setting }) => setting.path.join(".") === path.join("."))?.setting.alongside ?? [];
          const put = (prop: Prop) => {
            let next = setAt(prop, path, text);
            for (const a of along) if (get(next, a.path) === undefined) next = setAt(next, a.path, a.value);
            return next;
          };
          setWork(r, (w) => {
            const added = w.added.find((a) => a.id === id);
            if (added) return { ...w, added: w.added.map((a) => (a.id === id ? { ...a, prop: put(a.prop) } : a)) };
            if (!original) return w;
            const next = put(w.drafts[id] ?? asProp(original));
            const drafts = { ...w.drafts };
            if (same(asProp(original), next)) delete drafts[id];
            else drafts[id] = next;
            return { ...w, drafts };
          });
          setNotice({ kind: "ok", text: `${r}.${id}: the file's code is in, not saved yet. Save sends it to the instance.` });
          break;
        }
        case "properties":
          setLoading(false);
          setLoaded((before) => ({ ...before, [r]: tidy(payload.properties) }));
          // drafts of properties that are gone are dropped
          setWork(r, (w) => ({ ...w, drafts: keepDifferent(w.drafts, payload.properties), deleted: w.deleted.filter((k) => payload.properties.some((p: Property) => p.key === k)) }));
          break;
        case "saved":
          setLoaded((before) => ({ ...before, [r]: tidy(payload.properties) }));
          setWork(r, () => EMPTY);
          savedCount.current.add(r);
          sendNext();
          break;
        case "settings":
          setDetails((before) => ({ ...before, [r]: typeof payload.problem === "string" ? { problem: payload.problem } : { id: payload.id, detail: payload.detail } }));
          break;
        case "settingsSaved":
          setDetails((before) => ({ ...before, [r]: { id: payload.id, detail: payload.detail } }));
          setSettingsWork(r, {});
          savedCount.current.add(r);
          sendNext();
          break;
        case "settingsMismatch":
          queue.current = [];
          setSaving(false);
          setDetails((before) => ({ ...before, [r]: { id: payload.id, detail: payload.detail } }));
          // keep only the changes the instance still doesn't have
          setSettingsWorks((before) => {
            const out = { ...before };
            const left = before[r] ? trimDraft(payload.detail, before[r]) : {};
            if (Object.keys(left).length) out[r] = left;
            else delete out[r];
            return out;
          });
          setNotice({ kind: "error", resource: r, text: `${r}: ${payload.message}` });
          break;
        case "restored":
          setSaving(false);
          setLoaded((before) => ({ ...before, [r]: tidy(payload.properties) }));
          setWork(r, () => EMPTY);
          setNotice({ kind: "ok", text: "The backup was put back." });
          break;
        case "saveMismatch":
          queue.current = [];
          setSaving(false);
          setLoaded((before) => ({ ...before, [r]: tidy(payload.properties) }));
          // what's on the instance now is what the screen shows; keep only the changes still to make
          setWork(r, (w) => ({ drafts: keepDifferent(w.drafts, payload.properties), added: w.added.filter((a) => !payload.properties.some((q: Property) => q.key === a.prop.key)), order: null, deleted: w.deleted.filter((k) => payload.properties.some((p: Property) => p.key === k)) }));
          setNotice({ kind: "error", resource: r, text: `${r}: ${payload.message}`, backup: payload.unchanged ? undefined : payload.backup });
          break;
        case "saveFailed":
          queue.current = [];
          setSaving(false);
          setNotice({ kind: "error", resource: r, text: r ? `${r}: ${payload.message}` : payload.message, refused: /doesn't accept changes/.test(payload.message) });
          break;
        case "subjects":
          setSubjects({ groups: payload.groups ?? [], users: payload.users ?? [], permissions: payload.permissions ?? [], error: payload.error ?? null });
          break;
        case "fields":
          setFields((before) => ({ ...before, [r]: payload.fields }));
          break;
        case "workflows":
          setLinkedWorkflows((before) => ({ ...before, [r]: Array.isArray(payload.workflows) ? payload.workflows : [] }));
          break;
        case "options":
          setRecords((before) => ({ ...before, [`${r}|${payload.value}|${payload.label}`]: payload.options }));
          break;
        case "probe":
          setProbing(false);
          setReport(payload.report);
          break;
        case "failed":
          setLoading(false);
          setNotice({ kind: "error", text: payload.message });
          break;
      }
    };
    window.addEventListener("message", onMessage);
    send("init");
    return () => window.removeEventListener("message", onMessage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // a resource's own settings, read the first time they're shown (or when changes to them were kept)
  useEffect(() => {
    const wanted = [...(view === "settings" && resource ? [resource] : []), ...Object.keys(settingsWorks)];
    for (const r of wanted) {
      if (details[r] || asked.current.has(`settings:${r}`)) continue;
      asked.current.add(`settings:${r}`);
      send("settings", { resource: r });
    }
  }, [view, resource, details, settingsWorks]);

  // read the chosen resource (each time it's opened: what the instance has may have changed)
  useEffect(() => {
    if (!resource) return;
    setLoading(true);
    send("load", { resource });
    send("workflows", { resource });
  }, [resource]);

  const work = (resource && works[resource]) || EMPTY;
  const properties = resource ? loaded[resource] : undefined;
  const plan = planOf(properties, work);
  const { all, byKey, originals, ordered, isNew, deleted } = plan;
  const q = query.trim().toLowerCase();
  const shown = ordered.filter((p) => !q || p.shownKey.toLowerCase().includes(q) || (p.label ?? "").toLowerCase().includes(q) || (p.type ?? "").toLowerCase().includes(q));
  const picked = selected.map((k) => byKey.get(k)).filter((p): p is Property => !!p);
  const current = picked[picked.length - 1] ?? null;
  // dragging only on the whole list: in a filtered one "before that one" is ambiguous
  const canMove = !q && !saving;
  const dirtyResources = [...new Set([...Object.keys(works).filter((r) => planOf(loaded[r], works[r]).dirty), ...Object.keys(settingsWorks)])];
  // each resource with changes: its properties' plan and its settings' draft
  const plans = dirtyResources.map((r) => {
    const plan = planOf(loaded[r], works[r] ?? EMPTY);
    const settings = settingsWorks[r] && details[r] && "id" in details[r] ? settingsWorks[r] : undefined;
    return { resource: r, plan, settings, summary: [...plan.summary, settingsSummary(settings)].filter(Boolean) };
  }).filter((x) => x.summary.length);
  const badPlan = plans.find((x) => x.plan.badKey);
  const badSettings = plans.find((x) => settingsError(x.settings));
  const dirty = plans.length > 0;
  const requiredCount = all.filter((p) => p.required && !deleted.has(p.key)).length;

  const draftOf = (key: string): Prop => (isNew(key) ? work.added.find((a) => a.id === key)!.prop : work.drafts[key] ?? originals.get(key)!);
  const originalOf = (key: string): Prop => (isNew(key) ? newProperty(key, byKey.get(key)?.label ?? key, byKey.get(key)?.type ?? "string") : originals.get(key)!);

  /** The properties as edited: kept in drafts while they differ from the instance's. */
  const edit = (next: Record<string, Prop>) => {
    if (!resource) return;
    setNotice(null);
    setWork(resource, (w) => {
      const drafts = { ...w.drafts };
      let added = w.added;
      for (const [key, prop] of Object.entries(next)) {
        if (w.added.some((a) => a.id === key)) added = added.map((a) => (a.id === key ? { ...a, prop } : a));
        else if (same(originals.get(key), prop)) delete drafts[key];
        else drafts[key] = prop;
      }
      return { ...w, drafts, added };
    });
  };

  /** Moves properties (keeping their order) to index `to` of the full list. */
  const move = (keys: string[], to: number) => {
    if (!resource) return;
    const list = ordered.map((p) => p.key);
    const moving = list.filter((k) => keys.includes(k));
    const before = list.slice(0, to).filter((k) => !moving.includes(k)).length;
    const rest = list.filter((k) => !moving.includes(k));
    rest.splice(Math.max(0, Math.min(rest.length, before)), 0, ...moving);
    const instance = [...(properties ?? []).map((p) => p.key), ...work.added.map((a) => a.id)];
    setWork(resource, (w) => ({ ...w, order: rest.join("\n") === instance.join("\n") ? null : rest }));
    setNotice(null);
  };
  /** Moves the picked properties one place up or down, as a block. */
  const nudge = (up: boolean) => {
    const list = ordered.map((p) => p.key);
    const at = selected.map((k) => list.indexOf(k)).filter((i) => i >= 0).sort((a, b) => a - b);
    if (!at.length) return;
    move(selected, up ? Math.max(0, at[0] - 1) : Math.min(list.length, at[at.length - 1] + 2));
  };

  /** Click on a property: picks it; Ctrl/Cmd adds or removes it; Shift picks the run from the last one. */
  const click = (key: string, e: { ctrlKey: boolean; metaKey: boolean; shiftKey: boolean }) => {
    setView("properties");
    if (e.shiftKey && anchor.current) {
      const list = shown.map((p) => p.key);
      const [a, b] = [list.indexOf(anchor.current), list.indexOf(key)].sort((x, y) => x - y);
      if (a >= 0) return setSelected(list.slice(a, b + 1));
    }
    anchor.current = key;
    if (e.ctrlKey || e.metaKey) return setSelected((before) => (before.includes(key) ? before.filter((k) => k !== key) : [...before, key]));
    setSelected([key]);
  };

  const addError = !adding ? null : !adding.label.trim() ? "Give it a label." : !KEY_PATTERN.test(adding.key) ? "The key needs letters, digits and _, starting with a letter." : all.some((p) => p.shownKey === adding.key) ? `${adding.key} is already a property.` : null;
  const add = () => {
    if (!adding || addError || !resource) return;
    const property = newProperty(adding.key, adding.label.trim(), adding.type);
    setWork(resource, (w) => ({ ...w, added: [...w.added, { id: adding.key, prop: property }], order: w.order ? [...w.order, adding.key] : null }));
    setSelected([adding.key]);
    setView("properties");
    anchor.current = adding.key;
    setGroup("general");
    setAdding(null);
    setNotice(null);
  };

  /** A key not used by any property yet: status_copy, status_copy_2, … */
  const freeKey = (base: string, taken: Set<string>) => {
    let key = `${base}_copy`;
    for (let n = 2; taken.has(key); n++) key = `${base}_copy_${n}`;
    taken.add(key);
    return key;
  };
  const duplicate = () => {
    if (!resource) return;
    const taken = new Set(all.map((p) => p.shownKey));
    const copies: Added[] = [];
    const after = new Map<string, string>();
    for (const p of picked.filter((p) => !deleted.has(p.key))) {
      const key = freeKey(p.shownKey, taken);
      copies.push({ id: key, prop: { ...clone(draftOf(p.key)), key, label: `${p.label ?? p.shownKey} (copy)` } });
      after.set(p.key, key);
    }
    if (!copies.length) return;
    // each copy goes right below its original
    const list = ordered.map((p) => p.key).flatMap((k) => (after.has(k) ? [k, after.get(k)!] : [k]));
    setWork(resource, (w) => ({ ...w, added: [...w.added, ...copies], order: list }));
    setSelected(copies.map((c) => c.id));
    anchor.current = copies[copies.length - 1].id;
  };
  const remove = (keys: string[]) => {
    if (!resource) return;
    setWork(resource, (w) => {
      const added = w.added.filter((a) => !keys.includes(a.id));
      const gone = keys.filter((k) => !w.added.some((a) => a.id === k));
      return { ...w, added, order: w.order ? w.order.filter((k) => !keys.includes(k) || gone.includes(k)) : null, deleted: [...new Set([...w.deleted, ...gone])] };
    });
    setSelected((before) => before.filter((k) => !isNew(k) || !keys.includes(k)));
  };
  const restore = (keys: string[]) => resource && setWork(resource, (w) => ({ ...w, deleted: w.deleted.filter((k) => !keys.includes(k)) }));
  /** Pastes the copied settings of the groups switched on into every picked property. */
  const paste = (groups: Record<string, boolean>) => {
    if (!clipboard) return;
    const paths = pastePaths(groups);
    const next: Record<string, Prop> = {};
    for (const p of picked.filter((p) => !deleted.has(p.key))) {
      let draft = draftOf(p.key);
      for (const path of paths) {
        const v = get(clipboard.prop, path);
        draft = setAt(draft, path, v === undefined ? undefined : clone(v), v === undefined);
      }
      next[p.key] = draft;
    }
    edit(next);
    setPasting(null);
  };

  /** Opens another resource, remembering where you were. */
  const openResource = (r: string) => {
    if (!resources?.includes(r)) return setNotice({ kind: "error", text: `${r} isn't a resource on this instance.` });
    if (!resource || r === resource) return;
    setTrail((before) => [...before, { resource, selected }]);
    setResource(r);
    setSelected([]);
    setQuery("");
    setMenu(null);
  };
  const back = (to = trail.length - 1) => {
    const step = trail[to];
    if (!step) return;
    setTrail((before) => before.slice(0, to));
    setResource(step.resource);
    setSelected(step.selected);
    setQuery("");
  };
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // the keys come from the Keyboard shortcuts page (src/keys.ts)
      if (pressed(e, "resources.back", shortcuts) && trail.length) {
        e.preventDefault();
        back();
      }
      if (e.key === "Escape") setMenu(null);
      // T by default (not while typing): fold the properties list away, or bring it back
      const el = e.target as HTMLElement | null;
      const typing = !!el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));
      if (!typing && pressed(e, "resources.list", shortcuts)) {
        e.preventDefault();
        setListHidden((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });
  // the mouse's back button goes back along the trail too (0.3.73)
  useEffect(() => onMouseBack(() => trail.length && back()));

  const discard = () => {
    setWorks({});
    setSettingsWorks({});
    setConfirming(false);
  };

  const save = () => {
    if (!dirty || badPlan || badSettings) return;
    setConfirming(false);
    setSaving(true);
    setNotice(null);
    savedCount.current = new Set();
    queue.current = plans.flatMap(({ resource: r, plan: p, settings }) => [
      ...(p.dirty ? [{
      type: "save" as const,
      resource: r,
      payload: {
        resource: r,
        changes: p.changes,
        ...(p.adds.length ? { adds: p.adds } : {}),
        ...(p.removes.length ? { removes: p.removes } : {}),
        ...(p.renames.length ? { renames: p.renames } : {}),
        ...(p.order ? { order: p.order } : {}),
      },
      }] : []),
      ...(settings ? [{ type: "saveSettings" as const, resource: r, payload: { resource: r, id: (details[r] as { id: string }).id, changes: settings } }] : []),
    ]);
    sendNext();
  };

  const lookups: Lookups = {
    resources: resources ?? [],
    own: all.filter((p) => !deleted.has(p.key)).map((p) => ({ key: p.shownKey, label: p.label, type: p.type })),
    keyTaken: (key) => all.filter((p) => p.key !== current?.key && !deleted.has(p.key)).some((p) => p.shownKey === key),
    openResource,
    // a code setting in its own editor tab (one property picked); saving the file comes back as codeFromFile
    openCode: resource && current ? (path, language, text) => send("openCode", { resource, id: current.key, path, language, text }) : undefined,
    fieldsOf: (r) => {
      const have = fields[r];
      if (have === undefined && !asked.current.has(`fields:${r}`)) {
        asked.current.add(`fields:${r}`);
        send("fields", { resource: r });
      }
      return have === undefined || have === "loading" ? null : have;
    },
    subjects: () => {
      if (!subjects && !asked.current.has("subjects")) {
        asked.current.add("subjects");
        send("subjects");
      }
      return subjects;
    },
    recordsOf: (r, value, label) => {
      const id = `${r}|${value}|${label}`;
      const have = records[id];
      if (have === undefined && !asked.current.has(`options:${id}`)) {
        asked.current.add(`options:${id}`);
        send("options", { resource: r, value, label });
      }
      return have === undefined || have === "loading" ? null : have;
    },
  };

  const unsavedIn = (r: string) => !!((works[r] && !isEmpty(works[r])) || settingsWorks[r]);
  const pickResource = (r: string) => { setResource(r); setSelected([]); setTrail([]); setNotice(null); };
  const unsavedText = plans.length > 1 ? `Unsaved in ${plans.length} resources` : plans.length ? `Unsaved: ${plans[0].summary.join(", ")}${plans[0].resource !== resource ? ` (${plans[0].resource})` : ""}` : "";
  const pickedLive = picked.filter((p) => !deleted.has(p.key));
  const pickedDeleted = picked.filter((p) => deleted.has(p.key));
  const mappedOne = picked.length === 1 ? mappedOf(draftOf(picked[0].key)) : null;

  return (
    <div className="rs-root" onClick={() => menu && setMenu(null)}>
      <header className="rs-top">
        <div className="rs-title">
          <span className="rs-title-main">Resources</span>
          <span className="rs-title-sub">{instanceName}</span>
        </div>
        <ResourcePicker value={resource} disabled={saving} resources={resources} core={core} unsaved={unsavedIn} onPick={pickResource} />
        {resource && (
          <button className="rs-btn" disabled={loading || saving || !!works[resource] || !!settingsWorks[resource]} title={works[resource] || settingsWorks[resource] ? "Save or discard this resource's changes first" : "Read the resource again"} onClick={() => { setLoading(true); setFields({}); asked.current.clear(); setDetails((before) => { const out = { ...before }; delete out[resource]; return out; }); send("load", { resource }); }}>
            Reload
          </button>
        )}
        {resource && (
          <button className={`rs-btn${view === "settings" ? " is-on" : ""}`} aria-pressed={view === "settings"} title={view === "settings" ? "Back to the picked property's settings" : `${resource}'s own settings: description, drawer, sections`} onClick={() => setView(view === "settings" ? "properties" : "settings")}>
            Resource settings
          </button>
        )}
        {resource && properties && (
          <button
            className="rs-btn"
            title={`See ${resource}'s whole schema as JSON (every property, in order, with your unsaved changes in it)`}
            onClick={() => send("viewRaw", { title: `${resource} schema`, text: JSON.stringify(schemaJson(plan), null, 2) })}
          >
            Schema JSON
          </button>
        )}
        {resource && (
          <button className="rs-btn" title={`Open ${resource} in Saturn, in your browser`} onClick={() => send("openInSaturn", { resource })}>
            Open in Saturn ↗
          </button>
        )}
        <span className="rs-push" />
        {dirty && <span className="rs-unsaved">{saving ? "Saving…" : unsavedText}</span>}
        <button className="rs-btn" onClick={() => send("openBackups")}>Backups</button>
        {dirty && <button className="rs-btn" disabled={saving} onClick={discard}>Discard</button>}
        <button className="rs-btn is-primary" disabled={!dirty || saving || confirming || !!badPlan || !!badSettings} title={badPlan ? `Fix the key of ${badPlan.plan.badKey!.label ?? badPlan.plan.badKey!.shownKey} (${badPlan.resource}) first` : badSettings ? `${badSettings.resource}: ${settingsError(badSettings.settings)}` : undefined} onClick={() => setConfirming(true)}>Save</button>
      </header>

      {/* where you are, like a browser's bookmarks bar: the resources jumped through (each with the property you were on),
          then this one and the property picked; a click goes back */}
      {resource && (
        <nav className="rs-crumbbar" aria-label="Where you are">
          {trail.map((step, i) => (
            <span key={i} className="rs-crumb">
              <button className="rs-crumb-btn" title={`Back to ${step.resource}${step.selected.length ? ` (${step.selected.join(", ")})` : ""}`} onClick={() => back(i)}>
                {step.resource}
                {step.selected.length === 1 && <span className="rs-crumb-prop"> › {step.selected[0]}</span>}
              </button>
              <span aria-hidden="true">›</span>
            </span>
          ))}
          <b className="rs-crumb-here">{resource}</b>
          {view === "settings" ? (
            <span className="rs-crumb-prop">› Resource settings</span>
          ) : (
            pickedLive.length > 0 && <span className="rs-crumb-prop">› {pickedLive.length === 1 ? pickedLive[0].label ?? pickedLive[0].shownKey : `${pickedLive.length} properties`}</span>
          )}
          {trail.length > 0 && <button className="rs-btn is-small" title={`Back${hint("resources.back", shortcuts)}`} onClick={() => back()}>‹ Back</button>}
        </nav>
      )}

      {dirty && confirming && (
        <div className="rs-confirm" role="alertdialog" aria-label="Confirm saving">
          <div className="rs-confirm-text">
            {plans.map(({ resource: r, plan: p, summary }) => (
              <div key={r}>
                Save {summary.join(", ")} to <b>{r}</b>.
                {p.removedNames.length > 0 && <span className="rs-removing"> Removes {p.removedNames.join(", ")}: the values records have for {p.removedNames.length === 1 ? "it" : "them"} may be lost.</span>}
              </div>
            ))}
            <div className="rs-confirm-note">On {instanceName}, for everyone using it. A backup of each is kept, and each change is checked after saving.</div>
          </div>
          <button className="rs-btn" onClick={() => setConfirming(false)}>Cancel</button>
          <button className="rs-btn is-primary" onClick={save}>Save</button>
        </div>
      )}

      {notice && (
        <div className={`rs-notice is-${notice.kind}`} role={notice.kind === "error" ? "alert" : "status"}>
          <span>{notice.text}</span>
          {notice.kind === "error" && notice.backup && (
            <button className="rs-btn" disabled={saving} onClick={() => { setSaving(true); setNotice(null); send("restore", { resource: notice.resource ?? resource, backup: notice.backup }); }}>
              Restore backup
            </button>
          )}
          {notice.refused && (
            <button className="rs-btn" disabled={probing} onClick={() => { setProbing(true); setReport(null); send("probe", { resource: notice.resource ?? resource }); }}>
              {probing ? "Checking…" : "Check what it takes"}
            </button>
          )}
          <button className="rs-x" aria-label="Dismiss" onClick={() => setNotice(null)}>×</button>
        </div>
      )}

      {report && (
        <div className="rs-report">
          <div className="rs-report-head">
            <span>What this instance takes (a read-only check: nothing was changed)</span>
            <button className="rs-btn" onClick={() => send("copy", { text: report })}>Copy</button>
            <button className="rs-x" aria-label="Close" onClick={() => setReport(null)}>×</button>
          </div>
          <pre className="rs-json">{report}</pre>
        </div>
      )}

      {!resource ? (
        <ResourceCards resources={resources} core={core} unsaved={unsavedIn} onPick={pickResource} instanceName={instanceName} />
      ) : !properties ? (
        <p className="rs-empty">Loading {resource}…</p>
      ) : (
        <div className="rs-main">
          {listHidden && (
            <button className="rs-side-open" title={`Show the properties${hint("resources.list", shortcuts)}`} aria-label="Show the properties" onClick={() => setListHidden(false)}>
              »
            </button>
          )}
          <aside className="rs-side" hidden={listHidden}>
            <div className="rs-side-top">
              <button className="rs-btn rs-fold" title={`Hide the properties${hint("resources.list", shortcuts)}`} aria-label="Hide the properties" onClick={() => setListHidden(true)}>«</button>
              <input className="rs-search" placeholder="Search properties" aria-label="Search properties" value={query} onChange={(e) => setQuery(e.target.value)} />
              <button className="rs-btn rs-add" title="Add a property" aria-label="Add a property" disabled={saving} onClick={() => setAdding(adding ? null : { label: "", key: "", keyTouched: false, type: "string" })}>+</button>
            </div>
            {adding && (
              <form className="rs-new" onSubmit={(e) => { e.preventDefault(); add(); }}>
                <input className="pe-input" autoFocus placeholder="Label, like First Name" aria-label="New property label" value={adding.label} onChange={(e) => setAdding({ ...adding, label: e.target.value, key: adding.keyTouched ? adding.key : keyFrom(e.target.value) })} />
                <input className="pe-input is-mono" placeholder="key, like first_name" aria-label="New property key" value={adding.key} onChange={(e) => setAdding({ ...adding, key: e.target.value, keyTouched: true })} />
                <Cards label="New property type" value={adding.type} options={TYPES.map(([v, label]) => [v, label] as [string, string])} onPick={(type) => setAdding({ ...adding, type })} />
                {addError && (adding.label || adding.key) && <span className="pe-error">{addError}</span>}
                <div className="pe-btns">
                  <button type="button" className="rs-btn" onClick={() => setAdding(null)}>Cancel</button>
                  <button type="submit" className="rs-btn is-primary" disabled={!!addError}>Add</button>
                </div>
              </form>
            )}
            {(linkedWorkflows[resource] ?? []).length > 0 && (
              <div className="rs-workflows" aria-label="Linked workflows">
                {linkedWorkflows[resource].map((w) => (
                  <button
                    key={w.id}
                    className="rs-wf"
                    title={`Open the ${w.name} workflow${w.via === "workflow" ? ` (${resource}'s workflow)` : ""}${w.hooks.length ? `. Runs on: ${w.hooks.join(", ")}` : ""}`}
                    onClick={() => send("openWorkflow", { workflowId: w.id })}
                  >
                    <span className="rs-wf-kind">{w.via === "workflow" ? "Workflow" : "Hook"}</span>
                    <span className="rs-wf-name">{w.name}</span>
                    <span aria-hidden="true">›</span>
                  </button>
                ))}
              </div>
            )}
            <div className="rs-side-info">
              <span>{all.length - deleted.size} properties · {requiredCount} required{selected.length > 1 ? ` · ${selected.length} picked` : ""}</span>
              {work.order && (
                <button className="rs-link" disabled={saving} onClick={() => setWork(resource!, (w) => ({ ...w, order: null }))}>Reset order</button>
              )}
            </div>
            <div
              className="rs-list"
              ref={listRef}
              role="listbox"
              aria-label="Properties"
              aria-multiselectable="true"
              onDragOver={(e) => { if (dragKeys) e.preventDefault(); }}
              onDrop={(e) => { e.preventDefault(); if (dragKeys && dropAt !== null) move(dragKeys, dropAt); setDragKeys(null); setDropAt(null); }}
              onKeyDown={(e) => {
                if (!current) return;
                if (e.altKey && (e.key === "ArrowUp" || e.key === "ArrowDown") && canMove) {
                  e.preventDefault();
                  nudge(e.key === "ArrowUp");
                } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                  e.preventDefault();
                  const list = shown.map((p) => p.key);
                  const at = list.indexOf(current.key) + (e.key === "ArrowUp" ? -1 : 1);
                  if (at >= 0 && at < list.length) click(list[at], { ctrlKey: false, metaKey: false, shiftKey: e.shiftKey });
                } else if ((e.key === "Delete" || e.key === "Backspace") && !saving) {
                  e.preventDefault();
                  remove(selected);
                }
              }}
            >
              {shown.map((p) => {
                const index = ordered.indexOf(p);
                const isPicked = selected.includes(p.key);
                const gone = deleted.has(p.key);
                const changed = p.key in work.drafts || isNew(p.key);
                const mapped = mappedOf(p.definition as Prop);
                return (
                  <div key={p.key} className="rs-item-wrap">
                    {dropAt === index && dragKeys && <div className="rs-drop" />}
                    <div
                      className={`rs-item${isPicked ? " is-selected" : ""}${dragKeys?.includes(p.key) ? " is-dragging" : ""}${gone ? " is-deleted" : ""}`}
                      role="option"
                      aria-selected={isPicked}
                      tabIndex={current?.key === p.key || (!current && index === 0) ? 0 : -1}
                      draggable={canMove}
                      onClick={(e) => click(p.key, e)}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        if (!isPicked) { setSelected([p.key]); anchor.current = p.key; }
                        setMenu({ x: e.clientX, y: e.clientY });
                      }}
                      onDragStart={(e) => {
                        const keys = isPicked ? ordered.map((x) => x.key).filter((k) => selected.includes(k)) : [p.key];
                        if (!isPicked) setSelected([p.key]);
                        setDragKeys(keys);
                        e.dataTransfer.effectAllowed = "move";
                        e.dataTransfer.setData("text/plain", keys.join(","));
                      }}
                      onDragEnd={() => { setDragKeys(null); setDropAt(null); }}
                      onDragOver={(e) => {
                        if (!dragKeys) return;
                        e.preventDefault();
                        const box = e.currentTarget.getBoundingClientRect();
                        setDropAt(e.clientY < box.top + box.height / 2 ? index : index + 1);
                      }}
                      title={gone ? "Removed when you save (right-click to restore)" : canMove ? "Drag to reorder (or Alt+↑ / Alt+↓). Ctrl/Cmd or Shift+click to pick several." : q ? "Clear the search to reorder" : undefined}
                    >
                      <span className={`rs-grip${mapped ? ` is-${mapped.kind}` : ""}`} aria-hidden="true" />
                      <span className="rs-item-text">
                        <span className="rs-item-label">
                          {p.label ?? p.shownKey}
                          {p.required && <span className="rs-req" title="Required">*</span>}
                          {isNew(p.key) && <span className="rs-new-pill">new</span>}
                        </span>
                        <span className="rs-item-key">{p.shownKey}</span>
                      </span>
                      <span className="rs-item-end">
                        <span className="rs-item-type">{p.type ?? "—"}</span>
                        {mapped && (
                          <button
                            type="button"
                            className={`rs-chip is-${mapped.kind}`}
                            title={`${mapped.kind === "dynamic" ? "Dynamic source" : "Mapped"}: open ${mapped.resource}`}
                            onClick={(e) => { e.stopPropagation(); openResource(mapped.resource); }}
                          >
                            {mapped.resource}
                          </button>
                        )}
                      </span>
                      {changed && !gone && <span className="rs-dot" title="Unsaved change" />}
                    </div>
                  </div>
                );
              })}
              {dropAt === ordered.length && dragKeys && <div className="rs-drop" />}
              {!shown.length && <p className="rs-empty">No property matches “{query}”.</p>}
            </div>
          </aside>

          <section className="rs-detail">
            {view === "settings" ? (
              <SettingsPage
                resource={resource}
                loaded={details[resource]}
                draft={settingsWorks[resource] ?? {}}
                properties={(properties ?? []).filter((p) => !deleted.has(p.key)).map((p) => ({ key: p.key, label: p.label }))}
                disabled={saving}
                onChange={(draft) => { setNotice(null); const d = details[resource]; if (d && "id" in d) setSettingsWork(resource, trimDraft(d.detail, draft)); }}
                onBack={() => setView("properties")}
                onRaw={(text) => send("viewRaw", { title: `${resource} settings`, text })}
              />
            ) : !picked.length ? (
              <p className="rs-empty">Pick a property on the left (Ctrl/Cmd or Shift+click to pick several), or add one with +.</p>
            ) : pickedLive.length === 0 ? (
              <div className="rs-gone">
                <p>{picked.length === 1 ? `${current!.label ?? current!.shownKey} is` : `These ${picked.length} properties are`} removed when you save.</p>
                <button className="rs-btn" onClick={() => restore(selected)}>Restore</button>
              </div>
            ) : pickedLive.some((p) => !p.editable) ? (
              <p className="rs-empty">{pickedLive.find((p) => !p.editable)!.shownKey} isn't stored as settings, so it can't be changed here.</p>
            ) : (
              <>
                <div className="rs-detail-head">
                  <div>
                    <div className="rs-detail-label">{pickedLive.length === 1 ? pickedLive[0].label ?? pickedLive[0].shownKey : `${pickedLive.length} properties`}</div>
                    <div className="rs-detail-key">{pickedLive.map((p) => p.shownKey).join(", ")}</div>
                  </div>
                  <div className="rs-detail-actions">
                    {pickedDeleted.length > 0 && <span className="pe-hint">{pickedDeleted.length} picked {pickedDeleted.length === 1 ? "one is" : "ones are"} removed and left out here</span>}
                    {pickedLive.some((p) => p.key in work.drafts) && (
                      <button className="rs-link" disabled={saving} onClick={() => edit(Object.fromEntries(pickedLive.filter((p) => !isNew(p.key)).map((p) => [p.key, originals.get(p.key)!])))}>
                        Undo all changes to {pickedLive.length === 1 ? "it" : "them"}
                      </button>
                    )}
                    {pickedLive.length === 1 && isNew(pickedLive[0].key) && (
                      <button className="rs-link" disabled={saving} onClick={() => remove([pickedLive[0].key])}>Remove (not saved yet)</button>
                    )}
                    {pickedLive.length === 1 && <span className="rs-pill">{pickedLive[0].type ?? "no type"}</span>}
                  </div>
                </div>
                <PropertyEditor
                  key={pickedLive.map((p) => p.key).join("|")}
                  items={pickedLive.map((p) => ({ original: originalOf(p.key), draft: draftOf(p.key) }))}
                  onChange={(drafts) => edit(Object.fromEntries(pickedLive.map((p, i) => [p.key, drafts[i]])))}
                  lookups={lookups}
                  disabled={saving}
                  group={group}
                  onGroup={setGroup}
                  favourites={favourites}
                  onFavourites={setFavourites}
                />
              </>
            )}
          </section>
        </div>
      )}

      {menu && picked.length > 0 && (
        <div className="rs-menu" role="menu" style={{ left: Math.min(menu.x, window.innerWidth - 230), top: Math.min(menu.y, window.innerHeight - 260) }} onClick={(e) => e.stopPropagation()}>
          {pickedLive.length > 0 && (
            <>
              <button role="menuitem" onClick={() => { duplicate(); setMenu(null); }}>Duplicate{pickedLive.length > 1 ? ` ${pickedLive.length}` : ""}</button>
              {pickedLive.length === 1 && (
                <button role="menuitem" onClick={() => { setClipboard({ from: pickedLive[0].label ?? pickedLive[0].shownKey, resource: resource!, prop: clone(draftOf(pickedLive[0].key)) }); setMenu(null); }}>Copy settings</button>
              )}
              <button role="menuitem" disabled={!clipboard} onClick={() => { setPasting(Object.fromEntries(GROUPS.map((g) => [g.id, g.id !== "general"]))); setMenu(null); }}>
                Paste settings{clipboard ? ` from ${clipboard.from}` : ""}
              </button>
            </>
          )}
          <button role="menuitem" onClick={() => { send("copy", { text: picked.map((p) => p.shownKey).join("\n") }); setMenu(null); }}>Copy {picked.length === 1 ? "key" : "keys"}</button>
          {mappedOne && <button role="menuitem" onClick={() => openResource(mappedOne.resource)}>Go to {mappedOne.resource}</button>}
          <div className="rs-menu-line" />
          {pickedDeleted.length > 0 && <button role="menuitem" onClick={() => { restore(pickedDeleted.map((p) => p.key)); setMenu(null); }}>Restore</button>}
          {pickedLive.length > 0 && <button role="menuitem" className="is-danger" onClick={() => { remove(pickedLive.map((p) => p.key)); setMenu(null); }}>Delete{pickedLive.length > 1 ? ` ${pickedLive.length}` : ""}</button>}
        </div>
      )}

      {pasting && clipboard && (
        <div className="rs-modal-back" onClick={() => setPasting(null)}>
          <div className="rs-modal" role="dialog" aria-label="Paste settings" onClick={(e) => e.stopPropagation()}>
            <h2>Paste settings from {clipboard.from}</h2>
            <p className="pe-hint">Into {pickedLive.length === 1 ? pickedLive[0].label ?? pickedLive[0].shownKey : `${pickedLive.length} properties`}{clipboard.resource !== resource ? ` (copied from ${clipboard.resource})` : ""}. Pick the groups to bring over; the key never is.</p>
            <div className="pe-card">
              {GROUPS.map((g) => (
                <div key={g.id} className="pe-row">
                  <div className="pe-text">
                    <label className="pe-label" htmlFor={`paste-${g.id}`}>{g.title}</label>
                    <span className="pe-hint">{g.id === "general" ? "Label, description, type, tags and rules." : g.blurb}</span>
                  </div>
                  <div className="pe-control">
                    <Switch id={`paste-${g.id}`} on={!!pasting[g.id]} label={g.title} onSet={(on) => setPasting({ ...pasting, [g.id]: on })} />
                  </div>
                </div>
              ))}
            </div>
            <div className="pe-btns">
              <button className="rs-btn" onClick={() => setPasting(null)}>Cancel</button>
              <button className="rs-btn is-primary" disabled={!Object.values(pasting).some(Boolean)} onClick={() => paste(pasting)}>Paste</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/** The whole schema as the instance gives it (a list of properties, each with its key), with the unsaved changes
 *  in it: in the new order, removed ones left out, new ones in, each property as edited (its key as typed). */
function schemaJson(plan: ReturnType<typeof planOf>) {
  return plan.ordered.filter((p) => !plan.deleted.has(p.key)).map((p) => ({ ...(p.definition as Prop), key: p.shownKey }));
}

/** The properties as the host sent them, a label that's only spaces (like " ") read as none, so the key shows. */
const tidy = (list: Property[]) => list.map((p) => (typeof p.label === "string" && !p.label.trim() ? { ...p, label: null } : p));

/** What the list shows of a property as edited. */
function viewOf(id: string, p: Prop, editable: boolean): Property {
  return {
    key: id,
    shownKey: typeof p.key === "string" ? p.key : id,
    label: typeof p.label === "string" && p.label.trim() ? p.label : null,
    type: typeof p.type === "string" ? p.type : null,
    required: p.required === true,
    editable,
    definition: p,
  };
}

/** The drafts still different from what the instance now has (and of properties it still has). */
function keepDifferent(drafts: Record<string, Prop>, properties: Property[]) {
  const now = new Map(properties.map((p) => [p.key, asProp(p)]));
  return Object.fromEntries(Object.entries(drafts).filter(([key, draft]) => now.has(key) && !same(now.get(key), draft)));
}

const style = document.createElement("style");
style.textContent = editorCss + "\n" + css;
document.head.appendChild(style);
createRoot(document.getElementById("resources-root")!).render(<App />);
