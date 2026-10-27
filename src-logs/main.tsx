// System Logs: a read-only list of the System Logs core resource's records.
import "../src/prism-setup";
import Prism from "prismjs";
import "prismjs/components/prism-json";
import { createRoot } from "react-dom/client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import css from "./logs.css";
import { abs, cellText, dateOf, levelClass, rel, shape, str, type Field, type Rec } from "./records";
import { MessageView, summarize } from "./message";

declare function acquireVsCodeApi(): { postMessage: (m: unknown) => void; getState: () => unknown; setState: (s: unknown) => void };
const vscode = acquireVsCodeApi();
const send = (type: string, payload: Record<string, unknown> = {}) => vscode.postMessage({ type, payload });

interface Init { instanceName: string; instanceUrl: string; resource: string | null; logResources: string[]; allResources: string[]; search?: string; filter?: string }
interface Saved { resource?: string; columns?: Record<string, string[]>; live?: boolean }

const json = (v: unknown) => {
  const t = JSON.stringify(v, null, 2) ?? "";
  try {
    return Prism.highlight(t, Prism.languages.json, "json");
  } catch {
    return t.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  }
};
const loadSaved = (): Saved => {
  try {
    return (vscode.getState() as Saved) ?? {};
  } catch {
    return {};
  }
};

// ---- the page --------------------------------------------------------------------
function App() {
  const saved = useMemo(loadSaved, []);
  const [init, setInit] = useState<Init | null>(null);
  const [resource, setResource] = useState<string | null>(null);
  const [fields, setFields] = useState<Field[]>([]);
  const [records, setRecords] = useState<Rec[]>([]);
  const [total, setTotal] = useState<number | null>(null);
  // false: the instance doesn't return these in date order, so they may not be the newest
  const [ordered, setOrdered] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("");
  const [applied, setApplied] = useState("");
  const [levels, setLevels] = useState<string[]>([]);
  const [live, setLive] = useState(saved.live ?? false);
  const [checked, setChecked] = useState<number | null>(null);
  const [picked, setPicked] = useState<Rec | null>(null);
  const [columns, setColumns] = useState<Record<string, string[]>>(saved.columns ?? {});
  const [colMenu, setColMenu] = useState(false);
  const [now, setNow] = useState(Date.now());
  const [fresh, setFresh] = useState<Set<string>>(new Set());
  const reqId = useRef(0);
  const seen = useRef<Set<string>>(new Set());
  const pending = useRef<number | null>(null);

  useEffect(() => {
    try {
      vscode.setState({ resource: resource ?? undefined, columns, live } satisfies Saved);
    } catch {}
  }, [resource, columns, live]);

  const keyOf = (r: Rec, i: number) => (r.id !== undefined ? String(r.id) : `${i}:${JSON.stringify(r).length}`);
  const show = (list: Rec[]) => {
    // highlight rows that weren't there before (live mode)
    const ids = list.map(keyOf);
    const isNew = seen.current.size > 0 ? new Set(ids.filter((k) => !seen.current.has(k))) : new Set<string>();
    ids.forEach((k) => seen.current.add(k));
    setFresh(isNew);
    setRecords(list);
    setLoading(false);
    setError(null);
    setNow(Date.now());
    setChecked(Date.now());
  };
  const show$ = useRef(show);
  show$.current = show;

  // the host's replies
  useEffect(() => {
    const on = (ev: MessageEvent) => {
      const m = ev.data;
      if (!m || typeof m !== "object") return;
      const p = m.payload ?? {};
      if (m.type === "init") {
        setInit(p);
        setResource(p.resource ?? saved.resource ?? null);
        if (!p.resource && !saved.resource) setError(null);
        if (p.search) setQuery(p.search);
        if (p.filter) {
          setFilter(p.filter);
          setApplied(p.filter);
        }
      } else if (m.type === "search") {
        // opened again from a workflow's Logs tab
        setQuery(typeof p.text === "string" ? p.text : "");
        const f = typeof p.filter === "string" ? p.filter : "";
        setFilter(f);
        setApplied(f);
      } else if (m.type === "fields") {
        setFields(p.fields ?? []);
      } else if (m.type === "page") {
        if (pending.current !== p.reqId) return;
        pending.current = null;
        setTotal(typeof p.total === "number" ? p.total : null);
        setOrdered(p.ordered !== false);
        show$.current(p.records ?? []);
      } else if (m.type === "error") {
        if (pending.current !== null && p.reqId !== undefined && pending.current !== p.reqId) return;
        pending.current = null;
        setLoading(false);
        setError(p.message ?? "Could not read the logs");
      }
    };
    window.addEventListener("message", on);
    send("init");
    return () => window.removeEventListener("message", on);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Read the newest 10 records (the host never reads more). */
  const request = useCallback(() => {
    if (!resource) return;
    const id = ++reqId.current;
    pending.current = id;
    setLoading(true);
    send("fetch", { reqId: id, resource, filter: applied });
  }, [resource, applied]);

  // a new resource or server filter: start again
  useEffect(() => {
    if (!resource) return;
    seen.current = new Set();
    setPicked(null);
    send("fields", { resource });
    request();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resource, applied]);

  // live: check for new logs every 5 s (and straight away when it's turned on)
  useEffect(() => {
    if (!live || !resource) return;
    if (pending.current === null) request();
    const t = setInterval(() => {
      if (pending.current === null) request();
    }, 5000);
    return () => clearInterval(t);
  }, [live, resource, request]);
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), live ? 1000 : 30000);
    return () => clearInterval(t);
  }, [live]);

  const sh = useMemo(() => shape(records, fields), [records, fields]);
  const cols = (resource && columns[resource]) || sh.defaults;
  const labelOf = (k: string) => fields.find((f) => f.key === k)?.label || k;
  const levelValues = useMemo(
    () => (sh.levelKey ? [...new Set(records.map((r) => str(r[sh.levelKey!])).filter(Boolean))].sort() : []),
    [records, sh.levelKey],
  );
  const q = query.trim().toLowerCase();
  const shown = records.filter(
    (r) =>
      (!levels.length || (sh.levelKey && levels.includes(str(r[sh.levelKey])))) &&
      (!q || q.split(/\s+/).every((w) => JSON.stringify(r).toLowerCase().includes(w))),
  );

  if (!init) return <div className="lg-empty">Connecting…</div>;

  return (
    <div className="lg-root">
      <header className="lg-top">
        <div className="lg-title">
          <span className="lg-title-main">System Logs</span>
          <span className="lg-title-sub">{init.instanceName}</span>
          <span className="lg-ro" title="This view only reads records. Nothing here changes the logs.">Read-only</span>
        </div>
        <div className="lg-tools">
          <label className="lg-select" title="The resource these logs are read from">
            <span>Resource</span>
            <select
              aria-label="Resource"
              value={resource ?? ""}
              onChange={(e) => {
                setResource(e.target.value || null);
                setColumns((c) => c);
                send("chooseResource", { resource: e.target.value });
              }}
            >
              {!resource && <option value="">— pick one —</option>}
              {init.logResources.length > 0 && (
                <optgroup label="Log resources">
                  {init.logResources.map((n) => <option key={n} value={n}>{n}</option>)}
                </optgroup>
              )}
              <optgroup label="All resources">
                {init.allResources.filter((n) => !init.logResources.includes(n)).map((n) => <option key={n} value={n}>{n}</option>)}
              </optgroup>
            </select>
          </label>
          <button
            type="button"
            className={`lg-btn ${live ? "is-on" : ""}`}
            aria-pressed={live}
            title="Check for new logs every 5 seconds"
            onClick={() => setLive((v) => !v)}
          >
            <span className={`lg-live-dot ${live ? "is-on" : ""}`} /> Live
          </button>
          {live && checked !== null && (
            <span className="lg-checked" title="When the newest logs were last read">
              checked {Math.max(0, Math.round((now - checked) / 1000))} s ago
            </span>
          )}
          <button type="button" className="lg-btn" onClick={() => request()} disabled={!resource || loading} title="Refresh">
            {loading ? "Reading…" : "Refresh"}
          </button>
          <button type="button" className="lg-btn" onClick={() => resource && send("schema", { resource })} disabled={!resource} title="The log resource's schema (its properties) as JSON, in a tab beside">
            Schema JSON
          </button>
        </div>
      </header>

      {!resource ? (
        <div className="lg-empty">
          <p><b>No System Logs resource was found on {init.instanceName}.</b></p>
          <p>Pick the resource that holds the logs above — it's remembered for this instance. You can also set <code>saturn.systemLogResource</code> in Settings.</p>
        </div>
      ) : (
        <>
          <div className="lg-filters">
            <input
              className="lg-search"
              placeholder="Search these logs…"
              aria-label="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <form
              className="lg-filter-form"
              onSubmit={(e) => {
                e.preventDefault();
                setApplied(filter.trim());
              }}
            >
              <input
                className="lg-search is-mono"
                placeholder={'Server filter, e.g. log_type = "error" — Enter to apply'}
                aria-label="Server filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
              {applied && (
                <button type="button" className="lg-chip is-on" title="Clear the server filter" onClick={() => { setFilter(""); setApplied(""); }}>
                  filter on ×
                </button>
              )}
            </form>
            {levelValues.length > 0 && (
              <div className="lg-levels" role="group" aria-label={labelOf(sh.levelKey!)}>
                {levelValues.map((v) => (
                  <button
                    key={v}
                    type="button"
                    className={`lg-chip ${levelClass(v)} ${levels.includes(v) ? "is-on" : ""}`}
                    aria-pressed={levels.includes(v)}
                    onClick={() => setLevels((l) => (l.includes(v) ? l.filter((x) => x !== v) : [...l, v]))}
                  >
                    {v}
                  </button>
                ))}
              </div>
            )}
            <div className="lg-spacer" />
            <div className="lg-colpick">
              <button type="button" className="lg-btn" onClick={() => setColMenu((v) => !v)} aria-expanded={colMenu}>
                Columns ▾
              </button>
              {colMenu && (
                <div className="lg-colmenu" onMouseLeave={() => setColMenu(false)}>
                  {sh.keys.map((k) => (
                    <label key={k} className="lg-colitem">
                      <input
                        type="checkbox"
                        checked={cols.includes(k)}
                        onChange={(e) =>
                          setColumns((c) => ({
                            ...c,
                            [resource]: e.target.checked ? [...cols, k] : cols.filter((x) => x !== k),
                          }))
                        }
                      />
                      {labelOf(k)}
                      {labelOf(k) !== k && <code>{k}</code>}
                    </label>
                  ))}
                  <button type="button" className="lg-link" onClick={() => setColumns((c) => { const n = { ...c }; delete n[resource]; return n; })}>
                    Reset to default
                  </button>
                </div>
              )}
            </div>
          </div>

          {error && <div className="lg-error">{error}</div>}

          <div className={`lg-body ${picked ? "has-detail" : ""}`}>
            <div className="lg-table-wrap">
              <table className="lg-table">
                <thead>
                  <tr>
                    {cols.map((k) => (
                      <th key={k} className={k === sh.messageKey ? "is-msg" : ""}>{labelOf(k)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {shown.map((r, i) => {
                    const id = keyOf(r, i);
                    return (
                      <tr
                        key={id}
                        className={`${picked === r ? "is-picked" : ""} ${fresh.has(id) ? "is-fresh" : ""}`}
                        onClick={() => setPicked(picked === r ? null : r)}
                        tabIndex={0}
                        onKeyDown={(e) => e.key === "Enter" && setPicked(picked === r ? null : r)}
                      >
                        {cols.map((k) => {
                          const v = r[k];
                          if (k === sh.dateKey) {
                            const t = dateOf(v);
                            return (
                              <td key={k} className="is-time" title={t !== null ? abs(t) : str(v)}>
                                {t !== null ? (<><span className="lg-rel">{rel(t, now)}</span><span className="lg-abs">{abs(t)}</span></>) : str(v)}
                              </td>
                            );
                          }
                          if (k === sh.levelKey)
                            return (
                              <td key={k}>
                                {str(v) && <span className={`lg-level ${levelClass(str(v))}`}>{str(v)}</span>}
                              </td>
                            );
                          const s = k === sh.messageKey && typeof v === "string" ? summarize(v) : cellText(k, v);
                          return (
                            <td key={k} className={k === sh.messageKey ? "is-msg" : typeof v === "object" && v ? "is-mono" : ""} title={s.length > 120 ? s.slice(0, 1000) : undefined}>
                              {s.length > 300 ? s.slice(0, 300) + "…" : s}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                  {!loading && shown.length === 0 && (
                    <tr>
                      <td colSpan={Math.max(1, cols.length)} className="lg-none">
                        {records.length ? "Nothing here matches." : "No log records."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {picked && (
              <aside className="lg-detail" aria-label="Log record">
                <div className="lg-detail-head">
                  <b>Record {picked.id !== undefined ? `#${str(picked.id)}` : ""}</b>
                  <span className="lg-spacer" />
                  <button type="button" className="lg-btn" onClick={() => send("copy", { text: JSON.stringify(picked, null, 2) })}>Copy JSON</button>
                  <button type="button" className="lg-btn" onClick={() => send("openJson", { record: picked })}>Open as JSON</button>
                  <button type="button" className="lg-x" aria-label="Close" onClick={() => setPicked(null)}>×</button>
                </div>
                {sh.messageKey && typeof picked[sh.messageKey] === "string" && (
                  <section className="lg-message" aria-label="Message">
                    <MessageView text={picked[sh.messageKey] as string} json={json} onCopy={(v) => send("copy", { text: JSON.stringify(v, null, 2) })} />
                  </section>
                )}
                <dl className="lg-kv">
                  {Object.entries(picked).filter(([k]) => k !== sh.messageKey).map(([k, v]) => (
                    <div key={k} className="lg-kv-row">
                      <dt title={k}>{labelOf(k)}</dt>
                      <dd>
                        {v !== null && typeof v === "object" ? (
                          <pre className="lg-json" dangerouslySetInnerHTML={{ __html: json(v) }} />
                        ) : k === sh.dateKey && dateOf(v) !== null ? (
                          <>{abs(dateOf(v)!)} <span className="lg-muted">({str(v)})</span></>
                        ) : (
                          <span className="lg-pre">{str(v)}</span>
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
              </aside>
            )}
          </div>

          <footer className="lg-foot">
            <span>
              The newest {records.length}
              {total !== null ? ` of ${total.toLocaleString()} record${total === 1 ? "" : "s"}` : ""}
              {shown.length !== records.length ? ` · ${shown.length} match` : ""}
            </span>
            {!ordered && (
              <span className="lg-warn" title="Saturn didn't sort these by date, so newer logs may exist">
                · not in date order on this instance, so these may not be the newest
              </span>
            )}
          </footer>
        </>
      )}
    </div>
  );
}

const style = document.createElement("style");
style.textContent = css;
document.head.appendChild(style);
createRoot(document.getElementById("logs-root")!).render(<App />);
