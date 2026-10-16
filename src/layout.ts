import type { Edge, Node } from "@xyflow/react";
import type { Catalog, Flow, Path } from "./types";

// ---- sizing -------------------------------------------------------------
export const NODE_W = 230;
const HEADER_H = 28;
const ROW_H = 20;
const MAX_ROWS = 6;
const GAP_X = 64;
const GAP_Y = 36;
const FRAME_PAD = 22;
const FRAME_TOP = 38;
const REROUTE = 14;
const TERMINAL_W = 150;
const TERMINAL_H = 60;
const SLOT_W = 170;
const SLOT_H = 34;
const GAP_V = 46; // between steps when the flow runs top to bottom

/** Which way the flow runs: "h" left → right (Blender), "v" top → bottom. */
export type LayoutDir = "h" | "v";
let V = false; // set for the duration of one layoutTree() call

// ---- data carried on nodes and edges ------------------------------------
export type NodeRole =
  | "step" // an operator or reference: selectable, movable, deletable
  | "head" // the control node at the start of a container frame
  | "frame" // the frame drawn around a container
  | "join" // reroute dot where a container's branches meet
  | "terminal" // Start / Done of the tree
  | "slot"; // placeholder in an empty branch/container: click to add a step there

/** A node row that opens something: a code parameter in an editor, or an email with its preview. */
export interface RowAction {
  kind: "code" | "email";
  param: string;
  label: string;
  language?: string;
}
export interface NvRow {
  key: string;
  value: string;
  action?: RowAction;
}

export interface NvNodeData extends Record<string, unknown> {
  role: NodeRole;
  flow?: Flow; // the step or container this node stands for
  title: string;
  subtitle?: string;
  color: string;
  rows?: NvRow[];
  moreRows?: number;
  disabled?: boolean; // Saturn "mock": true
  insert?: InsertPoint; // slots: where a new step goes
  outputs?: "flow" | "branch" | "none";
  inputs?: boolean;
  invalid?: boolean;
}

export interface InsertPoint {
  childrenPath: Path;
  index: number;
}
export interface NvEdgeData extends Record<string, unknown> {
  insert: InsertPoint | null;
  branch?: "true" | "false";
}

export type NvNode = Node<NvNodeData>;
export type NvEdge = Edge<NvEdgeData>;

// ---- colours (Blender node-editor header colours) ------------------------
const CATEGORY_COLORS = [
  "#83314a", // input
  "#2b652b", // shader
  "#79461d", // texture
  "#6b5d1e", // colour
  "#3b3b83", // vector
  "#246283", // converter
  "#5c3b83",
  "#7a2f2f",
  "#2f6a6a",
];
export const KIND_COLORS = {
  each: "#246283",
  if: "#5c3b83",
  parallel: "#2f6a6a",
  series: "#3c4a5a",
  reference: "#1f6e4a",
  terminal: "#4a4a4a",
};

export function categoryColor(cat: string | null | undefined) {
  if (!cat) return "#4f4f4f";
  let h = 0;
  for (let i = 0; i < cat.length; i++) h = (h * 31 + cat.charCodeAt(i)) | 0;
  return CATEGORY_COLORS[Math.abs(h) % CATEGORY_COLORS.length];
}

export const pathKey = (p: Path) => p.join(".");

/** The operator name the host's deleteOperator/addOperator expect. */
export function operatorName(f: Flow): string {
  switch (f.kind) {
    case "operator":
      return f.operator ?? "";
    default:
      return f.kind; // "each" | "if" | "series" | "parallel" | "reference"
  }
}

// ---- layout --------------------------------------------------------------
interface Port {
  id: string;
  handle: string;
}
interface Block {
  w: number;
  h: number;
  nodes: NvNode[]; // nodes without parentId are relative to the block origin
  edges: NvEdge[];
  entry: Port;
  exit: Port;
}

function stepHeight(rows: number) {
  return HEADER_H + 10 + Math.max(1, rows) * ROW_H + 10;
}

function edge(
  from: Port,
  to: Port,
  insert: InsertPoint | null,
  extra: Partial<NvEdgeData> = {},
): NvEdge {
  return {
    id: `e:${from.id}:${from.handle}->${to.id}:${to.handle}`,
    source: from.id,
    sourceHandle: from.handle,
    target: to.id,
    targetHandle: to.handle,
    type: "wire",
    data: { insert, ...extra },
  };
}

function offset(block: Block, dx: number, dy: number, parentId?: string) {
  for (const n of block.nodes) {
    if (n.parentId === undefined) {
      n.position = { x: n.position.x + dx, y: n.position.y + dy };
      if (parentId) n.parentId = parentId;
    }
  }
}

function stepBlock(f: Flow, catalog: Catalog): Block {
  const id = "n:" + pathKey(f.path);
  let data: NvNodeData;
  if (f.kind === "operator") {
    const entry = f.operator ? catalog[f.operator] : undefined;
    const rows = operatorRows(f, catalog);
    data = {
      role: "step",
      flow: f,
      title: f.label,
      subtitle: entry?.category ?? f.operator ?? undefined,
      color: categoryColor(entry?.category ?? f.operator),
      rows: rows.slice(0, MAX_ROWS),
      moreRows: Math.max(0, rows.length - MAX_ROWS),
      inputs: true,
      outputs: "flow",
      invalid: !!f.operator && !entry && Object.keys(catalog).length > 0,
      disabled: !!f.mock,
    };
  } else {
    // reference to a reusable command: drawn like a Blender node group
    const r = f.kind === "reference" ? f : null;
    const rows = (r?.parameterValues ?? []).map((p) => ({
      key: p.key,
      value: p.value,
    }));
    data = {
      role: "step",
      flow: f,
      title: r?.label && r.label !== "Reference" ? r.label : r?.targetName ?? "Command",
      subtitle: "Command group",
      color: KIND_COLORS.reference,
      disabled: !!f.mock,
      rows: rows.slice(0, MAX_ROWS),
      moreRows: Math.max(0, rows.length - MAX_ROWS),
      inputs: true,
      outputs: "flow",
    };
  }
  const shown = (data.rows?.length ?? 0) + (data.moreRows ? 1 : 0);
  const h = stepHeight(shown);
  return {
    w: NODE_W,
    h,
    nodes: [
      {
        id,
        type: "nv",
        position: { x: 0, y: 0 },
        data,
        style: { width: NODE_W },
      },
    ],
    edges: [],
    entry: { id, handle: "in" },
    exit: { id, handle: "out" },
  };
}

/** Placeholder for an empty list of steps; both its wires insert at index 0. */
function slotBlock(id: string, insert: InsertPoint, title: string): Block {
  return {
    w: SLOT_W,
    h: SLOT_H,
    nodes: [
      {
        id,
        type: "slot",
        position: { x: 0, y: 0 },
        draggable: false,
        data: { role: "slot", title, color: "", insert },
        style: { width: SLOT_W },
      },
    ],
    edges: [],
    entry: { id, handle: "in" },
    exit: { id, handle: "out" },
  };
}

/** Lays children left to right; returns the blocks already offset in-row. */
function row(children: Flow[], catalog: Catalog) {
  const blocks = children.map((c) => layoutFlow(c, catalog));
  if (V) {
    const w = blocks.reduce((m, b) => Math.max(m, b.w), 0);
    let y = 0;
    for (const b of blocks) {
      offset(b, (w - b.w) / 2, y);
      y += b.h + GAP_V;
    }
    return { blocks, w, h: blocks.length ? y - GAP_V : 0 };
  }
  const h = blocks.reduce((m, b) => Math.max(m, b.h), 0);
  let x = 0;
  for (const b of blocks) {
    offset(b, x, (h - b.h) / 2);
    x += b.w + GAP_X;
  }
  const w = blocks.length ? x - GAP_X : 0;
  return { blocks, w, h };
}

/** Wires from → children → to, each wire knowing where a dropped node goes. */
function chainEdges(
  blocks: Block[],
  from: Port,
  to: Port,
  childrenPath: Path | null,
  extra: Partial<NvEdgeData> = {},
): NvEdge[] {
  const ins = (i: number) => (childrenPath ? { childrenPath, index: i } : null);
  if (blocks.length === 0) return [edge(from, to, ins(0), extra)];
  const out: NvEdge[] = [edge(from, blocks[0].entry, ins(0), extra)];
  for (let i = 0; i < blocks.length - 1; i++)
    out.push(edge(blocks[i].exit, blocks[i + 1].entry, ins(i + 1)));
  const lastIsSlot = blocks.length === 1 && blocks[0].nodes[0]?.type === "slot";
  out.push(edge(blocks[blocks.length - 1].exit, to, ins(lastIsSlot ? 0 : blocks.length)));
  return out;
}

function headNode(id: string, f: Flow, w = NODE_W): NvNode {
  let title = f.label;
  let rows: { key: string; value: string }[] = [];
  let outputs: NvNodeData["outputs"] = "flow";
  if (f.kind === "each") {
    title = "For Each";
    rows = [
      { key: "Collection", value: f.collection ?? "—" },
      { key: "Concurrency", value: String(f.concurrency ?? 1) },
    ];
  } else if (f.kind === "parallel") {
    title = f.label && f.label !== "Parallel" ? `Parallel: ${f.label}` : "Parallel";
    rows = [{ key: "Concurrency", value: String(f.concurrency ?? "all") }];
  } else if (f.kind === "series") {
    title = f.label && f.label !== "Series" ? `Group: ${f.label}` : "Group";
    rows = [{ key: "Steps", value: String(f.children.length) }];
  } else if (f.kind === "if") {
    title = "If";
    outputs = "branch";
    if (f.condition)
      rows = [
        {
          key: "Condition",
          value: `${f.condition.property} ${f.condition.operator} ${f.condition.value}`,
        },
      ];
    else
      rows = [
        { key: "Evaluator", value: f.evaluatorKind ?? "function" },
        ...(f.evaluatorSource
          ? [{ key: "Function", value: f.evaluatorSource.split("\n")[0] }]
          : []),
      ];
  }
  return {
    id,
    type: "nv",
    position: { x: 0, y: 0 },
    draggable: false,
    data: {
      role: "head",
      flow: f,
      disabled: !!f.mock,
      title,
      color: KIND_COLORS[f.kind as keyof typeof KIND_COLORS] ?? "#4f4f4f",
      rows,
      inputs: true,
      outputs,
    },
    style: { width: w },
  };
}

function rerouteNode(id: string): NvNode {
  return {
    id,
    type: "reroute",
    position: { x: 0, y: 0 },
    draggable: false,
    selectable: false,
    data: { role: "join", title: "", color: "#888" },
  };
}

function containerBlock(f: Flow, catalog: Catalog): Block {
  const key = pathKey(f.path);
  const frameId = "f:" + key;
  const head = headNode("h:" + key, f);
  const join = rerouteNode("j:" + key);
  const headH = stepHeight(head.data.rows?.length ?? 1);

  // rows of content: one for series/each, one per child for parallel,
  // true + false for if.
  type Lane = {
    blocks: Block[];
    w: number;
    h: number;
    childrenPath: Path;
    branch?: "true" | "false";
    perChild?: boolean;
  };
  const lanes: Lane[] = [];
  if (f.kind === "series" || f.kind === "each") {
    const r = row(f.children, catalog);
    lanes.push({ ...r, childrenPath: f.childrenPath });
  } else if (f.kind === "parallel") {
    if (f.children.length === 0)
      lanes.push({ blocks: [], w: 0, h: 0, childrenPath: f.childrenPath });
    f.children.forEach((c) => {
      const b = layoutFlow(c, catalog);
      lanes.push({ blocks: [b], w: b.w, h: b.h, childrenPath: f.childrenPath, perChild: true });
    });
  } else if (f.kind === "if") {
    const t = row(f.whenTrue, catalog);
    const fl = row(f.whenFalse, catalog);
    lanes.push({ ...t, childrenPath: f.truePath, branch: "true" });
    lanes.push({ ...fl, childrenPath: f.falsePath, branch: "false" });
  }

  for (const lane of lanes) {
    if (lane.blocks.length === 0 && !lane.perChild) {
      const what =
        f.kind === "if" ? `Empty ${lane.branch} branch` : f.kind === "each" ? "Empty loop" : f.kind === "parallel" ? "No branches" : "Empty group";
      lane.blocks = [slotBlock(`s:${key}:${lane.branch ?? "body"}`, { childrenPath: lane.childrenPath, index: 0 }, what)];
      lane.w = SLOT_W;
      lane.h = SLOT_H;
    }
  }
  if (V) return containerBlockV(f, lanes, head, join, headH, frameId);
  const laneH = (l: Lane) => Math.max(l.h, 36);
  const contentW = lanes.reduce((m, l) => Math.max(m, l.w), 0);
  const contentH =
    lanes.reduce((s, l) => s + laneH(l), 0) + GAP_Y * Math.max(0, lanes.length - 1);
  const innerH = Math.max(headH, contentH);
  const contentX = FRAME_PAD + NODE_W + GAP_X;
  const joinX = contentX + (contentW > 0 ? contentW + GAP_X : 0);
  const w = joinX + REROUTE + FRAME_PAD;
  const h = FRAME_TOP + innerH + FRAME_PAD;

  const frame: NvNode = {
    id: frameId,
    type: "frame",
    position: { x: 0, y: 0 },
    data: {
      role: "frame",
      flow: f,
      disabled: !!f.mock,
      title:
        f.kind === "each"
          ? `Loop over ${f.kind === "each" ? f.collection ?? "…" : ""}`
          : f.kind === "if"
            ? "Condition"
            : f.kind === "parallel"
              ? "Parallel"
              : f.label && f.label !== "Series"
                ? f.label
                : "Group",
      color: KIND_COLORS[f.kind as keyof typeof KIND_COLORS] ?? "#4f4f4f",
    },
    style: { width: w, height: h },
  };

  head.position = { x: FRAME_PAD, y: FRAME_TOP + (innerH - headH) / 2 };
  head.parentId = frameId;
  join.position = { x: joinX, y: FRAME_TOP + innerH / 2 - REROUTE / 2 };
  join.parentId = frameId;

  const nodes: NvNode[] = [frame, head, join];
  const edges: NvEdge[] = [];
  const headPort = (branch?: string): Port => ({ id: head.id, handle: branch ?? "out" });
  const joinPort: Port = { id: join.id, handle: "in" };

  let y = FRAME_TOP + (innerH - contentH) / 2;
  lanes.forEach((lane, li) => {
    const lh = laneH(lane);
    for (const b of lane.blocks) {
      offset(b, contentX, y + (lh - lane.h) / 2, frameId);
      nodes.push(...b.nodes);
      edges.push(...b.edges);
    }
    if (lane.perChild) {
      // parallel branch: fork → child → join; index = branch position
      const childIndex = lanes.filter((l) => l.perChild).indexOf(lane);
      const b = lane.blocks[0];
      edges.push(edge(headPort(), b.entry, { childrenPath: lane.childrenPath, index: childIndex }));
      edges.push(edge(b.exit, joinPort, { childrenPath: lane.childrenPath, index: childIndex + 1 }));
    } else {
      edges.push(
        ...chainEdges(lane.blocks, headPort(lane.branch), joinPort, lane.childrenPath, {
          branch: lane.branch,
        }),
      );
    }
    y += lh + (li < lanes.length - 1 ? GAP_Y : 0);
  });

  return {
    w,
    h,
    nodes,
    edges,
    entry: { id: head.id, handle: "in" },
    exit: { id: join.id, handle: "out" },
  };
}

interface LaneV {
  blocks: Block[];
  w: number;
  h: number;
  childrenPath: Path;
  branch?: "true" | "false";
  perChild?: boolean;
}
/** Top-to-bottom container: head on top, lanes side by side, join at the bottom. */
function containerBlockV(f: Flow, lanes: LaneV[], head: NvNode, join: NvNode, headH: number, frameId: string): Block {
  const laneW = (l: LaneV) => Math.max(l.w, 60);
  const contentW = lanes.reduce((s, l) => s + laneW(l), 0) + GAP_X * Math.max(0, lanes.length - 1);
  const contentH = lanes.reduce((m, l) => Math.max(m, l.h), 0);
  const innerW = Math.max(NODE_W, contentW);
  const contentY = FRAME_TOP + headH + GAP_V;
  const joinY = contentY + (contentH > 0 ? contentH + GAP_V : 0);
  const w = FRAME_PAD * 2 + innerW;
  const h = joinY + REROUTE + FRAME_PAD;
  const frame: NvNode = {
    id: frameId,
    type: "frame",
    position: { x: 0, y: 0 },
    data: {
      role: "frame",
      flow: f,
      disabled: !!f.mock,
      title:
        f.kind === "each"
          ? `Loop over ${f.collection ?? "…"}`
          : f.kind === "if"
            ? "Condition"
            : f.kind === "parallel"
              ? "Parallel"
              : f.label && f.label !== "Series"
                ? f.label
                : "Group",
      color: KIND_COLORS[f.kind as keyof typeof KIND_COLORS] ?? "#4f4f4f",
    },
    style: { width: w, height: h },
  };
  head.position = { x: FRAME_PAD + (innerW - NODE_W) / 2, y: FRAME_TOP };
  head.parentId = frameId;
  join.position = { x: FRAME_PAD + innerW / 2 - REROUTE / 2, y: joinY };
  join.parentId = frameId;
  const nodes: NvNode[] = [frame, head, join];
  const edges: NvEdge[] = [];
  const headPort = (branch?: string): Port => ({ id: head.id, handle: branch ?? "out" });
  const joinPort: Port = { id: join.id, handle: "in" };
  let x = FRAME_PAD + (innerW - contentW) / 2;
  lanes.forEach((lane) => {
    const lw = laneW(lane);
    for (const b of lane.blocks) {
      offset(b, x + (lw - lane.w) / 2, contentY, frameId);
      nodes.push(...b.nodes);
      edges.push(...b.edges);
    }
    if (lane.perChild) {
      const childIndex = lanes.filter((l) => l.perChild).indexOf(lane);
      const b = lane.blocks[0];
      edges.push(edge(headPort(), b.entry, { childrenPath: lane.childrenPath, index: childIndex }));
      edges.push(edge(b.exit, joinPort, { childrenPath: lane.childrenPath, index: childIndex + 1 }));
    } else {
      edges.push(...chainEdges(lane.blocks, headPort(lane.branch), joinPort, lane.childrenPath, { branch: lane.branch }));
    }
    x += lw + GAP_X;
  });
  return { w, h, nodes, edges, entry: { id: head.id, handle: "in" }, exit: { id: join.id, handle: "out" } };
}

/** True when the host summarised a parameter as an HTML/designed email (its In()/ip() text). */
export function isEmailSummary(v: string) {
  return /^(Designed email|HTML email)\b/.test(v);
}

/** Code parameters of an operator, from the catalog (same rule as the list view). */
export function codeParams(operator: string | null | undefined, catalog: Catalog) {
  if (!operator) return [];
  return (catalog[operator]?.params ?? [])
    .filter((p) => p.codeLanguage && !p.mergedInto)
    .map((p) => ({ param: p.param, label: p.label, language: p.codeLanguage ?? "javascript" }));
}

/** Rows for an operator node: code and email parameters first, each with its action. */
export function operatorRows(f: Extract<Flow, { kind: "operator" }>, catalog: Catalog): NvRow[] {
  const code = codeParams(f.operator, catalog);
  const secret = new Set((f.operator ? catalog[f.operator]?.params ?? [] : []).filter((p) => p.sensitive).map((p) => p.param));
  const first: NvRow[] = [];
  const rest: NvRow[] = [];
  for (const p of f.params) {
    if (secret.has(p.key)) {
      rest.push({ key: p.label, value: p.value ? "••••••" : "" });
      continue;
    }
    const c = code.find((x) => x.param === p.key);
    if (c) {
      const line = p.value.split("\n").find((l) => l.trim()) ?? "";
      first.push({ key: p.label, value: line, action: { kind: "code", ...c } });
    } else if (isEmailSummary(p.value)) {
      first.push({ key: p.label, value: p.value.split(" \u2014 ")[0], action: { kind: "email", param: p.key, label: p.label } });
    } else rest.push({ key: p.label, value: p.value });
  }
  // code params that are still empty can be opened too
  for (const c of code)
    if (!f.params.some((p) => p.key === c.param))
      first.push({ key: c.label, value: "", action: { kind: "code", ...c } });
  const rows = [...first, ...rest];
  if (f.delay) rows.unshift({ key: "Delay", value: `${f.delay} ms` });
  return rows;
}

export function layoutFlow(f: Flow, catalog: Catalog): Block {
  if (f.kind === "operator" || f.kind === "reference") return stepBlock(f, catalog);
  return containerBlock(f, catalog);
}

/** Whole tree: Start → root steps → Done. */
export function layoutTree(
  title: string,
  subtitle: string,
  root: Flow | null,
  taskPath: Path,
  catalog: Catalog,
  dir: LayoutDir = "h",
): { nodes: NvNode[]; edges: NvEdge[] } {
  V = dir === "v";
  try {
    return layoutTreeIn(title, subtitle, root, taskPath, catalog);
  } finally {
    V = false;
  }
}

function layoutTreeIn(
  title: string,
  subtitle: string,
  root: Flow | null,
  taskPath: Path,
  catalog: Catalog,
): { nodes: NvNode[]; edges: NvEdge[] } {
  const start: NvNode = {
    id: "start",
    type: "nv",
    position: { x: 0, y: 0 },
    data: {
      role: "terminal",
      title,
      subtitle,
      color: KIND_COLORS.terminal,
      rows: [],
      inputs: false,
      outputs: "flow",
    },
    style: { width: TERMINAL_W },
  };
  const end: NvNode = {
    id: "end",
    type: "nv",
    position: { x: 0, y: 0 },
    data: {
      role: "terminal",
      title: "Done",
      color: KIND_COLORS.terminal,
      rows: [],
      inputs: true,
      outputs: "none",
    },
    style: { width: 110 },
  };

  // A root series is unwrapped so its steps sit directly on the canvas.
  let children: Flow[];
  let childrenPath: Path | null;
  if (!root) {
    children = [];
    childrenPath = [...taskPath, "commands"];
  } else if (root.kind === "series") {
    children = root.children;
    childrenPath = root.childrenPath;
  } else {
    children = [root];
    childrenPath = null;
  }

  const r =
    children.length === 0 && childrenPath
      ? (() => {
          const b = slotBlock("s:root", { childrenPath, index: 0 }, "No steps yet");
          return { blocks: [b], w: b.w, h: b.h };
        })()
      : row(children, catalog);
  if (V) {
    const W = Math.max(r.w, TERMINAL_W);
    const y0 = TERMINAL_H + GAP_V;
    for (const b of r.blocks) offset(b, (W - r.w) / 2, y0);
    start.position = { x: (W - TERMINAL_W) / 2, y: 0 };
    end.position = { x: (W - 110) / 2, y: y0 + (r.h > 0 ? r.h + GAP_V : 0) };
  } else {
    const h = Math.max(r.h, TERMINAL_H);
    const x0 = TERMINAL_W + GAP_X;
    for (const b of r.blocks) offset(b, x0, (h - r.h) / 2);
    start.position = { x: 0, y: h / 2 - TERMINAL_H / 2 };
    end.position = { x: x0 + (r.w > 0 ? r.w + GAP_X : 0), y: h / 2 - TERMINAL_H / 2 };
  }

  const nodes: NvNode[] = [start];
  const edges: NvEdge[] = [];
  for (const b of r.blocks) {
    nodes.push(...b.nodes);
    edges.push(...b.edges);
  }
  nodes.push(end);
  edges.push(
    ...chainEdges(r.blocks, { id: "start", handle: "out" }, { id: "end", handle: "in" }, childrenPath),
  );
  return { nodes, edges };
}

/** Is `inner` the same path as, or inside, `outer`? */
export function isWithin(inner: Path, outer: Path) {
  if (inner.length < outer.length) return false;
  return outer.every((p, i) => String(p) === String(inner[i]));
}
