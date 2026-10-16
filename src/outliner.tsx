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
  onClearError: () => void;
}) {
  const { wf } = props;
  const [editing, setEditing] = useState<Editing>(null);
  const [menu, setMenu] = useState<{ x: number; y: number; kind: NodeKind; path: Path; label: string } | null>(null);
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

  // ---- drag to reorder (stages among stages, actions within their list) ----
  const drag = useRef<{ kind: "stage" | "action"; stageIndex: number | null; index: number } | null>(null);
  const [dropAt, setDropAt] = useState<string | null>(null);
  const dragProps = (kind: "stage" | "action", stageIndex: number | null, index: number) => ({
    draggable: true,
    onDragStart: (e: React.DragEvent) => {
      drag.current = { kind, stageIndex, index };
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", `${kind}:${stageIndex}:${index}`);
    },
    onDragEnd: () => {
      drag.current = null;
      setDropAt(null);
    },
    onDragOver: (e: React.DragEvent) => {
      const d = drag.current;
      if (!d || d.kind !== kind || (kind === "action" && d.stageIndex !== stageIndex)) return;
      e.preventDefault();
      setDropAt(`${kind}:${stageIndex}:${index}`);
    },
    onDrop: (e: React.DragEvent) => {
      const d = drag.current;
      drag.current = null;
      setDropAt(null);
      if (!d || d.kind !== kind || d.index === index) return;
      if (kind === "action" && d.stageIndex !== stageIndex) return;
      e.preventDefault();
      if (kind === "stage") props.onMoveStage(d.index, index);
      else props.onMoveAction(stageIndex, d.index, index);
    },
  });
  const isDrop = (kind: string, si: number | null, i: number) => dropAt === `${kind}:${si}:${i}`;

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
    setMenu({ x: e.clientX, y: e.clientY, kind, path, label });
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
  const renderRow = (p: { tkey: string; label: string; kind: NodeKind; path: Path; dot: string; indent?: boolean; drag?: ReturnType<typeof dragProps>; dropping?: boolean }) =>
    isRename(p.path) ? (
      <div key={p.tkey} className={`nv-ol-edit ${p.indent ? "is-indent" : ""}`}>{inline("r" + p.tkey, "Name", p.label)}</div>
    ) : (
      <div
        key={p.tkey}
        {...(p.drag ?? {})}
        className={`nv-ol-item ${props.activeKey === p.tkey ? "is-active" : ""} ${p.indent ? "is-indent" : ""} ${p.dropping ? "is-drop" : ""}`}
        role="button"
        tabIndex={0}
        onClick={() => props.onSelect(p.tkey)}
        onKeyDown={(e) => e.key === "Enter" && props.onSelect(p.tkey)}
        onDoubleClick={() => setEditing({ mode: "rename", kind: p.kind, path: p.path, label: p.label })}
        onContextMenu={(e) => openMenu(e, p.kind, p.path, p.label)}
        title="Double-click to rename · right-click for more"
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
    <aside className="nv-outliner">
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
            <div key={st.stage || si} className="nv-ol-stage">
              {isRename(spath) ? (
                <div className="nv-ol-edit">{inline("rs" + si, "Stage name", st.label)}</div>
              ) : (
                <div
                  {...dragProps("stage", null, si)}
                  className={`nv-ol-stagehead ${props.scope.kind === "stage" && props.scope.index === si ? "is-active" : ""} ${isDrop("stage", null, si) ? "is-drop" : ""}`}
                  onClick={() => props.onToggleCollapse(`stage:${st.stage}`)}
                  title="Click to open or close · ⚙ for stage settings · double-click to rename · drag to reorder"
                  onDoubleClick={() => setEditing({ mode: "rename", kind: "stage", path: spath, label: st.label })}
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
                  drag: dragProps("action", si, ai),
                  dropping: isDrop("action", si, ai),
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

      {/* Global actions */}
      <div className="nv-ol-group">
        <div className="nv-ol-head" onClick={() => props.onToggleCollapse("group:global")}>
          {chevron("group:global", "global actions")}
          <span className="nv-ol-head-label">Global actions</span>
          {isClosed("group:global") && <span className="nv-ol-count">{wf.actions.length}</span>}
          <button className="nv-ol-add" title="New global action" onClick={(e) => { e.stopPropagation(); startAdd("action", null); }}>
            ＋
          </button>
        </div>
        {!isClosed("group:global") && wf.actions.map((a, ai) =>
          renderRow({ tkey: `g:${a.id}`, label: a.label, kind: "action", path: ["actions", ai], dot: "#7a7a7a", drag: dragProps("action", null, ai), dropping: isDrop("action", null, ai) }),
        )}
        {isAdd("action", null) && <div className="nv-ol-edit">{inline("ag", "New global action name")}</div>}
      </div>

      {/* Commands */}
      <div className="nv-ol-group">
        <div className="nv-ol-head" onClick={() => props.onToggleCollapse("group:commands")}>
          {chevron("group:commands", "commands")}
          <span className="nv-ol-head-label">Commands</span>
          {isClosed("group:commands") && <span className="nv-ol-count">{wf.commands.length}</span>}
          <button className="nv-ol-add" title="New command" onClick={(e) => { e.stopPropagation(); startAdd("command", null); }}>
            ＋
          </button>
        </div>
        {!isClosed("group:commands") && wf.commands.map((c, ci) =>
          renderRow({ tkey: `c:${c.id}`, label: c.label, kind: "command", path: ["commands", ci], dot: "#1f6e4a" }),
        )}
        {isAdd("command", null) && <div className="nv-ol-edit">{inline("ac", "New command name")}</div>}
      </div>
      </>
      )}

      {menu && (
        <div className="nv-menu-back" onMouseDown={() => setMenu(null)}>
          <div
            className="nv-ctx"
            style={{ left: Math.min(menu.x, window.innerWidth - 180), top: Math.min(menu.y, window.innerHeight - 120) }}
            onMouseDown={(e) => e.stopPropagation()}
          >
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
            <button
              className="nv-ctx-item is-danger"
              onClick={() => {
                setMenu(null);
                props.onDelete(menu.kind, menu.path, menu.label);
              }}
            >
              Delete {menu.kind}
            </button>
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
