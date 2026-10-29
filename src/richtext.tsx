// A rich text value (0.3.69, rewritten in 0.3.70): a property that uses Saturn's Rich text editor input, in a Create or
// Property Updater step. It edits the HTML in place (the browser's own editing), so everything Saturn's editor writes is
// kept as it is: its paragraphs' styles and line spacing, its tables (class sa-rich-editor-table, colours on every
// cell), pasted pictures (data: addresses). What's saved follows Saturn's shapes: <strong> / <em> / <u> / <s>, lists as
// <ol><li data-list="bullet|ordered">, alignment and indents as Quill's ql-align-* / ql-indent-* classes, spacing as
// line-height on the paragraph, links with target="_blank" rel="noopener noreferrer".
//
// It looks like Notion: no toolbar until text is picked, then a small bar above it (kept inside the box); a / menu for
// blocks; Markdown shortcuts ("# ", "- ", "1. ", "> "); a bar over a picked picture (change, remove) and one over the
// table the caret is in (rows, columns, delete). New tables use Saturn's Dark Header style, the one seen stored.
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { FaIcon } from "../src-res/icons";

/** Saturn's empty editor: what counts as no value. */
export function isEmptyRich(html: string) {
  return !html.replace(/<p[^>]*><br><\/p>/g, "").replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim() && !/<(img|table)\b/i.test(html);
}

// ---- Saturn's HTML <-> what the browser edits -------------------------------------------------------------------

/** Quill's lists (<ol><li data-list="bullet">) as plain <ul> / <ol>, which the browser knows how to edit. */
export function toEditable(html: string): string {
  const box = document.createElement("div");
  box.innerHTML = html;
  box.querySelectorAll("span.ql-ui").forEach((s) => s.remove());
  for (const ol of [...box.querySelectorAll("ol")]) {
    const items = [...ol.children].filter((c) => c.tagName === "LI") as HTMLElement[];
    if (!items.length || !items.some((li) => li.dataset.list) || items.some((li) => /^(checked|unchecked)$/.test(li.dataset.list ?? ""))) continue;
    const frag = document.createDocumentFragment();
    let cur: HTMLElement | null = null;
    let kind = "";
    for (const li of items) {
      const k = li.dataset.list === "bullet" ? "UL" : "OL";
      if (!cur || k !== kind) {
        cur = document.createElement(k);
        kind = k;
        frag.appendChild(cur);
      }
      li.removeAttribute("data-list");
      cur.appendChild(li);
    }
    ol.replaceWith(frag);
  }
  return box.innerHTML;
}

function rename(el: Element, tag: string) {
  const next = document.createElement(tag);
  for (const a of [...el.attributes]) next.setAttribute(a.name, a.value);
  while (el.firstChild) next.appendChild(el.firstChild);
  el.replaceWith(next);
  return next;
}

/** The editor's content as Saturn stores it. */
export function toSaturn(root: HTMLElement): string {
  const box = root.cloneNode(true) as HTMLElement;
  box.querySelectorAll(".nv-rich-picked").forEach((e) => e.classList.remove("nv-rich-picked"));
  box.querySelectorAll("[class='']").forEach((e) => e.removeAttribute("class"));
  for (const [from, to] of [["b", "strong"], ["i", "em"], ["strike", "s"]] as const) box.querySelectorAll(from).forEach((e) => rename(e, to));
  for (const ul of [...box.querySelectorAll("ul")]) {
    for (const li of ul.querySelectorAll(":scope > li")) li.setAttribute("data-list", "bullet");
    rename(ul, "ol");
  }
  for (const ol of box.querySelectorAll("ol")) for (const li of ol.querySelectorAll(":scope > li")) if (!li.getAttribute("data-list")) li.setAttribute("data-list", "ordered");
  const html = box.innerHTML;
  return isEmptyRich(html) ? "" : html;
}

// ---- Saturn's Dark Header table (copied from a table Saturn saved) ----------------------------------------------

const TABLE_STYLE = "border-collapse: separate; border-spacing: 0px; border-radius: 9px; overflow: hidden; width: 100%; table-layout: fixed; border: 1px solid rgb(51, 65, 85);";
const LINE = "rgb(203, 213, 225)";

/** One cell's style in a Dark Header table: borders inside only, the outer corners rounded. */
function darkCell(head: boolean, row: number, col: number, rows: number, cols: number) {
  const lastCol = col === cols - 1;
  const lastRow = row === rows - 1;
  const border = lastRow
    ? lastCol
      ? "border: 0px;"
      : `border-width: 0px 1px 0px 0px; border-style: none solid none none; border-color: currentcolor ${LINE} currentcolor currentcolor; border-image: none;`
    : lastCol
      ? `border-width: 0px 0px 1px; border-style: none none solid; border-color: currentcolor currentcolor ${LINE}; border-image: none;`
      : `border-width: 0px 1px 1px 0px; border-style: none solid solid none; border-color: currentcolor ${LINE} ${LINE} currentcolor; border-image: none;`;
  const radius =
    row === 0 && col === 0 ? (lastRow && lastCol ? "9px" : lastRow ? "9px 0px 0px 9px" : lastCol ? "9px 9px 0px 0px" : "9px 0px 0px")
    : row === 0 && lastCol ? (lastRow ? "0px 9px 9px 0px" : "0px 9px 0px 0px")
    : lastRow && col === 0 ? "0px 0px 0px 9px"
    : lastRow && lastCol ? "0px 0px 9px"
    : "0px";
  const look = head ? "background: rgb(51, 65, 85); color: rgb(255, 255, 255); font-weight: 700;" : "background: rgb(255, 255, 255); color: rgb(15, 23, 42); font-weight: 400;";
  return `${border} padding: 8px 10px; vertical-align: top; ${look} border-radius: ${radius};`;
}

function darkTable(rows: number, cols: number, header: boolean) {
  const all = rows + (header ? 1 : 0);
  const cells = (tag: string, r: number) => Array.from({ length: cols }, (_, c) => `<${tag} style="${darkCell(tag === "th", r, c, all, cols)}"><br></${tag}>`).join("");
  const head = header ? `<thead><tr>${cells("th", 0)}</tr></thead>` : "";
  const body = Array.from({ length: rows }, (_, i) => `<tr>${cells("td", i + (header ? 1 : 0))}</tr>`).join("");
  return `<table class="sa-rich-editor-table sa-rich-editor-table--dark-header" border="1" cellpadding="6" cellspacing="0" data-style="dark-header" style="${TABLE_STYLE}"><colgroup>${"<col>".repeat(cols)}</colgroup>${head}<tbody>${body}</tbody></table><p><br></p>`;
}

/** After rows or columns change, a Dark Header table's cells get their borders and corners again. */
function restyle(table: HTMLTableElement) {
  const rows = [...table.rows];
  const cols = Math.max(...rows.map((r) => r.cells.length));
  const cg = table.querySelector("colgroup");
  if (cg) cg.innerHTML = "<col>".repeat(cols);
  if (table.dataset.style !== "dark-header") return;
  rows.forEach((r, i) => [...r.cells].forEach((c, j) => c.setAttribute("style", darkCell(c.tagName === "TH", i, j, rows.length, cols))));
}

// ---- the editor --------------------------------------------------------------------------------------------------

const BLOCK = "p,h1,h2,h3,h4,h5,h6,li,blockquote,pre";
// Saturn's own colours where seen (pink text, rose highlight), and a few more like them
const COLOURS = ["", "rgb(100, 116, 139)", "rgb(220, 38, 38)", "rgb(234, 88, 12)", "rgb(202, 138, 4)", "rgb(22, 163, 74)", "rgb(37, 99, 235)", "rgb(124, 58, 237)", "rgb(219, 39, 119)"];
const HIGHLIGHTS = ["", "rgb(241, 245, 249)", "rgb(254, 226, 226)", "rgb(255, 237, 213)", "rgb(254, 249, 195)", "rgb(220, 252, 231)", "rgb(219, 234, 254)", "rgb(237, 233, 254)", "rgb(252, 231, 243)"];
const SPACINGS = ["1", "1.5", "2", "2.5", "3"];
const TYPES: { id: string; label: string; tag: string }[] = [
  { id: "p", label: "Text", tag: "p" },
  { id: "h1", label: "Heading 1", tag: "h1" },
  { id: "h2", label: "Heading 2", tag: "h2" },
  { id: "h3", label: "Heading 3", tag: "h3" },
  { id: "h4", label: "Heading 4", tag: "h4" },
  { id: "blockquote", label: "Quote", tag: "blockquote" },
  { id: "pre", label: "Code", tag: "pre" },
];
interface Block { id: string; label: string; hint: string; icon: string }
const BLOCKS: Block[] = [
  { id: "p", label: "Text", hint: "", icon: "paragraph" },
  { id: "h1", label: "Heading 1", hint: "#", icon: "heading" },
  { id: "h2", label: "Heading 2", hint: "##", icon: "heading" },
  { id: "h3", label: "Heading 3", hint: "###", icon: "heading" },
  { id: "h4", label: "Heading 4", hint: "####", icon: "heading" },
  { id: "ul", label: "Bulleted list", hint: "-", icon: "list-ul" },
  { id: "ol", label: "Numbered list", hint: "1.", icon: "list-ol" },
  { id: "blockquote", label: "Quote", hint: ">", icon: "quote-left" },
  { id: "pre", label: "Code", hint: "```", icon: "code" },
  { id: "table", label: "Table", hint: "", icon: "table" },
  { id: "image", label: "Image", hint: "", icon: "image" },
];
// Markdown typed at the start of a line, then a space
const MARKS: Record<string, string> = { "#": "h1", "##": "h2", "###": "h3", "####": "h4", "-": "ul", "*": "ul", "1.": "ol", ">": "blockquote", "```": "pre" };

type Pop = null | "type" | "spacing" | "colour" | "link" | "image" | "table";

export function RichText(props: { value: string; placeholder?: string; onChange: (html: string) => void; onCommit: (html: string) => void }) {
  const wrap = useRef<HTMLDivElement>(null);
  const ed = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const known = useRef(props.value);
  const dirty = useRef(false);
  const cb = useRef(props);
  cb.current = props;
  // where the caret or the picked text was, kept while a box in a bar has the focus
  const saved = useRef<Range | null>(null);
  const [bar, setBar] = useState<{ top: number; left: number; below: boolean } | null>(null);
  const [pop, setPop] = useState<Pop>(null);
  const [slash, setSlash] = useState<{ top: number; left: number; q: string; active: number } | null>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [cell, setCell] = useState<HTMLTableCellElement | null>(null);
  const [empty, setEmpty] = useState(isEmptyRich(props.value));
  const [, bump] = useState(0);

  const emit = () => {
    if (!ed.current) return;
    dirty.current = true;
    known.current = toSaturn(ed.current);
    setEmpty(isEmptyRich(known.current));
    cb.current.onChange(known.current);
  };
  const commit = () => {
    if (!dirty.current) return;
    dirty.current = false;
    cb.current.onCommit(known.current);
  };

  useEffect(() => {
    if (ed.current) ed.current.innerHTML = toEditable(props.value);
    document.execCommand("defaultParagraphSeparator", false, "p");
    return () => commit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // a new value from outside (another step picked, an undo)
  useEffect(() => {
    if (!ed.current || props.value === known.current) return;
    known.current = props.value;
    dirty.current = false;
    ed.current.innerHTML = toEditable(props.value);
    setEmpty(isEmptyRich(props.value));
  }, [props.value]);

  const inside = (n: Node | null) => !!n && !!ed.current && ed.current.contains(n);
  const rel = (r: DOMRect) => {
    const w = wrap.current!.getBoundingClientRect();
    return { top: r.top - w.top, bottom: r.bottom - w.top, left: r.left - w.left + r.width / 2 };
  };
  const remember = () => {
    const s = getSelection();
    if (s && s.rangeCount && inside(s.anchorNode)) saved.current = s.getRangeAt(0).cloneRange();
  };
  const restore = () => {
    const s = getSelection();
    if (!s || !saved.current) return;
    ed.current?.focus();
    s.removeAllRanges();
    s.addRange(saved.current);
  };
  const exec = (cmd: string, value?: string, css = false) => {
    restore();
    document.execCommand("styleWithCSS", false, String(css));
    document.execCommand(cmd, false, value);
    document.execCommand("styleWithCSS", false, "false");
    remember();
    emit();
    bump((n) => n + 1);
  };

  // the bar over picked text, the table bar for the caret's cell
  useEffect(() => {
    const onSel = () => {
      const s = getSelection();
      if (!s || !s.rangeCount || !inside(s.anchorNode)) return;
      const r = s.getRangeAt(0);
      remember();
      const node = r.startContainer.nodeType === 1 ? (r.startContainer as Element) : r.startContainer.parentElement;
      setCell((node?.closest("td,th") as HTMLTableCellElement | null) ?? null);
      if (r.collapsed) {
        setBar(null);
        if (pop !== "link" && pop !== "image" && pop !== "table") setPop(null);
        return;
      }
      const p = rel(r.getBoundingClientRect());
      setBar({ top: p.top, left: p.left, below: p.top < 44 });
      setImg(null);
    };
    document.addEventListener("selectionchange", onSel);
    return () => document.removeEventListener("selectionchange", onSel);
  });
  // keep the bar inside the box: centred over the text, moved in from either edge
  useLayoutEffect(() => {
    const b = barRef.current, w = wrap.current;
    if (!b || !w || !bar) return;
    const width = b.offsetWidth;
    const left = Math.min(Math.max(4, bar.left - width / 2), Math.max(4, w.clientWidth - width - 4));
    b.style.left = `${left}px`;
  });

  // blocks the picked text or the caret is in (made into paragraphs first when it's bare text)
  const blocks = (): HTMLElement[] => {
    restore();
    const s = getSelection();
    if (!s || !s.rangeCount || !ed.current) return [];
    const r = s.getRangeAt(0);
    const all = [...ed.current.querySelectorAll<HTMLElement>(BLOCK)].filter((b) => r.intersectsNode(b));
    const leaves = all.filter((b) => !all.some((o) => o !== b && b.contains(o)));
    if (leaves.length) return leaves;
    document.execCommand("formatBlock", false, "p");
    const n = getSelection()!.anchorNode;
    const b = (n?.nodeType === 1 ? (n as Element) : n?.parentElement)?.closest(BLOCK) as HTMLElement | null;
    return b ? [b] : [];
  };
  const classStep = (b: HTMLElement, prefix: string, value: string | null) => {
    for (const c of [...b.classList]) if (c.startsWith(prefix)) b.classList.remove(c);
    if (value) b.classList.add(prefix + value);
    if (!b.classList.length) b.removeAttribute("class");
  };
  const align = (where: string | null) => {
    for (const b of blocks()) {
      classStep(b, "ql-align-", where);
      b.style.removeProperty("text-align");
      if (!b.getAttribute("style")) b.removeAttribute("style");
    }
    emit();
    bump((n) => n + 1);
  };
  const indent = (by: number) => {
    for (const b of blocks()) {
      const now = Number([...b.classList].find((c) => c.startsWith("ql-indent-"))?.slice(10) ?? 0);
      const next = Math.max(0, Math.min(8, now + by));
      classStep(b, "ql-indent-", next ? String(next) : null);
    }
    emit();
  };
  const spacing = (v: string) => {
    for (const b of blocks()) b.style.lineHeight = v;
    setPop(null);
    emit();
  };
  const setType = (id: string) => {
    const t = TYPES.find((x) => x.id === id)!;
    setPop(null);
    // the block the caret is in gets the new tag itself (formatBlock misses an empty line and picks the one above)
    restore();
    const sel = getSelection();
    const at = sel?.rangeCount ? sel.anchorNode : null;
    const el = (at?.nodeType === 1 ? (at as Element) : at?.parentElement)?.closest(BLOCK);
    if (!sel || !el || el === ed.current || !ed.current?.contains(el) || el.tagName === "LI" || saved.current?.collapsed === false && !el.contains(saved.current.endContainer)) {
      exec("formatBlock", t.tag);
      return;
    }
    if (el.tagName.toLowerCase() === t.tag) return;
    const next = document.createElement(t.tag);
    for (const a of ["style", "class"]) if (el.hasAttribute(a)) next.setAttribute(a, el.getAttribute(a)!);
    while (el.firstChild) next.appendChild(el.firstChild);
    if (!next.textContent) next.replaceChildren(document.createElement("br"));
    el.replaceWith(next);
    const r = document.createRange();
    if (next.firstChild?.nodeName === "BR") r.setStart(next, 0);
    else {
      r.selectNodeContents(next);
      r.collapse(false);
    }
    sel.removeAllRanges();
    sel.addRange(r);
    remember();
    emit();
    bump((n) => n + 1);
  };
  // a list from the line the caret is on (the / menu, "- "): built here, as the list commands also miss an empty line
  const makeList = (tag: "ul" | "ol") => {
    restore();
    const sel = getSelection();
    const at = sel?.rangeCount ? sel.anchorNode : null;
    const el = (at?.nodeType === 1 ? (at as Element) : at?.parentElement)?.closest(BLOCK);
    if (!sel || !el || el === ed.current || !ed.current?.contains(el) || el.tagName === "LI" || !sel.isCollapsed) {
      exec(tag === "ul" ? "insertUnorderedList" : "insertOrderedList");
      return;
    }
    const list = document.createElement(tag);
    const li = document.createElement("li");
    while (el.firstChild) li.appendChild(el.firstChild);
    if (!li.textContent) li.replaceChildren(document.createElement("br"));
    list.appendChild(li);
    el.replaceWith(list);
    const r = document.createRange();
    if (li.firstChild?.nodeName === "BR") r.setStart(li, 0);
    else {
      r.selectNodeContents(li);
      r.collapse(false);
    }
    sel.removeAllRanges();
    sel.addRange(r);
    remember();
    emit();
    bump((n) => n + 1);
  };
  const block = (id: string) => {
    if (id === "ul" || id === "ol") makeList(id);
    else if (id === "table") setPop("table");
    else if (id === "image") setPop("image");
    else setType(id);
  };

  // the link the caret or picked text is in
  const linkHere = (): HTMLAnchorElement | null => {
    const r = saved.current;
    const n = r ? (r.commonAncestorContainer.nodeType === 1 ? (r.commonAncestorContainer as Element) : r.commonAncestorContainer.parentElement) : null;
    return (n?.closest("a") as HTMLAnchorElement | null) ?? null;
  };
  const setLink = (url: string) => {
    const a = linkHere();
    if (a) {
      if (url) a.href = url;
      else a.replaceWith(...a.childNodes);
    } else if (url) {
      exec("createLink", url);
      ed.current?.querySelectorAll<HTMLAnchorElement>(`a[href="${CSS.escape(url)}"]`).forEach((x) => {
        x.target = "_blank";
        x.rel = "noopener noreferrer";
      });
    }
    setPop(null);
    emit();
  };
  const unlink = () => {
    const a = linkHere();
    if (a) a.replaceWith(...a.childNodes);
    setPop(null);
    emit();
  };

  const putImage = (src: string) => {
    if (!src) return setPop(null);
    if (img) {
      img.src = src;
      emit();
    } else exec("insertHTML", `<img src="${src.replace(/"/g, "&quot;")}">`);
    setPop(null);
  };
  const removeImage = () => {
    img?.remove();
    setImg(null);
    emit();
  };

  const putTable = (rows: number, cols: number, header: boolean) => {
    exec("insertHTML", darkTable(rows, cols, header));
    setPop(null);
  };
  const tableOp = (op: "row" | "col" | "delRow" | "delCol" | "delete") => {
    const c = cell;
    const table = c?.closest("table") as HTMLTableElement | null;
    if (!c || !table) return;
    const tr = c.parentElement as HTMLTableRowElement;
    const at = c.cellIndex;
    if (op === "delete") {
      table.remove();
      setCell(null);
    } else if (op === "row") {
      const next = document.createElement("tr");
      for (const old of tr.cells) {
        const n = document.createElement(old.tagName === "TH" && tr.parentElement?.tagName === "THEAD" ? "td" : old.tagName);
        n.setAttribute("style", old.getAttribute("style") ?? "");
        n.innerHTML = "<br>";
        next.appendChild(n);
      }
      // a row added under the header goes at the top of the body
      if (tr.parentElement?.tagName === "THEAD") (table.tBodies[0] ?? table.createTBody()).prepend(next);
      else tr.after(next);
    } else if (op === "col") {
      for (const r of table.rows) {
        const ref = r.cells[Math.min(at, r.cells.length - 1)];
        const n = document.createElement(ref.tagName);
        n.setAttribute("style", ref.getAttribute("style") ?? "");
        n.innerHTML = "<br>";
        ref.after(n);
      }
    } else if (op === "delRow") {
      if (table.rows.length <= 1) table.remove();
      else tr.remove();
      setCell(null);
    } else if (op === "delCol") {
      if ((table.rows[0]?.cells.length ?? 0) <= 1) table.remove();
      else for (const r of table.rows) r.cells[at]?.remove();
      setCell(null);
    }
    if (table.isConnected) restyle(table);
    emit();
  };

  // text before the caret in its block (for the / menu and the Markdown shortcuts)
  const before = (): { text: string; range: Range } | null => {
    const s = getSelection();
    if (!s || !s.rangeCount || !s.isCollapsed || !inside(s.anchorNode)) return null;
    const r = s.getRangeAt(0);
    const node = r.startContainer.nodeType === 1 ? (r.startContainer as Element) : r.startContainer.parentElement;
    const b = node?.closest(BLOCK) ?? ed.current!;
    const pre = document.createRange();
    pre.selectNodeContents(b);
    pre.setEnd(r.startContainer, r.startOffset);
    return { text: pre.toString(), range: pre };
  };
  const dropTyped = (n: number) => {
    const s = getSelection();
    if (!s || !s.rangeCount) return;
    for (let i = 0; i < n; i++) s.modify("extend", "backward", "character");
    s.getRangeAt(0).deleteContents();
  };

  const slashMatches = slash ? BLOCKS.filter((b) => !slash.q || b.label.toLowerCase().includes(slash.q) || b.id.startsWith(slash.q)) : [];
  const pickSlash = (b: Block) => {
    dropTyped((slash?.q.length ?? 0) + 1);
    setSlash(null);
    remember();
    block(b.id);
  };

  const state = (cmd: string) => {
    try {
      return document.queryCommandState(cmd);
    } catch {
      return false;
    }
  };
  const curType = () => {
    const n = saved.current ? (saved.current.startContainer.nodeType === 1 ? (saved.current.startContainer as Element) : saved.current.startContainer.parentElement) : null;
    const b = n?.closest("h1,h2,h3,h4,blockquote,pre");
    return TYPES.find((t) => t.tag === b?.tagName.toLowerCase())?.label ?? "Text";
  };

  return (
    <div
      className="nv-rich"
      ref={wrap}
      onBlur={(e) => {
        // leaving the editor and its bars applies the edit
        if (!wrap.current?.contains(e.relatedTarget as Node | null)) {
          setSlash(null);
          setBar(null);
          setPop(null);
          setImg(null);
          commit();
        }
      }}
      onKeyDown={(e) => {
        // keep the canvas's shortcuts out of the editor
        e.stopPropagation();
        if (slash) {
          if (e.key === "Enter" && slashMatches.length) {
            e.preventDefault();
            pickSlash(slashMatches[Math.min(slash.active, slashMatches.length - 1)]);
          } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            const d = e.key === "ArrowDown" ? 1 : -1;
            setSlash({ ...slash, active: (slash.active + d + slashMatches.length) % Math.max(1, slashMatches.length) });
          } else if (e.key === "Escape") setSlash(null);
          return;
        }
        if (e.key === "Escape") {
          setBar(null);
          setPop(null);
          setImg(null);
        }
        if (e.key === " " && e.target === ed.current) {
          const b = before();
          const id = b && MARKS[b.text];
          if (id) {
            e.preventDefault();
            b.range.deleteContents();
            remember();
            block(id);
          }
        }
      }}
    >
      <div
        ref={ed}
        className={`nv-rich-body ql-editor ${empty ? "is-empty" : ""}`}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline
        data-placeholder={props.placeholder ?? "Type, or press / for blocks"}
        onInput={() => {
          emit();
          const b = before();
          const m = b && /(^|\s)\/([a-z0-9]*)$/i.exec(b.text);
          if (m && b) {
            const s = getSelection()!;
            const p = rel(s.getRangeAt(0).getBoundingClientRect());
            setSlash({ top: p.bottom + 4, left: Math.max(0, p.left - 10), q: m[2].toLowerCase(), active: 0 });
          } else setSlash(null);
        }}
        onClick={(e) => {
          const t = e.target as HTMLElement;
          ed.current?.querySelectorAll(".nv-rich-picked").forEach((x) => x.classList.remove("nv-rich-picked"));
          if (t.tagName === "IMG") {
            t.classList.add("nv-rich-picked");
            setImg(t as HTMLImageElement);
            setBar(null);
          } else setImg(null);
        }}
        onPaste={(e) => {
          // pasted text keeps its words, not another page's look; pasted pictures come in as Saturn's do
          const file = [...e.clipboardData.files].find((f) => f.type.startsWith("image/"));
          if (file) {
            e.preventDefault();
            const reader = new FileReader();
            reader.onload = () => exec("insertHTML", `<img src="${reader.result}">`);
            reader.readAsDataURL(file);
          }
        }}
      />

      {bar && !img && (
        <div ref={barRef} className={`nv-rich-bar ${bar.below ? "is-below" : ""}`} style={{ top: bar.below ? bar.top + 26 : bar.top - 40 }} onMouseDown={(e) => e.target instanceof HTMLInputElement || e.preventDefault()} role="toolbar" aria-label="Format the picked text">
          <button type="button" className="nv-rich-menu" aria-haspopup="menu" aria-expanded={pop === "type"} onClick={() => setPop(pop === "type" ? null : "type")}>
            {curType()} <FaIcon name="chevron-down" title={false} />
          </button>
          <span className="nv-rich-sep" />
          <Tool icon="bold" title="Bold (Ctrl+B)" on={state("bold")} onClick={() => exec("bold")} />
          <Tool icon="italic" title="Italic (Ctrl+I)" on={state("italic")} onClick={() => exec("italic")} />
          <Tool icon="underline" title="Underline (Ctrl+U)" on={state("underline")} onClick={() => exec("underline")} />
          <Tool icon="strikethrough" title="Strike through" on={state("strikeThrough")} onClick={() => exec("strikeThrough")} />
          <Tool icon="link" title={linkHere() ? "Edit or remove the link" : "Link"} on={!!linkHere()} onClick={() => setPop(pop === "link" ? null : "link")} />
          <Tool icon="palette" title="Colour and highlight" on={pop === "colour"} onClick={() => setPop(pop === "colour" ? null : "colour")} />
          <span className="nv-rich-sep" />
          <Tool icon="list-ul" title="Bulleted list" on={state("insertUnorderedList")} onClick={() => exec("insertUnorderedList")} />
          <Tool icon="list-ol" title="Numbered list" on={state("insertOrderedList")} onClick={() => exec("insertOrderedList")} />
          <Tool icon="align-left" title="Align left" on={false} onClick={() => align(null)} />
          <Tool icon="align-center" title="Align centre" on={false} onClick={() => align("center")} />
          <Tool icon="align-right" title="Align right" on={false} onClick={() => align("right")} />
          <Tool icon="outdent" title="Indent less" on={false} onClick={() => indent(-1)} />
          <Tool icon="indent" title="Indent more" on={false} onClick={() => indent(1)} />
          <Tool icon="text-height" title="Line spacing" on={pop === "spacing"} onClick={() => setPop(pop === "spacing" ? null : "spacing")} />
          <span className="nv-rich-sep" />
          <Tool icon="eraser" title="Clear formatting" on={false} onClick={() => exec("removeFormat")} />

          {pop === "type" && (
            <div className="nv-rich-pop" role="menu">
              {TYPES.map((t) => (
                <button key={t.id} type="button" role="menuitem" className="nv-rich-item" onClick={() => setType(t.id)}>
                  {t.label}
                </button>
              ))}
            </div>
          )}
          {pop === "spacing" && (
            <div className="nv-rich-pop is-right" role="menu">
              {SPACINGS.map((v) => (
                <button key={v} type="button" role="menuitem" className="nv-rich-item" onClick={() => spacing(v)}>
                  {Number(v).toFixed(1)}
                </button>
              ))}
            </div>
          )}
          {pop === "colour" && (
            <div className="nv-rich-pop is-palette">
              <span className="nv-rich-pal-title">Text</span>
              <div className="nv-rich-swatches">
                {COLOURS.map((c) => (
                  <button key={"c" + c} type="button" className="nv-rich-swatch" title={c || "Default text colour"} aria-label={c ? `Text ${c}` : "Default text colour"} onClick={() => exec("foreColor", c || "inherit", true)}>
                    <span style={{ color: c || undefined }}>A</span>
                  </button>
                ))}
              </div>
              <span className="nv-rich-pal-title">Highlight</span>
              <div className="nv-rich-swatches">
                {HIGHLIGHTS.map((c) => (
                  <button key={"b" + c} type="button" className="nv-rich-swatch" title={c || "No highlight"} aria-label={c ? `Highlight ${c}` : "No highlight"} style={{ background: c || undefined }} onClick={() => exec("hiliteColor", c || "transparent", true)} />
                ))}
              </div>
            </div>
          )}
          {pop === "link" && <AskUrl kind="link" initial={linkHere()?.getAttribute("href") ?? ""} canRemove={!!linkHere()} onDone={(v) => (v === null ? setPop(null) : setLink(v))} onRemove={unlink} />}
        </div>
      )}

      {img && (
        <div className="nv-rich-bar is-fixed" onMouseDown={(e) => e.target instanceof HTMLInputElement || e.preventDefault()} role="toolbar" aria-label="The picked picture">
          <span className="nv-rich-note">Picture</span>
          <Tool icon="link" title="Change the picture" on={pop === "image"} onClick={() => setPop(pop === "image" ? null : "image")} label="Change" />
          <Tool icon="trash-can" title="Remove the picture" on={false} onClick={removeImage} label="Remove" />
          {pop === "image" && <AskImage onDone={putImage} initial={img.src.startsWith("data:") ? "" : img.getAttribute("src") ?? ""} />}
        </div>
      )}

      {cell && !bar && !img && (
        <div className="nv-rich-bar is-fixed" onMouseDown={(e) => e.preventDefault()} role="toolbar" aria-label="The table">
          <span className="nv-rich-note">Table</span>
          <Tool icon="plus" title="Add a row below" on={false} onClick={() => tableOp("row")} label="Row" />
          <Tool icon="plus" title="Add a column to the right" on={false} onClick={() => tableOp("col")} label="Column" />
          <Tool icon="minus" title="Delete this row" on={false} onClick={() => tableOp("delRow")} label="Row" />
          <Tool icon="minus" title="Delete this column" on={false} onClick={() => tableOp("delCol")} label="Column" />
          <span className="nv-rich-sep" />
          <Tool icon="trash-can" title="Delete the table" on={false} onClick={() => tableOp("delete")} label="Delete table" />
        </div>
      )}

      {!bar && !img && pop === "image" && (
        <div className="nv-rich-bar is-fixed" onMouseDown={(e) => e.target instanceof HTMLInputElement || e.preventDefault()}>
          <AskImage onDone={putImage} initial="" />
        </div>
      )}
      {!bar && pop === "table" && <TablePicker onPick={putTable} onCancel={() => setPop(null)} />}

      {slash && slashMatches.length > 0 && (
        <div className="nv-rich-slash" style={{ top: slash.top, left: slash.left }} onMouseDown={(e) => e.preventDefault()} role="listbox" aria-label="Blocks">
          {slashMatches.map((b, i) => (
            <button key={b.id} type="button" role="option" aria-selected={i === slash.active} className={`nv-rich-block ${i === slash.active ? "is-first" : ""}`} onClick={() => pickSlash(b)}>
              <FaIcon name={b.icon} title={false} />
              <span>{b.label}</span>
              <code>{b.hint}</code>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Tool(props: { icon: string; title: string; on: boolean; onClick: () => void; label?: string }) {
  return (
    <button type="button" className={`nv-rich-tool ${props.on ? "is-on" : ""}`} title={props.title} aria-label={props.title} aria-pressed={props.on} onClick={props.onClick}>
      <FaIcon name={props.icon} title={false} />
      {props.label && <span>{props.label}</span>}
    </button>
  );
}

/** A link's address, typed in a small box (VS Code's webviews have no prompt()); Remove takes the link off. */
function AskUrl(props: { kind: "link"; initial: string; canRemove: boolean; onDone: (text: string | null) => void; onRemove: () => void }) {
  const [text, setText] = useState(props.initial);
  return (
    <div className="nv-rich-pop is-ask">
      <input
        autoFocus
        value={text}
        placeholder="Paste a link"
        aria-label="Link"
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          e.stopPropagation();
          if (e.key === "Enter") {
            e.preventDefault();
            props.onDone(text.trim());
          } else if (e.key === "Escape") props.onDone(null);
        }}
      />
      <button type="button" className="nv-mini-btn" onClick={() => props.onDone(text.trim())}>
        {props.initial ? "Change" : "Link"}
      </button>
      {props.canRemove && (
        <button type="button" className="nv-mini-btn" onClick={props.onRemove} title="Remove the link, keep the text">
          <FaIcon name="link-slash" title={false} /> Unlink
        </button>
      )}
    </div>
  );
}

/** A picture: from a link, or a file from this computer (kept inside the note as a data: address, as Saturn does). */
function AskImage(props: { initial: string; onDone: (src: string) => void }) {
  const [text, setText] = useState(props.initial);
  const file = useRef<HTMLInputElement>(null);
  return (
    <div className="nv-rich-pop is-ask">
      <input
        autoFocus
        value={text}
        placeholder="Paste a picture's link"
        aria-label="Picture link"
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          e.stopPropagation();
          if (e.key === "Enter") {
            e.preventDefault();
            props.onDone(text.trim());
          } else if (e.key === "Escape") props.onDone("");
        }}
      />
      <button type="button" className="nv-mini-btn" onClick={() => props.onDone(text.trim())}>
        Use link
      </button>
      <button type="button" className="nv-mini-btn" onClick={() => file.current?.click()}>
        <FaIcon name="upload" title={false} /> Upload
      </button>
      <input
        ref={file}
        type="file"
        accept="image/*"
        hidden
        aria-label="Picture file"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (!f) return;
          const reader = new FileReader();
          reader.onload = () => props.onDone(String(reader.result));
          reader.readAsDataURL(f);
        }}
      />
    </div>
  );
}

/** Saturn's Insert table: hover a grid for rows by columns (or type them), Include header. */
function TablePicker(props: { onPick: (rows: number, cols: number, header: boolean) => void; onCancel: () => void }) {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [header, setHeader] = useState(true);
  const N = 10;
  return (
    <div className="nv-rich-table" role="dialog" aria-label="Insert table" onMouseDown={(e) => e.target instanceof HTMLInputElement || e.preventDefault()}>
      <div className="nv-rich-table-row">
        <label>
          Rows <input type="number" min={1} max={30} value={rows} onChange={(e) => setRows(Math.max(1, Math.min(30, Number(e.target.value) || 1)))} />
        </label>
        <label>
          Columns <input type="number" min={1} max={12} value={cols} onChange={(e) => setCols(Math.max(1, Math.min(12, Number(e.target.value) || 1)))} />
        </label>
        <label className="nv-rich-check">
          <input type="checkbox" checked={header} onChange={(e) => setHeader(e.target.checked)} /> Include header
        </label>
      </div>
      <div className="nv-rich-grid" style={{ gridTemplateColumns: `repeat(${N}, 14px)` }}>
        {Array.from({ length: N * N }, (_, i) => {
          const r = Math.floor(i / N) + 1, c = (i % N) + 1;
          return (
            <button
              key={i}
              type="button"
              aria-label={`${r} by ${c}`}
              className={`nv-rich-gridcell ${r <= rows && c <= cols ? "is-on" : ""}`}
              onMouseEnter={() => {
                setRows(r);
                setCols(c);
              }}
              onClick={() => props.onPick(r, c, header)}
            />
          );
        })}
      </div>
      <div className="nv-rich-table-row">
        <span className="nv-rich-note">
          {rows} × {cols} table · Dark Header
        </span>
        <span className="nv-spacer" />
        <button type="button" className="nv-mini-btn" onClick={props.onCancel}>
          Cancel
        </button>
        <button type="button" className="nv-mini-btn is-primary" onClick={() => props.onPick(rows, cols, header)}>
          Insert
        </button>
      </div>
    </div>
  );
}
