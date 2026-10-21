// The What's new page: Sonover Code's release notes (src/changelog.ts), newest first, in its own VS Code tab.
// Opened from the sidebar's What's new button or the "Saturn: What's new" command (host/whatsnew.js). Read-only;
// it sends nothing to the host.
import { createRoot } from "react-dom/client";
import { useState } from "react";
import { CHANGELOG } from "../src/changelog";
import css from "./news.css";

const style = document.createElement("style");
style.textContent = css;
document.head.appendChild(style);

function App() {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  // a release shows when its version, title or any of its notes has the search text
  const shown = q ? CHANGELOG.filter((r) => [r.version, r.title, ...r.items].some((t) => t.toLowerCase().includes(q))) : CHANGELOG;
  return (
    <div className="wn-page">
      <header className="wn-head">
        <h1>What's new</h1>
        <p>Sonover Code {CHANGELOG[0]?.version}. Each release's changes, newest first.</p>
        <input className="wn-search" placeholder="Search the release notes" aria-label="Search the release notes" value={query} onChange={(e) => setQuery(e.target.value)} />
      </header>
      {shown.length === 0 && <p className="wn-none">Nothing matches "{query}".</p>}
      {shown.map((r, i) => (
        <details key={r.version} className="wn-release" open={i === 0 || !!q}>
          <summary>
            <span className="wn-version">{r.version}</span>
            <span className="wn-title">{r.title}</span>
            {r.version === CHANGELOG[0]?.version && <span className="wn-badge">Installed</span>}
          </summary>
          <ul>
            {r.items.map((it, j) => <li key={j}>{it}</li>)}
          </ul>
        </details>
      ))}
    </div>
  );
}

createRoot(document.getElementById("news-root")!).render(<App />);
