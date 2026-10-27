import { useEffect, useRef, useState } from "react";
import type { PanelScope } from "./panel";
import type { SearchResults } from "./search";
import type { Path, WorkflowView } from "./types";

/** The host's machine-name rule (ze() in extension.js). */
export function machineName(label: string) {
  return label
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 64);
}

export type CreateKind = "stage" | "action" | "command";
export interface CreateRequest {
  kind: CreateKind;
  label: string;
  stageIndex: number | null; // actions: the stage, or null for a global action
}
type NodeKind = "stage" | "action" | "command";

/** Adding / renaming state of the inline editor. */
type Editing =
  | { mode: "add"; kind: CreateKind; stageIndex: number | null }
  | { mode: "rename"; kind: NodeKind; path: Path; label: string }
  | null;

const STAGE_COLORS = ["#4a90d9", "#5cb85c", "#f0ad4e", "#d9534f", "#9b59b6", "#1abc9c", "#e67e22", "#7f8c8d"];
export const nextStageColor = (n: number) => STAGE_COLORS[n % STAGE_COLORS.length];

const countFlow = (n: number) => String(n);

export function Outliner(props: {
  wf: WorkflowView;
  activeKey: string | undefined;
  scope: PanelScope;
  addRequest: { stageIndex: number | null; n: number } | null;
  onSelectWorkflow: () => void;
  onSelectStage: (index: number) => void;
  onMoveStage: (from: number, to: number) => void;
  onMoveAction: (stageIndex: number | null, from: number, to: number) => void;
  /** collapsed stages ("stage:<machine>") and sections ("group:stages|global|commands") */
  collapsed: string[];
  onToggleCollapse: (key: string) => void;
  onCollapseAll: (collapse: boolean) => void;
  query: string;
  onQuery: (q: string) => void;
  results: SearchResults | null;
  onOpenStep: (treeKey: string, path: Path) => void;
  counts: Record<string, number>;
  error: string | null;
  busy: boolean;
  /** bumps when the outliner's last edit succeeded */
  doneToken: number;
  onSelect: (key: string) => void;
  onCreate: (r: CreateRequest) => void;
  onRename: (kind: NodeKind, path: Path, label: string) => void;
  onDelete: (kind: NodeKind, path: Path, label: string) => void;
  /** a copy of an action or command, right below it */
  onDuplicate: (kind: "action" | "command", path: Path) => void;
  /** commands made from the actions dragged into Commands, from `index` (null: the end); `move` removes the actions */
  onActionToCommand: (paths: Path[], index: number | null, move: boolean) => void;
  /** actions made from the commands dragged into a stage (null: Global actions), from `index` (null: the end);
   *  `move` removes the commands */
  onCommandToAction: (paths: Path[], stageIndex: number | null, index: number | null, move: boolean) => void;
  /** actions moved into a stage (null: Global actions), before `index` there (null: the end) */
  onMoveActions: (paths: Path[], stageIndex: number | null, index: number | null) => void;
  /** copies of actions in a stage (null: Global actions), before `index` there (null: the end) */
  onCopyActions: (paths: Path[], stageIndex: number | null, index: number | null) => void;
  /** several picked (0.3.60), each as one change: deleted, duplicated (actions, commands), stages moved before the
   *  stage now at `toIndex` */
  onDeleteItems: (kind: NodeKind, paths: Path[]) => void;
  onDuplicateItems: (kind: "action" | "command", paths: Path[]) => void;
  onMoveStages: (indexes: number[], toIndex: number) => void;
  /** what's picked (Ctrl/Cmd or Shift+click), so the side panel can edit several actions */
  onPick: (picked: { kind: NodeKind; path: Path }[]) => void;
  onClearError: () => void;
  /** folds the layers panel away (the strip at the window's edge brings it back) */
  onCollapse: () => void;
}) {
  const { wf } = props;
  const [editing, setEditing] = useState<Editing>(null);
  // many: the right-clicked row is one of several picked, and the menu acts on all of them
  const [menu, setMenu] = useState<{ x: number; y: number; kind: NodeKind; path: Path; label: string; many?: { kind: NodeKind; path: Path; label: string }[] } | null>(null);
  // the Delete key's confirm, naming what goes
  const [confirmDelete, setConfirmDelete] = useState<{ kind: NodeKind; items: { path: Path; label: string }[] } | null>(null);
  const lastCreate = useRef<CreateRequest | null>(null);
  const stageCount = useRef(wf.stages.length);

  // A successful create/rename closes the inline editor. After a new stage,
  // go straight on to naming its first action (a stage is empty without one).
  useEffect(() => {
    if (!props.doneToken) return;
    const lc = lastCreate.current;
    lastCreate.current = null;
    if (lc?.kind === "stage" && wf.stages.length > stageCount.current)
      setEditing({ mode: "add", kind: "action", stageIndex: wf.stages.length - 1 });
    else setEditing(null);
    stageCount.current = wf.stages.length;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.doneToken]);
  useEffect(() => {
    stageCount.current = wf.stages.length;
  }, [wf.stages.length]);
  // the stage panel's "new action" button
  useEffect(() => {
    if (props.addRequest) {
      props.onClearError();
      setEditing({ mode: "add", kind: "action", stageIndex: props.addRequest.stageIndex });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.addRequest?.n]);

  // ---- picking several stages, actions or commands (Ctrl/Cmd+click toggles, Shift+click a run of one kind) ----
  const [picked, setPicked] = useState<string[]>([]);
  const lastPick = useRef<string | null>(null);
  useEffect(() => setPicked([]), [wf.id]);
  // every action and command in the panel's order, with its path
  const items: { tkey: string; kind: "stage" | "action" | "command"; path: Path; label: string }[] = [
    ...wf.stages.map((st, si) => ({ tkey: `st:${st.stage}`, kind: "stage" as const, path: ["stages", si] as Path, label: st.label })),
    ...wf.stages.flatMap((st, si) => st.actions.map((a, ai) => ({ tkey: `s:${st.stage}:${a.id}`, kind: "action" as const, path: ["stages", si, "actions", ai] as Path, label: a.label }))),
    ...wf.actions.map((a, ai) => ({ tkey: `g:${a.id}`, kind: "action" as const, path: ["actions", ai] as Path, label: a.label })),
    ...wf.commands.map((c, ci) => ({ tkey: `c:${c.id}`, kind: "command" as const, path: ["commands", ci] as Path, label: c.label })),
  ];
  const kindOf = (tkey: string) => items.find((it) => it.tkey === tkey)?.kind;
  const pickedItems = items.filter((it) => picked.includes(it.tkey));
  // the side panel follows what's picked (several actions: their shared settings)
  const pickKey = picked.join("|");
  useEffect(() => {
    props.onPick(pickedItems.map((it) => ({ kind: it.kind, path: it.path })));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pickKey, wf]);
  // the row clicked: with Ctrl/Cmd or Shift it's picked (not opened)
  const clickRow = (e: React.MouseEvent | React.KeyboardEvent, tkey: string) => {
    // one kind at a time: picking another kind starts again with it
    const from = (picked.length ? picked : props.activeKey && kindOf(props.activeKey) ? [props.activeKey] : []).filter((k) => kindOf(k) === kindOf(tkey));
    if (e.ctrlKey || e.metaKey) {
      setPicked(from.includes(tkey) ? from.filter((k) => k !== tkey) : [...from, tkey]);
      lastPick.current = tkey;
      return;
    }
    if (e.shiftKey) {
      const anchor = lastPick.current ?? props.activeKey ?? tkey;
      const kind = kindOf(tkey);
      const run = items.filter((it) => it.kind === kind);
      const a = run.findIndex((it) => it.tkey === anchor), b = run.findIndex((it) => it.tkey === tkey);
      setPicked(a < 0 ? [tkey] : run.slice(Math.min(a, b), Math.max(a, b) + 1).map((it) => it.tkey));
      return;
    }
    setPicked([]);
    lastPick.current = tkey;
    props.onSelect(tkey);
  };

  // ---- dragging: a stage reorders; actions (several if picked) move into any stage or Global actions (one in its
  // own list reorders); actions into Commands make commands; commands into a stage or Global actions make actions ----
  type Dragged = { kind: "stage" | "action" | "command"; stageIndex: number | null; index: number; paths: Path[] };
  const drag = useRef<Dragged | null>(null);
  const [dropAt, setDropAt] = useState<string | null>(null);
  const dragProps = (kind: "stage" | "action" | "command", stageIndex: number | null, index: number, tkey?: string) => ({
    draggable: true,
    onDragStart: (e: React.DragEvent) => {
      const own: Path = kind === "command" ? ["commands", index] : kind === "action" ? (stageIndex === null ? ["actions", index] : ["stages", stageIndex, "actions", index]) : ["stages", index];
      // dragging a picked row takes every picked row of its kind, in the panel's order
      const group = tkey && picked.includes(tkey) ? items.filter((it) => it.kind === kind && picked.includes(it.tkey)).map((it) => it.path) : [];
      drag.current = { kind, stageIndex, index, paths: group.length > 1 ? group : [own] };
      e.dataTransfer.effectAllowed = kind === "stage" ? "move" : "copyMove";
      e.dataTransfer.setData("text/plain", `${kind}:${stageIndex}:${index}`);
    },
    onDragEnd: () => {
      drag.current = null;
      setDropAt(null);
    },
    onDragOver: (e: React.DragEvent) => {
      const d = drag.current;
      if (!d) return;
      // a command onto an action row: it goes in before it
      if (kind === "action" && d.kind === "command") {
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = "copy";
        return setDropAt(`into:${stageIndex}:${index}`);
      }
      // actions from another list, or several: they move in before this one
      if (kind === "action" && d.kind === "action" && (d.paths.length > 1 || d.stageIndex !== stageIndex)) {
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = "move";
        return setDropAt(`into:${stageIndex}:${index}`);
      }
      // several stages: they go in before this one
      if (kind === "stage" && d.kind === "stage" && d.paths.length > 1) {
        e.preventDefault();
        e.stopPropagation();
        return setDropAt(`${kind}:${stageIndex}:${index}`);
      }
      if (d.kind !== kind || d.paths.length > 1 || kind === "command" || (kind === "action" && d.stageIndex !== stageIndex)) return;
      e.preventDefault();
      setDropAt(`${kind}:${stageIndex}:${index}`);
    },
    onDrop: (e: React.DragEvent) => {
      const d = drag.current;
      if (!d) return;
      if (kind === "action" && (d.kind === "command" || d.paths.length > 1 || d.stageIndex !== stageIndex)) {
        drag.current = null;
        setDropAt(null);
        e.preventDefault();
        e.stopPropagation();
        return land(d, { to: "actions", stageIndex, index }, e);
      }
      if (kind === "stage" && d.kind === "stage" && d.paths.length > 1) {
        drag.current = null;
        setDropAt(null);
        e.preventDefault();
        e.stopPropagation();
        props.onMoveStages(d.paths.map((x) => Number(x[1])), index);
        setPicked([]);
        return;
      }
      if (d.kind !== kind || d.index === index || d.paths.length > 1 || kind === "command") return;
      if (kind === "action" && d.stageIndex !== stageIndex) return;
      drag.current = null;
      setDropAt(null);
      e.preventDefault();
      if (kind === "stage") props.onMoveStage(d.index, index);
      else props.onMoveAction(stageIndex, d.index, index);
    },
  });
  const isDrop = (kind: string, si: number | null, i: number) => dropAt === `${kind}:${si}:${i}`;
  // actions dropped on Commands (on a command: before it; elsewhere in the section: at the end)
  const commandDrop = (index: number | null) => ({
    onDragOver: (e: React.DragEvent) => {
      if (drag.current?.kind !== "action") return;
      e.preventDefault();
      e.stopPropagation();
      e.dataTransfer.dropEffect = "copy";
      setDropAt(`command:${index ?? "end"}`);
    },
    onDrop: (e: React.DragEvent) => {
      const d = drag.current;
      if (d?.kind !== "action") return;
      drag.current = null;
      setDropAt(null);
      e.preventDefault();
      e.stopPropagation();
      land(d, { to: "commands", index }, e);
    },
  });
  // commands or actions dropped on a stage or Global actions, not on one of its rows: at the end.
  // One action from this very list isn't moved (it's already here).
  const intoList = (d: Dragged | null, stageIndex: number | null) =>
    !!d && (d.kind === "command" || (d.kind === "action" && (d.paths.length > 1 || d.stageIndex !== stageIndex)));
  const actionListDrop = (stageIndex: number | null) => ({
    onDragOver: (e: React.DragEvent) => {
      if (!intoList(drag.current, stageIndex)) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = "copy";
      setDropAt(`into:${stageIndex}:end`);
    },
    onDrop: (e: React.DragEvent) => {
      const d = drag.current;
      if (!d || !intoList(d, stageIndex)) return;
      drag.current = null;
      setDropAt(null);
      e.preventDefault();
      land(d, { to: "actions", stageIndex, index: null }, e);
    },
    onDragLeave: (e: React.DragEvent) => {
      if (!e.currentTarget.contains(e.relatedTarget as Node)) setDropAt((at) => (at?.startsWith(`into:${stageIndex}:`) ? null : at));
    },
  });
  const draggingIntoCommands = dropAt?.startsWith("command:") ?? false;
  const draggingInto = (stageIndex: number | null) => dropAt?.startsWith(`into:${stageIndex}:`) ?? false;
  const many = (n: number, one: string, more: string) => (n === 1 ? one : more.replace("#", String(n)));
  const draggedCount = drag.current?.paths.length ?? 1;

  // ---- where dragged items land: into another list, one or several, asks Copy or Move; several that are all
  // already in that list just move there (a block) ----
  type Target = { to: "actions"; stageIndex: number | null; index: number | null } | { to: "commands"; index: number | null };
  const [ask, setAsk] = useState<{ x: number; y: number; d: Dragged; target: Target } | null>(null);
  // Esc closes the box wherever the focus is (it opens after a drop, so it may not have it)
  useEffect(() => {
    if (!ask) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.stopPropagation();
      setAsk(null);
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [ask]);
  const listOf = (t: Target) => (t.to === "commands" ? "commands" : t.stageIndex === null ? "actions" : `stages.${t.stageIndex}.actions`);
  const fromElsewhere = (d: Dragged, t: Target) => d.paths.some((path) => path.slice(0, -1).join(".") !== listOf(t));
  const finish = (d: Dragged, t: Target, move: boolean) => {
    if (t.to === "commands") props.onActionToCommand(d.paths, t.index, move);
    else if (d.kind === "command") props.onCommandToAction(d.paths, t.stageIndex, t.index, move);
    else if (move) props.onMoveActions(d.paths, t.stageIndex, t.index);
    else props.onCopyActions(d.paths, t.stageIndex, t.index);
  };
  const land = (d: Dragged, t: Target, e: React.DragEvent) => {
    if (!fromElsewhere(d, t)) return d.kind === "action" && t.to === "actions" && props.onMoveActions(d.paths, t.stageIndex, t.index);
    setAsk({ x: e.clientX, y: e.clientY, d, target: t });
  };
  const targetName = (t: Target) => (t.to === "commands" ? "Commands" : t.stageIndex === null ? "Global actions" : wf.stages[t.stageIndex]?.label ?? "this stage");
  // the hint while dragging over a stage or Global actions
  const intoActionsHint = (stageIndex: number | null) => {
    const d = drag.current;
    const n = draggedCount;
    const here = !!d && !fromElsewhere(d, { to: "actions", stageIndex, index: null });
    return (
      <div className="nv-ol-drop-hint">
        {d?.kind === "action"
          ? here ? "Drop to move them here." : many(n, "Drop to copy or move this action here.", "Drop to copy or move # actions here.")
          : many(n, "Drop to copy or move this command here as an action.", "Drop to copy or move # commands here as actions.")}
      </div>
    );
  };

  const startAdd = (kind: CreateKind, stageIndex: number | null) => {
    props.onClearError();
    setEditing({ mode: "add", kind, stageIndex });
  };
  const submit = (label: string) => {
    if (!editing) return;
    const v = label.trim();
    if (!v) {
      setEditing(null);
      return;
    }
    if (editing.mode === "add") {
      const r = { kind: editing.kind, label: v, stageIndex: editing.stageIndex };
      lastCreate.current = r;
      props.onCreate(r);
    } else if (v !== editing.label) props.onRename(editing.kind, editing.path, v);
    else setEditing(null);
  };
  const cancel = () => {
    props.onClearError();
    setEditing(null);
  };
  const openMenu = (e: React.MouseEvent, kind: NodeKind, path: Path, label: string) => {
    e.preventDefault();
    e.stopPropagation();
    // a row that's one of several picked: the menu acts on all of them
    const here = pickedItems.find((it) => it.path.join(".") === path.join("."));
    const many = here && pickedItems.length > 1 ? pickedItems.map((it) => ({ kind: it.kind, path: it.path, label: it.label })) : undefined;
    setMenu({ x: e.clientX, y: e.clientY, kind, path, label, many });
  };
  /** The Delete key with several picked: a confirm naming them first. */
  const onPanelKey = (e: React.KeyboardEvent) => {
    const t = e.target as HTMLElement;
    if (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable) return;
    if ((e.key === "Delete" || e.key === "Backspace") && pickedItems.length > 0) {
      e.preventDefault();
      e.stopPropagation();
      setConfirmDelete({ kind: pickedItems[0].kind, items: pickedItems.map((it) => ({ path: it.path, label: it.label })) });
    }
    if (e.key === "Escape" && picked.length) setPicked([]);
  };
  const deleteNow = (kind: NodeKind, list: { path: Path; label: string }[]) => {
    props.onClearError();
    if (list.length === 1) props.onDelete(kind, list[0].path, list[0].label);
    else props.onDeleteItems(kind, list.map((x) => x.path));
    setPicked([]);
  };

  const inline = (key: string, placeholder: string, initial = "") => (
    <InlineName
      key={key}
      placeholder={placeholder}
      initial={initial}
      error={props.error}
      busy={props.busy}
      onSubmit={submit}
      onCancel={cancel}
    />
  );
  const isAdd = (kind: CreateKind, stageIndex: number | null) =>
    editing?.mode === "add" && editing.kind === kind && editing.stageIndex === stageIndex;
  const isRename = (path: Path) => editing?.mode === "rename" && editing.path.join(".") === path.join(".");
  const isClosed = (key: string) => props.collapsed.includes(key);
  const chevron = (key: string, label: string) => (
    <button
      className={`nv-ol-chev ${isClosed(key) ? "" : "is-open"}`}
      title={isClosed(key) ? `Expand ${label}` : `Collapse ${label}`}
      aria-expanded={!isClosed(key)}
      onClick={(e) => {
        e.stopPropagation();
        props.onToggleCollapse(key);
      }}
    >
      <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M6 4l4 4-4 4" />
      </svg>
    </button>
  );
  const allStagesClosed = wf.stages.length > 0 && wf.stages.every((st) => isClosed(`stage:${st.stage}`));

  // a render function (not a component) so rows keep their identity across re-renders
  const renderRow = (p: { tkey: string; label: string; kind: NodeKind; path: Path; dot: string; indent?: boolean; drag?: ReturnType<typeof dragProps>; drop?: Partial<ReturnType<typeof commandDrop>>; dropping?: boolean }) =>
    isRename(p.path) ? (
      <div key={p.tkey} className={`nv-ol-edit ${p.indent ? "is-indent" : ""}`}>{inline("r" + p.tkey, "Name", p.label)}</div>
    ) : (
      <div
        key={p.tkey}
        {...(p.drag ?? {})}
        {...(p.drop ?? {})}
        className={`nv-ol-item ${props.activeKey === p.tkey ? "is-active" : ""} ${picked.includes(p.tkey) ? "is-picked" : ""} ${p.indent ? "is-indent" : ""} ${p.dropping ? "is-drop" : ""}`}
        role="button"
        tabIndex={0}
        aria-selected={picked.includes(p.tkey)}
        onClick={(e) => clickRow(e, p.tkey)}
        onKeyDown={(e) => e.key === "Enter" && clickRow(e, p.tkey)}
        onDoubleClick={() => setEditing({ mode: "rename", kind: p.kind, path: p.path, label: p.label })}
        onContextMenu={(e) => openMenu(e, p.kind, p.path, p.label)}
        title={p.kind === "action" ? "Double-click to rename · right-click for more · Ctrl/Cmd or Shift+click to pick several · drag to another stage or Global actions to move · drag into Commands to make a command" : "Double-click to rename · right-click for more · Ctrl/Cmd or Shift+click to pick several · drag into a stage or Global actions to make an action"}
      >
        <span className="nv-ol-dot" style={{ background: p.dot }} />
        <span className="nv-ol-label">{p.label}</span>
        <span className="nv-ol-count">{countFlow(props.counts[p.tkey] ?? 0)}</span>
        <button className="nv-ol-more" title="More" onClick={(e) => openMenu(e, p.kind, p.path, p.label)}>
          ⋯
        </button>
      </div>
    );

  return (
    // focusable, so a click in it takes the keys (Delete with several picked) from the canvas
    <aside className="nv-outliner" tabIndex={-1} onKeyDown={onPanelKey}>
      <button className="nv-ol-collapse" onClick={props.onCollapse} title="Hide the layers panel" aria-label="Hide the layers panel">
        «
      </button>
      <button
        className={`nv-ol-workflow ${props.scope.kind === "workflow" ? "is-active" : ""}`}
        onClick={props.onSelectWorkflow}
        title="Workflow settings, triggers and resources"
      >
        <span className="nv-ol-wf-ico">⚙</span>
        <span className="nv-ol-label">Workflow settings</span>
        <span className="nv-ol-wf-sub">triggers · resources</span>
      </button>
      <div className="nv-ol-search">
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
          <circle cx="7" cy="7" r="4.5" />
          <path d="M10.5 10.5L14 14" />
        </svg>
        <input
          id="nv-search"
          value={props.query}
          placeholder="Search…  ( / )"
          title="Search stages, actions, commands, and the steps inside them (operator names, settings)"
          spellCheck={false}
          onChange={(e) => props.onQuery(e.target.value)}
          onKeyDown={(e) => {
            e.stopPropagation();
            if (e.key === "Escape") {
              props.onQuery("");
              (e.target as HTMLInputElement).blur();
            } else if (e.key === "Enter" && props.results) {
              const r = props.results;
              if (r.steps[0]) props.onOpenStep(r.steps[0].key, r.steps[0].steps[0].path);
              else if (r.actions[0]) props.onSelect(r.actions[0].key);
              else if (r.commands[0]) props.onSelect(r.commands[0].key);
              else if (r.stages[0]) props.onSelectStage(r.stages[0].index);
            }
          }}
        />
        {props.query && (
          <button className="nv-ol-search-x" title="Clear search (Esc)" onClick={() => props.onQuery("")}>
            ×
          </button>
        )}
      </div>
      {props.query.trim() && props.results ? (
        <SearchView results={props.results} activeKey={props.activeKey} onSelect={props.onSelect} onSelectStage={props.onSelectStage} onOpenStep={props.onOpenStep} />
      ) : (
      <>
      {/* Stages */}
      <div className="nv-ol-group">
        <div className="nv-ol-head" onClick={() => props.onToggleCollapse("group:stages")}>
          {chevron("group:stages", "stages")}
          <span className="nv-ol-head-label">Stages</span>
          {wf.stages.length > 0 && !isClosed("group:stages") && (
            <button
              className="nv-ol-add"
              title={allStagesClosed ? "Expand all stages" : "Collapse all stages"}
              onClick={(e) => {
                e.stopPropagation();
                props.onCollapseAll(!allStagesClosed);
              }}
            >
              {allStagesClosed ? "⊞" : "⊟"}
            </button>
          )}
          <button className="nv-ol-add" title="New stage" onClick={(e) => { e.stopPropagation(); startAdd("stage", null); }}>
            ＋
          </button>
        </div>
        {!isClosed("group:stages") && wf.stages.map((st, si) => {
          const spath: Path = ["stages", si];
          return (
            <div key={st.stage || si} className={`nv-ol-stage ${draggingInto(si) ? "is-drop-into" : ""}`} {...actionListDrop(si)}>
              {isRename(spath) ? (
                <div className="nv-ol-edit">{inline("rs" + si, "Stage name", st.label)}</div>
              ) : (
                <div
                  {...dragProps("stage", null, si, `st:${st.stage}`)}
                  className={`nv-ol-stagehead ${props.scope.kind === "stage" && props.scope.index === si ? "is-active" : ""} ${picked.includes(`st:${st.stage}`) ? "is-picked" : ""} ${isDrop("stage", null, si) ? "is-drop" : ""}`}
                  aria-selected={picked.includes(`st:${st.stage}`)}
                  onClick={(e) => {
                    // Ctrl/Cmd or Shift+click picks the stage; a plain click opens or closes it
                    if (e.ctrlKey || e.metaKey || e.shiftKey) return clickRow(e, `st:${st.stage}`);
                    setPicked([]);
                    props.onToggleCollapse(`stage:${st.stage}`);
                  }}
                  title="Click to open or close · double-click or ⚙ for stage settings · right-click to rename · drag to reorder"
                  onDoubleClick={(e) => {
                    if (e.ctrlKey || e.metaKey || e.shiftKey) return;
                    props.onSelectStage(si);
                  }}
                  onContextMenu={(e) => openMenu(e, "stage", spath, st.label)}
                >
                  {chevron(`stage:${st.stage}`, st.label)}
                  <span className="nv-ol-stagedot" style={{ background: st.color || "#7a7a7a" }} />
                  <span className="nv-ol-label">{st.label}</span>
                  {isClosed(`stage:${st.stage}`) && <span className="nv-ol-count">{st.actions.length}</span>}
                  <button
                    className="nv-ol-add nv-ol-gear"
                    title={`${st.label} settings`}
                    onClick={(e) => {
                      e.stopPropagation();
                      props.onSelectStage(si);
                    }}
                  >
                    ⚙
                  </button>
                  <button className="nv-ol-add" title={`New action in ${st.label}`} onClick={(e) => { e.stopPropagation(); startAdd("action", si); }}>
                    ＋
                  </button>
                  <button className="nv-ol-more" title="More" onClick={(e) => { e.stopPropagation(); openMenu(e, "stage", spath, st.label); }}>
                    ⋯
                  </button>
                </div>
              )}
              {!isClosed(`stage:${st.stage}`) && (
              <div
                className={`nv-ol-stage-body ${st.actions.some((a) => props.activeKey === `s:${st.stage}:${a.id}`) ? "has-active" : ""}`}
                style={{ ["--nv-stage-color" as string]: st.color || "#7a7a7a" }}
              >
              {st.actions.map((a, ai) =>
                renderRow({
                  tkey: `s:${st.stage}:${a.id}`,
                  label: a.label,
                  kind: "action",
                  path: ["stages", si, "actions", ai],
                  dot: "#7a7a7a",
                  indent: true,
                  drag: dragProps("action", si, ai, `s:${st.stage}:${a.id}`),
                  dropping: isDrop("action", si, ai) || dropAt === `into:${si}:${ai}`,
                }),
              )}
              {isAdd("action", si) ? (
                <div className="nv-ol-edit is-indent">{inline("aa" + si, "New action name")}</div>
              ) : (
                st.actions.length === 0 && (
                  <button className="nv-ol-empty-add is-indent" onClick={() => startAdd("action", si)}>
                    ＋ Add an action
                  </button>
                )
              )}
              </div>
              )}
              {isClosed(`stage:${st.stage}`) && isAdd("action", si) && (
                <div className="nv-ol-edit is-indent">{inline("aa" + si, "New action name")}</div>
              )}
              {draggingInto(si) && intoActionsHint(si)}
            </div>
          );
        })}
        {isAdd("stage", null) && <div className="nv-ol-edit">{inline("as", "New stage name")}</div>}
        {wf.stages.length === 0 && !isAdd("stage", null) && (
          <button className="nv-ol-empty-add" onClick={() => startAdd("stage", null)}>
            ＋ Add a stage
          </button>
        )}
      </div>

      {/* Global actions (a command dropped here becomes an action too) */}
      <div className={`nv-ol-group ${draggingInto(null) ? "is-drop-into" : ""}`} {...actionListDrop(null)}>
        <div className="nv-ol-head" onClick={() => props.onToggleCollapse("group:global")}>
          {chevron("group:global", "global actions")}
          <span className="nv-ol-head-label">Global actions</span>
          {isClosed("group:global") && <span className="nv-ol-count">{wf.actions.length}</span>}
          <button className="nv-ol-add" title="New global action" onClick={(e) => { e.stopPropagation(); startAdd("action", null); }}>
            ＋
          </button>
        </div>
        {!isClosed("group:global") && wf.actions.map((a, ai) =>
          renderRow({ tkey: `g:${a.id}`, label: a.label, kind: "action", path: ["actions", ai], dot: "#7a7a7a", drag: dragProps("action", null, ai, `g:${a.id}`), dropping: isDrop("action", null, ai) || dropAt === `into:null:${ai}` }),
        )}
        {isAdd("action", null) && <div className="nv-ol-edit">{inline("ag", "New global action name")}</div>}
        {draggingInto(null) && intoActionsHint(null)}
      </div>

      {/* Commands (an action dropped here becomes a command too) */}
      <div className={`nv-ol-group ${draggingIntoCommands ? "is-drop-into" : ""}`} {...commandDrop(null)} onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setDropAt(null); }}>
        <div className="nv-ol-head" onClick={() => props.onToggleCollapse("group:commands")}>
          {chevron("group:commands", "commands")}
          <span className="nv-ol-head-label">Commands</span>
          {isClosed("group:commands") && <span className="nv-ol-count">{wf.commands.length}</span>}
          <button className="nv-ol-add" title="New command" onClick={(e) => { e.stopPropagation(); startAdd("command", null); }}>
            ＋
          </button>
        </div>
        {!isClosed("group:commands") && wf.commands.map((c, ci) =>
          renderRow({ tkey: `c:${c.id}`, label: c.label, kind: "command", path: ["commands", ci], dot: "#1f6e4a", drag: dragProps("command", null, ci, `c:${c.id}`), drop: commandDrop(ci), dropping: dropAt === `command:${ci}` }),
        )}
        {isAdd("command", null) && <div className="nv-ol-edit">{inline("ac", "New command name")}</div>}
        {draggingIntoCommands && <div className="nv-ol-drop-hint">{many(draggedCount, "Drop to copy or move this action into Commands.", "Drop to copy or move # actions into Commands.")}</div>}
      </div>
      </>
      )}

      {ask && (
        <div className="nv-menu-back" onMouseDown={() => setAsk(null)}>
          <div
            className="nv-ctx nv-ask"
            role="dialog"
            aria-label="Copy or move"
            style={{ left: Math.min(ask.x, window.innerWidth - 280), top: Math.min(ask.y, window.innerHeight - 170) }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="nv-ask-title">
              {ask.d.paths.length === 1 ? `1 ${ask.d.kind}` : `${ask.d.paths.length} ${ask.d.kind}s`} to {targetName(ask.target)}
            </div>
            {(() => {
              // a command that reference steps call: moving it removes it, so those steps would stop working
              if (ask.d.kind !== "command") return null;
              const called = ask.d.paths.map((path) => wf.commands[Number(path[1])]).filter((c) => (c?.usageCount ?? 0) > 0);
              if (!called.length) return null;
              return (
                <div className="nv-ask-warn">
                  Move removes {called.map((c) => `${c.label} (called from ${c.usageCount} reference step${c.usageCount === 1 ? "" : "s"})`).join(", ")}. Those steps would stop working.
                </div>
              );
            })()}
            <button className="nv-ctx-item" autoFocus onClick={() => { finish(ask.d, ask.target, false); setAsk(null); }}>
              Copy <small>the originals stay</small>
            </button>
            <button className="nv-ctx-item" onClick={() => { finish(ask.d, ask.target, true); setAsk(null); }}>
              Move <small>the originals go</small>
            </button>
            <button className="nv-ctx-item" onClick={() => setAsk(null)}>Cancel</button>
          </div>
        </div>
      )}
      {menu && (
        <div className="nv-menu-back" onMouseDown={() => setMenu(null)}>
          <div
            className="nv-ctx"
            style={{ left: Math.min(menu.x, window.innerWidth - 180), top: Math.min(menu.y, window.innerHeight - 120) }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {menu.many ? (
              <>
                <div className="nv-ctx-title">{menu.many.length} {menu.kind}s picked</div>
                {menu.kind !== "stage" && (
                  <button
                    className="nv-ctx-item"
                    onClick={() => {
                      const m = menu.many!;
                      setMenu(null);
                      props.onClearError();
                      props.onDuplicateItems(menu.kind as "action" | "command", m.map((x) => x.path));
                      setPicked([]);
                    }}
                  >
                    Duplicate {menu.many.length} {menu.kind}s
                  </button>
                )}
                <button
                  className="nv-ctx-item is-danger"
                  onClick={() => {
                    const m = menu.many!;
                    setMenu(null);
                    setConfirmDelete({ kind: menu.kind, items: m.map((x) => ({ path: x.path, label: x.label })) });
                  }}
                >
                  Delete {menu.many.length} {menu.kind}s
                </button>
                <button className="nv-ctx-item" onClick={() => { setMenu(null); setPicked([]); }}>Clear the picks</button>
              </>
            ) : (<>
            {menu.kind === "stage" && (
              <button
                className="nv-ctx-item"
                onClick={() => {
                  const si = Number(menu.path[1]);
                  setMenu(null);
                  startAdd("action", si);
                }}
              >
                New action in stage
              </button>
            )}
            <button
              className="nv-ctx-item"
              onClick={() => {
                setMenu(null);
                props.onClearError();
                setEditing({ mode: "rename", kind: menu.kind, path: menu.path, label: menu.label });
              }}
            >
              Rename
            </button>
            {menu.kind !== "stage" && (
              <button
                className="nv-ctx-item"
                onClick={() => {
                  setMenu(null);
                  props.onClearError();
                  props.onDuplicate(menu.kind as "action" | "command", menu.path);
                }}
              >
                Duplicate
              </button>
            )}
            <button
              className="nv-ctx-item is-danger"
              onClick={() => {
                setMenu(null);
                props.onDelete(menu.kind, menu.path, menu.label);
              }}
            >
              Delete {menu.kind}
            </button>
            </>)}
          </div>
        </div>
      )}
      {confirmDelete && (
        <div className="nv-menu-back" onMouseDown={() => setConfirmDelete(null)}>
          <div className="nv-ctx nv-ask nv-confirm" role="dialog" aria-label="Delete" style={{ left: 24, top: 120 }} onMouseDown={(e) => e.stopPropagation()} onKeyDown={(e) => { if (e.key === "Escape") setConfirmDelete(null); e.stopPropagation(); }}>
            <div className="nv-ask-title">
              Delete {confirmDelete.items.length === 1 ? `the ${confirmDelete.kind}` : `${confirmDelete.items.length} ${confirmDelete.kind}s`}?
            </div>
            <div className="nv-ask-warn">
              {confirmDelete.items.map((x) => x.label).join(", ")}
              {confirmDelete.kind === "stage" ? ". Their actions and steps go too." : confirmDelete.kind === "action" ? ". Their steps go too." : ". Their steps go too; reference steps that call them stop working."} It's an unsaved change; Ctrl+Z undoes it.
            </div>
            <button className="nv-ctx-item is-danger" autoFocus onClick={() => { deleteNow(confirmDelete.kind, confirmDelete.items); setConfirmDelete(null); }}>
              Delete
            </button>
            <button className="nv-ctx-item" onClick={() => setConfirmDelete(null)}>Cancel</button>
          </div>
        </div>
      )}
    </aside>
  );
}

function InlineName(props: {
  placeholder: string;
  initial: string;
  error: string | null;
  busy: boolean;
  onSubmit: (v: string) => void;
  onCancel: () => void;
}) {
  const [v, setV] = useState(props.initial);
  const ref = useRef<HTMLInputElement>(null);
  const done = useRef(false);
  useEffect(() => {
    ref.current?.focus();
    ref.current?.select();
  }, []);
  return (
    <div className="nv-ol-inline">
      <input
        ref={ref}
        value={v}
        placeholder={props.placeholder}
        disabled={props.busy}
        onChange={(e) => setV(e.target.value)}
        onKeyDown={(e) => {
          e.stopPropagation();
          if (e.key === "Enter") {
            e.preventDefault();
            props.onSubmit(v);
          } else if (e.key === "Escape") {
            e.preventDefault();
            done.current = true;
            props.onCancel();
          }
        }}
        onBlur={() => {
          // Leaving an empty, untouched field just cancels it.
          if (!done.current && !v.trim() && !props.error) props.onCancel();
        }}
      />
      {props.error ? (
        <div className="nv-ol-err">{props.error}</div>
      ) : (
        <div className="nv-ol-hint">{props.busy ? "Creating…" : "Enter to save · Esc to cancel"}</div>
      )}
    </div>
  );
}

/** Search results: stages, actions, commands, and every action/command whose steps match. */
function SearchView(props: {
  results: SearchResults;
  activeKey: string | undefined;
  onSelect: (key: string) => void;
  onSelectStage: (index: number) => void;
  onOpenStep: (treeKey: string, path: Path) => void;
}) {
  const r = props.results;
  if (r.total === 0) return <div className="nv-ol-noresults">No matches.</div>;
  return (
    <div className="nv-ol-results">
      {r.stages.length > 0 && (
        <div className="nv-ol-group">
          <div className="nv-ol-head is-static"><span className="nv-ol-head-label">Stages</span><span className="nv-ol-count">{r.stages.length}</span></div>
          {r.stages.map((st) => (
            <div key={st.stage} className="nv-ol-item" role="button" tabIndex={0} onClick={() => props.onSelectStage(st.index)}>
              <span className="nv-ol-stagedot" style={{ background: st.color || "#7a7a7a" }} />
              <span className="nv-ol-label">{st.label}</span>
              <code className="nv-ol-machine">{st.stage}</code>
            </div>
          ))}
        </div>
      )}
      {r.actions.length > 0 && (
        <div className="nv-ol-group">
          <div className="nv-ol-head is-static"><span className="nv-ol-head-label">Actions</span><span className="nv-ol-count">{r.actions.length}</span></div>
          {r.actions.map((a) => (
            <div key={a.key} className={`nv-ol-item nv-ol-result ${props.activeKey === a.key ? "is-active" : ""}`} role="button" tabIndex={0} onClick={() => props.onSelect(a.key)}>
              <span className="nv-ol-dot" style={{ background: "#7a7a7a" }} />
              <span className="nv-ol-result-text">
                <span className="nv-ol-label">{a.label}</span>
                <span className="nv-ol-where">{a.where} · {a.machine}</span>
              </span>
            </div>
          ))}
        </div>
      )}
      {r.commands.length > 0 && (
        <div className="nv-ol-group">
          <div className="nv-ol-head is-static"><span className="nv-ol-head-label">Commands</span><span className="nv-ol-count">{r.commands.length}</span></div>
          {r.commands.map((c) => (
            <div key={c.key} className={`nv-ol-item ${props.activeKey === c.key ? "is-active" : ""}`} role="button" tabIndex={0} onClick={() => props.onSelect(c.key)}>
              <span className="nv-ol-dot" style={{ background: "#1f6e4a" }} />
              <span className="nv-ol-label">{c.label}</span>
              <code className="nv-ol-machine">{c.machine}</code>
            </div>
          ))}
        </div>
      )}
      {r.steps.length > 0 && (
        <div className="nv-ol-group">
          <div className="nv-ol-head is-static">
            <span className="nv-ol-head-label">Steps in {r.steps.length} {r.steps.length === 1 ? "place" : "places"}</span>
            <span className="nv-ol-count">{r.steps.reduce((n, t) => n + t.steps.length, 0)}</span>
          </div>
          {r.steps.map((t) => (
            <div key={t.key} className="nv-ol-hitgroup">
              <div
                className={`nv-ol-item nv-ol-result ${props.activeKey === t.key ? "is-active" : ""}`}
                role="button"
                tabIndex={0}
                onClick={() => props.onOpenStep(t.key, t.steps[0].path)}
              >
                <span className="nv-ol-dot" style={{ background: t.kind === "command" ? "#1f6e4a" : "#7a7a7a" }} />
                <span className="nv-ol-result-text">
                  <span className="nv-ol-label">{t.label}</span>
                  <span className="nv-ol-where">{t.where}</span>
                </span>
                <span className="nv-ol-badge">{t.steps.length}</span>
              </div>
              {t.steps.slice(0, 5).map((h) => (
                <button key={h.path.join(".")} className="nv-ol-hit" onClick={() => props.onOpenStep(t.key, h.path)} title={`Matched ${h.why}`}>
                  <span className={`nv-ol-hit-title ${h.disabled ? "is-off" : ""}`}>{h.title}</span>
                  <span className="nv-ol-hit-why">{h.why}</span>
                </button>
              ))}
              {t.steps.length > 5 && <div className="nv-ol-hit-more">+{t.steps.length - 5} more</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
