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
    caption: known && !field ? `${key} · not one of ${resource}'s properties` : `${key}${field?.type ? ` · ${field.type}` : ""}`,
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
  const [other, setOther] = useState<string | null>(null);
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!focusKey) return;
    box.current?.querySelector<HTMLElement>(`[data-prop="${CSS.escape(focusKey)}"] input, [data-prop="${CSS.escape(focusKey)}"] textarea, [data-prop="${CSS.escape(focusKey)}"] select, [data-prop="${CSS.escape(focusKey)}"] .ql-editor`)?.focus();
    setFocusKey(null);
  }, [focusKey]);

  const fieldOf = (k: string) => fields?.find((f) => f.key === k) ?? BUILT_IN.find((f) => f.key === k);
  const isTemplate = (k: string) => templates.has(k) || (needsTemplateBox(fieldOf(k)) && typeof parsed?.[k] === "string" && /^\s*\{\{[\s\S]*\}\}\s*$/.test(parsed[k] as string));
  const json = (obj: Record<string, unknown>) => JSON.stringify(obj);
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
  const add = (k: string) => {
    if (!k) return;
    setRows((cur) => (cur.includes(k) ? cur : [...cur, k]));
    setFocusKey(k);
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
        onCommit={(v) => props.onCommit(v === undefined ? undefined : { [resKey]: v })}
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
          {rows.length === 0 && <p className="nv-muted nv-recform-none">No properties set yet. Add one below.</p>}
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
              <div key={k} className="nv-prop" data-prop={k}>
                <FieldControl
                  f={specFor(k, field, template, fields != null, resource)}
                  value={value}
                  canOpenFiles={props.canOpenFiles}
                  extra={tools}
                  onChange={(t) => change(k, t)}
                  onCommit={(t) => commit(k, t)}
                />
              </div>
            );
          })}
          <div className="nv-recform-add">
            {other === null ? (
              <select
                aria-label="Add a property"
                value=""
                onChange={(e) => {
                  if (e.target.value === "\u0000other") setOther("");
                  else add(e.target.value);
                }}
              >
                <option value="">+ Add a property…</option>
                {unused.map((f) => (
                  <option key={f.key} value={f.key}>
                    {f.label ?? f.key} ({f.key})
                  </option>
                ))}
                <option value={"\u0000other"}>Another key (type it)…</option>
              </select>
            ) : (
              <span className="nv-input-row">
                <input
                  autoFocus
                  value={other}
                  placeholder="A property's key, or a {{ template }}"
                  aria-label="Property key"
                  onChange={(e) => setOther(e.target.value)}
                  onKeyDown={(e) => {
                    e.stopPropagation();
                    if (e.key === "Enter") {
                      e.preventDefault();
                      add(other.trim());
                      setOther(null);
                    } else if (e.key === "Escape") setOther(null);
                  }}
                />
                <button type="button" className="nv-mini-btn" onClick={() => { add(other.trim()); setOther(null); }}>
                  Add
                </button>
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}
