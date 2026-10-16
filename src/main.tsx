// Must be first: takes the webview's VS Code API handle before the
// Workflows bundle asks for it.
import "./bridge";
import { createRoot } from "react-dom/client";
import flowCss from "@xyflow/react/dist/style.css";
import ownCss from "./styles.css";
import { App } from "./App";

function mount() {
  const style = document.createElement("style");
  style.textContent = flowCss + "\n" + ownCss;
  document.head.appendChild(style);
  const host = document.createElement("div");
  host.id = "sonover-node-view";
  document.body.appendChild(host);
  createRoot(host).render(<App />);
}

if (document.body) mount();
else document.addEventListener("DOMContentLoaded", mount);
