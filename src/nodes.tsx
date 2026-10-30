import {
  BaseEdge,
  EdgeLabelRenderer,
  Handle,
  Position,
  getBezierPath,
  useReactFlow,
  type EdgeProps,
  type NodeProps,
} from "@xyflow/react";
import { createContext, useContext } from "react";
import type { Flow } from "./types";
import { highlight, langFor, type HlLang } from "./controls";
import type { InsertPoint, LayoutDir, NvEdge, NvNode, NvRow, RowAction } from "./layout";

/** Which way the flow runs; decides where sockets sit. */
export const DirContext = createContext<LayoutDir>("h");
const useIO = () => {
  const v = useContext(DirContext) === "v";
  return { v, IN: v ? Position.Top : Position.Left, OUT: v ? Position.Bottom : Position.Right };
};

/** Lets a node's row buttons reach the app (open code / email preview). */
export const NodeActions = createContext<{
  open: (f: Flow, a: RowAction) => void;
  /** Open the Add menu for a specific insertion point (slots and wire + buttons). */
  add: (at: InsertPoint, x: number, y: number) => void;
  /** a card made wider or narrower by hand (0.3.69); `x`: where its left edge is now (0.3.73: either edge moves) */
  resized?: (id: string, width: number, x: number) => void;
} | null>(null);

export function NvNodeView({ id, data, selected }: NodeProps<NvNode>) {
  const actions = useContext(NodeActions);
  const { v, IN, OUT } = useIO();
  const cls = [
    "nv-node",
    `nv-role-${data.role}`,
    selected ? "is-selected" : "",
    data.invalid ? "is-invalid" : "",
    data.disabled ? "is-disabled" : "",
    id === "start" ? "is-owner" : "",
  ].join(" ");
  const row = (r: NvRow, i: number) => <Row key={i} r={r} flow={data.flow} />;
  return (
    <div className={cls}>
      {selected && data.role === "step" && actions?.resized && (
        // a picked card's edges can be dragged to make it wider or narrower; Shift moves both edges evenly (0.3.73)
        <>
          <ResizeEdge id={id} side="left" onDone={actions.resized} />
          <ResizeEdge id={id} side="right" onDone={actions.resized} />
        </>
      )}
      <div className="nv-node-header" style={{ background: data.color }}>
        <span className="nv-node-title" title={id === "start" ? `${data.title}: click for its settings` : data.title}>
          {data.title}
        </span>
        {data.disabled ? (
          <span className="nv-node-off" title="Disabled (mock: true) — skipped when the action runs">
            Disabled
          </span>
        ) : (
          data.subtitle && <span className="nv-node-sub">{data.subtitle}</span>
        )}
      </div>
      {data.disabled && data.role !== "head" && <div className="nv-bypass" />}
      {data.outputs === "branch" && data.branches && v ? (
        // a switch (0.3.64): one output per case, then Otherwise, spread along the bottom
        <div className="nv-node-body">
          {(data.rows ?? []).map(row)}
          <div className="nv-branch-foot is-cases">
            {data.branches.map((b) => (
              <span key={b.id} className={b.id === "otherwise" ? "is-otherwise" : ""} title={b.label}>{b.label}</span>
            ))}
          </div>
          {data.branches.map((b, i, all) => (
            <Handle key={b.id} type="source" id={b.id} position={Position.Bottom} className="nv-h nv-h-case nv-h-vb" style={{ left: `${((i + 0.5) / all.length) * 100}%` }} />
          ))}
        </div>
      ) : data.outputs === "branch" && data.branches ? (
        <div className="nv-node-body">
          {(data.rows ?? []).map(row)}
          {data.branches.map((b) => (
            <div key={b.id} className="nv-socket-row out" title={b.label}>
              {b.label}
              <Handle type="source" id={b.id} position={Position.Right} className="nv-h nv-h-case" />
            </div>
          ))}
        </div>
      ) : data.outputs === "branch" && v ? (
        <div className="nv-node-body">
          {(data.rows ?? []).map(row)}
          <div className="nv-branch-foot">
            <span className="is-true">True</span>
            <span className="is-false">False</span>
          </div>
          <Handle type="source" id="true" position={Position.Bottom} className="nv-h nv-h-true nv-h-vb" style={{ left: "25%" }} />
          <Handle type="source" id="false" position={Position.Bottom} className="nv-h nv-h-false nv-h-vb" style={{ left: "75%" }} />
        </div>
      ) : data.outputs === "branch" ? (
        <div className="nv-node-body">
          {(data.rows ?? []).map(row)}
          <div className="nv-socket-row out">
            True
            <Handle type="source" id="true" position={Position.Right} className="nv-h nv-h-true" />
          </div>
          <div className="nv-socket-row out">
            False
            <Handle type="source" id="false" position={Position.Right} className="nv-h nv-h-false" />
          </div>
        </div>
      ) : (
        (data.rows?.length || data.moreRows || data.role !== "terminal") && (
          <div className="nv-node-body">
            {(data.rows ?? []).map(row)}
            {data.moreRows ? (
              <div className="nv-row nv-more">+{data.moreRows} more…</div>
            ) : null}
            {!data.rows?.length && !data.moreRows && (
              <div className="nv-row nv-empty">no parameters</div>
            )}
          </div>
        )
      )}
      {data.inputs && (
        <Handle type="target" id="in" position={IN} className="nv-h nv-h-in" />
      )}
      {data.outputs === "flow" && (
        <Handle type="source" id="out" position={OUT} className="nv-h nv-h-out" />
      )}
    </div>
  );
}

/** How a card's value is coloured: code in its language, JSON as JSON, anything else for {{ templates }},
 *  numbers and true / false / null. */
const CARD_MIN = 180;
const CARD_MAX = 900;

/**
 * One edge of a picked card, dragged to change its width (0.3.73). The other edge stays put; with Shift held, both
 * edges move evenly and the card keeps its middle. The card follows the pointer while dragging; `onDone` keeps it.
 */
function ResizeEdge(props: { id: string; side: "left" | "right"; onDone: (id: string, width: number, x: number) => void }) {
  const rf = useReactFlow();
  const start = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    const n = rf.getInternalNode(props.id);
    if (!n) return;
    const w0 = n.measured?.width ?? n.width ?? CARD_MIN;
    const x0 = n.position.x;
    const y0 = n.position.y;
    const px0 = e.clientX;
    const style = n.style ?? {};
    let last = { w: w0, x: x0 };
    const el = e.currentTarget as HTMLElement;
    el.setPointerCapture(e.pointerId);
    document.body.classList.add("nv-sizing");
    const move = (ev: PointerEvent) => {
      const dx = (ev.clientX - px0) / rf.getViewport().zoom;
      const grow = props.side === "right" ? dx : -dx;
      const w = Math.min(CARD_MAX, Math.max(CARD_MIN, w0 + (ev.shiftKey ? 2 * grow : grow)));
      // how much of the change the left edge takes: none (right edge dragged), all (left edge), half (Shift)
      const share = ev.shiftKey ? 0.5 : props.side === "left" ? 1 : 0;
      const x = x0 - share * (w - w0);
      last = { w, x };
      rf.updateNode(props.id, { position: { x, y: y0 }, width: w, style: { ...style, width: w } });
    };
    const end = () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", end);
      el.removeEventListener("pointercancel", end);
      document.body.classList.remove("nv-sizing");
      if (last.w !== w0 || last.x !== x0) props.onDone(props.id, last.w, last.x);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", end);
    el.addEventListener("pointercancel", end);
  };
  return (
    <div
      className={`nv-resize-edge nodrag nopan is-${props.side}`}
      title="Drag to make the card wider or narrower. Hold Shift to change both sides evenly."
      onPointerDown={start}
      onClick={(e) => e.stopPropagation()}
      onDoubleClick={(e) => e.stopPropagation()}
    />
  );
}

function langOf(r: NvRow): HlLang {
  if (r.action?.kind === "code") return langFor(r.action.language);
  if (r.action?.kind === "email") return "plain";
  // a Read step's query or sort (0.3.73): `alias`.`field`, META(`alias`)
  if (/`[^`]+`\s*\.\s*`|\bMETA\s*\(\s*`/i.test(r.value)) return "n1ql";
  return /^\s*[[{]/.test(r.value) ? "json" : "tpl";
}

function Row({ r, flow }: { r: NvRow; flow?: Flow }) {
  const actions = useContext(NodeActions);
  if (r.more) return <div className="nv-row nv-more">+{r.more} more {r.more === 1 ? "property" : "properties"}…</div>;
  const short = (r.value.length > 60 ? r.value.slice(0, 60) + "…" : r.value).replace(/\s+/g, " ");
  const a = r.action;
  return (
    <div className={`nv-row ${r.entry ? "is-entry" : ""}`} title={`${r.key}: ${r.value}`}>
      <span className="nv-row-k">{r.key}</span>
      {short ? (
        <span className={`nv-row-v ${a ? "has-action" : ""}`} dangerouslySetInnerHTML={{ __html: highlight(short, langOf(r)) }} />
      ) : (
        <span className={`nv-row-v ${a ? "has-action" : ""}`}>{a?.kind === "code" ? "empty" : ""}</span>
      )}
      {a && flow && actions && (
        <button
          className={`nv-row-btn nodrag is-${a.kind}`}
          title={a.kind === "code" ? `Open ${a.label} in the editor` : `Open ${a.label} with its preview`}
          onClick={(e) => {
            e.stopPropagation();
            actions.open(flow, a);
          }}
          onDoubleClick={(e) => e.stopPropagation()}
        >
          {a.kind === "code" ? "</>" : "✉"}
        </button>
      )}
    </div>
  );
}

export function RerouteView() {
  const { IN, OUT } = useIO();
  return (
    <div className="nv-reroute">
      <Handle type="target" id="in" position={IN} className="nv-h nv-h-reroute" />
      <Handle type="source" id="out" position={OUT} className="nv-h nv-h-reroute" />
    </div>
  );
}

export function FrameView({ data, selected }: NodeProps<NvNode>) {
  return (
    <div className={`nv-frame ${selected ? "is-selected" : ""} ${data.disabled ? "is-disabled" : ""}`}>
      <div className="nv-frame-label" style={{ color: data.color }}>
        <span className="nv-frame-chip" style={{ background: data.color }} />
        {data.title}
        {data.disabled && <span className="nv-node-off">Disabled</span>}
      </div>
    </div>
  );
}

/** Dashed placeholder in an empty branch / loop / group: click to add a step there. */
export function SlotView({ data }: NodeProps<NvNode>) {
  const actions = useContext(NodeActions);
  const { IN, OUT } = useIO();
  return (
    <div className="nv-slot">
      <Handle type="target" id="in" position={IN} className="nv-h nv-h-reroute" />
      <button
        className="nv-slot-btn nodrag"
        title="Add a step here (Shift+A)"
        onClick={(e) => {
          e.stopPropagation();
          if (data.insert) actions?.add(data.insert, e.clientX, e.clientY);
        }}
      >
        <span className="nv-slot-plus">＋</span>
        {data.title}
      </button>
      <Handle type="source" id="out" position={OUT} className="nv-h nv-h-reroute" />
    </div>
  );
}

/** Wire with a + button in the middle (on hover/selection) to insert a step there. */
export function WireEdge(props: EdgeProps<NvEdge>) {
  const actions = useContext(NodeActions);
  const [path, lx, ly] = getBezierPath(props);
  const insert = props.data?.insert;
  const show = !!insert && (props.selected || (props.data as { hover?: boolean } | undefined)?.hover);
  return (
    <>
      <BaseEdge id={props.id} path={path} style={props.style} interactionWidth={24} />
      {insert && (
        <EdgeLabelRenderer>
          <button
            className={`nv-wire-add nodrag nopan ${show ? "is-visible" : ""}`}
            style={{ transform: `translate(-50%, -50%) translate(${lx}px, ${ly}px)` }}
            title="Add a step here"
            onClick={(e) => {
              e.stopPropagation();
              actions?.add(insert, e.clientX, e.clientY);
            }}
          >
            ＋
          </button>
        </EdgeLabelRenderer>
      )}
    </>
  );
}

export const nodeTypes = { nv: NvNodeView, reroute: RerouteView, frame: FrameView, slot: SlotView };
export const edgeTypes = { wire: WireEdge };
