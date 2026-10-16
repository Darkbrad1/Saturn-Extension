// The side panel's Logs tab: the System Logs records about the open workflow
// (or just the open action, or the selected step). Read-only; the host reads
// the newest records in windows and this tab picks out the ones that match.
import { useEffect, useMemo, useRef, useState } from "react";
import { send } from "./bridge";
import { highlight } from "./controls";
import type { Tree } from "./panel";
import type { Catalog, Flow, WorkflowView } from "./types";
import {
  ACTION_KEYS,
  STEP_KEYS,
  WORKFLOW_KEYS,
  abs,
  dateOf,
  levelClass,
  mentions,
  rel,
  shape,
  str,
  target,
  type LogTarget,
  type Rec,
} from "../src-logs/records";

const WINDOW = 200; // records per request
const ENOUGH = 25; // stop searching older records once this many match
const PER_SEARCH = 1000; // …or after this many more records
const LIVE_MS = 10000;

type Scope = "workflow" | "action" | "step";

interface Reply {
  reqId: number;
  workflowId: string;
  resource: string | null;
  instanceName: string;
  records: Rec[];
  total: number | null;
  scanned: number;
  done: boolean;
}

const keyOf = (r: Rec) => (r.id !== undefined && r.id !== null ? `id:${String(r.id)}` : JSON.stringify(r));

/** The action or command a tree stands for, as log records would name it. */
function treeTarget(wf: WorkflowView, tree: Tree): LogTarget {
  if (tree.kind === "command") {
    const c = wf.commands.find((x) => x.id === tree.commandId);
    return target([c?.id], [c?.name, c?.label]);
  }
  const id = tree.key.split(":").pop();
  const a = [...wf.stages.flatMap((s) => s.actions), ...wf.actions].find((x) => x.id === id);
  return target([a?.id], [a?.action, a?.label]);
}

/** Every action and command of the workflow, to say which one a record is about. */
function treesOfWf(wf: WorkflowView) {
  return [
    ...wf.stages.flatMap((s) => s.actions.map((a) => ({ key: `s:${s.stage}:${a.id}`, label: a.label, t: target([a.id], [a.action, a.label]) }))),
    ...wf.actions.map((a) => ({ key: `g:${a.id}`, label: a.label, t: target([a.id], [a.action, a.label]) })),
    ...wf.commands.map((c) => ({ key: `c:${c.id}`, label: c.label, t: target([c.id], [c.name, c.label]) })),
  ];
}

export function LogsTab(props: { wf: WorkflowView; tree: Tree | undefined; flow: Flow | undefined; catalog: Catalog; onOpenTree: (key: string) => void }) {
  const { wf, tree, flow, catalog } = props;
  const [records, setRecords] = useState<Rec[]>([]);
  const [meta, setMeta] = useState<{ resource: string | null; instanceName: string; total: number | null; scanned: number; done: boolean } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scope, setScope] = useState<Scope>("workflow");
  const [levels, setLevels] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [live, setLive] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const [fresh, setFresh] = useState<Set<string>>(new Set());
  const [now, setNow] = useState(Date.now());
  const reqId = useRef(0);
  // what the request in flight is for
  const pending = useRef<{ id: number; kind: "search" | "live"; budget: number } | null>(null);
  const seen = useRef<Set<string>>(new Set());
  const found = useRef(0); // records.length, readable from the message handler

  const wfTarget = useMemo(() => target([wf.id], [wf.name]), [wf.id, wf.name]);
  const actionTarget = useMemo(() => (tree ? treeTarget(wf, tree) : null), [wf, tree]);
  const stepTarget = useMemo(
    () => (flow && flow.kind === "operator" && flow.operator ? target([], [flow.operator, flow.label, catalog[flow.operator]?.name]) : null),
    [flow, catalog],
  );
  const isWf = (r: Rec) => mentions(r, WORKFLOW_KEYS, wfTarget);
  const latest = useRef({ isWf });
  latest.current = { isWf };

  const request = (kind: "search" | "live", offset: number, budget: number) => {
    const id = ++reqId.current;
    pending.current = { id, kind, budget };
    setLoading(true);
    send("fetchWorkflowLogs", { reqId: id, workflowId: wf.id, offset, window: WINDOW });
  };

  // a different workflow: start again from the newest record
  useEffect(() => {
    setRecords([]);
    setMeta(null);
    setError(null);
    setOpen(null);
    setFresh(new Set());
    seen.current = new Set();
    found.current = 0;
    request("search", 0, PER_SEARCH);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wf.id]);

  useEffect(() => {
    if (scope === "action" && !actionTarget) setScope("workflow");
    if (scope === "step" && !stepTarget) setScope(actionTarget ? "action" : "workflow");
  }, [scope, actionTarget, stepTarget]);

  useEffect(() => {
    const on = (ev: MessageEvent) => {
      const m = ev.data;
      if (!m || typeof m !== "object") return;
      const p = m.payload ?? {};
      const cur = pending.current;
      if (m.type === "workflowLogsFailed") {
        if (!cur || p.reqId !== cur.id) return;
        pending.current = null;
        setLoading(false);
        setError(p.message ?? "Could not read the logs.");
        return;
      }
      if (m.type !== "workflowLogs") return;
      const r = p as Reply;
      if (!cur || r.reqId !== cur.id) return;
      pending.current = null;
      const got = (r.records ?? []).filter((x) => x && typeof x === "object" && latest.current.isWf(x));
      const added = got.filter((x) => !seen.current.has(keyOf(x)));
      added.forEach((x) => seen.current.add(keyOf(x)));
      found.current += added.length;
      setError(null);
      setNow(Date.now());
      if (cur.kind === "live") {
        // newest window again: put what's new on top and flash it
        setFresh(new Set(added.map(keyOf)));
        if (added.length) setRecords((rs) => [...added, ...rs]);
        setMeta((mt) => (mt ? { ...mt, total: r.total, resource: r.resource, instanceName: r.instanceName } : { ...r }));
        setLoading(false);
        return;
      }
      setRecords((rs) => [...rs, ...added]);
      const budget = cur.budget - (r.records?.length ?? 0);
      // keep going back in time until enough match or this search's budget is spent
      if (!r.done && found.current < ENOUGH && budget > 0) request("search", r.scanned, budget);
      else setLoading(false);
      setMeta({ resource: r.resource, instanceName: r.instanceName, total: r.total, scanned: r.scanned, done: r.done });
    };
    window.addEventListener("message", on);
    return () => window.removeEventListener("message", on);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wf.id]);

  // live: re-read the newest records every 10 s
  useEffect(() => {
    if (!live) return;
    const t = setInterval(() => {
      if (!pending.current) request("live", 0, 0);
    }, LIVE_MS);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [live, wf.id]);
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(t);
  }, []);

  const sh = useMemo(() => shape(records, []), [records]);
  const inScope = useMemo(
    () =>
      records.filter((r) => {
        if (scope === "workflow") return true;
        if (!actionTarget || !mentions(r, ACTION_KEYS, actionTarget)) return false;
        return scope === "action" || (!!stepTarget && mentions(r, STEP_KEYS, stepTarget));
      }),
    [records, scope, actionTarget, stepTarget],
  );
  const levelValues = useMemo(
    () => (sh.levelKey ? [...new Set(inScope.map((r) => str(r[sh.levelKey!])).filter(Boolean))].sort() : []),
    [inScope, sh.levelKey],
  );
  const q = query.trim().toLowerCase();
  const shown = inScope.filter(
    (r) => (!levels.length || (!!sh.levelKey && levels.includes(str(r[sh.levelKey])))) && (!q || JSON.stringify(r).toLowerCase().includes(q)),
  );
  const trees = useMemo(() => treesOfWf(wf), [wf]);

  const searchOlder = () => request("search", meta?.scanned ?? 0, PER_SEARCH);
  const refresh = () => {
    setRecords([]);
    setOpen(null);
    seen.current = new Set();
    found.current = 0;
    request("search", 0, PER_SEARCH);
  };

  const scopes: { id: Scope; label: string; title: string }[] = [
    { id: "workflow", label: "Workflow", title: `Every log about ${wf.name}` },
    ...(actionTarget && tree ? [{ id: "action" as const, label: tree.kind === "command" ? "This command" : "This action", title: `Only logs about ${tree.label}` }] : []),
    ...(stepTarget && flow ? [{ id: "step" as const, label: "This step", title: `Only logs from ${flow.label || "the selected step"} in ${tree?.label ?? "this action"}` }] : []),
  ];

  return (
    <div className="lgt">
      <div className="lgt-head">
        <div className="lgt-title">
          <b>System Logs</b>
          <span className="lgt-sub">{meta ? `${meta.instanceName}${meta.resource ? ` · ${meta.resource}` : ""}` : "Reading…"}</span>
        </div>
        <button type="button" className={`fg-btn lgt-live ${live ? "is-on" : ""}`} aria-pressed={live} title="Check for new logs every 10 s" onClick={() => setLive((l) => !l)}>
          <span className={`lgt-dot ${live ? "is-on" : ""}`} /> Live
        </button>
        <button type="button" className="fg-btn" title="Read the newest logs again" onClick={refresh} disabled={loading}>
          Refresh
        </button>
      </div>

      {scopes.length > 1 && (
        <div className="lgt-scopes" role="radiogroup" aria-label="Show logs for">
          {scopes.map((s) => (
            <button key={s.id} type="button" role="radio" aria-checked={scope === s.id} className={`lgt-chip ${scope === s.id ? "is-on" : ""}`} title={s.title} onClick={() => setScope(s.id)}>
              {s.label}
            </button>
          ))}
        </div>
      )}
      <div className="lgt-filters">
        <input className="fg-input" placeholder="Search these logs" aria-label="Search logs" value={query} onChange={(e) => setQuery(e.target.value)} />
        {levelValues.length > 1 && (
          <div className="lgt-levels">
            {levelValues.map((v) => (
              <button
                key={v}
                type="button"
                className={`lgt-chip ${levelClass(v)} ${levels.includes(v) ? "is-on" : ""}`}
                aria-pressed={levels.includes(v)}
                onClick={() => setLevels((l) => (l.includes(v) ? l.filter((x) => x !== v) : [...l, v]))}
              >
                {v}
              </button>
            ))}
          </div>
        )}
      </div>

      {error && <p className="fg-hint is-warn lgt-error">{error}</p>}
      {meta && !meta.resource && (
        <p className="fg-hint">
          This instance has no System Logs resource. Pick one in the System Logs screen or set <code>saturn.systemLogResource</code>.
        </p>
      )}

      <ol className="lgt-list">
        {shown.map((r) => {
          const k = keyOf(r);
          const t = sh.dateKey ? dateOf(r[sh.dateKey]) : null;
          const lv = sh.levelKey ? str(r[sh.levelKey]) : "";
          const msg = sh.messageKey ? str(r[sh.messageKey]) : JSON.stringify(r);
          const about = scope === "workflow" ? trees.find((x) => mentions(r, ACTION_KEYS, x.t)) : undefined;
          const isOpen = open === k;
          return (
            <li key={k} className={`lgt-row ${isOpen ? "is-open" : ""} ${fresh.has(k) ? "is-fresh" : ""}`}>
              <button type="button" className="lgt-row-main" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : k)}>
                <span className="lgt-meta">
                  {lv && <span className={`lgt-level ${levelClass(lv)}`}>{lv}</span>}
                  {t !== null && (
                    <span className="lgt-time" title={abs(t)}>
                      {rel(t, now)}
                    </span>
                  )}
                  {about && <span className="lgt-about">{about.label}</span>}
                </span>
                <span className="lgt-msg">{msg}</span>
              </button>
              {isOpen && (
                <div className="lgt-detail">
                  <div className="fg-btn-row is-wrap">
                    <button type="button" className="fg-btn" onClick={() => send("copyLogJson", { record: r })}>
                      Copy JSON
                    </button>
                    <button type="button" className="fg-btn" onClick={() => send("openLogJson", { record: r })}>
                      Open as JSON
                    </button>
                    {about && tree?.key !== about.key && (
                      <button type="button" className="fg-btn" onClick={() => props.onOpenTree(about.key)}>
                        Go to {about.label}
                      </button>
                    )}
                  </div>
                  <pre className="lgt-json" dangerouslySetInnerHTML={{ __html: highlight(JSON.stringify(r, null, 2), "json") }} />
                </div>
              )}
            </li>
          );
        })}
      </ol>

      {!loading && meta && meta.resource && shown.length === 0 && (
        <p className="fg-hint lgt-none">
          {records.length === 0
            ? `No logs about ${wf.name} in the ${meta.scanned.toLocaleString()} newest records.`
            : inScope.length === 0
              ? `None of ${wf.name}'s ${records.length} logs are about ${scope === "step" ? "this step" : tree?.label ?? "this action"}.`
              : "No logs match the search or levels."}
        </p>
      )}

      <div className="lgt-foot">
        <span>
          {loading
            ? "Reading logs…"
            : meta && meta.resource
              ? `${records.length} found in ${meta.scanned.toLocaleString()}${meta.total !== null ? ` of ${meta.total.toLocaleString()}` : ""} records`
              : ""}
        </span>
        {meta && meta.resource && !meta.done && !loading && (
          <button type="button" className="fg-link" onClick={searchOlder}>
            Search older
          </button>
        )}
      </div>
      <button type="button" className="fg-link lgt-open" onClick={() => send("openSystemLogs", { search: wf.name })}>
        Open in System Logs ↗
      </button>
      <p className="fg-hint">Read-only. Logs are matched to this workflow by its id or name in the record.</p>
    </div>
  );
}
