// The Menus screen (0.3.30), styled like the Resources screen. Three columns: the menus (drag to
// reorder, + to add one), the picked menu's tabs (a tab folds open to show its sub-tabs; drag them
// to reorder, into another tab or out of one; several can be picked), and the settings: the menu's
// own label, icon and who can see it at the top, the picked tab's settings below. A problem shows
// beside the menu, tab or setting it's about. Each menu keeps its own unsaved changes; Save writes
// them all, one menu after another, then the new order. The host side is MenusPanel in
// host/extension.js (the same messages the old screen used, plus openInSaturn and openResourceScreen).
import { createRoot } from "react-dom/client";
import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { Switch } from "../src-res/editor";
import editorCss from "../src-res/editor.css";
import css from "./menus.css";
import { hint, listenForShortcuts, pressed, type Bindings } from "../src/keys";
import { FaIcon, IconField, isIcon } from "../src-res/icons";
import { AccessBox } from "./access";
import { Mark, Row, TabSettings, type Host } from "./tabsettings";
import {
  RULE_KINDS, accessSummary, bodyOf, checkMenu, clone, find, flat, newResourceTab, referencesOf, ruleRows, rulesToSave, same, tabName, tabTarget, treeOf,
  type Field, type Group, type Menu, type MenuBody, type Node, type Page, type Problem, type Rule, type SavedView, type Subjects, type Tab, type ViewSpec,
} from "./model";

declare function acquireVsCodeApi(): { postMessage: (m: unknown) => void; getState: () => unknown; setState: (s: unknown) => void };
const vscode = acquireVsCodeApi();
const post = (m: Record<string, unknown>) => vscode.postMessage(m);

/** A menu's unsaved changes: its label, icon, rules and tabs as edited. */
interface Work { label: string; icon: string; access_control: Rule[]; nodes: Node[]; isNew?: boolean }
/** What's kept while the screen is hidden or reloaded. */
interface Saved { works?: Record<string, Work>; order?: string[] | null; current?: string | null; picked?: string[]; folded?: string[]; listHidden?: boolean; deletedMenus?: string[] }
type Drop = { parent: string | null; before: string | null } | { into: string };

/** Settings copied from a tab, by group (the caption is never copied). */
const COPY_GROUPS: { id: string; title: string; hint: string; keys: string[]; on: boolean }[] = [
  { id: "opens", title: "What it opens", hint: "The resource, page or dashboard, the filter, views and columns.", keys: ["type", "resource", "page", "dashboard", "filter", "filter_function", "sorts", "views", "default_view"], on: false },
  { id: "look", title: "Look", hint: "The tab icon and colours.", keys: ["tab_icon", "tab_bg_color", "tab_active_bg_color"], on: true },
  { id: "behaviour", title: "Behaviour", hint: "The create button label and the three switches.", keys: ["create_label", "openOnCreate", "disableBatchActions", "reloadOnStatusChange"], on: true },
];
const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;
let nextId = 1;
const freshId = (kind: string) => `${kind}-${Date.now().toString(36)}-${nextId++}`;

function App() {
  const saved = (vscode.getState() as Saved | undefined) ?? {};
  const [menus, setMenus] = useState<Menu[] | null>(null);
  const [instanceName, setInstanceName] = useState("");
  const [groups, setGroups] = useState<Group[] | null>(null);
  const [resources, setResources] = useState<string[] | null>(null);
  const [pages, setPages] = useState<Page[] | null>(null);
  const [savedViews, setSavedViews] = useState<SavedView[] | null>(null);
  const [dialect, setDialect] = useState("bare");
  const [undoable, setUndoable] = useState<string[]>([]);
  const [fields, setFields] = useState<Map<string, Field[]>>(new Map());
  const [subjects, setSubjects] = useState<Subjects | null>(null);
  const [loading, setLoading] = useState(true);
  const [works, setWorks] = useState<Record<string, Work>>(saved.works ?? {});
  const [order, setOrder] = useState<string[] | null>(saved.order ?? null);
  const [current, setCurrent] = useState<string | null>(saved.current ?? null);
  const [picked, setPicked] = useState<string[]>(saved.picked ?? []);
  const [folded, setFolded] = useState<string[]>(saved.folded ?? []);
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [saving, setSaving] = useState<{ queue: string[]; now: string | null } | null>(null);
  // the menus being dragged (several when picked), and where they'd go
  const [menuDrag, setMenuDrag] = useState<{ ids: string[]; at: number | null } | null>(null);
  // several menus picked (Ctrl/Cmd or Shift+click on their cards): moved, deleted and edited together
  const [pickedMenus, setPickedMenus] = useState<string[]>([]);
  // menus crossed out: deleted when you press Save (0.3.61)
  const [deletedMenus, setDeletedMenus] = useState<string[]>(saved.deletedMenus ?? []);
  // tabs dropped on another menu: Copy or Move (0.3.61)
  const [tabsTo, setTabsTo] = useState<{ x: number; y: number; ids: string[]; to: string } | null>(null);
  const [tabOver, setTabOver] = useState<string | null>(null);
  const [tabDrag, setTabDrag] = useState<{ ids: string[]; drop: Drop | null } | null>(null);
  const [context, setContext] = useState<{ x: number; y: number; on: "menu" | "tab"; id: string } | null>(null);
  const [clipboard, setClipboard] = useState<{ from: string; tab: Tab } | null>(null);
  const [pasting, setPasting] = useState<Record<string, boolean> | null>(null);
  const [access, setAccess] = useState(false);
  const anchor = useRef<string | null>(null);
  const asked = useRef(new Set<string>());
  const requests = useRef(new Map<string, (v: never) => void>());
  const counter = useRef(0);

  // the menus list folded away (the strip at the left brings it back; T by default)
  const [listHidden, setListHidden] = useState(saved.listHidden ?? false);
  // the keys the shortcuts use (the Keyboard shortcuts page's, else the defaults)
  const [shortcuts, setShortcuts] = useState<Bindings>({});
  useEffect(() => listenForShortcuts((type, payload) => post({ type, ...payload }), setShortcuts), []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      const typing = !!el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));
      if (!typing && pressed(e, "menus.list", shortcuts)) {
        e.preventDefault();
        setListHidden((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [shortcuts]);

  useEffect(() => { vscode.setState({ works, order, current, picked, folded, listHidden, deletedMenus } satisfies Saved); }, [works, order, current, picked, folded, listHidden, deletedMenus]);

  // ---- host messages ----------------------------------------------------------------------------
  useEffect(() => {
    const on = (ev: MessageEvent) => {
      const m = ev.data;
      switch (m?.type) {
        case "state":
          setMenus(Array.isArray(m.menus) ? m.menus : []);
          setInstanceName(m.instanceName ?? "");
          setGroups(m.groups ?? null);
          setResources(m.resources ?? null);
          setPages(m.pages ?? null);
          setSavedViews(m.savedViews ?? null);
          setDialect(m.dialect === "prefixed" ? "prefixed" : "bare");
          setUndoable(Array.isArray(m.undoable) ? m.undoable : []);
          break;
        case "loading": setLoading(!!m.busy); break;
        case "fields": setFields((f) => new Map(f).set(m.resource, Array.isArray(m.fields) ? m.fields : [])); break;
        case "accessSubjects": setSubjects(m.subjects ?? { groups: [], users: [], permissions: [], error: "Not available." }); break;
        case "count":
        case "viewCreated": {
          const done = requests.current.get(m.requestId);
          requests.current.delete(m.requestId);
          (done as ((v: unknown) => void) | undefined)?.(m.type === "count" ? { count: typeof m.count === "number" ? m.count : null, error: m.error } : { view: m.view, error: m.error });
          break;
        }
        case "saved": savedOne(m.id ?? null, Array.isArray(m.unsaved) ? m.unsaved : []); break;
        case "deleted":
          setWorks((w) => { const n = { ...w }; delete n[m.id]; return n; });
          setOrder((o) => o && o.filter((x) => x !== m.id));
          setCurrent((c) => (c === m.id ? null : c));
          setDeletedMenus((d) => d.filter((x) => x !== m.id));
          setPickedMenus((d) => d.filter((x) => x !== m.id));
          deletedOne(m.id);
          break;
        case "error":
          setLoading(false);
          if (queue.current) { queue.current = null; setSaving(null); setNotice({ kind: "error", text: `Saving stopped: ${m.message ?? "something went wrong."} What wasn't saved is still here.` }); }
          else setNotice({ kind: "error", text: String(m.message ?? "Something went wrong.") });
          break;
      }
    };
    window.addEventListener("message", on);
    post({ type: "ready" });
    return () => window.removeEventListener("message", on);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- the host bridge for the settings -----------------------------------------------------------
  const ask = useCallback(<T,>(type: string, extra: Record<string, unknown>) => new Promise<T>((done) => {
    const requestId = `r${++counter.current}`;
    requests.current.set(requestId, done as (v: never) => void);
    post({ type, requestId, ...extra });
  }), []);
  const loadFields = useCallback((resource: string) => {
    if (!resource || asked.current.has(resource)) return;
    asked.current.add(resource);
    post({ type: "loadFields", resource });
  }, []);
  const host: Host = useMemo(() => ({
    resources, pages, savedViews, dialect, fields, loadFields,
    count: (resource: string, filter: string) => ask<{ count: number | null; error?: string }>("count", { resource, filter }),
    createView: (view: ViewSpec) => ask<{ view?: SavedView; error?: string }>("createView", { view }),
    openResource: (resource: string) => post({ type: "openResourceScreen", resource }),
  }), [resources, pages, savedViews, dialect, fields, loadFields, ask]);

  // ---- menus, as saved and as edited ----------------------------------------------------------------
  const byId = useMemo(() => new Map((menus ?? []).map((m) => [m.id, m])), [menus]);
  const newIds = Object.keys(works).filter((id) => works[id].isNew);
  const ids = useMemo(() => {
    const server = (menus ?? []).map((m) => m.id);
    const all = [...server, ...newIds];
    if (!order) return all;
    return [...order.filter((id) => all.includes(id)), ...all.filter((id) => !order.includes(id))];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menus, order, newIds.join("|")]);
  const workOf = useCallback((id: string): Work | null => {
    if (works[id]) return works[id];
    const m = byId.get(id);
    return m ? { label: m.label, icon: m.icon, access_control: m.access_control, nodes: treeOf(m.id, m.references) } : null;
  }, [works, byId]);
  const bodyFor = useCallback((id: string): MenuBody | null => {
    const w = workOf(id);
    if (!w) return null;
    return { label: w.label, icon: w.icon, order: byId.get(id)?.order ?? 0, access_control: w.access_control, references: referencesOf(w.nodes).references };
  }, [workOf, byId]);
  const isDirty = useCallback((id: string) => {
    const w = works[id];
    if (!w) return false;
    if (w.isNew) return true;
    const m = byId.get(id);
    const b = bodyFor(id);
    return !m || !b || !same({ ...b, order: 0 }, { ...bodyOf(m), order: 0 });
  }, [works, byId, bodyFor]);
  const serverOrder = (menus ?? []).map((m) => m.id);
  const orderChanged = !!order && !same(ids.filter((id) => byId.has(id)), serverOrder);
  // the menus crossed out that are on the instance (a new one crossed out is simply dropped)
  const deleting = deletedMenus.filter((id) => byId.has(id));
  const dirtyIds = ids.filter((id) => isDirty(id) && !deleting.includes(id));
  const dirty = dirtyIds.length > 0 || orderChanged || deleting.length > 0;

  /** Changes one menu's work (starting from what's saved); a work that's back to what's saved is dropped. */
  const update = (id: string, change: (w: Work) => Work) => {
    const before = workOf(id);
    if (!before) return;
    const next = change(clone(before));
    setWorks((all) => {
      const m = byId.get(id);
      const n = { ...all, [id]: next };
      if (m && !next.isNew && same({ label: next.label, icon: next.icon, access_control: next.access_control, references: referencesOf(next.nodes).references }, { label: m.label, icon: m.icon, access_control: m.access_control, references: m.references }) && !next.nodes.some((x) => x.removed || x.subs.some((s) => s.removed))) delete n[id];
      return n;
    });
  };

  // ---- checks ---------------------------------------------------------------------------------------
  const ctx = useMemo(() => ({
    resources: resources ? new Set(resources) : null,
    fields: new Map([...fields].map(([r, fs]) => [r, new Set(fs.map((f) => f.key))])),
    groups: groups ? new Set(groups.map((g) => g.id)) : null,
    pages: pages ? new Map(pages.map((p) => [p.slug, p])) : null,
    savedViews,
    iconExists: isIcon,
  }), [resources, fields, groups, pages, savedViews]);
  /** Each menu's problems, the menu's own and each tab's by its node id. */
  const problems = useMemo(() => {
    const out = new Map<string, { menu: Problem[]; byNode: Map<string, Problem[]>; all: Problem[] }>();
    for (const id of ids) {
      const w = workOf(id);
      if (!w) continue;
      const { references, places } = referencesOf(w.nodes);
      const all = checkMenu({ label: w.label, icon: w.icon, order: 0, access_control: w.access_control, references }, ctx);
      const at = new Map<string, string>();
      for (const [nid, p] of places) at.set(`${p.tab}.${p.sub}`, nid);
      const byNode = new Map<string, Problem[]>();
      for (const p of all) {
        if (p.tab === null) continue;
        const nid = at.get(`${p.tab}.${p.sub}`);
        if (nid) byNode.set(nid, [...(byNode.get(nid) ?? []), p]);
      }
      out.set(id, { menu: all.filter((p) => p.tab === null), byNode, all });
    }
    return out;
  }, [ids, workOf, ctx]);
  const errorsIn = dirtyIds.filter((id) => problems.get(id)?.all.some((p) => p.level === "error"));
  // the fields of every resource a tab of the picked menu opens (for the checks and pickers)
  useEffect(() => {
    const w = current ? workOf(current) : null;
    for (const n of w ? flat(w.nodes) : []) { const t = tabTarget(n.tab); if (t.kind === "resource" && t.value) loadFields(t.value); }
  }, [current, workOf, loadFields]);

  // the picked menu: kept if it's still there, else the first
  useEffect(() => {
    if (menus === null) return;
    if (!current || !ids.includes(current)) setCurrent(ids[0] ?? null);
  }, [menus, ids, current]);

  // ---- saving -----------------------------------------------------------------------------------------
  // the menus left to save, the one being saved, and the order to write once they're all done
  const queue = useRef<{ left: string[]; deletes: string[]; now: string | null; order: string[] | null } | null>(null);
  const bodyRef = useRef(bodyFor);
  bodyRef.current = bodyFor;
  const worksRef = useRef(works);
  worksRef.current = works;
  /** Sends the next menu in the queue, or (none left) the new order. */
  const sendNext = () => {
    const q = queue.current;
    if (!q) return;
    const id = q.left.shift();
    // the saves done: the menus crossed out are deleted, one at a time (the confirm before Save named them)
    if (!id && q.deletes.length) {
      const del = q.deletes.shift()!;
      q.now = del;
      setSaving({ queue: [...q.deletes], now: del });
      post({ type: "delete", id: del, confirmed: true });
      return;
    }
    if (!id) {
      if (q.order) post({ type: "reorder", ids: q.order });
      queue.current = null;
      setSaving(null);
      setOrder(null);
      setNotice({ kind: "ok", text: "Saved." });
      return;
    }
    q.now = id;
    setSaving({ queue: [...q.left], now: id });
    post({ type: "save", id: worksRef.current[id]?.isNew ? null : id, menu: bodyRef.current(id) });
  };
  /** One menu deleted while saving: on to the next. */
  function deletedOne(id: string) {
    const q = queue.current;
    if (!q || q.now !== id) return;
    q.order = q.order && q.order.filter((x) => x !== id);
    sendNext();
  }
  /** One menu saved: its changes are now the instance's; a new one now has the instance's id. */
  function savedOne(id: string | null, unsaved: string[]) {
    const q = queue.current;
    if (!q || !q.now) return;
    const was = q.now;
    setWorks((w) => { const n = { ...w }; delete n[was]; return n; });
    if (id && id !== was) {
      q.order = q.order && q.order.map((x) => (x === was ? id : x));
      setOrder((o) => o && o.map((x) => (x === was ? id : x)));
      setCurrent((c) => (c === was ? id : c));
    }
    if (unsaved.length) {
      queue.current = null;
      setSaving(null);
      setNotice({ kind: "error", text: `Saved, but the instance didn't keep: ${unsaved.join(", ")}. Saving stopped there.` });
      return;
    }
    sendNext();
  }
  const startSave = () => {
    setConfirming(false);
    setNotice(null);
    // the order, once the new menus have ids: written only when it changed
    queue.current = { left: [...dirtyIds], deletes: [...deleting], now: null, order: orderChanged || (order && newIds.length) ? ids.filter((id) => !deleting.includes(id)) : null };
    sendNext();
  };
  const discardAll = () => { setWorks({}); setOrder(null); setDeletedMenus([]); setConfirming(false); setNotice(null); };

  // ---- the picked menu and its tabs ---------------------------------------------------------------------
  const menuWork = current ? workOf(current) : null;
  const nodes = menuWork?.nodes ?? [];
  const pickedNodes = picked.map((id) => find(nodes, id)).filter((x): x is { node: Node; parent: Node | null } => !!x);
  const menuProblems = current ? problems.get(current) : undefined;
  const isFolded = (id: string) => folded.includes(id);
  /** The rows shown, in order (a folded tab's sub-tabs are hidden). */
  const visible = nodes.flatMap((n) => [n, ...(isFolded(n.id) ? [] : n.subs)]);
  const setNodes = (change: (ns: Node[]) => Node[]) => current && update(current, (w) => ({ ...w, nodes: change(w.nodes) }));

  const pickMenu = (id: string) => { setCurrent(id); setPicked([]); anchor.current = null; };
  const clickTab = (id: string, e: { ctrlKey: boolean; metaKey: boolean; shiftKey: boolean }) => {
    if (e.shiftKey && anchor.current) {
      const list = visible.map((n) => n.id);
      const [a, b] = [list.indexOf(anchor.current), list.indexOf(id)].sort((x, y) => x - y);
      if (a >= 0) return setPicked(list.slice(a, b + 1));
    }
    anchor.current = id;
    if (e.ctrlKey || e.metaKey) return setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
    setPicked([id]);
  };
  const addTab = (parent: string | null) => {
    const n: Node = { id: freshId("tab"), tab: newResourceTab("", ""), hadSubs: parent === null, subs: [], removed: false };
    setNodes((ns) => (parent === null ? [...ns, n] : ns.map((p) => (p.id === parent ? { ...p, subs: [...p.subs, n] } : p))));
    if (parent) setFolded((f) => f.filter((x) => x !== parent));
    setPicked([n.id]);
    anchor.current = n.id;
  };
  /** Crosses out (or, if they all are already, restores) these tabs. */
  const toggleRemoved = (targets: string[], removed?: boolean) => {
    if (!targets.length) return;
    const all = targets.every((id) => find(nodes, id)?.node.removed);
    const to = removed ?? !all;
    setNodes((ns) => ns.map((n) => {
      const self = targets.includes(n.id);
      const out = self ? { ...n, removed: to } : n;
      return { ...out, subs: out.subs.map((s) => (targets.includes(s.id) || (self && to) ? { ...s, removed: to } : s)) };
    }));
  };
  const duplicate = (targets: string[]) => {
    const copies: string[] = [];
    const copyOf = (n: Node): Node => {
      const id = freshId("tab");
      copies.push(id);
      const caption = tabName(n.tab);
      const tab = { ...clone(n.tab) };
      if (typeof tab.resource_label === "string") tab.resource_label = tab.resource_label.replace(/([^<>]*)(<\/p>)?$/, (_m: string, text: string, end?: string) => `${text}${text.trim() || !end ? " (copy)" : ""}${end ?? ""}`);
      else tab.resource_label = `${caption} (copy)`;
      return { ...n, id, tab, removed: false, subs: n.subs.map((s) => ({ ...s, id: freshId("tab"), tab: clone(s.tab), removed: false })) };
    };
    setNodes((ns) => ns.flatMap((n) => [
      { ...n, subs: n.subs.flatMap((s) => (targets.includes(s.id) ? [s, copyOf(s)] : [s])) },
      ...(targets.includes(n.id) ? [copyOf(n)] : []),
    ]));
    setPicked(copies.slice(0, 1));
  };
  /** Moves tabs (with their sub-tabs) to a place in the tree. */
  const moveTo = (moving: string[], drop: Drop) => {
    setNodes((ns) => {
      const movers = flat(ns).filter((n) => moving.includes(n.id));
      // a sub-tab whose own tab moves goes with it
      const top = movers.filter((m) => !ns.some((p) => moving.includes(p.id) && p.subs.includes(m)));
      const without = ns.filter((n) => !top.includes(n)).map((n) => ({ ...n, subs: n.subs.filter((s) => !top.includes(s)) }));
      const insert = (list: Node[], before: string | null, items: Node[]) => {
        const i = before ? list.findIndex((x) => x.id === before) : -1;
        const at = i < 0 ? list.length : i;
        return [...list.slice(0, at), ...items, ...list.slice(at)];
      };
      if ("into" in drop || drop.parent !== null) {
        const parent = "into" in drop ? drop.into : drop.parent!;
        if (top.some((m) => m.subs.length)) return ns; // Saturn has two levels only
        const before = "into" in drop ? null : drop.before;
        return without.map((p) => (p.id === parent ? { ...p, subs: insert(p.subs, before, top) } : p));
      }
      return insert(without, drop.before, top);
    });
    if ("into" in drop) setFolded((f) => f.filter((x) => x !== drop.into));
  };
  /** Alt+↑/↓: the picked tabs (under one parent) one place up or down. */
  const nudge = (up: boolean) => {
    if (!pickedNodes.length) return;
    const parent = pickedNodes[0].parent;
    if (!pickedNodes.every((p) => p.parent?.id === parent?.id)) return;
    const siblings = parent ? parent.subs : nodes;
    const at = pickedNodes.map((p) => siblings.indexOf(p.node)).sort((a, b) => a - b);
    const rest = siblings.filter((s) => !picked.includes(s.id));
    let before: string | null;
    if (up) {
      const prev = [...siblings.slice(0, at[0])].reverse().find((s) => !picked.includes(s.id));
      if (!prev) return;
      before = prev.id;
    } else {
      const next = siblings.slice(at[at.length - 1] + 1).find((s) => !picked.includes(s.id));
      if (!next) return;
      before = rest[rest.indexOf(next) + 1]?.id ?? null;
    }
    moveTo(picked, { parent: parent?.id ?? null, before });
  };
  /** Where a tab dragged over a row lands: above, below, or (the middle of a tab) into it as a sub-tab. */
  const dropFor = (n: Node, parent: Node | null, e: React.DragEvent): Drop | null => {
    if (!tabDrag || tabDrag.ids.includes(n.id) || (parent && tabDrag.ids.includes(parent.id))) return null;
    const box = e.currentTarget.getBoundingClientRect();
    const y = (e.clientY - box.top) / box.height;
    const draggedHaveSubs = flat(nodes).some((x) => tabDrag.ids.includes(x.id) && x.subs.length);
    const siblings = parent ? parent.subs : nodes;
    const nextOf = (i: number) => siblings.slice(i + 1).find((s) => !tabDrag.ids.includes(s.id))?.id ?? null;
    if (!parent && y > 0.3 && y < 0.7 && !draggedHaveSubs) return { into: n.id };
    if (parent && draggedHaveSubs) return null;
    return y < 0.5 ? { parent: parent?.id ?? null, before: n.id } : { parent: parent?.id ?? null, before: nextOf(siblings.indexOf(n)) };
  };
  const dropLineBefore = (id: string | null, parent: string | null) => {
    const d = tabDrag?.drop;
    return !!d && !("into" in d) && d.parent === parent && d.before === id;
  };

  const onTabKey = (e: ReactKeyboardEvent) => {
    const last = picked[picked.length - 1];
    if (!last) return;
    const list = visible.map((n) => n.id);
    if (e.altKey && (e.key === "ArrowUp" || e.key === "ArrowDown")) { e.preventDefault(); nudge(e.key === "ArrowUp"); return; }
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      const i = list.indexOf(last) + (e.key === "ArrowUp" ? -1 : 1);
      if (i >= 0 && i < list.length) clickTab(list[i], { ctrlKey: false, metaKey: false, shiftKey: e.shiftKey });
      return;
    }
    const at = find(nodes, last);
    if (e.key === "ArrowLeft" && at) {
      e.preventDefault();
      if (at.parent) setPicked([at.parent.id]);
      else if (at.node.subs.length) setFolded((f) => (f.includes(last) ? f : [...f, last]));
      return;
    }
    if (e.key === "ArrowRight" && at && !at.parent) { e.preventDefault(); setFolded((f) => f.filter((x) => x !== last)); return; }
    if (e.key === "Delete" || e.key === "Backspace") { e.preventDefault(); toggleRemoved(picked); }
  };

  /** Tabs dropped on another menu (0.3.61): copies go at the end of that menu (new ids, with their sub-tabs); with
   *  `move` they leave this menu. Crossed-out tabs are left where they are. */
  const tabsToMenu = (moving: string[], to: string, move: boolean) => {
    const movers = flat(nodes).filter((n) => moving.includes(n.id) && !n.removed);
    const top = movers.filter((m) => !nodes.some((p) => moving.includes(p.id) && p.subs.includes(m)));
    if (!top.length || !current) return;
    const copyOf = (n: Node): Node => ({ ...n, id: freshId("tab"), tab: clone(n.tab), removed: false, subs: n.subs.filter((x) => !x.removed).map(copyOf) });
    update(to, (w) => ({ ...w, nodes: [...w.nodes, ...top.map(copyOf)] }));
    if (move) {
      // by id: the nodes here are a copy of the ones above
      const gone = new Set(top.map((n) => n.id));
      setNodes((ns) => ns.filter((n) => !gone.has(n.id)).map((n) => ({ ...n, subs: n.subs.filter((x) => !gone.has(x.id)) })));
      setPicked([]);
    }
    const name = workOf(to)?.label || "the other menu";
    setNotice({ kind: "ok", text: `${move ? "Moved" : "Copied"} ${plural(top.length, "tab")} to ${name}. Saved with Save, like any change.` });
  };
  const paste = (groupsOn: Record<string, boolean>) => {
    if (!clipboard) return;
    const keys = COPY_GROUPS.filter((g) => groupsOn[g.id]).flatMap((g) => g.keys);
    setNodes((ns) => {
      const into = (n: Node): Node => {
        if (!picked.includes(n.id)) return n;
        const tab: Tab = { ...n.tab };
        for (const k of keys) {
          if (clipboard.tab[k] === undefined) delete tab[k];
          else tab[k] = clone(clipboard.tab[k]);
        }
        return { ...n, tab };
      };
      return ns.map((n) => ({ ...into(n), subs: n.subs.map(into) }));
    });
    setPasting(null);
  };

  // ---- the menus list -------------------------------------------------------------------------------
  const shownIds = ids.filter((id) => { const w = workOf(id); return !query.trim() || (w?.label ?? "").toLowerCase().includes(query.trim().toLowerCase()); });
  /** Moves menus (in their order in the list) to before the menu now at `to`. */
  const moveMenus = (movers: string[], to: number) => {
    const list = ids.filter((x) => !movers.includes(x));
    const before = ids.slice(0, to).filter((x) => !movers.includes(x)).length;
    list.splice(before, 0, ...ids.filter((x) => movers.includes(x)));
    if (!same(list, ids)) setOrder(list);
  };
  // several picked (more than one, still in the list), else none
  const manyMenus = pickedMenus.length > 1 ? ids.filter((id) => pickedMenus.includes(id)) : [];
  /** What a menu action works on: the picked menus when this one is one of them, else just it. */
  const menusFor = (id: string) => (manyMenus.includes(id) ? manyMenus : [id]);
  /** A click on a menu card: Ctrl/Cmd adds or removes it, Shift picks a run; a plain click opens it alone. */
  const clickMenu = (id: string, e: { ctrlKey: boolean; metaKey: boolean; shiftKey: boolean }) => {
    if (e.shiftKey && current) {
      const [a, b] = [shownIds.indexOf(current), shownIds.indexOf(id)].sort((x, y) => x - y);
      if (a >= 0 && b >= 0) return setPickedMenus(shownIds.slice(a, b + 1));
    }
    if (e.ctrlKey || e.metaKey) {
      const from = pickedMenus.length ? pickedMenus : current ? [current] : [];
      return setPickedMenus(from.includes(id) ? from.filter((x) => x !== id) : [...from, id]);
    }
    setPickedMenus([]);
    pickMenu(id);
  };
  /** Crosses out these menus (or, if they all are already, restores them); a new one is simply dropped. */
  const toggleDeleted = (targets: string[], to?: boolean) => {
    const fresh = targets.filter((id) => works[id]?.isNew);
    if (fresh.length) {
      setWorks((w) => { const n = { ...w }; for (const id of fresh) delete n[id]; return n; });
      setOrder((o) => o && o.filter((x) => !fresh.includes(x)));
    }
    const server = targets.filter((id) => byId.has(id));
    const remove = to ?? !server.every((id) => deletedMenus.includes(id));
    setDeletedMenus((d) => (remove ? [...new Set([...d, ...server])] : d.filter((x) => !server.includes(x))));
  };
  const addMenu = () => {
    const id = freshId("new");
    setWorks((w) => ({ ...w, [id]: { label: "", icon: "", access_control: [], nodes: [], isNew: true } }));
    pickMenu(id);
    window.setTimeout(() => document.getElementById("mn-menu-label")?.focus(), 30);
  };
  const discardMenu = (id: string) => setWorks((w) => { const n = { ...w }; delete n[id]; return n; });
  const onMenuKey = (e: ReactKeyboardEvent) => {
    if (!current) return;
    const i = shownIds.indexOf(current);
    if (e.altKey && (e.key === "ArrowUp" || e.key === "ArrowDown") && !query.trim()) {
      e.preventDefault();
      // the picked menus move as a block
      const movers = manyMenus.length ? manyMenus : [current];
      const first = ids.indexOf(movers[0]), last = ids.indexOf(movers[movers.length - 1]);
      moveMenus(movers, e.key === "ArrowUp" ? Math.max(0, first - 1) : Math.min(ids.length, last + 2));
    } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      const j = i + (e.key === "ArrowUp" ? -1 : 1);
      if (j >= 0 && j < shownIds.length) pickMenu(shownIds[j]);
    } else if (e.key === "Delete" || e.key === "Backspace") { e.preventDefault(); toggleDeleted(manyMenus.length ? manyMenus : [current]); }
    else if (e.key === "Escape" && pickedMenus.length) setPickedMenus([]);
  };
  // focus follows the keyboard in both lists
  useEffect(() => { document.querySelector<HTMLElement>(`[data-menu-id="${CSS.escape(current ?? "")}"]`)?.scrollIntoView?.({ block: "nearest" }); }, [current]);

  // ---- render ------------------------------------------------------------------------------------------
  const one = pickedNodes.length === 1 ? pickedNodes[0] : null;
  const live = pickedNodes.filter((p) => !p.node.removed);
  const tabProblems = (id: string) => menuProblems?.byNode.get(id) ?? [];
  const confirmList = [
    ...dirtyIds.map((id) => {
      const w = workOf(id)!;
      const m = byId.get(id);
      const gone = flat(w.nodes).filter((n) => n.removed).map((n) => tabName(n.tab));
      const what: string[] = [];
      if (w.isNew) what.push("new menu");
      else if (m) {
        if (w.label !== m.label) what.push("label");
        if (w.icon !== m.icon) what.push("icon");
        if (!same(w.access_control, m.access_control)) what.push("who can see it");
        if (!same(referencesOf(w.nodes).references, m.references)) what.push("tabs");
      }
      return { id, label: w.label || "(no label)", what, gone };
    }),
  ];

  return (
    <div className="rs-root mn-root" onClick={() => context && setContext(null)}>
      <header className="rs-top">
        <div className="rs-title"><span className="rs-title-main">Menus</span><span className="rs-title-sub">{instanceName}</span></div>
        <button className="rs-btn" disabled={loading || !!saving} title="Read the menus again (unsaved changes are kept)" onClick={() => { setLoading(true); asked.current.clear(); setFields(new Map()); post({ type: "refresh" }); }}>Reload</button>
        <button className="rs-btn" title="Open Saturn's menus page in your browser" onClick={() => post({ type: "openInSaturn" })}>Open in Saturn ↗</button>
        <span className="rs-push" />
        {dirty && <span className="rs-unsaved">{saving ? "Saving…" : !dirtyIds.length && !orderChanged ? `Unsaved: ${plural(deleting.length, "menu")} to delete` : `Unsaved in ${plural(dirtyIds.length + (orderChanged && !dirtyIds.length ? 1 : 0), dirtyIds.length ? "menu" : "change")}${orderChanged && dirtyIds.length ? " and the order" : ""}${deleting.length ? `, ${deleting.length} to delete` : ""}`}</span>}
        {errorsIn.length > 0 && <span className="mn-top-errors" title="Fix the errors (red) before saving"><Mark level="error" /> {plural(errorsIn.length, "menu")} with errors</span>}
        {dirty && <button className="rs-btn" disabled={!!saving} onClick={discardAll}>Discard</button>}
        <button className="rs-btn is-primary" disabled={!dirty || !!saving || errorsIn.length > 0} title={errorsIn.length ? "Fix the errors (red) first" : undefined} onClick={() => setConfirming(true)}>Save</button>
      </header>
      {confirming && (
        <div className="rs-confirm">
          <div className="rs-confirm-text">
            <span>
              {dirtyIds.length || orderChanged ? <>Save {plural(dirtyIds.length, "menu")}{orderChanged ? `${dirtyIds.length ? " and" : ""} the menu order` : ""}</> : null}
              {deleting.length ? <>{dirtyIds.length || orderChanged ? ", and delete " : "Delete "}{plural(deleting.length, "menu")}</> : null} on {instanceName}?
            </span>
            {confirmList.map((c) => (
              <span key={c.id} className="rs-confirm-note">
                <b>{c.label}</b>: {c.what.join(", ") || "changes"}
                {c.gone.length > 0 && <span className="rs-removing"> · removes {c.gone.map((g) => `“${g}”`).join(", ")}</span>}
              </span>
            ))}
            {deleting.length > 0 && (
              <span className="rs-confirm-note rs-removing">
                Deletes {deleting.map((id) => `“${workOf(id)?.label || id}”`).join(", ")}: they and their tabs disappear from the app's navigation for everyone. The records the tabs show are not touched, and a copy of each is kept on this computer.
              </span>
            )}
            <span className="rs-confirm-note">Each menu is read again and backed up first; Undo on its card puts the last version back.</span>
          </div>
          <button className="rs-btn" onClick={() => setConfirming(false)}>Cancel</button>
          <button className="rs-btn is-primary" onClick={startSave}>Save</button>
        </div>
      )}
      {notice && (
        <div className={`rs-notice is-${notice.kind}`}><span>{notice.text}</span><button className="rs-x" aria-label="Close" onClick={() => setNotice(null)}>×</button></div>
      )}

      <main className="rs-main">
        {/* column 1: the menus */}
        {listHidden && (
          <button className="mn-side-open" title={`Show the menus${hint("menus.list", shortcuts)}`} aria-label="Show the menus" onClick={() => setListHidden(false)}>»</button>
        )}
        <aside className="rs-side mn-menus" hidden={listHidden}>
          <div className="rs-side-top">
            <button className="rs-btn mn-list-fold" title={`Hide the menus${hint("menus.list", shortcuts)}`} aria-label="Hide the menus" onClick={() => setListHidden(true)}>«</button>
            <input className="rs-search" placeholder="Search menus" aria-label="Search menus" value={query} onChange={(e) => setQuery(e.target.value)} />
            <button className="rs-btn rs-add" title="Add a menu" aria-label="Add a menu" onClick={addMenu}>+</button>
          </div>
          <div className="rs-side-info"><span>{plural(ids.length, "menu")}</span><span>{query.trim() ? "Clear the search to reorder" : "Drag to reorder"}</span></div>
          <div className="rs-list" role="listbox" aria-label="Menus" onKeyDown={onMenuKey}
            onDragOver={(e) => { if (menuDrag) e.preventDefault(); }}
            onDrop={(e) => { e.preventDefault(); if (menuDrag && menuDrag.at !== null) moveMenus(menuDrag.ids, menuDrag.at); setMenuDrag(null); }}>
            {menus === null && <p className="rs-empty">Reading the menus…</p>}
            {menus !== null && !ids.length && <p className="rs-empty">This instance has no menus your login can see. Add one with +.</p>}
            {menus !== null && ids.length > 0 && !shownIds.length && <p className="rs-empty">No menu matches “{query}”.</p>}
            {shownIds.map((id) => {
              const w = workOf(id)!;
              const at = ids.indexOf(id);
              const ps = problems.get(id)?.all ?? [];
              const level = ps.some((p) => p.level === "error") ? "error" : ps.length ? "warning" : null;
              const tabsCount = w.nodes.filter((n) => !n.removed).length;
              return (
                <div key={id} className="rs-item-wrap">
                  {menuDrag && menuDrag.at === at && <div className="rs-drop" />}
                  <div
                    data-menu-id={id}
                    className={`rs-item mn-menu${(manyMenus.length ? manyMenus.includes(id) : current === id) ? " is-selected" : ""}${menuDrag?.ids.includes(id) ? " is-dragging" : ""}${deletedMenus.includes(id) ? " is-deleted" : ""}${tabOver === id ? " is-into" : ""}`}
                    role="option"
                    aria-selected={manyMenus.length ? manyMenus.includes(id) : current === id}
                    tabIndex={current === id ? 0 : -1}
                    draggable={!query.trim()}
                    onClick={(e) => clickMenu(id, e)}
                    onContextMenu={(e) => { e.preventDefault(); if (!manyMenus.includes(id)) { setPickedMenus([]); pickMenu(id); } setContext({ x: e.clientX, y: e.clientY, on: "menu", id }); }}
                    onDragStart={(e) => { const movers = menusFor(id); setMenuDrag({ ids: movers, at: null }); e.dataTransfer.effectAllowed = "move"; e.dataTransfer.setData("text/plain", movers.join(",")); }}
                    onDragEnd={() => setMenuDrag(null)}
                    onDragOver={(e) => {
                      // tabs from the middle column: dropped here, they're copied or moved into this menu
                      if (tabDrag) {
                        if (id === current || deletedMenus.includes(id)) return;
                        e.preventDefault();
                        e.stopPropagation();
                        if (tabOver !== id) setTabOver(id);
                        return;
                      }
                      if (!menuDrag) return; e.preventDefault(); const b = e.currentTarget.getBoundingClientRect(); const to = e.clientY < b.top + b.height / 2 ? at : at + 1; if (to !== menuDrag.at) setMenuDrag({ ...menuDrag, at: to });
                    }}
                    onDragLeave={() => tabOver === id && setTabOver(null)}
                    onDrop={(e) => {
                      if (!tabDrag) return;
                      e.preventDefault();
                      e.stopPropagation();
                      setTabOver(null);
                      if (id !== current && !deletedMenus.includes(id)) setTabsTo({ x: e.clientX, y: e.clientY, ids: tabDrag.ids, to: id });
                      setTabDrag(null);
                    }}
                    title={deletedMenus.includes(id) ? "Deleted when you save (right-click to restore)" : query.trim() ? "Clear the search to reorder" : "Drag to reorder (or Alt+↑ / Alt+↓) · Ctrl/Cmd or Shift+click to pick several · drop tabs here to copy or move them"}
                  >
                    <span className="mn-menu-icon"><FaIcon name={w.icon} /></span>
                    <span className="rs-item-text">
                      <span className="rs-item-label">{w.label || "(no label)"}{w.isNew && <span className="rs-new-pill">new</span>}</span>
                      <span className="rs-item-key">{plural(tabsCount, "tab")}{w.access_control.length ? ` · ${accessSummary(w.access_control)}` : ""}</span>
                    </span>
                    {level && <span className="mn-flag" title={ps.map((p) => `${p.level === "error" ? "Error" : "Warning"}: ${p.message}`).join("\n")}><Mark level={level} /></span>}
                    {isDirty(id) && <span className="rs-dot" title="Unsaved changes" />}
                  </div>
                </div>
              );
            })}
            {menuDrag && menuDrag.at === ids.length && <div className="rs-drop" />}
          </div>
        </aside>

        {/* column 2: the picked menu's tabs */}
        <aside className="rs-side mn-tabs">
          <div className="rs-side-top">
            <span className="mn-col-title">{menuWork ? `Tabs of ${menuWork.label || "this menu"}` : "Tabs"}</span>
            <button className="rs-btn rs-add" title="Add a tab" aria-label="Add a tab" disabled={!menuWork} onClick={() => addTab(null)}>+</button>
          </div>
          <div className="rs-side-info"><span>{menuWork ? plural(nodes.filter((n) => !n.removed).length, "tab") : ""}{picked.length > 1 ? ` · ${picked.length} picked` : ""}</span></div>
          <div className="rs-list mn-tree" role="tree" aria-label="Tabs" aria-multiselectable="true" onKeyDown={onTabKey}
            onDragOver={(e) => { if (tabDrag) e.preventDefault(); }}
            onDrop={(e) => { e.preventDefault(); if (tabDrag?.drop) moveTo(tabDrag.ids, tabDrag.drop); setTabDrag(null); }}>
            {manyMenus.length > 0 && <p className="rs-empty">{manyMenus.length} menus picked. Click one (without Ctrl or Shift) to see its tabs.</p>}
            {!manyMenus.length && menuWork && !nodes.length && <p className="rs-empty">No tabs yet. The menu shows nothing until it has one. Add one with +.</p>}
            {!manyMenus.length && nodes.map((n) => {
              const open = !isFolded(n.id);
              return (
                <div key={n.id} role="none">
                  {dropLineBefore(n.id, null) && <div className="rs-drop" />}
                  {tabRow({ node: n, parent: null, open, hasSubs: n.subs.length > 0 })}
                  {open && n.subs.length > 0 && (
                    <div className="mn-subs" role="group">
                      {n.subs.map((s) => (
                        <div key={s.id} role="none">
                          {dropLineBefore(s.id, n.id) && <div className="rs-drop is-sub" />}
                          {tabRow({ node: s, parent: n, open: false, hasSubs: false })}
                        </div>
                      ))}
                      {dropLineBefore(null, n.id) && <div className="rs-drop is-sub" />}
                    </div>
                  )}
                </div>
              );
            })}
            {dropLineBefore(null, null) && <div className="rs-drop" />}
          </div>
        </aside>

        {/* column 3: the settings */}
        <section className="rs-detail mn-detail">
          {manyMenus.length > 0 ? (
            <ManyMenus
              ids={manyMenus}
              works={manyMenus.map((id) => workOf(id)!)}
              deleted={manyMenus.filter((id) => deletedMenus.includes(id)).length}
              onIcon={(icon) => manyMenus.forEach((id) => update(id, (w) => ({ ...w, icon })))}
              onAccess={() => { if (!subjects) post({ type: "listAccessSubjects" }); setAccess(true); }}
            />
          ) : !menuWork ? (
            <p className="rs-empty">{menus === null ? "Reading the menus…" : "Pick a menu on the left, or add one with +."}</p>
          ) : (
            <div className="pe-page mn-page">
              <div className="pe-block is-first">
                <header className="pe-group-head">
                  <h2 className="pe-group-title mn-menu-title"><FaIcon name={menuWork.icon} /> {menuWork.label || "New menu"}</h2>
                  <p className="pe-blurb">{menuWork.isNew ? "A new menu, added at the end of the list when you save." : `The menu itself. Its id: ${current}`}</p>
                </header>
                <div className="pe-card">
                  <Row label="Label" id="mn-menu-label" hint="The menu's name in Saturn's navigation." problems={menuProblems?.menu.filter((p) => p.field === "label")}>
                    <input id="mn-menu-label" className="pe-input" placeholder="e.g. Operations" value={menuWork.label} onChange={(e) => current && update(current, (w) => ({ ...w, label: e.target.value }))} />
                  </Row>
                  <Row label="Icon" hint="A Font Awesome icon." problems={menuProblems?.menu.filter((p) => p.field === "icon")}>
                    <IconField label="Menu icon" value={menuWork.icon} onChange={(n) => current && update(current, (w) => ({ ...w, icon: n }))} />
                  </Row>
                  <Row label="Who can see it" hint={menuWork.access_control.length ? accessSummary(menuWork.access_control) : "Everyone. No rules."} problems={menuProblems?.menu.filter((p) => p.field === "access")}>
                    <button className="rs-btn" onClick={() => { if (!subjects) post({ type: "listAccessSubjects" }); setAccess(true); }}>Change…</button>
                  </Row>
                </div>
              </div>
              {!pickedNodes.length ? (
                <p className="rs-empty mn-pick-hint">{nodes.length ? "Pick a tab in the middle column to change its settings (Ctrl/Cmd or Shift+click to pick several)." : "Add a tab with + in the middle column."}</p>
              ) : !live.length ? (
                <div className="rs-gone">
                  <p>{pickedNodes.length === 1 ? `“${tabName(pickedNodes[0].node.tab)}” is` : `${pickedNodes.length} tabs are`} removed. {pickedNodes.length === 1 ? "It goes" : "They go"} when you save.</p>
                  <button className="rs-btn" onClick={() => toggleRemoved(picked, false)}>Restore</button>
                </div>
              ) : (
                <div className="mn-tab-settings">
                  <header className="pe-group-head">
                    <h2 className="pe-group-title">{one ? (one.parent ? "Sub-tab: " : "Tab: ") + tabName(one.node.tab) : `${live.length} tabs`}</h2>
                  </header>
                  <TabSettings
                    key={live.map((p) => p.node.id).join("|")}
                    tabs={live.map((p) => p.node.tab)}
                    nested={!!one?.parent}
                    parentName={one?.parent ? tabName(one.parent.tab) : undefined}
                    onPickParent={() => one?.parent && setPicked([one.parent.id])}
                    host={host}
                    problems={live.flatMap((p) => tabProblems(p.node.id))}
                    onChange={(tabs) => {
                      const byNode = new Map(live.map((p, i) => [p.node.id, tabs[i]]));
                      setNodes((ns) => ns.map((n) => ({ ...n, tab: byNode.get(n.id) ?? n.tab, subs: n.subs.map((s) => ({ ...s, tab: byNode.get(s.id) ?? s.tab })) })));
                    }}
                  />
                </div>
              )}
              <div className="pe-tail" />
            </div>
          )}
        </section>
      </main>

      {context && context.on === "menu" && (
        <div className="rs-menu" role="menu" style={{ left: Math.min(context.x, window.innerWidth - 230), top: Math.min(context.y, window.innerHeight - 200) }} onClick={(e) => e.stopPropagation()}>
          {!works[context.id]?.isNew && <button role="menuitem" onClick={() => { post({ type: "copyId", id: context.id }); setContext(null); }}>Copy id</button>}
          {undoable.includes(context.id) && <button role="menuitem" onClick={() => { post({ type: "undo", id: context.id }); setContext(null); }}>Undo the last save</button>}
          <button role="menuitem" disabled={!menusFor(context.id).some((id) => isDirty(id) && !works[id]?.isNew)} onClick={() => { for (const id of menusFor(context.id)) if (!works[id]?.isNew) discardMenu(id); setContext(null); }}>{menusFor(context.id).length > 1 ? "Discard their changes" : "Discard its changes"}</button>
          <div className="rs-menu-line" />
          {(() => {
            const targets = menusFor(context.id);
            const all = targets.every((id) => deletedMenus.includes(id));
            const n = targets.length;
            return all
              ? <button role="menuitem" onClick={() => { toggleDeleted(targets, false); setContext(null); }}>Restore{n > 1 ? ` ${n} menus` : ""}</button>
              : <button role="menuitem" className="is-danger" onClick={() => { toggleDeleted(targets, true); setContext(null); }}>{n > 1 ? `Delete ${n} menus` : works[context.id]?.isNew ? "Remove this new menu" : "Delete menu"}</button>;
          })()}
        </div>
      )}
      {context && context.on === "tab" && (() => {
        const removed = pickedNodes.length > 0 && pickedNodes.every((p) => p.node.removed);
        const oneTop = pickedNodes.length === 1 && !pickedNodes[0].parent ? pickedNodes[0].node : null;
        return (
          <div className="rs-menu" role="menu" style={{ left: Math.min(context.x, window.innerWidth - 230), top: Math.min(context.y, window.innerHeight - 260) }} onClick={(e) => e.stopPropagation()}>
            <button role="menuitem" disabled={removed} onClick={() => { duplicate(picked); setContext(null); }}>Duplicate{picked.length > 1 ? ` ${picked.length}` : ""}</button>
            {oneTop && <button role="menuitem" onClick={() => { addTab(oneTop.id); setContext(null); }}>Add a sub-tab</button>}
            {pickedNodes.length === 1 && <button role="menuitem" onClick={() => { setClipboard({ from: tabName(pickedNodes[0].node.tab), tab: clone(pickedNodes[0].node.tab) }); setContext(null); }}>Copy settings</button>}
            <button role="menuitem" disabled={!clipboard || removed} onClick={() => { setPasting(Object.fromEntries(COPY_GROUPS.map((g) => [g.id, g.on]))); setContext(null); }}>Paste settings{clipboard ? ` from ${clipboard.from}` : ""}</button>
            <div className="rs-menu-line" />
            {removed
              ? <button role="menuitem" onClick={() => { toggleRemoved(picked, false); setContext(null); }}>Restore</button>
              : <button role="menuitem" className="is-danger" onClick={() => { toggleRemoved(picked, true); setContext(null); }}>Delete{picked.length > 1 ? ` ${picked.length}` : ""}</button>}
          </div>
        );
      })()}
      {pasting && clipboard && (
        <div className="rs-modal-back" onClick={() => setPasting(null)}>
          <div className="rs-modal" role="dialog" aria-label="Paste settings" onClick={(e) => e.stopPropagation()}>
            <h2>Paste settings from {clipboard.from}</h2>
            <p className="pe-hint">Into {picked.length === 1 ? tabName(pickedNodes[0]?.node.tab ?? {}) : `${picked.length} tabs`}. Pick what to bring over; the caption never is.</p>
            <div className="pe-card">
              {COPY_GROUPS.map((g) => (
                <div key={g.id} className="pe-row">
                  <div className="pe-text"><label className="pe-label" htmlFor={`mn-paste-${g.id}`}>{g.title}</label><span className="pe-hint">{g.hint}</span></div>
                  <div className="pe-control"><Switch id={`mn-paste-${g.id}`} on={!!pasting[g.id]} label={g.title} onSet={(v) => setPasting({ ...pasting, [g.id]: v })} /></div>
                </div>
              ))}
            </div>
            <div className="pe-btns">
              <button className="rs-btn" onClick={() => setPasting(null)}>Cancel</button>
              <button className="rs-btn is-primary" disabled={!Object.values(pasting).some(Boolean)} onClick={() => paste(pasting)}>Paste</button>
            </div>
          </div>
        </div>
      )}
      {access && manyMenus.length > 0 && (() => {
        const sets = manyMenus.map((id) => JSON.stringify(ruleRows(workOf(id)!.access_control)));
        const sameRules = sets.every((x) => x === sets[0]);
        return (
          <AccessBox
            menuLabel={`${manyMenus.length} menus`}
            rules={sameRules ? ruleRows(workOf(manyMenus[0])!.access_control) : []}
            subjects={subjects}
            onCancel={() => setAccess(false)}
            onDone={(rows) => {
              try {
                // each keeps a rule of a kind this screen can't build, as it has it
                const next = new Map(manyMenus.map((id) => [id, rulesToSave(rows.filter((r) => Object.prototype.hasOwnProperty.call(RULE_KINDS, r.method) || workOf(id)!.access_control.some((x) => x.method === r.method)), workOf(id)!.access_control)]));
                for (const [id, rules] of next) update(id, (w) => ({ ...w, access_control: rules }));
                setAccess(false);
              } catch (err) {
                setNotice({ kind: "error", text: err instanceof Error ? err.message : String(err) });
              }
            }}
          />
        );
      })()}
      {tabsTo && (
        <div className="rs-modal-back" onClick={() => setTabsTo(null)}>
          <div className="rs-menu mn-tabs-to" role="dialog" aria-label="Copy or move" style={{ left: Math.min(tabsTo.x, window.innerWidth - 260), top: Math.min(tabsTo.y, window.innerHeight - 160) }} onClick={(e) => e.stopPropagation()}>
            <div className="mn-tabs-to-title">{plural(tabsTo.ids.length, "tab")} to {workOf(tabsTo.to)?.label || "that menu"}</div>
            <button role="menuitem" autoFocus onClick={() => { tabsToMenu(tabsTo.ids, tabsTo.to, false); setTabsTo(null); }}>Copy <small>they stay here too</small></button>
            <button role="menuitem" onClick={() => { tabsToMenu(tabsTo.ids, tabsTo.to, true); setTabsTo(null); }}>Move <small>they leave this menu</small></button>
            <button role="menuitem" onClick={() => setTabsTo(null)}>Cancel</button>
          </div>
        </div>
      )}
      {access && !manyMenus.length && menuWork && current && (
        <AccessBox
          menuLabel={menuWork.label}
          rules={ruleRows(menuWork.access_control)}
          subjects={subjects}
          onCancel={() => setAccess(false)}
          onDone={(rows) => {
            try {
              const rules = rulesToSave(rows, menuWork.access_control);
              update(current, (w) => ({ ...w, access_control: rules }));
              setAccess(false);
            } catch (err) {
              setNotice({ kind: "error", text: err instanceof Error ? err.message : String(err) });
            }
          }}
        />
      )}
    </div>
  );

  /** One row of the tab tree (a render function, not a component, so a row keeps its focus). */
  function tabRow(p: { node: Node; parent: Node | null; open: boolean; hasSubs: boolean }) {
    const { node: n, parent } = p;
    const isPicked = picked.includes(n.id);
    const target = tabTarget(n.tab);
    const ps = tabProblems(n.id);
    const level = ps.some((x) => x.level === "error") ? "error" : ps.length ? "warning" : null;
    const into = tabDrag?.drop && "into" in tabDrag.drop && tabDrag.drop.into === n.id;
    const removed = n.removed || (!!parent && parent.removed);
    return (
      <div
        className={`rs-item mn-tab${parent ? " is-sub" : ""}${isPicked ? " is-selected" : ""}${removed ? " is-deleted" : ""}${tabDrag?.ids.includes(n.id) ? " is-dragging" : ""}${into ? " is-into" : ""}`}
        role="treeitem"
        aria-selected={isPicked}
        aria-expanded={p.hasSubs ? p.open : undefined}
        aria-level={parent ? 2 : 1}
        tabIndex={isPicked || (!picked.length && n === nodes[0]) ? 0 : -1}
        draggable
        onClick={(e) => clickTab(n.id, e)}
        onContextMenu={(e) => { e.preventDefault(); if (!isPicked) { setPicked([n.id]); anchor.current = n.id; } setContext({ x: e.clientX, y: e.clientY, on: "tab", id: n.id }); }}
        onDragStart={(e) => {
          e.stopPropagation();
          const moving = isPicked ? flat(nodes).filter((x) => picked.includes(x.id)).map((x) => x.id) : [n.id];
          if (!isPicked) setPicked([n.id]);
          setTabDrag({ ids: moving, drop: null });
          e.dataTransfer.effectAllowed = "move";
          e.dataTransfer.setData("text/plain", moving.join(","));
        }}
        onDragEnd={() => { setTabDrag(null); setTabOver(null); }}
        onDragOver={(e) => {
          if (!tabDrag) return;
          e.preventDefault();
          e.stopPropagation();
          const d = dropFor(n, parent, e);
          if (!same(d, tabDrag.drop)) setTabDrag({ ...tabDrag, drop: d });
        }}
        title="Drag to reorder, or onto a tab to make it a sub-tab (Alt+↑ / Alt+↓ moves; ← / → folds)"
      >
        {!parent && (
          <button type="button" className={`mn-fold${p.hasSubs ? "" : " is-empty"}`} tabIndex={-1} aria-label={p.open ? "Fold" : "Unfold"} onClick={(e) => { e.stopPropagation(); if (p.hasSubs) setFolded((f) => (f.includes(n.id) ? f.filter((x) => x !== n.id) : [...f, n.id])); }}>
            {p.hasSubs ? (p.open ? "▾" : "▸") : ""}
          </button>
        )}
        <span className="mn-tab-icon">{typeof n.tab.tab_icon === "string" && n.tab.tab_icon ? <FaIcon name={n.tab.tab_icon} /> : null}</span>
        <span className="rs-item-text">
          <span className="rs-item-label">{tabName(n.tab)}{!p.open && p.hasSubs && <span className="mn-sub-count">{n.subs.length}</span>}</span>
          <span className="rs-item-key">{target.kind === "resource" ? target.value : target.kind === "custom_page" ? `page: ${target.value}` : target.kind === "dashboard" ? `dashboard: ${target.value}` : "opens nothing yet"}{typeof n.tab.filter === "string" && n.tab.filter.trim() ? " · filtered" : ""}</span>
        </span>
        {level && <span className="mn-flag" title={ps.map((x) => x.message).join("\n")}><Mark level={level} /></span>}
        <span className="mn-row-btns">
          {!parent && !removed && <button type="button" className="mn-row-btn" title="Add a sub-tab" aria-label={`Add a sub-tab to ${tabName(n.tab)}`} onClick={(e) => { e.stopPropagation(); addTab(n.id); }}>+</button>}
          {removed && !n.removed ? null : n.removed
            ? <button type="button" className="mn-row-btn" title="Restore" aria-label={`Restore ${tabName(n.tab)}`} onClick={(e) => { e.stopPropagation(); toggleRemoved([n.id], false); }}>↺</button>
            : <button type="button" className="mn-row-btn is-danger" title={parent ? "Remove this sub-tab" : "Remove this tab and its sub-tabs"} aria-label={`Remove ${tabName(n.tab)}`} onClick={(e) => { e.stopPropagation(); toggleRemoved([n.id], true); }}>×</button>}
        </span>
      </div>
    );
  }
}

/** Several menus picked (0.3.61): their icon and who can see them, Mixed where they differ; a change goes to all
 *  of them. Each keeps its own label and tabs. */
function ManyMenus(props: { ids: string[]; works: Work[]; deleted: number; onIcon: (icon: string) => void; onAccess: () => void }) {
  const icons = new Set(props.works.map((w) => w.icon));
  const rules = new Set(props.works.map((w) => JSON.stringify(w.access_control)));
  return (
    <div className="pe-page mn-page">
      <div className="pe-block is-first">
        <header className="pe-group-head">
          <h2 className="pe-group-title">{props.ids.length} menus picked</h2>
          <p className="pe-blurb">{props.works.map((w) => w.label || "(no label)").join(", ")}. A change here goes to all of them; each keeps its own label and tabs.{props.deleted ? ` ${props.deleted} of them ${props.deleted === 1 ? "is" : "are"} crossed out (deleted when you save).` : ""}</p>
        </header>
        <div className="pe-card">
          <Row label="Icon" hint={icons.size > 1 ? "Mixed: they differ. Picking one gives it to all of them." : "A Font Awesome icon."}>
            <IconField label="Menu icon" mixed={icons.size > 1} value={icons.size > 1 ? "" : props.works[0].icon} onChange={props.onIcon} />
          </Row>
          <Row label="Who can see them" hint={rules.size > 1 ? "Mixed: they have different rules. What you set replaces each one's." : props.works[0].access_control.length ? accessSummary(props.works[0].access_control) : "Everyone. No rules."}>
            <button className="rs-btn" onClick={props.onAccess}>Change…</button>
          </Row>
        </div>
      </div>
      <div className="pe-tail" />
    </div>
  );
}

const style = document.createElement("style");
style.textContent = editorCss + "\n" + css;
document.head.appendChild(style);
createRoot(document.getElementById("root")!).render(<App />);
