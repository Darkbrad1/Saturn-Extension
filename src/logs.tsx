// The side panel's Logs tab: the System Logs records about the open workflow
// (or just the open action, or the selected step). Read-only.
//
// A SystemLog record carries its workflow (`workflow.id` / `.name`) and the
// step that wrote it (`task`, with the step's id). The host only ever reads
// the newest 10 records. The tab asks for the newest 10 with
// `workflow.id = "<id>"` (Saturn's filter language); if the instance refuses
// that or finds nothing, it reads the newest 10 of all and keeps this
// workflow's.
import { useEffect, useMemo, useRef, useState } from "react";
import { send } from "./bridge";
import { highlight } from "./controls";
import { titleOf, type Tree } from "./panel";
import type { Catalog, Flow, WorkflowView } from "./types";
import { switchSteps } from "./types";
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
import { CopyButton, MessageView, summarize } from "../src-logs/message";

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
  /** false: the instance doesn't return logs in date order, so these may not be the newest */
  ordered?: boolean;
}

const jsonHtml = (v: unknown) => highlight(JSON.stringify(v, null, 2) ?? "", "json");
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
  else if (f.kind === "switch") switchSteps(f).forEach((c) => walk(c, visit));
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
  const [meta, setMeta] = useState<{ resource: string | null; instanceName: string; total: number | null; ordered: boolean } | null>(null);
  const [checked, setChecked] = useState<number | null>(null);
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
  const pending = useRef<{ id: number; kind: "probe" | "read" | "live" } | null>(null);
  const seen = useRef<Set<string>>(new Set());
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

  /** Read the newest 10 (the host never reads more): this workflow's, or of all in scan mode. */
  const request = (kind: "probe" | "read" | "live") => {
    const id = ++reqId.current;
    pending.current = { id, kind };
    setLoading(true);
    const filter = kind === "probe" || mode$.current === "server" ? workflowFilter(wf.id) : undefined;
    send("fetchWorkflowLogs", { reqId: id, workflowId: wf.id, filter });
  };
  const restart = () => {
    setRecords([]);
    setOpen(null);
    setFresh(new Set());
    seen.current = new Set();
  };
  const scan = () => {
    mode$.current = "scan";
    setMode("scan");
    request("read");
  };

  // a different workflow: start again from the newest record, trying the server filter first
  useEffect(() => {
    restart();
    setMeta(null);
    setError(null);
    mode$.current = null;
    setMode(null);
    request("probe");
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
      // the newest 10 as they are now; flash the ones that weren't there at the last check
      const arrived = cur.kind === "live" ? got.filter((x) => !seen.current.has(keyOf(x))) : [];
      got.forEach((x) => seen.current.add(keyOf(x)));
      setFresh(new Set(arrived.map(keyOf)));
      setRecords(got);
      setError(null);
      setNow(Date.now());
      setChecked(Date.now());
      setLoading(false);
      setMeta({ resource: r.resource, instanceName: r.instanceName, total: r.total, ordered: r.ordered !== false });
    };
    window.addEventListener("message", on);
    return () => window.removeEventListener("message", on);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wf.id]);

  // live: check for new logs every 10 s, and straight away when it's turned on
  useEffect(() => {
    if (!live) return;
    if (!pending.current && mode$.current) request("live");
    const t = setInterval(() => {
      if (!pending.current && mode$.current) request("live");
    }, LIVE_MS);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [live, wf.id]);
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), live ? 1000 : 30000);
    return () => clearInterval(t);
  }, [live]);

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

  // start over, trying the server filter again (the instance may take it now)
  const refresh = () => {
    restart();
    mode$.current = null;
    request("probe");
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
          <span className="lgt-sub">
            {meta ? `${meta.instanceName}${meta.resource ? ` · ${meta.resource}` : ""}` : "Reading…"}
            {live && checked !== null && ` · checked ${Math.max(0, Math.round((now - checked) / 1000))} s ago`}
          </span>
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
                <span className="lgt-msg">{summarize(msg)}</span>
              </button>
              {isOpen && (
                <div className="lgt-detail">
                  <div className="fg-btn-row is-wrap">
                    <CopyButton className="fg-btn" onCopy={() => send("copyLogJson", { record: r })}>
                      Copy JSON
                    </CopyButton>
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
                  <MessageView text={msg} json={jsonHtml} onCopy={(v) => send("copyLogJson", { record: v })} onOpen={(v) => send("openLogJson", { record: v })} />
                  <details className="lgt-whole">
                    <summary>Whole record</summary>
                    <pre className="lgt-json" dangerouslySetInnerHTML={{ __html: jsonHtml(r) }} />
                  </details>
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
              : `None of the 10 newest logs on the instance are about ${wf.name}.`
            : inScope.length === 0
              ? `None of ${wf.name}'s ${records.length} newest logs are from ${scope === "step" ? "this step" : tree?.label ?? "this action"}.`
              : "No logs match the search or levels."}
        </p>
      )}

      <div className="lgt-foot">
        <span>
          {loading
            ? "Reading logs…"
            : meta && meta.resource
              ? mode === "server"
                ? `The newest ${records.length}${meta.total !== null ? ` of ${meta.total.toLocaleString()}` : ""} logs`
                : `${records.length} of the newest 10 logs on the instance`
              : ""}
        </span>
      </div>
      <button
        type="button"
        className="fg-link lgt-open"
        onClick={() => send("openSystemLogs", mode === "server" ? { filter: workflowFilter(wf.id) } : { search: wf.name })}
      >
        Open in System Logs ↗
      </button>
      {meta && meta.resource && !meta.ordered && (
        <p className="fg-hint is-warn">This instance doesn't return logs in date order, so these may not be the newest.</p>
      )}
      <p className="fg-hint">
        Read-only. Only the newest 10 logs are read.{" "}
        {mode === "server" ? "The instance picks this workflow's logs (by its id)." : "Logs are matched to this workflow by its id or name in the record."}
      </p>
    </div>
  );
}
