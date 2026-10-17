// The side panel's Logs tab: the System Logs records about the open workflow
// (or just the open action, or the selected step). Read-only.
//
// A SystemLog record carries its workflow (`workflow.id` / `.name`) and the
// step that wrote it (`task`, with the step's id). The tab first asks the
// instance for `workflow.id = "<id>"` (Saturn's filter language); if the
// instance refuses that or finds nothing, it reads the newest records in
// windows and picks out the ones about the workflow itself.
import { useEffect, useMemo, useRef, useState } from "react";
import { send } from "./bridge";
import { highlight } from "./controls";
import { titleOf, type Tree } from "./panel";
import type { Catalog, Flow, WorkflowView } from "./types";
import {
  ACTION_KEYS,
  STEP_KEYS,
  WORKFLOW_COPY,
  WORKFLOW_KEYS,
  abs,
  dateOf,
  levelClass,
  mentions,
  rel,
  shape,
  str,
  target,
  taskOf,
  type LogTarget,
  type Rec,
} from "../src-logs/records";

const WINDOW = 200; // records per request
const ENOUGH = 25; // stop searching older records once this many match
const PER_SEARCH = 1000; // …or after this many more records
const LIVE_MS = 10000;

type Scope = "workflow" | "action" | "step";
/** server: the instance filters by workflow.id; scan: read everything and match here */
type Mode = "server" | "scan";

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
export const workflowFilter = (id: string) => `workflow.id = ${JSON.stringify(id)}`;

/** The action or command a tree stands for, as log records would name it (for records without a task id). */
function treeTarget(wf: WorkflowView, tree: Tree): LogTarget {
  if (tree.kind === "command") {
    const c = wf.commands.find((x) => x.id === tree.commandId);
    return target([c?.id], [c?.name, c?.label]);
  }
  const id = tree.key.split(":").pop();
  const a = [...wf.stages.flatMap((s) => s.actions), ...wf.actions].find((x) => x.id === id);
  return target([a?.id], [a?.action, a?.label]);
}

interface TreeInfo {
  key: string;
  label: string;
  flow: Flow | null;
  t: LogTarget;
}
/** Every action and command of the workflow. */
function treesOfWf(wf: WorkflowView): TreeInfo[] {
  return [
    ...wf.stages.flatMap((s) => s.actions.map((a) => ({ key: `s:${s.stage}:${a.id}`, label: a.label, flow: a.flow, t: target([a.id], [a.action, a.label]) }))),
    ...wf.actions.map((a) => ({ key: `g:${a.id}`, label: a.label, flow: a.flow, t: target([a.id], [a.action, a.label]) })),
    ...wf.commands.map((c) => ({ key: `c:${c.id}`, label: c.label, flow: c.flow, t: target([c.id], [c.name, c.label]) })),
  ];
}

function walk(f: Flow | null, visit: (f: Flow) => void) {
  if (!f) return;
  visit(f);
  if (f.kind === "if") [...f.whenTrue, ...f.whenFalse].forEach((c) => walk(c, visit));
  else if (f.kind === "series" || f.kind === "parallel" || f.kind === "each") f.children.forEach((c) => walk(c, visit));
}

/** Step id -> where that step is: which action/command, and its title. */
function stepIndex(trees: TreeInfo[], catalog: Catalog) {
  const at = new Map<string, { tree: TreeInfo; title: string }>();
  for (const t of trees) walk(t.flow, (f) => f.kind === "operator" && f.stepId && !at.has(f.stepId) && at.set(f.stepId, { tree: t, title: titleOf(f, catalog) }));
  return at;
}

/** The ids of every step an action runs, including the steps of the commands it calls. */
function stepsRunBy(tree: TreeInfo, trees: TreeInfo[]) {
  const ids = new Set<string>();
  const seen = new Set<string>();
  const visit = (t: TreeInfo) => {
    if (seen.has(t.key)) return;
    seen.add(t.key);
    walk(t.flow, (f) => {
      if (f.kind === "operator" && f.stepId) ids.add(f.stepId);
      if (f.kind === "reference" && f.targetId) {
        const c = trees.find((x) => x.key === `c:${f.targetId}`);
        if (c) visit(c);
      }
    });
  };
  visit(tree);
  return ids;
}

export function LogsTab(props: { wf: WorkflowView; tree: Tree | undefined; flow: Flow | undefined; catalog: Catalog; onOpenTree: (key: string) => void }) {
  const { wf, tree, flow, catalog } = props;
  const [records, setRecords] = useState<Rec[]>([]);
  const [meta, setMeta] = useState<{ resource: string | null; instanceName: string; total: number | null; scanned: number; done: boolean } | null>(null);
  const [mode, setMode] = useState<Mode | null>(null);
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
  // what the request in flight is for (probe = the first, filtered try)
  const pending = useRef<{ id: number; kind: "probe" | "search" | "live"; budget: number } | null>(null);
  const seen = useRef<Set<string>>(new Set());
  const found = useRef(0); // records.length, readable from the message handler
  const mode$ = useRef<Mode | null>(null);

  const trees = useMemo(() => treesOfWf(wf), [wf]);
  const steps = useMemo(() => stepIndex(trees, catalog), [trees, catalog]);
  const wfTarget = useMemo(() => target([wf.id], [wf.name]), [wf.id, wf.name]);
  const treeNow = tree ? trees.find((t) => t.key === tree.key) : undefined;
  const actionTarget = useMemo(() => (tree ? treeTarget(wf, tree) : null), [wf, tree]);
  const actionSteps = useMemo(() => (treeNow ? stepsRunBy(treeNow, trees) : null), [treeNow, trees]);
  const stepId = flow && flow.kind === "operator" ? flow.stepId ?? null : null;
  const stepTarget = useMemo(
    () => (flow && flow.kind === "operator" && flow.operator ? target([], [flow.operator, flow.label, catalog[flow.operator]?.name]) : null),
    [flow, catalog],
  );
  const isWf = (r: Rec) => mentions(r, WORKFLOW_KEYS, wfTarget);
  const latest = useRef({ isWf });
  latest.current = { isWf };

  const request = (kind: "probe" | "search" | "live", offset: number, budget: number) => {
    const id = ++reqId.current;
    pending.current = { id, kind, budget };
    setLoading(true);
    const filter = kind === "probe" || mode$.current === "server" ? workflowFilter(wf.id) : undefined;
    send("fetchWorkflowLogs", { reqId: id, workflowId: wf.id, offset, window: WINDOW, filter });
  };
  const restart = () => {
    setRecords([]);
    setOpen(null);
    setFresh(new Set());
    seen.current = new Set();
    found.current = 0;
  };
  const scan = () => {
    mode$.current = "scan";
    setMode("scan");
    request("search", 0, PER_SEARCH);
  };

  // a different workflow: start again from the newest record, trying the server filter first
  useEffect(() => {
    restart();
    setMeta(null);
    setError(null);
    mode$.current = null;
    setMode(null);
    request("probe", 0, PER_SEARCH);
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
        // the instance didn't take the filter: read and match here instead
        if (cur.kind === "probe") return scan();
        setLoading(false);
        setError(p.message ?? "Could not read the logs.");
        return;
      }
      if (m.type !== "workflowLogs") return;
      const r = p as Reply;
      if (!cur || r.reqId !== cur.id) return;
      pending.current = null;
      const got = (r.records ?? []).filter((x) => x && typeof x === "object" && latest.current.isWf(x));
      if (cur.kind === "probe") {
        // nothing back for the filter (or records that aren't this workflow's): it wasn't understood
        if (!r.resource) mode$.current = "scan";
        else if (got.length === 0) return scan();
        else mode$.current = "server";
        setMode(mode$.current);
      }
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
      if (!pending.current && mode$.current) request("live", 0, 0);
    }, LIVE_MS);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [live, wf.id]);
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(t);
  }, []);

  /** Which step (and action) wrote a record: by the step id in its task, else by names outside its workflow copy. */
  const where = (r: Rec) => {
    const id = taskOf(r)?.id;
    const s = id ? steps.get(id) : undefined;
    if (s) return { key: s.tree.key, label: `${s.tree.label} · ${s.title}`, treeLabel: s.tree.label, stepId: id! };
    const t = trees.find((x) => mentions(r, ACTION_KEYS, x.t, WORKFLOW_COPY));
    return t ? { key: t.key, label: t.label, treeLabel: t.label, stepId: id ?? null } : null;
  };
  const sh = useMemo(() => shape(records, []), [records]);
  const inScope = useMemo(
    () =>
      records.filter((r) => {
        if (scope === "workflow") return true;
        const id = taskOf(r)?.id;
        if (scope === "step" && stepId && id) return id === stepId;
        if (actionSteps && id && steps.has(id)) {
          if (!actionSteps.has(id)) return false;
          return scope === "action" || (!!stepTarget && !stepId && mentions(r, STEP_KEYS, stepTarget, WORKFLOW_COPY));
        }
        // no step id to go by: names, outside the record's copy of the workflow
        if (!actionTarget || !mentions(r, ACTION_KEYS, actionTarget, WORKFLOW_COPY)) return false;
        return scope === "action" || (!!stepTarget && mentions(r, STEP_KEYS, stepTarget, WORKFLOW_COPY));
      }),
    [records, scope, actionTarget, actionSteps, stepId, stepTarget, steps],
  );
  const levelValues = useMemo(
    () => (sh.levelKey ? [...new Set(inScope.map((r) => str(r[sh.levelKey!])).filter(Boolean))].sort() : []),
    [inScope, sh.levelKey],
  );
  const q = query.trim().toLowerCase();
  const shown = inScope.filter(
    (r) => (!levels.length || (!!sh.levelKey && levels.includes(str(r[sh.levelKey])))) && (!q || JSON.stringify(r).toLowerCase().includes(q)),
  );

  const searchOlder = () => request("search", meta?.scanned ?? 0, PER_SEARCH);
  const refresh = () => {
    restart();
    if (mode$.current === "scan") request("search", 0, PER_SEARCH);
    else {
      mode$.current = null;
      request("probe", 0, PER_SEARCH);
    }
  };

  const scopes: { id: Scope; label: string; title: string }[] = [
    { id: "workflow", label: "Workflow", title: `Every log about ${wf.name}` },
    ...(actionTarget && tree ? [{ id: "action" as const, label: tree.kind === "command" ? "This command" : "This action", title: `Only logs from the steps ${tree.label} runs` }] : []),
    ...(stepTarget && flow ? [{ id: "step" as const, label: "This step", title: `Only logs written by ${flow.label || "the selected step"}` }] : []),
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
          const w = where(r);
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
                  {w && (
                    <span className="lgt-about" title={w.label}>
                      {w.label}
                    </span>
                  )}
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
                    {w && tree?.key !== w.key && (
                      <button type="button" className="fg-btn" onClick={() => props.onOpenTree(w.key)}>
                        Go to {w.treeLabel}
                      </button>
                    )}
                  </div>
                  {typeof r.trace === "string" && r.trace.trim() && <pre className="lgt-json lgt-trace">{r.trace}</pre>}
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
            ? mode === "server"
              ? `No logs about ${wf.name}.`
              : `No logs about ${wf.name} in the ${meta.scanned.toLocaleString()} newest records.`
            : inScope.length === 0
              ? `None of ${wf.name}'s ${records.length} logs are from ${scope === "step" ? "this step" : tree?.label ?? "this action"}.`
              : "No logs match the search or levels."}
        </p>
      )}

      <div className="lgt-foot">
        <span>
          {loading
            ? "Reading logs…"
            : meta && meta.resource
              ? mode === "server"
                ? `${records.length}${meta.total !== null ? ` of ${meta.total.toLocaleString()}` : ""} logs`
                : `${records.length} found in ${meta.scanned.toLocaleString()}${meta.total !== null ? ` of ${meta.total.toLocaleString()}` : ""} records`
              : ""}
        </span>
        {meta && meta.resource && !meta.done && !loading && (
          <button type="button" className="fg-link" onClick={searchOlder}>
            {mode === "server" ? "Load older" : "Search older"}
          </button>
        )}
      </div>
      <button
        type="button"
        className="fg-link lgt-open"
        onClick={() => send("openSystemLogs", mode === "server" ? { filter: workflowFilter(wf.id) } : { search: wf.name })}
      >
        Open in System Logs ↗
      </button>
      <p className="fg-hint">
        Read-only.{" "}
        {mode === "server" ? "The instance picks this workflow's logs (by its id)." : "Logs are matched to this workflow by its id or name in the record."}
      </p>
    </div>
  );
}
