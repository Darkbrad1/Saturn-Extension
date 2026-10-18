// Resources: pick a resource; its properties are listed down the left, in the schema's order
// (name, key and type), and can be dragged (or moved with Alt+↑/↓) into a new order, and new
// ones added with +. The one picked shows on the right, with every one of its settings
// (editor.tsx, spec.ts).
// The host side is host/resources.js (it reads the resource and saves it the way Saturn's own app
// does, with a backup and a read-back check). Changes stay here until Save; they survive the tab
// being hidden (webview state), and the resource can't be switched while some are unsaved.
import { createRoot } from "react-dom/client";
import { useEffect, useMemo, useRef, useState } from "react";
import { PropertyEditor, type Field, type Lookups } from "./editor";
import { KEY_PATTERN, diff, keyFrom, newProperty, type Prop } from "./spec";
import css from "./res.css";

declare function acquireVsCodeApi(): { postMessage: (m: unknown) => void; getState: () => unknown; setState: (s: unknown) => void };
const vscode = acquireVsCodeApi();
const send = (type: string, payload: Record<string, unknown> = {}) => vscode.postMessage({ type, payload });

interface Property { key: string; label: string | null; type: string | null; required: boolean; editable: boolean; definition: unknown }
interface Saved {
  resource?: string | null;
  /** property key -> the property as edited here (only the ones that differ from the instance) */
  drafts?: Record<string, Prop>;
  /** new properties, not on the instance yet */
  added?: Prop[];
  order?: string[] | null;
  selected?: string | null;
  group?: string;
}
type Notice = { kind: "ok" | "error"; text: string; backup?: string; refused?: boolean } | null;

const loadSaved = (): Saved => {
  try {
    return (vscode.getState() as Saved) ?? {};
  } catch {
    return {};
  }
};
const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
const asProp = (p: Property): Prop => (p.definition && typeof p.definition === "object" && !Array.isArray(p.definition) ? { ...(p.definition as Prop), key: p.key } : { key: p.key });

function App() {
  const saved = useMemo(loadSaved, []);
  const [instanceName, setInstanceName] = useState("");
  const [resources, setResources] = useState<string[] | null>(null);
  const [resource, setResource] = useState<string | null>(saved.resource ?? null);
  const [properties, setProperties] = useState<Property[] | null>(null);
  const [drafts, setDrafts] = useState<Record<string, Prop>>(saved.drafts ?? {});
  const [added, setAdded] = useState<Prop[]>(saved.added ?? []);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);
  const [query, setQuery] = useState("");
  // every property key in the new order, while the order is changed here (null: as the instance has it)
  const [order, setOrder] = useState<string[] | null>(saved.order ?? null);
  const [selected, setSelected] = useState<string | null>(saved.selected ?? null);
  const [group, setGroup] = useState(saved.group ?? "general");
  // drag and drop: the property being dragged, and where it would land (an index in the list)
  const [dragKey, setDragKey] = useState<string | null>(null);
  const [dropAt, setDropAt] = useState<number | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  // the read-only check of what the instance takes (after a refused save)
  const [report, setReport] = useState<string | null>(null);
  const [probing, setProbing] = useState(false);
  // the "new property" form
  const [adding, setAdding] = useState<{ label: string; key: string; keyTouched: boolean; type: string } | null>(null);
  // other resources' properties and core records, for the settings that pick one
  const [fields, setFields] = useState<Record<string, Field[] | "loading">>({});
  const [records, setRecords] = useState<Record<string, [string, string][] | "loading">>({});
  // what was asked for already (asked during render, so not state)
  const asked = useRef(new Set<string>());

  // (in braces: VS Code's setState returns the state, which React would take for a cleanup function)
  useEffect(() => {
    vscode.setState({ resource, drafts, added, order, selected, group } satisfies Saved);
  }, [resource, drafts, added, order, selected, group]);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      const { type, payload } = event.data ?? {};
      switch (type) {
        case "init":
          setInstanceName(payload.instanceName);
          setResources(payload.resources);
          break;
        case "properties":
          setLoading(false);
          setProperties(payload.properties);
          // drafts of properties that are gone are dropped; a kept order only still applies if it
          // names exactly these properties (and the new ones)
          setDrafts((before) => keepDifferent(before, payload.properties));
          setOrder((before) => before);
          break;
        case "saved":
        case "restored":
          setSaving(false);
          setProperties(payload.properties);
          setDrafts({});
          setAdded([]);
          setOrder(null);
          setNotice({ kind: "ok", text: type === "saved" ? "Saved. The instance has the change, and a backup of the old definition was kept." : "The backup was put back.", backup: payload.backup });
          break;
        case "saveMismatch":
          setSaving(false);
          setProperties(payload.properties);
          // what's on the instance now is what the screen shows; keep only the changes still to make
          setDrafts((before) => keepDifferent(before, payload.properties));
          setAdded((before) => before.filter((p) => !payload.properties.some((q: Property) => q.key === p.key)));
          setOrder(null);
          setNotice({ kind: "error", text: payload.message, backup: payload.unchanged ? undefined : payload.backup });
          break;
        case "saveFailed":
          setSaving(false);
          setNotice({ kind: "error", text: payload.message, refused: /doesn't accept changes/.test(payload.message) });
          break;
        case "fields":
          setFields((before) => ({ ...before, [payload.resource]: payload.fields }));
          break;
        case "options":
          setRecords((before) => ({ ...before, [`${payload.resource}|${payload.value}|${payload.label}`]: payload.options }));
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
  }, []);

  // load the chosen resource (and again after it's chosen anew)
  useEffect(() => {
    if (!resource) return;
    setLoading(true);
    setProperties(null);
    send("load", { resource });
  }, [resource]);

  // every property, as it is here: the instance's with the edits made, then the new ones
  const all: Property[] = [
    ...(properties ?? []).map((p) => (drafts[p.key] ? viewOf(drafts[p.key], p.editable) : p)),
    ...added.map((d) => viewOf(d, true)),
  ];
  const byKey = new Map(all.map((p) => [p.key, p]));
  const originals = new Map((properties ?? []).map((p) => [p.key, asProp(p)]));
  const ordered = order ? [...order.map((k) => byKey.get(k)!).filter(Boolean), ...all.filter((p) => !order.includes(p.key))] : all;
  const q = query.trim().toLowerCase();
  const shown = ordered.filter((p) => !q || p.key.toLowerCase().includes(q) || (p.label ?? "").toLowerCase().includes(q) || (p.type ?? "").toLowerCase().includes(q));
  const current = (selected && byKey.get(selected)) || null;
  const isNew = (key: string) => added.some((p) => p.key === key);
  // dragging only on the whole list: in a filtered one "before that one" is ambiguous
  const canMove = !q && !saving;

  // what Save sends
  const changes = Object.entries(drafts).flatMap(([key, draft]) => diff(originals.get(key), draft).map((c) => ({ key, ...c })));
  const changedProps = new Set(changes.map((c) => c.key)).size;
  const instanceOrder = [...(properties ?? []).map((p) => p.key), ...added.map((p) => String(p.key))];
  const orderToSend = order && order.join("\n") !== instanceOrder.join("\n") ? ordered.map((p) => p.key) : null;
  const dirty = changes.length > 0 || added.length > 0 || orderToSend !== null;

  /** Moves a property to index `to` of the full list; back to the instance's order clears it. */
  const move = (key: string, to: number) => {
    const keys = ordered.map((p) => p.key);
    const from = keys.indexOf(key);
    if (from < 0) return;
    keys.splice(from, 1);
    keys.splice(Math.max(0, Math.min(keys.length, from < to ? to - 1 : to)), 0, key);
    setOrder(keys.join("\n") === instanceOrder.join("\n") ? null : keys);
    setNotice(null);
  };
  const requiredCount = all.filter((p) => p.required).length;

  /** The property as edited: kept in drafts while it differs from the instance's. */
  const edit = (key: string, next: Prop) => {
    setNotice(null);
    if (isNew(key)) return setAdded((before) => before.map((p) => (p.key === key ? next : p)));
    setDrafts((before) => {
      const out = { ...before };
      if (same(originals.get(key), next)) delete out[key];
      else out[key] = next;
      return out;
    });
  };

  const addError = !adding ? null : !adding.label.trim() ? "Give it a label." : !KEY_PATTERN.test(adding.key) ? "The key needs letters, digits and _, starting with a letter." : byKey.has(adding.key) ? `${adding.key} is already a property.` : null;
  const add = () => {
    if (!adding || addError) return;
    const property = newProperty(adding.key, adding.label.trim(), adding.type);
    setAdded((before) => [...before, property]);
    if (order) setOrder([...order, adding.key]);
    setSelected(adding.key);
    setGroup("general");
    setAdding(null);
    setNotice(null);
  };

  const discard = () => {
    setDrafts({});
    setAdded([]);
    setOrder(null);
    setConfirming(false);
  };

  const save = () => {
    if (!resource || !dirty) return;
    setConfirming(false);
    setSaving(true);
    setNotice(null);
    send("save", {
      resource,
      changes,
      ...(added.length ? { adds: added.map((p) => ({ key: p.key, property: p })) } : {}),
      ...(orderToSend ? { order: orderToSend } : {}),
    });
  };

  const lookups: Lookups = {
    resources: resources ?? [],
    own: all.map((p) => ({ key: p.key, label: p.label, type: p.type })),
    fieldsOf: (r) => {
      const have = fields[r];
      if (have === undefined && !asked.current.has(`fields:${r}`)) {
        asked.current.add(`fields:${r}`);
        send("fields", { resource: r });
      }
      return have === undefined || have === "loading" ? null : have;
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

  const summary = [
    changes.length ? `${changes.length} ${changes.length === 1 ? "setting" : "settings"} on ${changedProps} ${changedProps === 1 ? "property" : "properties"}` : "",
    added.length ? `${added.length} new ${added.length === 1 ? "property" : "properties"}` : "",
    orderToSend ? "the order" : "",
  ].filter(Boolean);

  return (
    <div className="rs-root">
      <header className="rs-top">
        <div className="rs-title">
          <span className="rs-title-main">Resources</span>
          <span className="rs-title-sub">{instanceName}</span>
        </div>
        <label className="rs-select" title={dirty ? "Save or discard your changes first" : undefined}>
          Resource
          <select value={resource ?? ""} disabled={!resources || dirty || saving} onChange={(e) => { setResource(e.target.value || null); setSelected(null); setNotice(null); }}>
            <option value="">{resources ? "Pick one" : "Loading…"}</option>
            {(resources ?? []).map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </label>
        {resource && (
          <button className="rs-btn" disabled={loading || saving || dirty} title={dirty ? "Save or discard your changes first" : "Read the resource again"} onClick={() => { setLoading(true); setFields({}); asked.current.clear(); send("load", { resource }); }}>
            Reload
          </button>
        )}
        <button className="rs-btn rs-push" onClick={() => send("openBackups")}>Backups</button>
      </header>

      {notice && (
        <div className={`rs-notice is-${notice.kind}`} role={notice.kind === "error" ? "alert" : "status"}>
          <span>{notice.text}</span>
          {notice.kind === "error" && notice.backup && (
            <button className="rs-btn" disabled={saving} onClick={() => { setSaving(true); setNotice(null); send("restore", { resource, backup: notice.backup }); }}>
              Restore backup
            </button>
          )}
          {notice.refused && (
            <button className="rs-btn" disabled={probing} onClick={() => { setProbing(true); setReport(null); send("probe", { resource }); }}>
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
        <p className="rs-empty">Pick a resource to see its properties.</p>
      ) : loading || !properties ? (
        <p className="rs-empty">Loading {resource}…</p>
      ) : (
        <div className="rs-main">
          <aside className="rs-side">
            <div className="rs-side-top">
              <input className="rs-search" placeholder="Search properties" aria-label="Search properties" value={query} onChange={(e) => setQuery(e.target.value)} />
              <button className="rs-btn rs-add" title="Add a property" aria-label="Add a property" disabled={saving} onClick={() => setAdding(adding ? null : { label: "", key: "", keyTouched: false, type: "string" })}>+</button>
            </div>
            {adding && (
              <form className="rs-new" onSubmit={(e) => { e.preventDefault(); add(); }}>
                <input className="pe-input" autoFocus placeholder="Label, like First Name" aria-label="New property label" value={adding.label} onChange={(e) => setAdding({ ...adding, label: e.target.value, key: adding.keyTouched ? adding.key : keyFrom(e.target.value) })} />
                <input className="pe-input is-mono" placeholder="key, like first_name" aria-label="New property key" value={adding.key} onChange={(e) => setAdding({ ...adding, key: e.target.value, keyTouched: true })} />
                <select className="pe-input" aria-label="New property type" value={adding.type} onChange={(e) => setAdding({ ...adding, type: e.target.value })}>
                  {["string", "number", "boolean", "date", "array", "object"].map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                {addError && (adding.label || adding.key) && <span className="pe-error">{addError}</span>}
                <div className="pe-btns">
                  <button type="button" className="rs-btn" onClick={() => setAdding(null)}>Cancel</button>
                  <button type="submit" className="rs-btn is-primary" disabled={!!addError}>Add</button>
                </div>
              </form>
            )}
            <div className="rs-side-info">
              <span>{all.length} properties · {requiredCount} required</span>
              {order && (
                <button className="rs-link" disabled={saving} onClick={() => setOrder(null)}>Reset order</button>
              )}
            </div>
            <div
              className="rs-list"
              ref={listRef}
              role="listbox"
              aria-label="Properties"
              onDragOver={(e) => { if (dragKey) e.preventDefault(); }}
              onDrop={(e) => { e.preventDefault(); if (dragKey && dropAt !== null) move(dragKey, dropAt); setDragKey(null); setDropAt(null); }}
              onKeyDown={(e) => {
                if (!current) return;
                const index = ordered.findIndex((p) => p.key === current.key);
                if (e.altKey && (e.key === "ArrowUp" || e.key === "ArrowDown") && canMove) {
                  e.preventDefault();
                  move(current.key, e.key === "ArrowUp" ? index - 1 : index + 2);
                } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                  e.preventDefault();
                  const list = shown.map((p) => p.key);
                  const at = list.indexOf(current.key) + (e.key === "ArrowUp" ? -1 : 1);
                  if (at >= 0 && at < list.length) setSelected(list[at]);
                }
              }}
            >
              {shown.map((p) => {
                const index = ordered.indexOf(p);
                const changed = p.key in drafts || isNew(p.key);
                return (
                  <div key={p.key} className="rs-item-wrap">
                    {dropAt === index && dragKey && <div className="rs-drop" />}
                    <div
                      className={`rs-item${current?.key === p.key ? " is-selected" : ""}${dragKey === p.key ? " is-dragging" : ""}`}
                      role="option"
                      aria-selected={current?.key === p.key}
                      tabIndex={current?.key === p.key || (!current && index === 0) ? 0 : -1}
                      draggable={canMove}
                      onClick={() => setSelected(p.key)}
                      onFocus={() => setSelected(p.key)}
                      onDragStart={(e) => { setDragKey(p.key); e.dataTransfer.effectAllowed = "move"; e.dataTransfer.setData("text/plain", p.key); }}
                      onDragEnd={() => { setDragKey(null); setDropAt(null); }}
                      onDragOver={(e) => {
                        if (!dragKey) return;
                        e.preventDefault();
                        const box = e.currentTarget.getBoundingClientRect();
                        setDropAt(e.clientY < box.top + box.height / 2 ? index : index + 1);
                      }}
                      title={canMove ? "Drag to reorder (or Alt+↑ / Alt+↓)" : q ? "Clear the search to reorder" : undefined}
                    >
                      <span className={`rs-grip${p.required ? " is-required" : ""}`} aria-hidden="true" />
                      <span className="rs-item-text">
                        <span className="rs-item-label">{p.label ?? p.key}{isNew(p.key) && <span className="rs-new-pill">new</span>}</span>
                        <span className="rs-item-key">{p.key}</span>
                      </span>
                      <span className="rs-item-type">{p.type ?? "—"}</span>
                      {changed && <span className="rs-dot" title="Unsaved change" />}
                    </div>
                  </div>
                );
              })}
              {dropAt === ordered.length && dragKey && <div className="rs-drop" />}
              {!shown.length && <p className="rs-empty">No property matches “{query}”.</p>}
            </div>
          </aside>

          <section className="rs-detail">
            {!current ? (
              <p className="rs-empty">Pick a property on the left, or add one with +.</p>
            ) : !current.editable ? (
              <p className="rs-empty">{current.key} isn't stored as settings, so it can't be changed here.</p>
            ) : (
              <>
                <div className="rs-detail-head">
                  <div>
                    <div className="rs-detail-label">{current.label ?? current.key}</div>
                    <div className="rs-detail-key">{current.key}</div>
                  </div>
                  <div className="rs-detail-actions">
                    {current.key in drafts && <button className="rs-link" disabled={saving} onClick={() => edit(current.key, originals.get(current.key)!)}>Undo all changes to it</button>}
                    {isNew(current.key) && (
                      <button className="rs-link" disabled={saving} onClick={() => { setAdded((before) => before.filter((p) => p.key !== current.key)); setOrder((before) => (before ? before.filter((k) => k !== current.key) : before)); setSelected(null); }}>
                        Remove (not saved yet)
                      </button>
                    )}
                    <span className="rs-pill">{current.type ?? "no type"}</span>
                  </div>
                </div>
                <PropertyEditor
                  key={current.key}
                  original={isNew(current.key) ? newProperty(current.key, current.label ?? current.key, current.type ?? "string") : originals.get(current.key)!}
                  draft={(isNew(current.key) ? added.find((p) => p.key === current.key) : drafts[current.key]) ?? originals.get(current.key)!}
                  onChange={(next) => edit(current.key, next)}
                  lookups={lookups}
                  disabled={saving}
                  group={group}
                  onGroup={setGroup}
                />
              </>
            )}
          </section>
        </div>
      )}

      {dirty && (
        <footer className="rs-bar">
          {confirming ? (
            <>
              <span>
                Save {summary.join(", ")} to <b>{resource}</b> on {instanceName}? It applies to everyone using it. A backup is kept, and the change is checked after saving.
              </span>
              <button className="rs-btn" onClick={() => setConfirming(false)}>Cancel</button>
              <button className="rs-btn is-primary" onClick={save}>Save</button>
            </>
          ) : (
            <>
              <span>{saving ? "Saving…" : `Unsaved: ${summary.join(", ")}`}</span>
              <button className="rs-btn" disabled={saving} onClick={discard}>Discard</button>
              <button className="rs-btn is-primary" disabled={saving} onClick={() => setConfirming(true)}>Save</button>
            </>
          )}
        </footer>
      )}
    </div>
  );
}

/** What the list shows of a property as edited. */
function viewOf(p: Prop, editable: boolean): Property {
  return {
    key: String(p.key),
    label: typeof p.label === "string" && p.label ? p.label : null,
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
style.textContent = css;
document.head.appendChild(style);
createRoot(document.getElementById("resources-root")!).render(<App />);
