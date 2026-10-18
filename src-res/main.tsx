// Resources: pick a resource; its properties are listed down the left, in the schema's order —
// name, key and type — and can be dragged (or moved with Alt+↑/↓) into a new order; the one picked
// shows on the right, where it can be made required or not.
// The host side is host/resources.js (it reads the resource and saves it the way Saturn's own app
// does, with a backup and a read-back check). Changes stay here until Save; they survive the tab
// being hidden (webview state), and the resource can't be switched while some are unsaved.
import { createRoot } from "react-dom/client";
import { useEffect, useMemo, useRef, useState } from "react";
import css from "./res.css";

declare function acquireVsCodeApi(): { postMessage: (m: unknown) => void; getState: () => unknown; setState: (s: unknown) => void };
const vscode = acquireVsCodeApi();
const send = (type: string, payload: Record<string, unknown> = {}) => vscode.postMessage({ type, payload });

interface Property { key: string; label: string | null; type: string | null; required: boolean; editable: boolean; definition: unknown }
interface Saved { resource?: string | null; pending?: Record<string, boolean>; order?: string[] | null; selected?: string | null }
type Notice = { kind: "ok" | "error"; text: string; backup?: string; refused?: boolean } | null;

const loadSaved = (): Saved => {
  try {
    return (vscode.getState() as Saved) ?? {};
  } catch {
    return {};
  }
};

function App() {
  const saved = useMemo(loadSaved, []);
  const [instanceName, setInstanceName] = useState("");
  const [resources, setResources] = useState<string[] | null>(null);
  const [resource, setResource] = useState<string | null>(saved.resource ?? null);
  const [properties, setProperties] = useState<Property[] | null>(null);
  // property key -> the required value chosen here, for the ones that differ from the instance
  const [pending, setPending] = useState<Record<string, boolean>>(saved.pending ?? {});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);
  const [query, setQuery] = useState("");
  // every property key in the new order, while the order is changed here (null: as the instance has it)
  const [order, setOrder] = useState<string[] | null>(saved.order ?? null);
  const [selected, setSelected] = useState<string | null>(saved.selected ?? null);
  const [showJson, setShowJson] = useState(false);
  // drag and drop: the property being dragged, and where it would land (an index in the list)
  const [dragKey, setDragKey] = useState<string | null>(null);
  const [dropAt, setDropAt] = useState<number | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  // the read-only check of what the instance takes (after a refused save)
  const [report, setReport] = useState<string | null>(null);
  const [probing, setProbing] = useState(false);

  // (in braces: VS Code's setState returns the state, which React would take for a cleanup function)
  useEffect(() => {
    vscode.setState({ resource, pending, order, selected } satisfies Saved);
  }, [resource, pending, order, selected]);

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
          // a kept order only still applies if it names exactly these properties
          setOrder((before) => (before && sameKeys(before, payload.properties) ? before : null));
          break;
        case "saved":
        case "restored":
          setSaving(false);
          setProperties(payload.properties);
          setPending({});
          setOrder(null);
          setNotice({ kind: "ok", text: type === "saved" ? "Saved — the instance has the change. A backup of the old definition was kept." : "The backup was put back.", backup: payload.backup });
          break;
        case "saveMismatch":
          setSaving(false);
          setProperties(payload.properties);
          // what's on the instance now is what the table shows; keep only the changes still to make
          setPending((before) => keepDifferent(before, payload.properties));
          setOrder((before) => (before && sameKeys(before, payload.properties) && before.join() !== payload.properties.map((p: Property) => p.key).join() ? before : null));
          setNotice({ kind: "error", text: payload.message, backup: payload.unchanged ? undefined : payload.backup });
          break;
        case "saveFailed":
          setSaving(false);
          setNotice({ kind: "error", text: payload.message, refused: /doesn't accept changes/.test(payload.message) });
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

  const changes = Object.entries(pending).map(([key, required]) => ({ key, required }));
  const dirty = changes.length > 0 || order !== null;
  const changeCount = changes.length + (order ? 1 : 0);
  // the properties in the order shown: the new order if there is one, else the instance's
  const byKey = new Map((properties ?? []).map((p) => [p.key, p]));
  const ordered = order ? order.map((k) => byKey.get(k)!).filter(Boolean) : properties ?? [];
  const q = query.trim().toLowerCase();
  const shown = ordered.filter((p) => !q || p.key.toLowerCase().includes(q) || (p.label ?? "").toLowerCase().includes(q) || (p.type ?? "").toLowerCase().includes(q));
  const current = (selected && byKey.get(selected)) || null;
  // dragging only on the whole list: in a filtered one "before that one" is ambiguous
  const canMove = !q && !saving;

  /** Moves a property to index `to` of the full list; back to the instance's order clears it. */
  const move = (key: string, to: number) => {
    const keys = ordered.map((p) => p.key);
    const from = keys.indexOf(key);
    if (from < 0) return;
    keys.splice(from, 1);
    keys.splice(Math.max(0, Math.min(keys.length, from < to ? to - 1 : to)), 0, key);
    const original = (properties ?? []).map((p) => p.key);
    setOrder(keys.join("\n") === original.join("\n") ? null : keys);
    setNotice(null);
  };
  const requiredCount = (properties ?? []).filter((p) => (p.key in pending ? pending[p.key] : p.required)).length;

  const toggle = (p: Property) => {
    if (!p.editable || saving) return;
    const chosen = !(p.key in pending ? pending[p.key] : p.required);
    setPending((before) => {
      const next = { ...before };
      if (chosen === p.required) delete next[p.key]; // back to what the instance has
      else next[p.key] = chosen;
      return next;
    });
    setNotice(null);
  };

  const save = () => {
    if (!resource || !dirty) return;
    setConfirming(false);
    setSaving(true);
    setNotice(null);
    send("save", { resource, changes, ...(order ? { order } : {}) });
  };

  return (
    <div className="rs-root">
      <header className="rs-top">
        <div className="rs-title">
          <span className="rs-title-main">Resources</span>
          <span className="rs-title-sub">{instanceName}</span>
        </div>
        <label className="rs-select" title={dirty ? "Save or discard your changes first" : undefined}>
          Resource
          <select value={resource ?? ""} disabled={!resources || dirty || saving} onChange={(e) => { setResource(e.target.value || null); setNotice(null); }}>
            <option value="">{resources ? "— pick one —" : "Loading…"}</option>
            {(resources ?? []).map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </label>
        {resource && (
          <button className="rs-btn" disabled={loading || saving || dirty} title={dirty ? "Save or discard your changes first" : "Read the resource again"} onClick={() => { setLoading(true); send("load", { resource }); }}>
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
            <span>What this instance takes (read-only check — nothing was changed)</span>
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
            </div>
            <div className="rs-side-info">
              <span>{properties.length} properties · {requiredCount} required</span>
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
                const changed = p.key in pending;
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
                      <span className={`rs-grip${(p.key in pending ? pending[p.key] : p.required) ? " is-required" : ""}`} aria-hidden="true" />
                      <span className="rs-item-text">
                        <span className="rs-item-label">{p.label ?? p.key}</span>
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
              <p className="rs-empty">Pick a property on the left.</p>
            ) : (
              <>
                <div className="rs-detail-head">
                  <div>
                    <div className="rs-detail-label">{current.label ?? current.key}</div>
                    <div className="rs-detail-key">{current.key}</div>
                  </div>
                  <span className="rs-pill">{current.type ?? "no type"}</span>
                </div>
                <label className="rs-field">
                  <input
                    type="checkbox"
                    aria-label={`${current.label ?? current.key} required`}
                    checked={current.key in pending ? pending[current.key] : current.required}
                    disabled={!current.editable || saving}
                    onChange={() => toggle(current)}
                  />
                  <span>
                    Required
                    {current.key in pending && <span className="rs-was">was {current.required ? "required" : "optional"}</span>}
                  </span>
                </label>
                <button className="rs-link" onClick={() => setShowJson(!showJson)}>{showJson ? "Hide the whole definition" : "Show the whole definition"}</button>
                {showJson && <pre className="rs-json">{JSON.stringify(current.definition, null, 2)}</pre>}
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
                Change {[changes.length ? `Required on ${changes.length} ${changes.length === 1 ? "property" : "properties"}` : "", order ? "the order of the properties" : ""].filter(Boolean).join(" and ")} of <b>{resource}</b> on {instanceName}? It applies to everyone using it. A backup is kept, and the change is checked after saving.
              </span>
              <button className="rs-btn" onClick={() => setConfirming(false)}>Cancel</button>
              <button className="rs-btn is-primary" onClick={save}>Save</button>
            </>
          ) : (
            <>
              <span>{saving ? "Saving…" : `${changeCount} unsaved ${changeCount === 1 ? "change" : "changes"}${order ? " (incl. the order)" : ""}`}</span>
              <button className="rs-btn" disabled={saving} onClick={() => { setPending({}); setOrder(null); setConfirming(false); }}>Discard</button>
              <button className="rs-btn is-primary" disabled={saving} onClick={() => setConfirming(true)}>Save</button>
            </>
          )}
        </footer>
      )}
    </div>
  );
}

/** Whether a key list names exactly these properties (in any order). */
function sameKeys(keys: string[], properties: Property[]) {
  return keys.length === properties.length && properties.every((p) => keys.includes(p.key));
}

/** The pending changes still different from what the instance now has. */
function keepDifferent(pending: Record<string, boolean>, properties: Property[]) {
  const now = new Map(properties.map((p) => [p.key, p.required]));
  return Object.fromEntries(Object.entries(pending).filter(([key, required]) => now.has(key) && now.get(key) !== required));
}

const style = document.createElement("style");
style.textContent = css;
document.head.appendChild(style);
createRoot(document.getElementById("resources-root")!).render(<App />);
