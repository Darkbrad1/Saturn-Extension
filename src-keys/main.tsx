// The Keyboard shortcuts page: every shortcut of the node view, the Resources screen and the Menus screen, with
// its keys. Add a key (press it), take one off (×), or put a shortcut back to its default. A key another shortcut
// on the same screen already uses is refused, saying which one has it. Opened from the sidebar's Keyboard
// shortcuts button or the "Saturn: Keyboard shortcuts" command; the extension keeps the keys (host/shortcuts.js)
// and every open screen picks up a change at once.
import { createRoot } from "react-dom/client";
import { useEffect, useState } from "react";
import { SCREENS, SHORTCUTS, clashOf, comboOf, keysOf, listenForShortcuts, shown, type Bindings } from "../src/keys";
import css from "./keys.css";

declare function acquireVsCodeApi(): { postMessage: (m: unknown) => void };
const vscode = acquireVsCodeApi();
const send = (type: string, payload: Record<string, unknown> = {}) => vscode.postMessage({ type, payload });

const style = document.createElement("style");
style.textContent = css;
document.head.appendChild(style);

const same = (a: string[], b: string[]) => a.join("|").toLowerCase() === b.join("|").toLowerCase();

function App() {
  const [bindings, setBindings] = useState<Bindings | null>(null);
  const [query, setQuery] = useState("");
  // the shortcut waiting for a key press, and what went wrong with the last one
  const [recording, setRecording] = useState<string | null>(null);
  const [problem, setProblem] = useState<{ id: string; text: string } | null>(null);
  useEffect(() => listenForShortcuts(send, setBindings), []);

  /** Keeps a shortcut's keys (dropping it from the list when they're its default again) and sends them all. */
  const save = (id: string, keys: string[]) => {
    const next: Bindings = { ...(bindings ?? {}) };
    const def = SHORTCUTS.find((s) => s.id === id)!.keys;
    if (same(keys, def)) delete next[id];
    else next[id] = keys;
    setBindings(next);
    send("setShortcuts", { bindings: next });
  };

  // while recording: the next key press (Esc cancels)
  useEffect(() => {
    if (!recording) return;
    const onKey = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.key === "Escape") return setRecording(null);
      const combo = comboOf(e);
      if (!combo) return;
      const id = recording;
      setRecording(null);
      const keys = keysOf(id, bindings);
      if (keys.some((k) => k.toLowerCase() === combo.toLowerCase())) return setProblem({ id, text: `${shown(combo)} is already one of its keys.` });
      const clash = clashOf(id, combo, bindings);
      if (clash) return setProblem({ id, text: `${shown(combo)} is already used by "${clash.label}". Take it off there first.` });
      setProblem(null);
      save(id, [...keys, combo]);
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  });

  const q = query.trim().toLowerCase();
  const changed = SHORTCUTS.filter((s) => bindings?.[s.id]).length;
  return (
    <div className="ks-page">
      <header className="ks-head">
        <h1>Keyboard shortcuts</h1>
        <p>Click + and press the keys you want. A key works when you're not typing in a box. Changes apply to open screens straight away.</p>
        <div className="ks-tools">
          <input className="ks-search" placeholder="Search shortcuts or keys" aria-label="Search shortcuts" value={query} onChange={(e) => setQuery(e.target.value)} />
          <button className="ks-btn" disabled={!changed} onClick={() => { setBindings({}); send("setShortcuts", { bindings: {} }); setProblem(null); }}>
            Reset all{changed ? ` (${changed})` : ""}
          </button>
        </div>
      </header>
      {!bindings && <p className="ks-none">Loading…</p>}
      {bindings &&
        SCREENS.map((screen) => {
          const rows = SHORTCUTS.filter((s) => s.screen === screen.id && (!q || s.label.toLowerCase().includes(q) || keysOf(s.id, bindings).some((k) => shown(k).toLowerCase().includes(q) || k.toLowerCase().includes(q))));
          if (!rows.length) return null;
          return (
            <section key={screen.id} className="ks-group" aria-label={screen.title}>
              <h2>{screen.title}</h2>
              <div className="ks-card">
                {rows.map((s) => {
                  const keys = keysOf(s.id, bindings);
                  const isChanged = !!bindings[s.id];
                  return (
                    <div key={s.id} className={`ks-row${isChanged ? " is-changed" : ""}`} data-id={s.id}>
                      <div className="ks-text">
                        <span className="ks-label">{s.label}</span>
                        {isChanged && <span className="ks-was">Default: {s.keys.map(shown).join(", ")}</span>}
                        {problem?.id === s.id && <span className="ks-problem" role="alert">{problem.text}</span>}
                      </div>
                      <div className="ks-keys">
                        {keys.map((k) => (
                          <span key={k} className="ks-key">
                            <kbd>{shown(k)}</kbd>
                            <button className="ks-x" aria-label={`Take ${shown(k)} off`} title="Take this key off" onClick={() => { setProblem(null); save(s.id, keys.filter((x) => x !== k)); }}>×</button>
                          </span>
                        ))}
                        {!keys.length && <span className="ks-off">No key</span>}
                        <button className={`ks-btn ks-add${recording === s.id ? " is-recording" : ""}`} aria-label={`Add a key to ${s.label}`} onClick={() => { setProblem(null); setRecording(recording === s.id ? null : s.id); }}>
                          {recording === s.id ? "Press a key… (Esc cancels)" : "+"}
                        </button>
                        {isChanged && <button className="ks-btn" onClick={() => { setProblem(null); save(s.id, s.keys); }}>Reset</button>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      <p className="ks-note">Escape (close or let go of things), arrow keys in lists, and Alt+↑/↓ to move things keep their keys.</p>
    </div>
  );
}

createRoot(document.getElementById("keys-root")!).render(<App />);
