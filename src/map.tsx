// The workflow map: shown on the canvas while Workflow settings is open. Every stage is a box with its actions,
// beside the global actions, with the commands below. Lines show what runs what: an action (or global action)
// that calls a command (a reference step), a command that calls another (a switch turns these on), and arrows
// for how a record moves: an action whose Property Updater sets the stage field (`status`) to another stage.
// A click highlights something's lines; a double click opens it. Dragging an arrow's end onto another stage
// changes the stage that action moves the record to (setStageTransition, one draft edit).
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { send } from "./bridge";
import {
  applyNodeChanges,
  Background,
  BackgroundVariant,
  Controls,
  Handle,
  MarkerType,
  Position,
  ReactFlow,
  ReactFlowProvider,
  type Edge,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import type { Flow, Path, WorkflowView } from "./types";
import { switchSteps } from "./types";

/** The record field whose value is the stage (Saturn's workflows keep the stage in `status`). */
export const STAGE_FIELD = "status";

/** One arrow: the step that moves the record, and where to. */
export interface Transition {
  /** the tree it's in (s:<stage>:<id> or g:<id>) */
  from: string;
  path: Path;
  /** the stage it sets now */
  to: string;
}

/** Every step inside a flow, not following references. */
function walk(f: Flow | null | undefined, visit: (f: Flow) => void) {
  if (!f) return;
  visit(f);
  if ("children" in f) f.children.forEach((c) => walk(c, visit));
  if (f.kind === "if") {
    f.whenTrue.forEach((c) => walk(c, visit));
    f.whenFalse.forEach((c) => walk(c, visit));
  }
  if (f.kind === "switch") switchSteps(f).forEach((c) => walk(c, visit));
}

/** What a flow calls (command ids) and the stages it moves the record to. */
function linksOf(flow: Flow | null, commandOf: (target: string) => string | null, stages: Set<string>) {
  const calls = new Set<string>();
  const moves: { path: Path; to: string }[] = [];
  walk(flow, (f) => {
    if (f.kind === "reference" && f.targetId) {
      const id = commandOf(f.targetId);
      if (id) calls.add(id);
    }
    if (f.kind === "operator" && f.operator === "property_updater") {
      const p = f.params.find((x) => x.key === "properties");
      if (!p || p.truncated) return;
      try {
        const map = JSON.parse(p.value);
        const to = map && typeof map === "object" ? map[STAGE_FIELD] : undefined;
        if (typeof to === "string" && stages.has(to)) moves.push({ path: f.path, to });
      } catch {
        /* not a map */
      }
    }
  });
  return { calls: [...calls], moves };
}

/** The map's contents, from the workflow as the node view has it. */
export function mapOf(wf: WorkflowView) {
  const stages = new Set(wf.stages.map((s) => s.stage));
  const commandOf = (target: string) => wf.commands.find((c) => c.id === target || c.name === target)?.id ?? null;
  const actions = [
    ...wf.stages.flatMap((s) => s.actions.map((a) => ({ key: `s:${s.stage}:${a.id}`, label: a.label, stage: s.stage, flow: a.flow }))),
    ...wf.actions.map((a) => ({ key: `g:${a.id}`, label: a.label, stage: null as string | null, flow: a.flow })),
  ].map((a) => ({ ...a, ...linksOf(a.flow, commandOf, stages) }));
  const commands = wf.commands.map((c) => ({ key: `c:${c.id}`, id: c.id, label: c.label, ...linksOf(c.flow, commandOf, stages) }));
  const transitions: Transition[] = actions.flatMap((a) => a.moves.map((m) => ({ from: a.key, path: m.path, to: m.to })));
  return { actions, commands, transitions };
}

type Lit = (key: string) => "on" | "off" | null;

// A double click, told apart here: the first click lights things up and redraws the map, which can stop the
// browser from seeing the second one as a double click.
let lastClick = { key: "", at: 0 };
/** A click on something: the second within 400 ms opens it, else it's picked. */
function clicked(key: string, pick: (key: string) => void, open: (key: string) => void) {
  const now = Date.now();
  if (lastClick.key === key && now - lastClick.at < 400) {
    lastClick = { key: "", at: 0 };
    open(key);
  } else {
    lastClick = { key, at: now };
    pick(key);
  }
}
interface RowsData extends Record<string, unknown> {
  title: string;
  color: string | null;
  stage: string | null;
  rows: { key: string; label: string }[];
}
interface CommandData extends Record<string, unknown> {
  key: string;
  label: string;
}
/** What's lit, and what a click does. Shared through context, so lighting things up doesn't rebuild the nodes
 *  (React Flow hides a rebuilt node until it has measured it again, and a click in between would miss it). */
const MapContext = createContext<{ lit: Lit; onPick: (key: string) => void; onOpen: (key: string) => void }>({ lit: () => null, onPick: () => {}, onOpen: () => {} });

/** A stage (or the global actions): a header and one row per action, each row with its own line handle. */
function RowsNode({ data: node }: NodeProps<Node<RowsData>>) {
  const data = { ...node, ...useContext(MapContext) };
  const head = data.stage ? `stage:${data.stage}` : null;
  return (
    <div className={`mp-box${head && data.lit(head) === "off" ? " is-dim" : ""}${head && data.lit(head) === "on" ? " is-lit" : ""}`} style={{ borderTopColor: data.color ?? "#888" }}>
      {data.stage && <Handle type="target" position={Position.Top} id="in" className="mp-in" isConnectableStart={false} />}
      <div
        className="mp-head"
        title={head ? "Click: show its lines. Double-click: stage settings." : undefined}
        onClick={(e) => {
          e.stopPropagation();
          if (head) clicked(head, data.onPick, data.onOpen);
        }}
      >
        <span className="mp-dot" style={{ background: data.color ?? "#888" }} />
        {data.title}
      </div>
      {data.rows.map((r) => (
        <div
          key={r.key}
          className={`mp-row${data.lit(r.key) === "on" ? " is-lit" : data.lit(r.key) === "off" ? " is-dim" : ""}`}
          title="Click: show its lines. Double-click: open it."
          onClick={(e) => {
            e.stopPropagation();
            clicked(r.key, data.onPick, data.onOpen);
          }}
        >
          {r.label}
          <Handle type="source" position={Position.Right} id={`out:${r.key}`} className="mp-out" isConnectableStart={false} isConnectableEnd={false} />
        </div>
      ))}
      {!data.rows.length && <div className="mp-none">No actions</div>}
    </div>
  );
}

function CommandNode({ data: node }: NodeProps<Node<CommandData>>) {
  const data = { ...node, ...useContext(MapContext) };
  const lit = data.lit(data.key);
  return (
    <div className={`mp-cmd${lit === "on" ? " is-lit" : lit === "off" ? " is-dim" : ""}`} title="Click: show its lines. Double-click: open it.">
      <Handle type="target" position={Position.Top} id="in" className="mp-in" isConnectableStart={false} isConnectableEnd={false} />
      <span className="mp-cmd-kind">Command</span>
      {data.label}
      <Handle type="source" position={Position.Bottom} id="out" className="mp-out" isConnectableStart={false} isConnectableEnd={false} />
    </div>
  );
}

const nodeTypes = { rows: RowsNode, command: CommandNode };
const COL = 270;
const STAGES_PER_ROW = 5;
const ROW = 26;
const HEAD = 34;

export function WorkflowMap(props: {
  wf: WorkflowView;
  /** open an action or command (its tree key), or a stage's settings (`stage:<stage>`) */
  onOpen: (key: string) => void;
  /** an arrow dragged to another stage */
  onMove: (t: Transition, to: string) => void;
}) {
  return (
    <ReactFlowProvider>
      <MapCanvas {...props} />
    </ReactFlowProvider>
  );
}

function MapCanvas({ wf, onOpen, onMove }: { wf: WorkflowView; onOpen: (key: string) => void; onMove: (t: Transition, to: string) => void }) {
  const [picked, setPicked] = useState<string | null>(null);
  const [commandLines, setCommandLines] = useState(false);
  // bumped after a drag, so the Reset layout button notices (the moves themselves are in a ref)
  const [, setLayoutChanged] = useState(0);
  const map = useMemo(() => mapOf(wf), [wf]);

  // what the picked thing is linked to (itself included)
  const near = useMemo(() => {
    if (!picked) return null;
    const set = new Set([picked]);
    for (const a of map.actions) {
      if (a.key === picked) {
        a.calls.forEach((c) => set.add(`c:${c}`));
        a.moves.forEach((m) => set.add(`stage:${m.to}`));
      }
      if (a.calls.some((c) => `c:${c}` === picked) || a.moves.some((m) => `stage:${m.to}` === picked)) set.add(a.key);
    }
    if (commandLines)
      for (const c of map.commands) {
        if (c.key === picked) c.calls.forEach((x) => set.add(`c:${x}`));
        if (c.calls.some((x) => `c:${x}` === picked)) set.add(c.key);
      }
    return set;
  }, [picked, map, commandLines]);
  const lit: Lit = (key) => (!near ? null : near.has(key) ? "on" : "off");

  // where the boxes go by themselves: Global actions on the left, the stages to its right in rows of
  // STAGES_PER_ROW, the commands under the stages
  const auto = useMemo(() => {
    const nodes: Node[] = [];
    const rowsOf = (stage: string | null) => map.actions.filter((a) => a.stage === stage).map((a) => ({ key: a.key, label: a.label }));
    // the stages in rows of STAGES_PER_ROW, in their order, each row as tall as its tallest stage
    let y = 0;
    for (let start = 0; start < wf.stages.length; start += STAGES_PER_ROW) {
      let tallest = 0;
      wf.stages.slice(start, start + STAGES_PER_ROW).forEach((s, i) => {
        const rows = rowsOf(s.stage);
        tallest = Math.max(tallest, HEAD + Math.max(1, rows.length) * ROW);
        nodes.push({ id: `stage:${s.stage}`, type: "rows", position: { x: COL + i * COL, y }, data: { title: s.label, color: s.color, stage: s.stage, rows } satisfies RowsData });
      });
      y += tallest + 90;
    }
    const below = y + 60;
    nodes.push({ id: "global", type: "rows", position: { x: 0, y: 0 }, data: { title: "Global actions", color: "#9ca3af", stage: null, rows: rowsOf(null) } satisfies RowsData });
    map.commands.forEach((c, i) => {
      nodes.push({ id: c.key, type: "command", position: { x: COL + (i % STAGES_PER_ROW) * COL, y: below + Math.floor(i / STAGES_PER_ROW) * 90 }, data: { key: c.key, label: c.label } satisfies CommandData });
    });
    return nodes;
  }, [wf, map]);

  // boxes moved by hand: kept by the extension per workflow (map-layouts.json, on this computer only), read when
  // the map opens; `saved` is what was read (or reset), `moved` holds every move since without rebuilding the nodes
  const [saved, setSaved] = useState<Record<string, { x: number; y: number }> | null>(null);
  const moved = useRef<Record<string, { x: number; y: number }>>({});
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      const { type, payload } = e.data ?? {};
      if (type === "mapLayout" && payload?.workflowId === wf.id) {
        moved.current = { ...(payload.positions ?? {}) };
        setSaved(payload.positions ?? {});
      }
    };
    window.addEventListener("message", onMessage);
    send("fetchMapLayout", { workflowId: wf.id });
    return () => window.removeEventListener("message", onMessage);
  }, [wf.id]);
  const [nodes, setNodes] = useState<Node[]>([]);
  useEffect(() => {
    if (!saved) return;
    setNodes(auto.map((n) => (moved.current[n.id] ? { ...n, position: moved.current[n.id] } : n)));
  }, [auto, saved]);
  const resetLayout = () => {
    moved.current = {};
    setSaved({});
    send("saveMapLayout", { workflowId: wf.id, positions: null });
  };

  const edges = useMemo(() => {
    const edges: Edge[] = [];
    const dim = (keys: string[]) => !!near && !keys.every((k) => near.has(k));
    const nodeOf = (actionKey: string) => (actionKey.startsWith("g:") ? "global" : `stage:${actionKey.split(":")[1]}`);
    const colour = (stage: string) => wf.stages.find((s) => s.stage === stage)?.color ?? "#9ca3af";
    for (const a of map.actions) {
      for (const c of a.calls)
        edges.push({
          id: `call:${a.key}:${c}`,
          source: nodeOf(a.key),
          sourceHandle: `out:${a.key}`,
          target: `c:${c}`,
          targetHandle: "in",
          className: `mp-call${dim([a.key, `c:${c}`]) ? " is-dim" : ""}`,
          reconnectable: false,
        });
      a.moves.forEach((m, i) =>
        edges.push({
          id: `move:${a.key}:${i}`,
          source: nodeOf(a.key),
          sourceHandle: `out:${a.key}`,
          target: `stage:${m.to}`,
          targetHandle: "in",
          className: `mp-move${dim([a.key, `stage:${m.to}`]) ? " is-dim" : ""}`,
          style: { stroke: colour(m.to) },
          markerEnd: { type: MarkerType.ArrowClosed, color: colour(m.to) },
          // arrows into one stage end at the same point: once an action is picked, only its arrows can be moved
          // (and they're drawn on top), so the drag takes the right one
          reconnectable: !near || near.has(a.key) ? "target" : false,
          zIndex: near?.has(a.key) ? 10 : 0,
          data: { from: a.key, path: m.path, to: m.to } satisfies Transition,
        }),
      );
    }
    if (commandLines)
      for (const c of map.commands)
        for (const x of c.calls)
          edges.push({
            id: `cc:${c.key}:${x}`,
            source: c.key,
            sourceHandle: "out",
            target: `c:${x}`,
            targetHandle: "in",
            className: `mp-cc${dim([c.key, `c:${x}`]) ? " is-dim" : ""}`,
            reconnectable: false,
          });
    return edges;
  }, [wf, map, near, commandLines]);
  const context = useMemo(() => ({ lit, onPick: (k: string) => setPicked((p) => (p === k ? null : k)), onOpen }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [near, onOpen]);

  return (
    <MapContext.Provider value={context}>
    <div className="mp-root">
      <div className="mp-bar">
        <span className="mp-title">Workflow map</span>
        <span className="mp-key is-move">Moves the record to</span>
        <span className="mp-key is-call">Runs a command</span>
        <label className="mp-toggle">
          <input type="checkbox" role="switch" checked={commandLines} onChange={(e) => setCommandLines(e.target.checked)} />
          Commands calling commands
        </label>
        <button className="nv-btn is-small" disabled={!Object.keys(moved.current).length && !(saved && Object.keys(saved).length)} onClick={resetLayout} title="Put every box back where the map places it">
          Reset layout
        </button>
        <span className="mp-hint">Drag a box to move it · click to show its lines · double-click to open · to move an arrow, click its action, then drag the arrow's end to another stage</span>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.1}
        zoomOnDoubleClick={false}
        // the boxes can be moved; where they're put is kept (actions stay in their stage: they're rows of it)
        onNodesChange={(changes) => setNodes((ns) => applyNodeChanges(changes, ns))}
        onNodeDragStop={(_, __, dragged) => {
          for (const n of dragged) moved.current[n.id] = { x: Math.round(n.position.x), y: Math.round(n.position.y) };
          send("saveMapLayout", { workflowId: wf.id, positions: moved.current });
          setLayoutChanged((v) => v + 1);
        }}
        // connectable, so an arrow's end can be dropped on a stage; no handle starts a new line (isConnectableStart)
        nodesConnectable
        edgesReconnectable
        onReconnect={(old, conn) => {
          const t = old.data as Transition | undefined;
          const to = conn.target?.startsWith("stage:") ? conn.target.slice(6) : null;
          if (t && to && to !== t.to) onMove(t, to);
        }}
        onNodeClick={(_, n) => n.type === "command" && clicked(n.id, (k) => setPicked((p) => (p === k ? null : k)), onOpen)}
        onPaneClick={() => setPicked(null)}
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={22} size={1} />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
    </MapContext.Provider>
  );
}
