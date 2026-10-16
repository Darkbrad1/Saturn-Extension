import { useEffect, useRef, useState, type ReactNode } from "react";
import { HighlightInput, Scrub, type HlLang, type ScrubSpec } from "./controls";
import type { FieldChange } from "./settings";

// ---------------------------------------------------------------------------
// Every other setting a form field (or command parameter) carries in Saturn —
// visibility, validation, layout, defaults, input, lookup/map, rendering — each
// applied on its own as one draft edit, plus the whole field as JSON for
// anything not listed.

type P = (string | number)[];
const get = (o: unknown, p: P): unknown => p.reduce<unknown>((a, k) => (a && typeof a === "object" ? (a as Record<string, unknown>)[k] : undefined), o);
const str = (v: unknown) => (v === undefined || v === null ? "" : typeof v === "string" ? v : JSON.stringify(v));

// sub-sections stay open/closed while you work, across re-renders
const openSubs = new Set<string>(["Visibility"]);

function Sub(props: { title: string; children: ReactNode; count?: number }) {
  const [open, setOpen] = useState(openSubs.has(props.title));
  return (
    <div className={`fg-sub ${open ? "is-open" : ""}`}>
      <button
        type="button"
        className="fg-sub-head"
        aria-expanded={open}
        onClick={() => {
          if (open) openSubs.delete(props.title);
          else openSubs.add(props.title);
          setOpen(!open);
        }}
      >
        <span className="fg-sub-caret">{open ? "▾" : "▸"}</span>
        {props.title}
        {props.count ? <span className="fg-count">{props.count} on</span> : null}
      </button>
      {open && <div className="fg-sub-body">{props.children}</div>}
    </div>
  );
}

export function FieldMore(props: { raw: Record<string, unknown>; onChange: (changes: FieldChange[]) => void }) {
  const { raw } = props;
  const set = (path: P, value: unknown) => props.onChange([{ path, value }]);

  const Toggle = (p: { path: P; label: string; hint?: string }) => (
    <label className="fg-check fg-toggle-row" title={p.hint}>
      <input type="checkbox" checked={get(raw, p.path) === true} onChange={(e) => set(p.path, e.target.checked)} />
      <span>{p.label}</span>
    </label>
  );
  const on = (paths: string[]) => paths.filter((k) => raw[k] === true).length;

  return (
    <div className="fg-field-more" onKeyDown={(e) => e.stopPropagation()}>
      <div className="fg-subhead">Field settings</div>
      <Sub title="Validation" count={on(["unique", "searchable", "email", "ipaddress"])}>
        <Toggle path={["unique"]} label="Unique" hint="No two records may hold the same value" />
        <Toggle path={["searchable"]} label="Searchable" hint="Included when records are searched" />
        <Toggle path={["email"]} label="Must be an email address" />
        <Toggle path={["ipaddress"]} label="Must be an IP address" />
      </Sub>
      <Sub title="Visibility" count={on(["hide", "hideInTable", "hideInForm", "hideInView", "hideInDrawer", "placeInOwnTab"])}>
        <Toggle path={["hide"]} label="Hide everywhere" />
        <div className="fg-toggle-grid">
          <Toggle path={["hideInTable"]} label="Hide in table" />
          <Toggle path={["hideInForm"]} label="Hide in form" />
          <Toggle path={["hideInView"]} label="Hide in view" />
          <Toggle path={["hideInDrawer"]} label="Hide in drawer" />
        </div>
        <Toggle path={["placeInOwnTab"]} label="Place in its own tab" />
      </Sub>
      <Sub title="Layout">
        <NumRow label="Table column width" raw={raw} path={["tableColumnWidth"]} spec={{ step: 10, min: 0, px: 2 }} unit="px · 0 = auto" set={set} />
        <NumRow label="View columns" raw={raw} path={["number_of_columns", "default"]} spec={{ step: 1, min: 1, max: 12, px: 10 }} set={set} />
        <Toggle path={["number_of_columns", "full_width"]} label="Full width in the view" />
        <NumRow label="Form columns" raw={raw} path={["form_number_of_columns", "default"]} spec={{ step: 1, min: 1, max: 12, px: 10 }} set={set} />
        <Toggle path={["form_number_of_columns", "full_width"]} label="Full width in the form" />
        <NumRow label="View span" raw={raw} path={["rendering", "_variances", "view", "span"]} spec={{ step: 1, min: 1, max: 12, px: 10 }} set={set} />
      </Sub>
      <Sub title="Defaults">
        <TextRow label="Read default" raw={raw} path={["defaults", "read"]} set={set} keepType />
        <TextRow label="Write default" raw={raw} path={["defaults", "write"]} set={set} keepType />
        {(raw.default_type_read !== undefined || raw.default_type_write !== undefined) && (
          <>
            <SelectRow label="Read default is" raw={raw} path={["default_type_read"]} options={["property_value", "function", "static"]} set={set} />
            <SelectRow label="Write default is" raw={raw} path={["default_type_write"]} options={["property_value", "function", "static"]} set={set} />
          </>
        )}
      </Sub>
      <Sub title="Input">
        <SelectRow
          label="Input type"
          raw={raw}
          path={["input_properties", "type"]}
          options={["input", "textarea", "switch", "checkbox", "select", "radio", "number", "date", "datetime", "time", "color", "password", "code", "rich_text", "upload"]}
          set={set}
        />
        <CodeRow label="Template" raw={raw} path={["input_properties", "options", "code"]} lang="html" set={set} />
      </Sub>
      <Sub title="Lookup & map">
        <SelectRow label="Source" raw={raw} path={["source"]} options={["static", "lookup", "function", "api"]} set={set} />
        <SelectRow label="Lookup type" raw={raw} path={["lookup_type"]} options={["", "map", "values", "resources", "function"]} set={set} />
        <SelectRow label="Map type" raw={raw} path={["map", "type"]} options={["model", "resource", "static"]} set={set} />
        <TextRow label="Map reference" raw={raw} path={["map", "reference"]} set={set} mono placeholder="User" />
        <TextRow label="Map value field" raw={raw} path={["map", "value_field"]} set={set} mono placeholder="id" />
        <TextRow label="Map label field" raw={raw} path={["map", "label_field"]} set={set} mono placeholder="label" />
        <SelectRow label="Map label type" raw={raw} path={["map_label_type"]} options={["property", "function"]} set={set} />
        <TextRow label="Lookup value field" raw={raw} path={["lookup_value_field"]} set={set} mono placeholder="id" />
        <SelectRow label="Lookup label type" raw={raw} path={["lookup_label_type"]} options={["property", "function"]} set={set} />
        {get(raw, ["lookup_label_type"]) === "function" ? (
          <CodeRow label="Lookup label" raw={raw} path={["lookup_label"]} lang="javascript" set={set} />
        ) : (
          <TextRow label="Lookup label" raw={raw} path={["lookup_label"]} set={set} mono placeholder="name" />
        )}
      </Sub>
      <Sub title="Rendering">
        <TextRow label="Component" raw={raw} path={["rendering", "component"]} set={set} mono placeholder="default" />
        <SelectRow label="Size" raw={raw} path={["rendering", "options", "size"]} options={["small", "medium", "large"]} set={set} />
        <SelectRow label="Shape" raw={raw} path={["rendering", "options", "shape"]} options={["circle", "square", "rounded"]} set={set} />
        <NumRow label="Opacity" raw={raw} path={["rendering", "options", "opacity"]} spec={{ step: 0.05, min: 0, max: 1, px: 3 }} set={set} />
        <p className="fg-hint">List and view variances (and anything else) are in the JSON below.</p>
      </Sub>
      <Sub title="Tags & views">
        <TagsRow label="Meta tags" raw={raw} path={["meta_tags"]} set={set} />
        <TagsRow label="Required columns" raw={raw} path={["required_columns"]} set={set} />
        <SelectRow
          label="Default view"
          raw={raw}
          path={["default_view"]}
          options={(Array.isArray(raw.views) ? raw.views : []).map((v) => str((v as Record<string, unknown>)?.id)).filter(Boolean)}
          labels={Object.fromEntries((Array.isArray(raw.views) ? raw.views : []).map((v) => [str((v as Record<string, unknown>)?.id), `${str((v as Record<string, unknown>)?.view)} · ${str((v as Record<string, unknown>)?.id)}`]))}
          set={set}
        />
      </Sub>
      <Sub title="All settings (JSON)">
        <JsonEditor raw={raw} onChange={props.onChange} />
      </Sub>
    </div>
  );
}

type SetFn = (path: P, value: unknown) => void;

function NumRow(props: { label: string; raw: Record<string, unknown>; path: P; spec: ScrubSpec; unit?: string; set: SetFn }) {
  const cur = str(get(props.raw, props.path));
  const [v, setV] = useState(cur);
  const vRef = useRef(v);
  vRef.current = v;
  useEffect(() => setV(cur), [cur]);
  const commit = (x: string) => {
    if (x.trim() === cur) return;
    const n = Number(x);
    if (x.trim() === "" || !Number.isFinite(n)) return setV(cur);
    props.set(props.path, n);
  };
  return (
    <div className="fg-row">
      <Scrub className="fg-label" value={v} spec={props.spec} onChange={setV} onCommit={commit}>
        {props.label}
      </Scrub>
      <HighlightInput
        className="fg-input is-mono"
        mono
        value={v}
        suffix={props.unit}
        placeholder="0"
        onChange={setV}
        onBlur={() => commit(vRef.current)}
        onKeyDown={(e) => {
          if (e.key === "Enter") (e.target as HTMLInputElement).blur();
          if (e.key === "Escape") {
            setV(cur);
            vRef.current = cur;
          }
          if (e.key === "ArrowUp" || e.key === "ArrowDown") {
            e.preventDefault();
            let n = (Number(vRef.current) || 0) + (e.key === "ArrowUp" ? 1 : -1) * props.spec.step * (e.shiftKey ? 10 : 1);
            if (props.spec.min !== undefined) n = Math.max(props.spec.min, n);
            if (props.spec.max !== undefined) n = Math.min(props.spec.max, n);
            setV(String(+n.toFixed(4)));
          }
        }}
      />
    </div>
  );
}

function TextRow(props: {
  label: string;
  raw: Record<string, unknown>;
  path: P;
  set: SetFn;
  mono?: boolean;
  placeholder?: string;
  /** keep a number/boolean default as that type when it still parses */
  keepType?: boolean;
}) {
  const orig = get(props.raw, props.path);
  const cur = str(orig);
  const [v, setV] = useState(cur);
  const vRef = useRef(v);
  vRef.current = v;
  useEffect(() => setV(cur), [cur]);
  const commit = () => {
    const x = vRef.current;
    if (x === cur) return;
    let out: unknown = x;
    if (props.keepType && typeof orig === "number" && x.trim() !== "" && Number.isFinite(Number(x))) out = Number(x);
    if (props.keepType && typeof orig === "boolean" && (x === "true" || x === "false")) out = x === "true";
    props.set(props.path, out);
  };
  return (
    <div className="fg-row">
      <span className="fg-label">{props.label}</span>
      <HighlightInput
        className={`fg-input ${props.mono ? "is-mono" : ""}`}
        mono={props.mono}
        value={v}
        placeholder={props.placeholder}
        onChange={setV}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") (e.target as HTMLInputElement).blur();
          if (e.key === "Escape") {
            setV(cur);
            vRef.current = cur;
          }
        }}
      />
    </div>
  );
}

function SelectRow(props: { label: string; raw: Record<string, unknown>; path: P; options: string[]; labels?: Record<string, string>; set: SetFn }) {
  const cur = str(get(props.raw, props.path));
  const opts = props.options.includes(cur) ? props.options : [cur, ...props.options];
  return (
    <div className="fg-row">
      <span className="fg-label">{props.label}</span>
      <select className="fg-input" value={cur} onChange={(e) => props.set(props.path, e.target.value)}>
        {opts.map((o) => (
          <option key={o} value={o}>
            {props.labels?.[o] ?? (o || "— none —")}
          </option>
        ))}
      </select>
    </div>
  );
}

function CodeRow(props: { label: string; raw: Record<string, unknown>; path: P; lang: HlLang; set: SetFn }) {
  const cur = str(get(props.raw, props.path));
  const [v, setV] = useState(cur);
  const vRef = useRef(v);
  vRef.current = v;
  useEffect(() => setV(cur), [cur]);
  return (
    <div className="fg-row is-wide">
      <span className="fg-label">{props.label}</span>
      <HighlightInput
        multiline
        mono
        rows={4}
        lang={props.lang}
        className="fg-code"
        value={v}
        onChange={setV}
        onBlur={() => vRef.current !== cur && props.set(props.path, vRef.current)}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            setV(cur);
            vRef.current = cur;
            (e.target as HTMLElement).blur();
          }
        }}
      />
    </div>
  );
}

function TagsRow(props: { label: string; raw: Record<string, unknown>; path: P; set: SetFn }) {
  const val = get(props.raw, props.path);
  const tags = Array.isArray(val) ? val.map(str) : [];
  const [add, setAdd] = useState("");
  const push = () => {
    const t = add.trim();
    if (!t || tags.includes(t)) return setAdd("");
    props.set(props.path, [...tags, t]);
    setAdd("");
  };
  return (
    <div className="fg-row is-wide">
      <span className="fg-label">{props.label}</span>
      <div className="fg-tags">
        {tags.map((t, i) => (
          <span key={t + i} className="fg-tag">
            {t}
            <button type="button" title={`Remove ${t}`} onClick={() => props.set(props.path, tags.filter((_, j) => j !== i))}>
              ×
            </button>
          </span>
        ))}
        <HighlightInput
          className="fg-input fg-tag-input"
          value={add}
          placeholder="Add… (Enter)"
          onChange={setAdd}
          onBlur={push}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              push();
            }
          }}
        />
      </div>
    </div>
  );
}

const FIXED = ["key", "label", "type"];
function JsonEditor(props: { raw: Record<string, unknown>; onChange: (c: FieldChange[]) => void }) {
  const text = JSON.stringify(props.raw, null, 2);
  const [v, setV] = useState(text);
  const [err, setErr] = useState<string | null>(null);
  useEffect(() => {
    setV(text);
    setErr(null);
  }, [text]);
  const apply = () => {
    if (v === text) return;
    let next: unknown;
    try {
      next = JSON.parse(v);
    } catch (e) {
      return setErr(`Not valid JSON: ${(e as Error).message}`);
    }
    if (!next || typeof next !== "object" || Array.isArray(next)) return setErr("A field must be a JSON object.");
    const n = next as Record<string, unknown>;
    for (const k of FIXED)
      if (JSON.stringify(n[k]) !== JSON.stringify(props.raw[k]))
        return setErr(`Change the field's ${k} with Label, Key and Type above — they are checked for clashes.`);
    const changes: FieldChange[] = [];
    for (const k of Object.keys(n)) if (!FIXED.includes(k) && JSON.stringify(n[k]) !== JSON.stringify(props.raw[k])) changes.push({ path: [k], value: n[k] });
    for (const k of Object.keys(props.raw)) if (!(k in n)) changes.push({ path: [k], remove: true });
    setErr(null);
    if (changes.length) props.onChange(changes);
  };
  return (
    <>
      <HighlightInput multiline mono rows={12} lang="json" className="fg-code" value={v} onChange={setV} />
      {err && <div className="fg-error">{err}</div>}
      <div className="fg-btn-row">
        <button type="button" className="fg-btn" disabled={v === text} onClick={() => { setV(text); setErr(null); }}>
          Revert
        </button>
        <button type="button" className="fg-btn is-primary" disabled={v === text} onClick={apply}>
          Apply JSON
        </button>
      </div>
    </>
  );
}
