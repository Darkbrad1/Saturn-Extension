// Favourite settings (added by this project, 0.3.55): the property settings you put in the Favourites section at
// the top of the property editor (the Resources screen and the node view's Form tab). One list for every resource
// and form, kept in globalState "saturn.favouriteSettings" ([setting id, …], ids from src-res/spec.ts settingId) and
// sent to every screen that asks (fetchFavourites → favourites {ids}); setFavourites {ids} keeps a new list and
// sends it to all of them at once. Appended after shortcuts.js in the built extension.js (same scope).
var FavouritesHost = (() => {
  const KEY = "saturn.favouriteSettings";
  let state = null;
  // every screen that asked, so a change reaches them all
  const screens = new Set();

  function attach(options) {
    state = options.globalState ?? null;
  }

  /** Only a list of setting ids (letters, digits, dots, dashes and _), each once, up to 200. */
  function clean(ids) {
    if (!Array.isArray(ids)) return [];
    const out = [];
    for (const id of ids) if (typeof id === "string" && /^[a-z_][a-z0-9_.-]{0,120}$/i.test(id) && !out.includes(id)) out.push(id);
    return out.slice(0, 200);
  }

  /** The favourites, in their order ([] when none). */
  function get() {
    return clean(state?.get(KEY));
  }

  function post(webview) {
    try {
      Promise.resolve(webview.postMessage({ type: "favourites", payload: { ids: get() } })).catch(() => screens.delete(webview));
    } catch {
      screens.delete(webview);
    }
  }

  /** Sends the favourites to one screen (and remembers it, for changes). */
  function send(webview) {
    screens.add(webview);
    post(webview);
  }

  /** Keeps a new list and sends it to every screen. */
  async function set(ids) {
    await state?.update(KEY, clean(ids));
    for (const w of screens) post(w);
  }

  return { attach, get, set, send, clean, screens };
})();
