// Shapes of the view model the extension host posts as `workflow` (built by
// the host's Ke()/dp()/$a()/pp()/_n()/yr() functions in dist/extension.js).

export type Path = (string | number)[];

export interface ParamView {
  key: string;
  label: string;
  type: string | null;
  value: string;
  truncated?: boolean;
  unknown?: boolean;
}

export interface SeriesFlow {
  kind: "series";
  label: string;
  children: Flow[];
  path: Path;
  childrenPath: Path;
  /** Saturn's "mock" flag: true = the step is disabled (skipped when it runs). */
  mock?: boolean;
}
export interface ParallelFlow {
  kind: "parallel";
  label: string;
  concurrency: number | null;
  children: Flow[];
  path: Path;
  childrenPath: Path;
  /** Saturn's "mock" flag: true = the step is disabled (skipped when it runs). */
  mock?: boolean;
}
export interface EachFlow {
  kind: "each";
  label: string;
  concurrency: number | null;
  collection: string | null;
  children: Flow[];
  path: Path;
  childrenPath: Path;
  /** Saturn's "mock" flag: true = the step is disabled (skipped when it runs). */
  mock?: boolean;
}
export interface IfFlow {
  kind: "if";
  label: string;
  evaluatorKind: string | null;
  evaluatorSource: string | null;
  condition: { property: string; operator: string; value: string } | null;
  whenTrue: Flow[];
  whenFalse: Flow[];
  path: Path;
  truePath: Path;
  falsePath: Path;
  /** Saturn's "mock" flag: true = the step is disabled (skipped when it runs). */
  mock?: boolean;
}
export interface ReferenceFlow {
  kind: "reference";
  label: string;
  targetId: string | null;
  targetName: string | null;
  parameterValues: { key: string; value: string }[] | null;
  path: Path;
  /** Saturn's "mock" flag: true = the step is disabled (skipped when it runs). */
  mock?: boolean;
}
export interface OperatorFlow {
  kind: "operator";
  label: string;
  operator: string | null;
  delay: number | null;
  params: ParamView[];
  path: Path;
  /** Saturn's "mock" flag: true = the step is disabled (skipped when it runs). */
  mock?: boolean;
}
export type Flow =
  | SeriesFlow
  | ParallelFlow
  | EachFlow
  | IfFlow
  | ReferenceFlow
  | OperatorFlow;

export interface FormFieldView {
  key: string;
  label: string;
  type: string | null;
  inputType: string | null;
  required: boolean;
  /** the whole field object as stored (for the advanced field settings) */
  raw?: Record<string, unknown> | null;
}
export interface AccessRule {
  method: string;
  label: string | null;
  data: string[];
  known?: boolean;
}
export interface ActionView {
  id: string;
  action: string;
  label: string;
  flow: Flow | null;
  taskPath: Path;
  actorLabel?: string;
  access?: AccessRule[];
  isBatchAction?: boolean;
  confirmMessage?: string | null;
  form?: FormFieldView[];
}
export interface StageView {
  stage: string;
  label: string;
  color: string | null;
  actions: ActionView[];
}
export interface CommandUsage {
  label: string;
  pathLabel: string;
  path: Path;
  target: { tab: string; stage?: string; actionId?: string; commandId?: string };
}
export interface CommandView {
  id: string;
  name: string;
  label: string;
  flow: Flow | null;
  taskPath: Path;
  usageCount: number;
  usages?: CommandUsage[];
  parameters?: FormFieldView[];
}
export interface WorkflowView {
  id: string;
  name: string;
  status: string | null;
  stages: StageView[];
  actions: ActionView[];
  commands: CommandView[];
  start?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

/** A row of the workflows list (the host's At()). */
export interface WorkflowSummary {
  id: string;
  name: string;
  status: string | null;
  stageCount: number;
  globalActionCount: number;
  stages: { stage: string; label: string; color: string | null }[];
}

export interface CatalogParam {
  param: string;
  label: string;
  type: string | null;
  required: boolean;
  description: string | null;
  lookupValues: { value: string; label: string }[] | string[] | null;
  lookupKind?: string | null;
  lookupResource?: { resource: string; valueField: string; labelField: string } | null;
  lookupHint?: string | null;
  inputType?: string | null;
  defaultValue: string;
  codeLanguage: string | null;
  mergedInto: string | null;
  sensitive?: boolean;
}
export interface CatalogEntry {
  name: string;
  description: string | null;
  category: string | null;
  icon: unknown;
  params: CatalogParam[];
}
export type Catalog = Record<string, CatalogEntry>;

export interface DraftState {
  pending: number;
  summaries: string[];
}
