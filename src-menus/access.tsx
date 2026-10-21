// Access rules: a switch per kind of rule (user groups, users, permissions, a Custom Function), the
// long lists as checkboxes with a search. Rules of other kinds are shown and kept. AccessBox is who can
// see a menu, in a box; AccessRules is the rules alone, also used for a property's access.
import { useState } from "react";
import { Switch } from "../src-res/editor";
import { allowsAll, type RuleRow, type Subject, type Subjects } from "./model";

const EDITORS: { method: string; label: string; kind: "ids" | "code"; source?: "groups" | "users" | "permissions"; hint: string }[] = [
  { method: "user_group", label: "User groups", kind: "ids", source: "groups", hint: "Anyone in a picked group sees the menu." },
  { method: "user", label: "Users", kind: "ids", source: "users", hint: "Named people." },
  { method: "permission", label: "Permissions", kind: "ids", source: "permissions", hint: "Anyone whose group grants a picked permission." },
  { method: "function", label: "Custom Function", kind: "code", hint: "JavaScript that returns true to show the menu." },
];
const STORED_LABEL: Record<string, string> = { user_group: "User Group", user: "User", permission: "Permission", function: "Custom Function" };
const NEW_FUNCTION = "(res) => {\n  //your code comes here\n  return true\n}";

/** The rules themselves: a switch per kind (only `methods`, when given), the long lists as checkboxes
 *  with a search, and rules of other kinds kept and listed. Used by the menus' box and, inline, by a
 *  property's Access setting on the Resources screen and the Form tab. */
export function AccessRules(props: {
  rows: RuleRow[];
  onChange: (rows: RuleRow[]) => void;
  subjects: Subjects | null;
  /** the kinds that can be built here (default: all four) */
  methods?: string[];
  /** a hint per kind, in place of the menus' ones */
  hints?: Record<string, string>;
  /** says what the other rules are */
  othersHint?: string;
  idPrefix?: string;
  disabled?: boolean;
}) {
  const { rows } = props;
  // a kind switched off keeps what it had, so switching it on again brings it back
  const [kept, setKept] = useState<Record<string, string[]>>({});
  const [search, setSearch] = useState<Record<string, string>>({});
  const subjects: Subjects = props.subjects ?? { groups: [], users: [], permissions: [], error: null };
  const loading = props.subjects === null;
  const editors = EDITORS.filter((ed) => !props.methods || props.methods.includes(ed.method));
  const buildable = (method: string) => editors.some((ed) => ed.method === method);
  const ruleOf = (m: string) => rows.find((r) => r.method === m) ?? null;
  const put = (method: string, data: string[]) => {
    const row: RuleRow = { method, label: STORED_LABEL[method], data, known: true };
    const i = rows.findIndex((r) => r.method === method);
    props.onChange(i < 0 ? [...rows, row] : rows.map((r, j) => (j === i ? row : r)));
  };
  const toggle = (method: string, on: boolean, start?: string) => {
    if (!on) {
      const had = ruleOf(method)?.data ?? [];
      if (had.length) setKept((k) => ({ ...k, [method]: had }));
      return props.onChange(rows.filter((r) => r.method !== method));
    }
    put(method, kept[method]?.length ? kept[method] : start ? [start] : []);
  };
  const others = rows.filter((r) => !r.known || !buildable(r.method));
  const nameOf = (id: string) => [...subjects.groups, ...subjects.users, ...subjects.permissions].find((s) => s.id === id)?.name ?? id;
  const prefix = props.idPrefix ?? "mn-acc";

  return (
    <>
      {subjects.error && <p className="pe-error">{subjects.error}</p>}
      <div className="pe-card">
        {editors.map((ed) => {
          const rule = ruleOf(ed.method);
          const on = rule !== null;
          const choices: Subject[] = ed.source ? subjects[ed.source] : [];
          const q = (search[ed.method] ?? "").trim().toLowerCase();
          const matches = q ? choices.filter((c) => `${c.name} ${c.detail ?? ""} ${c.id}`.toLowerCase().includes(q)) : choices;
          // while searching, the picked ones stay at the top
          const shown = q ? [...choices.filter((c) => rule?.data.includes(c.id)), ...matches.filter((c) => !rule?.data.includes(c.id))] : choices;
          const missing = (rule?.data ?? []).filter((id) => !choices.some((c) => c.id === id));
          return (
            <div key={ed.method} className={`pe-row${on ? " is-wide" : ""}`}>
              <div className="mn-row-head">
                <div className="pe-text">
                  <label className="pe-label" htmlFor={`${prefix}-${ed.method}`}>{ed.label}</label>
                  <span className="pe-hint">{props.hints?.[ed.method] ?? ed.hint}{on && ed.kind === "ids" ? ` ${rule!.data.length} picked.` : ""}</span>
                </div>
                <Switch id={`${prefix}-${ed.method}`} on={on} label={ed.label} disabled={props.disabled} onSet={(v) => toggle(ed.method, v, ed.kind === "code" ? NEW_FUNCTION : undefined)} />
              </div>
              {on && ed.kind === "code" && (
                <>
                  <textarea className="pe-input is-mono" rows={6} spellCheck={false} aria-label="Custom Function" disabled={props.disabled} value={rule!.data[0] ?? ""} onChange={(e) => put(ed.method, [e.target.value])} />
                  {allowsAll(rule!.data[0] ?? "") && <span className="mn-warn-text">This returns true for everyone, so it hides the menu from nobody until you change it.</span>}
                </>
              )}
              {on && ed.kind === "ids" && (
                loading ? <span className="pe-hint">Reading the instance’s {ed.label.toLowerCase()}…</span>
                : !choices.length ? <span className="pe-hint">{subjects.error ? "Not available (see above)." : `The instance has no ${ed.label.toLowerCase()}.`}</span>
                : (
                  <div className="pe-picks">
                    {choices.length >= 8 && <input className="pe-input" placeholder={`Search ${choices.length} ${ed.label.toLowerCase()}`} aria-label={`Search ${ed.label.toLowerCase()}`} value={search[ed.method] ?? ""} onChange={(e) => setSearch((s) => ({ ...s, [ed.method]: e.target.value }))} />}
                    <div className="pe-picks-list">
                      {!shown.length && <span className="pe-hint">Nothing matches.</span>}
                      {shown.map((c) => (
                        <label key={c.id} className="pe-pick">
                          <input type="checkbox" disabled={props.disabled} checked={rule!.data.includes(c.id)} onChange={() => put(ed.method, rule!.data.includes(c.id) ? rule!.data.filter((x) => x !== c.id) : [...rule!.data, c.id])} />
                          <span>{c.name}</span>
                          {c.detail && <code>{c.detail}</code>}
                        </label>
                      ))}
                    </div>
                    {rule!.data.length === 0 && <span className="mn-warn-text">Nothing picked, so nobody matches this rule yet.</span>}
                    {missing.length > 0 && <span className="mn-warn-text">Not on this instance: {missing.join(", ")}</span>}
                  </div>
                )
              )}
            </div>
          );
        })}
      </div>
      {others.length > 0 && (
        <div className="pe-card is-pad">
          <div className="pe-label">Other rules</div>
          <span className="pe-hint">{props.othersHint ?? "Kept exactly as Saturn wrote them. This screen can't build these; set them up in Saturn."}</span>
          {others.map((r, i) => (
            <div key={`${r.method}-${i}`} className="mn-other">
              <span>{r.label ?? r.method} <code>{r.method}</code>{r.data.length > 0 && <small>{r.data.map(nameOf).join(", ")}</small>}</span>
              <button type="button" className="rs-x" disabled={props.disabled} title="Remove this rule" aria-label={`Remove the ${r.label ?? r.method} rule`} onClick={() => props.onChange(rows.filter((x) => x !== r))}>×</button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export function AccessBox(props: { menuLabel: string; rules: RuleRow[]; subjects: Subjects | null; onCancel: () => void; onDone: (rows: { method: string; data: string[] }[]) => void }) {
  const [rows, setRows] = useState<RuleRow[]>(props.rules);
  const everyoneAnyway = rows.length > 0 && rows.every((r) => r.method === "function" && allowsAll(r.data[0] ?? ""));

  return (
    <div className="rs-modal-back" onMouseDown={(e) => { if (e.target === e.currentTarget) props.onCancel(); }}>
      <div className="rs-modal mn-access" role="dialog" aria-label="Who can see this menu" onKeyDown={(e) => { if (e.key === "Escape") props.onCancel(); }}>
        <h2>Who can see {props.menuLabel ? `“${props.menuLabel}”` : "this menu"}</h2>
        <p className="pe-hint">
          {rows.length === 0 ? "No rules: everyone who can see menus sees this one." : `${rows.length} rule${rows.length === 1 ? "" : "s"}. Someone sees the menu if any rule lets them.`}
          {everyoneAnyway && " Every rule here lets everyone in as written, so nothing is hidden yet."}
        </p>
        <AccessRules rows={rows} onChange={setRows} subjects={props.subjects} />
        <p className="pe-hint">This only hides the menu. What people can read is set by each resource's own access rules.</p>
        <div className="pe-btns">
          <button className="rs-btn" onClick={props.onCancel}>Cancel</button>
          <button className="rs-btn is-primary" onClick={() => props.onDone(rows.map((r) => ({ method: r.method, data: r.data })))}>Done</button>
        </div>
      </div>
    </div>
  );
}
