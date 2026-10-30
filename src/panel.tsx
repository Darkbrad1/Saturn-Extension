import { recordFormOf } from "./recordform";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { FormEnvContext, MultiEditor, PanelEditor, type FormEnv, type FormError, type LoadedParams } from "./forms";
import { ActionPanel, CommandPanel, MultiActionPanel, StagePanel, WorkflowPanel, type SettingsOps } from "./settings";
import { codeParams, isEmailSummary, operatorName, type NvEdge, type NvNode, type RowAction } from "./layout";
import type { Catalog, CommandView, DraftState, Flow, OperatorFlow, Path, SwitchFlow, WorkflowView } from "./types";
import { StoreWritesPanel, type StoreRow } from "./storewrites";
import { switchSteps } from "./types";
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
    case "switch":
      return 1 + switchSteps(f).reduce((s, c) => s + countSteps(c), 0);
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
  if (f.kind === "switch") return "Switch";
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
// the Form / Parameters tab: two thirds of the window at first, dragged between FORM_MIN and 90%
const FORM_MIN = 420;
const formDefault = () => Math.round(window.innerWidth * 0.66);
const formMax = () => Math.max(FORM_MIN, Math.round(window.innerWidth * 0.9));

/** What the panel shows when no node is selected. */
export type PanelScope = { kind: "tree" } | { kind: "stage"; index: number } | { kind: "workflow" };

export function SidePanel(props: {
  scope: PanelScope;
  ops: SettingsOps;
  formEnv: FormEnv;
  onOpenTree: (key: string) => void;
  width: number;
  onResize: (w: number) => void;
  /** the Form tab's own width (null: two thirds of the window) */
  formWidth: number | null;
  onFormResize: (w: number | null) => void;
  loaded: LoadedParams | null;
  panelErrors: FormError[];
  busy: boolean;
  focusToken: number;
  onCommit: (f: Flow, values: Record<string, string>, delay: number | null) => void;
  /** a switch's cases changed (0.3.64): each row's value and the index it came from (null: a new case) */
  onSwitchCases: (f: SwitchFlow, rows: CaseRow[]) => void;
  /** a Write store values step's rows changed (0.3.72) */
  onStoreWrites: (f: OperatorFlow, rows: StoreRow[]) => void;
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
  /** several actions picked in the layers panel (their paths), else null */
  pickedActions: Path[] | null;
  /** steps picked with Shift+click (more than one) */
  multi: Flow[];
  /** the settings of the picked steps, when they're all one operator (read with readNodes), and what to do on a change */
  multiParams: LoadedParams[] | null;
  onCommitMany: (changes: Record<string, string>) => void;
  bulk: BulkOps;
  draft: DraftState | undefined;
  onUndo: () => void;
  onSave: () => void;
  onDiscard: () => void;
  /** folds the panel away (the strip at the window's edge brings it back) */
  onCollapse: () => void;
}) {
  const [tab, setTab] = useState<"design" | "inspect" | "form" | "logs" | "changes">("design");
  const f = props.node?.data.flow;
  const pending = props.draft?.pending ?? 0;
  const owner = props.scope.kind === "tree" ? formOwner(props.wf, props.tree) : null;
  // no form here (a stage or the workflow settings are open): back to Design
  const shown = tab === "form" && !owner ? "design" : tab;
  const tabs = (["design", "inspect", ...(owner ? ["form" as const] : []), "logs", "changes"] as const);
  // the form tab has its own width, two thirds of the window until it's dragged; a Create or Property Updater
  // step's properties (0.3.69) get the same wide panel
  const wide = shown === "form" || (shown === "design" && (props.multi?.length ?? 0) < 2 && f?.kind === "operator" && !!recordFormOf(f.operator, props.catalog));
  const width = wide ? Math.min(formMax(), props.formWidth ?? formDefault()) : props.width;

  return (
    <aside className={`fg-panel${shown === "form" ? " is-form" : ""}${wide ? " is-wide" : ""}`} style={{ width }}>
      {wide ? (
        <ResizeHandle width={width} onResize={props.onFormResize} min={FORM_MIN} max={formMax} reset={() => props.onFormResize(null)} />
      ) : (
        <ResizeHandle width={props.width} onResize={props.onResize} min={PANEL_MIN} max={panelMax} reset={() => props.onResize(PANEL_DEFAULT)} />
      )}
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
        <button className="fg-collapse" onClick={props.onCollapse} title="Hide the panel (N)" aria-label="Hide the panel">
          »
        </button>
      </div>
      <div className="fg-scroll">
        {shown === "form" && owner ? (
          <FormTab key={`${owner.ownerPath.join(".")}`} wfId={props.wf.id} owner={owner} env={props.formEnv} workflowName={props.wf.name} contextName={props.tree?.contextName} />
        ) : shown === "logs" ? (
          <LogsTab wf={props.wf} tree={props.tree} flow={f} catalog={props.catalog} onOpenTree={props.onOpenTree} />
        ) : shown === "changes" ? (
          <ChangesTab draft={props.draft} wf={props.wf} onUndo={props.onUndo} onSave={props.onSave} onDiscard={props.onDiscard} />
        ) : props.pickedActions && pickedActionViews(props.wf, props.pickedActions).length > 1 ? (
          <MultiActionPanel actions={pickedActionViews(props.wf, props.pickedActions)} ops={props.ops} />
        ) : props.multi.length > 1 ? (
          <MultiPanel flows={props.multi} catalog={props.catalog} bulk={props.bulk}>
            {sameOperator(props.multi) && (
              <Section title={`${props.catalog[sameOperator(props.multi)!]?.name ?? sameOperator(props.multi)} settings they share`} id="multi-settings" actions={props.busy ? <span className="fg-saving">Saving…</span> : null}>
                <FormEnvContext.Provider value={props.formEnv}>
                  <MultiEditor
                    key={props.multi.map((f) => pathKey(f.path)).join("|")}
                    operator={sameOperator(props.multi)!}
                    catalog={props.catalog}
                    commands={props.wf.commands}
                    list={props.multiParams}
                    errors={props.panelErrors}
                    busy={props.busy}
                    onCommit={props.onCommitMany}
                  />
                </FormEnvContext.Provider>
              </Section>
            )}
          </MultiPanel>
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
/** The actions at these paths (stages.<i>.actions.<j> or actions.<j>), with where each one is. */
function pickedActionViews(wf: WorkflowView, paths: Path[]) {
  return paths.flatMap((path) => {
    const a = path[0] === "stages" ? wf.stages[Number(path[1])]?.actions[Number(path[3])] : wf.actions[Number(path[1])];
    const where = path[0] === "stages" ? `Stage ${wf.stages[Number(path[1])]?.label ?? ""}` : "Global action";
    return a ? [{ action: a, path, where }] : [];
  });
}

/** The operator every picked step has (all plain operator steps of one kind), else null. */
export function sameOperator(fs: Flow[]): string | null {
  const ops = fs.map((f) => (f.kind === "operator" ? f.operator : null));
  return ops[0] && ops.every((o) => o === ops[0]) ? ops[0] : null;
}

function MultiPanel(props: { flows: Flow[]; catalog: Catalog; bulk: BulkOps; children?: ReactNode }) {
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
            Shift or Ctrl+click to add or remove · drag a box on the canvas · Esc to clear{someOff && !allOff ? ` · ${fs.filter((f) => f.mock).length} disabled` : ""}
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
      {props.children}
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
    </>
  );
}

function ResizeHandle({ width, onResize, min, max, reset }: { width: number; onResize: (w: number) => void; min: number; max: () => number; reset: () => void }) {
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
        onResize(Math.min(max(), Math.max(min, Math.round(w))));
      }}
      onPointerUp={(e) => {
        start.current = null;
        setDragging(false);
        (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
      }}
      onDoubleClick={reset}
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
    f.kind === "operator" && f.storeWrites
      ? "Data · a Parallel in Saturn"
      : f.kind === "operator"
      ? entry?.category ?? "Operator"
      : f.kind === "reference"
        ? "Command group"
        : { each: "Loop", if: "Condition", switch: "Switch", parallel: "Parallel block", series: "Group" }[f.kind];

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
            {f.kind === "operator" && f.operator && !f.storeWrites && <code>{f.operator}</code>}
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

      {entry?.description && (
        <p className="fg-op-desc" title={entry.description}>{entry.description}</p>
      )}

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

      {f.kind === "operator" && f.storeWrites ? (
        <Section title="Store values" id="store-writes" actions={props.busy ? <span className="fg-saving">Saving…</span> : null}>
          <StoreWritesPanel key={pathKey(f.path)} workflowId={props.wf.id} f={f} busy={props.busy} onChange={(rows) => props.onStoreWrites(f, rows)} />
          <p className="fg-hint">Each row is one Write Store step inside a Parallel block, which is how Saturn keeps it. Right-click the card for Show as separate steps.</p>
        </Section>
      ) : f.kind === "series" ? (
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

      {f.kind === "switch" && (
        <Section title="Cases" id="switch-cases" actions={props.busy ? <span className="fg-saving">Saving…</span> : null}>
          <SwitchCases key={pathKey(f.path)} f={f} busy={props.busy} onChange={(rows) => props.onSwitchCases(f, rows)} />
        </Section>
      )}

      {entry?.output && (
        <Section title="Output" id="op-output">
          <p className="fg-hint">
            What the next step gets as <code>_flow</code>
            {entry.output.type ? <> (<code>{entry.output.type === "passthrough" ? "passes its input through" : entry.output.type}</code>)</> : null}.
          </p>
          {entry.output.description && <p className="fg-op-out">{entry.output.description}</p>}
          {entry.output.fields.length > 0 && (
            <div className="fg-op-fields">
              {entry.output.fields.map((fl) => (
                <div key={fl.path} className="fg-op-field">
                  <code>{fl.path}</code>
                  {fl.type && <span className="fg-op-type">{fl.type}</span>}
                  {fl.description && <span className="fg-op-fdesc">{fl.description}</span>}
                </div>
              ))}
            </div>
          )}
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
  else if (f.kind === "switch")
    rows = [
      { k: "Value", v: f.value || "—" },
      { k: "Cases", v: f.cases.map((c) => c.value || "(empty)").join(", ") || "none" },
    ];
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

/** One case as the panel sends it: its value, and the index it had (null for a new one). */
export interface CaseRow {
  value: string;
  from: number | null;
}
/** A switch's cases (0.3.64): each one's value (applied when you leave the box or press Enter), ↑ / ↓ to reorder,
 *  × to remove it with its steps, and a box to add one. Every change is one edit, so Undo takes it back. */
function SwitchCases(props: { f: SwitchFlow; busy: boolean; onChange: (rows: CaseRow[]) => void }) {
  const { f } = props;
  // what was last sent, until the host's answer arrives (so a quick second change builds on the first)
  const lastSent = useRef<CaseRow[] | null>(null);
  const casesKey = JSON.stringify(f.cases.map((c) => c.value));
  useEffect(() => {
    lastSent.current = null;
  }, [casesKey]);
  const rows = (): CaseRow[] => lastSent.current ?? f.cases.map((c, i) => ({ value: c.value, from: i }));
  // values typed and not sent yet, by case index
  const [typed, setTyped] = useState<Record<number, string>>({});
  const [adding, setAdding] = useState("");
  const pending = useRef<{ typed: Record<number, string>; adding: string }>({ typed: {}, adding: "" });
  pending.current = { typed, adding };
  const send = (next: CaseRow[]) => {
    lastSent.current = next;
    setTyped({});
    props.onChange(next);
  };
  /** The typed values (and a typed new case) applied; null when nothing changed. */
  const withTyped = (t: Record<number, string>, add: string): CaseRow[] | null => {
    const next = rows().map((r, i) => (t[i] !== undefined ? { ...r, value: t[i] } : r));
    const before = rows();
    const changed = next.some((r, i) => r.value !== before[i].value);
    if (add.trim()) return [...next, { value: add.trim(), from: null }];
    return changed ? next : null;
  };
  // leaving the panel (another step picked, the panel closed) applies what was typed
  const onChangeRef = useRef(props.onChange);
  onChangeRef.current = props.onChange;
  useEffect(
    () => () => {
      const next = withTyped(pending.current.typed, pending.current.adding);
      if (next) onChangeRef.current(next);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const commit = () => {
    const next = withTyped(typed, "");
    if (next) send(next);
    else setTyped({});
  };
  const move = (i: number, by: number) => {
    const next = withTyped(typed, "") ?? rows();
    const [r] = next.splice(i, 1);
    next.splice(i + by, 0, r);
    send(next);
  };
  const remove = (i: number) => send((withTyped(typed, "") ?? rows()).filter((_, j) => j !== i));
  const add = () => {
    if (!adding.trim()) return;
    const next = withTyped(typed, adding);
    setAdding("");
    if (next) send(next);
  };
  const seen = new Map<string, number>();
  f.cases.forEach((c) => seen.set(c.value, (seen.get(c.value) ?? 0) + 1));
  const otherwiseSteps = f.otherwise.reduce((s, x) => s + countSteps(x), 0);
  const doubled = [...seen].filter(([, n]) => n > 1).map(([v]) => v);
  return (
    <div className="fg-cases" onKeyDown={(e) => e.stopPropagation()}>
      <p className="fg-hint">Runs the first case whose value matches {f.value ? <code>{f.value}</code> : "the value"}; Otherwise when none does.</p>
      {f.cases.map((c, i) => {
        const steps = c.steps.reduce((s, x) => s + countSteps(x), 0);
        return (
          <div key={i} className="fg-case">
            <input
              className="fg-input is-mono"
              aria-label={`Case ${i + 1} value`}
              placeholder="(empty)"
              value={typed[i] ?? c.value}
              disabled={props.busy}
              onChange={(e) => setTyped((t) => ({ ...t, [i]: e.target.value }))}
              onBlur={commit}
              onKeyDown={(e) => {
                if (e.key === "Enter") (e.target as HTMLInputElement).blur();
              }}
            />
            <span className="fg-case-count" title={`${steps} step${steps === 1 ? "" : "s"} in this case`}>{steps}</span>
            <button className="fg-case-btn" title="Move up" aria-label={`Move case ${i + 1} up`} disabled={i === 0 || props.busy} onClick={() => move(i, -1)}>↑</button>
            <button className="fg-case-btn" title="Move down" aria-label={`Move case ${i + 1} down`} disabled={i === f.cases.length - 1 || props.busy} onClick={() => move(i, 1)}>↓</button>
            <button
              className="fg-case-btn is-danger"
              title={steps ? `Remove this case and its ${steps} step${steps === 1 ? "" : "s"} (Undo brings it back)` : "Remove this case"}
              aria-label={`Remove case ${i + 1}`}
              disabled={props.busy}
              onClick={() => remove(i)}
            >
              ×
            </button>
          </div>
        );
      })}
      {doubled.length > 0 && <p className="fg-hint is-warn">Two cases have the value {doubled.map((v) => `“${v || "(empty)"}”`).join(", ")}; only the first one runs.</p>}
      <div className="fg-case is-new">
        <input
          className="fg-input is-mono"
          aria-label="New case value"
          placeholder="New case value"
          value={adding}
          disabled={props.busy}
          onChange={(e) => setAdding(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") add();
          }}
        />
        <button className="fg-btn" disabled={!adding.trim() || props.busy} onClick={add}>Add case</button>
      </div>
      <p className="fg-hint">
        Otherwise: {otherwiseSteps} step{otherwiseSteps === 1 ? "" : "s"}. To add steps to a case, drag them onto its wire on the canvas, or click its + / empty box.
      </p>
    </div>
  );
}

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
    case "switch":
      return (
        <svg {...p}>
          <path d="M2 8h3M5 8l3-5h6M5 8h9M5 8l3 5h6" />
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
