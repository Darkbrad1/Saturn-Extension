import {
  Background,
  BackgroundVariant,
  MiniMap,
  Panel as FlowPanel,
  ReactFlow,
  ReactFlowProvider,
  SelectionMode,
  useNodesState,
  useReactFlow,
  type Edge,
  type Node,
} from "@xyflow/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  getCurrentWorkflowId,
  loadNodeViewState,
  onSelectionChange,
  saveNodeViewState,
  send,
} from "./bridge";
import { STAGE_FIELD, WorkflowMap } from "./map";
import { hint, keysOf, listenForShortcuts, pressed, shown as shownKey, type Bindings } from "./keys";
import { FormEnvContext, StepForm, defaultsFor, needsForm, type FormEnv, type FormError, type LoadedParams } from "./forms";
import type { AccessSubjects, Binding, SettingsOps, TriggersState } from "./settings";
import type { ResourceField } from "./recordform";
import {
  KIND_COLORS,
  categoryColor,
  codeParams,
  isEmailSummary,
  type RowAction,
  isWithin,
  layoutTree,
  operatorName,
  pathKey,
  type InsertPoint,
  type LayoutDir,
  type NvEdge,
  type NvNode,
} from "./layout";
import { DirContext, NodeActions, edgeTypes, nodeTypes } from "./nodes";
import { Outliner, machineName, nextStageColor, type CreateRequest } from "./outliner";
import { SidePanel, countSteps, sameOperator, titleOf, type BulkOps, type PanelScope, type Tree } from "./panel";
import { searchWorkflow } from "./search";
import type { Catalog, CommandUsage, CommandView, DraftState, Flow, Path, WorkflowSummary, WorkflowView } from "./types";

// ---------------------------------------------------------------------------

function treesOf(w: WorkflowView): Tree[] {
  const out: Tree[] = [];
  w.stages.forEach((s) =>
    s.actions.forEach((a) =>
      out.push({
        key: `s:${s.stage}:${a.id}`,
        group: `Stage · ${s.label}`,
        label: a.label,
        flow: a.flow,
        taskPath: a.taskPath,
        kind: "action",
        contextName: [s.stage || s.label, a.action || a.label].filter(Boolean).join("-") || "workflow",
      }),
    ),
  );
  w.actions.forEach((a) =>
    out.push({
      key: `g:${a.id}`,
      group: "Global actions",
      label: a.label,
      flow: a.flow,
      taskPath: a.taskPath,
      kind: "action",
      contextName: a.action || a.label || "actions",
    }),
  );
  w.commands.forEach((c) =>
    out.push({
      key: `c:${c.id}`,
      group: "Commands",
      label: c.label,
      flow: c.flow,
      taskPath: c.taskPath,
      kind: "command",
      contextName: c.name || c.label || "commands",
      commandId: c.id,
      commandName: c.name,
    }),
  );
  return out;
}


function rootChildrenPath(t: Tree): Path | null {
  if (!t.flow) return [...t.taskPath, "commands"];
  if (t.flow.kind === "series") return t.flow.childrenPath;
  return null;
}

function rootLength(t: Tree): number {
  return t.flow?.kind === "series" ? t.flow.children.length : 0;
}

/** Where "add after this step" puts a new step. */
function insertAfter(f: Flow): InsertPoint | null {
  const last = f.path[f.path.length - 1];
  if (typeof last !== "number") return null;
  return { childrenPath: f.path.slice(0, -1), index: last + 1 };
}

interface Toast {
  id: number;
  text: string;
  kind: "info" | "error";
}

type FormState =
  | null
  | {
      mode: "add" | "edit";
      operator: string;
      title: string;
      subtitle?: string;
      values: Record<string, string>;
      delay: number | null;
      path?: Path;
      insert?: InsertPoint;
      /** Params holding an HTML/designed email object: opened with openHtmlParam, never sent back as text. */
      htmlParams?: string[];
    };

interface Saved {
  open: boolean;
  panel: boolean;
  panelWidth?: number;
  formWidth?: number | null;
  trees: Record<string, string>;
  /** per workflow: collapsed stages/sections in the layers panel */
  collapsed?: Record<string, string[]>;
  /** which way flows run: top → bottom (default) or left → right */
  dir?: LayoutDir;
  /** the layers panel shown (default) or folded away */
  layers?: boolean;
}
const PANEL_DEFAULT = 320;

// ---------------------------------------------------------------------------
export function App() {
  const saved = useMemo(() => loadNodeViewState<Saved>({ open: false, panel: true, trees: {} }), []);
  const [currentId, setCurrentId] = useState<string | null>(getCurrentWorkflowId());
  const [workflows, setWorkflows] = useState<Record<string, WorkflowView>>({});
  const [catalog, setCatalog] = useState<Catalog>({});
  const [drafts, setDrafts] = useState<Record<string, DraftState>>({});
  // the node view is the default view: it opens first, List view is one click away
  const [open, setOpen] = useState(true);
  const [dir, setDir] = useState<LayoutDir>(saved.dir ?? "v");
  const [panel, setPanel] = useState(saved.panel);
  // the layers panel (stages, actions, commands) on the left: shown unless folded away
  const [layers, setLayers] = useState(saved.layers ?? true);
  // the keys the shortcuts use (the Keyboard shortcuts page's, else the defaults)
  const [shortcuts, setShortcuts] = useState<Bindings>({});
  useEffect(() => listenForShortcuts(send, setShortcuts), []);
  const [panelWidth, setPanelWidth] = useState(saved.panelWidth ?? PANEL_DEFAULT);
  const [formWidth, setFormWidth] = useState<number | null>(saved.formWidth ?? null);
  /** Settings of the selected step, read from the host (readNode) for the panel editor. */
  const [loaded, setLoaded] = useState<{ key: string; params: LoadedParams } | null>(null);
  // the settings of several picked steps of one operator (for editing what they share), by request id
  const [multiLoaded, setMultiLoaded] = useState<{ reqId: string; list: LoadedParams[] } | null>(null);
  const multiReq = useRef<string | null>(null);
  // the canvas's nodes as last laid out (for Select all)
  const canvasNodes = useRef<NvNode[]>([]);
  const [panelErrors, setPanelErrors] = useState<FormError[]>([]);
  const [focusToken, setFocusToken] = useState(0);
  const [treeByWf, setTreeByWf] = useState<Record<string, string>>(saved.trees);
  const [collapsedByWf, setCollapsedByWf] = useState<Record<string, string[]>>(saved.collapsed ?? {});
  const [query, setQuery] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [form, setForm] = useState<FormState>(null);
  const [formErrors, setFormErrors] = useState<FormError[]>([]);
  const [busy, setBusy] = useState(false);
  const [addMenu, setAddMenu] = useState<{ x: number; y: number } | null>(null);
  const [selected, setSelected] = useState<NvNode | null>(null);
  /** More steps picked with Shift+click, besides `selected` (the last one picked). */
  const [extra, setExtra] = useState<NvNode[]>([]);
  // what's picked in the layers panel (several actions: the side panel edits what they share)
  const [outlinerPicks, setOutlinerPicks] = useState<{ kind: string; path: Path }[]>([]);
  const [selectedEdge, setSelectedEdge] = useState<NvEdge | null>(null);
  /** What the side panel shows when no node is selected. */
  const [scope, setScope] = useState<PanelScope>({ kind: "tree" });
  const [workflowList, setWorkflowList] = useState<WorkflowSummary[]>([]);
  const [clipboard, setClipboard] = useState<{ label: string; count: number; sourceWorkflowName: string; referencedIds: string[] } | null>(null);
  const [triggers, setTriggers] = useState<TriggersState | null>(null);
  const [triggerBusy, setTriggerBusy] = useState(false);
  const [triggerError, setTriggerError] = useState<string | null>(null);
  const [subjects, setSubjects] = useState<AccessSubjects | null>(null);
  const [lookupOptions, setLookupOptions] = useState<Record<string, { value: string; label: string }[] | null>>({});
  const [resourceNames, setResourceNames] = useState<string[]>([]);
  const [bindings, setBindings] = useState<Binding[] | null>(null);
  // a resource's properties, asked for by a Create or Property Updater step's form (0.3.69)
  const [resourceFields, setResourceFields] = useState<Record<string, ResourceField[]>>({});
  const [bindingSaved, setBindingSaved] = useState("");
  const [hookBusy, setHookBusy] = useState(false);
  const [connection, setConnection] = useState<SettingsOps["connection"]>(null);
  const [remote, setRemote] = useState<{ workflowId: string; summary: string; hasDraft: boolean } | null>(null);
  const [settingsError, setSettingsError] = useState<string | null>(null);
  const [wfMenu, setWfMenu] = useState(false);
  const [newWf, setNewWf] = useState<{ name: string; stage: string; error: string | null; busy: boolean } | null>(null);
  const [ctxMenu, setCtxMenu] = useState<{ x: number; y: number; node: NvNode | null; at: InsertPoint | null } | null>(null);
  /** After jumping to a command usage, select this step once its tree is on the canvas. */
  const [focusPath, setFocusPath] = useState<string | null>(null);
  /** Ask the outliner to start naming a new action in a stage (from the stage panel). */
  const [outlinerAdd, setOutlinerAdd] = useState<{ stageIndex: number | null; n: number } | null>(null);
  const requestedLookups = useRef(new Set<string>());
  const openRef = useRef(open);
  openRef.current = open;
  const triggerBusyRef = useRef(false);
  triggerBusyRef.current = triggerBusy;
  const newWfRef = useRef(newWf);
  newWfRef.current = newWf;

  const mine = useRef(0); // edits this view sent that are still awaiting a reply
  /** Which part of the view sent the last edit, so its reply goes back there. */
  const sourceRef = useRef<"panel" | "outliner" | "settings" | "other">("other");
  const [outlinerError, setOutlinerError] = useState<string | null>(null);
  const [outlinerDone, setOutlinerDone] = useState(0);
  /** After creating an action or command, open it once it shows up. */
  const pendingOpen = useRef<{ kind: "action" | "command"; stageIndex: number | null; machine: string } | null>(null);
  /** Where the Add menu inserts when it was opened from a slot or a wire's + button. */
  const addAt = useRef<InsertPoint | null>(null);
  const pendingRead = useRef<string | null>(null);
  const formRef = useRef<FormState>(null);
  formRef.current = form;

  useEffect(
    () => saveNodeViewState({ open, panel, panelWidth, formWidth, trees: treeByWf, collapsed: collapsedByWf, dir, layers }),
    [open, panel, panelWidth, formWidth, treeByWf, collapsedByWf, dir, layers],
  );
  useEffect(() => {
    const off = onSelectionChange(setCurrentId);
    return () => void off();
  }, []);

  const toast = useCallback((text: string, kind: Toast["kind"] = "info") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t.slice(-3), { id, text, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), kind === "error" ? 7000 : 3500);
  }, []);

  // ---- messages from the extension host --------------------------------
  useEffect(() => {
    const onMsg = (ev: MessageEvent) => {
      const m = ev.data;
      if (!m || typeof m !== "object") return;
      const p = m.payload;
      switch (m.type) {
        case "workflow":
          if (p?.id) setWorkflows((w) => ({ ...w, [p.id]: p }));
          break;
        case "workflows":
          setWorkflowList(Array.isArray(p?.workflows) ? p.workflows : []);
          break;
        case "showWorkflow":
          // another screen (Resources) asked for this workflow: open it through the list view, as switching does
          if (p?.workflow?.id) window.dispatchEvent(new CustomEvent("sonover:openWorkflow", { detail: p.workflow }));
          break;
        case "workflowCreated":
          setNewWf(null);
          break;
        case "clipboard":
          setClipboard(p ?? null);
          break;
        case "triggers":
          setTriggers({
            workflowId: String(p?.workflowId ?? ""),
            rows: Array.isArray(p?.triggers) ? p.triggers : [],
            catalog: Array.isArray(p?.catalog) ? p.catalog : [],
            instanceUrl: p?.instanceUrl ?? "",
            offline: !!p?.offline,
            queued: typeof p?.queued === "number" ? p.queued : 0,
            loading: false,
            error: "",
          });
          break;
        case "triggersFailed":
          setTriggers((t) => ({
            ...(t ?? { workflowId: "", rows: [], catalog: [], instanceUrl: "", offline: false, queued: 0 }),
            loading: false,
            error: p?.message ?? "Could not read triggers.",
          }));
          setTriggerBusy(false);
          break;
        case "triggerSaved":
          setTriggerBusy(false);
          setTriggerError(null);
          break;
        case "accessSubjects":
          setSubjects({
            groups: p?.groups ?? [],
            users: p?.users ?? [],
            permissions: p?.permissions ?? [],
            error: p?.error ?? null,
          });
          break;
        case "lookupOptions":
          if (p?.resource) setLookupOptions((o) => ({ ...o, [p.resource]: p.options ?? null }));
          break;
        case "resourceNames":
          setResourceNames(Array.isArray(p) ? p : []);
          break;
        case "resourceFields":
          if (typeof p?.resource === "string") setResourceFields((cur) => ({ ...cur, [p.resource]: Array.isArray(p.fields) ? p.fields : [] }));
          break;
        case "bindings":
          setBindings(Array.isArray(p?.bindings) ? p.bindings : null);
          setBindingSaved(p?.saved ?? "");
          setHookBusy(false);
          break;
        case "connection":
          setConnection({ offline: !!p?.offline, pending: Array.isArray(p?.pending) ? p.pending : [] });
          break;
        case "connectionRestored":
          // the host has reconnected and replayed queued offline work; `synced` says what (or "")
          toast(p?.synced || "Back online — connected to the instance again.");
          break;
        case "workflowChangedRemotely":
          if (p?.workflowId) setRemote({ workflowId: String(p.workflowId), summary: p.summary ?? "", hasDraft: !!p.hasDraft });
          break;
        case "error":
          setHookBusy(false);
          if (openRef.current && p?.message) toast(p.message, "error");
          break;
        case "operators":
          setCatalog(p ?? {});
          break;
        case "draftState":
          if (p?.workflowId != null)
            setDrafts((d) => ({ ...d, [String(p.workflowId)]: { pending: p.pending ?? 0, summaries: p.summaries ?? [] } }));
          break;
        case "nodesParams": {
          if (p?.reqId && p.reqId === multiReq.current)
            setMultiLoaded(
              Array.isArray(p.list)
                ? {
                    reqId: p.reqId,
                    list: p.list.map((l: Record<string, unknown>) => ({ values: (l.values as Record<string, string>) ?? {}, delay: (l.delay as number) ?? null, htmlParams: (l.designed as string[]) ?? [], designTree: (l.withDesignTree as string[]) ?? [] })),
                  }
                : null,
            );
          break;
        }
        case "nodeParams": {
          // Only the reply to the panel's own request (the list view reads nodes too).
          const k = pathKey(p?.path ?? []);
          if (pendingRead.current && k === pendingRead.current) {
            pendingRead.current = null;
            setLoaded({
              key: k,
              params: {
                values: p.values ?? {},
                delay: p.delay ?? null,
                htmlParams: p.designed ?? [],
                designTree: p.withDesignTree ?? [],
              },
            });
          }
          break;
        }
        case "editSaved":
          if (mine.current > 0) {
            mine.current--;
            setBusy(mine.current > 0);
            if (formRef.current) setForm(null);
            if (sourceRef.current === "outliner") {
              setOutlinerError(null);
              setOutlinerDone((n) => n + 1);
            }
            if (sourceRef.current === "settings") setSettingsError(null);
          }
          break;
        case "editRejected":
          if (triggerBusyRef.current) {
            setTriggerBusy(false);
            setTriggerError(p?.errors?.[0]?.message ?? p?.reason ?? "The trigger could not be saved");
            break;
          }
          if (newWfRef.current?.busy) {
            setNewWf((w) => w && { ...w, busy: false, error: p?.errors?.[0] ? `${p.errors[0].label ?? ""} ${p.errors[0].message}`.trim() : p?.reason ?? "Could not create it" });
            break;
          }
          if (mine.current > 0) {
            mine.current--;
            setBusy(mine.current > 0);
            const errs: FormError[] = p?.errors ?? [];
            if (formRef.current) setFormErrors(errs);
            else if (sourceRef.current === "outliner") {
              if (!p?.cancelled) setOutlinerError(errs[0]?.message ? `${errs[0].label ?? ""} ${errs[0].message}`.trim() : p?.reason ?? null);
            } else if (sourceRef.current === "settings") {
              if (!p?.cancelled) setSettingsError(errs[0]?.message ? `${errs[0].label ?? ""} ${errs[0].message}`.trim() : p?.reason ?? null);
            } else if (errs.length && sourceRef.current === "panel") {
              // shown next to the fields, and as a toast: the editor may be closed by now
              setPanelErrors(errs);
              toast(`Not applied: ${errs.map((e) => `${e.label ?? e.param} ${e.message}`).join("; ")}`, "error");
            }
            else if (p?.reason) toast(p.reason, "error");
            else if (errs.length) toast(errs.map((e) => `${e.label ?? e.param} ${e.message}`).join("; "), "error");
          }
          break;
        case "editFailed":
          if (newWfRef.current?.busy) {
            setNewWf((w) => w && { ...w, busy: false, error: p?.message ?? "Could not create the workflow" });
            break;
          }
          if (mine.current > 0) {
            mine.current--;
            setBusy(mine.current > 0);
            if (sourceRef.current === "settings") setSettingsError(p?.message ?? "That change could not be applied");
            else if (sourceRef.current === "outliner") {
              pendingOpen.current = null;
              setOutlinerError(p?.message ?? "That could not be created");
            } else toast(p?.message ?? "That change could not be applied", "error");
          }
          break;
      }
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, [toast]);

  const wf = currentId ? workflows[currentId] : undefined;
  const trees = useMemo(() => (wf ? treesOf(wf) : []), [wf]);
  const treeKey = (wf && treeByWf[wf.id]) || trees[0]?.key;
  const tree = trees.find((t) => t.key === treeKey) ?? trees[0];
  const draft = wf ? drafts[wf.id] : undefined;
  useEffect(() => {
    if (!selected) setExtra([]);
  }, [selected]);
  /** Every selected step, once: containers already include what's inside them. */
  const selection = useMemo(() => {
    const all = [...extra, ...(selected ? [selected] : [])].map((n) => n.data.flow).filter((f): f is Flow => !!f);
    const uniq = all.filter((f, i) => all.findIndex((g) => pathKey(g.path) === pathKey(f.path)) === i);
    return uniq.filter((f) => !uniq.some((g) => g !== f && g.path.length < f.path.length && isWithin(f.path, g.path)));
  }, [selected, extra]);

  const selectTree = useCallback(
    (key: string, pushHistory = false) => {
      if (!wf) return;
      if (pushHistory && tree) setHistory((h) => [...h, tree.key]);
      else if (!pushHistory) setHistory([]);
      setTreeByWf((m) => ({ ...m, [wf.id]: key }));
      setSelected(null);
      setSelectedEdge(null);
    },
    [wf, tree],
  );

  // ---- edits -------------------------------------------------------------
  const edit = useCallback(
    (type: string, payload: Record<string, unknown>) => {
      if (!wf) return;
      mine.current++;
      sourceRef.current = "other";
      setBusy(true);
      send(type, { workflowId: wf.id, ...payload });
    },
    [wf],
  );

  const doDelete = useCallback(
    (f: Flow) => {
      edit("deleteOperator", { path: f.path, operator: operatorName(f) });
      setSelected(null);
    },
    [edit],
  );
  const doDuplicate = useCallback((f: Flow) => edit("duplicateNode", { path: f.path }), [edit]);
  const doToggleMock = useCallback(
    (f: Flow) => {
      edit("setStepMock", { path: f.path, mock: !f.mock });
    },
    [edit],
  );

  // ---- several steps at once (Shift+click): one draft edit each ----------
  const bulk: BulkOps = useMemo(
    () => ({
      remove: (fs) => {
        if (fs.length === 1) return doDelete(fs[0]);
        edit("bulkSteps", { op: "delete", paths: fs.map((f) => f.path) });
        setSelected(null);
      },
      mock: (fs) => {
        if (fs.length === 1) return doToggleMock(fs[0]);
        edit("bulkSteps", { op: "mock", paths: fs.map((f) => f.path), mock: !fs.every((f) => f.mock) });
      },
      duplicate: (fs) => {
        if (fs.length === 1) return doDuplicate(fs[0]);
        edit("bulkSteps", { op: "duplicate", paths: fs.map((f) => f.path) });
        setSelected(null);
      },
      copy: (fs) => {
        if (!wf || fs.length === 0) return;
        if (fs.length === 1) send("copyNode", { workflowId: wf.id, path: fs[0].path });
        else send("copyNodes", { workflowId: wf.id, paths: fs.map((f) => f.path) });
        toast(fs.length === 1 ? `Copied ${titleOf(fs[0], catalog)}` : `Copied ${fs.length} steps`);
      },
      select: (f) => {
        const n = [...extra, ...(selected ? [selected] : [])].find((x) => x.data.flow && pathKey(x.data.flow.path) === pathKey(f.path));
        setExtra([]);
        if (n) setSelected(n);
      },
      clear: () => {
        setExtra([]);
        setSelected(null);
      },
    }),
    [edit, wf, catalog, toast, doDelete, doDuplicate, doToggleMock, extra, selected],
  );

  /** Same messages the list view sends: code opens in a real editor tab, an email opens with its preview. */
  const openRow = useCallback(
    (f: Flow, a: RowAction) => {
      if (!wf || !tree) return;
      const ctx = { workflowId: wf.id, workflowName: wf.name, contextName: tree.contextName, path: f.path };
      if (a.kind === "email") send("openHtmlParam", { ...ctx, param: a.param });
      else if (f.kind !== "reference" && f.kind !== "series")
        send("openParamEditor", {
          ...ctx,
          param: a.param,
          label: a.label,
          language: a.language ?? "javascript",
          operator: f.kind === "operator" ? f.operator : operatorName(f),
        });
    },
    [wf, tree],
  );
  const doMove = useCallback(
    (f: Flow, to: InsertPoint) =>
      edit("moveOperator", { fromPath: f.path, toChildrenPath: to.childrenPath, toIndex: to.index }),
    [edit],
  );
  /** Several picked steps dragged together onto a wire: one edit, in their order. */
  const doMoveMany = useCallback(
    (to: InsertPoint) => {
      edit("moveSteps", { paths: selection.map((f) => f.path), toChildrenPath: to.childrenPath, toIndex: to.index });
      setSelected(null);
    },
    [edit, selection],
  );
  // several picked steps of one operator: read their settings, again whenever the workflow changes
  const multiOp = selection.length > 1 ? sameOperator(selection) : null;
  const multiKey = multiOp ? selection.map((f) => pathKey(f.path)).join("|") : null;
  useEffect(() => {
    if (!wf || !multiKey || !panel) {
      multiReq.current = null;
      setMultiLoaded(null);
      return;
    }
    const reqId = `${Date.now()}-${Math.random()}`;
    multiReq.current = reqId;
    send("readNodes", { workflowId: wf.id, paths: selection.map((f) => f.path), reqId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [multiKey, wf, panel]);
  const commitMany = useCallback(
    (changes: Record<string, string>) => {
      if (!multiOp) return;
      setPanelErrors([]);
      edit("updateOperators", { paths: selection.map((f) => f.path), operator: multiOp, changes });
    },
    [edit, selection, multiOp],
  );
  /** Picks several nodes at once (a box drawn on the canvas, Select all): `add` keeps what was picked already. */
  const pickMany = useCallback(
    (nodes: NvNode[], add: boolean) => {
      const have = add ? [...extra, ...(selected ? [selected] : [])] : [];
      const all = [...have, ...nodes.filter((n) => !have.some((h) => h.id === n.id))];
      setSelectedEdge(null);
      setScope({ kind: "tree" });
      setSelected(all[all.length - 1] ?? null);
      setExtra(all.slice(0, -1));
    },
    [extra, selected],
  );

  const openEdit = useCallback(
    (f: Flow) => {
      if (!wf) return;
      if (f.kind === "series") {
        toast("Groups have no settings — drag steps in or out of them instead.");
        return;
      }
      // Settings are edited in the side panel: open it and put the cursor in the first field.
      setPanel(true);
      setFocusToken((t) => t + 1);
    },
    [wf, toast],
  );

  // Read the selected step's settings for the panel; again whenever the workflow changes.
  // (A selection made in another workflow is never read against this one.)
  const selWf = useRef<string | null>(null);
  if (selected && selWf.current === null && wf) selWf.current = wf.id;
  if (!selected) selWf.current = null;
  const selFlow = selected && wf && selWf.current === wf.id ? selected.data.flow : undefined;
  const selKey = selFlow && selFlow.kind !== "series" ? pathKey(selFlow.path) : null;
  useEffect(() => {
    setPanelErrors([]);
    if (!wf || !selFlow || !selKey || !panel) {
      pendingRead.current = null;
      return;
    }
    pendingRead.current = selKey;
    send("readNode", { workflowId: wf.id, path: selFlow.path });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selKey, wf, panel]);

  const createItem = useCallback(
    (r: CreateRequest) => {
      if (!wf) return;
      setOutlinerError(null);
      if (r.kind === "stage") edit("createStage", { label: r.label, color: nextStageColor(wf.stages.length) });
      else if (r.kind === "action") {
        pendingOpen.current = { kind: "action", stageIndex: r.stageIndex, machine: machineName(r.label) };
        edit("createAction", { label: r.label, ...(r.stageIndex === null ? {} : { stageIndex: r.stageIndex }) });
      } else {
        pendingOpen.current = { kind: "command", stageIndex: null, machine: machineName(r.label) };
        edit("createCommand", { label: r.label });
      }
      sourceRef.current = "outliner";
    },
    [wf, edit],
  );
  // open what was just created
  useEffect(() => {
    const po = pendingOpen.current;
    if (!wf || !po) return;
    let key: string | null = null;
    if (po.kind === "command") {
      const c = wf.commands.find((x) => x.name === po.machine);
      if (c) key = `c:${c.id}`;
    } else if (po.stageIndex === null) {
      const a = wf.actions.find((x) => x.action === po.machine);
      if (a) key = `g:${a.id}`;
    } else {
      const st = wf.stages[po.stageIndex];
      const a = st?.actions.find((x) => x.action === po.machine);
      if (st && a) key = `s:${st.stage}:${a.id}`;
    }
    if (key) {
      pendingOpen.current = null;
      setTreeByWf((m) => ({ ...m, [wf.id]: key! }));
      setHistory([]);
      setSelected(null);
      setSelectedEdge(null);
    }
  }, [wf]);

  const commitPanel = useCallback(
    (f: Flow, values: Record<string, string>, delay: number | null) => {
      setPanelErrors([]);
      edit("updateOperator", { path: f.path, operator: operatorName(f), values, delay });
      sourceRef.current = "panel";
    },
    [edit],
  );

  // ---- the list view's other abilities ---------------------------------
  const settingsEdit = useCallback(
    (type: string, payload: Record<string, unknown>) => {
      setSettingsError(null);
      edit(type, payload);
      sourceRef.current = "settings";
    },
    [edit],
  );
  /** The host's move helpers adjust a later target by one (they remove first), so ask for one past it. */
  const moveTarget = (from: number, to: number) => (to > from ? to + 1 : to);

  const openTree = useCallback(
    (key: string) => {
      setScope({ kind: "tree" });
      selectTree(key);
      // make sure the layers panel shows it: open its stage / section
      if (wf) {
        const need = key.startsWith("s:") ? ["group:stages", `stage:${key.split(":")[1]}`] : key.startsWith("g:") ? ["group:global"] : ["group:commands"];
        setCollapsedByWf((m) => {
          const cur = m[wf.id] ?? [];
          return cur.some((k) => need.includes(k)) ? { ...m, [wf.id]: cur.filter((k) => !need.includes(k)) } : m;
        });
      }
    },
    [selectTree, wf],
  );
  const openStep = useCallback(
    (key: string, path: Path) => {
      openTree(key);
      setFocusPath(null);
      setTimeout(() => setFocusPath(pathKey(path)), 0);
    },
    [openTree],
  );

  const openUsage = useCallback(
    (u: CommandUsage) => {
      if (!wf) return;
      let key: string | null = null;
      if (u.target.tab === "commands" && u.target.commandId) key = `c:${u.target.commandId}`;
      else if (u.target.tab === "actions" && u.target.actionId) key = `g:${u.target.actionId}`;
      else if (u.target.stage && u.target.actionId) key = `s:${u.target.stage}:${u.target.actionId}`;
      if (!key) return;
      openTree(key);
      setFocusPath(pathKey(u.path));
    },
    [wf, openTree],
  );

  const ops: SettingsOps = useMemo(
    () => ({
      busy: busy && sourceRef.current === "settings",
      error: settingsError,
      clearError: () => setSettingsError(null),
      rename: (kind, path, label, machine, color) =>
        settingsEdit("renameNode", {
          kind,
          path,
          label,
          ...(machine !== undefined ? { machineName: machine } : {}),
          ...(color !== undefined ? { color } : {}),
        }),
      deleteNode: (kind, path) => {
        settingsEdit("deleteNode", { kind, path });
        if (kind === "stage") setScope({ kind: "tree" });
      },
      moveStage: (from, to) => {
        settingsEdit("moveStage", { fromIndex: from, toIndex: moveTarget(from, to) });
        setScope({ kind: "stage", index: to });
      },
      moveAction: (stageIndex, from, to) =>
        settingsEdit("moveAction", { stageIndex, fromIndex: from, toIndex: moveTarget(from, to) }),
      createAction: (stageIndex) => setOutlinerAdd((r) => ({ stageIndex, n: (r?.n ?? 0) + 1 })),
      createField: (ownerPath, formKey, label, type, required) =>
        settingsEdit("createFormField", { ownerPath, formKey, label, type, required }),
      updateField: (ownerPath, formKey, key, label, newKey, type, required) =>
        settingsEdit("updateFormField", { ownerPath, formKey, key, label, newKey, type, required }),
      deleteField: (ownerPath, formKey, key) => settingsEdit("deleteFormField", { ownerPath, formKey, key }),
      setFieldProps: (ownerPath, formKey, key, changes) =>
        settingsEdit("setFormFieldProps", { ownerPath, formKey, key, changes }),
      subjects,
      loadSubjects: () => send("listAccessSubjects"),
      setAccess: (path, rules) => settingsEdit("setAccess", { path, rules }),
      setAccessMany: (paths, rules) => settingsEdit("setAccessMany", { paths, rules }),
      openAccessFunction: (path, contextName) =>
        wf && send("openAccessFunction", { workflowId: wf.id, path, workflowName: wf.name, contextName }),
      openUsage,
      openInInstance: () => wf && send("openWorkflow", { workflowId: wf.id }),
      openResource: (resource) => send("openResourceScreen", { resource }),
      viewRaw: () => wf && send("viewRawWorkflow", { workflowId: wf.id }),
      reload: () => {
        if (!wf) return;
        send("fetchWorkflow", { workflowId: wf.id });
        send("fetchTriggers", { workflowId: wf.id });
        setRemote(null);
      },
      revealOffline: () => send("revealOfflineFiles"),
      deleteWorkflow: () => wf && send("deleteWorkflow", { workflowId: wf.id }),
      triggers,
      triggerBusy,
      triggerError,
      refreshTriggers: () => {
        if (!wf) return;
        setTriggers((t) => (t ? { ...t, loading: true, error: "" } : t));
        send("fetchTriggers", { workflowId: wf.id });
      },
      saveTrigger: (t) => {
        if (!wf) return;
        setTriggerError(null);
        setTriggerBusy(true);
        if (t.id) send("updateTrigger", { workflowId: wf.id, triggerId: t.id, provider: t.provider, values: t.values, actions: t.actions });
        else send("createTrigger", { workflowId: wf.id, provider: t.provider, values: t.values, actions: t.actions });
      },
      deleteTrigger: (t) => wf && send("deleteTrigger", { workflowId: wf.id, triggerId: t.id, summary: t.summary }),
      bindings,
      bindingSaved,
      hookBusy,
      setHook: (h) => {
        if (!wf) return;
        setHookBusy(true);
        setBindingSaved("");
        send("setLifecycleHook", { ...h, workflowId: wf.id });
      },
      connection,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [busy, settingsError, settingsEdit, subjects, wf, openUsage, triggers, triggerBusy, triggerError, bindings, bindingSaved, hookBusy, connection],
  );

  const formEnv: FormEnv = useMemo(
    () => ({
      resourceNames,
      lookupOptions,
      needLookup: (resource, valueField, labelField) => {
        if (requestedLookups.current.has(resource)) return;
        requestedLookups.current.add(resource);
        send("fetchLookupOptions", { resource, valueField, labelField });
      },
      openDesigner: () => wf && send("openWorkflow", { workflowId: wf.id }),
      openResource: (resource) => send("openResourceScreen", { resource }),
      // a resource's properties, for a Create or Property Updater step (0.3.69)
      fields: (resource) => {
        if (!(resource in resourceFields) && !requestedLookups.current.has("\u0000fields:" + resource)) {
          requestedLookups.current.add("\u0000fields:" + resource);
          send("fetchResourceFields", { resource });
        }
        return resourceFields[resource] ?? null;
      },
      workflowResource: wf && bindings ? bindings.find((b) => b.workflowId === wf.id)?.resource ?? null : null,
      // the access editor's shape ({id, name, detail}) from the Workflows panel's lists
      subjects: () => {
        if (!subjects && !requestedLookups.current.has("\u0000subjects")) {
          requestedLookups.current.add("\u0000subjects");
          send("listAccessSubjects");
        }
        return subjects && {
          groups: subjects.groups.map((g) => ({ id: g.id, name: g.name, detail: g.description ?? undefined })),
          users: subjects.users.map((u) => ({ id: u.id, name: u.name, detail: u.email ?? undefined })),
          permissions: subjects.permissions.map((p) => ({ id: p.id, name: p.name, detail: p.description ?? undefined })),
          error: subjects.error,
        };
      },
    }),
    [resourceNames, lookupOptions, wf, subjects, resourceFields, bindings],
  );

  /** Switch workflows through the list view, so both views always show the same one. */
  const switchWorkflow = useCallback((w: WorkflowSummary) => {
    setWfMenu(false);
    window.dispatchEvent(new CustomEvent("sonover:openWorkflow", { detail: w }));
  }, []);
  // a different workflow: start from a clean selection
  useEffect(() => {
    setSelected(null);
    setSelectedEdge(null);
    setScope({ kind: "tree" });
    setHistory([]);
    setRemote(null);
  }, [currentId]);
  // the clipboard is shared with the list view (and other panels)
  useEffect(() => {
    if (open) send("clipboardState");
  }, [open]);
  // triggers for the workflow panel
  useEffect(() => {
    if (open && wf && scope.kind === "workflow" && (!triggers || triggers.workflowId !== wf.id)) send("fetchTriggers", { workflowId: wf.id });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, wf?.id, scope.kind]);

  // ---- clipboard -----------------------------------------------------------
  const copyStep = useCallback(
    (f: Flow) => {
      if (!wf) return;
      send("copyNode", { workflowId: wf.id, path: f.path });
      toast(`Copied ${titleOf(f, catalog)}`);
    },
    [wf, catalog, toast],
  );
  const copyContents = useCallback(
    (childrenPath: Path, label: string) => {
      if (!wf) return;
      send("copyContents", { workflowId: wf.id, childrenPath, label });
      toast(`Copied the steps in ${label}`);
    },
    [wf, toast],
  );
  const pasteAt = useCallback(
    (at: InsertPoint | null) => {
      if (!clipboard) {
        toast("Nothing has been copied yet.", "error");
        return;
      }
      if (!at) {
        toast("Click a wire first to choose where to paste.", "error");
        return;
      }
      edit("pasteNode", { childrenPath: at.childrenPath, index: at.index });
    },
    [clipboard, edit, toast],
  );

  /** Where a new step goes: the selected wire, after the selected step, or at the end. */
  const insertPoint = useCallback((): InsertPoint | null => {
    if (selectedEdge?.data?.insert) return selectedEdge.data.insert;
    const f = selected?.data.flow;
    if (f) {
      const after = insertAfter(f);
      if (after) return after;
    }
    if (!tree) return null;
    const cp = rootChildrenPath(tree);
    return cp ? { childrenPath: cp, index: rootLength(tree) } : null;
  }, [selected, selectedEdge, tree]);

  const pickAdd = useCallback(
    (operator: string) => {
      setAddMenu(null);
      const at = addAt.current ?? insertPoint();
      addAt.current = null;
      if (!at) {
        toast("Click a wire first to choose where the new step goes.", "error");
        return;
      }
      if (!wf) return;
      if (operator === "__paste") {
        pasteAt(at);
        return;
      }
      if (operator.startsWith("cmd:")) {
        // a command, added straight away as a reference to it
        const cmd = wf.commands.find((c) => c.id === operator.slice(4));
        if (!cmd) return;
        const values: Record<string, string> = { command: cmd.id };
        if ((cmd.parameters ?? []).some((p) => p.required)) {
          setFormErrors([]);
          setForm({ mode: "add", operator: "reference", title: cmd.label, subtitle: "Add command — fill in its parameters", values, delay: null, insert: at });
        } else edit("addOperator", { childrenPath: at.childrenPath, index: at.index, operator: "reference", values, delay: null });
        return;
      }
      const values = defaultsFor(operator, catalog, wf.commands);
      if (needsForm(operator, catalog)) {
        setFormErrors([]);
        setForm({
          mode: "add",
          operator,
          title: addTitle(operator, catalog),
          subtitle: "Add step",
          values,
          delay: null,
          insert: at,
        });
      } else {
        edit("addOperator", { childrenPath: at.childrenPath, index: at.index, operator, values, delay: null });
      }
    },
    [insertPoint, wf, catalog, edit, toast, pasteAt],
  );

  const submitForm = (values: Record<string, string>, delay: number | null) => {
    if (!form) return;
    setFormErrors([]);
    if (form.mode === "add" && form.insert)
      edit("addOperator", {
        childrenPath: form.insert.childrenPath,
        index: form.insert.index,
        operator: form.operator,
        values,
        delay,
      });

  };

  const enterGroup = useCallback(
    (f: Flow | undefined) => {
      if (f?.kind !== "reference") return false;
      const t = trees.find(
        (x) => x.kind === "command" && (x.commandId === f.targetId || x.commandName === f.targetId),
      );
      if (!t) {
        toast("That command isn't in this workflow.", "error");
        return true;
      }
      selectTree(t.key, true);
      return true;
    },
    [trees, selectTree, toast],
  );

  const goBack = useCallback(() => {
    if (!wf || history.length === 0) return false;
    const prev = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    setTreeByWf((m) => ({ ...m, [wf.id]: prev }));
    setSelected(null);
    setSelectedEdge(null);
    return true;
  }, [wf, history]);

  /** A breadcrumb clicked: back to the tree at that place in the history (what came after it is dropped). */
  const goTo = useCallback(
    (index: number) => {
      if (!wf || !history[index]) return;
      const key = history[index];
      setHistory((h) => h.slice(0, index));
      setTreeByWf((m) => ({ ...m, [wf.id]: key }));
      setSelected(null);
      setSelectedEdge(null);
    },
    [wf, history],
  );

  /** Reads the workflow (and the list) again from the instance. */
  const reload = useCallback(() => {
    if (!wf) return;
    send("fetchWorkflows", {});
    send("fetchWorkflow", { workflowId: wf.id });
    toast("Reading the workflow again…");
  }, [wf, toast]);

  // ---- keyboard (Blender bindings) -------------------------------------
  const mouse = useRef({ x: 200, y: 200 });
  const fitRef = useRef<() => void>(() => {});
  useEffect(() => {
    if (!open || !wf) return;
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable)) return;
      if (formRef.current) return;
      // a picker pop-over (date, colour) is open: it handles its own keys
      if (document.querySelector("#sonover-node-view .nv-pop")) return;
      const f = selected?.data.flow;
      const key = e.key.toLowerCase();
      const many = selection.length > 1;
      // the keys come from the Keyboard shortcuts page (src/keys.ts); Escape stays fixed
      const hit = (id: string) => pressed(e, id, shortcuts);
      let handled = true;
      if (many && hit("node.duplicate")) bulk.duplicate(selection);
      else if (many && hit("node.disable")) bulk.mock(selection);
      else if (many && hit("node.delete")) bulk.remove(selection);
      else if (many && hit("node.copy")) bulk.copy(selection);
      else if (hit("node.selectAll")) pickMany(canvasNodes.current.filter(pickableInBox), false);
      else if (hit("node.add")) setAddMenu({ ...mouse.current });
      else if (hit("node.duplicate") && f) doDuplicate(f);
      else if (hit("node.disable") && f) doToggleMock(f);
      else if (hit("node.delete") && f) doDelete(f);
      else if (hit("node.undo")) edit("undoLastEdit", {});
      else if (hit("node.search")) {
        const el = document.getElementById("nv-search") as HTMLInputElement | null;
        el?.focus();
        el?.select();
      } else if (hit("node.copy") && f) copyStep(f);
      else if (hit("node.paste")) pasteAt(insertPoint());
      else if (hit("node.save")) send("saveChanges", { workflowId: wf.id });
      else if (hit("node.panel")) setPanel((p) => !p);
      // the layers panel on the left (T by default, like Blender's T for its left toolbar)
      else if (hit("node.layers")) setLayers((v) => !v);
      else if (hit("node.open")) {
        if (!enterGroup(f)) goBack();
      } else if (hit("node.fit")) fitRef.current();
      else if (hit("node.edit") && f) openEdit(f);
      else if (key === "escape") {
        if (ctxMenu) setCtxMenu(null);
        else if (wfMenu) setWfMenu(false);
        else if (addMenu) {
          addAt.current = null;
          setAddMenu(null);
        }
        else {
          setSelected(null);
          setSelectedEdge(null);
        }
      } else handled = false;
      if (handled) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [open, wf, selected, addMenu, ctxMenu, wfMenu, doDelete, doDuplicate, doToggleMock, edit, enterGroup, goBack, openEdit, copyStep, pasteAt, insertPoint, selection, bulk, shortcuts, pickMany]);

  // ---- render ------------------------------------------------------------
  if (!open) {
    if (!wf) return null;
    return (
      <>
      <button
        className="nv-launch"
        onClick={() => {
          if (document.querySelector("#root .fixed.inset-0")) {
            toast("Close the open dialog in the list view first.", "error");
            return;
          }
          setOpen(true);
        }}
        title="Open this workflow as a node graph"
      >
        <NodeGlyph /> Node view
      </button>
      {toasts.length > 0 && (
        <div className="nv-toasts is-launcher">
          {toasts.map((t) => (
            <div key={t.id} className={`nv-toast is-${t.kind}`}>
              {t.text}
            </div>
          ))}
        </div>
      )}
      </>
    );
  }

  if (!wf) {
    return (
      <div className="nv-root">
        <div className="nv-topbar">
          <span className="nv-spacer" />
          <button className="nv-btn" onClick={() => setOpen(false)}>
            Back to list view
          </button>
        </div>
        <div className="nv-picker-page">
          <WorkflowPicker
            list={workflowList}
            currentId={null}
            onPick={switchWorkflow}
            onNew={() => setNewWf({ name: "", stage: "", error: null, busy: false })}
          />
        </div>
        {newWf && <NewWorkflowDialog state={newWf} setState={setNewWf} />}
      </div>
    );
  }

  const results = query.trim() ? searchWorkflow(wf, catalog, query) : null;
  const highlight = new Set(
    results && tree ? results.steps.find((t) => t.key === tree.key)?.steps.map((h) => pathKey(h.path)) ?? [] : [],
  );
  const collapsed = collapsedByWf[wf.id] ?? [];
  const counts: Record<string, number> = {};
  trees.forEach((t) => (counts[t.key] = countSteps(t.flow)));

  return (
    <div className="nv-root">
      <div className="nv-topbar">
        <button className="nv-wf-switch" onClick={() => setWfMenu((v) => !v)} title="Switch workflow">
          {wf.name} <span className="nv-caret">▾</span>
        </button>
        <span className="nv-spacer" />
        {connection?.offline && (
          <button className="nv-offline" onClick={() => setScope({ kind: "workflow" })} title="The instance is unreachable — edits are kept offline">
            ● Offline{connection.pending.length ? ` · ${connection.pending.reduce((n, x) => n + x.edits, 0)} queued` : ""}
          </button>
        )}
        {busy && <span className="nv-busy">Applying…</span>}
        {draft && draft.pending > 0 && (
          <span className="nv-draft" title={draft.summaries.join("\n")}>
            {draft.pending} unsaved change{draft.pending === 1 ? "" : "s"}
            <button className="nv-btn is-small" onClick={() => send("discardChanges", { workflowId: wf.id })}>
              Discard
            </button>
            <button className="nv-btn is-small is-primary" onClick={() => send("saveChanges", { workflowId: wf.id })}>
              Save
            </button>
          </span>
        )}
        <button className="nv-btn" onClick={() => edit("undoLastEdit", {})} title="Undo (Ctrl+Z)">
          Undo
        </button>
        <button className="nv-btn" onClick={() => setAddMenu({ ...mouse.current })} title="Add a step (Shift+A)">
          + Add
        </button>
        <button
          className="nv-btn nv-dir-toggle"
          onClick={() => setDir((d) => (d === "v" ? "h" : "v"))}
          title={dir === "v" ? "Flow runs top to bottom — switch to left to right" : "Flow runs left to right — switch to top to bottom"}
          aria-label="Flow direction"
        >
          {dir === "v" ? "↕ Vertical" : "↔ Horizontal"}
        </button>
        <button
          className="nv-btn"
          disabled={!!draft?.pending}
          onClick={reload}
          title={draft?.pending ? "Save or discard the unsaved changes first" : "Read the workflow again from the instance"}
        >
          Reload
        </button>
        <button className="nv-btn" disabled={!wf} onClick={() => wf && send("openWorkflow", { workflowId: wf.id })} title="Open this workflow in Saturn, in your browser">
          Open in Saturn ↗
        </button>
        <button className="nv-btn" disabled={!wf} onClick={() => wf && send("viewRawWorkflow", { workflowId: wf.id })} title="The workflow's whole definition as JSON, with the unsaved changes in it, in a tab beside">
          Workflow JSON
        </button>
        <button className="nv-btn" disabled={!wf} onClick={() => send("viewOperatorsJson", {})} title="Every operator this instance offers, with its settings, as Saturn lists them, in a tab beside">
          Operators JSON
        </button>
        <button className={`nv-btn ${layers ? "is-on" : ""}`} onClick={() => setLayers((v) => !v)} title={`The layers panel on the left: stages, actions and commands${hint("node.layers", shortcuts)}`}>
          Layers
        </button>
        <button className={`nv-btn ${panel ? "is-on" : ""}`} onClick={() => setPanel((p) => !p)} title={`Side panel${hint("node.panel", shortcuts)}`}>
          Panel
        </button>
        <button className="nv-btn" onClick={() => setOpen(false)} title="Back to the list editor">
          List view
        </button>
      </div>

      {/* where you are, like a browser's bookmarks bar: the workflow, then each tree opened on the way (Tab), each one clickable */}
      <nav className="nv-crumbbar" aria-label="Where you are">
        <button className="nv-crumb-btn" onClick={() => setScope({ kind: "workflow" })} title="Workflow settings">
          {wf.name}
        </button>
        {history.map((k, i) => (
          <span key={`${k}-${i}`} className="nv-crumb">
            <span aria-hidden="true">›</span>
            <button className="nv-crumb-btn" onClick={() => goTo(i)} title="Go back to this one">
              {trees.find((t) => t.key === k)?.label ?? k}
            </button>
          </span>
        ))}
        {scope.kind === "workflow" ? (
          <span className="nv-crumb is-current">
            <span aria-hidden="true">›</span> Workflow settings
          </span>
        ) : (
          tree && (
            <span className="nv-crumb is-current">
              <span aria-hidden="true">›</span> {tree.label}
            </span>
          )
        )}
        {history.length > 0 && (
          <button className="nv-btn is-small" onClick={goBack} title="Back to the one before (Tab)">
            ⮌ Back
          </button>
        )}
      </nav>

      {remote && remote.workflowId === wf.id && (
        <div className="nv-remote">
          <span>
            <b>Changed outside this editor</b>
            {remote.summary ? ` — ${remote.summary}` : ""}
            {remote.hasDraft ? ". You have unsaved changes here; saving will overwrite theirs." : "."}
          </span>
          <button className="nv-btn is-small" onClick={ops.reload}>Reload</button>
          <button className="nv-btn is-small" onClick={() => setRemote(null)}>Dismiss</button>
        </div>
      )}
      {wfMenu && (
        <div className="nv-menu-back" onMouseDown={() => setWfMenu(false)}>
          <div className="nv-wf-menu" onMouseDown={(e) => e.stopPropagation()}>
            <WorkflowPicker
              list={workflowList}
              currentId={wf.id}
              onPick={switchWorkflow}
              onNew={() => {
                setWfMenu(false);
                setNewWf({ name: "", stage: "", error: null, busy: false });
              }}
            />
          </div>
        </div>
      )}

      <div className="nv-main">
        {!layers && (
          <button className="nv-layers-open" onClick={() => setLayers(true)} title={`Show the layers panel${hint("node.layers", shortcuts)}`} aria-label="Show the layers panel">
            »
          </button>
        )}
        {layers && <Outliner
          onCollapse={() => setLayers(false)}
          wf={wf}
          activeKey={scope.kind === "tree" ? tree?.key : undefined}
          scope={scope}
          addRequest={outlinerAdd}
          onSelectWorkflow={() => {
            setSelected(null);
            setSelectedEdge(null);
            setScope({ kind: "workflow" });
          }}
          onSelectStage={(i) => {
            setSelected(null);
            setSelectedEdge(null);
            setScope({ kind: "stage", index: i });
          }}
          onMoveStage={(from, to) => ops.moveStage(from, to)}
          onMoveAction={(si, from, to) => ops.moveAction(si, from, to)}
          collapsed={collapsed}
          onToggleCollapse={(k) =>
            setCollapsedByWf((m) => {
              const cur = m[wf.id] ?? [];
              return { ...m, [wf.id]: cur.includes(k) ? cur.filter((x) => x !== k) : [...cur, k] };
            })
          }
          onCollapseAll={(close) =>
            setCollapsedByWf((m) => {
              const stages = wf.stages.map((st) => `stage:${st.stage}`);
              const rest = (m[wf.id] ?? []).filter((x) => !x.startsWith("stage:"));
              return { ...m, [wf.id]: close ? [...rest, ...stages] : rest };
            })
          }
          query={query}
          onQuery={setQuery}
          results={results}
          onOpenStep={openStep}
          counts={counts}
          error={outlinerError}
          busy={busy && sourceRef.current === "outliner"}
          doneToken={outlinerDone}
          onSelect={(k) => openTree(k)}
          onCreate={createItem}
          onRename={(kind, path, label) => {
            setOutlinerError(null);
            edit("renameNode", { kind, path, label });
            sourceRef.current = "outliner";
          }}
          onDelete={(kind, path) => {
            setOutlinerError(null);
            edit("deleteNode", { kind, path });
            sourceRef.current = "outliner";
          }}
          onDuplicate={(kind, path) => {
            setOutlinerError(null);
            edit("duplicateItem", { kind, path });
            sourceRef.current = "outliner";
          }}
          onActionToCommand={(paths, index, move) => {
            setOutlinerError(null);
            edit("actionToCommand", { paths, index, move });
            sourceRef.current = "outliner";
          }}
          onCopyActions={(paths, stageIndex, index) => {
            setOutlinerError(null);
            edit("copyActions", { paths, stageIndex, index });
            sourceRef.current = "outliner";
          }}
          onMoveActions={(paths, stageIndex, index) => {
            setOutlinerError(null);
            edit("moveActions", { paths, stageIndex, index });
            sourceRef.current = "outliner";
          }}
          onCommandToAction={(paths, stageIndex, index, move) => {
            setOutlinerError(null);
            edit("commandToAction", { paths, stageIndex, index, move });
            sourceRef.current = "outliner";
          }}
          onDeleteItems={(kind, paths) => {
            setOutlinerError(null);
            edit("deleteItems", { kind, paths });
            sourceRef.current = "outliner";
          }}
          onDuplicateItems={(kind, paths) => {
            setOutlinerError(null);
            edit("duplicateItems", { kind, paths });
            sourceRef.current = "outliner";
          }}
          onMoveStages={(indexes, toIndex) => {
            setOutlinerError(null);
            edit("moveStages", { indexes, toIndex });
            sourceRef.current = "outliner";
          }}
          onPick={setOutlinerPicks}
          onClearError={() => setOutlinerError(null)}
        />}

        <div
          className="nv-canvas"
          onMouseMove={(e) => (mouse.current = { x: e.clientX, y: e.clientY })}
        >
          {scope.kind === "workflow" ? (
            <WorkflowMap
              wf={wf}
              onOpen={(key) => {
                // a stage's header: its settings in the side panel
                if (key.startsWith("stage:")) {
                  const i = wf.stages.findIndex((st) => `stage:${st.stage}` === key);
                  if (i >= 0) {
                    setSelected(null);
                    setSelectedEdge(null);
                    setScope({ kind: "stage", index: i });
                  }
                } else openTree(key);
              }}
              onMove={(t, to) => {
                edit("setStageTransition", { path: t.path, field: STAGE_FIELD, from: t.to, to });
                sourceRef.current = "other";
              }}
            />
          ) : tree ? (
            <ReactFlowProvider>
              <Canvas
                key={wf.id + "|" + tree.key + "|" + dir}
                layoutKey={`${wf.id}::${tree.key}::${dir}`}
                tree={tree}
                catalog={catalog}
                dir={dir}
                selectedId={selected?.id ?? null}
                extraIds={extra.map((n) => n.id)}
                onToggleSelect={(n) => {
                  setSelectedEdge(null);
                  setScope({ kind: "tree" });
                  const inSel = (x: NvNode) => x.id === n.id;
                  if (selected && inSel(selected)) {
                    // remove the primary: the last one picked before it takes over
                    const rest = extra.slice();
                    const next = rest.pop() ?? null;
                    setExtra(rest);
                    setSelected(next);
                  } else if (extra.some(inSel)) setExtra(extra.filter((x) => !inSel(x)));
                  else {
                    if (selected?.data.flow) setExtra([...extra, selected]);
                    setSelected(n);
                  }
                }}
                onPickMany={pickMany}
                onMoveMany={doMoveMany}
                onRefresh={(nodes) => {
                  canvasNodes.current = nodes;
                  setExtra((ex) => ex.map((x) => nodes.find((n) => n.id === x.id)).filter((x): x is NvNode => !!x));
                  setSelected((cur) => (cur ? nodes.find((n) => n.id === cur.id) ?? null : cur));
                }}
                selectedEdgeId={selectedEdge?.id ?? null}
                onSelect={(n) => {
                  setSelected(n);
                  setExtra([]);
                  if (n) {
                    setSelectedEdge(null);
                    setScope({ kind: "tree" });
                  }
                }}
                onSelectEdge={(e) => {
                  setSelectedEdge(e);
                  if (e) setSelected(null);
                }}
                onMove={doMove}
                onOpen={(f) => {
                  if (!enterGroup(f)) openEdit(f);
                }}
                fitRef={fitRef}
                onRow={openRow}
                onAddAt={(at, x, y) => {
                  addAt.current = at;
                  setAddMenu({ x, y });
                }}
                onContext={(node, x, y, at) => setCtxMenu({ x, y, node, at })}
                inSelection={(n) => selection.length > 1 && !!n.data.flow && selection.some((f) => pathKey(f.path) === pathKey(n.data.flow!.path))}
                focusPath={focusPath}
                onFocused={() => setFocusPath(null)}
                highlight={highlight}
              />
            </ReactFlowProvider>
          ) : (
            <div className="nv-empty-state">Nothing to show.</div>
          )}
          <div className="nv-hints" hidden={scope.kind === "workflow"}>
            {[
              ["node.add", "add"],
              ["node.delete", "delete"],
              ["node.duplicate", "duplicate"],
              ["", "drag onto a wire to move"],
              ["", "drag on empty canvas to box-pick · middle-drag or Space+drag to pan"],
              ["node.selectAll", "pick all"],
              ["node.edit", "edit"],
              ["node.open", "open command"],
              ["node.undo", "undo"],
              ["node.panel", "panel"],
              ["node.layers", "layers"],
              ["node.fit", "fit"],
            ]
              .map(([id, what]) => (id ? (keysOf(id, shortcuts)[0] ? `${shownKey(keysOf(id, shortcuts)[0])} ${what}` : "") : what))
              .filter(Boolean)
              .join(" · ")}
          </div>
        </div>

        {!panel && (
          <button className="nv-panel-open" onClick={() => setPanel(true)} title={`Show the panel${hint("node.panel", shortcuts)}`} aria-label="Show the panel">
            «
          </button>
        )}
        {panel && (
          <SidePanel
            onCollapse={() => setPanel(false)}
            scope={scope}
            ops={ops}
            formEnv={formEnv}
            onOpenTree={openTree}
            width={panelWidth}
            onResize={setPanelWidth}
            formWidth={formWidth}
            onFormResize={setFormWidth}
            loaded={selKey && loaded?.key === selKey ? loaded.params : null}
            panelErrors={panelErrors}
            busy={busy}
            focusToken={focusToken}
            onCommit={commitPanel}
            onSwitchCases={(f, rows) => {
              setPanelErrors([]);
              edit("setSwitchCases", { path: f.path, cases: rows });
              sourceRef.current = "panel";
            }}
            wf={wf}
            tree={tree}
            node={selected}
            edgeSel={selectedEdge}
            catalog={catalog}
            onEdit={openEdit}
            onDelete={doDelete}
            onDuplicate={doDuplicate}
            onEnter={(f) => enterGroup(f)}
            onToggleMock={doToggleMock}
            onRow={openRow}
            pickedActions={outlinerPicks.length > 1 && outlinerPicks.every((x) => x.kind === "action") ? outlinerPicks.map((x) => x.path) : null}
            multi={selection}
            multiParams={multiLoaded?.list ?? null}
            onCommitMany={commitMany}
            bulk={bulk}
            draft={draft}
            onUndo={() => edit("undoLastEdit", {})}
            onSave={() => send("saveChanges", { workflowId: wf.id })}
            onDiscard={() => send("discardChanges", { workflowId: wf.id })}
          />
        )}
      </div>

      {addMenu && (
        <AddMenu
          x={addMenu.x}
          y={addMenu.y}
          catalog={catalog}
          hasCommands={wf.commands.length > 0}
          commands={wf.commands}
          clipboard={clipboard}
          onPick={pickAdd}
          onClose={() => {
            addAt.current = null;
            setAddMenu(null);
          }}
        />
      )}

      {form && (
        // the same lookups as the side panel (records for pickers, resource names), 0.3.66
        <FormEnvContext.Provider value={formEnv}>
        <StepForm
          key={form.mode + (form.path ? pathKey(form.path) : "") + form.operator + JSON.stringify(form.values).length}
          title={form.title}
          subtitle={form.subtitle}
          operator={form.operator}
          catalog={catalog}
          commands={wf.commands}
          initial={form.values}
          delay={form.delay}
          errors={formErrors}
          busy={busy}
          onSubmit={submitForm}
          onCancel={() => {
            pendingRead.current = null;
            setForm(null);
          }}
        />
        </FormEnvContext.Provider>
      )}

      {ctxMenu && (
        <NodeMenu
          menu={ctxMenu}
          many={ctxMenu.node && selection.length > 1 && selection.some((f) => ctxMenu.node?.data.flow && pathKey(f.path) === pathKey(ctxMenu.node.data.flow.path)) ? selection : null}
          bulk={bulk}
          clipboard={clipboard}
          onClose={() => setCtxMenu(null)}
          onEdit={(f) => {
            setSelected(ctxMenu.node);
            openEdit(f);
          }}
          onCopy={copyStep}
          onCopyContents={copyContents}
          onPaste={(at) => pasteAt(at)}
          onAdd={(at) => {
            addAt.current = at;
            setAddMenu({ x: ctxMenu.x, y: ctxMenu.y });
          }}
          onDuplicate={doDuplicate}
          onToggleMock={doToggleMock}
          onDelete={doDelete}
          onEnter={(f) => enterGroup(f)}
        />
      )}
      {newWf && <NewWorkflowDialog state={newWf} setState={setNewWf} />}

      <div className="nv-toasts">
        {toasts.map((t) => (
          <div key={t.id} className={`nv-toast is-${t.kind}`}>
            {t.text}
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
function WorkflowPicker(props: {
  list: WorkflowSummary[];
  currentId: string | null;
  onPick: (w: WorkflowSummary) => void;
  onNew: () => void;
}) {
  const [q, setQ] = useState("");
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => ref.current?.focus(), []);
  const shown = props.list.filter((w) => !q.trim() || `${w.name} ${w.id}`.toLowerCase().includes(q.trim().toLowerCase()));
  return (
    <div className="nv-picker">
      <div className="nv-picker-head">
        <input ref={ref} className="nv-menu-search" placeholder="Search workflows..." value={q} onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => { e.stopPropagation(); if (e.key === "Enter" && shown[0]) props.onPick(shown[0]); }} />
        <button className="nv-btn is-primary" onClick={props.onNew}>＋ New workflow</button>
      </div>
      <div className="nv-picker-list">
        {shown.map((w) => (
          <button key={w.id} className={`nv-picker-item ${w.id === props.currentId ? "is-current" : ""}`} onClick={() => props.onPick(w)}>
            <span className="nv-picker-name">{w.name}</span>
            <span className="nv-picker-stages">
              {w.stages.slice(0, 6).map((st) => (
                <span key={st.stage} className="nv-picker-stage" title={st.label} style={{ background: st.color || "#666" }} />
              ))}
            </span>
            <span className="nv-picker-meta">
              {w.stageCount} stage{w.stageCount === 1 ? "" : "s"} · {w.globalActionCount} global action{w.globalActionCount === 1 ? "" : "s"}
              {w.status && w.status !== "active" ? ` · ${w.status}` : ""}
            </span>
          </button>
        ))}
        {shown.length === 0 && <div className="nv-menu-empty">{props.list.length ? "No matches" : "No workflows yet."}</div>}
      </div>
    </div>
  );
}

function NewWorkflowDialog(props: {
  state: { name: string; stage: string; error: string | null; busy: boolean };
  setState: (s: { name: string; stage: string; error: string | null; busy: boolean } | null) => void;
}) {
  const st = props.state;
  const submit = () => {
    if (!st.name.trim() || st.busy) return;
    props.setState({ ...st, busy: true, error: null });
    send("createWorkflow", {
      name: st.name.trim(),
      ...(st.stage.trim() ? { firstStageLabel: st.stage.trim(), firstStageColor: nextStageColor(0) } : {}),
    });
  };
  return (
    <div className="nv-modal-back" onMouseDown={() => !st.busy && props.setState(null)}>
      <form
        className="nv-modal"
        onMouseDown={(e) => e.stopPropagation()}
        onKeyDown={(e) => { e.stopPropagation(); if (e.key === "Escape" && !st.busy) props.setState(null); }}
        onSubmit={(e) => { e.preventDefault(); submit(); }}
      >
        <div className="nv-modal-head">
          <div className="nv-modal-title">New workflow</div>
          <div className="nv-modal-sub">Created on the instance right away (it assigns the id).</div>
        </div>
        <div className="nv-modal-body">
          <label className="nv-field">
            <span className="nv-field-label">Name<span className="nv-req">*</span></span>
            <input autoFocus value={st.name} placeholder="Support Tickets" onChange={(e) => props.setState({ ...st, name: e.target.value, error: null })} />
          </label>
          <label className="nv-field">
            <span className="nv-field-label">First stage</span>
            <input value={st.stage} placeholder="Pending Approval" onChange={(e) => props.setState({ ...st, stage: e.target.value })} />
            <span className="nv-field-help">Optional — you can add stages later.</span>
          </label>
          {st.error && <div className="nv-field-err">{st.error}</div>}
        </div>
        <div className="nv-modal-foot">
          <button type="button" className="nv-btn" disabled={st.busy} onClick={() => props.setState(null)}>Cancel</button>
          <button type="submit" className="nv-btn is-primary" disabled={!st.name.trim() || st.busy}>
            {st.busy ? "Creating…" : "Create workflow"}
          </button>
        </div>
      </form>
    </div>
  );
}

/** Right-click menu on a node (or on the empty canvas). */
function NodeMenu(props: {
  menu: { x: number; y: number; node: NvNode | null; at: InsertPoint | null };
  /** the right-clicked step is part of a multi-selection: act on all of them */
  many: Flow[] | null;
  bulk: BulkOps;
  clipboard: { label: string } | null;
  onClose: () => void;
  onEdit: (f: Flow) => void;
  onCopy: (f: Flow) => void;
  onCopyContents: (childrenPath: Path, label: string) => void;
  onPaste: (at: InsertPoint | null) => void;
  onAdd: (at: InsertPoint | null) => void;
  onDuplicate: (f: Flow) => void;
  onToggleMock: (f: Flow) => void;
  onDelete: (f: Flow) => void;
  onEnter: (f: Flow) => void;
}) {
  const f = props.menu.node?.data.flow;
  const after = f ? insertAfter(f) : props.menu.at;
  const item = (label: string, kbd: string, fn: () => void, danger = false, disabled = false) => (
    <button className={`nv-ctx-item ${danger ? "is-danger" : ""}`} disabled={disabled} onClick={() => { props.onClose(); fn(); }}>
      <span>{label}</span>
      {kbd && <kbd>{kbd}</kbd>}
    </button>
  );
  const contents: { path: Path; label: string }[] = [];
  if (f && (f.kind === "series" || f.kind === "each" || f.kind === "parallel") && f.children.length)
    contents.push({ path: f.childrenPath, label: f.kind === "each" ? "the loop" : f.kind === "parallel" ? "the parallel block" : "the group" });
  if (f?.kind === "if") {
    if (f.whenTrue.length) contents.push({ path: f.truePath, label: "the true branch" });
    if (f.whenFalse.length) contents.push({ path: f.falsePath, label: "the false branch" });
  }
  return (
    <div className="nv-menu-back" onMouseDown={props.onClose} onContextMenu={(e) => { e.preventDefault(); props.onClose(); }}>
      <div className="nv-ctx" style={{ left: Math.min(props.menu.x, window.innerWidth - 230), top: Math.min(props.menu.y, window.innerHeight - 330) }}
        onMouseDown={(e) => e.stopPropagation()}>
        {props.many ? (
          <>
            <div className="nv-ctx-title">{props.many.length} steps selected</div>
            {item(`Copy ${props.many.length} steps`, "Ctrl C", () => props.bulk.copy(props.many!))}
            {item(`Duplicate ${props.many.length} steps`, "Shift D", () => props.bulk.duplicate(props.many!))}
            <div className="nv-ctx-sep" />
            {item(props.many.every((x) => x.mock) ? `Enable ${props.many.length} steps` : `Disable ${props.many.length} steps`, "M", () => props.bulk.mock(props.many!))}
            {item(`Delete ${props.many.length} steps`, "X", () => props.bulk.remove(props.many!), true)}
            <div className="nv-ctx-sep" />
            {item("Clear selection", "Esc", () => props.bulk.clear())}
          </>
        ) : f ? (
          <>
            <div className="nv-ctx-title">{f.kind === "operator" ? f.label : f.kind}</div>
            {f.kind !== "series" && item("Edit settings", "Enter", () => props.onEdit(f))}
            {f.kind === "reference" && item("Open command", "Tab", () => props.onEnter(f))}
            <div className="nv-ctx-sep" />
            {item("Copy", "Ctrl C", () => props.onCopy(f))}
            {contents.map((c) => item(`Copy steps in ${c.label}`, "", () => props.onCopyContents(c.path, c.label)))}
            {item(props.clipboard ? `Paste ${props.clipboard.label} after` : "Paste after", "Ctrl V", () => props.onPaste(after), false, !props.clipboard || !after)}
            {item("Add step after", "Shift A", () => props.onAdd(after), false, !after)}
            {item("Duplicate", "Shift D", () => props.onDuplicate(f))}
            <div className="nv-ctx-sep" />
            {item(f.mock ? "Enable" : "Disable", "M", () => props.onToggleMock(f))}
            {item("Delete", "X", () => props.onDelete(f), true)}
          </>
        ) : (
          <>
            {item("Add step here", "Shift A", () => props.onAdd(props.menu.at), false, !props.menu.at)}
            {item(props.clipboard ? `Paste ${props.clipboard.label} here` : "Paste here", "Ctrl V", () => props.onPaste(props.menu.at), false, !props.clipboard || !props.menu.at)}
          </>
        )}
      </div>
    </div>
  );
}


function addTitle(op: string, catalog: Catalog) {
  return (
    ({ each: "For Each loop", if: "Condition", switch: "Switch", series: "Group", parallel: "Parallel block", reference: "Command" } as Record<string, string>)[op] ??
    catalog[op]?.name ??
    op
  );
}

// ---------------------------------------------------------------------------
/** Where a card was moved and how wide it was made by hand (0.3.69), against where the layout puts it: kept by the
 *  extension per workflow, tree and direction (map-layouts.json, beside the workflow map's), on this computer only. */
type CardPlace = { x: number; y: number; w?: number };
/** A card's name in the kept layout: an operator step by its id (so it keeps its place when steps around it change),
 *  anything else by its node id. */
function placeKey(n: NvNode) {
  const f = n.data.flow;
  return n.data.role === "step" && f?.kind === "operator" && f.stepId ? "s:" + f.stepId : n.id;
}

function Canvas(props: {
  /** where this tree's card places are kept (workflow, tree and direction) */
  layoutKey: string;
  tree: Tree;
  catalog: Catalog;
  dir: LayoutDir;
  selectedId: string | null;
  extraIds: string[];
  onToggleSelect: (n: NvNode) => void;
  /** a box drawn on the empty canvas picked these (add: Ctrl/Cmd was held, keep what was picked) */
  onPickMany: (nodes: NvNode[], add: boolean) => void;
  /** the picked steps were dragged together onto a wire */
  onMoveMany: (to: InsertPoint) => void;
  onRefresh: (nodes: NvNode[]) => void;
  inSelection: (n: NvNode) => boolean;
  selectedEdgeId: string | null;
  onSelect: (n: NvNode | null) => void;
  onSelectEdge: (e: NvEdge | null) => void;
  onMove: (f: Flow, to: InsertPoint) => void;
  onOpen: (f: Flow) => void;
  fitRef: React.MutableRefObject<() => void>;
  onRow: (f: Flow, a: RowAction) => void;
  onAddAt: (at: InsertPoint, x: number, y: number) => void;
  onContext: (node: NvNode | null, x: number, y: number, at: InsertPoint | null) => void;
  focusPath: string | null;
  onFocused: () => void;
  highlight: Set<string>;
}) {
  const { tree, catalog } = props;
  const onAddAtRef = useRef(props.onAddAt);
  onAddAtRef.current = props.onAddAt;
  // cards moved or resized by hand (0.3.69): read when the tree opens; `placesRef` holds every change since
  const [places, setPlaces] = useState<Record<string, CardPlace> | null>(null);
  const placesRef = useRef<Record<string, CardPlace>>({});
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      const { type, payload } = e.data ?? {};
      if (type === "mapLayout" && payload?.workflowId === props.layoutKey) {
        placesRef.current = { ...(payload.positions ?? {}) };
        setPlaces(placesRef.current);
      }
    };
    window.addEventListener("message", onMessage);
    send("fetchMapLayout", { workflowId: props.layoutKey });
    return () => window.removeEventListener("message", onMessage);
  }, [props.layoutKey]);
  const keepPlaces = (next: Record<string, CardPlace>) => {
    placesRef.current = next;
    setPlaces(next);
    send("saveMapLayout", { workflowId: props.layoutKey, positions: Object.keys(next).length ? next : null });
  };
  const resizedRef = useRef<(id: string, width: number) => void>(() => {});
  const rowActions = useMemo(
    () => ({
      open: props.onRow,
      add: (at: InsertPoint, x: number, y: number) => onAddAtRef.current(at, x, y),
      resized: (id: string, width: number) => resizedRef.current(id, width),
    }),
    [props.onRow],
  );
  const [hoverEdge, setHoverEdge] = useState<string | null>(null);
  const hoverTimer = useRef<number | undefined>(undefined);
  const rf = useReactFlow<NvNode, NvEdge>();
  const layout = useMemo(
    () =>
      layoutTree(
        tree.label,
        tree.kind === "command" ? "Command" : "Action",
        tree.flow,
        tree.taskPath,
        catalog,
        props.dir,
      ),
    [tree, catalog, props.dir],
  );
  const selIds = useMemo(() => new Set([props.selectedId, ...props.extraIds].filter(Boolean) as string[]), [props.selectedId, props.extraIds]);
  const selKeyStr = [...selIds].sort().join("|");
  const [nodes, setNodes, onNodesChange] = useNodesState<NvNode>(layout.nodes);
  const [hotEdge, setHotEdge] = useState<string | null>(null);
  // what's being dragged: one step, or (many) every picked step, whose ports and paths a wire must not touch
  const dragging = useRef<{ flow: Flow; flows: Flow[]; ports: Set<string>; many: boolean } | null>(null);
  // a box being drawn: Ctrl/Cmd held adds to what's picked
  const boxAdd = useRef(false);
  const first = useRef(true);

  // the layout's cards, moved and resized as kept
  const placed = useMemo(
    () =>
      layout.nodes.map((n) => {
        const at = places?.[placeKey(n)];
        if (!at) return n;
        const w = at.w && n.data.role === "step" ? at.w : undefined;
        return { ...n, position: { x: n.position.x + at.x, y: n.position.y + at.y }, ...(w ? { width: w, style: { ...n.style, width: w } } : {}) };
      }),
    [layout, places],
  );
  resizedRef.current = (id, width) => {
    const n = layout.nodes.find((x) => x.id === id);
    if (!n) return;
    const k = placeKey(n);
    const at = placesRef.current[k];
    keepPlaces({ ...placesRef.current, [k]: { x: at?.x ?? 0, y: at?.y ?? 0, w: Math.round(width) } });
  };

  useEffect(() => {
    setNodes(placed.map((n) => ({ ...n, selected: selIds.has(n.id) })));
    props.onRefresh(layout.nodes);
    if (first.current) {
      first.current = false;
      // Fit, but never so far out that nodes can't be read: long flows start
      // at a readable zoom anchored on Start, and you pan right (like Blender).
      setTimeout(() => readableFit(rf), 60);
    }
    // a step that disappeared (deleted / moved) can't stay selected, one that
    // is still there should show its fresh settings — and a multi-selection stays
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placed]);

  props.fitRef.current = () => rf.fitView({ padding: 0.15, duration: 250, maxZoom: 1.1 });

  // keep React Flow's selection in step when the app selects a node itself
  useEffect(() => {
    setNodes((ns) =>
      ns.some((n) => !!n.selected !== selIds.has(n.id))
        ? ns.map((n) => (!!n.selected !== selIds.has(n.id) ? { ...n, selected: selIds.has(n.id) } : n))
        : ns,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selKeyStr]);

  // jump to a step (e.g. a command usage): select it and centre it
  useEffect(() => {
    if (!props.focusPath) return;
    const n = layout.nodes.find((x) => x.id === "n:" + props.focusPath || x.id === "h:" + props.focusPath);
    if (!n) return;
    props.onSelect(n);
    props.onFocused();
    setTimeout(() => {
      const i = rf.getInternalNode(n.id);
      if (i) {
        const { x, y } = i.internals.positionAbsolute;
        rf.setCenter(x + (i.measured?.width ?? 200) / 2, y + (i.measured?.height ?? 60) / 2, { zoom: 1, duration: 300 });
      }
    }, 120);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.focusPath, layout]);

  const edges = useMemo(
    () =>
      layout.edges.map((e) => ({
        ...e,
        data: { ...e.data!, hover: e.id === hoverEdge },
        selected: e.id === props.selectedEdgeId,
        className: [
          e.id === hotEdge ? "is-hot" : "",
          e.data?.branch ? `is-${e.data.branch}` : "",
          e.data?.insert ? "" : "is-fixed",
        ].join(" "),
      })),
    [layout, hotEdge, hoverEdge, props.selectedEdgeId],
  );
  const hlKey = [...props.highlight].sort().join("|");
  const shownNodes = useMemo(() => {
    if (!hotEdge?.startsWith("s:") && props.highlight.size === 0) return nodes;
    return nodes.map((n) => {
      const cls = [
        n.id === hotEdge ? "is-hot" : "",
        n.data.flow && n.data.role !== "frame" && props.highlight.has(pathKey(n.data.flow.path)) ? "is-match" : "",
      ].filter(Boolean).join(" ");
      return cls ? { ...n, className: cls } : n;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, hotEdge, hlKey]);

  // --- drop-on-wire (Blender's "insert node on link"): the wire under the cursor ---
  const pointer = (ev: MouseEvent | TouchEvent | React.MouseEvent) => {
    const t = "touches" in ev ? (ev.touches[0] ?? (ev as TouchEvent).changedTouches[0]) : ev;
    return rf.screenToFlowPosition({ x: t.clientX, y: t.clientY });
  };
  const handlePoint = (nodeId: string, handleId: string | null | undefined, kind: "source" | "target") => {
    const n = rf.getInternalNode(nodeId);
    if (!n) return null;
    const hb = n.internals.handleBounds?.[kind]?.find((h) => h.id === handleId) ?? n.internals.handleBounds?.[kind]?.[0];
    const p = n.internals.positionAbsolute;
    if (!hb) return { x: p.x + (kind === "source" ? n.measured?.width ?? 0 : 0), y: p.y + 14 };
    return { x: p.x + hb.x + hb.width / 2, y: p.y + hb.y + hb.height / 2 };
  };
  const nearestEdge = (pt: { x: number; y: number }) => {
    const d = dragging.current;
    if (!d) return null;
    let best: { id: string; dist: number } | null = null;
    const zoom = rf.getZoom();
    for (const e of layout.edges) {
      const ins = e.data?.insert;
      if (!ins) continue;
      if (d.ports.has(e.source) || d.ports.has(e.target)) continue;
      if (d.flows.some((f) => isWithin(ins.childrenPath, f.path))) continue; // can't drop into itself
      const s = handlePoint(e.source, e.sourceHandle, "source");
      const t = handlePoint(e.target, e.targetHandle, "target");
      if (!s || !t) continue;
      const dist = distToBezier(pt, s, t, props.dir === "v");
      if (dist < 28 / zoom && (!best || dist < best.dist)) best = { id: e.id, dist };
    }
    return best?.id ?? null;
  };

  /** An empty-branch slot under the pointer (dropping there moves the step into it). */
  const slotAt = (pt: { x: number; y: number }): string | null => {
    const d = dragging.current;
    if (!d) return null;
    for (const n of layout.nodes) {
      if (n.type !== "slot" || !n.data.insert) continue;
      if (d.flows.some((f) => isWithin(n.data.insert!.childrenPath, f.path))) continue;
      const i = rf.getInternalNode(n.id);
      if (!i) continue;
      const { x, y } = i.internals.positionAbsolute;
      const w = i.measured?.width ?? 0;
      const h = i.measured?.height ?? 0;
      if (pt.x >= x - 8 && pt.x <= x + w + 8 && pt.y >= y - 8 && pt.y <= y + h + 8) return n.id;
    }
    return null;
  };

  const portsOf = (n: NvNode): Set<string> => {
    const f = n.data.flow!;
    const k = pathKey(f.path);
    return n.data.role === "frame" ? new Set([n.id, "h:" + k, "j:" + k]) : new Set([n.id]);
  };

  return (
    <DirContext.Provider value={props.dir}>
    <NodeActions.Provider value={rowActions}>
    <ReactFlow<NvNode, NvEdge>
      nodes={shownNodes}
      edges={edges as Edge[] as NvEdge[]}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      onNodesChange={onNodesChange}
      minZoom={0.1}
      maxZoom={2.5}
      nodesConnectable={false}
      edgesFocusable={false}
      deleteKeyCode={null}
      selectionKeyCode={null}
      multiSelectionKeyCode="Shift"
      // drag on the empty canvas draws a box that picks the steps inside it; the middle button, or Space + drag, pans
      selectionOnDrag
      panOnDrag={[1]}
      selectionMode={SelectionMode.Full}
      onSelectionStart={(ev) => {
        boxAdd.current = ev.ctrlKey || ev.metaKey || ev.shiftKey;
      }}
      onSelectionEnd={() => {
        const picked = rf.getNodes().filter((n) => n.selected && pickableInBox(n as NvNode)) as NvNode[];
        props.onPickMany(picked, boxAdd.current);
      }}
      className={`nv-dir-${props.dir}`}
      zoomOnDoubleClick={false}
      proOptions={{ hideAttribution: true }}
      onNodeClick={(ev, n) => {
        const node = n as NvNode;
        if (node.data.role === "slot" && node.data.insert) {
          props.onAddAt(node.data.insert, ev.clientX, ev.clientY);
          return;
        }
        const pickable = node.data.role === "step" || node.data.role === "head" || node.data.role === "frame";
        if (pickable && (ev.shiftKey || ev.metaKey || ev.ctrlKey)) props.onToggleSelect(node);
        else if (pickable) props.onSelect(node);
        else props.onSelect(null);
      }}
      onNodeDoubleClick={(_, n) => {
        const f = (n as NvNode).data.flow;
        if (f) props.onOpen(f);
      }}
      onEdgeClick={(_, e) => props.onSelectEdge(e as NvEdge)}
      onNodeContextMenu={(ev, n) => {
        ev.preventDefault();
        const node = n as NvNode;
        if (node.data.role === "slot") props.onContext(null, ev.clientX, ev.clientY, node.data.insert ?? null);
        else if (node.data.flow) {
          // right-click inside a multi-selection keeps it, so the menu acts on all of them
          if (!props.inSelection(node)) props.onSelect(node);
          props.onContext(node, ev.clientX, ev.clientY, null);
        }
      }}
      onEdgeContextMenu={(ev, e) => {
        ev.preventDefault();
        props.onSelectEdge(e as NvEdge);
        props.onContext(null, ev.clientX, ev.clientY, (e as NvEdge).data?.insert ?? null);
      }}
      onPaneContextMenu={(ev) => {
        ev.preventDefault();
        const end = layout.edges.find((x) => x.target === "end")?.data?.insert ?? null;
        props.onContext(null, ev.clientX, ev.clientY, end);
      }}
      onPaneClick={() => {
        props.onSelect(null);
        props.onSelectEdge(null);
      }}
      onNodeDragStart={(_, n) => {
        const node = n as NvNode;
        const movable = (node.data.role === "step" || node.data.role === "frame") && !!node.data.flow;
        // a picked step dragged: every picked step goes along
        if (movable && props.inSelection(node)) {
          const picked = layout.nodes.filter((x) => pickableInBox(x) && props.inSelection(x));
          const ports = new Set<string>();
          for (const x of picked) for (const id of portsOf(x)) ports.add(id);
          dragging.current = { flow: node.data.flow!, flows: picked.map((x) => x.data.flow!), ports, many: true };
          return;
        }
        if (movable) dragging.current = { flow: node.data.flow!, flows: [node.data.flow!], ports: portsOf(node), many: false };
        else dragging.current = null;
        props.onSelect(movable ? node : null);
      }}
      onNodeDrag={(ev) => {
        if (!dragging.current) return;
        const pt = pointer(ev);
        setHotEdge(slotAt(pt) ?? nearestEdge(pt));
      }}
      onNodeDragStop={(ev, _node, moved) => {
        const d = dragging.current;
        const pt = pointer(ev);
        const target = d ? slotAt(pt) ?? nearestEdge(pt) : null;
        dragging.current = null;
        setHotEdge(null);
        // let go away from a wire: the cards stay where they were put (0.3.69); onto a wire, they move there and
        // the layout places them again
        const next = { ...placesRef.current };
        for (const m of moved as NvNode[]) {
          const auto = layout.nodes.find((x) => x.id === m.id);
          if (!auto) continue;
          const k = placeKey(auto);
          if (target) delete next[k];
          else next[k] = { ...next[k], x: Math.round(m.position.x - auto.position.x), y: Math.round(m.position.y - auto.position.y) };
        }
        keepPlaces(next);
        if (!d || !target) return;
        const ins = target.startsWith("s:")
          ? layout.nodes.find((x) => x.id === target)?.data.insert
          : layout.edges.find((x) => x.id === target)?.data?.insert;
        if (ins && d.many) props.onMoveMany(ins);
        else if (ins) props.onMove(d.flow, ins);
      }}
      onEdgeMouseEnter={(_, e) => {
        window.clearTimeout(hoverTimer.current);
        setHoverEdge(e.id);
      }}
      onEdgeMouseLeave={() => {
        // linger so the pointer can reach the + button
        window.clearTimeout(hoverTimer.current);
        hoverTimer.current = window.setTimeout(() => setHoverEdge(null), 450);
      }}
    >
      <Background variant={BackgroundVariant.Lines} gap={40} color="var(--nv-grid)" />
      {places && Object.keys(places).length > 0 && (
        <FlowPanel position="top-right">
          <button type="button" className="nv-btn is-small nv-reset-layout" title="Put every card back where the layout places it, at its normal width" onClick={() => keepPlaces({})}>
            Reset layout
          </button>
        </FlowPanel>
      )}
      <MiniMap
        pannable
        zoomable
        nodeColor={(n: Node) => {
          const d = (n as NvNode).data;
          return d.role === "frame" ? "rgba(255,255,255,0.06)" : d.color ?? categoryColor(null);
        }}
        maskColor="rgba(0,0,0,0.55)"
        style={{ background: "#232323" }}
      />
    </ReactFlow>
    </NodeActions.Provider>
    </DirContext.Provider>
  );
}

/** Nodes a box (or Select all) picks: steps and groups, not the head card, slots or reroutes. */
function pickableInBox(n: NvNode) {
  return (n.data.role === "step" || n.data.role === "frame") && !!n.data.flow;
}

const READABLE_ZOOM = 0.8;
function readableFit(rf: ReturnType<typeof useReactFlow<NvNode, NvEdge>>) {
  const nodes = rf.getNodes().filter((n) => !n.parentId);
  if (!nodes.length) return;
  const el = document.querySelector("#sonover-node-view .react-flow") as HTMLElement | null;
  const W = el?.clientWidth ?? 800;
  const H = el?.clientHeight ?? 600;
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const n of nodes) {
    const w = n.measured?.width ?? (n.style?.width as number) ?? 200;
    const h = n.measured?.height ?? (n.style?.height as number) ?? 80;
    minX = Math.min(minX, n.position.x);
    minY = Math.min(minY, n.position.y);
    maxX = Math.max(maxX, n.position.x + w);
    maxY = Math.max(maxY, n.position.y + h);
  }
  const pad = 48;
  const fitZoom = Math.min((W - pad * 2) / (maxX - minX), (H - pad * 2) / (maxY - minY), 1.1);
  if (fitZoom >= READABLE_ZOOM) {
    rf.fitView({ padding: 0.12, maxZoom: 1.1 });
    return;
  }
  const z = READABLE_ZOOM;
  const tallFits = (maxY - minY) * z <= H - pad * 2;
  const wideFits = (maxX - minX) * z <= W - pad * 2;
  rf.setViewport({
    x: wideFits ? W / 2 - ((minX + maxX) / 2) * z : pad - minX * z,
    y: tallFits ? H / 2 - ((minY + maxY) / 2) * z : pad - minY * z,
    zoom: z,
  });
}

/** Distance from p to React Flow's default bezier between s (right) and t (left). */
function distToBezier(p: { x: number; y: number }, s: { x: number; y: number }, t: { x: number; y: number }, vertical = false) {
  const off = (d: number) => (d >= 0 ? 0.5 * d : 0.25 * 25 * Math.sqrt(-d));
  const c1 = vertical ? { x: s.x, y: s.y + off(t.y - s.y) } : { x: s.x + off(t.x - s.x), y: s.y };
  const c2 = vertical ? { x: t.x, y: t.y - off(t.y - s.y) } : { x: t.x - off(t.x - s.x), y: t.y };
  let best = Infinity;
  for (let i = 0; i <= 24; i++) {
    const u = i / 24;
    const a = (1 - u) ** 3,
      b = 3 * (1 - u) ** 2 * u,
      c = 3 * (1 - u) * u * u,
      d = u ** 3;
    const x = a * s.x + b * c1.x + c * c2.x + d * t.x;
    const y = a * s.y + b * c1.y + c * c2.y + d * t.y;
    best = Math.min(best, Math.hypot(p.x - x, p.y - y));
  }
  return best;
}

// ---------------------------------------------------------------------------
function AddMenu(props: {
  x: number;
  y: number;
  catalog: Catalog;
  hasCommands: boolean;
  commands: CommandView[];
  clipboard: { label: string; count: number; sourceWorkflowName: string } | null;
  onPick: (op: string) => void;
  onClose: () => void;
}) {
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => input.current?.focus(), []);

  const items = useMemo(() => {
    const flow = [
      ...(props.clipboard
        ? [{ op: "__paste", name: `Paste ${props.clipboard.label}`, cat: "Clipboard", color: "#8a8a8a" }]
        : []),
      { op: "each", name: "For Each loop", cat: "Flow control", color: KIND_COLORS.each },
      { op: "if", name: "Condition (If)", cat: "Flow control", color: KIND_COLORS.if },
      { op: "switch", name: "Switch (cases)", cat: "Flow control", color: KIND_COLORS.switch },
      { op: "parallel", name: "Parallel block", cat: "Flow control", color: KIND_COLORS.parallel },
      { op: "series", name: "Group", cat: "Flow control", color: KIND_COLORS.series },
    ];
    // every command, added directly as a step (like an operator)
    const cmds = props.commands.map((c) => ({
      op: `cmd:${c.id}`,
      name: c.label,
      cat: "Commands",
      color: KIND_COLORS.reference,
      extra: c.name,
    }));
    // operators Saturn marks disabled aren't offered (a step that already uses one still shows)
    const ops = Object.entries(props.catalog)
      .filter(([, e]) => !e.disabled)
      .map(([op, e]) => ({ op, name: e.name || op, cat: e.category || "Operators", color: categoryColor(e.category ?? op), desc: e.description ?? undefined }))
      .sort((a, b) => a.cat.localeCompare(b.cat) || a.name.localeCompare(b.name));
    const all: { op: string; name: string; cat: string; color: string; extra?: string; desc?: string }[] = [...flow, ...cmds, ...ops];
    const phrase = q.trim().toLowerCase();
    const words = phrase.split(/\s+/).filter(Boolean);
    if (!words.length) return all;
    // closest first: exact name, name starts with it, phrase anywhere, then all the words
    const rank = (i: (typeof all)[number]) => {
      const name = i.name.toLowerCase();
      if (name === phrase) return 0;
      if (name.startsWith(phrase)) return 1;
      if (name.includes(phrase) || (i.extra ?? "").toLowerCase().includes(phrase.replace(/\s+/g, "_"))) return 2;
      return 3;
    };
    return all
      .filter((i) => {
        const hay = `${i.name} ${i.op} ${i.cat} ${i.extra ?? ""}`.toLowerCase();
        return words.every((w) => hay.includes(w));
      })
      .map((i, n) => ({ i, n, r: rank(i) }))
      .sort((a, b) => a.r - b.r || a.n - b.n)
      .map((x) => x.i);
  }, [props.catalog, props.commands, props.clipboard, q]);

  useEffect(() => setIdx(0), [q]);
  const left = Math.min(props.x, window.innerWidth - 300);
  const top = Math.min(props.y, window.innerHeight - 420);
  let lastCat = "";
  return (
    <div className="nv-menu-back" onMouseDown={props.onClose}>
      <div className="nv-menu" style={{ left: Math.max(8, left), top: Math.max(8, top) }} onMouseDown={(e) => e.stopPropagation()}>
        <div className="nv-menu-title">Add</div>
        <input
          ref={input}
          className="nv-menu-search"
          placeholder="Search…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") setIdx((i) => Math.min(items.length - 1, i + 1));
            else if (e.key === "ArrowUp") setIdx((i) => Math.max(0, i - 1));
            else if (e.key === "Enter" && items[idx]) props.onPick(items[idx].op);
            else if (e.key === "Escape") props.onClose();
            else return;
            e.preventDefault();
            e.stopPropagation();
          }}
        />
        <div className="nv-menu-list">
          {items.map((it, i) => {
            const head = !q && it.cat !== lastCat ? it.cat : null;
            lastCat = it.cat;
            return (
              <div key={it.op}>
                {head && <div className="nv-menu-cat">{head}</div>}
                <button
                  className={`nv-menu-item ${i === idx ? "is-active" : ""}`}
                  title={it.desc}
                  onMouseEnter={() => setIdx(i)}
                  onClick={() => props.onPick(it.op)}
                >
                  <span className="nv-menu-dot" style={{ background: it.color }} />
                  {it.name}
                  {q && <span className="nv-menu-itemcat">{it.cat}</span>}
                </button>
              </div>
            );
          })}
          {items.length === 0 && <div className="nv-menu-empty">No matches</div>}
          {Object.keys(props.catalog).length === 0 && !q && (
            <div className="nv-menu-empty">Operator catalog still loading…</div>
          )}
        </div>
      </div>
    </div>
  );
}

function NodeGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true" style={{ verticalAlign: "-2px" }}>
      <rect x="1" y="2" width="5" height="5" rx="1" fill="currentColor" />
      <rect x="10" y="9" width="5" height="5" rx="1" fill="currentColor" />
      <path d="M6 4.5 C 9 4.5, 7 11.5, 10 11.5" stroke="currentColor" strokeWidth="1.4" fill="none" />
    </svg>
  );
}
