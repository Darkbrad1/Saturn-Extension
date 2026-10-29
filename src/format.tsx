// Format (0.3.70): tidies a code setting the way Prettier does, in the node view's side panel and on the Resources
// screen and Form tab. Saturn's code is often a bare function, `async function (flow, {...}) { ... }` or
// `({_store}) => ...`, which isn't a program on its own, so it's formatted in brackets and taken out again. HTML and
// Vue templates (component code, dropdown templates) use Prettier's Vue printer; JSON is laid out with two spaces.
import { useState } from "react";
import { format } from "prettier/standalone";
import * as babel from "prettier/plugins/babel";
import * as estree from "prettier/plugins/estree";
import * as html from "prettier/plugins/html";

const plugins = [babel, estree, html];

/** The code formatted, or an error saying why it couldn't be. */
export async function formatCode(code: string, lang?: string | null): Promise<string> {
  const text = code.trim();
  if (!text) return code;
  const l = (lang ?? "").toLowerCase();
  if (l === "json" || (!l && /^[[{]/.test(text) && isJson(text))) return JSON.stringify(JSON.parse(text), null, 2);
  if (/html|vue|template/.test(l) || (!/js|javascript|typescript/.test(l) && /^</.test(text))) {
    return (await format(text, { parser: "vue", plugins, printWidth: 100, htmlWhitespaceSensitivity: "ignore" })).trimEnd();
  }
  const opts = { parser: "babel", plugins, printWidth: 100, semi: true };
  try {
    return (await format(text, opts)).trimEnd();
  } catch {
    // a bare function or arrow: format it as an expression, then take the brackets off again
    const out = (await format(`(${text})`, opts)).trimEnd();
    return out.replace(/^\(/, "").replace(/\);?$/, "");
  }
}

function isJson(t: string) {
  try {
    JSON.parse(t);
    return true;
  } catch {
    return false;
  }
}

/** The Format button: tidies the code, or says (on hover and in red) why it can't. */
export function FormatButton(props: { value: string; lang?: string | null; disabled?: boolean; className?: string; onFormatted: (code: string) => void }) {
  const [problem, setProblem] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  return (
    <span className="nv-format">
      <button
        type="button"
        className={props.className ?? "nv-link"}
        disabled={props.disabled || busy || !props.value.trim()}
        title={problem ?? "Lay the code out neatly, like Prettier"}
        onClick={async (e) => {
          e.preventDefault();
          setBusy(true);
          try {
            const out = await formatCode(props.value, props.lang);
            setProblem(null);
            if (out !== props.value) props.onFormatted(out);
          } catch (err) {
            setProblem(`Can't format it: ${String(err instanceof Error ? err.message : err).split("\n")[0]}`);
          } finally {
            setBusy(false);
          }
        }}
      >
        {busy ? "Formatting…" : "Format"}
      </button>
      {problem && <span className="nv-format-problem">{problem}</span>}
    </span>
  );
}
