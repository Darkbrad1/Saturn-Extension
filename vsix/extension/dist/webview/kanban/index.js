/*
 * sonover-code — the Tickets screen (React), which shows Sonover's own tickets (through the host), not an instance's.
 *
 * Shipped by the original 0.1.1 build as a minified esbuild bundle; made readable here:
 * formatted, the app code's variables named and commented, icons named after themselves.
 * Library code (React, lucide-react, tailwind-merge, …) is marked by "──── Library: … ────"
 * comments and left as it was, names minified; "──── App: … ────" starts this extension's code.
 * build.mjs minifies this file into the package; package.sh proves (tools/same-code.mjs) that
 * the minified file is the same program. Rename with tools/rename.mjs, not by hand.
 */
// ──── Library: esbuild runtime helpers (bundled from npm; unchanged, names left minified) ────
var mg = Object.create;
var Us = Object.defineProperty;
var gg = Object.getOwnPropertyDescriptor;
var hg = Object.getOwnPropertyNames;
var xg = Object.getPrototypeOf,
  Lg = Object.prototype.hasOwnProperty;
var ie = (a, e) => () => {
  try {
    return e || a((e = {
      exports: {}
    }).exports, e), e.exports;
  } catch (t) {
    throw e = 0, t;
  }
};
var vg = (a, e, t, l) => {
  if (e && typeof e == "object" || typeof e == "function") for (let u of hg(e)) !Lg.call(a, u) && u !== t && Us(a, u, {
    get: () => e[u],
    enumerable: !(l = gg(e, u)) || l.enumerable
  });
  return a;
};
var sa = (a, e, t) => (t = a != null ? mg(xg(a)) : {}, vg(e || !a || !a.__esModule ? Us(t, "default", {
  value: a,
  enumerable: !0
}) : t, a));
// ──── Library: react 19.2.8, react-dom (client), scheduler, react/jsx-runtime (production builds) (bundled from npm; unchanged, names left minified) ────
var Xs = ie(J => {
  "use strict";

  function Nr(a, e) {
    var t = a.length;
    a.push(e);
    a: for (; 0 < t;) {
      var l = t - 1 >>> 1,
        u = a[l];
      if (0 < Yu(u, e)) a[l] = e, a[t] = u, t = l;else break a;
    }
  }
  function ne(a) {
    return a.length === 0 ? null : a[0];
  }
  function Qu(a) {
    if (a.length === 0) return null;
    var e = a[0],
      t = a.pop();
    if (t !== e) {
      a[0] = t;
      a: for (var l = 0, u = a.length, o = u >>> 1; l < o;) {
        var r = 2 * (l + 1) - 1,
          d = a[r],
          f = r + 1,
          s = a[f];
        if (0 > Yu(d, t)) f < u && 0 > Yu(s, d) ? (a[l] = s, a[f] = t, l = f) : (a[l] = d, a[r] = t, l = r);else if (f < u && 0 > Yu(s, t)) a[l] = s, a[f] = t, l = f;else break a;
      }
    }
    return e;
  }
  function Yu(a, e) {
    var t = a.sortIndex - e.sortIndex;
    return t !== 0 ? t : a.id - e.id;
  }
  J.unstable_now = void 0;
  typeof performance == "object" && typeof performance.now == "function" ? (qs = performance, J.unstable_now = function () {
    return qs.now();
  }) : (Hr = Date, Es = Hr.now(), J.unstable_now = function () {
    return Hr.now() - Es;
  });
  var qs,
    Hr,
    Es,
    ve = [],
    Pe = [],
    Sg = 1,
    ja = null,
    Ia = 3,
    _r = !1,
    Hl = !1,
    Fl = !1,
    Pr = !1,
    Gs = typeof setTimeout == "function" ? setTimeout : null,
    Ns = typeof clearTimeout == "function" ? clearTimeout : null,
    Hs = typeof setImmediate < "u" ? setImmediate : null;
  function ju(a) {
    for (var e = ne(Pe); e !== null;) {
      if (e.callback === null) Qu(Pe);else if (e.startTime <= a) Qu(Pe), e.sortIndex = e.expirationTime, Nr(ve, e);else break;
      e = ne(Pe);
    }
  }
  function Vr(a) {
    if (Fl = !1, ju(a), !Hl) if (ne(ve) !== null) Hl = !0, Xt || (Xt = !0, Vt());else {
      var e = ne(Pe);
      e !== null && Xr(Vr, e.startTime - a);
    }
  }
  var Xt = !1,
    Gl = -1,
    _s = 5,
    Ps = -1;
  function Vs() {
    return Pr ? !0 : !(J.unstable_now() - Ps < _s);
  }
  function Fr() {
    if (Pr = !1, Xt) {
      var a = J.unstable_now();
      Ps = a;
      var e = !0;
      try {
        a: {
          Hl = !1, Fl && (Fl = !1, Ns(Gl), Gl = -1), _r = !0;
          var t = Ia;
          try {
            e: {
              for (ju(a), ja = ne(ve); ja !== null && !(ja.expirationTime > a && Vs());) {
                var l = ja.callback;
                if (typeof l == "function") {
                  ja.callback = null, Ia = ja.priorityLevel;
                  var u = l(ja.expirationTime <= a);
                  if (a = J.unstable_now(), typeof u == "function") {
                    ja.callback = u, ju(a), e = !0;
                    break e;
                  }
                  ja === ne(ve) && Qu(ve), ju(a);
                } else Qu(ve);
                ja = ne(ve);
              }
              if (ja !== null) e = !0;else {
                var o = ne(Pe);
                o !== null && Xr(Vr, o.startTime - a), e = !1;
              }
            }
            break a;
          } finally {
            ja = null, Ia = t, _r = !1;
          }
          e = void 0;
        }
      } finally {
        e ? Vt() : Xt = !1;
      }
    }
  }
  var Vt;
  typeof Hs == "function" ? Vt = function () {
    Hs(Fr);
  } : typeof MessageChannel < "u" ? (Gr = new MessageChannel(), Fs = Gr.port2, Gr.port1.onmessage = Fr, Vt = function () {
    Fs.postMessage(null);
  }) : Vt = function () {
    Gs(Fr, 0);
  };
  var Gr, Fs;
  function Xr(a, e) {
    Gl = Gs(function () {
      a(J.unstable_now());
    }, e);
  }
  J.unstable_IdlePriority = 5;
  J.unstable_ImmediatePriority = 1;
  J.unstable_LowPriority = 4;
  J.unstable_NormalPriority = 3;
  J.unstable_Profiling = null;
  J.unstable_UserBlockingPriority = 2;
  J.unstable_cancelCallback = function (a) {
    a.callback = null;
  };
  J.unstable_forceFrameRate = function (a) {
    0 > a || 125 < a ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : _s = 0 < a ? Math.floor(1e3 / a) : 5;
  };
  J.unstable_getCurrentPriorityLevel = function () {
    return Ia;
  };
  J.unstable_next = function (a) {
    switch (Ia) {
      case 1:
      case 2:
      case 3:
        var e = 3;
        break;
      default:
        e = Ia;
    }
    var t = Ia;
    Ia = e;
    try {
      return a();
    } finally {
      Ia = t;
    }
  };
  J.unstable_requestPaint = function () {
    Pr = !0;
  };
  J.unstable_runWithPriority = function (a, e) {
    switch (a) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
        break;
      default:
        a = 3;
    }
    var t = Ia;
    Ia = a;
    try {
      return e();
    } finally {
      Ia = t;
    }
  };
  J.unstable_scheduleCallback = function (a, e, t) {
    var l = J.unstable_now();
    switch (typeof t == "object" && t !== null ? (t = t.delay, t = typeof t == "number" && 0 < t ? l + t : l) : t = l, a) {
      case 1:
        var u = -1;
        break;
      case 2:
        u = 250;
        break;
      case 5:
        u = 1073741823;
        break;
      case 4:
        u = 1e4;
        break;
      default:
        u = 5e3;
    }
    return u = t + u, a = {
      id: Sg++,
      callback: e,
      priorityLevel: a,
      startTime: t,
      expirationTime: u,
      sortIndex: -1
    }, t > l ? (a.sortIndex = t, Nr(Pe, a), ne(ve) === null && a === ne(Pe) && (Fl ? (Ns(Gl), Gl = -1) : Fl = !0, Xr(Vr, t - l))) : (a.sortIndex = u, Nr(ve, a), Hl || _r || (Hl = !0, Xt || (Xt = !0, Vt()))), a;
  };
  J.unstable_shouldYield = Vs;
  J.unstable_wrapCallback = function (a) {
    var e = Ia;
    return function () {
      var t = Ia;
      Ia = e;
      try {
        return a.apply(this, arguments);
      } finally {
        Ia = t;
      }
    };
  };
});
var Ys = ie((nv, Zs) => {
  "use strict";

  Zs.exports = Xs();
});
var ui = ie(B => {
  "use strict";

  var jr = Symbol.for("react.transitional.element"),
    bg = Symbol.for("react.portal"),
    yg = Symbol.for("react.fragment"),
    Cg = Symbol.for("react.strict_mode"),
    Ig = Symbol.for("react.profiler"),
    wg = Symbol.for("react.consumer"),
    Ag = Symbol.for("react.context"),
    kg = Symbol.for("react.forward_ref"),
    Mg = Symbol.for("react.suspense"),
    Tg = Symbol.for("react.memo"),
    Js = Symbol.for("react.lazy"),
    Dg = Symbol.for("react.activity"),
    js = Symbol.iterator;
  function Bg(a) {
    return a === null || typeof a != "object" ? null : (a = js && a[js] || a["@@iterator"], typeof a == "function" ? a : null);
  }
  var $s = {
      isMounted: function () {
        return !1;
      },
      enqueueForceUpdate: function () {},
      enqueueReplaceState: function () {},
      enqueueSetState: function () {}
    },
    ai = Object.assign,
    ei = {};
  function Yt(a, e, t) {
    this.props = a, this.context = e, this.refs = ei, this.updater = t || $s;
  }
  Yt.prototype.isReactComponent = {};
  Yt.prototype.setState = function (a, e) {
    if (typeof a != "object" && typeof a != "function" && a != null) throw Error("takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, a, e, "setState");
  };
  Yt.prototype.forceUpdate = function (a) {
    this.updater.enqueueForceUpdate(this, a, "forceUpdate");
  };
  function ti() {}
  ti.prototype = Yt.prototype;
  function Qr(a, e, t) {
    this.props = a, this.context = e, this.refs = ei, this.updater = t || $s;
  }
  var Kr = Qr.prototype = new ti();
  Kr.constructor = Qr;
  ai(Kr, Yt.prototype);
  Kr.isPureReactComponent = !0;
  var Qs = Array.isArray;
  function Yr() {}
  var j = {
      H: null,
      A: null,
      T: null,
      S: null
    },
    li = Object.prototype.hasOwnProperty;
  function Wr(a, e, t) {
    var l = t.ref;
    return {
      $$typeof: jr,
      type: a,
      key: e,
      ref: l !== void 0 ? l : null,
      props: t
    };
  }
  function Rg(a, e) {
    return Wr(a.type, e, a.props);
  }
  function Jr(a) {
    return typeof a == "object" && a !== null && a.$$typeof === jr;
  }
  function Og(a) {
    var e = {
      "=": "=0",
      ":": "=2"
    };
    return "$" + a.replace(/[=:]/g, function (t) {
      return e[t];
    });
  }
  var Ks = /\/+/g;
  function Zr(a, e) {
    return typeof a == "object" && a !== null && a.key != null ? Og("" + a.key) : e.toString(36);
  }
  function zg(a) {
    switch (a.status) {
      case "fulfilled":
        return a.value;
      case "rejected":
        throw a.reason;
      default:
        switch (typeof a.status == "string" ? a.then(Yr, Yr) : (a.status = "pending", a.then(function (e) {
          a.status === "pending" && (a.status = "fulfilled", a.value = e);
        }, function (e) {
          a.status === "pending" && (a.status = "rejected", a.reason = e);
        })), a.status) {
          case "fulfilled":
            return a.value;
          case "rejected":
            throw a.reason;
        }
    }
    throw a;
  }
  function Zt(a, e, t, l, u) {
    var o = typeof a;
    (o === "undefined" || o === "boolean") && (a = null);
    var r = !1;
    if (a === null) r = !0;else switch (o) {
      case "bigint":
      case "string":
      case "number":
        r = !0;
        break;
      case "object":
        switch (a.$$typeof) {
          case jr:
          case bg:
            r = !0;
            break;
          case Js:
            return r = a._init, Zt(r(a._payload), e, t, l, u);
        }
    }
    if (r) return u = u(a), r = l === "" ? "." + Zr(a, 0) : l, Qs(u) ? (t = "", r != null && (t = r.replace(Ks, "$&/") + "/"), Zt(u, e, t, "", function (s) {
      return s;
    })) : u != null && (Jr(u) && (u = Rg(u, t + (u.key == null || a && a.key === u.key ? "" : ("" + u.key).replace(Ks, "$&/") + "/") + r)), e.push(u)), 1;
    r = 0;
    var d = l === "" ? "." : l + ":";
    if (Qs(a)) for (var f = 0; f < a.length; f++) l = a[f], o = d + Zr(l, f), r += Zt(l, e, t, o, u);else if (f = Bg(a), typeof f == "function") for (a = f.call(a), f = 0; !(l = a.next()).done;) l = l.value, o = d + Zr(l, f++), r += Zt(l, e, t, o, u);else if (o === "object") {
      if (typeof a.then == "function") return Zt(zg(a), e, t, l, u);
      throw e = String(a), Error("Objects are not valid as a React child (found: " + (e === "[object Object]" ? "object with keys {" + Object.keys(a).join(", ") + "}" : e) + "). If you meant to render a collection of children, use an array instead.");
    }
    return r;
  }
  function Ku(a, e, t) {
    if (a == null) return a;
    var l = [],
      u = 0;
    return Zt(a, l, "", "", function (o) {
      return e.call(t, o, u++);
    }), l;
  }
  function Ug(a) {
    if (a._status === -1) {
      var e = a._result;
      e = e(), e.then(function (t) {
        (a._status === 0 || a._status === -1) && (a._status = 1, a._result = t);
      }, function (t) {
        (a._status === 0 || a._status === -1) && (a._status = 2, a._result = t);
      }), a._status === -1 && (a._status = 0, a._result = e);
    }
    if (a._status === 1) return a._result.default;
    throw a._result;
  }
  var Ws = typeof reportError == "function" ? reportError : function (a) {
      if (typeof window == "object" && typeof window.ErrorEvent == "function") {
        var e = new window.ErrorEvent("error", {
          bubbles: !0,
          cancelable: !0,
          message: typeof a == "object" && a !== null && typeof a.message == "string" ? String(a.message) : String(a),
          error: a
        });
        if (!window.dispatchEvent(e)) return;
      } else if (typeof process == "object" && typeof process.emit == "function") {
        process.emit("uncaughtException", a);
        return;
      }
      console.error(a);
    },
    qg = {
      map: Ku,
      forEach: function (a, e, t) {
        Ku(a, function () {
          e.apply(this, arguments);
        }, t);
      },
      count: function (a) {
        var e = 0;
        return Ku(a, function () {
          e++;
        }), e;
      },
      toArray: function (a) {
        return Ku(a, function (e) {
          return e;
        }) || [];
      },
      only: function (a) {
        if (!Jr(a)) throw Error("React.Children.only expected to receive a single React element child.");
        return a;
      }
    };
  B.Activity = Dg;
  B.Children = qg;
  B.Component = Yt;
  B.Fragment = yg;
  B.Profiler = Ig;
  B.PureComponent = Qr;
  B.StrictMode = Cg;
  B.Suspense = Mg;
  B.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = j;
  B.__COMPILER_RUNTIME = {
    __proto__: null,
    c: function (a) {
      return j.H.useMemoCache(a);
    }
  };
  B.cache = function (a) {
    return function () {
      return a.apply(null, arguments);
    };
  };
  B.cacheSignal = function () {
    return null;
  };
  B.cloneElement = function (a, e, t) {
    if (a == null) throw Error("The argument must be a React element, but you passed " + a + ".");
    var l = ai({}, a.props),
      u = a.key;
    if (e != null) for (o in e.key !== void 0 && (u = "" + e.key), e) !li.call(e, o) || o === "key" || o === "__self" || o === "__source" || o === "ref" && e.ref === void 0 || (l[o] = e[o]);
    var o = arguments.length - 2;
    if (o === 1) l.children = t;else if (1 < o) {
      for (var r = Array(o), d = 0; d < o; d++) r[d] = arguments[d + 2];
      l.children = r;
    }
    return Wr(a.type, u, l);
  };
  B.createContext = function (a) {
    return a = {
      $$typeof: Ag,
      _currentValue: a,
      _currentValue2: a,
      _threadCount: 0,
      Provider: null,
      Consumer: null
    }, a.Provider = a, a.Consumer = {
      $$typeof: wg,
      _context: a
    }, a;
  };
  B.createElement = function (a, e, t) {
    var l,
      u = {},
      o = null;
    if (e != null) for (l in e.key !== void 0 && (o = "" + e.key), e) li.call(e, l) && l !== "key" && l !== "__self" && l !== "__source" && (u[l] = e[l]);
    var r = arguments.length - 2;
    if (r === 1) u.children = t;else if (1 < r) {
      for (var d = Array(r), f = 0; f < r; f++) d[f] = arguments[f + 2];
      u.children = d;
    }
    if (a && a.defaultProps) for (l in r = a.defaultProps, r) u[l] === void 0 && (u[l] = r[l]);
    return Wr(a, o, u);
  };
  B.createRef = function () {
    return {
      current: null
    };
  };
  B.forwardRef = function (a) {
    return {
      $$typeof: kg,
      render: a
    };
  };
  B.isValidElement = Jr;
  B.lazy = function (a) {
    return {
      $$typeof: Js,
      _payload: {
        _status: -1,
        _result: a
      },
      _init: Ug
    };
  };
  B.memo = function (a, e) {
    return {
      $$typeof: Tg,
      type: a,
      compare: e === void 0 ? null : e
    };
  };
  B.startTransition = function (a) {
    var e = j.T,
      t = {};
    j.T = t;
    try {
      var l = a(),
        u = j.S;
      u !== null && u(t, l), typeof l == "object" && l !== null && typeof l.then == "function" && l.then(Yr, Ws);
    } catch (o) {
      Ws(o);
    } finally {
      e !== null && t.types !== null && (e.types = t.types), j.T = e;
    }
  };
  B.unstable_useCacheRefresh = function () {
    return j.H.useCacheRefresh();
  };
  B.use = function (a) {
    return j.H.use(a);
  };
  B.useActionState = function (a, e, t) {
    return j.H.useActionState(a, e, t);
  };
  B.useCallback = function (a, e) {
    return j.H.useCallback(a, e);
  };
  B.useContext = function (a) {
    return j.H.useContext(a);
  };
  B.useDebugValue = function () {};
  B.useDeferredValue = function (a, e) {
    return j.H.useDeferredValue(a, e);
  };
  B.useEffect = function (a, e) {
    return j.H.useEffect(a, e);
  };
  B.useEffectEvent = function (a) {
    return j.H.useEffectEvent(a);
  };
  B.useId = function () {
    return j.H.useId();
  };
  B.useImperativeHandle = function (a, e, t) {
    return j.H.useImperativeHandle(a, e, t);
  };
  B.useInsertionEffect = function (a, e) {
    return j.H.useInsertionEffect(a, e);
  };
  B.useLayoutEffect = function (a, e) {
    return j.H.useLayoutEffect(a, e);
  };
  B.useMemo = function (a, e) {
    return j.H.useMemo(a, e);
  };
  B.useOptimistic = function (a, e) {
    return j.H.useOptimistic(a, e);
  };
  B.useReducer = function (a, e, t) {
    return j.H.useReducer(a, e, t);
  };
  B.useRef = function (a) {
    return j.H.useRef(a);
  };
  B.useState = function (a) {
    return j.H.useState(a);
  };
  B.useSyncExternalStore = function (a, e, t) {
    return j.H.useSyncExternalStore(a, e, t);
  };
  B.useTransition = function () {
    return j.H.useTransition();
  };
  B.version = "19.2.8";
});
var Se = ie((pv, oi) => {
  "use strict";

  oi.exports = ui();
});
var di = ie(Ma => {
  "use strict";

  var Eg = Se();
  function ri(a) {
    var e = "https://react.dev/errors/" + a;
    if (1 < arguments.length) {
      e += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var t = 2; t < arguments.length; t++) e += "&args[]=" + encodeURIComponent(arguments[t]);
    }
    return "Minified React error #" + a + "; visit " + e + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function Ve() {}
  var ka = {
      d: {
        f: Ve,
        r: function () {
          throw Error(ri(522));
        },
        D: Ve,
        C: Ve,
        L: Ve,
        m: Ve,
        X: Ve,
        S: Ve,
        M: Ve
      },
      p: 0,
      findDOMNode: null
    },
    Hg = Symbol.for("react.portal");
  function Fg(a, e, t) {
    var l = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: Hg,
      key: l == null ? null : "" + l,
      children: a,
      containerInfo: e,
      implementation: t
    };
  }
  var Nl = Eg.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function Wu(a, e) {
    if (a === "font") return "";
    if (typeof e == "string") return e === "use-credentials" ? e : "";
  }
  Ma.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = ka;
  Ma.createPortal = function (a, e) {
    var t = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11) throw Error(ri(299));
    return Fg(a, e, null, t);
  };
  Ma.flushSync = function (a) {
    var e = Nl.T,
      t = ka.p;
    try {
      if (Nl.T = null, ka.p = 2, a) return a();
    } finally {
      Nl.T = e, ka.p = t, ka.d.f();
    }
  };
  Ma.preconnect = function (a, e) {
    typeof a == "string" && (e ? (e = e.crossOrigin, e = typeof e == "string" ? e === "use-credentials" ? e : "" : void 0) : e = null, ka.d.C(a, e));
  };
  Ma.prefetchDNS = function (a) {
    typeof a == "string" && ka.d.D(a);
  };
  Ma.preinit = function (a, e) {
    if (typeof a == "string" && e && typeof e.as == "string") {
      var t = e.as,
        l = Wu(t, e.crossOrigin),
        u = typeof e.integrity == "string" ? e.integrity : void 0,
        o = typeof e.fetchPriority == "string" ? e.fetchPriority : void 0;
      t === "style" ? ka.d.S(a, typeof e.precedence == "string" ? e.precedence : void 0, {
        crossOrigin: l,
        integrity: u,
        fetchPriority: o
      }) : t === "script" && ka.d.X(a, {
        crossOrigin: l,
        integrity: u,
        fetchPriority: o,
        nonce: typeof e.nonce == "string" ? e.nonce : void 0
      });
    }
  };
  Ma.preinitModule = function (a, e) {
    if (typeof a == "string") if (typeof e == "object" && e !== null) {
      if (e.as == null || e.as === "script") {
        var t = Wu(e.as, e.crossOrigin);
        ka.d.M(a, {
          crossOrigin: t,
          integrity: typeof e.integrity == "string" ? e.integrity : void 0,
          nonce: typeof e.nonce == "string" ? e.nonce : void 0
        });
      }
    } else e == null && ka.d.M(a);
  };
  Ma.preload = function (a, e) {
    if (typeof a == "string" && typeof e == "object" && e !== null && typeof e.as == "string") {
      var t = e.as,
        l = Wu(t, e.crossOrigin);
      ka.d.L(a, t, {
        crossOrigin: l,
        integrity: typeof e.integrity == "string" ? e.integrity : void 0,
        nonce: typeof e.nonce == "string" ? e.nonce : void 0,
        type: typeof e.type == "string" ? e.type : void 0,
        fetchPriority: typeof e.fetchPriority == "string" ? e.fetchPriority : void 0,
        referrerPolicy: typeof e.referrerPolicy == "string" ? e.referrerPolicy : void 0,
        imageSrcSet: typeof e.imageSrcSet == "string" ? e.imageSrcSet : void 0,
        imageSizes: typeof e.imageSizes == "string" ? e.imageSizes : void 0,
        media: typeof e.media == "string" ? e.media : void 0
      });
    }
  };
  Ma.preloadModule = function (a, e) {
    if (typeof a == "string") if (e) {
      var t = Wu(e.as, e.crossOrigin);
      ka.d.m(a, {
        as: typeof e.as == "string" && e.as !== "script" ? e.as : void 0,
        crossOrigin: t,
        integrity: typeof e.integrity == "string" ? e.integrity : void 0
      });
    } else ka.d.m(a);
  };
  Ma.requestFormReset = function (a) {
    ka.d.r(a);
  };
  Ma.unstable_batchedUpdates = function (a, e) {
    return a(e);
  };
  Ma.useFormState = function (a, e, t) {
    return Nl.H.useFormState(a, e, t);
  };
  Ma.useFormStatus = function () {
    return Nl.H.useHostTransitionStatus();
  };
  Ma.version = "19.2.8";
});
var ii = ie((gv, si) => {
  "use strict";

  function fi() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function")) try {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(fi);
    } catch (a) {
      console.error(a);
    }
  }
  fi(), si.exports = di();
});
var Cm = ie(Cr => {
  "use strict";

  var na = Ys(),
    En = Se(),
    Gg = ii();
  function L(a) {
    var e = "https://react.dev/errors/" + a;
    if (1 < arguments.length) {
      e += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var t = 2; t < arguments.length; t++) e += "&args[]=" + encodeURIComponent(arguments[t]);
    }
    return "Minified React error #" + a + "; visit " + e + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function Hn(a) {
    return !(!a || a.nodeType !== 1 && a.nodeType !== 9 && a.nodeType !== 11);
  }
  function ku(a) {
    var e = a,
      t = a;
    if (a.alternate) for (; e.return;) e = e.return;else {
      a = e;
      do e = a, (e.flags & 4098) !== 0 && (t = e.return), a = e.return; while (a);
    }
    return e.tag === 3 ? t : null;
  }
  function Fn(a) {
    if (a.tag === 13) {
      var e = a.memoizedState;
      if (e === null && (a = a.alternate, a !== null && (e = a.memoizedState)), e !== null) return e.dehydrated;
    }
    return null;
  }
  function Gn(a) {
    if (a.tag === 31) {
      var e = a.memoizedState;
      if (e === null && (a = a.alternate, a !== null && (e = a.memoizedState)), e !== null) return e.dehydrated;
    }
    return null;
  }
  function ni(a) {
    if (ku(a) !== a) throw Error(L(188));
  }
  function Ng(a) {
    var e = a.alternate;
    if (!e) {
      if (e = ku(a), e === null) throw Error(L(188));
      return e !== a ? null : a;
    }
    for (var t = a, l = e;;) {
      var u = t.return;
      if (u === null) break;
      var o = u.alternate;
      if (o === null) {
        if (l = u.return, l !== null) {
          t = l;
          continue;
        }
        break;
      }
      if (u.child === o.child) {
        for (o = u.child; o;) {
          if (o === t) return ni(u), a;
          if (o === l) return ni(u), e;
          o = o.sibling;
        }
        throw Error(L(188));
      }
      if (t.return !== l.return) t = u, l = o;else {
        for (var r = !1, d = u.child; d;) {
          if (d === t) {
            r = !0, t = u, l = o;
            break;
          }
          if (d === l) {
            r = !0, l = u, t = o;
            break;
          }
          d = d.sibling;
        }
        if (!r) {
          for (d = o.child; d;) {
            if (d === t) {
              r = !0, t = o, l = u;
              break;
            }
            if (d === l) {
              r = !0, l = o, t = u;
              break;
            }
            d = d.sibling;
          }
          if (!r) throw Error(L(189));
        }
      }
      if (t.alternate !== l) throw Error(L(190));
    }
    if (t.tag !== 3) throw Error(L(188));
    return t.stateNode.current === t ? a : e;
  }
  function Nn(a) {
    var e = a.tag;
    if (e === 5 || e === 26 || e === 27 || e === 6) return a;
    for (a = a.child; a !== null;) {
      if (e = Nn(a), e !== null) return e;
      a = a.sibling;
    }
    return null;
  }
  var W = Object.assign,
    _g = Symbol.for("react.element"),
    Ju = Symbol.for("react.transitional.element"),
    Ql = Symbol.for("react.portal"),
    $t = Symbol.for("react.fragment"),
    _n = Symbol.for("react.strict_mode"),
    Rd = Symbol.for("react.profiler"),
    Pn = Symbol.for("react.consumer"),
    Me = Symbol.for("react.context"),
    Mf = Symbol.for("react.forward_ref"),
    Od = Symbol.for("react.suspense"),
    zd = Symbol.for("react.suspense_list"),
    Tf = Symbol.for("react.memo"),
    Xe = Symbol.for("react.lazy"),
    Ud = Symbol.for("react.activity"),
    Pg = Symbol.for("react.memo_cache_sentinel"),
    ci = Symbol.iterator;
  function _l(a) {
    return a === null || typeof a != "object" ? null : (a = ci && a[ci] || a["@@iterator"], typeof a == "function" ? a : null);
  }
  var Vg = Symbol.for("react.client.reference");
  function qd(a) {
    if (a == null) return null;
    if (typeof a == "function") return a.$$typeof === Vg ? null : a.displayName || a.name || null;
    if (typeof a == "string") return a;
    switch (a) {
      case $t:
        return "Fragment";
      case Rd:
        return "Profiler";
      case _n:
        return "StrictMode";
      case Od:
        return "Suspense";
      case zd:
        return "SuspenseList";
      case Ud:
        return "Activity";
    }
    if (typeof a == "object") switch (a.$$typeof) {
      case Ql:
        return "Portal";
      case Me:
        return a.displayName || "Context";
      case Pn:
        return (a._context.displayName || "Context") + ".Consumer";
      case Mf:
        var e = a.render;
        return a = a.displayName, a || (a = e.displayName || e.name || "", a = a !== "" ? "ForwardRef(" + a + ")" : "ForwardRef"), a;
      case Tf:
        return e = a.displayName || null, e !== null ? e : qd(a.type) || "Memo";
      case Xe:
        e = a._payload, a = a._init;
        try {
          return qd(a(e));
        } catch {}
    }
    return null;
  }
  var Kl = Array.isArray,
    D = En.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
    N = Gg.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
    wt = {
      pending: !1,
      data: null,
      method: null,
      action: null
    },
    Ed = [],
    al = -1;
  function he(a) {
    return {
      current: a
    };
  }
  function xa(a) {
    0 > al || (a.current = Ed[al], Ed[al] = null, al--);
  }
  function Y(a, e) {
    al++, Ed[al] = a.current, a.current = e;
  }
  var ge = he(null),
    pu = he(null),
    tt = he(null),
    Ro = he(null);
  function Oo(a, e) {
    switch (Y(tt, e), Y(pu, a), Y(ge, null), e.nodeType) {
      case 9:
      case 11:
        a = (a = e.documentElement) && (a = a.namespaceURI) ? Sn(a) : 0;
        break;
      default:
        if (a = e.tagName, e = e.namespaceURI) e = Sn(e), a = sm(e, a);else switch (a) {
          case "svg":
            a = 1;
            break;
          case "math":
            a = 2;
            break;
          default:
            a = 0;
        }
    }
    xa(ge), Y(ge, a);
  }
  function Ll() {
    xa(ge), xa(pu), xa(tt);
  }
  function Hd(a) {
    a.memoizedState !== null && Y(Ro, a);
    var e = ge.current,
      t = sm(e, a.type);
    e !== t && (Y(pu, a), Y(ge, t));
  }
  function zo(a) {
    pu.current === a && (xa(ge), xa(pu)), Ro.current === a && (xa(Ro), Iu._currentValue = wt);
  }
  var $r, pi;
  function bt(a) {
    if ($r === void 0) try {
      throw Error();
    } catch (t) {
      var e = t.stack.trim().match(/\n( *(at )?)/);
      $r = e && e[1] || "", pi = -1 < t.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < t.stack.indexOf("@") ? "@unknown:0:0" : "";
    }
    return `
` + $r + a + pi;
  }
  var ad = !1;
  function ed(a, e) {
    if (!a || ad) return "";
    ad = !0;
    var t = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      var l = {
        DetermineComponentFrameRoot: function () {
          try {
            if (e) {
              var h = function () {
                throw Error();
              };
              if (Object.defineProperty(h.prototype, "props", {
                set: function () {
                  throw Error();
                }
              }), typeof Reflect == "object" && Reflect.construct) {
                try {
                  Reflect.construct(h, []);
                } catch (m) {
                  var c = m;
                }
                Reflect.construct(a, [], h);
              } else {
                try {
                  h.call();
                } catch (m) {
                  c = m;
                }
                a.call(h.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (m) {
                c = m;
              }
              (h = a()) && typeof h.catch == "function" && h.catch(function () {});
            }
          } catch (m) {
            if (m && c && typeof m.stack == "string") return [m.stack, c.stack];
          }
          return [null, null];
        }
      };
      l.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
      var u = Object.getOwnPropertyDescriptor(l.DetermineComponentFrameRoot, "name");
      u && u.configurable && Object.defineProperty(l.DetermineComponentFrameRoot, "name", {
        value: "DetermineComponentFrameRoot"
      });
      var o = l.DetermineComponentFrameRoot(),
        r = o[0],
        d = o[1];
      if (r && d) {
        var f = r.split(`
`),
          s = d.split(`
`);
        for (u = l = 0; l < f.length && !f[l].includes("DetermineComponentFrameRoot");) l++;
        for (; u < s.length && !s[u].includes("DetermineComponentFrameRoot");) u++;
        if (l === f.length || u === s.length) for (l = f.length - 1, u = s.length - 1; 1 <= l && 0 <= u && f[l] !== s[u];) u--;
        for (; 1 <= l && 0 <= u; l--, u--) if (f[l] !== s[u]) {
          if (l !== 1 || u !== 1) do if (l--, u--, 0 > u || f[l] !== s[u]) {
            var g = `
` + f[l].replace(" at new ", " at ");
            return a.displayName && g.includes("<anonymous>") && (g = g.replace("<anonymous>", a.displayName)), g;
          } while (1 <= l && 0 <= u);
          break;
        }
      }
    } finally {
      ad = !1, Error.prepareStackTrace = t;
    }
    return (t = a ? a.displayName || a.name : "") ? bt(t) : "";
  }
  function Xg(a, e) {
    switch (a.tag) {
      case 26:
      case 27:
      case 5:
        return bt(a.type);
      case 16:
        return bt("Lazy");
      case 13:
        return a.child !== e && e !== null ? bt("Suspense Fallback") : bt("Suspense");
      case 19:
        return bt("SuspenseList");
      case 0:
      case 15:
        return ed(a.type, !1);
      case 11:
        return ed(a.type.render, !1);
      case 1:
        return ed(a.type, !0);
      case 31:
        return bt("Activity");
      default:
        return "";
    }
  }
  function mi(a) {
    try {
      var e = "",
        t = null;
      do e += Xg(a, t), t = a, a = a.return; while (a);
      return e;
    } catch (l) {
      return `
Error generating stack: ` + l.message + `
` + l.stack;
    }
  }
  var Fd = Object.prototype.hasOwnProperty,
    Df = na.unstable_scheduleCallback,
    td = na.unstable_cancelCallback,
    Zg = na.unstable_shouldYield,
    Yg = na.unstable_requestPaint,
    Na = na.unstable_now,
    jg = na.unstable_getCurrentPriorityLevel,
    Vn = na.unstable_ImmediatePriority,
    Xn = na.unstable_UserBlockingPriority,
    Uo = na.unstable_NormalPriority,
    Qg = na.unstable_LowPriority,
    Zn = na.unstable_IdlePriority,
    Kg = na.log,
    Wg = na.unstable_setDisableYieldValue,
    Mu = null,
    _a = null;
  function We(a) {
    if (typeof Kg == "function" && Wg(a), _a && typeof _a.setStrictMode == "function") try {
      _a.setStrictMode(Mu, a);
    } catch {}
  }
  var Pa = Math.clz32 ? Math.clz32 : ah,
    Jg = Math.log,
    $g = Math.LN2;
  function ah(a) {
    return a >>>= 0, a === 0 ? 32 : 31 - (Jg(a) / $g | 0) | 0;
  }
  var $u = 256,
    ao = 262144,
    eo = 4194304;
  function yt(a) {
    var e = a & 42;
    if (e !== 0) return e;
    switch (a & -a) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 4:
        return 4;
      case 8:
        return 8;
      case 16:
        return 16;
      case 32:
        return 32;
      case 64:
        return 64;
      case 128:
        return 128;
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
        return a & 261888;
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return a & 3932160;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return a & 62914560;
      case 67108864:
        return 67108864;
      case 134217728:
        return 134217728;
      case 268435456:
        return 268435456;
      case 536870912:
        return 536870912;
      case 1073741824:
        return 0;
      default:
        return a;
    }
  }
  function dr(a, e, t) {
    var l = a.pendingLanes;
    if (l === 0) return 0;
    var u = 0,
      o = a.suspendedLanes,
      r = a.pingedLanes;
    a = a.warmLanes;
    var d = l & 134217727;
    return d !== 0 ? (l = d & ~o, l !== 0 ? u = yt(l) : (r &= d, r !== 0 ? u = yt(r) : t || (t = d & ~a, t !== 0 && (u = yt(t))))) : (d = l & ~o, d !== 0 ? u = yt(d) : r !== 0 ? u = yt(r) : t || (t = l & ~a, t !== 0 && (u = yt(t)))), u === 0 ? 0 : e !== 0 && e !== u && (e & o) === 0 && (o = u & -u, t = e & -e, o >= t || o === 32 && (t & 4194048) !== 0) ? e : u;
  }
  function Tu(a, e) {
    return (a.pendingLanes & ~(a.suspendedLanes & ~a.pingedLanes) & e) === 0;
  }
  function eh(a, e) {
    switch (a) {
      case 1:
      case 2:
      case 4:
      case 8:
      case 64:
        return e + 250;
      case 16:
      case 32:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return e + 5e3;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return -1;
      case 67108864:
      case 134217728:
      case 268435456:
      case 536870912:
      case 1073741824:
        return -1;
      default:
        return -1;
    }
  }
  function Yn() {
    var a = eo;
    return eo <<= 1, (eo & 62914560) === 0 && (eo = 4194304), a;
  }
  function ld(a) {
    for (var e = [], t = 0; 31 > t; t++) e.push(a);
    return e;
  }
  function Du(a, e) {
    a.pendingLanes |= e, e !== 268435456 && (a.suspendedLanes = 0, a.pingedLanes = 0, a.warmLanes = 0);
  }
  function th(a, e, t, l, u, o) {
    var r = a.pendingLanes;
    a.pendingLanes = t, a.suspendedLanes = 0, a.pingedLanes = 0, a.warmLanes = 0, a.expiredLanes &= t, a.entangledLanes &= t, a.errorRecoveryDisabledLanes &= t, a.shellSuspendCounter = 0;
    var d = a.entanglements,
      f = a.expirationTimes,
      s = a.hiddenUpdates;
    for (t = r & ~t; 0 < t;) {
      var g = 31 - Pa(t),
        h = 1 << g;
      d[g] = 0, f[g] = -1;
      var c = s[g];
      if (c !== null) for (s[g] = null, g = 0; g < c.length; g++) {
        var m = c[g];
        m !== null && (m.lane &= -536870913);
      }
      t &= ~h;
    }
    l !== 0 && jn(a, l, 0), o !== 0 && u === 0 && a.tag !== 0 && (a.suspendedLanes |= o & ~(r & ~e));
  }
  function jn(a, e, t) {
    a.pendingLanes |= e, a.suspendedLanes &= ~e;
    var l = 31 - Pa(e);
    a.entangledLanes |= e, a.entanglements[l] = a.entanglements[l] | 1073741824 | t & 261930;
  }
  function Qn(a, e) {
    var t = a.entangledLanes |= e;
    for (a = a.entanglements; t;) {
      var l = 31 - Pa(t),
        u = 1 << l;
      u & e | a[l] & e && (a[l] |= e), t &= ~u;
    }
  }
  function Kn(a, e) {
    var t = e & -e;
    return t = (t & 42) !== 0 ? 1 : Bf(t), (t & (a.suspendedLanes | e)) !== 0 ? 0 : t;
  }
  function Bf(a) {
    switch (a) {
      case 2:
        a = 1;
        break;
      case 8:
        a = 4;
        break;
      case 32:
        a = 16;
        break;
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        a = 128;
        break;
      case 268435456:
        a = 134217728;
        break;
      default:
        a = 0;
    }
    return a;
  }
  function Rf(a) {
    return a &= -a, 2 < a ? 8 < a ? (a & 134217727) !== 0 ? 32 : 268435456 : 8 : 2;
  }
  function Wn() {
    var a = N.p;
    return a !== 0 ? a : (a = window.event, a === void 0 ? 32 : Sm(a.type));
  }
  function gi(a, e) {
    var t = N.p;
    try {
      return N.p = a, e();
    } finally {
      N.p = t;
    }
  }
  var gt = Math.random().toString(36).slice(2),
    va = "__reactFiber$" + gt,
    Ua = "__reactProps$" + gt,
    Tl = "__reactContainer$" + gt,
    Gd = "__reactEvents$" + gt,
    lh = "__reactListeners$" + gt,
    uh = "__reactHandles$" + gt,
    hi = "__reactResources$" + gt,
    Bu = "__reactMarker$" + gt;
  function Of(a) {
    delete a[va], delete a[Ua], delete a[Gd], delete a[lh], delete a[uh];
  }
  function el(a) {
    var e = a[va];
    if (e) return e;
    for (var t = a.parentNode; t;) {
      if (e = t[Tl] || t[va]) {
        if (t = e.alternate, e.child !== null || t !== null && t.child !== null) for (a = wn(a); a !== null;) {
          if (t = a[va]) return t;
          a = wn(a);
        }
        return e;
      }
      a = t, t = a.parentNode;
    }
    return null;
  }
  function Dl(a) {
    if (a = a[va] || a[Tl]) {
      var e = a.tag;
      if (e === 5 || e === 6 || e === 13 || e === 31 || e === 26 || e === 27 || e === 3) return a;
    }
    return null;
  }
  function Wl(a) {
    var e = a.tag;
    if (e === 5 || e === 26 || e === 27 || e === 6) return a.stateNode;
    throw Error(L(33));
  }
  function nl(a) {
    var e = a[hi];
    return e || (e = a[hi] = {
      hoistableStyles: new Map(),
      hoistableScripts: new Map()
    }), e;
  }
  function ha(a) {
    a[Bu] = !0;
  }
  var Jn = new Set(),
    $n = {};
  function Ut(a, e) {
    vl(a, e), vl(a + "Capture", e);
  }
  function vl(a, e) {
    for ($n[a] = e, a = 0; a < e.length; a++) Jn.add(e[a]);
  }
  var oh = RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"),
    xi = {},
    Li = {};
  function rh(a) {
    return Fd.call(Li, a) ? !0 : Fd.call(xi, a) ? !1 : oh.test(a) ? Li[a] = !0 : (xi[a] = !0, !1);
  }
  function xo(a, e, t) {
    if (rh(e)) if (t === null) a.removeAttribute(e);else {
      switch (typeof t) {
        case "undefined":
        case "function":
        case "symbol":
          a.removeAttribute(e);
          return;
        case "boolean":
          var l = e.toLowerCase().slice(0, 5);
          if (l !== "data-" && l !== "aria-") {
            a.removeAttribute(e);
            return;
          }
      }
      a.setAttribute(e, "" + t);
    }
  }
  function to(a, e, t) {
    if (t === null) a.removeAttribute(e);else {
      switch (typeof t) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          a.removeAttribute(e);
          return;
      }
      a.setAttribute(e, "" + t);
    }
  }
  function be(a, e, t, l) {
    if (l === null) a.removeAttribute(t);else {
      switch (typeof l) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          a.removeAttribute(t);
          return;
      }
      a.setAttributeNS(e, t, "" + l);
    }
  }
  function Ka(a) {
    switch (typeof a) {
      case "bigint":
      case "boolean":
      case "number":
      case "string":
      case "undefined":
        return a;
      case "object":
        return a;
      default:
        return "";
    }
  }
  function ac(a) {
    var e = a.type;
    return (a = a.nodeName) && a.toLowerCase() === "input" && (e === "checkbox" || e === "radio");
  }
  function dh(a, e, t) {
    var l = Object.getOwnPropertyDescriptor(a.constructor.prototype, e);
    if (!a.hasOwnProperty(e) && typeof l < "u" && typeof l.get == "function" && typeof l.set == "function") {
      var u = l.get,
        o = l.set;
      return Object.defineProperty(a, e, {
        configurable: !0,
        get: function () {
          return u.call(this);
        },
        set: function (r) {
          t = "" + r, o.call(this, r);
        }
      }), Object.defineProperty(a, e, {
        enumerable: l.enumerable
      }), {
        getValue: function () {
          return t;
        },
        setValue: function (r) {
          t = "" + r;
        },
        stopTracking: function () {
          a._valueTracker = null, delete a[e];
        }
      };
    }
  }
  function Nd(a) {
    if (!a._valueTracker) {
      var e = ac(a) ? "checked" : "value";
      a._valueTracker = dh(a, e, "" + a[e]);
    }
  }
  function ec(a) {
    if (!a) return !1;
    var e = a._valueTracker;
    if (!e) return !0;
    var t = e.getValue(),
      l = "";
    return a && (l = ac(a) ? a.checked ? "true" : "false" : a.value), a = l, a !== t ? (e.setValue(a), !0) : !1;
  }
  function qo(a) {
    if (a = a || (typeof document < "u" ? document : void 0), typeof a > "u") return null;
    try {
      return a.activeElement || a.body;
    } catch {
      return a.body;
    }
  }
  var fh = /[\n"\\]/g;
  function $a(a) {
    return a.replace(fh, function (e) {
      return "\\" + e.charCodeAt(0).toString(16) + " ";
    });
  }
  function _d(a, e, t, l, u, o, r, d) {
    a.name = "", r != null && typeof r != "function" && typeof r != "symbol" && typeof r != "boolean" ? a.type = r : a.removeAttribute("type"), e != null ? r === "number" ? (e === 0 && a.value === "" || a.value != e) && (a.value = "" + Ka(e)) : a.value !== "" + Ka(e) && (a.value = "" + Ka(e)) : r !== "submit" && r !== "reset" || a.removeAttribute("value"), e != null ? Pd(a, r, Ka(e)) : t != null ? Pd(a, r, Ka(t)) : l != null && a.removeAttribute("value"), u == null && o != null && (a.defaultChecked = !!o), u != null && (a.checked = u && typeof u != "function" && typeof u != "symbol"), d != null && typeof d != "function" && typeof d != "symbol" && typeof d != "boolean" ? a.name = "" + Ka(d) : a.removeAttribute("name");
  }
  function tc(a, e, t, l, u, o, r, d) {
    if (o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean" && (a.type = o), e != null || t != null) {
      if (!(o !== "submit" && o !== "reset" || e != null)) {
        Nd(a);
        return;
      }
      t = t != null ? "" + Ka(t) : "", e = e != null ? "" + Ka(e) : t, d || e === a.value || (a.value = e), a.defaultValue = e;
    }
    l = l ?? u, l = typeof l != "function" && typeof l != "symbol" && !!l, a.checked = d ? a.checked : !!l, a.defaultChecked = !!l, r != null && typeof r != "function" && typeof r != "symbol" && typeof r != "boolean" && (a.name = r), Nd(a);
  }
  function Pd(a, e, t) {
    e === "number" && qo(a.ownerDocument) === a || a.defaultValue === "" + t || (a.defaultValue = "" + t);
  }
  function cl(a, e, t, l) {
    if (a = a.options, e) {
      e = {};
      for (var u = 0; u < t.length; u++) e["$" + t[u]] = !0;
      for (t = 0; t < a.length; t++) u = e.hasOwnProperty("$" + a[t].value), a[t].selected !== u && (a[t].selected = u), u && l && (a[t].defaultSelected = !0);
    } else {
      for (t = "" + Ka(t), e = null, u = 0; u < a.length; u++) {
        if (a[u].value === t) {
          a[u].selected = !0, l && (a[u].defaultSelected = !0);
          return;
        }
        e !== null || a[u].disabled || (e = a[u]);
      }
      e !== null && (e.selected = !0);
    }
  }
  function lc(a, e, t) {
    if (e != null && (e = "" + Ka(e), e !== a.value && (a.value = e), t == null)) {
      a.defaultValue !== e && (a.defaultValue = e);
      return;
    }
    a.defaultValue = t != null ? "" + Ka(t) : "";
  }
  function uc(a, e, t, l) {
    if (e == null) {
      if (l != null) {
        if (t != null) throw Error(L(92));
        if (Kl(l)) {
          if (1 < l.length) throw Error(L(93));
          l = l[0];
        }
        t = l;
      }
      t == null && (t = ""), e = t;
    }
    t = Ka(e), a.defaultValue = t, l = a.textContent, l === t && l !== "" && l !== null && (a.value = l), Nd(a);
  }
  function Sl(a, e) {
    if (e) {
      var t = a.firstChild;
      if (t && t === a.lastChild && t.nodeType === 3) {
        t.nodeValue = e;
        return;
      }
    }
    a.textContent = e;
  }
  var sh = new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));
  function vi(a, e, t) {
    var l = e.indexOf("--") === 0;
    t == null || typeof t == "boolean" || t === "" ? l ? a.setProperty(e, "") : e === "float" ? a.cssFloat = "" : a[e] = "" : l ? a.setProperty(e, t) : typeof t != "number" || t === 0 || sh.has(e) ? e === "float" ? a.cssFloat = t : a[e] = ("" + t).trim() : a[e] = t + "px";
  }
  function oc(a, e, t) {
    if (e != null && typeof e != "object") throw Error(L(62));
    if (a = a.style, t != null) {
      for (var l in t) !t.hasOwnProperty(l) || e != null && e.hasOwnProperty(l) || (l.indexOf("--") === 0 ? a.setProperty(l, "") : l === "float" ? a.cssFloat = "" : a[l] = "");
      for (var u in e) l = e[u], e.hasOwnProperty(u) && t[u] !== l && vi(a, u, l);
    } else for (var o in e) e.hasOwnProperty(o) && vi(a, o, e[o]);
  }
  function zf(a) {
    if (a.indexOf("-") === -1) return !1;
    switch (a) {
      case "annotation-xml":
      case "color-profile":
      case "font-face":
      case "font-face-src":
      case "font-face-uri":
      case "font-face-format":
      case "font-face-name":
      case "missing-glyph":
        return !1;
      default:
        return !0;
    }
  }
  var ih = new Map([["acceptCharset", "accept-charset"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"], ["crossOrigin", "crossorigin"], ["accentHeight", "accent-height"], ["alignmentBaseline", "alignment-baseline"], ["arabicForm", "arabic-form"], ["baselineShift", "baseline-shift"], ["capHeight", "cap-height"], ["clipPath", "clip-path"], ["clipRule", "clip-rule"], ["colorInterpolation", "color-interpolation"], ["colorInterpolationFilters", "color-interpolation-filters"], ["colorProfile", "color-profile"], ["colorRendering", "color-rendering"], ["dominantBaseline", "dominant-baseline"], ["enableBackground", "enable-background"], ["fillOpacity", "fill-opacity"], ["fillRule", "fill-rule"], ["floodColor", "flood-color"], ["floodOpacity", "flood-opacity"], ["fontFamily", "font-family"], ["fontSize", "font-size"], ["fontSizeAdjust", "font-size-adjust"], ["fontStretch", "font-stretch"], ["fontStyle", "font-style"], ["fontVariant", "font-variant"], ["fontWeight", "font-weight"], ["glyphName", "glyph-name"], ["glyphOrientationHorizontal", "glyph-orientation-horizontal"], ["glyphOrientationVertical", "glyph-orientation-vertical"], ["horizAdvX", "horiz-adv-x"], ["horizOriginX", "horiz-origin-x"], ["imageRendering", "image-rendering"], ["letterSpacing", "letter-spacing"], ["lightingColor", "lighting-color"], ["markerEnd", "marker-end"], ["markerMid", "marker-mid"], ["markerStart", "marker-start"], ["overlinePosition", "overline-position"], ["overlineThickness", "overline-thickness"], ["paintOrder", "paint-order"], ["panose-1", "panose-1"], ["pointerEvents", "pointer-events"], ["renderingIntent", "rendering-intent"], ["shapeRendering", "shape-rendering"], ["stopColor", "stop-color"], ["stopOpacity", "stop-opacity"], ["strikethroughPosition", "strikethrough-position"], ["strikethroughThickness", "strikethrough-thickness"], ["strokeDasharray", "stroke-dasharray"], ["strokeDashoffset", "stroke-dashoffset"], ["strokeLinecap", "stroke-linecap"], ["strokeLinejoin", "stroke-linejoin"], ["strokeMiterlimit", "stroke-miterlimit"], ["strokeOpacity", "stroke-opacity"], ["strokeWidth", "stroke-width"], ["textAnchor", "text-anchor"], ["textDecoration", "text-decoration"], ["textRendering", "text-rendering"], ["transformOrigin", "transform-origin"], ["underlinePosition", "underline-position"], ["underlineThickness", "underline-thickness"], ["unicodeBidi", "unicode-bidi"], ["unicodeRange", "unicode-range"], ["unitsPerEm", "units-per-em"], ["vAlphabetic", "v-alphabetic"], ["vHanging", "v-hanging"], ["vIdeographic", "v-ideographic"], ["vMathematical", "v-mathematical"], ["vectorEffect", "vector-effect"], ["vertAdvY", "vert-adv-y"], ["vertOriginX", "vert-origin-x"], ["vertOriginY", "vert-origin-y"], ["wordSpacing", "word-spacing"], ["writingMode", "writing-mode"], ["xmlnsXlink", "xmlns:xlink"], ["xHeight", "x-height"]]),
    nh = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function Lo(a) {
    return nh.test("" + a) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : a;
  }
  function Te() {}
  var Vd = null;
  function Uf(a) {
    return a = a.target || a.srcElement || window, a.correspondingUseElement && (a = a.correspondingUseElement), a.nodeType === 3 ? a.parentNode : a;
  }
  var tl = null,
    pl = null;
  function Si(a) {
    var e = Dl(a);
    if (e && (a = e.stateNode)) {
      var t = a[Ua] || null;
      a: switch (a = e.stateNode, e.type) {
        case "input":
          if (_d(a, t.value, t.defaultValue, t.defaultValue, t.checked, t.defaultChecked, t.type, t.name), e = t.name, t.type === "radio" && e != null) {
            for (t = a; t.parentNode;) t = t.parentNode;
            for (t = t.querySelectorAll('input[name="' + $a("" + e) + '"][type="radio"]'), e = 0; e < t.length; e++) {
              var l = t[e];
              if (l !== a && l.form === a.form) {
                var u = l[Ua] || null;
                if (!u) throw Error(L(90));
                _d(l, u.value, u.defaultValue, u.defaultValue, u.checked, u.defaultChecked, u.type, u.name);
              }
            }
            for (e = 0; e < t.length; e++) l = t[e], l.form === a.form && ec(l);
          }
          break a;
        case "textarea":
          lc(a, t.value, t.defaultValue);
          break a;
        case "select":
          e = t.value, e != null && cl(a, !!t.multiple, e, !1);
      }
    }
  }
  var ud = !1;
  function rc(a, e, t) {
    if (ud) return a(e, t);
    ud = !0;
    try {
      var l = a(e);
      return l;
    } finally {
      if (ud = !1, (tl !== null || pl !== null) && (vr(), tl && (e = tl, a = pl, pl = tl = null, Si(e), a))) for (e = 0; e < a.length; e++) Si(a[e]);
    }
  }
  function mu(a, e) {
    var t = a.stateNode;
    if (t === null) return null;
    var l = t[Ua] || null;
    if (l === null) return null;
    t = l[e];
    a: switch (e) {
      case "onClick":
      case "onClickCapture":
      case "onDoubleClick":
      case "onDoubleClickCapture":
      case "onMouseDown":
      case "onMouseDownCapture":
      case "onMouseMove":
      case "onMouseMoveCapture":
      case "onMouseUp":
      case "onMouseUpCapture":
      case "onMouseEnter":
        (l = !l.disabled) || (a = a.type, l = !(a === "button" || a === "input" || a === "select" || a === "textarea")), a = !l;
        break a;
      default:
        a = !1;
    }
    if (a) return null;
    if (t && typeof t != "function") throw Error(L(231, e, typeof t));
    return t;
  }
  var ze = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"),
    Xd = !1;
  if (ze) try {
    jt = {}, Object.defineProperty(jt, "passive", {
      get: function () {
        Xd = !0;
      }
    }), window.addEventListener("test", jt, jt), window.removeEventListener("test", jt, jt);
  } catch {
    Xd = !1;
  }
  var jt,
    Je = null,
    qf = null,
    vo = null;
  function dc() {
    if (vo) return vo;
    var a,
      e = qf,
      t = e.length,
      l,
      u = "value" in Je ? Je.value : Je.textContent,
      o = u.length;
    for (a = 0; a < t && e[a] === u[a]; a++);
    var r = t - a;
    for (l = 1; l <= r && e[t - l] === u[o - l]; l++);
    return vo = u.slice(a, 1 < l ? 1 - l : void 0);
  }
  function So(a) {
    var e = a.keyCode;
    return "charCode" in a ? (a = a.charCode, a === 0 && e === 13 && (a = 13)) : a = e, a === 10 && (a = 13), 32 <= a || a === 13 ? a : 0;
  }
  function lo() {
    return !0;
  }
  function bi() {
    return !1;
  }
  function qa(a) {
    function e(t, l, u, o, r) {
      this._reactName = t, this._targetInst = u, this.type = l, this.nativeEvent = o, this.target = r, this.currentTarget = null;
      for (var d in a) a.hasOwnProperty(d) && (t = a[d], this[d] = t ? t(o) : o[d]);
      return this.isDefaultPrevented = (o.defaultPrevented != null ? o.defaultPrevented : o.returnValue === !1) ? lo : bi, this.isPropagationStopped = bi, this;
    }
    return W(e.prototype, {
      preventDefault: function () {
        this.defaultPrevented = !0;
        var t = this.nativeEvent;
        t && (t.preventDefault ? t.preventDefault() : typeof t.returnValue != "unknown" && (t.returnValue = !1), this.isDefaultPrevented = lo);
      },
      stopPropagation: function () {
        var t = this.nativeEvent;
        t && (t.stopPropagation ? t.stopPropagation() : typeof t.cancelBubble != "unknown" && (t.cancelBubble = !0), this.isPropagationStopped = lo);
      },
      persist: function () {},
      isPersistent: lo
    }), e;
  }
  var qt = {
      eventPhase: 0,
      bubbles: 0,
      cancelable: 0,
      timeStamp: function (a) {
        return a.timeStamp || Date.now();
      },
      defaultPrevented: 0,
      isTrusted: 0
    },
    fr = qa(qt),
    Ru = W({}, qt, {
      view: 0,
      detail: 0
    }),
    ch = qa(Ru),
    od,
    rd,
    Pl,
    sr = W({}, Ru, {
      screenX: 0,
      screenY: 0,
      clientX: 0,
      clientY: 0,
      pageX: 0,
      pageY: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      getModifierState: Ef,
      button: 0,
      buttons: 0,
      relatedTarget: function (a) {
        return a.relatedTarget === void 0 ? a.fromElement === a.srcElement ? a.toElement : a.fromElement : a.relatedTarget;
      },
      movementX: function (a) {
        return "movementX" in a ? a.movementX : (a !== Pl && (Pl && a.type === "mousemove" ? (od = a.screenX - Pl.screenX, rd = a.screenY - Pl.screenY) : rd = od = 0, Pl = a), od);
      },
      movementY: function (a) {
        return "movementY" in a ? a.movementY : rd;
      }
    }),
    yi = qa(sr),
    ph = W({}, sr, {
      dataTransfer: 0
    }),
    mh = qa(ph),
    gh = W({}, Ru, {
      relatedTarget: 0
    }),
    dd = qa(gh),
    hh = W({}, qt, {
      animationName: 0,
      elapsedTime: 0,
      pseudoElement: 0
    }),
    xh = qa(hh),
    Lh = W({}, qt, {
      clipboardData: function (a) {
        return "clipboardData" in a ? a.clipboardData : window.clipboardData;
      }
    }),
    vh = qa(Lh),
    Sh = W({}, qt, {
      data: 0
    }),
    Ci = qa(Sh),
    bh = {
      Esc: "Escape",
      Spacebar: " ",
      Left: "ArrowLeft",
      Up: "ArrowUp",
      Right: "ArrowRight",
      Down: "ArrowDown",
      Del: "Delete",
      Win: "OS",
      Menu: "ContextMenu",
      Apps: "ContextMenu",
      Scroll: "ScrollLock",
      MozPrintableKey: "Unidentified"
    },
    yh = {
      8: "Backspace",
      9: "Tab",
      12: "Clear",
      13: "Enter",
      16: "Shift",
      17: "Control",
      18: "Alt",
      19: "Pause",
      20: "CapsLock",
      27: "Escape",
      32: " ",
      33: "PageUp",
      34: "PageDown",
      35: "End",
      36: "Home",
      37: "ArrowLeft",
      38: "ArrowUp",
      39: "ArrowRight",
      40: "ArrowDown",
      45: "Insert",
      46: "Delete",
      112: "F1",
      113: "F2",
      114: "F3",
      115: "F4",
      116: "F5",
      117: "F6",
      118: "F7",
      119: "F8",
      120: "F9",
      121: "F10",
      122: "F11",
      123: "F12",
      144: "NumLock",
      145: "ScrollLock",
      224: "Meta"
    },
    Ch = {
      Alt: "altKey",
      Control: "ctrlKey",
      Meta: "metaKey",
      Shift: "shiftKey"
    };
  function Ih(a) {
    var e = this.nativeEvent;
    return e.getModifierState ? e.getModifierState(a) : (a = Ch[a]) ? !!e[a] : !1;
  }
  function Ef() {
    return Ih;
  }
  var wh = W({}, Ru, {
      key: function (a) {
        if (a.key) {
          var e = bh[a.key] || a.key;
          if (e !== "Unidentified") return e;
        }
        return a.type === "keypress" ? (a = So(a), a === 13 ? "Enter" : String.fromCharCode(a)) : a.type === "keydown" || a.type === "keyup" ? yh[a.keyCode] || "Unidentified" : "";
      },
      code: 0,
      location: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      repeat: 0,
      locale: 0,
      getModifierState: Ef,
      charCode: function (a) {
        return a.type === "keypress" ? So(a) : 0;
      },
      keyCode: function (a) {
        return a.type === "keydown" || a.type === "keyup" ? a.keyCode : 0;
      },
      which: function (a) {
        return a.type === "keypress" ? So(a) : a.type === "keydown" || a.type === "keyup" ? a.keyCode : 0;
      }
    }),
    Ah = qa(wh),
    kh = W({}, sr, {
      pointerId: 0,
      width: 0,
      height: 0,
      pressure: 0,
      tangentialPressure: 0,
      tiltX: 0,
      tiltY: 0,
      twist: 0,
      pointerType: 0,
      isPrimary: 0
    }),
    Ii = qa(kh),
    Mh = W({}, Ru, {
      touches: 0,
      targetTouches: 0,
      changedTouches: 0,
      altKey: 0,
      metaKey: 0,
      ctrlKey: 0,
      shiftKey: 0,
      getModifierState: Ef
    }),
    Th = qa(Mh),
    Dh = W({}, qt, {
      propertyName: 0,
      elapsedTime: 0,
      pseudoElement: 0
    }),
    Bh = qa(Dh),
    Rh = W({}, sr, {
      deltaX: function (a) {
        return "deltaX" in a ? a.deltaX : "wheelDeltaX" in a ? -a.wheelDeltaX : 0;
      },
      deltaY: function (a) {
        return "deltaY" in a ? a.deltaY : "wheelDeltaY" in a ? -a.wheelDeltaY : "wheelDelta" in a ? -a.wheelDelta : 0;
      },
      deltaZ: 0,
      deltaMode: 0
    }),
    Oh = qa(Rh),
    zh = W({}, qt, {
      newState: 0,
      oldState: 0
    }),
    Uh = qa(zh),
    qh = [9, 13, 27, 32],
    Hf = ze && "CompositionEvent" in window,
    au = null;
  ze && "documentMode" in document && (au = document.documentMode);
  var Eh = ze && "TextEvent" in window && !au,
    fc = ze && (!Hf || au && 8 < au && 11 >= au),
    wi = " ",
    Ai = !1;
  function sc(a, e) {
    switch (a) {
      case "keyup":
        return qh.indexOf(e.keyCode) !== -1;
      case "keydown":
        return e.keyCode !== 229;
      case "keypress":
      case "mousedown":
      case "focusout":
        return !0;
      default:
        return !1;
    }
  }
  function ic(a) {
    return a = a.detail, typeof a == "object" && "data" in a ? a.data : null;
  }
  var ll = !1;
  function Hh(a, e) {
    switch (a) {
      case "compositionend":
        return ic(e);
      case "keypress":
        return e.which !== 32 ? null : (Ai = !0, wi);
      case "textInput":
        return a = e.data, a === wi && Ai ? null : a;
      default:
        return null;
    }
  }
  function Fh(a, e) {
    if (ll) return a === "compositionend" || !Hf && sc(a, e) ? (a = dc(), vo = qf = Je = null, ll = !1, a) : null;
    switch (a) {
      case "paste":
        return null;
      case "keypress":
        if (!(e.ctrlKey || e.altKey || e.metaKey) || e.ctrlKey && e.altKey) {
          if (e.char && 1 < e.char.length) return e.char;
          if (e.which) return String.fromCharCode(e.which);
        }
        return null;
      case "compositionend":
        return fc && e.locale !== "ko" ? null : e.data;
      default:
        return null;
    }
  }
  var Gh = {
    color: !0,
    date: !0,
    datetime: !0,
    "datetime-local": !0,
    email: !0,
    month: !0,
    number: !0,
    password: !0,
    range: !0,
    search: !0,
    tel: !0,
    text: !0,
    time: !0,
    url: !0,
    week: !0
  };
  function ki(a) {
    var e = a && a.nodeName && a.nodeName.toLowerCase();
    return e === "input" ? !!Gh[a.type] : e === "textarea";
  }
  function nc(a, e, t, l) {
    tl ? pl ? pl.push(l) : pl = [l] : tl = l, e = ar(e, "onChange"), 0 < e.length && (t = new fr("onChange", "change", null, t, l), a.push({
      event: t,
      listeners: e
    }));
  }
  var eu = null,
    gu = null;
  function Nh(a) {
    rm(a, 0);
  }
  function ir(a) {
    var e = Wl(a);
    if (ec(e)) return a;
  }
  function Mi(a, e) {
    if (a === "change") return e;
  }
  var cc = !1;
  ze && (ze ? (oo = "oninput" in document, oo || (fd = document.createElement("div"), fd.setAttribute("oninput", "return;"), oo = typeof fd.oninput == "function"), uo = oo) : uo = !1, cc = uo && (!document.documentMode || 9 < document.documentMode));
  var uo, oo, fd;
  function Ti() {
    eu && (eu.detachEvent("onpropertychange", pc), gu = eu = null);
  }
  function pc(a) {
    if (a.propertyName === "value" && ir(gu)) {
      var e = [];
      nc(e, gu, a, Uf(a)), rc(Nh, e);
    }
  }
  function _h(a, e, t) {
    a === "focusin" ? (Ti(), eu = e, gu = t, eu.attachEvent("onpropertychange", pc)) : a === "focusout" && Ti();
  }
  function Ph(a) {
    if (a === "selectionchange" || a === "keyup" || a === "keydown") return ir(gu);
  }
  function Vh(a, e) {
    if (a === "click") return ir(e);
  }
  function Xh(a, e) {
    if (a === "input" || a === "change") return ir(e);
  }
  function Zh(a, e) {
    return a === e && (a !== 0 || 1 / a === 1 / e) || a !== a && e !== e;
  }
  var Xa = typeof Object.is == "function" ? Object.is : Zh;
  function hu(a, e) {
    if (Xa(a, e)) return !0;
    if (typeof a != "object" || a === null || typeof e != "object" || e === null) return !1;
    var t = Object.keys(a),
      l = Object.keys(e);
    if (t.length !== l.length) return !1;
    for (l = 0; l < t.length; l++) {
      var u = t[l];
      if (!Fd.call(e, u) || !Xa(a[u], e[u])) return !1;
    }
    return !0;
  }
  function Di(a) {
    for (; a && a.firstChild;) a = a.firstChild;
    return a;
  }
  function Bi(a, e) {
    var t = Di(a);
    a = 0;
    for (var l; t;) {
      if (t.nodeType === 3) {
        if (l = a + t.textContent.length, a <= e && l >= e) return {
          node: t,
          offset: e - a
        };
        a = l;
      }
      a: {
        for (; t;) {
          if (t.nextSibling) {
            t = t.nextSibling;
            break a;
          }
          t = t.parentNode;
        }
        t = void 0;
      }
      t = Di(t);
    }
  }
  function mc(a, e) {
    return a && e ? a === e ? !0 : a && a.nodeType === 3 ? !1 : e && e.nodeType === 3 ? mc(a, e.parentNode) : "contains" in a ? a.contains(e) : a.compareDocumentPosition ? !!(a.compareDocumentPosition(e) & 16) : !1 : !1;
  }
  function gc(a) {
    a = a != null && a.ownerDocument != null && a.ownerDocument.defaultView != null ? a.ownerDocument.defaultView : window;
    for (var e = qo(a.document); e instanceof a.HTMLIFrameElement;) {
      try {
        var t = typeof e.contentWindow.location.href == "string";
      } catch {
        t = !1;
      }
      if (t) a = e.contentWindow;else break;
      e = qo(a.document);
    }
    return e;
  }
  function Ff(a) {
    var e = a && a.nodeName && a.nodeName.toLowerCase();
    return e && (e === "input" && (a.type === "text" || a.type === "search" || a.type === "tel" || a.type === "url" || a.type === "password") || e === "textarea" || a.contentEditable === "true");
  }
  var Yh = ze && "documentMode" in document && 11 >= document.documentMode,
    ul = null,
    Zd = null,
    tu = null,
    Yd = !1;
  function Ri(a, e, t) {
    var l = t.window === t ? t.document : t.nodeType === 9 ? t : t.ownerDocument;
    Yd || ul == null || ul !== qo(l) || (l = ul, "selectionStart" in l && Ff(l) ? l = {
      start: l.selectionStart,
      end: l.selectionEnd
    } : (l = (l.ownerDocument && l.ownerDocument.defaultView || window).getSelection(), l = {
      anchorNode: l.anchorNode,
      anchorOffset: l.anchorOffset,
      focusNode: l.focusNode,
      focusOffset: l.focusOffset
    }), tu && hu(tu, l) || (tu = l, l = ar(Zd, "onSelect"), 0 < l.length && (e = new fr("onSelect", "select", null, e, t), a.push({
      event: e,
      listeners: l
    }), e.target = ul)));
  }
  function St(a, e) {
    var t = {};
    return t[a.toLowerCase()] = e.toLowerCase(), t["Webkit" + a] = "webkit" + e, t["Moz" + a] = "moz" + e, t;
  }
  var ol = {
      animationend: St("Animation", "AnimationEnd"),
      animationiteration: St("Animation", "AnimationIteration"),
      animationstart: St("Animation", "AnimationStart"),
      transitionrun: St("Transition", "TransitionRun"),
      transitionstart: St("Transition", "TransitionStart"),
      transitioncancel: St("Transition", "TransitionCancel"),
      transitionend: St("Transition", "TransitionEnd")
    },
    sd = {},
    hc = {};
  ze && (hc = document.createElement("div").style, "AnimationEvent" in window || (delete ol.animationend.animation, delete ol.animationiteration.animation, delete ol.animationstart.animation), "TransitionEvent" in window || delete ol.transitionend.transition);
  function Et(a) {
    if (sd[a]) return sd[a];
    if (!ol[a]) return a;
    var e = ol[a],
      t;
    for (t in e) if (e.hasOwnProperty(t) && t in hc) return sd[a] = e[t];
    return a;
  }
  var xc = Et("animationend"),
    Lc = Et("animationiteration"),
    vc = Et("animationstart"),
    jh = Et("transitionrun"),
    Qh = Et("transitionstart"),
    Kh = Et("transitioncancel"),
    Sc = Et("transitionend"),
    bc = new Map(),
    jd = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
  jd.push("scrollEnd");
  function fe(a, e) {
    bc.set(a, e), Ut(e, [a]);
  }
  var Eo = typeof reportError == "function" ? reportError : function (a) {
      if (typeof window == "object" && typeof window.ErrorEvent == "function") {
        var e = new window.ErrorEvent("error", {
          bubbles: !0,
          cancelable: !0,
          message: typeof a == "object" && a !== null && typeof a.message == "string" ? String(a.message) : String(a),
          error: a
        });
        if (!window.dispatchEvent(e)) return;
      } else if (typeof process == "object" && typeof process.emit == "function") {
        process.emit("uncaughtException", a);
        return;
      }
      console.error(a);
    },
    Qa = [],
    rl = 0,
    Gf = 0;
  function nr() {
    for (var a = rl, e = Gf = rl = 0; e < a;) {
      var t = Qa[e];
      Qa[e++] = null;
      var l = Qa[e];
      Qa[e++] = null;
      var u = Qa[e];
      Qa[e++] = null;
      var o = Qa[e];
      if (Qa[e++] = null, l !== null && u !== null) {
        var r = l.pending;
        r === null ? u.next = u : (u.next = r.next, r.next = u), l.pending = u;
      }
      o !== 0 && yc(t, u, o);
    }
  }
  function cr(a, e, t, l) {
    Qa[rl++] = a, Qa[rl++] = e, Qa[rl++] = t, Qa[rl++] = l, Gf |= l, a.lanes |= l, a = a.alternate, a !== null && (a.lanes |= l);
  }
  function Nf(a, e, t, l) {
    return cr(a, e, t, l), Ho(a);
  }
  function Ht(a, e) {
    return cr(a, null, null, e), Ho(a);
  }
  function yc(a, e, t) {
    a.lanes |= t;
    var l = a.alternate;
    l !== null && (l.lanes |= t);
    for (var u = !1, o = a.return; o !== null;) o.childLanes |= t, l = o.alternate, l !== null && (l.childLanes |= t), o.tag === 22 && (a = o.stateNode, a === null || a._visibility & 1 || (u = !0)), a = o, o = o.return;
    return a.tag === 3 ? (o = a.stateNode, u && e !== null && (u = 31 - Pa(t), a = o.hiddenUpdates, l = a[u], l === null ? a[u] = [e] : l.push(e), e.lane = t | 536870912), o) : null;
  }
  function Ho(a) {
    if (50 < nu) throw nu = 0, hf = null, Error(L(185));
    for (var e = a.return; e !== null;) a = e, e = a.return;
    return a.tag === 3 ? a.stateNode : null;
  }
  var dl = {};
  function Wh(a, e, t, l) {
    this.tag = a, this.key = t, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = e, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = l, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function Fa(a, e, t, l) {
    return new Wh(a, e, t, l);
  }
  function _f(a) {
    return a = a.prototype, !(!a || !a.isReactComponent);
  }
  function Be(a, e) {
    var t = a.alternate;
    return t === null ? (t = Fa(a.tag, e, a.key, a.mode), t.elementType = a.elementType, t.type = a.type, t.stateNode = a.stateNode, t.alternate = a, a.alternate = t) : (t.pendingProps = e, t.type = a.type, t.flags = 0, t.subtreeFlags = 0, t.deletions = null), t.flags = a.flags & 65011712, t.childLanes = a.childLanes, t.lanes = a.lanes, t.child = a.child, t.memoizedProps = a.memoizedProps, t.memoizedState = a.memoizedState, t.updateQueue = a.updateQueue, e = a.dependencies, t.dependencies = e === null ? null : {
      lanes: e.lanes,
      firstContext: e.firstContext
    }, t.sibling = a.sibling, t.index = a.index, t.ref = a.ref, t.refCleanup = a.refCleanup, t;
  }
  function Cc(a, e) {
    a.flags &= 65011714;
    var t = a.alternate;
    return t === null ? (a.childLanes = 0, a.lanes = e, a.child = null, a.subtreeFlags = 0, a.memoizedProps = null, a.memoizedState = null, a.updateQueue = null, a.dependencies = null, a.stateNode = null) : (a.childLanes = t.childLanes, a.lanes = t.lanes, a.child = t.child, a.subtreeFlags = 0, a.deletions = null, a.memoizedProps = t.memoizedProps, a.memoizedState = t.memoizedState, a.updateQueue = t.updateQueue, a.type = t.type, e = t.dependencies, a.dependencies = e === null ? null : {
      lanes: e.lanes,
      firstContext: e.firstContext
    }), a;
  }
  function bo(a, e, t, l, u, o) {
    var r = 0;
    if (l = a, typeof a == "function") _f(a) && (r = 1);else if (typeof a == "string") r = aL(a, t, ge.current) ? 26 : a === "html" || a === "head" || a === "body" ? 27 : 5;else a: switch (a) {
      case Ud:
        return a = Fa(31, t, e, u), a.elementType = Ud, a.lanes = o, a;
      case $t:
        return At(t.children, u, o, e);
      case _n:
        r = 8, u |= 24;
        break;
      case Rd:
        return a = Fa(12, t, e, u | 2), a.elementType = Rd, a.lanes = o, a;
      case Od:
        return a = Fa(13, t, e, u), a.elementType = Od, a.lanes = o, a;
      case zd:
        return a = Fa(19, t, e, u), a.elementType = zd, a.lanes = o, a;
      default:
        if (typeof a == "object" && a !== null) switch (a.$$typeof) {
          case Me:
            r = 10;
            break a;
          case Pn:
            r = 9;
            break a;
          case Mf:
            r = 11;
            break a;
          case Tf:
            r = 14;
            break a;
          case Xe:
            r = 16, l = null;
            break a;
        }
        r = 29, t = Error(L(130, a === null ? "null" : typeof a, "")), l = null;
    }
    return e = Fa(r, t, e, u), e.elementType = a, e.type = l, e.lanes = o, e;
  }
  function At(a, e, t, l) {
    return a = Fa(7, a, l, e), a.lanes = t, a;
  }
  function id(a, e, t) {
    return a = Fa(6, a, null, e), a.lanes = t, a;
  }
  function Ic(a) {
    var e = Fa(18, null, null, 0);
    return e.stateNode = a, e;
  }
  function nd(a, e, t) {
    return e = Fa(4, a.children !== null ? a.children : [], a.key, e), e.lanes = t, e.stateNode = {
      containerInfo: a.containerInfo,
      pendingChildren: null,
      implementation: a.implementation
    }, e;
  }
  var Oi = new WeakMap();
  function ae(a, e) {
    if (typeof a == "object" && a !== null) {
      var t = Oi.get(a);
      return t !== void 0 ? t : (e = {
        value: a,
        source: e,
        stack: mi(e)
      }, Oi.set(a, e), e);
    }
    return {
      value: a,
      source: e,
      stack: mi(e)
    };
  }
  var fl = [],
    sl = 0,
    Fo = null,
    xu = 0,
    Wa = [],
    Ja = 0,
    nt = null,
    ce = 1,
    pe = "";
  function Ae(a, e) {
    fl[sl++] = xu, fl[sl++] = Fo, Fo = a, xu = e;
  }
  function wc(a, e, t) {
    Wa[Ja++] = ce, Wa[Ja++] = pe, Wa[Ja++] = nt, nt = a;
    var l = ce;
    a = pe;
    var u = 32 - Pa(l) - 1;
    l &= ~(1 << u), t += 1;
    var o = 32 - Pa(e) + u;
    if (30 < o) {
      var r = u - u % 5;
      o = (l & (1 << r) - 1).toString(32), l >>= r, u -= r, ce = 1 << 32 - Pa(e) + u | t << u | l, pe = o + a;
    } else ce = 1 << o | t << u | l, pe = a;
  }
  function Pf(a) {
    a.return !== null && (Ae(a, 1), wc(a, 1, 0));
  }
  function Vf(a) {
    for (; a === Fo;) Fo = fl[--sl], fl[sl] = null, xu = fl[--sl], fl[sl] = null;
    for (; a === nt;) nt = Wa[--Ja], Wa[Ja] = null, pe = Wa[--Ja], Wa[Ja] = null, ce = Wa[--Ja], Wa[Ja] = null;
  }
  function Ac(a, e) {
    Wa[Ja++] = ce, Wa[Ja++] = pe, Wa[Ja++] = nt, ce = e.id, pe = e.overflow, nt = a;
  }
  var Sa = null,
    K = null,
    F = !1,
    lt = null,
    ee = !1,
    Qd = Error(L(519));
  function ct(a) {
    var e = Error(L(418, 1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML", ""));
    throw Lu(ae(e, a)), Qd;
  }
  function zi(a) {
    var e = a.stateNode,
      t = a.type,
      l = a.memoizedProps;
    switch (e[va] = a, e[Ua] = l, t) {
      case "dialog":
        q("cancel", e), q("close", e);
        break;
      case "iframe":
      case "object":
      case "embed":
        q("load", e);
        break;
      case "video":
      case "audio":
        for (t = 0; t < yu.length; t++) q(yu[t], e);
        break;
      case "source":
        q("error", e);
        break;
      case "img":
      case "image":
      case "link":
        q("error", e), q("load", e);
        break;
      case "details":
        q("toggle", e);
        break;
      case "input":
        q("invalid", e), tc(e, l.value, l.defaultValue, l.checked, l.defaultChecked, l.type, l.name, !0);
        break;
      case "select":
        q("invalid", e);
        break;
      case "textarea":
        q("invalid", e), uc(e, l.value, l.defaultValue, l.children);
    }
    t = l.children, typeof t != "string" && typeof t != "number" && typeof t != "bigint" || e.textContent === "" + t || l.suppressHydrationWarning === !0 || fm(e.textContent, t) ? (l.popover != null && (q("beforetoggle", e), q("toggle", e)), l.onScroll != null && q("scroll", e), l.onScrollEnd != null && q("scrollend", e), l.onClick != null && (e.onclick = Te), e = !0) : e = !1, e || ct(a, !0);
  }
  function Ui(a) {
    for (Sa = a.return; Sa;) switch (Sa.tag) {
      case 5:
      case 31:
      case 13:
        ee = !1;
        return;
      case 27:
      case 3:
        ee = !0;
        return;
      default:
        Sa = Sa.return;
    }
  }
  function Qt(a) {
    if (a !== Sa) return !1;
    if (!F) return Ui(a), F = !0, !1;
    var e = a.tag,
      t;
    if ((t = e !== 3 && e !== 27) && ((t = e === 5) && (t = a.type, t = !(t !== "form" && t !== "button") || bf(a.type, a.memoizedProps)), t = !t), t && K && ct(a), Ui(a), e === 13) {
      if (a = a.memoizedState, a = a !== null ? a.dehydrated : null, !a) throw Error(L(317));
      K = In(a);
    } else if (e === 31) {
      if (a = a.memoizedState, a = a !== null ? a.dehydrated : null, !a) throw Error(L(317));
      K = In(a);
    } else e === 27 ? (e = K, ht(a.type) ? (a = wf, wf = null, K = a) : K = e) : K = Sa ? le(a.stateNode.nextSibling) : null;
    return !0;
  }
  function Dt() {
    K = Sa = null, F = !1;
  }
  function cd() {
    var a = lt;
    return a !== null && (Oa === null ? Oa = a : Oa.push.apply(Oa, a), lt = null), a;
  }
  function Lu(a) {
    lt === null ? lt = [a] : lt.push(a);
  }
  var Kd = he(null),
    Ft = null,
    De = null;
  function Ye(a, e, t) {
    Y(Kd, e._currentValue), e._currentValue = t;
  }
  function Re(a) {
    a._currentValue = Kd.current, xa(Kd);
  }
  function Wd(a, e, t) {
    for (; a !== null;) {
      var l = a.alternate;
      if ((a.childLanes & e) !== e ? (a.childLanes |= e, l !== null && (l.childLanes |= e)) : l !== null && (l.childLanes & e) !== e && (l.childLanes |= e), a === t) break;
      a = a.return;
    }
  }
  function Jd(a, e, t, l) {
    var u = a.child;
    for (u !== null && (u.return = a); u !== null;) {
      var o = u.dependencies;
      if (o !== null) {
        var r = u.child;
        o = o.firstContext;
        a: for (; o !== null;) {
          var d = o;
          o = u;
          for (var f = 0; f < e.length; f++) if (d.context === e[f]) {
            o.lanes |= t, d = o.alternate, d !== null && (d.lanes |= t), Wd(o.return, t, a), l || (r = null);
            break a;
          }
          o = d.next;
        }
      } else if (u.tag === 18) {
        if (r = u.return, r === null) throw Error(L(341));
        r.lanes |= t, o = r.alternate, o !== null && (o.lanes |= t), Wd(r, t, a), r = null;
      } else r = u.child;
      if (r !== null) r.return = u;else for (r = u; r !== null;) {
        if (r === a) {
          r = null;
          break;
        }
        if (u = r.sibling, u !== null) {
          u.return = r.return, r = u;
          break;
        }
        r = r.return;
      }
      u = r;
    }
  }
  function Bl(a, e, t, l) {
    a = null;
    for (var u = e, o = !1; u !== null;) {
      if (!o) {
        if ((u.flags & 524288) !== 0) o = !0;else if ((u.flags & 262144) !== 0) break;
      }
      if (u.tag === 10) {
        var r = u.alternate;
        if (r === null) throw Error(L(387));
        if (r = r.memoizedProps, r !== null) {
          var d = u.type;
          Xa(u.pendingProps.value, r.value) || (a !== null ? a.push(d) : a = [d]);
        }
      } else if (u === Ro.current) {
        if (r = u.alternate, r === null) throw Error(L(387));
        r.memoizedState.memoizedState !== u.memoizedState.memoizedState && (a !== null ? a.push(Iu) : a = [Iu]);
      }
      u = u.return;
    }
    a !== null && Jd(e, a, t, l), e.flags |= 262144;
  }
  function Go(a) {
    for (a = a.firstContext; a !== null;) {
      if (!Xa(a.context._currentValue, a.memoizedValue)) return !0;
      a = a.next;
    }
    return !1;
  }
  function Bt(a) {
    Ft = a, De = null, a = a.dependencies, a !== null && (a.firstContext = null);
  }
  function ba(a) {
    return kc(Ft, a);
  }
  function ro(a, e) {
    return Ft === null && Bt(a), kc(a, e);
  }
  function kc(a, e) {
    var t = e._currentValue;
    if (e = {
      context: e,
      memoizedValue: t,
      next: null
    }, De === null) {
      if (a === null) throw Error(L(308));
      De = e, a.dependencies = {
        lanes: 0,
        firstContext: e
      }, a.flags |= 524288;
    } else De = De.next = e;
    return t;
  }
  var Jh = typeof AbortController < "u" ? AbortController : function () {
      var a = [],
        e = this.signal = {
          aborted: !1,
          addEventListener: function (t, l) {
            a.push(l);
          }
        };
      this.abort = function () {
        e.aborted = !0, a.forEach(function (t) {
          return t();
        });
      };
    },
    $h = na.unstable_scheduleCallback,
    ax = na.unstable_NormalPriority,
    da = {
      $$typeof: Me,
      Consumer: null,
      Provider: null,
      _currentValue: null,
      _currentValue2: null,
      _threadCount: 0
    };
  function Xf() {
    return {
      controller: new Jh(),
      data: new Map(),
      refCount: 0
    };
  }
  function Ou(a) {
    a.refCount--, a.refCount === 0 && $h(ax, function () {
      a.controller.abort();
    });
  }
  var lu = null,
    $d = 0,
    bl = 0,
    ml = null;
  function ex(a, e) {
    if (lu === null) {
      var t = lu = [];
      $d = 0, bl = hs(), ml = {
        status: "pending",
        value: void 0,
        then: function (l) {
          t.push(l);
        }
      };
    }
    return $d++, e.then(qi, qi), e;
  }
  function qi() {
    if (--$d === 0 && lu !== null) {
      ml !== null && (ml.status = "fulfilled");
      var a = lu;
      lu = null, bl = 0, ml = null;
      for (var e = 0; e < a.length; e++) (0, a[e])();
    }
  }
  function tx(a, e) {
    var t = [],
      l = {
        status: "pending",
        value: null,
        reason: null,
        then: function (u) {
          t.push(u);
        }
      };
    return a.then(function () {
      l.status = "fulfilled", l.value = e;
      for (var u = 0; u < t.length; u++) (0, t[u])(e);
    }, function (u) {
      for (l.status = "rejected", l.reason = u, u = 0; u < t.length; u++) (0, t[u])(void 0);
    }), l;
  }
  var Ei = D.S;
  D.S = function (a, e) {
    Np = Na(), typeof e == "object" && e !== null && typeof e.then == "function" && ex(a, e), Ei !== null && Ei(a, e);
  };
  var kt = he(null);
  function Zf() {
    var a = kt.current;
    return a !== null ? a : Z.pooledCache;
  }
  function yo(a, e) {
    e === null ? Y(kt, kt.current) : Y(kt, e.pool);
  }
  function Mc() {
    var a = Zf();
    return a === null ? null : {
      parent: da._currentValue,
      pool: a
    };
  }
  var Rl = Error(L(460)),
    Yf = Error(L(474)),
    pr = Error(L(542)),
    No = {
      then: function () {}
    };
  function Hi(a) {
    return a = a.status, a === "fulfilled" || a === "rejected";
  }
  function Tc(a, e, t) {
    switch (t = a[t], t === void 0 ? a.push(e) : t !== e && (e.then(Te, Te), e = t), e.status) {
      case "fulfilled":
        return e.value;
      case "rejected":
        throw a = e.reason, Gi(a), a;
      default:
        if (typeof e.status == "string") e.then(Te, Te);else {
          if (a = Z, a !== null && 100 < a.shellSuspendCounter) throw Error(L(482));
          a = e, a.status = "pending", a.then(function (l) {
            if (e.status === "pending") {
              var u = e;
              u.status = "fulfilled", u.value = l;
            }
          }, function (l) {
            if (e.status === "pending") {
              var u = e;
              u.status = "rejected", u.reason = l;
            }
          });
        }
        switch (e.status) {
          case "fulfilled":
            return e.value;
          case "rejected":
            throw a = e.reason, Gi(a), a;
        }
        throw Mt = e, Rl;
    }
  }
  function Ct(a) {
    try {
      var e = a._init;
      return e(a._payload);
    } catch (t) {
      throw t !== null && typeof t == "object" && typeof t.then == "function" ? (Mt = t, Rl) : t;
    }
  }
  var Mt = null;
  function Fi() {
    if (Mt === null) throw Error(L(459));
    var a = Mt;
    return Mt = null, a;
  }
  function Gi(a) {
    if (a === Rl || a === pr) throw Error(L(483));
  }
  var gl = null,
    vu = 0;
  function fo(a) {
    var e = vu;
    return vu += 1, gl === null && (gl = []), Tc(gl, a, e);
  }
  function Vl(a, e) {
    e = e.props.ref, a.ref = e !== void 0 ? e : null;
  }
  function so(a, e) {
    throw e.$$typeof === _g ? Error(L(525)) : (a = Object.prototype.toString.call(e), Error(L(31, a === "[object Object]" ? "object with keys {" + Object.keys(e).join(", ") + "}" : a)));
  }
  function Dc(a) {
    function e(n, i) {
      if (a) {
        var p = n.deletions;
        p === null ? (n.deletions = [i], n.flags |= 16) : p.push(i);
      }
    }
    function t(n, i) {
      if (!a) return null;
      for (; i !== null;) e(n, i), i = i.sibling;
      return null;
    }
    function l(n) {
      for (var i = new Map(); n !== null;) n.key !== null ? i.set(n.key, n) : i.set(n.index, n), n = n.sibling;
      return i;
    }
    function u(n, i) {
      return n = Be(n, i), n.index = 0, n.sibling = null, n;
    }
    function o(n, i, p) {
      return n.index = p, a ? (p = n.alternate, p !== null ? (p = p.index, p < i ? (n.flags |= 67108866, i) : p) : (n.flags |= 67108866, i)) : (n.flags |= 1048576, i);
    }
    function r(n) {
      return a && n.alternate === null && (n.flags |= 67108866), n;
    }
    function d(n, i, p, x) {
      return i === null || i.tag !== 6 ? (i = id(p, n.mode, x), i.return = n, i) : (i = u(i, p), i.return = n, i);
    }
    function f(n, i, p, x) {
      var A = p.type;
      return A === $t ? g(n, i, p.props.children, x, p.key) : i !== null && (i.elementType === A || typeof A == "object" && A !== null && A.$$typeof === Xe && Ct(A) === i.type) ? (i = u(i, p.props), Vl(i, p), i.return = n, i) : (i = bo(p.type, p.key, p.props, null, n.mode, x), Vl(i, p), i.return = n, i);
    }
    function s(n, i, p, x) {
      return i === null || i.tag !== 4 || i.stateNode.containerInfo !== p.containerInfo || i.stateNode.implementation !== p.implementation ? (i = nd(p, n.mode, x), i.return = n, i) : (i = u(i, p.children || []), i.return = n, i);
    }
    function g(n, i, p, x, A) {
      return i === null || i.tag !== 7 ? (i = At(p, n.mode, x, A), i.return = n, i) : (i = u(i, p), i.return = n, i);
    }
    function h(n, i, p) {
      if (typeof i == "string" && i !== "" || typeof i == "number" || typeof i == "bigint") return i = id("" + i, n.mode, p), i.return = n, i;
      if (typeof i == "object" && i !== null) {
        switch (i.$$typeof) {
          case Ju:
            return p = bo(i.type, i.key, i.props, null, n.mode, p), Vl(p, i), p.return = n, p;
          case Ql:
            return i = nd(i, n.mode, p), i.return = n, i;
          case Xe:
            return i = Ct(i), h(n, i, p);
        }
        if (Kl(i) || _l(i)) return i = At(i, n.mode, p, null), i.return = n, i;
        if (typeof i.then == "function") return h(n, fo(i), p);
        if (i.$$typeof === Me) return h(n, ro(n, i), p);
        so(n, i);
      }
      return null;
    }
    function c(n, i, p, x) {
      var A = i !== null ? i.key : null;
      if (typeof p == "string" && p !== "" || typeof p == "number" || typeof p == "bigint") return A !== null ? null : d(n, i, "" + p, x);
      if (typeof p == "object" && p !== null) {
        switch (p.$$typeof) {
          case Ju:
            return p.key === A ? f(n, i, p, x) : null;
          case Ql:
            return p.key === A ? s(n, i, p, x) : null;
          case Xe:
            return p = Ct(p), c(n, i, p, x);
        }
        if (Kl(p) || _l(p)) return A !== null ? null : g(n, i, p, x, null);
        if (typeof p.then == "function") return c(n, i, fo(p), x);
        if (p.$$typeof === Me) return c(n, i, ro(n, p), x);
        so(n, p);
      }
      return null;
    }
    function m(n, i, p, x, A) {
      if (typeof x == "string" && x !== "" || typeof x == "number" || typeof x == "bigint") return n = n.get(p) || null, d(i, n, "" + x, A);
      if (typeof x == "object" && x !== null) {
        switch (x.$$typeof) {
          case Ju:
            return n = n.get(x.key === null ? p : x.key) || null, f(i, n, x, A);
          case Ql:
            return n = n.get(x.key === null ? p : x.key) || null, s(i, n, x, A);
          case Xe:
            return x = Ct(x), m(n, i, p, x, A);
        }
        if (Kl(x) || _l(x)) return n = n.get(p) || null, g(i, n, x, A, null);
        if (typeof x.then == "function") return m(n, i, p, fo(x), A);
        if (x.$$typeof === Me) return m(n, i, p, ro(i, x), A);
        so(i, x);
      }
      return null;
    }
    function b(n, i, p, x) {
      for (var A = null, z = null, C = i, v = i = 0, S = null; C !== null && v < p.length; v++) {
        C.index > v ? (S = C, C = null) : S = C.sibling;
        var k = c(n, C, p[v], x);
        if (k === null) {
          C === null && (C = S);
          break;
        }
        a && C && k.alternate === null && e(n, C), i = o(k, i, v), z === null ? A = k : z.sibling = k, z = k, C = S;
      }
      if (v === p.length) return t(n, C), F && Ae(n, v), A;
      if (C === null) {
        for (; v < p.length; v++) C = h(n, p[v], x), C !== null && (i = o(C, i, v), z === null ? A = C : z.sibling = C, z = C);
        return F && Ae(n, v), A;
      }
      for (C = l(C); v < p.length; v++) S = m(C, n, v, p[v], x), S !== null && (a && S.alternate !== null && C.delete(S.key === null ? v : S.key), i = o(S, i, v), z === null ? A = S : z.sibling = S, z = S);
      return a && C.forEach(function (R) {
        return e(n, R);
      }), F && Ae(n, v), A;
    }
    function y(n, i, p, x) {
      if (p == null) throw Error(L(151));
      for (var A = null, z = null, C = i, v = i = 0, S = null, k = p.next(); C !== null && !k.done; v++, k = p.next()) {
        C.index > v ? (S = C, C = null) : S = C.sibling;
        var R = c(n, C, k.value, x);
        if (R === null) {
          C === null && (C = S);
          break;
        }
        a && C && R.alternate === null && e(n, C), i = o(R, i, v), z === null ? A = R : z.sibling = R, z = R, C = S;
      }
      if (k.done) return t(n, C), F && Ae(n, v), A;
      if (C === null) {
        for (; !k.done; v++, k = p.next()) k = h(n, k.value, x), k !== null && (i = o(k, i, v), z === null ? A = k : z.sibling = k, z = k);
        return F && Ae(n, v), A;
      }
      for (C = l(C); !k.done; v++, k = p.next()) k = m(C, n, v, k.value, x), k !== null && (a && k.alternate !== null && C.delete(k.key === null ? v : k.key), i = o(k, i, v), z === null ? A = k : z.sibling = k, z = k);
      return a && C.forEach(function (pa) {
        return e(n, pa);
      }), F && Ae(n, v), A;
    }
    function T(n, i, p, x) {
      if (typeof p == "object" && p !== null && p.type === $t && p.key === null && (p = p.props.children), typeof p == "object" && p !== null) {
        switch (p.$$typeof) {
          case Ju:
            a: {
              for (var A = p.key; i !== null;) {
                if (i.key === A) {
                  if (A = p.type, A === $t) {
                    if (i.tag === 7) {
                      t(n, i.sibling), x = u(i, p.props.children), x.return = n, n = x;
                      break a;
                    }
                  } else if (i.elementType === A || typeof A == "object" && A !== null && A.$$typeof === Xe && Ct(A) === i.type) {
                    t(n, i.sibling), x = u(i, p.props), Vl(x, p), x.return = n, n = x;
                    break a;
                  }
                  t(n, i);
                  break;
                } else e(n, i);
                i = i.sibling;
              }
              p.type === $t ? (x = At(p.props.children, n.mode, x, p.key), x.return = n, n = x) : (x = bo(p.type, p.key, p.props, null, n.mode, x), Vl(x, p), x.return = n, n = x);
            }
            return r(n);
          case Ql:
            a: {
              for (A = p.key; i !== null;) {
                if (i.key === A) {
                  if (i.tag === 4 && i.stateNode.containerInfo === p.containerInfo && i.stateNode.implementation === p.implementation) {
                    t(n, i.sibling), x = u(i, p.children || []), x.return = n, n = x;
                    break a;
                  } else {
                    t(n, i);
                    break;
                  }
                } else e(n, i);
                i = i.sibling;
              }
              x = nd(p, n.mode, x), x.return = n, n = x;
            }
            return r(n);
          case Xe:
            return p = Ct(p), T(n, i, p, x);
        }
        if (Kl(p)) return b(n, i, p, x);
        if (_l(p)) {
          if (A = _l(p), typeof A != "function") throw Error(L(150));
          return p = A.call(p), y(n, i, p, x);
        }
        if (typeof p.then == "function") return T(n, i, fo(p), x);
        if (p.$$typeof === Me) return T(n, i, ro(n, p), x);
        so(n, p);
      }
      return typeof p == "string" && p !== "" || typeof p == "number" || typeof p == "bigint" ? (p = "" + p, i !== null && i.tag === 6 ? (t(n, i.sibling), x = u(i, p), x.return = n, n = x) : (t(n, i), x = id(p, n.mode, x), x.return = n, n = x), r(n)) : t(n, i);
    }
    return function (n, i, p, x) {
      try {
        vu = 0;
        var A = T(n, i, p, x);
        return gl = null, A;
      } catch (C) {
        if (C === Rl || C === pr) throw C;
        var z = Fa(29, C, null, n.mode);
        return z.lanes = x, z.return = n, z;
      }
    };
  }
  var Rt = Dc(!0),
    Bc = Dc(!1),
    Ze = !1;
  function jf(a) {
    a.updateQueue = {
      baseState: a.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: {
        pending: null,
        lanes: 0,
        hiddenCallbacks: null
      },
      callbacks: null
    };
  }
  function af(a, e) {
    a = a.updateQueue, e.updateQueue === a && (e.updateQueue = {
      baseState: a.baseState,
      firstBaseUpdate: a.firstBaseUpdate,
      lastBaseUpdate: a.lastBaseUpdate,
      shared: a.shared,
      callbacks: null
    });
  }
  function ut(a) {
    return {
      lane: a,
      tag: 0,
      payload: null,
      callback: null,
      next: null
    };
  }
  function ot(a, e, t) {
    var l = a.updateQueue;
    if (l === null) return null;
    if (l = l.shared, (G & 2) !== 0) {
      var u = l.pending;
      return u === null ? e.next = e : (e.next = u.next, u.next = e), l.pending = e, e = Ho(a), yc(a, null, t), e;
    }
    return cr(a, l, e, t), Ho(a);
  }
  function uu(a, e, t) {
    if (e = e.updateQueue, e !== null && (e = e.shared, (t & 4194048) !== 0)) {
      var l = e.lanes;
      l &= a.pendingLanes, t |= l, e.lanes = t, Qn(a, t);
    }
  }
  function pd(a, e) {
    var t = a.updateQueue,
      l = a.alternate;
    if (l !== null && (l = l.updateQueue, t === l)) {
      var u = null,
        o = null;
      if (t = t.firstBaseUpdate, t !== null) {
        do {
          var r = {
            lane: t.lane,
            tag: t.tag,
            payload: t.payload,
            callback: null,
            next: null
          };
          o === null ? u = o = r : o = o.next = r, t = t.next;
        } while (t !== null);
        o === null ? u = o = e : o = o.next = e;
      } else u = o = e;
      t = {
        baseState: l.baseState,
        firstBaseUpdate: u,
        lastBaseUpdate: o,
        shared: l.shared,
        callbacks: l.callbacks
      }, a.updateQueue = t;
      return;
    }
    a = t.lastBaseUpdate, a === null ? t.firstBaseUpdate = e : a.next = e, t.lastBaseUpdate = e;
  }
  var ef = !1;
  function ou() {
    if (ef) {
      var a = ml;
      if (a !== null) throw a;
    }
  }
  function ru(a, e, t, l) {
    ef = !1;
    var u = a.updateQueue;
    Ze = !1;
    var o = u.firstBaseUpdate,
      r = u.lastBaseUpdate,
      d = u.shared.pending;
    if (d !== null) {
      u.shared.pending = null;
      var f = d,
        s = f.next;
      f.next = null, r === null ? o = s : r.next = s, r = f;
      var g = a.alternate;
      g !== null && (g = g.updateQueue, d = g.lastBaseUpdate, d !== r && (d === null ? g.firstBaseUpdate = s : d.next = s, g.lastBaseUpdate = f));
    }
    if (o !== null) {
      var h = u.baseState;
      r = 0, g = s = f = null, d = o;
      do {
        var c = d.lane & -536870913,
          m = c !== d.lane;
        if (m ? (H & c) === c : (l & c) === c) {
          c !== 0 && c === bl && (ef = !0), g !== null && (g = g.next = {
            lane: 0,
            tag: d.tag,
            payload: d.payload,
            callback: null,
            next: null
          });
          a: {
            var b = a,
              y = d;
            c = e;
            var T = t;
            switch (y.tag) {
              case 1:
                if (b = y.payload, typeof b == "function") {
                  h = b.call(T, h, c);
                  break a;
                }
                h = b;
                break a;
              case 3:
                b.flags = b.flags & -65537 | 128;
              case 0:
                if (b = y.payload, c = typeof b == "function" ? b.call(T, h, c) : b, c == null) break a;
                h = W({}, h, c);
                break a;
              case 2:
                Ze = !0;
            }
          }
          c = d.callback, c !== null && (a.flags |= 64, m && (a.flags |= 8192), m = u.callbacks, m === null ? u.callbacks = [c] : m.push(c));
        } else m = {
          lane: c,
          tag: d.tag,
          payload: d.payload,
          callback: d.callback,
          next: null
        }, g === null ? (s = g = m, f = h) : g = g.next = m, r |= c;
        if (d = d.next, d === null) {
          if (d = u.shared.pending, d === null) break;
          m = d, d = m.next, m.next = null, u.lastBaseUpdate = m, u.shared.pending = null;
        }
      } while (!0);
      g === null && (f = h), u.baseState = f, u.firstBaseUpdate = s, u.lastBaseUpdate = g, o === null && (u.shared.lanes = 0), mt |= r, a.lanes = r, a.memoizedState = h;
    }
  }
  function Rc(a, e) {
    if (typeof a != "function") throw Error(L(191, a));
    a.call(e);
  }
  function Oc(a, e) {
    var t = a.callbacks;
    if (t !== null) for (a.callbacks = null, a = 0; a < t.length; a++) Rc(t[a], e);
  }
  var yl = he(null),
    _o = he(0);
  function Ni(a, e) {
    a = He, Y(_o, a), Y(yl, e), He = a | e.baseLanes;
  }
  function tf() {
    Y(_o, He), Y(yl, yl.current);
  }
  function Qf() {
    He = _o.current, xa(yl), xa(_o);
  }
  var Za = he(null),
    te = null;
  function je(a) {
    var e = a.alternate;
    Y(ta, ta.current & 1), Y(Za, a), te === null && (e === null || yl.current !== null || e.memoizedState !== null) && (te = a);
  }
  function lf(a) {
    Y(ta, ta.current), Y(Za, a), te === null && (te = a);
  }
  function zc(a) {
    a.tag === 22 ? (Y(ta, ta.current), Y(Za, a), te === null && (te = a)) : Qe(a);
  }
  function Qe() {
    Y(ta, ta.current), Y(Za, Za.current);
  }
  function Ha(a) {
    xa(Za), te === a && (te = null), xa(ta);
  }
  var ta = he(0);
  function Po(a) {
    for (var e = a; e !== null;) {
      if (e.tag === 13) {
        var t = e.memoizedState;
        if (t !== null && (t = t.dehydrated, t === null || Cf(t) || If(t))) return e;
      } else if (e.tag === 19 && (e.memoizedProps.revealOrder === "forwards" || e.memoizedProps.revealOrder === "backwards" || e.memoizedProps.revealOrder === "unstable_legacy-backwards" || e.memoizedProps.revealOrder === "together")) {
        if ((e.flags & 128) !== 0) return e;
      } else if (e.child !== null) {
        e.child.return = e, e = e.child;
        continue;
      }
      if (e === a) break;
      for (; e.sibling === null;) {
        if (e.return === null || e.return === a) return null;
        e = e.return;
      }
      e.sibling.return = e.return, e = e.sibling;
    }
    return null;
  }
  var Ue = 0,
    O = null,
    X = null,
    oa = null,
    Vo = !1,
    hl = !1,
    Ot = !1,
    Xo = 0,
    Su = 0,
    xl = null,
    lx = 0;
  function aa() {
    throw Error(L(321));
  }
  function Kf(a, e) {
    if (e === null) return !1;
    for (var t = 0; t < e.length && t < a.length; t++) if (!Xa(a[t], e[t])) return !1;
    return !0;
  }
  function Wf(a, e, t, l, u, o) {
    return Ue = o, O = e, e.memoizedState = null, e.updateQueue = null, e.lanes = 0, D.H = a === null || a.memoizedState === null ? np : fs, Ot = !1, o = t(l, u), Ot = !1, hl && (o = qc(e, t, l, u)), Uc(a), o;
  }
  function Uc(a) {
    D.H = bu;
    var e = X !== null && X.next !== null;
    if (Ue = 0, oa = X = O = null, Vo = !1, Su = 0, xl = null, e) throw Error(L(300));
    a === null || fa || (a = a.dependencies, a !== null && Go(a) && (fa = !0));
  }
  function qc(a, e, t, l) {
    O = a;
    var u = 0;
    do {
      if (hl && (xl = null), Su = 0, hl = !1, 25 <= u) throw Error(L(301));
      if (u += 1, oa = X = null, a.updateQueue != null) {
        var o = a.updateQueue;
        o.lastEffect = null, o.events = null, o.stores = null, o.memoCache != null && (o.memoCache.index = 0);
      }
      D.H = cp, o = e(t, l);
    } while (hl);
    return o;
  }
  function ux() {
    var a = D.H,
      e = a.useState()[0];
    return e = typeof e.then == "function" ? zu(e) : e, a = a.useState()[0], (X !== null ? X.memoizedState : null) !== a && (O.flags |= 1024), e;
  }
  function Jf() {
    var a = Xo !== 0;
    return Xo = 0, a;
  }
  function $f(a, e, t) {
    e.updateQueue = a.updateQueue, e.flags &= -2053, a.lanes &= ~t;
  }
  function as(a) {
    if (Vo) {
      for (a = a.memoizedState; a !== null;) {
        var e = a.queue;
        e !== null && (e.pending = null), a = a.next;
      }
      Vo = !1;
    }
    Ue = 0, oa = X = O = null, hl = !1, Su = Xo = 0, xl = null;
  }
  function Ta() {
    var a = {
      memoizedState: null,
      baseState: null,
      baseQueue: null,
      queue: null,
      next: null
    };
    return oa === null ? O.memoizedState = oa = a : oa = oa.next = a, oa;
  }
  function la() {
    if (X === null) {
      var a = O.alternate;
      a = a !== null ? a.memoizedState : null;
    } else a = X.next;
    var e = oa === null ? O.memoizedState : oa.next;
    if (e !== null) oa = e, X = a;else {
      if (a === null) throw O.alternate === null ? Error(L(467)) : Error(L(310));
      X = a, a = {
        memoizedState: X.memoizedState,
        baseState: X.baseState,
        baseQueue: X.baseQueue,
        queue: X.queue,
        next: null
      }, oa === null ? O.memoizedState = oa = a : oa = oa.next = a;
    }
    return oa;
  }
  function mr() {
    return {
      lastEffect: null,
      events: null,
      stores: null,
      memoCache: null
    };
  }
  function zu(a) {
    var e = Su;
    return Su += 1, xl === null && (xl = []), a = Tc(xl, a, e), e = O, (oa === null ? e.memoizedState : oa.next) === null && (e = e.alternate, D.H = e === null || e.memoizedState === null ? np : fs), a;
  }
  function gr(a) {
    if (a !== null && typeof a == "object") {
      if (typeof a.then == "function") return zu(a);
      if (a.$$typeof === Me) return ba(a);
    }
    throw Error(L(438, String(a)));
  }
  function es(a) {
    var e = null,
      t = O.updateQueue;
    if (t !== null && (e = t.memoCache), e == null) {
      var l = O.alternate;
      l !== null && (l = l.updateQueue, l !== null && (l = l.memoCache, l != null && (e = {
        data: l.data.map(function (u) {
          return u.slice();
        }),
        index: 0
      })));
    }
    if (e == null && (e = {
      data: [],
      index: 0
    }), t === null && (t = mr(), O.updateQueue = t), t.memoCache = e, t = e.data[e.index], t === void 0) for (t = e.data[e.index] = Array(a), l = 0; l < a; l++) t[l] = Pg;
    return e.index++, t;
  }
  function qe(a, e) {
    return typeof e == "function" ? e(a) : e;
  }
  function Co(a) {
    var e = la();
    return ts(e, X, a);
  }
  function ts(a, e, t) {
    var l = a.queue;
    if (l === null) throw Error(L(311));
    l.lastRenderedReducer = t;
    var u = a.baseQueue,
      o = l.pending;
    if (o !== null) {
      if (u !== null) {
        var r = u.next;
        u.next = o.next, o.next = r;
      }
      e.baseQueue = u = o, l.pending = null;
    }
    if (o = a.baseState, u === null) a.memoizedState = o;else {
      e = u.next;
      var d = r = null,
        f = null,
        s = e,
        g = !1;
      do {
        var h = s.lane & -536870913;
        if (h !== s.lane ? (H & h) === h : (Ue & h) === h) {
          var c = s.revertLane;
          if (c === 0) f !== null && (f = f.next = {
            lane: 0,
            revertLane: 0,
            gesture: null,
            action: s.action,
            hasEagerState: s.hasEagerState,
            eagerState: s.eagerState,
            next: null
          }), h === bl && (g = !0);else if ((Ue & c) === c) {
            s = s.next, c === bl && (g = !0);
            continue;
          } else h = {
            lane: 0,
            revertLane: s.revertLane,
            gesture: null,
            action: s.action,
            hasEagerState: s.hasEagerState,
            eagerState: s.eagerState,
            next: null
          }, f === null ? (d = f = h, r = o) : f = f.next = h, O.lanes |= c, mt |= c;
          h = s.action, Ot && t(o, h), o = s.hasEagerState ? s.eagerState : t(o, h);
        } else c = {
          lane: h,
          revertLane: s.revertLane,
          gesture: s.gesture,
          action: s.action,
          hasEagerState: s.hasEagerState,
          eagerState: s.eagerState,
          next: null
        }, f === null ? (d = f = c, r = o) : f = f.next = c, O.lanes |= h, mt |= h;
        s = s.next;
      } while (s !== null && s !== e);
      if (f === null ? r = o : f.next = d, !Xa(o, a.memoizedState) && (fa = !0, g && (t = ml, t !== null))) throw t;
      a.memoizedState = o, a.baseState = r, a.baseQueue = f, l.lastRenderedState = o;
    }
    return u === null && (l.lanes = 0), [a.memoizedState, l.dispatch];
  }
  function md(a) {
    var e = la(),
      t = e.queue;
    if (t === null) throw Error(L(311));
    t.lastRenderedReducer = a;
    var l = t.dispatch,
      u = t.pending,
      o = e.memoizedState;
    if (u !== null) {
      t.pending = null;
      var r = u = u.next;
      do o = a(o, r.action), r = r.next; while (r !== u);
      Xa(o, e.memoizedState) || (fa = !0), e.memoizedState = o, e.baseQueue === null && (e.baseState = o), t.lastRenderedState = o;
    }
    return [o, l];
  }
  function Ec(a, e, t) {
    var l = O,
      u = la(),
      o = F;
    if (o) {
      if (t === void 0) throw Error(L(407));
      t = t();
    } else t = e();
    var r = !Xa((X || u).memoizedState, t);
    if (r && (u.memoizedState = t, fa = !0), u = u.queue, ls(Gc.bind(null, l, u, a), [a]), u.getSnapshot !== e || r || oa !== null && oa.memoizedState.tag & 1) {
      if (l.flags |= 2048, Cl(9, {
        destroy: void 0
      }, Fc.bind(null, l, u, t, e), null), Z === null) throw Error(L(349));
      o || (Ue & 127) !== 0 || Hc(l, e, t);
    }
    return t;
  }
  function Hc(a, e, t) {
    a.flags |= 16384, a = {
      getSnapshot: e,
      value: t
    }, e = O.updateQueue, e === null ? (e = mr(), O.updateQueue = e, e.stores = [a]) : (t = e.stores, t === null ? e.stores = [a] : t.push(a));
  }
  function Fc(a, e, t, l) {
    e.value = t, e.getSnapshot = l, Nc(e) && _c(a);
  }
  function Gc(a, e, t) {
    return t(function () {
      Nc(e) && _c(a);
    });
  }
  function Nc(a) {
    var e = a.getSnapshot;
    a = a.value;
    try {
      var t = e();
      return !Xa(a, t);
    } catch {
      return !0;
    }
  }
  function _c(a) {
    var e = Ht(a, 2);
    e !== null && za(e, a, 2);
  }
  function uf(a) {
    var e = Ta();
    if (typeof a == "function") {
      var t = a;
      if (a = t(), Ot) {
        We(!0);
        try {
          t();
        } finally {
          We(!1);
        }
      }
    }
    return e.memoizedState = e.baseState = a, e.queue = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: qe,
      lastRenderedState: a
    }, e;
  }
  function Pc(a, e, t, l) {
    return a.baseState = t, ts(a, X, typeof l == "function" ? l : qe);
  }
  function ox(a, e, t, l, u) {
    if (xr(a)) throw Error(L(485));
    if (a = e.action, a !== null) {
      var o = {
        payload: u,
        action: a,
        next: null,
        isTransition: !0,
        status: "pending",
        value: null,
        reason: null,
        listeners: [],
        then: function (r) {
          o.listeners.push(r);
        }
      };
      D.T !== null ? t(!0) : o.isTransition = !1, l(o), t = e.pending, t === null ? (o.next = e.pending = o, Vc(e, o)) : (o.next = t.next, e.pending = t.next = o);
    }
  }
  function Vc(a, e) {
    var t = e.action,
      l = e.payload,
      u = a.state;
    if (e.isTransition) {
      var o = D.T,
        r = {};
      D.T = r;
      try {
        var d = t(u, l),
          f = D.S;
        f !== null && f(r, d), _i(a, e, d);
      } catch (s) {
        of(a, e, s);
      } finally {
        o !== null && r.types !== null && (o.types = r.types), D.T = o;
      }
    } else try {
      o = t(u, l), _i(a, e, o);
    } catch (s) {
      of(a, e, s);
    }
  }
  function _i(a, e, t) {
    t !== null && typeof t == "object" && typeof t.then == "function" ? t.then(function (l) {
      Pi(a, e, l);
    }, function (l) {
      return of(a, e, l);
    }) : Pi(a, e, t);
  }
  function Pi(a, e, t) {
    e.status = "fulfilled", e.value = t, Xc(e), a.state = t, e = a.pending, e !== null && (t = e.next, t === e ? a.pending = null : (t = t.next, e.next = t, Vc(a, t)));
  }
  function of(a, e, t) {
    var l = a.pending;
    if (a.pending = null, l !== null) {
      l = l.next;
      do e.status = "rejected", e.reason = t, Xc(e), e = e.next; while (e !== l);
    }
    a.action = null;
  }
  function Xc(a) {
    a = a.listeners;
    for (var e = 0; e < a.length; e++) (0, a[e])();
  }
  function Zc(a, e) {
    return e;
  }
  function Vi(a, e) {
    if (F) {
      var t = Z.formState;
      if (t !== null) {
        a: {
          var l = O;
          if (F) {
            if (K) {
              e: {
                for (var u = K, o = ee; u.nodeType !== 8;) {
                  if (!o) {
                    u = null;
                    break e;
                  }
                  if (u = le(u.nextSibling), u === null) {
                    u = null;
                    break e;
                  }
                }
                o = u.data, u = o === "F!" || o === "F" ? u : null;
              }
              if (u) {
                K = le(u.nextSibling), l = u.data === "F!";
                break a;
              }
            }
            ct(l);
          }
          l = !1;
        }
        l && (e = t[0]);
      }
    }
    return t = Ta(), t.memoizedState = t.baseState = e, l = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: Zc,
      lastRenderedState: e
    }, t.queue = l, t = fp.bind(null, O, l), l.dispatch = t, l = uf(!1), o = ds.bind(null, O, !1, l.queue), l = Ta(), u = {
      state: e,
      dispatch: null,
      action: a,
      pending: null
    }, l.queue = u, t = ox.bind(null, O, u, o, t), u.dispatch = t, l.memoizedState = a, [e, t, !1];
  }
  function Xi(a) {
    var e = la();
    return Yc(e, X, a);
  }
  function Yc(a, e, t) {
    if (e = ts(a, e, Zc)[0], a = Co(qe)[0], typeof e == "object" && e !== null && typeof e.then == "function") try {
      var l = zu(e);
    } catch (r) {
      throw r === Rl ? pr : r;
    } else l = e;
    e = la();
    var u = e.queue,
      o = u.dispatch;
    return t !== e.memoizedState && (O.flags |= 2048, Cl(9, {
      destroy: void 0
    }, rx.bind(null, u, t), null)), [l, o, a];
  }
  function rx(a, e) {
    a.action = e;
  }
  function Zi(a) {
    var e = la(),
      t = X;
    if (t !== null) return Yc(e, t, a);
    la(), e = e.memoizedState, t = la();
    var l = t.queue.dispatch;
    return t.memoizedState = a, [e, l, !1];
  }
  function Cl(a, e, t, l) {
    return a = {
      tag: a,
      create: t,
      deps: l,
      inst: e,
      next: null
    }, e = O.updateQueue, e === null && (e = mr(), O.updateQueue = e), t = e.lastEffect, t === null ? e.lastEffect = a.next = a : (l = t.next, t.next = a, a.next = l, e.lastEffect = a), a;
  }
  function jc() {
    return la().memoizedState;
  }
  function Io(a, e, t, l) {
    var u = Ta();
    O.flags |= a, u.memoizedState = Cl(1 | e, {
      destroy: void 0
    }, t, l === void 0 ? null : l);
  }
  function hr(a, e, t, l) {
    var u = la();
    l = l === void 0 ? null : l;
    var o = u.memoizedState.inst;
    X !== null && l !== null && Kf(l, X.memoizedState.deps) ? u.memoizedState = Cl(e, o, t, l) : (O.flags |= a, u.memoizedState = Cl(1 | e, o, t, l));
  }
  function Yi(a, e) {
    Io(8390656, 8, a, e);
  }
  function ls(a, e) {
    hr(2048, 8, a, e);
  }
  function dx(a) {
    O.flags |= 4;
    var e = O.updateQueue;
    if (e === null) e = mr(), O.updateQueue = e, e.events = [a];else {
      var t = e.events;
      t === null ? e.events = [a] : t.push(a);
    }
  }
  function Qc(a) {
    var e = la().memoizedState;
    return dx({
      ref: e,
      nextImpl: a
    }), function () {
      if ((G & 2) !== 0) throw Error(L(440));
      return e.impl.apply(void 0, arguments);
    };
  }
  function Kc(a, e) {
    return hr(4, 2, a, e);
  }
  function Wc(a, e) {
    return hr(4, 4, a, e);
  }
  function Jc(a, e) {
    if (typeof e == "function") {
      a = a();
      var t = e(a);
      return function () {
        typeof t == "function" ? t() : e(null);
      };
    }
    if (e != null) return a = a(), e.current = a, function () {
      e.current = null;
    };
  }
  function $c(a, e, t) {
    t = t != null ? t.concat([a]) : null, hr(4, 4, Jc.bind(null, e, a), t);
  }
  function us() {}
  function ap(a, e) {
    var t = la();
    e = e === void 0 ? null : e;
    var l = t.memoizedState;
    return e !== null && Kf(e, l[1]) ? l[0] : (t.memoizedState = [a, e], a);
  }
  function ep(a, e) {
    var t = la();
    e = e === void 0 ? null : e;
    var l = t.memoizedState;
    if (e !== null && Kf(e, l[1])) return l[0];
    if (l = a(), Ot) {
      We(!0);
      try {
        a();
      } finally {
        We(!1);
      }
    }
    return t.memoizedState = [l, e], l;
  }
  function os(a, e, t) {
    return t === void 0 || (Ue & 1073741824) !== 0 && (H & 261930) === 0 ? a.memoizedState = e : (a.memoizedState = t, a = Pp(), O.lanes |= a, mt |= a, t);
  }
  function tp(a, e, t, l) {
    return Xa(t, e) ? t : yl.current !== null ? (a = os(a, t, l), Xa(a, e) || (fa = !0), a) : (Ue & 42) === 0 || (Ue & 1073741824) !== 0 && (H & 261930) === 0 ? (fa = !0, a.memoizedState = t) : (a = Pp(), O.lanes |= a, mt |= a, e);
  }
  function lp(a, e, t, l, u) {
    var o = N.p;
    N.p = o !== 0 && 8 > o ? o : 8;
    var r = D.T,
      d = {};
    D.T = d, ds(a, !1, e, t);
    try {
      var f = u(),
        s = D.S;
      if (s !== null && s(d, f), f !== null && typeof f == "object" && typeof f.then == "function") {
        var g = tx(f, l);
        du(a, e, g, Va(a));
      } else du(a, e, l, Va(a));
    } catch (h) {
      du(a, e, {
        then: function () {},
        status: "rejected",
        reason: h
      }, Va());
    } finally {
      N.p = o, r !== null && d.types !== null && (r.types = d.types), D.T = r;
    }
  }
  function fx() {}
  function rf(a, e, t, l) {
    if (a.tag !== 5) throw Error(L(476));
    var u = up(a).queue;
    lp(a, u, e, wt, t === null ? fx : function () {
      return op(a), t(l);
    });
  }
  function up(a) {
    var e = a.memoizedState;
    if (e !== null) return e;
    e = {
      memoizedState: wt,
      baseState: wt,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: qe,
        lastRenderedState: wt
      },
      next: null
    };
    var t = {};
    return e.next = {
      memoizedState: t,
      baseState: t,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: qe,
        lastRenderedState: t
      },
      next: null
    }, a.memoizedState = e, a = a.alternate, a !== null && (a.memoizedState = e), e;
  }
  function op(a) {
    var e = up(a);
    e.next === null && (e = a.alternate.memoizedState), du(a, e.next.queue, {}, Va());
  }
  function rs() {
    return ba(Iu);
  }
  function rp() {
    return la().memoizedState;
  }
  function dp() {
    return la().memoizedState;
  }
  function sx(a) {
    for (var e = a.return; e !== null;) {
      switch (e.tag) {
        case 24:
        case 3:
          var t = Va();
          a = ut(t);
          var l = ot(e, a, t);
          l !== null && (za(l, e, t), uu(l, e, t)), e = {
            cache: Xf()
          }, a.payload = e;
          return;
      }
      e = e.return;
    }
  }
  function ix(a, e, t) {
    var l = Va();
    t = {
      lane: l,
      revertLane: 0,
      gesture: null,
      action: t,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, xr(a) ? sp(e, t) : (t = Nf(a, e, t, l), t !== null && (za(t, a, l), ip(t, e, l)));
  }
  function fp(a, e, t) {
    var l = Va();
    du(a, e, t, l);
  }
  function du(a, e, t, l) {
    var u = {
      lane: l,
      revertLane: 0,
      gesture: null,
      action: t,
      hasEagerState: !1,
      eagerState: null,
      next: null
    };
    if (xr(a)) sp(e, u);else {
      var o = a.alternate;
      if (a.lanes === 0 && (o === null || o.lanes === 0) && (o = e.lastRenderedReducer, o !== null)) try {
        var r = e.lastRenderedState,
          d = o(r, t);
        if (u.hasEagerState = !0, u.eagerState = d, Xa(d, r)) return cr(a, e, u, 0), Z === null && nr(), !1;
      } catch {}
      if (t = Nf(a, e, u, l), t !== null) return za(t, a, l), ip(t, e, l), !0;
    }
    return !1;
  }
  function ds(a, e, t, l) {
    if (l = {
      lane: 2,
      revertLane: hs(),
      gesture: null,
      action: l,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, xr(a)) {
      if (e) throw Error(L(479));
    } else e = Nf(a, t, l, 2), e !== null && za(e, a, 2);
  }
  function xr(a) {
    var e = a.alternate;
    return a === O || e !== null && e === O;
  }
  function sp(a, e) {
    hl = Vo = !0;
    var t = a.pending;
    t === null ? e.next = e : (e.next = t.next, t.next = e), a.pending = e;
  }
  function ip(a, e, t) {
    if ((t & 4194048) !== 0) {
      var l = e.lanes;
      l &= a.pendingLanes, t |= l, e.lanes = t, Qn(a, t);
    }
  }
  var bu = {
    readContext: ba,
    use: gr,
    useCallback: aa,
    useContext: aa,
    useEffect: aa,
    useImperativeHandle: aa,
    useLayoutEffect: aa,
    useInsertionEffect: aa,
    useMemo: aa,
    useReducer: aa,
    useRef: aa,
    useState: aa,
    useDebugValue: aa,
    useDeferredValue: aa,
    useTransition: aa,
    useSyncExternalStore: aa,
    useId: aa,
    useHostTransitionStatus: aa,
    useFormState: aa,
    useActionState: aa,
    useOptimistic: aa,
    useMemoCache: aa,
    useCacheRefresh: aa
  };
  bu.useEffectEvent = aa;
  var np = {
      readContext: ba,
      use: gr,
      useCallback: function (a, e) {
        return Ta().memoizedState = [a, e === void 0 ? null : e], a;
      },
      useContext: ba,
      useEffect: Yi,
      useImperativeHandle: function (a, e, t) {
        t = t != null ? t.concat([a]) : null, Io(4194308, 4, Jc.bind(null, e, a), t);
      },
      useLayoutEffect: function (a, e) {
        return Io(4194308, 4, a, e);
      },
      useInsertionEffect: function (a, e) {
        Io(4, 2, a, e);
      },
      useMemo: function (a, e) {
        var t = Ta();
        e = e === void 0 ? null : e;
        var l = a();
        if (Ot) {
          We(!0);
          try {
            a();
          } finally {
            We(!1);
          }
        }
        return t.memoizedState = [l, e], l;
      },
      useReducer: function (a, e, t) {
        var l = Ta();
        if (t !== void 0) {
          var u = t(e);
          if (Ot) {
            We(!0);
            try {
              t(e);
            } finally {
              We(!1);
            }
          }
        } else u = e;
        return l.memoizedState = l.baseState = u, a = {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: a,
          lastRenderedState: u
        }, l.queue = a, a = a.dispatch = ix.bind(null, O, a), [l.memoizedState, a];
      },
      useRef: function (a) {
        var e = Ta();
        return a = {
          current: a
        }, e.memoizedState = a;
      },
      useState: function (a) {
        a = uf(a);
        var e = a.queue,
          t = fp.bind(null, O, e);
        return e.dispatch = t, [a.memoizedState, t];
      },
      useDebugValue: us,
      useDeferredValue: function (a, e) {
        var t = Ta();
        return os(t, a, e);
      },
      useTransition: function () {
        var a = uf(!1);
        return a = lp.bind(null, O, a.queue, !0, !1), Ta().memoizedState = a, [!1, a];
      },
      useSyncExternalStore: function (a, e, t) {
        var l = O,
          u = Ta();
        if (F) {
          if (t === void 0) throw Error(L(407));
          t = t();
        } else {
          if (t = e(), Z === null) throw Error(L(349));
          (H & 127) !== 0 || Hc(l, e, t);
        }
        u.memoizedState = t;
        var o = {
          value: t,
          getSnapshot: e
        };
        return u.queue = o, Yi(Gc.bind(null, l, o, a), [a]), l.flags |= 2048, Cl(9, {
          destroy: void 0
        }, Fc.bind(null, l, o, t, e), null), t;
      },
      useId: function () {
        var a = Ta(),
          e = Z.identifierPrefix;
        if (F) {
          var t = pe,
            l = ce;
          t = (l & ~(1 << 32 - Pa(l) - 1)).toString(32) + t, e = "_" + e + "R_" + t, t = Xo++, 0 < t && (e += "H" + t.toString(32)), e += "_";
        } else t = lx++, e = "_" + e + "r_" + t.toString(32) + "_";
        return a.memoizedState = e;
      },
      useHostTransitionStatus: rs,
      useFormState: Vi,
      useActionState: Vi,
      useOptimistic: function (a) {
        var e = Ta();
        e.memoizedState = e.baseState = a;
        var t = {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: null,
          lastRenderedState: null
        };
        return e.queue = t, e = ds.bind(null, O, !0, t), t.dispatch = e, [a, e];
      },
      useMemoCache: es,
      useCacheRefresh: function () {
        return Ta().memoizedState = sx.bind(null, O);
      },
      useEffectEvent: function (a) {
        var e = Ta(),
          t = {
            impl: a
          };
        return e.memoizedState = t, function () {
          if ((G & 2) !== 0) throw Error(L(440));
          return t.impl.apply(void 0, arguments);
        };
      }
    },
    fs = {
      readContext: ba,
      use: gr,
      useCallback: ap,
      useContext: ba,
      useEffect: ls,
      useImperativeHandle: $c,
      useInsertionEffect: Kc,
      useLayoutEffect: Wc,
      useMemo: ep,
      useReducer: Co,
      useRef: jc,
      useState: function () {
        return Co(qe);
      },
      useDebugValue: us,
      useDeferredValue: function (a, e) {
        var t = la();
        return tp(t, X.memoizedState, a, e);
      },
      useTransition: function () {
        var a = Co(qe)[0],
          e = la().memoizedState;
        return [typeof a == "boolean" ? a : zu(a), e];
      },
      useSyncExternalStore: Ec,
      useId: rp,
      useHostTransitionStatus: rs,
      useFormState: Xi,
      useActionState: Xi,
      useOptimistic: function (a, e) {
        var t = la();
        return Pc(t, X, a, e);
      },
      useMemoCache: es,
      useCacheRefresh: dp
    };
  fs.useEffectEvent = Qc;
  var cp = {
    readContext: ba,
    use: gr,
    useCallback: ap,
    useContext: ba,
    useEffect: ls,
    useImperativeHandle: $c,
    useInsertionEffect: Kc,
    useLayoutEffect: Wc,
    useMemo: ep,
    useReducer: md,
    useRef: jc,
    useState: function () {
      return md(qe);
    },
    useDebugValue: us,
    useDeferredValue: function (a, e) {
      var t = la();
      return X === null ? os(t, a, e) : tp(t, X.memoizedState, a, e);
    },
    useTransition: function () {
      var a = md(qe)[0],
        e = la().memoizedState;
      return [typeof a == "boolean" ? a : zu(a), e];
    },
    useSyncExternalStore: Ec,
    useId: rp,
    useHostTransitionStatus: rs,
    useFormState: Zi,
    useActionState: Zi,
    useOptimistic: function (a, e) {
      var t = la();
      return X !== null ? Pc(t, X, a, e) : (t.baseState = a, [a, t.queue.dispatch]);
    },
    useMemoCache: es,
    useCacheRefresh: dp
  };
  cp.useEffectEvent = Qc;
  function gd(a, e, t, l) {
    e = a.memoizedState, t = t(l, e), t = t == null ? e : W({}, e, t), a.memoizedState = t, a.lanes === 0 && (a.updateQueue.baseState = t);
  }
  var df = {
    enqueueSetState: function (a, e, t) {
      a = a._reactInternals;
      var l = Va(),
        u = ut(l);
      u.payload = e, t != null && (u.callback = t), e = ot(a, u, l), e !== null && (za(e, a, l), uu(e, a, l));
    },
    enqueueReplaceState: function (a, e, t) {
      a = a._reactInternals;
      var l = Va(),
        u = ut(l);
      u.tag = 1, u.payload = e, t != null && (u.callback = t), e = ot(a, u, l), e !== null && (za(e, a, l), uu(e, a, l));
    },
    enqueueForceUpdate: function (a, e) {
      a = a._reactInternals;
      var t = Va(),
        l = ut(t);
      l.tag = 2, e != null && (l.callback = e), e = ot(a, l, t), e !== null && (za(e, a, t), uu(e, a, t));
    }
  };
  function ji(a, e, t, l, u, o, r) {
    return a = a.stateNode, typeof a.shouldComponentUpdate == "function" ? a.shouldComponentUpdate(l, o, r) : e.prototype && e.prototype.isPureReactComponent ? !hu(t, l) || !hu(u, o) : !0;
  }
  function Qi(a, e, t, l) {
    a = e.state, typeof e.componentWillReceiveProps == "function" && e.componentWillReceiveProps(t, l), typeof e.UNSAFE_componentWillReceiveProps == "function" && e.UNSAFE_componentWillReceiveProps(t, l), e.state !== a && df.enqueueReplaceState(e, e.state, null);
  }
  function zt(a, e) {
    var t = e;
    if ("ref" in e) {
      t = {};
      for (var l in e) l !== "ref" && (t[l] = e[l]);
    }
    if (a = a.defaultProps) {
      t === e && (t = W({}, t));
      for (var u in a) t[u] === void 0 && (t[u] = a[u]);
    }
    return t;
  }
  function pp(a) {
    Eo(a);
  }
  function mp(a) {
    console.error(a);
  }
  function gp(a) {
    Eo(a);
  }
  function Zo(a, e) {
    try {
      var t = a.onUncaughtError;
      t(e.value, {
        componentStack: e.stack
      });
    } catch (l) {
      setTimeout(function () {
        throw l;
      });
    }
  }
  function Ki(a, e, t) {
    try {
      var l = a.onCaughtError;
      l(t.value, {
        componentStack: t.stack,
        errorBoundary: e.tag === 1 ? e.stateNode : null
      });
    } catch (u) {
      setTimeout(function () {
        throw u;
      });
    }
  }
  function ff(a, e, t) {
    return t = ut(t), t.tag = 3, t.payload = {
      element: null
    }, t.callback = function () {
      Zo(a, e);
    }, t;
  }
  function hp(a) {
    return a = ut(a), a.tag = 3, a;
  }
  function xp(a, e, t, l) {
    var u = t.type.getDerivedStateFromError;
    if (typeof u == "function") {
      var o = l.value;
      a.payload = function () {
        return u(o);
      }, a.callback = function () {
        Ki(e, t, l);
      };
    }
    var r = t.stateNode;
    r !== null && typeof r.componentDidCatch == "function" && (a.callback = function () {
      Ki(e, t, l), typeof u != "function" && (rt === null ? rt = new Set([this]) : rt.add(this));
      var d = l.stack;
      this.componentDidCatch(l.value, {
        componentStack: d !== null ? d : ""
      });
    });
  }
  function nx(a, e, t, l, u) {
    if (t.flags |= 32768, l !== null && typeof l == "object" && typeof l.then == "function") {
      if (e = t.alternate, e !== null && Bl(e, t, u, !0), t = Za.current, t !== null) {
        switch (t.tag) {
          case 31:
          case 13:
            return te === null ? Wo() : t.alternate === null && ea === 0 && (ea = 3), t.flags &= -257, t.flags |= 65536, t.lanes = u, l === No ? t.flags |= 16384 : (e = t.updateQueue, e === null ? t.updateQueue = new Set([l]) : e.add(l), Ad(a, l, u)), !1;
          case 22:
            return t.flags |= 65536, l === No ? t.flags |= 16384 : (e = t.updateQueue, e === null ? (e = {
              transitions: null,
              markerInstances: null,
              retryQueue: new Set([l])
            }, t.updateQueue = e) : (t = e.retryQueue, t === null ? e.retryQueue = new Set([l]) : t.add(l)), Ad(a, l, u)), !1;
        }
        throw Error(L(435, t.tag));
      }
      return Ad(a, l, u), Wo(), !1;
    }
    if (F) return e = Za.current, e !== null ? ((e.flags & 65536) === 0 && (e.flags |= 256), e.flags |= 65536, e.lanes = u, l !== Qd && (a = Error(L(422), {
      cause: l
    }), Lu(ae(a, t)))) : (l !== Qd && (e = Error(L(423), {
      cause: l
    }), Lu(ae(e, t))), a = a.current.alternate, a.flags |= 65536, u &= -u, a.lanes |= u, l = ae(l, t), u = ff(a.stateNode, l, u), pd(a, u), ea !== 4 && (ea = 2)), !1;
    var o = Error(L(520), {
      cause: l
    });
    if (o = ae(o, t), iu === null ? iu = [o] : iu.push(o), ea !== 4 && (ea = 2), e === null) return !0;
    l = ae(l, t), t = e;
    do {
      switch (t.tag) {
        case 3:
          return t.flags |= 65536, a = u & -u, t.lanes |= a, a = ff(t.stateNode, l, a), pd(t, a), !1;
        case 1:
          if (e = t.type, o = t.stateNode, (t.flags & 128) === 0 && (typeof e.getDerivedStateFromError == "function" || o !== null && typeof o.componentDidCatch == "function" && (rt === null || !rt.has(o)))) return t.flags |= 65536, u &= -u, t.lanes |= u, u = hp(u), xp(u, a, t, l), pd(t, u), !1;
      }
      t = t.return;
    } while (t !== null);
    return !1;
  }
  var ss = Error(L(461)),
    fa = !1;
  function La(a, e, t, l) {
    e.child = a === null ? Bc(e, null, t, l) : Rt(e, a.child, t, l);
  }
  function Wi(a, e, t, l, u) {
    t = t.render;
    var o = e.ref;
    if ("ref" in l) {
      var r = {};
      for (var d in l) d !== "ref" && (r[d] = l[d]);
    } else r = l;
    return Bt(e), l = Wf(a, e, t, r, o, u), d = Jf(), a !== null && !fa ? ($f(a, e, u), Ee(a, e, u)) : (F && d && Pf(e), e.flags |= 1, La(a, e, l, u), e.child);
  }
  function Ji(a, e, t, l, u) {
    if (a === null) {
      var o = t.type;
      return typeof o == "function" && !_f(o) && o.defaultProps === void 0 && t.compare === null ? (e.tag = 15, e.type = o, Lp(a, e, o, l, u)) : (a = bo(t.type, null, l, e, e.mode, u), a.ref = e.ref, a.return = e, e.child = a);
    }
    if (o = a.child, !is(a, u)) {
      var r = o.memoizedProps;
      if (t = t.compare, t = t !== null ? t : hu, t(r, l) && a.ref === e.ref) return Ee(a, e, u);
    }
    return e.flags |= 1, a = Be(o, l), a.ref = e.ref, a.return = e, e.child = a;
  }
  function Lp(a, e, t, l, u) {
    if (a !== null) {
      var o = a.memoizedProps;
      if (hu(o, l) && a.ref === e.ref) if (fa = !1, e.pendingProps = l = o, is(a, u)) (a.flags & 131072) !== 0 && (fa = !0);else return e.lanes = a.lanes, Ee(a, e, u);
    }
    return sf(a, e, t, l, u);
  }
  function vp(a, e, t, l) {
    var u = l.children,
      o = a !== null ? a.memoizedState : null;
    if (a === null && e.stateNode === null && (e.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }), l.mode === "hidden") {
      if ((e.flags & 128) !== 0) {
        if (o = o !== null ? o.baseLanes | t : t, a !== null) {
          for (l = e.child = a.child, u = 0; l !== null;) u = u | l.lanes | l.childLanes, l = l.sibling;
          l = u & ~o;
        } else l = 0, e.child = null;
        return $i(a, e, o, t, l);
      }
      if ((t & 536870912) !== 0) e.memoizedState = {
        baseLanes: 0,
        cachePool: null
      }, a !== null && yo(e, o !== null ? o.cachePool : null), o !== null ? Ni(e, o) : tf(), zc(e);else return l = e.lanes = 536870912, $i(a, e, o !== null ? o.baseLanes | t : t, t, l);
    } else o !== null ? (yo(e, o.cachePool), Ni(e, o), Qe(e), e.memoizedState = null) : (a !== null && yo(e, null), tf(), Qe(e));
    return La(a, e, u, t), e.child;
  }
  function Jl(a, e) {
    return a !== null && a.tag === 22 || e.stateNode !== null || (e.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }), e.sibling;
  }
  function $i(a, e, t, l, u) {
    var o = Zf();
    return o = o === null ? null : {
      parent: da._currentValue,
      pool: o
    }, e.memoizedState = {
      baseLanes: t,
      cachePool: o
    }, a !== null && yo(e, null), tf(), zc(e), a !== null && Bl(a, e, l, !0), e.childLanes = u, null;
  }
  function wo(a, e) {
    return e = Yo({
      mode: e.mode,
      children: e.children
    }, a.mode), e.ref = a.ref, a.child = e, e.return = a, e;
  }
  function an(a, e, t) {
    return Rt(e, a.child, null, t), a = wo(e, e.pendingProps), a.flags |= 2, Ha(e), e.memoizedState = null, a;
  }
  function cx(a, e, t) {
    var l = e.pendingProps,
      u = (e.flags & 128) !== 0;
    if (e.flags &= -129, a === null) {
      if (F) {
        if (l.mode === "hidden") return a = wo(e, l), e.lanes = 536870912, Jl(null, a);
        if (lf(e), (a = K) ? (a = nm(a, ee), a = a !== null && a.data === "&" ? a : null, a !== null && (e.memoizedState = {
          dehydrated: a,
          treeContext: nt !== null ? {
            id: ce,
            overflow: pe
          } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, t = Ic(a), t.return = e, e.child = t, Sa = e, K = null)) : a = null, a === null) throw ct(e);
        return e.lanes = 536870912, null;
      }
      return wo(e, l);
    }
    var o = a.memoizedState;
    if (o !== null) {
      var r = o.dehydrated;
      if (lf(e), u) {
        if (e.flags & 256) e.flags &= -257, e = an(a, e, t);else if (e.memoizedState !== null) e.child = a.child, e.flags |= 128, e = null;else throw Error(L(558));
      } else if (fa || Bl(a, e, t, !1), u = (t & a.childLanes) !== 0, fa || u) {
        if (l = Z, l !== null && (r = Kn(l, t), r !== 0 && r !== o.retryLane)) throw o.retryLane = r, Ht(a, r), za(l, a, r), ss;
        Wo(), e = an(a, e, t);
      } else a = o.treeContext, K = le(r.nextSibling), Sa = e, F = !0, lt = null, ee = !1, a !== null && Ac(e, a), e = wo(e, l), e.flags |= 4096;
      return e;
    }
    return a = Be(a.child, {
      mode: l.mode,
      children: l.children
    }), a.ref = e.ref, e.child = a, a.return = e, a;
  }
  function Ao(a, e) {
    var t = e.ref;
    if (t === null) a !== null && a.ref !== null && (e.flags |= 4194816);else {
      if (typeof t != "function" && typeof t != "object") throw Error(L(284));
      (a === null || a.ref !== t) && (e.flags |= 4194816);
    }
  }
  function sf(a, e, t, l, u) {
    return Bt(e), t = Wf(a, e, t, l, void 0, u), l = Jf(), a !== null && !fa ? ($f(a, e, u), Ee(a, e, u)) : (F && l && Pf(e), e.flags |= 1, La(a, e, t, u), e.child);
  }
  function en(a, e, t, l, u, o) {
    return Bt(e), e.updateQueue = null, t = qc(e, l, t, u), Uc(a), l = Jf(), a !== null && !fa ? ($f(a, e, o), Ee(a, e, o)) : (F && l && Pf(e), e.flags |= 1, La(a, e, t, o), e.child);
  }
  function tn(a, e, t, l, u) {
    if (Bt(e), e.stateNode === null) {
      var o = dl,
        r = t.contextType;
      typeof r == "object" && r !== null && (o = ba(r)), o = new t(l, o), e.memoizedState = o.state !== null && o.state !== void 0 ? o.state : null, o.updater = df, e.stateNode = o, o._reactInternals = e, o = e.stateNode, o.props = l, o.state = e.memoizedState, o.refs = {}, jf(e), r = t.contextType, o.context = typeof r == "object" && r !== null ? ba(r) : dl, o.state = e.memoizedState, r = t.getDerivedStateFromProps, typeof r == "function" && (gd(e, t, r, l), o.state = e.memoizedState), typeof t.getDerivedStateFromProps == "function" || typeof o.getSnapshotBeforeUpdate == "function" || typeof o.UNSAFE_componentWillMount != "function" && typeof o.componentWillMount != "function" || (r = o.state, typeof o.componentWillMount == "function" && o.componentWillMount(), typeof o.UNSAFE_componentWillMount == "function" && o.UNSAFE_componentWillMount(), r !== o.state && df.enqueueReplaceState(o, o.state, null), ru(e, l, o, u), ou(), o.state = e.memoizedState), typeof o.componentDidMount == "function" && (e.flags |= 4194308), l = !0;
    } else if (a === null) {
      o = e.stateNode;
      var d = e.memoizedProps,
        f = zt(t, d);
      o.props = f;
      var s = o.context,
        g = t.contextType;
      r = dl, typeof g == "object" && g !== null && (r = ba(g));
      var h = t.getDerivedStateFromProps;
      g = typeof h == "function" || typeof o.getSnapshotBeforeUpdate == "function", d = e.pendingProps !== d, g || typeof o.UNSAFE_componentWillReceiveProps != "function" && typeof o.componentWillReceiveProps != "function" || (d || s !== r) && Qi(e, o, l, r), Ze = !1;
      var c = e.memoizedState;
      o.state = c, ru(e, l, o, u), ou(), s = e.memoizedState, d || c !== s || Ze ? (typeof h == "function" && (gd(e, t, h, l), s = e.memoizedState), (f = Ze || ji(e, t, f, l, c, s, r)) ? (g || typeof o.UNSAFE_componentWillMount != "function" && typeof o.componentWillMount != "function" || (typeof o.componentWillMount == "function" && o.componentWillMount(), typeof o.UNSAFE_componentWillMount == "function" && o.UNSAFE_componentWillMount()), typeof o.componentDidMount == "function" && (e.flags |= 4194308)) : (typeof o.componentDidMount == "function" && (e.flags |= 4194308), e.memoizedProps = l, e.memoizedState = s), o.props = l, o.state = s, o.context = r, l = f) : (typeof o.componentDidMount == "function" && (e.flags |= 4194308), l = !1);
    } else {
      o = e.stateNode, af(a, e), r = e.memoizedProps, g = zt(t, r), o.props = g, h = e.pendingProps, c = o.context, s = t.contextType, f = dl, typeof s == "object" && s !== null && (f = ba(s)), d = t.getDerivedStateFromProps, (s = typeof d == "function" || typeof o.getSnapshotBeforeUpdate == "function") || typeof o.UNSAFE_componentWillReceiveProps != "function" && typeof o.componentWillReceiveProps != "function" || (r !== h || c !== f) && Qi(e, o, l, f), Ze = !1, c = e.memoizedState, o.state = c, ru(e, l, o, u), ou();
      var m = e.memoizedState;
      r !== h || c !== m || Ze || a !== null && a.dependencies !== null && Go(a.dependencies) ? (typeof d == "function" && (gd(e, t, d, l), m = e.memoizedState), (g = Ze || ji(e, t, g, l, c, m, f) || a !== null && a.dependencies !== null && Go(a.dependencies)) ? (s || typeof o.UNSAFE_componentWillUpdate != "function" && typeof o.componentWillUpdate != "function" || (typeof o.componentWillUpdate == "function" && o.componentWillUpdate(l, m, f), typeof o.UNSAFE_componentWillUpdate == "function" && o.UNSAFE_componentWillUpdate(l, m, f)), typeof o.componentDidUpdate == "function" && (e.flags |= 4), typeof o.getSnapshotBeforeUpdate == "function" && (e.flags |= 1024)) : (typeof o.componentDidUpdate != "function" || r === a.memoizedProps && c === a.memoizedState || (e.flags |= 4), typeof o.getSnapshotBeforeUpdate != "function" || r === a.memoizedProps && c === a.memoizedState || (e.flags |= 1024), e.memoizedProps = l, e.memoizedState = m), o.props = l, o.state = m, o.context = f, l = g) : (typeof o.componentDidUpdate != "function" || r === a.memoizedProps && c === a.memoizedState || (e.flags |= 4), typeof o.getSnapshotBeforeUpdate != "function" || r === a.memoizedProps && c === a.memoizedState || (e.flags |= 1024), l = !1);
    }
    return o = l, Ao(a, e), l = (e.flags & 128) !== 0, o || l ? (o = e.stateNode, t = l && typeof t.getDerivedStateFromError != "function" ? null : o.render(), e.flags |= 1, a !== null && l ? (e.child = Rt(e, a.child, null, u), e.child = Rt(e, null, t, u)) : La(a, e, t, u), e.memoizedState = o.state, a = e.child) : a = Ee(a, e, u), a;
  }
  function ln(a, e, t, l) {
    return Dt(), e.flags |= 256, La(a, e, t, l), e.child;
  }
  var hd = {
    dehydrated: null,
    treeContext: null,
    retryLane: 0,
    hydrationErrors: null
  };
  function xd(a) {
    return {
      baseLanes: a,
      cachePool: Mc()
    };
  }
  function Ld(a, e, t) {
    return a = a !== null ? a.childLanes & ~t : 0, e && (a |= Ga), a;
  }
  function Sp(a, e, t) {
    var l = e.pendingProps,
      u = !1,
      o = (e.flags & 128) !== 0,
      r;
    if ((r = o) || (r = a !== null && a.memoizedState === null ? !1 : (ta.current & 2) !== 0), r && (u = !0, e.flags &= -129), r = (e.flags & 32) !== 0, e.flags &= -33, a === null) {
      if (F) {
        if (u ? je(e) : Qe(e), (a = K) ? (a = nm(a, ee), a = a !== null && a.data !== "&" ? a : null, a !== null && (e.memoizedState = {
          dehydrated: a,
          treeContext: nt !== null ? {
            id: ce,
            overflow: pe
          } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, t = Ic(a), t.return = e, e.child = t, Sa = e, K = null)) : a = null, a === null) throw ct(e);
        return If(a) ? e.lanes = 32 : e.lanes = 536870912, null;
      }
      var d = l.children;
      return l = l.fallback, u ? (Qe(e), u = e.mode, d = Yo({
        mode: "hidden",
        children: d
      }, u), l = At(l, u, t, null), d.return = e, l.return = e, d.sibling = l, e.child = d, l = e.child, l.memoizedState = xd(t), l.childLanes = Ld(a, r, t), e.memoizedState = hd, Jl(null, l)) : (je(e), nf(e, d));
    }
    var f = a.memoizedState;
    if (f !== null && (d = f.dehydrated, d !== null)) {
      if (o) e.flags & 256 ? (je(e), e.flags &= -257, e = vd(a, e, t)) : e.memoizedState !== null ? (Qe(e), e.child = a.child, e.flags |= 128, e = null) : (Qe(e), d = l.fallback, u = e.mode, l = Yo({
        mode: "visible",
        children: l.children
      }, u), d = At(d, u, t, null), d.flags |= 2, l.return = e, d.return = e, l.sibling = d, e.child = l, Rt(e, a.child, null, t), l = e.child, l.memoizedState = xd(t), l.childLanes = Ld(a, r, t), e.memoizedState = hd, e = Jl(null, l));else if (je(e), If(d)) {
        if (r = d.nextSibling && d.nextSibling.dataset, r) var s = r.dgst;
        r = s, l = Error(L(419)), l.stack = "", l.digest = r, Lu({
          value: l,
          source: null,
          stack: null
        }), e = vd(a, e, t);
      } else if (fa || Bl(a, e, t, !1), r = (t & a.childLanes) !== 0, fa || r) {
        if (r = Z, r !== null && (l = Kn(r, t), l !== 0 && l !== f.retryLane)) throw f.retryLane = l, Ht(a, l), za(r, a, l), ss;
        Cf(d) || Wo(), e = vd(a, e, t);
      } else Cf(d) ? (e.flags |= 192, e.child = a.child, e = null) : (a = f.treeContext, K = le(d.nextSibling), Sa = e, F = !0, lt = null, ee = !1, a !== null && Ac(e, a), e = nf(e, l.children), e.flags |= 4096);
      return e;
    }
    return u ? (Qe(e), d = l.fallback, u = e.mode, f = a.child, s = f.sibling, l = Be(f, {
      mode: "hidden",
      children: l.children
    }), l.subtreeFlags = f.subtreeFlags & 65011712, s !== null ? d = Be(s, d) : (d = At(d, u, t, null), d.flags |= 2), d.return = e, l.return = e, l.sibling = d, e.child = l, Jl(null, l), l = e.child, d = a.child.memoizedState, d === null ? d = xd(t) : (u = d.cachePool, u !== null ? (f = da._currentValue, u = u.parent !== f ? {
      parent: f,
      pool: f
    } : u) : u = Mc(), d = {
      baseLanes: d.baseLanes | t,
      cachePool: u
    }), l.memoizedState = d, l.childLanes = Ld(a, r, t), e.memoizedState = hd, Jl(a.child, l)) : (je(e), t = a.child, a = t.sibling, t = Be(t, {
      mode: "visible",
      children: l.children
    }), t.return = e, t.sibling = null, a !== null && (r = e.deletions, r === null ? (e.deletions = [a], e.flags |= 16) : r.push(a)), e.child = t, e.memoizedState = null, t);
  }
  function nf(a, e) {
    return e = Yo({
      mode: "visible",
      children: e
    }, a.mode), e.return = a, a.child = e;
  }
  function Yo(a, e) {
    return a = Fa(22, a, null, e), a.lanes = 0, a;
  }
  function vd(a, e, t) {
    return Rt(e, a.child, null, t), a = nf(e, e.pendingProps.children), a.flags |= 2, e.memoizedState = null, a;
  }
  function un(a, e, t) {
    a.lanes |= e;
    var l = a.alternate;
    l !== null && (l.lanes |= e), Wd(a.return, e, t);
  }
  function Sd(a, e, t, l, u, o) {
    var r = a.memoizedState;
    r === null ? a.memoizedState = {
      isBackwards: e,
      rendering: null,
      renderingStartTime: 0,
      last: l,
      tail: t,
      tailMode: u,
      treeForkCount: o
    } : (r.isBackwards = e, r.rendering = null, r.renderingStartTime = 0, r.last = l, r.tail = t, r.tailMode = u, r.treeForkCount = o);
  }
  function bp(a, e, t) {
    var l = e.pendingProps,
      u = l.revealOrder,
      o = l.tail;
    l = l.children;
    var r = ta.current,
      d = (r & 2) !== 0;
    if (d ? (r = r & 1 | 2, e.flags |= 128) : r &= 1, Y(ta, r), La(a, e, l, t), l = F ? xu : 0, !d && a !== null && (a.flags & 128) !== 0) a: for (a = e.child; a !== null;) {
      if (a.tag === 13) a.memoizedState !== null && un(a, t, e);else if (a.tag === 19) un(a, t, e);else if (a.child !== null) {
        a.child.return = a, a = a.child;
        continue;
      }
      if (a === e) break a;
      for (; a.sibling === null;) {
        if (a.return === null || a.return === e) break a;
        a = a.return;
      }
      a.sibling.return = a.return, a = a.sibling;
    }
    switch (u) {
      case "forwards":
        for (t = e.child, u = null; t !== null;) a = t.alternate, a !== null && Po(a) === null && (u = t), t = t.sibling;
        t = u, t === null ? (u = e.child, e.child = null) : (u = t.sibling, t.sibling = null), Sd(e, !1, u, t, o, l);
        break;
      case "backwards":
      case "unstable_legacy-backwards":
        for (t = null, u = e.child, e.child = null; u !== null;) {
          if (a = u.alternate, a !== null && Po(a) === null) {
            e.child = u;
            break;
          }
          a = u.sibling, u.sibling = t, t = u, u = a;
        }
        Sd(e, !0, t, null, o, l);
        break;
      case "together":
        Sd(e, !1, null, null, void 0, l);
        break;
      default:
        e.memoizedState = null;
    }
    return e.child;
  }
  function Ee(a, e, t) {
    if (a !== null && (e.dependencies = a.dependencies), mt |= e.lanes, (t & e.childLanes) === 0) if (a !== null) {
      if (Bl(a, e, t, !1), (t & e.childLanes) === 0) return null;
    } else return null;
    if (a !== null && e.child !== a.child) throw Error(L(153));
    if (e.child !== null) {
      for (a = e.child, t = Be(a, a.pendingProps), e.child = t, t.return = e; a.sibling !== null;) a = a.sibling, t = t.sibling = Be(a, a.pendingProps), t.return = e;
      t.sibling = null;
    }
    return e.child;
  }
  function is(a, e) {
    return (a.lanes & e) !== 0 ? !0 : (a = a.dependencies, !!(a !== null && Go(a)));
  }
  function px(a, e, t) {
    switch (e.tag) {
      case 3:
        Oo(e, e.stateNode.containerInfo), Ye(e, da, a.memoizedState.cache), Dt();
        break;
      case 27:
      case 5:
        Hd(e);
        break;
      case 4:
        Oo(e, e.stateNode.containerInfo);
        break;
      case 10:
        Ye(e, e.type, e.memoizedProps.value);
        break;
      case 31:
        if (e.memoizedState !== null) return e.flags |= 128, lf(e), null;
        break;
      case 13:
        var l = e.memoizedState;
        if (l !== null) return l.dehydrated !== null ? (je(e), e.flags |= 128, null) : (t & e.child.childLanes) !== 0 ? Sp(a, e, t) : (je(e), a = Ee(a, e, t), a !== null ? a.sibling : null);
        je(e);
        break;
      case 19:
        var u = (a.flags & 128) !== 0;
        if (l = (t & e.childLanes) !== 0, l || (Bl(a, e, t, !1), l = (t & e.childLanes) !== 0), u) {
          if (l) return bp(a, e, t);
          e.flags |= 128;
        }
        if (u = e.memoizedState, u !== null && (u.rendering = null, u.tail = null, u.lastEffect = null), Y(ta, ta.current), l) break;
        return null;
      case 22:
        return e.lanes = 0, vp(a, e, t, e.pendingProps);
      case 24:
        Ye(e, da, a.memoizedState.cache);
    }
    return Ee(a, e, t);
  }
  function yp(a, e, t) {
    if (a !== null) {
      if (a.memoizedProps !== e.pendingProps) fa = !0;else {
        if (!is(a, t) && (e.flags & 128) === 0) return fa = !1, px(a, e, t);
        fa = (a.flags & 131072) !== 0;
      }
    } else fa = !1, F && (e.flags & 1048576) !== 0 && wc(e, xu, e.index);
    switch (e.lanes = 0, e.tag) {
      case 16:
        a: {
          var l = e.pendingProps;
          if (a = Ct(e.elementType), e.type = a, typeof a == "function") _f(a) ? (l = zt(a, l), e.tag = 1, e = tn(null, e, a, l, t)) : (e.tag = 0, e = sf(null, e, a, l, t));else {
            if (a != null) {
              var u = a.$$typeof;
              if (u === Mf) {
                e.tag = 11, e = Wi(null, e, a, l, t);
                break a;
              } else if (u === Tf) {
                e.tag = 14, e = Ji(null, e, a, l, t);
                break a;
              }
            }
            throw e = qd(a) || a, Error(L(306, e, ""));
          }
        }
        return e;
      case 0:
        return sf(a, e, e.type, e.pendingProps, t);
      case 1:
        return l = e.type, u = zt(l, e.pendingProps), tn(a, e, l, u, t);
      case 3:
        a: {
          if (Oo(e, e.stateNode.containerInfo), a === null) throw Error(L(387));
          l = e.pendingProps;
          var o = e.memoizedState;
          u = o.element, af(a, e), ru(e, l, null, t);
          var r = e.memoizedState;
          if (l = r.cache, Ye(e, da, l), l !== o.cache && Jd(e, [da], t, !0), ou(), l = r.element, o.isDehydrated) {
            if (o = {
              element: l,
              isDehydrated: !1,
              cache: r.cache
            }, e.updateQueue.baseState = o, e.memoizedState = o, e.flags & 256) {
              e = ln(a, e, l, t);
              break a;
            } else if (l !== u) {
              u = ae(Error(L(424)), e), Lu(u), e = ln(a, e, l, t);
              break a;
            } else for (a = e.stateNode.containerInfo, a.nodeType === 9 ? a = a.body : a = a.nodeName === "HTML" ? a.ownerDocument.body : a, K = le(a.firstChild), Sa = e, F = !0, lt = null, ee = !0, t = Bc(e, null, l, t), e.child = t; t;) t.flags = t.flags & -3 | 4096, t = t.sibling;
          } else {
            if (Dt(), l === u) {
              e = Ee(a, e, t);
              break a;
            }
            La(a, e, l, t);
          }
          e = e.child;
        }
        return e;
      case 26:
        return Ao(a, e), a === null ? (t = kn(e.type, null, e.pendingProps, null)) ? e.memoizedState = t : F || (t = e.type, a = e.pendingProps, l = er(tt.current).createElement(t), l[va] = e, l[Ua] = a, ya(l, t, a), ha(l), e.stateNode = l) : e.memoizedState = kn(e.type, a.memoizedProps, e.pendingProps, a.memoizedState), null;
      case 27:
        return Hd(e), a === null && F && (l = e.stateNode = cm(e.type, e.pendingProps, tt.current), Sa = e, ee = !0, u = K, ht(e.type) ? (wf = u, K = le(l.firstChild)) : K = u), La(a, e, e.pendingProps.children, t), Ao(a, e), a === null && (e.flags |= 4194304), e.child;
      case 5:
        return a === null && F && ((u = l = K) && (l = Nx(l, e.type, e.pendingProps, ee), l !== null ? (e.stateNode = l, Sa = e, K = le(l.firstChild), ee = !1, u = !0) : u = !1), u || ct(e)), Hd(e), u = e.type, o = e.pendingProps, r = a !== null ? a.memoizedProps : null, l = o.children, bf(u, o) ? l = null : r !== null && bf(u, r) && (e.flags |= 32), e.memoizedState !== null && (u = Wf(a, e, ux, null, null, t), Iu._currentValue = u), Ao(a, e), La(a, e, l, t), e.child;
      case 6:
        return a === null && F && ((a = t = K) && (t = _x(t, e.pendingProps, ee), t !== null ? (e.stateNode = t, Sa = e, K = null, a = !0) : a = !1), a || ct(e)), null;
      case 13:
        return Sp(a, e, t);
      case 4:
        return Oo(e, e.stateNode.containerInfo), l = e.pendingProps, a === null ? e.child = Rt(e, null, l, t) : La(a, e, l, t), e.child;
      case 11:
        return Wi(a, e, e.type, e.pendingProps, t);
      case 7:
        return La(a, e, e.pendingProps, t), e.child;
      case 8:
        return La(a, e, e.pendingProps.children, t), e.child;
      case 12:
        return La(a, e, e.pendingProps.children, t), e.child;
      case 10:
        return l = e.pendingProps, Ye(e, e.type, l.value), La(a, e, l.children, t), e.child;
      case 9:
        return u = e.type._context, l = e.pendingProps.children, Bt(e), u = ba(u), l = l(u), e.flags |= 1, La(a, e, l, t), e.child;
      case 14:
        return Ji(a, e, e.type, e.pendingProps, t);
      case 15:
        return Lp(a, e, e.type, e.pendingProps, t);
      case 19:
        return bp(a, e, t);
      case 31:
        return cx(a, e, t);
      case 22:
        return vp(a, e, t, e.pendingProps);
      case 24:
        return Bt(e), l = ba(da), a === null ? (u = Zf(), u === null && (u = Z, o = Xf(), u.pooledCache = o, o.refCount++, o !== null && (u.pooledCacheLanes |= t), u = o), e.memoizedState = {
          parent: l,
          cache: u
        }, jf(e), Ye(e, da, u)) : ((a.lanes & t) !== 0 && (af(a, e), ru(e, null, null, t), ou()), u = a.memoizedState, o = e.memoizedState, u.parent !== l ? (u = {
          parent: l,
          cache: l
        }, e.memoizedState = u, e.lanes === 0 && (e.memoizedState = e.updateQueue.baseState = u), Ye(e, da, l)) : (l = o.cache, Ye(e, da, l), l !== u.cache && Jd(e, [da], t, !0))), La(a, e, e.pendingProps.children, t), e.child;
      case 29:
        throw e.pendingProps;
    }
    throw Error(L(156, e.tag));
  }
  function ye(a) {
    a.flags |= 4;
  }
  function bd(a, e, t, l, u) {
    if ((e = (a.mode & 32) !== 0) && (e = !1), e) {
      if (a.flags |= 16777216, (u & 335544128) === u) if (a.stateNode.complete) a.flags |= 8192;else if (Zp()) a.flags |= 8192;else throw Mt = No, Yf;
    } else a.flags &= -16777217;
  }
  function on(a, e) {
    if (e.type !== "stylesheet" || (e.state.loading & 4) !== 0) a.flags &= -16777217;else if (a.flags |= 16777216, !gm(e)) if (Zp()) a.flags |= 8192;else throw Mt = No, Yf;
  }
  function io(a, e) {
    e !== null && (a.flags |= 4), a.flags & 16384 && (e = a.tag !== 22 ? Yn() : 536870912, a.lanes |= e, Il |= e);
  }
  function Xl(a, e) {
    if (!F) switch (a.tailMode) {
      case "hidden":
        e = a.tail;
        for (var t = null; e !== null;) e.alternate !== null && (t = e), e = e.sibling;
        t === null ? a.tail = null : t.sibling = null;
        break;
      case "collapsed":
        t = a.tail;
        for (var l = null; t !== null;) t.alternate !== null && (l = t), t = t.sibling;
        l === null ? e || a.tail === null ? a.tail = null : a.tail.sibling = null : l.sibling = null;
    }
  }
  function Q(a) {
    var e = a.alternate !== null && a.alternate.child === a.child,
      t = 0,
      l = 0;
    if (e) for (var u = a.child; u !== null;) t |= u.lanes | u.childLanes, l |= u.subtreeFlags & 65011712, l |= u.flags & 65011712, u.return = a, u = u.sibling;else for (u = a.child; u !== null;) t |= u.lanes | u.childLanes, l |= u.subtreeFlags, l |= u.flags, u.return = a, u = u.sibling;
    return a.subtreeFlags |= l, a.childLanes = t, e;
  }
  function mx(a, e, t) {
    var l = e.pendingProps;
    switch (Vf(e), e.tag) {
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return Q(e), null;
      case 1:
        return Q(e), null;
      case 3:
        return t = e.stateNode, l = null, a !== null && (l = a.memoizedState.cache), e.memoizedState.cache !== l && (e.flags |= 2048), Re(da), Ll(), t.pendingContext && (t.context = t.pendingContext, t.pendingContext = null), (a === null || a.child === null) && (Qt(e) ? ye(e) : a === null || a.memoizedState.isDehydrated && (e.flags & 256) === 0 || (e.flags |= 1024, cd())), Q(e), null;
      case 26:
        var u = e.type,
          o = e.memoizedState;
        return a === null ? (ye(e), o !== null ? (Q(e), on(e, o)) : (Q(e), bd(e, u, null, l, t))) : o ? o !== a.memoizedState ? (ye(e), Q(e), on(e, o)) : (Q(e), e.flags &= -16777217) : (a = a.memoizedProps, a !== l && ye(e), Q(e), bd(e, u, a, l, t)), null;
      case 27:
        if (zo(e), t = tt.current, u = e.type, a !== null && e.stateNode != null) a.memoizedProps !== l && ye(e);else {
          if (!l) {
            if (e.stateNode === null) throw Error(L(166));
            return Q(e), null;
          }
          a = ge.current, Qt(e) ? zi(e, a) : (a = cm(u, l, t), e.stateNode = a, ye(e));
        }
        return Q(e), null;
      case 5:
        if (zo(e), u = e.type, a !== null && e.stateNode != null) a.memoizedProps !== l && ye(e);else {
          if (!l) {
            if (e.stateNode === null) throw Error(L(166));
            return Q(e), null;
          }
          if (o = ge.current, Qt(e)) zi(e, o);else {
            var r = er(tt.current);
            switch (o) {
              case 1:
                o = r.createElementNS("http://www.w3.org/2000/svg", u);
                break;
              case 2:
                o = r.createElementNS("http://www.w3.org/1998/Math/MathML", u);
                break;
              default:
                switch (u) {
                  case "svg":
                    o = r.createElementNS("http://www.w3.org/2000/svg", u);
                    break;
                  case "math":
                    o = r.createElementNS("http://www.w3.org/1998/Math/MathML", u);
                    break;
                  case "script":
                    o = r.createElement("div"), o.innerHTML = "<script><\/script>", o = o.removeChild(o.firstChild);
                    break;
                  case "select":
                    o = typeof l.is == "string" ? r.createElement("select", {
                      is: l.is
                    }) : r.createElement("select"), l.multiple ? o.multiple = !0 : l.size && (o.size = l.size);
                    break;
                  default:
                    o = typeof l.is == "string" ? r.createElement(u, {
                      is: l.is
                    }) : r.createElement(u);
                }
            }
            o[va] = e, o[Ua] = l;
            a: for (r = e.child; r !== null;) {
              if (r.tag === 5 || r.tag === 6) o.appendChild(r.stateNode);else if (r.tag !== 4 && r.tag !== 27 && r.child !== null) {
                r.child.return = r, r = r.child;
                continue;
              }
              if (r === e) break a;
              for (; r.sibling === null;) {
                if (r.return === null || r.return === e) break a;
                r = r.return;
              }
              r.sibling.return = r.return, r = r.sibling;
            }
            e.stateNode = o;
            a: switch (ya(o, u, l), u) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                l = !!l.autoFocus;
                break a;
              case "img":
                l = !0;
                break a;
              default:
                l = !1;
            }
            l && ye(e);
          }
        }
        return Q(e), bd(e, e.type, a === null ? null : a.memoizedProps, e.pendingProps, t), null;
      case 6:
        if (a && e.stateNode != null) a.memoizedProps !== l && ye(e);else {
          if (typeof l != "string" && e.stateNode === null) throw Error(L(166));
          if (a = tt.current, Qt(e)) {
            if (a = e.stateNode, t = e.memoizedProps, l = null, u = Sa, u !== null) switch (u.tag) {
              case 27:
              case 5:
                l = u.memoizedProps;
            }
            a[va] = e, a = !!(a.nodeValue === t || l !== null && l.suppressHydrationWarning === !0 || fm(a.nodeValue, t)), a || ct(e, !0);
          } else a = er(a).createTextNode(l), a[va] = e, e.stateNode = a;
        }
        return Q(e), null;
      case 31:
        if (t = e.memoizedState, a === null || a.memoizedState !== null) {
          if (l = Qt(e), t !== null) {
            if (a === null) {
              if (!l) throw Error(L(318));
              if (a = e.memoizedState, a = a !== null ? a.dehydrated : null, !a) throw Error(L(557));
              a[va] = e;
            } else Dt(), (e.flags & 128) === 0 && (e.memoizedState = null), e.flags |= 4;
            Q(e), a = !1;
          } else t = cd(), a !== null && a.memoizedState !== null && (a.memoizedState.hydrationErrors = t), a = !0;
          if (!a) return e.flags & 256 ? (Ha(e), e) : (Ha(e), null);
          if ((e.flags & 128) !== 0) throw Error(L(558));
        }
        return Q(e), null;
      case 13:
        if (l = e.memoizedState, a === null || a.memoizedState !== null && a.memoizedState.dehydrated !== null) {
          if (u = Qt(e), l !== null && l.dehydrated !== null) {
            if (a === null) {
              if (!u) throw Error(L(318));
              if (u = e.memoizedState, u = u !== null ? u.dehydrated : null, !u) throw Error(L(317));
              u[va] = e;
            } else Dt(), (e.flags & 128) === 0 && (e.memoizedState = null), e.flags |= 4;
            Q(e), u = !1;
          } else u = cd(), a !== null && a.memoizedState !== null && (a.memoizedState.hydrationErrors = u), u = !0;
          if (!u) return e.flags & 256 ? (Ha(e), e) : (Ha(e), null);
        }
        return Ha(e), (e.flags & 128) !== 0 ? (e.lanes = t, e) : (t = l !== null, a = a !== null && a.memoizedState !== null, t && (l = e.child, u = null, l.alternate !== null && l.alternate.memoizedState !== null && l.alternate.memoizedState.cachePool !== null && (u = l.alternate.memoizedState.cachePool.pool), o = null, l.memoizedState !== null && l.memoizedState.cachePool !== null && (o = l.memoizedState.cachePool.pool), o !== u && (l.flags |= 2048)), t !== a && t && (e.child.flags |= 8192), io(e, e.updateQueue), Q(e), null);
      case 4:
        return Ll(), a === null && xs(e.stateNode.containerInfo), Q(e), null;
      case 10:
        return Re(e.type), Q(e), null;
      case 19:
        if (xa(ta), l = e.memoizedState, l === null) return Q(e), null;
        if (u = (e.flags & 128) !== 0, o = l.rendering, o === null) {
          if (u) Xl(l, !1);else {
            if (ea !== 0 || a !== null && (a.flags & 128) !== 0) for (a = e.child; a !== null;) {
              if (o = Po(a), o !== null) {
                for (e.flags |= 128, Xl(l, !1), a = o.updateQueue, e.updateQueue = a, io(e, a), e.subtreeFlags = 0, a = t, t = e.child; t !== null;) Cc(t, a), t = t.sibling;
                return Y(ta, ta.current & 1 | 2), F && Ae(e, l.treeForkCount), e.child;
              }
              a = a.sibling;
            }
            l.tail !== null && Na() > Qo && (e.flags |= 128, u = !0, Xl(l, !1), e.lanes = 4194304);
          }
        } else {
          if (!u) if (a = Po(o), a !== null) {
            if (e.flags |= 128, u = !0, a = a.updateQueue, e.updateQueue = a, io(e, a), Xl(l, !0), l.tail === null && l.tailMode === "hidden" && !o.alternate && !F) return Q(e), null;
          } else 2 * Na() - l.renderingStartTime > Qo && t !== 536870912 && (e.flags |= 128, u = !0, Xl(l, !1), e.lanes = 4194304);
          l.isBackwards ? (o.sibling = e.child, e.child = o) : (a = l.last, a !== null ? a.sibling = o : e.child = o, l.last = o);
        }
        return l.tail !== null ? (a = l.tail, l.rendering = a, l.tail = a.sibling, l.renderingStartTime = Na(), a.sibling = null, t = ta.current, Y(ta, u ? t & 1 | 2 : t & 1), F && Ae(e, l.treeForkCount), a) : (Q(e), null);
      case 22:
      case 23:
        return Ha(e), Qf(), l = e.memoizedState !== null, a !== null ? a.memoizedState !== null !== l && (e.flags |= 8192) : l && (e.flags |= 8192), l ? (t & 536870912) !== 0 && (e.flags & 128) === 0 && (Q(e), e.subtreeFlags & 6 && (e.flags |= 8192)) : Q(e), t = e.updateQueue, t !== null && io(e, t.retryQueue), t = null, a !== null && a.memoizedState !== null && a.memoizedState.cachePool !== null && (t = a.memoizedState.cachePool.pool), l = null, e.memoizedState !== null && e.memoizedState.cachePool !== null && (l = e.memoizedState.cachePool.pool), l !== t && (e.flags |= 2048), a !== null && xa(kt), null;
      case 24:
        return t = null, a !== null && (t = a.memoizedState.cache), e.memoizedState.cache !== t && (e.flags |= 2048), Re(da), Q(e), null;
      case 25:
        return null;
      case 30:
        return null;
    }
    throw Error(L(156, e.tag));
  }
  function gx(a, e) {
    switch (Vf(e), e.tag) {
      case 1:
        return a = e.flags, a & 65536 ? (e.flags = a & -65537 | 128, e) : null;
      case 3:
        return Re(da), Ll(), a = e.flags, (a & 65536) !== 0 && (a & 128) === 0 ? (e.flags = a & -65537 | 128, e) : null;
      case 26:
      case 27:
      case 5:
        return zo(e), null;
      case 31:
        if (e.memoizedState !== null) {
          if (Ha(e), e.alternate === null) throw Error(L(340));
          Dt();
        }
        return a = e.flags, a & 65536 ? (e.flags = a & -65537 | 128, e) : null;
      case 13:
        if (Ha(e), a = e.memoizedState, a !== null && a.dehydrated !== null) {
          if (e.alternate === null) throw Error(L(340));
          Dt();
        }
        return a = e.flags, a & 65536 ? (e.flags = a & -65537 | 128, e) : null;
      case 19:
        return xa(ta), null;
      case 4:
        return Ll(), null;
      case 10:
        return Re(e.type), null;
      case 22:
      case 23:
        return Ha(e), Qf(), a !== null && xa(kt), a = e.flags, a & 65536 ? (e.flags = a & -65537 | 128, e) : null;
      case 24:
        return Re(da), null;
      case 25:
        return null;
      default:
        return null;
    }
  }
  function Cp(a, e) {
    switch (Vf(e), e.tag) {
      case 3:
        Re(da), Ll();
        break;
      case 26:
      case 27:
      case 5:
        zo(e);
        break;
      case 4:
        Ll();
        break;
      case 31:
        e.memoizedState !== null && Ha(e);
        break;
      case 13:
        Ha(e);
        break;
      case 19:
        xa(ta);
        break;
      case 10:
        Re(e.type);
        break;
      case 22:
      case 23:
        Ha(e), Qf(), a !== null && xa(kt);
        break;
      case 24:
        Re(da);
    }
  }
  function Uu(a, e) {
    try {
      var t = e.updateQueue,
        l = t !== null ? t.lastEffect : null;
      if (l !== null) {
        var u = l.next;
        t = u;
        do {
          if ((t.tag & a) === a) {
            l = void 0;
            var o = t.create,
              r = t.inst;
            l = o(), r.destroy = l;
          }
          t = t.next;
        } while (t !== u);
      }
    } catch (d) {
      P(e, e.return, d);
    }
  }
  function pt(a, e, t) {
    try {
      var l = e.updateQueue,
        u = l !== null ? l.lastEffect : null;
      if (u !== null) {
        var o = u.next;
        l = o;
        do {
          if ((l.tag & a) === a) {
            var r = l.inst,
              d = r.destroy;
            if (d !== void 0) {
              r.destroy = void 0, u = e;
              var f = t,
                s = d;
              try {
                s();
              } catch (g) {
                P(u, f, g);
              }
            }
          }
          l = l.next;
        } while (l !== o);
      }
    } catch (g) {
      P(e, e.return, g);
    }
  }
  function Ip(a) {
    var e = a.updateQueue;
    if (e !== null) {
      var t = a.stateNode;
      try {
        Oc(e, t);
      } catch (l) {
        P(a, a.return, l);
      }
    }
  }
  function wp(a, e, t) {
    t.props = zt(a.type, a.memoizedProps), t.state = a.memoizedState;
    try {
      t.componentWillUnmount();
    } catch (l) {
      P(a, e, l);
    }
  }
  function fu(a, e) {
    try {
      var t = a.ref;
      if (t !== null) {
        switch (a.tag) {
          case 26:
          case 27:
          case 5:
            var l = a.stateNode;
            break;
          case 30:
            l = a.stateNode;
            break;
          default:
            l = a.stateNode;
        }
        typeof t == "function" ? a.refCleanup = t(l) : t.current = l;
      }
    } catch (u) {
      P(a, e, u);
    }
  }
  function me(a, e) {
    var t = a.ref,
      l = a.refCleanup;
    if (t !== null) if (typeof l == "function") try {
      l();
    } catch (u) {
      P(a, e, u);
    } finally {
      a.refCleanup = null, a = a.alternate, a != null && (a.refCleanup = null);
    } else if (typeof t == "function") try {
      t(null);
    } catch (u) {
      P(a, e, u);
    } else t.current = null;
  }
  function Ap(a) {
    var e = a.type,
      t = a.memoizedProps,
      l = a.stateNode;
    try {
      a: switch (e) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          t.autoFocus && l.focus();
          break a;
        case "img":
          t.src ? l.src = t.src : t.srcSet && (l.srcset = t.srcSet);
      }
    } catch (u) {
      P(a, a.return, u);
    }
  }
  function yd(a, e, t) {
    try {
      var l = a.stateNode;
      Ux(l, a.type, t, e), l[Ua] = e;
    } catch (u) {
      P(a, a.return, u);
    }
  }
  function kp(a) {
    return a.tag === 5 || a.tag === 3 || a.tag === 26 || a.tag === 27 && ht(a.type) || a.tag === 4;
  }
  function Cd(a) {
    a: for (;;) {
      for (; a.sibling === null;) {
        if (a.return === null || kp(a.return)) return null;
        a = a.return;
      }
      for (a.sibling.return = a.return, a = a.sibling; a.tag !== 5 && a.tag !== 6 && a.tag !== 18;) {
        if (a.tag === 27 && ht(a.type) || a.flags & 2 || a.child === null || a.tag === 4) continue a;
        a.child.return = a, a = a.child;
      }
      if (!(a.flags & 2)) return a.stateNode;
    }
  }
  function cf(a, e, t) {
    var l = a.tag;
    if (l === 5 || l === 6) a = a.stateNode, e ? (t.nodeType === 9 ? t.body : t.nodeName === "HTML" ? t.ownerDocument.body : t).insertBefore(a, e) : (e = t.nodeType === 9 ? t.body : t.nodeName === "HTML" ? t.ownerDocument.body : t, e.appendChild(a), t = t._reactRootContainer, t != null || e.onclick !== null || (e.onclick = Te));else if (l !== 4 && (l === 27 && ht(a.type) && (t = a.stateNode, e = null), a = a.child, a !== null)) for (cf(a, e, t), a = a.sibling; a !== null;) cf(a, e, t), a = a.sibling;
  }
  function jo(a, e, t) {
    var l = a.tag;
    if (l === 5 || l === 6) a = a.stateNode, e ? t.insertBefore(a, e) : t.appendChild(a);else if (l !== 4 && (l === 27 && ht(a.type) && (t = a.stateNode), a = a.child, a !== null)) for (jo(a, e, t), a = a.sibling; a !== null;) jo(a, e, t), a = a.sibling;
  }
  function Mp(a) {
    var e = a.stateNode,
      t = a.memoizedProps;
    try {
      for (var l = a.type, u = e.attributes; u.length;) e.removeAttributeNode(u[0]);
      ya(e, l, t), e[va] = a, e[Ua] = t;
    } catch (o) {
      P(a, a.return, o);
    }
  }
  var ke = !1,
    ra = !1,
    Id = !1,
    rn = typeof WeakSet == "function" ? WeakSet : Set,
    ga = null;
  function hx(a, e) {
    if (a = a.containerInfo, vf = or, a = gc(a), Ff(a)) {
      if ("selectionStart" in a) var t = {
        start: a.selectionStart,
        end: a.selectionEnd
      };else a: {
        t = (t = a.ownerDocument) && t.defaultView || window;
        var l = t.getSelection && t.getSelection();
        if (l && l.rangeCount !== 0) {
          t = l.anchorNode;
          var u = l.anchorOffset,
            o = l.focusNode;
          l = l.focusOffset;
          try {
            t.nodeType, o.nodeType;
          } catch {
            t = null;
            break a;
          }
          var r = 0,
            d = -1,
            f = -1,
            s = 0,
            g = 0,
            h = a,
            c = null;
          e: for (;;) {
            for (var m; h !== t || u !== 0 && h.nodeType !== 3 || (d = r + u), h !== o || l !== 0 && h.nodeType !== 3 || (f = r + l), h.nodeType === 3 && (r += h.nodeValue.length), (m = h.firstChild) !== null;) c = h, h = m;
            for (;;) {
              if (h === a) break e;
              if (c === t && ++s === u && (d = r), c === o && ++g === l && (f = r), (m = h.nextSibling) !== null) break;
              h = c, c = h.parentNode;
            }
            h = m;
          }
          t = d === -1 || f === -1 ? null : {
            start: d,
            end: f
          };
        } else t = null;
      }
      t = t || {
        start: 0,
        end: 0
      };
    } else t = null;
    for (Sf = {
      focusedElem: a,
      selectionRange: t
    }, or = !1, ga = e; ga !== null;) if (e = ga, a = e.child, (e.subtreeFlags & 1028) !== 0 && a !== null) a.return = e, ga = a;else for (; ga !== null;) {
      switch (e = ga, o = e.alternate, a = e.flags, e.tag) {
        case 0:
          if ((a & 4) !== 0 && (a = e.updateQueue, a = a !== null ? a.events : null, a !== null)) for (t = 0; t < a.length; t++) u = a[t], u.ref.impl = u.nextImpl;
          break;
        case 11:
        case 15:
          break;
        case 1:
          if ((a & 1024) !== 0 && o !== null) {
            a = void 0, t = e, u = o.memoizedProps, o = o.memoizedState, l = t.stateNode;
            try {
              var b = zt(t.type, u);
              a = l.getSnapshotBeforeUpdate(b, o), l.__reactInternalSnapshotBeforeUpdate = a;
            } catch (y) {
              P(t, t.return, y);
            }
          }
          break;
        case 3:
          if ((a & 1024) !== 0) {
            if (a = e.stateNode.containerInfo, t = a.nodeType, t === 9) yf(a);else if (t === 1) switch (a.nodeName) {
              case "HEAD":
              case "HTML":
              case "BODY":
                yf(a);
                break;
              default:
                a.textContent = "";
            }
          }
          break;
        case 5:
        case 26:
        case 27:
        case 6:
        case 4:
        case 17:
          break;
        default:
          if ((a & 1024) !== 0) throw Error(L(163));
      }
      if (a = e.sibling, a !== null) {
        a.return = e.return, ga = a;
        break;
      }
      ga = e.return;
    }
  }
  function Tp(a, e, t) {
    var l = t.flags;
    switch (t.tag) {
      case 0:
      case 11:
      case 15:
        Ie(a, t), l & 4 && Uu(5, t);
        break;
      case 1:
        if (Ie(a, t), l & 4) if (a = t.stateNode, e === null) try {
          a.componentDidMount();
        } catch (r) {
          P(t, t.return, r);
        } else {
          var u = zt(t.type, e.memoizedProps);
          e = e.memoizedState;
          try {
            a.componentDidUpdate(u, e, a.__reactInternalSnapshotBeforeUpdate);
          } catch (r) {
            P(t, t.return, r);
          }
        }
        l & 64 && Ip(t), l & 512 && fu(t, t.return);
        break;
      case 3:
        if (Ie(a, t), l & 64 && (a = t.updateQueue, a !== null)) {
          if (e = null, t.child !== null) switch (t.child.tag) {
            case 27:
            case 5:
              e = t.child.stateNode;
              break;
            case 1:
              e = t.child.stateNode;
          }
          try {
            Oc(a, e);
          } catch (r) {
            P(t, t.return, r);
          }
        }
        break;
      case 27:
        e === null && l & 4 && Mp(t);
      case 26:
      case 5:
        Ie(a, t), e === null && l & 4 && Ap(t), l & 512 && fu(t, t.return);
        break;
      case 12:
        Ie(a, t);
        break;
      case 31:
        Ie(a, t), l & 4 && Rp(a, t);
        break;
      case 13:
        Ie(a, t), l & 4 && Op(a, t), l & 64 && (a = t.memoizedState, a !== null && (a = a.dehydrated, a !== null && (t = wx.bind(null, t), Px(a, t))));
        break;
      case 22:
        if (l = t.memoizedState !== null || ke, !l) {
          e = e !== null && e.memoizedState !== null || ra, u = ke;
          var o = ra;
          ke = l, (ra = e) && !o ? we(a, t, (t.subtreeFlags & 8772) !== 0) : Ie(a, t), ke = u, ra = o;
        }
        break;
      case 30:
        break;
      default:
        Ie(a, t);
    }
  }
  function Dp(a) {
    var e = a.alternate;
    e !== null && (a.alternate = null, Dp(e)), a.child = null, a.deletions = null, a.sibling = null, a.tag === 5 && (e = a.stateNode, e !== null && Of(e)), a.stateNode = null, a.return = null, a.dependencies = null, a.memoizedProps = null, a.memoizedState = null, a.pendingProps = null, a.stateNode = null, a.updateQueue = null;
  }
  var $ = null,
    Ra = !1;
  function Ce(a, e, t) {
    for (t = t.child; t !== null;) Bp(a, e, t), t = t.sibling;
  }
  function Bp(a, e, t) {
    if (_a && typeof _a.onCommitFiberUnmount == "function") try {
      _a.onCommitFiberUnmount(Mu, t);
    } catch {}
    switch (t.tag) {
      case 26:
        ra || me(t, e), Ce(a, e, t), t.memoizedState ? t.memoizedState.count-- : t.stateNode && (t = t.stateNode, t.parentNode.removeChild(t));
        break;
      case 27:
        ra || me(t, e);
        var l = $,
          u = Ra;
        ht(t.type) && ($ = t.stateNode, Ra = !1), Ce(a, e, t), cu(t.stateNode), $ = l, Ra = u;
        break;
      case 5:
        ra || me(t, e);
      case 6:
        if (l = $, u = Ra, $ = null, Ce(a, e, t), $ = l, Ra = u, $ !== null) if (Ra) try {
          ($.nodeType === 9 ? $.body : $.nodeName === "HTML" ? $.ownerDocument.body : $).removeChild(t.stateNode);
        } catch (o) {
          P(t, e, o);
        } else try {
          $.removeChild(t.stateNode);
        } catch (o) {
          P(t, e, o);
        }
        break;
      case 18:
        $ !== null && (Ra ? (a = $, yn(a.nodeType === 9 ? a.body : a.nodeName === "HTML" ? a.ownerDocument.body : a, t.stateNode), Ml(a)) : yn($, t.stateNode));
        break;
      case 4:
        l = $, u = Ra, $ = t.stateNode.containerInfo, Ra = !0, Ce(a, e, t), $ = l, Ra = u;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        pt(2, t, e), ra || pt(4, t, e), Ce(a, e, t);
        break;
      case 1:
        ra || (me(t, e), l = t.stateNode, typeof l.componentWillUnmount == "function" && wp(t, e, l)), Ce(a, e, t);
        break;
      case 21:
        Ce(a, e, t);
        break;
      case 22:
        ra = (l = ra) || t.memoizedState !== null, Ce(a, e, t), ra = l;
        break;
      default:
        Ce(a, e, t);
    }
  }
  function Rp(a, e) {
    if (e.memoizedState === null && (a = e.alternate, a !== null && (a = a.memoizedState, a !== null))) {
      a = a.dehydrated;
      try {
        Ml(a);
      } catch (t) {
        P(e, e.return, t);
      }
    }
  }
  function Op(a, e) {
    if (e.memoizedState === null && (a = e.alternate, a !== null && (a = a.memoizedState, a !== null && (a = a.dehydrated, a !== null)))) try {
      Ml(a);
    } catch (t) {
      P(e, e.return, t);
    }
  }
  function xx(a) {
    switch (a.tag) {
      case 31:
      case 13:
      case 19:
        var e = a.stateNode;
        return e === null && (e = a.stateNode = new rn()), e;
      case 22:
        return a = a.stateNode, e = a._retryCache, e === null && (e = a._retryCache = new rn()), e;
      default:
        throw Error(L(435, a.tag));
    }
  }
  function no(a, e) {
    var t = xx(a);
    e.forEach(function (l) {
      if (!t.has(l)) {
        t.add(l);
        var u = Ax.bind(null, a, l);
        l.then(u, u);
      }
    });
  }
  function Da(a, e) {
    var t = e.deletions;
    if (t !== null) for (var l = 0; l < t.length; l++) {
      var u = t[l],
        o = a,
        r = e,
        d = r;
      a: for (; d !== null;) {
        switch (d.tag) {
          case 27:
            if (ht(d.type)) {
              $ = d.stateNode, Ra = !1;
              break a;
            }
            break;
          case 5:
            $ = d.stateNode, Ra = !1;
            break a;
          case 3:
          case 4:
            $ = d.stateNode.containerInfo, Ra = !0;
            break a;
        }
        d = d.return;
      }
      if ($ === null) throw Error(L(160));
      Bp(o, r, u), $ = null, Ra = !1, o = u.alternate, o !== null && (o.return = null), u.return = null;
    }
    if (e.subtreeFlags & 13886) for (e = e.child; e !== null;) zp(e, a), e = e.sibling;
  }
  var de = null;
  function zp(a, e) {
    var t = a.alternate,
      l = a.flags;
    switch (a.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        Da(e, a), Ba(a), l & 4 && (pt(3, a, a.return), Uu(3, a), pt(5, a, a.return));
        break;
      case 1:
        Da(e, a), Ba(a), l & 512 && (ra || t === null || me(t, t.return)), l & 64 && ke && (a = a.updateQueue, a !== null && (l = a.callbacks, l !== null && (t = a.shared.hiddenCallbacks, a.shared.hiddenCallbacks = t === null ? l : t.concat(l))));
        break;
      case 26:
        var u = de;
        if (Da(e, a), Ba(a), l & 512 && (ra || t === null || me(t, t.return)), l & 4) {
          var o = t !== null ? t.memoizedState : null;
          if (l = a.memoizedState, t === null) {
            if (l === null) {
              if (a.stateNode === null) {
                a: {
                  l = a.type, t = a.memoizedProps, u = u.ownerDocument || u;
                  e: switch (l) {
                    case "title":
                      o = u.getElementsByTagName("title")[0], (!o || o[Bu] || o[va] || o.namespaceURI === "http://www.w3.org/2000/svg" || o.hasAttribute("itemprop")) && (o = u.createElement(l), u.head.insertBefore(o, u.querySelector("head > title"))), ya(o, l, t), o[va] = a, ha(o), l = o;
                      break a;
                    case "link":
                      var r = Tn("link", "href", u).get(l + (t.href || ""));
                      if (r) {
                        for (var d = 0; d < r.length; d++) if (o = r[d], o.getAttribute("href") === (t.href == null || t.href === "" ? null : t.href) && o.getAttribute("rel") === (t.rel == null ? null : t.rel) && o.getAttribute("title") === (t.title == null ? null : t.title) && o.getAttribute("crossorigin") === (t.crossOrigin == null ? null : t.crossOrigin)) {
                          r.splice(d, 1);
                          break e;
                        }
                      }
                      o = u.createElement(l), ya(o, l, t), u.head.appendChild(o);
                      break;
                    case "meta":
                      if (r = Tn("meta", "content", u).get(l + (t.content || ""))) {
                        for (d = 0; d < r.length; d++) if (o = r[d], o.getAttribute("content") === (t.content == null ? null : "" + t.content) && o.getAttribute("name") === (t.name == null ? null : t.name) && o.getAttribute("property") === (t.property == null ? null : t.property) && o.getAttribute("http-equiv") === (t.httpEquiv == null ? null : t.httpEquiv) && o.getAttribute("charset") === (t.charSet == null ? null : t.charSet)) {
                          r.splice(d, 1);
                          break e;
                        }
                      }
                      o = u.createElement(l), ya(o, l, t), u.head.appendChild(o);
                      break;
                    default:
                      throw Error(L(468, l));
                  }
                  o[va] = a, ha(o), l = o;
                }
                a.stateNode = l;
              } else Dn(u, a.type, a.stateNode);
            } else a.stateNode = Mn(u, l, a.memoizedProps);
          } else o !== l ? (o === null ? t.stateNode !== null && (t = t.stateNode, t.parentNode.removeChild(t)) : o.count--, l === null ? Dn(u, a.type, a.stateNode) : Mn(u, l, a.memoizedProps)) : l === null && a.stateNode !== null && yd(a, a.memoizedProps, t.memoizedProps);
        }
        break;
      case 27:
        Da(e, a), Ba(a), l & 512 && (ra || t === null || me(t, t.return)), t !== null && l & 4 && yd(a, a.memoizedProps, t.memoizedProps);
        break;
      case 5:
        if (Da(e, a), Ba(a), l & 512 && (ra || t === null || me(t, t.return)), a.flags & 32) {
          u = a.stateNode;
          try {
            Sl(u, "");
          } catch (b) {
            P(a, a.return, b);
          }
        }
        l & 4 && a.stateNode != null && (u = a.memoizedProps, yd(a, u, t !== null ? t.memoizedProps : u)), l & 1024 && (Id = !0);
        break;
      case 6:
        if (Da(e, a), Ba(a), l & 4) {
          if (a.stateNode === null) throw Error(L(162));
          l = a.memoizedProps, t = a.stateNode;
          try {
            t.nodeValue = l;
          } catch (b) {
            P(a, a.return, b);
          }
        }
        break;
      case 3:
        if (To = null, u = de, de = tr(e.containerInfo), Da(e, a), de = u, Ba(a), l & 4 && t !== null && t.memoizedState.isDehydrated) try {
          Ml(e.containerInfo);
        } catch (b) {
          P(a, a.return, b);
        }
        Id && (Id = !1, Up(a));
        break;
      case 4:
        l = de, de = tr(a.stateNode.containerInfo), Da(e, a), Ba(a), de = l;
        break;
      case 12:
        Da(e, a), Ba(a);
        break;
      case 31:
        Da(e, a), Ba(a), l & 4 && (l = a.updateQueue, l !== null && (a.updateQueue = null, no(a, l)));
        break;
      case 13:
        Da(e, a), Ba(a), a.child.flags & 8192 && a.memoizedState !== null != (t !== null && t.memoizedState !== null) && (Lr = Na()), l & 4 && (l = a.updateQueue, l !== null && (a.updateQueue = null, no(a, l)));
        break;
      case 22:
        u = a.memoizedState !== null;
        var f = t !== null && t.memoizedState !== null,
          s = ke,
          g = ra;
        if (ke = s || u, ra = g || f, Da(e, a), ra = g, ke = s, Ba(a), l & 8192) a: for (e = a.stateNode, e._visibility = u ? e._visibility & -2 : e._visibility | 1, u && (t === null || f || ke || ra || It(a)), t = null, e = a;;) {
          if (e.tag === 5 || e.tag === 26) {
            if (t === null) {
              f = t = e;
              try {
                if (o = f.stateNode, u) r = o.style, typeof r.setProperty == "function" ? r.setProperty("display", "none", "important") : r.display = "none";else {
                  d = f.stateNode;
                  var h = f.memoizedProps.style,
                    c = h != null && h.hasOwnProperty("display") ? h.display : null;
                  d.style.display = c == null || typeof c == "boolean" ? "" : ("" + c).trim();
                }
              } catch (b) {
                P(f, f.return, b);
              }
            }
          } else if (e.tag === 6) {
            if (t === null) {
              f = e;
              try {
                f.stateNode.nodeValue = u ? "" : f.memoizedProps;
              } catch (b) {
                P(f, f.return, b);
              }
            }
          } else if (e.tag === 18) {
            if (t === null) {
              f = e;
              try {
                var m = f.stateNode;
                u ? Cn(m, !0) : Cn(f.stateNode, !1);
              } catch (b) {
                P(f, f.return, b);
              }
            }
          } else if ((e.tag !== 22 && e.tag !== 23 || e.memoizedState === null || e === a) && e.child !== null) {
            e.child.return = e, e = e.child;
            continue;
          }
          if (e === a) break a;
          for (; e.sibling === null;) {
            if (e.return === null || e.return === a) break a;
            t === e && (t = null), e = e.return;
          }
          t === e && (t = null), e.sibling.return = e.return, e = e.sibling;
        }
        l & 4 && (l = a.updateQueue, l !== null && (t = l.retryQueue, t !== null && (l.retryQueue = null, no(a, t))));
        break;
      case 19:
        Da(e, a), Ba(a), l & 4 && (l = a.updateQueue, l !== null && (a.updateQueue = null, no(a, l)));
        break;
      case 30:
        break;
      case 21:
        break;
      default:
        Da(e, a), Ba(a);
    }
  }
  function Ba(a) {
    var e = a.flags;
    if (e & 2) {
      try {
        for (var t, l = a.return; l !== null;) {
          if (kp(l)) {
            t = l;
            break;
          }
          l = l.return;
        }
        if (t == null) throw Error(L(160));
        switch (t.tag) {
          case 27:
            var u = t.stateNode,
              o = Cd(a);
            jo(a, o, u);
            break;
          case 5:
            var r = t.stateNode;
            t.flags & 32 && (Sl(r, ""), t.flags &= -33);
            var d = Cd(a);
            jo(a, d, r);
            break;
          case 3:
          case 4:
            var f = t.stateNode.containerInfo,
              s = Cd(a);
            cf(a, s, f);
            break;
          default:
            throw Error(L(161));
        }
      } catch (g) {
        P(a, a.return, g);
      }
      a.flags &= -3;
    }
    e & 4096 && (a.flags &= -4097);
  }
  function Up(a) {
    if (a.subtreeFlags & 1024) for (a = a.child; a !== null;) {
      var e = a;
      Up(e), e.tag === 5 && e.flags & 1024 && e.stateNode.reset(), a = a.sibling;
    }
  }
  function Ie(a, e) {
    if (e.subtreeFlags & 8772) for (e = e.child; e !== null;) Tp(a, e.alternate, e), e = e.sibling;
  }
  function It(a) {
    for (a = a.child; a !== null;) {
      var e = a;
      switch (e.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          pt(4, e, e.return), It(e);
          break;
        case 1:
          me(e, e.return);
          var t = e.stateNode;
          typeof t.componentWillUnmount == "function" && wp(e, e.return, t), It(e);
          break;
        case 27:
          cu(e.stateNode);
        case 26:
        case 5:
          me(e, e.return), It(e);
          break;
        case 22:
          e.memoizedState === null && It(e);
          break;
        case 30:
          It(e);
          break;
        default:
          It(e);
      }
      a = a.sibling;
    }
  }
  function we(a, e, t) {
    for (t = t && (e.subtreeFlags & 8772) !== 0, e = e.child; e !== null;) {
      var l = e.alternate,
        u = a,
        o = e,
        r = o.flags;
      switch (o.tag) {
        case 0:
        case 11:
        case 15:
          we(u, o, t), Uu(4, o);
          break;
        case 1:
          if (we(u, o, t), l = o, u = l.stateNode, typeof u.componentDidMount == "function") try {
            u.componentDidMount();
          } catch (s) {
            P(l, l.return, s);
          }
          if (l = o, u = l.updateQueue, u !== null) {
            var d = l.stateNode;
            try {
              var f = u.shared.hiddenCallbacks;
              if (f !== null) for (u.shared.hiddenCallbacks = null, u = 0; u < f.length; u++) Rc(f[u], d);
            } catch (s) {
              P(l, l.return, s);
            }
          }
          t && r & 64 && Ip(o), fu(o, o.return);
          break;
        case 27:
          Mp(o);
        case 26:
        case 5:
          we(u, o, t), t && l === null && r & 4 && Ap(o), fu(o, o.return);
          break;
        case 12:
          we(u, o, t);
          break;
        case 31:
          we(u, o, t), t && r & 4 && Rp(u, o);
          break;
        case 13:
          we(u, o, t), t && r & 4 && Op(u, o);
          break;
        case 22:
          o.memoizedState === null && we(u, o, t), fu(o, o.return);
          break;
        case 30:
          break;
        default:
          we(u, o, t);
      }
      e = e.sibling;
    }
  }
  function ns(a, e) {
    var t = null;
    a !== null && a.memoizedState !== null && a.memoizedState.cachePool !== null && (t = a.memoizedState.cachePool.pool), a = null, e.memoizedState !== null && e.memoizedState.cachePool !== null && (a = e.memoizedState.cachePool.pool), a !== t && (a != null && a.refCount++, t != null && Ou(t));
  }
  function cs(a, e) {
    a = null, e.alternate !== null && (a = e.alternate.memoizedState.cache), e = e.memoizedState.cache, e !== a && (e.refCount++, a != null && Ou(a));
  }
  function re(a, e, t, l) {
    if (e.subtreeFlags & 10256) for (e = e.child; e !== null;) qp(a, e, t, l), e = e.sibling;
  }
  function qp(a, e, t, l) {
    var u = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 15:
        re(a, e, t, l), u & 2048 && Uu(9, e);
        break;
      case 1:
        re(a, e, t, l);
        break;
      case 3:
        re(a, e, t, l), u & 2048 && (a = null, e.alternate !== null && (a = e.alternate.memoizedState.cache), e = e.memoizedState.cache, e !== a && (e.refCount++, a != null && Ou(a)));
        break;
      case 12:
        if (u & 2048) {
          re(a, e, t, l), a = e.stateNode;
          try {
            var o = e.memoizedProps,
              r = o.id,
              d = o.onPostCommit;
            typeof d == "function" && d(r, e.alternate === null ? "mount" : "update", a.passiveEffectDuration, -0);
          } catch (f) {
            P(e, e.return, f);
          }
        } else re(a, e, t, l);
        break;
      case 31:
        re(a, e, t, l);
        break;
      case 13:
        re(a, e, t, l);
        break;
      case 23:
        break;
      case 22:
        o = e.stateNode, r = e.alternate, e.memoizedState !== null ? o._visibility & 2 ? re(a, e, t, l) : su(a, e) : o._visibility & 2 ? re(a, e, t, l) : (o._visibility |= 2, Wt(a, e, t, l, (e.subtreeFlags & 10256) !== 0 || !1)), u & 2048 && ns(r, e);
        break;
      case 24:
        re(a, e, t, l), u & 2048 && cs(e.alternate, e);
        break;
      default:
        re(a, e, t, l);
    }
  }
  function Wt(a, e, t, l, u) {
    for (u = u && ((e.subtreeFlags & 10256) !== 0 || !1), e = e.child; e !== null;) {
      var o = a,
        r = e,
        d = t,
        f = l,
        s = r.flags;
      switch (r.tag) {
        case 0:
        case 11:
        case 15:
          Wt(o, r, d, f, u), Uu(8, r);
          break;
        case 23:
          break;
        case 22:
          var g = r.stateNode;
          r.memoizedState !== null ? g._visibility & 2 ? Wt(o, r, d, f, u) : su(o, r) : (g._visibility |= 2, Wt(o, r, d, f, u)), u && s & 2048 && ns(r.alternate, r);
          break;
        case 24:
          Wt(o, r, d, f, u), u && s & 2048 && cs(r.alternate, r);
          break;
        default:
          Wt(o, r, d, f, u);
      }
      e = e.sibling;
    }
  }
  function su(a, e) {
    if (e.subtreeFlags & 10256) for (e = e.child; e !== null;) {
      var t = a,
        l = e,
        u = l.flags;
      switch (l.tag) {
        case 22:
          su(t, l), u & 2048 && ns(l.alternate, l);
          break;
        case 24:
          su(t, l), u & 2048 && cs(l.alternate, l);
          break;
        default:
          su(t, l);
      }
      e = e.sibling;
    }
  }
  var $l = 8192;
  function Kt(a, e, t) {
    if (a.subtreeFlags & $l) for (a = a.child; a !== null;) Ep(a, e, t), a = a.sibling;
  }
  function Ep(a, e, t) {
    switch (a.tag) {
      case 26:
        Kt(a, e, t), a.flags & $l && a.memoizedState !== null && eL(t, de, a.memoizedState, a.memoizedProps);
        break;
      case 5:
        Kt(a, e, t);
        break;
      case 3:
      case 4:
        var l = de;
        de = tr(a.stateNode.containerInfo), Kt(a, e, t), de = l;
        break;
      case 22:
        a.memoizedState === null && (l = a.alternate, l !== null && l.memoizedState !== null ? (l = $l, $l = 16777216, Kt(a, e, t), $l = l) : Kt(a, e, t));
        break;
      default:
        Kt(a, e, t);
    }
  }
  function Hp(a) {
    var e = a.alternate;
    if (e !== null && (a = e.child, a !== null)) {
      e.child = null;
      do e = a.sibling, a.sibling = null, a = e; while (a !== null);
    }
  }
  function Zl(a) {
    var e = a.deletions;
    if ((a.flags & 16) !== 0) {
      if (e !== null) for (var t = 0; t < e.length; t++) {
        var l = e[t];
        ga = l, Gp(l, a);
      }
      Hp(a);
    }
    if (a.subtreeFlags & 10256) for (a = a.child; a !== null;) Fp(a), a = a.sibling;
  }
  function Fp(a) {
    switch (a.tag) {
      case 0:
      case 11:
      case 15:
        Zl(a), a.flags & 2048 && pt(9, a, a.return);
        break;
      case 3:
        Zl(a);
        break;
      case 12:
        Zl(a);
        break;
      case 22:
        var e = a.stateNode;
        a.memoizedState !== null && e._visibility & 2 && (a.return === null || a.return.tag !== 13) ? (e._visibility &= -3, ko(a)) : Zl(a);
        break;
      default:
        Zl(a);
    }
  }
  function ko(a) {
    var e = a.deletions;
    if ((a.flags & 16) !== 0) {
      if (e !== null) for (var t = 0; t < e.length; t++) {
        var l = e[t];
        ga = l, Gp(l, a);
      }
      Hp(a);
    }
    for (a = a.child; a !== null;) {
      switch (e = a, e.tag) {
        case 0:
        case 11:
        case 15:
          pt(8, e, e.return), ko(e);
          break;
        case 22:
          t = e.stateNode, t._visibility & 2 && (t._visibility &= -3, ko(e));
          break;
        default:
          ko(e);
      }
      a = a.sibling;
    }
  }
  function Gp(a, e) {
    for (; ga !== null;) {
      var t = ga;
      switch (t.tag) {
        case 0:
        case 11:
        case 15:
          pt(8, t, e);
          break;
        case 23:
        case 22:
          if (t.memoizedState !== null && t.memoizedState.cachePool !== null) {
            var l = t.memoizedState.cachePool.pool;
            l != null && l.refCount++;
          }
          break;
        case 24:
          Ou(t.memoizedState.cache);
      }
      if (l = t.child, l !== null) l.return = t, ga = l;else a: for (t = a; ga !== null;) {
        l = ga;
        var u = l.sibling,
          o = l.return;
        if (Dp(l), l === t) {
          ga = null;
          break a;
        }
        if (u !== null) {
          u.return = o, ga = u;
          break a;
        }
        ga = o;
      }
    }
  }
  var Lx = {
      getCacheForType: function (a) {
        var e = ba(da),
          t = e.data.get(a);
        return t === void 0 && (t = a(), e.data.set(a, t)), t;
      },
      cacheSignal: function () {
        return ba(da).controller.signal;
      }
    },
    vx = typeof WeakMap == "function" ? WeakMap : Map,
    G = 0,
    Z = null,
    E = null,
    H = 0,
    _ = 0,
    Ea = null,
    $e = !1,
    Ol = !1,
    ps = !1,
    He = 0,
    ea = 0,
    mt = 0,
    Tt = 0,
    ms = 0,
    Ga = 0,
    Il = 0,
    iu = null,
    Oa = null,
    pf = !1,
    Lr = 0,
    Np = 0,
    Qo = 1 / 0,
    Ko = null,
    rt = null,
    ia = 0,
    dt = null,
    wl = null,
    Oe = 0,
    mf = 0,
    gf = null,
    _p = null,
    nu = 0,
    hf = null;
  function Va() {
    return (G & 2) !== 0 && H !== 0 ? H & -H : D.T !== null ? hs() : Wn();
  }
  function Pp() {
    if (Ga === 0) if ((H & 536870912) === 0 || F) {
      var a = ao;
      ao <<= 1, (ao & 3932160) === 0 && (ao = 262144), Ga = a;
    } else Ga = 536870912;
    return a = Za.current, a !== null && (a.flags |= 32), Ga;
  }
  function za(a, e, t) {
    (a === Z && (_ === 2 || _ === 9) || a.cancelPendingCommit !== null) && (Al(a, 0), at(a, H, Ga, !1)), Du(a, t), ((G & 2) === 0 || a !== Z) && (a === Z && ((G & 2) === 0 && (Tt |= t), ea === 4 && at(a, H, Ga, !1)), xe(a));
  }
  function Vp(a, e, t) {
    if ((G & 6) !== 0) throw Error(L(327));
    var l = !t && (e & 127) === 0 && (e & a.expiredLanes) === 0 || Tu(a, e),
      u = l ? yx(a, e) : wd(a, e, !0),
      o = l;
    do {
      if (u === 0) {
        Ol && !l && at(a, e, 0, !1);
        break;
      } else {
        if (t = a.current.alternate, o && !Sx(t)) {
          u = wd(a, e, !1), o = !1;
          continue;
        }
        if (u === 2) {
          if (o = e, a.errorRecoveryDisabledLanes & o) var r = 0;else r = a.pendingLanes & -536870913, r = r !== 0 ? r : r & 536870912 ? 536870912 : 0;
          if (r !== 0) {
            e = r;
            a: {
              var d = a;
              u = iu;
              var f = d.current.memoizedState.isDehydrated;
              if (f && (Al(d, r).flags |= 256), r = wd(d, r, !1), r !== 2) {
                if (ps && !f) {
                  d.errorRecoveryDisabledLanes |= o, Tt |= o, u = 4;
                  break a;
                }
                o = Oa, Oa = u, o !== null && (Oa === null ? Oa = o : Oa.push.apply(Oa, o));
              }
              u = r;
            }
            if (o = !1, u !== 2) continue;
          }
        }
        if (u === 1) {
          Al(a, 0), at(a, e, 0, !0);
          break;
        }
        a: {
          switch (l = a, o = u, o) {
            case 0:
            case 1:
              throw Error(L(345));
            case 4:
              if ((e & 4194048) !== e) break;
            case 6:
              at(l, e, Ga, !$e);
              break a;
            case 2:
              Oa = null;
              break;
            case 3:
            case 5:
              break;
            default:
              throw Error(L(329));
          }
          if ((e & 62914560) === e && (u = Lr + 300 - Na(), 10 < u)) {
            if (at(l, e, Ga, !$e), dr(l, 0, !0) !== 0) break a;
            Oe = e, l.timeoutHandle = im(dn.bind(null, l, t, Oa, Ko, pf, e, Ga, Tt, Il, $e, o, "Throttled", -0, 0), u);
            break a;
          }
          dn(l, t, Oa, Ko, pf, e, Ga, Tt, Il, $e, o, null, -0, 0);
        }
      }
      break;
    } while (!0);
    xe(a);
  }
  function dn(a, e, t, l, u, o, r, d, f, s, g, h, c, m) {
    if (a.timeoutHandle = -1, h = e.subtreeFlags, h & 8192 || (h & 16785408) === 16785408) {
      h = {
        stylesheets: null,
        count: 0,
        imgCount: 0,
        imgBytes: 0,
        suspenseyImages: [],
        waitingForImages: !0,
        waitingForViewTransition: !1,
        unsuspend: Te
      }, Ep(e, o, h);
      var b = (o & 62914560) === o ? Lr - Na() : (o & 4194048) === o ? Np - Na() : 0;
      if (b = tL(h, b), b !== null) {
        Oe = o, a.cancelPendingCommit = b(sn.bind(null, a, e, o, t, l, u, r, d, f, g, h, null, c, m)), at(a, o, r, !s);
        return;
      }
    }
    sn(a, e, o, t, l, u, r, d, f);
  }
  function Sx(a) {
    for (var e = a;;) {
      var t = e.tag;
      if ((t === 0 || t === 11 || t === 15) && e.flags & 16384 && (t = e.updateQueue, t !== null && (t = t.stores, t !== null))) for (var l = 0; l < t.length; l++) {
        var u = t[l],
          o = u.getSnapshot;
        u = u.value;
        try {
          if (!Xa(o(), u)) return !1;
        } catch {
          return !1;
        }
      }
      if (t = e.child, e.subtreeFlags & 16384 && t !== null) t.return = e, e = t;else {
        if (e === a) break;
        for (; e.sibling === null;) {
          if (e.return === null || e.return === a) return !0;
          e = e.return;
        }
        e.sibling.return = e.return, e = e.sibling;
      }
    }
    return !0;
  }
  function at(a, e, t, l) {
    e &= ~ms, e &= ~Tt, a.suspendedLanes |= e, a.pingedLanes &= ~e, l && (a.warmLanes |= e), l = a.expirationTimes;
    for (var u = e; 0 < u;) {
      var o = 31 - Pa(u),
        r = 1 << o;
      l[o] = -1, u &= ~r;
    }
    t !== 0 && jn(a, t, e);
  }
  function vr() {
    return (G & 6) === 0 ? (qu(0, !1), !1) : !0;
  }
  function gs() {
    if (E !== null) {
      if (_ === 0) var a = E.return;else a = E, De = Ft = null, as(a), gl = null, vu = 0, a = E;
      for (; a !== null;) Cp(a.alternate, a), a = a.return;
      E = null;
    }
  }
  function Al(a, e) {
    var t = a.timeoutHandle;
    t !== -1 && (a.timeoutHandle = -1, Hx(t)), t = a.cancelPendingCommit, t !== null && (a.cancelPendingCommit = null, t()), Oe = 0, gs(), Z = a, E = t = Be(a.current, null), H = e, _ = 0, Ea = null, $e = !1, Ol = Tu(a, e), ps = !1, Il = Ga = ms = Tt = mt = ea = 0, Oa = iu = null, pf = !1, (e & 8) !== 0 && (e |= e & 32);
    var l = a.entangledLanes;
    if (l !== 0) for (a = a.entanglements, l &= e; 0 < l;) {
      var u = 31 - Pa(l),
        o = 1 << u;
      e |= a[u], l &= ~o;
    }
    return He = e, nr(), t;
  }
  function Xp(a, e) {
    O = null, D.H = bu, e === Rl || e === pr ? (e = Fi(), _ = 3) : e === Yf ? (e = Fi(), _ = 4) : _ = e === ss ? 8 : e !== null && typeof e == "object" && typeof e.then == "function" ? 6 : 1, Ea = e, E === null && (ea = 1, Zo(a, ae(e, a.current)));
  }
  function Zp() {
    var a = Za.current;
    return a === null ? !0 : (H & 4194048) === H ? te === null : (H & 62914560) === H || (H & 536870912) !== 0 ? a === te : !1;
  }
  function Yp() {
    var a = D.H;
    return D.H = bu, a === null ? bu : a;
  }
  function jp() {
    var a = D.A;
    return D.A = Lx, a;
  }
  function Wo() {
    ea = 4, $e || (H & 4194048) !== H && Za.current !== null || (Ol = !0), (mt & 134217727) === 0 && (Tt & 134217727) === 0 || Z === null || at(Z, H, Ga, !1);
  }
  function wd(a, e, t) {
    var l = G;
    G |= 2;
    var u = Yp(),
      o = jp();
    (Z !== a || H !== e) && (Ko = null, Al(a, e)), e = !1;
    var r = ea;
    a: do try {
      if (_ !== 0 && E !== null) {
        var d = E,
          f = Ea;
        switch (_) {
          case 8:
            gs(), r = 6;
            break a;
          case 3:
          case 2:
          case 9:
          case 6:
            Za.current === null && (e = !0);
            var s = _;
            if (_ = 0, Ea = null, il(a, d, f, s), t && Ol) {
              r = 0;
              break a;
            }
            break;
          default:
            s = _, _ = 0, Ea = null, il(a, d, f, s);
        }
      }
      bx(), r = ea;
      break;
    } catch (g) {
      Xp(a, g);
    } while (!0);
    return e && a.shellSuspendCounter++, De = Ft = null, G = l, D.H = u, D.A = o, E === null && (Z = null, H = 0, nr()), r;
  }
  function bx() {
    for (; E !== null;) Qp(E);
  }
  function yx(a, e) {
    var t = G;
    G |= 2;
    var l = Yp(),
      u = jp();
    Z !== a || H !== e ? (Ko = null, Qo = Na() + 500, Al(a, e)) : Ol = Tu(a, e);
    a: do try {
      if (_ !== 0 && E !== null) {
        e = E;
        var o = Ea;
        e: switch (_) {
          case 1:
            _ = 0, Ea = null, il(a, e, o, 1);
            break;
          case 2:
          case 9:
            if (Hi(o)) {
              _ = 0, Ea = null, fn(e);
              break;
            }
            e = function () {
              _ !== 2 && _ !== 9 || Z !== a || (_ = 7), xe(a);
            }, o.then(e, e);
            break a;
          case 3:
            _ = 7;
            break a;
          case 4:
            _ = 5;
            break a;
          case 7:
            Hi(o) ? (_ = 0, Ea = null, fn(e)) : (_ = 0, Ea = null, il(a, e, o, 7));
            break;
          case 5:
            var r = null;
            switch (E.tag) {
              case 26:
                r = E.memoizedState;
              case 5:
              case 27:
                var d = E;
                if (r ? gm(r) : d.stateNode.complete) {
                  _ = 0, Ea = null;
                  var f = d.sibling;
                  if (f !== null) E = f;else {
                    var s = d.return;
                    s !== null ? (E = s, Sr(s)) : E = null;
                  }
                  break e;
                }
            }
            _ = 0, Ea = null, il(a, e, o, 5);
            break;
          case 6:
            _ = 0, Ea = null, il(a, e, o, 6);
            break;
          case 8:
            gs(), ea = 6;
            break a;
          default:
            throw Error(L(462));
        }
      }
      Cx();
      break;
    } catch (g) {
      Xp(a, g);
    } while (!0);
    return De = Ft = null, D.H = l, D.A = u, G = t, E !== null ? 0 : (Z = null, H = 0, nr(), ea);
  }
  function Cx() {
    for (; E !== null && !Zg();) Qp(E);
  }
  function Qp(a) {
    var e = yp(a.alternate, a, He);
    a.memoizedProps = a.pendingProps, e === null ? Sr(a) : E = e;
  }
  function fn(a) {
    var e = a,
      t = e.alternate;
    switch (e.tag) {
      case 15:
      case 0:
        e = en(t, e, e.pendingProps, e.type, void 0, H);
        break;
      case 11:
        e = en(t, e, e.pendingProps, e.type.render, e.ref, H);
        break;
      case 5:
        as(e);
      default:
        Cp(t, e), e = E = Cc(e, He), e = yp(t, e, He);
    }
    a.memoizedProps = a.pendingProps, e === null ? Sr(a) : E = e;
  }
  function il(a, e, t, l) {
    De = Ft = null, as(e), gl = null, vu = 0;
    var u = e.return;
    try {
      if (nx(a, u, e, t, H)) {
        ea = 1, Zo(a, ae(t, a.current)), E = null;
        return;
      }
    } catch (o) {
      if (u !== null) throw E = u, o;
      ea = 1, Zo(a, ae(t, a.current)), E = null;
      return;
    }
    e.flags & 32768 ? (F || l === 1 ? a = !0 : Ol || (H & 536870912) !== 0 ? a = !1 : ($e = a = !0, (l === 2 || l === 9 || l === 3 || l === 6) && (l = Za.current, l !== null && l.tag === 13 && (l.flags |= 16384))), Kp(e, a)) : Sr(e);
  }
  function Sr(a) {
    var e = a;
    do {
      if ((e.flags & 32768) !== 0) {
        Kp(e, $e);
        return;
      }
      a = e.return;
      var t = mx(e.alternate, e, He);
      if (t !== null) {
        E = t;
        return;
      }
      if (e = e.sibling, e !== null) {
        E = e;
        return;
      }
      E = e = a;
    } while (e !== null);
    ea === 0 && (ea = 5);
  }
  function Kp(a, e) {
    do {
      var t = gx(a.alternate, a);
      if (t !== null) {
        t.flags &= 32767, E = t;
        return;
      }
      if (t = a.return, t !== null && (t.flags |= 32768, t.subtreeFlags = 0, t.deletions = null), !e && (a = a.sibling, a !== null)) {
        E = a;
        return;
      }
      E = a = t;
    } while (a !== null);
    ea = 6, E = null;
  }
  function sn(a, e, t, l, u, o, r, d, f) {
    a.cancelPendingCommit = null;
    do br(); while (ia !== 0);
    if ((G & 6) !== 0) throw Error(L(327));
    if (e !== null) {
      if (e === a.current) throw Error(L(177));
      if (o = e.lanes | e.childLanes, o |= Gf, th(a, t, o, r, d, f), a === Z && (E = Z = null, H = 0), wl = e, dt = a, Oe = t, mf = o, gf = u, _p = l, (e.subtreeFlags & 10256) !== 0 || (e.flags & 10256) !== 0 ? (a.callbackNode = null, a.callbackPriority = 0, kx(Uo, function () {
        return em(), null;
      })) : (a.callbackNode = null, a.callbackPriority = 0), l = (e.flags & 13878) !== 0, (e.subtreeFlags & 13878) !== 0 || l) {
        l = D.T, D.T = null, u = N.p, N.p = 2, r = G, G |= 4;
        try {
          hx(a, e, t);
        } finally {
          G = r, N.p = u, D.T = l;
        }
      }
      ia = 1, Wp(), Jp(), $p();
    }
  }
  function Wp() {
    if (ia === 1) {
      ia = 0;
      var a = dt,
        e = wl,
        t = (e.flags & 13878) !== 0;
      if ((e.subtreeFlags & 13878) !== 0 || t) {
        t = D.T, D.T = null;
        var l = N.p;
        N.p = 2;
        var u = G;
        G |= 4;
        try {
          zp(e, a);
          var o = Sf,
            r = gc(a.containerInfo),
            d = o.focusedElem,
            f = o.selectionRange;
          if (r !== d && d && d.ownerDocument && mc(d.ownerDocument.documentElement, d)) {
            if (f !== null && Ff(d)) {
              var s = f.start,
                g = f.end;
              if (g === void 0 && (g = s), "selectionStart" in d) d.selectionStart = s, d.selectionEnd = Math.min(g, d.value.length);else {
                var h = d.ownerDocument || document,
                  c = h && h.defaultView || window;
                if (c.getSelection) {
                  var m = c.getSelection(),
                    b = d.textContent.length,
                    y = Math.min(f.start, b),
                    T = f.end === void 0 ? y : Math.min(f.end, b);
                  !m.extend && y > T && (r = T, T = y, y = r);
                  var n = Bi(d, y),
                    i = Bi(d, T);
                  if (n && i && (m.rangeCount !== 1 || m.anchorNode !== n.node || m.anchorOffset !== n.offset || m.focusNode !== i.node || m.focusOffset !== i.offset)) {
                    var p = h.createRange();
                    p.setStart(n.node, n.offset), m.removeAllRanges(), y > T ? (m.addRange(p), m.extend(i.node, i.offset)) : (p.setEnd(i.node, i.offset), m.addRange(p));
                  }
                }
              }
            }
            for (h = [], m = d; m = m.parentNode;) m.nodeType === 1 && h.push({
              element: m,
              left: m.scrollLeft,
              top: m.scrollTop
            });
            for (typeof d.focus == "function" && d.focus(), d = 0; d < h.length; d++) {
              var x = h[d];
              x.element.scrollLeft = x.left, x.element.scrollTop = x.top;
            }
          }
          or = !!vf, Sf = vf = null;
        } finally {
          G = u, N.p = l, D.T = t;
        }
      }
      a.current = e, ia = 2;
    }
  }
  function Jp() {
    if (ia === 2) {
      ia = 0;
      var a = dt,
        e = wl,
        t = (e.flags & 8772) !== 0;
      if ((e.subtreeFlags & 8772) !== 0 || t) {
        t = D.T, D.T = null;
        var l = N.p;
        N.p = 2;
        var u = G;
        G |= 4;
        try {
          Tp(a, e.alternate, e);
        } finally {
          G = u, N.p = l, D.T = t;
        }
      }
      ia = 3;
    }
  }
  function $p() {
    if (ia === 4 || ia === 3) {
      ia = 0, Yg();
      var a = dt,
        e = wl,
        t = Oe,
        l = _p;
      (e.subtreeFlags & 10256) !== 0 || (e.flags & 10256) !== 0 ? ia = 5 : (ia = 0, wl = dt = null, am(a, a.pendingLanes));
      var u = a.pendingLanes;
      if (u === 0 && (rt = null), Rf(t), e = e.stateNode, _a && typeof _a.onCommitFiberRoot == "function") try {
        _a.onCommitFiberRoot(Mu, e, void 0, (e.current.flags & 128) === 128);
      } catch {}
      if (l !== null) {
        e = D.T, u = N.p, N.p = 2, D.T = null;
        try {
          for (var o = a.onRecoverableError, r = 0; r < l.length; r++) {
            var d = l[r];
            o(d.value, {
              componentStack: d.stack
            });
          }
        } finally {
          D.T = e, N.p = u;
        }
      }
      (Oe & 3) !== 0 && br(), xe(a), u = a.pendingLanes, (t & 261930) !== 0 && (u & 42) !== 0 ? a === hf ? nu++ : (nu = 0, hf = a) : nu = 0, qu(0, !1);
    }
  }
  function am(a, e) {
    (a.pooledCacheLanes &= e) === 0 && (e = a.pooledCache, e != null && (a.pooledCache = null, Ou(e)));
  }
  function br() {
    return Wp(), Jp(), $p(), em();
  }
  function em() {
    if (ia !== 5) return !1;
    var a = dt,
      e = mf;
    mf = 0;
    var t = Rf(Oe),
      l = D.T,
      u = N.p;
    try {
      N.p = 32 > t ? 32 : t, D.T = null, t = gf, gf = null;
      var o = dt,
        r = Oe;
      if (ia = 0, wl = dt = null, Oe = 0, (G & 6) !== 0) throw Error(L(331));
      var d = G;
      if (G |= 4, Fp(o.current), qp(o, o.current, r, t), G = d, qu(0, !1), _a && typeof _a.onPostCommitFiberRoot == "function") try {
        _a.onPostCommitFiberRoot(Mu, o);
      } catch {}
      return !0;
    } finally {
      N.p = u, D.T = l, am(a, e);
    }
  }
  function nn(a, e, t) {
    e = ae(t, e), e = ff(a.stateNode, e, 2), a = ot(a, e, 2), a !== null && (Du(a, 2), xe(a));
  }
  function P(a, e, t) {
    if (a.tag === 3) nn(a, a, t);else for (; e !== null;) {
      if (e.tag === 3) {
        nn(e, a, t);
        break;
      } else if (e.tag === 1) {
        var l = e.stateNode;
        if (typeof e.type.getDerivedStateFromError == "function" || typeof l.componentDidCatch == "function" && (rt === null || !rt.has(l))) {
          a = ae(t, a), t = hp(2), l = ot(e, t, 2), l !== null && (xp(t, l, e, a), Du(l, 2), xe(l));
          break;
        }
      }
      e = e.return;
    }
  }
  function Ad(a, e, t) {
    var l = a.pingCache;
    if (l === null) {
      l = a.pingCache = new vx();
      var u = new Set();
      l.set(e, u);
    } else u = l.get(e), u === void 0 && (u = new Set(), l.set(e, u));
    u.has(t) || (ps = !0, u.add(t), a = Ix.bind(null, a, e, t), e.then(a, a));
  }
  function Ix(a, e, t) {
    var l = a.pingCache;
    l !== null && l.delete(e), a.pingedLanes |= a.suspendedLanes & t, a.warmLanes &= ~t, Z === a && (H & t) === t && (ea === 4 || ea === 3 && (H & 62914560) === H && 300 > Na() - Lr ? (G & 2) === 0 && Al(a, 0) : ms |= t, Il === H && (Il = 0)), xe(a);
  }
  function tm(a, e) {
    e === 0 && (e = Yn()), a = Ht(a, e), a !== null && (Du(a, e), xe(a));
  }
  function wx(a) {
    var e = a.memoizedState,
      t = 0;
    e !== null && (t = e.retryLane), tm(a, t);
  }
  function Ax(a, e) {
    var t = 0;
    switch (a.tag) {
      case 31:
      case 13:
        var l = a.stateNode,
          u = a.memoizedState;
        u !== null && (t = u.retryLane);
        break;
      case 19:
        l = a.stateNode;
        break;
      case 22:
        l = a.stateNode._retryCache;
        break;
      default:
        throw Error(L(314));
    }
    l !== null && l.delete(e), tm(a, t);
  }
  function kx(a, e) {
    return Df(a, e);
  }
  var Jo = null,
    Jt = null,
    xf = !1,
    $o = !1,
    kd = !1,
    et = 0;
  function xe(a) {
    a !== Jt && a.next === null && (Jt === null ? Jo = Jt = a : Jt = Jt.next = a), $o = !0, xf || (xf = !0, Tx());
  }
  function qu(a, e) {
    if (!kd && $o) {
      kd = !0;
      do for (var t = !1, l = Jo; l !== null;) {
        if (!e) if (a !== 0) {
          var u = l.pendingLanes;
          if (u === 0) var o = 0;else {
            var r = l.suspendedLanes,
              d = l.pingedLanes;
            o = (1 << 31 - Pa(42 | a) + 1) - 1, o &= u & ~(r & ~d), o = o & 201326741 ? o & 201326741 | 1 : o ? o | 2 : 0;
          }
          o !== 0 && (t = !0, cn(l, o));
        } else o = H, o = dr(l, l === Z ? o : 0, l.cancelPendingCommit !== null || l.timeoutHandle !== -1), (o & 3) === 0 || Tu(l, o) || (t = !0, cn(l, o));
        l = l.next;
      } while (t);
      kd = !1;
    }
  }
  function Mx() {
    lm();
  }
  function lm() {
    $o = xf = !1;
    var a = 0;
    et !== 0 && Ex() && (a = et);
    for (var e = Na(), t = null, l = Jo; l !== null;) {
      var u = l.next,
        o = um(l, e);
      o === 0 ? (l.next = null, t === null ? Jo = u : t.next = u, u === null && (Jt = t)) : (t = l, (a !== 0 || (o & 3) !== 0) && ($o = !0)), l = u;
    }
    ia !== 0 && ia !== 5 || qu(a, !1), et !== 0 && (et = 0);
  }
  function um(a, e) {
    for (var t = a.suspendedLanes, l = a.pingedLanes, u = a.expirationTimes, o = a.pendingLanes & -62914561; 0 < o;) {
      var r = 31 - Pa(o),
        d = 1 << r,
        f = u[r];
      f === -1 ? ((d & t) === 0 || (d & l) !== 0) && (u[r] = eh(d, e)) : f <= e && (a.expiredLanes |= d), o &= ~d;
    }
    if (e = Z, t = H, t = dr(a, a === e ? t : 0, a.cancelPendingCommit !== null || a.timeoutHandle !== -1), l = a.callbackNode, t === 0 || a === e && (_ === 2 || _ === 9) || a.cancelPendingCommit !== null) return l !== null && l !== null && td(l), a.callbackNode = null, a.callbackPriority = 0;
    if ((t & 3) === 0 || Tu(a, t)) {
      if (e = t & -t, e === a.callbackPriority) return e;
      switch (l !== null && td(l), Rf(t)) {
        case 2:
        case 8:
          t = Xn;
          break;
        case 32:
          t = Uo;
          break;
        case 268435456:
          t = Zn;
          break;
        default:
          t = Uo;
      }
      return l = om.bind(null, a), t = Df(t, l), a.callbackPriority = e, a.callbackNode = t, e;
    }
    return l !== null && l !== null && td(l), a.callbackPriority = 2, a.callbackNode = null, 2;
  }
  function om(a, e) {
    if (ia !== 0 && ia !== 5) return a.callbackNode = null, a.callbackPriority = 0, null;
    var t = a.callbackNode;
    if (br() && a.callbackNode !== t) return null;
    var l = H;
    return l = dr(a, a === Z ? l : 0, a.cancelPendingCommit !== null || a.timeoutHandle !== -1), l === 0 ? null : (Vp(a, l, e), um(a, Na()), a.callbackNode != null && a.callbackNode === t ? om.bind(null, a) : null);
  }
  function cn(a, e) {
    if (br()) return null;
    Vp(a, e, !0);
  }
  function Tx() {
    Fx(function () {
      (G & 6) !== 0 ? Df(Vn, Mx) : lm();
    });
  }
  function hs() {
    if (et === 0) {
      var a = bl;
      a === 0 && (a = $u, $u <<= 1, ($u & 261888) === 0 && ($u = 256)), et = a;
    }
    return et;
  }
  function pn(a) {
    return a == null || typeof a == "symbol" || typeof a == "boolean" ? null : typeof a == "function" ? a : Lo("" + a);
  }
  function mn(a, e) {
    var t = e.ownerDocument.createElement("input");
    return t.name = e.name, t.value = e.value, a.id && t.setAttribute("form", a.id), e.parentNode.insertBefore(t, e), a = new FormData(a), t.parentNode.removeChild(t), a;
  }
  function Dx(a, e, t, l, u) {
    if (e === "submit" && t && t.stateNode === u) {
      var o = pn((u[Ua] || null).action),
        r = l.submitter;
      r && (e = (e = r[Ua] || null) ? pn(e.formAction) : r.getAttribute("formAction"), e !== null && (o = e, r = null));
      var d = new fr("action", "action", null, l, u);
      a.push({
        event: d,
        listeners: [{
          instance: null,
          listener: function () {
            if (l.defaultPrevented) {
              if (et !== 0) {
                var f = r ? mn(u, r) : new FormData(u);
                rf(t, {
                  pending: !0,
                  data: f,
                  method: u.method,
                  action: o
                }, null, f);
              }
            } else typeof o == "function" && (d.preventDefault(), f = r ? mn(u, r) : new FormData(u), rf(t, {
              pending: !0,
              data: f,
              method: u.method,
              action: o
            }, o, f));
          },
          currentTarget: u
        }]
      });
    }
  }
  for (co = 0; co < jd.length; co++) po = jd[co], gn = po.toLowerCase(), hn = po[0].toUpperCase() + po.slice(1), fe(gn, "on" + hn);
  var po, gn, hn, co;
  fe(xc, "onAnimationEnd");
  fe(Lc, "onAnimationIteration");
  fe(vc, "onAnimationStart");
  fe("dblclick", "onDoubleClick");
  fe("focusin", "onFocus");
  fe("focusout", "onBlur");
  fe(jh, "onTransitionRun");
  fe(Qh, "onTransitionStart");
  fe(Kh, "onTransitionCancel");
  fe(Sc, "onTransitionEnd");
  vl("onMouseEnter", ["mouseout", "mouseover"]);
  vl("onMouseLeave", ["mouseout", "mouseover"]);
  vl("onPointerEnter", ["pointerout", "pointerover"]);
  vl("onPointerLeave", ["pointerout", "pointerover"]);
  Ut("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" "));
  Ut("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));
  Ut("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]);
  Ut("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" "));
  Ut("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" "));
  Ut("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
  var yu = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),
    Bx = new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(yu));
  function rm(a, e) {
    e = (e & 4) !== 0;
    for (var t = 0; t < a.length; t++) {
      var l = a[t],
        u = l.event;
      l = l.listeners;
      a: {
        var o = void 0;
        if (e) for (var r = l.length - 1; 0 <= r; r--) {
          var d = l[r],
            f = d.instance,
            s = d.currentTarget;
          if (d = d.listener, f !== o && u.isPropagationStopped()) break a;
          o = d, u.currentTarget = s;
          try {
            o(u);
          } catch (g) {
            Eo(g);
          }
          u.currentTarget = null, o = f;
        } else for (r = 0; r < l.length; r++) {
          if (d = l[r], f = d.instance, s = d.currentTarget, d = d.listener, f !== o && u.isPropagationStopped()) break a;
          o = d, u.currentTarget = s;
          try {
            o(u);
          } catch (g) {
            Eo(g);
          }
          u.currentTarget = null, o = f;
        }
      }
    }
  }
  function q(a, e) {
    var t = e[Gd];
    t === void 0 && (t = e[Gd] = new Set());
    var l = a + "__bubble";
    t.has(l) || (dm(e, a, 2, !1), t.add(l));
  }
  function Md(a, e, t) {
    var l = 0;
    e && (l |= 4), dm(t, a, l, e);
  }
  var mo = "_reactListening" + Math.random().toString(36).slice(2);
  function xs(a) {
    if (!a[mo]) {
      a[mo] = !0, Jn.forEach(function (t) {
        t !== "selectionchange" && (Bx.has(t) || Md(t, !1, a), Md(t, !0, a));
      });
      var e = a.nodeType === 9 ? a : a.ownerDocument;
      e === null || e[mo] || (e[mo] = !0, Md("selectionchange", !1, e));
    }
  }
  function dm(a, e, t, l) {
    switch (Sm(e)) {
      case 2:
        var u = oL;
        break;
      case 8:
        u = rL;
        break;
      default:
        u = bs;
    }
    t = u.bind(null, e, t, a), u = void 0, !Xd || e !== "touchstart" && e !== "touchmove" && e !== "wheel" || (u = !0), l ? u !== void 0 ? a.addEventListener(e, t, {
      capture: !0,
      passive: u
    }) : a.addEventListener(e, t, !0) : u !== void 0 ? a.addEventListener(e, t, {
      passive: u
    }) : a.addEventListener(e, t, !1);
  }
  function Td(a, e, t, l, u) {
    var o = l;
    if ((e & 1) === 0 && (e & 2) === 0 && l !== null) a: for (;;) {
      if (l === null) return;
      var r = l.tag;
      if (r === 3 || r === 4) {
        var d = l.stateNode.containerInfo;
        if (d === u) break;
        if (r === 4) for (r = l.return; r !== null;) {
          var f = r.tag;
          if ((f === 3 || f === 4) && r.stateNode.containerInfo === u) return;
          r = r.return;
        }
        for (; d !== null;) {
          if (r = el(d), r === null) return;
          if (f = r.tag, f === 5 || f === 6 || f === 26 || f === 27) {
            l = o = r;
            continue a;
          }
          d = d.parentNode;
        }
      }
      l = l.return;
    }
    rc(function () {
      var s = o,
        g = Uf(t),
        h = [];
      a: {
        var c = bc.get(a);
        if (c !== void 0) {
          var m = fr,
            b = a;
          switch (a) {
            case "keypress":
              if (So(t) === 0) break a;
            case "keydown":
            case "keyup":
              m = Ah;
              break;
            case "focusin":
              b = "focus", m = dd;
              break;
            case "focusout":
              b = "blur", m = dd;
              break;
            case "beforeblur":
            case "afterblur":
              m = dd;
              break;
            case "click":
              if (t.button === 2) break a;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              m = yi;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              m = mh;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              m = Th;
              break;
            case xc:
            case Lc:
            case vc:
              m = xh;
              break;
            case Sc:
              m = Bh;
              break;
            case "scroll":
            case "scrollend":
              m = ch;
              break;
            case "wheel":
              m = Oh;
              break;
            case "copy":
            case "cut":
            case "paste":
              m = vh;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              m = Ii;
              break;
            case "toggle":
            case "beforetoggle":
              m = Uh;
          }
          var y = (e & 4) !== 0,
            T = !y && (a === "scroll" || a === "scrollend"),
            n = y ? c !== null ? c + "Capture" : null : c;
          y = [];
          for (var i = s, p; i !== null;) {
            var x = i;
            if (p = x.stateNode, x = x.tag, x !== 5 && x !== 26 && x !== 27 || p === null || n === null || (x = mu(i, n), x != null && y.push(Cu(i, x, p))), T) break;
            i = i.return;
          }
          0 < y.length && (c = new m(c, b, null, t, g), h.push({
            event: c,
            listeners: y
          }));
        }
      }
      if ((e & 7) === 0) {
        a: {
          if (c = a === "mouseover" || a === "pointerover", m = a === "mouseout" || a === "pointerout", c && t !== Vd && (b = t.relatedTarget || t.fromElement) && (el(b) || b[Tl])) break a;
          if ((m || c) && (c = g.window === g ? g : (c = g.ownerDocument) ? c.defaultView || c.parentWindow : window, m ? (b = t.relatedTarget || t.toElement, m = s, b = b ? el(b) : null, b !== null && (T = ku(b), y = b.tag, b !== T || y !== 5 && y !== 27 && y !== 6) && (b = null)) : (m = null, b = s), m !== b)) {
            if (y = yi, x = "onMouseLeave", n = "onMouseEnter", i = "mouse", (a === "pointerout" || a === "pointerover") && (y = Ii, x = "onPointerLeave", n = "onPointerEnter", i = "pointer"), T = m == null ? c : Wl(m), p = b == null ? c : Wl(b), c = new y(x, i + "leave", m, t, g), c.target = T, c.relatedTarget = p, x = null, el(g) === s && (y = new y(n, i + "enter", b, t, g), y.target = p, y.relatedTarget = T, x = y), T = x, m && b) e: {
              for (y = Rx, n = m, i = b, p = 0, x = n; x; x = y(x)) p++;
              x = 0;
              for (var A = i; A; A = y(A)) x++;
              for (; 0 < p - x;) n = y(n), p--;
              for (; 0 < x - p;) i = y(i), x--;
              for (; p--;) {
                if (n === i || i !== null && n === i.alternate) {
                  y = n;
                  break e;
                }
                n = y(n), i = y(i);
              }
              y = null;
            } else y = null;
            m !== null && xn(h, c, m, y, !1), b !== null && T !== null && xn(h, T, b, y, !0);
          }
        }
        a: {
          if (c = s ? Wl(s) : window, m = c.nodeName && c.nodeName.toLowerCase(), m === "select" || m === "input" && c.type === "file") var z = Mi;else if (ki(c)) {
            if (cc) z = Xh;else {
              z = Ph;
              var C = _h;
            }
          } else m = c.nodeName, !m || m.toLowerCase() !== "input" || c.type !== "checkbox" && c.type !== "radio" ? s && zf(s.elementType) && (z = Mi) : z = Vh;
          if (z && (z = z(a, s))) {
            nc(h, z, t, g);
            break a;
          }
          C && C(a, c, s), a === "focusout" && s && c.type === "number" && s.memoizedProps.value != null && Pd(c, "number", c.value);
        }
        switch (C = s ? Wl(s) : window, a) {
          case "focusin":
            (ki(C) || C.contentEditable === "true") && (ul = C, Zd = s, tu = null);
            break;
          case "focusout":
            tu = Zd = ul = null;
            break;
          case "mousedown":
            Yd = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            Yd = !1, Ri(h, t, g);
            break;
          case "selectionchange":
            if (Yh) break;
          case "keydown":
          case "keyup":
            Ri(h, t, g);
        }
        var v;
        if (Hf) a: {
          switch (a) {
            case "compositionstart":
              var S = "onCompositionStart";
              break a;
            case "compositionend":
              S = "onCompositionEnd";
              break a;
            case "compositionupdate":
              S = "onCompositionUpdate";
              break a;
          }
          S = void 0;
        } else ll ? sc(a, t) && (S = "onCompositionEnd") : a === "keydown" && t.keyCode === 229 && (S = "onCompositionStart");
        S && (fc && t.locale !== "ko" && (ll || S !== "onCompositionStart" ? S === "onCompositionEnd" && ll && (v = dc()) : (Je = g, qf = "value" in Je ? Je.value : Je.textContent, ll = !0)), C = ar(s, S), 0 < C.length && (S = new Ci(S, a, null, t, g), h.push({
          event: S,
          listeners: C
        }), v ? S.data = v : (v = ic(t), v !== null && (S.data = v)))), (v = Eh ? Hh(a, t) : Fh(a, t)) && (S = ar(s, "onBeforeInput"), 0 < S.length && (C = new Ci("onBeforeInput", "beforeinput", null, t, g), h.push({
          event: C,
          listeners: S
        }), C.data = v)), Dx(h, a, s, t, g);
      }
      rm(h, e);
    });
  }
  function Cu(a, e, t) {
    return {
      instance: a,
      listener: e,
      currentTarget: t
    };
  }
  function ar(a, e) {
    for (var t = e + "Capture", l = []; a !== null;) {
      var u = a,
        o = u.stateNode;
      if (u = u.tag, u !== 5 && u !== 26 && u !== 27 || o === null || (u = mu(a, t), u != null && l.unshift(Cu(a, u, o)), u = mu(a, e), u != null && l.push(Cu(a, u, o))), a.tag === 3) return l;
      a = a.return;
    }
    return [];
  }
  function Rx(a) {
    if (a === null) return null;
    do a = a.return; while (a && a.tag !== 5 && a.tag !== 27);
    return a || null;
  }
  function xn(a, e, t, l, u) {
    for (var o = e._reactName, r = []; t !== null && t !== l;) {
      var d = t,
        f = d.alternate,
        s = d.stateNode;
      if (d = d.tag, f !== null && f === l) break;
      d !== 5 && d !== 26 && d !== 27 || s === null || (f = s, u ? (s = mu(t, o), s != null && r.unshift(Cu(t, s, f))) : u || (s = mu(t, o), s != null && r.push(Cu(t, s, f)))), t = t.return;
    }
    r.length !== 0 && a.push({
      event: e,
      listeners: r
    });
  }
  var Ox = /\r\n?/g,
    zx = /\u0000|\uFFFD/g;
  function Ln(a) {
    return (typeof a == "string" ? a : "" + a).replace(Ox, `
`).replace(zx, "");
  }
  function fm(a, e) {
    return e = Ln(e), Ln(a) === e;
  }
  function V(a, e, t, l, u, o) {
    switch (t) {
      case "children":
        typeof l == "string" ? e === "body" || e === "textarea" && l === "" || Sl(a, l) : (typeof l == "number" || typeof l == "bigint") && e !== "body" && Sl(a, "" + l);
        break;
      case "className":
        to(a, "class", l);
        break;
      case "tabIndex":
        to(a, "tabindex", l);
        break;
      case "dir":
      case "role":
      case "viewBox":
      case "width":
      case "height":
        to(a, t, l);
        break;
      case "style":
        oc(a, l, o);
        break;
      case "data":
        if (e !== "object") {
          to(a, "data", l);
          break;
        }
      case "src":
      case "href":
        if (l === "" && (e !== "a" || t !== "href")) {
          a.removeAttribute(t);
          break;
        }
        if (l == null || typeof l == "function" || typeof l == "symbol" || typeof l == "boolean") {
          a.removeAttribute(t);
          break;
        }
        l = Lo("" + l), a.setAttribute(t, l);
        break;
      case "action":
      case "formAction":
        if (typeof l == "function") {
          a.setAttribute(t, "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");
          break;
        } else typeof o == "function" && (t === "formAction" ? (e !== "input" && V(a, e, "name", u.name, u, null), V(a, e, "formEncType", u.formEncType, u, null), V(a, e, "formMethod", u.formMethod, u, null), V(a, e, "formTarget", u.formTarget, u, null)) : (V(a, e, "encType", u.encType, u, null), V(a, e, "method", u.method, u, null), V(a, e, "target", u.target, u, null)));
        if (l == null || typeof l == "symbol" || typeof l == "boolean") {
          a.removeAttribute(t);
          break;
        }
        l = Lo("" + l), a.setAttribute(t, l);
        break;
      case "onClick":
        l != null && (a.onclick = Te);
        break;
      case "onScroll":
        l != null && q("scroll", a);
        break;
      case "onScrollEnd":
        l != null && q("scrollend", a);
        break;
      case "dangerouslySetInnerHTML":
        if (l != null) {
          if (typeof l != "object" || !("__html" in l)) throw Error(L(61));
          if (t = l.__html, t != null) {
            if (u.children != null) throw Error(L(60));
            a.innerHTML = t;
          }
        }
        break;
      case "multiple":
        a.multiple = l && typeof l != "function" && typeof l != "symbol";
        break;
      case "muted":
        a.muted = l && typeof l != "function" && typeof l != "symbol";
        break;
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "defaultValue":
      case "defaultChecked":
      case "innerHTML":
      case "ref":
        break;
      case "autoFocus":
        break;
      case "xlinkHref":
        if (l == null || typeof l == "function" || typeof l == "boolean" || typeof l == "symbol") {
          a.removeAttribute("xlink:href");
          break;
        }
        t = Lo("" + l), a.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", t);
        break;
      case "contentEditable":
      case "spellCheck":
      case "draggable":
      case "value":
      case "autoReverse":
      case "externalResourcesRequired":
      case "focusable":
      case "preserveAlpha":
        l != null && typeof l != "function" && typeof l != "symbol" ? a.setAttribute(t, "" + l) : a.removeAttribute(t);
        break;
      case "inert":
      case "allowFullScreen":
      case "async":
      case "autoPlay":
      case "controls":
      case "default":
      case "defer":
      case "disabled":
      case "disablePictureInPicture":
      case "disableRemotePlayback":
      case "formNoValidate":
      case "hidden":
      case "loop":
      case "noModule":
      case "noValidate":
      case "open":
      case "playsInline":
      case "readOnly":
      case "required":
      case "reversed":
      case "scoped":
      case "seamless":
      case "itemScope":
        l && typeof l != "function" && typeof l != "symbol" ? a.setAttribute(t, "") : a.removeAttribute(t);
        break;
      case "capture":
      case "download":
        l === !0 ? a.setAttribute(t, "") : l !== !1 && l != null && typeof l != "function" && typeof l != "symbol" ? a.setAttribute(t, l) : a.removeAttribute(t);
        break;
      case "cols":
      case "rows":
      case "size":
      case "span":
        l != null && typeof l != "function" && typeof l != "symbol" && !isNaN(l) && 1 <= l ? a.setAttribute(t, l) : a.removeAttribute(t);
        break;
      case "rowSpan":
      case "start":
        l == null || typeof l == "function" || typeof l == "symbol" || isNaN(l) ? a.removeAttribute(t) : a.setAttribute(t, l);
        break;
      case "popover":
        q("beforetoggle", a), q("toggle", a), xo(a, "popover", l);
        break;
      case "xlinkActuate":
        be(a, "http://www.w3.org/1999/xlink", "xlink:actuate", l);
        break;
      case "xlinkArcrole":
        be(a, "http://www.w3.org/1999/xlink", "xlink:arcrole", l);
        break;
      case "xlinkRole":
        be(a, "http://www.w3.org/1999/xlink", "xlink:role", l);
        break;
      case "xlinkShow":
        be(a, "http://www.w3.org/1999/xlink", "xlink:show", l);
        break;
      case "xlinkTitle":
        be(a, "http://www.w3.org/1999/xlink", "xlink:title", l);
        break;
      case "xlinkType":
        be(a, "http://www.w3.org/1999/xlink", "xlink:type", l);
        break;
      case "xmlBase":
        be(a, "http://www.w3.org/XML/1998/namespace", "xml:base", l);
        break;
      case "xmlLang":
        be(a, "http://www.w3.org/XML/1998/namespace", "xml:lang", l);
        break;
      case "xmlSpace":
        be(a, "http://www.w3.org/XML/1998/namespace", "xml:space", l);
        break;
      case "is":
        xo(a, "is", l);
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        (!(2 < t.length) || t[0] !== "o" && t[0] !== "O" || t[1] !== "n" && t[1] !== "N") && (t = ih.get(t) || t, xo(a, t, l));
    }
  }
  function Lf(a, e, t, l, u, o) {
    switch (t) {
      case "style":
        oc(a, l, o);
        break;
      case "dangerouslySetInnerHTML":
        if (l != null) {
          if (typeof l != "object" || !("__html" in l)) throw Error(L(61));
          if (t = l.__html, t != null) {
            if (u.children != null) throw Error(L(60));
            a.innerHTML = t;
          }
        }
        break;
      case "children":
        typeof l == "string" ? Sl(a, l) : (typeof l == "number" || typeof l == "bigint") && Sl(a, "" + l);
        break;
      case "onScroll":
        l != null && q("scroll", a);
        break;
      case "onScrollEnd":
        l != null && q("scrollend", a);
        break;
      case "onClick":
        l != null && (a.onclick = Te);
        break;
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "innerHTML":
      case "ref":
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        if (!$n.hasOwnProperty(t)) a: {
          if (t[0] === "o" && t[1] === "n" && (u = t.endsWith("Capture"), e = t.slice(2, u ? t.length - 7 : void 0), o = a[Ua] || null, o = o != null ? o[t] : null, typeof o == "function" && a.removeEventListener(e, o, u), typeof l == "function")) {
            typeof o != "function" && o !== null && (t in a ? a[t] = null : a.hasAttribute(t) && a.removeAttribute(t)), a.addEventListener(e, l, u);
            break a;
          }
          t in a ? a[t] = l : l === !0 ? a.setAttribute(t, "") : xo(a, t, l);
        }
    }
  }
  function ya(a, e, t) {
    switch (e) {
      case "div":
      case "span":
      case "svg":
      case "path":
      case "a":
      case "g":
      case "p":
      case "li":
        break;
      case "img":
        q("error", a), q("load", a);
        var l = !1,
          u = !1,
          o;
        for (o in t) if (t.hasOwnProperty(o)) {
          var r = t[o];
          if (r != null) switch (o) {
            case "src":
              l = !0;
              break;
            case "srcSet":
              u = !0;
              break;
            case "children":
            case "dangerouslySetInnerHTML":
              throw Error(L(137, e));
            default:
              V(a, e, o, r, t, null);
          }
        }
        u && V(a, e, "srcSet", t.srcSet, t, null), l && V(a, e, "src", t.src, t, null);
        return;
      case "input":
        q("invalid", a);
        var d = o = r = u = null,
          f = null,
          s = null;
        for (l in t) if (t.hasOwnProperty(l)) {
          var g = t[l];
          if (g != null) switch (l) {
            case "name":
              u = g;
              break;
            case "type":
              r = g;
              break;
            case "checked":
              f = g;
              break;
            case "defaultChecked":
              s = g;
              break;
            case "value":
              o = g;
              break;
            case "defaultValue":
              d = g;
              break;
            case "children":
            case "dangerouslySetInnerHTML":
              if (g != null) throw Error(L(137, e));
              break;
            default:
              V(a, e, l, g, t, null);
          }
        }
        tc(a, o, d, f, s, r, u, !1);
        return;
      case "select":
        q("invalid", a), l = r = o = null;
        for (u in t) if (t.hasOwnProperty(u) && (d = t[u], d != null)) switch (u) {
          case "value":
            o = d;
            break;
          case "defaultValue":
            r = d;
            break;
          case "multiple":
            l = d;
          default:
            V(a, e, u, d, t, null);
        }
        e = o, t = r, a.multiple = !!l, e != null ? cl(a, !!l, e, !1) : t != null && cl(a, !!l, t, !0);
        return;
      case "textarea":
        q("invalid", a), o = u = l = null;
        for (r in t) if (t.hasOwnProperty(r) && (d = t[r], d != null)) switch (r) {
          case "value":
            l = d;
            break;
          case "defaultValue":
            u = d;
            break;
          case "children":
            o = d;
            break;
          case "dangerouslySetInnerHTML":
            if (d != null) throw Error(L(91));
            break;
          default:
            V(a, e, r, d, t, null);
        }
        uc(a, l, u, o);
        return;
      case "option":
        for (f in t) t.hasOwnProperty(f) && (l = t[f], l != null) && (f === "selected" ? a.selected = l && typeof l != "function" && typeof l != "symbol" : V(a, e, f, l, t, null));
        return;
      case "dialog":
        q("beforetoggle", a), q("toggle", a), q("cancel", a), q("close", a);
        break;
      case "iframe":
      case "object":
        q("load", a);
        break;
      case "video":
      case "audio":
        for (l = 0; l < yu.length; l++) q(yu[l], a);
        break;
      case "image":
        q("error", a), q("load", a);
        break;
      case "details":
        q("toggle", a);
        break;
      case "embed":
      case "source":
      case "link":
        q("error", a), q("load", a);
      case "area":
      case "base":
      case "br":
      case "col":
      case "hr":
      case "keygen":
      case "meta":
      case "param":
      case "track":
      case "wbr":
      case "menuitem":
        for (s in t) if (t.hasOwnProperty(s) && (l = t[s], l != null)) switch (s) {
          case "children":
          case "dangerouslySetInnerHTML":
            throw Error(L(137, e));
          default:
            V(a, e, s, l, t, null);
        }
        return;
      default:
        if (zf(e)) {
          for (g in t) t.hasOwnProperty(g) && (l = t[g], l !== void 0 && Lf(a, e, g, l, t, void 0));
          return;
        }
    }
    for (d in t) t.hasOwnProperty(d) && (l = t[d], l != null && V(a, e, d, l, t, null));
  }
  function Ux(a, e, t, l) {
    switch (e) {
      case "div":
      case "span":
      case "svg":
      case "path":
      case "a":
      case "g":
      case "p":
      case "li":
        break;
      case "input":
        var u = null,
          o = null,
          r = null,
          d = null,
          f = null,
          s = null,
          g = null;
        for (m in t) {
          var h = t[m];
          if (t.hasOwnProperty(m) && h != null) switch (m) {
            case "checked":
              break;
            case "value":
              break;
            case "defaultValue":
              f = h;
            default:
              l.hasOwnProperty(m) || V(a, e, m, null, l, h);
          }
        }
        for (var c in l) {
          var m = l[c];
          if (h = t[c], l.hasOwnProperty(c) && (m != null || h != null)) switch (c) {
            case "type":
              o = m;
              break;
            case "name":
              u = m;
              break;
            case "checked":
              s = m;
              break;
            case "defaultChecked":
              g = m;
              break;
            case "value":
              r = m;
              break;
            case "defaultValue":
              d = m;
              break;
            case "children":
            case "dangerouslySetInnerHTML":
              if (m != null) throw Error(L(137, e));
              break;
            default:
              m !== h && V(a, e, c, m, l, h);
          }
        }
        _d(a, r, d, f, s, g, o, u);
        return;
      case "select":
        m = r = d = c = null;
        for (o in t) if (f = t[o], t.hasOwnProperty(o) && f != null) switch (o) {
          case "value":
            break;
          case "multiple":
            m = f;
          default:
            l.hasOwnProperty(o) || V(a, e, o, null, l, f);
        }
        for (u in l) if (o = l[u], f = t[u], l.hasOwnProperty(u) && (o != null || f != null)) switch (u) {
          case "value":
            c = o;
            break;
          case "defaultValue":
            d = o;
            break;
          case "multiple":
            r = o;
          default:
            o !== f && V(a, e, u, o, l, f);
        }
        e = d, t = r, l = m, c != null ? cl(a, !!t, c, !1) : !!l != !!t && (e != null ? cl(a, !!t, e, !0) : cl(a, !!t, t ? [] : "", !1));
        return;
      case "textarea":
        m = c = null;
        for (d in t) if (u = t[d], t.hasOwnProperty(d) && u != null && !l.hasOwnProperty(d)) switch (d) {
          case "value":
            break;
          case "children":
            break;
          default:
            V(a, e, d, null, l, u);
        }
        for (r in l) if (u = l[r], o = t[r], l.hasOwnProperty(r) && (u != null || o != null)) switch (r) {
          case "value":
            c = u;
            break;
          case "defaultValue":
            m = u;
            break;
          case "children":
            break;
          case "dangerouslySetInnerHTML":
            if (u != null) throw Error(L(91));
            break;
          default:
            u !== o && V(a, e, r, u, l, o);
        }
        lc(a, c, m);
        return;
      case "option":
        for (var b in t) c = t[b], t.hasOwnProperty(b) && c != null && !l.hasOwnProperty(b) && (b === "selected" ? a.selected = !1 : V(a, e, b, null, l, c));
        for (f in l) c = l[f], m = t[f], l.hasOwnProperty(f) && c !== m && (c != null || m != null) && (f === "selected" ? a.selected = c && typeof c != "function" && typeof c != "symbol" : V(a, e, f, c, l, m));
        return;
      case "img":
      case "link":
      case "area":
      case "base":
      case "br":
      case "col":
      case "embed":
      case "hr":
      case "keygen":
      case "meta":
      case "param":
      case "source":
      case "track":
      case "wbr":
      case "menuitem":
        for (var y in t) c = t[y], t.hasOwnProperty(y) && c != null && !l.hasOwnProperty(y) && V(a, e, y, null, l, c);
        for (s in l) if (c = l[s], m = t[s], l.hasOwnProperty(s) && c !== m && (c != null || m != null)) switch (s) {
          case "children":
          case "dangerouslySetInnerHTML":
            if (c != null) throw Error(L(137, e));
            break;
          default:
            V(a, e, s, c, l, m);
        }
        return;
      default:
        if (zf(e)) {
          for (var T in t) c = t[T], t.hasOwnProperty(T) && c !== void 0 && !l.hasOwnProperty(T) && Lf(a, e, T, void 0, l, c);
          for (g in l) c = l[g], m = t[g], !l.hasOwnProperty(g) || c === m || c === void 0 && m === void 0 || Lf(a, e, g, c, l, m);
          return;
        }
    }
    for (var n in t) c = t[n], t.hasOwnProperty(n) && c != null && !l.hasOwnProperty(n) && V(a, e, n, null, l, c);
    for (h in l) c = l[h], m = t[h], !l.hasOwnProperty(h) || c === m || c == null && m == null || V(a, e, h, c, l, m);
  }
  function vn(a) {
    switch (a) {
      case "css":
      case "script":
      case "font":
      case "img":
      case "image":
      case "input":
      case "link":
        return !0;
      default:
        return !1;
    }
  }
  function qx() {
    if (typeof performance.getEntriesByType == "function") {
      for (var a = 0, e = 0, t = performance.getEntriesByType("resource"), l = 0; l < t.length; l++) {
        var u = t[l],
          o = u.transferSize,
          r = u.initiatorType,
          d = u.duration;
        if (o && d && vn(r)) {
          for (r = 0, d = u.responseEnd, l += 1; l < t.length; l++) {
            var f = t[l],
              s = f.startTime;
            if (s > d) break;
            var g = f.transferSize,
              h = f.initiatorType;
            g && vn(h) && (f = f.responseEnd, r += g * (f < d ? 1 : (d - s) / (f - s)));
          }
          if (--l, e += 8 * (o + r) / (u.duration / 1e3), a++, 10 < a) break;
        }
      }
      if (0 < a) return e / a / 1e6;
    }
    return navigator.connection && (a = navigator.connection.downlink, typeof a == "number") ? a : 5;
  }
  var vf = null,
    Sf = null;
  function er(a) {
    return a.nodeType === 9 ? a : a.ownerDocument;
  }
  function Sn(a) {
    switch (a) {
      case "http://www.w3.org/2000/svg":
        return 1;
      case "http://www.w3.org/1998/Math/MathML":
        return 2;
      default:
        return 0;
    }
  }
  function sm(a, e) {
    if (a === 0) switch (e) {
      case "svg":
        return 1;
      case "math":
        return 2;
      default:
        return 0;
    }
    return a === 1 && e === "foreignObject" ? 0 : a;
  }
  function bf(a, e) {
    return a === "textarea" || a === "noscript" || typeof e.children == "string" || typeof e.children == "number" || typeof e.children == "bigint" || typeof e.dangerouslySetInnerHTML == "object" && e.dangerouslySetInnerHTML !== null && e.dangerouslySetInnerHTML.__html != null;
  }
  var Dd = null;
  function Ex() {
    var a = window.event;
    return a && a.type === "popstate" ? a === Dd ? !1 : (Dd = a, !0) : (Dd = null, !1);
  }
  var im = typeof setTimeout == "function" ? setTimeout : void 0,
    Hx = typeof clearTimeout == "function" ? clearTimeout : void 0,
    bn = typeof Promise == "function" ? Promise : void 0,
    Fx = typeof queueMicrotask == "function" ? queueMicrotask : typeof bn < "u" ? function (a) {
      return bn.resolve(null).then(a).catch(Gx);
    } : im;
  function Gx(a) {
    setTimeout(function () {
      throw a;
    });
  }
  function ht(a) {
    return a === "head";
  }
  function yn(a, e) {
    var t = e,
      l = 0;
    do {
      var u = t.nextSibling;
      if (a.removeChild(t), u && u.nodeType === 8) if (t = u.data, t === "/$" || t === "/&") {
        if (l === 0) {
          a.removeChild(u), Ml(e);
          return;
        }
        l--;
      } else if (t === "$" || t === "$?" || t === "$~" || t === "$!" || t === "&") l++;else if (t === "html") cu(a.ownerDocument.documentElement);else if (t === "head") {
        t = a.ownerDocument.head, cu(t);
        for (var o = t.firstChild; o;) {
          var r = o.nextSibling,
            d = o.nodeName;
          o[Bu] || d === "SCRIPT" || d === "STYLE" || d === "LINK" && o.rel.toLowerCase() === "stylesheet" || t.removeChild(o), o = r;
        }
      } else t === "body" && cu(a.ownerDocument.body);
      t = u;
    } while (t);
    Ml(e);
  }
  function Cn(a, e) {
    var t = a;
    a = 0;
    do {
      var l = t.nextSibling;
      if (t.nodeType === 1 ? e ? (t._stashedDisplay = t.style.display, t.style.display = "none") : (t.style.display = t._stashedDisplay || "", t.getAttribute("style") === "" && t.removeAttribute("style")) : t.nodeType === 3 && (e ? (t._stashedText = t.nodeValue, t.nodeValue = "") : t.nodeValue = t._stashedText || ""), l && l.nodeType === 8) if (t = l.data, t === "/$") {
        if (a === 0) break;
        a--;
      } else t !== "$" && t !== "$?" && t !== "$~" && t !== "$!" || a++;
      t = l;
    } while (t);
  }
  function yf(a) {
    var e = a.firstChild;
    for (e && e.nodeType === 10 && (e = e.nextSibling); e;) {
      var t = e;
      switch (e = e.nextSibling, t.nodeName) {
        case "HTML":
        case "HEAD":
        case "BODY":
          yf(t), Of(t);
          continue;
        case "SCRIPT":
        case "STYLE":
          continue;
        case "LINK":
          if (t.rel.toLowerCase() === "stylesheet") continue;
      }
      a.removeChild(t);
    }
  }
  function Nx(a, e, t, l) {
    for (; a.nodeType === 1;) {
      var u = t;
      if (a.nodeName.toLowerCase() !== e.toLowerCase()) {
        if (!l && (a.nodeName !== "INPUT" || a.type !== "hidden")) break;
      } else if (l) {
        if (!a[Bu]) switch (e) {
          case "meta":
            if (!a.hasAttribute("itemprop")) break;
            return a;
          case "link":
            if (o = a.getAttribute("rel"), o === "stylesheet" && a.hasAttribute("data-precedence")) break;
            if (o !== u.rel || a.getAttribute("href") !== (u.href == null || u.href === "" ? null : u.href) || a.getAttribute("crossorigin") !== (u.crossOrigin == null ? null : u.crossOrigin) || a.getAttribute("title") !== (u.title == null ? null : u.title)) break;
            return a;
          case "style":
            if (a.hasAttribute("data-precedence")) break;
            return a;
          case "script":
            if (o = a.getAttribute("src"), (o !== (u.src == null ? null : u.src) || a.getAttribute("type") !== (u.type == null ? null : u.type) || a.getAttribute("crossorigin") !== (u.crossOrigin == null ? null : u.crossOrigin)) && o && a.hasAttribute("async") && !a.hasAttribute("itemprop")) break;
            return a;
          default:
            return a;
        }
      } else if (e === "input" && a.type === "hidden") {
        var o = u.name == null ? null : "" + u.name;
        if (u.type === "hidden" && a.getAttribute("name") === o) return a;
      } else return a;
      if (a = le(a.nextSibling), a === null) break;
    }
    return null;
  }
  function _x(a, e, t) {
    if (e === "") return null;
    for (; a.nodeType !== 3;) if ((a.nodeType !== 1 || a.nodeName !== "INPUT" || a.type !== "hidden") && !t || (a = le(a.nextSibling), a === null)) return null;
    return a;
  }
  function nm(a, e) {
    for (; a.nodeType !== 8;) if ((a.nodeType !== 1 || a.nodeName !== "INPUT" || a.type !== "hidden") && !e || (a = le(a.nextSibling), a === null)) return null;
    return a;
  }
  function Cf(a) {
    return a.data === "$?" || a.data === "$~";
  }
  function If(a) {
    return a.data === "$!" || a.data === "$?" && a.ownerDocument.readyState !== "loading";
  }
  function Px(a, e) {
    var t = a.ownerDocument;
    if (a.data === "$~") a._reactRetry = e;else if (a.data !== "$?" || t.readyState !== "loading") e();else {
      var l = function () {
        e(), t.removeEventListener("DOMContentLoaded", l);
      };
      t.addEventListener("DOMContentLoaded", l), a._reactRetry = l;
    }
  }
  function le(a) {
    for (; a != null; a = a.nextSibling) {
      var e = a.nodeType;
      if (e === 1 || e === 3) break;
      if (e === 8) {
        if (e = a.data, e === "$" || e === "$!" || e === "$?" || e === "$~" || e === "&" || e === "F!" || e === "F") break;
        if (e === "/$" || e === "/&") return null;
      }
    }
    return a;
  }
  var wf = null;
  function In(a) {
    a = a.nextSibling;
    for (var e = 0; a;) {
      if (a.nodeType === 8) {
        var t = a.data;
        if (t === "/$" || t === "/&") {
          if (e === 0) return le(a.nextSibling);
          e--;
        } else t !== "$" && t !== "$!" && t !== "$?" && t !== "$~" && t !== "&" || e++;
      }
      a = a.nextSibling;
    }
    return null;
  }
  function wn(a) {
    a = a.previousSibling;
    for (var e = 0; a;) {
      if (a.nodeType === 8) {
        var t = a.data;
        if (t === "$" || t === "$!" || t === "$?" || t === "$~" || t === "&") {
          if (e === 0) return a;
          e--;
        } else t !== "/$" && t !== "/&" || e++;
      }
      a = a.previousSibling;
    }
    return null;
  }
  function cm(a, e, t) {
    switch (e = er(t), a) {
      case "html":
        if (a = e.documentElement, !a) throw Error(L(452));
        return a;
      case "head":
        if (a = e.head, !a) throw Error(L(453));
        return a;
      case "body":
        if (a = e.body, !a) throw Error(L(454));
        return a;
      default:
        throw Error(L(451));
    }
  }
  function cu(a) {
    for (var e = a.attributes; e.length;) a.removeAttributeNode(e[0]);
    Of(a);
  }
  var ue = new Map(),
    An = new Set();
  function tr(a) {
    return typeof a.getRootNode == "function" ? a.getRootNode() : a.nodeType === 9 ? a : a.ownerDocument;
  }
  var Fe = N.d;
  N.d = {
    f: Vx,
    r: Xx,
    D: Zx,
    C: Yx,
    L: jx,
    m: Qx,
    X: Wx,
    S: Kx,
    M: Jx
  };
  function Vx() {
    var a = Fe.f(),
      e = vr();
    return a || e;
  }
  function Xx(a) {
    var e = Dl(a);
    e !== null && e.tag === 5 && e.type === "form" ? op(e) : Fe.r(a);
  }
  var zl = typeof document > "u" ? null : document;
  function pm(a, e, t) {
    var l = zl;
    if (l && typeof e == "string" && e) {
      var u = $a(e);
      u = 'link[rel="' + a + '"][href="' + u + '"]', typeof t == "string" && (u += '[crossorigin="' + t + '"]'), An.has(u) || (An.add(u), a = {
        rel: a,
        crossOrigin: t,
        href: e
      }, l.querySelector(u) === null && (e = l.createElement("link"), ya(e, "link", a), ha(e), l.head.appendChild(e)));
    }
  }
  function Zx(a) {
    Fe.D(a), pm("dns-prefetch", a, null);
  }
  function Yx(a, e) {
    Fe.C(a, e), pm("preconnect", a, e);
  }
  function jx(a, e, t) {
    Fe.L(a, e, t);
    var l = zl;
    if (l && a && e) {
      var u = 'link[rel="preload"][as="' + $a(e) + '"]';
      e === "image" && t && t.imageSrcSet ? (u += '[imagesrcset="' + $a(t.imageSrcSet) + '"]', typeof t.imageSizes == "string" && (u += '[imagesizes="' + $a(t.imageSizes) + '"]')) : u += '[href="' + $a(a) + '"]';
      var o = u;
      switch (e) {
        case "style":
          o = kl(a);
          break;
        case "script":
          o = Ul(a);
      }
      ue.has(o) || (a = W({
        rel: "preload",
        href: e === "image" && t && t.imageSrcSet ? void 0 : a,
        as: e
      }, t), ue.set(o, a), l.querySelector(u) !== null || e === "style" && l.querySelector(Eu(o)) || e === "script" && l.querySelector(Hu(o)) || (e = l.createElement("link"), ya(e, "link", a), ha(e), l.head.appendChild(e)));
    }
  }
  function Qx(a, e) {
    Fe.m(a, e);
    var t = zl;
    if (t && a) {
      var l = e && typeof e.as == "string" ? e.as : "script",
        u = 'link[rel="modulepreload"][as="' + $a(l) + '"][href="' + $a(a) + '"]',
        o = u;
      switch (l) {
        case "audioworklet":
        case "paintworklet":
        case "serviceworker":
        case "sharedworker":
        case "worker":
        case "script":
          o = Ul(a);
      }
      if (!ue.has(o) && (a = W({
        rel: "modulepreload",
        href: a
      }, e), ue.set(o, a), t.querySelector(u) === null)) {
        switch (l) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            if (t.querySelector(Hu(o))) return;
        }
        l = t.createElement("link"), ya(l, "link", a), ha(l), t.head.appendChild(l);
      }
    }
  }
  function Kx(a, e, t) {
    Fe.S(a, e, t);
    var l = zl;
    if (l && a) {
      var u = nl(l).hoistableStyles,
        o = kl(a);
      e = e || "default";
      var r = u.get(o);
      if (!r) {
        var d = {
          loading: 0,
          preload: null
        };
        if (r = l.querySelector(Eu(o))) d.loading = 5;else {
          a = W({
            rel: "stylesheet",
            href: a,
            "data-precedence": e
          }, t), (t = ue.get(o)) && Ls(a, t);
          var f = r = l.createElement("link");
          ha(f), ya(f, "link", a), f._p = new Promise(function (s, g) {
            f.onload = s, f.onerror = g;
          }), f.addEventListener("load", function () {
            d.loading |= 1;
          }), f.addEventListener("error", function () {
            d.loading |= 2;
          }), d.loading |= 4, Mo(r, e, l);
        }
        r = {
          type: "stylesheet",
          instance: r,
          count: 1,
          state: d
        }, u.set(o, r);
      }
    }
  }
  function Wx(a, e) {
    Fe.X(a, e);
    var t = zl;
    if (t && a) {
      var l = nl(t).hoistableScripts,
        u = Ul(a),
        o = l.get(u);
      o || (o = t.querySelector(Hu(u)), o || (a = W({
        src: a,
        async: !0
      }, e), (e = ue.get(u)) && vs(a, e), o = t.createElement("script"), ha(o), ya(o, "link", a), t.head.appendChild(o)), o = {
        type: "script",
        instance: o,
        count: 1,
        state: null
      }, l.set(u, o));
    }
  }
  function Jx(a, e) {
    Fe.M(a, e);
    var t = zl;
    if (t && a) {
      var l = nl(t).hoistableScripts,
        u = Ul(a),
        o = l.get(u);
      o || (o = t.querySelector(Hu(u)), o || (a = W({
        src: a,
        async: !0,
        type: "module"
      }, e), (e = ue.get(u)) && vs(a, e), o = t.createElement("script"), ha(o), ya(o, "link", a), t.head.appendChild(o)), o = {
        type: "script",
        instance: o,
        count: 1,
        state: null
      }, l.set(u, o));
    }
  }
  function kn(a, e, t, l) {
    var u = (u = tt.current) ? tr(u) : null;
    if (!u) throw Error(L(446));
    switch (a) {
      case "meta":
      case "title":
        return null;
      case "style":
        return typeof t.precedence == "string" && typeof t.href == "string" ? (e = kl(t.href), t = nl(u).hoistableStyles, l = t.get(e), l || (l = {
          type: "style",
          instance: null,
          count: 0,
          state: null
        }, t.set(e, l)), l) : {
          type: "void",
          instance: null,
          count: 0,
          state: null
        };
      case "link":
        if (t.rel === "stylesheet" && typeof t.href == "string" && typeof t.precedence == "string") {
          a = kl(t.href);
          var o = nl(u).hoistableStyles,
            r = o.get(a);
          if (r || (u = u.ownerDocument || u, r = {
            type: "stylesheet",
            instance: null,
            count: 0,
            state: {
              loading: 0,
              preload: null
            }
          }, o.set(a, r), (o = u.querySelector(Eu(a))) && !o._p && (r.instance = o, r.state.loading = 5), ue.has(a) || (t = {
            rel: "preload",
            as: "style",
            href: t.href,
            crossOrigin: t.crossOrigin,
            integrity: t.integrity,
            media: t.media,
            hrefLang: t.hrefLang,
            referrerPolicy: t.referrerPolicy
          }, ue.set(a, t), o || $x(u, a, t, r.state))), e && l === null) throw Error(L(528, ""));
          return r;
        }
        if (e && l !== null) throw Error(L(529, ""));
        return null;
      case "script":
        return e = t.async, t = t.src, typeof t == "string" && e && typeof e != "function" && typeof e != "symbol" ? (e = Ul(t), t = nl(u).hoistableScripts, l = t.get(e), l || (l = {
          type: "script",
          instance: null,
          count: 0,
          state: null
        }, t.set(e, l)), l) : {
          type: "void",
          instance: null,
          count: 0,
          state: null
        };
      default:
        throw Error(L(444, a));
    }
  }
  function kl(a) {
    return 'href="' + $a(a) + '"';
  }
  function Eu(a) {
    return 'link[rel="stylesheet"][' + a + "]";
  }
  function mm(a) {
    return W({}, a, {
      "data-precedence": a.precedence,
      precedence: null
    });
  }
  function $x(a, e, t, l) {
    a.querySelector('link[rel="preload"][as="style"][' + e + "]") ? l.loading = 1 : (e = a.createElement("link"), l.preload = e, e.addEventListener("load", function () {
      return l.loading |= 1;
    }), e.addEventListener("error", function () {
      return l.loading |= 2;
    }), ya(e, "link", t), ha(e), a.head.appendChild(e));
  }
  function Ul(a) {
    return '[src="' + $a(a) + '"]';
  }
  function Hu(a) {
    return "script[async]" + a;
  }
  function Mn(a, e, t) {
    if (e.count++, e.instance === null) switch (e.type) {
      case "style":
        var l = a.querySelector('style[data-href~="' + $a(t.href) + '"]');
        if (l) return e.instance = l, ha(l), l;
        var u = W({}, t, {
          "data-href": t.href,
          "data-precedence": t.precedence,
          href: null,
          precedence: null
        });
        return l = (a.ownerDocument || a).createElement("style"), ha(l), ya(l, "style", u), Mo(l, t.precedence, a), e.instance = l;
      case "stylesheet":
        u = kl(t.href);
        var o = a.querySelector(Eu(u));
        if (o) return e.state.loading |= 4, e.instance = o, ha(o), o;
        l = mm(t), (u = ue.get(u)) && Ls(l, u), o = (a.ownerDocument || a).createElement("link"), ha(o);
        var r = o;
        return r._p = new Promise(function (d, f) {
          r.onload = d, r.onerror = f;
        }), ya(o, "link", l), e.state.loading |= 4, Mo(o, t.precedence, a), e.instance = o;
      case "script":
        return o = Ul(t.src), (u = a.querySelector(Hu(o))) ? (e.instance = u, ha(u), u) : (l = t, (u = ue.get(o)) && (l = W({}, t), vs(l, u)), a = a.ownerDocument || a, u = a.createElement("script"), ha(u), ya(u, "link", l), a.head.appendChild(u), e.instance = u);
      case "void":
        return null;
      default:
        throw Error(L(443, e.type));
    } else e.type === "stylesheet" && (e.state.loading & 4) === 0 && (l = e.instance, e.state.loading |= 4, Mo(l, t.precedence, a));
    return e.instance;
  }
  function Mo(a, e, t) {
    for (var l = t.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'), u = l.length ? l[l.length - 1] : null, o = u, r = 0; r < l.length; r++) {
      var d = l[r];
      if (d.dataset.precedence === e) o = d;else if (o !== u) break;
    }
    o ? o.parentNode.insertBefore(a, o.nextSibling) : (e = t.nodeType === 9 ? t.head : t, e.insertBefore(a, e.firstChild));
  }
  function Ls(a, e) {
    a.crossOrigin == null && (a.crossOrigin = e.crossOrigin), a.referrerPolicy == null && (a.referrerPolicy = e.referrerPolicy), a.title == null && (a.title = e.title);
  }
  function vs(a, e) {
    a.crossOrigin == null && (a.crossOrigin = e.crossOrigin), a.referrerPolicy == null && (a.referrerPolicy = e.referrerPolicy), a.integrity == null && (a.integrity = e.integrity);
  }
  var To = null;
  function Tn(a, e, t) {
    if (To === null) {
      var l = new Map(),
        u = To = new Map();
      u.set(t, l);
    } else u = To, l = u.get(t), l || (l = new Map(), u.set(t, l));
    if (l.has(a)) return l;
    for (l.set(a, null), t = t.getElementsByTagName(a), u = 0; u < t.length; u++) {
      var o = t[u];
      if (!(o[Bu] || o[va] || a === "link" && o.getAttribute("rel") === "stylesheet") && o.namespaceURI !== "http://www.w3.org/2000/svg") {
        var r = o.getAttribute(e) || "";
        r = a + r;
        var d = l.get(r);
        d ? d.push(o) : l.set(r, [o]);
      }
    }
    return l;
  }
  function Dn(a, e, t) {
    a = a.ownerDocument || a, a.head.insertBefore(t, e === "title" ? a.querySelector("head > title") : null);
  }
  function aL(a, e, t) {
    if (t === 1 || e.itemProp != null) return !1;
    switch (a) {
      case "meta":
      case "title":
        return !0;
      case "style":
        if (typeof e.precedence != "string" || typeof e.href != "string" || e.href === "") break;
        return !0;
      case "link":
        if (typeof e.rel != "string" || typeof e.href != "string" || e.href === "" || e.onLoad || e.onError) break;
        return e.rel === "stylesheet" ? (a = e.disabled, typeof e.precedence == "string" && a == null) : !0;
      case "script":
        if (e.async && typeof e.async != "function" && typeof e.async != "symbol" && !e.onLoad && !e.onError && e.src && typeof e.src == "string") return !0;
    }
    return !1;
  }
  function gm(a) {
    return !(a.type === "stylesheet" && (a.state.loading & 3) === 0);
  }
  function eL(a, e, t, l) {
    if (t.type === "stylesheet" && (typeof l.media != "string" || matchMedia(l.media).matches !== !1) && (t.state.loading & 4) === 0) {
      if (t.instance === null) {
        var u = kl(l.href),
          o = e.querySelector(Eu(u));
        if (o) {
          e = o._p, e !== null && typeof e == "object" && typeof e.then == "function" && (a.count++, a = lr.bind(a), e.then(a, a)), t.state.loading |= 4, t.instance = o, ha(o);
          return;
        }
        o = e.ownerDocument || e, l = mm(l), (u = ue.get(u)) && Ls(l, u), o = o.createElement("link"), ha(o);
        var r = o;
        r._p = new Promise(function (d, f) {
          r.onload = d, r.onerror = f;
        }), ya(o, "link", l), t.instance = o;
      }
      a.stylesheets === null && (a.stylesheets = new Map()), a.stylesheets.set(t, e), (e = t.state.preload) && (t.state.loading & 3) === 0 && (a.count++, t = lr.bind(a), e.addEventListener("load", t), e.addEventListener("error", t));
    }
  }
  var Bd = 0;
  function tL(a, e) {
    return a.stylesheets && a.count === 0 && Do(a, a.stylesheets), 0 < a.count || 0 < a.imgCount ? function (t) {
      var l = setTimeout(function () {
        if (a.stylesheets && Do(a, a.stylesheets), a.unsuspend) {
          var o = a.unsuspend;
          a.unsuspend = null, o();
        }
      }, 6e4 + e);
      0 < a.imgBytes && Bd === 0 && (Bd = 62500 * qx());
      var u = setTimeout(function () {
        if (a.waitingForImages = !1, a.count === 0 && (a.stylesheets && Do(a, a.stylesheets), a.unsuspend)) {
          var o = a.unsuspend;
          a.unsuspend = null, o();
        }
      }, (a.imgBytes > Bd ? 50 : 800) + e);
      return a.unsuspend = t, function () {
        a.unsuspend = null, clearTimeout(l), clearTimeout(u);
      };
    } : null;
  }
  function lr() {
    if (this.count--, this.count === 0 && (this.imgCount === 0 || !this.waitingForImages)) {
      if (this.stylesheets) Do(this, this.stylesheets);else if (this.unsuspend) {
        var a = this.unsuspend;
        this.unsuspend = null, a();
      }
    }
  }
  var ur = null;
  function Do(a, e) {
    a.stylesheets = null, a.unsuspend !== null && (a.count++, ur = new Map(), e.forEach(lL, a), ur = null, lr.call(a));
  }
  function lL(a, e) {
    if (!(e.state.loading & 4)) {
      var t = ur.get(a);
      if (t) var l = t.get(null);else {
        t = new Map(), ur.set(a, t);
        for (var u = a.querySelectorAll("link[data-precedence],style[data-precedence]"), o = 0; o < u.length; o++) {
          var r = u[o];
          (r.nodeName === "LINK" || r.getAttribute("media") !== "not all") && (t.set(r.dataset.precedence, r), l = r);
        }
        l && t.set(null, l);
      }
      u = e.instance, r = u.getAttribute("data-precedence"), o = t.get(r) || l, o === l && t.set(null, u), t.set(r, u), this.count++, l = lr.bind(this), u.addEventListener("load", l), u.addEventListener("error", l), o ? o.parentNode.insertBefore(u, o.nextSibling) : (a = a.nodeType === 9 ? a.head : a, a.insertBefore(u, a.firstChild)), e.state.loading |= 4;
    }
  }
  var Iu = {
    $$typeof: Me,
    Provider: null,
    Consumer: null,
    _currentValue: wt,
    _currentValue2: wt,
    _threadCount: 0
  };
  function uL(a, e, t, l, u, o, r, d, f) {
    this.tag = 1, this.containerInfo = a, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = ld(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = ld(0), this.hiddenUpdates = ld(null), this.identifierPrefix = l, this.onUncaughtError = u, this.onCaughtError = o, this.onRecoverableError = r, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = f, this.incompleteTransitions = new Map();
  }
  function hm(a, e, t, l, u, o, r, d, f, s, g, h) {
    return a = new uL(a, e, t, r, f, s, g, h, d), e = 1, o === !0 && (e |= 24), o = Fa(3, null, null, e), a.current = o, o.stateNode = a, e = Xf(), e.refCount++, a.pooledCache = e, e.refCount++, o.memoizedState = {
      element: l,
      isDehydrated: t,
      cache: e
    }, jf(o), a;
  }
  function xm(a) {
    return a ? (a = dl, a) : dl;
  }
  function Lm(a, e, t, l, u, o) {
    u = xm(u), l.context === null ? l.context = u : l.pendingContext = u, l = ut(e), l.payload = {
      element: t
    }, o = o === void 0 ? null : o, o !== null && (l.callback = o), t = ot(a, l, e), t !== null && (za(t, a, e), uu(t, a, e));
  }
  function Bn(a, e) {
    if (a = a.memoizedState, a !== null && a.dehydrated !== null) {
      var t = a.retryLane;
      a.retryLane = t !== 0 && t < e ? t : e;
    }
  }
  function Ss(a, e) {
    Bn(a, e), (a = a.alternate) && Bn(a, e);
  }
  function vm(a) {
    if (a.tag === 13 || a.tag === 31) {
      var e = Ht(a, 67108864);
      e !== null && za(e, a, 67108864), Ss(a, 67108864);
    }
  }
  function Rn(a) {
    if (a.tag === 13 || a.tag === 31) {
      var e = Va();
      e = Bf(e);
      var t = Ht(a, e);
      t !== null && za(t, a, e), Ss(a, e);
    }
  }
  var or = !0;
  function oL(a, e, t, l) {
    var u = D.T;
    D.T = null;
    var o = N.p;
    try {
      N.p = 2, bs(a, e, t, l);
    } finally {
      N.p = o, D.T = u;
    }
  }
  function rL(a, e, t, l) {
    var u = D.T;
    D.T = null;
    var o = N.p;
    try {
      N.p = 8, bs(a, e, t, l);
    } finally {
      N.p = o, D.T = u;
    }
  }
  function bs(a, e, t, l) {
    if (or) {
      var u = Af(l);
      if (u === null) Td(a, e, l, rr, t), On(a, l);else if (fL(u, a, e, t, l)) l.stopPropagation();else if (On(a, l), e & 4 && -1 < dL.indexOf(a)) {
        for (; u !== null;) {
          var o = Dl(u);
          if (o !== null) switch (o.tag) {
            case 3:
              if (o = o.stateNode, o.current.memoizedState.isDehydrated) {
                var r = yt(o.pendingLanes);
                if (r !== 0) {
                  var d = o;
                  for (d.pendingLanes |= 2, d.entangledLanes |= 2; r;) {
                    var f = 1 << 31 - Pa(r);
                    d.entanglements[1] |= f, r &= ~f;
                  }
                  xe(o), (G & 6) === 0 && (Qo = Na() + 500, qu(0, !1));
                }
              }
              break;
            case 31:
            case 13:
              d = Ht(o, 2), d !== null && za(d, o, 2), vr(), Ss(o, 2);
          }
          if (o = Af(l), o === null && Td(a, e, l, rr, t), o === u) break;
          u = o;
        }
        u !== null && l.stopPropagation();
      } else Td(a, e, l, null, t);
    }
  }
  function Af(a) {
    return a = Uf(a), ys(a);
  }
  var rr = null;
  function ys(a) {
    if (rr = null, a = el(a), a !== null) {
      var e = ku(a);
      if (e === null) a = null;else {
        var t = e.tag;
        if (t === 13) {
          if (a = Fn(e), a !== null) return a;
          a = null;
        } else if (t === 31) {
          if (a = Gn(e), a !== null) return a;
          a = null;
        } else if (t === 3) {
          if (e.stateNode.current.memoizedState.isDehydrated) return e.tag === 3 ? e.stateNode.containerInfo : null;
          a = null;
        } else e !== a && (a = null);
      }
    }
    return rr = a, null;
  }
  function Sm(a) {
    switch (a) {
      case "beforetoggle":
      case "cancel":
      case "click":
      case "close":
      case "contextmenu":
      case "copy":
      case "cut":
      case "auxclick":
      case "dblclick":
      case "dragend":
      case "dragstart":
      case "drop":
      case "focusin":
      case "focusout":
      case "input":
      case "invalid":
      case "keydown":
      case "keypress":
      case "keyup":
      case "mousedown":
      case "mouseup":
      case "paste":
      case "pause":
      case "play":
      case "pointercancel":
      case "pointerdown":
      case "pointerup":
      case "ratechange":
      case "reset":
      case "resize":
      case "seeked":
      case "submit":
      case "toggle":
      case "touchcancel":
      case "touchend":
      case "touchstart":
      case "volumechange":
      case "change":
      case "selectionchange":
      case "textInput":
      case "compositionstart":
      case "compositionend":
      case "compositionupdate":
      case "beforeblur":
      case "afterblur":
      case "beforeinput":
      case "blur":
      case "fullscreenchange":
      case "focus":
      case "hashchange":
      case "popstate":
      case "select":
      case "selectstart":
        return 2;
      case "drag":
      case "dragenter":
      case "dragexit":
      case "dragleave":
      case "dragover":
      case "mousemove":
      case "mouseout":
      case "mouseover":
      case "pointermove":
      case "pointerout":
      case "pointerover":
      case "scroll":
      case "touchmove":
      case "wheel":
      case "mouseenter":
      case "mouseleave":
      case "pointerenter":
      case "pointerleave":
        return 8;
      case "message":
        switch (jg()) {
          case Vn:
            return 2;
          case Xn:
            return 8;
          case Uo:
          case Qg:
            return 32;
          case Zn:
            return 268435456;
          default:
            return 32;
        }
      default:
        return 32;
    }
  }
  var kf = !1,
    ft = null,
    st = null,
    it = null,
    wu = new Map(),
    Au = new Map(),
    Ke = [],
    dL = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");
  function On(a, e) {
    switch (a) {
      case "focusin":
      case "focusout":
        ft = null;
        break;
      case "dragenter":
      case "dragleave":
        st = null;
        break;
      case "mouseover":
      case "mouseout":
        it = null;
        break;
      case "pointerover":
      case "pointerout":
        wu.delete(e.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        Au.delete(e.pointerId);
    }
  }
  function Yl(a, e, t, l, u, o) {
    return a === null || a.nativeEvent !== o ? (a = {
      blockedOn: e,
      domEventName: t,
      eventSystemFlags: l,
      nativeEvent: o,
      targetContainers: [u]
    }, e !== null && (e = Dl(e), e !== null && vm(e)), a) : (a.eventSystemFlags |= l, e = a.targetContainers, u !== null && e.indexOf(u) === -1 && e.push(u), a);
  }
  function fL(a, e, t, l, u) {
    switch (e) {
      case "focusin":
        return ft = Yl(ft, a, e, t, l, u), !0;
      case "dragenter":
        return st = Yl(st, a, e, t, l, u), !0;
      case "mouseover":
        return it = Yl(it, a, e, t, l, u), !0;
      case "pointerover":
        var o = u.pointerId;
        return wu.set(o, Yl(wu.get(o) || null, a, e, t, l, u)), !0;
      case "gotpointercapture":
        return o = u.pointerId, Au.set(o, Yl(Au.get(o) || null, a, e, t, l, u)), !0;
    }
    return !1;
  }
  function bm(a) {
    var e = el(a.target);
    if (e !== null) {
      var t = ku(e);
      if (t !== null) {
        if (e = t.tag, e === 13) {
          if (e = Fn(t), e !== null) {
            a.blockedOn = e, gi(a.priority, function () {
              Rn(t);
            });
            return;
          }
        } else if (e === 31) {
          if (e = Gn(t), e !== null) {
            a.blockedOn = e, gi(a.priority, function () {
              Rn(t);
            });
            return;
          }
        } else if (e === 3 && t.stateNode.current.memoizedState.isDehydrated) {
          a.blockedOn = t.tag === 3 ? t.stateNode.containerInfo : null;
          return;
        }
      }
    }
    a.blockedOn = null;
  }
  function Bo(a) {
    if (a.blockedOn !== null) return !1;
    for (var e = a.targetContainers; 0 < e.length;) {
      var t = Af(a.nativeEvent);
      if (t === null) {
        t = a.nativeEvent;
        var l = new t.constructor(t.type, t);
        Vd = l, t.target.dispatchEvent(l), Vd = null;
      } else return e = Dl(t), e !== null && vm(e), a.blockedOn = t, !1;
      e.shift();
    }
    return !0;
  }
  function zn(a, e, t) {
    Bo(a) && t.delete(e);
  }
  function sL() {
    kf = !1, ft !== null && Bo(ft) && (ft = null), st !== null && Bo(st) && (st = null), it !== null && Bo(it) && (it = null), wu.forEach(zn), Au.forEach(zn);
  }
  function go(a, e) {
    a.blockedOn === e && (a.blockedOn = null, kf || (kf = !0, na.unstable_scheduleCallback(na.unstable_NormalPriority, sL)));
  }
  var ho = null;
  function Un(a) {
    ho !== a && (ho = a, na.unstable_scheduleCallback(na.unstable_NormalPriority, function () {
      ho === a && (ho = null);
      for (var e = 0; e < a.length; e += 3) {
        var t = a[e],
          l = a[e + 1],
          u = a[e + 2];
        if (typeof l != "function") {
          if (ys(l || t) === null) continue;
          break;
        }
        var o = Dl(t);
        o !== null && (a.splice(e, 3), e -= 3, rf(o, {
          pending: !0,
          data: u,
          method: t.method,
          action: l
        }, l, u));
      }
    }));
  }
  function Ml(a) {
    function e(f) {
      return go(f, a);
    }
    ft !== null && go(ft, a), st !== null && go(st, a), it !== null && go(it, a), wu.forEach(e), Au.forEach(e);
    for (var t = 0; t < Ke.length; t++) {
      var l = Ke[t];
      l.blockedOn === a && (l.blockedOn = null);
    }
    for (; 0 < Ke.length && (t = Ke[0], t.blockedOn === null);) bm(t), t.blockedOn === null && Ke.shift();
    if (t = (a.ownerDocument || a).$$reactFormReplay, t != null) for (l = 0; l < t.length; l += 3) {
      var u = t[l],
        o = t[l + 1],
        r = u[Ua] || null;
      if (typeof o == "function") r || Un(t);else if (r) {
        var d = null;
        if (o && o.hasAttribute("formAction")) {
          if (u = o, r = o[Ua] || null) d = r.formAction;else if (ys(u) !== null) continue;
        } else d = r.action;
        typeof d == "function" ? t[l + 1] = d : (t.splice(l, 3), l -= 3), Un(t);
      }
    }
  }
  function ym() {
    function a(o) {
      o.canIntercept && o.info === "react-transition" && o.intercept({
        handler: function () {
          return new Promise(function (r) {
            return u = r;
          });
        },
        focusReset: "manual",
        scroll: "manual"
      });
    }
    function e() {
      u !== null && (u(), u = null), l || setTimeout(t, 20);
    }
    function t() {
      if (!l && !navigation.transition) {
        var o = navigation.currentEntry;
        o && o.url != null && navigation.navigate(o.url, {
          state: o.getState(),
          info: "react-transition",
          history: "replace"
        });
      }
    }
    if (typeof navigation == "object") {
      var l = !1,
        u = null;
      return navigation.addEventListener("navigate", a), navigation.addEventListener("navigatesuccess", e), navigation.addEventListener("navigateerror", e), setTimeout(t, 100), function () {
        l = !0, navigation.removeEventListener("navigate", a), navigation.removeEventListener("navigatesuccess", e), navigation.removeEventListener("navigateerror", e), u !== null && (u(), u = null);
      };
    }
  }
  function Cs(a) {
    this._internalRoot = a;
  }
  yr.prototype.render = Cs.prototype.render = function (a) {
    var e = this._internalRoot;
    if (e === null) throw Error(L(409));
    var t = e.current,
      l = Va();
    Lm(t, l, a, e, null, null);
  };
  yr.prototype.unmount = Cs.prototype.unmount = function () {
    var a = this._internalRoot;
    if (a !== null) {
      this._internalRoot = null;
      var e = a.containerInfo;
      Lm(a.current, 2, null, a, null, null), vr(), e[Tl] = null;
    }
  };
  function yr(a) {
    this._internalRoot = a;
  }
  yr.prototype.unstable_scheduleHydration = function (a) {
    if (a) {
      var e = Wn();
      a = {
        blockedOn: null,
        target: a,
        priority: e
      };
      for (var t = 0; t < Ke.length && e !== 0 && e < Ke[t].priority; t++);
      Ke.splice(t, 0, a), t === 0 && bm(a);
    }
  };
  var qn = En.version;
  if (qn !== "19.2.8") throw Error(L(527, qn, "19.2.8"));
  N.findDOMNode = function (a) {
    var e = a._reactInternals;
    if (e === void 0) throw typeof a.render == "function" ? Error(L(188)) : (a = Object.keys(a).join(","), Error(L(268, a)));
    return a = Ng(e), a = a !== null ? Nn(a) : null, a = a === null ? null : a.stateNode, a;
  };
  var iL = {
    bundleType: 0,
    version: "19.2.8",
    rendererPackageName: "react-dom",
    currentDispatcherRef: D,
    reconcilerVersion: "19.2.8"
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && (jl = __REACT_DEVTOOLS_GLOBAL_HOOK__, !jl.isDisabled && jl.supportsFiber)) try {
    Mu = jl.inject(iL), _a = jl;
  } catch {}
  var jl;
  Cr.createRoot = function (a, e) {
    if (!Hn(a)) throw Error(L(299));
    var t = !1,
      l = "",
      u = pp,
      o = mp,
      r = gp;
    return e != null && (e.unstable_strictMode === !0 && (t = !0), e.identifierPrefix !== void 0 && (l = e.identifierPrefix), e.onUncaughtError !== void 0 && (u = e.onUncaughtError), e.onCaughtError !== void 0 && (o = e.onCaughtError), e.onRecoverableError !== void 0 && (r = e.onRecoverableError)), e = hm(a, 1, !1, null, null, t, l, null, u, o, r, ym), a[Tl] = e.current, xs(a), new Cs(e);
  };
  Cr.hydrateRoot = function (a, e, t) {
    if (!Hn(a)) throw Error(L(299));
    var l = !1,
      u = "",
      o = pp,
      r = mp,
      d = gp,
      f = null;
    return t != null && (t.unstable_strictMode === !0 && (l = !0), t.identifierPrefix !== void 0 && (u = t.identifierPrefix), t.onUncaughtError !== void 0 && (o = t.onUncaughtError), t.onCaughtError !== void 0 && (r = t.onCaughtError), t.onRecoverableError !== void 0 && (d = t.onRecoverableError), t.formState !== void 0 && (f = t.formState)), e = hm(a, 1, !0, e, t ?? null, l, u, f, o, r, d, ym), e.context = xm(null), t = e.current, l = Va(), l = Bf(l), u = ut(l), u.callback = null, ot(t, u, l), t = l, e.current.lanes = t, Du(e, t), xe(e), a[Tl] = e.current, xs(a), new yr(e);
  };
  Cr.version = "19.2.8";
});
var Am = ie((xv, wm) => {
  "use strict";

  function Im() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function")) try {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(Im);
    } catch (a) {
      console.error(a);
    }
  }
  Im(), wm.exports = Cm();
});
var Qm = ie(kr => {
  "use strict";

  var ev = Symbol.for("react.transitional.element"),
    tv = Symbol.for("react.fragment");
  function jm(a, e, t) {
    var l = null;
    if (t !== void 0 && (l = "" + t), e.key !== void 0 && (l = "" + e.key), "key" in e) {
      t = {};
      for (var u in e) u !== "key" && (t[u] = e[u]);
    } else t = e;
    return e = t.ref, {
      $$typeof: ev,
      type: a,
      key: l,
      ref: e !== void 0 ? e : null,
      props: t
    };
  }
  kr.Fragment = tv;
  kr.jsx = jm;
  kr.jsxs = jm;
});
var Ya = ie((Av, Km) => {
  "use strict";

  Km.exports = Qm();
});
// ReactDOMClient (minified: cg) — ──── Library: clsx (bundled from npm; unchanged, names left minified) ────
// ReactDOMClient (minified: cg) — react-dom/client (createRoot), used to mount the board.
var ReactDOMClient = sa(Am());
// React (minified: Ca) — The React namespace used by the Tickets board (hooks).
var React = sa(Se());
// ReactForInput (minified: Wm) — React namespace used by Input (forwardRef).
var ReactForInput = sa(Se());
function km(a) {
  var e,
    t,
    l = "";
  if (typeof a == "string" || typeof a == "number") l += a;else if (typeof a == "object") if (Array.isArray(a)) {
    var u = a.length;
    for (e = 0; e < u; e++) a[e] && (t = km(a[e])) && (l && (l += " "), l += t);
  } else for (t in a) a[t] && (l && (l += " "), l += t);
  return l;
}
function clsx() {
  for (var a, e, t = 0, l = "", u = arguments.length; t < u; t++) (a = arguments[t]) && (e = km(a)) && (l && (l += " "), l += e);
  return l;
}
// ──── Library: tailwind-merge (incl. twMerge = createTailwindMerge(getDefaultConfig)) (bundled from npm; unchanged, names left minified) ────
var nL = (a, e) => {
    let t = new Array(a.length + e.length);
    for (let l = 0; l < a.length; l++) t[l] = a[l];
    for (let l = 0; l < e.length; l++) t[a.length + l] = e[l];
    return t;
  },
  cL = (a, e) => ({
    classGroupId: a,
    validator: e
  }),
  Om = (a = new Map(), e = null, t) => ({
    nextPart: a,
    validators: e,
    classGroupId: t
  });
var Mm = [],
  pL = "arbitrary..",
  mL = a => {
    let e = hL(a),
      {
        conflictingClassGroups: t,
        conflictingClassGroupModifiers: l
      } = a;
    return {
      getClassGroupId: r => {
        if (r.startsWith("[") && r.endsWith("]")) return gL(r);
        let d = r.split("-"),
          f = d[0] === "" && d.length > 1 ? 1 : 0;
        return zm(d, f, e);
      },
      getConflictingClassGroupIds: (r, d) => {
        if (d) {
          let f = l[r],
            s = t[r];
          return f ? s ? nL(s, f) : f : s || Mm;
        }
        return t[r] || Mm;
      }
    };
  },
  zm = (a, e, t) => {
    if (a.length - e === 0) return t.classGroupId;
    let u = a[e],
      o = t.nextPart.get(u);
    if (o) {
      let s = zm(a, e + 1, o);
      if (s) return s;
    }
    let r = t.validators;
    if (r === null) return;
    let d = e === 0 ? a.join("-") : a.slice(e).join("-"),
      f = r.length;
    for (let s = 0; s < f; s++) {
      let g = r[s];
      if (g.validator(d)) return g.classGroupId;
    }
  },
  gL = a => a.slice(1, -1).indexOf(":") === -1 ? void 0 : (() => {
    let e = a.slice(1, -1),
      t = e.indexOf(":"),
      l = e.slice(0, t);
    return l ? pL + l : void 0;
  })(),
  hL = a => {
    let {
      theme: e,
      classGroups: t
    } = a;
    return xL(t, e);
  },
  xL = (a, e) => {
    let t = Om();
    for (let l in a) {
      let u = a[l];
      ws(u, t, l, e);
    }
    return t;
  },
  ws = (a, e, t, l) => {
    let u = a.length;
    for (let o = 0; o < u; o++) {
      let r = a[o];
      LL(r, e, t, l);
    }
  },
  LL = (a, e, t, l) => {
    if (typeof a == "string") {
      vL(a, e, t);
      return;
    }
    if (typeof a == "function") {
      SL(a, e, t, l);
      return;
    }
    bL(a, e, t, l);
  },
  vL = (a, e, t) => {
    let l = a === "" ? e : Um(e, a);
    l.classGroupId = t;
  },
  SL = (a, e, t, l) => {
    if (yL(a)) {
      ws(a(l), e, t, l);
      return;
    }
    e.validators === null && (e.validators = []), e.validators.push(cL(t, a));
  },
  bL = (a, e, t, l) => {
    let u = Object.entries(a),
      o = u.length;
    for (let r = 0; r < o; r++) {
      let [d, f] = u[r];
      ws(f, Um(e, d), t, l);
    }
  },
  Um = (a, e) => {
    let t = a,
      l = e.split("-"),
      u = l.length;
    for (let o = 0; o < u; o++) {
      let r = l[o],
        d = t.nextPart.get(r);
      d || (d = Om(), t.nextPart.set(r, d)), t = d;
    }
    return t;
  },
  yL = a => "isThemeGetter" in a && a.isThemeGetter === !0,
  CL = a => {
    if (a < 1) return {
      get: () => {},
      set: () => {}
    };
    let e = 0,
      t = Object.create(null),
      l = Object.create(null),
      u = (o, r) => {
        t[o] = r, e++, e > a && (e = 0, l = t, t = Object.create(null));
      };
    return {
      get(o) {
        let r = t[o];
        if (r !== void 0) return r;
        if ((r = l[o]) !== void 0) return u(o, r), r;
      },
      set(o, r) {
        o in t ? t[o] = r : u(o, r);
      }
    };
  };
var IL = [],
  Tm = (a, e, t, l, u) => ({
    modifiers: a,
    hasImportantModifier: e,
    baseClassName: t,
    maybePostfixModifierPosition: l,
    isExternal: u
  }),
  wL = a => {
    let {
        prefix: e,
        experimentalParseClassName: t
      } = a,
      l = u => {
        let o = [],
          r = 0,
          d = 0,
          f = 0,
          s,
          g = u.length;
        for (let y = 0; y < g; y++) {
          let T = u[y];
          if (r === 0 && d === 0) {
            if (T === ":") {
              o.push(u.slice(f, y)), f = y + 1;
              continue;
            }
            if (T === "/") {
              s = y;
              continue;
            }
          }
          T === "[" ? r++ : T === "]" ? r-- : T === "(" ? d++ : T === ")" && d--;
        }
        let h = o.length === 0 ? u : u.slice(f),
          c = h,
          m = !1;
        h.endsWith("!") ? (c = h.slice(0, -1), m = !0) : h.startsWith("!") && (c = h.slice(1), m = !0);
        let b = s && s > f ? s - f : void 0;
        return Tm(o, m, c, b);
      };
    if (e) {
      let u = e + ":",
        o = l;
      l = r => r.startsWith(u) ? o(r.slice(u.length)) : Tm(IL, !1, r, void 0, !0);
    }
    if (t) {
      let u = l;
      l = o => t({
        className: o,
        parseClassName: u
      });
    }
    return l;
  },
  AL = a => {
    let e = new Map();
    return a.orderSensitiveModifiers.forEach((t, l) => {
      e.set(t, 1e6 + l);
    }), t => {
      let l = [],
        u = [];
      for (let o = 0; o < t.length; o++) {
        let r = t[o],
          d = r[0] === "[",
          f = e.has(r);
        d || f ? (u.length > 0 && (u.sort(), l.push(...u), u = []), l.push(r)) : u.push(r);
      }
      return u.length > 0 && (u.sort(), l.push(...u)), l;
    };
  },
  kL = a => ({
    cache: CL(a.cacheSize),
    parseClassName: wL(a),
    sortModifiers: AL(a),
    postfixLookupClassGroupIds: ML(a),
    ...mL(a)
  }),
  ML = a => {
    let e = Object.create(null),
      t = a.postfixLookupClassGroups;
    if (t) for (let l = 0; l < t.length; l++) e[t[l]] = !0;
    return e;
  },
  TL = /\s+/,
  DL = (a, e) => {
    let {
        parseClassName: t,
        getClassGroupId: l,
        getConflictingClassGroupIds: u,
        sortModifiers: o,
        postfixLookupClassGroupIds: r
      } = e,
      d = [],
      f = a.trim().split(TL),
      s = "";
    for (let g = f.length - 1; g >= 0; g -= 1) {
      let h = f[g],
        {
          isExternal: c,
          modifiers: m,
          hasImportantModifier: b,
          baseClassName: y,
          maybePostfixModifierPosition: T
        } = t(h);
      if (c) {
        s = h + (s.length > 0 ? " " + s : s);
        continue;
      }
      let n = !!T,
        i;
      if (n) {
        let C = y.substring(0, T);
        i = l(C);
        let v = i && r[i] ? l(y) : void 0;
        v && v !== i && (i = v, n = !1);
      } else i = l(y);
      if (!i) {
        if (!n) {
          s = h + (s.length > 0 ? " " + s : s);
          continue;
        }
        if (i = l(y), !i) {
          s = h + (s.length > 0 ? " " + s : s);
          continue;
        }
        n = !1;
      }
      let p = m.length === 0 ? "" : m.length === 1 ? m[0] : o(m).join(":"),
        x = b ? p + "!" : p,
        A = x + i;
      if (d.indexOf(A) > -1) continue;
      d.push(A);
      let z = u(i, n);
      for (let C = 0; C < z.length; ++C) {
        let v = z[C];
        d.push(x + v);
      }
      s = h + (s.length > 0 ? " " + s : s);
    }
    return s;
  },
  BL = (...a) => {
    let e = 0,
      t,
      l,
      u = "";
    for (; e < a.length;) (t = a[e++]) && (l = qm(t)) && (u && (u += " "), u += l);
    return u;
  },
  qm = a => {
    if (typeof a == "string") return a;
    let e,
      t = "";
    for (let l = 0; l < a.length; l++) a[l] && (e = qm(a[l])) && (t && (t += " "), t += e);
    return t;
  },
  RL = (a, ...e) => {
    let t,
      l,
      u,
      o,
      r = f => {
        let s = e.reduce((g, h) => h(g), a());
        return t = kL(s), l = t.cache.get, u = t.cache.set, o = d, d(f);
      },
      d = f => {
        let s = l(f);
        if (s) return s;
        let g = DL(f, t);
        return u(f, g), g;
      };
    return o = r, (...f) => o(BL(...f));
  },
  OL = [],
  ca = a => {
    let e = t => t[a] || OL;
    return e.isThemeGetter = !0, e;
  },
  Em = /^\[(?:(\w[\w-]*):)?(.+)\]$/i,
  Hm = /^\((?:(\w[\w-]*):)?(.+)\)$/i,
  zL = /^\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/,
  UL = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/,
  qL = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/,
  EL = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/,
  HL = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/,
  FL = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/,
  xt = a => zL.test(a),
  U = a => !!a && !Number.isNaN(Number(a)),
  Le = a => !!a && Number.isInteger(Number(a)),
  Is = a => a.endsWith("%") && U(a.slice(0, -1)),
  Ge = a => UL.test(a),
  Fm = () => !0,
  GL = a => qL.test(a) && !EL.test(a),
  As = () => !1,
  NL = a => HL.test(a),
  _L = a => FL.test(a),
  PL = a => !I(a) && !w(a),
  VL = a => a.startsWith("@container") && (a[10] === "/" && a[11] !== void 0 || a[11] === "s" && a[16] !== void 0 && a.startsWith("-size/", 10) || a[11] === "n" && a[18] !== void 0 && a.startsWith("-normal/", 10)),
  XL = a => Lt(a, _m, As),
  I = a => Em.test(a),
  Gt = a => Lt(a, Pm, GL),
  Dm = a => Lt(a, $L, U),
  ZL = a => Lt(a, Xm, Fm),
  YL = a => Lt(a, Vm, As),
  Bm = a => Lt(a, Gm, As),
  jL = a => Lt(a, Nm, _L),
  wr = a => Lt(a, Zm, NL),
  w = a => Hm.test(a),
  Fu = a => Nt(a, Pm),
  QL = a => Nt(a, Vm),
  Rm = a => Nt(a, Gm),
  KL = a => Nt(a, _m),
  WL = a => Nt(a, Nm),
  Ar = a => Nt(a, Zm, !0),
  JL = a => Nt(a, Xm, !0),
  Lt = (a, e, t) => {
    let l = Em.exec(a);
    return l ? l[1] ? e(l[1]) : t(l[2]) : !1;
  },
  Nt = (a, e, t = !1) => {
    let l = Hm.exec(a);
    return l ? l[1] ? e(l[1]) : t : !1;
  },
  Gm = a => a === "position" || a === "percentage",
  Nm = a => a === "image" || a === "url",
  _m = a => a === "length" || a === "size" || a === "bg-size",
  Pm = a => a === "length",
  $L = a => a === "number",
  Vm = a => a === "family-name",
  Xm = a => a === "number" || a === "weight",
  Zm = a => a === "shadow";
var av = () => {
  let a = ca("color"),
    e = ca("font"),
    t = ca("text"),
    l = ca("font-weight"),
    u = ca("tracking"),
    o = ca("leading"),
    r = ca("breakpoint"),
    d = ca("container"),
    f = ca("spacing"),
    s = ca("radius"),
    g = ca("shadow"),
    h = ca("inset-shadow"),
    c = ca("text-shadow"),
    m = ca("drop-shadow"),
    b = ca("blur"),
    y = ca("perspective"),
    T = ca("aspect"),
    n = ca("ease"),
    i = ca("animate"),
    p = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"],
    x = () => ["center", "top", "bottom", "left", "right", "top-left", "left-top", "top-right", "right-top", "bottom-right", "right-bottom", "bottom-left", "left-bottom"],
    A = () => [...x(), w, I],
    z = () => ["auto", "hidden", "clip", "visible", "scroll"],
    C = () => ["auto", "contain", "none"],
    v = () => [w, I, f],
    S = () => [xt, "full", "auto", ...v()],
    k = () => [Le, "none", "subgrid", w, I],
    R = () => ["auto", {
      span: ["full", Le, w, I]
    }, Le, w, I],
    pa = () => [Le, "auto", w, I],
    _e = () => ["auto", "min", "max", "fr", w, I],
    Or = () => ["start", "end", "center", "between", "around", "evenly", "stretch", "baseline", "center-safe", "end-safe"],
    Pt = () => ["start", "end", "center", "stretch", "center-safe", "end-safe"],
    oe = () => ["auto", ...v()],
    vt = () => [xt, "auto", "full", "dvw", "dvh", "lvw", "lvh", "svw", "svh", "min", "max", "fit", ...v()],
    zr = () => [xt, "screen", "full", "dvw", "lvw", "svw", "min", "max", "fit", ...v()],
    Ur = () => [xt, "screen", "full", "lh", "dvh", "lvh", "svh", "min", "max", "fit", ...v()],
    M = () => [a, w, I],
    Ds = () => [...x(), Rm, Bm, {
      position: [w, I]
    }],
    Bs = () => ["no-repeat", {
      repeat: ["", "x", "y", "space", "round"]
    }],
    Rs = () => ["auto", "cover", "contain", KL, XL, {
      size: [w, I]
    }],
    qr = () => [Is, Fu, Gt],
    wa = () => ["", "none", "full", s, w, I],
    Aa = () => ["", U, Fu, Gt],
    Pu = () => ["solid", "dashed", "dotted", "double"],
    Os = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"],
    ma = () => [U, Is, Rm, Bm],
    zs = () => ["", "none", b, w, I],
    Vu = () => ["none", U, w, I],
    Xu = () => ["none", U, w, I],
    Er = () => [U, w, I],
    Zu = () => [xt, "full", ...v()];
  return {
    cacheSize: 500,
    theme: {
      animate: ["spin", "ping", "pulse", "bounce"],
      aspect: ["video"],
      blur: [Ge],
      breakpoint: [Ge],
      color: [Fm],
      container: [Ge],
      "drop-shadow": [Ge],
      ease: ["in", "out", "in-out"],
      font: [PL],
      "font-weight": ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black"],
      "inset-shadow": [Ge],
      leading: ["none", "tight", "snug", "normal", "relaxed", "loose"],
      perspective: ["dramatic", "near", "normal", "midrange", "distant", "none"],
      radius: [Ge],
      shadow: [Ge],
      spacing: ["px", U],
      text: [Ge],
      "text-shadow": [Ge],
      tracking: ["tighter", "tight", "normal", "wide", "wider", "widest"]
    },
    classGroups: {
      aspect: [{
        aspect: ["auto", "square", xt, I, w, T]
      }],
      container: ["container"],
      "container-type": [{
        "@container": ["", "normal", "size", w, I]
      }],
      "container-named": [VL],
      columns: [{
        columns: [U, I, w, d]
      }],
      "break-after": [{
        "break-after": p()
      }],
      "break-before": [{
        "break-before": p()
      }],
      "break-inside": [{
        "break-inside": ["auto", "avoid", "avoid-page", "avoid-column"]
      }],
      "box-decoration": [{
        "box-decoration": ["slice", "clone"]
      }],
      box: [{
        box: ["border", "content"]
      }],
      display: ["block", "inline-block", "inline", "flex", "inline-flex", "table", "inline-table", "table-caption", "table-cell", "table-column", "table-column-group", "table-footer-group", "table-header-group", "table-row-group", "table-row", "flow-root", "grid", "inline-grid", "contents", "list-item", "hidden"],
      sr: ["sr-only", "not-sr-only"],
      float: [{
        float: ["right", "left", "none", "start", "end"]
      }],
      clear: [{
        clear: ["left", "right", "both", "none", "start", "end"]
      }],
      isolation: ["isolate", "isolation-auto"],
      "object-fit": [{
        object: ["contain", "cover", "fill", "none", "scale-down"]
      }],
      "object-position": [{
        object: A()
      }],
      overflow: [{
        overflow: z()
      }],
      "overflow-x": [{
        "overflow-x": z()
      }],
      "overflow-y": [{
        "overflow-y": z()
      }],
      overscroll: [{
        overscroll: C()
      }],
      "overscroll-x": [{
        "overscroll-x": C()
      }],
      "overscroll-y": [{
        "overscroll-y": C()
      }],
      position: ["static", "fixed", "absolute", "relative", "sticky"],
      inset: [{
        inset: S()
      }],
      "inset-x": [{
        "inset-x": S()
      }],
      "inset-y": [{
        "inset-y": S()
      }],
      start: [{
        "inset-s": S(),
        start: S()
      }],
      end: [{
        "inset-e": S(),
        end: S()
      }],
      "inset-bs": [{
        "inset-bs": S()
      }],
      "inset-be": [{
        "inset-be": S()
      }],
      top: [{
        top: S()
      }],
      right: [{
        right: S()
      }],
      bottom: [{
        bottom: S()
      }],
      left: [{
        left: S()
      }],
      visibility: ["visible", "invisible", "collapse"],
      z: [{
        z: [Le, "auto", w, I]
      }],
      basis: [{
        basis: [xt, "full", "auto", d, ...v()]
      }],
      "flex-direction": [{
        flex: ["row", "row-reverse", "col", "col-reverse"]
      }],
      "flex-wrap": [{
        flex: ["nowrap", "wrap", "wrap-reverse"]
      }],
      flex: [{
        flex: [U, xt, "auto", "initial", "none", I]
      }],
      grow: [{
        grow: ["", U, w, I]
      }],
      shrink: [{
        shrink: ["", U, w, I]
      }],
      order: [{
        order: [Le, "first", "last", "none", w, I]
      }],
      "grid-cols": [{
        "grid-cols": k()
      }],
      "col-start-end": [{
        col: R()
      }],
      "col-start": [{
        "col-start": pa()
      }],
      "col-end": [{
        "col-end": pa()
      }],
      "grid-rows": [{
        "grid-rows": k()
      }],
      "row-start-end": [{
        row: R()
      }],
      "row-start": [{
        "row-start": pa()
      }],
      "row-end": [{
        "row-end": pa()
      }],
      "grid-flow": [{
        "grid-flow": ["row", "col", "dense", "row-dense", "col-dense"]
      }],
      "auto-cols": [{
        "auto-cols": _e()
      }],
      "auto-rows": [{
        "auto-rows": _e()
      }],
      gap: [{
        gap: v()
      }],
      "gap-x": [{
        "gap-x": v()
      }],
      "gap-y": [{
        "gap-y": v()
      }],
      "justify-content": [{
        justify: [...Or(), "normal"]
      }],
      "justify-items": [{
        "justify-items": [...Pt(), "normal"]
      }],
      "justify-self": [{
        "justify-self": ["auto", ...Pt()]
      }],
      "align-content": [{
        content: ["normal", ...Or()]
      }],
      "align-items": [{
        items: [...Pt(), {
          baseline: ["", "last"]
        }]
      }],
      "align-self": [{
        self: ["auto", ...Pt(), {
          baseline: ["", "last"]
        }]
      }],
      "place-content": [{
        "place-content": Or()
      }],
      "place-items": [{
        "place-items": [...Pt(), "baseline"]
      }],
      "place-self": [{
        "place-self": ["auto", ...Pt()]
      }],
      p: [{
        p: v()
      }],
      px: [{
        px: v()
      }],
      py: [{
        py: v()
      }],
      ps: [{
        ps: v()
      }],
      pe: [{
        pe: v()
      }],
      pbs: [{
        pbs: v()
      }],
      pbe: [{
        pbe: v()
      }],
      pt: [{
        pt: v()
      }],
      pr: [{
        pr: v()
      }],
      pb: [{
        pb: v()
      }],
      pl: [{
        pl: v()
      }],
      m: [{
        m: oe()
      }],
      mx: [{
        mx: oe()
      }],
      my: [{
        my: oe()
      }],
      ms: [{
        ms: oe()
      }],
      me: [{
        me: oe()
      }],
      mbs: [{
        mbs: oe()
      }],
      mbe: [{
        mbe: oe()
      }],
      mt: [{
        mt: oe()
      }],
      mr: [{
        mr: oe()
      }],
      mb: [{
        mb: oe()
      }],
      ml: [{
        ml: oe()
      }],
      "space-x": [{
        "space-x": v()
      }],
      "space-x-reverse": ["space-x-reverse"],
      "space-y": [{
        "space-y": v()
      }],
      "space-y-reverse": ["space-y-reverse"],
      size: [{
        size: vt()
      }],
      "inline-size": [{
        inline: ["auto", ...zr()]
      }],
      "min-inline-size": [{
        "min-inline": ["auto", ...zr()]
      }],
      "max-inline-size": [{
        "max-inline": ["none", ...zr()]
      }],
      "block-size": [{
        block: ["auto", ...Ur()]
      }],
      "min-block-size": [{
        "min-block": ["auto", ...Ur()]
      }],
      "max-block-size": [{
        "max-block": ["none", ...Ur()]
      }],
      w: [{
        w: [d, "screen", ...vt()]
      }],
      "min-w": [{
        "min-w": [d, "screen", "none", ...vt()]
      }],
      "max-w": [{
        "max-w": [d, "screen", "none", "prose", {
          screen: [r]
        }, ...vt()]
      }],
      h: [{
        h: ["screen", "lh", ...vt()]
      }],
      "min-h": [{
        "min-h": ["screen", "lh", "none", ...vt()]
      }],
      "max-h": [{
        "max-h": ["screen", "lh", ...vt()]
      }],
      "font-size": [{
        text: ["base", t, Fu, Gt]
      }],
      "font-smoothing": ["antialiased", "subpixel-antialiased"],
      "font-style": ["italic", "not-italic"],
      "font-weight": [{
        font: [l, JL, ZL]
      }],
      "font-stretch": [{
        "font-stretch": ["ultra-condensed", "extra-condensed", "condensed", "semi-condensed", "normal", "semi-expanded", "expanded", "extra-expanded", "ultra-expanded", Is, I]
      }],
      "font-family": [{
        font: [QL, YL, e]
      }],
      "font-features": [{
        "font-features": [I]
      }],
      "fvn-normal": ["normal-nums"],
      "fvn-ordinal": ["ordinal"],
      "fvn-slashed-zero": ["slashed-zero"],
      "fvn-figure": ["lining-nums", "oldstyle-nums"],
      "fvn-spacing": ["proportional-nums", "tabular-nums"],
      "fvn-fraction": ["diagonal-fractions", "stacked-fractions"],
      tracking: [{
        tracking: [u, w, I]
      }],
      "line-clamp": [{
        "line-clamp": [U, "none", w, Dm]
      }],
      leading: [{
        leading: [o, ...v()]
      }],
      "list-image": [{
        "list-image": ["none", w, I]
      }],
      "list-style-position": [{
        list: ["inside", "outside"]
      }],
      "list-style-type": [{
        list: ["disc", "decimal", "none", w, I]
      }],
      "text-alignment": [{
        text: ["left", "center", "right", "justify", "start", "end"]
      }],
      "placeholder-color": [{
        placeholder: M()
      }],
      "text-color": [{
        text: M()
      }],
      "text-decoration": ["underline", "overline", "line-through", "no-underline"],
      "text-decoration-style": [{
        decoration: [...Pu(), "wavy"]
      }],
      "text-decoration-thickness": [{
        decoration: [U, "from-font", "auto", w, Gt]
      }],
      "text-decoration-color": [{
        decoration: M()
      }],
      "underline-offset": [{
        "underline-offset": [U, "auto", w, I]
      }],
      "text-transform": ["uppercase", "lowercase", "capitalize", "normal-case"],
      "text-overflow": ["truncate", "text-ellipsis", "text-clip"],
      "text-wrap": [{
        text: ["wrap", "nowrap", "balance", "pretty"]
      }],
      indent: [{
        indent: v()
      }],
      "tab-size": [{
        tab: [Le, w, I]
      }],
      "vertical-align": [{
        align: ["baseline", "top", "middle", "bottom", "text-top", "text-bottom", "sub", "super", w, I]
      }],
      whitespace: [{
        whitespace: ["normal", "nowrap", "pre", "pre-line", "pre-wrap", "break-spaces"]
      }],
      break: [{
        break: ["normal", "words", "all", "keep"]
      }],
      wrap: [{
        wrap: ["break-word", "anywhere", "normal"]
      }],
      hyphens: [{
        hyphens: ["none", "manual", "auto"]
      }],
      content: [{
        content: ["none", w, I]
      }],
      "bg-attachment": [{
        bg: ["fixed", "local", "scroll"]
      }],
      "bg-clip": [{
        "bg-clip": ["border", "padding", "content", "text"]
      }],
      "bg-origin": [{
        "bg-origin": ["border", "padding", "content"]
      }],
      "bg-position": [{
        bg: Ds()
      }],
      "bg-repeat": [{
        bg: Bs()
      }],
      "bg-size": [{
        bg: Rs()
      }],
      "bg-image": [{
        bg: ["none", {
          linear: [{
            to: ["t", "tr", "r", "br", "b", "bl", "l", "tl"]
          }, Le, w, I],
          radial: ["", w, I],
          conic: [Le, w, I]
        }, WL, jL]
      }],
      "bg-color": [{
        bg: M()
      }],
      "gradient-from-pos": [{
        from: qr()
      }],
      "gradient-via-pos": [{
        via: qr()
      }],
      "gradient-to-pos": [{
        to: qr()
      }],
      "gradient-from": [{
        from: M()
      }],
      "gradient-via": [{
        via: M()
      }],
      "gradient-to": [{
        to: M()
      }],
      rounded: [{
        rounded: wa()
      }],
      "rounded-s": [{
        "rounded-s": wa()
      }],
      "rounded-e": [{
        "rounded-e": wa()
      }],
      "rounded-t": [{
        "rounded-t": wa()
      }],
      "rounded-r": [{
        "rounded-r": wa()
      }],
      "rounded-b": [{
        "rounded-b": wa()
      }],
      "rounded-l": [{
        "rounded-l": wa()
      }],
      "rounded-ss": [{
        "rounded-ss": wa()
      }],
      "rounded-se": [{
        "rounded-se": wa()
      }],
      "rounded-ee": [{
        "rounded-ee": wa()
      }],
      "rounded-es": [{
        "rounded-es": wa()
      }],
      "rounded-tl": [{
        "rounded-tl": wa()
      }],
      "rounded-tr": [{
        "rounded-tr": wa()
      }],
      "rounded-br": [{
        "rounded-br": wa()
      }],
      "rounded-bl": [{
        "rounded-bl": wa()
      }],
      "border-w": [{
        border: Aa()
      }],
      "border-w-x": [{
        "border-x": Aa()
      }],
      "border-w-y": [{
        "border-y": Aa()
      }],
      "border-w-s": [{
        "border-s": Aa()
      }],
      "border-w-e": [{
        "border-e": Aa()
      }],
      "border-w-bs": [{
        "border-bs": Aa()
      }],
      "border-w-be": [{
        "border-be": Aa()
      }],
      "border-w-t": [{
        "border-t": Aa()
      }],
      "border-w-r": [{
        "border-r": Aa()
      }],
      "border-w-b": [{
        "border-b": Aa()
      }],
      "border-w-l": [{
        "border-l": Aa()
      }],
      "divide-x": [{
        "divide-x": Aa()
      }],
      "divide-x-reverse": ["divide-x-reverse"],
      "divide-y": [{
        "divide-y": Aa()
      }],
      "divide-y-reverse": ["divide-y-reverse"],
      "border-style": [{
        border: [...Pu(), "hidden", "none"]
      }],
      "divide-style": [{
        divide: [...Pu(), "hidden", "none"]
      }],
      "border-color": [{
        border: M()
      }],
      "border-color-x": [{
        "border-x": M()
      }],
      "border-color-y": [{
        "border-y": M()
      }],
      "border-color-s": [{
        "border-s": M()
      }],
      "border-color-e": [{
        "border-e": M()
      }],
      "border-color-bs": [{
        "border-bs": M()
      }],
      "border-color-be": [{
        "border-be": M()
      }],
      "border-color-t": [{
        "border-t": M()
      }],
      "border-color-r": [{
        "border-r": M()
      }],
      "border-color-b": [{
        "border-b": M()
      }],
      "border-color-l": [{
        "border-l": M()
      }],
      "divide-color": [{
        divide: M()
      }],
      "outline-style": [{
        outline: [...Pu(), "none", "hidden"]
      }],
      "outline-offset": [{
        "outline-offset": [U, w, I]
      }],
      "outline-w": [{
        outline: ["", U, Fu, Gt]
      }],
      "outline-color": [{
        outline: M()
      }],
      shadow: [{
        shadow: ["", "none", g, Ar, wr]
      }],
      "shadow-color": [{
        shadow: M()
      }],
      "inset-shadow": [{
        "inset-shadow": ["none", h, Ar, wr]
      }],
      "inset-shadow-color": [{
        "inset-shadow": M()
      }],
      "ring-w": [{
        ring: Aa()
      }],
      "ring-w-inset": ["ring-inset"],
      "ring-color": [{
        ring: M()
      }],
      "ring-offset-w": [{
        "ring-offset": [U, Gt]
      }],
      "ring-offset-color": [{
        "ring-offset": M()
      }],
      "inset-ring-w": [{
        "inset-ring": Aa()
      }],
      "inset-ring-color": [{
        "inset-ring": M()
      }],
      "text-shadow": [{
        "text-shadow": ["none", c, Ar, wr]
      }],
      "text-shadow-color": [{
        "text-shadow": M()
      }],
      opacity: [{
        opacity: [U, w, I]
      }],
      "mix-blend": [{
        "mix-blend": [...Os(), "plus-darker", "plus-lighter"]
      }],
      "bg-blend": [{
        "bg-blend": Os()
      }],
      "mask-clip": [{
        "mask-clip": ["border", "padding", "content", "fill", "stroke", "view"]
      }, "mask-no-clip"],
      "mask-composite": [{
        mask: ["add", "subtract", "intersect", "exclude"]
      }],
      "mask-image-linear-pos": [{
        "mask-linear": [U]
      }],
      "mask-image-linear-from-pos": [{
        "mask-linear-from": ma()
      }],
      "mask-image-linear-to-pos": [{
        "mask-linear-to": ma()
      }],
      "mask-image-linear-from-color": [{
        "mask-linear-from": M()
      }],
      "mask-image-linear-to-color": [{
        "mask-linear-to": M()
      }],
      "mask-image-t-from-pos": [{
        "mask-t-from": ma()
      }],
      "mask-image-t-to-pos": [{
        "mask-t-to": ma()
      }],
      "mask-image-t-from-color": [{
        "mask-t-from": M()
      }],
      "mask-image-t-to-color": [{
        "mask-t-to": M()
      }],
      "mask-image-r-from-pos": [{
        "mask-r-from": ma()
      }],
      "mask-image-r-to-pos": [{
        "mask-r-to": ma()
      }],
      "mask-image-r-from-color": [{
        "mask-r-from": M()
      }],
      "mask-image-r-to-color": [{
        "mask-r-to": M()
      }],
      "mask-image-b-from-pos": [{
        "mask-b-from": ma()
      }],
      "mask-image-b-to-pos": [{
        "mask-b-to": ma()
      }],
      "mask-image-b-from-color": [{
        "mask-b-from": M()
      }],
      "mask-image-b-to-color": [{
        "mask-b-to": M()
      }],
      "mask-image-l-from-pos": [{
        "mask-l-from": ma()
      }],
      "mask-image-l-to-pos": [{
        "mask-l-to": ma()
      }],
      "mask-image-l-from-color": [{
        "mask-l-from": M()
      }],
      "mask-image-l-to-color": [{
        "mask-l-to": M()
      }],
      "mask-image-x-from-pos": [{
        "mask-x-from": ma()
      }],
      "mask-image-x-to-pos": [{
        "mask-x-to": ma()
      }],
      "mask-image-x-from-color": [{
        "mask-x-from": M()
      }],
      "mask-image-x-to-color": [{
        "mask-x-to": M()
      }],
      "mask-image-y-from-pos": [{
        "mask-y-from": ma()
      }],
      "mask-image-y-to-pos": [{
        "mask-y-to": ma()
      }],
      "mask-image-y-from-color": [{
        "mask-y-from": M()
      }],
      "mask-image-y-to-color": [{
        "mask-y-to": M()
      }],
      "mask-image-radial": [{
        "mask-radial": [w, I]
      }],
      "mask-image-radial-from-pos": [{
        "mask-radial-from": ma()
      }],
      "mask-image-radial-to-pos": [{
        "mask-radial-to": ma()
      }],
      "mask-image-radial-from-color": [{
        "mask-radial-from": M()
      }],
      "mask-image-radial-to-color": [{
        "mask-radial-to": M()
      }],
      "mask-image-radial-shape": [{
        "mask-radial": ["circle", "ellipse"]
      }],
      "mask-image-radial-size": [{
        "mask-radial": [{
          closest: ["side", "corner"],
          farthest: ["side", "corner"]
        }]
      }],
      "mask-image-radial-pos": [{
        "mask-radial-at": x()
      }],
      "mask-image-conic-pos": [{
        "mask-conic": [U]
      }],
      "mask-image-conic-from-pos": [{
        "mask-conic-from": ma()
      }],
      "mask-image-conic-to-pos": [{
        "mask-conic-to": ma()
      }],
      "mask-image-conic-from-color": [{
        "mask-conic-from": M()
      }],
      "mask-image-conic-to-color": [{
        "mask-conic-to": M()
      }],
      "mask-mode": [{
        mask: ["alpha", "luminance", "match"]
      }],
      "mask-origin": [{
        "mask-origin": ["border", "padding", "content", "fill", "stroke", "view"]
      }],
      "mask-position": [{
        mask: Ds()
      }],
      "mask-repeat": [{
        mask: Bs()
      }],
      "mask-size": [{
        mask: Rs()
      }],
      "mask-type": [{
        "mask-type": ["alpha", "luminance"]
      }],
      "mask-image": [{
        mask: ["none", w, I]
      }],
      filter: [{
        filter: ["", "none", w, I]
      }],
      blur: [{
        blur: zs()
      }],
      brightness: [{
        brightness: [U, w, I]
      }],
      contrast: [{
        contrast: [U, w, I]
      }],
      "drop-shadow": [{
        "drop-shadow": ["", "none", m, Ar, wr]
      }],
      "drop-shadow-color": [{
        "drop-shadow": M()
      }],
      grayscale: [{
        grayscale: ["", U, w, I]
      }],
      "hue-rotate": [{
        "hue-rotate": [U, w, I]
      }],
      invert: [{
        invert: ["", U, w, I]
      }],
      saturate: [{
        saturate: [U, w, I]
      }],
      sepia: [{
        sepia: ["", U, w, I]
      }],
      "backdrop-filter": [{
        "backdrop-filter": ["", "none", w, I]
      }],
      "backdrop-blur": [{
        "backdrop-blur": zs()
      }],
      "backdrop-brightness": [{
        "backdrop-brightness": [U, w, I]
      }],
      "backdrop-contrast": [{
        "backdrop-contrast": [U, w, I]
      }],
      "backdrop-grayscale": [{
        "backdrop-grayscale": ["", U, w, I]
      }],
      "backdrop-hue-rotate": [{
        "backdrop-hue-rotate": [U, w, I]
      }],
      "backdrop-invert": [{
        "backdrop-invert": ["", U, w, I]
      }],
      "backdrop-opacity": [{
        "backdrop-opacity": [U, w, I]
      }],
      "backdrop-saturate": [{
        "backdrop-saturate": [U, w, I]
      }],
      "backdrop-sepia": [{
        "backdrop-sepia": ["", U, w, I]
      }],
      "border-collapse": [{
        border: ["collapse", "separate"]
      }],
      "border-spacing": [{
        "border-spacing": v()
      }],
      "border-spacing-x": [{
        "border-spacing-x": v()
      }],
      "border-spacing-y": [{
        "border-spacing-y": v()
      }],
      "table-layout": [{
        table: ["auto", "fixed"]
      }],
      caption: [{
        caption: ["top", "bottom"]
      }],
      transition: [{
        transition: ["", "all", "colors", "opacity", "shadow", "transform", "none", w, I]
      }],
      "transition-behavior": [{
        transition: ["normal", "discrete"]
      }],
      duration: [{
        duration: [U, "initial", w, I]
      }],
      ease: [{
        ease: ["linear", "initial", n, w, I]
      }],
      delay: [{
        delay: [U, w, I]
      }],
      animate: [{
        animate: ["none", i, w, I]
      }],
      backface: [{
        backface: ["hidden", "visible"]
      }],
      perspective: [{
        perspective: [y, w, I]
      }],
      "perspective-origin": [{
        "perspective-origin": A()
      }],
      rotate: [{
        rotate: Vu()
      }],
      "rotate-x": [{
        "rotate-x": Vu()
      }],
      "rotate-y": [{
        "rotate-y": Vu()
      }],
      "rotate-z": [{
        "rotate-z": Vu()
      }],
      scale: [{
        scale: Xu()
      }],
      "scale-x": [{
        "scale-x": Xu()
      }],
      "scale-y": [{
        "scale-y": Xu()
      }],
      "scale-z": [{
        "scale-z": Xu()
      }],
      "scale-3d": ["scale-3d"],
      skew: [{
        skew: Er()
      }],
      "skew-x": [{
        "skew-x": Er()
      }],
      "skew-y": [{
        "skew-y": Er()
      }],
      transform: [{
        transform: [w, I, "", "none", "gpu", "cpu"]
      }],
      "transform-origin": [{
        origin: A()
      }],
      "transform-style": [{
        transform: ["3d", "flat"]
      }],
      translate: [{
        translate: Zu()
      }],
      "translate-x": [{
        "translate-x": Zu()
      }],
      "translate-y": [{
        "translate-y": Zu()
      }],
      "translate-z": [{
        "translate-z": Zu()
      }],
      "translate-none": ["translate-none"],
      zoom: [{
        zoom: [Le, w, I]
      }],
      accent: [{
        accent: M()
      }],
      appearance: [{
        appearance: ["none", "auto"]
      }],
      "caret-color": [{
        caret: M()
      }],
      "color-scheme": [{
        scheme: ["normal", "dark", "light", "light-dark", "only-dark", "only-light"]
      }],
      cursor: [{
        cursor: ["auto", "default", "pointer", "wait", "text", "move", "help", "not-allowed", "none", "context-menu", "progress", "cell", "crosshair", "vertical-text", "alias", "copy", "no-drop", "grab", "grabbing", "all-scroll", "col-resize", "row-resize", "n-resize", "e-resize", "s-resize", "w-resize", "ne-resize", "nw-resize", "se-resize", "sw-resize", "ew-resize", "ns-resize", "nesw-resize", "nwse-resize", "zoom-in", "zoom-out", w, I]
      }],
      "field-sizing": [{
        "field-sizing": ["fixed", "content"]
      }],
      "pointer-events": [{
        "pointer-events": ["auto", "none"]
      }],
      resize: [{
        resize: ["none", "", "y", "x"]
      }],
      "scroll-behavior": [{
        scroll: ["auto", "smooth"]
      }],
      "scrollbar-thumb-color": [{
        "scrollbar-thumb": M()
      }],
      "scrollbar-track-color": [{
        "scrollbar-track": M()
      }],
      "scrollbar-gutter": [{
        "scrollbar-gutter": ["auto", "stable", "both"]
      }],
      "scrollbar-w": [{
        scrollbar: ["auto", "thin", "none"]
      }],
      "scroll-m": [{
        "scroll-m": v()
      }],
      "scroll-mx": [{
        "scroll-mx": v()
      }],
      "scroll-my": [{
        "scroll-my": v()
      }],
      "scroll-ms": [{
        "scroll-ms": v()
      }],
      "scroll-me": [{
        "scroll-me": v()
      }],
      "scroll-mbs": [{
        "scroll-mbs": v()
      }],
      "scroll-mbe": [{
        "scroll-mbe": v()
      }],
      "scroll-mt": [{
        "scroll-mt": v()
      }],
      "scroll-mr": [{
        "scroll-mr": v()
      }],
      "scroll-mb": [{
        "scroll-mb": v()
      }],
      "scroll-ml": [{
        "scroll-ml": v()
      }],
      "scroll-p": [{
        "scroll-p": v()
      }],
      "scroll-px": [{
        "scroll-px": v()
      }],
      "scroll-py": [{
        "scroll-py": v()
      }],
      "scroll-ps": [{
        "scroll-ps": v()
      }],
      "scroll-pe": [{
        "scroll-pe": v()
      }],
      "scroll-pbs": [{
        "scroll-pbs": v()
      }],
      "scroll-pbe": [{
        "scroll-pbe": v()
      }],
      "scroll-pt": [{
        "scroll-pt": v()
      }],
      "scroll-pr": [{
        "scroll-pr": v()
      }],
      "scroll-pb": [{
        "scroll-pb": v()
      }],
      "scroll-pl": [{
        "scroll-pl": v()
      }],
      "snap-align": [{
        snap: ["start", "end", "center", "align-none"]
      }],
      "snap-stop": [{
        snap: ["normal", "always"]
      }],
      "snap-type": [{
        snap: ["none", "x", "y", "both"]
      }],
      "snap-strictness": [{
        snap: ["mandatory", "proximity"]
      }],
      touch: [{
        touch: ["auto", "none", "manipulation"]
      }],
      "touch-x": [{
        "touch-pan": ["x", "left", "right"]
      }],
      "touch-y": [{
        "touch-pan": ["y", "up", "down"]
      }],
      "touch-pz": ["touch-pinch-zoom"],
      select: [{
        select: ["none", "text", "all", "auto"]
      }],
      "will-change": [{
        "will-change": ["auto", "scroll", "contents", "transform", w, I]
      }],
      fill: [{
        fill: ["none", ...M()]
      }],
      "stroke-w": [{
        stroke: [U, Fu, Gt, Dm]
      }],
      stroke: [{
        stroke: ["none", ...M()]
      }],
      "forced-color-adjust": [{
        "forced-color-adjust": ["auto", "none"]
      }]
    },
    conflictingClassGroups: {
      "container-named": ["container-type"],
      overflow: ["overflow-x", "overflow-y"],
      overscroll: ["overscroll-x", "overscroll-y"],
      inset: ["inset-x", "inset-y", "inset-bs", "inset-be", "start", "end", "top", "right", "bottom", "left"],
      "inset-x": ["right", "left"],
      "inset-y": ["top", "bottom"],
      flex: ["basis", "grow", "shrink"],
      gap: ["gap-x", "gap-y"],
      p: ["px", "py", "ps", "pe", "pbs", "pbe", "pt", "pr", "pb", "pl"],
      px: ["pr", "pl"],
      py: ["pt", "pb"],
      m: ["mx", "my", "ms", "me", "mbs", "mbe", "mt", "mr", "mb", "ml"],
      mx: ["mr", "ml"],
      my: ["mt", "mb"],
      size: ["w", "h"],
      "font-size": ["leading"],
      "fvn-normal": ["fvn-ordinal", "fvn-slashed-zero", "fvn-figure", "fvn-spacing", "fvn-fraction"],
      "fvn-ordinal": ["fvn-normal"],
      "fvn-slashed-zero": ["fvn-normal"],
      "fvn-figure": ["fvn-normal"],
      "fvn-spacing": ["fvn-normal"],
      "fvn-fraction": ["fvn-normal"],
      "line-clamp": ["display", "overflow"],
      rounded: ["rounded-s", "rounded-e", "rounded-t", "rounded-r", "rounded-b", "rounded-l", "rounded-ss", "rounded-se", "rounded-ee", "rounded-es", "rounded-tl", "rounded-tr", "rounded-br", "rounded-bl"],
      "rounded-s": ["rounded-ss", "rounded-es"],
      "rounded-e": ["rounded-se", "rounded-ee"],
      "rounded-t": ["rounded-tl", "rounded-tr"],
      "rounded-r": ["rounded-tr", "rounded-br"],
      "rounded-b": ["rounded-br", "rounded-bl"],
      "rounded-l": ["rounded-tl", "rounded-bl"],
      "border-spacing": ["border-spacing-x", "border-spacing-y"],
      "border-w": ["border-w-x", "border-w-y", "border-w-s", "border-w-e", "border-w-bs", "border-w-be", "border-w-t", "border-w-r", "border-w-b", "border-w-l"],
      "border-w-x": ["border-w-r", "border-w-l"],
      "border-w-y": ["border-w-t", "border-w-b"],
      "border-color": ["border-color-x", "border-color-y", "border-color-s", "border-color-e", "border-color-bs", "border-color-be", "border-color-t", "border-color-r", "border-color-b", "border-color-l"],
      "border-color-x": ["border-color-r", "border-color-l"],
      "border-color-y": ["border-color-t", "border-color-b"],
      translate: ["translate-x", "translate-y", "translate-none"],
      "translate-none": ["translate", "translate-x", "translate-y", "translate-z"],
      "scroll-m": ["scroll-mx", "scroll-my", "scroll-ms", "scroll-me", "scroll-mbs", "scroll-mbe", "scroll-mt", "scroll-mr", "scroll-mb", "scroll-ml"],
      "scroll-mx": ["scroll-mr", "scroll-ml"],
      "scroll-my": ["scroll-mt", "scroll-mb"],
      "scroll-p": ["scroll-px", "scroll-py", "scroll-ps", "scroll-pe", "scroll-pbs", "scroll-pbe", "scroll-pt", "scroll-pr", "scroll-pb", "scroll-pl"],
      "scroll-px": ["scroll-pr", "scroll-pl"],
      "scroll-py": ["scroll-pt", "scroll-pb"],
      touch: ["touch-x", "touch-y", "touch-pz"],
      "touch-x": ["touch"],
      "touch-y": ["touch"],
      "touch-pz": ["touch"]
    },
    conflictingClassGroupModifiers: {
      "font-size": ["leading"]
    },
    postfixLookupClassGroups: ["container-type"],
    orderSensitiveModifiers: ["*", "**", "after", "backdrop", "before", "details-content", "file", "first-letter", "first-line", "marker", "placeholder", "selection"]
  };
};
var twMerge = RL(av);
// cn (minified: _t) — ──── App: cn() helper and Input component ────
// cn (minified: _t) — Joins class names (clsx) and resolves conflicting Tailwind classes (twMerge).
function cn(...classes) {
  return twMerge(clsx(classes));
}
// jsxForInput (minified: Jm) — jsx runtime used by Input, declared with it.
// Input (minified: ks): a text input styled with the theme's input colours; forwards its ref.
var jsxForInput = sa(Ya()),
  Input = (0, ReactForInput.forwardRef)(({
    className: className,
    type: type,
    ...props
  }, ref) => (0, jsxForInput.jsx)("input", {
    type: type,
    className: cn("flex h-9 w-full rounded-md border border-border bg-input px-3 py-1 text-sm text-input-foreground transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50", className),
    ref: ref,
    ...props
  }));
Input.displayName = "Input";
// ReactForButton (minified: tg) — ──── Library: class-variance-authority (cva) (bundled from npm; unchanged, names left minified) ────
// ReactForButton (minified: tg) — React namespace used by Button (forwardRef).
var ReactForButton = sa(Se());
var $m = a => typeof a == "boolean" ? `${a}` : a === 0 ? "0" : a,
  ag = clsx,
  cva = (a, e) => t => {
    var l;
    if (e?.variants == null) return ag(a, t?.class, t?.className);
    let {
        variants: u,
        defaultVariants: o
      } = e,
      r = Object.keys(u).map(s => {
        let g = t?.[s],
          h = o?.[s];
        if (g === null) return null;
        let c = $m(g) || $m(h);
        return u[s][c];
      }),
      d = t && Object.entries(t).reduce((s, g) => {
        let [h, c] = g;
        return c === void 0 || (s[h] = c), s;
      }, {}),
      f = e == null || (l = e.compoundVariants) === null || l === void 0 ? void 0 : l.reduce((s, g) => {
        let {
          class: h,
          className: c,
          ...m
        } = g;
        return Object.entries(m).every(b => {
          let [y, T] = b;
          return Array.isArray(T) ? T.includes({
            ...o,
            ...d
          }[y]) : {
            ...o,
            ...d
          }[y] === T;
        }) ? [...s, h, c] : s;
      }, []);
    return ag(a, r, f, t?.class, t?.className);
  };
// jsxForButton (minified: lg) — ──── App: Button component (cva variants) ────
// jsxForButton (minified: lg) — jsx runtime used by Button, declared with it.
// buttonVariants (minified: lv): button classes by variant (default, secondary, destructive, ghost, link) and size.
// Button (minified: Mr): a button with those styles; forwards its ref.
var jsxForButton = sa(Ya()),
  buttonVariants = cva("inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-opacity focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 cursor-pointer border-none", {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:opacity-90",
        secondary: "bg-secondary text-secondary-foreground hover:opacity-80",
        destructive: "bg-destructive text-primary-foreground hover:opacity-90",
        ghost: "hover:bg-secondary hover:text-secondary-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }),
  Button = (0, ReactForButton.forwardRef)(({
    className: className,
    variant: variant,
    size: size,
    ...props
  }, ref) => (0, jsxForButton.jsx)("button", {
    className: cn(buttonVariants({
      variant: variant,
      size: size,
      className: className
    })),
    ref: ref,
    ...props
  }));
Button.displayName = "Button";
// ──── Library: lucide-react v1.31.0 (core + icons: refresh-cw, user) (bundled from npm; unchanged, names left minified) ────
var Br = sa(Se(), 1);
var Tr = (...a) => a.filter((e, t, l) => !!e && e.trim() !== "" && l.indexOf(e) === t).join(" ").trim();
var ug = a => a.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
var og = a => a.replace(/^([A-Z])|[\s-_]+(\w)/g, (e, t, l) => l ? l.toUpperCase() : t.toLowerCase());
var Ms = a => {
  let e = og(a);
  return e.charAt(0).toUpperCase() + e.slice(1);
};
var Gu = sa(Se(), 1);
var Dr = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};
var rg = a => {
  for (let e in a) if (e.startsWith("aria-") || e === "role" || e === "title") return !0;
  return !1;
};
var ql = sa(Se(), 1);
var uv = (0, ql.createContext)({});
var dg = () => (0, ql.useContext)(uv);
var fg = (0, Gu.forwardRef)(({
  color: a,
  size: e,
  strokeWidth: t,
  absoluteStrokeWidth: l,
  className: u = "",
  children: o,
  iconNode: r,
  ...d
}, f) => {
  let {
      size: s = 24,
      strokeWidth: g = 2,
      absoluteStrokeWidth: h = !1,
      color: c = "currentColor",
      className: m = ""
    } = dg() ?? {},
    b = l ?? h ? Number(t ?? g) * 24 / Number(e ?? s) : t ?? g;
  return (0, Gu.createElement)("svg", {
    ref: f,
    ...Dr,
    width: e ?? s ?? Dr.width,
    height: e ?? s ?? Dr.height,
    stroke: a ?? c,
    strokeWidth: b,
    className: Tr("lucide", m, u),
    ...(!o && !rg(d) && {
      "aria-hidden": "true"
    }),
    ...d
  }, [...r.map(([y, T]) => (0, Gu.createElement)(y, T)), ...(Array.isArray(o) ? o : [o])]);
});
var createLucideIcon = (a, e) => {
  let t = (0, Br.forwardRef)(({
    className: l,
    ...u
  }, o) => (0, Br.createElement)(fg, {
    ref: o,
    iconNode: e,
    className: Tr(`lucide-${ug(Ms(a))}`, `lucide-${a}`, l),
    ...u
  }));
  return t.displayName = Ms(a), t;
};
var ov = [["path", {
    d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",
    key: "v9h5vc"
  }], ["path", {
    d: "M21 3v5h-5",
    key: "1q7to0"
  }], ["path", {
    d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",
    key: "3uifl3"
  }], ["path", {
    d: "M8 16H3v5",
    key: "1cv678"
  }]],
  RefreshCwIcon = createLucideIcon("refresh-cw", ov);
var rv = [["path", {
    d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",
    key: "975kel"
  }], ["circle", {
    cx: "12",
    cy: "7",
    r: "4",
    key: "17ys0d"
  }]],
  UserIcon = createLucideIcon("user", rv);
// jsxForTaskCard (minified: se) — ──── App: Tickets kanban screen: priority colours, TaskCard, StageColumn, task normalising, App (acquireVsCodeApi messaging), mount ────
// jsxForTaskCard (minified: se) — jsx runtime used by TaskCard.
// PRIORITY_CLASSES (minified: dv): badge colours by ticket priority (lower-case).
var jsxForTaskCard = sa(Ya()),
  PRIORITY_CLASSES = {
    critical: "bg-red-700 text-white",
    high: "bg-orange-100 text-orange-700",
    medium: "bg-blue-100 text-blue-800",
    low: "bg-yellow-100 text-yellow-700"
  };
// TaskCard (minified: sg) — One ticket card: short id, priority badge, project name, title and assignee initials.
// Draggable (onDragStart(event, task)); a double click calls onDoubleClick(task).
function TaskCard({
  task: task,
  onDoubleClick: onDoubleClick,
  onDragStart: onDragStart
}) {
  return (0, jsxForTaskCard.jsxs)("div", {
    className: "relative bg-card rounded-md p-3 shadow-sm cursor-grab transition-transform duration-100 active:cursor-grabbing",
    draggable: !0,
    onDragStart: dragEvent => onDragStart(dragEvent, task),
    onDoubleClick: () => onDoubleClick(task),
    children: [(0, jsxForTaskCard.jsxs)("div", {
      className: "flex justify-between mb-2",
      children: [(0, jsxForTaskCard.jsxs)("span", {
        className: "text-[10px] font-bold text-muted-foreground",
        children: [(task.id || "").slice(0, 20), "..."]
      }), (0, jsxForTaskCard.jsx)("span", {
        className: cn("inline-flex items-center font-bold px-1.5 py-0.5 rounded text-[10px] scale-90", PRIORITY_CLASSES[task.priority.toLowerCase()] ?? "bg-muted text-muted-foreground"),
        children: task.priority
      })]
    }), (0, jsxForTaskCard.jsx)("p", {
      className: "text-sm text-foreground m-0 mb-1 leading-snug font-bold",
      children: (task.project.project_name || "").slice(0, 15) || "-"
    }), (0, jsxForTaskCard.jsx)("p", {
      className: "text-sm text-foreground m-0 mb-4 leading-snug",
      children: task.title
    }), (0, jsxForTaskCard.jsx)("div", {
      className: "flex justify-between items-center",
      children: (0, jsxForTaskCard.jsx)("div", {
        className: "flex items-center",
        children: task.assignees.map((assignee, index) => (0, jsxForTaskCard.jsx)("div", {
          className: cn("w-6 h-6 rounded-full bg-blue-700 text-white text-[10px] flex items-center justify-center font-bold border-2 border-card box-content", index > 0 && "-ml-2"),
          title: assignee.fullName,
          children: assignee.initials
        }, assignee.id))
      })
    })]
  });
}
// jsxForColumn (minified: Ne) — jsx runtime used by StageColumn.
var jsxForColumn = sa(Ya());
// StageColumn (minified: ig) — One stage column: its label, ticket count and TaskCards.
// Dropping a card calls onDrop(event, stage.stage); scrolling calls onScroll(event, stage.stage).
function StageColumn({
  stage: stage,
  tasks: tasks,
  onDrop: onDrop,
  onDragStart: onDragStart,
  onTaskDoubleClick: onTaskDoubleClick,
  onScroll: onScroll
}) {
  return (0, jsxForColumn.jsxs)("div", {
    className: "bg-muted rounded-lg flex-1 min-w-[280px] max-w-[350px] flex flex-col max-h-full",
    onDragOver: dragEvent => dragEvent.preventDefault(),
    onDrop: dropEvent => onDrop(dropEvent, stage.stage),
    children: [(0, jsxForColumn.jsxs)("div", {
      className: "flex justify-between items-center p-3 pb-2 shrink-0 border-b border-border/50",
      children: [(0, jsxForColumn.jsx)("h2", {
        className: "text-xs font-bold uppercase text-muted-foreground m-0",
        children: stage.label
      }), (0, jsxForColumn.jsx)("span", {
        className: "text-xs text-muted-foreground",
        children: tasks.length
      })]
    }), (0, jsxForColumn.jsx)("div", {
      className: "flex-1 overflow-y-auto min-h-0 p-3",
      onScroll: scrollEvent => onScroll(scrollEvent, stage.stage),
      children: (0, jsxForColumn.jsx)("div", {
        className: "flex flex-col gap-2",
        children: tasks.map(task => (0, jsxForColumn.jsx)(TaskCard, {
          task: task,
          onDoubleClick: onTaskDoubleClick,
          onDragStart: onDragStart
        }, task.id))
      })
    })]
  });
}
// jsxRuntime (minified: ua) — jsx runtime used by the board.
// vscodeApi (minified: El): the webview's only handle to the extension host.
// TICKETS_PAGE_SIZE (minified: Ts): tickets asked for per page (fetchTickets limit).
var jsxRuntime = sa(Ya()),
  vscodeApi = acquireVsCodeApi(),
  TICKETS_PAGE_SIZE = 20;
// normalizeTicket (minified: fv) — Turns a ticket from Sonover's API into the card's shape: id, title, upper-case priority (default LOW),
// assignees with initials and full name, stage (from status) and project.
function normalizeTicket(ticket) {
  let priority = "LOW";
  ticket.priority?.value ? priority = ticket.priority.value.toUpperCase() : typeof ticket.priority == "string" && (priority = ticket.priority.toUpperCase());
  let assignees = [];
  return Array.isArray(ticket.assignees) && (assignees = ticket.assignees.map(assignee => {
    if (typeof assignee == "object" && assignee !== null) {
      let firstName = assignee.first_name || "",
        lastName = assignee.last_name || "";
      return {
        id: assignee.id || assignee._id || assignee.value || assignee.reference,
        initials: (firstName.charAt(0) + lastName.charAt(0)).toUpperCase() || "?",
        fullName: `${firstName} ${lastName}`.trim() || "Unknown User"
      };
    }
    return {
      id: String(assignee),
      initials: "?",
      fullName: "Unknown User"
    };
  })), {
    id: ticket.id || ticket._id,
    title: ticket.title || "Untitled Ticket",
    priority: priority,
    assignees: assignees,
    stage: ticket.status,
    project: ticket.project || {}
  };
}
// TicketsBoard (minified: ng) — The Tickets screen: a kanban board of Sonover tickets by stage, with search, My Tasks and a project filter.
// Sends getUser, fetchStages, fetchTickets (paged, more on scroll), moveTicket (drag to another column) and
// openTicket (double click); handles stages, tickets, user and error.
function TicketsBoard() {
  let [stages, setStages] = (0, React.useState)([]),
    [tickets, setTickets] = (0, React.useState)([]),
    [searchText, setSearchText] = (0, React.useState)(""),
    [projectId, setProjectId] = (0, React.useState)(null),
    [projectMenuOpen, setProjectMenuOpen] = (0, React.useState)(!1),
    [userId, setUserId] = (0, React.useState)(null),
    [myTasksOnly, setMyTasksOnly] = (0, React.useState)(!1),
    draggedTicketRef = (0, React.useRef)(null),
    offsetRef = (0, React.useRef)(0),
    hasMoreRef = (0, React.useRef)(!0),
    loadingRef = (0, React.useRef)(!1),
    fetchTickets = (0, React.useCallback)(isLoadMore => {
      // Asks the host for a page of tickets; without isLoadMore it starts again from offset 0.
      // loadingRef keeps one request in flight at a time.
      loadingRef.current || (loadingRef.current = !0, isLoadMore || (offsetRef.current = 0, hasMoreRef.current = !0), vscodeApi.postMessage({
        type: "fetchTickets",
        payload: {
          offset: offsetRef.current,
          limit: TICKETS_PAGE_SIZE,
          projectId: projectId,
          isLoadMore: isLoadMore
        }
      }));
    }, [projectId]);
  (0, React.useEffect)(() => {
    let onMessage = messageEvent => {
      let message = messageEvent.data;
      switch (message.type) {
        // The board's columns (stage, label, colour).
        case "stages":
          setStages(message.payload);
          break;
        // A page of tickets: a short page means there are no more; a load-more page is appended.
        case "tickets":
          {
            let page = message.payload.tickets.map(normalizeTicket);
            page.length < TICKETS_PAGE_SIZE ? hasMoreRef.current = !1 : offsetRef.current += TICKETS_PAGE_SIZE, loadingRef.current = !1, message.payload.isLoadMore ? setTickets(previous => [...previous, ...page]) : setTickets(page);
            break;
          }
        // The signed-in Sonover user (for My Tasks).
        case "user":
          setUserId(message.payload.id);
          break;
        // The move was saved; the board already shows it.
        case "ticketMoved":
          break;
        // A request failed: allow the next fetch.
        case "error":
          loadingRef.current = !1;
          break;
      }
    };
    return window.addEventListener("message", onMessage), vscodeApi.postMessage({
      type: "getUser"
    }), vscodeApi.postMessage({
      type: "fetchStages"
    }), fetchTickets(!1), () => window.removeEventListener("message", onMessage);
  }, [fetchTickets]);
  // The tickets shown in one stage, after the My Tasks, project and search filters.
  let ticketsInStage = stageKey => {
      let shown = tickets.filter(ticket => ticket.stage === stageKey);
      if (myTasksOnly && userId && (shown = shown.filter(ticket => ticket.assignees.some(assignee => String(assignee.id) === String(userId)))), projectId && (shown = shown.filter(ticket => (ticket.project?.id || ticket.project?.project_name) === projectId)), searchText) {
        let query = searchText.toLowerCase();
        shown = shown.filter(ticket => ticket.title?.toLowerCase().includes(query) || ticket.project?.project_name?.toLowerCase().includes(query));
      }
      return shown;
    },
    projects = (() => {
      // The projects among the loaded tickets (id or name, and name), for the project menu.
      let projectNames = new Map();
      return tickets.forEach(ticket => {
        if (ticket.project?.project_name) {
          let key = ticket.project.id || ticket.project.project_name;
          key && !projectNames.has(key) && projectNames.set(key, ticket.project.project_name);
        }
      }), Array.from(projectNames, ([id, projectName]) => ({
        id: id,
        name: projectName
      }));
    })(),
    handleDragStart = (dragEvent, ticket) => {
      draggedTicketRef.current = ticket;
    },
    handleDrop = (dropEvent, stageKey) => {
      // Drops the dragged ticket on a stage: moves it at once, then tells the host (moveTicket).
      let dragged = draggedTicketRef.current;
      !dragged || dragged.stage === stageKey || (setTickets(previous => previous.map(ticket => ticket.id === dragged.id ? {
        ...ticket,
        stage: stageKey
      } : ticket)), vscodeApi.postMessage({
        type: "moveTicket",
        payload: {
          ticketId: dragged.id,
          status: stageKey
        }
      }), draggedTicketRef.current = null);
    },
    openTicket = ticket => {
      vscodeApi.postMessage({
        type: "openTicket",
        payload: {
          ticketId: ticket.id
        }
      });
    },
    handleScroll = (scrollEvent, stageKey) => {
      // Loads the next page when a column is scrolled to within 50 px of its bottom.
      let list = scrollEvent.currentTarget;
      list.scrollTop + list.clientHeight >= list.scrollHeight - 50 && !loadingRef.current && hasMoreRef.current && fetchTickets(!0);
    };
  return (0, jsxRuntime.jsxs)("div", {
    className: "min-h-screen p-4",
    onClick: () => setProjectMenuOpen(!1),
    children: [(0, jsxRuntime.jsxs)("header", {
      className: "flex flex-wrap justify-between items-center mb-4 gap-4",
      children: [(0, jsxRuntime.jsx)("h1", {
        className: "m-0 text-xl font-semibold text-foreground",
        children: "Tickets"
      }), (0, jsxRuntime.jsxs)("div", {
        className: "flex flex-wrap items-center gap-3",
        children: [(0, jsxRuntime.jsx)(Input, {
          type: "text",
          value: searchText,
          onChange: changeEvent => setSearchText(changeEvent.target.value),
          placeholder: "Search tickets...",
          className: "w-48"
        }), (0, jsxRuntime.jsxs)(Button, {
          variant: myTasksOnly ? "default" : "ghost",
          size: "sm",
          onClick: () => setMyTasksOnly(!myTasksOnly),
          title: "My Tasks",
          className: "gap-1.5",
          children: [(0, jsxRuntime.jsx)(UserIcon, {
            className: "h-4 w-4"
          }), "My Tasks"]
        }), (0, jsxRuntime.jsx)(Button, {
          variant: "ghost",
          size: "icon",
          onClick: () => {
            vscodeApi.postMessage({
              type: "fetchStages"
            }), fetchTickets(!1);
          },
          title: "Refresh",
          children: (0, jsxRuntime.jsx)(RefreshCwIcon, {
            className: "h-4 w-4"
          })
        }), (0, jsxRuntime.jsxs)("div", {
          className: "relative inline-block text-left",
          children: [(0, jsxRuntime.jsxs)("button", {
            type: "button",
            className: "flex items-center justify-between w-48 border border-border rounded-md px-3 py-1.5 text-sm text-foreground h-9 bg-input focus:outline-none focus:ring-1 focus:ring-ring",
            onClick: clickEvent => {
              clickEvent.stopPropagation(), setProjectMenuOpen(!projectMenuOpen);
            },
            children: [(0, jsxRuntime.jsx)("span", {
              className: "truncate",
              children: projectId ? projects.find(project => project.id === projectId)?.name ?? "All Projects" : "All Projects"
            }), (0, jsxRuntime.jsx)("svg", {
              className: "w-4 h-4 ml-2 text-muted-foreground shrink-0",
              fill: "none",
              stroke: "currentColor",
              viewBox: "0 0 24 24",
              children: (0, jsxRuntime.jsx)("path", {
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: 2,
                d: "M19 9l-7 7-7-7"
              })
            })]
          }), projectMenuOpen && (0, jsxRuntime.jsxs)("div", {
            className: "absolute right-0 mt-1 w-56 bg-card border border-border rounded-md shadow-lg z-50 py-1 max-h-60 overflow-y-auto",
            children: [(0, jsxRuntime.jsx)("button", {
              className: `block w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted ${projectId ? "" : "font-bold bg-muted"}`,
              onClick: clickEvent => {
                clickEvent.stopPropagation(), setProjectId(null), setProjectMenuOpen(!1);
              },
              children: "All Projects"
            }), projects.map(project => (0, jsxRuntime.jsx)("button", {
              className: `block w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted truncate ${projectId === project.id ? "font-bold bg-muted" : ""}`,
              onClick: clickEvent => {
                clickEvent.stopPropagation(), setProjectId(project.id), setProjectMenuOpen(!1);
              },
              title: project.name,
              children: project.name
            }, project.id))]
          })]
        })]
      })]
    }), (0, jsxRuntime.jsx)("div", {
      className: "flex gap-4 items-start overflow-x-auto pb-20 h-[calc(100vh-100px)]",
      children: stages.map(stage => (0, jsxRuntime.jsx)(StageColumn, {
        stage: stage,
        tasks: ticketsInStage(stage.stage),
        onDrop: handleDrop,
        onDragStart: handleDragStart,
        onTaskDoubleClick: openTicket,
        onScroll: handleScroll
      }, stage.stage))
    })]
  });
}
// jsxForMount (minified: pg) — jsx runtime used by the mount below.
var jsxForMount = sa(Ya());
(0, ReactDOMClient.createRoot)(document.getElementById("root")).render((0, jsxForMount.jsx)(TicketsBoard, {}));
/*! Bundled license information:

scheduler/cjs/scheduler.production.js:
  (**
   * @license React
   * scheduler.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react/cjs/react.production.js:
  (**
   * @license React
   * react.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react-dom/cjs/react-dom.production.js:
  (**
   * @license React
   * react-dom.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react-dom/cjs/react-dom-client.production.js:
  (**
   * @license React
   * react-dom-client.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react/cjs/react-jsx-runtime.production.js:
  (**
   * @license React
   * react-jsx-runtime.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

lucide-react/dist/esm/shared/src/utils/mergeClasses.mjs:
lucide-react/dist/esm/shared/src/utils/toKebabCase.mjs:
lucide-react/dist/esm/shared/src/utils/toCamelCase.mjs:
lucide-react/dist/esm/shared/src/utils/toPascalCase.mjs:
lucide-react/dist/esm/defaultAttributes.mjs:
lucide-react/dist/esm/shared/src/utils/hasA11yProp.mjs:
lucide-react/dist/esm/context.mjs:
lucide-react/dist/esm/Icon.mjs:
lucide-react/dist/esm/createLucideIcon.mjs:
lucide-react/dist/esm/icons/refresh-cw.mjs:
lucide-react/dist/esm/icons/user.mjs:
lucide-react/dist/esm/lucide-react.mjs:
  (**
   * @license lucide-react v1.31.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)
*/
