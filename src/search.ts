import type { Catalog, Flow, Path, WorkflowView } from "./types";

// Search across a workflow: stages, stage actions, global actions, commands —
// and the steps inside every action and command (operators, loops, conditions,
// command references), so "debug" lists every action that has a debug step.

export interface StepHit {
  path: Path;
  title: string; // what to show for the step
  why: string; // what matched: operator key, name, label or a setting
  disabled: boolean;
}
export interface TreeHits {
  key: string; // tree key, as App/outliner use it
  label: string;
  where: string; // "Stage New", "Global action", "Command"
  kind: "action" | "command";
  steps: StepHit[];
}
export interface SearchResults {
  stages: { index: number; label: string; stage: string; color: string | null }[];
  actions: { key: string; label: string; machine: string; where: string }[];
  commands: { key: string; label: string; machine: string }[];
  steps: TreeHits[]; // trees that contain matching steps, most hits first
  total: number;
}

const norm = (s: string) => s.toLowerCase();

/** Every query word must appear somewhere in the text (so "send email" finds "Send Email"). */
function matches(q: string[], ...texts: (string | null | undefined)[]) {
  const hay = norm(texts.filter(Boolean).join(" "));
  return q.every((w) => hay.includes(w));
}

const KIND_WORDS: Record<string, string> = {
  each: "loop for each each",
  if: "condition if branch",
  parallel: "parallel block",
  series: "group series",
  reference: "command reference",
};

function stepHits(flow: Flow | null, q: string[], catalog: Catalog, out: StepHit[]) {
  if (!flow) return;
  const visit = (f: Flow) => {
    let title = f.label;
    let hit: string | null = null;
    if (f.kind === "operator") {
      const entry = f.operator ? catalog[f.operator] : undefined;
      title = f.label || entry?.name || f.operator || "Step";
      if (matches(q, f.operator, entry?.name, f.label)) hit = f.operator ?? title;
      else if (matches(q, entry?.category)) hit = `category ${entry?.category}`;
      else {
        const p = f.params.find((x) => matches(q, x.key, x.label, x.value));
        if (p) hit = `setting ${p.label}`;
      }
    } else if (f.kind === "reference") {
      title = `Command: ${f.label && f.label !== "Reference" ? f.label : f.targetName ?? f.targetId ?? ""}`;
      if (matches(q, KIND_WORDS.reference, f.label, f.targetName, f.targetId)) hit = "command reference";
    } else if (f.kind !== "series" || f.path.length > 0) {
      const words = KIND_WORDS[f.kind] ?? f.kind;
      if (f.kind === "each") title = `For Each ${f.collection ?? ""}`.trim();
      if (f.kind === "if") title = f.condition ? `If ${f.condition.property} ${f.condition.operator} ${f.condition.value}` : "If";
      if (f.kind === "parallel") title = "Parallel";
      if (f.kind === "series") title = f.label && f.label !== "Series" ? `Group ${f.label}` : "Group";
      const extra = f.kind === "each" ? f.collection : f.kind === "if" ? f.condition?.property ?? f.evaluatorSource : null;
      if (matches(q, words, extra)) hit = f.kind;
    }
    if (hit) out.push({ path: f.path, title, why: hit, disabled: !!f.mock });
    if (f.kind === "if") [...f.whenTrue, ...f.whenFalse].forEach(visit);
    else if (f.kind === "series" || f.kind === "each" || f.kind === "parallel") f.children.forEach(visit);
  };
  // the root series of an action is not a step itself
  if (flow.kind === "series") flow.children.forEach(visit);
  else visit(flow);
}

export function searchWorkflow(wf: WorkflowView, catalog: Catalog, query: string): SearchResults {
  const q = norm(query).split(/\s+/).filter(Boolean);
  const res: SearchResults = { stages: [], actions: [], commands: [], steps: [], total: 0 };
  if (!q.length) return res;

  wf.stages.forEach((st, i) => {
    if (matches(q, st.label, st.stage)) res.stages.push({ index: i, label: st.label, stage: st.stage, color: st.color });
    st.actions.forEach((a) => {
      const key = `s:${st.stage}:${a.id}`;
      if (matches(q, a.label, a.action)) res.actions.push({ key, label: a.label, machine: a.action, where: `Stage ${st.label}` });
      const steps: StepHit[] = [];
      stepHits(a.flow, q, catalog, steps);
      if (steps.length) res.steps.push({ key, label: a.label, where: `Stage ${st.label}`, kind: "action", steps });
    });
  });
  wf.actions.forEach((a) => {
    const key = `g:${a.id}`;
    if (matches(q, a.label, a.action)) res.actions.push({ key, label: a.label, machine: a.action, where: "Global action" });
    const steps: StepHit[] = [];
    stepHits(a.flow, q, catalog, steps);
    if (steps.length) res.steps.push({ key, label: a.label, where: "Global action", kind: "action", steps });
  });
  wf.commands.forEach((c) => {
    const key = `c:${c.id}`;
    if (matches(q, c.label, c.name)) res.commands.push({ key, label: c.label, machine: c.name });
    const steps: StepHit[] = [];
    stepHits(c.flow, q, catalog, steps);
    if (steps.length) res.steps.push({ key, label: c.label, where: "Command", kind: "command", steps });
  });
  res.steps.sort((a, b) => b.steps.length - a.steps.length);
  res.total =
    res.stages.length + res.actions.length + res.commands.length + res.steps.reduce((n, t) => n + t.steps.length, 0);
  return res;
}
