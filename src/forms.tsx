import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { Catalog, CatalogParam, CommandView } from "./types";
import {
  ColorChip,
  DateButtons,
  HighlightInput,
  Scrub,
  dateModeOf,
  describeDate,
  humanMs,
  isColorParam,
  langFor,
  scrubOf,
  type DateMode,
  type HlLang,
  type ScrubSpec,
} from "./controls";

// ---------------------------------------------------------------------------
// Field model — mirrors the list view's operator form (G1 / yb in the
// workflows bundle): lookups from the instance, resource pickers, key/value
// maps, code opened in a real editor, designed emails, command parameters.

export type FieldKind =
  | "text"
  | "password"
  | "number"
  | "textarea"
  | "code"
  | "select"
  | "object" // key/value map (JSON object)
  | "lookup" // records of a resource, fetched with fetchLookupOptions
  | "resource"; // a resource name (resourceNames)

export interface FieldSpec {
  key: string;
  label: string;
  kind: FieldKind;
  required?: boolean;
  help?: string | null;
  placeholder?: string;
  options?: { value: string; label: string }[];
  language?: string;
  /** lookup: which resource, and whether many can be picked */
  lookup?: { resource: string; valueField: string; labelField: string; multiple: boolean };
  /** caption under the field, like the list view's "param · type" */
  caption?: string;
  /** reference params the command no longer declares */
  stale?: boolean;
  /** hold the label and drag sideways to change it */
  scrub?: ScrubSpec;
  /** the number is milliseconds: show "1.5 s" next to it */
  ms?: boolean;
  /** offer a date/time picker and a Now button */
  date?: DateMode;
  /** offer a colour picker */
  color?: boolean;
  /** syntax for the highlighter (default: {{ templates }}) */
  lang?: HlLang;
}

/** Add the special controls a field gets from its type or name. */
function enrich(f: FieldSpec, type?: string | null, inputType?: string | null): FieldSpec {
  if (!["text", "number", "textarea"].includes(f.kind)) return f;
  const out = { ...f };
  const date = dateModeOf(type, inputType, f.key, f.label);
  const color = !date && isColorParam(type, inputType, f.key, f.label);
  if (date && f.kind !== "textarea") out.date = date;
  else if (color && f.kind !== "textarea") out.color = true;
  else if (!out.scrub && f.kind !== "textarea") {
    const sc = scrubOf(f.kind === "number" ? "number" : type, inputType, f.key, f.label);
    if (sc) out.scrub = sc;
  }
  if (out.scrub && /(^|[_\s])(delay|timeout|interval|ms)([_\s]|$)|\(ms\)/i.test(`${f.key} ${f.label}`)) out.ms = true;
  return out;
}

export interface FormError {
  param: string;
  label?: string;
  message: string;
}

/** What field controls need from the app, without threading props everywhere. */
export interface FormEnv {
  resourceNames: string[];
  lookupOptions: Record<string, { value: string; label: string }[] | null | undefined>;
  needLookup: (resource: string, valueField: string, labelField: string) => void;
  openCode?: (param: string, label: string, language: string) => void;
  openEmail?: (param: string, label: string) => void;
  openDesigner?: () => void;
}
export const FormEnvContext = createContext<FormEnv>({
  resourceNames: [],
  lookupOptions: {},
  needLookup: () => {},
});

const IF_OPERATORS = ["==", "!=", ">", ">=", "<", "<="];

/** Fields for a step, by operator name. */
export function fieldsFor(
  operator: string,
  catalog: Catalog,
  commands: CommandView[],
  values: Record<string, string>,
): FieldSpec[] {
  switch (operator) {
    case "each":
      return [
        { key: "collection", label: "Collection", kind: "text", required: true, placeholder: "{{ _flow }}", help: "What to loop over" },
        { key: "concurrency", label: "Concurrency", kind: "number", placeholder: "1", help: "How many items run at once", scrub: { step: 1, min: 1, px: 8 } },
      ];
    case "parallel":
      return [{ key: "concurrency", label: "Concurrency", kind: "number", placeholder: "1", help: "How many branches run at once", scrub: { step: 1, min: 1, px: 8 } }];
    case "series":
      return [];
    case "if":
      return [
        {
          key: "evaluatorKind",
          label: "Evaluator",
          kind: "select",
          options: [
            { value: "command", label: "Function" },
            { value: "condition", label: "Condition" },
          ],
        },
        ...(values.evaluatorKind === "condition"
          ? [
              { key: "property", label: "Property", kind: "text" as const, required: true, placeholder: "_store.balances.length" },
              {
                key: "conditionOperator",
                label: "Operator",
                kind: "select" as const,
                options: IF_OPERATORS.map((o) => ({ value: o, label: o })),
              },
              { key: "value", label: "Value", kind: "text" as const, placeholder: "0" },
            ]
          : [{ key: "command", label: "Function", kind: "code" as const, language: "javascript", required: true }]),
      ];
    case "reference": {
      const cmd = commands.find((c) => c.id === values.command || c.name === values.command);
      const declared = cmd?.parameters ?? [];
      const stale = Object.keys(values).filter((k) => k !== "command" && !declared.some((p) => p.key === k));
      return [
        {
          key: "command",
          label: "Command",
          kind: "select",
          required: true,
          help: "Point this at a different command",
          options: commands.map((c) => ({ value: c.id, label: c.label })),
        },
        ...declared.map((p) =>
          enrich(
            {
              key: p.key,
              label: p.label,
              kind: "text" as const,
              required: p.required,
              placeholder: `{{ _store.${p.key} }}`,
              caption: `${p.key}${p.type ? ` · ${p.type}` : ""} — read in the command as _params.${p.key}`,
            },
            p.type,
          ),
        ),
        ...stale.map((k) => ({
          key: k,
          label: k,
          kind: "text" as const,
          stale: true,
          caption: "The command no longer declares this parameter",
        })),
      ];
    }
    default: {
      const entry = catalog[operator];
      if (!entry) return Object.keys(values).map((k) => ({ key: k, label: k, kind: "textarea" as const }));
      return entry.params.filter((p) => !p.mergedInto).map((p) => enrich(paramField(p), p.type, p.inputType));
    }
  }
}

function paramField(p: CatalogParam): FieldSpec {
  const base = {
    key: p.param,
    label: p.label,
    required: p.required,
    help: p.description ?? p.lookupHint ?? null,
    caption: `${p.param}${p.type ? ` · ${p.type}` : ""}`,
  };
  if (p.codeLanguage) return { ...base, kind: "code", language: p.codeLanguage };
  if (p.lookupKind === "resources") return { ...base, kind: "resource" };
  if (p.lookupResource)
    return {
      ...base,
      kind: "lookup",
      lookup: { ...p.lookupResource, multiple: p.type === "array" },
    };
  if (p.type === "object") return { ...base, kind: "object" };
  const lookups = (p.lookupValues ?? []).map((v) =>
    typeof v === "string" ? { value: v, label: v } : { value: String(v.value), label: String(v.label ?? v.value) },
  );
  if (lookups.length) return { ...base, kind: "select", options: [{ value: "", label: "— not set —" }, ...lookups] };
  if (p.type === "boolean")
    return {
      ...base,
      kind: "select",
      options: [
        { value: "", label: "— not set —" },
        { value: "true", label: "true" },
        { value: "false", label: "false" },
      ],
    };
  if (p.type === "array" || p.inputType === "textarea")
    return { ...base, kind: "textarea", placeholder: p.type === "array" ? "[]" : undefined, lang: p.type === "array" ? "json" : undefined };
  if (p.sensitive) return { ...base, kind: "password" };
  if (p.type === "number") return { ...base, kind: "text", placeholder: "123 or {{ template }}" };
  return { ...base, kind: "text" };
}

export function defaultsFor(operator: string, catalog: Catalog, commands: CommandView[]): Record<string, string> {
  if (operator === "if") return { evaluatorKind: "condition", conditionOperator: "==" };
  if (operator === "each") return { collection: "{{ _flow }}", concurrency: "1" };
  if (operator === "reference") return { command: commands[0]?.id ?? "" };
  const entry = catalog[operator];
  const v: Record<string, string> = {};
  for (const p of entry?.params ?? []) if (p.defaultValue) v[p.param] = p.defaultValue;
  return v;
}

export function needsForm(operator: string, catalog: Catalog) {
  if (["each", "if", "reference"].includes(operator)) return true;
  if (operator === "series" || operator === "parallel") return false;
  return (catalog[operator]?.params ?? []).some((p) => p.required && !p.defaultValue && !p.mergedInto);
}

// ---------------------------------------------------------------------------
/** One settings control. Shared by the Add dialog and the side-panel editor. */
export function FieldControl(props: {
  f: FieldSpec;
  value: string;
  error?: string;
  /** HTML/designed email held in this param (from readNode) */
  email?: { designTree: boolean } | null;
  canOpenFiles: boolean;
  onChange: (v: string) => void;
  /** Blender-style commit points (panel only): Enter / blur / pick. */
  onCommit?: (v?: string) => void;
  onRevert?: () => void;
}) {
  const env = useContext(FormEnvContext);
  const { f } = props;

  if (props.email)
    return (
      <div className="nv-field is-wide">
        <span className="nv-field-label">
          <span className="nv-field-name">{f.label}</span>
        </span>
        <div className="nv-email-box">
          <div className="nv-email-head">
            <span className="nv-file-ico is-email">✉</span>
            <span className="nv-email-title">{props.email.designTree ? "Designed email" : "HTML content"}</span>
            <span className="nv-spacer" />
            {env.openEmail && (
              <button
                type="button"
                className="nv-mini-btn"
                title="Open the rendered HTML in an editor — saving writes it back"
                onClick={() => env.openEmail!(f.key, f.label)}
              >
                Edit HTML
              </button>
            )}
            {props.email.designTree && env.openDesigner && (
              <button
                type="button"
                className="nv-mini-btn"
                title="Open this workflow in the instance, where the drag-and-drop designer lives"
                onClick={() => env.openDesigner!()}
              >
                Open Designer ↗
              </button>
            )}
          </div>
          <p className="nv-email-note">
            {props.email.designTree ? (
              <>
                Built in the instance's designer. <b>Editing the HTML here does not update the design tree</b>, so
                reopening the designer overwrites those edits.
              </>
            ) : (
              "Hand-written HTML — no design tree, so edits stick."
            )}
          </p>
        </div>
      </div>
    );

  const keys = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!props.onCommit) return;
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      props.onRevert?.();
      (e.target as HTMLElement).blur();
    } else if (e.key === "Enter" && ((f.kind !== "textarea" && f.kind !== "code") || e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      props.onCommit();
    }
  };
  const pick = (v: string) => {
    props.onChange(v);
    props.onCommit?.(v);
  };
  const wide = ["textarea", "code", "object", "lookup"].includes(f.kind);

  let control: React.ReactNode;
  switch (f.kind) {
    case "select":
    case "resource": {
      const opts =
        f.kind === "resource"
          ? [{ value: "", label: "— not set —" }, ...env.resourceNames.map((n) => ({ value: n, label: n }))]
          : f.options ?? [];
      control = (
        <select value={props.value} onChange={(e) => pick(e.target.value)}>
          {!opts.some((o) => o.value === props.value) && props.value !== "" && (
            <option value={props.value}>{props.value}</option>
          )}
          {opts.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      );
      break;
    }
    case "lookup":
      control = <LookupPicker f={f} value={props.value} onPick={pick} />;
      break;
    case "object":
      control = <KeyValueEditor value={props.value} onChange={pick} />;
      break;
    case "code":
    case "textarea": {
      const lang: HlLang =
        f.kind === "code" ? langFor(f.language) : f.lang ?? (/^\s*[[{]/.test(props.value) ? "json" : "tpl");
      control = (
        <HighlightInput
          multiline
          mono={f.kind === "code" || lang === "json"}
          className={f.kind === "code" ? "is-code" : ""}
          rows={f.kind === "code" ? 7 : 4}
          lang={lang}
          spellCheck={f.kind !== "code" && lang === "tpl"}
          placeholder={f.placeholder}
          value={props.value}
          onChange={props.onChange}
          onBlur={() => props.onCommit?.()}
          onKeyDown={keys}
        />
      );
      break;
    }
    case "password":
      control = (
        <input
          type="password"
          placeholder={f.placeholder}
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          onBlur={() => props.onCommit?.()}
          onKeyDown={keys}
        />
      );
      break;
    default: {
      const hint = f.ms ? humanMs(props.value) : null;
      const input = (
        <HighlightInput
          lang="tpl"
          mono={!!f.color}
          placeholder={f.placeholder ?? (f.date === "date" ? "YYYY-MM-DD or {{ template }}" : f.date === "time" ? "HH:mm" : f.date ? "ISO date-time or {{ template }}" : f.color ? "#3b82f6" : undefined)}
          value={props.value}
          suffix={hint ?? undefined}
          onChange={props.onChange}
          onBlur={() => props.onCommit?.()}
          onKeyDown={(e) => {
            if (f.scrub && (e.key === "ArrowUp" || e.key === "ArrowDown") && /^\s*-?\d*\.?\d*\s*$/.test(props.value)) {
              e.preventDefault();
              const m = (e.shiftKey ? 10 : 1) * f.scrub.step * (e.key === "ArrowUp" ? 1 : -1);
              let n = (Number(props.value) || 0) + m;
              if (f.scrub.min !== undefined) n = Math.max(f.scrub.min, n);
              if (f.scrub.max !== undefined) n = Math.min(f.scrub.max, n);
              props.onChange(String(+n.toFixed(4)));
              return;
            }
            keys(e);
          }}
        />
      );
      control =
        f.date || f.color ? (
          <span className="nv-input-row">
            {f.color && <ColorChip value={props.value} onChange={(c) => props.onChange(c)} onCommit={pick} />}
            {input}
            {f.date && <DateButtons value={props.value} mode={f.date} onPick={pick} />}
          </span>
        ) : (
          input
        );
    }
  }

  return (
    <Wrap className={`nv-field ${props.error ? "has-error" : ""} ${wide ? "is-wide" : ""} ${f.stale ? "is-stale" : ""}`}>
      <span className="nv-field-label">
        {f.scrub ? (
          <Scrub value={props.value} spec={f.scrub} onChange={props.onChange} onCommit={(v) => props.onCommit?.(v)} className="nv-field-name">
            {f.label}
            {f.required && <span className="nv-req">*</span>}
          </Scrub>
        ) : (
          <span className="nv-field-name" title={f.label}>
            {f.label}
            {f.required && <span className="nv-req">*</span>}
          </span>
        )}
        {f.kind === "code" && props.canOpenFiles && env.openCode && (
          <button
            type="button"
            className="nv-link"
            title="Open as a real file — saving it writes back to the instance"
            onClick={(e) => {
              e.preventDefault();
              env.openCode!(f.key, f.label, f.language ?? "javascript");
            }}
          >
            Open in editor ↗
          </button>
        )}
      </span>
      {control}
      {f.date && describeDate(props.value, f.date) && <span className="nv-date-hint">{describeDate(props.value, f.date)}</span>}
      {props.error ? (
        <span className="nv-field-err">
          {f.label} {props.error}
        </span>
      ) : (
        <>
          {f.help && <span className="nv-field-help">{f.help}</span>}
          {f.caption && <span className={`nv-field-caption ${f.stale ? "is-warn" : ""}`}>{f.caption}</span>}
        </>
      )}
    </Wrap>
  );
}

/** A field is a <label> (click the name to focus) unless it holds its own buttons. */
function Wrap(props: { className: string; children: React.ReactNode }) {
  return <div className={props.className}>{props.children}</div>;
}

/** Records of a resource, as radio buttons (one) or checkboxes (many) — the list view's lookup picker. */
function LookupPicker(props: { f: FieldSpec; value: string; onPick: (v: string) => void }) {
  const env = useContext(FormEnvContext);
  const lk = props.f.lookup!;
  const options = env.lookupOptions[lk.resource];
  useEffect(() => {
    if (options === undefined) env.needLookup(lk.resource, lk.valueField, lk.labelField);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lk.resource, options === undefined]);
  const picked = useMemo(() => {
    const v = props.value.trim();
    if (!v) return [];
    try {
      const p = JSON.parse(v);
      return Array.isArray(p) ? p.map(String) : [String(p)];
    } catch {
      return v
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
  }, [props.value]);
  if (options === undefined) return <div className="nv-lookup-note">Loading {lk.resource} options…</div>;
  if (options === null)
    return (
      <input
        type="text"
        defaultValue={props.value}
        placeholder={`${lk.resource} id`}
        onBlur={(e) => e.target.value !== props.value && props.onPick(e.target.value)}
      />
    );
  const set = (ids: string[]) => props.onPick(lk.multiple ? JSON.stringify(ids) : ids[0] ?? "");
  const missing = picked.filter((p) => !options.some((o) => o.value === p));
  return (
    <div className="nv-lookup">
      {options.length === 0 && <span className="nv-lookup-note">This instance has no {lk.resource} records.</span>}
      {options.map((o) => (
        <label key={o.value} className="nv-lookup-row" title={o.value}>
          <input
            type={lk.multiple ? "checkbox" : "radio"}
            checked={picked.includes(o.value)}
            onChange={(e) =>
              lk.multiple
                ? set(e.target.checked ? [...picked, o.value] : picked.filter((p) => p !== o.value))
                : set([o.value])
            }
          />
          <span>{o.label}</span>
        </label>
      ))}
      {missing.length > 0 && (
        <span className="nv-lookup-note is-warn">
          {missing.length} selected id{missing.length === 1 ? "" : "s"} no longer exist here: {missing.join(", ")}
        </span>
      )}
    </div>
  );
}

/** Key/value rows for an object parameter — the list view's property map editor. */
function KeyValueEditor(props: { value: string; onChange: (v: string) => void }) {
  const [k, setK] = useState("");
  const [v, setV] = useState("");
  const rows = useMemo<[string, string][]>(() => {
    if (!props.value.trim()) return [];
    try {
      const d = JSON.parse(props.value);
      return !d || typeof d !== "object" || Array.isArray(d)
        ? []
        : Object.entries(d).map(([a, b]) => [a, typeof b === "string" ? b : JSON.stringify(b)]);
    } catch {
      return [];
    }
  }, [props.value]);
  const raw = props.value.trim() !== "" && rows.length === 0;
  const write = (r: [string, string][]) =>
    props.onChange(r.length === 0 ? "" : JSON.stringify(Object.fromEntries(r), null, 2));
  const add = () => {
    const key = k.trim();
    if (!key) return;
    write([...rows.filter(([x]) => x !== key), [key, v]]);
    setK("");
    setV("");
  };
  if (raw) return <RawJson value={props.value} onChange={props.onChange} />;
  return (
    <div className="nv-kv-editor">
      {rows.map(([a, b]) => (
        <div key={a} className="nv-kv-item">
          <span className="nv-kv-k" title={a}>
            {a}
          </span>
          <KvValue key={b} value={b} onCommit={(nv) => nv !== b && write(rows.map(([x, y]) => [x, x === a ? nv : y]))} />
          <button type="button" className="nv-kv-x" title={`Remove ${a}`} onClick={() => write(rows.filter(([x]) => x !== a))}>
            ×
          </button>
        </div>
      ))}
      <div className="nv-kv-add">
        <HighlightInput
          placeholder="Resource Property"
          value={k}
          onChange={setK}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              e.stopPropagation();
              add();
            }
          }}
        />
        <HighlightInput
          placeholder="Property Value"
          value={v}
          onChange={setV}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              e.stopPropagation();
              add();
            }
          }}
        />
        <button type="button" className="nv-kv-plus" disabled={!k.trim()} onClick={add} title="Add">
          ＋
        </button>
      </div>
    </div>
  );
}

function KvValue(props: { value: string; onCommit: (v: string) => void }) {
  const [v, setV] = useState(props.value);
  return (
    <HighlightInput
      className="nv-kv-v"
      value={v}
      onChange={setV}
      onBlur={() => props.onCommit(v)}
      onKeyDown={(e) => {
        if (e.key === "Enter") (e.target as HTMLInputElement).blur();
        if (e.key === "Escape") {
          e.stopPropagation();
          setV(props.value);
        }
      }}
    />
  );
}

function RawJson(props: { value: string; onChange: (v: string) => void }) {
  const [v, setV] = useState(props.value);
  useEffect(() => setV(props.value), [props.value]);
  return (
    <HighlightInput multiline mono rows={4} lang="json" className="is-code" value={v} onChange={setV} onBlur={() => v !== props.value && props.onChange(v)} />
  );
}

export const DELAY_FIELD: FieldSpec = {
  key: "__delay",
  label: "Delay (ms)",
  kind: "number",
  placeholder: "0",
  help: "Delay before running",
  scrub: { step: 50, min: 0, px: 2 },
  ms: true,
};
export const hasDelay = (operator: string) => !["each", "if", "series", "parallel", "reference"].includes(operator);
export function parseDelay(v: string): number | null {
  const d = v.trim() === "" ? null : Number(v);
  return d !== null && Number.isFinite(d) && d > 0 ? d : null;
}

/** The Add dialog (a new step needs its settings before it exists). */
export function StepForm(props: {
  title: string;
  subtitle?: string;
  operator: string;
  catalog: Catalog;
  commands: CommandView[];
  initial: Record<string, string>;
  delay: number | null;
  errors: FormError[];
  busy: boolean;
  onSubmit: (values: Record<string, string>, delay: number | null) => void;
  onCancel: () => void;
}) {
  const [values, setValues] = useState<Record<string, string>>(props.initial);
  const [delay, setDelay] = useState(props.delay ? String(props.delay) : "");
  const first = useRef<HTMLDivElement>(null);
  useEffect(() => {
    first.current?.querySelector<HTMLElement>("input,textarea,select")?.focus();
  }, []);
  const fields = fieldsFor(props.operator, props.catalog, props.commands, values);
  const errFor = (k: string) => props.errors.find((e) => e.param === k)?.message;
  const generalErrors = props.errors.filter((e) => !fields.some((f) => f.key === e.param));

  return (
    <div className="nv-modal-back" onMouseDown={props.onCancel}>
      <form
        className="nv-modal"
        onMouseDown={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === "Escape") props.onCancel();
          e.stopPropagation();
        }}
        onSubmit={(e) => {
          e.preventDefault();
          props.onSubmit(values, parseDelay(delay));
        }}
      >
        <div className="nv-modal-head">
          <div className="nv-modal-title">{props.title}</div>
          {props.subtitle && <div className="nv-modal-sub">{props.subtitle}</div>}
        </div>
        <div className="nv-modal-body" ref={first}>
          {fields.length === 0 && <div className="nv-note">This step has no settings.</div>}
          {fields.map((f) => (
            <FieldControl
              key={f.key}
              f={f}
              value={values[f.key] ?? ""}
              error={errFor(f.key)}
              canOpenFiles={false}
              onChange={(v) => setValues((cur) => ({ ...cur, [f.key]: v }))}
            />
          ))}
          {hasDelay(props.operator) && (
            <FieldControl f={DELAY_FIELD} value={delay} canOpenFiles={false} onChange={setDelay} />
          )}
          {generalErrors.map((e, i) => (
            <div key={i} className="nv-field-err">
              {e.label ? `${e.label} ` : ""}
              {e.message}
            </div>
          ))}
        </div>
        <div className="nv-modal-foot">
          <button type="button" className="nv-btn" onClick={props.onCancel}>
            Cancel
          </button>
          <button type="submit" className="nv-btn is-primary" disabled={props.busy}>
            {props.busy ? "Adding…" : "Add"}
          </button>
        </div>
      </form>
    </div>
  );
}

export interface LoadedParams {
  values: Record<string, string>;
  delay: number | null;
  /** params holding an HTML/designed email object */
  htmlParams: string[];
  /** of those, the ones built in the instance's designer */
  designTree: string[];
}

/**
 * The side panel's property editor, Blender style: every change is applied
 * when you press Enter, leave the field, or pick from a list. Each apply is one
 * draft edit, so Ctrl+Z (outside a field) undoes it.
 */
export function PanelEditor(props: {
  operator: string;
  catalog: Catalog;
  commands: CommandView[];
  loaded: LoadedParams | null;
  errors: FormError[];
  busy: boolean;
  focusToken: number;
  onCommit: (values: Record<string, string>, delay: number | null) => void;
}) {
  const { loaded } = props;
  const [values, setValues] = useState<Record<string, string>>(loaded?.values ?? {});
  const [delay, setDelay] = useState(loaded?.delay ? String(loaded.delay) : "");
  const dirty = useRef<Set<string>>(new Set());
  const box = useRef<HTMLDivElement>(null);
  const valuesRef = useRef(values);
  valuesRef.current = values;
  const delayRef = useRef(delay);
  delayRef.current = delay;

  // Fresh values from the host; keep whatever the user is still typing.
  useEffect(() => {
    if (!loaded) return;
    setValues((cur) => {
      const next = { ...loaded.values };
      for (const k of dirty.current) if (k !== "__delay" && k in cur) next[k] = cur[k];
      valuesRef.current = next;
      return next;
    });
    if (!dirty.current.has("__delay")) {
      delayRef.current = loaded.delay ? String(loaded.delay) : "";
      setDelay(delayRef.current);
    }
  }, [loaded]);

  useEffect(() => {
    if (props.focusToken > 0) box.current?.querySelector<HTMLElement>("input,textarea,select")?.focus();
  }, [props.focusToken, loaded !== null]);

  if (!loaded) return <div className="nv-panel-loading">Loading settings…</div>;

  const fields = fieldsFor(props.operator, props.catalog, props.commands, values);
  const errFor = (k: string) => props.errors.find((e) => e.param === k)?.message;
  const generalErrors = props.errors.filter((e) => !fields.some((f) => f.key === e.param));

  const commit = (override?: Record<string, string>) => {
    const vals = { ...valuesRef.current, ...(override ?? {}) };
    valuesRef.current = vals;
    const d = parseDelay(delayRef.current);
    const changed =
      Object.keys({ ...vals, ...loaded.values }).some(
        (k) => !loaded.htmlParams.includes(k) && (vals[k] ?? "") !== (loaded.values[k] ?? ""),
      ) || d !== (loaded.delay ?? null);
    dirty.current.clear();
    if (!changed) return;
    const send = { ...vals };
    for (const k of loaded.htmlParams) delete send[k];
    props.onCommit(send, d);
  };

  return (
    <div className="nv-panel-form" ref={box}>
      {fields.length === 0 && <p className="nv-muted">This step has no settings.</p>}
      {fields.map((f) => (
        <FieldControl
          key={f.key}
          f={f}
          value={values[f.key] ?? ""}
          error={errFor(f.key)}
          email={loaded.htmlParams.includes(f.key) ? { designTree: loaded.designTree.includes(f.key) } : null}
          canOpenFiles
          onChange={(v) => {
            dirty.current.add(f.key);
            valuesRef.current = { ...valuesRef.current, [f.key]: v };
            setValues(valuesRef.current);
          }}
          onCommit={(v) => commit(v === undefined ? undefined : { [f.key]: v })}
          onRevert={() => {
            dirty.current.delete(f.key);
            // update the ref now: the blur that follows Esc must see the reverted value
            valuesRef.current = { ...valuesRef.current, [f.key]: loaded.values[f.key] ?? "" };
            setValues(valuesRef.current);
          }}
        />
      ))}
      {hasDelay(props.operator) && (
        <FieldControl
          f={DELAY_FIELD}
          value={delay}
          canOpenFiles={false}
          onChange={(v) => {
            dirty.current.add("__delay");
            delayRef.current = v;
            setDelay(v);
          }}
          onCommit={() => commit()}
          onRevert={() => {
            dirty.current.delete("__delay");
            delayRef.current = loaded.delay ? String(loaded.delay) : "";
            setDelay(delayRef.current);
          }}
        />
      )}
      {generalErrors.map((e, i) => (
        <div key={i} className="nv-field-err">
          {e.label ? `${e.label} ` : ""}
          {e.message}
        </div>
      ))}
      <div className="nv-panel-hint">
        {props.busy ? "Applying…" : "Changes apply when you press Enter or leave a field · Esc reverts a field"}
      </div>
    </div>
  );
}
