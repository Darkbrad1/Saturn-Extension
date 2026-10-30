// Keyboard shortcuts: every shortcut that can be changed, by screen, with its default keys, and the helpers to
// match a key press against them. Shared by the node view, the Resources screen, the Menus screen and the
// Keyboard shortcuts page (src-keys/). The keys you pick are kept by the extension (host/shortcuts.js,
// globalState "saturn.shortcuts" = {id: [combo, …]}) and sent to every screen as `shortcuts {bindings}`.
//
// A combo is text like "Shift+A", "Mod+Z" (Ctrl, or Cmd on a Mac), "Alt+ArrowLeft", "Delete" or "/".

export type Screen = "node" | "resources" | "menus";
export interface Shortcut { id: string; screen: Screen; label: string; keys: string[] }

export const SCREENS: { id: Screen; title: string }[] = [
  { id: "node", title: "Node view (Workflows)" },
  { id: "resources", title: "Resources" },
  { id: "menus", title: "Menus" },
];

export const SHORTCUTS: Shortcut[] = [
  { id: "node.add", screen: "node", label: "Add a step", keys: ["Shift+A"] },
  { id: "node.duplicate", screen: "node", label: "Duplicate the picked steps", keys: ["Shift+D"] },
  { id: "node.disable", screen: "node", label: "Disable or enable the picked steps", keys: ["M"] },
  { id: "node.delete", screen: "node", label: "Delete the picked steps", keys: ["X", "Delete", "Backspace"] },
  { id: "node.copy", screen: "node", label: "Copy the picked steps", keys: ["Mod+C"] },
  { id: "node.selectAll", screen: "node", label: "Pick every step in view", keys: ["Mod+A"] },
  { id: "node.paste", screen: "node", label: "Paste", keys: ["Mod+V"] },
  { id: "node.undo", screen: "node", label: "Undo", keys: ["Mod+Z"] },
  { id: "node.save", screen: "node", label: "Save the workflow", keys: ["Mod+S"] },
  { id: "node.search", screen: "node", label: "Search the workflow", keys: ["Mod+F", "/"] },
  { id: "node.edit", screen: "node", label: "Edit the picked step", keys: ["Enter", "F2"] },
  { id: "node.open", screen: "node", label: "Open a command or group (or go back)", keys: ["Tab"] },
  { id: "node.fit", screen: "node", label: "Fit everything in view", keys: ["Home"] },
  { id: "node.panel", screen: "node", label: "Hide or show the side panel", keys: ["N"] },
  { id: "node.layers", screen: "node", label: "Hide or show the layers panel", keys: ["T"] },
  { id: "resources.list", screen: "resources", label: "Hide or show the properties list", keys: ["T"] },
  { id: "resources.back", screen: "resources", label: "Back to where you came from", keys: ["Alt+ArrowLeft"] },
  { id: "menus.list", screen: "menus", label: "Hide or show the menus list", keys: ["T"] },
  { id: "menus.undo", screen: "menus", label: "Undo the last unsaved change", keys: ["Mod+Z"] },
  { id: "menus.redo", screen: "menus", label: "Redo", keys: ["Mod+Shift+Z", "Mod+Y"] },
];

export type Bindings = Record<string, string[]>;

/** The keys for a shortcut: the ones you picked, else its default. */
export function keysOf(id: string, bindings: Bindings | null | undefined): string[] {
  return bindings?.[id] ?? SHORTCUTS.find((s) => s.id === id)?.keys ?? [];
}

const NAMED: Record<string, string> = { " ": "Space", Esc: "Escape", Del: "Delete", Left: "ArrowLeft", Right: "ArrowRight", Up: "ArrowUp", Down: "ArrowDown" };
const isLetter = (k: string) => /^[a-z]$/i.test(k);

/** The combo a key press makes, or null for a lone Ctrl / Shift / Alt / Cmd. */
export function comboOf(e: Pick<KeyboardEvent, "key" | "ctrlKey" | "metaKey" | "altKey" | "shiftKey">): string | null {
  if (["Control", "Shift", "Alt", "Meta", "OS", "CapsLock"].includes(e.key)) return null;
  let key = NAMED[e.key] ?? e.key;
  if (key.length === 1) key = key.toUpperCase();
  const parts: string[] = [];
  if (e.ctrlKey || e.metaKey) parts.push("Mod");
  if (e.altKey) parts.push("Alt");
  // Shift counts for letters and named keys; for a sign like "/" or "?" it's part of how the sign is typed
  if (e.shiftKey && (key.length > 1 || isLetter(key))) parts.push("Shift");
  parts.push(key);
  return parts.join("+");
}

/** Whether a key press is one of the shortcut's keys. */
export function pressed(e: KeyboardEvent, id: string, bindings: Bindings | null | undefined): boolean {
  const combo = comboOf(e);
  return !!combo && keysOf(id, bindings).some((k) => k.toLowerCase() === combo.toLowerCase());
}

/** A combo as people read it: "Ctrl+Z" (or "⌘Z" on a Mac), "Alt+←". */
export function shown(combo: string): string {
  const mac = typeof navigator !== "undefined" && /Mac/.test(navigator.platform);
  const arrows: Record<string, string> = { ArrowLeft: "←", ArrowRight: "→", ArrowUp: "↑", ArrowDown: "↓" };
  return combo
    .split("+")
    .map((p) => (p === "Mod" ? (mac ? "⌘" : "Ctrl") : arrows[p] ?? p))
    .join(mac ? "" : "+")
    .replace(/^⌘\+/, "⌘");
}

/** The first key of a shortcut, for a tooltip: "(T)". */
export const hint = (id: string, bindings: Bindings | null | undefined) => {
  const k = keysOf(id, bindings)[0];
  return k ? ` (${shown(k)})` : "";
};

/** Which other shortcut on the same screen already uses this combo, if any. */
export function clashOf(id: string, combo: string, bindings: Bindings | null | undefined): Shortcut | null {
  const me = SHORTCUTS.find((s) => s.id === id);
  if (!me) return null;
  return SHORTCUTS.find((s) => s.id !== id && s.screen === me.screen && keysOf(s.id, bindings).some((k) => k.toLowerCase() === combo.toLowerCase())) ?? null;
}

/** Listens for the extension's `shortcuts` message and asks for them once; calls back with the bindings. */
export function listenForShortcuts(send: (type: string, payload?: Record<string, unknown>) => void, onBindings: (b: Bindings) => void) {
  const onMessage = (e: MessageEvent) => {
    const { type, payload } = e.data ?? {};
    if (type === "shortcuts" && payload && typeof payload.bindings === "object") onBindings(payload.bindings ?? {});
  };
  window.addEventListener("message", onMessage);
  send("fetchShortcuts", {});
  return () => window.removeEventListener("message", onMessage);
}

/**
 * The mouse's back button (and a keyboard's Browser Back key) calls `back` (0.3.73). The press is stopped so the
 * webview itself never tries to go back a page. Returns the cleanup.
 */
export function onMouseBack(back: () => void) {
  const stop = (e: MouseEvent) => {
    if (e.button === 3 || e.button === 4) e.preventDefault();
  };
  const up = (e: MouseEvent) => {
    if (e.button === 3 || e.button === 4) e.preventDefault();
    if (e.button === 3) back();
  };
  const key = (e: KeyboardEvent) => {
    if (e.key === "BrowserBack") {
      e.preventDefault();
      back();
    }
  };
  window.addEventListener("mousedown", stop, true);
  window.addEventListener("mouseup", up, true);
  window.addEventListener("keydown", key, true);
  return () => {
    window.removeEventListener("mousedown", stop, true);
    window.removeEventListener("mouseup", up, true);
    window.removeEventListener("keydown", key, true);
  };
}
