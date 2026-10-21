import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type {
  AccessRule,
  ActionView,
  CommandUsage,
  CommandView,
  FormFieldView,
  Path,
  StageView,
  WorkflowView,
} from "./types";
import {
  ColorChip,
  DateButtons,
  HighlightInput,
  Scrub,
  dateModeOf,
  describeDate,
  scrubOf,
  type HlLang,
} from "./controls";

// ---------------------------------------------------------------------------
// Settings for the things around the flows — stages, actions, commands and the
// workflow itself (triggers, resource hooks) — matching what the list view
// lets you change. Shown in the side panel when no node is selected.

export interface AccessSubjects {
  groups: { id: string; name: string; description?: string | null }[];
  users: { id: string; name: string; email?: string | null }[];
  permissions: { id: string; name: string; description?: string | null }[];
  error: string | null;
}
export interface TriggerProviderParam {
  key: string;
  label: string;
  type: string;
  defaultValue: string;
  description: string | null;
  choices: string[];
  lookupResource: string | null;
  secret: boolean;
  showWhen: { param: string; equals: string } | null;
}
export interface TriggerProvider {
  id: string;
  name: string;
  description: string | null;
  params: TriggerProviderParam[];
}
export interface TriggerRow {
  id: string;
  provider: string;
  providerName: string;
  status: string | null;
  actions: string[];
  configuration: Record<string, unknown>;
  summary: string;
  pending?: unknown;
}
export interface TriggersState {
  workflowId: string;
  rows: TriggerRow[];
  catalog: TriggerProvider[];
  instanceUrl: string;
  offline: boolean;
  queued: number;
  loading: boolean;
  error: string;
}
export interface Binding {
  recordId: string | null;
  resource: string;
  workflowId: string | null;
  boundedProperty: string | null;
  hooks: { op: string; when: string; entries: { actionId: string; workflowId: string | null; source: string | null }[] }[];
  duplicate: boolean;
}

/** Everything the settings panels can ask the extension to do. */
export interface SettingsOps {
  /** opens a resource on the Resources screen */
  openResource: (resource: string) => void;
  busy: boolean;
  error: string | null;
  clearError: () => void;
  rename: (kind: "stage" | "action" | "command", path: Path, label: string, machineName?: string, color?: string) => void;
  deleteNode: (kind: "stage" | "action" | "command", path: Path) => void;
  moveStage: (from: number, to: number) => void;
  moveAction: (stageIndex: number | null, from: number, to: number) => void;
  createAction: (stageIndex: number | null) => void;
  createField: (ownerPath: Path, formKey: string, label: string, type: string, required: boolean) => void;
  updateField: (
    ownerPath: Path,
    formKey: string,
    key: string,
    label: string,
    newKey: string | undefined,
    type: string,
    required: boolean,
  ) => void;
  deleteField: (ownerPath: Path, formKey: string, key: string) => void;
  /** change any of a field's other settings (path into the field object) */
  setFieldProps: (ownerPath: Path, formKey: string, key: string, changes: FieldChange[]) => void;
  subjects: AccessSubjects | null;
  loadSubjects: () => void;
  setAccess: (path: Path, rules: { method: string; data: string[] }[]) => void;
  openAccessFunction: (path: Path, contextName: string) => void;
  openUsage: (u: CommandUsage) => void;
  // workflow
  openInInstance: () => void;
  viewRaw: () => void;
  reload: () => void;
  revealOffline: () => void;
  deleteWorkflow: () => void;
  triggers: TriggersState | null;
  triggerBusy: boolean;
  triggerError: string | null;
  refreshTriggers: () => void;
  saveTrigger: (t: { id?: string; provider: string; values: Record<string, string>; actions: string[] }) => void;
  deleteTrigger: (t: TriggerRow) => void;
  bindings: Binding[] | null;
  bindingSaved: string;
  hookBusy: boolean;
  setHook: (h: { resource: string; actionId: string; op: string; when: string; remove?: boolean }) => void;
  connection: { offline: boolean; pending: { workflowId: string; workflowName: string; edits: number }[] } | null;
}

export interface FieldChange {
  path: (string | number)[];
  value?: unknown;
  remove?: boolean;
}

// ---- small shared pieces ----------------------------------------------------
export function Section(props: {
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
          <svg width={10} height={10} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5}
            style={{ transform: open ? "rotate(90deg)" : "none", transition: "transform .12s" }}>
            <path d="M6 4l4 4-4 4" />
          </svg>
          {props.title}
        </button>
        <span className="fg-section-actions">{props.actions}</span>
      </div>
      {open && <div className="fg-section-body">{props.children}</div>}
    </section>
  );
}
const sectionState = new Map<string, boolean>();

export function Row({ label, children, wide }: { label: string; children: ReactNode; wide?: boolean }) {
  return (
    <div className={`fg-row ${wide ? "is-wide" : ""}`}>
      <span className="fg-label">{label}</span>
      <span className="fg-value">{children}</span>
    </div>
  );
}

/** A text input that applies on Enter / blur and reverts on Esc (Figma-style). */
export function CommitInput(props: {
  value: string;
  placeholder?: string;
  mono?: boolean;
  lang?: HlLang;
  onCommit: (v: string) => void;
}) {
  const [v, setV] = useState(props.value);
  const vRef = useRef(v);
  vRef.current = v;
  useEffect(() => setV(props.value), [props.value]);
  const done = () => {
    if (vRef.current.trim() !== props.value) props.onCommit(vRef.current.trim());
  };
  return (
    <HighlightInput
      className={`fg-input ${props.mono ? "is-mono" : ""}`}
      mono={props.mono}
      lang={props.lang}
      value={v}
      placeholder={props.placeholder}
      onChange={setV}
      onBlur={done}
      onKeyDown={(e) => {
        e.stopPropagation();
        if (e.key === "Enter") (e.target as HTMLInputElement).blur();
        if (e.key === "Escape") {
          setV(props.value);
          vRef.current = props.value;
          setTimeout(() => (e.target as HTMLInputElement).blur());
        }
      }}
    />
  );
}

function ErrorLine({ text }: { text: string | null }) {
  return text ? <div className="fg-error">{text}</div> : null;
}

function Btn(props: { children: ReactNode; onClick: () => void; kind?: "primary" | "danger"; disabled?: boolean; title?: string }) {
  return (
    <button
      className={`fg-btn ${props.kind ? `is-${props.kind}` : ""}`}
      onClick={props.onClick}
      disabled={props.disabled}
      title={props.title}
      type="button"
    >
      {props.children}
    </button>
  );
}

// ---- name + machine name -------------------------------------------------------
const MACHINE_HINT = {
  stage: "what a record's status holds",
  action: "how a trigger names this action",
  command: "how this command is referenced",
};
function NameSection(props: {
  kind: "stage" | "action" | "command";
  path: Path;
  label: string;
  machineName: string;
  ops: SettingsOps;
  extra?: ReactNode;
}) {
  return (
    <Section title="Name" id={`name-${props.kind}`}>
      <div className="fg-row">
        <span className="fg-label">Label</span>
        <CommitInput value={props.label} onCommit={(v) => v && props.ops.rename(props.kind, props.path, v)} />
      </div>
      <div className="fg-row">
        <span className="fg-label">Machine name</span>
        <CommitInput
          mono
          value={props.machineName}
          onCommit={(v) => v && props.ops.rename(props.kind, props.path, props.label, v)}
        />
      </div>
      <p className="fg-hint">
        The machine name is {MACHINE_HINT[props.kind]} — changing it can break anything that uses the old one.
      </p>
      {props.extra}
      <ErrorLine text={props.ops.error} />
    </Section>
  );
}

// ---- colour ------------------------------------------------------------------
const COLORS = [
  "#64748b", "#6b7280", "#0ea5e9", "#3b82f6", "#6366f1", "#a855f7", "#ec4899", "#f43f5e",
  "#ef4444", "#f97316", "#f59e0b", "#eab308", "#84cc16", "#22c55e", "#10b981", "#14b8a6",
];
function normHex(v: string): string | null {
  const t = v.trim().replace(/^#/, "").toLowerCase();
  if (/^[0-9a-f]{3}$/.test(t)) return `#${t[0]}${t[0]}${t[1]}${t[1]}${t[2]}${t[2]}`;
  if (/^[0-9a-f]{6}$/.test(t)) return `#${t}`;
  return null;
}
function ColorPicker(props: { value: string; onPick: (c: string) => void }) {
  const [hex, setHex] = useState(props.value);
  useEffect(() => setHex(props.value), [props.value]);
  return (
    <div className="fg-colors">
      <div className="fg-swatches">
        <button
          type="button"
          className={`fg-swatch is-none ${!props.value ? "is-on" : ""}`}
          title="No colour"
          onClick={() => props.onPick("")}
        />
        {COLORS.map((c) => (
          <button
            key={c}
            type="button"
            className={`fg-swatch ${props.value.toLowerCase() === c ? "is-on" : ""}`}
            style={{ background: c }}
            title={c}
            onClick={() => props.onPick(c)}
          />
        ))}
      </div>
      <div className="fg-row">
        <span className="fg-label">Hex</span>
        <span className="fg-hex">
          <ColorChip
            value={normHex(hex) ?? props.value}
            allowNone
            title="Open the colour picker"
            onChange={(c) => setHex(c)}
            onCommit={(c) => {
              setHex(c);
              if (c !== props.value) props.onPick(c);
            }}
          />
          <HighlightInput
            className="fg-input is-mono"
            mono
            value={hex}
            placeholder="#0ea5e9"
            title="Colour as hex"
            onChange={setHex}
            onKeyDown={(e) => {
              e.stopPropagation();
              if (e.key === "Enter") (e.target as HTMLInputElement).blur();
            }}
            onBlur={() => {
              const n = hex.trim() === "" ? "" : normHex(hex);
              if (n !== null && n !== props.value) props.onPick(n);
              else setHex(props.value);
            }}
          />
        </span>
      </div>
    </div>
  );
}

// ---- stage -----------------------------------------------------------------------
export function StagePanel(props: { wf: WorkflowView; index: number; ops: SettingsOps; onOpenAction: (key: string) => void }) {
  const st: StageView | undefined = props.wf.stages[props.index];
  if (!st) return <p className="fg-hint fg-pad">That stage is gone.</p>;
  const path: Path = ["stages", props.index];
  const n = props.wf.stages.length;
  return (
    <>
      <PanelHead color={st.color || "#7a7a7a"} title={st.label} sub={`Stage · ${st.stage}`} round />
      <NameSection kind="stage" path={path} label={st.label} machineName={st.stage} ops={props.ops} />
      <Section title="Colour" id="stage-colour">
        <ColorPicker value={st.color ?? ""} onPick={(c) => props.ops.rename("stage", path, st.label, undefined, c)} />
      </Section>
      <Section
        title={`Actions (${st.actions.length})`}
        id="stage-actions"
        actions={<button className="fg-plus" title="New action in this stage" onClick={() => props.ops.createAction(props.index)}>＋</button>}
      >
        {st.actions.length === 0 && <p className="fg-hint">No actions yet.</p>}
        {st.actions.map((a, i) => (
          <div key={a.id} className="fg-list-row">
            <button className="fg-link-row" onClick={() => props.onOpenAction(`s:${st.stage}:${a.id}`)}>
              {a.label}
              <code>{a.action}</code>
            </button>
            <span className="fg-row-tools">
              <button title="Move up" disabled={i === 0} onClick={() => props.ops.moveAction(props.index, i, i - 1)}>↑</button>
              <button title="Move down" disabled={i === st.actions.length - 1} onClick={() => props.ops.moveAction(props.index, i, i + 1)}>↓</button>
            </span>
          </div>
        ))}
      </Section>
      <Section title="Order" id="stage-order">
        <div className="fg-btn-row">
          <Btn disabled={props.index === 0} onClick={() => props.ops.moveStage(props.index, props.index - 1)}>Move up</Btn>
          <Btn disabled={props.index === n - 1} onClick={() => props.ops.moveStage(props.index, props.index + 1)}>Move down</Btn>
        </div>
        <p className="fg-hint">Position {props.index + 1} of {n}. You can also drag stages in the layers panel.</p>
      </Section>
      <Section title="Danger zone" id="stage-danger" defaultOpen={false}>
        <Btn kind="danger" onClick={() => props.ops.deleteNode("stage", path)}>Delete stage</Btn>
        <p className="fg-hint">Any record whose status is “{st.stage}” will point at a stage that no longer exists.</p>
      </Section>
    </>
  );
}

// ---- action ----------------------------------------------------------------------
export function ActionPanel(props: {
  wf: WorkflowView;
  action: ActionView;
  path: Path; // ["stages", i, "actions", j] or ["actions", j]
  stageLabel: string | null;
  contextName: string;
  ops: SettingsOps;
}) {
  const a = props.action;
  return (
    <>
      <PanelHead color="#4a4a4a" title={a.label} sub={props.stageLabel ? `Action · Stage ${props.stageLabel}` : "Global action"} />
      <NameSection kind="action" path={props.path} label={a.label} machineName={a.action} ops={props.ops} />
      <AccessSection action={a} path={props.path} contextName={props.contextName} ops={props.ops} />
      <Section title="Form" id="action-form">
        <Row label="Fields">{(a.form ?? []).length}</Row>
        <p className="fg-hint">Edit them in the Form tab above.</p>
      </Section>
      <Section title="Details" id="action-details" defaultOpen={false}>
        <Row label="Performed by">{a.actorLabel ?? "Everyone"}</Row>
        <Row label="Batch action">{a.isBatchAction ? "Yes" : "No"}</Row>
        {a.confirmMessage && <Row label="Confirm" wide>{a.confirmMessage}</Row>}
        <Row label="Id"><code>{a.id}</code></Row>
      </Section>
      <Section title="Danger zone" id="action-danger" defaultOpen={false}>
        <Btn kind="danger" onClick={() => props.ops.deleteNode("action", props.path)}>Delete action</Btn>
      </Section>
    </>
  );
}

// ---- command -----------------------------------------------------------------------
export function CommandPanel(props: { wf: WorkflowView; command: CommandView; index: number; ops: SettingsOps }) {
  const c = props.command;
  const path: Path = ["commands", props.index];
  return (
    <>
      <PanelHead color="#1f6e4a" title={c.label} sub="Reusable command" />
      <NameSection kind="command" path={path} label={c.label} machineName={c.name} ops={props.ops} />
      <Section title="Parameters" id="command-params">
        <Row label="Parameters">{(c.parameters ?? []).length}</Row>
        <p className="fg-hint">Edit them in the Parameters tab above.</p>
      </Section>
      <Section title={`Used in (${c.usageCount ?? 0})`} id="command-usages">
        {(c.usages ?? []).length === 0 && <p className="fg-hint">Nothing references this command yet.</p>}
        {(c.usages ?? []).map((u, i) => (
          <button key={i} className="fg-link-row" onClick={() => props.ops.openUsage(u)} title="Go to this reference">
            {u.label}
            <code>{u.pathLabel}</code>
          </button>
        ))}
      </Section>
      <Section title="Danger zone" id="command-danger" defaultOpen={false}>
        <Btn kind="danger" onClick={() => props.ops.deleteNode("command", path)}>Delete command</Btn>
        {(c.usageCount ?? 0) > 0 && <p className="fg-hint">It is referenced {c.usageCount} time{c.usageCount === 1 ? "" : "s"}; those references will break.</p>}
      </Section>
    </>
  );
}

// ---- access control ---------------------------------------------------------------
const ACCESS_METHODS = [
  { method: "user_group", label: "User Group", source: "groups" as const, hint: "Anyone in a ticked group may perform the action." },
  { method: "user", label: "User", source: "users" as const, hint: "Named individuals." },
  { method: "permission", label: "Permission", source: "permissions" as const, hint: "Anyone whose group grants a ticked permission." },
  { method: "function", label: "Custom Function", source: null, hint: "A JavaScript expression over the resource. Returns true to allow." },
];
const FUNCTION_TEMPLATE = `(res) => {
  //your code comes here
  return true
}`;

function AccessSection(props: { action: ActionView; path: Path; contextName: string; ops: SettingsOps }) {
  const rules = props.action.access ?? [];
  const [editing, setEditing] = useState(false);
  const prevBusy = useRef(props.ops.busy);
  useEffect(() => {
    if (prevBusy.current && !props.ops.busy && !props.ops.error) setEditing(false);
    prevBusy.current = props.ops.busy;
  }, [props.ops.busy, props.ops.error]);
  return (
    <Section
      title="Access"
      id="action-access"
      actions={
        !editing && (
          <button className="fg-plus" title="Configure who may perform this action" onClick={() => { props.ops.clearError(); props.ops.loadSubjects(); setEditing(true); }}>
            ✎
          </button>
        )
      }
    >
      {!editing ? (
        <>
          {rules.length === 0 && <p className="fg-hint">Everyone can perform this action.</p>}
          {rules.map((r, i) => (
            <Row key={i} label={r.label ?? r.method}>
              {r.method === "function" ? "custom function" : r.data.length ? `${r.data.length} selected` : "none"}
            </Row>
          ))}
        </>
      ) : (
        <AccessEditor
          rules={rules}
          ops={props.ops}
          onCancel={() => setEditing(false)}
          onSave={(next) => props.ops.setAccess(props.path, next)}
          onOpenFunction={() => props.ops.openAccessFunction(props.path, props.contextName)}
        />
      )}
    </Section>
  );
}

function AccessEditor(props: {
  rules: AccessRule[];
  ops: SettingsOps;
  onSave: (rules: { method: string; data: string[] }[]) => void;
  onCancel: () => void;
  onOpenFunction: () => void;
}) {
  const [draft, setDraft] = useState<Record<string, string[]>>(() =>
    Object.fromEntries(props.rules.map((r) => [r.method, [...r.data]])),
  );
  const [on, setOn] = useState<Record<string, boolean>>(() => Object.fromEntries(props.rules.map((r) => [r.method, true])));
  const [query, setQuery] = useState<Record<string, string>>({});
  const unknown = props.rules.filter((r) => !ACCESS_METHODS.some((m) => m.method === r.method));
  const subjects = props.ops.subjects;
  const save = () => {
    const out: { method: string; data: string[] }[] = [];
    for (const m of ACCESS_METHODS) {
      if (!on[m.method]) continue;
      const data = (draft[m.method] ?? []).filter((x) => x.trim() !== "");
      if (m.method === "function" ? data.length > 0 : data.length > 0) out.push({ method: m.method, data });
    }
    for (const r of unknown) out.push({ method: r.method, data: r.data });
    props.onSave(out);
  };
  return (
    <div className="fg-access" onKeyDown={(e) => e.stopPropagation()}>
      {subjects?.error && <p className="fg-hint is-warn">{subjects.error}</p>}
      {ACCESS_METHODS.map((m) => {
        const picked = draft[m.method] ?? [];
        const list = m.source && subjects ? subjects[m.source] : [];
        const q = (query[m.method] ?? "").toLowerCase();
        const shown = list.filter((s) => !q || `${s.name} ${s.id}`.toLowerCase().includes(q));
        return (
          <div key={m.method} className={`fg-access-method ${on[m.method] ? "is-on" : ""}`}>
            <label className="fg-check">
              <input
                type="checkbox"
                checked={!!on[m.method]}
                onChange={(e) => {
                  setOn({ ...on, [m.method]: e.target.checked });
                  if (e.target.checked && m.method === "function" && !(draft.function ?? [])[0])
                    setDraft({ ...draft, function: [FUNCTION_TEMPLATE] });
                }}
              />
              <b>{m.label}</b>
              {on[m.method] && m.source && <span className="fg-count">{picked.length} selected</span>}
            </label>
            {on[m.method] && (
              <div className="fg-access-body">
                <p className="fg-hint">{m.hint}</p>
                {m.source ? (
                  !subjects ? (
                    <p className="fg-hint">Loading…</p>
                  ) : (
                    <>
                      {list.length > 8 && (
                        <HighlightInput
                          className="fg-input"
                          placeholder={`Search ${list.length} ${m.label.toLowerCase()}s`}
                          value={query[m.method] ?? ""}
                          onChange={(v) => setQuery({ ...query, [m.method]: v })}
                        />
                      )}
                      <div className="fg-checklist">
                        {shown.map((s) => (
                          <label key={s.id} className="fg-check" title={s.id}>
                            <input
                              type="checkbox"
                              checked={picked.includes(s.id)}
                              onChange={(e) =>
                                setDraft({
                                  ...draft,
                                  [m.method]: e.target.checked ? [...picked, s.id] : picked.filter((x) => x !== s.id),
                                })
                              }
                            />
                            <span>{s.name}</span>
                          </label>
                        ))}
                        {list.length === 0 && <span className="fg-hint">None on this instance.</span>}
                      </div>
                    </>
                  )
                ) : (
                  <>
                    <HighlightInput
                      multiline
                      mono
                      lang="javascript"
                      className="fg-code"
                      rows={5}
                      value={picked[0] ?? ""}
                      onChange={(v) => setDraft({ ...draft, function: [v] })}
                    />
                    <button className="fg-link" onClick={props.onOpenFunction} title="Open as a real .js file — saving it writes back to the instance">
                      Open in editor ↗
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        );
      })}
      {unknown.map((r) => (
        <p key={r.method} className="fg-hint">
          “{r.label ?? r.method}” rule is kept as it is — configure it in the instance's web app.
        </p>
      ))}
      <ErrorLine text={props.ops.error} />
      <div className="fg-btn-row">
        <Btn onClick={props.onCancel}>Cancel</Btn>
        <Btn kind="primary" disabled={props.ops.busy} onClick={save}>{props.ops.busy ? "Saving…" : "Save access"}</Btn>
      </div>
    </div>
  );
}

// ---- workflow ----------------------------------------------------------------------
export function WorkflowPanel(props: { wf: WorkflowView; ops: SettingsOps }) {
  const { wf, ops } = props;
  const actionCount = wf.stages.reduce((s, x) => s + x.actions.length, 0) + wf.actions.length;
  return (
    <>
      <PanelHead color="#3c4a5a" title={wf.name} sub={`Workflow · ${wf.id}`} />
      {ops.connection?.offline && (
        <div className="fg-banner">
          <span>
            The instance is unreachable — edits are saved offline
            {ops.connection.pending.length ? ` (${ops.connection.pending.reduce((s, p) => s + p.edits, 0)} waiting)` : ""}.{" "}
            <button onClick={ops.revealOffline}>Show the offline copies</button>
          </span>
        </div>
      )}
      <Section title="Workflow" id="wf-info">
        <Row label="Status">{wf.status ?? "—"}</Row>
        <Row label="Stages">{wf.stages.length}</Row>
        <Row label="Actions">{actionCount}</Row>
        <Row label="Commands">{wf.commands.length}</Row>
        {wf.updatedAt && <Row label="Updated">{new Date(wf.updatedAt).toLocaleString()}</Row>}
        <div className="fg-btn-row is-wrap">
          <Btn onClick={ops.openInInstance} title="Open this workflow in the instance">Open in Sonover ↗</Btn>
          <Btn onClick={ops.viewRaw}>Open raw JSON</Btn>
          <Btn onClick={ops.reload} title="Reload this workflow">Reload</Btn>
          <Btn onClick={ops.revealOffline} title="Show the offline copies in your file browser">Offline copies</Btn>
        </div>
      </Section>
      <LinkedSection wf={wf} ops={ops} />
      <TriggersSection wf={wf} ops={ops} />
      <ResourcesSection wf={wf} ops={ops} />
      <Section title="Danger zone" id="wf-danger" defaultOpen={false}>
        <Btn kind="danger" onClick={ops.deleteWorkflow}>Delete this workflow</Btn>
        <p className="fg-hint">Dangerous, and cannot be undone. VS Code asks you to confirm.</p>
      </Section>
    </>
  );
}

const CRON_PRESETS = [
  { label: "Every 5 minutes", expression: "*/5 * * * *" },
  { label: "Hourly", expression: "0 * * * *" },
  { label: "Daily at 08:00", expression: "0 8 * * *" },
  { label: "Weekdays at 09:00", expression: "0 9 * * 1-5" },
  { label: "Mondays at 09:00", expression: "0 9 * * 1" },
];
export function describeCron(expr: string): string | null {
  const a = expr.trim().split(/\s+/);
  const [m, h, dom, mon, dow] = a.length === 6 ? a.slice(1) : a;
  if (!m || !h) return null;
  const any = (x?: string) => x === "*" || x === "?" || x === undefined;
  const every = /^\*\/(\d+)$/.exec(m);
  if (every && any(h) && any(dom) && any(mon) && any(dow)) return `Every ${every[1]} minutes.`;
  if (m === "*" && any(h)) return "Every minute.";
  if (/^\d+$/.test(m) && h === "*") return `At ${m} minutes past every hour.`;
  if (/^\d+$/.test(m) && /^\d+$/.test(h)) {
    const t = `${h.padStart(2, "0")}:${m.padStart(2, "0")}`;
    if (any(dom) && any(mon) && any(dow)) return `Every day at ${t}.`;
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    if (any(dom) && any(mon) && /^\d$/.test(dow!)) return `Every ${days[Number(dow)] ?? dow} at ${t}.`;
    if (any(dom) && any(mon) && dow === "1-5") return `Every weekday at ${t}.`;
  }
  return null;
}

function TriggersSection(props: { wf: WorkflowView; ops: SettingsOps }) {
  const { ops, wf } = props;
  const t = ops.triggers && ops.triggers.workflowId === wf.id ? ops.triggers : null;
  const [editing, setEditing] = useState<TriggerRow | "new" | null>(null);
  const prevBusy = useRef(ops.triggerBusy);
  useEffect(() => {
    if (prevBusy.current && !ops.triggerBusy && !ops.triggerError) setEditing(null);
    prevBusy.current = ops.triggerBusy;
  }, [ops.triggerBusy, ops.triggerError]);
  const actionLabel = (id: string) => wf.actions.find((a) => a.id === id)?.label ?? id;
  return (
    <Section
      title={`Triggers${t ? ` (${t.rows.length})` : ""}`}
      id="wf-triggers"
      actions={
        <>
          <button className="fg-plus" title="Refresh triggers" onClick={ops.refreshTriggers}>⟳</button>
          <button className="fg-plus" title="Add a trigger" disabled={!t || t.catalog.length === 0} onClick={() => setEditing("new")}>＋</button>
        </>
      }
    >
      {!t || t.loading ? (
        <p className="fg-hint">Reading triggers…</p>
      ) : t.error ? (
        <p className="fg-hint is-warn">{t.error}</p>
      ) : (
        <>
          {t.offline && <p className="fg-hint is-warn">Offline — showing the last copy read{t.queued ? `, ${t.queued} change(s) queued` : ""}.</p>}
          {t.rows.length === 0 && editing !== "new" && (
            <p className="fg-hint">Nothing starts this workflow yet. A trigger runs one or more of the workflow's global actions.</p>
          )}
          {t.rows.map((r) =>
            editing !== "new" && editing?.id === r.id ? (
              <TriggerEditor key={r.id} wf={wf} state={t} editing={r} ops={ops} onCancel={() => setEditing(null)} />
            ) : (
              <div key={r.id} className="fg-trigger">
                <div className="fg-trigger-main">
                  <span className="fg-trigger-name">
                    {r.summary || r.providerName}
                    {r.status && r.status !== "active" && <span className="fg-badge">{r.status}</span>}
                    {r.pending ? <span className="fg-badge is-amber">queued</span> : null}
                  </span>
                  <span className="fg-trigger-sub">{r.actions.length ? r.actions.map(actionLabel).join(", ") : "runs nothing"}</span>
                </div>
                <span className="fg-row-tools">
                  <button title="Edit this trigger" onClick={() => setEditing(r)}>✎</button>
                  <button title="Delete this trigger" onClick={() => ops.deleteTrigger(r)}>×</button>
                </span>
              </div>
            ),
          )}
          {editing === "new" && <TriggerEditor wf={wf} state={t} ops={ops} onCancel={() => setEditing(null)} />}
        </>
      )}
    </Section>
  );
}

function TriggerEditor(props: {
  wf: WorkflowView;
  state: TriggersState;
  editing?: TriggerRow;
  ops: SettingsOps;
  onCancel: () => void;
}) {
  const { state, editing } = props;
  const [provider, setProvider] = useState(editing?.provider ?? state.catalog[0]?.id ?? "");
  const [actions, setActions] = useState<string[]>(editing?.actions ?? []);
  const [byProvider, setByProvider] = useState<Record<string, Record<string, string>>>(() => {
    if (!editing) return {};
    const p = state.catalog.find((x) => x.id === editing.provider);
    const v: Record<string, string> = {};
    for (const prm of p?.params ?? []) {
      const cur = editing.configuration[prm.key];
      if (!prm.secret && cur !== undefined && cur !== null) v[prm.key] = typeof cur === "object" ? JSON.stringify(cur) : String(cur);
    }
    return { [editing.provider]: v };
  });
  const def = state.catalog.find((p) => p.id === provider);
  const values = useMemo(
    () => ({ ...Object.fromEntries((def?.params ?? []).map((p) => [p.key, p.defaultValue])), ...(byProvider[provider] ?? {}) }),
    [def, byProvider, provider],
  );
  const set = (k: string, v: string) => setByProvider({ ...byProvider, [provider]: { ...(byProvider[provider] ?? {}), [k]: v } });
  const visible = (def?.params ?? []).filter((p) => !p.showWhen || (values[p.showWhen.param] ?? "") === p.showWhen.equals);
  const webhook =
    provider === "http" && (values.path ?? "").trim()
      ? (() => {
          const pp = def?.params.find((x) => x.key === "path");
          const tpl = pp?.description?.includes("{{path}}") ? pp.description : "/_path/{{path}}";
          return `${state.instanceUrl.replace(/\/+$/, "")}/api${tpl.replace("{{path}}", values.path.trim())}`;
        })()
      : null;
  const cron = provider === "cron" ? describeCron(values.expression ?? "") : null;
  return (
    <div className="fg-trigger-editor" onKeyDown={(e) => { e.stopPropagation(); if (e.key === "Escape") props.onCancel(); }}>
      <div className="fg-subhead">{editing ? "Edit trigger" : "New trigger"}</div>
      <div className="fg-providers">
        {state.catalog.map((p) => (
          <button key={p.id} type="button" className={`fg-provider ${provider === p.id ? "is-on" : ""}`} title={p.description ?? p.name} onClick={() => setProvider(p.id)}>
            <b>{p.name}</b>
            <code>{p.id}</code>
          </button>
        ))}
      </div>
      {visible.map((p) => {
        const sc = !p.secret && p.choices.length === 0 ? scrubOf(p.type, null, p.key, p.label) : null;
        const dm = !p.secret && p.choices.length === 0 && p.key !== "expression" ? dateModeOf(p.type, null, p.key, p.label) : null;
        return (
        <div key={p.key} className={`fg-row ${p.type === "text" ? "is-wide" : ""}`}>
          {sc ? (
            <Scrub className="fg-label" value={values[p.key] ?? ""} spec={sc} onChange={(v) => set(p.key, v)} onCommit={(v) => set(p.key, v)}>
              {p.label}
            </Scrub>
          ) : (
            <span className="fg-label" title={p.description ?? p.key}>{p.label}</span>
          )}
          {p.choices.length > 0 ? (
            <select className="fg-input" value={values[p.key] ?? ""} onChange={(e) => set(p.key, e.target.value)}>
              {!p.choices.includes(values[p.key] ?? "") && <option value={values[p.key] ?? ""}>{values[p.key] || "—"}</option>}
              {p.choices.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          ) : p.type === "boolean" ? (
            <select className="fg-input" value={values[p.key] ?? ""} onChange={(e) => set(p.key, e.target.value)}>
              <option value="">—</option>
              <option value="true">true</option>
              <option value="false">false</option>
            </select>
          ) : p.secret ? (
            <input
              className="fg-input"
              type="password"
              value={values[p.key] ?? ""}
              placeholder={editing ? "unchanged — type to replace" : p.description ?? undefined}
              onChange={(e) => set(p.key, e.target.value)}
            />
          ) : (
            <span className="nv-input-row">
              <HighlightInput
                className={`fg-input ${p.key === "expression" ? "is-mono" : ""}`}
                mono={p.key === "expression"}
                lang={p.key === "expression" ? "cron" : "tpl"}
                value={values[p.key] ?? ""}
                placeholder={p.description ?? undefined}
                onChange={(v) => set(p.key, v)}
              />
              {dm && <DateButtons value={values[p.key] ?? ""} mode={dm} onPick={(v) => set(p.key, v)} />}
            </span>
          )}
          {dm && describeDate(values[p.key] ?? "", dm) && <span className="nv-date-hint fg-date-hint">{describeDate(values[p.key] ?? "", dm)}</span>}
        </div>
        );
      })}
      {provider === "cron" && (
        <div className="fg-chips">
          {CRON_PRESETS.map((c) => (
            <button key={c.expression} className={`fg-chip ${values.expression === c.expression ? "is-on" : ""}`} onClick={() => set("expression", c.expression)}>
              {c.label}
            </button>
          ))}
        </div>
      )}
      {cron && <p className="fg-hint">{cron}</p>}
      {webhook && (
        <div className="fg-webhook">
          <code>{webhook}</code>
          <button className="fg-link" title="Copy this URL" onClick={() => navigator.clipboard?.writeText(webhook).catch(() => {})}>Copy</button>
        </div>
      )}
      <div className="fg-subhead">Actions to run</div>
      {props.wf.actions.length === 0 && <p className="fg-hint">This workflow has no global actions — triggers can only run those.</p>}
      <div className="fg-checklist">
        {props.wf.actions.map((a) => (
          <label key={a.id} className="fg-check">
            <input type="checkbox" checked={actions.includes(a.id)} onChange={(e) => setActions(e.target.checked ? [...actions, a.id] : actions.filter((x) => x !== a.id))} />
            <span>{a.label}</span>
            <code>{a.action}</code>
          </label>
        ))}
      </div>
      <ErrorLine text={props.ops.triggerError} />
      <div className="fg-btn-row">
        <Btn onClick={props.onCancel}>Cancel</Btn>
        <Btn
          kind="primary"
          disabled={!provider || props.ops.triggerBusy}
          onClick={() => {
            const out: Record<string, string> = {};
            for (const p of visible) if (values[p.key] !== undefined) out[p.key] = values[p.key];
            props.ops.saveTrigger({ id: editing?.id, provider, values: out, actions });
          }}
        >
          {props.ops.triggerBusy ? "Saving…" : editing ? "Save trigger" : "Add trigger"}
        </Btn>
      </div>
    </div>
  );
}

const HOOK_OPS = ["create", "read", "get", "update", "delete", "list"];
/** The resources this workflow is linked to: those that run on it (their ResourceDetail names it), and those whose
 *  lifecycle hooks run its actions, each with just those hooks; by name. null when the details couldn't be read. */
function linkedResources(bindings: Binding[] | null, wfId: string) {
  return bindings
    ? bindings
        .map((b) => {
          const bound = b.workflowId === wfId;
          const hooks = b.hooks
            .map((h) => ({ ...h, entries: h.entries.filter((e) => e.workflowId === wfId || (e.workflowId === null && bound)) }))
            .filter((h) => h.entries.length > 0);
          return { b, bound, hooks };
        })
        .filter((x) => x.bound || x.hooks.length > 0)
        .sort((a, b) => a.b.resource.localeCompare(b.b.resource))
    : null;
}

/** Every resource linked to this workflow, as a button that opens it on the Resources screen. */
function LinkedSection(props: { wf: WorkflowView; ops: SettingsOps }) {
  const rows = useMemo(() => linkedResources(props.ops.bindings, props.wf.id), [props.ops.bindings, props.wf.id]);
  // one per resource (a resource may have two ResourceDetail records)
  const seen = new Set<string>();
  const list = (rows ?? []).filter(({ b }) => !seen.has(b.resource) && !!seen.add(b.resource));
  const how = (resource: string) => {
    const mine = (rows ?? []).filter((r) => r.b.resource === resource);
    const bound = mine.find((r) => r.bound);
    const hooks = mine.reduce((n, r) => n + r.hooks.length, 0);
    return [bound ? (bound.b.boundedProperty ? `runs on this workflow (on ${bound.b.boundedProperty})` : "runs on this workflow") : null, hooks ? `${hooks} hook${hooks === 1 ? "" : "s"}` : null].filter(Boolean).join(" · ");
  };
  return (
    <Section title="Linked resources" id="wf-linked">
      {rows === null ? (
        <p className="fg-hint">Could not read this instance's resource details, so the linked resources are unknown.</p>
      ) : list.length === 0 ? (
        <p className="fg-hint">No resource is linked to this workflow.</p>
      ) : (
        <div className="fg-linked">
          {list.map(({ b }) => (
            <button key={b.resource} type="button" className="fg-linked-btn" title={`Open ${b.resource} on the Resources screen`} onClick={() => props.ops.openResource(b.resource)}>
              <b>{b.resource}</b>
              <small>{how(b.resource)}</small>
            </button>
          ))}
        </div>
      )}
    </Section>
  );
}

function ResourcesSection(props: { wf: WorkflowView; ops: SettingsOps }) {
  const { wf, ops } = props;
  const [adding, setAdding] = useState<string | null>(null);
  const [hook, setHook] = useState({ op: "update", when: "after", actionId: "" });
  const allActions = useMemo(
    () => [
      ...wf.actions.map((a) => ({ id: a.id, label: a.label, from: "Actions" })),
      ...wf.stages.flatMap((s) => s.actions.map((a) => ({ id: a.id, label: a.label, from: s.label }))),
    ],
    [wf],
  );
  const rows = useMemo(() => linkedResources(ops.bindings, wf.id), [ops.bindings, wf.id]);
  const label = (id: string) => allActions.find((a) => a.id === id)?.label ?? id;
  return (
    <Section title="Hooks" id="wf-resources" defaultOpen={false}>
      {rows === null ? (
        <p className="fg-hint">Could not read this instance's resource details, so what this workflow is attached to is unknown.</p>
      ) : rows.length === 0 ? (
        <p className="fg-hint">No resource runs on this workflow. A resource is attached from its own settings (its workflow and bounded_property).</p>
      ) : (
        rows.map(({ b, bound, hooks }) => (
          <div key={b.resource + (b.recordId ?? "")} className="fg-resource">
            <div className="fg-resource-head">
              <button type="button" className="fg-link fg-resource-name" title={`Open ${b.resource} on the Resources screen`} onClick={() => ops.openResource(b.resource)}>{b.resource}</button>
              <span className="fg-badge">{bound ? (b.boundedProperty ? `bound on ${b.boundedProperty}` : "bound") : "hooks only"}</span>
              {b.duplicate && <span className="fg-badge is-amber">duplicate record</span>}
              <span className="nv-spacer" />
              {!b.duplicate && b.recordId && (
                <button className="fg-plus" title={`Run an action on ${b.resource}`} onClick={() => { setAdding(b.resource); setHook({ ...hook, actionId: allActions[0]?.id ?? "" }); }}>＋</button>
              )}
            </div>
            {hooks.length === 0 && <p className="fg-hint">No lifecycle hooks run this workflow's actions.</p>}
            {hooks.map((h) => (
              <div key={h.op + h.when} className="fg-hook">
                <code>{h.op}.{h.when}</code>
                <span className="fg-hook-actions">
                  {h.entries.map((e) => (
                    <span key={e.actionId + (e.workflowId ?? "")} className="fg-hook-chip" title={`Action ${e.actionId}`}>
                      {label(e.actionId)}
                      <button title={`Stop running this on ${h.op}.${h.when}`} disabled={ops.hookBusy}
                        onClick={() => ops.setHook({ resource: b.resource, actionId: e.actionId, op: h.op, when: h.when, remove: true })}>×</button>
                    </span>
                  ))}
                </span>
              </div>
            ))}
            {adding === b.resource && (
              <div className="fg-hook-add">
                <select className="fg-input" value={hook.when} onChange={(e) => setHook({ ...hook, when: e.target.value })}>
                  {["before", "after"].map((w) => <option key={w}>{w}</option>)}
                </select>
                <select className="fg-input" value={hook.op} onChange={(e) => setHook({ ...hook, op: e.target.value })}>
                  {HOOK_OPS.map((o) => <option key={o}>{o}</option>)}
                </select>
                <select className="fg-input is-grow" value={hook.actionId} onChange={(e) => setHook({ ...hook, actionId: e.target.value })}>
                  {allActions.map((a) => <option key={a.id} value={a.id}>{a.from} · {a.label}</option>)}
                </select>
                <div className="fg-btn-row">
                  <Btn onClick={() => setAdding(null)}>Cancel</Btn>
                  <Btn kind="primary" disabled={!hook.actionId || ops.hookBusy}
                    onClick={() => { ops.setHook({ resource: b.resource, ...hook }); setAdding(null); }}>
                    Add hook
                  </Btn>
                </div>
              </div>
            )}
          </div>
        ))
      )}
      {ops.bindingSaved && <p className="fg-hint is-ok">{ops.bindingSaved}</p>}
    </Section>
  );
}

// ---- header ----------------------------------------------------------------------
function PanelHead(props: { color: string; title: string; sub: string; round?: boolean }) {
  return (
    <div className="fg-head">
      <span className={`fg-head-chip ${props.round ? "is-round" : ""}`} style={{ background: props.color }} />
      <div className="fg-head-text">
        <div className="fg-head-title" title={props.title}>{props.title}</div>
        <div className="fg-head-sub">{props.sub}</div>
      </div>
    </div>
  );
}
