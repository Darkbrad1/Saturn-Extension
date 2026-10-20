// Every setting of a resource property the Resources screen edits, as data: where it lives in the
// property (its path), what kind of control edits it, and when it applies. The editor
// (editor.tsx) draws the controls from this list, so adding a setting is one entry here.
//
// The names are Saturn's own, read from real resource definitions. Saturn's own editor spreads
// these over eight tabs (General, Input Settings, Source, Lookup, Defaults, Display Settings,
// Visibility, Access Control); here they are six groups, and a setting only shows when it does
// something (Rows only for a textarea, the map's fields only when there is a map, …).

export type Path = string[];
export type Prop = Record<string, unknown>;

export type Kind =
  | { kind: "text"; placeholder?: string; mono?: boolean }
  | { kind: "textarea" }
  | { kind: "number"; min?: number; max?: number; step?: number }
  | { kind: "bool"; hint?: string; invert?: boolean } // invert: the switch is on when the stored value isn't true (a "hide" setting shown as "show")
  | { kind: "select"; options: [string, string][] }
  | { kind: "choice"; options: [string, string, string?][] } // cards: value, label, hint
  | { kind: "cards"; options: [string, string, string?][] } // cards, no default value
  | { kind: "tags"; placeholder?: string }
  | { kind: "csv" } // a comma-separated list, edited as tags
  | { kind: "code"; lang: "javascript" | "html"; empty: string }
  | { kind: "resource" } // one of the instance's resources
  | { kind: "field"; of: (p: Prop) => string | null } // a property of another resource
  | { kind: "fields"; of: (p: Prop) => string | null } // several properties of another resource
  | { kind: "ownFields" } // several properties of this resource
  | { kind: "record"; resource: string; value: string; label: string } // a record of a core resource
  | { kind: "view" } // one of the property's views
  | { kind: "key" } // the property's key: checked as you type
  | { kind: "icon" } // a Font Awesome icon, from the icon picker (./icons.tsx)
  | { kind: "json" };

export interface Setting {
  path: Path;
  label: string;
  hint?: string;
  /** shown only when this is true for the property as edited */
  when?: (p: Prop) => boolean;
  /** each property has its own (label, key, description): left out when editing several */
  single?: boolean;
  /** a switch that adds (on) or removes (off) a whole part of the property */
  toggles?: { on: unknown };
  edit: Kind;
}

export interface Group {
  id: string;
  title: string;
  /** what the group is for, in one line */
  blurb: string;
  parts: { title?: string; settings: Setting[] }[];
}

export const get = (o: unknown, path: Path): unknown =>
  path.reduce<unknown>((at, part) => (at && typeof at === "object" ? (at as Prop)[part] : undefined), o);

const inputType = (p: Prop) => String(get(p, ["input_properties", "type"]) ?? "input");
const hasMap = (p: Prop) => !!p.map && typeof p.map === "object";
const lookupType = (p: Prop) => String(p.lookup_type ?? "");
const isDynamic = (p: Prop) => p.source === "dynamic";

/** Input types, by the value Saturn stores. */
export const INPUT_TYPES: [string, string][] = [
  ["input", "Input"],
  ["textarea", "Textarea"],
  ["select", "Select"],
  ["switch", "Switch"],
  ["date", "Date"],
  ["datetime-local", "Date and time"],
  ["typed_file_upload", "Typed file upload"],
];

/** The components a value can be shown with (Saturn's renderers seen so far). */
const RENDERERS: [string, string][] = [
  ["", "Not set"],
  ["default", "Default"],
  ["currency", "Currency"],
  ["inline-component", "Inline component"],
  ["FileManagerUploader", "File manager"],
];

/** The types a property can have: the ones Saturn's definitions use (another type a property
 *  already has shows as one more card, and is kept). */
export const TYPES: [string, string, string][] = [
  ["string", "String", "Text"],
  ["number", "Number", "A number"],
  ["boolean", "Boolean", "On or off"],
  ["date", "Date", "A date or a time"],
  ["array", "Array", "A list of values"],
  ["object", "Object", "A group of values"],
];

const NEW_FUNCTION = "(res,{user,setting})=>{\n  return true\n}";

export const GROUPS: Group[] = [
  {
    id: "general",
    title: "General",
    blurb: "Its name, what it holds and the basic rules.",
    parts: [
      {
        settings: [
          { path: ["label"], label: "Label", hint: "The name people see.", single: true, edit: { kind: "text" } },
          {
            path: ["key"],
            label: "Key",
            hint: "The name Saturn stores the value under (Saturn calls it Field). Workflows, views and other properties that use the old key aren't changed with it.",
            single: true,
            edit: { kind: "key" },
          },
          { path: ["description"], label: "Description", single: true, edit: { kind: "textarea" } },
          {
            path: ["type"],
            label: "Type",
            hint: "What kind of value it holds.",
            edit: { kind: "cards", options: TYPES },
          },
          { path: ["meta_tags"], label: "Meta tags", edit: { kind: "tags", placeholder: "Type a tag, press Enter" } },
        ],
      },
      {
        title: "Rules",
        settings: [
          { path: ["required"], label: "Required", edit: { kind: "bool", hint: "Must be filled in on forms." } },
          { path: ["unique"], label: "Unique", edit: { kind: "bool", hint: "No two records can have the same value." } },
          { path: ["email"], label: "Email", edit: { kind: "bool", hint: "Must be an email address." } },
          { path: ["ipaddress"], label: "IP address", edit: { kind: "bool", hint: "Must be an IPv4 or IPv6 address." } },
          { path: ["hide"], label: "Hide from the API", edit: { kind: "bool", hint: "Never sent in API responses." } },
        ],
      },
    ],
  },
  {
    id: "visibility",
    title: "Visibility",
    blurb: "Where it shows, and when.",
    parts: [
      {
        title: "Show in",
        settings: [
          { path: ["hideInForm"], label: "Forms", edit: { kind: "bool", invert: true } },
          { path: ["hideInForm_edit"], label: "Edit forms", edit: { kind: "bool", invert: true } },
          { path: ["hideInForm_add"], label: "Add forms", edit: { kind: "bool", invert: true } },
          { path: ["hideInTable"], label: "Tables", edit: { kind: "bool", invert: true } },
          { path: ["hideInDrawer"], label: "Drawers", edit: { kind: "bool", invert: true } },
          { path: ["hideInView"], label: "Record views", edit: { kind: "bool", invert: true } },
        ],
      },
      {
        title: "Only show when",
        settings: [
          {
            path: ["form_visibility"],
            label: "Visibility rule",
            hint: "A function: it shows in forms only when the function returns true.",
            toggles: { on: { evaluator: "function", data: NEW_FUNCTION } },
            edit: { kind: "bool" },
          },
          { path: ["form_visibility", "data"], label: "Function", when: (p) => !!p.form_visibility, edit: { kind: "code", lang: "javascript", empty: NEW_FUNCTION } },
        ],
      },
    ],
  },
  {
    id: "input",
    title: "Input",
    blurb: "How people fill it in.",
    parts: [
      {
        settings: [
          { path: ["input_properties", "type"], label: "Input type", edit: { kind: "select", options: INPUT_TYPES } },
          { path: ["input_properties", "rows"], label: "Rows", when: (p) => inputType(p) === "textarea", edit: { kind: "number", min: 1, max: 50 } },
          {
            path: ["input_properties", "attachment_group"],
            label: "Attachment group",
            when: (p) => inputType(p) === "typed_file_upload",
            edit: { kind: "record", resource: "AttachmentGroup", value: "id", label: "name" },
          },
          {
            path: ["input_properties", "attachments_sort"],
            label: "Sort",
            when: (p) => inputType(p) === "typed_file_upload",
            edit: { kind: "select", options: [["", "Not set"], ["ascending", "Ascending"], ["descending", "Descending"]] },
          },
          {
            path: ["input_properties", "options", "code"],
            label: "Component template",
            hint: "The Vue template a dynamic component input uses.",
            edit: { kind: "code", lang: "html", empty: "<template></template> " },
          },
        ],
      },
    ],
  },
  {
    id: "data",
    title: "Data",
    blurb: "Where its value and its choices come from, and its defaults.",
    parts: [
      {
        title: "Value",
        settings: [
          {
            path: ["source"],
            label: "Value source",
            edit: { kind: "choice", options: [["static", "Static", "A value people enter."], ["dynamic", "Dynamic", "Filled in from other records."]] },
          },
          { path: ["source_type"], label: "Source type", when: isDynamic, edit: { kind: "select", options: [["resource_lookup", "Resource lookup"]] } },
          { path: ["source_definition", "reference"], label: "Reference", hint: "The resource the records come from.", when: isDynamic, edit: { kind: "resource" } },
          {
            path: ["source_definition", "bounded_property"],
            label: "Linked by",
            hint: "The property of those records that points back to this one.",
            when: isDynamic,
            edit: { kind: "field", of: (p) => (get(p, ["source_definition", "reference"]) as string) || null },
          },
          { path: ["source_definition", "value_field"], label: "Value field", when: isDynamic, edit: { kind: "field", of: (p) => (get(p, ["source_definition", "reference"]) as string) || null } },
          { path: ["source_definition", "default_limit"], label: "Default limit", when: isDynamic, edit: { kind: "number", min: 0 } },
        ],
      },
      {
        title: "Choices from another resource (map)",
        settings: [
          {
            path: ["map"],
            label: "Include map",
            hint: "Pick the value from another resource's records.",
            toggles: { on: { type: "model", value_field: "id", label_field: "", reference: "" } },
            edit: { kind: "bool" },
          },
          { path: ["map", "reference"], label: "Reference", when: hasMap, edit: { kind: "resource" } },
          { path: ["map", "value_field"], label: "Value field", when: hasMap, edit: { kind: "field", of: (p) => (get(p, ["map", "reference"]) as string) || null } },
          {
            path: ["map_label_type"],
            label: "Label type",
            when: hasMap,
            edit: { kind: "select", options: [["property", "Property"], ["function", "Function"]] },
          },
          {
            path: ["map", "label_field"],
            label: "Label field",
            when: (p) => hasMap(p) && p.map_label_type !== "function",
            edit: { kind: "field", of: (p) => (get(p, ["map", "reference"]) as string) || null },
          },
          {
            path: ["required_mapped_columns"],
            label: "Columns to load",
            hint: "Properties of the mapped record read along with it.",
            when: hasMap,
            edit: { kind: "fields", of: (p) => (get(p, ["map", "reference"]) as string) || null },
          },
          { path: ["enable_mapped_resource_creation"], label: "Enable creation", when: hasMap, edit: { kind: "bool", hint: "People can create a new record from the dropdown." } },
        ],
      },
      {
        title: "Lookup",
        settings: [
          {
            path: ["lookup_type"],
            label: "Lookup source",
            edit: {
              kind: "select",
              options: [
                ["", "None"],
                ["values", "Values"],
                ["lookup", "Lookup"],
                ["function", "Function"],
                ["countries", "Countries"],
                ["workflow_stages", "Workflow stages"],
                ["resources", "Resources"],
                ["resource_properties", "Resource properties"],
                ["map", "Map"],
              ],
            },
          },
          { path: ["lookup_reference"], label: "Values", hint: "The choices, in order.", when: (p) => lookupType(p) === "values", edit: { kind: "csv" } },
          {
            path: ["sort_lookup_reference"],
            label: "Sort",
            when: (p) => lookupType(p) === "values",
            edit: { kind: "select", options: [["", "As listed"], ["asc", "A to Z"], ["desc", "Z to A"]] },
          },
          { path: ["lookup_reference"], label: "Reference", when: (p) => lookupType(p) === "lookup", edit: { kind: "text", mono: true } },
          // a function lookup: Saturn keeps the function in lookup_reference, and the type of each item it returns beside it
          {
            path: ["lookup_reference"],
            label: "Lookup function",
            hint: "Runs to give the choices. It gets the form and Saturn's helpers, and returns a list.",
            when: (p) => lookupType(p) === "function",
            edit: { kind: "code", lang: "javascript", empty: "async (form, { Resource, ctx, _, data, logged_in_user, axios, moment, parent, setting }) => {\n  return [];\n}" },
          },
          {
            path: ["lookup_function_item_data_type"],
            label: "Item data type",
            hint: "What each item the function returns is.",
            when: (p) => lookupType(p) === "function",
            edit: { kind: "select", options: [["string", "String"]] },
          },
          { path: ["lookup_value_field"], label: "Value field", when: (p) => ["lookup", "map", "resources", "resource_properties"].includes(lookupType(p)) || p.lookup_value_field !== undefined, edit: { kind: "text", mono: true, placeholder: "id" } },
          {
            path: ["lookup_label_type"],
            label: "Label type",
            when: (p) => ["lookup", "map", "resources", "resource_properties"].includes(lookupType(p)) || p.lookup_label_type !== undefined,
            edit: { kind: "select", options: [["property", "Property"], ["function", "Function"]] },
          },
          { path: ["lookup_label_field"], label: "Label field", when: (p) => p.lookup_label_type === "property" || (p.lookup_label_type === undefined && p.lookup_label_field !== undefined), edit: { kind: "text", mono: true, placeholder: "name" } },
          { path: ["lookup_label"], label: "Label function", when: (p) => p.lookup_label_type === "function" || typeof p.lookup_label === "string", edit: { kind: "code", lang: "javascript", empty: "(res)=>{\n  return ''\n}" } },
        ],
      },
      {
        title: "Defaults",
        settings: [
          { path: ["default_type_read"], label: "Read default comes from", edit: { kind: "select", options: [["property_value", "A value"]] } },
          { path: ["defaults", "read"], label: "Read default", hint: "Shown when a record has no value.", edit: { kind: "json" } },
          { path: ["default_type_write"], label: "Write default comes from", edit: { kind: "select", options: [["property_value", "A value"]] } },
          { path: ["defaults", "write"], label: "Write default", hint: "Filled in on new records.", edit: { kind: "json" } },
        ],
      },
    ],
  },
  {
    id: "display",
    title: "Display",
    blurb: "How it looks in tables, record views and forms.",
    parts: [
      {
        settings: [
          { path: ["propertyIcon"], label: "Icon", hint: "A Font Awesome icon.", edit: { kind: "icon" } },
          { path: ["rendering", "component"], label: "Default renderer", hint: "Used everywhere unless a renderer below is set.", edit: { kind: "select", options: RENDERERS } },
          {
            path: ["rendering", "options", "currency", "value"],
            label: "Currency",
            when: (p) => get(p, ["rendering", "component"]) === "currency",
            edit: { kind: "text", mono: true, placeholder: "USD" },
          },
          { path: ["format"], label: "Date format", when: (p) => p.type === "date" || p.format !== undefined, edit: { kind: "text", mono: true, placeholder: "DD/MM/YYYY" } },
        ],
      },
      {
        title: "Table",
        settings: [
          { path: ["rendering", "_variances", "list", "component"], label: "Renderer", edit: { kind: "select", options: RENDERERS } },
          { path: ["searchable"], label: "Searchable", edit: { kind: "bool", hint: "Included when people search the table." } },
          { path: ["search_field_type"], label: "Search input type", when: (p) => p.searchable === true, edit: { kind: "select", options: [["", "Not set"], ["input", "Input"]] } },
          { path: ["required_columns"], label: "Required dependent columns", hint: "Other properties the table loads with this one.", edit: { kind: "ownFields" } },
          { path: ["tableColumnWidth"], label: "Column width", hint: "In pixels. 0 = automatic.", edit: { kind: "number", min: 0, step: 10 } },
        ],
      },
      {
        title: "Record view",
        settings: [
          { path: ["rendering", "_variances", "view", "component"], label: "Renderer", edit: { kind: "select", options: RENDERERS } },
          { path: ["rendering", "_variances", "view", "span"], label: "Span", edit: { kind: "number", min: 1, max: 12 } },
          { path: ["placeInOwnTab"], label: "Add to separate tab", edit: { kind: "bool" } },
          { path: ["tabIcon"], label: "Tab icon", when: (p) => p.placeInOwnTab === true, edit: { kind: "icon" } },
          { path: ["disable_popover"], label: "Disable popover", edit: { kind: "bool", hint: "No preview when hovering." } },
          {
            path: ["position"],
            label: "Placement",
            edit: { kind: "select", options: [["", "Not set"], ["picture", "Picture"], ["sub_heading", "Sub heading"], ["title", "Title"]] },
          },
          { path: ["number_of_columns", "full_width"], label: "Full width", edit: { kind: "bool" } },
          { path: ["number_of_columns", "default"], label: "Columns", edit: { kind: "number", min: 1, max: 12 } },
          { path: ["default_view"], label: "Default view", edit: { kind: "view" } },
        ],
      },
      {
        title: "Form",
        settings: [
          { path: ["form_number_of_columns", "full_width"], label: "Full width", edit: { kind: "bool" } },
          { path: ["form_number_of_columns", "default"], label: "Columns", edit: { kind: "number", min: 1, max: 12 } },
        ],
      },
    ],
  },
  {
    id: "access",
    title: "Access",
    blurb: "Who can see and change it.",
    parts: [
      {
        settings: [{ path: ["access_control"], label: "Access rules", hint: "As Saturn stores them.", edit: { kind: "json" } }],
      },
    ],
  },
];

/** Every setting, with the group it's in (for search). */
export const ALL: { group: Group; setting: Setting }[] = GROUPS.flatMap((group) => group.parts.flatMap((part) => part.settings.map((setting) => ({ group, setting }))));

/** A new property with the settings Saturn's own app gives one (seen in its save of a new
 *  property). host/resources.js newProperty() is the same; keep the two alike. */
export function newProperty(key: string, label: string, type: string): Prop {
  const look = { component: "default", options: { size: "small", shape: "circle", opacity: 0.2 } };
  return {
    type,
    meta_tags: [],
    defaults: { read: type === "number" ? 0 : type === "boolean" ? false : "", write: "" },
    label,
    required: false,
    searchable: false,
    unique: false,
    hideInTable: false,
    hideInForm: false,
    hideInView: false,
    hideInDrawer: false,
    ipaddress: false,
    hide: false,
    email: false,
    tableColumnWidth: 0,
    placeInOwnTab: false,
    map_label_type: "property",
    source: "static",
    access_control: {},
    number_of_columns: { full_width: false, default: 1 },
    form_number_of_columns: { full_width: false, default: 1 },
    required_columns: [],
    rendering: { ...look, _variances: { list: { ...look }, view: { ...look, span: 2 }, form: {} } },
    default_view: "SLKJDSF",
    views: [{ id: "SLKJDSF", view: "data_table", details: {} }],
    input_properties: { type: type === "boolean" ? "switch" : "input", options: { code: "<template></template> " } },
    key,
  };
}

/** What a property key may look like (the host checks the same). */
export const KEY_PATTERN = /^[A-Za-z_][A-Za-z0-9_]*$/;

/** A key made from a label: "First Name" -> first_name. */
export const keyFrom = (label: string) =>
  label.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "").replace(/^(\d)/, "_$1");

/** The settings that differ between two versions of a property, as changes the host applies one
 *  by one: [{path, value} | {path, remove: true}]. Objects are compared setting by setting; a
 *  list or a plain value is one setting. The key is never a change. */
export function diff(before: unknown, after: unknown, path: Path = []): { path: Path; value?: unknown; remove?: boolean }[] {
  const isObj = (v: unknown): v is Prop => !!v && typeof v === "object" && !Array.isArray(v);
  if (isObj(before) && isObj(after)) {
    const out: { path: Path; value?: unknown; remove?: boolean }[] = [];
    for (const k of new Set([...Object.keys(before), ...Object.keys(after)])) {
      if (!path.length && k === "key") continue;
      if (!(k in after)) out.push({ path: [...path, k], remove: true });
      else out.push(...diff(before[k], after[k], [...path, k]));
    }
    return out;
  }
  return JSON.stringify(before) === JSON.stringify(after) ? [] : [{ path, value: after }];
}

/** The resource a property points at: a static map (map.reference) or a dynamic source. */
export function mappedOf(p: Prop): { kind: "static" | "dynamic"; resource: string } | null {
  const source = get(p, ["source_definition", "reference"]);
  if (p.source === "dynamic" && typeof source === "string" && source) return { kind: "dynamic", resource: source };
  const map = get(p, ["map", "reference"]);
  if (typeof map === "string" && map) return { kind: "static", resource: map };
  return null;
}

