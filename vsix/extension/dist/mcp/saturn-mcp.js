/*
 * sonover-code — the extension's MCP server (Node): JSON-RPC over stdio, giving an AI CLI the saturn_* tools.
 *
 * Shipped by the original 0.1.1 build as a minified esbuild bundle; made readable here:
 * formatted, the app code's variables named and commented, icons named after themselves.
 * Library code (React, lucide-react, tailwind-merge, …) is marked by "──── Library: … ────"
 * comments and left as it was, names minified; "──── App: … ────" starts this extension's code.
 * build.mjs minifies this file into the package; package.sh proves (tools/same-code.mjs) that
 * the minified file is the same program. Rename with tools/rename.mjs, not by hand.
 */
"use strict";

// ResponseTooLargeError (minified: z) — Error: a response was bigger than the size cap.
// Next, NO_BODY_STATUSES (minified: Nt): HTTP statuses that never carry a body.
var ResponseTooLargeError = class extends Error {
    constructor(limitBytes) {
      super(`The server's response was larger than ${Math.round(limitBytes / (1024 * 1024))} MB, so it was not read.`), this.name = "ResponseTooLargeError";
    }
  },
  NO_BODY_STATUSES = new Set([101, 204, 205, 304]);
// capResponseSize (minified: j) — Wraps a fetch Response so reading more than the cap (50 MB by default) fails.
function capResponseSize(response, maxBytes = 52428800) {
  let declaredLength = Number(response.headers.get("content-length"));
  // A declared length over the cap fails at once, before anything is read.
  if (Number.isFinite(declaredLength) && declaredLength > maxBytes) throw response.body?.cancel().catch(() => {}), new ResponseTooLargeError(maxBytes);
  if (!response.body || NO_BODY_STATUSES.has(response.status)) return response;
  // Otherwise count the bytes as they stream and fail once past the cap.
  let received = 0,
    limitedBody = response.body.pipeThrough(new TransformStream({
      transform(chunk, controller) {
        if (received += chunk.byteLength, received > maxBytes) {
          controller.error(new ResponseTooLargeError(maxBytes));
          return;
        }
        controller.enqueue(chunk);
      }
    }));
  return new Response(limitedBody, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers
  });
}
// readline (minified: xt) — ──── App: Node requires; helpers: step counting, workflow/step search and ranking, secret-key detection, resource route names, record list query/format/trim, record data validation, core-resource checks, backup file names, operator param mapping (property_updater) ────
// readline (minified: xt) — Node modules: readline (minified: xt) reads the JSON-RPC messages from stdin line by line;
// net (minified: $t) is the local socket for approval round-trips with the extension; nodeCrypto (minified: Pt) is node:crypto.
var readline = require("node:readline"),
  net = require("node:net"),
  nodeCrypto = require("node:crypto");
// nonBlankString (minified: _) — The value if it is a string with something other than spaces, else null.
// Next, arrayOrEmpty (minified: K): the value if it's an array, else [].
var nonBlankString = value => typeof value == "string" && value.trim() ? value : null,
  arrayOrEmpty = value => Array.isArray(value) ? value : [];
// countCommandSteps (minified: v) — Counts the operator steps (type "command") anywhere under a node.
function countCommandSteps(node) {
  if (!node || typeof node != "object") return 0;
  let count = node.type === "command" ? 1 : 0;
  for (let child of Object.values(node)) if (Array.isArray(child)) for (let item of child) count += countCommandSteps(item);else child && typeof child == "object" && (count += countCommandSteps(child));
  return count;
}
// searchEntries (minified: vt) — A workflow's stages, actions and commands as flat search entries (with workflow id/name, kind, path and step count).
function searchEntries(workflow) {
  let workflowId = nonBlankString(workflow?.id) ?? "",
    workflowName = nonBlankString(workflow?.name) ?? workflowId,
    base = {
      workflow_id: workflowId,
      workflow: workflowName
    },
    entries = [];
  return arrayOrEmpty(workflow?.stages).forEach((stage, stageIndex) => {
    let stageName = nonBlankString(stage?.stage) ?? "";
    entries.push({
      ...base,
      kind: "stage",
      stage: null,
      name: stageName,
      label: nonBlankString(stage?.label),
      id: nonBlankString(stage?.id),
      path: ["stages", stageIndex]
    }), arrayOrEmpty(stage?.actions).forEach((action, actionIndex) => {
      entries.push({
        ...base,
        kind: "action",
        stage: stageName,
        name: nonBlankString(action?.action) ?? "",
        label: nonBlankString(action?.label),
        id: nonBlankString(action?.id),
        path: ["stages", stageIndex, "actions", actionIndex],
        steps: countCommandSteps(action?.task)
      });
    });
  }), arrayOrEmpty(workflow?.actions).forEach((action, actionIndex) => {
    entries.push({
      ...base,
      kind: "action",
      stage: null,
      name: nonBlankString(action?.action) ?? "",
      label: nonBlankString(action?.label),
      id: nonBlankString(action?.id),
      path: ["actions", actionIndex],
      steps: countCommandSteps(action?.task)
    });
  }), arrayOrEmpty(workflow?.commands).forEach((command, commandIndex) => {
    entries.push({
      ...base,
      kind: "command",
      stage: null,
      name: nonBlankString(command?.name) ?? "",
      label: nonBlankString(command?.label),
      id: nonBlankString(command?.id),
      path: ["commands", commandIndex],
      steps: countCommandSteps(command?.command)
    });
  }), entries;
}
// normalizeSearchText (minified: le) — Lower case, with _ - . and runs of spaces turned into one space (so search ignores them).
function normalizeSearchText(text) {
  return text.toLowerCase().replace(/[_\-.]+/g, " ").replace(/\s+/g, " ").trim();
}
// searchScore (minified: Ft) — How well a search entry matches a query: 3 exact name/label/id, 2 prefix, 1 every word found (or empty query), 0 no match.
function searchScore(entry, query) {
  let needle = normalizeSearchText(query);
  if (!needle) return 1;
  let names = [entry.name, entry.label ?? "", entry.id ?? ""].map(normalizeSearchText).filter(Boolean);
  if (names.some(candidate => candidate === needle)) return 3;
  if (names.some(candidate => candidate.startsWith(needle))) return 2;
  let haystack = [...names, normalizeSearchText(entry.stage ?? "")].join(" ");
  return needle.split(" ").every(word => haystack.includes(word)) ? 1 : 0;
}
// searchWorkflows (minified: Fe) — The saturn_search_workflows search: entries of the given kinds (optionally one workflow) ranked by searchScore, then by workflow and name; the first 50 hits and the total.
function searchWorkflows(workflows, query, kinds, workflowId = null) {
  let ranked = workflows.filter(item => !workflowId || item?.id === workflowId).flatMap(searchEntries).filter(item => !kinds || kinds.length === 0 || kinds.includes(item.kind)).map(item => ({
    hit: item,
    score: searchScore(item, query)
  })).filter(scored => scored.score > 0).sort((scored, other) => other.score - scored.score || scored.hit.workflow.localeCompare(other.hit.workflow) || scored.hit.name.localeCompare(other.hit.name));
  return {
    hits: ranked.slice(0, 50).map(scored => scored.hit),
    total: ranked.length
  };
}
// CREDENTIAL_KEY_RE (minified: It) — Field names that look like credentials; the agent never sees or writes these.
var CREDENTIAL_KEY_RE = /pass(?:word|wd|code|phrase)?$|^pass|secret|token|api[_-]?key|private[_-]?key|hash|salt|otp|mfa|2fa|totp|credential|session|cookie|authorization|refresh/i;
// isCredentialKey (minified: J) — Does this field name look like a credential?
function isCredentialKey(key) {
  return CREDENTIAL_KEY_RE.test(key);
}
// isResourceName (minified: F) — Is this a plausible resource name (a letter, then letters, digits or _; at most 100)?
function isResourceName(value) {
  return typeof value == "string" && /^[A-Za-z][A-Za-z0-9_]{0,99}$/.test(value);
}
// recordRoutes (minified: G) — The routes a resource's records may live at: SystemLog -> /systemlogs, /systemlog, … (plural forms first).
function recordRoutes(resource) {
  if (!isResourceName(resource)) return [];
  let lower = resource.toLowerCase(),
    names = [`${lower}s`];
  lower.endsWith("s") && names.push(lower, `${lower}es`), lower.length > 1 && lower.endsWith("y") && !"aeiou".includes(lower[lower.length - 2]) && names.push(`${lower.slice(0, -1)}ies`), /(x|z|ch|sh)$/.test(lower) && names.push(`${lower}es`), lower.endsWith("person") && names.push(`${lower.slice(0, -6)}people`), names.push(lower);
  let camel = resource.charAt(0).toLowerCase() + resource.slice(1);
  return names.push(/[^aeiou]y$/i.test(camel) ? `${camel.slice(0, -1)}ies` : /(s|x|z|ch|sh)$/i.test(camel) ? `${camel}es` : `${camel}s`), [...new Set(names)].map(routeName => `/${routeName}`);
}
// isMissingRoute (minified: ue) — 404 or "route not found": try the next route name.
function isMissingRoute(httpStatus, body) {
  if (httpStatus === 404) return !0;
  let message = body && typeof body == "object" ? body.message : void 0;
  return typeof message == "string" && /route not found/i.test(message);
}
// isRouteNotFound (minified: de) — The body says "route not found" (whatever the status).
function isRouteNotFound(httpStatus, body) {
  let message = body && typeof body == "object" ? body.message : void 0;
  return typeof message == "string" && /route not found/i.test(message);
}
// recordQuery (minified: Ie) — ?limit=&page=&filter= for a record list.
function recordQuery(options) {
  let params = new URLSearchParams();
  return params.set("limit", String(options.limit)), params.set("page", String(options.page)), options.filter && params.set("filter", options.filter), `?${params.toString()}`;
}
// recordsFromBody (minified: Le) — {data, count|total} (or a bare array) -> {records, total}; only object records are kept.
function recordsFromBody(body) {
  let records = (Array.isArray(body) ? body : Array.isArray(body?.data) ? body.data : []).filter(item => !!item && typeof item == "object" && !Array.isArray(item)),
    total = typeof body?.count == "number" ? body.count : typeof body?.total == "number" ? body.total : null;
  return {
    records: records,
    total: total
  };
}
// shortenForAgent (minified: x) — A copy of a value for the agent: credential-like keys dropped, strings over 500 characters cut, arrays over 20 items cut, nesting below 4 levels summarised.
function shortenForAgent(value, depth = 0) {
  if (typeof value == "string") return value.length > 500 ? `${value.slice(0, 500)}\u2026 (${value.length} chars)` : value;
  if (!value || typeof value != "object") return value;
  if (depth >= 4) return Array.isArray(value) ? `[${value.length} items]` : "{\u2026}";
  if (Array.isArray(value)) {
    let items = value.slice(0, 20).map(item => shortenForAgent(item, depth + 1));
    return value.length > 20 ? [...items, `\u2026 ${value.length - 20} more`] : items;
  }
  let copy = {};
  for (let [key, fieldValue] of Object.entries(value)) isCredentialKey(key) || (copy[key] = shortenForAgent(fieldValue, depth + 1));
  return copy;
}
// formatRecordsForAgent (minified: De) — The saturn_list_records tool's answer: the records (only the asked-for fields), shortened, as JSON of at most ~24,000 characters.
function formatRecordsForAgent(resource, records, options) {
  let shown = records.slice(0, options.limit).map(record => {
      if (!options.fields) return shortenForAgent(record);
      let picked = {};
      for (let field of ["id", ...options.fields]) field in record && (picked[field] = record[field]);
      return shortenForAgent(picked);
    }),
    header = {
      resource: resource,
      page: options.page,
      returned: shown.length,
      ...(options.total !== null ? {
        total: options.total
      } : {}),
      note: "Credential-like fields are never included. Long text is shortened."
    },
    json = JSON.stringify({
      ...header,
      records: shown
    }, null, 1),
    count = shown.length;
  // Too long: halve the number of records until it fits (or one is left).
  for (; json.length > 24e3 && count > 1;) count = Math.max(1, Math.floor(count / 2)), json = JSON.stringify({
    ...header,
    returned: count,
    records: shown.slice(0, count),
    truncated: `Only ${count} of ${shown.length} fit; ask for fewer fields or a smaller limit.`
  }, null, 1);
  return json;
}
// MANAGED_RECORD_FIELDS (minified: Lt) — Fields the instance manages; the agent may not write them.
var MANAGED_RECORD_FIELDS = new Set(["id", "_id", "created_at", "updated_at", "deleted_at", "created_by", "updated_by"]);
// checkAgentRecordData (minified: pe) — Checks the `data` the agent wants to write to a record: an object of 1 to 100 fields, no credential-like or managed fields. Returns {data} or {error}.
function checkAgentRecordData(data) {
  if (!data || typeof data != "object" || Array.isArray(data)) return {
    error: "`data` must be an object of field values."
  };
  let entries = Object.entries(data);
  if (entries.length === 0) return {
    error: "`data` has no fields to write."
  };
  if (entries.length > 100) return {
    error: "`data` has more than 100 fields."
  };
  let credentialKeys = entries.map(([key]) => key).filter(isCredentialKey);
  if (credentialKeys.length > 0) return {
    error: `${credentialKeys.join(", ")} look like credentials, which the agent may not set. Ask the user to change them in Saturn.`
  };
  let managedKeys = entries.map(([key]) => key).filter(key => MANAGED_RECORD_FIELDS.has(key) || key.startsWith("__"));
  return managedKeys.length > 0 ? {
    error: `${managedKeys.join(", ")} are managed by the instance and cannot be written.`
  } : {
    data: Object.fromEntries(entries)
  };
}
// recordIdForUrl (minified: fe) — A record id the agent gave, encoded for a URL; null if it is empty, too long or "." / "..".
function recordIdForUrl(id) {
  return typeof id == "number" && Number.isSafeInteger(id) ? String(id) : typeof id != "string" || !id.trim() || id.length > 200 || id === "." || id === ".." ? null : encodeURIComponent(id);
}
// AGENT_WRITABLE_CORE_RESOURCES (minified: Dt) — Core resources whose records the agent may still change.
var AGENT_WRITABLE_CORE_RESOURCES = new Set(["Workflow", "WorkflowTrigger", "ResourceDetail", "SaturnUIComponent", "Dashboard", "UserDashboard", "Menu", "ResourceView", "Permission", "UserGroup", "Lookup", "LookupCategory", "Upload", "ResourceLog", "AttachmentGroup", "Attachment_type", "EvaluationCriteria"]);
// coreResourceRefusal (minified: ge) — Why the agent may not change this resource's records (a core platform resource, or the core catalog could not be read); null if it may.
function coreResourceRefusal(resource, coreResources) {
  return coreResources === null ? "Could not read this instance's catalog of core resources, so no record was changed. Try again." : coreResources.has(resource) && !AGENT_WRITABLE_CORE_RESOURCES.has(resource) ? `${resource} is a core Saturn platform resource; its records are not changed by the agent. Reading them is fine. Ask the user to change it in Saturn.` : null;
}
// RESTORE_SKIPPED_FIELDS (minified: Mt) — Fields left out when a backed-up record is written back.
var RESTORE_SKIPPED_FIELDS = new Set(["_permissions_", "field_restrictions", "id", "created_at", "updated_at"]);
// restorableFields (minified: Me) — A backed-up record's fields worth writing back: no managed fields, no empty values.
function restorableFields(record) {
  return Object.fromEntries(Object.entries(record).filter(([key, fieldValue]) => !RESTORE_SKIPPED_FIELDS.has(key) && fieldValue !== "" && fieldValue !== null && fieldValue !== void 0 && !(Array.isArray(fieldValue) && fieldValue.length === 0) && !(fieldValue && typeof fieldValue == "object" && !Array.isArray(fieldValue) && Object.keys(fieldValue).length === 0)));
}
// compactTimestamp (minified: Ut) — A date as 20260101T120000Z (for backup file names).
function compactTimestamp(date) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}
// recordBackupName (minified: me) — The file name of a record backup: <resource>.<id>.<tag>.<timestamp>.json.
function recordBackupName(resource, id, tag, date) {
  let safeId = decodeURIComponent(id).replace(/[^A-Za-z0-9_-]/g, "_").slice(0, 100);
  return `${resource}.${safeId}.${tag}.${compactTimestamp(date)}.json`;
}
// parseRecordBackupName (minified: E) — The parts of a record backup file name ({resource, id, tag, stamp}), or null if it is not one.
function parseRecordBackupName(fileName) {
  if (typeof fileName != "string") return null;
  let match = /^([A-Za-z][A-Za-z0-9_]{0,99})\.([A-Za-z0-9_-]{1,100})\.(pre-update|pre-delete|pre-restore)\.(\d{8}T\d{6}Z)\.json$/.exec(fileName);
  return match ? {
    resource: match[1],
    id: match[2],
    tag: match[3],
    stamp: match[4]
  } : null;
}
// isFoundRecord (minified: I) — Is this a real record (a non-empty object with an id)?
function isFoundRecord(record) {
  return !!record && typeof record == "object" && !Array.isArray(record) && Object.keys(record).length > 0 && record.id !== void 0;
}
// asArray (minified: m) — The value if it's an array, else [].
function asArray(value) {
  return Array.isArray(value) ? value : [];
}
// nonEmptyString (minified: d) — The value if it's a non-empty string, else null.
function nonEmptyString(value) {
  return typeof value == "string" && value.length > 0 ? value : null;
}
// finiteNumber (minified: he) — The value if it's a finite number, else null.
function finiteNumber(value) {
  return typeof value == "number" && Number.isFinite(value) ? value : null;
}
// humanize (minified: b) — "some_name" -> "Some name"
function humanize(text) {
  let spaced = text.replace(/[_-]+/g, " ").trim();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}
// MERGED_PARAMS (minified: we) — property_updater: properties is edited as one map (resource_property / value are merged into it).
var MERGED_PARAMS = {
  property_updater: {
    into: "properties",
    key: "resource_property",
    value: "value"
  }
};
// mergedParam (minified: Wt) — The merge rule a param is folded into (so it is hidden as its own param), or null.
function mergedParam(operator, param) {
  let merge = operator ? MERGED_PARAMS[operator] : void 0;
  return merge && (param === merge.key || param === merge.value) ? merge : null;
}
// mergeParams (minified: Bt) — Folds merged params into their map (resource_property / value -> properties[key] = value).
function mergeParams(operator, data) {
  let merge = operator ? MERGED_PARAMS[operator] : void 0;
  if (!merge) return data;
  let mapKey = (nonEmptyString(data[merge.key]) ?? "").trim();
  if (mapKey === "") return data;
  let existing = data[merge.into],
    map = existing && typeof existing == "object" && !Array.isArray(existing) ? {
      ...existing
    } : {};
  map[mapKey] = data[merge.value] ?? "";
  let merged = {
    ...data,
    [merge.into]: map
  };
  return delete merged[merge.key], delete merged[merge.value], merged;
}
// EMAIL_TEMPLATE_HTML (minified: Vt) — ──── App: HTML preview page template, code-param detection, Resource-name extraction, SVG sanitizer ────
// EMAIL_TEMPLATE_HTML (minified: Vt) — Default value of an email `message` param: a starter HTML email (table layout, as email clients need).
// Next, HTML_CONTENT_TEMPLATE (minified: qt): the default of an operator's `html` object param, a starter block of HTML content.
var EMAIL_TEMPLATE_HTML = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ subject }}</title>
  </head>
  <body style="margin:0;padding:0;background:#f4f4f5;">
    <!-- A table, not a div: email clients are twenty years behind a browser. -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td align="center" style="padding:24px 12px;">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"
                 style="max-width:600px;background:#ffffff;border-radius:8px;">
            <tr>
              <td style="padding:24px;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:24px;color:#18181b;">
                <h1 style="margin:0 0 16px;font-size:20px;line-height:28px;">Heading</h1>
                <p style="margin:0 0 16px;">
                  Hello {{ _resource.name }}, write the message here.
                </p>
                <p style="margin:0;">
                  <a href="{{ _util.app_url }}"
                     style="display:inline-block;padding:10px 18px;background:#2563eb;color:#ffffff;text-decoration:none;border-radius:6px;">
                    Open
                  </a>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`,
  HTML_CONTENT_TEMPLATE = `<div style="font-family:Arial,Helvetica,sans-serif;color:#18181b;">
  <h1 style="margin:0 0 12px;font-size:20px;line-height:28px;">Heading</h1>
  <p style="margin:0 0 12px;line-height:22px;">
    Hello {{ _resource.name }}, write the content here.
  </p>
</div>
`;
// codeLanguageOf (minified: Ht) — Which code editor a param gets (javascript, html, css or json), guessed from the operator, param name, default value, description, type and label; null for plain text.
function codeLanguageOf(operator, param, defaultValue, description, type, label) {
  if (/^(code|evaluator|script|fn|function|expression)$/i.test(param) || /^\s*(async\s+)?(function\b|\([^)]*\)\s*=>)/.test(defaultValue) || description && /javascript code to execute/i.test(description)) return "javascript";
  let hints = `${label ?? ""} ${description ?? ""}`;
  return /^html$/i.test(operator) && type === "object" || /^message$/i.test(param) && type === "object" || /\bhtml\b/i.test(hints) ? "html" : /\bcss\b/i.test(`${param} ${hints}`) ? "css" : /\bjson\b/i.test(hints) ? "json" : null;
}
// simpleResourceLookup (minified: Ue) — Recognises a lookup function that only lists one resource (`new Resource(x, "Name")` … `.list(`) and returns {resource}; null if it does anything more (filters, maps, conditions).
function simpleResourceLookup(source) {
  if (!source) return null;
  let pattern = /new\s+Resource\s*\(\s*[A-Za-z_$][\w$]*\s*,\s*["'`]([A-Za-z0-9_]+)["'`]\s*\)/g,
    matches = [...source.matchAll(pattern)];
  return matches.length !== 1 || !/\.\s*list\s*\(/.test(source) || /\.\s*(filter|map|reduce|slice|find|sort)\s*\(/.test(source) || /\bif\s*\(|\?\s*[^:]*:/.test(source) ? null : {
    resource: matches[0][1]
  };
}
// SVG_TAGS (minified: zt) — SVG tags allowed in an operator icon. Next: SVG_ATTRIBUTES (minified: Kt), the attributes allowed;
// SVG_DROPPED_ELEMENTS_RE (minified: Jt), elements removed with everything inside them (scripts, styles, embedded content, animation);
// SVG_TAG_RE (minified: We), one tag with its attributes (sticky, matched at a given index);
// SVG_ATTRIBUTE_RE (minified: Gt), one attribute and its value (double-quoted, single-quoted or bare).
var SVG_TAGS = new Set(["svg", "g", "path", "circle", "ellipse", "rect", "line", "polyline", "polygon", "defs", "lineargradient", "radialgradient", "stop", "title", "desc", "clippath", "mask", "text", "tspan", "symbol", "use"]),
  SVG_ATTRIBUTES = new Set(["xmlns", "xmlns:xlink", "version", "viewbox", "width", "height", "x", "y", "x1", "y1", "x2", "y2", "cx", "cy", "r", "rx", "ry", "fx", "fy", "d", "points", "transform", "fill", "stroke", "stroke-width", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-dasharray", "stroke-dashoffset", "fill-rule", "clip-rule", "opacity", "fill-opacity", "stroke-opacity", "offset", "stop-color", "stop-opacity", "gradientunits", "gradienttransform", "spreadmethod", "clip-path", "clippathunits", "mask", "maskunits", "preserveaspectratio", "id", "class", "font-size", "font-family", "font-weight", "text-anchor", "dominant-baseline", "aria-hidden", "aria-label", "role", "focusable", "href", "xlink:href"]),
  SVG_DROPPED_ELEMENTS_RE = /<\s*(script|foreignobject|style|iframe|object|embed|animate|animatetransform|animatemotion|set)\b[\s\S]*?<\s*\/\s*\1\s*>/gi,
  SVG_TAG_RE = /<(\/?)([a-zA-Z][a-zA-Z0-9:-]*)((?:\s+[^\s"'=<>/]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'=<>`]+))?)*)\s*(\/?)>/y,
  SVG_ATTRIBUTE_RE = /([^\s"'=<>/]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
// safeSvgAttribute (minified: Xt) — Is this SVG attribute safe to keep: on the allowlist, href only to #ids, url() only to #ids, no javascript:, data:, entities or backslashes.
function safeSvgAttribute(attribute, attributeValue) {
  return SVG_ATTRIBUTES.has(attribute) ? attribute === "href" || attribute === "xlink:href" ? /^#[A-Za-z0-9_-]+$/.test(attributeValue.trim()) : (attributeValue.match(/url\s*\(([^)]*)\)/gi) ?? []).some(urlRef => !/^url\s*\(\s*['"]?#[A-Za-z0-9_-]+['"]?\s*\)$/i.test(urlRef)) ? !1 : !/javascript:|data:|&#|\\/i.test(attributeValue) : !1;
}
// sanitizeSvgIcon (minified: Zt) — An operator's SVG icon rebuilt with only allowed tags and attributes (no scripts or external references); null if it isn't a plain SVG.
function sanitizeSvgIcon(icon) {
  let svg = nonEmptyString(icon);
  if (!svg || !/^\s*<svg[\s>/]/i.test(svg)) return null;
  let stripped = svg.replace(SVG_DROPPED_ELEMENTS_RE, ""),
    output = "",
    position = 0;
  // Walk the markup: text between tags is copied (with > escaped), each tag is rebuilt from its allowed attributes; any unknown or malformed tag rejects the whole icon.
  for (; position < stripped.length;) {
    let tagStart = stripped.indexOf("<", position),
      text = stripped.slice(position, tagStart < 0 ? stripped.length : tagStart);
    if (output += text.replace(/>/g, "&gt;"), tagStart < 0) break;
    SVG_TAG_RE.lastIndex = tagStart;
    let tagMatch = SVG_TAG_RE.exec(stripped);
    if (!tagMatch) return null;
    let [whole, closing, tagName, attributes, selfClosing] = tagMatch,
      lowerTag = tagName.toLowerCase();
    if (!SVG_TAGS.has(lowerTag)) return null;
    if (closing) output += `</${tagName}>`;else {
      let kept = [];
      for (let attributeMatch of attributes.matchAll(SVG_ATTRIBUTE_RE)) {
        let attributeName = attributeMatch[1].toLowerCase(),
          attributeValue = attributeMatch[2] ?? attributeMatch[3] ?? attributeMatch[4] ?? "";
        safeSvgAttribute(attributeName, attributeValue) && kept.push(`${attributeMatch[1]}="${attributeValue.replace(/"/g, "&quot;")}"`);
      }
      output += `<${tagName}${kept.length > 0 ? ` ${kept.join(" ")}` : ""}${selfClosing ? "/" : ""}>`;
    }
    position = tagStart + whole.length;
  }
  return output;
}
// operatorCatalog (minified: He) — ──── App: Workflow view model: operators catalogue, step summaries/labels, email/HTML value summaries, flow tree (series/parallel/each/if), stages/actions/commands/form fields views, params to data, path-safe get/insert/remove/move edits, id generation, stage/action/command builders, find/rename/delete helpers ────
// operatorCatalog (minified: He) — Operator list -> Map(operator -> {name, description, category, icon, params}), each param with its label, type, lookups, default and code language.
function operatorCatalog(body) {
  let operators = asArray(Array.isArray(body) ? body : body?.data),
    catalog = new Map();
  for (let entry of operators) {
    let operatorName = nonEmptyString(entry?.operator);
    operatorName && catalog.set(operatorName, {
      operator: operatorName,
      name: nonEmptyString(entry?.name) ?? humanize(operatorName),
      description: nonEmptyString(entry?.description),
      category: nonEmptyString(entry?.category),
      icon: sanitizeSvgIcon(entry?.icon),
      params: asArray(entry?.params).map(rawParam => {
        let paramName = nonEmptyString(rawParam?.param);
        if (!paramName) return null;
        let lookupKind = nonEmptyString(rawParam?.lookup_type),
          lookupReference = nonEmptyString(rawParam?.lookup_reference),
          lookupValues = lookupKind === "values" && lookupReference ? lookupReference.split(",").map(option => option.trim()).filter(Boolean) : Array.isArray(rawParam?.options) ? rawParam.options.map(option => nonEmptyString(option?.value) ?? nonEmptyString(option?.label) ?? String(option)) : null,
          defaultText = rawParam?.default === null || rawParam?.default === void 0 ? "" : typeof rawParam.default == "object" ? JSON.stringify(rawParam.default, null, 2) : String(rawParam.default),
          description = nonEmptyString(rawParam?.description) ?? nonEmptyString(rawParam?.help_text),
          type = nonEmptyString(rawParam?.type);
        return {
          param: paramName,
          label: nonEmptyString(rawParam?.label) ?? humanize(paramName),
          type: type,
          required: rawParam?.required === !0,
          description: description,
          lookupValues: lookupValues && lookupValues.length > 0 ? lookupValues : null,
          lookupKind: lookupKind,
          // A lookup function that just lists one resource becomes a resource lookup (value / label fields).
          lookupResource: lookupKind === "function" ? (() => {
            let lookup = simpleResourceLookup(typeof rawParam?.lookup_reference == "string" ? rawParam.lookup_reference : null);
            return lookup ? {
              resource: lookup.resource,
              valueField: nonEmptyString(rawParam?.lookup_value_field) ?? "id",
              labelField: nonEmptyString(rawParam?.lookup_label_field) ?? "name"
            } : null;
          })() : null,
          lookupHint: lookupKind && lookupKind !== "values" && lookupKind !== "resources" && !simpleResourceLookup(typeof rawParam?.lookup_reference == "string" ? rawParam.lookup_reference : null) ? `${lookupKind} lookup \u2014 the web app resolves this at runtime; enter a value directly` : null,
          inputType: nonEmptyString(rawParam?.input_properties?.type),
          sensitive: rawParam?.sensitive === !0,
          defaultValue: defaultText || (/^message$/i.test(paramName) && type === "object" ? EMAIL_TEMPLATE_HTML : /^html$/i.test(operatorName) && type === "object" ? HTML_CONTENT_TEMPLATE : ""),
          codeLanguage: codeLanguageOf(operatorName, paramName, defaultText, description, type, nonEmptyString(rawParam?.label)),
          mergedInto: mergedParam(operatorName, paramName)?.into ?? null
        };
      }).filter(paramView => paramView !== null)
    });
  }
  return catalog;
}
// catalogEntry (minified: ze) — The operator catalog entry for a step.
function catalogEntry(step, catalog) {
  let operatorName = nonEmptyString(step?.operator);
  return !operatorName || !catalog ? null : catalog.get(operatorName) ?? null;
}
// stepTitle (minified: Yt) — A step's title (operator name, else its own name, else "Command").
function stepTitle(step, catalog) {
  let entry = catalogEntry(step, catalog);
  if (entry) return entry.name;
  let stepName = nonEmptyString(step?.name);
  if (stepName) return humanize(stepName);
  let operatorName = nonEmptyString(step?.operator);
  return operatorName ? humanize(operatorName) : "Command";
}
// PREVIEW_MAX_CHARS (minified: Be) — Longest preview text shown for a param value; next, step data keys never listed as params.
var PREVIEW_MAX_CHARS = 400,
  HIDDEN_DATA_KEYS = new Set(["_properties", "currentProperty"]);
// emailValue (minified: ke) — An email-designer value ({html, json}) -> {html, json, hasDesignTree, schemaVersion, rows}; null for anything else.
function emailValue(value) {
  if (!value || typeof value != "object" || Array.isArray(value)) return null;
  let candidate = value;
  if (typeof candidate.html != "string") return null;
  let designTree = candidate.json;
  return {
    html: candidate.html,
    json: candidate.json,
    hasDesignTree: !!designTree && typeof designTree == "object",
    schemaVersion: typeof designTree?.schemaVersion == "number" ? designTree.schemaVersion : null,
    rows: Array.isArray(designTree?.body?.rows) ? designTree.body.rows.length : null
  };
}
// emailSummary (minified: en) — One line describing an email value (designed or hand-written, rows, size).
function emailSummary(email) {
  let parts = [email.hasDesignTree ? "Designed email" : "HTML email"];
  return email.rows !== null && parts.push(`${email.rows} row${email.rows === 1 ? "" : "s"}`), parts.push(`${Math.round(email.html.length / 1024)} kB of HTML`), email.schemaVersion !== null && parts.push(`Unlayer schema v${email.schemaVersion}`), `${parts.join(" \xB7 ")}${email.hasDesignTree ? " \u2014 designed in the instance's email designer." : " \u2014 hand-written HTML."}`;
}
// previewText (minified: L) — A value as preview text, cut to PREVIEW_MAX_CHARS ({text, truncated}); email values are summarised.
function previewText(value) {
  let text;
  if (value == null) text = "";else if (typeof value == "string") text = value;else if (typeof value == "number" || typeof value == "boolean") text = String(value);else {
    let email = emailValue(value);
    if (email) return {
      text: emailSummary(email),
      truncated: !1
    };
    try {
      text = JSON.stringify(value, null, 2) ?? "";
    } catch {
      text = "[unserializable]";
    }
  }
  return text.length > PREVIEW_MAX_CHARS ? {
    text: text.slice(0, PREVIEW_MAX_CHARS),
    truncated: !0
  } : {
    text: text,
    truncated: !1
  };
}
// mapEntries (minified: tn) — An object's entries as {key, value} preview rows; null for non-objects and email values.
function mapEntries(value) {
  return !value || typeof value != "object" || Array.isArray(value) || emailValue(value) ? null : Object.entries(value).map(([key, entryValue]) => ({
    key: key,
    value: previewText(entryValue).text
  }));
}
// paramViews (minified: nn) — An operator step's data -> its parameter rows: the operator's params first, then any other keys (marked unknown); empty values are skipped.
function paramViews(data, operatorEntry, operator) {
  if (!data || typeof data != "object" || Array.isArray(data)) return [];
  let values = mergeParams(operator, data),
    params = operatorEntry?.params ?? [],
    rows = [],
    seen = new Set(),
    addRow = (key, label, type, unknown) => {
      if (HIDDEN_DATA_KEYS.has(key) || seen.has(key)) return;
      seen.add(key);
      let rawValue = values[key];
      if (rawValue == null || rawValue === "") return;
      let {
        text: text,
        truncated: truncated
      } = previewText(rawValue);
      rows.push({
        key: key,
        label: label,
        type: type,
        value: text,
        entries: mapEntries(rawValue),
        truncated: truncated,
        unknown: unknown
      });
    };
  for (let param of params) addRow(param.param, param.label, param.type, !1);
  for (let dataKey of Object.keys(values)) addRow(dataKey, humanize(dataKey), null, !0);
  return rows;
}
// MAX_STEP_DEPTH (minified: be) — Deepest step nesting the flow views follow.
var MAX_STEP_DEPTH = 12;
// seriesView (minified: D) — A series (or parallel) of steps -> its flow view; an If node goes to ifView.
function seriesView(node, catalog, path, depth = 0) {
  if (!node || typeof node != "object" || depth > MAX_STEP_DEPTH) return null;
  if (nonEmptyString(node.type) === "if") return ifView(node, catalog, path, depth);
  let childrenPath = [...path, "commands"],
    children = asArray(node.commands).map((child, index) => stepView(child, catalog, [...childrenPath, index], depth + 1)).filter(child => child !== null);
  return {
    kind: "series",
    label: nonEmptyString(node.type) === "parallel" ? "Parallel" : "Series",
    children: children,
    path: path,
    childrenPath: childrenPath
  };
}
// ifView (minified: Ke) — An If step -> its flow view (evaluator, condition, true / false branches).
function ifView(node, catalog, path, depth) {
  let branch = (branchNode, branchKey) => {
      if (!branchNode || typeof branchNode != "object") return [];
      let branchPath = [...path, branchKey],
        branchType = nonEmptyString(branchNode.type);
      if (branchType === null || branchType === "series") {
        let series = seriesView(branchNode, catalog, branchPath, depth + 1);
        return series && series.kind === "series" ? series.children : series ? [series] : [];
      }
      let single = stepView(branchNode, catalog, branchPath, depth + 1);
      return single ? [single] : [];
    },
    evaluatorKind = nonEmptyString(node.evaluator),
    ifData = node.data && typeof node.data == "object" && !Array.isArray(node.data) ? node.data : {},
    evaluatorPreview = previewText(ifData.command),
    property = nonEmptyString(ifData.property);
  return {
    kind: "if",
    label: "If",
    evaluatorKind: evaluatorKind,
    evaluatorSource: nonEmptyString(ifData.command) ? evaluatorPreview.text : null,
    evaluatorTruncated: evaluatorPreview.truncated,
    condition: property ? {
      property: property,
      operator: nonEmptyString(ifData.operator) ?? "==",
      value: previewText(ifData.value).text
    } : null,
    whenTrue: branch(node.true, "true"),
    whenFalse: branch(node.false, "false"),
    path: path,
    truePath: [...path, "true", "commands"],
    falsePath: [...path, "false", "commands"]
  };
}
// stepView (minified: Z) — One step (operator, if, each, parallel, series, reference) -> its flow view.
function stepView(step, catalog, path, depth = 0) {
  if (!step || typeof step != "object" || depth > MAX_STEP_DEPTH) return null;
  let stepType = nonEmptyString(step.type);
  // Each: its body is `command` (a series) or, in older definitions, its own `commands`.
  if (stepType === "if") return ifView(step, catalog, path, depth);
  if (stepType === "each") {
    let body = step.command ? seriesView(step.command, catalog, [...path, "command"], depth + 1) : seriesView({
        type: "series",
        commands: step.commands
      }, catalog, path, depth + 1),
      childrenPath = step.command ? [...path, "command", "commands"] : [...path, "commands"];
    return {
      kind: "each",
      label: "Each",
      concurrency: finiteNumber(step.concurrency),
      collection: nonEmptyString(step.reference),
      children: body && body.kind === "series" ? body.children : body ? [body] : [],
      path: path,
      childrenPath: childrenPath
    };
  }
  if (stepType === "parallel" || stepType === "series") {
    let childrenPath = [...path, "commands"],
      children = asArray(step.commands).map((child, index) => stepView(child, catalog, [...childrenPath, index], depth + 1)).filter(child => child !== null),
      stepName = nonEmptyString(step.name);
    return stepType === "series" ? {
      kind: "series",
      label: stepName ? humanize(stepName) : "Series",
      children: children,
      path: path,
      childrenPath: childrenPath
    } : {
      kind: "parallel",
      label: stepName ? humanize(stepName) : "Parallel",
      concurrency: finiteNumber(step.concurrency),
      children: children,
      path: path,
      childrenPath: childrenPath
    };
  }
  // A reference calls a reusable command; its name and parameters are filled in by linkCommandUsages.
  if (stepType === "reference") return {
    kind: "reference",
    label: "Reference",
    targetId: nonEmptyString(step.reference) ?? nonEmptyString(step.id),
    targetName: null,
    parameterFields: [],
    parameterValues: referenceParamEntries(step),
    path: path
  };
  let entry = catalogEntry(step, catalog);
  return {
    kind: "operator",
    label: stepTitle(step, catalog),
    operator: nonEmptyString(step.operator),
    delay: finiteNumber(step.delay),
    params: paramViews(step.data, entry, nonEmptyString(step.operator)),
    path: path
  };
}
// ACCESS_METHODS (minified: rn) — The access-control methods the extension knows, with the label, icon and value kind (ids or code).
var ACCESS_METHODS = {
  user_group: {
    label: "User Group",
    icon: {
      __name: "folder",
      name: "Folder"
    },
    kind: "ids"
  },
  user: {
    label: "User",
    icon: {
      __name: "user",
      name: "User"
    },
    kind: "ids"
  },
  permission: {
    label: "Permission",
    icon: {
      __name: "key",
      name: "Key"
    },
    kind: "ids"
  },
  function: {
    label: "Custom Function",
    icon: {
      __name: "document",
      name: "Document"
    },
    kind: "code"
  }
};
// isKnownAccessMethod (minified: on) — Is it one of the methods in ACCESS_METHODS?
function isKnownAccessMethod(method) {
  return Object.prototype.hasOwnProperty.call(ACCESS_METHODS, method);
}
// accessRules (minified: sn) — An action's access_control rules -> {method, label, data, known}. Saturn stores the label as `lable`.
function accessRules(action) {
  return asArray(action?.access_control).map(rule => ({
    method: nonEmptyString(rule?.method) ?? "",
    label: nonEmptyString(rule?.lable) ?? nonEmptyString(rule?.label),
    data: asArray(rule?.data).map(item => String(item)).filter(item => item.length > 0),
    known: isKnownAccessMethod(nonEmptyString(rule?.method) ?? "")
  }));
}
// actorSummary (minified: an) — Who can run an action, as text: its actors, else "Everyone".
function actorSummary(action) {
  let actors = asArray(action?.actors);
  if (actors.length === 0) return "Everyone";
  let names = actors.map(actor => typeof actor == "string" ? actor : nonEmptyString(actor?.label) ?? nonEmptyString(actor?.name) ?? nonEmptyString(actor?.id)).filter(actor => actor !== null);
  return names.length > 0 ? names.join(", ") : `${actors.length} actor${actors.length === 1 ? "" : "s"}`;
}
// formFieldView (minified: ye) — A form field -> {key, label, type, inputType, required}.
function formFieldView(field) {
  let key = nonEmptyString(field?.key) ?? "";
  return {
    key: key,
    label: nonEmptyString(field?.label) ?? (key ? humanize(key) : "Field"),
    type: nonEmptyString(field?.type),
    inputType: nonEmptyString(field?.input_properties?.type),
    required: field?.required === !0
  };
}
// actionView (minified: Je) — An action -> its view (label, actors, access, form, flow).
function actionView(action, catalog, path) {
  let actionName = nonEmptyString(action?.action) ?? "";
  return {
    id: nonEmptyString(action?.id) ?? actionName,
    action: actionName,
    label: nonEmptyString(action?.label) ?? (actionName ? humanize(actionName) : "Action"),
    actorLabel: actorSummary(action),
    access: accessRules(action),
    isBatchAction: action?.is_batch_action === !0,
    confirmMessage: nonEmptyString(action?.confirm_message),
    flow: seriesView(action?.task, catalog, [...path, "task"]),
    taskPath: [...path, "task"],
    form: asArray(action?.form?.fields).map(formFieldView)
  };
}
// stageView (minified: cn) — A stage -> its view (label, colour, actions).
function stageView(stage, catalog, path) {
  let stageName = nonEmptyString(stage?.stage) ?? "";
  return {
    stage: stageName,
    label: nonEmptyString(stage?.label) ?? (stageName ? humanize(stageName) : "Stage"),
    color: nonEmptyString(stage?.color),
    actions: asArray(stage?.actions).map((action, index) => actionView(action, catalog, [...path, "actions", index]))
  };
}
// commandParameterFields (minified: ln) — A command's parameters (a form with fields, or a list of names / field objects) -> form field views.
function commandParameterFields(parameters) {
  return parameters && typeof parameters == "object" && !Array.isArray(parameters) && Array.isArray(parameters.fields) ? parameters.fields.map(formFieldView) : Array.isArray(parameters) ? parameters.map((parameter, index) => {
    if (typeof parameter == "string") return {
      key: parameter,
      label: humanize(parameter),
      type: null,
      inputType: null,
      required: !1
    };
    let key = nonEmptyString(parameter?.key) ?? nonEmptyString(parameter?.param) ?? nonEmptyString(parameter?.name) ?? `param_${index + 1}`;
    return formFieldView({
      ...parameter,
      key: key
    });
  }) : [];
}
// commandView (minified: un) — A command -> its view (label, flow, parameters); usages are filled in by linkCommandUsages.
function commandView(command, catalog, path) {
  let commandName = nonEmptyString(command?.name) ?? "",
    taskPath = [...path, "command"];
  return {
    id: nonEmptyString(command?.id) ?? commandName,
    name: commandName,
    label: nonEmptyString(command?.label) ?? (commandName ? humanize(commandName) : "Command"),
    flow: seriesView(command?.command, catalog, taskPath) ?? stepView(command?.command, catalog, taskPath),
    taskPath: taskPath,
    parameters: commandParameterFields(command?.parameters),
    usageCount: 0,
    usages: []
  };
}
// walkFlow (minified: X) — Calls visit on a flow node and on every node under it.
function walkFlow(node, visit) {
  if (node) switch (visit(node), node.kind) {
    case "series":
    case "parallel":
    case "each":
      node.children.forEach(child => walkFlow(child, visit));
      break;
    case "if":
      node.whenTrue.forEach(child => walkFlow(child, visit)), node.whenFalse.forEach(child => walkFlow(child, visit));
      break;
  }
}
// relativePathLabel (minified: dn) — A step path relative to its action or command, as text (e.g. commands[0].true), for the usage list.
function relativePathLabel(path, basePath) {
  let rest = path.slice(basePath.length);
  for (; rest.length > 0 && (rest[0] === "task" || rest[0] === "command");) rest.shift();
  let parts = [];
  for (let part of rest) typeof part == "number" ? parts[parts.length - 1] = `${parts[parts.length - 1] ?? ""}[${part}]` : parts.push(part);
  return parts.join(".") || "the flow";
}
// linkCommandUsages (minified: pn) — Fills in each reference step with its command's name, label and parameter fields, and records on each command where it is used (usages, usageCount).
function linkCommandUsages(commands, flows) {
  let byKey = new Map();
  for (let command of commands) command.id && byKey.set(command.id, command), command.name && byKey.set(command.name, command);
  let usages = new Map();
  for (let owner of flows) walkFlow(owner.flow, node => {
    if (node.kind !== "reference" || !node.targetId) return;
    let command = byKey.get(node.targetId);
    if (!command) return;
    node.targetName = command.name || command.label, node.label = command.label, node.parameterFields = command.parameters;
    let list = usages.get(command.id) ?? [];
    list.push({
      label: owner.label,
      pathLabel: relativePathLabel(node.path, owner.basePath),
      path: node.path,
      target: owner.target
    }), usages.set(command.id, list);
  });
  for (let command of commands) command.usages = usages.get(command.id) ?? [], command.usageCount = command.usages.length;
}
// triggerView (minified: fn) — A trigger (a name, or an object) -> {id, label, detail}.
function triggerView(trigger, index) {
  if (typeof trigger == "string") return {
    id: trigger,
    label: humanize(trigger),
    detail: null
  };
  let triggerName = nonEmptyString(trigger?.name) ?? nonEmptyString(trigger?.event) ?? nonEmptyString(trigger?.type);
  return {
    id: nonEmptyString(trigger?.id) ?? `trigger_${index + 1}`,
    label: nonEmptyString(trigger?.label) ?? (triggerName ? humanize(triggerName) : `Trigger ${index + 1}`),
    detail: nonEmptyString(trigger?.description) ?? nonEmptyString(trigger?.event) ?? nonEmptyString(trigger?.type)
  };
}
// workflowSummary (minified: Ge) — One row of the workflows list (id, name, status, counts, stages).
function workflowSummary(workflow) {
  let stages = asArray(workflow?.stages);
  return {
    id: nonEmptyString(workflow?.id) ?? "",
    name: nonEmptyString(workflow?.name) ?? nonEmptyString(workflow?.id) ?? "Untitled workflow",
    status: nonEmptyString(workflow?.status),
    stageCount: stages.length,
    globalActionCount: asArray(workflow?.actions).length,
    stages: stages.map(stage => {
      let stageName = nonEmptyString(stage?.stage) ?? "";
      return {
        stage: stageName,
        label: nonEmptyString(stage?.label) ?? (stageName ? humanize(stageName) : "Stage"),
        color: nonEmptyString(stage?.color)
      };
    })
  };
}
// workflowView (minified: Xe) — A workflow definition -> its full view model (stages, global actions, commands with usages, triggers).
function workflowView(workflow, catalog) {
  let stages = asArray(workflow?.stages).map((stage, index) => stageView(stage, catalog, ["stages", index])),
    actions = asArray(workflow?.actions).map((action, index) => actionView(action, catalog, ["actions", index])),
    commands = asArray(workflow?.commands).map((command, index) => commandView(command, catalog, ["commands", index]));
  return linkCommandUsages(commands, [...actions.map((action, index) => ({
    flow: action.flow,
    label: `Global Action: ${action.label}`,
    basePath: ["actions", index],
    target: {
      tab: "actions",
      actionId: action.id
    }
  })), ...stages.flatMap((stage, stageIndex) => stage.actions.map((action, actionIndex) => ({
    flow: action.flow,
    label: `Stage ${stage.label} / Action ${action.label}`,
    basePath: ["stages", stageIndex, "actions", actionIndex],
    target: {
      tab: "workflow",
      stage: stage.stage,
      actionId: action.id
    }
  }))), ...commands.map((command, index) => ({
    flow: command.flow,
    label: `Command: ${command.label}`,
    basePath: ["commands", index],
    target: {
      tab: "commands",
      commandId: command.id
    }
  }))]), {
    id: nonEmptyString(workflow?.id) ?? "",
    name: nonEmptyString(workflow?.name) ?? nonEmptyString(workflow?.id) ?? "Untitled workflow",
    status: nonEmptyString(workflow?.status),
    start: nonEmptyString(workflow?.start),
    createdAt: nonEmptyString(workflow?.created_at),
    updatedAt: nonEmptyString(workflow?.updated_at),
    stages: stages,
    actions: actions,
    commands: commands,
    triggers: asArray(workflow?.triggers).map(triggerView)
  };
}
// isObjectLike (minified: gn) — Is it a non-null object?
function isObjectLike(value) {
  return !!value && typeof value == "object";
}
// paramsToData (minified: _e) — The text values given for an operator's params -> the step's data (types, JSON, required checks), plus errors; an empty value keeps the stored one.
function paramsToData(entry, values, stored) {
  let data = {},
    errors = [],
    params = entry?.params ?? [];
  for (let param of params) {
    let raw = values[param.param] ?? "",
      text = param.codeLanguage ? raw : raw.trim();
    if (Object.prototype.hasOwnProperty.call(data, param.param)) continue;
    let isEmpty = text.trim() === "";
    // Empty but an object is stored (e.g. a map): keep the stored value.
    if (param.mergedInto) continue;
    if (isEmpty && isObjectLike(stored?.[param.param])) {
      data[param.param] = stored[param.param];
      continue;
    }
    if (isEmpty) {
      param.required && errors.push({
        param: param.param,
        label: param.label,
        message: "is required"
      });
      continue;
    }
    // A {{ template }} in a non-JSON param is stored as text, unconverted.
    if (!(param.type === "object" || param.type === "array") && /\{\{[\s\S]*\}\}/.test(text)) {
      data[param.param] = text;
      continue;
    }
    switch (param.type) {
      case "number":
        {
          let num = Number(text);
          Number.isFinite(num) ? data[param.param] = num : errors.push({
            param: param.param,
            label: param.label,
            message: "must be a number"
          });
          break;
        }
      case "boolean":
        {
          let lower = text.toLowerCase();
          ["true", "false"].includes(lower) ? data[param.param] = lower === "true" : errors.push({
            param: param.param,
            label: param.label,
            message: "must be true or false"
          });
          break;
        }
      case "object":
      case "array":
        {
          // HTML for an email param keeps the stored designer JSON alongside the new html.
          if (param.type === "object" && param.codeLanguage === "html" && /^\s*</.test(text)) {
            let storedValue = stored?.[param.param],
              base = emailValue(storedValue) ? {
                ...storedValue
              } : {};
            data[param.param] = {
              ...base,
              html: text
            };
            break;
          }
          // A non-JSON value for a param listed twice belongs to the other entry.
          if (!/^\s*[[{]/.test(text) && params.filter(other => other.param === param.param).length > 1) continue;
          try {
            let parsed = JSON.parse(text);
            param.type === "array" !== Array.isArray(parsed) || parsed === null || typeof parsed != "object" ? errors.push({
              param: param.param,
              label: param.label,
              message: `must be a JSON ${param.type}`
            }) : data[param.param] = parsed;
          } catch (error) {
            errors.push({
              param: param.param,
              label: param.label,
              message: `is not valid JSON \u2014 ${error instanceof Error ? error.message : String(error)}`
            });
          }
          break;
        }
      default:
        data[param.param] = text;
    }
  }
  // property_updater: also write _properties (the web app's editing rows) from properties.
  let merge = entry ? MERGED_PARAMS[entry.operator] : void 0,
    map = merge ? data[merge.into] : void 0;
  merge && map && typeof map == "object" && !Array.isArray(map) && (data._properties = Object.entries(map).map(([key, mapValue]) => ({
    editing: !1,
    key: key,
    value: mapValue
  })));
  // Values for keys the operator doesn't have are errors.
  for (let key of Object.keys(values)) !params.some(param => param.param === key) && (values[key] ?? "").trim() !== "" && errors.push({
    param: key,
    label: key,
    message: "is not a parameter of this operator"
  });
  return {
    data: data,
    errors: errors
  };
}
// newOperatorStep (minified: Ze) — {type: "command", operator, data, delay?}
function newOperatorStep(operator, data, delay) {
  let step = {
    type: "command",
    operator: operator,
    data: data
  };
  return delay !== null && (step.delay = delay), step;
}
// RESERVED_PATH_KEYS (minified: mn) — Keys a path may never contain (prototype pollution).
var RESERVED_PATH_KEYS = new Set(["__proto__", "constructor", "prototype"]);
// isSafePath (minified: Y) — Is a path only array indexes and ordinary keys (no __proto__, constructor or prototype)?
function isSafePath(path) {
  return Array.isArray(path) && path.every(part => typeof part == "number" && Number.isInteger(part) && part >= 0 || typeof part == "string" && !RESERVED_PATH_KEYS.has(part));
}
// assertSafePath (minified: Ye) — Throws unless the path is safe (see isSafePath).
function assertSafePath(path) {
  if (!isSafePath(path)) throw new Error("Refusing a path with a non-index number or a reserved key (__proto__, constructor, prototype)");
}
// getAt (minified: M) — The value at a path in a definition (undefined if missing or the path is unsafe).
function getAt(root, path) {
  if (!isSafePath(path)) return;
  let current = root;
  for (let key of path) {
    if (current === null || typeof current != "object" || !Object.prototype.hasOwnProperty.call(current, key)) return;
    current = current[key];
  }
  return current;
}
// insertAt (minified: Qe) — A copy with an item inserted into the array at a path (at index, or at the end); missing containers on the way are created.
function insertAt(root, path, index, item) {
  if (path.length === 0) throw new Error("Refusing to insert at an empty path");
  assertSafePath(path);
  let copy = structuredClone(root),
    current = copy;
  for (let partIndex = 0; partIndex < path.length - 1; partIndex++) {
    let key = path[partIndex],
      nextKey = path[partIndex + 1];
    // A missing container is created (an array before an index, else a series).
    if ((current[key] === null || current[key] === void 0) && (current[key] = typeof nextKey == "number" ? [] : {}, Array.isArray(current[key]) || (current[key].type = "series")), current = current[key], current === null || typeof current != "object") throw new Error(`Cannot insert: ${path.slice(0, partIndex + 1).join(".")} is not a container`);
    // Inserting into the `commands` of a single step wraps that step in a series first.
    if (nextKey === "commands" && !Array.isArray(current.commands) && current.commands === void 0 && (nonEmptyString(current.type) !== null || current.operator !== void 0) && nonEmptyString(current.type) !== "series" && nonEmptyString(current.type) !== "parallel") {
      let original = {
        ...current
      };
      for (let field of Object.keys(current)) delete current[field];
      current.type = "series", current.commands = [original];
    }
  }
  let lastKey = path[path.length - 1];
  if (!Array.isArray(current[lastKey])) if (current[lastKey] === null || current[lastKey] === void 0) current[lastKey] = [];else throw new Error(`Cannot insert: ${path.join(".")} is not an array`);
  let list = current[lastKey],
    at = index === null || index < 0 || index > list.length ? list.length : index;
  return list.splice(at, 0, item), copy;
}
// SERVER_FIELDS (minified: hn) — Fields the server manages; removed from a definition before it is saved.
var SERVER_FIELDS = ["_permissions_", "created_at", "updated_at"];
// checkDefinitionForSave (minified: S) — A copy of a definition ready to save: an object for this workflow id, without server-managed fields.
function checkDefinitionForSave(definition, workflowId) {
  if (!definition || typeof definition != "object" || Array.isArray(definition)) throw new Error("Workflow definition must be an object");
  let copy = {
      ...definition
    },
    definitionId = nonEmptyString(copy.id);
  if (definitionId && definitionId !== workflowId) throw new Error(`Refusing to save: definition id "${definitionId}" does not match ${workflowId}`);
  for (let field of SERVER_FIELDS) delete copy[field];
  return copy;
}
// parentOf (minified: Ae) — The parent object / array and key of a path (throws if a container on the way is missing).
function parentOf(root, path) {
  if (path.length === 0) throw new Error("Refusing to address an empty path");
  assertSafePath(path);
  let current = root;
  for (let partIndex = 0; partIndex < path.length - 1; partIndex++) {
    if (current === null || typeof current != "object" || !Object.prototype.hasOwnProperty.call(current, path[partIndex])) throw new Error(`Path ${path.slice(0, partIndex + 1).join(".")} is not a container`);
    if (current = current[path[partIndex]], current === null || typeof current != "object") throw new Error(`Path ${path.slice(0, partIndex + 1).join(".")} is not a container`);
  }
  return {
    parent: current,
    key: path[path.length - 1]
  };
}
// removeAt (minified: Q) — A copy with the item at a path removed: {next, removed}.
function removeAt(root, path) {
  let copy = structuredClone(root),
    {
      parent: parent,
      key: key
    } = parentOf(copy, path);
  if (Array.isArray(parent)) {
    let index = Number(key);
    if (!Number.isInteger(index) || index < 0 || index >= parent.length) throw new Error(`No command at index ${String(key)}`);
    let [removed] = parent.splice(index, 1);
    return {
      next: copy,
      removed: removed
    };
  }
  let removedValue = parent[key];
  if (removedValue === void 0) throw new Error(`Nothing at ${path.join(".")}`);
  return delete parent[key], {
    next: copy,
    removed: removedValue
  };
}
// setAt (minified: O) — A copy of the definition with the value at a path replaced.
function setAt(root, path, replacement) {
  let copy = structuredClone(root),
    {
      parent: parent,
      key: key
    } = parentOf(copy, path);
  if (Array.isArray(parent)) {
    let index = Number(key);
    if (!Number.isInteger(index) || index < 0 || index >= parent.length) throw new Error(`No command at index ${String(key)}`);
    return parent[index] = replacement, copy;
  }
  if (parent[key] === void 0) throw new Error(`Nothing at ${path.join(".")}`);
  return parent[key] = replacement, copy;
}
// samePath (minified: Ve) — Do two paths have the same parts?
function samePath(left, right) {
  return left.length === right.length && left.every((part, index) => part === right[index]);
}
// moveStep (minified: et) — Moves a step from one path to another array (refuses moving it into itself).
function moveStep(root, fromPath, toPath, toIndex) {
  if (fromPath.length === 0) throw new Error("Refusing to move an empty path");
  let fromParent = fromPath.slice(0, -1),
    fromIndex = Number(fromPath[fromPath.length - 1]);
  if (!Number.isInteger(fromIndex)) throw new Error("Can only move a command out of an array");
  if (toPath.length >= fromPath.length && samePath(fromPath, toPath.slice(0, fromPath.length))) throw new Error("Cannot move a step inside itself");
  let {
      next: next,
      removed: moved
    } = removeAt(root, fromPath),
    index = toIndex;
  // Moving later in the same list: the index shifts once the step is taken out.
  samePath(fromParent, toPath) && index !== null && index > fromIndex && (index -= 1);
  let {
    parent: parent,
    key: key
  } = parentOf(next, toPath);
  if (!Array.isArray(parent?.[key])) if (parent?.[key] === void 0 || parent?.[key] === null) parent[key] = [];else throw new Error(`Cannot move: ${toPath.join(".")} is not an array`);
  let list = parent[key],
    at = index === null || index < 0 || index > list.length ? list.length : index;
  return list.splice(at, 0, moved), next;
}
// ID_ALPHABET (minified: qe) — Characters and length of generated step, action and command ids.
var ID_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  ID_LENGTH = 6;
// toMachineName (minified: ee) — A label -> a machine name (lower case, underscores, at most 64 characters).
function toMachineName(label) {
  return label.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 64);
}
// collectIds (minified: Re) — Every `id` string in a definition (searched up to 20 levels deep).
function collectIds(root) {
  let ids = new Set(),
    visit = (node, depth = 0) => {
      if (!node || typeof node != "object" || depth > 20) return;
      if (Array.isArray(node)) {
        node.forEach(child => visit(child, depth + 1));
        return;
      }
      let obj = node,
        id = nonEmptyString(obj.id);
      id && ids.add(id), Object.values(obj).forEach(child => visit(child, depth + 1));
    };
  return visit(root), ids;
}
// unusedId (minified: Se) — A random 6-character id that isn't in `used` (200 tries).
function unusedId(used, random = Math.random) {
  for (let attempt = 0; attempt < 200; attempt++) {
    let id = "";
    for (let charIndex = 0; charIndex < ID_LENGTH; charIndex++) id += ID_ALPHABET[Math.floor(random() * ID_ALPHABET.length)];
    if (!used.has(id)) return id;
  }
  throw new Error("Could not generate an unused id");
}
// newStage (minified: tt) — A new, empty stage.
function newStage(label, stage, color) {
  return {
    stage: stage,
    label: label,
    color: color,
    actions: []
  };
}
// newAction (minified: nt) — A new, empty action (no actors, no access rules, an empty series task).
function newAction(label, action, id) {
  return {
    id: id,
    action: action,
    label: label,
    actors: [],
    access_control: [],
    task: {
      type: "series",
      commands: []
    }
  };
}
// newCommand (minified: rt) — A new, empty command (an empty series, no parameters).
function newCommand(commandName, label, id) {
  return {
    id: id,
    name: commandName,
    label: label,
    command: {
      type: "series",
      commands: []
    },
    parameters: []
  };
}
// referenceParamEntries (minified: wn) — A reference step's stored parameter values as {key, value} rows; none when `parameters` is a form definition.
function referenceParamEntries(step) {
  let parameters = step?.parameters;
  return !parameters || typeof parameters != "object" || Array.isArray(parameters) ? [] : "fields" in parameters || "sections" in parameters ? [] : Object.entries(parameters).map(([key, paramValue]) => ({
    key: key,
    value: previewText(paramValue).text
  }));
}
// checkNewName (minified: U) — Checks a new stage / action / command name is given and not already used: {ok, message?}.
function checkNewName(newName, taken, kind) {
  return newName ? taken.includes(newName) ? {
    ok: !1,
    message: `${/^[aeiou]/i.test(kind) ? "An" : "A"} ${kind} named "${newName}" already exists in this workflow.`
  } : {
    ok: !0
  } : {
    ok: !1,
    message: `Enter a name for the ${kind}.`
  };
}
// countNestedSteps (minified: N) — Counts the steps under a flow node (branches and loop bodies included), down to the depth limit.
function countNestedSteps(node, depth = 0) {
  if (!node || typeof node != "object" || depth > MAX_STEP_DEPTH) return 0;
  if (Array.isArray(node)) return node.reduce((sum, child) => sum + 1 + countNestedSteps(child, depth + 1), 0);
  let container = node,
    count = 0;
  for (let key of ["commands", "command", "true", "false"]) {
    let branch = container[key];
    Array.isArray(branch) ? count += branch.reduce((sum, child) => sum + 1 + countNestedSteps(child, depth + 1), 0) : branch && typeof branch == "object" && (count += countNestedSteps(branch, depth + 1));
  }
  return count;
}
// findStagePath (minified: ot) — The path of the stage with this machine name, or null.
function findStagePath(definition, stageName) {
  let index = asArray(definition?.stages).findIndex(stage => stage?.stage === stageName);
  return index === -1 ? null : ["stages", index];
}
// findActionPath (minified: st) — The path of the action with this id, global or under a stage, or null.
function findActionPath(definition, actionId) {
  let index = asArray(definition?.actions).findIndex(action => action?.id === actionId);
  if (index !== -1) return ["actions", index];
  let stages = asArray(definition?.stages);
  for (let stageIndex = 0; stageIndex < stages.length; stageIndex++) {
    let actionIndex = asArray(stages[stageIndex]?.actions).findIndex(action => action?.id === actionId);
    if (actionIndex !== -1) return ["stages", stageIndex, "actions", actionIndex];
  }
  return null;
}
// findCommandPath (minified: at) — The path of the reusable command with this id (or name), or null.
function findCommandPath(definition, commandId) {
  let index = asArray(definition?.commands).findIndex(command => command?.id === commandId || command?.name === commandId);
  return index === -1 ? null : ["commands", index];
}
// findCommandReferences (minified: kn) — Every reference step that points at a command, with where it is (for delete warnings).
function findCommandReferences(definition, commandId) {
  let references = [],
    visit = (node, owner, pathParts) => {
      if (!node || typeof node != "object") return;
      let step = node;
      step.type === "reference" && (step.id === commandId || step.command === commandId) && references.push({
        owner: owner,
        path: pathParts.join(".") || "the flow"
      });
      for (let key of ["commands", "true", "false"]) {
        let branch = step[key];
        Array.isArray(branch) && branch.forEach((child, index) => visit(child, owner, [...pathParts, `${key}[${index}]`]));
      }
      step.command && typeof step.command == "object" && visit(step.command, owner, [...pathParts, "command"]);
    };
  for (let action of asArray(definition?.actions)) visit(action?.task, `Global Action: ${action?.label ?? action?.action ?? "?"}`, []);
  for (let stage of asArray(definition?.stages)) for (let action of asArray(stage?.actions)) visit(action?.task, `Stage ${stage?.label ?? stage?.stage} / Action ${action?.label ?? action?.action}`, []);
  for (let command of asArray(definition?.commands)) visit(command?.command, `Command: ${command?.label ?? command?.name ?? "?"}`, []);
  return references;
}
// deletionImpact (minified: it) — What deleting a stage / action / command would take with it: nested actions and steps, and references that would break.
function deletionImpact(definition, kind, path) {
  let item = getAt(definition, path);
  if (!item || typeof item != "object") throw new Error("That item is no longer there \u2014 reopen the workflow and try again.");
  let machineName = String(kind === "stage" ? item.stage ?? "" : kind === "action" ? item.action ?? "" : item.name ?? ""),
    label = nonEmptyString(item.label) ?? (machineName || "(unnamed)"),
    nestedActions = kind === "stage" ? asArray(item.actions).length : 0,
    nestedSteps = (kind === "stage" ? asArray(item.actions).map(entry => entry?.task) : [kind === "command" ? item.command : item.task]).reduce((entry, flow) => entry + (flow ? countNestedSteps(flow) : 0), 0),
    breaksReferences = kind === "command" && typeof item.id == "string" ? findCommandReferences(definition, item.id) : [];
  return {
    kind: kind,
    label: label,
    machineName: machineName,
    nestedActions: nestedActions,
    nestedSteps: nestedSteps,
    breaksReferences: breaksReferences,
    isEmpty: nestedActions === 0 && nestedSteps === 0 && breaksReferences.length === 0
  };
}
// deletionConfirmText (minified: ct) — The confirmation question for deleting a stage / action / command, from its deletionImpact.
function deletionConfirmText(impact) {
  let parts = [];
  impact.nestedActions > 0 && parts.push(`${impact.nestedActions} action${impact.nestedActions === 1 ? "" : "s"}`), impact.nestedSteps > 0 && parts.push(`${impact.nestedSteps} step${impact.nestedSteps === 1 ? "" : "s"}`);
  let text = parts.length > 0 ? `Delete ${impact.kind} "${impact.label}" and the ${parts.join(" and ")} inside it?` : `Delete ${impact.kind} "${impact.label}"?`;
  if (impact.breaksReferences.length > 0) {
    let count = impact.breaksReferences.length;
    text += ` It is referenced ${count} time${count === 1 ? "" : "s"} (${impact.breaksReferences.slice(0, 3).map(reference => reference.owner).join(", ")}${count > 3 ? ", \u2026" : ""}), and those references will break.`;
  } else impact.kind === "stage" && (text += ` Any record whose status is "${impact.machineName}" will point at a stage that no longer exists.`);
  return text;
}
// removeItemAt (minified: lt) — The definition without the item at a path.
function removeItemAt(definition, path) {
  return removeAt(definition, path).next;
}
// renameItemAt (minified: ut) — Renames a stage / action / command (label, and optionally machine name and stage colour); returns the new definition.
function renameItemAt(definition, kind, path, changes) {
  let item = getAt(definition, path);
  if (!item || typeof item != "object" || Array.isArray(item)) throw new Error("That item is no longer there \u2014 reopen the workflow and try again.");
  let label = changes.label.trim();
  if (label.length === 0) throw new Error("A name is required.");
  let current = item,
    nameKey = kind === "stage" ? "stage" : kind === "action" ? "action" : "name",
    renamed = {
      ...current,
      label: label
    };
  if (changes.machineName !== void 0) {
    let machineName = changes.machineName.trim();
    if (machineName.length === 0) throw new Error("A machine name is required.");
    let siblings = siblingMachineNames(definition, kind, path),
      check = checkNewName(machineName, siblings, kind);
    if (!check.ok) throw new Error(check.message ?? "That name is already taken.");
    renamed[nameKey] = machineName;
  }
  if (changes.color !== void 0) {
    if (kind !== "stage") throw new Error("Only a stage has a colour.");
    let colour = normalizeHexColour(changes.color);
    if (colour === null) throw new Error(`"${changes.color}" is not a colour \u2014 six hex digits, like #0ea5e9.`);
    renamed.color = colour;
  }
  return setAt(definition, path, renamed);
}
// normalizeHexColour (minified: bn) — "#abc" / "0EA5E9" -> "#aabbcc" / "#0ea5e9"; "" stays ""; anything else is null.
function normalizeHexColour(input) {
  let trimmed = input.trim();
  if (trimmed === "") return "";
  let hex = trimmed.replace(/^#/, "").toLowerCase();
  return /^[0-9a-f]{3}$/.test(hex) ? `#${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}` : /^[0-9a-f]{6}$/.test(hex) ? `#${hex}` : null;
}
// siblingMachineNames (minified: _n) — The machine names of the other items of the same kind (to check a rename against).
function siblingMachineNames(definition, kind, path) {
  let pathKey = path.join("."),
    names = [];
  return kind === "stage" ? (asArray(definition?.stages).forEach((stage, index) => {
    ["stages", index].join(".") !== pathKey && names.push(String(stage?.stage ?? ""));
  }), names) : kind === "command" ? (asArray(definition?.commands).forEach((command, index) => {
    ["commands", index].join(".") !== pathKey && names.push(String(command?.name ?? ""));
  }), names) : (asArray(definition?.actions).forEach((action, index) => {
    ["actions", index].join(".") !== pathKey && names.push(String(action?.action ?? ""));
  }), asArray(definition?.stages).forEach((stage, stageIndex) => {
    asArray(stage?.actions).forEach((action, actionIndex) => {
      ["stages", stageIndex, "actions", actionIndex].join(".") !== pathKey && names.push(String(action?.action ?? ""));
    });
  }), names);
}
// unwrapWorkflow (minified: dt) — The workflow definition out of a GET /Workflows/<id> response (the body, or its `data`).
function unwrapWorkflow(body) {
  if (!body || typeof body != "object" || Array.isArray(body)) return body;
  let inner = body.data;
  if (inner && typeof inner == "object" && !Array.isArray(inner)) {
    let candidate = inner;
    if ("stages" in candidate || "actions" in candidate || "commands" in candidate || "id" in candidate) return inner;
  }
  return body;
}
// SATURN_TOOLS (minified: ne) — ──── App: MCP tool catalogue (saturn_* tools with risk levels and descriptions) and argument/result helpers ────
// SATURN_TOOLS (minified: ne) — The MCP tools this server offers: name, risk ("read" or "write"; asksEachTime = approved per call), description and JSON input schema.
var SATURN_TOOLS = [{
  name: "saturn_list_workflows",
  risk: "read",
  description: "List every workflow on the instance with its id, status, stage count and global action count. Start here \u2014 ids from this list are what the other tools take.",
  inputSchema: {
    type: "object",
    properties: {},
    required: [],
    additionalProperties: !1
  }
}, {
  name: "saturn_get_workflow",
  risk: "read",
  description: "Read one workflow in full: its stages, each stage's actions, global actions with their flow graphs and form fields, reusable commands with their parameters and usages, and triggers.",
  inputSchema: {
    type: "object",
    properties: {
      workflow_id: {
        type: "string",
        description: "Workflow id from saturn_list_workflows."
      }
    },
    required: ["workflow_id"],
    additionalProperties: !1
  }
}, {
  name: "saturn_get_workflow_raw",
  risk: "read",
  description: "Read the untouched server JSON for a workflow. Use when you need a key this extension does not model; prefer saturn_get_workflow otherwise, since the raw document is large.",
  inputSchema: {
    type: "object",
    properties: {
      workflow_id: {
        type: "string"
      }
    },
    required: ["workflow_id"],
    additionalProperties: !1
  }
}, {
  name: "saturn_search_workflows",
  risk: "read",
  description: `Find stages, actions and reusable commands across this instance's workflows by name, label or id \u2014 e.g. "approval", "send reminder", or an id like "WRIVML". Returns where each is (workflow, stage, path) so you can read or change it. An empty query lists them all.`,
  inputSchema: {
    type: "object",
    properties: {
      query: {
        type: "string",
        description: "Words to look for. Underscores, dashes and case do not matter."
      },
      kinds: {
        type: "array",
        items: {
          type: "string",
          enum: ["stage", "action", "command"]
        },
        description: "Only these. Omit for all three."
      },
      workflow_id: {
        type: "string",
        description: "Only this workflow."
      }
    },
    required: ["query"],
    additionalProperties: !1
  }
}, {
  name: "saturn_list_operators",
  risk: "read",
  description: "List the operators this instance offers, with each one's parameter schema. Call before configuring an operator \u2014 never guess a parameter name.",
  inputSchema: {
    type: "object",
    properties: {
      search: {
        type: "string",
        description: "Optional substring filter on name or label."
      }
    },
    required: [],
    additionalProperties: !1
  }
}, {
  name: "saturn_list_resources",
  risk: "read",
  description: "List this instance's resources \u2014 the business-data types like Project, Bid, or Contractor. Use it before reasoning about a resource, rather than assuming one exists from a skill's example.",
  inputSchema: {
    type: "object",
    properties: {
      search: {
        type: "string",
        description: "Optional substring filter on the name."
      }
    },
    required: [],
    additionalProperties: !1
  }
}, {
  name: "saturn_get_resource",
  risk: "read",
  description: "Read one resource's fields: name, label, type, and what a lookup points at. This is the schema, not the records \u2014 no business data is returned.",
  inputSchema: {
    type: "object",
    properties: {
      resource: {
        type: "string",
        description: "Resource name as `saturn_list_resources` reports it."
      }
    },
    required: ["resource"],
    additionalProperties: !1
  }
}, {
  name: "saturn_list_records",
  risk: "read",
  asksEachTime: !0,
  description: "Read records of one resource \u2014 its actual rows, e.g. the Applications or Users \u2014 one page at a time. The user approves each read. Ask for the fields you need and a small limit: credential-like fields are never returned and long text is shortened. Call saturn_get_resource first to learn the field names.",
  inputSchema: {
    type: "object",
    properties: {
      resource: {
        type: "string",
        description: "Resource name as `saturn_list_resources` reports it."
      },
      fields: {
        type: "array",
        items: {
          type: "string"
        },
        description: "Only these fields (and `id`). Omit for all of them."
      },
      filter: {
        type: "string",
        description: "Optional filter in Saturn's filter language, as a menu tab uses."
      },
      limit: {
        type: "number",
        description: `How many, 1 to ${50}. Defaults to ${20}.`
      },
      page: {
        type: "number",
        description: "Which page, from 1."
      }
    },
    required: ["resource"],
    additionalProperties: !1
  }
}, {
  name: "saturn_create_record",
  risk: "write",
  description: "Create one record of a resource. Use when the user asks for it, or when the task needs the record. Call saturn_get_resource first for the field names. Credential-like and instance-managed fields (id, created_at\u2026) cannot be set.",
  inputSchema: {
    type: "object",
    properties: {
      resource: {
        type: "string"
      },
      data: {
        type: "object",
        description: "Field values, by field key."
      }
    },
    required: ["resource", "data"],
    additionalProperties: !1
  }
}, {
  name: "saturn_update_record",
  risk: "write",
  description: "Change fields of one record. Only the fields in `data` change; the rest are kept. The record is backed up first, and the reply names the backup \u2014 saturn_restore_record puts it back. Core Saturn resources (users and the like) cannot be changed; their configuration artifacts can.",
  inputSchema: {
    type: "object",
    properties: {
      resource: {
        type: "string"
      },
      id: {
        type: ["string", "number"],
        description: "The record's id."
      },
      data: {
        type: "object",
        description: "The fields to change, by field key."
      }
    },
    required: ["resource", "id", "data"],
    additionalProperties: !1
  }
}, {
  name: "saturn_delete_record",
  risk: "write",
  description: "Delete one record. Prefer leaving a record unused to deleting it: delete only to undo a record you just created or to remove a test record. It is backed up first; saturn_restore_record brings it back with its id. Say which record and why before calling it.",
  inputSchema: {
    type: "object",
    properties: {
      resource: {
        type: "string"
      },
      id: {
        type: ["string", "number"],
        description: "The record's id."
      }
    },
    required: ["resource", "id"],
    additionalProperties: !1
  }
}, {
  name: "saturn_restore_record",
  risk: "write",
  description: "Put a record back as a backup holds it \u2014 after an update or delete that should not have happened, or a change that failed its check. The record's present state is backed up first.",
  inputSchema: {
    type: "object",
    properties: {
      backup: {
        type: "string",
        description: "A backup's file name, as a write or saturn_list_record_backups reports it."
      }
    },
    required: ["backup"],
    additionalProperties: !1
  }
}, {
  name: "saturn_list_record_backups",
  risk: "read",
  description: "List record backups for this instance, newest first: what was changed or deleted, and when.",
  inputSchema: {
    type: "object",
    properties: {
      resource: {
        type: "string",
        description: "Only this resource's."
      }
    },
    required: [],
    additionalProperties: !1
  }
}, {
  name: "saturn_add_operator",
  risk: "write",
  description: 'Add an operator step to a flow. `path` addresses the container\'s command list, e.g. ["actions",0,"task","commands"]; read the workflow first to get it. Omit `index` to append.',
  inputSchema: {
    type: "object",
    properties: {
      workflow_id: {
        type: "string"
      },
      path: {
        type: "array",
        items: {
          type: ["string", "number"]
        },
        description: "Path to the container's command array."
      },
      operator: {
        type: "string",
        description: "Operator machine name."
      },
      data: {
        type: "object",
        description: "The operator's configuration."
      },
      index: {
        type: "number",
        description: "Where to insert; appended if omitted."
      },
      label: {
        type: "string"
      }
    },
    required: ["workflow_id", "path", "operator"],
    additionalProperties: !1
  }
}, {
  name: "saturn_update_operator",
  risk: "write",
  description: "Change a step's configuration. Merges into the existing `data`, so keys you do not mention survive \u2014 which is required, since a node carries keys beyond the ones you can see.",
  inputSchema: {
    type: "object",
    properties: {
      workflow_id: {
        type: "string"
      },
      path: {
        type: "array",
        items: {
          type: ["string", "number"]
        },
        description: "Path to the step itself."
      },
      data: {
        type: "object"
      },
      label: {
        type: "string"
      }
    },
    required: ["workflow_id", "path", "data"],
    additionalProperties: !1
  }
}, {
  name: "saturn_move_operator",
  risk: "write",
  description: "Move a step to another position, within a container or across containers.",
  inputSchema: {
    type: "object",
    properties: {
      workflow_id: {
        type: "string"
      },
      from: {
        type: "array",
        items: {
          type: ["string", "number"]
        }
      },
      to_container: {
        type: "array",
        items: {
          type: ["string", "number"]
        }
      },
      to_index: {
        type: "number"
      }
    },
    required: ["workflow_id", "from", "to_container", "to_index"],
    additionalProperties: !1
  }
}, {
  name: "saturn_delete_step",
  risk: "write",
  description: "Delete a step. Deleting a loop or condition removes everything inside it, so the result reports how many steps went with it.",
  inputSchema: {
    type: "object",
    properties: {
      workflow_id: {
        type: "string"
      },
      path: {
        type: "array",
        items: {
          type: ["string", "number"]
        }
      }
    },
    required: ["workflow_id", "path"],
    additionalProperties: !1
  }
}, {
  name: "saturn_create_stage",
  risk: "write",
  description: "Add a stage. Its machine name is derived from the label.",
  inputSchema: {
    type: "object",
    properties: {
      workflow_id: {
        type: "string"
      },
      label: {
        type: "string"
      },
      color: {
        type: "string",
        description: "Hex colour, e.g. #0ea5e9."
      }
    },
    required: ["workflow_id", "label"],
    additionalProperties: !1
  }
}, {
  name: "saturn_create_action",
  risk: "write",
  description: "Add an action, to a stage when `stage` is given or workflow-level otherwise. Starts with an empty flow.",
  inputSchema: {
    type: "object",
    properties: {
      workflow_id: {
        type: "string"
      },
      label: {
        type: "string"
      },
      stage: {
        type: "string",
        description: "Stage machine name; omit for a global action."
      }
    },
    required: ["workflow_id", "label"],
    additionalProperties: !1
  }
}, {
  name: "saturn_create_command",
  risk: "write",
  description: "Add a reusable command that actions can reference.",
  inputSchema: {
    type: "object",
    properties: {
      workflow_id: {
        type: "string"
      },
      label: {
        type: "string"
      }
    },
    required: ["workflow_id", "label"],
    additionalProperties: !1
  }
}, {
  name: "task_list",
  risk: "read",
  description: "List the current plan: every task, its status, which agent profile runs it, and what it waits on.",
  inputSchema: {
    type: "object",
    properties: {},
    required: [],
    additionalProperties: !1
  }
}, {
  name: "task_create",
  risk: "read",
  description: "Add a task to the plan. Use this to break a request into steps before doing any of them. `profile_id` chooses which agent runs it \u2014 put read-only steps on a read-only profile and give writing steps one that can write. Creating a task does not run it; the user runs the plan.",
  inputSchema: {
    type: "object",
    properties: {
      title: {
        type: "string",
        description: "One line, imperative."
      },
      detail: {
        type: "string",
        description: "What doing it involves. This becomes the prompt when the task runs, so write it for an agent starting fresh with no memory of this conversation."
      },
      profile_id: {
        type: "string",
        description: "Agent profile id from the plan or the picker."
      },
      skill_ids: {
        type: "array",
        items: {
          type: "string"
        }
      },
      depends_on: {
        type: "array",
        items: {
          type: "string"
        },
        description: "Task ids that must finish first."
      }
    },
    required: ["title", "detail"],
    additionalProperties: !1
  }
}, {
  name: "task_update",
  risk: "read",
  description: "Change a task: its status, its detail, or the result of running it. Set status to `done` with a `result` when you finish one, or `blocked` with the reason when you cannot.",
  inputSchema: {
    type: "object",
    properties: {
      task_id: {
        type: "string"
      },
      status: {
        type: "string",
        enum: ["todo", "running", "blocked", "done", "failed"]
      },
      title: {
        type: "string"
      },
      detail: {
        type: "string"
      },
      result: {
        type: "string"
      }
    },
    required: ["task_id"],
    additionalProperties: !1
  }
}, {
  name: "saturn_rename",
  risk: "write",
  description: "Rename a stage, action, or command. Changes the display label only unless `machine_name` is given \u2014 a stage's machine name is what a record's status holds and an action's is how a trigger names it, so changing one can break things outside this workflow.",
  inputSchema: {
    type: "object",
    properties: {
      workflow_id: {
        type: "string"
      },
      kind: {
        type: "string",
        enum: ["stage", "action", "command"]
      },
      target: {
        type: "string",
        description: "Stage machine name, action id, or command id/name."
      },
      label: {
        type: "string"
      },
      machine_name: {
        type: "string",
        description: "Only set this when the user asked for the machine name to change."
      }
    },
    required: ["workflow_id", "kind", "target", "label"],
    additionalProperties: !1
  }
}, {
  name: "saturn_delete",
  risk: "write",
  description: "Delete a stage, action, or command. A stage takes its actions with it. Refuses a command that is still referenced unless `force` is true, and reports where those references are \u2014 deleting one leaves a flow that breaks only when that branch runs.",
  inputSchema: {
    type: "object",
    properties: {
      workflow_id: {
        type: "string"
      },
      kind: {
        type: "string",
        enum: ["stage", "action", "command"]
      },
      target: {
        type: "string"
      },
      force: {
        type: "boolean",
        description: "Delete even though references would break. Ask the user first."
      }
    },
    required: ["workflow_id", "kind", "target"],
    additionalProperties: !1
  }
}];
// findAgentTool (minified: Pe) — The tool with this name from the tool catalogue, or null.
function findAgentTool(toolName) {
  return SATURN_TOOLS.find(tool => tool.name === toolName) ?? null;
}
// toolAsksEachTime (minified: kt) — Whether a tool must be approved on every call, even when the user granted it "always".
function toolAsksEachTime(toolName) {
  return findAgentTool(toolName)?.asksEachTime === !0;
}
// isWriteTool (minified: re) — Whether a tool changes the instance (risk "write").
function isWriteTool(toolName) {
  return findAgentTool(toolName)?.risk === "write";
}
// toolResultMaxChars (minified: xe) — Tool results longer than this many characters are cut.
var toolResultMaxChars = 6e4;
// toolSuccess (minified: w) — A successful tool result: the text, or the value as pretty JSON, truncated.
// `changed` ({workflowId, summary}) tells the caller what the tool wrote.
function toolSuccess(value, changed) {
  let text = typeof value == "string" ? value : JSON.stringify(value, null, 2);
  return {
    ok: !0,
    content: text.length > toolResultMaxChars ? `${text.slice(0, toolResultMaxChars)}
\u2026 truncated at ${toolResultMaxChars} characters.` : text,
    changed: changed
  };
}
// toolFailure (minified: h) — A failed tool result carrying the error message.
function toolFailure(message) {
  return {
    ok: !1,
    content: `Error: ${message}`
  };
}
// requireStringArg (minified: k) — A required non-empty string argument; throws a message for the agent otherwise.
function requireStringArg(args, key) {
  let value = args[key];
  if (typeof value != "string" || value.trim().length === 0) throw new Error(`\`${key}\` is required and must be a non-empty string.`);
  return value;
}
// requirePathArg (minified: W) — A required definition path argument: a non-empty array of strings and numbers, with no prototype keys.
function requirePathArg(args, key) {
  let path = args[key];
  if (!Array.isArray(path) || path.length === 0) throw new Error(`\`${key}\` must be a non-empty path array, e.g. ["actions",0,"task","commands"].`);
  for (let segment of path) if (typeof segment != "string" && typeof segment != "number") throw new Error(`\`${key}\` may only contain strings and numbers.`);
  if (!isSafePath(path)) throw new Error(`\`${key}\` may only hold array indexes and ordinary keys \u2014 not __proto__, constructor, or prototype.`);
  return path;
}
// stringifyArgValues (minified: pt) — Operator values from the agent as strings (objects as JSON), dropping null ones, as the params-to-data mapping takes them.
function stringifyArgValues(values) {
  let result = {};
  for (let [key, value] of Object.entries(values)) value != null && (result[key] = typeof value == "string" ? value : JSON.stringify(value));
  return result;
}
// actionNamesOf (minified: An) — Machine names of all of a workflow's actions, global and on every stage.
function actionNamesOf(workflow) {
  let names = asArray(workflow?.actions).map(action => String(action?.action ?? ""));
  for (let stage of asArray(workflow?.stages)) for (let stageAction of asArray(stage?.actions)) names.push(String(stageAction?.action ?? ""));
  return names;
}
// noTaskListMessage (minified: $e) — The answer to a task_* tool when the session has no task list.
var noTaskListMessage = "No task list is available in this session, so tasks cannot be used here.";
// stringArray (minified: ft) — The strings in a value that should be an array of strings ([] otherwise).
function stringArray(value) {
  return Array.isArray(value) ? value.filter(item => typeof item == "string") : [];
}
// requireKindArg (minified: gt) — The `kind` argument, checked to be stage, action or command.
function requireKindArg(args) {
  let kind = args.kind;
  if (kind !== "stage" && kind !== "action" && kind !== "command") throw new Error("`kind` must be one of: stage, action, command.");
  return kind;
}
// findWorkflowPart (minified: mt) — Finds the stage (by machine name), action (by id) or command (by id or name) that saturn_rename / saturn_delete target; returns its path or null.
function findWorkflowPart(workflow, kind, target) {
  switch (kind) {
    case "stage":
      return findStagePath(workflow, target);
    case "action":
      return findActionPath(workflow, target);
    case "command":
      return findCommandPath(workflow, target);
  }
}
// partNotFoundMessage (minified: ht) — The error when findWorkflowPart finds nothing, saying how that kind is looked up.
function partNotFoundMessage(kind, target) {
  return `No ${kind} matching \`${target}\` (looked it up by ${kind === "stage" ? "machine name" : kind === "action" ? "id" : "id or name"}). Call saturn_get_workflow to see what is there.`;
}
// optionalObjectArg (minified: te) — An optional object argument: {} when missing; throws if it is not a plain object.
function optionalObjectArg(value, label) {
  if (value == null) return {};
  if (typeof value != "object" || Array.isArray(value)) throw new Error(`\`${label}\` must be an object.`);
  return value;
}
// runAgentTool (minified: Ee) — ──── App: Tool dispatcher (runs each saturn_* action against the instance) ────
// runAgentTool (minified: Ee) — Runs one saturn_* / task_* tool call against the instance (through the backend, saturnBackend here) and the optional task list.
// Never throws: every failure becomes a toolFailure result. Workflow writes PUT the whole definition after it is checked for saving.
async function runAgentTool(backend, toolName, args, taskList) {
  if (!findAgentTool(toolName)) return toolFailure(`Unknown action \`${toolName}\`. Available: ${SATURN_TOOLS.map(tool => tool.name).join(", ")}.`);
  let input = optionalObjectArg(args, "arguments");
  try {
    switch (toolName) {
      // Searches stage/action/command names across workflows (or one).
      case "saturn_search_workflows":
        {
          let query = typeof input.query == "string" ? input.query.slice(0, 200) : "",
            kinds = Array.isArray(input.kinds) ? input.kinds.filter(kind => kind === "stage" || kind === "action" || kind === "command") : null,
            workflowId = typeof input.workflow_id == "string" && input.workflow_id ? input.workflow_id : null,
            workflows = workflowId ? [{
              ...(await backend.getWorkflow(workflowId)),
              id: workflowId
            }] : asArray((await backend.listWorkflows())?.data),
            {
              hits: hits,
              total: total
            } = searchWorkflows(workflows, query, kinds);
          return toolSuccess(total === 0 ? `Nothing matches "${query}"${kinds?.length ? ` among ${kinds.join(", ")}s` : ""}. Try fewer words, or saturn_list_workflows.` : {
            matches: hits,
            ...(total > hits.length ? {
              showing: hits.length,
              total: total,
              note: "Narrow the query, or pass workflow_id or kinds."
            } : {})
          });
        }
      // One summary row per workflow.
      case "saturn_list_workflows":
        {
          let response = await backend.listWorkflows(),
            rows = asArray(response?.data).map(workflow => {
              let summary = workflowSummary(workflow);
              return {
                id: summary.id,
                name: summary.name,
                status: summary.status,
                stages: summary.stageCount,
                global_actions: summary.globalActionCount
              };
            });
          return toolSuccess(rows);
        }
      // One workflow as the view model, with operator names resolved when the operator list loads.
      case "saturn_get_workflow":
        {
          let workflowId = requireStringArg(input, "workflow_id"),
            [workflow, operators] = await Promise.all([backend.getWorkflow(workflowId), backend.listOperators().catch(() => new Map())]);
          return toolSuccess(workflowView(workflow, operators));
        }
      // The workflow definition exactly as the instance stores it.
      case "saturn_get_workflow_raw":
        return toolSuccess(await backend.getWorkflow(requireStringArg(input, "workflow_id")));
      // Resource names, optionally filtered.
      case "saturn_list_resources":
        {
          let resources = await backend.listResources(),
            search = typeof input.search == "string" ? input.search.toLowerCase() : null,
            matching = search ? resources.filter(resourceName => resourceName.toLowerCase().includes(search)) : resources;
          return toolSuccess({
            count: matching.length,
            of: resources.length,
            resources: matching
          });
        }
      // A page of records (1-50, default 20), shaped for the agent: credential-like fields dropped, long text cut; `fields` may not name credential-like fields.
      case "saturn_list_records":
        {
          let resource = requireStringArg(input, "resource");
          if (!isResourceName(resource)) return toolFailure(`"${String(resource).slice(0, 60)}" is not a resource name. Call saturn_list_resources to see what is.`);
          let limit = Number.isInteger(input.limit) ? Math.min(50, Math.max(1, input.limit)) : 20,
            page = Number.isInteger(input.page) && input.page >= 1 ? input.page : 1,
            filter = typeof input.filter == "string" && input.filter.trim() ? input.filter.trim().slice(0, 2e3) : null,
            fields = Array.isArray(input.fields) ? input.fields.filter(field => typeof field == "string" && !isCredentialKey(field)).slice(0, 50) : null,
            {
              records: records,
              total: total
            } = await backend.listRecords(resource, {
              limit: limit,
              page: page,
              filter: filter
            });
          return toolSuccess(formatRecordsForAgent(resource, records, {
            limit: limit,
            page: page,
            total: total,
            fields: fields && fields.length > 0 ? fields : null
          }));
        }
      // Record writes: core resources are refused; the record is backed up before an update or delete,
      // and a delete is checked by reading the record back.
      case "saturn_create_record":
      case "saturn_update_record":
      case "saturn_delete_record":
        {
          let resource = requireStringArg(input, "resource");
          if (!isResourceName(resource)) return toolFailure(`"${String(resource).slice(0, 60)}" is not a resource name. Call saturn_list_resources to see what is.`);
          let refusal = coreResourceRefusal(resource, await backend.listCoreResources().catch(() => null));
          if (refusal) return toolFailure(refusal);
          if (toolName === "saturn_create_record") {
            let checked = checkAgentRecordData(input.data);
            if ("error" in checked) return toolFailure(checked.error);
            let created = await backend.createRecord(resource, checked.data);
            return toolSuccess({
              created: shortenForAgent(created),
              undo: "saturn_delete_record with its id, if it should not exist."
            });
          }
          let recordId = recordIdForUrl(input.id);
          if (!recordId) return toolFailure("`id` must be the record's id, a string or a number.");
          let update = toolName === "saturn_update_record" ? checkAgentRecordData(input.data) : null;
          if (update && "error" in update) return toolFailure(update.error);
          let current = await backend.getRecord(resource, recordId);
          if (!isFoundRecord(current)) return toolFailure(`${resource} ${String(input.id)} was not found. Read the records first.`);
          let backupName = recordBackupName(resource, recordId, toolName === "saturn_delete_record" ? "pre-delete" : "pre-update", new Date());
          // Delete: back up, remove, then read back to confirm it is gone.
          if (await backend.saveBackup(backupName, current), toolName === "saturn_delete_record") return await backend.deleteRecord(resource, recordId), isFoundRecord(await backend.getRecord(resource, recordId).catch(() => null)) ? toolFailure(`The instance said ${resource} ${String(input.id)} was deleted, but it is still there. Backup: ${backupName}`) : toolSuccess({
            deleted: `${resource} ${String(input.id)}`,
            backup: backupName
          });
          let updated = await backend.updateRecord(resource, recordId, update.data);
          return toolSuccess({
            updated: shortenForAgent(updated),
            changed: Object.keys(update.data),
            backup: backupName
          });
        }
      // Puts a backed-up record back: updates it if it still exists (backing up its present state first), else recreates it with its id.
      case "saturn_restore_record":
        {
          let backupName = requireStringArg(input, "backup"),
            parsed = parseRecordBackupName(backupName);
          if (!parsed) return toolFailure(`"${backupName.slice(0, 80)}" is not a record backup's name. Call saturn_list_record_backups.`);
          let refusal = coreResourceRefusal(parsed.resource, await backend.listCoreResources().catch(() => null));
          if (refusal) return toolFailure(refusal);
          let backup = await backend.readBackup(backupName);
          if (!isFoundRecord(backup)) return toolFailure(`Backup ${backupName} was not found, or holds no record.`);
          let recordId = recordIdForUrl(backup.id);
          if (!recordId) return toolFailure(`Backup ${backupName} has no usable id.`);
          let data = restorableFields(backup),
            current = await backend.getRecord(parsed.resource, recordId).catch(() => null);
          if (isFoundRecord(current)) {
            let preRestoreBackup = recordBackupName(parsed.resource, recordId, "pre-restore", new Date());
            return await backend.saveBackup(preRestoreBackup, current), await backend.updateRecord(parsed.resource, recordId, data), toolSuccess({
              restored: `${parsed.resource} ${String(backup.id)}`,
              from: backupName,
              backup: preRestoreBackup
            });
          }
          return await backend.createRecord(parsed.resource, {
            ...data,
            id: backup.id
          }), toolSuccess({
            restored: `${parsed.resource} ${String(backup.id)}`,
            from: backupName,
            recreated: !0
          });
        }
      // The newest 50 record backups, parsed from their file names.
      case "saturn_list_record_backups":
        {
          let resource = typeof input.resource == "string" && isResourceName(input.resource) ? input.resource : null,
            backups = (await backend.listBackups()).map(file => ({
              file: file,
              parsed: parseRecordBackupName(file)
            })).filter(entry => !!entry.parsed && (!resource || entry.parsed.resource === resource)).sort((entry, other) => other.parsed.stamp.localeCompare(entry.parsed.stamp)).slice(0, 50).map(({
              file: file,
              parsed: parsed
            }) => ({
              backup: file,
              resource: parsed.resource,
              id: parsed.id,
              taken: parsed.tag,
              at: parsed.stamp
            }));
          return toolSuccess(backups.length > 0 ? backups : "No record backups yet.");
        }
      // A resource's field schema (no records).
      case "saturn_get_resource":
        {
          let resource = requireStringArg(input, "resource"),
            schema = await backend.getResource(resource);
          return schema.fields.length === 0 ? toolFailure(`"${resource}" has no fields, or is not a resource on this instance. Call saturn_list_resources to see what is.`) : toolSuccess(schema);
        }
      // Operators with their parameter schemas, optionally filtered by name or label.
      case "saturn_list_operators":
        {
          let operators = await backend.listOperators(),
            search = typeof input.search == "string" ? input.search.toLowerCase() : null,
            rows = [...operators.entries()].filter(([operatorName, operator]) => !search || operatorName.toLowerCase().includes(search) || (operator.name ?? "").toLowerCase().includes(search)).map(([operatorName, operator]) => ({
              operator: operatorName,
              label: operator.name,
              category: operator.category,
              params: operator.params.map(param => ({
                param: param.param,
                label: param.label,
                type: param.type,
                required: param.required,
                options: param.lookupValues
              }))
            }));
          return toolSuccess(rows);
        }
      // Inserts a new operator step; its values are checked against the operator's parameters first.
      case "saturn_add_operator":
        {
          let workflowId = requireStringArg(input, "workflow_id"),
            containerPath = requirePathArg(input, "path"),
            operatorName = requireStringArg(input, "operator"),
            [workflow, operators] = await Promise.all([backend.getWorkflow(workflowId), backend.listOperators().catch(() => new Map())]),
            operator = operators.get(operatorName);
          if (!operator) return toolFailure(`\`${operatorName}\` is not an operator on this instance. Call saturn_list_operators to see what is available.`);
          let converted = paramsToData(operator, stringifyArgValues(optionalObjectArg(input.data, "data")));
          if (converted.errors.length > 0) return toolFailure(`Invalid values for ${operatorName}: ` + converted.errors.map(problem => `${problem.param} \u2014 ${problem.message}`).join("; "));
          let step = newOperatorStep(operatorName, converted.data, typeof input.delay == "number" ? input.delay : null),
            index = typeof input.index == "number" ? input.index : null,
            updated = insertAt(workflow, containerPath, index, step);
          return await backend.putWorkflow(workflowId, checkDefinitionForSave(updated, workflowId)), toolSuccess(`Added ${operatorName} at ${containerPath.join(".")}${index === null ? " (appended)" : `[${index}]`}.`, {
            workflowId: workflowId,
            summary: `added ${operatorName}`
          });
        }
      // Merges new values into a step's data (keys not mentioned survive) and optionally sets its label.
      case "saturn_update_operator":
        {
          let workflowId = requireStringArg(input, "workflow_id"),
            stepPath = requirePathArg(input, "path"),
            workflow = await backend.getWorkflow(workflowId),
            found = getAt(workflow, stepPath);
          if (!found || typeof found != "object") return toolFailure(`No step at ${stepPath.join(".")}. Re-read the workflow \u2014 paths shift after an edit.`);
          let step = found,
            operators = await backend.listOperators().catch(() => new Map()),
            operator = typeof step.operator == "string" ? operators.get(step.operator) : void 0,
            changes = optionalObjectArg(input.data, "data"),
            updatedStep = {
              ...step,
              data: {
                ...optionalObjectArg(step.data, "data"),
                ...(operator ? paramsToData(operator, stringifyArgValues(changes)).data : changes)
              },
              ...(typeof input.label == "string" ? {
                label: input.label
              } : {})
            },
            updated = setAt(workflow, stepPath, updatedStep);
          return await backend.putWorkflow(workflowId, checkDefinitionForSave(updated, workflowId)), toolSuccess(`Updated ${step.operator ?? "step"} at ${stepPath.join(".")}: ${Object.keys(changes).join(", ")}.`, {
            workflowId: workflowId,
            summary: `updated ${step.operator ?? "a step"}`
          });
        }
      // Moves a step to an index in another (or the same) container.
      case "saturn_move_operator":
        {
          let workflowId = requireStringArg(input, "workflow_id"),
            fromPath = requirePathArg(input, "from"),
            toContainer = requirePathArg(input, "to_container"),
            toIndex = input.to_index;
          if (typeof toIndex != "number") return toolFailure("`to_index` must be a number.");
          let workflow = await backend.getWorkflow(workflowId),
            updated = moveStep(workflow, fromPath, toContainer, toIndex);
          return await backend.putWorkflow(workflowId, checkDefinitionForSave(updated, workflowId)), toolSuccess(`Moved ${fromPath.join(".")} to ${toContainer.join(".")}[${toIndex}].`, {
            workflowId: workflowId,
            summary: "moved a step"
          });
        }
      // Deletes a step and reports how many nested steps went with it.
      case "saturn_delete_step":
        {
          let workflowId = requireStringArg(input, "workflow_id"),
            stepPath = requirePathArg(input, "path"),
            workflow = await backend.getWorkflow(workflowId),
            step = getAt(workflow, stepPath);
          if (step === void 0) return toolFailure(`Nothing at ${stepPath.join(".")}. Re-read the workflow first.`);
          let removedCount = countNestedSteps(step),
            updated = removeAt(workflow, stepPath).next;
          return await backend.putWorkflow(workflowId, checkDefinitionForSave(updated, workflowId)), toolSuccess(`Deleted ${stepPath.join(".")}${removedCount > 1 ? `, and the ${removedCount - 1} steps inside it` : ""}.`, {
            workflowId: workflowId,
            summary: `deleted ${removedCount} step${removedCount === 1 ? "" : "s"}`
          });
        }
      // Adds a stage whose machine name comes from the label; refuses a taken name.
      case "saturn_create_stage":
        {
          let workflowId = requireStringArg(input, "workflow_id"),
            label = requireStringArg(input, "label"),
            workflow = await backend.getWorkflow(workflowId),
            machineName = toMachineName(label),
            stages = asArray(workflow?.stages),
            check = checkNewName(machineName, stages.map(stage => String(stage?.stage ?? "")), "stage");
          if (!check.ok) return toolFailure(check.message ?? "That stage name is already taken.");
          let updated = setAt(workflow, ["stages"], [...stages, newStage(label, machineName, typeof input.color == "string" ? input.color : "#64748b")]);
          return await backend.putWorkflow(workflowId, checkDefinitionForSave(updated, workflowId)), toolSuccess(`Created stage \`${machineName}\` (${label}).`, {
            workflowId: workflowId,
            summary: `created stage ${label}`
          });
        }
      // Adds an action to a stage or as a global action, with a fresh unused id; refuses a taken machine name.
      case "saturn_create_action":
        {
          let workflowId = requireStringArg(input, "workflow_id"),
            label = requireStringArg(input, "label"),
            workflow = await backend.getWorkflow(workflowId),
            machineName = toMachineName(label),
            check = checkNewName(machineName, actionNamesOf(workflow), "action");
          if (!check.ok) return toolFailure(check.message ?? "That action name is already taken.");
          let action = newAction(label, machineName, unusedId(collectIds(workflow))),
            stageName = typeof input.stage == "string" ? input.stage : null,
            updated;
          if (stageName) {
            let stages = asArray(workflow?.stages),
              stageIndex = stages.findIndex(stage => stage?.stage === stageName);
            if (stageIndex === -1) return toolFailure(`No stage \`${stageName}\`. Read the workflow to see its stages.`);
            let stageActions = asArray(stages[stageIndex]?.actions);
            updated = setAt(workflow, ["stages", stageIndex, "actions"], [...stageActions, action]);
          } else {
            let actions = asArray(workflow?.actions);
            updated = setAt(workflow, ["actions"], [...actions, action]);
          }
          return await backend.putWorkflow(workflowId, checkDefinitionForSave(updated, workflowId)), toolSuccess(`Created ${stageName ? `action \`${machineName}\` on stage \`${stageName}\`` : `global action \`${machineName}\``}.`, {
            workflowId: workflowId,
            summary: `created action ${label}`
          });
        }
      // Adds a reusable command; refuses a taken name.
      case "saturn_create_command":
        {
          let workflowId = requireStringArg(input, "workflow_id"),
            label = requireStringArg(input, "label"),
            workflow = await backend.getWorkflow(workflowId),
            machineName = toMachineName(label),
            commands = asArray(workflow?.commands),
            check = checkNewName(machineName, commands.map(command => String(command?.name ?? "")), "command");
          if (!check.ok) return toolFailure(check.message ?? "That command name is already taken.");
          let updated = setAt(workflow, ["commands"], [...commands, newCommand(machineName, label, unusedId(collectIds(workflow)))]);
          return await backend.putWorkflow(workflowId, checkDefinitionForSave(updated, workflowId)), toolSuccess(`Created command \`${machineName}\` (${label}).`, {
            workflowId: workflowId,
            summary: `created command ${label}`
          });
        }
      // Task-list tools work on the session's plan, not on the instance (none is passed by this server, so they answer noTaskListMessage).
      case "task_list":
        {
          if (!taskList) return toolFailure(noTaskListMessage);
          let tasks = await taskList.list();
          return toolSuccess(tasks.map(task => ({
            id: task.id,
            title: task.title,
            status: task.status,
            profile: task.profileId,
            depends_on: task.dependsOn,
            result: task.result
          })));
        }
      case "task_create":
        {
          if (!taskList) return toolFailure(noTaskListMessage);
          let task = await taskList.create({
            title: requireStringArg(input, "title"),
            detail: requireStringArg(input, "detail"),
            profileId: typeof input.profile_id == "string" ? input.profile_id : "explain",
            skillIds: stringArray(input.skill_ids),
            dependsOn: stringArray(input.depends_on)
          });
          return toolSuccess(`Added task ${task.id}: ${task.title} (runs as ${task.profileId}).`);
        }
      case "task_update":
        {
          if (!taskList) return toolFailure(noTaskListMessage);
          let taskId = requireStringArg(input, "task_id"),
            patch = {};
          if (typeof input.status == "string" && (patch.status = input.status), typeof input.title == "string" && (patch.title = input.title), typeof input.detail == "string" && (patch.detail = input.detail), typeof input.result == "string" && (patch.result = input.result), Object.keys(patch).length === 0) return toolFailure("Nothing to change. Pass at least one of status, title, detail, or result.");
          let updated = await taskList.update(taskId, patch);
          return updated ? toolSuccess(`Task ${taskId} is now ${updated.status}.`) : toolFailure(`No task ${taskId}. Call task_list to see the plan.`);
        }
      // Renames a stage, action or command's label, and its machine name only when asked.
      case "saturn_rename":
        {
          let workflowId = requireStringArg(input, "workflow_id"),
            kind = requireKindArg(input),
            target = requireStringArg(input, "target"),
            workflow = await backend.getWorkflow(workflowId),
            found = findWorkflowPart(workflow, kind, target);
          if (!found) return toolFailure(partNotFoundMessage(kind, target));
          let updated = renameItemAt(workflow, kind, found, {
            label: requireStringArg(input, "label"),
            ...(typeof input.machine_name == "string" ? {
              machineName: input.machine_name
            } : {})
          });
          return await backend.putWorkflow(workflowId, checkDefinitionForSave(updated, workflowId)), toolSuccess(`Renamed ${kind} to "${String(input.label)}"` + (typeof input.machine_name == "string" ? `, machine name now \`${input.machine_name}\`.` : " (machine name unchanged)."), {
            workflowId: workflowId,
            summary: `renamed a ${kind}`
          });
        }
      // Deletes a stage, action or command; refuses to break references to a command unless force is true.
      case "saturn_delete":
        {
          let workflowId = requireStringArg(input, "workflow_id"),
            kind = requireKindArg(input),
            target = requireStringArg(input, "target"),
            workflow = await backend.getWorkflow(workflowId),
            found = findWorkflowPart(workflow, kind, target);
          if (!found) return toolFailure(partNotFoundMessage(kind, target));
          let impact = deletionImpact(workflow, kind, found);
          if (impact.breaksReferences.length > 0 && input.force !== !0) return toolFailure(`${deletionConfirmText(impact)} Tell the user, and pass force: true only if they confirm. References: ` + impact.breaksReferences.map(reference => `${reference.owner} (${reference.path})`).join("; "));
          let updated = removeItemAt(workflow, found);
          await backend.putWorkflow(workflowId, checkDefinitionForSave(updated, workflowId));
          let extras = [];
          return impact.nestedActions > 0 && extras.push(`${impact.nestedActions} actions`), impact.nestedSteps > 0 && extras.push(`${impact.nestedSteps} steps`), toolSuccess(`Deleted ${kind} "${impact.label}"` + (extras.length > 0 ? ` and ${extras.join(" and ")}` : "") + "." + (impact.kind === "stage" ? ` Any record whose status is "${impact.machineName}" now points at a stage that no longer exists.` : ""), {
            workflowId: workflowId,
            summary: `deleted ${kind} ${impact.label}`
          });
        }
      default:
        return toolFailure(`\`${toolName}\` is not implemented.`);
    }
  } catch (error) {
    return toolFailure(error instanceof Error ? error.message : String(error));
  }
}
// instanceToolPrefix (minified: se) — ──── App: Client for the instance's own /api/mcp endpoint (JSON-RPC session, tool proxying) and record backup read/write on disk ────
// instanceToolPrefix (minified: se) — Prefix of the names under which the instance's own MCP tools are listed.
// instanceMcpProtocolVersion (minified: Rn): the MCP protocol version sent when connecting to the instance's own /api/mcp endpoint.
var instanceToolPrefix = "instance_",
  instanceMcpProtocolVersion = "2025-03-26";
// instanceToolListedName (minified: Sn) — The name an instance tool is listed under here: the prefix plus its name made safe, at most 64 characters.
function instanceToolListedName(toolName) {
  return `${instanceToolPrefix}${toolName.replace(/[^A-Za-z0-9_-]/g, "_")}`.slice(0, 64);
}
// parseRpcReply (minified: xn) — Finds the JSON-RPC reply with this id in a response body, plain JSON or a text/event-stream of `data:` lines; null when there is none.
function parseRpcReply(body, contentType, requestId) {
  let pickReply = payload => Array.isArray(payload) ? payload.find(message => message?.id === requestId) : payload;
  if ((contentType ?? "").includes("text/event-stream")) {
    for (let block of body.split(/\r?\n\r?\n/)) {
      let data = block.split(/\r?\n/).filter(blockLine => blockLine.startsWith("data:")).map(blockLine => blockLine.slice(5).trimStart()).join(`
`);
      if (data) try {
        let reply = pickReply(JSON.parse(data));
        if (reply?.id === requestId) return reply;
      } catch {}
    }
    return null;
  }
  try {
    return pickReply(JSON.parse(body));
  } catch {
    return null;
  }
}
// InstanceMcpClient (minified: oe) — Client for the instance's own MCP server (/api/mcp): JSON-RPC over HTTP POST, keeping the Mcp-Session-Id it is given.
var InstanceMcpClient = class {
  constructor(endpoint, token, fetchFn = fetch) {
    this.endpoint = endpoint;
    this.token = token;
    this.fetchFn = fetchFn;
  }
  endpoint;
  token;
  fetchFn;
  session = null;
  seq = 0;
  tools = null;
  // The instance's tools, probed once and cached (null if the probe fails).
  list() {
    return this.tools ??= this.probe().catch(() => null), this.tools;
  }
  // The instance tool listed under this name, or null.
  async find(listedName) {
    return (await this.list())?.find(tool => tool.listedAs === listedName) ?? null;
  }
  // Calls an instance tool (60 s timeout); returns {ok, text} with the text parts joined and cut at 60,000 characters.
  async call(tool, args) {
    let reply = await this.rpc("tools/call", {
      name: tool.name,
      arguments: args ?? {}
    }, 6e4);
    if (reply?.error) return {
      ok: !1,
      text: `The instance refused it: ${String(reply.error.message ?? "error").slice(0, 500)}`
    };
    let text = (Array.isArray(reply?.result?.content) ? reply.result.content : []).map(part => part?.type === "text" && typeof part.text == "string" ? part.text : "").filter(Boolean).join(`
`),
      shown = text.length > 6e4 ? `${text.slice(0, 6e4)}
\u2026 truncated at 60000 characters.` : text;
    return {
      ok: reply?.result?.isError !== !0,
      text: shown || "(no output)"
    };
  }
  // Initializes a session with the instance and lists its tools, each with its listed name and whether it is read-only; null when it has no MCP server.
  async probe() {
    let initReply = await this.rpc("initialize", {
      protocolVersion: instanceMcpProtocolVersion,
      capabilities: {},
      clientInfo: {
        name: "saturn-vscode",
        version: "0.1.0"
      }
    }, 5e3);
    if (!initReply?.result || typeof initReply.result != "object") return null;
    await this.notify("notifications/initialized");
    let listReply = await this.rpc("tools/list", {}, 5e3),
      tools = Array.isArray(listReply?.result?.tools) ? listReply.result.tools : null;
    return tools ? tools.filter(tool => typeof tool?.name == "string" && tool.name).map(tool => ({
      name: tool.name,
      listedAs: instanceToolListedName(tool.name),
      description: typeof tool.description == "string" ? tool.description : "",
      inputSchema: tool.inputSchema && typeof tool.inputSchema == "object" ? tool.inputSchema : {
        type: "object",
        properties: {}
      },
      readOnly: tool.annotations?.readOnlyHint === !0
    })) : null;
  }
  // Request headers: the bearer token, JSON / event-stream accept, and the session id once known.
  headers() {
    return {
      Authorization: `Bearer ${this.token}`,
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
      ...(this.session ? {
        "Mcp-Session-Id": this.session
      } : {})
    };
  }
  // Sends one JSON-RPC request and returns its reply (null on an HTTP error); remembers a session id from the response.
  async rpc(method, params, timeoutMs) {
    let requestId = ++this.seq,
      response = await this.fetchFn(this.endpoint, {
        method: "POST",
        headers: this.headers(),
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: requestId,
          method: method,
          params: params
        }),
        redirect: "error",
        signal: AbortSignal.timeout(timeoutMs)
      }),
      sessionId = response.headers.get("mcp-session-id");
    return sessionId && (this.session = sessionId), response.ok ? parseRpcReply(await response.text(), response.headers.get("content-type"), requestId) : null;
  }
  // Sends a JSON-RPC notification, ignoring failures.
  async notify(method) {
    await this.fetchFn(this.endpoint, {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: method
      }),
      redirect: "error",
      signal: AbortSignal.timeout(5e3)
    }).catch(() => {});
  }
};
var fsPromises = require("node:fs/promises"),
  nodePath = require("node:path");
// writeRecordBackup (minified: bt) — Writes a backup of a record about to be changed, as an owner-only file (folder 0700, file 0600) that never overwrites another.
// Refuses names that are not backup file names (<resource>.<id>.<tag>.<stamp>.json).
async function writeRecordBackup(backupDir, fileName, record) {
  if (!backupDir) throw new Error("There is no folder to back the record up to, so it was not changed.");
  if (!parseRecordBackupName(fileName)) throw new Error(`Refusing backup name ${fileName.slice(0, 80)}`);
  await (0, fsPromises.mkdir)(backupDir, {
    recursive: !0,
    mode: 448
  }), await (0, fsPromises.writeFile)((0, nodePath.join)(backupDir, fileName), `${JSON.stringify(record, null, 1)}
`, {
    mode: 384,
    flag: "wx"
  });
}
// readRecordBackup (minified: _t) — Reads one backup file back, or null when it is missing, unreadable or not a backup file name.
async function readRecordBackup(backupDir, fileName) {
  if (!backupDir || !parseRecordBackupName(fileName)) return null;
  try {
    return JSON.parse(await (0, fsPromises.readFile)((0, nodePath.join)(backupDir, fileName), "utf8"));
  } catch {
    return null;
  }
}
// listRecordBackups (minified: At) — Lists the backup file names in the backup folder (empty when there is none).
async function listRecordBackups(backupDir) {
  if (!backupDir) return [];
  try {
    return (await (0, fsPromises.readdir)(backupDir)).filter(fileName => parseRecordBackupName(fileName) !== null);
  } catch {
    return [];
  }
}
// mcpProtocolVersion (minified: $n) — ──── App: Server main: env config (SATURN_MCP_URL/TOKEN/...), approval round-trip over local socket, Saturn REST requests, instance tool proxy, host API table, JSON-RPC 2.0 over stdio (initialize, tools/list, tools/call, ...), readline loop ────
// mcpProtocolVersion (minified: $n) — MCP protocol version this server answers `initialize` with.
var mcpProtocolVersion = "2024-11-05";
// requireEnv (minified: Et) — The value of a required environment variable; exits the process with a message when it is not set.
function requireEnv(varName) {
  let value = process.env[varName];
  return value || (process.stderr.write(`saturn-mcp: ${varName} is not set
`), process.exit(1)), value;
}
// saturnUrl (minified: V) — Configuration from the environment the extension starts this server with:
// saturnUrl (minified: V) / saturnToken (q): the instance's base URL (SATURN_MCP_URL, trailing slashes removed) and bearer token (SATURN_MCP_TOKEN).
// writesWithoutAsking (B): SATURN_MCP_ALLOW_WRITES=1, write tools run without asking ("let the agent act without asking").
// profileCanWrite (ae): SATURN_MCP_PROFILE_WRITES=1, the agent profile may change the instance at all.
// profileCanRead (ie): SATURN_MCP_ALLOW_READS (on unless 0), the agent profile may reach the instance at all.
// approvalSocketPath (P): SATURN_MCP_APPROVAL_SOCKET, the editor's local socket for asking the user; null when there is none.
// autoApprove (Ot): SATURN_MCP_AUTO=1, auto mode, so reads that ask each time do not ask.
// cliAsks (Ct): SATURN_MCP_CLI_ASKS=1, the CLI's permission system already asks for reads.
// recordBackupDir (Ce): SATURN_MCP_BACKUP_DIR, where record backups go; null when unset (record writes are then refused).
// approvalSecret (Pn): SATURN_MCP_APPROVAL_SECRET, sent with each approval request so the editor knows it is this server.
var saturnUrl = requireEnv("SATURN_MCP_URL").replace(/\/+$/, ""),
  saturnToken = requireEnv("SATURN_MCP_TOKEN"),
  writesWithoutAsking = process.env.SATURN_MCP_ALLOW_WRITES === "1",
  profileCanWrite = process.env.SATURN_MCP_PROFILE_WRITES === "1",
  profileCanRead = process.env.SATURN_MCP_ALLOW_READS !== "0",
  approvalSocketPath = process.env.SATURN_MCP_APPROVAL_SOCKET ?? null,
  autoApprove = process.env.SATURN_MCP_AUTO === "1",
  cliAsks = process.env.SATURN_MCP_CLI_ASKS === "1",
  recordBackupDir = process.env.SATURN_MCP_BACKUP_DIR || null,
  approvalSecret = process.env.SATURN_MCP_APPROVAL_SECRET ?? "";
// askApproval (minified: ce) — Asks the user to approve a tool call over the approval socket: sends {id, secret, toolName, input} as a JSON line and resolves
// with the editor's reply for that id ({behavior: "allow" | "deny", message?, updatedInput?}). Any failure resolves as a deny.
function askApproval(toolName, input) {
  return new Promise(resolve => {
    if (!approvalSocketPath) {
      resolve({
        behavior: "deny",
        message: "No approval channel is available, so this was declined."
      });
      return;
    }
    let requestId = (0, nodeCrypto.randomUUID)(),
      socket;
    try {
      socket = (0, net.connect)(approvalSocketPath);
    } catch {
      resolve({
        behavior: "deny",
        message: "Could not reach the editor to ask for permission."
      });
      return;
    }
    // A buffer for partial reply lines, and finish(), which settles once: closes the socket and resolves with the first answer.
    let buffer = "",
      settled = !1,
      finish = answer => {
        settled || (settled = !0, socket.destroy(), resolve(answer));
      };
    // Replies come as JSON lines; keep a partial line in the buffer until the rest arrives.
    socket.setEncoding("utf8"), socket.on("connect", () => {
      socket.write(`${JSON.stringify({
        id: requestId,
        secret: approvalSecret,
        toolName: toolName,
        input: input
      })}
`);
    }), socket.on("data", chunk => {
      buffer += chunk;
      let lines = buffer.split(`
`);
      buffer = lines.pop() ?? "";
      for (let line of lines) if (line.trim()) try {
        let reply = JSON.parse(line);
        reply?.id === requestId && finish(reply);
      } catch {}
    }), socket.on("error", () => finish({
      behavior: "deny",
      message: "The editor could not be reached, so this was declined."
    })), socket.on("close", () => finish({
      behavior: "deny",
      message: "The approval channel closed before an answer arrived."
    }));
  });
}
// approveTool (minified: Rt) — The internal `approve` tool, listed when there is an approval socket: the CLI's permission system calls it to ask the user.
var approveTool = {
  name: "approve",
  description: "Internal: asks the user to approve a tool call. Called by the CLI's permission system, not something to invoke directly.",
  inputSchema: {
    type: "object",
    properties: {
      tool_name: {
        type: "string"
      },
      input: {
        type: "object"
      }
    },
    required: ["tool_name"],
    additionalProperties: !0
  }
};
// saturnFetchJson (minified: C) — A JSON request to the instance (path includes /api) with the bearer token, a 60 s timeout, no redirects and the response size cap;
// throws with the status and start of the body on failure; null for 204.
async function saturnFetchJson(apiPath, init) {
  let response = capResponseSize(await fetch(`${saturnUrl}${apiPath}`, {
    signal: AbortSignal.timeout(6e4),
    ...init,
    redirect: "error",
    headers: {
      Authorization: `Bearer ${saturnToken}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(init?.headers ?? {})
    }
  }));
  if (!response.ok) {
    let errorText = await response.text().catch(() => "");
    throw new Error(`${init?.method ?? "GET"} ${apiPath} failed: ${response.status} ${response.statusText}` + (errorText ? ` \u2014 ${errorText.slice(0, 400)}` : ""));
  }
  return response.status === 204 ? null : response.json();
}
// operatorsCache (minified: Te) — The instance's operators catalogue, loaded once.
var operatorsCache = null;
// writeRecordRequest (minified: je) — Creates (POST), updates (PUT) or deletes a record, trying each route name the resource may have until one exists;
// throws on an HTTP error or a {status: "FAILURE"} body.
async function writeRecordRequest(resource, method, recordId, body) {
  for (let route of recordRoutes(resource)) {
    let response = capResponseSize(await fetch(`${saturnUrl}/api${route}${recordId ? `/${recordId}` : ""}`, {
        method: method,
        signal: AbortSignal.timeout(6e4),
        redirect: "error",
        headers: {
          Authorization: `Bearer ${saturnToken}`,
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        ...(body ? {
          body: JSON.stringify(body)
        } : {})
      })),
      reply = await response.json().catch(() => null);
    if (!(recordId ? isRouteNotFound(response.status, reply) : isMissingRoute(response.status, reply))) {
      if (!response.ok || typeof reply?.status == "string" && reply.status.toUpperCase() === "FAILURE") throw new Error(`${method} ${resource} record failed: ${response.status}${typeof reply?.message == "string" ? ` \u2014 ${reply.message}` : ""}`);
      return reply?.data ?? reply;
    }
  }
  throw new Error(`No record route for ${resource} on this instance.`);
}
// instanceMcp (minified: Ne) — The client for the instance's own MCP server, through the response size cap.
var instanceMcp = new InstanceMcpClient(`${saturnUrl}/api/mcp`, saturnToken, async (requestUrl, init) => capResponseSize(await fetch(requestUrl, init)));
// callInstanceTool (minified: En) — Runs a call to one of the instance's own MCP tools: checks the profile may read (and write, for a tool that is not read-only),
// asks the user unless allowed already, then calls it and shortens the result text.
async function callInstanceTool(listedName, args) {
  let failure = text => ({
    isError: !0,
    content: [{
      type: "text",
      text: text
    }]
  });
  if (!profileCanRead) return failure("This agent profile has no access to the Saturn instance. Tell the user which profile would, rather than retrying.");
  let tool = await instanceMcp.find(listedName);
  if (!tool) return failure(`The instance has no tool called ${listedName.slice(instanceToolPrefix.length)}.`);
  if (!tool.readOnly && !profileCanWrite) return failure("This agent profile may not change the instance. Describe the change instead, and tell the user that switching to a profile that can change it would apply it.");
  // Read-only tools ask unless the CLI asks or auto mode is on; other tools ask unless writes are allowed without asking.
  if (tool.readOnly ? !cliAsks && !autoApprove : !writesWithoutAsking) {
    let approval = approvalSocketPath ? await askApproval(listedName, args) : {
      behavior: "deny",
      message: "This needs the user's approval, and there is no way to ask here."
    };
    if (approval.behavior !== "allow") return failure(approval.message ?? "The user declined this.");
  }
  try {
    let result = await instanceMcp.call(tool, args);
    return {
      isError: !result.ok,
      content: [{
        type: "text",
        text: shortenInstanceText(result.text)
      }]
    };
  } catch (error) {
    return failure(`The instance's MCP server could not be reached: ${error instanceof Error ? error.message : String(error)}`);
  }
}
// shortenInstanceText (minified: On) — An instance tool's text with JSON shortened for the agent (long text cut); other text unchanged.
function shortenInstanceText(text) {
  try {
    return JSON.stringify(shortenForAgent(JSON.parse(text)), null, 1);
  } catch {
    return text;
  }
}
// saturnBackend (minified: St) — The backend the tool dispatcher runs against: Saturn REST calls with this server's token, and the record backups on disk.
var saturnBackend = {
  listWorkflows: () => saturnFetchJson("/api/Workflows"),
  getWorkflow: async workflowId => unwrapWorkflow(await saturnFetchJson(`/api/Workflows/${encodeURIComponent(workflowId)}`)),
  putWorkflow: (workflowId, definition) => saturnFetchJson(`/api/Workflows/${encodeURIComponent(workflowId)}`, {
    method: "PUT",
    body: JSON.stringify(definition)
  }),
  listOperators: async () => (operatorsCache || (operatorsCache = operatorCatalog(await saturnFetchJson("/api/Operators"))), operatorsCache),
  listResources: async () => {
    let response = await saturnFetchJson("/api/Resources"),
      list = Array.isArray(response) ? response : response?.data;
    return Array.isArray(list) ? list.map(entry => typeof entry == "string" ? entry : typeof entry?.name == "string" ? entry.name : null).filter(entry => !!entry).sort((entry, otherEntry) => entry.localeCompare(otherEntry)) : [];
  },
  // Tries each route name the resource may have; a route that does not exist moves on to the next.
  listRecords: async (resource, query) => {
    for (let route of recordRoutes(resource)) {
      let response = capResponseSize(await fetch(`${saturnUrl}/api${route}${recordQuery(query)}`, {
          signal: AbortSignal.timeout(6e4),
          redirect: "error",
          headers: {
            Authorization: `Bearer ${saturnToken}`,
            Accept: "application/json"
          }
        })),
        body = await response.json().catch(() => null);
      if (!isMissingRoute(response.status, body)) {
        if (!response.ok) throw new Error(`Read ${resource} records failed: ${response.status} ${response.statusText}`);
        return recordsFromBody(body);
      }
    }
    throw new Error(`No record route for ${resource} on this instance.`);
  },
  // One record by id, or null when the instance says 404.
  getRecord: async (resource, recordId) => {
    for (let route of recordRoutes(resource)) {
      let response = capResponseSize(await fetch(`${saturnUrl}/api${route}/${recordId}`, {
          signal: AbortSignal.timeout(6e4),
          redirect: "error",
          headers: {
            Authorization: `Bearer ${saturnToken}`,
            Accept: "application/json"
          }
        })),
        body = await response.json().catch(() => null);
      if (!isRouteNotFound(response.status, body)) {
        if (response.status === 404) return null;
        if (!response.ok || typeof body?.status == "string" && body.status.toUpperCase() === "FAILURE") throw new Error(`Read ${resource} ${recordId} failed: ${response.status}`);
        return body?.data ?? null;
      }
    }
    throw new Error(`No record route for ${resource} on this instance.`);
  },
  // The names of the instance's core resources (from /api/resources/catalog), or null when it cannot be read.
  listCoreResources: async () => {
    try {
      let response = await saturnFetchJson("/api/resources/catalog");
      return Array.isArray(response?.data) ? new Set(response.data.filter(item => typeof item == "string")) : null;
    } catch {
      return null;
    }
  },
  saveBackup: (fileName, record) => writeRecordBackup(recordBackupDir, fileName, record),
  readBackup: fileName => readRecordBackup(recordBackupDir, fileName),
  listBackups: () => listRecordBackups(recordBackupDir),
  createRecord: (resource, data) => writeRecordRequest(resource, "POST", null, data),
  updateRecord: (resource, recordId, data) => writeRecordRequest(resource, "PUT", recordId, data),
  deleteRecord: async (resource, recordId) => {
    await writeRecordRequest(resource, "DELETE", recordId);
  },
  // A resource's fields: key, label, type, referenced resource and source, sorted by key.
  getResource: async resource => {
    let fields = (await saturnFetchJson(`/api/Resources/${encodeURIComponent(resource)}`))?.data;
    if (!fields || typeof fields != "object" || Array.isArray(fields)) return {
      resource: resource,
      fields: []
    };
    let fieldList = Object.entries(fields).map(([key, field]) => ({
      key: key,
      label: typeof field?.label == "string" && field.label ? field.label : null,
      type: typeof field?.type == "string" ? field.type : null,
      reference: typeof field?.map?.reference == "string" && field.map.reference ? field.map.reference : typeof field?.lookup_reference == "string" && field.lookup_reference ? field.lookup_reference : null,
      source: typeof field?.source == "string" ? field.source : null
    })).sort((left, right) => left.key.localeCompare(right.key));
    return {
      resource: resource,
      fields: fieldList
    };
  }
};
// writeMessage (minified: Tt) — Writes one JSON-RPC message to stdout as a line.
function writeMessage(message) {
  process.stdout.write(`${JSON.stringify(message)}
`);
}
// sendResult (minified: R) — Sends a JSON-RPC result for this request id.
function sendResult(id, result) {
  writeMessage({
    jsonrpc: "2.0",
    id: id,
    result: result
  });
}
// sendError (minified: ve) — Sends a JSON-RPC error for this request id.
function sendError(id, code, message) {
  writeMessage({
    jsonrpc: "2.0",
    id: id,
    error: {
      code: code,
      message: message
    }
  });
}
// handleRequest (minified: Cn) — Handles one JSON-RPC message from the client (initialize, tools/list, tools/call, ping); unknown methods with an id get -32601.
async function handleRequest(request) {
  switch (request.method) {
    case "initialize":
      sendResult(request.id, {
        protocolVersion: mcpProtocolVersion,
        capabilities: {
          tools: {}
        },
        serverInfo: {
          name: "saturn",
          version: "0.1.0"
        }
      });
      return;
    case "notifications/initialized":
    case "initialized":
      return;
    // Lists the approve tool (when there is an approval socket), the saturn_* / task_* tools this profile may use, and the instance's own tools
    // (read-only ones always; others only when the profile may write). saturn_list_records is hidden when the instance has its own tools.
    case "tools/list":
      {
        let instanceTools = profileCanRead ? await instanceMcp.list() : null;
        sendResult(request.id, {
          tools: [...(approvalSocketPath ? [approveTool] : []), ...SATURN_TOOLS.filter(tool => tool.name.startsWith("task_") || profileCanRead && (tool.risk === "read" || profileCanWrite && (writesWithoutAsking || !!approvalSocketPath))).filter(tool => !(instanceTools && tool.name === "saturn_list_records")).map(tool => ({
            name: tool.name,
            description: tool.risk === "write" ? `${tool.description}

Changes the instance.` : tool.description,
            inputSchema: tool.inputSchema
          })), ...(instanceTools ?? []).filter(tool => tool.readOnly || profileCanWrite && (writesWithoutAsking || !!approvalSocketPath)).map(tool => ({
            name: tool.listedAs,
            description: `From the instance's own MCP server. ${tool.description}` + (tool.readOnly ? `

The user approves each call.` : `

Changes the instance. To change records, use saturn_create_record, saturn_update_record and saturn_delete_record instead: they back the record up first.`),
            inputSchema: tool.inputSchema
          }))]
        });
        return;
      }
    // Runs a tool after the profile and approval checks below.
    case "tools/call":
      {
        let toolName = String(request.params?.name ?? "");
        // The CLI's permission system asking: forward the question to the editor and return its answer as JSON text.
        if (toolName === approveTool.name) {
          let args = request.params?.arguments ?? {},
            askedTool = String(args.tool_name ?? args.toolName ?? "a tool"),
            answer = await askApproval(askedTool, args.input ?? args.tool_input ?? args),
            reply = {
              behavior: answer.behavior
            };
          answer.message !== void 0 && (reply.message = answer.message), answer.updatedInput !== void 0 && (reply.updatedInput = answer.updatedInput), sendResult(request.id, {
            isError: !1,
            content: [{
              type: "text",
              text: JSON.stringify(reply)
            }]
          });
          return;
        }
        // One of the instance's own tools.
        if (toolName.startsWith(instanceToolPrefix)) {
          sendResult(request.id, await callInstanceTool(toolName, request.params?.arguments));
          return;
        }
        // A profile without instance access may not run saturn_* tools.
        if (!profileCanRead && toolName.startsWith("saturn_")) {
          sendResult(request.id, {
            isError: !0,
            content: [{
              type: "text",
              text: "This agent profile has no access to the Saturn instance. Tell the user which profile would, rather than retrying."
            }]
          });
          return;
        }
        // A profile that may not write gets write tools refused.
        if (isWriteTool(toolName) && !profileCanWrite) {
          sendResult(request.id, {
            isError: !0,
            content: [{
              type: "text",
              text: "This agent profile may not change the instance. Describe the change instead, and tell the user that switching to a profile that can change it would apply it."
            }]
          });
          return;
        }
        // Tools that ask each time (record reads) need approval unless the CLI asks or auto mode is on.
        if (toolAsksEachTime(toolName) && !cliAsks && !autoApprove) {
          let approval = approvalSocketPath ? await askApproval(toolName, request.params?.arguments) : {
            behavior: "deny",
            message: "Reading records needs the user's approval, and there is no way to ask here."
          };
          if (approval.behavior !== "allow") {
            sendResult(request.id, {
              isError: !0,
              content: [{
                type: "text",
                text: approval.message ?? "The user declined reading these records."
              }]
            });
            return;
          }
        }
        // A write without blanket permission: ask the user, then run it.
        if (!writesWithoutAsking && isWriteTool(toolName) && approvalSocketPath) {
          let approval = await askApproval(toolName, request.params?.arguments);
          if (approval.behavior !== "allow") {
            sendResult(request.id, {
              isError: !0,
              content: [{
                type: "text",
                text: approval.message ?? "The user declined this change."
              }]
            });
            return;
          }
          let result = await runAgentTool(saturnBackend, toolName, request.params?.arguments);
          sendResult(request.id, {
            isError: !result.ok,
            content: [{
              type: "text",
              text: result.content
            }]
          });
          return;
        }
        // A write with no way to ask: refused.
        if (!writesWithoutAsking && isWriteTool(toolName)) {
          sendResult(request.id, {
            isError: !0,
            content: [{
              type: "text",
              text: 'This session is read-only. Describe the change instead, and tell the user to enable "let the agent act without asking" in the chat panel if they want it applied.'
            }]
          });
          return;
        }
        let result = await runAgentTool(saturnBackend, toolName, request.params?.arguments);
        sendResult(request.id, {
          isError: !result.ok,
          content: [{
            type: "text",
            text: result.content
          }]
        });
        return;
      }
    case "ping":
      sendResult(request.id, {});
      return;
    default:
      request.id !== void 0 && request.id !== null && sendError(request.id, -32601, `Method not found: ${request.method}`);
      return;
  }
}
// stdinLines (minified: jt) — Reads newline-delimited JSON-RPC messages from stdin; a parse error answers -32700, a handler failure -32603 (or stderr for a notification).
var stdinLines = (0, readline.createInterface)({
  input: process.stdin
});
stdinLines.on("line", line => {
  let trimmed = line.trim();
  if (trimmed.length === 0) return;
  let request;
  try {
    request = JSON.parse(trimmed);
  } catch {
    sendError(null, -32700, "Parse error");
    return;
  }
  handleRequest(request).catch(error => {
    let errorMessage = error instanceof Error ? error.message : String(error);
    request.id !== void 0 && request.id !== null ? sendError(request.id, -32603, errorMessage) : process.stderr.write(`saturn-mcp: ${errorMessage}
`);
  });
});
stdinLines.on("close", () => process.exit(0));
