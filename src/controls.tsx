import "./prism-setup";
import Prism from "prismjs";
import "prismjs/components/prism-json";
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

// ---------------------------------------------------------------------------
// Syntax highlighting for inputs: a highlighted <pre> under a transparent
// input/textarea, so typing, selection, undo and IME all stay native.

const TEMPLATE = {
  pattern: /\{\{[\s\S]*?\}\}/,
  greedy: true,
  inside: {
    "template-punctuation": /^\{\{|\}\}$/,
    "template-expression": { pattern: /[\s\S]+/, inside: Prism.languages.javascript },
  },
};
Prism.languages.tpl = { template: TEMPLATE };
Prism.languages.json_t = Prism.languages.extend("json", {});
Prism.languages.insertBefore("json_t", "property", { template: TEMPLATE });
Prism.languages.markup_t = Prism.languages.extend("markup", {});
Prism.languages.insertBefore("markup_t", "comment", { template: TEMPLATE });
Prism.languages.cron = {
  template: TEMPLATE,
  "cron-special": /[*?/,\-#LW]/,
  number: /\d+/,
  "cron-name": /\b(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC|SUN|MON|TUE|WED|THU|FRI|SAT)\b/i,
};

export type HlLang = "tpl" | "json" | "javascript" | "html" | "css" | "cron" | "plain";

/** Which grammar a code parameter's language maps to. */
export function langFor(codeLanguage: string | null | undefined): HlLang {
  const l = (codeLanguage ?? "javascript").toLowerCase();
  if (l === "html" || l === "vue" || l === "xml" || l === "markup") return "html";
  if (l === "json") return "json";
  if (l === "css" || l === "scss") return "css";
  return "javascript";
}

const GRAMMAR: Record<HlLang, string | null> = {
  tpl: "tpl",
  json: "json_t",
  javascript: "javascript",
  html: "markup_t",
  css: "css",
  cron: "cron",
  plain: null,
};

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function highlight(text: string, lang: HlLang): string {
  const g = GRAMMAR[lang];
  if (!g || !Prism.languages[g]) return esc(text);
  try {
    return Prism.highlight(text, Prism.languages[g], g);
  } catch {
    return esc(text);
  }
}

export interface HlProps {
  value: string;
  onChange: (v: string) => void;
  lang?: HlLang;
  multiline?: boolean;
  rows?: number;
  mono?: boolean;
  placeholder?: string;
  className?: string;
  onBlur?: () => void;
  onFocus?: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  inputRef?: React.Ref<HTMLInputElement | HTMLTextAreaElement>;
  spellCheck?: boolean;
  title?: string;
  /** shown inside the box on the right, e.g. "ms" */
  suffix?: ReactNode;
  disabled?: boolean;
  ariaLabel?: string;
}

const COPY = [
  "fontFamily", "fontSize", "fontWeight", "letterSpacing", "lineHeight", "textIndent", "tabSize",
  "paddingLeft", "paddingRight", "paddingTop", "paddingBottom",
  "borderLeftWidth", "borderRightWidth", "borderTopWidth", "borderBottomWidth",
] as const;

/**
 * An input or textarea whose text is syntax highlighted. The real control stays
 * underneath (its text made transparent), and a highlighted copy is laid over it
 * with the same metrics, so typing, selection, undo and IME stay native.
 */
export function HighlightInput(p: HlProps) {
  const lang = p.lang ?? "tpl";
  const html = highlight(p.value, lang) + (p.multiline ? "\n" : "");
  const pre = useRef<HTMLPreElement>(null);
  const ctl = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const setRef = (el: HTMLInputElement | HTMLTextAreaElement | null) => {
    ctl.current = el;
    const r = p.inputRef;
    if (typeof r === "function") r(el);
    else if (r) (r as React.MutableRefObject<typeof el>).current = el;
  };
  const sync = () => {
    const el = ctl.current, pr = pre.current;
    if (!el || !pr) return;
    const cs = getComputedStyle(el);
    for (const k of COPY) (pr.style as unknown as Record<string, string>)[k] = cs[k];
    pr.style.borderStyle = "solid";
    pr.style.borderColor = "transparent";
    if (!p.multiline) {
      // a single-line input centres its text vertically
      const inner = el.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
      pr.style.lineHeight = `${inner}px`;
    } else {
      // leave room for the textarea's scrollbar
      const sb = el.offsetWidth - el.clientWidth - parseFloat(cs.borderLeftWidth) - parseFloat(cs.borderRightWidth);
      pr.style.paddingRight = `${parseFloat(cs.paddingRight) + Math.max(0, sb)}px`;
    }
    pr.scrollTop = el.scrollTop;
    pr.scrollLeft = el.scrollLeft;
  };
  useLayoutEffect(sync);
  useEffect(() => {
    const el = ctl.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => sync());
    ro.observe(el);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const common = {
    className: `nv-hl-input ${p.className ?? ""}`,
    value: p.value,
    placeholder: p.placeholder,
    spellCheck: p.spellCheck ?? false,
    disabled: p.disabled,
    title: p.title,
    "aria-label": p.ariaLabel,
    onScroll: sync,
    onSelect: sync,
    onBlur: p.onBlur,
    onFocus: p.onFocus,
    style: p.suffix ? { paddingRight: 64 } : undefined,
  };
  return (
    <span className={`nv-hl ${p.multiline ? "is-multi" : "is-single"} ${p.mono ? "is-mono" : ""}`}>
      {p.multiline ? (
        <textarea
          {...common}
          ref={setRef as React.Ref<HTMLTextAreaElement>}
          rows={p.rows ?? 4}
          onChange={(e) => p.onChange(e.target.value)}
          onKeyDown={(e) => {
            // Tab indents in code instead of leaving the field
            if (e.key === "Tab" && p.mono && !e.shiftKey) {
              e.preventDefault();
              const t = e.target as HTMLTextAreaElement;
              const s = t.selectionStart;
              p.onChange(p.value.slice(0, s) + "  " + p.value.slice(t.selectionEnd));
              requestAnimationFrame(() => t.setSelectionRange(s + 2, s + 2));
              return;
            }
            p.onKeyDown?.(e);
          }}
        />
      ) : (
        <input
          {...common}
          ref={setRef as React.Ref<HTMLInputElement>}
          type="text"
          onChange={(e) => p.onChange(e.target.value)}
          onKeyDown={p.onKeyDown}
        />
      )}
      <pre className="nv-hl-pre" aria-hidden="true" ref={pre}>
        <code className={`language-${lang}`} dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
      {p.suffix && <span className="nv-hl-suffix">{p.suffix}</span>}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Figma-style scrubbing: hold the label and drag sideways to change a number.

export interface ScrubSpec {
  step: number;
  min?: number;
  max?: number;
  /** pixels of travel per step */
  px?: number;
}
const NUMERIC = /^\s*-?\d*\.?\d+\s*$/;

/** Is this value a plain number we can scrub (not a {{ template }})? */
export const canScrub = (v: string) => v.trim() === "" || NUMERIC.test(v);

export function Scrub(props: {
  value: string;
  spec: ScrubSpec;
  onChange: (v: string) => void;
  onCommit: (v: string) => void;
  children: ReactNode;
  className?: string;
}) {
  const st = useRef<{ x: number; start: number; acc: number; last: string; moved: boolean } | null>(null);
  const ok = canScrub(props.value);
  const fmt = (n: number) => {
    const d = props.spec.step < 1 ? String(props.spec.step).split(".")[1]?.length ?? 1 : 0;
    return n.toFixed(d).replace(/\.0+$/, "");
  };
  return (
    <span
      className={`nv-scrub ${ok ? "" : "is-off"} ${props.className ?? ""}`}
      title={ok ? "Drag sideways to change · Shift ×10 · Alt fine" : "A template can't be scrubbed"}
      onPointerDown={(e) => {
        if (!ok || e.button !== 0) return;
        e.preventDefault();
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        const start = props.value.trim() === "" ? props.spec.min ?? 0 : Number(props.value);
        st.current = { x: e.clientX, start, acc: 0, last: props.value, moved: false };
        document.body.classList.add("nv-scrubbing");
      }}
      onPointerMove={(e) => {
        const s = st.current;
        if (!s) return;
        const mult = e.shiftKey ? 10 : e.altKey ? 0.1 : 1;
        const px = props.spec.px ?? 4;
        s.acc += e.movementX || 0;
        if (!e.movementX) s.acc = e.clientX - s.x; // movementX can be 0 in synthetic events
        const steps = Math.trunc(s.acc / px);
        let v = s.start + steps * props.spec.step * mult;
        if (props.spec.min !== undefined) v = Math.max(props.spec.min, v);
        if (props.spec.max !== undefined) v = Math.min(props.spec.max, v);
        const out = fmt(v);
        if (out !== s.last) {
          s.last = out;
          s.moved = true;
          props.onChange(out);
        }
      }}
      onPointerUp={(e) => {
        const s = st.current;
        st.current = null;
        document.body.classList.remove("nv-scrubbing");
        (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
        if (s?.moved) props.onCommit(s.last);
      }}
    >
      {props.children}
    </span>
  );
}

/** "1500" ms → "1.5 s" etc. */
export function humanMs(v: string): string | null {
  if (!NUMERIC.test(v)) return null;
  const n = Number(v);
  if (!Number.isFinite(n) || n <= 0) return null;
  if (n < 1000) return null;
  if (n < 60_000) return `${+(n / 1000).toFixed(2)} s`;
  if (n < 3_600_000) return `${+(n / 60_000).toFixed(2)} min`;
  return `${+(n / 3_600_000).toFixed(2)} h`;
}

// ---------------------------------------------------------------------------
// Pop-overs (date, colour), anchored to a button, closed by clicking outside.

function Popover(props: { anchor: HTMLElement | null; onClose: () => void; children: ReactNode; width: number }) {
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);
  const box = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const r = props.anchor?.getBoundingClientRect();
    if (!r) return;
    const h = box.current?.offsetHeight ?? 320;
    const left = Math.max(8, Math.min(r.left, window.innerWidth - props.width - 8));
    const below = r.bottom + 6;
    const top = below + h > window.innerHeight - 8 ? Math.max(8, r.top - h - 6) : below;
    setPos({ left, top });
  }, [props.anchor, props.width]);
  useEffect(() => {
    const down = (e: MouseEvent) => {
      if (box.current?.contains(e.target as Node) || props.anchor?.contains(e.target as Node)) return;
      props.onClose();
    };
    const key = (e: KeyboardEvent) => e.key === "Escape" && (e.stopPropagation(), props.onClose());
    window.addEventListener("mousedown", down, true);
    window.addEventListener("keydown", key, true);
    return () => {
      window.removeEventListener("mousedown", down, true);
      window.removeEventListener("keydown", key, true);
    };
  }, [props]);
  const host = document.getElementById("sonover-node-view") ?? document.body;
  return createPortal(
    <div
      ref={box}
      className="nv-pop"
      style={{ width: props.width, left: pos?.left ?? -9999, top: pos?.top ?? -9999 }}
      onMouseDown={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
    >
      {props.children}
    </div>,
    host,
  );
}

// ---- dates -------------------------------------------------------------------
export type DateMode = "date" | "datetime" | "time";
const pad = (n: number) => String(n).padStart(2, "0");

function parseDate(v: string, mode: DateMode): Date | null {
  const s = v.trim();
  if (!s || s.includes("{{")) return null;
  if (mode === "time") {
    const m = /^(\d{1,2}):(\d{2})/.exec(s);
    if (!m) return null;
    const d = new Date();
    d.setHours(Number(m[1]), Number(m[2]), 0, 0);
    return d;
  }
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  const t = Date.parse(s);
  return Number.isFinite(t) ? new Date(t) : null;
}
/** The value written back: YYYY-MM-DD, an ISO timestamp, or HH:mm. */
export function formatDate(d: Date, mode: DateMode): string {
  if (mode === "date") return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  if (mode === "time") return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  return d.toISOString();
}
/** A friendly reading of the stored value, in local time. */
export function describeDate(v: string, mode: DateMode): string | null {
  const d = parseDate(v, mode);
  if (!d) return null;
  if (mode === "time") return null;
  return mode === "date"
    ? d.toLocaleDateString(undefined, { weekday: "short", year: "numeric", month: "short", day: "numeric" })
    : d.toLocaleString(undefined, { weekday: "short", year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function DateButtons(props: { value: string; mode: DateMode; onPick: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);
  return (
    <>
      <button
        type="button"
        className="nv-mini-btn nv-now-btn"
        title={props.mode === "date" ? "Today" : "Now"}
        onClick={() => props.onPick(formatDate(new Date(), props.mode))}
      >
        {props.mode === "date" ? "Today" : "Now"}
      </button>
      <button
        type="button"
        ref={btn}
        className={`nv-icon-btn ${open ? "is-on" : ""}`}
        title={props.mode === "time" ? "Pick a time" : "Pick a date"}
        aria-label={props.mode === "time" ? "Pick a time" : "Pick a date"}
        onClick={() => setOpen((o) => !o)}
      >
        {props.mode === "time" ? (
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4"><circle cx="8" cy="8" r="6" /><path d="M8 4.5V8l2.5 1.5" /></svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4"><rect x="2" y="3" width="12" height="11" rx="1.5" /><path d="M2 6.5h12M5 1.5v3M11 1.5v3" /></svg>
        )}
      </button>
      {open && (
        <Popover anchor={btn.current} width={252} onClose={() => setOpen(false)}>
          <Calendar
            value={props.value}
            mode={props.mode}
            onPick={(v, close) => {
              props.onPick(v);
              if (close) setOpen(false);
            }}
          />
        </Popover>
      )}
    </>
  );
}

const WEEK = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
function Calendar(props: { value: string; mode: DateMode; onPick: (v: string, close: boolean) => void }) {
  const cur = parseDate(props.value, props.mode);
  const [view, setView] = useState(() => {
    const d = cur ?? new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [time, setTime] = useState(() => {
    const d = cur ?? new Date();
    return { h: d.getHours(), m: d.getMinutes() };
  });
  const today = new Date();
  const same = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  const first = (view.getDay() + 6) % 7; // Monday-first
  const days: Date[] = [];
  for (let i = 0; i < 42; i++) days.push(new Date(view.getFullYear(), view.getMonth(), 1 - first + i));
  const pick = (d: Date, close: boolean) => {
    const out = new Date(d);
    if (props.mode !== "date") out.setHours(time.h, time.m, 0, 0);
    props.onPick(formatDate(out, props.mode), close);
  };
  const setT = (h: number, m: number) => {
    const t = { h: Math.max(0, Math.min(23, h)), m: Math.max(0, Math.min(59, m)) };
    setTime(t);
    const base = cur ?? new Date();
    const d = new Date(base);
    d.setHours(t.h, t.m, 0, 0);
    props.onPick(formatDate(d, props.mode), false);
  };
  return (
    <div className="nv-cal">
      {props.mode !== "time" && (
        <>
          <div className="nv-cal-head">
            <button type="button" className="nv-cal-nav" aria-label="Previous month" onClick={() => setView(new Date(view.getFullYear(), view.getMonth() - 1, 1))}>‹</button>
            <span className="nv-cal-title">{view.toLocaleDateString(undefined, { month: "long", year: "numeric" })}</span>
            <button type="button" className="nv-cal-nav" aria-label="Next month" onClick={() => setView(new Date(view.getFullYear(), view.getMonth() + 1, 1))}>›</button>
          </div>
          <div className="nv-cal-grid">
            {WEEK.map((w) => <span key={w} className="nv-cal-wd">{w}</span>)}
            {days.map((d) => (
              <button
                type="button"
                key={d.toISOString()}
                className={[
                  "nv-cal-day",
                  d.getMonth() !== view.getMonth() ? "is-other" : "",
                  same(d, today) ? "is-today" : "",
                  cur && same(d, cur) ? "is-on" : "",
                ].join(" ")}
                onClick={() => pick(d, props.mode === "date")}
              >
                {d.getDate()}
              </button>
            ))}
          </div>
        </>
      )}
      {props.mode !== "date" && (
        <div className="nv-cal-time">
          <span className="nv-cal-time-label">Time</span>
          <Scrub value={String(time.h)} spec={{ step: 1, min: 0, max: 23, px: 8 }} onChange={(v) => setTime({ ...time, h: Number(v) })} onCommit={(v) => setT(Number(v), time.m)}>
            <input className="nv-cal-num" aria-label="Hours" value={pad(time.h)} onChange={(e) => setT(Number(e.target.value) || 0, time.m)} />
          </Scrub>
          <span>:</span>
          <Scrub value={String(time.m)} spec={{ step: 1, min: 0, max: 59, px: 6 }} onChange={(v) => setTime({ ...time, m: Number(v) })} onCommit={(v) => setT(time.h, Number(v))}>
            <input className="nv-cal-num" aria-label="Minutes" value={pad(time.m)} onChange={(e) => setT(time.h, Number(e.target.value) || 0)} />
          </Scrub>
          <span className="nv-cal-tz">{Intl.DateTimeFormat().resolvedOptions().timeZone}</span>
        </div>
      )}
      <div className="nv-cal-foot">
        <button type="button" className="nv-mini-btn" onClick={() => props.onPick("", true)}>Clear</button>
        <span className="nv-spacer" />
        {props.mode !== "time" && (
          <button type="button" className="nv-mini-btn" onClick={() => pick(new Date(), true)}>Today</button>
        )}
        {props.mode !== "date" && (
          <button type="button" className="nv-mini-btn is-primary" onClick={() => props.onPick(formatDate(new Date(), props.mode), true)}>Now</button>
        )}
      </div>
    </div>
  );
}

// ---- colour ----------------------------------------------------------------------
export function normHex(v: string): string | null {
  const t = v.trim().replace(/^#/, "").toLowerCase();
  if (/^[0-9a-f]{3}$/.test(t)) return `#${t[0]}${t[0]}${t[1]}${t[1]}${t[2]}${t[2]}`;
  if (/^[0-9a-f]{6}$/.test(t)) return `#${t}`;
  return null;
}
function hexToHsv(hex: string) {
  const n = normHex(hex) ?? "#000000";
  const r = parseInt(n.slice(1, 3), 16) / 255, g = parseInt(n.slice(3, 5), 16) / 255, b = parseInt(n.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  let h = 0;
  if (d) h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return { h: (h * 60 + 360) % 360, s: max ? d / max : 0, v: max };
}
function hsvToHex(h: number, s: number, v: number) {
  const f = (n: number) => {
    const k = (n + h / 60) % 6;
    return v - v * s * Math.max(0, Math.min(k, 4 - k, 1));
  };
  return "#" + [f(5), f(3), f(1)].map((x) => pad(Math.round(x * 255).toString(16) as unknown as number).slice(-2)).join("");
}

export const COLOR_PRESETS = [
  "#64748b", "#6b7280", "#0ea5e9", "#3b82f6", "#6366f1", "#a855f7", "#ec4899", "#f43f5e",
  "#ef4444", "#f97316", "#f59e0b", "#eab308", "#84cc16", "#22c55e", "#10b981", "#14b8a6",
];

/** A colour chip that opens the picker. onChange is live (preview); onCommit is the final pick. */
export function ColorChip(props: { value: string; onChange?: (hex: string) => void; onCommit: (hex: string) => void; title?: string; allowNone?: boolean }) {
  const [open, setOpen] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);
  const valid = normHex(props.value);
  return (
    <>
      <button
        type="button"
        ref={btn}
        className={`nv-color-chip ${valid ? "" : "is-empty"} ${open ? "is-on" : ""}`}
        style={{ background: valid ?? undefined }}
        title={props.title ?? "Pick a colour"}
        aria-label={props.title ?? "Pick a colour"}
        onClick={() => setOpen((o) => !o)}
      />
      {open && (
        <Popover anchor={btn.current} width={240} onClose={() => setOpen(false)}>
          <ColorPanel value={valid ?? "#3b82f6"} allowNone={props.allowNone} onChange={(c) => props.onChange?.(c)} onCommit={(c) => props.onCommit(c)} />
        </Popover>
      )}
    </>
  );
}

function ColorPanel(props: { value: string; onChange: (hex: string) => void; onCommit: (hex: string) => void; allowNone?: boolean }) {
  const [hsv, setHsv] = useState(() => hexToHsv(props.value));
  const [hex, setHex] = useState(props.value);
  const hexNow = hsvToHex(hsv.h, hsv.s, hsv.v);
  useEffect(() => setHex(hexNow), [hexNow]);
  const drag = (el: HTMLElement, e: React.PointerEvent, fn: (x: number, y: number) => void) => {
    el.setPointerCapture(e.pointerId);
    const r = el.getBoundingClientRect();
    const at = (ev: { clientX: number; clientY: number }) =>
      fn(Math.max(0, Math.min(1, (ev.clientX - r.left) / r.width)), Math.max(0, Math.min(1, (ev.clientY - r.top) / r.height)));
    at(e);
    const move = (ev: PointerEvent) => at(ev);
    const up = () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      props.onCommit(hexRef.current);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
  };
  const hexRef = useRef(hexNow);
  hexRef.current = hexNow;
  const set = (next: { h: number; s: number; v: number }) => {
    setHsv(next);
    const h = hsvToHex(next.h, next.s, next.v);
    hexRef.current = h;
    props.onChange(h);
  };
  const eyedrop = "EyeDropper" in window;
  return (
    <div className="nv-color">
      <div
        className="nv-color-sv"
        style={{ background: `hsl(${hsv.h} 100% 50%)` }}
        onPointerDown={(e) => drag(e.currentTarget, e, (x, y) => set({ ...hsv, s: x, v: 1 - y }))}
      >
        <div className="nv-color-sv-white" />
        <div className="nv-color-sv-black" />
        <span className="nv-color-thumb" style={{ left: `${hsv.s * 100}%`, top: `${(1 - hsv.v) * 100}%`, background: hexNow }} />
      </div>
      <div className="nv-color-row">
        {eyedrop && (
          <button
            type="button"
            className="nv-icon-btn"
            title="Pick a colour from the screen"
            onClick={async () => {
              try {
                const r = await new (window as unknown as { EyeDropper: new () => { open: () => Promise<{ sRGBHex: string }> } }).EyeDropper().open();
                const n = normHex(r.sRGBHex);
                if (n) {
                  setHsv(hexToHsv(n));
                  props.onChange(n);
                  props.onCommit(n);
                }
              } catch {
                /* cancelled */
              }
            }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M10.5 2.5l3 3-1.5 1.5-3-3zM9 4l3 3-6.5 6.5H2.5v-3z" /></svg>
          </button>
        )}
        <div
          className="nv-color-hue"
          onPointerDown={(e) => drag(e.currentTarget, e, (x) => set({ ...hsv, h: x * 360 }))}
        >
          <span className="nv-color-hue-thumb" style={{ left: `${(hsv.h / 360) * 100}%` }} />
        </div>
      </div>
      <div className="nv-color-row">
        <span className="nv-color-preview" style={{ background: hexNow }} />
        <input
          className="nv-color-hex"
          value={hex}
          spellCheck={false}
          aria-label="Hex"
          onChange={(e) => {
            setHex(e.target.value);
            const n = normHex(e.target.value);
            if (n) {
              setHsv(hexToHsv(n));
              props.onChange(n);
            }
          }}
          onKeyDown={(e) => e.key === "Enter" && normHex(hex) && props.onCommit(normHex(hex)!)}
          onBlur={() => normHex(hex) && props.onCommit(normHex(hex)!)}
        />
      </div>
      <div className="nv-color-swatches">
        {COLOR_PRESETS.map((c) => (
          <button
            type="button"
            key={c}
            className={`nv-color-swatch ${hexNow === c ? "is-on" : ""}`}
            style={{ background: c }}
            title={c}
            onClick={() => {
              setHsv(hexToHsv(c));
              props.onChange(c);
              props.onCommit(c);
            }}
          />
        ))}
        {props.allowNone && (
          <button type="button" className="nv-color-swatch is-none" title="No colour" onClick={() => props.onCommit("")} />
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Which special control a parameter gets, from its type, input type or name.

export function dateModeOf(type?: string | null, inputType?: string | null, key = "", label = ""): DateMode | null {
  const t = `${type ?? ""} ${inputType ?? ""}`.toLowerCase();
  if (/\btime\b/.test(t) && !/date/.test(t)) return "time";
  if (/datetime|timestamp|date-time|datetime-local/.test(t)) return "datetime";
  if (/\bdate\b/.test(t)) return "date";
  const k = `${key} ${label}`.toLowerCase();
  if (/(^|[_\s])(datetime|timestamp)([_\s]|$)|_at\b|(^|[_\s])at$|deadline|scheduled|expires/.test(k)) return "datetime";
  if (/(^|[_\s])(date|day|birthday|dob)([_\s]|$)|_on\b|due_date|start_date|end_date/.test(k)) return "date";
  if (/(^|[_\s])time([_\s]|$)|_time\b/.test(k) && !/timeout|times\b/.test(k)) return "time";
  return null;
}

export function isColorParam(type?: string | null, inputType?: string | null, key = "", label = ""): boolean {
  if (/colou?r/i.test(`${type ?? ""} ${inputType ?? ""}`)) return true;
  return /colou?r|(^|[_\s])(hex|hue|tint)([_\s]|$)/i.test(`${key} ${label}`);
}

/** How a numeric field scrubs, or null if it isn't numeric. */
export function scrubOf(type?: string | null, inputType?: string | null, key = "", label = ""): ScrubSpec | null {
  const t = `${type ?? ""} ${inputType ?? ""}`.toLowerCase();
  const k = `${key} ${label}`.toLowerCase();
  const isNum = /number|integer|int\b|float|decimal/.test(t) || /(^|[_\s])(delay|timeout|interval|retries|retry|attempts|count|limit|concurrency|ms|seconds|minutes|hours|days|max|min|size|port|percent|amount|quantity)([_\s]|$)/.test(k);
  if (!isNum) return null;
  if (/(^|[_\s])(delay|timeout|interval|ms)([_\s]|$)|\(ms\)/.test(k)) return { step: 50, min: 0, px: 2 };
  if (/percent/.test(k)) return { step: 1, min: 0, max: 100 };
  if (/float|decimal/.test(t)) return { step: 0.1 };
  if (/(^|[_\s])(retries|retry|attempts|count|limit|concurrency|size|quantity|seconds|minutes|hours|days)([_\s]|$)/.test(k)) return { step: 1, min: 0, px: 6 };
  return { step: 1 };
}
