// A property's access rules (Access), edited like a menu's: a switch per kind, checkboxes for the
// user groups, users and permissions. Saturn stores them as
//   access_control: {list: [{method, lable, icon, data: [{ref: <id>, access_details: []}]}]}
// (seen on a real definition), and a property without rules as {}. A rule's other keys, the other
// keys of access_control and each ref's access_details are kept as they are. Custom Function rules
// (how a property stores one isn't known yet) are kept and listed, not built here.
import { AccessRules } from "../src-menus/access";
import { RULE_KINDS, type RuleRow, type Subjects } from "../src-menus/model";

type Rec = Record<string, unknown>;
const isObj = (v: unknown): v is Rec => !!v && typeof v === "object" && !Array.isArray(v);
const str = (v: unknown) => (typeof v === "string" ? v : "");
/** The kinds this screen builds for a property. */
const METHODS = ["user_group", "user", "permission"];
const HINTS: Record<string, string> = { user_group: "Anyone in a picked group.", user: "Named people.", permission: "Anyone whose group grants a picked permission." };

interface Row extends RuleRow { stored?: Rec }
const listOf = (value: unknown): Rec[] => (isObj(value) && Array.isArray(value.list) ? value.list.filter(isObj) : []);
const refOf = (d: unknown) => (typeof d === "string" ? d : isObj(d) ? str(d.ref) : "");

/** The stored rules as rows. */
export function propertyRules(value: unknown): Row[] {
  return listOf(value).map((r) => {
    const method = str(r.method);
    return {
      method,
      label: str(r.lable) || str(r.label) || (RULE_KINDS[method]?.label ?? null),
      data: (Array.isArray(r.data) ? r.data : []).map(refOf).filter(Boolean),
      known: METHODS.includes(method),
      stored: r,
    };
  });
}

/** Rows back to what Saturn stores, starting from `value` (what the property has now). */
export function propertyAccess(rows: Row[], value: unknown): Rec {
  const before = listOf(value);
  const list = rows.map((row) => {
    if (!row.known && row.stored) return row.stored;
    const stored = before.find((r) => str(r.method) === row.method) ?? {};
    const items = Array.isArray(stored.data) ? stored.data : [];
    const kind = RULE_KINDS[row.method];
    return {
      ...stored,
      method: row.method,
      lable: kind.label,
      icon: { name: kind.icon.name, __name: kind.icon.__name },
      // an id kept keeps its access_details
      data: row.data.map((id) => items.find((d) => refOf(d) === id) ?? { ref: id, access_details: [] }),
    };
  });
  const out: Rec = isObj(value) ? { ...value } : {};
  if (list.length) out.list = list;
  else delete out.list;
  return out;
}

/** One line for "was …": the rules by kind, with how many each names. */
export function accessSummary(value: unknown) {
  const rows = propertyRules(value);
  return rows.length ? rows.map((r) => (r.known ? `${r.label ?? r.method} (${r.data.length})` : r.label ?? r.method)).join(" · ") : "no rules";
}

/** The Access setting: the rules inline, each change applied at once (to all picked when several). */
export function PropertyAccess(props: { id: string; value: unknown; mixed: boolean; subjects: Subjects | null; disabled: boolean; noun: string; onSet: (v: Rec) => void }) {
  const rows = props.mixed ? [] : propertyRules(props.value);
  return (
    <div className="pe-access">
      <span className="pe-hint">
        {props.mixed ? `Mixed: the picked ${props.noun} have different rules. Rules set here replace each one's.`
          : rows.length === 0 ? "No rules." : `${rows.length} rule${rows.length === 1 ? "" : "s"}. Someone matches if any rule lets them in.`}
      </span>
      <AccessRules
        rows={rows}
        subjects={props.subjects}
        methods={METHODS}
        hints={HINTS}
        idPrefix={props.id}
        disabled={props.disabled}
        othersHint="Kept exactly as Saturn wrote them. Custom Function rules on a property can't be built here yet; set them up in Saturn."
        onChange={(next) => props.onSet(propertyAccess(next, props.mixed ? {} : props.value))}
      />
    </div>
  );
}
