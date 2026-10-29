import {
  BaseEdge,
  EdgeLabelRenderer,
  Handle,
  NodeResizeControl,
  Position,
  getBezierPath,
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
  /** a card made wider or narrower by hand (0.3.69) */
  resized?: (id: string, width: number) => void;
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
  ].join(" ");
  const row = (r: NvRow, i: number) => <Row key={i} r={r} flow={data.flow} />;
  return (
    <div className={cls}>
      {selected && data.role === "step" && actions?.resized && (
        // a picked card's right edge can be dragged to make it wider or narrower
        <NodeResizeControl
          position="right"
          resizeDirection="horizontal"
          minWidth={180}
          maxWidth={900}
          className="nv-resize-edge"
          onResizeEnd={(_, p) => actions.resized!(id, p.width)}
        />
      )}
      <div className="nv-node-header" style={{ background: data.color }}>
        <span className="nv-node-title" title={data.title}>
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
function langOf(r: NvRow): HlLang {
  if (r.action?.kind === "code") return langFor(r.action.language);
  if (r.action?.kind === "email") return "plain";
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
