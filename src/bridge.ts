// Shares the webview's single VS Code API handle with the existing Workflows
// bundle. acquireVsCodeApi() may only be called once per webview, so this
// script runs first, takes the handle, and hands the same (wrapped) object to
// the original bundle when it asks for it.
//
// The wrapper also watches which workflow the list editor opens, so the node
// view always follows the user's current selection, and keeps the node view's
// own saved state in a separate key the list editor never overwrites.

declare global {
  interface Window {
    acquireVsCodeApi: () => VsCodeApi;
  }
}
interface VsCodeApi {
  postMessage(msg: unknown): void;
  getState(): any;
  setState(state: any): any;
}

const NV_KEY = "__sonoverNodeView";

const real: VsCodeApi = window.acquireVsCodeApi();
const rawPost = real.postMessage.bind(real);

let currentWorkflowId: string | null = null;
const selectionListeners = new Set<(id: string | null) => void>();

function setCurrent(id: string | null) {
  if (id === currentWorkflowId) return;
  currentWorkflowId = id;
  selectionListeners.forEach((l) => l(id));
}

function noteOutgoing(msg: any) {
  if (msg && msg.type === "fetchWorkflow" && msg.payload?.workflowId != null) setCurrent(String(msg.payload.workflowId));
}

/**
 * The list view records the open workflow in its saved state:
 * setState({ selected }) when it opens one, setState({}) when it goes back
 * to the list or the workflow is deleted. (It also refreshes the workflow
 * list while one is open, so that is not a signal.)
 */
function noteState(state: any) {
  const sel = state && typeof state === "object" ? state.selected : null;
  setCurrent(sel && typeof sel.id === "string" ? sel.id : null);
}

const shared: VsCodeApi = {
  postMessage(msg: any) {
    noteOutgoing(msg);
    // The list view's Disable/Enable button doesn't know the workflow id;
    // fill in the one that's open.
    if (msg && msg.type === "setStepMock" && msg.payload && msg.payload.workflowId == null && currentWorkflowId)
      msg = { ...msg, payload: { ...msg.payload, workflowId: currentWorkflowId } };
    return rawPost(msg);
  },
  getState() {
    const s = real.getState();
    if (!s || typeof s !== "object") return s;
    const { [NV_KEY]: _mine, ...rest } = s;
    return Object.keys(rest).length ? rest : undefined;
  },
  setState(state) {
    const cur = real.getState() || {};
    real.setState({ ...(state || {}), [NV_KEY]: cur[NV_KEY] });
    noteState(state);
    return state;
  },
};

window.acquireVsCodeApi = () => shared;

export function send(type: string, payload?: unknown) {
  try {
    rawPost({ type, payload });
  } catch (e) {
    // postMessage never throws in a real webview; never let a host hiccup take the view down
    console.warn("[node view] could not send", type, e);
  }
}

export function getCurrentWorkflowId() {
  return currentWorkflowId;
}

export function onSelectionChange(fn: (id: string | null) => void) {
  selectionListeners.add(fn);
  return () => selectionListeners.delete(fn);
}

export function loadNodeViewState<T>(fallback: T): T {
  try {
    const s = real.getState();
    return (s && s[NV_KEY]) ?? fallback;
  } catch {
    return fallback;
  }
}

export function saveNodeViewState(value: unknown) {
  try {
    const cur = real.getState() || {};
    real.setState({ ...cur, [NV_KEY]: value });
  } catch {
    /* state is a convenience only */
  }
}
