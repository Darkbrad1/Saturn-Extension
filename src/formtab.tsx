// The side panel's Form tab (an action's form) and Parameters tab (a command's parameters): the
// fields down the left, and the picked ones' settings on the right, with the same editor as the
// Resources screen (../src-res/editor.tsx, spec.ts), without its settings menu. A form field is
// stored like a resource property, so the settings are the same.
// Like every edit in the node view, there's no Save here: the whole field list goes to the
// workflow's draft as one edit (setFormFields) a moment after you stop changing it, or at once when
// you leave the tab. "was …" compares with the form as saved on the instance (fetchSavedForm).
import { useEffect, useMemo, useRef, useState } from "react";
import { send } from "./bridge";
import type { FormEnv } from "./forms";
import type { FormFieldView } from "./types";
import { Cards, PropertyEditor, Switch, type Field, type Lookups } from "../src-res/editor";
import { setAt } from "../src-res/editor";
import { GROUPS, KEY_PATTERN, TYPES, get, keyFrom, mappedOf, newProperty, type Prop } from "../src-res/spec";
import editorCss from "../src-res/editor.css";

// the editor's look, once (its rules are all under its own classes)
if (!document.getElementById("pe-editor-css")) {
  const style = document.createElement("style");
  style.id = "pe-editor-css";
  style.textContent = editorCss;
  document.head.appendChild(style);
}

/** Whose form this is: an action's form or a command's parameters. */
export interface FormOwner {
  kind: "action" | "command";
  title: string;
  ownerPath: (string | number)[];
  formKey: "form" | "parameters";
  fields: FormFieldView[];
}

const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v));
const asField = (f: FormFieldView): Prop => (f.raw && typeof f.raw === "object" ? { ...(f.raw as Prop), key: f.key } : { key: f.key, label: f.label, type: f.type ?? "string", required: f.required });
/** How long after the last change the fields go to the draft. */
const COMMIT_AFTER = 700;

/** A field as shown here: a fixed id (so it stays picked while its key is typed), the key it has
 * on the instance (for "was …"), and the field itself. */
interface Row { id: string; savedKey: string; f: Prop }

export function FormTab(props: { wfId: string; owner: FormOwner; env: FormEnv; workflowName?: string; contextName?: string }) {
  const { owner } = props;
  // ids by key, from the rows last shown, so the draft's fields keep theirs
  const known = useRef(new Map<string, Row>());
  const nextId = useRef(0);
  const stored = useMemo(
    () =>
      owner.fields.map(asField).map((f): Row => {
        const before = known.current.get(String(f.key));
        return before ? { ...before, f } : { id: `f${nextId.current++}`, savedKey: String(f.key), f };
      }),
    [owner.fields],
  );
  // the fields as edited here but not sent yet
  const [work, setWork] = useState<Row[] | null>(null);
  const rows = work ?? stored;
  known.current = new Map([...rows].reverse().map((r) => [String(r.f.key), r]));
  const fields = rows.map((r) => r.f);
  // the form as saved on the instance, by key
  const [saved, setSaved] = useState<Map<string, Prop> | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const anchor = useRef<string | null>(null);
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("general");
  const [dragIds, setDragIds] = useState<string[] | null>(null);
  const [dropAt, setDropAt] = useState<number | null>(null);
  const [menu, setMenu] = useState<{ x: number; y: number } | null>(null);
  const [clipboard, setClipboard] = useState<{ from: string; prop: Prop } | null>(null);
  const [pasting, setPasting] = useState<Record<string, boolean> | null>(null);
  const [adding, setAdding] = useState<{ label: string; key: string; keyTouched: boolean; type: string } | null>(null);
  const [resourceFields, setResourceFields] = useState<Record<string, Field[]>>({});
  const asked = useRef(new Set<string>());
  const timer = useRef<number | null>(null);
  const pending = useRef<{ fields: Prop[]; summary: string } | null>(null);
  const ownerId = `${props.wfId}|${owner.ownerPath.join(".")}|${owner.formKey}`;

  /** Sends what's waiting to the draft (now). */
  const flush = () => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = null;
    const next = pending.current;
    pending.current = null;
    if (next) send("setFormFields", { workflowId: props.wfId, ownerPath: owner.ownerPath, formKey: owner.formKey, fields: next.fields, summary: next.summary });
  };
  // a key that can't be kept (not a valid key, or two the same) isn't sent until it's fixed
  const badIn = (list: Row[]) => {
    const counts = new Map<string, number>();
    for (const r of list) counts.set(String(r.f.key), (counts.get(String(r.f.key)) ?? 0) + 1);
    return list.find((r) => !KEY_PATTERN.test(String(r.f.key)) || counts.get(String(r.f.key))! > 1) ?? null;
  };
  /** The fields as edited: shown at once, sent to the draft a moment later. */
  const change = (next: Row[], summary: string) => {
    setWork(next);
    if (timer.current) window.clearTimeout(timer.current);
    if (badIn(next)) {
      pending.current = null;
      return;
    }
    pending.current = { fields: next.map((r) => r.f), summary };
    timer.current = window.setTimeout(flush, COMMIT_AFTER);
  };
  // leaving the tab (or another action) never loses an edit
  const flushRef = useRef(flush);
  flushRef.current = flush;
  useEffect(() => () => flushRef.current(), [ownerId]);
  // once the draft has what was sent, show the draft again
  useEffect(() => {
    if (work && !pending.current && same(work.map((r) => r.f), stored.map((r) => r.f))) setWork(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stored]);

  // the saved form, read again whenever the draft changes (it changes when the workflow is saved)
  useEffect(() => {
    send("fetchSavedForm", { workflowId: props.wfId, ownerPath: owner.ownerPath, formKey: owner.formKey });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ownerId, JSON.stringify(owner.fields)]);
  useEffect(() => {
    const on = (ev: MessageEvent) => {
      const m = ev.data;
      if (!m || typeof m !== "object") return;
      const p = m.payload;
      if (m.type === "savedForm" && p?.workflowId === props.wfId && same(p.ownerPath, owner.ownerPath) && p.formKey === owner.formKey) {
        setSaved(new Map((Array.isArray(p.fields) ? p.fields : []).filter((f: Prop) => f && typeof f.key === "string").map((f: Prop) => [String(f.key), f])));
      }
      if (m.type === "resourceFields" && typeof p?.resource === "string") setResourceFields((before) => ({ ...before, [p.resource]: Array.isArray(p.fields) ? p.fields : [] }));
      // a refused edit: show what the draft has
      if (m.type === "editFailed" || m.type === "editRejected") {
        pending.current = null;
        setWork(null);
      }
    };
    window.addEventListener("message", on);
    return () => window.removeEventListener("message", on);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ownerId]);
  // a field picked here that's gone (removed, or another action opened) is unpicked
  useEffect(() => {
    setSelected((before) => before.filter((id) => rows.some((r) => r.id === id)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ownerId, rows.length]);

  const keys = fields.map((f) => String(f.key));
  const q = query.trim().toLowerCase();
  const shown = rows.filter((r) => !q || `${r.f.key} ${r.f.label ?? ""} ${r.f.type ?? ""}`.toLowerCase().includes(q));
  const picked = rows.filter((r) => selected.includes(r.id));
  const canMove = !q;
  const label = (f: Prop) => (typeof f.label === "string" && f.label ? f.label : String(f.key));
  const what = owner.kind === "command" ? "parameter" : "field";

  /** Click: picks it; Ctrl/Cmd adds or removes it; Shift picks the run from the last one. */
  const click = (id: string, e: { ctrlKey: boolean; metaKey: boolean; shiftKey: boolean }) => {
    if (e.shiftKey && anchor.current) {
      const list = shown.map((r) => r.id);
      const [a, b] = [list.indexOf(anchor.current), list.indexOf(id)].sort((x, y) => x - y);
      if (a >= 0) return setSelected(list.slice(a, b + 1));
    }
    anchor.current = id;
    if (e.ctrlKey || e.metaKey) return setSelected((before) => (before.includes(id) ? before.filter((k) => k !== id) : [...before, id]));
    setSelected([id]);
  };
  /** Moves fields (keeping their order) to index `to` of the list. */
  const move = (moving: string[], to: number) => {
    const block = rows.filter((r) => moving.includes(r.id));
    const before = rows.slice(0, to).filter((r) => !moving.includes(r.id)).length;
    const rest = rows.filter((r) => !moving.includes(r.id));
    rest.splice(Math.max(0, Math.min(rest.length, before)), 0, ...block);
    if (!same(rest.map((r) => r.id), rows.map((r) => r.id))) change(rest, `Moved ${block.length === 1 ? `${what} "${label(block[0].f)}"` : `${block.length} ${what}s`}`);
  };
  const nudge = (up: boolean) => {
    const at = selected.map((id) => rows.findIndex((r) => r.id === id)).filter((i) => i >= 0).sort((a, b) => a - b);
    if (at.length) move(selected, up ? Math.max(0, at[0] - 1) : Math.min(rows.length, at[at.length - 1] + 2));
  };
  const remove = (gone: string[]) => {
    const left = rows.filter((r) => !gone.includes(r.id));
    if (left.length === rows.length) return;
    change(left, gone.length === 1 ? `Removed ${what} "${label(rows.find((r) => r.id === gone[0])!.f)}"` : `Removed ${gone.length} ${what}s`);
    setSelected([]);
  };
  const duplicate = () => {
    const taken = new Set(keys);
    const copies = new Map<string, Row>();
    for (const { id, f } of picked) {
      let key = `${f.key}_copy`;
      for (let n = 2; taken.has(key); n++) key = `${f.key}_copy_${n}`;
      taken.add(key);
      copies.set(id, { id: `f${nextId.current++}`, savedKey: "", f: { ...clone(f), key, label: `${label(f)} (copy)` } });
    }
    if (!copies.size) return;
    change(rows.flatMap((r) => (copies.has(r.id) ? [r, copies.get(r.id)!] : [r])), copies.size === 1 ? `Duplicated ${what} "${label(picked[0].f)}"` : `Duplicated ${copies.size} ${what}s`);
    setSelected([...copies.values()].map((c) => c.id));
  };
  /** Pastes the copied settings of the groups switched on into every picked field (never the key). */
  const paste = (groups: Record<string, boolean>) => {
    if (!clipboard) return;
    const paths = GROUPS.filter((g) => groups[g.id]).flatMap((g) => g.parts.flatMap((part) => part.settings.map((s) => s.path))).filter((p) => p[0] !== "key");
    change(
      rows.map((r) => {
        if (!selected.includes(r.id)) return r;
        let out = r.f;
        for (const path of paths) {
          const v = get(clipboard.prop, path);
          out = setAt(out, path, v === undefined ? undefined : clone(v), v === undefined);
        }
        return { ...r, f: out };
      }),
      `Pasted settings from "${clipboard.from}"`,
    );
    setPasting(null);
  };
  const addError = !adding ? null : !adding.label.trim() ? "Give it a label." : !KEY_PATTERN.test(adding.key) ? "The key needs letters, digits and _, starting with a letter." : keys.includes(adding.key) ? `${adding.key} is already a ${what}.` : null;
  const add = () => {
    if (!adding || addError) return;
    const row: Row = { id: `f${nextId.current++}`, savedKey: "", f: newProperty(adding.key, adding.label.trim(), adding.type) };
    change([...rows, row], `Added ${what} "${adding.label.trim()}"`);
    setSelected([row.id]);
    anchor.current = row.id;
    setAdding(null);
  };

  const bad = badIn(rows);

  const lookups: Lookups = {
    resources: props.env.resourceNames,
    own: fields.map((f) => ({ key: String(f.key), label: typeof f.label === "string" ? f.label : null, type: typeof f.type === "string" ? f.type : null })),
    noun: owner.kind === "command" ? { one: "parameter", many: "parameters", of: "this command" } : { one: "field", many: "fields", of: "this form" },
    keyTaken: (key) => rows.filter((r) => !selected.includes(r.id)).some((r) => r.f.key === key),
    openResource: (resource) => send("openResourceScreen", { resource }),
    // a code setting in its own file: what's typed here goes to the draft first, so the file starts from it
    openCode: bad
      ? undefined
      : (path, language, text) => {
          if (picked.length !== 1) return;
          flush();
          send("openFieldCode", { workflowId: props.wfId, ownerPath: owner.ownerPath, formKey: owner.formKey, key: picked[0].f.key, path, language, text, workflowName: props.workflowName, contextName: props.contextName });
        },
    fieldsOf: (resource) => {
      if (!resourceFields[resource] && !asked.current.has(resource)) {
        asked.current.add(resource);
        send("fetchResourceFields", { resource });
      }
      return resourceFields[resource] ?? null;
    },
    recordsOf: (resource, value, labelField) => {
      const have = props.env.lookupOptions[resource];
      if (have === undefined) props.env.needLookup(resource, value, labelField);
      return have ? have.map((o): [string, string] => [o.value, o.label]) : null;
    },
  };

  return (
    <div className="pe-theme ft" onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) flush(); }} onClick={() => menu && setMenu(null)}>
      <aside className="rs-side ft-side">
        <div className="rs-side-top">
          <input className="rs-search" placeholder={`Search ${what}s`} aria-label={`Search ${what}s`} value={query} onChange={(e) => setQuery(e.target.value)} />
          <button className="rs-btn rs-add" title={`Add a ${what}`} aria-label={`Add a ${what}`} onClick={() => setAdding(adding ? null : { label: "", key: "", keyTouched: false, type: "string" })}>+</button>
        </div>
        {adding && (
          <form className="rs-new" onSubmit={(e) => { e.preventDefault(); add(); }}>
            <input className="pe-input" autoFocus placeholder="Label, like First Name" aria-label={`New ${what} label`} value={adding.label} onChange={(e) => setAdding({ ...adding, label: e.target.value, key: adding.keyTouched ? adding.key : keyFrom(e.target.value) })} />
            <input className="pe-input is-mono" placeholder="key, like first_name" aria-label={`New ${what} key`} value={adding.key} onChange={(e) => setAdding({ ...adding, key: e.target.value, keyTouched: true })} />
            <Cards label={`New ${what} type`} value={adding.type} options={TYPES.map(([v, l]) => [v, l] as [string, string])} onPick={(type) => setAdding({ ...adding, type })} />
            {addError && (adding.label || adding.key) && <span className="pe-error">{addError}</span>}
            <div className="pe-btns">
              <button type="button" className="rs-btn" onClick={() => setAdding(null)}>Cancel</button>
              <button type="submit" className="rs-btn is-primary" disabled={!!addError}>Add</button>
            </div>
          </form>
        )}
        <div className="rs-side-info">
          <span>
            {fields.length} {what}{fields.length === 1 ? "" : "s"} · {fields.filter((f) => f.required === true).length} required{selected.length > 1 ? ` · ${selected.length} picked` : ""}
          </span>
        </div>
        <div
          className="rs-list"
          role="listbox"
          aria-label={owner.kind === "command" ? "Parameters" : "Form fields"}
          aria-multiselectable="true"
          onDragOver={(e) => { if (dragIds) e.preventDefault(); }}
          onDrop={(e) => { e.preventDefault(); if (dragIds && dropAt !== null) move(dragIds, dropAt); setDragIds(null); setDropAt(null); }}
          onKeyDown={(e) => {
            const current = selected[selected.length - 1];
            if (!current) return;
            if (e.altKey && (e.key === "ArrowUp" || e.key === "ArrowDown") && canMove) {
              e.preventDefault();
              nudge(e.key === "ArrowUp");
            } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
              e.preventDefault();
              const list = shown.map((r) => r.id);
              const at = list.indexOf(current) + (e.key === "ArrowUp" ? -1 : 1);
              if (at >= 0 && at < list.length) click(list[at], { ctrlKey: false, metaKey: false, shiftKey: e.shiftKey });
            } else if (e.key === "Delete" || e.key === "Backspace") {
              e.preventDefault();
              remove(selected);
            }
          }}
        >
          {shown.map((r) => {
            const { id, f } = r;
            const key = String(f.key);
            const index = rows.indexOf(r);
            const isPicked = selected.includes(id);
            const mapped = mappedOf(f);
            const before = saved?.get(r.savedKey);
            const changed = saved !== null && (!before || !same(before, f));
            return (
              <div key={id} className="rs-item-wrap">
                {dropAt === index && dragIds && <div className="rs-drop" />}
                <div
                  className={`rs-item${isPicked ? " is-selected" : ""}${dragIds?.includes(id) ? " is-dragging" : ""}`}
                  role="option"
                  aria-selected={isPicked}
                  tabIndex={isPicked || (!selected.length && index === 0) ? 0 : -1}
                  draggable={canMove}
                  onClick={(e) => click(id, e)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    if (!isPicked) { setSelected([id]); anchor.current = id; }
                    setMenu({ x: e.clientX, y: e.clientY });
                  }}
                  onDragStart={(e) => {
                    const moving = isPicked ? rows.filter((x) => selected.includes(x.id)).map((x) => x.id) : [id];
                    if (!isPicked) setSelected([id]);
                    setDragIds(moving);
                    e.dataTransfer.effectAllowed = "move";
                    e.dataTransfer.setData("text/plain", moving.join(","));
                  }}
                  onDragEnd={() => { setDragIds(null); setDropAt(null); }}
                  onDragOver={(e) => {
                    if (!dragIds) return;
                    e.preventDefault();
                    const box = e.currentTarget.getBoundingClientRect();
                    setDropAt(e.clientY < box.top + box.height / 2 ? index : index + 1);
                  }}
                  title={canMove ? "Drag to reorder (or Alt+↑ / Alt+↓). Ctrl/Cmd or Shift+click to pick several." : "Clear the search to reorder"}
                >
                  <span className={`rs-grip${mapped ? ` is-${mapped.kind}` : ""}`} aria-hidden="true" />
                  <span className="rs-item-text">
                    <span className="rs-item-label">
                      {label(f)}
                      {f.required === true && <span className="rs-req" title="Required">*</span>}
                      {saved !== null && !before && <span className="rs-new-pill">new</span>}
                    </span>
                    <span className="rs-item-key">{key}</span>
                  </span>
                  <span className="rs-item-end">
                    <span className="rs-item-type">{typeof f.type === "string" ? f.type : "—"}</span>
                    {mapped && (
                      <button type="button" className={`rs-chip is-${mapped.kind}`} title={`Open ${mapped.resource} on the Resources screen`} onClick={(e) => { e.stopPropagation(); send("openResourceScreen", { resource: mapped.resource }); }}>
                        {mapped.resource}
                      </button>
                    )}
                  </span>
                  {changed && <span className="rs-dot" title="Changed since the workflow was saved" />}
                </div>
              </div>
            );
          })}
          {dropAt === rows.length && dragIds && <div className="rs-drop" />}
          {!fields.length && !adding && <p className="rs-empty">No {what}s yet. Add one with +.</p>}
          {fields.length > 0 && !shown.length && <p className="rs-empty">No {what} matches “{query}”.</p>}
        </div>
      </aside>

      <section className="rs-detail ft-detail">
        {bad && <p className="pe-error ft-bad">The key of {label(bad.f)} isn't valid or is used twice, so the change waits until it's fixed.</p>}
        {!picked.length ? (
          <p className="rs-empty">Pick a {what} on the left (Ctrl/Cmd or Shift+click to pick several), or add one with +.</p>
        ) : (
          <>
            <div className="rs-detail-head">
              <div>
                <div className="rs-detail-label">{picked.length === 1 ? label(picked[0].f) : `${picked.length} ${what}s`}</div>
                <div className="rs-detail-key">{picked.map((r) => r.f.key).join(", ")}</div>
              </div>
              {picked.length === 1 && <span className="rs-pill">{typeof picked[0].f.type === "string" ? picked[0].f.type : "no type"}</span>}
            </div>
            <PropertyEditor
              key={picked.map((r) => r.id).join("|")}
              noMenu
              items={picked.map((r) => ({ original: saved?.get(r.savedKey) ?? r.f, draft: r.f }))}
              onChange={(drafts) => {
                const byId = new Map(picked.map((r, i) => [r.id, drafts[i]]));
                change(rows.map((r) => (byId.has(r.id) ? { ...r, f: byId.get(r.id)! } : r)), picked.length === 1 ? `Changed ${what} "${label(picked[0].f)}"` : `Changed ${picked.length} ${what}s`);
              }}
              lookups={lookups}
              disabled={false}
              group={group}
              onGroup={setGroup}
              hints={{ key: `The name the ${owner.kind === "command" ? "command" : "form"} stores the value under. Steps read it as _params.<key>; steps that use the old key aren't changed with it.` }}
            />
          </>
        )}
      </section>

      {menu && picked.length > 0 && (
        <div className="rs-menu" role="menu" style={{ left: Math.min(menu.x, window.innerWidth - 230), top: Math.min(menu.y, window.innerHeight - 220) }} onClick={(e) => e.stopPropagation()}>
          <button role="menuitem" onClick={() => { duplicate(); setMenu(null); }}>Duplicate{picked.length > 1 ? ` ${picked.length}` : ""}</button>
          {picked.length === 1 && <button role="menuitem" onClick={() => { setClipboard({ from: label(picked[0].f), prop: clone(picked[0].f) }); setMenu(null); }}>Copy settings</button>}
          <button role="menuitem" disabled={!clipboard} onClick={() => { setPasting(Object.fromEntries(GROUPS.map((g) => [g.id, g.id !== "general"]))); setMenu(null); }}>
            Paste settings{clipboard ? ` from ${clipboard.from}` : ""}
          </button>
          <button role="menuitem" onClick={() => { void navigator.clipboard?.writeText(picked.map((r) => r.f.key).join("\n")); setMenu(null); }}>Copy {picked.length === 1 ? "key" : "keys"}</button>
          <div className="rs-menu-line" />
          <button role="menuitem" className="is-danger" onClick={() => { remove(picked.map((r) => r.id)); setMenu(null); }}>Delete{picked.length > 1 ? ` ${picked.length}` : ""}</button>
        </div>
      )}

      {pasting && clipboard && (
        <div className="rs-modal-back" onClick={() => setPasting(null)}>
          <div className="rs-modal" role="dialog" aria-label="Paste settings" onClick={(e) => e.stopPropagation()}>
            <h2>Paste settings from {clipboard.from}</h2>
            <p className="pe-hint">Into {picked.length === 1 ? label(picked[0].f) : `${picked.length} ${what}s`}. Pick the groups to bring over; the key never is.</p>
            <div className="pe-card">
              {GROUPS.map((g) => (
                <div key={g.id} className="pe-row">
                  <div className="pe-text">
                    <label className="pe-label" htmlFor={`ft-paste-${g.id}`}>{g.title}</label>
                    <span className="pe-hint">{g.id === "general" ? "Label, description, type, tags and rules." : g.blurb}</span>
                  </div>
                  <div className="pe-control">
                    <Switch id={`ft-paste-${g.id}`} on={!!pasting[g.id]} label={g.title} onSet={(on) => setPasting({ ...pasting, [g.id]: on })} />
                  </div>
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
    </div>
  );
}
