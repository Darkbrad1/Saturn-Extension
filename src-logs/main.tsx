// System Logs: a read-only list of the System Logs core resource's records.
import "../src/prism-setup";
import Prism from "prismjs";
import "prismjs/components/prism-json";
import { createRoot } from "react-dom/client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import css from "./logs.css";
import { abs, ascending, dateOf, levelClass, rel, shape, str, type Field, type Rec } from "./records";

declare function acquireVsCodeApi(): { postMessage: (m: unknown) => void; getState: () => unknown; setState: (s: unknown) => void };
const vscode = acquireVsCodeApi();
const send = (type: string, payload: Record<string, unknown> = {}) => vscode.postMessage({ type, payload });

interface Init { instanceName: string; instanceUrl: string; resource: string | null; logResources: string[]; allResources: string[]; search?: string }
interface Saved { resource?: string; limit?: number; columns?: Record<string, string[]>; live?: boolean }

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
  const [limit, setLimit] = useState(saved.limit ?? 50);
  const [page, setPage] = useState(1); // 1 = newest
  const [records, setRecords] = useState<Rec[]>([]);
  const [total, setTotal] = useState<number | null>(null);
  const [order, setOrder] = useState<"asc" | "desc" | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("");
  const [applied, setApplied] = useState("");
  const [levels, setLevels] = useState<string[]>([]);
  const [live, setLive] = useState(saved.live ?? false);
  const [picked, setPicked] = useState<Rec | null>(null);
  const [columns, setColumns] = useState<Record<string, string[]>>(saved.columns ?? {});
  const [colMenu, setColMenu] = useState(false);
  const [now, setNow] = useState(Date.now());
  const [fresh, setFresh] = useState<Set<string>>(new Set());
  const reqId = useRef(0);
  const seen = useRef<Set<string>>(new Set());
  const pending = useRef<{ id: number; kind: "probe" | "page"; page: number } | null>(null);
  // the message handler is registered once; it reads the latest values through this
  const live$ = useRef({ limit, order, request: (() => {}) as (pg: number, kind: "probe" | "page", ord: "asc" | "desc" | null, tot: number | null) => void, show: (() => {}) as (r: Rec[], o: "asc" | "desc") => void });

  useEffect(() => {
    try {
      vscode.setState({ resource: resource ?? undefined, limit, columns, live } satisfies Saved);
    } catch {}
  }, [resource, limit, columns, live]);

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
      } else if (m.type === "search") {
        // opened again from a workflow's Logs tab
        setQuery(typeof p.text === "string" ? p.text : "");
      } else if (m.type === "fields") {
        setFields(p.fields ?? []);
      } else if (m.type === "page") {
        const cur = pending.current;
        if (!cur || cur.id !== p.reqId) return;
        pending.current = null;
        const recs: Rec[] = p.records ?? [];
        const tot: number | null = typeof p.total === "number" ? p.total : null;
        setTotal(tot);
        if (cur.kind === "probe") {
          // learn the order from the first page; oldest-first lists are read from the end
          const sh = shape(recs, []);
          const asc = ascending(recs, sh.dateKey);
          const ord = asc === true ? "asc" : "desc";
          setOrder(ord);
          const last = tot !== null ? Math.max(1, Math.ceil(tot / live$.current.limit)) : 1;
          if ((ord === "asc" && (last > 1 || cur.page > 1)) || (ord === "desc" && cur.page > 1)) {
            live$.current.request(cur.page, "page", ord, tot);
            return;
          }
          live$.current.show(recs, ord);
          return;
        }
        live$.current.show(recs, live$.current.order ?? "desc");
      } else if (m.type === "error") {
        if (pending.current && p.reqId !== undefined && pending.current.id !== p.reqId) return;
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

  const keyOf = (r: Rec, i: number) => (r.id !== undefined ? String(r.id) : `${i}:${JSON.stringify(r).length}`);
  const show = (recs: Rec[], ord: "asc" | "desc") => {
    const list = ord === "asc" ? [...recs].reverse() : recs;
    // highlight rows that weren't there before (live mode)
    const ids = list.map(keyOf);
    const isNew = seen.current.size > 0 ? new Set(ids.filter((k) => !seen.current.has(k))) : new Set<string>();
    ids.forEach((k) => seen.current.add(k));
    setFresh(isNew);
    setRecords(list);
    setLoading(false);
    setError(null);
    setNow(Date.now());
  };

  /** Ask for logical page `pg` (1 = newest). */
  const request = useCallback(
    (pg: number, kind: "probe" | "page", ord: "asc" | "desc" | null, tot: number | null) => {
      if (!resource) return;
      const id = ++reqId.current;
      pending.current = { id, kind, page: pg };
      setLoading(true);
      if (kind === "page" && ord === "asc" && tot !== null) {
        // oldest-first list: newest page k is the slice that ends k-1 pages from the end
        const end = Math.max(0, tot - (pg - 1) * limit);
        send("fetchRange", { reqId: id, resource, start: Math.max(0, end - limit), end, limit, filter: applied });
        return;
      }
      send("fetch", { reqId: id, resource, page: kind === "probe" ? 1 : pg, limit, filter: applied });
    },
    [resource, limit, applied],
  );

  live$.current = { limit, order, request, show };

  const reload = useCallback(
    (pg = page) => {
      setOrder(null);
      request(pg, "probe", null, null);
    },
    [request, page],
  );

  // a new resource / page size / server filter: start again from the newest
  useEffect(() => {
    if (!resource) return;
    seen.current = new Set();
    setPage(1);
    setPicked(null);
    send("fields", { resource });
    request(1, "probe", null, null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resource, limit, applied]);

  const goto = (pg: number) => {
    setPage(pg);
    setPicked(null);
    if (order) request(pg, "page", order, total);
    else request(pg, "probe", null, null);
  };

  // live: re-read the newest page every 5 s
  useEffect(() => {
    if (!live || page !== 1 || !resource) return;
    const t = setInterval(() => {
      if (!pending.current) request(1, "probe", null, null);
    }, 5000);
    return () => clearInterval(t);
  }, [live, page, resource, request]);
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(t);
  }, []);

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
  const pages = total !== null ? Math.max(1, Math.ceil(total / limit)) : null;

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
            title="Re-read the newest page every 5 seconds"
            onClick={() => setLive((v) => !v)}
          >
            <span className={`lg-live-dot ${live ? "is-on" : ""}`} /> Live
          </button>
          <button type="button" className="lg-btn" onClick={() => reload(page)} disabled={!resource || loading} title="Refresh">
            {loading ? "Reading…" : "Refresh"}
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
              placeholder="Search this page…"
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
                placeholder="Server filter (Saturn filter language) — Enter to apply"
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
                          const s = str(v);
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
                        {records.length ? "Nothing on this page matches." : "No log records."}
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
                <dl className="lg-kv">
                  {Object.entries(picked).map(([k, v]) => (
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
              {total !== null ? `${total.toLocaleString()} record${total === 1 ? "" : "s"}` : `${records.length} shown`}
              {shown.length !== records.length ? ` · ${shown.length} match on this page` : ""}
              {" · newest first"}
            </span>
            <span className="lg-spacer" />
            <label className="lg-select is-small">
              <span>Per page</span>
              <select aria-label="Per page" value={limit} onChange={(e) => setLimit(Number(e.target.value))}>
                {[25, 50, 100].map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </label>
            <button type="button" className="lg-btn" disabled={page <= 1 || loading} onClick={() => goto(page - 1)}>‹ Newer</button>
            <span className="lg-page">Page {page}{pages ? ` of ${pages}` : ""}</span>
            <button type="button" className="lg-btn" disabled={(pages !== null && page >= pages) || (pages === null && records.length < limit) || loading} onClick={() => goto(page + 1)}>Older ›</button>
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
