// Stand-in for the original list-view bundle (wf.js, from the .vsix) when it
// isn't at hand: just enough for the node view — it asks for the workflow
// list, and opens a workflow when the node view asks (the `sonover:openWorkflow`
// hook patch.py adds to the real list view), recording it in its saved state
// the way the real one does.
(function () {
  const api = window.acquireVsCodeApi();
  api.postMessage({ type: "fetchWorkflows" });
  const open = (w) => {
    if (!w || typeof w.id !== "string") return;
    api.setState({ selected: w });
    api.postMessage({ type: "fetchWorkflow", payload: { workflowId: w.id } });
  };
  const sel = api.getState()?.selected;
  if (sel) open(sel);
  window.addEventListener("sonover:openWorkflow", (e) => open(e.detail));
})();
