// Resource settings: the resource's own settings (its ResourceDetail record on the instance), shown on
// the right of the Resources screen in place of a property's settings. Description, Open records in a
// drawer, and the sections of the record form (name, description, columns, own tab, and which
// properties are in each, in order). Changes are kept as a draft per resource, like the properties',
// and Save sends them (host/resources.js: saveSettings).
import { Switch } from "./editor";

export interface Section { name: string; description?: string; number_of_columns: number; placeInTab?: boolean; properties: string[]; [k: string]: unknown }
/** The record as the host sends it (without the reader's permissions). */
export type Detail = Record<string, unknown> & { id?: string; sections?: Section[]; description?: string; drawer_enabled?: boolean; render_details?: Record<string, unknown> };
/** The settings changed here: only the keys that differ from the record. */
export interface SettingsDraft { sections?: Section[]; description?: string; drawer_enabled?: boolean }
/** What the screen has for a resource's settings: the record, or why there's none. */
export type Loaded = { id: string; detail: Detail } | { problem: string };

const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

/** The values as the record has them. */
export function settingsOf(detail: Detail): Required<SettingsDraft> {
  const render = detail.render_details && typeof detail.render_details === "object" ? detail.render_details : {};
  return {
    sections: Array.isArray(detail.sections) ? detail.sections : [],
    description: typeof detail.description === "string" ? detail.description : "",
    drawer_enabled: typeof detail.drawer_enabled === "boolean" ? detail.drawer_enabled : render.drawer_enabled === true,
  };
}

/** The draft with only the keys that still differ from the record. */
export function trimDraft(detail: Detail, draft: SettingsDraft): SettingsDraft {
  const now = settingsOf(detail);
  const out: SettingsDraft = {};
  for (const k of Object.keys(draft) as (keyof SettingsDraft)[]) if (!same(draft[k], now[k])) (out as Record<string, unknown>)[k] = draft[k];
  return out;
}

const NAMES: Record<keyof SettingsDraft, string> = { sections: "sections", description: "description", drawer_enabled: "drawer" };
/** "the settings (sections, description)" for the unsaved line and the Save confirm. */
export const settingsSummary = (draft: SettingsDraft | undefined) => {
  const keys = Object.keys(draft ?? {}) as (keyof SettingsDraft)[];
  return keys.length ? `the settings (${keys.map((k) => NAMES[k]).join(", ")})` : "";
};

/** Why the draft can't be saved (a section with no name), or null. */
export function settingsError(draft: SettingsDraft | undefined) {
  const bad = (draft?.sections ?? []).findIndex((s) => !s.name.trim());
  return bad >= 0 ? `Section ${bad + 1} needs a name.` : null;
}

export function SettingsPage(props: {
  resource: string;
  loaded: Loaded | undefined;
  draft: SettingsDraft;
  /** the resource's properties, in the schema's order */
  properties: { key: string; label: string | null }[];
  disabled?: boolean;
  onChange: (draft: SettingsDraft) => void;
  onBack: () => void;
}) {
  const { resource, loaded, draft, properties, disabled } = props;
  if (!loaded) return <p className="rs-empty">Reading {resource}'s settings…</p>;
  if ("problem" in loaded) return <p className="rs-empty">{loaded.problem}</p>;
  const was = settingsOf(loaded.detail);
  const now = { ...was, ...draft };
  const set = (part: SettingsDraft) => props.onChange({ ...draft, ...part });
  const setSections = (sections: Section[]) => set({ sections });
  const changeSection = (i: number, part: Partial<Section>) => setSections(now.sections.map((s, j) => (j === i ? { ...s, ...part } : s)));
  const moveIn = <T,>(list: T[], i: number, by: number) => {
    const to = i + by;
    if (to < 0 || to >= list.length) return list;
    const next = list.slice();
    [next[i], next[to]] = [next[to], next[i]];
    return next;
  };
  const labelOf = (key: string) => properties.find((p) => p.key === key)?.label ?? null;
  const placed = new Set(now.sections.flatMap((s) => s.properties));
  const unplaced = properties.filter((p) => !placed.has(p.key));
  const columns = now.sections[0]?.number_of_columns ?? 2;

  return (
    <>
      <div className="rs-detail-head">
        <div>
          <div className="rs-detail-label">{resource} settings</div>
          <div className="pe-hint">The resource's own settings, not a property's</div>
        </div>
        <div className="rs-detail-actions">
          {Object.keys(draft).length > 0 && <button className="rs-link" disabled={disabled} onClick={() => props.onChange({})}>Undo all changes to them</button>}
          <button className="rs-link" onClick={props.onBack}>Back to properties</button>
        </div>
      </div>
      <div className="pe-page rs-settings">
        <div className="pe-flow">
          <div className="pe-block">
            <h2 className="pe-group-title">General</h2>
            <div className="pe-card">
              <div className={`pe-row is-wide${"description" in draft ? " is-changed" : ""}`}>
                <div className="pe-text">
                  <label className="pe-label" htmlFor="rs-set-description">Description</label>
                  <span className="pe-hint">What this resource is for.{"description" in draft ? ` Was: ${was.description || "(empty)"}` : ""}</span>
                </div>
                <div className="pe-control">
                  <textarea id="rs-set-description" className="pe-input" rows={2} disabled={disabled} value={now.description} onChange={(e) => set({ description: e.target.value })} />
                </div>
              </div>
              <div className={`pe-row${"drawer_enabled" in draft ? " is-changed" : ""}`}>
                <div className="pe-text">
                  <label className="pe-label" htmlFor="rs-set-drawer">Open records in a drawer</label>
                  <span className="pe-hint">On: a record opens in a panel at the side. Off: on its own page.</span>
                </div>
                <div className="pe-control">
                  <Switch id="rs-set-drawer" on={now.drawer_enabled} label="Open records in a drawer" disabled={disabled} onSet={(on) => set({ drawer_enabled: on })} />
                </div>
              </div>
            </div>
          </div>

          <div className="pe-block">
            <h2 className="pe-group-title">Sections</h2>
            <p className="pe-blurb">How a record's form is split up. Each section shows its properties in this order. A property can be in more than one.</p>
            {now.sections.map((s, i) => {
              const changed = !same(s, was.sections[i]);
              const missing = properties.filter((p) => !s.properties.includes(p.key));
              return (
                <div key={i} className="pe-card rs-section" aria-label={`Section ${s.name || i + 1}`} style={{ marginBottom: 12 }}>
                  <div className="pe-row rs-section-head">
                    <div className="pe-text">
                      <span className="pe-label">{changed && <span className="rs-dot is-inline" />}Section {i + 1}{s.name ? `: ${s.name}` : ""}</span>
                    </div>
                    <div className="rs-section-tools">
                      <button className="rs-btn" title="Move up" aria-label="Move section up" disabled={disabled || i === 0} onClick={() => setSections(moveIn(now.sections, i, -1))}>↑</button>
                      <button className="rs-btn" title="Move down" aria-label="Move section down" disabled={disabled || i === now.sections.length - 1} onClick={() => setSections(moveIn(now.sections, i, 1))}>↓</button>
                      <button className="rs-btn" title="Remove this section" aria-label="Remove section" disabled={disabled} onClick={() => setSections(now.sections.filter((_, j) => j !== i))}>×</button>
                    </div>
                  </div>
                  <div className="pe-row">
                    <div className="pe-text"><label className="pe-label" htmlFor={`rs-sec-name-${i}`}>Name</label></div>
                    <div className="pe-control">
                      <input id={`rs-sec-name-${i}`} className="pe-input" disabled={disabled} aria-invalid={!s.name.trim()} value={s.name} onChange={(e) => changeSection(i, { name: e.target.value })} />
                    </div>
                  </div>
                  <div className="pe-row">
                    <div className="pe-text"><label className="pe-label" htmlFor={`rs-sec-desc-${i}`}>Description</label></div>
                    <div className="pe-control">
                      <input id={`rs-sec-desc-${i}`} className="pe-input" disabled={disabled} value={s.description ?? ""} onChange={(e) => changeSection(i, { description: e.target.value })} />
                    </div>
                  </div>
                  <div className="pe-row">
                    <div className="pe-text">
                      <label className="pe-label" htmlFor={`rs-sec-cols-${i}`}>Columns</label>
                      <span className="pe-hint">How many properties sit side by side.</span>
                    </div>
                    <div className="pe-control">
                      <input id={`rs-sec-cols-${i}`} className="pe-input" type="number" min={1} step={1} disabled={disabled} value={s.number_of_columns} onChange={(e) => { const n = Math.floor(Number(e.target.value)); if (n >= 1) changeSection(i, { number_of_columns: n }); }} />
                    </div>
                  </div>
                  <div className="pe-row">
                    <div className="pe-text">
                      <label className="pe-label" htmlFor={`rs-sec-tab-${i}`}>Own tab</label>
                      <span className="pe-hint">On: the section shows as a tab of its own.</span>
                    </div>
                    <div className="pe-control">
                      <Switch id={`rs-sec-tab-${i}`} on={s.placeInTab === true} label="Own tab" disabled={disabled} onSet={(on) => changeSection(i, { placeInTab: on })} />
                    </div>
                  </div>
                  <div className="pe-row is-wide">
                    <div className="pe-text">
                      <span className="pe-label">Properties</span>
                      <span className="pe-hint">{s.properties.length ? `${s.properties.length} in this section, in this order.` : "None yet."}</span>
                    </div>
                    <div className="pe-control">
                      <ol className="rs-sec-props" aria-label={`Properties in ${s.name || `section ${i + 1}`}`}>
                        {s.properties.map((key, k) => (
                          <li key={`${key}-${k}`} className={labelOf(key) === null && !properties.some((p) => p.key === key) ? "is-unknown" : ""}>
                            <span className="rs-sec-prop">
                              {labelOf(key) ?? key} <span className="rs-item-key">{key}</span>
                              {!properties.some((p) => p.key === key) && <span className="pe-error"> not a property of {resource}</span>}
                            </span>
                            <button className="rs-link" title="Move up" aria-label={`Move ${key} up`} disabled={disabled || k === 0} onClick={() => changeSection(i, { properties: moveIn(s.properties, k, -1) })}>↑</button>
                            <button className="rs-link" title="Move down" aria-label={`Move ${key} down`} disabled={disabled || k === s.properties.length - 1} onClick={() => changeSection(i, { properties: moveIn(s.properties, k, 1) })}>↓</button>
                            <button className="rs-link" title="Take it out of this section" aria-label={`Take ${key} out`} disabled={disabled} onClick={() => changeSection(i, { properties: s.properties.filter((_, j) => j !== k) })}>×</button>
                          </li>
                        ))}
                      </ol>
                      {missing.length > 0 && (
                        <select className="pe-input" aria-label={`Add a property to ${s.name || `section ${i + 1}`}`} disabled={disabled} value="" onChange={(e) => e.target.value && changeSection(i, { properties: [...s.properties, e.target.value] })}>
                          <option value="">Add a property…</option>
                          {missing.map((p) => <option key={p.key} value={p.key}>{p.label ?? p.key} ({p.key}){placed.has(p.key) ? "" : " · in no section"}</option>)}
                        </select>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            <button className="rs-btn" disabled={disabled} onClick={() => setSections([...now.sections, { name: "New section", description: "", number_of_columns: columns, placeInTab: false, properties: [] }])}>+ Add a section</button>
            {unplaced.length > 0 && now.sections.length > 0 && (
              <p className="pe-hint" style={{ marginTop: 10 }}>In no section: {unplaced.map((p) => p.label ?? p.key).join(", ")}.</p>
            )}
          </div>
          <p className="pe-hint">Other settings on the record (default view, sort, layout, hooks) are kept as they are.</p>
          <div className="pe-tail" />
        </div>
      </div>
    </>
  );
}
