/*
 * sonover-code — the Workflows screen's list view (React). The node view (src/) runs in the same webview and is the default view.
 *
 * Shipped by the original 0.1.1 build as a minified esbuild bundle; made readable here:
 * formatted, the app code's variables named and commented, icons named after themselves.
 * Library code (React, lucide-react, tailwind-merge, …) is marked by "──── Library: … ────"
 * comments and left as it was, names minified; "──── App: … ────" starts this extension's code.
 * build.mjs minifies this file into the package; package.sh proves (tools/same-code.mjs) that
 * the minified file is the same program. Rename with tools/rename.mjs, not by hand.
 */
// ──── Library: esbuild runtime helpers (bundled from npm; unchanged, names left minified) ────
var jb = Object.create;
var qf = Object.defineProperty;
var Zb = Object.getOwnPropertyDescriptor;
var Yb = Object.getOwnPropertyNames;
var Kb = Object.getPrototypeOf,
  Qb = Object.prototype.hasOwnProperty;
var gt = (e, a) => () => {
  try {
    return a || e((a = {
      exports: {}
    }).exports, a), a.exports;
  } catch (t) {
    throw a = 0, t;
  }
};
var Wb = (e, a, t, l) => {
  if (a && typeof a == "object" || typeof a == "function") for (let o of Yb(a)) !Qb.call(e, o) && o !== t && qf(e, o, {
    get: () => a[o],
    enumerable: !(l = Zb(a, o)) || l.enumerable
  });
  return e;
};
var V = (e, a, t) => (t = e != null ? jb(Kb(e)) : {}, Wb(a || !e || !e.__esModule ? qf(t, "default", {
  value: e,
  enumerable: !0
}) : t, e));
// ──── Library: react 19.2.8, react-dom (client), scheduler, react/jsx-runtime (production builds) (bundled from npm; unchanged, names left minified) ────
var Yf = gt(Ee => {
  "use strict";

  function _i(e, a) {
    var t = e.length;
    e.push(a);
    e: for (; 0 < t;) {
      var l = t - 1 >>> 1,
        o = e[l];
      if (0 < qu(o, a)) e[l] = a, e[t] = o, t = l;else break e;
    }
  }
  function ht(e) {
    return e.length === 0 ? null : e[0];
  }
  function Pu(e) {
    if (e.length === 0) return null;
    var a = e[0],
      t = e.pop();
    if (t !== a) {
      e[0] = t;
      e: for (var l = 0, o = e.length, r = o >>> 1; l < r;) {
        var n = 2 * (l + 1) - 1,
          u = e[n],
          s = n + 1,
          i = e[s];
        if (0 > qu(u, t)) s < o && 0 > qu(i, u) ? (e[l] = i, e[s] = t, l = s) : (e[l] = u, e[n] = t, l = n);else if (s < o && 0 > qu(i, t)) e[l] = i, e[s] = t, l = s;else break e;
      }
    }
    return a;
  }
  function qu(e, a) {
    var t = e.sortIndex - a.sortIndex;
    return t !== 0 ? t : e.id - a.id;
  }
  Ee.unstable_now = void 0;
  typeof performance == "object" && typeof performance.now == "function" ? (Ff = performance, Ee.unstable_now = function () {
    return Ff.now();
  }) : (Fi = Date, Pf = Fi.now(), Ee.unstable_now = function () {
    return Fi.now() - Pf;
  });
  var Ff,
    Fi,
    Pf,
    Mt = [],
    ul = [],
    Jb = 1,
    Ya = null,
    ba = 3,
    Gi = !1,
    Xr = !1,
    jr = !1,
    Vi = !1,
    Gf = typeof setTimeout == "function" ? setTimeout : null,
    Vf = typeof clearTimeout == "function" ? clearTimeout : null,
    Hf = typeof setImmediate < "u" ? setImmediate : null;
  function Fu(e) {
    for (var a = ht(ul); a !== null;) {
      if (a.callback === null) Pu(ul);else if (a.startTime <= e) Pu(ul), a.sortIndex = a.expirationTime, _i(Mt, a);else break;
      a = ht(ul);
    }
  }
  function Xi(e) {
    if (jr = !1, Fu(e), !Xr) if (ht(Mt) !== null) Xr = !0, Uo || (Uo = !0, zo());else {
      var a = ht(ul);
      a !== null && ji(Xi, a.startTime - e);
    }
  }
  var Uo = !1,
    Zr = -1,
    Xf = 5,
    jf = -1;
  function Zf() {
    return Vi ? !0 : !(Ee.unstable_now() - jf < Xf);
  }
  function Pi() {
    if (Vi = !1, Uo) {
      var e = Ee.unstable_now();
      jf = e;
      var a = !0;
      try {
        e: {
          Xr = !1, jr && (jr = !1, Vf(Zr), Zr = -1), Gi = !0;
          var t = ba;
          try {
            a: {
              for (Fu(e), Ya = ht(Mt); Ya !== null && !(Ya.expirationTime > e && Zf());) {
                var l = Ya.callback;
                if (typeof l == "function") {
                  Ya.callback = null, ba = Ya.priorityLevel;
                  var o = l(Ya.expirationTime <= e);
                  if (e = Ee.unstable_now(), typeof o == "function") {
                    Ya.callback = o, Fu(e), a = !0;
                    break a;
                  }
                  Ya === ht(Mt) && Pu(Mt), Fu(e);
                } else Pu(Mt);
                Ya = ht(Mt);
              }
              if (Ya !== null) a = !0;else {
                var r = ht(ul);
                r !== null && ji(Xi, r.startTime - e), a = !1;
              }
            }
            break e;
          } finally {
            Ya = null, ba = t, Gi = !1;
          }
          a = void 0;
        }
      } finally {
        a ? zo() : Uo = !1;
      }
    }
  }
  var zo;
  typeof Hf == "function" ? zo = function () {
    Hf(Pi);
  } : typeof MessageChannel < "u" ? (Hi = new MessageChannel(), _f = Hi.port2, Hi.port1.onmessage = Pi, zo = function () {
    _f.postMessage(null);
  }) : zo = function () {
    Gf(Pi, 0);
  };
  var Hi, _f;
  function ji(e, a) {
    Zr = Gf(function () {
      e(Ee.unstable_now());
    }, a);
  }
  Ee.unstable_IdlePriority = 5;
  Ee.unstable_ImmediatePriority = 1;
  Ee.unstable_LowPriority = 4;
  Ee.unstable_NormalPriority = 3;
  Ee.unstable_Profiling = null;
  Ee.unstable_UserBlockingPriority = 2;
  Ee.unstable_cancelCallback = function (e) {
    e.callback = null;
  };
  Ee.unstable_forceFrameRate = function (e) {
    0 > e || 125 < e ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : Xf = 0 < e ? Math.floor(1e3 / e) : 5;
  };
  Ee.unstable_getCurrentPriorityLevel = function () {
    return ba;
  };
  Ee.unstable_next = function (e) {
    switch (ba) {
      case 1:
      case 2:
      case 3:
        var a = 3;
        break;
      default:
        a = ba;
    }
    var t = ba;
    ba = a;
    try {
      return e();
    } finally {
      ba = t;
    }
  };
  Ee.unstable_requestPaint = function () {
    Vi = !0;
  };
  Ee.unstable_runWithPriority = function (e, a) {
    switch (e) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
        break;
      default:
        e = 3;
    }
    var t = ba;
    ba = e;
    try {
      return a();
    } finally {
      ba = t;
    }
  };
  Ee.unstable_scheduleCallback = function (e, a, t) {
    var l = Ee.unstable_now();
    switch (typeof t == "object" && t !== null ? (t = t.delay, t = typeof t == "number" && 0 < t ? l + t : l) : t = l, e) {
      case 1:
        var o = -1;
        break;
      case 2:
        o = 250;
        break;
      case 5:
        o = 1073741823;
        break;
      case 4:
        o = 1e4;
        break;
      default:
        o = 5e3;
    }
    return o = t + o, e = {
      id: Jb++,
      callback: a,
      priorityLevel: e,
      startTime: t,
      expirationTime: o,
      sortIndex: -1
    }, t > l ? (e.sortIndex = t, _i(ul, e), ht(Mt) === null && e === ht(ul) && (jr ? (Vf(Zr), Zr = -1) : jr = !0, ji(Xi, t - l))) : (e.sortIndex = o, _i(Mt, e), Xr || Gi || (Xr = !0, Uo || (Uo = !0, zo()))), e;
  };
  Ee.unstable_shouldYield = Zf;
  Ee.unstable_wrapCallback = function (e) {
    var a = ba;
    return function () {
      var t = ba;
      ba = a;
      try {
        return e.apply(this, arguments);
      } finally {
        ba = t;
      }
    };
  };
});
var Qf = gt((Lw, Kf) => {
  "use strict";

  Kf.exports = Yf();
});
var up = gt(K => {
  "use strict";

  var Ki = Symbol.for("react.transitional.element"),
    $b = Symbol.for("react.portal"),
    ev = Symbol.for("react.fragment"),
    av = Symbol.for("react.strict_mode"),
    tv = Symbol.for("react.profiler"),
    lv = Symbol.for("react.consumer"),
    ov = Symbol.for("react.context"),
    rv = Symbol.for("react.forward_ref"),
    nv = Symbol.for("react.suspense"),
    uv = Symbol.for("react.memo"),
    ap = Symbol.for("react.lazy"),
    sv = Symbol.for("react.activity"),
    Wf = Symbol.iterator;
  function iv(e) {
    return e === null || typeof e != "object" ? null : (e = Wf && e[Wf] || e["@@iterator"], typeof e == "function" ? e : null);
  }
  var tp = {
      isMounted: function () {
        return !1;
      },
      enqueueForceUpdate: function () {},
      enqueueReplaceState: function () {},
      enqueueSetState: function () {}
    },
    lp = Object.assign,
    op = {};
  function Fo(e, a, t) {
    this.props = e, this.context = a, this.refs = op, this.updater = t || tp;
  }
  Fo.prototype.isReactComponent = {};
  Fo.prototype.setState = function (e, a) {
    if (typeof e != "object" && typeof e != "function" && e != null) throw Error("takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, e, a, "setState");
  };
  Fo.prototype.forceUpdate = function (e) {
    this.updater.enqueueForceUpdate(this, e, "forceUpdate");
  };
  function rp() {}
  rp.prototype = Fo.prototype;
  function Qi(e, a, t) {
    this.props = e, this.context = a, this.refs = op, this.updater = t || tp;
  }
  var Wi = Qi.prototype = new rp();
  Wi.constructor = Qi;
  lp(Wi, Fo.prototype);
  Wi.isPureReactComponent = !0;
  var Jf = Array.isArray;
  function Yi() {}
  var Te = {
      H: null,
      A: null,
      T: null,
      S: null
    },
    np = Object.prototype.hasOwnProperty;
  function Ji(e, a, t) {
    var l = t.ref;
    return {
      $$typeof: Ki,
      type: e,
      key: a,
      ref: l !== void 0 ? l : null,
      props: t
    };
  }
  function dv(e, a) {
    return Ji(e.type, a, e.props);
  }
  function $i(e) {
    return typeof e == "object" && e !== null && e.$$typeof === Ki;
  }
  function cv(e) {
    var a = {
      "=": "=0",
      ":": "=2"
    };
    return "$" + e.replace(/[=:]/g, function (t) {
      return a[t];
    });
  }
  var $f = /\/+/g;
  function Zi(e, a) {
    return typeof e == "object" && e !== null && e.key != null ? cv("" + e.key) : a.toString(36);
  }
  function fv(e) {
    switch (e.status) {
      case "fulfilled":
        return e.value;
      case "rejected":
        throw e.reason;
      default:
        switch (typeof e.status == "string" ? e.then(Yi, Yi) : (e.status = "pending", e.then(function (a) {
          e.status === "pending" && (e.status = "fulfilled", e.value = a);
        }, function (a) {
          e.status === "pending" && (e.status = "rejected", e.reason = a);
        })), e.status) {
          case "fulfilled":
            return e.value;
          case "rejected":
            throw e.reason;
        }
    }
    throw e;
  }
  function qo(e, a, t, l, o) {
    var r = typeof e;
    (r === "undefined" || r === "boolean") && (e = null);
    var n = !1;
    if (e === null) n = !0;else switch (r) {
      case "bigint":
      case "string":
      case "number":
        n = !0;
        break;
      case "object":
        switch (e.$$typeof) {
          case Ki:
          case $b:
            n = !0;
            break;
          case ap:
            return n = e._init, qo(n(e._payload), a, t, l, o);
        }
    }
    if (n) return o = o(e), n = l === "" ? "." + Zi(e, 0) : l, Jf(o) ? (t = "", n != null && (t = n.replace($f, "$&/") + "/"), qo(o, a, t, "", function (i) {
      return i;
    })) : o != null && ($i(o) && (o = dv(o, t + (o.key == null || e && e.key === o.key ? "" : ("" + o.key).replace($f, "$&/") + "/") + n)), a.push(o)), 1;
    n = 0;
    var u = l === "" ? "." : l + ":";
    if (Jf(e)) for (var s = 0; s < e.length; s++) l = e[s], r = u + Zi(l, s), n += qo(l, a, t, r, o);else if (s = iv(e), typeof s == "function") for (e = s.call(e), s = 0; !(l = e.next()).done;) l = l.value, r = u + Zi(l, s++), n += qo(l, a, t, r, o);else if (r === "object") {
      if (typeof e.then == "function") return qo(fv(e), a, t, l, o);
      throw a = String(e), Error("Objects are not valid as a React child (found: " + (a === "[object Object]" ? "object with keys {" + Object.keys(e).join(", ") + "}" : a) + "). If you meant to render a collection of children, use an array instead.");
    }
    return n;
  }
  function Hu(e, a, t) {
    if (e == null) return e;
    var l = [],
      o = 0;
    return qo(e, l, "", "", function (r) {
      return a.call(t, r, o++);
    }), l;
  }
  function pv(e) {
    if (e._status === -1) {
      var a = e._result;
      a = a(), a.then(function (t) {
        (e._status === 0 || e._status === -1) && (e._status = 1, e._result = t);
      }, function (t) {
        (e._status === 0 || e._status === -1) && (e._status = 2, e._result = t);
      }), e._status === -1 && (e._status = 0, e._result = a);
    }
    if (e._status === 1) return e._result.default;
    throw e._result;
  }
  var ep = typeof reportError == "function" ? reportError : function (e) {
      if (typeof window == "object" && typeof window.ErrorEvent == "function") {
        var a = new window.ErrorEvent("error", {
          bubbles: !0,
          cancelable: !0,
          message: typeof e == "object" && e !== null && typeof e.message == "string" ? String(e.message) : String(e),
          error: e
        });
        if (!window.dispatchEvent(a)) return;
      } else if (typeof process == "object" && typeof process.emit == "function") {
        process.emit("uncaughtException", e);
        return;
      }
      console.error(e);
    },
    mv = {
      map: Hu,
      forEach: function (e, a, t) {
        Hu(e, function () {
          a.apply(this, arguments);
        }, t);
      },
      count: function (e) {
        var a = 0;
        return Hu(e, function () {
          a++;
        }), a;
      },
      toArray: function (e) {
        return Hu(e, function (a) {
          return a;
        }) || [];
      },
      only: function (e) {
        if (!$i(e)) throw Error("React.Children.only expected to receive a single React element child.");
        return e;
      }
    };
  K.Activity = sv;
  K.Children = mv;
  K.Component = Fo;
  K.Fragment = ev;
  K.Profiler = tv;
  K.PureComponent = Qi;
  K.StrictMode = av;
  K.Suspense = nv;
  K.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = Te;
  K.__COMPILER_RUNTIME = {
    __proto__: null,
    c: function (e) {
      return Te.H.useMemoCache(e);
    }
  };
  K.cache = function (e) {
    return function () {
      return e.apply(null, arguments);
    };
  };
  K.cacheSignal = function () {
    return null;
  };
  K.cloneElement = function (e, a, t) {
    if (e == null) throw Error("The argument must be a React element, but you passed " + e + ".");
    var l = lp({}, e.props),
      o = e.key;
    if (a != null) for (r in a.key !== void 0 && (o = "" + a.key), a) !np.call(a, r) || r === "key" || r === "__self" || r === "__source" || r === "ref" && a.ref === void 0 || (l[r] = a[r]);
    var r = arguments.length - 2;
    if (r === 1) l.children = t;else if (1 < r) {
      for (var n = Array(r), u = 0; u < r; u++) n[u] = arguments[u + 2];
      l.children = n;
    }
    return Ji(e.type, o, l);
  };
  K.createContext = function (e) {
    return e = {
      $$typeof: ov,
      _currentValue: e,
      _currentValue2: e,
      _threadCount: 0,
      Provider: null,
      Consumer: null
    }, e.Provider = e, e.Consumer = {
      $$typeof: lv,
      _context: e
    }, e;
  };
  K.createElement = function (e, a, t) {
    var l,
      o = {},
      r = null;
    if (a != null) for (l in a.key !== void 0 && (r = "" + a.key), a) np.call(a, l) && l !== "key" && l !== "__self" && l !== "__source" && (o[l] = a[l]);
    var n = arguments.length - 2;
    if (n === 1) o.children = t;else if (1 < n) {
      for (var u = Array(n), s = 0; s < n; s++) u[s] = arguments[s + 2];
      o.children = u;
    }
    if (e && e.defaultProps) for (l in n = e.defaultProps, n) o[l] === void 0 && (o[l] = n[l]);
    return Ji(e, r, o);
  };
  K.createRef = function () {
    return {
      current: null
    };
  };
  K.forwardRef = function (e) {
    return {
      $$typeof: rv,
      render: e
    };
  };
  K.isValidElement = $i;
  K.lazy = function (e) {
    return {
      $$typeof: ap,
      _payload: {
        _status: -1,
        _result: e
      },
      _init: pv
    };
  };
  K.memo = function (e, a) {
    return {
      $$typeof: uv,
      type: e,
      compare: a === void 0 ? null : a
    };
  };
  K.startTransition = function (e) {
    var a = Te.T,
      t = {};
    Te.T = t;
    try {
      var l = e(),
        o = Te.S;
      o !== null && o(t, l), typeof l == "object" && l !== null && typeof l.then == "function" && l.then(Yi, ep);
    } catch (r) {
      ep(r);
    } finally {
      a !== null && t.types !== null && (a.types = t.types), Te.T = a;
    }
  };
  K.unstable_useCacheRefresh = function () {
    return Te.H.useCacheRefresh();
  };
  K.use = function (e) {
    return Te.H.use(e);
  };
  K.useActionState = function (e, a, t) {
    return Te.H.useActionState(e, a, t);
  };
  K.useCallback = function (e, a) {
    return Te.H.useCallback(e, a);
  };
  K.useContext = function (e) {
    return Te.H.useContext(e);
  };
  K.useDebugValue = function () {};
  K.useDeferredValue = function (e, a) {
    return Te.H.useDeferredValue(e, a);
  };
  K.useEffect = function (e, a) {
    return Te.H.useEffect(e, a);
  };
  K.useEffectEvent = function (e) {
    return Te.H.useEffectEvent(e);
  };
  K.useId = function () {
    return Te.H.useId();
  };
  K.useImperativeHandle = function (e, a, t) {
    return Te.H.useImperativeHandle(e, a, t);
  };
  K.useInsertionEffect = function (e, a) {
    return Te.H.useInsertionEffect(e, a);
  };
  K.useLayoutEffect = function (e, a) {
    return Te.H.useLayoutEffect(e, a);
  };
  K.useMemo = function (e, a) {
    return Te.H.useMemo(e, a);
  };
  K.useOptimistic = function (e, a) {
    return Te.H.useOptimistic(e, a);
  };
  K.useReducer = function (e, a, t) {
    return Te.H.useReducer(e, a, t);
  };
  K.useRef = function (e) {
    return Te.H.useRef(e);
  };
  K.useState = function (e) {
    return Te.H.useState(e);
  };
  K.useSyncExternalStore = function (e, a, t) {
    return Te.H.useSyncExternalStore(e, a, t);
  };
  K.useTransition = function () {
    return Te.H.useTransition();
  };
  K.version = "19.2.8";
});
var Fe = gt((Cw, sp) => {
  "use strict";

  sp.exports = up();
});
var dp = gt(La => {
  "use strict";

  var gv = Fe();
  function ip(e) {
    var a = "https://react.dev/errors/" + e;
    if (1 < arguments.length) {
      a += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var t = 2; t < arguments.length; t++) a += "&args[]=" + encodeURIComponent(arguments[t]);
    }
    return "Minified React error #" + e + "; visit " + a + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function sl() {}
  var ya = {
      d: {
        f: sl,
        r: function () {
          throw Error(ip(522));
        },
        D: sl,
        C: sl,
        L: sl,
        m: sl,
        X: sl,
        S: sl,
        M: sl
      },
      p: 0,
      findDOMNode: null
    },
    hv = Symbol.for("react.portal");
  function xv(e, a, t) {
    var l = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: hv,
      key: l == null ? null : "" + l,
      children: e,
      containerInfo: a,
      implementation: t
    };
  }
  var Yr = gv.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function _u(e, a) {
    if (e === "font") return "";
    if (typeof a == "string") return a === "use-credentials" ? a : "";
  }
  La.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = ya;
  La.createPortal = function (e, a) {
    var t = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!a || a.nodeType !== 1 && a.nodeType !== 9 && a.nodeType !== 11) throw Error(ip(299));
    return xv(e, a, null, t);
  };
  La.flushSync = function (e) {
    var a = Yr.T,
      t = ya.p;
    try {
      if (Yr.T = null, ya.p = 2, e) return e();
    } finally {
      Yr.T = a, ya.p = t, ya.d.f();
    }
  };
  La.preconnect = function (e, a) {
    typeof e == "string" && (a ? (a = a.crossOrigin, a = typeof a == "string" ? a === "use-credentials" ? a : "" : void 0) : a = null, ya.d.C(e, a));
  };
  La.prefetchDNS = function (e) {
    typeof e == "string" && ya.d.D(e);
  };
  La.preinit = function (e, a) {
    if (typeof e == "string" && a && typeof a.as == "string") {
      var t = a.as,
        l = _u(t, a.crossOrigin),
        o = typeof a.integrity == "string" ? a.integrity : void 0,
        r = typeof a.fetchPriority == "string" ? a.fetchPriority : void 0;
      t === "style" ? ya.d.S(e, typeof a.precedence == "string" ? a.precedence : void 0, {
        crossOrigin: l,
        integrity: o,
        fetchPriority: r
      }) : t === "script" && ya.d.X(e, {
        crossOrigin: l,
        integrity: o,
        fetchPriority: r,
        nonce: typeof a.nonce == "string" ? a.nonce : void 0
      });
    }
  };
  La.preinitModule = function (e, a) {
    if (typeof e == "string") if (typeof a == "object" && a !== null) {
      if (a.as == null || a.as === "script") {
        var t = _u(a.as, a.crossOrigin);
        ya.d.M(e, {
          crossOrigin: t,
          integrity: typeof a.integrity == "string" ? a.integrity : void 0,
          nonce: typeof a.nonce == "string" ? a.nonce : void 0
        });
      }
    } else a == null && ya.d.M(e);
  };
  La.preload = function (e, a) {
    if (typeof e == "string" && typeof a == "object" && a !== null && typeof a.as == "string") {
      var t = a.as,
        l = _u(t, a.crossOrigin);
      ya.d.L(e, t, {
        crossOrigin: l,
        integrity: typeof a.integrity == "string" ? a.integrity : void 0,
        nonce: typeof a.nonce == "string" ? a.nonce : void 0,
        type: typeof a.type == "string" ? a.type : void 0,
        fetchPriority: typeof a.fetchPriority == "string" ? a.fetchPriority : void 0,
        referrerPolicy: typeof a.referrerPolicy == "string" ? a.referrerPolicy : void 0,
        imageSrcSet: typeof a.imageSrcSet == "string" ? a.imageSrcSet : void 0,
        imageSizes: typeof a.imageSizes == "string" ? a.imageSizes : void 0,
        media: typeof a.media == "string" ? a.media : void 0
      });
    }
  };
  La.preloadModule = function (e, a) {
    if (typeof e == "string") if (a) {
      var t = _u(a.as, a.crossOrigin);
      ya.d.m(e, {
        as: typeof a.as == "string" && a.as !== "script" ? a.as : void 0,
        crossOrigin: t,
        integrity: typeof a.integrity == "string" ? a.integrity : void 0
      });
    } else ya.d.m(e);
  };
  La.requestFormReset = function (e) {
    ya.d.r(e);
  };
  La.unstable_batchedUpdates = function (e, a) {
    return e(a);
  };
  La.useFormState = function (e, a, t) {
    return Yr.H.useFormState(e, a, t);
  };
  La.useFormStatus = function () {
    return Yr.H.useHostTransitionStatus();
  };
  La.version = "19.2.8";
});
var pp = gt((kw, fp) => {
  "use strict";

  function cp() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function")) try {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(cp);
    } catch (e) {
      console.error(e);
    }
  }
  cp(), fp.exports = dp();
});
var kx = gt(pi => {
  "use strict";

  var la = Qf(),
    Fm = Fe(),
    bv = pp();
  function k(e) {
    var a = "https://react.dev/errors/" + e;
    if (1 < arguments.length) {
      a += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var t = 2; t < arguments.length; t++) a += "&args[]=" + encodeURIComponent(arguments[t]);
    }
    return "Minified React error #" + e + "; visit " + a + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function Pm(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
  }
  function En(e) {
    var a = e,
      t = e;
    if (e.alternate) for (; a.return;) a = a.return;else {
      e = a;
      do a = e, (a.flags & 4098) !== 0 && (t = a.return), e = a.return; while (e);
    }
    return a.tag === 3 ? t : null;
  }
  function Hm(e) {
    if (e.tag === 13) {
      var a = e.memoizedState;
      if (a === null && (e = e.alternate, e !== null && (a = e.memoizedState)), a !== null) return a.dehydrated;
    }
    return null;
  }
  function _m(e) {
    if (e.tag === 31) {
      var a = e.memoizedState;
      if (a === null && (e = e.alternate, e !== null && (a = e.memoizedState)), a !== null) return a.dehydrated;
    }
    return null;
  }
  function mp(e) {
    if (En(e) !== e) throw Error(k(188));
  }
  function vv(e) {
    var a = e.alternate;
    if (!a) {
      if (a = En(e), a === null) throw Error(k(188));
      return a !== e ? null : e;
    }
    for (var t = e, l = a;;) {
      var o = t.return;
      if (o === null) break;
      var r = o.alternate;
      if (r === null) {
        if (l = o.return, l !== null) {
          t = l;
          continue;
        }
        break;
      }
      if (o.child === r.child) {
        for (r = o.child; r;) {
          if (r === t) return mp(o), e;
          if (r === l) return mp(o), a;
          r = r.sibling;
        }
        throw Error(k(188));
      }
      if (t.return !== l.return) t = o, l = r;else {
        for (var n = !1, u = o.child; u;) {
          if (u === t) {
            n = !0, t = o, l = r;
            break;
          }
          if (u === l) {
            n = !0, l = o, t = r;
            break;
          }
          u = u.sibling;
        }
        if (!n) {
          for (u = r.child; u;) {
            if (u === t) {
              n = !0, t = r, l = o;
              break;
            }
            if (u === l) {
              n = !0, l = r, t = o;
              break;
            }
            u = u.sibling;
          }
          if (!n) throw Error(k(189));
        }
      }
      if (t.alternate !== l) throw Error(k(190));
    }
    if (t.tag !== 3) throw Error(k(188));
    return t.stateNode.current === t ? e : a;
  }
  function Gm(e) {
    var a = e.tag;
    if (a === 5 || a === 26 || a === 27 || a === 6) return e;
    for (e = e.child; e !== null;) {
      if (a = Gm(e), a !== null) return a;
      e = e.sibling;
    }
    return null;
  }
  var Be = Object.assign,
    yv = Symbol.for("react.element"),
    Gu = Symbol.for("react.transitional.element"),
    tn = Symbol.for("react.portal"),
    Xo = Symbol.for("react.fragment"),
    Vm = Symbol.for("react.strict_mode"),
    Bd = Symbol.for("react.profiler"),
    Xm = Symbol.for("react.consumer"),
    zt = Symbol.for("react.context"),
    Mc = Symbol.for("react.forward_ref"),
    Od = Symbol.for("react.suspense"),
    Ed = Symbol.for("react.suspense_list"),
    Nc = Symbol.for("react.memo"),
    il = Symbol.for("react.lazy"),
    zd = Symbol.for("react.activity"),
    Lv = Symbol.for("react.memo_cache_sentinel"),
    gp = Symbol.iterator;
  function Kr(e) {
    return e === null || typeof e != "object" ? null : (e = gp && e[gp] || e["@@iterator"], typeof e == "function" ? e : null);
  }
  var wv = Symbol.for("react.client.reference");
  function Ud(e) {
    if (e == null) return null;
    if (typeof e == "function") return e.$$typeof === wv ? null : e.displayName || e.name || null;
    if (typeof e == "string") return e;
    switch (e) {
      case Xo:
        return "Fragment";
      case Bd:
        return "Profiler";
      case Vm:
        return "StrictMode";
      case Od:
        return "Suspense";
      case Ed:
        return "SuspenseList";
      case zd:
        return "Activity";
    }
    if (typeof e == "object") switch (e.$$typeof) {
      case tn:
        return "Portal";
      case zt:
        return e.displayName || "Context";
      case Xm:
        return (e._context.displayName || "Context") + ".Consumer";
      case Mc:
        var a = e.render;
        return e = e.displayName, e || (e = a.displayName || a.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
      case Nc:
        return a = e.displayName || null, a !== null ? a : Ud(e.type) || "Memo";
      case il:
        a = e._payload, e = e._init;
        try {
          return Ud(e(a));
        } catch {}
    }
    return null;
  }
  var ln = Array.isArray,
    Y = Fm.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
    ge = bv.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
    ao = {
      pending: !1,
      data: null,
      method: null,
      action: null
    },
    qd = [],
    jo = -1;
  function Lt(e) {
    return {
      current: e
    };
  }
  function sa(e) {
    0 > jo || (e.current = qd[jo], qd[jo] = null, jo--);
  }
  function Me(e, a) {
    jo++, qd[jo] = e.current, e.current = a;
  }
  var yt = Lt(null),
    Ln = Lt(null),
    yl = Lt(null),
    ws = Lt(null);
  function Cs(e, a) {
    switch (Me(yl, a), Me(Ln, e), Me(yt, null), a.nodeType) {
      case 9:
      case 11:
        e = (e = a.documentElement) && (e = e.namespaceURI) ? wm(e) : 0;
        break;
      default:
        if (e = a.tagName, a = a.namespaceURI) a = wm(a), e = cx(a, e);else switch (e) {
          case "svg":
            e = 1;
            break;
          case "math":
            e = 2;
            break;
          default:
            e = 0;
        }
    }
    sa(yt), Me(yt, e);
  }
  function dr() {
    sa(yt), sa(Ln), sa(yl);
  }
  function Fd(e) {
    e.memoizedState !== null && Me(ws, e);
    var a = yt.current,
      t = cx(a, e.type);
    a !== t && (Me(Ln, e), Me(yt, t));
  }
  function Ss(e) {
    Ln.current === e && (sa(yt), sa(Ln)), ws.current === e && (sa(ws), Rn._currentValue = ao);
  }
  var ed, hp;
  function Wl(e) {
    if (ed === void 0) try {
      throw Error();
    } catch (t) {
      var a = t.stack.trim().match(/\n( *(at )?)/);
      ed = a && a[1] || "", hp = -1 < t.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < t.stack.indexOf("@") ? "@unknown:0:0" : "";
    }
    return `
` + ed + e + hp;
  }
  var ad = !1;
  function td(e, a) {
    if (!e || ad) return "";
    ad = !0;
    var t = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      var l = {
        DetermineComponentFrameRoot: function () {
          try {
            if (a) {
              var x = function () {
                throw Error();
              };
              if (Object.defineProperty(x.prototype, "props", {
                set: function () {
                  throw Error();
                }
              }), typeof Reflect == "object" && Reflect.construct) {
                try {
                  Reflect.construct(x, []);
                } catch (g) {
                  var m = g;
                }
                Reflect.construct(e, [], x);
              } else {
                try {
                  x.call();
                } catch (g) {
                  m = g;
                }
                e.call(x.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (g) {
                m = g;
              }
              (x = e()) && typeof x.catch == "function" && x.catch(function () {});
            }
          } catch (g) {
            if (g && m && typeof g.stack == "string") return [g.stack, m.stack];
          }
          return [null, null];
        }
      };
      l.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
      var o = Object.getOwnPropertyDescriptor(l.DetermineComponentFrameRoot, "name");
      o && o.configurable && Object.defineProperty(l.DetermineComponentFrameRoot, "name", {
        value: "DetermineComponentFrameRoot"
      });
      var r = l.DetermineComponentFrameRoot(),
        n = r[0],
        u = r[1];
      if (n && u) {
        var s = n.split(`
`),
          i = u.split(`
`);
        for (o = l = 0; l < s.length && !s[l].includes("DetermineComponentFrameRoot");) l++;
        for (; o < i.length && !i[o].includes("DetermineComponentFrameRoot");) o++;
        if (l === s.length || o === i.length) for (l = s.length - 1, o = i.length - 1; 1 <= l && 0 <= o && s[l] !== i[o];) o--;
        for (; 1 <= l && 0 <= o; l--, o--) if (s[l] !== i[o]) {
          if (l !== 1 || o !== 1) do if (l--, o--, 0 > o || s[l] !== i[o]) {
            var d = `
` + s[l].replace(" at new ", " at ");
            return e.displayName && d.includes("<anonymous>") && (d = d.replace("<anonymous>", e.displayName)), d;
          } while (1 <= l && 0 <= o);
          break;
        }
      }
    } finally {
      ad = !1, Error.prepareStackTrace = t;
    }
    return (t = e ? e.displayName || e.name : "") ? Wl(t) : "";
  }
  function Cv(e, a) {
    switch (e.tag) {
      case 26:
      case 27:
      case 5:
        return Wl(e.type);
      case 16:
        return Wl("Lazy");
      case 13:
        return e.child !== a && a !== null ? Wl("Suspense Fallback") : Wl("Suspense");
      case 19:
        return Wl("SuspenseList");
      case 0:
      case 15:
        return td(e.type, !1);
      case 11:
        return td(e.type.render, !1);
      case 1:
        return td(e.type, !0);
      case 31:
        return Wl("Activity");
      default:
        return "";
    }
  }
  function xp(e) {
    try {
      var a = "",
        t = null;
      do a += Cv(e, t), t = e, e = e.return; while (e);
      return a;
    } catch (l) {
      return `
Error generating stack: ` + l.message + `
` + l.stack;
    }
  }
  var Pd = Object.prototype.hasOwnProperty,
    Tc = la.unstable_scheduleCallback,
    ld = la.unstable_cancelCallback,
    Sv = la.unstable_shouldYield,
    kv = la.unstable_requestPaint,
    Pa = la.unstable_now,
    Iv = la.unstable_getCurrentPriorityLevel,
    jm = la.unstable_ImmediatePriority,
    Zm = la.unstable_UserBlockingPriority,
    ks = la.unstable_NormalPriority,
    Av = la.unstable_LowPriority,
    Ym = la.unstable_IdlePriority,
    Mv = la.log,
    Nv = la.unstable_setDisableYieldValue,
    zn = null,
    Ha = null;
  function gl(e) {
    if (typeof Mv == "function" && Nv(e), Ha && typeof Ha.setStrictMode == "function") try {
      Ha.setStrictMode(zn, e);
    } catch {}
  }
  var _a = Math.clz32 ? Math.clz32 : Rv,
    Tv = Math.log,
    Dv = Math.LN2;
  function Rv(e) {
    return e >>>= 0, e === 0 ? 32 : 31 - (Tv(e) / Dv | 0) | 0;
  }
  var Vu = 256,
    Xu = 262144,
    ju = 4194304;
  function Jl(e) {
    var a = e & 42;
    if (a !== 0) return a;
    switch (e & -e) {
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
        return e & 261888;
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return e & 3932160;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return e & 62914560;
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
        return e;
    }
  }
  function Ws(e, a, t) {
    var l = e.pendingLanes;
    if (l === 0) return 0;
    var o = 0,
      r = e.suspendedLanes,
      n = e.pingedLanes;
    e = e.warmLanes;
    var u = l & 134217727;
    return u !== 0 ? (l = u & ~r, l !== 0 ? o = Jl(l) : (n &= u, n !== 0 ? o = Jl(n) : t || (t = u & ~e, t !== 0 && (o = Jl(t))))) : (u = l & ~r, u !== 0 ? o = Jl(u) : n !== 0 ? o = Jl(n) : t || (t = l & ~e, t !== 0 && (o = Jl(t)))), o === 0 ? 0 : a !== 0 && a !== o && (a & r) === 0 && (r = o & -o, t = a & -a, r >= t || r === 32 && (t & 4194048) !== 0) ? a : o;
  }
  function Un(e, a) {
    return (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & a) === 0;
  }
  function Bv(e, a) {
    switch (e) {
      case 1:
      case 2:
      case 4:
      case 8:
      case 64:
        return a + 250;
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
        return a + 5e3;
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
  function Km() {
    var e = ju;
    return ju <<= 1, (ju & 62914560) === 0 && (ju = 4194304), e;
  }
  function od(e) {
    for (var a = [], t = 0; 31 > t; t++) a.push(e);
    return a;
  }
  function qn(e, a) {
    e.pendingLanes |= a, a !== 268435456 && (e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0);
  }
  function Ov(e, a, t, l, o, r) {
    var n = e.pendingLanes;
    e.pendingLanes = t, e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0, e.expiredLanes &= t, e.entangledLanes &= t, e.errorRecoveryDisabledLanes &= t, e.shellSuspendCounter = 0;
    var u = e.entanglements,
      s = e.expirationTimes,
      i = e.hiddenUpdates;
    for (t = n & ~t; 0 < t;) {
      var d = 31 - _a(t),
        x = 1 << d;
      u[d] = 0, s[d] = -1;
      var m = i[d];
      if (m !== null) for (i[d] = null, d = 0; d < m.length; d++) {
        var g = m[d];
        g !== null && (g.lane &= -536870913);
      }
      t &= ~x;
    }
    l !== 0 && Qm(e, l, 0), r !== 0 && o === 0 && e.tag !== 0 && (e.suspendedLanes |= r & ~(n & ~a));
  }
  function Qm(e, a, t) {
    e.pendingLanes |= a, e.suspendedLanes &= ~a;
    var l = 31 - _a(a);
    e.entangledLanes |= a, e.entanglements[l] = e.entanglements[l] | 1073741824 | t & 261930;
  }
  function Wm(e, a) {
    var t = e.entangledLanes |= a;
    for (e = e.entanglements; t;) {
      var l = 31 - _a(t),
        o = 1 << l;
      o & a | e[l] & a && (e[l] |= a), t &= ~o;
    }
  }
  function Jm(e, a) {
    var t = a & -a;
    return t = (t & 42) !== 0 ? 1 : Dc(t), (t & (e.suspendedLanes | a)) !== 0 ? 0 : t;
  }
  function Dc(e) {
    switch (e) {
      case 2:
        e = 1;
        break;
      case 8:
        e = 4;
        break;
      case 32:
        e = 16;
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
        e = 128;
        break;
      case 268435456:
        e = 134217728;
        break;
      default:
        e = 0;
    }
    return e;
  }
  function Rc(e) {
    return e &= -e, 2 < e ? 8 < e ? (e & 134217727) !== 0 ? 32 : 268435456 : 8 : 2;
  }
  function $m() {
    var e = ge.p;
    return e !== 0 ? e : (e = window.event, e === void 0 ? 32 : wx(e.type));
  }
  function bp(e, a) {
    var t = ge.p;
    try {
      return ge.p = e, a();
    } finally {
      ge.p = t;
    }
  }
  var Bl = Math.random().toString(36).slice(2),
    ca = "__reactFiber$" + Bl,
    Da = "__reactProps$" + Bl,
    Lr = "__reactContainer$" + Bl,
    Hd = "__reactEvents$" + Bl,
    Ev = "__reactListeners$" + Bl,
    zv = "__reactHandles$" + Bl,
    vp = "__reactResources$" + Bl,
    Fn = "__reactMarker$" + Bl;
  function Bc(e) {
    delete e[ca], delete e[Da], delete e[Hd], delete e[Ev], delete e[zv];
  }
  function Zo(e) {
    var a = e[ca];
    if (a) return a;
    for (var t = e.parentNode; t;) {
      if (a = t[Lr] || t[ca]) {
        if (t = a.alternate, a.child !== null || t !== null && t.child !== null) for (e = Am(e); e !== null;) {
          if (t = e[ca]) return t;
          e = Am(e);
        }
        return a;
      }
      e = t, t = e.parentNode;
    }
    return null;
  }
  function wr(e) {
    if (e = e[ca] || e[Lr]) {
      var a = e.tag;
      if (a === 5 || a === 6 || a === 13 || a === 31 || a === 26 || a === 27 || a === 3) return e;
    }
    return null;
  }
  function on(e) {
    var a = e.tag;
    if (a === 5 || a === 26 || a === 27 || a === 6) return e.stateNode;
    throw Error(k(33));
  }
  function lr(e) {
    var a = e[vp];
    return a || (a = e[vp] = {
      hoistableStyles: new Map(),
      hoistableScripts: new Map()
    }), a;
  }
  function ua(e) {
    e[Fn] = !0;
  }
  var eg = new Set(),
    ag = {};
  function fo(e, a) {
    cr(e, a), cr(e + "Capture", a);
  }
  function cr(e, a) {
    for (ag[e] = a, e = 0; e < a.length; e++) eg.add(a[e]);
  }
  var Uv = RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"),
    yp = {},
    Lp = {};
  function qv(e) {
    return Pd.call(Lp, e) ? !0 : Pd.call(yp, e) ? !1 : Uv.test(e) ? Lp[e] = !0 : (yp[e] = !0, !1);
  }
  function us(e, a, t) {
    if (qv(a)) if (t === null) e.removeAttribute(a);else {
      switch (typeof t) {
        case "undefined":
        case "function":
        case "symbol":
          e.removeAttribute(a);
          return;
        case "boolean":
          var l = a.toLowerCase().slice(0, 5);
          if (l !== "data-" && l !== "aria-") {
            e.removeAttribute(a);
            return;
          }
      }
      e.setAttribute(a, "" + t);
    }
  }
  function Zu(e, a, t) {
    if (t === null) e.removeAttribute(a);else {
      switch (typeof t) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          e.removeAttribute(a);
          return;
      }
      e.setAttribute(a, "" + t);
    }
  }
  function Nt(e, a, t, l) {
    if (l === null) e.removeAttribute(t);else {
      switch (typeof l) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          e.removeAttribute(t);
          return;
      }
      e.setAttributeNS(a, t, "" + l);
    }
  }
  function Qa(e) {
    switch (typeof e) {
      case "bigint":
      case "boolean":
      case "number":
      case "string":
      case "undefined":
        return e;
      case "object":
        return e;
      default:
        return "";
    }
  }
  function tg(e) {
    var a = e.type;
    return (e = e.nodeName) && e.toLowerCase() === "input" && (a === "checkbox" || a === "radio");
  }
  function Fv(e, a, t) {
    var l = Object.getOwnPropertyDescriptor(e.constructor.prototype, a);
    if (!e.hasOwnProperty(a) && typeof l < "u" && typeof l.get == "function" && typeof l.set == "function") {
      var o = l.get,
        r = l.set;
      return Object.defineProperty(e, a, {
        configurable: !0,
        get: function () {
          return o.call(this);
        },
        set: function (n) {
          t = "" + n, r.call(this, n);
        }
      }), Object.defineProperty(e, a, {
        enumerable: l.enumerable
      }), {
        getValue: function () {
          return t;
        },
        setValue: function (n) {
          t = "" + n;
        },
        stopTracking: function () {
          e._valueTracker = null, delete e[a];
        }
      };
    }
  }
  function _d(e) {
    if (!e._valueTracker) {
      var a = tg(e) ? "checked" : "value";
      e._valueTracker = Fv(e, a, "" + e[a]);
    }
  }
  function lg(e) {
    if (!e) return !1;
    var a = e._valueTracker;
    if (!a) return !0;
    var t = a.getValue(),
      l = "";
    return e && (l = tg(e) ? e.checked ? "true" : "false" : e.value), e = l, e !== t ? (a.setValue(e), !0) : !1;
  }
  function Is(e) {
    if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u") return null;
    try {
      return e.activeElement || e.body;
    } catch {
      return e.body;
    }
  }
  var Pv = /[\n"\\]/g;
  function $a(e) {
    return e.replace(Pv, function (a) {
      return "\\" + a.charCodeAt(0).toString(16) + " ";
    });
  }
  function Gd(e, a, t, l, o, r, n, u) {
    e.name = "", n != null && typeof n != "function" && typeof n != "symbol" && typeof n != "boolean" ? e.type = n : e.removeAttribute("type"), a != null ? n === "number" ? (a === 0 && e.value === "" || e.value != a) && (e.value = "" + Qa(a)) : e.value !== "" + Qa(a) && (e.value = "" + Qa(a)) : n !== "submit" && n !== "reset" || e.removeAttribute("value"), a != null ? Vd(e, n, Qa(a)) : t != null ? Vd(e, n, Qa(t)) : l != null && e.removeAttribute("value"), o == null && r != null && (e.defaultChecked = !!r), o != null && (e.checked = o && typeof o != "function" && typeof o != "symbol"), u != null && typeof u != "function" && typeof u != "symbol" && typeof u != "boolean" ? e.name = "" + Qa(u) : e.removeAttribute("name");
  }
  function og(e, a, t, l, o, r, n, u) {
    if (r != null && typeof r != "function" && typeof r != "symbol" && typeof r != "boolean" && (e.type = r), a != null || t != null) {
      if (!(r !== "submit" && r !== "reset" || a != null)) {
        _d(e);
        return;
      }
      t = t != null ? "" + Qa(t) : "", a = a != null ? "" + Qa(a) : t, u || a === e.value || (e.value = a), e.defaultValue = a;
    }
    l = l ?? o, l = typeof l != "function" && typeof l != "symbol" && !!l, e.checked = u ? e.checked : !!l, e.defaultChecked = !!l, n != null && typeof n != "function" && typeof n != "symbol" && typeof n != "boolean" && (e.name = n), _d(e);
  }
  function Vd(e, a, t) {
    a === "number" && Is(e.ownerDocument) === e || e.defaultValue === "" + t || (e.defaultValue = "" + t);
  }
  function or(e, a, t, l) {
    if (e = e.options, a) {
      a = {};
      for (var o = 0; o < t.length; o++) a["$" + t[o]] = !0;
      for (t = 0; t < e.length; t++) o = a.hasOwnProperty("$" + e[t].value), e[t].selected !== o && (e[t].selected = o), o && l && (e[t].defaultSelected = !0);
    } else {
      for (t = "" + Qa(t), a = null, o = 0; o < e.length; o++) {
        if (e[o].value === t) {
          e[o].selected = !0, l && (e[o].defaultSelected = !0);
          return;
        }
        a !== null || e[o].disabled || (a = e[o]);
      }
      a !== null && (a.selected = !0);
    }
  }
  function rg(e, a, t) {
    if (a != null && (a = "" + Qa(a), a !== e.value && (e.value = a), t == null)) {
      e.defaultValue !== a && (e.defaultValue = a);
      return;
    }
    e.defaultValue = t != null ? "" + Qa(t) : "";
  }
  function ng(e, a, t, l) {
    if (a == null) {
      if (l != null) {
        if (t != null) throw Error(k(92));
        if (ln(l)) {
          if (1 < l.length) throw Error(k(93));
          l = l[0];
        }
        t = l;
      }
      t == null && (t = ""), a = t;
    }
    t = Qa(a), e.defaultValue = t, l = e.textContent, l === t && l !== "" && l !== null && (e.value = l), _d(e);
  }
  function fr(e, a) {
    if (a) {
      var t = e.firstChild;
      if (t && t === e.lastChild && t.nodeType === 3) {
        t.nodeValue = a;
        return;
      }
    }
    e.textContent = a;
  }
  var Hv = new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));
  function wp(e, a, t) {
    var l = a.indexOf("--") === 0;
    t == null || typeof t == "boolean" || t === "" ? l ? e.setProperty(a, "") : a === "float" ? e.cssFloat = "" : e[a] = "" : l ? e.setProperty(a, t) : typeof t != "number" || t === 0 || Hv.has(a) ? a === "float" ? e.cssFloat = t : e[a] = ("" + t).trim() : e[a] = t + "px";
  }
  function ug(e, a, t) {
    if (a != null && typeof a != "object") throw Error(k(62));
    if (e = e.style, t != null) {
      for (var l in t) !t.hasOwnProperty(l) || a != null && a.hasOwnProperty(l) || (l.indexOf("--") === 0 ? e.setProperty(l, "") : l === "float" ? e.cssFloat = "" : e[l] = "");
      for (var o in a) l = a[o], a.hasOwnProperty(o) && t[o] !== l && wp(e, o, l);
    } else for (var r in a) a.hasOwnProperty(r) && wp(e, r, a[r]);
  }
  function Oc(e) {
    if (e.indexOf("-") === -1) return !1;
    switch (e) {
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
  var _v = new Map([["acceptCharset", "accept-charset"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"], ["crossOrigin", "crossorigin"], ["accentHeight", "accent-height"], ["alignmentBaseline", "alignment-baseline"], ["arabicForm", "arabic-form"], ["baselineShift", "baseline-shift"], ["capHeight", "cap-height"], ["clipPath", "clip-path"], ["clipRule", "clip-rule"], ["colorInterpolation", "color-interpolation"], ["colorInterpolationFilters", "color-interpolation-filters"], ["colorProfile", "color-profile"], ["colorRendering", "color-rendering"], ["dominantBaseline", "dominant-baseline"], ["enableBackground", "enable-background"], ["fillOpacity", "fill-opacity"], ["fillRule", "fill-rule"], ["floodColor", "flood-color"], ["floodOpacity", "flood-opacity"], ["fontFamily", "font-family"], ["fontSize", "font-size"], ["fontSizeAdjust", "font-size-adjust"], ["fontStretch", "font-stretch"], ["fontStyle", "font-style"], ["fontVariant", "font-variant"], ["fontWeight", "font-weight"], ["glyphName", "glyph-name"], ["glyphOrientationHorizontal", "glyph-orientation-horizontal"], ["glyphOrientationVertical", "glyph-orientation-vertical"], ["horizAdvX", "horiz-adv-x"], ["horizOriginX", "horiz-origin-x"], ["imageRendering", "image-rendering"], ["letterSpacing", "letter-spacing"], ["lightingColor", "lighting-color"], ["markerEnd", "marker-end"], ["markerMid", "marker-mid"], ["markerStart", "marker-start"], ["overlinePosition", "overline-position"], ["overlineThickness", "overline-thickness"], ["paintOrder", "paint-order"], ["panose-1", "panose-1"], ["pointerEvents", "pointer-events"], ["renderingIntent", "rendering-intent"], ["shapeRendering", "shape-rendering"], ["stopColor", "stop-color"], ["stopOpacity", "stop-opacity"], ["strikethroughPosition", "strikethrough-position"], ["strikethroughThickness", "strikethrough-thickness"], ["strokeDasharray", "stroke-dasharray"], ["strokeDashoffset", "stroke-dashoffset"], ["strokeLinecap", "stroke-linecap"], ["strokeLinejoin", "stroke-linejoin"], ["strokeMiterlimit", "stroke-miterlimit"], ["strokeOpacity", "stroke-opacity"], ["strokeWidth", "stroke-width"], ["textAnchor", "text-anchor"], ["textDecoration", "text-decoration"], ["textRendering", "text-rendering"], ["transformOrigin", "transform-origin"], ["underlinePosition", "underline-position"], ["underlineThickness", "underline-thickness"], ["unicodeBidi", "unicode-bidi"], ["unicodeRange", "unicode-range"], ["unitsPerEm", "units-per-em"], ["vAlphabetic", "v-alphabetic"], ["vHanging", "v-hanging"], ["vIdeographic", "v-ideographic"], ["vMathematical", "v-mathematical"], ["vectorEffect", "vector-effect"], ["vertAdvY", "vert-adv-y"], ["vertOriginX", "vert-origin-x"], ["vertOriginY", "vert-origin-y"], ["wordSpacing", "word-spacing"], ["writingMode", "writing-mode"], ["xmlnsXlink", "xmlns:xlink"], ["xHeight", "x-height"]]),
    Gv = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function ss(e) {
    return Gv.test("" + e) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : e;
  }
  function Ut() {}
  var Xd = null;
  function Ec(e) {
    return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
  }
  var Yo = null,
    rr = null;
  function Cp(e) {
    var a = wr(e);
    if (a && (e = a.stateNode)) {
      var t = e[Da] || null;
      e: switch (e = a.stateNode, a.type) {
        case "input":
          if (Gd(e, t.value, t.defaultValue, t.defaultValue, t.checked, t.defaultChecked, t.type, t.name), a = t.name, t.type === "radio" && a != null) {
            for (t = e; t.parentNode;) t = t.parentNode;
            for (t = t.querySelectorAll('input[name="' + $a("" + a) + '"][type="radio"]'), a = 0; a < t.length; a++) {
              var l = t[a];
              if (l !== e && l.form === e.form) {
                var o = l[Da] || null;
                if (!o) throw Error(k(90));
                Gd(l, o.value, o.defaultValue, o.defaultValue, o.checked, o.defaultChecked, o.type, o.name);
              }
            }
            for (a = 0; a < t.length; a++) l = t[a], l.form === e.form && lg(l);
          }
          break e;
        case "textarea":
          rg(e, t.value, t.defaultValue);
          break e;
        case "select":
          a = t.value, a != null && or(e, !!t.multiple, a, !1);
      }
    }
  }
  var rd = !1;
  function sg(e, a, t) {
    if (rd) return e(a, t);
    rd = !0;
    try {
      var l = e(a);
      return l;
    } finally {
      if (rd = !1, (Yo !== null || rr !== null) && (ii(), Yo && (a = Yo, e = rr, rr = Yo = null, Cp(a), e))) for (a = 0; a < e.length; a++) Cp(e[a]);
    }
  }
  function wn(e, a) {
    var t = e.stateNode;
    if (t === null) return null;
    var l = t[Da] || null;
    if (l === null) return null;
    t = l[a];
    e: switch (a) {
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
        (l = !l.disabled) || (e = e.type, l = !(e === "button" || e === "input" || e === "select" || e === "textarea")), e = !l;
        break e;
      default:
        e = !1;
    }
    if (e) return null;
    if (t && typeof t != "function") throw Error(k(231, a, typeof t));
    return t;
  }
  var _t = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"),
    jd = !1;
  if (_t) try {
    Po = {}, Object.defineProperty(Po, "passive", {
      get: function () {
        jd = !0;
      }
    }), window.addEventListener("test", Po, Po), window.removeEventListener("test", Po, Po);
  } catch {
    jd = !1;
  }
  var Po,
    hl = null,
    zc = null,
    is = null;
  function ig() {
    if (is) return is;
    var e,
      a = zc,
      t = a.length,
      l,
      o = "value" in hl ? hl.value : hl.textContent,
      r = o.length;
    for (e = 0; e < t && a[e] === o[e]; e++);
    var n = t - e;
    for (l = 1; l <= n && a[t - l] === o[r - l]; l++);
    return is = o.slice(e, 1 < l ? 1 - l : void 0);
  }
  function ds(e) {
    var a = e.keyCode;
    return "charCode" in e ? (e = e.charCode, e === 0 && a === 13 && (e = 13)) : e = a, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
  }
  function Yu() {
    return !0;
  }
  function Sp() {
    return !1;
  }
  function Ra(e) {
    function a(t, l, o, r, n) {
      this._reactName = t, this._targetInst = o, this.type = l, this.nativeEvent = r, this.target = n, this.currentTarget = null;
      for (var u in e) e.hasOwnProperty(u) && (t = e[u], this[u] = t ? t(r) : r[u]);
      return this.isDefaultPrevented = (r.defaultPrevented != null ? r.defaultPrevented : r.returnValue === !1) ? Yu : Sp, this.isPropagationStopped = Sp, this;
    }
    return Be(a.prototype, {
      preventDefault: function () {
        this.defaultPrevented = !0;
        var t = this.nativeEvent;
        t && (t.preventDefault ? t.preventDefault() : typeof t.returnValue != "unknown" && (t.returnValue = !1), this.isDefaultPrevented = Yu);
      },
      stopPropagation: function () {
        var t = this.nativeEvent;
        t && (t.stopPropagation ? t.stopPropagation() : typeof t.cancelBubble != "unknown" && (t.cancelBubble = !0), this.isPropagationStopped = Yu);
      },
      persist: function () {},
      isPersistent: Yu
    }), a;
  }
  var po = {
      eventPhase: 0,
      bubbles: 0,
      cancelable: 0,
      timeStamp: function (e) {
        return e.timeStamp || Date.now();
      },
      defaultPrevented: 0,
      isTrusted: 0
    },
    Js = Ra(po),
    Pn = Be({}, po, {
      view: 0,
      detail: 0
    }),
    Vv = Ra(Pn),
    nd,
    ud,
    Qr,
    $s = Be({}, Pn, {
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
      getModifierState: Uc,
      button: 0,
      buttons: 0,
      relatedTarget: function (e) {
        return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
      },
      movementX: function (e) {
        return "movementX" in e ? e.movementX : (e !== Qr && (Qr && e.type === "mousemove" ? (nd = e.screenX - Qr.screenX, ud = e.screenY - Qr.screenY) : ud = nd = 0, Qr = e), nd);
      },
      movementY: function (e) {
        return "movementY" in e ? e.movementY : ud;
      }
    }),
    kp = Ra($s),
    Xv = Be({}, $s, {
      dataTransfer: 0
    }),
    jv = Ra(Xv),
    Zv = Be({}, Pn, {
      relatedTarget: 0
    }),
    sd = Ra(Zv),
    Yv = Be({}, po, {
      animationName: 0,
      elapsedTime: 0,
      pseudoElement: 0
    }),
    Kv = Ra(Yv),
    Qv = Be({}, po, {
      clipboardData: function (e) {
        return "clipboardData" in e ? e.clipboardData : window.clipboardData;
      }
    }),
    Wv = Ra(Qv),
    Jv = Be({}, po, {
      data: 0
    }),
    Ip = Ra(Jv),
    $v = {
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
    e0 = {
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
    a0 = {
      Alt: "altKey",
      Control: "ctrlKey",
      Meta: "metaKey",
      Shift: "shiftKey"
    };
  function t0(e) {
    var a = this.nativeEvent;
    return a.getModifierState ? a.getModifierState(e) : (e = a0[e]) ? !!a[e] : !1;
  }
  function Uc() {
    return t0;
  }
  var l0 = Be({}, Pn, {
      key: function (e) {
        if (e.key) {
          var a = $v[e.key] || e.key;
          if (a !== "Unidentified") return a;
        }
        return e.type === "keypress" ? (e = ds(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? e0[e.keyCode] || "Unidentified" : "";
      },
      code: 0,
      location: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      repeat: 0,
      locale: 0,
      getModifierState: Uc,
      charCode: function (e) {
        return e.type === "keypress" ? ds(e) : 0;
      },
      keyCode: function (e) {
        return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
      },
      which: function (e) {
        return e.type === "keypress" ? ds(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
      }
    }),
    o0 = Ra(l0),
    r0 = Be({}, $s, {
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
    Ap = Ra(r0),
    n0 = Be({}, Pn, {
      touches: 0,
      targetTouches: 0,
      changedTouches: 0,
      altKey: 0,
      metaKey: 0,
      ctrlKey: 0,
      shiftKey: 0,
      getModifierState: Uc
    }),
    u0 = Ra(n0),
    s0 = Be({}, po, {
      propertyName: 0,
      elapsedTime: 0,
      pseudoElement: 0
    }),
    i0 = Ra(s0),
    d0 = Be({}, $s, {
      deltaX: function (e) {
        return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
      },
      deltaY: function (e) {
        return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
      },
      deltaZ: 0,
      deltaMode: 0
    }),
    c0 = Ra(d0),
    f0 = Be({}, po, {
      newState: 0,
      oldState: 0
    }),
    p0 = Ra(f0),
    m0 = [9, 13, 27, 32],
    qc = _t && "CompositionEvent" in window,
    un = null;
  _t && "documentMode" in document && (un = document.documentMode);
  var g0 = _t && "TextEvent" in window && !un,
    dg = _t && (!qc || un && 8 < un && 11 >= un),
    Mp = " ",
    Np = !1;
  function cg(e, a) {
    switch (e) {
      case "keyup":
        return m0.indexOf(a.keyCode) !== -1;
      case "keydown":
        return a.keyCode !== 229;
      case "keypress":
      case "mousedown":
      case "focusout":
        return !0;
      default:
        return !1;
    }
  }
  function fg(e) {
    return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
  }
  var Ko = !1;
  function h0(e, a) {
    switch (e) {
      case "compositionend":
        return fg(a);
      case "keypress":
        return a.which !== 32 ? null : (Np = !0, Mp);
      case "textInput":
        return e = a.data, e === Mp && Np ? null : e;
      default:
        return null;
    }
  }
  function x0(e, a) {
    if (Ko) return e === "compositionend" || !qc && cg(e, a) ? (e = ig(), is = zc = hl = null, Ko = !1, e) : null;
    switch (e) {
      case "paste":
        return null;
      case "keypress":
        if (!(a.ctrlKey || a.altKey || a.metaKey) || a.ctrlKey && a.altKey) {
          if (a.char && 1 < a.char.length) return a.char;
          if (a.which) return String.fromCharCode(a.which);
        }
        return null;
      case "compositionend":
        return dg && a.locale !== "ko" ? null : a.data;
      default:
        return null;
    }
  }
  var b0 = {
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
  function Tp(e) {
    var a = e && e.nodeName && e.nodeName.toLowerCase();
    return a === "input" ? !!b0[e.type] : a === "textarea";
  }
  function pg(e, a, t, l) {
    Yo ? rr ? rr.push(l) : rr = [l] : Yo = l, a = Vs(a, "onChange"), 0 < a.length && (t = new Js("onChange", "change", null, t, l), e.push({
      event: t,
      listeners: a
    }));
  }
  var sn = null,
    Cn = null;
  function v0(e) {
    sx(e, 0);
  }
  function ei(e) {
    var a = on(e);
    if (lg(a)) return e;
  }
  function Dp(e, a) {
    if (e === "change") return a;
  }
  var mg = !1;
  _t && (_t ? (Qu = "oninput" in document, Qu || (id = document.createElement("div"), id.setAttribute("oninput", "return;"), Qu = typeof id.oninput == "function"), Ku = Qu) : Ku = !1, mg = Ku && (!document.documentMode || 9 < document.documentMode));
  var Ku, Qu, id;
  function Rp() {
    sn && (sn.detachEvent("onpropertychange", gg), Cn = sn = null);
  }
  function gg(e) {
    if (e.propertyName === "value" && ei(Cn)) {
      var a = [];
      pg(a, Cn, e, Ec(e)), sg(v0, a);
    }
  }
  function y0(e, a, t) {
    e === "focusin" ? (Rp(), sn = a, Cn = t, sn.attachEvent("onpropertychange", gg)) : e === "focusout" && Rp();
  }
  function L0(e) {
    if (e === "selectionchange" || e === "keyup" || e === "keydown") return ei(Cn);
  }
  function w0(e, a) {
    if (e === "click") return ei(a);
  }
  function C0(e, a) {
    if (e === "input" || e === "change") return ei(a);
  }
  function S0(e, a) {
    return e === a && (e !== 0 || 1 / e === 1 / a) || e !== e && a !== a;
  }
  var Va = typeof Object.is == "function" ? Object.is : S0;
  function Sn(e, a) {
    if (Va(e, a)) return !0;
    if (typeof e != "object" || e === null || typeof a != "object" || a === null) return !1;
    var t = Object.keys(e),
      l = Object.keys(a);
    if (t.length !== l.length) return !1;
    for (l = 0; l < t.length; l++) {
      var o = t[l];
      if (!Pd.call(a, o) || !Va(e[o], a[o])) return !1;
    }
    return !0;
  }
  function Bp(e) {
    for (; e && e.firstChild;) e = e.firstChild;
    return e;
  }
  function Op(e, a) {
    var t = Bp(e);
    e = 0;
    for (var l; t;) {
      if (t.nodeType === 3) {
        if (l = e + t.textContent.length, e <= a && l >= a) return {
          node: t,
          offset: a - e
        };
        e = l;
      }
      e: {
        for (; t;) {
          if (t.nextSibling) {
            t = t.nextSibling;
            break e;
          }
          t = t.parentNode;
        }
        t = void 0;
      }
      t = Bp(t);
    }
  }
  function hg(e, a) {
    return e && a ? e === a ? !0 : e && e.nodeType === 3 ? !1 : a && a.nodeType === 3 ? hg(e, a.parentNode) : "contains" in e ? e.contains(a) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(a) & 16) : !1 : !1;
  }
  function xg(e) {
    e = e != null && e.ownerDocument != null && e.ownerDocument.defaultView != null ? e.ownerDocument.defaultView : window;
    for (var a = Is(e.document); a instanceof e.HTMLIFrameElement;) {
      try {
        var t = typeof a.contentWindow.location.href == "string";
      } catch {
        t = !1;
      }
      if (t) e = a.contentWindow;else break;
      a = Is(e.document);
    }
    return a;
  }
  function Fc(e) {
    var a = e && e.nodeName && e.nodeName.toLowerCase();
    return a && (a === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || a === "textarea" || e.contentEditable === "true");
  }
  var k0 = _t && "documentMode" in document && 11 >= document.documentMode,
    Qo = null,
    Zd = null,
    dn = null,
    Yd = !1;
  function Ep(e, a, t) {
    var l = t.window === t ? t.document : t.nodeType === 9 ? t : t.ownerDocument;
    Yd || Qo == null || Qo !== Is(l) || (l = Qo, "selectionStart" in l && Fc(l) ? l = {
      start: l.selectionStart,
      end: l.selectionEnd
    } : (l = (l.ownerDocument && l.ownerDocument.defaultView || window).getSelection(), l = {
      anchorNode: l.anchorNode,
      anchorOffset: l.anchorOffset,
      focusNode: l.focusNode,
      focusOffset: l.focusOffset
    }), dn && Sn(dn, l) || (dn = l, l = Vs(Zd, "onSelect"), 0 < l.length && (a = new Js("onSelect", "select", null, a, t), e.push({
      event: a,
      listeners: l
    }), a.target = Qo)));
  }
  function Ql(e, a) {
    var t = {};
    return t[e.toLowerCase()] = a.toLowerCase(), t["Webkit" + e] = "webkit" + a, t["Moz" + e] = "moz" + a, t;
  }
  var Wo = {
      animationend: Ql("Animation", "AnimationEnd"),
      animationiteration: Ql("Animation", "AnimationIteration"),
      animationstart: Ql("Animation", "AnimationStart"),
      transitionrun: Ql("Transition", "TransitionRun"),
      transitionstart: Ql("Transition", "TransitionStart"),
      transitioncancel: Ql("Transition", "TransitionCancel"),
      transitionend: Ql("Transition", "TransitionEnd")
    },
    dd = {},
    bg = {};
  _t && (bg = document.createElement("div").style, "AnimationEvent" in window || (delete Wo.animationend.animation, delete Wo.animationiteration.animation, delete Wo.animationstart.animation), "TransitionEvent" in window || delete Wo.transitionend.transition);
  function mo(e) {
    if (dd[e]) return dd[e];
    if (!Wo[e]) return e;
    var a = Wo[e],
      t;
    for (t in a) if (a.hasOwnProperty(t) && t in bg) return dd[e] = a[t];
    return e;
  }
  var vg = mo("animationend"),
    yg = mo("animationiteration"),
    Lg = mo("animationstart"),
    I0 = mo("transitionrun"),
    A0 = mo("transitionstart"),
    M0 = mo("transitioncancel"),
    wg = mo("transitionend"),
    Cg = new Map(),
    Kd = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
  Kd.push("scrollEnd");
  function it(e, a) {
    Cg.set(e, a), fo(a, [e]);
  }
  var As = typeof reportError == "function" ? reportError : function (e) {
      if (typeof window == "object" && typeof window.ErrorEvent == "function") {
        var a = new window.ErrorEvent("error", {
          bubbles: !0,
          cancelable: !0,
          message: typeof e == "object" && e !== null && typeof e.message == "string" ? String(e.message) : String(e),
          error: e
        });
        if (!window.dispatchEvent(a)) return;
      } else if (typeof process == "object" && typeof process.emit == "function") {
        process.emit("uncaughtException", e);
        return;
      }
      console.error(e);
    },
    Ka = [],
    Jo = 0,
    Pc = 0;
  function ai() {
    for (var e = Jo, a = Pc = Jo = 0; a < e;) {
      var t = Ka[a];
      Ka[a++] = null;
      var l = Ka[a];
      Ka[a++] = null;
      var o = Ka[a];
      Ka[a++] = null;
      var r = Ka[a];
      if (Ka[a++] = null, l !== null && o !== null) {
        var n = l.pending;
        n === null ? o.next = o : (o.next = n.next, n.next = o), l.pending = o;
      }
      r !== 0 && Sg(t, o, r);
    }
  }
  function ti(e, a, t, l) {
    Ka[Jo++] = e, Ka[Jo++] = a, Ka[Jo++] = t, Ka[Jo++] = l, Pc |= l, e.lanes |= l, e = e.alternate, e !== null && (e.lanes |= l);
  }
  function Hc(e, a, t, l) {
    return ti(e, a, t, l), Ms(e);
  }
  function go(e, a) {
    return ti(e, null, null, a), Ms(e);
  }
  function Sg(e, a, t) {
    e.lanes |= t;
    var l = e.alternate;
    l !== null && (l.lanes |= t);
    for (var o = !1, r = e.return; r !== null;) r.childLanes |= t, l = r.alternate, l !== null && (l.childLanes |= t), r.tag === 22 && (e = r.stateNode, e === null || e._visibility & 1 || (o = !0)), e = r, r = r.return;
    return e.tag === 3 ? (r = e.stateNode, o && a !== null && (o = 31 - _a(t), e = r.hiddenUpdates, l = e[o], l === null ? e[o] = [a] : l.push(a), a.lane = t | 536870912), r) : null;
  }
  function Ms(e) {
    if (50 < vn) throw vn = 0, hc = null, Error(k(185));
    for (var a = e.return; a !== null;) e = a, a = e.return;
    return e.tag === 3 ? e.stateNode : null;
  }
  var $o = {};
  function N0(e, a, t, l) {
    this.tag = e, this.key = t, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = a, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = l, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function qa(e, a, t, l) {
    return new N0(e, a, t, l);
  }
  function _c(e) {
    return e = e.prototype, !(!e || !e.isReactComponent);
  }
  function Ft(e, a) {
    var t = e.alternate;
    return t === null ? (t = qa(e.tag, a, e.key, e.mode), t.elementType = e.elementType, t.type = e.type, t.stateNode = e.stateNode, t.alternate = e, e.alternate = t) : (t.pendingProps = a, t.type = e.type, t.flags = 0, t.subtreeFlags = 0, t.deletions = null), t.flags = e.flags & 65011712, t.childLanes = e.childLanes, t.lanes = e.lanes, t.child = e.child, t.memoizedProps = e.memoizedProps, t.memoizedState = e.memoizedState, t.updateQueue = e.updateQueue, a = e.dependencies, t.dependencies = a === null ? null : {
      lanes: a.lanes,
      firstContext: a.firstContext
    }, t.sibling = e.sibling, t.index = e.index, t.ref = e.ref, t.refCleanup = e.refCleanup, t;
  }
  function kg(e, a) {
    e.flags &= 65011714;
    var t = e.alternate;
    return t === null ? (e.childLanes = 0, e.lanes = a, e.child = null, e.subtreeFlags = 0, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null) : (e.childLanes = t.childLanes, e.lanes = t.lanes, e.child = t.child, e.subtreeFlags = 0, e.deletions = null, e.memoizedProps = t.memoizedProps, e.memoizedState = t.memoizedState, e.updateQueue = t.updateQueue, e.type = t.type, a = t.dependencies, e.dependencies = a === null ? null : {
      lanes: a.lanes,
      firstContext: a.firstContext
    }), e;
  }
  function cs(e, a, t, l, o, r) {
    var n = 0;
    if (l = e, typeof e == "function") _c(e) && (n = 1);else if (typeof e == "string") n = Ry(e, t, yt.current) ? 26 : e === "html" || e === "head" || e === "body" ? 27 : 5;else e: switch (e) {
      case zd:
        return e = qa(31, t, a, o), e.elementType = zd, e.lanes = r, e;
      case Xo:
        return to(t.children, o, r, a);
      case Vm:
        n = 8, o |= 24;
        break;
      case Bd:
        return e = qa(12, t, a, o | 2), e.elementType = Bd, e.lanes = r, e;
      case Od:
        return e = qa(13, t, a, o), e.elementType = Od, e.lanes = r, e;
      case Ed:
        return e = qa(19, t, a, o), e.elementType = Ed, e.lanes = r, e;
      default:
        if (typeof e == "object" && e !== null) switch (e.$$typeof) {
          case zt:
            n = 10;
            break e;
          case Xm:
            n = 9;
            break e;
          case Mc:
            n = 11;
            break e;
          case Nc:
            n = 14;
            break e;
          case il:
            n = 16, l = null;
            break e;
        }
        n = 29, t = Error(k(130, e === null ? "null" : typeof e, "")), l = null;
    }
    return a = qa(n, t, a, o), a.elementType = e, a.type = l, a.lanes = r, a;
  }
  function to(e, a, t, l) {
    return e = qa(7, e, l, a), e.lanes = t, e;
  }
  function cd(e, a, t) {
    return e = qa(6, e, null, a), e.lanes = t, e;
  }
  function Ig(e) {
    var a = qa(18, null, null, 0);
    return a.stateNode = e, a;
  }
  function fd(e, a, t) {
    return a = qa(4, e.children !== null ? e.children : [], e.key, a), a.lanes = t, a.stateNode = {
      containerInfo: e.containerInfo,
      pendingChildren: null,
      implementation: e.implementation
    }, a;
  }
  var zp = new WeakMap();
  function et(e, a) {
    if (typeof e == "object" && e !== null) {
      var t = zp.get(e);
      return t !== void 0 ? t : (a = {
        value: e,
        source: a,
        stack: xp(a)
      }, zp.set(e, a), a);
    }
    return {
      value: e,
      source: a,
      stack: xp(a)
    };
  }
  var er = [],
    ar = 0,
    Ns = null,
    kn = 0,
    Wa = [],
    Ja = 0,
    Nl = null,
    xt = 1,
    bt = "";
  function Ot(e, a) {
    er[ar++] = kn, er[ar++] = Ns, Ns = e, kn = a;
  }
  function Ag(e, a, t) {
    Wa[Ja++] = xt, Wa[Ja++] = bt, Wa[Ja++] = Nl, Nl = e;
    var l = xt;
    e = bt;
    var o = 32 - _a(l) - 1;
    l &= ~(1 << o), t += 1;
    var r = 32 - _a(a) + o;
    if (30 < r) {
      var n = o - o % 5;
      r = (l & (1 << n) - 1).toString(32), l >>= n, o -= n, xt = 1 << 32 - _a(a) + o | t << o | l, bt = r + e;
    } else xt = 1 << r | t << o | l, bt = e;
  }
  function Gc(e) {
    e.return !== null && (Ot(e, 1), Ag(e, 1, 0));
  }
  function Vc(e) {
    for (; e === Ns;) Ns = er[--ar], er[ar] = null, kn = er[--ar], er[ar] = null;
    for (; e === Nl;) Nl = Wa[--Ja], Wa[Ja] = null, bt = Wa[--Ja], Wa[Ja] = null, xt = Wa[--Ja], Wa[Ja] = null;
  }
  function Mg(e, a) {
    Wa[Ja++] = xt, Wa[Ja++] = bt, Wa[Ja++] = Nl, xt = a.id, bt = a.overflow, Nl = e;
  }
  var fa = null,
    Re = null,
    de = !1,
    Ll = null,
    at = !1,
    Qd = Error(k(519));
  function Tl(e) {
    var a = Error(k(418, 1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML", ""));
    throw In(et(a, e)), Qd;
  }
  function Up(e) {
    var a = e.stateNode,
      t = e.type,
      l = e.memoizedProps;
    switch (a[ca] = e, a[Da] = l, t) {
      case "dialog":
        re("cancel", a), re("close", a);
        break;
      case "iframe":
      case "object":
      case "embed":
        re("load", a);
        break;
      case "video":
      case "audio":
        for (t = 0; t < Tn.length; t++) re(Tn[t], a);
        break;
      case "source":
        re("error", a);
        break;
      case "img":
      case "image":
      case "link":
        re("error", a), re("load", a);
        break;
      case "details":
        re("toggle", a);
        break;
      case "input":
        re("invalid", a), og(a, l.value, l.defaultValue, l.checked, l.defaultChecked, l.type, l.name, !0);
        break;
      case "select":
        re("invalid", a);
        break;
      case "textarea":
        re("invalid", a), ng(a, l.value, l.defaultValue, l.children);
    }
    t = l.children, typeof t != "string" && typeof t != "number" && typeof t != "bigint" || a.textContent === "" + t || l.suppressHydrationWarning === !0 || dx(a.textContent, t) ? (l.popover != null && (re("beforetoggle", a), re("toggle", a)), l.onScroll != null && re("scroll", a), l.onScrollEnd != null && re("scrollend", a), l.onClick != null && (a.onclick = Ut), a = !0) : a = !1, a || Tl(e, !0);
  }
  function qp(e) {
    for (fa = e.return; fa;) switch (fa.tag) {
      case 5:
      case 31:
      case 13:
        at = !1;
        return;
      case 27:
      case 3:
        at = !0;
        return;
      default:
        fa = fa.return;
    }
  }
  function Ho(e) {
    if (e !== fa) return !1;
    if (!de) return qp(e), de = !0, !1;
    var a = e.tag,
      t;
    if ((t = a !== 3 && a !== 27) && ((t = a === 5) && (t = e.type, t = !(t !== "form" && t !== "button") || Lc(e.type, e.memoizedProps)), t = !t), t && Re && Tl(e), qp(e), a === 13) {
      if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(k(317));
      Re = Im(e);
    } else if (a === 31) {
      if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(k(317));
      Re = Im(e);
    } else a === 27 ? (a = Re, Ol(e.type) ? (e = kc, kc = null, Re = e) : Re = a) : Re = fa ? lt(e.stateNode.nextSibling) : null;
    return !0;
  }
  function no() {
    Re = fa = null, de = !1;
  }
  function pd() {
    var e = Ll;
    return e !== null && (Na === null ? Na = e : Na.push.apply(Na, e), Ll = null), e;
  }
  function In(e) {
    Ll === null ? Ll = [e] : Ll.push(e);
  }
  var Wd = Lt(null),
    ho = null,
    qt = null;
  function cl(e, a, t) {
    Me(Wd, a._currentValue), a._currentValue = t;
  }
  function Pt(e) {
    e._currentValue = Wd.current, sa(Wd);
  }
  function Jd(e, a, t) {
    for (; e !== null;) {
      var l = e.alternate;
      if ((e.childLanes & a) !== a ? (e.childLanes |= a, l !== null && (l.childLanes |= a)) : l !== null && (l.childLanes & a) !== a && (l.childLanes |= a), e === t) break;
      e = e.return;
    }
  }
  function $d(e, a, t, l) {
    var o = e.child;
    for (o !== null && (o.return = e); o !== null;) {
      var r = o.dependencies;
      if (r !== null) {
        var n = o.child;
        r = r.firstContext;
        e: for (; r !== null;) {
          var u = r;
          r = o;
          for (var s = 0; s < a.length; s++) if (u.context === a[s]) {
            r.lanes |= t, u = r.alternate, u !== null && (u.lanes |= t), Jd(r.return, t, e), l || (n = null);
            break e;
          }
          r = u.next;
        }
      } else if (o.tag === 18) {
        if (n = o.return, n === null) throw Error(k(341));
        n.lanes |= t, r = n.alternate, r !== null && (r.lanes |= t), Jd(n, t, e), n = null;
      } else n = o.child;
      if (n !== null) n.return = o;else for (n = o; n !== null;) {
        if (n === e) {
          n = null;
          break;
        }
        if (o = n.sibling, o !== null) {
          o.return = n.return, n = o;
          break;
        }
        n = n.return;
      }
      o = n;
    }
  }
  function Cr(e, a, t, l) {
    e = null;
    for (var o = a, r = !1; o !== null;) {
      if (!r) {
        if ((o.flags & 524288) !== 0) r = !0;else if ((o.flags & 262144) !== 0) break;
      }
      if (o.tag === 10) {
        var n = o.alternate;
        if (n === null) throw Error(k(387));
        if (n = n.memoizedProps, n !== null) {
          var u = o.type;
          Va(o.pendingProps.value, n.value) || (e !== null ? e.push(u) : e = [u]);
        }
      } else if (o === ws.current) {
        if (n = o.alternate, n === null) throw Error(k(387));
        n.memoizedState.memoizedState !== o.memoizedState.memoizedState && (e !== null ? e.push(Rn) : e = [Rn]);
      }
      o = o.return;
    }
    e !== null && $d(a, e, t, l), a.flags |= 262144;
  }
  function Ts(e) {
    for (e = e.firstContext; e !== null;) {
      if (!Va(e.context._currentValue, e.memoizedValue)) return !0;
      e = e.next;
    }
    return !1;
  }
  function uo(e) {
    ho = e, qt = null, e = e.dependencies, e !== null && (e.firstContext = null);
  }
  function pa(e) {
    return Ng(ho, e);
  }
  function Wu(e, a) {
    return ho === null && uo(e), Ng(e, a);
  }
  function Ng(e, a) {
    var t = a._currentValue;
    if (a = {
      context: a,
      memoizedValue: t,
      next: null
    }, qt === null) {
      if (e === null) throw Error(k(308));
      qt = a, e.dependencies = {
        lanes: 0,
        firstContext: a
      }, e.flags |= 524288;
    } else qt = qt.next = a;
    return t;
  }
  var T0 = typeof AbortController < "u" ? AbortController : function () {
      var e = [],
        a = this.signal = {
          aborted: !1,
          addEventListener: function (t, l) {
            e.push(l);
          }
        };
      this.abort = function () {
        a.aborted = !0, e.forEach(function (t) {
          return t();
        });
      };
    },
    D0 = la.unstable_scheduleCallback,
    R0 = la.unstable_NormalPriority,
    Je = {
      $$typeof: zt,
      Consumer: null,
      Provider: null,
      _currentValue: null,
      _currentValue2: null,
      _threadCount: 0
    };
  function Xc() {
    return {
      controller: new T0(),
      data: new Map(),
      refCount: 0
    };
  }
  function Hn(e) {
    e.refCount--, e.refCount === 0 && D0(R0, function () {
      e.controller.abort();
    });
  }
  var cn = null,
    ec = 0,
    pr = 0,
    nr = null;
  function B0(e, a) {
    if (cn === null) {
      var t = cn = [];
      ec = 0, pr = xf(), nr = {
        status: "pending",
        value: void 0,
        then: function (l) {
          t.push(l);
        }
      };
    }
    return ec++, a.then(Fp, Fp), a;
  }
  function Fp() {
    if (--ec === 0 && cn !== null) {
      nr !== null && (nr.status = "fulfilled");
      var e = cn;
      cn = null, pr = 0, nr = null;
      for (var a = 0; a < e.length; a++) (0, e[a])();
    }
  }
  function O0(e, a) {
    var t = [],
      l = {
        status: "pending",
        value: null,
        reason: null,
        then: function (o) {
          t.push(o);
        }
      };
    return e.then(function () {
      l.status = "fulfilled", l.value = a;
      for (var o = 0; o < t.length; o++) (0, t[o])(a);
    }, function (o) {
      for (l.status = "rejected", l.reason = o, o = 0; o < t.length; o++) (0, t[o])(void 0);
    }), l;
  }
  var Pp = Y.S;
  Y.S = function (e, a) {
    Gh = Pa(), typeof a == "object" && a !== null && typeof a.then == "function" && B0(e, a), Pp !== null && Pp(e, a);
  };
  var lo = Lt(null);
  function jc() {
    var e = lo.current;
    return e !== null ? e : Ae.pooledCache;
  }
  function fs(e, a) {
    a === null ? Me(lo, lo.current) : Me(lo, a.pool);
  }
  function Tg() {
    var e = jc();
    return e === null ? null : {
      parent: Je._currentValue,
      pool: e
    };
  }
  var Sr = Error(k(460)),
    Zc = Error(k(474)),
    li = Error(k(542)),
    Ds = {
      then: function () {}
    };
  function Hp(e) {
    return e = e.status, e === "fulfilled" || e === "rejected";
  }
  function Dg(e, a, t) {
    switch (t = e[t], t === void 0 ? e.push(a) : t !== a && (a.then(Ut, Ut), a = t), a.status) {
      case "fulfilled":
        return a.value;
      case "rejected":
        throw e = a.reason, Gp(e), e;
      default:
        if (typeof a.status == "string") a.then(Ut, Ut);else {
          if (e = Ae, e !== null && 100 < e.shellSuspendCounter) throw Error(k(482));
          e = a, e.status = "pending", e.then(function (l) {
            if (a.status === "pending") {
              var o = a;
              o.status = "fulfilled", o.value = l;
            }
          }, function (l) {
            if (a.status === "pending") {
              var o = a;
              o.status = "rejected", o.reason = l;
            }
          });
        }
        switch (a.status) {
          case "fulfilled":
            return a.value;
          case "rejected":
            throw e = a.reason, Gp(e), e;
        }
        throw oo = a, Sr;
    }
  }
  function $l(e) {
    try {
      var a = e._init;
      return a(e._payload);
    } catch (t) {
      throw t !== null && typeof t == "object" && typeof t.then == "function" ? (oo = t, Sr) : t;
    }
  }
  var oo = null;
  function _p() {
    if (oo === null) throw Error(k(459));
    var e = oo;
    return oo = null, e;
  }
  function Gp(e) {
    if (e === Sr || e === li) throw Error(k(483));
  }
  var ur = null,
    An = 0;
  function Ju(e) {
    var a = An;
    return An += 1, ur === null && (ur = []), Dg(ur, e, a);
  }
  function Wr(e, a) {
    a = a.props.ref, e.ref = a !== void 0 ? a : null;
  }
  function $u(e, a) {
    throw a.$$typeof === yv ? Error(k(525)) : (e = Object.prototype.toString.call(a), Error(k(31, e === "[object Object]" ? "object with keys {" + Object.keys(a).join(", ") + "}" : e)));
  }
  function Rg(e) {
    function a(f, c) {
      if (e) {
        var h = f.deletions;
        h === null ? (f.deletions = [c], f.flags |= 16) : h.push(c);
      }
    }
    function t(f, c) {
      if (!e) return null;
      for (; c !== null;) a(f, c), c = c.sibling;
      return null;
    }
    function l(f) {
      for (var c = new Map(); f !== null;) f.key !== null ? c.set(f.key, f) : c.set(f.index, f), f = f.sibling;
      return c;
    }
    function o(f, c) {
      return f = Ft(f, c), f.index = 0, f.sibling = null, f;
    }
    function r(f, c, h) {
      return f.index = h, e ? (h = f.alternate, h !== null ? (h = h.index, h < c ? (f.flags |= 67108866, c) : h) : (f.flags |= 67108866, c)) : (f.flags |= 1048576, c);
    }
    function n(f) {
      return e && f.alternate === null && (f.flags |= 67108866), f;
    }
    function u(f, c, h, p) {
      return c === null || c.tag !== 6 ? (c = cd(h, f.mode, p), c.return = f, c) : (c = o(c, h), c.return = f, c);
    }
    function s(f, c, h, p) {
      var M = h.type;
      return M === Xo ? d(f, c, h.props.children, p, h.key) : c !== null && (c.elementType === M || typeof M == "object" && M !== null && M.$$typeof === il && $l(M) === c.type) ? (c = o(c, h.props), Wr(c, h), c.return = f, c) : (c = cs(h.type, h.key, h.props, null, f.mode, p), Wr(c, h), c.return = f, c);
    }
    function i(f, c, h, p) {
      return c === null || c.tag !== 4 || c.stateNode.containerInfo !== h.containerInfo || c.stateNode.implementation !== h.implementation ? (c = fd(h, f.mode, p), c.return = f, c) : (c = o(c, h.children || []), c.return = f, c);
    }
    function d(f, c, h, p, M) {
      return c === null || c.tag !== 7 ? (c = to(h, f.mode, p, M), c.return = f, c) : (c = o(c, h), c.return = f, c);
    }
    function x(f, c, h) {
      if (typeof c == "string" && c !== "" || typeof c == "number" || typeof c == "bigint") return c = cd("" + c, f.mode, h), c.return = f, c;
      if (typeof c == "object" && c !== null) {
        switch (c.$$typeof) {
          case Gu:
            return h = cs(c.type, c.key, c.props, null, f.mode, h), Wr(h, c), h.return = f, h;
          case tn:
            return c = fd(c, f.mode, h), c.return = f, c;
          case il:
            return c = $l(c), x(f, c, h);
        }
        if (ln(c) || Kr(c)) return c = to(c, f.mode, h, null), c.return = f, c;
        if (typeof c.then == "function") return x(f, Ju(c), h);
        if (c.$$typeof === zt) return x(f, Wu(f, c), h);
        $u(f, c);
      }
      return null;
    }
    function m(f, c, h, p) {
      var M = c !== null ? c.key : null;
      if (typeof h == "string" && h !== "" || typeof h == "number" || typeof h == "bigint") return M !== null ? null : u(f, c, "" + h, p);
      if (typeof h == "object" && h !== null) {
        switch (h.$$typeof) {
          case Gu:
            return h.key === M ? s(f, c, h, p) : null;
          case tn:
            return h.key === M ? i(f, c, h, p) : null;
          case il:
            return h = $l(h), m(f, c, h, p);
        }
        if (ln(h) || Kr(h)) return M !== null ? null : d(f, c, h, p, null);
        if (typeof h.then == "function") return m(f, c, Ju(h), p);
        if (h.$$typeof === zt) return m(f, c, Wu(f, h), p);
        $u(f, h);
      }
      return null;
    }
    function g(f, c, h, p, M) {
      if (typeof p == "string" && p !== "" || typeof p == "number" || typeof p == "bigint") return f = f.get(h) || null, u(c, f, "" + p, M);
      if (typeof p == "object" && p !== null) {
        switch (p.$$typeof) {
          case Gu:
            return f = f.get(p.key === null ? h : p.key) || null, s(c, f, p, M);
          case tn:
            return f = f.get(p.key === null ? h : p.key) || null, i(c, f, p, M);
          case il:
            return p = $l(p), g(f, c, h, p, M);
        }
        if (ln(p) || Kr(p)) return f = f.get(h) || null, d(c, f, p, M, null);
        if (typeof p.then == "function") return g(f, c, h, Ju(p), M);
        if (p.$$typeof === zt) return g(f, c, h, Wu(c, p), M);
        $u(c, p);
      }
      return null;
    }
    function C(f, c, h, p) {
      for (var M = null, D = null, L = c, w = c = 0, E = null; L !== null && w < h.length; w++) {
        L.index > w ? (E = L, L = null) : E = L.sibling;
        var q = m(f, L, h[w], p);
        if (q === null) {
          L === null && (L = E);
          break;
        }
        e && L && q.alternate === null && a(f, L), c = r(q, c, w), D === null ? M = q : D.sibling = q, D = q, L = E;
      }
      if (w === h.length) return t(f, L), de && Ot(f, w), M;
      if (L === null) {
        for (; w < h.length; w++) L = x(f, h[w], p), L !== null && (c = r(L, c, w), D === null ? M = L : D.sibling = L, D = L);
        return de && Ot(f, w), M;
      }
      for (L = l(L); w < h.length; w++) E = g(L, f, w, h[w], p), E !== null && (e && E.alternate !== null && L.delete(E.key === null ? w : E.key), c = r(E, c, w), D === null ? M = E : D.sibling = E, D = E);
      return e && L.forEach(function (be) {
        return a(f, be);
      }), de && Ot(f, w), M;
    }
    function y(f, c, h, p) {
      if (h == null) throw Error(k(151));
      for (var M = null, D = null, L = c, w = c = 0, E = null, q = h.next(); L !== null && !q.done; w++, q = h.next()) {
        L.index > w ? (E = L, L = null) : E = L.sibling;
        var be = m(f, L, q.value, p);
        if (be === null) {
          L === null && (L = E);
          break;
        }
        e && L && be.alternate === null && a(f, L), c = r(be, c, w), D === null ? M = be : D.sibling = be, D = be, L = E;
      }
      if (q.done) return t(f, L), de && Ot(f, w), M;
      if (L === null) {
        for (; !q.done; w++, q = h.next()) q = x(f, q.value, p), q !== null && (c = r(q, c, w), D === null ? M = q : D.sibling = q, D = q);
        return de && Ot(f, w), M;
      }
      for (L = l(L); !q.done; w++, q = h.next()) q = g(L, f, w, q.value, p), q !== null && (e && q.alternate !== null && L.delete(q.key === null ? w : q.key), c = r(q, c, w), D === null ? M = q : D.sibling = q, D = q);
      return e && L.forEach(function (Pe) {
        return a(f, Pe);
      }), de && Ot(f, w), M;
    }
    function N(f, c, h, p) {
      if (typeof h == "object" && h !== null && h.type === Xo && h.key === null && (h = h.props.children), typeof h == "object" && h !== null) {
        switch (h.$$typeof) {
          case Gu:
            e: {
              for (var M = h.key; c !== null;) {
                if (c.key === M) {
                  if (M = h.type, M === Xo) {
                    if (c.tag === 7) {
                      t(f, c.sibling), p = o(c, h.props.children), p.return = f, f = p;
                      break e;
                    }
                  } else if (c.elementType === M || typeof M == "object" && M !== null && M.$$typeof === il && $l(M) === c.type) {
                    t(f, c.sibling), p = o(c, h.props), Wr(p, h), p.return = f, f = p;
                    break e;
                  }
                  t(f, c);
                  break;
                } else a(f, c);
                c = c.sibling;
              }
              h.type === Xo ? (p = to(h.props.children, f.mode, p, h.key), p.return = f, f = p) : (p = cs(h.type, h.key, h.props, null, f.mode, p), Wr(p, h), p.return = f, f = p);
            }
            return n(f);
          case tn:
            e: {
              for (M = h.key; c !== null;) {
                if (c.key === M) {
                  if (c.tag === 4 && c.stateNode.containerInfo === h.containerInfo && c.stateNode.implementation === h.implementation) {
                    t(f, c.sibling), p = o(c, h.children || []), p.return = f, f = p;
                    break e;
                  } else {
                    t(f, c);
                    break;
                  }
                } else a(f, c);
                c = c.sibling;
              }
              p = fd(h, f.mode, p), p.return = f, f = p;
            }
            return n(f);
          case il:
            return h = $l(h), N(f, c, h, p);
        }
        if (ln(h)) return C(f, c, h, p);
        if (Kr(h)) {
          if (M = Kr(h), typeof M != "function") throw Error(k(150));
          return h = M.call(h), y(f, c, h, p);
        }
        if (typeof h.then == "function") return N(f, c, Ju(h), p);
        if (h.$$typeof === zt) return N(f, c, Wu(f, h), p);
        $u(f, h);
      }
      return typeof h == "string" && h !== "" || typeof h == "number" || typeof h == "bigint" ? (h = "" + h, c !== null && c.tag === 6 ? (t(f, c.sibling), p = o(c, h), p.return = f, f = p) : (t(f, c), p = cd(h, f.mode, p), p.return = f, f = p), n(f)) : t(f, c);
    }
    return function (f, c, h, p) {
      try {
        An = 0;
        var M = N(f, c, h, p);
        return ur = null, M;
      } catch (L) {
        if (L === Sr || L === li) throw L;
        var D = qa(29, L, null, f.mode);
        return D.lanes = p, D.return = f, D;
      }
    };
  }
  var so = Rg(!0),
    Bg = Rg(!1),
    dl = !1;
  function Yc(e) {
    e.updateQueue = {
      baseState: e.memoizedState,
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
  function ac(e, a) {
    e = e.updateQueue, a.updateQueue === e && (a.updateQueue = {
      baseState: e.baseState,
      firstBaseUpdate: e.firstBaseUpdate,
      lastBaseUpdate: e.lastBaseUpdate,
      shared: e.shared,
      callbacks: null
    });
  }
  function wl(e) {
    return {
      lane: e,
      tag: 0,
      payload: null,
      callback: null,
      next: null
    };
  }
  function Cl(e, a, t) {
    var l = e.updateQueue;
    if (l === null) return null;
    if (l = l.shared, (me & 2) !== 0) {
      var o = l.pending;
      return o === null ? a.next = a : (a.next = o.next, o.next = a), l.pending = a, a = Ms(e), Sg(e, null, t), a;
    }
    return ti(e, l, a, t), Ms(e);
  }
  function fn(e, a, t) {
    if (a = a.updateQueue, a !== null && (a = a.shared, (t & 4194048) !== 0)) {
      var l = a.lanes;
      l &= e.pendingLanes, t |= l, a.lanes = t, Wm(e, t);
    }
  }
  function md(e, a) {
    var t = e.updateQueue,
      l = e.alternate;
    if (l !== null && (l = l.updateQueue, t === l)) {
      var o = null,
        r = null;
      if (t = t.firstBaseUpdate, t !== null) {
        do {
          var n = {
            lane: t.lane,
            tag: t.tag,
            payload: t.payload,
            callback: null,
            next: null
          };
          r === null ? o = r = n : r = r.next = n, t = t.next;
        } while (t !== null);
        r === null ? o = r = a : r = r.next = a;
      } else o = r = a;
      t = {
        baseState: l.baseState,
        firstBaseUpdate: o,
        lastBaseUpdate: r,
        shared: l.shared,
        callbacks: l.callbacks
      }, e.updateQueue = t;
      return;
    }
    e = t.lastBaseUpdate, e === null ? t.firstBaseUpdate = a : e.next = a, t.lastBaseUpdate = a;
  }
  var tc = !1;
  function pn() {
    if (tc) {
      var e = nr;
      if (e !== null) throw e;
    }
  }
  function mn(e, a, t, l) {
    tc = !1;
    var o = e.updateQueue;
    dl = !1;
    var r = o.firstBaseUpdate,
      n = o.lastBaseUpdate,
      u = o.shared.pending;
    if (u !== null) {
      o.shared.pending = null;
      var s = u,
        i = s.next;
      s.next = null, n === null ? r = i : n.next = i, n = s;
      var d = e.alternate;
      d !== null && (d = d.updateQueue, u = d.lastBaseUpdate, u !== n && (u === null ? d.firstBaseUpdate = i : u.next = i, d.lastBaseUpdate = s));
    }
    if (r !== null) {
      var x = o.baseState;
      n = 0, d = i = s = null, u = r;
      do {
        var m = u.lane & -536870913,
          g = m !== u.lane;
        if (g ? (se & m) === m : (l & m) === m) {
          m !== 0 && m === pr && (tc = !0), d !== null && (d = d.next = {
            lane: 0,
            tag: u.tag,
            payload: u.payload,
            callback: null,
            next: null
          });
          e: {
            var C = e,
              y = u;
            m = a;
            var N = t;
            switch (y.tag) {
              case 1:
                if (C = y.payload, typeof C == "function") {
                  x = C.call(N, x, m);
                  break e;
                }
                x = C;
                break e;
              case 3:
                C.flags = C.flags & -65537 | 128;
              case 0:
                if (C = y.payload, m = typeof C == "function" ? C.call(N, x, m) : C, m == null) break e;
                x = Be({}, x, m);
                break e;
              case 2:
                dl = !0;
            }
          }
          m = u.callback, m !== null && (e.flags |= 64, g && (e.flags |= 8192), g = o.callbacks, g === null ? o.callbacks = [m] : g.push(m));
        } else g = {
          lane: m,
          tag: u.tag,
          payload: u.payload,
          callback: u.callback,
          next: null
        }, d === null ? (i = d = g, s = x) : d = d.next = g, n |= m;
        if (u = u.next, u === null) {
          if (u = o.shared.pending, u === null) break;
          g = u, u = g.next, g.next = null, o.lastBaseUpdate = g, o.shared.pending = null;
        }
      } while (!0);
      d === null && (s = x), o.baseState = s, o.firstBaseUpdate = i, o.lastBaseUpdate = d, r === null && (o.shared.lanes = 0), Rl |= n, e.lanes = n, e.memoizedState = x;
    }
  }
  function Og(e, a) {
    if (typeof e != "function") throw Error(k(191, e));
    e.call(a);
  }
  function Eg(e, a) {
    var t = e.callbacks;
    if (t !== null) for (e.callbacks = null, e = 0; e < t.length; e++) Og(t[e], a);
  }
  var mr = Lt(null),
    Rs = Lt(0);
  function Vp(e, a) {
    e = jt, Me(Rs, e), Me(mr, a), jt = e | a.baseLanes;
  }
  function lc() {
    Me(Rs, jt), Me(mr, mr.current);
  }
  function Kc() {
    jt = Rs.current, sa(mr), sa(Rs);
  }
  var Xa = Lt(null),
    tt = null;
  function fl(e) {
    var a = e.alternate;
    Me(je, je.current & 1), Me(Xa, e), tt === null && (a === null || mr.current !== null || a.memoizedState !== null) && (tt = e);
  }
  function oc(e) {
    Me(je, je.current), Me(Xa, e), tt === null && (tt = e);
  }
  function zg(e) {
    e.tag === 22 ? (Me(je, je.current), Me(Xa, e), tt === null && (tt = e)) : pl(e);
  }
  function pl() {
    Me(je, je.current), Me(Xa, Xa.current);
  }
  function Ua(e) {
    sa(Xa), tt === e && (tt = null), sa(je);
  }
  var je = Lt(0);
  function Bs(e) {
    for (var a = e; a !== null;) {
      if (a.tag === 13) {
        var t = a.memoizedState;
        if (t !== null && (t = t.dehydrated, t === null || Cc(t) || Sc(t))) return a;
      } else if (a.tag === 19 && (a.memoizedProps.revealOrder === "forwards" || a.memoizedProps.revealOrder === "backwards" || a.memoizedProps.revealOrder === "unstable_legacy-backwards" || a.memoizedProps.revealOrder === "together")) {
        if ((a.flags & 128) !== 0) return a;
      } else if (a.child !== null) {
        a.child.return = a, a = a.child;
        continue;
      }
      if (a === e) break;
      for (; a.sibling === null;) {
        if (a.return === null || a.return === e) return null;
        a = a.return;
      }
      a.sibling.return = a.return, a = a.sibling;
    }
    return null;
  }
  var Gt = 0,
    W = null,
    ke = null,
    Qe = null,
    Os = !1,
    sr = !1,
    io = !1,
    Es = 0,
    Mn = 0,
    ir = null,
    E0 = 0;
  function _e() {
    throw Error(k(321));
  }
  function Qc(e, a) {
    if (a === null) return !1;
    for (var t = 0; t < a.length && t < e.length; t++) if (!Va(e[t], a[t])) return !1;
    return !0;
  }
  function Wc(e, a, t, l, o, r) {
    return Gt = r, W = a, a.memoizedState = null, a.updateQueue = null, a.lanes = 0, Y.H = e === null || e.memoizedState === null ? ph : sf, io = !1, r = t(l, o), io = !1, sr && (r = qg(a, t, l, o)), Ug(e), r;
  }
  function Ug(e) {
    Y.H = Nn;
    var a = ke !== null && ke.next !== null;
    if (Gt = 0, Qe = ke = W = null, Os = !1, Mn = 0, ir = null, a) throw Error(k(300));
    e === null || $e || (e = e.dependencies, e !== null && Ts(e) && ($e = !0));
  }
  function qg(e, a, t, l) {
    W = e;
    var o = 0;
    do {
      if (sr && (ir = null), Mn = 0, sr = !1, 25 <= o) throw Error(k(301));
      if (o += 1, Qe = ke = null, e.updateQueue != null) {
        var r = e.updateQueue;
        r.lastEffect = null, r.events = null, r.stores = null, r.memoCache != null && (r.memoCache.index = 0);
      }
      Y.H = mh, r = a(t, l);
    } while (sr);
    return r;
  }
  function z0() {
    var e = Y.H,
      a = e.useState()[0];
    return a = typeof a.then == "function" ? _n(a) : a, e = e.useState()[0], (ke !== null ? ke.memoizedState : null) !== e && (W.flags |= 1024), a;
  }
  function Jc() {
    var e = Es !== 0;
    return Es = 0, e;
  }
  function $c(e, a, t) {
    a.updateQueue = e.updateQueue, a.flags &= -2053, e.lanes &= ~t;
  }
  function ef(e) {
    if (Os) {
      for (e = e.memoizedState; e !== null;) {
        var a = e.queue;
        a !== null && (a.pending = null), e = e.next;
      }
      Os = !1;
    }
    Gt = 0, Qe = ke = W = null, sr = !1, Mn = Es = 0, ir = null;
  }
  function wa() {
    var e = {
      memoizedState: null,
      baseState: null,
      baseQueue: null,
      queue: null,
      next: null
    };
    return Qe === null ? W.memoizedState = Qe = e : Qe = Qe.next = e, Qe;
  }
  function Ze() {
    if (ke === null) {
      var e = W.alternate;
      e = e !== null ? e.memoizedState : null;
    } else e = ke.next;
    var a = Qe === null ? W.memoizedState : Qe.next;
    if (a !== null) Qe = a, ke = e;else {
      if (e === null) throw W.alternate === null ? Error(k(467)) : Error(k(310));
      ke = e, e = {
        memoizedState: ke.memoizedState,
        baseState: ke.baseState,
        baseQueue: ke.baseQueue,
        queue: ke.queue,
        next: null
      }, Qe === null ? W.memoizedState = Qe = e : Qe = Qe.next = e;
    }
    return Qe;
  }
  function oi() {
    return {
      lastEffect: null,
      events: null,
      stores: null,
      memoCache: null
    };
  }
  function _n(e) {
    var a = Mn;
    return Mn += 1, ir === null && (ir = []), e = Dg(ir, e, a), a = W, (Qe === null ? a.memoizedState : Qe.next) === null && (a = a.alternate, Y.H = a === null || a.memoizedState === null ? ph : sf), e;
  }
  function ri(e) {
    if (e !== null && typeof e == "object") {
      if (typeof e.then == "function") return _n(e);
      if (e.$$typeof === zt) return pa(e);
    }
    throw Error(k(438, String(e)));
  }
  function af(e) {
    var a = null,
      t = W.updateQueue;
    if (t !== null && (a = t.memoCache), a == null) {
      var l = W.alternate;
      l !== null && (l = l.updateQueue, l !== null && (l = l.memoCache, l != null && (a = {
        data: l.data.map(function (o) {
          return o.slice();
        }),
        index: 0
      })));
    }
    if (a == null && (a = {
      data: [],
      index: 0
    }), t === null && (t = oi(), W.updateQueue = t), t.memoCache = a, t = a.data[a.index], t === void 0) for (t = a.data[a.index] = Array(e), l = 0; l < e; l++) t[l] = Lv;
    return a.index++, t;
  }
  function Vt(e, a) {
    return typeof a == "function" ? a(e) : a;
  }
  function ps(e) {
    var a = Ze();
    return tf(a, ke, e);
  }
  function tf(e, a, t) {
    var l = e.queue;
    if (l === null) throw Error(k(311));
    l.lastRenderedReducer = t;
    var o = e.baseQueue,
      r = l.pending;
    if (r !== null) {
      if (o !== null) {
        var n = o.next;
        o.next = r.next, r.next = n;
      }
      a.baseQueue = o = r, l.pending = null;
    }
    if (r = e.baseState, o === null) e.memoizedState = r;else {
      a = o.next;
      var u = n = null,
        s = null,
        i = a,
        d = !1;
      do {
        var x = i.lane & -536870913;
        if (x !== i.lane ? (se & x) === x : (Gt & x) === x) {
          var m = i.revertLane;
          if (m === 0) s !== null && (s = s.next = {
            lane: 0,
            revertLane: 0,
            gesture: null,
            action: i.action,
            hasEagerState: i.hasEagerState,
            eagerState: i.eagerState,
            next: null
          }), x === pr && (d = !0);else if ((Gt & m) === m) {
            i = i.next, m === pr && (d = !0);
            continue;
          } else x = {
            lane: 0,
            revertLane: i.revertLane,
            gesture: null,
            action: i.action,
            hasEagerState: i.hasEagerState,
            eagerState: i.eagerState,
            next: null
          }, s === null ? (u = s = x, n = r) : s = s.next = x, W.lanes |= m, Rl |= m;
          x = i.action, io && t(r, x), r = i.hasEagerState ? i.eagerState : t(r, x);
        } else m = {
          lane: x,
          revertLane: i.revertLane,
          gesture: i.gesture,
          action: i.action,
          hasEagerState: i.hasEagerState,
          eagerState: i.eagerState,
          next: null
        }, s === null ? (u = s = m, n = r) : s = s.next = m, W.lanes |= x, Rl |= x;
        i = i.next;
      } while (i !== null && i !== a);
      if (s === null ? n = r : s.next = u, !Va(r, e.memoizedState) && ($e = !0, d && (t = nr, t !== null))) throw t;
      e.memoizedState = r, e.baseState = n, e.baseQueue = s, l.lastRenderedState = r;
    }
    return o === null && (l.lanes = 0), [e.memoizedState, l.dispatch];
  }
  function gd(e) {
    var a = Ze(),
      t = a.queue;
    if (t === null) throw Error(k(311));
    t.lastRenderedReducer = e;
    var l = t.dispatch,
      o = t.pending,
      r = a.memoizedState;
    if (o !== null) {
      t.pending = null;
      var n = o = o.next;
      do r = e(r, n.action), n = n.next; while (n !== o);
      Va(r, a.memoizedState) || ($e = !0), a.memoizedState = r, a.baseQueue === null && (a.baseState = r), t.lastRenderedState = r;
    }
    return [r, l];
  }
  function Fg(e, a, t) {
    var l = W,
      o = Ze(),
      r = de;
    if (r) {
      if (t === void 0) throw Error(k(407));
      t = t();
    } else t = a();
    var n = !Va((ke || o).memoizedState, t);
    if (n && (o.memoizedState = t, $e = !0), o = o.queue, lf(_g.bind(null, l, o, e), [e]), o.getSnapshot !== a || n || Qe !== null && Qe.memoizedState.tag & 1) {
      if (l.flags |= 2048, gr(9, {
        destroy: void 0
      }, Hg.bind(null, l, o, t, a), null), Ae === null) throw Error(k(349));
      r || (Gt & 127) !== 0 || Pg(l, a, t);
    }
    return t;
  }
  function Pg(e, a, t) {
    e.flags |= 16384, e = {
      getSnapshot: a,
      value: t
    }, a = W.updateQueue, a === null ? (a = oi(), W.updateQueue = a, a.stores = [e]) : (t = a.stores, t === null ? a.stores = [e] : t.push(e));
  }
  function Hg(e, a, t, l) {
    a.value = t, a.getSnapshot = l, Gg(a) && Vg(e);
  }
  function _g(e, a, t) {
    return t(function () {
      Gg(a) && Vg(e);
    });
  }
  function Gg(e) {
    var a = e.getSnapshot;
    e = e.value;
    try {
      var t = a();
      return !Va(e, t);
    } catch {
      return !0;
    }
  }
  function Vg(e) {
    var a = go(e, 2);
    a !== null && Ta(a, e, 2);
  }
  function rc(e) {
    var a = wa();
    if (typeof e == "function") {
      var t = e;
      if (e = t(), io) {
        gl(!0);
        try {
          t();
        } finally {
          gl(!1);
        }
      }
    }
    return a.memoizedState = a.baseState = e, a.queue = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: Vt,
      lastRenderedState: e
    }, a;
  }
  function Xg(e, a, t, l) {
    return e.baseState = t, tf(e, ke, typeof l == "function" ? l : Vt);
  }
  function U0(e, a, t, l, o) {
    if (ui(e)) throw Error(k(485));
    if (e = a.action, e !== null) {
      var r = {
        payload: o,
        action: e,
        next: null,
        isTransition: !0,
        status: "pending",
        value: null,
        reason: null,
        listeners: [],
        then: function (n) {
          r.listeners.push(n);
        }
      };
      Y.T !== null ? t(!0) : r.isTransition = !1, l(r), t = a.pending, t === null ? (r.next = a.pending = r, jg(a, r)) : (r.next = t.next, a.pending = t.next = r);
    }
  }
  function jg(e, a) {
    var t = a.action,
      l = a.payload,
      o = e.state;
    if (a.isTransition) {
      var r = Y.T,
        n = {};
      Y.T = n;
      try {
        var u = t(o, l),
          s = Y.S;
        s !== null && s(n, u), Xp(e, a, u);
      } catch (i) {
        nc(e, a, i);
      } finally {
        r !== null && n.types !== null && (r.types = n.types), Y.T = r;
      }
    } else try {
      r = t(o, l), Xp(e, a, r);
    } catch (i) {
      nc(e, a, i);
    }
  }
  function Xp(e, a, t) {
    t !== null && typeof t == "object" && typeof t.then == "function" ? t.then(function (l) {
      jp(e, a, l);
    }, function (l) {
      return nc(e, a, l);
    }) : jp(e, a, t);
  }
  function jp(e, a, t) {
    a.status = "fulfilled", a.value = t, Zg(a), e.state = t, a = e.pending, a !== null && (t = a.next, t === a ? e.pending = null : (t = t.next, a.next = t, jg(e, t)));
  }
  function nc(e, a, t) {
    var l = e.pending;
    if (e.pending = null, l !== null) {
      l = l.next;
      do a.status = "rejected", a.reason = t, Zg(a), a = a.next; while (a !== l);
    }
    e.action = null;
  }
  function Zg(e) {
    e = e.listeners;
    for (var a = 0; a < e.length; a++) (0, e[a])();
  }
  function Yg(e, a) {
    return a;
  }
  function Zp(e, a) {
    if (de) {
      var t = Ae.formState;
      if (t !== null) {
        e: {
          var l = W;
          if (de) {
            if (Re) {
              a: {
                for (var o = Re, r = at; o.nodeType !== 8;) {
                  if (!r) {
                    o = null;
                    break a;
                  }
                  if (o = lt(o.nextSibling), o === null) {
                    o = null;
                    break a;
                  }
                }
                r = o.data, o = r === "F!" || r === "F" ? o : null;
              }
              if (o) {
                Re = lt(o.nextSibling), l = o.data === "F!";
                break e;
              }
            }
            Tl(l);
          }
          l = !1;
        }
        l && (a = t[0]);
      }
    }
    return t = wa(), t.memoizedState = t.baseState = a, l = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: Yg,
      lastRenderedState: a
    }, t.queue = l, t = dh.bind(null, W, l), l.dispatch = t, l = rc(!1), r = uf.bind(null, W, !1, l.queue), l = wa(), o = {
      state: a,
      dispatch: null,
      action: e,
      pending: null
    }, l.queue = o, t = U0.bind(null, W, o, r, t), o.dispatch = t, l.memoizedState = e, [a, t, !1];
  }
  function Yp(e) {
    var a = Ze();
    return Kg(a, ke, e);
  }
  function Kg(e, a, t) {
    if (a = tf(e, a, Yg)[0], e = ps(Vt)[0], typeof a == "object" && a !== null && typeof a.then == "function") try {
      var l = _n(a);
    } catch (n) {
      throw n === Sr ? li : n;
    } else l = a;
    a = Ze();
    var o = a.queue,
      r = o.dispatch;
    return t !== a.memoizedState && (W.flags |= 2048, gr(9, {
      destroy: void 0
    }, q0.bind(null, o, t), null)), [l, r, e];
  }
  function q0(e, a) {
    e.action = a;
  }
  function Kp(e) {
    var a = Ze(),
      t = ke;
    if (t !== null) return Kg(a, t, e);
    Ze(), a = a.memoizedState, t = Ze();
    var l = t.queue.dispatch;
    return t.memoizedState = e, [a, l, !1];
  }
  function gr(e, a, t, l) {
    return e = {
      tag: e,
      create: t,
      deps: l,
      inst: a,
      next: null
    }, a = W.updateQueue, a === null && (a = oi(), W.updateQueue = a), t = a.lastEffect, t === null ? a.lastEffect = e.next = e : (l = t.next, t.next = e, e.next = l, a.lastEffect = e), e;
  }
  function Qg() {
    return Ze().memoizedState;
  }
  function ms(e, a, t, l) {
    var o = wa();
    W.flags |= e, o.memoizedState = gr(1 | a, {
      destroy: void 0
    }, t, l === void 0 ? null : l);
  }
  function ni(e, a, t, l) {
    var o = Ze();
    l = l === void 0 ? null : l;
    var r = o.memoizedState.inst;
    ke !== null && l !== null && Qc(l, ke.memoizedState.deps) ? o.memoizedState = gr(a, r, t, l) : (W.flags |= e, o.memoizedState = gr(1 | a, r, t, l));
  }
  function Qp(e, a) {
    ms(8390656, 8, e, a);
  }
  function lf(e, a) {
    ni(2048, 8, e, a);
  }
  function F0(e) {
    W.flags |= 4;
    var a = W.updateQueue;
    if (a === null) a = oi(), W.updateQueue = a, a.events = [e];else {
      var t = a.events;
      t === null ? a.events = [e] : t.push(e);
    }
  }
  function Wg(e) {
    var a = Ze().memoizedState;
    return F0({
      ref: a,
      nextImpl: e
    }), function () {
      if ((me & 2) !== 0) throw Error(k(440));
      return a.impl.apply(void 0, arguments);
    };
  }
  function Jg(e, a) {
    return ni(4, 2, e, a);
  }
  function $g(e, a) {
    return ni(4, 4, e, a);
  }
  function eh(e, a) {
    if (typeof a == "function") {
      e = e();
      var t = a(e);
      return function () {
        typeof t == "function" ? t() : a(null);
      };
    }
    if (a != null) return e = e(), a.current = e, function () {
      a.current = null;
    };
  }
  function ah(e, a, t) {
    t = t != null ? t.concat([e]) : null, ni(4, 4, eh.bind(null, a, e), t);
  }
  function of() {}
  function th(e, a) {
    var t = Ze();
    a = a === void 0 ? null : a;
    var l = t.memoizedState;
    return a !== null && Qc(a, l[1]) ? l[0] : (t.memoizedState = [e, a], e);
  }
  function lh(e, a) {
    var t = Ze();
    a = a === void 0 ? null : a;
    var l = t.memoizedState;
    if (a !== null && Qc(a, l[1])) return l[0];
    if (l = e(), io) {
      gl(!0);
      try {
        e();
      } finally {
        gl(!1);
      }
    }
    return t.memoizedState = [l, a], l;
  }
  function rf(e, a, t) {
    return t === void 0 || (Gt & 1073741824) !== 0 && (se & 261930) === 0 ? e.memoizedState = a : (e.memoizedState = t, e = Xh(), W.lanes |= e, Rl |= e, t);
  }
  function oh(e, a, t, l) {
    return Va(t, a) ? t : mr.current !== null ? (e = rf(e, t, l), Va(e, a) || ($e = !0), e) : (Gt & 42) === 0 || (Gt & 1073741824) !== 0 && (se & 261930) === 0 ? ($e = !0, e.memoizedState = t) : (e = Xh(), W.lanes |= e, Rl |= e, a);
  }
  function rh(e, a, t, l, o) {
    var r = ge.p;
    ge.p = r !== 0 && 8 > r ? r : 8;
    var n = Y.T,
      u = {};
    Y.T = u, uf(e, !1, a, t);
    try {
      var s = o(),
        i = Y.S;
      if (i !== null && i(u, s), s !== null && typeof s == "object" && typeof s.then == "function") {
        var d = O0(s, l);
        gn(e, a, d, Ga(e));
      } else gn(e, a, l, Ga(e));
    } catch (x) {
      gn(e, a, {
        then: function () {},
        status: "rejected",
        reason: x
      }, Ga());
    } finally {
      ge.p = r, n !== null && u.types !== null && (n.types = u.types), Y.T = n;
    }
  }
  function P0() {}
  function uc(e, a, t, l) {
    if (e.tag !== 5) throw Error(k(476));
    var o = nh(e).queue;
    rh(e, o, a, ao, t === null ? P0 : function () {
      return uh(e), t(l);
    });
  }
  function nh(e) {
    var a = e.memoizedState;
    if (a !== null) return a;
    a = {
      memoizedState: ao,
      baseState: ao,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: Vt,
        lastRenderedState: ao
      },
      next: null
    };
    var t = {};
    return a.next = {
      memoizedState: t,
      baseState: t,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: Vt,
        lastRenderedState: t
      },
      next: null
    }, e.memoizedState = a, e = e.alternate, e !== null && (e.memoizedState = a), a;
  }
  function uh(e) {
    var a = nh(e);
    a.next === null && (a = e.alternate.memoizedState), gn(e, a.next.queue, {}, Ga());
  }
  function nf() {
    return pa(Rn);
  }
  function sh() {
    return Ze().memoizedState;
  }
  function ih() {
    return Ze().memoizedState;
  }
  function H0(e) {
    for (var a = e.return; a !== null;) {
      switch (a.tag) {
        case 24:
        case 3:
          var t = Ga();
          e = wl(t);
          var l = Cl(a, e, t);
          l !== null && (Ta(l, a, t), fn(l, a, t)), a = {
            cache: Xc()
          }, e.payload = a;
          return;
      }
      a = a.return;
    }
  }
  function _0(e, a, t) {
    var l = Ga();
    t = {
      lane: l,
      revertLane: 0,
      gesture: null,
      action: t,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, ui(e) ? ch(a, t) : (t = Hc(e, a, t, l), t !== null && (Ta(t, e, l), fh(t, a, l)));
  }
  function dh(e, a, t) {
    var l = Ga();
    gn(e, a, t, l);
  }
  function gn(e, a, t, l) {
    var o = {
      lane: l,
      revertLane: 0,
      gesture: null,
      action: t,
      hasEagerState: !1,
      eagerState: null,
      next: null
    };
    if (ui(e)) ch(a, o);else {
      var r = e.alternate;
      if (e.lanes === 0 && (r === null || r.lanes === 0) && (r = a.lastRenderedReducer, r !== null)) try {
        var n = a.lastRenderedState,
          u = r(n, t);
        if (o.hasEagerState = !0, o.eagerState = u, Va(u, n)) return ti(e, a, o, 0), Ae === null && ai(), !1;
      } catch {}
      if (t = Hc(e, a, o, l), t !== null) return Ta(t, e, l), fh(t, a, l), !0;
    }
    return !1;
  }
  function uf(e, a, t, l) {
    if (l = {
      lane: 2,
      revertLane: xf(),
      gesture: null,
      action: l,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, ui(e)) {
      if (a) throw Error(k(479));
    } else a = Hc(e, t, l, 2), a !== null && Ta(a, e, 2);
  }
  function ui(e) {
    var a = e.alternate;
    return e === W || a !== null && a === W;
  }
  function ch(e, a) {
    sr = Os = !0;
    var t = e.pending;
    t === null ? a.next = a : (a.next = t.next, t.next = a), e.pending = a;
  }
  function fh(e, a, t) {
    if ((t & 4194048) !== 0) {
      var l = a.lanes;
      l &= e.pendingLanes, t |= l, a.lanes = t, Wm(e, t);
    }
  }
  var Nn = {
    readContext: pa,
    use: ri,
    useCallback: _e,
    useContext: _e,
    useEffect: _e,
    useImperativeHandle: _e,
    useLayoutEffect: _e,
    useInsertionEffect: _e,
    useMemo: _e,
    useReducer: _e,
    useRef: _e,
    useState: _e,
    useDebugValue: _e,
    useDeferredValue: _e,
    useTransition: _e,
    useSyncExternalStore: _e,
    useId: _e,
    useHostTransitionStatus: _e,
    useFormState: _e,
    useActionState: _e,
    useOptimistic: _e,
    useMemoCache: _e,
    useCacheRefresh: _e
  };
  Nn.useEffectEvent = _e;
  var ph = {
      readContext: pa,
      use: ri,
      useCallback: function (e, a) {
        return wa().memoizedState = [e, a === void 0 ? null : a], e;
      },
      useContext: pa,
      useEffect: Qp,
      useImperativeHandle: function (e, a, t) {
        t = t != null ? t.concat([e]) : null, ms(4194308, 4, eh.bind(null, a, e), t);
      },
      useLayoutEffect: function (e, a) {
        return ms(4194308, 4, e, a);
      },
      useInsertionEffect: function (e, a) {
        ms(4, 2, e, a);
      },
      useMemo: function (e, a) {
        var t = wa();
        a = a === void 0 ? null : a;
        var l = e();
        if (io) {
          gl(!0);
          try {
            e();
          } finally {
            gl(!1);
          }
        }
        return t.memoizedState = [l, a], l;
      },
      useReducer: function (e, a, t) {
        var l = wa();
        if (t !== void 0) {
          var o = t(a);
          if (io) {
            gl(!0);
            try {
              t(a);
            } finally {
              gl(!1);
            }
          }
        } else o = a;
        return l.memoizedState = l.baseState = o, e = {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: e,
          lastRenderedState: o
        }, l.queue = e, e = e.dispatch = _0.bind(null, W, e), [l.memoizedState, e];
      },
      useRef: function (e) {
        var a = wa();
        return e = {
          current: e
        }, a.memoizedState = e;
      },
      useState: function (e) {
        e = rc(e);
        var a = e.queue,
          t = dh.bind(null, W, a);
        return a.dispatch = t, [e.memoizedState, t];
      },
      useDebugValue: of,
      useDeferredValue: function (e, a) {
        var t = wa();
        return rf(t, e, a);
      },
      useTransition: function () {
        var e = rc(!1);
        return e = rh.bind(null, W, e.queue, !0, !1), wa().memoizedState = e, [!1, e];
      },
      useSyncExternalStore: function (e, a, t) {
        var l = W,
          o = wa();
        if (de) {
          if (t === void 0) throw Error(k(407));
          t = t();
        } else {
          if (t = a(), Ae === null) throw Error(k(349));
          (se & 127) !== 0 || Pg(l, a, t);
        }
        o.memoizedState = t;
        var r = {
          value: t,
          getSnapshot: a
        };
        return o.queue = r, Qp(_g.bind(null, l, r, e), [e]), l.flags |= 2048, gr(9, {
          destroy: void 0
        }, Hg.bind(null, l, r, t, a), null), t;
      },
      useId: function () {
        var e = wa(),
          a = Ae.identifierPrefix;
        if (de) {
          var t = bt,
            l = xt;
          t = (l & ~(1 << 32 - _a(l) - 1)).toString(32) + t, a = "_" + a + "R_" + t, t = Es++, 0 < t && (a += "H" + t.toString(32)), a += "_";
        } else t = E0++, a = "_" + a + "r_" + t.toString(32) + "_";
        return e.memoizedState = a;
      },
      useHostTransitionStatus: nf,
      useFormState: Zp,
      useActionState: Zp,
      useOptimistic: function (e) {
        var a = wa();
        a.memoizedState = a.baseState = e;
        var t = {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: null,
          lastRenderedState: null
        };
        return a.queue = t, a = uf.bind(null, W, !0, t), t.dispatch = a, [e, a];
      },
      useMemoCache: af,
      useCacheRefresh: function () {
        return wa().memoizedState = H0.bind(null, W);
      },
      useEffectEvent: function (e) {
        var a = wa(),
          t = {
            impl: e
          };
        return a.memoizedState = t, function () {
          if ((me & 2) !== 0) throw Error(k(440));
          return t.impl.apply(void 0, arguments);
        };
      }
    },
    sf = {
      readContext: pa,
      use: ri,
      useCallback: th,
      useContext: pa,
      useEffect: lf,
      useImperativeHandle: ah,
      useInsertionEffect: Jg,
      useLayoutEffect: $g,
      useMemo: lh,
      useReducer: ps,
      useRef: Qg,
      useState: function () {
        return ps(Vt);
      },
      useDebugValue: of,
      useDeferredValue: function (e, a) {
        var t = Ze();
        return oh(t, ke.memoizedState, e, a);
      },
      useTransition: function () {
        var e = ps(Vt)[0],
          a = Ze().memoizedState;
        return [typeof e == "boolean" ? e : _n(e), a];
      },
      useSyncExternalStore: Fg,
      useId: sh,
      useHostTransitionStatus: nf,
      useFormState: Yp,
      useActionState: Yp,
      useOptimistic: function (e, a) {
        var t = Ze();
        return Xg(t, ke, e, a);
      },
      useMemoCache: af,
      useCacheRefresh: ih
    };
  sf.useEffectEvent = Wg;
  var mh = {
    readContext: pa,
    use: ri,
    useCallback: th,
    useContext: pa,
    useEffect: lf,
    useImperativeHandle: ah,
    useInsertionEffect: Jg,
    useLayoutEffect: $g,
    useMemo: lh,
    useReducer: gd,
    useRef: Qg,
    useState: function () {
      return gd(Vt);
    },
    useDebugValue: of,
    useDeferredValue: function (e, a) {
      var t = Ze();
      return ke === null ? rf(t, e, a) : oh(t, ke.memoizedState, e, a);
    },
    useTransition: function () {
      var e = gd(Vt)[0],
        a = Ze().memoizedState;
      return [typeof e == "boolean" ? e : _n(e), a];
    },
    useSyncExternalStore: Fg,
    useId: sh,
    useHostTransitionStatus: nf,
    useFormState: Kp,
    useActionState: Kp,
    useOptimistic: function (e, a) {
      var t = Ze();
      return ke !== null ? Xg(t, ke, e, a) : (t.baseState = e, [e, t.queue.dispatch]);
    },
    useMemoCache: af,
    useCacheRefresh: ih
  };
  mh.useEffectEvent = Wg;
  function hd(e, a, t, l) {
    a = e.memoizedState, t = t(l, a), t = t == null ? a : Be({}, a, t), e.memoizedState = t, e.lanes === 0 && (e.updateQueue.baseState = t);
  }
  var sc = {
    enqueueSetState: function (e, a, t) {
      e = e._reactInternals;
      var l = Ga(),
        o = wl(l);
      o.payload = a, t != null && (o.callback = t), a = Cl(e, o, l), a !== null && (Ta(a, e, l), fn(a, e, l));
    },
    enqueueReplaceState: function (e, a, t) {
      e = e._reactInternals;
      var l = Ga(),
        o = wl(l);
      o.tag = 1, o.payload = a, t != null && (o.callback = t), a = Cl(e, o, l), a !== null && (Ta(a, e, l), fn(a, e, l));
    },
    enqueueForceUpdate: function (e, a) {
      e = e._reactInternals;
      var t = Ga(),
        l = wl(t);
      l.tag = 2, a != null && (l.callback = a), a = Cl(e, l, t), a !== null && (Ta(a, e, t), fn(a, e, t));
    }
  };
  function Wp(e, a, t, l, o, r, n) {
    return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(l, r, n) : a.prototype && a.prototype.isPureReactComponent ? !Sn(t, l) || !Sn(o, r) : !0;
  }
  function Jp(e, a, t, l) {
    e = a.state, typeof a.componentWillReceiveProps == "function" && a.componentWillReceiveProps(t, l), typeof a.UNSAFE_componentWillReceiveProps == "function" && a.UNSAFE_componentWillReceiveProps(t, l), a.state !== e && sc.enqueueReplaceState(a, a.state, null);
  }
  function co(e, a) {
    var t = a;
    if ("ref" in a) {
      t = {};
      for (var l in a) l !== "ref" && (t[l] = a[l]);
    }
    if (e = e.defaultProps) {
      t === a && (t = Be({}, t));
      for (var o in e) t[o] === void 0 && (t[o] = e[o]);
    }
    return t;
  }
  function gh(e) {
    As(e);
  }
  function hh(e) {
    console.error(e);
  }
  function xh(e) {
    As(e);
  }
  function zs(e, a) {
    try {
      var t = e.onUncaughtError;
      t(a.value, {
        componentStack: a.stack
      });
    } catch (l) {
      setTimeout(function () {
        throw l;
      });
    }
  }
  function $p(e, a, t) {
    try {
      var l = e.onCaughtError;
      l(t.value, {
        componentStack: t.stack,
        errorBoundary: a.tag === 1 ? a.stateNode : null
      });
    } catch (o) {
      setTimeout(function () {
        throw o;
      });
    }
  }
  function ic(e, a, t) {
    return t = wl(t), t.tag = 3, t.payload = {
      element: null
    }, t.callback = function () {
      zs(e, a);
    }, t;
  }
  function bh(e) {
    return e = wl(e), e.tag = 3, e;
  }
  function vh(e, a, t, l) {
    var o = t.type.getDerivedStateFromError;
    if (typeof o == "function") {
      var r = l.value;
      e.payload = function () {
        return o(r);
      }, e.callback = function () {
        $p(a, t, l);
      };
    }
    var n = t.stateNode;
    n !== null && typeof n.componentDidCatch == "function" && (e.callback = function () {
      $p(a, t, l), typeof o != "function" && (Sl === null ? Sl = new Set([this]) : Sl.add(this));
      var u = l.stack;
      this.componentDidCatch(l.value, {
        componentStack: u !== null ? u : ""
      });
    });
  }
  function G0(e, a, t, l, o) {
    if (t.flags |= 32768, l !== null && typeof l == "object" && typeof l.then == "function") {
      if (a = t.alternate, a !== null && Cr(a, t, o, !0), t = Xa.current, t !== null) {
        switch (t.tag) {
          case 31:
          case 13:
            return tt === null ? Hs() : t.alternate === null && Ge === 0 && (Ge = 3), t.flags &= -257, t.flags |= 65536, t.lanes = o, l === Ds ? t.flags |= 16384 : (a = t.updateQueue, a === null ? t.updateQueue = new Set([l]) : a.add(l), Ad(e, l, o)), !1;
          case 22:
            return t.flags |= 65536, l === Ds ? t.flags |= 16384 : (a = t.updateQueue, a === null ? (a = {
              transitions: null,
              markerInstances: null,
              retryQueue: new Set([l])
            }, t.updateQueue = a) : (t = a.retryQueue, t === null ? a.retryQueue = new Set([l]) : t.add(l)), Ad(e, l, o)), !1;
        }
        throw Error(k(435, t.tag));
      }
      return Ad(e, l, o), Hs(), !1;
    }
    if (de) return a = Xa.current, a !== null ? ((a.flags & 65536) === 0 && (a.flags |= 256), a.flags |= 65536, a.lanes = o, l !== Qd && (e = Error(k(422), {
      cause: l
    }), In(et(e, t)))) : (l !== Qd && (a = Error(k(423), {
      cause: l
    }), In(et(a, t))), e = e.current.alternate, e.flags |= 65536, o &= -o, e.lanes |= o, l = et(l, t), o = ic(e.stateNode, l, o), md(e, o), Ge !== 4 && (Ge = 2)), !1;
    var r = Error(k(520), {
      cause: l
    });
    if (r = et(r, t), bn === null ? bn = [r] : bn.push(r), Ge !== 4 && (Ge = 2), a === null) return !0;
    l = et(l, t), t = a;
    do {
      switch (t.tag) {
        case 3:
          return t.flags |= 65536, e = o & -o, t.lanes |= e, e = ic(t.stateNode, l, e), md(t, e), !1;
        case 1:
          if (a = t.type, r = t.stateNode, (t.flags & 128) === 0 && (typeof a.getDerivedStateFromError == "function" || r !== null && typeof r.componentDidCatch == "function" && (Sl === null || !Sl.has(r)))) return t.flags |= 65536, o &= -o, t.lanes |= o, o = bh(o), vh(o, e, t, l), md(t, o), !1;
      }
      t = t.return;
    } while (t !== null);
    return !1;
  }
  var df = Error(k(461)),
    $e = !1;
  function da(e, a, t, l) {
    a.child = e === null ? Bg(a, null, t, l) : so(a, e.child, t, l);
  }
  function em(e, a, t, l, o) {
    t = t.render;
    var r = a.ref;
    if ("ref" in l) {
      var n = {};
      for (var u in l) u !== "ref" && (n[u] = l[u]);
    } else n = l;
    return uo(a), l = Wc(e, a, t, n, r, o), u = Jc(), e !== null && !$e ? ($c(e, a, o), Xt(e, a, o)) : (de && u && Gc(a), a.flags |= 1, da(e, a, l, o), a.child);
  }
  function am(e, a, t, l, o) {
    if (e === null) {
      var r = t.type;
      return typeof r == "function" && !_c(r) && r.defaultProps === void 0 && t.compare === null ? (a.tag = 15, a.type = r, yh(e, a, r, l, o)) : (e = cs(t.type, null, l, a, a.mode, o), e.ref = a.ref, e.return = a, a.child = e);
    }
    if (r = e.child, !cf(e, o)) {
      var n = r.memoizedProps;
      if (t = t.compare, t = t !== null ? t : Sn, t(n, l) && e.ref === a.ref) return Xt(e, a, o);
    }
    return a.flags |= 1, e = Ft(r, l), e.ref = a.ref, e.return = a, a.child = e;
  }
  function yh(e, a, t, l, o) {
    if (e !== null) {
      var r = e.memoizedProps;
      if (Sn(r, l) && e.ref === a.ref) if ($e = !1, a.pendingProps = l = r, cf(e, o)) (e.flags & 131072) !== 0 && ($e = !0);else return a.lanes = e.lanes, Xt(e, a, o);
    }
    return dc(e, a, t, l, o);
  }
  function Lh(e, a, t, l) {
    var o = l.children,
      r = e !== null ? e.memoizedState : null;
    if (e === null && a.stateNode === null && (a.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }), l.mode === "hidden") {
      if ((a.flags & 128) !== 0) {
        if (r = r !== null ? r.baseLanes | t : t, e !== null) {
          for (l = a.child = e.child, o = 0; l !== null;) o = o | l.lanes | l.childLanes, l = l.sibling;
          l = o & ~r;
        } else l = 0, a.child = null;
        return tm(e, a, r, t, l);
      }
      if ((t & 536870912) !== 0) a.memoizedState = {
        baseLanes: 0,
        cachePool: null
      }, e !== null && fs(a, r !== null ? r.cachePool : null), r !== null ? Vp(a, r) : lc(), zg(a);else return l = a.lanes = 536870912, tm(e, a, r !== null ? r.baseLanes | t : t, t, l);
    } else r !== null ? (fs(a, r.cachePool), Vp(a, r), pl(a), a.memoizedState = null) : (e !== null && fs(a, null), lc(), pl(a));
    return da(e, a, o, t), a.child;
  }
  function rn(e, a) {
    return e !== null && e.tag === 22 || a.stateNode !== null || (a.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }), a.sibling;
  }
  function tm(e, a, t, l, o) {
    var r = jc();
    return r = r === null ? null : {
      parent: Je._currentValue,
      pool: r
    }, a.memoizedState = {
      baseLanes: t,
      cachePool: r
    }, e !== null && fs(a, null), lc(), zg(a), e !== null && Cr(e, a, l, !0), a.childLanes = o, null;
  }
  function gs(e, a) {
    return a = Us({
      mode: a.mode,
      children: a.children
    }, e.mode), a.ref = e.ref, e.child = a, a.return = e, a;
  }
  function lm(e, a, t) {
    return so(a, e.child, null, t), e = gs(a, a.pendingProps), e.flags |= 2, Ua(a), a.memoizedState = null, e;
  }
  function V0(e, a, t) {
    var l = a.pendingProps,
      o = (a.flags & 128) !== 0;
    if (a.flags &= -129, e === null) {
      if (de) {
        if (l.mode === "hidden") return e = gs(a, l), a.lanes = 536870912, rn(null, e);
        if (oc(a), (e = Re) ? (e = px(e, at), e = e !== null && e.data === "&" ? e : null, e !== null && (a.memoizedState = {
          dehydrated: e,
          treeContext: Nl !== null ? {
            id: xt,
            overflow: bt
          } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, t = Ig(e), t.return = a, a.child = t, fa = a, Re = null)) : e = null, e === null) throw Tl(a);
        return a.lanes = 536870912, null;
      }
      return gs(a, l);
    }
    var r = e.memoizedState;
    if (r !== null) {
      var n = r.dehydrated;
      if (oc(a), o) {
        if (a.flags & 256) a.flags &= -257, a = lm(e, a, t);else if (a.memoizedState !== null) a.child = e.child, a.flags |= 128, a = null;else throw Error(k(558));
      } else if ($e || Cr(e, a, t, !1), o = (t & e.childLanes) !== 0, $e || o) {
        if (l = Ae, l !== null && (n = Jm(l, t), n !== 0 && n !== r.retryLane)) throw r.retryLane = n, go(e, n), Ta(l, e, n), df;
        Hs(), a = lm(e, a, t);
      } else e = r.treeContext, Re = lt(n.nextSibling), fa = a, de = !0, Ll = null, at = !1, e !== null && Mg(a, e), a = gs(a, l), a.flags |= 4096;
      return a;
    }
    return e = Ft(e.child, {
      mode: l.mode,
      children: l.children
    }), e.ref = a.ref, a.child = e, e.return = a, e;
  }
  function hs(e, a) {
    var t = a.ref;
    if (t === null) e !== null && e.ref !== null && (a.flags |= 4194816);else {
      if (typeof t != "function" && typeof t != "object") throw Error(k(284));
      (e === null || e.ref !== t) && (a.flags |= 4194816);
    }
  }
  function dc(e, a, t, l, o) {
    return uo(a), t = Wc(e, a, t, l, void 0, o), l = Jc(), e !== null && !$e ? ($c(e, a, o), Xt(e, a, o)) : (de && l && Gc(a), a.flags |= 1, da(e, a, t, o), a.child);
  }
  function om(e, a, t, l, o, r) {
    return uo(a), a.updateQueue = null, t = qg(a, l, t, o), Ug(e), l = Jc(), e !== null && !$e ? ($c(e, a, r), Xt(e, a, r)) : (de && l && Gc(a), a.flags |= 1, da(e, a, t, r), a.child);
  }
  function rm(e, a, t, l, o) {
    if (uo(a), a.stateNode === null) {
      var r = $o,
        n = t.contextType;
      typeof n == "object" && n !== null && (r = pa(n)), r = new t(l, r), a.memoizedState = r.state !== null && r.state !== void 0 ? r.state : null, r.updater = sc, a.stateNode = r, r._reactInternals = a, r = a.stateNode, r.props = l, r.state = a.memoizedState, r.refs = {}, Yc(a), n = t.contextType, r.context = typeof n == "object" && n !== null ? pa(n) : $o, r.state = a.memoizedState, n = t.getDerivedStateFromProps, typeof n == "function" && (hd(a, t, n, l), r.state = a.memoizedState), typeof t.getDerivedStateFromProps == "function" || typeof r.getSnapshotBeforeUpdate == "function" || typeof r.UNSAFE_componentWillMount != "function" && typeof r.componentWillMount != "function" || (n = r.state, typeof r.componentWillMount == "function" && r.componentWillMount(), typeof r.UNSAFE_componentWillMount == "function" && r.UNSAFE_componentWillMount(), n !== r.state && sc.enqueueReplaceState(r, r.state, null), mn(a, l, r, o), pn(), r.state = a.memoizedState), typeof r.componentDidMount == "function" && (a.flags |= 4194308), l = !0;
    } else if (e === null) {
      r = a.stateNode;
      var u = a.memoizedProps,
        s = co(t, u);
      r.props = s;
      var i = r.context,
        d = t.contextType;
      n = $o, typeof d == "object" && d !== null && (n = pa(d));
      var x = t.getDerivedStateFromProps;
      d = typeof x == "function" || typeof r.getSnapshotBeforeUpdate == "function", u = a.pendingProps !== u, d || typeof r.UNSAFE_componentWillReceiveProps != "function" && typeof r.componentWillReceiveProps != "function" || (u || i !== n) && Jp(a, r, l, n), dl = !1;
      var m = a.memoizedState;
      r.state = m, mn(a, l, r, o), pn(), i = a.memoizedState, u || m !== i || dl ? (typeof x == "function" && (hd(a, t, x, l), i = a.memoizedState), (s = dl || Wp(a, t, s, l, m, i, n)) ? (d || typeof r.UNSAFE_componentWillMount != "function" && typeof r.componentWillMount != "function" || (typeof r.componentWillMount == "function" && r.componentWillMount(), typeof r.UNSAFE_componentWillMount == "function" && r.UNSAFE_componentWillMount()), typeof r.componentDidMount == "function" && (a.flags |= 4194308)) : (typeof r.componentDidMount == "function" && (a.flags |= 4194308), a.memoizedProps = l, a.memoizedState = i), r.props = l, r.state = i, r.context = n, l = s) : (typeof r.componentDidMount == "function" && (a.flags |= 4194308), l = !1);
    } else {
      r = a.stateNode, ac(e, a), n = a.memoizedProps, d = co(t, n), r.props = d, x = a.pendingProps, m = r.context, i = t.contextType, s = $o, typeof i == "object" && i !== null && (s = pa(i)), u = t.getDerivedStateFromProps, (i = typeof u == "function" || typeof r.getSnapshotBeforeUpdate == "function") || typeof r.UNSAFE_componentWillReceiveProps != "function" && typeof r.componentWillReceiveProps != "function" || (n !== x || m !== s) && Jp(a, r, l, s), dl = !1, m = a.memoizedState, r.state = m, mn(a, l, r, o), pn();
      var g = a.memoizedState;
      n !== x || m !== g || dl || e !== null && e.dependencies !== null && Ts(e.dependencies) ? (typeof u == "function" && (hd(a, t, u, l), g = a.memoizedState), (d = dl || Wp(a, t, d, l, m, g, s) || e !== null && e.dependencies !== null && Ts(e.dependencies)) ? (i || typeof r.UNSAFE_componentWillUpdate != "function" && typeof r.componentWillUpdate != "function" || (typeof r.componentWillUpdate == "function" && r.componentWillUpdate(l, g, s), typeof r.UNSAFE_componentWillUpdate == "function" && r.UNSAFE_componentWillUpdate(l, g, s)), typeof r.componentDidUpdate == "function" && (a.flags |= 4), typeof r.getSnapshotBeforeUpdate == "function" && (a.flags |= 1024)) : (typeof r.componentDidUpdate != "function" || n === e.memoizedProps && m === e.memoizedState || (a.flags |= 4), typeof r.getSnapshotBeforeUpdate != "function" || n === e.memoizedProps && m === e.memoizedState || (a.flags |= 1024), a.memoizedProps = l, a.memoizedState = g), r.props = l, r.state = g, r.context = s, l = d) : (typeof r.componentDidUpdate != "function" || n === e.memoizedProps && m === e.memoizedState || (a.flags |= 4), typeof r.getSnapshotBeforeUpdate != "function" || n === e.memoizedProps && m === e.memoizedState || (a.flags |= 1024), l = !1);
    }
    return r = l, hs(e, a), l = (a.flags & 128) !== 0, r || l ? (r = a.stateNode, t = l && typeof t.getDerivedStateFromError != "function" ? null : r.render(), a.flags |= 1, e !== null && l ? (a.child = so(a, e.child, null, o), a.child = so(a, null, t, o)) : da(e, a, t, o), a.memoizedState = r.state, e = a.child) : e = Xt(e, a, o), e;
  }
  function nm(e, a, t, l) {
    return no(), a.flags |= 256, da(e, a, t, l), a.child;
  }
  var xd = {
    dehydrated: null,
    treeContext: null,
    retryLane: 0,
    hydrationErrors: null
  };
  function bd(e) {
    return {
      baseLanes: e,
      cachePool: Tg()
    };
  }
  function vd(e, a, t) {
    return e = e !== null ? e.childLanes & ~t : 0, a && (e |= Fa), e;
  }
  function wh(e, a, t) {
    var l = a.pendingProps,
      o = !1,
      r = (a.flags & 128) !== 0,
      n;
    if ((n = r) || (n = e !== null && e.memoizedState === null ? !1 : (je.current & 2) !== 0), n && (o = !0, a.flags &= -129), n = (a.flags & 32) !== 0, a.flags &= -33, e === null) {
      if (de) {
        if (o ? fl(a) : pl(a), (e = Re) ? (e = px(e, at), e = e !== null && e.data !== "&" ? e : null, e !== null && (a.memoizedState = {
          dehydrated: e,
          treeContext: Nl !== null ? {
            id: xt,
            overflow: bt
          } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, t = Ig(e), t.return = a, a.child = t, fa = a, Re = null)) : e = null, e === null) throw Tl(a);
        return Sc(e) ? a.lanes = 32 : a.lanes = 536870912, null;
      }
      var u = l.children;
      return l = l.fallback, o ? (pl(a), o = a.mode, u = Us({
        mode: "hidden",
        children: u
      }, o), l = to(l, o, t, null), u.return = a, l.return = a, u.sibling = l, a.child = u, l = a.child, l.memoizedState = bd(t), l.childLanes = vd(e, n, t), a.memoizedState = xd, rn(null, l)) : (fl(a), cc(a, u));
    }
    var s = e.memoizedState;
    if (s !== null && (u = s.dehydrated, u !== null)) {
      if (r) a.flags & 256 ? (fl(a), a.flags &= -257, a = yd(e, a, t)) : a.memoizedState !== null ? (pl(a), a.child = e.child, a.flags |= 128, a = null) : (pl(a), u = l.fallback, o = a.mode, l = Us({
        mode: "visible",
        children: l.children
      }, o), u = to(u, o, t, null), u.flags |= 2, l.return = a, u.return = a, l.sibling = u, a.child = l, so(a, e.child, null, t), l = a.child, l.memoizedState = bd(t), l.childLanes = vd(e, n, t), a.memoizedState = xd, a = rn(null, l));else if (fl(a), Sc(u)) {
        if (n = u.nextSibling && u.nextSibling.dataset, n) var i = n.dgst;
        n = i, l = Error(k(419)), l.stack = "", l.digest = n, In({
          value: l,
          source: null,
          stack: null
        }), a = yd(e, a, t);
      } else if ($e || Cr(e, a, t, !1), n = (t & e.childLanes) !== 0, $e || n) {
        if (n = Ae, n !== null && (l = Jm(n, t), l !== 0 && l !== s.retryLane)) throw s.retryLane = l, go(e, l), Ta(n, e, l), df;
        Cc(u) || Hs(), a = yd(e, a, t);
      } else Cc(u) ? (a.flags |= 192, a.child = e.child, a = null) : (e = s.treeContext, Re = lt(u.nextSibling), fa = a, de = !0, Ll = null, at = !1, e !== null && Mg(a, e), a = cc(a, l.children), a.flags |= 4096);
      return a;
    }
    return o ? (pl(a), u = l.fallback, o = a.mode, s = e.child, i = s.sibling, l = Ft(s, {
      mode: "hidden",
      children: l.children
    }), l.subtreeFlags = s.subtreeFlags & 65011712, i !== null ? u = Ft(i, u) : (u = to(u, o, t, null), u.flags |= 2), u.return = a, l.return = a, l.sibling = u, a.child = l, rn(null, l), l = a.child, u = e.child.memoizedState, u === null ? u = bd(t) : (o = u.cachePool, o !== null ? (s = Je._currentValue, o = o.parent !== s ? {
      parent: s,
      pool: s
    } : o) : o = Tg(), u = {
      baseLanes: u.baseLanes | t,
      cachePool: o
    }), l.memoizedState = u, l.childLanes = vd(e, n, t), a.memoizedState = xd, rn(e.child, l)) : (fl(a), t = e.child, e = t.sibling, t = Ft(t, {
      mode: "visible",
      children: l.children
    }), t.return = a, t.sibling = null, e !== null && (n = a.deletions, n === null ? (a.deletions = [e], a.flags |= 16) : n.push(e)), a.child = t, a.memoizedState = null, t);
  }
  function cc(e, a) {
    return a = Us({
      mode: "visible",
      children: a
    }, e.mode), a.return = e, e.child = a;
  }
  function Us(e, a) {
    return e = qa(22, e, null, a), e.lanes = 0, e;
  }
  function yd(e, a, t) {
    return so(a, e.child, null, t), e = cc(a, a.pendingProps.children), e.flags |= 2, a.memoizedState = null, e;
  }
  function um(e, a, t) {
    e.lanes |= a;
    var l = e.alternate;
    l !== null && (l.lanes |= a), Jd(e.return, a, t);
  }
  function Ld(e, a, t, l, o, r) {
    var n = e.memoizedState;
    n === null ? e.memoizedState = {
      isBackwards: a,
      rendering: null,
      renderingStartTime: 0,
      last: l,
      tail: t,
      tailMode: o,
      treeForkCount: r
    } : (n.isBackwards = a, n.rendering = null, n.renderingStartTime = 0, n.last = l, n.tail = t, n.tailMode = o, n.treeForkCount = r);
  }
  function Ch(e, a, t) {
    var l = a.pendingProps,
      o = l.revealOrder,
      r = l.tail;
    l = l.children;
    var n = je.current,
      u = (n & 2) !== 0;
    if (u ? (n = n & 1 | 2, a.flags |= 128) : n &= 1, Me(je, n), da(e, a, l, t), l = de ? kn : 0, !u && e !== null && (e.flags & 128) !== 0) e: for (e = a.child; e !== null;) {
      if (e.tag === 13) e.memoizedState !== null && um(e, t, a);else if (e.tag === 19) um(e, t, a);else if (e.child !== null) {
        e.child.return = e, e = e.child;
        continue;
      }
      if (e === a) break e;
      for (; e.sibling === null;) {
        if (e.return === null || e.return === a) break e;
        e = e.return;
      }
      e.sibling.return = e.return, e = e.sibling;
    }
    switch (o) {
      case "forwards":
        for (t = a.child, o = null; t !== null;) e = t.alternate, e !== null && Bs(e) === null && (o = t), t = t.sibling;
        t = o, t === null ? (o = a.child, a.child = null) : (o = t.sibling, t.sibling = null), Ld(a, !1, o, t, r, l);
        break;
      case "backwards":
      case "unstable_legacy-backwards":
        for (t = null, o = a.child, a.child = null; o !== null;) {
          if (e = o.alternate, e !== null && Bs(e) === null) {
            a.child = o;
            break;
          }
          e = o.sibling, o.sibling = t, t = o, o = e;
        }
        Ld(a, !0, t, null, r, l);
        break;
      case "together":
        Ld(a, !1, null, null, void 0, l);
        break;
      default:
        a.memoizedState = null;
    }
    return a.child;
  }
  function Xt(e, a, t) {
    if (e !== null && (a.dependencies = e.dependencies), Rl |= a.lanes, (t & a.childLanes) === 0) if (e !== null) {
      if (Cr(e, a, t, !1), (t & a.childLanes) === 0) return null;
    } else return null;
    if (e !== null && a.child !== e.child) throw Error(k(153));
    if (a.child !== null) {
      for (e = a.child, t = Ft(e, e.pendingProps), a.child = t, t.return = a; e.sibling !== null;) e = e.sibling, t = t.sibling = Ft(e, e.pendingProps), t.return = a;
      t.sibling = null;
    }
    return a.child;
  }
  function cf(e, a) {
    return (e.lanes & a) !== 0 ? !0 : (e = e.dependencies, !!(e !== null && Ts(e)));
  }
  function X0(e, a, t) {
    switch (a.tag) {
      case 3:
        Cs(a, a.stateNode.containerInfo), cl(a, Je, e.memoizedState.cache), no();
        break;
      case 27:
      case 5:
        Fd(a);
        break;
      case 4:
        Cs(a, a.stateNode.containerInfo);
        break;
      case 10:
        cl(a, a.type, a.memoizedProps.value);
        break;
      case 31:
        if (a.memoizedState !== null) return a.flags |= 128, oc(a), null;
        break;
      case 13:
        var l = a.memoizedState;
        if (l !== null) return l.dehydrated !== null ? (fl(a), a.flags |= 128, null) : (t & a.child.childLanes) !== 0 ? wh(e, a, t) : (fl(a), e = Xt(e, a, t), e !== null ? e.sibling : null);
        fl(a);
        break;
      case 19:
        var o = (e.flags & 128) !== 0;
        if (l = (t & a.childLanes) !== 0, l || (Cr(e, a, t, !1), l = (t & a.childLanes) !== 0), o) {
          if (l) return Ch(e, a, t);
          a.flags |= 128;
        }
        if (o = a.memoizedState, o !== null && (o.rendering = null, o.tail = null, o.lastEffect = null), Me(je, je.current), l) break;
        return null;
      case 22:
        return a.lanes = 0, Lh(e, a, t, a.pendingProps);
      case 24:
        cl(a, Je, e.memoizedState.cache);
    }
    return Xt(e, a, t);
  }
  function Sh(e, a, t) {
    if (e !== null) {
      if (e.memoizedProps !== a.pendingProps) $e = !0;else {
        if (!cf(e, t) && (a.flags & 128) === 0) return $e = !1, X0(e, a, t);
        $e = (e.flags & 131072) !== 0;
      }
    } else $e = !1, de && (a.flags & 1048576) !== 0 && Ag(a, kn, a.index);
    switch (a.lanes = 0, a.tag) {
      case 16:
        e: {
          var l = a.pendingProps;
          if (e = $l(a.elementType), a.type = e, typeof e == "function") _c(e) ? (l = co(e, l), a.tag = 1, a = rm(null, a, e, l, t)) : (a.tag = 0, a = dc(null, a, e, l, t));else {
            if (e != null) {
              var o = e.$$typeof;
              if (o === Mc) {
                a.tag = 11, a = em(null, a, e, l, t);
                break e;
              } else if (o === Nc) {
                a.tag = 14, a = am(null, a, e, l, t);
                break e;
              }
            }
            throw a = Ud(e) || e, Error(k(306, a, ""));
          }
        }
        return a;
      case 0:
        return dc(e, a, a.type, a.pendingProps, t);
      case 1:
        return l = a.type, o = co(l, a.pendingProps), rm(e, a, l, o, t);
      case 3:
        e: {
          if (Cs(a, a.stateNode.containerInfo), e === null) throw Error(k(387));
          l = a.pendingProps;
          var r = a.memoizedState;
          o = r.element, ac(e, a), mn(a, l, null, t);
          var n = a.memoizedState;
          if (l = n.cache, cl(a, Je, l), l !== r.cache && $d(a, [Je], t, !0), pn(), l = n.element, r.isDehydrated) {
            if (r = {
              element: l,
              isDehydrated: !1,
              cache: n.cache
            }, a.updateQueue.baseState = r, a.memoizedState = r, a.flags & 256) {
              a = nm(e, a, l, t);
              break e;
            } else if (l !== o) {
              o = et(Error(k(424)), a), In(o), a = nm(e, a, l, t);
              break e;
            } else for (e = a.stateNode.containerInfo, e.nodeType === 9 ? e = e.body : e = e.nodeName === "HTML" ? e.ownerDocument.body : e, Re = lt(e.firstChild), fa = a, de = !0, Ll = null, at = !0, t = Bg(a, null, l, t), a.child = t; t;) t.flags = t.flags & -3 | 4096, t = t.sibling;
          } else {
            if (no(), l === o) {
              a = Xt(e, a, t);
              break e;
            }
            da(e, a, l, t);
          }
          a = a.child;
        }
        return a;
      case 26:
        return hs(e, a), e === null ? (t = Nm(a.type, null, a.pendingProps, null)) ? a.memoizedState = t : de || (t = a.type, e = a.pendingProps, l = Xs(yl.current).createElement(t), l[ca] = a, l[Da] = e, ma(l, t, e), ua(l), a.stateNode = l) : a.memoizedState = Nm(a.type, e.memoizedProps, a.pendingProps, e.memoizedState), null;
      case 27:
        return Fd(a), e === null && de && (l = a.stateNode = mx(a.type, a.pendingProps, yl.current), fa = a, at = !0, o = Re, Ol(a.type) ? (kc = o, Re = lt(l.firstChild)) : Re = o), da(e, a, a.pendingProps.children, t), hs(e, a), e === null && (a.flags |= 4194304), a.child;
      case 5:
        return e === null && de && ((o = l = Re) && (l = vy(l, a.type, a.pendingProps, at), l !== null ? (a.stateNode = l, fa = a, Re = lt(l.firstChild), at = !1, o = !0) : o = !1), o || Tl(a)), Fd(a), o = a.type, r = a.pendingProps, n = e !== null ? e.memoizedProps : null, l = r.children, Lc(o, r) ? l = null : n !== null && Lc(o, n) && (a.flags |= 32), a.memoizedState !== null && (o = Wc(e, a, z0, null, null, t), Rn._currentValue = o), hs(e, a), da(e, a, l, t), a.child;
      case 6:
        return e === null && de && ((e = t = Re) && (t = yy(t, a.pendingProps, at), t !== null ? (a.stateNode = t, fa = a, Re = null, e = !0) : e = !1), e || Tl(a)), null;
      case 13:
        return wh(e, a, t);
      case 4:
        return Cs(a, a.stateNode.containerInfo), l = a.pendingProps, e === null ? a.child = so(a, null, l, t) : da(e, a, l, t), a.child;
      case 11:
        return em(e, a, a.type, a.pendingProps, t);
      case 7:
        return da(e, a, a.pendingProps, t), a.child;
      case 8:
        return da(e, a, a.pendingProps.children, t), a.child;
      case 12:
        return da(e, a, a.pendingProps.children, t), a.child;
      case 10:
        return l = a.pendingProps, cl(a, a.type, l.value), da(e, a, l.children, t), a.child;
      case 9:
        return o = a.type._context, l = a.pendingProps.children, uo(a), o = pa(o), l = l(o), a.flags |= 1, da(e, a, l, t), a.child;
      case 14:
        return am(e, a, a.type, a.pendingProps, t);
      case 15:
        return yh(e, a, a.type, a.pendingProps, t);
      case 19:
        return Ch(e, a, t);
      case 31:
        return V0(e, a, t);
      case 22:
        return Lh(e, a, t, a.pendingProps);
      case 24:
        return uo(a), l = pa(Je), e === null ? (o = jc(), o === null && (o = Ae, r = Xc(), o.pooledCache = r, r.refCount++, r !== null && (o.pooledCacheLanes |= t), o = r), a.memoizedState = {
          parent: l,
          cache: o
        }, Yc(a), cl(a, Je, o)) : ((e.lanes & t) !== 0 && (ac(e, a), mn(a, null, null, t), pn()), o = e.memoizedState, r = a.memoizedState, o.parent !== l ? (o = {
          parent: l,
          cache: l
        }, a.memoizedState = o, a.lanes === 0 && (a.memoizedState = a.updateQueue.baseState = o), cl(a, Je, l)) : (l = r.cache, cl(a, Je, l), l !== o.cache && $d(a, [Je], t, !0))), da(e, a, a.pendingProps.children, t), a.child;
      case 29:
        throw a.pendingProps;
    }
    throw Error(k(156, a.tag));
  }
  function Tt(e) {
    e.flags |= 4;
  }
  function wd(e, a, t, l, o) {
    if ((a = (e.mode & 32) !== 0) && (a = !1), a) {
      if (e.flags |= 16777216, (o & 335544128) === o) if (e.stateNode.complete) e.flags |= 8192;else if (Yh()) e.flags |= 8192;else throw oo = Ds, Zc;
    } else e.flags &= -16777217;
  }
  function sm(e, a) {
    if (a.type !== "stylesheet" || (a.state.loading & 4) !== 0) e.flags &= -16777217;else if (e.flags |= 16777216, !xx(a)) if (Yh()) e.flags |= 8192;else throw oo = Ds, Zc;
  }
  function es(e, a) {
    a !== null && (e.flags |= 4), e.flags & 16384 && (a = e.tag !== 22 ? Km() : 536870912, e.lanes |= a, hr |= a);
  }
  function Jr(e, a) {
    if (!de) switch (e.tailMode) {
      case "hidden":
        a = e.tail;
        for (var t = null; a !== null;) a.alternate !== null && (t = a), a = a.sibling;
        t === null ? e.tail = null : t.sibling = null;
        break;
      case "collapsed":
        t = e.tail;
        for (var l = null; t !== null;) t.alternate !== null && (l = t), t = t.sibling;
        l === null ? a || e.tail === null ? e.tail = null : e.tail.sibling = null : l.sibling = null;
    }
  }
  function De(e) {
    var a = e.alternate !== null && e.alternate.child === e.child,
      t = 0,
      l = 0;
    if (a) for (var o = e.child; o !== null;) t |= o.lanes | o.childLanes, l |= o.subtreeFlags & 65011712, l |= o.flags & 65011712, o.return = e, o = o.sibling;else for (o = e.child; o !== null;) t |= o.lanes | o.childLanes, l |= o.subtreeFlags, l |= o.flags, o.return = e, o = o.sibling;
    return e.subtreeFlags |= l, e.childLanes = t, a;
  }
  function j0(e, a, t) {
    var l = a.pendingProps;
    switch (Vc(a), a.tag) {
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return De(a), null;
      case 1:
        return De(a), null;
      case 3:
        return t = a.stateNode, l = null, e !== null && (l = e.memoizedState.cache), a.memoizedState.cache !== l && (a.flags |= 2048), Pt(Je), dr(), t.pendingContext && (t.context = t.pendingContext, t.pendingContext = null), (e === null || e.child === null) && (Ho(a) ? Tt(a) : e === null || e.memoizedState.isDehydrated && (a.flags & 256) === 0 || (a.flags |= 1024, pd())), De(a), null;
      case 26:
        var o = a.type,
          r = a.memoizedState;
        return e === null ? (Tt(a), r !== null ? (De(a), sm(a, r)) : (De(a), wd(a, o, null, l, t))) : r ? r !== e.memoizedState ? (Tt(a), De(a), sm(a, r)) : (De(a), a.flags &= -16777217) : (e = e.memoizedProps, e !== l && Tt(a), De(a), wd(a, o, e, l, t)), null;
      case 27:
        if (Ss(a), t = yl.current, o = a.type, e !== null && a.stateNode != null) e.memoizedProps !== l && Tt(a);else {
          if (!l) {
            if (a.stateNode === null) throw Error(k(166));
            return De(a), null;
          }
          e = yt.current, Ho(a) ? Up(a, e) : (e = mx(o, l, t), a.stateNode = e, Tt(a));
        }
        return De(a), null;
      case 5:
        if (Ss(a), o = a.type, e !== null && a.stateNode != null) e.memoizedProps !== l && Tt(a);else {
          if (!l) {
            if (a.stateNode === null) throw Error(k(166));
            return De(a), null;
          }
          if (r = yt.current, Ho(a)) Up(a, r);else {
            var n = Xs(yl.current);
            switch (r) {
              case 1:
                r = n.createElementNS("http://www.w3.org/2000/svg", o);
                break;
              case 2:
                r = n.createElementNS("http://www.w3.org/1998/Math/MathML", o);
                break;
              default:
                switch (o) {
                  case "svg":
                    r = n.createElementNS("http://www.w3.org/2000/svg", o);
                    break;
                  case "math":
                    r = n.createElementNS("http://www.w3.org/1998/Math/MathML", o);
                    break;
                  case "script":
                    r = n.createElement("div"), r.innerHTML = "<script><\/script>", r = r.removeChild(r.firstChild);
                    break;
                  case "select":
                    r = typeof l.is == "string" ? n.createElement("select", {
                      is: l.is
                    }) : n.createElement("select"), l.multiple ? r.multiple = !0 : l.size && (r.size = l.size);
                    break;
                  default:
                    r = typeof l.is == "string" ? n.createElement(o, {
                      is: l.is
                    }) : n.createElement(o);
                }
            }
            r[ca] = a, r[Da] = l;
            e: for (n = a.child; n !== null;) {
              if (n.tag === 5 || n.tag === 6) r.appendChild(n.stateNode);else if (n.tag !== 4 && n.tag !== 27 && n.child !== null) {
                n.child.return = n, n = n.child;
                continue;
              }
              if (n === a) break e;
              for (; n.sibling === null;) {
                if (n.return === null || n.return === a) break e;
                n = n.return;
              }
              n.sibling.return = n.return, n = n.sibling;
            }
            a.stateNode = r;
            e: switch (ma(r, o, l), o) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                l = !!l.autoFocus;
                break e;
              case "img":
                l = !0;
                break e;
              default:
                l = !1;
            }
            l && Tt(a);
          }
        }
        return De(a), wd(a, a.type, e === null ? null : e.memoizedProps, a.pendingProps, t), null;
      case 6:
        if (e && a.stateNode != null) e.memoizedProps !== l && Tt(a);else {
          if (typeof l != "string" && a.stateNode === null) throw Error(k(166));
          if (e = yl.current, Ho(a)) {
            if (e = a.stateNode, t = a.memoizedProps, l = null, o = fa, o !== null) switch (o.tag) {
              case 27:
              case 5:
                l = o.memoizedProps;
            }
            e[ca] = a, e = !!(e.nodeValue === t || l !== null && l.suppressHydrationWarning === !0 || dx(e.nodeValue, t)), e || Tl(a, !0);
          } else e = Xs(e).createTextNode(l), e[ca] = a, a.stateNode = e;
        }
        return De(a), null;
      case 31:
        if (t = a.memoizedState, e === null || e.memoizedState !== null) {
          if (l = Ho(a), t !== null) {
            if (e === null) {
              if (!l) throw Error(k(318));
              if (e = a.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(k(557));
              e[ca] = a;
            } else no(), (a.flags & 128) === 0 && (a.memoizedState = null), a.flags |= 4;
            De(a), e = !1;
          } else t = pd(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = t), e = !0;
          if (!e) return a.flags & 256 ? (Ua(a), a) : (Ua(a), null);
          if ((a.flags & 128) !== 0) throw Error(k(558));
        }
        return De(a), null;
      case 13:
        if (l = a.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
          if (o = Ho(a), l !== null && l.dehydrated !== null) {
            if (e === null) {
              if (!o) throw Error(k(318));
              if (o = a.memoizedState, o = o !== null ? o.dehydrated : null, !o) throw Error(k(317));
              o[ca] = a;
            } else no(), (a.flags & 128) === 0 && (a.memoizedState = null), a.flags |= 4;
            De(a), o = !1;
          } else o = pd(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = o), o = !0;
          if (!o) return a.flags & 256 ? (Ua(a), a) : (Ua(a), null);
        }
        return Ua(a), (a.flags & 128) !== 0 ? (a.lanes = t, a) : (t = l !== null, e = e !== null && e.memoizedState !== null, t && (l = a.child, o = null, l.alternate !== null && l.alternate.memoizedState !== null && l.alternate.memoizedState.cachePool !== null && (o = l.alternate.memoizedState.cachePool.pool), r = null, l.memoizedState !== null && l.memoizedState.cachePool !== null && (r = l.memoizedState.cachePool.pool), r !== o && (l.flags |= 2048)), t !== e && t && (a.child.flags |= 8192), es(a, a.updateQueue), De(a), null);
      case 4:
        return dr(), e === null && bf(a.stateNode.containerInfo), De(a), null;
      case 10:
        return Pt(a.type), De(a), null;
      case 19:
        if (sa(je), l = a.memoizedState, l === null) return De(a), null;
        if (o = (a.flags & 128) !== 0, r = l.rendering, r === null) {
          if (o) Jr(l, !1);else {
            if (Ge !== 0 || e !== null && (e.flags & 128) !== 0) for (e = a.child; e !== null;) {
              if (r = Bs(e), r !== null) {
                for (a.flags |= 128, Jr(l, !1), e = r.updateQueue, a.updateQueue = e, es(a, e), a.subtreeFlags = 0, e = t, t = a.child; t !== null;) kg(t, e), t = t.sibling;
                return Me(je, je.current & 1 | 2), de && Ot(a, l.treeForkCount), a.child;
              }
              e = e.sibling;
            }
            l.tail !== null && Pa() > Fs && (a.flags |= 128, o = !0, Jr(l, !1), a.lanes = 4194304);
          }
        } else {
          if (!o) if (e = Bs(r), e !== null) {
            if (a.flags |= 128, o = !0, e = e.updateQueue, a.updateQueue = e, es(a, e), Jr(l, !0), l.tail === null && l.tailMode === "hidden" && !r.alternate && !de) return De(a), null;
          } else 2 * Pa() - l.renderingStartTime > Fs && t !== 536870912 && (a.flags |= 128, o = !0, Jr(l, !1), a.lanes = 4194304);
          l.isBackwards ? (r.sibling = a.child, a.child = r) : (e = l.last, e !== null ? e.sibling = r : a.child = r, l.last = r);
        }
        return l.tail !== null ? (e = l.tail, l.rendering = e, l.tail = e.sibling, l.renderingStartTime = Pa(), e.sibling = null, t = je.current, Me(je, o ? t & 1 | 2 : t & 1), de && Ot(a, l.treeForkCount), e) : (De(a), null);
      case 22:
      case 23:
        return Ua(a), Kc(), l = a.memoizedState !== null, e !== null ? e.memoizedState !== null !== l && (a.flags |= 8192) : l && (a.flags |= 8192), l ? (t & 536870912) !== 0 && (a.flags & 128) === 0 && (De(a), a.subtreeFlags & 6 && (a.flags |= 8192)) : De(a), t = a.updateQueue, t !== null && es(a, t.retryQueue), t = null, e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (t = e.memoizedState.cachePool.pool), l = null, a.memoizedState !== null && a.memoizedState.cachePool !== null && (l = a.memoizedState.cachePool.pool), l !== t && (a.flags |= 2048), e !== null && sa(lo), null;
      case 24:
        return t = null, e !== null && (t = e.memoizedState.cache), a.memoizedState.cache !== t && (a.flags |= 2048), Pt(Je), De(a), null;
      case 25:
        return null;
      case 30:
        return null;
    }
    throw Error(k(156, a.tag));
  }
  function Z0(e, a) {
    switch (Vc(a), a.tag) {
      case 1:
        return e = a.flags, e & 65536 ? (a.flags = e & -65537 | 128, a) : null;
      case 3:
        return Pt(Je), dr(), e = a.flags, (e & 65536) !== 0 && (e & 128) === 0 ? (a.flags = e & -65537 | 128, a) : null;
      case 26:
      case 27:
      case 5:
        return Ss(a), null;
      case 31:
        if (a.memoizedState !== null) {
          if (Ua(a), a.alternate === null) throw Error(k(340));
          no();
        }
        return e = a.flags, e & 65536 ? (a.flags = e & -65537 | 128, a) : null;
      case 13:
        if (Ua(a), e = a.memoizedState, e !== null && e.dehydrated !== null) {
          if (a.alternate === null) throw Error(k(340));
          no();
        }
        return e = a.flags, e & 65536 ? (a.flags = e & -65537 | 128, a) : null;
      case 19:
        return sa(je), null;
      case 4:
        return dr(), null;
      case 10:
        return Pt(a.type), null;
      case 22:
      case 23:
        return Ua(a), Kc(), e !== null && sa(lo), e = a.flags, e & 65536 ? (a.flags = e & -65537 | 128, a) : null;
      case 24:
        return Pt(Je), null;
      case 25:
        return null;
      default:
        return null;
    }
  }
  function kh(e, a) {
    switch (Vc(a), a.tag) {
      case 3:
        Pt(Je), dr();
        break;
      case 26:
      case 27:
      case 5:
        Ss(a);
        break;
      case 4:
        dr();
        break;
      case 31:
        a.memoizedState !== null && Ua(a);
        break;
      case 13:
        Ua(a);
        break;
      case 19:
        sa(je);
        break;
      case 10:
        Pt(a.type);
        break;
      case 22:
      case 23:
        Ua(a), Kc(), e !== null && sa(lo);
        break;
      case 24:
        Pt(Je);
    }
  }
  function Gn(e, a) {
    try {
      var t = a.updateQueue,
        l = t !== null ? t.lastEffect : null;
      if (l !== null) {
        var o = l.next;
        t = o;
        do {
          if ((t.tag & e) === e) {
            l = void 0;
            var r = t.create,
              n = t.inst;
            l = r(), n.destroy = l;
          }
          t = t.next;
        } while (t !== o);
      }
    } catch (u) {
      ye(a, a.return, u);
    }
  }
  function Dl(e, a, t) {
    try {
      var l = a.updateQueue,
        o = l !== null ? l.lastEffect : null;
      if (o !== null) {
        var r = o.next;
        l = r;
        do {
          if ((l.tag & e) === e) {
            var n = l.inst,
              u = n.destroy;
            if (u !== void 0) {
              n.destroy = void 0, o = a;
              var s = t,
                i = u;
              try {
                i();
              } catch (d) {
                ye(o, s, d);
              }
            }
          }
          l = l.next;
        } while (l !== r);
      }
    } catch (d) {
      ye(a, a.return, d);
    }
  }
  function Ih(e) {
    var a = e.updateQueue;
    if (a !== null) {
      var t = e.stateNode;
      try {
        Eg(a, t);
      } catch (l) {
        ye(e, e.return, l);
      }
    }
  }
  function Ah(e, a, t) {
    t.props = co(e.type, e.memoizedProps), t.state = e.memoizedState;
    try {
      t.componentWillUnmount();
    } catch (l) {
      ye(e, a, l);
    }
  }
  function hn(e, a) {
    try {
      var t = e.ref;
      if (t !== null) {
        switch (e.tag) {
          case 26:
          case 27:
          case 5:
            var l = e.stateNode;
            break;
          case 30:
            l = e.stateNode;
            break;
          default:
            l = e.stateNode;
        }
        typeof t == "function" ? e.refCleanup = t(l) : t.current = l;
      }
    } catch (o) {
      ye(e, a, o);
    }
  }
  function vt(e, a) {
    var t = e.ref,
      l = e.refCleanup;
    if (t !== null) if (typeof l == "function") try {
      l();
    } catch (o) {
      ye(e, a, o);
    } finally {
      e.refCleanup = null, e = e.alternate, e != null && (e.refCleanup = null);
    } else if (typeof t == "function") try {
      t(null);
    } catch (o) {
      ye(e, a, o);
    } else t.current = null;
  }
  function Mh(e) {
    var a = e.type,
      t = e.memoizedProps,
      l = e.stateNode;
    try {
      e: switch (a) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          t.autoFocus && l.focus();
          break e;
        case "img":
          t.src ? l.src = t.src : t.srcSet && (l.srcset = t.srcSet);
      }
    } catch (o) {
      ye(e, e.return, o);
    }
  }
  function Cd(e, a, t) {
    try {
      var l = e.stateNode;
      py(l, e.type, t, a), l[Da] = a;
    } catch (o) {
      ye(e, e.return, o);
    }
  }
  function Nh(e) {
    return e.tag === 5 || e.tag === 3 || e.tag === 26 || e.tag === 27 && Ol(e.type) || e.tag === 4;
  }
  function Sd(e) {
    e: for (;;) {
      for (; e.sibling === null;) {
        if (e.return === null || Nh(e.return)) return null;
        e = e.return;
      }
      for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18;) {
        if (e.tag === 27 && Ol(e.type) || e.flags & 2 || e.child === null || e.tag === 4) continue e;
        e.child.return = e, e = e.child;
      }
      if (!(e.flags & 2)) return e.stateNode;
    }
  }
  function fc(e, a, t) {
    var l = e.tag;
    if (l === 5 || l === 6) e = e.stateNode, a ? (t.nodeType === 9 ? t.body : t.nodeName === "HTML" ? t.ownerDocument.body : t).insertBefore(e, a) : (a = t.nodeType === 9 ? t.body : t.nodeName === "HTML" ? t.ownerDocument.body : t, a.appendChild(e), t = t._reactRootContainer, t != null || a.onclick !== null || (a.onclick = Ut));else if (l !== 4 && (l === 27 && Ol(e.type) && (t = e.stateNode, a = null), e = e.child, e !== null)) for (fc(e, a, t), e = e.sibling; e !== null;) fc(e, a, t), e = e.sibling;
  }
  function qs(e, a, t) {
    var l = e.tag;
    if (l === 5 || l === 6) e = e.stateNode, a ? t.insertBefore(e, a) : t.appendChild(e);else if (l !== 4 && (l === 27 && Ol(e.type) && (t = e.stateNode), e = e.child, e !== null)) for (qs(e, a, t), e = e.sibling; e !== null;) qs(e, a, t), e = e.sibling;
  }
  function Th(e) {
    var a = e.stateNode,
      t = e.memoizedProps;
    try {
      for (var l = e.type, o = a.attributes; o.length;) a.removeAttributeNode(o[0]);
      ma(a, l, t), a[ca] = e, a[Da] = t;
    } catch (r) {
      ye(e, e.return, r);
    }
  }
  var Et = !1,
    We = !1,
    kd = !1,
    im = typeof WeakSet == "function" ? WeakSet : Set,
    na = null;
  function Y0(e, a) {
    if (e = e.containerInfo, vc = Ks, e = xg(e), Fc(e)) {
      if ("selectionStart" in e) var t = {
        start: e.selectionStart,
        end: e.selectionEnd
      };else e: {
        t = (t = e.ownerDocument) && t.defaultView || window;
        var l = t.getSelection && t.getSelection();
        if (l && l.rangeCount !== 0) {
          t = l.anchorNode;
          var o = l.anchorOffset,
            r = l.focusNode;
          l = l.focusOffset;
          try {
            t.nodeType, r.nodeType;
          } catch {
            t = null;
            break e;
          }
          var n = 0,
            u = -1,
            s = -1,
            i = 0,
            d = 0,
            x = e,
            m = null;
          a: for (;;) {
            for (var g; x !== t || o !== 0 && x.nodeType !== 3 || (u = n + o), x !== r || l !== 0 && x.nodeType !== 3 || (s = n + l), x.nodeType === 3 && (n += x.nodeValue.length), (g = x.firstChild) !== null;) m = x, x = g;
            for (;;) {
              if (x === e) break a;
              if (m === t && ++i === o && (u = n), m === r && ++d === l && (s = n), (g = x.nextSibling) !== null) break;
              x = m, m = x.parentNode;
            }
            x = g;
          }
          t = u === -1 || s === -1 ? null : {
            start: u,
            end: s
          };
        } else t = null;
      }
      t = t || {
        start: 0,
        end: 0
      };
    } else t = null;
    for (yc = {
      focusedElem: e,
      selectionRange: t
    }, Ks = !1, na = a; na !== null;) if (a = na, e = a.child, (a.subtreeFlags & 1028) !== 0 && e !== null) e.return = a, na = e;else for (; na !== null;) {
      switch (a = na, r = a.alternate, e = a.flags, a.tag) {
        case 0:
          if ((e & 4) !== 0 && (e = a.updateQueue, e = e !== null ? e.events : null, e !== null)) for (t = 0; t < e.length; t++) o = e[t], o.ref.impl = o.nextImpl;
          break;
        case 11:
        case 15:
          break;
        case 1:
          if ((e & 1024) !== 0 && r !== null) {
            e = void 0, t = a, o = r.memoizedProps, r = r.memoizedState, l = t.stateNode;
            try {
              var C = co(t.type, o);
              e = l.getSnapshotBeforeUpdate(C, r), l.__reactInternalSnapshotBeforeUpdate = e;
            } catch (y) {
              ye(t, t.return, y);
            }
          }
          break;
        case 3:
          if ((e & 1024) !== 0) {
            if (e = a.stateNode.containerInfo, t = e.nodeType, t === 9) wc(e);else if (t === 1) switch (e.nodeName) {
              case "HEAD":
              case "HTML":
              case "BODY":
                wc(e);
                break;
              default:
                e.textContent = "";
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
          if ((e & 1024) !== 0) throw Error(k(163));
      }
      if (e = a.sibling, e !== null) {
        e.return = a.return, na = e;
        break;
      }
      na = a.return;
    }
  }
  function Dh(e, a, t) {
    var l = t.flags;
    switch (t.tag) {
      case 0:
      case 11:
      case 15:
        Rt(e, t), l & 4 && Gn(5, t);
        break;
      case 1:
        if (Rt(e, t), l & 4) if (e = t.stateNode, a === null) try {
          e.componentDidMount();
        } catch (n) {
          ye(t, t.return, n);
        } else {
          var o = co(t.type, a.memoizedProps);
          a = a.memoizedState;
          try {
            e.componentDidUpdate(o, a, e.__reactInternalSnapshotBeforeUpdate);
          } catch (n) {
            ye(t, t.return, n);
          }
        }
        l & 64 && Ih(t), l & 512 && hn(t, t.return);
        break;
      case 3:
        if (Rt(e, t), l & 64 && (e = t.updateQueue, e !== null)) {
          if (a = null, t.child !== null) switch (t.child.tag) {
            case 27:
            case 5:
              a = t.child.stateNode;
              break;
            case 1:
              a = t.child.stateNode;
          }
          try {
            Eg(e, a);
          } catch (n) {
            ye(t, t.return, n);
          }
        }
        break;
      case 27:
        a === null && l & 4 && Th(t);
      case 26:
      case 5:
        Rt(e, t), a === null && l & 4 && Mh(t), l & 512 && hn(t, t.return);
        break;
      case 12:
        Rt(e, t);
        break;
      case 31:
        Rt(e, t), l & 4 && Oh(e, t);
        break;
      case 13:
        Rt(e, t), l & 4 && Eh(e, t), l & 64 && (e = t.memoizedState, e !== null && (e = e.dehydrated, e !== null && (t = ly.bind(null, t), Ly(e, t))));
        break;
      case 22:
        if (l = t.memoizedState !== null || Et, !l) {
          a = a !== null && a.memoizedState !== null || We, o = Et;
          var r = We;
          Et = l, (We = a) && !r ? Bt(e, t, (t.subtreeFlags & 8772) !== 0) : Rt(e, t), Et = o, We = r;
        }
        break;
      case 30:
        break;
      default:
        Rt(e, t);
    }
  }
  function Rh(e) {
    var a = e.alternate;
    a !== null && (e.alternate = null, Rh(a)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (a = e.stateNode, a !== null && Bc(a)), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
  }
  var ze = null,
    Ma = !1;
  function Dt(e, a, t) {
    for (t = t.child; t !== null;) Bh(e, a, t), t = t.sibling;
  }
  function Bh(e, a, t) {
    if (Ha && typeof Ha.onCommitFiberUnmount == "function") try {
      Ha.onCommitFiberUnmount(zn, t);
    } catch {}
    switch (t.tag) {
      case 26:
        We || vt(t, a), Dt(e, a, t), t.memoizedState ? t.memoizedState.count-- : t.stateNode && (t = t.stateNode, t.parentNode.removeChild(t));
        break;
      case 27:
        We || vt(t, a);
        var l = ze,
          o = Ma;
        Ol(t.type) && (ze = t.stateNode, Ma = !1), Dt(e, a, t), yn(t.stateNode), ze = l, Ma = o;
        break;
      case 5:
        We || vt(t, a);
      case 6:
        if (l = ze, o = Ma, ze = null, Dt(e, a, t), ze = l, Ma = o, ze !== null) if (Ma) try {
          (ze.nodeType === 9 ? ze.body : ze.nodeName === "HTML" ? ze.ownerDocument.body : ze).removeChild(t.stateNode);
        } catch (r) {
          ye(t, a, r);
        } else try {
          ze.removeChild(t.stateNode);
        } catch (r) {
          ye(t, a, r);
        }
        break;
      case 18:
        ze !== null && (Ma ? (e = ze, Sm(e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e, t.stateNode), yr(e)) : Sm(ze, t.stateNode));
        break;
      case 4:
        l = ze, o = Ma, ze = t.stateNode.containerInfo, Ma = !0, Dt(e, a, t), ze = l, Ma = o;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        Dl(2, t, a), We || Dl(4, t, a), Dt(e, a, t);
        break;
      case 1:
        We || (vt(t, a), l = t.stateNode, typeof l.componentWillUnmount == "function" && Ah(t, a, l)), Dt(e, a, t);
        break;
      case 21:
        Dt(e, a, t);
        break;
      case 22:
        We = (l = We) || t.memoizedState !== null, Dt(e, a, t), We = l;
        break;
      default:
        Dt(e, a, t);
    }
  }
  function Oh(e, a) {
    if (a.memoizedState === null && (e = a.alternate, e !== null && (e = e.memoizedState, e !== null))) {
      e = e.dehydrated;
      try {
        yr(e);
      } catch (t) {
        ye(a, a.return, t);
      }
    }
  }
  function Eh(e, a) {
    if (a.memoizedState === null && (e = a.alternate, e !== null && (e = e.memoizedState, e !== null && (e = e.dehydrated, e !== null)))) try {
      yr(e);
    } catch (t) {
      ye(a, a.return, t);
    }
  }
  function K0(e) {
    switch (e.tag) {
      case 31:
      case 13:
      case 19:
        var a = e.stateNode;
        return a === null && (a = e.stateNode = new im()), a;
      case 22:
        return e = e.stateNode, a = e._retryCache, a === null && (a = e._retryCache = new im()), a;
      default:
        throw Error(k(435, e.tag));
    }
  }
  function as(e, a) {
    var t = K0(e);
    a.forEach(function (l) {
      if (!t.has(l)) {
        t.add(l);
        var o = oy.bind(null, e, l);
        l.then(o, o);
      }
    });
  }
  function Ia(e, a) {
    var t = a.deletions;
    if (t !== null) for (var l = 0; l < t.length; l++) {
      var o = t[l],
        r = e,
        n = a,
        u = n;
      e: for (; u !== null;) {
        switch (u.tag) {
          case 27:
            if (Ol(u.type)) {
              ze = u.stateNode, Ma = !1;
              break e;
            }
            break;
          case 5:
            ze = u.stateNode, Ma = !1;
            break e;
          case 3:
          case 4:
            ze = u.stateNode.containerInfo, Ma = !0;
            break e;
        }
        u = u.return;
      }
      if (ze === null) throw Error(k(160));
      Bh(r, n, o), ze = null, Ma = !1, r = o.alternate, r !== null && (r.return = null), o.return = null;
    }
    if (a.subtreeFlags & 13886) for (a = a.child; a !== null;) zh(a, e), a = a.sibling;
  }
  var st = null;
  function zh(e, a) {
    var t = e.alternate,
      l = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        Ia(a, e), Aa(e), l & 4 && (Dl(3, e, e.return), Gn(3, e), Dl(5, e, e.return));
        break;
      case 1:
        Ia(a, e), Aa(e), l & 512 && (We || t === null || vt(t, t.return)), l & 64 && Et && (e = e.updateQueue, e !== null && (l = e.callbacks, l !== null && (t = e.shared.hiddenCallbacks, e.shared.hiddenCallbacks = t === null ? l : t.concat(l))));
        break;
      case 26:
        var o = st;
        if (Ia(a, e), Aa(e), l & 512 && (We || t === null || vt(t, t.return)), l & 4) {
          var r = t !== null ? t.memoizedState : null;
          if (l = e.memoizedState, t === null) {
            if (l === null) {
              if (e.stateNode === null) {
                e: {
                  l = e.type, t = e.memoizedProps, o = o.ownerDocument || o;
                  a: switch (l) {
                    case "title":
                      r = o.getElementsByTagName("title")[0], (!r || r[Fn] || r[ca] || r.namespaceURI === "http://www.w3.org/2000/svg" || r.hasAttribute("itemprop")) && (r = o.createElement(l), o.head.insertBefore(r, o.querySelector("head > title"))), ma(r, l, t), r[ca] = e, ua(r), l = r;
                      break e;
                    case "link":
                      var n = Dm("link", "href", o).get(l + (t.href || ""));
                      if (n) {
                        for (var u = 0; u < n.length; u++) if (r = n[u], r.getAttribute("href") === (t.href == null || t.href === "" ? null : t.href) && r.getAttribute("rel") === (t.rel == null ? null : t.rel) && r.getAttribute("title") === (t.title == null ? null : t.title) && r.getAttribute("crossorigin") === (t.crossOrigin == null ? null : t.crossOrigin)) {
                          n.splice(u, 1);
                          break a;
                        }
                      }
                      r = o.createElement(l), ma(r, l, t), o.head.appendChild(r);
                      break;
                    case "meta":
                      if (n = Dm("meta", "content", o).get(l + (t.content || ""))) {
                        for (u = 0; u < n.length; u++) if (r = n[u], r.getAttribute("content") === (t.content == null ? null : "" + t.content) && r.getAttribute("name") === (t.name == null ? null : t.name) && r.getAttribute("property") === (t.property == null ? null : t.property) && r.getAttribute("http-equiv") === (t.httpEquiv == null ? null : t.httpEquiv) && r.getAttribute("charset") === (t.charSet == null ? null : t.charSet)) {
                          n.splice(u, 1);
                          break a;
                        }
                      }
                      r = o.createElement(l), ma(r, l, t), o.head.appendChild(r);
                      break;
                    default:
                      throw Error(k(468, l));
                  }
                  r[ca] = e, ua(r), l = r;
                }
                e.stateNode = l;
              } else Rm(o, e.type, e.stateNode);
            } else e.stateNode = Tm(o, l, e.memoizedProps);
          } else r !== l ? (r === null ? t.stateNode !== null && (t = t.stateNode, t.parentNode.removeChild(t)) : r.count--, l === null ? Rm(o, e.type, e.stateNode) : Tm(o, l, e.memoizedProps)) : l === null && e.stateNode !== null && Cd(e, e.memoizedProps, t.memoizedProps);
        }
        break;
      case 27:
        Ia(a, e), Aa(e), l & 512 && (We || t === null || vt(t, t.return)), t !== null && l & 4 && Cd(e, e.memoizedProps, t.memoizedProps);
        break;
      case 5:
        if (Ia(a, e), Aa(e), l & 512 && (We || t === null || vt(t, t.return)), e.flags & 32) {
          o = e.stateNode;
          try {
            fr(o, "");
          } catch (C) {
            ye(e, e.return, C);
          }
        }
        l & 4 && e.stateNode != null && (o = e.memoizedProps, Cd(e, o, t !== null ? t.memoizedProps : o)), l & 1024 && (kd = !0);
        break;
      case 6:
        if (Ia(a, e), Aa(e), l & 4) {
          if (e.stateNode === null) throw Error(k(162));
          l = e.memoizedProps, t = e.stateNode;
          try {
            t.nodeValue = l;
          } catch (C) {
            ye(e, e.return, C);
          }
        }
        break;
      case 3:
        if (vs = null, o = st, st = js(a.containerInfo), Ia(a, e), st = o, Aa(e), l & 4 && t !== null && t.memoizedState.isDehydrated) try {
          yr(a.containerInfo);
        } catch (C) {
          ye(e, e.return, C);
        }
        kd && (kd = !1, Uh(e));
        break;
      case 4:
        l = st, st = js(e.stateNode.containerInfo), Ia(a, e), Aa(e), st = l;
        break;
      case 12:
        Ia(a, e), Aa(e);
        break;
      case 31:
        Ia(a, e), Aa(e), l & 4 && (l = e.updateQueue, l !== null && (e.updateQueue = null, as(e, l)));
        break;
      case 13:
        Ia(a, e), Aa(e), e.child.flags & 8192 && e.memoizedState !== null != (t !== null && t.memoizedState !== null) && (si = Pa()), l & 4 && (l = e.updateQueue, l !== null && (e.updateQueue = null, as(e, l)));
        break;
      case 22:
        o = e.memoizedState !== null;
        var s = t !== null && t.memoizedState !== null,
          i = Et,
          d = We;
        if (Et = i || o, We = d || s, Ia(a, e), We = d, Et = i, Aa(e), l & 8192) e: for (a = e.stateNode, a._visibility = o ? a._visibility & -2 : a._visibility | 1, o && (t === null || s || Et || We || eo(e)), t = null, a = e;;) {
          if (a.tag === 5 || a.tag === 26) {
            if (t === null) {
              s = t = a;
              try {
                if (r = s.stateNode, o) n = r.style, typeof n.setProperty == "function" ? n.setProperty("display", "none", "important") : n.display = "none";else {
                  u = s.stateNode;
                  var x = s.memoizedProps.style,
                    m = x != null && x.hasOwnProperty("display") ? x.display : null;
                  u.style.display = m == null || typeof m == "boolean" ? "" : ("" + m).trim();
                }
              } catch (C) {
                ye(s, s.return, C);
              }
            }
          } else if (a.tag === 6) {
            if (t === null) {
              s = a;
              try {
                s.stateNode.nodeValue = o ? "" : s.memoizedProps;
              } catch (C) {
                ye(s, s.return, C);
              }
            }
          } else if (a.tag === 18) {
            if (t === null) {
              s = a;
              try {
                var g = s.stateNode;
                o ? km(g, !0) : km(s.stateNode, !1);
              } catch (C) {
                ye(s, s.return, C);
              }
            }
          } else if ((a.tag !== 22 && a.tag !== 23 || a.memoizedState === null || a === e) && a.child !== null) {
            a.child.return = a, a = a.child;
            continue;
          }
          if (a === e) break e;
          for (; a.sibling === null;) {
            if (a.return === null || a.return === e) break e;
            t === a && (t = null), a = a.return;
          }
          t === a && (t = null), a.sibling.return = a.return, a = a.sibling;
        }
        l & 4 && (l = e.updateQueue, l !== null && (t = l.retryQueue, t !== null && (l.retryQueue = null, as(e, t))));
        break;
      case 19:
        Ia(a, e), Aa(e), l & 4 && (l = e.updateQueue, l !== null && (e.updateQueue = null, as(e, l)));
        break;
      case 30:
        break;
      case 21:
        break;
      default:
        Ia(a, e), Aa(e);
    }
  }
  function Aa(e) {
    var a = e.flags;
    if (a & 2) {
      try {
        for (var t, l = e.return; l !== null;) {
          if (Nh(l)) {
            t = l;
            break;
          }
          l = l.return;
        }
        if (t == null) throw Error(k(160));
        switch (t.tag) {
          case 27:
            var o = t.stateNode,
              r = Sd(e);
            qs(e, r, o);
            break;
          case 5:
            var n = t.stateNode;
            t.flags & 32 && (fr(n, ""), t.flags &= -33);
            var u = Sd(e);
            qs(e, u, n);
            break;
          case 3:
          case 4:
            var s = t.stateNode.containerInfo,
              i = Sd(e);
            fc(e, i, s);
            break;
          default:
            throw Error(k(161));
        }
      } catch (d) {
        ye(e, e.return, d);
      }
      e.flags &= -3;
    }
    a & 4096 && (e.flags &= -4097);
  }
  function Uh(e) {
    if (e.subtreeFlags & 1024) for (e = e.child; e !== null;) {
      var a = e;
      Uh(a), a.tag === 5 && a.flags & 1024 && a.stateNode.reset(), e = e.sibling;
    }
  }
  function Rt(e, a) {
    if (a.subtreeFlags & 8772) for (a = a.child; a !== null;) Dh(e, a.alternate, a), a = a.sibling;
  }
  function eo(e) {
    for (e = e.child; e !== null;) {
      var a = e;
      switch (a.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          Dl(4, a, a.return), eo(a);
          break;
        case 1:
          vt(a, a.return);
          var t = a.stateNode;
          typeof t.componentWillUnmount == "function" && Ah(a, a.return, t), eo(a);
          break;
        case 27:
          yn(a.stateNode);
        case 26:
        case 5:
          vt(a, a.return), eo(a);
          break;
        case 22:
          a.memoizedState === null && eo(a);
          break;
        case 30:
          eo(a);
          break;
        default:
          eo(a);
      }
      e = e.sibling;
    }
  }
  function Bt(e, a, t) {
    for (t = t && (a.subtreeFlags & 8772) !== 0, a = a.child; a !== null;) {
      var l = a.alternate,
        o = e,
        r = a,
        n = r.flags;
      switch (r.tag) {
        case 0:
        case 11:
        case 15:
          Bt(o, r, t), Gn(4, r);
          break;
        case 1:
          if (Bt(o, r, t), l = r, o = l.stateNode, typeof o.componentDidMount == "function") try {
            o.componentDidMount();
          } catch (i) {
            ye(l, l.return, i);
          }
          if (l = r, o = l.updateQueue, o !== null) {
            var u = l.stateNode;
            try {
              var s = o.shared.hiddenCallbacks;
              if (s !== null) for (o.shared.hiddenCallbacks = null, o = 0; o < s.length; o++) Og(s[o], u);
            } catch (i) {
              ye(l, l.return, i);
            }
          }
          t && n & 64 && Ih(r), hn(r, r.return);
          break;
        case 27:
          Th(r);
        case 26:
        case 5:
          Bt(o, r, t), t && l === null && n & 4 && Mh(r), hn(r, r.return);
          break;
        case 12:
          Bt(o, r, t);
          break;
        case 31:
          Bt(o, r, t), t && n & 4 && Oh(o, r);
          break;
        case 13:
          Bt(o, r, t), t && n & 4 && Eh(o, r);
          break;
        case 22:
          r.memoizedState === null && Bt(o, r, t), hn(r, r.return);
          break;
        case 30:
          break;
        default:
          Bt(o, r, t);
      }
      a = a.sibling;
    }
  }
  function ff(e, a) {
    var t = null;
    e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (t = e.memoizedState.cachePool.pool), e = null, a.memoizedState !== null && a.memoizedState.cachePool !== null && (e = a.memoizedState.cachePool.pool), e !== t && (e != null && e.refCount++, t != null && Hn(t));
  }
  function pf(e, a) {
    e = null, a.alternate !== null && (e = a.alternate.memoizedState.cache), a = a.memoizedState.cache, a !== e && (a.refCount++, e != null && Hn(e));
  }
  function ut(e, a, t, l) {
    if (a.subtreeFlags & 10256) for (a = a.child; a !== null;) qh(e, a, t, l), a = a.sibling;
  }
  function qh(e, a, t, l) {
    var o = a.flags;
    switch (a.tag) {
      case 0:
      case 11:
      case 15:
        ut(e, a, t, l), o & 2048 && Gn(9, a);
        break;
      case 1:
        ut(e, a, t, l);
        break;
      case 3:
        ut(e, a, t, l), o & 2048 && (e = null, a.alternate !== null && (e = a.alternate.memoizedState.cache), a = a.memoizedState.cache, a !== e && (a.refCount++, e != null && Hn(e)));
        break;
      case 12:
        if (o & 2048) {
          ut(e, a, t, l), e = a.stateNode;
          try {
            var r = a.memoizedProps,
              n = r.id,
              u = r.onPostCommit;
            typeof u == "function" && u(n, a.alternate === null ? "mount" : "update", e.passiveEffectDuration, -0);
          } catch (s) {
            ye(a, a.return, s);
          }
        } else ut(e, a, t, l);
        break;
      case 31:
        ut(e, a, t, l);
        break;
      case 13:
        ut(e, a, t, l);
        break;
      case 23:
        break;
      case 22:
        r = a.stateNode, n = a.alternate, a.memoizedState !== null ? r._visibility & 2 ? ut(e, a, t, l) : xn(e, a) : r._visibility & 2 ? ut(e, a, t, l) : (r._visibility |= 2, Go(e, a, t, l, (a.subtreeFlags & 10256) !== 0 || !1)), o & 2048 && ff(n, a);
        break;
      case 24:
        ut(e, a, t, l), o & 2048 && pf(a.alternate, a);
        break;
      default:
        ut(e, a, t, l);
    }
  }
  function Go(e, a, t, l, o) {
    for (o = o && ((a.subtreeFlags & 10256) !== 0 || !1), a = a.child; a !== null;) {
      var r = e,
        n = a,
        u = t,
        s = l,
        i = n.flags;
      switch (n.tag) {
        case 0:
        case 11:
        case 15:
          Go(r, n, u, s, o), Gn(8, n);
          break;
        case 23:
          break;
        case 22:
          var d = n.stateNode;
          n.memoizedState !== null ? d._visibility & 2 ? Go(r, n, u, s, o) : xn(r, n) : (d._visibility |= 2, Go(r, n, u, s, o)), o && i & 2048 && ff(n.alternate, n);
          break;
        case 24:
          Go(r, n, u, s, o), o && i & 2048 && pf(n.alternate, n);
          break;
        default:
          Go(r, n, u, s, o);
      }
      a = a.sibling;
    }
  }
  function xn(e, a) {
    if (a.subtreeFlags & 10256) for (a = a.child; a !== null;) {
      var t = e,
        l = a,
        o = l.flags;
      switch (l.tag) {
        case 22:
          xn(t, l), o & 2048 && ff(l.alternate, l);
          break;
        case 24:
          xn(t, l), o & 2048 && pf(l.alternate, l);
          break;
        default:
          xn(t, l);
      }
      a = a.sibling;
    }
  }
  var nn = 8192;
  function _o(e, a, t) {
    if (e.subtreeFlags & nn) for (e = e.child; e !== null;) Fh(e, a, t), e = e.sibling;
  }
  function Fh(e, a, t) {
    switch (e.tag) {
      case 26:
        _o(e, a, t), e.flags & nn && e.memoizedState !== null && By(t, st, e.memoizedState, e.memoizedProps);
        break;
      case 5:
        _o(e, a, t);
        break;
      case 3:
      case 4:
        var l = st;
        st = js(e.stateNode.containerInfo), _o(e, a, t), st = l;
        break;
      case 22:
        e.memoizedState === null && (l = e.alternate, l !== null && l.memoizedState !== null ? (l = nn, nn = 16777216, _o(e, a, t), nn = l) : _o(e, a, t));
        break;
      default:
        _o(e, a, t);
    }
  }
  function Ph(e) {
    var a = e.alternate;
    if (a !== null && (e = a.child, e !== null)) {
      a.child = null;
      do a = e.sibling, e.sibling = null, e = a; while (e !== null);
    }
  }
  function $r(e) {
    var a = e.deletions;
    if ((e.flags & 16) !== 0) {
      if (a !== null) for (var t = 0; t < a.length; t++) {
        var l = a[t];
        na = l, _h(l, e);
      }
      Ph(e);
    }
    if (e.subtreeFlags & 10256) for (e = e.child; e !== null;) Hh(e), e = e.sibling;
  }
  function Hh(e) {
    switch (e.tag) {
      case 0:
      case 11:
      case 15:
        $r(e), e.flags & 2048 && Dl(9, e, e.return);
        break;
      case 3:
        $r(e);
        break;
      case 12:
        $r(e);
        break;
      case 22:
        var a = e.stateNode;
        e.memoizedState !== null && a._visibility & 2 && (e.return === null || e.return.tag !== 13) ? (a._visibility &= -3, xs(e)) : $r(e);
        break;
      default:
        $r(e);
    }
  }
  function xs(e) {
    var a = e.deletions;
    if ((e.flags & 16) !== 0) {
      if (a !== null) for (var t = 0; t < a.length; t++) {
        var l = a[t];
        na = l, _h(l, e);
      }
      Ph(e);
    }
    for (e = e.child; e !== null;) {
      switch (a = e, a.tag) {
        case 0:
        case 11:
        case 15:
          Dl(8, a, a.return), xs(a);
          break;
        case 22:
          t = a.stateNode, t._visibility & 2 && (t._visibility &= -3, xs(a));
          break;
        default:
          xs(a);
      }
      e = e.sibling;
    }
  }
  function _h(e, a) {
    for (; na !== null;) {
      var t = na;
      switch (t.tag) {
        case 0:
        case 11:
        case 15:
          Dl(8, t, a);
          break;
        case 23:
        case 22:
          if (t.memoizedState !== null && t.memoizedState.cachePool !== null) {
            var l = t.memoizedState.cachePool.pool;
            l != null && l.refCount++;
          }
          break;
        case 24:
          Hn(t.memoizedState.cache);
      }
      if (l = t.child, l !== null) l.return = t, na = l;else e: for (t = e; na !== null;) {
        l = na;
        var o = l.sibling,
          r = l.return;
        if (Rh(l), l === t) {
          na = null;
          break e;
        }
        if (o !== null) {
          o.return = r, na = o;
          break e;
        }
        na = r;
      }
    }
  }
  var Q0 = {
      getCacheForType: function (e) {
        var a = pa(Je),
          t = a.data.get(e);
        return t === void 0 && (t = e(), a.data.set(e, t)), t;
      },
      cacheSignal: function () {
        return pa(Je).controller.signal;
      }
    },
    W0 = typeof WeakMap == "function" ? WeakMap : Map,
    me = 0,
    Ae = null,
    ne = null,
    se = 0,
    ve = 0,
    za = null,
    xl = !1,
    kr = !1,
    mf = !1,
    jt = 0,
    Ge = 0,
    Rl = 0,
    ro = 0,
    gf = 0,
    Fa = 0,
    hr = 0,
    bn = null,
    Na = null,
    pc = !1,
    si = 0,
    Gh = 0,
    Fs = 1 / 0,
    Ps = null,
    Sl = null,
    ta = 0,
    kl = null,
    xr = null,
    Ht = 0,
    mc = 0,
    gc = null,
    Vh = null,
    vn = 0,
    hc = null;
  function Ga() {
    return (me & 2) !== 0 && se !== 0 ? se & -se : Y.T !== null ? xf() : $m();
  }
  function Xh() {
    if (Fa === 0) if ((se & 536870912) === 0 || de) {
      var e = Xu;
      Xu <<= 1, (Xu & 3932160) === 0 && (Xu = 262144), Fa = e;
    } else Fa = 536870912;
    return e = Xa.current, e !== null && (e.flags |= 32), Fa;
  }
  function Ta(e, a, t) {
    (e === Ae && (ve === 2 || ve === 9) || e.cancelPendingCommit !== null) && (br(e, 0), bl(e, se, Fa, !1)), qn(e, t), ((me & 2) === 0 || e !== Ae) && (e === Ae && ((me & 2) === 0 && (ro |= t), Ge === 4 && bl(e, se, Fa, !1)), wt(e));
  }
  function jh(e, a, t) {
    if ((me & 6) !== 0) throw Error(k(327));
    var l = !t && (a & 127) === 0 && (a & e.expiredLanes) === 0 || Un(e, a),
      o = l ? ey(e, a) : Id(e, a, !0),
      r = l;
    do {
      if (o === 0) {
        kr && !l && bl(e, a, 0, !1);
        break;
      } else {
        if (t = e.current.alternate, r && !J0(t)) {
          o = Id(e, a, !1), r = !1;
          continue;
        }
        if (o === 2) {
          if (r = a, e.errorRecoveryDisabledLanes & r) var n = 0;else n = e.pendingLanes & -536870913, n = n !== 0 ? n : n & 536870912 ? 536870912 : 0;
          if (n !== 0) {
            a = n;
            e: {
              var u = e;
              o = bn;
              var s = u.current.memoizedState.isDehydrated;
              if (s && (br(u, n).flags |= 256), n = Id(u, n, !1), n !== 2) {
                if (mf && !s) {
                  u.errorRecoveryDisabledLanes |= r, ro |= r, o = 4;
                  break e;
                }
                r = Na, Na = o, r !== null && (Na === null ? Na = r : Na.push.apply(Na, r));
              }
              o = n;
            }
            if (r = !1, o !== 2) continue;
          }
        }
        if (o === 1) {
          br(e, 0), bl(e, a, 0, !0);
          break;
        }
        e: {
          switch (l = e, r = o, r) {
            case 0:
            case 1:
              throw Error(k(345));
            case 4:
              if ((a & 4194048) !== a) break;
            case 6:
              bl(l, a, Fa, !xl);
              break e;
            case 2:
              Na = null;
              break;
            case 3:
            case 5:
              break;
            default:
              throw Error(k(329));
          }
          if ((a & 62914560) === a && (o = si + 300 - Pa(), 10 < o)) {
            if (bl(l, a, Fa, !xl), Ws(l, 0, !0) !== 0) break e;
            Ht = a, l.timeoutHandle = fx(dm.bind(null, l, t, Na, Ps, pc, a, Fa, ro, hr, xl, r, "Throttled", -0, 0), o);
            break e;
          }
          dm(l, t, Na, Ps, pc, a, Fa, ro, hr, xl, r, null, -0, 0);
        }
      }
      break;
    } while (!0);
    wt(e);
  }
  function dm(e, a, t, l, o, r, n, u, s, i, d, x, m, g) {
    if (e.timeoutHandle = -1, x = a.subtreeFlags, x & 8192 || (x & 16785408) === 16785408) {
      x = {
        stylesheets: null,
        count: 0,
        imgCount: 0,
        imgBytes: 0,
        suspenseyImages: [],
        waitingForImages: !0,
        waitingForViewTransition: !1,
        unsuspend: Ut
      }, Fh(a, r, x);
      var C = (r & 62914560) === r ? si - Pa() : (r & 4194048) === r ? Gh - Pa() : 0;
      if (C = Oy(x, C), C !== null) {
        Ht = r, e.cancelPendingCommit = C(fm.bind(null, e, a, r, t, l, o, n, u, s, d, x, null, m, g)), bl(e, r, n, !i);
        return;
      }
    }
    fm(e, a, r, t, l, o, n, u, s);
  }
  function J0(e) {
    for (var a = e;;) {
      var t = a.tag;
      if ((t === 0 || t === 11 || t === 15) && a.flags & 16384 && (t = a.updateQueue, t !== null && (t = t.stores, t !== null))) for (var l = 0; l < t.length; l++) {
        var o = t[l],
          r = o.getSnapshot;
        o = o.value;
        try {
          if (!Va(r(), o)) return !1;
        } catch {
          return !1;
        }
      }
      if (t = a.child, a.subtreeFlags & 16384 && t !== null) t.return = a, a = t;else {
        if (a === e) break;
        for (; a.sibling === null;) {
          if (a.return === null || a.return === e) return !0;
          a = a.return;
        }
        a.sibling.return = a.return, a = a.sibling;
      }
    }
    return !0;
  }
  function bl(e, a, t, l) {
    a &= ~gf, a &= ~ro, e.suspendedLanes |= a, e.pingedLanes &= ~a, l && (e.warmLanes |= a), l = e.expirationTimes;
    for (var o = a; 0 < o;) {
      var r = 31 - _a(o),
        n = 1 << r;
      l[r] = -1, o &= ~n;
    }
    t !== 0 && Qm(e, t, a);
  }
  function ii() {
    return (me & 6) === 0 ? (Vn(0, !1), !1) : !0;
  }
  function hf() {
    if (ne !== null) {
      if (ve === 0) var e = ne.return;else e = ne, qt = ho = null, ef(e), ur = null, An = 0, e = ne;
      for (; e !== null;) kh(e.alternate, e), e = e.return;
      ne = null;
    }
  }
  function br(e, a) {
    var t = e.timeoutHandle;
    t !== -1 && (e.timeoutHandle = -1, hy(t)), t = e.cancelPendingCommit, t !== null && (e.cancelPendingCommit = null, t()), Ht = 0, hf(), Ae = e, ne = t = Ft(e.current, null), se = a, ve = 0, za = null, xl = !1, kr = Un(e, a), mf = !1, hr = Fa = gf = ro = Rl = Ge = 0, Na = bn = null, pc = !1, (a & 8) !== 0 && (a |= a & 32);
    var l = e.entangledLanes;
    if (l !== 0) for (e = e.entanglements, l &= a; 0 < l;) {
      var o = 31 - _a(l),
        r = 1 << o;
      a |= e[o], l &= ~r;
    }
    return jt = a, ai(), t;
  }
  function Zh(e, a) {
    W = null, Y.H = Nn, a === Sr || a === li ? (a = _p(), ve = 3) : a === Zc ? (a = _p(), ve = 4) : ve = a === df ? 8 : a !== null && typeof a == "object" && typeof a.then == "function" ? 6 : 1, za = a, ne === null && (Ge = 1, zs(e, et(a, e.current)));
  }
  function Yh() {
    var e = Xa.current;
    return e === null ? !0 : (se & 4194048) === se ? tt === null : (se & 62914560) === se || (se & 536870912) !== 0 ? e === tt : !1;
  }
  function Kh() {
    var e = Y.H;
    return Y.H = Nn, e === null ? Nn : e;
  }
  function Qh() {
    var e = Y.A;
    return Y.A = Q0, e;
  }
  function Hs() {
    Ge = 4, xl || (se & 4194048) !== se && Xa.current !== null || (kr = !0), (Rl & 134217727) === 0 && (ro & 134217727) === 0 || Ae === null || bl(Ae, se, Fa, !1);
  }
  function Id(e, a, t) {
    var l = me;
    me |= 2;
    var o = Kh(),
      r = Qh();
    (Ae !== e || se !== a) && (Ps = null, br(e, a)), a = !1;
    var n = Ge;
    e: do try {
      if (ve !== 0 && ne !== null) {
        var u = ne,
          s = za;
        switch (ve) {
          case 8:
            hf(), n = 6;
            break e;
          case 3:
          case 2:
          case 9:
          case 6:
            Xa.current === null && (a = !0);
            var i = ve;
            if (ve = 0, za = null, tr(e, u, s, i), t && kr) {
              n = 0;
              break e;
            }
            break;
          default:
            i = ve, ve = 0, za = null, tr(e, u, s, i);
        }
      }
      $0(), n = Ge;
      break;
    } catch (d) {
      Zh(e, d);
    } while (!0);
    return a && e.shellSuspendCounter++, qt = ho = null, me = l, Y.H = o, Y.A = r, ne === null && (Ae = null, se = 0, ai()), n;
  }
  function $0() {
    for (; ne !== null;) Wh(ne);
  }
  function ey(e, a) {
    var t = me;
    me |= 2;
    var l = Kh(),
      o = Qh();
    Ae !== e || se !== a ? (Ps = null, Fs = Pa() + 500, br(e, a)) : kr = Un(e, a);
    e: do try {
      if (ve !== 0 && ne !== null) {
        a = ne;
        var r = za;
        a: switch (ve) {
          case 1:
            ve = 0, za = null, tr(e, a, r, 1);
            break;
          case 2:
          case 9:
            if (Hp(r)) {
              ve = 0, za = null, cm(a);
              break;
            }
            a = function () {
              ve !== 2 && ve !== 9 || Ae !== e || (ve = 7), wt(e);
            }, r.then(a, a);
            break e;
          case 3:
            ve = 7;
            break e;
          case 4:
            ve = 5;
            break e;
          case 7:
            Hp(r) ? (ve = 0, za = null, cm(a)) : (ve = 0, za = null, tr(e, a, r, 7));
            break;
          case 5:
            var n = null;
            switch (ne.tag) {
              case 26:
                n = ne.memoizedState;
              case 5:
              case 27:
                var u = ne;
                if (n ? xx(n) : u.stateNode.complete) {
                  ve = 0, za = null;
                  var s = u.sibling;
                  if (s !== null) ne = s;else {
                    var i = u.return;
                    i !== null ? (ne = i, di(i)) : ne = null;
                  }
                  break a;
                }
            }
            ve = 0, za = null, tr(e, a, r, 5);
            break;
          case 6:
            ve = 0, za = null, tr(e, a, r, 6);
            break;
          case 8:
            hf(), Ge = 6;
            break e;
          default:
            throw Error(k(462));
        }
      }
      ay();
      break;
    } catch (d) {
      Zh(e, d);
    } while (!0);
    return qt = ho = null, Y.H = l, Y.A = o, me = t, ne !== null ? 0 : (Ae = null, se = 0, ai(), Ge);
  }
  function ay() {
    for (; ne !== null && !Sv();) Wh(ne);
  }
  function Wh(e) {
    var a = Sh(e.alternate, e, jt);
    e.memoizedProps = e.pendingProps, a === null ? di(e) : ne = a;
  }
  function cm(e) {
    var a = e,
      t = a.alternate;
    switch (a.tag) {
      case 15:
      case 0:
        a = om(t, a, a.pendingProps, a.type, void 0, se);
        break;
      case 11:
        a = om(t, a, a.pendingProps, a.type.render, a.ref, se);
        break;
      case 5:
        ef(a);
      default:
        kh(t, a), a = ne = kg(a, jt), a = Sh(t, a, jt);
    }
    e.memoizedProps = e.pendingProps, a === null ? di(e) : ne = a;
  }
  function tr(e, a, t, l) {
    qt = ho = null, ef(a), ur = null, An = 0;
    var o = a.return;
    try {
      if (G0(e, o, a, t, se)) {
        Ge = 1, zs(e, et(t, e.current)), ne = null;
        return;
      }
    } catch (r) {
      if (o !== null) throw ne = o, r;
      Ge = 1, zs(e, et(t, e.current)), ne = null;
      return;
    }
    a.flags & 32768 ? (de || l === 1 ? e = !0 : kr || (se & 536870912) !== 0 ? e = !1 : (xl = e = !0, (l === 2 || l === 9 || l === 3 || l === 6) && (l = Xa.current, l !== null && l.tag === 13 && (l.flags |= 16384))), Jh(a, e)) : di(a);
  }
  function di(e) {
    var a = e;
    do {
      if ((a.flags & 32768) !== 0) {
        Jh(a, xl);
        return;
      }
      e = a.return;
      var t = j0(a.alternate, a, jt);
      if (t !== null) {
        ne = t;
        return;
      }
      if (a = a.sibling, a !== null) {
        ne = a;
        return;
      }
      ne = a = e;
    } while (a !== null);
    Ge === 0 && (Ge = 5);
  }
  function Jh(e, a) {
    do {
      var t = Z0(e.alternate, e);
      if (t !== null) {
        t.flags &= 32767, ne = t;
        return;
      }
      if (t = e.return, t !== null && (t.flags |= 32768, t.subtreeFlags = 0, t.deletions = null), !a && (e = e.sibling, e !== null)) {
        ne = e;
        return;
      }
      ne = e = t;
    } while (e !== null);
    Ge = 6, ne = null;
  }
  function fm(e, a, t, l, o, r, n, u, s) {
    e.cancelPendingCommit = null;
    do ci(); while (ta !== 0);
    if ((me & 6) !== 0) throw Error(k(327));
    if (a !== null) {
      if (a === e.current) throw Error(k(177));
      if (r = a.lanes | a.childLanes, r |= Pc, Ov(e, t, r, n, u, s), e === Ae && (ne = Ae = null, se = 0), xr = a, kl = e, Ht = t, mc = r, gc = o, Vh = l, (a.subtreeFlags & 10256) !== 0 || (a.flags & 10256) !== 0 ? (e.callbackNode = null, e.callbackPriority = 0, ry(ks, function () {
        return lx(), null;
      })) : (e.callbackNode = null, e.callbackPriority = 0), l = (a.flags & 13878) !== 0, (a.subtreeFlags & 13878) !== 0 || l) {
        l = Y.T, Y.T = null, o = ge.p, ge.p = 2, n = me, me |= 4;
        try {
          Y0(e, a, t);
        } finally {
          me = n, ge.p = o, Y.T = l;
        }
      }
      ta = 1, $h(), ex(), ax();
    }
  }
  function $h() {
    if (ta === 1) {
      ta = 0;
      var e = kl,
        a = xr,
        t = (a.flags & 13878) !== 0;
      if ((a.subtreeFlags & 13878) !== 0 || t) {
        t = Y.T, Y.T = null;
        var l = ge.p;
        ge.p = 2;
        var o = me;
        me |= 4;
        try {
          zh(a, e);
          var r = yc,
            n = xg(e.containerInfo),
            u = r.focusedElem,
            s = r.selectionRange;
          if (n !== u && u && u.ownerDocument && hg(u.ownerDocument.documentElement, u)) {
            if (s !== null && Fc(u)) {
              var i = s.start,
                d = s.end;
              if (d === void 0 && (d = i), "selectionStart" in u) u.selectionStart = i, u.selectionEnd = Math.min(d, u.value.length);else {
                var x = u.ownerDocument || document,
                  m = x && x.defaultView || window;
                if (m.getSelection) {
                  var g = m.getSelection(),
                    C = u.textContent.length,
                    y = Math.min(s.start, C),
                    N = s.end === void 0 ? y : Math.min(s.end, C);
                  !g.extend && y > N && (n = N, N = y, y = n);
                  var f = Op(u, y),
                    c = Op(u, N);
                  if (f && c && (g.rangeCount !== 1 || g.anchorNode !== f.node || g.anchorOffset !== f.offset || g.focusNode !== c.node || g.focusOffset !== c.offset)) {
                    var h = x.createRange();
                    h.setStart(f.node, f.offset), g.removeAllRanges(), y > N ? (g.addRange(h), g.extend(c.node, c.offset)) : (h.setEnd(c.node, c.offset), g.addRange(h));
                  }
                }
              }
            }
            for (x = [], g = u; g = g.parentNode;) g.nodeType === 1 && x.push({
              element: g,
              left: g.scrollLeft,
              top: g.scrollTop
            });
            for (typeof u.focus == "function" && u.focus(), u = 0; u < x.length; u++) {
              var p = x[u];
              p.element.scrollLeft = p.left, p.element.scrollTop = p.top;
            }
          }
          Ks = !!vc, yc = vc = null;
        } finally {
          me = o, ge.p = l, Y.T = t;
        }
      }
      e.current = a, ta = 2;
    }
  }
  function ex() {
    if (ta === 2) {
      ta = 0;
      var e = kl,
        a = xr,
        t = (a.flags & 8772) !== 0;
      if ((a.subtreeFlags & 8772) !== 0 || t) {
        t = Y.T, Y.T = null;
        var l = ge.p;
        ge.p = 2;
        var o = me;
        me |= 4;
        try {
          Dh(e, a.alternate, a);
        } finally {
          me = o, ge.p = l, Y.T = t;
        }
      }
      ta = 3;
    }
  }
  function ax() {
    if (ta === 4 || ta === 3) {
      ta = 0, kv();
      var e = kl,
        a = xr,
        t = Ht,
        l = Vh;
      (a.subtreeFlags & 10256) !== 0 || (a.flags & 10256) !== 0 ? ta = 5 : (ta = 0, xr = kl = null, tx(e, e.pendingLanes));
      var o = e.pendingLanes;
      if (o === 0 && (Sl = null), Rc(t), a = a.stateNode, Ha && typeof Ha.onCommitFiberRoot == "function") try {
        Ha.onCommitFiberRoot(zn, a, void 0, (a.current.flags & 128) === 128);
      } catch {}
      if (l !== null) {
        a = Y.T, o = ge.p, ge.p = 2, Y.T = null;
        try {
          for (var r = e.onRecoverableError, n = 0; n < l.length; n++) {
            var u = l[n];
            r(u.value, {
              componentStack: u.stack
            });
          }
        } finally {
          Y.T = a, ge.p = o;
        }
      }
      (Ht & 3) !== 0 && ci(), wt(e), o = e.pendingLanes, (t & 261930) !== 0 && (o & 42) !== 0 ? e === hc ? vn++ : (vn = 0, hc = e) : vn = 0, Vn(0, !1);
    }
  }
  function tx(e, a) {
    (e.pooledCacheLanes &= a) === 0 && (a = e.pooledCache, a != null && (e.pooledCache = null, Hn(a)));
  }
  function ci() {
    return $h(), ex(), ax(), lx();
  }
  function lx() {
    if (ta !== 5) return !1;
    var e = kl,
      a = mc;
    mc = 0;
    var t = Rc(Ht),
      l = Y.T,
      o = ge.p;
    try {
      ge.p = 32 > t ? 32 : t, Y.T = null, t = gc, gc = null;
      var r = kl,
        n = Ht;
      if (ta = 0, xr = kl = null, Ht = 0, (me & 6) !== 0) throw Error(k(331));
      var u = me;
      if (me |= 4, Hh(r.current), qh(r, r.current, n, t), me = u, Vn(0, !1), Ha && typeof Ha.onPostCommitFiberRoot == "function") try {
        Ha.onPostCommitFiberRoot(zn, r);
      } catch {}
      return !0;
    } finally {
      ge.p = o, Y.T = l, tx(e, a);
    }
  }
  function pm(e, a, t) {
    a = et(t, a), a = ic(e.stateNode, a, 2), e = Cl(e, a, 2), e !== null && (qn(e, 2), wt(e));
  }
  function ye(e, a, t) {
    if (e.tag === 3) pm(e, e, t);else for (; a !== null;) {
      if (a.tag === 3) {
        pm(a, e, t);
        break;
      } else if (a.tag === 1) {
        var l = a.stateNode;
        if (typeof a.type.getDerivedStateFromError == "function" || typeof l.componentDidCatch == "function" && (Sl === null || !Sl.has(l))) {
          e = et(t, e), t = bh(2), l = Cl(a, t, 2), l !== null && (vh(t, l, a, e), qn(l, 2), wt(l));
          break;
        }
      }
      a = a.return;
    }
  }
  function Ad(e, a, t) {
    var l = e.pingCache;
    if (l === null) {
      l = e.pingCache = new W0();
      var o = new Set();
      l.set(a, o);
    } else o = l.get(a), o === void 0 && (o = new Set(), l.set(a, o));
    o.has(t) || (mf = !0, o.add(t), e = ty.bind(null, e, a, t), a.then(e, e));
  }
  function ty(e, a, t) {
    var l = e.pingCache;
    l !== null && l.delete(a), e.pingedLanes |= e.suspendedLanes & t, e.warmLanes &= ~t, Ae === e && (se & t) === t && (Ge === 4 || Ge === 3 && (se & 62914560) === se && 300 > Pa() - si ? (me & 2) === 0 && br(e, 0) : gf |= t, hr === se && (hr = 0)), wt(e);
  }
  function ox(e, a) {
    a === 0 && (a = Km()), e = go(e, a), e !== null && (qn(e, a), wt(e));
  }
  function ly(e) {
    var a = e.memoizedState,
      t = 0;
    a !== null && (t = a.retryLane), ox(e, t);
  }
  function oy(e, a) {
    var t = 0;
    switch (e.tag) {
      case 31:
      case 13:
        var l = e.stateNode,
          o = e.memoizedState;
        o !== null && (t = o.retryLane);
        break;
      case 19:
        l = e.stateNode;
        break;
      case 22:
        l = e.stateNode._retryCache;
        break;
      default:
        throw Error(k(314));
    }
    l !== null && l.delete(a), ox(e, t);
  }
  function ry(e, a) {
    return Tc(e, a);
  }
  var _s = null,
    Vo = null,
    xc = !1,
    Gs = !1,
    Md = !1,
    vl = 0;
  function wt(e) {
    e !== Vo && e.next === null && (Vo === null ? _s = Vo = e : Vo = Vo.next = e), Gs = !0, xc || (xc = !0, uy());
  }
  function Vn(e, a) {
    if (!Md && Gs) {
      Md = !0;
      do for (var t = !1, l = _s; l !== null;) {
        if (!a) if (e !== 0) {
          var o = l.pendingLanes;
          if (o === 0) var r = 0;else {
            var n = l.suspendedLanes,
              u = l.pingedLanes;
            r = (1 << 31 - _a(42 | e) + 1) - 1, r &= o & ~(n & ~u), r = r & 201326741 ? r & 201326741 | 1 : r ? r | 2 : 0;
          }
          r !== 0 && (t = !0, mm(l, r));
        } else r = se, r = Ws(l, l === Ae ? r : 0, l.cancelPendingCommit !== null || l.timeoutHandle !== -1), (r & 3) === 0 || Un(l, r) || (t = !0, mm(l, r));
        l = l.next;
      } while (t);
      Md = !1;
    }
  }
  function ny() {
    rx();
  }
  function rx() {
    Gs = xc = !1;
    var e = 0;
    vl !== 0 && gy() && (e = vl);
    for (var a = Pa(), t = null, l = _s; l !== null;) {
      var o = l.next,
        r = nx(l, a);
      r === 0 ? (l.next = null, t === null ? _s = o : t.next = o, o === null && (Vo = t)) : (t = l, (e !== 0 || (r & 3) !== 0) && (Gs = !0)), l = o;
    }
    ta !== 0 && ta !== 5 || Vn(e, !1), vl !== 0 && (vl = 0);
  }
  function nx(e, a) {
    for (var t = e.suspendedLanes, l = e.pingedLanes, o = e.expirationTimes, r = e.pendingLanes & -62914561; 0 < r;) {
      var n = 31 - _a(r),
        u = 1 << n,
        s = o[n];
      s === -1 ? ((u & t) === 0 || (u & l) !== 0) && (o[n] = Bv(u, a)) : s <= a && (e.expiredLanes |= u), r &= ~u;
    }
    if (a = Ae, t = se, t = Ws(e, e === a ? t : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1), l = e.callbackNode, t === 0 || e === a && (ve === 2 || ve === 9) || e.cancelPendingCommit !== null) return l !== null && l !== null && ld(l), e.callbackNode = null, e.callbackPriority = 0;
    if ((t & 3) === 0 || Un(e, t)) {
      if (a = t & -t, a === e.callbackPriority) return a;
      switch (l !== null && ld(l), Rc(t)) {
        case 2:
        case 8:
          t = Zm;
          break;
        case 32:
          t = ks;
          break;
        case 268435456:
          t = Ym;
          break;
        default:
          t = ks;
      }
      return l = ux.bind(null, e), t = Tc(t, l), e.callbackPriority = a, e.callbackNode = t, a;
    }
    return l !== null && l !== null && ld(l), e.callbackPriority = 2, e.callbackNode = null, 2;
  }
  function ux(e, a) {
    if (ta !== 0 && ta !== 5) return e.callbackNode = null, e.callbackPriority = 0, null;
    var t = e.callbackNode;
    if (ci() && e.callbackNode !== t) return null;
    var l = se;
    return l = Ws(e, e === Ae ? l : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1), l === 0 ? null : (jh(e, l, a), nx(e, Pa()), e.callbackNode != null && e.callbackNode === t ? ux.bind(null, e) : null);
  }
  function mm(e, a) {
    if (ci()) return null;
    jh(e, a, !0);
  }
  function uy() {
    xy(function () {
      (me & 6) !== 0 ? Tc(jm, ny) : rx();
    });
  }
  function xf() {
    if (vl === 0) {
      var e = pr;
      e === 0 && (e = Vu, Vu <<= 1, (Vu & 261888) === 0 && (Vu = 256)), vl = e;
    }
    return vl;
  }
  function gm(e) {
    return e == null || typeof e == "symbol" || typeof e == "boolean" ? null : typeof e == "function" ? e : ss("" + e);
  }
  function hm(e, a) {
    var t = a.ownerDocument.createElement("input");
    return t.name = a.name, t.value = a.value, e.id && t.setAttribute("form", e.id), a.parentNode.insertBefore(t, a), e = new FormData(e), t.parentNode.removeChild(t), e;
  }
  function sy(e, a, t, l, o) {
    if (a === "submit" && t && t.stateNode === o) {
      var r = gm((o[Da] || null).action),
        n = l.submitter;
      n && (a = (a = n[Da] || null) ? gm(a.formAction) : n.getAttribute("formAction"), a !== null && (r = a, n = null));
      var u = new Js("action", "action", null, l, o);
      e.push({
        event: u,
        listeners: [{
          instance: null,
          listener: function () {
            if (l.defaultPrevented) {
              if (vl !== 0) {
                var s = n ? hm(o, n) : new FormData(o);
                uc(t, {
                  pending: !0,
                  data: s,
                  method: o.method,
                  action: r
                }, null, s);
              }
            } else typeof r == "function" && (u.preventDefault(), s = n ? hm(o, n) : new FormData(o), uc(t, {
              pending: !0,
              data: s,
              method: o.method,
              action: r
            }, r, s));
          },
          currentTarget: o
        }]
      });
    }
  }
  for (ts = 0; ts < Kd.length; ts++) ls = Kd[ts], xm = ls.toLowerCase(), bm = ls[0].toUpperCase() + ls.slice(1), it(xm, "on" + bm);
  var ls, xm, bm, ts;
  it(vg, "onAnimationEnd");
  it(yg, "onAnimationIteration");
  it(Lg, "onAnimationStart");
  it("dblclick", "onDoubleClick");
  it("focusin", "onFocus");
  it("focusout", "onBlur");
  it(I0, "onTransitionRun");
  it(A0, "onTransitionStart");
  it(M0, "onTransitionCancel");
  it(wg, "onTransitionEnd");
  cr("onMouseEnter", ["mouseout", "mouseover"]);
  cr("onMouseLeave", ["mouseout", "mouseover"]);
  cr("onPointerEnter", ["pointerout", "pointerover"]);
  cr("onPointerLeave", ["pointerout", "pointerover"]);
  fo("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" "));
  fo("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));
  fo("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]);
  fo("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" "));
  fo("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" "));
  fo("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
  var Tn = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),
    iy = new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(Tn));
  function sx(e, a) {
    a = (a & 4) !== 0;
    for (var t = 0; t < e.length; t++) {
      var l = e[t],
        o = l.event;
      l = l.listeners;
      e: {
        var r = void 0;
        if (a) for (var n = l.length - 1; 0 <= n; n--) {
          var u = l[n],
            s = u.instance,
            i = u.currentTarget;
          if (u = u.listener, s !== r && o.isPropagationStopped()) break e;
          r = u, o.currentTarget = i;
          try {
            r(o);
          } catch (d) {
            As(d);
          }
          o.currentTarget = null, r = s;
        } else for (n = 0; n < l.length; n++) {
          if (u = l[n], s = u.instance, i = u.currentTarget, u = u.listener, s !== r && o.isPropagationStopped()) break e;
          r = u, o.currentTarget = i;
          try {
            r(o);
          } catch (d) {
            As(d);
          }
          o.currentTarget = null, r = s;
        }
      }
    }
  }
  function re(e, a) {
    var t = a[Hd];
    t === void 0 && (t = a[Hd] = new Set());
    var l = e + "__bubble";
    t.has(l) || (ix(a, e, 2, !1), t.add(l));
  }
  function Nd(e, a, t) {
    var l = 0;
    a && (l |= 4), ix(t, e, l, a);
  }
  var os = "_reactListening" + Math.random().toString(36).slice(2);
  function bf(e) {
    if (!e[os]) {
      e[os] = !0, eg.forEach(function (t) {
        t !== "selectionchange" && (iy.has(t) || Nd(t, !1, e), Nd(t, !0, e));
      });
      var a = e.nodeType === 9 ? e : e.ownerDocument;
      a === null || a[os] || (a[os] = !0, Nd("selectionchange", !1, a));
    }
  }
  function ix(e, a, t, l) {
    switch (wx(a)) {
      case 2:
        var o = Uy;
        break;
      case 8:
        o = qy;
        break;
      default:
        o = wf;
    }
    t = o.bind(null, a, t, e), o = void 0, !jd || a !== "touchstart" && a !== "touchmove" && a !== "wheel" || (o = !0), l ? o !== void 0 ? e.addEventListener(a, t, {
      capture: !0,
      passive: o
    }) : e.addEventListener(a, t, !0) : o !== void 0 ? e.addEventListener(a, t, {
      passive: o
    }) : e.addEventListener(a, t, !1);
  }
  function Td(e, a, t, l, o) {
    var r = l;
    if ((a & 1) === 0 && (a & 2) === 0 && l !== null) e: for (;;) {
      if (l === null) return;
      var n = l.tag;
      if (n === 3 || n === 4) {
        var u = l.stateNode.containerInfo;
        if (u === o) break;
        if (n === 4) for (n = l.return; n !== null;) {
          var s = n.tag;
          if ((s === 3 || s === 4) && n.stateNode.containerInfo === o) return;
          n = n.return;
        }
        for (; u !== null;) {
          if (n = Zo(u), n === null) return;
          if (s = n.tag, s === 5 || s === 6 || s === 26 || s === 27) {
            l = r = n;
            continue e;
          }
          u = u.parentNode;
        }
      }
      l = l.return;
    }
    sg(function () {
      var i = r,
        d = Ec(t),
        x = [];
      e: {
        var m = Cg.get(e);
        if (m !== void 0) {
          var g = Js,
            C = e;
          switch (e) {
            case "keypress":
              if (ds(t) === 0) break e;
            case "keydown":
            case "keyup":
              g = o0;
              break;
            case "focusin":
              C = "focus", g = sd;
              break;
            case "focusout":
              C = "blur", g = sd;
              break;
            case "beforeblur":
            case "afterblur":
              g = sd;
              break;
            case "click":
              if (t.button === 2) break e;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              g = kp;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              g = jv;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              g = u0;
              break;
            case vg:
            case yg:
            case Lg:
              g = Kv;
              break;
            case wg:
              g = i0;
              break;
            case "scroll":
            case "scrollend":
              g = Vv;
              break;
            case "wheel":
              g = c0;
              break;
            case "copy":
            case "cut":
            case "paste":
              g = Wv;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              g = Ap;
              break;
            case "toggle":
            case "beforetoggle":
              g = p0;
          }
          var y = (a & 4) !== 0,
            N = !y && (e === "scroll" || e === "scrollend"),
            f = y ? m !== null ? m + "Capture" : null : m;
          y = [];
          for (var c = i, h; c !== null;) {
            var p = c;
            if (h = p.stateNode, p = p.tag, p !== 5 && p !== 26 && p !== 27 || h === null || f === null || (p = wn(c, f), p != null && y.push(Dn(c, p, h))), N) break;
            c = c.return;
          }
          0 < y.length && (m = new g(m, C, null, t, d), x.push({
            event: m,
            listeners: y
          }));
        }
      }
      if ((a & 7) === 0) {
        e: {
          if (m = e === "mouseover" || e === "pointerover", g = e === "mouseout" || e === "pointerout", m && t !== Xd && (C = t.relatedTarget || t.fromElement) && (Zo(C) || C[Lr])) break e;
          if ((g || m) && (m = d.window === d ? d : (m = d.ownerDocument) ? m.defaultView || m.parentWindow : window, g ? (C = t.relatedTarget || t.toElement, g = i, C = C ? Zo(C) : null, C !== null && (N = En(C), y = C.tag, C !== N || y !== 5 && y !== 27 && y !== 6) && (C = null)) : (g = null, C = i), g !== C)) {
            if (y = kp, p = "onMouseLeave", f = "onMouseEnter", c = "mouse", (e === "pointerout" || e === "pointerover") && (y = Ap, p = "onPointerLeave", f = "onPointerEnter", c = "pointer"), N = g == null ? m : on(g), h = C == null ? m : on(C), m = new y(p, c + "leave", g, t, d), m.target = N, m.relatedTarget = h, p = null, Zo(d) === i && (y = new y(f, c + "enter", C, t, d), y.target = h, y.relatedTarget = N, p = y), N = p, g && C) a: {
              for (y = dy, f = g, c = C, h = 0, p = f; p; p = y(p)) h++;
              p = 0;
              for (var M = c; M; M = y(M)) p++;
              for (; 0 < h - p;) f = y(f), h--;
              for (; 0 < p - h;) c = y(c), p--;
              for (; h--;) {
                if (f === c || c !== null && f === c.alternate) {
                  y = f;
                  break a;
                }
                f = y(f), c = y(c);
              }
              y = null;
            } else y = null;
            g !== null && vm(x, m, g, y, !1), C !== null && N !== null && vm(x, N, C, y, !0);
          }
        }
        e: {
          if (m = i ? on(i) : window, g = m.nodeName && m.nodeName.toLowerCase(), g === "select" || g === "input" && m.type === "file") var D = Dp;else if (Tp(m)) {
            if (mg) D = C0;else {
              D = L0;
              var L = y0;
            }
          } else g = m.nodeName, !g || g.toLowerCase() !== "input" || m.type !== "checkbox" && m.type !== "radio" ? i && Oc(i.elementType) && (D = Dp) : D = w0;
          if (D && (D = D(e, i))) {
            pg(x, D, t, d);
            break e;
          }
          L && L(e, m, i), e === "focusout" && i && m.type === "number" && i.memoizedProps.value != null && Vd(m, "number", m.value);
        }
        switch (L = i ? on(i) : window, e) {
          case "focusin":
            (Tp(L) || L.contentEditable === "true") && (Qo = L, Zd = i, dn = null);
            break;
          case "focusout":
            dn = Zd = Qo = null;
            break;
          case "mousedown":
            Yd = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            Yd = !1, Ep(x, t, d);
            break;
          case "selectionchange":
            if (k0) break;
          case "keydown":
          case "keyup":
            Ep(x, t, d);
        }
        var w;
        if (qc) e: {
          switch (e) {
            case "compositionstart":
              var E = "onCompositionStart";
              break e;
            case "compositionend":
              E = "onCompositionEnd";
              break e;
            case "compositionupdate":
              E = "onCompositionUpdate";
              break e;
          }
          E = void 0;
        } else Ko ? cg(e, t) && (E = "onCompositionEnd") : e === "keydown" && t.keyCode === 229 && (E = "onCompositionStart");
        E && (dg && t.locale !== "ko" && (Ko || E !== "onCompositionStart" ? E === "onCompositionEnd" && Ko && (w = ig()) : (hl = d, zc = "value" in hl ? hl.value : hl.textContent, Ko = !0)), L = Vs(i, E), 0 < L.length && (E = new Ip(E, e, null, t, d), x.push({
          event: E,
          listeners: L
        }), w ? E.data = w : (w = fg(t), w !== null && (E.data = w)))), (w = g0 ? h0(e, t) : x0(e, t)) && (E = Vs(i, "onBeforeInput"), 0 < E.length && (L = new Ip("onBeforeInput", "beforeinput", null, t, d), x.push({
          event: L,
          listeners: E
        }), L.data = w)), sy(x, e, i, t, d);
      }
      sx(x, a);
    });
  }
  function Dn(e, a, t) {
    return {
      instance: e,
      listener: a,
      currentTarget: t
    };
  }
  function Vs(e, a) {
    for (var t = a + "Capture", l = []; e !== null;) {
      var o = e,
        r = o.stateNode;
      if (o = o.tag, o !== 5 && o !== 26 && o !== 27 || r === null || (o = wn(e, t), o != null && l.unshift(Dn(e, o, r)), o = wn(e, a), o != null && l.push(Dn(e, o, r))), e.tag === 3) return l;
      e = e.return;
    }
    return [];
  }
  function dy(e) {
    if (e === null) return null;
    do e = e.return; while (e && e.tag !== 5 && e.tag !== 27);
    return e || null;
  }
  function vm(e, a, t, l, o) {
    for (var r = a._reactName, n = []; t !== null && t !== l;) {
      var u = t,
        s = u.alternate,
        i = u.stateNode;
      if (u = u.tag, s !== null && s === l) break;
      u !== 5 && u !== 26 && u !== 27 || i === null || (s = i, o ? (i = wn(t, r), i != null && n.unshift(Dn(t, i, s))) : o || (i = wn(t, r), i != null && n.push(Dn(t, i, s)))), t = t.return;
    }
    n.length !== 0 && e.push({
      event: a,
      listeners: n
    });
  }
  var cy = /\r\n?/g,
    fy = /\u0000|\uFFFD/g;
  function ym(e) {
    return (typeof e == "string" ? e : "" + e).replace(cy, `
`).replace(fy, "");
  }
  function dx(e, a) {
    return a = ym(a), ym(e) === a;
  }
  function Se(e, a, t, l, o, r) {
    switch (t) {
      case "children":
        typeof l == "string" ? a === "body" || a === "textarea" && l === "" || fr(e, l) : (typeof l == "number" || typeof l == "bigint") && a !== "body" && fr(e, "" + l);
        break;
      case "className":
        Zu(e, "class", l);
        break;
      case "tabIndex":
        Zu(e, "tabindex", l);
        break;
      case "dir":
      case "role":
      case "viewBox":
      case "width":
      case "height":
        Zu(e, t, l);
        break;
      case "style":
        ug(e, l, r);
        break;
      case "data":
        if (a !== "object") {
          Zu(e, "data", l);
          break;
        }
      case "src":
      case "href":
        if (l === "" && (a !== "a" || t !== "href")) {
          e.removeAttribute(t);
          break;
        }
        if (l == null || typeof l == "function" || typeof l == "symbol" || typeof l == "boolean") {
          e.removeAttribute(t);
          break;
        }
        l = ss("" + l), e.setAttribute(t, l);
        break;
      case "action":
      case "formAction":
        if (typeof l == "function") {
          e.setAttribute(t, "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");
          break;
        } else typeof r == "function" && (t === "formAction" ? (a !== "input" && Se(e, a, "name", o.name, o, null), Se(e, a, "formEncType", o.formEncType, o, null), Se(e, a, "formMethod", o.formMethod, o, null), Se(e, a, "formTarget", o.formTarget, o, null)) : (Se(e, a, "encType", o.encType, o, null), Se(e, a, "method", o.method, o, null), Se(e, a, "target", o.target, o, null)));
        if (l == null || typeof l == "symbol" || typeof l == "boolean") {
          e.removeAttribute(t);
          break;
        }
        l = ss("" + l), e.setAttribute(t, l);
        break;
      case "onClick":
        l != null && (e.onclick = Ut);
        break;
      case "onScroll":
        l != null && re("scroll", e);
        break;
      case "onScrollEnd":
        l != null && re("scrollend", e);
        break;
      case "dangerouslySetInnerHTML":
        if (l != null) {
          if (typeof l != "object" || !("__html" in l)) throw Error(k(61));
          if (t = l.__html, t != null) {
            if (o.children != null) throw Error(k(60));
            e.innerHTML = t;
          }
        }
        break;
      case "multiple":
        e.multiple = l && typeof l != "function" && typeof l != "symbol";
        break;
      case "muted":
        e.muted = l && typeof l != "function" && typeof l != "symbol";
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
          e.removeAttribute("xlink:href");
          break;
        }
        t = ss("" + l), e.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", t);
        break;
      case "contentEditable":
      case "spellCheck":
      case "draggable":
      case "value":
      case "autoReverse":
      case "externalResourcesRequired":
      case "focusable":
      case "preserveAlpha":
        l != null && typeof l != "function" && typeof l != "symbol" ? e.setAttribute(t, "" + l) : e.removeAttribute(t);
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
        l && typeof l != "function" && typeof l != "symbol" ? e.setAttribute(t, "") : e.removeAttribute(t);
        break;
      case "capture":
      case "download":
        l === !0 ? e.setAttribute(t, "") : l !== !1 && l != null && typeof l != "function" && typeof l != "symbol" ? e.setAttribute(t, l) : e.removeAttribute(t);
        break;
      case "cols":
      case "rows":
      case "size":
      case "span":
        l != null && typeof l != "function" && typeof l != "symbol" && !isNaN(l) && 1 <= l ? e.setAttribute(t, l) : e.removeAttribute(t);
        break;
      case "rowSpan":
      case "start":
        l == null || typeof l == "function" || typeof l == "symbol" || isNaN(l) ? e.removeAttribute(t) : e.setAttribute(t, l);
        break;
      case "popover":
        re("beforetoggle", e), re("toggle", e), us(e, "popover", l);
        break;
      case "xlinkActuate":
        Nt(e, "http://www.w3.org/1999/xlink", "xlink:actuate", l);
        break;
      case "xlinkArcrole":
        Nt(e, "http://www.w3.org/1999/xlink", "xlink:arcrole", l);
        break;
      case "xlinkRole":
        Nt(e, "http://www.w3.org/1999/xlink", "xlink:role", l);
        break;
      case "xlinkShow":
        Nt(e, "http://www.w3.org/1999/xlink", "xlink:show", l);
        break;
      case "xlinkTitle":
        Nt(e, "http://www.w3.org/1999/xlink", "xlink:title", l);
        break;
      case "xlinkType":
        Nt(e, "http://www.w3.org/1999/xlink", "xlink:type", l);
        break;
      case "xmlBase":
        Nt(e, "http://www.w3.org/XML/1998/namespace", "xml:base", l);
        break;
      case "xmlLang":
        Nt(e, "http://www.w3.org/XML/1998/namespace", "xml:lang", l);
        break;
      case "xmlSpace":
        Nt(e, "http://www.w3.org/XML/1998/namespace", "xml:space", l);
        break;
      case "is":
        us(e, "is", l);
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        (!(2 < t.length) || t[0] !== "o" && t[0] !== "O" || t[1] !== "n" && t[1] !== "N") && (t = _v.get(t) || t, us(e, t, l));
    }
  }
  function bc(e, a, t, l, o, r) {
    switch (t) {
      case "style":
        ug(e, l, r);
        break;
      case "dangerouslySetInnerHTML":
        if (l != null) {
          if (typeof l != "object" || !("__html" in l)) throw Error(k(61));
          if (t = l.__html, t != null) {
            if (o.children != null) throw Error(k(60));
            e.innerHTML = t;
          }
        }
        break;
      case "children":
        typeof l == "string" ? fr(e, l) : (typeof l == "number" || typeof l == "bigint") && fr(e, "" + l);
        break;
      case "onScroll":
        l != null && re("scroll", e);
        break;
      case "onScrollEnd":
        l != null && re("scrollend", e);
        break;
      case "onClick":
        l != null && (e.onclick = Ut);
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
        if (!ag.hasOwnProperty(t)) e: {
          if (t[0] === "o" && t[1] === "n" && (o = t.endsWith("Capture"), a = t.slice(2, o ? t.length - 7 : void 0), r = e[Da] || null, r = r != null ? r[t] : null, typeof r == "function" && e.removeEventListener(a, r, o), typeof l == "function")) {
            typeof r != "function" && r !== null && (t in e ? e[t] = null : e.hasAttribute(t) && e.removeAttribute(t)), e.addEventListener(a, l, o);
            break e;
          }
          t in e ? e[t] = l : l === !0 ? e.setAttribute(t, "") : us(e, t, l);
        }
    }
  }
  function ma(e, a, t) {
    switch (a) {
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
        re("error", e), re("load", e);
        var l = !1,
          o = !1,
          r;
        for (r in t) if (t.hasOwnProperty(r)) {
          var n = t[r];
          if (n != null) switch (r) {
            case "src":
              l = !0;
              break;
            case "srcSet":
              o = !0;
              break;
            case "children":
            case "dangerouslySetInnerHTML":
              throw Error(k(137, a));
            default:
              Se(e, a, r, n, t, null);
          }
        }
        o && Se(e, a, "srcSet", t.srcSet, t, null), l && Se(e, a, "src", t.src, t, null);
        return;
      case "input":
        re("invalid", e);
        var u = r = n = o = null,
          s = null,
          i = null;
        for (l in t) if (t.hasOwnProperty(l)) {
          var d = t[l];
          if (d != null) switch (l) {
            case "name":
              o = d;
              break;
            case "type":
              n = d;
              break;
            case "checked":
              s = d;
              break;
            case "defaultChecked":
              i = d;
              break;
            case "value":
              r = d;
              break;
            case "defaultValue":
              u = d;
              break;
            case "children":
            case "dangerouslySetInnerHTML":
              if (d != null) throw Error(k(137, a));
              break;
            default:
              Se(e, a, l, d, t, null);
          }
        }
        og(e, r, u, s, i, n, o, !1);
        return;
      case "select":
        re("invalid", e), l = n = r = null;
        for (o in t) if (t.hasOwnProperty(o) && (u = t[o], u != null)) switch (o) {
          case "value":
            r = u;
            break;
          case "defaultValue":
            n = u;
            break;
          case "multiple":
            l = u;
          default:
            Se(e, a, o, u, t, null);
        }
        a = r, t = n, e.multiple = !!l, a != null ? or(e, !!l, a, !1) : t != null && or(e, !!l, t, !0);
        return;
      case "textarea":
        re("invalid", e), r = o = l = null;
        for (n in t) if (t.hasOwnProperty(n) && (u = t[n], u != null)) switch (n) {
          case "value":
            l = u;
            break;
          case "defaultValue":
            o = u;
            break;
          case "children":
            r = u;
            break;
          case "dangerouslySetInnerHTML":
            if (u != null) throw Error(k(91));
            break;
          default:
            Se(e, a, n, u, t, null);
        }
        ng(e, l, o, r);
        return;
      case "option":
        for (s in t) t.hasOwnProperty(s) && (l = t[s], l != null) && (s === "selected" ? e.selected = l && typeof l != "function" && typeof l != "symbol" : Se(e, a, s, l, t, null));
        return;
      case "dialog":
        re("beforetoggle", e), re("toggle", e), re("cancel", e), re("close", e);
        break;
      case "iframe":
      case "object":
        re("load", e);
        break;
      case "video":
      case "audio":
        for (l = 0; l < Tn.length; l++) re(Tn[l], e);
        break;
      case "image":
        re("error", e), re("load", e);
        break;
      case "details":
        re("toggle", e);
        break;
      case "embed":
      case "source":
      case "link":
        re("error", e), re("load", e);
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
        for (i in t) if (t.hasOwnProperty(i) && (l = t[i], l != null)) switch (i) {
          case "children":
          case "dangerouslySetInnerHTML":
            throw Error(k(137, a));
          default:
            Se(e, a, i, l, t, null);
        }
        return;
      default:
        if (Oc(a)) {
          for (d in t) t.hasOwnProperty(d) && (l = t[d], l !== void 0 && bc(e, a, d, l, t, void 0));
          return;
        }
    }
    for (u in t) t.hasOwnProperty(u) && (l = t[u], l != null && Se(e, a, u, l, t, null));
  }
  function py(e, a, t, l) {
    switch (a) {
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
        var o = null,
          r = null,
          n = null,
          u = null,
          s = null,
          i = null,
          d = null;
        for (g in t) {
          var x = t[g];
          if (t.hasOwnProperty(g) && x != null) switch (g) {
            case "checked":
              break;
            case "value":
              break;
            case "defaultValue":
              s = x;
            default:
              l.hasOwnProperty(g) || Se(e, a, g, null, l, x);
          }
        }
        for (var m in l) {
          var g = l[m];
          if (x = t[m], l.hasOwnProperty(m) && (g != null || x != null)) switch (m) {
            case "type":
              r = g;
              break;
            case "name":
              o = g;
              break;
            case "checked":
              i = g;
              break;
            case "defaultChecked":
              d = g;
              break;
            case "value":
              n = g;
              break;
            case "defaultValue":
              u = g;
              break;
            case "children":
            case "dangerouslySetInnerHTML":
              if (g != null) throw Error(k(137, a));
              break;
            default:
              g !== x && Se(e, a, m, g, l, x);
          }
        }
        Gd(e, n, u, s, i, d, r, o);
        return;
      case "select":
        g = n = u = m = null;
        for (r in t) if (s = t[r], t.hasOwnProperty(r) && s != null) switch (r) {
          case "value":
            break;
          case "multiple":
            g = s;
          default:
            l.hasOwnProperty(r) || Se(e, a, r, null, l, s);
        }
        for (o in l) if (r = l[o], s = t[o], l.hasOwnProperty(o) && (r != null || s != null)) switch (o) {
          case "value":
            m = r;
            break;
          case "defaultValue":
            u = r;
            break;
          case "multiple":
            n = r;
          default:
            r !== s && Se(e, a, o, r, l, s);
        }
        a = u, t = n, l = g, m != null ? or(e, !!t, m, !1) : !!l != !!t && (a != null ? or(e, !!t, a, !0) : or(e, !!t, t ? [] : "", !1));
        return;
      case "textarea":
        g = m = null;
        for (u in t) if (o = t[u], t.hasOwnProperty(u) && o != null && !l.hasOwnProperty(u)) switch (u) {
          case "value":
            break;
          case "children":
            break;
          default:
            Se(e, a, u, null, l, o);
        }
        for (n in l) if (o = l[n], r = t[n], l.hasOwnProperty(n) && (o != null || r != null)) switch (n) {
          case "value":
            m = o;
            break;
          case "defaultValue":
            g = o;
            break;
          case "children":
            break;
          case "dangerouslySetInnerHTML":
            if (o != null) throw Error(k(91));
            break;
          default:
            o !== r && Se(e, a, n, o, l, r);
        }
        rg(e, m, g);
        return;
      case "option":
        for (var C in t) m = t[C], t.hasOwnProperty(C) && m != null && !l.hasOwnProperty(C) && (C === "selected" ? e.selected = !1 : Se(e, a, C, null, l, m));
        for (s in l) m = l[s], g = t[s], l.hasOwnProperty(s) && m !== g && (m != null || g != null) && (s === "selected" ? e.selected = m && typeof m != "function" && typeof m != "symbol" : Se(e, a, s, m, l, g));
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
        for (var y in t) m = t[y], t.hasOwnProperty(y) && m != null && !l.hasOwnProperty(y) && Se(e, a, y, null, l, m);
        for (i in l) if (m = l[i], g = t[i], l.hasOwnProperty(i) && m !== g && (m != null || g != null)) switch (i) {
          case "children":
          case "dangerouslySetInnerHTML":
            if (m != null) throw Error(k(137, a));
            break;
          default:
            Se(e, a, i, m, l, g);
        }
        return;
      default:
        if (Oc(a)) {
          for (var N in t) m = t[N], t.hasOwnProperty(N) && m !== void 0 && !l.hasOwnProperty(N) && bc(e, a, N, void 0, l, m);
          for (d in l) m = l[d], g = t[d], !l.hasOwnProperty(d) || m === g || m === void 0 && g === void 0 || bc(e, a, d, m, l, g);
          return;
        }
    }
    for (var f in t) m = t[f], t.hasOwnProperty(f) && m != null && !l.hasOwnProperty(f) && Se(e, a, f, null, l, m);
    for (x in l) m = l[x], g = t[x], !l.hasOwnProperty(x) || m === g || m == null && g == null || Se(e, a, x, m, l, g);
  }
  function Lm(e) {
    switch (e) {
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
  function my() {
    if (typeof performance.getEntriesByType == "function") {
      for (var e = 0, a = 0, t = performance.getEntriesByType("resource"), l = 0; l < t.length; l++) {
        var o = t[l],
          r = o.transferSize,
          n = o.initiatorType,
          u = o.duration;
        if (r && u && Lm(n)) {
          for (n = 0, u = o.responseEnd, l += 1; l < t.length; l++) {
            var s = t[l],
              i = s.startTime;
            if (i > u) break;
            var d = s.transferSize,
              x = s.initiatorType;
            d && Lm(x) && (s = s.responseEnd, n += d * (s < u ? 1 : (u - i) / (s - i)));
          }
          if (--l, a += 8 * (r + n) / (o.duration / 1e3), e++, 10 < e) break;
        }
      }
      if (0 < e) return a / e / 1e6;
    }
    return navigator.connection && (e = navigator.connection.downlink, typeof e == "number") ? e : 5;
  }
  var vc = null,
    yc = null;
  function Xs(e) {
    return e.nodeType === 9 ? e : e.ownerDocument;
  }
  function wm(e) {
    switch (e) {
      case "http://www.w3.org/2000/svg":
        return 1;
      case "http://www.w3.org/1998/Math/MathML":
        return 2;
      default:
        return 0;
    }
  }
  function cx(e, a) {
    if (e === 0) switch (a) {
      case "svg":
        return 1;
      case "math":
        return 2;
      default:
        return 0;
    }
    return e === 1 && a === "foreignObject" ? 0 : e;
  }
  function Lc(e, a) {
    return e === "textarea" || e === "noscript" || typeof a.children == "string" || typeof a.children == "number" || typeof a.children == "bigint" || typeof a.dangerouslySetInnerHTML == "object" && a.dangerouslySetInnerHTML !== null && a.dangerouslySetInnerHTML.__html != null;
  }
  var Dd = null;
  function gy() {
    var e = window.event;
    return e && e.type === "popstate" ? e === Dd ? !1 : (Dd = e, !0) : (Dd = null, !1);
  }
  var fx = typeof setTimeout == "function" ? setTimeout : void 0,
    hy = typeof clearTimeout == "function" ? clearTimeout : void 0,
    Cm = typeof Promise == "function" ? Promise : void 0,
    xy = typeof queueMicrotask == "function" ? queueMicrotask : typeof Cm < "u" ? function (e) {
      return Cm.resolve(null).then(e).catch(by);
    } : fx;
  function by(e) {
    setTimeout(function () {
      throw e;
    });
  }
  function Ol(e) {
    return e === "head";
  }
  function Sm(e, a) {
    var t = a,
      l = 0;
    do {
      var o = t.nextSibling;
      if (e.removeChild(t), o && o.nodeType === 8) if (t = o.data, t === "/$" || t === "/&") {
        if (l === 0) {
          e.removeChild(o), yr(a);
          return;
        }
        l--;
      } else if (t === "$" || t === "$?" || t === "$~" || t === "$!" || t === "&") l++;else if (t === "html") yn(e.ownerDocument.documentElement);else if (t === "head") {
        t = e.ownerDocument.head, yn(t);
        for (var r = t.firstChild; r;) {
          var n = r.nextSibling,
            u = r.nodeName;
          r[Fn] || u === "SCRIPT" || u === "STYLE" || u === "LINK" && r.rel.toLowerCase() === "stylesheet" || t.removeChild(r), r = n;
        }
      } else t === "body" && yn(e.ownerDocument.body);
      t = o;
    } while (t);
    yr(a);
  }
  function km(e, a) {
    var t = e;
    e = 0;
    do {
      var l = t.nextSibling;
      if (t.nodeType === 1 ? a ? (t._stashedDisplay = t.style.display, t.style.display = "none") : (t.style.display = t._stashedDisplay || "", t.getAttribute("style") === "" && t.removeAttribute("style")) : t.nodeType === 3 && (a ? (t._stashedText = t.nodeValue, t.nodeValue = "") : t.nodeValue = t._stashedText || ""), l && l.nodeType === 8) if (t = l.data, t === "/$") {
        if (e === 0) break;
        e--;
      } else t !== "$" && t !== "$?" && t !== "$~" && t !== "$!" || e++;
      t = l;
    } while (t);
  }
  function wc(e) {
    var a = e.firstChild;
    for (a && a.nodeType === 10 && (a = a.nextSibling); a;) {
      var t = a;
      switch (a = a.nextSibling, t.nodeName) {
        case "HTML":
        case "HEAD":
        case "BODY":
          wc(t), Bc(t);
          continue;
        case "SCRIPT":
        case "STYLE":
          continue;
        case "LINK":
          if (t.rel.toLowerCase() === "stylesheet") continue;
      }
      e.removeChild(t);
    }
  }
  function vy(e, a, t, l) {
    for (; e.nodeType === 1;) {
      var o = t;
      if (e.nodeName.toLowerCase() !== a.toLowerCase()) {
        if (!l && (e.nodeName !== "INPUT" || e.type !== "hidden")) break;
      } else if (l) {
        if (!e[Fn]) switch (a) {
          case "meta":
            if (!e.hasAttribute("itemprop")) break;
            return e;
          case "link":
            if (r = e.getAttribute("rel"), r === "stylesheet" && e.hasAttribute("data-precedence")) break;
            if (r !== o.rel || e.getAttribute("href") !== (o.href == null || o.href === "" ? null : o.href) || e.getAttribute("crossorigin") !== (o.crossOrigin == null ? null : o.crossOrigin) || e.getAttribute("title") !== (o.title == null ? null : o.title)) break;
            return e;
          case "style":
            if (e.hasAttribute("data-precedence")) break;
            return e;
          case "script":
            if (r = e.getAttribute("src"), (r !== (o.src == null ? null : o.src) || e.getAttribute("type") !== (o.type == null ? null : o.type) || e.getAttribute("crossorigin") !== (o.crossOrigin == null ? null : o.crossOrigin)) && r && e.hasAttribute("async") && !e.hasAttribute("itemprop")) break;
            return e;
          default:
            return e;
        }
      } else if (a === "input" && e.type === "hidden") {
        var r = o.name == null ? null : "" + o.name;
        if (o.type === "hidden" && e.getAttribute("name") === r) return e;
      } else return e;
      if (e = lt(e.nextSibling), e === null) break;
    }
    return null;
  }
  function yy(e, a, t) {
    if (a === "") return null;
    for (; e.nodeType !== 3;) if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !t || (e = lt(e.nextSibling), e === null)) return null;
    return e;
  }
  function px(e, a) {
    for (; e.nodeType !== 8;) if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !a || (e = lt(e.nextSibling), e === null)) return null;
    return e;
  }
  function Cc(e) {
    return e.data === "$?" || e.data === "$~";
  }
  function Sc(e) {
    return e.data === "$!" || e.data === "$?" && e.ownerDocument.readyState !== "loading";
  }
  function Ly(e, a) {
    var t = e.ownerDocument;
    if (e.data === "$~") e._reactRetry = a;else if (e.data !== "$?" || t.readyState !== "loading") a();else {
      var l = function () {
        a(), t.removeEventListener("DOMContentLoaded", l);
      };
      t.addEventListener("DOMContentLoaded", l), e._reactRetry = l;
    }
  }
  function lt(e) {
    for (; e != null; e = e.nextSibling) {
      var a = e.nodeType;
      if (a === 1 || a === 3) break;
      if (a === 8) {
        if (a = e.data, a === "$" || a === "$!" || a === "$?" || a === "$~" || a === "&" || a === "F!" || a === "F") break;
        if (a === "/$" || a === "/&") return null;
      }
    }
    return e;
  }
  var kc = null;
  function Im(e) {
    e = e.nextSibling;
    for (var a = 0; e;) {
      if (e.nodeType === 8) {
        var t = e.data;
        if (t === "/$" || t === "/&") {
          if (a === 0) return lt(e.nextSibling);
          a--;
        } else t !== "$" && t !== "$!" && t !== "$?" && t !== "$~" && t !== "&" || a++;
      }
      e = e.nextSibling;
    }
    return null;
  }
  function Am(e) {
    e = e.previousSibling;
    for (var a = 0; e;) {
      if (e.nodeType === 8) {
        var t = e.data;
        if (t === "$" || t === "$!" || t === "$?" || t === "$~" || t === "&") {
          if (a === 0) return e;
          a--;
        } else t !== "/$" && t !== "/&" || a++;
      }
      e = e.previousSibling;
    }
    return null;
  }
  function mx(e, a, t) {
    switch (a = Xs(t), e) {
      case "html":
        if (e = a.documentElement, !e) throw Error(k(452));
        return e;
      case "head":
        if (e = a.head, !e) throw Error(k(453));
        return e;
      case "body":
        if (e = a.body, !e) throw Error(k(454));
        return e;
      default:
        throw Error(k(451));
    }
  }
  function yn(e) {
    for (var a = e.attributes; a.length;) e.removeAttributeNode(a[0]);
    Bc(e);
  }
  var ot = new Map(),
    Mm = new Set();
  function js(e) {
    return typeof e.getRootNode == "function" ? e.getRootNode() : e.nodeType === 9 ? e : e.ownerDocument;
  }
  var Zt = ge.d;
  ge.d = {
    f: wy,
    r: Cy,
    D: Sy,
    C: ky,
    L: Iy,
    m: Ay,
    X: Ny,
    S: My,
    M: Ty
  };
  function wy() {
    var e = Zt.f(),
      a = ii();
    return e || a;
  }
  function Cy(e) {
    var a = wr(e);
    a !== null && a.tag === 5 && a.type === "form" ? uh(a) : Zt.r(e);
  }
  var Ir = typeof document > "u" ? null : document;
  function gx(e, a, t) {
    var l = Ir;
    if (l && typeof a == "string" && a) {
      var o = $a(a);
      o = 'link[rel="' + e + '"][href="' + o + '"]', typeof t == "string" && (o += '[crossorigin="' + t + '"]'), Mm.has(o) || (Mm.add(o), e = {
        rel: e,
        crossOrigin: t,
        href: a
      }, l.querySelector(o) === null && (a = l.createElement("link"), ma(a, "link", e), ua(a), l.head.appendChild(a)));
    }
  }
  function Sy(e) {
    Zt.D(e), gx("dns-prefetch", e, null);
  }
  function ky(e, a) {
    Zt.C(e, a), gx("preconnect", e, a);
  }
  function Iy(e, a, t) {
    Zt.L(e, a, t);
    var l = Ir;
    if (l && e && a) {
      var o = 'link[rel="preload"][as="' + $a(a) + '"]';
      a === "image" && t && t.imageSrcSet ? (o += '[imagesrcset="' + $a(t.imageSrcSet) + '"]', typeof t.imageSizes == "string" && (o += '[imagesizes="' + $a(t.imageSizes) + '"]')) : o += '[href="' + $a(e) + '"]';
      var r = o;
      switch (a) {
        case "style":
          r = vr(e);
          break;
        case "script":
          r = Ar(e);
      }
      ot.has(r) || (e = Be({
        rel: "preload",
        href: a === "image" && t && t.imageSrcSet ? void 0 : e,
        as: a
      }, t), ot.set(r, e), l.querySelector(o) !== null || a === "style" && l.querySelector(Xn(r)) || a === "script" && l.querySelector(jn(r)) || (a = l.createElement("link"), ma(a, "link", e), ua(a), l.head.appendChild(a)));
    }
  }
  function Ay(e, a) {
    Zt.m(e, a);
    var t = Ir;
    if (t && e) {
      var l = a && typeof a.as == "string" ? a.as : "script",
        o = 'link[rel="modulepreload"][as="' + $a(l) + '"][href="' + $a(e) + '"]',
        r = o;
      switch (l) {
        case "audioworklet":
        case "paintworklet":
        case "serviceworker":
        case "sharedworker":
        case "worker":
        case "script":
          r = Ar(e);
      }
      if (!ot.has(r) && (e = Be({
        rel: "modulepreload",
        href: e
      }, a), ot.set(r, e), t.querySelector(o) === null)) {
        switch (l) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            if (t.querySelector(jn(r))) return;
        }
        l = t.createElement("link"), ma(l, "link", e), ua(l), t.head.appendChild(l);
      }
    }
  }
  function My(e, a, t) {
    Zt.S(e, a, t);
    var l = Ir;
    if (l && e) {
      var o = lr(l).hoistableStyles,
        r = vr(e);
      a = a || "default";
      var n = o.get(r);
      if (!n) {
        var u = {
          loading: 0,
          preload: null
        };
        if (n = l.querySelector(Xn(r))) u.loading = 5;else {
          e = Be({
            rel: "stylesheet",
            href: e,
            "data-precedence": a
          }, t), (t = ot.get(r)) && vf(e, t);
          var s = n = l.createElement("link");
          ua(s), ma(s, "link", e), s._p = new Promise(function (i, d) {
            s.onload = i, s.onerror = d;
          }), s.addEventListener("load", function () {
            u.loading |= 1;
          }), s.addEventListener("error", function () {
            u.loading |= 2;
          }), u.loading |= 4, bs(n, a, l);
        }
        n = {
          type: "stylesheet",
          instance: n,
          count: 1,
          state: u
        }, o.set(r, n);
      }
    }
  }
  function Ny(e, a) {
    Zt.X(e, a);
    var t = Ir;
    if (t && e) {
      var l = lr(t).hoistableScripts,
        o = Ar(e),
        r = l.get(o);
      r || (r = t.querySelector(jn(o)), r || (e = Be({
        src: e,
        async: !0
      }, a), (a = ot.get(o)) && yf(e, a), r = t.createElement("script"), ua(r), ma(r, "link", e), t.head.appendChild(r)), r = {
        type: "script",
        instance: r,
        count: 1,
        state: null
      }, l.set(o, r));
    }
  }
  function Ty(e, a) {
    Zt.M(e, a);
    var t = Ir;
    if (t && e) {
      var l = lr(t).hoistableScripts,
        o = Ar(e),
        r = l.get(o);
      r || (r = t.querySelector(jn(o)), r || (e = Be({
        src: e,
        async: !0,
        type: "module"
      }, a), (a = ot.get(o)) && yf(e, a), r = t.createElement("script"), ua(r), ma(r, "link", e), t.head.appendChild(r)), r = {
        type: "script",
        instance: r,
        count: 1,
        state: null
      }, l.set(o, r));
    }
  }
  function Nm(e, a, t, l) {
    var o = (o = yl.current) ? js(o) : null;
    if (!o) throw Error(k(446));
    switch (e) {
      case "meta":
      case "title":
        return null;
      case "style":
        return typeof t.precedence == "string" && typeof t.href == "string" ? (a = vr(t.href), t = lr(o).hoistableStyles, l = t.get(a), l || (l = {
          type: "style",
          instance: null,
          count: 0,
          state: null
        }, t.set(a, l)), l) : {
          type: "void",
          instance: null,
          count: 0,
          state: null
        };
      case "link":
        if (t.rel === "stylesheet" && typeof t.href == "string" && typeof t.precedence == "string") {
          e = vr(t.href);
          var r = lr(o).hoistableStyles,
            n = r.get(e);
          if (n || (o = o.ownerDocument || o, n = {
            type: "stylesheet",
            instance: null,
            count: 0,
            state: {
              loading: 0,
              preload: null
            }
          }, r.set(e, n), (r = o.querySelector(Xn(e))) && !r._p && (n.instance = r, n.state.loading = 5), ot.has(e) || (t = {
            rel: "preload",
            as: "style",
            href: t.href,
            crossOrigin: t.crossOrigin,
            integrity: t.integrity,
            media: t.media,
            hrefLang: t.hrefLang,
            referrerPolicy: t.referrerPolicy
          }, ot.set(e, t), r || Dy(o, e, t, n.state))), a && l === null) throw Error(k(528, ""));
          return n;
        }
        if (a && l !== null) throw Error(k(529, ""));
        return null;
      case "script":
        return a = t.async, t = t.src, typeof t == "string" && a && typeof a != "function" && typeof a != "symbol" ? (a = Ar(t), t = lr(o).hoistableScripts, l = t.get(a), l || (l = {
          type: "script",
          instance: null,
          count: 0,
          state: null
        }, t.set(a, l)), l) : {
          type: "void",
          instance: null,
          count: 0,
          state: null
        };
      default:
        throw Error(k(444, e));
    }
  }
  function vr(e) {
    return 'href="' + $a(e) + '"';
  }
  function Xn(e) {
    return 'link[rel="stylesheet"][' + e + "]";
  }
  function hx(e) {
    return Be({}, e, {
      "data-precedence": e.precedence,
      precedence: null
    });
  }
  function Dy(e, a, t, l) {
    e.querySelector('link[rel="preload"][as="style"][' + a + "]") ? l.loading = 1 : (a = e.createElement("link"), l.preload = a, a.addEventListener("load", function () {
      return l.loading |= 1;
    }), a.addEventListener("error", function () {
      return l.loading |= 2;
    }), ma(a, "link", t), ua(a), e.head.appendChild(a));
  }
  function Ar(e) {
    return '[src="' + $a(e) + '"]';
  }
  function jn(e) {
    return "script[async]" + e;
  }
  function Tm(e, a, t) {
    if (a.count++, a.instance === null) switch (a.type) {
      case "style":
        var l = e.querySelector('style[data-href~="' + $a(t.href) + '"]');
        if (l) return a.instance = l, ua(l), l;
        var o = Be({}, t, {
          "data-href": t.href,
          "data-precedence": t.precedence,
          href: null,
          precedence: null
        });
        return l = (e.ownerDocument || e).createElement("style"), ua(l), ma(l, "style", o), bs(l, t.precedence, e), a.instance = l;
      case "stylesheet":
        o = vr(t.href);
        var r = e.querySelector(Xn(o));
        if (r) return a.state.loading |= 4, a.instance = r, ua(r), r;
        l = hx(t), (o = ot.get(o)) && vf(l, o), r = (e.ownerDocument || e).createElement("link"), ua(r);
        var n = r;
        return n._p = new Promise(function (u, s) {
          n.onload = u, n.onerror = s;
        }), ma(r, "link", l), a.state.loading |= 4, bs(r, t.precedence, e), a.instance = r;
      case "script":
        return r = Ar(t.src), (o = e.querySelector(jn(r))) ? (a.instance = o, ua(o), o) : (l = t, (o = ot.get(r)) && (l = Be({}, t), yf(l, o)), e = e.ownerDocument || e, o = e.createElement("script"), ua(o), ma(o, "link", l), e.head.appendChild(o), a.instance = o);
      case "void":
        return null;
      default:
        throw Error(k(443, a.type));
    } else a.type === "stylesheet" && (a.state.loading & 4) === 0 && (l = a.instance, a.state.loading |= 4, bs(l, t.precedence, e));
    return a.instance;
  }
  function bs(e, a, t) {
    for (var l = t.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'), o = l.length ? l[l.length - 1] : null, r = o, n = 0; n < l.length; n++) {
      var u = l[n];
      if (u.dataset.precedence === a) r = u;else if (r !== o) break;
    }
    r ? r.parentNode.insertBefore(e, r.nextSibling) : (a = t.nodeType === 9 ? t.head : t, a.insertBefore(e, a.firstChild));
  }
  function vf(e, a) {
    e.crossOrigin == null && (e.crossOrigin = a.crossOrigin), e.referrerPolicy == null && (e.referrerPolicy = a.referrerPolicy), e.title == null && (e.title = a.title);
  }
  function yf(e, a) {
    e.crossOrigin == null && (e.crossOrigin = a.crossOrigin), e.referrerPolicy == null && (e.referrerPolicy = a.referrerPolicy), e.integrity == null && (e.integrity = a.integrity);
  }
  var vs = null;
  function Dm(e, a, t) {
    if (vs === null) {
      var l = new Map(),
        o = vs = new Map();
      o.set(t, l);
    } else o = vs, l = o.get(t), l || (l = new Map(), o.set(t, l));
    if (l.has(e)) return l;
    for (l.set(e, null), t = t.getElementsByTagName(e), o = 0; o < t.length; o++) {
      var r = t[o];
      if (!(r[Fn] || r[ca] || e === "link" && r.getAttribute("rel") === "stylesheet") && r.namespaceURI !== "http://www.w3.org/2000/svg") {
        var n = r.getAttribute(a) || "";
        n = e + n;
        var u = l.get(n);
        u ? u.push(r) : l.set(n, [r]);
      }
    }
    return l;
  }
  function Rm(e, a, t) {
    e = e.ownerDocument || e, e.head.insertBefore(t, a === "title" ? e.querySelector("head > title") : null);
  }
  function Ry(e, a, t) {
    if (t === 1 || a.itemProp != null) return !1;
    switch (e) {
      case "meta":
      case "title":
        return !0;
      case "style":
        if (typeof a.precedence != "string" || typeof a.href != "string" || a.href === "") break;
        return !0;
      case "link":
        if (typeof a.rel != "string" || typeof a.href != "string" || a.href === "" || a.onLoad || a.onError) break;
        return a.rel === "stylesheet" ? (e = a.disabled, typeof a.precedence == "string" && e == null) : !0;
      case "script":
        if (a.async && typeof a.async != "function" && typeof a.async != "symbol" && !a.onLoad && !a.onError && a.src && typeof a.src == "string") return !0;
    }
    return !1;
  }
  function xx(e) {
    return !(e.type === "stylesheet" && (e.state.loading & 3) === 0);
  }
  function By(e, a, t, l) {
    if (t.type === "stylesheet" && (typeof l.media != "string" || matchMedia(l.media).matches !== !1) && (t.state.loading & 4) === 0) {
      if (t.instance === null) {
        var o = vr(l.href),
          r = a.querySelector(Xn(o));
        if (r) {
          a = r._p, a !== null && typeof a == "object" && typeof a.then == "function" && (e.count++, e = Zs.bind(e), a.then(e, e)), t.state.loading |= 4, t.instance = r, ua(r);
          return;
        }
        r = a.ownerDocument || a, l = hx(l), (o = ot.get(o)) && vf(l, o), r = r.createElement("link"), ua(r);
        var n = r;
        n._p = new Promise(function (u, s) {
          n.onload = u, n.onerror = s;
        }), ma(r, "link", l), t.instance = r;
      }
      e.stylesheets === null && (e.stylesheets = new Map()), e.stylesheets.set(t, a), (a = t.state.preload) && (t.state.loading & 3) === 0 && (e.count++, t = Zs.bind(e), a.addEventListener("load", t), a.addEventListener("error", t));
    }
  }
  var Rd = 0;
  function Oy(e, a) {
    return e.stylesheets && e.count === 0 && ys(e, e.stylesheets), 0 < e.count || 0 < e.imgCount ? function (t) {
      var l = setTimeout(function () {
        if (e.stylesheets && ys(e, e.stylesheets), e.unsuspend) {
          var r = e.unsuspend;
          e.unsuspend = null, r();
        }
      }, 6e4 + a);
      0 < e.imgBytes && Rd === 0 && (Rd = 62500 * my());
      var o = setTimeout(function () {
        if (e.waitingForImages = !1, e.count === 0 && (e.stylesheets && ys(e, e.stylesheets), e.unsuspend)) {
          var r = e.unsuspend;
          e.unsuspend = null, r();
        }
      }, (e.imgBytes > Rd ? 50 : 800) + a);
      return e.unsuspend = t, function () {
        e.unsuspend = null, clearTimeout(l), clearTimeout(o);
      };
    } : null;
  }
  function Zs() {
    if (this.count--, this.count === 0 && (this.imgCount === 0 || !this.waitingForImages)) {
      if (this.stylesheets) ys(this, this.stylesheets);else if (this.unsuspend) {
        var e = this.unsuspend;
        this.unsuspend = null, e();
      }
    }
  }
  var Ys = null;
  function ys(e, a) {
    e.stylesheets = null, e.unsuspend !== null && (e.count++, Ys = new Map(), a.forEach(Ey, e), Ys = null, Zs.call(e));
  }
  function Ey(e, a) {
    if (!(a.state.loading & 4)) {
      var t = Ys.get(e);
      if (t) var l = t.get(null);else {
        t = new Map(), Ys.set(e, t);
        for (var o = e.querySelectorAll("link[data-precedence],style[data-precedence]"), r = 0; r < o.length; r++) {
          var n = o[r];
          (n.nodeName === "LINK" || n.getAttribute("media") !== "not all") && (t.set(n.dataset.precedence, n), l = n);
        }
        l && t.set(null, l);
      }
      o = a.instance, n = o.getAttribute("data-precedence"), r = t.get(n) || l, r === l && t.set(null, o), t.set(n, o), this.count++, l = Zs.bind(this), o.addEventListener("load", l), o.addEventListener("error", l), r ? r.parentNode.insertBefore(o, r.nextSibling) : (e = e.nodeType === 9 ? e.head : e, e.insertBefore(o, e.firstChild)), a.state.loading |= 4;
    }
  }
  var Rn = {
    $$typeof: zt,
    Provider: null,
    Consumer: null,
    _currentValue: ao,
    _currentValue2: ao,
    _threadCount: 0
  };
  function zy(e, a, t, l, o, r, n, u, s) {
    this.tag = 1, this.containerInfo = e, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = od(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = od(0), this.hiddenUpdates = od(null), this.identifierPrefix = l, this.onUncaughtError = o, this.onCaughtError = r, this.onRecoverableError = n, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = s, this.incompleteTransitions = new Map();
  }
  function bx(e, a, t, l, o, r, n, u, s, i, d, x) {
    return e = new zy(e, a, t, n, s, i, d, x, u), a = 1, r === !0 && (a |= 24), r = qa(3, null, null, a), e.current = r, r.stateNode = e, a = Xc(), a.refCount++, e.pooledCache = a, a.refCount++, r.memoizedState = {
      element: l,
      isDehydrated: t,
      cache: a
    }, Yc(r), e;
  }
  function vx(e) {
    return e ? (e = $o, e) : $o;
  }
  function yx(e, a, t, l, o, r) {
    o = vx(o), l.context === null ? l.context = o : l.pendingContext = o, l = wl(a), l.payload = {
      element: t
    }, r = r === void 0 ? null : r, r !== null && (l.callback = r), t = Cl(e, l, a), t !== null && (Ta(t, e, a), fn(t, e, a));
  }
  function Bm(e, a) {
    if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
      var t = e.retryLane;
      e.retryLane = t !== 0 && t < a ? t : a;
    }
  }
  function Lf(e, a) {
    Bm(e, a), (e = e.alternate) && Bm(e, a);
  }
  function Lx(e) {
    if (e.tag === 13 || e.tag === 31) {
      var a = go(e, 67108864);
      a !== null && Ta(a, e, 67108864), Lf(e, 67108864);
    }
  }
  function Om(e) {
    if (e.tag === 13 || e.tag === 31) {
      var a = Ga();
      a = Dc(a);
      var t = go(e, a);
      t !== null && Ta(t, e, a), Lf(e, a);
    }
  }
  var Ks = !0;
  function Uy(e, a, t, l) {
    var o = Y.T;
    Y.T = null;
    var r = ge.p;
    try {
      ge.p = 2, wf(e, a, t, l);
    } finally {
      ge.p = r, Y.T = o;
    }
  }
  function qy(e, a, t, l) {
    var o = Y.T;
    Y.T = null;
    var r = ge.p;
    try {
      ge.p = 8, wf(e, a, t, l);
    } finally {
      ge.p = r, Y.T = o;
    }
  }
  function wf(e, a, t, l) {
    if (Ks) {
      var o = Ic(l);
      if (o === null) Td(e, a, l, Qs, t), Em(e, l);else if (Py(o, e, a, t, l)) l.stopPropagation();else if (Em(e, l), a & 4 && -1 < Fy.indexOf(e)) {
        for (; o !== null;) {
          var r = wr(o);
          if (r !== null) switch (r.tag) {
            case 3:
              if (r = r.stateNode, r.current.memoizedState.isDehydrated) {
                var n = Jl(r.pendingLanes);
                if (n !== 0) {
                  var u = r;
                  for (u.pendingLanes |= 2, u.entangledLanes |= 2; n;) {
                    var s = 1 << 31 - _a(n);
                    u.entanglements[1] |= s, n &= ~s;
                  }
                  wt(r), (me & 6) === 0 && (Fs = Pa() + 500, Vn(0, !1));
                }
              }
              break;
            case 31:
            case 13:
              u = go(r, 2), u !== null && Ta(u, r, 2), ii(), Lf(r, 2);
          }
          if (r = Ic(l), r === null && Td(e, a, l, Qs, t), r === o) break;
          o = r;
        }
        o !== null && l.stopPropagation();
      } else Td(e, a, l, null, t);
    }
  }
  function Ic(e) {
    return e = Ec(e), Cf(e);
  }
  var Qs = null;
  function Cf(e) {
    if (Qs = null, e = Zo(e), e !== null) {
      var a = En(e);
      if (a === null) e = null;else {
        var t = a.tag;
        if (t === 13) {
          if (e = Hm(a), e !== null) return e;
          e = null;
        } else if (t === 31) {
          if (e = _m(a), e !== null) return e;
          e = null;
        } else if (t === 3) {
          if (a.stateNode.current.memoizedState.isDehydrated) return a.tag === 3 ? a.stateNode.containerInfo : null;
          e = null;
        } else a !== e && (e = null);
      }
    }
    return Qs = e, null;
  }
  function wx(e) {
    switch (e) {
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
        switch (Iv()) {
          case jm:
            return 2;
          case Zm:
            return 8;
          case ks:
          case Av:
            return 32;
          case Ym:
            return 268435456;
          default:
            return 32;
        }
      default:
        return 32;
    }
  }
  var Ac = !1,
    Il = null,
    Al = null,
    Ml = null,
    Bn = new Map(),
    On = new Map(),
    ml = [],
    Fy = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");
  function Em(e, a) {
    switch (e) {
      case "focusin":
      case "focusout":
        Il = null;
        break;
      case "dragenter":
      case "dragleave":
        Al = null;
        break;
      case "mouseover":
      case "mouseout":
        Ml = null;
        break;
      case "pointerover":
      case "pointerout":
        Bn.delete(a.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        On.delete(a.pointerId);
    }
  }
  function en(e, a, t, l, o, r) {
    return e === null || e.nativeEvent !== r ? (e = {
      blockedOn: a,
      domEventName: t,
      eventSystemFlags: l,
      nativeEvent: r,
      targetContainers: [o]
    }, a !== null && (a = wr(a), a !== null && Lx(a)), e) : (e.eventSystemFlags |= l, a = e.targetContainers, o !== null && a.indexOf(o) === -1 && a.push(o), e);
  }
  function Py(e, a, t, l, o) {
    switch (a) {
      case "focusin":
        return Il = en(Il, e, a, t, l, o), !0;
      case "dragenter":
        return Al = en(Al, e, a, t, l, o), !0;
      case "mouseover":
        return Ml = en(Ml, e, a, t, l, o), !0;
      case "pointerover":
        var r = o.pointerId;
        return Bn.set(r, en(Bn.get(r) || null, e, a, t, l, o)), !0;
      case "gotpointercapture":
        return r = o.pointerId, On.set(r, en(On.get(r) || null, e, a, t, l, o)), !0;
    }
    return !1;
  }
  function Cx(e) {
    var a = Zo(e.target);
    if (a !== null) {
      var t = En(a);
      if (t !== null) {
        if (a = t.tag, a === 13) {
          if (a = Hm(t), a !== null) {
            e.blockedOn = a, bp(e.priority, function () {
              Om(t);
            });
            return;
          }
        } else if (a === 31) {
          if (a = _m(t), a !== null) {
            e.blockedOn = a, bp(e.priority, function () {
              Om(t);
            });
            return;
          }
        } else if (a === 3 && t.stateNode.current.memoizedState.isDehydrated) {
          e.blockedOn = t.tag === 3 ? t.stateNode.containerInfo : null;
          return;
        }
      }
    }
    e.blockedOn = null;
  }
  function Ls(e) {
    if (e.blockedOn !== null) return !1;
    for (var a = e.targetContainers; 0 < a.length;) {
      var t = Ic(e.nativeEvent);
      if (t === null) {
        t = e.nativeEvent;
        var l = new t.constructor(t.type, t);
        Xd = l, t.target.dispatchEvent(l), Xd = null;
      } else return a = wr(t), a !== null && Lx(a), e.blockedOn = t, !1;
      a.shift();
    }
    return !0;
  }
  function zm(e, a, t) {
    Ls(e) && t.delete(a);
  }
  function Hy() {
    Ac = !1, Il !== null && Ls(Il) && (Il = null), Al !== null && Ls(Al) && (Al = null), Ml !== null && Ls(Ml) && (Ml = null), Bn.forEach(zm), On.forEach(zm);
  }
  function rs(e, a) {
    e.blockedOn === a && (e.blockedOn = null, Ac || (Ac = !0, la.unstable_scheduleCallback(la.unstable_NormalPriority, Hy)));
  }
  var ns = null;
  function Um(e) {
    ns !== e && (ns = e, la.unstable_scheduleCallback(la.unstable_NormalPriority, function () {
      ns === e && (ns = null);
      for (var a = 0; a < e.length; a += 3) {
        var t = e[a],
          l = e[a + 1],
          o = e[a + 2];
        if (typeof l != "function") {
          if (Cf(l || t) === null) continue;
          break;
        }
        var r = wr(t);
        r !== null && (e.splice(a, 3), a -= 3, uc(r, {
          pending: !0,
          data: o,
          method: t.method,
          action: l
        }, l, o));
      }
    }));
  }
  function yr(e) {
    function a(s) {
      return rs(s, e);
    }
    Il !== null && rs(Il, e), Al !== null && rs(Al, e), Ml !== null && rs(Ml, e), Bn.forEach(a), On.forEach(a);
    for (var t = 0; t < ml.length; t++) {
      var l = ml[t];
      l.blockedOn === e && (l.blockedOn = null);
    }
    for (; 0 < ml.length && (t = ml[0], t.blockedOn === null);) Cx(t), t.blockedOn === null && ml.shift();
    if (t = (e.ownerDocument || e).$$reactFormReplay, t != null) for (l = 0; l < t.length; l += 3) {
      var o = t[l],
        r = t[l + 1],
        n = o[Da] || null;
      if (typeof r == "function") n || Um(t);else if (n) {
        var u = null;
        if (r && r.hasAttribute("formAction")) {
          if (o = r, n = r[Da] || null) u = n.formAction;else if (Cf(o) !== null) continue;
        } else u = n.action;
        typeof u == "function" ? t[l + 1] = u : (t.splice(l, 3), l -= 3), Um(t);
      }
    }
  }
  function Sx() {
    function e(r) {
      r.canIntercept && r.info === "react-transition" && r.intercept({
        handler: function () {
          return new Promise(function (n) {
            return o = n;
          });
        },
        focusReset: "manual",
        scroll: "manual"
      });
    }
    function a() {
      o !== null && (o(), o = null), l || setTimeout(t, 20);
    }
    function t() {
      if (!l && !navigation.transition) {
        var r = navigation.currentEntry;
        r && r.url != null && navigation.navigate(r.url, {
          state: r.getState(),
          info: "react-transition",
          history: "replace"
        });
      }
    }
    if (typeof navigation == "object") {
      var l = !1,
        o = null;
      return navigation.addEventListener("navigate", e), navigation.addEventListener("navigatesuccess", a), navigation.addEventListener("navigateerror", a), setTimeout(t, 100), function () {
        l = !0, navigation.removeEventListener("navigate", e), navigation.removeEventListener("navigatesuccess", a), navigation.removeEventListener("navigateerror", a), o !== null && (o(), o = null);
      };
    }
  }
  function Sf(e) {
    this._internalRoot = e;
  }
  fi.prototype.render = Sf.prototype.render = function (e) {
    var a = this._internalRoot;
    if (a === null) throw Error(k(409));
    var t = a.current,
      l = Ga();
    yx(t, l, e, a, null, null);
  };
  fi.prototype.unmount = Sf.prototype.unmount = function () {
    var e = this._internalRoot;
    if (e !== null) {
      this._internalRoot = null;
      var a = e.containerInfo;
      yx(e.current, 2, null, e, null, null), ii(), a[Lr] = null;
    }
  };
  function fi(e) {
    this._internalRoot = e;
  }
  fi.prototype.unstable_scheduleHydration = function (e) {
    if (e) {
      var a = $m();
      e = {
        blockedOn: null,
        target: e,
        priority: a
      };
      for (var t = 0; t < ml.length && a !== 0 && a < ml[t].priority; t++);
      ml.splice(t, 0, e), t === 0 && Cx(e);
    }
  };
  var qm = Fm.version;
  if (qm !== "19.2.8") throw Error(k(527, qm, "19.2.8"));
  ge.findDOMNode = function (e) {
    var a = e._reactInternals;
    if (a === void 0) throw typeof e.render == "function" ? Error(k(188)) : (e = Object.keys(e).join(","), Error(k(268, e)));
    return e = vv(a), e = e !== null ? Gm(e) : null, e = e === null ? null : e.stateNode, e;
  };
  var _y = {
    bundleType: 0,
    version: "19.2.8",
    rendererPackageName: "react-dom",
    currentDispatcherRef: Y,
    reconcilerVersion: "19.2.8"
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && (an = __REACT_DEVTOOLS_GLOBAL_HOOK__, !an.isDisabled && an.supportsFiber)) try {
    zn = an.inject(_y), Ha = an;
  } catch {}
  var an;
  pi.createRoot = function (e, a) {
    if (!Pm(e)) throw Error(k(299));
    var t = !1,
      l = "",
      o = gh,
      r = hh,
      n = xh;
    return a != null && (a.unstable_strictMode === !0 && (t = !0), a.identifierPrefix !== void 0 && (l = a.identifierPrefix), a.onUncaughtError !== void 0 && (o = a.onUncaughtError), a.onCaughtError !== void 0 && (r = a.onCaughtError), a.onRecoverableError !== void 0 && (n = a.onRecoverableError)), a = bx(e, 1, !1, null, null, t, l, null, o, r, n, Sx), e[Lr] = a.current, bf(e), new Sf(a);
  };
  pi.hydrateRoot = function (e, a, t) {
    if (!Pm(e)) throw Error(k(299));
    var l = !1,
      o = "",
      r = gh,
      n = hh,
      u = xh,
      s = null;
    return t != null && (t.unstable_strictMode === !0 && (l = !0), t.identifierPrefix !== void 0 && (o = t.identifierPrefix), t.onUncaughtError !== void 0 && (r = t.onUncaughtError), t.onCaughtError !== void 0 && (n = t.onCaughtError), t.onRecoverableError !== void 0 && (u = t.onRecoverableError), t.formState !== void 0 && (s = t.formState)), a = bx(e, 1, !0, a, t ?? null, l, o, s, r, n, u, Sx), a.context = vx(null), t = a.current, l = Ga(), l = Dc(l), o = wl(l), o.callback = null, Cl(t, o, l), t = l, a.current.lanes = t, qn(a, t), wt(a), e[Lr] = a.current, bf(e), new fi(a);
  };
  pi.version = "19.2.8";
});
var Mx = gt((Aw, Ax) => {
  "use strict";

  function Ix() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function")) try {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(Ix);
    } catch (e) {
      console.error(e);
    }
  }
  Ix(), Ax.exports = kx();
});
var rb = gt(yi => {
  "use strict";

  var R1 = Symbol.for("react.transitional.element"),
    B1 = Symbol.for("react.fragment");
  function ob(e, a, t) {
    var l = null;
    if (t !== void 0 && (l = "" + t), a.key !== void 0 && (l = "" + a.key), "key" in a) {
      t = {};
      for (var o in a) o !== "key" && (t[o] = a[o]);
    } else t = a;
    return a = t.ref, {
      $$typeof: R1,
      type: e,
      key: l,
      ref: a !== void 0 ? a : null,
      props: t
    };
  }
  yi.Fragment = B1;
  yi.jsx = ob;
  yi.jsxs = ob;
});
var Q = gt((Wk, nb) => {
  "use strict";

  nb.exports = rb();
});
// ReactDOMClient (minified: _b) — ──── Library: lucide-react v1.31.0 (core + icons) (bundled from npm; unchanged, names left minified) ────
var ReactDOMClient = V(Mx());
var ReactApp = V(Fe());
var hi = V(Fe(), 1);
var mi = (...e) => e.filter((a, t, l) => !!a && a.trim() !== "" && l.indexOf(a) === t).join(" ").trim();
var Nx = e => e.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
var Tx = e => e.replace(/^([A-Z])|[\s-_]+(\w)/g, (a, t, l) => l ? l.toUpperCase() : t.toLowerCase());
var kf = e => {
  let a = Tx(e);
  return a.charAt(0).toUpperCase() + a.slice(1);
};
var Zn = V(Fe(), 1);
var gi = {
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
var Dx = e => {
  for (let a in e) if (a.startsWith("aria-") || a === "role" || a === "title") return !0;
  return !1;
};
var Mr = V(Fe(), 1);
var Gy = (0, Mr.createContext)({});
var Rx = () => (0, Mr.useContext)(Gy);
var Bx = (0, Zn.forwardRef)(({
  color: e,
  size: a,
  strokeWidth: t,
  absoluteStrokeWidth: l,
  className: o = "",
  children: r,
  iconNode: n,
  ...u
}, s) => {
  let {
      size: i = 24,
      strokeWidth: d = 2,
      absoluteStrokeWidth: x = !1,
      color: m = "currentColor",
      className: g = ""
    } = Rx() ?? {},
    C = l ?? x ? Number(t ?? d) * 24 / Number(a ?? i) : t ?? d;
  return (0, Zn.createElement)("svg", {
    ref: s,
    ...gi,
    width: a ?? i ?? gi.width,
    height: a ?? i ?? gi.height,
    stroke: e ?? m,
    strokeWidth: C,
    className: mi("lucide", g, o),
    ...(!r && !Dx(u) && {
      "aria-hidden": "true"
    }),
    ...u
  }, [...n.map(([y, N]) => (0, Zn.createElement)(y, N)), ...(Array.isArray(r) ? r : [r])]);
});
var createLucideIcon = (e, a) => {
  let t = (0, hi.forwardRef)(({
    className: l,
    ...o
  }, r) => (0, hi.createElement)(Bx, {
    ref: r,
    iconNode: a,
    className: mi(`lucide-${Nx(kf(e))}`, `lucide-${e}`, l),
    ...o
  }));
  return t.displayName = kf(e), t;
};
var arrowLeftIconNode = [["path", {
    d: "m12 19-7-7 7-7",
    key: "1l729n"
  }], ["path", {
    d: "M19 12H5",
    key: "x3x0zl"
  }]],
  ArrowLeftIcon = createLucideIcon("arrow-left", arrowLeftIconNode);
var arrowRightIconNode = [["path", {
    d: "M5 12h14",
    key: "1ays0h"
  }], ["path", {
    d: "m12 5 7 7-7 7",
    key: "xquz4c"
  }]],
  ArrowRightIcon = createLucideIcon("arrow-right", arrowRightIconNode);
var boxesIconNode = [["path", {
    d: "M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5.5l-5-3-4.03 2.42Z",
    key: "lc1i9w"
  }], ["path", {
    d: "m7 16.5-4.74-2.85",
    key: "1o9zyk"
  }], ["path", {
    d: "m7 16.5 5-3",
    key: "va8pkn"
  }], ["path", {
    d: "M7 16.5v5.17",
    key: "jnp8gn"
  }], ["path", {
    d: "M12 13.5V19l3.97 2.38a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L17 10.5l-5 3Z",
    key: "8zsnat"
  }], ["path", {
    d: "m17 16.5-5-3",
    key: "8arw3v"
  }], ["path", {
    d: "m17 16.5 4.74-2.85",
    key: "8rfmw"
  }], ["path", {
    d: "M17 16.5v5.17",
    key: "k6z78m"
  }], ["path", {
    d: "M7.97 4.42A2 2 0 0 0 7 6.13v4.37l5 3 5-3V6.13a2 2 0 0 0-.97-1.71l-3-1.8a2 2 0 0 0-2.06 0l-3 1.8Z",
    key: "1xygjf"
  }], ["path", {
    d: "M12 8 7.26 5.15",
    key: "1vbdud"
  }], ["path", {
    d: "m12 8 4.74-2.85",
    key: "3rx089"
  }], ["path", {
    d: "M12 13.5V8",
    key: "1io7kd"
  }]],
  BoxesIcon = createLucideIcon("boxes", boxesIconNode);
var checkIconNode = [["path", {
    d: "M20 6 9 17l-5-5",
    key: "1gmf2c"
  }]],
  CheckIcon = createLucideIcon("check", checkIconNode);
var chevronDownIconNode = [["path", {
    d: "m6 9 6 6 6-6",
    key: "qrunsl"
  }]],
  ChevronDownIcon = createLucideIcon("chevron-down", chevronDownIconNode);
var chevronRightIconNode = [["path", {
    d: "m9 18 6-6-6-6",
    key: "mthhwq"
  }]],
  ChevronRightIcon = createLucideIcon("chevron-right", chevronRightIconNode);
var circleCheckIconNode = [["circle", {
    cx: "12",
    cy: "12",
    r: "10",
    key: "1mglay"
  }], ["path", {
    d: "m9 12 2 2 4-4",
    key: "dzmm74"
  }]],
  CircleCheckIcon = createLucideIcon("circle-check", circleCheckIconNode);
var circleIconNode = [["circle", {
    cx: "12",
    cy: "12",
    r: "10",
    key: "1mglay"
  }]],
  CircleIcon = createLucideIcon("circle", circleIconNode);
var clipboardPasteIconNode = [["path", {
    d: "M11 14h10",
    key: "1w8e9d"
  }], ["path", {
    d: "M16 4h2a2 2 0 0 1 2 2v1.344",
    key: "1e62lh"
  }], ["path", {
    d: "m17 18 4-4-4-4",
    key: "z2g111"
  }], ["path", {
    d: "M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 1.793-1.113",
    key: "bjbb7m"
  }], ["rect", {
    x: "8",
    y: "2",
    width: "8",
    height: "4",
    rx: "1",
    key: "ublpy"
  }]],
  ClipboardPasteIcon = createLucideIcon("clipboard-paste", clipboardPasteIconNode);
var clockIconNode = [["circle", {
    cx: "12",
    cy: "12",
    r: "10",
    key: "1mglay"
  }], ["path", {
    d: "M12 6v6l4 2",
    key: "mmk7yg"
  }]],
  ClockIcon = createLucideIcon("clock", clockIconNode);
var cloudOffIconNode = [["path", {
    d: "M10.94 5.274A7 7 0 0 1 15.71 10h1.79a4.5 4.5 0 0 1 4.222 6.057",
    key: "1uxyv8"
  }], ["path", {
    d: "M18.796 18.81A4.5 4.5 0 0 1 17.5 19H9A7 7 0 0 1 5.79 5.78",
    key: "99tcn7"
  }], ["path", {
    d: "m2 2 20 20",
    key: "1ooewy"
  }]],
  CloudOffIcon = createLucideIcon("cloud-off", cloudOffIconNode);
var cloudUploadIconNode = [["path", {
    d: "M12 13v8",
    key: "1l5pq0"
  }], ["path", {
    d: "M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242",
    key: "1pljnt"
  }], ["path", {
    d: "m8 17 4-4 4 4",
    key: "1quai1"
  }]],
  CloudUploadIcon = createLucideIcon("cloud-upload", cloudUploadIconNode);
var copyPlusIconNode = [["line", {
    x1: "15",
    x2: "15",
    y1: "12",
    y2: "18",
    key: "1p7wdc"
  }], ["line", {
    x1: "12",
    x2: "18",
    y1: "15",
    y2: "15",
    key: "1nscbv"
  }], ["rect", {
    width: "14",
    height: "14",
    x: "8",
    y: "8",
    rx: "2",
    ry: "2",
    key: "17jyea"
  }], ["path", {
    d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",
    key: "zix9uf"
  }]],
  CopyPlusIcon = createLucideIcon("copy-plus", copyPlusIconNode);
var copyIconNode = [["rect", {
    width: "14",
    height: "14",
    x: "8",
    y: "8",
    rx: "2",
    ry: "2",
    key: "17jyea"
  }], ["path", {
    d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",
    key: "zix9uf"
  }]],
  CopyIcon = createLucideIcon("copy", copyIconNode);
var externalLinkIconNode = [["path", {
    d: "M15 3h6v6",
    key: "1q9fwt"
  }], ["path", {
    d: "M10 14 21 3",
    key: "gplh6r"
  }], ["path", {
    d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",
    key: "a6xqqp"
  }]],
  ExternalLinkIcon = createLucideIcon("external-link", externalLinkIconNode);
var fileBracesIconNode = [["path", {
    d: "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",
    key: "1oefj6"
  }], ["path", {
    d: "M14 2v5a1 1 0 0 0 1 1h5",
    key: "wfsgrz"
  }], ["path", {
    d: "M10 12a1 1 0 0 0-1 1v1a1 1 0 0 1-1 1 1 1 0 0 1 1 1v1a1 1 0 0 0 1 1",
    key: "1oajmo"
  }], ["path", {
    d: "M14 18a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1 1 1 0 0 1-1-1v-1a1 1 0 0 0-1-1",
    key: "mpwhp6"
  }]],
  FileBracesIcon = createLucideIcon("file-braces", fileBracesIconNode);
var fileCodeCornerIconNode = [["path", {
    d: "M4 12.15V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.706.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2h-3.35",
    key: "1wthlu"
  }], ["path", {
    d: "M14 2v5a1 1 0 0 0 1 1h5",
    key: "wfsgrz"
  }], ["path", {
    d: "m5 16-3 3 3 3",
    key: "331omg"
  }], ["path", {
    d: "m9 22 3-3-3-3",
    key: "lsp7cz"
  }]],
  FileCodeCornerIcon = createLucideIcon("file-code-corner", fileCodeCornerIconNode);
var fileTextIconNode = [["path", {
    d: "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",
    key: "1oefj6"
  }], ["path", {
    d: "M14 2v5a1 1 0 0 0 1 1h5",
    key: "wfsgrz"
  }], ["path", {
    d: "M10 9H8",
    key: "b1mrlr"
  }], ["path", {
    d: "M16 13H8",
    key: "t4e002"
  }], ["path", {
    d: "M16 17H8",
    key: "z1uh3a"
  }]],
  FileTextIcon = createLucideIcon("file-text", fileTextIconNode);
var folderOpenIconNode = [["path", {
    d: "m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2",
    key: "usdka0"
  }]],
  FolderOpenIcon = createLucideIcon("folder-open", folderOpenIconNode);
var folderIconNode = [["path", {
    d: "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",
    key: "1kt360"
  }]],
  FolderIcon = createLucideIcon("folder", folderIconNode);
var globeIconNode = [["circle", {
    cx: "12",
    cy: "12",
    r: "10",
    key: "1mglay"
  }], ["path", {
    d: "M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20",
    key: "13o1zl"
  }], ["path", {
    d: "M2 12h20",
    key: "9i4pu4"
  }]],
  GlobeIcon = createLucideIcon("globe", globeIconNode);
var gripVerticalIconNode = [["circle", {
    cx: "9",
    cy: "12",
    r: "1",
    key: "1vctgf"
  }], ["circle", {
    cx: "9",
    cy: "5",
    r: "1",
    key: "hp0tcf"
  }], ["circle", {
    cx: "9",
    cy: "19",
    r: "1",
    key: "fkjjf6"
  }], ["circle", {
    cx: "15",
    cy: "12",
    r: "1",
    key: "1tmaij"
  }], ["circle", {
    cx: "15",
    cy: "5",
    r: "1",
    key: "19l28e"
  }], ["circle", {
    cx: "15",
    cy: "19",
    r: "1",
    key: "f4zoj3"
  }]],
  GripVerticalIcon = createLucideIcon("grip-vertical", gripVerticalIconNode);
var keyRoundIconNode = [["path", {
    d: "M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z",
    key: "1s6t7t"
  }], ["circle", {
    cx: "16.5",
    cy: "7.5",
    r: ".5",
    fill: "currentColor",
    key: "w0ekpg"
  }]],
  KeyRoundIcon = createLucideIcon("key-round", keyRoundIconNode);
var keyIconNode = [["path", {
    d: "m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4",
    key: "g0fldk"
  }], ["path", {
    d: "m21 2-9.6 9.6",
    key: "1j0ho8"
  }], ["circle", {
    cx: "7.5",
    cy: "15.5",
    r: "5.5",
    key: "yqb3hr"
  }]],
  KeyIcon = createLucideIcon("key", keyIconNode);
var layersIconNode = [["path", {
    d: "M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z",
    key: "zw3jo"
  }], ["path", {
    d: "M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12",
    key: "1wduqc"
  }], ["path", {
    d: "M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17",
    key: "kqbvx6"
  }]],
  LayersIcon = createLucideIcon("layers", layersIconNode);
var link2IconNode = [["path", {
    d: "M9 17H7A5 5 0 0 1 7 7h2",
    key: "8i5ue5"
  }], ["path", {
    d: "M15 7h2a5 5 0 1 1 0 10h-2",
    key: "1b9ql8"
  }], ["line", {
    x1: "8",
    x2: "16",
    y1: "12",
    y2: "12",
    key: "1jonct"
  }]],
  Link2Icon = createLucideIcon("link-2", link2IconNode);
var lockOpenIconNode = [["rect", {
    width: "18",
    height: "11",
    x: "3",
    y: "11",
    rx: "2",
    ry: "2",
    key: "1w4ew1"
  }], ["path", {
    d: "M7 11V7a5 5 0 0 1 9.9-1",
    key: "1mm8w8"
  }]],
  LockOpenIcon = createLucideIcon("lock-open", lockOpenIconNode);
var lockIconNode = [["rect", {
    width: "18",
    height: "11",
    x: "3",
    y: "11",
    rx: "2",
    ry: "2",
    key: "1w4ew1"
  }], ["path", {
    d: "M7 11V7a5 5 0 0 1 10 0v4",
    key: "fwvmzm"
  }]],
  LockIcon = createLucideIcon("lock", lockIconNode);
var mailIconNode = [["path", {
    d: "m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7",
    key: "132q7q"
  }], ["rect", {
    x: "2",
    y: "4",
    width: "20",
    height: "16",
    rx: "2",
    key: "izxlao"
  }]],
  MailIcon = createLucideIcon("mail", mailIconNode);
var maximize2IconNode = [["path", {
    d: "M15 3h6v6",
    key: "1q9fwt"
  }], ["path", {
    d: "m21 3-7 7",
    key: "1l2asr"
  }], ["path", {
    d: "m3 21 7-7",
    key: "tjx5ai"
  }], ["path", {
    d: "M9 21H3v-6",
    key: "wtvkvv"
  }]],
  Maximize2Icon = createLucideIcon("maximize-2", maximize2IconNode);
var messageSquareWarningIconNode = [["path", {
    d: "M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z",
    key: "18887p"
  }], ["path", {
    d: "M12 15h.01",
    key: "q59x07"
  }], ["path", {
    d: "M12 7v4",
    key: "xawao1"
  }]],
  MessageSquareWarningIcon = createLucideIcon("message-square-warning", messageSquareWarningIconNode);
var minusIconNode = [["path", {
    d: "M5 12h14",
    key: "1ays0h"
  }]],
  MinusIcon = createLucideIcon("minus", minusIconNode);
var mousePointerClickIconNode = [["path", {
    d: "M14 4.1 12 6",
    key: "ita8i4"
  }], ["path", {
    d: "m5.1 8-2.9-.8",
    key: "1go3kf"
  }], ["path", {
    d: "m6 12-1.9 2",
    key: "mnht97"
  }], ["path", {
    d: "M7.2 2.2 8 5.1",
    key: "1cfko1"
  }], ["path", {
    d: "M9.037 9.69a.498.498 0 0 1 .653-.653l11 4.5a.5.5 0 0 1-.074.949l-4.349 1.041a1 1 0 0 0-.74.739l-1.04 4.35a.5.5 0 0 1-.95.074z",
    key: "s0h3yz"
  }]],
  MousePointerClickIcon = createLucideIcon("mouse-pointer-click", mousePointerClickIconNode);
var paletteIconNode = [["path", {
    d: "M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z",
    key: "e79jfc"
  }], ["circle", {
    cx: "13.5",
    cy: "6.5",
    r: ".5",
    fill: "currentColor",
    key: "1okk4w"
  }], ["circle", {
    cx: "17.5",
    cy: "10.5",
    r: ".5",
    fill: "currentColor",
    key: "f64h9f"
  }], ["circle", {
    cx: "6.5",
    cy: "12.5",
    r: ".5",
    fill: "currentColor",
    key: "qy21gx"
  }], ["circle", {
    cx: "8.5",
    cy: "7.5",
    r: ".5",
    fill: "currentColor",
    key: "fotxhn"
  }]],
  PaletteIcon = createLucideIcon("palette", paletteIconNode);
var pencilIconNode = [["path", {
    d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
    key: "1a8usu"
  }], ["path", {
    d: "m15 5 4 4",
    key: "1mk7zo"
  }]],
  PencilIcon = createLucideIcon("pencil", pencilIconNode);
var pipetteIconNode = [["path", {
    d: "m12 9-8.414 8.414A2 2 0 0 0 3 18.828v1.344a2 2 0 0 1-.586 1.414A2 2 0 0 1 3.828 21h1.344a2 2 0 0 0 1.414-.586L15 12",
    key: "1y3wsu"
  }], ["path", {
    d: "m18 9 .4.4a1 1 0 1 1-3 3l-3.8-3.8a1 1 0 1 1 3-3l.4.4 3.4-3.4a1 1 0 1 1 3 3z",
    key: "110lr1"
  }], ["path", {
    d: "m2 22 .414-.414",
    key: "jhxm08"
  }]],
  PipetteIcon = createLucideIcon("pipette", pipetteIconNode);
var plusIconNode = [["path", {
    d: "M5 12h14",
    key: "1ays0h"
  }], ["path", {
    d: "M12 5v14",
    key: "s699le"
  }]],
  PlusIcon = createLucideIcon("plus", plusIconNode);
var refreshCwIconNode = [["path", {
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
  RefreshCwIcon = createLucideIcon("refresh-cw", refreshCwIconNode);
var repeatIconNode = [["path", {
    d: "m17 2 4 4-4 4",
    key: "nntrym"
  }], ["path", {
    d: "M3 11v-1a4 4 0 0 1 4-4h14",
    key: "84bu3i"
  }], ["path", {
    d: "m7 22-4-4 4-4",
    key: "1wqhfi"
  }], ["path", {
    d: "M21 13v1a4 4 0 0 1-4 4H3",
    key: "1rx37r"
  }]],
  RepeatIcon = createLucideIcon("repeat", repeatIconNode);
var rotateCcwIconNode = [["path", {
    d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",
    key: "1357e3"
  }], ["path", {
    d: "M3 3v5h5",
    key: "1xhq8a"
  }]],
  RotateCcwIcon = createLucideIcon("rotate-ccw", rotateCcwIconNode);
var rows3IconNode = [["rect", {
    width: "18",
    height: "18",
    x: "3",
    y: "3",
    rx: "2",
    key: "afitv7"
  }], ["path", {
    d: "M21 9H3",
    key: "1338ky"
  }], ["path", {
    d: "M21 15H3",
    key: "9uk58r"
  }]],
  Rows3Icon = createLucideIcon("rows-3", rows3IconNode);
var saveIconNode = [["path", {
    d: "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
    key: "1c8476"
  }], ["path", {
    d: "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7",
    key: "1ydtos"
  }], ["path", {
    d: "M7 3v4a1 1 0 0 0 1 1h7",
    key: "t51u73"
  }]],
  SaveIcon = createLucideIcon("save", saveIconNode);
var searchIconNode = [["path", {
    d: "m21 21-4.34-4.34",
    key: "14j7rj"
  }], ["circle", {
    cx: "11",
    cy: "11",
    r: "8",
    key: "4ej97u"
  }]],
  SearchIcon = createLucideIcon("search", searchIconNode);
var splitIconNode = [["path", {
    d: "M16 3h5v5",
    key: "1806ms"
  }], ["path", {
    d: "M8 3H3v5",
    key: "15dfkv"
  }], ["path", {
    d: "M12 22v-8.3a4 4 0 0 0-1.172-2.872L3 3",
    key: "1qrqzj"
  }], ["path", {
    d: "m15 9 6-6",
    key: "ko1vev"
  }]],
  SplitIcon = createLucideIcon("split", splitIconNode);
var terminalIconNode = [["path", {
    d: "M12 19h8",
    key: "baeox8"
  }], ["path", {
    d: "m4 17 6-6-6-6",
    key: "1yngyt"
  }]],
  TerminalIcon = createLucideIcon("terminal", terminalIconNode);
var trash2IconNode = [["path", {
    d: "M10 11v6",
    key: "nco0om"
  }], ["path", {
    d: "M14 11v6",
    key: "outv1u"
  }], ["path", {
    d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6",
    key: "miytrc"
  }], ["path", {
    d: "M3 6h18",
    key: "d0wm0j"
  }], ["path", {
    d: "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",
    key: "e791ji"
  }]],
  Trash2Icon = createLucideIcon("trash-2", trash2IconNode);
var triangleAlertIconNode = [["path", {
    d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
    key: "wmoenq"
  }], ["path", {
    d: "M12 9v4",
    key: "juzpu7"
  }], ["path", {
    d: "M12 17h.01",
    key: "p32p05"
  }]],
  TriangleAlertIcon = createLucideIcon("triangle-alert", triangleAlertIconNode);
var undo2IconNode = [["path", {
    d: "M9 14 4 9l5-5",
    key: "102s5s"
  }], ["path", {
    d: "M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11",
    key: "f3b9sd"
  }]],
  Undo2Icon = createLucideIcon("undo-2", undo2IconNode);
var userIconNode = [["path", {
    d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",
    key: "975kel"
  }], ["circle", {
    cx: "12",
    cy: "7",
    r: "4",
    key: "17ys0d"
  }]],
  UserIcon = createLucideIcon("user", userIconNode);
var usersIconNode = [["path", {
    d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",
    key: "1yyitq"
  }], ["path", {
    d: "M16 3.128a4 4 0 0 1 0 7.744",
    key: "16gr8j"
  }], ["path", {
    d: "M22 21v-2a4 4 0 0 0-3-3.87",
    key: "kshegd"
  }], ["circle", {
    cx: "9",
    cy: "7",
    r: "4",
    key: "nufk8"
  }]],
  UsersIcon = createLucideIcon("users", usersIconNode);
var xIconNode = [["path", {
    d: "M18 6 6 18",
    key: "1bl5f8"
  }], ["path", {
    d: "m6 6 12 12",
    key: "d8bk6v"
  }]],
  XIcon = createLucideIcon("x", xIconNode);
var zapIconNode = [["path", {
    d: "M15.914 4a1.5 1.5 0 00-2.474-1.561l-9 9A1.5 1.5 0 005.5 14h4.002a.5.5 0 01.471.666L8.086 20a1.5 1.5 0 002.475 1.56l9-9A1.5 1.5 0 0018.5 10h-3.997a.5.5 0 01-.472-.667z",
    key: "1v7up4"
  }]],
  ZapIcon = createLucideIcon("zap", zapIconNode);
// ReactForLoading (minified: vu) — ──── Library: clsx (bundled from npm; unchanged, names left minified) ────
var ReactForLoading = V(Fe());
var ReactForButton = V(Fe());
function Ox(e) {
  var a,
    t,
    l = "";
  if (typeof e == "string" || typeof e == "number") l += e;else if (typeof e == "object") if (Array.isArray(e)) {
    var o = e.length;
    for (a = 0; a < o; a++) e[a] && (t = Ox(e[a])) && (l && (l += " "), l += t);
  } else for (t in e) e[t] && (l && (l += " "), l += t);
  return l;
}
function clsx() {
  for (var e, a, t = 0, l = "", o = arguments.length; t < o; t++) (e = arguments[t]) && (a = Ox(e)) && (l && (l += " "), l += a);
  return l;
}
// ──── Library: class-variance-authority (cva) (bundled from npm; unchanged, names left minified) ────
var Ex = e => typeof e == "boolean" ? `${e}` : e === 0 ? "0" : e,
  zx = clsx,
  cva = (e, a) => t => {
    var l;
    if (a?.variants == null) return zx(e, t?.class, t?.className);
    let {
        variants: o,
        defaultVariants: r
      } = a,
      n = Object.keys(o).map(i => {
        let d = t?.[i],
          x = r?.[i];
        if (d === null) return null;
        let m = Ex(d) || Ex(x);
        return o[i][m];
      }),
      u = t && Object.entries(t).reduce((i, d) => {
        let [x, m] = d;
        return m === void 0 || (i[x] = m), i;
      }, {}),
      s = a == null || (l = a.compoundVariants) === null || l === void 0 ? void 0 : l.reduce((i, d) => {
        let {
          class: x,
          className: m,
          ...g
        } = d;
        return Object.entries(g).every(C => {
          let [y, N] = C;
          return Array.isArray(N) ? N.includes({
            ...r,
            ...u
          }[y]) : {
            ...r,
            ...u
          }[y] === N;
        }) ? [...i, x, m] : i;
      }, []);
    return zx(e, n, s, t?.class, t?.className);
  };
// ──── Library: tailwind-merge (incl. twMerge = createTailwindMerge(getDefaultConfig)) (bundled from npm; unchanged, names left minified) ────
var _L = (e, a) => {
    let t = new Array(e.length + a.length);
    for (let l = 0; l < e.length; l++) t[l] = e[l];
    for (let l = 0; l < a.length; l++) t[e.length + l] = a[l];
    return t;
  },
  GL = (e, a) => ({
    classGroupId: e,
    validator: a
  }),
  Gx = (e = new Map(), a = null, t) => ({
    nextPart: e,
    validators: a,
    classGroupId: t
  });
var qx = [],
  VL = "arbitrary..",
  XL = e => {
    let a = ZL(e),
      {
        conflictingClassGroups: t,
        conflictingClassGroupModifiers: l
      } = e;
    return {
      getClassGroupId: n => {
        if (n.startsWith("[") && n.endsWith("]")) return jL(n);
        let u = n.split("-"),
          s = u[0] === "" && u.length > 1 ? 1 : 0;
        return Vx(u, s, a);
      },
      getConflictingClassGroupIds: (n, u) => {
        if (u) {
          let s = l[n],
            i = t[n];
          return s ? i ? _L(i, s) : s : i || qx;
        }
        return t[n] || qx;
      }
    };
  },
  Vx = (e, a, t) => {
    if (e.length - a === 0) return t.classGroupId;
    let o = e[a],
      r = t.nextPart.get(o);
    if (r) {
      let i = Vx(e, a + 1, r);
      if (i) return i;
    }
    let n = t.validators;
    if (n === null) return;
    let u = a === 0 ? e.join("-") : e.slice(a).join("-"),
      s = n.length;
    for (let i = 0; i < s; i++) {
      let d = n[i];
      if (d.validator(u)) return d.classGroupId;
    }
  },
  jL = e => e.slice(1, -1).indexOf(":") === -1 ? void 0 : (() => {
    let a = e.slice(1, -1),
      t = a.indexOf(":"),
      l = a.slice(0, t);
    return l ? VL + l : void 0;
  })(),
  ZL = e => {
    let {
      theme: a,
      classGroups: t
    } = e;
    return YL(t, a);
  },
  YL = (e, a) => {
    let t = Gx();
    for (let l in e) {
      let o = e[l];
      Af(o, t, l, a);
    }
    return t;
  },
  Af = (e, a, t, l) => {
    let o = e.length;
    for (let r = 0; r < o; r++) {
      let n = e[r];
      KL(n, a, t, l);
    }
  },
  KL = (e, a, t, l) => {
    if (typeof e == "string") {
      QL(e, a, t);
      return;
    }
    if (typeof e == "function") {
      WL(e, a, t, l);
      return;
    }
    JL(e, a, t, l);
  },
  QL = (e, a, t) => {
    let l = e === "" ? a : Xx(a, e);
    l.classGroupId = t;
  },
  WL = (e, a, t, l) => {
    if ($L(e)) {
      Af(e(l), a, t, l);
      return;
    }
    a.validators === null && (a.validators = []), a.validators.push(GL(t, e));
  },
  JL = (e, a, t, l) => {
    let o = Object.entries(e),
      r = o.length;
    for (let n = 0; n < r; n++) {
      let [u, s] = o[n];
      Af(s, Xx(a, u), t, l);
    }
  },
  Xx = (e, a) => {
    let t = e,
      l = a.split("-"),
      o = l.length;
    for (let r = 0; r < o; r++) {
      let n = l[r],
        u = t.nextPart.get(n);
      u || (u = Gx(), t.nextPart.set(n, u)), t = u;
    }
    return t;
  },
  $L = e => "isThemeGetter" in e && e.isThemeGetter === !0,
  e1 = e => {
    if (e < 1) return {
      get: () => {},
      set: () => {}
    };
    let a = 0,
      t = Object.create(null),
      l = Object.create(null),
      o = (r, n) => {
        t[r] = n, a++, a > e && (a = 0, l = t, t = Object.create(null));
      };
    return {
      get(r) {
        let n = t[r];
        if (n !== void 0) return n;
        if ((n = l[r]) !== void 0) return o(r, n), n;
      },
      set(r, n) {
        r in t ? t[r] = n : o(r, n);
      }
    };
  };
var a1 = [],
  Fx = (e, a, t, l, o) => ({
    modifiers: e,
    hasImportantModifier: a,
    baseClassName: t,
    maybePostfixModifierPosition: l,
    isExternal: o
  }),
  t1 = e => {
    let {
        prefix: a,
        experimentalParseClassName: t
      } = e,
      l = o => {
        let r = [],
          n = 0,
          u = 0,
          s = 0,
          i,
          d = o.length;
        for (let y = 0; y < d; y++) {
          let N = o[y];
          if (n === 0 && u === 0) {
            if (N === ":") {
              r.push(o.slice(s, y)), s = y + 1;
              continue;
            }
            if (N === "/") {
              i = y;
              continue;
            }
          }
          N === "[" ? n++ : N === "]" ? n-- : N === "(" ? u++ : N === ")" && u--;
        }
        let x = r.length === 0 ? o : o.slice(s),
          m = x,
          g = !1;
        x.endsWith("!") ? (m = x.slice(0, -1), g = !0) : x.startsWith("!") && (m = x.slice(1), g = !0);
        let C = i && i > s ? i - s : void 0;
        return Fx(r, g, m, C);
      };
    if (a) {
      let o = a + ":",
        r = l;
      l = n => n.startsWith(o) ? r(n.slice(o.length)) : Fx(a1, !1, n, void 0, !0);
    }
    if (t) {
      let o = l;
      l = r => t({
        className: r,
        parseClassName: o
      });
    }
    return l;
  },
  l1 = e => {
    let a = new Map();
    return e.orderSensitiveModifiers.forEach((t, l) => {
      a.set(t, 1e6 + l);
    }), t => {
      let l = [],
        o = [];
      for (let r = 0; r < t.length; r++) {
        let n = t[r],
          u = n[0] === "[",
          s = a.has(n);
        u || s ? (o.length > 0 && (o.sort(), l.push(...o), o = []), l.push(n)) : o.push(n);
      }
      return o.length > 0 && (o.sort(), l.push(...o)), l;
    };
  },
  o1 = e => ({
    cache: e1(e.cacheSize),
    parseClassName: t1(e),
    sortModifiers: l1(e),
    postfixLookupClassGroupIds: r1(e),
    ...XL(e)
  }),
  r1 = e => {
    let a = Object.create(null),
      t = e.postfixLookupClassGroups;
    if (t) for (let l = 0; l < t.length; l++) a[t[l]] = !0;
    return a;
  },
  n1 = /\s+/,
  u1 = (e, a) => {
    let {
        parseClassName: t,
        getClassGroupId: l,
        getConflictingClassGroupIds: o,
        sortModifiers: r,
        postfixLookupClassGroupIds: n
      } = a,
      u = [],
      s = e.trim().split(n1),
      i = "";
    for (let d = s.length - 1; d >= 0; d -= 1) {
      let x = s[d],
        {
          isExternal: m,
          modifiers: g,
          hasImportantModifier: C,
          baseClassName: y,
          maybePostfixModifierPosition: N
        } = t(x);
      if (m) {
        i = x + (i.length > 0 ? " " + i : i);
        continue;
      }
      let f = !!N,
        c;
      if (f) {
        let L = y.substring(0, N);
        c = l(L);
        let w = c && n[c] ? l(y) : void 0;
        w && w !== c && (c = w, f = !1);
      } else c = l(y);
      if (!c) {
        if (!f) {
          i = x + (i.length > 0 ? " " + i : i);
          continue;
        }
        if (c = l(y), !c) {
          i = x + (i.length > 0 ? " " + i : i);
          continue;
        }
        f = !1;
      }
      let h = g.length === 0 ? "" : g.length === 1 ? g[0] : r(g).join(":"),
        p = C ? h + "!" : h,
        M = p + c;
      if (u.indexOf(M) > -1) continue;
      u.push(M);
      let D = o(c, f);
      for (let L = 0; L < D.length; ++L) {
        let w = D[L];
        u.push(p + w);
      }
      i = x + (i.length > 0 ? " " + i : i);
    }
    return i;
  },
  s1 = (...e) => {
    let a = 0,
      t,
      l,
      o = "";
    for (; a < e.length;) (t = e[a++]) && (l = jx(t)) && (o && (o += " "), o += l);
    return o;
  },
  jx = e => {
    if (typeof e == "string") return e;
    let a,
      t = "";
    for (let l = 0; l < e.length; l++) e[l] && (a = jx(e[l])) && (t && (t += " "), t += a);
    return t;
  },
  createTailwindMerge = (e, ...a) => {
    let t,
      l,
      o,
      r,
      n = s => {
        let i = a.reduce((d, x) => x(d), e());
        return t = o1(i), l = t.cache.get, o = t.cache.set, r = u, u(s);
      },
      u = s => {
        let i = l(s);
        if (i) return i;
        let d = u1(s, t);
        return o(s, d), d;
      };
    return r = n, (...s) => r(s1(...s));
  },
  d1 = [],
  oa = e => {
    let a = t => t[e] || d1;
    return a.isThemeGetter = !0, a;
  },
  Zx = /^\[(?:(\w[\w-]*):)?(.+)\]$/i,
  Yx = /^\((?:(\w[\w-]*):)?(.+)\)$/i,
  c1 = /^\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/,
  f1 = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/,
  p1 = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/,
  m1 = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/,
  g1 = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/,
  h1 = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/,
  _l = e => c1.test(e),
  ae = e => !!e && !Number.isNaN(Number(e)),
  kt = e => !!e && Number.isInteger(Number(e)),
  If = e => e.endsWith("%") && ae(e.slice(0, -1)),
  Jt = e => f1.test(e),
  Kx = () => !0,
  x1 = e => p1.test(e) && !m1.test(e),
  Mf = () => !1,
  b1 = e => g1.test(e),
  v1 = e => h1.test(e),
  y1 = e => !_(e) && !G(e),
  L1 = e => e.startsWith("@container") && (e[10] === "/" && e[11] !== void 0 || e[11] === "s" && e[16] !== void 0 && e.startsWith("-size/", 10) || e[11] === "n" && e[18] !== void 0 && e.startsWith("-normal/", 10)),
  w1 = e => Gl(e, Jx, Mf),
  _ = e => Zx.test(e),
  Io = e => Gl(e, $x, x1),
  Px = e => Gl(e, T1, ae),
  C1 = e => Gl(e, ab, Kx),
  S1 = e => Gl(e, eb, Mf),
  Hx = e => Gl(e, Qx, Mf),
  k1 = e => Gl(e, Wx, v1),
  bi = e => Gl(e, tb, b1),
  G = e => Yx.test(e),
  bu = e => Ao(e, $x),
  I1 = e => Ao(e, eb),
  _x = e => Ao(e, Qx),
  A1 = e => Ao(e, Jx),
  M1 = e => Ao(e, Wx),
  vi = e => Ao(e, tb, !0),
  N1 = e => Ao(e, ab, !0),
  Gl = (e, a, t) => {
    let l = Zx.exec(e);
    return l ? l[1] ? a(l[1]) : t(l[2]) : !1;
  },
  Ao = (e, a, t = !1) => {
    let l = Yx.exec(e);
    return l ? l[1] ? a(l[1]) : t : !1;
  },
  Qx = e => e === "position" || e === "percentage",
  Wx = e => e === "image" || e === "url",
  Jx = e => e === "length" || e === "size" || e === "bg-size",
  $x = e => e === "length",
  T1 = e => e === "number",
  eb = e => e === "family-name",
  ab = e => e === "number" || e === "weight",
  tb = e => e === "shadow";
var getDefaultConfig = () => {
  let e = oa("color"),
    a = oa("font"),
    t = oa("text"),
    l = oa("font-weight"),
    o = oa("tracking"),
    r = oa("leading"),
    n = oa("breakpoint"),
    u = oa("container"),
    s = oa("spacing"),
    i = oa("radius"),
    d = oa("shadow"),
    x = oa("inset-shadow"),
    m = oa("text-shadow"),
    g = oa("drop-shadow"),
    C = oa("blur"),
    y = oa("perspective"),
    N = oa("aspect"),
    f = oa("ease"),
    c = oa("animate"),
    h = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"],
    p = () => ["center", "top", "bottom", "left", "right", "top-left", "left-top", "top-right", "right-top", "bottom-right", "right-bottom", "bottom-left", "left-bottom"],
    M = () => [...p(), G, _],
    D = () => ["auto", "hidden", "clip", "visible", "scroll"],
    L = () => ["auto", "contain", "none"],
    w = () => [G, _, s],
    E = () => [_l, "full", "auto", ...w()],
    q = () => [kt, "none", "subgrid", G, _],
    be = () => ["auto", {
      span: ["full", kt, G, _]
    }, kt, G, _],
    Pe = () => [kt, "auto", G, _],
    Ye = () => ["auto", "min", "max", "fr", G, _],
    ee = () => ["start", "end", "center", "between", "around", "evenly", "stretch", "baseline", "center-safe", "end-safe"],
    te = () => ["start", "end", "center", "stretch", "center-safe", "end-safe"],
    ce = () => ["auto", ...w()],
    oe = () => [_l, "auto", "full", "dvw", "dvh", "lvw", "lvh", "svw", "svh", "min", "max", "fit", ...w()],
    B = () => [_l, "screen", "full", "dvw", "lvw", "svw", "min", "max", "fit", ...w()],
    F = () => [_l, "screen", "full", "lh", "dvh", "lvh", "svh", "min", "max", "fit", ...w()],
    z = () => [e, G, _],
    ra = () => [...p(), _x, Hx, {
      position: [G, _]
    }],
    Ke = () => ["no-repeat", {
      repeat: ["", "x", "y", "space", "round"]
    }],
    aa = () => ["auto", "cover", "contain", A1, w1, {
      size: [G, _]
    }],
    Oa = () => [If, bu, Io],
    qe = () => ["", "none", "full", i, G, _],
    Ce = () => ["", ae, bu, Io],
    It = () => ["solid", "dashed", "dotted", "double"],
    Do = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"],
    He = () => [ae, If, _x, Hx],
    Ro = () => ["", "none", C, G, _],
    al = () => ["none", ae, G, _],
    ct = () => ["none", ae, G, _],
    Yl = () => [ae, G, _],
    tl = () => [_l, "full", ...w()];
  return {
    cacheSize: 500,
    theme: {
      animate: ["spin", "ping", "pulse", "bounce"],
      aspect: ["video"],
      blur: [Jt],
      breakpoint: [Jt],
      color: [Kx],
      container: [Jt],
      "drop-shadow": [Jt],
      ease: ["in", "out", "in-out"],
      font: [y1],
      "font-weight": ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black"],
      "inset-shadow": [Jt],
      leading: ["none", "tight", "snug", "normal", "relaxed", "loose"],
      perspective: ["dramatic", "near", "normal", "midrange", "distant", "none"],
      radius: [Jt],
      shadow: [Jt],
      spacing: ["px", ae],
      text: [Jt],
      "text-shadow": [Jt],
      tracking: ["tighter", "tight", "normal", "wide", "wider", "widest"]
    },
    classGroups: {
      aspect: [{
        aspect: ["auto", "square", _l, _, G, N]
      }],
      container: ["container"],
      "container-type": [{
        "@container": ["", "normal", "size", G, _]
      }],
      "container-named": [L1],
      columns: [{
        columns: [ae, _, G, u]
      }],
      "break-after": [{
        "break-after": h()
      }],
      "break-before": [{
        "break-before": h()
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
        object: M()
      }],
      overflow: [{
        overflow: D()
      }],
      "overflow-x": [{
        "overflow-x": D()
      }],
      "overflow-y": [{
        "overflow-y": D()
      }],
      overscroll: [{
        overscroll: L()
      }],
      "overscroll-x": [{
        "overscroll-x": L()
      }],
      "overscroll-y": [{
        "overscroll-y": L()
      }],
      position: ["static", "fixed", "absolute", "relative", "sticky"],
      inset: [{
        inset: E()
      }],
      "inset-x": [{
        "inset-x": E()
      }],
      "inset-y": [{
        "inset-y": E()
      }],
      start: [{
        "inset-s": E(),
        start: E()
      }],
      end: [{
        "inset-e": E(),
        end: E()
      }],
      "inset-bs": [{
        "inset-bs": E()
      }],
      "inset-be": [{
        "inset-be": E()
      }],
      top: [{
        top: E()
      }],
      right: [{
        right: E()
      }],
      bottom: [{
        bottom: E()
      }],
      left: [{
        left: E()
      }],
      visibility: ["visible", "invisible", "collapse"],
      z: [{
        z: [kt, "auto", G, _]
      }],
      basis: [{
        basis: [_l, "full", "auto", u, ...w()]
      }],
      "flex-direction": [{
        flex: ["row", "row-reverse", "col", "col-reverse"]
      }],
      "flex-wrap": [{
        flex: ["nowrap", "wrap", "wrap-reverse"]
      }],
      flex: [{
        flex: [ae, _l, "auto", "initial", "none", _]
      }],
      grow: [{
        grow: ["", ae, G, _]
      }],
      shrink: [{
        shrink: ["", ae, G, _]
      }],
      order: [{
        order: [kt, "first", "last", "none", G, _]
      }],
      "grid-cols": [{
        "grid-cols": q()
      }],
      "col-start-end": [{
        col: be()
      }],
      "col-start": [{
        "col-start": Pe()
      }],
      "col-end": [{
        "col-end": Pe()
      }],
      "grid-rows": [{
        "grid-rows": q()
      }],
      "row-start-end": [{
        row: be()
      }],
      "row-start": [{
        "row-start": Pe()
      }],
      "row-end": [{
        "row-end": Pe()
      }],
      "grid-flow": [{
        "grid-flow": ["row", "col", "dense", "row-dense", "col-dense"]
      }],
      "auto-cols": [{
        "auto-cols": Ye()
      }],
      "auto-rows": [{
        "auto-rows": Ye()
      }],
      gap: [{
        gap: w()
      }],
      "gap-x": [{
        "gap-x": w()
      }],
      "gap-y": [{
        "gap-y": w()
      }],
      "justify-content": [{
        justify: [...ee(), "normal"]
      }],
      "justify-items": [{
        "justify-items": [...te(), "normal"]
      }],
      "justify-self": [{
        "justify-self": ["auto", ...te()]
      }],
      "align-content": [{
        content: ["normal", ...ee()]
      }],
      "align-items": [{
        items: [...te(), {
          baseline: ["", "last"]
        }]
      }],
      "align-self": [{
        self: ["auto", ...te(), {
          baseline: ["", "last"]
        }]
      }],
      "place-content": [{
        "place-content": ee()
      }],
      "place-items": [{
        "place-items": [...te(), "baseline"]
      }],
      "place-self": [{
        "place-self": ["auto", ...te()]
      }],
      p: [{
        p: w()
      }],
      px: [{
        px: w()
      }],
      py: [{
        py: w()
      }],
      ps: [{
        ps: w()
      }],
      pe: [{
        pe: w()
      }],
      pbs: [{
        pbs: w()
      }],
      pbe: [{
        pbe: w()
      }],
      pt: [{
        pt: w()
      }],
      pr: [{
        pr: w()
      }],
      pb: [{
        pb: w()
      }],
      pl: [{
        pl: w()
      }],
      m: [{
        m: ce()
      }],
      mx: [{
        mx: ce()
      }],
      my: [{
        my: ce()
      }],
      ms: [{
        ms: ce()
      }],
      me: [{
        me: ce()
      }],
      mbs: [{
        mbs: ce()
      }],
      mbe: [{
        mbe: ce()
      }],
      mt: [{
        mt: ce()
      }],
      mr: [{
        mr: ce()
      }],
      mb: [{
        mb: ce()
      }],
      ml: [{
        ml: ce()
      }],
      "space-x": [{
        "space-x": w()
      }],
      "space-x-reverse": ["space-x-reverse"],
      "space-y": [{
        "space-y": w()
      }],
      "space-y-reverse": ["space-y-reverse"],
      size: [{
        size: oe()
      }],
      "inline-size": [{
        inline: ["auto", ...B()]
      }],
      "min-inline-size": [{
        "min-inline": ["auto", ...B()]
      }],
      "max-inline-size": [{
        "max-inline": ["none", ...B()]
      }],
      "block-size": [{
        block: ["auto", ...F()]
      }],
      "min-block-size": [{
        "min-block": ["auto", ...F()]
      }],
      "max-block-size": [{
        "max-block": ["none", ...F()]
      }],
      w: [{
        w: [u, "screen", ...oe()]
      }],
      "min-w": [{
        "min-w": [u, "screen", "none", ...oe()]
      }],
      "max-w": [{
        "max-w": [u, "screen", "none", "prose", {
          screen: [n]
        }, ...oe()]
      }],
      h: [{
        h: ["screen", "lh", ...oe()]
      }],
      "min-h": [{
        "min-h": ["screen", "lh", "none", ...oe()]
      }],
      "max-h": [{
        "max-h": ["screen", "lh", ...oe()]
      }],
      "font-size": [{
        text: ["base", t, bu, Io]
      }],
      "font-smoothing": ["antialiased", "subpixel-antialiased"],
      "font-style": ["italic", "not-italic"],
      "font-weight": [{
        font: [l, N1, C1]
      }],
      "font-stretch": [{
        "font-stretch": ["ultra-condensed", "extra-condensed", "condensed", "semi-condensed", "normal", "semi-expanded", "expanded", "extra-expanded", "ultra-expanded", If, _]
      }],
      "font-family": [{
        font: [I1, S1, a]
      }],
      "font-features": [{
        "font-features": [_]
      }],
      "fvn-normal": ["normal-nums"],
      "fvn-ordinal": ["ordinal"],
      "fvn-slashed-zero": ["slashed-zero"],
      "fvn-figure": ["lining-nums", "oldstyle-nums"],
      "fvn-spacing": ["proportional-nums", "tabular-nums"],
      "fvn-fraction": ["diagonal-fractions", "stacked-fractions"],
      tracking: [{
        tracking: [o, G, _]
      }],
      "line-clamp": [{
        "line-clamp": [ae, "none", G, Px]
      }],
      leading: [{
        leading: [r, ...w()]
      }],
      "list-image": [{
        "list-image": ["none", G, _]
      }],
      "list-style-position": [{
        list: ["inside", "outside"]
      }],
      "list-style-type": [{
        list: ["disc", "decimal", "none", G, _]
      }],
      "text-alignment": [{
        text: ["left", "center", "right", "justify", "start", "end"]
      }],
      "placeholder-color": [{
        placeholder: z()
      }],
      "text-color": [{
        text: z()
      }],
      "text-decoration": ["underline", "overline", "line-through", "no-underline"],
      "text-decoration-style": [{
        decoration: [...It(), "wavy"]
      }],
      "text-decoration-thickness": [{
        decoration: [ae, "from-font", "auto", G, Io]
      }],
      "text-decoration-color": [{
        decoration: z()
      }],
      "underline-offset": [{
        "underline-offset": [ae, "auto", G, _]
      }],
      "text-transform": ["uppercase", "lowercase", "capitalize", "normal-case"],
      "text-overflow": ["truncate", "text-ellipsis", "text-clip"],
      "text-wrap": [{
        text: ["wrap", "nowrap", "balance", "pretty"]
      }],
      indent: [{
        indent: w()
      }],
      "tab-size": [{
        tab: [kt, G, _]
      }],
      "vertical-align": [{
        align: ["baseline", "top", "middle", "bottom", "text-top", "text-bottom", "sub", "super", G, _]
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
        content: ["none", G, _]
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
        bg: ra()
      }],
      "bg-repeat": [{
        bg: Ke()
      }],
      "bg-size": [{
        bg: aa()
      }],
      "bg-image": [{
        bg: ["none", {
          linear: [{
            to: ["t", "tr", "r", "br", "b", "bl", "l", "tl"]
          }, kt, G, _],
          radial: ["", G, _],
          conic: [kt, G, _]
        }, M1, k1]
      }],
      "bg-color": [{
        bg: z()
      }],
      "gradient-from-pos": [{
        from: Oa()
      }],
      "gradient-via-pos": [{
        via: Oa()
      }],
      "gradient-to-pos": [{
        to: Oa()
      }],
      "gradient-from": [{
        from: z()
      }],
      "gradient-via": [{
        via: z()
      }],
      "gradient-to": [{
        to: z()
      }],
      rounded: [{
        rounded: qe()
      }],
      "rounded-s": [{
        "rounded-s": qe()
      }],
      "rounded-e": [{
        "rounded-e": qe()
      }],
      "rounded-t": [{
        "rounded-t": qe()
      }],
      "rounded-r": [{
        "rounded-r": qe()
      }],
      "rounded-b": [{
        "rounded-b": qe()
      }],
      "rounded-l": [{
        "rounded-l": qe()
      }],
      "rounded-ss": [{
        "rounded-ss": qe()
      }],
      "rounded-se": [{
        "rounded-se": qe()
      }],
      "rounded-ee": [{
        "rounded-ee": qe()
      }],
      "rounded-es": [{
        "rounded-es": qe()
      }],
      "rounded-tl": [{
        "rounded-tl": qe()
      }],
      "rounded-tr": [{
        "rounded-tr": qe()
      }],
      "rounded-br": [{
        "rounded-br": qe()
      }],
      "rounded-bl": [{
        "rounded-bl": qe()
      }],
      "border-w": [{
        border: Ce()
      }],
      "border-w-x": [{
        "border-x": Ce()
      }],
      "border-w-y": [{
        "border-y": Ce()
      }],
      "border-w-s": [{
        "border-s": Ce()
      }],
      "border-w-e": [{
        "border-e": Ce()
      }],
      "border-w-bs": [{
        "border-bs": Ce()
      }],
      "border-w-be": [{
        "border-be": Ce()
      }],
      "border-w-t": [{
        "border-t": Ce()
      }],
      "border-w-r": [{
        "border-r": Ce()
      }],
      "border-w-b": [{
        "border-b": Ce()
      }],
      "border-w-l": [{
        "border-l": Ce()
      }],
      "divide-x": [{
        "divide-x": Ce()
      }],
      "divide-x-reverse": ["divide-x-reverse"],
      "divide-y": [{
        "divide-y": Ce()
      }],
      "divide-y-reverse": ["divide-y-reverse"],
      "border-style": [{
        border: [...It(), "hidden", "none"]
      }],
      "divide-style": [{
        divide: [...It(), "hidden", "none"]
      }],
      "border-color": [{
        border: z()
      }],
      "border-color-x": [{
        "border-x": z()
      }],
      "border-color-y": [{
        "border-y": z()
      }],
      "border-color-s": [{
        "border-s": z()
      }],
      "border-color-e": [{
        "border-e": z()
      }],
      "border-color-bs": [{
        "border-bs": z()
      }],
      "border-color-be": [{
        "border-be": z()
      }],
      "border-color-t": [{
        "border-t": z()
      }],
      "border-color-r": [{
        "border-r": z()
      }],
      "border-color-b": [{
        "border-b": z()
      }],
      "border-color-l": [{
        "border-l": z()
      }],
      "divide-color": [{
        divide: z()
      }],
      "outline-style": [{
        outline: [...It(), "none", "hidden"]
      }],
      "outline-offset": [{
        "outline-offset": [ae, G, _]
      }],
      "outline-w": [{
        outline: ["", ae, bu, Io]
      }],
      "outline-color": [{
        outline: z()
      }],
      shadow: [{
        shadow: ["", "none", d, vi, bi]
      }],
      "shadow-color": [{
        shadow: z()
      }],
      "inset-shadow": [{
        "inset-shadow": ["none", x, vi, bi]
      }],
      "inset-shadow-color": [{
        "inset-shadow": z()
      }],
      "ring-w": [{
        ring: Ce()
      }],
      "ring-w-inset": ["ring-inset"],
      "ring-color": [{
        ring: z()
      }],
      "ring-offset-w": [{
        "ring-offset": [ae, Io]
      }],
      "ring-offset-color": [{
        "ring-offset": z()
      }],
      "inset-ring-w": [{
        "inset-ring": Ce()
      }],
      "inset-ring-color": [{
        "inset-ring": z()
      }],
      "text-shadow": [{
        "text-shadow": ["none", m, vi, bi]
      }],
      "text-shadow-color": [{
        "text-shadow": z()
      }],
      opacity: [{
        opacity: [ae, G, _]
      }],
      "mix-blend": [{
        "mix-blend": [...Do(), "plus-darker", "plus-lighter"]
      }],
      "bg-blend": [{
        "bg-blend": Do()
      }],
      "mask-clip": [{
        "mask-clip": ["border", "padding", "content", "fill", "stroke", "view"]
      }, "mask-no-clip"],
      "mask-composite": [{
        mask: ["add", "subtract", "intersect", "exclude"]
      }],
      "mask-image-linear-pos": [{
        "mask-linear": [ae]
      }],
      "mask-image-linear-from-pos": [{
        "mask-linear-from": He()
      }],
      "mask-image-linear-to-pos": [{
        "mask-linear-to": He()
      }],
      "mask-image-linear-from-color": [{
        "mask-linear-from": z()
      }],
      "mask-image-linear-to-color": [{
        "mask-linear-to": z()
      }],
      "mask-image-t-from-pos": [{
        "mask-t-from": He()
      }],
      "mask-image-t-to-pos": [{
        "mask-t-to": He()
      }],
      "mask-image-t-from-color": [{
        "mask-t-from": z()
      }],
      "mask-image-t-to-color": [{
        "mask-t-to": z()
      }],
      "mask-image-r-from-pos": [{
        "mask-r-from": He()
      }],
      "mask-image-r-to-pos": [{
        "mask-r-to": He()
      }],
      "mask-image-r-from-color": [{
        "mask-r-from": z()
      }],
      "mask-image-r-to-color": [{
        "mask-r-to": z()
      }],
      "mask-image-b-from-pos": [{
        "mask-b-from": He()
      }],
      "mask-image-b-to-pos": [{
        "mask-b-to": He()
      }],
      "mask-image-b-from-color": [{
        "mask-b-from": z()
      }],
      "mask-image-b-to-color": [{
        "mask-b-to": z()
      }],
      "mask-image-l-from-pos": [{
        "mask-l-from": He()
      }],
      "mask-image-l-to-pos": [{
        "mask-l-to": He()
      }],
      "mask-image-l-from-color": [{
        "mask-l-from": z()
      }],
      "mask-image-l-to-color": [{
        "mask-l-to": z()
      }],
      "mask-image-x-from-pos": [{
        "mask-x-from": He()
      }],
      "mask-image-x-to-pos": [{
        "mask-x-to": He()
      }],
      "mask-image-x-from-color": [{
        "mask-x-from": z()
      }],
      "mask-image-x-to-color": [{
        "mask-x-to": z()
      }],
      "mask-image-y-from-pos": [{
        "mask-y-from": He()
      }],
      "mask-image-y-to-pos": [{
        "mask-y-to": He()
      }],
      "mask-image-y-from-color": [{
        "mask-y-from": z()
      }],
      "mask-image-y-to-color": [{
        "mask-y-to": z()
      }],
      "mask-image-radial": [{
        "mask-radial": [G, _]
      }],
      "mask-image-radial-from-pos": [{
        "mask-radial-from": He()
      }],
      "mask-image-radial-to-pos": [{
        "mask-radial-to": He()
      }],
      "mask-image-radial-from-color": [{
        "mask-radial-from": z()
      }],
      "mask-image-radial-to-color": [{
        "mask-radial-to": z()
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
        "mask-radial-at": p()
      }],
      "mask-image-conic-pos": [{
        "mask-conic": [ae]
      }],
      "mask-image-conic-from-pos": [{
        "mask-conic-from": He()
      }],
      "mask-image-conic-to-pos": [{
        "mask-conic-to": He()
      }],
      "mask-image-conic-from-color": [{
        "mask-conic-from": z()
      }],
      "mask-image-conic-to-color": [{
        "mask-conic-to": z()
      }],
      "mask-mode": [{
        mask: ["alpha", "luminance", "match"]
      }],
      "mask-origin": [{
        "mask-origin": ["border", "padding", "content", "fill", "stroke", "view"]
      }],
      "mask-position": [{
        mask: ra()
      }],
      "mask-repeat": [{
        mask: Ke()
      }],
      "mask-size": [{
        mask: aa()
      }],
      "mask-type": [{
        "mask-type": ["alpha", "luminance"]
      }],
      "mask-image": [{
        mask: ["none", G, _]
      }],
      filter: [{
        filter: ["", "none", G, _]
      }],
      blur: [{
        blur: Ro()
      }],
      brightness: [{
        brightness: [ae, G, _]
      }],
      contrast: [{
        contrast: [ae, G, _]
      }],
      "drop-shadow": [{
        "drop-shadow": ["", "none", g, vi, bi]
      }],
      "drop-shadow-color": [{
        "drop-shadow": z()
      }],
      grayscale: [{
        grayscale: ["", ae, G, _]
      }],
      "hue-rotate": [{
        "hue-rotate": [ae, G, _]
      }],
      invert: [{
        invert: ["", ae, G, _]
      }],
      saturate: [{
        saturate: [ae, G, _]
      }],
      sepia: [{
        sepia: ["", ae, G, _]
      }],
      "backdrop-filter": [{
        "backdrop-filter": ["", "none", G, _]
      }],
      "backdrop-blur": [{
        "backdrop-blur": Ro()
      }],
      "backdrop-brightness": [{
        "backdrop-brightness": [ae, G, _]
      }],
      "backdrop-contrast": [{
        "backdrop-contrast": [ae, G, _]
      }],
      "backdrop-grayscale": [{
        "backdrop-grayscale": ["", ae, G, _]
      }],
      "backdrop-hue-rotate": [{
        "backdrop-hue-rotate": [ae, G, _]
      }],
      "backdrop-invert": [{
        "backdrop-invert": ["", ae, G, _]
      }],
      "backdrop-opacity": [{
        "backdrop-opacity": [ae, G, _]
      }],
      "backdrop-saturate": [{
        "backdrop-saturate": [ae, G, _]
      }],
      "backdrop-sepia": [{
        "backdrop-sepia": ["", ae, G, _]
      }],
      "border-collapse": [{
        border: ["collapse", "separate"]
      }],
      "border-spacing": [{
        "border-spacing": w()
      }],
      "border-spacing-x": [{
        "border-spacing-x": w()
      }],
      "border-spacing-y": [{
        "border-spacing-y": w()
      }],
      "table-layout": [{
        table: ["auto", "fixed"]
      }],
      caption: [{
        caption: ["top", "bottom"]
      }],
      transition: [{
        transition: ["", "all", "colors", "opacity", "shadow", "transform", "none", G, _]
      }],
      "transition-behavior": [{
        transition: ["normal", "discrete"]
      }],
      duration: [{
        duration: [ae, "initial", G, _]
      }],
      ease: [{
        ease: ["linear", "initial", f, G, _]
      }],
      delay: [{
        delay: [ae, G, _]
      }],
      animate: [{
        animate: ["none", c, G, _]
      }],
      backface: [{
        backface: ["hidden", "visible"]
      }],
      perspective: [{
        perspective: [y, G, _]
      }],
      "perspective-origin": [{
        "perspective-origin": M()
      }],
      rotate: [{
        rotate: al()
      }],
      "rotate-x": [{
        "rotate-x": al()
      }],
      "rotate-y": [{
        "rotate-y": al()
      }],
      "rotate-z": [{
        "rotate-z": al()
      }],
      scale: [{
        scale: ct()
      }],
      "scale-x": [{
        "scale-x": ct()
      }],
      "scale-y": [{
        "scale-y": ct()
      }],
      "scale-z": [{
        "scale-z": ct()
      }],
      "scale-3d": ["scale-3d"],
      skew: [{
        skew: Yl()
      }],
      "skew-x": [{
        "skew-x": Yl()
      }],
      "skew-y": [{
        "skew-y": Yl()
      }],
      transform: [{
        transform: [G, _, "", "none", "gpu", "cpu"]
      }],
      "transform-origin": [{
        origin: M()
      }],
      "transform-style": [{
        transform: ["3d", "flat"]
      }],
      translate: [{
        translate: tl()
      }],
      "translate-x": [{
        "translate-x": tl()
      }],
      "translate-y": [{
        "translate-y": tl()
      }],
      "translate-z": [{
        "translate-z": tl()
      }],
      "translate-none": ["translate-none"],
      zoom: [{
        zoom: [kt, G, _]
      }],
      accent: [{
        accent: z()
      }],
      appearance: [{
        appearance: ["none", "auto"]
      }],
      "caret-color": [{
        caret: z()
      }],
      "color-scheme": [{
        scheme: ["normal", "dark", "light", "light-dark", "only-dark", "only-light"]
      }],
      cursor: [{
        cursor: ["auto", "default", "pointer", "wait", "text", "move", "help", "not-allowed", "none", "context-menu", "progress", "cell", "crosshair", "vertical-text", "alias", "copy", "no-drop", "grab", "grabbing", "all-scroll", "col-resize", "row-resize", "n-resize", "e-resize", "s-resize", "w-resize", "ne-resize", "nw-resize", "se-resize", "sw-resize", "ew-resize", "ns-resize", "nesw-resize", "nwse-resize", "zoom-in", "zoom-out", G, _]
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
        "scrollbar-thumb": z()
      }],
      "scrollbar-track-color": [{
        "scrollbar-track": z()
      }],
      "scrollbar-gutter": [{
        "scrollbar-gutter": ["auto", "stable", "both"]
      }],
      "scrollbar-w": [{
        scrollbar: ["auto", "thin", "none"]
      }],
      "scroll-m": [{
        "scroll-m": w()
      }],
      "scroll-mx": [{
        "scroll-mx": w()
      }],
      "scroll-my": [{
        "scroll-my": w()
      }],
      "scroll-ms": [{
        "scroll-ms": w()
      }],
      "scroll-me": [{
        "scroll-me": w()
      }],
      "scroll-mbs": [{
        "scroll-mbs": w()
      }],
      "scroll-mbe": [{
        "scroll-mbe": w()
      }],
      "scroll-mt": [{
        "scroll-mt": w()
      }],
      "scroll-mr": [{
        "scroll-mr": w()
      }],
      "scroll-mb": [{
        "scroll-mb": w()
      }],
      "scroll-ml": [{
        "scroll-ml": w()
      }],
      "scroll-p": [{
        "scroll-p": w()
      }],
      "scroll-px": [{
        "scroll-px": w()
      }],
      "scroll-py": [{
        "scroll-py": w()
      }],
      "scroll-ps": [{
        "scroll-ps": w()
      }],
      "scroll-pe": [{
        "scroll-pe": w()
      }],
      "scroll-pbs": [{
        "scroll-pbs": w()
      }],
      "scroll-pbe": [{
        "scroll-pbe": w()
      }],
      "scroll-pt": [{
        "scroll-pt": w()
      }],
      "scroll-pr": [{
        "scroll-pr": w()
      }],
      "scroll-pb": [{
        "scroll-pb": w()
      }],
      "scroll-pl": [{
        "scroll-pl": w()
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
        "will-change": ["auto", "scroll", "contents", "transform", G, _]
      }],
      fill: [{
        fill: ["none", ...z()]
      }],
      "stroke-w": [{
        stroke: [ae, bu, Io, Px]
      }],
      stroke: [{
        stroke: ["none", ...z()]
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
var twMerge = createTailwindMerge(getDefaultConfig);
// cn (minified: he) — ──── App: cn(), Button, reload/loading indicators, Input, Label, colour picker; workflow list cards, offline banners; create/edit dialogs; flow tree renderer (drag/drop, clipboard, zoom); access rules, triggers, resource hooks, parameter editors; flow-path helpers; App (acquireVsCodeApi messaging); mount ────
// cn (minified: he) — Joins class names (clsx) and resolves Tailwind conflicts (tailwind-merge); the shadcn-style `cn` helper.
function cn(...classes) {
  return twMerge(clsx(classes));
}
// jsxButton (minified: sb) — the jsx runtime for the Button module. Below it: `buttonVariants` (Button styles by variant — default / secondary / destructive / ghost / link — and size) and `Button` (a <button> styled by them; forwards its ref).
var jsxButton = V(Q()),
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
    ...rest
  }, ref) => (0, jsxButton.jsx)("button", {
    className: cn(buttonVariants({
      variant: variant,
      size: size,
      className: className
    })),
    ref: ref,
    ...rest
  }));
Button.displayName = "Button";
var jsxLoading = V(Q());
// useLingeringFlag (minified: ib) — Follows a loading flag but keeps it true for at least `minMs` after it turned on, so a quick reload still shows its spinner.
function useLingeringFlag(active, minMs = 600) {
  let [shown, setShown] = (0, ReactForLoading.useState)(active),
    [since, setSince] = (0, ReactForLoading.useState)(0);
  return (0, ReactForLoading.useEffect)(() => {
    if (active) {
      setShown(!0), setSince(Date.now());
      return;
    }
    let remaining = minMs - (Date.now() - since);
    if (remaining <= 0) {
      setShown(!1);
      return;
    }
    let timer = setTimeout(() => setShown(!1), remaining);
    return () => clearTimeout(timer);
  }, [active]), shown;
}
// ReloadButton (minified: Li) — Reload icon button; while loading it spins and reads "Reloading…".
function ReloadButton({
  loading: loading,
  onClick: onClick,
  title = "Reload"
}) {
  let busy = useLingeringFlag(loading);
  return (0, jsxLoading.jsxs)(Button, {
    variant: "ghost",
    size: busy ? "sm" : "icon",
    onClick: onClick,
    disabled: busy,
    title: busy ? "Reloading\u2026" : title,
    "aria-busy": busy,
    className: cn(busy && "gap-1.5 px-2 text-xs text-muted-foreground disabled:opacity-100"),
    children: [(0, jsxLoading.jsx)(RefreshCwIcon, {
      className: cn("h-4 w-4", busy && "animate-spin")
    }), busy && "Reloading\u2026"]
  });
}
// LoadingBar (minified: wi) — Thin pulsing progress bar shown while a reload runs.
function LoadingBar({
  loading: loading
}) {
  let busy = useLingeringFlag(loading);
  return (0, jsxLoading.jsx)("div", {
    className: "h-0.5 w-full overflow-hidden",
    "aria-hidden": !0,
    children: busy && (0, jsxLoading.jsx)("div", {
      className: "h-full w-full animate-pulse bg-[var(--vscode-progressBar-background)]"
    })
  });
}
var ReactForInput = V(Fe());
// jsxInput (minified: cb) — the jsx runtime for the Input module; `Input` is a styled text <input> that forwards its ref.
var jsxInput = V(Q()),
  Input = (0, ReactForInput.forwardRef)(({
    className: className,
    type: type,
    ...rest
  }, ref) => (0, jsxInput.jsx)("input", {
    type: type,
    className: cn("flex h-9 w-full rounded-md border border-border bg-input px-3 py-1 text-sm text-input-foreground transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50", className),
    ref: ref,
    ...rest
  }));
Input.displayName = "Input";
// jsxWorkflowList (minified: ue) — the jsx runtime for the workflow list. `MAX_CARD_STAGES`: how many stage chips a workflow card shows before "+N".
var jsxWorkflowList = V(Q()),
  MAX_CARD_STAGES = 5;
// StageChip (minified: z1) — One stage chip on a workflow card, in the stage's colour.
function StageChip({
  stage: stage
}) {
  let color = stage.color;
  return (0, jsxWorkflowList.jsx)("span", {
    className: "text-[11px] rounded px-2 py-0.5 whitespace-nowrap",
    style: color ? {
      backgroundColor: color,
      color: "#fff"
    } : void 0,
    title: stage.stage,
    children: stage.label
  });
}
// WorkflowCard (minified: U1) — A workflow's card in the list: name, status, the resources it is attached to, stage / global action counts and stage chips.
function WorkflowCard({
  workflow: workflow,
  attachedTo: attachedTo,
  onOpen: onOpen
}) {
  let shownStages = workflow.stages.slice(0, MAX_CARD_STAGES),
    hiddenCount = workflow.stages.length - shownStages.length;
  return (0, jsxWorkflowList.jsxs)("button", {
    type: "button",
    onClick: onOpen,
    className: "flex flex-col text-left gap-3 rounded-lg border border-border bg-card p-4 cursor-pointer transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
    children: [(0, jsxWorkflowList.jsxs)("div", {
      className: "flex items-start justify-between gap-2",
      children: [(0, jsxWorkflowList.jsx)("h2", {
        className: "m-0 text-base font-semibold text-foreground",
        children: workflow.name
      }), workflow.status && (0, jsxWorkflowList.jsx)("span", {
        className: "text-[11px] rounded px-1.5 py-0.5 bg-muted text-muted-foreground shrink-0",
        children: workflow.status
      })]
    }), attachedTo !== null && attachedTo.length > 0 && (0, jsxWorkflowList.jsxs)("div", {
      className: "flex items-center gap-1 text-xs text-muted-foreground min-w-0",
      children: [(0, jsxWorkflowList.jsx)(BoxesIcon, {
        className: "h-3.5 w-3.5 shrink-0"
      }), (0, jsxWorkflowList.jsxs)("span", {
        className: "truncate",
        title: attachedTo.join(", "),
        children: [attachedTo.slice(0, 3).join(", "), attachedTo.length > 3 ? ` +${attachedTo.length - 3}` : ""]
      })]
    }), (0, jsxWorkflowList.jsxs)("div", {
      className: "flex items-center gap-3 text-xs text-muted-foreground",
      children: [(0, jsxWorkflowList.jsxs)("span", {
        className: "flex items-center gap-1",
        children: [(0, jsxWorkflowList.jsx)(LayersIcon, {
          className: "h-3.5 w-3.5"
        }), workflow.stageCount, " stage", workflow.stageCount === 1 ? "" : "s"]
      }), (0, jsxWorkflowList.jsxs)("span", {
        className: "flex items-center gap-1",
        children: [(0, jsxWorkflowList.jsx)(MousePointerClickIcon, {
          className: "h-3.5 w-3.5"
        }), workflow.globalActionCount, " global action", workflow.globalActionCount === 1 ? "" : "s"]
      })]
    }), workflow.stages.length > 0 && (0, jsxWorkflowList.jsxs)("div", {
      className: "flex flex-wrap gap-1.5",
      children: [shownStages.map(stage => (0, jsxWorkflowList.jsx)(StageChip, {
        stage: stage
      }, stage.stage)), hiddenCount > 0 && (0, jsxWorkflowList.jsxs)("span", {
        className: "text-[11px] rounded px-2 py-0.5 bg-muted text-muted-foreground",
        children: ["+", hiddenCount]
      })]
    })]
  });
}
// resourcesUsingWorkflow (minified: q1) — Names of the resources whose workflow, or one of whose lifecycle hooks, is this workflow (sorted); null while bindings are not loaded.
function resourcesUsingWorkflow(bindings, workflowId) {
  return bindings ? bindings.filter(binding => binding.workflowId === workflowId || binding.hooks.some(hook => hook.entries.some(entry => entry.workflowId === workflowId))).map(binding => binding.resource).sort((binding, hook) => binding.localeCompare(hook)) : null;
}
// WorkflowListView (minified: fb) — The Workflows list screen: header (search, New workflow, Show files, Reload), an optional banner and tag, and a grid of workflow cards. `bindings` (resource ↔ workflow links) labels each card with its resources.
function WorkflowListView({
  banner: banner,
  tag: tag,
  workflows: workflows,
  bindings: bindings,
  instanceName: instanceName,
  loading: loading,
  error: error,
  search: search,
  onSearchChange: onSearchChange,
  onOpen: onOpen,
  onRefresh: onRefresh,
  onRevealFiles: onRevealFiles,
  onCreate: onCreate
}) {
  return (0, jsxWorkflowList.jsxs)("div", {
    className: "p-4",
    children: [banner && (0, jsxWorkflowList.jsx)("div", {
      className: "mb-3",
      children: banner
    }), (0, jsxWorkflowList.jsxs)("header", {
      className: "flex flex-wrap justify-between items-start gap-4 mb-6",
      children: [(0, jsxWorkflowList.jsxs)("div", {
        children: [(0, jsxWorkflowList.jsxs)("h1", {
          className: "m-0 flex items-center gap-2 text-xl font-semibold text-foreground",
          children: ["Workflows", tag]
        }), (0, jsxWorkflowList.jsx)("p", {
          className: "m-0 mt-1 text-sm text-muted-foreground",
          children: instanceName ? `Automation pipelines on ${instanceName}` : "Automation pipelines on this Saturn instance"
        })]
      }), (0, jsxWorkflowList.jsxs)("div", {
        className: "flex items-center gap-3",
        children: [(0, jsxWorkflowList.jsx)(Input, {
          type: "text",
          value: search,
          onChange: changeEvent => onSearchChange(changeEvent.target.value),
          placeholder: "Search workflows...",
          className: "w-56"
        }), (0, jsxWorkflowList.jsxs)(Button, {
          onClick: onCreate,
          className: "gap-1",
          children: [(0, jsxWorkflowList.jsx)(PlusIcon, {
            className: "h-4 w-4"
          }), "New workflow"]
        }), (0, jsxWorkflowList.jsx)(Button, {
          variant: "ghost",
          size: "icon",
          onClick: onRevealFiles,
          title: "Show this instance's files in your file browser",
          children: (0, jsxWorkflowList.jsx)(FolderOpenIcon, {
            className: "h-4 w-4"
          })
        }), (0, jsxWorkflowList.jsx)(ReloadButton, {
          loading: loading,
          onClick: onRefresh,
          title: "Reload workflows"
        })]
      })]
    }), (0, jsxWorkflowList.jsx)(LoadingBar, {
      loading: loading && workflows.length > 0
    }), error && (0, jsxWorkflowList.jsx)("p", {
      className: "text-sm text-destructive m-0 mb-4",
      children: error
    }), loading && workflows.length === 0 ? (0, jsxWorkflowList.jsx)("p", {
      className: "text-sm text-muted-foreground m-0",
      children: "Loading workflows\u2026"
    }) : workflows.length === 0 ? (0, jsxWorkflowList.jsx)("p", {
      className: "text-sm text-muted-foreground m-0",
      children: search ? "No workflows match your search." : "No workflows found."
    }) : (0, jsxWorkflowList.jsx)("div", {
      className: "grid gap-4 grid-cols-[repeat(auto-fill,minmax(260px,1fr))]",
      children: workflows.map(workflow => (0, jsxWorkflowList.jsx)(WorkflowCard, {
        workflow: workflow,
        attachedTo: resourcesUsingWorkflow(bindings, workflow.id),
        onOpen: () => onOpen(workflow)
      }, workflow.id))
    })]
  });
}
var jsxOffline = V(Q());
// OfflineBanner (minified: Nf) — Banner about offline work: "synced" success note, "instance not reachable" warning, or edits still waiting to be pushed (with Show files / Retry).
function OfflineBanner({
  offline: offline,
  pending: pending,
  synced = "",
  onDismissSynced: onDismissSynced,
  onRetry: onRetry,
  onRevealFiles: onRevealFiles
}) {
  if (synced && !offline && pending.length === 0) return (0, jsxOffline.jsxs)("div", {
    className: "flex items-start gap-2 rounded-md border border-emerald-500/60 bg-emerald-500/10 px-3 py-2",
    children: [(0, jsxOffline.jsx)(CircleCheckIcon, {
      className: "h-4 w-4 shrink-0 mt-0.5 text-emerald-500"
    }), (0, jsxOffline.jsx)("p", {
      className: "m-0 flex-1 text-xs text-foreground",
      children: synced
    }), (0, jsxOffline.jsx)("button", {
      type: "button",
      onClick: onDismissSynced,
      title: "Dismiss",
      className: "shrink-0 bg-transparent border-0 p-0.5 cursor-pointer text-muted-foreground hover:text-foreground",
      children: (0, jsxOffline.jsx)(XIcon, {
        className: "h-3.5 w-3.5"
      })
    })]
  });
  if (!offline && pending.length === 0) return null;
  let editCount = pending.reduce((sum, item) => sum + item.edits, 0),
    workflowNames = pending.map(item => item.workflowName).join(", ");
  return (0, jsxOffline.jsxs)("div", {
    className: `flex items-start gap-2 rounded-md border px-3 py-2 ${offline ? "border-amber-500/60 bg-amber-500/10" : "border-border bg-card"}`,
    children: [offline ? (0, jsxOffline.jsx)(CloudOffIcon, {
      className: "h-4 w-4 shrink-0 mt-0.5 text-amber-500"
    }) : (0, jsxOffline.jsx)(CloudUploadIcon, {
      className: "h-4 w-4 shrink-0 mt-0.5 text-muted-foreground"
    }), (0, jsxOffline.jsxs)("div", {
      className: "min-w-0 flex-1",
      children: [(0, jsxOffline.jsx)("p", {
        className: "m-0 text-xs text-foreground",
        children: offline ? "The instance is not reachable. Edits are saved to the offline copy." : "Offline work is waiting to go to the instance."
      }), pending.length > 0 && (0, jsxOffline.jsxs)("p", {
        className: "m-0 mt-0.5 text-[11px] text-muted-foreground",
        children: [editCount, " ", editCount === 1 ? "change" : "changes", " in ", workflowNames, ". When the connection returns, they are compared with the instance's version \u2014 anything that merges cleanly is applied, and anything that disagrees is shown before a single value is overwritten."]
      }), offline && pending.length === 0 && (0, jsxOffline.jsx)("p", {
        className: "m-0 mt-0.5 text-[11px] text-muted-foreground",
        children: "Only workflows already read at least once are available offline."
      })]
    }), (0, jsxOffline.jsxs)("div", {
      className: "flex shrink-0 items-center gap-1",
      children: [(0, jsxOffline.jsxs)("button", {
        type: "button",
        onClick: onRevealFiles,
        title: "Show the offline copies in your file browser",
        className: "flex items-center gap-1 rounded border border-border bg-card px-1.5 py-0.5 text-[11px] text-foreground cursor-pointer hover:opacity-80",
        children: [(0, jsxOffline.jsx)(FolderOpenIcon, {
          className: "h-3 w-3"
        }), "Show files"]
      }), (0, jsxOffline.jsxs)("button", {
        type: "button",
        onClick: onRetry,
        title: "Try the instance again",
        className: "flex items-center gap-1 rounded border border-border bg-card px-1.5 py-0.5 text-[11px] text-foreground cursor-pointer hover:opacity-80",
        children: [(0, jsxOffline.jsx)(RefreshCwIcon, {
          className: "h-3 w-3"
        }), "Retry"]
      })]
    })]
  });
}
// OfflinePill (minified: Tf) — Small pill for a header: "Offline · N unsent" or "N to sync"; clicking retries the connection.
function OfflinePill({
  offline: offline,
  pendingEdits: pendingEdits,
  onRetry: onRetry,
  className: className
}) {
  if (!offline && pendingEdits === 0) return null;
  let text = offline ? pendingEdits > 0 ? `Offline \xB7 ${pendingEdits} unsent` : "Offline" : `${pendingEdits} to sync`;
  return (0, jsxOffline.jsxs)("button", {
    type: "button",
    onClick: onRetry,
    title: offline ? "Not connected to the instance. Edits are saved to the offline copy. Click to try again." : "Offline work is still being pushed to the instance. Click to try again.",
    className: cn("flex items-center gap-1 shrink-0 rounded-full border px-2 py-0.5 text-[11px] cursor-pointer", offline ? "border-amber-500/60 bg-amber-500/15 text-amber-500" : "border-border bg-card text-muted-foreground", className),
    children: [offline ? (0, jsxOffline.jsx)(CloudOffIcon, {
      className: "h-3 w-3"
    }) : (0, jsxOffline.jsx)(CloudUploadIcon, {
      className: "h-3 w-3"
    }), text]
  });
}
var ReactForCreateDialog = V(Fe());
var ReactForLabel = V(Fe());
// jsxLabel (minified: mb) — the jsx runtime for the Label module; `Label` is a styled <label> that forwards its ref.
var jsxLabel = V(Q()),
  Label = (0, ReactForLabel.forwardRef)(({
    className: className,
    ...rest
  }, ref) => (0, jsxLabel.jsx)("label", {
    className: cn("text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className),
    ref: ref,
    ...rest
  }));
Label.displayName = "Label";
var ReactForColour = V(Fe());
// jsxColour (minified: ga) — the jsx runtime for the colour picker. `COLOUR_SWATCHES`: its preset swatches (Tailwind 500 shades); the first is the default stage colour.
var jsxColour = V(Q()),
  COLOUR_SWATCHES = ["#64748b", "#6b7280", "#0ea5e9", "#3b82f6", "#6366f1", "#a855f7", "#ec4899", "#f43f5e", "#ef4444", "#f97316", "#f59e0b", "#eab308", "#84cc16", "#22c55e", "#10b981", "#14b8a6"];
// normalizeHexColour (minified: Ci) — Turns "#abc" / "aabbcc" style input into "#aabbcc" (lower case); null if it isn't a hex colour.
function normalizeHexColour(input) {
  let hex = input.trim().replace(/^#/, "").toLowerCase();
  return /^[0-9a-f]{3}$/.test(hex) ? `#${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}` : /^[0-9a-f]{6}$/.test(hex) ? `#${hex}` : null;
}
// ColourPicker (minified: Dr) — Colour field: preset swatches, a native custom picker, a hex text box (keeps the last valid colour while the typed one is invalid) and "None" (empty string).
function ColourPicker({
  value: value,
  onChange: onChange,
  label = "Colour"
}) {
  let [draft, setDraft] = (0, ReactForColour.useState)(value);
  (0, ReactForColour.useEffect)(() => {
    setDraft(value);
  }, [value]);
  let typeHex = text => {
      setDraft(text);
      let hex = normalizeHexColour(text);
      hex && onChange(hex), text.trim() === "" && onChange("");
    },
    invalid = draft.trim() !== "" && normalizeHexColour(draft) === null;
  return (0, jsxColour.jsxs)("div", {
    className: "flex flex-col gap-1.5",
    children: [(0, jsxColour.jsx)(Label, {
      children: label
    }), (0, jsxColour.jsx)("div", {
      className: "grid grid-cols-8 gap-1.5",
      children: COLOUR_SWATCHES.map(swatch => (0, jsxColour.jsx)("button", {
        type: "button",
        onClick: () => onChange(swatch),
        title: swatch,
        "aria-label": swatch,
        "aria-pressed": value.toLowerCase() === swatch,
        style: {
          backgroundColor: swatch
        },
        className: `flex items-center justify-center h-6 rounded border-2 cursor-pointer ${value.toLowerCase() === swatch ? "border-foreground" : "border-transparent"}`,
        children: value.toLowerCase() === swatch && (0, jsxColour.jsx)(CheckIcon, {
          className: "h-3 w-3 text-white drop-shadow"
        })
      }, swatch))
    }), (0, jsxColour.jsxs)("div", {
      className: "flex items-center gap-1.5",
      children: [(0, jsxColour.jsxs)("label", {
        className: "flex items-center gap-1 rounded border border-border bg-card px-1.5 py-1 text-[11px] text-foreground cursor-pointer",
        title: "Pick any colour",
        children: [(0, jsxColour.jsx)(PipetteIcon, {
          className: "h-3 w-3"
        }), "Custom", (0, jsxColour.jsx)("input", {
          type: "color",
          value: normalizeHexColour(value) ?? "#64748b",
          onChange: changeEvent => onChange(changeEvent.target.value.toLowerCase()),
          className: "h-4 w-6 cursor-pointer border-none bg-transparent p-0"
        })]
      }), (0, jsxColour.jsx)(Input, {
        value: draft,
        onChange: changeEvent => typeHex(changeEvent.target.value),
        placeholder: "#64748b",
        spellCheck: !1,
        "aria-label": "Colour as hex",
        "aria-invalid": invalid,
        className: `h-7 w-28 font-mono text-xs ${invalid ? "border-destructive" : ""}`
      }), (0, jsxColour.jsxs)("button", {
        type: "button",
        onClick: () => onChange(""),
        title: "No colour",
        className: "flex items-center gap-1 rounded border border-border bg-card px-1.5 py-1 text-[11px] text-muted-foreground cursor-pointer hover:text-foreground",
        children: [(0, jsxColour.jsx)(XIcon, {
          className: "h-3 w-3"
        }), "None"]
      }), (0, jsxColour.jsx)("span", {
        className: "ml-auto h-6 w-6 rounded border border-border",
        style: {
          backgroundColor: normalizeHexColour(value) ?? "transparent"
        },
        title: value || "No colour"
      })]
    }), invalid && (0, jsxColour.jsxs)("p", {
      className: "m-0 text-[11px] text-destructive",
      children: ["Not a colour \u2014 six hex digits, like ", (0, jsxColour.jsx)("code", {
        children: "#0ea5e9"
      }), ". The last valid one is still selected."]
    })]
  });
}
var jsxCreateDialog = V(Q());
// stageKeyFromLabel (minified: F1) — The stage key a label becomes (what a record's `status` holds): lower case, non-alphanumerics as "_", at most 64 characters.
function stageKeyFromLabel(label) {
  return label.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 64);
}
// CreateWorkflowDialog (minified: gb) — "New workflow" dialog: name, first stage and its colour; `onSubmit(name, stageLabel, colour)`. Refuses while offline, since the instance assigns the id.
function CreateWorkflowDialog({
  saving: saving,
  error: error,
  offline: offline,
  onCancel: onCancel,
  onSubmit: onSubmit
}) {
  let [workflowName, setWorkflowName] = (0, ReactForCreateDialog.useState)(""),
    [stageLabel, setStageLabel] = (0, ReactForCreateDialog.useState)("Draft"),
    [stageColour, setStageColour] = (0, ReactForCreateDialog.useState)(COLOUR_SWATCHES[0]),
    stageKey = (0, ReactForCreateDialog.useMemo)(() => stageKeyFromLabel(stageLabel), [stageLabel]),
    canSubmit = workflowName.trim().length > 0 && !saving && !offline,
    submit = () => {
      canSubmit && onSubmit(workflowName, stageLabel, stageColour);
    };
  return (0, jsxCreateDialog.jsx)("div", {
    className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4",
    children: (0, jsxCreateDialog.jsxs)("div", {
      className: "flex flex-col w-full max-w-md rounded-lg border border-border bg-card shadow-lg",
      children: [(0, jsxCreateDialog.jsxs)("header", {
        className: "flex items-start justify-between gap-3 p-4 border-b border-border",
        children: [(0, jsxCreateDialog.jsxs)("div", {
          className: "min-w-0",
          children: [(0, jsxCreateDialog.jsx)("h2", {
            className: "m-0 text-base font-semibold text-foreground",
            children: "New workflow"
          }), (0, jsxCreateDialog.jsx)("p", {
            className: "m-0 mt-0.5 text-xs text-muted-foreground",
            children: "A state machine for one kind of record."
          })]
        }), (0, jsxCreateDialog.jsx)(Button, {
          variant: "ghost",
          size: "icon",
          onClick: onCancel,
          title: "Cancel",
          children: (0, jsxCreateDialog.jsx)(XIcon, {
            className: "h-4 w-4"
          })
        })]
      }), (0, jsxCreateDialog.jsxs)("div", {
        className: "p-4 flex flex-col gap-4",
        children: [offline && (0, jsxCreateDialog.jsx)("p", {
          className: "m-0 rounded-md border border-amber-500/60 bg-amber-500/10 px-3 py-2 text-xs text-amber-500",
          children: "The instance is not reachable. A workflow can only be created online, because the instance assigns its id \u2014 there is nothing for an offline copy to be a copy of until it exists."
        }), (0, jsxCreateDialog.jsxs)("div", {
          className: "flex flex-col gap-1.5",
          children: [(0, jsxCreateDialog.jsx)(Label, {
            htmlFor: "workflow-name",
            children: "Name"
          }), (0, jsxCreateDialog.jsx)(Input, {
            id: "workflow-name",
            autoFocus: !0,
            value: workflowName,
            placeholder: "Support Tickets",
            onChange: changeEvent => setWorkflowName(changeEvent.target.value),
            onKeyDown: keyEvent => {
              keyEvent.key === "Enter" && submit();
            }
          }), (0, jsxCreateDialog.jsx)("p", {
            className: "m-0 text-[11px] text-muted-foreground",
            children: "The display name. Safe to change later."
          })]
        }), (0, jsxCreateDialog.jsxs)("div", {
          className: "flex flex-col gap-1.5",
          children: [(0, jsxCreateDialog.jsx)(Label, {
            htmlFor: "workflow-stage",
            children: "First stage"
          }), (0, jsxCreateDialog.jsx)(Input, {
            id: "workflow-stage",
            value: stageLabel,
            placeholder: "Draft",
            onChange: changeEvent => setStageLabel(changeEvent.target.value),
            onKeyDown: keyEvent => {
              keyEvent.key === "Enter" && submit();
            }
          }), stageLabel.trim().length > 0 ? (0, jsxCreateDialog.jsxs)("p", {
            className: "m-0 text-[11px] text-muted-foreground",
            children: ["Where a new record starts. A record's ", (0, jsxCreateDialog.jsx)("code", {
              children: "status"
            }), " will hold", " ", (0, jsxCreateDialog.jsx)("code", {
              children: stageKey || "\u2014"
            }), ", so other systems see that string."]
          }) : (0, jsxCreateDialog.jsx)("p", {
            className: "m-0 text-[11px] text-muted-foreground",
            children: "Left empty, the workflow starts with no stages \u2014 you will need to add one before it can do anything."
          })]
        }), stageLabel.trim().length > 0 && (0, jsxCreateDialog.jsx)(ColourPicker, {
          value: stageColour,
          onChange: setStageColour,
          label: "First stage colour"
        }), error && (0, jsxCreateDialog.jsx)("div", {
          className: "rounded-md border border-destructive/50 p-3",
          children: (0, jsxCreateDialog.jsx)("p", {
            className: "m-0 text-xs text-destructive",
            children: error
          })
        })]
      }), (0, jsxCreateDialog.jsxs)("footer", {
        className: "flex items-center justify-end gap-2 p-4 border-t border-border",
        children: [(0, jsxCreateDialog.jsx)(Button, {
          variant: "ghost",
          onClick: onCancel,
          disabled: saving,
          children: "Cancel"
        }), (0, jsxCreateDialog.jsx)(Button, {
          onClick: submit,
          disabled: !canSubmit,
          children: saving ? "Creating\u2026" : "Create workflow"
        })]
      })]
    })
  });
}
var ReactForApp = V(Fe());
var ReactForColumns = V(Fe());
var jsxColumns = V(Q());
// EditorColumn (minified: Vl) — A titled, scrolling column of the workflow editor, with an optional header action.
function EditorColumn({
  title: title,
  children: children,
  className: className,
  action: action
}) {
  return (0, jsxColumns.jsxs)("div", {
    className: cn("flex flex-col min-w-0 min-h-0", className),
    children: [(0, jsxColumns.jsxs)("div", {
      className: "flex items-center justify-between gap-2 pb-2 mb-3 border-b border-border",
      children: [(0, jsxColumns.jsx)("p", {
        className: "text-xs uppercase tracking-wider text-muted-foreground m-0",
        children: title
      }), action]
    }), (0, jsxColumns.jsx)("div", {
      className: "flex flex-col flex-1 min-h-0 gap-2 overflow-y-auto pr-1",
      children: children
    })]
  });
}
// AddButton (minified: Lu) — Small "+ label" button used in column headers.
function AddButton({
  label: label,
  onClick: onClick
}) {
  return (0, jsxColumns.jsxs)("button", {
    type: "button",
    onClick: onClick,
    className: "flex items-center gap-1 rounded border border-border bg-card text-foreground text-[11px] px-1.5 py-0.5 cursor-pointer hover:opacity-80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
    children: [(0, jsxColumns.jsx)(PlusIcon, {
      className: "h-3 w-3"
    }), label]
  });
}
// EmptyNote (minified: ha) — Muted one-line note for an empty column.
function EmptyNote({
  children: children
}) {
  return (0, jsxColumns.jsx)("p", {
    className: "text-sm text-muted-foreground m-0",
    children: children
  });
}
// draggedItemIndex (minified: Br) — Index of the list item being dragged (shared by all `ListItem`s); null when no drag is under way.
var draggedItemIndex = null;
// ListItem (minified: wu) — A selectable row in an editor column (label, mono sub-line, badge, accent colour). With `index` and `onMove` it can be dragged to reorder: `onMove(from, to)`.
function ListItem({
  label: label,
  sub: sub,
  badge: badge,
  accent: accent,
  selected: selected,
  onClick: onClick,
  index: index,
  onMove: onMove
}) {
  let [dropSide, setDropSide] = (0, ReactForColumns.useState)(null),
    reorderable = typeof index == "number" && !!onMove;
  return (0, jsxColumns.jsxs)("button", {
    type: "button",
    onClick: onClick,
    ...(reorderable ? {
      draggable: !0,
      onDragStart: dragEvent => {
        draggedItemIndex = index, dragEvent.dataTransfer.effectAllowed = "move", dragEvent.dataTransfer.setData("text/plain", String(index));
      },
      onDragEnd: () => {
        draggedItemIndex = null, setDropSide(null);
      },
      onDragOver: dragEvent => {
        if (draggedItemIndex === null || draggedItemIndex === index) return;
        dragEvent.preventDefault(), dragEvent.dataTransfer.dropEffect = "move";
        let rect = dragEvent.currentTarget.getBoundingClientRect();
        setDropSide(dragEvent.clientY < rect.top + rect.height / 2 ? "before" : "after");
      },
      onDragLeave: () => setDropSide(null),
      onDrop: dragEvent => {
        dragEvent.preventDefault();
        let from = draggedItemIndex,
          side = dropSide;
        draggedItemIndex = null, setDropSide(null), !(from === null || from === index) && onMove(from, side === "after" ? index + 1 : index);
      }
    } : {}),
    className: cn("w-full text-left rounded-md px-3 py-2 border cursor-pointer transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring", selected ? "bg-primary text-primary-foreground" : "bg-card text-foreground", dropSide === "before" ? "border-t-2 border-t-primary border-border" : dropSide === "after" ? "border-b-2 border-b-primary border-border" : "border-border"),
    style: accent ? {
      borderLeft: `4px solid ${accent}`
    } : void 0,
    children: [(0, jsxColumns.jsxs)("span", {
      className: "flex items-center justify-between gap-2",
      children: [reorderable && (0, jsxColumns.jsx)(GripVerticalIcon, {
        className: cn("h-3.5 w-3.5 shrink-0 cursor-grab", selected ? "opacity-70" : "text-muted-foreground")
      }), (0, jsxColumns.jsx)("span", {
        className: "text-sm font-medium truncate flex-1",
        children: label
      }), badge && (0, jsxColumns.jsx)("span", {
        className: cn("text-[11px] rounded px-1.5 py-0.5 shrink-0", selected ? "bg-black/20" : "bg-muted text-muted-foreground"),
        children: badge
      })]
    }), sub && (0, jsxColumns.jsx)("span", {
      className: cn("block text-xs font-mono truncate mt-0.5", selected ? "opacity-80" : "text-muted-foreground"),
      children: sub
    })]
  });
}
var ReactForActionPanel = V(Fe());
var ReactForFlowTree = V(Fe());
var ReactForStepForms = V(Fe());
var jsxSteps = V(Q());
// PropertyMapEditor (minified: P1) — Key/value editor for a JSON object parameter (e.g. property_updater's properties): add a row, edit values, remove rows. Writes pretty JSON, or "" when empty.
function PropertyMapEditor({
  value: value,
  onChange: onChange
}) {
  let [newKey, setNewKey] = (0, ReactForStepForms.useState)(""),
    [newValue, setNewValue] = (0, ReactForStepForms.useState)(""),
    rows = (0, ReactForStepForms.useMemo)(() => {
      if (!value.trim()) return [];
      try {
        let parsed = JSON.parse(value);
        return !parsed || typeof parsed != "object" || Array.isArray(parsed) ? [] : Object.entries(parsed).map(([key, val]) => [key, typeof val == "string" ? val : JSON.stringify(val)]);
      } catch {
        return [];
      }
    }, [value]),
    notAnObject = value.trim() !== "" && rows.length === 0,
    writeRows = nextRows => {
      onChange(nextRows.length === 0 ? "" : JSON.stringify(Object.fromEntries(nextRows), null, 2));
    },
    addRow = () => {
      let key = newKey.trim();
      key && (writeRows([...rows.filter(([existingKey]) => existingKey !== key), [key, newValue]]), setNewKey(""), setNewValue(""));
    };
  return (0, jsxSteps.jsxs)("div", {
    className: "flex flex-col gap-2",
    children: [(0, jsxSteps.jsxs)("div", {
      className: "flex items-start gap-2",
      children: [(0, jsxSteps.jsx)(Input, {
        value: newKey,
        onChange: changeEvent => setNewKey(changeEvent.target.value),
        onKeyDown: keyEvent => {
          keyEvent.key === "Enter" && (keyEvent.preventDefault(), addRow());
        },
        placeholder: "Resource Property",
        spellCheck: !1
      }), (0, jsxSteps.jsx)(Input, {
        value: newValue,
        onChange: changeEvent => setNewValue(changeEvent.target.value),
        onKeyDown: keyEvent => {
          keyEvent.key === "Enter" && (keyEvent.preventDefault(), addRow());
        },
        placeholder: "Property Value",
        spellCheck: !1
      }), (0, jsxSteps.jsxs)(Button, {
        variant: "secondary",
        onClick: addRow,
        disabled: !newKey.trim(),
        className: "shrink-0 gap-1",
        children: [(0, jsxSteps.jsx)(PlusIcon, {
          className: "h-3.5 w-3.5"
        }), "Add"]
      })]
    }), rows.length > 0 && (0, jsxSteps.jsx)("div", {
      className: "flex flex-col gap-1.5",
      children: rows.map(([rowKey, rowValue]) => (0, jsxSteps.jsxs)("div", {
        className: "flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2",
        children: [(0, jsxSteps.jsx)("span", {
          className: "font-mono text-xs font-bold text-foreground shrink-0",
          children: rowKey
        }), (0, jsxSteps.jsx)(ArrowRightIcon, {
          className: "h-3.5 w-3.5 text-muted-foreground shrink-0"
        }), (0, jsxSteps.jsx)(Input, {
          value: rowValue,
          onChange: changeEvent => writeRows(rows.map(([otherKey, otherValue]) => otherKey === rowKey ? [otherKey, changeEvent.target.value] : [otherKey, otherValue])),
          spellCheck: !1,
          className: "h-7 flex-1"
        }), (0, jsxSteps.jsx)(Button, {
          variant: "ghost",
          size: "icon",
          onClick: () => writeRows(rows.filter(([otherKey]) => otherKey !== rowKey)),
          title: `Remove ${rowKey}`,
          className: "h-7 w-7 shrink-0",
          children: (0, jsxSteps.jsx)(Trash2Icon, {
            className: "h-3.5 w-3.5"
          })
        })]
      }, rowKey))
    }), notAnObject && (0, jsxSteps.jsx)("p", {
      className: "m-0 text-[11px] text-destructive",
      children: "The current value isn't a JSON object, so it can't be shown as rows. Adding a property will replace it."
    })]
  });
}
// OP_REFERENCE (minified: $t) — operator name of the Reference block. With OP_EACH / OP_IF / OP_SERIES / OP_PARALLEL: the built-in flow blocks (not in the instance's /Operators list); the *_BLOCK objects are their entries in the operator picker, and DEFAULT_IF_FUNCTION is the starting evaluator code of a new If / Else block.
// OP_REFERENCE (minified: $t) — Operator names of the built-in flow blocks (not in the instance's /Operators list), and their entries for the operator picker.
var OP_REFERENCE = "reference",
  OP_EACH = "each",
  OP_IF = "if",
  OP_SERIES = "series",
  OP_PARALLEL = "parallel",
  REFERENCE_BLOCK = {
    operator: OP_REFERENCE,
    name: "Reference",
    description: "Runs one of this workflow's reusable commands.",
    icon: null,
    category: "Flow"
  },
  EACH_BLOCK = {
    operator: OP_EACH,
    name: "Each",
    description: "Loops over a collection, running the same steps for every item.",
    icon: null,
    category: "Flow"
  },
  IF_BLOCK = {
    operator: OP_IF,
    name: "If / Else",
    description: "Branches the flow \u2014 one path when the test passes, another when it doesn't.",
    icon: null,
    category: "Flow"
  },
  SERIES_BLOCK = {
    operator: OP_SERIES,
    name: "Group (Series)",
    description: "Groups steps that run in order \u2014 a container you can drop steps into.",
    icon: null,
    category: "Flow"
  },
  PARALLEL_BLOCK = {
    operator: OP_PARALLEL,
    name: "Parallel",
    description: "Groups steps that may run at the same time, up to the concurrency you set.",
    icon: null,
    category: "Flow"
  },
  DEFAULT_IF_FUNCTION = `({_flow, _util, _store, _resource, form, _form, _parent, _reference_resource})=>{
  // Your code here
  return true;
}`;
// OperatorIcon (minified: _1) — An operator's SVG icon (markup from the instance), or a grey placeholder square.
function OperatorIcon({
  icon: icon
}) {
  return icon ? (0, jsxSteps.jsx)("span", {
    className: "[&>svg]:h-5 [&>svg]:w-5 inline-flex shrink-0 text-foreground",
    dangerouslySetInnerHTML: {
      __html: icon
    }
  }) : (0, jsxSteps.jsx)("span", {
    className: "inline-block h-5 w-5 rounded bg-muted shrink-0"
  });
}
// ParamField (minified: G1) — One operator parameter in the step dialog, with the right control for it: VS Code editor for code, resource select, lookup checkboxes / radios, key/value map, value select, boolean, textarea or text input; plus the HTML/designer note for designed email content.
function ParamField({
  field: field,
  value: value,
  error: error,
  resourceNames: resourceNames,
  lookupOptions: lookupOptions,
  designed: designed,
  hasDesignTree: hasDesignTree,
  onEditHtml: onEditHtml,
  onOpenDesigner: onOpenDesigner,
  onChange: onChange,
  onEditInEditor: onEditInEditor
}) {
  let inputId = `param-${field.param}`,
    hint = field.description ?? field.lookupHint,
    htmlNote = designed ? (0, jsxSteps.jsxs)("div", {
      className: "flex flex-col gap-1.5 rounded-md border border-border p-2",
      children: [(0, jsxSteps.jsxs)("div", {
        className: "flex items-center gap-1.5",
        children: [(0, jsxSteps.jsx)(PaletteIcon, {
          className: "h-3.5 w-3.5 shrink-0 text-muted-foreground"
        }), (0, jsxSteps.jsx)("span", {
          className: "text-xs text-foreground",
          children: hasDesignTree ? "Designed email" : "HTML content"
        }), (0, jsxSteps.jsx)("span", {
          className: "flex-1"
        }), onEditHtml && (0, jsxSteps.jsxs)("button", {
          type: "button",
          onClick: onEditHtml,
          title: "Open the rendered HTML in an editor \u2014 saving writes it back",
          className: "flex items-center gap-1 rounded border border-border bg-input px-1.5 py-0.5 text-[10px] text-foreground cursor-pointer hover:opacity-80",
          children: [(0, jsxSteps.jsx)(FileCodeCornerIcon, {
            className: "h-3 w-3"
          }), "Edit HTML"]
        }), onOpenDesigner && (0, jsxSteps.jsxs)("button", {
          type: "button",
          onClick: onOpenDesigner,
          title: "Open this workflow in the instance, where the drag-and-drop designer lives",
          className: "flex items-center gap-1 rounded border border-border bg-input px-1.5 py-0.5 text-[10px] text-foreground cursor-pointer hover:opacity-80",
          children: [(0, jsxSteps.jsx)(ExternalLinkIcon, {
            className: "h-3 w-3"
          }), "Open Designer"]
        })]
      }), (0, jsxSteps.jsxs)("p", {
        className: "m-0 text-[11px] text-muted-foreground",
        children: [hasDesignTree ? (0, jsxSteps.jsxs)(jsxSteps.Fragment, {
          children: ["Built in the instance's designer.", (0, jsxSteps.jsx)("strong", {
            className: "text-amber-500",
            children: " Editing the HTML here does not update the design tree"
          }), ", so reopening the designer renders from that tree and overwrites these edits."]
        }) : (0, jsxSteps.jsx)(jsxSteps.Fragment, {
          children: "Hand-written HTML \u2014 no design tree, so this editor is the whole story and edits stick."
        }), " Replace the markup with prose to send a plain-text message instead."]
      })]
    }) : null,
    control = (() => {
      if (field.codeLanguage) {
        let lineCount = value ? value.split(`
`).length : 0;
        return (0, jsxSteps.jsxs)("div", {
          className: "flex flex-col gap-2",
          children: [(0, jsxSteps.jsxs)(Button, {
            variant: "secondary",
            onClick: () => onEditInEditor(field),
            className: "justify-start gap-2",
            children: [(0, jsxSteps.jsx)(ExternalLinkIcon, {
              className: "h-4 w-4"
            }), value ? "Edit in VS Code editor" : "Write in VS Code editor"]
          }), value && (0, jsxSteps.jsx)("pre", {
            className: "m-0 max-h-40 overflow-auto rounded-md border border-border bg-muted px-3 py-2 text-[11px] font-mono text-foreground whitespace-pre",
            children: value
          }), (0, jsxSteps.jsx)("p", {
            className: "m-0 text-[11px] text-muted-foreground",
            children: value ? `${lineCount} line${lineCount === 1 ? "" : "s"} \u2014 the editor syncs back here as you type.` : "Opens beside this panel with syntax highlighting; edits sync back automatically."
          })]
        });
      }
      if (field.lookupKind === "resources" && resourceNames.length > 0) return (0, jsxSteps.jsxs)("select", {
        id: inputId,
        value: value,
        onChange: changeEvent => onChange(changeEvent.target.value),
        className: "w-full h-9 rounded-md border border-border bg-input text-foreground px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring",
        children: [(0, jsxSteps.jsx)("option", {
          value: "",
          children: "\u2014 not set \u2014"
        }), resourceNames.map(resourceName => (0, jsxSteps.jsx)("option", {
          value: resourceName,
          children: resourceName
        }, resourceName))]
      });
      if (field.lookupResource) {
        let options = lookupOptions?.[field.lookupResource.resource];
        if (options === void 0) return (0, jsxSteps.jsxs)("p", {
          className: "m-0 text-xs text-muted-foreground",
          children: ["Loading ", field.lookupResource.resource, " options\u2026"]
        });
        if (options) {
          let multiple = field.type === "array",
            selectedIds = (() => {
              if (!value.trim()) return [];
              try {
                let parsed = JSON.parse(value);
                return Array.isArray(parsed) ? parsed.map(String) : [String(parsed)];
              } catch {
                return value.split(",").map(part => part.trim()).filter(Boolean);
              }
            })(),
            setSelected = ids => onChange(multiple ? JSON.stringify(ids) : ids[0] ?? ""),
            missingIds = selectedIds.filter(id => !options.some(option => option.value === id));
          return (0, jsxSteps.jsxs)("div", {
            className: "flex flex-col gap-1 rounded-md border border-border p-2 max-h-52 overflow-y-auto",
            children: [options.length === 0 && (0, jsxSteps.jsxs)("span", {
              className: "text-xs text-muted-foreground",
              children: ["This instance has no ", field.lookupResource.resource, " records."]
            }), options.map(option => (0, jsxSteps.jsxs)("label", {
              className: "flex items-center gap-2 text-xs text-foreground cursor-pointer",
              title: option.value,
              children: [(0, jsxSteps.jsx)("input", {
                type: multiple ? "checkbox" : "radio",
                name: inputId,
                checked: selectedIds.includes(option.value),
                onChange: changeEvent => {
                  if (!multiple) {
                    setSelected([option.value]);
                    return;
                  }
                  setSelected(changeEvent.target.checked ? [...selectedIds, option.value] : selectedIds.filter(id => id !== option.value));
                }
              }), (0, jsxSteps.jsx)("span", {
                className: "truncate",
                children: option.label
              })]
            }, option.value)), missingIds.length > 0 && (0, jsxSteps.jsxs)("span", {
              className: "text-[11px] text-amber-500 font-mono break-all",
              children: [missingIds.length, " selected id", missingIds.length === 1 ? "" : "s", " no longer exist here: ", missingIds.join(", ")]
            })]
          });
        }
      }
      return field.type === "object" ? (0, jsxSteps.jsx)(PropertyMapEditor, {
        value: value,
        onChange: onChange
      }) : field.lookupValues && field.lookupValues.length > 0 ? (0, jsxSteps.jsxs)("select", {
        id: inputId,
        value: value,
        onChange: changeEvent => onChange(changeEvent.target.value),
        className: "w-full h-9 rounded-md border border-border bg-input text-foreground px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring",
        children: [(0, jsxSteps.jsx)("option", {
          value: "",
          children: "\u2014 not set \u2014"
        }), field.lookupValues.map(choice => (0, jsxSteps.jsx)("option", {
          value: choice,
          children: choice
        }, choice))]
      }) : field.type === "boolean" ? (0, jsxSteps.jsxs)("select", {
        id: inputId,
        value: value,
        onChange: changeEvent => onChange(changeEvent.target.value),
        className: "w-full h-9 rounded-md border border-border bg-input text-foreground px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring",
        children: [(0, jsxSteps.jsx)("option", {
          value: "",
          children: "\u2014 not set \u2014"
        }), (0, jsxSteps.jsx)("option", {
          value: "true",
          children: "true"
        }), (0, jsxSteps.jsx)("option", {
          value: "false",
          children: "false"
        })]
      }) : field.type === "array" || field.inputType === "textarea" ? (0, jsxSteps.jsx)("textarea", {
        id: inputId,
        value: value,
        onChange: changeEvent => onChange(changeEvent.target.value),
        rows: field.type === "array" ? 4 : 3,
        spellCheck: !1,
        placeholder: field.type === "array" ? "[]" : void 0,
        className: "w-full rounded-md border border-border bg-input text-foreground px-3 py-2 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-ring"
      }) : (0, jsxSteps.jsx)(Input, {
        id: inputId,
        type: field.sensitive ? "password" : (field.type === "number", "text"),
        value: value,
        onChange: changeEvent => onChange(changeEvent.target.value),
        spellCheck: !1,
        placeholder: field.type === "number" ? "123 or {{ template }}" : void 0
      });
    })();
  return (0, jsxSteps.jsxs)("div", {
    className: "flex flex-col gap-1.5",
    children: [(0, jsxSteps.jsxs)(Label, {
      htmlFor: inputId,
      className: "flex items-center gap-1.5",
      children: [field.label, field.required && (0, jsxSteps.jsx)("span", {
        className: "text-destructive",
        children: "*"
      }), (0, jsxSteps.jsxs)("span", {
        className: "text-[11px] font-normal text-muted-foreground font-mono",
        children: [field.param, field.type ? ` \xB7 ${field.type}` : ""]
      })]
    }), htmlNote, control, hint && (0, jsxSteps.jsx)("p", {
      className: "m-0 text-[11px] text-muted-foreground",
      children: hint
    }), error && (0, jsxSteps.jsx)("p", {
      className: "m-0 text-[11px] text-destructive",
      children: error
    })]
  });
}
// StepDialog (minified: yb) — Add / edit step dialog. Without an operator it shows the searchable operator picker (built-in flow blocks, Reference when the workflow has commands, and the instance's operators, grouped by category); with one, its form (special forms for Each, If / Else, Parallel, Series and Reference). Opens the single code parameter in the VS Code editor straight away; asks for lookup options it needs via `onNeedLookup`.
function StepDialog({
  target: target,
  operators: operators,
  resourceNames: resourceNames,
  saving: saving,
  errors: errors,
  onCancel: onCancel,
  onSubmit: onSubmit,
  onEditInEditor: onEditInEditor,
  externalValues: externalValues,
  initialValues: initialValues,
  onEditHtmlParam: onEditHtmlParam,
  onOpenDesigner: onOpenDesigner,
  saveError: saveError,
  commands: commands,
  lookupOptions: lookupOptions,
  onNeedLookup: onNeedLookup
}) {
  let editing = target.mode === "edit",
    [query, setQuery] = (0, ReactForStepForms.useState)(""),
    [operator, setOperator] = (0, ReactForStepForms.useState)(target.operator ?? null),
    [values, setValues] = (0, ReactForStepForms.useState)({}),
    [delay, setDelay] = (0, ReactForStepForms.useState)(""),
    [loaded, setLoaded] = (0, ReactForStepForms.useState)(!1);
  // When editing, fill the form once from the step's stored values and delay; then ask the host for the lookup options (records of a resource) the chosen operator's parameters need.
  (0, ReactForStepForms.useEffect)(() => {
    !editing || loaded || !initialValues || (setValues(initialValues.values), setDelay(initialValues.delay === null ? "" : String(initialValues.delay)), setLoaded(!0));
  }, [editing, loaded, initialValues]), (0, ReactForStepForms.useEffect)(() => {
    if (!(!operator || !onNeedLookup)) for (let param of operators[operator]?.params ?? []) {
      let lookup = param.lookupResource;
      lookup && lookupOptions?.[lookup.resource] === void 0 && onNeedLookup(lookup);
    }
  }, [operator, operators, lookupOptions, onNeedLookup]);
  let [autoOpened, setAutoOpened] = (0, ReactForStepForms.useState)(!1);
  // An operator with exactly one code parameter opens it in the VS Code editor at once (only once, and when editing only after the stored values are in).
  (0, ReactForStepForms.useEffect)(() => {
    if (!operator || autoOpened || editing && !loaded) return;
    let codeParams = (operators[operator]?.params ?? []).filter(param => param.codeLanguage),
      onlyCode = codeParams.length === 1 ? codeParams[0] : void 0;
    onlyCode && (setAutoOpened(!0), onEditInEditor(onlyCode.param, onlyCode.label, values[onlyCode.param] ?? onlyCode.defaultValue, onlyCode.codeLanguage ?? "javascript", operator));
  }, [operator, autoOpened, editing, loaded, operators, onEditInEditor]);
  // `pickerGroups`: built-in blocks first (Reference only when the workflow has commands), then the instance's operators, filtered by the search text, sorted by name and grouped by category. `shownValues`: values typed here overlaid with ones edited in the VS Code editor. `pickOperator`: picks an operator and resets the form to its defaults (built-in blocks have fixed starting values).
  let pickerGroups = (0, ReactForStepForms.useMemo)(() => {
      let needle = query.trim().toLowerCase(),
        matches = [[EACH_BLOCK.operator, EACH_BLOCK], [IF_BLOCK.operator, IF_BLOCK], [SERIES_BLOCK.operator, SERIES_BLOCK], [PARALLEL_BLOCK.operator, PARALLEL_BLOCK], ...(commands.length > 0 ? [[REFERENCE_BLOCK.operator, REFERENCE_BLOCK]] : []), ...Object.entries(operators)].filter(([opName, info]) => !needle || info.name.toLowerCase().includes(needle) || opName.toLowerCase().includes(needle) || (info.description ?? "").toLowerCase().includes(needle)).sort(([, opName], [, info]) => opName.name.localeCompare(info.name)),
        groups = new Map();
      for (let [opName, info] of matches) {
        let category = info.category ?? "Uncategorised",
          list = groups.get(category) ?? [];
        list.push({
          operator: opName,
          name: info.name,
          description: info.description,
          icon: info.icon
        }), groups.set(category, list);
      }
      return [...groups.entries()].sort(([categoryA], [categoryB]) => categoryA.localeCompare(categoryB));
    }, [operators, query, commands.length]),
    operatorInfo = operator ? operators[operator] : void 0,
    errorFor = param => errors.find(err => err.param === param)?.message,
    shownValues = {
      ...values,
      ...externalValues
    },
    pickOperator = picked => {
      if (setOperator(picked), picked === OP_REFERENCE) {
        setValues({});
        return;
      }
      if (picked === OP_EACH) {
        setValues({
          collection: "{{ _flow }}",
          concurrency: "1"
        });
        return;
      }
      if (picked === OP_SERIES) {
        setValues({});
        return;
      }
      if (picked === OP_PARALLEL) {
        setValues({
          concurrency: "1"
        });
        return;
      }
      if (picked === OP_IF) {
        setValues({
          evaluatorKind: "command",
          command: DEFAULT_IF_FUNCTION
        });
        return;
      }
      let defaults = {};
      for (let param of operators[picked]?.params ?? []) param.defaultValue && (defaults[param.param] = param.defaultValue);
      setValues(defaults);
    };
  return (0, jsxSteps.jsx)("div", {
    className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4",
    children: (0, jsxSteps.jsxs)("div", {
      className: "flex flex-col w-full max-w-2xl max-h-[85vh] rounded-lg border border-border bg-card shadow-lg",
      children: [(0, jsxSteps.jsxs)("header", {
        className: "flex items-start justify-between gap-3 p-4 border-b border-border",
        children: [(0, jsxSteps.jsxs)("div", {
          className: "flex items-start gap-2 min-w-0",
          children: [operator && !editing && (0, jsxSteps.jsx)(Button, {
            variant: "ghost",
            size: "icon",
            onClick: () => setOperator(null),
            title: "Back to operator list",
            children: (0, jsxSteps.jsx)(ArrowLeftIcon, {
              className: "h-4 w-4"
            })
          }), (0, jsxSteps.jsxs)("div", {
            className: "min-w-0",
            children: [(0, jsxSteps.jsx)("h2", {
              className: "m-0 text-base font-semibold text-foreground truncate",
              children: operator === OP_REFERENCE ? "Add Reference" : operator === OP_EACH ? editing ? "Edit loop" : "Add a loop" : operator === OP_IF ? editing ? "Edit condition" : "Add a condition" : operator === OP_SERIES ? "Add a group" : operator === OP_PARALLEL ? editing ? "Edit parallel block" : "Add a parallel block" : operatorInfo ? `${editing ? "Edit" : "Add"} ${operatorInfo.name}` : "Add an operator"
            }), (0, jsxSteps.jsx)("p", {
              className: "m-0 mt-0.5 text-xs text-muted-foreground",
              children: editing ? "in this flow" : `into ${target.where}`
            })]
          })]
        }), (0, jsxSteps.jsx)(Button, {
          variant: "ghost",
          size: "icon",
          onClick: onCancel,
          title: "Cancel",
          children: (0, jsxSteps.jsx)(XIcon, {
            className: "h-4 w-4"
          })
        })]
      }), operator ? (0, jsxSteps.jsxs)(jsxSteps.Fragment, {
        children: [(0, jsxSteps.jsxs)("div", {
          className: "flex-1 overflow-y-auto p-4 flex flex-col gap-4",
          children: [editing && !loaded && (0, jsxSteps.jsx)("p", {
            className: "m-0 text-sm text-muted-foreground",
            children: "Reading the current configuration\u2026"
          }), operator !== OP_SERIES && operator !== OP_PARALLEL && (operator === OP_REFERENCE ? REFERENCE_BLOCK.description : operatorInfo?.description) && (0, jsxSteps.jsx)("p", {
            className: "m-0 text-xs text-muted-foreground",
            children: operator === OP_REFERENCE ? REFERENCE_BLOCK.description : operatorInfo?.description
          }), operator === OP_SERIES ? (0, jsxSteps.jsxs)("p", {
            className: "m-0 text-xs text-muted-foreground",
            children: [SERIES_BLOCK.description, " Nothing to configure \u2014 add it, then drop steps inside."]
          }) : operator === OP_PARALLEL ? (0, jsxSteps.jsxs)("div", {
            className: "flex flex-col gap-1.5",
            children: [(0, jsxSteps.jsx)(Label, {
              htmlFor: "parallel-concurrency",
              children: "Concurrency"
            }), (0, jsxSteps.jsx)(Input, {
              id: "parallel-concurrency",
              value: shownValues.concurrency ?? "",
              onChange: changeEvent => setValues(prev => ({
                ...prev,
                concurrency: changeEvent.target.value
              })),
              placeholder: "1"
            }), (0, jsxSteps.jsx)("p", {
              className: "m-0 text-[11px] text-muted-foreground",
              children: "How many of its steps may run at once. 1 = sequential."
            }), errorFor("concurrency") && (0, jsxSteps.jsxs)("p", {
              className: "m-0 text-[11px] text-destructive",
              children: ["Concurrency ", errorFor("concurrency")]
            })]
          }) : operator === OP_EACH ? (0, jsxSteps.jsxs)(jsxSteps.Fragment, {
            children: [(0, jsxSteps.jsxs)("div", {
              className: "flex flex-col gap-1.5",
              children: [(0, jsxSteps.jsxs)(Label, {
                htmlFor: "each-collection",
                children: ["Reference Collection", (0, jsxSteps.jsx)("span", {
                  className: "text-destructive ml-1",
                  children: "*"
                })]
              }), (0, jsxSteps.jsx)(Input, {
                id: "each-collection",
                value: shownValues.collection ?? "",
                onChange: changeEvent => setValues(prev => ({
                  ...prev,
                  collection: changeEvent.target.value
                })),
                spellCheck: !1,
                placeholder: "{{ _flow }}"
              }), (0, jsxSteps.jsx)("p", {
                className: "m-0 text-[11px] text-muted-foreground",
                children: "What the loop iterates \u2014 usually a template expression."
              }), errorFor("collection") && (0, jsxSteps.jsxs)("p", {
                className: "m-0 text-[11px] text-destructive",
                children: ["Reference Collection ", errorFor("collection")]
              })]
            }), (0, jsxSteps.jsxs)("div", {
              className: "flex flex-col gap-1.5",
              children: [(0, jsxSteps.jsx)(Label, {
                htmlFor: "each-concurrency",
                children: "Concurrency"
              }), (0, jsxSteps.jsx)(Input, {
                id: "each-concurrency",
                value: shownValues.concurrency ?? "",
                onChange: changeEvent => setValues(prev => ({
                  ...prev,
                  concurrency: changeEvent.target.value
                })),
                placeholder: "1"
              }), (0, jsxSteps.jsx)("p", {
                className: "m-0 text-[11px] text-muted-foreground",
                children: "1 = sequential, higher values run items in parallel."
              }), errorFor("concurrency") && (0, jsxSteps.jsxs)("p", {
                className: "m-0 text-[11px] text-destructive",
                children: ["Concurrency ", errorFor("concurrency")]
              })]
            })]
          }) : operator === OP_IF ? (0, jsxSteps.jsxs)(jsxSteps.Fragment, {
            children: [(0, jsxSteps.jsxs)("div", {
              className: "flex flex-col gap-1.5",
              children: [(0, jsxSteps.jsx)(Label, {
                htmlFor: "if-kind",
                children: "Select evaluator"
              }), (0, jsxSteps.jsxs)("select", {
                id: "if-kind",
                value: shownValues.evaluatorKind ?? "command",
                onChange: changeEvent => setValues(prev => ({
                  ...prev,
                  evaluatorKind: changeEvent.target.value
                })),
                className: "w-full h-9 rounded-md border border-border bg-input text-foreground px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring",
                children: [(0, jsxSteps.jsx)("option", {
                  value: "command",
                  children: "Function"
                }), (0, jsxSteps.jsx)("option", {
                  value: "condition",
                  children: "Condition"
                })]
              }), errorFor("evaluatorKind") && (0, jsxSteps.jsxs)("p", {
                className: "m-0 text-[11px] text-destructive",
                children: ["Evaluator ", errorFor("evaluatorKind")]
              })]
            }), (shownValues.evaluatorKind ?? "command") === "command" ? (0, jsxSteps.jsxs)("div", {
              className: "flex flex-col gap-2",
              children: [(0, jsxSteps.jsxs)(Label, {
                children: ["Function", (0, jsxSteps.jsx)("span", {
                  className: "text-destructive ml-1",
                  children: "*"
                })]
              }), (0, jsxSteps.jsxs)(Button, {
                variant: "secondary",
                onClick: () => onEditInEditor("command", "Evaluator", shownValues.command ?? "", "javascript", operator),
                className: "justify-start gap-2",
                children: [(0, jsxSteps.jsx)(ExternalLinkIcon, {
                  className: "h-4 w-4"
                }), "Edit in VS Code editor"]
              }), shownValues.command && (0, jsxSteps.jsx)("pre", {
                className: "m-0 max-h-40 overflow-auto rounded-md border border-border bg-muted px-3 py-2 text-[11px] font-mono text-foreground whitespace-pre",
                children: shownValues.command
              }), (0, jsxSteps.jsx)("p", {
                className: "m-0 text-[11px] text-muted-foreground",
                children: "Return a truthy value to take the True branch."
              }), errorFor("command") && (0, jsxSteps.jsxs)("p", {
                className: "m-0 text-[11px] text-destructive",
                children: ["Function ", errorFor("command")]
              })]
            }) : (0, jsxSteps.jsxs)("div", {
              className: "flex flex-col gap-3",
              children: [(0, jsxSteps.jsxs)("div", {
                className: "flex flex-col gap-1.5",
                children: [(0, jsxSteps.jsxs)(Label, {
                  htmlFor: "if-property",
                  children: ["Property", (0, jsxSteps.jsx)("span", {
                    className: "text-destructive ml-1",
                    children: "*"
                  })]
                }), (0, jsxSteps.jsx)(Input, {
                  id: "if-property",
                  value: shownValues.property ?? "",
                  onChange: changeEvent => setValues(prev => ({
                    ...prev,
                    property: changeEvent.target.value
                  })),
                  spellCheck: !1,
                  placeholder: "_store.balances.length"
                }), errorFor("property") && (0, jsxSteps.jsxs)("p", {
                  className: "m-0 text-[11px] text-destructive",
                  children: ["Property ", errorFor("property")]
                })]
              }), (0, jsxSteps.jsxs)("div", {
                className: "flex items-end gap-2",
                children: [(0, jsxSteps.jsxs)("div", {
                  className: "flex flex-col gap-1.5 w-28 shrink-0",
                  children: [(0, jsxSteps.jsx)(Label, {
                    htmlFor: "if-operator",
                    children: "Operator"
                  }), (0, jsxSteps.jsx)("select", {
                    id: "if-operator",
                    value: shownValues.conditionOperator ?? "==",
                    onChange: changeEvent => setValues(prev => ({
                      ...prev,
                      conditionOperator: changeEvent.target.value
                    })),
                    className: "w-full h-9 rounded-md border border-border bg-input text-foreground px-2 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-ring",
                    children: ["==", "!=", ">", ">=", "<", "<="].map(comparison => (0, jsxSteps.jsx)("option", {
                      value: comparison,
                      children: comparison
                    }, comparison))
                  })]
                }), (0, jsxSteps.jsxs)("div", {
                  className: "flex flex-col gap-1.5 flex-1",
                  children: [(0, jsxSteps.jsx)(Label, {
                    htmlFor: "if-value",
                    children: "Value"
                  }), (0, jsxSteps.jsx)(Input, {
                    id: "if-value",
                    value: shownValues.value ?? "",
                    onChange: changeEvent => setValues(prev => ({
                      ...prev,
                      value: changeEvent.target.value
                    })),
                    spellCheck: !1,
                    placeholder: "0"
                  })]
                })]
              })]
            })]
          }) : operator === OP_REFERENCE ? (0, jsxSteps.jsxs)("div", {
            className: "flex flex-col gap-1.5",
            children: [(0, jsxSteps.jsxs)(Label, {
              htmlFor: "reference-command",
              children: ["Command", (0, jsxSteps.jsx)("span", {
                className: "text-destructive ml-1",
                children: "*"
              })]
            }), (0, jsxSteps.jsxs)("select", {
              id: "reference-command",
              value: values.command ?? "",
              onChange: changeEvent => setValues(prev => ({
                ...prev,
                command: changeEvent.target.value
              })),
              className: "w-full h-9 rounded-md border border-border bg-input text-foreground px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring",
              children: [(0, jsxSteps.jsx)("option", {
                value: "",
                children: "\u2014 pick a command \u2014"
              }), commands.map(command => (0, jsxSteps.jsxs)("option", {
                value: command.id,
                children: [command.label, " (", command.name, ")"]
              }, command.id))]
            }), (0, jsxSteps.jsxs)("p", {
              className: "m-0 text-[11px] text-muted-foreground",
              children: [REFERENCE_BLOCK.description, " Manage them on the Commands tab."]
            }), errorFor("command") && (0, jsxSteps.jsxs)("p", {
              className: "m-0 text-[11px] text-destructive",
              children: ["Command ", errorFor("command")]
            }), (() => {
              // The chosen command's own parameters, passed to it as `_params.<key>`.
              let chosenCommand = commands.find(command => command.id === values.command);
              return chosenCommand ? chosenCommand.parameters.length === 0 ? (0, jsxSteps.jsxs)("p", {
                className: "m-0 mt-2 text-[11px] text-muted-foreground",
                children: [chosenCommand.label, " takes no parameters."]
              }) : (0, jsxSteps.jsxs)("div", {
                className: "mt-3 flex flex-col gap-3 border-t border-border pt-3",
                children: [(0, jsxSteps.jsx)("span", {
                  className: "text-[11px] uppercase tracking-wide text-muted-foreground",
                  children: "Parameters"
                }), chosenCommand.parameters.map(commandParam => (0, jsxSteps.jsxs)("div", {
                  className: "flex flex-col gap-1.5",
                  children: [(0, jsxSteps.jsxs)(Label, {
                    htmlFor: `reference-param-${commandParam.key}`,
                    children: [commandParam.label, commandParam.required && (0, jsxSteps.jsx)("span", {
                      className: "text-destructive ml-1",
                      children: "*"
                    })]
                  }), (0, jsxSteps.jsx)(Input, {
                    id: `reference-param-${commandParam.key}`,
                    value: shownValues[commandParam.key] ?? "",
                    spellCheck: !1,
                    placeholder: `{{ _store.${commandParam.key} }}`,
                    onChange: changeEvent => setValues(prev => ({
                      ...prev,
                      [commandParam.key]: changeEvent.target.value
                    }))
                  }), (0, jsxSteps.jsxs)("p", {
                    className: "m-0 text-[11px] text-muted-foreground font-mono",
                    children: [commandParam.key, commandParam.type ? ` \xB7 ${commandParam.type}` : "", " \u2014 read in the command as ", `_params.${commandParam.key}`]
                  })]
                }, commandParam.key)), (0, jsxSteps.jsx)("p", {
                  className: "m-0 text-[11px] text-muted-foreground",
                  children: "Left blank means the command's own default is used."
                })]
              }) : null;
            })()]
          }) : (operatorInfo?.params.length ?? 0) === 0 ? (0, jsxSteps.jsx)("p", {
            className: "m-0 text-sm text-muted-foreground",
            children: "This operator takes no parameters."
          }) : operatorInfo.params.filter(param => !param.mergedInto).map(param => (0, jsxSteps.jsx)(ParamField, {
            field: param,
            value: shownValues[param.param] ?? "",
            error: errorFor(param.param),
            resourceNames: resourceNames,
            lookupOptions: lookupOptions,
            designed: (initialValues?.designed ?? []).includes(param.param),
            hasDesignTree: (initialValues?.withDesignTree ?? []).includes(param.param),
            onEditHtml: (initialValues?.designed ?? []).includes(param.param) ? () => onEditHtmlParam?.(param.param) : void 0,
            onOpenDesigner: (initialValues?.designed ?? []).includes(param.param) ? onOpenDesigner : void 0,
            onChange: newValue => setValues(prev => ({
              ...prev,
              [param.param]: newValue
            })),
            onEditInEditor: codeParam => onEditInEditor(codeParam.param, codeParam.label, shownValues[codeParam.param] ?? codeParam.defaultValue, codeParam.codeLanguage ?? "javascript", operator)
          }, param.param)), (0, jsxSteps.jsxs)("div", {
            className: "flex flex-col gap-1.5 pt-2 border-t border-border",
            children: [(0, jsxSteps.jsxs)(Label, {
              htmlFor: "operator-delay",
              children: ["Delay before running", (0, jsxSteps.jsx)("span", {
                className: "ml-1.5 text-[11px] font-normal text-muted-foreground font-mono",
                children: "delay \xB7 ms"
              })]
            }), (0, jsxSteps.jsx)(Input, {
              id: "operator-delay",
              value: delay,
              onChange: changeEvent => setDelay(changeEvent.target.value),
              placeholder: "0"
            })]
          }), saveError && errors.length === 0 && (0, jsxSteps.jsx)("div", {
            className: "rounded-md border border-destructive/50 p-3",
            children: (0, jsxSteps.jsx)("p", {
              className: "m-0 text-xs text-destructive",
              children: saveError
            })
          }), errors.length > 0 && (0, jsxSteps.jsxs)("div", {
            className: "rounded-md border border-destructive/50 p-3",
            children: [(0, jsxSteps.jsx)("p", {
              className: "m-0 mb-1 text-xs text-destructive",
              children: "The instance rejected this configuration:"
            }), (0, jsxSteps.jsx)("ul", {
              className: "m-0 pl-4 text-xs text-destructive",
              children: errors.map(paramError => (0, jsxSteps.jsxs)("li", {
                children: [paramError.label, " ", paramError.message]
              }, paramError.param))
            })]
          })]
        }), (0, jsxSteps.jsxs)("footer", {
          className: "flex items-center justify-between gap-3 p-4 border-t border-border",
          children: [(0, jsxSteps.jsx)("p", {
            className: "m-0 text-[11px] text-muted-foreground",
            children: "Saves straight to the instance \u2014 undo from the notification or the panel header."
          }), (0, jsxSteps.jsxs)("div", {
            className: "flex items-center gap-2 shrink-0",
            children: [(0, jsxSteps.jsx)(Button, {
              variant: "ghost",
              onClick: onCancel,
              disabled: saving,
              children: "Cancel"
            }), (0, jsxSteps.jsx)(Button, {
              // Submits `onSubmit(operator, values, delayMs)`; a blank or non-numeric delay is sent as null.
              onClick: () => {
                let delayMs = delay.trim() === "" ? null : Number(delay);
                onSubmit(operator, shownValues, delayMs !== null && Number.isFinite(delayMs) ? delayMs : null);
              },
              disabled: saving,
              className: cn(saving && "opacity-70"),
              children: saving ? "Saving\u2026" : editing ? "Save changes" : operator === OP_SERIES ? "Add group" : operator === OP_PARALLEL ? "Add parallel block" : "Add operator"
            })]
          })]
        })]
      }) : (0, jsxSteps.jsxs)(jsxSteps.Fragment, {
        children: [(0, jsxSteps.jsx)("div", {
          className: "p-4 pb-2",
          children: (0, jsxSteps.jsxs)("div", {
            className: "relative",
            children: [(0, jsxSteps.jsx)(SearchIcon, {
              className: "absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
            }), (0, jsxSteps.jsx)(Input, {
              autoFocus: !0,
              value: query,
              onChange: changeEvent => setQuery(changeEvent.target.value),
              placeholder: "Search operators...",
              className: "pl-8"
            })]
          })
        }), (0, jsxSteps.jsx)("div", {
          className: "flex-1 overflow-y-auto px-4 pb-4",
          children: pickerGroups.length === 0 ? (0, jsxSteps.jsx)("p", {
            className: "text-sm text-muted-foreground m-0",
            children: "No operator matches that search."
          }) : pickerGroups.map(([category, entries]) => (0, jsxSteps.jsxs)("div", {
            className: "mb-4",
            children: [(0, jsxSteps.jsx)("p", {
              className: "m-0 mb-1.5 text-[11px] uppercase tracking-wider text-muted-foreground",
              children: category
            }), (0, jsxSteps.jsx)("div", {
              className: "flex flex-col gap-1",
              children: entries.map(entry => (0, jsxSteps.jsxs)("button", {
                type: "button",
                onClick: () => pickOperator(entry.operator),
                className: "flex items-start gap-2.5 text-left rounded-md border border-border bg-background px-3 py-2 cursor-pointer hover:opacity-80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                children: [(0, jsxSteps.jsx)(OperatorIcon, {
                  icon: entry.icon
                }), (0, jsxSteps.jsxs)("span", {
                  className: "min-w-0",
                  children: [(0, jsxSteps.jsx)("span", {
                    className: "block text-sm text-foreground",
                    children: entry.name
                  }), entry.description && (0, jsxSteps.jsx)("span", {
                    className: "block text-xs text-muted-foreground line-clamp-2",
                    children: entry.description
                  })]
                })]
              }, entry.operator))
            })]
          }, category))
        })]
      })]
    })
  });
}
// jsxFlowTree (minified: b) — the jsx runtime for the flow tree. `OperatorCatalogContext`: the instance's operators by name (tooltips, categories, code parameters), provided by the App. `FlowEditContext`: the tree's edit callbacks (onAdd, onEdit, onDelete, onCopy, onPaste, onOpenCode, …) and clipboard, null when read-only. `draggedStepPath`: path of the step being dragged, null otherwise.
var jsxFlowTree = V(Q()),
  OperatorCatalogContext = (0, ReactForFlowTree.createContext)({}),
  FlowEditContext = (0, ReactForFlowTree.createContext)(null),
  draggedStepPath = null;
// isStepPath (minified: Mi) — True if a flow path ends in a list index, i.e. names a step that can be moved.
function isStepPath(path) {
  return typeof path[path.length - 1] == "number";
}
// isBranchPath (minified: V1) — True if a flow path ends in an If block's "true" / "false" branch.
function isBranchPath(path) {
  let last = path[path.length - 1];
  return last === "true" || last === "false";
}
// isCopyablePath (minified: Ni) — True if a path names a step or an If branch, which can be copied, duplicated or deleted.
function isCopyablePath(path) {
  return isStepPath(path) || isBranchPath(path);
}
// pathStartsWith (minified: X1) — True if `path` is `prefix` or lies inside it.
function pathStartsWith(prefix, path) {
  return path.length >= prefix.length && prefix.every((part, index) => part === path[index]);
}
// canDropAt (minified: Ai) — True while a step is being dragged and `path` is not the dragged step itself or inside it.
function canDropAt(path) {
  return !!draggedStepPath && !pathStartsWith(draggedStepPath, path);
}
// dragSourceProps (minified: Ti) — Props that make a step's element draggable (only for step paths in an editable tree).
function dragSourceProps(path, editable) {
  return !editable || !isStepPath(path) ? {} : {
    draggable: !0,
    onDragStart: dragEvent => {
      dragEvent.stopPropagation(), draggedStepPath = path, dragEvent.dataTransfer.effectAllowed = "move", dragEvent.dataTransfer.setData("text/plain", path.join("."));
    },
    onDragEnd: () => {
      draggedStepPath = null;
    }
  };
}
// DragHandle (minified: j1) — Grip icon on a movable step, when the tree is editable.
function DragHandle({
  path: path
}) {
  return !(0, ReactForFlowTree.useContext)(FlowEditContext) || !isStepPath(path) ? null : (0, jsxFlowTree.jsx)(GripVerticalIcon, {
    className: "h-3.5 w-3.5 shrink-0 cursor-grab opacity-70"
  });
}
// DeleteNodeButton (minified: ki) — Trash button that deletes a step or branch (and everything inside it) via the edit context.
function DeleteNodeButton({
  path: path,
  kind: kind,
  label: label
}) {
  let editor = (0, ReactForFlowTree.useContext)(FlowEditContext);
  return !editor || !isCopyablePath(path) ? null : (0, jsxFlowTree.jsx)("button", {
    type: "button",
    title: `Delete this ${label} and everything inside it`,
    onClick: clickEvent => {
      clickEvent.stopPropagation(), editor.onDelete(path, kind, label);
    },
    className: "flex items-center rounded bg-white/15 hover:bg-red-500/70 border-none text-white p-1 cursor-pointer",
    children: (0, jsxFlowTree.jsx)(Trash2Icon, {
      className: "h-3.5 w-3.5"
    })
  });
}
// CopyNodeButtons (minified: Ii) — Copy and Duplicate buttons for a step or branch.
function CopyNodeButtons({
  path: path,
  label: label
}) {
  let editor = (0, ReactForFlowTree.useContext)(FlowEditContext);
  return !editor || !isCopyablePath(path) ? null : (0, jsxFlowTree.jsxs)(jsxFlowTree.Fragment, {
    children: [(0, jsxFlowTree.jsx)("button", {
      type: "button",
      title: `Copy this ${label} and everything inside it`,
      onClick: clickEvent => {
        clickEvent.stopPropagation(), editor.onCopy(path, label);
      },
      className: "flex items-center rounded bg-white/15 hover:bg-white/25 border-none text-white p-1 cursor-pointer",
      children: (0, jsxFlowTree.jsx)(CopyIcon, {
        className: "h-3.5 w-3.5"
      })
    }), (0, jsxFlowTree.jsx)("button", {
      type: "button",
      title: `Duplicate this ${label} here`,
      onClick: clickEvent => {
        clickEvent.stopPropagation(), editor.onDuplicate(path, label);
      },
      className: "flex items-center rounded bg-white/15 hover:bg-white/25 border-none text-white p-1 cursor-pointer",
      children: (0, jsxFlowTree.jsx)(CopyPlusIcon, {
        className: "h-3.5 w-3.5"
      })
    })]
  });
}
// CopyContentsButton (minified: Z1) — Copies all the steps inside a container ("N" with a copy icon); hidden when it is empty.
function CopyContentsButton({
  childrenPath: childrenPath,
  label: label,
  count: count
}) {
  let editor = (0, ReactForFlowTree.useContext)(FlowEditContext);
  return !editor || count === 0 ? null : (0, jsxFlowTree.jsxs)("button", {
    type: "button",
    title: `Copy the ${count} step${count === 1 ? "" : "s"} in this ${label}`,
    onClick: clickEvent => {
      clickEvent.stopPropagation(), editor.onCopyContents(childrenPath, label, count);
    },
    className: "flex items-center gap-1 rounded bg-white/15 hover:bg-white/25 border-none text-white text-[11px] px-1.5 py-0.5 cursor-pointer",
    children: [(0, jsxFlowTree.jsx)(CopyIcon, {
      className: "h-3.5 w-3.5"
    }), count]
  });
}
// PasteButton (minified: Y1) — Pastes the copied steps at the end of a container; shown only while something is on the clipboard.
function PasteButton({
  childrenPath: childrenPath
}) {
  let editor = (0, ReactForFlowTree.useContext)(FlowEditContext);
  if (!editor || !editor.clipboard) return null;
  let {
    label: clipLabel,
    sourceWorkflowName: sourceWorkflowName
  } = editor.clipboard;
  return (0, jsxFlowTree.jsxs)("button", {
    type: "button",
    title: `Paste the copied ${clipLabel} (from ${sourceWorkflowName}) at the end`,
    onClick: clickEvent => {
      clickEvent.stopPropagation(), editor.onPaste(childrenPath, null);
    },
    className: "flex items-center gap-1 rounded bg-white/15 hover:bg-white/25 border-none text-white text-[11px] px-1.5 py-0.5 cursor-pointer",
    children: [(0, jsxFlowTree.jsx)(ClipboardPasteIcon, {
      className: "h-3.5 w-3.5"
    }), "Paste"]
  });
}
// EditNodeButton (minified: Lb) — Pencil button that opens a block's edit dialog.
function EditNodeButton({
  path: path,
  kind: kind,
  title: title
}) {
  let editor = (0, ReactForFlowTree.useContext)(FlowEditContext);
  return editor ? (0, jsxFlowTree.jsx)("button", {
    type: "button",
    title: title,
    onClick: clickEvent => {
      clickEvent.stopPropagation(), editor.onEdit(path, kind);
    },
    className: "flex items-center rounded bg-white/15 hover:bg-white/25 border-none text-white p-1 cursor-pointer",
    children: (0, jsxFlowTree.jsx)(PencilIcon, {
      className: "h-3.5 w-3.5"
    })
  }) : null;
}
// AddOperatorButton (minified: Of) — "+ Operator" button that adds a step to a container.
function AddOperatorButton({
  childrenPath: childrenPath,
  where: where
}) {
  let editor = (0, ReactForFlowTree.useContext)(FlowEditContext);
  return editor ? (0, jsxFlowTree.jsxs)("button", {
    type: "button",
    title: `Add an operator to ${where}`,
    onClick: clickEvent => {
      clickEvent.stopPropagation(), editor.onAdd(childrenPath, where);
    },
    className: "ml-auto flex items-center gap-1 rounded bg-white/15 hover:bg-white/25 border-none text-white text-[11px] px-1.5 py-0.5 cursor-pointer",
    children: [(0, jsxFlowTree.jsx)(PlusIcon, {
      className: "h-3.5 w-3.5"
    }), "Operator"]
  }) : null;
}
// NodeIcon (minified: K1) — An operator's SVG icon, or the given fallback icon component.
function NodeIcon({
  icon: icon,
  fallback: fallback
}) {
  return icon ? (0, jsxFlowTree.jsx)("span", {
    className: "[&>svg]:h-6 [&>svg]:w-6 inline-flex",
    dangerouslySetInnerHTML: {
      __html: icon
    }
  }) : (0, jsxFlowTree.jsx)(fallback, {
    className: "h-5 w-5"
  });
}
// hasTemplate (minified: zf) — True if a value contains a `{{ … }}` template expression (shown highlighted).
function hasTemplate(text) {
  return /\{\{[\s\S]*\}\}/.test(text);
}
// ParamValueText (minified: Q1) — A step parameter's value in a node: inline, or as a block when long or multi-line; notes when the host truncated it.
function ParamValueText({
  value: value,
  truncated: truncated
}) {
  let asBlock = value.includes(`
`) || value.length > 60;
  return (0, jsxFlowTree.jsxs)(jsxFlowTree.Fragment, {
    children: [(0, jsxFlowTree.jsx)("span", {
      className: asBlock ? "block mt-0.5 font-mono text-[11px] text-slate-100 whitespace-pre-wrap break-words max-h-32 overflow-y-auto" : `font-mono text-[11px] ${hasTemplate(value) ? "text-amber-300" : "text-slate-100"} break-words`,
      children: value || "\u2014"
    }), truncated && (0, jsxFlowTree.jsx)("span", {
      className: "block text-[10px] text-slate-400 italic mt-0.5",
      children: "truncated \u2014 open the raw JSON to see the full value"
    })]
  });
}
// NodeParams (minified: W1) — A step node's parameter list; key/value maps are shown as rows.
function NodeParams({
  params: params
}) {
  return (0, jsxFlowTree.jsx)("div", {
    className: "flex flex-col gap-2 text-left",
    children: params.map(param => (0, jsxFlowTree.jsxs)("div", {
      children: [(0, jsxFlowTree.jsxs)("span", {
        className: "text-[11px] text-slate-300",
        children: [param.label, param.unknown && (0, jsxFlowTree.jsx)("span", {
          className: "text-slate-500",
          children: " (not in schema)"
        })]
      }), param.entries ? (0, jsxFlowTree.jsx)("div", {
        className: "flex flex-col gap-1 mt-1",
        children: param.entries.length === 0 ? (0, jsxFlowTree.jsx)("span", {
          className: "font-mono text-[11px] text-slate-400",
          children: "{}"
        }) : param.entries.map(entry => (0, jsxFlowTree.jsxs)("div", {
          className: "flex items-baseline gap-1.5 rounded bg-slate-900/70 px-2 py-1",
          children: [(0, jsxFlowTree.jsx)("span", {
            className: "font-mono text-[11px] font-bold text-slate-100 shrink-0",
            children: entry.key
          }), (0, jsxFlowTree.jsx)("span", {
            className: "text-slate-400 shrink-0",
            children: "\u2192"
          }), (0, jsxFlowTree.jsx)("span", {
            className: `font-mono text-[11px] break-words ${hasTemplate(entry.value) ? "text-amber-300" : "text-slate-100"}`,
            children: entry.value || "\u2014"
          })]
        }, entry.key))
      }) : (0, jsxFlowTree.jsx)(ParamValueText, {
        value: param.value,
        truncated: param.truncated
      })]
    }, param.key))
  });
}
// OperatorNode (minified: J1) — A step node in the flow tree: delay, Disabled badge and Enable/Disable (posts `setStepMock`), open code in the editor, edit, copy / duplicate / delete, then its icon, label and parameters.
function OperatorNode({
  node: node
}) {
  let operatorCatalog = (0, ReactForFlowTree.useContext)(OperatorCatalogContext),
    editor = (0, ReactForFlowTree.useContext)(FlowEditContext),
    [expanded, setExpanded] = (0, ReactForFlowTree.useState)(!1),
    operatorInfo = node.operator ? operatorCatalog[node.operator] : void 0,
    tooltip = [node.label, operatorInfo?.category, operatorInfo?.description].filter(Boolean).join(`
`),
    hasParams = node.params.length > 0,
    codeParams = (operatorInfo?.params ?? []).filter(param => param.codeLanguage);
  return (0, jsxFlowTree.jsxs)("div", {
    className: "rounded-md bg-slate-800 text-white px-4 pt-2 pb-3",
    title: (node.mock ? "Disabled \u2014 this step is skipped when the action runs\n" : "") + tooltip,
    style: node.mock ? {
      opacity: .6,
      outline: "1px dashed rgba(240,180,41,.7)",
      outlineOffset: "-1px"
    } : void 0,
    ...dragSourceProps(node.path, !!editor),
    children: [(0, jsxFlowTree.jsxs)("div", {
      className: "flex items-center justify-between gap-2 text-[11px] text-slate-300 mb-2 min-h-4",
      children: [(0, jsxFlowTree.jsxs)("span", {
        className: "flex items-center gap-1.5",
        children: [editor && (0, jsxFlowTree.jsx)(GripVerticalIcon, {
          className: "h-3.5 w-3.5 shrink-0 cursor-grab text-slate-500"
        }), (0, jsxFlowTree.jsx)(ClockIcon, {
          className: "h-3 w-3 shrink-0"
        }), node.delay !== null && (0, jsxFlowTree.jsxs)("span", {
          children: [node.delay, " ms"]
        }), node.mock && (0, jsxFlowTree.jsx)("span", {
          title: "This step is skipped when the action runs",
          style: {
            padding: "0 6px",
            borderRadius: "3px",
            background: "rgba(240,180,41,.18)",
            color: "#f0c674",
            fontWeight: 600,
            letterSpacing: ".02em"
          },
          children: "Disabled"
        }), editor && node.operator && (0, jsxFlowTree.jsx)("button", {
          type: "button",
          title: node.mock ? "Enable this step" : "Disable this step (it will be skipped when the action runs)",
          // Toggles the step's mock flag (Saturn's "disabled") as one draft edit on the host.
          onClick: clickEvent => {
            clickEvent.stopPropagation(), vscodeApi.postMessage({
              type: "setStepMock",
              payload: {
                path: node.path,
                mock: !node.mock
              }
            });
          },
          className: "rounded bg-white/10 hover:bg-white/25 border-none text-white cursor-pointer",
          style: {
            padding: "0 6px",
            fontSize: "10px",
            lineHeight: "16px"
          },
          children: node.mock ? "Enable" : "Disable"
        })]
      }), (0, jsxFlowTree.jsxs)("span", {
        className: "flex items-center gap-2",
        children: [hasParams && (0, jsxFlowTree.jsxs)("span", {
          className: "text-slate-400",
          children: [node.params.length, " field", node.params.length === 1 ? "" : "s"]
        }), editor && node.operator && codeParams.length > 0 && (0, jsxFlowTree.jsx)("button", {
          type: "button",
          title: codeParams.length === 1 ? `Open ${codeParams[0].label} in the editor` : `Open one of ${codeParams.length} documents in the editor: ` + codeParams.map(param => param.label).join(", "),
          onClick: clickEvent => {
            clickEvent.stopPropagation(), editor.onOpenCode(node.path, node.operator, codeParams.map(codeParam => ({
              param: codeParam.param,
              label: codeParam.label,
              language: codeParam.codeLanguage ?? "javascript"
            })));
          },
          className: "flex items-center rounded bg-white/10 hover:bg-white/25 border-none text-white p-1 cursor-pointer",
          children: (0, jsxFlowTree.jsx)(FileCodeCornerIcon, {
            className: "h-3 w-3"
          })
        }), editor && node.operator && (0, jsxFlowTree.jsx)("button", {
          type: "button",
          title: `Edit ${node.label}`,
          onClick: clickEvent => {
            clickEvent.stopPropagation(), editor.onEdit(node.path, node.operator);
          },
          className: "flex items-center rounded bg-white/10 hover:bg-white/25 border-none text-white p-1 cursor-pointer",
          children: (0, jsxFlowTree.jsx)(PencilIcon, {
            className: "h-3 w-3"
          })
        }), editor && isCopyablePath(node.path) && (0, jsxFlowTree.jsxs)(jsxFlowTree.Fragment, {
          children: [(0, jsxFlowTree.jsx)("button", {
            type: "button",
            title: `Copy ${node.label}`,
            onClick: clickEvent => {
              clickEvent.stopPropagation(), editor.onCopy(node.path, node.label);
            },
            className: "flex items-center rounded bg-white/10 hover:bg-white/25 border-none text-white p-1 cursor-pointer",
            children: (0, jsxFlowTree.jsx)(CopyIcon, {
              className: "h-3 w-3"
            })
          }), (0, jsxFlowTree.jsx)("button", {
            type: "button",
            title: `Duplicate ${node.label} here`,
            onClick: clickEvent => {
              clickEvent.stopPropagation(), editor.onDuplicate(node.path, node.label);
            },
            className: "flex items-center rounded bg-white/10 hover:bg-white/25 border-none text-white p-1 cursor-pointer",
            children: (0, jsxFlowTree.jsx)(CopyPlusIcon, {
              className: "h-3 w-3"
            })
          })]
        }), editor && (0, jsxFlowTree.jsx)("button", {
          type: "button",
          title: `Delete ${node.label}`,
          onClick: clickEvent => {
            clickEvent.stopPropagation(), editor.onDelete(node.path, node.operator, node.label);
          },
          className: "flex items-center rounded bg-white/10 hover:bg-red-500/70 border-none text-white p-1 cursor-pointer",
          children: (0, jsxFlowTree.jsx)(Trash2Icon, {
            className: "h-3 w-3"
          })
        })]
      })]
    }), (0, jsxFlowTree.jsxs)("button", {
      type: "button",
      disabled: !hasParams,
      onClick: () => setExpanded(wasOpen => !wasOpen),
      className: "w-full flex flex-col items-center gap-2 py-1 bg-transparent border-none text-white cursor-pointer disabled:cursor-default",
      children: [(0, jsxFlowTree.jsx)(NodeIcon, {
        icon: operatorInfo?.icon,
        fallback: TerminalIcon
      }), (0, jsxFlowTree.jsxs)("span", {
        className: "flex items-center gap-1 text-sm text-center leading-snug",
        children: [node.label, hasParams && (expanded ? (0, jsxFlowTree.jsx)(ChevronDownIcon, {
          className: "h-3.5 w-3.5 shrink-0"
        }) : (0, jsxFlowTree.jsx)(ChevronRightIcon, {
          className: "h-3.5 w-3.5 shrink-0"
        }))]
      })]
    }), expanded && hasParams && (0, jsxFlowTree.jsx)("div", {
      className: "mt-3 pt-3 border-t border-slate-700",
      children: (0, jsxFlowTree.jsx)(NodeParams, {
        params: node.params
      })
    })]
  });
}
// ReferenceCard (minified: $1) — Card for a "reference" step (one that runs a command): shows the command it points at and its parameter values; in edit mode, buttons to repoint, copy, duplicate or delete it.
function ReferenceCard({
  node: node
}) {
  let editor = (0, ReactForFlowTree.useContext)(FlowEditContext);
  return (0, jsxFlowTree.jsxs)("div", {
    className: "rounded-md bg-slate-800 text-white px-4 pt-2 pb-4",
    ...dragSourceProps(node.path, !!editor),
    children: [(0, jsxFlowTree.jsxs)("div", {
      className: "flex items-center justify-between gap-2 text-[11px] text-slate-300 mb-2 min-h-4",
      children: [(0, jsxFlowTree.jsxs)("span", {
        className: "flex items-center gap-1.5",
        children: [editor && (0, jsxFlowTree.jsx)(GripVerticalIcon, {
          className: "h-3.5 w-3.5 shrink-0 cursor-grab text-slate-500"
        }), (0, jsxFlowTree.jsx)(Link2Icon, {
          className: "h-3.5 w-3.5 shrink-0"
        }), (0, jsxFlowTree.jsx)("span", {
          children: "Reference"
        })]
      }), editor && (0, jsxFlowTree.jsxs)("span", {
        className: "flex items-center gap-2",
        children: [(0, jsxFlowTree.jsx)("button", {
          type: "button",
          title: "Point this at a different command",
          onClick: clickEvent => {
            clickEvent.stopPropagation(), editor.onEdit(node.path, OP_REFERENCE);
          },
          className: "flex items-center rounded bg-white/10 hover:bg-white/25 border-none text-white p-1 cursor-pointer",
          children: (0, jsxFlowTree.jsx)(PencilIcon, {
            className: "h-3 w-3"
          })
        }), isCopyablePath(node.path) && (0, jsxFlowTree.jsxs)(jsxFlowTree.Fragment, {
          children: [(0, jsxFlowTree.jsx)("button", {
            type: "button",
            title: "Copy this reference",
            onClick: clickEvent => {
              clickEvent.stopPropagation(), editor.onCopy(node.path, node.targetName ?? "reference");
            },
            className: "flex items-center rounded bg-white/10 hover:bg-white/25 border-none text-white p-1 cursor-pointer",
            children: (0, jsxFlowTree.jsx)(CopyIcon, {
              className: "h-3 w-3"
            })
          }), (0, jsxFlowTree.jsx)("button", {
            type: "button",
            title: "Duplicate this reference here",
            onClick: clickEvent => {
              clickEvent.stopPropagation(), editor.onDuplicate(node.path, node.targetName ?? "reference");
            },
            className: "flex items-center rounded bg-white/10 hover:bg-white/25 border-none text-white p-1 cursor-pointer",
            children: (0, jsxFlowTree.jsx)(CopyPlusIcon, {
              className: "h-3 w-3"
            })
          })]
        }), (0, jsxFlowTree.jsx)("button", {
          type: "button",
          title: "Delete this reference",
          onClick: clickEvent => {
            clickEvent.stopPropagation(), editor.onDelete(node.path, OP_REFERENCE, node.targetName ?? "Reference");
          },
          className: "flex items-center rounded bg-white/10 hover:bg-red-500/70 border-none text-white p-1 cursor-pointer",
          children: (0, jsxFlowTree.jsx)(Trash2Icon, {
            className: "h-3 w-3"
          })
        })]
      })]
    }), (0, jsxFlowTree.jsx)("div", {
      className: "rounded bg-card text-foreground border border-border px-3 py-1.5",
      children: node.targetName ? (0, jsxFlowTree.jsxs)(jsxFlowTree.Fragment, {
        children: [(0, jsxFlowTree.jsx)("span", {
          className: "text-sm truncate block",
          children: node.targetName
        }), node.targetId && node.targetId !== node.targetName && (0, jsxFlowTree.jsx)("span", {
          className: "text-[11px] font-mono text-muted-foreground truncate block",
          children: node.targetId
        })]
      }) : (0, jsxFlowTree.jsxs)(jsxFlowTree.Fragment, {
        children: [(0, jsxFlowTree.jsx)("span", {
          className: "text-sm font-mono truncate block",
          children: node.targetId ?? "no command set"
        }), (0, jsxFlowTree.jsx)("span", {
          className: "text-[11px] text-destructive truncate block",
          children: "not a command in this workflow"
        })]
      })
    }), (0, jsxFlowTree.jsx)(ReferenceParameterList, {
      node: node
    })]
  });
}
// ReferenceParameterList (minified: ew) — The parameter values a reference step passes to its command: the command's declared parameters first (null = command default), then values for parameters it no longer declares (marked "?").
function ReferenceParameterList({
  node: node
}) {
  let valueByKey = new Map(node.parameterValues.map(entry => [entry.key, entry.value])),
    declared = node.parameterFields.map(field => ({
      key: field.key,
      label: field.label,
      value: valueByKey.get(field.key) ?? null,
      known: !0
    })),
    undeclared = node.parameterValues.filter(entry => !node.parameterFields.some(field => field.key === entry.key)).map(entry => ({
      key: entry.key,
      label: entry.key,
      value: entry.value,
      known: !1
    })),
    rows = [...declared, ...undeclared];
  return rows.length === 0 ? null : (0, jsxFlowTree.jsxs)("div", {
    className: "mt-2 rounded bg-black/20 px-3 py-2 flex flex-col gap-1",
    children: [(0, jsxFlowTree.jsx)("span", {
      className: "text-[10px] uppercase tracking-wide text-slate-400",
      children: "Parameters"
    }), rows.map(row => (0, jsxFlowTree.jsxs)("div", {
      className: "flex items-baseline gap-2 min-w-0",
      children: [(0, jsxFlowTree.jsxs)("span", {
        className: "text-[11px] text-slate-300 shrink-0",
        children: [row.label, !row.known && (0, jsxFlowTree.jsx)("span", {
          className: "text-amber-400 ml-1",
          title: "The command no longer declares this parameter",
          children: "?"
        })]
      }), row.value === null ? (0, jsxFlowTree.jsx)("span", {
        className: "text-[11px] text-slate-500 italic truncate",
        children: "command default"
      }) : (0, jsxFlowTree.jsx)("code", {
        className: "text-[11px] font-mono text-slate-100 truncate",
        children: row.value
      })]
    }, row.key))]
  });
}
// ContainerCard (minified: Rf) — Coloured card for a container step (group, parallel block, loop): header with drag grip, icon, label, badge, Add-operator / copy-contents / paste buttons and extra actions; children below.
function ContainerCard({
  label: label,
  icon: Icon,
  tone: tone,
  badge: badge,
  childrenPath: childrenPath,
  extra: extra,
  path: path,
  count: count,
  children: children
}) {
  let editor = (0, ReactForFlowTree.useContext)(FlowEditContext),
    showGrip = !!editor && isStepPath(path);
  return (0, jsxFlowTree.jsxs)("div", {
    className: `rounded-md overflow-hidden ${tone}`,
    ...dragSourceProps(path, !!editor),
    children: [(0, jsxFlowTree.jsxs)("div", {
      className: "flex items-center gap-2 px-3 py-2 text-sm text-white font-medium",
      children: [showGrip && (0, jsxFlowTree.jsx)(GripVerticalIcon, {
        className: "h-3.5 w-3.5 shrink-0 cursor-grab opacity-70"
      }), (0, jsxFlowTree.jsx)(Icon, {
        className: "h-4 w-4 shrink-0"
      }), (0, jsxFlowTree.jsx)("span", {
        children: label
      }), badge && (0, jsxFlowTree.jsx)("span", {
        className: "text-[11px] opacity-80",
        children: badge
      }), (0, jsxFlowTree.jsx)(AddOperatorButton, {
        childrenPath: childrenPath,
        where: `this ${label}`
      }), (0, jsxFlowTree.jsx)(CopyContentsButton, {
        childrenPath: childrenPath,
        label: label,
        count: count
      }), (0, jsxFlowTree.jsx)(PasteButton, {
        childrenPath: childrenPath
      }), extra]
    }), (0, jsxFlowTree.jsx)("div", {
      className: "bg-card m-1 mt-0 rounded p-2 flex flex-col gap-2",
      children: children
    })]
  });
}
// EmptyListNote (minified: aw) — Grey note shown in an empty step list (e.g. "No commands").
function EmptyListNote({
  label: label
}) {
  return (0, jsxFlowTree.jsx)("p", {
    className: "text-xs text-muted-foreground m-0 px-2 py-1",
    children: label
  });
}
// DropSlot (minified: tw) — Wraps one step in a list as a drop target in edit mode: dropping a dragged step above or below its middle moves it before or after this one (via the editor's onMove).
function DropSlot({
  childrenPath: childrenPath,
  index: index,
  children: children
}) {
  let editor = (0, ReactForFlowTree.useContext)(FlowEditContext),
    [dropSide, setDropSide] = (0, ReactForFlowTree.useState)(null);
  if (!editor) return (0, jsxFlowTree.jsx)(jsxFlowTree.Fragment, {
    children: children
  });
  // Which half of the slot the pointer is over.
  let sideOf = dragEvent => {
    let rect = dragEvent.currentTarget.getBoundingClientRect();
    return dragEvent.clientY < rect.top + rect.height / 2 ? "before" : "after";
  };
  return (0, jsxFlowTree.jsxs)("div", {
    className: "relative flex flex-col",
    onDragOver: dragEvent => {
      canDropAt(childrenPath) && (dragEvent.preventDefault(), dragEvent.stopPropagation(), dragEvent.dataTransfer.dropEffect = "move", setDropSide(sideOf(dragEvent)));
    },
    onDragLeave: dragEvent => {
      dragEvent.currentTarget.contains(dragEvent.relatedTarget) || setDropSide(null);
    },
    onDrop: dragEvent => {
      if (!canDropAt(childrenPath)) return;
      dragEvent.preventDefault(), dragEvent.stopPropagation();
      let side = sideOf(dragEvent);
      setDropSide(null);
      // The dragged step's path is held in the module-level drag state, cleared on drop.
      let draggedPath = draggedStepPath;
      draggedStepPath = null, draggedPath && editor.onMove(draggedPath, childrenPath, side === "before" ? index : index + 1);
    },
    children: [dropSide === "before" && (0, jsxFlowTree.jsx)(DropMarker, {}), children, dropSide === "after" && (0, jsxFlowTree.jsx)(DropMarker, {})]
  });
}
// DropMarker (minified: wb) — The highlighted line showing where a dropped step will land.
function DropMarker() {
  return (0, jsxFlowTree.jsx)("div", {
    className: "pointer-events-none h-0.5 my-0.5 rounded bg-primary shadow-[0_0_0_2px_var(--color-primary)]"
  });
}
// EmptyDropZone (minified: lw) — Drop target for an empty step list in edit mode: dropping a step moves it to the given index.
function EmptyDropZone({
  childrenPath: childrenPath,
  index: index,
  children: children
}) {
  let editor = (0, ReactForFlowTree.useContext)(FlowEditContext),
    [isOver, setIsOver] = (0, ReactForFlowTree.useState)(!1);
  return editor ? (0, jsxFlowTree.jsx)("div", {
    className: isOver ? "rounded outline-2 outline-dashed outline-primary" : void 0,
    onDragOver: dragEvent => {
      canDropAt(childrenPath) && (dragEvent.preventDefault(), dragEvent.dataTransfer.dropEffect = "move", setIsOver(!0));
    },
    onDragLeave: dragEvent => {
      dragEvent.currentTarget.contains(dragEvent.relatedTarget) || setIsOver(!1);
    },
    onDrop: dragEvent => {
      if (!canDropAt(childrenPath)) return;
      dragEvent.preventDefault(), setIsOver(!1);
      let draggedPath = draggedStepPath;
      draggedStepPath = null, draggedPath && editor.onMove(draggedPath, childrenPath, index);
    },
    children: children
  }) : (0, jsxFlowTree.jsx)(jsxFlowTree.Fragment, {
    children: children
  });
}
// FlowNodeList (minified: Su) — Renders a list of flow steps, each in a DropSlot, or an empty drop zone with a note when there are none.
function FlowNodeList({
  nodes: nodes,
  empty: emptyLabel,
  childrenPath: childrenPath
}) {
  return nodes.length === 0 ? (0, jsxFlowTree.jsx)(EmptyDropZone, {
    childrenPath: childrenPath,
    index: 0,
    children: (0, jsxFlowTree.jsx)(EmptyListNote, {
      label: emptyLabel
    })
  }) : (0, jsxFlowTree.jsx)(jsxFlowTree.Fragment, {
    children: nodes.map((child, index) => (0, jsxFlowTree.jsx)(DropSlot, {
      childrenPath: childrenPath,
      index: index,
      children: (0, jsxFlowTree.jsx)(FlowNode, {
        node: child
      })
    }, index))
  });
}
// flowZoomLevels (minified: Xl) — Zoom levels the flow view steps through.
// flowZoomStorageKey: localStorage key that remembers the flow view's zoom.
var flowZoomLevels = [.5, .6, .7, .8, .9, 1],
  flowZoomStorageKey = "sonover.flowZoom";
// readSavedFlowZoom (minified: ow) — Reads the remembered zoom level, falling back to 100% when it is missing or not one of the levels.
function readSavedFlowZoom() {
  try {
    let zoom = Number(localStorage.getItem(flowZoomStorageKey));
    return flowZoomLevels.includes(zoom) ? zoom : 1;
  } catch {
    return 1;
  }
}
// ZoomableFlow (minified: Di) — Scrollable flow view with zoom out / zoom in / reset buttons; scales the flow with a CSS transform and remembers the zoom in localStorage.
function ZoomableFlow({
  node: node
}) {
  let [zoom, setZoom] = (0, ReactForFlowTree.useState)(readSavedFlowZoom);
  (0, ReactForFlowTree.useEffect)(() => {
    try {
      localStorage.setItem(flowZoomStorageKey, String(zoom));
    } catch {}
  }, [zoom]);
  // Moves the zoom one level in the given direction, clamped to the available levels.
  let stepZoom = direction => setZoom(current => {
    let index = flowZoomLevels.indexOf(current),
      next = (index === -1 ? flowZoomLevels.length - 1 : index) + direction;
    return flowZoomLevels[Math.min(flowZoomLevels.length - 1, Math.max(0, next))];
  });
  return (0, jsxFlowTree.jsxs)("div", {
    className: "flex flex-col flex-1 min-h-0 gap-1",
    children: [(0, jsxFlowTree.jsxs)("div", {
      className: "sticky top-0 z-20 flex items-center gap-1 self-end rounded bg-background/90 px-1 py-0.5 backdrop-blur-sm",
      children: [(0, jsxFlowTree.jsx)(ZoomButton, {
        label: "Zoom out \u2014 more of the flow, smaller cards",
        disabled: zoom === flowZoomLevels[0],
        onClick: () => stepZoom(-1),
        children: (0, jsxFlowTree.jsx)(MinusIcon, {
          className: "h-3 w-3"
        })
      }), (0, jsxFlowTree.jsxs)("span", {
        className: "text-[11px] text-muted-foreground tabular-nums w-9 text-center",
        title: "Zoom level",
        children: [Math.round(zoom * 100), "%"]
      }), (0, jsxFlowTree.jsx)(ZoomButton, {
        label: "Zoom in",
        disabled: zoom === flowZoomLevels[flowZoomLevels.length - 1],
        onClick: () => stepZoom(1),
        children: (0, jsxFlowTree.jsx)(PlusIcon, {
          className: "h-3 w-3"
        })
      }), (0, jsxFlowTree.jsx)(ZoomButton, {
        label: "Back to full size",
        disabled: zoom === 1,
        onClick: () => setZoom(1),
        children: (0, jsxFlowTree.jsx)(Maximize2Icon, {
          className: "h-3 w-3"
        })
      })]
    }), (0, jsxFlowTree.jsx)("div", {
      className: "flow-scroll flex-1 min-h-0 min-w-0 overflow-auto",
      children: (0, jsxFlowTree.jsx)("div", {
        style: {
          transform: zoom === 1 ? void 0 : `scale(${zoom})`,
          transformOrigin: "top left",
          width: zoom === 1 ? void 0 : `${100 / zoom}%`
        },
        children: (0, jsxFlowTree.jsx)(FlowNode, {
          node: node
        })
      })
    })]
  });
}
// ZoomButton (minified: Bf) — Small square toolbar button used by the zoom controls.
function ZoomButton({
  label: label,
  disabled: disabled,
  onClick: onClick,
  children: children
}) {
  return (0, jsxFlowTree.jsx)("button", {
    type: "button",
    title: label,
    "aria-label": label,
    disabled: disabled,
    onClick: onClick,
    className: "flex items-center justify-center rounded border border-border bg-card text-foreground h-5 w-5 cursor-pointer hover:opacity-80 disabled:opacity-40 disabled:cursor-default focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
    children: children
  });
}
// FlowNode (minified: Sb) — Renders one flow node by its kind: operator card, reference card, series group, parallel block, loop ("each") or condition ("if") with True / False branches.
function FlowNode({
  node: node
}) {
  switch (node.kind) {
    case "operator":
      return (0, jsxFlowTree.jsx)(OperatorNode, {
        node: node
      });
    case "reference":
      return (0, jsxFlowTree.jsx)(ReferenceCard, {
        node: node
      });
    case "series":
      return (0, jsxFlowTree.jsx)(ContainerCard, {
        label: node.label,
        icon: Rows3Icon,
        tone: "bg-sky-700",
        childrenPath: node.childrenPath,
        path: node.path,
        count: node.children.length,
        extra: (0, jsxFlowTree.jsxs)(jsxFlowTree.Fragment, {
          children: [(0, jsxFlowTree.jsx)(CopyNodeButtons, {
            path: node.path,
            label: "group"
          }), (0, jsxFlowTree.jsx)(DeleteNodeButton, {
            path: node.path,
            kind: "series",
            label: "group"
          })]
        }),
        children: (0, jsxFlowTree.jsx)(FlowNodeList, {
          nodes: node.children,
          empty: "No commands",
          childrenPath: node.childrenPath
        })
      });
    case "parallel":
      return (0, jsxFlowTree.jsx)(ContainerCard, {
        label: node.label,
        icon: SplitIcon,
        tone: "bg-indigo-700",
        badge: node.concurrency !== null ? `concurrency ${node.concurrency}` : null,
        childrenPath: node.childrenPath,
        path: node.path,
        count: node.children.length,
        extra: (0, jsxFlowTree.jsxs)(jsxFlowTree.Fragment, {
          children: [(0, jsxFlowTree.jsx)(CopyNodeButtons, {
            path: node.path,
            label: "parallel block"
          }), (0, jsxFlowTree.jsx)(DeleteNodeButton, {
            path: node.path,
            kind: "parallel",
            label: "parallel block"
          })]
        }),
        children: (0, jsxFlowTree.jsx)(FlowNodeList, {
          nodes: node.children,
          empty: "No commands",
          childrenPath: node.childrenPath
        })
      });
    // Loop: shows its collection expression (amber when it is a {{template}}), concurrency, and the steps run for each item.
    case "each":
      {
        let concurrency = node.concurrency ?? 1;
        return (0, jsxFlowTree.jsxs)(ContainerCard, {
          label: node.label,
          icon: RepeatIcon,
          tone: "bg-teal-700",
          badge: null,
          childrenPath: node.childrenPath,
          path: node.path,
          count: node.children.length,
          extra: (0, jsxFlowTree.jsxs)(jsxFlowTree.Fragment, {
            children: [(0, jsxFlowTree.jsx)(EditNodeButton, {
              path: node.path,
              kind: OP_EACH,
              title: "Edit this loop"
            }), (0, jsxFlowTree.jsx)(CopyNodeButtons, {
              path: node.path,
              label: "loop"
            }), (0, jsxFlowTree.jsx)(DeleteNodeButton, {
              path: node.path,
              kind: OP_EACH,
              label: "loop"
            })]
          }),
          children: [(0, jsxFlowTree.jsxs)("div", {
            className: "rounded border border-border bg-background px-3 py-2",
            children: [(0, jsxFlowTree.jsx)("p", {
              className: "m-0 text-[11px] text-muted-foreground",
              children: "Reference Collection"
            }), (0, jsxFlowTree.jsx)("span", {
              className: `font-mono text-[11px] break-words ${node.collection && hasTemplate(node.collection) ? "text-amber-500" : "text-foreground"}`,
              children: node.collection ?? "\u2014 not set \u2014"
            })]
          }), (0, jsxFlowTree.jsxs)("div", {
            className: "rounded border border-border bg-background px-3 py-2",
            children: [(0, jsxFlowTree.jsx)("p", {
              className: "m-0 text-[11px] text-muted-foreground",
              children: "Concurrency"
            }), (0, jsxFlowTree.jsx)("span", {
              className: "font-mono text-[11px] text-foreground",
              children: concurrency
            }), (0, jsxFlowTree.jsx)("span", {
              className: "text-[11px] text-muted-foreground ml-2",
              children: concurrency === 1 ? "sequential" : "items run in parallel"
            })]
          }), (0, jsxFlowTree.jsx)("p", {
            className: "m-0 mt-1 text-[11px] uppercase tracking-wider text-muted-foreground",
            children: "Logic applied to each item"
          }), (0, jsxFlowTree.jsx)(FlowNodeList, {
            nodes: node.children,
            empty: "No commands",
            childrenPath: node.childrenPath
          })]
        });
      }
    // Condition: shows the evaluator (a property comparison or a function's source) and the two branch lists side by side.
    case "if":
      return (0, jsxFlowTree.jsxs)("div", {
        className: "rounded-md overflow-hidden bg-rose-900",
        ...dragSourceProps(node.path, !0),
        children: [(0, jsxFlowTree.jsxs)("div", {
          className: "flex items-center gap-2 px-3 py-2 text-sm text-white font-medium",
          children: [(0, jsxFlowTree.jsx)(DragHandle, {
            path: node.path
          }), (0, jsxFlowTree.jsx)(SplitIcon, {
            className: "h-4 w-4 shrink-0"
          }), (0, jsxFlowTree.jsx)("span", {
            children: node.label
          }), (0, jsxFlowTree.jsxs)("span", {
            className: "ml-auto flex items-center gap-2",
            children: [(0, jsxFlowTree.jsx)(EditNodeButton, {
              path: node.path,
              kind: OP_IF,
              title: "Edit this condition"
            }), (0, jsxFlowTree.jsx)(CopyNodeButtons, {
              path: node.path,
              label: "condition"
            }), (0, jsxFlowTree.jsx)(DeleteNodeButton, {
              path: node.path,
              kind: OP_IF,
              label: "condition"
            })]
          })]
        }), (0, jsxFlowTree.jsxs)("div", {
          className: "bg-card m-1 mt-0 rounded p-3",
          children: [(0, jsxFlowTree.jsxs)("p", {
            className: "text-xs text-muted-foreground m-0 mb-2",
            children: ["Evaluator", (0, jsxFlowTree.jsx)("span", {
              className: "ml-2 text-foreground",
              children: node.evaluatorKind === "condition" ? "Condition" : node.evaluatorKind === "command" ? "Function" : "not set"
            })]
          }), node.evaluatorKind === "condition" && node.condition && (0, jsxFlowTree.jsxs)("div", {
            className: "flex flex-wrap items-baseline gap-2 rounded bg-slate-900 px-3 py-2",
            children: [(0, jsxFlowTree.jsx)("span", {
              className: "font-mono text-[11px] text-amber-300 break-all",
              children: node.condition.property
            }), (0, jsxFlowTree.jsx)("span", {
              className: "font-mono text-[11px] text-slate-300",
              children: node.condition.operator
            }), (0, jsxFlowTree.jsx)("span", {
              className: "font-mono text-[11px] text-slate-100 break-all",
              children: node.condition.value || '""'
            })]
          }), node.evaluatorKind !== "condition" && (node.evaluatorSource ? (0, jsxFlowTree.jsxs)(jsxFlowTree.Fragment, {
            children: [(0, jsxFlowTree.jsx)("pre", {
              className: "m-0 p-3 rounded bg-slate-900 text-slate-100 text-[11px] max-h-48 overflow-auto whitespace-pre",
              children: node.evaluatorSource
            }), node.evaluatorTruncated && (0, jsxFlowTree.jsx)("p", {
              className: "m-0 mt-1 text-[10px] italic text-muted-foreground",
              children: "truncated \u2014 edit it to see the whole function"
            })]
          }) : (0, jsxFlowTree.jsx)("p", {
            className: "m-0 text-xs text-muted-foreground",
            children: "No function set \u2014 this branch has nothing to evaluate."
          }))]
        }), (0, jsxFlowTree.jsx)("div", {
          className: "flow-scroll overflow-x-auto m-1 mt-0",
          children: (0, jsxFlowTree.jsxs)("div", {
            className: "grid gap-1 grid-cols-1 sm:grid-cols-[repeat(2,minmax(15rem,1fr))]",
            children: [(0, jsxFlowTree.jsxs)("div", {
              children: [(0, jsxFlowTree.jsxs)("p", {
                className: "flex items-center text-xs text-white/90 m-0 px-2 py-1",
                children: ["True", (0, jsxFlowTree.jsx)(AddOperatorButton, {
                  childrenPath: node.truePath,
                  where: "the True branch"
                })]
              }), (0, jsxFlowTree.jsx)("div", {
                className: "bg-card rounded p-2 flex flex-col gap-2",
                children: (0, jsxFlowTree.jsx)(FlowNodeList, {
                  nodes: node.whenTrue,
                  empty: "Nothing runs",
                  childrenPath: node.truePath
                })
              })]
            }), (0, jsxFlowTree.jsxs)("div", {
              children: [(0, jsxFlowTree.jsxs)("p", {
                className: "flex items-center text-xs text-white/90 m-0 px-2 py-1",
                children: ["False", (0, jsxFlowTree.jsx)(AddOperatorButton, {
                  childrenPath: node.falsePath,
                  where: "the False branch"
                })]
              }), (0, jsxFlowTree.jsx)("div", {
                className: "bg-card rounded p-2 flex flex-col gap-2",
                children: (0, jsxFlowTree.jsx)(FlowNodeList, {
                  nodes: node.whenFalse,
                  empty: "Nothing runs",
                  childrenPath: node.falsePath
                })
              })]
            })]
          })
        })]
      });
  }
}
// jsxRenameDelete (minified: To) — jsx runtime for the rename/delete buttons.
var jsxRenameDelete = V(Q());
// RenameDeleteButtons (minified: ku) — Pencil and bin icon buttons used next to a stage, action or command name.
function RenameDeleteButtons({
  kind: kind,
  label: label,
  onRename: onRename,
  onDelete: onDelete
}) {
  return (0, jsxRenameDelete.jsxs)("span", {
    className: "flex items-center gap-0.5 shrink-0",
    children: [(0, jsxRenameDelete.jsx)(Button, {
      variant: "ghost",
      size: "icon",
      className: "h-6 w-6",
      title: `Rename ${kind}`,
      "aria-label": `Rename ${kind} ${label}`,
      onClick: onRename,
      children: (0, jsxRenameDelete.jsx)(PencilIcon, {
        className: "h-3.5 w-3.5"
      })
    }), (0, jsxRenameDelete.jsx)(Button, {
      variant: "ghost",
      size: "icon",
      className: "h-6 w-6",
      title: `Delete ${kind}`,
      "aria-label": `Delete ${kind} ${label}`,
      onClick: onDelete,
      children: (0, jsxRenameDelete.jsx)(Trash2Icon, {
        className: "h-3.5 w-3.5 text-destructive"
      })
    })]
  });
}
// ReactAccess (minified: zr) — React namespace for the access-rules dialog.
var ReactAccess = V(Fe());
// jsxAccess (minified: H) — jsx runtime for the access-rules dialog.
// accessMethods: The access-rule methods the dialog can build: ids-based (user groups, users, permissions, picked from the instance) and a custom JavaScript function.
// defaultAccessFunction: Starting body for a new custom-function rule; it allows everyone until edited.
// accessSearchMinOptions: A rule's option list gets a search box once it has at least this many options.
var jsxAccess = V(Q()),
  accessMethods = [{
    method: "user_group",
    label: "User Group",
    icon: FolderIcon,
    kind: "ids",
    source: "groups",
    hint: "Anyone in a ticked group may perform the action."
  }, {
    method: "user",
    label: "User",
    icon: UserIcon,
    kind: "ids",
    source: "users",
    hint: "Named individuals."
  }, {
    method: "permission",
    label: "Permission",
    icon: KeyIcon,
    kind: "ids",
    source: "permissions",
    hint: "Anyone whose group grants a ticked permission."
  }, {
    method: "function",
    label: "Custom Function",
    icon: FileTextIcon,
    kind: "code",
    hint: "A JavaScript expression over the resource. Returns true to allow."
  }],
  defaultAccessFunction = `(res) => {
  //your code comes here
  return true
}`,
  accessSearchMinOptions = 8;
// allowsEveryone (minified: kb) — True when a custom access function's body is just "return true" (comments ignored), i.e. it restricts nobody.
function allowsEveryone(source) {
  let stripped = source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/[^\n]*/g, ""),
    body = (/=>\s*\{?([\s\S]*?)\}?\s*$/.exec(stripped.trim())?.[1] ?? stripped).trim();
  return /^return\s+true\s*;?$/.test(body) || /^true\s*;?$/.test(body);
}
// AccessRulesDialog (minified: Ib) — "Configure access" dialog for an action's rules: tick methods, pick groups / users / permissions (with search) or write a function; rules with other methods are kept as-is and can only be removed. onSave gets [{method, data}].
function AccessRulesDialog({
  actionLabel: actionLabel,
  rules: rules,
  subjects: subjects,
  saving: saving,
  onCancel: onCancel,
  onSave: onSave,
  onOpenFunction: onOpenFunction,
  subtitle: subtitle,
  openMessage: openMessage
}) {
  // Edited copy of the rules; reset when the rules prop changes.
  let [draftRules, setDraftRules] = (0, ReactAccess.useState)(rules);
  (0, ReactAccess.useEffect)(() => {
    setDraftRules(rules);
  }, [rules]);
  // stashedData: Ids of a method that was unticked, kept so ticking it again restores them.
  // toggleMethod: Ticks or unticks a method: unticking stashes its ids; ticking restores them, or starts with initialValue (the function template).
  // toggleId: Ticks or unticks one id within a method's rule.
  // subjectName: Display name for an id from the groups, users or permissions lists (the id itself if unknown).
  let ruleFor = method => draftRules.find(rule => rule.method === method) ?? null,
    otherRules = draftRules.filter(rule => !rule.known),
    [stashedData, setStashedData] = (0, ReactAccess.useState)({}),
    [searchText, setSearchText] = (0, ReactAccess.useState)({}),
    putRule = (method, label, data) => {
      setDraftRules(current => {
        let index = current.findIndex(rule => rule.method === method),
          newRule = {
            method: method,
            label: label,
            data: data,
            known: !0
          };
        if (index < 0) return [...current, newRule];
        let next = [...current];
        return next[index] = newRule, next;
      });
    },
    toggleMethod = (method, label, enabled, initialValue) => {
      if (!enabled) {
        let oldData = ruleFor(method)?.data ?? [];
        oldData.length > 0 && setStashedData(stash => ({
          ...stash,
          [method]: oldData
        })), setDraftRules(current => current.filter(rule => rule.method !== method));
        return;
      }
      let stashed = stashedData[method] ?? [];
      putRule(method, label, stashed.length > 0 ? stashed : initialValue ? [initialValue] : []);
    },
    toggleId = (method, label, id) => {
      let ids = ruleFor(method)?.data ?? [];
      putRule(method, label, ids.includes(id) ? ids.filter(other => other !== id) : [...ids, id]);
    },
    subjectName = id => {
      for (let list of [subjects.groups, subjects.users, subjects.permissions]) {
        let found = list.find(subject => subject.id === id);
        if (found) return found.name;
      }
      return id;
    },
    unrestricted = draftRules.length === 0,
    allAllowEveryone = draftRules.length > 0 && draftRules.every(rule => rule.method === "function" ? allowsEveryone(rule.data[0] ?? "") : !1);
  return (0, jsxAccess.jsx)("div", {
    className: "fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50",
    children: (0, jsxAccess.jsxs)("div", {
      className: "bg-card border border-border rounded-lg w-full max-w-xl max-h-[85vh] flex flex-col",
      children: [(0, jsxAccess.jsxs)("header", {
        className: "flex items-start justify-between gap-2 border-b border-border p-4",
        children: [(0, jsxAccess.jsxs)("div", {
          className: "min-w-0",
          children: [(0, jsxAccess.jsx)("h2", {
            className: "m-0 text-base font-semibold text-foreground truncate",
            children: "Configure access"
          }), (0, jsxAccess.jsx)("p", {
            className: "m-0 mt-0.5 text-xs text-muted-foreground truncate",
            children: subtitle ?? `Who may perform ${actionLabel}`
          })]
        }), (0, jsxAccess.jsx)(Button, {
          variant: "ghost",
          size: "icon",
          onClick: onCancel,
          title: "Cancel",
          children: (0, jsxAccess.jsx)(XIcon, {
            className: "h-4 w-4"
          })
        })]
      }), (0, jsxAccess.jsxs)("div", {
        className: "flex-1 overflow-y-auto p-4 flex flex-col gap-4",
        children: [(0, jsxAccess.jsxs)("div", {
          className: cn("flex items-start gap-2 rounded-md border px-3 py-2 text-xs", unrestricted ? "border-amber-500/60 text-amber-500" : "border-border text-muted-foreground"),
          children: [unrestricted ? (0, jsxAccess.jsx)(LockOpenIcon, {
            className: "h-4 w-4 shrink-0"
          }) : (0, jsxAccess.jsx)(LockIcon, {
            className: "h-4 w-4 shrink-0"
          }), (0, jsxAccess.jsxs)("span", {
            children: [unrestricted ? openMessage ?? "No restrictions. Any user will be able to perform this action." : `${draftRules.length} rule${draftRules.length === 1 ? "" : "s"}: ` + draftRules.map(rule => rule.label ?? rule.method).join(", "), !unrestricted && allAllowEveryone && (0, jsxAccess.jsx)("span", {
              className: "block",
              children: "Every rule here allows everyone as written, so nothing is actually restricted yet."
            })]
          })]
        }), subjects.error && (0, jsxAccess.jsxs)("p", {
          className: "m-0 flex items-start gap-1.5 text-xs text-destructive",
          children: [(0, jsxAccess.jsx)(TriangleAlertIcon, {
            className: "h-3.5 w-3.5 shrink-0 mt-px"
          }), subjects.error]
        }), accessMethods.map(methodDef => {
          // One section per known method: its checkbox, then the function editor or the searchable option list.
          // While searching, ticked options stay at the top and visible.
          let rule = ruleFor(methodDef.method),
            enabled = rule !== null,
            options = methodDef.source ? subjects[methodDef.source] : [],
            MethodIcon = methodDef.icon,
            code = rule?.data[0] ?? "",
            missingIds = (rule?.data ?? []).filter(id => !options.some(option => option.id === id)),
            query = (searchText[methodDef.method] ?? "").trim().toLowerCase(),
            matches = query.length === 0 ? options : options.filter(option => option.name.toLowerCase().includes(query) || (option.detail ?? "").toLowerCase().includes(query) || option.id.toLowerCase().includes(query)),
            shown = query.length === 0 ? options : [...options.filter(option => rule?.data.includes(option.id)), ...matches.filter(option => !rule?.data.includes(option.id))];
          return (0, jsxAccess.jsxs)("div", {
            className: cn("flex flex-col gap-1.5 rounded-md border p-2", enabled ? "border-border" : "border-transparent"),
            children: [(0, jsxAccess.jsxs)("label", {
              className: "flex items-center gap-2 cursor-pointer",
              children: [(0, jsxAccess.jsx)("input", {
                type: "checkbox",
                checked: enabled,
                onChange: changeEvent => toggleMethod(methodDef.method, methodDef.label, changeEvent.target.checked, methodDef.kind === "code" ? defaultAccessFunction : void 0),
                className: "shrink-0"
              }), (0, jsxAccess.jsxs)("span", {
                className: "flex items-center gap-1.5 text-xs text-foreground",
                children: [(0, jsxAccess.jsx)(MethodIcon, {
                  className: "h-3.5 w-3.5"
                }), methodDef.label]
              }), enabled && methodDef.kind === "ids" && (0, jsxAccess.jsxs)("span", {
                className: "text-[10px] text-muted-foreground",
                children: [rule.data.length, " selected"]
              })]
            }), enabled ? methodDef.kind === "code" ? (0, jsxAccess.jsxs)(jsxAccess.Fragment, {
              children: [(0, jsxAccess.jsxs)("div", {
                className: "rounded-md border border-border overflow-hidden",
                children: [(0, jsxAccess.jsxs)("div", {
                  className: "flex items-center gap-2 bg-muted px-2 py-1",
                  children: [(0, jsxAccess.jsx)("span", {
                    className: "text-[10px] font-mono text-muted-foreground",
                    children: "javascript"
                  }), (0, jsxAccess.jsx)("span", {
                    className: "flex-1"
                  }), onOpenFunction && (0, jsxAccess.jsxs)("button", {
                    type: "button",
                    onClick: onOpenFunction,
                    title: "Open as a real .js file \u2014 saving it writes back to the instance",
                    className: "flex items-center gap-1 rounded border border-border bg-input px-1.5 py-0.5 text-[10px] text-foreground cursor-pointer hover:opacity-80",
                    children: [(0, jsxAccess.jsx)(FileCodeCornerIcon, {
                      className: "h-3 w-3"
                    }), "Open in editor"]
                  })]
                }), (0, jsxAccess.jsx)("textarea", {
                  value: code,
                  onChange: changeEvent => putRule(methodDef.method, methodDef.label, [changeEvent.target.value]),
                  spellCheck: !1,
                  rows: 5,
                  wrap: "off",
                  className: "w-full bg-input text-foreground px-2 py-1.5 font-mono text-xs leading-5 resize-y border-none overflow-auto focus:outline-none"
                })]
              }), allowsEveryone(code) && (0, jsxAccess.jsx)("p", {
                className: "m-0 text-[11px] text-amber-500",
                children: "This returns true for everything, so it allows everyone until you change it."
              }), (0, jsxAccess.jsxs)("p", {
                className: "m-0 text-[11px] text-muted-foreground",
                children: [methodDef.hint, " The editor saves straight to the instance; this box saves with the dialog."]
              })]
            }) : options.length === 0 ? (0, jsxAccess.jsx)("p", {
              className: "m-0 text-[11px] text-muted-foreground",
              children: subjects.error ? "Unavailable \u2014 see above." : `Reading this instance's ${methodDef.label.toLowerCase()}s\u2026`
            }) : (0, jsxAccess.jsxs)(jsxAccess.Fragment, {
              children: [options.length >= accessSearchMinOptions && (0, jsxAccess.jsxs)("div", {
                className: "relative",
                children: [(0, jsxAccess.jsx)(SearchIcon, {
                  className: "h-3 w-3 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                }), (0, jsxAccess.jsx)("input", {
                  value: searchText[methodDef.method] ?? "",
                  onChange: changeEvent => setSearchText(prev => ({
                    ...prev,
                    [methodDef.method]: changeEvent.target.value
                  })),
                  placeholder: `Search ${options.length} ${methodDef.label.toLowerCase()}s`,
                  className: "w-full rounded-md border border-border bg-input text-foreground pl-7 pr-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
                })]
              }), (0, jsxAccess.jsxs)("div", {
                className: "flex flex-col gap-1 rounded-md border border-border p-2 max-h-40 overflow-y-auto",
                children: [shown.length === 0 && (0, jsxAccess.jsxs)("p", {
                  className: "m-0 text-[11px] text-muted-foreground",
                  children: ["Nothing matches \u201C", searchText[methodDef.method], "\u201D."]
                }), shown.map(option => (0, jsxAccess.jsxs)("label", {
                  className: "flex items-start gap-2 text-xs cursor-pointer",
                  children: [(0, jsxAccess.jsx)("input", {
                    type: "checkbox",
                    checked: rule.data.includes(option.id),
                    onChange: () => toggleId(methodDef.method, methodDef.label, option.id),
                    className: "mt-0.5 shrink-0"
                  }), (0, jsxAccess.jsxs)("span", {
                    className: "min-w-0",
                    children: [(0, jsxAccess.jsx)("span", {
                      className: "block text-foreground truncate",
                      children: option.name
                    }), option.detail && (0, jsxAccess.jsx)("span", {
                      className: "block text-[11px] text-muted-foreground truncate",
                      children: option.detail
                    })]
                  })]
                }, option.id))]
              }), query.length > 0 && matches.length < options.length && (0, jsxAccess.jsxs)("p", {
                className: "m-0 text-[11px] text-muted-foreground",
                children: [options.length - matches.length, " hidden by the search. Anything already ticked stays visible."]
              }), rule.data.length === 0 && (0, jsxAccess.jsx)("p", {
                className: "m-0 text-[11px] text-amber-500",
                children: "Nothing selected \u2014 nobody matches this rule yet."
              }), missingIds.length > 0 && (0, jsxAccess.jsxs)("p", {
                className: "m-0 text-[11px] text-amber-500 break-all",
                children: ["Not on this instance: ", missingIds.join(", ")]
              }), (0, jsxAccess.jsx)("p", {
                className: "m-0 text-[11px] text-muted-foreground",
                children: methodDef.hint
              })]
            }) : null]
          }, methodDef.method);
        }), otherRules.length > 0 && (0, jsxAccess.jsxs)("div", {
          className: "flex flex-col gap-1.5",
          children: [(0, jsxAccess.jsx)(Label, {
            children: "Other rules"
          }), otherRules.map((rule, index) => (0, jsxAccess.jsxs)("div", {
            className: "flex items-start gap-2 rounded-md border border-border px-2 py-1.5",
            children: [(0, jsxAccess.jsxs)("div", {
              className: "min-w-0 flex-1",
              children: [(0, jsxAccess.jsxs)("p", {
                className: "m-0 text-xs text-foreground",
                children: [rule.label ?? rule.method, (0, jsxAccess.jsx)("span", {
                  className: "ml-1.5 font-mono text-[10px] text-muted-foreground",
                  children: rule.method
                })]
              }), rule.data.length > 0 && (0, jsxAccess.jsx)("p", {
                className: "m-0 text-[10px] font-mono text-muted-foreground break-all",
                children: rule.data.map(subjectName).join(", ")
              })]
            }), (0, jsxAccess.jsx)(Button, {
              variant: "ghost",
              size: "icon",
              className: "h-6 w-6 shrink-0",
              title: "Remove this rule",
              onClick: () => setDraftRules(current => current.filter(other => other !== rule)),
              children: (0, jsxAccess.jsx)(XIcon, {
                className: "h-3 w-3"
              })
            })]
          }, `${rule.method}-${index}`)), (0, jsxAccess.jsx)("p", {
            className: "m-0 text-[11px] text-muted-foreground",
            children: "Kept exactly as the instance wrote them \u2014 this extension has no builder for these methods. Create them in the web app."
          })]
        })]
      }), (0, jsxAccess.jsxs)("footer", {
        className: "flex items-center justify-end gap-2 border-t border-border p-4",
        children: [(0, jsxAccess.jsx)(Button, {
          variant: "ghost",
          onClick: onCancel,
          disabled: saving,
          children: "Cancel"
        }), (0, jsxAccess.jsx)(Button, {
          onClick: () => onSave(draftRules.map(rule => ({
            method: rule.method,
            data: rule.data
          }))),
          disabled: saving,
          className: cn(saving && "opacity-70"),
          children: saving ? "Saving\u2026" : "Save access"
        })]
      })]
    })
  });
}
// AddAccessButton (minified: Ab) — Small "Access" button that opens the access dialog for an action.
function AddAccessButton({
  onClick: onClick
}) {
  return (0, jsxAccess.jsxs)("button", {
    type: "button",
    onClick: onClick,
    title: "Configure who may perform this action",
    className: "flex items-center gap-1 rounded border border-border bg-input px-1.5 py-0.5 text-[11px] text-foreground cursor-pointer hover:opacity-80",
    children: [(0, jsxAccess.jsx)(PlusIcon, {
      className: "h-3 w-3"
    }), "Access"]
  });
}
// jsxActionPanel (minified: le) — jsx runtime for the action details panel.
var jsxActionPanel = V(Q());
// UnderlineTab (minified: Mb) — Text tab with an underline when active.
function UnderlineTab({
  label: label,
  active: active,
  onClick: onClick
}) {
  return (0, jsxActionPanel.jsx)("button", {
    type: "button",
    onClick: onClick,
    className: cn("bg-transparent border-none border-b-2 pb-1.5 px-0.5 text-sm cursor-pointer", active ? "border-b-primary text-primary font-medium" : "border-b-transparent text-muted-foreground hover:text-foreground"),
    children: label
  });
}
// ActionDetails (minified: Uf) — Details of the selected action: name with rename/delete, who may perform it (with an Access button), batch / confirm-message notes, and Flow / Form tabs (the zoomable flow, or the form fields with edit / remove / Add Field).
function ActionDetails({
  action: action,
  onAddField: onAddField,
  onEditField: onEditField,
  onDeleteField: onDeleteField,
  onRename: onRename,
  onDelete: onDelete,
  onConfigureAccess: onConfigureAccess
}) {
  let [tab, setTab] = (0, ReactForActionPanel.useState)("flow");
  return action ? (0, jsxActionPanel.jsxs)("div", {
    className: cn("flex flex-col gap-3 min-w-0", tab === "flow" && "flex-1 min-h-0"),
    children: [(0, jsxActionPanel.jsxs)("div", {
      children: [(0, jsxActionPanel.jsxs)("div", {
        className: "flex items-center justify-between gap-2",
        children: [(0, jsxActionPanel.jsx)("h3", {
          className: "m-0 text-lg font-semibold text-foreground truncate",
          children: action.label
        }), onRename && onDelete && (0, jsxActionPanel.jsx)(RenameDeleteButtons, {
          kind: "action",
          label: action.label,
          onRename: () => onRename(action),
          onDelete: () => onDelete(action)
        })]
      }), (0, jsxActionPanel.jsxs)("div", {
        className: "flex flex-wrap items-center gap-3 mt-1",
        children: [(0, jsxActionPanel.jsxs)("span", {
          className: cn("flex items-center gap-1.5 text-xs", action.access.length > 0 ? "text-foreground" : "text-muted-foreground"),
          title: action.access.length > 0 ? action.access.map(rule => `${rule.label ?? rule.method}: ${rule.data.length > 0 ? rule.data.join(", ") : "no ids"}`).join(`
`) : "No restrictions are set",
          children: [action.access.length > 0 ? (0, jsxActionPanel.jsx)(LockIcon, {
            className: "h-3.5 w-3.5"
          }) : action.actorLabel === "Everyone" ? (0, jsxActionPanel.jsx)(UserIcon, {
            className: "h-3.5 w-3.5"
          }) : (0, jsxActionPanel.jsx)(UsersIcon, {
            className: "h-3.5 w-3.5"
          }), action.access.length > 0 ? action.access.map(rule => {
            let ruleLabel = rule.label ?? rule.method;
            return rule.data.length > 0 ? `${ruleLabel} (${rule.data.length})` : ruleLabel;
          }).join(", ") : action.actorLabel]
        }), onConfigureAccess && (0, jsxActionPanel.jsx)(AddAccessButton, {
          onClick: () => onConfigureAccess(action)
        }), action.isBatchAction && (0, jsxActionPanel.jsx)("span", {
          className: "text-[11px] rounded px-1.5 py-0.5 bg-muted text-muted-foreground",
          children: "batch action"
        })]
      }), action.confirmMessage && (0, jsxActionPanel.jsxs)("p", {
        className: "flex items-start gap-1.5 text-xs text-muted-foreground m-0 mt-2",
        children: [(0, jsxActionPanel.jsx)(MessageSquareWarningIcon, {
          className: "h-3.5 w-3.5 shrink-0 mt-px"
        }), action.confirmMessage]
      })]
    }), (0, jsxActionPanel.jsxs)("div", {
      className: "flex items-center gap-4 border-b border-border",
      children: [(0, jsxActionPanel.jsx)(UnderlineTab, {
        label: "Flow",
        active: tab === "flow",
        onClick: () => setTab("flow")
      }), (0, jsxActionPanel.jsx)(UnderlineTab, {
        label: action.form.length > 0 ? `Form (${action.form.length})` : "Form",
        active: tab === "form",
        onClick: () => setTab("form")
      })]
    }), tab === "flow" ? action.flow ? (0, jsxActionPanel.jsx)(ZoomableFlow, {
      node: action.flow
    }) : (0, jsxActionPanel.jsx)(EmptyNote, {
      children: "This action has no flow."
    }) : (0, jsxActionPanel.jsxs)("div", {
      className: "flex flex-col gap-2",
      children: [action.form.length === 0 ? (0, jsxActionPanel.jsx)(EmptyNote, {
        children: "This action has no form fields."
      }) : action.form.map(field => (0, jsxActionPanel.jsxs)("div", {
        className: "rounded-md border border-border bg-card px-3 py-2",
        children: [(0, jsxActionPanel.jsxs)("div", {
          className: "flex items-center justify-between gap-2",
          children: [(0, jsxActionPanel.jsxs)("span", {
            className: "text-sm text-foreground",
            children: [field.label, field.required && (0, jsxActionPanel.jsx)("span", {
              className: "text-destructive ml-1",
              children: "*"
            })]
          }), (0, jsxActionPanel.jsxs)("span", {
            className: "flex items-center gap-2 shrink-0",
            children: [(0, jsxActionPanel.jsx)("span", {
              className: "text-[11px] text-muted-foreground",
              children: [field.type, field.inputType].filter(Boolean).join(" \xB7 ")
            }), onEditField && (0, jsxActionPanel.jsx)(Button, {
              variant: "ghost",
              size: "icon",
              className: "h-6 w-6",
              title: `Edit ${field.label}`,
              onClick: () => onEditField(action, field),
              children: (0, jsxActionPanel.jsx)(PencilIcon, {
                className: "h-3.5 w-3.5"
              })
            }), onDeleteField && (0, jsxActionPanel.jsx)(Button, {
              variant: "ghost",
              size: "icon",
              className: "h-6 w-6",
              title: `Remove ${field.label}`,
              onClick: () => onDeleteField(action, field.key),
              children: (0, jsxActionPanel.jsx)(Trash2Icon, {
                className: "h-3.5 w-3.5"
              })
            })]
          })]
        }), (0, jsxActionPanel.jsx)("span", {
          className: "block text-xs font-mono text-muted-foreground mt-0.5",
          children: field.key
        })]
      }, field.key)), onAddField && (0, jsxActionPanel.jsxs)(Button, {
        variant: "secondary",
        onClick: () => onAddField(action),
        className: "justify-center gap-2",
        children: [(0, jsxActionPanel.jsx)(PlusIcon, {
          className: "h-4 w-4"
        }), "Add Field"]
      })]
    })]
  }) : (0, jsxActionPanel.jsx)(EmptyNote, {
    children: "No action selected"
  });
}
// ReactCreateDialog (minified: Zl) — React namespace for the create/edit dialog.
var ReactCreateDialog = V(Fe());
// jsxCreateOrEditDialog (minified: J) — jsx runtime for the create/edit dialog.
// createDialogCopy: Title, field label, placeholder and hint for each kind of item the create dialog makes.
// parameterTypes: Types a command parameter or form field can have.
var jsxCreateOrEditDialog = V(Q()),
  createDialogCopy = {
    stage: {
      title: "New stage",
      field: "Stage name",
      placeholder: "Pending Approval",
      hint: "A stage a record can sit in. Its machine name is what a record's `status` holds."
    },
    action: {
      title: "New action",
      field: "Action name",
      placeholder: "Approve",
      hint: "Starts empty; add operators to its flow once it exists."
    },
    command: {
      title: "New command",
      field: "Command name",
      placeholder: "Send reminder",
      hint: "A reusable flow that actions can reference."
    },
    parameter: {
      title: "New field",
      field: "Field name",
      placeholder: "Recipient email",
      hint: "An input the command accepts when it runs."
    }
  },
  parameterTypes = ["string", "number", "boolean", "object", "array"];
// toMachineName (minified: Tb) — Turns a label into a machine name: lower case, runs of other characters as "_", at most 64 characters.
function toMachineName(text) {
  return text.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 64);
}
// CreateOrEditDialog (minified: Db) — Dialog that creates a stage, action, command or field, or edits a field (target.editing): name (with its machine name), and for fields the key, type and Required; for stages a colour. onSubmit(label, colour, type, required, machineName).
function CreateOrEditDialog({
  target: target,
  saving: saving,
  error: error,
  onCancel: onCancel,
  onSubmit: onSubmit
}) {
  // keyChanged: Editing a field's key renames what the flow reads as _params.<key>, so it is warned about.
  let editing = target.editing,
    [label, setLabel] = (0, ReactCreateDialog.useState)(editing?.label ?? ""),
    [colour, setColour] = (0, ReactCreateDialog.useState)(COLOUR_SWATCHES[0]),
    [type, setType] = (0, ReactCreateDialog.useState)(editing?.type ?? "string"),
    [required, setRequired] = (0, ReactCreateDialog.useState)(editing?.required ?? !1),
    [key, setKey] = (0, ReactCreateDialog.useState)(editing?.key ?? ""),
    copy = createDialogCopy[target.kind],
    machineName = (0, ReactCreateDialog.useMemo)(() => toMachineName(editing ? key : label), [editing, key, label]),
    canSubmit = machineName.length > 0 && label.trim().length > 0 && !saving,
    keyChanged = !!editing && machineName !== editing.key;
  return (0, jsxCreateOrEditDialog.jsx)("div", {
    className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4",
    children: (0, jsxCreateOrEditDialog.jsxs)("div", {
      className: "flex flex-col w-full max-w-md rounded-lg border border-border bg-card shadow-lg",
      children: [(0, jsxCreateOrEditDialog.jsxs)("header", {
        className: "flex items-start justify-between gap-3 p-4 border-b border-border",
        children: [(0, jsxCreateOrEditDialog.jsxs)("div", {
          className: "min-w-0",
          children: [(0, jsxCreateOrEditDialog.jsx)("h2", {
            className: "m-0 text-base font-semibold text-foreground",
            children: editing ? `Edit ${editing.label}` : copy.title
          }), (0, jsxCreateOrEditDialog.jsxs)("p", {
            className: "m-0 mt-0.5 text-xs text-muted-foreground",
            children: ["in ", target.where]
          })]
        }), (0, jsxCreateOrEditDialog.jsx)(Button, {
          variant: "ghost",
          size: "icon",
          onClick: onCancel,
          title: "Cancel",
          children: (0, jsxCreateOrEditDialog.jsx)(XIcon, {
            className: "h-4 w-4"
          })
        })]
      }), (0, jsxCreateOrEditDialog.jsxs)("div", {
        className: "p-4 flex flex-col gap-4",
        children: [(0, jsxCreateOrEditDialog.jsxs)("div", {
          className: "flex flex-col gap-1.5",
          children: [(0, jsxCreateOrEditDialog.jsx)(Label, {
            htmlFor: "create-label",
            children: copy.field
          }), (0, jsxCreateOrEditDialog.jsx)(Input, {
            id: "create-label",
            autoFocus: !0,
            value: label,
            onChange: changeEvent => setLabel(changeEvent.target.value),
            onKeyDown: keyEvent => {
              keyEvent.key === "Enter" && canSubmit && onSubmit(label, colour, type, required, machineName);
            },
            placeholder: copy.placeholder
          }), (0, jsxCreateOrEditDialog.jsx)("p", {
            className: "m-0 text-[11px] text-muted-foreground",
            children: editing ? "Shown above the input in forms." : machineName ? (0, jsxCreateOrEditDialog.jsxs)(jsxCreateOrEditDialog.Fragment, {
              children: ["Stored as ", (0, jsxCreateOrEditDialog.jsx)("span", {
                className: "font-mono",
                children: machineName
              })]
            }) : copy.hint
          })]
        }), target.kind === "parameter" && (0, jsxCreateOrEditDialog.jsxs)(jsxCreateOrEditDialog.Fragment, {
          children: [editing && (0, jsxCreateOrEditDialog.jsxs)("div", {
            className: "flex flex-col gap-1.5",
            children: [(0, jsxCreateOrEditDialog.jsx)(Label, {
              htmlFor: "create-key",
              children: "Key"
            }), (0, jsxCreateOrEditDialog.jsx)(Input, {
              id: "create-key",
              value: key,
              onChange: changeEvent => setKey(changeEvent.target.value),
              spellCheck: !1
            }), keyChanged ? (0, jsxCreateOrEditDialog.jsxs)("p", {
              className: "m-0 text-[11px] text-destructive",
              children: ["Renaming the key breaks anything in the flow that reads", (0, jsxCreateOrEditDialog.jsxs)("span", {
                className: "font-mono",
                children: [" _params.", editing.key]
              }), "."]
            }) : (0, jsxCreateOrEditDialog.jsxs)("p", {
              className: "m-0 text-[11px] text-muted-foreground",
              children: ["What the flow references as", (0, jsxCreateOrEditDialog.jsxs)("span", {
                className: "font-mono",
                children: [" _params.", editing.key]
              }), "."]
            })]
          }), (0, jsxCreateOrEditDialog.jsxs)("div", {
            className: "flex flex-col gap-1.5",
            children: [(0, jsxCreateOrEditDialog.jsx)(Label, {
              htmlFor: "create-type",
              children: "Type"
            }), (0, jsxCreateOrEditDialog.jsx)("select", {
              id: "create-type",
              value: type,
              onChange: changeEvent => setType(changeEvent.target.value),
              className: "w-full h-9 rounded-md border border-border bg-input text-foreground px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring",
              children: parameterTypes.map(typeName => (0, jsxCreateOrEditDialog.jsx)("option", {
                value: typeName,
                children: typeName
              }, typeName))
            }), (0, jsxCreateOrEditDialog.jsx)("p", {
              className: "m-0 text-[11px] text-muted-foreground",
              children: "Picks the input the field renders \u2014 a boolean becomes a switch."
            })]
          }), (0, jsxCreateOrEditDialog.jsxs)("label", {
            className: "flex items-center gap-2 text-sm text-foreground cursor-pointer",
            children: [(0, jsxCreateOrEditDialog.jsx)("input", {
              type: "checkbox",
              checked: required,
              onChange: changeEvent => setRequired(changeEvent.target.checked)
            }), "Required"]
          })]
        }), target.kind === "stage" && (0, jsxCreateOrEditDialog.jsx)(ColourPicker, {
          value: colour,
          onChange: setColour
        }), error && (0, jsxCreateOrEditDialog.jsx)("div", {
          className: "rounded-md border border-destructive/50 p-3",
          children: (0, jsxCreateOrEditDialog.jsx)("p", {
            className: "m-0 text-xs text-destructive",
            children: error
          })
        })]
      }), (0, jsxCreateOrEditDialog.jsxs)("footer", {
        className: "flex items-center justify-end gap-2 p-4 border-t border-border",
        children: [(0, jsxCreateOrEditDialog.jsx)(Button, {
          variant: "ghost",
          onClick: onCancel,
          disabled: saving,
          children: "Cancel"
        }), (0, jsxCreateOrEditDialog.jsx)(Button, {
          onClick: () => onSubmit(label, colour, type, required, machineName),
          disabled: !canSubmit,
          children: saving ? "Saving\u2026" : editing ? "Save changes" : copy.title.replace("New", "Create")
        })]
      })]
    })
  });
}
// ReactTriggers (minified: el) — React namespace for the triggers panel.
var ReactTriggers = V(Fe());
// jsxTriggers (minified: T) — jsx runtime for the triggers panel.
// triggerProviderIcons: Icon for each trigger provider.
// cronPresets: Quick-pick schedules shown above a cron trigger's settings.
var jsxTriggers = V(Q()),
  triggerProviderIcons = {
    cron: ClockIcon,
    email: MailIcon,
    http: GlobeIcon
  },
  cronPresets = [{
    label: "Every 5 minutes",
    expression: "*/5 * * * *"
  }, {
    label: "Hourly",
    expression: "0 * * * *"
  }, {
    label: "Daily at 08:00",
    expression: "0 8 * * *"
  }, {
    label: "Weekdays at 09:00",
    expression: "0 9 * * 1-5"
  }, {
    label: "Mondays at 09:00",
    expression: "0 9 * * 1"
  }];
// describeCron (minified: Bb) — Describes a cron expression in words for the common shapes (every N minutes, hourly, daily, weekdays, one weekday); null otherwise. A leading seconds field is skipped.
function describeCron(expression) {
  let fields = expression.trim().split(/\s+/),
    [minute, hour, dayOfMonth, month, dayOfWeek] = fields.length === 6 ? fields.slice(1) : fields;
  if (!minute || !hour) return null;
  let isAny = field => field === "*" || field === "?" || field === void 0,
    everyN = /^\*\/(\d+)$/.exec(minute);
  if (everyN && isAny(hour) && isAny(dayOfMonth) && isAny(month) && isAny(dayOfWeek)) return `Every ${everyN[1]} minutes.`;
  if (minute === "*" && isAny(hour)) return "Every minute.";
  if (/^\d+$/.test(minute) && hour === "*") return `At ${minute} minutes past every hour.`;
  if (/^\d+$/.test(minute) && /^\d+$/.test(hour)) {
    let time = `${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`;
    if (isAny(dayOfMonth) && isAny(month) && isAny(dayOfWeek)) return `Every day at ${time}.`;
    if (isAny(dayOfMonth) && isAny(month)) {
      let dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      if (/^\d$/.test(dayOfWeek)) return `Every ${dayNames[Number(dayOfWeek)] ?? dayOfWeek} at ${time}.`;
      if (dayOfWeek === "1-5") return `Every weekday at ${time}.`;
    }
  }
  return null;
}
// TriggersPanel (minified: Ob) — Triggers tab: the instance's WorkflowTrigger records for this workflow, with refresh, New trigger, an offline / queued-writes banner, one row per trigger and the trigger dialog.
function TriggersPanel({
  triggers: triggers,
  catalog: catalog,
  instanceUrl: instanceUrl,
  loading: loading,
  error: error,
  saving: saving,
  actions: actions,
  offline: offline,
  rememberedAt: rememberedAt,
  queued = 0,
  onRefresh: onRefresh,
  onCreate: onCreate,
  onUpdate: onUpdate,
  onDelete: onDelete
}) {
  // actionLabel: Label of a workflow action by id, for trigger rows.
  let [editing, setEditing] = (0, ReactTriggers.useState)(null),
    actionLabel = actionId => {
      let action = actions.find(candidate => candidate.id === actionId);
      return action ? action.label : actionId;
    };
  return (0, jsxTriggers.jsxs)("div", {
    className: "flex flex-col gap-3 min-h-0 flex-1",
    children: [(0, jsxTriggers.jsxs)("div", {
      className: "flex items-center gap-2",
      children: [(0, jsxTriggers.jsxs)("div", {
        className: "min-w-0",
        children: [(0, jsxTriggers.jsx)("h2", {
          className: "m-0 text-sm font-semibold text-foreground",
          children: "Triggers"
        }), (0, jsxTriggers.jsxs)("p", {
          className: "m-0 text-[11px] text-muted-foreground",
          children: [(0, jsxTriggers.jsx)("code", {
            children: "WorkflowTrigger"
          }), " records on the instance, not part of this workflow's definition."]
        })]
      }), (0, jsxTriggers.jsx)("span", {
        className: "flex-1"
      }), (0, jsxTriggers.jsx)(Button, {
        variant: "ghost",
        size: "icon",
        onClick: onRefresh,
        title: "Refresh triggers",
        children: (0, jsxTriggers.jsx)(RefreshCwIcon, {
          className: "h-4 w-4"
        })
      }), (0, jsxTriggers.jsxs)(Button, {
        onClick: () => setEditing("new"),
        className: "gap-1",
        disabled: catalog.length === 0,
        title: catalog.length === 0 ? "Waiting for the instance's trigger providers" : offline ? "Add a trigger \u2014 it waits here until the instance is reachable" : "Add a trigger",
        children: [(0, jsxTriggers.jsx)(PlusIcon, {
          className: "h-4 w-4"
        }), "New trigger"]
      })]
    }), (offline || queued > 0) && (0, jsxTriggers.jsxs)("div", {
      className: "flex items-start gap-2 rounded-md border border-amber-500/60 bg-amber-500/10 px-3 py-2",
      children: [(0, jsxTriggers.jsx)(CloudOffIcon, {
        className: "h-4 w-4 shrink-0 mt-0.5 text-amber-500"
      }), (0, jsxTriggers.jsxs)("p", {
        className: "m-0 text-[11px] text-foreground",
        children: [offline && (0, jsxTriggers.jsxs)(jsxTriggers.Fragment, {
          children: ["The instance is unreachable, so these are the copies from", rememberedAt ? ` ${new Date(rememberedAt).toLocaleString()}` : " earlier", ". You can still add, edit, and delete: the writes wait here and are applied when the connection returns.", " "]
        }), queued > 0 && (0, jsxTriggers.jsxs)(jsxTriggers.Fragment, {
          children: [queued, " ", queued === 1 ? "write is" : "writes are", " waiting. An edit is replayed as a patch, so it keeps the password stored on the instance and cannot overwrite a change someone else made meanwhile. A password typed here goes to your OS keychain, never to a file."]
        })]
      })]
    }), error && (0, jsxTriggers.jsx)("p", {
      className: "m-0 text-xs text-destructive",
      children: error
    }), loading && triggers.length === 0 ? (0, jsxTriggers.jsx)(EmptyNote, {
      children: "Reading triggers\u2026"
    }) : triggers.length === 0 ? (0, jsxTriggers.jsxs)("div", {
      className: "rounded-md border border-dashed border-border p-6 text-center",
      children: [(0, jsxTriggers.jsx)(ZapIcon, {
        className: "h-5 w-5 mx-auto text-muted-foreground"
      }), (0, jsxTriggers.jsx)("p", {
        className: "m-0 mt-2 text-sm text-foreground",
        children: "Nothing starts this workflow yet."
      }), (0, jsxTriggers.jsx)("p", {
        className: "m-0 mt-1 text-[11px] text-muted-foreground",
        children: catalog.length > 0 ? catalog.map(provider => provider.description ?? provider.name).join(" \xB7 ") : "A trigger runs one or more of the workflow's actions."
      })]
    }) : (0, jsxTriggers.jsx)("div", {
      className: "flex flex-col gap-2 overflow-y-auto",
      children: triggers.map(trigger => (0, jsxTriggers.jsx)(TriggerRow, {
        trigger: trigger,
        instanceUrl: instanceUrl,
        catalog: catalog,
        actionLabel: actionLabel,
        onEdit: () => setEditing(trigger),
        onDelete: onDelete
      }, trigger.id))
    }), editing && (0, jsxTriggers.jsx)(TriggerDialog, {
      catalog: catalog,
      instanceUrl: instanceUrl,
      saving: saving,
      error: error,
      actions: actions,
      editing: editing === "new" ? null : editing,
      onCancel: () => setEditing(null),
      // Creates a new trigger or updates the one being edited.
      onSubmit: (providerId, values, actionIds) => {
        editing === "new" ? onCreate(providerId, values, actionIds) : onUpdate(editing, providerId, values, actionIds), setEditing(null);
      }
    })]
  });
}
// TriggerRow (minified: cw) — One trigger: provider icon, summary (and cron description or webhook URL), pending / status badges, the actions it runs, edit / delete; click to show its settings.
function TriggerRow({
  trigger: trigger,
  instanceUrl: instanceUrl,
  catalog: catalog,
  actionLabel: actionLabel,
  onEdit: onEdit,
  onDelete: onDelete
}) {
  let [expanded, setExpanded] = (0, ReactTriggers.useState)(!1),
    ProviderIcon = triggerProviderIcons[trigger.provider] ?? ZapIcon,
    provider = catalog.find(candidate => candidate.id === trigger.provider),
    paramLabel = key => provider?.params.find(param => param.key === key)?.label ?? key,
    summaryLine = trigger.provider === "cron" ? describeCron(String(trigger.configuration.expression ?? "")) : trigger.provider === "http" ? httpTriggerUrl(instanceUrl, provider, String(trigger.configuration.path ?? "")) : null,
    settings = Object.entries(trigger.configuration).filter(([, value]) => value != null && value !== "");
  return (0, jsxTriggers.jsxs)("div", {
    className: "rounded-md border border-border bg-card",
    children: [(0, jsxTriggers.jsxs)("div", {
      className: "flex items-center gap-2 px-3 py-2",
      children: [(0, jsxTriggers.jsx)(ProviderIcon, {
        className: "h-4 w-4 shrink-0 text-muted-foreground"
      }), (0, jsxTriggers.jsxs)("button", {
        type: "button",
        onClick: () => setExpanded(wasExpanded => !wasExpanded),
        className: "min-w-0 flex-1 bg-transparent border-0 p-0 text-left cursor-pointer",
        title: expanded ? "Hide settings" : "Show settings",
        children: [(0, jsxTriggers.jsx)("span", {
          className: "block text-sm text-foreground truncate",
          children: trigger.summary
        }), summaryLine && (0, jsxTriggers.jsx)("span", {
          className: "block text-[11px] text-muted-foreground truncate",
          children: summaryLine
        })]
      }), trigger.pending && (0, jsxTriggers.jsx)("span", {
        className: "shrink-0 rounded px-1.5 py-0.5 text-[10px] border border-amber-500/60 text-amber-500",
        title: "Waiting for the instance. A trigger that looks live but has never fired is worse than one labelled as waiting.",
        children: trigger.pending === "create" ? "not saved yet" : trigger.pending === "delete" ? "delete queued" : "edit queued"
      }), !trigger.pending && trigger.status && trigger.status !== "active" && (0, jsxTriggers.jsx)("span", {
        className: "shrink-0 rounded px-1.5 py-0.5 text-[10px] bg-muted text-muted-foreground",
        children: trigger.status
      }), (0, jsxTriggers.jsx)("span", {
        className: "shrink-0 text-[11px] text-muted-foreground truncate max-w-[12rem]",
        children: trigger.actions.length > 0 ? trigger.actions.map(actionLabel).join(", ") : "runs nothing"
      }), (0, jsxTriggers.jsx)(Button, {
        variant: "ghost",
        size: "icon",
        className: "h-7 w-7 shrink-0",
        onClick: onEdit,
        title: "Edit this trigger",
        children: (0, jsxTriggers.jsx)(PencilIcon, {
          className: "h-3.5 w-3.5"
        })
      }), (0, jsxTriggers.jsx)(Button, {
        variant: "ghost",
        size: "icon",
        className: "h-7 w-7 shrink-0",
        onClick: () => onDelete(trigger),
        title: "Delete this trigger",
        children: (0, jsxTriggers.jsx)(Trash2Icon, {
          className: "h-3.5 w-3.5 text-destructive"
        })
      })]
    }), expanded && (0, jsxTriggers.jsx)("dl", {
      className: "grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 border-t border-border px-3 py-2 m-0",
      children: settings.map(([key, value]) => (0, jsxTriggers.jsxs)("div", {
        className: "contents",
        children: [(0, jsxTriggers.jsx)("dt", {
          className: "text-[11px] text-muted-foreground",
          children: paramLabel(key)
        }), (0, jsxTriggers.jsx)("dd", {
          className: "m-0 text-[11px] text-foreground font-mono break-all",
          children: String(value)
        })]
      }, key))
    })]
  });
}
// httpTriggerUrl (minified: Eb) — The full URL a webhook (http) trigger listens on: <instance>/api + the provider's path template (default /_path/{{path}}) with the trigger's path filled in; null without a path.
function httpTriggerUrl(instanceUrl, provider, path) {
  let trimmedPath = path.trim();
  if (trimmedPath === "") return null;
  let pathParam = provider?.params.find(param => param.key === "path"),
    template = pathParam?.description?.includes("{{path}}") ? pathParam.description : "/_path/{{path}}";
  return `${instanceUrl.replace(/\/+$/, "")}/api${template.replace("{{path}}", trimmedPath)}`;
}
// TriggerDialog (minified: fw) — New / edit trigger dialog: pick a provider, the actions to run and the provider's settings (cron presets, choices, secrets, booleans); shows the cron description or webhook URL. onSubmit(providerId, values, actionIds).
function TriggerDialog({
  catalog: catalog,
  instanceUrl: instanceUrl,
  saving: saving,
  error: error,
  actions: actions,
  editing: editing,
  onCancel: onCancel,
  onSubmit: onSubmit
}) {
  // valuesByProvider: Settings typed so far, kept per provider so switching back and forth keeps them; when editing, starts from the stored values except secrets.
  // values: The provider's defaults overlaid with what was typed.
  // visibleParams: Settings shown now: those without a showWhen condition, or whose condition holds.
  let [providerId, setProviderId] = (0, ReactTriggers.useState)(editing?.provider ?? catalog[0]?.id ?? ""),
    [actionIds, setActionIds] = (0, ReactTriggers.useState)(editing?.actions ?? []),
    [valuesByProvider, setValuesByProvider] = (0, ReactTriggers.useState)(() => {
      if (!editing) return {};
      let editingProvider = catalog.find(candidate => candidate.id === editing.provider),
        values = {};
      for (let param of editingProvider?.params ?? []) {
        let stored = editing.configuration[param.key];
        param.secret || stored === void 0 || stored === null || (values[param.key] = String(stored));
      }
      return {
        [editing.provider]: values
      };
    }),
    provider = catalog.find(candidate => candidate.id === providerId),
    values = (0, ReactTriggers.useMemo)(() => ({
      ...Object.fromEntries((provider?.params ?? []).map(param => [param.key, param.defaultValue])),
      ...(valuesByProvider[providerId] ?? {})
    }), [provider, valuesByProvider, providerId]),
    visibleParams = (0, ReactTriggers.useMemo)(() => (provider?.params ?? []).filter(param => !param.showWhen || values[param.showWhen.param] === param.showWhen.equals), [provider, values]),
    setValue = (key, value) => setValuesByProvider(current => ({
      ...current,
      [providerId]: {
        ...(current[providerId] ?? {}),
        [key]: value
      }
    })),
    httpUrl = provider?.id === "http" ? httpTriggerUrl(instanceUrl, provider, values.path ?? "") : null,
    cronSummary = provider?.id === "cron" ? describeCron(values.expression ?? "") : null;
  return (0, jsxTriggers.jsx)("div", {
    className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4",
    children: (0, jsxTriggers.jsxs)("div", {
      className: "flex flex-col w-full max-w-lg max-h-[85vh] rounded-lg border border-border bg-card shadow-lg",
      children: [(0, jsxTriggers.jsxs)("header", {
        className: "p-4 border-b border-border",
        children: [(0, jsxTriggers.jsx)("h2", {
          className: "m-0 text-base font-semibold text-foreground",
          children: editing ? "Edit trigger" : "New trigger"
        }), (0, jsxTriggers.jsx)("p", {
          className: "m-0 mt-0.5 text-xs text-muted-foreground",
          children: "What starts this workflow, and which of its actions it runs."
        })]
      }), (0, jsxTriggers.jsxs)("div", {
        className: "p-4 flex flex-col gap-4 overflow-y-auto",
        children: [(0, jsxTriggers.jsxs)("div", {
          className: "flex flex-col gap-1.5",
          children: [(0, jsxTriggers.jsx)(Label, {
            children: "Provider"
          }), (0, jsxTriggers.jsx)("div", {
            className: "grid grid-cols-3 gap-2",
            children: catalog.map(option => {
              let OptionIcon = triggerProviderIcons[option.id] ?? ZapIcon;
              return (0, jsxTriggers.jsxs)("button", {
                type: "button",
                onClick: () => setProviderId(option.id),
                title: option.description ?? option.name,
                className: `flex flex-col items-start gap-0.5 rounded-md border p-2 text-left cursor-pointer ${providerId === option.id ? "border-primary bg-input" : "border-border bg-card hover:opacity-80"}`,
                children: [(0, jsxTriggers.jsx)(OptionIcon, {
                  className: "h-4 w-4 text-muted-foreground"
                }), (0, jsxTriggers.jsx)("span", {
                  className: "text-xs text-foreground",
                  children: option.name
                }), (0, jsxTriggers.jsx)("span", {
                  className: "text-[10px] text-muted-foreground line-clamp-2",
                  children: option.description
                })]
              }, option.id);
            })
          })]
        }), (0, jsxTriggers.jsxs)("div", {
          className: "flex flex-col gap-1.5",
          children: [(0, jsxTriggers.jsx)(Label, {
            children: "Actions to run"
          }), actions.length === 0 ? (0, jsxTriggers.jsxs)("p", {
            className: "m-0 text-[11px] text-amber-500",
            children: ["This workflow has no workflow-level actions yet, so a trigger would have nothing to run. Add one on the ", (0, jsxTriggers.jsx)("strong", {
              children: "Actions"
            }), " tab \u2014 a stage's actions cannot be triggered, since they act on a record already in that stage."]
          }) : (0, jsxTriggers.jsx)("div", {
            className: "flex flex-col gap-1 rounded-md border border-border p-2",
            children: actions.map(action => (0, jsxTriggers.jsxs)("label", {
              className: "flex items-center gap-1.5 text-xs cursor-pointer",
              children: [(0, jsxTriggers.jsx)("input", {
                type: "checkbox",
                checked: actionIds.includes(action.id),
                onChange: changeEvent => setActionIds(current => changeEvent.target.checked ? [...current, action.id] : current.filter(id => id !== action.id))
              }), (0, jsxTriggers.jsx)("span", {
                className: "text-foreground",
                children: action.label
              }), (0, jsxTriggers.jsxs)("span", {
                className: "text-[10px] font-mono text-muted-foreground",
                children: [action.name, " \xB7 ", action.id]
              })]
            }, action.id))
          })]
        }), editing && providerId !== editing.provider && (0, jsxTriggers.jsxs)("p", {
          className: "m-0 rounded-md border border-amber-500/60 bg-amber-500/10 px-3 py-2 text-[11px] text-amber-500",
          children: ["Changing the provider replaces this trigger's settings with", " ", catalog.find(candidate => candidate.id === providerId)?.name ?? providerId, "'s. Anything stored for ", editing.providerName, " \u2014 including a saved password \u2014 is dropped, since it has no meaning for the new one."]
        }), provider?.id === "cron" && (0, jsxTriggers.jsx)("div", {
          className: "flex flex-wrap gap-1",
          children: cronPresets.map(preset => (0, jsxTriggers.jsx)("button", {
            type: "button",
            onClick: () => setValue("expression", preset.expression),
            className: `rounded-full border px-2 py-0.5 text-[11px] cursor-pointer ${values.expression === preset.expression ? "border-primary text-foreground bg-input" : "border-border text-muted-foreground hover:text-foreground"}`,
            children: preset.label
          }, preset.expression))
        }), visibleParams.map(param => (0, jsxTriggers.jsxs)("div", {
          className: "flex flex-col gap-1.5",
          children: [(0, jsxTriggers.jsxs)(Label, {
            htmlFor: `trigger-${param.key}`,
            children: [param.label, (0, jsxTriggers.jsx)("span", {
              className: "ml-1.5 text-[11px] font-normal font-mono text-muted-foreground",
              children: param.key
            }), param.secret && (0, jsxTriggers.jsx)(KeyRoundIcon, {
              className: "inline-block ml-1 h-3 w-3 text-muted-foreground"
            })]
          }), param.type === "boolean" ? (0, jsxTriggers.jsxs)("label", {
            className: "flex items-center gap-1.5 text-xs cursor-pointer",
            children: [(0, jsxTriggers.jsx)("input", {
              type: "checkbox",
              checked: values[param.key] === "true",
              onChange: changeEvent => setValue(param.key, changeEvent.target.checked ? "true" : "false")
            }), (0, jsxTriggers.jsx)("span", {
              className: "text-muted-foreground",
              children: values[param.key] === "true" ? "On" : "Off"
            })]
          }) : param.choices.length > 0 ? (0, jsxTriggers.jsx)("select", {
            id: `trigger-${param.key}`,
            value: values[param.key] ?? "",
            onChange: changeEvent => setValue(param.key, changeEvent.target.value),
            className: "h-8 rounded-md border border-border bg-input text-foreground px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring",
            children: param.choices.map(choice => (0, jsxTriggers.jsx)("option", {
              value: choice,
              children: choice
            }, choice))
          }) : (0, jsxTriggers.jsx)(Input, {
            id: `trigger-${param.key}`,
            type: param.secret ? "password" : param.type === "number" ? "number" : "text",
            value: values[param.key] ?? "",
            autoComplete: param.secret ? "new-password" : "off",
            spellCheck: !1,
            onChange: changeEvent => setValue(param.key, changeEvent.target.value)
          }), param.lookupResource && (0, jsxTriggers.jsxs)("p", {
            className: "m-0 text-[11px] text-muted-foreground",
            children: ["An id from ", (0, jsxTriggers.jsx)("code", {
              children: param.lookupResource
            }), " on the instance."]
          }), param.description && !param.description.includes("{{") && (0, jsxTriggers.jsx)("p", {
            className: "m-0 text-[11px] text-muted-foreground",
            children: param.description
          }), param.secret && (0, jsxTriggers.jsx)("p", {
            className: "m-0 text-[11px] text-muted-foreground",
            children: editing && editing.configuration[param.key] ? "One is already stored. Leave this blank to keep it." : "Stored on the instance and never read back here."
          }), param.key === "expression" && cronSummary && (0, jsxTriggers.jsx)("p", {
            className: "m-0 text-[11px] text-foreground",
            children: cronSummary
          }), param.key === "expression" && !cronSummary && (0, jsxTriggers.jsx)("p", {
            className: "m-0 text-[11px] text-muted-foreground",
            children: "Minute, hour, day of month, month, day of week. Saturn also accepts a leading seconds field."
          })]
        }, param.key)), httpUrl && (0, jsxTriggers.jsxs)("div", {
          className: "flex items-center gap-1.5 rounded-md border border-border bg-input px-2 py-1.5",
          children: [(0, jsxTriggers.jsx)("span", {
            className: "text-[11px] font-mono text-foreground break-all flex-1",
            children: httpUrl
          }), (0, jsxTriggers.jsx)("button", {
            type: "button",
            onClick: () => {
              navigator.clipboard?.writeText(httpUrl);
            },
            title: "Copy this URL",
            className: "shrink-0 bg-transparent border-0 p-0.5 cursor-pointer text-muted-foreground hover:text-foreground",
            children: (0, jsxTriggers.jsx)(CopyIcon, {
              className: "h-3 w-3"
            })
          })]
        }), error && (0, jsxTriggers.jsx)("div", {
          className: "rounded-md border border-destructive/50 p-3",
          children: (0, jsxTriggers.jsx)("p", {
            className: "m-0 text-xs text-destructive",
            children: error
          })
        })]
      }), (0, jsxTriggers.jsxs)("footer", {
        className: "flex items-center justify-end gap-2 p-4 border-t border-border",
        children: [(0, jsxTriggers.jsx)(Button, {
          variant: "ghost",
          onClick: onCancel,
          disabled: saving,
          children: "Cancel"
        }), (0, jsxTriggers.jsx)(Button, {
          onClick: () => onSubmit(providerId, values, actionIds),
          disabled: saving || actionIds.length === 0 || !provider,
          title: actionIds.length === 0 ? "Pick at least one action \u2014 a trigger with none does nothing" : "Save",
          children: saving ? "Saving\u2026" : editing ? "Save changes" : "Save trigger"
        })]
      })]
    })
  });
}
// ReactResourceHooks (minified: Iu) — React namespace for the resource hooks panel.
var ReactResourceHooks = V(Fe());
// jsxResourceHooks (minified: ie) — jsx runtime for the resource hooks panel.
// hookOperations: Resource operations a lifecycle hook can run before or after.
var jsxResourceHooks = V(Q()),
  hookOperations = ["create", "read", "get", "update", "delete", "list"];
// ResourceHooksPanel (minified: zb) — Resources tab: the resources this workflow is bound to or whose lifecycle hooks (before/after create, read, …) run its actions; lists the hooks and lets you add or remove them via onSetHook.
function ResourceHooksPanel({
  workflowId: workflowId,
  stages: stages,
  actions: actions,
  bindings: bindings,
  saved: saved,
  onSetHook: onSetHook
}) {
  // actionChoices: Every action a hook can run: workflow-level actions and each stage's actions.
  // visibleBindings: Resources to show: bound to this workflow, or with hook entries for it (entries without a workflow count when the resource is bound to it); null when resource details could not be read.
  let [adding, setAdding] = (0, ReactResourceHooks.useState)(null),
    actionChoices = (0, ReactResourceHooks.useMemo)(() => [...actions.map(action => ({
      id: action.id,
      label: action.label,
      from: "Actions"
    })), ...stages.flatMap(stage => stage.actions.map(action => ({
      id: action.id,
      label: action.label,
      from: stage.label
    })))], [actions, stages]),
    visibleBindings = (0, ReactResourceHooks.useMemo)(() => bindings ? bindings.map(binding => {
      let bound = binding.workflowId === workflowId,
        hooks = binding.hooks.map(hook => ({
          ...hook,
          entries: hook.entries.filter(entry => entry.workflowId === workflowId || entry.workflowId === null && bound)
        })).filter(hook => hook.entries.length > 0);
      return {
        binding: binding,
        bound: bound,
        hooks: hooks
      };
    }).filter(item => item.bound || item.hooks.length > 0).sort((item, other) => item.binding.resource.localeCompare(other.binding.resource)) : null, [bindings, workflowId]);
  if (visibleBindings === null) return (0, jsxResourceHooks.jsx)("p", {
    className: "m-0 text-xs text-muted-foreground",
    children: "Could not read this instance's resource details, so what this workflow is attached to is unknown. Offline, the answer is whatever was last read."
  });
  if (visibleBindings.length === 0) return (0, jsxResourceHooks.jsxs)("p", {
    className: "m-0 text-xs text-muted-foreground",
    children: ["No resource runs on this workflow. A resource is attached from its own settings \u2014 its", (0, jsxResourceHooks.jsx)("span", {
      className: "font-mono",
      children: " workflow "
    }), " and", (0, jsxResourceHooks.jsx)("span", {
      className: "font-mono",
      children: " bounded_property "
    }), "\u2014 and this panel shows it once that is done."]
  });
  let actionLabelFor = id => actionChoices.find(choice => choice.id === id)?.label ?? id;
  return (0, jsxResourceHooks.jsxs)("div", {
    className: "flex flex-col gap-3",
    children: [saved && (0, jsxResourceHooks.jsx)("p", {
      className: "m-0 text-xs text-primary",
      children: saved
    }), visibleBindings.map(({
      binding: binding,
      bound: bound,
      hooks: hooks
    }) => {
      // A resource with two ResourceDetail records is shown read-only.
      let readOnlyReason = binding.duplicate ? `${binding.resource} has two ResourceDetail records \u2014 hooks cannot be edited from here.` : null;
      return (0, jsxResourceHooks.jsxs)("div", {
        className: "rounded-md border border-border bg-card px-3 py-2",
        children: [(0, jsxResourceHooks.jsxs)("div", {
          className: "flex items-center gap-2 flex-wrap",
          children: [(0, jsxResourceHooks.jsx)(BoxesIcon, {
            className: "h-4 w-4 shrink-0 text-muted-foreground"
          }), (0, jsxResourceHooks.jsx)("span", {
            className: "text-sm text-foreground",
            children: binding.resource
          }), bound ? (0, jsxResourceHooks.jsxs)("span", {
            className: "flex items-center gap-1 rounded border border-primary/50 px-1.5 py-0.5 text-[10px] text-primary",
            children: [(0, jsxResourceHooks.jsx)(Link2Icon, {
              className: "h-3 w-3"
            }), binding.boundedProperty ? `bound on ${binding.boundedProperty}` : "bound, no driving field"]
          }) : (0, jsxResourceHooks.jsx)("span", {
            className: "rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground",
            children: "hooks only"
          }), binding.duplicate && (0, jsxResourceHooks.jsx)("span", {
            className: "rounded border border-amber-500/50 px-1.5 py-0.5 text-[10px] text-amber-500",
            children: "duplicate record"
          })]
        }), (0, jsxResourceHooks.jsxs)("div", {
          className: "mt-1.5 flex flex-col gap-1",
          children: [hooks.map(hook => (0, jsxResourceHooks.jsxs)("div", {
            className: "flex items-start gap-2",
            children: [(0, jsxResourceHooks.jsxs)("span", {
              className: "mt-0.5 w-28 shrink-0 font-mono text-[11px] text-muted-foreground",
              children: [hook.op, ".", hook.when]
            }), (0, jsxResourceHooks.jsx)("div", {
              className: "flex flex-wrap gap-1",
              children: hook.entries.map(entry => (0, jsxResourceHooks.jsxs)("span", {
                className: "flex items-center gap-1 rounded border border-border px-1.5 py-0.5 text-[11px] text-foreground",
                title: `Action ${entry.actionId}`,
                children: [(0, jsxResourceHooks.jsx)(CircleIcon, {
                  className: "h-2 w-2 fill-current"
                }), actionLabelFor(entry.actionId), !readOnlyReason && (0, jsxResourceHooks.jsx)("button", {
                  type: "button",
                  title: `Stop running this on ${hook.op}.${hook.when}`,
                  onClick: () => onSetHook({
                    resource: binding.resource,
                    actionId: entry.actionId,
                    op: hook.op,
                    when: hook.when,
                    remove: !0
                  }),
                  className: "bg-transparent border-0 p-0 cursor-pointer text-muted-foreground hover:text-destructive",
                  children: (0, jsxResourceHooks.jsx)(XIcon, {
                    className: "h-3 w-3"
                  })
                })]
              }, `${entry.actionId}-${entry.workflowId ?? ""}`))
            })]
          }, `${hook.op}.${hook.when}`)), hooks.length === 0 && (0, jsxResourceHooks.jsx)("p", {
            className: "m-0 text-[11px] text-muted-foreground",
            children: "No lifecycle hooks \u2014 its actions run from stage transitions only."
          })]
        }), readOnlyReason ? (0, jsxResourceHooks.jsx)("p", {
          className: "m-0 mt-1.5 text-[11px] text-amber-500",
          children: readOnlyReason
        }) : (0, jsxResourceHooks.jsx)("div", {
          className: "mt-1.5 flex flex-wrap items-center gap-1",
          children: hookOperations.map(y => ["before", "after"].map(N => (0, jsxResourceHooks.jsxs)("button", {
            type: "button",
            onClick: () => setAdding({
              resource: binding.resource,
              op: y,
              when: N
            }),
            title: `Run an action ${N} a ${y}`,
            className: "flex items-center gap-0.5 rounded border border-border bg-transparent px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground cursor-pointer hover:text-foreground",
            children: [(0, jsxResourceHooks.jsx)(PlusIcon, {
              className: "h-2.5 w-2.5"
            }), y, ".", N]
          }, `${y}.${N}`)))
        }), adding?.resource === binding.resource && (0, jsxResourceHooks.jsxs)("div", {
          className: "mt-1.5 rounded border border-border p-2",
          children: [(0, jsxResourceHooks.jsxs)("p", {
            className: "m-0 mb-1 text-[11px] text-muted-foreground",
            children: ["Run which action on", " ", (0, jsxResourceHooks.jsxs)("span", {
              className: "font-mono",
              children: [adding.op, ".", adding.when]
            }), "?"]
          }), (0, jsxResourceHooks.jsxs)("div", {
            className: "flex flex-wrap gap-1",
            children: [actionChoices.length === 0 && (0, jsxResourceHooks.jsx)("span", {
              className: "text-[11px] text-muted-foreground",
              children: "This workflow has no actions yet."
            }), actionChoices.map(y => (0, jsxResourceHooks.jsx)("button", {
              type: "button",
              onClick: () => {
                onSetHook({
                  resource: binding.resource,
                  actionId: y.id,
                  op: adding.op,
                  when: adding.when,
                  remove: !1
                }), setAdding(null);
              },
              title: `${y.from} \xB7 ${y.id}`,
              className: "rounded border border-border bg-transparent px-1.5 py-0.5 text-[11px] text-foreground cursor-pointer hover:opacity-80",
              children: y.label
            }, `${y.from}-${y.id}`))]
          }), (0, jsxResourceHooks.jsx)(Button, {
            variant: "ghost",
            size: "sm",
            className: "mt-1",
            onClick: () => setAdding(null),
            children: "Cancel"
          })]
        })]
      }, binding.resource);
    })]
  });
}
var ReactRename = V(Fe());
// jsxRename (minified: Oe) — jsx runtime; machineNameMeaning = what a node's machine name is used for, per kind (shown under the Machine name field)
var jsxRename = V(Q()),
  machineNameMeaning = {
    stage: "what a record's `status` holds",
    action: "how a trigger names this action",
    command: "how this command is referenced"
  };
// RenameNodeDialog (minified: Ub) — modal that renames a stage, action or command (display name, machine name, and a stage's colour);
// warns that changing the machine name can break references outside the workflow
function RenameNodeDialog({
  target: target,
  saving: saving,
  error: error,
  onCancel: onCancel,
  onSubmit: onSubmit
}) {
  let [label, setLabel] = (0, ReactRename.useState)(target.label),
    [machineName, setMachineName] = (0, ReactRename.useState)(target.machineName),
    [color, setColor] = (0, ReactRename.useState)(target.color ?? ""),
    isStage = target.kind === "stage",
    machineChanged = machineName.trim() !== target.machineName,
    machineValid = !machineChanged || machineName.trim().length > 0,
    canSubmit = label.trim().length > 0 && machineValid && !saving,
    submit = () => {
      if (!canSubmit) return;
      // The machine name is only sent when it was changed (and not blanked).
      let newMachineName = machineName.trim();
      onSubmit(label, machineChanged && newMachineName.length > 0 ? newMachineName : void 0, isStage ? color : void 0);
    },
    meaning = (0, ReactRename.useMemo)(() => machineNameMeaning[target.kind], [target.kind]);
  return (0, jsxRename.jsx)("div", {
    className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4",
    children: (0, jsxRename.jsxs)("div", {
      className: "flex flex-col w-full max-w-md rounded-lg border border-border bg-card shadow-lg",
      children: [(0, jsxRename.jsxs)("header", {
        className: "flex items-start justify-between gap-3 p-4 border-b border-border",
        children: [(0, jsxRename.jsxs)("div", {
          className: "min-w-0",
          children: [(0, jsxRename.jsxs)("h2", {
            className: "m-0 text-base font-semibold text-foreground",
            children: [isStage ? "Edit" : "Rename", " ", target.kind]
          }), (0, jsxRename.jsx)("p", {
            className: "m-0 mt-0.5 text-xs text-muted-foreground truncate",
            children: target.label
          })]
        }), (0, jsxRename.jsx)(Button, {
          variant: "ghost",
          size: "icon",
          onClick: onCancel,
          title: "Cancel",
          children: (0, jsxRename.jsx)(XIcon, {
            className: "h-4 w-4"
          })
        })]
      }), (0, jsxRename.jsxs)("div", {
        className: "p-4 flex flex-col gap-4",
        children: [(0, jsxRename.jsxs)("div", {
          className: "flex flex-col gap-1.5",
          children: [(0, jsxRename.jsx)(Label, {
            htmlFor: "rename-label",
            children: "Name"
          }), (0, jsxRename.jsx)(Input, {
            id: "rename-label",
            autoFocus: !0,
            value: label,
            onChange: evt => setLabel(evt.target.value),
            onKeyDown: evt => {
              evt.key === "Enter" && submit();
            }
          }), (0, jsxRename.jsx)("p", {
            className: "m-0 text-[11px] text-muted-foreground",
            children: "The display name. Safe to change."
          })]
        }), (0, jsxRename.jsxs)("div", {
          className: "flex flex-col gap-1.5",
          children: [(0, jsxRename.jsx)(Label, {
            htmlFor: "rename-machine",
            children: "Machine name"
          }), (0, jsxRename.jsx)(Input, {
            id: "rename-machine",
            value: machineName,
            onChange: evt => setMachineName(evt.target.value),
            spellCheck: !1,
            className: "font-mono"
          }), machineChanged ? (0, jsxRename.jsxs)("p", {
            className: "m-0 text-[11px] text-destructive",
            children: ["This is ", meaning, ". Changing it can break things outside this workflow, which this editor cannot see or fix."]
          }) : (0, jsxRename.jsxs)("p", {
            className: "m-0 text-[11px] text-muted-foreground",
            children: ["This is ", meaning, ". Left as it is unless you change it here."]
          })]
        }), isStage && (0, jsxRename.jsx)(ColourPicker, {
          value: color,
          onChange: setColor,
          label: "Colour"
        }), error && (0, jsxRename.jsx)("p", {
          className: "m-0 text-xs text-destructive",
          children: error
        })]
      }), (0, jsxRename.jsxs)("footer", {
        className: "flex items-center justify-end gap-2 p-4 border-t border-border",
        children: [(0, jsxRename.jsx)(Button, {
          variant: "ghost",
          onClick: onCancel,
          disabled: saving,
          children: "Cancel"
        }), (0, jsxRename.jsx)(Button, {
          onClick: submit,
          disabled: !canSubmit,
          children: saving ? "Saving\u2026" : isStage ? "Save" : "Rename"
        })]
      })]
    })
  });
}
// jsxEditor (minified: I) — jsx runtime; editorTabs = the tabs of the workflow editor screen
var jsxEditor = V(Q()),
  editorTabs = [{
    id: "workflow",
    label: "Workflow"
  }, {
    id: "actions",
    label: "Actions"
  }, {
    id: "commands",
    label: "Commands"
  }, {
    id: "triggers",
    label: "Triggers"
  }, {
    id: "resources",
    label: "Resources"
  }];
// EditorTabBar (minified: hw) — tab strip of the workflow editor; shows each tab's count (null = no count)
function EditorTabBar({
  tab: tab,
  onChange: onChange,
  counts: counts
}) {
  return (0, jsxEditor.jsx)("div", {
    className: "flex items-center gap-6 border-b border-border mb-4",
    children: editorTabs.map(({
      id: tabId,
      label: tabLabel
    }) => {
      let count = counts[tabId];
      return (0, jsxEditor.jsx)("button", {
        type: "button",
        onClick: () => onChange(tabId),
        className: cn("bg-transparent border-none border-b-2 pb-2 px-0.5 text-sm cursor-pointer", tab === tabId ? "border-b-primary text-primary font-medium" : "border-b-transparent text-muted-foreground hover:text-foreground"),
        children: count === null ? tabLabel : `${tabLabel} (${count})`
      }, tabId);
    })
  });
}
// CommandDetails (minified: xw) — details of a reusable command: its flow, its parameters (add / edit / remove)
// and where it is used (click to jump there); with rename / delete in its menu
function CommandDetails({
  command: command,
  commandIndex: commandIndex,
  onAddParameter: onAddParameter,
  onEditParameter: onEditParameter,
  onDeleteParameter: onDeleteParameter,
  onGoToUsage: onGoToUsage,
  onRenameCommand: onRenameCommand,
  onDeleteCommand: onDeleteCommand
}) {
  let [section, setSection] = (0, ReactForApp.useState)("command");
  return command ? (0, jsxEditor.jsxs)("div", {
    className: cn("flex flex-col gap-3 min-w-0", section === "command" && "flex-1 min-h-0"),
    children: [(0, jsxEditor.jsxs)("div", {
      className: "flex items-center justify-between gap-2",
      children: [(0, jsxEditor.jsx)("h3", {
        className: "m-0 text-lg font-semibold text-foreground truncate",
        children: command.label
      }), (0, jsxEditor.jsx)(RenameDeleteButtons, {
        kind: "command",
        label: command.label,
        onRename: () => onRenameCommand(command),
        onDelete: () => onDeleteCommand(command)
      })]
    }), (0, jsxEditor.jsx)("div", {
      className: "flex items-center gap-4 border-b border-border",
      children: [["command", "Command"], ["parameters", command.parameters.length > 0 ? `Parameters (${command.parameters.length})` : "Parameters"], ["usedIn", `Used In (${command.usageCount})`]].map(([sectionId, sectionLabel]) => (0, jsxEditor.jsx)("button", {
        type: "button",
        onClick: () => setSection(sectionId),
        className: cn("bg-transparent border-none border-b-2 pb-1.5 px-0.5 text-sm cursor-pointer", section === sectionId ? "border-b-primary text-primary font-medium" : "border-b-transparent text-muted-foreground hover:text-foreground"),
        children: sectionLabel
      }, sectionId))
    }), section === "command" && (command.flow ? (0, jsxEditor.jsx)(ZoomableFlow, {
      node: command.flow
    }) : (0, jsxEditor.jsx)(EmptyNote, {
      children: "This command has no flow."
    })), section === "parameters" && (0, jsxEditor.jsxs)("div", {
      className: "flex flex-col gap-4",
      children: [command.parameters.length === 0 ? (0, jsxEditor.jsx)(EmptyNote, {
        children: "This command takes no parameters."
      }) : (0, jsxEditor.jsx)("div", {
        className: "flex flex-col gap-4",
        children: command.parameters.map(parameter => (0, jsxEditor.jsxs)("div", {
          className: "flex flex-col gap-1.5",
          children: [(0, jsxEditor.jsxs)("span", {
            className: "text-sm text-foreground",
            children: [(0, jsxEditor.jsx)("span", {
              className: "font-medium",
              children: parameter.label
            }), (0, jsxEditor.jsxs)("span", {
              className: "text-muted-foreground font-mono",
              children: [" - ", parameter.key]
            }), parameter.required && (0, jsxEditor.jsx)("span", {
              className: "text-destructive ml-1",
              children: "*"
            })]
          }), (0, jsxEditor.jsxs)("div", {
            className: "flex items-center justify-between gap-2 rounded-md border border-border bg-input px-3 py-2",
            children: [(0, jsxEditor.jsx)("span", {
              className: "text-sm text-muted-foreground truncate",
              children: parameter.label
            }), (0, jsxEditor.jsxs)("span", {
              className: "flex items-center gap-2 shrink-0",
              children: [(0, jsxEditor.jsx)("span", {
                className: "text-[11px] font-mono text-muted-foreground",
                children: [parameter.type, parameter.inputType].filter(Boolean).join(" \xB7 ")
              }), (0, jsxEditor.jsx)(Button, {
                variant: "ghost",
                size: "icon",
                className: "h-6 w-6",
                title: `Edit ${parameter.label}`,
                onClick: () => onEditParameter(parameter),
                children: (0, jsxEditor.jsx)(PencilIcon, {
                  className: "h-3.5 w-3.5"
                })
              }), (0, jsxEditor.jsx)(Button, {
                variant: "ghost",
                size: "icon",
                className: "h-6 w-6",
                title: `Remove ${parameter.label}`,
                onClick: () => onDeleteParameter(parameter.key),
                children: (0, jsxEditor.jsx)(Trash2Icon, {
                  className: "h-3.5 w-3.5"
                })
              })]
            })]
          })]
        }, parameter.key))
      }), (0, jsxEditor.jsxs)(Button, {
        variant: "secondary",
        onClick: onAddParameter,
        className: "justify-center gap-2",
        children: [(0, jsxEditor.jsx)(PlusIcon, {
          className: "h-4 w-4"
        }), "Add Field"]
      })]
    }), section === "usedIn" && (command.usages.length === 0 ? (0, jsxEditor.jsx)(EmptyNote, {
      children: "Nothing references this command."
    }) : (0, jsxEditor.jsxs)("div", {
      className: "flex flex-col gap-2",
      children: [(0, jsxEditor.jsx)("p", {
        className: "m-0 text-xs text-muted-foreground",
        children: "Click any usage to open where it is used."
      }), command.usages.map((usage, usageIndex) => (0, jsxEditor.jsxs)("button", {
        type: "button",
        onClick: () => onGoToUsage(usage),
        className: "text-left rounded-md border border-border bg-card px-3 py-2 cursor-pointer hover:opacity-80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        children: [(0, jsxEditor.jsx)("span", {
          className: "block text-sm text-foreground",
          children: usage.label
        }), (0, jsxEditor.jsxs)("span", {
          className: "block text-xs font-mono text-muted-foreground mt-0.5",
          children: ["Path: ", usage.pathLabel]
        })]
      }, `${usage.path.join(".")}-${usageIndex}`))]
    }))]
  }) : (0, jsxEditor.jsx)(EmptyNote, {
    children: "No command selected"
  });
}
// WorkflowEditor (minified: qb) — the screen for one open workflow: header (Save / Discard the draft, undo, files, delete, raw JSON,
// open in Sonover, reload), tabs for stages + actions, global actions, commands, triggers and resource hooks,
// and the dialogs (operator, add field / stage / action / command, rename, access rules). All edits go up via the on* props.
function WorkflowEditor({
  summary: summary,
  workflow: workflow,
  operators: operators,
  loading: loading,
  error: error,
  saving: saving,
  paramErrors: paramErrors,
  canUndo: canUndo,
  saveSignal: saveSignal,
  failSignal: failSignal,
  resourceNames: resourceNames,
  editorValues: editorValues,
  onBack: onBack,
  onRefresh: onRefresh,
  onViewRaw: onViewRaw,
  onOpenExternal: onOpenExternal,
  onAddOperator: onAddOperator,
  onUpdateOperator: onUpdateOperator,
  onMoveOperator: onMoveOperator,
  onDeleteOperator: onDeleteOperator,
  onCopyOperator: onCopyOperator,
  onCopyContents: onCopyContents,
  onSetAccess: onSetAccess,
  onListAccessSubjects: onListAccessSubjects,
  onOpenAccessFunction: onOpenAccessFunction,
  accessSubjects: accessSubjects,
  onPasteOperator: onPasteOperator,
  onDuplicateOperator: onDuplicateOperator,
  clipboard: clipboard,
  onCreate: onCreate,
  onDeleteField: onDeleteField,
  banner: banner,
  tag: tag,
  onRevealFiles: onRevealFiles,
  onDeleteWorkflow: onDeleteWorkflow,
  lookupOptions: lookupOptions,
  onNeedLookup: onNeedLookup,
  onMoveStage: onMoveStage,
  onMoveAction: onMoveAction,
  draft: draft,
  onSaveChanges: onSaveChanges,
  onDiscardChanges: onDiscardChanges,
  triggers: triggers,
  triggersOffline: triggersOffline,
  onRefreshTriggers: onRefreshTriggers,
  onCreateTrigger: onCreateTrigger,
  onUpdateTrigger: onUpdateTrigger,
  onDeleteTrigger: onDeleteTrigger,
  bindings: bindings,
  hookSaved: hookSaved,
  onSetHook: onSetHook,
  onRenameNode: onRenameNode,
  onDeleteNode: onDeleteNode,
  onOpenCode: onOpenCode,
  onReadNode: onReadNode,
  onEditHtmlParam: onEditHtmlParam,
  onOpenWorkflowInInstance: onOpenWorkflowInInstance,
  nodeParams: nodeParams,
  onEditParamInEditor: onEditParamInEditor,
  onUndo: onUndo,
  onDialogClosed: onDialogClosed
}) {
  let [operatorDialog, setOperatorDialog] = (0, ReactForApp.useState)(null),
    [fieldDialog, setFieldDialog] = (0, ReactForApp.useState)(null),
    [renameTarget, setRenameTarget] = (0, ReactForApp.useState)(null),
    [accessTarget, setAccessTarget] = (0, ReactForApp.useState)(null),
    awaitingSaveRef = (0, ReactForApp.useRef)(!1),
    openAddOperator = (0, ReactForApp.useCallback)((childrenPath, where) => {
      setOperatorDialog({
        childrenPath: childrenPath,
        where: where,
        index: null,
        mode: "add"
      });
    }, []),
    openEditOperator = (0, ReactForApp.useCallback)((stepPath, operator) => {
      // Opens the operator dialog on an existing step and asks the host for its stored parameters (readNode).
      setOperatorDialog({
        childrenPath: stepPath,
        where: "this step",
        index: null,
        mode: "edit",
        operator: operator
      }), onReadNode(stepPath);
    }, [onReadNode]),
    openFieldDialog = (0, ReactForApp.useCallback)((ownerPath, formKey, where, editing) => {
      setFieldDialog({
        kind: "parameter",
        ownerPath: ownerPath,
        formKey: formKey,
        where: where,
        editing: editing
      });
    }, []),
    goToUsage = (0, ReactForApp.useCallback)(usage => {
      // Jumps to where a command is used: switches tab and selects the stage / action / command.
      setTab(usage.target.tab), usage.target.tab === "workflow" ? (usage.target.stage && setSelectedStageName(usage.target.stage), usage.target.actionId && setSelectedStageActionId(usage.target.actionId)) : usage.target.tab === "actions" ? usage.target.actionId && setSelectedGlobalActionId(usage.target.actionId) : usage.target.commandId && setSelectedCommandId(usage.target.commandId);
    }, []),
    stagePath = (0, ReactForApp.useCallback)(stageName => ["stages", (workflow?.stages ?? []).findIndex(candidate => candidate.stage === stageName)], [workflow]),
    actionPath = (0, ReactForApp.useCallback)(actionId => {
      // Path of an action by id: a global action, else an action inside a stage.
      if (!workflow) return null;
      let globalIndex = workflow.actions.findIndex(candidate => candidate.id === actionId);
      if (globalIndex !== -1) return ["actions", globalIndex];
      for (let stageIndex = 0; stageIndex < workflow.stages.length; stageIndex++) {
        let actionIndex = workflow.stages[stageIndex].actions.findIndex(candidate => candidate.id === actionId);
        if (actionIndex !== -1) return ["stages", stageIndex, "actions", actionIndex];
      }
      return null;
    }, [workflow]),
    commandPath = (0, ReactForApp.useCallback)(commandId => ["commands", (workflow?.commands ?? []).findIndex(candidate => candidate.id === commandId)], [workflow]),
    closeOperatorDialog = (0, ReactForApp.useCallback)(() => {
      awaitingSaveRef.current = !1, setOperatorDialog(null), onDialogClosed();
    }, [onDialogClosed]),
    [tab, setTab] = (0, ReactForApp.useState)("workflow"),
    [selectedStageName, setSelectedStageName] = (0, ReactForApp.useState)(null),
    [selectedStageActionId, setSelectedStageActionId] = (0, ReactForApp.useState)(null),
    [selectedGlobalActionId, setSelectedGlobalActionId] = (0, ReactForApp.useState)(null),
    [selectedCommandId, setSelectedCommandId] = (0, ReactForApp.useState)(null);
  // awaitingSaveRef is set when a dialog submits: a successful save (no parameter errors) then closes the dialogs; a failed one clears it.
  // Opening another workflow clears the selections.
  (0, ReactForApp.useEffect)(() => {
    awaitingSaveRef.current = !1;
  }, [failSignal]), (0, ReactForApp.useEffect)(() => {
    saveSignal === 0 || !awaitingSaveRef.current || paramErrors.length > 0 || (awaitingSaveRef.current = !1, setOperatorDialog(null), setFieldDialog(null), onDialogClosed());
  }, [saveSignal]), (0, ReactForApp.useEffect)(() => {
    setSelectedStageName(null), setSelectedStageActionId(null), setSelectedGlobalActionId(null), setSelectedCommandId(null);
  }, [workflow?.id]);
  let selectedStage = (0, ReactForApp.useMemo)(() => workflow?.stages.find(stage => stage.stage === selectedStageName) ?? null, [workflow, selectedStageName]),
    selectedStageAction = (0, ReactForApp.useMemo)(() => selectedStage?.actions.find(action => action.id === selectedStageActionId) ?? null, [selectedStage, selectedStageActionId]),
    selectedGlobalAction = (0, ReactForApp.useMemo)(() => workflow?.actions.find(action => action.id === selectedGlobalActionId) ?? null, [workflow, selectedGlobalActionId]),
    selectedCommand = (0, ReactForApp.useMemo)(() => workflow?.commands.find(command => command.id === selectedCommandId) ?? null, [workflow, selectedCommandId]),
    contextName = (0, ReactForApp.useMemo)(() => {
      // A name for what is selected (e.g. "stage-action"), passed to the host to title opened editors.
      if (tab === "commands") return selectedCommand?.name || selectedCommand?.label || "commands";
      if (tab === "actions") return selectedGlobalAction?.action || selectedGlobalAction?.label || "actions";
      let stageLabel = selectedStage?.stage || selectedStage?.label,
        actionLabel = selectedStageAction?.action || selectedStageAction?.label;
      return [stageLabel, actionLabel].filter(Boolean).join("-") || "workflow";
    }, [tab, selectedCommand, selectedGlobalAction, selectedStage, selectedStageAction]),
    flowHandlers = (0, ReactForApp.useMemo)(() => workflow ? {
      // Handlers the flow tree (Di) reads from the Ba context.
      onAdd: openAddOperator,
      onEdit: openEditOperator,
      onMove: onMoveOperator,
      onDelete: onDeleteOperator,
      onCopy: onCopyOperator,
      onCopyContents: onCopyContents,
      onPaste: onPasteOperator,
      onDuplicate: onDuplicateOperator,
      clipboard: clipboard,
      onOpenCode: (codePath, codeOperator, codeParams) => onOpenCode(codePath, codeOperator, codeParams, contextName)
    } : null, [workflow, openAddOperator, openEditOperator, onMoveOperator, onDeleteOperator, onCopyOperator, onCopyContents, onPasteOperator, onDuplicateOperator, clipboard, onOpenCode, contextName]),
    tabCounts = {
      workflow: null,
      actions: workflow ? workflow.actions.length : null,
      commands: workflow ? workflow.commands.length : null,
      triggers: triggers.loading && triggers.rows.length === 0 ? null : triggers.rows.length,
      // resources that belong to this workflow or have a hook running one of its actions
      resources: bindings === null ? null : bindings.filter(binding => binding.workflowId === workflow?.id || binding.hooks.some(hook => hook.entries.some(entry => entry.workflowId === workflow?.id))).length
    };
  return (0, jsxEditor.jsx)(OperatorCatalogContext.Provider, {
    value: operators,
    children: (0, jsxEditor.jsx)(FlowEditContext.Provider, {
      value: flowHandlers,
      children: (0, jsxEditor.jsxs)("div", {
        className: "flex flex-col h-screen p-4 min-w-0",
        children: [banner && (0, jsxEditor.jsx)("div", {
          className: "mb-3 shrink-0",
          children: banner
        }), (0, jsxEditor.jsxs)("header", {
          className: "flex flex-wrap items-start justify-between gap-4 mb-4",
          children: [(0, jsxEditor.jsxs)("div", {
            className: "flex items-center gap-3 min-w-0",
            children: [(0, jsxEditor.jsx)(Button, {
              variant: "ghost",
              size: "icon",
              onClick: onBack,
              title: "Back to workflows",
              children: (0, jsxEditor.jsx)(ArrowLeftIcon, {
                className: "h-4 w-4"
              })
            }), (0, jsxEditor.jsxs)("div", {
              className: "min-w-0",
              children: [(0, jsxEditor.jsxs)("h1", {
                className: "m-0 flex items-center gap-2 text-xl font-semibold text-foreground",
                children: [(0, jsxEditor.jsx)("span", {
                  className: "truncate",
                  children: workflow?.name ?? summary.name
                }), tag]
              }), (0, jsxEditor.jsx)("p", {
                className: "m-0 text-xs font-mono text-muted-foreground truncate",
                children: summary.id
              })]
            })]
          }), (0, jsxEditor.jsxs)("div", {
            className: "flex items-center gap-2",
            children: [draft.pending > 0 && (0, jsxEditor.jsxs)(jsxEditor.Fragment, {
              children: [(0, jsxEditor.jsxs)(Button, {
                onClick: onSaveChanges,
                disabled: saving,
                title: `Send ${draft.pending} change${draft.pending === 1 ? "" : "s"} in one request:
${draft.summaries.join(`
`)}`,
                className: "gap-1.5",
                children: [(0, jsxEditor.jsx)(SaveIcon, {
                  className: "h-4 w-4"
                }), saving ? "Saving\u2026" : `Save ${draft.pending} change${draft.pending === 1 ? "" : "s"}`]
              }), (0, jsxEditor.jsx)(Button, {
                variant: "ghost",
                size: "icon",
                onClick: onDiscardChanges,
                disabled: saving,
                title: "Discard the pending changes and reload from the instance",
                children: (0, jsxEditor.jsx)(RotateCcwIcon, {
                  className: "h-4 w-4"
                })
              })]
            }), workflow?.start && (0, jsxEditor.jsxs)("span", {
              className: "text-[11px] rounded px-2 py-1 bg-muted text-muted-foreground",
              children: ["starts at ", workflow.start]
            }), (canUndo || draft.pending > 0) && (0, jsxEditor.jsx)(Button, {
              variant: "ghost",
              size: "icon",
              onClick: onUndo,
              title: draft.pending > 0 ? "Take the last pending change back off the batch" : "Undo the last change saved from this panel",
              children: (0, jsxEditor.jsx)(Undo2Icon, {
                className: "h-4 w-4"
              })
            }), (0, jsxEditor.jsx)(Button, {
              variant: "ghost",
              size: "icon",
              onClick: onRevealFiles,
              title: "Show this instance's files in your file browser",
              children: (0, jsxEditor.jsx)(FolderOpenIcon, {
                className: "h-4 w-4"
              })
            }), (0, jsxEditor.jsx)(Button, {
              variant: "ghost",
              size: "icon",
              onClick: onDeleteWorkflow,
              title: "Delete this workflow \u2014 dangerous, and cannot be undone",
              className: "text-destructive hover:text-destructive",
              children: (0, jsxEditor.jsx)(Trash2Icon, {
                className: "h-4 w-4"
              })
            }), (0, jsxEditor.jsx)(Button, {
              variant: "ghost",
              size: "icon",
              onClick: onViewRaw,
              title: "Open raw JSON",
              children: (0, jsxEditor.jsx)(FileBracesIcon, {
                className: "h-4 w-4"
              })
            }), (0, jsxEditor.jsx)(Button, {
              variant: "ghost",
              size: "icon",
              onClick: onOpenExternal,
              title: "Open in Sonover",
              children: (0, jsxEditor.jsx)(ExternalLinkIcon, {
                className: "h-4 w-4"
              })
            }), (0, jsxEditor.jsx)(ReloadButton, {
              loading: loading,
              onClick: onRefresh,
              title: "Reload this workflow"
            })]
          })]
        }), (0, jsxEditor.jsx)(LoadingBar, {
          loading: loading && !!workflow
        }), (0, jsxEditor.jsx)(EditorTabBar, {
          tab: tab,
          onChange: setTab,
          counts: tabCounts
        }), error && (0, jsxEditor.jsx)("p", {
          className: "text-sm text-destructive m-0 mb-3",
          children: error
        }), workflow ? tab === "workflow" ? (0, jsxEditor.jsxs)("div", {
          // Workflow tab: stages | the selected stage's actions | the selected action's details.
          className: "grid gap-6 grid-cols-[minmax(180px,1fr)_minmax(180px,1fr)_minmax(240px,2fr)] flex-1 min-h-0",
          children: [(0, jsxEditor.jsx)(EditorColumn, {
            title: "Stages",
            action: (0, jsxEditor.jsx)(AddButton, {
              label: "Stage",
              onClick: () => setFieldDialog({
                kind: "stage",
                where: workflow.name
              })
            }),
            children: workflow.stages.length === 0 ? (0, jsxEditor.jsx)(EmptyNote, {
              children: "This workflow has no stages."
            }) : workflow.stages.map((stage, stageIndex) => (0, jsxEditor.jsx)(ListItem, {
              label: stage.label,
              sub: stage.stage,
              badge: String(stage.actions.length),
              accent: stage.color,
              selected: stage.stage === selectedStageName,
              index: stageIndex,
              onMove: onMoveStage,
              onClick: () => {
                setSelectedStageName(stage.stage), setSelectedStageActionId(null);
              }
            }, stage.stage))
          }), (0, jsxEditor.jsxs)(EditorColumn, {
            title: "Actions",
            action: selectedStage ? (0, jsxEditor.jsx)(AddButton, {
              label: "Action",
              onClick: () => setFieldDialog({
                kind: "action",
                stageIndex: workflow.stages.indexOf(selectedStage),
                where: selectedStage.label
              })
            }) : void 0,
            children: [selectedStage && (0, jsxEditor.jsxs)("div", {
              className: "flex items-center justify-between gap-2 pb-1",
              children: [(0, jsxEditor.jsx)("span", {
                className: "text-sm font-medium text-foreground truncate",
                children: selectedStage.label
              }), (0, jsxEditor.jsx)(RenameDeleteButtons, {
                kind: "stage",
                label: selectedStage.label,
                onRename: () => setRenameTarget({
                  kind: "stage",
                  path: stagePath(selectedStage.stage),
                  label: selectedStage.label,
                  machineName: selectedStage.stage,
                  color: selectedStage.color
                }),
                onDelete: () => onDeleteNode("stage", stagePath(selectedStage.stage))
              })]
            }), selectedStage ? selectedStage.actions.length === 0 ? (0, jsxEditor.jsx)(EmptyNote, {
              children: "This stage has no actions."
            }) : selectedStage.actions.map((action, actionIndex) => (0, jsxEditor.jsx)(ListItem, {
              label: action.label,
              sub: action.action,
              selected: action.id === selectedStageActionId,
              index: actionIndex,
              onMove: (fromIndex, toIndex) => onMoveAction(workflow.stages.indexOf(selectedStage), fromIndex, toIndex),
              onClick: () => setSelectedStageActionId(action.id)
            }, action.id)) : (0, jsxEditor.jsx)(EmptyNote, {
              children: "Please select a stage"
            })]
          }), (0, jsxEditor.jsx)(EditorColumn, {
            title: "Action Details",
            children: (0, jsxEditor.jsx)(ActionDetails, {
              action: selectedStageAction,
              onAddField: action => openFieldDialog(action.taskPath.slice(0, -1), "form", action.label),
              onEditField: (action, field) => openFieldDialog(action.taskPath.slice(0, -1), "form", action.label, {
                key: field.key,
                label: field.label,
                type: field.type ?? "string",
                required: field.required
              }),
              onDeleteField: (action, fieldKey) => onDeleteField(action.taskPath.slice(0, -1), "form", fieldKey),
              onRename: action => {
                let path = actionPath(action.id);
                path && setRenameTarget({
                  kind: "action",
                  path: path,
                  label: action.label,
                  machineName: action.action
                });
              },
              onDelete: action => {
                let path = actionPath(action.id);
                path && onDeleteNode("action", path);
              },
              onConfigureAccess: action => {
                let path = actionPath(action.id);
                path && (onListAccessSubjects(), setAccessTarget({
                  path: path,
                  action: action
                }));
              }
            })
          })]
        }) : tab === "actions" ? (0, jsxEditor.jsxs)("div", {
          // Actions tab: global actions (not tied to a stage) and their details.
          className: "grid gap-6 grid-cols-[minmax(200px,1fr)_minmax(280px,2fr)] flex-1 min-h-0",
          children: [(0, jsxEditor.jsx)(EditorColumn, {
            title: "Actions",
            action: (0, jsxEditor.jsx)(AddButton, {
              label: "Action",
              onClick: () => setFieldDialog({
                kind: "action",
                where: workflow.name
              })
            }),
            children: workflow.actions.length === 0 ? (0, jsxEditor.jsx)(EmptyNote, {
              children: "This workflow has no global actions."
            }) : workflow.actions.map((action, actionIndex) => (0, jsxEditor.jsx)(ListItem, {
              label: action.label,
              sub: action.id && action.id !== action.action ? `${action.action} - ${action.id}` : action.action,
              selected: action.id === selectedGlobalActionId,
              index: actionIndex,
              onMove: (fromIndex, toIndex) => onMoveAction(null, fromIndex, toIndex),
              onClick: () => setSelectedGlobalActionId(action.id)
            }, action.id))
          }), (0, jsxEditor.jsx)(EditorColumn, {
            title: "Action Details",
            children: (0, jsxEditor.jsx)(ActionDetails, {
              action: selectedGlobalAction,
              onAddField: action => openFieldDialog(action.taskPath.slice(0, -1), "form", action.label),
              onEditField: (action, field) => openFieldDialog(action.taskPath.slice(0, -1), "form", action.label, {
                key: field.key,
                label: field.label,
                type: field.type ?? "string",
                required: field.required
              }),
              onDeleteField: (action, fieldKey) => onDeleteField(action.taskPath.slice(0, -1), "form", fieldKey),
              onRename: action => {
                let path = actionPath(action.id);
                path && setRenameTarget({
                  kind: "action",
                  path: path,
                  label: action.label,
                  machineName: action.action
                });
              },
              onDelete: action => {
                let path = actionPath(action.id);
                path && onDeleteNode("action", path);
              },
              onConfigureAccess: action => {
                let path = actionPath(action.id);
                path && (onListAccessSubjects(), setAccessTarget({
                  path: path,
                  action: action
                }));
              }
            })
          })]
        }) : tab === "commands" ? (0, jsxEditor.jsxs)("div", {
          // Commands tab: reusable commands and their details.
          className: "grid gap-6 grid-cols-[minmax(200px,1fr)_minmax(280px,2fr)] flex-1 min-h-0",
          children: [(0, jsxEditor.jsx)(EditorColumn, {
            title: "Commands",
            action: (0, jsxEditor.jsx)(AddButton, {
              label: "Command",
              onClick: () => setFieldDialog({
                kind: "command",
                where: workflow.name
              })
            }),
            children: workflow.commands.length === 0 ? (0, jsxEditor.jsx)(EmptyNote, {
              children: "This workflow has no reusable commands."
            }) : workflow.commands.map(command => (0, jsxEditor.jsx)(ListItem, {
              label: command.label,
              sub: `${command.name} - ${command.id}`,
              badge: `${command.usageCount} usage`,
              selected: command.id === selectedCommandId,
              onClick: () => setSelectedCommandId(command.id)
            }, command.id))
          }), (0, jsxEditor.jsx)(EditorColumn, {
            title: "Command Details",
            children: (0, jsxEditor.jsx)(CommandDetails, {
              command: selectedCommand,
              commandIndex: selectedCommand ? workflow.commands.indexOf(selectedCommand) : -1,
              onAddParameter: () => openFieldDialog(["commands", workflow.commands.indexOf(selectedCommand)], "parameters", selectedCommand?.label ?? "this command"),
              onEditParameter: parameter => openFieldDialog(["commands", workflow.commands.indexOf(selectedCommand)], "parameters", selectedCommand?.label ?? "this command", {
                key: parameter.key,
                label: parameter.label,
                type: parameter.type ?? "string",
                required: parameter.required
              }),
              onDeleteParameter: paramKey => onDeleteField(["commands", workflow.commands.indexOf(selectedCommand)], "parameters", paramKey),
              onGoToUsage: goToUsage,
              onRenameCommand: command => setRenameTarget({
                kind: "command",
                path: commandPath(command.id),
                label: command.label,
                machineName: command.name
              }),
              onDeleteCommand: command => onDeleteNode("command", commandPath(command.id))
            })
          })]
        }) : tab === "resources" ? (0, jsxEditor.jsx)("div", {
          // Resources tab: lifecycle hooks (resourceDetails) that run this workflow's actions.
          className: "flex flex-col flex-1 min-h-0 overflow-y-auto pr-1",
          children: (0, jsxEditor.jsx)(ResourceHooksPanel, {
            workflowId: workflow.id,
            stages: workflow.stages,
            actions: workflow.actions,
            bindings: bindings,
            saved: hookSaved,
            onSetHook: onSetHook
          })
        }) : (0, jsxEditor.jsx)("div", {
          // Triggers tab.
          className: "flex flex-col flex-1 min-h-0 overflow-y-auto pr-1",
          children: (0, jsxEditor.jsx)(TriggersPanel, {
            triggers: triggers.rows,
            catalog: triggers.catalog,
            instanceUrl: triggers.instanceUrl,
            loading: triggers.loading,
            error: triggers.error,
            saving: saving,
            offline: triggersOffline,
            rememberedAt: triggers.rememberedAt,
            queued: triggers.queued,
            actions: workflow.actions.map(action => ({
              id: action.id,
              name: action.action,
              label: action.label
            })),
            onRefresh: onRefreshTriggers,
            onCreate: onCreateTrigger,
            onUpdate: onUpdateTrigger,
            onDelete: onDeleteTrigger
          })
        }) : (0, jsxEditor.jsx)(EmptyNote, {
          children: loading ? "Loading workflow\u2026" : "Workflow not loaded."
        }), accessTarget && (0, jsxEditor.jsx)(AccessRulesDialog, {
          actionLabel: `"${accessTarget.action.label}"`,
          rules: accessTarget.action.access,
          subjects: accessSubjects,
          saving: saving,
          onCancel: () => setAccessTarget(null),
          onOpenFunction: () => onOpenAccessFunction(accessTarget.path, accessTarget.action.label),
          onSave: rules => {
            onSetAccess(accessTarget.path, rules), setAccessTarget(null);
          }
        }), renameTarget && (0, jsxEditor.jsx)(RenameNodeDialog, {
          target: renameTarget,
          saving: saving,
          error: paramErrors[0]?.message ?? "",
          onCancel: () => setRenameTarget(null),
          onSubmit: (label, machineName, color) => {
            onRenameNode(renameTarget.kind, renameTarget.path, label, machineName, color), setRenameTarget(null);
          }
        }), fieldDialog && (0, jsxEditor.jsx)(CreateOrEditDialog, {
          target: fieldDialog,
          saving: saving,
          error: paramErrors[0]?.message ?? "",
          onCancel: () => {
            awaitingSaveRef.current = !1, setFieldDialog(null), onDialogClosed();
          },
          onSubmit: (label, color, fieldType, required, newKey) => {
            awaitingSaveRef.current = !0, onCreate(fieldDialog.kind, {
              label: label,
              color: color,
              stageIndex: fieldDialog.stageIndex,
              ownerPath: fieldDialog.ownerPath,
              formKey: fieldDialog.formKey,
              type: fieldType,
              required: required,
              newKey: newKey,
              editingKey: fieldDialog.editing?.key
            });
          }
        }), operatorDialog && (0, jsxEditor.jsx)(StepDialog, {
          target: operatorDialog,
          operators: operators,
          resourceNames: resourceNames,
          lookupOptions: lookupOptions,
          onNeedLookup: onNeedLookup,
          commands: workflow?.commands.map(command => ({
            id: command.id,
            name: command.name,
            label: command.label,
            parameters: command.parameters.map(parameter => ({
              key: parameter.key,
              label: parameter.label,
              type: parameter.type,
              required: parameter.required
            }))
          })) ?? [],
          saving: saving,
          errors: paramErrors,
          saveError: error,
          externalValues: editorValues,
          onEditInEditor: (param, paramLabel, value, language, operator) => onEditParamInEditor(param, paramLabel, value, language, operatorDialog.mode === "edit" ? operatorDialog.childrenPath : null, operator ?? (operatorDialog.mode === "edit" ? operatorDialog.operator ?? null : null), contextName),
          onCancel: closeOperatorDialog,
          initialValues: operatorDialog.mode === "edit" ? nodeParams : null,
          onEditHtmlParam: operatorDialog.mode === "edit" ? param => onEditHtmlParam(operatorDialog.childrenPath, param, contextName) : void 0,
          onOpenDesigner: () => onOpenWorkflowInInstance(),
          onSubmit: (operator, values, delay) => (awaitingSaveRef.current = !0, operatorDialog.mode === "edit" ? onUpdateOperator(operatorDialog.childrenPath, operator, values, delay) : onAddOperator(operatorDialog.childrenPath, operator, values, delay))
        })]
      })
    })
  });
}
// samePath (minified: dt) — whether two node paths are equal
function samePath(pathA, pathB) {
  return pathA.length === pathB.length && pathA.every((segment, index) => segment === pathB[index]);
}
// rebaseNode (minified: qr) — Returns a copy of a flow node moved to newPath, with its children's paths rewritten to match.
function rebaseNode(node, newPath) {
  let rebasePath = oldPath => [...newPath, ...oldPath.slice(node.path.length)];
  switch (node.kind) {
    case "series":
    case "parallel":
    case "each":
      {
        let childrenPath = rebasePath(node.childrenPath);
        return {
          ...node,
          path: newPath,
          childrenPath: childrenPath,
          children: node.children.map((child, index) => rebaseNode(child, [...childrenPath, index]))
        };
      }
    case "if":
      {
        let truePath = rebasePath(node.truePath),
          falsePath = rebasePath(node.falsePath);
        return {
          ...node,
          path: newPath,
          truePath: truePath,
          falsePath: falsePath,
          whenTrue: node.whenTrue.map((child, index) => rebaseNode(child, [...truePath, index])),
          whenFalse: node.whenFalse.map((child, index) => rebaseNode(child, [...falsePath, index]))
        };
      }
    default:
      return {
        ...node,
        path: newPath
      };
  }
}
// findChildList (minified: Au) — Finds the child list (children / whenTrue / whenFalse) whose path is childrenPath under a node, or null.
function findChildList(node, childrenPath) {
  switch (node.kind) {
    case "series":
    case "parallel":
    case "each":
      return samePath(node.childrenPath, childrenPath) ? node.children : node.children.reduce((found, child) => found ?? findChildList(child, childrenPath), null);
    case "if":
      return samePath(node.truePath, childrenPath) ? node.whenTrue : samePath(node.falsePath, childrenPath) ? node.whenFalse : [...node.whenTrue, ...node.whenFalse].reduce((found, child) => found ?? findChildList(child, childrenPath), null);
    default:
      return null;
  }
}
// renumberChildList (minified: Fr) — Rewrites the paths of the nodes in the list at childrenPath (after an insert or removal) so they match their new positions.
function renumberChildList(node, childrenPath) {
  switch (node.kind) {
    case "series":
    case "parallel":
    case "each":
      {
        let children = samePath(node.childrenPath, childrenPath) ? node.children.map((child, index) => rebaseNode(child, [...node.childrenPath, index])) : node.children.map(child => renumberChildList(child, childrenPath));
        return {
          ...node,
          children: children
        };
      }
    case "if":
      {
        let whenTrue = samePath(node.truePath, childrenPath) ? node.whenTrue.map((child, index) => rebaseNode(child, [...node.truePath, index])) : node.whenTrue.map(child => renumberChildList(child, childrenPath)),
          whenFalse = samePath(node.falsePath, childrenPath) ? node.whenFalse.map((child, index) => rebaseNode(child, [...node.falsePath, index])) : node.whenFalse.map(child => renumberChildList(child, childrenPath));
        return {
          ...node,
          whenTrue: whenTrue,
          whenFalse: whenFalse
        };
      }
    default:
      return node;
  }
}
// mapWorkflowFlows (minified: Ri) — Applies transform to the flow of every action (global and in stages) and command of a workflow view.
function mapWorkflowFlows(workflow, transform) {
  return {
    ...workflow,
    actions: workflow.actions.map(action => action.flow ? {
      ...action,
      flow: transform(action.flow)
    } : action),
    stages: workflow.stages.map(stage => ({
      ...stage,
      actions: stage.actions.map(action => action.flow ? {
        ...action,
        flow: transform(action.flow)
      } : action)
    })),
    commands: workflow.commands.map(command => command.flow ? {
      ...command,
      flow: transform(command.flow)
    } : command)
  };
}
// findNodeByPath (minified: bw) — Finds the flow node at a path anywhere in a workflow view.
function findNodeByPath(workflow, path) {
  let found = null,
    visit = node => {
      if (!found) {
        if (samePath(node.path, path)) {
          found = node;
          return;
        }
        switch (node.kind) {
          case "series":
          case "parallel":
          case "each":
            node.children.forEach(visit);
            break;
          case "if":
            node.whenTrue.forEach(visit), node.whenFalse.forEach(visit);
            break;
        }
      }
    };
  return mapWorkflowFlows(workflow, flow => (visit(flow), flow)), found;
}
// moveNodeLocally (minified: Fb) — Optimistically moves a step in the local workflow view, as the host's moveOperator will.
// Returns the new view, the same view when the move changes nothing, or null when it can't be applied here
// (e.g. moving a step into itself).
function moveNodeLocally(workflow, fromPath, toChildrenPath, toIndex) {
  let fromParent = fromPath.slice(0, -1),
    fromIndex = Number(fromPath[fromPath.length - 1]);
  if (!Number.isInteger(fromIndex) || toChildrenPath.length >= fromPath.length && fromPath.every((segment, segmentIndex) => segment === toChildrenPath[segmentIndex])) return null;
  let copy = structuredClone(workflow),
    moving = findNodeByPath(copy, fromPath);
  if (!moving) return null;
  let targetIndex = toIndex;
  // Moving later in the same list: the removal shifts the target index down by one.
  if (samePath(fromParent, toChildrenPath) && targetIndex > fromIndex && (targetIndex -= 1), samePath(fromParent, toChildrenPath) && targetIndex === fromIndex) return workflow;
  let removed = !1,
    inserted = !1,
    withoutStep = mapWorkflowFlows(copy, flow => {
      let list = findChildList(flow, fromParent);
      if (!list) return flow;
      let position = list.findIndex(sibling => samePath(sibling.path, fromPath));
      return position === -1 ? flow : (list.splice(position, 1), removed = !0, renumberChildList(flow, fromParent));
    });
  if (!removed) return null;
  let result = mapWorkflowFlows(withoutStep, flow => {
    let list = findChildList(flow, toChildrenPath);
    return list ? (list.splice(Math.max(0, Math.min(targetIndex, list.length)), 0, moving), inserted = !0, renumberChildList(flow, toChildrenPath)) : flow;
  });
  return inserted ? result : null;
}
// deleteNodeLocally (minified: Pb) — Optimistically removes the step at path from the local workflow view; null if it isn't found.
function deleteNodeLocally(workflow, path) {
  let parentPath = path.slice(0, -1),
    removed = !1,
    copy = structuredClone(workflow),
    result = mapWorkflowFlows(copy, flow => {
      let list = findChildList(flow, parentPath);
      if (!list) return flow;
      let position = list.findIndex(sibling => samePath(sibling.path, path));
      return position === -1 ? flow : (list.splice(position, 1), removed = !0, renumberChildList(flow, parentPath));
    });
  return removed ? result : null;
}
// jsxApp (minified: ka) — jsx runtime; vscodeApi = the webview's single VS Code API handle (the node view wraps it, see src/bridge.ts)
var jsxApp = V(Q()),
  vscodeApi = acquireVsCodeApi();
// WorkflowsApp (minified: Hb) — root of the Workflows webview: the workflow list, or the editor for the open workflow. Holds all state,
// talks to the host (fetchWorkflows / fetchWorkflow / fetchTriggers, every edit message) and handles its replies.
// Edits are counted in flight (inFlightRef); move / delete are applied locally first and rolled back if the save fails.
function WorkflowsApp() {
  let [workflows, setWorkflows] = (0, ReactApp.useState)([]),
    [selectedSummary, setSelectedSummary] = (0, ReactApp.useState)(null),
    selectedIdRef = (0, ReactApp.useRef)(null),
    [toast, setToast] = (0, ReactApp.useState)("");
  // The toast hides itself after 5 s.
  (0, ReactApp.useEffect)(() => {
    if (!toast) return;
    let timer = setTimeout(() => setToast(""), 5e3);
    return () => clearTimeout(timer);
  }, [toast]);
  // rollbackRef = the workflow view before an optimistic move / delete, restored if the save fails;
  // inFlightRef = how many edits were sent and not yet answered (editSaved / editRejected / editFailed).
  let [workflow, setWorkflow] = (0, ReactApp.useState)(null),
    [operators, setOperators] = (0, ReactApp.useState)({}),
    [instanceName, setInstanceName] = (0, ReactApp.useState)(""),
    [search, setSearch] = (0, ReactApp.useState)(""),
    [listLoading, setListLoading] = (0, ReactApp.useState)(!0),
    [workflowLoading, setWorkflowLoading] = (0, ReactApp.useState)(!1),
    [listError, setListError] = (0, ReactApp.useState)(""),
    [workflowError, setWorkflowError] = (0, ReactApp.useState)(""),
    [saving, setSaving] = (0, ReactApp.useState)(!1),
    [accessSubjects, setAccessSubjects] = (0, ReactApp.useState)({
      groups: [],
      users: [],
      permissions: [],
      error: null
    }),
    [clipboard, setClipboard] = (0, ReactApp.useState)(null),
    [paramErrors, setParamErrors] = (0, ReactApp.useState)([]),
    [connection, setConnection] = (0, ReactApp.useState)({
      offline: !1,
      pending: []
    }),
    pendingEdits = connection.pending.reduce((total, entry) => total + entry.edits, 0),
    [synced, setSynced] = (0, ReactApp.useState)(""),
    [createOpen, setCreateOpen] = (0, ReactApp.useState)(!1),
    [triggers, setTriggers] = (0, ReactApp.useState)({
      rows: [],
      catalog: [],
      instanceUrl: "",
      loading: !1,
      error: "",
      offline: !1,
      rememberedAt: 0,
      queued: 0
    });
  // Tells the host when the browser's online state changes, so it can re-check the connection.
  (0, ReactApp.useEffect)(() => {
    let sendConnectivityHint = () => vscodeApi.postMessage({
      type: "connectivityHint",
      payload: {
        online: navigator.onLine
      }
    });
    return window.addEventListener("online", sendConnectivityHint), window.addEventListener("offline", sendConnectivityHint), () => {
      window.removeEventListener("online", sendConnectivityHint), window.removeEventListener("offline", sendConnectivityHint);
    };
  }, []);
  let revealOfflineFiles = () => {
      vscodeApi.postMessage({
        type: "revealOfflineFiles"
      });
    },
    refetchAll = () => {
      // Reloads the open workflow, its triggers and the list (Retry, and when the host asks).
      selectedIdRef.current && (vscodeApi.postMessage({
        type: "fetchWorkflow",
        payload: {
          workflowId: selectedIdRef.current
        }
      }), vscodeApi.postMessage({
        type: "fetchTriggers",
        payload: {
          workflowId: selectedIdRef.current
        }
      })), vscodeApi.postMessage({
        type: "fetchWorkflows"
      });
    },
    [canUndo, setCanUndo] = (0, ReactApp.useState)(!1),
    [saveSignal, setSaveSignal] = (0, ReactApp.useState)(0),
    [failSignal, setFailSignal] = (0, ReactApp.useState)(0),
    [resourceNames, setResourceNames] = (0, ReactApp.useState)([]),
    [lookupOptions, setLookupOptions] = (0, ReactApp.useState)({}),
    [bindings, setBindings] = (0, ReactApp.useState)(null),
    [draft, setDraft] = (0, ReactApp.useState)({
      pending: 0,
      summaries: []
    }),
    [hookSaved, setHookSaved] = (0, ReactApp.useState)(""),
    [editorValues, setEditorValues] = (0, ReactApp.useState)({}),
    [nodeParams, setNodeParams] = (0, ReactApp.useState)(null),
    rollbackRef = (0, ReactApp.useRef)(null),
    inFlightRef = (0, ReactApp.useRef)(0);
  // Host messages.
  (0, ReactApp.useEffect)(() => {
    let onMessage = messageEvent => {
      let message = messageEvent.data;
      switch (message.type) {
        // the host asks for a reload
        case "retryConnection":
          refetchAll();
          break;
        // back online: reload, and show how many offline edits were pushed
        case "connectionRestored":
          selectedIdRef.current && (vscodeApi.postMessage({
            type: "fetchWorkflow",
            payload: {
              workflowId: selectedIdRef.current
            }
          }), vscodeApi.postMessage({
            type: "fetchTriggers",
            payload: {
              workflowId: selectedIdRef.current
            }
          })), vscodeApi.postMessage({
            type: "fetchWorkflows"
          }), message.payload?.synced && setSynced(message.payload.synced);
          break;
        // a new workflow exists: close the dialog and open it
        case "workflowCreated":
          setCreateOpen(!1), setSaving(!1), setParamErrors([]), message.payload?.workflowId && openWorkflow({
            id: message.payload.workflowId,
            name: message.payload.name ?? "",
            status: null,
            stageCount: 0,
            globalActionCount: 0,
            stages: []
          });
          break;
        // the open workflow was deleted: back to the list
        case "workflowDeleted":
          vscodeApi.setState({}), setSelectedSummary(null), selectedIdRef.current = null, setWorkflow(null), setSaving(!1), setParamErrors([]), vscodeApi.postMessage({
            type: "fetchWorkflows"
          });
          break;
        // the workflow's triggers (possibly remembered from an earlier visit when offline)
        case "triggers":
          setTriggers({
            rows: Array.isArray(message.payload?.triggers) ? message.payload.triggers : [],
            catalog: Array.isArray(message.payload?.catalog) ? message.payload.catalog : [],
            instanceUrl: message.payload?.instanceUrl ?? "",
            loading: !1,
            error: "",
            offline: !!message.payload?.offline,
            rememberedAt: typeof message.payload?.rememberedAt == "number" ? message.payload.rememberedAt : 0,
            queued: typeof message.payload?.queued == "number" ? message.payload.queued : 0
          });
          break;
        case "triggersFailed":
          setTriggers(prev => ({
            ...prev,
            loading: !1,
            error: message.payload?.message ?? "Could not read triggers."
          }));
          break;
        // a trigger was created / updated / deleted
        case "triggerSaved":
          setSaving(!1), setParamErrors([]);
          break;
        // online / offline state and the edits queued offline
        case "connection":
          setConnection({
            offline: !!message.payload?.offline,
            pending: Array.isArray(message.payload?.pending) ? message.payload.pending : []
          });
          break;
        // the workflow list
        case "workflows":
          setWorkflows(message.payload.workflows), setInstanceName(message.payload.instanceName ?? ""), setListLoading(!1), setListError("");
          break;
        // the operator catalog
        case "operators":
          setOperators(message.payload ?? {});
          break;
        // the pending draft: how many edits and their summaries
        case "draftState":
          setDraft({
            pending: message.payload?.pending ?? 0,
            summaries: Array.isArray(message.payload?.summaries) ? message.payload.summaries : []
          });
          break;
        // resource lifecycle hooks (and which one was just saved)
        case "bindings":
          setBindings(Array.isArray(message.payload?.bindings) ? message.payload.bindings : null), setHookSaved(message.payload?.saved ?? "");
          break;
        // options for a lookup field, per resource
        case "lookupOptions":
          setLookupOptions(prev => ({
            ...prev,
            [message.payload.resource]: message.payload.options ?? null
          }));
          break;
        // resource names for parameter pickers
        case "resourceNames":
          setResourceNames(Array.isArray(message.payload) ? message.payload : []);
          break;
        // the stored parameters of the step being edited (answers readNode)
        case "nodeParams":
          setNodeParams({
            values: message.payload?.values ?? {},
            delay: message.payload?.delay ?? null,
            designed: message.payload?.designed ?? [],
            withDesignTree: message.payload?.withDesignTree ?? []
          });
          break;
        // a value edited in an editor tab, sent back to the operator dialog
        case "paramValue":
          setEditorValues(prev => ({
            ...prev,
            [message.payload.param]: message.payload.value
          }));
          break;
        // the workflow view; ignored while more than one edit is still in flight, so it doesn't flicker
        case "workflow":
          inFlightRef.current <= 1 && setWorkflow(message.payload), setWorkflowLoading(!1), setWorkflowError("");
          break;
        // an edit was applied to the draft
        case "editSaved":
          setParamErrors([]), setSaveSignal(count => count + 1), inFlightRef.current = Math.max(0, inFlightRef.current - 1), setSaving(inFlightRef.current > 0), setCanUndo(message.payload?.canUndo === !0), rollbackRef.current = null;
          break;
        // an edit was refused (parameter errors or a reason)
        case "editRejected":
          setParamErrors(message.payload?.errors ?? []), message.payload?.reason ? setWorkflowError(message.payload.reason) : message.payload?.cancelled && setWorkflowError(""), inFlightRef.current = Math.max(0, inFlightRef.current - 1), setSaving(inFlightRef.current > 0);
          break;
        // user groups / users / permissions for access rules
        case "accessSubjects":
          setAccessSubjects({
            groups: (message.payload?.groups ?? []).map(group => ({
              id: group.id,
              name: group.name,
              detail: group.description ?? null
            })),
            users: (message.payload?.users ?? []).map(user => ({
              id: user.id,
              name: user.name,
              detail: user.email ?? null
            })),
            permissions: (message.payload?.permissions ?? []).map(permission => ({
              id: permission.id,
              name: permission.name,
              detail: permission.description ?? permission.id
            })),
            error: message.payload?.error ?? null
          });
          break;
        // what is on the step clipboard
        case "clipboard":
          setClipboard(message.payload ?? null);
          break;
        // an edit failed: undo the optimistic change and reload when nothing else is in flight
        case "editFailed":
          {
            setFailSignal(count => count + 1), inFlightRef.current = Math.max(0, inFlightRef.current - 1), setSaving(inFlightRef.current > 0), setWorkflowError(message.payload?.message ?? "Save failed"), rollbackRef.current && (setWorkflow(rollbackRef.current), rollbackRef.current = null), inFlightRef.current === 0 && selectedIdRef.current && vscodeApi.postMessage({
              type: "fetchWorkflow",
              payload: {
                workflowId: selectedIdRef.current
              }
            });
            break;
          }
        // the agent changed a workflow: refresh the list, and the open one unless it has a draft
        case "workflowChangedRemotely":
          {
            let {
              workflowId: changedId,
              summary: changeSummary,
              hasDraft: hasDraft
            } = message.payload ?? {};
            if (vscodeApi.postMessage({
              type: "fetchWorkflows"
            }), !changedId || selectedIdRef.current !== String(changedId)) break;
            if (hasDraft) {
              setToast(`The agent ${changeSummary || "changed this workflow"}. Save or discard your changes to see it.`);
              break;
            }
            inFlightRef.current === 0 && (setWorkflowLoading(!0), vscodeApi.postMessage({
              type: "fetchWorkflow",
              payload: {
                workflowId: String(changedId)
              }
            })), setToast(`The agent ${changeSummary || "changed this workflow"}.`);
            break;
          }
        // a failure loading the workflow (has workflowId) or the list
        case "error":
          message.payload?.workflowId ? (setWorkflowLoading(!1), setWorkflowError(message.payload?.message ?? "Failed to load workflow")) : (setListLoading(!1), setListError(message.payload?.message ?? "Something went wrong"));
          break;
      }
    };
    return window.addEventListener("message", onMessage), vscodeApi.postMessage({
      type: "fetchWorkflows"
    }), vscodeApi.postMessage({
      type: "clipboardState"
    }), () => window.removeEventListener("message", onMessage);
  }, []);
  let loadWorkflow = (0, ReactApp.useCallback)(workflowId => {
      setWorkflowLoading(!0), setWorkflowError(""), vscodeApi.postMessage({
        type: "fetchWorkflow",
        payload: {
          workflowId: workflowId
        }
      });
    }, []),
    refreshTriggers = () => {
      selectedIdRef.current && (setTriggers(prev => ({
        ...prev,
        loading: !0,
        error: ""
      })), vscodeApi.postMessage({
        type: "fetchTriggers",
        payload: {
          workflowId: selectedIdRef.current
        }
      }));
    },
    openWorkflow = summary => {
      // Opens a workflow from the list: remembers it in the webview state and loads it and its triggers.
      setSelectedSummary(summary), selectedIdRef.current = summary.id, vscodeApi.setState({
        selected: summary
      }), setWorkflow(null), setTriggers(prev => ({
        ...prev,
        rows: [],
        loading: !0,
        error: ""
      })), loadWorkflow(summary.id), vscodeApi.postMessage({
        type: "fetchTriggers",
        payload: {
          workflowId: summary.id
        }
      });
    };
  // Reopens the workflow open last time, and opens one when the node view asks (this project's `sonover:openWorkflow` window event).
  (0, ReactApp.useEffect)(() => {
    let savedSelection = vscodeApi.getState()?.selected;
    savedSelection && typeof savedSelection.id == "string" && openWorkflow(savedSelection);
    let onOpenWorkflowEvent = openEvent => {
      let requested = openEvent.detail;
      requested && typeof requested.id == "string" && openWorkflow(requested);
    };
    return window.addEventListener("sonover:openWorkflow", onOpenWorkflowEvent), () => window.removeEventListener("sonover:openWorkflow", onOpenWorkflowEvent);
  }, []);
  // Edit senders: each counts an edit in flight, marks saving and clears old errors before posting.
  let addOperator = (childrenPath, operator, values, delay) => {
      selectedSummary && (inFlightRef.current += 1, setSaving(!0), setParamErrors([]), setWorkflowError(""), vscodeApi.postMessage({
        type: "addOperator",
        payload: {
          workflowId: selectedSummary.id,
          childrenPath: childrenPath,
          index: null,
          operator: operator,
          values: values,
          delay: delay
        }
      }));
    },
    openParamEditor = (param, label, value, language, path, operator, contextName) => {
      // Opens one parameter in an editor tab; with a path the host can write it back to that step.
      vscodeApi.postMessage({
        type: "openParamEditor",
        payload: {
          param: param,
          label: label,
          value: value,
          language: language,
          operator: operator,
          ...(path && selectedSummary ? {
            workflowId: selectedSummary.id,
            workflowName: workflow?.name ?? selectedSummary.name,
            contextName: contextName,
            path: path
          } : {})
        }
      });
    },
    updateOperator = (path, operator, values, delay) => {
      selectedSummary && (inFlightRef.current += 1, setSaving(!0), setParamErrors([]), setWorkflowError(""), vscodeApi.postMessage({
        type: "updateOperator",
        payload: {
          workflowId: selectedSummary.id,
          path: path,
          operator: operator,
          values: values,
          delay: delay
        }
      }));
    },
    moveOperator = (fromPath, toChildrenPath, toIndex) => {
      // Moves a step: applied locally first (kept for rollback); a move that changes nothing is not sent.
      if (!selectedSummary) return;
      let unchanged = !1;
      setWorkflow(current => {
        if (!current) return current;
        let moved = moveNodeLocally(current, fromPath, toChildrenPath, toIndex);
        return moved === current ? (unchanged = !0, current) : moved ? (rollbackRef.current = current, moved) : current;
      }), !unchanged && (inFlightRef.current += 1, setSaving(!0), setWorkflowError(""), vscodeApi.postMessage({
        type: "moveOperator",
        payload: {
          workflowId: selectedSummary.id,
          fromPath: fromPath,
          toChildrenPath: toChildrenPath,
          toIndex: toIndex
        }
      }));
    },
    deleteOperator = (path, operator, label) => {
      selectedSummary && (setWorkflow(current => {
        if (!current) return current;
        let updated = deleteNodeLocally(current, path);
        return updated ? (rollbackRef.current = current, updated) : current;
      }), inFlightRef.current += 1, setSaving(!0), setWorkflowError(""), vscodeApi.postMessage({
        type: "deleteOperator",
        payload: {
          workflowId: selectedSummary.id,
          path: path,
          operator: operator,
          label: label
        }
      }));
    },
    copyNode = (path, label) => {
      selectedSummary && vscodeApi.postMessage({
        type: "copyNode",
        payload: {
          workflowId: selectedSummary.id,
          path: path,
          label: label
        }
      });
    },
    setAccess = (path, rules) => {
      selectedSummary && (inFlightRef.current += 1, setSaving(!0), setWorkflowError(""), vscodeApi.postMessage({
        type: "setAccess",
        payload: {
          workflowId: selectedSummary.id,
          path: path,
          rules: rules
        }
      }));
    },
    copyContents = (childrenPath, label, count) => {
      selectedSummary && vscodeApi.postMessage({
        type: "copyContents",
        payload: {
          workflowId: selectedSummary.id,
          childrenPath: childrenPath,
          label: label,
          count: count
        }
      });
    },
    pasteNode = (childrenPath, index) => {
      selectedSummary && (inFlightRef.current += 1, setSaving(!0), setWorkflowError(""), vscodeApi.postMessage({
        type: "pasteNode",
        payload: {
          workflowId: selectedSummary.id,
          childrenPath: childrenPath,
          index: index
        }
      }));
    },
    duplicateNode = (path, label) => {
      selectedSummary && (inFlightRef.current += 1, setSaving(!0), setWorkflowError(""), vscodeApi.postMessage({
        type: "duplicateNode",
        payload: {
          workflowId: selectedSummary.id,
          path: path,
          label: label
        }
      }));
    },
    createItem = (kind, fields) => {
      // Creates a stage / action / command, or creates or updates a form field.
      if (!selectedSummary) return;
      let messageType = kind === "stage" ? "createStage" : kind === "action" ? "createAction" : kind === "command" ? "createCommand" : fields.editingKey ? "updateFormField" : "createFormField";
      inFlightRef.current += 1, setSaving(!0), setParamErrors([]), setWorkflowError(""), vscodeApi.postMessage({
        type: messageType,
        payload: {
          workflowId: selectedSummary.id,
          ...fields,
          key: fields.editingKey
        }
      });
    },
    deleteFormField = (ownerPath, formKey, fieldKey) => {
      selectedSummary && (inFlightRef.current += 1, setSaving(!0), setWorkflowError(""), vscodeApi.postMessage({
        type: "deleteFormField",
        payload: {
          workflowId: selectedSummary.id,
          ownerPath: ownerPath,
          formKey: formKey,
          key: fieldKey
        }
      }));
    },
    openCode = (path, operator, params, contextName) => {
      // Opens a step's code parameters in editor tabs (several at once, or one).
      if (!selectedSummary || params.length === 0) return;
      let single = params.length === 1 ? params[0] : null;
      vscodeApi.postMessage({
        type: "openParamEditor",
        payload: {
          param: single?.param,
          label: single?.label,
          language: single?.language,
          params: params,
          workflowId: selectedSummary.id,
          workflowName: workflow?.name ?? selectedSummary.name,
          contextName: contextName,
          path: path,
          operator: operator
        }
      });
    },
    readNode = path => {
      // Asks the host for a step's stored parameters (answered by nodeParams).
      setNodeParams(null), selectedSummary && vscodeApi.postMessage({
        type: "readNode",
        payload: {
          workflowId: selectedSummary.id,
          path: path
        }
      });
    },
    undoLastEdit = () => {
      selectedSummary && (inFlightRef.current += 1, setSaving(!0), setWorkflowError(""), vscodeApi.postMessage({
        type: "undoLastEdit",
        payload: {
          workflowId: selectedSummary.id
        }
      }));
    },
    backToList = () => {
      vscodeApi.setState({}), setSelectedSummary(null), selectedIdRef.current = null, setWorkflow(null), setWorkflowError(""), setCanUndo(!1), setParamErrors([]);
    };
  // A workflow is open: the editor, plus the toast.
  if (selectedSummary) return (0, jsxApp.jsxs)(jsxApp.Fragment, {
    children: [(0, jsxApp.jsx)(WorkflowEditor, {
      summary: selectedSummary,
      workflow: workflow,
      operators: operators,
      bindings: bindings,
      lookupOptions: lookupOptions,
      onNeedLookup: lookupRequest => vscodeApi.postMessage({
        type: "fetchLookupOptions",
        payload: lookupRequest
      }),
      onMoveStage: (fromIndex, toIndex) => vscodeApi.postMessage({
        type: "moveStage",
        payload: {
          workflowId: selectedSummary.id,
          fromIndex: fromIndex,
          toIndex: toIndex
        }
      }),
      onMoveAction: (stageIndex, fromIndex, toIndex) => vscodeApi.postMessage({
        type: "moveAction",
        payload: {
          workflowId: selectedSummary.id,
          stageIndex: stageIndex,
          fromIndex: fromIndex,
          toIndex: toIndex
        }
      }),
      draft: draft,
      onSaveChanges: () => {
        setSaving(!0), vscodeApi.postMessage({
          type: "saveChanges",
          payload: {
            workflowId: selectedSummary.id
          }
        });
      },
      onDiscardChanges: () => {
        vscodeApi.postMessage({
          type: "discardChanges",
          payload: {
            workflowId: selectedSummary.id
          }
        });
      },
      hookSaved: hookSaved,
      onSetHook: hook => {
        setHookSaved(""), vscodeApi.postMessage({
          type: "setLifecycleHook",
          payload: {
            ...hook,
            workflowId: selectedSummary.id
          }
        });
      },
      loading: workflowLoading,
      error: workflowError,
      saving: saving,
      paramErrors: paramErrors,
      canUndo: canUndo,
      saveSignal: saveSignal,
      failSignal: failSignal,
      resourceNames: resourceNames,
      editorValues: editorValues,
      onBack: backToList,
      onRefresh: () => loadWorkflow(selectedSummary.id),
      onViewRaw: () => vscodeApi.postMessage({
        type: "viewRawWorkflow",
        payload: {
          workflowId: selectedSummary.id
        }
      }),
      onOpenExternal: () => vscodeApi.postMessage({
        type: "openWorkflow",
        payload: {
          workflowId: selectedSummary.id
        }
      }),
      onAddOperator: addOperator,
      onUpdateOperator: updateOperator,
      onMoveOperator: moveOperator,
      onDeleteOperator: deleteOperator,
      onCopyOperator: copyNode,
      onCopyContents: copyContents,
      onSetAccess: setAccess,
      onListAccessSubjects: () => vscodeApi.postMessage({
        type: "listAccessSubjects"
      }),
      onOpenAccessFunction: (path, contextName) => vscodeApi.postMessage({
        type: "openAccessFunction",
        payload: {
          workflowId: selectedSummary?.id,
          path: path,
          workflowName: workflow?.name ?? selectedSummary?.name,
          contextName: contextName
        }
      }),
      accessSubjects: accessSubjects,
      onPasteOperator: pasteNode,
      onDuplicateOperator: duplicateNode,
      clipboard: clipboard,
      onCreate: createItem,
      onDeleteField: deleteFormField,
      onOpenCode: openCode,
      onReadNode: readNode,
      onEditHtmlParam: (path, param, contextName) => vscodeApi.postMessage({
        type: "openHtmlParam",
        payload: {
          workflowId: selectedSummary?.id,
          path: path,
          param: param,
          workflowName: workflow?.name ?? selectedSummary?.name,
          contextName: contextName
        }
      }),
      onRevealFiles: revealOfflineFiles,
      triggers: triggers,
      triggersOffline: triggers.offline,
      onRefreshTriggers: refreshTriggers,
      onCreateTrigger: (provider, values, actions) => {
        setSaving(!0), setParamErrors([]), vscodeApi.postMessage({
          type: "createTrigger",
          payload: {
            workflowId: selectedSummary.id,
            provider: provider,
            values: values,
            actions: actions
          }
        });
      },
      onUpdateTrigger: (trigger, provider, values, actions) => {
        setSaving(!0), setParamErrors([]), vscodeApi.postMessage({
          type: "updateTrigger",
          payload: {
            workflowId: selectedSummary.id,
            triggerId: trigger.id,
            provider: provider,
            values: values,
            actions: actions
          }
        });
      },
      onDeleteTrigger: trigger => vscodeApi.postMessage({
        type: "deleteTrigger",
        payload: {
          workflowId: selectedSummary.id,
          triggerId: trigger.id,
          summary: trigger.summary
        }
      }),
      onDeleteWorkflow: () => vscodeApi.postMessage({
        type: "deleteWorkflow",
        payload: {
          workflowId: selectedSummary.id
        }
      }),
      onOpenWorkflowInInstance: () => vscodeApi.postMessage({
        type: "openWorkflow",
        payload: {
          workflowId: selectedSummary?.id
        }
      }),
      nodeParams: nodeParams,
      onEditParamInEditor: openParamEditor,
      onUndo: undoLastEdit,
      onRenameNode: (kind, path, label, machineName, color) => {
        vscodeApi.postMessage({
          type: "renameNode",
          payload: {
            workflowId: selectedSummary.id,
            kind: kind,
            path: path,
            label: label,
            machineName: machineName,
            color: color
          }
        });
      },
      onDeleteNode: (kind, path) => {
        vscodeApi.postMessage({
          type: "deleteNode",
          payload: {
            workflowId: selectedSummary.id,
            kind: kind,
            path: path
          }
        });
      },
      onDialogClosed: () => {
        setParamErrors([]), setSaving(!1), setEditorValues({}), setNodeParams(null);
      },
      banner: (0, jsxApp.jsx)(OfflineBanner, {
        offline: connection.offline,
        pending: connection.pending,
        synced: synced,
        onDismissSynced: () => setSynced(""),
        onRetry: refetchAll,
        onRevealFiles: revealOfflineFiles
      }),
      tag: (0, jsxApp.jsx)(OfflinePill, {
        offline: connection.offline,
        pendingEdits: pendingEdits,
        onRetry: refetchAll
      })
    }), toast && (0, jsxApp.jsx)("div", {
      role: "status",
      className: "fixed bottom-3 right-3 z-50 max-w-sm rounded-md border border-border bg-[var(--vscode-editorWidget-background)] px-3 py-2 text-xs text-foreground shadow-lg",
      children: toast
    })]
  });
  // The list: filtered by the search text (workflow or stage names).
  let query = search.trim().toLowerCase(),
    visibleWorkflows = query ? workflows.filter(item => item.name.toLowerCase().includes(query) || item.stages.some(stage => stage.label.toLowerCase().includes(query))) : workflows;
  return (0, jsxApp.jsxs)(jsxApp.Fragment, {
    children: [createOpen && (0, jsxApp.jsx)(CreateWorkflowDialog, {
      saving: saving,
      error: paramErrors[0]?.message ?? "",
      offline: connection.offline,
      onCancel: () => {
        setCreateOpen(!1), setParamErrors([]), setSaving(!1);
      },
      onSubmit: (workflowName, firstStageLabel, firstStageColor) => {
        setSaving(!0), setParamErrors([]), vscodeApi.postMessage({
          type: "createWorkflow",
          payload: {
            name: workflowName,
            firstStageLabel: firstStageLabel,
            firstStageColor: firstStageColor
          }
        });
      }
    }), (0, jsxApp.jsx)(WorkflowListView, {
      workflows: visibleWorkflows,
      bindings: bindings,
      onCreate: () => setCreateOpen(!0),
      banner: (0, jsxApp.jsx)(OfflineBanner, {
        offline: connection.offline,
        pending: connection.pending,
        synced: synced,
        onDismissSynced: () => setSynced(""),
        onRetry: refetchAll,
        onRevealFiles: revealOfflineFiles
      }),
      tag: (0, jsxApp.jsx)(OfflinePill, {
        offline: connection.offline,
        pendingEdits: pendingEdits,
        onRetry: refetchAll
      }),
      instanceName: instanceName,
      loading: listLoading,
      error: listError,
      search: search,
      onSearchChange: setSearch,
      onOpen: openWorkflow,
      onRevealFiles: revealOfflineFiles,
      onRefresh: () => {
        setListLoading(!0), setListError(""), vscodeApi.postMessage({
          type: "fetchWorkflows"
        });
      }
    })]
  });
}
var jsxMount = V(Q());
// Mounts the app into #root.
(0, ReactDOMClient.createRoot)(document.getElementById("root")).render((0, jsxMount.jsx)(WorkflowsApp, {}));
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
lucide-react/dist/esm/icons/arrow-left.mjs:
lucide-react/dist/esm/icons/arrow-right.mjs:
lucide-react/dist/esm/icons/boxes.mjs:
lucide-react/dist/esm/icons/check.mjs:
lucide-react/dist/esm/icons/chevron-down.mjs:
lucide-react/dist/esm/icons/chevron-right.mjs:
lucide-react/dist/esm/icons/circle-check.mjs:
lucide-react/dist/esm/icons/circle.mjs:
lucide-react/dist/esm/icons/clipboard-paste.mjs:
lucide-react/dist/esm/icons/clock.mjs:
lucide-react/dist/esm/icons/cloud-off.mjs:
lucide-react/dist/esm/icons/cloud-upload.mjs:
lucide-react/dist/esm/icons/copy-plus.mjs:
lucide-react/dist/esm/icons/copy.mjs:
lucide-react/dist/esm/icons/external-link.mjs:
lucide-react/dist/esm/icons/file-braces.mjs:
lucide-react/dist/esm/icons/file-code-corner.mjs:
lucide-react/dist/esm/icons/file-text.mjs:
lucide-react/dist/esm/icons/folder-open.mjs:
lucide-react/dist/esm/icons/folder.mjs:
lucide-react/dist/esm/icons/globe.mjs:
lucide-react/dist/esm/icons/grip-vertical.mjs:
lucide-react/dist/esm/icons/key-round.mjs:
lucide-react/dist/esm/icons/key.mjs:
lucide-react/dist/esm/icons/layers.mjs:
lucide-react/dist/esm/icons/link-2.mjs:
lucide-react/dist/esm/icons/lock-open.mjs:
lucide-react/dist/esm/icons/lock.mjs:
lucide-react/dist/esm/icons/mail.mjs:
lucide-react/dist/esm/icons/maximize-2.mjs:
lucide-react/dist/esm/icons/message-square-warning.mjs:
lucide-react/dist/esm/icons/minus.mjs:
lucide-react/dist/esm/icons/mouse-pointer-click.mjs:
lucide-react/dist/esm/icons/palette.mjs:
lucide-react/dist/esm/icons/pencil.mjs:
lucide-react/dist/esm/icons/pipette.mjs:
lucide-react/dist/esm/icons/plus.mjs:
lucide-react/dist/esm/icons/refresh-cw.mjs:
lucide-react/dist/esm/icons/repeat.mjs:
lucide-react/dist/esm/icons/rotate-ccw.mjs:
lucide-react/dist/esm/icons/rows-3.mjs:
lucide-react/dist/esm/icons/save.mjs:
lucide-react/dist/esm/icons/search.mjs:
lucide-react/dist/esm/icons/split.mjs:
lucide-react/dist/esm/icons/terminal.mjs:
lucide-react/dist/esm/icons/trash-2.mjs:
lucide-react/dist/esm/icons/triangle-alert.mjs:
lucide-react/dist/esm/icons/undo-2.mjs:
lucide-react/dist/esm/icons/user.mjs:
lucide-react/dist/esm/icons/users.mjs:
lucide-react/dist/esm/icons/x.mjs:
lucide-react/dist/esm/icons/zap.mjs:
lucide-react/dist/esm/lucide-react.mjs:
  (**
   * @license lucide-react v1.31.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)
*/
