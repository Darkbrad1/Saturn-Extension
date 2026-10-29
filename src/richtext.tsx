// A rich text value (0.3.69): a property that uses Saturn's Rich text editor input, in a Create or Property Updater
// step. Saturn's own editor is Quill 2, so this is Quill 2 too and writes the same HTML (`<ol><li data-list="bullet">`,
// `<strong>`, inline colours, `ql-align-*` / `ql-indent-*` classes). It looks like Notion: no toolbar until text is
// picked (then a small bar above it), a / menu for blocks, and Markdown shortcuts ("# ", "- ", "1. ", "> ", "```").
// It has what Saturn's toolbar has, apart from line spacing (its stored form isn't known yet).
import { useEffect, useRef, useState } from "react";
import Quill from "quill";

type Range = { index: number; length: number };

/** Saturn's empty editor: what counts as no value. */
export function isEmptyRich(html: string) {
  return !html.replace(/<p><br><\/p>/g, "").replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim() && !/<(img|table)\b/.test(html);
}

const COLOURS = ["", "#9b9a97", "#e03e3e", "#d9730d", "#dfab01", "#0f7b6c", "#0b6e99", "#6940a5", "#ad1a72"];
const HIGHLIGHTS = ["", "#ebeced", "#fbe4e4", "#faebdd", "#fbf3db", "#ddedea", "#ddebf1", "#eae4f2", "#f4dfeb"];

interface Block {
  id: string;
  label: string;
  hint: string;
  run: (q: Quill, index: number) => void;
}
const BLOCKS: Block[] = [
  { id: "text", label: "Text", hint: "Plain text", run: (q, i) => q.formatLine(i, 1, { header: false, list: false, blockquote: false, "code-block": false }, "user") },
  { id: "h1", label: "Heading 1", hint: "#", run: (q, i) => q.formatLine(i, 1, "header", 1, "user") },
  { id: "h2", label: "Heading 2", hint: "##", run: (q, i) => q.formatLine(i, 1, "header", 2, "user") },
  { id: "h3", label: "Heading 3", hint: "###", run: (q, i) => q.formatLine(i, 1, "header", 3, "user") },
  { id: "bullet", label: "Bulleted list", hint: "-", run: (q, i) => q.formatLine(i, 1, "list", "bullet", "user") },
  { id: "ordered", label: "Numbered list", hint: "1.", run: (q, i) => q.formatLine(i, 1, "list", "ordered", "user") },
  { id: "quote", label: "Quote", hint: ">", run: (q, i) => q.formatLine(i, 1, "blockquote", true, "user") },
  { id: "code", label: "Code", hint: "```", run: (q, i) => q.formatLine(i, 1, "code-block", true, "user") },
  { id: "table", label: "Table", hint: "3 × 3", run: (q, i) => {
    q.setSelection(i, 0, "silent");
    (q.getModule("table") as { insertTable: (r: number, c: number) => void }).insertTable(3, 3);
  } },
  { id: "image", label: "Image", hint: "from a link", run: () => {} },
];

// Markdown shortcuts typed at the start of a line, then a space
const SHORTCUTS: [RegExp, (q: Quill, i: number) => void][] = [
  [/^###$/, (q, i) => q.formatLine(i, 1, "header", 3, "user")],
  [/^##$/, (q, i) => q.formatLine(i, 1, "header", 2, "user")],
  [/^#$/, (q, i) => q.formatLine(i, 1, "header", 1, "user")],
  [/^>$/, (q, i) => q.formatLine(i, 1, "blockquote", true, "user")],
  [/^```$/, (q, i) => q.formatLine(i, 1, "code-block", true, "user")],
];

export function RichText(props: { value: string; placeholder?: string; onChange: (html: string) => void; onCommit: (html: string) => void }) {
  const box = useRef<HTMLDivElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const quill = useRef<Quill | null>(null);
  // the HTML last given to or taken from the editor, so a value coming back doesn't reset the caret
  const known = useRef(props.value);
  const dirty = useRef(false);
  const cb = useRef(props);
  cb.current = props;
  const [bar, setBar] = useState<{ top: number; left: number; range: Range; formats: Record<string, unknown> } | null>(null);
  const [slash, setSlash] = useState<{ top: number; left: number; index: number; q: string; at: number } | null>(null);
  const [ask, setAsk] = useState<{ kind: "link" | "image"; range: Range; text: string } | null>(null);
  const [palette, setPalette] = useState(false);

  // the editor's HTML as Saturn stores it: without the list markers Quill draws (<span class="ql-ui">)
  const html = () => {
    const root = (quill.current?.root.innerHTML ?? "").replace(/<span class="ql-ui"[^>]*><\/span>/g, "");
    return isEmptyRich(root) ? "" : root;
  };
  const commit = () => {
    if (!dirty.current) return;
    dirty.current = false;
    cb.current.onCommit(html());
  };

  useEffect(() => {
    const q = new Quill(box.current!, {
      theme: undefined,
      placeholder: props.placeholder ?? "Type, or press / for blocks",
      modules: { table: true, toolbar: false },
    });
    quill.current = q;
    if (props.value) q.clipboard.dangerouslyPasteHTML(props.value, "silent");
    known.current = props.value;
    const place = (range: Range) => {
      const b = q.getBounds(range.index, range.length);
      return b ? { top: b.top, left: b.left + b.width / 2 } : { top: 0, left: 0 };
    };
    q.on("text-change", (_delta, _old, source) => {
      if (source !== "user") return;
      dirty.current = true;
      known.current = html();
      cb.current.onChange(known.current);
      const sel = q.getSelection();
      if (!sel) return;
      const [line, offset] = q.getLine(sel.index) as [{ domNode: HTMLElement } | null, number];
      const start = sel.index - offset;
      const text = q.getText(start, offset);
      // a Markdown shortcut: the line so far is "# " (and so on)
      if (text.endsWith(" ")) {
        const head = text.slice(0, -1);
        const hit = SHORTCUTS.find(([re]) => re.test(head));
        if (hit && line) {
          q.deleteText(start, head.length + 1, "user");
          hit[1](q, start);
          return;
        }
      }
      // the / menu: a / at the start of a line or after a space, and what's typed after it
      const at = text.lastIndexOf("/");
      if (at >= 0 && (at === 0 || text[at - 1] === " ") && !/\s/.test(text.slice(at + 1))) {
        const p = place({ index: start + at, length: 1 });
        setSlash({ top: p.top + 22, left: p.left, index: start, at: start + at, q: text.slice(at + 1).toLowerCase() });
      } else setSlash(null);
    });
    q.on("selection-change", (range: Range | null) => {
      if (range && range.length > 0) {
        const p = place(range);
        setBar({ top: p.top - 40, left: p.left, range, formats: q.getFormat(range) });
      } else if (range) {
        setBar(null);
        setPalette(false);
      }
    });
    return () => {
      // going away with an edit not yet applied: apply it
      commit();
      quill.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // a new value from outside (another step picked, an undo)
  useEffect(() => {
    const q = quill.current;
    if (!q || props.value === known.current) return;
    known.current = props.value;
    dirty.current = false;
    q.setContents([], "silent");
    if (props.value) q.clipboard.dangerouslyPasteHTML(props.value, "silent");
  }, [props.value]);

  const format = (name: string, value: unknown) => {
    const q = quill.current;
    if (!q || !bar) return;
    q.formatText(bar.range.index, bar.range.length, name, value, "user");
    setBar({ ...bar, formats: q.getFormat(bar.range) });
  };
  const line = (name: string, value: unknown) => {
    const q = quill.current;
    if (!q || !bar) return;
    q.formatLine(bar.range.index, bar.range.length, name, value, "user");
    setBar({ ...bar, formats: q.getFormat(bar.range) });
  };
  const block = (b: Block) => {
    const q = quill.current;
    if (!q || !slash) return;
    const typed = slash.q.length + 1;
    q.deleteText(slash.at, typed, "user");
    setSlash(null);
    if (b.id === "image") {
      setAsk({ kind: "image", range: { index: slash.at, length: 0 }, text: "" });
      return;
    }
    b.run(q, slash.at);
    q.setSelection(slash.at, 0, "silent");
  };
  const finishAsk = (text: string | null) => {
    const q = quill.current;
    const a = ask;
    setAsk(null);
    if (!q || !a || text === null) return;
    const url = text.trim();
    if (a.kind === "image") {
      if (url) q.insertEmbed(a.range.index, "image", url, "user");
    } else q.formatText(a.range.index, a.range.length, "link", url || false, "user");
    q.focus();
  };
  const blocks = slash ? BLOCKS.filter((b) => !slash.q || b.label.toLowerCase().includes(slash.q) || b.id.startsWith(slash.q)) : [];
  const f = bar?.formats ?? {};
  const head = typeof f.header === "number" ? f.header : 0;

  return (
    <div
      className="nv-rich"
      ref={wrap}
      onBlur={(e) => {
        // leaving the editor and its bars applies the edit
        if (!wrap.current?.contains(e.relatedTarget as Node | null)) {
          setSlash(null);
          setBar(null);
          setPalette(false);
          commit();
        }
      }}
      onKeyDown={(e) => {
        if (slash && blocks.length && e.key === "Enter") {
          e.preventDefault();
          e.stopPropagation();
          block(blocks[0]);
        } else if (e.key === "Escape") {
          setSlash(null);
          setBar(null);
        }
        // keep the canvas's shortcuts out of the editor
        e.stopPropagation();
      }}
    >
      <div ref={box} className="nv-rich-body" />
      {bar && !ask && (
        <div className="nv-rich-bar" style={{ top: bar.top, left: bar.left }} onMouseDown={(e) => e.preventDefault()} role="toolbar" aria-label="Format the picked text">
          <select
            className="nv-rich-head"
            aria-label="Block type"
            value={head ? `h${head}` : f.list ? `list-${String(f.list)}` : f.blockquote ? "quote" : "text"}
            onChange={(e) => {
              const v = e.target.value;
              line("header", v.startsWith("h") ? Number(v.slice(1)) : false);
              line("list", v.startsWith("list-") ? v.slice(5) : false);
              line("blockquote", v === "quote");
            }}
          >
            <option value="text">Text</option>
            <option value="h1">Heading 1</option>
            <option value="h2">Heading 2</option>
            <option value="h3">Heading 3</option>
            <option value="list-bullet">Bulleted list</option>
            <option value="list-ordered">Numbered list</option>
            <option value="quote">Quote</option>
          </select>
          <span className="nv-rich-sep" />
          <Tool on={!!f.bold} title="Bold (Ctrl+B)" onClick={() => format("bold", !f.bold)}><b>B</b></Tool>
          <Tool on={!!f.italic} title="Italic (Ctrl+I)" onClick={() => format("italic", !f.italic)}><i>I</i></Tool>
          <Tool on={!!f.underline} title="Underline (Ctrl+U)" onClick={() => format("underline", !f.underline)}><u>U</u></Tool>
          <Tool on={!!f.strike} title="Strike through" onClick={() => format("strike", !f.strike)}><s>S</s></Tool>
          <Tool on={!!f.link} title="Link" onClick={() => setAsk({ kind: "link", range: bar.range, text: typeof f.link === "string" ? f.link : "" })}>↗</Tool>
          <Tool on={palette} title="Colour and highlight" onClick={() => setPalette(!palette)}>
            <span className="nv-rich-a" style={{ color: typeof f.color === "string" ? f.color : undefined, background: typeof f.background === "string" ? f.background : undefined }}>A</span>
          </Tool>
          <span className="nv-rich-sep" />
          <Tool on={!f.align} title="Align left" onClick={() => line("align", false)}>⇤</Tool>
          <Tool on={f.align === "center"} title="Align centre" onClick={() => line("align", "center")}>≡</Tool>
          <Tool on={f.align === "right"} title="Align right" onClick={() => line("align", "right")}>⇥</Tool>
          <Tool on={false} title="Indent less" onClick={() => line("indent", "-1")}>⟨</Tool>
          <Tool on={false} title="Indent more" onClick={() => line("indent", "+1")}>⟩</Tool>
          <span className="nv-rich-sep" />
          <Tool on={false} title="Clear formatting" onClick={() => { quill.current?.removeFormat(bar.range.index, bar.range.length, "user"); setBar({ ...bar, formats: {} }); }}>⌫</Tool>
          {palette && (
            <div className="nv-rich-palette">
              <span className="nv-rich-pal-title">Text</span>
              <div className="nv-rich-swatches">
                {COLOURS.map((c) => (
                  <button key={"c" + c} type="button" className="nv-rich-swatch" title={c ? `Text ${c}` : "Default text colour"} onClick={() => format("color", c || false)}>
                    <span style={{ color: c || undefined }}>A</span>
                  </button>
                ))}
              </div>
              <span className="nv-rich-pal-title">Highlight</span>
              <div className="nv-rich-swatches">
                {HIGHLIGHTS.map((c) => (
                  <button key={"b" + c} type="button" className="nv-rich-swatch" title={c ? `Highlight ${c}` : "No highlight"} style={{ background: c || undefined }} onClick={() => format("background", c || false)} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      {slash && blocks.length > 0 && (
        <div className="nv-rich-slash" style={{ top: slash.top, left: Math.max(0, slash.left - 20) }} onMouseDown={(e) => e.preventDefault()} role="listbox" aria-label="Blocks">
          {blocks.map((b, i) => (
            <button key={b.id} type="button" role="option" aria-selected={i === 0} className={`nv-rich-block ${i === 0 ? "is-first" : ""}`} onClick={() => block(b)}>
              <span>{b.label}</span>
              <code>{b.hint}</code>
            </button>
          ))}
        </div>
      )}
      {ask && <AskUrl kind={ask.kind} initial={ask.text} onDone={finishAsk} />}
    </div>
  );
}

function Tool(props: { on: boolean; title: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" className={`nv-rich-tool ${props.on ? "is-on" : ""}`} title={props.title} aria-label={props.title} aria-pressed={props.on} onClick={props.onClick}>
      {props.children}
    </button>
  );
}

/** A link or an image's address, typed in a small box (VS Code's webviews have no prompt()). */
function AskUrl(props: { kind: "link" | "image"; initial: string; onDone: (text: string | null) => void }) {
  const [text, setText] = useState(props.initial);
  return (
    <div className="nv-rich-ask">
      <input
        autoFocus
        value={text}
        placeholder={props.kind === "link" ? "Paste a link (empty removes it)" : "Paste an image's link"}
        aria-label={props.kind === "link" ? "Link" : "Image link"}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          e.stopPropagation();
          if (e.key === "Enter") {
            e.preventDefault();
            props.onDone(text);
          } else if (e.key === "Escape") props.onDone(null);
        }}
      />
      <button type="button" className="nv-mini-btn" onMouseDown={(e) => e.preventDefault()} onClick={() => props.onDone(text)}>
        {props.kind === "link" ? "Link" : "Insert"}
      </button>
    </div>
  );
}
