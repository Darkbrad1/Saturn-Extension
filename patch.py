"""Apply the node-view changes to an unpacked copy of the original sonover-code .vsix.

usage: python3 -I patch.py <unpacked-vsix-dir> <nodeview.js> <version>

Every replacement must match exactly once, so running this against a
different build fails loudly instead of patching the wrong place.
"""
import sys, pathlib

root = pathlib.Path(sys.argv[1])
nodeview_js = pathlib.Path(sys.argv[2])
version = sys.argv[3]


def replace_once(text, old, new, what):
    n = text.count(old)
    if n != 1:
        raise SystemExit(f"patch '{what}': expected 1 match, found {n}")
    return text.replace(old, new)


# ---------------------------------------------------------------- host
p = root / "extension/dist/extension.js"
s = p.read_text()

# 1. Load the node view before the Workflows bundle (same nonce).
s = replace_once(
    s,
    '"workflows","index.css")),s=xe(),o=e.cspSource;return`',
    '"workflows","index.css")),s=xe(),o=e.cspSource,nv=e.asWebviewUri(k.Uri.joinPath(this.extensionUri,"dist","webview","nodeview","index.js"));return`',
    "getHtml uri",
)
i = s.find('nv=e.asWebviewUri(')
old_tag = '<div id="root"></div>\n    <script type="module" nonce="${s}" src="${t}"></script>'
j = s.find(old_tag, i)
if not (0 < j - i < 1500):
    raise SystemExit("patch 'getHtml tag': template not found next to the uri")
s = s[:j] + '<div id="root"></div>\n    <script type="module" nonce="${s}" src="${nv}"></script>\n    <script type="module" nonce="${s}" src="${t}"></script>' + s[j + len(old_tag):]

# 2. Carry a step's "mock" flag (Saturn's "disabled") into the view model.
s = replace_once(
    s,
    "function yr(n,e,t,r=0){",
    'function yr(n,e,t,r=0){let o$=yr$base(n,e,t,r);return o$&&n&&typeof n=="object"&&n.mock===!0&&(o$.mock=!0),o$}function yr$base(n,e,t,r=0){',
    "view model mock flag",
)

# 3. New panel message: switch a step's mock flag on/off as a normal draft edit.
s = replace_once(
    s,
    'case"undoLastEdit":{',
    'case"setStepMock":{let{workflowId:r,path:s$,mock:o$}=e.payload??{};if(!Array.isArray(s$)||s$.length===0){t.postMessage({type:"editFailed",payload:{message:"Missing the step to switch."}});break}let c$=await this.getOperatorCatalog();await this.applyEdit(r,i=>`${o$?"Disabled":"Enabled"} ${Tr(N(i,s$),c$)}`,i=>{let a=N(i,s$);if(!a||typeof a!="object"||Array.isArray(a))throw new Error("That step is no longer where it was \\u2014 reopen it and try again.");return ue(i,s$,{...a,mock:!!o$})});break}case"undoLastEdit":{',
    "setStepMock message",
)
# 4. Moving a step into a container that comes later in the same list: the
#    host removed the step first and then walked the destination path in the
#    new tree, where that container's index had shifted down by one, so the
#    step landed in the wrong place (even inside an operator). Keep the
#    "inside itself" check on the original path; walk the adjusted one.
s = replace_once(
    s,
    'let{parent:l,key:d}=wo(i,t);if(!Array.isArray(l?.[d]))if(l?.[d]===void 0||l?.[d]===null)l[d]=[];else throw new Error(`Cannot move: ${t.join(".")} is not an array`);',
    'let{parent:l,key:d}=wo(i,on$after(e,t));if(!Array.isArray(l?.[d]))if(l?.[d]===void 0||l?.[d]===null)l[d]=[];else throw new Error(`Cannot move: ${t.join(".")} is not an array`);',
    "move path after removal",
)
s = replace_once(
    s,
    "function on(n,e,t,r){",
    'function on$after(e,t){let s=e.slice(0,-1),o=e[e.length-1];if(typeof o!="number"||t.length<=s.length||!s.every((a,c)=>String(a)===String(t[c])))return t;let i=t[s.length];if(typeof i!="number"||i<=o)return t;let a=[...t];return a[s.length]=i-1,a}function on(n,e,t,r){',
    "move path helper",
)
# 5. Form fields: carry the whole stored field into the view model, so the
#    node view can show (and change) every field setting, not just
#    label/key/type/required.
s = replace_once(
    s,
    "inputType:m(n?.input_properties?.type),required:n?.required===!0}}",
    'inputType:m(n?.input_properties?.type),required:n?.required===!0,raw:n&&typeof n=="object"&&!Array.isArray(n)?n:null}}',
    "form field raw",
)
# 6. New message: change any other setting of a form field, by path. Label,
#    key and type stay with updateFormField (they are checked for clashes).
s = replace_once(
    s,
    'case"deleteFormField":{',
    'case"setFormFieldProps":{let{workflowId:r,ownerPath:s$,formKey:o$,key:i$,changes:c$}=e.payload??{};'
    'if(!Array.isArray(c$)||c$.length===0)break;'
    'if(c$.some(x=>!Array.isArray(x?.path)||x.path.length===0||x.path.length>8||["key","label","type"].includes(String(x.path[0]))||x.path.some(y=>(typeof y!="string"&&typeof y!="number")||y==="__proto__"||y==="constructor"||y==="prototype"))){t.postMessage({type:"editFailed",payload:{message:"That field setting can\u2019t be changed here."}});break}'
    'let n$=c$.length===1?String(c$[0].path.join(".")):`${c$.length} settings`;'
    'await this.applyEdit(r,`Changed ${n$} of field "${i$}"`,a=>Rr(a,s$,String(o$),f=>{let v=f.findIndex(E=>m(E?.key)===i$);if(v===-1)throw new Error(`No field "${i$}" here any more.`);let R=[...f];R[v]=ff$set(f[v],c$);return R}));break}'
    'case"deleteFormField":{',
    "setFormFieldProps message",
)
s = replace_once(
    s,
    "function Rr(n,e,t,r){",
    'function ff$set(n,c){let t=n&&typeof n=="object"&&!Array.isArray(n)?{...n}:{};for(let{path:p,value:v,remove:d}of c){let o=t;for(let i=0;i<p.length-1;i++){let k=p[i],x=o[k];o[k]=x&&typeof x=="object"?Array.isArray(x)?[...x]:{...x}:typeof p[i+1]=="number"?[]:{};o=o[k]}let k=p[p.length-1];if(d){if(Array.isArray(o)&&typeof k=="number")o.splice(k,1);else delete o[k]}else o[k]=v===void 0?null:v}return t}function Rr(n,e,t,r){',
    "field set helper",
)
# 7. Multi-select in the node view: delete / disable / enable / duplicate
#    several steps as ONE draft edit (one Ctrl+Z), and copy several steps to the
#    shared clipboard. Paths are handled last-first so earlier ones stay valid.
s = replace_once(
    s,
    'case"copyNode":{',
    'case"bulkSteps":{let{workflowId:r,op:o$,paths:p$,mock:m$}=e.payload??{};'
    'if(!Array.isArray(p$)||p$.length===0||!p$.every(x=>Array.isArray(x)&&x.length>0)||!["delete","duplicate","mock"].includes(o$)){t.postMessage({type:"editFailed",payload:{message:"Nothing selected to change."}});break}'
    'let s$=[...p$].sort(bk$cmp).reverse(),n$=`${p$.length} step${p$.length===1?"":"s"}`;'
    'if(o$==="delete")for(let x of s$)await this.forgetParamFiles(String(r),x);'
    'await this.applyEdit(r,o$==="delete"?`Deleted ${n$}`:o$==="duplicate"?`Duplicated ${n$}`:`${m$?"Disabled":"Enabled"} ${n$}`,a=>{let d=a;for(let x of s$){let v=N(d,x);if(!v||typeof v!="object"||Array.isArray(v))throw new Error("A selected step is no longer where it was \u2014 select again and retry.");'
    'if(o$==="delete")d=sn(d,x).next;else if(o$==="duplicate"){let{childrenPath:q,index:w}=Ia(x);d=Ge(d,q,w,Ut(v))}else d=ue(d,x,{...v,mock:!!m$})}return d});break}'
    'case"copyNodes":{let{workflowId:r,paths:p$}=e.payload??{};try{let o=await this.definitionFor(r),c=[...(Array.isArray(p$)?p$:[])].sort(bk$cmp).map(x=>{let i=N(o,x);if(!i||typeof i!="object")throw new Error("A selected step is no longer there \u2014 reopen the workflow.");return Ut(i)});'
    'if(c.length===0)break;n.clipboard={nodes:c,label:Ga(c,await this.getOperatorCatalog()),sourceWorkflowId:String(r),sourceWorkflowName:typeof o?.name=="string"?o.name:String(r),referencedIds:So(c)},n.broadcastClipboard(),k.window.setStatusBarMessage(`Saturn: copied ${n.clipboard.label}`,3e3)}catch(o){t.postMessage({type:"editFailed",payload:{message:L(o,"Could not copy those steps")}})}break}'
    'case"copyNode":{',
    "bulk step messages",
)
s = replace_once(
    s,
    "function Rr(n,e,t,r){",
    'function bk$cmp(a,b){for(let i=0;i<Math.min(a.length,b.length);i++){let x=a[i],y=b[i];if(x===y)continue;if(typeof x=="number"&&typeof y=="number")return x-y;return String(x)<String(y)?-1:1}return a.length-b.length}function Rr(n,e,t,r){',
    "bulk path order",
)
# 8. System Logs: a read-only screen listing the System Logs core resource's
#    records (opened from the sidebar's instance card, the instance's context
#    menu, or the command palette). It only calls the record-reading helpers.
s = replace_once(
    s,
    'h&&bn.open(n.extensionUri,e,h)}));let kt=',
    'h&&bn.open(n.extensionUri,e,h)}),y.commands.registerCommand("saturn.openSystemLogs",async w=>{let h=w?.instance;if(!h){let b=e.list();if(b.length===0){y.window.showInformationMessage("Connect a Saturn instance first.");return}h=b.length===1?b[0]:await y.window.showQuickPick(b.map(P=>({label:I(P),description:P.url,instance:P})),{placeHolder:"Show system logs for which Saturn instance?"}).then(P=>P?.instance)}h&&SysLogs$.open(n.extensionUri,e,h,n.globalState)}));let kt=',
    "system logs command",
)
s = replace_once(
    s,
    'case"saturn:openMenus":{',
    'case"saturn:openSystemLogs":{let{instanceId:p}=u.payload??{},g=this.instanceManager.get(p);if(!g)return;await ee.commands.executeCommand("saturn.openSystemLogs",{instance:g});break}case"saturn:openMenus":{',
    "sidebar opens system logs",
)
s = replace_once(
    s,
    "0&&(module.exports={activate,deactivate});",
    (pathlib.Path(__file__).parent / "syslogs-host.js").read_text() + "\n0&&(module.exports={activate,deactivate});",
    "system logs panel",
)
p.write_text(s)

# ------------------------------------------------------------ sidebar
p = root / "extension/dist/webview/sidebar/index.js"
sb = p.read_text()
sb = replace_once(
    sb,
    '{label:"Pages",icon:Wn,run:()=>r(I)},',
    '{label:"Pages",icon:Wn,run:()=>r(I)},{label:"System Logs",icon:SL$,run:()=>Ee.postMessage({type:"saturn:openSystemLogs",payload:{instanceId:I.id}})},',
    "sidebar System Logs item",
)
sb = replace_once(
    sb,
    "function GI({groups:e}){",
    'function SL$({className:e}){return(0,Xe.jsxs)("svg",{className:e,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[(0,Xe.jsx)("path",{d:"M4 6h16M4 12h11M4 18h8"}),(0,Xe.jsx)("circle",{cx:"18",cy:"17",r:"3"}),(0,Xe.jsx)("path",{d:"M20.2 19.2 22 21"})]})}function GI({groups:e}){',
    "sidebar System Logs icon",
)
p.write_text(sb)

# ------------------------------------------------------------ list view
p = root / "extension/dist/webview/workflows/index.js"
w = p.read_text()

# 9. Operator card: dim + dashed outline + tooltip when disabled.
w = replace_once(
    w,
    'className:"rounded-md bg-slate-800 text-white px-4 pt-2 pb-3",title:n,...Ti(e.path,!!t)',
    'className:"rounded-md bg-slate-800 text-white px-4 pt-2 pb-3",title:(e.mock?"Disabled \\u2014 this step is skipped when the action runs\\n":"")+n,style:e.mock?{opacity:.6,outline:"1px dashed rgba(240,180,41,.7)",outlineOffset:"-1px"}:void 0,...Ti(e.path,!!t)',
    "list card style",
)

# 10. Operator card header: "Disabled" badge and an Enable/Disable button.
w = replace_once(
    w,
    'e.delay!==null&&(0,b.jsxs)("span",{children:[e.delay," ms"]})',
    'e.delay!==null&&(0,b.jsxs)("span",{children:[e.delay," ms"]}),'
    'e.mock&&(0,b.jsx)("span",{title:"This step is skipped when the action runs",style:{padding:"0 6px",borderRadius:"3px",background:"rgba(240,180,41,.18)",color:"#f0c674",fontWeight:600,letterSpacing:".02em"},children:"Disabled"}),'
    't&&e.operator&&(0,b.jsx)("button",{type:"button",title:e.mock?"Enable this step":"Disable this step (it will be skipped when the action runs)",'
    'onClick:i$=>{i$.stopPropagation(),Z.postMessage({type:"setStepMock",payload:{path:e.path,mock:!e.mock}})},'
    'className:"rounded bg-white/10 hover:bg-white/25 border-none text-white cursor-pointer",style:{padding:"0 6px",fontSize:"10px",lineHeight:"16px"},'
    'children:e.mock?"Enable":"Disable"})',
    "list card badge",
)
# 11. Let the node view switch workflows *through* the list view, so both
#    always show the same one: open the workflow the same way restoring the
#    last selection does.
w = replace_once(
    w,
    '(0,$.useEffect)(()=>{let O=Z.getState()?.selected;O&&typeof O.id=="string"&&pt(O)},[]);',
    '(0,$.useEffect)(()=>{let O=Z.getState()?.selected;O&&typeof O.id=="string"&&pt(O);let h$=E=>{let D=E.detail;D&&typeof D.id=="string"&&pt(D)};return window.addEventListener("sonover:openWorkflow",h$),()=>window.removeEventListener("sonover:openWorkflow",h$)},[]);',
    "list view open-workflow hook",
)
p.write_text(w)

# ------------------------------------------------------------ node view
dst = root / "extension/dist/webview/nodeview/index.js"
dst.parent.mkdir(parents=True, exist_ok=True)
dst.write_bytes(nodeview_js.read_bytes())

logs_dst = root / "extension/dist/webview/logs/index.js"
logs_dst.parent.mkdir(parents=True, exist_ok=True)
logs_dst.write_bytes((nodeview_js.parent / "logs.js").read_bytes())

# package.json: the command, the instance context-menu entry, and a setting
import json
pj = root / "extension/package.json"
d = json.loads(pj.read_text())
c = d["contributes"]
if not any(x["command"] == "saturn.openSystemLogs" for x in c["commands"]):
    c["commands"].append({"command": "saturn.openSystemLogs", "title": "Saturn: Open System Logs", "icon": "$(output)"})
ctx = c["menus"]["view/item/context"]
if not any(x["command"] == "saturn.openSystemLogs" for x in ctx):
    i = next(i for i, x in enumerate(ctx) if x["command"] == "saturn.openPages")
    ctx.insert(i + 1, {"command": "saturn.openSystemLogs", "when": "view == saturn-explorer && viewItem == saturn.instance", "group": "1_modification"})
props = c["configuration"]["properties"]
props.setdefault("saturn.systemLogResource", {
    "type": "string",
    "default": "",
    "markdownDescription": "Resource that **Saturn: Open System Logs** lists. Leave empty to use the instance's System Logs core resource (found by name). The screen only reads records; it never changes them.",
})
pj.write_text(json.dumps(d, indent="\t", ensure_ascii=False) + "\n")

# ------------------------------------------------------------- metadata
for f, old_fmt, new_fmt in [
    ("extension/package.json", '"version": "{}"', '"version": "{}"'),
    ("extension.vsixmanifest", 'Version="{}" Publisher', 'Version="{}" Publisher'),
]:
    fp = root / f
    t = fp.read_text()
    t = replace_once(t, old_fmt.format("0.1.1"), new_fmt.format(version), f"version in {f}")
    fp.write_text(t)

r = root / "extension/readme.md"
t = r.read_text()
t = replace_once(
    t,
    "- **AI agents**",
    "- **Node view** -- Open any workflow as a Blender-style node graph from the **Node view** button on the Workflows screen. Operators are nodes, run order is wires, loops, conditions and parallel blocks are frames, and command references are node groups you can Tab into. Edit in place with Blender keys: Shift+A add, X delete, Shift+D duplicate, M disable/enable, drag a node onto a wire to move it, Ctrl+Z undo, N for the side panel, Home to fit. Select a step to edit its settings right in the Figma-style side panel (Design / Inspect tabs, changes apply on Enter or when you leave a field, Esc reverts); drag the panel's left edge to resize it. Code parameters open in a real editor and emails open with their preview, as in the list view. Every edit goes through the same draft, undo and Save flow as the list view, so the two views stay in sync.\n"
    "- **Find your way around** -- In the node view, stages open and close like folders (click a stage; collapse-all in the Stages header; remembered per workflow). Search ( / ) finds stages, actions and commands by name, and every action or command whose steps match — search an operator like `debug` to see every action that uses it, then click to jump to the step. In the Add menu (Shift+A) each command is listed like an operator, so typing its name adds it directly.\n"
    "- **Everything the list view does, in the node view** -- Switch, create and delete workflows; stage colour and machine names; drag to reorder stages and actions; action access control and form fields; command parameters and where a command is used; triggers (schedule presets, webhooks, secrets) and resource lifecycle hooks; copy and paste (shared with the list view); the full parameter editors (lookups from the instance, resource pickers, key/value maps, command parameters, designed emails); offline and changed-elsewhere notices.\n"
    "- **Building workflows in the node view** -- Create, rename (double-click) and delete stages, actions and commands from the node view's layers panel. Empty branches, loops and actions show a dashed slot to click or drop a step into, and every wire has a + button to insert a step right there.\n"
    "- **Disabled steps** -- Steps switched off in Saturn (`\"mock\": true`) are shown as disabled in both the list view and the node view, and can be disabled or enabled from either.\n"
    "- **System Logs** -- Open an instance's System Logs (from its card in the Sonover sidebar, its right-click menu, or **Saturn: Open System Logs**) to list the System Logs core resource's records: newest first, paging, Live refresh, level chips, search, a server filter, column picker and a detail pane. Read-only -- it never changes a record. Point it at another resource with `saturn.systemLogResource`, or pick one in the screen.\n"
    "- **Node view first, multi-select** -- The Workflows screen opens in the node view (List view is a click away), and flows run top to bottom by default (the Vertical/Horizontal button switches). Shift+click several steps to disable/enable, duplicate, copy or delete them together from the right-click menu, the side panel or the keys -- each as one change that a single Ctrl+Z undoes. Stages in the layers panel have guide lines and dividers, and the side panel's Changes tab lists the workflow's unsaved edits and the node view's release notes.\n"
    "- **Smarter inputs** -- Every text box in the node view's side panel is syntax highlighted (`{{ templates }}`, JSON, JavaScript, HTML, CSS and cron). Number and time fields scrub like Figma: hold the label and drag sideways (Shift for ×10, Alt for fine steps), or use the arrow keys; millisecond delays show as seconds/minutes. Date and time parameters get a calendar picker with **Now** / **Today**, and colours get a full colour picker (with an eyedropper where available).\n"
    "- **Every form-field setting** -- Edit a form field (or command parameter) in the node view to reach all of its settings: validation (unique, searchable, email, IP), visibility (table, form, view, drawer, own tab), layout (column width, columns, span), read/write defaults, input type and template, lookup and map (reference, value/label fields, label function), rendering, meta tags, required columns, default view — or the whole field as JSON.\n"
    "- **AI agents**",
    "readme",
)
r.write_text(t)
print("patched", root)
