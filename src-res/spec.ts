// Every setting of a resource property the Resources screen edits, as data: where it lives in the
// property (its path), what kind of control edits it, and when it applies. The editor
// (editor.tsx) draws the controls from this list, so adding a setting is one entry here.
//
// The names are Saturn's own, read from real resource definitions. Saturn's own editor spreads
// these over eight tabs (General, Input Settings, Source, Lookup, Defaults, Display Settings,
// Visibility, Access Control); here they are grouped by place (Basics, Rules, Choices, In forms, In tables, In
// record views, Access, Advanced), and a setting only shows when it does something (Rows only for a textarea, the
// map's fields only when the choices come from another resource, …). Where a setting is stored never changes.

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
  | { kind: "access" } // access rules: {list: [...]} (./access.tsx)
  | { kind: "choices" } // where the choices come from: not stored itself, it sets lookup_type, map and source
  | { kind: "showAll" } // Show everywhere: not stored itself, it sets every hideIn… setting (SHOW_PATHS)
  | { kind: "json" };

export interface Setting {
  /** its id for Favourites when the path isn't enough (several settings at one path) */
  id?: string;
  /** a setting that isn't stored itself (its path is empty): the paths it sets, compared for "was …" and put back
   *  by Put back */
  sets?: Path[];
  path: Path;
  label: string;
  hint?: string;
  /** shown only when this is true for the property as edited */
  when?: (p: Prop) => boolean;
  /** each property has its own (label, key, description): left out when editing several */
  single?: boolean;
  /** a switch that adds (on) or removes (off) a whole part of the property */
  toggles?: { on: unknown };
  /** values Saturn keeps next to this one, written too when this is set and they're missing (as seen in real
   *  definitions, e.g. a renderer option's `type: "property"`) */
  alongside?: { path: Path; value: unknown }[];
  edit: Kind;
}

export interface Group {
  id: string;
  title: string;
  /** what the group is for, in one line */
  blurb: string;
  /** a place (forms, tables, record views): the hide… setting that hides the property there. When it's hidden,
   *  the group says so and folds the rest of its settings */
  place?: Path;
  /** folded until opened (Advanced) */
  folded?: boolean;
  /** more paths Paste settings copies with this group (the switches behind a setting that isn't stored itself) */
  copies?: Path[];
  /** a part shows only when its `when` is true (the kinds of choices) */
  parts: { title?: string; when?: (p: Prop) => boolean; settings: Setting[] }[];
}

export const get = (o: unknown, path: Path): unknown =>
  path.reduce<unknown>((at, part) => (at && typeof at === "object" ? (at as Prop)[part] : undefined), o);

const inputType = (p: Prop) => String(get(p, ["input_properties", "type"]) ?? "input");
const hasMap = (p: Prop) => !!p.map && typeof p.map === "object";
const lookupType = (p: Prop) => String(p.lookup_type ?? "");
const isDynamic = (p: Prop) => p.source === "dynamic";
/** A dynamic source, or a source definition stored anyway (a static map can carry one, as real definitions do). */
const hasSource = (p: Prop) => isDynamic(p) || (!!p.source_definition && typeof p.source_definition === "object");
const variance = (p: Prop, v: "list" | "view") => get(p, ["rendering", "_variances", v, "component"]);
const INLINE_START = "<template>\n  <div>{{ value }}</div>\n</template>\n";
/** Whether the form shows it as a dropdown (a select, a map, a lookup or a dynamic source), or a dropdown style is stored. */
const hasDropdown = (p: Prop) =>
  inputType(p) === "select" || hasMap(p) || !!lookupType(p) || isDynamic(p) || get(p, ["rendering", "_variances", "form", "use_custom_dropdown"]) !== undefined;

/** The template Saturn's own app starts a custom dropdown option with (from a real definition). */
const DROPDOWN_TEMPLATE = `<template>
  <!-- Display details -->
  <!-- item.label: The label for the specific option (e.g., "New York", "Active") -->
  <!-- item.value: The actual value that gets stored (e.g., "ny", "1") -->
  <!-- item: Can also be a simple string if options are just ["option1", "option2"] -->
  {{ item.label || item.value || item }}
</template>

<script>
export default {
  props: {
    // Configuration object for this specific form field
    // Contains settings like validation rules, input type, custom options, etc.
    // Example: { type: "select", required: true, input_properties: { allow_create: true } }
    property: Object,

    // The complete form/record data being edited
    // Contains all field values for the current record
    // Example: { name: "John", email: "john@example.com", status: "active" }
    form: {
      type: Object,
      default: {}
    },

    // Individual option data for this dropdown item
    // Can be an object: { label: "Display Text", value: "stored_value" }
    // Or a simple string: "Simple Option"
    // This represents ONE option in the dropdown list
    item: {
      type: Object,
      description: 'Contains each option data',
      default: {}
    },
  }
}
</script>

<style>
/* Add custom styling for this option if needed */
</style>`;

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
const LOOKUP_FUNCTION = "async (form, { Resource, ctx, _, data, logged_in_user, axios, moment, parent, setting }) => {\n  return [];\n}";
const NEW_MAP = { type: "model", value_field: "id", label_field: "", reference: "" };

/** Saturn's hide… settings, which Show everywhere switches together (the Show in switches show them the other way round). */
export const SHOW_PATHS: Path[] = [["hideInForm"], ["hideInForm_add"], ["hideInForm_edit"], ["hideInTable"], ["hideInDrawer"], ["hideInView"]];

/** Show everywhere: on when none of them hides it, off when all of them do, else null (some). */
export function shownEverywhere(p: Prop): boolean | null {
  const hidden = SHOW_PATHS.map((path) => get(p, path) === true);
  return hidden.every((h) => !h) ? true : hidden.every(Boolean) ? false : null;
}

/** A property shown everywhere (each hide… that's set becomes false; one not set stays not set) or hidden
 *  everywhere (each one true). */
export function withShownEverywhere(p: Prop, on: boolean): Prop {
  const next: Prop = { ...p };
  for (const [key] of SHOW_PATHS) if (!on) next[key] = true;
  else if (next[key] !== undefined) next[key] = false;
  return next;
}

/** Where a property's choices come from: the kinds the "Where the choices come from" cards offer. */
export type ChoiceKind = "none" | "values" | "map" | "function" | "lookup" | "dynamic";
export const CHOICE_KINDS: [ChoiceKind, string, string][] = [
  ["none", "None", "People type the value."],
  ["values", "A fixed list", "Choices you type in."],
  ["map", "Another resource", "Pick one of its records."],
  ["function", "A function", "Code that returns the choices."],
  ["lookup", "Other lookup", "Countries, workflow stages, resources…"],
  ["dynamic", "Linked records", "Filled in from records that point back here."],
];

/** The kinds of choices a property has set (none, one, or more than one when several are stored). */
export function choicesOf(p: Prop): ChoiceKind[] {
  const out: ChoiceKind[] = [];
  const t = lookupType(p);
  if (t === "values") out.push("values");
  if (hasMap(p)) out.push("map");
  if (t === "function") out.push("function");
  if (t && !["values", "function"].includes(t)) out.push("lookup");
  if (isDynamic(p)) out.push("dynamic");
  return out.length ? out : ["none"];
}

/** A property with its choices coming from `kind`: that kind switched on (as Saturn stores it) and the others off.
 *  Only the switches change (lookup_type, map, source); what the others hold, like a lookup's values, stays. */
export function withChoices(p: Prop, kind: ChoiceKind): Prop {
  const next: Prop = { ...p };
  const t = lookupType(p);
  // the lookup: its type, or none
  const wantLookup = kind === "values" ? "values" : kind === "function" ? "function" : kind === "lookup" ? (t && !["values", "function"].includes(t) ? t : "lookup") : "";
  if (wantLookup) next.lookup_type = wantLookup;
  else if (p.lookup_type !== undefined) next.lookup_type = "";
  if (kind === "function" && typeof next.lookup_reference !== "string") next.lookup_reference = LOOKUP_FUNCTION;
  // the map
  if (kind === "map") { if (!hasMap(p)) next.map = { ...NEW_MAP }; }
  else delete next.map;
  // the dynamic source
  if (kind === "dynamic") {
    next.source = "dynamic";
    if (next.source_type === undefined) next.source_type = "resource_lookup";
    if (!next.source_definition || typeof next.source_definition !== "object") next.source_definition = { reference: "", bounded_property: "", value_field: "id", default_limit: 10 };
  } else if (isDynamic(p)) next.source = "static";
  return next;
}

/** Shown only for properties whose choices come from `kind`. */
const from = (kind: ChoiceKind) => (p: Prop) => choicesOf(p).includes(kind);
const otherLookup = from("lookup");

export const GROUPS: Group[] = [
  {
    id: "basics",
    title: "Basics",
    blurb: "Its name, what it holds, and how it shows everywhere.",
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
          {
            path: ["type"],
            label: "Type",
            hint: "What kind of value it holds.",
            edit: { kind: "cards", options: TYPES },
          },
          {
            // not stored: it sets the six Show in switches of In forms, In tables and In record views
            id: "showEverywhere",
            path: [],
            sets: SHOW_PATHS,
            label: "Show everywhere",
            hint: "Shows or hides it in forms (add and edit too), tables, drawers and record views at once. Half on: shown in some.",
            edit: { kind: "showAll" },
          },
          { path: ["description"], label: "Description", single: true, edit: { kind: "textarea" } },
          { path: ["meta_tags"], label: "Meta tags", edit: { kind: "tags", placeholder: "Type a tag, press Enter" } },
          { path: ["propertyIcon"], label: "Icon", hint: "A Font Awesome icon.", edit: { kind: "icon" } },
        ],
      },
      {
        title: "Shown everywhere with",
        settings: [
          { path: ["rendering", "component"], label: "Default renderer", hint: "Used in tables, record views and forms unless they set their own.", edit: { kind: "select", options: RENDERERS } },
          {
            path: ["rendering", "options", "currency", "value"],
            label: "Currency",
            when: (p) => get(p, ["rendering", "component"]) === "currency",
            alongside: [{ path: ["rendering", "options", "currency", "type"], value: "property" }],
            edit: { kind: "text", mono: true, placeholder: "USD" },
          },
          {
            // as a real definition stores it: rendering.options.code = {type: "property", value: "<template>…"}
            path: ["rendering", "options", "code", "value"],
            label: "Component code",
            hint: "The Vue component that shows the value: its <template>, and its <script> if it has one.",
            // shown for the Inline component renderer, and whenever code is stored (real definitions keep it under
            // the Default renderer too)
            when: (p) => get(p, ["rendering", "component"]) === "inline-component" || get(p, ["rendering", "options", "code", "value"]) !== undefined,
            alongside: [{ path: ["rendering", "options", "code", "type"], value: "property" }],
            edit: { kind: "code", lang: "html", empty: INLINE_START },
          },
          // the File manager renderer's options, as a real definition stores them: {<option>: {value}}
          { path: ["rendering", "options", "title", "value"], label: "File manager title", when: (p) => get(p, ["rendering", "component"]) === "FileManagerUploader", edit: { kind: "text", placeholder: "Application documents" } },
          { path: ["rendering", "options", "helperText", "value"], label: "Helper text", hint: "Shown under the title.", when: (p) => get(p, ["rendering", "component"]) === "FileManagerUploader", edit: { kind: "text" } },
          { path: ["rendering", "options", "resourceName", "value"], label: "Files belong to", hint: "The resource the uploaded files are kept against.", when: (p) => get(p, ["rendering", "component"]) === "FileManagerUploader", edit: { kind: "resource" } },
          {
            path: ["rendering", "options", "property", "value"],
            label: "Property",
            hint: "The property of that resource the files are kept in.",
            when: (p) => get(p, ["rendering", "component"]) === "FileManagerUploader",
            edit: { kind: "field", of: (p) => (get(p, ["rendering", "options", "resourceName", "value"]) as string) || null },
          },
          { path: ["rendering", "options", "maxFiles", "value"], label: "Most files", hint: "How many files can be uploaded.", when: (p) => get(p, ["rendering", "component"]) === "FileManagerUploader", edit: { kind: "number", min: 1 } },
          { path: ["format"], label: "Date format", when: (p) => p.type === "date" || p.format !== undefined, edit: { kind: "text", mono: true, placeholder: "DD/MM/YYYY" } },
        ],
      },
    ],
  },
  {
    id: "rules",
    title: "Rules",
    blurb: "What a value must be, and what it starts as.",
    parts: [
      {
        settings: [
          { path: ["required"], label: "Required", edit: { kind: "bool", hint: "Must be filled in on forms." } },
          { path: ["unique"], label: "Unique", edit: { kind: "bool", hint: "No two records can have the same value." } },
          { path: ["email"], label: "Email", edit: { kind: "bool", hint: "Must be an email address." } },
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
    id: "choices",
    title: "Choices",
    blurb: "Where the choices people pick from come from.",
    copies: [["lookup_type"], ["map"], ["source"]],
    parts: [
      {
        settings: [
          {
            // not stored: it reads and sets lookup_type, map and source (choicesOf / withChoices)
            id: "choices",
            path: [],
            sets: [["lookup_type"], ["lookup_reference"], ["map"], ["source"], ["source_type"], ["source_definition"]],
            label: "Where the choices come from",
            hint: "Picking one switches the others off. What they held is kept, so switching back brings it back until you save.",
            edit: { kind: "choices" },
          },
        ],
      },
      {
        title: "A fixed list",
        when: from("values"),
        settings: [
          { id: "lookup_reference.values", path: ["lookup_reference"], label: "Values", hint: "The choices, in order.", when: (p) => lookupType(p) === "values", edit: { kind: "csv" } },
          {
            path: ["sort_lookup_reference"],
            label: "Sort",
            when: (p) => lookupType(p) === "values",
            edit: { kind: "select", options: [["", "As listed"], ["asc", "A to Z"], ["desc", "Z to A"]] },
          },
        ],
      },
      {
        title: "Another resource",
        when: from("map"),
        settings: [
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
        title: "A function",
        when: from("function"),
        settings: [
          // Saturn keeps the function in lookup_reference, and the type of each item it returns beside it
          {
            id: "lookup_reference.function",
            path: ["lookup_reference"],
            label: "Lookup function",
            hint: "Runs to give the choices. It gets the form and Saturn's helpers, and returns a list.",
            when: (p) => lookupType(p) === "function",
            edit: { kind: "code", lang: "javascript", empty: LOOKUP_FUNCTION },
          },
          {
            path: ["lookup_function_item_data_type"],
            label: "Item data type",
            hint: "What each item the function returns is.",
            when: (p) => lookupType(p) === "function",
            edit: { kind: "select", options: [["string", "String"]] },
          },
        ],
      },
      {
        title: "Other lookup",
        when: (p) => otherLookup(p) || p.lookup_value_field !== undefined || p.lookup_label_type !== undefined || typeof p.lookup_label === "string",
        settings: [
          {
            path: ["lookup_type"],
            label: "Lookup source",
            when: otherLookup,
            edit: {
              kind: "select",
              options: [
                ["lookup", "Lookup"],
                ["countries", "Countries"],
                ["workflow_stages", "Workflow stages"],
                ["resources", "Resources"],
                ["resource_properties", "Resource properties"],
                ["map", "Map"],
              ],
            },
          },
          {
            id: "lookup_reference.text",
            path: ["lookup_reference"],
            label: "Reference",
            // a lookup's reference; other lookup types (a map) can store one too, shown so it can be seen and changed
            when: (p) => lookupType(p) === "lookup" || (typeof p.lookup_reference === "string" && !["values", "function"].includes(lookupType(p))),
            edit: { kind: "text", mono: true },
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
        title: "Linked records",
        when: hasSource,
        settings: [
          { path: ["source_type"], label: "Source type", when: hasSource, edit: { kind: "select", options: [["resource_lookup", "Resource lookup"]] } },
          { path: ["source_definition", "reference"], label: "Reference", hint: "The resource the records come from.", when: hasSource, edit: { kind: "resource" } },
          {
            path: ["source_definition", "bounded_property"],
            label: "Linked by",
            hint: "The property of those records that points back to this one.",
            when: hasSource,
            edit: { kind: "field", of: (p) => (get(p, ["source_definition", "reference"]) as string) || null },
          },
          { path: ["source_definition", "value_field"], label: "Value field", when: hasSource, edit: { kind: "field", of: (p) => (get(p, ["source_definition", "reference"]) as string) || null } },
          { path: ["source_definition", "default_limit"], label: "Default limit", when: hasSource, edit: { kind: "number", min: 0 } },
        ],
      },
    ],
  },
  {
    id: "form",
    title: "In forms",
    blurb: "How people fill it in on add and edit forms.",
    place: ["hideInForm"],
    parts: [
      {
        settings: [
          { path: ["hideInForm"], label: "Show in forms", edit: { kind: "bool", invert: true } },
          { path: ["hideInForm_add"], label: "Show in add forms", edit: { kind: "bool", invert: true } },
          { path: ["hideInForm_edit"], label: "Show in edit forms", edit: { kind: "bool", invert: true } },
          {
            path: ["form_visibility"],
            label: "Only show when",
            hint: "A function: it shows in forms only when the function returns true.",
            toggles: { on: { evaluator: "function", data: NEW_FUNCTION } },
            edit: { kind: "bool" },
          },
          { path: ["form_visibility", "data"], label: "Function", when: (p) => !!p.form_visibility, edit: { kind: "code", lang: "javascript", empty: NEW_FUNCTION } },
        ],
      },
      {
        title: "Input",
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
            path: ["acl"],
            label: "File access",
            hint: "Who can open the uploaded files, as Saturn stores it (for example public).",
            when: (p) => inputType(p) === "typed_file_upload" || p.acl !== undefined,
            edit: { kind: "text", mono: true },
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
      {
        title: "Look",
        settings: [
          { path: ["form_number_of_columns", "full_width"], label: "Full width", edit: { kind: "bool" } },
          { path: ["form_number_of_columns", "default"], label: "Columns", edit: { kind: "number", min: 1, max: 12 } },
          {
            // as a real definition stores it: rendering._variances.form.{use_custom_dropdown, custom_dropdown_template}
            path: ["rendering", "_variances", "form", "use_custom_dropdown"],
            label: "Custom dropdown style",
            when: hasDropdown,
            alongside: [{ path: ["rendering", "_variances", "form", "custom_dropdown_template"], value: DROPDOWN_TEMPLATE }],
            edit: { kind: "bool", hint: "Each option in the form's dropdown is drawn by your own Vue template." },
          },
          {
            path: ["rendering", "_variances", "form", "custom_dropdown_template"],
            label: "Dropdown option template",
            hint: "A Vue component for one option. It gets item (the option: {label, value} or a string), form (the record being edited) and property.",
            when: (p) => get(p, ["rendering", "_variances", "form", "use_custom_dropdown"]) === true,
            edit: { kind: "code", lang: "html", empty: DROPDOWN_TEMPLATE },
          },
        ],
      },
    ],
  },
  {
    id: "table",
    title: "In tables",
    blurb: "How it shows as a column in tables.",
    place: ["hideInTable"],
    parts: [
      {
        settings: [
          { path: ["hideInTable"], label: "Show in tables", edit: { kind: "bool", invert: true } },
          { path: ["rendering", "_variances", "list", "component"], label: "Renderer", edit: { kind: "select", options: RENDERERS } },
          {
            path: ["rendering", "_variances", "list", "options", "currency", "value"],
            label: "Currency",
            when: (p) => variance(p, "list") === "currency",
            alongside: [{ path: ["rendering", "_variances", "list", "options", "currency", "type"], value: "property" }],
            edit: { kind: "text", mono: true, placeholder: "USD" },
          },
          {
            path: ["rendering", "_variances", "list", "options", "code", "value"],
            label: "Component code",
            hint: "The Vue component that shows the value in tables.",
            when: (p) => variance(p, "list") === "inline-component" || get(p, ["rendering", "_variances", "list", "options", "code", "value"]) !== undefined,
            alongside: [{ path: ["rendering", "_variances", "list", "options", "code", "type"], value: "property" }],
            edit: { kind: "code", lang: "html", empty: INLINE_START },
          },
          { path: ["tableColumnWidth"], label: "Column width", hint: "In pixels. 0 = automatic.", edit: { kind: "number", min: 0, step: 10 } },
          { path: ["searchable"], label: "Searchable", edit: { kind: "bool", hint: "Included when people search the table." } },
          { path: ["search_field_type"], label: "Search input type", when: (p) => p.searchable === true, edit: { kind: "select", options: [["", "Not set"], ["input", "Input"]] } },
          { path: ["required_columns"], label: "Columns to load with it", hint: "Other properties the table loads with this one (Saturn: Required dependent columns).", edit: { kind: "ownFields" } },
        ],
      },
    ],
  },
  {
    id: "view",
    title: "In record views",
    blurb: "How it shows when a record is opened, and in drawers.",
    place: ["hideInView"],
    parts: [
      {
        settings: [
          { path: ["hideInView"], label: "Show in record views", edit: { kind: "bool", invert: true } },
          { path: ["hideInDrawer"], label: "Show in drawers", edit: { kind: "bool", invert: true } },
          { path: ["rendering", "_variances", "view", "component"], label: "Renderer", edit: { kind: "select", options: RENDERERS } },
          {
            path: ["rendering", "_variances", "view", "options", "currency", "value"],
            label: "Currency",
            when: (p) => variance(p, "view") === "currency",
            alongside: [{ path: ["rendering", "_variances", "view", "options", "currency", "type"], value: "property" }],
            edit: { kind: "text", mono: true, placeholder: "USD" },
          },
          {
            path: ["rendering", "_variances", "view", "options", "code", "value"],
            label: "Component code",
            hint: "The Vue component that shows the value in the record view: its <template>, and its <script> if it has one.",
            when: (p) => variance(p, "view") === "inline-component" || get(p, ["rendering", "_variances", "view", "options", "code", "value"]) !== undefined,
            alongside: [{ path: ["rendering", "_variances", "view", "options", "code", "type"], value: "property" }],
            edit: { kind: "code", lang: "html", empty: INLINE_START },
          },
          { path: ["default_view"], label: "Default view", edit: { kind: "view" } },
          { path: ["disable_popover"], label: "Disable popover", edit: { kind: "bool", hint: "No preview when hovering." } },
        ],
      },
      {
        title: "Layout",
        settings: [
          {
            path: ["position"],
            label: "Placement",
            edit: { kind: "select", options: [["", "Not set"], ["picture", "Picture"], ["sub_heading", "Sub heading"], ["title", "Title"]] },
          },
          { path: ["rendering", "_variances", "view", "span"], label: "Span", edit: { kind: "number", min: 1, max: 12 } },
          { path: ["number_of_columns", "full_width"], label: "Full width", edit: { kind: "bool" } },
          { path: ["number_of_columns", "default"], label: "Columns", edit: { kind: "number", min: 1, max: 12 } },
          { path: ["placeInOwnTab"], label: "Add to separate tab", edit: { kind: "bool" } },
          { path: ["tabIcon"], label: "Tab icon", when: (p) => p.placeInOwnTab === true, edit: { kind: "icon" } },
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
        settings: [{ path: ["access_control"], label: "Access rules", hint: "Who the rules let in. Saved as Saturn stores them.", edit: { kind: "access" } }],
      },
    ],
  },
  {
    id: "advanced",
    title: "Advanced",
    blurb: "Settings that are rarely needed.",
    folded: true,
    parts: [
      {
        settings: [
          { path: ["hide"], label: "Hide from the API", edit: { kind: "bool", hint: "Never sent in API responses." } },
          { path: ["ipaddress"], label: "IP address", edit: { kind: "bool", hint: "Must be an IPv4 or IPv6 address." } },
          {
            path: ["source"],
            label: "Value source",
            hint: "Saturn's own switch for Linked records (Choices).",
            edit: { kind: "choice", options: [["static", "Static", "A value people enter."], ["dynamic", "Dynamic", "Filled in from other records."]] },
          },
          // per screen size, as some real definitions store them (shown when set)
          { path: ["number_of_columns", "md"], label: "Record view columns on medium screens", when: (p) => get(p, ["number_of_columns", "md"]) !== undefined, edit: { kind: "number", min: 1, max: 12 } },
          { path: ["number_of_columns", "lg"], label: "Record view columns on large screens", when: (p) => get(p, ["number_of_columns", "lg"]) !== undefined, edit: { kind: "number", min: 1, max: 12 } },
        ],
      },
    ],
  },
];

/** A setting's id, for Favourites: its own id, else its path ("input_properties.type"). */
export const settingId = (s: Setting) => s.id ?? s.path.join(".");

/** What Paste settings copies for the groups switched on: their settings' paths (never the key). */
export const pastePaths = (on: Record<string, boolean>): Path[] =>
  GROUPS.filter((g) => on[g.id]).flatMap((g) => [...g.parts.flatMap((part) => part.settings.map((s) => s.path)), ...(g.copies ?? [])]).filter((p) => p.length > 0 && p[0] !== "key");

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

