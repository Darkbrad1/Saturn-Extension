// Write store values (0.3.72): several store keys written in one step. Saturn has no such operator, so it's stored as
// what Saturn knows: a Parallel with one Write Store step (`write_store`, {key, value}) per row. When a workflow is
// drawn, every Parallel holding only Write Store steps is shown as one "Write store values" card at the Parallel's
// own place (so picking, moving, copying, disabling and deleting work as for any step), unless it was asked to show
// its steps (Show as separate steps, kept per Parallel id). Its rows are edited here and saved with setStoreWrites.
import { useEffect, useRef, useState } from "react";
import { send } from "./bridge";
import { HighlightInput } from "./controls";
import type { Flow, OperatorFlow, ParallelFlow, Path } from "./types";

export const STORE_WRITES = "write_store_values";
export const STORE_WRITES_LABEL = "Write store values";
export interface StoreRow {
  key: string;
  value: string;
}

const paramOf = (f: Flow, key: string) => (f.kind === "operator" ? f.params.find((p) => p.key === key) : undefined);
/** A Parallel whose steps are all Write Store steps (at least one). */
export function isStoreWrites(f: Flow): f is ParallelFlow {
  return f.kind === "parallel" && f.children.length > 0 && f.children.every((c) => c.kind === "operator" && c.operator === "write_store");
}

/** The flow with each such Parallel drawn as one Write store values step (the ones in `apart` left as they are). */
export function combineStoreWrites(f: Flow, apart: ReadonlySet<string>): Flow {
  const all = (list: Flow[]) => list.map((c) => combineStoreWrites(c, apart));
  switch (f.kind) {
    case "parallel":
      if (isStoreWrites(f) && !(f.stepId && apart.has(f.stepId))) {
        const card: OperatorFlow = {
          kind: "operator",
          label: STORE_WRITES_LABEL,
          operator: STORE_WRITES,
          delay: null,
          params: f.children.map((c) => {
            const key = paramOf(c, "key")?.value ?? "";
            const value = paramOf(c, "value");
            return { key, label: key, type: null, value: value?.value ?? "", truncated: value?.truncated };
          }),
          stepId: f.stepId,
          path: f.path,
          mock: f.mock,
          storeWrites: { parallel: f, stepPaths: f.children.map((c) => c.path) },
        };
        return card;
      }
      return { ...f, children: all(f.children) };
    case "series":
    case "each":
      return { ...f, children: all(f.children) };
    case "if":
      return { ...f, whenTrue: all(f.whenTrue), whenFalse: all(f.whenFalse) };
    case "switch":
      return { ...f, cases: f.cases.map((c) => ({ ...c, steps: all(c.steps) })), otherwise: all(f.otherwise) };
    default:
      return f;
  }
}

/** Saturn's Debug-style message for a row list that can't be sent (or null when it's fine). */
export function rowsProblem(rows: StoreRow[]): string | null {
  if (!rows.length) return "Add at least one key.";
  const seen = new Set<string>();
  for (const r of rows) {
    const k = r.key.trim();
    if (!k) return "Every value needs a key.";
    if (seen.has(k)) return `"${k}" is written twice: give each value its own key.`;
    seen.add(k);
  }
  return null;
}

let reqCount = 0;
/** The steps' full values (a card's may be shortened), read from the host, again whenever the step changes; the last
 *  ones read stay meanwhile, so the rows being edited never disappear. */
function useFullRows(workflowId: string, paths: Path[], shown: StoreRow[]) {
  const [rows, setRows] = useState<StoreRow[] | null>(null);
  const key = JSON.stringify([paths, shown]);
  useEffect(() => {
    const id = `sw${++reqCount}`;
    const on = (e: MessageEvent) => {
      const m = e.data;
      if (m?.type !== "nodesParams" || m.payload?.reqId !== id) return;
      const list = m.payload.list as { values: Record<string, string> }[] | null;
      setRows(list ? list.map((l) => ({ key: l.values?.key ?? "", value: l.values?.value ?? "" })) : shown);
    };
    window.addEventListener("message", on);
    send("readNodes", { workflowId, paths, reqId: id });
    return () => window.removeEventListener("message", on);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workflowId, key]);
  return rows;
}

/** The side panel's rows for a Write store values step: a key and a value each, + Add a key, ×, ↑ / ↓. Applied
 *  (one edit) when a box is left or Enter is pressed. */
export function StoreWritesPanel(props: { workflowId: string; f: OperatorFlow; busy: boolean; onChange: (rows: StoreRow[]) => void }) {
  const sw = props.f.storeWrites!;
  const shown = props.f.params.map((p) => ({ key: p.key, value: p.value }));
  const full = useFullRows(props.workflowId, sw.stepPaths, shown);
  return full ? <StoreRows initial={full} busy={props.busy} onCommit={props.onChange} /> : <p className="fg-hint">Reading the values…</p>;
}

/** Rows to edit; `onCommit` gets them all whenever one is done with (never a list that would be refused). */
export function StoreRows(props: { initial: StoreRow[]; busy?: boolean; onCommit: (rows: StoreRow[]) => void; live?: (rows: StoreRow[]) => void; autoFocus?: boolean }) {
  const [rows, setRows] = useState<StoreRow[]>(props.initial.length ? props.initial : [{ key: "", value: "" }]);
  const [focus, setFocus] = useState<number | null>(props.autoFocus ? 0 : null);
  const last = useRef(JSON.stringify(props.initial));
  const box = useRef<HTMLDivElement>(null);
  const problem = rowsProblem(rows);
  useEffect(() => props.live?.(rows), [rows]); // eslint-disable-line react-hooks/exhaustive-deps
  // the step changed from outside (Undo, another screen): show it as it is now; after our own change it's what we sent
  const incoming = JSON.stringify(props.initial);
  useEffect(() => {
    if (incoming === last.current) return;
    last.current = incoming;
    setRows(props.initial.length ? props.initial : [{ key: "", value: "" }]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [incoming]);
  useEffect(() => {
    if (focus === null) return;
    box.current?.querySelectorAll<HTMLElement>(".nv-sw-key input")[focus]?.focus();
    setFocus(null);
  }, [focus]);
  const commit = (next = rows) => {
    if (rowsProblem(next)) return;
    const clean = next.map((r) => ({ key: r.key.trim(), value: r.value }));
    const text = JSON.stringify(clean);
    if (text === last.current) return;
    last.current = text;
    props.onCommit(clean);
  };
  const set = (i: number, change: Partial<StoreRow>) => setRows((cur) => cur.map((r, j) => (j === i ? { ...r, ...change } : r)));
  const keys = (e: React.KeyboardEvent) => {
    e.stopPropagation();
    if (e.key === "Enter") {
      e.preventDefault();
      commit();
    }
  };
  const move = (i: number, by: number) => {
    const next = [...rows];
    const [r] = next.splice(i, 1);
    next.splice(i + by, 0, r);
    setRows(next);
    commit(next);
  };
  return (
    <div className="nv-sw" ref={box}>
      <div className="nv-sw-head">
        <span>Key</span>
        <span>Value</span>
      </div>
      {rows.map((r, i) => {
        const dup = r.key.trim() && rows.findIndex((x) => x.key.trim() === r.key.trim()) !== i;
        return (
          <div key={i} className={`nv-sw-row ${dup ? "is-dup" : ""}`} data-row={i}>
            <span className="nv-sw-key">
              <HighlightInput value={r.key} placeholder="key" onChange={(v) => set(i, { key: v })} onBlur={() => commit()} onKeyDown={keys} />
            </span>
            <span className="nv-sw-value">
              <HighlightInput value={r.value} placeholder="value or {{ template }}" onChange={(v) => set(i, { value: v })} onBlur={() => commit()} onKeyDown={keys} />
            </span>
            <span className="nv-sw-tools">
              <button type="button" className="nv-prop-tool" title="Move up" aria-label={`Move ${r.key || "this row"} up`} disabled={i === 0} onClick={() => move(i, -1)}>
                ↑
              </button>
              <button type="button" className="nv-prop-tool" title="Move down" aria-label={`Move ${r.key || "this row"} down`} disabled={i === rows.length - 1} onClick={() => move(i, 1)}>
                ↓
              </button>
              <button
                type="button"
                className="nv-prop-tool"
                title="Take this key out"
                aria-label={`Remove ${r.key || "this row"}`}
                disabled={rows.length === 1}
                onClick={() => {
                  const next = rows.filter((_, j) => j !== i);
                  setRows(next);
                  commit(next);
                }}
              >
                ×
              </button>
            </span>
          </div>
        );
      })}
      <div className="nv-sw-foot">
        <button
          type="button"
          className="nv-mini-btn"
          onClick={() => {
            setRows((cur) => [...cur, { key: "", value: "" }]);
            setFocus(rows.length);
          }}
        >
          + Add a key
        </button>
        {problem && rows.some((r) => r.key.trim() || r.value.trim()) && <span className="nv-sw-problem">{problem}</span>}
        {props.busy && <span className="fg-saving">Saving…</span>}
      </div>
    </div>
  );
}
