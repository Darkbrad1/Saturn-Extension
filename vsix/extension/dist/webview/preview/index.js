/*
 * sonover-code — the preview webview (Vue): renders operator HTML / single-file components with an in-browser Tailwind compiler.
 *
 * Shipped by the original 0.1.1 build as a minified esbuild bundle; made readable here:
 * formatted, the app code's variables named and commented, icons named after themselves.
 * Library code (React, lucide-react, tailwind-merge, …) is marked by "──── Library: … ────"
 * comments and left as it was, names minified; "──── App: … ────" starts this extension's code.
 * build.mjs minifies this file into the package; package.sh proves (tools/same-code.mjs) that
 * the minified file is the same program. Rename with tools/rename.mjs, not by hand.
 */
// ──── Library: esbuild runtime helpers (__export) (bundled from npm; unchanged, names left minified) ────
var Ig = Object.defineProperty;
var Rg = (e, t) => {
  for (var n in t) Ig(e, n, {
    get: t[n],
    enumerable: !0
  });
};
// ──── Library: vue 3.5.41 full build (vue.esm-bundler: @vue/shared, reactivity, runtime-core, runtime-dom, compiler-core, compiler-dom; ends with registerRuntimeCompiler) (bundled from npm; unchanged, names left minified) ────
var fc = {};
Rg(fc, {
  BaseTransition: () => Fl,
  BaseTransitionPropsValidators: () => Hs,
  Comment: () => vt,
  DeprecationTypes: () => xb,
  EffectScope: () => Rr,
  ErrorCodes: () => kv,
  ErrorTypeStrings: () => bb,
  Fragment: () => Ct,
  KeepAlive: () => s1,
  ReactiveEffect: () => Hn,
  Static: () => mr,
  Suspense: () => Q1,
  Teleport: () => Pv,
  Text: () => hr,
  TrackOpTypes: () => Rf,
  Transition: () => Cb,
  TransitionGroup: () => ty,
  TriggerOpTypes: () => Mf,
  VueElement: () => ta,
  assertNumber: () => wv,
  callWithAsyncErrorHandling: () => nn,
  callWithErrorHandling: () => qr,
  camelize: () => Ze,
  capitalize: () => pn,
  cloneVNode: () => Rn,
  compatUtils: () => Nb,
  computed: () => tp,
  createApp: () => createApp,
  createBlock: () => Rs,
  createCommentVNode: () => Wd,
  createElementBlock: () => ob,
  createElementVNode: () => Jl,
  createHydrationRenderer: () => Gl,
  createPropsRestProxy: () => T1,
  createRenderer: () => ql,
  createSSRApp: () => qp,
  createSlots: () => p1,
  createStaticVNode: () => cb,
  createTextVNode: () => Zl,
  createVNode: () => ut,
  customRef: () => bs,
  defineAsyncComponent: () => i1,
  defineComponent: () => defineComponent,
  defineCustomElement: () => Rp,
  defineEmits: () => b1,
  defineExpose: () => y1,
  defineModel: () => E1,
  defineOptions: () => w1,
  defineProps: () => v1,
  defineSSRCustomElement: () => Gb,
  defineSlots: () => k1,
  devtools: () => yb,
  effect: () => bf,
  effectScope: () => ff,
  getCurrentInstance: () => zt,
  getCurrentScope: () => vl,
  getCurrentWatcher: () => Pf,
  getTransitionRawChildren: () => yo,
  guardReactiveProps: () => Kd,
  h: () => ec,
  handleError: () => Gr,
  hasInjectionContext: () => Av,
  hydrate: () => py,
  hydrateOnIdle: () => Zv,
  hydrateOnInteraction: () => n1,
  hydrateOnMediaQuery: () => t1,
  hydrateOnVisible: () => e1,
  initCustomFormatter: () => np,
  initDirectivesForSSR: () => hy,
  inject: () => ao,
  isMemoSame: () => rp,
  isProxy: () => Pr,
  isReactive: () => hn,
  isReadonly: () => Qt,
  isRef: () => dt,
  isRuntimeOnly: () => Jd,
  isShallow: () => Tt,
  isVNode: () => Xn,
  markRaw: () => gs,
  mergeDefaults: () => S1,
  mergeModels: () => O1,
  mergeProps: () => Xd,
  nextTick: () => vo,
  nodeOps: () => Op,
  normalizeClass: () => $r,
  normalizeProps: () => nf,
  normalizeStyle: () => Vr,
  onActivated: () => hd,
  onBeforeMount: () => vd,
  onBeforeUnmount: () => Ws,
  onBeforeUpdate: () => Ks,
  onDeactivated: () => md,
  onErrorCaptured: () => kd,
  onMounted: () => xi,
  onRenderTracked: () => wd,
  onRenderTriggered: () => yd,
  onScopeDispose: () => df,
  onServerPrefetch: () => bd,
  onUnmounted: () => Si,
  onUpdated: () => ko,
  onWatcherCleanup: () => kl,
  openBlock: () => ho,
  patchProp: () => Ip,
  popScopeId: () => Ov,
  provide: () => od,
  proxyRefs: () => no,
  pushScopeId: () => Sv,
  queuePostFlushCb: () => _i,
  reactive: () => mi,
  readonly: () => eo,
  ref: () => Lr,
  registerRuntimeCompiler: () => Ql,
  render: () => Xp,
  renderList: () => d1,
  renderSlot: () => h1,
  resolveComponent: () => c1,
  resolveDirective: () => f1,
  resolveDynamicComponent: () => u1,
  resolveFilter: () => _b,
  resolveTransitionHooks: () => Kr,
  setBlockTracking: () => mo,
  setDevtoolsHook: () => wb,
  setTransitionHooks: () => In,
  shallowReactive: () => hs,
  shallowReadonly: () => Of,
  shallowRef: () => vs,
  ssrContextKey: () => sd,
  ssrUtils: () => Eb,
  stop: () => yf,
  toDisplayString: () => rl,
  toHandlerKey: () => jn,
  toHandlers: () => m1,
  toRaw: () => Xe,
  toRef: () => Vf,
  toRefs: () => Df,
  toValue: () => Af,
  transformVNodeArgs: () => ab,
  triggerRef: () => Cf,
  unref: () => Fr,
  useAttrs: () => x1,
  useCssModule: () => Zb,
  useCssVars: () => Ib,
  useHost: () => Mp,
  useId: () => Fv,
  useModel: () => P1,
  useSSRContext: () => ad,
  useShadowRoot: () => Jb,
  useSlots: () => N1,
  useTemplateRef: () => Uv,
  useTransitionState: () => zs,
  vModelCheckbox: () => cc,
  vModelDynamic: () => zp,
  vModelRadio: () => uc,
  vModelSelect: () => Up,
  vModelText: () => ra,
  vShow: () => Vp,
  version: () => ip,
  warn: () => Ys,
  watch: () => Hr,
  watchEffect: () => Dv,
  watchPostEffect: () => Vv,
  watchSyncEffect: () => ld,
  withAsyncContext: () => C1,
  withCtx: () => Ll,
  withDefaults: () => _1,
  withDirectives: () => Cv,
  withKeys: () => dy,
  withMemo: () => vb,
  withModifiers: () => uy,
  withScopeId: () => Tv
});
function It(e) {
  let t = Object.create(null);
  for (let n of e.split(",")) t[n] = 1;
  return n => n in t;
}
var Be = {},
  Ar = [],
  ht = () => {},
  cr = () => !1,
  Tn = e => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && (e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97),
  li = e => e.startsWith("onUpdate:"),
  Ue = Object.assign,
  Ki = (e, t) => {
    let n = e.indexOf(t);
    n > -1 && e.splice(n, 1);
  },
  Mg = Object.prototype.hasOwnProperty,
  Je = (e, t) => Mg.call(e, t),
  _e = Array.isArray,
  Dr = e => ci(e) === "[object Map]",
  Un = e => ci(e) === "[object Set]",
  qu = e => ci(e) === "[object Date]",
  Ju = e => ci(e) === "[object RegExp]",
  $e = e => typeof e == "function",
  Me = e => typeof e == "string",
  kt = e => typeof e == "symbol",
  qe = e => e !== null && typeof e == "object",
  ts = e => (qe(e) || $e(e)) && $e(e.then) && $e(e.catch),
  Zu = Object.prototype.toString,
  ci = e => Zu.call(e),
  Ja = e => ci(e).slice(8, -1),
  ui = e => ci(e) === "[object Object]",
  Wi = e => Me(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e,
  Nn = It(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"),
  Za = It("bind,cloak,else-if,else,for,html,if,model,on,once,pre,show,slot,text,memo"),
  ns = e => {
    let t = Object.create(null);
    return n => t[n] || (t[n] = e(n));
  },
  Pg = /-\w/g,
  Ze = ns(e => e.replace(Pg, t => t.slice(1).toUpperCase())),
  Lg = /\B([A-Z])/g,
  Ut = ns(e => e.replace(Lg, "-$1").toLowerCase()),
  pn = ns(e => e.charAt(0).toUpperCase() + e.slice(1)),
  jn = ns(e => e ? `on${pn(e)}` : ""),
  Et = (e, t) => !Object.is(e, t),
  ur = (e, ...t) => {
    for (let n = 0; n < e.length; n++) e[n](...t);
  },
  rs = (e, t, n, i = !1) => {
    Object.defineProperty(e, t, {
      configurable: !0,
      enumerable: !1,
      writable: i,
      value: n
    });
  },
  fi = e => {
    let t = parseFloat(e);
    return isNaN(t) ? e : t;
  },
  di = e => {
    let t = Me(e) ? Number(e) : NaN;
    return isNaN(t) ? e : t;
  },
  Gu,
  Xi = () => Gu || (Gu = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {});
function Qu(e, t) {
  return e + JSON.stringify(t, (n, i) => typeof i == "function" ? i.toString() : i);
}
var Fg = "Infinity,undefined,NaN,isFinite,isNaN,parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,BigInt,console,Error,Symbol",
  ef = It(Fg);
var Yu = 2;
function tf(e, t = 0, n = e.length) {
  if (t = Math.max(0, Math.min(t, e.length)), n = Math.max(0, Math.min(n, e.length)), t > n) return "";
  let i = e.split(/(\r?\n)/),
    s = i.filter((p, g) => g % 2 === 1);
  i = i.filter((p, g) => g % 2 === 0);
  let l = 0,
    u = [];
  for (let p = 0; p < i.length; p++) if (l += i[p].length + (s[p] && s[p].length || 0), l >= t) {
    for (let g = p - Yu; g <= p + Yu || n > l; g++) {
      if (g < 0 || g >= i.length) continue;
      let _ = g + 1;
      u.push(`${_}${" ".repeat(Math.max(3 - String(_).length, 0))}|  ${i[g]}`);
      let x = i[g].length,
        w = s[g] && s[g].length || 0;
      if (g === p) {
        let V = t - (l - (x + w)),
          $ = Math.max(1, n > l ? x - V : n - t);
        u.push("   |  " + " ".repeat(V) + "^".repeat($));
      } else if (g > p) {
        if (n > l) {
          let V = Math.max(Math.min(n - l, x), 1);
          u.push("   |  " + "^".repeat(V));
        }
        l += x + w;
      }
    }
    break;
  }
  return u.join(`
`);
}
function Vr(e) {
  if (_e(e)) {
    let t = {};
    for (let n = 0; n < e.length; n++) {
      let i = e[n],
        s = Me(i) ? Qa(i) : Vr(i);
      if (s) for (let l in s) t[l] = s[l];
    }
    return t;
  } else if (Me(e) || qe(e)) return e;
}
var Ug = /;(?![^(]*\))/g,
  jg = /:([^]+)/,
  zg = /\/\*[^]*?\*\//g;
function Qa(e) {
  let t = {};
  return e.replace(zg, "").split(Ug).forEach(n => {
    if (n) {
      let i = n.split(jg);
      i.length > 1 && (t[i[0].trim()] = i[1].trim());
    }
  }), t;
}
function $r(e) {
  let t = "";
  if (Me(e)) t = e;else if (_e(e)) for (let n = 0; n < e.length; n++) {
    let i = $r(e[n]);
    i && (t += i + " ");
  } else if (qe(e)) for (let n in e) e[n] && (t += n + " ");
  return t.trim();
}
function nf(e) {
  if (!e) return null;
  let {
    class: t,
    style: n
  } = e;
  return t && !Me(t) && (e.class = $r(t)), n && (e.style = Vr(n)), e;
}
var Hg = "html,body,base,head,link,meta,style,title,address,article,aside,footer,header,hgroup,h1,h2,h3,h4,h5,h6,nav,section,div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,ruby,s,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,embed,object,param,source,canvas,script,noscript,del,ins,caption,col,colgroup,table,thead,tbody,td,th,tr,button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,output,progress,select,textarea,details,dialog,menu,summary,template,blockquote,iframe,tfoot",
  Bg = "svg,animate,animateMotion,animateTransform,circle,clipPath,color-profile,defs,desc,discard,ellipse,feBlend,feColorMatrix,feComponentTransfer,feComposite,feConvolveMatrix,feDiffuseLighting,feDisplacementMap,feDistantLight,feDropShadow,feFlood,feFuncA,feFuncB,feFuncG,feFuncR,feGaussianBlur,feImage,feMerge,feMergeNode,feMorphology,feOffset,fePointLight,feSpecularLighting,feSpotLight,feTile,feTurbulence,filter,foreignObject,g,hatch,hatchpath,image,line,linearGradient,marker,mask,mesh,meshgradient,meshpatch,meshrow,metadata,mpath,path,pattern,polygon,polyline,radialGradient,rect,set,solidcolor,stop,switch,symbol,text,textPath,title,tspan,unknown,use,view",
  Kg = "annotation,annotation-xml,maction,maligngroup,malignmark,math,menclose,merror,mfenced,mfrac,mfraction,mglyph,mi,mlabeledtr,mlongdiv,mmultiscripts,mn,mo,mover,mpadded,mphantom,mprescripts,mroot,mrow,ms,mscarries,mscarry,msgroup,msline,mspace,msqrt,msrow,mstack,mstyle,msub,msubsup,msup,mtable,mtd,mtext,mtr,munder,munderover,none,semantics",
  Wg = "area,base,br,col,embed,hr,img,input,link,meta,param,source,track,wbr",
  el = It(Hg),
  tl = It(Bg),
  nl = It(Kg),
  rf = It(Wg),
  of = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly",
  sf = It(of),
  Xg = It(of + ",async,autofocus,autoplay,controls,default,defer,disabled,inert,loop,open,required,reversed,scoped,seamless,checked,muted,multiple,selected");
function is(e) {
  return !!e || e === "";
}
function qg(e, t) {
  if (e.length !== t.length) return !1;
  let n = !0;
  for (let i = 0; n && i < e.length; i++) n = xn(e[i], t[i]);
  return n;
}
function xn(e, t) {
  if (e === t) return !0;
  let n = qu(e),
    i = qu(t);
  if (n || i) return n && i ? e.getTime() === t.getTime() : !1;
  if (n = kt(e), i = kt(t), n || i) return e === t;
  if (n = _e(e), i = _e(t), n || i) return n && i ? qg(e, t) : !1;
  if (n = qe(e), i = qe(t), n || i) {
    if (!n || !i) return !1;
    let s = Object.keys(e).length,
      l = Object.keys(t).length;
    if (s !== l) return !1;
    for (let u in e) {
      let p = e.hasOwnProperty(u),
        g = t.hasOwnProperty(u);
      if (p && !g || !p && g || !xn(e[u], t[u])) return !1;
    }
  }
  return String(e) === String(t);
}
function qi(e, t) {
  return e.findIndex(n => xn(n, t));
}
var af = e => !!(e && e.__v_isRef === !0),
  rl = e => Me(e) ? e : e == null ? "" : _e(e) || qe(e) && (e.toString === Zu || !$e(e.toString)) ? af(e) ? rl(e.value) : JSON.stringify(e, lf, 2) : String(e),
  lf = (e, t) => af(t) ? lf(e, t.value) : Dr(t) ? {
    [`Map(${t.size})`]: [...t.entries()].reduce((n, [i, s], l) => (n[Ya(i, l) + " =>"] = s, n), {})
  } : Un(t) ? {
    [`Set(${t.size})`]: [...t.values()].map(n => Ya(n))
  } : kt(t) ? Ya(t) : qe(t) && !_e(t) && !ui(t) ? String(t) : t,
  Ya = (e, t = "") => {
    var n;
    return kt(e) ? `Symbol(${(n = e.description) != null ? n : t})` : e;
  };
function il(e) {
  return e == null ? "initial" : typeof e == "string" ? e === "" ? " " : e : (typeof e != "number" || Number.isFinite(e), String(e));
}
function Gg(e, ...t) {
  console.warn(`[Vue warn] ${e}`, ...t);
}
var Ot,
  Rr = class {
    constructor(t = !1) {
      this.detached = t, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this._warnOnRun = !0, this.__v_skip = !0, !t && Ot && (Ot.active ? (this.parent = Ot, this.index = (Ot.scopes || (Ot.scopes = [])).push(this) - 1) : (this._active = !1, this._warnOnRun = !1));
    }
    get active() {
      return this._active;
    }
    pause() {
      if (this._active) {
        this._isPaused = !0;
        let t, n;
        if (this.scopes) {
          let i = this.scopes.slice();
          for (t = 0, n = i.length; t < n; t++) i[t].pause();
        }
        for (t = 0, n = this.effects.length; t < n; t++) this.effects[t].pause();
      }
    }
    resume() {
      if (this._active && this._isPaused) {
        this._isPaused = !1;
        let t, n;
        if (this.scopes) {
          let s = this.scopes.slice();
          for (t = 0, n = s.length; t < n; t++) s[t].resume();
        }
        let i = this.effects.slice();
        for (t = 0, n = i.length; t < n; t++) i[t].resume();
      }
    }
    run(t) {
      if (this._active) {
        let n = Ot;
        try {
          return Ot = this, t();
        } finally {
          Ot = n;
        }
      }
    }
    on() {
      ++this._on === 1 && (this.prevScope = Ot, Ot = this);
    }
    off() {
      if (this._on > 0 && --this._on === 0) {
        if (Ot === this) Ot = this.prevScope;else {
          let t = Ot;
          for (; t;) {
            if (t.prevScope === this) {
              t.prevScope = this.prevScope;
              break;
            }
            t = t.prevScope;
          }
        }
        this.prevScope = void 0;
      }
    }
    stop(t) {
      if (this._active) {
        this._active = !1;
        let n, i;
        for (n = 0, i = this.effects.length; n < i; n++) this.effects[n].stop();
        for (this.effects.length = 0, n = 0, i = this.cleanups.length; n < i; n++) this.cleanups[n]();
        if (this.cleanups.length = 0, this.scopes) {
          let s = this.scopes.slice();
          for (n = 0, i = s.length; n < i; n++) s[n].stop(!0);
          this.scopes.length = 0;
        }
        if (!this.detached && this.parent && !t) {
          let s = this.parent.scopes.pop();
          s && s !== this && (this.parent.scopes[this.index] = s, s.index = this.index);
        }
        this.parent = void 0;
      }
    }
  };
function ff(e) {
  return new Rr(e);
}
function vl() {
  return Ot;
}
function df(e, t = !1) {
  Ot && Ot.cleanups.push(e);
}
var at;
var ol = new WeakSet(),
  Hn = class {
    constructor(t) {
      this.fn = t, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, Ot && (Ot.active ? Ot.effects.push(this) : this.flags &= -2);
    }
    pause() {
      this.flags |= 64;
    }
    resume() {
      this.flags & 64 && (this.flags &= -65, ol.has(this) && (ol.delete(this), this.trigger()));
    }
    notify() {
      this.flags & 2 && !(this.flags & 32) || this.flags & 8 || hf(this);
    }
    run() {
      if (!(this.flags & 1)) return this.fn();
      this.flags |= 2, cf(this), mf(this);
      let t = at,
        n = Sn;
      at = this, Sn = !0;
      try {
        return this.fn();
      } finally {
        gf(this), at = t, Sn = n, this.flags &= -3;
      }
    }
    stop() {
      if (this.flags & 1) {
        for (let t = this.deps; t; t = t.nextDep) wl(t);
        this.deps = this.depsTail = void 0, cf(this), this.onStop && this.onStop(), this.flags &= -2;
      }
    }
    trigger() {
      this.flags & 64 ? ol.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
    }
    runIfDirty() {
      ll(this) && this.run();
    }
    get dirty() {
      return ll(this);
    }
  },
  pf = 0,
  Yi,
  Ji;
function hf(e, t = !1) {
  if (e.flags |= 8, t) {
    e.next = Ji, Ji = e;
    return;
  }
  e.next = Yi, Yi = e;
}
function bl() {
  pf++;
}
function yl() {
  if (--pf > 0) return;
  if (Ji) {
    let t = Ji;
    for (Ji = void 0; t;) {
      let n = t.next;
      t.next = void 0, t.flags &= -9, t = n;
    }
  }
  let e;
  for (; Yi;) {
    let t = Yi;
    for (Yi = void 0; t;) {
      let n = t.next;
      if (t.next = void 0, t.flags &= -9, t.flags & 1) try {
        t.trigger();
      } catch (i) {
        e || (e = i);
      }
      t = n;
    }
  }
  if (e) throw e;
}
function mf(e) {
  for (let t = e.deps; t; t = t.nextDep) t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function gf(e) {
  let t,
    n = e.depsTail,
    i = n;
  for (; i;) {
    let s = i.prevDep;
    i.version === -1 ? (i === n && (n = s), wl(i), Yg(i)) : t = i, i.dep.activeLink = i.prevActiveLink, i.prevActiveLink = void 0, i = s;
  }
  e.deps = t, e.depsTail = n;
}
function ll(e) {
  for (let t = e.deps; t; t = t.nextDep) if (t.dep.version !== t.version || t.dep.computed && (vf(t.dep.computed) || t.dep.version !== t.version)) return !0;
  return !!e._dirty;
}
function vf(e) {
  if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === Zi) || (e.globalVersion = Zi, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !ll(e)))) return;
  e.flags |= 2;
  let t = e.dep,
    n = at,
    i = Sn;
  at = e, Sn = !0;
  try {
    mf(e);
    let s = e.fn(e._value);
    (t.version === 0 || Et(s, e._value)) && (e.flags |= 128, e._value = s, t.version++);
  } catch (s) {
    throw t.version++, s;
  } finally {
    at = n, Sn = i, gf(e), e.flags &= -3;
  }
}
function wl(e, t = !1) {
  let {
    dep: n,
    prevSub: i,
    nextSub: s
  } = e;
  if (i && (i.nextSub = s, e.prevSub = void 0), s && (s.prevSub = i, e.nextSub = void 0), n.subs === e && (n.subs = i, !i && n.computed)) {
    n.computed.flags &= -5;
    for (let l = n.computed.deps; l; l = l.nextDep) wl(l, !0);
  }
  !t && ! --n.sc && n.map && n.map.delete(n.key);
}
function Yg(e) {
  let {
    prevDep: t,
    nextDep: n
  } = e;
  t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
function bf(e, t) {
  e.effect instanceof Hn && (e = e.effect.fn);
  let n = new Hn(e);
  t && Ue(n, t);
  try {
    n.run();
  } catch (s) {
    throw n.stop(), s;
  }
  let i = n.run.bind(n);
  return i.effect = n, i;
}
function yf(e) {
  e.effect.stop();
}
var Sn = !0,
  wf = [];
function gn() {
  wf.push(Sn), Sn = !1;
}
function vn() {
  let e = wf.pop();
  Sn = e === void 0 ? !0 : e;
}
function cf(e) {
  let {
    cleanup: t
  } = e;
  if (e.cleanup = void 0, t) {
    let n = at;
    at = void 0;
    try {
      t();
    } finally {
      at = n;
    }
  }
}
var Zi = 0,
  cl = class {
    constructor(t, n) {
      this.sub = t, this.dep = n, this.version = n.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
    }
  },
  hi = class {
    constructor(t) {
      this.computed = t, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
    }
    track(t) {
      if (!at || !Sn || at === this.computed) return;
      let n = this.activeLink;
      if (n === void 0 || n.sub !== at) n = this.activeLink = new cl(at, this), at.deps ? (n.prevDep = at.depsTail, at.depsTail.nextDep = n, at.depsTail = n) : at.deps = at.depsTail = n, kf(n);else if (n.version === -1 && (n.version = this.version, n.nextDep)) {
        let i = n.nextDep;
        i.prevDep = n.prevDep, n.prevDep && (n.prevDep.nextDep = i), n.prevDep = at.depsTail, n.nextDep = void 0, at.depsTail.nextDep = n, at.depsTail = n, at.deps === n && (at.deps = i);
      }
      return n;
    }
    trigger(t) {
      this.version++, Zi++, this.notify(t);
    }
    notify(t) {
      bl();
      try {
        for (let n = this.subs; n; n = n.prevSub) n.sub.notify() && n.sub.dep.notify();
      } finally {
        yl();
      }
    }
  };
function kf(e) {
  if (e.dep.sc++, e.sub.flags & 4) {
    let t = e.dep.computed;
    if (t && !e.dep.subs) {
      t.flags |= 20;
      for (let i = t.deps; i; i = i.nextDep) kf(i);
    }
    let n = e.dep.subs;
    n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subs = e;
  }
}
var ls = new WeakMap(),
  Ir = Symbol(""),
  ul = Symbol(""),
  Qi = Symbol("");
function Rt(e, t, n) {
  if (Sn && at) {
    let i = ls.get(e);
    i || ls.set(e, i = new Map());
    let s = i.get(n);
    s || (i.set(n, s = new hi()), s.map = i, s.key = n), s.track();
  }
}
function An(e, t, n, i, s, l) {
  let u = ls.get(e);
  if (!u) {
    Zi++;
    return;
  }
  let p = g => {
    g && g.trigger();
  };
  if (bl(), t === "clear") u.forEach(p);else {
    let g = _e(e),
      _ = g && Wi(n);
    if (g && n === "length") {
      let x = Number(i);
      u.forEach((w, V) => {
        (V === "length" || V === Qi || !kt(V) && V >= x) && p(w);
      });
    } else switch ((n !== void 0 || u.has(void 0)) && p(u.get(n)), _ && p(u.get(Qi)), t) {
      case "add":
        g ? _ && p(u.get("length")) : (p(u.get(Ir)), Dr(e) && p(u.get(ul)));
        break;
      case "delete":
        g || (p(u.get(Ir)), Dr(e) && p(u.get(ul)));
        break;
      case "set":
        Dr(e) && p(u.get(Ir));
        break;
    }
  }
  yl();
}
function Jg(e, t) {
  let n = ls.get(e);
  return n && n.get(t);
}
function pi(e) {
  let t = Xe(e);
  return t === e ? t : (Rt(t, "iterate", Qi), Tt(e) ? t : t.map(mn));
}
function to(e) {
  return Rt(e = Xe(e), "iterate", Qi), e;
}
function Cn(e, t) {
  return Qt(e) ? Mr(hn(e) ? mn(t) : t) : mn(t);
}
var Zg = {
  __proto__: null,
  [Symbol.iterator]() {
    return sl(this, Symbol.iterator, e => Cn(this, e));
  },
  concat(...e) {
    return pi(this).concat(...e.map(t => _e(t) ? pi(t) : t));
  },
  entries() {
    return sl(this, "entries", e => (e[1] = Cn(this, e[1]), e));
  },
  every(e, t) {
    return zn(this, "every", e, t, void 0, arguments);
  },
  filter(e, t) {
    return zn(this, "filter", e, t, n => n.map(i => Cn(this, i)), arguments);
  },
  find(e, t) {
    return zn(this, "find", e, t, n => Cn(this, n), arguments);
  },
  findIndex(e, t) {
    return zn(this, "findIndex", e, t, void 0, arguments);
  },
  findLast(e, t) {
    return zn(this, "findLast", e, t, n => Cn(this, n), arguments);
  },
  findLastIndex(e, t) {
    return zn(this, "findLastIndex", e, t, void 0, arguments);
  },
  forEach(e, t) {
    return zn(this, "forEach", e, t, void 0, arguments);
  },
  includes(...e) {
    return al(this, "includes", e);
  },
  indexOf(...e) {
    return al(this, "indexOf", e);
  },
  join(e) {
    return pi(this).join(e);
  },
  lastIndexOf(...e) {
    return al(this, "lastIndexOf", e);
  },
  map(e, t) {
    return zn(this, "map", e, t, void 0, arguments);
  },
  pop() {
    return Gi(this, "pop");
  },
  push(...e) {
    return Gi(this, "push", e);
  },
  reduce(e, ...t) {
    return uf(this, "reduce", e, t);
  },
  reduceRight(e, ...t) {
    return uf(this, "reduceRight", e, t);
  },
  shift() {
    return Gi(this, "shift");
  },
  some(e, t) {
    return zn(this, "some", e, t, void 0, arguments);
  },
  splice(...e) {
    return Gi(this, "splice", e);
  },
  toReversed() {
    return pi(this).toReversed();
  },
  toSorted(e) {
    return pi(this).toSorted(e);
  },
  toSpliced(...e) {
    return pi(this).toSpliced(...e);
  },
  unshift(...e) {
    return Gi(this, "unshift", e);
  },
  values() {
    return sl(this, "values", e => Cn(this, e));
  }
};
function sl(e, t, n) {
  let i = to(e),
    s = i[t]();
  return i !== e && !Tt(e) && (s._next = s.next, s.next = () => {
    let l = s._next();
    return l.done || (l.value = n(l.value)), l;
  }), s;
}
var Qg = Array.prototype;
function zn(e, t, n, i, s, l) {
  let u = to(e),
    p = u !== e && !Tt(e),
    g = u[t];
  if (g !== Qg[t]) {
    let w = g.apply(e, l);
    return p ? mn(w) : w;
  }
  let _ = n;
  u !== e && (p ? _ = function (w, V) {
    return n.call(this, Cn(e, w), V, e);
  } : n.length > 2 && (_ = function (w, V) {
    return n.call(this, w, V, e);
  }));
  let x = g.call(u, _, i);
  return p && s ? s(x) : x;
}
function uf(e, t, n, i) {
  let s = to(e),
    l = s !== e && !Tt(e),
    u = n,
    p = !1;
  s !== e && (l ? (p = i.length === 0, u = function (_, x, w) {
    return p && (p = !1, _ = Cn(e, _)), n.call(this, _, Cn(e, x), w, e);
  }) : n.length > 3 && (u = function (_, x, w) {
    return n.call(this, _, x, w, e);
  }));
  let g = s[t](u, ...i);
  return p ? Cn(e, g) : g;
}
function al(e, t, n) {
  let i = Xe(e);
  Rt(i, "iterate", Qi);
  let s = i[t](...n);
  return (s === -1 || s === !1) && Pr(n[0]) ? (n[0] = Xe(n[0]), i[t](...n)) : s;
}
function Gi(e, t, n = []) {
  gn(), bl();
  let i = Xe(e)[t].apply(e, n);
  return yl(), vn(), i;
}
var ev = It("__proto__,__v_isRef,__isVue"),
  Ef = new Set(Object.getOwnPropertyNames(Symbol).filter(e => e !== "arguments" && e !== "caller").map(e => Symbol[e]).filter(kt));
function tv(e) {
  kt(e) || (e = String(e));
  let t = Xe(this);
  return Rt(t, "has", e), t.hasOwnProperty(e);
}
var cs = class {
    constructor(t = !1, n = !1) {
      this._isReadonly = t, this._isShallow = n;
    }
    get(t, n, i) {
      if (n === "__v_skip") return t.__v_skip;
      let s = this._isReadonly,
        l = this._isShallow;
      if (n === "__v_isReactive") return !s;
      if (n === "__v_isReadonly") return s;
      if (n === "__v_isShallow") return l;
      if (n === "__v_raw") return i === (s ? l ? Sf : xf : l ? Nf : _f).get(t) || Object.getPrototypeOf(t) === Object.getPrototypeOf(i) ? t : void 0;
      let u = _e(t);
      if (!s) {
        let g;
        if (u && (g = Zg[n])) return g;
        if (n === "hasOwnProperty") return tv;
      }
      let p = Reflect.get(t, n, dt(t) ? t : i);
      if ((kt(n) ? Ef.has(n) : ev(n)) || (s || Rt(t, "get", n), l)) return p;
      if (dt(p)) {
        let g = u && Wi(n) ? p : p.value;
        return s && qe(g) ? eo(g) : g;
      }
      return qe(p) ? s ? eo(p) : mi(p) : p;
    }
  },
  us = class extends cs {
    constructor(t = !1) {
      super(!1, t);
    }
    set(t, n, i, s) {
      let l = t[n],
        u = _e(t) && Wi(n);
      if (!this._isShallow) {
        let _ = Qt(l);
        if (!Tt(i) && !Qt(i) && (l = Xe(l), i = Xe(i)), !u && dt(l) && !dt(i)) return _ || (l.value = i), !0;
      }
      let p = u ? Number(n) < t.length : Je(t, n),
        g = Reflect.set(t, n, i, dt(t) ? t : s);
      return t === Xe(s) && g && (p ? Et(i, l) && An(t, "set", n, i, l) : An(t, "add", n, i)), g;
    }
    deleteProperty(t, n) {
      let i = Je(t, n),
        s = t[n],
        l = Reflect.deleteProperty(t, n);
      return l && i && An(t, "delete", n, void 0, s), l;
    }
    has(t, n) {
      let i = Reflect.has(t, n);
      return (!kt(n) || !Ef.has(n)) && Rt(t, "has", n), i;
    }
    ownKeys(t) {
      return Rt(t, "iterate", _e(t) ? "length" : Ir), Reflect.ownKeys(t);
    }
  },
  fs = class extends cs {
    constructor(t = !1) {
      super(!0, t);
    }
    set(t, n) {
      return !0;
    }
    deleteProperty(t, n) {
      return !0;
    }
  },
  nv = new us(),
  rv = new fs(),
  iv = new us(!0),
  ov = new fs(!0),
  fl = e => e,
  os = e => Reflect.getPrototypeOf(e);
function sv(e, t, n) {
  return function (...i) {
    let s = this.__v_raw,
      l = Xe(s),
      u = Dr(l),
      p = e === "entries" || e === Symbol.iterator && u,
      g = e === "keys" && u,
      _ = s[e](...i),
      x = n ? fl : t ? Mr : mn;
    return !t && Rt(l, "iterate", g ? ul : Ir), Ue(Object.create(_), {
      next() {
        let {
          value: w,
          done: V
        } = _.next();
        return V ? {
          value: w,
          done: V
        } : {
          value: p ? [x(w[0]), x(w[1])] : x(w),
          done: V
        };
      }
    });
  };
}
function ss(e) {
  return function (...t) {
    return e === "delete" ? !1 : e === "clear" ? void 0 : this;
  };
}
function av(e, t) {
  let n = {
    get(s) {
      let l = this.__v_raw,
        u = Xe(l),
        p = Xe(s);
      e || (Et(s, p) && Rt(u, "get", s), Rt(u, "get", p));
      let {
          has: g
        } = os(u),
        _ = t ? fl : e ? Mr : mn;
      if (g.call(u, s)) return _(l.get(s));
      if (g.call(u, p)) return _(l.get(p));
      l !== u && l.get(s);
    },
    get size() {
      let s = this.__v_raw;
      return !e && Rt(Xe(s), "iterate", Ir), s.size;
    },
    has(s) {
      let l = this.__v_raw,
        u = Xe(l),
        p = Xe(s);
      return e || (Et(s, p) && Rt(u, "has", s), Rt(u, "has", p)), s === p ? l.has(s) : l.has(s) || l.has(p);
    },
    forEach(s, l) {
      let u = this,
        p = u.__v_raw,
        g = Xe(p),
        _ = t ? fl : e ? Mr : mn;
      return !e && Rt(g, "iterate", Ir), p.forEach((x, w) => s.call(l, _(x), _(w), u));
    }
  };
  return Ue(n, e ? {
    add: ss("add"),
    set: ss("set"),
    delete: ss("delete"),
    clear: ss("clear")
  } : {
    add(s) {
      let l = Xe(this),
        u = os(l),
        p = Xe(s),
        g = !t && !Tt(s) && !Qt(s) ? p : s;
      return u.has.call(l, g) || Et(s, g) && u.has.call(l, s) || Et(p, g) && u.has.call(l, p) || (l.add(g), An(l, "add", g, g)), this;
    },
    set(s, l) {
      !t && !Tt(l) && !Qt(l) && (l = Xe(l));
      let u = Xe(this),
        {
          has: p,
          get: g
        } = os(u),
        _ = p.call(u, s);
      _ || (s = Xe(s), _ = p.call(u, s));
      let x = g.call(u, s);
      return u.set(s, l), _ ? Et(l, x) && An(u, "set", s, l, x) : An(u, "add", s, l), this;
    },
    delete(s) {
      let l = Xe(this),
        {
          has: u,
          get: p
        } = os(l),
        g = u.call(l, s);
      g || (s = Xe(s), g = u.call(l, s));
      let _ = p ? p.call(l, s) : void 0,
        x = l.delete(s);
      return g && An(l, "delete", s, void 0, _), x;
    },
    clear() {
      let s = Xe(this),
        l = s.size !== 0,
        u = void 0,
        p = s.clear();
      return l && An(s, "clear", void 0, void 0, u), p;
    }
  }), ["keys", "values", "entries", Symbol.iterator].forEach(s => {
    n[s] = sv(s, e, t);
  }), n;
}
function ps(e, t) {
  let n = av(e, t);
  return (i, s, l) => s === "__v_isReactive" ? !e : s === "__v_isReadonly" ? e : s === "__v_raw" ? i : Reflect.get(Je(n, s) && s in i ? n : i, s, l);
}
var lv = {
    get: ps(!1, !1)
  },
  cv = {
    get: ps(!1, !0)
  },
  uv = {
    get: ps(!0, !1)
  },
  fv = {
    get: ps(!0, !0)
  };
var _f = new WeakMap(),
  Nf = new WeakMap(),
  xf = new WeakMap(),
  Sf = new WeakMap();
function dv(e) {
  switch (e) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
function mi(e) {
  return Qt(e) ? e : ms(e, !1, nv, lv, _f);
}
function hs(e) {
  return ms(e, !1, iv, cv, Nf);
}
function eo(e) {
  return ms(e, !0, rv, uv, xf);
}
function Of(e) {
  return ms(e, !0, ov, fv, Sf);
}
function ms(e, t, n, i, s) {
  if (!qe(e) || e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e)) return e;
  let l = s.get(e);
  if (l) return l;
  let u = dv(Ja(e));
  if (u === 0) return e;
  let p = new Proxy(e, u === 2 ? i : n);
  return s.set(e, p), p;
}
function hn(e) {
  return Qt(e) ? hn(e.__v_raw) : !!(e && e.__v_isReactive);
}
function Qt(e) {
  return !!(e && e.__v_isReadonly);
}
function Tt(e) {
  return !!(e && e.__v_isShallow);
}
function Pr(e) {
  return e ? !!e.__v_raw : !1;
}
function Xe(e) {
  let t = e && e.__v_raw;
  return t ? Xe(t) : e;
}
function gs(e) {
  return !Je(e, "__v_skip") && Object.isExtensible(e) && rs(e, "__v_skip", !0), e;
}
var mn = e => qe(e) ? mi(e) : e,
  Mr = e => qe(e) ? eo(e) : e;
function dt(e) {
  return e ? e.__v_isRef === !0 : !1;
}
function Lr(e) {
  return Tf(e, !1);
}
function vs(e) {
  return Tf(e, !0);
}
function Tf(e, t) {
  return dt(e) ? e : new dl(e, t);
}
var dl = class {
  constructor(t, n) {
    this.dep = new hi(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = n ? t : Xe(t), this._value = n ? t : mn(t), this.__v_isShallow = n;
  }
  get value() {
    return this.dep.track(), this._value;
  }
  set value(t) {
    let n = this._rawValue,
      i = this.__v_isShallow || Tt(t) || Qt(t);
    t = i ? t : Xe(t), Et(t, n) && (this._rawValue = t, this._value = i ? t : mn(t), this.dep.trigger());
  }
};
function Cf(e) {
  e.dep && e.dep.trigger();
}
function Fr(e) {
  return dt(e) ? e.value : e;
}
function Af(e) {
  return $e(e) ? e() : Fr(e);
}
var pv = {
  get: (e, t, n) => t === "__v_raw" ? e : Fr(Reflect.get(e, t, n)),
  set: (e, t, n, i) => {
    let s = e[t];
    return dt(s) && !dt(n) ? (s.value = n, !0) : Reflect.set(e, t, n, i);
  }
};
function no(e) {
  return hn(e) ? e : new Proxy(e, pv);
}
var pl = class {
  constructor(t) {
    this.__v_isRef = !0, this._value = void 0;
    let n = this.dep = new hi(),
      {
        get: i,
        set: s
      } = t(n.track.bind(n), n.trigger.bind(n));
    this._get = i, this._set = s;
  }
  get value() {
    return this._value = this._get();
  }
  set value(t) {
    this._set(t);
  }
};
function bs(e) {
  return new pl(e);
}
function Df(e) {
  let t = _e(e) ? new Array(e.length) : {};
  for (let n in e) t[n] = $f(e, n);
  return t;
}
var hl = class {
    constructor(t, n, i) {
      this._object = t, this._defaultValue = i, this.__v_isRef = !0, this._value = void 0, this._key = kt(n) ? n : String(n), this._raw = Xe(t);
      let s = !0,
        l = t;
      if (!_e(t) || kt(this._key) || !Wi(this._key)) do s = !Pr(l) || Tt(l); while (s && (l = l.__v_raw));
      this._shallow = s;
    }
    get value() {
      let t = this._object[this._key];
      return this._shallow && (t = Fr(t)), this._value = t === void 0 ? this._defaultValue : t;
    }
    set value(t) {
      if (this._shallow && dt(this._raw[this._key])) {
        let n = this._object[this._key];
        if (dt(n)) {
          n.value = t;
          return;
        }
      }
      this._object[this._key] = t;
    }
    get dep() {
      return Jg(this._raw, this._key);
    }
  },
  ml = class {
    constructor(t) {
      this._getter = t, this.__v_isRef = !0, this.__v_isReadonly = !0, this._value = void 0;
    }
    get value() {
      return this._value = this._getter();
    }
  };
function Vf(e, t, n) {
  return dt(e) ? e : $e(e) ? new ml(e) : qe(e) && arguments.length > 1 ? $f(e, t, n) : Lr(e);
}
function $f(e, t, n) {
  return new hl(e, t, n);
}
var gl = class {
  constructor(t, n, i) {
    this.fn = t, this.setter = n, this._value = void 0, this.dep = new hi(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = Zi - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !n, this.isSSR = i;
  }
  notify() {
    if (this.flags |= 16, !(this.flags & 8) && at !== this) return hf(this, !0), !0;
  }
  get value() {
    let t = this.dep.track();
    return vf(this), t && (t.version = this.dep.version), this._value;
  }
  set value(t) {
    this.setter && this.setter(t);
  }
};
function If(e, t, n = !1) {
  let i, s;
  return $e(e) ? i = e : (i = e.get, s = e.set), new gl(i, s, n);
}
var Rf = {
    GET: "get",
    HAS: "has",
    ITERATE: "iterate"
  },
  Mf = {
    SET: "set",
    ADD: "add",
    DELETE: "delete",
    CLEAR: "clear"
  };
var as = {},
  ds = new WeakMap(),
  fr;
function Pf() {
  return fr;
}
function kl(e, t = !1, n = fr) {
  if (n) {
    let i = ds.get(n);
    i || ds.set(n, i = []), i.push(e);
  }
}
function Lf(e, t, n = Be) {
  let {
      immediate: i,
      deep: s,
      once: l,
      scheduler: u,
      augmentJob: p,
      call: g
    } = n,
    _ = L => {
      (n.onWarn || Gg)("Invalid watch source: ", L, "A watch source can only be a getter/effect function, a ref, a reactive object, or an array of these types.");
    },
    x = L => s ? L : Tt(L) || s === !1 || s === 0 ? Dn(L, 1) : Dn(L),
    w,
    V,
    $,
    j,
    F = !1,
    le = !1;
  if (dt(e) ? (V = () => e.value, F = Tt(e)) : hn(e) ? (V = () => x(e), F = !0) : _e(e) ? (le = !0, F = e.some(L => hn(L) || Tt(L)), V = () => e.map(L => {
    if (dt(L)) return L.value;
    if (hn(L)) return x(L);
    if ($e(L)) return g ? g(L, 2) : L();
  })) : $e(e) ? t ? V = g ? () => g(e, 2) : e : V = () => {
    if ($) {
      gn();
      try {
        $();
      } finally {
        vn();
      }
    }
    let L = fr;
    fr = w;
    try {
      return g ? g(e, 3, [j]) : e(j);
    } finally {
      fr = L;
    }
  } : V = ht, t && s) {
    let L = V,
      te = s === !0 ? 1 / 0 : s;
    V = () => Dn(L(), te);
  }
  let ue = vl(),
    W = () => {
      w.stop(), ue && ue.active && Ki(ue.effects, w);
    };
  if (l && t) {
    let L = t;
    t = (...te) => {
      let se = L(...te);
      return W(), se;
    };
  }
  let I = le ? new Array(e.length).fill(as) : as,
    z = L => {
      if (!(!(w.flags & 1) || !w.dirty && !L)) if (t) {
        let te = w.run();
        if (L || s || F || (le ? te.some((se, ee) => Et(se, I[ee])) : Et(te, I))) {
          $ && $();
          let se = fr;
          fr = w;
          try {
            let ee = [te, I === as ? void 0 : le && I[0] === as ? [] : I, j];
            I = te, g ? g(t, 3, ee) : t(...ee);
          } finally {
            fr = se;
          }
        }
      } else w.run();
    };
  return p && p(z), w = new Hn(V), w.scheduler = u ? () => u(z, !1) : z, j = L => kl(L, !1, w), $ = w.onStop = () => {
    let L = ds.get(w);
    if (L) {
      if (g) g(L, 4);else for (let te of L) te();
      ds.delete(w);
    }
  }, t ? i ? z(!0) : I = w.run() : u ? u(z.bind(null, !0), !0) : w.run(), W.pause = w.pause.bind(w), W.resume = w.resume.bind(w), W.stop = W, W;
}
function Dn(e, t = 1 / 0, n) {
  if (t <= 0 || !qe(e) || e.__v_skip || (n = n || new Map(), (n.get(e) || 0) >= t)) return e;
  if (n.set(e, t), t--, dt(e)) Dn(e.value, t, n);else if (_e(e)) for (let i = 0; i < e.length; i++) Dn(e[i], t, n);else if (Un(e) || Dr(e)) e.forEach(i => {
    Dn(i, t, n);
  });else if (ui(e)) {
    for (let i in e) Dn(e[i], t, n);
    for (let i of Object.getOwnPropertySymbols(e)) Object.prototype.propertyIsEnumerable.call(e, i) && Dn(e[i], t, n);
  }
  return e;
}
var zr = [];
function hv(e) {
  zr.push(e);
}
function mv() {
  zr.pop();
}
var El = !1;
function Ff(e, ...t) {
  if (El) return;
  El = !0, gn();
  let n = zr.length ? zr[zr.length - 1].component : null,
    i = n && n.appContext.config.warnHandler,
    s = gv();
  if (i) qr(i, n, 11, [e + t.map(l => {
    var u, p;
    return (p = (u = l.toString) == null ? void 0 : u.call(l)) != null ? p : JSON.stringify(l);
  }).join(""), n && n.proxy, s.map(({
    vnode: l
  }) => `at <${ep(n, l.type)}>`).join(`
`), s]);else {
    let l = [`[Vue warn]: ${e}`, ...t];
    s.length && l.push(`
`, ...vv(s)), console.warn(...l);
  }
  vn(), El = !1;
}
function gv() {
  let e = zr[zr.length - 1];
  if (!e) return [];
  let t = [];
  for (; e;) {
    let n = t[0];
    n && n.vnode === e ? n.recurseCount++ : t.push({
      vnode: e,
      recurseCount: 0
    });
    let i = e.component && e.component.parent;
    e = i && i.vnode;
  }
  return t;
}
function vv(e) {
  let t = [];
  return e.forEach((n, i) => {
    t.push(...(i === 0 ? [] : [`
`]), ...bv(n));
  }), t;
}
function bv({
  vnode: e,
  recurseCount: t
}) {
  let n = t > 0 ? `... (${t} recursive calls)` : "",
    i = e.component ? e.component.parent == null : !1,
    s = ` at <${ep(e.component, e.type, i)}`,
    l = ">" + n;
  return e.props ? [s, ...yv(e.props), l] : [s + l];
}
function yv(e) {
  let t = [],
    n = Object.keys(e);
  return n.slice(0, 3).forEach(i => {
    t.push(...ed(i, e[i]));
  }), n.length > 3 && t.push(" ..."), t;
}
function ed(e, t, n) {
  return Me(t) ? (t = JSON.stringify(t), n ? t : [`${e}=${t}`]) : typeof t == "number" || typeof t == "boolean" || t == null ? n ? t : [`${e}=${t}`] : dt(t) ? (t = ed(e, Xe(t.value), !0), n ? t : [`${e}=Ref<`, t, ">"]) : $e(t) ? [`${e}=fn${t.name ? `<${t.name}>` : ""}`] : (t = Xe(t), n ? t : [`${e}=`, t]);
}
function wv(e, t) {}
var kv = {
    SETUP_FUNCTION: 0,
    0: "SETUP_FUNCTION",
    RENDER_FUNCTION: 1,
    1: "RENDER_FUNCTION",
    NATIVE_EVENT_HANDLER: 5,
    5: "NATIVE_EVENT_HANDLER",
    COMPONENT_EVENT_HANDLER: 6,
    6: "COMPONENT_EVENT_HANDLER",
    VNODE_HOOK: 7,
    7: "VNODE_HOOK",
    DIRECTIVE_HOOK: 8,
    8: "DIRECTIVE_HOOK",
    TRANSITION_HOOK: 9,
    9: "TRANSITION_HOOK",
    APP_ERROR_HANDLER: 10,
    10: "APP_ERROR_HANDLER",
    APP_WARN_HANDLER: 11,
    11: "APP_WARN_HANDLER",
    FUNCTION_REF: 12,
    12: "FUNCTION_REF",
    ASYNC_COMPONENT_LOADER: 13,
    13: "ASYNC_COMPONENT_LOADER",
    SCHEDULER: 14,
    14: "SCHEDULER",
    COMPONENT_UPDATE: 15,
    15: "COMPONENT_UPDATE",
    APP_UNMOUNT_CLEANUP: 16,
    16: "APP_UNMOUNT_CLEANUP"
  },
  Ev = {
    sp: "serverPrefetch hook",
    bc: "beforeCreate hook",
    c: "created hook",
    bm: "beforeMount hook",
    m: "mounted hook",
    bu: "beforeUpdate hook",
    u: "updated",
    bum: "beforeUnmount hook",
    um: "unmounted hook",
    a: "activated hook",
    da: "deactivated hook",
    ec: "errorCaptured hook",
    rtc: "renderTracked hook",
    rtg: "renderTriggered hook",
    0: "setup function",
    1: "render function",
    2: "watcher getter",
    3: "watcher callback",
    4: "watcher cleanup function",
    5: "native event handler",
    6: "component event handler",
    7: "vnode hook",
    8: "directive hook",
    9: "transition hook",
    10: "app errorHandler",
    11: "app warnHandler",
    12: "ref function",
    13: "async component loader",
    14: "scheduler flush",
    15: "component update",
    16: "app unmount cleanup function"
  };
function qr(e, t, n, i) {
  try {
    return i ? e(...i) : e();
  } catch (s) {
    Gr(s, t, n);
  }
}
function nn(e, t, n, i) {
  if ($e(e)) {
    let s = qr(e, t, n, i);
    return s && ts(s) && s.catch(l => {
      Gr(l, t, n);
    }), s;
  }
  if (_e(e)) {
    let s = [];
    for (let l = 0; l < e.length; l++) s.push(nn(e[l], t, n, i));
    return s;
  }
}
function Gr(e, t, n, i = !0) {
  let s = t ? t.vnode : null,
    {
      errorHandler: l,
      throwUnhandledErrorInProduction: u
    } = t && t.appContext.config || Be;
  if (t) {
    let p = t.parent,
      g = t.proxy,
      _ = `https://vuejs.org/error-reference/#runtime-${n}`;
    for (; p;) {
      let x = p.ec;
      if (x) {
        for (let w = 0; w < x.length; w++) if (x[w](e, g, _) === !1) return;
      }
      p = p.parent;
    }
    if (l) {
      gn(), qr(l, null, 10, [e, g, _]), vn();
      return;
    }
  }
  _v(e, n, s, i, u);
}
function _v(e, t, n, i = !0, s = !1) {
  if (s) throw e;
  console.error(e);
}
var Jt = [],
  Vn = -1,
  wi = [],
  pr = null,
  vi = 0,
  td = Promise.resolve(),
  Os = null;
function vo(e) {
  let t = Os || td;
  return e ? t.then(this ? e.bind(this) : e) : t;
}
function Nv(e) {
  let t = Vn + 1,
    n = Jt.length;
  for (; t < n;) {
    let i = t + n >>> 1,
      s = Jt[i],
      l = co(s);
    l < e || l === e && s.flags & 2 ? t = i + 1 : n = i;
  }
  return t;
}
function Pl(e) {
  if (!(e.flags & 1)) {
    let t = co(e),
      n = Jt[Jt.length - 1];
    !n || !(e.flags & 2) && t >= co(n) ? Jt.push(e) : Jt.splice(Nv(t), 0, e), e.flags |= 1, nd();
  }
}
function nd() {
  Os || (Os = td.then(rd));
}
function _i(e) {
  if (!_e(e)) pr && e.id === -1 ? pr.splice(vi + 1, 0, e) : e.flags & 1 || (wi.push(e), e.flags |= 1);else for (let t = 0; t < e.length; t++) wi.push(e[t]);
  nd();
}
function Uf(e, t, n = Vn + 1) {
  for (; n < Jt.length; n++) {
    let i = Jt[n];
    if (i && i.flags & 2) {
      if (e && i.id !== e.uid) continue;
      Jt.splice(n, 1), n--, i.flags & 4 && (i.flags &= -2), i(), i.flags & 4 || (i.flags &= -2);
    }
  }
}
function Ts(e) {
  if (wi.length) {
    let t = [...new Set(wi)].sort((n, i) => co(n) - co(i));
    if (wi.length = 0, pr) {
      for (let n = 0; n < t.length; n++) pr.push(t[n]);
      return;
    }
    for (pr = t, vi = 0; vi < pr.length; vi++) {
      let n = pr[vi];
      n.flags & 4 && (n.flags &= -2), n.flags & 8 || n(), n.flags &= -2;
    }
    pr = null, vi = 0;
  }
}
var co = e => e.id == null ? e.flags & 2 ? -1 : 1 / 0 : e.id;
function rd(e) {
  let t = ht;
  try {
    for (Vn = 0; Vn < Jt.length; Vn++) {
      let n = Jt[Vn];
      n && !(n.flags & 8) && (n.flags & 4 && (n.flags &= -2), qr(n, n.i, n.i ? 15 : 14), n.flags & 4 || (n.flags &= -2));
    }
  } finally {
    for (; Vn < Jt.length; Vn++) {
      let n = Jt[Vn];
      n && (n.flags &= -2);
    }
    Vn = -1, Jt.length = 0, Ts(e), Os = null, (Jt.length || wi.length) && rd(e);
  }
}
var xv = !1;
var bi,
  ys = [],
  jf = !1;
function id(e, t) {
  var n, i;
  bi = e, bi ? (bi.enabled = !0, ys.forEach(({
    event: s,
    args: l
  }) => bi.emit(s, ...l)), ys = []) : typeof window < "u" && window.HTMLElement && !((i = (n = window.navigator) == null ? void 0 : n.userAgent) != null && i.includes("jsdom")) ? ((t.__VUE_DEVTOOLS_HOOK_REPLAY__ = t.__VUE_DEVTOOLS_HOOK_REPLAY__ || []).push(l => {
    id(l, t);
  }), setTimeout(() => {
    bi || (t.__VUE_DEVTOOLS_HOOK_REPLAY__ = null, jf = !0, ys = []);
  }, 3e3)) : (jf = !0, ys = []);
}
var Pt = null,
  Us = null;
function uo(e) {
  let t = Pt;
  return Pt = e, Us = e && e.type.__scopeId || null, t;
}
function Sv(e) {
  Us = e;
}
function Ov() {
  Us = null;
}
var Tv = e => Ll;
function Ll(e, t = Pt, n) {
  if (!t || e._n) return e;
  let i = (...s) => {
    i._d && mo(-1);
    let l = uo(t),
      u = Wn.length,
      p;
    try {
      p = e(...s);
    } finally {
      for (let g = Wn.length; g > u; g--) Gs();
      uo(l), i._d && mo(1);
    }
    return p;
  };
  return i._n = !0, i._c = !0, i._d = !0, i;
}
function Cv(e, t) {
  if (Pt === null) return e;
  let n = Eo(Pt),
    i = e.dirs || (e.dirs = []);
  for (let s = 0; s < t.length; s++) {
    let [l, u, p, g = Be] = t[s];
    l && ($e(l) && (l = {
      mounted: l,
      updated: l
    }), l.deep && Dn(u), i.push({
      dir: l,
      instance: n,
      value: u,
      oldValue: void 0,
      arg: p,
      modifiers: g
    }));
  }
  return e;
}
function $n(e, t, n, i) {
  let s = e.dirs,
    l = t && t.dirs;
  for (let u = 0; u < s.length; u++) {
    let p = s[u];
    l && (p.oldValue = l[u].value);
    let g = p.dir[i];
    g && (gn(), nn(g, n, 8, [e.el, p, e, t]), vn());
  }
}
function od(e, t) {
  if (Mt) {
    let n = Mt.provides,
      i = Mt.parent && Mt.parent.provides;
    i === n && (n = Mt.provides = Object.create(i)), n[e] = t;
  }
}
function ao(e, t, n = !1) {
  let i = zt();
  if (i || Br) {
    let s = Br ? Br._context.provides : i ? i.parent == null || i.ce ? i.vnode.appContext && i.vnode.appContext.provides : i.parent.provides : void 0;
    if (s && e in s) return s[e];
    if (arguments.length > 1) return n && $e(t) ? t.call(i && i.proxy) : t;
  }
}
function Av() {
  return !!(zt() || Br);
}
var sd = Symbol.for("v-scx"),
  ad = () => {
    {
      let e = ao(sd);
      return e;
    }
  };
function Dv(e, t) {
  return bo(e, null, t);
}
function Vv(e, t) {
  return bo(e, null, {
    flush: "post"
  });
}
function ld(e, t) {
  return bo(e, null, {
    flush: "sync"
  });
}
function Hr(e, t, n) {
  return bo(e, t, n);
}
function bo(e, t, n = Be) {
  let {
      immediate: i,
      deep: s,
      flush: l,
      once: u
    } = n,
    p = Ue({}, n),
    g = t && i || !t && l !== "post",
    _;
  if (Xr) {
    if (l === "sync") {
      let $ = ad();
      _ = $.__watcherHandles || ($.__watcherHandles = []);
    } else if (!g) {
      let $ = () => {};
      return $.stop = ht, $.resume = ht, $.pause = ht, $;
    }
  }
  let x = Mt;
  p.call = ($, j, F) => nn($, x, j, F);
  let w = !1;
  l === "post" ? p.scheduler = $ => {
    _t($, x && x.suspense);
  } : l !== "sync" && (w = !0, p.scheduler = ($, j) => {
    j ? $() : Pl($);
  }), p.augmentJob = $ => {
    t && ($.flags |= 4), w && ($.flags |= 2, x && ($.id = x.uid, $.i = x));
  };
  let V = Lf(e, t, p);
  return Xr && (_ ? _.push(V) : g && V()), V;
}
function $v(e, t, n) {
  let i = this.proxy,
    s = Me(e) ? e.includes(".") ? cd(i, e) : () => i[e] : e.bind(i, i),
    l;
  $e(t) ? l = t : (l = t.handler, n = t);
  let u = Oi(this),
    p = bo(s, l.bind(i), n);
  return u(), p;
}
function cd(e, t) {
  let n = t.split(".");
  return () => {
    let i = e;
    for (let s = 0; s < n.length && i; s++) i = i[n[s]];
    return i;
  };
}
var dr = new WeakMap(),
  ud = Symbol("_vte"),
  js = e => e.__isTeleport,
  jr = e => e && (e.disabled || e.disabled === ""),
  Iv = e => e && (e.defer || e.defer === ""),
  zf = e => typeof SVGElement < "u" && e instanceof SVGElement,
  Hf = e => typeof MathMLElement == "function" && e instanceof MathMLElement,
  Ol = (e, t) => {
    let n = e && e.to;
    return Me(n) ? t ? t(n) : null : n;
  },
  Rv = {
    name: "Teleport",
    __isTeleport: !0,
    process(e, t, n, i, s, l, u, p, g, _) {
      let {
          mc: x,
          pc: w,
          pbc: V,
          o: {
            insert: $,
            querySelector: j,
            createText: F,
            createComment: le,
            parentNode: ue
          }
        } = _,
        W = jr(t.props),
        {
          dynamicChildren: I
        } = t,
        z = (se, ee, X) => {
          se.shapeFlag & 16 && x(se.children, ee, X, s, l, u, p, g);
        },
        L = (se = t) => {
          let ee = jr(se.props),
            X = se.target = Ol(se.props, j),
            Z = Tl(X, se, F, $);
          X && (u !== "svg" && zf(X) ? u = "svg" : u !== "mathml" && Hf(X) && (u = "mathml"), s && s.isCE && (s.ce._teleportTargets || (s.ce._teleportTargets = new Set())).add(X), ee || (z(se, X, Z), io(se, !1)));
        },
        te = se => {
          let ee = () => {
            if (dr.get(se) === ee) {
              if (dr.delete(se), jr(se.props)) {
                let X = ue(se.el) || n;
                z(se, X, se.anchor), io(se, !0);
              }
              L(se);
            }
          };
          dr.set(se, ee), _t(ee, l);
        };
      if (e == null) {
        let se = t.el = F(""),
          ee = t.anchor = F("");
        if ($(se, n, i), $(ee, n, i), Iv(t.props) || l && l.pendingBranch) {
          te(t);
          return;
        }
        W && (z(t, n, ee), io(t, !0)), L();
      } else {
        t.el = e.el;
        let se = t.anchor = e.anchor,
          ee = dr.get(e);
        if (ee) {
          ee.flags |= 8, dr.delete(e), te(t);
          return;
        }
        t.targetStart = e.targetStart;
        let X = t.target = e.target,
          Z = t.targetAnchor = e.targetAnchor,
          fe = jr(e.props),
          J = fe ? n : X,
          ve = fe ? se : Z;
        if (u === "svg" || zf(X) ? u = "svg" : (u === "mathml" || Hf(X)) && (u = "mathml"), I ? (V(e.dynamicChildren, I, J, s, l, u, p), Yl(e, t, !0)) : g || w(e, t, J, ve, s, l, u, p, !1), W) fe ? t.props && e.props && t.props.to !== e.props.to && (t.props.to = e.props.to) : ws(t, n, se, _, 1);else if ((t.props && t.props.to) !== (e.props && e.props.to)) {
          let pe = Ol(t.props, j);
          pe && (t.target = pe, ws(t, pe, null, _, 0));
        } else fe && ws(t, X, Z, _, 1);
        io(t, W);
      }
    },
    remove(e, t, n, {
      um: i,
      o: {
        remove: s
      }
    }, l) {
      let {
          shapeFlag: u,
          children: p,
          anchor: g,
          targetStart: _,
          targetAnchor: x,
          target: w,
          props: V
        } = e,
        $ = jr(V),
        j = l || !$,
        F = dr.get(e);
      if (F && (F.flags |= 8, dr.delete(e)), w && (s(_), s(x)), l && s(g), !F && ($ || w) && u & 16) for (let le = 0; le < p.length; le++) {
        let ue = p[le];
        i(ue, t, n, j, !!ue.dynamicChildren);
      }
    },
    move: ws,
    hydrate: Mv
  };
function ws(e, t, n, {
  o: {
    insert: i
  },
  m: s
}, l = 2) {
  l === 0 && i(e.targetAnchor, t, n);
  let {
      el: u,
      anchor: p,
      shapeFlag: g,
      children: _,
      props: x
    } = e,
    w = l === 2;
  if (w && i(u, t, n), !dr.has(e) && (!w || jr(x)) && g & 16) for (let V = 0; V < _.length; V++) s(_[V], t, n, 2);
  w && i(p, t, n);
}
function Mv(e, t, n, i, s, l, {
  o: {
    nextSibling: u,
    parentNode: p,
    querySelector: g,
    insert: _,
    createText: x
  }
}, w) {
  function V(le, ue) {
    let W = ue;
    for (; W;) {
      if (W && W.nodeType === 8) {
        if (W.data === "teleport start anchor") t.targetStart = W;else if (W.data === "teleport anchor") {
          t.targetAnchor = W, le._lpa = t.targetAnchor && u(t.targetAnchor);
          break;
        }
      }
      W = u(W);
    }
  }
  function $(le, ue) {
    ue.anchor = w(u(le), ue, p(le), n, i, s, l);
  }
  let j = t.target = Ol(t.props, g),
    F = jr(t.props);
  if (j) {
    let le = j._lpa || j.firstChild;
    t.shapeFlag & 16 && (F ? ($(e, t), V(j, le), t.targetAnchor || Tl(j, t, x, _, p(e) === j ? e : null)) : (t.anchor = u(e), V(j, le), t.targetAnchor || Tl(j, t, x, _), w(le && u(le), t, j, n, i, s, l))), io(t, F);
  } else F && t.shapeFlag & 16 && ($(e, t), t.targetStart = e, t.targetAnchor = u(e));
  return t.anchor && u(t.anchor);
}
var Pv = Rv;
function io(e, t) {
  let n = e.ctx;
  if (n && n.ut) {
    let i, s;
    for (t ? (i = e.el, s = e.anchor) : (i = e.targetStart, s = e.targetAnchor); i && i !== s;) i.nodeType === 1 && i.setAttribute("data-v-owner", n.uid), i = i.nextSibling;
    n.ut();
  }
}
function Tl(e, t, n, i, s = null) {
  let l = t.targetStart = n(""),
    u = t.targetAnchor = n("");
  return l[ud] = u, e && (i(l, e, s), i(u, e, s)), u;
}
var yn = Symbol("_leaveCb"),
  ro = Symbol("_enterCb");
function zs() {
  let e = {
    isMounted: !1,
    isLeaving: !1,
    isUnmounting: !1,
    leavingVNodes: new Map()
  };
  return xi(() => {
    e.isMounted = !0;
  }), Ws(() => {
    e.isUnmounting = !0;
  }), e;
}
var bn = [Function, Array],
  Hs = {
    mode: String,
    appear: Boolean,
    persisted: Boolean,
    onBeforeEnter: bn,
    onEnter: bn,
    onAfterEnter: bn,
    onEnterCancelled: bn,
    onBeforeLeave: bn,
    onLeave: bn,
    onAfterLeave: bn,
    onLeaveCancelled: bn,
    onBeforeAppear: bn,
    onAppear: bn,
    onAfterAppear: bn,
    onAppearCancelled: bn
  },
  fd = e => {
    let t = e.subTree;
    return t.component ? fd(t.component) : t;
  },
  Lv = {
    name: "BaseTransition",
    props: Hs,
    setup(e, {
      slots: t
    }) {
      let n = zt(),
        i = zs();
      return () => {
        let s = t.default && yo(t.default(), !0),
          l = s && s.length ? dd(s) : n.subTree ? Wd() : void 0;
        if (!l) return;
        let u = Xe(e),
          {
            mode: p
          } = u;
        if (i.isLeaving) return _l(l);
        let g = Cs(l);
        if (!g) return _l(l);
        let _ = Kr(g, u, i, n, w => _ = w);
        g.type !== vt && In(g, _);
        let x = n.subTree && Cs(n.subTree);
        if (x && x.type !== vt && !On(x, g) && fd(n).type !== vt) {
          let w = Kr(x, u, i, n);
          if (In(x, w), p === "out-in" && g.type !== vt) return i.isLeaving = !0, w.afterLeave = () => {
            i.isLeaving = !1, n.job.flags & 8 || n.update(), delete w.afterLeave, x = void 0;
          }, _l(l);
          p === "in-out" && g.type !== vt ? w.delayLeave = (V, $, j) => {
            let F = pd(i, x);
            F[String(x.key)] = x, V[yn] = () => {
              $(), V[yn] = void 0, delete _.delayedLeave, x = void 0;
            }, _.delayedLeave = () => {
              j(), delete _.delayedLeave, x = void 0;
            };
          } : x = void 0;
        } else x && (x = void 0);
        return l;
      };
    }
  };
function dd(e) {
  let t = e[0];
  if (e.length > 1) {
    let n = !1;
    for (let i of e) if (i.type !== vt) {
      t = i, n = !0;
      break;
    }
  }
  return t;
}
var Fl = Lv;
function pd(e, t) {
  let {
      leavingVNodes: n
    } = e,
    i = n.get(t.type);
  return i || (i = Object.create(null), n.set(t.type, i)), i;
}
function Kr(e, t, n, i, s) {
  let {
      appear: l,
      mode: u,
      persisted: p = !1,
      onBeforeEnter: g,
      onEnter: _,
      onAfterEnter: x,
      onEnterCancelled: w,
      onBeforeLeave: V,
      onLeave: $,
      onAfterLeave: j,
      onLeaveCancelled: F,
      onBeforeAppear: le,
      onAppear: ue,
      onAfterAppear: W,
      onAppearCancelled: I
    } = t,
    z = String(e.key),
    L = pd(n, e),
    te = (X, Z) => {
      X && nn(X, i, 9, Z);
    },
    se = (X, Z) => {
      let fe = Z[1];
      te(X, Z), _e(X) ? X.every(J => J.length <= 1) && fe() : X.length <= 1 && fe();
    },
    ee = {
      mode: u,
      persisted: p,
      beforeEnter(X) {
        let Z = g;
        if (!n.isMounted) if (l) Z = le || g;else return;
        X[yn] && X[yn](!0);
        let fe = L[z];
        fe && On(e, fe) && fe.el[yn] && fe.el[yn](), te(Z, [X]);
      },
      enter(X) {
        if (!xv && L[z] === e) return;
        let Z = _,
          fe = x,
          J = w;
        if (!n.isMounted) if (l) Z = ue || _, fe = W || x, J = I || w;else return;
        let ve = !1;
        X[ro] = Ae => {
          ve || (ve = !0, Ae ? te(J, [X]) : te(fe, [X]), ee.delayedLeave && ee.delayedLeave(), X[ro] = void 0);
        };
        let pe = X[ro].bind(null, !1);
        Z ? se(Z, [X, pe]) : pe();
      },
      leave(X, Z) {
        let fe = String(e.key);
        if (X[ro] && X[ro](!0), n.isUnmounting) return Z();
        te(V, [X]);
        let J = !1;
        X[yn] = pe => {
          J || (J = !0, Z(), pe ? te(F, [X]) : te(j, [X]), X[yn] = void 0, L[fe] === e && delete L[fe]);
        };
        let ve = X[yn].bind(null, !1);
        L[fe] = e, $ ? se($, [X, ve]) : ve();
      },
      clone(X) {
        let Z = Kr(X, t, n, i, s);
        return s && s(Z), Z;
      }
    };
  return ee;
}
function _l(e) {
  if (wo(e)) return e = Rn(e), e.children = null, e;
}
function Cs(e) {
  if (!wo(e)) return js(e.type) && e.children ? dd(e.children) : e;
  if (e.component) return e.component.subTree;
  let {
    shapeFlag: t,
    children: n
  } = e;
  if (n) {
    if (t & 16) return n[0];
    if (t & 32 && $e(n.default)) return n.default();
  }
}
function In(e, t) {
  if (e.shapeFlag & 6 && e.component) {
    e.transition = t;
    let n = e.component.subTree;
    In(js(n.type) && Cs(n) || n, t);
  } else e.shapeFlag & 128 ? (e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback)) : e.transition = t;
}
function yo(e, t = !1, n) {
  let i = [],
    s = 0;
  for (let l = 0; l < e.length; l++) {
    let u = e[l],
      p = n == null ? u.key : String(n) + String(u.key != null ? u.key : l);
    u.type === Ct ? (u.patchFlag & 128 && s++, i = i.concat(yo(u.children, t, p))) : (t || u.type !== vt) && i.push(p != null ? Rn(u, {
      key: p
    }) : u);
  }
  if (s > 1) for (let l = 0; l < i.length; l++) i[l].patchFlag = -2;
  return i;
}
function defineComponent(e, t) {
  return $e(e) ? Ue({
    name: e.name
  }, t, {
    setup: e
  }) : e;
}
function Fv() {
  let e = zt();
  return e ? (e.appContext.config.idPrefix || "v") + "-" + e.ids[0] + e.ids[1]++ : "";
}
function Ul(e) {
  e.ids = [e.ids[0] + e.ids[2]++ + "-", 0, 0];
}
function Uv(e) {
  let t = zt(),
    n = vs(null);
  if (t) {
    let s = t.refs === Be ? t.refs = {} : t.refs;
    Object.defineProperty(s, e, {
      enumerable: !0,
      get: () => n.value,
      set: l => n.value = l
    });
  }
  return n;
}
function Bf(e, t) {
  let n;
  return !!((n = Object.getOwnPropertyDescriptor(e, t)) && !n.configurable);
}
var As = new WeakMap();
function ki(e, t, n, i, s = !1) {
  if (_e(e)) {
    e.forEach((F, le) => ki(F, t && (_e(t) ? t[le] : t), n, i, s));
    return;
  }
  if (Kn(i) && !s) {
    i.shapeFlag & 512 && i.type.__asyncResolved && i.component.subTree.component && ki(e, t, n, i.component.subTree);
    return;
  }
  let l = i.shapeFlag & 4 ? Eo(i.component) : i.el,
    u = s ? null : l,
    {
      i: p,
      r: g
    } = e,
    _ = t && t.r,
    x = p.refs === Be ? p.refs = {} : p.refs,
    w = p.setupState,
    V = Xe(w),
    $ = w === Be ? cr : F => Bf(x, F) ? !1 : Je(V, F),
    j = (F, le) => !(le && Bf(x, le));
  if (_ != null && _ !== g) {
    if (Kf(t), Me(_)) x[_] = null, $(_) && (w[_] = null);else if (dt(_)) {
      let F = t;
      j(_, F.k) && (_.value = null), F.k && (x[F.k] = null);
    }
  }
  if ($e(g)) qr(g, p, 12, [u, x]);else {
    let F = Me(g),
      le = dt(g);
    if (F || le) {
      let ue = () => {
        if (e.f) {
          let W = F ? $(g) ? w[g] : x[g] : j(g) || !e.k ? g.value : x[e.k];
          if (s) _e(W) && Ki(W, l);else if (_e(W)) W.includes(l) || W.push(l);else if (F) x[g] = [l], $(g) && (w[g] = x[g]);else {
            let I = [l];
            j(g, e.k) && (g.value = I), e.k && (x[e.k] = I);
          }
        } else F ? (x[g] = u, $(g) && (w[g] = u)) : le && (j(g, e.k) && (g.value = u), e.k && (x[e.k] = u));
      };
      if (u) {
        let W = () => {
          ue(), As.delete(e);
        };
        W.id = -1, As.set(e, W), _t(W, n);
      } else Kf(e), ue();
    }
  }
}
function Kf(e) {
  let t = As.get(e);
  t && (t.flags |= 8, As.delete(e));
}
var Wf = !1,
  gi = () => {
    Wf || (console.error("Hydration completed but contains mismatches."), Wf = !0);
  },
  jv = e => e.namespaceURI.includes("svg") && e.tagName !== "foreignObject",
  zv = e => e.namespaceURI.includes("MathML"),
  ks = e => {
    if (e.nodeType === 1) {
      if (jv(e)) return "svg";
      if (zv(e)) return "mathml";
    }
  },
  yi = e => e.nodeType === 8;
function Hv(e) {
  let {
      mt: t,
      p: n,
      o: {
        patchProp: i,
        createText: s,
        nextSibling: l,
        parentNode: u,
        remove: p,
        insert: g,
        createComment: _
      }
    } = e,
    x = (I, z) => {
      if (!z.hasChildNodes()) {
        n(null, I, z), Ts(), z._vnode = I;
        return;
      }
      w(z.firstChild, I, null, null, null), Ts(), z._vnode = I;
    },
    w = (I, z, L, te, se, ee = !1) => {
      ee = ee || !!z.dynamicChildren;
      let X = yi(I) && I.data === "[",
        Z = () => F(I, z, L, te, se, X),
        {
          type: fe,
          ref: J,
          shapeFlag: ve,
          patchFlag: pe
        } = z,
        Ae = I.nodeType;
      z.el = I, pe === -2 && (ee = !1, z.dynamicChildren = null);
      let ke = null;
      switch (fe) {
        case hr:
          Ae !== 3 ? z.children === "" ? (g(z.el = s(""), u(I), I), ke = I) : ke = Z() : (I.data !== z.children && (gi(), I.data = z.children), ke = l(I));
          break;
        case vt:
          W(I) ? (ke = l(I), ue(z.el = I.content.firstChild, I, L)) : Ae !== 8 || X ? ke = Z() : ke = l(I);
          break;
        case mr:
          if (X && (I = l(I), Ae = I.nodeType), Ae === 1 || Ae === 3) {
            ke = I;
            let Te = !z.children.length;
            for (let Ce = 0; Ce < z.staticCount; Ce++) Te && (z.children += ke.nodeType === 1 ? ke.outerHTML : ke.data), Ce === z.staticCount - 1 && (z.anchor = ke), ke = l(ke);
            return X ? l(ke) : ke;
          } else Z();
          break;
        case Ct:
          X ? ke = j(I, z, L, te, se, ee) : ke = Z();
          break;
        default:
          if (ve & 1) (Ae !== 1 || z.type.toLowerCase() !== I.tagName.toLowerCase()) && !W(I) ? ke = Z() : ke = V(I, z, L, te, se, ee);else if (ve & 6) {
            z.slotScopeIds = se;
            let Te = u(I);
            if (X ? ke = le(I) : yi(I) && I.data === "teleport start" ? ke = le(I, I.data, "teleport end") : ke = l(I), t(z, Te, null, L, te, ks(Te), ee), Kn(z) && !z.type.__asyncResolved) {
              let Ce;
              X ? (Ce = ut(Ct), Ce.anchor = ke ? ke.previousSibling : Te.lastChild) : Ce = I.nodeType === 3 ? Zl("") : ut("div"), Ce.el = I, z.component.subTree = Ce;
            }
          } else ve & 64 ? Ae !== 8 ? ke = Z() : ke = z.type.hydrate(I, z, L, te, se, ee, e, $) : ve & 128 && (ke = z.type.hydrate(I, z, L, te, ks(u(I)), se, ee, e, w));
      }
      return J != null && ki(J, null, te, z), ke;
    },
    V = (I, z, L, te, se, ee) => {
      ee = ee || !!z.dynamicChildren;
      let {
          type: X,
          dynamicProps: Z,
          props: fe,
          patchFlag: J,
          shapeFlag: ve,
          dirs: pe,
          transition: Ae
        } = z,
        ke = X === "input" || X === "option",
        Te = !!Z;
      if (ke || Te || J !== -1) {
        pe && $n(z, null, L, "created");
        let Ce = !1;
        if (W(I)) {
          Ce = Ld(null, Ae) && L && L.vnode.props && L.vnode.props.appear;
          let et = I.content.firstChild;
          if (Ce) {
            let wt = et.getAttribute("class");
            wt && (et.$cls = wt), Ae.beforeEnter(et);
          }
          ue(et, I, L), z.el = I = et;
        }
        if (ve & 16 && !(fe && (fe.innerHTML || fe.textContent))) {
          let et = $(I.firstChild, z, I, L, te, se, ee);
          for (et && !Ns(I, 1) && gi(); et;) {
            let wt = et;
            et = et.nextSibling, p(wt);
          }
        } else if (ve & 8) {
          let et = z.children;
          et[0] === `
` && (I.tagName === "PRE" || I.tagName === "TEXTAREA") && (et = et.slice(1));
          let {
            textContent: wt
          } = I;
          wt !== et && wt !== et.replace(/\r\n|\r/g, `
`) && (Ns(I, 0) || gi(), I.textContent = z.children);
        }
        if (fe) {
          if (ke || Te || !ee || J & 48) {
            let et = I.tagName.includes("-"),
              wt = I.namespaceURI.includes("svg") ? "svg" : I.namespaceURI.includes("MathML") ? "mathml" : void 0;
            for (let it in fe) if (ke && (it.endsWith("value") || it === "indeterminate") || Tn(it) && !Nn(it) || it[0] === "." || et && !Nn(it) || Z && Z.includes(it)) {
              if (Kv(I, it, fe[it])) continue;
              i(I, it, null, fe[it], wt, L);
            }
          } else if (fe.onClick) i(I, "onClick", null, fe.onClick, void 0, L);else if (J & 4 && hn(fe.style)) for (let et in fe.style) fe.style[et];
        }
        let Qe;
        (Qe = fe && fe.onVnodeBeforeMount) && en(Qe, L, z), pe && $n(z, null, L, "beforeMount"), ((Qe = fe && fe.onVnodeMounted) || pe || Ce) && zd(() => {
          Qe && en(Qe, L, z), Ce && Ae.enter(I), pe && $n(z, null, L, "mounted");
        }, te);
      }
      return I.nextSibling;
    },
    $ = (I, z, L, te, se, ee, X) => {
      X = X || !!z.dynamicChildren;
      let Z = z.children,
        fe = Z.length,
        J = !1;
      for (let ve = 0; ve < fe; ve++) {
        let pe = X ? Z[ve] : Z[ve] = tn(Z[ve]),
          Ae = pe.type === hr;
        I ? (Ae && !X && ve + 1 < fe && tn(Z[ve + 1]).type === hr && (g(s(I.data.slice(pe.children.length)), L, l(I)), I.data = pe.children), I = w(I, pe, te, se, ee, X)) : Ae && !pe.children ? g(pe.el = s(""), L) : (J || (J = !0, Ns(L, 1) || gi()), n(null, pe, L, null, te, se, ks(L), ee));
      }
      return I;
    },
    j = (I, z, L, te, se, ee) => {
      let {
        slotScopeIds: X
      } = z;
      X && (se = se ? se.concat(X) : X);
      let Z = u(I),
        fe = $(l(I), z, Z, L, te, se, ee);
      return fe && yi(fe) && fe.data === "]" ? l(z.anchor = fe) : (gi(), g(z.anchor = _("]"), Z, fe), fe);
    },
    F = (I, z, L, te, se, ee) => {
      if (Xv(I, z) || gi(), z.el = null, ee) {
        let fe = le(I);
        for (;;) {
          let J = l(I);
          if (J && J !== fe) p(J);else break;
        }
      }
      let X = l(I),
        Z = u(I);
      return p(I), n(null, z, Z, X, L, te, ks(Z), se), L && (L.vnode.el = z.el, qs(L, z.el)), X;
    },
    le = (I, z = "[", L = "]") => {
      let te = 0;
      for (; I;) if (I = l(I), I && yi(I) && (I.data === z && te++, I.data === L)) {
        if (te === 0) return l(I);
        te--;
      }
      return I;
    },
    ue = (I, z, L) => {
      let te = z.parentNode;
      te && te.replaceChild(I, z);
      let se = L;
      for (; se;) se.vnode.el === z && (se.vnode.el = se.subTree.el = I), se = se.parent;
    },
    W = I => I.nodeType === 1 && I.tagName === "TEMPLATE";
  return [x, w];
}
var Bv = new Set(["src", "srcset", "href", "poster"]);
function Kv(e, t, n) {
  return Bv.has(t) ? e.getAttribute(t) === (n == null ? null : `${n}`) : !1;
}
var Ds = "data-allow-mismatch",
  Wv = {
    0: "text",
    1: "children",
    2: "class",
    3: "style",
    4: "attribute"
  };
function Ns(e, t) {
  if (t === 0 || t === 1) for (; e && !e.hasAttribute(Ds);) e = e.parentElement;
  return jl(e && e.getAttribute(Ds), t);
}
function jl(e, t) {
  if (e == null) return !1;
  if (e === "") return !0;
  {
    let n = e.split(",");
    return t === 0 && n.includes("children") ? !0 : n.includes(Wv[t]);
  }
}
function Xv(e, t) {
  return Ns(e.parentElement, 1) || qv(e) || Gv(t);
}
function qv(e) {
  return e.nodeType === 1 && jl(e.getAttribute(Ds), 1);
}
function Gv({
  props: e
}) {
  let t = e && e[Ds];
  return typeof t == "string" && jl(t, 1);
}
var Yv = Xi().requestIdleCallback || (e => setTimeout(e, 1)),
  Jv = Xi().cancelIdleCallback || (e => clearTimeout(e)),
  Zv = (e = 1e4) => t => {
    let n = Yv(t, {
      timeout: e
    });
    return () => Jv(n);
  };
function Qv(e) {
  let {
      top: t,
      left: n,
      bottom: i,
      right: s
    } = e.getBoundingClientRect(),
    {
      innerHeight: l,
      innerWidth: u
    } = window;
  return (t > 0 && t < l || i > 0 && i < l) && (n > 0 && n < u || s > 0 && s < u);
}
var e1 = e => (t, n) => {
    let i = new IntersectionObserver(s => {
      for (let l of s) if (l.isIntersecting) {
        i.disconnect(), t();
        break;
      }
    }, e);
    return n(s => {
      if (s instanceof Element) {
        if (Qv(s)) return t(), i.disconnect(), !1;
        i.observe(s);
      }
    }), () => i.disconnect();
  },
  t1 = e => t => {
    if (e) {
      let n = matchMedia(e);
      if (n.matches) t();else return n.addEventListener("change", t, {
        once: !0
      }), () => n.removeEventListener("change", t);
    }
  },
  n1 = (e = []) => (t, n) => {
    Me(e) && (e = [e]);
    let i = !1,
      s = u => {
        i || (i = !0, l(), t(), u.target.dispatchEvent(new u.constructor(u.type, u)));
      },
      l = () => {
        n(u => {
          for (let p of e) u.removeEventListener(p, s);
        });
      };
    return n(u => {
      for (let p of e) u.addEventListener(p, s, {
        once: !0
      });
    }), l;
  };
function r1(e, t) {
  if (yi(e) && e.data === "[") {
    let n = 1,
      i = e.nextSibling;
    for (; i;) {
      if (i.nodeType === 1) {
        if (t(i) === !1) break;
      } else if (yi(i)) if (i.data === "]") {
        if (--n === 0) break;
      } else i.data === "[" && n++;
      i = i.nextSibling;
    }
  } else t(e);
}
var Kn = e => !!e.type.__asyncLoader;
function i1(e) {
  $e(e) && (e = {
    loader: e
  });
  let {
      loader: t,
      loadingComponent: n,
      errorComponent: i,
      delay: s = 200,
      hydrate: l,
      timeout: u,
      suspensible: p = !0,
      onError: g
    } = e,
    _ = null,
    x,
    w = 0,
    V = () => (w++, _ = null, $()),
    $ = () => {
      let j;
      return _ || (j = _ = t().catch(F => {
        if (F = F instanceof Error ? F : new Error(String(F)), g) return new Promise((le, ue) => {
          g(F, () => le(V()), () => ue(F), w + 1);
        });
        throw F;
      }).then(F => j !== _ && _ ? _ : (F && (F.__esModule || F[Symbol.toStringTag] === "Module") && (F = F.default), x = F, F)));
    };
  return defineComponent({
    name: "AsyncComponentWrapper",
    __asyncLoader: $,
    __asyncHydrate(j, F, le) {
      let ue = j.isConnected,
        W = !1;
      (F.bu || (F.bu = [])).push(() => W = !0);
      let I = () => {
          W || !j.parentNode || ue && !j.isConnected || le();
        },
        z = l ? () => {
          let L = l(I, te => r1(j, te));
          L && (F.bum || (F.bum = [])).push(L);
        } : I;
      x ? z() : $().then(() => !F.isUnmounted && z());
    },
    get __asyncResolved() {
      return x;
    },
    setup() {
      let j = Mt;
      if (Ul(j), x) return () => Es(x, j);
      let F = L => {
        _ = null, Gr(L, j, 13, !i);
      };
      if (p && j.suspense || Xr) return $().then(L => () => Es(L, j)).catch(L => (F(L), () => i ? ut(i, {
        error: L
      }) : null));
      let le = Lr(!1),
        ue = Lr(),
        W = Lr(!!s),
        I,
        z;
      return Si(() => {
        I != null && clearTimeout(I), z != null && clearTimeout(z);
      }), s && (z = setTimeout(() => {
        j.isUnmounted || (W.value = !1);
      }, s)), u != null && (I = setTimeout(() => {
        if (!j.isUnmounted && !le.value && !ue.value) {
          let L = new Error(`Async component timed out after ${u}ms.`);
          F(L), ue.value = L;
        }
      }, u)), $().then(() => {
        j.isUnmounted || (le.value = !0, j.parent && wo(j.parent.vnode) && j.parent.update());
      }).catch(L => {
        if (j.isUnmounted) {
          _ = null;
          return;
        }
        F(L), ue.value = L;
      }), () => {
        if (le.value && x) return Es(x, j);
        if (ue.value && i) return ut(i, {
          error: ue.value
        });
        if (n && !W.value) return Es(n, j);
      };
    }
  });
}
function Es(e, t) {
  let {
      ref: n,
      props: i,
      children: s,
      ce: l
    } = t.vnode,
    u = ut(e, i, s);
  return u.ref = n, u.ce = l, delete t.vnode.ce, u;
}
var wo = e => e.type.__isKeepAlive,
  o1 = {
    name: "KeepAlive",
    __isKeepAlive: !0,
    props: {
      include: [String, RegExp, Array],
      exclude: [String, RegExp, Array],
      max: [String, Number]
    },
    setup(e, {
      slots: t
    }) {
      let n = zt(),
        i = n.ctx;
      if (!i.renderer) return () => {
        let W = t.default && t.default();
        return W && W.length === 1 ? W[0] : W;
      };
      let s = new Map(),
        l = new Set(),
        u = null,
        p = n.suspense,
        {
          renderer: {
            p: g,
            m: _,
            um: x,
            o: {
              createElement: w
            }
          }
        } = i,
        V = w("div");
      i.activate = (W, I, z, L, te) => {
        let se = W.component;
        _(W, I, z, 0, p), g(se.vnode, W, I, z, se, p, L, W.slotScopeIds, te), _t(() => {
          se.isDeactivated = !1, se.a && ur(se.a);
          let ee = W.props && W.props.onVnodeMounted;
          ee && en(ee, se.parent, W);
        }, p);
      }, i.deactivate = W => {
        let I = W.component;
        $s(I.m), $s(I.a), _(W, V, null, 1, p), _t(() => {
          I.da && ur(I.da);
          let z = W.props && W.props.onVnodeUnmounted;
          z && en(z, I.parent, W), I.isDeactivated = !0;
        }, p);
      };
      function $(W) {
        Nl(W), x(W, n, p, !0);
      }
      function j(W) {
        s.forEach((I, z) => {
          let L = Fs(Kn(I) ? I.type.__asyncResolved || {} : I.type);
          L && !W(L) && F(z);
        });
      }
      function F(W) {
        let I = s.get(W);
        I && (!u || !On(I, u)) ? $(I) : u && Nl(u), s.delete(W), l.delete(W);
      }
      Hr(() => [e.include, e.exclude], ([W, I]) => {
        W && j(z => oo(W, z)), I && j(z => !oo(I, z));
      }, {
        flush: "post",
        deep: !0
      });
      let le = null,
        ue = () => {
          le != null && (Is(n.subTree.type) ? _t(() => {
            s.set(le, _s(n.subTree));
          }, n.subTree.suspense) : s.set(le, _s(n.subTree)));
        };
      return xi(ue), ko(ue), Ws(() => {
        s.forEach(W => {
          let {
              subTree: I,
              suspense: z
            } = n,
            L = _s(I);
          if (W.type === L.type && W.key === L.key) {
            Nl(L);
            let te = L.component.da;
            te && _t(te, z);
            return;
          }
          $(W);
        });
      }), () => {
        if (le = null, !t.default) return u = null;
        let W = t.default(),
          I = W[0];
        if (W.length > 1) return u = null, W;
        if (!Xn(I) || !(I.shapeFlag & 4) && !(I.shapeFlag & 128)) return u = null, I;
        let z = _s(I);
        if (z.type === vt) return u = null, z;
        let L = z.type,
          te = Fs(Kn(z) ? z.type.__asyncResolved || {} : L),
          {
            include: se,
            exclude: ee,
            max: X
          } = e;
        if (se && (!te || !oo(se, te)) || ee && te && oo(ee, te)) return z.shapeFlag &= -257, u = z, I;
        let Z = z.key == null ? L : z.key,
          fe = s.get(Z);
        return z.el && (z = Rn(z), I.shapeFlag & 128 && (I.ssContent = z)), le = Z, fe ? (z.el = fe.el, z.component = fe.component, z.transition && In(z, z.transition), z.shapeFlag |= 512, l.delete(Z), l.add(Z)) : (l.add(Z), X && l.size > parseInt(X, 10) && F(l.values().next().value)), z.shapeFlag |= 256, u = z, Is(I.type) ? I : z;
      };
    }
  },
  s1 = o1;
function oo(e, t) {
  return _e(e) ? e.some(n => oo(n, t)) : Me(e) ? e.split(",").includes(t) : Ju(e) ? (e.lastIndex = 0, e.test(t)) : !1;
}
function hd(e, t) {
  gd(e, "a", t);
}
function md(e, t) {
  gd(e, "da", t);
}
function gd(e, t, n = Mt) {
  let i = e.__wdc || (e.__wdc = () => {
    let s = n;
    for (; s;) {
      if (s.isDeactivated) return;
      s = s.parent;
    }
    return e();
  });
  if (Bs(t, i, n), n) {
    let s = n.parent;
    for (; s && s.parent;) wo(s.parent.vnode) && a1(i, t, n, s), s = s.parent;
  }
}
function a1(e, t, n, i) {
  let s = Bs(t, e, i, !0);
  Si(() => {
    Ki(i[t], s);
  }, n);
}
function Nl(e) {
  e.shapeFlag &= -257, e.shapeFlag &= -513;
}
function _s(e) {
  return e.shapeFlag & 128 ? e.ssContent : e;
}
function Bs(e, t, n = Mt, i = !1) {
  if (n) {
    let s = n[e] || (n[e] = []),
      l = t.__weh || (t.__weh = (...u) => {
        gn();
        let p = Oi(n),
          g = nn(t, n, e, u);
        return p(), vn(), g;
      });
    return i ? s.unshift(l) : s.push(l), l;
  }
}
var qn = e => (t, n = Mt) => {
    (!Xr || e === "sp") && Bs(e, (...i) => t(...i), n);
  },
  vd = qn("bm"),
  xi = qn("m"),
  Ks = qn("bu"),
  ko = qn("u"),
  Ws = qn("bum"),
  Si = qn("um"),
  bd = qn("sp"),
  yd = qn("rtg"),
  wd = qn("rtc");
function kd(e, t = Mt) {
  Bs("ec", e, t);
}
var zl = "components",
  l1 = "directives";
function c1(e, t) {
  return Hl(zl, e, !0, t) || e;
}
var Ed = Symbol.for("v-ndc");
function u1(e) {
  return Me(e) ? Hl(zl, e, !1) || e : e || Ed;
}
function f1(e) {
  return Hl(l1, e);
}
function Hl(e, t, n = !0, i = !1) {
  let s = Pt || Mt;
  if (s) {
    let l = s.type;
    if (e === zl) {
      let p = Fs(l, !1);
      if (p && (p === t || p === Ze(t) || p === pn(Ze(t)))) return l;
    }
    let u = Xf(s[e] || l[e], t) || Xf(s.appContext[e], t);
    return !u && i ? l : u;
  }
}
function Xf(e, t) {
  return e && (e[t] || e[Ze(t)] || e[pn(Ze(t))]);
}
function d1(e, t, n, i) {
  let s,
    l = n && n[i],
    u = _e(e);
  if (u || Me(e)) {
    let p = u && hn(e),
      g = !1,
      _ = !1;
    p && (g = !Tt(e), _ = Qt(e), e = to(e)), s = new Array(e.length);
    for (let x = 0, w = e.length; x < w; x++) s[x] = t(g ? _ ? Mr(mn(e[x])) : mn(e[x]) : e[x], x, void 0, l && l[x]);
  } else if (typeof e == "number") {
    s = new Array(e);
    for (let p = 0; p < e; p++) s[p] = t(p + 1, p, void 0, l && l[p]);
  } else if (qe(e)) {
    if (e[Symbol.iterator]) s = Array.from(e, (p, g) => t(p, g, void 0, l && l[g]));else {
      let p = Object.keys(e);
      s = new Array(p.length);
      for (let g = 0, _ = p.length; g < _; g++) {
        let x = p[g];
        s[g] = t(e[x], x, g, l && l[g]);
      }
    }
  } else s = [];
  return n && (n[i] = s), s;
}
function p1(e, t) {
  for (let n = 0; n < t.length; n++) {
    let i = t[n];
    if (_e(i)) for (let s = 0; s < i.length; s++) e[i[s].name] = i[s].fn;else i && (e[i.name] = i.key ? (...s) => {
      let l = i.fn(...s);
      return l && (l.key = i.key), l;
    } : i.fn);
  }
  return e;
}
function h1(e, t, n, i, s, l) {
  if (n == null && (n = {}), Pt.ce || Pt.parent && Kn(Pt.parent) && Pt.parent.ce) {
    let _ = l != null && n.key == null ? Ue({}, n, {
        key: l
      }) : n,
      x = Object.keys(_).length > 0;
    return t !== "default" && (_.name = t), ho(), Rs(Ct, null, [ut("slot", _, i && i())], x ? -2 : 64);
  }
  let u = e[t];
  u && u._c && (u._d = !1);
  let p = Wn.length;
  ho();
  let g;
  try {
    let _ = u && Bl(u(n)),
      x = n.key || l || _ && _.key;
    g = Rs(Ct, {
      key: (x && !kt(x) ? x : `_${t}`) + (!_ && i ? "_fb" : "")
    }, _ || (i ? i() : []), _ && e._ === 1 ? 64 : -2);
  } catch (_) {
    for (let x = Wn.length; x > p; x--) Gs();
    throw _;
  } finally {
    u && u._c && (u._d = !0);
  }
  return !s && g.scopeId && (g.slotScopeIds = [g.scopeId + "-s"]), g;
}
function Bl(e) {
  return e.some(t => Xn(t) ? !(t.type === vt || t.type === Ct && !Bl(t.children)) : !0) ? e : null;
}
function m1(e, t) {
  let n = {};
  for (let i in e) n[t && /[A-Z]/.test(i) ? `on:${i}` : jn(i)] = e[i];
  return n;
}
var Cl = e => e ? Gd(e) ? Eo(e) : Cl(e.parent) : null,
  lo = Ue(Object.create(null), {
    $: e => e,
    $el: e => e.vnode.el,
    $data: e => e.data,
    $props: e => e.props,
    $attrs: e => e.attrs,
    $slots: e => e.slots,
    $refs: e => e.refs,
    $parent: e => Cl(e.parent),
    $root: e => Cl(e.root),
    $host: e => e.ce,
    $emit: e => e.emit,
    $options: e => Kl(e),
    $forceUpdate: e => e.f || (e.f = () => {
      Pl(e.update);
    }),
    $nextTick: e => e.n || (e.n = vo.bind(e.proxy)),
    $watch: e => $v.bind(e)
  });
var xl = (e, t) => e !== Be && !e.__isScriptSetup && Je(e, t),
  Al = {
    get({
      _: e
    }, t) {
      if (t === "__v_skip") return !0;
      let {
        ctx: n,
        setupState: i,
        data: s,
        props: l,
        accessCache: u,
        type: p,
        appContext: g
      } = e;
      if (t[0] !== "$") {
        let V = u[t];
        if (V !== void 0) switch (V) {
          case 1:
            return i[t];
          case 2:
            return s[t];
          case 4:
            return n[t];
          case 3:
            return l[t];
        } else {
          if (xl(i, t)) return u[t] = 1, i[t];
          if (s !== Be && Je(s, t)) return u[t] = 2, s[t];
          if (Je(l, t)) return u[t] = 3, l[t];
          if (n !== Be && Je(n, t)) return u[t] = 4, n[t];
          Dl && (u[t] = 0);
        }
      }
      let _ = lo[t],
        x,
        w;
      if (_) return t === "$attrs" && Rt(e.attrs, "get", ""), _(e);
      if ((x = p.__cssModules) && (x = x[t])) return x;
      if (n !== Be && Je(n, t)) return u[t] = 4, n[t];
      if (w = g.config.globalProperties, Je(w, t)) return w[t];
    },
    set({
      _: e
    }, t, n) {
      let {
        data: i,
        setupState: s,
        ctx: l
      } = e;
      return xl(s, t) ? (s[t] = n, !0) : i !== Be && Je(i, t) ? (i[t] = n, !0) : Je(e.props, t) || t[0] === "$" && t.slice(1) in e ? !1 : (l[t] = n, !0);
    },
    has({
      _: {
        data: e,
        setupState: t,
        accessCache: n,
        ctx: i,
        appContext: s,
        props: l,
        type: u
      }
    }, p) {
      let g;
      return !!(n[p] || e !== Be && p[0] !== "$" && Je(e, p) || xl(t, p) || Je(l, p) || Je(i, p) || Je(lo, p) || Je(s.config.globalProperties, p) || (g = u.__cssModules) && g[p]);
    },
    defineProperty(e, t, n) {
      return n.get != null ? e._.accessCache[t] = 0 : Je(n, "value") && this.set(e, t, n.value, null), Reflect.defineProperty(e, t, n);
    }
  },
  g1 = Ue({}, Al, {
    get(e, t) {
      if (t !== Symbol.unscopables) return Al.get(e, t, e);
    },
    has(e, t) {
      return t[0] !== "_" && !ef(t);
    }
  });
function v1() {
  return null;
}
function b1() {
  return null;
}
function y1(e) {}
function w1(e) {}
function k1() {
  return null;
}
function E1() {}
function _1(e, t) {
  return null;
}
function N1() {
  return _d("useSlots").slots;
}
function x1() {
  return _d("useAttrs").attrs;
}
function _d(e) {
  let t = zt();
  return t.setupContext || (t.setupContext = Qd(t));
}
function fo(e) {
  return _e(e) ? e.reduce((t, n) => (t[n] = null, t), {}) : e;
}
function S1(e, t) {
  let n = fo(e);
  for (let i in t) {
    if (i.startsWith("__skip")) continue;
    let s = n[i];
    s ? _e(s) || $e(s) ? s = n[i] = {
      type: s,
      default: t[i]
    } : s.default = t[i] : s === null && (s = n[i] = {
      default: t[i]
    }), s && t[`__skip_${i}`] && (s.skipFactory = !0);
  }
  return n;
}
function O1(e, t) {
  return !e || !t ? e || t : _e(e) && _e(t) ? e.concat(t) : Ue({}, fo(e), fo(t));
}
function T1(e, t) {
  let n = {};
  for (let i in e) t.includes(i) || Object.defineProperty(n, i, {
    enumerable: !0,
    get: () => e[i]
  });
  return n;
}
function C1(e) {
  let t = zt(),
    n = Xr,
    i = e();
  go(), n && gr(!1);
  let s = () => {
      Oi(t), n && gr(!0);
    },
    l = () => {
      zt() !== t && t.scope.off(), go(), n && gr(!1);
    };
  return ts(i) && (i = i.catch(u => {
    throw s(), Promise.resolve().then(() => Promise.resolve().then(l)), u;
  })), [i, () => {
    s(), Promise.resolve().then(l);
  }];
}
var Dl = !0;
function A1(e) {
  let t = Kl(e),
    n = e.proxy,
    i = e.ctx;
  Dl = !1, t.beforeCreate && qf(t.beforeCreate, e, "bc");
  let {
    data: s,
    computed: l,
    methods: u,
    watch: p,
    provide: g,
    inject: _,
    created: x,
    beforeMount: w,
    mounted: V,
    beforeUpdate: $,
    updated: j,
    activated: F,
    deactivated: le,
    beforeDestroy: ue,
    beforeUnmount: W,
    destroyed: I,
    unmounted: z,
    render: L,
    renderTracked: te,
    renderTriggered: se,
    errorCaptured: ee,
    serverPrefetch: X,
    expose: Z,
    inheritAttrs: fe,
    components: J,
    directives: ve,
    filters: pe
  } = t;
  if (_ && D1(_, i, null), u) for (let Te in u) {
    let Ce = u[Te];
    $e(Ce) && (i[Te] = Ce.bind(n));
  }
  if (s) {
    let Te = s.call(n, n);
    qe(Te) && (e.data = mi(Te));
  }
  if (Dl = !0, l) for (let Te in l) {
    let Ce = l[Te],
      Qe = $e(Ce) ? Ce.bind(n, n) : $e(Ce.get) ? Ce.get.bind(n, n) : ht,
      et = !$e(Ce) && $e(Ce.set) ? Ce.set.bind(n) : ht,
      wt = tp({
        get: Qe,
        set: et
      });
    Object.defineProperty(i, Te, {
      enumerable: !0,
      configurable: !0,
      get: () => wt.value,
      set: it => wt.value = it
    });
  }
  if (p) for (let Te in p) Nd(p[Te], i, n, Te);
  if (g) {
    let Te = $e(g) ? g.call(n) : g;
    Reflect.ownKeys(Te).forEach(Ce => {
      od(Ce, Te[Ce]);
    });
  }
  x && qf(x, e, "c");
  function ke(Te, Ce) {
    _e(Ce) ? Ce.forEach(Qe => Te(Qe.bind(n))) : Ce && Te(Ce.bind(n));
  }
  if (ke(vd, w), ke(xi, V), ke(Ks, $), ke(ko, j), ke(hd, F), ke(md, le), ke(kd, ee), ke(wd, te), ke(yd, se), ke(Ws, W), ke(Si, z), ke(bd, X), _e(Z)) if (Z.length) {
    let Te = e.exposed || (e.exposed = {});
    Z.forEach(Ce => {
      Object.defineProperty(Te, Ce, {
        get: () => n[Ce],
        set: Qe => n[Ce] = Qe,
        enumerable: !0
      });
    });
  } else e.exposed || (e.exposed = {});
  L && e.render === ht && (e.render = L), fe != null && (e.inheritAttrs = fe), J && (e.components = J), ve && (e.directives = ve), X && Ul(e);
}
function D1(e, t, n = ht) {
  _e(e) && (e = Vl(e));
  for (let i in e) {
    let s = e[i],
      l;
    qe(s) ? "default" in s ? l = ao(s.from || i, s.default, !0) : l = ao(s.from || i) : l = ao(s), dt(l) ? Object.defineProperty(t, i, {
      enumerable: !0,
      configurable: !0,
      get: () => l.value,
      set: u => l.value = u
    }) : t[i] = l;
  }
}
function qf(e, t, n) {
  nn(_e(e) ? e.map(i => i.bind(t.proxy)) : e.bind(t.proxy), t, n);
}
function Nd(e, t, n, i) {
  let s = i.includes(".") ? cd(n, i) : () => n[i];
  if (Me(e)) {
    let l = t[e];
    $e(l) && Hr(s, l);
  } else if ($e(e)) Hr(s, e.bind(n));else if (qe(e)) if (_e(e)) e.forEach(l => Nd(l, t, n, i));else {
    let l = $e(e.handler) ? e.handler.bind(n) : t[e.handler];
    $e(l) && Hr(s, l, e);
  }
}
function Kl(e) {
  let t = e.type,
    {
      mixins: n,
      extends: i
    } = t,
    {
      mixins: s,
      optionsCache: l,
      config: {
        optionMergeStrategies: u
      }
    } = e.appContext,
    p = l.get(t),
    g;
  return p ? g = p : !s.length && !n && !i ? g = t : (g = {}, s.length && s.forEach(_ => Vs(g, _, u, !0)), Vs(g, t, u)), qe(t) && l.set(t, g), g;
}
function Vs(e, t, n, i = !1) {
  let {
    mixins: s,
    extends: l
  } = t;
  l && Vs(e, l, n, !0), s && s.forEach(u => Vs(e, u, n, !0));
  for (let u in t) if (!(i && u === "expose")) {
    let p = V1[u] || n && n[u];
    e[u] = p ? p(e[u], t[u]) : t[u];
  }
  return e;
}
var V1 = {
  data: Gf,
  props: Yf,
  emits: Yf,
  methods: so,
  computed: so,
  beforeCreate: Yt,
  created: Yt,
  beforeMount: Yt,
  mounted: Yt,
  beforeUpdate: Yt,
  updated: Yt,
  beforeDestroy: Yt,
  beforeUnmount: Yt,
  destroyed: Yt,
  unmounted: Yt,
  activated: Yt,
  deactivated: Yt,
  errorCaptured: Yt,
  serverPrefetch: Yt,
  components: so,
  directives: so,
  watch: I1,
  provide: Gf,
  inject: $1
};
function Gf(e, t) {
  return t ? e ? function () {
    return Ue($e(e) ? e.call(this, this) : e, $e(t) ? t.call(this, this) : t);
  } : t : e;
}
function $1(e, t) {
  return so(Vl(e), Vl(t));
}
function Vl(e) {
  if (_e(e)) {
    let t = {};
    for (let n = 0; n < e.length; n++) t[e[n]] = e[n];
    return t;
  }
  return e;
}
function Yt(e, t) {
  return e ? [...new Set([].concat(e, t))] : t;
}
function so(e, t) {
  return e ? Ue(Object.create(null), e, t) : t;
}
function Yf(e, t) {
  return e ? _e(e) && _e(t) ? [...new Set([...e, ...t])] : Ue(Object.create(null), fo(e), fo(t ?? {})) : t;
}
function I1(e, t) {
  if (!e) return t;
  if (!t) return e;
  let n = Ue(Object.create(null), e);
  for (let i in t) n[i] = Yt(e[i], t[i]);
  return n;
}
function xd() {
  return {
    app: null,
    config: {
      isNativeTag: cr,
      performance: !1,
      globalProperties: {},
      optionMergeStrategies: {},
      errorHandler: void 0,
      warnHandler: void 0,
      compilerOptions: {}
    },
    mixins: [],
    components: {},
    directives: {},
    provides: Object.create(null),
    optionsCache: new WeakMap(),
    propsCache: new WeakMap(),
    emitsCache: new WeakMap()
  };
}
var R1 = 0;
function M1(e, t) {
  return function (i, s = null) {
    $e(i) || (i = Ue({}, i)), s != null && !qe(s) && (s = null);
    let l = xd(),
      u = new WeakSet(),
      p = [],
      g = !1,
      _ = l.app = {
        _uid: R1++,
        _component: i,
        _props: s,
        _container: null,
        _context: l,
        _instance: null,
        version: ip,
        get config() {
          return l.config;
        },
        set config(x) {},
        use(x, ...w) {
          return u.has(x) || (x && $e(x.install) ? (u.add(x), x.install(_, ...w)) : $e(x) && (u.add(x), x(_, ...w))), _;
        },
        mixin(x) {
          return l.mixins.includes(x) || l.mixins.push(x), _;
        },
        component(x, w) {
          return w ? (l.components[x] = w, _) : l.components[x];
        },
        directive(x, w) {
          return w ? (l.directives[x] = w, _) : l.directives[x];
        },
        mount(x, w, V) {
          if (!g) {
            let $ = _._ceVNode || ut(i, s);
            return $.appContext = l, V === !0 ? V = "svg" : V === !1 && (V = void 0), w && t ? t($, x) : e($, x, V), g = !0, _._container = x, x.__vue_app__ = _, Eo($.component);
          }
        },
        onUnmount(x) {
          p.push(x);
        },
        unmount() {
          g && (nn(p, _._instance, 16), e(null, _._container), delete _._container.__vue_app__);
        },
        provide(x, w) {
          return l.provides[x] = w, _;
        },
        runWithContext(x) {
          let w = Br;
          Br = _;
          try {
            return x();
          } finally {
            Br = w;
          }
        }
      };
    return _;
  };
}
var Br = null;
function P1(e, t, n = Be) {
  let i = zt(),
    s = Ze(t),
    l = Ut(t),
    u = Sd(e, s),
    p = bs((g, _) => {
      let x,
        w = Be,
        V;
      return ld(() => {
        let $ = e[s];
        Et(x, $) && (x = $, _());
      }), {
        get() {
          return g(), n.get ? n.get(x) : x;
        },
        set($) {
          let j = n.set ? n.set($) : $;
          if (!Et(j, x) && !(w !== Be && Et($, w))) return;
          let F = i.vnode.props,
            le = !!(F && (t in F || s in F || l in F) && (`onUpdate:${t}` in F || `onUpdate:${s}` in F || `onUpdate:${l}` in F));
          le || (x = $, _()), i.emit(`update:${t}`, j), Et($, w) && (Et($, j) && !Et(j, V) || le && w !== Be && !Et(j, x)) && _(), w = $, V = j;
        }
      };
    });
  return p[Symbol.iterator] = () => {
    let g = 0;
    return {
      next() {
        return g < 2 ? {
          value: g++ ? u || Be : p,
          done: !1
        } : {
          done: !0
        };
      }
    };
  }, p;
}
var Sd = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${Ze(t)}Modifiers`] || e[`${Ut(t)}Modifiers`];
function L1(e, t, ...n) {
  if (e.isUnmounted) return;
  let i = e.vnode.props || Be,
    s = n,
    l = t.startsWith("update:"),
    u = l && Sd(i, t.slice(7));
  u && (u.trim && (s = n.map(x => Me(x) ? x.trim() : x)), u.number && (s = n.map(fi)));
  let p,
    g = i[p = jn(t)] || i[p = jn(Ze(t))];
  !g && l && (g = i[p = jn(Ut(t))]), g && nn(g, e, 6, s);
  let _ = i[p + "Once"];
  if (_) {
    if (!e.emitted) e.emitted = {};else if (e.emitted[p]) return;
    e.emitted[p] = !0, nn(_, e, 6, s);
  }
}
var F1 = new WeakMap();
function Od(e, t, n = !1) {
  let i = n ? F1 : t.emitsCache,
    s = i.get(e);
  if (s !== void 0) return s;
  let l = e.emits,
    u = {},
    p = !1;
  if (!$e(e)) {
    let g = _ => {
      let x = Od(_, t, !0);
      x && (p = !0, Ue(u, x));
    };
    !n && t.mixins.length && t.mixins.forEach(g), e.extends && g(e.extends), e.mixins && e.mixins.forEach(g);
  }
  return !l && !p ? (qe(e) && i.set(e, null), null) : (_e(l) ? l.forEach(g => u[g] = null) : Ue(u, l), qe(e) && i.set(e, u), u);
}
function Xs(e, t) {
  return !e || !Tn(t) ? !1 : (t = t.slice(2), t = t === "Once" ? t : t.replace(/Once$/, ""), Je(e, t[0].toLowerCase() + t.slice(1)) || Je(e, Ut(t)) || Je(e, t));
}
function xs(e) {
  let {
      type: t,
      vnode: n,
      proxy: i,
      withProxy: s,
      propsOptions: [l],
      slots: u,
      attrs: p,
      emit: g,
      render: _,
      renderCache: x,
      props: w,
      data: V,
      setupState: $,
      ctx: j,
      inheritAttrs: F
    } = e,
    le = uo(e),
    ue,
    W;
  try {
    if (n.shapeFlag & 4) {
      let L = s || i,
        te = L;
      ue = tn(_.call(te, L, x, w, $, V, j)), W = p;
    } else {
      let L = t;
      ue = tn(L.length > 1 ? L(w, {
        attrs: p,
        slots: u,
        emit: g
      }) : L(w, null)), W = t.props ? p : j1(p);
    }
  } catch (L) {
    Wn.length = 0, Gr(L, e, 1), ue = ut(vt);
  }
  let I = ue,
    z;
  if (W && F !== !1) {
    let L = Object.keys(W),
      {
        shapeFlag: te
      } = I;
    L.length && te & 7 && (l && L.some(li) && (W = z1(W, l)), I = Rn(I, W, !1, !0));
  }
  if (n.dirs && (I = Rn(I, null, !1, !0), I.dirs = I.dirs ? I.dirs.concat(n.dirs) : n.dirs), n.transition) {
    let L = js(I.type) && Cs(I) || I;
    In(L, n.transition);
  }
  return ue = I, uo(le), ue;
}
function U1(e, t = !0) {
  let n;
  for (let i = 0; i < e.length; i++) {
    let s = e[i];
    if (Xn(s)) {
      if (s.type !== vt || s.children === "v-if") {
        if (n) return;
        n = s;
      }
    } else return;
  }
  return n;
}
var j1 = e => {
    let t;
    for (let n in e) (n === "class" || n === "style" || Tn(n)) && ((t || (t = {}))[n] = e[n]);
    return t;
  },
  z1 = (e, t) => {
    let n = {};
    for (let i in e) (!li(i) || !(i.slice(9) in t)) && (n[i] = e[i]);
    return n;
  };
function H1(e, t, n) {
  let {
      props: i,
      children: s,
      component: l
    } = e,
    {
      props: u,
      children: p,
      patchFlag: g
    } = t,
    _ = l.emitsOptions;
  if (t.dirs || t.transition) return !0;
  if (n && g >= 0) {
    if (g & 1024) return !0;
    if (g & 16) return i ? Jf(i, u, _) : !!u;
    if (g & 8) {
      let x = t.dynamicProps;
      for (let w = 0; w < x.length; w++) {
        let V = x[w];
        if (Td(u, i, V) && !Xs(_, V)) return !0;
      }
    }
  } else return (s || p) && (!p || !p.$stable) ? !0 : i === u ? !1 : i ? u ? Jf(i, u, _) : !0 : !!u;
  return !1;
}
function Jf(e, t, n) {
  let i = Object.keys(t);
  if (i.length !== Object.keys(e).length) return !0;
  for (let s = 0; s < i.length; s++) {
    let l = i[s];
    if (Td(t, e, l) && !Xs(n, l)) return !0;
  }
  return !1;
}
function Td(e, t, n) {
  let i = e[n],
    s = t[n];
  return n === "style" && qe(i) && qe(s) ? !xn(i, s) : i !== s;
}
function qs({
  vnode: e,
  parent: t,
  suspense: n
}, i) {
  for (; t;) {
    let s = t.subTree;
    if (s.suspense && s.suspense.activeBranch === e && (s.suspense.vnode.el = s.el = i, e = s), s === e) (e = t.vnode).el = i, t = t.parent;else break;
  }
  n && n.activeBranch === e && (n.vnode.el = i);
}
var Cd = {},
  Ad = () => Object.create(Cd),
  Dd = e => Object.getPrototypeOf(e) === Cd;
function B1(e, t, n, i = !1) {
  let s = {},
    l = Ad();
  e.propsDefaults = Object.create(null), Vd(e, t, s, l);
  for (let u in e.propsOptions[0]) u in s || (s[u] = void 0);
  n ? e.props = i ? s : hs(s) : e.type.props ? e.props = s : e.props = l, e.attrs = l;
}
function K1(e, t, n, i) {
  let {
      props: s,
      attrs: l,
      vnode: {
        patchFlag: u
      }
    } = e,
    p = Xe(s),
    [g] = e.propsOptions,
    _ = !1;
  if ((i || u > 0) && !(u & 16)) {
    if (u & 8) {
      let x = e.vnode.dynamicProps;
      for (let w = 0; w < x.length; w++) {
        let V = x[w];
        if (Xs(e.emitsOptions, V)) continue;
        let $ = t[V];
        if (g) {
          if (Je(l, V)) $ !== l[V] && (l[V] = $, _ = !0);else {
            let j = Ze(V);
            s[j] = $l(g, p, j, $, e, !1);
          }
        } else $ !== l[V] && (l[V] = $, _ = !0);
      }
    }
  } else {
    Vd(e, t, s, l) && (_ = !0);
    let x;
    for (let w in p) (!t || !Je(t, w) && ((x = Ut(w)) === w || !Je(t, x))) && (g ? n && (n[w] !== void 0 || n[x] !== void 0) && (s[w] = $l(g, p, w, void 0, e, !0)) : delete s[w]);
    if (l !== p) for (let w in l) (!t || !Je(t, w)) && (delete l[w], _ = !0);
  }
  _ && An(e.attrs, "set", "");
}
function Vd(e, t, n, i) {
  let [s, l] = e.propsOptions,
    u = !1,
    p;
  if (t) for (let g in t) {
    if (Nn(g)) continue;
    let _ = t[g],
      x;
    s && Je(s, x = Ze(g)) ? !l || !l.includes(x) ? n[x] = _ : (p || (p = {}))[x] = _ : Xs(e.emitsOptions, g) || (!(g in i) || _ !== i[g]) && (i[g] = _, u = !0);
  }
  if (l) {
    let g = Xe(n),
      _ = p || Be;
    for (let x = 0; x < l.length; x++) {
      let w = l[x];
      n[w] = $l(s, g, w, _[w], e, !Je(_, w));
    }
  }
  return u;
}
function $l(e, t, n, i, s, l) {
  let u = e[n];
  if (u != null) {
    let p = Je(u, "default");
    if (p && i === void 0) {
      let g = u.default;
      if (u.type !== Function && !u.skipFactory && $e(g)) {
        let {
          propsDefaults: _
        } = s;
        if (n in _) i = _[n];else {
          let x = Oi(s);
          i = _[n] = g.call(null, t), x();
        }
      } else i = g;
      s.ce && s.ce._setProp(n, i);
    }
    u[0] && (l && !p ? i = !1 : u[1] && (i === "" || i === Ut(n)) && (i = !0));
  }
  return i;
}
var W1 = new WeakMap();
function $d(e, t, n = !1) {
  let i = n ? W1 : t.propsCache,
    s = i.get(e);
  if (s) return s;
  let l = e.props,
    u = {},
    p = [],
    g = !1;
  if (!$e(e)) {
    let x = w => {
      g = !0;
      let [V, $] = $d(w, t, !0);
      Ue(u, V), $ && p.push(...$);
    };
    !n && t.mixins.length && t.mixins.forEach(x), e.extends && x(e.extends), e.mixins && e.mixins.forEach(x);
  }
  if (!l && !g) return qe(e) && i.set(e, Ar), Ar;
  if (_e(l)) for (let x = 0; x < l.length; x++) {
    let w = Ze(l[x]);
    Zf(w) && (u[w] = Be);
  } else if (l) for (let x in l) {
    let w = Ze(x);
    if (Zf(w)) {
      let V = l[x],
        $ = u[w] = _e(V) || $e(V) ? {
          type: V
        } : Ue({}, V),
        j = $.type,
        F = !1,
        le = !0;
      if (_e(j)) for (let ue = 0; ue < j.length; ++ue) {
        let W = j[ue],
          I = $e(W) && W.name;
        if (I === "Boolean") {
          F = !0;
          break;
        } else I === "String" && (le = !1);
      } else F = $e(j) && j.name === "Boolean";
      $[0] = F, $[1] = le, (F || Je($, "default")) && p.push(w);
    }
  }
  let _ = [u, p];
  return qe(e) && i.set(e, _), _;
}
function Zf(e) {
  return e[0] !== "$" && !Nn(e);
}
var Wl = e => e === "_" || e === "_ctx" || e === "$stable",
  Xl = e => _e(e) ? e.map(tn) : [tn(e)],
  X1 = (e, t, n) => {
    if (t._n) return t;
    let i = Ll((...s) => Xl(t(...s)), n);
    return i._c = !1, i;
  },
  Id = (e, t, n) => {
    let i = e._ctx;
    for (let s in e) {
      if (Wl(s)) continue;
      let l = e[s];
      if ($e(l)) t[s] = X1(s, l, i);else if (l != null) {
        let u = Xl(l);
        t[s] = () => u;
      }
    }
  },
  Rd = (e, t) => {
    let n = Xl(t);
    e.slots.default = () => n;
  },
  Md = (e, t, n) => {
    for (let i in t) (n || !Wl(i)) && (e[i] = t[i]);
  },
  q1 = (e, t, n) => {
    let i = e.slots = Ad();
    if (e.vnode.shapeFlag & 32) {
      let s = t._;
      s ? (Md(i, t, n), n && rs(i, "_", s, !0)) : Id(t, i);
    } else t && Rd(e, t);
  },
  G1 = (e, t, n) => {
    let {
        vnode: i,
        slots: s
      } = e,
      l = !0,
      u = Be;
    if (i.shapeFlag & 32) {
      let p = t._;
      p ? n && p === 1 ? l = !1 : Md(s, t, n) : (l = !t.$stable, Id(t, s)), u = t;
    } else t && (Rd(e, t), u = {
      default: 1
    });
    if (l) for (let p in s) !Wl(p) && u[p] == null && delete s[p];
  };
function Y1() {
  let e = [];
}
var _t = zd;
function ql(e) {
  return Pd(e);
}
function Gl(e) {
  return Pd(e, Hv);
}
function Pd(e, t) {
  Y1();
  let n = Xi();
  n.__VUE__ = !0;
  let {
      insert: i,
      remove: s,
      patchProp: l,
      createElement: u,
      createText: p,
      createComment: g,
      setText: _,
      setElementText: x,
      parentNode: w,
      nextSibling: V,
      setScopeId: $ = ht,
      insertStaticContent: j
    } = e,
    F = (D, P, q, ae = null, re = null, ie = null, we = void 0, me = null, de = !!P.dynamicChildren) => {
      if (D === P) return;
      D && !On(D, P) && (ae = rr(D), st(D, re, ie, !0), D = null), P.patchFlag === -2 && (de = !1, P.dynamicChildren = null);
      let {
        type: oe,
        ref: Re,
        shapeFlag: Ne
      } = P;
      switch (oe) {
        case hr:
          le(D, P, q, ae);
          break;
        case vt:
          ue(D, P, q, ae);
          break;
        case mr:
          D == null && W(P, q, ae, we);
          break;
        case Ct:
          ve(D, P, q, ae, re, ie, we, me, de);
          break;
        default:
          Ne & 1 ? te(D, P, q, ae, re, ie, we, me, de) : Ne & 6 ? pe(D, P, q, ae, re, ie, we, me, de) : (Ne & 64 || Ne & 128) && oe.process(D, P, q, ae, re, ie, we, me, de, ir);
      }
      Re != null && re ? ki(Re, D && D.ref, ie, P || D, !P) : Re == null && D && D.ref != null && ki(D.ref, null, ie, D, !0);
    },
    le = (D, P, q, ae) => {
      if (D == null) i(P.el = p(P.children), q, ae);else {
        let re = P.el = D.el;
        P.children !== D.children && _(re, P.children);
      }
    },
    ue = (D, P, q, ae) => {
      D == null ? i(P.el = g(P.children || ""), q, ae) : P.el = D.el;
    },
    W = (D, P, q, ae) => {
      [D.el, D.anchor] = j(D.children, P, q, ae, D.el, D.anchor);
    },
    I = (D, P, q, ae) => {
      if (P.children !== D.children) {
        let re = V(D.anchor);
        L(D), [P.el, P.anchor] = j(P.children, q, re, ae);
      } else P.el = D.el, P.anchor = D.anchor;
    },
    z = ({
      el: D,
      anchor: P
    }, q, ae) => {
      let re;
      for (; D && D !== P;) re = V(D), i(D, q, ae), D = re;
      i(P, q, ae);
    },
    L = ({
      el: D,
      anchor: P
    }) => {
      let q;
      for (; D && D !== P;) q = V(D), s(D), D = q;
      s(P);
    },
    te = (D, P, q, ae, re, ie, we, me, de) => {
      if (P.type === "svg" ? we = "svg" : P.type === "math" && (we = "mathml"), D == null) se(P, q, ae, re, ie, we, me, de);else {
        let oe = D.el && D.el._isVueCE ? D.el : null;
        try {
          oe && oe._beginPatch(), Z(D, P, re, ie, we, me, de);
        } finally {
          oe && oe._endPatch();
        }
      }
    },
    se = (D, P, q, ae, re, ie, we, me) => {
      let de,
        oe,
        {
          props: Re,
          shapeFlag: Ne,
          transition: be,
          dirs: Pe
        } = D;
      if (de = D.el = u(D.type, ie, Re && Re.is, Re), Ne & 8 ? x(de, D.children) : Ne & 16 && X(D.children, de, null, ae, re, Sl(D, ie), we, me), Pe && $n(D, null, ae, "created"), ee(de, D, D.scopeId, we, ae), Re) {
        for (let Ye in Re) Ye !== "value" && !Nn(Ye) && l(de, Ye, null, Re[Ye], ie, ae);
        "value" in Re && l(de, "value", null, Re.value, ie), (oe = Re.onVnodeBeforeMount) && en(oe, ae, D);
      }
      Pe && $n(D, null, ae, "beforeMount");
      let ye = Ld(re, be);
      ye && be.beforeEnter(de), i(de, P, q), ((oe = Re && Re.onVnodeMounted) || ye || Pe) && _t(() => {
        let rt;
        oe && en(oe, ae, D), ye && be.enter(de), Pe && $n(D, null, ae, "mounted");
      }, re);
    },
    ee = (D, P, q, ae, re) => {
      if (q && $(D, q), ae) for (let ie = 0; ie < ae.length; ie++) $(D, ae[ie]);
      if (re) {
        let ie = re.subTree;
        if (P === ie || Is(ie.type) && (ie.ssContent === P || ie.ssFallback === P)) {
          let we = re.vnode;
          ee(D, we, we.scopeId, we.slotScopeIds, re.parent);
        }
      }
    },
    X = (D, P, q, ae, re, ie, we, me, de = 0) => {
      for (let oe = de; oe < D.length; oe++) {
        let Re = D[oe] = me ? Bn(D[oe]) : tn(D[oe]);
        F(null, Re, P, q, ae, re, ie, we, me);
      }
    },
    Z = (D, P, q, ae, re, ie, we) => {
      let me = P.el = D.el,
        {
          patchFlag: de,
          dynamicChildren: oe,
          dirs: Re
        } = P;
      de |= D.patchFlag & 16;
      let Ne = D.props || Be,
        be = P.props || Be,
        Pe;
      if (q && Ur(q, !1), (Pe = be.onVnodeBeforeUpdate) && en(Pe, q, P, D), Re && $n(P, D, q, "beforeUpdate"), q && Ur(q, !0), oe && (!D.dynamicChildren || D.dynamicChildren.length !== oe.length) && (de = 0, we = !1, oe = null), (Ne.innerHTML && be.innerHTML == null || Ne.textContent && be.textContent == null) && x(me, ""), oe ? fe(D.dynamicChildren, oe, me, q, ae, Sl(P, re), ie) : we || Qe(D, P, me, null, q, ae, Sl(P, re), ie, !1), de > 0) {
        if (de & 16) J(me, Ne, be, q, re);else if (de & 2 && Ne.class !== be.class && l(me, "class", null, be.class, re), de & 4 && l(me, "style", Ne.style, be.style, re), de & 8) {
          let ye = P.dynamicProps;
          for (let Ye = 0; Ye < ye.length; Ye++) {
            let rt = ye[Ye],
              mt = Ne[rt],
              je = be[rt];
            (je !== mt || rt === "value") && l(me, rt, mt, je, re, q);
          }
        }
        de & 1 && D.children !== P.children && x(me, P.children);
      } else !we && oe == null && J(me, Ne, be, q, re);
      ((Pe = be.onVnodeUpdated) || Re) && _t(() => {
        Pe && en(Pe, q, P, D), Re && $n(P, D, q, "updated");
      }, ae);
    },
    fe = (D, P, q, ae, re, ie, we) => {
      for (let me = 0; me < P.length; me++) {
        let de = D[me],
          oe = P[me],
          Re = de.el && (de.type === Ct || !On(de, oe) || de.shapeFlag & 198) ? w(de.el) : q;
        F(de, oe, Re, null, ae, re, ie, we, !0);
      }
    },
    J = (D, P, q, ae, re) => {
      if (P !== q) {
        if (P !== Be) for (let ie in P) !Nn(ie) && !(ie in q) && l(D, ie, P[ie], null, re, ae);
        for (let ie in q) {
          if (Nn(ie)) continue;
          let we = q[ie],
            me = P[ie];
          we !== me && ie !== "value" && l(D, ie, me, we, re, ae);
        }
        "value" in q && l(D, "value", P.value, q.value, re);
      }
    },
    ve = (D, P, q, ae, re, ie, we, me, de) => {
      let oe = P.el = D ? D.el : p(""),
        Re = P.anchor = D ? D.anchor : p(""),
        {
          patchFlag: Ne,
          dynamicChildren: be,
          slotScopeIds: Pe
        } = P;
      Pe && (me = me ? me.concat(Pe) : Pe), D == null ? (i(oe, q, ae), i(Re, q, ae), X(P.children || [], q, Re, re, ie, we, me, de)) : Ne > 0 && Ne & 64 && be && D.dynamicChildren && D.dynamicChildren.length === be.length ? (fe(D.dynamicChildren, be, q, re, ie, we, me), (P.key != null || re && P === re.subTree) && Yl(D, P, !0)) : Qe(D, P, q, Re, re, ie, we, me, de);
    },
    pe = (D, P, q, ae, re, ie, we, me, de) => {
      P.slotScopeIds = me, D == null ? P.shapeFlag & 512 ? re.ctx.activate(P, q, ae, we, de) : Ae(P, q, ae, re, ie, we, de) : ke(D, P, de);
    },
    Ae = (D, P, q, ae, re, ie, we) => {
      let me = D.component = qd(D, ae, re);
      if (wo(D) && (me.ctx.renderer = ir), Yd(me, !1, we), me.asyncDep) {
        if (re && re.registerDep(me, Te, we), !D.el) {
          let de = me.subTree = ut(vt);
          ue(null, de, P, q), D.placeholder = de.el;
        }
      } else Te(me, D, P, q, re, ie, we);
    },
    ke = (D, P, q) => {
      let ae = P.component = D.component;
      if (H1(D, P, q)) {
        if (ae.asyncDep && !ae.asyncResolved) {
          Ce(ae, P, q);
          return;
        } else ae.next = P, ae.update();
      } else P.el = D.el, ae.vnode = P;
    },
    Te = (D, P, q, ae, re, ie, we) => {
      let me = () => {
        if (D.isMounted) {
          let {
            next: Ne,
            bu: be,
            u: Pe,
            parent: ye,
            vnode: Ye
          } = D;
          {
            let Xt = Fd(D);
            if (Xt) {
              Ne && (Ne.el = Ye.el, Ce(D, Ne, we)), Xt.asyncDep.then(() => {
                _t(() => {
                  D.isUnmounted || oe();
                }, re);
              });
              return;
            }
          }
          let rt = Ne,
            mt;
          Ur(D, !1), Ne ? (Ne.el = Ye.el, Ce(D, Ne, we)) : Ne = Ye, be && ur(be), (mt = Ne.props && Ne.props.onVnodeBeforeUpdate) && en(mt, ye, Ne, Ye), Ur(D, !0);
          let je = xs(D),
            Zt = D.subTree;
          D.subTree = je, F(Zt, je, w(Zt.el), rr(Zt), D, re, ie), Ne.el = je.el, rt === null && qs(D, je.el), Pe && _t(Pe, re), (mt = Ne.props && Ne.props.onVnodeUpdated) && _t(() => en(mt, ye, Ne, Ye), re);
        } else {
          let Ne,
            {
              el: be,
              props: Pe
            } = P,
            {
              bm: ye,
              m: Ye,
              parent: rt,
              root: mt,
              type: je
            } = D,
            Zt = Kn(P);
          if (Ur(D, !1), ye && ur(ye), !Zt && (Ne = Pe && Pe.onVnodeBeforeMount) && en(Ne, rt, P), Ur(D, !0), be && ni) {
            let Xt = () => {
              D.subTree = xs(D), ni(be, D.subTree, D, re, null);
            };
            Zt && je.__asyncHydrate ? je.__asyncHydrate(be, D, Xt) : Xt();
          } else {
            mt.ce && mt.ce._hasShadowRoot() && mt.ce._injectChildStyle(je, D.parent ? D.parent.type : void 0);
            let Xt = D.subTree = xs(D);
            F(null, Xt, q, ae, D, re, ie), P.el = Xt.el;
          }
          if (Ye && _t(Ye, re), !Zt && (Ne = Pe && Pe.onVnodeMounted)) {
            let Xt = P;
            _t(() => en(Ne, rt, Xt), re);
          }
          (P.shapeFlag & 256 || rt && Kn(rt.vnode) && rt.vnode.shapeFlag & 256) && D.a && _t(D.a, re), D.isMounted = !0, P = q = ae = null;
        }
      };
      D.scope.on();
      let de = D.effect = new Hn(me);
      D.scope.off();
      let oe = D.update = de.run.bind(de),
        Re = D.job = de.runIfDirty.bind(de);
      Re.i = D, Re.id = D.uid, de.scheduler = () => Pl(Re), Ur(D, !0), oe();
    },
    Ce = (D, P, q) => {
      P.component = D;
      let ae = D.vnode.props;
      D.vnode = P, D.next = null, K1(D, P.props, ae, q), G1(D, P.children, q), gn(), Uf(D), vn();
    },
    Qe = (D, P, q, ae, re, ie, we, me, de = !1) => {
      let oe = D && D.children,
        Re = D ? D.shapeFlag : 0,
        Ne = P.children,
        {
          patchFlag: be,
          shapeFlag: Pe
        } = P;
      if (be > 0) {
        if (be & 128) {
          wt(oe, Ne, q, ae, re, ie, we, me, de);
          return;
        } else if (be & 256) {
          et(oe, Ne, q, ae, re, ie, we, me, de);
          return;
        }
      }
      Pe & 8 ? (Re & 16 && nr(oe, re, ie), Ne !== oe && x(q, Ne)) : Re & 16 ? Pe & 16 ? wt(oe, Ne, q, ae, re, ie, we, me, de) : nr(oe, re, ie, !0) : (Re & 8 && x(q, ""), Pe & 16 && X(Ne, q, ae, re, ie, we, me, de));
    },
    et = (D, P, q, ae, re, ie, we, me, de) => {
      D = D || Ar, P = P || Ar;
      let oe = D.length,
        Re = P.length,
        Ne = Math.min(oe, Re),
        be;
      for (be = 0; be < Ne; be++) {
        let Pe = P[be] = de ? Bn(P[be]) : tn(P[be]);
        F(D[be], Pe, q, null, re, ie, we, me, de);
      }
      oe > Re ? nr(D, re, ie, !0, !1, Ne) : X(P, q, ae, re, ie, we, me, de, Ne);
    },
    wt = (D, P, q, ae, re, ie, we, me, de) => {
      let oe = 0,
        Re = P.length,
        Ne = D.length - 1,
        be = Re - 1;
      for (; oe <= Ne && oe <= be;) {
        let Pe = D[oe],
          ye = P[oe] = de ? Bn(P[oe]) : tn(P[oe]);
        if (On(Pe, ye)) F(Pe, ye, q, null, re, ie, we, me, de);else break;
        oe++;
      }
      for (; oe <= Ne && oe <= be;) {
        let Pe = D[Ne],
          ye = P[be] = de ? Bn(P[be]) : tn(P[be]);
        if (On(Pe, ye)) F(Pe, ye, q, null, re, ie, we, me, de);else break;
        Ne--, be--;
      }
      if (oe > Ne) {
        if (oe <= be) {
          let Pe = be + 1,
            ye = Pe < Re ? P[Pe].el : ae;
          for (; oe <= be;) F(null, P[oe] = de ? Bn(P[oe]) : tn(P[oe]), q, ye, re, ie, we, me, de), oe++;
        }
      } else if (oe > be) for (; oe <= Ne;) st(D[oe], re, ie, !0), oe++;else {
        let Pe = oe,
          ye = oe,
          Ye = new Map();
        for (oe = ye; oe <= be; oe++) {
          let qt = P[oe] = de ? Bn(P[oe]) : tn(P[oe]);
          qt.key != null && Ye.set(qt.key, oe);
        }
        let rt,
          mt = 0,
          je = be - ye + 1,
          Zt = !1,
          Xt = 0,
          or = new Array(je);
        for (oe = 0; oe < je; oe++) or[oe] = 0;
        for (oe = Pe; oe <= Ne; oe++) {
          let qt = D[oe];
          if (mt >= je) {
            st(qt, re, ie, !0);
            continue;
          }
          let an;
          if (qt.key != null) an = Ye.get(qt.key);else for (rt = ye; rt <= be; rt++) if (or[rt - ye] === 0 && On(qt, P[rt])) {
            an = rt;
            break;
          }
          an === void 0 ? st(qt, re, ie, !0) : (or[an - ye] = oe + 1, an >= Xt ? Xt = an : Zt = !0, F(qt, P[an], q, null, re, ie, we, me, de), mt++);
        }
        let Li = Zt ? J1(or) : Ar;
        for (rt = Li.length - 1, oe = je - 1; oe >= 0; oe--) {
          let qt = ye + oe,
            an = P[qt],
            Fi = P[qt + 1],
            Ui = qt + 1 < Re ? Fi.el || Ud(Fi) : ae;
          or[oe] === 0 ? F(null, an, q, Ui, re, ie, we, me, de) : Zt && (rt < 0 || oe !== Li[rt] ? it(an, q, Ui, 2) : rt--);
        }
      }
    },
    it = (D, P, q, ae, re = null) => {
      let {
        el: ie,
        type: we,
        transition: me,
        children: de,
        shapeFlag: oe
      } = D;
      if (oe & 6) {
        it(D.component.subTree, P, q, ae);
        return;
      }
      if (oe & 128) {
        D.suspense.move(P, q, ae);
        return;
      }
      if (oe & 64) {
        we.move(D, P, q, ir);
        return;
      }
      if (we === Ct) {
        i(ie, P, q);
        for (let Ne = 0; Ne < de.length; Ne++) it(de[Ne], P, q, ae);
        i(D.anchor, P, q);
        return;
      }
      if (we === mr) {
        z(D, P, q);
        return;
      }
      if (ae !== 2 && oe & 1 && me) {
        if (ae === 0) me.persisted && !ie[yn] ? i(ie, P, q) : (me.beforeEnter(ie), i(ie, P, q), _t(() => me.enter(ie), re));else {
          let {
              leave: Ne,
              delayLeave: be,
              afterLeave: Pe
            } = me,
            ye = () => {
              D.ctx.isUnmounted ? s(ie) : i(ie, P, q);
            },
            Ye = () => {
              let rt = ie._isLeaving || !!ie[yn];
              ie._isLeaving && ie[yn](!0), me.persisted && !rt ? ye() : Ne(ie, () => {
                ye(), Pe && Pe();
              });
            };
          be ? be(ie, ye, Ye) : Ye();
        }
      } else i(ie, P, q);
    },
    st = (D, P, q, ae = !1, re = !1) => {
      let {
        type: ie,
        props: we,
        ref: me,
        children: de,
        dynamicChildren: oe,
        shapeFlag: Re,
        patchFlag: Ne,
        dirs: be,
        cacheIndex: Pe,
        memo: ye
      } = D;
      if (Ne === -2 && (re = !1), me != null && (gn(), ki(me, null, q, D, !0), vn()), Pe != null && (P.renderCache[Pe] = void 0), Re & 256) {
        P.ctx.deactivate(D);
        return;
      }
      let Ye = Re & 1 && be,
        rt = !Kn(D),
        mt;
      if (rt && (mt = we && we.onVnodeBeforeUnmount) && en(mt, P, D), Re & 6) Nr(D.component, q, ae);else {
        if (Re & 128) {
          D.suspense.unmount(q, ae);
          return;
        }
        Ye && $n(D, null, P, "beforeUnmount"), Re & 64 ? D.type.remove(D, P, q, ir, ae) : oe && !oe.hasOnce && (ie !== Ct || Ne > 0 && Ne & 64) ? nr(oe, P, q, !1, !0) : (ie === Ct && Ne & 384 || !re && Re & 16) && nr(de, P, q), ae && tr(D);
      }
      let je = ye != null && Pe == null;
      (rt && (mt = we && we.onVnodeUnmounted) || Ye || je) && _t(() => {
        mt && en(mt, P, D), Ye && $n(D, null, P, "unmounted"), je && (D.el = null);
      }, q);
    },
    tr = D => {
      let {
        type: P,
        el: q,
        anchor: ae,
        transition: re
      } = D;
      if (P === Ct) {
        _r(q, ae);
        return;
      }
      if (P === mr) {
        L(D);
        return;
      }
      let ie = () => {
        s(q), re && !re.persisted && re.afterLeave && re.afterLeave();
      };
      if (D.shapeFlag & 1 && re && !re.persisted) {
        let {
            leave: we,
            delayLeave: me
          } = re,
          de = () => we(q, ie);
        me ? me(D.el, ie, de) : de();
      } else ie();
    },
    _r = (D, P) => {
      let q;
      for (; D !== P;) q = V(D), s(D), D = q;
      s(P);
    },
    Nr = (D, P, q) => {
      let {
        bum: ae,
        scope: re,
        job: ie,
        subTree: we,
        um: me,
        m: de,
        a: oe
      } = D;
      $s(de), $s(oe), ae && ur(ae), re.stop(), ie && (ie.flags |= 8, st(we, D, P, q)), me && _t(me, P), _t(() => {
        D.isUnmounted = !0;
      }, P);
    },
    nr = (D, P, q, ae = !1, re = !1, ie = 0) => {
      for (let we = ie; we < D.length; we++) st(D[we], P, q, ae, re);
    },
    rr = D => {
      if (D.shapeFlag & 6) return rr(D.component.subTree);
      if (D.shapeFlag & 128) return D.suspense.next();
      let P = V(D.anchor || D.el),
        q = P && P[ud];
      return q ? V(q) : P;
    },
    xr = !1,
    Mi = (D, P, q) => {
      let ae;
      D == null ? P._vnode && (st(P._vnode, null, null, !0), ae = P._vnode.component) : F(P._vnode || null, D, P, null, null, null, q), P._vnode = D, xr || (xr = !0, Uf(ae), Ts(), xr = !1);
    },
    ir = {
      p: F,
      um: st,
      m: it,
      r: tr,
      mt: Ae,
      mc: X,
      pc: Qe,
      pbc: fe,
      n: rr,
      o: e
    },
    Pi,
    ni;
  return t && ([Pi, ni] = t(ir)), {
    render: Mi,
    hydrate: Pi,
    createApp: M1(Mi, Pi)
  };
}
function Sl({
  type: e,
  props: t
}, n) {
  return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function Ur({
  effect: e,
  job: t
}, n) {
  n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function Ld(e, t) {
  return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function Yl(e, t, n = !1) {
  let i = e.children,
    s = t.children;
  if (_e(i) && _e(s)) for (let l = 0; l < i.length; l++) {
    let u = i[l],
      p = s[l];
    p.shapeFlag & 1 && !p.dynamicChildren && ((p.patchFlag <= 0 || p.patchFlag === 32) && (p = s[l] = Bn(s[l]), p.el = u.el), !n && p.patchFlag !== -2 && Yl(u, p)), p.type === hr && (p.patchFlag === -1 && (p = s[l] = Bn(p)), p.el = u.el), p.type === vt && !p.el && (p.el = u.el);
  }
}
function J1(e) {
  let t = e.slice(),
    n = [0],
    i,
    s,
    l,
    u,
    p,
    g = e.length;
  for (i = 0; i < g; i++) {
    let _ = e[i];
    if (_ !== 0) {
      if (s = n[n.length - 1], e[s] < _) {
        t[i] = s, n.push(i);
        continue;
      }
      for (l = 0, u = n.length - 1; l < u;) p = l + u >> 1, e[n[p]] < _ ? l = p + 1 : u = p;
      _ < e[n[l]] && (l > 0 && (t[i] = n[l - 1]), n[l] = i);
    }
  }
  for (l = n.length, u = n[l - 1]; l-- > 0;) n[l] = u, u = t[u];
  return n;
}
function Fd(e) {
  let t = e.subTree.component;
  if (t) return t.asyncDep && !t.asyncResolved ? t : Fd(t);
}
function $s(e) {
  if (e) for (let t = 0; t < e.length; t++) e[t].flags |= 8;
}
function Ud(e) {
  if (e.placeholder) return e.placeholder;
  let t = e.component;
  return t ? Ud(t.subTree) : null;
}
var Is = e => e.__isSuspense,
  Il = 0,
  Z1 = {
    name: "Suspense",
    __isSuspense: !0,
    process(e, t, n, i, s, l, u, p, g, _) {
      if (e == null) eb(t, n, i, s, l, u, p, g, _);else {
        if (l && l.deps > 0 && !e.suspense.isInFallback) {
          t.suspense = e.suspense, t.suspense.vnode = t, t.el = e.el;
          return;
        }
        tb(e, t, n, i, s, u, p, g, _);
      }
    },
    hydrate: nb,
    normalize: rb
  },
  Q1 = Z1;
function po(e, t) {
  let n = e.props && e.props[t];
  $e(n) && n();
}
function eb(e, t, n, i, s, l, u, p, g) {
  let {
      p: _,
      o: {
        createElement: x
      }
    } = g,
    w = x("div"),
    V = e.suspense = jd(e, s, i, t, w, n, l, u, p, g);
  _(null, V.pendingBranch = e.ssContent, w, null, i, V, l, u), V.deps > 0 ? (po(e, "onPending"), po(e, "onFallback"), _(null, e.ssFallback, t, n, i, null, l, u), Ei(V, e.ssFallback)) : V.resolve(!1, !0);
}
function tb(e, t, n, i, s, l, u, p, {
  p: g,
  um: _,
  o: {
    createElement: x
  }
}) {
  let w = t.suspense = e.suspense;
  w.vnode = t, t.el = e.el;
  let V = t.ssContent,
    $ = t.ssFallback,
    {
      activeBranch: j,
      pendingBranch: F,
      isInFallback: le,
      isHydrating: ue
    } = w;
  if (F) w.pendingBranch = V, On(F, V) ? (g(F, V, w.hiddenContainer, null, s, w, l, u, p), w.deps <= 0 ? w.resolve() : le && (ue || (g(j, $, n, i, s, null, l, u, p), Ei(w, $)))) : (w.pendingId = Il++, ue ? (w.isHydrating = !1, w.activeBranch = F) : _(F, s, w), w.deps = 0, w.effects.length = 0, w.hiddenContainer = x("div"), le ? (g(null, V, w.hiddenContainer, null, s, w, l, u, p), w.deps <= 0 ? w.resolve() : (g(j, $, n, i, s, null, l, u, p), Ei(w, $))) : j && On(j, V) ? (g(j, V, n, i, s, w, l, u, p), w.resolve(!0)) : (g(null, V, w.hiddenContainer, null, s, w, l, u, p), w.deps <= 0 && w.resolve()));else if (j && On(j, V)) g(j, V, n, i, s, w, l, u, p), Ei(w, V);else if (po(t, "onPending"), w.pendingBranch = V, V.shapeFlag & 512 ? w.pendingId = V.component.suspenseId : w.pendingId = Il++, g(null, V, w.hiddenContainer, null, s, w, l, u, p), w.deps <= 0) w.resolve();else {
    let {
      timeout: W,
      pendingId: I
    } = w;
    W > 0 ? setTimeout(() => {
      w.pendingId === I && w.fallback($);
    }, W) : W === 0 && w.fallback($);
  }
}
function jd(e, t, n, i, s, l, u, p, g, _, x = !1) {
  let {
      p: w,
      m: V,
      um: $,
      n: j,
      o: {
        parentNode: F,
        remove: le
      }
    } = _,
    ue,
    W = ib(e);
  W && t && t.pendingBranch && (ue = t.pendingId, t.deps++);
  let I = e.props ? di(e.props.timeout) : void 0,
    z = l,
    L = {
      vnode: e,
      parent: t,
      parentComponent: n,
      namespace: u,
      container: i,
      hiddenContainer: s,
      deps: 0,
      pendingId: Il++,
      timeout: typeof I == "number" ? I : -1,
      activeBranch: null,
      isFallbackMountPending: !1,
      pendingBranch: null,
      isInFallback: !x,
      isHydrating: x,
      isUnmounted: !1,
      effects: [],
      resolve(te = !1, se = !1) {
        let {
            vnode: ee,
            activeBranch: X,
            pendingBranch: Z,
            pendingId: fe,
            effects: J,
            parentComponent: ve,
            container: pe,
            isInFallback: Ae
          } = L,
          ke = !1;
        if (L.isHydrating) L.isHydrating = !1;else if (!te) {
          ke = X && Z.transition && Z.transition.mode === "out-in";
          let Qe = !1;
          ke && (X.transition.afterLeave = () => {
            fe === L.pendingId && (V(Z, pe, l === z && !Qe ? j(X) : l, 0), _i(J), Ae && ee.ssFallback && (ee.ssFallback.el = null));
          }), X && !L.isFallbackMountPending && (F(X.el) === pe && (l = j(X), Qe = !0), $(X, ve, L, !0), !ke && Ae && ee.ssFallback && _t(() => ee.ssFallback.el = null, L)), ke || V(Z, pe, l, 0);
        }
        L.isFallbackMountPending = !1, Ei(L, Z), L.pendingBranch = null, L.isInFallback = !1;
        let Te = L.parent,
          Ce = !1;
        for (; Te;) {
          if (Te.pendingBranch) {
            for (let Qe = 0; Qe < J.length; Qe++) Te.effects.push(J[Qe]);
            Ce = !0;
            break;
          }
          Te = Te.parent;
        }
        !Ce && !ke && _i(J), L.effects = [], W && t && t.pendingBranch && ue === t.pendingId && (t.deps--, t.deps === 0 && !se && t.resolve()), po(ee, "onResolve");
      },
      fallback(te) {
        if (!L.pendingBranch) return;
        let {
          vnode: se,
          activeBranch: ee,
          parentComponent: X,
          container: Z,
          namespace: fe
        } = L;
        po(se, "onFallback");
        let J = j(ee),
          ve = () => {
            L.isFallbackMountPending = !1, L.isInFallback && (w(null, te, Z, J, X, null, fe, p, g), Ei(L, te));
          },
          pe = te.transition && te.transition.mode === "out-in";
        pe && (L.isFallbackMountPending = !0, ee.transition.afterLeave = ve), L.isInFallback = !0, $(ee, X, null, !0), pe || ve();
      },
      move(te, se, ee) {
        L.activeBranch && V(L.activeBranch, te, se, ee), L.container = te;
      },
      next() {
        return L.activeBranch && j(L.activeBranch);
      },
      registerDep(te, se, ee) {
        let X = !!L.pendingBranch;
        X && L.deps++;
        let Z = te.vnode.el;
        te.asyncDep.catch(fe => {
          Gr(fe, te, 0);
        }).then(fe => {
          if (te.isUnmounted || L.isUnmounted || L.pendingId !== te.suspenseId) return;
          go(), te.asyncResolved = !0;
          let {
            vnode: J
          } = te;
          Rl(te, fe, !1), Z && (J.el = Z);
          let ve = !Z && te.subTree.el;
          se(te, J, F(Z || te.subTree.el), Z ? null : j(te.subTree), L, u, ee), ve && (J.placeholder = null, le(ve)), qs(te, J.el), X && --L.deps === 0 && L.resolve();
        });
      },
      unmount(te, se) {
        L.isUnmounted = !0, L.activeBranch && $(L.activeBranch, n, te, se), L.pendingBranch && $(L.pendingBranch, n, te, se);
      }
    };
  return L;
}
function nb(e, t, n, i, s, l, u, p, g) {
  let _ = t.suspense = jd(t, i, n, e.parentNode, document.createElement("div"), null, s, l, u, p, !0),
    x = g(e, _.pendingBranch = t.ssContent, n, _, l, u);
  return _.deps === 0 && _.resolve(!1, !0), x;
}
function rb(e) {
  let {
      shapeFlag: t,
      children: n
    } = e,
    i = t & 32;
  e.ssContent = Qf(i ? n.default : n), e.ssFallback = i ? Qf(n.fallback) : ut(vt);
}
function Qf(e) {
  let t;
  if ($e(e)) {
    let n = Wr && e._c;
    n && (e._d = !1, ho()), e = e(), n && (e._d = !0, t = jt, Gs());
  }
  return _e(e) && (e = U1(e)), e = tn(e), t && !e.dynamicChildren && (e.dynamicChildren = t.filter(n => n !== e)), e;
}
function zd(e, t) {
  t && t.pendingBranch ? _e(e) ? t.effects.push(...e) : t.effects.push(e) : _i(e);
}
function Ei(e, t) {
  e.activeBranch = t;
  let {
      vnode: n,
      parentComponent: i
    } = e,
    s = t.el;
  for (; !s && t.component;) t = t.component.subTree, s = t.el;
  n.el = s, i && i.subTree === n && (i.vnode.el = s, qs(i, s));
}
function ib(e) {
  let t = e.props && e.props.suspensible;
  return t != null && t !== !1;
}
var Ct = Symbol.for("v-fgt"),
  hr = Symbol.for("v-txt"),
  vt = Symbol.for("v-cmt"),
  mr = Symbol.for("v-stc"),
  Wn = [],
  jt = null;
function ho(e = !1) {
  Wn.push(jt = e ? null : []);
}
function Gs() {
  Wn.pop(), jt = Wn[Wn.length - 1] || null;
}
var Wr = 1;
function mo(e, t = !1) {
  Wr += e, e < 0 && jt && t && (jt.hasOnce = !0);
}
function Hd(e) {
  return e.dynamicChildren = Wr > 0 ? jt || Ar : null, Gs(), Wr > 0 && jt && jt.push(e), e;
}
function ob(e, t, n, i, s, l) {
  return Hd(Jl(e, t, n, i, s, l, !0));
}
function Rs(e, t, n, i, s) {
  return Hd(ut(e, t, n, i, s, !0));
}
function Xn(e) {
  return e ? e.__v_isVNode === !0 : !1;
}
function On(e, t) {
  return e.type === t.type && e.key === t.key;
}
var sb;
function ab(e) {
  sb = e;
}
var Bd = ({
    key: e
  }) => e ?? null,
  Ss = ({
    ref: e,
    ref_key: t,
    ref_for: n
  }) => (typeof e == "number" && (e = "" + e), e != null ? Me(e) || dt(e) || $e(e) ? {
    i: Pt,
    r: e,
    k: t,
    f: !!n
  } : e : null);
function Jl(e, t = null, n = null, i = 0, s = null, l = e === Ct ? 0 : 1, u = !1, p = !1) {
  let g = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e,
    props: t,
    key: t && Bd(t),
    ref: t && Ss(t),
    scopeId: Us,
    slotScopeIds: null,
    children: n,
    component: null,
    suspense: null,
    ssContent: null,
    ssFallback: null,
    dirs: null,
    transition: null,
    el: null,
    anchor: null,
    target: null,
    targetStart: null,
    targetAnchor: null,
    staticCount: 0,
    shapeFlag: l,
    patchFlag: i,
    dynamicProps: s,
    dynamicChildren: null,
    appContext: null,
    ctx: Pt
  };
  return p ? (Ms(g, n), l & 128 && e.normalize(g)) : n && (g.shapeFlag |= Me(n) ? 8 : 16), Wr > 0 && !u && jt && (g.patchFlag > 0 || l & 6) && g.patchFlag !== 32 && jt.push(g), g;
}
var ut = lb;
function lb(e, t = null, n = null, i = 0, s = null, l = !1) {
  if ((!e || e === Ed) && (e = vt), Xn(e)) {
    let p = Rn(e, t, !0);
    return n && Ms(p, n), Wr > 0 && !l && jt && (p.shapeFlag & 6 ? jt[jt.indexOf(e)] = p : jt.push(p)), p.patchFlag = -2, p;
  }
  if (gb(e) && (e = e.__vccOpts), t) {
    t = Kd(t);
    let {
      class: p,
      style: g
    } = t;
    p && !Me(p) && (t.class = $r(p)), qe(g) && (Pr(g) && !_e(g) && (g = Ue({}, g)), t.style = Vr(g));
  }
  let u = Me(e) ? 1 : Is(e) ? 128 : js(e) ? 64 : qe(e) ? 4 : $e(e) ? 2 : 0;
  return Jl(e, t, n, i, s, u, l, !0);
}
function Kd(e) {
  return e ? Pr(e) || Dd(e) ? Ue({}, e) : e : null;
}
function Rn(e, t, n = !1, i = !1) {
  let {
      props: s,
      ref: l,
      patchFlag: u,
      children: p,
      transition: g
    } = e,
    _ = t ? Xd(s || {}, t) : s,
    x = {
      __v_isVNode: !0,
      __v_skip: !0,
      type: e.type,
      props: _,
      key: _ && Bd(_),
      ref: t && t.ref ? n && l ? _e(l) ? l.concat(Ss(t)) : [l, Ss(t)] : Ss(t) : l,
      scopeId: e.scopeId,
      slotScopeIds: e.slotScopeIds,
      children: p,
      target: e.target,
      targetStart: e.targetStart,
      targetAnchor: e.targetAnchor,
      staticCount: e.staticCount,
      shapeFlag: e.shapeFlag,
      patchFlag: t && e.type !== Ct ? u === -1 ? 16 : u | 16 : u,
      dynamicProps: e.dynamicProps,
      dynamicChildren: e.dynamicChildren,
      appContext: e.appContext,
      dirs: e.dirs,
      transition: g,
      component: e.component,
      suspense: e.suspense,
      ssContent: e.ssContent && Rn(e.ssContent),
      ssFallback: e.ssFallback && Rn(e.ssFallback),
      placeholder: e.placeholder,
      el: e.el,
      anchor: e.anchor,
      ctx: e.ctx,
      ce: e.ce
    };
  return g && i && In(x, g.clone(x)), x;
}
function Zl(e = " ", t = 0) {
  return ut(hr, null, e, t);
}
function cb(e, t) {
  let n = ut(mr, null, e);
  return n.staticCount = t, n;
}
function Wd(e = "", t = !1) {
  return t ? (ho(), Rs(vt, null, e)) : ut(vt, null, e);
}
function tn(e) {
  return e == null || typeof e == "boolean" ? ut(vt) : _e(e) ? ut(Ct, null, e.slice()) : Xn(e) ? Bn(e) : ut(hr, null, String(e));
}
function Bn(e) {
  return e.el === null && e.patchFlag !== -1 || e.memo ? e : Rn(e);
}
function Ms(e, t) {
  let n = 0,
    {
      shapeFlag: i
    } = e;
  if (t == null) t = null;else if (_e(t)) n = 16;else if (typeof t == "object") {
    if (i & 65) {
      let s = t.default;
      s && (s._c && (s._d = !1), Ms(e, s()), s._c && (s._d = !0));
      return;
    } else {
      n = 32;
      let s = t._;
      !s && !Dd(t) ? t._ctx = Pt : s === 3 && Pt && (Pt.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
    }
  } else if ($e(t)) {
    if (i & 65) {
      Ms(e, {
        default: t
      });
      return;
    }
    t = {
      default: t,
      _ctx: Pt
    }, n = 32;
  } else t = String(t), i & 64 ? (n = 16, t = [Zl(t)]) : n = 8;
  e.children = t, e.shapeFlag |= n;
}
function Xd(...e) {
  let t = {};
  for (let n = 0; n < e.length; n++) {
    let i = e[n];
    for (let s in i) if (s === "class") t.class !== i.class && (t.class = $r([t.class, i.class]));else if (s === "style") t.style = Vr([t.style, i.style]);else if (Tn(s)) {
      let l = t[s],
        u = i[s];
      u && l !== u && !(_e(l) && l.includes(u)) ? t[s] = l ? [].concat(l, u) : u : u == null && l == null && !li(s) && (t[s] = u);
    } else s !== "" && (t[s] = i[s]);
  }
  return t;
}
function en(e, t, n, i = null) {
  nn(e, t, 7, [n, i]);
}
var ub = xd(),
  fb = 0;
function qd(e, t, n) {
  let i = e.type,
    s = (t ? t.appContext : e.appContext) || ub,
    l = {
      uid: fb++,
      vnode: e,
      type: i,
      parent: t,
      appContext: s,
      root: null,
      next: null,
      subTree: null,
      effect: null,
      update: null,
      job: null,
      scope: new Rr(!0),
      render: null,
      proxy: null,
      exposed: null,
      exposeProxy: null,
      withProxy: null,
      provides: t ? t.provides : Object.create(s.provides),
      ids: t ? t.ids : ["", 0, 0],
      accessCache: null,
      renderCache: [],
      components: null,
      directives: null,
      propsOptions: $d(i, s),
      emitsOptions: Od(i, s),
      emit: null,
      emitted: null,
      propsDefaults: Be,
      inheritAttrs: i.inheritAttrs,
      ctx: Be,
      data: Be,
      props: Be,
      attrs: Be,
      slots: Be,
      refs: Be,
      setupState: Be,
      setupContext: null,
      suspense: n,
      suspenseId: n ? n.pendingId : 0,
      asyncDep: null,
      asyncResolved: !1,
      isMounted: !1,
      isUnmounted: !1,
      isDeactivated: !1,
      bc: null,
      c: null,
      bm: null,
      m: null,
      bu: null,
      u: null,
      um: null,
      bum: null,
      da: null,
      a: null,
      rtg: null,
      rtc: null,
      ec: null,
      sp: null
    };
  return l.ctx = {
    _: l
  }, l.root = t ? t.root : l, l.emit = L1.bind(null, l), e.ce && e.ce(l), l;
}
var Mt = null,
  zt = () => Mt || Pt,
  Ps,
  gr;
{
  let e = Xi(),
    t = (n, i) => {
      let s;
      return (s = e[n]) || (s = e[n] = []), s.push(i), l => {
        s.length > 1 ? s.forEach(u => u(l)) : s[0](l);
      };
    };
  Ps = t("__VUE_INSTANCE_SETTERS__", n => Mt = n), gr = t("__VUE_SSR_SETTERS__", n => Xr = n);
}
var Oi = e => {
    let t = Mt;
    return Ps(e), e.scope.on(), () => {
      e.scope.off(), Ps(t);
    };
  },
  go = () => {
    Mt && Mt.scope.off(), Ps(null);
  };
function Gd(e) {
  return e.vnode.shapeFlag & 4;
}
var Xr = !1;
function Yd(e, t = !1, n = !1) {
  t && gr(t);
  let {
      props: i,
      children: s
    } = e.vnode,
    l = Gd(e);
  B1(e, i, l, t), q1(e, s, n || t);
  let u = l ? db(e, t) : void 0;
  return t && gr(!1), u;
}
function db(e, t) {
  let n = e.type;
  e.accessCache = Object.create(null), e.proxy = new Proxy(e.ctx, Al);
  let {
    setup: i
  } = n;
  if (i) {
    gn();
    let s = e.setupContext = i.length > 1 ? Qd(e) : null,
      l = Oi(e),
      u = qr(i, e, 0, [e.props, s]),
      p = ts(u);
    if (vn(), l(), (p || e.sp) && !Kn(e) && Ul(e), p) {
      if (u.then(go, go), t) return u.then(g => {
        gr(!0);
        try {
          Rl(e, g, t);
        } finally {
          gr(!1);
        }
      }).catch(g => {
        Gr(g, e, 0);
      });
      e.asyncDep = u;
    } else Rl(e, u, t);
  } else Zd(e, t);
}
function Rl(e, t, n) {
  $e(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : qe(t) && (e.setupState = no(t)), Zd(e, n);
}
var Ls, Ml;
function Ql(e) {
  Ls = e, Ml = t => {
    t.render._rc && (t.withProxy = new Proxy(t.ctx, g1));
  };
}
var Jd = () => !Ls;
function Zd(e, t, n) {
  let i = e.type;
  if (!e.render) {
    if (!t && Ls && !i.render) {
      let s = i.template || Kl(e).template;
      if (s) {
        let {
            isCustomElement: l,
            compilerOptions: u
          } = e.appContext.config,
          {
            delimiters: p,
            compilerOptions: g
          } = i,
          _ = Ue(Ue({
            isCustomElement: l,
            delimiters: p
          }, u), g);
        i.render = Ls(s, _);
      }
    }
    e.render = i.render || ht, Ml && Ml(e);
  }
  {
    let s = Oi(e);
    gn();
    try {
      A1(e);
    } finally {
      vn(), s();
    }
  }
}
var pb = {
  get(e, t) {
    return Rt(e, "get", ""), e[t];
  }
};
function Qd(e) {
  let t = n => {
    e.exposed = n || {};
  };
  return {
    attrs: new Proxy(e.attrs, pb),
    slots: e.slots,
    emit: e.emit,
    expose: t
  };
}
function Eo(e) {
  return e.exposed ? e.exposeProxy || (e.exposeProxy = new Proxy(no(gs(e.exposed)), {
    get(t, n) {
      if (n in t) return t[n];
      if (n in lo) return lo[n](e);
    },
    has(t, n) {
      return n in t || n in lo;
    }
  })) : e.proxy;
}
var hb = /(?:^|[-_])\w/g,
  mb = e => e.replace(hb, t => t.toUpperCase()).replace(/[-_]/g, "");
function Fs(e, t = !0) {
  return $e(e) ? e.displayName || e.name : e.name || t && e.__name;
}
function ep(e, t, n = !1) {
  let i = Fs(t);
  if (!i && t.__file) {
    let s = t.__file.match(/([^/\\]+)\.\w+$/);
    s && (i = s[1]);
  }
  if (!i && e) {
    let s = l => {
      for (let u in l) if (l[u] === t) return u;
    };
    i = s(e.components) || e.parent && s(e.parent.type.components) || s(e.appContext.components);
  }
  return i ? mb(i) : n ? "App" : "Anonymous";
}
function gb(e) {
  return $e(e) && "__vccOpts" in e;
}
var tp = (e, t) => If(e, t, Xr);
function ec(e, t, n) {
  try {
    mo(-1);
    let i = arguments.length;
    return i === 2 ? qe(t) && !_e(t) ? Xn(t) ? ut(e, null, [t]) : ut(e, t) : ut(e, null, t) : (i > 3 ? n = Array.prototype.slice.call(arguments, 2) : i === 3 && Xn(n) && (n = [n]), ut(e, t, n));
  } finally {
    mo(1);
  }
}
function np() {
  return;
  function l(w) {
    let V = [];
    w.type.props && w.props && V.push(u("props", Xe(w.props))), w.setupState !== Be && V.push(u("setup", w.setupState)), w.data !== Be && V.push(u("data", Xe(w.data)));
    let $ = g(w, "computed");
    $ && V.push(u("computed", $));
    let j = g(w, "inject");
    return j && V.push(u("injected", j)), V.push(["div", {}, ["span", {
      style: i.style + ";opacity:0.66"
    }, "$ (internal): "], ["object", {
      object: w
    }]]), V;
  }
  function u(w, V) {
    return V = Ue({}, V), Object.keys(V).length ? ["div", {
      style: "line-height:1.25em;margin-bottom:0.6em"
    }, ["div", {
      style: "color:#476582"
    }, w], ["div", {
      style: "padding-left:1.25em"
    }, ...Object.keys(V).map($ => ["div", {}, ["span", i, $ + ": "], p(V[$], !1)])]] : ["span", {}];
  }
  function p(w, V = !0) {
    return typeof w == "number" ? ["span", t, w] : typeof w == "string" ? ["span", n, JSON.stringify(w)] : typeof w == "boolean" ? ["span", i, w] : qe(w) ? ["object", {
      object: V ? Xe(w) : w
    }] : ["span", n, String(w)];
  }
  function g(w, V) {
    let $ = w.type;
    if ($e($)) return;
    let j = {};
    for (let F in w.ctx) _($, F, V) && (j[F] = w.ctx[F]);
    return j;
  }
  function _(w, V, $) {
    let j = w[$];
    if (_e(j) && j.includes(V) || qe(j) && V in j || w.extends && _(w.extends, V, $) || w.mixins && w.mixins.some(F => _(F, V, $))) return !0;
  }
  function x(w) {
    return Tt(w) ? "ShallowRef" : w.effect ? "ComputedRef" : "Ref";
  }
}
function vb(e, t, n, i) {
  let s = n[i];
  if (s && rp(s, e)) return s;
  let l = t();
  return l.memo = e.slice(), l.cacheIndex = i, n[i] = l;
}
function rp(e, t) {
  let n = e.memo;
  if (n.length != t.length) return !1;
  for (let i = 0; i < n.length; i++) if (Et(n[i], t[i])) return !1;
  return Wr > 0 && jt && jt.push(e), !0;
}
var ip = "3.5.41",
  Ys = ht,
  bb = Ev,
  yb = bi,
  wb = id,
  kb = {
    createComponentInstance: qd,
    setupComponent: Yd,
    renderComponentRoot: xs,
    setCurrentRenderingInstance: uo,
    isVNode: Xn,
    normalizeVNode: tn,
    getComponentPublicInstance: Eo,
    ensureValidVNode: Bl,
    pushWarningContext: hv,
    popWarningContext: mv
  },
  Eb = kb,
  _b = null,
  Nb = null,
  xb = null;
var oc,
  op = typeof window < "u" && window.trustedTypes;
if (op) try {
  oc = op.createPolicy("vue", {
    createHTML: e => e
  });
} catch {}
var Sp = oc ? e => oc.createHTML(e) : e => e,
  Sb = "http://www.w3.org/2000/svg",
  Ob = "http://www.w3.org/1998/Math/MathML",
  Gn = typeof document < "u" ? document : null,
  sp = Gn && Gn.createElement("template"),
  Op = {
    insert: (e, t, n) => {
      t.insertBefore(e, n || null);
    },
    remove: e => {
      let t = e.parentNode;
      t && t.removeChild(e);
    },
    createElement: (e, t, n, i) => {
      let s = t === "svg" ? Gn.createElementNS(Sb, e) : t === "mathml" ? Gn.createElementNS(Ob, e) : n ? Gn.createElement(e, {
        is: n
      }) : Gn.createElement(e);
      return e === "select" && i && i.multiple != null && s.setAttribute("multiple", i.multiple), s;
    },
    createText: e => Gn.createTextNode(e),
    createComment: e => Gn.createComment(e),
    setText: (e, t) => {
      e.nodeValue = t;
    },
    setElementText: (e, t) => {
      e.textContent = t;
    },
    parentNode: e => e.parentNode,
    nextSibling: e => e.nextSibling,
    querySelector: e => Gn.querySelector(e),
    setScopeId(e, t) {
      e.setAttribute(t, "");
    },
    insertStaticContent(e, t, n, i, s, l) {
      let u = n ? n.previousSibling : t.lastChild;
      if (s && (s === l || s.nextSibling)) for (; t.insertBefore(s.cloneNode(!0), n), !(s === l || !(s = s.nextSibling)););else {
        sp.innerHTML = Sp(i === "svg" ? `<svg>${e}</svg>` : i === "mathml" ? `<math>${e}</math>` : e);
        let p = sp.content;
        if (i === "svg" || i === "mathml") {
          let g = p.firstChild;
          for (; g.firstChild;) p.appendChild(g.firstChild);
          p.removeChild(g);
        }
        t.insertBefore(p, n);
      }
      return [u ? u.nextSibling : t.firstChild, n ? n.previousSibling : t.lastChild];
    }
  },
  vr = "transition",
  _o = "animation",
  Ti = Symbol("_vtc"),
  Tp = {
    name: String,
    type: String,
    css: {
      type: Boolean,
      default: !0
    },
    duration: [String, Number, Object],
    enterFromClass: String,
    enterActiveClass: String,
    enterToClass: String,
    appearFromClass: String,
    appearActiveClass: String,
    appearToClass: String,
    leaveFromClass: String,
    leaveActiveClass: String,
    leaveToClass: String
  },
  Cp = Ue({}, Hs, Tp),
  Tb = e => (e.displayName = "Transition", e.props = Cp, e),
  Cb = Tb((e, {
    slots: t
  }) => ec(Fl, Ap(e), t)),
  Yr = (e, t = []) => {
    _e(e) ? e.forEach(n => n(...t)) : e && e(...t);
  },
  ap = e => e ? _e(e) ? e.some(t => t.length > 1) : e.length > 1 : !1;
function Ap(e) {
  let t = {};
  for (let J in e) J in Tp || (t[J] = e[J]);
  if (e.css === !1) return t;
  let {
      name: n = "v",
      type: i,
      duration: s,
      enterFromClass: l = `${n}-enter-from`,
      enterActiveClass: u = `${n}-enter-active`,
      enterToClass: p = `${n}-enter-to`,
      appearFromClass: g = l,
      appearActiveClass: _ = u,
      appearToClass: x = p,
      leaveFromClass: w = `${n}-leave-from`,
      leaveActiveClass: V = `${n}-leave-active`,
      leaveToClass: $ = `${n}-leave-to`
    } = e,
    j = Ab(s),
    F = j && j[0],
    le = j && j[1],
    {
      onBeforeEnter: ue,
      onEnter: W,
      onEnterCancelled: I,
      onLeave: z,
      onLeaveCancelled: L,
      onBeforeAppear: te = ue,
      onAppear: se = W,
      onAppearCancelled: ee = I
    } = t,
    X = (J, ve, pe, Ae) => {
      J._enterCancelled = Ae, br(J, ve ? x : p), br(J, ve ? _ : u), pe && pe();
    },
    Z = (J, ve) => {
      J._isLeaving = !1, br(J, w), br(J, $), br(J, V), ve && ve();
    },
    fe = J => (ve, pe) => {
      let Ae = J ? se : W,
        ke = () => X(ve, J, pe);
      Yr(Ae, [ve, ke]), lp(() => {
        br(ve, J ? g : l), Mn(ve, J ? x : p), ap(Ae) || cp(ve, i, F, ke);
      });
    };
  return Ue(t, {
    onBeforeEnter(J) {
      Yr(ue, [J]), Mn(J, l), Mn(J, u);
    },
    onBeforeAppear(J) {
      Yr(te, [J]), Mn(J, g), Mn(J, _);
    },
    onEnter: fe(!1),
    onAppear: fe(!0),
    onLeave(J, ve) {
      J._isLeaving = !0;
      let pe = () => Z(J, ve);
      Mn(J, w), J._enterCancelled ? (Mn(J, V), sc(J)) : (sc(J), Mn(J, V)), lp(() => {
        J._isLeaving && (br(J, w), Mn(J, $), ap(z) || cp(J, i, le, pe));
      }), Yr(z, [J, pe]);
    },
    onEnterCancelled(J) {
      X(J, !1, void 0, !0), Yr(I, [J]);
    },
    onAppearCancelled(J) {
      X(J, !0, void 0, !0), Yr(ee, [J]);
    },
    onLeaveCancelled(J) {
      Z(J), Yr(L, [J]);
    }
  });
}
function Ab(e) {
  if (e == null) return null;
  if (qe(e)) return [tc(e.enter), tc(e.leave)];
  {
    let t = tc(e);
    return [t, t];
  }
}
function tc(e) {
  return di(e);
}
function Mn(e, t) {
  t.split(/\s+/).forEach(n => n && e.classList.add(n)), (e[Ti] || (e[Ti] = new Set())).add(t);
}
function br(e, t) {
  t.split(/\s+/).forEach(i => i && e.classList.remove(i));
  let n = e[Ti];
  n && (n.delete(t), n.size || (e[Ti] = void 0));
}
function lp(e) {
  requestAnimationFrame(() => {
    requestAnimationFrame(e);
  });
}
var Db = 0;
function cp(e, t, n, i) {
  let s = e._endId = ++Db,
    l = () => {
      s === e._endId && i();
    };
  if (n != null) return setTimeout(l, n);
  let {
    type: u,
    timeout: p,
    propCount: g
  } = Dp(e, t);
  if (!u) return i();
  let _ = u + "end",
    x = 0,
    w = () => {
      e.removeEventListener(_, V), l();
    },
    V = $ => {
      $.target === e && ++x >= g && w();
    };
  setTimeout(() => {
    x < g && w();
  }, p + 1), e.addEventListener(_, V);
}
function Dp(e, t) {
  let n = window.getComputedStyle(e),
    i = j => (n[j] || "").split(", "),
    s = i(`${vr}Delay`),
    l = i(`${vr}Duration`),
    u = up(s, l),
    p = i(`${_o}Delay`),
    g = i(`${_o}Duration`),
    _ = up(p, g),
    x = null,
    w = 0,
    V = 0;
  t === vr ? u > 0 && (x = vr, w = u, V = l.length) : t === _o ? _ > 0 && (x = _o, w = _, V = g.length) : (w = Math.max(u, _), x = w > 0 ? u > _ ? vr : _o : null, V = x ? x === vr ? l.length : g.length : 0);
  let $ = x === vr && /\b(?:transform|all)(?:,|$)/.test(i(`${vr}Property`).toString());
  return {
    type: x,
    timeout: w,
    propCount: V,
    hasTransform: $
  };
}
function up(e, t) {
  for (; e.length < t.length;) e = e.concat(e);
  return Math.max(...t.map((n, i) => fp(n) + fp(e[i])));
}
function fp(e) {
  return e === "auto" ? 0 : Number(e.slice(0, -1).replace(",", ".")) * 1e3;
}
function sc(e) {
  return (e ? e.ownerDocument : document).body.offsetHeight;
}
function Vb(e, t, n) {
  let i = e[Ti];
  i && (t = (t ? [t, ...i] : [...i]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t;
}
var Qs = Symbol("_vod"),
  lc = Symbol("_vsh"),
  Vp = {
    name: "show",
    beforeMount(e, {
      value: t
    }, {
      transition: n
    }) {
      e[Qs] = e.style.display === "none" ? "" : e.style.display, n && t ? n.beforeEnter(e) : No(e, t);
    },
    mounted(e, {
      value: t
    }, {
      transition: n
    }) {
      n && t && n.enter(e);
    },
    updated(e, {
      value: t,
      oldValue: n
    }, {
      transition: i
    }) {
      !t != !n && (i ? t ? (i.beforeEnter(e), No(e, !0), i.enter(e)) : i.leave(e, () => {
        No(e, !1);
      }) : No(e, t));
    },
    beforeUnmount(e, {
      value: t
    }) {
      No(e, t);
    }
  };
function No(e, t) {
  e.style.display = t ? e[Qs] : "none", e[lc] = !t;
}
function $b() {
  Vp.getSSRProps = ({
    value: e
  }) => {
    if (!e) return {
      style: {
        display: "none"
      }
    };
  };
}
var $p = Symbol("");
function Ib(e) {
  let t = zt();
  if (!t) return;
  let n = t.ut = (s = e(t.proxy)) => {
      Array.from(document.querySelectorAll(`[data-v-owner="${t.uid}"]`)).forEach(l => ea(l, s));
    },
    i = () => {
      let s = e(t.proxy);
      t.ce ? ea(t.ce, s) : ac(t.subTree, s), n(s);
    };
  Ks(() => {
    _i(i);
  }), xi(() => {
    Hr(i, ht, {
      flush: "post"
    });
    let s = new MutationObserver(i);
    s.observe(t.subTree.el.parentNode, {
      childList: !0
    }), Si(() => s.disconnect());
  });
}
function ac(e, t) {
  if (e.shapeFlag & 128) {
    let n = e.suspense;
    e = n.activeBranch, n.pendingBranch && !n.isHydrating && n.effects.push(() => {
      ac(n.activeBranch, t);
    });
  }
  for (; e.component;) e = e.component.subTree;
  if (e.shapeFlag & 1 && e.el) ea(e.el, t);else if (e.type === Ct) e.children.forEach(n => ac(n, t));else if (e.type === mr) {
    let {
      el: n,
      anchor: i
    } = e;
    for (; n && (ea(n, t), n !== i);) n = n.nextSibling;
  }
}
function ea(e, t) {
  if (e.nodeType === 1) {
    let n = e.style,
      i = "";
    for (let s in t) {
      let l = il(t[s]);
      n.setProperty(`--${s}`, l), i += `--${s}: ${l};`;
    }
    n[$p] = i;
  }
}
var Rb = /(?:^|;)\s*display\s*:/;
function Mb(e, t, n) {
  let i = e.style,
    s = Me(n),
    l = !1;
  if (n && !s) {
    if (t) if (Me(t)) for (let u of t.split(";")) {
      let p = u.slice(0, u.indexOf(":")).trim();
      n[p] == null && xo(i, p, "");
    } else for (let u in t) n[u] == null && xo(i, u, "");
    for (let u in n) {
      u === "display" && (l = !0);
      let p = n[u];
      p != null ? Lb(e, u, !Me(t) && t ? t[u] : void 0, p) || xo(i, u, p) : xo(i, u, "");
    }
  } else if (s) {
    if (t !== n) {
      let u = i[$p];
      u && (n += ";" + u), i.cssText = n, l = Rb.test(n);
    }
  } else t && e.removeAttribute("style");
  Qs in e && (e[Qs] = l ? i.display : "", e[lc] && (i.display = "none"));
}
var dp = /\s*!important$/;
function xo(e, t, n) {
  if (_e(n)) n.forEach(i => xo(e, t, i));else if (n == null && (n = ""), t.startsWith("--")) e.setProperty(t, n);else {
    let i = Pb(e, t);
    dp.test(n) ? e.setProperty(Ut(i), n.replace(dp, ""), "important") : e[i] = n;
  }
}
var pp = ["Webkit", "Moz", "ms"],
  nc = {};
function Pb(e, t) {
  let n = nc[t];
  if (n) return n;
  let i = Ze(t);
  if (i !== "filter" && i in e) return nc[t] = i;
  i = pn(i);
  for (let s = 0; s < pp.length; s++) {
    let l = pp[s] + i;
    if (l in e) return nc[t] = l;
  }
  return t;
}
function Lb(e, t, n, i) {
  return e.tagName === "TEXTAREA" && (t === "width" || t === "height") && Me(i) && n === i;
}
var hp = "http://www.w3.org/1999/xlink";
function mp(e, t, n, i, s, l = sf(t)) {
  i && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(hp, t.slice(6, t.length)) : e.setAttributeNS(hp, t, n) : n == null || l && !is(n) ? e.removeAttribute(t) : e.setAttribute(t, l ? "" : kt(n) ? String(n) : n);
}
function gp(e, t, n, i, s) {
  if (t === "innerHTML" || t === "textContent") {
    n != null && (e[t] = t === "innerHTML" ? Sp(n) : n);
    return;
  }
  let l = e.tagName;
  if (t === "value" && l !== "PROGRESS" && !l.includes("-")) {
    let p = l === "OPTION" ? e.getAttribute("value") || "" : e.value,
      g = n == null ? e.type === "checkbox" ? "on" : "" : String(n);
    (p !== g || !("_value" in e)) && (e.value = g), n == null && e.removeAttribute(t), e._value = n;
    return;
  }
  let u = !1;
  if (n === "" || n == null) {
    let p = typeof e[t];
    p === "boolean" ? n = is(n) : n == null && p === "string" ? (n = "", u = !0) : p === "number" && (n = 0, u = !0);
  }
  try {
    e[t] = n;
  } catch {}
  u && e.removeAttribute(s || t);
}
function Yn(e, t, n, i) {
  e.addEventListener(t, n, i);
}
function Fb(e, t, n, i) {
  e.removeEventListener(t, n, i);
}
var vp = Symbol("_vei");
function Ub(e, t, n, i, s = null) {
  let l = e[vp] || (e[vp] = {}),
    u = l[t];
  if (i && u) u.value = i;else {
    let [p, g] = Hb(t);
    if (i) {
      let _ = l[t] = Wb(i, s);
      Yn(e, p, _, g);
    } else u && (Fb(e, p, u, g), l[t] = void 0);
  }
}
var jb = /(Once|Passive|Capture)$/,
  zb = /^on:?(?:Once|Passive|Capture)$/;
function Hb(e) {
  let t, n;
  for (; (n = e.match(jb)) && !zb.test(e);) t || (t = {}), e = e.slice(0, e.length - n[1].length), t[n[1].toLowerCase()] = !0;
  return [e[2] === ":" ? e.slice(3) : Ut(e.slice(2)), t];
}
var rc = 0,
  Bb = Promise.resolve(),
  Kb = () => rc || (Bb.then(() => rc = 0), rc = Date.now());
function Wb(e, t) {
  let n = i => {
    if (!i._vts) i._vts = Date.now();else if (i._vts <= n.attached) return;
    let s = n.value;
    if (_e(s)) {
      let l = i.stopImmediatePropagation;
      i.stopImmediatePropagation = () => {
        l.call(i), i._stopped = !0;
      };
      let u = s.slice(),
        p = [i];
      for (let g = 0; g < u.length && !i._stopped; g++) {
        let _ = u[g];
        _ && nn(_, t, 5, p);
      }
    } else nn(s, t, 5, [i]);
  };
  return n.value = e, n.attached = Kb(), n;
}
var bp = e => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123,
  Ip = (e, t, n, i, s, l) => {
    let u = s === "svg";
    t === "class" ? Vb(e, i, u) : t === "style" ? Mb(e, n, i) : Tn(t) ? li(t) || Ub(e, t, n, i, l) : (t[0] === "." ? (t = t.slice(1), !0) : t[0] === "^" ? (t = t.slice(1), !1) : Xb(e, t, i, u)) ? (gp(e, t, i), !e.tagName.includes("-") && (t === "value" || t === "checked" || t === "selected") && mp(e, t, i, u, l, t !== "value")) : e._isVueCE && (qb(e, t) || e._def.__asyncLoader && (/[A-Z]/.test(t) || !Me(i))) ? gp(e, Ze(t), i, l, t) : (t === "true-value" ? e._trueValue = i : t === "false-value" && (e._falseValue = i), mp(e, t, i, u));
  };
function Xb(e, t, n, i) {
  if (i) return !!(t === "innerHTML" || t === "textContent" || t in e && bp(t) && $e(n));
  if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "sandbox" && e.tagName === "IFRAME" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA") return !1;
  if (t === "width" || t === "height") {
    let s = e.tagName;
    if (s === "IMG" || s === "VIDEO" || s === "CANVAS" || s === "SOURCE") return !1;
  }
  return bp(t) && Me(n) ? !1 : t in e;
}
function qb(e, t) {
  let n = e._def.props;
  if (!n) return !1;
  let i = Ze(t);
  return Array.isArray(n) ? n.some(s => Ze(s) === i) : Object.keys(n).some(s => Ze(s) === i);
}
var yp = {};
function Rp(e, t, n) {
  let i = defineComponent(e, t);
  ui(i) && (i = Ue({}, i, t));
  class s extends ta {
    constructor(u) {
      super(i, u, n);
    }
  }
  return s.def = i, s;
}
var Gb = (e, t) => Rp(e, t, qp),
  Yb = typeof HTMLElement < "u" ? HTMLElement : class {},
  ta = class e extends Yb {
    constructor(t, n = {}, i = createApp) {
      super(), this._def = t, this._props = n, this._createApp = i, this._isVueCE = !0, this._instance = null, this._app = null, this._nonce = this._def.nonce, this._connected = !1, this._resolved = !1, this._patching = !1, this._dirty = !1, this._numberProps = null, this._styleChildren = new WeakSet(), this._styleAnchors = new WeakMap(), this._ob = null, this.shadowRoot && i !== createApp ? this._root = this.shadowRoot : t.shadowRoot !== !1 ? (this.attachShadow(Ue({}, t.shadowRootOptions, {
        mode: "open"
      })), this._root = this.shadowRoot) : this._root = this;
    }
    connectedCallback() {
      if (!this.isConnected) return;
      !this.shadowRoot && !this._resolved && this._parseSlots(), this._connected = !0;
      let t = this;
      for (; t = t && (t.assignedSlot || t.parentNode || t.host);) if (t instanceof e) {
        this._parent = t;
        break;
      }
      this._instance || (this._resolved ? this._mount(this._def) : t && t._pendingResolve ? this._pendingResolve = t._pendingResolve.then(() => {
        if (this._pendingResolve = void 0, this.isConnected) return this._resolveDef();
      }) : this._resolveDef());
    }
    _setParent(t = this._parent) {
      t && (this._instance.parent = t._instance, this._inheritParentContext(t));
    }
    _inheritParentContext(t = this._parent) {
      t && this._app && Object.setPrototypeOf(this._app._context.provides, t._instance.provides);
    }
    disconnectedCallback() {
      this._connected = !1, vo(() => {
        this._connected || (this._ob && (this._ob.disconnect(), this._ob = null), this._app && this._app.unmount(), this._instance && (this._instance.ce = void 0), this._app = this._instance = null, this._teleportTargets && (this._teleportTargets.clear(), this._teleportTargets = void 0));
      });
    }
    _processMutations(t) {
      for (let n of t) this._setAttr(n.attributeName);
    }
    _resolveDef() {
      if (this._pendingResolve) return this._pendingResolve;
      for (let i = 0; i < this.attributes.length; i++) this._setAttr(this.attributes[i].name);
      this._ob = new MutationObserver(this._processMutations.bind(this)), this._ob.observe(this, {
        attributes: !0
      });
      let t = (i, s = !1) => {
          this._resolved = !0, this._pendingResolve = void 0;
          let {
              props: l,
              styles: u
            } = i,
            p;
          if (l && !_e(l)) for (let g in l) {
            let _ = l[g];
            (_ === Number || _ && _.type === Number) && (g in this._props && (this._props[g] = di(this._props[g])), (p || (p = Object.create(null)))[Ze(g)] = !0);
          }
          this._numberProps = p, this._resolveProps(i), this.shadowRoot && this._applyStyles(u), this._mount(i);
        },
        n = this._def.__asyncLoader;
      if (n) return this._pendingResolve = n().then(i => {
        i.configureApp = this._def.configureApp, t(this._def = i, !0);
      }), this._pendingResolve;
      t(this._def);
    }
    _mount(t) {
      this._app = this._createApp(t), this._inheritParentContext(), t.configureApp && t.configureApp(this._app), this._app._ceVNode = this._createVNode(), this._app.mount(this._root);
      let n = this._instance && this._instance.exposed;
      if (n) for (let i in n) Je(this, i) || Object.defineProperty(this, i, {
        get: () => Fr(n[i])
      });
    }
    _resolveProps(t) {
      let {
          props: n
        } = t,
        i = _e(n) ? n : Object.keys(n || {});
      for (let s of Object.keys(this)) s[0] !== "_" && i.includes(s) && this._setProp(s, this[s]);
      for (let s of i.map(Ze)) Object.defineProperty(this, s, {
        get() {
          return this._getProp(s);
        },
        set(l) {
          this._setProp(s, l, !0, !this._patching);
        }
      });
    }
    _setAttr(t) {
      if (t.startsWith("data-v-")) return;
      let n = this.hasAttribute(t),
        i = n ? this.getAttribute(t) : yp,
        s = Ze(t);
      n && this._numberProps && this._numberProps[s] && (i = di(i)), this._setProp(s, i, !1, !0);
    }
    _getProp(t) {
      return this._props[t];
    }
    _setProp(t, n, i = !0, s = !1) {
      if (n !== this._props[t] && (this._dirty = !0, n === yp ? delete this._props[t] : (this._props[t] = n, t === "key" && this._app && (this._app._ceVNode.key = n)), s && this._instance && this._update(), i)) {
        let l = this._ob;
        l && (this._processMutations(l.takeRecords()), l.disconnect()), n === !0 ? this.setAttribute(Ut(t), "") : typeof n == "string" || typeof n == "number" ? this.setAttribute(Ut(t), n + "") : n || this.removeAttribute(Ut(t)), l && l.observe(this, {
          attributes: !0
        });
      }
    }
    _update() {
      let t = this._createVNode();
      this._app && (t.appContext = this._app._context), Xp(t, this._root);
    }
    _createVNode() {
      let t = {};
      this.shadowRoot || (t.onVnodeMounted = t.onVnodeUpdated = this._renderSlots.bind(this));
      let n = ut(this._def, Ue(t, this._props));
      return this._instance || (n.ce = i => {
        this._instance = i, i.ce = this, i.isCE = !0;
        let s = (l, u) => {
          this.dispatchEvent(new CustomEvent(l, ui(u[0]) ? Ue({
            detail: u
          }, u[0]) : {
            detail: u
          }));
        };
        i.emit = (l, ...u) => {
          s(l, u), Ut(l) !== l && s(Ut(l), u);
        }, this._setParent();
      }), n;
    }
    _applyStyles(t, n, i) {
      if (!t) return;
      if (n) {
        if (n === this._def || this._styleChildren.has(n)) return;
        this._styleChildren.add(n);
      }
      let s = this._nonce,
        l = this.shadowRoot,
        u = i ? this._getStyleAnchor(i) || this._getStyleAnchor(this._def) : this._getRootStyleInsertionAnchor(l),
        p = null;
      for (let g = t.length - 1; g >= 0; g--) {
        let _ = document.createElement("style");
        s && _.setAttribute("nonce", s), _.textContent = t[g], l.insertBefore(_, p || u), p = _, g === 0 && (i || this._styleAnchors.set(this._def, _), n && this._styleAnchors.set(n, _));
      }
    }
    _getStyleAnchor(t) {
      if (!t) return null;
      let n = this._styleAnchors.get(t);
      return n && n.parentNode === this.shadowRoot ? n : (n && this._styleAnchors.delete(t), null);
    }
    _getRootStyleInsertionAnchor(t) {
      for (let n = 0; n < t.childNodes.length; n++) {
        let i = t.childNodes[n];
        if (!(i instanceof HTMLStyleElement)) return i;
      }
      return null;
    }
    _parseSlots() {
      let t = this._slots = {},
        n;
      for (; n = this.firstChild;) {
        let i = n.nodeType === 1 && n.getAttribute("slot") || "default";
        (t[i] || (t[i] = [])).push(n), this.removeChild(n);
      }
    }
    _renderSlots() {
      let t = this._getSlots(),
        n = this._instance.type.__scopeId;
      for (let i = 0; i < t.length; i++) {
        let s = t[i],
          l = s.getAttribute("name") || "default",
          u = this._slots[l],
          p = s.parentNode;
        if (u) for (let g of u) {
          if (n && g.nodeType === 1) {
            let _ = n + "-s",
              x = document.createTreeWalker(g, 1);
            g.setAttribute(_, "");
            let w;
            for (; w = x.nextNode();) w.setAttribute(_, "");
          }
          p.insertBefore(g, s);
        } else for (; s.firstChild;) p.insertBefore(s.firstChild, s);
        p.removeChild(s);
      }
    }
    _getSlots() {
      let t = [this];
      this._teleportTargets && t.push(...this._teleportTargets);
      let n = new Set();
      for (let i of t) {
        let s = i.querySelectorAll("slot");
        for (let l = 0; l < s.length; l++) n.add(s[l]);
      }
      return Array.from(n);
    }
    _injectChildStyle(t, n) {
      this._applyStyles(t.styles, t, n);
    }
    _beginPatch() {
      this._patching = !0, this._dirty = !1;
    }
    _endPatch() {
      this._patching = !1, this._dirty && this._instance && this._update();
    }
    _hasShadowRoot() {
      return this._def.shadowRoot !== !1;
    }
    _removeChildStyle(t) {}
  };
function Mp(e) {
  let t = zt(),
    n = t && t.ce;
  return n || null;
}
function Jb() {
  let e = Mp();
  return e && e.shadowRoot;
}
function Zb(e = "$style") {
  {
    let t = zt();
    if (!t) return Be;
    let n = t.type.__cssModules;
    if (!n) return Be;
    let i = n[e];
    return i || Be;
  }
}
var Pp = new WeakMap(),
  Lp = new WeakMap(),
  na = Symbol("_moveCb"),
  wp = Symbol("_enterCb"),
  Qb = e => (delete e.props.mode, e),
  ey = Qb({
    name: "TransitionGroup",
    props: Ue({}, Cp, {
      tag: String,
      moveClass: String
    }),
    setup(e, {
      slots: t
    }) {
      let n = zt(),
        i = zs(),
        s,
        l;
      return ko(() => {
        if (!s.length) return;
        let u = e.moveClass || `${e.name || "v"}-move`;
        if (!oy(s[0].el, n.vnode.el, u)) {
          s = [];
          return;
        }
        s.forEach(ny), s.forEach(ry);
        let p = s.filter(iy);
        sc(n.vnode.el), p.forEach(g => {
          let _ = g.el,
            x = _.style;
          Mn(_, u), x.transform = x.webkitTransform = x.transitionDuration = "";
          let w = _[na] = V => {
            V && V.target !== _ || (!V || V.propertyName.endsWith("transform")) && (_.removeEventListener("transitionend", w), _[na] = null, br(_, u));
          };
          _.addEventListener("transitionend", w);
        }), s = [];
      }), () => {
        let u = Xe(e),
          p = Ap(u),
          g = u.tag || Ct;
        if (s = [], l) for (let _ = 0; _ < l.length; _++) {
          let x = l[_];
          x.el && x.el instanceof Element && !x.el[lc] && (s.push(x), In(x, Kr(x, p, i, n)), Pp.set(x, Fp(x.el)));
        }
        l = t.default ? yo(t.default()) : [];
        for (let _ = 0; _ < l.length; _++) {
          let x = l[_];
          x.key != null && In(x, Kr(x, p, i, n));
        }
        return ut(g, null, l);
      };
    }
  }),
  ty = ey;
function ny(e) {
  let t = e.el;
  t[na] && t[na](), t[wp] && t[wp]();
}
function ry(e) {
  Lp.set(e, Fp(e.el));
}
function iy(e) {
  let t = Pp.get(e),
    n = Lp.get(e),
    i = t.left - n.left,
    s = t.top - n.top;
  if (i || s) {
    let l = e.el,
      u = l.style,
      p = l.getBoundingClientRect(),
      g = 1,
      _ = 1;
    return l.offsetWidth && (g = p.width / l.offsetWidth), l.offsetHeight && (_ = p.height / l.offsetHeight), (!Number.isFinite(g) || g === 0) && (g = 1), (!Number.isFinite(_) || _ === 0) && (_ = 1), Math.abs(g - 1) < .01 && (g = 1), Math.abs(_ - 1) < .01 && (_ = 1), u.transform = u.webkitTransform = `translate(${i / g}px,${s / _}px)`, u.transitionDuration = "0s", e;
  }
}
function Fp(e) {
  let t = e.getBoundingClientRect();
  return {
    left: t.left,
    top: t.top
  };
}
function oy(e, t, n) {
  let i = e.cloneNode(),
    s = e[Ti];
  s && s.forEach(p => {
    p.split(/\s+/).forEach(g => g && i.classList.remove(g));
  }), n.split(/\s+/).forEach(p => p && i.classList.add(p)), i.style.display = "none";
  let l = t.nodeType === 1 ? t : t.parentNode;
  l.appendChild(i);
  let {
    hasTransform: u
  } = Dp(i);
  return l.removeChild(i), u;
}
var yr = e => {
  let t = e.props["onUpdate:modelValue"] || !1;
  return _e(t) ? n => ur(t, n) : t;
};
function sy(e) {
  e.target.composing = !0;
}
function kp(e) {
  let t = e.target;
  t.composing && (t.composing = !1, t.dispatchEvent(new Event("input")));
}
var ln = Symbol("_assign"),
  Js = Symbol("_initialValue");
function ic(e, t, n) {
  return t && (e = e.trim()), n && (e = fi(e)), e;
}
var ra = {
    created(e, {
      modifiers: {
        lazy: t,
        trim: n,
        number: i
      }
    }, s) {
      e.parentNode && (e.type === "text" ? e[Js] = e.defaultValue.replace(/[\r\n]/g, "") : e.type === "textarea" && (e[Js] = e.defaultValue.replace(/\r\n?/g, `
`))), e[ln] = yr(s);
      let l = i || s.props && s.props.type === "number";
      Yn(e, t ? "change" : "input", u => {
        u.target.composing || e[ln](ic(e.value, n, l));
      }), (n || l) && Yn(e, "change", () => {
        e.value = ic(e.value, n, l);
      }), t || (Yn(e, "compositionstart", sy), Yn(e, "compositionend", kp), Yn(e, "change", kp));
    },
    mounted(e, {
      value: t,
      modifiers: {
        trim: n,
        number: i
      }
    }) {
      let s = t ?? "",
        l = e[Js];
      delete e[Js], l !== void 0 && (e.type === "text" || e.type === "textarea") && e.value !== l ? e[ln](ic(e.value, n, i)) : e.value = s;
    },
    beforeUpdate(e, {
      value: t,
      oldValue: n,
      modifiers: {
        lazy: i,
        trim: s,
        number: l
      }
    }, u) {
      if (e[ln] = yr(u), e.composing) return;
      let p = (l || e.type === "number") && !/^0\d/.test(e.value) ? fi(e.value) : e.value,
        g = t ?? "";
      if (p === g) return;
      let _ = e.getRootNode();
      (_ instanceof Document || _ instanceof ShadowRoot) && _.activeElement === e && e.type !== "range" && (i && t === n || s && e.value.trim() === g) || (e.value = g);
    }
  },
  cc = {
    deep: !0,
    created(e, t, n) {
      e[ln] = yr(n), Yn(e, "change", () => {
        let i = e._modelValue,
          s = Ci(e),
          l = e.checked,
          u = e[ln];
        if (_e(i)) {
          let p = qi(i, s),
            g = p !== -1;
          if (l && !g) u(i.concat(s));else if (!l && g) {
            let _ = [...i];
            _.splice(p, 1), u(_);
          }
        } else if (Un(i)) {
          let p = new Set(i);
          l ? p.add(s) : p.delete(s), u(p);
        } else u(jp(e, l));
      });
    },
    mounted: Ep,
    beforeUpdate(e, t, n) {
      e[ln] = yr(n), Ep(e, t, n);
    }
  };
function Ep(e, {
  value: t,
  oldValue: n
}, i) {
  e._modelValue = t;
  let s;
  if (_e(t)) s = qi(t, i.props.value) > -1;else if (Un(t)) s = t.has(i.props.value);else {
    if (t === n) return;
    s = xn(t, jp(e, !0));
  }
  e.checked !== s && (e.checked = s);
}
var uc = {
    created(e, {
      value: t
    }, n) {
      e.checked = xn(t, n.props.value), e[ln] = yr(n), Yn(e, "change", () => {
        e[ln](Ci(e));
      });
    },
    beforeUpdate(e, {
      value: t,
      oldValue: n
    }, i) {
      e[ln] = yr(i), t !== n && (e.checked = xn(t, i.props.value));
    }
  },
  Up = {
    deep: !0,
    created(e, {
      value: t,
      modifiers: {
        number: n
      }
    }, i) {
      e._modelValue = t, Yn(e, "change", () => {
        let s = Array.prototype.filter.call(e.options, l => l.selected).map(l => n ? fi(Ci(l)) : Ci(l));
        e[ln](e.multiple ? Un(e._modelValue) ? new Set(s) : s : s[0]), e._assigning = !0, vo(() => {
          e._assigning = !1;
        });
      }), e[ln] = yr(i);
    },
    mounted(e, {
      value: t
    }) {
      _p(e, t);
    },
    beforeUpdate(e, {
      value: t
    }, n) {
      e._modelValue = t, e[ln] = yr(n);
    },
    updated(e, {
      value: t
    }) {
      e._assigning || _p(e, t);
    }
  };
function _p(e, t) {
  let n = e.multiple,
    i = _e(t);
  if (!(n && !i && !Un(t))) {
    for (let s = 0, l = e.options.length; s < l; s++) {
      let u = e.options[s],
        p = Ci(u);
      if (n) {
        if (i) {
          let g = typeof p;
          g === "string" || g === "number" ? u.selected = t.some(_ => String(_) === String(p)) : u.selected = qi(t, p) > -1;
        } else u.selected = t.has(p);
      } else if (xn(Ci(u), t)) {
        e.selectedIndex !== s && (e.selectedIndex = s);
        return;
      }
    }
    !n && e.selectedIndex !== -1 && (e.selectedIndex = -1);
  }
}
function Ci(e) {
  return "_value" in e ? e._value : e.value;
}
function jp(e, t) {
  let n = t ? "_trueValue" : "_falseValue";
  return n in e ? e[n] : t;
}
var zp = {
  created(e, t, n) {
    Zs(e, t, n, null, "created");
  },
  mounted(e, t, n) {
    Zs(e, t, n, null, "mounted");
  },
  beforeUpdate(e, t, n, i) {
    Zs(e, t, n, i, "beforeUpdate");
  },
  updated(e, t, n, i) {
    Zs(e, t, n, i, "updated");
  }
};
function Hp(e, t) {
  switch (e) {
    case "SELECT":
      return Up;
    case "TEXTAREA":
      return ra;
    default:
      switch (t) {
        case "checkbox":
          return cc;
        case "radio":
          return uc;
        default:
          return ra;
      }
  }
}
function Zs(e, t, n, i, s) {
  let u = Hp(e.tagName, n.props && n.props.type)[s];
  u && u(e, t, n, i);
}
function ay() {
  ra.getSSRProps = ({
    value: e
  }) => ({
    value: e
  }), uc.getSSRProps = ({
    value: e
  }, t) => {
    if (t.props && xn(t.props.value, e)) return {
      checked: !0
    };
  }, cc.getSSRProps = ({
    value: e
  }, t) => {
    if (_e(e)) {
      if (t.props && qi(e, t.props.value) > -1) return {
        checked: !0
      };
    } else if (Un(e)) {
      if (t.props && e.has(t.props.value)) return {
        checked: !0
      };
    } else if (e) return {
      checked: !0
    };
  }, zp.getSSRProps = (e, t) => {
    if (typeof t.type != "string") return;
    let n = Hp(t.type.toUpperCase(), t.props && t.props.type);
    if (n.getSSRProps) return n.getSSRProps(e, t);
  };
}
var ly = ["ctrl", "shift", "alt", "meta"],
  cy = {
    stop: e => e.stopPropagation(),
    prevent: e => e.preventDefault(),
    self: e => e.target !== e.currentTarget,
    ctrl: e => !e.ctrlKey,
    shift: e => !e.shiftKey,
    alt: e => !e.altKey,
    meta: e => !e.metaKey,
    left: e => "button" in e && e.button !== 0,
    middle: e => "button" in e && e.button !== 1,
    right: e => "button" in e && e.button !== 2,
    exact: (e, t) => ly.some(n => e[`${n}Key`] && !t.includes(n))
  },
  uy = (e, t) => {
    if (!e) return e;
    let n = e._withMods || (e._withMods = {}),
      i = t.join(".");
    return n[i] || (n[i] = (s, ...l) => {
      for (let u = 0; u < t.length; u++) {
        let p = cy[t[u]];
        if (p && p(s, t)) return;
      }
      return e(s, ...l);
    });
  },
  fy = {
    esc: "escape",
    space: " ",
    up: "arrow-up",
    left: "arrow-left",
    right: "arrow-right",
    down: "arrow-down",
    delete: "backspace"
  },
  dy = (e, t) => {
    let n = e._withKeys || (e._withKeys = {}),
      i = t.join(".");
    return n[i] || (n[i] = s => {
      if (!("key" in s)) return;
      let l = Ut(s.key);
      if (t.some(u => u === l || fy[u] === l)) return e(s);
    });
  },
  Bp = Ue({
    patchProp: Ip
  }, Op),
  So,
  Np = !1;
function Kp() {
  return So || (So = ql(Bp));
}
function Wp() {
  return So = Np ? So : Gl(Bp), Np = !0, So;
}
var Xp = (...e) => {
    Kp().render(...e);
  },
  py = (...e) => {
    Wp().hydrate(...e);
  },
  createApp = (...e) => {
    let t = Kp().createApp(...e),
      {
        mount: n
      } = t;
    return t.mount = i => {
      let s = Yp(i);
      if (!s) return;
      let l = t._component;
      !$e(l) && !l.render && !l.template && (l.template = s.innerHTML), s.nodeType === 1 && (s.textContent = "");
      let u = n(s, !1, Gp(s));
      return s instanceof Element && (s.removeAttribute("v-cloak"), s.setAttribute("data-v-app", "")), u;
    }, t;
  },
  qp = (...e) => {
    let t = Wp().createApp(...e),
      {
        mount: n
      } = t;
    return t.mount = i => {
      let s = Yp(i);
      if (s) return n(s, !0, Gp(s));
    }, t;
  };
function Gp(e) {
  if (e instanceof SVGElement) return "svg";
  if (typeof MathMLElement == "function" && e instanceof MathMLElement) return "mathml";
}
function Yp(e) {
  return Me(e) ? document.querySelector(e) : e;
}
var xp = !1,
  hy = () => {
    xp || (xp = !0, ay(), $b());
  };
var Ao = Symbol(""),
  Co = Symbol(""),
  _c = Symbol(""),
  ua = Symbol(""),
  hh = Symbol(""),
  ti = Symbol(""),
  mh = Symbol(""),
  gh = Symbol(""),
  Nc = Symbol(""),
  xc = Symbol(""),
  Ro = Symbol(""),
  Sc = Symbol(""),
  vh = Symbol(""),
  Oc = Symbol(""),
  Tc = Symbol(""),
  Cc = Symbol(""),
  Ac = Symbol(""),
  Dc = Symbol(""),
  Vc = Symbol(""),
  bh = Symbol(""),
  yh = Symbol(""),
  Mo = Symbol(""),
  fa = Symbol(""),
  $c = Symbol(""),
  Ic = Symbol(""),
  Do = Symbol(""),
  Po = Symbol(""),
  Rc = Symbol(""),
  hc = Symbol(""),
  my = Symbol(""),
  mc = Symbol(""),
  da = Symbol(""),
  gy = Symbol(""),
  vy = Symbol(""),
  Mc = Symbol(""),
  by = Symbol(""),
  yy = Symbol(""),
  Pc = Symbol(""),
  wh = Symbol(""),
  Ai = {
    [Ao]: "Fragment",
    [Co]: "Teleport",
    [_c]: "Suspense",
    [ua]: "KeepAlive",
    [hh]: "BaseTransition",
    [ti]: "openBlock",
    [mh]: "createBlock",
    [gh]: "createElementBlock",
    [Nc]: "createVNode",
    [xc]: "createElementVNode",
    [Ro]: "createCommentVNode",
    [Sc]: "createTextVNode",
    [vh]: "createStaticVNode",
    [Oc]: "resolveComponent",
    [Tc]: "resolveDynamicComponent",
    [Cc]: "resolveDirective",
    [Ac]: "resolveFilter",
    [Dc]: "withDirectives",
    [Vc]: "renderList",
    [bh]: "renderSlot",
    [yh]: "createSlots",
    [Mo]: "toDisplayString",
    [fa]: "mergeProps",
    [$c]: "normalizeClass",
    [Ic]: "normalizeStyle",
    [Do]: "normalizeProps",
    [Po]: "guardReactiveProps",
    [Rc]: "toHandlers",
    [hc]: "camelize",
    [my]: "capitalize",
    [mc]: "toHandlerKey",
    [da]: "setBlockTracking",
    [gy]: "pushScopeId",
    [vy]: "popScopeId",
    [Mc]: "withCtx",
    [by]: "unref",
    [yy]: "isRef",
    [Pc]: "withMemo",
    [wh]: "isMemoSame"
  };
function kh(e) {
  Object.getOwnPropertySymbols(e).forEach(t => {
    Ai[t] = e[t];
  });
}
var un = {
  start: {
    line: 1,
    column: 1,
    offset: 0
  },
  end: {
    line: 1,
    column: 1,
    offset: 0
  },
  source: ""
};
function wy(e, t = "") {
  return {
    type: 0,
    source: t,
    children: e,
    helpers: new Set(),
    components: [],
    directives: [],
    hoists: [],
    imports: [],
    cached: [],
    temps: 0,
    codegenNode: void 0,
    loc: un
  };
}
function Vo(e, t, n, i, s, l, u, p = !1, g = !1, _ = !1, x = un) {
  return e && (p ? (e.helper(ti), e.helper($i(e.inSSR, _))) : e.helper(Vi(e.inSSR, _)), u && e.helper(Dc)), {
    type: 13,
    tag: t,
    props: n,
    children: i,
    patchFlag: s,
    dynamicProps: l,
    directives: u,
    isBlock: p,
    disableTracking: g,
    isComponent: _,
    loc: x
  };
}
function Qr(e, t = un) {
  return {
    type: 17,
    loc: t,
    elements: e
  };
}
function wn(e, t = un) {
  return {
    type: 15,
    loc: t,
    properties: e
  };
}
function yt(e, t) {
  return {
    type: 16,
    loc: un,
    key: Me(e) ? Ke(e, !0) : e,
    value: t
  };
}
function Ke(e, t = !1, n = un, i = 0) {
  return {
    type: 4,
    loc: n,
    content: e,
    isStatic: t,
    constType: t ? 3 : i
  };
}
function kn(e, t = un) {
  return {
    type: 8,
    loc: t,
    children: e
  };
}
function Nt(e, t = [], n = un) {
  return {
    type: 14,
    loc: n,
    callee: e,
    arguments: t
  };
}
function Di(e, t = void 0, n = !1, i = !1, s = un) {
  return {
    type: 18,
    params: e,
    returns: t,
    newline: n,
    isSlot: i,
    loc: s
  };
}
function gc(e, t, n, i = !0) {
  return {
    type: 19,
    test: e,
    consequent: t,
    alternate: n,
    newline: i,
    loc: un
  };
}
function ky(e, t, n = !1, i = !1) {
  return {
    type: 20,
    index: e,
    value: t,
    needPauseTracking: n,
    inVOnce: i,
    needArraySpread: !1,
    loc: un
  };
}
function Ey(e) {
  return {
    type: 21,
    body: e,
    loc: un
  };
}
function Vi(e, t) {
  return e || t ? Nc : xc;
}
function $i(e, t) {
  return e || t ? mh : gh;
}
function Lc(e, {
  helper: t,
  removeHelper: n,
  inSSR: i
}) {
  e.isBlock || (e.isBlock = !0, n(Vi(i, e.isComponent)), t(ti), t($i(i, e.isComponent)));
}
var Jp = new Uint8Array([123, 123]),
  Zp = new Uint8Array([125, 125]);
function Qp(e) {
  return e >= 97 && e <= 122 || e >= 65 && e <= 90;
}
function cn(e) {
  return e === 32 || e === 10 || e === 9 || e === 12 || e === 13;
}
function wr(e) {
  return e === 47 || e === 62 || cn(e);
}
function pa(e) {
  let t = new Uint8Array(e.length);
  for (let n = 0; n < e.length; n++) t[n] = e.charCodeAt(n);
  return t;
}
var Ht = {
    Cdata: new Uint8Array([67, 68, 65, 84, 65, 91]),
    CdataEnd: new Uint8Array([93, 93, 62]),
    CommentEnd: new Uint8Array([45, 45, 62]),
    ScriptEnd: new Uint8Array([60, 47, 115, 99, 114, 105, 112, 116]),
    StyleEnd: new Uint8Array([60, 47, 115, 116, 121, 108, 101]),
    TitleEnd: new Uint8Array([60, 47, 116, 105, 116, 108, 101]),
    TextareaEnd: new Uint8Array([60, 47, 116, 101, 120, 116, 97, 114, 101, 97])
  },
  vc = class {
    constructor(t, n) {
      this.stack = t, this.cbs = n, this.state = 1, this.buffer = "", this.sectionStart = 0, this.index = 0, this.entityStart = 0, this.baseState = 1, this.inRCDATA = !1, this.inXML = !1, this.inVPre = !1, this.newlines = [], this.mode = 0, this.delimiterOpen = Jp, this.delimiterClose = Zp, this.delimiterIndex = -1, this.currentSequence = void 0, this.sequenceIndex = 0;
    }
    get inSFCRoot() {
      return this.mode === 2 && this.stack.length === 0;
    }
    reset() {
      this.state = 1, this.mode = 0, this.buffer = "", this.sectionStart = 0, this.index = 0, this.baseState = 1, this.inRCDATA = !1, this.currentSequence = void 0, this.newlines.length = 0, this.delimiterOpen = Jp, this.delimiterClose = Zp;
    }
    getPos(t) {
      let n = 1,
        i = t + 1,
        s = this.newlines.length,
        l = -1;
      if (s > 100) {
        let u = -1,
          p = s;
        for (; u + 1 < p;) {
          let g = u + p >>> 1;
          this.newlines[g] < t ? u = g : p = g;
        }
        l = u;
      } else for (let u = s - 1; u >= 0; u--) if (t > this.newlines[u]) {
        l = u;
        break;
      }
      return l >= 0 && (n = l + 2, i = t - this.newlines[l]), {
        column: i,
        line: n,
        offset: t
      };
    }
    peek() {
      return this.buffer.charCodeAt(this.index + 1);
    }
    stateText(t) {
      t === 60 ? (this.index > this.sectionStart && this.cbs.ontext(this.sectionStart, this.index), this.state = 5, this.sectionStart = this.index) : !this.inVPre && t === this.delimiterOpen[0] && (this.state = 2, this.delimiterIndex = 0, this.stateInterpolationOpen(t));
    }
    stateInterpolationOpen(t) {
      if (t === this.delimiterOpen[this.delimiterIndex]) {
        if (this.delimiterIndex === this.delimiterOpen.length - 1) {
          let n = this.index + 1 - this.delimiterOpen.length;
          n > this.sectionStart && this.cbs.ontext(this.sectionStart, n), this.state = 3, this.sectionStart = n;
        } else this.delimiterIndex++;
      } else this.inRCDATA ? (this.state = 32, this.stateInRCDATA(t)) : (this.state = 1, this.stateText(t));
    }
    stateInterpolation(t) {
      t === this.delimiterClose[0] && (this.state = 4, this.delimiterIndex = 0, this.stateInterpolationClose(t));
    }
    stateInterpolationClose(t) {
      t === this.delimiterClose[this.delimiterIndex] ? this.delimiterIndex === this.delimiterClose.length - 1 ? (this.cbs.oninterpolation(this.sectionStart, this.index + 1), this.inRCDATA ? this.state = 32 : this.state = 1, this.sectionStart = this.index + 1) : this.delimiterIndex++ : (this.state = 3, this.stateInterpolation(t));
    }
    stateSpecialStartSequence(t) {
      let n = this.sequenceIndex === this.currentSequence.length;
      if (!(n ? wr(t) : (t | 32) === this.currentSequence[this.sequenceIndex])) this.inRCDATA = !1;else if (!n) {
        this.sequenceIndex++;
        return;
      }
      this.sequenceIndex = 0, this.state = 6, this.stateInTagName(t);
    }
    stateInRCDATA(t) {
      if (this.sequenceIndex === this.currentSequence.length) {
        if (t === 62 || cn(t)) {
          let n = this.index - this.currentSequence.length;
          if (this.sectionStart < n) {
            let i = this.index;
            this.index = n, this.cbs.ontext(this.sectionStart, n), this.index = i;
          }
          this.sectionStart = n + 2, this.stateInClosingTagName(t), this.inRCDATA = !1;
          return;
        }
        this.sequenceIndex = 0;
      }
      (t | 32) === this.currentSequence[this.sequenceIndex] ? this.sequenceIndex += 1 : this.sequenceIndex === 0 ? this.currentSequence === Ht.TitleEnd || this.currentSequence === Ht.TextareaEnd && !this.inSFCRoot ? !this.inVPre && t === this.delimiterOpen[0] && (this.state = 2, this.delimiterIndex = 0, this.stateInterpolationOpen(t)) : this.fastForwardTo(60) && (this.sequenceIndex = 1) : this.sequenceIndex = +(t === 60);
    }
    stateCDATASequence(t) {
      t === Ht.Cdata[this.sequenceIndex] ? ++this.sequenceIndex === Ht.Cdata.length && (this.state = 28, this.currentSequence = Ht.CdataEnd, this.sequenceIndex = 0, this.sectionStart = this.index + 1) : (this.sequenceIndex = 0, this.state = 23, this.stateInDeclaration(t));
    }
    fastForwardTo(t) {
      for (; ++this.index < this.buffer.length;) {
        let n = this.buffer.charCodeAt(this.index);
        if (n === 10 && this.newlines.push(this.index), n === t) return !0;
      }
      return this.index = this.buffer.length - 1, !1;
    }
    stateInCommentLike(t) {
      t === this.currentSequence[this.sequenceIndex] ? ++this.sequenceIndex === this.currentSequence.length && (this.currentSequence === Ht.CdataEnd ? this.cbs.oncdata(this.sectionStart, this.index - 2) : this.cbs.oncomment(this.sectionStart, this.index - 2), this.sequenceIndex = 0, this.sectionStart = this.index + 1, this.state = 1) : this.sequenceIndex === 0 ? this.fastForwardTo(this.currentSequence[0]) && (this.sequenceIndex = 1) : t !== this.currentSequence[this.sequenceIndex - 1] && (this.sequenceIndex = 0);
    }
    startSpecial(t, n) {
      this.enterRCDATA(t, n), this.state = 31;
    }
    enterRCDATA(t, n) {
      this.inRCDATA = !0, this.currentSequence = t, this.sequenceIndex = n;
    }
    stateBeforeTagName(t) {
      t === 33 ? (this.state = 22, this.sectionStart = this.index + 1) : t === 63 ? (this.state = 24, this.sectionStart = this.index + 1) : Qp(t) ? (this.sectionStart = this.index, this.mode === 0 ? this.state = 6 : this.inSFCRoot ? this.state = 34 : this.inXML ? this.state = 6 : t === 116 ? this.state = 30 : this.state = t === 115 ? 29 : 6) : t === 47 ? this.state = 8 : (this.state = 1, this.stateText(t));
    }
    stateInTagName(t) {
      wr(t) && this.handleTagName(t);
    }
    stateInSFCRootTagName(t) {
      if (wr(t)) {
        let n = this.buffer.slice(this.sectionStart, this.index);
        n !== "template" && this.enterRCDATA(pa("</" + n), 0), this.handleTagName(t);
      }
    }
    handleTagName(t) {
      this.cbs.onopentagname(this.sectionStart, this.index), this.sectionStart = -1, this.state = 11, this.stateBeforeAttrName(t);
    }
    stateBeforeClosingTagName(t) {
      cn(t) || (t === 62 ? (this.state = 1, this.sectionStart = this.index + 1) : (this.state = Qp(t) ? 9 : 27, this.sectionStart = this.index));
    }
    stateInClosingTagName(t) {
      (t === 62 || cn(t)) && (this.cbs.onclosetag(this.sectionStart, this.index), this.sectionStart = -1, this.state = 10, this.stateAfterClosingTagName(t));
    }
    stateAfterClosingTagName(t) {
      t === 62 && (this.state = 1, this.sectionStart = this.index + 1);
    }
    stateBeforeAttrName(t) {
      t === 62 ? (this.cbs.onopentagend(this.index), this.inRCDATA ? this.state = 32 : this.state = 1, this.sectionStart = this.index + 1) : t === 47 ? this.state = 7 : t === 60 && this.peek() === 47 ? (this.cbs.onopentagend(this.index), this.state = 5, this.sectionStart = this.index) : cn(t) || this.handleAttrStart(t);
    }
    handleAttrStart(t) {
      t === 118 && this.peek() === 45 ? (this.state = 13, this.sectionStart = this.index) : t === 46 || t === 58 || t === 64 || t === 35 ? (this.cbs.ondirname(this.index, this.index + 1), this.state = 14, this.sectionStart = this.index + 1) : (this.state = 12, this.sectionStart = this.index);
    }
    stateInSelfClosingTag(t) {
      t === 62 ? (this.cbs.onselfclosingtag(this.index), this.state = 1, this.sectionStart = this.index + 1, this.inRCDATA = !1) : cn(t) || (this.state = 11, this.stateBeforeAttrName(t));
    }
    stateInAttrName(t) {
      (t === 61 || wr(t)) && (this.cbs.onattribname(this.sectionStart, this.index), this.handleAttrNameEnd(t));
    }
    stateInDirName(t) {
      t === 61 || wr(t) ? (this.cbs.ondirname(this.sectionStart, this.index), this.handleAttrNameEnd(t)) : t === 58 ? (this.cbs.ondirname(this.sectionStart, this.index), this.state = 14, this.sectionStart = this.index + 1) : t === 46 && (this.cbs.ondirname(this.sectionStart, this.index), this.state = 16, this.sectionStart = this.index + 1);
    }
    stateInDirArg(t) {
      t === 61 || wr(t) ? (this.cbs.ondirarg(this.sectionStart, this.index), this.handleAttrNameEnd(t)) : t === 91 ? this.state = 15 : t === 46 && (this.cbs.ondirarg(this.sectionStart, this.index), this.state = 16, this.sectionStart = this.index + 1);
    }
    stateInDynamicDirArg(t) {
      t === 93 ? this.state = 14 : (t === 61 || wr(t)) && (this.cbs.ondirarg(this.sectionStart, this.index + 1), this.handleAttrNameEnd(t));
    }
    stateInDirModifier(t) {
      t === 61 || wr(t) ? (this.cbs.ondirmodifier(this.sectionStart, this.index), this.handleAttrNameEnd(t)) : t === 46 && (this.cbs.ondirmodifier(this.sectionStart, this.index), this.sectionStart = this.index + 1);
    }
    handleAttrNameEnd(t) {
      this.sectionStart = this.index, this.state = 17, this.cbs.onattribnameend(this.index), this.stateAfterAttrName(t);
    }
    stateAfterAttrName(t) {
      t === 61 ? this.state = 18 : t === 47 || t === 62 ? (this.cbs.onattribend(0, this.sectionStart), this.sectionStart = -1, this.state = 11, this.stateBeforeAttrName(t)) : cn(t) || (this.cbs.onattribend(0, this.sectionStart), this.handleAttrStart(t));
    }
    stateBeforeAttrValue(t) {
      t === 34 ? (this.state = 19, this.sectionStart = this.index + 1) : t === 39 ? (this.state = 20, this.sectionStart = this.index + 1) : cn(t) || (this.sectionStart = this.index, this.state = 21, this.stateInAttrValueNoQuotes(t));
    }
    handleInAttrValue(t, n) {
      (t === n || this.fastForwardTo(n)) && (this.cbs.onattribdata(this.sectionStart, this.index), this.sectionStart = -1, this.cbs.onattribend(n === 34 ? 3 : 2, this.index + 1), this.state = 11);
    }
    stateInAttrValueDoubleQuotes(t) {
      this.handleInAttrValue(t, 34);
    }
    stateInAttrValueSingleQuotes(t) {
      this.handleInAttrValue(t, 39);
    }
    stateInAttrValueNoQuotes(t) {
      cn(t) || t === 62 ? (this.cbs.onattribdata(this.sectionStart, this.index), this.sectionStart = -1, this.cbs.onattribend(1, this.index), this.state = 11, this.stateBeforeAttrName(t)) : (t === 39 || t === 60 || t === 61 || t === 96) && this.cbs.onerr(18, this.index);
    }
    stateBeforeDeclaration(t) {
      t === 91 ? (this.state = 26, this.sequenceIndex = 0) : this.state = t === 45 ? 25 : 23;
    }
    stateInDeclaration(t) {
      (t === 62 || this.fastForwardTo(62)) && (this.state = 1, this.sectionStart = this.index + 1);
    }
    stateInProcessingInstruction(t) {
      (t === 62 || this.fastForwardTo(62)) && (this.cbs.onprocessinginstruction(this.sectionStart, this.index), this.state = 1, this.sectionStart = this.index + 1);
    }
    stateBeforeComment(t) {
      t === 45 ? (this.state = 28, this.currentSequence = Ht.CommentEnd, this.sequenceIndex = 2, this.sectionStart = this.index + 1) : this.state = 23;
    }
    stateInSpecialComment(t) {
      (t === 62 || this.fastForwardTo(62)) && (this.cbs.oncomment(this.sectionStart, this.index), this.state = 1, this.sectionStart = this.index + 1);
    }
    stateBeforeSpecialS(t) {
      t === Ht.ScriptEnd[3] ? this.startSpecial(Ht.ScriptEnd, 4) : t === Ht.StyleEnd[3] ? this.startSpecial(Ht.StyleEnd, 4) : (this.state = 6, this.stateInTagName(t));
    }
    stateBeforeSpecialT(t) {
      t === Ht.TitleEnd[3] ? this.startSpecial(Ht.TitleEnd, 4) : t === Ht.TextareaEnd[3] ? this.startSpecial(Ht.TextareaEnd, 4) : (this.state = 6, this.stateInTagName(t));
    }
    startEntity() {}
    stateInEntity() {}
    parse(t) {
      for (this.buffer = t; this.index < this.buffer.length;) {
        let n = this.buffer.charCodeAt(this.index);
        switch (n === 10 && this.state !== 33 && this.newlines.push(this.index), this.state) {
          case 1:
            {
              this.stateText(n);
              break;
            }
          case 2:
            {
              this.stateInterpolationOpen(n);
              break;
            }
          case 3:
            {
              this.stateInterpolation(n);
              break;
            }
          case 4:
            {
              this.stateInterpolationClose(n);
              break;
            }
          case 31:
            {
              this.stateSpecialStartSequence(n);
              break;
            }
          case 32:
            {
              this.stateInRCDATA(n);
              break;
            }
          case 26:
            {
              this.stateCDATASequence(n);
              break;
            }
          case 19:
            {
              this.stateInAttrValueDoubleQuotes(n);
              break;
            }
          case 12:
            {
              this.stateInAttrName(n);
              break;
            }
          case 13:
            {
              this.stateInDirName(n);
              break;
            }
          case 14:
            {
              this.stateInDirArg(n);
              break;
            }
          case 15:
            {
              this.stateInDynamicDirArg(n);
              break;
            }
          case 16:
            {
              this.stateInDirModifier(n);
              break;
            }
          case 28:
            {
              this.stateInCommentLike(n);
              break;
            }
          case 27:
            {
              this.stateInSpecialComment(n);
              break;
            }
          case 11:
            {
              this.stateBeforeAttrName(n);
              break;
            }
          case 6:
            {
              this.stateInTagName(n);
              break;
            }
          case 34:
            {
              this.stateInSFCRootTagName(n);
              break;
            }
          case 9:
            {
              this.stateInClosingTagName(n);
              break;
            }
          case 5:
            {
              this.stateBeforeTagName(n);
              break;
            }
          case 17:
            {
              this.stateAfterAttrName(n);
              break;
            }
          case 20:
            {
              this.stateInAttrValueSingleQuotes(n);
              break;
            }
          case 18:
            {
              this.stateBeforeAttrValue(n);
              break;
            }
          case 8:
            {
              this.stateBeforeClosingTagName(n);
              break;
            }
          case 10:
            {
              this.stateAfterClosingTagName(n);
              break;
            }
          case 29:
            {
              this.stateBeforeSpecialS(n);
              break;
            }
          case 30:
            {
              this.stateBeforeSpecialT(n);
              break;
            }
          case 21:
            {
              this.stateInAttrValueNoQuotes(n);
              break;
            }
          case 7:
            {
              this.stateInSelfClosingTag(n);
              break;
            }
          case 23:
            {
              this.stateInDeclaration(n);
              break;
            }
          case 22:
            {
              this.stateBeforeDeclaration(n);
              break;
            }
          case 25:
            {
              this.stateBeforeComment(n);
              break;
            }
          case 24:
            {
              this.stateInProcessingInstruction(n);
              break;
            }
          case 33:
            {
              this.stateInEntity();
              break;
            }
        }
        this.index++;
      }
      this.cleanup(), this.finish();
    }
    cleanup() {
      this.sectionStart !== this.index && (this.state === 1 || this.state === 32 && this.sequenceIndex === 0 ? (this.cbs.ontext(this.sectionStart, this.index), this.sectionStart = this.index) : (this.state === 19 || this.state === 20 || this.state === 21) && (this.cbs.onattribdata(this.sectionStart, this.index), this.sectionStart = this.index));
    }
    finish() {
      this.handleTrailingData(), this.cbs.onend();
    }
    handleTrailingData() {
      let t = this.buffer.length;
      this.sectionStart >= t || (this.state === 28 ? this.currentSequence === Ht.CdataEnd ? this.cbs.oncdata(this.sectionStart, t) : this.cbs.oncomment(this.sectionStart, t) : this.state === 6 || this.state === 11 || this.state === 18 || this.state === 17 || this.state === 12 || this.state === 13 || this.state === 14 || this.state === 15 || this.state === 16 || this.state === 20 || this.state === 19 || this.state === 21 || this.state === 9 || this.cbs.ontext(this.sectionStart, t));
    }
    emitCodePoint(t, n) {}
  };
function eh(e, {
  compatConfig: t
}) {
  let n = t && t[e];
  return e === "MODE" ? n || 3 : n;
}
function ei(e, t) {
  let n = eh("MODE", t),
    i = eh(e, t);
  return n === 3 ? i === !0 : i !== !1;
}
function Ii(e, t, n, ...i) {
  return ei(e, t);
}
function Fc(e) {
  throw e;
}
function Eh(e) {}
function lt(e, t, n, i) {
  let s = `https://vuejs.org/error-reference/#compiler-${e}`,
    l = new SyntaxError(String(s));
  return l.code = e, l.loc = t, l;
}
var Kt = e => e.type === 4 && e.isStatic;
function _h(e) {
  switch (e) {
    case "Teleport":
    case "teleport":
      return Co;
    case "Suspense":
    case "suspense":
      return _c;
    case "KeepAlive":
    case "keep-alive":
      return ua;
    case "BaseTransition":
    case "base-transition":
      return hh;
  }
}
var _y = /^$|^\d|[^\$\w\xA0-\uFFFF]/,
  Uc = e => !_y.test(e),
  Nh = /[A-Za-z_$\xA0-\uFFFF]/,
  Ny = /[\.\?\w$\xA0-\uFFFF]/,
  xy = /\s+[.[]\s*|\s*[.[]\s+/g,
  xh = e => e.type === 4 ? e.content : e.loc.source,
  Sy = e => {
    let t = xh(e).trim().replace(xy, p => p.trim()),
      n = 0,
      i = [],
      s = 0,
      l = 0,
      u = null;
    for (let p = 0; p < t.length; p++) {
      let g = t.charAt(p);
      switch (n) {
        case 0:
          if (g === "[") i.push(n), n = 1, s++;else if (g === "(") i.push(n), n = 2, l++;else if (!(p === 0 ? Nh : Ny).test(g)) return !1;
          break;
        case 1:
          g === "'" || g === '"' || g === "`" ? (i.push(n), n = 3, u = g) : g === "[" ? s++ : g === "]" && (--s || (n = i.pop()));
          break;
        case 2:
          if (g === "'" || g === '"' || g === "`") i.push(n), n = 3, u = g;else if (g === "(") l++;else if (g === ")") {
            if (p === t.length - 1) return !1;
            --l || (n = i.pop());
          }
          break;
        case 3:
          g === u && (n = i.pop(), u = null);
          break;
      }
    }
    return !s && !l;
  };
var Sh = Sy,
  Oy = /^\s*(?:async\s*)?(?:\([^)]*?\)|[\w$_]+)\s*(?::[^=]+)?=>|^\s*(?:async\s+)?function(?:\s+[\w$]+)?\s*\(/,
  Ty = e => Oy.test(xh(e));
var Cy = Ty;
function on(e, t, n = !1) {
  for (let i = 0; i < e.props.length; i++) {
    let s = e.props[i];
    if (s.type === 7 && (n || s.exp) && (Me(t) ? s.name === t : t.test(s.name))) return s;
  }
}
function Lo(e, t, n = !1, i = !1) {
  for (let s = 0; s < e.props.length; s++) {
    let l = e.props[s];
    if (l.type === 6) {
      if (n) continue;
      if (l.name === t && (l.value || i)) return l;
    } else if (l.name === "bind" && (l.exp || i) && Er(l.arg, t)) return l;
  }
}
function Er(e, t) {
  return !!(e && Kt(e) && e.content === t);
}
function Oh(e) {
  return e.props.some(t => t.type === 7 && t.name === "bind" && (!t.arg || t.arg.type !== 4 || !t.arg.isStatic));
}
function dc(e) {
  return e.type === 5 || e.type === 2;
}
function th(e) {
  return e.type === 7 && e.name === "pre";
}
function Ay(e) {
  return e.type === 7 && e.name === "slot";
}
function ha(e) {
  return e.type === 1 && e.tagType === 3;
}
function ma(e) {
  return e.type === 1 && e.tagType === 2;
}
var Dy = new Set([Do, Po]);
function jc(e, t = []) {
  if (e && !Me(e) && e.type === 14) {
    let n = e.callee;
    if (!Me(n) && Dy.has(n)) return jc(e.arguments[0], t.concat(e));
  }
  return [e, t];
}
function ga(e, t, n) {
  if (e.type !== 13 && Vy(e, t)) return;
  let i,
    s = e.type === 13 ? e.props : e.arguments[2],
    l = [],
    u;
  if (s && !Me(s) && s.type === 14) {
    let p = jc(s);
    s = p[0], l = p[1], u = l[l.length - 1];
  }
  if (s == null || Me(s)) i = wn([t]);else if (s.type === 14) {
    let p = s.arguments[0];
    !Me(p) && p.type === 15 ? bc(t, p) || p.properties.unshift(t) : s.callee === Rc ? i = Nt(n.helper(fa), [wn([t]), s]) : s.arguments.unshift(wn([t])), !i && (i = s);
  } else s.type === 15 ? (bc(t, s) || s.properties.unshift(t), i = s) : (i = Nt(n.helper(fa), [wn([t]), s]), u && u.callee === Po && (u = l[l.length - 2]));
  e.type === 13 ? u ? u.arguments[0] = i : e.props = i : u ? u.arguments[0] = i : e.arguments[2] = i;
}
function Vy(e, t) {
  var n, i, s;
  if (t.key.type !== 4 || t.key.content !== "key") return !1;
  let l = e.arguments[2];
  if (l && !Me(l)) {
    let [u] = jc(l);
    if (u && !Me(u) && u.type === 15 && bc(t, u)) return !0;
  }
  return (n = e.arguments)[2] || (n[2] = "{}"), (i = e.arguments)[3] || (i[3] = "undefined"), (s = e.arguments)[4] || (s[4] = "undefined"), e.arguments[5] = t.value, !0;
}
function bc(e, t) {
  let n = !1;
  if (e.key.type === 4) {
    let i = e.key.content;
    n = t.properties.some(s => s.key.type === 4 && s.key.content === i);
  }
  return n;
}
function $o(e, t) {
  return `_${t}_${e.replace(/[^\w]/g, (n, i) => n === "-" ? "_" : e.charCodeAt(i).toString())}`;
}
function $y(e) {
  return e.type === 14 && e.callee === Pc ? e.arguments[1].returns : e;
}
var Iy = /([\s\S]*?)\s+(?:in|of)\s+(\S[\s\S]*)/;
function Th(e) {
  for (let t = 0; t < e.length; t++) if (!cn(e.charCodeAt(t))) return !1;
  return !0;
}
function zc(e) {
  return e.type === 2 && Th(e.content) || e.type === 12 && zc(e.content);
}
function Hc(e) {
  return e.type === 3 || zc(e);
}
var Ch = {
    parseMode: "base",
    ns: 0,
    delimiters: ["{{", "}}"],
    getNamespace: () => 0,
    isVoidTag: cr,
    isPreTag: cr,
    isIgnoreNewlineTag: cr,
    isCustomElement: cr,
    onError: Fc,
    onWarn: Eh,
    comments: !1,
    prefixIdentifiers: !1
  },
  nt = Ch,
  Io = null,
  Qn = "",
  Bt = null,
  Ge = null,
  rn = "",
  Zn = -1,
  Jr = -1,
  Bc = 0,
  kr = !1,
  yc = null,
  ft = [],
  gt = new vc(ft, {
    onerr: Jn,
    ontext(e, t) {
      ia(Lt(e, t), e, t);
    },
    ontextentity(e, t, n) {
      ia(e, t, n);
    },
    oninterpolation(e, t) {
      if (kr) return ia(Lt(e, t), e, t);
      let n = e + gt.delimiterOpen.length,
        i = t - gt.delimiterClose.length;
      for (; cn(Qn.charCodeAt(n));) n++;
      for (; cn(Qn.charCodeAt(i - 1));) i--;
      let s = Lt(n, i);
      s.includes("&") && (s = nt.decodeEntities(s, !1)), wc({
        type: 5,
        content: aa(s, !1, bt(n, i)),
        loc: bt(e, t)
      });
    },
    onopentagname(e, t) {
      let n = Lt(e, t);
      Bt = {
        type: 1,
        tag: n,
        ns: nt.getNamespace(n, ft[0], nt.ns),
        tagType: 0,
        props: [],
        children: [],
        loc: bt(e - 1, t),
        codegenNode: void 0
      };
    },
    onopentagend(e) {
      rh(e);
    },
    onclosetag(e, t) {
      let n = Lt(e, t);
      if (!nt.isVoidTag(n)) {
        let i = !1;
        for (let s = 0; s < ft.length; s++) if (ft[s].tag.toLowerCase() === n.toLowerCase()) {
          i = !0, s > 0 && Jn(24, ft[0].loc.start.offset);
          for (let u = 0; u <= s; u++) {
            let p = ft.shift();
            sa(p, t, u < s);
          }
          break;
        }
        i || Jn(23, Ah(e, 60));
      }
    },
    onselfclosingtag(e) {
      let t = Bt.tag;
      Bt.isSelfClosing = !0, rh(e), ft[0] && ft[0].tag === t && sa(ft.shift(), e);
    },
    onattribname(e, t) {
      Ge = {
        type: 6,
        name: Lt(e, t),
        nameLoc: bt(e, t),
        value: void 0,
        loc: bt(e)
      };
    },
    ondirname(e, t) {
      let n = Lt(e, t),
        i = n === "." || n === ":" ? "bind" : n === "@" ? "on" : n === "#" ? "slot" : n.slice(2);
      if (!kr && i === "" && Jn(26, e), kr || i === "") Ge = {
        type: 6,
        name: n,
        nameLoc: bt(e, t),
        value: void 0,
        loc: bt(e)
      };else if (Ge = {
        type: 7,
        name: i,
        rawName: n,
        exp: void 0,
        arg: void 0,
        modifiers: n === "." ? [Ke("prop")] : [],
        loc: bt(e)
      }, i === "pre") {
        kr = gt.inVPre = !0, yc = Bt;
        let s = Bt.props;
        for (let l = 0; l < s.length; l++) s[l].type === 7 && (s[l] = By(s[l]));
      }
    },
    ondirarg(e, t) {
      if (e === t) return;
      let n = Lt(e, t);
      if (kr && !th(Ge)) Ge.name += n, Zr(Ge.nameLoc, t);else {
        let i = n[0] !== "[";
        Ge.arg = aa(i ? n : n.slice(1, -1), i, bt(e, t), i ? 3 : 0);
      }
    },
    ondirmodifier(e, t) {
      let n = Lt(e, t);
      if (kr && !th(Ge)) Ge.name += "." + n, Zr(Ge.nameLoc, t);else if (Ge.name === "slot") {
        let i = Ge.arg;
        i && (i.content += "." + n, Zr(i.loc, t));
      } else {
        let i = Ke(n, !0, bt(e, t));
        Ge.modifiers.push(i);
      }
    },
    onattribdata(e, t) {
      rn += Lt(e, t), Zn < 0 && (Zn = e), Jr = t;
    },
    onattribentity(e, t, n) {
      rn += e, Zn < 0 && (Zn = t), Jr = n;
    },
    onattribnameend(e) {
      let t = Ge.loc.start.offset,
        n = Lt(t, e);
      Ge.type === 7 && (Ge.rawName = n), Bt.props.some(i => (i.type === 7 ? i.rawName : i.name) === n) && Jn(2, t);
    },
    onattribend(e, t) {
      if (Bt && Ge) {
        if (Zr(Ge.loc, t), e !== 0) if (rn.includes("&") && (rn = nt.decodeEntities(rn, !0)), Ge.type === 6) Ge.name === "class" && (rn = Vh(rn).trim()), e === 1 && !rn && Jn(13, t), Ge.value = {
          type: 2,
          content: rn,
          loc: e === 1 ? bt(Zn, Jr) : bt(Zn - 1, Jr + 1)
        }, gt.inSFCRoot && Bt.tag === "template" && Ge.name === "lang" && rn && rn !== "html" && gt.enterRCDATA(pa("</template"), 0);else {
          let n = 0;
          Ge.exp = aa(rn, !1, bt(Zn, Jr), 0, n), Ge.name === "for" && (Ge.forParseResult = My(Ge.exp));
          let i = -1;
          Ge.name === "bind" && (i = Ge.modifiers.findIndex(s => s.content === "sync")) > -1 && Ii("COMPILER_V_BIND_SYNC", nt, Ge.loc, Ge.arg.loc.source) && (Ge.name = "model", Ge.modifiers.splice(i, 1));
        }
        (Ge.type !== 7 || Ge.name !== "pre") && Bt.props.push(Ge);
      }
      rn = "", Zn = Jr = -1;
    },
    oncomment(e, t) {
      nt.comments && wc({
        type: 3,
        content: Lt(e, t),
        loc: bt(e - 4, t + 3)
      });
    },
    onend() {
      let e = Qn.length;
      for (let t = 0; t < ft.length; t++) sa(ft[t], e - 1), Jn(24, ft[t].loc.start.offset);
    },
    oncdata(e, t) {
      (ft[0] ? ft[0].ns : nt.ns) !== 0 ? ia(Lt(e, t), e, t) : Jn(1, e - 9);
    },
    onprocessinginstruction(e) {
      (ft[0] ? ft[0].ns : nt.ns) === 0 && Jn(21, e - 1);
    }
  }),
  nh = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/,
  Ry = /^\(|\)$/g;
function My(e) {
  let t = e.loc,
    n = e.content,
    i = n.match(Iy);
  if (!i) return;
  let [, s, l] = i,
    u = (w, V, $ = !1) => {
      let j = t.start.offset + V,
        F = j + w.length;
      return aa(w, !1, bt(j, F), 0, $ ? 1 : 0);
    },
    p = {
      source: u(l.trim(), n.indexOf(l, s.length)),
      value: void 0,
      key: void 0,
      index: void 0,
      finalized: !1
    },
    g = s.trim().replace(Ry, "").trim(),
    _ = s.indexOf(g),
    x = g.match(nh);
  if (x) {
    g = g.replace(nh, "").trim();
    let w = x[1].trim(),
      V;
    if (w && (V = n.indexOf(w, _ + g.length), p.key = u(w, V, !0)), x[2]) {
      let $ = x[2].trim();
      $ && (p.index = u($, n.indexOf($, p.key ? V + w.length : _ + g.length), !0));
    }
  }
  return g && (p.value = u(g, _, !0)), p;
}
function Lt(e, t) {
  return Qn.slice(e, t);
}
function rh(e) {
  gt.inSFCRoot && (Bt.innerLoc = bt(e + 1, e + 1)), wc(Bt);
  let {
    tag: t,
    ns: n
  } = Bt;
  n === 0 && nt.isPreTag(t) && Bc++, nt.isVoidTag(t) ? sa(Bt, e) : (ft.unshift(Bt), (n === 1 || n === 2) && (gt.inXML = !0)), Bt = null;
}
function ia(e, t, n) {
  {
    let l = ft[0] && ft[0].tag;
    l !== "script" && l !== "style" && e.includes("&") && (e = nt.decodeEntities(e, !1));
  }
  let i = ft[0] || Io,
    s = i.children[i.children.length - 1];
  s && s.type === 2 ? (s.content += e, Zr(s.loc, n)) : i.children.push({
    type: 2,
    content: e,
    loc: bt(t, n)
  });
}
function sa(e, t, n = !1) {
  n ? Zr(e.loc, Ah(t, 60)) : Zr(e.loc, Py(t, 62) + 1), gt.inSFCRoot && (e.children.length ? e.innerLoc.end = Ue({}, e.children[e.children.length - 1].loc.end) : e.innerLoc.end = Ue({}, e.innerLoc.start), e.innerLoc.source = Lt(e.innerLoc.start.offset, e.innerLoc.end.offset));
  let {
    tag: i,
    ns: s,
    children: l
  } = e;
  if (kr || (i === "slot" ? e.tagType = 2 : ih(e) ? e.tagType = 3 : Fy(e) && (e.tagType = 1)), gt.inRCDATA || (e.children = Dh(l)), s === 0 && nt.isIgnoreNewlineTag(i)) {
    let u = l[0];
    u && u.type === 2 && (u.content = u.content.replace(/^\r?\n/, ""));
  }
  s === 0 && nt.isPreTag(i) && Bc--, yc === e && (kr = gt.inVPre = !1, yc = null), gt.inXML && (ft[0] ? ft[0].ns : nt.ns) === 0 && (gt.inXML = !1);
  {
    let u = e.props;
    if (!gt.inSFCRoot && ei("COMPILER_NATIVE_TEMPLATE", nt) && e.tag === "template" && !ih(e)) {
      let g = ft[0] || Io,
        _ = g.children.indexOf(e);
      g.children.splice(_, 1, ...e.children);
    }
    let p = u.find(g => g.type === 6 && g.name === "inline-template");
    p && Ii("COMPILER_INLINE_TEMPLATE", nt, p.loc) && e.children.length && (p.value = {
      type: 2,
      content: Lt(e.children[0].loc.start.offset, e.children[e.children.length - 1].loc.end.offset),
      loc: p.loc
    });
  }
}
function Py(e, t) {
  let n = e;
  for (; Qn.charCodeAt(n) !== t && n < Qn.length - 1;) n++;
  return n;
}
function Ah(e, t) {
  let n = e;
  for (; Qn.charCodeAt(n) !== t && n >= 0;) n--;
  return n;
}
var Ly = new Set(["if", "else", "else-if", "for", "slot"]);
function ih({
  tag: e,
  props: t
}) {
  if (e === "template") {
    for (let n = 0; n < t.length; n++) if (t[n].type === 7 && Ly.has(t[n].name)) return !0;
  }
  return !1;
}
function Fy({
  tag: e,
  props: t
}) {
  if (nt.isCustomElement(e)) return !1;
  if (e === "component" || Uy(e.charCodeAt(0)) || _h(e) || nt.isBuiltInComponent && nt.isBuiltInComponent(e) || nt.isNativeTag && !nt.isNativeTag(e)) return !0;
  for (let n = 0; n < t.length; n++) {
    let i = t[n];
    if (i.type === 6) {
      if (i.name === "is" && i.value) {
        if (i.value.content.startsWith("vue:")) return !0;
        if (Ii("COMPILER_IS_ON_ELEMENT", nt, i.loc)) return !0;
      }
    } else if (i.name === "bind" && Er(i.arg, "is") && Ii("COMPILER_IS_ON_ELEMENT", nt, i.loc)) return !0;
  }
  return !1;
}
function Uy(e) {
  return e > 64 && e < 91;
}
var jy = /\r\n/g;
function Dh(e) {
  let t = nt.whitespace !== "preserve",
    n = !1;
  for (let i = 0; i < e.length; i++) {
    let s = e[i];
    if (s.type === 2) if (Bc) s.content = s.content.replace(jy, `
`);else if (Th(s.content)) {
      let l = e[i - 1] && e[i - 1].type,
        u = e[i + 1] && e[i + 1].type;
      !l || !u || t && (l === 3 && (u === 3 || u === 1) || l === 1 && (u === 3 || u === 1 && zy(s.content))) ? (n = !0, e[i] = null) : s.content = " ";
    } else t && (s.content = Vh(s.content));
  }
  return n ? e.filter(Boolean) : e;
}
function zy(e) {
  for (let t = 0; t < e.length; t++) {
    let n = e.charCodeAt(t);
    if (n === 10 || n === 13) return !0;
  }
  return !1;
}
function Vh(e) {
  let t = "",
    n = !1;
  for (let i = 0; i < e.length; i++) cn(e.charCodeAt(i)) ? n || (t += " ", n = !0) : (t += e[i], n = !1);
  return t;
}
function wc(e) {
  (ft[0] || Io).children.push(e);
}
function bt(e, t) {
  return {
    start: gt.getPos(e),
    end: t == null ? t : gt.getPos(t),
    source: t == null ? t : Lt(e, t)
  };
}
function Hy(e) {
  return bt(e.start.offset, e.end.offset);
}
function Zr(e, t) {
  e.end = gt.getPos(t), e.source = Lt(e.start.offset, t);
}
function By(e) {
  let t = {
    type: 6,
    name: e.rawName,
    nameLoc: bt(e.loc.start.offset, e.loc.start.offset + e.rawName.length),
    value: void 0,
    loc: e.loc
  };
  if (e.exp) {
    let n = e.exp.loc;
    n.end.offset < e.loc.end.offset && (n.start.offset--, n.start.column--, n.end.offset++, n.end.column++), t.value = {
      type: 2,
      content: e.exp.content,
      loc: n
    };
  }
  return t;
}
function aa(e, t = !1, n, i = 0, s = 0) {
  return Ke(e, t, n, i);
}
function Jn(e, t, n) {
  nt.onError(lt(e, bt(t, t), void 0, n));
}
function Ky() {
  gt.reset(), Bt = null, Ge = null, rn = "", Zn = -1, Jr = -1, ft.length = 0;
}
function $h(e, t) {
  if (Ky(), Qn = e, nt = Ue({}, Ch), t) {
    let s;
    for (s in t) t[s] != null && (nt[s] = t[s]);
  }
  gt.mode = nt.parseMode === "html" ? 1 : nt.parseMode === "sfc" ? 2 : 0, gt.inXML = nt.ns === 1 || nt.ns === 2;
  let n = t && t.delimiters;
  n && (gt.delimiterOpen = pa(n[0]), gt.delimiterClose = pa(n[1]));
  let i = Io = wy([], e);
  return gt.parse(Qn), i.loc = bt(0, e.length), i.children = Dh(i.children), Io = null, i;
}
function Wy(e, t) {
  la(e, void 0, t, !!Ih(e));
}
function Ih(e) {
  let t = e.children.filter(n => n.type !== 3);
  return t.length === 1 && t[0].type === 1 && !ma(t[0]) ? t[0] : null;
}
function la(e, t, n, i = !1, s = !1) {
  let {
      children: l
    } = e,
    u = [];
  for (let x = 0; x < l.length; x++) {
    let w = l[x];
    if (w.type === 1 && w.tagType === 0) {
      let V = i ? 0 : sn(w, n);
      if (V > 0) {
        if (V >= 2) {
          w.codegenNode.patchFlag = -1, u.push(w);
          continue;
        }
      } else {
        let $ = w.codegenNode;
        if ($.type === 13) {
          let j = $.patchFlag;
          if ((j === void 0 || j === 512 || j === 1) && Mh(w, n) >= 2) {
            let F = Ph(w);
            F && ($.props = n.hoist(F));
          }
          $.dynamicProps && ($.dynamicProps = n.hoist($.dynamicProps));
        }
      }
    } else if (w.type === 12 && (i ? 0 : sn(w, n)) >= 2) {
      w.codegenNode.type === 14 && w.codegenNode.arguments.length > 0 && w.codegenNode.arguments.push("-1"), u.push(w);
      continue;
    }
    if (w.type === 1) {
      let V = w.tagType === 1;
      V && n.scopes.vSlot++, la(w, e, n, !1, s), V && n.scopes.vSlot--;
    } else if (w.type === 11) la(w, e, n, w.children.length === 1, !0);else if (w.type === 9) for (let V = 0; V < w.branches.length; V++) la(w.branches[V], e, n, w.branches[V].children.length === 1, s);
  }
  let p = !1;
  if (u.length === l.length && e.type === 1) {
    if (e.tagType === 0 && e.codegenNode && e.codegenNode.type === 13 && _e(e.codegenNode.children)) e.codegenNode.children = g(Qr(e.codegenNode.children)), p = !0;else if (e.tagType === 1 && e.codegenNode && e.codegenNode.type === 13 && e.codegenNode.children && !_e(e.codegenNode.children) && e.codegenNode.children.type === 15) {
      let x = _(e.codegenNode, "default");
      x && (x.returns = g(Qr(x.returns)), p = !0);
    } else if (e.tagType === 3 && t && t.type === 1 && t.tagType === 1 && t.codegenNode && t.codegenNode.type === 13 && t.codegenNode.children && !_e(t.codegenNode.children) && t.codegenNode.children.type === 15) {
      let x = on(e, "slot", !0),
        w = x && x.arg && _(t.codegenNode, x.arg);
      w && (w.returns = g(Qr(w.returns)), p = !0);
    }
  }
  if (!p) for (let x of u) x.codegenNode = n.cache(x.codegenNode);
  function g(x) {
    let w = n.cache(x);
    return w.needArraySpread = !0, w;
  }
  function _(x, w) {
    if (x.children && !_e(x.children) && x.children.type === 15) {
      let V = x.children.properties.find($ => $.key === w || $.key.content === w);
      return V && V.value;
    }
  }
  u.length && n.transformHoist && n.transformHoist(l, n, e);
}
function sn(e, t) {
  let {
    constantCache: n
  } = t;
  switch (e.type) {
    case 1:
      if (e.tagType !== 0) return 0;
      let i = n.get(e);
      if (i !== void 0) return i;
      let s = e.codegenNode;
      if (s.type !== 13 || s.isBlock && e.tag !== "svg" && e.tag !== "foreignObject" && e.tag !== "math") return 0;
      if (s.patchFlag === void 0) {
        let u = 3,
          p = Mh(e, t);
        if (p === 0) return n.set(e, 0), 0;
        p < u && (u = p);
        for (let g = 0; g < e.children.length; g++) {
          let _ = sn(e.children[g], t);
          if (_ === 0) return n.set(e, 0), 0;
          _ < u && (u = _);
        }
        if (u > 1) for (let g = 0; g < e.props.length; g++) {
          let _ = e.props[g];
          if (_.type === 7 && _.name === "bind" && _.exp) {
            let x = sn(_.exp, t);
            if (x === 0) return n.set(e, 0), 0;
            x < u && (u = x);
          }
        }
        if (s.isBlock) {
          for (let g = 0; g < e.props.length; g++) if (e.props[g].type === 7) return n.set(e, 0), 0;
          t.removeHelper(ti), t.removeHelper($i(t.inSSR, s.isComponent)), s.isBlock = !1, t.helper(Vi(t.inSSR, s.isComponent));
        }
        return n.set(e, u), u;
      } else return n.set(e, 0), 0;
    case 2:
    case 3:
      return 3;
    case 9:
    case 11:
    case 10:
      return 0;
    case 5:
    case 12:
      return sn(e.content, t);
    case 4:
      return e.constType;
    case 8:
      let l = 3;
      for (let u = 0; u < e.children.length; u++) {
        let p = e.children[u];
        if (Me(p) || kt(p)) continue;
        let g = sn(p, t);
        if (g === 0) return 0;
        g < l && (l = g);
      }
      return l;
    case 20:
      return 2;
    default:
      return 0;
  }
}
var Xy = new Set([$c, Ic, Do, Po]);
function Rh(e, t) {
  if (e.type === 14 && !Me(e.callee) && Xy.has(e.callee)) {
    let n = e.arguments[0];
    if (n.type === 4) return sn(n, t);
    if (n.type === 14) return Rh(n, t);
  }
  return 0;
}
function Mh(e, t) {
  let n = 3,
    i = Ph(e);
  if (i && i.type === 15) {
    let {
      properties: s
    } = i;
    for (let l = 0; l < s.length; l++) {
      let {
          key: u,
          value: p
        } = s[l],
        g = sn(u, t);
      if (g === 0) return g;
      g < n && (n = g);
      let _;
      if (p.type === 4 ? _ = sn(p, t) : p.type === 14 ? _ = Rh(p, t) : _ = 0, _ === 0) return _;
      _ < n && (n = _);
    }
  }
  return n;
}
function Ph(e) {
  let t = e.codegenNode;
  if (t.type === 13) return t.props;
}
function qy(e, {
  filename: t = "",
  prefixIdentifiers: n = !1,
  hoistStatic: i = !1,
  hmr: s = !1,
  cacheHandlers: l = !1,
  nodeTransforms: u = [],
  directiveTransforms: p = {},
  transformHoist: g = null,
  isBuiltInComponent: _ = ht,
  isCustomElement: x = ht,
  expressionPlugins: w = [],
  scopeId: V = null,
  slotted: $ = !0,
  ssr: j = !1,
  inSSR: F = !1,
  ssrCssVars: le = "",
  bindingMetadata: ue = Be,
  inline: W = !1,
  isTS: I = !1,
  onError: z = Fc,
  onWarn: L = Eh,
  compatConfig: te
}) {
  let se = t.replace(/\?.*$/, "").match(/([^/\\]+)\.\w+$/),
    ee = {
      filename: t,
      selfName: se && pn(Ze(se[1])),
      prefixIdentifiers: n,
      hoistStatic: i,
      hmr: s,
      cacheHandlers: l,
      nodeTransforms: u,
      directiveTransforms: p,
      transformHoist: g,
      isBuiltInComponent: _,
      isCustomElement: x,
      expressionPlugins: w,
      scopeId: V,
      slotted: $,
      ssr: j,
      inSSR: F,
      ssrCssVars: le,
      bindingMetadata: ue,
      inline: W,
      isTS: I,
      onError: z,
      onWarn: L,
      compatConfig: te,
      root: e,
      helpers: new Map(),
      components: new Set(),
      directives: new Set(),
      hoists: [],
      imports: [],
      cached: [],
      constantCache: new WeakMap(),
      vForMemoKeyedNodes: new WeakSet(),
      temps: 0,
      identifiers: Object.create(null),
      scopes: {
        vFor: 0,
        vSlot: 0,
        vPre: 0,
        vOnce: 0
      },
      parent: null,
      grandParent: null,
      currentNode: e,
      childIndex: 0,
      inVOnce: !1,
      helper(X) {
        let Z = ee.helpers.get(X) || 0;
        return ee.helpers.set(X, Z + 1), X;
      },
      removeHelper(X) {
        let Z = ee.helpers.get(X);
        if (Z) {
          let fe = Z - 1;
          fe ? ee.helpers.set(X, fe) : ee.helpers.delete(X);
        }
      },
      helperString(X) {
        return `_${Ai[ee.helper(X)]}`;
      },
      replaceNode(X) {
        ee.parent.children[ee.childIndex] = ee.currentNode = X;
      },
      removeNode(X) {
        let Z = ee.parent.children,
          fe = X ? Z.indexOf(X) : ee.currentNode ? ee.childIndex : -1;
        !X || X === ee.currentNode ? (ee.currentNode = null, ee.onNodeRemoved()) : ee.childIndex > fe && (ee.childIndex--, ee.onNodeRemoved()), ee.parent.children.splice(fe, 1);
      },
      onNodeRemoved: ht,
      addIdentifiers(X) {},
      removeIdentifiers(X) {},
      hoist(X) {
        Me(X) && (X = Ke(X)), ee.hoists.push(X);
        let Z = Ke(`_hoisted_${ee.hoists.length}`, !1, X.loc, 2);
        return Z.hoisted = X, Z;
      },
      cache(X, Z = !1, fe = !1) {
        let J = ky(ee.cached.length, X, Z, fe);
        return ee.cached.push(J), J;
      }
    };
  return ee.filters = new Set(), ee;
}
function Gy(e, t) {
  let n = qy(e, t);
  ba(e, n), t.hoistStatic && Wy(e, n), t.ssr || Yy(e, n), e.helpers = new Set([...n.helpers.keys()]), e.components = [...n.components], e.directives = [...n.directives], e.imports = n.imports, e.hoists = n.hoists, e.temps = n.temps, e.cached = n.cached, e.transformed = !0, e.filters = [...n.filters];
}
function Yy(e, t) {
  let {
      helper: n
    } = t,
    {
      children: i
    } = e;
  if (i.length === 1) {
    let s = Ih(e);
    if (s && s.codegenNode) {
      let l = s.codegenNode;
      l.type === 13 && Lc(l, t), e.codegenNode = l;
    } else e.codegenNode = i[0];
  } else if (i.length > 1) {
    let s = 64;
    e.codegenNode = Vo(t, n(Ao), void 0, e.children, s, void 0, void 0, !0, void 0, !1);
  }
}
function Jy(e, t) {
  let n = 0,
    i = () => {
      n--;
    };
  for (; n < e.children.length; n++) {
    let s = e.children[n];
    Me(s) || (t.grandParent = t.parent, t.parent = e, t.childIndex = n, t.onNodeRemoved = i, ba(s, t));
  }
}
function ba(e, t) {
  t.currentNode = e;
  let {
      nodeTransforms: n
    } = t,
    i = [];
  for (let l = 0; l < n.length; l++) {
    let u = n[l](e, t);
    if (u && (_e(u) ? i.push(...u) : i.push(u)), t.currentNode) e = t.currentNode;else return;
  }
  switch (e.type) {
    case 3:
      t.ssr || t.helper(Ro);
      break;
    case 5:
      t.ssr || t.helper(Mo);
      break;
    case 9:
      for (let l = 0; l < e.branches.length; l++) ba(e.branches[l], t);
      break;
    case 10:
    case 11:
    case 1:
    case 0:
      Jy(e, t);
      break;
  }
  t.currentNode = e;
  let s = i.length;
  for (; s--;) i[s]();
}
function Lh(e, t) {
  let n = Me(e) ? i => i === e : i => e.test(i);
  return (i, s) => {
    if (i.type === 1) {
      let {
        props: l
      } = i;
      if (i.tagType === 3 && l.some(Ay)) return;
      let u = [];
      for (let p = 0; p < l.length; p++) {
        let g = l[p];
        if (g.type === 7 && n(g.name)) {
          l.splice(p, 1), p--;
          let _ = t(i, g, s);
          _ && u.push(_);
        }
      }
      return u;
    }
  };
}
var ya = "/*@__PURE__*/",
  Fh = e => `${Ai[e]}: _${Ai[e]}`;
function Zy(e, {
  mode: t = "function",
  prefixIdentifiers: n = t === "module",
  sourceMap: i = !1,
  filename: s = "template.vue.html",
  scopeId: l = null,
  optimizeImports: u = !1,
  runtimeGlobalName: p = "Vue",
  runtimeModuleName: g = "vue",
  ssrRuntimeModuleName: _ = "vue/server-renderer",
  ssr: x = !1,
  isTS: w = !1,
  inSSR: V = !1
}) {
  let $ = {
    mode: t,
    prefixIdentifiers: n,
    sourceMap: i,
    filename: s,
    scopeId: l,
    optimizeImports: u,
    runtimeGlobalName: p,
    runtimeModuleName: g,
    ssrRuntimeModuleName: _,
    ssr: x,
    isTS: w,
    inSSR: V,
    source: e.source,
    code: "",
    column: 1,
    line: 1,
    offset: 0,
    indentLevel: 0,
    pure: !1,
    map: void 0,
    helper(F) {
      return `_${Ai[F]}`;
    },
    push(F, le = -2, ue) {
      $.code += F;
    },
    indent() {
      j(++$.indentLevel);
    },
    deindent(F = !1) {
      F ? --$.indentLevel : j(--$.indentLevel);
    },
    newline() {
      j($.indentLevel);
    }
  };
  function j(F) {
    $.push(`
` + "  ".repeat(F), 0);
  }
  return $;
}
function Qy(e, t = {}) {
  let n = Zy(e, t);
  t.onContextCreated && t.onContextCreated(n);
  let {
      mode: i,
      push: s,
      prefixIdentifiers: l,
      indent: u,
      deindent: p,
      newline: g,
      scopeId: _,
      ssr: x
    } = n,
    w = Array.from(e.helpers),
    V = w.length > 0,
    $ = !l && i !== "module";
  ew(e, n);
  let F = x ? "ssrRender" : "render",
    ue = (x ? ["_ctx", "_push", "_parent", "_attrs"] : ["_ctx", "_cache"]).join(", ");
  if (s(`function ${F}(${ue}) {`), u(), $ && (s("with (_ctx) {"), u(), V && (s(`const { ${w.map(Fh).join(", ")} } = _Vue
`, -1), g())), e.components.length && (pc(e.components, "component", n), (e.directives.length || e.temps > 0) && g()), e.directives.length && (pc(e.directives, "directive", n), e.temps > 0 && g()), e.filters && e.filters.length && (g(), pc(e.filters, "filter", n), g()), e.temps > 0) {
    s("let ");
    for (let W = 0; W < e.temps; W++) s(`${W > 0 ? ", " : ""}_temp${W}`);
  }
  return (e.components.length || e.directives.length || e.temps) && (s(`
`, 0), g()), x || s("return "), e.codegenNode ? Wt(e.codegenNode, n) : s("null"), $ && (p(), s("}")), p(), s("}"), {
    ast: e,
    code: n.code,
    preamble: "",
    map: n.map ? n.map.toJSON() : void 0
  };
}
function ew(e, t) {
  let {
      ssr: n,
      prefixIdentifiers: i,
      push: s,
      newline: l,
      runtimeModuleName: u,
      runtimeGlobalName: p,
      ssrRuntimeModuleName: g
    } = t,
    _ = p,
    x = Array.from(e.helpers);
  if (x.length > 0 && (s(`const _Vue = ${_}
`, -1), e.hoists.length)) {
    let w = [Nc, xc, Ro, Sc, vh].filter(V => x.includes(V)).map(Fh).join(", ");
    s(`const { ${w} } = _Vue
`, -1);
  }
  tw(e.hoists, t), l(), s("return ");
}
function pc(e, t, {
  helper: n,
  push: i,
  newline: s,
  isTS: l
}) {
  let u = n(t === "filter" ? Ac : t === "component" ? Oc : Cc);
  for (let p = 0; p < e.length; p++) {
    let g = e[p],
      _ = g.endsWith("__self");
    _ && (g = g.slice(0, -6)), i(`const ${$o(g, t)} = ${u}(${JSON.stringify(g)}${_ ? ", true" : ""})${l ? "!" : ""}`), p < e.length - 1 && s();
  }
}
function tw(e, t) {
  if (!e.length) return;
  t.pure = !0;
  let {
    push: n,
    newline: i
  } = t;
  i();
  for (let s = 0; s < e.length; s++) {
    let l = e[s];
    l && (n(`const _hoisted_${s + 1} = `), Wt(l, t), i());
  }
  t.pure = !1;
}
function Kc(e, t) {
  let n = e.length > 3 || !1;
  t.push("["), n && t.indent(), Fo(e, t, n), n && t.deindent(), t.push("]");
}
function Fo(e, t, n = !1, i = !0) {
  let {
    push: s,
    newline: l
  } = t;
  for (let u = 0; u < e.length; u++) {
    let p = e[u];
    Me(p) ? s(p, -3) : _e(p) ? Kc(p, t) : Wt(p, t), u < e.length - 1 && (n ? (i && s(","), l()) : i && s(", "));
  }
}
function Wt(e, t) {
  if (Me(e)) {
    t.push(e, -3);
    return;
  }
  if (kt(e)) {
    t.push(t.helper(e));
    return;
  }
  switch (e.type) {
    case 1:
    case 9:
    case 11:
      Wt(e.codegenNode, t);
      break;
    case 2:
      nw(e, t);
      break;
    case 4:
      Uh(e, t);
      break;
    case 5:
      rw(e, t);
      break;
    case 12:
      Wt(e.codegenNode, t);
      break;
    case 8:
      jh(e, t);
      break;
    case 3:
      ow(e, t);
      break;
    case 13:
      sw(e, t);
      break;
    case 14:
      lw(e, t);
      break;
    case 15:
      cw(e, t);
      break;
    case 17:
      uw(e, t);
      break;
    case 18:
      fw(e, t);
      break;
    case 19:
      dw(e, t);
      break;
    case 20:
      pw(e, t);
      break;
    case 21:
      Fo(e.body, t, !0, !1);
      break;
    case 22:
      break;
    case 23:
      break;
    case 24:
      break;
    case 25:
      break;
    case 26:
      break;
    case 10:
      break;
    default:
  }
}
function nw(e, t) {
  t.push(JSON.stringify(e.content), -3, e);
}
function Uh(e, t) {
  let {
    content: n,
    isStatic: i
  } = e;
  t.push(i ? JSON.stringify(n) : n, -3, e);
}
function rw(e, t) {
  let {
    push: n,
    helper: i,
    pure: s
  } = t;
  s && n(ya), n(`${i(Mo)}(`), Wt(e.content, t), n(")");
}
function jh(e, t) {
  for (let n = 0; n < e.children.length; n++) {
    let i = e.children[n];
    Me(i) ? t.push(i, -3) : Wt(i, t);
  }
}
function iw(e, t) {
  let {
    push: n
  } = t;
  if (e.type === 8) n("["), jh(e, t), n("]");else if (e.isStatic) {
    let i = Uc(e.content) ? e.content : JSON.stringify(e.content);
    n(i, -2, e);
  } else n(`[${e.content}]`, -3, e);
}
function ow(e, t) {
  let {
    push: n,
    helper: i,
    pure: s
  } = t;
  s && n(ya), n(`${i(Ro)}(${JSON.stringify(e.content)})`, -3, e);
}
function sw(e, t) {
  let {
      push: n,
      helper: i,
      pure: s
    } = t,
    {
      tag: l,
      props: u,
      children: p,
      patchFlag: g,
      dynamicProps: _,
      directives: x,
      isBlock: w,
      disableTracking: V,
      isComponent: $
    } = e,
    j;
  g && (j = String(g)), x && n(i(Dc) + "("), w && n(`(${i(ti)}(${V ? "true" : ""}), `), s && n(ya);
  let F = w ? $i(t.inSSR, $) : Vi(t.inSSR, $);
  n(i(F) + "(", -2, e), Fo(aw([l, u, p, j, _]), t), n(")"), w && n(")"), x && (n(", "), Wt(x, t), n(")"));
}
function aw(e) {
  let t = e.length;
  for (; t-- && e[t] == null;);
  return e.slice(0, t + 1).map(n => n || "null");
}
function lw(e, t) {
  let {
      push: n,
      helper: i,
      pure: s
    } = t,
    l = Me(e.callee) ? e.callee : i(e.callee);
  s && n(ya), n(l + "(", -2, e), Fo(e.arguments, t), n(")");
}
function cw(e, t) {
  let {
      push: n,
      indent: i,
      deindent: s,
      newline: l
    } = t,
    {
      properties: u
    } = e;
  if (!u.length) {
    n("{}", -2, e);
    return;
  }
  let p = u.length > 1 || !1;
  n(p ? "{" : "{ "), p && i();
  for (let g = 0; g < u.length; g++) {
    let {
      key: _,
      value: x
    } = u[g];
    iw(_, t), n(": "), Wt(x, t), g < u.length - 1 && (n(","), l());
  }
  p && s(), n(p ? "}" : " }");
}
function uw(e, t) {
  Kc(e.elements, t);
}
function fw(e, t) {
  let {
      push: n,
      indent: i,
      deindent: s
    } = t,
    {
      params: l,
      returns: u,
      body: p,
      newline: g,
      isSlot: _
    } = e;
  _ && n(`_${Ai[Mc]}(`), n("(", -2, e), _e(l) ? Fo(l, t) : l && Wt(l, t), n(") => "), (g || p) && (n("{"), i()), u ? (g && n("return "), _e(u) ? Kc(u, t) : Wt(u, t)) : p && Wt(p, t), (g || p) && (s(), n("}")), _ && (e.isNonScopedSlot && n(", undefined, true"), n(")"));
}
function dw(e, t) {
  let {
      test: n,
      consequent: i,
      alternate: s,
      newline: l
    } = e,
    {
      push: u,
      indent: p,
      deindent: g,
      newline: _
    } = t;
  if (n.type === 4) {
    let w = !Uc(n.content);
    w && u("("), Uh(n, t), w && u(")");
  } else u("("), Wt(n, t), u(")");
  l && p(), t.indentLevel++, l || u(" "), u("? "), Wt(i, t), t.indentLevel--, l && _(), l || u(" "), u(": ");
  let x = s.type === 19;
  x || t.indentLevel++, Wt(s, t), x || t.indentLevel--, l && g(!0);
}
function pw(e, t) {
  let {
      push: n,
      helper: i,
      indent: s,
      deindent: l,
      newline: u
    } = t,
    {
      needPauseTracking: p,
      needArraySpread: g
    } = e;
  g && n("[...("), n(`_cache[${e.index}] || (`), p && (s(), n(`${i(da)}(-1`), e.inVOnce && n(", true"), n("),"), u(), n("(")), n(`_cache[${e.index}] = `), Wt(e.value, t), p && (n(`).cacheIndex = ${e.index},`), u(), n(`${i(da)}(1),`), u(), n(`_cache[${e.index}]`), l()), n(")"), g && n(")]");
}
var Fk = new RegExp("\\b" + "arguments,await,break,case,catch,class,const,continue,debugger,default,delete,do,else,export,extends,finally,for,function,if,import,let,new,return,super,switch,throw,try,var,void,while,with,yield".split(",").join("\\b|\\b") + "\\b");
var hw = Lh(/^(?:if|else|else-if)$/, (e, t, n) => mw(e, t, n, (i, s, l) => {
  let u = n.parent.children,
    p = u.indexOf(i),
    g = 0;
  for (; p-- >= 0;) {
    let _ = u[p];
    _ && _.type === 9 && (g += _.branches.length);
  }
  return () => {
    if (l) i.codegenNode = sh(s, g, n);else {
      let _ = gw(i.codegenNode);
      _.alternate = sh(s, g + i.branches.length - 1, n);
    }
  };
}));
function mw(e, t, n, i) {
  if (t.name !== "else" && (!t.exp || !t.exp.content.trim())) {
    let s = t.exp ? t.exp.loc : e.loc;
    n.onError(lt(28, t.loc)), t.exp = Ke("true", !1, s);
  }
  if (t.name === "if") {
    let s = oh(e, t),
      l = {
        type: 9,
        loc: Hy(e.loc),
        branches: [s]
      };
    if (n.replaceNode(l), i) return i(l, s, !0);
  } else {
    let s = n.parent.children,
      l = [],
      u = s.indexOf(e);
    for (; u-- >= -1;) {
      let p = s[u];
      if (p && Hc(p)) {
        n.removeNode(p);
        continue;
      }
      if (p && p.type === 9) {
        (t.name === "else-if" || t.name === "else") && p.branches[p.branches.length - 1].condition === void 0 && n.onError(lt(30, e.loc)), n.removeNode();
        let g = oh(e, t);
        p.branches.push(g);
        let _ = i && i(p, g, !1);
        ba(g, n), _ && _(), n.currentNode = null;
      } else n.onError(lt(30, e.loc));
      break;
    }
  }
}
function oh(e, t) {
  let n = e.tagType === 3;
  return {
    type: 10,
    loc: e.loc,
    condition: t.name === "else" ? void 0 : t.exp,
    children: n && !on(e, "for") ? e.children : [e],
    userKey: Lo(e, "key"),
    isTemplateIf: n
  };
}
function sh(e, t, n) {
  return e.condition ? gc(e.condition, ah(e, t, n), Nt(n.helper(Ro), ['""', "true"])) : ah(e, t, n);
}
function ah(e, t, n) {
  let {
      helper: i
    } = n,
    s = yt("key", Ke(`${t}`, !1, un, 2)),
    {
      children: l
    } = e,
    u = l[0];
  if (l.length !== 1 || u.type !== 1) {
    if (l.length === 1 && u.type === 11) {
      let g = u.codegenNode;
      return ga(g, s, n), g;
    } else return Vo(n, i(Ao), wn([s]), l, 64, void 0, void 0, !0, !1, !1, e.loc);
  } else {
    let g = u.codegenNode,
      _ = $y(g);
    return _.type === 13 && Lc(_, n), ga(_, s, n), g;
  }
}
function gw(e) {
  for (;;) if (e.type === 19) {
    if (e.alternate.type === 19) e = e.alternate;else return e;
  } else e.type === 20 && (e = e.value);
}
var vw = Lh("for", (e, t, n) => {
  let {
    helper: i,
    removeHelper: s
  } = n;
  return bw(e, t, n, l => {
    let u = Nt(i(Vc), [l.source]),
      p = ha(e),
      g = on(e, "memo"),
      _ = Lo(e, "key", !1, !0);
    _ && _.type;
    let x = _ && (_.type === 6 ? _.value ? Ke(_.value.content, !0) : void 0 : _.exp),
      w = x ? yt("key", x) : null,
      V = l.source.type === 4 && l.source.constType > 0,
      $ = V ? 64 : _ ? 128 : 256;
    return l.codegenNode = Vo(n, i(Ao), void 0, u, $, void 0, void 0, !0, !V, !1, e.loc), () => {
      var j;
      let F,
        {
          children: le
        } = l,
        ue = le.length !== 1 || le[0].type !== 1,
        W = ma(e) ? e : p && e.children.length === 1 && ma(e.children[0]) ? e.children[0] : null;
      if (W) F = W.codegenNode, p && w && ga(F, w, n);else if (ue) F = Vo(n, i(Ao), w ? wn([w]) : void 0, e.children, 64, void 0, void 0, !0, void 0, !1);else {
        F = le[0].codegenNode, p && w && ga(F, w, n);
        let I = !V || F.isBlockRequired === !0;
        F.isBlock !== I && (F.isBlock ? (s(ti), s($i(n.inSSR, F.isComponent))) : s(Vi(n.inSSR, F.isComponent))), F.isBlock = I, F.isBlock ? (i(ti), i($i(n.inSSR, F.isComponent))) : (i(Vi(n.inSSR, F.isComponent)), F.needsPatch && (F.patchFlag = ((j = F.patchFlag) != null ? j : 0) | 512));
      }
      if (g) {
        let I = Di(kc(l.parseResult, [Ke("_cached")]));
        I.body = Ey([kn(["const _memo = (", g.exp, ")"]), kn(["if (_cached && _cached.el", ...(x ? [" && _cached.key === ", x] : []), ` && ${n.helperString(wh)}(_cached, _memo)) return _cached`]), kn(["const _item = ", F]), Ke("_item.memo = _memo"), Ke("return _item")]), u.arguments.push(I, Ke("_cache"), Ke(String(n.cached.length))), n.cached.push(null);
      } else u.arguments.push(Di(kc(l.parseResult), F, !0));
    };
  });
});
function bw(e, t, n, i) {
  if (!t.exp) {
    n.onError(lt(31, t.loc));
    return;
  }
  let s = t.forParseResult;
  if (!s) {
    n.onError(lt(32, t.loc));
    return;
  }
  zh(s, n);
  let {
      addIdentifiers: l,
      removeIdentifiers: u,
      scopes: p
    } = n,
    {
      source: g,
      value: _,
      key: x,
      index: w
    } = s,
    V = {
      type: 11,
      loc: t.loc,
      source: g,
      valueAlias: _,
      keyAlias: x,
      objectIndexAlias: w,
      parseResult: s,
      children: ha(e) ? e.children : [e]
    };
  n.replaceNode(V), p.vFor++;
  let $ = i && i(V);
  return () => {
    p.vFor--, $ && $();
  };
}
function zh(e, t) {
  e.finalized || (e.finalized = !0);
}
function kc({
  value: e,
  key: t,
  index: n
}, i = []) {
  return yw([e, t, n, ...i]);
}
function yw(e) {
  let t = e.length;
  for (; t-- && !e[t];);
  return e.slice(0, t + 1).map((n, i) => n || Ke("_".repeat(i + 1), !1));
}
var lh = Ke("undefined", !1),
  ww = (e, t) => {
    if (e.type === 1 && (e.tagType === 1 || e.tagType === 3)) {
      let n = on(e, "slot");
      if (n) return n.exp, t.scopes.vSlot++, () => {
        t.scopes.vSlot--;
      };
    }
  };
var kw = (e, t, n, i) => Di(e, n, !1, !0, n.length ? n[0].loc : i);
function Ew(e, t, n = kw) {
  t.helper(Mc);
  let {
      children: i,
      loc: s
    } = e,
    l = [],
    u = [],
    p = t.scopes.vSlot > 0 || t.scopes.vFor > 0,
    g = on(e, "slot", !0);
  if (g) {
    let {
      arg: le,
      exp: ue
    } = g;
    le && !Kt(le) && (p = !0), l.push(yt(le || Ke("default", !0), n(ue, void 0, i, s)));
  }
  let _ = !1,
    x = !1,
    w = [],
    V = new Set(),
    $ = 0;
  for (let le = 0; le < i.length; le++) {
    let ue = i[le],
      W;
    if (!ha(ue) || !(W = on(ue, "slot", !0))) {
      ue.type !== 3 && w.push(ue);
      continue;
    }
    if (g) {
      t.onError(lt(37, W.loc));
      break;
    }
    _ = !0;
    let {
        children: I,
        loc: z
      } = ue,
      {
        arg: L = Ke("default", !0),
        exp: te,
        loc: se
      } = W,
      ee;
    Kt(L) ? ee = L ? L.content : "default" : p = !0;
    let X = on(ue, "for"),
      Z = n(te, X, I, z),
      fe,
      J;
    if (fe = on(ue, "if")) p = !0, u.push(gc(fe.exp, oa(L, Z, $++), lh));else if (J = on(ue, /^else(?:-if)?$/, !0)) {
      let ve = le,
        pe;
      for (; ve-- && (pe = i[ve], !!Hc(pe)););
      if (pe && ha(pe) && on(pe, /^(?:else-)?if$/)) {
        let Ae = u[u.length - 1];
        for (; Ae.alternate.type === 19;) Ae = Ae.alternate;
        Ae.alternate = J.exp ? gc(J.exp, oa(L, Z, $++), lh) : oa(L, Z, $++);
      } else t.onError(lt(30, J.loc));
    } else if (X) {
      p = !0;
      let ve = X.forParseResult;
      ve ? (zh(ve, t), u.push(Nt(t.helper(Vc), [ve.source, Di(kc(ve), oa(L, Z), !0)]))) : t.onError(lt(32, X.loc));
    } else {
      if (ee) {
        if (V.has(ee)) {
          t.onError(lt(38, se));
          continue;
        }
        V.add(ee), ee === "default" && (x = !0);
      }
      l.push(yt(L, Z));
    }
  }
  if (!g) {
    let le = (ue, W) => {
      let I = n(ue, void 0, W, s);
      return t.compatConfig && (I.isNonScopedSlot = !0), yt("default", I);
    };
    _ ? w.length && !w.every(zc) && (x ? t.onError(lt(39, w[0].loc)) : l.push(le(void 0, w))) : l.push(le(void 0, i));
  }
  let j = p ? 2 : ca(e.children) ? 3 : 1,
    F = wn(l.concat(yt("_", Ke(j + "", !1))), s);
  return u.length && (F = Nt(t.helper(yh), [F, Qr(u)])), {
    slots: F,
    hasDynamicSlots: p
  };
}
function oa(e, t, n) {
  let i = [yt("name", e), yt("fn", t)];
  return n != null && i.push(yt("key", Ke(String(n), !0))), wn(i);
}
function ca(e) {
  for (let t = 0; t < e.length; t++) {
    let n = e[t];
    switch (n.type) {
      case 1:
        if (n.tagType === 2 || ca(n.children)) return !0;
        break;
      case 9:
        if (ca(n.branches)) return !0;
        break;
      case 10:
      case 11:
        if (ca(n.children)) return !0;
        break;
    }
  }
  return !1;
}
var Hh = new WeakMap(),
  _w = (e, t) => function () {
    if (e = t.currentNode, !(e.type === 1 && (e.tagType === 0 || e.tagType === 1))) return;
    let {
        tag: i,
        props: s
      } = e,
      l = e.tagType === 1,
      u = l ? Nw(e, t) : `"${i}"`,
      p = qe(u) && u.callee === Tc,
      g,
      _,
      x = 0,
      w,
      V,
      $,
      j = !1,
      F = !1,
      le = p || u === Co || u === _c || !l && (i === "svg" || i === "foreignObject" || i === "math");
    if (s.length > 0) {
      let W = Bh(e, t, void 0, l, p);
      g = W.props, x = W.patchFlag, V = W.dynamicPropNames, j = W.needsPatch, F = W.isBlockRequired;
      let I = W.directives;
      $ = I && I.length ? Qr(I.map(z => Sw(z, t))) : void 0, W.shouldUseBlock && (le = !0);
    }
    if (e.children.length > 0) if (u === ua && (le = !0, x |= 1024), l && u !== Co && u !== ua) {
      let {
        slots: I,
        hasDynamicSlots: z
      } = Ew(e, t);
      _ = I, z && (x |= 1024);
    } else if (e.children.length === 1 && u !== Co) {
      let I = e.children[0],
        z = I.type,
        L = z === 5 || z === 8;
      L && sn(I, t) === 0 && (x |= 1), L || z === 2 ? _ = I : _ = e.children;
    } else _ = e.children;
    V && V.length && (w = Ow(V));
    let ue = e.codegenNode = Vo(t, u, g, _, x === 0 ? void 0 : x, w, $, !!le, !1, l, e.loc);
    j = j && (x === 0 || x === 32), j && (ue.needsPatch = !0), F && (ue.isBlockRequired = !0);
  };
function Nw(e, t, n = !1) {
  let {
      tag: i
    } = e,
    s = Ec(i),
    l = Lo(e, "is", !1, !0);
  if (l) if (s || ei("COMPILER_IS_ON_ELEMENT", t)) {
    let p;
    if (l.type === 6 ? p = l.value && Ke(l.value.content, !0) : (p = l.exp, p || (p = Ke("is", !1, l.arg.loc))), p) return Nt(t.helper(Tc), [p]);
  } else l.type === 6 && l.value.content.startsWith("vue:") && (i = l.value.content.slice(4));
  let u = _h(i) || t.isBuiltInComponent(i);
  return u ? (n || t.helper(u), u) : (t.helper(Oc), t.components.add(i), $o(i, "component"));
}
function Bh(e, t, n = e.props, i, s, l = !1) {
  let {
      tag: u,
      loc: p,
      children: g
    } = e,
    _ = [],
    x = [],
    w = [],
    V = g.length > 0,
    $ = !1,
    j = !1,
    F = 0,
    le = !1,
    ue = !1,
    W = !1,
    I = !1,
    z = !1,
    L = !1,
    te = [],
    se = J => {
      _.length && (x.push(wn(ch(_), p)), _ = []), J && x.push(J);
    },
    ee = () => {
      t.scopes.vFor > 0 && _.push(yt(Ke("ref_for", !0), Ke("true")));
    },
    X = ({
      key: J,
      value: ve
    }) => {
      if (Kt(J)) {
        let pe = J.content,
          Ae = Tn(pe);
        if (Ae && (!i || s) && pe.toLowerCase() !== "onclick" && pe !== "onUpdate:modelValue" && !Nn(pe) && (I = !0), Ae && Nn(pe) && (L = !0), pe === "ref" && (le = !0), Ae && ve.type === 14 && (ve = ve.arguments[0]), ve.type === 20 || (ve.type === 4 || ve.type === 8) && sn(ve, t) > 0) return;
        pe === "class" ? ue = !0 : pe === "style" ? W = !0 : pe !== "ref" && pe !== "key" && !te.includes(pe) && te.push(pe), i && (pe === "class" || pe === "style") && !te.includes(pe) && te.push(pe);
      } else z = !0;
    };
  for (let J = 0; J < n.length; J++) {
    let ve = n[J];
    if (ve.type === 6) {
      let {
          loc: pe,
          name: Ae,
          nameLoc: ke,
          value: Te
        } = ve,
        Ce = !0;
      if (Ae === "ref" && (le = !0, ee()), Ae === "is" && (Ec(u) || Te && Te.content.startsWith("vue:") || ei("COMPILER_IS_ON_ELEMENT", t))) continue;
      _.push(yt(Ke(Ae, !0, ke), Ke(Te ? Te.content : "", Ce, Te ? Te.loc : pe)));
    } else {
      let {
          name: pe,
          arg: Ae,
          exp: ke,
          loc: Te,
          modifiers: Ce
        } = ve,
        Qe = pe === "bind",
        et = pe === "on";
      if (pe === "slot") {
        i || t.onError(lt(40, Te));
        continue;
      }
      if (pe === "once" || pe === "memo" || pe === "is" || Qe && Er(Ae, "is") && (Ec(u) || ei("COMPILER_IS_ON_ELEMENT", t)) || et && l) continue;
      if (Qe && Er(Ae, "key") && ($ = !0), et && V && Ae && Kt(Ae) && Ze(Ae.content) === "vue:beforeUpdate" && ($ = !0, j = !0), Qe && Er(Ae, "ref") && ee(), !Ae && (Qe || et)) {
        if (z = !0, ke) {
          if (Qe) {
            if (se(), ei("COMPILER_V_BIND_OBJECT_ORDER", t)) {
              x.unshift(ke);
              continue;
            }
            ee(), se(), x.push(ke);
          } else se({
            type: 14,
            loc: Te,
            callee: t.helper(Rc),
            arguments: i ? [ke] : [ke, "true"]
          });
        } else t.onError(lt(Qe ? 34 : 35, Te));
        continue;
      }
      Qe && Ce.some(it => it.content === "prop") && (F |= 32);
      let wt = t.directiveTransforms[pe];
      if (wt) {
        let {
          props: it,
          needRuntime: st
        } = wt(ve, e, t);
        !l && it.forEach(X), et && Ae && !Kt(Ae) ? se(wn(it, p)) : _.push(...it), st && (w.push(ve), kt(st) && Hh.set(ve, st));
      } else Za(pe) || (w.push(ve), V && ($ = !0, j = !0));
    }
  }
  let Z;
  x.length ? (se(), x.length > 1 ? Z = Nt(t.helper(fa), x, p) : Z = x[0]) : _.length && (Z = wn(ch(_), p)), z ? F |= 16 : (ue && !i && (F |= 2), W && !i && (F |= 4), te.length && (F |= 8), I && (F |= 32));
  let fe = (F === 0 || F === 32) && (le || L || w.length > 0);
  if (!$ && fe && (F |= 512), !t.inSSR && Z) switch (Z.type) {
    case 15:
      let J = -1,
        ve = -1,
        pe = !1;
      for (let Te = 0; Te < Z.properties.length; Te++) {
        let Ce = Z.properties[Te].key;
        Kt(Ce) ? Ce.content === "class" ? J = Te : Ce.content === "style" && (ve = Te) : Ce.isHandlerKey || (pe = !0);
      }
      let Ae = Z.properties[J],
        ke = Z.properties[ve];
      pe ? Z = Nt(t.helper(Do), [Z]) : (Ae && !Kt(Ae.value) && (Ae.value = Nt(t.helper($c), [Ae.value])), ke && (W || ke.value.type === 4 && ke.value.content.trim()[0] === "[" || ke.value.type === 17) && (ke.value = Nt(t.helper(Ic), [ke.value])));
      break;
    case 14:
      break;
    default:
      Z = Nt(t.helper(Do), [Nt(t.helper(Po), [Z])]);
      break;
  }
  return {
    props: Z,
    directives: w,
    patchFlag: F,
    dynamicPropNames: te,
    shouldUseBlock: $,
    needsPatch: fe,
    isBlockRequired: j
  };
}
function ch(e) {
  let t = new Map(),
    n = [];
  for (let i = 0; i < e.length; i++) {
    let s = e[i];
    if (s.key.type === 8 || !s.key.isStatic) {
      n.push(s);
      continue;
    }
    let l = s.key.content,
      u = t.get(l);
    u ? (l === "style" || l === "class" || Tn(l)) && xw(u, s) : (t.set(l, s), n.push(s));
  }
  return n;
}
function xw(e, t) {
  e.value.type === 17 ? e.value.elements.push(t.value) : e.value = Qr([e.value, t.value], e.loc);
}
function Sw(e, t) {
  let n = [],
    i = Hh.get(e);
  i ? n.push(t.helperString(i)) : (t.helper(Cc), t.directives.add(e.name), n.push($o(e.name, "directive")));
  let {
    loc: s
  } = e;
  if (e.exp && n.push(e.exp), e.arg && (e.exp || n.push("void 0"), n.push(e.arg)), Object.keys(e.modifiers).length) {
    e.arg || (e.exp || n.push("void 0"), n.push("void 0"));
    let l = Ke("true", !1, s);
    n.push(wn(e.modifiers.map(u => yt(u, l)), s));
  }
  return Qr(n, e.loc);
}
function Ow(e) {
  let t = "[";
  for (let n = 0, i = e.length; n < i; n++) t += JSON.stringify(e[n]), n < i - 1 && (t += ", ");
  return t + "]";
}
function Ec(e) {
  return e === "component" || e === "Component";
}
var Tw = (e, t) => {
  if (ma(e)) {
    let {
        children: n,
        loc: i
      } = e,
      {
        slotName: s,
        slotProps: l
      } = Cw(e, t),
      u = [t.prefixIdentifiers ? "_ctx.$slots" : "$slots", s, "{}", "undefined", "true"],
      p = 2;
    l && (u[2] = l, p = 3), n.length && (u[3] = Di([], n, !1, !1, i), p = 4), t.scopeId && !t.slotted && (p = 5), u.splice(p), e.codegenNode = Nt(t.helper(bh), u, i);
  }
};
function Cw(e, t) {
  let n = '"default"',
    i,
    s = [];
  for (let l = 0; l < e.props.length; l++) {
    let u = e.props[l];
    if (u.type === 6) u.value && (u.name === "name" ? n = JSON.stringify(u.value.content) : (u.name = Ze(u.name), s.push(u)));else if (u.name === "bind" && Er(u.arg, "name")) {
      if (u.exp) n = u.exp;else if (u.arg && u.arg.type === 4) {
        let p = Ze(u.arg.content);
        n = u.exp = Ke(p, !1, u.arg.loc);
      }
    } else u.name === "bind" && u.arg && Kt(u.arg) && (u.arg.content = Ze(u.arg.content)), s.push(u);
  }
  if (s.length > 0) {
    let {
      props: l,
      directives: u
    } = Bh(e, t, s, !1, !1);
    i = l, u.length && t.onError(lt(36, u[0].loc));
  }
  return {
    slotName: n,
    slotProps: i
  };
}
var Wc = (e, t, n, i) => {
    let {
      loc: s,
      modifiers: l,
      arg: u
    } = e;
    !e.exp && !l.length && n.onError(lt(35, s));
    let p;
    if (u.type === 4) {
      if (u.isStatic) {
        let w = u.content;
        w.startsWith("vue:") && (w = `vnode-${w.slice(4)}`);
        let V = t.tagType !== 0 || w.startsWith("vnode") || !/[A-Z]/.test(w) ? jn(Ze(w)) : `on:${w}`;
        p = Ke(V, !0, u.loc);
      } else p = kn([`${n.helperString(mc)}(`, u, ")"]);
    } else p = u, p.children.unshift(`${n.helperString(mc)}(`), p.children.push(")");
    let g = e.exp;
    g && !g.content.trim() && (g = void 0);
    let _ = n.cacheHandlers && !g && !n.inVOnce;
    if (g) {
      let w = Sh(g),
        V = !(w || Cy(g)),
        $ = g.content.includes(";");
      (V || _ && w) && (g = kn([`${V ? "$event" : "(...args)"} => ${$ ? "{" : "("}`, g, $ ? "}" : ")"]));
    }
    let x = {
      props: [yt(p, g || Ke("() => {}", !1, s))]
    };
    return i && (x = i(x)), _ && (x.props[0].value = n.cache(x.props[0].value)), x.props.forEach(w => w.key.isHandlerKey = !0), x;
  },
  Aw = (e, t, n) => {
    let {
        modifiers: i,
        loc: s
      } = e,
      l = e.arg,
      {
        exp: u
      } = e;
    return u && u.type === 4 && !u.content.trim() && (u = void 0), l.type !== 4 ? (l.children.unshift("("), l.children.push(') || ""')) : l.isStatic || (l.content = l.content ? `${l.content} || ""` : '""'), i.some(p => p.content === "camel") && (l.type === 4 ? l.isStatic ? l.content = Ze(l.content) : l.content = `${n.helperString(hc)}(${l.content})` : (l.children.unshift(`${n.helperString(hc)}(`), l.children.push(")"))), n.inSSR || (i.some(p => p.content === "prop") && uh(l, "."), i.some(p => p.content === "attr") && uh(l, "^")), {
      props: [yt(l, u)]
    };
  },
  uh = (e, t) => {
    e.type === 4 ? e.isStatic ? e.content = t + e.content : e.content = `\`${t}\${${e.content}}\`` : (e.children.unshift(`'${t}' + (`), e.children.push(")"));
  },
  Dw = (e, t) => {
    if (e.type === 0 || e.type === 1 || e.type === 11 || e.type === 10) return () => {
      let n = e.children,
        i,
        s = !1;
      for (let l = 0; l < n.length; l++) {
        let u = n[l];
        if (dc(u)) {
          s = !0;
          for (let p = l + 1; p < n.length; p++) {
            let g = n[p];
            if (dc(g)) i || (i = n[l] = kn([u], u.loc)), i.children.push(" + ", g), n.splice(p, 1), p--;else {
              i = void 0;
              break;
            }
          }
        }
      }
      if (!(!s || n.length === 1 && (e.type === 0 || e.type === 1 && e.tagType === 0 && !e.props.find(l => l.type === 7 && !t.directiveTransforms[l.name]) && e.tag !== "template"))) for (let l = 0; l < n.length; l++) {
        let u = n[l];
        if (dc(u) || u.type === 8) {
          let p = [];
          (u.type !== 2 || u.content !== " ") && p.push(u), !t.ssr && sn(u, t) === 0 && p.push("1"), n[l] = {
            type: 12,
            content: u,
            loc: u.loc,
            codegenNode: Nt(t.helper(Sc), p)
          };
        }
      }
    };
  },
  fh = new WeakSet(),
  Vw = (e, t) => {
    if (e.type === 1 && on(e, "once", !0)) return fh.has(e) || t.inVOnce || t.inSSR ? void 0 : (fh.add(e), t.inVOnce = !0, t.helper(da), () => {
      t.inVOnce = !1;
      let n = t.currentNode;
      n.codegenNode && (n.codegenNode = t.cache(n.codegenNode, !0, !0));
    });
  },
  Xc = (e, t, n) => {
    let {
      exp: i,
      arg: s
    } = e;
    if (!i) return n.onError(lt(41, e.loc)), To();
    let l = i.loc.source.trim(),
      u = i.type === 4 ? i.content : l,
      p = n.bindingMetadata[l];
    if (p === "props" || p === "props-aliased") return n.onError(lt(44, i.loc)), To();
    if (p === "literal-const" || p === "setup-const") return n.onError(lt(45, i.loc)), To();
    if (!u.trim() || !Sh(i)) return n.onError(lt(42, i.loc)), To();
    let g = s || Ke("modelValue", !0),
      _ = s ? Kt(s) ? `onUpdate:${Ze(s.content)}` : kn(['"onUpdate:" + ', s]) : "onUpdate:modelValue",
      x,
      w = n.isTS ? "($event: any)" : "$event";
    x = kn([`${w} => ((`, i, ") = $event)"]);
    let V = [yt(g, e.exp), yt(_, x)];
    if (e.modifiers.length && t.tagType === 1) {
      let $ = e.modifiers.map(F => F.content).map(F => (Uc(F) ? F : JSON.stringify(F)) + ": true").join(", "),
        j = s ? Kt(s) ? `${s.content}Modifiers` : kn([s, ' + "Modifiers"']) : "modelModifiers";
      V.push(yt(j, Ke(`{ ${$} }`, !1, e.loc, 2)));
    }
    return To(V);
  };
function To(e = []) {
  return {
    props: e
  };
}
var $w = /[\w).+\-_$\]]/,
  Iw = (e, t) => {
    ei("COMPILER_FILTERS", t) && (e.type === 5 ? va(e.content, t) : e.type === 1 && e.props.forEach(n => {
      n.type === 7 && n.name !== "for" && n.exp && va(n.exp, t);
    }));
  };
function va(e, t) {
  if (e.type === 4) dh(e, t);else for (let n = 0; n < e.children.length; n++) {
    let i = e.children[n];
    typeof i == "object" && (i.type === 4 ? dh(i, t) : i.type === 8 ? va(i, t) : i.type === 5 && va(i.content, t));
  }
}
function dh(e, t) {
  let n = e.content,
    i = !1,
    s = !1,
    l = !1,
    u = !1,
    p = 0,
    g = 0,
    _ = 0,
    x = 0,
    w,
    V,
    $,
    j,
    F = [];
  for ($ = 0; $ < n.length; $++) if (V = w, w = n.charCodeAt($), i) w === 39 && V !== 92 && (i = !1);else if (s) w === 34 && V !== 92 && (s = !1);else if (l) w === 96 && V !== 92 && (l = !1);else if (u) w === 47 && V !== 92 && (u = !1);else if (w === 124 && n.charCodeAt($ + 1) !== 124 && n.charCodeAt($ - 1) !== 124 && !p && !g && !_) j === void 0 ? (x = $ + 1, j = n.slice(0, $).trim()) : le();else {
    switch (w) {
      case 34:
        s = !0;
        break;
      case 39:
        i = !0;
        break;
      case 96:
        l = !0;
        break;
      case 40:
        _++;
        break;
      case 41:
        _--;
        break;
      case 91:
        g++;
        break;
      case 93:
        g--;
        break;
      case 123:
        p++;
        break;
      case 125:
        p--;
        break;
    }
    if (w === 47) {
      let ue = $ - 1,
        W;
      for (; ue >= 0 && (W = n.charAt(ue), W === " "); ue--);
      (!W || !$w.test(W)) && (u = !0);
    }
  }
  j === void 0 ? j = n.slice(0, $).trim() : x !== 0 && le();
  function le() {
    F.push(n.slice(x, $).trim()), x = $ + 1;
  }
  if (F.length) {
    for ($ = 0; $ < F.length; $++) j = Rw(j, F[$], t);
    e.content = j, e.ast = void 0;
  }
}
function Rw(e, t, n) {
  n.helper(Ac);
  let i = t.indexOf("(");
  if (i < 0) return n.filters.add(t), `${$o(t, "filter")}(${e})`;
  {
    let s = t.slice(0, i),
      l = t.slice(i + 1);
    return n.filters.add(s), `${$o(s, "filter")}(${e}${l !== ")" ? "," + l : l}`;
  }
}
var ph = new WeakSet(),
  Mw = (e, t) => {
    if (e.type === 1) {
      let n = on(e, "memo");
      return !n || ph.has(e) || t.inSSR ? void 0 : (ph.add(e), () => {
        let i = e.codegenNode || t.currentNode.codegenNode;
        i && i.type === 13 && (e.tagType !== 1 && Lc(i, t), e.codegenNode = Nt(t.helper(Pc), [n.exp, Di(void 0, i), "_cache", String(t.cached.length)]), t.cached.push(null));
      });
    }
  },
  Pw = (e, t) => {
    if (e.type === 1) {
      for (let n of e.props) if (n.type === 7 && n.name === "bind" && (!n.exp || n.exp.type === 4 && !n.exp.content.trim()) && n.arg) {
        let i = n.arg;
        if (i.type !== 4 || !i.isStatic) t.onError(lt(53, i.loc)), n.exp = Ke("", !0, i.loc);else {
          let s = Ze(i.content);
          (Nh.test(s[0]) || s[0] === "-") && (n.exp = Ke(s, !1, i.loc));
        }
      }
    }
  };
function Lw(e) {
  return [[Pw, Vw, hw, Mw, vw, Iw, Tw, _w, ww, Dw], {
    on: Wc,
    bind: Aw,
    model: Xc
  }];
}
function Kh(e, t = {}) {
  let n = t.onError || Fc,
    i = t.mode === "module";
  t.prefixIdentifiers === !0 ? n(lt(48)) : i && n(lt(49));
  let s = !1;
  t.cacheHandlers && n(lt(50)), t.scopeId && !i && n(lt(51));
  let l = Ue({}, t, {
      prefixIdentifiers: s
    }),
    u = Me(e) ? $h(e, l) : e,
    [p, g] = Lw();
  return Gy(u, Ue({}, l, {
    nodeTransforms: [...p, ...(t.nodeTransforms || [])],
    directiveTransforms: Ue({}, g, t.directiveTransforms || {})
  })), Qy(u, l);
}
var Wh = () => ({
  props: []
});
var qh = Symbol(""),
  Gh = Symbol(""),
  Yh = Symbol(""),
  Jh = Symbol(""),
  qc = Symbol(""),
  Zh = Symbol(""),
  Qh = Symbol(""),
  em = Symbol(""),
  tm = Symbol(""),
  nm = Symbol("");
kh({
  [qh]: "vModelRadio",
  [Gh]: "vModelCheckbox",
  [Yh]: "vModelText",
  [Jh]: "vModelSelect",
  [qc]: "vModelDynamic",
  [Zh]: "withModifiers",
  [Qh]: "withKeys",
  [em]: "vShow",
  [tm]: "Transition",
  [nm]: "TransitionGroup"
});
var Ri;
function Fw(e, t = !1) {
  return Ri || (Ri = document.createElement("div")), t ? (Ri.innerHTML = `<div foo="${e.replace(/"/g, "&quot;")}">`, Ri.children[0].getAttribute("foo")) : (Ri.innerHTML = e, Ri.textContent);
}
var Uw = {
    parseMode: "html",
    isVoidTag: rf,
    isNativeTag: e => el(e) || tl(e) || nl(e),
    isPreTag: e => e === "pre",
    isIgnoreNewlineTag: e => e === "pre" || e === "textarea",
    decodeEntities: Fw,
    isBuiltInComponent: e => {
      if (e === "Transition" || e === "transition") return tm;
      if (e === "TransitionGroup" || e === "transition-group") return nm;
    },
    getNamespace(e, t, n) {
      let i = t ? t.ns : n;
      if (t && i === 2) {
        if (t.tag === "annotation-xml") {
          if (e === "svg") return 1;
          t.props.some(s => s.type === 6 && s.name === "encoding" && s.value != null && (s.value.content === "text/html" || s.value.content === "application/xhtml+xml")) && (i = 0);
        } else /^m(?:[ions]|text)$/.test(t.tag) && e !== "mglyph" && e !== "malignmark" && (i = 0);
      } else t && i === 1 && (t.tag === "foreignObject" || t.tag === "desc" || t.tag === "title") && (i = 0);
      if (i === 0) {
        if (e === "svg") return 1;
        if (e === "math") return 2;
      }
      return i;
    }
  },
  jw = e => {
    e.type === 1 && e.props.forEach((t, n) => {
      t.type === 6 && t.name === "style" && t.value && (e.props[n] = {
        type: 7,
        name: "bind",
        arg: Ke("style", !0, t.loc),
        exp: zw(t.value.content, t.loc),
        modifiers: [],
        loc: t.loc
      });
    });
  },
  zw = (e, t) => {
    let n = Qa(e);
    return Ke(JSON.stringify(n), !1, t, 3);
  };
function er(e, t) {
  return lt(e, t, void 0);
}
var Hw = (e, t, n) => {
    let {
      exp: i,
      loc: s
    } = e;
    return i || n.onError(er(54, s)), t.children.length && (n.onError(er(55, s)), t.children.length = 0), {
      props: [yt(Ke("innerHTML", !0, s), i || Ke("", !0))]
    };
  },
  Bw = (e, t, n) => {
    let {
      exp: i,
      loc: s
    } = e;
    return i || n.onError(er(56, s)), t.children.length && (n.onError(er(57, s)), t.children.length = 0), {
      props: [yt(Ke("textContent", !0), i ? sn(i, n) > 0 ? i : Nt(n.helperString(Mo), [i], s) : Ke("", !0))]
    };
  },
  Kw = (e, t, n) => {
    let i = Xc(e, t, n);
    if (!i.props.length || t.tagType === 1) return i;
    e.arg && n.onError(er(59, e.arg.loc));
    function s() {
      let p = on(t, "bind");
      p && Er(p.arg, "value") && n.onError(er(61, p.loc));
    }
    let {
        tag: l
      } = t,
      u = n.isCustomElement(l);
    if (l === "input" || l === "textarea" || l === "select" || u) {
      let p = Yh,
        g = !1;
      if (l === "input" || u) {
        let _ = Lo(t, "type");
        if (_) {
          if (_.type === 7) p = qc;else if (_.value) switch (_.value.content) {
            case "radio":
              p = qh;
              break;
            case "checkbox":
              p = Gh;
              break;
            case "file":
              g = !0, n.onError(er(60, e.loc));
              break;
            default:
              break;
          }
        } else Oh(t) && (p = qc);
      } else l === "select" && (p = Jh);
      g || (i.needRuntime = n.helper(p));
    } else n.onError(er(58, e.loc));
    return i.props = i.props.filter(p => !(p.key.type === 4 && p.key.content === "modelValue")), i;
  },
  Ww = It("passive,once,capture"),
  Xw = It("stop,prevent,self,ctrl,shift,alt,meta,exact,middle"),
  qw = It("left,right"),
  rm = It("onkeyup,onkeydown,onkeypress"),
  Gw = (e, t, n, i) => {
    let s = [],
      l = [],
      u = [];
    for (let p = 0; p < t.length; p++) {
      let g = t[p].content;
      g === "native" && Ii("COMPILER_V_ON_NATIVE", n, i) || Ww(g) ? u.push(g) : qw(g) ? Kt(e) ? rm(e.content.toLowerCase()) ? s.push(g) : l.push(g) : (s.push(g), l.push(g)) : Xw(g) ? l.push(g) : s.push(g);
    }
    return {
      keyModifiers: s,
      nonKeyModifiers: l,
      eventOptionModifiers: u
    };
  },
  Xh = (e, t) => Kt(e) && e.content.toLowerCase() === "onclick" ? Ke(t, !0) : e.type !== 4 ? kn(["(", e, `) === "onClick" ? "${t}" : (`, e, ")"]) : e,
  Yw = (e, t, n) => Wc(e, t, n, i => {
    let {
      modifiers: s
    } = e;
    if (!s.length) return i;
    let {
        key: l,
        value: u
      } = i.props[0],
      {
        keyModifiers: p,
        nonKeyModifiers: g,
        eventOptionModifiers: _
      } = Gw(l, s, n, e.loc);
    if (g.includes("right") && (l = Xh(l, "onContextmenu")), g.includes("middle") && (l = Xh(l, "onMouseup")), g.length && (u = Nt(n.helper(Zh), [u, JSON.stringify(g)])), p.length && (!Kt(l) || rm(l.content.toLowerCase())) && (u = Nt(n.helper(Qh), [u, JSON.stringify(p)])), _.length) {
      let x = _.map(pn).join("");
      l = Kt(l) ? Ke(`${l.content}${x}`, !0) : kn(["(", l, `) + "${x}"`]);
    }
    return {
      props: [yt(l, u)]
    };
  }),
  Jw = (e, t, n) => {
    let {
      exp: i,
      loc: s
    } = e;
    return i || n.onError(er(62, s)), {
      props: [],
      needRuntime: n.helper(em)
    };
  };
var Zw = (e, t) => {
  e.type === 1 && e.tagType === 0 && (e.tag === "script" || e.tag === "style") && t.removeNode();
};
var Qw = [jw],
  ek = {
    cloak: Wh,
    html: Hw,
    text: Bw,
    model: Kw,
    on: Yw,
    show: Jw
  };
function im(e, t = {}) {
  return Kh(e, Ue({}, Uw, t, {
    nodeTransforms: [Zw, ...Qw, ...(t.nodeTransforms || [])],
    directiveTransforms: Ue({}, ek, t.directiveTransforms || {}),
    transformHoist: null
  }));
}
var om = Object.create(null);
function tk(e, t) {
  if (!Me(e)) if (e.nodeType) e = e.innerHTML;else return ht;
  let n = Qu(e, t),
    i = om[n];
  if (i) return i;
  if (e[0] === "#") {
    let g = document.querySelector(e);
    e = g ? g.innerHTML : "";
  }
  let s = Ue({
    hoistStatic: !0,
    onError: void 0,
    onWarn: ht
  }, t);
  !s.isCustomElement && typeof customElements < "u" && (s.isCustomElement = g => !!customElements.get(g));
  let {
    code: l
  } = im(e, s);
  function u(g, _ = !1) {
    let x = _ ? g.message : `Template compilation error: ${g.message}`,
      w = g.loc && tf(e, g.loc.start.offset, g.loc.end.offset);
    Ys(w ? `${x}
${w}` : x);
  }
  let p = new Function("Vue", l)(fc);
  return p._rc = !0, om[n] = p;
}
Ql(tk);
// ──── Library: @tailwindcss/browser 4.3.3 (Tailwind v4 in-browser compiler, preflight/theme CSS, style observer IIFE) (bundled from npm; unchanged, names left minified) ────
(() => {
  var e = "4.3.3";
  function t(r) {
    return {
      kind: "combinator",
      value: r
    };
  }
  function n(r) {
    return {
      kind: "complex",
      nodes: r
    };
  }
  function i(r) {
    return {
      kind: "compound",
      nodes: r
    };
  }
  function s(r, a) {
    return {
      kind: "function",
      value: r,
      nodes: a
    };
  }
  function l(r) {
    return {
      kind: "list",
      nodes: r
    };
  }
  function u(r) {
    return {
      kind: "selector",
      value: r
    };
  }
  function p(r) {
    return {
      kind: "value",
      value: r
    };
  }
  function g(r) {
    return r.kind === "selector" && r.value.charCodeAt(0) === ve;
  }
  function _(r) {
    if (r.kind !== "selector") return !1;
    switch (r.value.charCodeAt(0)) {
      case ve:
      case J:
      case ue:
      case z:
      case j:
      case L:
        return !1;
      default:
        return !0;
    }
  }
  function x(r, a = !1) {
    let c = "";
    for (let o of r) switch (o.kind) {
      case "selector":
      case "value":
        {
          c += o.value;
          break;
        }
      case "combinator":
        {
          a || o.value === " " ? c += o.value : c += ` ${o.value} `;
          break;
        }
      case "function":
        {
          c += `${o.value}(${x(o.nodes, a)})`;
          break;
        }
      case "complex":
      case "compound":
        {
          c += x(o.nodes, a);
          break;
        }
      case "list":
        {
          c += o.nodes.map(h => x([h], a)).join(a ? "," : ", ");
          break;
        }
    }
    return c;
  }
  var w = 92,
    V = 93,
    $ = 41,
    j = 58,
    F = 44,
    le = 34,
    ue = 46,
    W = 62,
    I = 10,
    z = 35,
    L = 91,
    te = 40,
    se = 43,
    ee = 39,
    X = 32,
    Z = 9,
    fe = 126,
    J = 38,
    ve = 42;
  function pe(r) {
    r = r.replaceAll(`\r
`, `
`);
    let a = [],
      c = a,
      o = !1,
      h = [],
      v = null,
      m = "",
      O;
    function S(k = c) {
      return k.length === 1 ? k[0] : o ? n(k) : i(k);
    }
    function y(k) {
      let b = c[c.length - 1];
      b?.kind === "compound" ? b.nodes.push(k) : b && b.kind !== "list" && b.kind !== "combinator" ? c[c.length - 1] = i([b, k]) : c.push(k);
    }
    for (let k = 0; k < r.length; k++) {
      let b = r.charCodeAt(k);
      switch (b) {
        case F:
          {
            for (m.length > 0 && (y(u(m)), m = ""); k + 1 < r.length && (O = r.charCodeAt(k + 1), !(O !== I && O !== X && O !== Z)); k++);
            if (v) v.nodes.push(S()), c = [], o = !1;else {
              let E = c.splice(0),
                A = S(E),
                T = l([A]);
              c.push(T), v = T, c = [], o = !1;
            }
            break;
          }
        case W:
        case I:
        case X:
        case se:
        case Z:
        case fe:
          {
            m.length > 0 && (y(u(m)), m = "");
            let E = k,
              A = k + 1;
            for (; A < r.length && (O = r.charCodeAt(A), !(O !== W && O !== I && O !== X && O !== se && O !== Z && O !== fe)); A++);
            k = A - 1;
            let T = r.slice(E, A).trim();
            if (T === "" && (c.length === 0 || A >= r.length || r.charCodeAt(A) === F)) break;
            c.push(t(T === "" ? " " : T)), o = !0;
            break;
          }
        case te:
          {
            let E = s(m, []);
            if (m = "", E.value !== ":not" && E.value !== ":where" && E.value !== ":has" && E.value !== ":is") {
              let A = k + 1,
                T = 0;
              for (let ne = k + 1; ne < r.length; ne++) {
                if (O = r.charCodeAt(ne), O === te) {
                  T++;
                  continue;
                }
                if (O === $) {
                  if (T === 0) {
                    k = ne;
                    break;
                  }
                  T--;
                }
              }
              let R = k,
                H = r.slice(A, R);
              if (E.value === ":nth-child" || E.value === ":nth-last-child") {
                let ne = H.indexOf("of ");
                if (ne !== -1) {
                  E.nodes.push(p(H.slice(0, ne + 3)), ...pe(H.slice(ne + 3))), m = "", k = R, y(E);
                  break;
                }
              }
              E.nodes.push(p(H)), m = "", k = R, y(E);
              break;
            }
            y(E), h.push({
              target: c,
              currentList: v,
              containsCombinator: o
            }), c = E.nodes, o = !1, v = null;
            break;
          }
        case $:
          {
            m.length > 0 && (y(u(m)), m = ""), v ? v.nodes.push(S()) : o && c.splice(0, c.length, n(c.splice(0)));
            let E = h.pop();
            c = E?.target ?? a, v = E?.currentList ?? null, o = E?.containsCombinator ?? !1;
            break;
          }
        case ue:
        case j:
        case z:
          {
            if (b === j && m === ":") {
              m += r[k];
              break;
            }
            m.length > 0 && y(u(m)), m = r[k];
            break;
          }
        case L:
          {
            m.length > 0 && (y(u(m)), m = "");
            let E = k,
              A = 0;
            for (let T = k + 1; T < r.length; T++) {
              if (O = r.charCodeAt(T), O === L) {
                A++;
                continue;
              }
              if (O === V) {
                if (A === 0) {
                  k = T;
                  break;
                }
                A--;
              }
            }
            y(u(r.slice(E, k + 1)));
            break;
          }
        case ee:
        case le:
          {
            let E = k;
            for (let A = k + 1; A < r.length; A++) if (O = r.charCodeAt(A), O === w) A += 1;else if (O === b) {
              k = A;
              break;
            }
            m += r.slice(E, k + 1);
            break;
          }
        case J:
        case ve:
          {
            m.length > 0 && (y(u(m)), m = ""), y(u(r[k]));
            break;
          }
        case w:
          {
            m += r[k] + r[k + 1], k += 1;
            break;
          }
        default:
          m += r[k];
      }
    }
    return m.length > 0 && y(u(m)), v ? v.nodes.push(S()) : o && c.splice(0, c.length, n(c.splice(0))), a;
  }
  function Ae(r) {
    let a = [0];
    for (let h = 0; h < r.length; h++) r.charCodeAt(h) === 10 && a.push(h + 1);
    function c(h) {
      let v = 0,
        m = a.length;
      for (; m > 0;) {
        let S = (m | 0) >> 1,
          y = v + S;
        a[y] <= h ? (v = y + 1, m = m - S - 1) : m = S;
      }
      v -= 1;
      let O = h - a[v];
      return {
        line: v + 1,
        column: O
      };
    }
    function o({
      line: h,
      column: v
    }) {
      h -= 1, h = Math.min(Math.max(h, 0), a.length - 1);
      let m = a[h],
        O = a[h + 1] ?? m;
      return Math.min(Math.max(m + v, 0), O);
    }
    return {
      find: c,
      findOffset: o
    };
  }
  var ke = 92,
    Te = 47,
    Ce = 42,
    Qe = 34,
    et = 39,
    wt = 58,
    it = 59,
    st = 10,
    tr = 13,
    _r = 32,
    Nr = 9,
    nr = 123,
    rr = 125,
    xr = 40,
    Mi = 41,
    ir = 91,
    Pi = 93,
    ni = 45,
    D = 64,
    P = 33,
    q = class sm extends Error {
      loc;
      constructor(a, c) {
        if (c) {
          let o = c[0],
            h = Ae(o.code).find(c[1]);
          a = `${o.file}:${h.line}:${h.column + 1}: ${a}`;
        }
        super(a), this.name = "CssSyntaxError", this.loc = c, Error.captureStackTrace && Error.captureStackTrace(this, sm);
      }
    };
  function ae(r, a) {
    let c = a?.from ? {
      file: a.from,
      code: r
    } : null;
    r[0] === "\uFEFF" && (r = " " + r.slice(1));
    let o = [],
      h = [],
      v = [],
      m = null,
      O = null,
      S = "",
      y = "",
      k = 0,
      b;
    for (let E = 0; E < r.length; E++) {
      let A = r.charCodeAt(E);
      if (!(A === tr && (b = r.charCodeAt(E + 1), b === st))) if (A === ke) S === "" && (k = E), S += r.slice(E, E + 2), E += 1;else if (A === Te && r.charCodeAt(E + 1) === Ce) {
        let T = E;
        for (let H = E + 2; H < r.length; H++) if (b = r.charCodeAt(H), b === ke) H += 1;else if (b === Ce && r.charCodeAt(H + 1) === Te) {
          E = H + 1;
          break;
        }
        let R = r.slice(T, E + 1);
        if (R.charCodeAt(2) === P) {
          let H = nu(R.slice(2, -2));
          h.push(H), c && (H.src = [c, T, E + 1], H.dst = [c, T, E + 1]);
        }
      } else if (A === et || A === Qe) {
        let T = we(r, E, A, c);
        S += r.slice(E, T + 1), E = T;
      } else {
        if ((A === _r || A === st || A === Nr) && (b = r.charCodeAt(E + 1)) && (b === _r || b === st || b === Nr || b === tr && (b = r.charCodeAt(E + 2)) && b == st)) continue;
        if (A === st) {
          if (S.length === 0) continue;
          b = S.charCodeAt(S.length - 1), b !== _r && b !== st && b !== Nr && (S += " ");
        } else if (A === ni && r.charCodeAt(E + 1) === ni && S.length === 0) {
          let T = "",
            R = E,
            H = -1;
          for (let B = E + 2; B < r.length; B++) if (b = r.charCodeAt(B), b === ke) B += 1;else if (b === et || b === Qe) B = we(r, B, b, c);else if (b === Te && r.charCodeAt(B + 1) === Ce) {
            for (let U = B + 2; U < r.length; U++) if (b = r.charCodeAt(U), b === ke) U += 1;else if (b === Ce && r.charCodeAt(U + 1) === Te) {
              B = U + 1;
              break;
            }
          } else if (H === -1 && b === wt) H = S.length + B - R;else if (b === it && T.length === 0) {
            S += r.slice(R, B), E = B;
            break;
          } else if (b === xr) T += ")";else if (b === ir) T += "]";else if (b === nr) T += "}";else if ((b === rr || r.length - 1 === B) && T.length === 0) {
            E = B - 1, S += r.slice(R, B);
            break;
          } else (b === Mi || b === Pi || b === rr) && T.length > 0 && r[B] === T[T.length - 1] && (T = T.slice(0, -1));
          let ne = ie(S, H);
          if (!ne) throw new q("Invalid custom property, expected a value", c ? [c, R, E] : null);
          c && (ne.src = [c, R, E], ne.dst = [c, R, E]), m ? m.nodes.push(ne) : o.push(ne), S = "";
        } else if (A === it && S.charCodeAt(0) === D) O = re(S), c && (O.src = [c, k, E], O.dst = [c, k, E]), m ? m.nodes.push(O) : o.push(O), S = "", O = null;else if (A === it && y[y.length - 1] !== ")") {
          let T = ie(S);
          if (!T) {
            if (S.length === 0) continue;
            throw new q(`Invalid declaration: \`${S.trim()}\``, c ? [c, k, E] : null);
          }
          c && (T.src = [c, k, E], T.dst = [c, k, E]), m ? m.nodes.push(T) : o.push(T), S = "";
        } else if (A === nr && y[y.length - 1] !== ")") y += "}", O = xt(S.trim()), c && (O.src = [c, k, E], O.dst = [c, k, E]), m && m.nodes.push(O), v.push(m), m = O, S = "", O = null;else if (A === rr && y[y.length - 1] !== ")") {
          if (y === "") throw new q("Missing opening {", c ? [c, E, E] : null);
          if (y = y.slice(0, -1), S.length > 0) if (S.charCodeAt(0) === D) O = re(S), c && (O.src = [c, k, E], O.dst = [c, k, E]), m ? m.nodes.push(O) : o.push(O), S = "", O = null;else {
            let R = S.indexOf(":");
            if (m) {
              let H = ie(S, R);
              if (!H) throw new q(`Invalid declaration: \`${S.trim()}\``, c ? [c, k, E] : null);
              c && (H.src = [c, k, E], H.dst = [c, k, E]), m.nodes.push(H);
            }
          }
          let T = v.pop() ?? null;
          T === null && m && o.push(m), m = T, S = "", O = null;
        } else if (A === xr) y += ")", S += "(";else if (A === Mi) {
          if (y[y.length - 1] !== ")") throw new q("Missing opening (", c ? [c, E, E] : null);
          y = y.slice(0, -1), S += ")";
        } else {
          if (S.length === 0 && (A === _r || A === st || A === Nr)) continue;
          S === "" && (k = E), S += String.fromCharCode(A);
        }
      }
    }
    if (S.charCodeAt(0) === D) {
      let E = re(S);
      c && (E.src = [c, k, r.length], E.dst = [c, k, r.length]), o.push(E);
    }
    if (y.length > 0 && m) {
      if (m.kind === "rule") throw new q(`Missing closing } at ${m.selector}`, m.src ? [m.src[0], m.src[1], m.src[1]] : null);
      if (m.kind === "at-rule") throw new q(`Missing closing } at ${m.name} ${m.params}`, m.src ? [m.src[0], m.src[1], m.src[1]] : null);
    }
    return h.length > 0 ? h.concat(o) : o;
  }
  function re(r, a = []) {
    let c = r,
      o = "";
    for (let h = 5; h < r.length; h++) {
      let v = r.charCodeAt(h);
      if (v === _r || v === Nr || v === xr) {
        c = r.slice(0, h), o = r.slice(h);
        break;
      }
    }
    return tt(c.trim(), o.trim(), a);
  }
  function ie(r, a = r.indexOf(":")) {
    if (a === -1) return null;
    let c = r.indexOf("!important", a + 1);
    return d(r.slice(0, a).trim(), r.slice(a + 1, c === -1 ? r.length : c).trim(), c !== -1);
  }
  function we(r, a, c, o = null) {
    let h;
    for (let v = a + 1; v < r.length; v++) if (h = r.charCodeAt(v), h === ke) v += 1;else {
      if (h === c) return v;
      if (h === it && (r.charCodeAt(v + 1) === st || r.charCodeAt(v + 1) === tr && r.charCodeAt(v + 2) === st)) throw new q(`Unterminated string: ${r.slice(a, v + 1) + String.fromCharCode(c)}`, o ? [o, a, v + 1] : null);
      if (h === st || h === tr && r.charCodeAt(v + 1) === st) throw new q(`Unterminated string: ${r.slice(a, v) + String.fromCharCode(c)}`, o ? [o, a, v + 1] : null);
    }
    return a;
  }
  function me(r) {
    if (arguments.length === 0) throw new TypeError("`CSS.escape` requires an argument.");
    let a = String(r),
      c = a.length,
      o = -1,
      h,
      v = "",
      m = a.charCodeAt(0);
    if (c === 1 && m === 45) return "\\" + a;
    for (; ++o < c;) {
      if (h = a.charCodeAt(o), h === 0) {
        v += "\uFFFD";
        continue;
      }
      if (h >= 1 && h <= 31 || h === 127 || o === 0 && h >= 48 && h <= 57 || o === 1 && h >= 48 && h <= 57 && m === 45) {
        v += "\\" + h.toString(16) + " ";
        continue;
      }
      if (h >= 128 || h === 45 || h === 95 || h >= 48 && h <= 57 || h >= 65 && h <= 90 || h >= 97 && h <= 122) {
        v += a.charAt(o);
        continue;
      }
      v += "\\" + a.charAt(o);
    }
    return v;
  }
  function de(r) {
    return r.replace(/\\([\dA-Fa-f]{1,6}[\t\n\f\r ]?|[\S\s])/g, a => {
      if (a.length <= 2) return a[1];
      let c = Number.parseInt(a.slice(1).trim(), 16);
      return c === 0 || c > 1114111 || c >= 55296 && c <= 57343 ? "\uFFFD" : String.fromCodePoint(c);
    });
  }
  var oe = new Map([["--font", ["--font-weight", "--font-size"]], ["--inset", ["--inset-shadow", "--inset-ring"]], ["--text", ["--text-color", "--text-decoration-color", "--text-decoration-thickness", "--text-indent", "--text-shadow", "--text-underline-offset"]], ["--grid-column", ["--grid-column-start", "--grid-column-end"]], ["--grid-row", ["--grid-row-start", "--grid-row-end"]]]);
  function Re(r, a) {
    return (oe.get(a) ?? []).some(c => r === c || r.startsWith(`${c}-`));
  }
  var Ne = class {
      constructor(r = new Map(), a = new Set([])) {
        this.values = r, this.keyframes = a;
      }
      values;
      keyframes;
      prefix = null;
      get size() {
        return this.values.size;
      }
      add(r, a, c = 0, o) {
        if (r.endsWith("-*")) {
          if (a !== "initial") throw new Error(`Invalid theme value \`${a}\` for namespace \`${r}\``);
          r === "--*" ? this.values.clear() : this.clearNamespace(r.slice(0, -2), 0);
        }
        if (c & 4) {
          let h = this.values.get(r);
          if (h && !(h.options & 4)) return;
        }
        a === "initial" ? this.values.delete(r) : this.values.set(r, {
          value: a,
          options: c,
          src: o
        });
      }
      keysInNamespaces(r) {
        let a = [];
        for (let c of r) {
          let o = `${c}-`;
          for (let h of this.values.keys()) h.startsWith(o) && h.indexOf("--", 2) === -1 && (Re(h, c) || a.push(h.slice(o.length)));
        }
        return a;
      }
      get(r) {
        for (let a of r) {
          let c = this.values.get(a);
          if (c) return c.value;
        }
        return null;
      }
      hasDefault(r) {
        return (this.getOptions(r) & 4) === 4;
      }
      getOptions(r) {
        return r = de(this.#n(r)), this.values.get(r)?.options ?? 0;
      }
      entries() {
        return this.prefix ? Array.from(this.values, r => (r[0] = this.prefixKey(r[0]), r)) : this.values.entries();
      }
      prefixKey(r) {
        return this.prefix ? `--${this.prefix}-${r.slice(2)}` : r;
      }
      #n(r) {
        return this.prefix ? `--${r.slice(3 + this.prefix.length)}` : r;
      }
      clearNamespace(r, a) {
        let c = oe.get(r) ?? [];
        e: for (let o of this.values.keys()) if (o.startsWith(r)) {
          if (a !== 0 && (this.getOptions(o) & a) !== a) continue;
          for (let h of c) if (o.startsWith(h)) continue e;
          this.values.delete(o);
        }
      }
      #e(r, a) {
        for (let c of a) {
          let o = r !== null ? `${c}-${r}` : c;
          if (!this.values.has(o)) if (r !== null && r.includes(".")) {
            if (o = `${c}-${r.replaceAll(".", "_")}`, !this.values.has(o)) continue;
          } else continue;
          if (!Re(o, c)) return o;
        }
        return null;
      }
      #t(r) {
        let a = this.values.get(r);
        if (!a) return null;
        let c = null;
        return a.options & 2 && (c = a.value), `var(${me(this.prefixKey(r))}${c ? `, ${c}` : ""})`;
      }
      markUsedVariable(r) {
        let a = de(this.#n(r)),
          c = this.values.get(a);
        if (!c) return !1;
        let o = c.options & 16;
        return c.options |= 16, !o;
      }
      resolve(r, a, c = 0) {
        let o = this.#e(r, a);
        if (!o) return null;
        let h = this.values.get(o);
        return (c | h.options) & 1 ? h.value : this.#t(o);
      }
      resolveValue(r, a) {
        let c = this.#e(r, a);
        return c ? this.values.get(c).value : null;
      }
      resolveWith(r, a, c = []) {
        let o = this.#e(r, a);
        if (!o) return null;
        let h = {};
        for (let m of c) {
          let O = `${o}${m}`,
            S = this.values.get(O);
          S && (S.options & 1 ? h[m] = S.value : h[m] = this.#t(O));
        }
        let v = this.values.get(o);
        return v.options & 1 ? [v.value, h] : [this.#t(o), h];
      }
      namespace(r) {
        let a = new Map(),
          c = `${r}-`;
        for (let [o, h] of this.values) o === r ? a.set(null, h.value) : o.startsWith(`${c}-`) ? a.set(o.slice(r.length), h.value) : o.startsWith(c) && a.set(o.slice(c.length), h.value);
        return a;
      }
      addKeyframes(r) {
        this.keyframes.add(r);
      }
      getKeyframes() {
        return Array.from(this.keyframes);
      }
    },
    be = class extends Map {
      constructor(r) {
        super(), this.factory = r;
      }
      factory;
      get(r) {
        let a = super.get(r);
        return a === void 0 && (a = this.factory(r, this), this.set(r, a)), a;
      }
    },
    Pe = new Uint8Array(256);
  function ye(r, a) {
    let c = 0,
      o = [],
      h = 0,
      v = r.length,
      m = a.charCodeAt(0);
    for (let O = 0; O < v; O++) {
      let S = r.charCodeAt(O);
      if (c === 0 && S === m) {
        o.push(r.slice(h, O)), h = O + 1;
        continue;
      }
      switch (S) {
        case 92:
          O += 1;
          break;
        case 39:
        case 34:
          for (; ++O < v;) {
            let y = r.charCodeAt(O);
            if (y === 92) {
              O += 1;
              continue;
            }
            if (y === S) break;
          }
          break;
        case 40:
          Pe[c] = 41, c++;
          break;
        case 91:
          Pe[c] = 93, c++;
          break;
        case 123:
          Pe[c] = 125, c++;
          break;
        case 93:
        case 125:
        case 41:
          c > 0 && S === Pe[c - 1] && c--;
          break;
      }
    }
    return o.push(r.slice(h)), o;
  }
  function Ye(r) {
    return {
      kind: "word",
      value: r
    };
  }
  function rt(r, a) {
    return {
      kind: "function",
      value: r,
      nodes: a
    };
  }
  function mt(r) {
    return {
      kind: "separator",
      value: r
    };
  }
  function je(r) {
    let a = "";
    for (let c of r) switch (c.kind) {
      case "word":
      case "separator":
        {
          a += c.value;
          break;
        }
      case "function":
        a += c.value + "(" + je(c.nodes) + ")";
    }
    return a;
  }
  var Zt = 92,
    Xt = 41,
    or = 58,
    Li = 44,
    qt = 34,
    an = 61,
    Fi = 62,
    Ui = 60,
    Jc = 10,
    um = 40,
    fm = 39,
    dm = 47,
    Zc = 32,
    Qc = 9;
  function ct(r) {
    r = r.replaceAll(`\r
`, `
`);
    let a = [],
      c = [],
      o = null,
      h = "",
      v;
    for (let m = 0; m < r.length; m++) {
      let O = r.charCodeAt(m);
      switch (O) {
        case Zt:
          {
            h += r[m] + r[m + 1], m++;
            break;
          }
        case dm:
          {
            if (h.length > 0) {
              let y = Ye(h);
              o ? o.nodes.push(y) : a.push(y), h = "";
            }
            let S = Ye(r[m]);
            o ? o.nodes.push(S) : a.push(S);
            break;
          }
        case or:
        case Li:
        case an:
        case Fi:
        case Ui:
        case Jc:
        case Zc:
        case Qc:
          {
            if (h.length > 0) {
              let b = Ye(h);
              o ? o.nodes.push(b) : a.push(b), h = "";
            }
            let S = m,
              y = m + 1;
            for (; y < r.length && (v = r.charCodeAt(y), !(v !== or && v !== Li && v !== an && v !== Fi && v !== Ui && v !== Jc && v !== Zc && v !== Qc)); y++);
            m = y - 1;
            let k = mt(r.slice(S, y));
            o ? o.nodes.push(k) : a.push(k);
            break;
          }
        case fm:
        case qt:
          {
            let S = m;
            for (let y = m + 1; y < r.length; y++) if (v = r.charCodeAt(y), v === Zt) y += 1;else if (v === O) {
              m = y;
              break;
            }
            h += r.slice(S, m + 1);
            break;
          }
        case um:
          {
            let S = rt(h, []);
            h = "", o ? o.nodes.push(S) : a.push(S), c.push(S), o = S;
            break;
          }
        case Xt:
          {
            let S = c.pop();
            if (h.length > 0) {
              let y = Ye(h);
              S?.nodes.push(y), h = "";
            }
            c.length > 0 ? o = c[c.length - 1] : o = null;
            break;
          }
        default:
          h += String.fromCharCode(O);
      }
    }
    return h.length > 0 && a.push(Ye(h)), a;
  }
  var Na = (r => (r[r.Continue = 0] = "Continue", r[r.Skip = 1] = "Skip", r[r.Stop = 2] = "Stop", r[r.Replace = 3] = "Replace", r[r.ReplaceSkip = 4] = "ReplaceSkip", r[r.ReplaceStop = 5] = "ReplaceStop", r))(Na || {}),
    Ee = {
      Continue: {
        kind: 0
      },
      Skip: {
        kind: 1
      },
      Stop: {
        kind: 2
      },
      Replace: r => ({
        kind: 3,
        nodes: Array.isArray(r) ? r : [r]
      }),
      ReplaceSkip: r => ({
        kind: 4,
        nodes: Array.isArray(r) ? r : [r]
      }),
      ReplaceStop: r => ({
        kind: 5,
        nodes: Array.isArray(r) ? r : [r]
      })
    };
  function De(r, a) {
    typeof a == "function" ? eu(r, a) : eu(r, a.enter, a.exit);
  }
  function eu(r, a = () => Ee.Continue, c = () => Ee.Continue) {
    let o = {
        value: [r, 0, null],
        prev: null
      },
      h = {
        parent: null,
        depth: 0,
        index: 0,
        siblings: r,
        path() {
          let v = [],
            m = o;
          for (; m;) {
            let O = m.value[2];
            O && v.push(O), m = m.prev;
          }
          return v.reverse(), v;
        }
      };
    for (; o !== null;) {
      let v = o.value,
        m = v[0],
        O = v[1],
        S = v[2];
      if (O >= m.length) {
        o = o.prev, h.depth -= 1;
        continue;
      }
      if (h.parent = S, h.siblings = m, O >= 0) {
        h.index = O;
        let E = m[O],
          A = a(E, h) ?? Ee.Continue;
        switch (A.kind) {
          case 0:
            {
              E.nodes && E.nodes.length > 0 && (h.depth += 1, o = {
                value: [E.nodes, 0, E],
                prev: o
              }), v[1] = ~O;
              continue;
            }
          case 2:
            return;
          case 1:
            {
              v[1] = ~O;
              continue;
            }
          case 3:
            {
              m.splice(O, 1, ...A.nodes);
              continue;
            }
          case 5:
            {
              m.splice(O, 1, ...A.nodes);
              return;
            }
          case 4:
            {
              m.splice(O, 1, ...A.nodes), v[1] += A.nodes.length;
              continue;
            }
          default:
            throw new Error(`Invalid \`WalkAction.${Na[A.kind] ?? `Unknown(${A.kind})`}\` in enter.`);
        }
      }
      let y = ~O;
      h.index = y;
      let k = m[y],
        b = c(k, h) ?? Ee.Continue;
      switch (b.kind) {
        case 0:
          v[1] = y + 1;
          continue;
        case 2:
          return;
        case 3:
          {
            m.splice(y, 1, ...b.nodes), v[1] = y + b.nodes.length;
            continue;
          }
        case 5:
          {
            m.splice(y, 1, ...b.nodes);
            return;
          }
        case 4:
          {
            m.splice(y, 1, ...b.nodes), v[1] = y + b.nodes.length;
            continue;
          }
        default:
          throw new Error(`Invalid \`WalkAction.${Na[b.kind] ?? `Unknown(${b.kind})`}\` in exit.`);
      }
    }
  }
  var pm = new be(r => {
    let a = [];
    return De(ct(r), c => {
      if (!(c.kind !== "function" || c.value !== "var")) return De(c.nodes, o => {
        o.kind !== "word" || o.value[0] !== "-" || o.value[1] !== "-" || a.push(o.value);
      }), Ee.Skip;
    }), a;
  });
  function tu(r) {
    return pm.get(r);
  }
  var hm = 64,
    mm = 124;
  function ot(r, a = []) {
    return {
      kind: "rule",
      selector: r,
      nodes: a
    };
  }
  function tt(r, a = "", c = []) {
    return {
      kind: "at-rule",
      name: r,
      params: a,
      nodes: c
    };
  }
  function xt(r, a = []) {
    return r.charCodeAt(0) === hm ? re(r, a) : ot(r, a);
  }
  function d(r, a, c = !1) {
    return {
      kind: "declaration",
      property: r,
      value: a,
      important: c
    };
  }
  function nu(r) {
    return {
      kind: "comment",
      value: r
    };
  }
  function Sr(r, a) {
    return {
      kind: "context",
      context: r,
      nodes: a
    };
  }
  function We(r) {
    return {
      kind: "at-root",
      nodes: r
    };
  }
  function fn(r) {
    switch (r.kind) {
      case "rule":
        return {
          kind: r.kind,
          selector: r.selector,
          nodes: r.nodes.map(fn),
          src: r.src,
          dst: r.dst
        };
      case "at-rule":
        return {
          kind: r.kind,
          name: r.name,
          params: r.params,
          nodes: r.nodes.map(fn),
          src: r.src,
          dst: r.dst
        };
      case "at-root":
        return {
          kind: r.kind,
          nodes: r.nodes.map(fn),
          src: r.src,
          dst: r.dst
        };
      case "context":
        return {
          kind: r.kind,
          context: {
            ...r.context
          },
          nodes: r.nodes.map(fn),
          src: r.src,
          dst: r.dst
        };
      case "declaration":
        return {
          kind: r.kind,
          property: r.property,
          value: r.value,
          important: r.important,
          src: r.src,
          dst: r.dst
        };
      case "comment":
        return {
          kind: r.kind,
          value: r.value,
          src: r.src,
          dst: r.dst
        };
      default:
        throw new Error(`Unknown node kind: ${r.kind}`);
    }
  }
  function xa(r) {
    return {
      depth: r.depth,
      index: r.index,
      siblings: r.siblings,
      get context() {
        let a = {};
        for (let c of r.path()) c.kind === "context" && Object.assign(a, c.context);
        return Object.defineProperty(this, "context", {
          value: a
        }), a;
      },
      get parent() {
        let a = this.path().pop() ?? null;
        return Object.defineProperty(this, "parent", {
          value: a
        }), a;
      },
      path() {
        return r.path().filter(a => a.kind !== "context");
      }
    };
  }
  function ji(r, a, c = 3) {
    let o = [],
      h = new Set(),
      v = new be(() => new Set()),
      m = new be(() => new Set()),
      O = new Set(),
      S = new Set(),
      y = [],
      k = [],
      b = new be(() => new Set());
    function E(T, R, H = {}, ne = 0) {
      if (T.kind === "declaration") {
        if (T.property === "--tw-sort" || T.value === void 0 || T.value === null) return;
        if (H.theme && T.property[0] === "-" && T.property[1] === "-") {
          if (T.value === "initial") {
            T.value = void 0;
            return;
          }
          H.keyframes || v.get(R).add(T);
        }
        if (T.value.includes("var(")) if (H.theme && T.property[0] === "-" && T.property[1] === "-") for (let B of tu(T.value)) b.get(B).add(T.property);else a.trackUsedVariables(T.value);
        if (T.property === "animation") for (let B of iu(T.value)) S.add(B);
        c & 2 && !H.supportsColorMix && !H.keyframes && T.value.includes("color-mix(") && m.get(R).add(T), R.push(T);
      } else if (T.kind === "rule") {
        let B = [];
        for (let U of T.nodes) E(U, B, H, ne + 1);
        B.length > 0 && R.push({
          ...T,
          nodes: B
        });
      } else if (T.kind === "at-rule" && T.name === "@property" && ne === 0) {
        if (h.has(T.params)) return;
        if (c & 1) {
          let U = T.params,
            Oe = null,
            Ve = !1;
          for (let Se of T.nodes) Se.kind === "declaration" && (Se.property === "initial-value" ? Oe = Se.value : Se.property === "inherits" && (Ve = Se.value === "true"));
          let Ie = d(U, Oe ?? "initial");
          Ie.src = T.src, Ve ? y.push(Ie) : k.push(Ie);
        }
        h.add(T.params);
        let B = {
          ...T,
          nodes: []
        };
        for (let U of T.nodes) E(U, B.nodes, H, ne + 1);
        R.push(B);
      } else if (T.kind === "at-rule") {
        T.name === "@keyframes" ? H = {
          ...H,
          keyframes: !0
        } : T.name === "@supports" && T.params.includes("color-mix(") && (H = {
          ...H,
          supportsColorMix: !0
        });
        let B = {
          ...T,
          nodes: []
        };
        for (let U of T.nodes) E(U, B.nodes, H, ne + 1);
        T.name === "@keyframes" && H.theme && O.add(B), (B.nodes.length > 0 || B.name === "@layer" || B.name === "@charset" || B.name === "@custom-media" || B.name === "@namespace" || B.name === "@import" || B.name === "@apply") && R.push(B);
      } else if (T.kind === "at-root") for (let B of T.nodes) {
        let U = [];
        E(B, U, H, 0);
        for (let Oe of U) o.push(Oe);
      } else if (T.kind === "context") {
        if (T.context.reference) return;
        for (let B of T.nodes) E(B, R, {
          ...H,
          ...T.context
        }, ne);
      } else T.kind === "comment" && R.push(T);
    }
    let A = [];
    for (let T of r) E(T, A, {}, 0);
    e: for (let [T, R] of v) for (let H of R) {
      if (ru(H.property, a.theme, b)) {
        if (H.property.startsWith(a.theme.prefixKey("--animate-"))) for (let B of iu(H.value)) S.add(B);
        continue;
      }
      let ne = T.indexOf(H);
      if (T.splice(ne, 1), T.length === 0) {
        let B = ym(A, U => U.kind === "rule" && U.nodes === T);
        if (!B || B.length === 0) continue e;
        B.unshift({
          kind: "at-root",
          nodes: A
        });
        do {
          let U = B.pop();
          if (!U) break;
          let Oe = B[B.length - 1];
          if (!Oe || Oe.kind !== "at-root" && Oe.kind !== "at-rule") break;
          let Ve = Oe.nodes.indexOf(U);
          if (Ve === -1) break;
          Oe.nodes.splice(Ve, 1);
        } while (!0);
        continue e;
      }
    }
    for (let T of O) if (!S.has(T.params)) {
      let R = o.indexOf(T);
      o.splice(R, 1);
    }
    if (A = A.concat(o), c & 2) for (let [T, R] of m) for (let H of R) {
      let ne = T.indexOf(H);
      if (ne === -1 || H.value == null) continue;
      let B = ct(H.value),
        U = !1;
      if (De(B, Ie => {
        if (Ie.kind !== "function" || Ie.value !== "color-mix") return;
        let Se = !1,
          ge = !1;
        if (De(Ie.nodes, Le => {
          if (Le.kind == "word" && Le.value.toLowerCase() === "currentcolor") {
            ge = !0, U = !0;
            return;
          }
          let ze = Le,
            Fe = null,
            At = new Set();
          do {
            if (ze.kind !== "function" || ze.value !== "var") return;
            let Gt = ze.nodes[0];
            if (!Gt || Gt.kind !== "word") return;
            let f = Gt.value;
            if (At.has(f)) {
              Se = !0;
              return;
            }
            if (At.add(f), U = !0, Fe = a.theme.resolveValue(null, [Gt.value]), !Fe) {
              Se = !0;
              return;
            }
            if (Fe.toLowerCase() === "currentcolor") {
              ge = !0;
              return;
            }
            Fe.startsWith("var(") ? ze = ct(Fe)[0] : ze = null;
          } while (ze);
          return Ee.Replace({
            kind: "word",
            value: Fe
          });
        }), Se || ge) {
          let Le = Ie.nodes.findIndex(Fe => Fe.kind === "separator" && Fe.value.trim().includes(","));
          if (Le === -1) return;
          let ze = Ie.nodes.length > Le ? Ie.nodes[Le + 1] : null;
          return ze ? Ee.Replace(ze) : void 0;
        } else if (U) {
          let Le = Ie.nodes[2];
          Le.kind === "word" && (Le.value === "oklab" || Le.value === "oklch" || Le.value === "lab" || Le.value === "lch") && (Le.value = "srgb");
        }
      }), !U) continue;
      let Oe = {
          ...H,
          value: je(B)
        },
        Ve = xt("@supports (color: color-mix(in lab, red, red))", [H]);
      Ve.src = H.src, T.splice(ne, 1, Oe, Ve);
    }
    if (c & 1) {
      let T = [];
      if (y.length > 0) {
        let R = xt(":root, :host", y);
        R.src = y[0].src, T.push(R);
      }
      if (k.length > 0) {
        let R = xt("*, ::before, ::after, ::backdrop", k);
        R.src = k[0].src, T.push(R);
      }
      if (T.length > 0) {
        let R = A.findIndex(B => !(B.kind === "comment" || B.kind === "at-rule" && (B.name === "@charset" || B.name === "@import"))),
          H = tt("@layer", "properties", []);
        H.src = T[0].src, A.splice(R < 0 ? A.length : R, 0, H);
        let ne = xt("@layer properties", [tt("@supports", "((-webkit-hyphens: none) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color:rgb(from red r g b))))", T)]);
        ne.src = T[0].src, ne.nodes[0].src = T[0].src, A.push(ne);
      }
    }
    return gm(A);
  }
  function gm(r) {
    let a = new be(pe),
      c = [],
      o = [],
      h = null,
      v = new Set(),
      m = new Set(),
      O = [],
      S = new Set();
    De(r, {
      enter(k) {
        switch (k.kind) {
          case "rule":
            {
              if (h = null, c.length === 0) {
                if (k.selector.includes("&")) {
                  let b = pe(k.selector),
                    E = !1;
                  De(b, A => {
                    A.kind === "selector" && A.value === "&" && (E = !0, A.value = ":scope");
                  }), E ? c.push([x(b), k.src, k.dst]) : c.push([k.selector, k.src, k.dst]);
                } else c.push([k.selector, k.src, k.dst]);
              } else {
                if (k.selector === "&") {
                  S.add(k);
                  return;
                }
                let b = c[c.length - 1][0],
                  E = ye(k.selector, ",").map(A => {
                    if (!A.includes("&")) {
                      let T = a.get(b);
                      return `${T.length === 1 && T[0].kind === "list" ? `:is(${b})` : b} ${A}`;
                    }
                    {
                      let T = pe(A),
                        R = !1;
                      if (De(T, {
                        enter(ne, B) {
                          if (ne.kind !== "selector" || ne.value !== "&" || (R = !0, ne.value = `:is(${b})`, B.parent === null)) return;
                          let U = a.get(b);
                          if (!(U.length === 1 && U[0].kind === "list")) {
                            if (B.parent.kind === "complex") {
                              if (B.index === 0) {
                                ne.value = b;
                                return;
                              } else if (B.index === B.siblings.length - 1) {
                                if (U[0].kind === "complex") return;
                                ne.value = b;
                                return;
                              } else {
                                if (U[0].kind === "complex") return;
                                ne.value = b;
                                return;
                              }
                            } else if (B.parent.kind === "compound") {
                              if (U[0].kind === "complex") {
                                let Oe = B.path(),
                                  Ve = Oe[Oe.length - 2];
                                if (Ve && Ve.kind === "complex" && Ve.nodes[0] !== B.parent) return;
                              }
                              if (B.siblings.slice(B.index + 1).some(Oe => g(Oe) || _(Oe))) return;
                              if (B.index === 0) {
                                ne.value = b;
                                return;
                              } else if (B.index === B.siblings.length - 1) {
                                if (U[0].kind === "complex" || g(U[0]) || _(U[0])) return;
                                ne.value = b;
                                return;
                              } else {
                                if (U[0].kind === "complex" || g(U[0]) || _(U[0])) return;
                                ne.value = b;
                                return;
                              }
                            } else if (B.parent.kind === "function") {
                              ne.value = b;
                              return;
                            }
                          }
                        },
                        exit(ne, B) {
                          if (B.index === 0 && B.siblings.length > 1 && B.parent?.kind === "compound" && g(ne)) {
                            let U = B.siblings[1];
                            return U.kind === "selector" && U.value.charCodeAt(0) === mm ? void 0 : Ee.ReplaceSkip([]);
                          }
                        }
                      }), R) return x(T);
                      let H = a.get(b);
                      return `${H.length === 1 && H[0].kind === "list" ? `:is(${b})` : b} ${A}`;
                    }
                  }).join(", ");
                c.push([E, k.src, k.dst]);
              }
              if (k.nodes.some(b => b.kind === "declaration")) {
                for (let b of k.nodes) y(b);
                return Ee.Skip;
              }
              break;
            }
          case "at-rule":
            {
              if (h = null, k.nodes.length === 0 && !bm.has(k.name)) return y(k), S.add(k), Ee.Skip;
              if (vm.has(k.name)) o.push([k.name, k.params, k.src, k.dst]);else return y(k), S.add(k), Ee.Skip;
              break;
            }
          case "declaration":
          case "comment":
            {
              y(k);
              break;
            }
          case "context":
          case "at-root":
            break;
          default:
            break;
        }
      },
      exit(k) {
        if (!S.delete(k)) switch (k.kind) {
          case "rule":
            {
              h = null, c.pop();
              break;
            }
          case "at-rule":
            {
              h = null, o.pop();
              break;
            }
          case "declaration":
          case "comment":
          case "context":
          case "at-root":
            break;
          default:
            break;
        }
      }
    });
    for (let k of m) {
      let b = new Set();
      for (let E = k.length - 1; E >= 0; --E) {
        let A = k[E];
        if (A.kind !== "declaration") continue;
        let T = `${A.property}\0${A.value}\0${A.important}`;
        b.has(T) ? k.splice(E, 1) : b.add(T);
      }
    }
    return O;
    function y(k) {
      if (h) {
        k.kind === "declaration" && (v.has(k.property) ? m.add(h) : v.add(k.property)), h.push(k);
        return;
      }
      {
        if (c.length === 0 && o.length === 0) {
          let T = O,
            R = T[T.length - 1];
          if (R && R.kind === "at-rule" && k.kind === "at-rule" && R.nodes.length === 0 && k.nodes.length === 0 && R.name === k.name && R.params === k.params) return;
          O.push(k);
          return;
        }
        h = [k], v.clear(), k.kind === "declaration" && v.add(k.property);
        let b = null,
          E = O,
          A = 0;
        {
          let T = E[E.length - 1];
          if (T && T.kind === "at-rule") for (let R = 0; R < o.length; R++) {
            let H = o[R];
            if (!T || T.kind !== "at-rule" || T.name !== H[0] || T.params !== H[1]) break;
            A++, E = T.nodes, T = T.nodes[T.nodes.length - 1];
          }
        }
        if (c.length > 0) {
          let [T, R, H] = c[c.length - 1];
          if (o.length - A <= 0) {
            let ne = E[E.length - 1];
            if (ne && ne.kind === "rule" && ne.selector === T) {
              ne.nodes.push(...h), h = ne.nodes, m.add(h);
              return;
            }
          }
          b = xt(T, h), (R || H) && Object.assign(b, {
            src: R,
            dst: H
          });
        }
        for (let T = o.length - 1; T >= A; --T) {
          let [R, H, ne, B] = o[T];
          b = tt(R, H, b ? [b] : h), (ne || B) && Object.assign(b, {
            src: ne,
            dst: B
          });
        }
        b ? E.push(b) : E.push(...h);
      }
    }
  }
  var vm = new Set(["@container", "@layer", "@media", "@page", "@starting-style", "@supports", "@view-transition"]),
    bm = new Set(["@container", "@media", "@page", "@starting-style", "@supports", "@view-transition"]);
  function sr(r, a) {
    let c = 0,
      o = {
        file: null,
        code: ""
      };
    function h(m, O = 0) {
      let S = "",
        y = "  ".repeat(O);
      if (m.kind === "declaration") {
        if (S += `${y}${m.property}: ${m.value}${m.important ? " !important" : ""};
`, a) {
          c += y.length;
          let k = c;
          c += m.property.length, c += 2, c += m.value?.length ?? 0, m.important && (c += 11);
          let b = c;
          c += 2, m.dst = [o, k, b];
        }
      } else if (m.kind === "rule") {
        if (S += `${y}${m.selector} {
`, a) {
          c += y.length;
          let k = c;
          c += m.selector.length, c += 1;
          let b = c;
          m.dst = [o, k, b], c += 2;
        }
        for (let k of m.nodes) S += h(k, O + 1);
        S += `${y}}
`, a && (c += y.length, c += 2);
      } else if (m.kind === "at-rule") {
        if (m.nodes.length === 0) {
          let k = `${y}${m.name} ${m.params};
`;
          if (a) {
            c += y.length;
            let b = c;
            c += m.name.length, c += 1, c += m.params.length;
            let E = c;
            c += 2, m.dst = [o, b, E];
          }
          return k;
        }
        if (S += `${y}${m.name}${m.params ? ` ${m.params} ` : " "}{
`, a) {
          c += y.length;
          let k = c;
          c += m.name.length, m.params && (c += 1, c += m.params.length), c += 1;
          let b = c;
          m.dst = [o, k, b], c += 2;
        }
        for (let k of m.nodes) S += h(k, O + 1);
        S += `${y}}
`, a && (c += y.length, c += 2);
      } else if (m.kind === "comment") {
        if (S += `${y}/*${m.value}*/
`, a) {
          c += y.length;
          let k = c;
          c += 2 + m.value.length + 2;
          let b = c;
          m.dst = [o, k, b], c += 1;
        }
      } else if (m.kind === "context" || m.kind === "at-root") return "";
      return S;
    }
    let v = "";
    for (let m of r) v += h(m, 0);
    return o.code = v, v;
  }
  function ym(r, a) {
    let c = [];
    return De(r, (o, h) => {
      if (a(o)) return c = h.path(), c.push(o), Ee.Stop;
    }), c;
  }
  function ru(r, a, c, o = new Set()) {
    if (o.has(r) || (o.add(r), a.getOptions(r) & 24)) return !0;
    {
      let h = c.get(r) ?? [];
      for (let v of h) if (ru(v, a, c, o)) return !0;
    }
    return !1;
  }
  function iu(r) {
    return r.split(/[\s,]+/);
  }
  var Sa = ["calc", "min", "max", "clamp", "mod", "rem", "sin", "cos", "tan", "asin", "acos", "atan", "atan2", "pow", "sqrt", "hypot", "log", "exp", "round"];
  function Ho(r) {
    return r.indexOf("(") !== -1 && Sa.some(a => r.includes(`${a}(`));
  }
  function ou(r) {
    if (!Sa.some(v => r.includes(v))) return r;
    let a = "",
      c = [],
      o = null,
      h = null;
    for (let v = 0; v < r.length; v++) {
      let m = r.charCodeAt(v);
      if (m >= 48 && m <= 57 || o !== null && (m === 37 || m >= 97 && m <= 122 || m >= 65 && m <= 90) ? o = v : (h = o, o = null), m === 40) {
        a += r[v];
        let O = v;
        for (let y = v - 1; y >= 0; y--) {
          let k = r.charCodeAt(y);
          if (k >= 48 && k <= 57) O = y;else if (k >= 97 && k <= 122) O = y;else break;
        }
        let S = r.slice(O, v);
        if (Sa.includes(S)) {
          c.unshift(!0);
          continue;
        } else if (c[0] && S === "") {
          c.unshift(!0);
          continue;
        }
        c.unshift(!1);
        continue;
      } else if (m === 41) a += r[v], c.shift();else if (m === 44 && c[0]) {
        a += ", ";
        continue;
      } else {
        if (m === 32 && c[0] && a.charCodeAt(a.length - 1) === 32) continue;
        if ((m === 43 || m === 42 || m === 47 || m === 45) && c[0]) {
          let O = a.trimEnd(),
            S = O.charCodeAt(O.length - 1),
            y = O.charCodeAt(O.length - 2),
            k = r.charCodeAt(v + 1);
          if ((S === 101 || S === 69) && y >= 48 && y <= 57) {
            a += r[v];
            continue;
          } else if (S === 43 || S === 42 || S === 47 || S === 45) {
            a += r[v];
            continue;
          } else if (S === 40 || S === 44) {
            a += r[v];
            continue;
          } else r.charCodeAt(v - 1) === 32 ? a += `${r[v]} ` : S >= 48 && S <= 57 || k >= 48 && k <= 57 || S === 41 || k === 40 || k === 43 || k === 42 || k === 47 || k === 45 || h !== null && h === v - 1 ? a += ` ${r[v]} ` : a += r[v];
        } else a += r[v];
      }
    }
    return a;
  }
  function Or(r) {
    if (r.indexOf("(") === -1) return ri(r);
    let a = ct(r);
    return Oa(a), r = je(a), r = ou(r), r;
  }
  function ri(r, a = !1) {
    let c = "";
    for (let o = 0; o < r.length; o++) {
      let h = r[o];
      h === "\\" && r[o + 1] === "_" ? (c += "_", o += 1) : h === "_" && !a ? c += " " : c += h;
    }
    return c;
  }
  function Oa(r) {
    for (let a of r) switch (a.kind) {
      case "function":
        {
          if (a.value === "url" || a.value.endsWith("_url")) {
            a.value = ri(a.value);
            break;
          }
          if (a.value === "var" || a.value.endsWith("_var") || a.value === "theme" || a.value.endsWith("_theme")) {
            a.value = ri(a.value);
            for (let c = 0; c < a.nodes.length; c++) {
              if (c == 0 && a.nodes[c].kind === "word") {
                a.nodes[c].value = ri(a.nodes[c].value, !0);
                continue;
              }
              Oa([a.nodes[c]]);
            }
            break;
          }
          a.value = ri(a.value), Oa(a.nodes);
          break;
        }
      case "separator":
      case "word":
        {
          a.value = ri(a.value);
          break;
        }
      default:
        wm(a);
    }
  }
  function wm(r) {
    throw new Error(`Unexpected value: ${r}`);
  }
  var Ta = new Uint8Array(256);
  function ar(r) {
    let a = 0,
      c = r.length;
    for (let o = 0; o < c; o++) {
      let h = r.charCodeAt(o);
      switch (h) {
        case 92:
          o += 1;
          break;
        case 39:
        case 34:
          for (; ++o < c;) {
            let v = r.charCodeAt(o);
            if (v === 92) {
              o += 1;
              continue;
            }
            if (v === h) break;
          }
          break;
        case 40:
          Ta[a] = 41, a++;
          break;
        case 91:
          Ta[a] = 93, a++;
          break;
        case 123:
          break;
        case 93:
        case 125:
        case 41:
          if (a === 0) return !1;
          a > 0 && h === Ta[a - 1] && a--;
          break;
        case 59:
          if (a === 0) return !1;
          break;
      }
    }
    return !0;
  }
  var km = 58,
    su = 45,
    au = 97,
    lu = 122,
    Ca = /^[a-zA-Z0-9_.%-]+$/;
  function* Em(r, a) {
    let c = ye(r, ":");
    if (a.theme.prefix) {
      if (c.length === 1 || c[0] !== a.theme.prefix) return null;
      c.shift();
    }
    let o = c.pop(),
      h = [];
    for (let b = c.length - 1; b >= 0; --b) {
      let E = a.parseVariant(c[b]);
      if (E === null) return;
      h.push(E);
    }
    let v = !1;
    o[o.length - 1] === "!" ? (v = !0, o = o.slice(0, -1)) : o[0] === "!" && (v = !0, o = o.slice(1)), a.utilities.has(o, "static") && !o.includes("[") && (yield {
      kind: "static",
      root: o,
      variants: h,
      important: v,
      raw: r
    });
    let [m, O = null, S] = ye(o, "/");
    if (S) return;
    let y = O === null ? null : Aa(O);
    if (O !== null && y === null) return;
    if (m[0] === "[") {
      if (m[m.length - 1] !== "]") return;
      let b = m.charCodeAt(1);
      if (b !== su && !(b >= au && b <= lu)) return;
      m = m.slice(1, -1);
      let E = m.indexOf(":");
      if (E === -1 || E === 0 || E === m.length - 1) return;
      let A = m.slice(0, E),
        T = Or(m.slice(E + 1));
      if (!ar(T)) return;
      yield {
        kind: "arbitrary",
        property: A,
        value: T,
        modifier: y,
        variants: h,
        important: v,
        raw: r
      };
      return;
    }
    let k;
    if (m[m.length - 1] === "]") {
      let b = m.indexOf("-[");
      if (b === -1) return;
      let E = m.slice(0, b);
      if (!a.utilities.has(E, "functional")) return;
      let A = m.slice(b + 1);
      k = [[E, A]];
    } else if (m[m.length - 1] === ")") {
      let b = m.indexOf("-(");
      if (b === -1) return;
      let E = m.slice(0, b);
      if (!a.utilities.has(E, "functional")) return;
      let A = m.slice(b + 2, -1),
        T = ye(A, ":"),
        R = null;
      if (T.length === 2 && (R = T[0], A = T[1]), A[0] !== "-" || A[1] !== "-" || !ar(A)) return;
      k = [[E, R === null ? `[var(${A})]` : `[${R}:var(${A})]`]];
    } else k = cu(m, b => a.utilities.has(b, "functional"));
    for (let [b, E] of k) {
      let A = {
        kind: "functional",
        root: b,
        modifier: y,
        value: null,
        variants: h,
        important: v,
        raw: r
      };
      if (E === null) {
        yield A;
        continue;
      }
      {
        let T = E.indexOf("[");
        if (T !== -1) {
          if (E[E.length - 1] !== "]") return;
          let R = Or(E.slice(T + 1, -1));
          if (!ar(R)) continue;
          let H = null;
          for (let ne = 0; ne < R.length; ne++) {
            let B = R.charCodeAt(ne);
            if (B === km) {
              H = R.slice(0, ne), R = R.slice(ne + 1);
              break;
            }
            if (!(B === su || B >= au && B <= lu)) break;
          }
          if (R.length === 0 || R.trim().length === 0 || H === "") continue;
          A.value = {
            kind: "arbitrary",
            dataType: H || null,
            value: R
          };
        } else {
          let R = O === null || A.modifier?.kind === "arbitrary" ? null : `${E}/${O}`;
          if (!Ca.test(E)) continue;
          A.value = {
            kind: "named",
            value: E,
            fraction: R
          };
        }
      }
      yield A;
    }
  }
  function Aa(r) {
    if (r[0] === "[" && r[r.length - 1] === "]") {
      let a = Or(r.slice(1, -1));
      return !ar(a) || a.length === 0 || a.trim().length === 0 ? null : {
        kind: "arbitrary",
        value: a
      };
    }
    return r[0] === "(" && r[r.length - 1] === ")" ? (r = r.slice(1, -1), r[0] !== "-" || r[1] !== "-" || !ar(r) ? null : (r = `var(${r})`, {
      kind: "arbitrary",
      value: Or(r)
    })) : Ca.test(r) ? {
      kind: "named",
      value: r
    } : null;
  }
  function _m(r, a) {
    if (r[0] === "[" && r[r.length - 1] === "]") {
      if (r[1] === "@" && r.includes("&")) return null;
      let c = Or(r.slice(1, -1));
      if (!ar(c) || c.length === 0 || c.trim().length === 0) return null;
      let o = c[0] === ">" || c[0] === "+" || c[0] === "~";
      return !o && c[0] !== "@" && !c.includes("&") && (c = `&:is(${c})`), {
        kind: "arbitrary",
        selector: c,
        relative: o
      };
    }
    {
      let [c, o = null, h] = ye(r, "/");
      if (h) return null;
      let v = cu(c, m => a.variants.has(m));
      for (let [m, O] of v) switch (a.variants.kind(m)) {
        case "static":
          return O !== null || o !== null ? null : {
            kind: "static",
            root: m
          };
        case "functional":
          {
            let S = o === null ? null : Aa(o);
            if (o !== null && S === null) return null;
            if (O === null) return {
              kind: "functional",
              root: m,
              modifier: S,
              value: null
            };
            if (O[O.length - 1] === "]") {
              if (O[0] !== "[") continue;
              let y = Or(O.slice(1, -1));
              return !ar(y) || y.length === 0 || y.trim().length === 0 ? null : {
                kind: "functional",
                root: m,
                modifier: S,
                value: {
                  kind: "arbitrary",
                  value: y
                }
              };
            }
            if (O[O.length - 1] === ")") {
              if (O[0] !== "(") continue;
              let y = Or(O.slice(1, -1));
              return !ar(y) || y.length === 0 || y.trim().length === 0 || y[0] !== "-" || y[1] !== "-" ? null : {
                kind: "functional",
                root: m,
                modifier: S,
                value: {
                  kind: "arbitrary",
                  value: `var(${y})`
                }
              };
            }
            if (!Ca.test(O)) continue;
            return {
              kind: "functional",
              root: m,
              modifier: S,
              value: {
                kind: "named",
                value: O
              }
            };
          }
        case "compound":
          {
            if (O === null) return null;
            o && (m === "not" || m === "has" || m === "in") && (O = `${O}/${o}`, o = null);
            let S = a.parseVariant(O);
            if (S === null || !a.variants.compoundsWith(m, S)) return null;
            let y = o === null ? null : Aa(o);
            return o !== null && y === null ? null : {
              kind: "compound",
              root: m,
              modifier: y,
              variant: S
            };
          }
      }
    }
    return null;
  }
  function* cu(r, a) {
    a(r) && (yield [r, null]);
    let c = r.lastIndexOf("-");
    for (; c > 0;) {
      let o = r.slice(0, c);
      if (a(o)) {
        let h = [o, r.slice(c + 1)];
        if (h[1] === "" || h[0] === "@" && a("@") && r[c] === "-") break;
        yield h;
      }
      c = r.lastIndexOf("-", c - 1);
    }
    r[0] === "@" && a("@") && (yield ["@", r.slice(1)]);
  }
  function Nm(r, a) {
    let c = [];
    for (let h of a.variants) c.unshift(Da(h));
    r.theme.prefix && c.unshift(r.theme.prefix);
    let o = "";
    if (a.kind === "static" && (o += a.root), a.kind === "functional" && (o += a.root, a.value)) if (a.value.kind === "arbitrary") {
      if (a.value !== null) {
        let h = $a(a.value.value),
          v = h ? a.value.value.slice(4, -1) : a.value.value,
          [m, O] = h ? ["(", ")"] : ["[", "]"];
        a.value.dataType ? o += `-${m}${a.value.dataType}:${ii(v)}${O}` : o += `-${m}${ii(v)}${O}`;
      }
    } else a.value.kind === "named" && (o += `-${a.value.value}`);
    return a.kind === "arbitrary" && (o += `[${a.property}:${ii(a.value)}]`), (a.kind === "arbitrary" || a.kind === "functional") && (o += uu(a.modifier)), a.important && (o += "!"), c.push(o), c.join(":");
  }
  function uu(r) {
    if (r === null) return "";
    let a = $a(r.value),
      c = a ? r.value.slice(4, -1) : r.value,
      [o, h] = a ? ["(", ")"] : ["[", "]"];
    return r.kind === "arbitrary" ? `/${o}${ii(c)}${h}` : r.kind === "named" ? `/${r.value}` : "";
  }
  function Da(r) {
    if (r.kind === "static") return r.root;
    if (r.kind === "arbitrary") return `[${ii(Om(r.selector))}]`;
    let a = "";
    if (r.kind === "functional") {
      a += r.root;
      let c = r.root !== "@";
      if (r.value) if (r.value.kind === "arbitrary") {
        let o = $a(r.value.value),
          h = o ? r.value.value.slice(4, -1) : r.value.value,
          [v, m] = o ? ["(", ")"] : ["[", "]"];
        a += `${c ? "-" : ""}${v}${ii(h)}${m}`;
      } else r.value.kind === "named" && (a += `${c ? "-" : ""}${r.value.value}`);
    }
    return r.kind === "compound" && (a += r.root, a += "-", a += Da(r.variant)), (r.kind === "functional" || r.kind === "compound") && (a += uu(r.modifier)), a;
  }
  var xm = new be(r => {
    let a = ct(r),
      c = new Set(),
      o = new Set(["~", ">", "+", "-", "*", "/"]);
    return De(a, (h, v) => {
      if (h.kind === "word" && o.has(h.value)) {
        let m = v.index;
        if (m === -1) return;
        let O = v.siblings[m - 1];
        if (O?.kind !== "separator" || O.value !== " ") return;
        let S = v.siblings[m + 1];
        if (S?.kind !== "separator" || S.value !== " ") return;
        let y = v.siblings[m - 2];
        if (y && o.has(y.value)) return;
        let k = v.siblings[m + 2];
        if (k && o.has(k.value)) return;
        c.add(O), c.add(S);
      } else if (h.kind === "separator" && h.value.length > 0 && h.value.trim() === "") (v.siblings[0] === h || v.siblings[v.siblings.length - 1] === h) && c.add(h);else if (h.kind === "separator" && h.value.trim() === ",") h.value = ",";else if (h.kind === "function" && h.value.startsWith("--")) {
        let m = v.index;
        if (m <= 0) return;
        let O = v.siblings[m - 1];
        if (O?.kind === "separator" && O.value === ",") return;
        let S = v.siblings[m - 2];
        return S && !o.has(S.value) ? void 0 : Ee.ReplaceSkip({
          kind: "function",
          value: "",
          nodes: [h]
        });
      }
    }), c.size > 0 && De(a, h => {
      if (c.has(h)) return c.delete(h), Ee.ReplaceSkip([]);
    }), Va(a), je(a);
  });
  function ii(r) {
    return xm.get(r);
  }
  var Sm = new be(r => {
    let a = ct(r);
    return a.length === 3 && a[0].kind === "word" && a[0].value === "&" && a[1].kind === "separator" && a[1].value === ":" && a[2].kind === "function" && a[2].value === "is" ? je(a[2].nodes) : r;
  });
  function Om(r) {
    return Sm.get(r);
  }
  function Va(r) {
    for (let a of r) switch (a.kind) {
      case "function":
        {
          if (a.value === "url" || a.value.endsWith("_url")) {
            a.value = zi(a.value);
            break;
          }
          if (a.value === "var" || a.value.endsWith("_var") || a.value === "theme" || a.value.endsWith("_theme")) {
            a.value = zi(a.value);
            for (let c = 0; c < a.nodes.length; c++) Va([a.nodes[c]]);
            break;
          }
          a.value = zi(a.value), Va(a.nodes);
          break;
        }
      case "separator":
        a.value = zi(a.value);
        break;
      case "word":
        {
          (a.value[0] !== "-" || a.value[1] !== "-") && (a.value = zi(a.value));
          break;
        }
      default:
        Cm(a);
    }
  }
  var Tm = new be(r => {
    let a = ct(r);
    return a.length === 1 && a[0].kind === "function" && a[0].value === "var";
  });
  function $a(r) {
    return Tm.get(r);
  }
  function Cm(r) {
    throw new Error(`Unexpected value: ${r}`);
  }
  function zi(r) {
    return r.replaceAll("_", String.raw`\_`).replaceAll(" ", "_");
  }
  function Bo(r, a, c) {
    if (r === a) return 0;
    let o = r.indexOf("("),
      h = a.indexOf("("),
      v = o === -1 ? r.replace(/[\d.]+/g, "") : r.slice(0, o),
      m = h === -1 ? a.replace(/[\d.]+/g, "") : a.slice(0, h),
      O = (v === m ? 0 : v < m ? -1 : 1) || (c === "asc" ? parseInt(r) - parseInt(a) : parseInt(a) - parseInt(r));
    return Number.isNaN(O) ? r < a ? -1 : 1 : O;
  }
  var Am = /^(?<value>[-+]?(?:\d*\.)?\d+)(?<unit>[a-z]+|%)?$/i,
    Ia = new be(r => {
      let a = Am.exec(r);
      if (!a) return null;
      let c = a.groups?.value;
      if (c === void 0) return null;
      let o = Number(c);
      if (Number.isNaN(o)) return null;
      let h = a.groups?.unit;
      return h === void 0 ? [o, null] : [o, h];
    }),
    fu = new Set(["black", "silver", "gray", "white", "maroon", "red", "purple", "fuchsia", "green", "lime", "olive", "yellow", "navy", "blue", "teal", "aqua", "aliceblue", "antiquewhite", "aqua", "aquamarine", "azure", "beige", "bisque", "black", "blanchedalmond", "blue", "blueviolet", "brown", "burlywood", "cadetblue", "chartreuse", "chocolate", "coral", "cornflowerblue", "cornsilk", "crimson", "cyan", "darkblue", "darkcyan", "darkgoldenrod", "darkgray", "darkgreen", "darkgrey", "darkkhaki", "darkmagenta", "darkolivegreen", "darkorange", "darkorchid", "darkred", "darksalmon", "darkseagreen", "darkslateblue", "darkslategray", "darkslategrey", "darkturquoise", "darkviolet", "deeppink", "deepskyblue", "dimgray", "dimgrey", "dodgerblue", "firebrick", "floralwhite", "forestgreen", "fuchsia", "gainsboro", "ghostwhite", "gold", "goldenrod", "gray", "green", "greenyellow", "grey", "honeydew", "hotpink", "indianred", "indigo", "ivory", "khaki", "lavender", "lavenderblush", "lawngreen", "lemonchiffon", "lightblue", "lightcoral", "lightcyan", "lightgoldenrodyellow", "lightgray", "lightgreen", "lightgrey", "lightpink", "lightsalmon", "lightseagreen", "lightskyblue", "lightslategray", "lightslategrey", "lightsteelblue", "lightyellow", "lime", "limegreen", "linen", "magenta", "maroon", "mediumaquamarine", "mediumblue", "mediumorchid", "mediumpurple", "mediumseagreen", "mediumslateblue", "mediumspringgreen", "mediumturquoise", "mediumvioletred", "midnightblue", "mintcream", "mistyrose", "moccasin", "navajowhite", "navy", "oldlace", "olive", "olivedrab", "orange", "orangered", "orchid", "palegoldenrod", "palegreen", "paleturquoise", "palevioletred", "papayawhip", "peachpuff", "peru", "pink", "plum", "powderblue", "purple", "rebeccapurple", "red", "rosybrown", "royalblue", "saddlebrown", "salmon", "sandybrown", "seagreen", "seashell", "sienna", "silver", "skyblue", "slateblue", "slategray", "slategrey", "snow", "springgreen", "steelblue", "tan", "teal", "thistle", "tomato", "turquoise", "violet", "wheat", "white", "whitesmoke", "yellow", "yellowgreen", "transparent", "currentcolor", "canvas", "canvastext", "linktext", "visitedtext", "activetext", "buttonface", "buttontext", "buttonborder", "field", "fieldtext", "highlight", "highlighttext", "selecteditem", "selecteditemtext", "mark", "marktext", "graytext", "accentcolor", "accentcolortext"]),
    Dm = /^(rgba?|hsla?|hwb|color|(ok)?(lab|lch)|light-dark|color-mix|--alpha)\(/i;
  function Vm(r) {
    return r.charCodeAt(0) === 35 || Dm.test(r) || fu.has(r.toLowerCase());
  }
  function $m(r) {
    return fu.has(r.toLowerCase());
  }
  var Im = {
    color: Vm,
    length: oi,
    percentage: Ra,
    ratio: Xm,
    number: pu,
    integer: he,
    url: du,
    position: Jm,
    "bg-size": Zm,
    "line-width": Mm,
    image: Fm,
    "family-name": jm,
    "generic-name": Um,
    "absolute-size": zm,
    "relative-size": Hm,
    angle: t0,
    vector: r0
  };
  function pt(r, a) {
    if (r.startsWith("var(")) return null;
    for (let c of a) if (Im[c]?.(r)) return c;
    return null;
  }
  var Rm = /^url\(.*\)$/;
  function du(r) {
    return Rm.test(r);
  }
  function Mm(r) {
    return ye(r, " ").every(a => oi(a) || pu(a) || a === "thin" || a === "medium" || a === "thick");
  }
  var Pm = /^(?:element|image|cross-fade|image-set)\(/,
    Lm = /^(repeating-)?(conic|linear|radial)-gradient\(/;
  function Fm(r) {
    let a = 0;
    for (let c of ye(r, ",")) if (!c.startsWith("var(")) {
      if (du(c)) {
        a += 1;
        continue;
      }
      if (Lm.test(c)) {
        a += 1;
        continue;
      }
      if (Pm.test(c)) {
        a += 1;
        continue;
      }
      return !1;
    }
    return a > 0;
  }
  function Um(r) {
    return r === "serif" || r === "sans-serif" || r === "monospace" || r === "cursive" || r === "fantasy" || r === "system-ui" || r === "ui-serif" || r === "ui-sans-serif" || r === "ui-monospace" || r === "ui-rounded" || r === "math" || r === "emoji" || r === "fangsong";
  }
  function jm(r) {
    let a = 0;
    for (let c of ye(r, ",")) {
      let o = c.charCodeAt(0);
      if (o >= 48 && o <= 57) return !1;
      c.startsWith("var(") || (a += 1);
    }
    return a > 0;
  }
  function zm(r) {
    return r === "xx-small" || r === "x-small" || r === "small" || r === "medium" || r === "large" || r === "x-large" || r === "xx-large" || r === "xxx-large";
  }
  function Hm(r) {
    return r === "larger" || r === "smaller";
  }
  var Pn = /[+-]?\d*\.?\d+(?:[eE][+-]?\d+)?/,
    Bm = new RegExp(`^${Pn.source}$`);
  function pu(r) {
    return Bm.test(r) || Ho(r);
  }
  var Km = new RegExp(`^${Pn.source}%$`);
  function Ra(r) {
    return Km.test(r) || Ho(r);
  }
  var Wm = new RegExp(`^${Pn.source}\\s*/\\s*${Pn.source}$`);
  function Xm(r) {
    return Wm.test(r) || Ho(r);
  }
  var qm = ["cm", "mm", "Q", "in", "pc", "pt", "px", "em", "ex", "ch", "rem", "lh", "rlh", "vw", "vh", "vmin", "vmax", "vb", "vi", "svw", "svh", "lvw", "lvh", "dvw", "dvh", "cqw", "cqh", "cqi", "cqb", "cqmin", "cqmax"],
    Gm = new RegExp(`^${Pn.source}(${qm.join("|")})$`),
    Ym = /^(--spacing)\(/i;
  function oi(r) {
    return Gm.test(r) || Ym.test(r) || Ho(r);
  }
  function Jm(r) {
    let a = 0;
    for (let c of ye(r, " ")) {
      if (c === "center" || c === "top" || c === "right" || c === "bottom" || c === "left") {
        a += 1;
        continue;
      }
      if (!c.startsWith("var(")) {
        if (oi(c) || Ra(c)) {
          a += 1;
          continue;
        }
        return !1;
      }
    }
    return a > 0;
  }
  function Zm(r) {
    let a = 0;
    for (let c of ye(r, ",")) {
      if (c === "cover" || c === "contain") {
        a += 1;
        continue;
      }
      let o = ye(c, " ");
      if (o.length !== 1 && o.length !== 2) return !1;
      if (o.every(h => h === "auto" || oi(h) || Ra(h))) {
        a += 1;
        continue;
      }
    }
    return a > 0;
  }
  var Qm = ["deg", "rad", "grad", "turn"],
    e0 = new RegExp(`^${Pn.source}(${Qm.join("|")})$`);
  function t0(r) {
    return e0.test(r);
  }
  var n0 = new RegExp(`^${Pn.source} +${Pn.source} +${Pn.source}$`);
  function r0(r) {
    return n0.test(r);
  }
  function he(r) {
    let a = Number(r);
    return Number.isInteger(a) && a >= 0 && String(a) === String(r);
  }
  function hu(r) {
    let a = Number(r);
    return Number.isInteger(a) && a > 0 && String(a) === String(r);
  }
  function dn(r) {
    return mu(r, .25);
  }
  function Tr(r) {
    return mu(r, .25);
  }
  function mu(r, a) {
    let c = Number(r);
    return c >= 0 && c % a === 0 && String(c) === String(r);
  }
  var i0 = new Set(["inset", "inherit", "initial", "revert", "unset"]),
    o0 = new Set(["calc", "clamp", "max", "min", "--spacing"]),
    s0 = new Set(["color", "color-mix", "contrast-color", "device-cmyk", "hsl", "hsla", "hwb", "lab", "lch", "light-dark", "oklab", "oklch", "rgb", "rgba", "--alpha"]),
    a0 = /^-?(\d+|\.\d+)(.*?)$/;
  function Ko(r, a) {
    function c(o) {
      let h = je([o]),
        v = a(h);
      return ct(v);
    }
    return ye(r, ",").map(o => {
      o = o.trim();
      let h = ct(o),
        v = null,
        m = 0,
        O = 0,
        S = !1;
      return De(h, y => {
        switch (y.kind) {
          case "word":
            {
              if (i0.has(y.value.toLowerCase())) return Ee.Continue;
              if (a0.test(y.value.toLowerCase())) return O++, Ee.Continue;
              if (y.value[0] === "#" || $m(y.value)) return S = !0, Ee.ReplaceStop(c(y));
              v = y, m++;
              break;
            }
          case "function":
            return s0.has(y.value.toLowerCase()) ? (S = !0, Ee.ReplaceStop(c(y))) : o0.has(y.value.toLowerCase()) ? (O++, Ee.Skip) : (v = y, m++, Ee.Skip);
          case "separator":
            return Ee.Continue;
          default:
        }
      }), S ? je(h) : O < 2 ? o : m === 0 ? `${o} ${a("currentcolor")}` : (m === 1 && De(h, y => y === v ? (S = !0, Ee.ReplaceStop(c(y))) : Ee.Skip), S ? je(h) : o);
    }).join(", ");
  }
  var Wo = ["0", "0.5", "1", "1.5", "2", "2.5", "3", "3.5", "4", "5", "6", "7", "8", "9", "10", "11", "12", "14", "16", "20", "24", "28", "32", "36", "40", "44", "48", "52", "56", "60", "64", "72", "80", "96"],
    l0 = class {
      utilities = new be(() => []);
      completions = new Map();
      static(r, a) {
        this.utilities.get(r).push({
          kind: "static",
          compileFn: a
        });
      }
      functional(r, a, c) {
        this.utilities.get(r).push({
          kind: "functional",
          compileFn: a,
          options: c
        });
      }
      has(r, a) {
        return this.utilities.has(r) && this.utilities.get(r).some(c => c.kind === a);
      }
      get(r) {
        return this.utilities.has(r) ? this.utilities.get(r) : [];
      }
      getCompletions(r) {
        return this.has(r, "static") ? this.completions.get(r)?.() ?? [{
          supportsNegative: !1,
          values: [],
          modifiers: []
        }] : this.completions.get(r)?.() ?? [];
      }
      suggest(r, a) {
        let c = this.completions.get(r);
        c ? this.completions.set(r, () => [...c?.(), ...a?.()]) : this.completions.set(r, a);
      }
      keys(r) {
        let a = [];
        for (let [c, o] of this.utilities.entries()) for (let h of o) if (h.kind === r) {
          a.push(c);
          break;
        }
        return a;
      }
    };
  function G(r, a, c) {
    return tt("@property", r, [d("syntax", c ? `"${c}"` : '"*"'), d("inherits", "false"), ...(a ? [d("initial-value", a)] : [])]);
  }
  function Dt(r, a) {
    if (a === null) return r;
    let c = Number(a);
    return Number.isNaN(c) || (a = `${c * 100}%`), a === "100%" ? r : `color-mix(in oklab, ${r} ${a}, transparent)`;
  }
  function gu(r, a) {
    let c = Number(a);
    return Number.isNaN(c) || (a = `${c * 100}%`), `oklab(from ${r} l a b / ${a})`;
  }
  function St(r, a, c) {
    if (!a) return r;
    if (a.kind === "arbitrary") return Dt(r, a.value);
    let o = c.resolve(a.value, ["--opacity"]);
    return o ? Dt(r, o) : Tr(a.value) ? Dt(r, `${a.value}%`) : null;
  }
  function Vt(r, a, c) {
    let o = null;
    switch (r.value.value) {
      case "inherit":
        {
          o = "inherit";
          break;
        }
      case "transparent":
        {
          o = "transparent";
          break;
        }
      case "current":
        {
          o = "currentcolor";
          break;
        }
      default:
        {
          o = a.resolve(r.value.value, c);
          break;
        }
    }
    return o ? St(o, r.modifier, a) : null;
  }
  var vu = /(\d+)_(\d+)/g;
  function c0(r) {
    let a = new l0();
    function c(f, N) {
      function* C(M) {
        for (let Y of r.keysInNamespaces(M)) yield Y.replace(vu, (xe, Q, ce) => `${Q}.${ce}`);
      }
      let K = ["1/2", "1/3", "2/3", "1/4", "2/4", "3/4", "1/5", "2/5", "3/5", "4/5", "1/6", "2/6", "3/6", "4/6", "5/6", "1/12", "2/12", "3/12", "4/12", "5/12", "6/12", "7/12", "8/12", "9/12", "10/12", "11/12"];
      a.suggest(f, () => {
        let M = [];
        for (let Y of N()) {
          if (typeof Y == "string") {
            M.push({
              values: [Y],
              modifiers: []
            });
            continue;
          }
          let xe = [...(Y.values ?? []), ...C(Y.valueThemeKeys ?? [])],
            Q = [...(Y.modifiers ?? []), ...C(Y.modifierThemeKeys ?? [])];
          Y.supportsFractions && xe.push(...K), Y.hasDefaultValue && xe.unshift(null), M.push({
            supportsNegative: Y.supportsNegative,
            values: xe,
            modifiers: Q
          });
        }
        return M;
      });
    }
    function o(f, N) {
      a.static(f, () => N.map(C => typeof C == "function" ? C() : d(C[0], C[1])));
    }
    function h(f, N) {
      N.staticValues && (N.staticValues = Object.assign(Object.create(null), N.staticValues));
      function C({
        negative: K
      }) {
        return M => {
          let Y = null,
            xe = null;
          if (M.value) {
            if (M.value.kind === "arbitrary") {
              if (M.modifier) return;
              Y = M.value.value, xe = M.value.dataType;
            } else {
              if (Y = r.resolve(M.value.fraction ?? M.value.value, N.themeKeys ?? []), Y === null && N.supportsFractions && M.value.fraction) {
                let [Q, ce] = ye(M.value.fraction, "/");
                if (!he(Q) || !he(ce)) return;
                Y = `calc(${Q} / ${ce} * 100%)`;
              }
              if (Y === null && K && N.handleNegativeBareValue) {
                if (Y = N.handleNegativeBareValue(M.value), !Y?.includes("/") && M.modifier) return;
                if (Y !== null) return N.handle(Y, null);
              }
              if (Y === null && N.handleBareValue && (Y = N.handleBareValue(M.value), !Y?.includes("/") && M.modifier)) return;
              if (Y === null && !K && N.staticValues && !M.modifier) {
                let Q = N.staticValues[M.value.value];
                if (Q) return Q.map(fn);
              }
            }
          } else {
            if (M.modifier) return;
            Y = N.defaultValue !== void 0 ? N.defaultValue : r.resolve(null, N.themeKeys ?? []);
          }
          if (Y !== null) return N.handle(K ? ou(`calc(${Y} * -1)`) : Y, xe);
        };
      }
      if (N.supportsNegative && a.functional(`-${f}`, C({
        negative: !0
      })), a.functional(f, C({
        negative: !1
      })), c(f, () => [{
        supportsNegative: N.supportsNegative,
        valueThemeKeys: N.themeKeys ?? [],
        hasDefaultValue: N.defaultValue !== void 0 && N.defaultValue !== null,
        supportsFractions: N.supportsFractions
      }]), N.staticValues && Object.keys(N.staticValues).length > 0) {
        let K = Object.keys(N.staticValues);
        c(f, () => [{
          values: K
        }]);
      }
    }
    function v(f, N) {
      a.functional(f, C => {
        if (!C.value) return;
        let K = null;
        if (C.value.kind === "arbitrary" ? (K = C.value.value, K = St(K, C.modifier, r)) : K = Vt(C, r, N.themeKeys), K !== null) return N.handle(K);
      }), c(f, () => [{
        values: ["current", "inherit", "transparent"],
        valueThemeKeys: N.themeKeys,
        modifierThemeKeys: ["--opacity"],
        modifiers: Array.from({
          length: 21
        }, (C, K) => `${K * 5}`)
      }]);
    }
    function m(f, N, C, {
      supportsNegative: K = !1,
      supportsFractions: M = !1,
      staticValues: Y
    } = {}) {
      K && a.static(`-${f}-px`, () => C("-1px")), a.static(`${f}-px`, () => C("1px")), h(f, {
        themeKeys: N,
        supportsFractions: M,
        supportsNegative: K,
        defaultValue: null,
        handleBareValue: ({
          value: xe
        }) => !r.resolve(null, ["--spacing"]) || !dn(xe) ? null : `--spacing(${xe})`,
        handleNegativeBareValue: ({
          value: xe
        }) => !r.resolve(null, ["--spacing"]) || !dn(xe) ? null : `--spacing(-${xe})`,
        handle: C,
        staticValues: Y
      }), c(f, () => [{
        values: r.get(["--spacing"]) ? Wo : [],
        supportsNegative: K,
        supportsFractions: M,
        valueThemeKeys: N
      }]);
    }
    o("sr-only", [["position", "absolute"], ["width", "1px"], ["height", "1px"], ["padding", "0"], ["margin", "-1px"], ["overflow", "hidden"], ["clip-path", "inset(50%)"], ["white-space", "nowrap"], ["border-width", "0"]]), o("not-sr-only", [["position", "static"], ["width", "auto"], ["height", "auto"], ["padding", "0"], ["margin", "0"], ["overflow", "visible"], ["clip-path", "none"], ["white-space", "normal"]]), o("pointer-events-none", [["pointer-events", "none"]]), o("pointer-events-auto", [["pointer-events", "auto"]]), o("visible", [["visibility", "visible"]]), o("invisible", [["visibility", "hidden"]]), o("collapse", [["visibility", "collapse"]]), o("static", [["position", "static"]]), o("fixed", [["position", "fixed"]]), o("absolute", [["position", "absolute"]]), o("relative", [["position", "relative"]]), o("sticky", [["position", "sticky"]]);
    for (let [f, N] of [["inset", "inset"], ["inset-x", "inset-inline"], ["inset-y", "inset-block"], ["inset-s", "inset-inline-start"], ["inset-e", "inset-inline-end"], ["inset-bs", "inset-block-start"], ["inset-be", "inset-block-end"], ["top", "top"], ["right", "right"], ["bottom", "bottom"], ["left", "left"]]) o(`${f}-auto`, [[N, "auto"]]), o(`${f}-full`, [[N, "100%"]]), o(`-${f}-full`, [[N, "-100%"]]), m(f, ["--inset", "--spacing"], C => [d(N, C)], {
      supportsNegative: !0,
      supportsFractions: !0
    });
    o("isolate", [["isolation", "isolate"]]), o("isolation-auto", [["isolation", "auto"]]), h("z", {
      supportsNegative: !0,
      handleBareValue: ({
        value: f
      }) => he(f) ? f : null,
      themeKeys: ["--z-index"],
      handle: f => [d("z-index", f)],
      staticValues: {
        auto: [d("z-index", "auto")]
      }
    }), c("z", () => [{
      supportsNegative: !0,
      values: ["0", "10", "20", "30", "40", "50"],
      valueThemeKeys: ["--z-index"]
    }]), h("order", {
      supportsNegative: !0,
      handleBareValue: ({
        value: f
      }) => he(f) ? f : null,
      themeKeys: ["--order"],
      handle: f => [d("order", f)],
      staticValues: {
        first: [d("order", "-9999")],
        last: [d("order", "9999")]
      }
    }), c("order", () => [{
      supportsNegative: !0,
      values: Array.from({
        length: 12
      }, (f, N) => `${N + 1}`),
      valueThemeKeys: ["--order"]
    }]), h("col", {
      supportsNegative: !0,
      handleBareValue: ({
        value: f
      }) => he(f) ? f : null,
      themeKeys: ["--grid-column"],
      handle: f => [d("grid-column", f)],
      staticValues: {
        auto: [d("grid-column", "auto")]
      }
    }), h("col-span", {
      handleBareValue: ({
        value: f
      }) => he(f) ? f : null,
      handle: f => [d("grid-column", `span ${f} / span ${f}`)],
      staticValues: {
        full: [d("grid-column", "1 / -1")]
      }
    }), h("col-start", {
      supportsNegative: !0,
      handleBareValue: ({
        value: f
      }) => he(f) ? f : null,
      themeKeys: ["--grid-column-start"],
      handle: f => [d("grid-column-start", f)],
      staticValues: {
        auto: [d("grid-column-start", "auto")]
      }
    }), h("col-end", {
      supportsNegative: !0,
      handleBareValue: ({
        value: f
      }) => he(f) ? f : null,
      themeKeys: ["--grid-column-end"],
      handle: f => [d("grid-column-end", f)],
      staticValues: {
        auto: [d("grid-column-end", "auto")]
      }
    }), c("col-span", () => [{
      values: Array.from({
        length: 12
      }, (f, N) => `${N + 1}`),
      valueThemeKeys: []
    }]), c("col-start", () => [{
      supportsNegative: !0,
      values: Array.from({
        length: 13
      }, (f, N) => `${N + 1}`),
      valueThemeKeys: ["--grid-column-start"]
    }]), c("col-end", () => [{
      supportsNegative: !0,
      values: Array.from({
        length: 13
      }, (f, N) => `${N + 1}`),
      valueThemeKeys: ["--grid-column-end"]
    }]), h("row", {
      supportsNegative: !0,
      handleBareValue: ({
        value: f
      }) => he(f) ? f : null,
      themeKeys: ["--grid-row"],
      handle: f => [d("grid-row", f)],
      staticValues: {
        auto: [d("grid-row", "auto")]
      }
    }), h("row-span", {
      themeKeys: [],
      handleBareValue: ({
        value: f
      }) => he(f) ? f : null,
      handle: f => [d("grid-row", `span ${f} / span ${f}`)],
      staticValues: {
        full: [d("grid-row", "1 / -1")]
      }
    }), h("row-start", {
      supportsNegative: !0,
      handleBareValue: ({
        value: f
      }) => he(f) ? f : null,
      themeKeys: ["--grid-row-start"],
      handle: f => [d("grid-row-start", f)],
      staticValues: {
        auto: [d("grid-row-start", "auto")]
      }
    }), h("row-end", {
      supportsNegative: !0,
      handleBareValue: ({
        value: f
      }) => he(f) ? f : null,
      themeKeys: ["--grid-row-end"],
      handle: f => [d("grid-row-end", f)],
      staticValues: {
        auto: [d("grid-row-end", "auto")]
      }
    }), c("row-span", () => [{
      values: Array.from({
        length: 12
      }, (f, N) => `${N + 1}`),
      valueThemeKeys: []
    }]), c("row-start", () => [{
      supportsNegative: !0,
      values: Array.from({
        length: 13
      }, (f, N) => `${N + 1}`),
      valueThemeKeys: ["--grid-row-start"]
    }]), c("row-end", () => [{
      supportsNegative: !0,
      values: Array.from({
        length: 13
      }, (f, N) => `${N + 1}`),
      valueThemeKeys: ["--grid-row-end"]
    }]), o("float-start", [["float", "inline-start"]]), o("float-end", [["float", "inline-end"]]), o("float-right", [["float", "right"]]), o("float-left", [["float", "left"]]), o("float-none", [["float", "none"]]), o("clear-start", [["clear", "inline-start"]]), o("clear-end", [["clear", "inline-end"]]), o("clear-right", [["clear", "right"]]), o("clear-left", [["clear", "left"]]), o("clear-both", [["clear", "both"]]), o("clear-none", [["clear", "none"]]);
    for (let [f, N] of [["m", "margin"], ["mx", "margin-inline"], ["my", "margin-block"], ["ms", "margin-inline-start"], ["me", "margin-inline-end"], ["mbs", "margin-block-start"], ["mbe", "margin-block-end"], ["mt", "margin-top"], ["mr", "margin-right"], ["mb", "margin-bottom"], ["ml", "margin-left"]]) o(`${f}-auto`, [[N, "auto"]]), m(f, ["--margin", "--spacing"], C => [d(N, C)], {
      supportsNegative: !0
    });
    o("box-border", [["box-sizing", "border-box"]]), o("box-content", [["box-sizing", "content-box"]]), h("line-clamp", {
      themeKeys: ["--line-clamp"],
      handleBareValue: ({
        value: f
      }) => he(f) ? f : null,
      handle: f => [d("overflow", "hidden"), d("display", "-webkit-box"), d("-webkit-box-orient", "vertical"), d("-webkit-line-clamp", f)],
      staticValues: {
        none: [d("overflow", "visible"), d("display", "block"), d("-webkit-box-orient", "horizontal"), d("-webkit-line-clamp", "unset")]
      }
    }), c("line-clamp", () => [{
      values: ["1", "2", "3", "4", "5", "6"],
      valueThemeKeys: ["--line-clamp"]
    }]), o("block", [["display", "block"]]), o("inline-block", [["display", "inline-block"]]), o("inline", [["display", "inline"]]), o("hidden", [["display", "none"]]), o("inline-flex", [["display", "inline-flex"]]), o("table", [["display", "table"]]), o("inline-table", [["display", "inline-table"]]), o("table-caption", [["display", "table-caption"]]), o("table-cell", [["display", "table-cell"]]), o("table-column", [["display", "table-column"]]), o("table-column-group", [["display", "table-column-group"]]), o("table-footer-group", [["display", "table-footer-group"]]), o("table-header-group", [["display", "table-header-group"]]), o("table-row-group", [["display", "table-row-group"]]), o("table-row", [["display", "table-row"]]), o("flow-root", [["display", "flow-root"]]), o("flex", [["display", "flex"]]), o("grid", [["display", "grid"]]), o("inline-grid", [["display", "inline-grid"]]), o("contents", [["display", "contents"]]), o("list-item", [["display", "list-item"]]), o("field-sizing-content", [["field-sizing", "content"]]), o("field-sizing-fixed", [["field-sizing", "fixed"]]), h("aspect", {
      themeKeys: ["--aspect"],
      handleBareValue: ({
        fraction: f
      }) => {
        if (f === null) return null;
        let [N, C] = ye(f, "/");
        return !dn(N) || !dn(C) ? null : f;
      },
      handle: f => [d("aspect-ratio", f)],
      staticValues: {
        auto: [d("aspect-ratio", "auto")],
        square: [d("aspect-ratio", "1 / 1")]
      }
    });
    for (let [f, N] of [["full", "100%"], ["svw", "100svw"], ["lvw", "100lvw"], ["dvw", "100dvw"], ["svh", "100svh"], ["lvh", "100lvh"], ["dvh", "100dvh"], ["min", "min-content"], ["max", "max-content"], ["fit", "fit-content"]]) o(`size-${f}`, [["--tw-sort", "size"], ["width", N], ["height", N]]), o(`w-${f}`, [["width", N]]), o(`h-${f}`, [["height", N]]), o(`min-w-${f}`, [["min-width", N]]), o(`min-h-${f}`, [["min-height", N]]), o(`max-w-${f}`, [["max-width", N]]), o(`max-h-${f}`, [["max-height", N]]);
    o("size-auto", [["--tw-sort", "size"], ["width", "auto"], ["height", "auto"]]), o("w-auto", [["width", "auto"]]), o("h-auto", [["height", "auto"]]), o("min-w-auto", [["min-width", "auto"]]), o("min-h-auto", [["min-height", "auto"]]), o("h-lh", [["height", "1lh"]]), o("min-h-lh", [["min-height", "1lh"]]), o("max-h-lh", [["max-height", "1lh"]]), o("w-screen", [["width", "100vw"]]), o("min-w-screen", [["min-width", "100vw"]]), o("max-w-screen", [["max-width", "100vw"]]), o("h-screen", [["height", "100vh"]]), o("min-h-screen", [["min-height", "100vh"]]), o("max-h-screen", [["max-height", "100vh"]]), o("max-w-none", [["max-width", "none"]]), o("max-h-none", [["max-height", "none"]]), m("size", ["--size", "--spacing"], f => [d("--tw-sort", "size"), d("width", f), d("height", f)], {
      supportsFractions: !0
    });
    for (let [f, N, C] of [["w", ["--width", "--spacing", "--container"], "width"], ["min-w", ["--min-width", "--spacing", "--container"], "min-width"], ["max-w", ["--max-width", "--spacing", "--container"], "max-width"], ["h", ["--height", "--spacing"], "height"], ["min-h", ["--min-height", "--height", "--spacing"], "min-height"], ["max-h", ["--max-height", "--height", "--spacing"], "max-height"]]) m(f, N, K => [d(C, K)], {
      supportsFractions: !0
    });
    for (let [f, N] of [["full", "100%"], ["min", "min-content"], ["max", "max-content"], ["fit", "fit-content"]]) o(`inline-${f}`, [["inline-size", N]]), o(`block-${f}`, [["block-size", N]]), o(`min-inline-${f}`, [["min-inline-size", N]]), o(`min-block-${f}`, [["min-block-size", N]]), o(`max-inline-${f}`, [["max-inline-size", N]]), o(`max-block-${f}`, [["max-block-size", N]]);
    for (let [f, N] of [["svw", "100svw"], ["lvw", "100lvw"], ["dvw", "100dvw"]]) o(`inline-${f}`, [["inline-size", N]]), o(`min-inline-${f}`, [["min-inline-size", N]]), o(`max-inline-${f}`, [["max-inline-size", N]]);
    for (let [f, N] of [["svh", "100svh"], ["lvh", "100lvh"], ["dvh", "100dvh"]]) o(`block-${f}`, [["block-size", N]]), o(`min-block-${f}`, [["min-block-size", N]]), o(`max-block-${f}`, [["max-block-size", N]]);
    o("inline-auto", [["inline-size", "auto"]]), o("block-auto", [["block-size", "auto"]]), o("min-inline-auto", [["min-inline-size", "auto"]]), o("min-block-auto", [["min-block-size", "auto"]]), o("block-lh", [["block-size", "1lh"]]), o("min-block-lh", [["min-block-size", "1lh"]]), o("max-block-lh", [["max-block-size", "1lh"]]), o("inline-screen", [["inline-size", "100vw"]]), o("min-inline-screen", [["min-inline-size", "100vw"]]), o("max-inline-screen", [["max-inline-size", "100vw"]]), o("block-screen", [["block-size", "100vh"]]), o("min-block-screen", [["min-block-size", "100vh"]]), o("max-block-screen", [["max-block-size", "100vh"]]), o("max-inline-none", [["max-inline-size", "none"]]), o("max-block-none", [["max-block-size", "none"]]);
    for (let [f, N, C] of [["inline", ["--spacing", "--container"], "inline-size"], ["min-inline", ["--spacing", "--container"], "min-inline-size"], ["max-inline", ["--spacing", "--container"], "max-inline-size"], ["block", ["--spacing"], "block-size"], ["min-block", ["--spacing"], "min-block-size"], ["max-block", ["--spacing"], "max-block-size"]]) m(f, N, K => [d(C, K)], {
      supportsFractions: !0
    });
    a.static("container", () => {
      let f = [...r.namespace("--breakpoint").values()];
      f.sort((C, K) => Bo(C, K, "asc"));
      let N = [d("--tw-sort", "--tw-container-component"), d("width", "100%")];
      for (let C of f) N.push(tt("@media", `(width >= ${C})`, [d("max-width", C)]));
      return N;
    }), o("flex-auto", [["flex", "auto"]]), o("flex-initial", [["flex", "0 auto"]]), o("flex-none", [["flex", "none"]]), a.functional("flex", f => {
      if (f.value) {
        if (f.value.kind === "arbitrary") return f.modifier ? void 0 : [d("flex", f.value.value)];
        if (f.value.fraction) {
          let [N, C] = ye(f.value.fraction, "/");
          return !he(N) || !he(C) ? void 0 : [d("flex", `calc(${f.value.fraction} * 100%)`)];
        }
        if (he(f.value.value)) return f.modifier ? void 0 : [d("flex", f.value.value)];
      }
    }), c("flex", () => [{
      supportsFractions: !0
    }, {
      values: Array.from({
        length: 12
      }, (f, N) => `${N + 1}`)
    }]), h("shrink", {
      defaultValue: "1",
      handleBareValue: ({
        value: f
      }) => he(f) ? f : null,
      handle: f => [d("flex-shrink", f)]
    }), h("grow", {
      defaultValue: "1",
      handleBareValue: ({
        value: f
      }) => he(f) ? f : null,
      handle: f => [d("flex-grow", f)]
    }), c("shrink", () => [{
      values: ["0"],
      valueThemeKeys: [],
      hasDefaultValue: !0
    }]), c("grow", () => [{
      values: ["0"],
      valueThemeKeys: [],
      hasDefaultValue: !0
    }]), o("basis-auto", [["flex-basis", "auto"]]), o("basis-full", [["flex-basis", "100%"]]), m("basis", ["--flex-basis", "--spacing", "--container"], f => [d("flex-basis", f)], {
      supportsFractions: !0
    }), o("table-auto", [["table-layout", "auto"]]), o("table-fixed", [["table-layout", "fixed"]]), o("caption-top", [["caption-side", "top"]]), o("caption-bottom", [["caption-side", "bottom"]]), o("border-collapse", [["border-collapse", "collapse"]]), o("border-separate", [["border-collapse", "separate"]]);
    let O = () => We([G("--tw-border-spacing-x", "0", "<length>"), G("--tw-border-spacing-y", "0", "<length>")]);
    m("border-spacing", ["--border-spacing", "--spacing"], f => [O(), d("--tw-border-spacing-x", f), d("--tw-border-spacing-y", f), d("border-spacing", "var(--tw-border-spacing-x) var(--tw-border-spacing-y)")]), m("border-spacing-x", ["--border-spacing", "--spacing"], f => [O(), d("--tw-border-spacing-x", f), d("border-spacing", "var(--tw-border-spacing-x) var(--tw-border-spacing-y)")]), m("border-spacing-y", ["--border-spacing", "--spacing"], f => [O(), d("--tw-border-spacing-y", f), d("border-spacing", "var(--tw-border-spacing-x) var(--tw-border-spacing-y)")]), h("origin", {
      themeKeys: ["--transform-origin"],
      handle: f => [d("transform-origin", f)],
      staticValues: {
        center: [d("transform-origin", "center")],
        top: [d("transform-origin", "top")],
        "top-right": [d("transform-origin", "100% 0")],
        right: [d("transform-origin", "100%")],
        "bottom-right": [d("transform-origin", "100% 100%")],
        bottom: [d("transform-origin", "bottom")],
        "bottom-left": [d("transform-origin", "0 100%")],
        left: [d("transform-origin", "0")],
        "top-left": [d("transform-origin", "0 0")]
      }
    }), h("perspective-origin", {
      themeKeys: ["--perspective-origin"],
      handle: f => [d("perspective-origin", f)],
      staticValues: {
        center: [d("perspective-origin", "center")],
        top: [d("perspective-origin", "top")],
        "top-right": [d("perspective-origin", "100% 0")],
        right: [d("perspective-origin", "100%")],
        "bottom-right": [d("perspective-origin", "100% 100%")],
        bottom: [d("perspective-origin", "bottom")],
        "bottom-left": [d("perspective-origin", "0 100%")],
        left: [d("perspective-origin", "0")],
        "top-left": [d("perspective-origin", "0 0")]
      }
    }), h("perspective", {
      themeKeys: ["--perspective"],
      handle: f => [d("perspective", f)],
      staticValues: {
        none: [d("perspective", "none")]
      }
    });
    let S = () => We([G("--tw-translate-x", "0"), G("--tw-translate-y", "0"), G("--tw-translate-z", "0")]);
    o("translate-none", [["translate", "none"]]), o("-translate-full", [S, ["--tw-translate-x", "-100%"], ["--tw-translate-y", "-100%"], ["translate", "var(--tw-translate-x) var(--tw-translate-y)"]]), o("translate-full", [S, ["--tw-translate-x", "100%"], ["--tw-translate-y", "100%"], ["translate", "var(--tw-translate-x) var(--tw-translate-y)"]]), m("translate", ["--translate", "--spacing"], f => [S(), d("--tw-translate-x", f), d("--tw-translate-y", f), d("translate", "var(--tw-translate-x) var(--tw-translate-y)")], {
      supportsNegative: !0,
      supportsFractions: !0
    });
    for (let f of ["x", "y"]) o(`-translate-${f}-full`, [S, [`--tw-translate-${f}`, "-100%"], ["translate", "var(--tw-translate-x) var(--tw-translate-y)"]]), o(`translate-${f}-full`, [S, [`--tw-translate-${f}`, "100%"], ["translate", "var(--tw-translate-x) var(--tw-translate-y)"]]), m(`translate-${f}`, ["--translate", "--spacing"], N => [S(), d(`--tw-translate-${f}`, N), d("translate", "var(--tw-translate-x) var(--tw-translate-y)")], {
      supportsNegative: !0,
      supportsFractions: !0
    });
    m("translate-z", ["--translate", "--spacing"], f => [S(), d("--tw-translate-z", f), d("translate", "var(--tw-translate-x) var(--tw-translate-y) var(--tw-translate-z)")], {
      supportsNegative: !0
    }), o("translate-3d", [S, ["translate", "var(--tw-translate-x) var(--tw-translate-y) var(--tw-translate-z)"]]);
    let y = () => We([G("--tw-scale-x", "1"), G("--tw-scale-y", "1"), G("--tw-scale-z", "1")]);
    o("scale-none", [["scale", "none"]]);
    function k({
      negative: f
    }) {
      return N => {
        if (!N.value || N.modifier) return;
        let C;
        return N.value.kind === "arbitrary" ? (C = N.value.value, C = f ? `calc(${C} * -1)` : C, [d("scale", C)]) : (C = r.resolve(N.value.value, ["--scale"]), !C && he(N.value.value) && (C = `${N.value.value}%`), C ? (C = f ? `calc(${C} * -1)` : C, [y(), d("--tw-scale-x", C), d("--tw-scale-y", C), d("--tw-scale-z", C), d("scale", "var(--tw-scale-x) var(--tw-scale-y)")]) : void 0);
      };
    }
    a.functional("-scale", k({
      negative: !0
    })), a.functional("scale", k({
      negative: !1
    })), c("scale", () => [{
      supportsNegative: !0,
      values: ["0", "50", "75", "90", "95", "100", "105", "110", "125", "150", "200"],
      valueThemeKeys: ["--scale"]
    }]);
    for (let f of ["x", "y", "z"]) h(`scale-${f}`, {
      supportsNegative: !0,
      themeKeys: ["--scale"],
      handleBareValue: ({
        value: N
      }) => he(N) ? `${N}%` : null,
      handle: N => [y(), d(`--tw-scale-${f}`, N), d("scale", `var(--tw-scale-x) var(--tw-scale-y)${f === "z" ? " var(--tw-scale-z)" : ""}`)]
    }), c(`scale-${f}`, () => [{
      supportsNegative: !0,
      values: ["0", "50", "75", "90", "95", "100", "105", "110", "125", "150", "200"],
      valueThemeKeys: ["--scale"]
    }]);
    o("scale-3d", [y, ["scale", "var(--tw-scale-x) var(--tw-scale-y) var(--tw-scale-z)"]]), o("rotate-none", [["rotate", "none"]]);
    function b({
      negative: f
    }) {
      return N => {
        if (!N.value || N.modifier) return;
        let C;
        if (N.value.kind === "arbitrary") {
          C = N.value.value;
          let K = N.value.dataType ?? pt(C, ["angle", "vector"]);
          if (K === "vector") return [d("rotate", `${C} var(--tw-rotate)`)];
          if (K !== "angle") return [d("rotate", f ? `calc(${C} * -1)` : C)];
        } else if (C = r.resolve(N.value.value, ["--rotate"]), !C && he(N.value.value) && (C = `${N.value.value}deg`), !C) return;
        return [d("rotate", f ? `calc(${C} * -1)` : C)];
      };
    }
    a.functional("-rotate", b({
      negative: !0
    })), a.functional("rotate", b({
      negative: !1
    })), c("rotate", () => [{
      supportsNegative: !0,
      values: ["0", "1", "2", "3", "6", "12", "45", "90", "180"],
      valueThemeKeys: ["--rotate"]
    }]);
    {
      let f = ["var(--tw-rotate-x,)", "var(--tw-rotate-y,)", "var(--tw-rotate-z,)", "var(--tw-skew-x,)", "var(--tw-skew-y,)"].join(" "),
        N = () => We([G("--tw-rotate-x"), G("--tw-rotate-y"), G("--tw-rotate-z"), G("--tw-skew-x"), G("--tw-skew-y")]);
      for (let C of ["x", "y", "z"]) h(`rotate-${C}`, {
        supportsNegative: !0,
        themeKeys: ["--rotate"],
        handleBareValue: ({
          value: K
        }) => he(K) ? `${K}deg` : null,
        handle: K => [N(), d(`--tw-rotate-${C}`, `rotate${C.toUpperCase()}(${K})`), d("transform", f)]
      }), c(`rotate-${C}`, () => [{
        supportsNegative: !0,
        values: ["0", "1", "2", "3", "6", "12", "45", "90", "180"],
        valueThemeKeys: ["--rotate"]
      }]);
      h("skew", {
        supportsNegative: !0,
        themeKeys: ["--skew"],
        handleBareValue: ({
          value: C
        }) => he(C) ? `${C}deg` : null,
        handle: C => [N(), d("--tw-skew-x", `skewX(${C})`), d("--tw-skew-y", `skewY(${C})`), d("transform", f)]
      }), h("skew-x", {
        supportsNegative: !0,
        themeKeys: ["--skew"],
        handleBareValue: ({
          value: C
        }) => he(C) ? `${C}deg` : null,
        handle: C => [N(), d("--tw-skew-x", `skewX(${C})`), d("transform", f)]
      }), h("skew-y", {
        supportsNegative: !0,
        themeKeys: ["--skew"],
        handleBareValue: ({
          value: C
        }) => he(C) ? `${C}deg` : null,
        handle: C => [N(), d("--tw-skew-y", `skewY(${C})`), d("transform", f)]
      }), c("skew", () => [{
        supportsNegative: !0,
        values: ["0", "1", "2", "3", "6", "12"],
        valueThemeKeys: ["--skew"]
      }]), c("skew-x", () => [{
        supportsNegative: !0,
        values: ["0", "1", "2", "3", "6", "12"],
        valueThemeKeys: ["--skew"]
      }]), c("skew-y", () => [{
        supportsNegative: !0,
        values: ["0", "1", "2", "3", "6", "12"],
        valueThemeKeys: ["--skew"]
      }]), a.functional("transform", C => {
        if (C.modifier) return;
        let K = null;
        if (C.value ? C.value.kind === "arbitrary" && (K = C.value.value) : K = f, K !== null) return [N(), d("transform", K)];
      }), c("transform", () => [{
        hasDefaultValue: !0
      }]), o("transform-cpu", [["transform", f]]), o("transform-gpu", [["transform", `translateZ(0) ${f}`]]), o("transform-none", [["transform", "none"]]);
    }
    h("zoom", {
      handleBareValue: ({
        value: f
      }) => he(f) ? `${f}%` : null,
      handle: f => [d("zoom", f)]
    }), c("zoom", () => [{
      values: ["50", "75", "90", "95", "100", "105", "110", "125", "150", "200"]
    }]), o("transform-flat", [["transform-style", "flat"]]), o("transform-3d", [["transform-style", "preserve-3d"]]), o("transform-content", [["transform-box", "content-box"]]), o("transform-border", [["transform-box", "border-box"]]), o("transform-fill", [["transform-box", "fill-box"]]), o("transform-stroke", [["transform-box", "stroke-box"]]), o("transform-view", [["transform-box", "view-box"]]), o("backface-visible", [["backface-visibility", "visible"]]), o("backface-hidden", [["backface-visibility", "hidden"]]);
    for (let f of ["auto", "default", "pointer", "wait", "text", "move", "help", "not-allowed", "none", "context-menu", "progress", "cell", "crosshair", "vertical-text", "alias", "copy", "no-drop", "grab", "grabbing", "all-scroll", "col-resize", "row-resize", "n-resize", "e-resize", "s-resize", "w-resize", "ne-resize", "nw-resize", "se-resize", "sw-resize", "ew-resize", "ns-resize", "nesw-resize", "nwse-resize", "zoom-in", "zoom-out"]) o(`cursor-${f}`, [["cursor", f]]);
    h("cursor", {
      themeKeys: ["--cursor"],
      handle: f => [d("cursor", f)]
    });
    for (let f of ["auto", "none", "manipulation"]) o(`touch-${f}`, [["touch-action", f]]);
    let E = () => We([G("--tw-pan-x"), G("--tw-pan-y"), G("--tw-pinch-zoom")]);
    for (let f of ["x", "left", "right"]) o(`touch-pan-${f}`, [E, ["--tw-pan-x", `pan-${f}`], ["touch-action", "var(--tw-pan-x,) var(--tw-pan-y,) var(--tw-pinch-zoom,)"]]);
    for (let f of ["y", "up", "down"]) o(`touch-pan-${f}`, [E, ["--tw-pan-y", `pan-${f}`], ["touch-action", "var(--tw-pan-x,) var(--tw-pan-y,) var(--tw-pinch-zoom,)"]]);
    o("touch-pinch-zoom", [E, ["--tw-pinch-zoom", "pinch-zoom"], ["touch-action", "var(--tw-pan-x,) var(--tw-pan-y,) var(--tw-pinch-zoom,)"]]);
    for (let f of ["none", "text", "all", "auto"]) o(`select-${f}`, [["-webkit-user-select", f], ["user-select", f]]);
    o("resize-none", [["resize", "none"]]), o("resize-x", [["resize", "horizontal"]]), o("resize-y", [["resize", "vertical"]]), o("resize", [["resize", "both"]]), o("snap-none", [["scroll-snap-type", "none"]]);
    let A = () => We([G("--tw-scroll-snap-strictness", "proximity", "*")]);
    for (let f of ["x", "y", "both"]) o(`snap-${f}`, [A, ["scroll-snap-type", `${f} var(--tw-scroll-snap-strictness)`]]);
    o("snap-mandatory", [A, ["--tw-scroll-snap-strictness", "mandatory"]]), o("snap-proximity", [A, ["--tw-scroll-snap-strictness", "proximity"]]), o("snap-align-none", [["scroll-snap-align", "none"]]), o("snap-start", [["scroll-snap-align", "start"]]), o("snap-end", [["scroll-snap-align", "end"]]), o("snap-center", [["scroll-snap-align", "center"]]), o("snap-normal", [["scroll-snap-stop", "normal"]]), o("snap-always", [["scroll-snap-stop", "always"]]);
    for (let [f, N] of [["scroll-m", "scroll-margin"], ["scroll-mx", "scroll-margin-inline"], ["scroll-my", "scroll-margin-block"], ["scroll-ms", "scroll-margin-inline-start"], ["scroll-me", "scroll-margin-inline-end"], ["scroll-mbs", "scroll-margin-block-start"], ["scroll-mbe", "scroll-margin-block-end"], ["scroll-mt", "scroll-margin-top"], ["scroll-mr", "scroll-margin-right"], ["scroll-mb", "scroll-margin-bottom"], ["scroll-ml", "scroll-margin-left"]]) m(f, ["--scroll-margin", "--spacing"], C => [d(N, C)], {
      supportsNegative: !0
    });
    for (let [f, N] of [["scroll-p", "scroll-padding"], ["scroll-px", "scroll-padding-inline"], ["scroll-py", "scroll-padding-block"], ["scroll-ps", "scroll-padding-inline-start"], ["scroll-pe", "scroll-padding-inline-end"], ["scroll-pbs", "scroll-padding-block-start"], ["scroll-pbe", "scroll-padding-block-end"], ["scroll-pt", "scroll-padding-top"], ["scroll-pr", "scroll-padding-right"], ["scroll-pb", "scroll-padding-bottom"], ["scroll-pl", "scroll-padding-left"]]) m(f, ["--scroll-padding", "--spacing"], C => [d(N, C)]);
    o("list-inside", [["list-style-position", "inside"]]), o("list-outside", [["list-style-position", "outside"]]), h("list", {
      themeKeys: ["--list-style-type"],
      handle: f => [d("list-style-type", f)],
      staticValues: {
        none: [d("list-style-type", "none")],
        disc: [d("list-style-type", "disc")],
        decimal: [d("list-style-type", "decimal")]
      }
    }), h("list-image", {
      themeKeys: ["--list-style-image"],
      handle: f => [d("list-style-image", f)],
      staticValues: {
        none: [d("list-style-image", "none")]
      }
    }), o("appearance-none", [["appearance", "none"]]), o("appearance-auto", [["appearance", "auto"]]), o("scheme-normal", [["color-scheme", "normal"]]), o("scheme-dark", [["color-scheme", "dark"]]), o("scheme-light", [["color-scheme", "light"]]), o("scheme-light-dark", [["color-scheme", "light dark"]]), o("scheme-only-dark", [["color-scheme", "only dark"]]), o("scheme-only-light", [["color-scheme", "only light"]]), h("columns", {
      themeKeys: ["--columns", "--container"],
      handleBareValue: ({
        value: f
      }) => he(f) ? f : null,
      handle: f => [d("columns", f)],
      staticValues: {
        auto: [d("columns", "auto")]
      }
    }), c("columns", () => [{
      values: Array.from({
        length: 12
      }, (f, N) => `${N + 1}`),
      valueThemeKeys: ["--columns", "--container"]
    }]);
    for (let f of ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"]) o(`break-before-${f}`, [["break-before", f]]);
    for (let f of ["auto", "avoid", "avoid-page", "avoid-column"]) o(`break-inside-${f}`, [["break-inside", f]]);
    for (let f of ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"]) o(`break-after-${f}`, [["break-after", f]]);
    o("grid-flow-row", [["grid-auto-flow", "row"]]), o("grid-flow-col", [["grid-auto-flow", "column"]]), o("grid-flow-dense", [["grid-auto-flow", "dense"]]), o("grid-flow-row-dense", [["grid-auto-flow", "row dense"]]), o("grid-flow-col-dense", [["grid-auto-flow", "column dense"]]), h("auto-cols", {
      themeKeys: ["--grid-auto-columns"],
      handleBareValue: ({
        value: f
      }) => !r.resolve(null, ["--spacing"]) || !dn(f) ? null : `--spacing(${f})`,
      handle: f => [d("grid-auto-columns", f)],
      staticValues: {
        auto: [d("grid-auto-columns", "auto")],
        min: [d("grid-auto-columns", "min-content")],
        max: [d("grid-auto-columns", "max-content")],
        fr: [d("grid-auto-columns", "minmax(0, 1fr)")]
      }
    }), h("auto-rows", {
      themeKeys: ["--grid-auto-rows"],
      handleBareValue: ({
        value: f
      }) => !r.resolve(null, ["--spacing"]) || !dn(f) ? null : `--spacing(${f})`,
      handle: f => [d("grid-auto-rows", f)],
      staticValues: {
        auto: [d("grid-auto-rows", "auto")],
        min: [d("grid-auto-rows", "min-content")],
        max: [d("grid-auto-rows", "max-content")],
        fr: [d("grid-auto-rows", "minmax(0, 1fr)")]
      }
    }), h("grid-cols", {
      themeKeys: ["--grid-template-columns"],
      handleBareValue: ({
        value: f
      }) => hu(f) ? `repeat(${f}, minmax(0, 1fr))` : null,
      handle: f => [d("grid-template-columns", f)],
      staticValues: {
        none: [d("grid-template-columns", "none")],
        subgrid: [d("grid-template-columns", "subgrid")]
      }
    }), h("grid-rows", {
      themeKeys: ["--grid-template-rows"],
      handleBareValue: ({
        value: f
      }) => hu(f) ? `repeat(${f}, minmax(0, 1fr))` : null,
      handle: f => [d("grid-template-rows", f)],
      staticValues: {
        none: [d("grid-template-rows", "none")],
        subgrid: [d("grid-template-rows", "subgrid")]
      }
    }), c("grid-cols", () => [{
      values: Array.from({
        length: 12
      }, (f, N) => `${N + 1}`),
      valueThemeKeys: ["--grid-template-columns"]
    }]), c("grid-rows", () => [{
      values: Array.from({
        length: 12
      }, (f, N) => `${N + 1}`),
      valueThemeKeys: ["--grid-template-rows"]
    }]), o("flex-row", [["flex-direction", "row"]]), o("flex-row-reverse", [["flex-direction", "row-reverse"]]), o("flex-col", [["flex-direction", "column"]]), o("flex-col-reverse", [["flex-direction", "column-reverse"]]), o("flex-wrap", [["flex-wrap", "wrap"]]), o("flex-nowrap", [["flex-wrap", "nowrap"]]), o("flex-wrap-reverse", [["flex-wrap", "wrap-reverse"]]), o("place-content-center", [["place-content", "center"]]), o("place-content-start", [["place-content", "start"]]), o("place-content-end", [["place-content", "end"]]), o("place-content-center-safe", [["place-content", "safe center"]]), o("place-content-end-safe", [["place-content", "safe end"]]), o("place-content-between", [["place-content", "space-between"]]), o("place-content-around", [["place-content", "space-around"]]), o("place-content-evenly", [["place-content", "space-evenly"]]), o("place-content-baseline", [["place-content", "baseline"]]), o("place-content-stretch", [["place-content", "stretch"]]), o("place-items-center", [["place-items", "center"]]), o("place-items-start", [["place-items", "start"]]), o("place-items-end", [["place-items", "end"]]), o("place-items-center-safe", [["place-items", "safe center"]]), o("place-items-end-safe", [["place-items", "safe end"]]), o("place-items-baseline", [["place-items", "baseline"]]), o("place-items-stretch", [["place-items", "stretch"]]), o("content-normal", [["align-content", "normal"]]), o("content-center", [["align-content", "center"]]), o("content-start", [["align-content", "flex-start"]]), o("content-end", [["align-content", "flex-end"]]), o("content-center-safe", [["align-content", "safe center"]]), o("content-end-safe", [["align-content", "safe flex-end"]]), o("content-between", [["align-content", "space-between"]]), o("content-around", [["align-content", "space-around"]]), o("content-evenly", [["align-content", "space-evenly"]]), o("content-baseline", [["align-content", "baseline"]]), o("content-stretch", [["align-content", "stretch"]]), o("items-center", [["align-items", "center"]]), o("items-start", [["align-items", "flex-start"]]), o("items-end", [["align-items", "flex-end"]]), o("items-center-safe", [["align-items", "safe center"]]), o("items-end-safe", [["align-items", "safe flex-end"]]), o("items-baseline", [["align-items", "baseline"]]), o("items-baseline-last", [["align-items", "last baseline"]]), o("items-stretch", [["align-items", "stretch"]]), o("justify-normal", [["justify-content", "normal"]]), o("justify-center", [["justify-content", "center"]]), o("justify-start", [["justify-content", "flex-start"]]), o("justify-end", [["justify-content", "flex-end"]]), o("justify-center-safe", [["justify-content", "safe center"]]), o("justify-end-safe", [["justify-content", "safe flex-end"]]), o("justify-between", [["justify-content", "space-between"]]), o("justify-around", [["justify-content", "space-around"]]), o("justify-evenly", [["justify-content", "space-evenly"]]), o("justify-baseline", [["justify-content", "baseline"]]), o("justify-stretch", [["justify-content", "stretch"]]), o("justify-items-normal", [["justify-items", "normal"]]), o("justify-items-center", [["justify-items", "center"]]), o("justify-items-start", [["justify-items", "start"]]), o("justify-items-end", [["justify-items", "end"]]), o("justify-items-center-safe", [["justify-items", "safe center"]]), o("justify-items-end-safe", [["justify-items", "safe end"]]), o("justify-items-stretch", [["justify-items", "stretch"]]), m("gap", ["--gap", "--spacing"], f => [d("gap", f)]), m("gap-x", ["--gap", "--spacing"], f => [d("column-gap", f)]), m("gap-y", ["--gap", "--spacing"], f => [d("row-gap", f)]), m("space-x", ["--space", "--spacing"], f => {
      let N = (() => {
        if (f === "--spacing(0)" || f === "--spacing(-0)") return !0;
        let C = Ia.get(f);
        return !!(C && C[0] === 0 && (C[1] === null || oi(f)));
      })();
      return [We([G("--tw-space-x-reverse", "0")]), ot(":where(& > :not(:last-child))", [d("--tw-sort", "row-gap"), d("--tw-space-x-reverse", "0"), d("margin-inline-start", N ? "0" : `calc(${f} * var(--tw-space-x-reverse))`), d("margin-inline-end", N ? "0" : `calc(${f} * calc(1 - var(--tw-space-x-reverse)))`)])];
    }, {
      supportsNegative: !0
    }), m("space-y", ["--space", "--spacing"], f => {
      let N = (() => {
        if (f === "--spacing(0)" || f === "--spacing(-0)") return !0;
        let C = Ia.get(f);
        return !!(C && C[0] === 0 && (C[1] === null || oi(f)));
      })();
      return [We([G("--tw-space-y-reverse", "0")]), ot(":where(& > :not(:last-child))", [d("--tw-sort", "column-gap"), d("--tw-space-y-reverse", "0"), d("margin-block-start", N ? "0" : `calc(${f} * var(--tw-space-y-reverse))`), d("margin-block-end", N ? "0" : `calc(${f} * calc(1 - var(--tw-space-y-reverse)))`)])];
    }, {
      supportsNegative: !0
    }), o("space-x-reverse", [() => We([G("--tw-space-x-reverse", "0")]), () => ot(":where(& > :not(:last-child))", [d("--tw-sort", "row-gap"), d("--tw-space-x-reverse", "1")])]), o("space-y-reverse", [() => We([G("--tw-space-y-reverse", "0")]), () => ot(":where(& > :not(:last-child))", [d("--tw-sort", "column-gap"), d("--tw-space-y-reverse", "1")])]), o("accent-auto", [["accent-color", "auto"]]), v("accent", {
      themeKeys: ["--accent-color", "--color"],
      handle: f => [d("accent-color", f)]
    }), v("caret", {
      themeKeys: ["--caret-color", "--color"],
      handle: f => [d("caret-color", f)]
    }), v("divide", {
      themeKeys: ["--divide-color", "--border-color", "--color"],
      handle: f => [ot(":where(& > :not(:last-child))", [d("--tw-sort", "divide-color"), d("border-color", f)])]
    }), o("place-self-auto", [["place-self", "auto"]]), o("place-self-start", [["place-self", "start"]]), o("place-self-end", [["place-self", "end"]]), o("place-self-center", [["place-self", "center"]]), o("place-self-end-safe", [["place-self", "safe end"]]), o("place-self-center-safe", [["place-self", "safe center"]]), o("place-self-stretch", [["place-self", "stretch"]]), o("self-auto", [["align-self", "auto"]]), o("self-start", [["align-self", "flex-start"]]), o("self-end", [["align-self", "flex-end"]]), o("self-center", [["align-self", "center"]]), o("self-end-safe", [["align-self", "safe flex-end"]]), o("self-center-safe", [["align-self", "safe center"]]), o("self-stretch", [["align-self", "stretch"]]), o("self-baseline", [["align-self", "baseline"]]), o("self-baseline-last", [["align-self", "last baseline"]]), o("justify-self-auto", [["justify-self", "auto"]]), o("justify-self-start", [["justify-self", "flex-start"]]), o("justify-self-end", [["justify-self", "flex-end"]]), o("justify-self-center", [["justify-self", "center"]]), o("justify-self-end-safe", [["justify-self", "safe flex-end"]]), o("justify-self-center-safe", [["justify-self", "safe center"]]), o("justify-self-stretch", [["justify-self", "stretch"]]);
    for (let f of ["auto", "hidden", "clip", "visible", "scroll"]) o(`overflow-${f}`, [["overflow", f]]), o(`overflow-x-${f}`, [["overflow-x", f]]), o(`overflow-y-${f}`, [["overflow-y", f]]);
    for (let f of ["auto", "contain", "none"]) o(`overscroll-${f}`, [["overscroll-behavior", f]]), o(`overscroll-x-${f}`, [["overscroll-behavior-x", f]]), o(`overscroll-y-${f}`, [["overscroll-behavior-y", f]]);
    o("scroll-auto", [["scroll-behavior", "auto"]]), o("scroll-smooth", [["scroll-behavior", "smooth"]]), o("scrollbar-auto", [["scrollbar-width", "auto"]]), o("scrollbar-thin", [["scrollbar-width", "thin"]]), o("scrollbar-none", [["scrollbar-width", "none"]]);
    {
      let f = () => We([G("--tw-scrollbar-thumb", "#0000", "<color>"), G("--tw-scrollbar-track", "#0000", "<color>")]);
      v("scrollbar-thumb", {
        themeKeys: ["--color"],
        handle: N => [f(), d("--tw-scrollbar-thumb", N), d("scrollbar-color", "var(--tw-scrollbar-thumb) var(--tw-scrollbar-track)")]
      }), v("scrollbar-track", {
        themeKeys: ["--color"],
        handle: N => [f(), d("--tw-scrollbar-track", N), d("scrollbar-color", "var(--tw-scrollbar-thumb) var(--tw-scrollbar-track)")]
      });
    }
    o("scrollbar-gutter-auto", [["scrollbar-gutter", "auto"]]), o("scrollbar-gutter-stable", [["scrollbar-gutter", "stable"]]), o("scrollbar-gutter-both", [["scrollbar-gutter", "stable both-edges"]]), o("truncate", [["overflow", "hidden"], ["text-overflow", "ellipsis"], ["white-space", "nowrap"]]), o("text-ellipsis", [["text-overflow", "ellipsis"]]), o("text-clip", [["text-overflow", "clip"]]), o("hyphens-none", [["-webkit-hyphens", "none"], ["hyphens", "none"]]), o("hyphens-manual", [["-webkit-hyphens", "manual"], ["hyphens", "manual"]]), o("hyphens-auto", [["-webkit-hyphens", "auto"], ["hyphens", "auto"]]), o("whitespace-normal", [["white-space", "normal"]]), o("whitespace-nowrap", [["white-space", "nowrap"]]), o("whitespace-pre", [["white-space", "pre"]]), o("whitespace-pre-line", [["white-space", "pre-line"]]), o("whitespace-pre-wrap", [["white-space", "pre-wrap"]]), o("whitespace-break-spaces", [["white-space", "break-spaces"]]), h("tab", {
      handleBareValue: ({
        value: f
      }) => he(f) ? f : null,
      handle: f => [d("tab-size", f)]
    }), c("tab", () => [{
      values: ["2", "4", "8"]
    }]), o("text-wrap", [["text-wrap", "wrap"]]), o("text-nowrap", [["text-wrap", "nowrap"]]), o("text-balance", [["text-wrap", "balance"]]), o("text-pretty", [["text-wrap", "pretty"]]), o("break-normal", [["overflow-wrap", "normal"], ["word-break", "normal"]]), o("break-all", [["word-break", "break-all"]]), o("break-keep", [["word-break", "keep-all"]]), o("wrap-anywhere", [["overflow-wrap", "anywhere"]]), o("wrap-break-word", [["overflow-wrap", "break-word"]]), o("wrap-normal", [["overflow-wrap", "normal"]]);
    for (let [f, N] of [["rounded", ["border-radius"]], ["rounded-s", ["border-start-start-radius", "border-end-start-radius"]], ["rounded-e", ["border-start-end-radius", "border-end-end-radius"]], ["rounded-t", ["border-top-left-radius", "border-top-right-radius"]], ["rounded-r", ["border-top-right-radius", "border-bottom-right-radius"]], ["rounded-b", ["border-bottom-right-radius", "border-bottom-left-radius"]], ["rounded-l", ["border-top-left-radius", "border-bottom-left-radius"]], ["rounded-ss", ["border-start-start-radius"]], ["rounded-se", ["border-start-end-radius"]], ["rounded-ee", ["border-end-end-radius"]], ["rounded-es", ["border-end-start-radius"]], ["rounded-tl", ["border-top-left-radius"]], ["rounded-tr", ["border-top-right-radius"]], ["rounded-br", ["border-bottom-right-radius"]], ["rounded-bl", ["border-bottom-left-radius"]]]) h(f, {
      themeKeys: ["--radius"],
      handle: C => N.map(K => d(K, C)),
      staticValues: {
        none: N.map(C => d(C, "0")),
        full: N.map(C => d(C, "calc(infinity * 1px)"))
      }
    });
    o("border-solid", [["--tw-border-style", "solid"], ["border-style", "solid"]]), o("border-dashed", [["--tw-border-style", "dashed"], ["border-style", "dashed"]]), o("border-dotted", [["--tw-border-style", "dotted"], ["border-style", "dotted"]]), o("border-double", [["--tw-border-style", "double"], ["border-style", "double"]]), o("border-hidden", [["--tw-border-style", "hidden"], ["border-style", "hidden"]]), o("border-none", [["--tw-border-style", "none"], ["border-style", "none"]]);
    {
      let f = function (C, K) {
        a.functional(C, M => {
          if (!M.value) {
            if (M.modifier) return;
            let Y = r.get(["--default-border-width"]) ?? "1px",
              xe = K.width(Y);
            return xe ? [N(), ...xe] : void 0;
          }
          if (M.value.kind === "arbitrary") {
            let Y = M.value.value;
            switch (M.value.dataType ?? pt(Y, ["color", "line-width", "length"])) {
              case "line-width":
              case "length":
                {
                  if (M.modifier) return;
                  let xe = K.width(Y);
                  return xe ? [N(), ...xe] : void 0;
                }
              default:
                return Y = St(Y, M.modifier, r), Y === null ? void 0 : K.color(Y);
            }
          }
          {
            let Y = Vt(M, r, ["--border-color", "--color"]);
            if (Y) return K.color(Y);
          }
          {
            if (M.modifier) return;
            let Y = r.resolve(M.value.value, ["--border-width"]);
            if (Y) {
              let xe = K.width(Y);
              return xe ? [N(), ...xe] : void 0;
            }
            if (he(M.value.value)) {
              let xe = K.width(`${M.value.value}px`);
              return xe ? [N(), ...xe] : void 0;
            }
          }
        }), c(C, () => [{
          values: ["current", "inherit", "transparent"],
          valueThemeKeys: ["--border-color", "--color"],
          modifierThemeKeys: ["--opacity"],
          modifiers: Array.from({
            length: 21
          }, (M, Y) => `${Y * 5}`),
          hasDefaultValue: !0
        }, {
          values: ["0", "2", "4", "8"],
          valueThemeKeys: ["--border-width"]
        }]);
      };
      var T = f;
      let N = () => We([G("--tw-border-style", "solid")]);
      f("border", {
        width: C => [d("border-style", "var(--tw-border-style)"), d("border-width", C)],
        color: C => [d("border-color", C)]
      }), f("border-x", {
        width: C => [d("border-inline-style", "var(--tw-border-style)"), d("border-inline-width", C)],
        color: C => [d("border-inline-color", C)]
      }), f("border-y", {
        width: C => [d("border-block-style", "var(--tw-border-style)"), d("border-block-width", C)],
        color: C => [d("border-block-color", C)]
      }), f("border-s", {
        width: C => [d("border-inline-start-style", "var(--tw-border-style)"), d("border-inline-start-width", C)],
        color: C => [d("border-inline-start-color", C)]
      }), f("border-e", {
        width: C => [d("border-inline-end-style", "var(--tw-border-style)"), d("border-inline-end-width", C)],
        color: C => [d("border-inline-end-color", C)]
      }), f("border-bs", {
        width: C => [d("border-block-start-style", "var(--tw-border-style)"), d("border-block-start-width", C)],
        color: C => [d("border-block-start-color", C)]
      }), f("border-be", {
        width: C => [d("border-block-end-style", "var(--tw-border-style)"), d("border-block-end-width", C)],
        color: C => [d("border-block-end-color", C)]
      }), f("border-t", {
        width: C => [d("border-top-style", "var(--tw-border-style)"), d("border-top-width", C)],
        color: C => [d("border-top-color", C)]
      }), f("border-r", {
        width: C => [d("border-right-style", "var(--tw-border-style)"), d("border-right-width", C)],
        color: C => [d("border-right-color", C)]
      }), f("border-b", {
        width: C => [d("border-bottom-style", "var(--tw-border-style)"), d("border-bottom-width", C)],
        color: C => [d("border-bottom-color", C)]
      }), f("border-l", {
        width: C => [d("border-left-style", "var(--tw-border-style)"), d("border-left-width", C)],
        color: C => [d("border-left-color", C)]
      }), h("divide-x", {
        defaultValue: r.get(["--default-border-width"]) ?? "1px",
        themeKeys: ["--divide-width", "--border-width"],
        handleBareValue: ({
          value: C
        }) => he(C) ? `${C}px` : null,
        handle: C => [We([G("--tw-divide-x-reverse", "0")]), ot(":where(& > :not(:last-child))", [d("--tw-sort", "divide-x-width"), N(), d("--tw-divide-x-reverse", "0"), d("border-inline-style", "var(--tw-border-style)"), d("border-inline-start-width", `calc(${C} * var(--tw-divide-x-reverse))`), d("border-inline-end-width", `calc(${C} * calc(1 - var(--tw-divide-x-reverse)))`)])]
      }), h("divide-y", {
        defaultValue: r.get(["--default-border-width"]) ?? "1px",
        themeKeys: ["--divide-width", "--border-width"],
        handleBareValue: ({
          value: C
        }) => he(C) ? `${C}px` : null,
        handle: C => [We([G("--tw-divide-y-reverse", "0")]), ot(":where(& > :not(:last-child))", [d("--tw-sort", "divide-y-width"), N(), d("--tw-divide-y-reverse", "0"), d("border-bottom-style", "var(--tw-border-style)"), d("border-top-style", "var(--tw-border-style)"), d("border-top-width", `calc(${C} * var(--tw-divide-y-reverse))`), d("border-bottom-width", `calc(${C} * calc(1 - var(--tw-divide-y-reverse)))`)])]
      }), c("divide-x", () => [{
        values: ["0", "2", "4", "8"],
        valueThemeKeys: ["--divide-width", "--border-width"],
        hasDefaultValue: !0
      }]), c("divide-y", () => [{
        values: ["0", "2", "4", "8"],
        valueThemeKeys: ["--divide-width", "--border-width"],
        hasDefaultValue: !0
      }]), o("divide-x-reverse", [() => We([G("--tw-divide-x-reverse", "0")]), () => ot(":where(& > :not(:last-child))", [d("--tw-divide-x-reverse", "1")])]), o("divide-y-reverse", [() => We([G("--tw-divide-y-reverse", "0")]), () => ot(":where(& > :not(:last-child))", [d("--tw-divide-y-reverse", "1")])]);
      for (let C of ["solid", "dashed", "dotted", "double", "none"]) o(`divide-${C}`, [() => ot(":where(& > :not(:last-child))", [d("--tw-sort", "divide-style"), d("--tw-border-style", C), d("border-style", C)])]);
    }
    o("bg-auto", [["background-size", "auto"]]), o("bg-cover", [["background-size", "cover"]]), o("bg-contain", [["background-size", "contain"]]), h("bg-size", {
      handle(f) {
        if (f) return [d("background-size", f)];
      }
    }), o("bg-fixed", [["background-attachment", "fixed"]]), o("bg-local", [["background-attachment", "local"]]), o("bg-scroll", [["background-attachment", "scroll"]]), o("bg-top", [["background-position", "top"]]), o("bg-top-left", [["background-position", "left top"]]), o("bg-top-right", [["background-position", "right top"]]), o("bg-bottom", [["background-position", "bottom"]]), o("bg-bottom-left", [["background-position", "left bottom"]]), o("bg-bottom-right", [["background-position", "right bottom"]]), o("bg-left", [["background-position", "left"]]), o("bg-right", [["background-position", "right"]]), o("bg-center", [["background-position", "center"]]), h("bg-position", {
      handle(f) {
        if (f) return [d("background-position", f)];
      }
    }), o("bg-repeat", [["background-repeat", "repeat"]]), o("bg-no-repeat", [["background-repeat", "no-repeat"]]), o("bg-repeat-x", [["background-repeat", "repeat-x"]]), o("bg-repeat-y", [["background-repeat", "repeat-y"]]), o("bg-repeat-round", [["background-repeat", "round"]]), o("bg-repeat-space", [["background-repeat", "space"]]), o("bg-none", [["background-image", "none"]]);
    {
      let f = function (Y) {
          let xe = "in oklab";
          if (Y?.kind === "named") switch (Y.value) {
            case "longer":
            case "shorter":
            case "increasing":
            case "decreasing":
              xe = `in oklch ${Y.value} hue`;
              break;
            default:
              xe = `in ${Y.value}`;
          } else Y?.kind === "arbitrary" && (xe = Y.value);
          return xe;
        },
        N = function ({
          negative: Y
        }) {
          return xe => {
            if (!xe.value) return;
            if (xe.value.kind === "arbitrary") {
              if (xe.modifier) return;
              let He = xe.value.value;
              return (xe.value.dataType ?? pt(He, ["angle"])) === "angle" ? (He = Y ? `calc(${He} * -1)` : `${He}`, [d("--tw-gradient-position", He), d("background-image", `linear-gradient(var(--tw-gradient-stops,${He}))`)]) : Y ? void 0 : [d("--tw-gradient-position", He), d("background-image", `linear-gradient(var(--tw-gradient-stops,${He}))`)];
            }
            let Q = xe.value.value;
            if (!Y && M.has(Q)) Q = M.get(Q);else if (he(Q)) Q = Y ? `calc(${Q}deg * -1)` : `${Q}deg`;else return;
            let ce = f(xe.modifier);
            return [d("--tw-gradient-position", `${Q}`), xt("@supports (background-image: linear-gradient(in lab, red, red))", [d("--tw-gradient-position", `${Q} ${ce}`)]), d("background-image", "linear-gradient(var(--tw-gradient-stops))")];
          };
        },
        C = function ({
          negative: Y
        }) {
          return xe => {
            if (xe.value?.kind === "arbitrary") {
              if (xe.modifier) return;
              let He = xe.value.value;
              return [d("--tw-gradient-position", He), d("background-image", `conic-gradient(var(--tw-gradient-stops,${He}))`)];
            }
            let Q = f(xe.modifier);
            if (!xe.value) return [d("--tw-gradient-position", Q), d("background-image", "conic-gradient(var(--tw-gradient-stops))")];
            let ce = xe.value.value;
            if (he(ce)) return ce = Y ? `calc(${ce}deg * -1)` : `${ce}deg`, [d("--tw-gradient-position", `from ${ce} ${Q}`), d("background-image", "conic-gradient(var(--tw-gradient-stops))")];
          };
        };
      var R = f,
        H = N,
        ne = C;
      let K = ["oklab", "oklch", "srgb", "hsl", "longer", "shorter", "increasing", "decreasing"],
        M = new Map([["to-t", "to top"], ["to-tr", "to top right"], ["to-r", "to right"], ["to-br", "to bottom right"], ["to-b", "to bottom"], ["to-bl", "to bottom left"], ["to-l", "to left"], ["to-tl", "to top left"]]);
      a.functional("-bg-linear", N({
        negative: !0
      })), a.functional("bg-linear", N({
        negative: !1
      })), c("bg-linear", () => [{
        values: [...M.keys()],
        modifiers: K
      }, {
        values: ["0", "30", "60", "90", "120", "150", "180", "210", "240", "270", "300", "330"],
        supportsNegative: !0,
        modifiers: K
      }]), a.functional("-bg-conic", C({
        negative: !0
      })), a.functional("bg-conic", C({
        negative: !1
      })), c("bg-conic", () => [{
        hasDefaultValue: !0,
        modifiers: K
      }, {
        values: ["0", "30", "60", "90", "120", "150", "180", "210", "240", "270", "300", "330"],
        supportsNegative: !0,
        modifiers: K
      }]), a.functional("bg-radial", Y => {
        if (!Y.value) {
          let xe = f(Y.modifier);
          return [d("--tw-gradient-position", xe), d("background-image", "radial-gradient(var(--tw-gradient-stops))")];
        }
        if (Y.value.kind === "arbitrary") {
          if (Y.modifier) return;
          let xe = Y.value.value;
          return [d("--tw-gradient-position", xe), d("background-image", `radial-gradient(var(--tw-gradient-stops,${xe}))`)];
        }
      }), c("bg-radial", () => [{
        hasDefaultValue: !0,
        modifiers: K
      }]);
    }
    a.functional("bg", f => {
      if (f.value) {
        if (f.value.kind === "arbitrary") {
          let N = f.value.value;
          switch (f.value.dataType ?? pt(N, ["image", "color", "percentage", "position", "bg-size", "length", "url"])) {
            case "percentage":
            case "position":
              return f.modifier ? void 0 : [d("background-position", N)];
            case "bg-size":
            case "length":
            case "size":
              return f.modifier ? void 0 : [d("background-size", N)];
            case "image":
            case "url":
              return f.modifier ? void 0 : [d("background-image", N)];
            default:
              return N = St(N, f.modifier, r), N === null ? void 0 : [d("background-color", N)];
          }
        }
        {
          let N = Vt(f, r, ["--background-color", "--color"]);
          if (N) return [d("background-color", N)];
        }
        {
          if (f.modifier) return;
          let N = r.resolve(f.value.value, ["--background-image"]);
          if (N) return [d("background-image", N)];
        }
      }
    }), c("bg", () => [{
      values: ["current", "inherit", "transparent"],
      valueThemeKeys: ["--background-color", "--color"],
      modifierThemeKeys: ["--opacity"],
      modifiers: Array.from({
        length: 21
      }, (f, N) => `${N * 5}`)
    }, {
      values: [],
      valueThemeKeys: ["--background-image"]
    }]);
    let B = () => We([G("--tw-gradient-position"), G("--tw-gradient-from", "#0000", "<color>"), G("--tw-gradient-via", "#0000", "<color>"), G("--tw-gradient-to", "#0000", "<color>"), G("--tw-gradient-stops"), G("--tw-gradient-via-stops"), G("--tw-gradient-from-position", "0%", "<length-percentage>"), G("--tw-gradient-via-position", "50%", "<length-percentage>"), G("--tw-gradient-to-position", "100%", "<length-percentage>")]);
    function U(f, N) {
      a.functional(f, C => {
        if (C.value) {
          if (C.value.kind === "arbitrary") {
            let K = C.value.value;
            switch (C.value.dataType ?? pt(K, ["color", "length", "percentage"])) {
              case "length":
              case "percentage":
                return C.modifier ? void 0 : N.position(K);
              default:
                return K = St(K, C.modifier, r), K === null ? void 0 : N.color(K);
            }
          }
          {
            let K = Vt(C, r, ["--background-color", "--color"]);
            if (K) return N.color(K);
          }
          {
            if (C.modifier) return;
            let K = r.resolve(C.value.value, ["--gradient-color-stop-positions"]);
            if (K) return N.position(K);
            if (C.value.value[C.value.value.length - 1] === "%" && he(C.value.value.slice(0, -1))) return N.position(C.value.value);
          }
        }
      }), c(f, () => [{
        values: ["current", "inherit", "transparent"],
        valueThemeKeys: ["--background-color", "--color"],
        modifierThemeKeys: ["--opacity"],
        modifiers: Array.from({
          length: 21
        }, (C, K) => `${K * 5}`)
      }, {
        values: Array.from({
          length: 21
        }, (C, K) => `${K * 5}%`),
        valueThemeKeys: ["--gradient-color-stop-positions"]
      }]);
    }
    U("from", {
      color: f => [B(), d("--tw-sort", "--tw-gradient-from"), d("--tw-gradient-from", f), d("--tw-gradient-stops", "var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position))")],
      position: f => [B(), d("--tw-gradient-from-position", f)]
    }), o("via-none", [["--tw-gradient-via-stops", "initial"]]), U("via", {
      color: f => [B(), d("--tw-sort", "--tw-gradient-via"), d("--tw-gradient-via", f), d("--tw-gradient-via-stops", "var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-via) var(--tw-gradient-via-position), var(--tw-gradient-to) var(--tw-gradient-to-position)"), d("--tw-gradient-stops", "var(--tw-gradient-via-stops)")],
      position: f => [B(), d("--tw-gradient-via-position", f)]
    }), U("to", {
      color: f => [B(), d("--tw-sort", "--tw-gradient-to"), d("--tw-gradient-to", f), d("--tw-gradient-stops", "var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position))")],
      position: f => [B(), d("--tw-gradient-to-position", f)]
    }), o("mask-none", [["mask-image", "none"]]), a.functional("mask", f => {
      if (!f.value || f.modifier || f.value.kind !== "arbitrary") return;
      let N = f.value.value;
      switch (f.value.dataType ?? pt(N, ["image", "percentage", "position", "bg-size", "length", "url"])) {
        case "percentage":
        case "position":
          return f.modifier ? void 0 : [d("mask-position", N)];
        case "bg-size":
        case "length":
        case "size":
          return [d("mask-size", N)];
        default:
          return [d("mask-image", N)];
      }
    }), o("mask-add", [["mask-composite", "add"]]), o("mask-subtract", [["mask-composite", "subtract"]]), o("mask-intersect", [["mask-composite", "intersect"]]), o("mask-exclude", [["mask-composite", "exclude"]]), o("mask-alpha", [["mask-mode", "alpha"]]), o("mask-luminance", [["mask-mode", "luminance"]]), o("mask-match", [["mask-mode", "match-source"]]), o("mask-type-alpha", [["mask-type", "alpha"]]), o("mask-type-luminance", [["mask-type", "luminance"]]), o("mask-auto", [["mask-size", "auto"]]), o("mask-cover", [["mask-size", "cover"]]), o("mask-contain", [["mask-size", "contain"]]), h("mask-size", {
      handle(f) {
        if (f) return [d("mask-size", f)];
      }
    }), o("mask-top", [["mask-position", "top"]]), o("mask-top-left", [["mask-position", "left top"]]), o("mask-top-right", [["mask-position", "right top"]]), o("mask-bottom", [["mask-position", "bottom"]]), o("mask-bottom-left", [["mask-position", "left bottom"]]), o("mask-bottom-right", [["mask-position", "right bottom"]]), o("mask-left", [["mask-position", "left"]]), o("mask-right", [["mask-position", "right"]]), o("mask-center", [["mask-position", "center"]]), h("mask-position", {
      handle(f) {
        if (f) return [d("mask-position", f)];
      }
    }), o("mask-repeat", [["mask-repeat", "repeat"]]), o("mask-no-repeat", [["mask-repeat", "no-repeat"]]), o("mask-repeat-x", [["mask-repeat", "repeat-x"]]), o("mask-repeat-y", [["mask-repeat", "repeat-y"]]), o("mask-repeat-round", [["mask-repeat", "round"]]), o("mask-repeat-space", [["mask-repeat", "space"]]), o("mask-clip-border", [["mask-clip", "border-box"]]), o("mask-clip-padding", [["mask-clip", "padding-box"]]), o("mask-clip-content", [["mask-clip", "content-box"]]), o("mask-clip-fill", [["mask-clip", "fill-box"]]), o("mask-clip-stroke", [["mask-clip", "stroke-box"]]), o("mask-clip-view", [["mask-clip", "view-box"]]), o("mask-no-clip", [["mask-clip", "no-clip"]]), o("mask-origin-border", [["mask-origin", "border-box"]]), o("mask-origin-padding", [["mask-origin", "padding-box"]]), o("mask-origin-content", [["mask-origin", "content-box"]]), o("mask-origin-fill", [["mask-origin", "fill-box"]]), o("mask-origin-stroke", [["mask-origin", "stroke-box"]]), o("mask-origin-view", [["mask-origin", "view-box"]]);
    let Oe = () => We([G("--tw-mask-linear", "linear-gradient(#fff, #fff)"), G("--tw-mask-radial", "linear-gradient(#fff, #fff)"), G("--tw-mask-conic", "linear-gradient(#fff, #fff)")]);
    function Ve(f, N) {
      a.functional(f, C => {
        if (C.value) {
          if (C.value.kind === "arbitrary") {
            let K = C.value.value;
            switch (C.value.dataType ?? pt(K, ["length", "percentage", "color"])) {
              case "color":
                return K = St(K, C.modifier, r), K === null ? void 0 : N.color(K);
              case "percentage":
                return C.modifier || !he(K.slice(0, -1)) ? void 0 : N.position(K);
              default:
                return C.modifier ? void 0 : N.position(K);
            }
          }
          {
            let K = Vt(C, r, ["--background-color", "--color"]);
            if (K) return N.color(K);
          }
          {
            if (C.modifier) return;
            let K = pt(C.value.value, ["number", "percentage"]);
            if (!K) return;
            switch (K) {
              case "number":
                return !r.resolve(null, ["--spacing"]) || !dn(C.value.value) ? void 0 : N.position(`--spacing(${C.value.value})`);
              case "percentage":
                return he(C.value.value.slice(0, -1)) ? N.position(C.value.value) : void 0;
              default:
                return;
            }
          }
        }
      }), c(f, () => [{
        values: ["current", "inherit", "transparent"],
        valueThemeKeys: ["--background-color", "--color"],
        modifierThemeKeys: ["--opacity"],
        modifiers: Array.from({
          length: 21
        }, (C, K) => `${K * 5}`)
      }, {
        values: Array.from({
          length: 21
        }, (C, K) => `${K * 5}%`),
        valueThemeKeys: ["--gradient-color-stop-positions"]
      }]), c(f, () => [{
        values: Array.from({
          length: 21
        }, (C, K) => `${K * 5}%`)
      }, {
        values: r.get(["--spacing"]) ? Wo : []
      }, {
        values: ["current", "inherit", "transparent"],
        valueThemeKeys: ["--background-color", "--color"],
        modifierThemeKeys: ["--opacity"],
        modifiers: Array.from({
          length: 21
        }, (C, K) => `${K * 5}`)
      }]);
    }
    let Ie = () => We([G("--tw-mask-left", "linear-gradient(#fff, #fff)"), G("--tw-mask-right", "linear-gradient(#fff, #fff)"), G("--tw-mask-bottom", "linear-gradient(#fff, #fff)"), G("--tw-mask-top", "linear-gradient(#fff, #fff)")]);
    function Se(f, N, C) {
      Ve(f, {
        color(K) {
          let M = [Oe(), Ie(), d("mask-image", "var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic)"), d("mask-composite", "intersect"), d("--tw-mask-linear", "var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top)")];
          for (let Y of ["top", "right", "bottom", "left"]) C[Y] && (M.push(d(`--tw-mask-${Y}`, `linear-gradient(to ${Y}, var(--tw-mask-${Y}-from-color) var(--tw-mask-${Y}-from-position), var(--tw-mask-${Y}-to-color) var(--tw-mask-${Y}-to-position))`)), M.push(We([G(`--tw-mask-${Y}-from-position`, "0%"), G(`--tw-mask-${Y}-to-position`, "100%"), G(`--tw-mask-${Y}-from-color`, "black"), G(`--tw-mask-${Y}-to-color`, "transparent")])), M.push(d(`--tw-mask-${Y}-${N}-color`, K)));
          return M;
        },
        position(K) {
          let M = [Oe(), Ie(), d("mask-image", "var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic)"), d("mask-composite", "intersect"), d("--tw-mask-linear", "var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top)")];
          for (let Y of ["top", "right", "bottom", "left"]) C[Y] && (M.push(d(`--tw-mask-${Y}`, `linear-gradient(to ${Y}, var(--tw-mask-${Y}-from-color) var(--tw-mask-${Y}-from-position), var(--tw-mask-${Y}-to-color) var(--tw-mask-${Y}-to-position))`)), M.push(We([G(`--tw-mask-${Y}-from-position`, "0%"), G(`--tw-mask-${Y}-to-position`, "100%"), G(`--tw-mask-${Y}-from-color`, "black"), G(`--tw-mask-${Y}-to-color`, "transparent")])), M.push(d(`--tw-mask-${Y}-${N}-position`, K)));
          return M;
        }
      });
    }
    Se("mask-x-from", "from", {
      top: !1,
      right: !0,
      bottom: !1,
      left: !0
    }), Se("mask-x-to", "to", {
      top: !1,
      right: !0,
      bottom: !1,
      left: !0
    }), Se("mask-y-from", "from", {
      top: !0,
      right: !1,
      bottom: !0,
      left: !1
    }), Se("mask-y-to", "to", {
      top: !0,
      right: !1,
      bottom: !0,
      left: !1
    }), Se("mask-t-from", "from", {
      top: !0,
      right: !1,
      bottom: !1,
      left: !1
    }), Se("mask-t-to", "to", {
      top: !0,
      right: !1,
      bottom: !1,
      left: !1
    }), Se("mask-r-from", "from", {
      top: !1,
      right: !0,
      bottom: !1,
      left: !1
    }), Se("mask-r-to", "to", {
      top: !1,
      right: !0,
      bottom: !1,
      left: !1
    }), Se("mask-b-from", "from", {
      top: !1,
      right: !1,
      bottom: !0,
      left: !1
    }), Se("mask-b-to", "to", {
      top: !1,
      right: !1,
      bottom: !0,
      left: !1
    }), Se("mask-l-from", "from", {
      top: !1,
      right: !1,
      bottom: !1,
      left: !0
    }), Se("mask-l-to", "to", {
      top: !1,
      right: !1,
      bottom: !1,
      left: !0
    });
    let ge = () => We([G("--tw-mask-linear-position", "0deg"), G("--tw-mask-linear-from-position", "0%"), G("--tw-mask-linear-to-position", "100%"), G("--tw-mask-linear-from-color", "black"), G("--tw-mask-linear-to-color", "transparent")]);
    h("mask-linear", {
      defaultValue: null,
      supportsNegative: !0,
      supportsFractions: !1,
      handleBareValue({
        value: f
      }) {
        if (!he(f)) return null;
        let N = Number(f);
        return N === 0 ? "0deg" : N === 1 ? "1deg" : `calc(1deg * ${f})`;
      },
      handleNegativeBareValue({
        value: f
      }) {
        if (!he(f)) return null;
        let N = Number(f);
        return N === 0 ? "0deg" : N === 1 ? "-1deg" : `calc(1deg * -${f})`;
      },
      handle: f => [Oe(), ge(), d("mask-image", "var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic)"), d("mask-composite", "intersect"), d("--tw-mask-linear", "linear-gradient(var(--tw-mask-linear-stops, var(--tw-mask-linear-position)))"), d("--tw-mask-linear-position", f)]
    }), c("mask-linear", () => [{
      supportsNegative: !0,
      values: ["0", "1", "2", "3", "6", "12", "45", "90", "180"]
    }]), Ve("mask-linear-from", {
      color: f => [Oe(), ge(), d("mask-image", "var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic)"), d("mask-composite", "intersect"), d("--tw-mask-linear-stops", "var(--tw-mask-linear-position), var(--tw-mask-linear-from-color) var(--tw-mask-linear-from-position), var(--tw-mask-linear-to-color) var(--tw-mask-linear-to-position)"), d("--tw-mask-linear", "linear-gradient(var(--tw-mask-linear-stops))"), d("--tw-mask-linear-from-color", f)],
      position: f => [Oe(), ge(), d("mask-image", "var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic)"), d("mask-composite", "intersect"), d("--tw-mask-linear-stops", "var(--tw-mask-linear-position), var(--tw-mask-linear-from-color) var(--tw-mask-linear-from-position), var(--tw-mask-linear-to-color) var(--tw-mask-linear-to-position)"), d("--tw-mask-linear", "linear-gradient(var(--tw-mask-linear-stops))"), d("--tw-mask-linear-from-position", f)]
    }), Ve("mask-linear-to", {
      color: f => [Oe(), ge(), d("mask-image", "var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic)"), d("mask-composite", "intersect"), d("--tw-mask-linear-stops", "var(--tw-mask-linear-position), var(--tw-mask-linear-from-color) var(--tw-mask-linear-from-position), var(--tw-mask-linear-to-color) var(--tw-mask-linear-to-position)"), d("--tw-mask-linear", "linear-gradient(var(--tw-mask-linear-stops))"), d("--tw-mask-linear-to-color", f)],
      position: f => [Oe(), ge(), d("mask-image", "var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic)"), d("mask-composite", "intersect"), d("--tw-mask-linear-stops", "var(--tw-mask-linear-position), var(--tw-mask-linear-from-color) var(--tw-mask-linear-from-position), var(--tw-mask-linear-to-color) var(--tw-mask-linear-to-position)"), d("--tw-mask-linear", "linear-gradient(var(--tw-mask-linear-stops))"), d("--tw-mask-linear-to-position", f)]
    });
    let Le = () => We([G("--tw-mask-radial-from-position", "0%"), G("--tw-mask-radial-to-position", "100%"), G("--tw-mask-radial-from-color", "black"), G("--tw-mask-radial-to-color", "transparent"), G("--tw-mask-radial-shape", "ellipse"), G("--tw-mask-radial-size", "farthest-corner"), G("--tw-mask-radial-position", "center")]);
    o("mask-circle", [["--tw-mask-radial-shape", "circle"]]), o("mask-ellipse", [["--tw-mask-radial-shape", "ellipse"]]), o("mask-radial-closest-side", [["--tw-mask-radial-size", "closest-side"]]), o("mask-radial-farthest-side", [["--tw-mask-radial-size", "farthest-side"]]), o("mask-radial-closest-corner", [["--tw-mask-radial-size", "closest-corner"]]), o("mask-radial-farthest-corner", [["--tw-mask-radial-size", "farthest-corner"]]), o("mask-radial-at-top", [["--tw-mask-radial-position", "top"]]), o("mask-radial-at-top-left", [["--tw-mask-radial-position", "top left"]]), o("mask-radial-at-top-right", [["--tw-mask-radial-position", "top right"]]), o("mask-radial-at-bottom", [["--tw-mask-radial-position", "bottom"]]), o("mask-radial-at-bottom-left", [["--tw-mask-radial-position", "bottom left"]]), o("mask-radial-at-bottom-right", [["--tw-mask-radial-position", "bottom right"]]), o("mask-radial-at-left", [["--tw-mask-radial-position", "left"]]), o("mask-radial-at-right", [["--tw-mask-radial-position", "right"]]), o("mask-radial-at-center", [["--tw-mask-radial-position", "center"]]), h("mask-radial-at", {
      defaultValue: null,
      supportsNegative: !1,
      supportsFractions: !1,
      handle: f => [d("--tw-mask-radial-position", f)]
    }), h("mask-radial", {
      defaultValue: null,
      supportsNegative: !1,
      supportsFractions: !1,
      handle: f => [Oe(), Le(), d("mask-image", "var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic)"), d("mask-composite", "intersect"), d("--tw-mask-radial", "radial-gradient(var(--tw-mask-radial-stops, var(--tw-mask-radial-size)))"), d("--tw-mask-radial-size", f)]
    }), Ve("mask-radial-from", {
      color: f => [Oe(), Le(), d("mask-image", "var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic)"), d("mask-composite", "intersect"), d("--tw-mask-radial-stops", "var(--tw-mask-radial-shape) var(--tw-mask-radial-size) at var(--tw-mask-radial-position), var(--tw-mask-radial-from-color) var(--tw-mask-radial-from-position), var(--tw-mask-radial-to-color) var(--tw-mask-radial-to-position)"), d("--tw-mask-radial", "radial-gradient(var(--tw-mask-radial-stops))"), d("--tw-mask-radial-from-color", f)],
      position: f => [Oe(), Le(), d("mask-image", "var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic)"), d("mask-composite", "intersect"), d("--tw-mask-radial-stops", "var(--tw-mask-radial-shape) var(--tw-mask-radial-size) at var(--tw-mask-radial-position), var(--tw-mask-radial-from-color) var(--tw-mask-radial-from-position), var(--tw-mask-radial-to-color) var(--tw-mask-radial-to-position)"), d("--tw-mask-radial", "radial-gradient(var(--tw-mask-radial-stops))"), d("--tw-mask-radial-from-position", f)]
    }), Ve("mask-radial-to", {
      color: f => [Oe(), Le(), d("mask-image", "var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic)"), d("mask-composite", "intersect"), d("--tw-mask-radial-stops", "var(--tw-mask-radial-shape) var(--tw-mask-radial-size) at var(--tw-mask-radial-position), var(--tw-mask-radial-from-color) var(--tw-mask-radial-from-position), var(--tw-mask-radial-to-color) var(--tw-mask-radial-to-position)"), d("--tw-mask-radial", "radial-gradient(var(--tw-mask-radial-stops))"), d("--tw-mask-radial-to-color", f)],
      position: f => [Oe(), Le(), d("mask-image", "var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic)"), d("mask-composite", "intersect"), d("--tw-mask-radial-stops", "var(--tw-mask-radial-shape) var(--tw-mask-radial-size) at var(--tw-mask-radial-position), var(--tw-mask-radial-from-color) var(--tw-mask-radial-from-position), var(--tw-mask-radial-to-color) var(--tw-mask-radial-to-position)"), d("--tw-mask-radial", "radial-gradient(var(--tw-mask-radial-stops))"), d("--tw-mask-radial-to-position", f)]
    });
    let ze = () => We([G("--tw-mask-conic-position", "0deg"), G("--tw-mask-conic-from-position", "0%"), G("--tw-mask-conic-to-position", "100%"), G("--tw-mask-conic-from-color", "black"), G("--tw-mask-conic-to-color", "transparent")]);
    h("mask-conic", {
      defaultValue: null,
      supportsNegative: !0,
      supportsFractions: !1,
      handleBareValue({
        value: f
      }) {
        if (!he(f)) return null;
        let N = Number(f);
        return N === 0 ? "0deg" : N === 1 ? "1deg" : `calc(1deg * ${f})`;
      },
      handleNegativeBareValue({
        value: f
      }) {
        if (!he(f)) return null;
        let N = Number(f);
        return N === 0 ? "0deg" : N === 1 ? "-1deg" : `calc(1deg * -${f})`;
      },
      handle: f => [Oe(), ze(), d("mask-image", "var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic)"), d("mask-composite", "intersect"), d("--tw-mask-conic", "conic-gradient(var(--tw-mask-conic-stops, var(--tw-mask-conic-position)))"), d("--tw-mask-conic-position", f)]
    }), c("mask-conic", () => [{
      supportsNegative: !0,
      values: ["0", "1", "2", "3", "6", "12", "45", "90", "180"]
    }]), Ve("mask-conic-from", {
      color: f => [Oe(), ze(), d("mask-image", "var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic)"), d("mask-composite", "intersect"), d("--tw-mask-conic-stops", "from var(--tw-mask-conic-position), var(--tw-mask-conic-from-color) var(--tw-mask-conic-from-position), var(--tw-mask-conic-to-color) var(--tw-mask-conic-to-position)"), d("--tw-mask-conic", "conic-gradient(var(--tw-mask-conic-stops))"), d("--tw-mask-conic-from-color", f)],
      position: f => [Oe(), ze(), d("mask-image", "var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic)"), d("mask-composite", "intersect"), d("--tw-mask-conic-stops", "from var(--tw-mask-conic-position), var(--tw-mask-conic-from-color) var(--tw-mask-conic-from-position), var(--tw-mask-conic-to-color) var(--tw-mask-conic-to-position)"), d("--tw-mask-conic", "conic-gradient(var(--tw-mask-conic-stops))"), d("--tw-mask-conic-from-position", f)]
    }), Ve("mask-conic-to", {
      color: f => [Oe(), ze(), d("mask-image", "var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic)"), d("mask-composite", "intersect"), d("--tw-mask-conic-stops", "from var(--tw-mask-conic-position), var(--tw-mask-conic-from-color) var(--tw-mask-conic-from-position), var(--tw-mask-conic-to-color) var(--tw-mask-conic-to-position)"), d("--tw-mask-conic", "conic-gradient(var(--tw-mask-conic-stops))"), d("--tw-mask-conic-to-color", f)],
      position: f => [Oe(), ze(), d("mask-image", "var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic)"), d("mask-composite", "intersect"), d("--tw-mask-conic-stops", "from var(--tw-mask-conic-position), var(--tw-mask-conic-from-color) var(--tw-mask-conic-from-position), var(--tw-mask-conic-to-color) var(--tw-mask-conic-to-position)"), d("--tw-mask-conic", "conic-gradient(var(--tw-mask-conic-stops))"), d("--tw-mask-conic-to-position", f)]
    }), o("box-decoration-slice", [["-webkit-box-decoration-break", "slice"], ["box-decoration-break", "slice"]]), o("box-decoration-clone", [["-webkit-box-decoration-break", "clone"], ["box-decoration-break", "clone"]]), o("bg-clip-text", [["background-clip", "text"]]), o("bg-clip-border", [["background-clip", "border-box"]]), o("bg-clip-padding", [["background-clip", "padding-box"]]), o("bg-clip-content", [["background-clip", "content-box"]]), o("bg-origin-border", [["background-origin", "border-box"]]), o("bg-origin-padding", [["background-origin", "padding-box"]]), o("bg-origin-content", [["background-origin", "content-box"]]);
    for (let f of ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"]) o(`bg-blend-${f}`, [["background-blend-mode", f]]), o(`mix-blend-${f}`, [["mix-blend-mode", f]]);
    o("mix-blend-plus-darker", [["mix-blend-mode", "plus-darker"]]), o("mix-blend-plus-lighter", [["mix-blend-mode", "plus-lighter"]]), o("fill-none", [["fill", "none"]]), a.functional("fill", f => {
      if (!f.value) return;
      if (f.value.kind === "arbitrary") {
        let C = St(f.value.value, f.modifier, r);
        return C === null ? void 0 : [d("fill", C)];
      }
      let N = Vt(f, r, ["--fill", "--color"]);
      if (N) return [d("fill", N)];
    }), c("fill", () => [{
      values: ["current", "inherit", "transparent"],
      valueThemeKeys: ["--fill", "--color"],
      modifierThemeKeys: ["--opacity"],
      modifiers: Array.from({
        length: 21
      }, (f, N) => `${N * 5}`)
    }]), o("stroke-none", [["stroke", "none"]]), a.functional("stroke", f => {
      if (f.value) {
        if (f.value.kind === "arbitrary") {
          let N = f.value.value;
          switch (f.value.dataType ?? pt(N, ["color", "number", "length", "percentage"])) {
            case "number":
            case "length":
            case "percentage":
              return f.modifier ? void 0 : [d("stroke-width", N)];
            default:
              return N = St(f.value.value, f.modifier, r), N === null ? void 0 : [d("stroke", N)];
          }
        }
        {
          let N = Vt(f, r, ["--stroke", "--color"]);
          if (N) return [d("stroke", N)];
        }
        {
          let N = r.resolve(f.value.value, ["--stroke-width"]);
          if (N) return [d("stroke-width", N)];
          if (he(f.value.value)) return [d("stroke-width", f.value.value)];
        }
      }
    }), c("stroke", () => [{
      values: ["current", "inherit", "transparent"],
      valueThemeKeys: ["--stroke", "--color"],
      modifierThemeKeys: ["--opacity"],
      modifiers: Array.from({
        length: 21
      }, (f, N) => `${N * 5}`)
    }, {
      values: ["0", "1", "2", "3"],
      valueThemeKeys: ["--stroke-width"]
    }]), o("object-contain", [["object-fit", "contain"]]), o("object-cover", [["object-fit", "cover"]]), o("object-fill", [["object-fit", "fill"]]), o("object-none", [["object-fit", "none"]]), o("object-scale-down", [["object-fit", "scale-down"]]), h("object", {
      themeKeys: ["--object-position"],
      handle: f => [d("object-position", f)],
      staticValues: {
        top: [d("object-position", "top")],
        "top-left": [d("object-position", "left top")],
        "top-right": [d("object-position", "right top")],
        bottom: [d("object-position", "bottom")],
        "bottom-left": [d("object-position", "left bottom")],
        "bottom-right": [d("object-position", "right bottom")],
        left: [d("object-position", "left")],
        right: [d("object-position", "right")],
        center: [d("object-position", "center")]
      }
    });
    for (let [f, N] of [["p", "padding"], ["px", "padding-inline"], ["py", "padding-block"], ["ps", "padding-inline-start"], ["pe", "padding-inline-end"], ["pbs", "padding-block-start"], ["pbe", "padding-block-end"], ["pt", "padding-top"], ["pr", "padding-right"], ["pb", "padding-bottom"], ["pl", "padding-left"]]) m(f, ["--padding", "--spacing"], C => [d(N, C)]);
    o("text-left", [["text-align", "left"]]), o("text-center", [["text-align", "center"]]), o("text-right", [["text-align", "right"]]), o("text-justify", [["text-align", "justify"]]), o("text-start", [["text-align", "start"]]), o("text-end", [["text-align", "end"]]), m("indent", ["--text-indent", "--spacing"], f => [d("text-indent", f)], {
      supportsNegative: !0
    }), o("align-baseline", [["vertical-align", "baseline"]]), o("align-top", [["vertical-align", "top"]]), o("align-middle", [["vertical-align", "middle"]]), o("align-bottom", [["vertical-align", "bottom"]]), o("align-text-top", [["vertical-align", "text-top"]]), o("align-text-bottom", [["vertical-align", "text-bottom"]]), o("align-sub", [["vertical-align", "sub"]]), o("align-super", [["vertical-align", "super"]]), h("align", {
      themeKeys: [],
      handle: f => [d("vertical-align", f)]
    }), a.functional("font", f => {
      if (!(!f.value || f.modifier)) {
        if (f.value.kind === "arbitrary") {
          let N = f.value.value;
          switch (f.value.dataType ?? pt(N, ["number", "generic-name", "family-name"])) {
            case "generic-name":
            case "family-name":
              return [d("font-family", N)];
            default:
              return [We([G("--tw-font-weight")]), d("--tw-font-weight", N), d("font-weight", N)];
          }
        }
        {
          let N = r.resolveWith(f.value.value, ["--font"], ["--font-feature-settings", "--font-variation-settings"]);
          if (N) {
            let [C, K = {}] = N;
            return [d("font-family", C), d("font-feature-settings", K["--font-feature-settings"]), d("font-variation-settings", K["--font-variation-settings"])];
          }
        }
        {
          let N = r.resolve(f.value.value, ["--font-weight"]);
          if (N) return [We([G("--tw-font-weight")]), d("--tw-font-weight", N), d("font-weight", N)];
        }
      }
    }), c("font", () => [{
      values: [],
      valueThemeKeys: ["--font"]
    }, {
      values: [],
      valueThemeKeys: ["--font-weight"]
    }]), h("font-features", {
      themeKeys: [],
      handle: f => [d("font-feature-settings", f)]
    }), o("uppercase", [["text-transform", "uppercase"]]), o("lowercase", [["text-transform", "lowercase"]]), o("capitalize", [["text-transform", "capitalize"]]), o("normal-case", [["text-transform", "none"]]), o("italic", [["font-style", "italic"]]), o("not-italic", [["font-style", "normal"]]), o("underline", [["text-decoration-line", "underline"]]), o("overline", [["text-decoration-line", "overline"]]), o("line-through", [["text-decoration-line", "line-through"]]), o("no-underline", [["text-decoration-line", "none"]]), o("font-stretch-normal", [["font-stretch", "normal"]]), o("font-stretch-ultra-condensed", [["font-stretch", "ultra-condensed"]]), o("font-stretch-extra-condensed", [["font-stretch", "extra-condensed"]]), o("font-stretch-condensed", [["font-stretch", "condensed"]]), o("font-stretch-semi-condensed", [["font-stretch", "semi-condensed"]]), o("font-stretch-semi-expanded", [["font-stretch", "semi-expanded"]]), o("font-stretch-expanded", [["font-stretch", "expanded"]]), o("font-stretch-extra-expanded", [["font-stretch", "extra-expanded"]]), o("font-stretch-ultra-expanded", [["font-stretch", "ultra-expanded"]]), h("font-stretch", {
      handleBareValue: ({
        value: f
      }) => {
        if (!f.endsWith("%")) return null;
        let N = Number(f.slice(0, -1));
        return !he(N) || Number.isNaN(N) || N < 50 || N > 200 ? null : f;
      },
      handle: f => [d("font-stretch", f)]
    }), c("font-stretch", () => [{
      values: ["50%", "75%", "90%", "95%", "100%", "105%", "110%", "125%", "150%", "200%"]
    }]), v("placeholder", {
      themeKeys: ["--placeholder-color", "--color"],
      handle: f => [ot("&::placeholder", [d("--tw-sort", "placeholder-color"), d("color", f)])]
    }), o("decoration-solid", [["text-decoration-style", "solid"]]), o("decoration-double", [["text-decoration-style", "double"]]), o("decoration-dotted", [["text-decoration-style", "dotted"]]), o("decoration-dashed", [["text-decoration-style", "dashed"]]), o("decoration-wavy", [["text-decoration-style", "wavy"]]), o("decoration-auto", [["text-decoration-thickness", "auto"]]), o("decoration-from-font", [["text-decoration-thickness", "from-font"]]), a.functional("decoration", f => {
      if (f.value) {
        if (f.value.kind === "arbitrary") {
          let N = f.value.value;
          switch (f.value.dataType ?? pt(N, ["color", "length", "percentage"])) {
            case "length":
            case "percentage":
              return f.modifier ? void 0 : [d("text-decoration-thickness", N)];
            default:
              return N = St(N, f.modifier, r), N === null ? void 0 : [d("text-decoration-color", N)];
          }
        }
        {
          let N = r.resolve(f.value.value, ["--text-decoration-thickness"]);
          if (N) return f.modifier ? void 0 : [d("text-decoration-thickness", N)];
          if (he(f.value.value)) return f.modifier ? void 0 : [d("text-decoration-thickness", `${f.value.value}px`)];
        }
        {
          let N = Vt(f, r, ["--text-decoration-color", "--color"]);
          if (N) return [d("text-decoration-color", N)];
        }
      }
    }), c("decoration", () => [{
      values: ["current", "inherit", "transparent"],
      valueThemeKeys: ["--text-decoration-color", "--color"],
      modifierThemeKeys: ["--opacity"],
      modifiers: Array.from({
        length: 21
      }, (f, N) => `${N * 5}`)
    }, {
      values: ["0", "1", "2"],
      valueThemeKeys: ["--text-decoration-thickness"]
    }]), h("animate", {
      themeKeys: ["--animate"],
      handle: f => [d("animation", f)],
      staticValues: {
        none: [d("animation", "none")]
      }
    });
    {
      let f = ["var(--tw-blur,)", "var(--tw-brightness,)", "var(--tw-contrast,)", "var(--tw-grayscale,)", "var(--tw-hue-rotate,)", "var(--tw-invert,)", "var(--tw-saturate,)", "var(--tw-sepia,)", "var(--tw-drop-shadow,)"].join(" "),
        N = ["var(--tw-backdrop-blur,)", "var(--tw-backdrop-brightness,)", "var(--tw-backdrop-contrast,)", "var(--tw-backdrop-grayscale,)", "var(--tw-backdrop-hue-rotate,)", "var(--tw-backdrop-invert,)", "var(--tw-backdrop-opacity,)", "var(--tw-backdrop-saturate,)", "var(--tw-backdrop-sepia,)"].join(" "),
        C = () => We([G("--tw-blur"), G("--tw-brightness"), G("--tw-contrast"), G("--tw-grayscale"), G("--tw-hue-rotate"), G("--tw-invert"), G("--tw-opacity"), G("--tw-saturate"), G("--tw-sepia"), G("--tw-drop-shadow"), G("--tw-drop-shadow-color"), G("--tw-drop-shadow-alpha", "100%", "<percentage>"), G("--tw-drop-shadow-size")]),
        K = () => We([G("--tw-backdrop-blur"), G("--tw-backdrop-brightness"), G("--tw-backdrop-contrast"), G("--tw-backdrop-grayscale"), G("--tw-backdrop-hue-rotate"), G("--tw-backdrop-invert"), G("--tw-backdrop-opacity"), G("--tw-backdrop-saturate"), G("--tw-backdrop-sepia")]);
      a.functional("filter", M => {
        if (!M.modifier) {
          if (M.value === null) return [C(), d("filter", f)];
          if (M.value.kind === "arbitrary") return [d("filter", M.value.value)];
          if (M.value.value === "none") return [d("filter", "none")];
        }
      }), a.functional("backdrop-filter", M => {
        if (!M.modifier) {
          if (M.value === null) return [K(), d("-webkit-backdrop-filter", N), d("backdrop-filter", N)];
          if (M.value.kind === "arbitrary") return [d("-webkit-backdrop-filter", M.value.value), d("backdrop-filter", M.value.value)];
          if (M.value.value === "none") return [d("-webkit-backdrop-filter", "none"), d("backdrop-filter", "none")];
        }
      }), h("blur", {
        themeKeys: ["--blur"],
        handle: M => [C(), d("--tw-blur", `blur(${M})`), d("filter", f)],
        staticValues: {
          none: [C(), d("--tw-blur", " "), d("filter", f)]
        }
      }), h("backdrop-blur", {
        themeKeys: ["--backdrop-blur", "--blur"],
        handle: M => [K(), d("--tw-backdrop-blur", `blur(${M})`), d("-webkit-backdrop-filter", N), d("backdrop-filter", N)],
        staticValues: {
          none: [K(), d("--tw-backdrop-blur", " "), d("-webkit-backdrop-filter", N), d("backdrop-filter", N)]
        }
      }), h("brightness", {
        themeKeys: ["--brightness"],
        handleBareValue: ({
          value: M
        }) => he(M) ? `${M}%` : null,
        handle: M => [C(), d("--tw-brightness", `brightness(${M})`), d("filter", f)]
      }), h("backdrop-brightness", {
        themeKeys: ["--backdrop-brightness", "--brightness"],
        handleBareValue: ({
          value: M
        }) => he(M) ? `${M}%` : null,
        handle: M => [K(), d("--tw-backdrop-brightness", `brightness(${M})`), d("-webkit-backdrop-filter", N), d("backdrop-filter", N)]
      }), c("brightness", () => [{
        values: ["0", "50", "75", "90", "95", "100", "105", "110", "125", "150", "200"],
        valueThemeKeys: ["--brightness"]
      }]), c("backdrop-brightness", () => [{
        values: ["0", "50", "75", "90", "95", "100", "105", "110", "125", "150", "200"],
        valueThemeKeys: ["--backdrop-brightness", "--brightness"]
      }]), h("contrast", {
        themeKeys: ["--contrast"],
        handleBareValue: ({
          value: M
        }) => he(M) ? `${M}%` : null,
        handle: M => [C(), d("--tw-contrast", `contrast(${M})`), d("filter", f)]
      }), h("backdrop-contrast", {
        themeKeys: ["--backdrop-contrast", "--contrast"],
        handleBareValue: ({
          value: M
        }) => he(M) ? `${M}%` : null,
        handle: M => [K(), d("--tw-backdrop-contrast", `contrast(${M})`), d("-webkit-backdrop-filter", N), d("backdrop-filter", N)]
      }), c("contrast", () => [{
        values: ["0", "50", "75", "100", "125", "150", "200"],
        valueThemeKeys: ["--contrast"]
      }]), c("backdrop-contrast", () => [{
        values: ["0", "50", "75", "100", "125", "150", "200"],
        valueThemeKeys: ["--backdrop-contrast", "--contrast"]
      }]), h("grayscale", {
        themeKeys: ["--grayscale"],
        handleBareValue: ({
          value: M
        }) => he(M) ? `${M}%` : null,
        defaultValue: "100%",
        handle: M => [C(), d("--tw-grayscale", `grayscale(${M})`), d("filter", f)]
      }), h("backdrop-grayscale", {
        themeKeys: ["--backdrop-grayscale", "--grayscale"],
        handleBareValue: ({
          value: M
        }) => he(M) ? `${M}%` : null,
        defaultValue: "100%",
        handle: M => [K(), d("--tw-backdrop-grayscale", `grayscale(${M})`), d("-webkit-backdrop-filter", N), d("backdrop-filter", N)]
      }), c("grayscale", () => [{
        values: ["0", "25", "50", "75", "100"],
        valueThemeKeys: ["--grayscale"],
        hasDefaultValue: !0
      }]), c("backdrop-grayscale", () => [{
        values: ["0", "25", "50", "75", "100"],
        valueThemeKeys: ["--backdrop-grayscale", "--grayscale"],
        hasDefaultValue: !0
      }]), h("hue-rotate", {
        supportsNegative: !0,
        themeKeys: ["--hue-rotate"],
        handleBareValue: ({
          value: M
        }) => he(M) ? `${M}deg` : null,
        handle: M => [C(), d("--tw-hue-rotate", `hue-rotate(${M})`), d("filter", f)]
      }), h("backdrop-hue-rotate", {
        supportsNegative: !0,
        themeKeys: ["--backdrop-hue-rotate", "--hue-rotate"],
        handleBareValue: ({
          value: M
        }) => he(M) ? `${M}deg` : null,
        handle: M => [K(), d("--tw-backdrop-hue-rotate", `hue-rotate(${M})`), d("-webkit-backdrop-filter", N), d("backdrop-filter", N)]
      }), c("hue-rotate", () => [{
        values: ["0", "15", "30", "60", "90", "180"],
        valueThemeKeys: ["--hue-rotate"]
      }]), c("backdrop-hue-rotate", () => [{
        values: ["0", "15", "30", "60", "90", "180"],
        valueThemeKeys: ["--backdrop-hue-rotate", "--hue-rotate"]
      }]), h("invert", {
        themeKeys: ["--invert"],
        handleBareValue: ({
          value: M
        }) => he(M) ? `${M}%` : null,
        defaultValue: "100%",
        handle: M => [C(), d("--tw-invert", `invert(${M})`), d("filter", f)]
      }), h("backdrop-invert", {
        themeKeys: ["--backdrop-invert", "--invert"],
        handleBareValue: ({
          value: M
        }) => he(M) ? `${M}%` : null,
        defaultValue: "100%",
        handle: M => [K(), d("--tw-backdrop-invert", `invert(${M})`), d("-webkit-backdrop-filter", N), d("backdrop-filter", N)]
      }), c("invert", () => [{
        values: ["0", "25", "50", "75", "100"],
        valueThemeKeys: ["--invert"],
        hasDefaultValue: !0
      }]), c("backdrop-invert", () => [{
        values: ["0", "25", "50", "75", "100"],
        valueThemeKeys: ["--backdrop-invert", "--invert"],
        hasDefaultValue: !0
      }]), h("saturate", {
        themeKeys: ["--saturate"],
        handleBareValue: ({
          value: M
        }) => he(M) ? `${M}%` : null,
        handle: M => [C(), d("--tw-saturate", `saturate(${M})`), d("filter", f)]
      }), h("backdrop-saturate", {
        themeKeys: ["--backdrop-saturate", "--saturate"],
        handleBareValue: ({
          value: M
        }) => he(M) ? `${M}%` : null,
        handle: M => [K(), d("--tw-backdrop-saturate", `saturate(${M})`), d("-webkit-backdrop-filter", N), d("backdrop-filter", N)]
      }), c("saturate", () => [{
        values: ["0", "50", "100", "150", "200"],
        valueThemeKeys: ["--saturate"]
      }]), c("backdrop-saturate", () => [{
        values: ["0", "50", "100", "150", "200"],
        valueThemeKeys: ["--backdrop-saturate", "--saturate"]
      }]), h("sepia", {
        themeKeys: ["--sepia"],
        handleBareValue: ({
          value: M
        }) => he(M) ? `${M}%` : null,
        defaultValue: "100%",
        handle: M => [C(), d("--tw-sepia", `sepia(${M})`), d("filter", f)]
      }), h("backdrop-sepia", {
        themeKeys: ["--backdrop-sepia", "--sepia"],
        handleBareValue: ({
          value: M
        }) => he(M) ? `${M}%` : null,
        defaultValue: "100%",
        handle: M => [K(), d("--tw-backdrop-sepia", `sepia(${M})`), d("-webkit-backdrop-filter", N), d("backdrop-filter", N)]
      }), c("sepia", () => [{
        values: ["0", "50", "100"],
        valueThemeKeys: ["--sepia"],
        hasDefaultValue: !0
      }]), c("backdrop-sepia", () => [{
        values: ["0", "50", "100"],
        valueThemeKeys: ["--backdrop-sepia", "--sepia"],
        hasDefaultValue: !0
      }]), o("drop-shadow-none", [C, ["--tw-drop-shadow", " "], ["filter", f]]), a.functional("drop-shadow", M => {
        let Y;
        if (M.modifier && (M.modifier.kind === "arbitrary" ? Y = M.modifier.value : Tr(M.modifier.value) && (Y = `${M.modifier.value}%`)), !M.value) {
          let xe = r.get(["--drop-shadow"]),
            Q = r.resolve(null, ["--drop-shadow"]);
          return xe === null || Q === null ? void 0 : [C(), d("--tw-drop-shadow-alpha", Y), ...Xo("--tw-drop-shadow-size", xe, Y, ce => `var(--tw-drop-shadow-color, ${ce})`), d("--tw-drop-shadow", ye(Q, ",").map(ce => `drop-shadow(${ce})`).join(" ")), d("filter", f)];
        }
        if (M.value.kind === "arbitrary") {
          let xe = M.value.value;
          return (M.value.dataType ?? pt(xe, ["color"])) === "color" ? (xe = St(xe, M.modifier, r), xe === null ? void 0 : [C(), d("--tw-drop-shadow-color", Dt(xe, "var(--tw-drop-shadow-alpha)")), d("--tw-drop-shadow", "var(--tw-drop-shadow-size)")]) : M.modifier && !Y ? void 0 : [C(), d("--tw-drop-shadow-alpha", Y), ...Xo("--tw-drop-shadow-size", xe, Y, Q => `var(--tw-drop-shadow-color, ${Q})`), d("--tw-drop-shadow", "var(--tw-drop-shadow-size)"), d("filter", f)];
        }
        {
          let xe = r.get([`--drop-shadow-${M.value.value}`]),
            Q = r.resolve(M.value.value, ["--drop-shadow"]);
          if (xe && Q) return M.modifier && !Y ? void 0 : Y ? [C(), d("--tw-drop-shadow-alpha", Y), ...Xo("--tw-drop-shadow-size", xe, Y, ce => `var(--tw-drop-shadow-color, ${ce})`), d("--tw-drop-shadow", "var(--tw-drop-shadow-size)"), d("filter", f)] : [C(), d("--tw-drop-shadow-alpha", Y), ...Xo("--tw-drop-shadow-size", xe, Y, ce => `var(--tw-drop-shadow-color, ${ce})`), d("--tw-drop-shadow", ye(Q, ",").map(ce => `drop-shadow(${ce})`).join(" ")), d("filter", f)];
        }
        {
          let xe = Vt(M, r, ["--drop-shadow-color", "--color"]);
          if (xe) return xe === "inherit" ? [C(), d("--tw-drop-shadow-color", "inherit"), d("--tw-drop-shadow", "var(--tw-drop-shadow-size)")] : [C(), d("--tw-drop-shadow-color", Dt(xe, "var(--tw-drop-shadow-alpha)")), d("--tw-drop-shadow", "var(--tw-drop-shadow-size)")];
        }
      }), c("drop-shadow", () => [{
        values: ["current", "inherit", "transparent"],
        valueThemeKeys: ["--drop-shadow-color", "--color"],
        modifierThemeKeys: ["--opacity"],
        modifiers: Array.from({
          length: 21
        }, (M, Y) => `${Y * 5}`)
      }, {
        valueThemeKeys: ["--drop-shadow"]
      }]), h("backdrop-opacity", {
        themeKeys: ["--backdrop-opacity", "--opacity"],
        handleBareValue: ({
          value: M
        }) => Tr(M) ? `${M}%` : null,
        handle: M => [K(), d("--tw-backdrop-opacity", `opacity(${M})`), d("-webkit-backdrop-filter", N), d("backdrop-filter", N)]
      }), c("backdrop-opacity", () => [{
        values: Array.from({
          length: 21
        }, (M, Y) => `${Y * 5}`),
        valueThemeKeys: ["--backdrop-opacity", "--opacity"]
      }]);
    }
    {
      let f = `var(--tw-ease, ${r.resolve(null, ["--default-transition-timing-function"]) ?? "ease"})`,
        N = `var(--tw-duration, ${r.resolve(null, ["--default-transition-duration"]) ?? "0s"})`;
      h("transition", {
        defaultValue: "color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, --tw-gradient-from, --tw-gradient-via, --tw-gradient-to, opacity, box-shadow, transform, translate, scale, rotate, filter, -webkit-backdrop-filter, backdrop-filter, display, content-visibility, overlay, pointer-events",
        themeKeys: ["--transition-property"],
        handle: C => [d("transition-property", C), d("transition-timing-function", f), d("transition-duration", N)],
        staticValues: {
          none: [d("transition-property", "none")],
          all: [d("transition-property", "all"), d("transition-timing-function", f), d("transition-duration", N)],
          colors: [d("transition-property", "color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, --tw-gradient-from, --tw-gradient-via, --tw-gradient-to"), d("transition-timing-function", f), d("transition-duration", N)],
          opacity: [d("transition-property", "opacity"), d("transition-timing-function", f), d("transition-duration", N)],
          shadow: [d("transition-property", "box-shadow"), d("transition-timing-function", f), d("transition-duration", N)],
          transform: [d("transition-property", "transform, translate, scale, rotate"), d("transition-timing-function", f), d("transition-duration", N)]
        }
      }), o("transition-discrete", [["transition-behavior", "allow-discrete"]]), o("transition-normal", [["transition-behavior", "normal"]]), h("delay", {
        handleBareValue: ({
          value: C
        }) => he(C) ? `${C}ms` : null,
        themeKeys: ["--transition-delay"],
        handle: C => [d("transition-delay", C)]
      });
      {
        let C = () => We([G("--tw-duration")]);
        o("duration-initial", [C, ["--tw-duration", "initial"]]), a.functional("duration", K => {
          if (K.modifier || !K.value) return;
          let M = null;
          if (K.value.kind === "arbitrary" ? M = K.value.value : (M = r.resolve(K.value.fraction ?? K.value.value, ["--transition-duration"]), M === null && he(K.value.value) && (M = `${K.value.value}ms`)), M !== null) return [C(), d("--tw-duration", M), d("transition-duration", M)];
        });
      }
      c("delay", () => [{
        values: ["75", "100", "150", "200", "300", "500", "700", "1000"],
        valueThemeKeys: ["--transition-delay"]
      }]), c("duration", () => [{
        values: ["75", "100", "150", "200", "300", "500", "700", "1000"],
        valueThemeKeys: ["--transition-duration"]
      }]);
    }
    {
      let f = () => We([G("--tw-ease")]);
      h("ease", {
        themeKeys: ["--ease"],
        handle: N => [f(), d("--tw-ease", N), d("transition-timing-function", N)],
        staticValues: {
          initial: [f(), d("--tw-ease", "initial")],
          linear: [f(), d("--tw-ease", "linear"), d("transition-timing-function", "linear")]
        }
      });
    }
    o("will-change-auto", [["will-change", "auto"]]), o("will-change-scroll", [["will-change", "scroll-position"]]), o("will-change-contents", [["will-change", "contents"]]), o("will-change-transform", [["will-change", "transform"]]), h("will-change", {
      themeKeys: [],
      handle: f => [d("will-change", f)]
    }), o("content-none", [["--tw-content", "none"], ["content", "none"]]), h("content", {
      themeKeys: ["--content"],
      handle: f => [We([G("--tw-content", '""')]), d("--tw-content", f), d("content", "var(--tw-content)")]
    });
    {
      let f = "var(--tw-contain-size,) var(--tw-contain-layout,) var(--tw-contain-paint,) var(--tw-contain-style,)",
        N = () => We([G("--tw-contain-size"), G("--tw-contain-layout"), G("--tw-contain-paint"), G("--tw-contain-style")]);
      o("contain-none", [["contain", "none"]]), o("contain-content", [["contain", "content"]]), o("contain-strict", [["contain", "strict"]]), o("contain-size", [N, ["--tw-contain-size", "size"], ["contain", f]]), o("contain-inline-size", [N, ["--tw-contain-size", "inline-size"], ["contain", f]]), o("contain-layout", [N, ["--tw-contain-layout", "layout"], ["contain", f]]), o("contain-paint", [N, ["--tw-contain-paint", "paint"], ["contain", f]]), o("contain-style", [N, ["--tw-contain-style", "style"], ["contain", f]]), h("contain", {
        themeKeys: [],
        handle: C => [d("contain", C)]
      });
    }
    o("forced-color-adjust-none", [["forced-color-adjust", "none"]]), o("forced-color-adjust-auto", [["forced-color-adjust", "auto"]]), m("leading", ["--leading", "--spacing"], f => [We([G("--tw-leading")]), d("--tw-leading", f), d("line-height", f)], {
      staticValues: {
        none: [We([G("--tw-leading")]), d("--tw-leading", "1"), d("line-height", "1")]
      }
    }), h("tracking", {
      supportsNegative: !0,
      themeKeys: ["--tracking"],
      handle: f => [We([G("--tw-tracking")]), d("--tw-tracking", f), d("letter-spacing", f)]
    }), o("antialiased", [["-webkit-font-smoothing", "antialiased"], ["-moz-osx-font-smoothing", "grayscale"]]), o("subpixel-antialiased", [["-webkit-font-smoothing", "auto"], ["-moz-osx-font-smoothing", "auto"]]);
    {
      let f = "var(--tw-ordinal,) var(--tw-slashed-zero,) var(--tw-numeric-figure,) var(--tw-numeric-spacing,) var(--tw-numeric-fraction,)",
        N = () => We([G("--tw-ordinal"), G("--tw-slashed-zero"), G("--tw-numeric-figure"), G("--tw-numeric-spacing"), G("--tw-numeric-fraction")]);
      o("normal-nums", [["font-variant-numeric", "normal"]]), o("ordinal", [N, ["--tw-ordinal", "ordinal"], ["font-variant-numeric", f]]), o("slashed-zero", [N, ["--tw-slashed-zero", "slashed-zero"], ["font-variant-numeric", f]]), o("lining-nums", [N, ["--tw-numeric-figure", "lining-nums"], ["font-variant-numeric", f]]), o("oldstyle-nums", [N, ["--tw-numeric-figure", "oldstyle-nums"], ["font-variant-numeric", f]]), o("proportional-nums", [N, ["--tw-numeric-spacing", "proportional-nums"], ["font-variant-numeric", f]]), o("tabular-nums", [N, ["--tw-numeric-spacing", "tabular-nums"], ["font-variant-numeric", f]]), o("diagonal-fractions", [N, ["--tw-numeric-fraction", "diagonal-fractions"], ["font-variant-numeric", f]]), o("stacked-fractions", [N, ["--tw-numeric-fraction", "stacked-fractions"], ["font-variant-numeric", f]]);
    }
    {
      let f = () => We([G("--tw-outline-style", "solid")]);
      a.static("outline-hidden", () => [d("--tw-outline-style", "none"), d("outline-style", "none"), tt("@media", "(forced-colors: active)", [d("outline", "2px solid transparent"), d("outline-offset", "2px")])]), o("outline-none", [["--tw-outline-style", "none"], ["outline-style", "none"]]), o("outline-solid", [["--tw-outline-style", "solid"], ["outline-style", "solid"]]), o("outline-dashed", [["--tw-outline-style", "dashed"], ["outline-style", "dashed"]]), o("outline-dotted", [["--tw-outline-style", "dotted"], ["outline-style", "dotted"]]), o("outline-double", [["--tw-outline-style", "double"], ["outline-style", "double"]]), a.functional("outline", N => {
        if (N.value === null) {
          if (N.modifier) return;
          let C = r.get(["--default-outline-width"]) ?? "1px";
          return [f(), d("outline-style", "var(--tw-outline-style)"), d("outline-width", C)];
        }
        if (N.value.kind === "arbitrary") {
          let C = N.value.value;
          switch (N.value.dataType ?? pt(C, ["color", "length", "number", "percentage"])) {
            case "length":
            case "number":
            case "percentage":
              return N.modifier ? void 0 : [f(), d("outline-style", "var(--tw-outline-style)"), d("outline-width", C)];
            default:
              return C = St(C, N.modifier, r), C === null ? void 0 : [d("outline-color", C)];
          }
        }
        {
          let C = Vt(N, r, ["--outline-color", "--color"]);
          if (C) return [d("outline-color", C)];
        }
        {
          if (N.modifier) return;
          let C = r.resolve(N.value.value, ["--outline-width"]);
          if (C) return [f(), d("outline-style", "var(--tw-outline-style)"), d("outline-width", C)];
          if (he(N.value.value)) return [f(), d("outline-style", "var(--tw-outline-style)"), d("outline-width", `${N.value.value}px`)];
        }
      }), c("outline", () => [{
        values: ["current", "inherit", "transparent"],
        valueThemeKeys: ["--outline-color", "--color"],
        modifierThemeKeys: ["--opacity"],
        modifiers: Array.from({
          length: 21
        }, (N, C) => `${C * 5}`),
        hasDefaultValue: !0
      }, {
        values: ["0", "1", "2", "4", "8"],
        valueThemeKeys: ["--outline-width"]
      }]), h("outline-offset", {
        supportsNegative: !0,
        themeKeys: ["--outline-offset"],
        handleBareValue: ({
          value: N
        }) => he(N) ? `${N}px` : null,
        handle: N => [d("outline-offset", N)]
      }), c("outline-offset", () => [{
        supportsNegative: !0,
        values: ["0", "1", "2", "4", "8"],
        valueThemeKeys: ["--outline-offset"]
      }]);
    }
    h("opacity", {
      themeKeys: ["--opacity"],
      handleBareValue: ({
        value: f
      }) => Tr(f) ? `${f}%` : null,
      handle: f => [d("opacity", f)]
    }), c("opacity", () => [{
      values: Array.from({
        length: 21
      }, (f, N) => `${N * 5}`),
      valueThemeKeys: ["--opacity"]
    }]), h("underline-offset", {
      supportsNegative: !0,
      themeKeys: ["--text-underline-offset"],
      handleBareValue: ({
        value: f
      }) => he(f) ? `${f}px` : null,
      handle: f => [d("text-underline-offset", f)],
      staticValues: {
        auto: [d("text-underline-offset", "auto")]
      }
    }), c("underline-offset", () => [{
      supportsNegative: !0,
      values: ["0", "1", "2", "4", "8"],
      valueThemeKeys: ["--text-underline-offset"]
    }]), a.functional("text", f => {
      if (f.value) {
        if (f.value.kind === "arbitrary") {
          let N = f.value.value;
          switch (f.value.dataType ?? pt(N, ["color", "length", "percentage", "absolute-size", "relative-size"])) {
            case "size":
            case "length":
            case "percentage":
            case "absolute-size":
            case "relative-size":
              {
                if (f.modifier) {
                  let C = f.modifier.kind === "arbitrary" ? f.modifier.value : r.resolve(f.modifier.value, ["--leading"]);
                  if (!C && dn(f.modifier.value)) {
                    if (!r.resolve(null, ["--spacing"])) return null;
                    C = `--spacing(${f.modifier.value})`;
                  }
                  return !C && f.modifier.value === "none" && (C = "1"), C ? [d("font-size", N), d("line-height", C)] : null;
                }
                return [d("font-size", N)];
              }
            default:
              return N = St(N, f.modifier, r), N === null ? void 0 : [d("color", N)];
          }
        }
        {
          let N = Vt(f, r, ["--text-color", "--color"]);
          if (N) return [d("color", N)];
        }
        {
          let N = r.resolveWith(f.value.value, ["--text"], ["--line-height", "--letter-spacing", "--font-weight"]);
          if (N) {
            let [C, K = {}] = Array.isArray(N) ? N : [N];
            if (f.modifier) {
              let M = f.modifier.kind === "arbitrary" ? f.modifier.value : r.resolve(f.modifier.value, ["--leading"]);
              if (!M && dn(f.modifier.value)) {
                if (!r.resolve(null, ["--spacing"])) return null;
                M = `--spacing(${f.modifier.value})`;
              }
              if (!M && f.modifier.value === "none" && (M = "1"), !M) return null;
              let Y = [d("font-size", C)];
              return M && Y.push(d("line-height", M)), Y;
            }
            return typeof K == "string" ? [d("font-size", C), d("line-height", K)] : [d("font-size", C), d("line-height", K["--line-height"] ? `var(--tw-leading, ${K["--line-height"]})` : void 0), d("letter-spacing", K["--letter-spacing"] ? `var(--tw-tracking, ${K["--letter-spacing"]})` : void 0), d("font-weight", K["--font-weight"] ? `var(--tw-font-weight, ${K["--font-weight"]})` : void 0)];
          }
        }
      }
    }), c("text", () => [{
      values: ["current", "inherit", "transparent"],
      valueThemeKeys: ["--text-color", "--color"],
      modifierThemeKeys: ["--opacity"],
      modifiers: Array.from({
        length: 21
      }, (f, N) => `${N * 5}`)
    }, {
      values: [],
      valueThemeKeys: ["--text"],
      modifiers: [],
      modifierThemeKeys: ["--leading"]
    }]);
    let Fe = () => We([G("--tw-text-shadow-color"), G("--tw-text-shadow-alpha", "100%", "<percentage>")]);
    o("text-shadow-initial", [Fe, ["--tw-text-shadow-color", "initial"]]), a.functional("text-shadow", f => {
      let N;
      if (f.modifier && (f.modifier.kind === "arbitrary" ? N = f.modifier.value : Tr(f.modifier.value) && (N = `${f.modifier.value}%`)), !f.value) {
        let C = r.get(["--text-shadow"]);
        return C === null ? void 0 : [Fe(), d("--tw-text-shadow-alpha", N), ...Ln("text-shadow", C, N, K => `var(--tw-text-shadow-color, ${K})`)];
      }
      if (f.value.kind === "arbitrary") {
        let C = f.value.value;
        return (f.value.dataType ?? pt(C, ["color"])) === "color" ? (C = St(C, f.modifier, r), C === null ? void 0 : [Fe(), d("--tw-text-shadow-color", Dt(C, "var(--tw-text-shadow-alpha)"))]) : [Fe(), d("--tw-text-shadow-alpha", N), ...Ln("text-shadow", C, N, K => `var(--tw-text-shadow-color, ${K})`)];
      }
      switch (f.value.value) {
        case "none":
          return f.modifier ? void 0 : [Fe(), d("text-shadow", "none")];
        case "inherit":
          return f.modifier ? void 0 : [Fe(), d("--tw-text-shadow-color", "inherit")];
      }
      {
        let C = r.get([`--text-shadow-${f.value.value}`]);
        if (C) return [Fe(), d("--tw-text-shadow-alpha", N), ...Ln("text-shadow", C, N, K => `var(--tw-text-shadow-color, ${K})`)];
      }
      {
        let C = Vt(f, r, ["--text-shadow-color", "--color"]);
        if (C) return [Fe(), d("--tw-text-shadow-color", Dt(C, "var(--tw-text-shadow-alpha)"))];
      }
    }), c("text-shadow", () => [{
      values: ["current", "inherit", "transparent"],
      valueThemeKeys: ["--text-shadow-color", "--color"],
      modifierThemeKeys: ["--opacity"],
      modifiers: Array.from({
        length: 21
      }, (f, N) => `${N * 5}`)
    }, {
      values: ["none"]
    }, {
      valueThemeKeys: ["--text-shadow"],
      modifiers: Array.from({
        length: 21
      }, (f, N) => `${N * 5}`),
      hasDefaultValue: r.get(["--text-shadow"]) !== null
    }]);
    {
      let f = function (Q) {
          return `var(--tw-ring-inset,) 0 0 0 calc(${Q} + var(--tw-ring-offset-width)) var(--tw-ring-color, ${Y})`;
        },
        N = function (Q) {
          return `inset 0 0 0 ${Q} var(--tw-inset-ring-color, currentcolor)`;
        };
      var At = f,
        Gt = N;
      let C = ["var(--tw-inset-shadow)", "var(--tw-inset-ring-shadow)", "var(--tw-ring-offset-shadow)", "var(--tw-ring-shadow)", "var(--tw-shadow)"].join(", "),
        K = "0 0 #0000",
        M = () => We([G("--tw-shadow", K), G("--tw-shadow-color"), G("--tw-shadow-alpha", "100%", "<percentage>"), G("--tw-inset-shadow", K), G("--tw-inset-shadow-color"), G("--tw-inset-shadow-alpha", "100%", "<percentage>"), G("--tw-ring-color"), G("--tw-ring-shadow", K), G("--tw-inset-ring-color"), G("--tw-inset-ring-shadow", K), G("--tw-ring-inset"), G("--tw-ring-offset-width", "0px", "<length>"), G("--tw-ring-offset-color", "#fff"), G("--tw-ring-offset-shadow", K)]);
      o("shadow-initial", [M, ["--tw-shadow-color", "initial"]]), a.functional("shadow", Q => {
        let ce;
        if (Q.modifier && (Q.modifier.kind === "arbitrary" ? ce = Q.modifier.value : Tr(Q.modifier.value) && (ce = `${Q.modifier.value}%`)), !Q.value) {
          let He = r.get(["--shadow"]);
          return He === null ? void 0 : [M(), d("--tw-shadow-alpha", ce), ...Ln("--tw-shadow", He, ce, _n => `var(--tw-shadow-color, ${_n})`), d("box-shadow", C)];
        }
        if (Q.value.kind === "arbitrary") {
          let He = Q.value.value;
          return (Q.value.dataType ?? pt(He, ["color"])) === "color" ? (He = St(He, Q.modifier, r), He === null ? void 0 : [M(), d("--tw-shadow-color", Dt(He, "var(--tw-shadow-alpha)"))]) : [M(), d("--tw-shadow-alpha", ce), ...Ln("--tw-shadow", He, ce, _n => `var(--tw-shadow-color, ${_n})`), d("box-shadow", C)];
        }
        switch (Q.value.value) {
          case "none":
            return Q.modifier ? void 0 : [M(), d("--tw-shadow", K), d("box-shadow", C)];
          case "inherit":
            return Q.modifier ? void 0 : [M(), d("--tw-shadow-color", "inherit")];
        }
        {
          let He = r.get([`--shadow-${Q.value.value}`]);
          if (He) return [M(), d("--tw-shadow-alpha", ce), ...Ln("--tw-shadow", He, ce, _n => `var(--tw-shadow-color, ${_n})`), d("box-shadow", C)];
        }
        {
          let He = Vt(Q, r, ["--box-shadow-color", "--color"]);
          if (He) return [M(), d("--tw-shadow-color", Dt(He, "var(--tw-shadow-alpha)"))];
        }
      }), c("shadow", () => [{
        values: ["current", "inherit", "transparent"],
        valueThemeKeys: ["--box-shadow-color", "--color"],
        modifierThemeKeys: ["--opacity"],
        modifiers: Array.from({
          length: 21
        }, (Q, ce) => `${ce * 5}`)
      }, {
        values: ["none"]
      }, {
        valueThemeKeys: ["--shadow"],
        modifiers: Array.from({
          length: 21
        }, (Q, ce) => `${ce * 5}`),
        hasDefaultValue: r.get(["--shadow"]) !== null
      }]), o("inset-shadow-initial", [M, ["--tw-inset-shadow-color", "initial"]]), a.functional("inset-shadow", Q => {
        let ce;
        if (Q.modifier && (Q.modifier.kind === "arbitrary" ? ce = Q.modifier.value : Tr(Q.modifier.value) && (ce = `${Q.modifier.value}%`)), !Q.value) {
          let He = r.get(["--inset-shadow"]);
          return He === null ? void 0 : [M(), d("--tw-inset-shadow-alpha", ce), ...Ln("--tw-inset-shadow", He, ce, _n => `var(--tw-inset-shadow-color, ${_n})`), d("box-shadow", C)];
        }
        if (Q.value.kind === "arbitrary") {
          let He = Q.value.value;
          return (Q.value.dataType ?? pt(He, ["color"])) === "color" ? (He = St(He, Q.modifier, r), He === null ? void 0 : [M(), d("--tw-inset-shadow-color", Dt(He, "var(--tw-inset-shadow-alpha)"))]) : [M(), d("--tw-inset-shadow-alpha", ce), ...Ln("--tw-inset-shadow", He, ce, _n => `var(--tw-inset-shadow-color, ${_n})`, "inset"), d("box-shadow", C)];
        }
        switch (Q.value.value) {
          case "none":
            return Q.modifier ? void 0 : [M(), d("--tw-inset-shadow", `inset ${K}`), d("box-shadow", C)];
          case "inherit":
            return Q.modifier ? void 0 : [M(), d("--tw-inset-shadow-color", "inherit")];
        }
        {
          let He = r.get([`--inset-shadow-${Q.value.value}`]);
          if (He) return [M(), d("--tw-inset-shadow-alpha", ce), ...Ln("--tw-inset-shadow", He, ce, _n => `var(--tw-inset-shadow-color, ${_n})`), d("box-shadow", C)];
        }
        {
          let He = Vt(Q, r, ["--box-shadow-color", "--color"]);
          if (He) return [M(), d("--tw-inset-shadow-color", Dt(He, "var(--tw-inset-shadow-alpha)"))];
        }
      }), c("inset-shadow", () => [{
        values: ["current", "inherit", "transparent"],
        valueThemeKeys: ["--box-shadow-color", "--color"],
        modifierThemeKeys: ["--opacity"],
        modifiers: Array.from({
          length: 21
        }, (Q, ce) => `${ce * 5}`)
      }, {
        values: ["none"]
      }, {
        valueThemeKeys: ["--inset-shadow"],
        modifiers: Array.from({
          length: 21
        }, (Q, ce) => `${ce * 5}`),
        hasDefaultValue: r.get(["--inset-shadow"]) !== null
      }]), o("ring-inset", [M, ["--tw-ring-inset", "inset"]]);
      let Y = r.get(["--default-ring-color"]) ?? "currentcolor";
      a.functional("ring", Q => {
        if (!Q.value) {
          if (Q.modifier) return;
          let ce = r.get(["--default-ring-width"]) ?? "1px";
          return [M(), d("--tw-ring-shadow", f(ce)), d("box-shadow", C)];
        }
        if (Q.value.kind === "arbitrary") {
          let ce = Q.value.value;
          return (Q.value.dataType ?? pt(ce, ["color", "length"])) === "length" ? Q.modifier ? void 0 : [M(), d("--tw-ring-shadow", f(ce)), d("box-shadow", C)] : (ce = St(ce, Q.modifier, r), ce === null ? void 0 : [d("--tw-ring-color", ce)]);
        }
        {
          let ce = Vt(Q, r, ["--ring-color", "--color"]);
          if (ce) return [d("--tw-ring-color", ce)];
        }
        {
          if (Q.modifier) return;
          let ce = r.resolve(Q.value.value, ["--ring-width"]);
          if (ce === null && he(Q.value.value) && (ce = `${Q.value.value}px`), ce) return [M(), d("--tw-ring-shadow", f(ce)), d("box-shadow", C)];
        }
      }), c("ring", () => [{
        values: ["current", "inherit", "transparent"],
        valueThemeKeys: ["--ring-color", "--color"],
        modifierThemeKeys: ["--opacity"],
        modifiers: Array.from({
          length: 21
        }, (Q, ce) => `${ce * 5}`)
      }, {
        values: ["0", "1", "2", "4", "8"],
        valueThemeKeys: ["--ring-width"],
        hasDefaultValue: !0
      }]), a.functional("inset-ring", Q => {
        if (!Q.value) return Q.modifier ? void 0 : [M(), d("--tw-inset-ring-shadow", N("1px")), d("box-shadow", C)];
        if (Q.value.kind === "arbitrary") {
          let ce = Q.value.value;
          return (Q.value.dataType ?? pt(ce, ["color", "length"])) === "length" ? Q.modifier ? void 0 : [M(), d("--tw-inset-ring-shadow", N(ce)), d("box-shadow", C)] : (ce = St(ce, Q.modifier, r), ce === null ? void 0 : [d("--tw-inset-ring-color", ce)]);
        }
        {
          let ce = Vt(Q, r, ["--ring-color", "--color"]);
          if (ce) return [d("--tw-inset-ring-color", ce)];
        }
        {
          if (Q.modifier) return;
          let ce = r.resolve(Q.value.value, ["--ring-width"]);
          if (ce === null && he(Q.value.value) && (ce = `${Q.value.value}px`), ce) return [M(), d("--tw-inset-ring-shadow", N(ce)), d("box-shadow", C)];
        }
      }), c("inset-ring", () => [{
        values: ["current", "inherit", "transparent"],
        valueThemeKeys: ["--ring-color", "--color"],
        modifierThemeKeys: ["--opacity"],
        modifiers: Array.from({
          length: 21
        }, (Q, ce) => `${ce * 5}`)
      }, {
        values: ["0", "1", "2", "4", "8"],
        valueThemeKeys: ["--ring-width"],
        hasDefaultValue: !0
      }]);
      let xe = "var(--tw-ring-inset,) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)";
      a.functional("ring-offset", Q => {
        if (Q.value) {
          if (Q.value.kind === "arbitrary") {
            let ce = Q.value.value;
            return (Q.value.dataType ?? pt(ce, ["color", "length"])) === "length" ? Q.modifier ? void 0 : [d("--tw-ring-offset-width", ce), d("--tw-ring-offset-shadow", xe)] : (ce = St(ce, Q.modifier, r), ce === null ? void 0 : [d("--tw-ring-offset-color", ce)]);
          }
          {
            let ce = r.resolve(Q.value.value, ["--ring-offset-width"]);
            if (ce) return Q.modifier ? void 0 : [d("--tw-ring-offset-width", ce), d("--tw-ring-offset-shadow", xe)];
            if (he(Q.value.value)) return Q.modifier ? void 0 : [d("--tw-ring-offset-width", `${Q.value.value}px`), d("--tw-ring-offset-shadow", xe)];
          }
          {
            let ce = Vt(Q, r, ["--ring-offset-color", "--color"]);
            if (ce) return [d("--tw-ring-offset-color", ce)];
          }
        }
      });
    }
    return c("ring-offset", () => [{
      values: ["current", "inherit", "transparent"],
      valueThemeKeys: ["--ring-offset-color", "--color"],
      modifierThemeKeys: ["--opacity"],
      modifiers: Array.from({
        length: 21
      }, (f, N) => `${N * 5}`)
    }, {
      values: ["0", "1", "2", "4", "8"],
      valueThemeKeys: ["--ring-offset-width"]
    }]), a.functional("@container", f => {
      let N = null;
      if (f.value === null ? N = "inline-size" : f.value.kind === "arbitrary" ? N = f.value.value : f.value.kind === "named" && f.value.value === "normal" ? N = "normal" : f.value.kind === "named" && f.value.value === "size" && (N = "size"), N !== null) return f.modifier ? [d("container-type", N), d("container-name", f.modifier.value)] : [d("container-type", N)];
    }), c("@container", () => [{
      values: ["normal"],
      valueThemeKeys: [],
      hasDefaultValue: !0
    }]), a;
  }
  var Ma = ["number", "integer", "ratio", "percentage"];
  function u0(r) {
    let a = de(r.params);
    return k0(a) ? c => {
      let o = {
        "--value": {
          usedSpacingInteger: !1,
          usedSpacingNumber: !1,
          themeKeys: new Set(),
          literals: new Set()
        },
        "--modifier": {
          usedSpacingInteger: !1,
          usedSpacingNumber: !1,
          themeKeys: new Set(),
          literals: new Set()
        }
      };
      De(r.nodes, h => {
        if (h.kind !== "declaration" || !h.value || !h.value.includes("--value(") && !h.value.includes("--modifier(")) return;
        let v = ct(h.value);
        De(v, m => {
          if (m.kind !== "function") return;
          if (m.value === "--spacing" && !(o["--modifier"].usedSpacingNumber && o["--value"].usedSpacingNumber)) return De(m.nodes, S => {
            if (S.kind !== "function" || S.value !== "--value" && S.value !== "--modifier") return;
            let y = S.value;
            for (let k of S.nodes) if (k.kind === "word") {
              if (k.value === "integer") o[y].usedSpacingInteger ||= !0;else if (k.value === "number" && (o[y].usedSpacingNumber ||= !0, o["--modifier"].usedSpacingNumber && o["--value"].usedSpacingNumber)) return Ee.Stop;
            }
          }), Ee.Continue;
          if (m.value !== "--value" && m.value !== "--modifier") return;
          let O = ye(je(m.nodes), ",");
          for (let [S, y] of O.entries()) y = y.replace(/\\\*/g, "*"), y = y.replace(/--(.*?)\s--(.*?)/g, "--$1-*--$2"), y = y.replace(/\s+/g, ""), y = y.replace(/(-\*){2,}/g, "-*"), y[0] === "-" && y[1] === "-" && !y.includes("(") && !y.includes("-*") && (y += "-*"), O[S] = y;
          m.nodes = ct(O.join(","));
          for (let S of m.nodes) if (S.kind === "word" && (S.value[0] === '"' || S.value[0] === "'") && S.value[0] === S.value[S.value.length - 1]) {
            let y = S.value.slice(1, -1);
            o[m.value].literals.add(y);
          } else if (S.kind === "word" && S.value[0] === "-" && S.value[1] === "-") {
            let y = S.value.replace(/-\*.*$/g, "");
            o[m.value].themeKeys.add(y);
          } else if (S.kind === "word" && !(S.value[0] === "[" && S.value[S.value.length - 1] === "]") && !Ma.includes(S.value)) {
            console.warn(`Unsupported bare value data type: "${S.value}".
Only valid data types are: ${Ma.map(R => `"${R}"`).join(", ")}.
`);
            let y = S.value,
              k = structuredClone(m),
              b = "\xB6";
            De(k.nodes, R => {
              if (R.kind === "word" && R.value === y) return Ee.ReplaceSkip({
                kind: "word",
                value: b
              });
            });
            let E = "^".repeat(je([S]).length),
              A = je([k]).indexOf(b),
              T = ["```css", je([m]), " ".repeat(A) + E, "```"].join(`
`);
            console.warn(T);
          }
        }), h.value = je(v);
      }), c.utilities.functional(a.slice(0, -2), h => {
        let v = fn(r),
          m = h.value,
          O = h.modifier,
          S = !1,
          y = !1,
          k = !1,
          b = !1,
          E = new Map(),
          A = !1;
        if (De([v], (T, R) => {
          let H = R.parent;
          if (H?.kind !== "rule" && H?.kind !== "at-rule" || T.kind !== "declaration" || !T.value) return;
          let ne = !1,
            B = ct(T.value);
          if (De(B, U => {
            if (U.kind === "function") {
              if (U.value === "--value") {
                S = !0;
                let Oe = bu(m, U, c);
                return Oe ? (y = !0, Oe.ratio ? A = !0 : E.set(T, H), Ee.ReplaceSkip(Oe.nodes)) : (ne = !0, Ee.Stop);
              } else if (U.value === "--modifier") {
                k = !0;
                let Oe = bu(O, U, c);
                return Oe ? (b = !0, Ee.ReplaceSkip(Oe.nodes)) : (ne = !0, Ee.Stop);
              }
            }
          }), ne) return Ee.ReplaceSkip([]);
          T.value = je(B);
        }), !S || !y || k && !b && O !== null || A && b || O && !A && !b) return null;
        if (A) for (let [T, R] of E) {
          let H = R.nodes.indexOf(T);
          H !== -1 && R.nodes.splice(H, 1);
        }
        return v.nodes;
      }), c.utilities.suggest(a.slice(0, -2), () => {
        let h = [],
          v = [];
        for (let [m, {
          literals: O,
          usedSpacingNumber: S,
          usedSpacingInteger: y,
          themeKeys: k
        }] of [[h, o["--value"]], [v, o["--modifier"]]]) {
          for (let b of O) m.push(b);
          if (S) m.push(...Wo);else if (y) for (let b of Wo) he(b) && m.push(b);
          for (let b of c.theme.keysInNamespaces(k)) m.push(b.replace(vu, (E, A, T) => `${A}.${T}`));
        }
        return [{
          values: h,
          modifiers: v
        }];
      });
    } : w0(a) ? c => {
      c.utilities.static(a, () => r.nodes.map(fn));
    } : null;
  }
  function bu(r, a, c) {
    if (r === null) {
      for (let o of a.nodes) if (o.kind === "function" && o.value === "--default") return {
        nodes: o.nodes
      };
      return;
    }
    for (let o of a.nodes) {
      if (r.kind === "named" && o.kind === "word" && (o.value[0] === "'" || o.value[0] === '"') && o.value[o.value.length - 1] === o.value[0] && o.value.slice(1, -1) === r.value) return {
        nodes: ct(r.value)
      };
      if (r.kind === "named" && o.kind === "word" && o.value[0] === "-" && o.value[1] === "-") {
        let h = o.value;
        if (h.endsWith("-*")) {
          h = h.slice(0, -2);
          let v = c.theme.resolve(r.value, [h]);
          if (v) return {
            nodes: ct(v)
          };
        } else {
          let v = h.split("-*");
          if (v.length <= 1) continue;
          let m = [v.shift()],
            O = c.theme.resolveWith(r.value, m, v);
          if (O) {
            let [, S = {}] = O;
            {
              let y = S[v.pop()];
              if (y) return {
                nodes: ct(y)
              };
            }
          }
        }
      } else if (r.kind === "named" && o.kind === "word") {
        if (!Ma.includes(o.value)) continue;
        let h = o.value === "ratio" && "fraction" in r ? r.fraction : r.value;
        if (!h) continue;
        let v = pt(h, [o.value]);
        if (v === null) continue;
        if (v === "ratio") {
          let [m, O] = ye(h, "/").map(Number);
          if (!he(m) || !he(O)) continue;
        } else if (v === "number" && !dn(h) || v === "percentage" && !he(h.slice(0, -1))) continue;
        if (v === "ratio") {
          let [m, O] = ye(h, "/");
          return {
            nodes: ct(`${m.trim()} / ${O.trim()}`),
            ratio: !0
          };
        }
        return {
          nodes: ct(h),
          ratio: !1
        };
      } else if (r.kind === "arbitrary" && o.kind === "word" && o.value[0] === "[" && o.value[o.value.length - 1] === "]") {
        let h = o.value.slice(1, -1);
        if (h === "*") return {
          nodes: ct(r.value)
        };
        if ("dataType" in r && r.dataType && r.dataType !== h) continue;
        if ("dataType" in r && r.dataType) return {
          nodes: ct(r.value)
        };
        if (pt(r.value, [h]) !== null) return {
          nodes: ct(r.value)
        };
      }
    }
  }
  function Ln(r, a, c, o, h = "") {
    let v = !1,
      m = Ko(a, S => c == null ? o(S) : S.startsWith("current") ? o(Dt(S, c)) : ((S.startsWith("var(") || c.startsWith("var(")) && (v = !0), o(gu(S, c))));
    function O(S) {
      return h ? ye(S, ",").map(y => h.trim() + " " + y.trim()).join(", ") : S;
    }
    return v ? [d(r, O(Ko(a, o))), xt("@supports (color: lab(from red l a b))", [d(r, O(m))])] : [d(r, O(m))];
  }
  function Xo(r, a, c, o, h = "") {
    let v = !1,
      m = ye(a, ",").map(O => Ko(O, S => c == null ? o(S) : S.startsWith("current") ? o(Dt(S, c)) : ((S.startsWith("var(") || c.startsWith("var(")) && (v = !0), o(gu(S, c))))).map(O => `drop-shadow(${O})`).join(" ");
    return v ? [d(r, h + ye(a, ",").map(O => `drop-shadow(${Ko(O, o)})`).join(" ")), xt("@supports (color: lab(from red l a b))", [d(r, h + m)])] : [d(r, h + m)];
  }
  var yu = /^-?[a-z][a-zA-Z0-9_-]*/,
    f0 = 37,
    d0 = 47,
    p0 = 46,
    h0 = 97,
    m0 = 122,
    g0 = 65,
    v0 = 90,
    qo = 48,
    Go = 57,
    b0 = 95,
    y0 = 45;
  function w0(r) {
    let a = yu.exec(r);
    if (a === null) return !1;
    let c = a[0],
      o = r.slice(c.length);
    if (o.length === 0 && c.endsWith("-")) return !1;
    if (o.length === 0) return !0;
    let h = !1;
    for (let v = 0; v < o.length; v++) {
      let m = o.charCodeAt(v);
      switch (m) {
        case f0:
          {
            if (v !== o.length - 1) return !1;
            let O = (o[v - 1] || c[c.length - 1] || "").charCodeAt(0);
            if (O < qo || O > Go) return !1;
            break;
          }
        case d0:
          {
            if (v === o.length - 1 || h) return !1;
            h = !0;
            break;
          }
        case p0:
          {
            let O = (o[v - 1] || c[c.length - 1] || "").charCodeAt(0);
            if (O < qo || O > Go) return !1;
            let S = (o[v + 1] || "").charCodeAt(0);
            if (S < qo || S > Go) return !1;
            break;
          }
        case b0:
        case y0:
          continue;
        default:
          {
            if (m >= h0 && m <= m0 || m >= g0 && m <= v0 || m >= qo && m <= Go) continue;
            return !1;
          }
      }
    }
    return !0;
  }
  function k0(r) {
    if (!r.endsWith("-*")) return !1;
    r = r.slice(0, -2);
    let a = yu.exec(r);
    if (a === null) return !1;
    let c = a[0];
    return r.slice(c.length).length === 0;
  }
  var Pa = {
    "--alpha": E0,
    "--spacing": _0,
    "--theme": N0,
    theme: x0
  };
  function E0(r, a, c, ...o) {
    let [h, v] = ye(c, "/").map(m => m.trim());
    if (!h || !v) throw new Error(`The --alpha(\u2026) function requires a color and an alpha value, e.g.: \`--alpha(${h || "var(--my-color)"} / ${v || "50%"})\``);
    if (o.length > 0) throw new Error(`The --alpha(\u2026) function only accepts one argument, e.g.: \`--alpha(${h || "var(--my-color)"} / ${v || "50%"})\``);
    return Dt(h, v);
  }
  function _0(r, a, c, ...o) {
    if (!c) throw new Error("The --spacing(\u2026) function requires an argument, but received none.");
    if (o.length > 0) throw new Error(`The --spacing(\u2026) function only accepts a single argument, but received ${o.length + 1}.`);
    let h = r.theme.resolve(null, ["--spacing"]);
    if (!h) throw new Error("The --spacing(\u2026) function requires that the `--spacing` theme variable exists, but it was not found.");
    let v = Ia.get(c);
    if (v) {
      if (v[0] === 0) return "0px";
      if (v[0] === 1) return h;
    }
    return `calc(${h} * ${c})`;
  }
  function N0(r, a, c, ...o) {
    if (!c.startsWith("--")) throw new Error("The --theme(\u2026) function can only be used with CSS variables from your theme.");
    let h = !1;
    c.endsWith(" inline") && (h = !0, c = c.slice(0, -7)), a.kind === "at-rule" && (h = !0);
    let v = r.resolveThemeValue(c, h);
    if (!v) {
      if (o.length > 0) return o.join(", ");
      throw new Error(`Could not resolve value for theme function: \`theme(${c})\`. Consider checking if the variable name is correct or provide a fallback value to silence this error.`);
    }
    if (o.length === 0) return v;
    let m = o.join(", ");
    if (m === "initial") return v;
    if (v === "initial") return m;
    if (v.startsWith("var(") || v.startsWith("theme(") || v.startsWith("--theme(")) {
      let O = ct(v);
      return O0(O, m), je(O);
    }
    return v;
  }
  function x0(r, a, c, ...o) {
    c = S0(c);
    let h = r.resolveThemeValue(c);
    if (!h && o.length > 0) return o.join(", ");
    if (!h) throw new Error(`Could not resolve value for theme function: \`theme(${c})\`. Consider checking if the path is correct or provide a fallback value to silence this error.`);
    return h;
  }
  var wu = new RegExp(Object.keys(Pa).map(r => `${r}\\(`).join("|"));
  function La(r, a) {
    let c = 0;
    return De(r, o => {
      if (o.kind === "declaration" && o.value && wu.test(o.value)) {
        c |= 8, o.value = ku(o.value, o, a);
        return;
      }
      o.kind === "at-rule" && (o.name === "@media" || o.name === "@custom-media" || o.name === "@container" || o.name === "@supports") && wu.test(o.params) && (c |= 8, o.params = ku(o.params, o, a));
    }), c;
  }
  function ku(r, a, c) {
    let o = ct(r);
    return De(o, h => {
      if (h.kind === "function" && h.value in Pa) {
        let v = ye(je(h.nodes).trim(), ",").map(O => O.trim()),
          m = Pa[h.value](c, a, ...v);
        return Ee.Replace(ct(m));
      }
    }), je(o);
  }
  function S0(r) {
    if (r[0] !== "'" && r[0] !== '"') return r;
    let a = "",
      c = r[0];
    for (let o = 1; o < r.length - 1; o++) {
      let h = r[o],
        v = r[o + 1];
      h === "\\" && (v === c || v === "\\") ? (a += v, o++) : a += h;
    }
    return a;
  }
  function O0(r, a) {
    De(r, c => {
      if (c.kind === "function" && !(c.value !== "var" && c.value !== "theme" && c.value !== "--theme")) if (c.nodes.length === 1) c.nodes.push({
        kind: "word",
        value: `, ${a}`
      });else {
        let o = c.nodes[c.nodes.length - 1];
        o.kind === "word" && o.value === "initial" && (o.value = a);
      }
    });
  }
  function T0() {
    return [];
  }
  function C0() {
    return [];
  }
  function A0() {
    return [];
  }
  function D0(r, a) {
    let {
        astNodes: c,
        nodeSorting: o
      } = Yo(Array.from(a), r),
      h = new Map(a.map(m => [m, null])),
      v = 0n;
    for (let m of c) {
      let O = o.get(m)?.candidate;
      O && h.set(O, h.get(O) ?? v++);
    }
    return a.map(m => [m, h.get(m) ?? null]);
  }
  function Fa(r) {
    if (r[0] !== "[" || r[r.length - 1] !== "]") return null;
    let a = 1,
      c = a,
      o = r.length - 1;
    for (; si(r.charCodeAt(a));) a++;
    {
      for (c = a; a < o; a++) {
        let k = r.charCodeAt(a);
        if (k === 92) {
          a++;
          continue;
        }
        if (!(k >= 65 && k <= 90) && !(k >= 97 && k <= 122) && !(k >= 48 && k <= 57) && !(k === 45 || k === 95) && !(k >= 128)) break;
      }
      if (c === a) return null;
    }
    let h = r.slice(c, a);
    for (; si(r.charCodeAt(a));) a++;
    if (a === o) return {
      attribute: h,
      operator: null,
      quote: null,
      value: null,
      sensitivity: null
    };
    let v = null,
      m = r.charCodeAt(a);
    if (m === 61) v = "=", a++;else if ((m === 126 || m === 124 || m === 94 || m === 36 || m === 42) && r.charCodeAt(a + 1) === 61) v = r[a] + "=", a += 2;else return null;
    for (; si(r.charCodeAt(a));) a++;
    if (a === o) return null;
    let O = "",
      S = null;
    if (m = r.charCodeAt(a), m === 39 || m === 34) {
      S = r[a], a++, c = a;
      for (let k = a; k < o; k++) {
        let b = r.charCodeAt(k);
        b === m ? a = k + 1 : b === 92 && k++;
      }
      O = r.slice(c, a - 1);
    } else {
      for (c = a; a < o && !si(r.charCodeAt(a));) a++;
      O = r.slice(c, a);
    }
    for (; si(r.charCodeAt(a));) a++;
    if (a === o) return {
      attribute: h,
      operator: v,
      quote: S,
      value: O,
      sensitivity: null
    };
    let y = null;
    switch (r.charCodeAt(a)) {
      case 105:
      case 73:
        {
          y = "i", a++;
          break;
        }
      case 115:
      case 83:
        {
          y = "s", a++;
          break;
        }
      default:
        return null;
    }
    for (; si(r.charCodeAt(a));) a++;
    return a !== o ? null : {
      attribute: h,
      operator: v,
      quote: S,
      value: O,
      sensitivity: y
    };
  }
  function si(r) {
    switch (r) {
      case 32:
      case 9:
      case 10:
      case 13:
        return !0;
      default:
        return !1;
    }
  }
  var Eu = /^@?[a-z0-9][a-zA-Z0-9_-]*(?<![_-])$/,
    V0 = class {
      compareFns = new Map();
      variants = new Map();
      completions = new Map();
      groupOrder = null;
      lastOrder = 0;
      static(r, a, {
        compounds: c,
        order: o
      } = {}) {
        this.set(r, {
          kind: "static",
          applyFn: a,
          compoundsWith: 0,
          compounds: c ?? 2,
          order: o
        });
      }
      fromAst(r, a, c) {
        let o = [],
          h = !1;
        De(a, v => {
          v.kind === "rule" ? o.push(v.selector) : v.kind === "at-rule" && v.name === "@variant" ? h = !0 : v.kind === "at-rule" && v.name !== "@slot" && o.push(`${v.name} ${v.params}`);
        }), this.static(r, v => {
          let m = a.map(fn);
          h && Ua(m, c), Nu(m, v.nodes), v.nodes = m;
        }, {
          compounds: Hi(o)
        });
      }
      functional(r, a, {
        compounds: c,
        order: o
      } = {}) {
        this.set(r, {
          kind: "functional",
          applyFn: a,
          compoundsWith: 0,
          compounds: c ?? 2,
          order: o
        });
      }
      compound(r, a, c, {
        compounds: o,
        order: h
      } = {}) {
        this.set(r, {
          kind: "compound",
          applyFn: c,
          compoundsWith: a,
          compounds: o ?? 2,
          order: h
        });
      }
      group(r, a) {
        this.groupOrder = this.nextOrder(), a && this.compareFns.set(this.groupOrder, a), r(), this.groupOrder = null;
      }
      has(r) {
        return this.variants.has(r);
      }
      get(r) {
        return this.variants.get(r);
      }
      kind(r) {
        return this.variants.get(r)?.kind;
      }
      compoundsWith(r, a) {
        let c = this.variants.get(r),
          o = typeof a == "string" ? this.variants.get(a) : a.kind === "arbitrary" ? {
            compounds: Hi([a.selector])
          } : this.variants.get(a.root);
        return !(!c || !o || c.kind !== "compound" || o.compounds === 0 || c.compoundsWith === 0 || (c.compoundsWith & o.compounds) === 0);
      }
      suggest(r, a) {
        this.completions.set(r, a);
      }
      getCompletions(r) {
        return this.completions.get(r)?.() ?? [];
      }
      compare(r, a) {
        if (r === a) return 0;
        if (r === null) return -1;
        if (a === null) return 1;
        if (r.kind === "arbitrary" && a.kind === "arbitrary") return r.selector < a.selector ? -1 : 1;
        if (r.kind === "arbitrary") return 1;
        if (a.kind === "arbitrary") return -1;
        let c = this.variants.get(r.root).order,
          o = this.variants.get(a.root).order,
          h = c - o;
        if (h !== 0) return h;
        if (r.kind === "compound" && a.kind === "compound") {
          let S = this.compare(r.variant, a.variant);
          return S !== 0 ? S : r.modifier && a.modifier ? r.modifier.value < a.modifier.value ? -1 : 1 : r.modifier ? 1 : a.modifier ? -1 : 0;
        }
        let v = this.compareFns.get(c);
        if (v !== void 0) return v(r, a);
        if (r.root !== a.root) return r.root < a.root ? -1 : 1;
        let m = r.value,
          O = a.value;
        return m === null ? -1 : O === null || m.kind === "arbitrary" && O.kind !== "arbitrary" ? 1 : m.kind !== "arbitrary" && O.kind === "arbitrary" || m.value < O.value ? -1 : 1;
      }
      keys() {
        return this.variants.keys();
      }
      entries() {
        return this.variants.entries();
      }
      set(r, {
        kind: a,
        applyFn: c,
        compounds: o,
        compoundsWith: h,
        order: v
      }) {
        let m = this.variants.get(r);
        m ? Object.assign(m, {
          kind: a,
          applyFn: c,
          compounds: o
        }) : (v === void 0 && (this.lastOrder = this.nextOrder(), v = this.lastOrder), this.variants.set(r, {
          kind: a,
          applyFn: c,
          order: v,
          compoundsWith: h,
          compounds: o
        }));
      }
      nextOrder() {
        return this.groupOrder ?? this.lastOrder + 1;
      }
    };
  function Hi(r) {
    let a = 0;
    for (let c of r) {
      if (c[0] === "@") {
        if (!c.startsWith("@media") && !c.startsWith("@supports") && !c.startsWith("@container")) return 0;
        a |= 1;
        continue;
      }
      if (c.includes("::")) return 0;
      a |= 2;
    }
    return a;
  }
  function $0(r) {
    let a = new V0();
    function c(y, k, {
      compounds: b
    } = {}) {
      b = b ?? Hi(k), a.static(y, E => {
        E.nodes = k.map(A => xt(A, E.nodes));
      }, {
        compounds: b
      });
    }
    c("*", [":is(& > *)"], {
      compounds: 0
    }), c("**", [":is(& *)"], {
      compounds: 0
    });
    function o(y, k) {
      return k.map(b => {
        if (y === "@container") {
          let E = ct(b.trim());
          return E.length >= 1 && E[0].kind === "function" ? `not ${b}` : E.length >= 3 && E[0].kind === "word" && E[0].value === "not" && E[2].kind === "function" ? (E.splice(0, 2), je(E)) : E.length >= 5 && E[0].kind === "word" && E[2].kind === "word" && E[2].value === "not" && E[4].kind === "function" ? (E.splice(2, 2), je(E)) : E.length >= 3 && E[0].kind === "word" && E[0].value !== "not" && E[2].kind === "function" ? (E.splice(1, 0, {
            kind: "separator",
            value: " "
          }, {
            kind: "word",
            value: "not"
          }), je(E)) : `not ${b}`;
        } else {
          b = b.trim();
          let E = ye(b, " ");
          return E[0] === "not" ? E.slice(1).join(" ") : `not ${b}`;
        }
      });
    }
    let h = ["@media", "@supports", "@container"];
    function v(y) {
      for (let k of h) {
        if (k !== y.name) continue;
        let b = ye(y.params, ",");
        return b.length > 1 ? null : (b = o(y.name, b), tt(y.name, b.join(", ")));
      }
      return null;
    }
    function m(y) {
      return y.includes("::") ? null : `&:not(${ye(y, ",").map(k => (k = k.replaceAll("&", "*"), k)).join(", ")})`;
    }
    a.compound("not", 3, (y, k) => {
      if (k.variant.kind === "arbitrary" && k.variant.relative || k.modifier) return null;
      let b = !1;
      if (De([y], (E, A) => {
        if (E.kind !== "rule" && E.kind !== "at-rule" || E.nodes.length > 0) return Ee.Continue;
        let T = [],
          R = [],
          H = A.path();
        H.push(E);
        for (let B of H) B.kind === "at-rule" ? T.push(B) : B.kind === "rule" && R.push(B);
        if (T.length > 1 || R.length > 1) return Ee.Stop;
        let ne = [];
        for (let B of R) {
          let U = m(B.selector);
          if (!U) return b = !1, Ee.Stop;
          ne.push(ot(U, []));
        }
        for (let B of T) {
          let U = v(B);
          if (!U) return b = !1, Ee.Stop;
          ne.push(U);
        }
        return Object.assign(y, ot("&", ne)), b = !0, Ee.Skip;
      }), y.kind === "rule" && y.selector === "&" && y.nodes.length === 1 && Object.assign(y, y.nodes[0]), !b) return null;
    }), a.suggest("not", () => Array.from(a.keys()).filter(y => a.compoundsWith("not", y))), a.compound("group", 2, (y, k) => {
      if (k.variant.kind === "arbitrary" && k.variant.relative) return null;
      let b = k.modifier ? `:where(.${r.prefix ? `${r.prefix}\\:` : ""}group\\/${k.modifier.value})` : `:where(.${r.prefix ? `${r.prefix}\\:` : ""}group)`,
        E = !1;
      if (De([y], (A, T) => {
        if (A.kind !== "rule") return Ee.Continue;
        for (let H of T.path()) if (H.kind === "rule") return E = !1, Ee.Stop;
        let R = A.selector.replaceAll("&", b);
        ye(R, ",").length > 1 && (R = `:is(${R})`), A.selector = `&:is(${R} *)`, E = !0;
      }), !E) return null;
    }), a.suggest("group", () => Array.from(a.keys()).filter(y => a.compoundsWith("group", y))), a.compound("peer", 2, (y, k) => {
      if (k.variant.kind === "arbitrary" && k.variant.relative) return null;
      let b = k.modifier ? `:where(.${r.prefix ? `${r.prefix}\\:` : ""}peer\\/${k.modifier.value})` : `:where(.${r.prefix ? `${r.prefix}\\:` : ""}peer)`,
        E = !1;
      if (De([y], (A, T) => {
        if (A.kind !== "rule") return Ee.Continue;
        for (let H of T.path()) if (H.kind === "rule") return E = !1, Ee.Stop;
        let R = A.selector.replaceAll("&", b);
        ye(R, ",").length > 1 && (R = `:is(${R})`), A.selector = `&:is(${R} ~ *)`, E = !0;
      }), !E) return null;
    }), a.suggest("peer", () => Array.from(a.keys()).filter(y => a.compoundsWith("peer", y))), c("first-letter", ["&::first-letter"]), c("first-line", ["&::first-line"]), c("marker", ["& *::marker", "&::marker", "& *::-webkit-details-marker", "&::-webkit-details-marker"]), c("selection", ["& *::selection", "&::selection"]), c("file", ["&::file-selector-button"]), c("placeholder", ["&::placeholder"]), c("backdrop", ["&::backdrop"]), c("details-content", ["&::details-content"]);
    {
      let y = function () {
        return We([tt("@property", "--tw-content", [d("syntax", '"*"'), d("initial-value", '""'), d("inherits", "false")])]);
      };
      var O = y;
      a.static("before", k => {
        k.nodes = [ot("&::before", [y(), d("content", "var(--tw-content)"), ...k.nodes])];
      }, {
        compounds: 0
      }), a.static("after", k => {
        k.nodes = [ot("&::after", [y(), d("content", "var(--tw-content)"), ...k.nodes])];
      }, {
        compounds: 0
      });
    }
    c("first", ["&:first-child"]), c("last", ["&:last-child"]), c("only", ["&:only-child"]), c("odd", ["&:nth-child(odd)"]), c("even", ["&:nth-child(even)"]), c("first-of-type", ["&:first-of-type"]), c("last-of-type", ["&:last-of-type"]), c("only-of-type", ["&:only-of-type"]), c("visited", ["&:visited"]), c("target", ["&:target"]), c("open", ["&:is([open], :popover-open, :open)"]), c("default", ["&:default"]), c("checked", ["&:checked"]), c("indeterminate", ["&:indeterminate"]), c("placeholder-shown", ["&:placeholder-shown"]), c("autofill", ["&:autofill"]), c("optional", ["&:optional"]), c("required", ["&:required"]), c("valid", ["&:valid"]), c("invalid", ["&:invalid"]), c("user-valid", ["&:user-valid"]), c("user-invalid", ["&:user-invalid"]), c("in-range", ["&:in-range"]), c("out-of-range", ["&:out-of-range"]), c("read-only", ["&:read-only"]), c("empty", ["&:empty"]), c("focus-within", ["&:focus-within"]), a.static("hover", y => {
      y.nodes = [ot("&:hover", [tt("@media", "(hover: hover)", y.nodes)])];
    }), c("focus", ["&:focus"]), c("focus-visible", ["&:focus-visible"]), c("active", ["&:active"]), c("enabled", ["&:enabled"]), c("disabled", ["&:disabled"]), c("inert", ["&:is([inert], [inert] *)"]), a.compound("in", 2, (y, k) => {
      if (k.modifier) return null;
      let b = !1;
      if (De([y], (E, A) => {
        if (E.kind !== "rule") return Ee.Continue;
        for (let T of A.path()) if (T.kind === "rule") return b = !1, Ee.Stop;
        E.selector = `:where(${E.selector.replaceAll("&", "*")}) &`, b = !0;
      }), !b) return null;
    }), a.suggest("in", () => Array.from(a.keys()).filter(y => a.compoundsWith("in", y))), a.compound("has", 2, (y, k) => {
      if (k.modifier) return null;
      let b = !1;
      if (De([y], (E, A) => {
        if (E.kind !== "rule") return Ee.Continue;
        for (let T of A.path()) if (T.kind === "rule") return b = !1, Ee.Stop;
        E.selector = `&:has(${E.selector.replaceAll("&", "*")})`, b = !0;
      }), !b) return null;
    }), a.suggest("has", () => Array.from(a.keys()).filter(y => a.compoundsWith("has", y))), a.functional("aria", (y, k) => {
      if (!k.value || k.modifier) return null;
      if (k.value.kind === "arbitrary") {
        let b = `[aria-${_u(k.value.value)}]`;
        if (Fa(b) === null) return null;
        y.nodes = [ot(`&${b}`, y.nodes)];
      } else {
        let b = `[aria-${k.value.value}="true"]`;
        if (Fa(b) === null) return null;
        y.nodes = [ot(`&${b}`, y.nodes)];
      }
    }), a.suggest("aria", () => ["busy", "checked", "disabled", "expanded", "hidden", "pressed", "readonly", "required", "selected"]), a.functional("data", (y, k) => {
      if (!k.value || k.modifier) return null;
      let b = `[data-${_u(k.value.value)}]`;
      if (Fa(b) === null) return null;
      y.nodes = [ot(`&${b}`, y.nodes)];
    }), a.functional("nth", (y, k) => {
      if (!k.value || k.modifier || k.value.kind === "named" && !he(k.value.value)) return null;
      y.nodes = [ot(`&:nth-child(${k.value.value})`, y.nodes)];
    }), a.functional("nth-last", (y, k) => {
      if (!k.value || k.modifier || k.value.kind === "named" && !he(k.value.value)) return null;
      y.nodes = [ot(`&:nth-last-child(${k.value.value})`, y.nodes)];
    }), a.functional("nth-of-type", (y, k) => {
      if (!k.value || k.modifier || k.value.kind === "named" && !he(k.value.value)) return null;
      y.nodes = [ot(`&:nth-of-type(${k.value.value})`, y.nodes)];
    }), a.functional("nth-last-of-type", (y, k) => {
      if (!k.value || k.modifier || k.value.kind === "named" && !he(k.value.value)) return null;
      y.nodes = [ot(`&:nth-last-of-type(${k.value.value})`, y.nodes)];
    }), a.functional("supports", (y, k) => {
      if (!k.value || k.modifier) return null;
      let b = k.value.value;
      if (b === null) return null;
      if (/^[\w-]*\s*\(/.test(b)) {
        let E = b.replace(/\b(and|or|not)\b/g, " $1 ");
        y.nodes = [tt("@supports", E, y.nodes)];
        return;
      }
      b.includes(":") || (b = `${b}: var(--tw)`), (b[0] !== "(" || b[b.length - 1] !== ")") && (b = `(${b})`), y.nodes = [tt("@supports", b, y.nodes)];
    }, {
      compounds: 1
    }), c("motion-safe", ["@media (prefers-reduced-motion: no-preference)"]), c("motion-reduce", ["@media (prefers-reduced-motion: reduce)"]), c("contrast-more", ["@media (prefers-contrast: more)"]), c("contrast-less", ["@media (prefers-contrast: less)"]);
    {
      let y = function (k, b, E, A) {
        if (k === b) return 0;
        let T = A.get(k);
        if (T === null) return E === "asc" ? -1 : 1;
        let R = A.get(b);
        return R === null ? E === "asc" ? 1 : -1 : Bo(T, R, E);
      };
      var S = y;
      {
        let k = r.namespace("--breakpoint"),
          b = new be(E => {
            switch (E.kind) {
              case "static":
                return r.resolveValue(E.root, ["--breakpoint"]) ?? null;
              case "functional":
                {
                  if (!E.value || E.modifier) return null;
                  let A = null;
                  return E.value.kind === "arbitrary" ? A = E.value.value : E.value.kind === "named" && (A = r.resolveValue(E.value.value, ["--breakpoint"])), !A || A.includes("var(") ? null : A;
                }
              case "arbitrary":
              case "compound":
                return null;
            }
          });
        a.group(() => {
          a.functional("max", (E, A) => {
            if (A.modifier) return null;
            let T = b.get(A);
            if (T === null) return null;
            E.nodes = [tt("@media", `(width < ${T})`, E.nodes)];
          }, {
            compounds: 1
          });
        }, (E, A) => y(E, A, "desc", b)), a.suggest("max", () => Array.from(k.keys()).filter(E => E !== null)), a.group(() => {
          for (let [E, A] of r.namespace("--breakpoint")) E !== null && a.static(E, T => {
            T.nodes = [tt("@media", `(width >= ${A})`, T.nodes)];
          }, {
            compounds: 1
          });
          a.functional("min", (E, A) => {
            if (A.modifier) return null;
            let T = b.get(A);
            if (T === null) return null;
            E.nodes = [tt("@media", `(width >= ${T})`, E.nodes)];
          }, {
            compounds: 1
          });
        }, (E, A) => y(E, A, "asc", b)), a.suggest("min", () => Array.from(k.keys()).filter(E => E !== null));
      }
      {
        let k = r.namespace("--container"),
          b = new be(E => {
            switch (E.kind) {
              case "functional":
                {
                  if (E.value === null) return null;
                  let A = null;
                  return E.value.kind === "arbitrary" ? A = E.value.value : E.value.kind === "named" && (A = r.resolveValue(E.value.value, ["--container"])), !A || A.includes("var(") ? null : A;
                }
              case "static":
              case "arbitrary":
              case "compound":
                return null;
            }
          });
        a.group(() => {
          a.functional("@max", (E, A) => {
            let T = b.get(A);
            if (T === null) return null;
            E.nodes = [tt("@container", A.modifier ? `${A.modifier.value} (width < ${T})` : `(width < ${T})`, E.nodes)];
          }, {
            compounds: 1
          });
        }, (E, A) => y(E, A, "desc", b)), a.suggest("@max", () => Array.from(k.keys()).filter(E => E !== null)), a.group(() => {
          a.functional("@", (E, A) => {
            let T = b.get(A);
            if (T === null) return null;
            E.nodes = [tt("@container", A.modifier ? `${A.modifier.value} (width >= ${T})` : `(width >= ${T})`, E.nodes)];
          }, {
            compounds: 1
          }), a.functional("@min", (E, A) => {
            let T = b.get(A);
            if (T === null) return null;
            E.nodes = [tt("@container", A.modifier ? `${A.modifier.value} (width >= ${T})` : `(width >= ${T})`, E.nodes)];
          }, {
            compounds: 1
          });
        }, (E, A) => y(E, A, "asc", b)), a.suggest("@min", () => Array.from(k.keys()).filter(E => E !== null)), a.suggest("@", () => Array.from(k.keys()).filter(E => E !== null));
      }
    }
    return c("portrait", ["@media (orientation: portrait)"]), c("landscape", ["@media (orientation: landscape)"]), c("ltr", ['&:where(:dir(ltr), [dir="ltr"], [dir="ltr"] *)']), c("rtl", ['&:where(:dir(rtl), [dir="rtl"], [dir="rtl"] *)']), c("dark", ["@media (prefers-color-scheme: dark)"]), c("starting", ["@starting-style"]), c("print", ["@media print"]), c("forced-colors", ["@media (forced-colors: active)"]), c("inverted-colors", ["@media (inverted-colors: inverted)"]), c("pointer-none", ["@media (pointer: none)"]), c("pointer-coarse", ["@media (pointer: coarse)"]), c("pointer-fine", ["@media (pointer: fine)"]), c("any-pointer-none", ["@media (any-pointer: none)"]), c("any-pointer-coarse", ["@media (any-pointer: coarse)"]), c("any-pointer-fine", ["@media (any-pointer: fine)"]), c("noscript", ["@media (scripting: none)"]), a;
  }
  function _u(r) {
    if (r.includes("=")) {
      let [a, ...c] = ye(r, "="),
        o = c.join("=").trim();
      if (o[0] === "'" || o[0] === '"') return r;
      if (o.length > 1) {
        let h = o[o.length - 1];
        if (o[o.length - 2] === " " && (h === "i" || h === "I" || h === "s" || h === "S")) return `${a}="${o.slice(0, -2)}" ${h}`;
      }
      return `${a}="${o}"`;
    }
    return r;
  }
  function Nu(r, a) {
    De(r, c => {
      if (c.kind === "at-rule" && c.name === "@slot") return Ee.ReplaceSkip(a);
      if (c.kind === "at-rule" && (c.name === "@keyframes" || c.name === "@property")) return Object.assign(c, We([tt(c.name, c.params, c.nodes)])), Ee.Skip;
    });
  }
  function Ua(r, a) {
    let c = 0;
    return De(r, o => {
      if (o.kind !== "at-rule" || o.name !== "@variant") return;
      let h = [],
        v = ye(o.params, ",");
      for (let [m, O] of v.entries()) {
        let S = ot("&", m === v.length - 1 ? o.nodes : o.nodes.map(fn)),
          y = ye(O, ":");
        for (let k = y.length - 1; k >= 0; --k) {
          let b = y[k].trim();
          if (!b) throw new Error("Cannot use `@variant` with empty variant");
          let E = a.parseVariant(b);
          if (E === null) throw new Error(`Cannot use \`@variant\` with unknown variant: ${b}`);
          if (ja(S, E, a.variants) === null) throw new Error(`Cannot use \`@variant\` with variant: ${b}`);
        }
        S.selector === "&" ? h.push(...S.nodes) : h.push(S);
      }
      return c |= 32, Ee.Replace(h);
    }), c;
  }
  function I0(r, a) {
    let c = c0(r),
      o = $0(r),
      h = new be(b => _m(b, k)),
      v = new be(b => Array.from(Em(b, k))),
      m = new be(b => new be(E => {
        let A = M0(E, k, b);
        try {
          let T = A.map(R => R.node);
          La(T, k), Ua(T, k);
        } catch {
          return [];
        }
        return A;
      })),
      O = new be(b => {
        for (let E of tu(b)) r.markUsedVariable(E);
      });
    function S(b) {
      let E = [];
      for (let A of b) {
        let T = !0,
          {
            astNodes: R
          } = Yo([A], k, {
            onInvalidCandidate() {
              T = !1;
            }
          });
        a && De(R, H => (H.src ??= a, Ee.Continue)), R = ji(R, k, 0), E.push(T ? R : []);
      }
      return E;
    }
    function y(b) {
      return S(b).map(E => E.length > 0 ? sr(E) : null);
    }
    let k = {
      theme: r,
      utilities: c,
      variants: o,
      invalidCandidates: new Set(),
      important: !1,
      candidatesToCss: y,
      candidatesToAst: S,
      getClassOrder(b) {
        return D0(this, b);
      },
      getClassList() {
        return T0(this);
      },
      getVariants() {
        return C0(this);
      },
      parseCandidate(b) {
        return v.get(b);
      },
      parseVariant(b) {
        return h.get(b);
      },
      compileAstNodes(b, E = 1) {
        return m.get(E).get(b);
      },
      printCandidate(b) {
        return Nm(k, b);
      },
      printVariant(b) {
        return Da(b);
      },
      getVariantOrder() {
        let b = Array.from(h.values());
        b.sort((R, H) => this.variants.compare(R, H));
        let E = new Map(),
          A,
          T = 0;
        for (let R of b) R !== null && (A !== void 0 && this.variants.compare(A, R) !== 0 && T++, E.set(R, T), A = R);
        return E;
      },
      resolveThemeValue(b, E = !0) {
        let A = b.lastIndexOf("/"),
          T = null;
        A !== -1 && (T = b.slice(A + 1).trim(), b = b.slice(0, A).trim());
        let R = r.resolve(null, [b], E ? 1 : 0) ?? void 0;
        return T && R ? Dt(R, T) : R;
      },
      trackUsedVariables(b) {
        O.get(b);
      },
      canonicalizeCandidates(b, E) {
        return A0(this, b, E);
      },
      storage: {}
    };
    return k;
  }
  var xu = ["container-type", "pointer-events", "visibility", "position", "inset", "inset-inline", "inset-block", "inset-inline-start", "inset-inline-end", "inset-block-start", "inset-block-end", "top", "right", "bottom", "left", "isolation", "z-index", "order", "grid-column", "grid-column-start", "grid-column-end", "grid-row", "grid-row-start", "grid-row-end", "float", "clear", "--tw-container-component", "margin", "margin-inline", "margin-block", "margin-inline-start", "margin-inline-end", "margin-block-start", "margin-block-end", "margin-top", "margin-right", "margin-bottom", "margin-left", "box-sizing", "display", "field-sizing", "aspect-ratio", "height", "max-height", "min-height", "width", "max-width", "min-width", "flex", "flex-shrink", "flex-grow", "flex-basis", "table-layout", "caption-side", "border-collapse", "border-spacing", "transform-origin", "translate", "--tw-translate-x", "--tw-translate-y", "--tw-translate-z", "scale", "--tw-scale-x", "--tw-scale-y", "--tw-scale-z", "rotate", "--tw-rotate-x", "--tw-rotate-y", "--tw-rotate-z", "--tw-skew-x", "--tw-skew-y", "transform", "zoom", "animation", "cursor", "touch-action", "--tw-pan-x", "--tw-pan-y", "--tw-pinch-zoom", "resize", "scroll-snap-type", "--tw-scroll-snap-strictness", "scroll-snap-align", "scroll-snap-stop", "scroll-margin", "scroll-margin-inline", "scroll-margin-block", "scroll-margin-inline-start", "scroll-margin-inline-end", "scroll-margin-block-start", "scroll-margin-block-end", "scroll-margin-top", "scroll-margin-right", "scroll-margin-bottom", "scroll-margin-left", "scroll-padding", "scroll-padding-inline", "scroll-padding-block", "scroll-padding-inline-start", "scroll-padding-inline-end", "scroll-padding-block-start", "scroll-padding-block-end", "scroll-padding-top", "scroll-padding-right", "scroll-padding-bottom", "scroll-padding-left", "scrollbar-width", "scrollbar-color", "scrollbar-gutter", "list-style-position", "list-style-type", "list-style-image", "appearance", "columns", "break-before", "break-inside", "break-after", "grid-auto-columns", "grid-auto-flow", "grid-auto-rows", "grid-template-columns", "grid-template-rows", "flex-direction", "flex-wrap", "place-content", "place-items", "align-content", "align-items", "justify-content", "justify-items", "gap", "column-gap", "row-gap", "--tw-space-x-reverse", "--tw-space-y-reverse", "divide-x-width", "divide-y-width", "--tw-divide-y-reverse", "divide-style", "divide-color", "place-self", "align-self", "justify-self", "overflow", "overflow-x", "overflow-y", "overscroll-behavior", "overscroll-behavior-x", "overscroll-behavior-y", "scroll-behavior", "border-radius", "border-start-radius", "border-end-radius", "border-top-radius", "border-right-radius", "border-bottom-radius", "border-left-radius", "border-start-start-radius", "border-start-end-radius", "border-end-end-radius", "border-end-start-radius", "border-top-left-radius", "border-top-right-radius", "border-bottom-right-radius", "border-bottom-left-radius", "border-width", "border-inline-width", "border-block-width", "border-inline-start-width", "border-inline-end-width", "border-block-start-width", "border-block-end-width", "border-top-width", "border-right-width", "border-bottom-width", "border-left-width", "border-style", "border-inline-style", "border-block-style", "border-inline-start-style", "border-inline-end-style", "border-block-start-style", "border-block-end-style", "border-top-style", "border-right-style", "border-bottom-style", "border-left-style", "border-color", "border-inline-color", "border-block-color", "border-inline-start-color", "border-inline-end-color", "border-block-start-color", "border-block-end-color", "border-top-color", "border-right-color", "border-bottom-color", "border-left-color", "background-color", "background-image", "--tw-gradient-position", "--tw-gradient-stops", "--tw-gradient-via-stops", "--tw-gradient-from", "--tw-gradient-from-position", "--tw-gradient-via", "--tw-gradient-via-position", "--tw-gradient-to", "--tw-gradient-to-position", "mask-image", "--tw-mask-top", "--tw-mask-top-from-color", "--tw-mask-top-from-position", "--tw-mask-top-to-color", "--tw-mask-top-to-position", "--tw-mask-right", "--tw-mask-right-from-color", "--tw-mask-right-from-position", "--tw-mask-right-to-color", "--tw-mask-right-to-position", "--tw-mask-bottom", "--tw-mask-bottom-from-color", "--tw-mask-bottom-from-position", "--tw-mask-bottom-to-color", "--tw-mask-bottom-to-position", "--tw-mask-left", "--tw-mask-left-from-color", "--tw-mask-left-from-position", "--tw-mask-left-to-color", "--tw-mask-left-to-position", "--tw-mask-linear", "--tw-mask-linear-position", "--tw-mask-linear-from-color", "--tw-mask-linear-from-position", "--tw-mask-linear-to-color", "--tw-mask-linear-to-position", "--tw-mask-radial", "--tw-mask-radial-shape", "--tw-mask-radial-size", "--tw-mask-radial-position", "--tw-mask-radial-from-color", "--tw-mask-radial-from-position", "--tw-mask-radial-to-color", "--tw-mask-radial-to-position", "--tw-mask-conic", "--tw-mask-conic-position", "--tw-mask-conic-from-color", "--tw-mask-conic-from-position", "--tw-mask-conic-to-color", "--tw-mask-conic-to-position", "box-decoration-break", "background-size", "background-attachment", "background-clip", "background-position", "background-repeat", "background-origin", "mask-composite", "mask-mode", "mask-type", "mask-size", "mask-clip", "mask-position", "mask-repeat", "mask-origin", "fill", "stroke", "stroke-width", "object-fit", "object-position", "padding", "padding-inline", "padding-block", "padding-inline-start", "padding-inline-end", "padding-block-start", "padding-block-end", "padding-top", "padding-right", "padding-bottom", "padding-left", "text-align", "text-indent", "vertical-align", "font-family", "font-feature-settings", "font-size", "line-height", "font-weight", "letter-spacing", "text-wrap", "overflow-wrap", "word-break", "text-overflow", "hyphens", "white-space", "tab-size", "color", "text-transform", "font-style", "font-stretch", "font-variant-numeric", "text-decoration-line", "text-decoration-color", "text-decoration-style", "text-decoration-thickness", "text-underline-offset", "-webkit-font-smoothing", "placeholder-color", "caret-color", "accent-color", "color-scheme", "opacity", "background-blend-mode", "mix-blend-mode", "box-shadow", "--tw-shadow", "--tw-shadow-color", "--tw-ring-shadow", "--tw-ring-color", "--tw-inset-shadow", "--tw-inset-shadow-color", "--tw-inset-ring-shadow", "--tw-inset-ring-color", "--tw-ring-offset-width", "--tw-ring-offset-color", "outline", "outline-width", "outline-offset", "outline-color", "--tw-blur", "--tw-brightness", "--tw-contrast", "--tw-drop-shadow", "--tw-grayscale", "--tw-hue-rotate", "--tw-invert", "--tw-saturate", "--tw-sepia", "filter", "--tw-backdrop-blur", "--tw-backdrop-brightness", "--tw-backdrop-contrast", "--tw-backdrop-grayscale", "--tw-backdrop-hue-rotate", "--tw-backdrop-invert", "--tw-backdrop-opacity", "--tw-backdrop-saturate", "--tw-backdrop-sepia", "backdrop-filter", "transition-property", "transition-behavior", "transition-delay", "transition-duration", "transition-timing-function", "will-change", "contain", "content", "forced-color-adjust"];
  function R0(r, a) {
    let c = r.length,
      o = a.length,
      h = c < o ? c : o;
    for (let v = 0; v < h; v++) {
      let m = r.charCodeAt(v),
        O = a.charCodeAt(v);
      if (m >= 48 && m <= 57 && O >= 48 && O <= 57) {
        let S = v,
          y = v + 1,
          k = v,
          b = v + 1;
        for (m = r.charCodeAt(y); m >= 48 && m <= 57;) m = r.charCodeAt(++y);
        for (O = a.charCodeAt(b); O >= 48 && O <= 57;) O = a.charCodeAt(++b);
        let E = r.slice(S, y),
          A = a.slice(k, b),
          T = Number(E) - Number(A);
        if (T) return T;
        if (E < A) return -1;
        if (E > A) return 1;
        continue;
      }
      if (m !== O) return m - O;
    }
    return r.length - a.length;
  }
  function Yo(r, a, {
    onInvalidCandidate: c,
    respectImportant: o
  } = {}) {
    let h = new Map(),
      v = [],
      m = new Map();
    for (let y of r) {
      if (a.invalidCandidates.has(y)) {
        c?.(y);
        continue;
      }
      let k = a.parseCandidate(y);
      if (k.length === 0) {
        c?.(y);
        continue;
      }
      m.set(y, k);
    }
    let O = 0;
    (o ?? !0) && (O |= 1);
    let S = a.getVariantOrder();
    for (let [y, k] of m) {
      let b = !1;
      for (let E of k) {
        let A = a.compileAstNodes(E, O);
        if (A.length !== 0) {
          b = !0;
          for (let {
            node: T,
            propertySort: R
          } of A) {
            let H = 0n;
            for (let ne of E.variants) H |= 1n << BigInt(S.get(ne));
            h.set(T, {
              properties: R,
              variants: H,
              candidate: y
            }), v.push(T);
          }
        }
      }
      b || c?.(y);
    }
    return v.sort((y, k) => {
      let b = h.get(y),
        E = h.get(k);
      if (b.variants - E.variants !== 0n) return Number(b.variants - E.variants);
      let A = 0;
      for (; A < b.properties.order.length && A < E.properties.order.length && b.properties.order[A] === E.properties.order[A];) A += 1;
      return (b.properties.order[A] ?? 1 / 0) - (E.properties.order[A] ?? 1 / 0) || E.properties.count - b.properties.count || R0(b.candidate, E.candidate);
    }), {
      astNodes: v,
      nodeSorting: h
    };
  }
  function M0(r, a, c) {
    let o = P0(r, a);
    if (o.length === 0) return [];
    let h = a.important && !!(c & 1),
      v = [],
      m = `.${me(r.raw)}`;
    for (let O of o) {
      let S = L0(O);
      (r.important || h) && Ou(O);
      let y = {
        kind: "rule",
        selector: m,
        nodes: O
      };
      for (let k of r.variants) if (ja(y, k, a.variants) === null) return [];
      v.push({
        node: y,
        propertySort: S
      });
    }
    return v;
  }
  function ja(r, a, c, o = 0) {
    if (a.kind === "arbitrary") {
      if (a.relative && o === 0) return null;
      r.nodes = [xt(a.selector, r.nodes)];
      return;
    }
    let {
      applyFn: h
    } = c.get(a.root);
    if (a.kind === "compound") {
      let v = tt("@slot");
      if (ja(v, a.variant, c, o + 1) === null || a.root === "not" && v.nodes.length > 1) return null;
      for (let m of v.nodes) if (m.kind !== "rule" && m.kind !== "at-rule" || h(m, a) === null) return null;
      De(v.nodes, m => {
        if ((m.kind === "rule" || m.kind === "at-rule") && m.nodes.length <= 0) return m.nodes = r.nodes, Ee.Skip;
      }), r.nodes = v.nodes;
      return;
    }
    if (h(r, a) === null) return null;
  }
  function Su(r) {
    let a = r.options?.types ?? [];
    return a.length > 1 && a.includes("any");
  }
  function P0(r, a) {
    if (r.kind === "arbitrary") {
      let m = r.value;
      return r.modifier && (m = St(m, r.modifier, a.theme)), m === null ? [] : [[d(r.property, m)]];
    }
    let c = a.utilities.get(r.root) ?? [],
      o = [],
      h = c.filter(m => !Su(m));
    for (let m of h) {
      if (m.kind !== r.kind) continue;
      let O = m.compileFn(r);
      if (O !== void 0) {
        if (O === null) {
          if (m.options?.types?.length) return o;
          continue;
        }
        o.push(O);
      }
    }
    if (o.length > 0) return o;
    let v = c.filter(m => Su(m));
    for (let m of v) {
      if (m.kind !== r.kind) continue;
      let O = m.compileFn(r);
      if (O !== void 0) {
        if (O === null) {
          if (m.options?.types?.length) return o;
          continue;
        }
        o.push(O);
      }
    }
    return o;
  }
  function Ou(r) {
    for (let a of r) a.kind !== "at-root" && (a.kind === "declaration" ? a.important = !0 : (a.kind === "rule" || a.kind === "at-rule") && Ou(a.nodes));
  }
  function L0(r) {
    let a = new Set(),
      c = 0,
      o = r.slice(),
      h = !1;
    for (; o.length > 0;) {
      let v = o.shift();
      if (v.kind === "declaration") {
        if (v.value === void 0 || (c++, h)) continue;
        if (v.property === "--tw-sort") {
          let O = xu.indexOf(v.value ?? "");
          if (O !== -1) {
            a.add(O), h = !0;
            continue;
          }
        }
        let m = xu.indexOf(v.property);
        m !== -1 && a.add(m);
      } else if (v.kind === "rule" || v.kind === "at-rule") for (let m of v.nodes) o.push(m);
    }
    return {
      order: Array.from(a).sort((v, m) => v - m),
      count: c
    };
  }
  function za(r, a) {
    let c = 0,
      o = xt("&", r),
      h = new Set(),
      v = new be(() => new Set()),
      m = new be(() => new Set());
    De([o], (b, E) => {
      if (b.kind === "at-rule") {
        if (b.name === "@keyframes") return De(b.nodes, A => {
          if (A.kind === "at-rule" && A.name === "@apply") throw new Error("You cannot use `@apply` inside `@keyframes`.");
        }), Ee.Skip;
        if (b.name === "@utility") {
          let A = b.params.replace(/-\*$/, "");
          m.get(A).add(b), De(b.nodes, T => {
            if (!(T.kind !== "at-rule" || T.name !== "@apply")) {
              h.add(b);
              for (let R of Tu(T, a)) v.get(b).add(R);
            }
          });
          return;
        }
        if (b.name === "@apply") {
          if (E.parent === null) return;
          c |= 1, h.add(E.parent);
          for (let A of Tu(b, a)) for (let T of E.path()) h.has(T) && v.get(T).add(A);
        }
      }
    });
    let O = new Set(),
      S = [],
      y = new Set();
    function k(b, E = []) {
      if (!O.has(b)) {
        if (y.has(b)) {
          let A = E[(E.indexOf(b) + 1) % E.length];
          throw b.kind === "at-rule" && b.name === "@utility" && A.kind === "at-rule" && A.name === "@utility" && De(b.nodes, T => {
            if (T.kind !== "at-rule" || T.name !== "@apply") return;
            let R = T.params.split(/\s+/g);
            for (let H of R) for (let ne of a.parseCandidate(H)) switch (ne.kind) {
              case "arbitrary":
                break;
              case "static":
              case "functional":
                if (A.params.replace(/-\*$/, "") === ne.root) throw new Error(`You cannot \`@apply\` the \`${H}\` utility here because it creates a circular dependency.`);
                break;
              default:
            }
          }), new Error(`Circular dependency detected:

${sr([b])}
Relies on:

${sr([A])}`);
        }
        y.add(b);
        for (let A of v.get(b)) for (let T of m.get(A)) E.push(b), k(T, E), E.pop();
        O.add(b), y.delete(b), S.push(b);
      }
    }
    for (let b of h) k(b);
    for (let b of S) "nodes" in b && De(b.nodes, E => {
      if (E.kind !== "at-rule" || E.name !== "@apply") return;
      let A = E.params.split(/(\s+)/g),
        T = {},
        R = [],
        H = [],
        ne = 0;
      for (let [B, U] of A.entries()) B % 2 === 0 && (U[0] === "-" && U[1] === "-" ? H.push(U) : R.push(U), T[U] = ne), ne += U.length;
      if (H.length) {
        if (R.length === 0) return Ee.Skip;
        let B = H.join(" ");
        throw new Error(`You cannot use \`@apply\` with both mixins and utilities. Please move \`@apply ${B}\` into a separate rule.`);
      }
      if (E.nodes.length > 0 && R.length) {
        let B = R.join(" ");
        throw new Error(`The rule \`@apply ${B}\` must not have a body.`);
      }
      {
        let B = Object.keys(T),
          U = Yo(B, a, {
            respectImportant: !1,
            onInvalidCandidate: Se => {
              if (a.theme.prefix && !Se.startsWith(a.theme.prefix)) throw new Error(`Cannot apply unprefixed utility class \`${Se}\`. Did you mean \`${a.theme.prefix}:${Se}\`?`);
              if (a.invalidCandidates.has(Se)) throw new Error(`Cannot apply utility class \`${Se}\` because it has been explicitly disabled: https://tailwindcss.com/docs/detecting-classes-in-source-files#explicitly-excluding-classes`);
              let ge = ye(Se, ":");
              if (ge.length > 1) {
                let Le = ge.pop();
                if (a.candidatesToCss([Le])[0]) {
                  let ze = a.candidatesToCss(ge.map(At => `${At}:[--tw-variant-check:1]`)),
                    Fe = ge.filter((At, Gt) => ze[Gt] === null);
                  if (Fe.length > 0) {
                    if (Fe.length === 1) throw new Error(`Cannot apply utility class \`${Se}\` because the ${Fe.map(At => `\`${At}\``)} variant does not exist.`);
                    {
                      let At = new Intl.ListFormat("en", {
                        style: "long",
                        type: "conjunction"
                      });
                      throw new Error(`Cannot apply utility class \`${Se}\` because the ${At.format(Fe.map(Gt => `\`${Gt}\``))} variants do not exist.`);
                    }
                  }
                }
              }
              throw a.theme.size === 0 ? new Error(`Cannot apply unknown utility class \`${Se}\`. Are you using CSS modules or similar and missing \`@reference\`? https://tailwindcss.com/docs/functions-and-directives#reference-directive`) : new Error(`Cannot apply unknown utility class \`${Se}\``);
            }
          }),
          Oe = E.src,
          Ve = U.astNodes.map(Se => {
            let ge = U.nodeSorting.get(Se)?.candidate,
              Le = ge ? T[ge] : void 0;
            if (Se = fn(Se), !Oe || !ge || Le === void 0) return De([Se], Fe => {
              Fe.src = Oe;
            }), Se;
            let ze = [Oe[0], Oe[1], Oe[2]];
            return ze[1] += 7 + Le, ze[2] = ze[1] + ge.length, De([Se], Fe => {
              Fe.src = ze;
            }), Se;
          }),
          Ie = [];
        for (let Se of Ve) if (Se.kind === "rule") for (let ge of Se.nodes) Ie.push(ge);else Ie.push(Se);
        return Ee.Replace(Ie);
      }
    });
    return c;
  }
  function* Tu(r, a) {
    for (let c of r.params.split(/\s+/g)) for (let o of a.parseCandidate(c)) switch (o.kind) {
      case "arbitrary":
        break;
      case "static":
      case "functional":
        yield o.root;
        break;
      default:
    }
  }
  async function Cu(r, a, c, o = 0, h = !1) {
    let v = 0,
      m = [];
    return De(r, O => {
      if (O.kind === "at-rule" && (O.name === "@import" || O.name === "@reference")) {
        let S = F0(ct(O.params));
        if (S === null) return;
        O.name === "@reference" && (S.media = "reference"), v |= 2;
        let {
          uri: y,
          layer: k,
          media: b,
          supports: E
        } = S;
        if (y.startsWith("data:") || y.startsWith("http://") || y.startsWith("https://")) return;
        let A = Sr({}, []);
        return m.push((async () => {
          if (o > 100) throw new Error(`Exceeded maximum recursion depth while resolving \`${y}\` in \`${a}\`)`);
          let T = await c(y, a),
            R = ae(T.content, {
              from: h ? T.path : void 0
            });
          await Cu(R, T.base, c, o + 1, h), A.nodes = U0(O, [Sr({
            base: T.base
          }, R)], k, b, E);
        })()), Ee.ReplaceSkip(A);
      }
    }), m.length > 0 && (await Promise.all(m)), v;
  }
  function F0(r) {
    let a,
      c = null,
      o = null,
      h = null;
    for (let v = 0; v < r.length; v++) {
      let m = r[v];
      if (m.kind !== "separator") {
        if (m.kind === "word" && !a) {
          if (!m.value || m.value[0] !== '"' && m.value[0] !== "'") return null;
          a = m.value.slice(1, -1);
          continue;
        }
        if (m.kind === "function" && m.value.toLowerCase() === "url" || !a) return null;
        if ((m.kind === "word" || m.kind === "function") && m.value.toLowerCase() === "layer") {
          if (c) return null;
          if (h) throw new Error("`layer(\u2026)` in an `@import` should come before any other functions or conditions");
          "nodes" in m ? c = je(m.nodes) : c = "";
          continue;
        }
        if (m.kind === "function" && m.value.toLowerCase() === "supports") {
          if (h) return null;
          h = je(m.nodes);
          continue;
        }
        o = je(r.slice(v));
        break;
      }
    }
    return a ? {
      uri: a,
      layer: c,
      media: o,
      supports: h
    } : null;
  }
  function U0(r, a, c, o, h) {
    let v = a;
    if (c !== null) {
      let m = tt("@layer", c, v);
      m.src = r.src, v = [m];
    }
    if (o !== null) {
      let m = tt("@media", o, v);
      m.src = r.src, v = [m];
    }
    if (h !== null) {
      let m = tt("@supports", h[0] === "(" ? h : `(${h})`, v);
      m.src = r.src, v = [m];
    }
    return v;
  }
  function ai(r, a = null) {
    return Array.isArray(r) && r.length === 2 && typeof r[1] == "object" && typeof r[1] !== null ? a ? r[1][a] ?? null : r[0] : Array.isArray(r) && a === null ? r.join(", ") : typeof r == "string" && a === null ? r : null;
  }
  function j0(r, {
    theme: a
  }, c) {
    for (let o of c) {
      let h = Ha([o]);
      h && r.theme.clearNamespace(`--${h}`, 4);
    }
    for (let [o, h] of z0(a)) {
      if (typeof h != "string" && typeof h != "number") continue;
      if (typeof h == "string" && (h = h.replace(/<alpha-value>/g, "1")), o[0] === "opacity" && (typeof h == "number" || typeof h == "string")) {
        let m = typeof h == "string" ? parseFloat(h) : h;
        m >= 0 && m <= 1 && (h = m * 100 + "%");
      }
      let v = Ha(o);
      v && r.theme.add(`--${v}`, "" + h, 7);
    }
    if (Object.hasOwn(a, "fontFamily")) {
      let o = 5;
      {
        let h = ai(a.fontFamily.sans);
        h && r.theme.hasDefault("--font-sans") && (r.theme.add("--default-font-family", h, o), r.theme.add("--default-font-feature-settings", ai(a.fontFamily.sans, "fontFeatureSettings") ?? "normal", o), r.theme.add("--default-font-variation-settings", ai(a.fontFamily.sans, "fontVariationSettings") ?? "normal", o));
      }
      {
        let h = ai(a.fontFamily.mono);
        h && r.theme.hasDefault("--font-mono") && (r.theme.add("--default-mono-font-family", h, o), r.theme.add("--default-mono-font-feature-settings", ai(a.fontFamily.mono, "fontFeatureSettings") ?? "normal", o), r.theme.add("--default-mono-font-variation-settings", ai(a.fontFamily.mono, "fontVariationSettings") ?? "normal", o));
      }
    }
    return a;
  }
  function z0(r) {
    let a = [];
    return Au(r, [], (c, o) => {
      if (W0(c)) return a.push([o, c]), 1;
      if (X0(c)) {
        a.push([o, c[0]]);
        for (let h of Reflect.ownKeys(c[1])) a.push([[...o, `-${h}`], c[1][h]]);
        return 1;
      }
      if (Array.isArray(c) && c.every(h => typeof h == "string")) return o[0] === "fontSize" ? (a.push([o, c[0]]), c.length >= 2 && a.push([[...o, "-line-height"], c[1]])) : a.push([o, c.join(", ")]), 1;
    }), a;
  }
  var H0 = {
      borderWidth: "border-width",
      outlineWidth: "outline-width",
      ringColor: "ring-color",
      ringWidth: "ring-width",
      transitionDuration: "transition-duration",
      transitionTimingFunction: "transition-timing-function"
    },
    B0 = {
      animation: "animate",
      aspectRatio: "aspect",
      borderRadius: "radius",
      boxShadow: "shadow",
      colors: "color",
      containers: "container",
      fontFamily: "font",
      fontSize: "text",
      letterSpacing: "tracking",
      lineHeight: "leading",
      maxWidth: "container",
      screens: "breakpoint",
      transitionTimingFunction: "ease"
    },
    K0 = /^[a-zA-Z0-9-_%/.]+$/;
  function Ha(r) {
    let a = H0[r[0]];
    if (a && r[1] === "DEFAULT") return `default-${a}`;
    if (r[0] === "container") return null;
    for (let o of r) if (!K0.test(o)) return null;
    let c = B0[r[0]];
    return c && (r = r.slice(), r[0] = c), r.map((o, h, v) => o === "1" && h !== v.length - 1 ? "" : o).map((o, h) => (o = o.replaceAll(".", "_"), (h === 0 || o.startsWith("-") || o === "lineHeight") && (o = o.replace(/([a-z])([A-Z])/g, (v, m, O) => `${m}-${O.toLowerCase()}`)), o)).filter((o, h) => o !== "DEFAULT" || h !== r.length - 1).join("-");
  }
  function W0(r) {
    return typeof r == "number" || typeof r == "string";
  }
  function X0(r) {
    if (!Array.isArray(r) || r.length !== 2 || typeof r[0] != "string" && typeof r[0] != "number" || r[1] === void 0 || r[1] === null || typeof r[1] != "object") return !1;
    for (let a of Reflect.ownKeys(r[1])) if (typeof a != "string" || typeof r[1][a] != "string" && typeof r[1][a] != "number") return !1;
    return !0;
  }
  function Au(r, a = [], c) {
    for (let o of Reflect.ownKeys(r)) {
      let h = r[o];
      if (h == null) continue;
      let v = [...a, o],
        m = c(h, v) ?? 0;
      if (m !== 1 && (m === 2 || !(!Array.isArray(h) && typeof h != "object") && Au(h, v, c) === 2)) return 2;
    }
  }
  function Du(r) {
    let a = [];
    for (let c of ye(r, ".")) {
      if (!c.includes("[")) {
        a.push(c);
        continue;
      }
      let o = 0;
      for (;;) {
        let h = c.indexOf("[", o),
          v = c.indexOf("]", h);
        if (h === -1 || v === -1) break;
        h > o && a.push(c.slice(o, h)), a.push(c.slice(h + 1, v)), o = v + 1;
      }
      o <= c.length - 1 && a.push(c.slice(o));
    }
    return a;
  }
  function Bi(r) {
    if (Object.prototype.toString.call(r) !== "[object Object]") return !1;
    let a = Object.getPrototypeOf(r);
    return a === null || Object.getPrototypeOf(a) === null;
  }
  function Ba(r, a, c, o = []) {
    for (let h of a) if (h != null) for (let v of Reflect.ownKeys(h)) {
      o.push(v);
      let m = c(r[v], h[v], o);
      m !== void 0 ? r[v] = m : !Bi(r[v]) || !Bi(h[v]) ? r[v] = h[v] : r[v] = Ba({}, [r[v], h[v]], c, o), o.pop();
    }
    return r;
  }
  function Vu(r, a, c) {
    return function (o, h) {
      let v = o.lastIndexOf("/"),
        m = null;
      v !== -1 && (m = o.slice(v + 1).trim(), o = o.slice(0, v).trim());
      let O = (() => {
        let S = Du(o),
          [y, k] = q0(r.theme, S),
          b = c($u(a() ?? {}, S) ?? null);
        if (typeof b == "string" && (b = b.replace("<alpha-value>", "1")), typeof y != "object") return typeof k != "object" && k & 4 ? b ?? y : y;
        if (b !== null && typeof b == "object" && !Array.isArray(b)) {
          let E = Ba({}, [b], (A, T) => T);
          if (y === null && Object.hasOwn(b, "__CSS_VALUES__")) {
            let A = {};
            for (let T in b.__CSS_VALUES__) A[T] = b[T], delete E[T];
            y = A;
          }
          for (let A in y) A !== "__CSS_VALUES__" && (b?.__CSS_VALUES__?.[A] & 4 && $u(E, A.split("-")) !== void 0 || (E[de(A)] = y[A]));
          return E;
        }
        if (Array.isArray(y) && Array.isArray(k) && Array.isArray(b)) {
          let E = y[0],
            A = y[1];
          k[0] & 4 && (E = b[0] ?? E);
          for (let T of Object.keys(A)) k[1][T] & 4 && (A[T] = b[1][T] ?? A[T]);
          return [E, A];
        }
        return y !== null && typeof y == "object" && !Array.isArray(y) && "DEFAULT" in y ? y.DEFAULT : y ?? b;
      })();
      return m && typeof O == "string" && (O = Dt(O, m)), O ?? h;
    };
  }
  function q0(r, a) {
    if (a.length === 1 && a[0].startsWith("--")) return [r.get([a[0]]), r.getOptions(a[0])];
    let c = Ha(a),
      o = new Map(),
      h = new be(() => new Map()),
      v = r.namespace(`--${c}`);
    if (v.size === 0) return [null, 0];
    let m = new Map();
    for (let [k, b] of v) {
      if (!k || !k.includes("--")) {
        o.set(k, b), m.set(k, r.getOptions(k ? `--${c}-${k}` : `--${c}`));
        continue;
      }
      let E = k.indexOf("--"),
        A = k.slice(0, E),
        T = k.slice(E + 2);
      T = T.replace(/-([a-z])/g, (R, H) => H.toUpperCase()), h.get(A === "" ? null : A).set(T, [b, r.getOptions(`--${c}${k}`)]);
    }
    let O = r.getOptions(`--${c}`);
    for (let [k, b] of h) {
      let E = o.get(k);
      if (typeof E != "string") continue;
      let A = {},
        T = {};
      for (let [R, [H, ne]] of b) A[R] = H, T[R] = ne;
      o.set(k, [E, A]), m.set(k, [O, T]);
    }
    let S = {},
      y = {};
    for (let [k, b] of o) Iu(S, [k ?? "DEFAULT"], b);
    for (let [k, b] of m) Iu(y, [k ?? "DEFAULT"], b);
    return a[a.length - 1] === "DEFAULT" ? [S?.DEFAULT ?? null, y.DEFAULT ?? 0] : "DEFAULT" in S && Object.keys(S).length === 1 ? [S.DEFAULT, y.DEFAULT ?? 0] : (S.__CSS_VALUES__ = y, [S, y]);
  }
  function $u(r, a) {
    for (let c = 0; c < a.length; ++c) {
      let o = a[c];
      if (r == null || typeof r != "object" || !Object.hasOwn(r, o)) {
        if (a[c + 1] === void 0) return;
        a[c + 1] = `${o}-${a[c + 1]}`;
        continue;
      }
      r = r[o];
    }
    return r;
  }
  function Iu(r, a, c) {
    for (let o of a.slice(0, -1)) r[o] === void 0 && (r[o] = {}), r = r[o];
    r[a[a.length - 1]] = c;
  }
  var Ru = /^[a-z@][a-zA-Z0-9/%._-]*$/;
  function Mu({
    designSystem: r,
    ast: a,
    resolvedConfig: c,
    featuresRef: o,
    referenceMode: h,
    src: v
  }) {
    let m = {
      addBase(O) {
        if (h) return;
        let S = Fn(O);
        o.current |= La(S, r);
        let y = tt("@layer", "base", S);
        De([y], k => {
          k.src = v;
        }), a.push(y);
      },
      addVariant(O, S) {
        if (!Eu.test(O)) throw new Error(`\`addVariant('${O}')\` defines an invalid variant name. Variants should only contain alphanumeric, dashes, or underscore characters and start with a lowercase letter or number.`);
        if (typeof S == "string") {
          if (S.includes(":merge(")) return;
        } else if (Array.isArray(S)) {
          if (S.some(k => k.includes(":merge("))) return;
        } else if (typeof S == "object") {
          let k = function (b, E) {
            return Object.entries(b).some(([A, T]) => A.includes(E) || typeof T == "object" && k(T, E));
          };
          var y = k;
          if (k(S, ":merge(")) return;
        }
        typeof S == "string" || Array.isArray(S) ? r.variants.static(O, k => {
          k.nodes = Pu(S, k.nodes);
        }, {
          compounds: Hi(typeof S == "string" ? [S] : S)
        }) : typeof S == "object" && r.variants.fromAst(O, Fn(S), r);
      },
      matchVariant(O, S, y) {
        function k(E, A, T) {
          let R = S(E, {
            modifier: A?.value ?? null
          });
          return Pu(R, T);
        }
        try {
          let E = S("a", {
            modifier: null
          });
          if (typeof E == "string" && E.includes(":merge(") || Array.isArray(E) && E.some(A => A.includes(":merge("))) return;
        } catch {}
        let b = Object.keys(y?.values ?? {});
        r.variants.group(() => {
          r.variants.functional(O, (E, A) => {
            if (!A.value) {
              if (y?.values && "DEFAULT" in y.values) {
                E.nodes = k(y.values.DEFAULT, A.modifier, E.nodes);
                return;
              }
              return null;
            }
            if (A.value.kind === "arbitrary") E.nodes = k(A.value.value, A.modifier, E.nodes);else if (A.value.kind === "named" && y?.values) {
              if (!Object.hasOwn(y.values, A.value.value)) return null;
              let T = y.values[A.value.value];
              if (typeof T != "string") return null;
              E.nodes = k(T, A.modifier, E.nodes);
            } else return null;
          });
        }, (E, A) => {
          if (E.kind !== "functional" || A.kind !== "functional") return 0;
          let T = E.value ? E.value.value : "DEFAULT",
            R = A.value ? A.value.value : "DEFAULT",
            H = (y?.values && Object.hasOwn(y.values, T) ? y.values[T] : void 0) ?? T,
            ne = (y?.values && Object.hasOwn(y.values, R) ? y.values[R] : void 0) ?? R;
          if (y && typeof y.sort == "function") return y.sort({
            value: H,
            modifier: E.modifier?.value ?? null
          }, {
            value: ne,
            modifier: A.modifier?.value ?? null
          });
          let B = b.indexOf(T),
            U = b.indexOf(R);
          return B = B === -1 ? b.length : B, U = U === -1 ? b.length : U, B !== U ? B - U : H < ne ? -1 : 1;
        }), r.variants.suggest(O, () => Object.keys(y?.values ?? {}).filter(E => E !== "DEFAULT"));
      },
      addUtilities(O) {
        O = Array.isArray(O) ? O : [O];
        let S = O.flatMap(k => Object.entries(k));
        S = S.flatMap(([k, b]) => ye(k, ",").map(E => [E.trim(), b]));
        let y = new be(() => []);
        for (let [k, b] of S) {
          if (k.startsWith("@keyframes ")) {
            if (!h) {
              let T = xt(k, Fn(b));
              De([T], R => {
                R.src = v;
              }), a.push(T);
            }
            continue;
          }
          let E = pe(k),
            A = !1;
          if (De(E, T => {
            if (T.kind === "selector" && T.value[0] === "." && Ru.test(T.value.slice(1))) {
              let R = T.value;
              T.value = "&";
              let H = x(E),
                ne = R.slice(1),
                B = H === "&" ? Fn(b) : [xt(H, Fn(b))];
              y.get(ne).push(...B), A = !0, T.value = R;
              return;
            }
            if (T.kind === "function" && (T.value === ":not" || T.value === ":nth-child" || T.value === ":nth-last-child")) return Ee.Skip;
          }), !A) throw new Error(`\`addUtilities({ '${k}' : \u2026 })\` defines an invalid utility selector. Utilities must be a single class name and start with a lowercase letter, eg. \`.scrollbar-none\`.`);
        }
        for (let [k, b] of y) r.theme.prefix && De(b, E => {
          if (E.kind === "rule") {
            let A = pe(E.selector);
            De(A, T => {
              T.kind === "selector" && T.value[0] === "." && (T.value = `.${r.theme.prefix}\\:${T.value.slice(1)}`);
            }), E.selector = x(A);
          }
        }), r.utilities.static(k, E => {
          let A = b.map(fn);
          return Lu(A, k, E.raw), o.current |= za(A, r), A;
        });
      },
      matchUtilities(O, S) {
        let y = S?.type ? Array.isArray(S?.type) ? S.type : [S.type] : ["any"];
        for (let [b, E] of Object.entries(O)) {
          let A = function ({
            negative: T
          }) {
            return R => {
              if (R.value?.kind === "arbitrary" && y.length > 0 && !y.includes("any") && (R.value.dataType && !y.includes(R.value.dataType) || !R.value.dataType && !pt(R.value.value, y))) return;
              let H = y.includes("color"),
                ne = null,
                B = !1;
              {
                let Ve = S?.values ?? {};
                H && (Ve = Object.assign({
                  inherit: "inherit",
                  transparent: "transparent",
                  current: "currentcolor"
                }, Ve)), R.value ? R.value.kind === "arbitrary" ? ne = R.value.value : R.value.fraction && Object.hasOwn(Ve, R.value.fraction) ? (ne = Ve[R.value.fraction], B = !0) : Object.hasOwn(Ve, R.value.value) ? ne = Ve[R.value.value] : Ve.__BARE_VALUE__ && (ne = Ve.__BARE_VALUE__(R.value) ?? null, B = (R.value.fraction !== null && ne?.includes("/")) ?? !1) : ne = Ve.DEFAULT ?? null;
              }
              if (ne === null) return;
              let U;
              {
                let Ve = S?.modifiers ?? null;
                R.modifier ? Ve === "any" || R.modifier.kind === "arbitrary" ? U = R.modifier.value : Ve && Object.hasOwn(Ve, R.modifier.value) ? U = Ve[R.modifier.value] : H && !Number.isNaN(Number(R.modifier.value)) ? U = `${R.modifier.value}%` : U = null : U = null;
              }
              if (R.modifier && U === null && !B) return R.value?.kind === "arbitrary" ? null : void 0;
              H && U !== null && (ne = Dt(ne, U)), T && (ne = `calc(${ne} * -1)`);
              let Oe = Fn(E(ne, {
                modifier: U
              }));
              return Lu(Oe, b, R.raw), o.current |= za(Oe, r), Oe;
            };
          };
          var k = A;
          if (!Ru.test(b)) throw new Error(`\`matchUtilities({ '${b}' : \u2026 })\` defines an invalid utility name. Utilities should be alphanumeric and start with a lowercase letter, eg. \`scrollbar\`.`);
          S?.supportsNegativeValues && r.utilities.functional(`-${b}`, A({
            negative: !0
          }), {
            types: y
          }), r.utilities.functional(b, A({
            negative: !1
          }), {
            types: y
          }), r.utilities.suggest(b, () => {
            let T = S?.values ?? {},
              R = new Set(Object.keys(T));
            R.delete("__BARE_VALUE__"), R.delete("__CSS_VALUES__"), R.has("DEFAULT") && (R.delete("DEFAULT"), R.add(null));
            let H = S?.modifiers ?? {},
              ne = H === "any" ? [] : Object.keys(H);
            return [{
              supportsNegative: S?.supportsNegativeValues ?? !1,
              values: Array.from(R),
              modifiers: ne
            }];
          });
        }
      },
      addComponents(O, S) {
        this.addUtilities(O, S);
      },
      matchComponents(O, S) {
        this.matchUtilities(O, S);
      },
      theme: Vu(r, () => c.theme ?? {}, O => O),
      prefix(O) {
        return O;
      },
      config(O, S) {
        let y = c;
        if (!O) return y;
        let k = Du(O);
        for (let b = 0; b < k.length; ++b) {
          let E = k[b];
          if (y[E] === void 0) return S;
          y = y[E];
        }
        return y ?? S;
      }
    };
    return m.addComponents = m.addComponents.bind(m), m.matchComponents = m.matchComponents.bind(m), m;
  }
  function Fn(r) {
    let a = [];
    r = Array.isArray(r) ? r : [r];
    let c = r.flatMap(o => Object.entries(o));
    for (let [o, h] of c) if (h != null && h !== !1) if (typeof h != "object") {
      if (!o.startsWith("--")) {
        if (h === "@slot") {
          a.push(xt(o, [tt("@slot")]));
          continue;
        }
        o = o.replace(/([A-Z])/g, "-$1").toLowerCase();
      }
      a.push(d(o, String(h)));
    } else if (Array.isArray(h)) for (let v of h) typeof v == "string" ? a.push(d(o, v)) : a.push(xt(o, Fn(v)));else a.push(xt(o, Fn(h)));
    return a;
  }
  function Pu(r, a) {
    return (typeof r == "string" ? [r] : r).flatMap(c => {
      if (c.trim().endsWith("}")) {
        let o = c.replace("}", "{@slot}}"),
          h = ae(o);
        return Nu(h, a), h;
      } else return xt(c, a);
    });
  }
  function Lu(r, a, c) {
    De(r, o => {
      if (o.kind === "rule") {
        let h = pe(o.selector);
        De(h, v => {
          v.kind === "selector" && v.value === `.${a}` && (v.value = `.${me(c)}`);
        }), o.selector = x(h);
      }
    });
  }
  function G0(r, a) {
    for (let c of Y0(a)) r.theme.addKeyframes(c);
  }
  function Y0(r) {
    let a = [];
    if ("keyframes" in r.theme) for (let [c, o] of Object.entries(r.theme.keyframes)) a.push(tt("@keyframes", c, Fn(o)));
    return a;
  }
  var Fu = {
    inherit: "inherit",
    current: "currentcolor",
    transparent: "transparent",
    black: "#000",
    white: "#fff",
    slate: {
      50: "oklch(98.4% 0.003 247.858)",
      100: "oklch(96.8% 0.007 247.896)",
      200: "oklch(92.9% 0.013 255.508)",
      300: "oklch(86.9% 0.022 252.894)",
      400: "oklch(70.4% 0.04 256.788)",
      500: "oklch(55.4% 0.046 257.417)",
      600: "oklch(44.6% 0.043 257.281)",
      700: "oklch(37.2% 0.044 257.287)",
      800: "oklch(27.9% 0.041 260.031)",
      900: "oklch(20.8% 0.042 265.755)",
      950: "oklch(12.9% 0.042 264.695)"
    },
    gray: {
      50: "oklch(98.5% 0.002 247.839)",
      100: "oklch(96.7% 0.003 264.542)",
      200: "oklch(92.8% 0.006 264.531)",
      300: "oklch(87.2% 0.01 258.338)",
      400: "oklch(70.7% 0.022 261.325)",
      500: "oklch(55.1% 0.027 264.364)",
      600: "oklch(44.6% 0.03 256.802)",
      700: "oklch(37.3% 0.034 259.733)",
      800: "oklch(27.8% 0.033 256.848)",
      900: "oklch(21% 0.034 264.665)",
      950: "oklch(13% 0.028 261.692)"
    },
    zinc: {
      50: "oklch(98.5% 0 none)",
      100: "oklch(96.7% 0.001 286.375)",
      200: "oklch(92% 0.004 286.32)",
      300: "oklch(87.1% 0.006 286.286)",
      400: "oklch(70.5% 0.015 286.067)",
      500: "oklch(55.2% 0.016 285.938)",
      600: "oklch(44.2% 0.017 285.786)",
      700: "oklch(37% 0.013 285.805)",
      800: "oklch(27.4% 0.006 286.033)",
      900: "oklch(21% 0.006 285.885)",
      950: "oklch(14.1% 0.005 285.823)"
    },
    neutral: {
      50: "oklch(98.5% 0 none)",
      100: "oklch(97% 0 none)",
      200: "oklch(92.2% 0 none)",
      300: "oklch(87% 0 none)",
      400: "oklch(70.8% 0 none)",
      500: "oklch(55.6% 0 none)",
      600: "oklch(43.9% 0 none)",
      700: "oklch(37.1% 0 none)",
      800: "oklch(26.9% 0 none)",
      900: "oklch(20.5% 0 none)",
      950: "oklch(14.5% 0 none)"
    },
    stone: {
      50: "oklch(98.5% 0.001 106.423)",
      100: "oklch(97% 0.001 106.424)",
      200: "oklch(92.3% 0.003 48.717)",
      300: "oklch(86.9% 0.005 56.366)",
      400: "oklch(70.9% 0.01 56.259)",
      500: "oklch(55.3% 0.013 58.071)",
      600: "oklch(44.4% 0.011 73.639)",
      700: "oklch(37.4% 0.01 67.558)",
      800: "oklch(26.8% 0.007 34.298)",
      900: "oklch(21.6% 0.006 56.043)",
      950: "oklch(14.7% 0.004 49.25)"
    },
    mauve: {
      50: "oklch(98.5% 0 none)",
      100: "oklch(96% 0.003 325.6)",
      200: "oklch(92.2% 0.005 325.62)",
      300: "oklch(86.5% 0.012 325.68)",
      400: "oklch(71.1% 0.019 323.02)",
      500: "oklch(54.2% 0.034 322.5)",
      600: "oklch(43.5% 0.029 321.78)",
      700: "oklch(36.4% 0.029 323.89)",
      800: "oklch(26.3% 0.024 320.12)",
      900: "oklch(21.2% 0.019 322.12)",
      950: "oklch(14.5% 0.008 326)"
    },
    olive: {
      50: "oklch(98.8% 0.003 106.5)",
      100: "oklch(96.6% 0.005 106.5)",
      200: "oklch(93% 0.007 106.5)",
      300: "oklch(88% 0.011 106.6)",
      400: "oklch(73.7% 0.021 106.9)",
      500: "oklch(58% 0.031 107.3)",
      600: "oklch(46.6% 0.025 107.3)",
      700: "oklch(39.4% 0.023 107.4)",
      800: "oklch(28.6% 0.016 107.4)",
      900: "oklch(22.8% 0.013 107.4)",
      950: "oklch(15.3% 0.006 107.1)"
    },
    mist: {
      50: "oklch(98.7% 0.002 197.1)",
      100: "oklch(96.3% 0.002 197.1)",
      200: "oklch(92.5% 0.005 214.3)",
      300: "oklch(87.2% 0.007 219.6)",
      400: "oklch(72.3% 0.014 214.4)",
      500: "oklch(56% 0.021 213.5)",
      600: "oklch(45% 0.017 213.2)",
      700: "oklch(37.8% 0.015 216)",
      800: "oklch(27.5% 0.011 216.9)",
      900: "oklch(21.8% 0.008 223.9)",
      950: "oklch(14.8% 0.004 228.8)"
    },
    taupe: {
      50: "oklch(98.6% 0.002 67.8)",
      100: "oklch(96% 0.002 17.2)",
      200: "oklch(92.2% 0.005 34.3)",
      300: "oklch(86.8% 0.007 39.5)",
      400: "oklch(71.4% 0.014 41.2)",
      500: "oklch(54.7% 0.021 43.1)",
      600: "oklch(43.8% 0.017 39.3)",
      700: "oklch(36.7% 0.016 35.7)",
      800: "oklch(26.8% 0.011 36.5)",
      900: "oklch(21.4% 0.009 43.1)",
      950: "oklch(14.7% 0.004 49.3)"
    },
    red: {
      50: "oklch(97.1% 0.013 17.38)",
      100: "oklch(93.6% 0.032 17.717)",
      200: "oklch(88.5% 0.062 18.334)",
      300: "oklch(80.8% 0.114 19.571)",
      400: "oklch(70.4% 0.191 22.216)",
      500: "oklch(63.7% 0.237 25.331)",
      600: "oklch(57.7% 0.245 27.325)",
      700: "oklch(50.5% 0.213 27.518)",
      800: "oklch(44.4% 0.177 26.899)",
      900: "oklch(39.6% 0.141 25.723)",
      950: "oklch(25.8% 0.092 26.042)"
    },
    orange: {
      50: "oklch(98% 0.016 73.684)",
      100: "oklch(95.4% 0.038 75.164)",
      200: "oklch(90.1% 0.076 70.697)",
      300: "oklch(83.7% 0.128 66.29)",
      400: "oklch(75% 0.183 55.934)",
      500: "oklch(70.5% 0.213 47.604)",
      600: "oklch(64.6% 0.222 41.116)",
      700: "oklch(55.3% 0.195 38.402)",
      800: "oklch(47% 0.157 37.304)",
      900: "oklch(40.8% 0.123 38.172)",
      950: "oklch(26.6% 0.079 36.259)"
    },
    amber: {
      50: "oklch(98.7% 0.022 95.277)",
      100: "oklch(96.2% 0.059 95.617)",
      200: "oklch(92.4% 0.12 95.746)",
      300: "oklch(87.9% 0.169 91.605)",
      400: "oklch(82.8% 0.189 84.429)",
      500: "oklch(76.9% 0.188 70.08)",
      600: "oklch(66.6% 0.179 58.318)",
      700: "oklch(55.5% 0.163 48.998)",
      800: "oklch(47.3% 0.137 46.201)",
      900: "oklch(41.4% 0.112 45.904)",
      950: "oklch(27.9% 0.077 45.635)"
    },
    yellow: {
      50: "oklch(98.7% 0.026 102.212)",
      100: "oklch(97.3% 0.071 103.193)",
      200: "oklch(94.5% 0.129 101.54)",
      300: "oklch(90.5% 0.182 98.111)",
      400: "oklch(85.2% 0.199 91.936)",
      500: "oklch(79.5% 0.184 86.047)",
      600: "oklch(68.1% 0.162 75.834)",
      700: "oklch(55.4% 0.135 66.442)",
      800: "oklch(47.6% 0.114 61.907)",
      900: "oklch(42.1% 0.095 57.708)",
      950: "oklch(28.6% 0.066 53.813)"
    },
    lime: {
      50: "oklch(98.6% 0.031 120.757)",
      100: "oklch(96.7% 0.067 122.328)",
      200: "oklch(93.8% 0.127 124.321)",
      300: "oklch(89.7% 0.196 126.665)",
      400: "oklch(84.1% 0.238 128.85)",
      500: "oklch(76.8% 0.233 130.85)",
      600: "oklch(64.8% 0.2 131.684)",
      700: "oklch(53.2% 0.157 131.589)",
      800: "oklch(45.3% 0.124 130.933)",
      900: "oklch(40.5% 0.101 131.063)",
      950: "oklch(27.4% 0.072 132.109)"
    },
    green: {
      50: "oklch(98.2% 0.018 155.826)",
      100: "oklch(96.2% 0.044 156.743)",
      200: "oklch(92.5% 0.084 155.995)",
      300: "oklch(87.1% 0.15 154.449)",
      400: "oklch(79.2% 0.209 151.711)",
      500: "oklch(72.3% 0.219 149.579)",
      600: "oklch(62.7% 0.194 149.214)",
      700: "oklch(52.7% 0.154 150.069)",
      800: "oklch(44.8% 0.119 151.328)",
      900: "oklch(39.3% 0.095 152.535)",
      950: "oklch(26.6% 0.065 152.934)"
    },
    emerald: {
      50: "oklch(97.9% 0.021 166.113)",
      100: "oklch(95% 0.052 163.051)",
      200: "oklch(90.5% 0.093 164.15)",
      300: "oklch(84.5% 0.143 164.978)",
      400: "oklch(76.5% 0.177 163.223)",
      500: "oklch(69.6% 0.17 162.48)",
      600: "oklch(59.6% 0.145 163.225)",
      700: "oklch(50.8% 0.118 165.612)",
      800: "oklch(43.2% 0.095 166.913)",
      900: "oklch(37.8% 0.077 168.94)",
      950: "oklch(26.2% 0.051 172.552)"
    },
    teal: {
      50: "oklch(98.4% 0.014 180.72)",
      100: "oklch(95.3% 0.051 180.801)",
      200: "oklch(91% 0.096 180.426)",
      300: "oklch(85.5% 0.138 181.071)",
      400: "oklch(77.7% 0.152 181.912)",
      500: "oklch(70.4% 0.14 182.503)",
      600: "oklch(60% 0.118 184.704)",
      700: "oklch(51.1% 0.096 186.391)",
      800: "oklch(43.7% 0.078 188.216)",
      900: "oklch(38.6% 0.063 188.416)",
      950: "oklch(27.7% 0.046 192.524)"
    },
    cyan: {
      50: "oklch(98.4% 0.019 200.873)",
      100: "oklch(95.6% 0.045 203.388)",
      200: "oklch(91.7% 0.08 205.041)",
      300: "oklch(86.5% 0.127 207.078)",
      400: "oklch(78.9% 0.154 211.53)",
      500: "oklch(71.5% 0.143 215.221)",
      600: "oklch(60.9% 0.126 221.723)",
      700: "oklch(52% 0.105 223.128)",
      800: "oklch(45% 0.085 224.283)",
      900: "oklch(39.8% 0.07 227.392)",
      950: "oklch(30.2% 0.056 229.695)"
    },
    sky: {
      50: "oklch(97.7% 0.013 236.62)",
      100: "oklch(95.1% 0.026 236.824)",
      200: "oklch(90.1% 0.058 230.902)",
      300: "oklch(82.8% 0.111 230.318)",
      400: "oklch(74.6% 0.16 232.661)",
      500: "oklch(68.5% 0.169 237.323)",
      600: "oklch(58.8% 0.158 241.966)",
      700: "oklch(50% 0.134 242.749)",
      800: "oklch(44.3% 0.11 240.79)",
      900: "oklch(39.1% 0.09 240.876)",
      950: "oklch(29.3% 0.066 243.157)"
    },
    blue: {
      50: "oklch(97% 0.014 254.604)",
      100: "oklch(93.2% 0.032 255.585)",
      200: "oklch(88.2% 0.059 254.128)",
      300: "oklch(80.9% 0.105 251.813)",
      400: "oklch(70.7% 0.165 254.624)",
      500: "oklch(62.3% 0.214 259.815)",
      600: "oklch(54.6% 0.245 262.881)",
      700: "oklch(48.8% 0.243 264.376)",
      800: "oklch(42.4% 0.199 265.638)",
      900: "oklch(37.9% 0.146 265.522)",
      950: "oklch(28.2% 0.091 267.935)"
    },
    indigo: {
      50: "oklch(96.2% 0.018 272.314)",
      100: "oklch(93% 0.034 272.788)",
      200: "oklch(87% 0.065 274.039)",
      300: "oklch(78.5% 0.115 274.713)",
      400: "oklch(67.3% 0.182 276.935)",
      500: "oklch(58.5% 0.233 277.117)",
      600: "oklch(51.1% 0.262 276.966)",
      700: "oklch(45.7% 0.24 277.023)",
      800: "oklch(39.8% 0.195 277.366)",
      900: "oklch(35.9% 0.144 278.697)",
      950: "oklch(25.7% 0.09 281.288)"
    },
    violet: {
      50: "oklch(96.9% 0.016 293.756)",
      100: "oklch(94.3% 0.029 294.588)",
      200: "oklch(89.4% 0.057 293.283)",
      300: "oklch(81.1% 0.111 293.571)",
      400: "oklch(70.2% 0.183 293.541)",
      500: "oklch(60.6% 0.25 292.717)",
      600: "oklch(54.1% 0.281 293.009)",
      700: "oklch(49.1% 0.27 292.581)",
      800: "oklch(43.2% 0.232 292.759)",
      900: "oklch(38% 0.189 293.745)",
      950: "oklch(28.3% 0.141 291.089)"
    },
    purple: {
      50: "oklch(97.7% 0.014 308.299)",
      100: "oklch(94.6% 0.033 307.174)",
      200: "oklch(90.2% 0.063 306.703)",
      300: "oklch(82.7% 0.119 306.383)",
      400: "oklch(71.4% 0.203 305.504)",
      500: "oklch(62.7% 0.265 303.9)",
      600: "oklch(55.8% 0.288 302.321)",
      700: "oklch(49.6% 0.265 301.924)",
      800: "oklch(43.8% 0.218 303.724)",
      900: "oklch(38.1% 0.176 304.987)",
      950: "oklch(29.1% 0.149 302.717)"
    },
    fuchsia: {
      50: "oklch(97.7% 0.017 320.058)",
      100: "oklch(95.2% 0.037 318.852)",
      200: "oklch(90.3% 0.076 319.62)",
      300: "oklch(83.3% 0.145 321.434)",
      400: "oklch(74% 0.238 322.16)",
      500: "oklch(66.7% 0.295 322.15)",
      600: "oklch(59.1% 0.293 322.896)",
      700: "oklch(51.8% 0.253 323.949)",
      800: "oklch(45.2% 0.211 324.591)",
      900: "oklch(40.1% 0.17 325.612)",
      950: "oklch(29.3% 0.136 325.661)"
    },
    pink: {
      50: "oklch(97.1% 0.014 343.198)",
      100: "oklch(94.8% 0.028 342.258)",
      200: "oklch(89.9% 0.061 343.231)",
      300: "oklch(82.3% 0.12 346.018)",
      400: "oklch(71.8% 0.202 349.761)",
      500: "oklch(65.6% 0.241 354.308)",
      600: "oklch(59.2% 0.249 0.584)",
      700: "oklch(52.5% 0.223 3.958)",
      800: "oklch(45.9% 0.187 3.815)",
      900: "oklch(40.8% 0.153 2.432)",
      950: "oklch(28.4% 0.109 3.907)"
    },
    rose: {
      50: "oklch(96.9% 0.015 12.422)",
      100: "oklch(94.1% 0.03 12.58)",
      200: "oklch(89.2% 0.058 10.001)",
      300: "oklch(81% 0.117 11.638)",
      400: "oklch(71.2% 0.194 13.428)",
      500: "oklch(64.5% 0.246 16.439)",
      600: "oklch(58.6% 0.253 17.585)",
      700: "oklch(51.4% 0.222 16.935)",
      800: "oklch(45.5% 0.188 13.697)",
      900: "oklch(41% 0.159 10.272)",
      950: "oklch(27.1% 0.105 12.094)"
    }
  };
  function Cr(r) {
    return {
      __BARE_VALUE__: r
    };
  }
  var En = Cr(r => {
      if (he(r.value)) return r.value;
    }),
    Ft = Cr(r => {
      if (he(r.value)) return `${r.value}%`;
    }),
    lr = Cr(r => {
      if (he(r.value)) return `${r.value}px`;
    }),
    Uu = Cr(r => {
      if (he(r.value)) return `${r.value}ms`;
    }),
    Jo = Cr(r => {
      if (he(r.value)) return `${r.value}deg`;
    }),
    J0 = Cr(r => {
      if (r.fraction === null) return;
      let [a, c] = ye(r.fraction, "/");
      if (!(!he(a) || !he(c))) return r.fraction;
    }),
    ju = Cr(r => {
      if (he(Number(r.value))) return `repeat(${r.value}, minmax(0, 1fr))`;
    }),
    Z0 = {
      accentColor: ({
        theme: r
      }) => r("colors"),
      animation: {
        none: "none",
        spin: "spin 1s linear infinite",
        ping: "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        bounce: "bounce 1s infinite"
      },
      aria: {
        busy: 'busy="true"',
        checked: 'checked="true"',
        disabled: 'disabled="true"',
        expanded: 'expanded="true"',
        hidden: 'hidden="true"',
        pressed: 'pressed="true"',
        readonly: 'readonly="true"',
        required: 'required="true"',
        selected: 'selected="true"'
      },
      aspectRatio: {
        auto: "auto",
        square: "1 / 1",
        video: "16 / 9",
        ...J0
      },
      backdropBlur: ({
        theme: r
      }) => r("blur"),
      backdropBrightness: ({
        theme: r
      }) => ({
        ...r("brightness"),
        ...Ft
      }),
      backdropContrast: ({
        theme: r
      }) => ({
        ...r("contrast"),
        ...Ft
      }),
      backdropGrayscale: ({
        theme: r
      }) => ({
        ...r("grayscale"),
        ...Ft
      }),
      backdropHueRotate: ({
        theme: r
      }) => ({
        ...r("hueRotate"),
        ...Jo
      }),
      backdropInvert: ({
        theme: r
      }) => ({
        ...r("invert"),
        ...Ft
      }),
      backdropOpacity: ({
        theme: r
      }) => ({
        ...r("opacity"),
        ...Ft
      }),
      backdropSaturate: ({
        theme: r
      }) => ({
        ...r("saturate"),
        ...Ft
      }),
      backdropSepia: ({
        theme: r
      }) => ({
        ...r("sepia"),
        ...Ft
      }),
      backgroundColor: ({
        theme: r
      }) => r("colors"),
      backgroundImage: {
        none: "none",
        "gradient-to-t": "linear-gradient(to top, var(--tw-gradient-stops))",
        "gradient-to-tr": "linear-gradient(to top right, var(--tw-gradient-stops))",
        "gradient-to-r": "linear-gradient(to right, var(--tw-gradient-stops))",
        "gradient-to-br": "linear-gradient(to bottom right, var(--tw-gradient-stops))",
        "gradient-to-b": "linear-gradient(to bottom, var(--tw-gradient-stops))",
        "gradient-to-bl": "linear-gradient(to bottom left, var(--tw-gradient-stops))",
        "gradient-to-l": "linear-gradient(to left, var(--tw-gradient-stops))",
        "gradient-to-tl": "linear-gradient(to top left, var(--tw-gradient-stops))"
      },
      backgroundOpacity: ({
        theme: r
      }) => r("opacity"),
      backgroundPosition: {
        bottom: "bottom",
        center: "center",
        left: "left",
        "left-bottom": "left bottom",
        "left-top": "left top",
        right: "right",
        "right-bottom": "right bottom",
        "right-top": "right top",
        top: "top"
      },
      backgroundSize: {
        auto: "auto",
        cover: "cover",
        contain: "contain"
      },
      blur: {
        0: "0",
        none: "",
        sm: "4px",
        DEFAULT: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
        "2xl": "40px",
        "3xl": "64px"
      },
      borderColor: ({
        theme: r
      }) => ({
        DEFAULT: "currentcolor",
        ...r("colors")
      }),
      borderOpacity: ({
        theme: r
      }) => r("opacity"),
      borderRadius: {
        none: "0px",
        sm: "0.125rem",
        DEFAULT: "0.25rem",
        md: "0.375rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        full: "9999px"
      },
      borderSpacing: ({
        theme: r
      }) => r("spacing"),
      borderWidth: {
        DEFAULT: "1px",
        0: "0px",
        2: "2px",
        4: "4px",
        8: "8px",
        ...lr
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        DEFAULT: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
        xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
        "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
        inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
        none: "none"
      },
      boxShadowColor: ({
        theme: r
      }) => r("colors"),
      brightness: {
        0: "0",
        50: ".5",
        75: ".75",
        90: ".9",
        95: ".95",
        100: "1",
        105: "1.05",
        110: "1.1",
        125: "1.25",
        150: "1.5",
        200: "2",
        ...Ft
      },
      caretColor: ({
        theme: r
      }) => r("colors"),
      colors: () => ({
        ...Fu
      }),
      columns: {
        auto: "auto",
        1: "1",
        2: "2",
        3: "3",
        4: "4",
        5: "5",
        6: "6",
        7: "7",
        8: "8",
        9: "9",
        10: "10",
        11: "11",
        12: "12",
        "3xs": "16rem",
        "2xs": "18rem",
        xs: "20rem",
        sm: "24rem",
        md: "28rem",
        lg: "32rem",
        xl: "36rem",
        "2xl": "42rem",
        "3xl": "48rem",
        "4xl": "56rem",
        "5xl": "64rem",
        "6xl": "72rem",
        "7xl": "80rem",
        ...En
      },
      container: {},
      content: {
        none: "none"
      },
      contrast: {
        0: "0",
        50: ".5",
        75: ".75",
        100: "1",
        125: "1.25",
        150: "1.5",
        200: "2",
        ...Ft
      },
      cursor: {
        auto: "auto",
        default: "default",
        pointer: "pointer",
        wait: "wait",
        text: "text",
        move: "move",
        help: "help",
        "not-allowed": "not-allowed",
        none: "none",
        "context-menu": "context-menu",
        progress: "progress",
        cell: "cell",
        crosshair: "crosshair",
        "vertical-text": "vertical-text",
        alias: "alias",
        copy: "copy",
        "no-drop": "no-drop",
        grab: "grab",
        grabbing: "grabbing",
        "all-scroll": "all-scroll",
        "col-resize": "col-resize",
        "row-resize": "row-resize",
        "n-resize": "n-resize",
        "e-resize": "e-resize",
        "s-resize": "s-resize",
        "w-resize": "w-resize",
        "ne-resize": "ne-resize",
        "nw-resize": "nw-resize",
        "se-resize": "se-resize",
        "sw-resize": "sw-resize",
        "ew-resize": "ew-resize",
        "ns-resize": "ns-resize",
        "nesw-resize": "nesw-resize",
        "nwse-resize": "nwse-resize",
        "zoom-in": "zoom-in",
        "zoom-out": "zoom-out"
      },
      divideColor: ({
        theme: r
      }) => r("borderColor"),
      divideOpacity: ({
        theme: r
      }) => r("borderOpacity"),
      divideWidth: ({
        theme: r
      }) => ({
        ...r("borderWidth"),
        ...lr
      }),
      dropShadow: {
        sm: "0 1px 1px rgb(0 0 0 / 0.05)",
        DEFAULT: ["0 1px 2px rgb(0 0 0 / 0.1)", "0 1px 1px rgb(0 0 0 / 0.06)"],
        md: ["0 4px 3px rgb(0 0 0 / 0.07)", "0 2px 2px rgb(0 0 0 / 0.06)"],
        lg: ["0 10px 8px rgb(0 0 0 / 0.04)", "0 4px 3px rgb(0 0 0 / 0.1)"],
        xl: ["0 20px 13px rgb(0 0 0 / 0.03)", "0 8px 5px rgb(0 0 0 / 0.08)"],
        "2xl": "0 25px 25px rgb(0 0 0 / 0.15)",
        none: "0 0 #0000"
      },
      fill: ({
        theme: r
      }) => r("colors"),
      flex: {
        1: "1 1 0%",
        auto: "1 1 auto",
        initial: "0 1 auto",
        none: "none"
      },
      flexBasis: ({
        theme: r
      }) => ({
        auto: "auto",
        "1/2": "50%",
        "1/3": "33.333333%",
        "2/3": "66.666667%",
        "1/4": "25%",
        "2/4": "50%",
        "3/4": "75%",
        "1/5": "20%",
        "2/5": "40%",
        "3/5": "60%",
        "4/5": "80%",
        "1/6": "16.666667%",
        "2/6": "33.333333%",
        "3/6": "50%",
        "4/6": "66.666667%",
        "5/6": "83.333333%",
        "1/12": "8.333333%",
        "2/12": "16.666667%",
        "3/12": "25%",
        "4/12": "33.333333%",
        "5/12": "41.666667%",
        "6/12": "50%",
        "7/12": "58.333333%",
        "8/12": "66.666667%",
        "9/12": "75%",
        "10/12": "83.333333%",
        "11/12": "91.666667%",
        full: "100%",
        ...r("spacing")
      }),
      flexGrow: {
        0: "0",
        DEFAULT: "1",
        ...En
      },
      flexShrink: {
        0: "0",
        DEFAULT: "1",
        ...En
      },
      fontFamily: {
        sans: ["-apple-system", "BlinkMacSystemFont", '"Segoe UI"', "Roboto", '"Helvetica Neue"', '"Noto Sans"', "Arial", "sans-serif", '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"', '"Noto Color Emoji"'],
        serif: ["ui-serif", "Georgia", "Cambria", '"Times New Roman"', "Times", "serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", '"Liberation Mono"', '"Courier New"', "monospace"]
      },
      fontSize: {
        xs: ["0.75rem", {
          lineHeight: "1rem"
        }],
        sm: ["0.875rem", {
          lineHeight: "1.25rem"
        }],
        base: ["1rem", {
          lineHeight: "1.5rem"
        }],
        lg: ["1.125rem", {
          lineHeight: "1.75rem"
        }],
        xl: ["1.25rem", {
          lineHeight: "1.75rem"
        }],
        "2xl": ["1.5rem", {
          lineHeight: "2rem"
        }],
        "3xl": ["1.875rem", {
          lineHeight: "2.25rem"
        }],
        "4xl": ["2.25rem", {
          lineHeight: "2.5rem"
        }],
        "5xl": ["3rem", {
          lineHeight: "1"
        }],
        "6xl": ["3.75rem", {
          lineHeight: "1"
        }],
        "7xl": ["4.5rem", {
          lineHeight: "1"
        }],
        "8xl": ["6rem", {
          lineHeight: "1"
        }],
        "9xl": ["8rem", {
          lineHeight: "1"
        }]
      },
      fontWeight: {
        thin: "100",
        extralight: "200",
        light: "300",
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
        extrabold: "800",
        black: "900"
      },
      gap: ({
        theme: r
      }) => r("spacing"),
      gradientColorStops: ({
        theme: r
      }) => r("colors"),
      gradientColorStopPositions: {
        "0%": "0%",
        "5%": "5%",
        "10%": "10%",
        "15%": "15%",
        "20%": "20%",
        "25%": "25%",
        "30%": "30%",
        "35%": "35%",
        "40%": "40%",
        "45%": "45%",
        "50%": "50%",
        "55%": "55%",
        "60%": "60%",
        "65%": "65%",
        "70%": "70%",
        "75%": "75%",
        "80%": "80%",
        "85%": "85%",
        "90%": "90%",
        "95%": "95%",
        "100%": "100%",
        ...Ft
      },
      grayscale: {
        0: "0",
        DEFAULT: "100%",
        ...Ft
      },
      gridAutoColumns: {
        auto: "auto",
        min: "min-content",
        max: "max-content",
        fr: "minmax(0, 1fr)"
      },
      gridAutoRows: {
        auto: "auto",
        min: "min-content",
        max: "max-content",
        fr: "minmax(0, 1fr)"
      },
      gridColumn: {
        auto: "auto",
        "span-1": "span 1 / span 1",
        "span-2": "span 2 / span 2",
        "span-3": "span 3 / span 3",
        "span-4": "span 4 / span 4",
        "span-5": "span 5 / span 5",
        "span-6": "span 6 / span 6",
        "span-7": "span 7 / span 7",
        "span-8": "span 8 / span 8",
        "span-9": "span 9 / span 9",
        "span-10": "span 10 / span 10",
        "span-11": "span 11 / span 11",
        "span-12": "span 12 / span 12",
        "span-full": "1 / -1"
      },
      gridColumnEnd: {
        auto: "auto",
        1: "1",
        2: "2",
        3: "3",
        4: "4",
        5: "5",
        6: "6",
        7: "7",
        8: "8",
        9: "9",
        10: "10",
        11: "11",
        12: "12",
        13: "13",
        ...En
      },
      gridColumnStart: {
        auto: "auto",
        1: "1",
        2: "2",
        3: "3",
        4: "4",
        5: "5",
        6: "6",
        7: "7",
        8: "8",
        9: "9",
        10: "10",
        11: "11",
        12: "12",
        13: "13",
        ...En
      },
      gridRow: {
        auto: "auto",
        "span-1": "span 1 / span 1",
        "span-2": "span 2 / span 2",
        "span-3": "span 3 / span 3",
        "span-4": "span 4 / span 4",
        "span-5": "span 5 / span 5",
        "span-6": "span 6 / span 6",
        "span-7": "span 7 / span 7",
        "span-8": "span 8 / span 8",
        "span-9": "span 9 / span 9",
        "span-10": "span 10 / span 10",
        "span-11": "span 11 / span 11",
        "span-12": "span 12 / span 12",
        "span-full": "1 / -1"
      },
      gridRowEnd: {
        auto: "auto",
        1: "1",
        2: "2",
        3: "3",
        4: "4",
        5: "5",
        6: "6",
        7: "7",
        8: "8",
        9: "9",
        10: "10",
        11: "11",
        12: "12",
        13: "13",
        ...En
      },
      gridRowStart: {
        auto: "auto",
        1: "1",
        2: "2",
        3: "3",
        4: "4",
        5: "5",
        6: "6",
        7: "7",
        8: "8",
        9: "9",
        10: "10",
        11: "11",
        12: "12",
        13: "13",
        ...En
      },
      gridTemplateColumns: {
        none: "none",
        subgrid: "subgrid",
        1: "repeat(1, minmax(0, 1fr))",
        2: "repeat(2, minmax(0, 1fr))",
        3: "repeat(3, minmax(0, 1fr))",
        4: "repeat(4, minmax(0, 1fr))",
        5: "repeat(5, minmax(0, 1fr))",
        6: "repeat(6, minmax(0, 1fr))",
        7: "repeat(7, minmax(0, 1fr))",
        8: "repeat(8, minmax(0, 1fr))",
        9: "repeat(9, minmax(0, 1fr))",
        10: "repeat(10, minmax(0, 1fr))",
        11: "repeat(11, minmax(0, 1fr))",
        12: "repeat(12, minmax(0, 1fr))",
        ...ju
      },
      gridTemplateRows: {
        none: "none",
        subgrid: "subgrid",
        1: "repeat(1, minmax(0, 1fr))",
        2: "repeat(2, minmax(0, 1fr))",
        3: "repeat(3, minmax(0, 1fr))",
        4: "repeat(4, minmax(0, 1fr))",
        5: "repeat(5, minmax(0, 1fr))",
        6: "repeat(6, minmax(0, 1fr))",
        7: "repeat(7, minmax(0, 1fr))",
        8: "repeat(8, minmax(0, 1fr))",
        9: "repeat(9, minmax(0, 1fr))",
        10: "repeat(10, minmax(0, 1fr))",
        11: "repeat(11, minmax(0, 1fr))",
        12: "repeat(12, minmax(0, 1fr))",
        ...ju
      },
      height: ({
        theme: r
      }) => ({
        auto: "auto",
        "1/2": "50%",
        "1/3": "33.333333%",
        "2/3": "66.666667%",
        "1/4": "25%",
        "2/4": "50%",
        "3/4": "75%",
        "1/5": "20%",
        "2/5": "40%",
        "3/5": "60%",
        "4/5": "80%",
        "1/6": "16.666667%",
        "2/6": "33.333333%",
        "3/6": "50%",
        "4/6": "66.666667%",
        "5/6": "83.333333%",
        full: "100%",
        screen: "100vh",
        svh: "100svh",
        lvh: "100lvh",
        dvh: "100dvh",
        min: "min-content",
        max: "max-content",
        fit: "fit-content",
        ...r("spacing")
      }),
      hueRotate: {
        0: "0deg",
        15: "15deg",
        30: "30deg",
        60: "60deg",
        90: "90deg",
        180: "180deg",
        ...Jo
      },
      inset: ({
        theme: r
      }) => ({
        auto: "auto",
        "1/2": "50%",
        "1/3": "33.333333%",
        "2/3": "66.666667%",
        "1/4": "25%",
        "2/4": "50%",
        "3/4": "75%",
        full: "100%",
        ...r("spacing")
      }),
      invert: {
        0: "0",
        DEFAULT: "100%",
        ...Ft
      },
      keyframes: {
        spin: {
          to: {
            transform: "rotate(360deg)"
          }
        },
        ping: {
          "75%, 100%": {
            transform: "scale(2)",
            opacity: "0"
          }
        },
        pulse: {
          "50%": {
            opacity: ".5"
          }
        },
        bounce: {
          "0%, 100%": {
            transform: "translateY(-25%)",
            animationTimingFunction: "cubic-bezier(0.8,0,1,1)"
          },
          "50%": {
            transform: "none",
            animationTimingFunction: "cubic-bezier(0,0,0.2,1)"
          }
        }
      },
      letterSpacing: {
        tighter: "-0.05em",
        tight: "-0.025em",
        normal: "0em",
        wide: "0.025em",
        wider: "0.05em",
        widest: "0.1em"
      },
      lineHeight: {
        none: "1",
        tight: "1.25",
        snug: "1.375",
        normal: "1.5",
        relaxed: "1.625",
        loose: "2",
        3: ".75rem",
        4: "1rem",
        5: "1.25rem",
        6: "1.5rem",
        7: "1.75rem",
        8: "2rem",
        9: "2.25rem",
        10: "2.5rem"
      },
      listStyleType: {
        none: "none",
        disc: "disc",
        decimal: "decimal"
      },
      listStyleImage: {
        none: "none"
      },
      margin: ({
        theme: r
      }) => ({
        auto: "auto",
        ...r("spacing")
      }),
      lineClamp: {
        1: "1",
        2: "2",
        3: "3",
        4: "4",
        5: "5",
        6: "6",
        ...En
      },
      maxHeight: ({
        theme: r
      }) => ({
        none: "none",
        full: "100%",
        screen: "100vh",
        svh: "100svh",
        lvh: "100lvh",
        dvh: "100dvh",
        min: "min-content",
        max: "max-content",
        fit: "fit-content",
        ...r("spacing")
      }),
      maxWidth: ({
        theme: r
      }) => ({
        none: "none",
        xs: "20rem",
        sm: "24rem",
        md: "28rem",
        lg: "32rem",
        xl: "36rem",
        "2xl": "42rem",
        "3xl": "48rem",
        "4xl": "56rem",
        "5xl": "64rem",
        "6xl": "72rem",
        "7xl": "80rem",
        full: "100%",
        min: "min-content",
        max: "max-content",
        fit: "fit-content",
        prose: "65ch",
        ...r("spacing")
      }),
      minHeight: ({
        theme: r
      }) => ({
        full: "100%",
        screen: "100vh",
        svh: "100svh",
        lvh: "100lvh",
        dvh: "100dvh",
        min: "min-content",
        max: "max-content",
        fit: "fit-content",
        ...r("spacing")
      }),
      minWidth: ({
        theme: r
      }) => ({
        full: "100%",
        min: "min-content",
        max: "max-content",
        fit: "fit-content",
        ...r("spacing")
      }),
      objectPosition: {
        bottom: "bottom",
        center: "center",
        left: "left",
        "left-bottom": "left bottom",
        "left-top": "left top",
        right: "right",
        "right-bottom": "right bottom",
        "right-top": "right top",
        top: "top"
      },
      opacity: {
        0: "0",
        5: "0.05",
        10: "0.1",
        15: "0.15",
        20: "0.2",
        25: "0.25",
        30: "0.3",
        35: "0.35",
        40: "0.4",
        45: "0.45",
        50: "0.5",
        55: "0.55",
        60: "0.6",
        65: "0.65",
        70: "0.7",
        75: "0.75",
        80: "0.8",
        85: "0.85",
        90: "0.9",
        95: "0.95",
        100: "1",
        ...Ft
      },
      order: {
        first: "-9999",
        last: "9999",
        none: "0",
        1: "1",
        2: "2",
        3: "3",
        4: "4",
        5: "5",
        6: "6",
        7: "7",
        8: "8",
        9: "9",
        10: "10",
        11: "11",
        12: "12",
        ...En
      },
      outlineColor: ({
        theme: r
      }) => r("colors"),
      outlineOffset: {
        0: "0px",
        1: "1px",
        2: "2px",
        4: "4px",
        8: "8px",
        ...lr
      },
      outlineWidth: {
        0: "0px",
        1: "1px",
        2: "2px",
        4: "4px",
        8: "8px",
        ...lr
      },
      padding: ({
        theme: r
      }) => r("spacing"),
      placeholderColor: ({
        theme: r
      }) => r("colors"),
      placeholderOpacity: ({
        theme: r
      }) => r("opacity"),
      ringColor: ({
        theme: r
      }) => ({
        DEFAULT: "currentcolor",
        ...r("colors")
      }),
      ringOffsetColor: ({
        theme: r
      }) => r("colors"),
      ringOffsetWidth: {
        0: "0px",
        1: "1px",
        2: "2px",
        4: "4px",
        8: "8px",
        ...lr
      },
      ringOpacity: ({
        theme: r
      }) => ({
        DEFAULT: "0.5",
        ...r("opacity")
      }),
      ringWidth: {
        DEFAULT: "3px",
        0: "0px",
        1: "1px",
        2: "2px",
        4: "4px",
        8: "8px",
        ...lr
      },
      rotate: {
        0: "0deg",
        1: "1deg",
        2: "2deg",
        3: "3deg",
        6: "6deg",
        12: "12deg",
        45: "45deg",
        90: "90deg",
        180: "180deg",
        ...Jo
      },
      saturate: {
        0: "0",
        50: ".5",
        100: "1",
        150: "1.5",
        200: "2",
        ...Ft
      },
      scale: {
        0: "0",
        50: ".5",
        75: ".75",
        90: ".9",
        95: ".95",
        100: "1",
        105: "1.05",
        110: "1.1",
        125: "1.25",
        150: "1.5",
        ...Ft
      },
      screens: {
        sm: "40rem",
        md: "48rem",
        lg: "64rem",
        xl: "80rem",
        "2xl": "96rem"
      },
      scrollMargin: ({
        theme: r
      }) => r("spacing"),
      scrollPadding: ({
        theme: r
      }) => r("spacing"),
      sepia: {
        0: "0",
        DEFAULT: "100%",
        ...Ft
      },
      skew: {
        0: "0deg",
        1: "1deg",
        2: "2deg",
        3: "3deg",
        6: "6deg",
        12: "12deg",
        ...Jo
      },
      space: ({
        theme: r
      }) => r("spacing"),
      spacing: {
        px: "1px",
        0: "0px",
        .5: "0.125rem",
        1: "0.25rem",
        1.5: "0.375rem",
        2: "0.5rem",
        2.5: "0.625rem",
        3: "0.75rem",
        3.5: "0.875rem",
        4: "1rem",
        5: "1.25rem",
        6: "1.5rem",
        7: "1.75rem",
        8: "2rem",
        9: "2.25rem",
        10: "2.5rem",
        11: "2.75rem",
        12: "3rem",
        14: "3.5rem",
        16: "4rem",
        20: "5rem",
        24: "6rem",
        28: "7rem",
        32: "8rem",
        36: "9rem",
        40: "10rem",
        44: "11rem",
        48: "12rem",
        52: "13rem",
        56: "14rem",
        60: "15rem",
        64: "16rem",
        72: "18rem",
        80: "20rem",
        96: "24rem"
      },
      stroke: ({
        theme: r
      }) => ({
        none: "none",
        ...r("colors")
      }),
      strokeWidth: {
        0: "0",
        1: "1",
        2: "2",
        ...En
      },
      supports: {},
      data: {},
      textColor: ({
        theme: r
      }) => r("colors"),
      textDecorationColor: ({
        theme: r
      }) => r("colors"),
      textDecorationThickness: {
        auto: "auto",
        "from-font": "from-font",
        0: "0px",
        1: "1px",
        2: "2px",
        4: "4px",
        8: "8px",
        ...lr
      },
      textIndent: ({
        theme: r
      }) => r("spacing"),
      textOpacity: ({
        theme: r
      }) => r("opacity"),
      textUnderlineOffset: {
        auto: "auto",
        0: "0px",
        1: "1px",
        2: "2px",
        4: "4px",
        8: "8px",
        ...lr
      },
      transformOrigin: {
        center: "center",
        top: "top",
        "top-right": "top right",
        right: "right",
        "bottom-right": "bottom right",
        bottom: "bottom",
        "bottom-left": "bottom left",
        left: "left",
        "top-left": "top left"
      },
      transitionDelay: {
        0: "0s",
        75: "75ms",
        100: "100ms",
        150: "150ms",
        200: "200ms",
        300: "300ms",
        500: "500ms",
        700: "700ms",
        1e3: "1000ms",
        ...Uu
      },
      transitionDuration: {
        DEFAULT: "150ms",
        0: "0s",
        75: "75ms",
        100: "100ms",
        150: "150ms",
        200: "200ms",
        300: "300ms",
        500: "500ms",
        700: "700ms",
        1e3: "1000ms",
        ...Uu
      },
      transitionProperty: {
        none: "none",
        all: "all",
        DEFAULT: "color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter",
        colors: "color, background-color, border-color, outline-color, text-decoration-color, fill, stroke",
        opacity: "opacity",
        shadow: "box-shadow",
        transform: "transform"
      },
      transitionTimingFunction: {
        DEFAULT: "cubic-bezier(0.4, 0, 0.2, 1)",
        linear: "linear",
        in: "cubic-bezier(0.4, 0, 1, 1)",
        out: "cubic-bezier(0, 0, 0.2, 1)",
        "in-out": "cubic-bezier(0.4, 0, 0.2, 1)"
      },
      translate: ({
        theme: r
      }) => ({
        "1/2": "50%",
        "1/3": "33.333333%",
        "2/3": "66.666667%",
        "1/4": "25%",
        "2/4": "50%",
        "3/4": "75%",
        full: "100%",
        ...r("spacing")
      }),
      size: ({
        theme: r
      }) => ({
        auto: "auto",
        "1/2": "50%",
        "1/3": "33.333333%",
        "2/3": "66.666667%",
        "1/4": "25%",
        "2/4": "50%",
        "3/4": "75%",
        "1/5": "20%",
        "2/5": "40%",
        "3/5": "60%",
        "4/5": "80%",
        "1/6": "16.666667%",
        "2/6": "33.333333%",
        "3/6": "50%",
        "4/6": "66.666667%",
        "5/6": "83.333333%",
        "1/12": "8.333333%",
        "2/12": "16.666667%",
        "3/12": "25%",
        "4/12": "33.333333%",
        "5/12": "41.666667%",
        "6/12": "50%",
        "7/12": "58.333333%",
        "8/12": "66.666667%",
        "9/12": "75%",
        "10/12": "83.333333%",
        "11/12": "91.666667%",
        full: "100%",
        min: "min-content",
        max: "max-content",
        fit: "fit-content",
        ...r("spacing")
      }),
      width: ({
        theme: r
      }) => ({
        auto: "auto",
        "1/2": "50%",
        "1/3": "33.333333%",
        "2/3": "66.666667%",
        "1/4": "25%",
        "2/4": "50%",
        "3/4": "75%",
        "1/5": "20%",
        "2/5": "40%",
        "3/5": "60%",
        "4/5": "80%",
        "1/6": "16.666667%",
        "2/6": "33.333333%",
        "3/6": "50%",
        "4/6": "66.666667%",
        "5/6": "83.333333%",
        "1/12": "8.333333%",
        "2/12": "16.666667%",
        "3/12": "25%",
        "4/12": "33.333333%",
        "5/12": "41.666667%",
        "6/12": "50%",
        "7/12": "58.333333%",
        "8/12": "66.666667%",
        "9/12": "75%",
        "10/12": "83.333333%",
        "11/12": "91.666667%",
        full: "100%",
        screen: "100vw",
        svw: "100svw",
        lvw: "100lvw",
        dvw: "100dvw",
        min: "min-content",
        max: "max-content",
        fit: "fit-content",
        ...r("spacing")
      }),
      willChange: {
        auto: "auto",
        scroll: "scroll-position",
        contents: "contents",
        transform: "transform"
      },
      zIndex: {
        auto: "auto",
        0: "0",
        10: "10",
        20: "20",
        30: "30",
        40: "40",
        50: "50",
        ...En
      }
    };
  function Q0(r) {
    return {
      theme: {
        ...Z0,
        colors: ({
          theme: a
        }) => a("color", {}),
        extend: {
          fontSize: ({
            theme: a
          }) => ({
            ...a("text", {})
          }),
          boxShadow: ({
            theme: a
          }) => ({
            ...a("shadow", {})
          }),
          animation: ({
            theme: a
          }) => ({
            ...a("animate", {})
          }),
          aspectRatio: ({
            theme: a
          }) => ({
            ...a("aspect", {})
          }),
          borderRadius: ({
            theme: a
          }) => ({
            ...a("radius", {})
          }),
          screens: ({
            theme: a
          }) => ({
            ...a("breakpoint", {})
          }),
          letterSpacing: ({
            theme: a
          }) => ({
            ...a("tracking", {})
          }),
          lineHeight: ({
            theme: a
          }) => ({
            ...a("leading", {})
          }),
          transitionDuration: {
            DEFAULT: r.get(["--default-transition-duration"]) ?? null
          },
          transitionTimingFunction: {
            DEFAULT: r.get(["--default-transition-timing-function"]) ?? null
          },
          maxWidth: ({
            theme: a
          }) => ({
            ...a("container", {})
          })
        }
      }
    };
  }
  var eg = {
    blocklist: [],
    future: {},
    experimental: {},
    prefix: "",
    important: !1,
    darkMode: null,
    theme: {},
    plugins: [],
    content: {
      files: []
    }
  };
  function zu(r, a) {
    let c = {
      design: r,
      configs: [],
      plugins: [],
      content: {
        files: []
      },
      theme: {},
      extend: {},
      result: structuredClone(eg)
    };
    for (let h of a) Ka(c, h);
    for (let h of c.configs) "darkMode" in h && h.darkMode !== void 0 && (c.result.darkMode = h.darkMode ?? null), "prefix" in h && h.prefix !== void 0 && (c.result.prefix = h.prefix ?? ""), "blocklist" in h && h.blocklist !== void 0 && (c.result.blocklist = h.blocklist ?? []), "important" in h && h.important !== void 0 && (c.result.important = h.important ?? !1);
    let o = ng(c);
    return {
      resolvedConfig: {
        ...c.result,
        content: c.content,
        theme: c.theme,
        plugins: c.plugins
      },
      replacedThemeKeys: o
    };
  }
  function tg(r, a) {
    if (Array.isArray(r) && Bi(r[0])) return r.concat(a);
    if (Array.isArray(a) && Bi(a[0]) && Bi(r)) return [r, ...a];
    if (Array.isArray(a)) return a;
  }
  function Ka(r, {
    config: a,
    base: c,
    path: o,
    reference: h,
    src: v
  }) {
    let m = [];
    for (let y of a.plugins ?? []) "__isOptionsFunction" in y ? m.push({
      ...y(),
      reference: h,
      src: v
    }) : "handler" in y ? m.push({
      ...y,
      reference: h,
      src: v
    }) : m.push({
      handler: y,
      reference: h,
      src: v
    });
    if (Array.isArray(a.presets) && a.presets.length === 0) throw new Error("Error in the config file/plugin/preset. An empty preset (`preset: []`) is not currently supported.");
    for (let y of a.presets ?? []) Ka(r, {
      path: o,
      base: c,
      config: y,
      reference: h,
      src: v
    });
    for (let y of m) r.plugins.push(y), y.config && Ka(r, {
      path: o,
      base: c,
      config: y.config,
      reference: !!y.reference,
      src: y.src ?? v
    });
    let O = a.content ?? [],
      S = Array.isArray(O) ? O : O.files;
    for (let y of S) r.content.files.push(typeof y == "object" ? y : {
      base: c,
      pattern: y
    });
    r.configs.push(a);
  }
  function ng(r) {
    let a = new Set(),
      c = Vu(r.design, () => r.theme, h),
      o = Object.assign(c, {
        theme: c,
        colors: Fu
      });
    function h(v) {
      return typeof v == "function" ? v(o) ?? null : v ?? null;
    }
    for (let v of r.configs) {
      let m = v.theme ?? {},
        O = m.extend ?? {};
      for (let S in m) S !== "extend" && a.add(S);
      Object.assign(r.theme, m);
      for (let S in O) r.extend[S] ??= [], r.extend[S].push(O[S]);
    }
    delete r.theme.extend;
    for (let v in r.extend) {
      let m = [r.theme[v], ...r.extend[v]];
      r.theme[v] = () => {
        let O = m.map(h);
        return Ba({}, O, tg);
      };
    }
    for (let v in r.theme) r.theme[v] = h(r.theme[v]);
    if (r.theme.screens && typeof r.theme.screens == "object") for (let v of Object.keys(r.theme.screens)) {
      let m = r.theme.screens[v];
      m && typeof m == "object" && ("raw" in m || "max" in m || "min" in m && (r.theme.screens[v] = m.min));
    }
    return a;
  }
  function rg(r, a) {
    let c = r.theme.container || {};
    if (typeof c != "object" || c === null) return;
    let o = ig(c, a);
    o.length !== 0 && a.utilities.static("container", () => o.map(fn));
  }
  function ig({
    center: r,
    padding: a,
    screens: c
  }, o) {
    let h = [],
      v = null;
    if (r && h.push(d("margin-inline", "auto")), (typeof a == "string" || typeof a == "object" && a !== null && "DEFAULT" in a) && h.push(d("padding-inline", typeof a == "string" ? a : a.DEFAULT)), typeof c == "object" && c !== null) {
      v = new Map();
      let m = Array.from(o.theme.namespace("--breakpoint").entries());
      if (m.sort((O, S) => Bo(O[1], S[1], "asc")), m.length > 0) {
        let [O] = m[0];
        h.push(tt("@media", `(width >= --theme(--breakpoint-${O}))`, [d("max-width", "none")]));
      }
      for (let [O, S] of Object.entries(c)) {
        if (typeof S == "object") if ("min" in S) S = S.min;else continue;
        v.set(O, tt("@media", `(width >= ${S})`, [d("max-width", S)]));
      }
    }
    if (typeof a == "object" && a !== null) {
      let m = Object.entries(a).filter(([O]) => O !== "DEFAULT").map(([O, S]) => [O, o.theme.resolveValue(O, ["--breakpoint"]), S]).filter(Boolean);
      m.sort((O, S) => Bo(O[1], S[1], "asc"));
      for (let [O,, S] of m) if (v && v.has(O)) v.get(O).nodes.push(d("padding-inline", S));else {
        if (v) continue;
        h.push(tt("@media", `(width >= theme(--breakpoint-${O}))`, [d("padding-inline", S)]));
      }
    }
    if (v) for (let [, m] of v) h.push(m);
    return h;
  }
  function og({
    addVariant: r,
    config: a
  }) {
    let c = a("darkMode", null),
      [o, h = ".dark"] = Array.isArray(c) ? c : [c];
    if (o === "variant") {
      let v;
      if (Array.isArray(h) || typeof h == "function" ? v = h : typeof h == "string" && (v = [h]), Array.isArray(v)) for (let m of v) m === ".dark" ? (o = !1, console.warn('When using `variant` for `darkMode`, you must provide a selector.\nExample: `darkMode: ["variant", ".your-selector &"]`')) : m.includes("&") || (o = !1, console.warn('When using `variant` for `darkMode`, your selector must contain `&`.\nExample `darkMode: ["variant", ".your-selector &"]`'));
      h = v;
    }
    o === null || (o === "selector" ? r("dark", `&:where(${h}, ${h} *)`) : o === "media" ? r("dark", "@media (prefers-color-scheme: dark)") : o === "variant" ? r("dark", h) : o === "class" && r("dark", `&:is(${h} *)`));
  }
  function sg(r) {
    for (let [c, o] of [["t", "top"], ["tr", "top right"], ["r", "right"], ["br", "bottom right"], ["b", "bottom"], ["bl", "bottom left"], ["l", "left"], ["tl", "top left"]]) r.utilities.suggest(`bg-gradient-to-${c}`, () => []), r.utilities.static(`bg-gradient-to-${c}`, () => [d("--tw-gradient-position", `to ${o} in oklab`), d("background-image", "linear-gradient(var(--tw-gradient-stops))")]);
    r.utilities.suggest("bg-left-top", () => []), r.utilities.static("bg-left-top", () => [d("background-position", "left top")]), r.utilities.suggest("bg-right-top", () => []), r.utilities.static("bg-right-top", () => [d("background-position", "right top")]), r.utilities.suggest("bg-left-bottom", () => []), r.utilities.static("bg-left-bottom", () => [d("background-position", "left bottom")]), r.utilities.suggest("bg-right-bottom", () => []), r.utilities.static("bg-right-bottom", () => [d("background-position", "right bottom")]), r.utilities.suggest("object-left-top", () => []), r.utilities.static("object-left-top", () => [d("object-position", "left top")]), r.utilities.suggest("object-right-top", () => []), r.utilities.static("object-right-top", () => [d("object-position", "right top")]), r.utilities.suggest("object-left-bottom", () => []), r.utilities.static("object-left-bottom", () => [d("object-position", "left bottom")]), r.utilities.suggest("object-right-bottom", () => []), r.utilities.static("object-right-bottom", () => [d("object-position", "right bottom")]), r.utilities.suggest("max-w-screen", () => []), r.utilities.functional("max-w-screen", c => {
      if (!c.value || c.value.kind === "arbitrary") return;
      let o = r.theme.resolve(c.value.value, ["--breakpoint"]);
      if (o) return [d("max-width", o)];
    }), r.utilities.suggest("overflow-ellipsis", () => []), r.utilities.static("overflow-ellipsis", () => [d("text-overflow", "ellipsis")]), r.utilities.suggest("decoration-slice", () => []), r.utilities.static("decoration-slice", () => [d("-webkit-box-decoration-break", "slice"), d("box-decoration-break", "slice")]), r.utilities.suggest("decoration-clone", () => []), r.utilities.static("decoration-clone", () => [d("-webkit-box-decoration-break", "clone"), d("box-decoration-break", "clone")]), r.utilities.suggest("flex-shrink", () => []), r.utilities.functional("flex-shrink", c => {
      if (!c.modifier) {
        if (!c.value) return [d("flex-shrink", "1")];
        if (c.value.kind === "arbitrary") return [d("flex-shrink", c.value.value)];
        if (he(c.value.value)) return [d("flex-shrink", c.value.value)];
      }
    }), r.utilities.suggest("flex-grow", () => []), r.utilities.functional("flex-grow", c => {
      if (!c.modifier) {
        if (!c.value) return [d("flex-grow", "1")];
        if (c.value.kind === "arbitrary") return [d("flex-grow", c.value.value)];
        if (he(c.value.value)) return [d("flex-grow", c.value.value)];
      }
    }), r.utilities.suggest("order-none", () => []), r.utilities.static("order-none", () => [d("order", "0")]), r.utilities.suggest("break-words", () => []), r.utilities.static("break-words", () => [d("overflow-wrap", "break-word")]);
    for (let [c, o] of [["start", "inset-inline-start"], ["end", "inset-inline-end"]]) {
      let h = function ({
        negative: v
      }) {
        return m => {
          if (m.value === null) return;
          if (m.value.kind === "arbitrary") {
            if (m.modifier) return;
            let S = m.value.value;
            return [d(o, v ? `calc(${S} * -1)` : S)];
          }
          let O = r.theme.resolve(m.value.fraction ?? m.value.value, ["--inset", "--spacing"]);
          if (O === null && m.value.fraction) {
            let [S, y] = ye(m.value.fraction, "/");
            if (!he(S) || !he(y)) return;
            O = `calc(${m.value.fraction} * 100%)`;
          }
          if (O === null && v) {
            let S = r.theme.resolve(null, ["--spacing"]);
            if (S && dn(m.value.value) && (O = `calc(${S} * -${m.value.value})`, O !== null)) return [d(o, O)];
          }
          if (O === null) {
            let S = r.theme.resolve(null, ["--spacing"]);
            S && dn(m.value.value) && (O = `calc(${S} * ${m.value.value})`);
          }
          if (O !== null) return [d(o, v ? `calc(${O} * -1)` : O)];
        };
      };
      var a = h;
      r.utilities.static(`${c}-auto`, () => [d(o, "auto")]), r.utilities.static(`${c}-full`, () => [d(o, "100%")]), r.utilities.static(`-${c}-full`, () => [d(o, "-100%")]), r.utilities.static(`${c}-px`, () => [d(o, "1px")]), r.utilities.static(`-${c}-px`, () => [d(o, "-1px")]), r.utilities.functional(`-${c}`, h({
        negative: !0
      })), r.utilities.functional(c, h({
        negative: !1
      }));
    }
  }
  function ag(r, a) {
    let c = r.theme.screens || {},
      o = a.variants.get("min")?.order ?? 0,
      h = [];
    for (let [m, O] of Object.entries(c)) {
      let S = function (A) {
        a.variants.static(m, T => {
          T.nodes = [tt("@media", E, T.nodes)];
        }, {
          order: A
        });
      };
      var v = S;
      let y = a.variants.get(m),
        k = a.theme.resolveValue(m, ["--breakpoint"]);
      if (y && k && !a.theme.hasDefault(`--breakpoint-${m}`)) continue;
      let b = !0;
      typeof O == "string" && (b = !1);
      let E = lg(O);
      b ? h.push(S) : S(o);
    }
    if (h.length !== 0) {
      for (let [, m] of a.variants.variants) m.order > o && (m.order += h.length);
      a.variants.compareFns = new Map(Array.from(a.variants.compareFns).map(([m, O]) => (m > o && (m += h.length), [m, O])));
      for (let [m, O] of h.entries()) O(o + m + 1);
    }
  }
  function lg(r) {
    return (Array.isArray(r) ? r : [r]).map(a => typeof a == "string" ? {
      min: a
    } : a && typeof a == "object" ? a : null).map(a => {
      if (a === null) return null;
      if ("raw" in a) return a.raw;
      let c = "";
      return a.max !== void 0 && (c += `${a.max} >= `), c += "width", a.min !== void 0 && (c += ` >= ${a.min}`), `(${c})`;
    }).filter(Boolean).join(", ");
  }
  function cg(r, a) {
    let c = r.theme.aria || {},
      o = r.theme.supports || {},
      h = r.theme.data || {};
    if (Object.keys(c).length > 0) {
      let v = a.variants.get("aria"),
        m = v?.applyFn,
        O = v?.compounds;
      a.variants.functional("aria", (S, y) => {
        let k = y.value;
        return k && k.kind === "named" && k.value in c ? m?.(S, {
          ...y,
          value: {
            kind: "arbitrary",
            value: c[k.value]
          }
        }) : m?.(S, y);
      }, {
        compounds: O
      });
    }
    if (Object.keys(o).length > 0) {
      let v = a.variants.get("supports"),
        m = v?.applyFn,
        O = v?.compounds;
      a.variants.functional("supports", (S, y) => {
        let k = y.value;
        return k && k.kind === "named" && k.value in o ? m?.(S, {
          ...y,
          value: {
            kind: "arbitrary",
            value: o[k.value]
          }
        }) : m?.(S, y);
      }, {
        compounds: O
      });
    }
    if (Object.keys(h).length > 0) {
      let v = a.variants.get("data"),
        m = v?.applyFn,
        O = v?.compounds;
      a.variants.functional("data", (S, y) => {
        let k = y.value;
        return k && k.kind === "named" && k.value in h ? m?.(S, {
          ...y,
          value: {
            kind: "arbitrary",
            value: h[k.value]
          }
        }) : m?.(S, y);
      }, {
        compounds: O
      });
    }
  }
  var ug = /^[a-z]+$/;
  async function fg({
    designSystem: r,
    base: a,
    ast: c,
    loadModule: o,
    sources: h
  }) {
    let v = 0,
      m = [],
      O = [];
    De(c, (b, E) => {
      if (b.kind !== "at-rule") return;
      let A = xa(E);
      if (b.name === "@plugin") {
        if (A.parent !== null) throw new Error("`@plugin` cannot be nested.");
        let T = b.params.slice(1, -1);
        if (T.length === 0) throw new Error("`@plugin` must have a path.");
        let R = {};
        for (let H of b.nodes ?? []) {
          if (H.kind !== "declaration") throw new Error(`Unexpected \`@plugin\` option:

${sr([H])}

\`@plugin\` options must be a flat list of declarations.`);
          if (H.value === void 0) continue;
          let ne = H.value,
            B = ye(ne, ",").map(U => {
              if (U = U.trim(), U === "null") return null;
              if (U === "true") return !0;
              if (U === "false") return !1;
              if (Number.isNaN(Number(U))) {
                if (U[0] === '"' && U[U.length - 1] === '"' || U[0] === "'" && U[U.length - 1] === "'") return U.slice(1, -1);
                if (U[0] === "{" && U[U.length - 1] === "}") throw new Error(`Unexpected \`@plugin\` option: Value of declaration \`${sr([H]).trim()}\` is not supported.

Using an object as a plugin option is currently only supported in JavaScript configuration files.`);
              } else return Number(U);
              return U;
            });
          R[H.property] = B.length === 1 ? B[0] : B;
        }
        return m.push([{
          id: T,
          base: A.context.base,
          reference: !!A.context.reference,
          src: b.src
        }, Object.keys(R).length > 0 ? R : null]), v |= 4, Ee.Replace([]);
      }
      if (b.name === "@config") {
        if (b.nodes.length > 0) throw new Error("`@config` cannot have a body.");
        if (A.parent !== null) throw new Error("`@config` cannot be nested.");
        return O.push({
          id: b.params.slice(1, -1),
          base: A.context.base,
          reference: !!A.context.reference,
          src: b.src
        }), v |= 4, Ee.Replace([]);
      }
    }), sg(r);
    let S = r.resolveThemeValue;
    if (r.resolveThemeValue = function (b, E) {
      return b.startsWith("--") ? S(b, E) : (v |= Hu({
        designSystem: r,
        base: a,
        ast: c,
        sources: h,
        configs: [],
        pluginDetails: []
      }), r.resolveThemeValue(b, E));
    }, !m.length && !O.length) return 0;
    let [y, k] = await Promise.all([Promise.all(O.map(async ({
      id: b,
      base: E,
      reference: A,
      src: T
    }) => {
      let R = await o(b, E, "config");
      return {
        path: b,
        base: R.base,
        config: R.module,
        reference: A,
        src: T
      };
    })), Promise.all(m.map(async ([{
      id: b,
      base: E,
      reference: A,
      src: T
    }, R]) => {
      let H = await o(b, E, "plugin");
      return {
        path: b,
        base: H.base,
        plugin: H.module,
        options: R,
        reference: A,
        src: T
      };
    }))]);
    return v |= Hu({
      designSystem: r,
      base: a,
      ast: c,
      sources: h,
      configs: y,
      pluginDetails: k
    }), v;
  }
  function Hu({
    designSystem: r,
    base: a,
    ast: c,
    sources: o,
    configs: h,
    pluginDetails: v
  }) {
    let m = 0,
      O = [...v.map(T => {
        if (!T.options) return {
          config: {
            plugins: [T.plugin]
          },
          base: T.base,
          reference: T.reference,
          src: T.src
        };
        if ("__isOptionsFunction" in T.plugin) return {
          config: {
            plugins: [T.plugin(T.options)]
          },
          base: T.base,
          reference: T.reference,
          src: T.src
        };
        throw new Error(`The plugin "${T.path}" does not accept options`);
      }), ...h],
      {
        resolvedConfig: S
      } = zu(r, [{
        config: Q0(r.theme),
        base: a,
        reference: !0,
        src: void 0
      }, ...O, {
        config: {
          plugins: [og]
        },
        base: a,
        reference: !0,
        src: void 0
      }]),
      {
        resolvedConfig: y,
        replacedThemeKeys: k
      } = zu(r, O),
      b = {
        designSystem: r,
        ast: c,
        resolvedConfig: S,
        featuresRef: {
          set current(T) {
            m |= T;
          }
        }
      },
      E = Mu({
        ...b,
        referenceMode: !1,
        src: void 0
      }),
      A = r.resolveThemeValue;
    r.resolveThemeValue = function (T, R) {
      if (T[0] === "-" && T[1] === "-") return A(T, R);
      let H = E.theme(T, void 0);
      if (Array.isArray(H) && H.length === 2) return H[0];
      if (Array.isArray(H)) return H.join(", ");
      if (typeof H == "object" && H !== null && "DEFAULT" in H) return H.DEFAULT;
      if (typeof H == "string") return H;
    };
    for (let {
      handler: T,
      reference: R,
      src: H
    } of S.plugins) {
      let ne = Mu({
        ...b,
        referenceMode: R ?? !1,
        src: H
      });
      T(ne);
    }
    if (j0(r, y, k), G0(r, y), cg(y, r), ag(y, r), rg(y, r), !r.theme.prefix && S.prefix) {
      if (S.prefix.endsWith("-") && (S.prefix = S.prefix.slice(0, -1), console.warn(`The prefix "${S.prefix}" is invalid. Prefixes must be lowercase ASCII letters (a-z) only and is written as a variant before all utilities. We have fixed up the prefix for you. Remove the trailing \`-\` to silence this warning.`)), !ug.test(S.prefix)) throw new Error(`The prefix "${S.prefix}" is invalid. Prefixes must be lowercase ASCII letters (a-z) only.`);
      r.theme.prefix = S.prefix;
    }
    if (!r.important && S.important === !0 && (r.important = !0), typeof S.important == "string") {
      let T = S.important;
      De(c, (R, H) => {
        if (R.kind !== "at-rule" || R.name !== "@tailwind" || R.params !== "utilities") return;
        let ne = xa(H);
        return ne.parent?.kind === "rule" && ne.parent.selector === T ? Ee.Stop : Ee.ReplaceStop(ot(T, [R]));
      });
    }
    for (let T of S.blocklist) r.invalidCandidates.add(T);
    for (let T of S.content.files) {
      if ("raw" in T) throw new Error(`Error in the config file/plugin/preset. The \`content\` key contains a \`raw\` entry:

${JSON.stringify(T, null, 2)}

This feature is not currently supported.`);
      let R = !1;
      T.pattern[0] == "!" && (R = !0, T.pattern = T.pattern.slice(1)), o.push({
        ...T,
        negated: R
      });
    }
    return m;
  }
  function dg({
    ast: r
  }) {
    let a = new be(h => Ae(h.code)),
      c = new be(h => ({
        url: h.file,
        content: h.code,
        ignore: !1
      })),
      o = {
        file: null,
        sources: [],
        mappings: []
      };
    De(r, h => {
      if (!h.src || !h.dst) return;
      let v = c.get(h.src[0]);
      if (!v.content) return;
      let m = a.get(h.src[0]),
        O = a.get(h.dst[0]),
        S = v.content.slice(h.src[1], h.src[2]),
        y = 0;
      for (let E of S.split(`
`)) {
        if (E.trim() !== "") {
          let A = m.find(h.src[1] + y),
            T = O.find(h.dst[1]);
          o.mappings.push({
            name: null,
            originalPosition: {
              source: v,
              ...A
            },
            generatedPosition: T
          });
        }
        y += E.length, y += 1;
      }
      let k = m.find(h.src[2]),
        b = O.find(h.dst[2]);
      o.mappings.push({
        name: null,
        originalPosition: {
          source: v,
          ...k
        },
        generatedPosition: b
      });
    });
    for (let h of a.keys()) o.sources.push(c.get(h));
    return o.mappings.sort((h, v) => h.generatedPosition.line - v.generatedPosition.line || h.generatedPosition.column - v.generatedPosition.column || (h.originalPosition?.line ?? 0) - (v.originalPosition?.line ?? 0) || (h.originalPosition?.column ?? 0) - (v.originalPosition?.column ?? 0)), o;
  }
  var Bu = /^(-?\d+)\.\.(-?\d+)(?:\.\.(-?\d+))?$/;
  function Wa(r) {
    let a = r.indexOf("{");
    if (a === -1) return [r];
    let c = [],
      o = r.slice(0, a),
      h = r.slice(a),
      v = 0,
      m = h.lastIndexOf("}");
    for (let b = 0; b < h.length; b++) {
      let E = h[b];
      if (E === "{") v++;else if (E === "}" && (v--, v === 0)) {
        m = b;
        break;
      }
    }
    if (m === -1) throw new Error(`The pattern \`${r}\` is not balanced.`);
    let O = h.slice(1, m),
      S = h.slice(m + 1),
      y;
    pg(O) ? y = hg(O) : y = ye(O, ","), y = y.flatMap(b => Wa(b));
    let k = Wa(S);
    for (let b of k) for (let E of y) c.push(o + E + b);
    return c;
  }
  function pg(r) {
    return Bu.test(r);
  }
  function hg(r) {
    let a = r.match(Bu);
    if (!a) return [r];
    let [, c, o, h] = a,
      v = h ? parseInt(h, 10) : void 0,
      m = [];
    if (/^-?\d+$/.test(c) && /^-?\d+$/.test(o)) {
      let O = parseInt(c, 10),
        S = parseInt(o, 10);
      if (v === void 0 && (v = O <= S ? 1 : -1), v === 0) throw new Error("Step cannot be zero in sequence expansion.");
      let y = O < S;
      y && v < 0 && (v = -v), !y && v > 0 && (v = -v);
      for (let k = O; y ? k <= S : k >= S; k += v) m.push(k.toString());
    }
    return m;
  }
  function mg(r, a) {
    let c = new Set(),
      o = new Set(),
      h = [];
    function v(m, O = []) {
      if (r.has(m) && !c.has(m)) {
        o.has(m) && a.onCircularDependency?.(O, m), o.add(m);
        for (let S of r.get(m) ?? []) O.push(m), v(S, O), O.pop();
        c.add(m), o.delete(m), h.push(m);
      }
    }
    for (let m of r.keys()) v(m);
    return h;
  }
  var gg = /^[a-z]+$/;
  function vg() {
    throw new Error("No `loadModule` function provided to `compile`");
  }
  function bg() {
    throw new Error("No `loadStylesheet` function provided to `compile`");
  }
  function yg(r) {
    let a = 0,
      c = null;
    for (let o of ye(r, " ")) o === "reference" ? a |= 2 : o === "inline" ? a |= 1 : o === "default" ? a |= 4 : o === "static" ? a |= 8 : o.startsWith("prefix(") && o.endsWith(")") && (c = o.slice(7, -1));
    return [a, c];
  }
  async function wg(r, {
    base: a = "",
    from: c,
    loadModule: o = vg,
    loadStylesheet: h = bg
  } = {}) {
    let v = 0;
    r = [Sr({
      base: a
    }, r)], v |= await Cu(r, a, h, 0, c !== void 0);
    let m = null,
      O = new Ne(),
      S = new Map(),
      y = new Map(),
      k = [],
      b = null,
      E = null,
      A = [],
      T = [],
      R = [],
      H = [],
      ne = null;
    De(r, (U, Oe) => {
      if (U.kind !== "at-rule") return;
      let Ve = xa(Oe);
      if (U.name === "@tailwind" && (U.params === "utilities" || U.params.startsWith("utilities"))) {
        if (E !== null) return Ee.Replace([]);
        if (Ve.context.reference) return Ee.Replace([]);
        let Ie = ye(U.params, " ");
        for (let Se of Ie) if (Se.startsWith("source(")) {
          let ge = Se.slice(7, -1);
          if (ge === "none") {
            ne = ge;
            continue;
          }
          if (ge[0] === '"' && ge[ge.length - 1] !== '"' || ge[0] === "'" && ge[ge.length - 1] !== "'" || ge[0] !== "'" && ge[0] !== '"') throw new Error("`source(\u2026)` paths must be quoted.");
          ne = {
            base: Ve.context.sourceBase ?? Ve.context.base,
            pattern: ge.slice(1, -1)
          };
        }
        E = U, v |= 16;
      }
      if (U.name === "@utility") {
        if (Ve.parent !== null) throw new Error("`@utility` cannot be nested.");
        if (U.nodes.length === 0) throw new Error(`\`@utility ${U.params}\` is empty. Utilities should include at least one property.`);
        let Ie = u0(U);
        if (Ie === null) {
          if (!U.params.endsWith("-*")) {
            if (U.params.endsWith("*")) throw new Error(`\`@utility ${U.params}\` defines an invalid utility name. A functional utility must end in \`-*\`.`);
            if (U.params.includes("*")) throw new Error(`\`@utility ${U.params}\` defines an invalid utility name. The dynamic portion marked by \`-*\` must appear once at the end.`);
          }
          throw new Error(`\`@utility ${U.params}\` defines an invalid utility name. Utilities should be alphanumeric and start with a lowercase letter.`);
        }
        k.push(Ie);
      }
      if (U.name === "@source") {
        if (U.nodes.length > 0) throw new Error("`@source` cannot have a body.");
        if (Ve.parent !== null) throw new Error("`@source` cannot be nested.");
        let Ie = !1,
          Se = !1,
          ge = U.params;
        if (ge[0] === "n" && ge.startsWith("not ") && (Ie = !0, ge = ge.slice(4)), ge[0] === "i" && ge.startsWith("inline(") && (Se = !0, ge = ge.slice(7, -1).trim()), ge[0] === '"' && ge[ge.length - 1] !== '"' || ge[0] === "'" && ge[ge.length - 1] !== "'" || ge[0] !== "'" && ge[0] !== '"') throw new Error("`@source` paths must be quoted.");
        let Le = ge.slice(1, -1);
        if (Se) {
          let ze = Ie ? H : R,
            Fe = ye(Le, " ");
          for (let At of Fe) for (let Gt of Wa(At)) ze.push(Gt);
        } else T.push({
          base: Ve.context.base,
          pattern: Le,
          negated: Ie
        });
        return Ee.ReplaceSkip([]);
      }
      if (U.name === "@variant" && (Ve.parent === null ? U.nodes.length === 0 ? U.name = "@custom-variant" : (De(U.nodes, Ie => {
        if (Ie.kind === "at-rule" && Ie.name === "@slot") return U.name = "@custom-variant", Ee.Stop;
      }), U.name === "@variant" && A.push(U)) : A.push(U)), U.name === "@custom-variant") {
        if (Ve.parent !== null) throw new Error("`@custom-variant` cannot be nested.");
        let [Ie, Se] = ye(U.params, " ");
        if (!Eu.test(Ie)) throw new Error(`\`@custom-variant ${Ie}\` defines an invalid variant name. Variants should only contain alphanumeric, dashes, or underscore characters and start with a lowercase letter or number.`);
        if (U.nodes.length > 0 && Se) throw new Error(`\`@custom-variant ${Ie}\` cannot have both a selector and a body.`);
        if (U.nodes.length === 0) {
          if (!Se) throw new Error(`\`@custom-variant ${Ie}\` has no selector or body.`);
          let ge = ye(Se.slice(1, -1), ",");
          if (ge.length === 0 || ge.some(Fe => Fe.trim() === "")) throw new Error(`\`@custom-variant ${Ie} (${ge.join(",")})\` selector is invalid.`);
          let Le = [],
            ze = [];
          for (let Fe of ge) Fe = Fe.trim(), Fe[0] === "@" ? Le.push(Fe) : ze.push(Fe);
          S.set(Ie, Fe => {
            Fe.variants.static(Ie, At => {
              let Gt = [];
              ze.length > 0 && Gt.push(ot(ze.join(", "), At.nodes));
              for (let f of Le) Gt.push(xt(f, At.nodes));
              At.nodes = Gt;
            }, {
              compounds: Hi([...ze, ...Le])
            });
          }), y.set(Ie, new Set());
        } else {
          let ge = new Set();
          De(U.nodes, Le => {
            Le.kind === "at-rule" && Le.name === "@variant" && ge.add(Le.params);
          }), S.set(Ie, Le => {
            Le.variants.fromAst(Ie, U.nodes, Le);
          }), y.set(Ie, ge);
        }
        return Ee.ReplaceSkip([]);
      }
      if (U.name === "@media") {
        let Ie = ye(U.params, " "),
          Se = [];
        for (let ge of Ie) if (ge.startsWith("source(")) {
          let Le = ge.slice(7, -1);
          De(U.nodes, ze => {
            if (ze.kind === "at-rule" && ze.name === "@tailwind" && ze.params === "utilities") return ze.params += ` source(${Le})`, Ee.ReplaceStop([Sr({
              sourceBase: Ve.context.base
            }, [ze])]);
          });
        } else if (ge.startsWith("theme(")) {
          let Le = ge.slice(6, -1),
            ze = Le.includes("reference");
          De(U.nodes, Fe => {
            if (Fe.kind !== "context") {
              if (Fe.kind !== "at-rule") {
                if (ze) throw new Error('Files imported with `@import "\u2026" theme(reference)` must only contain `@theme` blocks.\nUse `@reference "\u2026";` instead.');
                return Ee.Continue;
              }
              if (Fe.name === "@theme") return Fe.params += " " + Le, Ee.Skip;
            }
          });
        } else if (ge.startsWith("prefix(")) {
          let Le = ge.slice(7, -1);
          De(U.nodes, ze => {
            if (ze.kind === "at-rule" && ze.name === "@theme") return ze.params += ` prefix(${Le})`, Ee.Skip;
          });
        } else ge === "important" ? m = !0 : ge === "reference" ? U.nodes = [Sr({
          reference: !0
        }, U.nodes)] : Se.push(ge);
        if (Se.length > 0) U.params = Se.join(" ");else if (Ie.length > 0) return Ee.Replace(U.nodes);
        return Ee.Continue;
      }
      if (U.name === "@theme") {
        let [Ie, Se] = yg(U.params);
        if (v |= 64, Ve.context.reference && (Ie |= 2), Se) {
          if (!gg.test(Se)) throw new Error(`The prefix "${Se}" is invalid. Prefixes must be lowercase ASCII letters (a-z) only.`);
          O.prefix = Se;
        }
        return De(U.nodes, ge => {
          if (ge.kind === "at-rule" && ge.name === "@keyframes") return O.addKeyframes(ge), Ee.Skip;
          if (ge.kind === "comment") return;
          if (ge.kind === "declaration" && ge.property.startsWith("--")) {
            O.add(de(ge.property), ge.value ?? "", Ie, ge.src);
            return;
          }
          let Le = sr([tt(U.name, U.params, [ge])]).split(`
`).map((ze, Fe, At) => `${Fe === 0 || Fe >= At.length - 2 ? " " : ">"} ${ze}`).join(`
`);
          throw new Error(`\`@theme\` blocks must only contain custom properties or \`@keyframes\`.

${Le}`);
        }), b ? Ee.ReplaceSkip([]) : (b = ot(":root, :host", []), b.src = U.src, Ee.ReplaceSkip(b));
      }
    });
    let B = I0(O, E?.src);
    if (m && (B.important = m), H.length > 0) for (let U of H) B.invalidCandidates.add(U);
    v |= await fg({
      designSystem: B,
      base: a,
      ast: r,
      loadModule: o,
      sources: T
    });
    for (let U of S.keys()) B.variants.static(U, () => {});
    for (let U of mg(y, {
      onCircularDependency(Oe, Ve) {
        let Ie = sr(Oe.map((Se, ge) => tt("@custom-variant", Se, [tt("@variant", Oe[ge + 1] ?? Ve, [])]))).replaceAll(";", " { \u2026 }").replace(`@custom-variant ${Ve} {`, `@custom-variant ${Ve} { /* \u2190 */`);
        throw new Error(`Circular dependency detected in custom variants:

${Ie}`);
      }
    })) S.get(U)?.(B);
    for (let U of k) U(B);
    if (b) {
      let U = [];
      for (let [Ve, Ie] of B.theme.entries()) {
        if (Ie.options & 2) continue;
        let Se = d(me(Ve), Ie.value);
        Se.src = Ie.src, U.push(Se);
      }
      let Oe = B.theme.getKeyframes();
      for (let Ve of Oe) r.push(Sr({
        theme: !0
      }, [We([Ve])]));
      b.nodes = [Sr({
        theme: !0
      }, U)];
    }
    if (v |= Ua(r, B), v |= La(r, B), v |= za(r, B), E) {
      let U = E;
      U.kind = "context", U.context = {};
    }
    return De(r, U => {
      if (U.kind === "at-rule") return U.name === "@utility" ? Ee.Replace([]) : Ee.Skip;
    }), {
      designSystem: B,
      ast: r,
      sources: T,
      root: ne,
      utilitiesNode: E,
      features: v,
      inlineCandidates: R
    };
  }
  async function kg(r, a = {}) {
    let {
      designSystem: c,
      ast: o,
      sources: h,
      root: v,
      utilitiesNode: m,
      features: O,
      inlineCandidates: S
    } = await wg(r, a);
    o.unshift(nu(`! tailwindcss v${e} | MIT License | https://tailwindcss.com `));
    function y(T) {
      c.invalidCandidates.add(T);
    }
    let k = new Set(),
      b = null,
      E = 0,
      A = !1;
    for (let T of S) c.invalidCandidates.has(T) || (k.add(T), A = !0);
    return {
      sources: h,
      root: v,
      features: O,
      build(T) {
        if (O === 0) return r;
        if (!m) return b ??= ji(o, c, a.polyfills), b;
        let R = A,
          H = !1;
        A = !1;
        let ne = k.size;
        for (let U of T) if (!c.invalidCandidates.has(U)) if (U[0] === "-" && U[1] === "-") {
          let Oe = c.theme.markUsedVariable(U);
          R ||= Oe, H ||= Oe;
        } else k.add(U), R ||= k.size !== ne;
        if (!R) return b ??= ji(o, c, a.polyfills), b;
        let B = Yo(k, c, {
          onInvalidCandidate: y
        }).astNodes;
        return a.from && De(B, U => {
          U.src ??= m.src;
        }), !H && E === B.length ? (b ??= ji(o, c, a.polyfills), b) : (E = B.length, m.nodes = B, b = ji(o, c, a.polyfills), b);
      }
    };
  }
  async function Eg(r, a = {}) {
    let c = ae(r, {
        from: a.from
      }),
      o = await kg(c, a),
      h = c,
      v = r;
    return {
      ...o,
      build(m) {
        let O = o.build(m);
        return O === h || (v = sr(O, !!a.from), h = O), v;
      },
      buildSourceMap() {
        return dg({
          ast: h
        });
      }
    };
  }
  var _g = `@layer theme, base, components, utilities;

@import './theme.css' layer(theme);
@import './preflight.css' layer(base);
@import './utilities.css' layer(utilities);
`,
    Ng = `/*
  1. Prevent padding and border from affecting element width. (https://github.com/mozdevs/cssremedy/issues/4)
  2. Remove default margins and padding
  3. Reset all borders.
*/

*,
::after,
::before,
::backdrop,
::file-selector-button {
  box-sizing: border-box; /* 1 */
  margin: 0; /* 2 */
  padding: 0; /* 2 */
  border: 0 solid; /* 3 */
}

/*
  1. Use a consistent sensible line-height in all browsers.
  2. Prevent adjustments of font size after orientation changes in iOS.
  3. Use a more readable tab size.
  4. Use the user's configured \`sans\` font-family by default.
  5. Use the user's configured \`sans\` font-feature-settings by default.
  6. Use the user's configured \`sans\` font-variation-settings by default.
  7. Disable tap highlights on iOS.
*/

html,
:host {
  line-height: 1.5; /* 1 */
  -webkit-text-size-adjust: 100%; /* 2 */
  tab-size: 4; /* 3 */
  font-family: --theme(
    --default-font-family,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    'Noto Sans',
    Arial,
    sans-serif,
    'Apple Color Emoji',
    'Segoe UI Emoji',
    'Segoe UI Symbol',
    'Noto Color Emoji'
  ); /* 4 */
  font-feature-settings: --theme(--default-font-feature-settings, normal); /* 5 */
  font-variation-settings: --theme(--default-font-variation-settings, normal); /* 6 */
  -webkit-tap-highlight-color: transparent; /* 7 */
}

/*
  1. Add the correct height in Firefox.
  2. Correct the inheritance of border color in Firefox. (https://bugzilla.mozilla.org/show_bug.cgi?id=190655)
  3. Reset the default border style to a 1px solid border.
*/

hr {
  height: 0; /* 1 */
  color: inherit; /* 2 */
  border-top-width: 1px; /* 3 */
}

/*
  Add the correct text decoration in Chrome, Edge, and Safari.
*/

abbr:where([title]) {
  -webkit-text-decoration: underline dotted;
  text-decoration: underline dotted;
}

/*
  Remove the default font size and weight for headings.
*/

h1,
h2,
h3,
h4,
h5,
h6 {
  font-size: inherit;
  font-weight: inherit;
}

/*
  Reset links to optimize for opt-in styling instead of opt-out.
*/

a {
  color: inherit;
  -webkit-text-decoration: inherit;
  text-decoration: inherit;
}

/*
  Add the correct font weight in Edge and Safari.
*/

b,
strong {
  font-weight: bolder;
}

/*
  1. Use the user's configured \`mono\` font-family by default.
  2. Use the user's configured \`mono\` font-feature-settings by default.
  3. Use the user's configured \`mono\` font-variation-settings by default.
  4. Correct the odd \`em\` font sizing in all browsers.
*/

code,
kbd,
samp,
pre {
  font-family: --theme(
    --default-mono-font-family,
    ui-monospace,
    SFMono-Regular,
    Menlo,
    Monaco,
    Consolas,
    'Liberation Mono',
    'Courier New',
    monospace
  ); /* 1 */
  font-feature-settings: --theme(--default-mono-font-feature-settings, normal); /* 2 */
  font-variation-settings: --theme(--default-mono-font-variation-settings, normal); /* 3 */
  font-size: 1em; /* 4 */
}

/*
  Add the correct font size in all browsers.
*/

small {
  font-size: 80%;
}

/*
  Prevent \`sub\` and \`sup\` elements from affecting the line height in all browsers.
*/

sub,
sup {
  font-size: 75%;
  line-height: 0;
  position: relative;
  vertical-align: baseline;
}

sub {
  bottom: -0.25em;
}

sup {
  top: -0.5em;
}

/*
  1. Remove text indentation from table contents in Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=999088, https://bugs.webkit.org/show_bug.cgi?id=201297)
  2. Correct table border color inheritance in all Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=935729, https://bugs.webkit.org/show_bug.cgi?id=195016)
  3. Remove gaps between table borders by default.
*/

table {
  text-indent: 0; /* 1 */
  border-color: inherit; /* 2 */
  border-collapse: collapse; /* 3 */
}

/*
  Use the modern Firefox focus style for all focusable elements.
*/

:-moz-focusring:where(:not(iframe)) {
  outline: auto;
}

/*
  Add the correct vertical alignment in Chrome and Firefox.
*/

progress {
  vertical-align: baseline;
}

/*
  Add the correct display in Chrome and Safari.
*/

summary {
  display: list-item;
}

/*
  Make lists unstyled by default.
*/

ol,
ul,
menu {
  list-style: none;
}

/*
  1. Make replaced elements \`display: block\` by default. (https://github.com/mozdevs/cssremedy/issues/14)
  2. Add \`vertical-align: middle\` to align replaced elements more sensibly by default. (https://github.com/jensimmons/cssremedy/issues/14#issuecomment-634934210)
      This can trigger a poorly considered lint error in some tools but is included by design.
*/

img,
svg,
video,
canvas,
audio,
iframe,
embed,
object {
  display: block; /* 1 */
  vertical-align: middle; /* 2 */
}

/*
  Constrain images and videos to the parent width and preserve their intrinsic aspect ratio. (https://github.com/mozdevs/cssremedy/issues/14)
*/

img,
video {
  max-width: 100%;
  height: auto;
}

/*
  1. Inherit font styles in all browsers.
  2. Remove border radius in all browsers.
  3. Remove background color in all browsers.
  4. Ensure consistent opacity for disabled states in all browsers.
*/

button,
input,
select,
optgroup,
textarea,
::file-selector-button {
  font: inherit; /* 1 */
  font-feature-settings: inherit; /* 1 */
  font-variation-settings: inherit; /* 1 */
  letter-spacing: inherit; /* 1 */
  color: inherit; /* 1 */
  border-radius: 0; /* 2 */
  background-color: transparent; /* 3 */
  opacity: 1; /* 4 */
}

/*
  Restore default font weight.
*/

:where(select:is([multiple], [size])) optgroup {
  font-weight: bolder;
}

/*
  Restore indentation.
*/

:where(select:is([multiple], [size])) optgroup option {
  padding-inline-start: 20px;
}

/*
  Restore space after button.
*/

::file-selector-button {
  margin-inline-end: 4px;
}

/*
  Reset the default placeholder opacity in Firefox. (https://github.com/tailwindlabs/tailwindcss/issues/3300)
*/

::placeholder {
  opacity: 1;
}

/*
  Set the default placeholder color to a semi-transparent version of the current text color in browsers that do not
  crash when using \`color-mix(\u2026)\` with \`currentcolor\`. (https://github.com/tailwindlabs/tailwindcss/issues/17194)
*/

@supports (not (-webkit-appearance: -apple-pay-button)) /* Not Safari */ or
  (contain-intrinsic-size: 1px) /* Safari 17+ */ {
  ::placeholder {
    color: color-mix(in oklab, currentcolor 50%, transparent);
  }
}

/*
  Prevent resizing textareas horizontally by default.
*/

textarea {
  resize: vertical;
}

/*
  Remove the inner padding in Chrome and Safari on macOS.
*/

::-webkit-search-decoration {
  -webkit-appearance: none;
}

/*
  1. Ensure date/time inputs have the same height when empty in iOS Safari.
  2. Ensure text alignment can be changed on date/time inputs in iOS Safari.
*/

::-webkit-date-and-time-value {
  min-height: 1lh; /* 1 */
  text-align: inherit; /* 2 */
}

/*
  Prevent height from changing on date/time inputs in macOS Safari when the input is set to \`display: block\`.
*/

::-webkit-datetime-edit {
  display: inline-flex;
}

/*
  Remove excess padding from pseudo-elements in date/time inputs to ensure consistent height across browsers.
*/

::-webkit-datetime-edit-fields-wrapper {
  padding: 0;
}

::-webkit-datetime-edit,
::-webkit-datetime-edit-year-field,
::-webkit-datetime-edit-month-field,
::-webkit-datetime-edit-day-field,
::-webkit-datetime-edit-hour-field,
::-webkit-datetime-edit-minute-field,
::-webkit-datetime-edit-second-field,
::-webkit-datetime-edit-millisecond-field,
::-webkit-datetime-edit-meridiem-field {
  padding-block: 0;
}

/*
  Center dropdown marker shown on inputs with paired \`<datalist>\`s in Chrome. (https://github.com/tailwindlabs/tailwindcss/issues/18499)
*/

::-webkit-calendar-picker-indicator {
  line-height: 1;
}

/*
  Remove the additional \`:invalid\` styles in Firefox. (https://github.com/mozilla/gecko-dev/blob/2f9eacd9d3d995c937b4251a5557d95d494c9be1/layout/style/res/forms.css#L728-L737)
*/

:-moz-ui-invalid {
  box-shadow: none;
}

/*
  Correct the inability to style the border radius in iOS Safari.
*/

button,
input:where([type='button'], [type='reset'], [type='submit']),
::file-selector-button {
  appearance: button;
}

/*
  Correct the cursor style of increment and decrement buttons in Safari.
*/

::-webkit-inner-spin-button,
::-webkit-outer-spin-button {
  height: auto;
}

/*
  Make elements with the HTML hidden attribute stay hidden by default.
*/

[hidden]:where(:not([hidden='until-found'])) {
  display: none !important;
}
`,
    xg = `@theme default {
  --font-sans:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', 'Noto Sans', Arial,
    sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
  --font-serif: ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif;
  --font-mono:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New',
    monospace;

  --color-red-50: oklch(97.1% 0.013 17.38);
  --color-red-100: oklch(93.6% 0.032 17.717);
  --color-red-200: oklch(88.5% 0.062 18.334);
  --color-red-300: oklch(80.8% 0.114 19.571);
  --color-red-400: oklch(70.4% 0.191 22.216);
  --color-red-500: oklch(63.7% 0.237 25.331);
  --color-red-600: oklch(57.7% 0.245 27.325);
  --color-red-700: oklch(50.5% 0.213 27.518);
  --color-red-800: oklch(44.4% 0.177 26.899);
  --color-red-900: oklch(39.6% 0.141 25.723);
  --color-red-950: oklch(25.8% 0.092 26.042);

  --color-orange-50: oklch(98% 0.016 73.684);
  --color-orange-100: oklch(95.4% 0.038 75.164);
  --color-orange-200: oklch(90.1% 0.076 70.697);
  --color-orange-300: oklch(83.7% 0.128 66.29);
  --color-orange-400: oklch(75% 0.183 55.934);
  --color-orange-500: oklch(70.5% 0.213 47.604);
  --color-orange-600: oklch(64.6% 0.222 41.116);
  --color-orange-700: oklch(55.3% 0.195 38.402);
  --color-orange-800: oklch(47% 0.157 37.304);
  --color-orange-900: oklch(40.8% 0.123 38.172);
  --color-orange-950: oklch(26.6% 0.079 36.259);

  --color-amber-50: oklch(98.7% 0.022 95.277);
  --color-amber-100: oklch(96.2% 0.059 95.617);
  --color-amber-200: oklch(92.4% 0.12 95.746);
  --color-amber-300: oklch(87.9% 0.169 91.605);
  --color-amber-400: oklch(82.8% 0.189 84.429);
  --color-amber-500: oklch(76.9% 0.188 70.08);
  --color-amber-600: oklch(66.6% 0.179 58.318);
  --color-amber-700: oklch(55.5% 0.163 48.998);
  --color-amber-800: oklch(47.3% 0.137 46.201);
  --color-amber-900: oklch(41.4% 0.112 45.904);
  --color-amber-950: oklch(27.9% 0.077 45.635);

  --color-yellow-50: oklch(98.7% 0.026 102.212);
  --color-yellow-100: oklch(97.3% 0.071 103.193);
  --color-yellow-200: oklch(94.5% 0.129 101.54);
  --color-yellow-300: oklch(90.5% 0.182 98.111);
  --color-yellow-400: oklch(85.2% 0.199 91.936);
  --color-yellow-500: oklch(79.5% 0.184 86.047);
  --color-yellow-600: oklch(68.1% 0.162 75.834);
  --color-yellow-700: oklch(55.4% 0.135 66.442);
  --color-yellow-800: oklch(47.6% 0.114 61.907);
  --color-yellow-900: oklch(42.1% 0.095 57.708);
  --color-yellow-950: oklch(28.6% 0.066 53.813);

  --color-lime-50: oklch(98.6% 0.031 120.757);
  --color-lime-100: oklch(96.7% 0.067 122.328);
  --color-lime-200: oklch(93.8% 0.127 124.321);
  --color-lime-300: oklch(89.7% 0.196 126.665);
  --color-lime-400: oklch(84.1% 0.238 128.85);
  --color-lime-500: oklch(76.8% 0.233 130.85);
  --color-lime-600: oklch(64.8% 0.2 131.684);
  --color-lime-700: oklch(53.2% 0.157 131.589);
  --color-lime-800: oklch(45.3% 0.124 130.933);
  --color-lime-900: oklch(40.5% 0.101 131.063);
  --color-lime-950: oklch(27.4% 0.072 132.109);

  --color-green-50: oklch(98.2% 0.018 155.826);
  --color-green-100: oklch(96.2% 0.044 156.743);
  --color-green-200: oklch(92.5% 0.084 155.995);
  --color-green-300: oklch(87.1% 0.15 154.449);
  --color-green-400: oklch(79.2% 0.209 151.711);
  --color-green-500: oklch(72.3% 0.219 149.579);
  --color-green-600: oklch(62.7% 0.194 149.214);
  --color-green-700: oklch(52.7% 0.154 150.069);
  --color-green-800: oklch(44.8% 0.119 151.328);
  --color-green-900: oklch(39.3% 0.095 152.535);
  --color-green-950: oklch(26.6% 0.065 152.934);

  --color-emerald-50: oklch(97.9% 0.021 166.113);
  --color-emerald-100: oklch(95% 0.052 163.051);
  --color-emerald-200: oklch(90.5% 0.093 164.15);
  --color-emerald-300: oklch(84.5% 0.143 164.978);
  --color-emerald-400: oklch(76.5% 0.177 163.223);
  --color-emerald-500: oklch(69.6% 0.17 162.48);
  --color-emerald-600: oklch(59.6% 0.145 163.225);
  --color-emerald-700: oklch(50.8% 0.118 165.612);
  --color-emerald-800: oklch(43.2% 0.095 166.913);
  --color-emerald-900: oklch(37.8% 0.077 168.94);
  --color-emerald-950: oklch(26.2% 0.051 172.552);

  --color-teal-50: oklch(98.4% 0.014 180.72);
  --color-teal-100: oklch(95.3% 0.051 180.801);
  --color-teal-200: oklch(91% 0.096 180.426);
  --color-teal-300: oklch(85.5% 0.138 181.071);
  --color-teal-400: oklch(77.7% 0.152 181.912);
  --color-teal-500: oklch(70.4% 0.14 182.503);
  --color-teal-600: oklch(60% 0.118 184.704);
  --color-teal-700: oklch(51.1% 0.096 186.391);
  --color-teal-800: oklch(43.7% 0.078 188.216);
  --color-teal-900: oklch(38.6% 0.063 188.416);
  --color-teal-950: oklch(27.7% 0.046 192.524);

  --color-cyan-50: oklch(98.4% 0.019 200.873);
  --color-cyan-100: oklch(95.6% 0.045 203.388);
  --color-cyan-200: oklch(91.7% 0.08 205.041);
  --color-cyan-300: oklch(86.5% 0.127 207.078);
  --color-cyan-400: oklch(78.9% 0.154 211.53);
  --color-cyan-500: oklch(71.5% 0.143 215.221);
  --color-cyan-600: oklch(60.9% 0.126 221.723);
  --color-cyan-700: oklch(52% 0.105 223.128);
  --color-cyan-800: oklch(45% 0.085 224.283);
  --color-cyan-900: oklch(39.8% 0.07 227.392);
  --color-cyan-950: oklch(30.2% 0.056 229.695);

  --color-sky-50: oklch(97.7% 0.013 236.62);
  --color-sky-100: oklch(95.1% 0.026 236.824);
  --color-sky-200: oklch(90.1% 0.058 230.902);
  --color-sky-300: oklch(82.8% 0.111 230.318);
  --color-sky-400: oklch(74.6% 0.16 232.661);
  --color-sky-500: oklch(68.5% 0.169 237.323);
  --color-sky-600: oklch(58.8% 0.158 241.966);
  --color-sky-700: oklch(50% 0.134 242.749);
  --color-sky-800: oklch(44.3% 0.11 240.79);
  --color-sky-900: oklch(39.1% 0.09 240.876);
  --color-sky-950: oklch(29.3% 0.066 243.157);

  --color-blue-50: oklch(97% 0.014 254.604);
  --color-blue-100: oklch(93.2% 0.032 255.585);
  --color-blue-200: oklch(88.2% 0.059 254.128);
  --color-blue-300: oklch(80.9% 0.105 251.813);
  --color-blue-400: oklch(70.7% 0.165 254.624);
  --color-blue-500: oklch(62.3% 0.214 259.815);
  --color-blue-600: oklch(54.6% 0.245 262.881);
  --color-blue-700: oklch(48.8% 0.243 264.376);
  --color-blue-800: oklch(42.4% 0.199 265.638);
  --color-blue-900: oklch(37.9% 0.146 265.522);
  --color-blue-950: oklch(28.2% 0.091 267.935);

  --color-indigo-50: oklch(96.2% 0.018 272.314);
  --color-indigo-100: oklch(93% 0.034 272.788);
  --color-indigo-200: oklch(87% 0.065 274.039);
  --color-indigo-300: oklch(78.5% 0.115 274.713);
  --color-indigo-400: oklch(67.3% 0.182 276.935);
  --color-indigo-500: oklch(58.5% 0.233 277.117);
  --color-indigo-600: oklch(51.1% 0.262 276.966);
  --color-indigo-700: oklch(45.7% 0.24 277.023);
  --color-indigo-800: oklch(39.8% 0.195 277.366);
  --color-indigo-900: oklch(35.9% 0.144 278.697);
  --color-indigo-950: oklch(25.7% 0.09 281.288);

  --color-violet-50: oklch(96.9% 0.016 293.756);
  --color-violet-100: oklch(94.3% 0.029 294.588);
  --color-violet-200: oklch(89.4% 0.057 293.283);
  --color-violet-300: oklch(81.1% 0.111 293.571);
  --color-violet-400: oklch(70.2% 0.183 293.541);
  --color-violet-500: oklch(60.6% 0.25 292.717);
  --color-violet-600: oklch(54.1% 0.281 293.009);
  --color-violet-700: oklch(49.1% 0.27 292.581);
  --color-violet-800: oklch(43.2% 0.232 292.759);
  --color-violet-900: oklch(38% 0.189 293.745);
  --color-violet-950: oklch(28.3% 0.141 291.089);

  --color-purple-50: oklch(97.7% 0.014 308.299);
  --color-purple-100: oklch(94.6% 0.033 307.174);
  --color-purple-200: oklch(90.2% 0.063 306.703);
  --color-purple-300: oklch(82.7% 0.119 306.383);
  --color-purple-400: oklch(71.4% 0.203 305.504);
  --color-purple-500: oklch(62.7% 0.265 303.9);
  --color-purple-600: oklch(55.8% 0.288 302.321);
  --color-purple-700: oklch(49.6% 0.265 301.924);
  --color-purple-800: oklch(43.8% 0.218 303.724);
  --color-purple-900: oklch(38.1% 0.176 304.987);
  --color-purple-950: oklch(29.1% 0.149 302.717);

  --color-fuchsia-50: oklch(97.7% 0.017 320.058);
  --color-fuchsia-100: oklch(95.2% 0.037 318.852);
  --color-fuchsia-200: oklch(90.3% 0.076 319.62);
  --color-fuchsia-300: oklch(83.3% 0.145 321.434);
  --color-fuchsia-400: oklch(74% 0.238 322.16);
  --color-fuchsia-500: oklch(66.7% 0.295 322.15);
  --color-fuchsia-600: oklch(59.1% 0.293 322.896);
  --color-fuchsia-700: oklch(51.8% 0.253 323.949);
  --color-fuchsia-800: oklch(45.2% 0.211 324.591);
  --color-fuchsia-900: oklch(40.1% 0.17 325.612);
  --color-fuchsia-950: oklch(29.3% 0.136 325.661);

  --color-pink-50: oklch(97.1% 0.014 343.198);
  --color-pink-100: oklch(94.8% 0.028 342.258);
  --color-pink-200: oklch(89.9% 0.061 343.231);
  --color-pink-300: oklch(82.3% 0.12 346.018);
  --color-pink-400: oklch(71.8% 0.202 349.761);
  --color-pink-500: oklch(65.6% 0.241 354.308);
  --color-pink-600: oklch(59.2% 0.249 0.584);
  --color-pink-700: oklch(52.5% 0.223 3.958);
  --color-pink-800: oklch(45.9% 0.187 3.815);
  --color-pink-900: oklch(40.8% 0.153 2.432);
  --color-pink-950: oklch(28.4% 0.109 3.907);

  --color-rose-50: oklch(96.9% 0.015 12.422);
  --color-rose-100: oklch(94.1% 0.03 12.58);
  --color-rose-200: oklch(89.2% 0.058 10.001);
  --color-rose-300: oklch(81% 0.117 11.638);
  --color-rose-400: oklch(71.2% 0.194 13.428);
  --color-rose-500: oklch(64.5% 0.246 16.439);
  --color-rose-600: oklch(58.6% 0.253 17.585);
  --color-rose-700: oklch(51.4% 0.222 16.935);
  --color-rose-800: oklch(45.5% 0.188 13.697);
  --color-rose-900: oklch(41% 0.159 10.272);
  --color-rose-950: oklch(27.1% 0.105 12.094);

  --color-slate-50: oklch(98.4% 0.003 247.858);
  --color-slate-100: oklch(96.8% 0.007 247.896);
  --color-slate-200: oklch(92.9% 0.013 255.508);
  --color-slate-300: oklch(86.9% 0.022 252.894);
  --color-slate-400: oklch(70.4% 0.04 256.788);
  --color-slate-500: oklch(55.4% 0.046 257.417);
  --color-slate-600: oklch(44.6% 0.043 257.281);
  --color-slate-700: oklch(37.2% 0.044 257.287);
  --color-slate-800: oklch(27.9% 0.041 260.031);
  --color-slate-900: oklch(20.8% 0.042 265.755);
  --color-slate-950: oklch(12.9% 0.042 264.695);

  --color-gray-50: oklch(98.5% 0.002 247.839);
  --color-gray-100: oklch(96.7% 0.003 264.542);
  --color-gray-200: oklch(92.8% 0.006 264.531);
  --color-gray-300: oklch(87.2% 0.01 258.338);
  --color-gray-400: oklch(70.7% 0.022 261.325);
  --color-gray-500: oklch(55.1% 0.027 264.364);
  --color-gray-600: oklch(44.6% 0.03 256.802);
  --color-gray-700: oklch(37.3% 0.034 259.733);
  --color-gray-800: oklch(27.8% 0.033 256.848);
  --color-gray-900: oklch(21% 0.034 264.665);
  --color-gray-950: oklch(13% 0.028 261.692);

  --color-zinc-50: oklch(98.5% 0 none);
  --color-zinc-100: oklch(96.7% 0.001 286.375);
  --color-zinc-200: oklch(92% 0.004 286.32);
  --color-zinc-300: oklch(87.1% 0.006 286.286);
  --color-zinc-400: oklch(70.5% 0.015 286.067);
  --color-zinc-500: oklch(55.2% 0.016 285.938);
  --color-zinc-600: oklch(44.2% 0.017 285.786);
  --color-zinc-700: oklch(37% 0.013 285.805);
  --color-zinc-800: oklch(27.4% 0.006 286.033);
  --color-zinc-900: oklch(21% 0.006 285.885);
  --color-zinc-950: oklch(14.1% 0.005 285.823);

  --color-neutral-50: oklch(98.5% 0 none);
  --color-neutral-100: oklch(97% 0 none);
  --color-neutral-200: oklch(92.2% 0 none);
  --color-neutral-300: oklch(87% 0 none);
  --color-neutral-400: oklch(70.8% 0 none);
  --color-neutral-500: oklch(55.6% 0 none);
  --color-neutral-600: oklch(43.9% 0 none);
  --color-neutral-700: oklch(37.1% 0 none);
  --color-neutral-800: oklch(26.9% 0 none);
  --color-neutral-900: oklch(20.5% 0 none);
  --color-neutral-950: oklch(14.5% 0 none);

  --color-stone-50: oklch(98.5% 0.001 106.423);
  --color-stone-100: oklch(97% 0.001 106.424);
  --color-stone-200: oklch(92.3% 0.003 48.717);
  --color-stone-300: oklch(86.9% 0.005 56.366);
  --color-stone-400: oklch(70.9% 0.01 56.259);
  --color-stone-500: oklch(55.3% 0.013 58.071);
  --color-stone-600: oklch(44.4% 0.011 73.639);
  --color-stone-700: oklch(37.4% 0.01 67.558);
  --color-stone-800: oklch(26.8% 0.007 34.298);
  --color-stone-900: oklch(21.6% 0.006 56.043);
  --color-stone-950: oklch(14.7% 0.004 49.25);

  --color-mauve-50: oklch(98.5% 0 none);
  --color-mauve-100: oklch(96% 0.003 325.6);
  --color-mauve-200: oklch(92.2% 0.005 325.62);
  --color-mauve-300: oklch(86.5% 0.012 325.68);
  --color-mauve-400: oklch(71.1% 0.019 323.02);
  --color-mauve-500: oklch(54.2% 0.034 322.5);
  --color-mauve-600: oklch(43.5% 0.029 321.78);
  --color-mauve-700: oklch(36.4% 0.029 323.89);
  --color-mauve-800: oklch(26.3% 0.024 320.12);
  --color-mauve-900: oklch(21.2% 0.019 322.12);
  --color-mauve-950: oklch(14.5% 0.008 326);

  --color-olive-50: oklch(98.8% 0.003 106.5);
  --color-olive-100: oklch(96.6% 0.005 106.5);
  --color-olive-200: oklch(93% 0.007 106.5);
  --color-olive-300: oklch(88% 0.011 106.6);
  --color-olive-400: oklch(73.7% 0.021 106.9);
  --color-olive-500: oklch(58% 0.031 107.3);
  --color-olive-600: oklch(46.6% 0.025 107.3);
  --color-olive-700: oklch(39.4% 0.023 107.4);
  --color-olive-800: oklch(28.6% 0.016 107.4);
  --color-olive-900: oklch(22.8% 0.013 107.4);
  --color-olive-950: oklch(15.3% 0.006 107.1);

  --color-mist-50: oklch(98.7% 0.002 197.1);
  --color-mist-100: oklch(96.3% 0.002 197.1);
  --color-mist-200: oklch(92.5% 0.005 214.3);
  --color-mist-300: oklch(87.2% 0.007 219.6);
  --color-mist-400: oklch(72.3% 0.014 214.4);
  --color-mist-500: oklch(56% 0.021 213.5);
  --color-mist-600: oklch(45% 0.017 213.2);
  --color-mist-700: oklch(37.8% 0.015 216);
  --color-mist-800: oklch(27.5% 0.011 216.9);
  --color-mist-900: oklch(21.8% 0.008 223.9);
  --color-mist-950: oklch(14.8% 0.004 228.8);

  --color-taupe-50: oklch(98.6% 0.002 67.8);
  --color-taupe-100: oklch(96% 0.002 17.2);
  --color-taupe-200: oklch(92.2% 0.005 34.3);
  --color-taupe-300: oklch(86.8% 0.007 39.5);
  --color-taupe-400: oklch(71.4% 0.014 41.2);
  --color-taupe-500: oklch(54.7% 0.021 43.1);
  --color-taupe-600: oklch(43.8% 0.017 39.3);
  --color-taupe-700: oklch(36.7% 0.016 35.7);
  --color-taupe-800: oklch(26.8% 0.011 36.5);
  --color-taupe-900: oklch(21.4% 0.009 43.1);
  --color-taupe-950: oklch(14.7% 0.004 49.3);

  --color-black: #000;
  --color-white: #fff;

  --spacing: 0.25rem;

  --breakpoint-sm: 40rem;
  --breakpoint-md: 48rem;
  --breakpoint-lg: 64rem;
  --breakpoint-xl: 80rem;
  --breakpoint-2xl: 96rem;

  --container-3xs: 16rem;
  --container-2xs: 18rem;
  --container-xs: 20rem;
  --container-sm: 24rem;
  --container-md: 28rem;
  --container-lg: 32rem;
  --container-xl: 36rem;
  --container-2xl: 42rem;
  --container-3xl: 48rem;
  --container-4xl: 56rem;
  --container-5xl: 64rem;
  --container-6xl: 72rem;
  --container-7xl: 80rem;

  --text-xs: 0.75rem;
  --text-xs--line-height: calc(1 / 0.75);
  --text-sm: 0.875rem;
  --text-sm--line-height: calc(1.25 / 0.875);
  --text-base: 1rem;
  --text-base--line-height: calc(1.5 / 1);
  --text-lg: 1.125rem;
  --text-lg--line-height: calc(1.75 / 1.125);
  --text-xl: 1.25rem;
  --text-xl--line-height: calc(1.75 / 1.25);
  --text-2xl: 1.5rem;
  --text-2xl--line-height: calc(2 / 1.5);
  --text-3xl: 1.875rem;
  --text-3xl--line-height: calc(2.25 / 1.875);
  --text-4xl: 2.25rem;
  --text-4xl--line-height: calc(2.5 / 2.25);
  --text-5xl: 3rem;
  --text-5xl--line-height: 1;
  --text-6xl: 3.75rem;
  --text-6xl--line-height: 1;
  --text-7xl: 4.5rem;
  --text-7xl--line-height: 1;
  --text-8xl: 6rem;
  --text-8xl--line-height: 1;
  --text-9xl: 8rem;
  --text-9xl--line-height: 1;

  --font-weight-thin: 100;
  --font-weight-extralight: 200;
  --font-weight-light: 300;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;
  --font-weight-black: 900;

  --tracking-tighter: -0.05em;
  --tracking-tight: -0.025em;
  --tracking-normal: 0em;
  --tracking-wide: 0.025em;
  --tracking-wider: 0.05em;
  --tracking-widest: 0.1em;

  --leading-tight: 1.25;
  --leading-snug: 1.375;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
  --leading-loose: 2;

  --radius-xs: 0.125rem;
  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  --radius-2xl: 1rem;
  --radius-3xl: 1.5rem;
  --radius-4xl: 2rem;

  --shadow-2xs: 0 1px rgb(0 0 0 / 0.05);
  --shadow-xs: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  --shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);

  --inset-shadow-2xs: inset 0 1px rgb(0 0 0 / 0.05);
  --inset-shadow-xs: inset 0 1px 1px rgb(0 0 0 / 0.05);
  --inset-shadow-sm: inset 0 2px 4px rgb(0 0 0 / 0.05);

  --drop-shadow-xs: 0 1px 1px rgb(0 0 0 / 0.05);
  --drop-shadow-sm: 0 1px 2px rgb(0 0 0 / 0.15);
  --drop-shadow-md: 0 3px 3px rgb(0 0 0 / 0.12);
  --drop-shadow-lg: 0 4px 4px rgb(0 0 0 / 0.15);
  --drop-shadow-xl: 0 9px 7px rgb(0 0 0 / 0.1);
  --drop-shadow-2xl: 0 25px 25px rgb(0 0 0 / 0.15);

  --text-shadow-2xs: 0px 1px 0px rgb(0 0 0 / 0.15);
  --text-shadow-xs: 0px 1px 1px rgb(0 0 0 / 0.2);
  --text-shadow-sm:
    0px 1px 0px rgb(0 0 0 / 0.075), 0px 1px 1px rgb(0 0 0 / 0.075), 0px 2px 2px rgb(0 0 0 / 0.075);
  --text-shadow-md:
    0px 1px 1px rgb(0 0 0 / 0.1), 0px 1px 2px rgb(0 0 0 / 0.1), 0px 2px 4px rgb(0 0 0 / 0.1);
  --text-shadow-lg:
    0px 1px 2px rgb(0 0 0 / 0.1), 0px 3px 2px rgb(0 0 0 / 0.1), 0px 4px 8px rgb(0 0 0 / 0.1);

  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);

  --animate-spin: spin 1s linear infinite;
  --animate-ping: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
  --animate-pulse: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  --animate-bounce: bounce 1s infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes ping {
    75%,
    100% {
      transform: scale(2);
      opacity: 0;
    }
  }

  @keyframes pulse {
    50% {
      opacity: 0.5;
    }
  }

  @keyframes bounce {
    0%,
    100% {
      transform: translateY(-25%);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }

    50% {
      transform: none;
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
  }

  --blur-xs: 4px;
  --blur-sm: 8px;
  --blur-md: 12px;
  --blur-lg: 16px;
  --blur-xl: 24px;
  --blur-2xl: 40px;
  --blur-3xl: 64px;

  --perspective-dramatic: 100px;
  --perspective-near: 300px;
  --perspective-normal: 500px;
  --perspective-midrange: 800px;
  --perspective-distant: 1200px;

  --aspect-video: 16 / 9;

  --default-transition-duration: 150ms;
  --default-transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  --default-font-family: --theme(--font-sans, initial);
  --default-font-feature-settings: --theme(--font-sans--font-feature-settings, initial);
  --default-font-variation-settings: --theme(--font-sans--font-variation-settings, initial);
  --default-mono-font-family: --theme(--font-mono, initial);
  --default-mono-font-feature-settings: --theme(--font-mono--font-feature-settings, initial);
  --default-mono-font-variation-settings: --theme(--font-mono--font-variation-settings, initial);
}

/* Deprecated */
@theme default inline reference {
  --blur: 8px;
  --shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --shadow-inner: inset 0 2px 4px 0 rgb(0 0 0 / 0.05);
  --drop-shadow: 0 1px 2px rgb(0 0 0 / 0.1), 0 1px 1px rgb(0 0 0 / 0.06);
  --radius: 0.25rem;
  --max-width-prose: 65ch;
}
`,
    Sg = `@tailwind utilities;
`,
    Zo = {
      index: _g,
      preflight: Ng,
      theme: xg,
      utilities: Sg
    },
    Og = class {
      start(r) {
        performance.mark(`${r} (start)`);
      }
      end(r, a) {
        performance.mark(`${r} (end)`), performance.measure(r, {
          start: `${r} (start)`,
          end: `${r} (end)`,
          detail: a
        });
      }
      hit(r, a) {
        performance.mark(r, {
          detail: a
        });
      }
      error(r) {
        throw performance.mark("(error)", {
          detail: {
            error: `${r}`
          }
        }), r;
      }
    },
    Ku = "text/tailwindcss",
    Qo,
    Xa = new Set(),
    qa = "",
    Ga = document.createElement("style"),
    Wu = Promise.resolve(),
    Tg = 1,
    $t = new Og();
  async function Cg() {
    $t.start("Create compiler"), $t.start("Reading Stylesheets");
    let r = document.querySelectorAll(`style[type="${Ku}"]`),
      a = "";
    for (let c of r) Xu(c), a += c.textContent + `
`;
    if (a.includes("@import") || (a = `@import "tailwindcss";${a}`), $t.end("Reading Stylesheets", {
      size: a.length,
      changed: qa !== a
    }), qa !== a) {
      qa = a, $t.start("Compile CSS");
      try {
        Qo = await Eg(a, {
          base: "/",
          loadStylesheet: Ag,
          loadModule: Dg
        });
      } finally {
        $t.end("Compile CSS"), $t.end("Create compiler");
      }
      Xa.clear();
    }
  }
  async function Ag(r, a) {
    function c() {
      if (r === "tailwindcss") return {
        path: "virtual:tailwindcss/index.css",
        base: a,
        content: Zo.index
      };
      if (r === "tailwindcss/preflight" || r === "tailwindcss/preflight.css" || r === "./preflight.css") return {
        path: "virtual:tailwindcss/preflight.css",
        base: a,
        content: Zo.preflight
      };
      if (r === "tailwindcss/theme" || r === "tailwindcss/theme.css" || r === "./theme.css") return {
        path: "virtual:tailwindcss/theme.css",
        base: a,
        content: Zo.theme
      };
      if (r === "tailwindcss/utilities" || r === "tailwindcss/utilities.css" || r === "./utilities.css") return {
        path: "virtual:tailwindcss/utilities.css",
        base: a,
        content: Zo.utilities
      };
      throw new Error(`The browser build does not support @import for "${r}"`);
    }
    try {
      let o = c();
      return $t.hit("Loaded stylesheet", {
        id: r,
        base: a,
        size: o.content.length
      }), o;
    } catch (o) {
      throw $t.hit("Failed to load stylesheet", {
        id: r,
        base: a,
        error: o.message ?? o
      }), o;
    }
  }
  async function Dg() {
    throw new Error("The browser build does not support plugins or config files.");
  }
  async function Vg(r) {
    if (!Qo) return;
    let a = new Set();
    $t.start("Collect classes");
    for (let c of document.querySelectorAll("[class]")) for (let o of c.classList) Xa.has(o) || (Xa.add(o), a.add(o));
    $t.end("Collect classes", {
      count: a.size
    }), !(a.size === 0 && r === "incremental") && ($t.start("Build utilities"), Ga.textContent = Qo.build(Array.from(a)), $t.end("Build utilities"));
  }
  function es(r) {
    async function a() {
      if (!Qo && r !== "full") return;
      let c = Tg++;
      $t.start(`Build #${c} (${r})`), r === "full" && (await Cg()), $t.start("Build"), await Vg(r), $t.end("Build"), $t.end(`Build #${c} (${r})`);
    }
    Wu = Wu.then(a).catch(c => $t.error(c));
  }
  var $g = new MutationObserver(() => es("full"));
  function Xu(r) {
    $g.observe(r, {
      attributes: !0,
      attributeFilter: ["type"],
      characterData: !0,
      subtree: !0,
      childList: !0
    });
  }
  new MutationObserver(r => {
    let a = 0,
      c = 0;
    for (let o of r) {
      for (let h of o.addedNodes) h.nodeType === Node.ELEMENT_NODE && h.tagName === "STYLE" && h.getAttribute("type") === Ku && (Xu(h), a++);
      for (let h of o.addedNodes) h.nodeType === 1 && h !== Ga && c++;
      o.type === "attributes" && c++;
    }
    if (a > 0) return es("full");
    if (c > 0) return es("incremental");
  }).observe(document.documentElement, {
    attributes: !0,
    attributeFilter: ["class"],
    childList: !0,
    subtree: !0
  }), es("full"), document.head.append(Ga);
})();
// vscodeApi (minified: cm) — ──── App: Preview webview: acquireVsCodeApi, ghost stubs for Saturn/Api/Auth/$saturn/Sdk globals, RPC to host (rpc-N ids), window.Resource class, status/error UI, SFC splitting (template/script/style), module import via Blob, Vue mount (createApp + errorHandler), message listener, ready handshake ────
// vscodeApi (minified: cm) — The webview's only handle to the extension host.
var vscodeApi = acquireVsCodeApi();
// makeGhost (minified: Uo) — Makes a stand-in (a Proxy) for a Saturn global the preview can't provide: any property read, call or
// `new` returns another ghost, so component code that touches Saturn/Api/Auth/… doesn't throw.
// It is not thenable, has length 0, and serialises to null.
function makeGhost(ghostName = "ghost") {
  let ghost = function () {
    return makeGhost(`${ghostName}(...)`);
  };
  return ghost.__saturnGhost = !0, ghost.__ghostName = ghostName, new Proxy(ghost, {
    // Property reads: primitives/iterators/JSON get harmless values; then/catch/finally stay undefined so
    // awaiting a ghost doesn't hang.
    get(target, key) {
      if (key === Symbol.toPrimitive) return () => `[${ghostName}]`;
      if (key === Symbol.iterator) return function* () {};
      if (key === Symbol.asyncIterator) return async function* () {};
      if (!(key === "then" || key === "catch" || key === "finally")) return key === "toJSON" ? () => null : key === "length" ? 0 : typeof key == "string" && key in target ? target[key] : makeGhost(`${ghostName}.${String(key)}`);
    },
    apply() {
      return makeGhost(`${ghostName}()`);
    },
    construct() {
      return makeGhost(`new ${ghostName}()`);
    },
    has() {
      return !0;
    }
  });
}
// GHOST_GLOBALS (minified: nk) — Saturn globals replaced by ghosts when the page doesn't define them.
var GHOST_GLOBALS = ["Saturn", "Api", "Auth", "$saturn", "Sdk"];
for (let globalName of GHOST_GLOBALS) globalName in window || (window[globalName] = makeGhost(globalName));
// pendingRpcs (minified: Gc) — Calls waiting for an rpcResponse, by id.
// rpcCounter (minified: rk): numbers the rpc ids.
var pendingRpcs = new Map(),
  rpcCounter = 0;
// callHost (minified: ik) — Sends an rpc message to the host and returns a promise that settles on its rpcResponse.
function callHost(request) {
  let id = `rpc-${++rpcCounter}-${Date.now()}`;
  return new Promise((resolve, reject) => {
    pendingRpcs.set(id, {
      resolve: resolve,
      reject: reject
    }), vscodeApi.postMessage({
      type: "rpc",
      id: id,
      request: request
    });
  });
}
// SaturnResource (minified: Yc) — window.Resource for previewed components: each method is forwarded to the host (rpc), which runs it
// against the instance (runPreviewCall); writes need the user's consent there.
var SaturnResource = class {
  _resourceType;
  constructor(options, resourceType) {
    this._resourceType = resourceType ?? null;
  }
  // Sends one Resource method call (with this resource type) to the host.
  _call(method, args) {
    return callHost({
      resourceType: this._resourceType,
      method: method,
      args: args
    });
  }
  // Lists records (query).
  list(query) {
    return this._call("list", [query]);
  }
  // Reads one record.
  get(id) {
    return this._call("get", [id]);
  }
  // Creates a record.
  create(data) {
    return this._call("create", [data]);
  }
  // Updates a record.
  update(id, data) {
    return this._call("update", [id, data]);
  }
  // Deletes a record.
  delete(id) {
    return this._call("delete", [id]);
  }
  // Exports records (query).
  export(query) {
    return this._call("export", [query]);
  }
  // Counts records.
  count() {
    return this._call("count", []);
  }
  // Any HTTP request; the path is relative to the resource unless it starts with /.
  request(httpMethod, path, options) {
    return this._call("request", [httpMethod, path, options]);
  }
  // GET on a custom path.
  customGet(path, options) {
    return this._call("customGet", [path, options]);
  }
  // POST on a custom path.
  customPost(path, body, options) {
    return this._call("customPost", [path, body, options]);
  }
  // PUT on a custom path.
  customPut(path, body, options) {
    return this._call("customPut", [path, body, options]);
  }
  // PATCH on a custom path.
  customPatch(path, body, options) {
    return this._call("customPatch", [path, body, options]);
  }
  // DELETE on a custom path.
  customDelete(path, options) {
    return this._call("customDelete", [path, options]);
  }
  // Runs a workflow action on a record.
  invokeWorkflowAction(id, actionName, body, options) {
    return this._call("invokeWorkflowAction", [id, actionName, body, options]);
  }
  // Reads a resource's schema (its fields).
  loadResourceProps(resourceName) {
    return this._call("loadResourceProps", [resourceName]);
  }
  // Analytics histogram data.
  get_histogram_data(data, filter) {
    return this._call("get_histogram_data", [data, filter]);
  }
  // Analytics source-histogram data.
  get_source_histogram_data(data, filter) {
    return this._call("get_source_histogram_data", [data, filter]);
  }
  // Analytics term data.
  term(data, filter) {
    return this._call("term", [data, filter]);
  }
  // Replaces a resource's schema.
  updateSchema(resourceName, schema) {
    return this._call("updateSchema", [resourceName, schema]);
  }
};
window.Resource = SaturnResource;
// mountEl (minified: zo) — The page's elements: the mount point for the component.
// statusEl (minified: am), errorEl (minified: Ea), scopedStyleEl (minified: ok, the component's <style> blocks),
// resourceNameEl (minified: sk); currentApp (minified: ka) is the mounted Vue app, if any.
var mountEl = document.getElementById("mount"),
  statusEl = document.getElementById("status"),
  errorEl = document.getElementById("error"),
  scopedStyleEl = document.getElementById("scoped-style"),
  resourceNameEl = document.getElementById("resource-name"),
  currentApp = null;
// setStatus (minified: _a) — Shows a status line; kind is ok, warn or err.
function setStatus(text, kind = "ok") {
  statusEl.textContent = text, statusEl.dataset.kind = kind;
}
// showError (minified: jo) — Shows an error in place of the component.
function showError(text) {
  errorEl.textContent = text, errorEl.style.display = "block", mountEl.style.display = "none", setStatus("Preview error", "err");
}
// hideError (minified: ak) — Hides the error box and shows the component again.
function hideError() {
  errorEl.textContent = "", errorEl.style.display = "none", mountEl.style.display = "block";
}
// unmountApp (minified: lk) — Unmounts the current Vue app and empties the mount point.
function unmountApp() {
  if (currentApp) {
    try {
      currentApp.unmount();
    } catch {}
    currentApp = null;
  }
  mountEl.innerHTML = "";
}
// findBlock (minified: wa) — Finds the first <tag>…</tag> block from fromIndex whose attributes pass acceptAttrs, counting nested
// same-name tags; returns {content, endIndex, attrs}, or null.
function findBlock(source, tag, fromIndex = 0, acceptAttrs) {
  let openTagRe = new RegExp(`<${tag}(\\s(?:[^>"']|"[^"]*"|'[^']*')*)?>`, "gi");
  openTagRe.lastIndex = fromIndex;
  let match;
  for (; (match = openTagRe.exec(source)) !== null;) {
    let attrs = match[1] ?? "";
    if (acceptAttrs && !acceptAttrs(attrs)) continue;
    let contentStart = match.index + match[0].length,
      depth = 1,
      cursor = contentStart,
      innerOpenRe = new RegExp(`<${tag}(\\s(?:[^>"']|"[^"]*"|'[^']*')*)?>`, "gi"),
      closeRe = new RegExp(`</${tag}\\s*>`, "gi");
    for (; depth > 0;) {
      // Walks to the matching close tag: an inner open tag goes one deeper, a close tag one shallower.
      innerOpenRe.lastIndex = cursor, closeRe.lastIndex = cursor;
      let nextOpen = innerOpenRe.exec(source),
        nextClose = closeRe.exec(source);
      if (!nextClose) return null;
      if (nextOpen && nextOpen.index < nextClose.index) depth++, cursor = nextOpen.index + nextOpen[0].length;else {
        if (depth--, depth === 0) return {
          content: source.slice(contentStart, nextClose.index),
          endIndex: nextClose.index + nextClose[0].length,
          attrs: attrs
        };
        cursor = nextClose.index + nextClose[0].length;
      }
    }
  }
  return null;
}
// splitSfc (minified: ck) — Splits a single-file component into its template, plain <script>, <script setup> and <style> blocks.
function splitSfc(source) {
  let template = findBlock(source, "template")?.content ?? "",
    scriptSetup = findBlock(source, "script", 0, attrs => /\bsetup\b/.test(attrs))?.content ?? "",
    script = "";
  scriptSetup || (script = findBlock(source, "script", 0, attrs => !/\bsetup\b/.test(attrs))?.content ?? "");
  let styles = [],
    cursor = 0;
  for (; cursor < source.length;) {
    let block = findBlock(source, "style", cursor);
    if (!block) break;
    styles.push(block.content), cursor = block.endIndex;
  }
  return {
    template: template,
    script: script,
    scriptSetup: scriptSetup,
    styles: styles
  };
}
// importModule (minified: uk) — Imports JavaScript source as an ES module through a blob: URL (the component's <script>).
async function importModule(code) {
  let blob = new Blob([code], {
      type: "application/javascript"
    }),
    blobUrl = URL.createObjectURL(blob);
  try {
    return await import(blobUrl);
  } finally {
    URL.revokeObjectURL(blobUrl);
  }
}
// normalizeHtml (minified: fk) — Lets the browser's HTML parser fix up markup (e.g. unclosed tags) so Vue can compile it.
function normalizeHtml(html) {
  let container = document.createElement("div");
  return container.innerHTML = html, container.innerHTML;
}
// mountComponent (minified: lm) — Creates and mounts the Vue app; runtime errors are shown in the error box, warnings logged.
function mountComponent(component) {
  let definition = defineComponent(component),
    app = createApp(definition);
  app.config.errorHandler = error => {
    showError(`Runtime error:
${error instanceof Error ? error.stack ?? error.message : String(error)}`);
  }, app.config.warnHandler = warning => {
    console.warn("[Saturn preview]", warning);
  }, app.mount(mountEl), currentApp = app;
}
// renderSource (minified: dk) — Renders a component source: refuses <script setup> and a missing template, applies the styles, evaluates
// the script's default export, then mounts it with the template.
async function renderSource(source) {
  let sfc = splitSfc(source);
  if (sfc.scriptSetup) {
    showError("Preview doesn't support <script setup> yet.\n\nConvert the component to use a plain <script> block with `export default { ... }` to preview it, or render the template alone by removing the <script setup> block.");
    return;
  }
  if (!sfc.template.trim()) {
    showError("This file has no <template> block.");
    return;
  }
  unmountApp(), hideError(), scopedStyleEl.textContent = sfc.styles.join(`

`);
  let options = {};
  try {
    if (sfc.script.trim()) {
      let exported = (await importModule(sfc.script)).default;
      exported && typeof exported == "object" && (options = {
        ...exported
      });
    }
  } catch (error) {
    showError(`Failed to evaluate <script>:
${error instanceof Error ? error.stack ?? error.message : String(error)}`);
    return;
  }
  try {
    mountComponent({
      ...options,
      template: sfc.template
    }), setStatus("Preview synced");
  } catch (error) {
    // A template Vue can't compile: retry once with the browser-normalised markup.
    if (error instanceof SyntaxError) {
      let normalized = normalizeHtml(sfc.template);
      if (normalized !== sfc.template) try {
        mountEl.innerHTML = "", mountComponent({
          ...options,
          template: normalized
        }), setStatus("Preview synced (template normalized)", "warn");
        return;
      } catch {}
    }
    showError(`Mount failed:
${error instanceof Error ? error.stack ?? error.message : String(error)}`);
  }
}
// Messages from the host: update (a new source to render, with its resource name) and rpcResponse
// (settles the waiting Resource call).
window.addEventListener("message", messageEvent => {
  let message = messageEvent.data;
  if (message) {
    if (message.type === "update") {
      resourceNameEl.textContent = message.payload.resourceName, renderSource(message.payload.source);
      return;
    }
    if (message.type === "rpcResponse" && typeof message.id == "string") {
      let pending = pendingRpcs.get(message.id);
      if (!pending) return;
      pendingRpcs.delete(message.id), message.error ? pending.reject(new Error(String(message.error))) : pending.resolve(message.result);
    }
  }
});
// Tells the host the webview is ready, so it sends the current source.
vscodeApi.postMessage({
  type: "ready"
});
setStatus("Waiting for component\u2026");
/*! Bundled license information:

@vue/shared/dist/shared.esm-bundler.js:
  (**
  * @vue/shared v3.5.41
  * (c) 2018-present Yuxi (Evan) You and Vue contributors
  * @license MIT
  **)

@vue/reactivity/dist/reactivity.esm-bundler.js:
  (**
  * @vue/reactivity v3.5.41
  * (c) 2018-present Yuxi (Evan) You and Vue contributors
  * @license MIT
  **)

@vue/runtime-core/dist/runtime-core.esm-bundler.js:
  (**
  * @vue/runtime-core v3.5.41
  * (c) 2018-present Yuxi (Evan) You and Vue contributors
  * @license MIT
  **)

@vue/runtime-dom/dist/runtime-dom.esm-bundler.js:
  (**
  * @vue/runtime-dom v3.5.41
  * (c) 2018-present Yuxi (Evan) You and Vue contributors
  * @license MIT
  **)

@vue/compiler-core/dist/compiler-core.esm-bundler.js:
  (**
  * @vue/compiler-core v3.5.41
  * (c) 2018-present Yuxi (Evan) You and Vue contributors
  * @license MIT
  **)

@vue/compiler-dom/dist/compiler-dom.esm-bundler.js:
  (**
  * @vue/compiler-dom v3.5.41
  * (c) 2018-present Yuxi (Evan) You and Vue contributors
  * @license MIT
  **)

vue/dist/vue.esm-bundler.js:
  (**
  * vue v3.5.41
  * (c) 2018-present Yuxi (Evan) You and Vue contributors
  * @license MIT
  **)
*/
