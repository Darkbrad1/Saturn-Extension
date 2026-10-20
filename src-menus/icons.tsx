// Font Awesome icons (the solid set Saturn's menus use): drawing one by name, and the picker, a popup
// over the page with a search and a grid; hovering an icon shows its name.
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import * as solid from "@fortawesome/free-solid-svg-icons";

interface Definition { iconName: string; icon: [number, number, unknown[], string, string | string[]] }
/** Every icon by its name and by each of its other names. */
const BY_NAME = new Map<string, Definition>();
for (const d of Object.values(solid) as unknown[]) {
  const def = d as Definition;
  if (!def || typeof def !== "object" || typeof def.iconName !== "string" || !Array.isArray(def.icon)) continue;
  BY_NAME.set(def.iconName, def);
  for (const alias of def.icon[2] ?? []) if (typeof alias === "string" && !BY_NAME.has(alias)) BY_NAME.set(alias, def);
}
/** Every icon's own name, sorted (leaving out the digits). */
const NAMES = [...new Set([...BY_NAME.values()].map((d) => d.iconName))].filter((n) => !/^\d/.test(n)).sort();
const clean = (name: string) => name.trim().replace(/^fa-/, "");
export const isIcon = (name: string) => BY_NAME.has(clean(name));

/** An icon by name; "?" when the name isn't one. Hovering shows the name. */
export function FaIcon(props: { name: string; className?: string; title?: string | false }) {
  const def = BY_NAME.get(clean(props.name));
  const title = props.title === false ? undefined : props.title ?? (props.name ? (def ? clean(props.name) : `Not an icon: ${props.name}`) : "No icon");
  if (!def) return <span className={`mn-icon is-unknown ${props.className ?? ""}`} title={title}>?</span>;
  const [w, h, , , d] = def.icon;
  return (
    <svg className={`mn-icon ${props.className ?? ""}`} viewBox={`0 0 ${w} ${h}`} fill="currentColor" role="img" aria-label={clean(props.name)}>
      {title && <title>{title}</title>}
      {(Array.isArray(d) ? d : [d]).map((p, i) => <path key={i} d={p} />)}
    </svg>
  );
}

/** How many icons the grid shows at once (the search narrows them). */
const SHOWN = 240;

/** The button that shows the chosen icon and its name, and opens the picker. */
export function IconField(props: { value: string; onChange: (name: string) => void; allowEmpty?: boolean; label: string; disabled?: boolean; mixed?: boolean }) {
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const valid = !props.value || isIcon(props.value);
  return (
    <>
      <button
        ref={button}
        type="button"
        className={`mn-icon-field${valid ? "" : " is-bad"}`}
        aria-label={`${props.label}: ${props.mixed ? "mixed" : props.value || "none"}. Pick an icon`}
        aria-haspopup="dialog"
        disabled={props.disabled}
        onClick={() => setOpen(!open)}
      >
        <span className="mn-icon-box">{props.mixed ? "–" : props.value ? <FaIcon name={props.value} /> : <span className="mn-none">none</span>}</span>
        <span className="mn-icon-name">{props.mixed ? "Mixed" : props.value || (props.allowEmpty ? "No icon" : "Pick an icon")}</span>
        <span className="mn-caret" aria-hidden="true">▾</span>
      </button>
      {open && button.current && (
        <IconPicker anchor={button.current} value={props.value} allowEmpty={props.allowEmpty} onPick={(n) => { props.onChange(n); setOpen(false); }} onClose={() => setOpen(false)} />
      )}
    </>
  );
}

/** The picker: a popup under its button (above it if there's no room), closed by Esc or a click outside. */
function IconPicker(props: { anchor: HTMLElement; value: string; allowEmpty?: boolean; onPick: (name: string) => void; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [hover, setHover] = useState<string | null>(null);
  const box = useRef<HTMLDivElement>(null);
  const [place, setPlace] = useState<{ left: number; top: number }>({ left: 0, top: 0 });
  const matches = useMemo(() => {
    const q = query.trim().toLowerCase().replace(/^fa-/, "");
    return q ? NAMES.filter((n) => n.includes(q)) : NAMES;
  }, [query]);
  useLayoutEffect(() => {
    const a = props.anchor.getBoundingClientRect();
    const w = 360, h = box.current?.offsetHeight ?? 380;
    const left = Math.max(8, Math.min(a.left, window.innerWidth - w - 8));
    const below = a.bottom + 4;
    setPlace({ left, top: below + h > window.innerHeight - 8 ? Math.max(8, a.top - h - 4) : below });
  }, [props.anchor]);
  useEffect(() => {
    const away = (e: MouseEvent) => { if (box.current && !box.current.contains(e.target as Node) && !props.anchor.contains(e.target as Node)) props.onClose(); };
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") { e.stopPropagation(); props.onClose(); props.anchor.focus(); } };
    document.addEventListener("mousedown", away);
    document.addEventListener("keydown", esc, true);
    return () => { document.removeEventListener("mousedown", away); document.removeEventListener("keydown", esc, true); };
  }, [props]);
  const shown = matches.slice(0, SHOWN);
  return (
    <div ref={box} className="mn-picker" role="dialog" aria-label="Pick an icon" style={{ left: place.left, top: place.top }}>
      <input
        className="rs-search"
        autoFocus
        placeholder={`Search ${NAMES.length.toLocaleString()} icons`}
        aria-label="Search icons"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter" && shown[0]) props.onPick(shown[0]); }}
      />
      <div className="mn-picker-grid">
        {props.allowEmpty && (
          <button type="button" className={`mn-pick${!props.value ? " is-on" : ""}`} title="No icon" onMouseEnter={() => setHover("No icon")} onClick={() => props.onPick("")}>
            <span className="mn-none">none</span>
          </button>
        )}
        {shown.map((n) => (
          <button key={n} type="button" className={`mn-pick${clean(props.value) === n ? " is-on" : ""}`} title={n} aria-label={n} onMouseEnter={() => setHover(n)} onFocus={() => setHover(n)} onClick={() => props.onPick(n)}>
            <FaIcon name={n} title={false} />
          </button>
        ))}
      </div>
      <div className="mn-picker-foot">
        <span className="mn-picker-name">{hover ?? (props.value ? clean(props.value) : "Hover an icon to see its name")}</span>
        <span>{matches.length > SHOWN ? `First ${SHOWN} of ${matches.length.toLocaleString()}` : `${matches.length} icon${matches.length === 1 ? "" : "s"}`}</span>
      </div>
    </div>
  );
}
