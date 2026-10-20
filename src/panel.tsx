import { useEffect, useRef, useState, type ReactNode } from "react";
import { FormEnvContext, PanelEditor, type FormEnv, type FormError, type LoadedParams } from "./forms";
import { ActionPanel, CommandPanel, StagePanel, WorkflowPanel, type SettingsOps } from "./settings";
import { codeParams, isEmailSummary, operatorName, type NvEdge, type NvNode, type RowAction } from "./layout";
import type { Catalog, CommandView, DraftState, Flow, Path, WorkflowView } from "./types";
import { CHANGELOG } from "./changelog";
import { LogsTab } from "./logs";
import { FormTab, type FormOwner } from "./formtab";

export interface Tree {
  key: string;
  group: string;
  label: string;
  flow: Flow | null;
  taskPath: Path;
  kind: "action" | "command";
  /** Same context name the list view passes when opening files. */
  contextName: string;
  commandId?: string;
  commandName?: string;
}


export function countSteps(f: Flow | null): number {
  if (!f) return 0;
  switch (f.kind) {
    case "operator":
    case "reference":
      return 1;
    case "if":
      return 1 + [...f.whenTrue, ...f.whenFalse].reduce((s, c) => s + countSteps(c), 0);
    case "series":
      return f.children.reduce((s, c) => s + countSteps(c), 0);
    default:
      return 1 + f.children.reduce((s, c) => s + countSteps(c), 0);
  }
}


export function titleOf(f: Flow, catalog: Catalog) {
  if (f.kind === "operator") return f.label || (f.operator ? catalog[f.operator]?.name : "") || "Step";
  if (f.kind === "each") return "For Each";
  if (f.kind === "if") return "If";
  if (f.kind === "parallel") return "Parallel";
  if (f.kind === "reference") return `Command: ${f.label}`;
  return f.label;
}

// ---------------------------------------------------------------------------
// The side panel, laid out like Figma's Design panel: tabs, a compact header
// with icon actions, collapsible sections, borderless fields that outline on
// hover and turn blue on focus, and a draggable left edge.

const PANEL_MIN = 240;
const PANEL_DEFAULT = 320;
const panelMax = () => Math.max(PANEL_MIN, Math.round(window.innerWidth * 0.6));

/** What the panel shows when no node is selected. */
export type PanelScope = { kind: "tree" } | { kind: "stage"; index: number } | { kind: "workflow" };

export function SidePanel(props: {
  scope: PanelScope;
  ops: SettingsOps;
  formEnv: FormEnv;
  onOpenTree: (key: string) => void;
  width: number;
  onResize: (w: number) => void;
  loaded: LoadedParams | null;
  panelErrors: FormError[];
  busy: boolean;
  focusToken: number;
  onCommit: (f: Flow, values: Record<string, string>, delay: number | null) => void;
  wf: WorkflowView;
  tree: Tree | undefined;
  node: NvNode | null;
  edgeSel: NvEdge | null;
  catalog: Catalog;
  onEdit: (f: Flow) => void;
  onDelete: (f: Flow) => void;
  onDuplicate: (f: Flow) => void;
  onEnter: (f: Flow) => void;
  onToggleMock: (f: Flow) => void;
  onRow: (f: Flow, a: RowAction) => void;
  /** steps picked with Shift+click (more than one) */
  multi: Flow[];
  bulk: BulkOps;
  draft: DraftState | undefined;
  onUndo: () => void;
  onSave: () => void;
  onDiscard: () => void;
}) {
  const [tab, setTab] = useState<"design" | "inspect" | "form" | "logs" | "changes">("design");
  const f = props.node?.data.flow;
  const pending = props.draft?.pending ?? 0;
  const owner = props.scope.kind === "tree" ? formOwner(props.wf, props.tree) : null;
  // no form here (a stage or the workflow settings are open): back to Design
  const shown = tab === "form" && !owner ? "design" : tab;
  const tabs = (["design", "inspect", ...(owner ? ["form" as const] : []), "logs", "changes"] as const);
  // the form tab takes two thirds of the window (or more if the panel was made wider)
  const width = shown === "form" ? Math.max(props.width, Math.round(window.innerWidth * 0.66)) : props.width;

  return (
    <aside className={`fg-panel${shown === "form" ? " is-form" : ""}`} style={{ width }}>
      {shown !== "form" && <ResizeHandle width={props.width} onResize={props.onResize} />}
      <div className="fg-tabs" role="tablist">
        {tabs.map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={shown === t}
            className={`fg-tab ${shown === t ? "is-active" : ""}`}
            onClick={() => setTab(t)}
          >
            {t === "design" ? "Design" : t === "inspect" ? "Inspect" : t === "form" ? (owner?.kind === "command" ? "Parameters" : "Form") : t === "logs" ? "Logs" : "Changes"}
            {t === "changes" && pending > 0 && <span className="fg-tab-badge">{pending}</span>}
          </button>
        ))}
      </div>
      <div className="fg-scroll">
        {shown === "form" && owner ? (
          <FormTab key={`${owner.ownerPath.join(".")}`} wfId={props.wf.id} owner={owner} env={props.formEnv} />
        ) : shown === "logs" ? (
          <LogsTab wf={props.wf} tree={props.tree} flow={f} catalog={props.catalog} onOpenTree={props.onOpenTree} />
        ) : shown === "changes" ? (
          <ChangesTab draft={props.draft} wf={props.wf} onUndo={props.onUndo} onSave={props.onSave} onDiscard={props.onDiscard} />
        ) : props.multi.length > 1 ? (
          <MultiPanel flows={props.multi} catalog={props.catalog} bulk={props.bulk} />
        ) : !f ? (
          shown === "inspect" && props.scope.kind !== "workflow" ? (
            <EmptyPanel {...props} />
          ) : props.edgeSel ? (
            <EmptyPanel {...props} />
          ) : props.scope.kind === "workflow" ? (
            <WorkflowPanel wf={props.wf} ops={props.ops} />
          ) : props.scope.kind === "stage" ? (
            <StagePanel wf={props.wf} index={props.scope.index} ops={props.ops} onOpenAction={props.onOpenTree} />
          ) : (
            <TreePanel {...props} />
          )
        ) : shown === "design" ? (
          <DesignTab {...props} f={f} />
        ) : (
          <InspectTab f={f} catalog={props.catalog} />
        )}
      </div>
    </aside>
  );
}

export interface BulkOps {
  remove: (fs: Flow[]) => void;
  mock: (fs: Flow[]) => void;
  duplicate: (fs: Flow[]) => void;
  copy: (fs: Flow[]) => void;
  select: (f: Flow) => void;
  clear: () => void;
}

/** Several steps picked with Shift+click: what they are and what can be done to all of them. */
function MultiPanel(props: { flows: Flow[]; catalog: Catalog; bulk: BulkOps }) {
  const fs = props.flows;
  const allOff = fs.every((f) => f.mock);
  const someOff = fs.some((f) => f.mock);
  return (
    <>
      <div className="fg-head">
        <span className="fg-head-chip fg-multi-chip">{fs.length}</span>
        <div className="fg-head-text">
          <div className="fg-head-title">{fs.length} steps selected</div>
          <div className="fg-head-sub">
            Shift+click to add or remove · Esc to clear{someOff && !allOff ? ` · ${fs.filter((f) => f.mock).length} disabled` : ""}
          </div>
        </div>
      </div>
      <Section title="Apply to all" id="multi-actions">
        <div className="fg-btn-grid">
          <button type="button" className="fg-btn" onClick={() => props.bulk.mock(fs)} title="M">
            {allOff ? "Enable all" : "Disable all"}
          </button>
          <button type="button" className="fg-btn" onClick={() => props.bulk.duplicate(fs)} title="Shift+D">
            Duplicate all
          </button>
          <button type="button" className="fg-btn" onClick={() => props.bulk.copy(fs)} title="Ctrl+C">
            Copy all
          </button>
          <button type="button" className="fg-btn is-danger" onClick={() => props.bulk.remove(fs)} title="X">
            Delete all
          </button>
        </div>
        <p className="fg-hint">Each button is one change — a single Ctrl+Z undoes it for all of them.</p>
      </Section>
      <Section title="Selected" id="multi-list">
        {fs.map((f) => (
          <div key={f.path.join(".")} className="fg-list-row fg-multi-row">
            <button type="button" className="fg-link-row" onClick={() => props.bulk.select(f)} title="Select only this step">
              <span className={f.mock ? "is-off" : ""}>{titleOf(f, props.catalog)}</span>
              <code>{f.kind === "operator" ? f.operator : f.kind}</code>
            </button>
          </div>
        ))}
        <button type="button" className="fg-link" onClick={props.bulk.clear}>
          Clear selection
        </button>
      </Section>
    </>
  );
}

/** The workflow's change log: unsaved edits (newest first) and what's new in the node view. */
function ChangesTab(props: { draft: DraftState | undefined; wf: WorkflowView; onUndo: () => void; onSave: () => void; onDiscard: () => void }) {
  const list = props.draft?.summaries ?? [];
  const pending = props.draft?.pending ?? 0;
  return (
    <>
      <Section title={`Unsaved changes${pending ? ` (${pending})` : ""}`} id="changes-draft">
        {list.length === 0 ? (
          <p className="fg-hint">No unsaved changes in {props.wf.name}. Edits made here or in the list view show up as you make them.</p>
        ) : (
          <>
            {/* the host sends them newest first (at most 12) */}
            <ol className="fg-changes" reversed start={pending}>
              {list.map((s, i) => (
                <li key={pending - i} className={i === 0 ? "is-latest" : ""}>
                  <span className="fg-change-text">{s}</span>
                  {i === 0 && (
                    <button type="button" className="fg-link" onClick={props.onUndo} title="Undo this change (Ctrl+Z)">
                      Undo
                    </button>
                  )}
                </li>
              ))}
            </ol>
            {pending > list.length && <p className="fg-hint">…and {pending - list.length} earlier change{pending - list.length === 1 ? "" : "s"}.</p>}
            <div className="fg-btn-row">
              <button type="button" className="fg-btn" onClick={props.onDiscard}>Discard all</button>
              <button type="button" className="fg-btn is-primary" onClick={props.onSave}>Save to the instance</button>
            </div>
          </>
        )}
      </Section>
      <Section title="What's new in the node view" id="changes-new">
        {CHANGELOG.map((rel, i) => (
          <details key={rel.version} className="fg-release" open={i === 0}>
            <summary>
              <b>{rel.version}</b>
              <span className="fg-release-title">{rel.title}</span>
            </summary>
            <ul>
              {rel.items.map((it, j) => (
                <li key={j}>{it}</li>
              ))}
            </ul>
          </details>
        ))}
      </Section>
    </>
  );
}

function ResizeHandle({ width, onResize }: { width: number; onResize: (w: number) => void }) {
  const start = useRef<{ x: number; w: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  return (
    <div
      className={`fg-resize ${dragging ? "is-dragging" : ""}`}
      title="Drag to resize · double-click to reset"
      onPointerDown={(e) => {
        e.preventDefault();
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
        start.current = { x: e.clientX, w: width };
        setDragging(true);
      }}
      onPointerMove={(e) => {
        if (!start.current) return;
        const w = start.current.w + (start.current.x - e.clientX);
        onResize(Math.min(panelMax(), Math.max(PANEL_MIN, Math.round(w))));
      }}
      onPointerUp={(e) => {
        start.current = null;
        setDragging(false);
        (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
      }}
      onDoubleClick={() => onResize(PANEL_DEFAULT)}
    />
  );
}

/** Figma-style section: uppercase-free title row, optional actions, collapsible. */
function Section(props: {
  title: string;
  id: string;
  actions?: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(() => sectionState.get(props.id) ?? props.defaultOpen ?? true);
  useEffect(() => {
    sectionState.set(props.id, open);
  }, [open, props.id]);
  return (
    <section className={`fg-section ${open ? "" : "is-collapsed"}`}>
      <div className="fg-section-head">
        <button className="fg-section-title" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
          <Chevron open={open} />
          {props.title}
        </button>
        <span className="fg-section-actions">{props.actions}</span>
      </div>
      {open && <div className="fg-section-body">{props.children}</div>}
    </section>
  );
}
const sectionState = new Map<string, boolean>();

function DesignTab(props: Parameters<typeof SidePanel>[0] & { f: Flow }) {
  const { f, catalog } = props;
  const entry = f.kind === "operator" && f.operator ? catalog[f.operator] : undefined;
  const cmd: CommandView | undefined =
    f.kind === "reference" ? props.wf.commands.find((c) => c.id === f.targetId || c.name === f.targetId) : undefined;
  const color = props.node?.data.color ?? "#4f4f4f";
  const files: RowAction[] =
    f.kind === "operator"
      ? [
          ...codeParams(f.operator, catalog).map((c) => ({ kind: "code" as const, ...c })),
          ...f.params
            .filter((p) => isEmailSummary(p.value))
            .map((p) => ({ kind: "email" as const, param: p.key, label: p.label })),
        ]
      : [];
  const kindLabel =
    f.kind === "operator"
      ? entry?.category ?? "Operator"
      : f.kind === "reference"
        ? "Command group"
        : { each: "Loop", if: "Condition", parallel: "Parallel block", series: "Group" }[f.kind];

  return (
    <>
      <div className={`fg-head ${f.mock ? "is-off" : ""}`}>
        <span className="fg-head-chip" style={{ background: color }}>
          <KindIcon kind={f.kind} />
        </span>
        <div className="fg-head-text">
          <div className="fg-head-title" title={titleOf(f, catalog)}>
            {titleOf(f, catalog)}
          </div>
          <div className="fg-head-sub">
            {kindLabel}
            {f.kind === "operator" && f.operator && <code>{f.operator}</code>}
          </div>
        </div>
        <div className="fg-head-actions">
          <IconButton
            label={f.mock ? "Enable step (M)" : "Disable step (M)"}
            active={!!f.mock}
            onClick={() => props.onToggleMock(f)}
          >
            {f.mock ? <EyeOffIcon /> : <EyeIcon />}
          </IconButton>
          <IconButton label="Duplicate (Shift+D)" onClick={() => props.onDuplicate(f)}>
            <CopyIcon />
          </IconButton>
          <IconButton label="Delete (X)" danger onClick={() => props.onDelete(f)}>
            <TrashIcon />
          </IconButton>
        </div>
      </div>

      {f.mock && (
        <div className="fg-banner">
          <EyeOffIcon />
          <span>
            Disabled — skipped when the action runs. <button onClick={() => props.onToggleMock(f)}>Enable</button>
          </span>
        </div>
      )}

      {f.kind === "reference" && (
        <Section title="Command" id="command">
          <div className="fg-row">
            <span className="fg-label">Runs</span>
            <span className="fg-value">{cmd?.label ?? f.targetId ?? "—"}</span>
          </div>
          {cmd && (
            <div className="fg-row">
              <span className="fg-label">Used</span>
              <span className="fg-value">
                {cmd.usageCount} place{cmd.usageCount === 1 ? "" : "s"}
              </span>
            </div>
          )}
          <button className="fg-wide-btn" onClick={() => props.onEnter(f)}>
            Open command <kbd>Tab</kbd>
          </button>
        </Section>
      )}

      {f.kind === "series" ? (
        <Section title="Group" id="group">
          <div className="fg-row">
            <span className="fg-label">Steps</span>
            <span className="fg-value">{f.children.length}</span>
          </div>
          <p className="fg-hint">Groups have no settings. Drag steps onto the wires inside to add them.</p>
        </Section>
      ) : (
        <Section
          title={f.kind === "operator" ? "Parameters" : f.kind === "reference" ? "Parameters" : "Settings"}
          id="params"
          actions={props.busy ? <span className="fg-saving">Saving…</span> : null}
        >
          <FormEnvContext.Provider
            value={{
              ...props.formEnv,
              openCode: (param, label, language) => props.onRow(f, { kind: "code", param, label, language }),
              openEmail: (param, label) => props.onRow(f, { kind: "email", param, label }),
            }}
          >
            <PanelEditor
              key={pathKey(f.path)}
              operator={operatorName(f)}
              catalog={catalog}
              commands={props.wf.commands}
              loaded={props.loaded}
              errors={props.panelErrors}
              busy={props.busy}
              focusToken={props.focusToken}
              onCommit={(values, delay) => props.onCommit(f, values, delay)}
            />
          </FormEnvContext.Provider>
        </Section>
      )}

      {files.length > 0 && (
        <Section title="Code & email" id="files">
          {files.map((a) => (
            <button key={a.kind + a.param} className="fg-file" onClick={() => props.onRow(f, a)}>
              <span className={`fg-file-ico is-${a.kind}`}>{a.kind === "code" ? "</>" : "✉"}</span>
              <span className="fg-file-label">{a.label}</span>
              <span className="fg-file-hint">{a.kind === "code" ? a.language : "preview"}</span>
              <span className="fg-file-go">↗</span>
            </button>
          ))}
        </Section>
      )}

      {entry?.description && (
        <Section title="About" id="about" defaultOpen={false}>
          <p className="fg-hint">{entry.description}</p>
        </Section>
      )}
    </>
  );
}

function InspectTab({ f, catalog }: { f: Flow; catalog: Catalog }) {
  let rows: { k: string; v: string }[] = [];
  if (f.kind === "operator") {
    const secret = new Set((f.operator ? catalog[f.operator]?.params ?? [] : []).filter((p) => p.sensitive).map((p) => p.param));
    rows = f.params.map((p) => ({ k: p.label, v: secret.has(p.key) ? "••••••" : p.value + (p.truncated ? "…" : "") }));
    if (f.delay) rows.unshift({ k: "Delay", v: `${f.delay} ms` });
  } else if (f.kind === "reference") rows = (f.parameterValues ?? []).map((p) => ({ k: p.key, v: p.value }));
  else if (f.kind === "each")
    rows = [
      { k: "Collection", v: f.collection ?? "—" },
      { k: "Concurrency", v: String(f.concurrency ?? 1) },
      { k: "Steps inside", v: String(f.children.length) },
    ];
  else if (f.kind === "parallel")
    rows = [
      { k: "Concurrency", v: String(f.concurrency ?? "all") },
      { k: "Branches", v: String(f.children.length) },
    ];
  else if (f.kind === "if")
    rows = f.condition
      ? [{ k: "Condition", v: `${f.condition.property} ${f.condition.operator} ${f.condition.value}` }]
      : [{ k: "Function", v: f.evaluatorSource ?? "—" }];
  else rows = [{ k: "Steps inside", v: String(f.children.length) }];
  return (
    <>
      <Section title="Step" id="inspect-step">
        <div className="fg-row">
          <span className="fg-label">Type</span>
          <span className="fg-value mono">{f.kind === "operator" ? f.operator : f.kind}</span>
        </div>
        <div className="fg-row">
          <span className="fg-label">Status</span>
          <span className={`fg-value ${f.mock ? "is-off" : ""}`}>{f.mock ? "Disabled (mock: true)" : "Enabled"}</span>
        </div>
        <div className="fg-row is-wide">
          <span className="fg-label">Path</span>
          <span className="fg-value mono">{f.path.join(".")}</span>
        </div>
        {f.kind === "operator" && f.operator && !catalog[f.operator] && Object.keys(catalog).length > 0 && (
          <p className="fg-hint is-warn">This operator isn't in the instance's catalog.</p>
        )}
      </Section>
      <Section title="Values" id="inspect-values">
        {rows.length === 0 && <p className="fg-hint">No values.</p>}
        {rows.map((r, i) => (
          <div key={i} className="fg-row is-wide">
            <span className="fg-label">{r.k}</span>
            <span className="fg-value mono pre">{r.v}</span>
          </div>
        ))}
      </Section>
    </>
  );
}

/** No node selected: the open action's or command's own settings. */
/** The action (its form) or command (its parameters) open in the canvas, if any. */
function formOwner(wf: WorkflowView, t: Tree | undefined): FormOwner | null {
  if (!t) return null;
  if (t.kind === "command") {
    const i = wf.commands.findIndex((c) => c.id === t.commandId);
    const c = wf.commands[i];
    return c ? { kind: "command", title: c.label, ownerPath: ["commands", i], formKey: "parameters", fields: c.parameters ?? [] } : null;
  }
  const path = t.taskPath.slice(0, -1);
  const a = path[0] === "actions" ? wf.actions[Number(path[1])] : wf.stages[Number(path[1])]?.actions[Number(path[3])];
  return a ? { kind: "action", title: a.label, ownerPath: path, formKey: "form", fields: a.form ?? [] } : null;
}

function TreePanel(props: Parameters<typeof SidePanel>[0]) {
  const t = props.tree;
  const wf = props.wf;
  if (t?.kind === "command") {
    const i = wf.commands.findIndex((c) => c.id === t.commandId);
    if (i >= 0) return <CommandPanel wf={wf} command={wf.commands[i]} index={i} ops={props.ops} />;
  } else if (t) {
    const path = t.taskPath.slice(0, -1);
    if (path[0] === "actions") {
      const a = wf.actions[Number(path[1])];
      if (a) return <ActionPanel wf={wf} action={a} path={path} stageLabel={null} contextName={t.contextName} ops={props.ops} />;
    } else {
      const st = wf.stages[Number(path[1])];
      const a = st?.actions[Number(path[3])];
      if (st && a)
        return <ActionPanel wf={wf} action={a} path={path} stageLabel={st.label} contextName={t.contextName} ops={props.ops} />;
    }
  }
  return <EmptyPanel {...props} />;
}

function EmptyPanel(props: Parameters<typeof SidePanel>[0]) {
  if (props.edgeSel)
    return (
      <Section title="Wire" id="wire">
        <p className="fg-hint">
          {props.edgeSel.data?.insert
            ? "Press Shift+A to add a step here, or drag a step onto this wire to move it here."
            : "This wire is fixed — select a step instead."}
        </p>
      </Section>
    );
  const t = props.tree;
  return (
    <>
      <div className="fg-head">
        <span className="fg-head-chip" style={{ background: t?.kind === "command" ? "#1f6e4a" : "#4a4a4a" }}>
          <KindIcon kind={t?.kind === "command" ? "reference" : "series"} />
        </span>
        <div className="fg-head-text">
          <div className="fg-head-title">{t?.label ?? props.wf.name}</div>
          <div className="fg-head-sub">{t?.kind === "command" ? "Reusable command" : t?.group ?? "Workflow"}</div>
        </div>
      </div>
      <Section title="Overview" id="overview">
        <div className="fg-row">
          <span className="fg-label">Steps</span>
          <span className="fg-value">{countSteps(t?.flow ?? null)}</span>
        </div>
        <div className="fg-row">
          <span className="fg-label">Workflow</span>
          <span className="fg-value">{props.wf.name}</span>
        </div>
        <p className="fg-hint">Select a node to edit it. Click a wire to choose where Shift+A adds.</p>
      </Section>
      <Section title="Shortcuts" id="shortcuts" defaultOpen={false}>
        {[
          ["Shift A", "Add step"],
          ["X", "Delete"],
          ["Shift D", "Duplicate"],
          ["M", "Disable / enable"],
          ["Enter", "Edit settings"],
          ["Tab", "Open / leave command"],
          ["Ctrl Z", "Undo"],
          ["N", "Toggle this panel"],
          ["Home", "Fit graph"],
        ].map(([k, d]) => (
          <div key={k} className="fg-row">
            <span className="fg-label">
              <kbd>{k}</kbd>
            </span>
            <span className="fg-value">{d}</span>
          </div>
        ))}
      </Section>
    </>
  );
}

// ---- small pieces -----------------------------------------------------------
const pathKey = (p: Path) => p.join(".");

function IconButton(props: {
  label: string;
  onClick: () => void;
  children: ReactNode;
  active?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      className={`fg-icon-btn ${props.active ? "is-active" : ""} ${props.danger ? "is-danger" : ""}`}
      title={props.label}
      aria-label={props.label}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
}

const svg = { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: 1.3 } as const;
function Chevron({ open }: { open: boolean }) {
  return (
    <svg {...svg} width={10} height={10} style={{ transform: open ? "rotate(90deg)" : "none", transition: "transform .12s" }}>
      <path d="M6 4l4 4-4 4" />
    </svg>
  );
}
function EyeIcon() {
  return (
    <svg {...svg}>
      <path d="M1.5 8s2.4-4.5 6.5-4.5S14.5 8 14.5 8 12.1 12.5 8 12.5 1.5 8 1.5 8z" />
      <circle cx="8" cy="8" r="2" />
    </svg>
  );
}
function EyeOffIcon() {
  return (
    <svg {...svg}>
      <path d="M2.5 5.5C1.9 6.4 1.5 8 1.5 8s2.4 4.5 6.5 4.5c1 0 1.9-.3 2.7-.7M6 3.8c.6-.2 1.3-.3 2-.3 4.1 0 6.5 4.5 6.5 4.5s-.5 1-1.5 2" />
      <path d="M2 2l12 12" />
    </svg>
  );
}
function CopyIcon() {
  return (
    <svg {...svg}>
      <rect x="5" y="5" width="8.5" height="8.5" rx="1.5" />
      <path d="M3 10.5V3.8C3 3.4 3.4 3 3.8 3h6.7" />
    </svg>
  );
}
function TrashIcon() {
  return (
    <svg {...svg}>
      <path d="M2.5 4h11M6 4V2.5h4V4M4 4l.7 9.5h6.6L12 4M6.6 6.5v5M9.4 6.5v5" />
    </svg>
  );
}
function KindIcon({ kind }: { kind: Flow["kind"] }) {
  const p = { ...svg, stroke: "#fff", strokeWidth: 1.4 };
  switch (kind) {
    case "each":
      return (
        <svg {...p}>
          <path d="M3 6a5 5 0 0 1 9-1.5M13 10a5 5 0 0 1-9 1.5" />
          <path d="M12.5 2v3h-3M3.5 14v-3h3" />
        </svg>
      );
    case "if":
      return (
        <svg {...p}>
          <path d="M2 8h4l3-4h5M9 12h5M6 8l3 4" />
        </svg>
      );
    case "parallel":
      return (
        <svg {...p}>
          <path d="M2 8h3M5 8l3-4h6M5 8l3 4h6" />
        </svg>
      );
    case "reference":
      return (
        <svg {...p}>
          <rect x="2.5" y="3" width="11" height="10" rx="1.5" />
          <path d="M5.5 6.5h5M5.5 9.5h3" />
        </svg>
      );
    case "series":
      return (
        <svg {...p}>
          <rect x="1.5" y="5.5" width="4" height="5" rx="1" />
          <rect x="10.5" y="5.5" width="4" height="5" rx="1" />
          <path d="M5.5 8h5" />
        </svg>
      );
    default:
      return (
        <svg {...p}>
          <rect x="2.5" y="3" width="11" height="10" rx="2" />
          <path d="M5 8h6M8 5.5v5" strokeWidth={0} />
          <circle cx="8" cy="8" r="2" />
        </svg>
      );
  }
}
