// The Resources screen's resource picker and its first page (0.3.70). The picker works like the node view's workflow
// picker: a button naming the resource, and under it a list with a search, the instance's own resources first and then
// Saturn's core ones. Before a resource is picked, the page shows the same resources as cards.
import { useEffect, useRef, useState } from "react";

interface Props {
  resources: string[] | null;
  core: string[] | null;
  /** resources with unsaved changes (a dot beside them) */
  unsaved: (resource: string) => boolean;
  onPick: (resource: string) => void;
}

/** The two groups (just one when the instance doesn't say which are core), each narrowed by the search. */
function groupsOf(resources: string[], core: string[] | null, q: string) {
  const match = (r: string) => !q.trim() || r.toLowerCase().includes(q.trim().toLowerCase());
  const shown = resources.filter(match);
  return core
    ? [
        { label: "Resources", items: shown.filter((r) => !core.includes(r)) },
        { label: "Core resources", items: shown.filter((r) => core.includes(r)) },
      ].filter((g) => g.items.length)
    : [{ label: "Resources", items: shown }].filter((g) => g.items.length);
}

export function ResourcePicker(props: Props & { value: string | null; disabled?: boolean }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const wrap = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const away = (e: MouseEvent) => !wrap.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", away);
    return () => document.removeEventListener("mousedown", away);
  }, [open]);
  useEffect(() => {
    list.current?.querySelector(".is-active")?.scrollIntoView({ block: "nearest" });
  }, [active, open]);
  const groups = groupsOf(props.resources ?? [], props.core, q);
  const flat = groups.flatMap((g) => g.items);
  const pick = (r: string) => {
    setOpen(false);
    setQ("");
    if (r !== props.value) props.onPick(r);
  };
  return (
    <div className="rs-picker" ref={wrap}>
      <button
        type="button"
        className="rs-picker-btn"
        data-value={props.value ?? ""}
        disabled={props.disabled || !props.resources}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => {
          setOpen(!open);
          setActive(Math.max(0, flat.indexOf(props.value ?? "")));
        }}
      >
        <span className={props.value ? "rs-picker-value" : "rs-picker-value is-empty"}>{props.value ?? (props.resources ? "Pick a resource" : "Loading…")}</span>
        <span className="rs-picker-caret">▾</span>
      </button>
      {open && (
        <div className="rs-picker-pop" role="listbox">
          <input
            autoFocus
            className="rs-picker-search"
            placeholder={`Search ${props.resources?.length ?? 0} resources...`}
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setActive(0);
            }}
            onKeyDown={(e) => {
              e.stopPropagation();
              if (e.key === "ArrowDown") (e.preventDefault(), setActive((a) => Math.min(flat.length - 1, a + 1)));
              else if (e.key === "ArrowUp") (e.preventDefault(), setActive((a) => Math.max(0, a - 1)));
              else if (e.key === "Enter" && flat[active]) (e.preventDefault(), pick(flat[active]));
              else if (e.key === "Escape") (e.preventDefault(), setOpen(false));
            }}
          />
          <div className="rs-picker-list" ref={list}>
            {groups.map((g) => (
              <div key={g.label} className="rs-picker-group" data-label={g.label}>
                {groups.length > 1 || props.core ? <div className="rs-picker-heading">{g.label}</div> : null}
                {g.items.map((r) => (
                  <button
                    key={r}
                    type="button"
                    role="option"
                    aria-selected={r === props.value}
                    data-resource={r}
                    className={`rs-picker-item${r === props.value ? " is-current" : ""}${flat[active] === r ? " is-active" : ""}`}
                    onMouseEnter={() => setActive(flat.indexOf(r))}
                    onClick={() => pick(r)}
                  >
                    <span className="rs-picker-name">{r}</span>
                    {props.unsaved(r) && <span className="rs-picker-dot" title="Unsaved changes" />}
                  </button>
                ))}
              </div>
            ))}
            {!flat.length && <div className="rs-picker-none">No resources match.</div>}
          </div>
        </div>
      )}
    </div>
  );
}

/** The page before a resource is picked: a card per resource, in the picker's two groups, with a search. */
export function ResourceCards(props: Props & { instanceName: string }) {
  const [q, setQ] = useState("");
  if (!props.resources) return <p className="rs-empty">Loading the resources…</p>;
  const groups = groupsOf(props.resources, props.core, q);
  const first = groups[0]?.items[0];
  return (
    <div className="rs-cards-page">
      <div className="rs-cards-head">
        <h1>Resources</h1>
        <span className="rs-cards-count">{props.resources.length}</span>
        <input
          autoFocus
          className="rs-picker-search"
          placeholder="Search resources..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            e.stopPropagation();
            if (e.key === "Enter" && first) props.onPick(first);
          }}
        />
      </div>
      {groups.map((g) => (
        <section key={g.label} className="rs-cards-group" data-label={g.label}>
          <h2>
            {g.label} <span className="rs-cards-count">{g.items.length}</span>
          </h2>
          <div className="rs-cards">
            {g.items.map((r) => (
              <button key={r} type="button" className="rs-card" data-resource={r} onClick={() => props.onPick(r)}>
                <span className="rs-card-mark">{r.replace(/[^A-Za-z0-9]/g, "").slice(0, 2).toUpperCase() || "?"}</span>
                <span className="rs-card-name">{r}</span>
                {props.unsaved(r) && <span className="rs-picker-dot" title="Unsaved changes" />}
              </button>
            ))}
          </div>
        </section>
      ))}
      {!groups.length && <p className="rs-empty">{props.resources.length ? "No resources match." : "This instance has no resources."}</p>}
    </div>
  );
}
