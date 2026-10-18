// Resources: pick a resource, see its properties, change whether each is required.
// The host side is host/resources.js (it reads and writes /Resources/<name>, with a backup and a
// read-back check). Changes stay here until Save; they survive the tab being hidden (webview state),
// and the resource can't be switched while some are unsaved.
import { createRoot } from "react-dom/client";
import { useEffect, useMemo, useState } from "react";
import css from "./res.css";

declare function acquireVsCodeApi(): { postMessage: (m: unknown) => void; getState: () => unknown; setState: (s: unknown) => void };
const vscode = acquireVsCodeApi();
const send = (type: string, payload: Record<string, unknown> = {}) => vscode.postMessage({ type, payload });

interface Property { key: string; label: string | null; type: string | null; required: boolean; editable: boolean; definition: unknown }
interface Saved { resource?: string | null; pending?: Record<string, boolean> }
type Notice = { kind: "ok" | "error"; text: string; backup?: string } | null;

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
  const [open, setOpen] = useState<string | null>(null);

  // (in braces: VS Code's setState returns the state, which React would take for a cleanup function)
  useEffect(() => {
    vscode.setState({ resource, pending } satisfies Saved);
  }, [resource, pending]);

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
          break;
        case "saved":
        case "restored":
          setSaving(false);
          setProperties(payload.properties);
          setPending({});
          setNotice({ kind: "ok", text: type === "saved" ? "Saved — the instance has the change. A backup of the old definition was kept." : "The backup was put back.", backup: payload.backup });
          break;
        case "saveMismatch":
          setSaving(false);
          setProperties(payload.properties);
          // what's on the instance now is what the table shows; keep only the changes still to make
          setPending((before) => keepDifferent(before, payload.properties));
          setNotice({ kind: "error", text: payload.message, backup: payload.unchanged ? undefined : payload.backup });
          break;
        case "saveFailed":
          setSaving(false);
          setNotice({ kind: "error", text: payload.message });
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
    setOpen(null);
    send("load", { resource });
  }, [resource]);

  const changes = Object.entries(pending).map(([key, required]) => ({ key, required }));
  const dirty = changes.length > 0;
  const shown = (properties ?? []).filter((p) => {
    const q = query.trim().toLowerCase();
    return !q || p.key.toLowerCase().includes(q) || (p.label ?? "").toLowerCase().includes(q) || (p.type ?? "").toLowerCase().includes(q);
  });
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
    send("save", { resource, changes });
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
          <button className="rs-x" aria-label="Dismiss" onClick={() => setNotice(null)}>×</button>
        </div>
      )}

      {!resource ? (
        <p className="rs-empty">Pick a resource to see its properties.</p>
      ) : loading || !properties ? (
        <p className="rs-empty">Loading {resource}…</p>
      ) : (
        <>
          <div className="rs-filters">
            <input className="rs-search" placeholder="Filter properties" value={query} onChange={(e) => setQuery(e.target.value)} />
            <span className="rs-count">{properties.length} properties · {requiredCount} required</span>
          </div>
          <div className="rs-table-wrap">
            <table className="rs-table">
              <thead>
                <tr><th>Property</th><th>Type</th><th className="rs-c">Required</th><th /></tr>
              </thead>
              <tbody>
                {shown.map((p) => {
                  const value = p.key in pending ? pending[p.key] : p.required;
                  const changed = p.key in pending;
                  return [
                    <tr key={p.key} className={changed ? "is-changed" : undefined}>
                      <td>
                        <div className="rs-label">{p.label ?? p.key}</div>
                        <div className="rs-key">{p.key}</div>
                      </td>
                      <td className="rs-type">{p.type ?? "—"}</td>
                      <td className="rs-c">
                        <input
                          type="checkbox"
                          aria-label={`${p.label ?? p.key} required`}
                          checked={value}
                          disabled={!p.editable || saving}
                          onChange={() => toggle(p)}
                        />
                        {changed && <span className="rs-was">was {p.required ? "required" : "optional"}</span>}
                      </td>
                      <td className="rs-c">
                        <button className="rs-link" onClick={() => setOpen(open === p.key ? null : p.key)}>{open === p.key ? "Hide" : "Details"}</button>
                      </td>
                    </tr>,
                    open === p.key && (
                      <tr key={`${p.key}:json`} className="rs-json-row">
                        <td colSpan={4}><pre className="rs-json">{JSON.stringify(p.definition, null, 2)}</pre></td>
                      </tr>
                    ),
                  ];
                })}
                {!shown.length && <tr><td colSpan={4} className="rs-empty">No property matches “{query}”.</td></tr>}
              </tbody>
            </table>
          </div>
        </>
      )}

      {dirty && (
        <footer className="rs-bar">
          {confirming ? (
            <>
              <span>
                Change {changes.length} {changes.length === 1 ? "property" : "properties"} of <b>{resource}</b> on {instanceName}? It applies to everyone using it. A backup is kept, and the change is checked after saving.
              </span>
              <button className="rs-btn" onClick={() => setConfirming(false)}>Cancel</button>
              <button className="rs-btn is-primary" onClick={save}>Save</button>
            </>
          ) : (
            <>
              <span>{saving ? "Saving…" : `${changes.length} unsaved ${changes.length === 1 ? "change" : "changes"}`}</span>
              <button className="rs-btn" disabled={saving} onClick={() => { setPending({}); setConfirming(false); }}>Discard</button>
              <button className="rs-btn is-primary" disabled={saving} onClick={() => setConfirming(true)}>Save</button>
            </>
          )}
        </footer>
      )}
    </div>
  );
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
