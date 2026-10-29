// A Create or Property Updater step's settings (0.3.69), drawn like Saturn's own forms for them
// (CreateResourceOperatorForm, PropertyUpdaterForm): the resource, then the properties it sets, each with the
// control its input type calls for (text, a rich text editor, a record picker, a list of choices, a date), a ⇋
// button that turns it into a plain box for a {{ template }}, and × to take it out. Only the properties with a value
// are listed; "Add a property" offers the resource's others. A property left empty isn't saved.
//
// Saturn's operator list names Create's settings resource_name / Properties / id, but the steps its form saves
// (and every real one seen) store `resource` and `properties`; those are the ones written here. A step that has
// `resource_name` keeps it. Property Updater: `resource_type` (empty: the record the workflow runs on), `resource_id`
// and `properties` (the host writes `_properties` from it).
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import type { Catalog } from "./types";
import { FieldControl, FormEnvContext, enrich, type FieldSpec, type FormError } from "./forms";
import { RichText } from "./richtext";
import { HighlightInput } from "./controls";

export type RecordFormKind = "create" | "updater";

/** A property of a resource, as the host's fetchResourceFields gives it. */
export interface ResourceField {
  key: string;
  label: string | null;
  type: string | null;
  index?: number;
  inputType?: string | null;
  lookupType?: string | null;
  choices?: string[] | null;
  map?: { resource: string; valueField: string; labelField: string } | null;
  required?: boolean;
}

// the dates every record has, which Saturn's Create form also offers
const BUILT_IN: ResourceField[] = [
  { key: "created_at", label: "Created at", type: "date" },
  { key: "updated_at", label: "Updated at", type: "date" },
];

const json = (obj: Record<string, unknown>) => JSON.stringify(obj);

export function recordFormOf(operator: string | null | undefined, catalog: Catalog): RecordFormKind | null {
  if (!operator) return null;
  const form = catalog[operator]?.form;
  if (operator === "create" || form === "CreateResourceOperatorForm") return "create";
  if (operator === "property_updater" || form === "PropertyUpdaterForm") return "updater";
  return null;
}

/** A stored value as the text its control holds: an empty object (an unpicked date in Saturn's form) is empty. */
function toText(v: unknown): string {
  if (v === undefined || v === null) return "";
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  if (typeof v === "object" && !Array.isArray(v) && Object.keys(v as object).length === 0) return "";
  return JSON.stringify(v, null, 2);
}

/** What a control's text is stored as: empty is left out (undefined); true / false and numbers for those types;
 *  JSON for a list or object; otherwise the text. A template is always text. */
function fromText(text: string, field: ResourceField | undefined, template: boolean): unknown {
  if (text.trim() === "") return undefined;
  if (template || /\{\{/.test(text)) return text;
  const type = field?.type ?? "";
  if (type === "boolean" && (text === "true" || text === "false")) return text === "true";
  if (type === "number" && /^-?\d+(\.\d+)?$/.test(text.trim())) return Number(text.trim());
  if ((type === "array" || type === "object") && /^\s*[[{]/.test(text)) {
    try {
      return JSON.parse(text);
    } catch {
      /* text, until it's valid */
    }
  }
  return text;
}

/** Controls that can't hold a typed {{ template }}: a ⇋ is needed to type one. */
function needsTemplateBox(field: ResourceField | undefined) {
  return !!field && (field.inputType === "richtexteditor" || !!field.choices?.length || field.type === "boolean");
}

function specFor(key: string, field: ResourceField | undefined, template: boolean, known: boolean, resource: string): FieldSpec {
  const base: FieldSpec = {
    key,
    label: field?.label ?? key,
    kind: "text",
    required: field?.required,
    caption: !field ? (known ? `a key of its own · not one of ${resource}'s properties` : "a key of its own") : `${key}${field.type ? ` · ${field.type}` : ""}`,
  };
  if (template) return { ...base, kind: "textarea", placeholder: "{{ template }} or a value", caption: `${base.caption} · typed` };
  if (!field) return base;
  if (field.map) return { ...base, kind: "lookup", lookup: { ...field.map, multiple: false, typed: true } };
  if (field.choices?.length) return { ...base, kind: "select", options: [{ value: "", label: "— not set —" }, ...field.choices.map((c) => ({ value: c, label: c }))] };
  if (field.type === "boolean")
    return { ...base, kind: "select", options: [{ value: "", label: "— not set —" }, { value: "true", label: "true" }, { value: "false", label: "false" }] };
  if (field.type === "array" || field.type === "object") return { ...base, kind: "textarea", lang: "json", placeholder: field.type === "array" ? "[]" : "{}" };
  if (field.inputType === "textarea") return { ...base, kind: "textarea" };
  return enrich({ ...base, kind: field.type === "number" ? "number" : "text" }, field.type === "date" ? "datetime" : field.type, field.inputType);
}

export function RecordForm(props: {
  kind: RecordFormKind;
  values: Record<string, string>;
  errors: FormError[];
  canOpenFiles: boolean;
  onChange: (key: string, v: string) => void;
  /** Enter / leaving a box / a pick: apply, with these settings changed */
  onCommit: (override?: Record<string, string>) => void;
}) {
  const env = useContext(FormEnvContext);
  const { values, kind } = props;
  const resKey = kind === "updater" ? "resource_type" : !values.resource && values.resource_name ? "resource_name" : "resource";
  const propsKey = !values.properties && values.Properties && values.Properties !== "{}" ? "Properties" : "properties";
  const picked = (values[resKey] ?? "").trim();
  const resource = picked || (kind === "updater" ? env.workflowResource ?? "" : "");
  const templated = /\{\{/.test(resource);
  const fields = resource && !templated ? env.fields?.(resource) : undefined;
  const errFor = (k: string) => props.errors.find((e) => e.param === k)?.message;

  // the catalog's defaults for Create ({} for its ID and Properties) aren't real values: Saturn's form leaves them out
  useEffect(() => {
    if (kind !== "create") return;
    for (const k of ["id", "Properties"]) if ((values[k] ?? "").trim() === "{}") props.onChange(k, "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const text = values[propsKey] ?? "";
  const parsed = useMemo(() => {
    if (!text.trim()) return {} as Record<string, unknown>;
    try {
      const v = JSON.parse(text);
      return v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : null;
    } catch {
      return null;
    }
  }, [text]);

  // the rows shown: the stored ones, and any added here (an empty one stays until the step is left)
  const [rows, setRows] = useState<string[]>(() => Object.keys(parsed ?? {}));
  useEffect(() => {
    if (parsed) setRows((cur) => [...cur, ...Object.keys(parsed).filter((k) => !cur.includes(k))]);
  }, [parsed]);
  const [templates, setTemplates] = useState<Set<string>>(() => new Set());
  const [focusKey, setFocusKey] = useState<string | null>(null);
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!focusKey) return;
    // the value's box (not a key of its own's name box)
    const row = box.current?.querySelector(`[data-prop="${CSS.escape(focusKey)}"]`);
    [...(row?.querySelectorAll<HTMLElement>("input, textarea, select, .ql-editor") ?? [])].find((el) => !el.closest(".nv-prop-key"))?.focus();
    setFocusKey(null);
  }, [focusKey]);

  // a resource just picked, waiting for its properties (switch, below)
  const [switching, setSwitching] = useState<string | null>(null);
  const nextFields = switching && !/\{\{/.test(switching) ? env.fields?.(switching) : undefined;
  useEffect(() => {
    if (switching === null) return;
    // a template, or none: nothing to compare with, so the properties stay
    const known = switching && !/\{\{/.test(switching) ? nextFields : [];
    if (known === null || known === undefined) return;
    const keep = new Set([...known.map((f) => f.key), ...(known.length ? BUILT_IN.map((b) => b.key) : [])]);
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(parsed ?? {})) if (!known.length || keep.has(k)) out[k] = v;
    setRows((cur) => (known.length ? cur.filter((k) => keep.has(k)) : cur));
    const change: Record<string, string> = { [resKey]: switching };
    if (parsed && Object.keys(out).length !== Object.keys(parsed).length) change[propsKey] = json(out);
    for (const [k, v] of Object.entries(change)) props.onChange(k, v);
    props.onCommit(change);
    setSwitching(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [switching, nextFields]);

  const fieldOf = (k: string) => fields?.find((f) => f.key === k) ?? BUILT_IN.find((f) => f.key === k);
  const isTemplate = (k: string) => templates.has(k) || (needsTemplateBox(fieldOf(k)) && typeof parsed?.[k] === "string" && /^\s*\{\{[\s\S]*\}\}\s*$/.test(parsed[k] as string));
  const withValue = (k: string, t: string) => {
    const next: Record<string, unknown> = {};
    for (const key of [...Object.keys(parsed ?? {}), ...(parsed && k in parsed ? [] : [k])]) {
      const v = key === k ? fromText(t, fieldOf(k), isTemplate(k)) : parsed![key];
      if (v !== undefined) next[key] = v;
    }
    return json(next);
  };
  const change = (k: string, t: string) => props.onChange(propsKey, withValue(k, t));
  const commit = (k: string, t?: string) => props.onCommit(t === undefined ? undefined : { [propsKey]: withValue(k, t) });
  const remove = (k: string) => {
    setRows((cur) => cur.filter((x) => x !== k));
    if (parsed && k in parsed) {
      const v = withValue(k, "");
      props.onChange(propsKey, v);
      props.onCommit({ [propsKey]: v });
    }
  };
  const add = (keys: string[]) => {
    const fresh = keys.map((k) => k.trim()).filter(Boolean);
    if (!fresh.length) return;
    setRows((cur) => [...cur, ...fresh.filter((k, i) => !cur.includes(k) && fresh.indexOf(k) === i)]);
    setFocusKey(fresh[0]);
  };
  // a key of its own renamed in place (its value and place kept); null when that's fine, else why not
  const renameKey = (from: string, to: string): string | null => {
    const t = to.trim();
    if (t === from) return null;
    if (!t) return "A property needs a key.";
    if (rows.includes(t)) return `"${t}" is already in this step.`;
    setRows((cur) => cur.map((x) => (x === from ? t : x)));
    setTemplates((cur) => {
      if (!cur.has(from)) return cur;
      const next = new Set(cur);
      next.delete(from);
      next.add(t);
      return next;
    });
    if (parsed && from in parsed) {
      const out: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(parsed)) out[k === from ? t : k] = v;
      props.onChange(propsKey, json(out));
      props.onCommit({ [propsKey]: json(out) });
    }
    return null;
  };

  const unused = [...(fields ?? []).slice().sort((a, b) => (a.index ?? 0) - (b.index ?? 0)), ...BUILT_IN.filter((b) => !fields?.some((f) => f.key === b.key))].filter((f) => !rows.includes(f.key));

  const resourceSpec: FieldSpec = {
    key: resKey,
    label: kind === "updater" ? "Resource" : "Resource",
    kind: "resource",
    required: kind === "create",
    caption:
      kind === "updater"
        ? picked
          ? resKey
          : `Not set: the record the workflow runs on${env.workflowResource ? ` (${env.workflowResource})` : ""}`
        : resKey,
  };

  return (
    <div className="nv-recform" ref={box}>
      <FieldControl
        f={resourceSpec}
        value={values[resKey] ?? ""}
        error={errFor(resKey)}
        canOpenFiles={false}
        onChange={(v) => props.onChange(resKey, v)}
        onCommit={(v) => {
          // another resource (0.3.70): its properties are read first, so the switch and taking out the properties it
          // doesn't have are one change (one Undo brings them back)
          const next = (v ?? values[resKey] ?? "").trim();
          if (v === undefined || next === picked) return props.onCommit(v === undefined ? undefined : { [resKey]: v });
          setSwitching(next);
        }}
      />
      {kind === "updater" && (
        <FieldControl
          f={{ key: "resource_id", label: "Record ID", kind: "text", placeholder: "{{ _resource.id }}", caption: "resource_id · empty: the record the workflow runs on" }}
          value={values.resource_id ?? ""}
          error={errFor("resource_id")}
          canOpenFiles={false}
          onChange={(v) => props.onChange("resource_id", v)}
          onCommit={(v) => props.onCommit(v === undefined ? undefined : { resource_id: v })}
        />
      )}
      {kind === "create" && (values.id ?? "").trim() && values.id.trim() !== "{}" && (
        <FieldControl
          f={{ key: "id", label: "ID", kind: "text", caption: "id · the new record's id (empty: Saturn makes one)" }}
          value={values.id}
          canOpenFiles={false}
          onChange={(v) => props.onChange("id", v)}
          onCommit={(v) => props.onCommit(v === undefined ? undefined : { id: v })}
        />
      )}
      {kind === "updater" &&
        ["resource_property", "value"].filter((k) => (values[k] ?? "").trim()).map((k) => (
          <FieldControl
            key={k}
            f={{ key: k, label: k === "value" ? "Single property value" : "Single property name", kind: "text", caption: `${k} · added to the properties when it runs` }}
            value={values[k]}
            canOpenFiles={false}
            onChange={(v) => props.onChange(k, v)}
            onCommit={(v) => props.onCommit(v === undefined ? undefined : { [k]: v })}
          />
        ))}

      <div className="nv-recform-head">
        <span>Properties</span>
        {resource && fields === null && <span className="nv-muted">Reading {resource}'s properties…</span>}
        {templated && <span className="nv-muted">The resource is a template, so its properties aren't known here.</span>}
        {parsed && <AddProperties unused={unused} taken={rows} onAdd={add} />}
      </div>
      {errFor(propsKey) && <span className="nv-field-err">{errFor(propsKey)}</span>}
      {parsed === null ? (
        <FieldControl
          f={{ key: propsKey, label: "Properties", kind: "textarea", caption: `${propsKey} · not a list of properties, so it's shown as text` }}
          value={text}
          canOpenFiles={false}
          onChange={(v) => props.onChange(propsKey, v)}
          onCommit={(v) => props.onCommit(v === undefined ? undefined : { [propsKey]: v })}
        />
      ) : (
        <>
          {rows.length === 0 && <p className="nv-muted nv-recform-none">No properties set yet. Add some with + Add.</p>}
          {rows.map((k) => {
            const field = fieldOf(k);
            const template = isTemplate(k);
            const value = toText(parsed[k]);
            const tools = (
              <span className="nv-prop-tools">
                <button
                  type="button"
                  className={`nv-prop-tool ${template ? "is-on" : ""}`}
                  title={template ? "Use its normal control" : "Type a value or a {{ template }} instead"}
                  aria-label={template ? `Use ${k}'s normal control` : `Type a template for ${k}`}
                  aria-pressed={template}
                  onClick={() =>
                    setTemplates((cur) => {
                      const next = new Set(cur);
                      if (template) next.delete(k);
                      else next.add(k);
                      // a template shown in its normal control again
                      if (template && needsTemplateBox(field) && /\{\{/.test(value)) next.delete(k);
                      return next;
                    })
                  }
                >
                  ⇋
                </button>
                <button type="button" className="nv-prop-tool" title={`Take ${field?.label ?? k} out of this step`} aria-label={`Remove ${k}`} onClick={() => remove(k)}>
                  ×
                </button>
              </span>
            );
            if (field?.inputType === "richtexteditor" && !template)
              return (
                <div key={k} className="nv-field is-wide nv-prop" data-prop={k}>
                  <span className="nv-field-label">
                    <span className="nv-field-name">{field.label ?? k}</span>
                    {tools}
                  </span>
                  <RichText value={value} onChange={(html) => change(k, html)} onCommit={(html) => commit(k, html)} />
                  <span className="nv-field-caption">{k} · rich text</span>
                </div>
              );
            return (
              <div key={k} className={`nv-prop ${field ? "" : "is-own"}`} data-prop={k}>
                <FieldControl
                  f={specFor(k, field, template, fields != null, resource)}
                  value={value}
                  canOpenFiles={props.canOpenFiles}
                  extra={tools}
                  nameSlot={field ? undefined : <KeyBox value={k} onRename={(to) => renameKey(k, to)} />}
                  onChange={(t) => change(k, t)}
                  onCommit={(t) => commit(k, t)}
                />
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}

/** A key of its own (not one of the resource's properties), typed in a highlighted box; applied on Enter or when
 *  the box is left, refused (and put back) when it's empty or already used. */
function KeyBox(props: { value: string; onRename: (to: string) => string | null }) {
  const [v, setV] = useState(props.value);
  const [problem, setProblem] = useState<string | null>(null);
  useEffect(() => setV(props.value), [props.value]);
  const done = () => {
    const why = props.onRename(v);
    setProblem(why);
    if (why) setV(props.value);
  };
  return (
    <span className="nv-prop-key" title={problem ?? "This step's own key: click to change it"}>
      <HighlightInput
        value={v}
        placeholder="key or {{ template }}"
        onChange={(t) => {
          setV(t);
          setProblem(null);
        }}
        onBlur={done}
        onKeyDown={(e) => {
          e.stopPropagation();
          if (e.key === "Enter") {
            e.preventDefault();
            done();
          } else if (e.key === "Escape") {
            setV(props.value);
            setProblem(null);
          }
        }}
      />
      {problem && <span className="nv-field-caption is-warn">{problem}</span>}
    </span>
  );
}

/** + Add, at the right of the Properties title: a menu of the resource's other properties to tick (several at
 *  once), with a search; text that isn't one of them can be added as a key of its own. */
function AddProperties(props: { unused: ResourceField[]; taken: string[]; onAdd: (keys: string[]) => void }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [ticked, setTicked] = useState<string[]>([]);
  const wrap = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const away = (e: MouseEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", away);
    return () => document.removeEventListener("mousedown", away);
  }, [open]);
  const close = () => {
    setOpen(false);
    setQ("");
    setTicked([]);
  };
  const t = q.trim();
  const shown = props.unused.filter((f) => !t || `${f.label ?? ""} ${f.key}`.toLowerCase().includes(t.toLowerCase()));
  // what's typed, offered as a key of its own when it isn't a property already listed or used
  const own = t && !props.unused.some((f) => f.key === t) && !props.taken.includes(t) ? t : null;
  const ownKeys = ticked.filter((k) => !props.unused.some((f) => f.key === k));
  const toggle = (k: string) => setTicked((cur) => (cur.includes(k) ? cur.filter((x) => x !== k) : [...cur, k]));
  const addAll = () => {
    props.onAdd(ticked);
    close();
  };
  return (
    <div className="nv-addprops" ref={wrap}>
      <button type="button" className="nv-mini-btn nv-addprops-btn" title="Add properties" aria-haspopup="dialog" aria-expanded={open} onClick={() => (open ? close() : setOpen(true))}>
        + Add
      </button>
      {open && (
        <div className="nv-addprops-pop" role="dialog" aria-label="Add properties">
          <input
            autoFocus
            className="nv-menu-search"
            placeholder="Search, or type a key of its own…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              e.stopPropagation();
              if (e.key === "Escape") close();
              else if (e.key === "Enter") {
                e.preventDefault();
                if (ticked.length) addAll();
                else if (shown.length === 1) toggle(shown[0].key);
                else if (own) toggle(own);
              }
            }}
          />
          <div className="nv-addprops-list">
            {own && (
              <label className="nv-addprops-row is-own">
                <input type="checkbox" checked={ticked.includes(own)} onChange={() => toggle(own)} />
                <span>
                  Add <code>{own}</code> as a key of its own
                </span>
              </label>
            )}
            {ownKeys
              .filter((k) => k !== own)
              .map((k) => (
                <label key={k} className="nv-addprops-row is-own">
                  <input type="checkbox" checked onChange={() => toggle(k)} />
                  <span>
                    <code>{k}</code> (a key of its own)
                  </span>
                </label>
              ))}
            {shown.map((f) => (
              <label key={f.key} className="nv-addprops-row">
                <input type="checkbox" checked={ticked.includes(f.key)} onChange={() => toggle(f.key)} />
                <span className="nv-addprops-name">{f.label ?? f.key}</span>
                <code>{f.key}</code>
              </label>
            ))}
            {!shown.length && !own && <span className="nv-muted nv-addprops-none">{props.unused.length ? "No properties match." : "Every property is already here."}</span>}
          </div>
          <div className="nv-addprops-foot">
            <span className="nv-muted">{ticked.length ? `${ticked.length} picked` : "Tick the ones to add"}</span>
            <span className="nv-spacer" />
            <button type="button" className="nv-mini-btn" onClick={close}>
              Cancel
            </button>
            <button type="button" className="nv-mini-btn is-primary" disabled={!ticked.length} onClick={addAll}>
              {ticked.length > 1 ? `Add ${ticked.length} properties` : "Add"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
