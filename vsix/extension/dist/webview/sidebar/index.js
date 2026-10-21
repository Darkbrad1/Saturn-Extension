/*
 * sonover-code — the Sonover sidebar (React): sign-in, instances, account, AI skills and an embedded agent chat.
 *
 * Shipped by the original 0.1.1 build as a minified esbuild bundle; made readable here:
 * formatted, the app code's variables named and commented, icons named after themselves.
 * Library code (React, lucide-react, tailwind-merge, …) is marked by "──── Library: … ────"
 * comments and left as it was, names minified; "──── App: … ────" starts this extension's code.
 * build.mjs minifies this file into the package; package.sh proves (tools/same-code.mjs) that
 * the minified file is the same program. Rename with tools/rename.mjs, not by hand.
 */
// ──── Library: esbuild runtime helpers (bundled from npm; unchanged, names left minified) ────
var sk = Object.create;
var qc = Object.defineProperty;
var ck = Object.getOwnPropertyDescriptor;
var fk = Object.getOwnPropertyNames;
var dk = Object.getPrototypeOf,
  pk = Object.prototype.hasOwnProperty;
var Bt = (e, t) => () => {
    try {
      return t || e((t = {
        exports: {}
      }).exports, t), t.exports;
    } catch (a) {
      throw t = 0, a;
    }
  },
  hh = (e, t) => {
    for (var a in t) qc(e, a, {
      get: t[a],
      enumerable: !0
    });
  },
  mk = (e, t, a, n) => {
    if (t && typeof t == "object" || typeof t == "function") for (let r of fk(t)) !pk.call(e, r) && r !== a && qc(e, r, {
      get: () => t[r],
      enumerable: !(n = ck(t, r)) || n.enumerable
    });
    return e;
  };
var G = (e, t, a) => (a = e != null ? sk(dk(e)) : {}, mk(t || !e || !e.__esModule ? qc(a, "default", {
  value: e,
  enumerable: !0
}) : a, e));
// ──── Library: scheduler, react, react-dom, react-dom/client, react/jsx-runtime (production builds) (bundled from npm; unchanged, names left minified) ────
var Ch = Bt(He => {
  "use strict";

  function Gc(e, t) {
    var a = e.length;
    e.push(t);
    e: for (; 0 < a;) {
      var n = a - 1 >>> 1,
        r = e[n];
      if (0 < su(r, t)) e[n] = t, e[a] = r, a = n;else break e;
    }
  }
  function Ma(e) {
    return e.length === 0 ? null : e[0];
  }
  function fu(e) {
    if (e.length === 0) return null;
    var t = e[0],
      a = e.pop();
    if (a !== t) {
      e[0] = a;
      e: for (var n = 0, r = e.length, l = r >>> 1; n < l;) {
        var o = 2 * (n + 1) - 1,
          i = e[o],
          u = o + 1,
          s = e[u];
        if (0 > su(i, a)) u < r && 0 > su(s, i) ? (e[n] = s, e[u] = a, n = u) : (e[n] = i, e[o] = a, n = o);else if (u < r && 0 > su(s, a)) e[n] = s, e[u] = a, n = u;else break e;
      }
    }
    return t;
  }
  function su(e, t) {
    var a = e.sortIndex - t.sortIndex;
    return a !== 0 ? a : e.id - t.id;
  }
  He.unstable_now = void 0;
  typeof performance == "object" && typeof performance.now == "function" ? (gh = performance, He.unstable_now = function () {
    return gh.now();
  }) : (Fc = Date, xh = Fc.now(), He.unstable_now = function () {
    return Fc.now() - xh;
  });
  var gh,
    Fc,
    xh,
    Ga = [],
    vn = [],
    hk = 1,
    oa = null,
    At = 3,
    Vc = !1,
    ho = !1,
    go = !1,
    Xc = !1,
    vh = typeof setTimeout == "function" ? setTimeout : null,
    Lh = typeof clearTimeout == "function" ? clearTimeout : null,
    yh = typeof setImmediate < "u" ? setImmediate : null;
  function cu(e) {
    for (var t = Ma(vn); t !== null;) {
      if (t.callback === null) fu(vn);else if (t.startTime <= e) fu(vn), t.sortIndex = t.expirationTime, Gc(Ga, t);else break;
      t = Ma(vn);
    }
  }
  function jc(e) {
    if (go = !1, cu(e), !ho) if (Ma(Ga) !== null) ho = !0, el || (el = !0, $r());else {
      var t = Ma(vn);
      t !== null && Yc(jc, t.startTime - e);
    }
  }
  var el = !1,
    xo = -1,
    kh = 5,
    wh = -1;
  function Sh() {
    return Xc ? !0 : !(He.unstable_now() - wh < kh);
  }
  function Hc() {
    if (Xc = !1, el) {
      var e = He.unstable_now();
      wh = e;
      var t = !0;
      try {
        e: {
          ho = !1, go && (go = !1, Lh(xo), xo = -1), Vc = !0;
          var a = At;
          try {
            t: {
              for (cu(e), oa = Ma(Ga); oa !== null && !(oa.expirationTime > e && Sh());) {
                var n = oa.callback;
                if (typeof n == "function") {
                  oa.callback = null, At = oa.priorityLevel;
                  var r = n(oa.expirationTime <= e);
                  if (e = He.unstable_now(), typeof r == "function") {
                    oa.callback = r, cu(e), t = !0;
                    break t;
                  }
                  oa === Ma(Ga) && fu(Ga), cu(e);
                } else fu(Ga);
                oa = Ma(Ga);
              }
              if (oa !== null) t = !0;else {
                var l = Ma(vn);
                l !== null && Yc(jc, l.startTime - e), t = !1;
              }
            }
            break e;
          } finally {
            oa = null, At = a, Vc = !1;
          }
          t = void 0;
        }
      } finally {
        t ? $r() : el = !1;
      }
    }
  }
  var $r;
  typeof yh == "function" ? $r = function () {
    yh(Hc);
  } : typeof MessageChannel < "u" ? (_c = new MessageChannel(), bh = _c.port2, _c.port1.onmessage = Hc, $r = function () {
    bh.postMessage(null);
  }) : $r = function () {
    vh(Hc, 0);
  };
  var _c, bh;
  function Yc(e, t) {
    xo = vh(function () {
      e(He.unstable_now());
    }, t);
  }
  He.unstable_IdlePriority = 5;
  He.unstable_ImmediatePriority = 1;
  He.unstable_LowPriority = 4;
  He.unstable_NormalPriority = 3;
  He.unstable_Profiling = null;
  He.unstable_UserBlockingPriority = 2;
  He.unstable_cancelCallback = function (e) {
    e.callback = null;
  };
  He.unstable_forceFrameRate = function (e) {
    0 > e || 125 < e ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : kh = 0 < e ? Math.floor(1e3 / e) : 5;
  };
  He.unstable_getCurrentPriorityLevel = function () {
    return At;
  };
  He.unstable_next = function (e) {
    switch (At) {
      case 1:
      case 2:
      case 3:
        var t = 3;
        break;
      default:
        t = At;
    }
    var a = At;
    At = t;
    try {
      return e();
    } finally {
      At = a;
    }
  };
  He.unstable_requestPaint = function () {
    Xc = !0;
  };
  He.unstable_runWithPriority = function (e, t) {
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
    var a = At;
    At = e;
    try {
      return t();
    } finally {
      At = a;
    }
  };
  He.unstable_scheduleCallback = function (e, t, a) {
    var n = He.unstable_now();
    switch (typeof a == "object" && a !== null ? (a = a.delay, a = typeof a == "number" && 0 < a ? n + a : n) : a = n, e) {
      case 1:
        var r = -1;
        break;
      case 2:
        r = 250;
        break;
      case 5:
        r = 1073741823;
        break;
      case 4:
        r = 1e4;
        break;
      default:
        r = 5e3;
    }
    return r = a + r, e = {
      id: hk++,
      callback: t,
      priorityLevel: e,
      startTime: a,
      expirationTime: r,
      sortIndex: -1
    }, a > n ? (e.sortIndex = a, Gc(vn, e), Ma(Ga) === null && e === Ma(vn) && (go ? (Lh(xo), xo = -1) : go = !0, Yc(jc, a - n))) : (e.sortIndex = r, Gc(Ga, e), ho || Vc || (ho = !0, el || (el = !0, $r()))), e;
  };
  He.unstable_shouldYield = Sh;
  He.unstable_wrapCallback = function (e) {
    var t = At;
    return function () {
      var a = At;
      At = t;
      try {
        return e.apply(this, arguments);
      } finally {
        At = a;
      }
    };
  };
});
var Ah = Bt((XD, Ih) => {
  "use strict";

  Ih.exports = Ch();
});
var Uh = Bt(ae => {
  "use strict";

  var Kc = Symbol.for("react.transitional.element"),
    gk = Symbol.for("react.portal"),
    xk = Symbol.for("react.fragment"),
    yk = Symbol.for("react.strict_mode"),
    bk = Symbol.for("react.profiler"),
    vk = Symbol.for("react.consumer"),
    Lk = Symbol.for("react.context"),
    kk = Symbol.for("react.forward_ref"),
    wk = Symbol.for("react.suspense"),
    Sk = Symbol.for("react.memo"),
    Eh = Symbol.for("react.lazy"),
    Ck = Symbol.for("react.activity"),
    Th = Symbol.iterator;
  function Ik(e) {
    return e === null || typeof e != "object" ? null : (e = Th && e[Th] || e["@@iterator"], typeof e == "function" ? e : null);
  }
  var Rh = {
      isMounted: function () {
        return !1;
      },
      enqueueForceUpdate: function () {},
      enqueueReplaceState: function () {},
      enqueueSetState: function () {}
    },
    Nh = Object.assign,
    zh = {};
  function al(e, t, a) {
    this.props = e, this.context = t, this.refs = zh, this.updater = a || Rh;
  }
  al.prototype.isReactComponent = {};
  al.prototype.setState = function (e, t) {
    if (typeof e != "object" && typeof e != "function" && e != null) throw Error("takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, e, t, "setState");
  };
  al.prototype.forceUpdate = function (e) {
    this.updater.enqueueForceUpdate(this, e, "forceUpdate");
  };
  function Oh() {}
  Oh.prototype = al.prototype;
  function Wc(e, t, a) {
    this.props = e, this.context = t, this.refs = zh, this.updater = a || Rh;
  }
  var Jc = Wc.prototype = new Oh();
  Jc.constructor = Wc;
  Nh(Jc, al.prototype);
  Jc.isPureReactComponent = !0;
  var Mh = Array.isArray;
  function Zc() {}
  var Oe = {
      H: null,
      A: null,
      T: null,
      S: null
    },
    Ph = Object.prototype.hasOwnProperty;
  function $c(e, t, a) {
    var n = a.ref;
    return {
      $$typeof: Kc,
      type: e,
      key: t,
      ref: n !== void 0 ? n : null,
      props: a
    };
  }
  function Ak(e, t) {
    return $c(e.type, t, e.props);
  }
  function ef(e) {
    return typeof e == "object" && e !== null && e.$$typeof === Kc;
  }
  function Tk(e) {
    var t = {
      "=": "=0",
      ":": "=2"
    };
    return "$" + e.replace(/[=:]/g, function (a) {
      return t[a];
    });
  }
  var Dh = /\/+/g;
  function Qc(e, t) {
    return typeof e == "object" && e !== null && e.key != null ? Tk("" + e.key) : t.toString(36);
  }
  function Mk(e) {
    switch (e.status) {
      case "fulfilled":
        return e.value;
      case "rejected":
        throw e.reason;
      default:
        switch (typeof e.status == "string" ? e.then(Zc, Zc) : (e.status = "pending", e.then(function (t) {
          e.status === "pending" && (e.status = "fulfilled", e.value = t);
        }, function (t) {
          e.status === "pending" && (e.status = "rejected", e.reason = t);
        })), e.status) {
          case "fulfilled":
            return e.value;
          case "rejected":
            throw e.reason;
        }
    }
    throw e;
  }
  function tl(e, t, a, n, r) {
    var l = typeof e;
    (l === "undefined" || l === "boolean") && (e = null);
    var o = !1;
    if (e === null) o = !0;else switch (l) {
      case "bigint":
      case "string":
      case "number":
        o = !0;
        break;
      case "object":
        switch (e.$$typeof) {
          case Kc:
          case gk:
            o = !0;
            break;
          case Eh:
            return o = e._init, tl(o(e._payload), t, a, n, r);
        }
    }
    if (o) return r = r(e), o = n === "" ? "." + Qc(e, 0) : n, Mh(r) ? (a = "", o != null && (a = o.replace(Dh, "$&/") + "/"), tl(r, t, a, "", function (s) {
      return s;
    })) : r != null && (ef(r) && (r = Ak(r, a + (r.key == null || e && e.key === r.key ? "" : ("" + r.key).replace(Dh, "$&/") + "/") + o)), t.push(r)), 1;
    o = 0;
    var i = n === "" ? "." : n + ":";
    if (Mh(e)) for (var u = 0; u < e.length; u++) n = e[u], l = i + Qc(n, u), o += tl(n, t, a, l, r);else if (u = Ik(e), typeof u == "function") for (e = u.call(e), u = 0; !(n = e.next()).done;) n = n.value, l = i + Qc(n, u++), o += tl(n, t, a, l, r);else if (l === "object") {
      if (typeof e.then == "function") return tl(Mk(e), t, a, n, r);
      throw t = String(e), Error("Objects are not valid as a React child (found: " + (t === "[object Object]" ? "object with keys {" + Object.keys(e).join(", ") + "}" : t) + "). If you meant to render a collection of children, use an array instead.");
    }
    return o;
  }
  function du(e, t, a) {
    if (e == null) return e;
    var n = [],
      r = 0;
    return tl(e, n, "", "", function (l) {
      return t.call(a, l, r++);
    }), n;
  }
  function Dk(e) {
    if (e._status === -1) {
      var t = e._result;
      t = t(), t.then(function (a) {
        (e._status === 0 || e._status === -1) && (e._status = 1, e._result = a);
      }, function (a) {
        (e._status === 0 || e._status === -1) && (e._status = 2, e._result = a);
      }), e._status === -1 && (e._status = 0, e._result = t);
    }
    if (e._status === 1) return e._result.default;
    throw e._result;
  }
  var Bh = typeof reportError == "function" ? reportError : function (e) {
      if (typeof window == "object" && typeof window.ErrorEvent == "function") {
        var t = new window.ErrorEvent("error", {
          bubbles: !0,
          cancelable: !0,
          message: typeof e == "object" && e !== null && typeof e.message == "string" ? String(e.message) : String(e),
          error: e
        });
        if (!window.dispatchEvent(t)) return;
      } else if (typeof process == "object" && typeof process.emit == "function") {
        process.emit("uncaughtException", e);
        return;
      }
      console.error(e);
    },
    Bk = {
      map: du,
      forEach: function (e, t, a) {
        du(e, function () {
          t.apply(this, arguments);
        }, a);
      },
      count: function (e) {
        var t = 0;
        return du(e, function () {
          t++;
        }), t;
      },
      toArray: function (e) {
        return du(e, function (t) {
          return t;
        }) || [];
      },
      only: function (e) {
        if (!ef(e)) throw Error("React.Children.only expected to receive a single React element child.");
        return e;
      }
    };
  ae.Activity = Ck;
  ae.Children = Bk;
  ae.Component = al;
  ae.Fragment = xk;
  ae.Profiler = bk;
  ae.PureComponent = Wc;
  ae.StrictMode = yk;
  ae.Suspense = wk;
  ae.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = Oe;
  ae.__COMPILER_RUNTIME = {
    __proto__: null,
    c: function (e) {
      return Oe.H.useMemoCache(e);
    }
  };
  ae.cache = function (e) {
    return function () {
      return e.apply(null, arguments);
    };
  };
  ae.cacheSignal = function () {
    return null;
  };
  ae.cloneElement = function (e, t, a) {
    if (e == null) throw Error("The argument must be a React element, but you passed " + e + ".");
    var n = Nh({}, e.props),
      r = e.key;
    if (t != null) for (l in t.key !== void 0 && (r = "" + t.key), t) !Ph.call(t, l) || l === "key" || l === "__self" || l === "__source" || l === "ref" && t.ref === void 0 || (n[l] = t[l]);
    var l = arguments.length - 2;
    if (l === 1) n.children = a;else if (1 < l) {
      for (var o = Array(l), i = 0; i < l; i++) o[i] = arguments[i + 2];
      n.children = o;
    }
    return $c(e.type, r, n);
  };
  ae.createContext = function (e) {
    return e = {
      $$typeof: Lk,
      _currentValue: e,
      _currentValue2: e,
      _threadCount: 0,
      Provider: null,
      Consumer: null
    }, e.Provider = e, e.Consumer = {
      $$typeof: vk,
      _context: e
    }, e;
  };
  ae.createElement = function (e, t, a) {
    var n,
      r = {},
      l = null;
    if (t != null) for (n in t.key !== void 0 && (l = "" + t.key), t) Ph.call(t, n) && n !== "key" && n !== "__self" && n !== "__source" && (r[n] = t[n]);
    var o = arguments.length - 2;
    if (o === 1) r.children = a;else if (1 < o) {
      for (var i = Array(o), u = 0; u < o; u++) i[u] = arguments[u + 2];
      r.children = i;
    }
    if (e && e.defaultProps) for (n in o = e.defaultProps, o) r[n] === void 0 && (r[n] = o[n]);
    return $c(e, l, r);
  };
  ae.createRef = function () {
    return {
      current: null
    };
  };
  ae.forwardRef = function (e) {
    return {
      $$typeof: kk,
      render: e
    };
  };
  ae.isValidElement = ef;
  ae.lazy = function (e) {
    return {
      $$typeof: Eh,
      _payload: {
        _status: -1,
        _result: e
      },
      _init: Dk
    };
  };
  ae.memo = function (e, t) {
    return {
      $$typeof: Sk,
      type: e,
      compare: t === void 0 ? null : t
    };
  };
  ae.startTransition = function (e) {
    var t = Oe.T,
      a = {};
    Oe.T = a;
    try {
      var n = e(),
        r = Oe.S;
      r !== null && r(a, n), typeof n == "object" && n !== null && typeof n.then == "function" && n.then(Zc, Bh);
    } catch (l) {
      Bh(l);
    } finally {
      t !== null && a.types !== null && (t.types = a.types), Oe.T = t;
    }
  };
  ae.unstable_useCacheRefresh = function () {
    return Oe.H.useCacheRefresh();
  };
  ae.use = function (e) {
    return Oe.H.use(e);
  };
  ae.useActionState = function (e, t, a) {
    return Oe.H.useActionState(e, t, a);
  };
  ae.useCallback = function (e, t) {
    return Oe.H.useCallback(e, t);
  };
  ae.useContext = function (e) {
    return Oe.H.useContext(e);
  };
  ae.useDebugValue = function () {};
  ae.useDeferredValue = function (e, t) {
    return Oe.H.useDeferredValue(e, t);
  };
  ae.useEffect = function (e, t) {
    return Oe.H.useEffect(e, t);
  };
  ae.useEffectEvent = function (e) {
    return Oe.H.useEffectEvent(e);
  };
  ae.useId = function () {
    return Oe.H.useId();
  };
  ae.useImperativeHandle = function (e, t, a) {
    return Oe.H.useImperativeHandle(e, t, a);
  };
  ae.useInsertionEffect = function (e, t) {
    return Oe.H.useInsertionEffect(e, t);
  };
  ae.useLayoutEffect = function (e, t) {
    return Oe.H.useLayoutEffect(e, t);
  };
  ae.useMemo = function (e, t) {
    return Oe.H.useMemo(e, t);
  };
  ae.useOptimistic = function (e, t) {
    return Oe.H.useOptimistic(e, t);
  };
  ae.useReducer = function (e, t, a) {
    return Oe.H.useReducer(e, t, a);
  };
  ae.useRef = function (e) {
    return Oe.H.useRef(e);
  };
  ae.useState = function (e) {
    return Oe.H.useState(e);
  };
  ae.useSyncExternalStore = function (e, t, a) {
    return Oe.H.useSyncExternalStore(e, t, a);
  };
  ae.useTransition = function () {
    return Oe.H.useTransition();
  };
  ae.version = "19.2.8";
});
var _e = Bt((YD, qh) => {
  "use strict";

  qh.exports = Uh();
});
var Hh = Bt(Rt => {
  "use strict";

  var Ek = _e();
  function Fh(e) {
    var t = "https://react.dev/errors/" + e;
    if (1 < arguments.length) {
      t += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var a = 2; a < arguments.length; a++) t += "&args[]=" + encodeURIComponent(arguments[a]);
    }
    return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function Ln() {}
  var Et = {
      d: {
        f: Ln,
        r: function () {
          throw Error(Fh(522));
        },
        D: Ln,
        C: Ln,
        L: Ln,
        m: Ln,
        X: Ln,
        S: Ln,
        M: Ln
      },
      p: 0,
      findDOMNode: null
    },
    Rk = Symbol.for("react.portal");
  function Nk(e, t, a) {
    var n = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: Rk,
      key: n == null ? null : "" + n,
      children: e,
      containerInfo: t,
      implementation: a
    };
  }
  var yo = Ek.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function pu(e, t) {
    if (e === "font") return "";
    if (typeof t == "string") return t === "use-credentials" ? t : "";
  }
  Rt.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = Et;
  Rt.createPortal = function (e, t) {
    var a = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!t || t.nodeType !== 1 && t.nodeType !== 9 && t.nodeType !== 11) throw Error(Fh(299));
    return Nk(e, t, null, a);
  };
  Rt.flushSync = function (e) {
    var t = yo.T,
      a = Et.p;
    try {
      if (yo.T = null, Et.p = 2, e) return e();
    } finally {
      yo.T = t, Et.p = a, Et.d.f();
    }
  };
  Rt.preconnect = function (e, t) {
    typeof e == "string" && (t ? (t = t.crossOrigin, t = typeof t == "string" ? t === "use-credentials" ? t : "" : void 0) : t = null, Et.d.C(e, t));
  };
  Rt.prefetchDNS = function (e) {
    typeof e == "string" && Et.d.D(e);
  };
  Rt.preinit = function (e, t) {
    if (typeof e == "string" && t && typeof t.as == "string") {
      var a = t.as,
        n = pu(a, t.crossOrigin),
        r = typeof t.integrity == "string" ? t.integrity : void 0,
        l = typeof t.fetchPriority == "string" ? t.fetchPriority : void 0;
      a === "style" ? Et.d.S(e, typeof t.precedence == "string" ? t.precedence : void 0, {
        crossOrigin: n,
        integrity: r,
        fetchPriority: l
      }) : a === "script" && Et.d.X(e, {
        crossOrigin: n,
        integrity: r,
        fetchPriority: l,
        nonce: typeof t.nonce == "string" ? t.nonce : void 0
      });
    }
  };
  Rt.preinitModule = function (e, t) {
    if (typeof e == "string") if (typeof t == "object" && t !== null) {
      if (t.as == null || t.as === "script") {
        var a = pu(t.as, t.crossOrigin);
        Et.d.M(e, {
          crossOrigin: a,
          integrity: typeof t.integrity == "string" ? t.integrity : void 0,
          nonce: typeof t.nonce == "string" ? t.nonce : void 0
        });
      }
    } else t == null && Et.d.M(e);
  };
  Rt.preload = function (e, t) {
    if (typeof e == "string" && typeof t == "object" && t !== null && typeof t.as == "string") {
      var a = t.as,
        n = pu(a, t.crossOrigin);
      Et.d.L(e, a, {
        crossOrigin: n,
        integrity: typeof t.integrity == "string" ? t.integrity : void 0,
        nonce: typeof t.nonce == "string" ? t.nonce : void 0,
        type: typeof t.type == "string" ? t.type : void 0,
        fetchPriority: typeof t.fetchPriority == "string" ? t.fetchPriority : void 0,
        referrerPolicy: typeof t.referrerPolicy == "string" ? t.referrerPolicy : void 0,
        imageSrcSet: typeof t.imageSrcSet == "string" ? t.imageSrcSet : void 0,
        imageSizes: typeof t.imageSizes == "string" ? t.imageSizes : void 0,
        media: typeof t.media == "string" ? t.media : void 0
      });
    }
  };
  Rt.preloadModule = function (e, t) {
    if (typeof e == "string") if (t) {
      var a = pu(t.as, t.crossOrigin);
      Et.d.m(e, {
        as: typeof t.as == "string" && t.as !== "script" ? t.as : void 0,
        crossOrigin: a,
        integrity: typeof t.integrity == "string" ? t.integrity : void 0
      });
    } else Et.d.m(e);
  };
  Rt.requestFormReset = function (e) {
    Et.d.r(e);
  };
  Rt.unstable_batchedUpdates = function (e, t) {
    return e(t);
  };
  Rt.useFormState = function (e, t, a) {
    return yo.H.useFormState(e, t, a);
  };
  Rt.useFormStatus = function () {
    return yo.H.useHostTransitionStatus();
  };
  Rt.version = "19.2.8";
});
var Vh = Bt((ZD, Gh) => {
  "use strict";

  function _h() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function")) try {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(_h);
    } catch (e) {
      console.error(e);
    }
  }
  _h(), Gh.exports = Hh();
});
var av = Bt(Us => {
  "use strict";

  var dt = Ah(),
    gx = _e(),
    zk = Vh();
  function B(e) {
    var t = "https://react.dev/errors/" + e;
    if (1 < arguments.length) {
      t += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var a = 2; a < arguments.length; a++) t += "&args[]=" + encodeURIComponent(arguments[a]);
    }
    return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function xx(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
  }
  function ri(e) {
    var t = e,
      a = e;
    if (e.alternate) for (; t.return;) t = t.return;else {
      e = t;
      do t = e, (t.flags & 4098) !== 0 && (a = t.return), e = t.return; while (e);
    }
    return t.tag === 3 ? a : null;
  }
  function yx(e) {
    if (e.tag === 13) {
      var t = e.memoizedState;
      if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function bx(e) {
    if (e.tag === 31) {
      var t = e.memoizedState;
      if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function Xh(e) {
    if (ri(e) !== e) throw Error(B(188));
  }
  function Ok(e) {
    var t = e.alternate;
    if (!t) {
      if (t = ri(e), t === null) throw Error(B(188));
      return t !== e ? null : e;
    }
    for (var a = e, n = t;;) {
      var r = a.return;
      if (r === null) break;
      var l = r.alternate;
      if (l === null) {
        if (n = r.return, n !== null) {
          a = n;
          continue;
        }
        break;
      }
      if (r.child === l.child) {
        for (l = r.child; l;) {
          if (l === a) return Xh(r), e;
          if (l === n) return Xh(r), t;
          l = l.sibling;
        }
        throw Error(B(188));
      }
      if (a.return !== n.return) a = r, n = l;else {
        for (var o = !1, i = r.child; i;) {
          if (i === a) {
            o = !0, a = r, n = l;
            break;
          }
          if (i === n) {
            o = !0, n = r, a = l;
            break;
          }
          i = i.sibling;
        }
        if (!o) {
          for (i = l.child; i;) {
            if (i === a) {
              o = !0, a = l, n = r;
              break;
            }
            if (i === n) {
              o = !0, n = l, a = r;
              break;
            }
            i = i.sibling;
          }
          if (!o) throw Error(B(189));
        }
      }
      if (a.alternate !== n) throw Error(B(190));
    }
    if (a.tag !== 3) throw Error(B(188));
    return a.stateNode.current === a ? e : t;
  }
  function vx(e) {
    var t = e.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return e;
    for (e = e.child; e !== null;) {
      if (t = vx(e), t !== null) return t;
      e = e.sibling;
    }
    return null;
  }
  var qe = Object.assign,
    Pk = Symbol.for("react.element"),
    mu = Symbol.for("react.transitional.element"),
    Io = Symbol.for("react.portal"),
    ul = Symbol.for("react.fragment"),
    Lx = Symbol.for("react.strict_mode"),
    zf = Symbol.for("react.profiler"),
    kx = Symbol.for("react.consumer"),
    Wa = Symbol.for("react.context"),
    Dd = Symbol.for("react.forward_ref"),
    Of = Symbol.for("react.suspense"),
    Pf = Symbol.for("react.suspense_list"),
    Bd = Symbol.for("react.memo"),
    kn = Symbol.for("react.lazy"),
    Uf = Symbol.for("react.activity"),
    Uk = Symbol.for("react.memo_cache_sentinel"),
    jh = Symbol.iterator;
  function bo(e) {
    return e === null || typeof e != "object" ? null : (e = jh && e[jh] || e["@@iterator"], typeof e == "function" ? e : null);
  }
  var qk = Symbol.for("react.client.reference");
  function qf(e) {
    if (e == null) return null;
    if (typeof e == "function") return e.$$typeof === qk ? null : e.displayName || e.name || null;
    if (typeof e == "string") return e;
    switch (e) {
      case ul:
        return "Fragment";
      case zf:
        return "Profiler";
      case Lx:
        return "StrictMode";
      case Of:
        return "Suspense";
      case Pf:
        return "SuspenseList";
      case Uf:
        return "Activity";
    }
    if (typeof e == "object") switch (e.$$typeof) {
      case Io:
        return "Portal";
      case Wa:
        return e.displayName || "Context";
      case kx:
        return (e._context.displayName || "Context") + ".Consumer";
      case Dd:
        var t = e.render;
        return e = e.displayName, e || (e = t.displayName || t.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
      case Bd:
        return t = e.displayName || null, t !== null ? t : qf(e.type) || "Memo";
      case kn:
        t = e._payload, e = e._init;
        try {
          return qf(e(t));
        } catch {}
    }
    return null;
  }
  var Ao = Array.isArray,
    ee = gx.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
    ve = zk.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
    pr = {
      pending: !1,
      data: null,
      method: null,
      action: null
    },
    Ff = [],
    sl = -1;
  function Na(e) {
    return {
      current: e
    };
  }
  function xt(e) {
    0 > sl || (e.current = Ff[sl], Ff[sl] = null, sl--);
  }
  function Ne(e, t) {
    sl++, Ff[sl] = e.current, e.current = t;
  }
  var Ra = Na(null),
    Vo = Na(null),
    Rn = Na(null),
    Yu = Na(null);
  function Qu(e, t) {
    switch (Ne(Rn, t), Ne(Vo, e), Ne(Ra, null), t.nodeType) {
      case 9:
      case 11:
        e = (e = t.documentElement) && (e = e.namespaceURI) ? $g(e) : 0;
        break;
      default:
        if (e = t.tagName, t = t.namespaceURI) t = $g(t), e = _b(t, e);else switch (e) {
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
    xt(Ra), Ne(Ra, e);
  }
  function Al() {
    xt(Ra), xt(Vo), xt(Rn);
  }
  function Hf(e) {
    e.memoizedState !== null && Ne(Yu, e);
    var t = Ra.current,
      a = _b(t, e.type);
    t !== a && (Ne(Vo, e), Ne(Ra, a));
  }
  function Zu(e) {
    Vo.current === e && (xt(Ra), xt(Vo)), Yu.current === e && (xt(Yu), ti._currentValue = pr);
  }
  var tf, Yh;
  function sr(e) {
    if (tf === void 0) try {
      throw Error();
    } catch (a) {
      var t = a.stack.trim().match(/\n( *(at )?)/);
      tf = t && t[1] || "", Yh = -1 < a.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < a.stack.indexOf("@") ? "@unknown:0:0" : "";
    }
    return `
` + tf + e + Yh;
  }
  var af = !1;
  function nf(e, t) {
    if (!e || af) return "";
    af = !0;
    var a = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      var n = {
        DetermineComponentFrameRoot: function () {
          try {
            if (t) {
              var f = function () {
                throw Error();
              };
              if (Object.defineProperty(f.prototype, "props", {
                set: function () {
                  throw Error();
                }
              }), typeof Reflect == "object" && Reflect.construct) {
                try {
                  Reflect.construct(f, []);
                } catch (p) {
                  var d = p;
                }
                Reflect.construct(e, [], f);
              } else {
                try {
                  f.call();
                } catch (p) {
                  d = p;
                }
                e.call(f.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (p) {
                d = p;
              }
              (f = e()) && typeof f.catch == "function" && f.catch(function () {});
            }
          } catch (p) {
            if (p && d && typeof p.stack == "string") return [p.stack, d.stack];
          }
          return [null, null];
        }
      };
      n.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
      var r = Object.getOwnPropertyDescriptor(n.DetermineComponentFrameRoot, "name");
      r && r.configurable && Object.defineProperty(n.DetermineComponentFrameRoot, "name", {
        value: "DetermineComponentFrameRoot"
      });
      var l = n.DetermineComponentFrameRoot(),
        o = l[0],
        i = l[1];
      if (o && i) {
        var u = o.split(`
`),
          s = i.split(`
`);
        for (r = n = 0; n < u.length && !u[n].includes("DetermineComponentFrameRoot");) n++;
        for (; r < s.length && !s[r].includes("DetermineComponentFrameRoot");) r++;
        if (n === u.length || r === s.length) for (n = u.length - 1, r = s.length - 1; 1 <= n && 0 <= r && u[n] !== s[r];) r--;
        for (; 1 <= n && 0 <= r; n--, r--) if (u[n] !== s[r]) {
          if (n !== 1 || r !== 1) do if (n--, r--, 0 > r || u[n] !== s[r]) {
            var c = `
` + u[n].replace(" at new ", " at ");
            return e.displayName && c.includes("<anonymous>") && (c = c.replace("<anonymous>", e.displayName)), c;
          } while (1 <= n && 0 <= r);
          break;
        }
      }
    } finally {
      af = !1, Error.prepareStackTrace = a;
    }
    return (a = e ? e.displayName || e.name : "") ? sr(a) : "";
  }
  function Fk(e, t) {
    switch (e.tag) {
      case 26:
      case 27:
      case 5:
        return sr(e.type);
      case 16:
        return sr("Lazy");
      case 13:
        return e.child !== t && t !== null ? sr("Suspense Fallback") : sr("Suspense");
      case 19:
        return sr("SuspenseList");
      case 0:
      case 15:
        return nf(e.type, !1);
      case 11:
        return nf(e.type.render, !1);
      case 1:
        return nf(e.type, !0);
      case 31:
        return sr("Activity");
      default:
        return "";
    }
  }
  function Qh(e) {
    try {
      var t = "",
        a = null;
      do t += Fk(e, a), a = e, e = e.return; while (e);
      return t;
    } catch (n) {
      return `
Error generating stack: ` + n.message + `
` + n.stack;
    }
  }
  var _f = Object.prototype.hasOwnProperty,
    Ed = dt.unstable_scheduleCallback,
    rf = dt.unstable_cancelCallback,
    Hk = dt.unstable_shouldYield,
    _k = dt.unstable_requestPaint,
    $t = dt.unstable_now,
    Gk = dt.unstable_getCurrentPriorityLevel,
    wx = dt.unstable_ImmediatePriority,
    Sx = dt.unstable_UserBlockingPriority,
    Ku = dt.unstable_NormalPriority,
    Vk = dt.unstable_LowPriority,
    Cx = dt.unstable_IdlePriority,
    Xk = dt.log,
    jk = dt.unstable_setDisableYieldValue,
    li = null,
    ea = null;
  function Tn(e) {
    if (typeof Xk == "function" && jk(e), ea && typeof ea.setStrictMode == "function") try {
      ea.setStrictMode(li, e);
    } catch {}
  }
  var ta = Math.clz32 ? Math.clz32 : Zk,
    Yk = Math.log,
    Qk = Math.LN2;
  function Zk(e) {
    return e >>>= 0, e === 0 ? 32 : 31 - (Yk(e) / Qk | 0) | 0;
  }
  var hu = 256,
    gu = 262144,
    xu = 4194304;
  function cr(e) {
    var t = e & 42;
    if (t !== 0) return t;
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
  function ks(e, t, a) {
    var n = e.pendingLanes;
    if (n === 0) return 0;
    var r = 0,
      l = e.suspendedLanes,
      o = e.pingedLanes;
    e = e.warmLanes;
    var i = n & 134217727;
    return i !== 0 ? (n = i & ~l, n !== 0 ? r = cr(n) : (o &= i, o !== 0 ? r = cr(o) : a || (a = i & ~e, a !== 0 && (r = cr(a))))) : (i = n & ~l, i !== 0 ? r = cr(i) : o !== 0 ? r = cr(o) : a || (a = n & ~e, a !== 0 && (r = cr(a)))), r === 0 ? 0 : t !== 0 && t !== r && (t & l) === 0 && (l = r & -r, a = t & -t, l >= a || l === 32 && (a & 4194048) !== 0) ? t : r;
  }
  function oi(e, t) {
    return (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t) === 0;
  }
  function Kk(e, t) {
    switch (e) {
      case 1:
      case 2:
      case 4:
      case 8:
      case 64:
        return t + 250;
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
        return t + 5e3;
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
  function Ix() {
    var e = xu;
    return xu <<= 1, (xu & 62914560) === 0 && (xu = 4194304), e;
  }
  function lf(e) {
    for (var t = [], a = 0; 31 > a; a++) t.push(e);
    return t;
  }
  function ii(e, t) {
    e.pendingLanes |= t, t !== 268435456 && (e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0);
  }
  function Wk(e, t, a, n, r, l) {
    var o = e.pendingLanes;
    e.pendingLanes = a, e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0, e.expiredLanes &= a, e.entangledLanes &= a, e.errorRecoveryDisabledLanes &= a, e.shellSuspendCounter = 0;
    var i = e.entanglements,
      u = e.expirationTimes,
      s = e.hiddenUpdates;
    for (a = o & ~a; 0 < a;) {
      var c = 31 - ta(a),
        f = 1 << c;
      i[c] = 0, u[c] = -1;
      var d = s[c];
      if (d !== null) for (s[c] = null, c = 0; c < d.length; c++) {
        var p = d[c];
        p !== null && (p.lane &= -536870913);
      }
      a &= ~f;
    }
    n !== 0 && Ax(e, n, 0), l !== 0 && r === 0 && e.tag !== 0 && (e.suspendedLanes |= l & ~(o & ~t));
  }
  function Ax(e, t, a) {
    e.pendingLanes |= t, e.suspendedLanes &= ~t;
    var n = 31 - ta(t);
    e.entangledLanes |= t, e.entanglements[n] = e.entanglements[n] | 1073741824 | a & 261930;
  }
  function Tx(e, t) {
    var a = e.entangledLanes |= t;
    for (e = e.entanglements; a;) {
      var n = 31 - ta(a),
        r = 1 << n;
      r & t | e[n] & t && (e[n] |= t), a &= ~r;
    }
  }
  function Mx(e, t) {
    var a = t & -t;
    return a = (a & 42) !== 0 ? 1 : Rd(a), (a & (e.suspendedLanes | t)) !== 0 ? 0 : a;
  }
  function Rd(e) {
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
  function Nd(e) {
    return e &= -e, 2 < e ? 8 < e ? (e & 134217727) !== 0 ? 32 : 268435456 : 8 : 2;
  }
  function Dx() {
    var e = ve.p;
    return e !== 0 ? e : (e = window.event, e === void 0 ? 32 : $b(e.type));
  }
  function Zh(e, t) {
    var a = ve.p;
    try {
      return ve.p = e, t();
    } finally {
      ve.p = a;
    }
  }
  var jn = Math.random().toString(36).slice(2),
    kt = "__reactFiber$" + jn,
    _t = "__reactProps$" + jn,
    Ul = "__reactContainer$" + jn,
    Gf = "__reactEvents$" + jn,
    Jk = "__reactListeners$" + jn,
    $k = "__reactHandles$" + jn,
    Kh = "__reactResources$" + jn,
    ui = "__reactMarker$" + jn;
  function zd(e) {
    delete e[kt], delete e[_t], delete e[Gf], delete e[Jk], delete e[$k];
  }
  function cl(e) {
    var t = e[kt];
    if (t) return t;
    for (var a = e.parentNode; a;) {
      if (t = a[Ul] || a[kt]) {
        if (a = t.alternate, t.child !== null || a !== null && a.child !== null) for (e = rx(e); e !== null;) {
          if (a = e[kt]) return a;
          e = rx(e);
        }
        return t;
      }
      e = a, a = e.parentNode;
    }
    return null;
  }
  function ql(e) {
    if (e = e[kt] || e[Ul]) {
      var t = e.tag;
      if (t === 5 || t === 6 || t === 13 || t === 31 || t === 26 || t === 27 || t === 3) return e;
    }
    return null;
  }
  function To(e) {
    var t = e.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return e.stateNode;
    throw Error(B(33));
  }
  function vl(e) {
    var t = e[Kh];
    return t || (t = e[Kh] = {
      hoistableStyles: new Map(),
      hoistableScripts: new Map()
    }), t;
  }
  function gt(e) {
    e[ui] = !0;
  }
  var Bx = new Set(),
    Ex = {};
  function wr(e, t) {
    Tl(e, t), Tl(e + "Capture", t);
  }
  function Tl(e, t) {
    for (Ex[e] = t, e = 0; e < t.length; e++) Bx.add(t[e]);
  }
  var ew = RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"),
    Wh = {},
    Jh = {};
  function tw(e) {
    return _f.call(Jh, e) ? !0 : _f.call(Wh, e) ? !1 : ew.test(e) ? Jh[e] = !0 : (Wh[e] = !0, !1);
  }
  function Eu(e, t, a) {
    if (tw(t)) if (a === null) e.removeAttribute(t);else {
      switch (typeof a) {
        case "undefined":
        case "function":
        case "symbol":
          e.removeAttribute(t);
          return;
        case "boolean":
          var n = t.toLowerCase().slice(0, 5);
          if (n !== "data-" && n !== "aria-") {
            e.removeAttribute(t);
            return;
          }
      }
      e.setAttribute(t, "" + a);
    }
  }
  function yu(e, t, a) {
    if (a === null) e.removeAttribute(t);else {
      switch (typeof a) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          e.removeAttribute(t);
          return;
      }
      e.setAttribute(t, "" + a);
    }
  }
  function Va(e, t, a, n) {
    if (n === null) e.removeAttribute(a);else {
      switch (typeof n) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          e.removeAttribute(a);
          return;
      }
      e.setAttributeNS(t, a, "" + n);
    }
  }
  function ua(e) {
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
  function Rx(e) {
    var t = e.type;
    return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
  }
  function aw(e, t, a) {
    var n = Object.getOwnPropertyDescriptor(e.constructor.prototype, t);
    if (!e.hasOwnProperty(t) && typeof n < "u" && typeof n.get == "function" && typeof n.set == "function") {
      var r = n.get,
        l = n.set;
      return Object.defineProperty(e, t, {
        configurable: !0,
        get: function () {
          return r.call(this);
        },
        set: function (o) {
          a = "" + o, l.call(this, o);
        }
      }), Object.defineProperty(e, t, {
        enumerable: n.enumerable
      }), {
        getValue: function () {
          return a;
        },
        setValue: function (o) {
          a = "" + o;
        },
        stopTracking: function () {
          e._valueTracker = null, delete e[t];
        }
      };
    }
  }
  function Vf(e) {
    if (!e._valueTracker) {
      var t = Rx(e) ? "checked" : "value";
      e._valueTracker = aw(e, t, "" + e[t]);
    }
  }
  function Nx(e) {
    if (!e) return !1;
    var t = e._valueTracker;
    if (!t) return !0;
    var a = t.getValue(),
      n = "";
    return e && (n = Rx(e) ? e.checked ? "true" : "false" : e.value), e = n, e !== a ? (t.setValue(e), !0) : !1;
  }
  function Wu(e) {
    if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u") return null;
    try {
      return e.activeElement || e.body;
    } catch {
      return e.body;
    }
  }
  var nw = /[\n"\\]/g;
  function fa(e) {
    return e.replace(nw, function (t) {
      return "\\" + t.charCodeAt(0).toString(16) + " ";
    });
  }
  function Xf(e, t, a, n, r, l, o, i) {
    e.name = "", o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean" ? e.type = o : e.removeAttribute("type"), t != null ? o === "number" ? (t === 0 && e.value === "" || e.value != t) && (e.value = "" + ua(t)) : e.value !== "" + ua(t) && (e.value = "" + ua(t)) : o !== "submit" && o !== "reset" || e.removeAttribute("value"), t != null ? jf(e, o, ua(t)) : a != null ? jf(e, o, ua(a)) : n != null && e.removeAttribute("value"), r == null && l != null && (e.defaultChecked = !!l), r != null && (e.checked = r && typeof r != "function" && typeof r != "symbol"), i != null && typeof i != "function" && typeof i != "symbol" && typeof i != "boolean" ? e.name = "" + ua(i) : e.removeAttribute("name");
  }
  function zx(e, t, a, n, r, l, o, i) {
    if (l != null && typeof l != "function" && typeof l != "symbol" && typeof l != "boolean" && (e.type = l), t != null || a != null) {
      if (!(l !== "submit" && l !== "reset" || t != null)) {
        Vf(e);
        return;
      }
      a = a != null ? "" + ua(a) : "", t = t != null ? "" + ua(t) : a, i || t === e.value || (e.value = t), e.defaultValue = t;
    }
    n = n ?? r, n = typeof n != "function" && typeof n != "symbol" && !!n, e.checked = i ? e.checked : !!n, e.defaultChecked = !!n, o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean" && (e.name = o), Vf(e);
  }
  function jf(e, t, a) {
    t === "number" && Wu(e.ownerDocument) === e || e.defaultValue === "" + a || (e.defaultValue = "" + a);
  }
  function Ll(e, t, a, n) {
    if (e = e.options, t) {
      t = {};
      for (var r = 0; r < a.length; r++) t["$" + a[r]] = !0;
      for (a = 0; a < e.length; a++) r = t.hasOwnProperty("$" + e[a].value), e[a].selected !== r && (e[a].selected = r), r && n && (e[a].defaultSelected = !0);
    } else {
      for (a = "" + ua(a), t = null, r = 0; r < e.length; r++) {
        if (e[r].value === a) {
          e[r].selected = !0, n && (e[r].defaultSelected = !0);
          return;
        }
        t !== null || e[r].disabled || (t = e[r]);
      }
      t !== null && (t.selected = !0);
    }
  }
  function Ox(e, t, a) {
    if (t != null && (t = "" + ua(t), t !== e.value && (e.value = t), a == null)) {
      e.defaultValue !== t && (e.defaultValue = t);
      return;
    }
    e.defaultValue = a != null ? "" + ua(a) : "";
  }
  function Px(e, t, a, n) {
    if (t == null) {
      if (n != null) {
        if (a != null) throw Error(B(92));
        if (Ao(n)) {
          if (1 < n.length) throw Error(B(93));
          n = n[0];
        }
        a = n;
      }
      a == null && (a = ""), t = a;
    }
    a = ua(t), e.defaultValue = a, n = e.textContent, n === a && n !== "" && n !== null && (e.value = n), Vf(e);
  }
  function Ml(e, t) {
    if (t) {
      var a = e.firstChild;
      if (a && a === e.lastChild && a.nodeType === 3) {
        a.nodeValue = t;
        return;
      }
    }
    e.textContent = t;
  }
  var rw = new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));
  function $h(e, t, a) {
    var n = t.indexOf("--") === 0;
    a == null || typeof a == "boolean" || a === "" ? n ? e.setProperty(t, "") : t === "float" ? e.cssFloat = "" : e[t] = "" : n ? e.setProperty(t, a) : typeof a != "number" || a === 0 || rw.has(t) ? t === "float" ? e.cssFloat = a : e[t] = ("" + a).trim() : e[t] = a + "px";
  }
  function Ux(e, t, a) {
    if (t != null && typeof t != "object") throw Error(B(62));
    if (e = e.style, a != null) {
      for (var n in a) !a.hasOwnProperty(n) || t != null && t.hasOwnProperty(n) || (n.indexOf("--") === 0 ? e.setProperty(n, "") : n === "float" ? e.cssFloat = "" : e[n] = "");
      for (var r in t) n = t[r], t.hasOwnProperty(r) && a[r] !== n && $h(e, r, n);
    } else for (var l in t) t.hasOwnProperty(l) && $h(e, l, t[l]);
  }
  function Od(e) {
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
  var lw = new Map([["acceptCharset", "accept-charset"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"], ["crossOrigin", "crossorigin"], ["accentHeight", "accent-height"], ["alignmentBaseline", "alignment-baseline"], ["arabicForm", "arabic-form"], ["baselineShift", "baseline-shift"], ["capHeight", "cap-height"], ["clipPath", "clip-path"], ["clipRule", "clip-rule"], ["colorInterpolation", "color-interpolation"], ["colorInterpolationFilters", "color-interpolation-filters"], ["colorProfile", "color-profile"], ["colorRendering", "color-rendering"], ["dominantBaseline", "dominant-baseline"], ["enableBackground", "enable-background"], ["fillOpacity", "fill-opacity"], ["fillRule", "fill-rule"], ["floodColor", "flood-color"], ["floodOpacity", "flood-opacity"], ["fontFamily", "font-family"], ["fontSize", "font-size"], ["fontSizeAdjust", "font-size-adjust"], ["fontStretch", "font-stretch"], ["fontStyle", "font-style"], ["fontVariant", "font-variant"], ["fontWeight", "font-weight"], ["glyphName", "glyph-name"], ["glyphOrientationHorizontal", "glyph-orientation-horizontal"], ["glyphOrientationVertical", "glyph-orientation-vertical"], ["horizAdvX", "horiz-adv-x"], ["horizOriginX", "horiz-origin-x"], ["imageRendering", "image-rendering"], ["letterSpacing", "letter-spacing"], ["lightingColor", "lighting-color"], ["markerEnd", "marker-end"], ["markerMid", "marker-mid"], ["markerStart", "marker-start"], ["overlinePosition", "overline-position"], ["overlineThickness", "overline-thickness"], ["paintOrder", "paint-order"], ["panose-1", "panose-1"], ["pointerEvents", "pointer-events"], ["renderingIntent", "rendering-intent"], ["shapeRendering", "shape-rendering"], ["stopColor", "stop-color"], ["stopOpacity", "stop-opacity"], ["strikethroughPosition", "strikethrough-position"], ["strikethroughThickness", "strikethrough-thickness"], ["strokeDasharray", "stroke-dasharray"], ["strokeDashoffset", "stroke-dashoffset"], ["strokeLinecap", "stroke-linecap"], ["strokeLinejoin", "stroke-linejoin"], ["strokeMiterlimit", "stroke-miterlimit"], ["strokeOpacity", "stroke-opacity"], ["strokeWidth", "stroke-width"], ["textAnchor", "text-anchor"], ["textDecoration", "text-decoration"], ["textRendering", "text-rendering"], ["transformOrigin", "transform-origin"], ["underlinePosition", "underline-position"], ["underlineThickness", "underline-thickness"], ["unicodeBidi", "unicode-bidi"], ["unicodeRange", "unicode-range"], ["unitsPerEm", "units-per-em"], ["vAlphabetic", "v-alphabetic"], ["vHanging", "v-hanging"], ["vIdeographic", "v-ideographic"], ["vMathematical", "v-mathematical"], ["vectorEffect", "vector-effect"], ["vertAdvY", "vert-adv-y"], ["vertOriginX", "vert-origin-x"], ["vertOriginY", "vert-origin-y"], ["wordSpacing", "word-spacing"], ["writingMode", "writing-mode"], ["xmlnsXlink", "xmlns:xlink"], ["xHeight", "x-height"]]),
    ow = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function Ru(e) {
    return ow.test("" + e) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : e;
  }
  function Ja() {}
  var Yf = null;
  function Pd(e) {
    return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
  }
  var fl = null,
    kl = null;
  function eg(e) {
    var t = ql(e);
    if (t && (e = t.stateNode)) {
      var a = e[_t] || null;
      e: switch (e = t.stateNode, t.type) {
        case "input":
          if (Xf(e, a.value, a.defaultValue, a.defaultValue, a.checked, a.defaultChecked, a.type, a.name), t = a.name, a.type === "radio" && t != null) {
            for (a = e; a.parentNode;) a = a.parentNode;
            for (a = a.querySelectorAll('input[name="' + fa("" + t) + '"][type="radio"]'), t = 0; t < a.length; t++) {
              var n = a[t];
              if (n !== e && n.form === e.form) {
                var r = n[_t] || null;
                if (!r) throw Error(B(90));
                Xf(n, r.value, r.defaultValue, r.defaultValue, r.checked, r.defaultChecked, r.type, r.name);
              }
            }
            for (t = 0; t < a.length; t++) n = a[t], n.form === e.form && Nx(n);
          }
          break e;
        case "textarea":
          Ox(e, a.value, a.defaultValue);
          break e;
        case "select":
          t = a.value, t != null && Ll(e, !!a.multiple, t, !1);
      }
    }
  }
  var of = !1;
  function qx(e, t, a) {
    if (of) return e(t, a);
    of = !0;
    try {
      var n = e(t);
      return n;
    } finally {
      if (of = !1, (fl !== null || kl !== null) && (Ns(), fl && (t = fl, e = kl, kl = fl = null, eg(t), e))) for (t = 0; t < e.length; t++) eg(e[t]);
    }
  }
  function Xo(e, t) {
    var a = e.stateNode;
    if (a === null) return null;
    var n = a[_t] || null;
    if (n === null) return null;
    a = n[t];
    e: switch (t) {
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
        (n = !n.disabled) || (e = e.type, n = !(e === "button" || e === "input" || e === "select" || e === "textarea")), e = !n;
        break e;
      default:
        e = !1;
    }
    if (e) return null;
    if (a && typeof a != "function") throw Error(B(231, t, typeof a));
    return a;
  }
  var nn = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"),
    Qf = !1;
  if (nn) try {
    nl = {}, Object.defineProperty(nl, "passive", {
      get: function () {
        Qf = !0;
      }
    }), window.addEventListener("test", nl, nl), window.removeEventListener("test", nl, nl);
  } catch {
    Qf = !1;
  }
  var nl,
    Mn = null,
    Ud = null,
    Nu = null;
  function Fx() {
    if (Nu) return Nu;
    var e,
      t = Ud,
      a = t.length,
      n,
      r = "value" in Mn ? Mn.value : Mn.textContent,
      l = r.length;
    for (e = 0; e < a && t[e] === r[e]; e++);
    var o = a - e;
    for (n = 1; n <= o && t[a - n] === r[l - n]; n++);
    return Nu = r.slice(e, 1 < n ? 1 - n : void 0);
  }
  function zu(e) {
    var t = e.keyCode;
    return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
  }
  function bu() {
    return !0;
  }
  function tg() {
    return !1;
  }
  function Gt(e) {
    function t(a, n, r, l, o) {
      this._reactName = a, this._targetInst = r, this.type = n, this.nativeEvent = l, this.target = o, this.currentTarget = null;
      for (var i in e) e.hasOwnProperty(i) && (a = e[i], this[i] = a ? a(l) : l[i]);
      return this.isDefaultPrevented = (l.defaultPrevented != null ? l.defaultPrevented : l.returnValue === !1) ? bu : tg, this.isPropagationStopped = tg, this;
    }
    return qe(t.prototype, {
      preventDefault: function () {
        this.defaultPrevented = !0;
        var a = this.nativeEvent;
        a && (a.preventDefault ? a.preventDefault() : typeof a.returnValue != "unknown" && (a.returnValue = !1), this.isDefaultPrevented = bu);
      },
      stopPropagation: function () {
        var a = this.nativeEvent;
        a && (a.stopPropagation ? a.stopPropagation() : typeof a.cancelBubble != "unknown" && (a.cancelBubble = !0), this.isPropagationStopped = bu);
      },
      persist: function () {},
      isPersistent: bu
    }), t;
  }
  var Sr = {
      eventPhase: 0,
      bubbles: 0,
      cancelable: 0,
      timeStamp: function (e) {
        return e.timeStamp || Date.now();
      },
      defaultPrevented: 0,
      isTrusted: 0
    },
    ws = Gt(Sr),
    si = qe({}, Sr, {
      view: 0,
      detail: 0
    }),
    iw = Gt(si),
    uf,
    sf,
    vo,
    Ss = qe({}, si, {
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
      getModifierState: qd,
      button: 0,
      buttons: 0,
      relatedTarget: function (e) {
        return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
      },
      movementX: function (e) {
        return "movementX" in e ? e.movementX : (e !== vo && (vo && e.type === "mousemove" ? (uf = e.screenX - vo.screenX, sf = e.screenY - vo.screenY) : sf = uf = 0, vo = e), uf);
      },
      movementY: function (e) {
        return "movementY" in e ? e.movementY : sf;
      }
    }),
    ag = Gt(Ss),
    uw = qe({}, Ss, {
      dataTransfer: 0
    }),
    sw = Gt(uw),
    cw = qe({}, si, {
      relatedTarget: 0
    }),
    cf = Gt(cw),
    fw = qe({}, Sr, {
      animationName: 0,
      elapsedTime: 0,
      pseudoElement: 0
    }),
    dw = Gt(fw),
    pw = qe({}, Sr, {
      clipboardData: function (e) {
        return "clipboardData" in e ? e.clipboardData : window.clipboardData;
      }
    }),
    mw = Gt(pw),
    hw = qe({}, Sr, {
      data: 0
    }),
    ng = Gt(hw),
    gw = {
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
    xw = {
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
    yw = {
      Alt: "altKey",
      Control: "ctrlKey",
      Meta: "metaKey",
      Shift: "shiftKey"
    };
  function bw(e) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(e) : (e = yw[e]) ? !!t[e] : !1;
  }
  function qd() {
    return bw;
  }
  var vw = qe({}, si, {
      key: function (e) {
        if (e.key) {
          var t = gw[e.key] || e.key;
          if (t !== "Unidentified") return t;
        }
        return e.type === "keypress" ? (e = zu(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? xw[e.keyCode] || "Unidentified" : "";
      },
      code: 0,
      location: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      repeat: 0,
      locale: 0,
      getModifierState: qd,
      charCode: function (e) {
        return e.type === "keypress" ? zu(e) : 0;
      },
      keyCode: function (e) {
        return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
      },
      which: function (e) {
        return e.type === "keypress" ? zu(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
      }
    }),
    Lw = Gt(vw),
    kw = qe({}, Ss, {
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
    rg = Gt(kw),
    ww = qe({}, si, {
      touches: 0,
      targetTouches: 0,
      changedTouches: 0,
      altKey: 0,
      metaKey: 0,
      ctrlKey: 0,
      shiftKey: 0,
      getModifierState: qd
    }),
    Sw = Gt(ww),
    Cw = qe({}, Sr, {
      propertyName: 0,
      elapsedTime: 0,
      pseudoElement: 0
    }),
    Iw = Gt(Cw),
    Aw = qe({}, Ss, {
      deltaX: function (e) {
        return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
      },
      deltaY: function (e) {
        return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
      },
      deltaZ: 0,
      deltaMode: 0
    }),
    Tw = Gt(Aw),
    Mw = qe({}, Sr, {
      newState: 0,
      oldState: 0
    }),
    Dw = Gt(Mw),
    Bw = [9, 13, 27, 32],
    Fd = nn && "CompositionEvent" in window,
    Bo = null;
  nn && "documentMode" in document && (Bo = document.documentMode);
  var Ew = nn && "TextEvent" in window && !Bo,
    Hx = nn && (!Fd || Bo && 8 < Bo && 11 >= Bo),
    lg = " ",
    og = !1;
  function _x(e, t) {
    switch (e) {
      case "keyup":
        return Bw.indexOf(t.keyCode) !== -1;
      case "keydown":
        return t.keyCode !== 229;
      case "keypress":
      case "mousedown":
      case "focusout":
        return !0;
      default:
        return !1;
    }
  }
  function Gx(e) {
    return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
  }
  var dl = !1;
  function Rw(e, t) {
    switch (e) {
      case "compositionend":
        return Gx(t);
      case "keypress":
        return t.which !== 32 ? null : (og = !0, lg);
      case "textInput":
        return e = t.data, e === lg && og ? null : e;
      default:
        return null;
    }
  }
  function Nw(e, t) {
    if (dl) return e === "compositionend" || !Fd && _x(e, t) ? (e = Fx(), Nu = Ud = Mn = null, dl = !1, e) : null;
    switch (e) {
      case "paste":
        return null;
      case "keypress":
        if (!(t.ctrlKey || t.altKey || t.metaKey) || t.ctrlKey && t.altKey) {
          if (t.char && 1 < t.char.length) return t.char;
          if (t.which) return String.fromCharCode(t.which);
        }
        return null;
      case "compositionend":
        return Hx && t.locale !== "ko" ? null : t.data;
      default:
        return null;
    }
  }
  var zw = {
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
  function ig(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t === "input" ? !!zw[e.type] : t === "textarea";
  }
  function Vx(e, t, a, n) {
    fl ? kl ? kl.push(n) : kl = [n] : fl = n, t = hs(t, "onChange"), 0 < t.length && (a = new ws("onChange", "change", null, a, n), e.push({
      event: a,
      listeners: t
    }));
  }
  var Eo = null,
    jo = null;
  function Ow(e) {
    qb(e, 0);
  }
  function Cs(e) {
    var t = To(e);
    if (Nx(t)) return e;
  }
  function ug(e, t) {
    if (e === "change") return t;
  }
  var Xx = !1;
  nn && (nn ? (Lu = "oninput" in document, Lu || (ff = document.createElement("div"), ff.setAttribute("oninput", "return;"), Lu = typeof ff.oninput == "function"), vu = Lu) : vu = !1, Xx = vu && (!document.documentMode || 9 < document.documentMode));
  var vu, Lu, ff;
  function sg() {
    Eo && (Eo.detachEvent("onpropertychange", jx), jo = Eo = null);
  }
  function jx(e) {
    if (e.propertyName === "value" && Cs(jo)) {
      var t = [];
      Vx(t, jo, e, Pd(e)), qx(Ow, t);
    }
  }
  function Pw(e, t, a) {
    e === "focusin" ? (sg(), Eo = t, jo = a, Eo.attachEvent("onpropertychange", jx)) : e === "focusout" && sg();
  }
  function Uw(e) {
    if (e === "selectionchange" || e === "keyup" || e === "keydown") return Cs(jo);
  }
  function qw(e, t) {
    if (e === "click") return Cs(t);
  }
  function Fw(e, t) {
    if (e === "input" || e === "change") return Cs(t);
  }
  function Hw(e, t) {
    return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
  }
  var na = typeof Object.is == "function" ? Object.is : Hw;
  function Yo(e, t) {
    if (na(e, t)) return !0;
    if (typeof e != "object" || e === null || typeof t != "object" || t === null) return !1;
    var a = Object.keys(e),
      n = Object.keys(t);
    if (a.length !== n.length) return !1;
    for (n = 0; n < a.length; n++) {
      var r = a[n];
      if (!_f.call(t, r) || !na(e[r], t[r])) return !1;
    }
    return !0;
  }
  function cg(e) {
    for (; e && e.firstChild;) e = e.firstChild;
    return e;
  }
  function fg(e, t) {
    var a = cg(e);
    e = 0;
    for (var n; a;) {
      if (a.nodeType === 3) {
        if (n = e + a.textContent.length, e <= t && n >= t) return {
          node: a,
          offset: t - e
        };
        e = n;
      }
      e: {
        for (; a;) {
          if (a.nextSibling) {
            a = a.nextSibling;
            break e;
          }
          a = a.parentNode;
        }
        a = void 0;
      }
      a = cg(a);
    }
  }
  function Yx(e, t) {
    return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? Yx(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
  }
  function Qx(e) {
    e = e != null && e.ownerDocument != null && e.ownerDocument.defaultView != null ? e.ownerDocument.defaultView : window;
    for (var t = Wu(e.document); t instanceof e.HTMLIFrameElement;) {
      try {
        var a = typeof t.contentWindow.location.href == "string";
      } catch {
        a = !1;
      }
      if (a) e = t.contentWindow;else break;
      t = Wu(e.document);
    }
    return t;
  }
  function Hd(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
  }
  var _w = nn && "documentMode" in document && 11 >= document.documentMode,
    pl = null,
    Zf = null,
    Ro = null,
    Kf = !1;
  function dg(e, t, a) {
    var n = a.window === a ? a.document : a.nodeType === 9 ? a : a.ownerDocument;
    Kf || pl == null || pl !== Wu(n) || (n = pl, "selectionStart" in n && Hd(n) ? n = {
      start: n.selectionStart,
      end: n.selectionEnd
    } : (n = (n.ownerDocument && n.ownerDocument.defaultView || window).getSelection(), n = {
      anchorNode: n.anchorNode,
      anchorOffset: n.anchorOffset,
      focusNode: n.focusNode,
      focusOffset: n.focusOffset
    }), Ro && Yo(Ro, n) || (Ro = n, n = hs(Zf, "onSelect"), 0 < n.length && (t = new ws("onSelect", "select", null, t, a), e.push({
      event: t,
      listeners: n
    }), t.target = pl)));
  }
  function ur(e, t) {
    var a = {};
    return a[e.toLowerCase()] = t.toLowerCase(), a["Webkit" + e] = "webkit" + t, a["Moz" + e] = "moz" + t, a;
  }
  var ml = {
      animationend: ur("Animation", "AnimationEnd"),
      animationiteration: ur("Animation", "AnimationIteration"),
      animationstart: ur("Animation", "AnimationStart"),
      transitionrun: ur("Transition", "TransitionRun"),
      transitionstart: ur("Transition", "TransitionStart"),
      transitioncancel: ur("Transition", "TransitionCancel"),
      transitionend: ur("Transition", "TransitionEnd")
    },
    df = {},
    Zx = {};
  nn && (Zx = document.createElement("div").style, "AnimationEvent" in window || (delete ml.animationend.animation, delete ml.animationiteration.animation, delete ml.animationstart.animation), "TransitionEvent" in window || delete ml.transitionend.transition);
  function Cr(e) {
    if (df[e]) return df[e];
    if (!ml[e]) return e;
    var t = ml[e],
      a;
    for (a in t) if (t.hasOwnProperty(a) && a in Zx) return df[e] = t[a];
    return e;
  }
  var Kx = Cr("animationend"),
    Wx = Cr("animationiteration"),
    Jx = Cr("animationstart"),
    Gw = Cr("transitionrun"),
    Vw = Cr("transitionstart"),
    Xw = Cr("transitioncancel"),
    $x = Cr("transitionend"),
    ey = new Map(),
    Wf = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
  Wf.push("scrollEnd");
  function wa(e, t) {
    ey.set(e, t), wr(t, [e]);
  }
  var Ju = typeof reportError == "function" ? reportError : function (e) {
      if (typeof window == "object" && typeof window.ErrorEvent == "function") {
        var t = new window.ErrorEvent("error", {
          bubbles: !0,
          cancelable: !0,
          message: typeof e == "object" && e !== null && typeof e.message == "string" ? String(e.message) : String(e),
          error: e
        });
        if (!window.dispatchEvent(t)) return;
      } else if (typeof process == "object" && typeof process.emit == "function") {
        process.emit("uncaughtException", e);
        return;
      }
      console.error(e);
    },
    ia = [],
    hl = 0,
    _d = 0;
  function Is() {
    for (var e = hl, t = _d = hl = 0; t < e;) {
      var a = ia[t];
      ia[t++] = null;
      var n = ia[t];
      ia[t++] = null;
      var r = ia[t];
      ia[t++] = null;
      var l = ia[t];
      if (ia[t++] = null, n !== null && r !== null) {
        var o = n.pending;
        o === null ? r.next = r : (r.next = o.next, o.next = r), n.pending = r;
      }
      l !== 0 && ty(a, r, l);
    }
  }
  function As(e, t, a, n) {
    ia[hl++] = e, ia[hl++] = t, ia[hl++] = a, ia[hl++] = n, _d |= n, e.lanes |= n, e = e.alternate, e !== null && (e.lanes |= n);
  }
  function Gd(e, t, a, n) {
    return As(e, t, a, n), $u(e);
  }
  function Ir(e, t) {
    return As(e, null, null, t), $u(e);
  }
  function ty(e, t, a) {
    e.lanes |= a;
    var n = e.alternate;
    n !== null && (n.lanes |= a);
    for (var r = !1, l = e.return; l !== null;) l.childLanes |= a, n = l.alternate, n !== null && (n.childLanes |= a), l.tag === 22 && (e = l.stateNode, e === null || e._visibility & 1 || (r = !0)), e = l, l = l.return;
    return e.tag === 3 ? (l = e.stateNode, r && t !== null && (r = 31 - ta(a), e = l.hiddenUpdates, n = e[r], n === null ? e[r] = [t] : n.push(t), t.lane = a | 536870912), l) : null;
  }
  function $u(e) {
    if (50 < _o) throw _o = 0, yd = null, Error(B(185));
    for (var t = e.return; t !== null;) e = t, t = e.return;
    return e.tag === 3 ? e.stateNode : null;
  }
  var gl = {};
  function jw(e, t, a, n) {
    this.tag = e, this.key = a, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = n, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function Wt(e, t, a, n) {
    return new jw(e, t, a, n);
  }
  function Vd(e) {
    return e = e.prototype, !(!e || !e.isReactComponent);
  }
  function en(e, t) {
    var a = e.alternate;
    return a === null ? (a = Wt(e.tag, t, e.key, e.mode), a.elementType = e.elementType, a.type = e.type, a.stateNode = e.stateNode, a.alternate = e, e.alternate = a) : (a.pendingProps = t, a.type = e.type, a.flags = 0, a.subtreeFlags = 0, a.deletions = null), a.flags = e.flags & 65011712, a.childLanes = e.childLanes, a.lanes = e.lanes, a.child = e.child, a.memoizedProps = e.memoizedProps, a.memoizedState = e.memoizedState, a.updateQueue = e.updateQueue, t = e.dependencies, a.dependencies = t === null ? null : {
      lanes: t.lanes,
      firstContext: t.firstContext
    }, a.sibling = e.sibling, a.index = e.index, a.ref = e.ref, a.refCleanup = e.refCleanup, a;
  }
  function ay(e, t) {
    e.flags &= 65011714;
    var a = e.alternate;
    return a === null ? (e.childLanes = 0, e.lanes = t, e.child = null, e.subtreeFlags = 0, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null) : (e.childLanes = a.childLanes, e.lanes = a.lanes, e.child = a.child, e.subtreeFlags = 0, e.deletions = null, e.memoizedProps = a.memoizedProps, e.memoizedState = a.memoizedState, e.updateQueue = a.updateQueue, e.type = a.type, t = a.dependencies, e.dependencies = t === null ? null : {
      lanes: t.lanes,
      firstContext: t.firstContext
    }), e;
  }
  function Ou(e, t, a, n, r, l) {
    var o = 0;
    if (n = e, typeof e == "function") Vd(e) && (o = 1);else if (typeof e == "string") o = ZS(e, a, Ra.current) ? 26 : e === "html" || e === "head" || e === "body" ? 27 : 5;else e: switch (e) {
      case Uf:
        return e = Wt(31, a, t, r), e.elementType = Uf, e.lanes = l, e;
      case ul:
        return mr(a.children, r, l, t);
      case Lx:
        o = 8, r |= 24;
        break;
      case zf:
        return e = Wt(12, a, t, r | 2), e.elementType = zf, e.lanes = l, e;
      case Of:
        return e = Wt(13, a, t, r), e.elementType = Of, e.lanes = l, e;
      case Pf:
        return e = Wt(19, a, t, r), e.elementType = Pf, e.lanes = l, e;
      default:
        if (typeof e == "object" && e !== null) switch (e.$$typeof) {
          case Wa:
            o = 10;
            break e;
          case kx:
            o = 9;
            break e;
          case Dd:
            o = 11;
            break e;
          case Bd:
            o = 14;
            break e;
          case kn:
            o = 16, n = null;
            break e;
        }
        o = 29, a = Error(B(130, e === null ? "null" : typeof e, "")), n = null;
    }
    return t = Wt(o, a, t, r), t.elementType = e, t.type = n, t.lanes = l, t;
  }
  function mr(e, t, a, n) {
    return e = Wt(7, e, n, t), e.lanes = a, e;
  }
  function pf(e, t, a) {
    return e = Wt(6, e, null, t), e.lanes = a, e;
  }
  function ny(e) {
    var t = Wt(18, null, null, 0);
    return t.stateNode = e, t;
  }
  function mf(e, t, a) {
    return t = Wt(4, e.children !== null ? e.children : [], e.key, t), t.lanes = a, t.stateNode = {
      containerInfo: e.containerInfo,
      pendingChildren: null,
      implementation: e.implementation
    }, t;
  }
  var pg = new WeakMap();
  function da(e, t) {
    if (typeof e == "object" && e !== null) {
      var a = pg.get(e);
      return a !== void 0 ? a : (t = {
        value: e,
        source: t,
        stack: Qh(t)
      }, pg.set(e, t), t);
    }
    return {
      value: e,
      source: t,
      stack: Qh(t)
    };
  }
  var xl = [],
    yl = 0,
    es = null,
    Qo = 0,
    sa = [],
    ca = 0,
    _n = null,
    Da = 1,
    Ba = "";
  function Za(e, t) {
    xl[yl++] = Qo, xl[yl++] = es, es = e, Qo = t;
  }
  function ry(e, t, a) {
    sa[ca++] = Da, sa[ca++] = Ba, sa[ca++] = _n, _n = e;
    var n = Da;
    e = Ba;
    var r = 32 - ta(n) - 1;
    n &= ~(1 << r), a += 1;
    var l = 32 - ta(t) + r;
    if (30 < l) {
      var o = r - r % 5;
      l = (n & (1 << o) - 1).toString(32), n >>= o, r -= o, Da = 1 << 32 - ta(t) + r | a << r | n, Ba = l + e;
    } else Da = 1 << l | a << r | n, Ba = e;
  }
  function Xd(e) {
    e.return !== null && (Za(e, 1), ry(e, 1, 0));
  }
  function jd(e) {
    for (; e === es;) es = xl[--yl], xl[yl] = null, Qo = xl[--yl], xl[yl] = null;
    for (; e === _n;) _n = sa[--ca], sa[ca] = null, Ba = sa[--ca], sa[ca] = null, Da = sa[--ca], sa[ca] = null;
  }
  function ly(e, t) {
    sa[ca++] = Da, sa[ca++] = Ba, sa[ca++] = _n, Da = t.id, Ba = t.overflow, _n = e;
  }
  var wt = null,
    Ue = null,
    xe = !1,
    Nn = null,
    pa = !1,
    Jf = Error(B(519));
  function Gn(e) {
    var t = Error(B(418, 1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML", ""));
    throw Zo(da(t, e)), Jf;
  }
  function mg(e) {
    var t = e.stateNode,
      a = e.type,
      n = e.memoizedProps;
    switch (t[kt] = e, t[_t] = n, a) {
      case "dialog":
        pe("cancel", t), pe("close", t);
        break;
      case "iframe":
      case "object":
      case "embed":
        pe("load", t);
        break;
      case "video":
      case "audio":
        for (a = 0; a < $o.length; a++) pe($o[a], t);
        break;
      case "source":
        pe("error", t);
        break;
      case "img":
      case "image":
      case "link":
        pe("error", t), pe("load", t);
        break;
      case "details":
        pe("toggle", t);
        break;
      case "input":
        pe("invalid", t), zx(t, n.value, n.defaultValue, n.checked, n.defaultChecked, n.type, n.name, !0);
        break;
      case "select":
        pe("invalid", t);
        break;
      case "textarea":
        pe("invalid", t), Px(t, n.value, n.defaultValue, n.children);
    }
    a = n.children, typeof a != "string" && typeof a != "number" && typeof a != "bigint" || t.textContent === "" + a || n.suppressHydrationWarning === !0 || Hb(t.textContent, a) ? (n.popover != null && (pe("beforetoggle", t), pe("toggle", t)), n.onScroll != null && pe("scroll", t), n.onScrollEnd != null && pe("scrollend", t), n.onClick != null && (t.onclick = Ja), t = !0) : t = !1, t || Gn(e, !0);
  }
  function hg(e) {
    for (wt = e.return; wt;) switch (wt.tag) {
      case 5:
      case 31:
      case 13:
        pa = !1;
        return;
      case 27:
      case 3:
        pa = !0;
        return;
      default:
        wt = wt.return;
    }
  }
  function rl(e) {
    if (e !== wt) return !1;
    if (!xe) return hg(e), xe = !0, !1;
    var t = e.tag,
      a;
    if ((a = t !== 3 && t !== 27) && ((a = t === 5) && (a = e.type, a = !(a !== "form" && a !== "button") || wd(e.type, e.memoizedProps)), a = !a), a && Ue && Gn(e), hg(e), t === 13) {
      if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(B(317));
      Ue = nx(e);
    } else if (t === 31) {
      if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(B(317));
      Ue = nx(e);
    } else t === 27 ? (t = Ue, Yn(e.type) ? (e = Ad, Ad = null, Ue = e) : Ue = t) : Ue = wt ? ha(e.stateNode.nextSibling) : null;
    return !0;
  }
  function yr() {
    Ue = wt = null, xe = !1;
  }
  function hf() {
    var e = Nn;
    return e !== null && (Ft === null ? Ft = e : Ft.push.apply(Ft, e), Nn = null), e;
  }
  function Zo(e) {
    Nn === null ? Nn = [e] : Nn.push(e);
  }
  var $f = Na(null),
    Ar = null,
    $a = null;
  function Sn(e, t, a) {
    Ne($f, t._currentValue), t._currentValue = a;
  }
  function tn(e) {
    e._currentValue = $f.current, xt($f);
  }
  function ed(e, t, a) {
    for (; e !== null;) {
      var n = e.alternate;
      if ((e.childLanes & t) !== t ? (e.childLanes |= t, n !== null && (n.childLanes |= t)) : n !== null && (n.childLanes & t) !== t && (n.childLanes |= t), e === a) break;
      e = e.return;
    }
  }
  function td(e, t, a, n) {
    var r = e.child;
    for (r !== null && (r.return = e); r !== null;) {
      var l = r.dependencies;
      if (l !== null) {
        var o = r.child;
        l = l.firstContext;
        e: for (; l !== null;) {
          var i = l;
          l = r;
          for (var u = 0; u < t.length; u++) if (i.context === t[u]) {
            l.lanes |= a, i = l.alternate, i !== null && (i.lanes |= a), ed(l.return, a, e), n || (o = null);
            break e;
          }
          l = i.next;
        }
      } else if (r.tag === 18) {
        if (o = r.return, o === null) throw Error(B(341));
        o.lanes |= a, l = o.alternate, l !== null && (l.lanes |= a), ed(o, a, e), o = null;
      } else o = r.child;
      if (o !== null) o.return = r;else for (o = r; o !== null;) {
        if (o === e) {
          o = null;
          break;
        }
        if (r = o.sibling, r !== null) {
          r.return = o.return, o = r;
          break;
        }
        o = o.return;
      }
      r = o;
    }
  }
  function Fl(e, t, a, n) {
    e = null;
    for (var r = t, l = !1; r !== null;) {
      if (!l) {
        if ((r.flags & 524288) !== 0) l = !0;else if ((r.flags & 262144) !== 0) break;
      }
      if (r.tag === 10) {
        var o = r.alternate;
        if (o === null) throw Error(B(387));
        if (o = o.memoizedProps, o !== null) {
          var i = r.type;
          na(r.pendingProps.value, o.value) || (e !== null ? e.push(i) : e = [i]);
        }
      } else if (r === Yu.current) {
        if (o = r.alternate, o === null) throw Error(B(387));
        o.memoizedState.memoizedState !== r.memoizedState.memoizedState && (e !== null ? e.push(ti) : e = [ti]);
      }
      r = r.return;
    }
    e !== null && td(t, e, a, n), t.flags |= 262144;
  }
  function ts(e) {
    for (e = e.firstContext; e !== null;) {
      if (!na(e.context._currentValue, e.memoizedValue)) return !0;
      e = e.next;
    }
    return !1;
  }
  function br(e) {
    Ar = e, $a = null, e = e.dependencies, e !== null && (e.firstContext = null);
  }
  function St(e) {
    return oy(Ar, e);
  }
  function ku(e, t) {
    return Ar === null && br(e), oy(e, t);
  }
  function oy(e, t) {
    var a = t._currentValue;
    if (t = {
      context: t,
      memoizedValue: a,
      next: null
    }, $a === null) {
      if (e === null) throw Error(B(308));
      $a = t, e.dependencies = {
        lanes: 0,
        firstContext: t
      }, e.flags |= 524288;
    } else $a = $a.next = t;
    return a;
  }
  var Yw = typeof AbortController < "u" ? AbortController : function () {
      var e = [],
        t = this.signal = {
          aborted: !1,
          addEventListener: function (a, n) {
            e.push(n);
          }
        };
      this.abort = function () {
        t.aborted = !0, e.forEach(function (a) {
          return a();
        });
      };
    },
    Qw = dt.unstable_scheduleCallback,
    Zw = dt.unstable_NormalPriority,
    it = {
      $$typeof: Wa,
      Consumer: null,
      Provider: null,
      _currentValue: null,
      _currentValue2: null,
      _threadCount: 0
    };
  function Yd() {
    return {
      controller: new Yw(),
      data: new Map(),
      refCount: 0
    };
  }
  function ci(e) {
    e.refCount--, e.refCount === 0 && Qw(Zw, function () {
      e.controller.abort();
    });
  }
  var No = null,
    ad = 0,
    Dl = 0,
    wl = null;
  function Kw(e, t) {
    if (No === null) {
      var a = No = [];
      ad = 0, Dl = yp(), wl = {
        status: "pending",
        value: void 0,
        then: function (n) {
          a.push(n);
        }
      };
    }
    return ad++, t.then(gg, gg), t;
  }
  function gg() {
    if (--ad === 0 && No !== null) {
      wl !== null && (wl.status = "fulfilled");
      var e = No;
      No = null, Dl = 0, wl = null;
      for (var t = 0; t < e.length; t++) (0, e[t])();
    }
  }
  function Ww(e, t) {
    var a = [],
      n = {
        status: "pending",
        value: null,
        reason: null,
        then: function (r) {
          a.push(r);
        }
      };
    return e.then(function () {
      n.status = "fulfilled", n.value = t;
      for (var r = 0; r < a.length; r++) (0, a[r])(t);
    }, function (r) {
      for (n.status = "rejected", n.reason = r, r = 0; r < a.length; r++) (0, a[r])(void 0);
    }), n;
  }
  var xg = ee.S;
  ee.S = function (e, t) {
    vb = $t(), typeof t == "object" && t !== null && typeof t.then == "function" && Kw(e, t), xg !== null && xg(e, t);
  };
  var hr = Na(null);
  function Qd() {
    var e = hr.current;
    return e !== null ? e : Be.pooledCache;
  }
  function Pu(e, t) {
    t === null ? Ne(hr, hr.current) : Ne(hr, t.pool);
  }
  function iy() {
    var e = Qd();
    return e === null ? null : {
      parent: it._currentValue,
      pool: e
    };
  }
  var Hl = Error(B(460)),
    Zd = Error(B(474)),
    Ts = Error(B(542)),
    as = {
      then: function () {}
    };
  function yg(e) {
    return e = e.status, e === "fulfilled" || e === "rejected";
  }
  function uy(e, t, a) {
    switch (a = e[a], a === void 0 ? e.push(t) : a !== t && (t.then(Ja, Ja), t = a), t.status) {
      case "fulfilled":
        return t.value;
      case "rejected":
        throw e = t.reason, vg(e), e;
      default:
        if (typeof t.status == "string") t.then(Ja, Ja);else {
          if (e = Be, e !== null && 100 < e.shellSuspendCounter) throw Error(B(482));
          e = t, e.status = "pending", e.then(function (n) {
            if (t.status === "pending") {
              var r = t;
              r.status = "fulfilled", r.value = n;
            }
          }, function (n) {
            if (t.status === "pending") {
              var r = t;
              r.status = "rejected", r.reason = n;
            }
          });
        }
        switch (t.status) {
          case "fulfilled":
            return t.value;
          case "rejected":
            throw e = t.reason, vg(e), e;
        }
        throw gr = t, Hl;
    }
  }
  function fr(e) {
    try {
      var t = e._init;
      return t(e._payload);
    } catch (a) {
      throw a !== null && typeof a == "object" && typeof a.then == "function" ? (gr = a, Hl) : a;
    }
  }
  var gr = null;
  function bg() {
    if (gr === null) throw Error(B(459));
    var e = gr;
    return gr = null, e;
  }
  function vg(e) {
    if (e === Hl || e === Ts) throw Error(B(483));
  }
  var Sl = null,
    Ko = 0;
  function wu(e) {
    var t = Ko;
    return Ko += 1, Sl === null && (Sl = []), uy(Sl, e, t);
  }
  function Lo(e, t) {
    t = t.props.ref, e.ref = t !== void 0 ? t : null;
  }
  function Su(e, t) {
    throw t.$$typeof === Pk ? Error(B(525)) : (e = Object.prototype.toString.call(t), Error(B(31, e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e)));
  }
  function sy(e) {
    function t(h, m) {
      if (e) {
        var g = h.deletions;
        g === null ? (h.deletions = [m], h.flags |= 16) : g.push(m);
      }
    }
    function a(h, m) {
      if (!e) return null;
      for (; m !== null;) t(h, m), m = m.sibling;
      return null;
    }
    function n(h) {
      for (var m = new Map(); h !== null;) h.key !== null ? m.set(h.key, h) : m.set(h.index, h), h = h.sibling;
      return m;
    }
    function r(h, m) {
      return h = en(h, m), h.index = 0, h.sibling = null, h;
    }
    function l(h, m, g) {
      return h.index = g, e ? (g = h.alternate, g !== null ? (g = g.index, g < m ? (h.flags |= 67108866, m) : g) : (h.flags |= 67108866, m)) : (h.flags |= 1048576, m);
    }
    function o(h) {
      return e && h.alternate === null && (h.flags |= 67108866), h;
    }
    function i(h, m, g, L) {
      return m === null || m.tag !== 6 ? (m = pf(g, h.mode, L), m.return = h, m) : (m = r(m, g), m.return = h, m);
    }
    function u(h, m, g, L) {
      var I = g.type;
      return I === ul ? c(h, m, g.props.children, L, g.key) : m !== null && (m.elementType === I || typeof I == "object" && I !== null && I.$$typeof === kn && fr(I) === m.type) ? (m = r(m, g.props), Lo(m, g), m.return = h, m) : (m = Ou(g.type, g.key, g.props, null, h.mode, L), Lo(m, g), m.return = h, m);
    }
    function s(h, m, g, L) {
      return m === null || m.tag !== 4 || m.stateNode.containerInfo !== g.containerInfo || m.stateNode.implementation !== g.implementation ? (m = mf(g, h.mode, L), m.return = h, m) : (m = r(m, g.children || []), m.return = h, m);
    }
    function c(h, m, g, L, I) {
      return m === null || m.tag !== 7 ? (m = mr(g, h.mode, L, I), m.return = h, m) : (m = r(m, g), m.return = h, m);
    }
    function f(h, m, g) {
      if (typeof m == "string" && m !== "" || typeof m == "number" || typeof m == "bigint") return m = pf("" + m, h.mode, g), m.return = h, m;
      if (typeof m == "object" && m !== null) {
        switch (m.$$typeof) {
          case mu:
            return g = Ou(m.type, m.key, m.props, null, h.mode, g), Lo(g, m), g.return = h, g;
          case Io:
            return m = mf(m, h.mode, g), m.return = h, m;
          case kn:
            return m = fr(m), f(h, m, g);
        }
        if (Ao(m) || bo(m)) return m = mr(m, h.mode, g, null), m.return = h, m;
        if (typeof m.then == "function") return f(h, wu(m), g);
        if (m.$$typeof === Wa) return f(h, ku(h, m), g);
        Su(h, m);
      }
      return null;
    }
    function d(h, m, g, L) {
      var I = m !== null ? m.key : null;
      if (typeof g == "string" && g !== "" || typeof g == "number" || typeof g == "bigint") return I !== null ? null : i(h, m, "" + g, L);
      if (typeof g == "object" && g !== null) {
        switch (g.$$typeof) {
          case mu:
            return g.key === I ? u(h, m, g, L) : null;
          case Io:
            return g.key === I ? s(h, m, g, L) : null;
          case kn:
            return g = fr(g), d(h, m, g, L);
        }
        if (Ao(g) || bo(g)) return I !== null ? null : c(h, m, g, L, null);
        if (typeof g.then == "function") return d(h, m, wu(g), L);
        if (g.$$typeof === Wa) return d(h, m, ku(h, g), L);
        Su(h, g);
      }
      return null;
    }
    function p(h, m, g, L, I) {
      if (typeof L == "string" && L !== "" || typeof L == "number" || typeof L == "bigint") return h = h.get(g) || null, i(m, h, "" + L, I);
      if (typeof L == "object" && L !== null) {
        switch (L.$$typeof) {
          case mu:
            return h = h.get(L.key === null ? g : L.key) || null, u(m, h, L, I);
          case Io:
            return h = h.get(L.key === null ? g : L.key) || null, s(m, h, L, I);
          case kn:
            return L = fr(L), p(h, m, g, L, I);
        }
        if (Ao(L) || bo(L)) return h = h.get(g) || null, c(m, h, L, I, null);
        if (typeof L.then == "function") return p(h, m, g, wu(L), I);
        if (L.$$typeof === Wa) return p(h, m, g, ku(m, L), I);
        Su(m, L);
      }
      return null;
    }
    function x(h, m, g, L) {
      for (var I = null, k = null, S = m, A = m = 0, R = null; S !== null && A < g.length; A++) {
        S.index > A ? (R = S, S = null) : R = S.sibling;
        var w = d(h, S, g[A], L);
        if (w === null) {
          S === null && (S = R);
          break;
        }
        e && S && w.alternate === null && t(h, S), m = l(w, m, A), k === null ? I = w : k.sibling = w, k = w, S = R;
      }
      if (A === g.length) return a(h, S), xe && Za(h, A), I;
      if (S === null) {
        for (; A < g.length; A++) S = f(h, g[A], L), S !== null && (m = l(S, m, A), k === null ? I = S : k.sibling = S, k = S);
        return xe && Za(h, A), I;
      }
      for (S = n(S); A < g.length; A++) R = p(S, h, A, g[A], L), R !== null && (e && R.alternate !== null && S.delete(R.key === null ? A : R.key), m = l(R, m, A), k === null ? I = R : k.sibling = R, k = R);
      return e && S.forEach(function (N) {
        return t(h, N);
      }), xe && Za(h, A), I;
    }
    function b(h, m, g, L) {
      if (g == null) throw Error(B(151));
      for (var I = null, k = null, S = m, A = m = 0, R = null, w = g.next(); S !== null && !w.done; A++, w = g.next()) {
        S.index > A ? (R = S, S = null) : R = S.sibling;
        var N = d(h, S, w.value, L);
        if (N === null) {
          S === null && (S = R);
          break;
        }
        e && S && N.alternate === null && t(h, S), m = l(N, m, A), k === null ? I = N : k.sibling = N, k = N, S = R;
      }
      if (w.done) return a(h, S), xe && Za(h, A), I;
      if (S === null) {
        for (; !w.done; A++, w = g.next()) w = f(h, w.value, L), w !== null && (m = l(w, m, A), k === null ? I = w : k.sibling = w, k = w);
        return xe && Za(h, A), I;
      }
      for (S = n(S); !w.done; A++, w = g.next()) w = p(S, h, A, w.value, L), w !== null && (e && w.alternate !== null && S.delete(w.key === null ? A : w.key), m = l(w, m, A), k === null ? I = w : k.sibling = w, k = w);
      return e && S.forEach(function ($) {
        return t(h, $);
      }), xe && Za(h, A), I;
    }
    function C(h, m, g, L) {
      if (typeof g == "object" && g !== null && g.type === ul && g.key === null && (g = g.props.children), typeof g == "object" && g !== null) {
        switch (g.$$typeof) {
          case mu:
            e: {
              for (var I = g.key; m !== null;) {
                if (m.key === I) {
                  if (I = g.type, I === ul) {
                    if (m.tag === 7) {
                      a(h, m.sibling), L = r(m, g.props.children), L.return = h, h = L;
                      break e;
                    }
                  } else if (m.elementType === I || typeof I == "object" && I !== null && I.$$typeof === kn && fr(I) === m.type) {
                    a(h, m.sibling), L = r(m, g.props), Lo(L, g), L.return = h, h = L;
                    break e;
                  }
                  a(h, m);
                  break;
                } else t(h, m);
                m = m.sibling;
              }
              g.type === ul ? (L = mr(g.props.children, h.mode, L, g.key), L.return = h, h = L) : (L = Ou(g.type, g.key, g.props, null, h.mode, L), Lo(L, g), L.return = h, h = L);
            }
            return o(h);
          case Io:
            e: {
              for (I = g.key; m !== null;) {
                if (m.key === I) {
                  if (m.tag === 4 && m.stateNode.containerInfo === g.containerInfo && m.stateNode.implementation === g.implementation) {
                    a(h, m.sibling), L = r(m, g.children || []), L.return = h, h = L;
                    break e;
                  } else {
                    a(h, m);
                    break;
                  }
                } else t(h, m);
                m = m.sibling;
              }
              L = mf(g, h.mode, L), L.return = h, h = L;
            }
            return o(h);
          case kn:
            return g = fr(g), C(h, m, g, L);
        }
        if (Ao(g)) return x(h, m, g, L);
        if (bo(g)) {
          if (I = bo(g), typeof I != "function") throw Error(B(150));
          return g = I.call(g), b(h, m, g, L);
        }
        if (typeof g.then == "function") return C(h, m, wu(g), L);
        if (g.$$typeof === Wa) return C(h, m, ku(h, g), L);
        Su(h, g);
      }
      return typeof g == "string" && g !== "" || typeof g == "number" || typeof g == "bigint" ? (g = "" + g, m !== null && m.tag === 6 ? (a(h, m.sibling), L = r(m, g), L.return = h, h = L) : (a(h, m), L = pf(g, h.mode, L), L.return = h, h = L), o(h)) : a(h, m);
    }
    return function (h, m, g, L) {
      try {
        Ko = 0;
        var I = C(h, m, g, L);
        return Sl = null, I;
      } catch (S) {
        if (S === Hl || S === Ts) throw S;
        var k = Wt(29, S, null, h.mode);
        return k.lanes = L, k.return = h, k;
      }
    };
  }
  var vr = sy(!0),
    cy = sy(!1),
    wn = !1;
  function Kd(e) {
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
  function nd(e, t) {
    e = e.updateQueue, t.updateQueue === e && (t.updateQueue = {
      baseState: e.baseState,
      firstBaseUpdate: e.firstBaseUpdate,
      lastBaseUpdate: e.lastBaseUpdate,
      shared: e.shared,
      callbacks: null
    });
  }
  function zn(e) {
    return {
      lane: e,
      tag: 0,
      payload: null,
      callback: null,
      next: null
    };
  }
  function On(e, t, a) {
    var n = e.updateQueue;
    if (n === null) return null;
    if (n = n.shared, (be & 2) !== 0) {
      var r = n.pending;
      return r === null ? t.next = t : (t.next = r.next, r.next = t), n.pending = t, t = $u(e), ty(e, null, a), t;
    }
    return As(e, n, t, a), $u(e);
  }
  function zo(e, t, a) {
    if (t = t.updateQueue, t !== null && (t = t.shared, (a & 4194048) !== 0)) {
      var n = t.lanes;
      n &= e.pendingLanes, a |= n, t.lanes = a, Tx(e, a);
    }
  }
  function gf(e, t) {
    var a = e.updateQueue,
      n = e.alternate;
    if (n !== null && (n = n.updateQueue, a === n)) {
      var r = null,
        l = null;
      if (a = a.firstBaseUpdate, a !== null) {
        do {
          var o = {
            lane: a.lane,
            tag: a.tag,
            payload: a.payload,
            callback: null,
            next: null
          };
          l === null ? r = l = o : l = l.next = o, a = a.next;
        } while (a !== null);
        l === null ? r = l = t : l = l.next = t;
      } else r = l = t;
      a = {
        baseState: n.baseState,
        firstBaseUpdate: r,
        lastBaseUpdate: l,
        shared: n.shared,
        callbacks: n.callbacks
      }, e.updateQueue = a;
      return;
    }
    e = a.lastBaseUpdate, e === null ? a.firstBaseUpdate = t : e.next = t, a.lastBaseUpdate = t;
  }
  var rd = !1;
  function Oo() {
    if (rd) {
      var e = wl;
      if (e !== null) throw e;
    }
  }
  function Po(e, t, a, n) {
    rd = !1;
    var r = e.updateQueue;
    wn = !1;
    var l = r.firstBaseUpdate,
      o = r.lastBaseUpdate,
      i = r.shared.pending;
    if (i !== null) {
      r.shared.pending = null;
      var u = i,
        s = u.next;
      u.next = null, o === null ? l = s : o.next = s, o = u;
      var c = e.alternate;
      c !== null && (c = c.updateQueue, i = c.lastBaseUpdate, i !== o && (i === null ? c.firstBaseUpdate = s : i.next = s, c.lastBaseUpdate = u));
    }
    if (l !== null) {
      var f = r.baseState;
      o = 0, c = s = u = null, i = l;
      do {
        var d = i.lane & -536870913,
          p = d !== i.lane;
        if (p ? (ge & d) === d : (n & d) === d) {
          d !== 0 && d === Dl && (rd = !0), c !== null && (c = c.next = {
            lane: 0,
            tag: i.tag,
            payload: i.payload,
            callback: null,
            next: null
          });
          e: {
            var x = e,
              b = i;
            d = t;
            var C = a;
            switch (b.tag) {
              case 1:
                if (x = b.payload, typeof x == "function") {
                  f = x.call(C, f, d);
                  break e;
                }
                f = x;
                break e;
              case 3:
                x.flags = x.flags & -65537 | 128;
              case 0:
                if (x = b.payload, d = typeof x == "function" ? x.call(C, f, d) : x, d == null) break e;
                f = qe({}, f, d);
                break e;
              case 2:
                wn = !0;
            }
          }
          d = i.callback, d !== null && (e.flags |= 64, p && (e.flags |= 8192), p = r.callbacks, p === null ? r.callbacks = [d] : p.push(d));
        } else p = {
          lane: d,
          tag: i.tag,
          payload: i.payload,
          callback: i.callback,
          next: null
        }, c === null ? (s = c = p, u = f) : c = c.next = p, o |= d;
        if (i = i.next, i === null) {
          if (i = r.shared.pending, i === null) break;
          p = i, i = p.next, p.next = null, r.lastBaseUpdate = p, r.shared.pending = null;
        }
      } while (!0);
      c === null && (u = f), r.baseState = u, r.firstBaseUpdate = s, r.lastBaseUpdate = c, l === null && (r.shared.lanes = 0), Xn |= o, e.lanes = o, e.memoizedState = f;
    }
  }
  function fy(e, t) {
    if (typeof e != "function") throw Error(B(191, e));
    e.call(t);
  }
  function dy(e, t) {
    var a = e.callbacks;
    if (a !== null) for (e.callbacks = null, e = 0; e < a.length; e++) fy(a[e], t);
  }
  var Bl = Na(null),
    ns = Na(0);
  function Lg(e, t) {
    e = un, Ne(ns, e), Ne(Bl, t), un = e | t.baseLanes;
  }
  function ld() {
    Ne(ns, un), Ne(Bl, Bl.current);
  }
  function Wd() {
    un = ns.current, xt(Bl), xt(ns);
  }
  var ra = Na(null),
    ma = null;
  function Cn(e) {
    var t = e.alternate;
    Ne(et, et.current & 1), Ne(ra, e), ma === null && (t === null || Bl.current !== null || t.memoizedState !== null) && (ma = e);
  }
  function od(e) {
    Ne(et, et.current), Ne(ra, e), ma === null && (ma = e);
  }
  function py(e) {
    e.tag === 22 ? (Ne(et, et.current), Ne(ra, e), ma === null && (ma = e)) : In(e);
  }
  function In() {
    Ne(et, et.current), Ne(ra, ra.current);
  }
  function Kt(e) {
    xt(ra), ma === e && (ma = null), xt(et);
  }
  var et = Na(0);
  function rs(e) {
    for (var t = e; t !== null;) {
      if (t.tag === 13) {
        var a = t.memoizedState;
        if (a !== null && (a = a.dehydrated, a === null || Cd(a) || Id(a))) return t;
      } else if (t.tag === 19 && (t.memoizedProps.revealOrder === "forwards" || t.memoizedProps.revealOrder === "backwards" || t.memoizedProps.revealOrder === "unstable_legacy-backwards" || t.memoizedProps.revealOrder === "together")) {
        if ((t.flags & 128) !== 0) return t;
      } else if (t.child !== null) {
        t.child.return = t, t = t.child;
        continue;
      }
      if (t === e) break;
      for (; t.sibling === null;) {
        if (t.return === null || t.return === e) return null;
        t = t.return;
      }
      t.sibling.return = t.return, t = t.sibling;
    }
    return null;
  }
  var rn = 0,
    ne = null,
    Te = null,
    lt = null,
    ls = !1,
    Cl = !1,
    Lr = !1,
    os = 0,
    Wo = 0,
    Il = null,
    Jw = 0;
  function Qe() {
    throw Error(B(321));
  }
  function Jd(e, t) {
    if (t === null) return !1;
    for (var a = 0; a < t.length && a < e.length; a++) if (!na(e[a], t[a])) return !1;
    return !0;
  }
  function $d(e, t, a, n, r, l) {
    return rn = l, ne = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, ee.H = e === null || e.memoizedState === null ? Vy : cp, Lr = !1, l = a(n, r), Lr = !1, Cl && (l = hy(t, a, n, r)), my(e), l;
  }
  function my(e) {
    ee.H = Jo;
    var t = Te !== null && Te.next !== null;
    if (rn = 0, lt = Te = ne = null, ls = !1, Wo = 0, Il = null, t) throw Error(B(300));
    e === null || ut || (e = e.dependencies, e !== null && ts(e) && (ut = !0));
  }
  function hy(e, t, a, n) {
    ne = e;
    var r = 0;
    do {
      if (Cl && (Il = null), Wo = 0, Cl = !1, 25 <= r) throw Error(B(301));
      if (r += 1, lt = Te = null, e.updateQueue != null) {
        var l = e.updateQueue;
        l.lastEffect = null, l.events = null, l.stores = null, l.memoCache != null && (l.memoCache.index = 0);
      }
      ee.H = Xy, l = t(a, n);
    } while (Cl);
    return l;
  }
  function $w() {
    var e = ee.H,
      t = e.useState()[0];
    return t = typeof t.then == "function" ? fi(t) : t, e = e.useState()[0], (Te !== null ? Te.memoizedState : null) !== e && (ne.flags |= 1024), t;
  }
  function ep() {
    var e = os !== 0;
    return os = 0, e;
  }
  function tp(e, t, a) {
    t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~a;
  }
  function ap(e) {
    if (ls) {
      for (e = e.memoizedState; e !== null;) {
        var t = e.queue;
        t !== null && (t.pending = null), e = e.next;
      }
      ls = !1;
    }
    rn = 0, lt = Te = ne = null, Cl = !1, Wo = os = 0, Il = null;
  }
  function Nt() {
    var e = {
      memoizedState: null,
      baseState: null,
      baseQueue: null,
      queue: null,
      next: null
    };
    return lt === null ? ne.memoizedState = lt = e : lt = lt.next = e, lt;
  }
  function tt() {
    if (Te === null) {
      var e = ne.alternate;
      e = e !== null ? e.memoizedState : null;
    } else e = Te.next;
    var t = lt === null ? ne.memoizedState : lt.next;
    if (t !== null) lt = t, Te = e;else {
      if (e === null) throw ne.alternate === null ? Error(B(467)) : Error(B(310));
      Te = e, e = {
        memoizedState: Te.memoizedState,
        baseState: Te.baseState,
        baseQueue: Te.baseQueue,
        queue: Te.queue,
        next: null
      }, lt === null ? ne.memoizedState = lt = e : lt = lt.next = e;
    }
    return lt;
  }
  function Ms() {
    return {
      lastEffect: null,
      events: null,
      stores: null,
      memoCache: null
    };
  }
  function fi(e) {
    var t = Wo;
    return Wo += 1, Il === null && (Il = []), e = uy(Il, e, t), t = ne, (lt === null ? t.memoizedState : lt.next) === null && (t = t.alternate, ee.H = t === null || t.memoizedState === null ? Vy : cp), e;
  }
  function Ds(e) {
    if (e !== null && typeof e == "object") {
      if (typeof e.then == "function") return fi(e);
      if (e.$$typeof === Wa) return St(e);
    }
    throw Error(B(438, String(e)));
  }
  function np(e) {
    var t = null,
      a = ne.updateQueue;
    if (a !== null && (t = a.memoCache), t == null) {
      var n = ne.alternate;
      n !== null && (n = n.updateQueue, n !== null && (n = n.memoCache, n != null && (t = {
        data: n.data.map(function (r) {
          return r.slice();
        }),
        index: 0
      })));
    }
    if (t == null && (t = {
      data: [],
      index: 0
    }), a === null && (a = Ms(), ne.updateQueue = a), a.memoCache = t, a = t.data[t.index], a === void 0) for (a = t.data[t.index] = Array(e), n = 0; n < e; n++) a[n] = Uk;
    return t.index++, a;
  }
  function ln(e, t) {
    return typeof t == "function" ? t(e) : t;
  }
  function Uu(e) {
    var t = tt();
    return rp(t, Te, e);
  }
  function rp(e, t, a) {
    var n = e.queue;
    if (n === null) throw Error(B(311));
    n.lastRenderedReducer = a;
    var r = e.baseQueue,
      l = n.pending;
    if (l !== null) {
      if (r !== null) {
        var o = r.next;
        r.next = l.next, l.next = o;
      }
      t.baseQueue = r = l, n.pending = null;
    }
    if (l = e.baseState, r === null) e.memoizedState = l;else {
      t = r.next;
      var i = o = null,
        u = null,
        s = t,
        c = !1;
      do {
        var f = s.lane & -536870913;
        if (f !== s.lane ? (ge & f) === f : (rn & f) === f) {
          var d = s.revertLane;
          if (d === 0) u !== null && (u = u.next = {
            lane: 0,
            revertLane: 0,
            gesture: null,
            action: s.action,
            hasEagerState: s.hasEagerState,
            eagerState: s.eagerState,
            next: null
          }), f === Dl && (c = !0);else if ((rn & d) === d) {
            s = s.next, d === Dl && (c = !0);
            continue;
          } else f = {
            lane: 0,
            revertLane: s.revertLane,
            gesture: null,
            action: s.action,
            hasEagerState: s.hasEagerState,
            eagerState: s.eagerState,
            next: null
          }, u === null ? (i = u = f, o = l) : u = u.next = f, ne.lanes |= d, Xn |= d;
          f = s.action, Lr && a(l, f), l = s.hasEagerState ? s.eagerState : a(l, f);
        } else d = {
          lane: f,
          revertLane: s.revertLane,
          gesture: s.gesture,
          action: s.action,
          hasEagerState: s.hasEagerState,
          eagerState: s.eagerState,
          next: null
        }, u === null ? (i = u = d, o = l) : u = u.next = d, ne.lanes |= f, Xn |= f;
        s = s.next;
      } while (s !== null && s !== t);
      if (u === null ? o = l : u.next = i, !na(l, e.memoizedState) && (ut = !0, c && (a = wl, a !== null))) throw a;
      e.memoizedState = l, e.baseState = o, e.baseQueue = u, n.lastRenderedState = l;
    }
    return r === null && (n.lanes = 0), [e.memoizedState, n.dispatch];
  }
  function xf(e) {
    var t = tt(),
      a = t.queue;
    if (a === null) throw Error(B(311));
    a.lastRenderedReducer = e;
    var n = a.dispatch,
      r = a.pending,
      l = t.memoizedState;
    if (r !== null) {
      a.pending = null;
      var o = r = r.next;
      do l = e(l, o.action), o = o.next; while (o !== r);
      na(l, t.memoizedState) || (ut = !0), t.memoizedState = l, t.baseQueue === null && (t.baseState = l), a.lastRenderedState = l;
    }
    return [l, n];
  }
  function gy(e, t, a) {
    var n = ne,
      r = tt(),
      l = xe;
    if (l) {
      if (a === void 0) throw Error(B(407));
      a = a();
    } else a = t();
    var o = !na((Te || r).memoizedState, a);
    if (o && (r.memoizedState = a, ut = !0), r = r.queue, lp(by.bind(null, n, r, e), [e]), r.getSnapshot !== t || o || lt !== null && lt.memoizedState.tag & 1) {
      if (n.flags |= 2048, El(9, {
        destroy: void 0
      }, yy.bind(null, n, r, a, t), null), Be === null) throw Error(B(349));
      l || (rn & 127) !== 0 || xy(n, t, a);
    }
    return a;
  }
  function xy(e, t, a) {
    e.flags |= 16384, e = {
      getSnapshot: t,
      value: a
    }, t = ne.updateQueue, t === null ? (t = Ms(), ne.updateQueue = t, t.stores = [e]) : (a = t.stores, a === null ? t.stores = [e] : a.push(e));
  }
  function yy(e, t, a, n) {
    t.value = a, t.getSnapshot = n, vy(t) && Ly(e);
  }
  function by(e, t, a) {
    return a(function () {
      vy(t) && Ly(e);
    });
  }
  function vy(e) {
    var t = e.getSnapshot;
    e = e.value;
    try {
      var a = t();
      return !na(e, a);
    } catch {
      return !0;
    }
  }
  function Ly(e) {
    var t = Ir(e, 2);
    t !== null && Ht(t, e, 2);
  }
  function id(e) {
    var t = Nt();
    if (typeof e == "function") {
      var a = e;
      if (e = a(), Lr) {
        Tn(!0);
        try {
          a();
        } finally {
          Tn(!1);
        }
      }
    }
    return t.memoizedState = t.baseState = e, t.queue = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: ln,
      lastRenderedState: e
    }, t;
  }
  function ky(e, t, a, n) {
    return e.baseState = a, rp(e, Te, typeof n == "function" ? n : ln);
  }
  function eS(e, t, a, n, r) {
    if (Es(e)) throw Error(B(485));
    if (e = t.action, e !== null) {
      var l = {
        payload: r,
        action: e,
        next: null,
        isTransition: !0,
        status: "pending",
        value: null,
        reason: null,
        listeners: [],
        then: function (o) {
          l.listeners.push(o);
        }
      };
      ee.T !== null ? a(!0) : l.isTransition = !1, n(l), a = t.pending, a === null ? (l.next = t.pending = l, wy(t, l)) : (l.next = a.next, t.pending = a.next = l);
    }
  }
  function wy(e, t) {
    var a = t.action,
      n = t.payload,
      r = e.state;
    if (t.isTransition) {
      var l = ee.T,
        o = {};
      ee.T = o;
      try {
        var i = a(r, n),
          u = ee.S;
        u !== null && u(o, i), kg(e, t, i);
      } catch (s) {
        ud(e, t, s);
      } finally {
        l !== null && o.types !== null && (l.types = o.types), ee.T = l;
      }
    } else try {
      l = a(r, n), kg(e, t, l);
    } catch (s) {
      ud(e, t, s);
    }
  }
  function kg(e, t, a) {
    a !== null && typeof a == "object" && typeof a.then == "function" ? a.then(function (n) {
      wg(e, t, n);
    }, function (n) {
      return ud(e, t, n);
    }) : wg(e, t, a);
  }
  function wg(e, t, a) {
    t.status = "fulfilled", t.value = a, Sy(t), e.state = a, t = e.pending, t !== null && (a = t.next, a === t ? e.pending = null : (a = a.next, t.next = a, wy(e, a)));
  }
  function ud(e, t, a) {
    var n = e.pending;
    if (e.pending = null, n !== null) {
      n = n.next;
      do t.status = "rejected", t.reason = a, Sy(t), t = t.next; while (t !== n);
    }
    e.action = null;
  }
  function Sy(e) {
    e = e.listeners;
    for (var t = 0; t < e.length; t++) (0, e[t])();
  }
  function Cy(e, t) {
    return t;
  }
  function Sg(e, t) {
    if (xe) {
      var a = Be.formState;
      if (a !== null) {
        e: {
          var n = ne;
          if (xe) {
            if (Ue) {
              t: {
                for (var r = Ue, l = pa; r.nodeType !== 8;) {
                  if (!l) {
                    r = null;
                    break t;
                  }
                  if (r = ha(r.nextSibling), r === null) {
                    r = null;
                    break t;
                  }
                }
                l = r.data, r = l === "F!" || l === "F" ? r : null;
              }
              if (r) {
                Ue = ha(r.nextSibling), n = r.data === "F!";
                break e;
              }
            }
            Gn(n);
          }
          n = !1;
        }
        n && (t = a[0]);
      }
    }
    return a = Nt(), a.memoizedState = a.baseState = t, n = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: Cy,
      lastRenderedState: t
    }, a.queue = n, a = Hy.bind(null, ne, n), n.dispatch = a, n = id(!1), l = sp.bind(null, ne, !1, n.queue), n = Nt(), r = {
      state: t,
      dispatch: null,
      action: e,
      pending: null
    }, n.queue = r, a = eS.bind(null, ne, r, l, a), r.dispatch = a, n.memoizedState = e, [t, a, !1];
  }
  function Cg(e) {
    var t = tt();
    return Iy(t, Te, e);
  }
  function Iy(e, t, a) {
    if (t = rp(e, t, Cy)[0], e = Uu(ln)[0], typeof t == "object" && t !== null && typeof t.then == "function") try {
      var n = fi(t);
    } catch (o) {
      throw o === Hl ? Ts : o;
    } else n = t;
    t = tt();
    var r = t.queue,
      l = r.dispatch;
    return a !== t.memoizedState && (ne.flags |= 2048, El(9, {
      destroy: void 0
    }, tS.bind(null, r, a), null)), [n, l, e];
  }
  function tS(e, t) {
    e.action = t;
  }
  function Ig(e) {
    var t = tt(),
      a = Te;
    if (a !== null) return Iy(t, a, e);
    tt(), t = t.memoizedState, a = tt();
    var n = a.queue.dispatch;
    return a.memoizedState = e, [t, n, !1];
  }
  function El(e, t, a, n) {
    return e = {
      tag: e,
      create: a,
      deps: n,
      inst: t,
      next: null
    }, t = ne.updateQueue, t === null && (t = Ms(), ne.updateQueue = t), a = t.lastEffect, a === null ? t.lastEffect = e.next = e : (n = a.next, a.next = e, e.next = n, t.lastEffect = e), e;
  }
  function Ay() {
    return tt().memoizedState;
  }
  function qu(e, t, a, n) {
    var r = Nt();
    ne.flags |= e, r.memoizedState = El(1 | t, {
      destroy: void 0
    }, a, n === void 0 ? null : n);
  }
  function Bs(e, t, a, n) {
    var r = tt();
    n = n === void 0 ? null : n;
    var l = r.memoizedState.inst;
    Te !== null && n !== null && Jd(n, Te.memoizedState.deps) ? r.memoizedState = El(t, l, a, n) : (ne.flags |= e, r.memoizedState = El(1 | t, l, a, n));
  }
  function Ag(e, t) {
    qu(8390656, 8, e, t);
  }
  function lp(e, t) {
    Bs(2048, 8, e, t);
  }
  function aS(e) {
    ne.flags |= 4;
    var t = ne.updateQueue;
    if (t === null) t = Ms(), ne.updateQueue = t, t.events = [e];else {
      var a = t.events;
      a === null ? t.events = [e] : a.push(e);
    }
  }
  function Ty(e) {
    var t = tt().memoizedState;
    return aS({
      ref: t,
      nextImpl: e
    }), function () {
      if ((be & 2) !== 0) throw Error(B(440));
      return t.impl.apply(void 0, arguments);
    };
  }
  function My(e, t) {
    return Bs(4, 2, e, t);
  }
  function Dy(e, t) {
    return Bs(4, 4, e, t);
  }
  function By(e, t) {
    if (typeof t == "function") {
      e = e();
      var a = t(e);
      return function () {
        typeof a == "function" ? a() : t(null);
      };
    }
    if (t != null) return e = e(), t.current = e, function () {
      t.current = null;
    };
  }
  function Ey(e, t, a) {
    a = a != null ? a.concat([e]) : null, Bs(4, 4, By.bind(null, t, e), a);
  }
  function op() {}
  function Ry(e, t) {
    var a = tt();
    t = t === void 0 ? null : t;
    var n = a.memoizedState;
    return t !== null && Jd(t, n[1]) ? n[0] : (a.memoizedState = [e, t], e);
  }
  function Ny(e, t) {
    var a = tt();
    t = t === void 0 ? null : t;
    var n = a.memoizedState;
    if (t !== null && Jd(t, n[1])) return n[0];
    if (n = e(), Lr) {
      Tn(!0);
      try {
        e();
      } finally {
        Tn(!1);
      }
    }
    return a.memoizedState = [n, t], n;
  }
  function ip(e, t, a) {
    return a === void 0 || (rn & 1073741824) !== 0 && (ge & 261930) === 0 ? e.memoizedState = t : (e.memoizedState = a, e = kb(), ne.lanes |= e, Xn |= e, a);
  }
  function zy(e, t, a, n) {
    return na(a, t) ? a : Bl.current !== null ? (e = ip(e, a, n), na(e, t) || (ut = !0), e) : (rn & 42) === 0 || (rn & 1073741824) !== 0 && (ge & 261930) === 0 ? (ut = !0, e.memoizedState = a) : (e = kb(), ne.lanes |= e, Xn |= e, t);
  }
  function Oy(e, t, a, n, r) {
    var l = ve.p;
    ve.p = l !== 0 && 8 > l ? l : 8;
    var o = ee.T,
      i = {};
    ee.T = i, sp(e, !1, t, a);
    try {
      var u = r(),
        s = ee.S;
      if (s !== null && s(i, u), u !== null && typeof u == "object" && typeof u.then == "function") {
        var c = Ww(u, n);
        Uo(e, t, c, aa(e));
      } else Uo(e, t, n, aa(e));
    } catch (f) {
      Uo(e, t, {
        then: function () {},
        status: "rejected",
        reason: f
      }, aa());
    } finally {
      ve.p = l, o !== null && i.types !== null && (o.types = i.types), ee.T = o;
    }
  }
  function nS() {}
  function sd(e, t, a, n) {
    if (e.tag !== 5) throw Error(B(476));
    var r = Py(e).queue;
    Oy(e, r, t, pr, a === null ? nS : function () {
      return Uy(e), a(n);
    });
  }
  function Py(e) {
    var t = e.memoizedState;
    if (t !== null) return t;
    t = {
      memoizedState: pr,
      baseState: pr,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: ln,
        lastRenderedState: pr
      },
      next: null
    };
    var a = {};
    return t.next = {
      memoizedState: a,
      baseState: a,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: ln,
        lastRenderedState: a
      },
      next: null
    }, e.memoizedState = t, e = e.alternate, e !== null && (e.memoizedState = t), t;
  }
  function Uy(e) {
    var t = Py(e);
    t.next === null && (t = e.alternate.memoizedState), Uo(e, t.next.queue, {}, aa());
  }
  function up() {
    return St(ti);
  }
  function qy() {
    return tt().memoizedState;
  }
  function Fy() {
    return tt().memoizedState;
  }
  function rS(e) {
    for (var t = e.return; t !== null;) {
      switch (t.tag) {
        case 24:
        case 3:
          var a = aa();
          e = zn(a);
          var n = On(t, e, a);
          n !== null && (Ht(n, t, a), zo(n, t, a)), t = {
            cache: Yd()
          }, e.payload = t;
          return;
      }
      t = t.return;
    }
  }
  function lS(e, t, a) {
    var n = aa();
    a = {
      lane: n,
      revertLane: 0,
      gesture: null,
      action: a,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, Es(e) ? _y(t, a) : (a = Gd(e, t, a, n), a !== null && (Ht(a, e, n), Gy(a, t, n)));
  }
  function Hy(e, t, a) {
    var n = aa();
    Uo(e, t, a, n);
  }
  function Uo(e, t, a, n) {
    var r = {
      lane: n,
      revertLane: 0,
      gesture: null,
      action: a,
      hasEagerState: !1,
      eagerState: null,
      next: null
    };
    if (Es(e)) _y(t, r);else {
      var l = e.alternate;
      if (e.lanes === 0 && (l === null || l.lanes === 0) && (l = t.lastRenderedReducer, l !== null)) try {
        var o = t.lastRenderedState,
          i = l(o, a);
        if (r.hasEagerState = !0, r.eagerState = i, na(i, o)) return As(e, t, r, 0), Be === null && Is(), !1;
      } catch {}
      if (a = Gd(e, t, r, n), a !== null) return Ht(a, e, n), Gy(a, t, n), !0;
    }
    return !1;
  }
  function sp(e, t, a, n) {
    if (n = {
      lane: 2,
      revertLane: yp(),
      gesture: null,
      action: n,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, Es(e)) {
      if (t) throw Error(B(479));
    } else t = Gd(e, a, n, 2), t !== null && Ht(t, e, 2);
  }
  function Es(e) {
    var t = e.alternate;
    return e === ne || t !== null && t === ne;
  }
  function _y(e, t) {
    Cl = ls = !0;
    var a = e.pending;
    a === null ? t.next = t : (t.next = a.next, a.next = t), e.pending = t;
  }
  function Gy(e, t, a) {
    if ((a & 4194048) !== 0) {
      var n = t.lanes;
      n &= e.pendingLanes, a |= n, t.lanes = a, Tx(e, a);
    }
  }
  var Jo = {
    readContext: St,
    use: Ds,
    useCallback: Qe,
    useContext: Qe,
    useEffect: Qe,
    useImperativeHandle: Qe,
    useLayoutEffect: Qe,
    useInsertionEffect: Qe,
    useMemo: Qe,
    useReducer: Qe,
    useRef: Qe,
    useState: Qe,
    useDebugValue: Qe,
    useDeferredValue: Qe,
    useTransition: Qe,
    useSyncExternalStore: Qe,
    useId: Qe,
    useHostTransitionStatus: Qe,
    useFormState: Qe,
    useActionState: Qe,
    useOptimistic: Qe,
    useMemoCache: Qe,
    useCacheRefresh: Qe
  };
  Jo.useEffectEvent = Qe;
  var Vy = {
      readContext: St,
      use: Ds,
      useCallback: function (e, t) {
        return Nt().memoizedState = [e, t === void 0 ? null : t], e;
      },
      useContext: St,
      useEffect: Ag,
      useImperativeHandle: function (e, t, a) {
        a = a != null ? a.concat([e]) : null, qu(4194308, 4, By.bind(null, t, e), a);
      },
      useLayoutEffect: function (e, t) {
        return qu(4194308, 4, e, t);
      },
      useInsertionEffect: function (e, t) {
        qu(4, 2, e, t);
      },
      useMemo: function (e, t) {
        var a = Nt();
        t = t === void 0 ? null : t;
        var n = e();
        if (Lr) {
          Tn(!0);
          try {
            e();
          } finally {
            Tn(!1);
          }
        }
        return a.memoizedState = [n, t], n;
      },
      useReducer: function (e, t, a) {
        var n = Nt();
        if (a !== void 0) {
          var r = a(t);
          if (Lr) {
            Tn(!0);
            try {
              a(t);
            } finally {
              Tn(!1);
            }
          }
        } else r = t;
        return n.memoizedState = n.baseState = r, e = {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: e,
          lastRenderedState: r
        }, n.queue = e, e = e.dispatch = lS.bind(null, ne, e), [n.memoizedState, e];
      },
      useRef: function (e) {
        var t = Nt();
        return e = {
          current: e
        }, t.memoizedState = e;
      },
      useState: function (e) {
        e = id(e);
        var t = e.queue,
          a = Hy.bind(null, ne, t);
        return t.dispatch = a, [e.memoizedState, a];
      },
      useDebugValue: op,
      useDeferredValue: function (e, t) {
        var a = Nt();
        return ip(a, e, t);
      },
      useTransition: function () {
        var e = id(!1);
        return e = Oy.bind(null, ne, e.queue, !0, !1), Nt().memoizedState = e, [!1, e];
      },
      useSyncExternalStore: function (e, t, a) {
        var n = ne,
          r = Nt();
        if (xe) {
          if (a === void 0) throw Error(B(407));
          a = a();
        } else {
          if (a = t(), Be === null) throw Error(B(349));
          (ge & 127) !== 0 || xy(n, t, a);
        }
        r.memoizedState = a;
        var l = {
          value: a,
          getSnapshot: t
        };
        return r.queue = l, Ag(by.bind(null, n, l, e), [e]), n.flags |= 2048, El(9, {
          destroy: void 0
        }, yy.bind(null, n, l, a, t), null), a;
      },
      useId: function () {
        var e = Nt(),
          t = Be.identifierPrefix;
        if (xe) {
          var a = Ba,
            n = Da;
          a = (n & ~(1 << 32 - ta(n) - 1)).toString(32) + a, t = "_" + t + "R_" + a, a = os++, 0 < a && (t += "H" + a.toString(32)), t += "_";
        } else a = Jw++, t = "_" + t + "r_" + a.toString(32) + "_";
        return e.memoizedState = t;
      },
      useHostTransitionStatus: up,
      useFormState: Sg,
      useActionState: Sg,
      useOptimistic: function (e) {
        var t = Nt();
        t.memoizedState = t.baseState = e;
        var a = {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: null,
          lastRenderedState: null
        };
        return t.queue = a, t = sp.bind(null, ne, !0, a), a.dispatch = t, [e, t];
      },
      useMemoCache: np,
      useCacheRefresh: function () {
        return Nt().memoizedState = rS.bind(null, ne);
      },
      useEffectEvent: function (e) {
        var t = Nt(),
          a = {
            impl: e
          };
        return t.memoizedState = a, function () {
          if ((be & 2) !== 0) throw Error(B(440));
          return a.impl.apply(void 0, arguments);
        };
      }
    },
    cp = {
      readContext: St,
      use: Ds,
      useCallback: Ry,
      useContext: St,
      useEffect: lp,
      useImperativeHandle: Ey,
      useInsertionEffect: My,
      useLayoutEffect: Dy,
      useMemo: Ny,
      useReducer: Uu,
      useRef: Ay,
      useState: function () {
        return Uu(ln);
      },
      useDebugValue: op,
      useDeferredValue: function (e, t) {
        var a = tt();
        return zy(a, Te.memoizedState, e, t);
      },
      useTransition: function () {
        var e = Uu(ln)[0],
          t = tt().memoizedState;
        return [typeof e == "boolean" ? e : fi(e), t];
      },
      useSyncExternalStore: gy,
      useId: qy,
      useHostTransitionStatus: up,
      useFormState: Cg,
      useActionState: Cg,
      useOptimistic: function (e, t) {
        var a = tt();
        return ky(a, Te, e, t);
      },
      useMemoCache: np,
      useCacheRefresh: Fy
    };
  cp.useEffectEvent = Ty;
  var Xy = {
    readContext: St,
    use: Ds,
    useCallback: Ry,
    useContext: St,
    useEffect: lp,
    useImperativeHandle: Ey,
    useInsertionEffect: My,
    useLayoutEffect: Dy,
    useMemo: Ny,
    useReducer: xf,
    useRef: Ay,
    useState: function () {
      return xf(ln);
    },
    useDebugValue: op,
    useDeferredValue: function (e, t) {
      var a = tt();
      return Te === null ? ip(a, e, t) : zy(a, Te.memoizedState, e, t);
    },
    useTransition: function () {
      var e = xf(ln)[0],
        t = tt().memoizedState;
      return [typeof e == "boolean" ? e : fi(e), t];
    },
    useSyncExternalStore: gy,
    useId: qy,
    useHostTransitionStatus: up,
    useFormState: Ig,
    useActionState: Ig,
    useOptimistic: function (e, t) {
      var a = tt();
      return Te !== null ? ky(a, Te, e, t) : (a.baseState = e, [e, a.queue.dispatch]);
    },
    useMemoCache: np,
    useCacheRefresh: Fy
  };
  Xy.useEffectEvent = Ty;
  function yf(e, t, a, n) {
    t = e.memoizedState, a = a(n, t), a = a == null ? t : qe({}, t, a), e.memoizedState = a, e.lanes === 0 && (e.updateQueue.baseState = a);
  }
  var cd = {
    enqueueSetState: function (e, t, a) {
      e = e._reactInternals;
      var n = aa(),
        r = zn(n);
      r.payload = t, a != null && (r.callback = a), t = On(e, r, n), t !== null && (Ht(t, e, n), zo(t, e, n));
    },
    enqueueReplaceState: function (e, t, a) {
      e = e._reactInternals;
      var n = aa(),
        r = zn(n);
      r.tag = 1, r.payload = t, a != null && (r.callback = a), t = On(e, r, n), t !== null && (Ht(t, e, n), zo(t, e, n));
    },
    enqueueForceUpdate: function (e, t) {
      e = e._reactInternals;
      var a = aa(),
        n = zn(a);
      n.tag = 2, t != null && (n.callback = t), t = On(e, n, a), t !== null && (Ht(t, e, a), zo(t, e, a));
    }
  };
  function Tg(e, t, a, n, r, l, o) {
    return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(n, l, o) : t.prototype && t.prototype.isPureReactComponent ? !Yo(a, n) || !Yo(r, l) : !0;
  }
  function Mg(e, t, a, n) {
    e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(a, n), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(a, n), t.state !== e && cd.enqueueReplaceState(t, t.state, null);
  }
  function kr(e, t) {
    var a = t;
    if ("ref" in t) {
      a = {};
      for (var n in t) n !== "ref" && (a[n] = t[n]);
    }
    if (e = e.defaultProps) {
      a === t && (a = qe({}, a));
      for (var r in e) a[r] === void 0 && (a[r] = e[r]);
    }
    return a;
  }
  function jy(e) {
    Ju(e);
  }
  function Yy(e) {
    console.error(e);
  }
  function Qy(e) {
    Ju(e);
  }
  function is(e, t) {
    try {
      var a = e.onUncaughtError;
      a(t.value, {
        componentStack: t.stack
      });
    } catch (n) {
      setTimeout(function () {
        throw n;
      });
    }
  }
  function Dg(e, t, a) {
    try {
      var n = e.onCaughtError;
      n(a.value, {
        componentStack: a.stack,
        errorBoundary: t.tag === 1 ? t.stateNode : null
      });
    } catch (r) {
      setTimeout(function () {
        throw r;
      });
    }
  }
  function fd(e, t, a) {
    return a = zn(a), a.tag = 3, a.payload = {
      element: null
    }, a.callback = function () {
      is(e, t);
    }, a;
  }
  function Zy(e) {
    return e = zn(e), e.tag = 3, e;
  }
  function Ky(e, t, a, n) {
    var r = a.type.getDerivedStateFromError;
    if (typeof r == "function") {
      var l = n.value;
      e.payload = function () {
        return r(l);
      }, e.callback = function () {
        Dg(t, a, n);
      };
    }
    var o = a.stateNode;
    o !== null && typeof o.componentDidCatch == "function" && (e.callback = function () {
      Dg(t, a, n), typeof r != "function" && (Pn === null ? Pn = new Set([this]) : Pn.add(this));
      var i = n.stack;
      this.componentDidCatch(n.value, {
        componentStack: i !== null ? i : ""
      });
    });
  }
  function oS(e, t, a, n, r) {
    if (a.flags |= 32768, n !== null && typeof n == "object" && typeof n.then == "function") {
      if (t = a.alternate, t !== null && Fl(t, a, r, !0), a = ra.current, a !== null) {
        switch (a.tag) {
          case 31:
          case 13:
            return ma === null ? ds() : a.alternate === null && Ze === 0 && (Ze = 3), a.flags &= -257, a.flags |= 65536, a.lanes = r, n === as ? a.flags |= 16384 : (t = a.updateQueue, t === null ? a.updateQueue = new Set([n]) : t.add(n), Mf(e, n, r)), !1;
          case 22:
            return a.flags |= 65536, n === as ? a.flags |= 16384 : (t = a.updateQueue, t === null ? (t = {
              transitions: null,
              markerInstances: null,
              retryQueue: new Set([n])
            }, a.updateQueue = t) : (a = t.retryQueue, a === null ? t.retryQueue = new Set([n]) : a.add(n)), Mf(e, n, r)), !1;
        }
        throw Error(B(435, a.tag));
      }
      return Mf(e, n, r), ds(), !1;
    }
    if (xe) return t = ra.current, t !== null ? ((t.flags & 65536) === 0 && (t.flags |= 256), t.flags |= 65536, t.lanes = r, n !== Jf && (e = Error(B(422), {
      cause: n
    }), Zo(da(e, a)))) : (n !== Jf && (t = Error(B(423), {
      cause: n
    }), Zo(da(t, a))), e = e.current.alternate, e.flags |= 65536, r &= -r, e.lanes |= r, n = da(n, a), r = fd(e.stateNode, n, r), gf(e, r), Ze !== 4 && (Ze = 2)), !1;
    var l = Error(B(520), {
      cause: n
    });
    if (l = da(l, a), Ho === null ? Ho = [l] : Ho.push(l), Ze !== 4 && (Ze = 2), t === null) return !0;
    n = da(n, a), a = t;
    do {
      switch (a.tag) {
        case 3:
          return a.flags |= 65536, e = r & -r, a.lanes |= e, e = fd(a.stateNode, n, e), gf(a, e), !1;
        case 1:
          if (t = a.type, l = a.stateNode, (a.flags & 128) === 0 && (typeof t.getDerivedStateFromError == "function" || l !== null && typeof l.componentDidCatch == "function" && (Pn === null || !Pn.has(l)))) return a.flags |= 65536, r &= -r, a.lanes |= r, r = Zy(r), Ky(r, e, a, n), gf(a, r), !1;
      }
      a = a.return;
    } while (a !== null);
    return !1;
  }
  var fp = Error(B(461)),
    ut = !1;
  function Lt(e, t, a, n) {
    t.child = e === null ? cy(t, null, a, n) : vr(t, e.child, a, n);
  }
  function Bg(e, t, a, n, r) {
    a = a.render;
    var l = t.ref;
    if ("ref" in n) {
      var o = {};
      for (var i in n) i !== "ref" && (o[i] = n[i]);
    } else o = n;
    return br(t), n = $d(e, t, a, o, l, r), i = ep(), e !== null && !ut ? (tp(e, t, r), on(e, t, r)) : (xe && i && Xd(t), t.flags |= 1, Lt(e, t, n, r), t.child);
  }
  function Eg(e, t, a, n, r) {
    if (e === null) {
      var l = a.type;
      return typeof l == "function" && !Vd(l) && l.defaultProps === void 0 && a.compare === null ? (t.tag = 15, t.type = l, Wy(e, t, l, n, r)) : (e = Ou(a.type, null, n, t, t.mode, r), e.ref = t.ref, e.return = t, t.child = e);
    }
    if (l = e.child, !dp(e, r)) {
      var o = l.memoizedProps;
      if (a = a.compare, a = a !== null ? a : Yo, a(o, n) && e.ref === t.ref) return on(e, t, r);
    }
    return t.flags |= 1, e = en(l, n), e.ref = t.ref, e.return = t, t.child = e;
  }
  function Wy(e, t, a, n, r) {
    if (e !== null) {
      var l = e.memoizedProps;
      if (Yo(l, n) && e.ref === t.ref) if (ut = !1, t.pendingProps = n = l, dp(e, r)) (e.flags & 131072) !== 0 && (ut = !0);else return t.lanes = e.lanes, on(e, t, r);
    }
    return dd(e, t, a, n, r);
  }
  function Jy(e, t, a, n) {
    var r = n.children,
      l = e !== null ? e.memoizedState : null;
    if (e === null && t.stateNode === null && (t.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }), n.mode === "hidden") {
      if ((t.flags & 128) !== 0) {
        if (l = l !== null ? l.baseLanes | a : a, e !== null) {
          for (n = t.child = e.child, r = 0; n !== null;) r = r | n.lanes | n.childLanes, n = n.sibling;
          n = r & ~l;
        } else n = 0, t.child = null;
        return Rg(e, t, l, a, n);
      }
      if ((a & 536870912) !== 0) t.memoizedState = {
        baseLanes: 0,
        cachePool: null
      }, e !== null && Pu(t, l !== null ? l.cachePool : null), l !== null ? Lg(t, l) : ld(), py(t);else return n = t.lanes = 536870912, Rg(e, t, l !== null ? l.baseLanes | a : a, a, n);
    } else l !== null ? (Pu(t, l.cachePool), Lg(t, l), In(t), t.memoizedState = null) : (e !== null && Pu(t, null), ld(), In(t));
    return Lt(e, t, r, a), t.child;
  }
  function Mo(e, t) {
    return e !== null && e.tag === 22 || t.stateNode !== null || (t.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }), t.sibling;
  }
  function Rg(e, t, a, n, r) {
    var l = Qd();
    return l = l === null ? null : {
      parent: it._currentValue,
      pool: l
    }, t.memoizedState = {
      baseLanes: a,
      cachePool: l
    }, e !== null && Pu(t, null), ld(), py(t), e !== null && Fl(e, t, n, !0), t.childLanes = r, null;
  }
  function Fu(e, t) {
    return t = us({
      mode: t.mode,
      children: t.children
    }, e.mode), t.ref = e.ref, e.child = t, t.return = e, t;
  }
  function Ng(e, t, a) {
    return vr(t, e.child, null, a), e = Fu(t, t.pendingProps), e.flags |= 2, Kt(t), t.memoizedState = null, e;
  }
  function iS(e, t, a) {
    var n = t.pendingProps,
      r = (t.flags & 128) !== 0;
    if (t.flags &= -129, e === null) {
      if (xe) {
        if (n.mode === "hidden") return e = Fu(t, n), t.lanes = 536870912, Mo(null, e);
        if (od(t), (e = Ue) ? (e = Vb(e, pa), e = e !== null && e.data === "&" ? e : null, e !== null && (t.memoizedState = {
          dehydrated: e,
          treeContext: _n !== null ? {
            id: Da,
            overflow: Ba
          } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, a = ny(e), a.return = t, t.child = a, wt = t, Ue = null)) : e = null, e === null) throw Gn(t);
        return t.lanes = 536870912, null;
      }
      return Fu(t, n);
    }
    var l = e.memoizedState;
    if (l !== null) {
      var o = l.dehydrated;
      if (od(t), r) {
        if (t.flags & 256) t.flags &= -257, t = Ng(e, t, a);else if (t.memoizedState !== null) t.child = e.child, t.flags |= 128, t = null;else throw Error(B(558));
      } else if (ut || Fl(e, t, a, !1), r = (a & e.childLanes) !== 0, ut || r) {
        if (n = Be, n !== null && (o = Mx(n, a), o !== 0 && o !== l.retryLane)) throw l.retryLane = o, Ir(e, o), Ht(n, e, o), fp;
        ds(), t = Ng(e, t, a);
      } else e = l.treeContext, Ue = ha(o.nextSibling), wt = t, xe = !0, Nn = null, pa = !1, e !== null && ly(t, e), t = Fu(t, n), t.flags |= 4096;
      return t;
    }
    return e = en(e.child, {
      mode: n.mode,
      children: n.children
    }), e.ref = t.ref, t.child = e, e.return = t, e;
  }
  function Hu(e, t) {
    var a = t.ref;
    if (a === null) e !== null && e.ref !== null && (t.flags |= 4194816);else {
      if (typeof a != "function" && typeof a != "object") throw Error(B(284));
      (e === null || e.ref !== a) && (t.flags |= 4194816);
    }
  }
  function dd(e, t, a, n, r) {
    return br(t), a = $d(e, t, a, n, void 0, r), n = ep(), e !== null && !ut ? (tp(e, t, r), on(e, t, r)) : (xe && n && Xd(t), t.flags |= 1, Lt(e, t, a, r), t.child);
  }
  function zg(e, t, a, n, r, l) {
    return br(t), t.updateQueue = null, a = hy(t, n, a, r), my(e), n = ep(), e !== null && !ut ? (tp(e, t, l), on(e, t, l)) : (xe && n && Xd(t), t.flags |= 1, Lt(e, t, a, l), t.child);
  }
  function Og(e, t, a, n, r) {
    if (br(t), t.stateNode === null) {
      var l = gl,
        o = a.contextType;
      typeof o == "object" && o !== null && (l = St(o)), l = new a(n, l), t.memoizedState = l.state !== null && l.state !== void 0 ? l.state : null, l.updater = cd, t.stateNode = l, l._reactInternals = t, l = t.stateNode, l.props = n, l.state = t.memoizedState, l.refs = {}, Kd(t), o = a.contextType, l.context = typeof o == "object" && o !== null ? St(o) : gl, l.state = t.memoizedState, o = a.getDerivedStateFromProps, typeof o == "function" && (yf(t, a, o, n), l.state = t.memoizedState), typeof a.getDerivedStateFromProps == "function" || typeof l.getSnapshotBeforeUpdate == "function" || typeof l.UNSAFE_componentWillMount != "function" && typeof l.componentWillMount != "function" || (o = l.state, typeof l.componentWillMount == "function" && l.componentWillMount(), typeof l.UNSAFE_componentWillMount == "function" && l.UNSAFE_componentWillMount(), o !== l.state && cd.enqueueReplaceState(l, l.state, null), Po(t, n, l, r), Oo(), l.state = t.memoizedState), typeof l.componentDidMount == "function" && (t.flags |= 4194308), n = !0;
    } else if (e === null) {
      l = t.stateNode;
      var i = t.memoizedProps,
        u = kr(a, i);
      l.props = u;
      var s = l.context,
        c = a.contextType;
      o = gl, typeof c == "object" && c !== null && (o = St(c));
      var f = a.getDerivedStateFromProps;
      c = typeof f == "function" || typeof l.getSnapshotBeforeUpdate == "function", i = t.pendingProps !== i, c || typeof l.UNSAFE_componentWillReceiveProps != "function" && typeof l.componentWillReceiveProps != "function" || (i || s !== o) && Mg(t, l, n, o), wn = !1;
      var d = t.memoizedState;
      l.state = d, Po(t, n, l, r), Oo(), s = t.memoizedState, i || d !== s || wn ? (typeof f == "function" && (yf(t, a, f, n), s = t.memoizedState), (u = wn || Tg(t, a, u, n, d, s, o)) ? (c || typeof l.UNSAFE_componentWillMount != "function" && typeof l.componentWillMount != "function" || (typeof l.componentWillMount == "function" && l.componentWillMount(), typeof l.UNSAFE_componentWillMount == "function" && l.UNSAFE_componentWillMount()), typeof l.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof l.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = n, t.memoizedState = s), l.props = n, l.state = s, l.context = o, n = u) : (typeof l.componentDidMount == "function" && (t.flags |= 4194308), n = !1);
    } else {
      l = t.stateNode, nd(e, t), o = t.memoizedProps, c = kr(a, o), l.props = c, f = t.pendingProps, d = l.context, s = a.contextType, u = gl, typeof s == "object" && s !== null && (u = St(s)), i = a.getDerivedStateFromProps, (s = typeof i == "function" || typeof l.getSnapshotBeforeUpdate == "function") || typeof l.UNSAFE_componentWillReceiveProps != "function" && typeof l.componentWillReceiveProps != "function" || (o !== f || d !== u) && Mg(t, l, n, u), wn = !1, d = t.memoizedState, l.state = d, Po(t, n, l, r), Oo();
      var p = t.memoizedState;
      o !== f || d !== p || wn || e !== null && e.dependencies !== null && ts(e.dependencies) ? (typeof i == "function" && (yf(t, a, i, n), p = t.memoizedState), (c = wn || Tg(t, a, c, n, d, p, u) || e !== null && e.dependencies !== null && ts(e.dependencies)) ? (s || typeof l.UNSAFE_componentWillUpdate != "function" && typeof l.componentWillUpdate != "function" || (typeof l.componentWillUpdate == "function" && l.componentWillUpdate(n, p, u), typeof l.UNSAFE_componentWillUpdate == "function" && l.UNSAFE_componentWillUpdate(n, p, u)), typeof l.componentDidUpdate == "function" && (t.flags |= 4), typeof l.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof l.componentDidUpdate != "function" || o === e.memoizedProps && d === e.memoizedState || (t.flags |= 4), typeof l.getSnapshotBeforeUpdate != "function" || o === e.memoizedProps && d === e.memoizedState || (t.flags |= 1024), t.memoizedProps = n, t.memoizedState = p), l.props = n, l.state = p, l.context = u, n = c) : (typeof l.componentDidUpdate != "function" || o === e.memoizedProps && d === e.memoizedState || (t.flags |= 4), typeof l.getSnapshotBeforeUpdate != "function" || o === e.memoizedProps && d === e.memoizedState || (t.flags |= 1024), n = !1);
    }
    return l = n, Hu(e, t), n = (t.flags & 128) !== 0, l || n ? (l = t.stateNode, a = n && typeof a.getDerivedStateFromError != "function" ? null : l.render(), t.flags |= 1, e !== null && n ? (t.child = vr(t, e.child, null, r), t.child = vr(t, null, a, r)) : Lt(e, t, a, r), t.memoizedState = l.state, e = t.child) : e = on(e, t, r), e;
  }
  function Pg(e, t, a, n) {
    return yr(), t.flags |= 256, Lt(e, t, a, n), t.child;
  }
  var bf = {
    dehydrated: null,
    treeContext: null,
    retryLane: 0,
    hydrationErrors: null
  };
  function vf(e) {
    return {
      baseLanes: e,
      cachePool: iy()
    };
  }
  function Lf(e, t, a) {
    return e = e !== null ? e.childLanes & ~a : 0, t && (e |= Jt), e;
  }
  function $y(e, t, a) {
    var n = t.pendingProps,
      r = !1,
      l = (t.flags & 128) !== 0,
      o;
    if ((o = l) || (o = e !== null && e.memoizedState === null ? !1 : (et.current & 2) !== 0), o && (r = !0, t.flags &= -129), o = (t.flags & 32) !== 0, t.flags &= -33, e === null) {
      if (xe) {
        if (r ? Cn(t) : In(t), (e = Ue) ? (e = Vb(e, pa), e = e !== null && e.data !== "&" ? e : null, e !== null && (t.memoizedState = {
          dehydrated: e,
          treeContext: _n !== null ? {
            id: Da,
            overflow: Ba
          } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, a = ny(e), a.return = t, t.child = a, wt = t, Ue = null)) : e = null, e === null) throw Gn(t);
        return Id(e) ? t.lanes = 32 : t.lanes = 536870912, null;
      }
      var i = n.children;
      return n = n.fallback, r ? (In(t), r = t.mode, i = us({
        mode: "hidden",
        children: i
      }, r), n = mr(n, r, a, null), i.return = t, n.return = t, i.sibling = n, t.child = i, n = t.child, n.memoizedState = vf(a), n.childLanes = Lf(e, o, a), t.memoizedState = bf, Mo(null, n)) : (Cn(t), pd(t, i));
    }
    var u = e.memoizedState;
    if (u !== null && (i = u.dehydrated, i !== null)) {
      if (l) t.flags & 256 ? (Cn(t), t.flags &= -257, t = kf(e, t, a)) : t.memoizedState !== null ? (In(t), t.child = e.child, t.flags |= 128, t = null) : (In(t), i = n.fallback, r = t.mode, n = us({
        mode: "visible",
        children: n.children
      }, r), i = mr(i, r, a, null), i.flags |= 2, n.return = t, i.return = t, n.sibling = i, t.child = n, vr(t, e.child, null, a), n = t.child, n.memoizedState = vf(a), n.childLanes = Lf(e, o, a), t.memoizedState = bf, t = Mo(null, n));else if (Cn(t), Id(i)) {
        if (o = i.nextSibling && i.nextSibling.dataset, o) var s = o.dgst;
        o = s, n = Error(B(419)), n.stack = "", n.digest = o, Zo({
          value: n,
          source: null,
          stack: null
        }), t = kf(e, t, a);
      } else if (ut || Fl(e, t, a, !1), o = (a & e.childLanes) !== 0, ut || o) {
        if (o = Be, o !== null && (n = Mx(o, a), n !== 0 && n !== u.retryLane)) throw u.retryLane = n, Ir(e, n), Ht(o, e, n), fp;
        Cd(i) || ds(), t = kf(e, t, a);
      } else Cd(i) ? (t.flags |= 192, t.child = e.child, t = null) : (e = u.treeContext, Ue = ha(i.nextSibling), wt = t, xe = !0, Nn = null, pa = !1, e !== null && ly(t, e), t = pd(t, n.children), t.flags |= 4096);
      return t;
    }
    return r ? (In(t), i = n.fallback, r = t.mode, u = e.child, s = u.sibling, n = en(u, {
      mode: "hidden",
      children: n.children
    }), n.subtreeFlags = u.subtreeFlags & 65011712, s !== null ? i = en(s, i) : (i = mr(i, r, a, null), i.flags |= 2), i.return = t, n.return = t, n.sibling = i, t.child = n, Mo(null, n), n = t.child, i = e.child.memoizedState, i === null ? i = vf(a) : (r = i.cachePool, r !== null ? (u = it._currentValue, r = r.parent !== u ? {
      parent: u,
      pool: u
    } : r) : r = iy(), i = {
      baseLanes: i.baseLanes | a,
      cachePool: r
    }), n.memoizedState = i, n.childLanes = Lf(e, o, a), t.memoizedState = bf, Mo(e.child, n)) : (Cn(t), a = e.child, e = a.sibling, a = en(a, {
      mode: "visible",
      children: n.children
    }), a.return = t, a.sibling = null, e !== null && (o = t.deletions, o === null ? (t.deletions = [e], t.flags |= 16) : o.push(e)), t.child = a, t.memoizedState = null, a);
  }
  function pd(e, t) {
    return t = us({
      mode: "visible",
      children: t
    }, e.mode), t.return = e, e.child = t;
  }
  function us(e, t) {
    return e = Wt(22, e, null, t), e.lanes = 0, e;
  }
  function kf(e, t, a) {
    return vr(t, e.child, null, a), e = pd(t, t.pendingProps.children), e.flags |= 2, t.memoizedState = null, e;
  }
  function Ug(e, t, a) {
    e.lanes |= t;
    var n = e.alternate;
    n !== null && (n.lanes |= t), ed(e.return, t, a);
  }
  function wf(e, t, a, n, r, l) {
    var o = e.memoizedState;
    o === null ? e.memoizedState = {
      isBackwards: t,
      rendering: null,
      renderingStartTime: 0,
      last: n,
      tail: a,
      tailMode: r,
      treeForkCount: l
    } : (o.isBackwards = t, o.rendering = null, o.renderingStartTime = 0, o.last = n, o.tail = a, o.tailMode = r, o.treeForkCount = l);
  }
  function eb(e, t, a) {
    var n = t.pendingProps,
      r = n.revealOrder,
      l = n.tail;
    n = n.children;
    var o = et.current,
      i = (o & 2) !== 0;
    if (i ? (o = o & 1 | 2, t.flags |= 128) : o &= 1, Ne(et, o), Lt(e, t, n, a), n = xe ? Qo : 0, !i && e !== null && (e.flags & 128) !== 0) e: for (e = t.child; e !== null;) {
      if (e.tag === 13) e.memoizedState !== null && Ug(e, a, t);else if (e.tag === 19) Ug(e, a, t);else if (e.child !== null) {
        e.child.return = e, e = e.child;
        continue;
      }
      if (e === t) break e;
      for (; e.sibling === null;) {
        if (e.return === null || e.return === t) break e;
        e = e.return;
      }
      e.sibling.return = e.return, e = e.sibling;
    }
    switch (r) {
      case "forwards":
        for (a = t.child, r = null; a !== null;) e = a.alternate, e !== null && rs(e) === null && (r = a), a = a.sibling;
        a = r, a === null ? (r = t.child, t.child = null) : (r = a.sibling, a.sibling = null), wf(t, !1, r, a, l, n);
        break;
      case "backwards":
      case "unstable_legacy-backwards":
        for (a = null, r = t.child, t.child = null; r !== null;) {
          if (e = r.alternate, e !== null && rs(e) === null) {
            t.child = r;
            break;
          }
          e = r.sibling, r.sibling = a, a = r, r = e;
        }
        wf(t, !0, a, null, l, n);
        break;
      case "together":
        wf(t, !1, null, null, void 0, n);
        break;
      default:
        t.memoizedState = null;
    }
    return t.child;
  }
  function on(e, t, a) {
    if (e !== null && (t.dependencies = e.dependencies), Xn |= t.lanes, (a & t.childLanes) === 0) if (e !== null) {
      if (Fl(e, t, a, !1), (a & t.childLanes) === 0) return null;
    } else return null;
    if (e !== null && t.child !== e.child) throw Error(B(153));
    if (t.child !== null) {
      for (e = t.child, a = en(e, e.pendingProps), t.child = a, a.return = t; e.sibling !== null;) e = e.sibling, a = a.sibling = en(e, e.pendingProps), a.return = t;
      a.sibling = null;
    }
    return t.child;
  }
  function dp(e, t) {
    return (e.lanes & t) !== 0 ? !0 : (e = e.dependencies, !!(e !== null && ts(e)));
  }
  function uS(e, t, a) {
    switch (t.tag) {
      case 3:
        Qu(t, t.stateNode.containerInfo), Sn(t, it, e.memoizedState.cache), yr();
        break;
      case 27:
      case 5:
        Hf(t);
        break;
      case 4:
        Qu(t, t.stateNode.containerInfo);
        break;
      case 10:
        Sn(t, t.type, t.memoizedProps.value);
        break;
      case 31:
        if (t.memoizedState !== null) return t.flags |= 128, od(t), null;
        break;
      case 13:
        var n = t.memoizedState;
        if (n !== null) return n.dehydrated !== null ? (Cn(t), t.flags |= 128, null) : (a & t.child.childLanes) !== 0 ? $y(e, t, a) : (Cn(t), e = on(e, t, a), e !== null ? e.sibling : null);
        Cn(t);
        break;
      case 19:
        var r = (e.flags & 128) !== 0;
        if (n = (a & t.childLanes) !== 0, n || (Fl(e, t, a, !1), n = (a & t.childLanes) !== 0), r) {
          if (n) return eb(e, t, a);
          t.flags |= 128;
        }
        if (r = t.memoizedState, r !== null && (r.rendering = null, r.tail = null, r.lastEffect = null), Ne(et, et.current), n) break;
        return null;
      case 22:
        return t.lanes = 0, Jy(e, t, a, t.pendingProps);
      case 24:
        Sn(t, it, e.memoizedState.cache);
    }
    return on(e, t, a);
  }
  function tb(e, t, a) {
    if (e !== null) {
      if (e.memoizedProps !== t.pendingProps) ut = !0;else {
        if (!dp(e, a) && (t.flags & 128) === 0) return ut = !1, uS(e, t, a);
        ut = (e.flags & 131072) !== 0;
      }
    } else ut = !1, xe && (t.flags & 1048576) !== 0 && ry(t, Qo, t.index);
    switch (t.lanes = 0, t.tag) {
      case 16:
        e: {
          var n = t.pendingProps;
          if (e = fr(t.elementType), t.type = e, typeof e == "function") Vd(e) ? (n = kr(e, n), t.tag = 1, t = Og(null, t, e, n, a)) : (t.tag = 0, t = dd(null, t, e, n, a));else {
            if (e != null) {
              var r = e.$$typeof;
              if (r === Dd) {
                t.tag = 11, t = Bg(null, t, e, n, a);
                break e;
              } else if (r === Bd) {
                t.tag = 14, t = Eg(null, t, e, n, a);
                break e;
              }
            }
            throw t = qf(e) || e, Error(B(306, t, ""));
          }
        }
        return t;
      case 0:
        return dd(e, t, t.type, t.pendingProps, a);
      case 1:
        return n = t.type, r = kr(n, t.pendingProps), Og(e, t, n, r, a);
      case 3:
        e: {
          if (Qu(t, t.stateNode.containerInfo), e === null) throw Error(B(387));
          n = t.pendingProps;
          var l = t.memoizedState;
          r = l.element, nd(e, t), Po(t, n, null, a);
          var o = t.memoizedState;
          if (n = o.cache, Sn(t, it, n), n !== l.cache && td(t, [it], a, !0), Oo(), n = o.element, l.isDehydrated) {
            if (l = {
              element: n,
              isDehydrated: !1,
              cache: o.cache
            }, t.updateQueue.baseState = l, t.memoizedState = l, t.flags & 256) {
              t = Pg(e, t, n, a);
              break e;
            } else if (n !== r) {
              r = da(Error(B(424)), t), Zo(r), t = Pg(e, t, n, a);
              break e;
            } else for (e = t.stateNode.containerInfo, e.nodeType === 9 ? e = e.body : e = e.nodeName === "HTML" ? e.ownerDocument.body : e, Ue = ha(e.firstChild), wt = t, xe = !0, Nn = null, pa = !0, a = cy(t, null, n, a), t.child = a; a;) a.flags = a.flags & -3 | 4096, a = a.sibling;
          } else {
            if (yr(), n === r) {
              t = on(e, t, a);
              break e;
            }
            Lt(e, t, n, a);
          }
          t = t.child;
        }
        return t;
      case 26:
        return Hu(e, t), e === null ? (a = ox(t.type, null, t.pendingProps, null)) ? t.memoizedState = a : xe || (a = t.type, e = t.pendingProps, n = gs(Rn.current).createElement(a), n[kt] = t, n[_t] = e, Ct(n, a, e), gt(n), t.stateNode = n) : t.memoizedState = ox(t.type, e.memoizedProps, t.pendingProps, e.memoizedState), null;
      case 27:
        return Hf(t), e === null && xe && (n = t.stateNode = Xb(t.type, t.pendingProps, Rn.current), wt = t, pa = !0, r = Ue, Yn(t.type) ? (Ad = r, Ue = ha(n.firstChild)) : Ue = r), Lt(e, t, t.pendingProps.children, a), Hu(e, t), e === null && (t.flags |= 4194304), t.child;
      case 5:
        return e === null && xe && ((r = n = Ue) && (n = OS(n, t.type, t.pendingProps, pa), n !== null ? (t.stateNode = n, wt = t, Ue = ha(n.firstChild), pa = !1, r = !0) : r = !1), r || Gn(t)), Hf(t), r = t.type, l = t.pendingProps, o = e !== null ? e.memoizedProps : null, n = l.children, wd(r, l) ? n = null : o !== null && wd(r, o) && (t.flags |= 32), t.memoizedState !== null && (r = $d(e, t, $w, null, null, a), ti._currentValue = r), Hu(e, t), Lt(e, t, n, a), t.child;
      case 6:
        return e === null && xe && ((e = a = Ue) && (a = PS(a, t.pendingProps, pa), a !== null ? (t.stateNode = a, wt = t, Ue = null, e = !0) : e = !1), e || Gn(t)), null;
      case 13:
        return $y(e, t, a);
      case 4:
        return Qu(t, t.stateNode.containerInfo), n = t.pendingProps, e === null ? t.child = vr(t, null, n, a) : Lt(e, t, n, a), t.child;
      case 11:
        return Bg(e, t, t.type, t.pendingProps, a);
      case 7:
        return Lt(e, t, t.pendingProps, a), t.child;
      case 8:
        return Lt(e, t, t.pendingProps.children, a), t.child;
      case 12:
        return Lt(e, t, t.pendingProps.children, a), t.child;
      case 10:
        return n = t.pendingProps, Sn(t, t.type, n.value), Lt(e, t, n.children, a), t.child;
      case 9:
        return r = t.type._context, n = t.pendingProps.children, br(t), r = St(r), n = n(r), t.flags |= 1, Lt(e, t, n, a), t.child;
      case 14:
        return Eg(e, t, t.type, t.pendingProps, a);
      case 15:
        return Wy(e, t, t.type, t.pendingProps, a);
      case 19:
        return eb(e, t, a);
      case 31:
        return iS(e, t, a);
      case 22:
        return Jy(e, t, a, t.pendingProps);
      case 24:
        return br(t), n = St(it), e === null ? (r = Qd(), r === null && (r = Be, l = Yd(), r.pooledCache = l, l.refCount++, l !== null && (r.pooledCacheLanes |= a), r = l), t.memoizedState = {
          parent: n,
          cache: r
        }, Kd(t), Sn(t, it, r)) : ((e.lanes & a) !== 0 && (nd(e, t), Po(t, null, null, a), Oo()), r = e.memoizedState, l = t.memoizedState, r.parent !== n ? (r = {
          parent: n,
          cache: n
        }, t.memoizedState = r, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = r), Sn(t, it, n)) : (n = l.cache, Sn(t, it, n), n !== r.cache && td(t, [it], a, !0))), Lt(e, t, t.pendingProps.children, a), t.child;
      case 29:
        throw t.pendingProps;
    }
    throw Error(B(156, t.tag));
  }
  function Xa(e) {
    e.flags |= 4;
  }
  function Sf(e, t, a, n, r) {
    if ((t = (e.mode & 32) !== 0) && (t = !1), t) {
      if (e.flags |= 16777216, (r & 335544128) === r) if (e.stateNode.complete) e.flags |= 8192;else if (Cb()) e.flags |= 8192;else throw gr = as, Zd;
    } else e.flags &= -16777217;
  }
  function qg(e, t) {
    if (t.type !== "stylesheet" || (t.state.loading & 4) !== 0) e.flags &= -16777217;else if (e.flags |= 16777216, !Qb(t)) if (Cb()) e.flags |= 8192;else throw gr = as, Zd;
  }
  function Cu(e, t) {
    t !== null && (e.flags |= 4), e.flags & 16384 && (t = e.tag !== 22 ? Ix() : 536870912, e.lanes |= t, Rl |= t);
  }
  function ko(e, t) {
    if (!xe) switch (e.tailMode) {
      case "hidden":
        t = e.tail;
        for (var a = null; t !== null;) t.alternate !== null && (a = t), t = t.sibling;
        a === null ? e.tail = null : a.sibling = null;
        break;
      case "collapsed":
        a = e.tail;
        for (var n = null; a !== null;) a.alternate !== null && (n = a), a = a.sibling;
        n === null ? t || e.tail === null ? e.tail = null : e.tail.sibling = null : n.sibling = null;
    }
  }
  function Pe(e) {
    var t = e.alternate !== null && e.alternate.child === e.child,
      a = 0,
      n = 0;
    if (t) for (var r = e.child; r !== null;) a |= r.lanes | r.childLanes, n |= r.subtreeFlags & 65011712, n |= r.flags & 65011712, r.return = e, r = r.sibling;else for (r = e.child; r !== null;) a |= r.lanes | r.childLanes, n |= r.subtreeFlags, n |= r.flags, r.return = e, r = r.sibling;
    return e.subtreeFlags |= n, e.childLanes = a, t;
  }
  function sS(e, t, a) {
    var n = t.pendingProps;
    switch (jd(t), t.tag) {
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return Pe(t), null;
      case 1:
        return Pe(t), null;
      case 3:
        return a = t.stateNode, n = null, e !== null && (n = e.memoizedState.cache), t.memoizedState.cache !== n && (t.flags |= 2048), tn(it), Al(), a.pendingContext && (a.context = a.pendingContext, a.pendingContext = null), (e === null || e.child === null) && (rl(t) ? Xa(t) : e === null || e.memoizedState.isDehydrated && (t.flags & 256) === 0 || (t.flags |= 1024, hf())), Pe(t), null;
      case 26:
        var r = t.type,
          l = t.memoizedState;
        return e === null ? (Xa(t), l !== null ? (Pe(t), qg(t, l)) : (Pe(t), Sf(t, r, null, n, a))) : l ? l !== e.memoizedState ? (Xa(t), Pe(t), qg(t, l)) : (Pe(t), t.flags &= -16777217) : (e = e.memoizedProps, e !== n && Xa(t), Pe(t), Sf(t, r, e, n, a)), null;
      case 27:
        if (Zu(t), a = Rn.current, r = t.type, e !== null && t.stateNode != null) e.memoizedProps !== n && Xa(t);else {
          if (!n) {
            if (t.stateNode === null) throw Error(B(166));
            return Pe(t), null;
          }
          e = Ra.current, rl(t) ? mg(t, e) : (e = Xb(r, n, a), t.stateNode = e, Xa(t));
        }
        return Pe(t), null;
      case 5:
        if (Zu(t), r = t.type, e !== null && t.stateNode != null) e.memoizedProps !== n && Xa(t);else {
          if (!n) {
            if (t.stateNode === null) throw Error(B(166));
            return Pe(t), null;
          }
          if (l = Ra.current, rl(t)) mg(t, l);else {
            var o = gs(Rn.current);
            switch (l) {
              case 1:
                l = o.createElementNS("http://www.w3.org/2000/svg", r);
                break;
              case 2:
                l = o.createElementNS("http://www.w3.org/1998/Math/MathML", r);
                break;
              default:
                switch (r) {
                  case "svg":
                    l = o.createElementNS("http://www.w3.org/2000/svg", r);
                    break;
                  case "math":
                    l = o.createElementNS("http://www.w3.org/1998/Math/MathML", r);
                    break;
                  case "script":
                    l = o.createElement("div"), l.innerHTML = "<script><\/script>", l = l.removeChild(l.firstChild);
                    break;
                  case "select":
                    l = typeof n.is == "string" ? o.createElement("select", {
                      is: n.is
                    }) : o.createElement("select"), n.multiple ? l.multiple = !0 : n.size && (l.size = n.size);
                    break;
                  default:
                    l = typeof n.is == "string" ? o.createElement(r, {
                      is: n.is
                    }) : o.createElement(r);
                }
            }
            l[kt] = t, l[_t] = n;
            e: for (o = t.child; o !== null;) {
              if (o.tag === 5 || o.tag === 6) l.appendChild(o.stateNode);else if (o.tag !== 4 && o.tag !== 27 && o.child !== null) {
                o.child.return = o, o = o.child;
                continue;
              }
              if (o === t) break e;
              for (; o.sibling === null;) {
                if (o.return === null || o.return === t) break e;
                o = o.return;
              }
              o.sibling.return = o.return, o = o.sibling;
            }
            t.stateNode = l;
            e: switch (Ct(l, r, n), r) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                n = !!n.autoFocus;
                break e;
              case "img":
                n = !0;
                break e;
              default:
                n = !1;
            }
            n && Xa(t);
          }
        }
        return Pe(t), Sf(t, t.type, e === null ? null : e.memoizedProps, t.pendingProps, a), null;
      case 6:
        if (e && t.stateNode != null) e.memoizedProps !== n && Xa(t);else {
          if (typeof n != "string" && t.stateNode === null) throw Error(B(166));
          if (e = Rn.current, rl(t)) {
            if (e = t.stateNode, a = t.memoizedProps, n = null, r = wt, r !== null) switch (r.tag) {
              case 27:
              case 5:
                n = r.memoizedProps;
            }
            e[kt] = t, e = !!(e.nodeValue === a || n !== null && n.suppressHydrationWarning === !0 || Hb(e.nodeValue, a)), e || Gn(t, !0);
          } else e = gs(e).createTextNode(n), e[kt] = t, t.stateNode = e;
        }
        return Pe(t), null;
      case 31:
        if (a = t.memoizedState, e === null || e.memoizedState !== null) {
          if (n = rl(t), a !== null) {
            if (e === null) {
              if (!n) throw Error(B(318));
              if (e = t.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(B(557));
              e[kt] = t;
            } else yr(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            Pe(t), e = !1;
          } else a = hf(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = a), e = !0;
          if (!e) return t.flags & 256 ? (Kt(t), t) : (Kt(t), null);
          if ((t.flags & 128) !== 0) throw Error(B(558));
        }
        return Pe(t), null;
      case 13:
        if (n = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
          if (r = rl(t), n !== null && n.dehydrated !== null) {
            if (e === null) {
              if (!r) throw Error(B(318));
              if (r = t.memoizedState, r = r !== null ? r.dehydrated : null, !r) throw Error(B(317));
              r[kt] = t;
            } else yr(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            Pe(t), r = !1;
          } else r = hf(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = r), r = !0;
          if (!r) return t.flags & 256 ? (Kt(t), t) : (Kt(t), null);
        }
        return Kt(t), (t.flags & 128) !== 0 ? (t.lanes = a, t) : (a = n !== null, e = e !== null && e.memoizedState !== null, a && (n = t.child, r = null, n.alternate !== null && n.alternate.memoizedState !== null && n.alternate.memoizedState.cachePool !== null && (r = n.alternate.memoizedState.cachePool.pool), l = null, n.memoizedState !== null && n.memoizedState.cachePool !== null && (l = n.memoizedState.cachePool.pool), l !== r && (n.flags |= 2048)), a !== e && a && (t.child.flags |= 8192), Cu(t, t.updateQueue), Pe(t), null);
      case 4:
        return Al(), e === null && bp(t.stateNode.containerInfo), Pe(t), null;
      case 10:
        return tn(t.type), Pe(t), null;
      case 19:
        if (xt(et), n = t.memoizedState, n === null) return Pe(t), null;
        if (r = (t.flags & 128) !== 0, l = n.rendering, l === null) {
          if (r) ko(n, !1);else {
            if (Ze !== 0 || e !== null && (e.flags & 128) !== 0) for (e = t.child; e !== null;) {
              if (l = rs(e), l !== null) {
                for (t.flags |= 128, ko(n, !1), e = l.updateQueue, t.updateQueue = e, Cu(t, e), t.subtreeFlags = 0, e = a, a = t.child; a !== null;) ay(a, e), a = a.sibling;
                return Ne(et, et.current & 1 | 2), xe && Za(t, n.treeForkCount), t.child;
              }
              e = e.sibling;
            }
            n.tail !== null && $t() > cs && (t.flags |= 128, r = !0, ko(n, !1), t.lanes = 4194304);
          }
        } else {
          if (!r) if (e = rs(l), e !== null) {
            if (t.flags |= 128, r = !0, e = e.updateQueue, t.updateQueue = e, Cu(t, e), ko(n, !0), n.tail === null && n.tailMode === "hidden" && !l.alternate && !xe) return Pe(t), null;
          } else 2 * $t() - n.renderingStartTime > cs && a !== 536870912 && (t.flags |= 128, r = !0, ko(n, !1), t.lanes = 4194304);
          n.isBackwards ? (l.sibling = t.child, t.child = l) : (e = n.last, e !== null ? e.sibling = l : t.child = l, n.last = l);
        }
        return n.tail !== null ? (e = n.tail, n.rendering = e, n.tail = e.sibling, n.renderingStartTime = $t(), e.sibling = null, a = et.current, Ne(et, r ? a & 1 | 2 : a & 1), xe && Za(t, n.treeForkCount), e) : (Pe(t), null);
      case 22:
      case 23:
        return Kt(t), Wd(), n = t.memoizedState !== null, e !== null ? e.memoizedState !== null !== n && (t.flags |= 8192) : n && (t.flags |= 8192), n ? (a & 536870912) !== 0 && (t.flags & 128) === 0 && (Pe(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : Pe(t), a = t.updateQueue, a !== null && Cu(t, a.retryQueue), a = null, e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (a = e.memoizedState.cachePool.pool), n = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (n = t.memoizedState.cachePool.pool), n !== a && (t.flags |= 2048), e !== null && xt(hr), null;
      case 24:
        return a = null, e !== null && (a = e.memoizedState.cache), t.memoizedState.cache !== a && (t.flags |= 2048), tn(it), Pe(t), null;
      case 25:
        return null;
      case 30:
        return null;
    }
    throw Error(B(156, t.tag));
  }
  function cS(e, t) {
    switch (jd(t), t.tag) {
      case 1:
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 3:
        return tn(it), Al(), e = t.flags, (e & 65536) !== 0 && (e & 128) === 0 ? (t.flags = e & -65537 | 128, t) : null;
      case 26:
      case 27:
      case 5:
        return Zu(t), null;
      case 31:
        if (t.memoizedState !== null) {
          if (Kt(t), t.alternate === null) throw Error(B(340));
          yr();
        }
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 13:
        if (Kt(t), e = t.memoizedState, e !== null && e.dehydrated !== null) {
          if (t.alternate === null) throw Error(B(340));
          yr();
        }
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 19:
        return xt(et), null;
      case 4:
        return Al(), null;
      case 10:
        return tn(t.type), null;
      case 22:
      case 23:
        return Kt(t), Wd(), e !== null && xt(hr), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 24:
        return tn(it), null;
      case 25:
        return null;
      default:
        return null;
    }
  }
  function ab(e, t) {
    switch (jd(t), t.tag) {
      case 3:
        tn(it), Al();
        break;
      case 26:
      case 27:
      case 5:
        Zu(t);
        break;
      case 4:
        Al();
        break;
      case 31:
        t.memoizedState !== null && Kt(t);
        break;
      case 13:
        Kt(t);
        break;
      case 19:
        xt(et);
        break;
      case 10:
        tn(t.type);
        break;
      case 22:
      case 23:
        Kt(t), Wd(), e !== null && xt(hr);
        break;
      case 24:
        tn(it);
    }
  }
  function di(e, t) {
    try {
      var a = t.updateQueue,
        n = a !== null ? a.lastEffect : null;
      if (n !== null) {
        var r = n.next;
        a = r;
        do {
          if ((a.tag & e) === e) {
            n = void 0;
            var l = a.create,
              o = a.inst;
            n = l(), o.destroy = n;
          }
          a = a.next;
        } while (a !== r);
      }
    } catch (i) {
      Se(t, t.return, i);
    }
  }
  function Vn(e, t, a) {
    try {
      var n = t.updateQueue,
        r = n !== null ? n.lastEffect : null;
      if (r !== null) {
        var l = r.next;
        n = l;
        do {
          if ((n.tag & e) === e) {
            var o = n.inst,
              i = o.destroy;
            if (i !== void 0) {
              o.destroy = void 0, r = t;
              var u = a,
                s = i;
              try {
                s();
              } catch (c) {
                Se(r, u, c);
              }
            }
          }
          n = n.next;
        } while (n !== l);
      }
    } catch (c) {
      Se(t, t.return, c);
    }
  }
  function nb(e) {
    var t = e.updateQueue;
    if (t !== null) {
      var a = e.stateNode;
      try {
        dy(t, a);
      } catch (n) {
        Se(e, e.return, n);
      }
    }
  }
  function rb(e, t, a) {
    a.props = kr(e.type, e.memoizedProps), a.state = e.memoizedState;
    try {
      a.componentWillUnmount();
    } catch (n) {
      Se(e, t, n);
    }
  }
  function qo(e, t) {
    try {
      var a = e.ref;
      if (a !== null) {
        switch (e.tag) {
          case 26:
          case 27:
          case 5:
            var n = e.stateNode;
            break;
          case 30:
            n = e.stateNode;
            break;
          default:
            n = e.stateNode;
        }
        typeof a == "function" ? e.refCleanup = a(n) : a.current = n;
      }
    } catch (r) {
      Se(e, t, r);
    }
  }
  function Ea(e, t) {
    var a = e.ref,
      n = e.refCleanup;
    if (a !== null) if (typeof n == "function") try {
      n();
    } catch (r) {
      Se(e, t, r);
    } finally {
      e.refCleanup = null, e = e.alternate, e != null && (e.refCleanup = null);
    } else if (typeof a == "function") try {
      a(null);
    } catch (r) {
      Se(e, t, r);
    } else a.current = null;
  }
  function lb(e) {
    var t = e.type,
      a = e.memoizedProps,
      n = e.stateNode;
    try {
      e: switch (t) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          a.autoFocus && n.focus();
          break e;
        case "img":
          a.src ? n.src = a.src : a.srcSet && (n.srcset = a.srcSet);
      }
    } catch (r) {
      Se(e, e.return, r);
    }
  }
  function Cf(e, t, a) {
    try {
      var n = e.stateNode;
      DS(n, e.type, a, t), n[_t] = t;
    } catch (r) {
      Se(e, e.return, r);
    }
  }
  function ob(e) {
    return e.tag === 5 || e.tag === 3 || e.tag === 26 || e.tag === 27 && Yn(e.type) || e.tag === 4;
  }
  function If(e) {
    e: for (;;) {
      for (; e.sibling === null;) {
        if (e.return === null || ob(e.return)) return null;
        e = e.return;
      }
      for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18;) {
        if (e.tag === 27 && Yn(e.type) || e.flags & 2 || e.child === null || e.tag === 4) continue e;
        e.child.return = e, e = e.child;
      }
      if (!(e.flags & 2)) return e.stateNode;
    }
  }
  function md(e, t, a) {
    var n = e.tag;
    if (n === 5 || n === 6) e = e.stateNode, t ? (a.nodeType === 9 ? a.body : a.nodeName === "HTML" ? a.ownerDocument.body : a).insertBefore(e, t) : (t = a.nodeType === 9 ? a.body : a.nodeName === "HTML" ? a.ownerDocument.body : a, t.appendChild(e), a = a._reactRootContainer, a != null || t.onclick !== null || (t.onclick = Ja));else if (n !== 4 && (n === 27 && Yn(e.type) && (a = e.stateNode, t = null), e = e.child, e !== null)) for (md(e, t, a), e = e.sibling; e !== null;) md(e, t, a), e = e.sibling;
  }
  function ss(e, t, a) {
    var n = e.tag;
    if (n === 5 || n === 6) e = e.stateNode, t ? a.insertBefore(e, t) : a.appendChild(e);else if (n !== 4 && (n === 27 && Yn(e.type) && (a = e.stateNode), e = e.child, e !== null)) for (ss(e, t, a), e = e.sibling; e !== null;) ss(e, t, a), e = e.sibling;
  }
  function ib(e) {
    var t = e.stateNode,
      a = e.memoizedProps;
    try {
      for (var n = e.type, r = t.attributes; r.length;) t.removeAttributeNode(r[0]);
      Ct(t, n, a), t[kt] = e, t[_t] = a;
    } catch (l) {
      Se(e, e.return, l);
    }
  }
  var Ka = !1,
    ot = !1,
    Af = !1,
    Fg = typeof WeakSet == "function" ? WeakSet : Set,
    ht = null;
  function fS(e, t) {
    if (e = e.containerInfo, Ld = vs, e = Qx(e), Hd(e)) {
      if ("selectionStart" in e) var a = {
        start: e.selectionStart,
        end: e.selectionEnd
      };else e: {
        a = (a = e.ownerDocument) && a.defaultView || window;
        var n = a.getSelection && a.getSelection();
        if (n && n.rangeCount !== 0) {
          a = n.anchorNode;
          var r = n.anchorOffset,
            l = n.focusNode;
          n = n.focusOffset;
          try {
            a.nodeType, l.nodeType;
          } catch {
            a = null;
            break e;
          }
          var o = 0,
            i = -1,
            u = -1,
            s = 0,
            c = 0,
            f = e,
            d = null;
          t: for (;;) {
            for (var p; f !== a || r !== 0 && f.nodeType !== 3 || (i = o + r), f !== l || n !== 0 && f.nodeType !== 3 || (u = o + n), f.nodeType === 3 && (o += f.nodeValue.length), (p = f.firstChild) !== null;) d = f, f = p;
            for (;;) {
              if (f === e) break t;
              if (d === a && ++s === r && (i = o), d === l && ++c === n && (u = o), (p = f.nextSibling) !== null) break;
              f = d, d = f.parentNode;
            }
            f = p;
          }
          a = i === -1 || u === -1 ? null : {
            start: i,
            end: u
          };
        } else a = null;
      }
      a = a || {
        start: 0,
        end: 0
      };
    } else a = null;
    for (kd = {
      focusedElem: e,
      selectionRange: a
    }, vs = !1, ht = t; ht !== null;) if (t = ht, e = t.child, (t.subtreeFlags & 1028) !== 0 && e !== null) e.return = t, ht = e;else for (; ht !== null;) {
      switch (t = ht, l = t.alternate, e = t.flags, t.tag) {
        case 0:
          if ((e & 4) !== 0 && (e = t.updateQueue, e = e !== null ? e.events : null, e !== null)) for (a = 0; a < e.length; a++) r = e[a], r.ref.impl = r.nextImpl;
          break;
        case 11:
        case 15:
          break;
        case 1:
          if ((e & 1024) !== 0 && l !== null) {
            e = void 0, a = t, r = l.memoizedProps, l = l.memoizedState, n = a.stateNode;
            try {
              var x = kr(a.type, r);
              e = n.getSnapshotBeforeUpdate(x, l), n.__reactInternalSnapshotBeforeUpdate = e;
            } catch (b) {
              Se(a, a.return, b);
            }
          }
          break;
        case 3:
          if ((e & 1024) !== 0) {
            if (e = t.stateNode.containerInfo, a = e.nodeType, a === 9) Sd(e);else if (a === 1) switch (e.nodeName) {
              case "HEAD":
              case "HTML":
              case "BODY":
                Sd(e);
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
          if ((e & 1024) !== 0) throw Error(B(163));
      }
      if (e = t.sibling, e !== null) {
        e.return = t.return, ht = e;
        break;
      }
      ht = t.return;
    }
  }
  function ub(e, t, a) {
    var n = a.flags;
    switch (a.tag) {
      case 0:
      case 11:
      case 15:
        Ya(e, a), n & 4 && di(5, a);
        break;
      case 1:
        if (Ya(e, a), n & 4) if (e = a.stateNode, t === null) try {
          e.componentDidMount();
        } catch (o) {
          Se(a, a.return, o);
        } else {
          var r = kr(a.type, t.memoizedProps);
          t = t.memoizedState;
          try {
            e.componentDidUpdate(r, t, e.__reactInternalSnapshotBeforeUpdate);
          } catch (o) {
            Se(a, a.return, o);
          }
        }
        n & 64 && nb(a), n & 512 && qo(a, a.return);
        break;
      case 3:
        if (Ya(e, a), n & 64 && (e = a.updateQueue, e !== null)) {
          if (t = null, a.child !== null) switch (a.child.tag) {
            case 27:
            case 5:
              t = a.child.stateNode;
              break;
            case 1:
              t = a.child.stateNode;
          }
          try {
            dy(e, t);
          } catch (o) {
            Se(a, a.return, o);
          }
        }
        break;
      case 27:
        t === null && n & 4 && ib(a);
      case 26:
      case 5:
        Ya(e, a), t === null && n & 4 && lb(a), n & 512 && qo(a, a.return);
        break;
      case 12:
        Ya(e, a);
        break;
      case 31:
        Ya(e, a), n & 4 && fb(e, a);
        break;
      case 13:
        Ya(e, a), n & 4 && db(e, a), n & 64 && (e = a.memoizedState, e !== null && (e = e.dehydrated, e !== null && (a = vS.bind(null, a), US(e, a))));
        break;
      case 22:
        if (n = a.memoizedState !== null || Ka, !n) {
          t = t !== null && t.memoizedState !== null || ot, r = Ka;
          var l = ot;
          Ka = n, (ot = t) && !l ? Qa(e, a, (a.subtreeFlags & 8772) !== 0) : Ya(e, a), Ka = r, ot = l;
        }
        break;
      case 30:
        break;
      default:
        Ya(e, a);
    }
  }
  function sb(e) {
    var t = e.alternate;
    t !== null && (e.alternate = null, sb(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && zd(t)), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
  }
  var Ge = null,
    qt = !1;
  function ja(e, t, a) {
    for (a = a.child; a !== null;) cb(e, t, a), a = a.sibling;
  }
  function cb(e, t, a) {
    if (ea && typeof ea.onCommitFiberUnmount == "function") try {
      ea.onCommitFiberUnmount(li, a);
    } catch {}
    switch (a.tag) {
      case 26:
        ot || Ea(a, t), ja(e, t, a), a.memoizedState ? a.memoizedState.count-- : a.stateNode && (a = a.stateNode, a.parentNode.removeChild(a));
        break;
      case 27:
        ot || Ea(a, t);
        var n = Ge,
          r = qt;
        Yn(a.type) && (Ge = a.stateNode, qt = !1), ja(e, t, a), Go(a.stateNode), Ge = n, qt = r;
        break;
      case 5:
        ot || Ea(a, t);
      case 6:
        if (n = Ge, r = qt, Ge = null, ja(e, t, a), Ge = n, qt = r, Ge !== null) if (qt) try {
          (Ge.nodeType === 9 ? Ge.body : Ge.nodeName === "HTML" ? Ge.ownerDocument.body : Ge).removeChild(a.stateNode);
        } catch (l) {
          Se(a, t, l);
        } else try {
          Ge.removeChild(a.stateNode);
        } catch (l) {
          Se(a, t, l);
        }
        break;
      case 18:
        Ge !== null && (qt ? (e = Ge, tx(e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e, a.stateNode), Pl(e)) : tx(Ge, a.stateNode));
        break;
      case 4:
        n = Ge, r = qt, Ge = a.stateNode.containerInfo, qt = !0, ja(e, t, a), Ge = n, qt = r;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        Vn(2, a, t), ot || Vn(4, a, t), ja(e, t, a);
        break;
      case 1:
        ot || (Ea(a, t), n = a.stateNode, typeof n.componentWillUnmount == "function" && rb(a, t, n)), ja(e, t, a);
        break;
      case 21:
        ja(e, t, a);
        break;
      case 22:
        ot = (n = ot) || a.memoizedState !== null, ja(e, t, a), ot = n;
        break;
      default:
        ja(e, t, a);
    }
  }
  function fb(e, t) {
    if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null))) {
      e = e.dehydrated;
      try {
        Pl(e);
      } catch (a) {
        Se(t, t.return, a);
      }
    }
  }
  function db(e, t) {
    if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null && (e = e.dehydrated, e !== null)))) try {
      Pl(e);
    } catch (a) {
      Se(t, t.return, a);
    }
  }
  function dS(e) {
    switch (e.tag) {
      case 31:
      case 13:
      case 19:
        var t = e.stateNode;
        return t === null && (t = e.stateNode = new Fg()), t;
      case 22:
        return e = e.stateNode, t = e._retryCache, t === null && (t = e._retryCache = new Fg()), t;
      default:
        throw Error(B(435, e.tag));
    }
  }
  function Iu(e, t) {
    var a = dS(e);
    t.forEach(function (n) {
      if (!a.has(n)) {
        a.add(n);
        var r = LS.bind(null, e, n);
        n.then(r, r);
      }
    });
  }
  function Pt(e, t) {
    var a = t.deletions;
    if (a !== null) for (var n = 0; n < a.length; n++) {
      var r = a[n],
        l = e,
        o = t,
        i = o;
      e: for (; i !== null;) {
        switch (i.tag) {
          case 27:
            if (Yn(i.type)) {
              Ge = i.stateNode, qt = !1;
              break e;
            }
            break;
          case 5:
            Ge = i.stateNode, qt = !1;
            break e;
          case 3:
          case 4:
            Ge = i.stateNode.containerInfo, qt = !0;
            break e;
        }
        i = i.return;
      }
      if (Ge === null) throw Error(B(160));
      cb(l, o, r), Ge = null, qt = !1, l = r.alternate, l !== null && (l.return = null), r.return = null;
    }
    if (t.subtreeFlags & 13886) for (t = t.child; t !== null;) pb(t, e), t = t.sibling;
  }
  var ka = null;
  function pb(e, t) {
    var a = e.alternate,
      n = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        Pt(t, e), Ut(e), n & 4 && (Vn(3, e, e.return), di(3, e), Vn(5, e, e.return));
        break;
      case 1:
        Pt(t, e), Ut(e), n & 512 && (ot || a === null || Ea(a, a.return)), n & 64 && Ka && (e = e.updateQueue, e !== null && (n = e.callbacks, n !== null && (a = e.shared.hiddenCallbacks, e.shared.hiddenCallbacks = a === null ? n : a.concat(n))));
        break;
      case 26:
        var r = ka;
        if (Pt(t, e), Ut(e), n & 512 && (ot || a === null || Ea(a, a.return)), n & 4) {
          var l = a !== null ? a.memoizedState : null;
          if (n = e.memoizedState, a === null) {
            if (n === null) {
              if (e.stateNode === null) {
                e: {
                  n = e.type, a = e.memoizedProps, r = r.ownerDocument || r;
                  t: switch (n) {
                    case "title":
                      l = r.getElementsByTagName("title")[0], (!l || l[ui] || l[kt] || l.namespaceURI === "http://www.w3.org/2000/svg" || l.hasAttribute("itemprop")) && (l = r.createElement(n), r.head.insertBefore(l, r.querySelector("head > title"))), Ct(l, n, a), l[kt] = e, gt(l), n = l;
                      break e;
                    case "link":
                      var o = ux("link", "href", r).get(n + (a.href || ""));
                      if (o) {
                        for (var i = 0; i < o.length; i++) if (l = o[i], l.getAttribute("href") === (a.href == null || a.href === "" ? null : a.href) && l.getAttribute("rel") === (a.rel == null ? null : a.rel) && l.getAttribute("title") === (a.title == null ? null : a.title) && l.getAttribute("crossorigin") === (a.crossOrigin == null ? null : a.crossOrigin)) {
                          o.splice(i, 1);
                          break t;
                        }
                      }
                      l = r.createElement(n), Ct(l, n, a), r.head.appendChild(l);
                      break;
                    case "meta":
                      if (o = ux("meta", "content", r).get(n + (a.content || ""))) {
                        for (i = 0; i < o.length; i++) if (l = o[i], l.getAttribute("content") === (a.content == null ? null : "" + a.content) && l.getAttribute("name") === (a.name == null ? null : a.name) && l.getAttribute("property") === (a.property == null ? null : a.property) && l.getAttribute("http-equiv") === (a.httpEquiv == null ? null : a.httpEquiv) && l.getAttribute("charset") === (a.charSet == null ? null : a.charSet)) {
                          o.splice(i, 1);
                          break t;
                        }
                      }
                      l = r.createElement(n), Ct(l, n, a), r.head.appendChild(l);
                      break;
                    default:
                      throw Error(B(468, n));
                  }
                  l[kt] = e, gt(l), n = l;
                }
                e.stateNode = n;
              } else sx(r, e.type, e.stateNode);
            } else e.stateNode = ix(r, n, e.memoizedProps);
          } else l !== n ? (l === null ? a.stateNode !== null && (a = a.stateNode, a.parentNode.removeChild(a)) : l.count--, n === null ? sx(r, e.type, e.stateNode) : ix(r, n, e.memoizedProps)) : n === null && e.stateNode !== null && Cf(e, e.memoizedProps, a.memoizedProps);
        }
        break;
      case 27:
        Pt(t, e), Ut(e), n & 512 && (ot || a === null || Ea(a, a.return)), a !== null && n & 4 && Cf(e, e.memoizedProps, a.memoizedProps);
        break;
      case 5:
        if (Pt(t, e), Ut(e), n & 512 && (ot || a === null || Ea(a, a.return)), e.flags & 32) {
          r = e.stateNode;
          try {
            Ml(r, "");
          } catch (x) {
            Se(e, e.return, x);
          }
        }
        n & 4 && e.stateNode != null && (r = e.memoizedProps, Cf(e, r, a !== null ? a.memoizedProps : r)), n & 1024 && (Af = !0);
        break;
      case 6:
        if (Pt(t, e), Ut(e), n & 4) {
          if (e.stateNode === null) throw Error(B(162));
          n = e.memoizedProps, a = e.stateNode;
          try {
            a.nodeValue = n;
          } catch (x) {
            Se(e, e.return, x);
          }
        }
        break;
      case 3:
        if (Vu = null, r = ka, ka = xs(t.containerInfo), Pt(t, e), ka = r, Ut(e), n & 4 && a !== null && a.memoizedState.isDehydrated) try {
          Pl(t.containerInfo);
        } catch (x) {
          Se(e, e.return, x);
        }
        Af && (Af = !1, mb(e));
        break;
      case 4:
        n = ka, ka = xs(e.stateNode.containerInfo), Pt(t, e), Ut(e), ka = n;
        break;
      case 12:
        Pt(t, e), Ut(e);
        break;
      case 31:
        Pt(t, e), Ut(e), n & 4 && (n = e.updateQueue, n !== null && (e.updateQueue = null, Iu(e, n)));
        break;
      case 13:
        Pt(t, e), Ut(e), e.child.flags & 8192 && e.memoizedState !== null != (a !== null && a.memoizedState !== null) && (Rs = $t()), n & 4 && (n = e.updateQueue, n !== null && (e.updateQueue = null, Iu(e, n)));
        break;
      case 22:
        r = e.memoizedState !== null;
        var u = a !== null && a.memoizedState !== null,
          s = Ka,
          c = ot;
        if (Ka = s || r, ot = c || u, Pt(t, e), ot = c, Ka = s, Ut(e), n & 8192) e: for (t = e.stateNode, t._visibility = r ? t._visibility & -2 : t._visibility | 1, r && (a === null || u || Ka || ot || dr(e)), a = null, t = e;;) {
          if (t.tag === 5 || t.tag === 26) {
            if (a === null) {
              u = a = t;
              try {
                if (l = u.stateNode, r) o = l.style, typeof o.setProperty == "function" ? o.setProperty("display", "none", "important") : o.display = "none";else {
                  i = u.stateNode;
                  var f = u.memoizedProps.style,
                    d = f != null && f.hasOwnProperty("display") ? f.display : null;
                  i.style.display = d == null || typeof d == "boolean" ? "" : ("" + d).trim();
                }
              } catch (x) {
                Se(u, u.return, x);
              }
            }
          } else if (t.tag === 6) {
            if (a === null) {
              u = t;
              try {
                u.stateNode.nodeValue = r ? "" : u.memoizedProps;
              } catch (x) {
                Se(u, u.return, x);
              }
            }
          } else if (t.tag === 18) {
            if (a === null) {
              u = t;
              try {
                var p = u.stateNode;
                r ? ax(p, !0) : ax(u.stateNode, !1);
              } catch (x) {
                Se(u, u.return, x);
              }
            }
          } else if ((t.tag !== 22 && t.tag !== 23 || t.memoizedState === null || t === e) && t.child !== null) {
            t.child.return = t, t = t.child;
            continue;
          }
          if (t === e) break e;
          for (; t.sibling === null;) {
            if (t.return === null || t.return === e) break e;
            a === t && (a = null), t = t.return;
          }
          a === t && (a = null), t.sibling.return = t.return, t = t.sibling;
        }
        n & 4 && (n = e.updateQueue, n !== null && (a = n.retryQueue, a !== null && (n.retryQueue = null, Iu(e, a))));
        break;
      case 19:
        Pt(t, e), Ut(e), n & 4 && (n = e.updateQueue, n !== null && (e.updateQueue = null, Iu(e, n)));
        break;
      case 30:
        break;
      case 21:
        break;
      default:
        Pt(t, e), Ut(e);
    }
  }
  function Ut(e) {
    var t = e.flags;
    if (t & 2) {
      try {
        for (var a, n = e.return; n !== null;) {
          if (ob(n)) {
            a = n;
            break;
          }
          n = n.return;
        }
        if (a == null) throw Error(B(160));
        switch (a.tag) {
          case 27:
            var r = a.stateNode,
              l = If(e);
            ss(e, l, r);
            break;
          case 5:
            var o = a.stateNode;
            a.flags & 32 && (Ml(o, ""), a.flags &= -33);
            var i = If(e);
            ss(e, i, o);
            break;
          case 3:
          case 4:
            var u = a.stateNode.containerInfo,
              s = If(e);
            md(e, s, u);
            break;
          default:
            throw Error(B(161));
        }
      } catch (c) {
        Se(e, e.return, c);
      }
      e.flags &= -3;
    }
    t & 4096 && (e.flags &= -4097);
  }
  function mb(e) {
    if (e.subtreeFlags & 1024) for (e = e.child; e !== null;) {
      var t = e;
      mb(t), t.tag === 5 && t.flags & 1024 && t.stateNode.reset(), e = e.sibling;
    }
  }
  function Ya(e, t) {
    if (t.subtreeFlags & 8772) for (t = t.child; t !== null;) ub(e, t.alternate, t), t = t.sibling;
  }
  function dr(e) {
    for (e = e.child; e !== null;) {
      var t = e;
      switch (t.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          Vn(4, t, t.return), dr(t);
          break;
        case 1:
          Ea(t, t.return);
          var a = t.stateNode;
          typeof a.componentWillUnmount == "function" && rb(t, t.return, a), dr(t);
          break;
        case 27:
          Go(t.stateNode);
        case 26:
        case 5:
          Ea(t, t.return), dr(t);
          break;
        case 22:
          t.memoizedState === null && dr(t);
          break;
        case 30:
          dr(t);
          break;
        default:
          dr(t);
      }
      e = e.sibling;
    }
  }
  function Qa(e, t, a) {
    for (a = a && (t.subtreeFlags & 8772) !== 0, t = t.child; t !== null;) {
      var n = t.alternate,
        r = e,
        l = t,
        o = l.flags;
      switch (l.tag) {
        case 0:
        case 11:
        case 15:
          Qa(r, l, a), di(4, l);
          break;
        case 1:
          if (Qa(r, l, a), n = l, r = n.stateNode, typeof r.componentDidMount == "function") try {
            r.componentDidMount();
          } catch (s) {
            Se(n, n.return, s);
          }
          if (n = l, r = n.updateQueue, r !== null) {
            var i = n.stateNode;
            try {
              var u = r.shared.hiddenCallbacks;
              if (u !== null) for (r.shared.hiddenCallbacks = null, r = 0; r < u.length; r++) fy(u[r], i);
            } catch (s) {
              Se(n, n.return, s);
            }
          }
          a && o & 64 && nb(l), qo(l, l.return);
          break;
        case 27:
          ib(l);
        case 26:
        case 5:
          Qa(r, l, a), a && n === null && o & 4 && lb(l), qo(l, l.return);
          break;
        case 12:
          Qa(r, l, a);
          break;
        case 31:
          Qa(r, l, a), a && o & 4 && fb(r, l);
          break;
        case 13:
          Qa(r, l, a), a && o & 4 && db(r, l);
          break;
        case 22:
          l.memoizedState === null && Qa(r, l, a), qo(l, l.return);
          break;
        case 30:
          break;
        default:
          Qa(r, l, a);
      }
      t = t.sibling;
    }
  }
  function pp(e, t) {
    var a = null;
    e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (a = e.memoizedState.cachePool.pool), e = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (e = t.memoizedState.cachePool.pool), e !== a && (e != null && e.refCount++, a != null && ci(a));
  }
  function mp(e, t) {
    e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && ci(e));
  }
  function La(e, t, a, n) {
    if (t.subtreeFlags & 10256) for (t = t.child; t !== null;) hb(e, t, a, n), t = t.sibling;
  }
  function hb(e, t, a, n) {
    var r = t.flags;
    switch (t.tag) {
      case 0:
      case 11:
      case 15:
        La(e, t, a, n), r & 2048 && di(9, t);
        break;
      case 1:
        La(e, t, a, n);
        break;
      case 3:
        La(e, t, a, n), r & 2048 && (e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && ci(e)));
        break;
      case 12:
        if (r & 2048) {
          La(e, t, a, n), e = t.stateNode;
          try {
            var l = t.memoizedProps,
              o = l.id,
              i = l.onPostCommit;
            typeof i == "function" && i(o, t.alternate === null ? "mount" : "update", e.passiveEffectDuration, -0);
          } catch (u) {
            Se(t, t.return, u);
          }
        } else La(e, t, a, n);
        break;
      case 31:
        La(e, t, a, n);
        break;
      case 13:
        La(e, t, a, n);
        break;
      case 23:
        break;
      case 22:
        l = t.stateNode, o = t.alternate, t.memoizedState !== null ? l._visibility & 2 ? La(e, t, a, n) : Fo(e, t) : l._visibility & 2 ? La(e, t, a, n) : (l._visibility |= 2, ol(e, t, a, n, (t.subtreeFlags & 10256) !== 0 || !1)), r & 2048 && pp(o, t);
        break;
      case 24:
        La(e, t, a, n), r & 2048 && mp(t.alternate, t);
        break;
      default:
        La(e, t, a, n);
    }
  }
  function ol(e, t, a, n, r) {
    for (r = r && ((t.subtreeFlags & 10256) !== 0 || !1), t = t.child; t !== null;) {
      var l = e,
        o = t,
        i = a,
        u = n,
        s = o.flags;
      switch (o.tag) {
        case 0:
        case 11:
        case 15:
          ol(l, o, i, u, r), di(8, o);
          break;
        case 23:
          break;
        case 22:
          var c = o.stateNode;
          o.memoizedState !== null ? c._visibility & 2 ? ol(l, o, i, u, r) : Fo(l, o) : (c._visibility |= 2, ol(l, o, i, u, r)), r && s & 2048 && pp(o.alternate, o);
          break;
        case 24:
          ol(l, o, i, u, r), r && s & 2048 && mp(o.alternate, o);
          break;
        default:
          ol(l, o, i, u, r);
      }
      t = t.sibling;
    }
  }
  function Fo(e, t) {
    if (t.subtreeFlags & 10256) for (t = t.child; t !== null;) {
      var a = e,
        n = t,
        r = n.flags;
      switch (n.tag) {
        case 22:
          Fo(a, n), r & 2048 && pp(n.alternate, n);
          break;
        case 24:
          Fo(a, n), r & 2048 && mp(n.alternate, n);
          break;
        default:
          Fo(a, n);
      }
      t = t.sibling;
    }
  }
  var Do = 8192;
  function ll(e, t, a) {
    if (e.subtreeFlags & Do) for (e = e.child; e !== null;) gb(e, t, a), e = e.sibling;
  }
  function gb(e, t, a) {
    switch (e.tag) {
      case 26:
        ll(e, t, a), e.flags & Do && e.memoizedState !== null && KS(a, ka, e.memoizedState, e.memoizedProps);
        break;
      case 5:
        ll(e, t, a);
        break;
      case 3:
      case 4:
        var n = ka;
        ka = xs(e.stateNode.containerInfo), ll(e, t, a), ka = n;
        break;
      case 22:
        e.memoizedState === null && (n = e.alternate, n !== null && n.memoizedState !== null ? (n = Do, Do = 16777216, ll(e, t, a), Do = n) : ll(e, t, a));
        break;
      default:
        ll(e, t, a);
    }
  }
  function xb(e) {
    var t = e.alternate;
    if (t !== null && (e = t.child, e !== null)) {
      t.child = null;
      do t = e.sibling, e.sibling = null, e = t; while (e !== null);
    }
  }
  function wo(e) {
    var t = e.deletions;
    if ((e.flags & 16) !== 0) {
      if (t !== null) for (var a = 0; a < t.length; a++) {
        var n = t[a];
        ht = n, bb(n, e);
      }
      xb(e);
    }
    if (e.subtreeFlags & 10256) for (e = e.child; e !== null;) yb(e), e = e.sibling;
  }
  function yb(e) {
    switch (e.tag) {
      case 0:
      case 11:
      case 15:
        wo(e), e.flags & 2048 && Vn(9, e, e.return);
        break;
      case 3:
        wo(e);
        break;
      case 12:
        wo(e);
        break;
      case 22:
        var t = e.stateNode;
        e.memoizedState !== null && t._visibility & 2 && (e.return === null || e.return.tag !== 13) ? (t._visibility &= -3, _u(e)) : wo(e);
        break;
      default:
        wo(e);
    }
  }
  function _u(e) {
    var t = e.deletions;
    if ((e.flags & 16) !== 0) {
      if (t !== null) for (var a = 0; a < t.length; a++) {
        var n = t[a];
        ht = n, bb(n, e);
      }
      xb(e);
    }
    for (e = e.child; e !== null;) {
      switch (t = e, t.tag) {
        case 0:
        case 11:
        case 15:
          Vn(8, t, t.return), _u(t);
          break;
        case 22:
          a = t.stateNode, a._visibility & 2 && (a._visibility &= -3, _u(t));
          break;
        default:
          _u(t);
      }
      e = e.sibling;
    }
  }
  function bb(e, t) {
    for (; ht !== null;) {
      var a = ht;
      switch (a.tag) {
        case 0:
        case 11:
        case 15:
          Vn(8, a, t);
          break;
        case 23:
        case 22:
          if (a.memoizedState !== null && a.memoizedState.cachePool !== null) {
            var n = a.memoizedState.cachePool.pool;
            n != null && n.refCount++;
          }
          break;
        case 24:
          ci(a.memoizedState.cache);
      }
      if (n = a.child, n !== null) n.return = a, ht = n;else e: for (a = e; ht !== null;) {
        n = ht;
        var r = n.sibling,
          l = n.return;
        if (sb(n), n === a) {
          ht = null;
          break e;
        }
        if (r !== null) {
          r.return = l, ht = r;
          break e;
        }
        ht = l;
      }
    }
  }
  var pS = {
      getCacheForType: function (e) {
        var t = St(it),
          a = t.data.get(e);
        return a === void 0 && (a = e(), t.data.set(e, a)), a;
      },
      cacheSignal: function () {
        return St(it).controller.signal;
      }
    },
    mS = typeof WeakMap == "function" ? WeakMap : Map,
    be = 0,
    Be = null,
    me = null,
    ge = 0,
    we = 0,
    Zt = null,
    Dn = !1,
    _l = !1,
    hp = !1,
    un = 0,
    Ze = 0,
    Xn = 0,
    xr = 0,
    gp = 0,
    Jt = 0,
    Rl = 0,
    Ho = null,
    Ft = null,
    hd = !1,
    Rs = 0,
    vb = 0,
    cs = 1 / 0,
    fs = null,
    Pn = null,
    ft = 0,
    Un = null,
    Nl = null,
    an = 0,
    gd = 0,
    xd = null,
    Lb = null,
    _o = 0,
    yd = null;
  function aa() {
    return (be & 2) !== 0 && ge !== 0 ? ge & -ge : ee.T !== null ? yp() : Dx();
  }
  function kb() {
    if (Jt === 0) if ((ge & 536870912) === 0 || xe) {
      var e = gu;
      gu <<= 1, (gu & 3932160) === 0 && (gu = 262144), Jt = e;
    } else Jt = 536870912;
    return e = ra.current, e !== null && (e.flags |= 32), Jt;
  }
  function Ht(e, t, a) {
    (e === Be && (we === 2 || we === 9) || e.cancelPendingCommit !== null) && (zl(e, 0), Bn(e, ge, Jt, !1)), ii(e, a), ((be & 2) === 0 || e !== Be) && (e === Be && ((be & 2) === 0 && (xr |= a), Ze === 4 && Bn(e, ge, Jt, !1)), za(e));
  }
  function wb(e, t, a) {
    if ((be & 6) !== 0) throw Error(B(327));
    var n = !a && (t & 127) === 0 && (t & e.expiredLanes) === 0 || oi(e, t),
      r = n ? xS(e, t) : Tf(e, t, !0),
      l = n;
    do {
      if (r === 0) {
        _l && !n && Bn(e, t, 0, !1);
        break;
      } else {
        if (a = e.current.alternate, l && !hS(a)) {
          r = Tf(e, t, !1), l = !1;
          continue;
        }
        if (r === 2) {
          if (l = t, e.errorRecoveryDisabledLanes & l) var o = 0;else o = e.pendingLanes & -536870913, o = o !== 0 ? o : o & 536870912 ? 536870912 : 0;
          if (o !== 0) {
            t = o;
            e: {
              var i = e;
              r = Ho;
              var u = i.current.memoizedState.isDehydrated;
              if (u && (zl(i, o).flags |= 256), o = Tf(i, o, !1), o !== 2) {
                if (hp && !u) {
                  i.errorRecoveryDisabledLanes |= l, xr |= l, r = 4;
                  break e;
                }
                l = Ft, Ft = r, l !== null && (Ft === null ? Ft = l : Ft.push.apply(Ft, l));
              }
              r = o;
            }
            if (l = !1, r !== 2) continue;
          }
        }
        if (r === 1) {
          zl(e, 0), Bn(e, t, 0, !0);
          break;
        }
        e: {
          switch (n = e, l = r, l) {
            case 0:
            case 1:
              throw Error(B(345));
            case 4:
              if ((t & 4194048) !== t) break;
            case 6:
              Bn(n, t, Jt, !Dn);
              break e;
            case 2:
              Ft = null;
              break;
            case 3:
            case 5:
              break;
            default:
              throw Error(B(329));
          }
          if ((t & 62914560) === t && (r = Rs + 300 - $t(), 10 < r)) {
            if (Bn(n, t, Jt, !Dn), ks(n, 0, !0) !== 0) break e;
            an = t, n.timeoutHandle = Gb(Hg.bind(null, n, a, Ft, fs, hd, t, Jt, xr, Rl, Dn, l, "Throttled", -0, 0), r);
            break e;
          }
          Hg(n, a, Ft, fs, hd, t, Jt, xr, Rl, Dn, l, null, -0, 0);
        }
      }
      break;
    } while (!0);
    za(e);
  }
  function Hg(e, t, a, n, r, l, o, i, u, s, c, f, d, p) {
    if (e.timeoutHandle = -1, f = t.subtreeFlags, f & 8192 || (f & 16785408) === 16785408) {
      f = {
        stylesheets: null,
        count: 0,
        imgCount: 0,
        imgBytes: 0,
        suspenseyImages: [],
        waitingForImages: !0,
        waitingForViewTransition: !1,
        unsuspend: Ja
      }, gb(t, l, f);
      var x = (l & 62914560) === l ? Rs - $t() : (l & 4194048) === l ? vb - $t() : 0;
      if (x = WS(f, x), x !== null) {
        an = l, e.cancelPendingCommit = x(Gg.bind(null, e, t, l, a, n, r, o, i, u, c, f, null, d, p)), Bn(e, l, o, !s);
        return;
      }
    }
    Gg(e, t, l, a, n, r, o, i, u);
  }
  function hS(e) {
    for (var t = e;;) {
      var a = t.tag;
      if ((a === 0 || a === 11 || a === 15) && t.flags & 16384 && (a = t.updateQueue, a !== null && (a = a.stores, a !== null))) for (var n = 0; n < a.length; n++) {
        var r = a[n],
          l = r.getSnapshot;
        r = r.value;
        try {
          if (!na(l(), r)) return !1;
        } catch {
          return !1;
        }
      }
      if (a = t.child, t.subtreeFlags & 16384 && a !== null) a.return = t, t = a;else {
        if (t === e) break;
        for (; t.sibling === null;) {
          if (t.return === null || t.return === e) return !0;
          t = t.return;
        }
        t.sibling.return = t.return, t = t.sibling;
      }
    }
    return !0;
  }
  function Bn(e, t, a, n) {
    t &= ~gp, t &= ~xr, e.suspendedLanes |= t, e.pingedLanes &= ~t, n && (e.warmLanes |= t), n = e.expirationTimes;
    for (var r = t; 0 < r;) {
      var l = 31 - ta(r),
        o = 1 << l;
      n[l] = -1, r &= ~o;
    }
    a !== 0 && Ax(e, a, t);
  }
  function Ns() {
    return (be & 6) === 0 ? (pi(0, !1), !1) : !0;
  }
  function xp() {
    if (me !== null) {
      if (we === 0) var e = me.return;else e = me, $a = Ar = null, ap(e), Sl = null, Ko = 0, e = me;
      for (; e !== null;) ab(e.alternate, e), e = e.return;
      me = null;
    }
  }
  function zl(e, t) {
    var a = e.timeoutHandle;
    a !== -1 && (e.timeoutHandle = -1, RS(a)), a = e.cancelPendingCommit, a !== null && (e.cancelPendingCommit = null, a()), an = 0, xp(), Be = e, me = a = en(e.current, null), ge = t, we = 0, Zt = null, Dn = !1, _l = oi(e, t), hp = !1, Rl = Jt = gp = xr = Xn = Ze = 0, Ft = Ho = null, hd = !1, (t & 8) !== 0 && (t |= t & 32);
    var n = e.entangledLanes;
    if (n !== 0) for (e = e.entanglements, n &= t; 0 < n;) {
      var r = 31 - ta(n),
        l = 1 << r;
      t |= e[r], n &= ~l;
    }
    return un = t, Is(), a;
  }
  function Sb(e, t) {
    ne = null, ee.H = Jo, t === Hl || t === Ts ? (t = bg(), we = 3) : t === Zd ? (t = bg(), we = 4) : we = t === fp ? 8 : t !== null && typeof t == "object" && typeof t.then == "function" ? 6 : 1, Zt = t, me === null && (Ze = 1, is(e, da(t, e.current)));
  }
  function Cb() {
    var e = ra.current;
    return e === null ? !0 : (ge & 4194048) === ge ? ma === null : (ge & 62914560) === ge || (ge & 536870912) !== 0 ? e === ma : !1;
  }
  function Ib() {
    var e = ee.H;
    return ee.H = Jo, e === null ? Jo : e;
  }
  function Ab() {
    var e = ee.A;
    return ee.A = pS, e;
  }
  function ds() {
    Ze = 4, Dn || (ge & 4194048) !== ge && ra.current !== null || (_l = !0), (Xn & 134217727) === 0 && (xr & 134217727) === 0 || Be === null || Bn(Be, ge, Jt, !1);
  }
  function Tf(e, t, a) {
    var n = be;
    be |= 2;
    var r = Ib(),
      l = Ab();
    (Be !== e || ge !== t) && (fs = null, zl(e, t)), t = !1;
    var o = Ze;
    e: do try {
      if (we !== 0 && me !== null) {
        var i = me,
          u = Zt;
        switch (we) {
          case 8:
            xp(), o = 6;
            break e;
          case 3:
          case 2:
          case 9:
          case 6:
            ra.current === null && (t = !0);
            var s = we;
            if (we = 0, Zt = null, bl(e, i, u, s), a && _l) {
              o = 0;
              break e;
            }
            break;
          default:
            s = we, we = 0, Zt = null, bl(e, i, u, s);
        }
      }
      gS(), o = Ze;
      break;
    } catch (c) {
      Sb(e, c);
    } while (!0);
    return t && e.shellSuspendCounter++, $a = Ar = null, be = n, ee.H = r, ee.A = l, me === null && (Be = null, ge = 0, Is()), o;
  }
  function gS() {
    for (; me !== null;) Tb(me);
  }
  function xS(e, t) {
    var a = be;
    be |= 2;
    var n = Ib(),
      r = Ab();
    Be !== e || ge !== t ? (fs = null, cs = $t() + 500, zl(e, t)) : _l = oi(e, t);
    e: do try {
      if (we !== 0 && me !== null) {
        t = me;
        var l = Zt;
        t: switch (we) {
          case 1:
            we = 0, Zt = null, bl(e, t, l, 1);
            break;
          case 2:
          case 9:
            if (yg(l)) {
              we = 0, Zt = null, _g(t);
              break;
            }
            t = function () {
              we !== 2 && we !== 9 || Be !== e || (we = 7), za(e);
            }, l.then(t, t);
            break e;
          case 3:
            we = 7;
            break e;
          case 4:
            we = 5;
            break e;
          case 7:
            yg(l) ? (we = 0, Zt = null, _g(t)) : (we = 0, Zt = null, bl(e, t, l, 7));
            break;
          case 5:
            var o = null;
            switch (me.tag) {
              case 26:
                o = me.memoizedState;
              case 5:
              case 27:
                var i = me;
                if (o ? Qb(o) : i.stateNode.complete) {
                  we = 0, Zt = null;
                  var u = i.sibling;
                  if (u !== null) me = u;else {
                    var s = i.return;
                    s !== null ? (me = s, zs(s)) : me = null;
                  }
                  break t;
                }
            }
            we = 0, Zt = null, bl(e, t, l, 5);
            break;
          case 6:
            we = 0, Zt = null, bl(e, t, l, 6);
            break;
          case 8:
            xp(), Ze = 6;
            break e;
          default:
            throw Error(B(462));
        }
      }
      yS();
      break;
    } catch (c) {
      Sb(e, c);
    } while (!0);
    return $a = Ar = null, ee.H = n, ee.A = r, be = a, me !== null ? 0 : (Be = null, ge = 0, Is(), Ze);
  }
  function yS() {
    for (; me !== null && !Hk();) Tb(me);
  }
  function Tb(e) {
    var t = tb(e.alternate, e, un);
    e.memoizedProps = e.pendingProps, t === null ? zs(e) : me = t;
  }
  function _g(e) {
    var t = e,
      a = t.alternate;
    switch (t.tag) {
      case 15:
      case 0:
        t = zg(a, t, t.pendingProps, t.type, void 0, ge);
        break;
      case 11:
        t = zg(a, t, t.pendingProps, t.type.render, t.ref, ge);
        break;
      case 5:
        ap(t);
      default:
        ab(a, t), t = me = ay(t, un), t = tb(a, t, un);
    }
    e.memoizedProps = e.pendingProps, t === null ? zs(e) : me = t;
  }
  function bl(e, t, a, n) {
    $a = Ar = null, ap(t), Sl = null, Ko = 0;
    var r = t.return;
    try {
      if (oS(e, r, t, a, ge)) {
        Ze = 1, is(e, da(a, e.current)), me = null;
        return;
      }
    } catch (l) {
      if (r !== null) throw me = r, l;
      Ze = 1, is(e, da(a, e.current)), me = null;
      return;
    }
    t.flags & 32768 ? (xe || n === 1 ? e = !0 : _l || (ge & 536870912) !== 0 ? e = !1 : (Dn = e = !0, (n === 2 || n === 9 || n === 3 || n === 6) && (n = ra.current, n !== null && n.tag === 13 && (n.flags |= 16384))), Mb(t, e)) : zs(t);
  }
  function zs(e) {
    var t = e;
    do {
      if ((t.flags & 32768) !== 0) {
        Mb(t, Dn);
        return;
      }
      e = t.return;
      var a = sS(t.alternate, t, un);
      if (a !== null) {
        me = a;
        return;
      }
      if (t = t.sibling, t !== null) {
        me = t;
        return;
      }
      me = t = e;
    } while (t !== null);
    Ze === 0 && (Ze = 5);
  }
  function Mb(e, t) {
    do {
      var a = cS(e.alternate, e);
      if (a !== null) {
        a.flags &= 32767, me = a;
        return;
      }
      if (a = e.return, a !== null && (a.flags |= 32768, a.subtreeFlags = 0, a.deletions = null), !t && (e = e.sibling, e !== null)) {
        me = e;
        return;
      }
      me = e = a;
    } while (e !== null);
    Ze = 6, me = null;
  }
  function Gg(e, t, a, n, r, l, o, i, u) {
    e.cancelPendingCommit = null;
    do Os(); while (ft !== 0);
    if ((be & 6) !== 0) throw Error(B(327));
    if (t !== null) {
      if (t === e.current) throw Error(B(177));
      if (l = t.lanes | t.childLanes, l |= _d, Wk(e, a, l, o, i, u), e === Be && (me = Be = null, ge = 0), Nl = t, Un = e, an = a, gd = l, xd = r, Lb = n, (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0 ? (e.callbackNode = null, e.callbackPriority = 0, kS(Ku, function () {
        return Nb(), null;
      })) : (e.callbackNode = null, e.callbackPriority = 0), n = (t.flags & 13878) !== 0, (t.subtreeFlags & 13878) !== 0 || n) {
        n = ee.T, ee.T = null, r = ve.p, ve.p = 2, o = be, be |= 4;
        try {
          fS(e, t, a);
        } finally {
          be = o, ve.p = r, ee.T = n;
        }
      }
      ft = 1, Db(), Bb(), Eb();
    }
  }
  function Db() {
    if (ft === 1) {
      ft = 0;
      var e = Un,
        t = Nl,
        a = (t.flags & 13878) !== 0;
      if ((t.subtreeFlags & 13878) !== 0 || a) {
        a = ee.T, ee.T = null;
        var n = ve.p;
        ve.p = 2;
        var r = be;
        be |= 4;
        try {
          pb(t, e);
          var l = kd,
            o = Qx(e.containerInfo),
            i = l.focusedElem,
            u = l.selectionRange;
          if (o !== i && i && i.ownerDocument && Yx(i.ownerDocument.documentElement, i)) {
            if (u !== null && Hd(i)) {
              var s = u.start,
                c = u.end;
              if (c === void 0 && (c = s), "selectionStart" in i) i.selectionStart = s, i.selectionEnd = Math.min(c, i.value.length);else {
                var f = i.ownerDocument || document,
                  d = f && f.defaultView || window;
                if (d.getSelection) {
                  var p = d.getSelection(),
                    x = i.textContent.length,
                    b = Math.min(u.start, x),
                    C = u.end === void 0 ? b : Math.min(u.end, x);
                  !p.extend && b > C && (o = C, C = b, b = o);
                  var h = fg(i, b),
                    m = fg(i, C);
                  if (h && m && (p.rangeCount !== 1 || p.anchorNode !== h.node || p.anchorOffset !== h.offset || p.focusNode !== m.node || p.focusOffset !== m.offset)) {
                    var g = f.createRange();
                    g.setStart(h.node, h.offset), p.removeAllRanges(), b > C ? (p.addRange(g), p.extend(m.node, m.offset)) : (g.setEnd(m.node, m.offset), p.addRange(g));
                  }
                }
              }
            }
            for (f = [], p = i; p = p.parentNode;) p.nodeType === 1 && f.push({
              element: p,
              left: p.scrollLeft,
              top: p.scrollTop
            });
            for (typeof i.focus == "function" && i.focus(), i = 0; i < f.length; i++) {
              var L = f[i];
              L.element.scrollLeft = L.left, L.element.scrollTop = L.top;
            }
          }
          vs = !!Ld, kd = Ld = null;
        } finally {
          be = r, ve.p = n, ee.T = a;
        }
      }
      e.current = t, ft = 2;
    }
  }
  function Bb() {
    if (ft === 2) {
      ft = 0;
      var e = Un,
        t = Nl,
        a = (t.flags & 8772) !== 0;
      if ((t.subtreeFlags & 8772) !== 0 || a) {
        a = ee.T, ee.T = null;
        var n = ve.p;
        ve.p = 2;
        var r = be;
        be |= 4;
        try {
          ub(e, t.alternate, t);
        } finally {
          be = r, ve.p = n, ee.T = a;
        }
      }
      ft = 3;
    }
  }
  function Eb() {
    if (ft === 4 || ft === 3) {
      ft = 0, _k();
      var e = Un,
        t = Nl,
        a = an,
        n = Lb;
      (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0 ? ft = 5 : (ft = 0, Nl = Un = null, Rb(e, e.pendingLanes));
      var r = e.pendingLanes;
      if (r === 0 && (Pn = null), Nd(a), t = t.stateNode, ea && typeof ea.onCommitFiberRoot == "function") try {
        ea.onCommitFiberRoot(li, t, void 0, (t.current.flags & 128) === 128);
      } catch {}
      if (n !== null) {
        t = ee.T, r = ve.p, ve.p = 2, ee.T = null;
        try {
          for (var l = e.onRecoverableError, o = 0; o < n.length; o++) {
            var i = n[o];
            l(i.value, {
              componentStack: i.stack
            });
          }
        } finally {
          ee.T = t, ve.p = r;
        }
      }
      (an & 3) !== 0 && Os(), za(e), r = e.pendingLanes, (a & 261930) !== 0 && (r & 42) !== 0 ? e === yd ? _o++ : (_o = 0, yd = e) : _o = 0, pi(0, !1);
    }
  }
  function Rb(e, t) {
    (e.pooledCacheLanes &= t) === 0 && (t = e.pooledCache, t != null && (e.pooledCache = null, ci(t)));
  }
  function Os() {
    return Db(), Bb(), Eb(), Nb();
  }
  function Nb() {
    if (ft !== 5) return !1;
    var e = Un,
      t = gd;
    gd = 0;
    var a = Nd(an),
      n = ee.T,
      r = ve.p;
    try {
      ve.p = 32 > a ? 32 : a, ee.T = null, a = xd, xd = null;
      var l = Un,
        o = an;
      if (ft = 0, Nl = Un = null, an = 0, (be & 6) !== 0) throw Error(B(331));
      var i = be;
      if (be |= 4, yb(l.current), hb(l, l.current, o, a), be = i, pi(0, !1), ea && typeof ea.onPostCommitFiberRoot == "function") try {
        ea.onPostCommitFiberRoot(li, l);
      } catch {}
      return !0;
    } finally {
      ve.p = r, ee.T = n, Rb(e, t);
    }
  }
  function Vg(e, t, a) {
    t = da(a, t), t = fd(e.stateNode, t, 2), e = On(e, t, 2), e !== null && (ii(e, 2), za(e));
  }
  function Se(e, t, a) {
    if (e.tag === 3) Vg(e, e, a);else for (; t !== null;) {
      if (t.tag === 3) {
        Vg(t, e, a);
        break;
      } else if (t.tag === 1) {
        var n = t.stateNode;
        if (typeof t.type.getDerivedStateFromError == "function" || typeof n.componentDidCatch == "function" && (Pn === null || !Pn.has(n))) {
          e = da(a, e), a = Zy(2), n = On(t, a, 2), n !== null && (Ky(a, n, t, e), ii(n, 2), za(n));
          break;
        }
      }
      t = t.return;
    }
  }
  function Mf(e, t, a) {
    var n = e.pingCache;
    if (n === null) {
      n = e.pingCache = new mS();
      var r = new Set();
      n.set(t, r);
    } else r = n.get(t), r === void 0 && (r = new Set(), n.set(t, r));
    r.has(a) || (hp = !0, r.add(a), e = bS.bind(null, e, t, a), t.then(e, e));
  }
  function bS(e, t, a) {
    var n = e.pingCache;
    n !== null && n.delete(t), e.pingedLanes |= e.suspendedLanes & a, e.warmLanes &= ~a, Be === e && (ge & a) === a && (Ze === 4 || Ze === 3 && (ge & 62914560) === ge && 300 > $t() - Rs ? (be & 2) === 0 && zl(e, 0) : gp |= a, Rl === ge && (Rl = 0)), za(e);
  }
  function zb(e, t) {
    t === 0 && (t = Ix()), e = Ir(e, t), e !== null && (ii(e, t), za(e));
  }
  function vS(e) {
    var t = e.memoizedState,
      a = 0;
    t !== null && (a = t.retryLane), zb(e, a);
  }
  function LS(e, t) {
    var a = 0;
    switch (e.tag) {
      case 31:
      case 13:
        var n = e.stateNode,
          r = e.memoizedState;
        r !== null && (a = r.retryLane);
        break;
      case 19:
        n = e.stateNode;
        break;
      case 22:
        n = e.stateNode._retryCache;
        break;
      default:
        throw Error(B(314));
    }
    n !== null && n.delete(t), zb(e, a);
  }
  function kS(e, t) {
    return Ed(e, t);
  }
  var ps = null,
    il = null,
    bd = !1,
    ms = !1,
    Df = !1,
    En = 0;
  function za(e) {
    e !== il && e.next === null && (il === null ? ps = il = e : il = il.next = e), ms = !0, bd || (bd = !0, SS());
  }
  function pi(e, t) {
    if (!Df && ms) {
      Df = !0;
      do for (var a = !1, n = ps; n !== null;) {
        if (!t) if (e !== 0) {
          var r = n.pendingLanes;
          if (r === 0) var l = 0;else {
            var o = n.suspendedLanes,
              i = n.pingedLanes;
            l = (1 << 31 - ta(42 | e) + 1) - 1, l &= r & ~(o & ~i), l = l & 201326741 ? l & 201326741 | 1 : l ? l | 2 : 0;
          }
          l !== 0 && (a = !0, Xg(n, l));
        } else l = ge, l = ks(n, n === Be ? l : 0, n.cancelPendingCommit !== null || n.timeoutHandle !== -1), (l & 3) === 0 || oi(n, l) || (a = !0, Xg(n, l));
        n = n.next;
      } while (a);
      Df = !1;
    }
  }
  function wS() {
    Ob();
  }
  function Ob() {
    ms = bd = !1;
    var e = 0;
    En !== 0 && ES() && (e = En);
    for (var t = $t(), a = null, n = ps; n !== null;) {
      var r = n.next,
        l = Pb(n, t);
      l === 0 ? (n.next = null, a === null ? ps = r : a.next = r, r === null && (il = a)) : (a = n, (e !== 0 || (l & 3) !== 0) && (ms = !0)), n = r;
    }
    ft !== 0 && ft !== 5 || pi(e, !1), En !== 0 && (En = 0);
  }
  function Pb(e, t) {
    for (var a = e.suspendedLanes, n = e.pingedLanes, r = e.expirationTimes, l = e.pendingLanes & -62914561; 0 < l;) {
      var o = 31 - ta(l),
        i = 1 << o,
        u = r[o];
      u === -1 ? ((i & a) === 0 || (i & n) !== 0) && (r[o] = Kk(i, t)) : u <= t && (e.expiredLanes |= i), l &= ~i;
    }
    if (t = Be, a = ge, a = ks(e, e === t ? a : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1), n = e.callbackNode, a === 0 || e === t && (we === 2 || we === 9) || e.cancelPendingCommit !== null) return n !== null && n !== null && rf(n), e.callbackNode = null, e.callbackPriority = 0;
    if ((a & 3) === 0 || oi(e, a)) {
      if (t = a & -a, t === e.callbackPriority) return t;
      switch (n !== null && rf(n), Nd(a)) {
        case 2:
        case 8:
          a = Sx;
          break;
        case 32:
          a = Ku;
          break;
        case 268435456:
          a = Cx;
          break;
        default:
          a = Ku;
      }
      return n = Ub.bind(null, e), a = Ed(a, n), e.callbackPriority = t, e.callbackNode = a, t;
    }
    return n !== null && n !== null && rf(n), e.callbackPriority = 2, e.callbackNode = null, 2;
  }
  function Ub(e, t) {
    if (ft !== 0 && ft !== 5) return e.callbackNode = null, e.callbackPriority = 0, null;
    var a = e.callbackNode;
    if (Os() && e.callbackNode !== a) return null;
    var n = ge;
    return n = ks(e, e === Be ? n : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1), n === 0 ? null : (wb(e, n, t), Pb(e, $t()), e.callbackNode != null && e.callbackNode === a ? Ub.bind(null, e) : null);
  }
  function Xg(e, t) {
    if (Os()) return null;
    wb(e, t, !0);
  }
  function SS() {
    NS(function () {
      (be & 6) !== 0 ? Ed(wx, wS) : Ob();
    });
  }
  function yp() {
    if (En === 0) {
      var e = Dl;
      e === 0 && (e = hu, hu <<= 1, (hu & 261888) === 0 && (hu = 256)), En = e;
    }
    return En;
  }
  function jg(e) {
    return e == null || typeof e == "symbol" || typeof e == "boolean" ? null : typeof e == "function" ? e : Ru("" + e);
  }
  function Yg(e, t) {
    var a = t.ownerDocument.createElement("input");
    return a.name = t.name, a.value = t.value, e.id && a.setAttribute("form", e.id), t.parentNode.insertBefore(a, t), e = new FormData(e), a.parentNode.removeChild(a), e;
  }
  function CS(e, t, a, n, r) {
    if (t === "submit" && a && a.stateNode === r) {
      var l = jg((r[_t] || null).action),
        o = n.submitter;
      o && (t = (t = o[_t] || null) ? jg(t.formAction) : o.getAttribute("formAction"), t !== null && (l = t, o = null));
      var i = new ws("action", "action", null, n, r);
      e.push({
        event: i,
        listeners: [{
          instance: null,
          listener: function () {
            if (n.defaultPrevented) {
              if (En !== 0) {
                var u = o ? Yg(r, o) : new FormData(r);
                sd(a, {
                  pending: !0,
                  data: u,
                  method: r.method,
                  action: l
                }, null, u);
              }
            } else typeof l == "function" && (i.preventDefault(), u = o ? Yg(r, o) : new FormData(r), sd(a, {
              pending: !0,
              data: u,
              method: r.method,
              action: l
            }, l, u));
          },
          currentTarget: r
        }]
      });
    }
  }
  for (Au = 0; Au < Wf.length; Au++) Tu = Wf[Au], Qg = Tu.toLowerCase(), Zg = Tu[0].toUpperCase() + Tu.slice(1), wa(Qg, "on" + Zg);
  var Tu, Qg, Zg, Au;
  wa(Kx, "onAnimationEnd");
  wa(Wx, "onAnimationIteration");
  wa(Jx, "onAnimationStart");
  wa("dblclick", "onDoubleClick");
  wa("focusin", "onFocus");
  wa("focusout", "onBlur");
  wa(Gw, "onTransitionRun");
  wa(Vw, "onTransitionStart");
  wa(Xw, "onTransitionCancel");
  wa($x, "onTransitionEnd");
  Tl("onMouseEnter", ["mouseout", "mouseover"]);
  Tl("onMouseLeave", ["mouseout", "mouseover"]);
  Tl("onPointerEnter", ["pointerout", "pointerover"]);
  Tl("onPointerLeave", ["pointerout", "pointerover"]);
  wr("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" "));
  wr("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));
  wr("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]);
  wr("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" "));
  wr("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" "));
  wr("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
  var $o = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),
    IS = new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat($o));
  function qb(e, t) {
    t = (t & 4) !== 0;
    for (var a = 0; a < e.length; a++) {
      var n = e[a],
        r = n.event;
      n = n.listeners;
      e: {
        var l = void 0;
        if (t) for (var o = n.length - 1; 0 <= o; o--) {
          var i = n[o],
            u = i.instance,
            s = i.currentTarget;
          if (i = i.listener, u !== l && r.isPropagationStopped()) break e;
          l = i, r.currentTarget = s;
          try {
            l(r);
          } catch (c) {
            Ju(c);
          }
          r.currentTarget = null, l = u;
        } else for (o = 0; o < n.length; o++) {
          if (i = n[o], u = i.instance, s = i.currentTarget, i = i.listener, u !== l && r.isPropagationStopped()) break e;
          l = i, r.currentTarget = s;
          try {
            l(r);
          } catch (c) {
            Ju(c);
          }
          r.currentTarget = null, l = u;
        }
      }
    }
  }
  function pe(e, t) {
    var a = t[Gf];
    a === void 0 && (a = t[Gf] = new Set());
    var n = e + "__bubble";
    a.has(n) || (Fb(t, e, 2, !1), a.add(n));
  }
  function Bf(e, t, a) {
    var n = 0;
    t && (n |= 4), Fb(a, e, n, t);
  }
  var Mu = "_reactListening" + Math.random().toString(36).slice(2);
  function bp(e) {
    if (!e[Mu]) {
      e[Mu] = !0, Bx.forEach(function (a) {
        a !== "selectionchange" && (IS.has(a) || Bf(a, !1, e), Bf(a, !0, e));
      });
      var t = e.nodeType === 9 ? e : e.ownerDocument;
      t === null || t[Mu] || (t[Mu] = !0, Bf("selectionchange", !1, t));
    }
  }
  function Fb(e, t, a, n) {
    switch ($b(t)) {
      case 2:
        var r = eC;
        break;
      case 8:
        r = tC;
        break;
      default:
        r = wp;
    }
    a = r.bind(null, t, a, e), r = void 0, !Qf || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (r = !0), n ? r !== void 0 ? e.addEventListener(t, a, {
      capture: !0,
      passive: r
    }) : e.addEventListener(t, a, !0) : r !== void 0 ? e.addEventListener(t, a, {
      passive: r
    }) : e.addEventListener(t, a, !1);
  }
  function Ef(e, t, a, n, r) {
    var l = n;
    if ((t & 1) === 0 && (t & 2) === 0 && n !== null) e: for (;;) {
      if (n === null) return;
      var o = n.tag;
      if (o === 3 || o === 4) {
        var i = n.stateNode.containerInfo;
        if (i === r) break;
        if (o === 4) for (o = n.return; o !== null;) {
          var u = o.tag;
          if ((u === 3 || u === 4) && o.stateNode.containerInfo === r) return;
          o = o.return;
        }
        for (; i !== null;) {
          if (o = cl(i), o === null) return;
          if (u = o.tag, u === 5 || u === 6 || u === 26 || u === 27) {
            n = l = o;
            continue e;
          }
          i = i.parentNode;
        }
      }
      n = n.return;
    }
    qx(function () {
      var s = l,
        c = Pd(a),
        f = [];
      e: {
        var d = ey.get(e);
        if (d !== void 0) {
          var p = ws,
            x = e;
          switch (e) {
            case "keypress":
              if (zu(a) === 0) break e;
            case "keydown":
            case "keyup":
              p = Lw;
              break;
            case "focusin":
              x = "focus", p = cf;
              break;
            case "focusout":
              x = "blur", p = cf;
              break;
            case "beforeblur":
            case "afterblur":
              p = cf;
              break;
            case "click":
              if (a.button === 2) break e;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              p = ag;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              p = sw;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              p = Sw;
              break;
            case Kx:
            case Wx:
            case Jx:
              p = dw;
              break;
            case $x:
              p = Iw;
              break;
            case "scroll":
            case "scrollend":
              p = iw;
              break;
            case "wheel":
              p = Tw;
              break;
            case "copy":
            case "cut":
            case "paste":
              p = mw;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              p = rg;
              break;
            case "toggle":
            case "beforetoggle":
              p = Dw;
          }
          var b = (t & 4) !== 0,
            C = !b && (e === "scroll" || e === "scrollend"),
            h = b ? d !== null ? d + "Capture" : null : d;
          b = [];
          for (var m = s, g; m !== null;) {
            var L = m;
            if (g = L.stateNode, L = L.tag, L !== 5 && L !== 26 && L !== 27 || g === null || h === null || (L = Xo(m, h), L != null && b.push(ei(m, L, g))), C) break;
            m = m.return;
          }
          0 < b.length && (d = new p(d, x, null, a, c), f.push({
            event: d,
            listeners: b
          }));
        }
      }
      if ((t & 7) === 0) {
        e: {
          if (d = e === "mouseover" || e === "pointerover", p = e === "mouseout" || e === "pointerout", d && a !== Yf && (x = a.relatedTarget || a.fromElement) && (cl(x) || x[Ul])) break e;
          if ((p || d) && (d = c.window === c ? c : (d = c.ownerDocument) ? d.defaultView || d.parentWindow : window, p ? (x = a.relatedTarget || a.toElement, p = s, x = x ? cl(x) : null, x !== null && (C = ri(x), b = x.tag, x !== C || b !== 5 && b !== 27 && b !== 6) && (x = null)) : (p = null, x = s), p !== x)) {
            if (b = ag, L = "onMouseLeave", h = "onMouseEnter", m = "mouse", (e === "pointerout" || e === "pointerover") && (b = rg, L = "onPointerLeave", h = "onPointerEnter", m = "pointer"), C = p == null ? d : To(p), g = x == null ? d : To(x), d = new b(L, m + "leave", p, a, c), d.target = C, d.relatedTarget = g, L = null, cl(c) === s && (b = new b(h, m + "enter", x, a, c), b.target = g, b.relatedTarget = C, L = b), C = L, p && x) t: {
              for (b = AS, h = p, m = x, g = 0, L = h; L; L = b(L)) g++;
              L = 0;
              for (var I = m; I; I = b(I)) L++;
              for (; 0 < g - L;) h = b(h), g--;
              for (; 0 < L - g;) m = b(m), L--;
              for (; g--;) {
                if (h === m || m !== null && h === m.alternate) {
                  b = h;
                  break t;
                }
                h = b(h), m = b(m);
              }
              b = null;
            } else b = null;
            p !== null && Kg(f, d, p, b, !1), x !== null && C !== null && Kg(f, C, x, b, !0);
          }
        }
        e: {
          if (d = s ? To(s) : window, p = d.nodeName && d.nodeName.toLowerCase(), p === "select" || p === "input" && d.type === "file") var k = ug;else if (ig(d)) {
            if (Xx) k = Fw;else {
              k = Uw;
              var S = Pw;
            }
          } else p = d.nodeName, !p || p.toLowerCase() !== "input" || d.type !== "checkbox" && d.type !== "radio" ? s && Od(s.elementType) && (k = ug) : k = qw;
          if (k && (k = k(e, s))) {
            Vx(f, k, a, c);
            break e;
          }
          S && S(e, d, s), e === "focusout" && s && d.type === "number" && s.memoizedProps.value != null && jf(d, "number", d.value);
        }
        switch (S = s ? To(s) : window, e) {
          case "focusin":
            (ig(S) || S.contentEditable === "true") && (pl = S, Zf = s, Ro = null);
            break;
          case "focusout":
            Ro = Zf = pl = null;
            break;
          case "mousedown":
            Kf = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            Kf = !1, dg(f, a, c);
            break;
          case "selectionchange":
            if (_w) break;
          case "keydown":
          case "keyup":
            dg(f, a, c);
        }
        var A;
        if (Fd) e: {
          switch (e) {
            case "compositionstart":
              var R = "onCompositionStart";
              break e;
            case "compositionend":
              R = "onCompositionEnd";
              break e;
            case "compositionupdate":
              R = "onCompositionUpdate";
              break e;
          }
          R = void 0;
        } else dl ? _x(e, a) && (R = "onCompositionEnd") : e === "keydown" && a.keyCode === 229 && (R = "onCompositionStart");
        R && (Hx && a.locale !== "ko" && (dl || R !== "onCompositionStart" ? R === "onCompositionEnd" && dl && (A = Fx()) : (Mn = c, Ud = "value" in Mn ? Mn.value : Mn.textContent, dl = !0)), S = hs(s, R), 0 < S.length && (R = new ng(R, e, null, a, c), f.push({
          event: R,
          listeners: S
        }), A ? R.data = A : (A = Gx(a), A !== null && (R.data = A)))), (A = Ew ? Rw(e, a) : Nw(e, a)) && (R = hs(s, "onBeforeInput"), 0 < R.length && (S = new ng("onBeforeInput", "beforeinput", null, a, c), f.push({
          event: S,
          listeners: R
        }), S.data = A)), CS(f, e, s, a, c);
      }
      qb(f, t);
    });
  }
  function ei(e, t, a) {
    return {
      instance: e,
      listener: t,
      currentTarget: a
    };
  }
  function hs(e, t) {
    for (var a = t + "Capture", n = []; e !== null;) {
      var r = e,
        l = r.stateNode;
      if (r = r.tag, r !== 5 && r !== 26 && r !== 27 || l === null || (r = Xo(e, a), r != null && n.unshift(ei(e, r, l)), r = Xo(e, t), r != null && n.push(ei(e, r, l))), e.tag === 3) return n;
      e = e.return;
    }
    return [];
  }
  function AS(e) {
    if (e === null) return null;
    do e = e.return; while (e && e.tag !== 5 && e.tag !== 27);
    return e || null;
  }
  function Kg(e, t, a, n, r) {
    for (var l = t._reactName, o = []; a !== null && a !== n;) {
      var i = a,
        u = i.alternate,
        s = i.stateNode;
      if (i = i.tag, u !== null && u === n) break;
      i !== 5 && i !== 26 && i !== 27 || s === null || (u = s, r ? (s = Xo(a, l), s != null && o.unshift(ei(a, s, u))) : r || (s = Xo(a, l), s != null && o.push(ei(a, s, u)))), a = a.return;
    }
    o.length !== 0 && e.push({
      event: t,
      listeners: o
    });
  }
  var TS = /\r\n?/g,
    MS = /\u0000|\uFFFD/g;
  function Wg(e) {
    return (typeof e == "string" ? e : "" + e).replace(TS, `
`).replace(MS, "");
  }
  function Hb(e, t) {
    return t = Wg(t), Wg(e) === t;
  }
  function Ae(e, t, a, n, r, l) {
    switch (a) {
      case "children":
        typeof n == "string" ? t === "body" || t === "textarea" && n === "" || Ml(e, n) : (typeof n == "number" || typeof n == "bigint") && t !== "body" && Ml(e, "" + n);
        break;
      case "className":
        yu(e, "class", n);
        break;
      case "tabIndex":
        yu(e, "tabindex", n);
        break;
      case "dir":
      case "role":
      case "viewBox":
      case "width":
      case "height":
        yu(e, a, n);
        break;
      case "style":
        Ux(e, n, l);
        break;
      case "data":
        if (t !== "object") {
          yu(e, "data", n);
          break;
        }
      case "src":
      case "href":
        if (n === "" && (t !== "a" || a !== "href")) {
          e.removeAttribute(a);
          break;
        }
        if (n == null || typeof n == "function" || typeof n == "symbol" || typeof n == "boolean") {
          e.removeAttribute(a);
          break;
        }
        n = Ru("" + n), e.setAttribute(a, n);
        break;
      case "action":
      case "formAction":
        if (typeof n == "function") {
          e.setAttribute(a, "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");
          break;
        } else typeof l == "function" && (a === "formAction" ? (t !== "input" && Ae(e, t, "name", r.name, r, null), Ae(e, t, "formEncType", r.formEncType, r, null), Ae(e, t, "formMethod", r.formMethod, r, null), Ae(e, t, "formTarget", r.formTarget, r, null)) : (Ae(e, t, "encType", r.encType, r, null), Ae(e, t, "method", r.method, r, null), Ae(e, t, "target", r.target, r, null)));
        if (n == null || typeof n == "symbol" || typeof n == "boolean") {
          e.removeAttribute(a);
          break;
        }
        n = Ru("" + n), e.setAttribute(a, n);
        break;
      case "onClick":
        n != null && (e.onclick = Ja);
        break;
      case "onScroll":
        n != null && pe("scroll", e);
        break;
      case "onScrollEnd":
        n != null && pe("scrollend", e);
        break;
      case "dangerouslySetInnerHTML":
        if (n != null) {
          if (typeof n != "object" || !("__html" in n)) throw Error(B(61));
          if (a = n.__html, a != null) {
            if (r.children != null) throw Error(B(60));
            e.innerHTML = a;
          }
        }
        break;
      case "multiple":
        e.multiple = n && typeof n != "function" && typeof n != "symbol";
        break;
      case "muted":
        e.muted = n && typeof n != "function" && typeof n != "symbol";
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
        if (n == null || typeof n == "function" || typeof n == "boolean" || typeof n == "symbol") {
          e.removeAttribute("xlink:href");
          break;
        }
        a = Ru("" + n), e.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", a);
        break;
      case "contentEditable":
      case "spellCheck":
      case "draggable":
      case "value":
      case "autoReverse":
      case "externalResourcesRequired":
      case "focusable":
      case "preserveAlpha":
        n != null && typeof n != "function" && typeof n != "symbol" ? e.setAttribute(a, "" + n) : e.removeAttribute(a);
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
        n && typeof n != "function" && typeof n != "symbol" ? e.setAttribute(a, "") : e.removeAttribute(a);
        break;
      case "capture":
      case "download":
        n === !0 ? e.setAttribute(a, "") : n !== !1 && n != null && typeof n != "function" && typeof n != "symbol" ? e.setAttribute(a, n) : e.removeAttribute(a);
        break;
      case "cols":
      case "rows":
      case "size":
      case "span":
        n != null && typeof n != "function" && typeof n != "symbol" && !isNaN(n) && 1 <= n ? e.setAttribute(a, n) : e.removeAttribute(a);
        break;
      case "rowSpan":
      case "start":
        n == null || typeof n == "function" || typeof n == "symbol" || isNaN(n) ? e.removeAttribute(a) : e.setAttribute(a, n);
        break;
      case "popover":
        pe("beforetoggle", e), pe("toggle", e), Eu(e, "popover", n);
        break;
      case "xlinkActuate":
        Va(e, "http://www.w3.org/1999/xlink", "xlink:actuate", n);
        break;
      case "xlinkArcrole":
        Va(e, "http://www.w3.org/1999/xlink", "xlink:arcrole", n);
        break;
      case "xlinkRole":
        Va(e, "http://www.w3.org/1999/xlink", "xlink:role", n);
        break;
      case "xlinkShow":
        Va(e, "http://www.w3.org/1999/xlink", "xlink:show", n);
        break;
      case "xlinkTitle":
        Va(e, "http://www.w3.org/1999/xlink", "xlink:title", n);
        break;
      case "xlinkType":
        Va(e, "http://www.w3.org/1999/xlink", "xlink:type", n);
        break;
      case "xmlBase":
        Va(e, "http://www.w3.org/XML/1998/namespace", "xml:base", n);
        break;
      case "xmlLang":
        Va(e, "http://www.w3.org/XML/1998/namespace", "xml:lang", n);
        break;
      case "xmlSpace":
        Va(e, "http://www.w3.org/XML/1998/namespace", "xml:space", n);
        break;
      case "is":
        Eu(e, "is", n);
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        (!(2 < a.length) || a[0] !== "o" && a[0] !== "O" || a[1] !== "n" && a[1] !== "N") && (a = lw.get(a) || a, Eu(e, a, n));
    }
  }
  function vd(e, t, a, n, r, l) {
    switch (a) {
      case "style":
        Ux(e, n, l);
        break;
      case "dangerouslySetInnerHTML":
        if (n != null) {
          if (typeof n != "object" || !("__html" in n)) throw Error(B(61));
          if (a = n.__html, a != null) {
            if (r.children != null) throw Error(B(60));
            e.innerHTML = a;
          }
        }
        break;
      case "children":
        typeof n == "string" ? Ml(e, n) : (typeof n == "number" || typeof n == "bigint") && Ml(e, "" + n);
        break;
      case "onScroll":
        n != null && pe("scroll", e);
        break;
      case "onScrollEnd":
        n != null && pe("scrollend", e);
        break;
      case "onClick":
        n != null && (e.onclick = Ja);
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
        if (!Ex.hasOwnProperty(a)) e: {
          if (a[0] === "o" && a[1] === "n" && (r = a.endsWith("Capture"), t = a.slice(2, r ? a.length - 7 : void 0), l = e[_t] || null, l = l != null ? l[a] : null, typeof l == "function" && e.removeEventListener(t, l, r), typeof n == "function")) {
            typeof l != "function" && l !== null && (a in e ? e[a] = null : e.hasAttribute(a) && e.removeAttribute(a)), e.addEventListener(t, n, r);
            break e;
          }
          a in e ? e[a] = n : n === !0 ? e.setAttribute(a, "") : Eu(e, a, n);
        }
    }
  }
  function Ct(e, t, a) {
    switch (t) {
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
        pe("error", e), pe("load", e);
        var n = !1,
          r = !1,
          l;
        for (l in a) if (a.hasOwnProperty(l)) {
          var o = a[l];
          if (o != null) switch (l) {
            case "src":
              n = !0;
              break;
            case "srcSet":
              r = !0;
              break;
            case "children":
            case "dangerouslySetInnerHTML":
              throw Error(B(137, t));
            default:
              Ae(e, t, l, o, a, null);
          }
        }
        r && Ae(e, t, "srcSet", a.srcSet, a, null), n && Ae(e, t, "src", a.src, a, null);
        return;
      case "input":
        pe("invalid", e);
        var i = l = o = r = null,
          u = null,
          s = null;
        for (n in a) if (a.hasOwnProperty(n)) {
          var c = a[n];
          if (c != null) switch (n) {
            case "name":
              r = c;
              break;
            case "type":
              o = c;
              break;
            case "checked":
              u = c;
              break;
            case "defaultChecked":
              s = c;
              break;
            case "value":
              l = c;
              break;
            case "defaultValue":
              i = c;
              break;
            case "children":
            case "dangerouslySetInnerHTML":
              if (c != null) throw Error(B(137, t));
              break;
            default:
              Ae(e, t, n, c, a, null);
          }
        }
        zx(e, l, i, u, s, o, r, !1);
        return;
      case "select":
        pe("invalid", e), n = o = l = null;
        for (r in a) if (a.hasOwnProperty(r) && (i = a[r], i != null)) switch (r) {
          case "value":
            l = i;
            break;
          case "defaultValue":
            o = i;
            break;
          case "multiple":
            n = i;
          default:
            Ae(e, t, r, i, a, null);
        }
        t = l, a = o, e.multiple = !!n, t != null ? Ll(e, !!n, t, !1) : a != null && Ll(e, !!n, a, !0);
        return;
      case "textarea":
        pe("invalid", e), l = r = n = null;
        for (o in a) if (a.hasOwnProperty(o) && (i = a[o], i != null)) switch (o) {
          case "value":
            n = i;
            break;
          case "defaultValue":
            r = i;
            break;
          case "children":
            l = i;
            break;
          case "dangerouslySetInnerHTML":
            if (i != null) throw Error(B(91));
            break;
          default:
            Ae(e, t, o, i, a, null);
        }
        Px(e, n, r, l);
        return;
      case "option":
        for (u in a) a.hasOwnProperty(u) && (n = a[u], n != null) && (u === "selected" ? e.selected = n && typeof n != "function" && typeof n != "symbol" : Ae(e, t, u, n, a, null));
        return;
      case "dialog":
        pe("beforetoggle", e), pe("toggle", e), pe("cancel", e), pe("close", e);
        break;
      case "iframe":
      case "object":
        pe("load", e);
        break;
      case "video":
      case "audio":
        for (n = 0; n < $o.length; n++) pe($o[n], e);
        break;
      case "image":
        pe("error", e), pe("load", e);
        break;
      case "details":
        pe("toggle", e);
        break;
      case "embed":
      case "source":
      case "link":
        pe("error", e), pe("load", e);
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
        for (s in a) if (a.hasOwnProperty(s) && (n = a[s], n != null)) switch (s) {
          case "children":
          case "dangerouslySetInnerHTML":
            throw Error(B(137, t));
          default:
            Ae(e, t, s, n, a, null);
        }
        return;
      default:
        if (Od(t)) {
          for (c in a) a.hasOwnProperty(c) && (n = a[c], n !== void 0 && vd(e, t, c, n, a, void 0));
          return;
        }
    }
    for (i in a) a.hasOwnProperty(i) && (n = a[i], n != null && Ae(e, t, i, n, a, null));
  }
  function DS(e, t, a, n) {
    switch (t) {
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
        var r = null,
          l = null,
          o = null,
          i = null,
          u = null,
          s = null,
          c = null;
        for (p in a) {
          var f = a[p];
          if (a.hasOwnProperty(p) && f != null) switch (p) {
            case "checked":
              break;
            case "value":
              break;
            case "defaultValue":
              u = f;
            default:
              n.hasOwnProperty(p) || Ae(e, t, p, null, n, f);
          }
        }
        for (var d in n) {
          var p = n[d];
          if (f = a[d], n.hasOwnProperty(d) && (p != null || f != null)) switch (d) {
            case "type":
              l = p;
              break;
            case "name":
              r = p;
              break;
            case "checked":
              s = p;
              break;
            case "defaultChecked":
              c = p;
              break;
            case "value":
              o = p;
              break;
            case "defaultValue":
              i = p;
              break;
            case "children":
            case "dangerouslySetInnerHTML":
              if (p != null) throw Error(B(137, t));
              break;
            default:
              p !== f && Ae(e, t, d, p, n, f);
          }
        }
        Xf(e, o, i, u, s, c, l, r);
        return;
      case "select":
        p = o = i = d = null;
        for (l in a) if (u = a[l], a.hasOwnProperty(l) && u != null) switch (l) {
          case "value":
            break;
          case "multiple":
            p = u;
          default:
            n.hasOwnProperty(l) || Ae(e, t, l, null, n, u);
        }
        for (r in n) if (l = n[r], u = a[r], n.hasOwnProperty(r) && (l != null || u != null)) switch (r) {
          case "value":
            d = l;
            break;
          case "defaultValue":
            i = l;
            break;
          case "multiple":
            o = l;
          default:
            l !== u && Ae(e, t, r, l, n, u);
        }
        t = i, a = o, n = p, d != null ? Ll(e, !!a, d, !1) : !!n != !!a && (t != null ? Ll(e, !!a, t, !0) : Ll(e, !!a, a ? [] : "", !1));
        return;
      case "textarea":
        p = d = null;
        for (i in a) if (r = a[i], a.hasOwnProperty(i) && r != null && !n.hasOwnProperty(i)) switch (i) {
          case "value":
            break;
          case "children":
            break;
          default:
            Ae(e, t, i, null, n, r);
        }
        for (o in n) if (r = n[o], l = a[o], n.hasOwnProperty(o) && (r != null || l != null)) switch (o) {
          case "value":
            d = r;
            break;
          case "defaultValue":
            p = r;
            break;
          case "children":
            break;
          case "dangerouslySetInnerHTML":
            if (r != null) throw Error(B(91));
            break;
          default:
            r !== l && Ae(e, t, o, r, n, l);
        }
        Ox(e, d, p);
        return;
      case "option":
        for (var x in a) d = a[x], a.hasOwnProperty(x) && d != null && !n.hasOwnProperty(x) && (x === "selected" ? e.selected = !1 : Ae(e, t, x, null, n, d));
        for (u in n) d = n[u], p = a[u], n.hasOwnProperty(u) && d !== p && (d != null || p != null) && (u === "selected" ? e.selected = d && typeof d != "function" && typeof d != "symbol" : Ae(e, t, u, d, n, p));
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
        for (var b in a) d = a[b], a.hasOwnProperty(b) && d != null && !n.hasOwnProperty(b) && Ae(e, t, b, null, n, d);
        for (s in n) if (d = n[s], p = a[s], n.hasOwnProperty(s) && d !== p && (d != null || p != null)) switch (s) {
          case "children":
          case "dangerouslySetInnerHTML":
            if (d != null) throw Error(B(137, t));
            break;
          default:
            Ae(e, t, s, d, n, p);
        }
        return;
      default:
        if (Od(t)) {
          for (var C in a) d = a[C], a.hasOwnProperty(C) && d !== void 0 && !n.hasOwnProperty(C) && vd(e, t, C, void 0, n, d);
          for (c in n) d = n[c], p = a[c], !n.hasOwnProperty(c) || d === p || d === void 0 && p === void 0 || vd(e, t, c, d, n, p);
          return;
        }
    }
    for (var h in a) d = a[h], a.hasOwnProperty(h) && d != null && !n.hasOwnProperty(h) && Ae(e, t, h, null, n, d);
    for (f in n) d = n[f], p = a[f], !n.hasOwnProperty(f) || d === p || d == null && p == null || Ae(e, t, f, d, n, p);
  }
  function Jg(e) {
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
  function BS() {
    if (typeof performance.getEntriesByType == "function") {
      for (var e = 0, t = 0, a = performance.getEntriesByType("resource"), n = 0; n < a.length; n++) {
        var r = a[n],
          l = r.transferSize,
          o = r.initiatorType,
          i = r.duration;
        if (l && i && Jg(o)) {
          for (o = 0, i = r.responseEnd, n += 1; n < a.length; n++) {
            var u = a[n],
              s = u.startTime;
            if (s > i) break;
            var c = u.transferSize,
              f = u.initiatorType;
            c && Jg(f) && (u = u.responseEnd, o += c * (u < i ? 1 : (i - s) / (u - s)));
          }
          if (--n, t += 8 * (l + o) / (r.duration / 1e3), e++, 10 < e) break;
        }
      }
      if (0 < e) return t / e / 1e6;
    }
    return navigator.connection && (e = navigator.connection.downlink, typeof e == "number") ? e : 5;
  }
  var Ld = null,
    kd = null;
  function gs(e) {
    return e.nodeType === 9 ? e : e.ownerDocument;
  }
  function $g(e) {
    switch (e) {
      case "http://www.w3.org/2000/svg":
        return 1;
      case "http://www.w3.org/1998/Math/MathML":
        return 2;
      default:
        return 0;
    }
  }
  function _b(e, t) {
    if (e === 0) switch (t) {
      case "svg":
        return 1;
      case "math":
        return 2;
      default:
        return 0;
    }
    return e === 1 && t === "foreignObject" ? 0 : e;
  }
  function wd(e, t) {
    return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.children == "bigint" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
  }
  var Rf = null;
  function ES() {
    var e = window.event;
    return e && e.type === "popstate" ? e === Rf ? !1 : (Rf = e, !0) : (Rf = null, !1);
  }
  var Gb = typeof setTimeout == "function" ? setTimeout : void 0,
    RS = typeof clearTimeout == "function" ? clearTimeout : void 0,
    ex = typeof Promise == "function" ? Promise : void 0,
    NS = typeof queueMicrotask == "function" ? queueMicrotask : typeof ex < "u" ? function (e) {
      return ex.resolve(null).then(e).catch(zS);
    } : Gb;
  function zS(e) {
    setTimeout(function () {
      throw e;
    });
  }
  function Yn(e) {
    return e === "head";
  }
  function tx(e, t) {
    var a = t,
      n = 0;
    do {
      var r = a.nextSibling;
      if (e.removeChild(a), r && r.nodeType === 8) if (a = r.data, a === "/$" || a === "/&") {
        if (n === 0) {
          e.removeChild(r), Pl(t);
          return;
        }
        n--;
      } else if (a === "$" || a === "$?" || a === "$~" || a === "$!" || a === "&") n++;else if (a === "html") Go(e.ownerDocument.documentElement);else if (a === "head") {
        a = e.ownerDocument.head, Go(a);
        for (var l = a.firstChild; l;) {
          var o = l.nextSibling,
            i = l.nodeName;
          l[ui] || i === "SCRIPT" || i === "STYLE" || i === "LINK" && l.rel.toLowerCase() === "stylesheet" || a.removeChild(l), l = o;
        }
      } else a === "body" && Go(e.ownerDocument.body);
      a = r;
    } while (a);
    Pl(t);
  }
  function ax(e, t) {
    var a = e;
    e = 0;
    do {
      var n = a.nextSibling;
      if (a.nodeType === 1 ? t ? (a._stashedDisplay = a.style.display, a.style.display = "none") : (a.style.display = a._stashedDisplay || "", a.getAttribute("style") === "" && a.removeAttribute("style")) : a.nodeType === 3 && (t ? (a._stashedText = a.nodeValue, a.nodeValue = "") : a.nodeValue = a._stashedText || ""), n && n.nodeType === 8) if (a = n.data, a === "/$") {
        if (e === 0) break;
        e--;
      } else a !== "$" && a !== "$?" && a !== "$~" && a !== "$!" || e++;
      a = n;
    } while (a);
  }
  function Sd(e) {
    var t = e.firstChild;
    for (t && t.nodeType === 10 && (t = t.nextSibling); t;) {
      var a = t;
      switch (t = t.nextSibling, a.nodeName) {
        case "HTML":
        case "HEAD":
        case "BODY":
          Sd(a), zd(a);
          continue;
        case "SCRIPT":
        case "STYLE":
          continue;
        case "LINK":
          if (a.rel.toLowerCase() === "stylesheet") continue;
      }
      e.removeChild(a);
    }
  }
  function OS(e, t, a, n) {
    for (; e.nodeType === 1;) {
      var r = a;
      if (e.nodeName.toLowerCase() !== t.toLowerCase()) {
        if (!n && (e.nodeName !== "INPUT" || e.type !== "hidden")) break;
      } else if (n) {
        if (!e[ui]) switch (t) {
          case "meta":
            if (!e.hasAttribute("itemprop")) break;
            return e;
          case "link":
            if (l = e.getAttribute("rel"), l === "stylesheet" && e.hasAttribute("data-precedence")) break;
            if (l !== r.rel || e.getAttribute("href") !== (r.href == null || r.href === "" ? null : r.href) || e.getAttribute("crossorigin") !== (r.crossOrigin == null ? null : r.crossOrigin) || e.getAttribute("title") !== (r.title == null ? null : r.title)) break;
            return e;
          case "style":
            if (e.hasAttribute("data-precedence")) break;
            return e;
          case "script":
            if (l = e.getAttribute("src"), (l !== (r.src == null ? null : r.src) || e.getAttribute("type") !== (r.type == null ? null : r.type) || e.getAttribute("crossorigin") !== (r.crossOrigin == null ? null : r.crossOrigin)) && l && e.hasAttribute("async") && !e.hasAttribute("itemprop")) break;
            return e;
          default:
            return e;
        }
      } else if (t === "input" && e.type === "hidden") {
        var l = r.name == null ? null : "" + r.name;
        if (r.type === "hidden" && e.getAttribute("name") === l) return e;
      } else return e;
      if (e = ha(e.nextSibling), e === null) break;
    }
    return null;
  }
  function PS(e, t, a) {
    if (t === "") return null;
    for (; e.nodeType !== 3;) if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !a || (e = ha(e.nextSibling), e === null)) return null;
    return e;
  }
  function Vb(e, t) {
    for (; e.nodeType !== 8;) if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !t || (e = ha(e.nextSibling), e === null)) return null;
    return e;
  }
  function Cd(e) {
    return e.data === "$?" || e.data === "$~";
  }
  function Id(e) {
    return e.data === "$!" || e.data === "$?" && e.ownerDocument.readyState !== "loading";
  }
  function US(e, t) {
    var a = e.ownerDocument;
    if (e.data === "$~") e._reactRetry = t;else if (e.data !== "$?" || a.readyState !== "loading") t();else {
      var n = function () {
        t(), a.removeEventListener("DOMContentLoaded", n);
      };
      a.addEventListener("DOMContentLoaded", n), e._reactRetry = n;
    }
  }
  function ha(e) {
    for (; e != null; e = e.nextSibling) {
      var t = e.nodeType;
      if (t === 1 || t === 3) break;
      if (t === 8) {
        if (t = e.data, t === "$" || t === "$!" || t === "$?" || t === "$~" || t === "&" || t === "F!" || t === "F") break;
        if (t === "/$" || t === "/&") return null;
      }
    }
    return e;
  }
  var Ad = null;
  function nx(e) {
    e = e.nextSibling;
    for (var t = 0; e;) {
      if (e.nodeType === 8) {
        var a = e.data;
        if (a === "/$" || a === "/&") {
          if (t === 0) return ha(e.nextSibling);
          t--;
        } else a !== "$" && a !== "$!" && a !== "$?" && a !== "$~" && a !== "&" || t++;
      }
      e = e.nextSibling;
    }
    return null;
  }
  function rx(e) {
    e = e.previousSibling;
    for (var t = 0; e;) {
      if (e.nodeType === 8) {
        var a = e.data;
        if (a === "$" || a === "$!" || a === "$?" || a === "$~" || a === "&") {
          if (t === 0) return e;
          t--;
        } else a !== "/$" && a !== "/&" || t++;
      }
      e = e.previousSibling;
    }
    return null;
  }
  function Xb(e, t, a) {
    switch (t = gs(a), e) {
      case "html":
        if (e = t.documentElement, !e) throw Error(B(452));
        return e;
      case "head":
        if (e = t.head, !e) throw Error(B(453));
        return e;
      case "body":
        if (e = t.body, !e) throw Error(B(454));
        return e;
      default:
        throw Error(B(451));
    }
  }
  function Go(e) {
    for (var t = e.attributes; t.length;) e.removeAttributeNode(t[0]);
    zd(e);
  }
  var ga = new Map(),
    lx = new Set();
  function xs(e) {
    return typeof e.getRootNode == "function" ? e.getRootNode() : e.nodeType === 9 ? e : e.ownerDocument;
  }
  var sn = ve.d;
  ve.d = {
    f: qS,
    r: FS,
    D: HS,
    C: _S,
    L: GS,
    m: VS,
    X: jS,
    S: XS,
    M: YS
  };
  function qS() {
    var e = sn.f(),
      t = Ns();
    return e || t;
  }
  function FS(e) {
    var t = ql(e);
    t !== null && t.tag === 5 && t.type === "form" ? Uy(t) : sn.r(e);
  }
  var Gl = typeof document > "u" ? null : document;
  function jb(e, t, a) {
    var n = Gl;
    if (n && typeof t == "string" && t) {
      var r = fa(t);
      r = 'link[rel="' + e + '"][href="' + r + '"]', typeof a == "string" && (r += '[crossorigin="' + a + '"]'), lx.has(r) || (lx.add(r), e = {
        rel: e,
        crossOrigin: a,
        href: t
      }, n.querySelector(r) === null && (t = n.createElement("link"), Ct(t, "link", e), gt(t), n.head.appendChild(t)));
    }
  }
  function HS(e) {
    sn.D(e), jb("dns-prefetch", e, null);
  }
  function _S(e, t) {
    sn.C(e, t), jb("preconnect", e, t);
  }
  function GS(e, t, a) {
    sn.L(e, t, a);
    var n = Gl;
    if (n && e && t) {
      var r = 'link[rel="preload"][as="' + fa(t) + '"]';
      t === "image" && a && a.imageSrcSet ? (r += '[imagesrcset="' + fa(a.imageSrcSet) + '"]', typeof a.imageSizes == "string" && (r += '[imagesizes="' + fa(a.imageSizes) + '"]')) : r += '[href="' + fa(e) + '"]';
      var l = r;
      switch (t) {
        case "style":
          l = Ol(e);
          break;
        case "script":
          l = Vl(e);
      }
      ga.has(l) || (e = qe({
        rel: "preload",
        href: t === "image" && a && a.imageSrcSet ? void 0 : e,
        as: t
      }, a), ga.set(l, e), n.querySelector(r) !== null || t === "style" && n.querySelector(mi(l)) || t === "script" && n.querySelector(hi(l)) || (t = n.createElement("link"), Ct(t, "link", e), gt(t), n.head.appendChild(t)));
    }
  }
  function VS(e, t) {
    sn.m(e, t);
    var a = Gl;
    if (a && e) {
      var n = t && typeof t.as == "string" ? t.as : "script",
        r = 'link[rel="modulepreload"][as="' + fa(n) + '"][href="' + fa(e) + '"]',
        l = r;
      switch (n) {
        case "audioworklet":
        case "paintworklet":
        case "serviceworker":
        case "sharedworker":
        case "worker":
        case "script":
          l = Vl(e);
      }
      if (!ga.has(l) && (e = qe({
        rel: "modulepreload",
        href: e
      }, t), ga.set(l, e), a.querySelector(r) === null)) {
        switch (n) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            if (a.querySelector(hi(l))) return;
        }
        n = a.createElement("link"), Ct(n, "link", e), gt(n), a.head.appendChild(n);
      }
    }
  }
  function XS(e, t, a) {
    sn.S(e, t, a);
    var n = Gl;
    if (n && e) {
      var r = vl(n).hoistableStyles,
        l = Ol(e);
      t = t || "default";
      var o = r.get(l);
      if (!o) {
        var i = {
          loading: 0,
          preload: null
        };
        if (o = n.querySelector(mi(l))) i.loading = 5;else {
          e = qe({
            rel: "stylesheet",
            href: e,
            "data-precedence": t
          }, a), (a = ga.get(l)) && vp(e, a);
          var u = o = n.createElement("link");
          gt(u), Ct(u, "link", e), u._p = new Promise(function (s, c) {
            u.onload = s, u.onerror = c;
          }), u.addEventListener("load", function () {
            i.loading |= 1;
          }), u.addEventListener("error", function () {
            i.loading |= 2;
          }), i.loading |= 4, Gu(o, t, n);
        }
        o = {
          type: "stylesheet",
          instance: o,
          count: 1,
          state: i
        }, r.set(l, o);
      }
    }
  }
  function jS(e, t) {
    sn.X(e, t);
    var a = Gl;
    if (a && e) {
      var n = vl(a).hoistableScripts,
        r = Vl(e),
        l = n.get(r);
      l || (l = a.querySelector(hi(r)), l || (e = qe({
        src: e,
        async: !0
      }, t), (t = ga.get(r)) && Lp(e, t), l = a.createElement("script"), gt(l), Ct(l, "link", e), a.head.appendChild(l)), l = {
        type: "script",
        instance: l,
        count: 1,
        state: null
      }, n.set(r, l));
    }
  }
  function YS(e, t) {
    sn.M(e, t);
    var a = Gl;
    if (a && e) {
      var n = vl(a).hoistableScripts,
        r = Vl(e),
        l = n.get(r);
      l || (l = a.querySelector(hi(r)), l || (e = qe({
        src: e,
        async: !0,
        type: "module"
      }, t), (t = ga.get(r)) && Lp(e, t), l = a.createElement("script"), gt(l), Ct(l, "link", e), a.head.appendChild(l)), l = {
        type: "script",
        instance: l,
        count: 1,
        state: null
      }, n.set(r, l));
    }
  }
  function ox(e, t, a, n) {
    var r = (r = Rn.current) ? xs(r) : null;
    if (!r) throw Error(B(446));
    switch (e) {
      case "meta":
      case "title":
        return null;
      case "style":
        return typeof a.precedence == "string" && typeof a.href == "string" ? (t = Ol(a.href), a = vl(r).hoistableStyles, n = a.get(t), n || (n = {
          type: "style",
          instance: null,
          count: 0,
          state: null
        }, a.set(t, n)), n) : {
          type: "void",
          instance: null,
          count: 0,
          state: null
        };
      case "link":
        if (a.rel === "stylesheet" && typeof a.href == "string" && typeof a.precedence == "string") {
          e = Ol(a.href);
          var l = vl(r).hoistableStyles,
            o = l.get(e);
          if (o || (r = r.ownerDocument || r, o = {
            type: "stylesheet",
            instance: null,
            count: 0,
            state: {
              loading: 0,
              preload: null
            }
          }, l.set(e, o), (l = r.querySelector(mi(e))) && !l._p && (o.instance = l, o.state.loading = 5), ga.has(e) || (a = {
            rel: "preload",
            as: "style",
            href: a.href,
            crossOrigin: a.crossOrigin,
            integrity: a.integrity,
            media: a.media,
            hrefLang: a.hrefLang,
            referrerPolicy: a.referrerPolicy
          }, ga.set(e, a), l || QS(r, e, a, o.state))), t && n === null) throw Error(B(528, ""));
          return o;
        }
        if (t && n !== null) throw Error(B(529, ""));
        return null;
      case "script":
        return t = a.async, a = a.src, typeof a == "string" && t && typeof t != "function" && typeof t != "symbol" ? (t = Vl(a), a = vl(r).hoistableScripts, n = a.get(t), n || (n = {
          type: "script",
          instance: null,
          count: 0,
          state: null
        }, a.set(t, n)), n) : {
          type: "void",
          instance: null,
          count: 0,
          state: null
        };
      default:
        throw Error(B(444, e));
    }
  }
  function Ol(e) {
    return 'href="' + fa(e) + '"';
  }
  function mi(e) {
    return 'link[rel="stylesheet"][' + e + "]";
  }
  function Yb(e) {
    return qe({}, e, {
      "data-precedence": e.precedence,
      precedence: null
    });
  }
  function QS(e, t, a, n) {
    e.querySelector('link[rel="preload"][as="style"][' + t + "]") ? n.loading = 1 : (t = e.createElement("link"), n.preload = t, t.addEventListener("load", function () {
      return n.loading |= 1;
    }), t.addEventListener("error", function () {
      return n.loading |= 2;
    }), Ct(t, "link", a), gt(t), e.head.appendChild(t));
  }
  function Vl(e) {
    return '[src="' + fa(e) + '"]';
  }
  function hi(e) {
    return "script[async]" + e;
  }
  function ix(e, t, a) {
    if (t.count++, t.instance === null) switch (t.type) {
      case "style":
        var n = e.querySelector('style[data-href~="' + fa(a.href) + '"]');
        if (n) return t.instance = n, gt(n), n;
        var r = qe({}, a, {
          "data-href": a.href,
          "data-precedence": a.precedence,
          href: null,
          precedence: null
        });
        return n = (e.ownerDocument || e).createElement("style"), gt(n), Ct(n, "style", r), Gu(n, a.precedence, e), t.instance = n;
      case "stylesheet":
        r = Ol(a.href);
        var l = e.querySelector(mi(r));
        if (l) return t.state.loading |= 4, t.instance = l, gt(l), l;
        n = Yb(a), (r = ga.get(r)) && vp(n, r), l = (e.ownerDocument || e).createElement("link"), gt(l);
        var o = l;
        return o._p = new Promise(function (i, u) {
          o.onload = i, o.onerror = u;
        }), Ct(l, "link", n), t.state.loading |= 4, Gu(l, a.precedence, e), t.instance = l;
      case "script":
        return l = Vl(a.src), (r = e.querySelector(hi(l))) ? (t.instance = r, gt(r), r) : (n = a, (r = ga.get(l)) && (n = qe({}, a), Lp(n, r)), e = e.ownerDocument || e, r = e.createElement("script"), gt(r), Ct(r, "link", n), e.head.appendChild(r), t.instance = r);
      case "void":
        return null;
      default:
        throw Error(B(443, t.type));
    } else t.type === "stylesheet" && (t.state.loading & 4) === 0 && (n = t.instance, t.state.loading |= 4, Gu(n, a.precedence, e));
    return t.instance;
  }
  function Gu(e, t, a) {
    for (var n = a.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'), r = n.length ? n[n.length - 1] : null, l = r, o = 0; o < n.length; o++) {
      var i = n[o];
      if (i.dataset.precedence === t) l = i;else if (l !== r) break;
    }
    l ? l.parentNode.insertBefore(e, l.nextSibling) : (t = a.nodeType === 9 ? a.head : a, t.insertBefore(e, t.firstChild));
  }
  function vp(e, t) {
    e.crossOrigin == null && (e.crossOrigin = t.crossOrigin), e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy), e.title == null && (e.title = t.title);
  }
  function Lp(e, t) {
    e.crossOrigin == null && (e.crossOrigin = t.crossOrigin), e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy), e.integrity == null && (e.integrity = t.integrity);
  }
  var Vu = null;
  function ux(e, t, a) {
    if (Vu === null) {
      var n = new Map(),
        r = Vu = new Map();
      r.set(a, n);
    } else r = Vu, n = r.get(a), n || (n = new Map(), r.set(a, n));
    if (n.has(e)) return n;
    for (n.set(e, null), a = a.getElementsByTagName(e), r = 0; r < a.length; r++) {
      var l = a[r];
      if (!(l[ui] || l[kt] || e === "link" && l.getAttribute("rel") === "stylesheet") && l.namespaceURI !== "http://www.w3.org/2000/svg") {
        var o = l.getAttribute(t) || "";
        o = e + o;
        var i = n.get(o);
        i ? i.push(l) : n.set(o, [l]);
      }
    }
    return n;
  }
  function sx(e, t, a) {
    e = e.ownerDocument || e, e.head.insertBefore(a, t === "title" ? e.querySelector("head > title") : null);
  }
  function ZS(e, t, a) {
    if (a === 1 || t.itemProp != null) return !1;
    switch (e) {
      case "meta":
      case "title":
        return !0;
      case "style":
        if (typeof t.precedence != "string" || typeof t.href != "string" || t.href === "") break;
        return !0;
      case "link":
        if (typeof t.rel != "string" || typeof t.href != "string" || t.href === "" || t.onLoad || t.onError) break;
        return t.rel === "stylesheet" ? (e = t.disabled, typeof t.precedence == "string" && e == null) : !0;
      case "script":
        if (t.async && typeof t.async != "function" && typeof t.async != "symbol" && !t.onLoad && !t.onError && t.src && typeof t.src == "string") return !0;
    }
    return !1;
  }
  function Qb(e) {
    return !(e.type === "stylesheet" && (e.state.loading & 3) === 0);
  }
  function KS(e, t, a, n) {
    if (a.type === "stylesheet" && (typeof n.media != "string" || matchMedia(n.media).matches !== !1) && (a.state.loading & 4) === 0) {
      if (a.instance === null) {
        var r = Ol(n.href),
          l = t.querySelector(mi(r));
        if (l) {
          t = l._p, t !== null && typeof t == "object" && typeof t.then == "function" && (e.count++, e = ys.bind(e), t.then(e, e)), a.state.loading |= 4, a.instance = l, gt(l);
          return;
        }
        l = t.ownerDocument || t, n = Yb(n), (r = ga.get(r)) && vp(n, r), l = l.createElement("link"), gt(l);
        var o = l;
        o._p = new Promise(function (i, u) {
          o.onload = i, o.onerror = u;
        }), Ct(l, "link", n), a.instance = l;
      }
      e.stylesheets === null && (e.stylesheets = new Map()), e.stylesheets.set(a, t), (t = a.state.preload) && (a.state.loading & 3) === 0 && (e.count++, a = ys.bind(e), t.addEventListener("load", a), t.addEventListener("error", a));
    }
  }
  var Nf = 0;
  function WS(e, t) {
    return e.stylesheets && e.count === 0 && Xu(e, e.stylesheets), 0 < e.count || 0 < e.imgCount ? function (a) {
      var n = setTimeout(function () {
        if (e.stylesheets && Xu(e, e.stylesheets), e.unsuspend) {
          var l = e.unsuspend;
          e.unsuspend = null, l();
        }
      }, 6e4 + t);
      0 < e.imgBytes && Nf === 0 && (Nf = 62500 * BS());
      var r = setTimeout(function () {
        if (e.waitingForImages = !1, e.count === 0 && (e.stylesheets && Xu(e, e.stylesheets), e.unsuspend)) {
          var l = e.unsuspend;
          e.unsuspend = null, l();
        }
      }, (e.imgBytes > Nf ? 50 : 800) + t);
      return e.unsuspend = a, function () {
        e.unsuspend = null, clearTimeout(n), clearTimeout(r);
      };
    } : null;
  }
  function ys() {
    if (this.count--, this.count === 0 && (this.imgCount === 0 || !this.waitingForImages)) {
      if (this.stylesheets) Xu(this, this.stylesheets);else if (this.unsuspend) {
        var e = this.unsuspend;
        this.unsuspend = null, e();
      }
    }
  }
  var bs = null;
  function Xu(e, t) {
    e.stylesheets = null, e.unsuspend !== null && (e.count++, bs = new Map(), t.forEach(JS, e), bs = null, ys.call(e));
  }
  function JS(e, t) {
    if (!(t.state.loading & 4)) {
      var a = bs.get(e);
      if (a) var n = a.get(null);else {
        a = new Map(), bs.set(e, a);
        for (var r = e.querySelectorAll("link[data-precedence],style[data-precedence]"), l = 0; l < r.length; l++) {
          var o = r[l];
          (o.nodeName === "LINK" || o.getAttribute("media") !== "not all") && (a.set(o.dataset.precedence, o), n = o);
        }
        n && a.set(null, n);
      }
      r = t.instance, o = r.getAttribute("data-precedence"), l = a.get(o) || n, l === n && a.set(null, r), a.set(o, r), this.count++, n = ys.bind(this), r.addEventListener("load", n), r.addEventListener("error", n), l ? l.parentNode.insertBefore(r, l.nextSibling) : (e = e.nodeType === 9 ? e.head : e, e.insertBefore(r, e.firstChild)), t.state.loading |= 4;
    }
  }
  var ti = {
    $$typeof: Wa,
    Provider: null,
    Consumer: null,
    _currentValue: pr,
    _currentValue2: pr,
    _threadCount: 0
  };
  function $S(e, t, a, n, r, l, o, i, u) {
    this.tag = 1, this.containerInfo = e, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = lf(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = lf(0), this.hiddenUpdates = lf(null), this.identifierPrefix = n, this.onUncaughtError = r, this.onCaughtError = l, this.onRecoverableError = o, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = u, this.incompleteTransitions = new Map();
  }
  function Zb(e, t, a, n, r, l, o, i, u, s, c, f) {
    return e = new $S(e, t, a, o, u, s, c, f, i), t = 1, l === !0 && (t |= 24), l = Wt(3, null, null, t), e.current = l, l.stateNode = e, t = Yd(), t.refCount++, e.pooledCache = t, t.refCount++, l.memoizedState = {
      element: n,
      isDehydrated: a,
      cache: t
    }, Kd(l), e;
  }
  function Kb(e) {
    return e ? (e = gl, e) : gl;
  }
  function Wb(e, t, a, n, r, l) {
    r = Kb(r), n.context === null ? n.context = r : n.pendingContext = r, n = zn(t), n.payload = {
      element: a
    }, l = l === void 0 ? null : l, l !== null && (n.callback = l), a = On(e, n, t), a !== null && (Ht(a, e, t), zo(a, e, t));
  }
  function cx(e, t) {
    if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
      var a = e.retryLane;
      e.retryLane = a !== 0 && a < t ? a : t;
    }
  }
  function kp(e, t) {
    cx(e, t), (e = e.alternate) && cx(e, t);
  }
  function Jb(e) {
    if (e.tag === 13 || e.tag === 31) {
      var t = Ir(e, 67108864);
      t !== null && Ht(t, e, 67108864), kp(e, 67108864);
    }
  }
  function fx(e) {
    if (e.tag === 13 || e.tag === 31) {
      var t = aa();
      t = Rd(t);
      var a = Ir(e, t);
      a !== null && Ht(a, e, t), kp(e, t);
    }
  }
  var vs = !0;
  function eC(e, t, a, n) {
    var r = ee.T;
    ee.T = null;
    var l = ve.p;
    try {
      ve.p = 2, wp(e, t, a, n);
    } finally {
      ve.p = l, ee.T = r;
    }
  }
  function tC(e, t, a, n) {
    var r = ee.T;
    ee.T = null;
    var l = ve.p;
    try {
      ve.p = 8, wp(e, t, a, n);
    } finally {
      ve.p = l, ee.T = r;
    }
  }
  function wp(e, t, a, n) {
    if (vs) {
      var r = Td(n);
      if (r === null) Ef(e, t, n, Ls, a), dx(e, n);else if (nC(r, e, t, a, n)) n.stopPropagation();else if (dx(e, n), t & 4 && -1 < aC.indexOf(e)) {
        for (; r !== null;) {
          var l = ql(r);
          if (l !== null) switch (l.tag) {
            case 3:
              if (l = l.stateNode, l.current.memoizedState.isDehydrated) {
                var o = cr(l.pendingLanes);
                if (o !== 0) {
                  var i = l;
                  for (i.pendingLanes |= 2, i.entangledLanes |= 2; o;) {
                    var u = 1 << 31 - ta(o);
                    i.entanglements[1] |= u, o &= ~u;
                  }
                  za(l), (be & 6) === 0 && (cs = $t() + 500, pi(0, !1));
                }
              }
              break;
            case 31:
            case 13:
              i = Ir(l, 2), i !== null && Ht(i, l, 2), Ns(), kp(l, 2);
          }
          if (l = Td(n), l === null && Ef(e, t, n, Ls, a), l === r) break;
          r = l;
        }
        r !== null && n.stopPropagation();
      } else Ef(e, t, n, null, a);
    }
  }
  function Td(e) {
    return e = Pd(e), Sp(e);
  }
  var Ls = null;
  function Sp(e) {
    if (Ls = null, e = cl(e), e !== null) {
      var t = ri(e);
      if (t === null) e = null;else {
        var a = t.tag;
        if (a === 13) {
          if (e = yx(t), e !== null) return e;
          e = null;
        } else if (a === 31) {
          if (e = bx(t), e !== null) return e;
          e = null;
        } else if (a === 3) {
          if (t.stateNode.current.memoizedState.isDehydrated) return t.tag === 3 ? t.stateNode.containerInfo : null;
          e = null;
        } else t !== e && (e = null);
      }
    }
    return Ls = e, null;
  }
  function $b(e) {
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
        switch (Gk()) {
          case wx:
            return 2;
          case Sx:
            return 8;
          case Ku:
          case Vk:
            return 32;
          case Cx:
            return 268435456;
          default:
            return 32;
        }
      default:
        return 32;
    }
  }
  var Md = !1,
    qn = null,
    Fn = null,
    Hn = null,
    ai = new Map(),
    ni = new Map(),
    An = [],
    aC = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");
  function dx(e, t) {
    switch (e) {
      case "focusin":
      case "focusout":
        qn = null;
        break;
      case "dragenter":
      case "dragleave":
        Fn = null;
        break;
      case "mouseover":
      case "mouseout":
        Hn = null;
        break;
      case "pointerover":
      case "pointerout":
        ai.delete(t.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        ni.delete(t.pointerId);
    }
  }
  function So(e, t, a, n, r, l) {
    return e === null || e.nativeEvent !== l ? (e = {
      blockedOn: t,
      domEventName: a,
      eventSystemFlags: n,
      nativeEvent: l,
      targetContainers: [r]
    }, t !== null && (t = ql(t), t !== null && Jb(t)), e) : (e.eventSystemFlags |= n, t = e.targetContainers, r !== null && t.indexOf(r) === -1 && t.push(r), e);
  }
  function nC(e, t, a, n, r) {
    switch (t) {
      case "focusin":
        return qn = So(qn, e, t, a, n, r), !0;
      case "dragenter":
        return Fn = So(Fn, e, t, a, n, r), !0;
      case "mouseover":
        return Hn = So(Hn, e, t, a, n, r), !0;
      case "pointerover":
        var l = r.pointerId;
        return ai.set(l, So(ai.get(l) || null, e, t, a, n, r)), !0;
      case "gotpointercapture":
        return l = r.pointerId, ni.set(l, So(ni.get(l) || null, e, t, a, n, r)), !0;
    }
    return !1;
  }
  function ev(e) {
    var t = cl(e.target);
    if (t !== null) {
      var a = ri(t);
      if (a !== null) {
        if (t = a.tag, t === 13) {
          if (t = yx(a), t !== null) {
            e.blockedOn = t, Zh(e.priority, function () {
              fx(a);
            });
            return;
          }
        } else if (t === 31) {
          if (t = bx(a), t !== null) {
            e.blockedOn = t, Zh(e.priority, function () {
              fx(a);
            });
            return;
          }
        } else if (t === 3 && a.stateNode.current.memoizedState.isDehydrated) {
          e.blockedOn = a.tag === 3 ? a.stateNode.containerInfo : null;
          return;
        }
      }
    }
    e.blockedOn = null;
  }
  function ju(e) {
    if (e.blockedOn !== null) return !1;
    for (var t = e.targetContainers; 0 < t.length;) {
      var a = Td(e.nativeEvent);
      if (a === null) {
        a = e.nativeEvent;
        var n = new a.constructor(a.type, a);
        Yf = n, a.target.dispatchEvent(n), Yf = null;
      } else return t = ql(a), t !== null && Jb(t), e.blockedOn = a, !1;
      t.shift();
    }
    return !0;
  }
  function px(e, t, a) {
    ju(e) && a.delete(t);
  }
  function rC() {
    Md = !1, qn !== null && ju(qn) && (qn = null), Fn !== null && ju(Fn) && (Fn = null), Hn !== null && ju(Hn) && (Hn = null), ai.forEach(px), ni.forEach(px);
  }
  function Du(e, t) {
    e.blockedOn === t && (e.blockedOn = null, Md || (Md = !0, dt.unstable_scheduleCallback(dt.unstable_NormalPriority, rC)));
  }
  var Bu = null;
  function mx(e) {
    Bu !== e && (Bu = e, dt.unstable_scheduleCallback(dt.unstable_NormalPriority, function () {
      Bu === e && (Bu = null);
      for (var t = 0; t < e.length; t += 3) {
        var a = e[t],
          n = e[t + 1],
          r = e[t + 2];
        if (typeof n != "function") {
          if (Sp(n || a) === null) continue;
          break;
        }
        var l = ql(a);
        l !== null && (e.splice(t, 3), t -= 3, sd(l, {
          pending: !0,
          data: r,
          method: a.method,
          action: n
        }, n, r));
      }
    }));
  }
  function Pl(e) {
    function t(u) {
      return Du(u, e);
    }
    qn !== null && Du(qn, e), Fn !== null && Du(Fn, e), Hn !== null && Du(Hn, e), ai.forEach(t), ni.forEach(t);
    for (var a = 0; a < An.length; a++) {
      var n = An[a];
      n.blockedOn === e && (n.blockedOn = null);
    }
    for (; 0 < An.length && (a = An[0], a.blockedOn === null);) ev(a), a.blockedOn === null && An.shift();
    if (a = (e.ownerDocument || e).$$reactFormReplay, a != null) for (n = 0; n < a.length; n += 3) {
      var r = a[n],
        l = a[n + 1],
        o = r[_t] || null;
      if (typeof l == "function") o || mx(a);else if (o) {
        var i = null;
        if (l && l.hasAttribute("formAction")) {
          if (r = l, o = l[_t] || null) i = o.formAction;else if (Sp(r) !== null) continue;
        } else i = o.action;
        typeof i == "function" ? a[n + 1] = i : (a.splice(n, 3), n -= 3), mx(a);
      }
    }
  }
  function tv() {
    function e(l) {
      l.canIntercept && l.info === "react-transition" && l.intercept({
        handler: function () {
          return new Promise(function (o) {
            return r = o;
          });
        },
        focusReset: "manual",
        scroll: "manual"
      });
    }
    function t() {
      r !== null && (r(), r = null), n || setTimeout(a, 20);
    }
    function a() {
      if (!n && !navigation.transition) {
        var l = navigation.currentEntry;
        l && l.url != null && navigation.navigate(l.url, {
          state: l.getState(),
          info: "react-transition",
          history: "replace"
        });
      }
    }
    if (typeof navigation == "object") {
      var n = !1,
        r = null;
      return navigation.addEventListener("navigate", e), navigation.addEventListener("navigatesuccess", t), navigation.addEventListener("navigateerror", t), setTimeout(a, 100), function () {
        n = !0, navigation.removeEventListener("navigate", e), navigation.removeEventListener("navigatesuccess", t), navigation.removeEventListener("navigateerror", t), r !== null && (r(), r = null);
      };
    }
  }
  function Cp(e) {
    this._internalRoot = e;
  }
  Ps.prototype.render = Cp.prototype.render = function (e) {
    var t = this._internalRoot;
    if (t === null) throw Error(B(409));
    var a = t.current,
      n = aa();
    Wb(a, n, e, t, null, null);
  };
  Ps.prototype.unmount = Cp.prototype.unmount = function () {
    var e = this._internalRoot;
    if (e !== null) {
      this._internalRoot = null;
      var t = e.containerInfo;
      Wb(e.current, 2, null, e, null, null), Ns(), t[Ul] = null;
    }
  };
  function Ps(e) {
    this._internalRoot = e;
  }
  Ps.prototype.unstable_scheduleHydration = function (e) {
    if (e) {
      var t = Dx();
      e = {
        blockedOn: null,
        target: e,
        priority: t
      };
      for (var a = 0; a < An.length && t !== 0 && t < An[a].priority; a++);
      An.splice(a, 0, e), a === 0 && ev(e);
    }
  };
  var hx = gx.version;
  if (hx !== "19.2.8") throw Error(B(527, hx, "19.2.8"));
  ve.findDOMNode = function (e) {
    var t = e._reactInternals;
    if (t === void 0) throw typeof e.render == "function" ? Error(B(188)) : (e = Object.keys(e).join(","), Error(B(268, e)));
    return e = Ok(t), e = e !== null ? vx(e) : null, e = e === null ? null : e.stateNode, e;
  };
  var lC = {
    bundleType: 0,
    version: "19.2.8",
    rendererPackageName: "react-dom",
    currentDispatcherRef: ee,
    reconcilerVersion: "19.2.8"
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && (Co = __REACT_DEVTOOLS_GLOBAL_HOOK__, !Co.isDisabled && Co.supportsFiber)) try {
    li = Co.inject(lC), ea = Co;
  } catch {}
  var Co;
  Us.createRoot = function (e, t) {
    if (!xx(e)) throw Error(B(299));
    var a = !1,
      n = "",
      r = jy,
      l = Yy,
      o = Qy;
    return t != null && (t.unstable_strictMode === !0 && (a = !0), t.identifierPrefix !== void 0 && (n = t.identifierPrefix), t.onUncaughtError !== void 0 && (r = t.onUncaughtError), t.onCaughtError !== void 0 && (l = t.onCaughtError), t.onRecoverableError !== void 0 && (o = t.onRecoverableError)), t = Zb(e, 1, !1, null, null, a, n, null, r, l, o, tv), e[Ul] = t.current, bp(e), new Cp(t);
  };
  Us.hydrateRoot = function (e, t, a) {
    if (!xx(e)) throw Error(B(299));
    var n = !1,
      r = "",
      l = jy,
      o = Yy,
      i = Qy,
      u = null;
    return a != null && (a.unstable_strictMode === !0 && (n = !0), a.identifierPrefix !== void 0 && (r = a.identifierPrefix), a.onUncaughtError !== void 0 && (l = a.onUncaughtError), a.onCaughtError !== void 0 && (o = a.onCaughtError), a.onRecoverableError !== void 0 && (i = a.onRecoverableError), a.formState !== void 0 && (u = a.formState)), t = Zb(e, 1, !0, t, a ?? null, n, r, u, l, o, i, tv), t.context = Kb(null), a = t.current, n = aa(), n = Rd(n), r = zn(n), r.callback = null, On(a, r, n), a = n, t.current.lanes = a, ii(t, a), za(t), e[Ul] = t.current, bp(e), new Ps(t);
  };
  Us.version = "19.2.8";
});
var lv = Bt((WD, rv) => {
  "use strict";

  function nv() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function")) try {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(nv);
    } catch (e) {
      console.error(e);
    }
  }
  nv(), rv.exports = av();
});
var Bv = Bt(_s => {
  "use strict";

  var KC = Symbol.for("react.transitional.element"),
    WC = Symbol.for("react.fragment");
  function Dv(e, t, a) {
    var n = null;
    if (a !== void 0 && (n = "" + a), t.key !== void 0 && (n = "" + t.key), "key" in t) {
      a = {};
      for (var r in t) r !== "key" && (a[r] = t[r]);
    } else a = t;
    return t = a.ref, {
      $$typeof: KC,
      type: e,
      key: n,
      ref: t !== void 0 ? t : null,
      props: a
    };
  }
  _s.Fragment = WC;
  _s.jsx = Dv;
  _s.jsxs = Dv;
});
var oe = Bt((uB, Ev) => {
  "use strict";

  Ev.exports = Bv();
});
// ──── Library: inline-style-parser, style-to-object, style-to-js, extend (CommonJS deps of react-markdown/unified) (bundled from npm; unchanged, names left minified) ────
var wL = Bt((KN, kL) => {
  "use strict";

  var yL = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//g,
    o2 = /\n/g,
    i2 = /^\s*/,
    u2 = /^(\*?[-#/*\\\w]+(\[[0-9a-z_-]+\])?)\s*/,
    s2 = /^:\s*/,
    c2 = /^((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^)]*?\)|[^};])+)/,
    f2 = /^[;\s]*/,
    d2 = /^\s+|\s+$/g,
    p2 = `
`,
    bL = "/",
    vL = "*",
    Ur = "",
    m2 = "comment",
    h2 = "declaration";
  function g2(e, t) {
    if (typeof e != "string") throw new TypeError("First argument must be a string");
    if (!e) return [];
    t = t || {};
    var a = 1,
      n = 1;
    function r(x) {
      var b = x.match(o2);
      b && (a += b.length);
      var C = x.lastIndexOf(p2);
      n = ~C ? x.length - C : n + x.length;
    }
    function l() {
      var x = {
        line: a,
        column: n
      };
      return function (b) {
        return b.position = new o(x), s(), b;
      };
    }
    function o(x) {
      this.start = x, this.end = {
        line: a,
        column: n
      }, this.source = t.source;
    }
    o.prototype.content = e;
    function i(x) {
      var b = new Error(t.source + ":" + a + ":" + n + ": " + x);
      if (b.reason = x, b.filename = t.source, b.line = a, b.column = n, b.source = e, !t.silent) throw b;
    }
    function u(x) {
      var b = x.exec(e);
      if (b) {
        var C = b[0];
        return r(C), e = e.slice(C.length), b;
      }
    }
    function s() {
      u(i2);
    }
    function c(x) {
      var b;
      for (x = x || []; b = f();) b !== !1 && x.push(b);
      return x;
    }
    function f() {
      var x = l();
      if (!(bL != e.charAt(0) || vL != e.charAt(1))) {
        for (var b = 2; Ur != e.charAt(b) && (vL != e.charAt(b) || bL != e.charAt(b + 1));) ++b;
        if (b += 2, Ur === e.charAt(b - 1)) return i("End of comment missing");
        var C = e.slice(2, b - 2);
        return n += 2, r(C), e = e.slice(b), n += 2, x({
          type: m2,
          comment: C
        });
      }
    }
    function d() {
      var x = l(),
        b = u(u2);
      if (b) {
        if (f(), !u(s2)) return i("property missing ':'");
        var C = u(c2),
          h = x({
            type: h2,
            property: LL(b[0].replace(yL, Ur)),
            value: C ? LL(C[0].replace(yL, Ur)) : Ur
          });
        return u(f2), h;
      }
    }
    function p() {
      var x = [];
      c(x);
      for (var b; b = d();) b !== !1 && (x.push(b), c(x));
      return x;
    }
    return s(), p();
  }
  function LL(e) {
    return e ? e.replace(d2, Ur) : Ur;
  }
  kL.exports = g2;
});
var SL = Bt(ji => {
  "use strict";

  var x2 = ji && ji.__importDefault || function (e) {
    return e && e.__esModule ? e : {
      default: e
    };
  };
  Object.defineProperty(ji, "__esModule", {
    value: !0
  });
  ji.default = b2;
  var y2 = x2(wL());
  function b2(e, t) {
    let a = null;
    if (!e || typeof e != "string") return a;
    let n = (0, y2.default)(e),
      r = typeof t == "function";
    return n.forEach(l => {
      if (l.type !== "declaration") return;
      let {
        property: o,
        value: i
      } = l;
      r ? t(o, i, l) : i && (a = a || {}, a[o] = i);
    }), a;
  }
});
var IL = Bt(ec => {
  "use strict";

  Object.defineProperty(ec, "__esModule", {
    value: !0
  });
  ec.camelCase = void 0;
  var v2 = /^--[a-zA-Z0-9_-]+$/,
    L2 = /-([a-z])/g,
    k2 = /^[^-]+$/,
    w2 = /^-(webkit|moz|ms|o|khtml)-/,
    S2 = /^-(ms)-/,
    C2 = function (e) {
      return !e || k2.test(e) || v2.test(e);
    },
    I2 = function (e, t) {
      return t.toUpperCase();
    },
    CL = function (e, t) {
      return "".concat(t, "-");
    },
    A2 = function (e, t) {
      return t === void 0 && (t = {}), C2(e) ? e : (e = e.toLowerCase(), t.reactCompat ? e = e.replace(S2, CL) : e = e.replace(w2, CL), e.replace(L2, I2));
    };
  ec.camelCase = A2;
});
var TL = Bt((Vp, AL) => {
  "use strict";

  var T2 = Vp && Vp.__importDefault || function (e) {
      return e && e.__esModule ? e : {
        default: e
      };
    },
    M2 = T2(SL()),
    D2 = IL();
  function Gp(e, t) {
    var a = {};
    return !e || typeof e != "string" || (0, M2.default)(e, function (n, r) {
      n && r && (a[(0, D2.camelCase)(n, t)] = r);
    }), a;
  }
  Gp.default = Gp;
  AL.exports = Gp;
});
var $0 = Bt((IP, J0) => {
  "use strict";

  var Sc = Object.prototype.hasOwnProperty,
    W0 = Object.prototype.toString,
    X0 = Object.defineProperty,
    j0 = Object.getOwnPropertyDescriptor,
    Y0 = function (t) {
      return typeof Array.isArray == "function" ? Array.isArray(t) : W0.call(t) === "[object Array]";
    },
    Q0 = function (t) {
      if (!t || W0.call(t) !== "[object Object]") return !1;
      var a = Sc.call(t, "constructor"),
        n = t.constructor && t.constructor.prototype && Sc.call(t.constructor.prototype, "isPrototypeOf");
      if (t.constructor && !a && !n) return !1;
      var r;
      for (r in t);
      return typeof r > "u" || Sc.call(t, r);
    },
    Z0 = function (t, a) {
      X0 && a.name === "__proto__" ? X0(t, a.name, {
        enumerable: !0,
        configurable: !0,
        value: a.newValue,
        writable: !0
      }) : t[a.name] = a.newValue;
    },
    K0 = function (t, a) {
      if (a === "__proto__") if (Sc.call(t, a)) {
        if (j0) return j0(t, a).value;
      } else return;
      return t[a];
    };
  J0.exports = function e() {
    var t,
      a,
      n,
      r,
      l,
      o,
      i = arguments[0],
      u = 1,
      s = arguments.length,
      c = !1;
    for (typeof i == "boolean" && (c = i, i = arguments[1] || {}, u = 2), (i == null || typeof i != "object" && typeof i != "function") && (i = {}); u < s; ++u) if (t = arguments[u], t != null) for (a in t) n = K0(i, a), r = K0(t, a), i !== r && (c && r && (Q0(r) || (l = Y0(r))) ? (l ? (l = !1, o = n && Y0(n) ? n : []) : o = n && Q0(n) ? n : {}, Z0(i, {
      name: a,
      newValue: e(c, o, r)
    })) : typeof r < "u" && Z0(i, {
      name: a,
      newValue: r
    }));
    return i;
  };
});
// ReactDOMClient (minified: ik) — ──── Library: clsx, class-variance-authority, tailwind-merge (incl. twMerge = createTailwindMerge(getDefaultConfig)) (bundled from npm; unchanged, names left minified) ────
var ReactDOMClient = G(lv());
var ReactForApp = G(_e());
var reactForLogin = G(_e());
var reactForButton = G(_e());
function ov(e) {
  var t,
    a,
    n = "";
  if (typeof e == "string" || typeof e == "number") n += e;else if (typeof e == "object") if (Array.isArray(e)) {
    var r = e.length;
    for (t = 0; t < r; t++) e[t] && (a = ov(e[t])) && (n && (n += " "), n += a);
  } else for (a in e) e[a] && (n && (n += " "), n += a);
  return n;
}
function qs() {
  for (var e, t, a = 0, n = "", r = arguments.length; a < r; a++) (e = arguments[a]) && (t = ov(e)) && (n && (n += " "), n += t);
  return n;
}
var iv = e => typeof e == "boolean" ? `${e}` : e === 0 ? "0" : e,
  uv = qs,
  sv = (e, t) => a => {
    var n;
    if (t?.variants == null) return uv(e, a?.class, a?.className);
    let {
        variants: r,
        defaultVariants: l
      } = t,
      o = Object.keys(r).map(s => {
        let c = a?.[s],
          f = l?.[s];
        if (c === null) return null;
        let d = iv(c) || iv(f);
        return r[s][d];
      }),
      i = a && Object.entries(a).reduce((s, c) => {
        let [f, d] = c;
        return d === void 0 || (s[f] = d), s;
      }, {}),
      u = t == null || (n = t.compoundVariants) === null || n === void 0 ? void 0 : n.reduce((s, c) => {
        let {
          class: f,
          className: d,
          ...p
        } = c;
        return Object.entries(p).every(x => {
          let [b, C] = x;
          return Array.isArray(C) ? C.includes({
            ...l,
            ...i
          }[b]) : {
            ...l,
            ...i
          }[b] === C;
        }) ? [...s, f, d] : s;
      }, []);
    return uv(e, o, u, a?.class, a?.className);
  };
var oC = (e, t) => {
    let a = new Array(e.length + t.length);
    for (let n = 0; n < e.length; n++) a[n] = e[n];
    for (let n = 0; n < t.length; n++) a[e.length + n] = t[n];
    return a;
  },
  iC = (e, t) => ({
    classGroupId: e,
    validator: t
  }),
  hv = (e = new Map(), t = null, a) => ({
    nextPart: e,
    validators: t,
    classGroupId: a
  });
var cv = [],
  uC = "arbitrary..",
  sC = e => {
    let t = fC(e),
      {
        conflictingClassGroups: a,
        conflictingClassGroupModifiers: n
      } = e;
    return {
      getClassGroupId: o => {
        if (o.startsWith("[") && o.endsWith("]")) return cC(o);
        let i = o.split("-"),
          u = i[0] === "" && i.length > 1 ? 1 : 0;
        return gv(i, u, t);
      },
      getConflictingClassGroupIds: (o, i) => {
        if (i) {
          let u = n[o],
            s = a[o];
          return u ? s ? oC(s, u) : u : s || cv;
        }
        return a[o] || cv;
      }
    };
  },
  gv = (e, t, a) => {
    if (e.length - t === 0) return a.classGroupId;
    let r = e[t],
      l = a.nextPart.get(r);
    if (l) {
      let s = gv(e, t + 1, l);
      if (s) return s;
    }
    let o = a.validators;
    if (o === null) return;
    let i = t === 0 ? e.join("-") : e.slice(t).join("-"),
      u = o.length;
    for (let s = 0; s < u; s++) {
      let c = o[s];
      if (c.validator(i)) return c.classGroupId;
    }
  },
  cC = e => e.slice(1, -1).indexOf(":") === -1 ? void 0 : (() => {
    let t = e.slice(1, -1),
      a = t.indexOf(":"),
      n = t.slice(0, a);
    return n ? uC + n : void 0;
  })(),
  fC = e => {
    let {
      theme: t,
      classGroups: a
    } = e;
    return dC(a, t);
  },
  dC = (e, t) => {
    let a = hv();
    for (let n in e) {
      let r = e[n];
      Ap(r, a, n, t);
    }
    return a;
  },
  Ap = (e, t, a, n) => {
    let r = e.length;
    for (let l = 0; l < r; l++) {
      let o = e[l];
      pC(o, t, a, n);
    }
  },
  pC = (e, t, a, n) => {
    if (typeof e == "string") {
      mC(e, t, a);
      return;
    }
    if (typeof e == "function") {
      hC(e, t, a, n);
      return;
    }
    gC(e, t, a, n);
  },
  mC = (e, t, a) => {
    let n = e === "" ? t : xv(t, e);
    n.classGroupId = a;
  },
  hC = (e, t, a, n) => {
    if (xC(e)) {
      Ap(e(n), t, a, n);
      return;
    }
    t.validators === null && (t.validators = []), t.validators.push(iC(a, e));
  },
  gC = (e, t, a, n) => {
    let r = Object.entries(e),
      l = r.length;
    for (let o = 0; o < l; o++) {
      let [i, u] = r[o];
      Ap(u, xv(t, i), a, n);
    }
  },
  xv = (e, t) => {
    let a = e,
      n = t.split("-"),
      r = n.length;
    for (let l = 0; l < r; l++) {
      let o = n[l],
        i = a.nextPart.get(o);
      i || (i = hv(), a.nextPart.set(o, i)), a = i;
    }
    return a;
  },
  xC = e => "isThemeGetter" in e && e.isThemeGetter === !0,
  yC = e => {
    if (e < 1) return {
      get: () => {},
      set: () => {}
    };
    let t = 0,
      a = Object.create(null),
      n = Object.create(null),
      r = (l, o) => {
        a[l] = o, t++, t > e && (t = 0, n = a, a = Object.create(null));
      };
    return {
      get(l) {
        let o = a[l];
        if (o !== void 0) return o;
        if ((o = n[l]) !== void 0) return r(l, o), o;
      },
      set(l, o) {
        l in a ? a[l] = o : r(l, o);
      }
    };
  };
var bC = [],
  fv = (e, t, a, n, r) => ({
    modifiers: e,
    hasImportantModifier: t,
    baseClassName: a,
    maybePostfixModifierPosition: n,
    isExternal: r
  }),
  vC = e => {
    let {
        prefix: t,
        experimentalParseClassName: a
      } = e,
      n = r => {
        let l = [],
          o = 0,
          i = 0,
          u = 0,
          s,
          c = r.length;
        for (let b = 0; b < c; b++) {
          let C = r[b];
          if (o === 0 && i === 0) {
            if (C === ":") {
              l.push(r.slice(u, b)), u = b + 1;
              continue;
            }
            if (C === "/") {
              s = b;
              continue;
            }
          }
          C === "[" ? o++ : C === "]" ? o-- : C === "(" ? i++ : C === ")" && i--;
        }
        let f = l.length === 0 ? r : r.slice(u),
          d = f,
          p = !1;
        f.endsWith("!") ? (d = f.slice(0, -1), p = !0) : f.startsWith("!") && (d = f.slice(1), p = !0);
        let x = s && s > u ? s - u : void 0;
        return fv(l, p, d, x);
      };
    if (t) {
      let r = t + ":",
        l = n;
      n = o => o.startsWith(r) ? l(o.slice(r.length)) : fv(bC, !1, o, void 0, !0);
    }
    if (a) {
      let r = n;
      n = l => a({
        className: l,
        parseClassName: r
      });
    }
    return n;
  },
  LC = e => {
    let t = new Map();
    return e.orderSensitiveModifiers.forEach((a, n) => {
      t.set(a, 1e6 + n);
    }), a => {
      let n = [],
        r = [];
      for (let l = 0; l < a.length; l++) {
        let o = a[l],
          i = o[0] === "[",
          u = t.has(o);
        i || u ? (r.length > 0 && (r.sort(), n.push(...r), r = []), n.push(o)) : r.push(o);
      }
      return r.length > 0 && (r.sort(), n.push(...r)), n;
    };
  },
  kC = e => ({
    cache: yC(e.cacheSize),
    parseClassName: vC(e),
    sortModifiers: LC(e),
    postfixLookupClassGroupIds: wC(e),
    ...sC(e)
  }),
  wC = e => {
    let t = Object.create(null),
      a = e.postfixLookupClassGroups;
    if (a) for (let n = 0; n < a.length; n++) t[a[n]] = !0;
    return t;
  },
  SC = /\s+/,
  CC = (e, t) => {
    let {
        parseClassName: a,
        getClassGroupId: n,
        getConflictingClassGroupIds: r,
        sortModifiers: l,
        postfixLookupClassGroupIds: o
      } = t,
      i = [],
      u = e.trim().split(SC),
      s = "";
    for (let c = u.length - 1; c >= 0; c -= 1) {
      let f = u[c],
        {
          isExternal: d,
          modifiers: p,
          hasImportantModifier: x,
          baseClassName: b,
          maybePostfixModifierPosition: C
        } = a(f);
      if (d) {
        s = f + (s.length > 0 ? " " + s : s);
        continue;
      }
      let h = !!C,
        m;
      if (h) {
        let S = b.substring(0, C);
        m = n(S);
        let A = m && o[m] ? n(b) : void 0;
        A && A !== m && (m = A, h = !1);
      } else m = n(b);
      if (!m) {
        if (!h) {
          s = f + (s.length > 0 ? " " + s : s);
          continue;
        }
        if (m = n(b), !m) {
          s = f + (s.length > 0 ? " " + s : s);
          continue;
        }
        h = !1;
      }
      let g = p.length === 0 ? "" : p.length === 1 ? p[0] : l(p).join(":"),
        L = x ? g + "!" : g,
        I = L + m;
      if (i.indexOf(I) > -1) continue;
      i.push(I);
      let k = r(m, h);
      for (let S = 0; S < k.length; ++S) {
        let A = k[S];
        i.push(L + A);
      }
      s = f + (s.length > 0 ? " " + s : s);
    }
    return s;
  },
  IC = (...e) => {
    let t = 0,
      a,
      n,
      r = "";
    for (; t < e.length;) (a = e[t++]) && (n = yv(a)) && (r && (r += " "), r += n);
    return r;
  },
  yv = e => {
    if (typeof e == "string") return e;
    let t,
      a = "";
    for (let n = 0; n < e.length; n++) e[n] && (t = yv(e[n])) && (a && (a += " "), a += t);
    return a;
  },
  AC = (e, ...t) => {
    let a,
      n,
      r,
      l,
      o = u => {
        let s = t.reduce((c, f) => f(c), e());
        return a = kC(s), n = a.cache.get, r = a.cache.set, l = i, i(u);
      },
      i = u => {
        let s = n(u);
        if (s) return s;
        let c = CC(u, a);
        return r(u, c), c;
      };
    return l = o, (...u) => l(IC(...u));
  },
  TC = [],
  pt = e => {
    let t = a => a[e] || TC;
    return t.isThemeGetter = !0, t;
  },
  bv = /^\[(?:(\w[\w-]*):)?(.+)\]$/i,
  vv = /^\((?:(\w[\w-]*):)?(.+)\)$/i,
  MC = /^\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/,
  DC = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/,
  BC = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/,
  EC = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/,
  RC = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/,
  NC = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/,
  Qn = e => MC.test(e),
  ue = e => !!e && !Number.isNaN(Number(e)),
  Oa = e => !!e && Number.isInteger(Number(e)),
  Ip = e => e.endsWith("%") && ue(e.slice(0, -1)),
  cn = e => DC.test(e),
  Lv = () => !0,
  zC = e => BC.test(e) && !EC.test(e),
  Tp = () => !1,
  OC = e => RC.test(e),
  PC = e => NC.test(e),
  UC = e => !F(e) && !H(e),
  qC = e => e.startsWith("@container") && (e[10] === "/" && e[11] !== void 0 || e[11] === "s" && e[16] !== void 0 && e.startsWith("-size/", 10) || e[11] === "n" && e[18] !== void 0 && e.startsWith("-normal/", 10)),
  FC = e => Zn(e, Sv, Tp),
  F = e => bv.test(e),
  Tr = e => Zn(e, Cv, zC),
  dv = e => Zn(e, QC, ue),
  HC = e => Zn(e, Av, Lv),
  _C = e => Zn(e, Iv, Tp),
  pv = e => Zn(e, kv, Tp),
  GC = e => Zn(e, wv, PC),
  Fs = e => Zn(e, Tv, OC),
  H = e => vv.test(e),
  gi = e => Mr(e, Cv),
  VC = e => Mr(e, Iv),
  mv = e => Mr(e, kv),
  XC = e => Mr(e, Sv),
  jC = e => Mr(e, wv),
  Hs = e => Mr(e, Tv, !0),
  YC = e => Mr(e, Av, !0),
  Zn = (e, t, a) => {
    let n = bv.exec(e);
    return n ? n[1] ? t(n[1]) : a(n[2]) : !1;
  },
  Mr = (e, t, a = !1) => {
    let n = vv.exec(e);
    return n ? n[1] ? t(n[1]) : a : !1;
  },
  kv = e => e === "position" || e === "percentage",
  wv = e => e === "image" || e === "url",
  Sv = e => e === "length" || e === "size" || e === "bg-size",
  Cv = e => e === "length",
  QC = e => e === "number",
  Iv = e => e === "family-name",
  Av = e => e === "number" || e === "weight",
  Tv = e => e === "shadow";
var ZC = () => {
  let e = pt("color"),
    t = pt("font"),
    a = pt("text"),
    n = pt("font-weight"),
    r = pt("tracking"),
    l = pt("leading"),
    o = pt("breakpoint"),
    i = pt("container"),
    u = pt("spacing"),
    s = pt("radius"),
    c = pt("shadow"),
    f = pt("inset-shadow"),
    d = pt("text-shadow"),
    p = pt("drop-shadow"),
    x = pt("blur"),
    b = pt("perspective"),
    C = pt("aspect"),
    h = pt("ease"),
    m = pt("animate"),
    g = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"],
    L = () => ["center", "top", "bottom", "left", "right", "top-left", "left-top", "top-right", "right-top", "bottom-right", "right-bottom", "bottom-left", "left-bottom"],
    I = () => [...L(), H, F],
    k = () => ["auto", "hidden", "clip", "visible", "scroll"],
    S = () => ["auto", "contain", "none"],
    A = () => [H, F, u],
    R = () => [Qn, "full", "auto", ...A()],
    w = () => [Oa, "none", "subgrid", H, F],
    N = () => ["auto", {
      span: ["full", Oa, H, F]
    }, Oa, H, F],
    $ = () => [Oa, "auto", H, F],
    q = () => ["auto", "min", "max", "fr", H, F],
    K = () => ["start", "end", "center", "between", "around", "evenly", "stretch", "baseline", "center-safe", "end-safe"],
    J = () => ["start", "end", "center", "stretch", "center-safe", "end-safe"],
    se = () => ["auto", ...A()],
    ye = () => [Qn, "auto", "full", "dvw", "dvh", "lvw", "lvh", "svw", "svh", "min", "max", "fit", ...A()],
    st = () => [Qn, "screen", "full", "dvw", "lvw", "svw", "min", "max", "fit", ...A()],
    Y = () => [Qn, "screen", "full", "lh", "dvh", "lvh", "svh", "min", "max", "fit", ...A()],
    y = () => [e, H, F],
    ie = () => [...L(), mv, pv, {
      position: [H, F]
    }],
    Re = () => ["no-repeat", {
      repeat: ["", "x", "y", "space", "round"]
    }],
    v = () => ["auto", "cover", "contain", XC, FC, {
      size: [H, F]
    }],
    ct = () => [Ip, gi, Tr],
    ze = () => ["", "none", "full", s, H, F],
    $e = () => ["", ue, gi, Tr],
    va = () => ["solid", "dashed", "dotted", "double"],
    De = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"],
    Ie = () => [ue, Ip, mv, pv],
    vt = () => ["", "none", x, H, F],
    Ot = () => ["none", ue, H, F],
    Yt = () => ["none", ue, H, F],
    Ta = () => [ue, H, F],
    bn = () => [Qn, "full", ...A()];
  return {
    cacheSize: 500,
    theme: {
      animate: ["spin", "ping", "pulse", "bounce"],
      aspect: ["video"],
      blur: [cn],
      breakpoint: [cn],
      color: [Lv],
      container: [cn],
      "drop-shadow": [cn],
      ease: ["in", "out", "in-out"],
      font: [UC],
      "font-weight": ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black"],
      "inset-shadow": [cn],
      leading: ["none", "tight", "snug", "normal", "relaxed", "loose"],
      perspective: ["dramatic", "near", "normal", "midrange", "distant", "none"],
      radius: [cn],
      shadow: [cn],
      spacing: ["px", ue],
      text: [cn],
      "text-shadow": [cn],
      tracking: ["tighter", "tight", "normal", "wide", "wider", "widest"]
    },
    classGroups: {
      aspect: [{
        aspect: ["auto", "square", Qn, F, H, C]
      }],
      container: ["container"],
      "container-type": [{
        "@container": ["", "normal", "size", H, F]
      }],
      "container-named": [qC],
      columns: [{
        columns: [ue, F, H, i]
      }],
      "break-after": [{
        "break-after": g()
      }],
      "break-before": [{
        "break-before": g()
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
        object: I()
      }],
      overflow: [{
        overflow: k()
      }],
      "overflow-x": [{
        "overflow-x": k()
      }],
      "overflow-y": [{
        "overflow-y": k()
      }],
      overscroll: [{
        overscroll: S()
      }],
      "overscroll-x": [{
        "overscroll-x": S()
      }],
      "overscroll-y": [{
        "overscroll-y": S()
      }],
      position: ["static", "fixed", "absolute", "relative", "sticky"],
      inset: [{
        inset: R()
      }],
      "inset-x": [{
        "inset-x": R()
      }],
      "inset-y": [{
        "inset-y": R()
      }],
      start: [{
        "inset-s": R(),
        start: R()
      }],
      end: [{
        "inset-e": R(),
        end: R()
      }],
      "inset-bs": [{
        "inset-bs": R()
      }],
      "inset-be": [{
        "inset-be": R()
      }],
      top: [{
        top: R()
      }],
      right: [{
        right: R()
      }],
      bottom: [{
        bottom: R()
      }],
      left: [{
        left: R()
      }],
      visibility: ["visible", "invisible", "collapse"],
      z: [{
        z: [Oa, "auto", H, F]
      }],
      basis: [{
        basis: [Qn, "full", "auto", i, ...A()]
      }],
      "flex-direction": [{
        flex: ["row", "row-reverse", "col", "col-reverse"]
      }],
      "flex-wrap": [{
        flex: ["nowrap", "wrap", "wrap-reverse"]
      }],
      flex: [{
        flex: [ue, Qn, "auto", "initial", "none", F]
      }],
      grow: [{
        grow: ["", ue, H, F]
      }],
      shrink: [{
        shrink: ["", ue, H, F]
      }],
      order: [{
        order: [Oa, "first", "last", "none", H, F]
      }],
      "grid-cols": [{
        "grid-cols": w()
      }],
      "col-start-end": [{
        col: N()
      }],
      "col-start": [{
        "col-start": $()
      }],
      "col-end": [{
        "col-end": $()
      }],
      "grid-rows": [{
        "grid-rows": w()
      }],
      "row-start-end": [{
        row: N()
      }],
      "row-start": [{
        "row-start": $()
      }],
      "row-end": [{
        "row-end": $()
      }],
      "grid-flow": [{
        "grid-flow": ["row", "col", "dense", "row-dense", "col-dense"]
      }],
      "auto-cols": [{
        "auto-cols": q()
      }],
      "auto-rows": [{
        "auto-rows": q()
      }],
      gap: [{
        gap: A()
      }],
      "gap-x": [{
        "gap-x": A()
      }],
      "gap-y": [{
        "gap-y": A()
      }],
      "justify-content": [{
        justify: [...K(), "normal"]
      }],
      "justify-items": [{
        "justify-items": [...J(), "normal"]
      }],
      "justify-self": [{
        "justify-self": ["auto", ...J()]
      }],
      "align-content": [{
        content: ["normal", ...K()]
      }],
      "align-items": [{
        items: [...J(), {
          baseline: ["", "last"]
        }]
      }],
      "align-self": [{
        self: ["auto", ...J(), {
          baseline: ["", "last"]
        }]
      }],
      "place-content": [{
        "place-content": K()
      }],
      "place-items": [{
        "place-items": [...J(), "baseline"]
      }],
      "place-self": [{
        "place-self": ["auto", ...J()]
      }],
      p: [{
        p: A()
      }],
      px: [{
        px: A()
      }],
      py: [{
        py: A()
      }],
      ps: [{
        ps: A()
      }],
      pe: [{
        pe: A()
      }],
      pbs: [{
        pbs: A()
      }],
      pbe: [{
        pbe: A()
      }],
      pt: [{
        pt: A()
      }],
      pr: [{
        pr: A()
      }],
      pb: [{
        pb: A()
      }],
      pl: [{
        pl: A()
      }],
      m: [{
        m: se()
      }],
      mx: [{
        mx: se()
      }],
      my: [{
        my: se()
      }],
      ms: [{
        ms: se()
      }],
      me: [{
        me: se()
      }],
      mbs: [{
        mbs: se()
      }],
      mbe: [{
        mbe: se()
      }],
      mt: [{
        mt: se()
      }],
      mr: [{
        mr: se()
      }],
      mb: [{
        mb: se()
      }],
      ml: [{
        ml: se()
      }],
      "space-x": [{
        "space-x": A()
      }],
      "space-x-reverse": ["space-x-reverse"],
      "space-y": [{
        "space-y": A()
      }],
      "space-y-reverse": ["space-y-reverse"],
      size: [{
        size: ye()
      }],
      "inline-size": [{
        inline: ["auto", ...st()]
      }],
      "min-inline-size": [{
        "min-inline": ["auto", ...st()]
      }],
      "max-inline-size": [{
        "max-inline": ["none", ...st()]
      }],
      "block-size": [{
        block: ["auto", ...Y()]
      }],
      "min-block-size": [{
        "min-block": ["auto", ...Y()]
      }],
      "max-block-size": [{
        "max-block": ["none", ...Y()]
      }],
      w: [{
        w: [i, "screen", ...ye()]
      }],
      "min-w": [{
        "min-w": [i, "screen", "none", ...ye()]
      }],
      "max-w": [{
        "max-w": [i, "screen", "none", "prose", {
          screen: [o]
        }, ...ye()]
      }],
      h: [{
        h: ["screen", "lh", ...ye()]
      }],
      "min-h": [{
        "min-h": ["screen", "lh", "none", ...ye()]
      }],
      "max-h": [{
        "max-h": ["screen", "lh", ...ye()]
      }],
      "font-size": [{
        text: ["base", a, gi, Tr]
      }],
      "font-smoothing": ["antialiased", "subpixel-antialiased"],
      "font-style": ["italic", "not-italic"],
      "font-weight": [{
        font: [n, YC, HC]
      }],
      "font-stretch": [{
        "font-stretch": ["ultra-condensed", "extra-condensed", "condensed", "semi-condensed", "normal", "semi-expanded", "expanded", "extra-expanded", "ultra-expanded", Ip, F]
      }],
      "font-family": [{
        font: [VC, _C, t]
      }],
      "font-features": [{
        "font-features": [F]
      }],
      "fvn-normal": ["normal-nums"],
      "fvn-ordinal": ["ordinal"],
      "fvn-slashed-zero": ["slashed-zero"],
      "fvn-figure": ["lining-nums", "oldstyle-nums"],
      "fvn-spacing": ["proportional-nums", "tabular-nums"],
      "fvn-fraction": ["diagonal-fractions", "stacked-fractions"],
      tracking: [{
        tracking: [r, H, F]
      }],
      "line-clamp": [{
        "line-clamp": [ue, "none", H, dv]
      }],
      leading: [{
        leading: [l, ...A()]
      }],
      "list-image": [{
        "list-image": ["none", H, F]
      }],
      "list-style-position": [{
        list: ["inside", "outside"]
      }],
      "list-style-type": [{
        list: ["disc", "decimal", "none", H, F]
      }],
      "text-alignment": [{
        text: ["left", "center", "right", "justify", "start", "end"]
      }],
      "placeholder-color": [{
        placeholder: y()
      }],
      "text-color": [{
        text: y()
      }],
      "text-decoration": ["underline", "overline", "line-through", "no-underline"],
      "text-decoration-style": [{
        decoration: [...va(), "wavy"]
      }],
      "text-decoration-thickness": [{
        decoration: [ue, "from-font", "auto", H, Tr]
      }],
      "text-decoration-color": [{
        decoration: y()
      }],
      "underline-offset": [{
        "underline-offset": [ue, "auto", H, F]
      }],
      "text-transform": ["uppercase", "lowercase", "capitalize", "normal-case"],
      "text-overflow": ["truncate", "text-ellipsis", "text-clip"],
      "text-wrap": [{
        text: ["wrap", "nowrap", "balance", "pretty"]
      }],
      indent: [{
        indent: A()
      }],
      "tab-size": [{
        tab: [Oa, H, F]
      }],
      "vertical-align": [{
        align: ["baseline", "top", "middle", "bottom", "text-top", "text-bottom", "sub", "super", H, F]
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
        content: ["none", H, F]
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
        bg: ie()
      }],
      "bg-repeat": [{
        bg: Re()
      }],
      "bg-size": [{
        bg: v()
      }],
      "bg-image": [{
        bg: ["none", {
          linear: [{
            to: ["t", "tr", "r", "br", "b", "bl", "l", "tl"]
          }, Oa, H, F],
          radial: ["", H, F],
          conic: [Oa, H, F]
        }, jC, GC]
      }],
      "bg-color": [{
        bg: y()
      }],
      "gradient-from-pos": [{
        from: ct()
      }],
      "gradient-via-pos": [{
        via: ct()
      }],
      "gradient-to-pos": [{
        to: ct()
      }],
      "gradient-from": [{
        from: y()
      }],
      "gradient-via": [{
        via: y()
      }],
      "gradient-to": [{
        to: y()
      }],
      rounded: [{
        rounded: ze()
      }],
      "rounded-s": [{
        "rounded-s": ze()
      }],
      "rounded-e": [{
        "rounded-e": ze()
      }],
      "rounded-t": [{
        "rounded-t": ze()
      }],
      "rounded-r": [{
        "rounded-r": ze()
      }],
      "rounded-b": [{
        "rounded-b": ze()
      }],
      "rounded-l": [{
        "rounded-l": ze()
      }],
      "rounded-ss": [{
        "rounded-ss": ze()
      }],
      "rounded-se": [{
        "rounded-se": ze()
      }],
      "rounded-ee": [{
        "rounded-ee": ze()
      }],
      "rounded-es": [{
        "rounded-es": ze()
      }],
      "rounded-tl": [{
        "rounded-tl": ze()
      }],
      "rounded-tr": [{
        "rounded-tr": ze()
      }],
      "rounded-br": [{
        "rounded-br": ze()
      }],
      "rounded-bl": [{
        "rounded-bl": ze()
      }],
      "border-w": [{
        border: $e()
      }],
      "border-w-x": [{
        "border-x": $e()
      }],
      "border-w-y": [{
        "border-y": $e()
      }],
      "border-w-s": [{
        "border-s": $e()
      }],
      "border-w-e": [{
        "border-e": $e()
      }],
      "border-w-bs": [{
        "border-bs": $e()
      }],
      "border-w-be": [{
        "border-be": $e()
      }],
      "border-w-t": [{
        "border-t": $e()
      }],
      "border-w-r": [{
        "border-r": $e()
      }],
      "border-w-b": [{
        "border-b": $e()
      }],
      "border-w-l": [{
        "border-l": $e()
      }],
      "divide-x": [{
        "divide-x": $e()
      }],
      "divide-x-reverse": ["divide-x-reverse"],
      "divide-y": [{
        "divide-y": $e()
      }],
      "divide-y-reverse": ["divide-y-reverse"],
      "border-style": [{
        border: [...va(), "hidden", "none"]
      }],
      "divide-style": [{
        divide: [...va(), "hidden", "none"]
      }],
      "border-color": [{
        border: y()
      }],
      "border-color-x": [{
        "border-x": y()
      }],
      "border-color-y": [{
        "border-y": y()
      }],
      "border-color-s": [{
        "border-s": y()
      }],
      "border-color-e": [{
        "border-e": y()
      }],
      "border-color-bs": [{
        "border-bs": y()
      }],
      "border-color-be": [{
        "border-be": y()
      }],
      "border-color-t": [{
        "border-t": y()
      }],
      "border-color-r": [{
        "border-r": y()
      }],
      "border-color-b": [{
        "border-b": y()
      }],
      "border-color-l": [{
        "border-l": y()
      }],
      "divide-color": [{
        divide: y()
      }],
      "outline-style": [{
        outline: [...va(), "none", "hidden"]
      }],
      "outline-offset": [{
        "outline-offset": [ue, H, F]
      }],
      "outline-w": [{
        outline: ["", ue, gi, Tr]
      }],
      "outline-color": [{
        outline: y()
      }],
      shadow: [{
        shadow: ["", "none", c, Hs, Fs]
      }],
      "shadow-color": [{
        shadow: y()
      }],
      "inset-shadow": [{
        "inset-shadow": ["none", f, Hs, Fs]
      }],
      "inset-shadow-color": [{
        "inset-shadow": y()
      }],
      "ring-w": [{
        ring: $e()
      }],
      "ring-w-inset": ["ring-inset"],
      "ring-color": [{
        ring: y()
      }],
      "ring-offset-w": [{
        "ring-offset": [ue, Tr]
      }],
      "ring-offset-color": [{
        "ring-offset": y()
      }],
      "inset-ring-w": [{
        "inset-ring": $e()
      }],
      "inset-ring-color": [{
        "inset-ring": y()
      }],
      "text-shadow": [{
        "text-shadow": ["none", d, Hs, Fs]
      }],
      "text-shadow-color": [{
        "text-shadow": y()
      }],
      opacity: [{
        opacity: [ue, H, F]
      }],
      "mix-blend": [{
        "mix-blend": [...De(), "plus-darker", "plus-lighter"]
      }],
      "bg-blend": [{
        "bg-blend": De()
      }],
      "mask-clip": [{
        "mask-clip": ["border", "padding", "content", "fill", "stroke", "view"]
      }, "mask-no-clip"],
      "mask-composite": [{
        mask: ["add", "subtract", "intersect", "exclude"]
      }],
      "mask-image-linear-pos": [{
        "mask-linear": [ue]
      }],
      "mask-image-linear-from-pos": [{
        "mask-linear-from": Ie()
      }],
      "mask-image-linear-to-pos": [{
        "mask-linear-to": Ie()
      }],
      "mask-image-linear-from-color": [{
        "mask-linear-from": y()
      }],
      "mask-image-linear-to-color": [{
        "mask-linear-to": y()
      }],
      "mask-image-t-from-pos": [{
        "mask-t-from": Ie()
      }],
      "mask-image-t-to-pos": [{
        "mask-t-to": Ie()
      }],
      "mask-image-t-from-color": [{
        "mask-t-from": y()
      }],
      "mask-image-t-to-color": [{
        "mask-t-to": y()
      }],
      "mask-image-r-from-pos": [{
        "mask-r-from": Ie()
      }],
      "mask-image-r-to-pos": [{
        "mask-r-to": Ie()
      }],
      "mask-image-r-from-color": [{
        "mask-r-from": y()
      }],
      "mask-image-r-to-color": [{
        "mask-r-to": y()
      }],
      "mask-image-b-from-pos": [{
        "mask-b-from": Ie()
      }],
      "mask-image-b-to-pos": [{
        "mask-b-to": Ie()
      }],
      "mask-image-b-from-color": [{
        "mask-b-from": y()
      }],
      "mask-image-b-to-color": [{
        "mask-b-to": y()
      }],
      "mask-image-l-from-pos": [{
        "mask-l-from": Ie()
      }],
      "mask-image-l-to-pos": [{
        "mask-l-to": Ie()
      }],
      "mask-image-l-from-color": [{
        "mask-l-from": y()
      }],
      "mask-image-l-to-color": [{
        "mask-l-to": y()
      }],
      "mask-image-x-from-pos": [{
        "mask-x-from": Ie()
      }],
      "mask-image-x-to-pos": [{
        "mask-x-to": Ie()
      }],
      "mask-image-x-from-color": [{
        "mask-x-from": y()
      }],
      "mask-image-x-to-color": [{
        "mask-x-to": y()
      }],
      "mask-image-y-from-pos": [{
        "mask-y-from": Ie()
      }],
      "mask-image-y-to-pos": [{
        "mask-y-to": Ie()
      }],
      "mask-image-y-from-color": [{
        "mask-y-from": y()
      }],
      "mask-image-y-to-color": [{
        "mask-y-to": y()
      }],
      "mask-image-radial": [{
        "mask-radial": [H, F]
      }],
      "mask-image-radial-from-pos": [{
        "mask-radial-from": Ie()
      }],
      "mask-image-radial-to-pos": [{
        "mask-radial-to": Ie()
      }],
      "mask-image-radial-from-color": [{
        "mask-radial-from": y()
      }],
      "mask-image-radial-to-color": [{
        "mask-radial-to": y()
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
        "mask-radial-at": L()
      }],
      "mask-image-conic-pos": [{
        "mask-conic": [ue]
      }],
      "mask-image-conic-from-pos": [{
        "mask-conic-from": Ie()
      }],
      "mask-image-conic-to-pos": [{
        "mask-conic-to": Ie()
      }],
      "mask-image-conic-from-color": [{
        "mask-conic-from": y()
      }],
      "mask-image-conic-to-color": [{
        "mask-conic-to": y()
      }],
      "mask-mode": [{
        mask: ["alpha", "luminance", "match"]
      }],
      "mask-origin": [{
        "mask-origin": ["border", "padding", "content", "fill", "stroke", "view"]
      }],
      "mask-position": [{
        mask: ie()
      }],
      "mask-repeat": [{
        mask: Re()
      }],
      "mask-size": [{
        mask: v()
      }],
      "mask-type": [{
        "mask-type": ["alpha", "luminance"]
      }],
      "mask-image": [{
        mask: ["none", H, F]
      }],
      filter: [{
        filter: ["", "none", H, F]
      }],
      blur: [{
        blur: vt()
      }],
      brightness: [{
        brightness: [ue, H, F]
      }],
      contrast: [{
        contrast: [ue, H, F]
      }],
      "drop-shadow": [{
        "drop-shadow": ["", "none", p, Hs, Fs]
      }],
      "drop-shadow-color": [{
        "drop-shadow": y()
      }],
      grayscale: [{
        grayscale: ["", ue, H, F]
      }],
      "hue-rotate": [{
        "hue-rotate": [ue, H, F]
      }],
      invert: [{
        invert: ["", ue, H, F]
      }],
      saturate: [{
        saturate: [ue, H, F]
      }],
      sepia: [{
        sepia: ["", ue, H, F]
      }],
      "backdrop-filter": [{
        "backdrop-filter": ["", "none", H, F]
      }],
      "backdrop-blur": [{
        "backdrop-blur": vt()
      }],
      "backdrop-brightness": [{
        "backdrop-brightness": [ue, H, F]
      }],
      "backdrop-contrast": [{
        "backdrop-contrast": [ue, H, F]
      }],
      "backdrop-grayscale": [{
        "backdrop-grayscale": ["", ue, H, F]
      }],
      "backdrop-hue-rotate": [{
        "backdrop-hue-rotate": [ue, H, F]
      }],
      "backdrop-invert": [{
        "backdrop-invert": ["", ue, H, F]
      }],
      "backdrop-opacity": [{
        "backdrop-opacity": [ue, H, F]
      }],
      "backdrop-saturate": [{
        "backdrop-saturate": [ue, H, F]
      }],
      "backdrop-sepia": [{
        "backdrop-sepia": ["", ue, H, F]
      }],
      "border-collapse": [{
        border: ["collapse", "separate"]
      }],
      "border-spacing": [{
        "border-spacing": A()
      }],
      "border-spacing-x": [{
        "border-spacing-x": A()
      }],
      "border-spacing-y": [{
        "border-spacing-y": A()
      }],
      "table-layout": [{
        table: ["auto", "fixed"]
      }],
      caption: [{
        caption: ["top", "bottom"]
      }],
      transition: [{
        transition: ["", "all", "colors", "opacity", "shadow", "transform", "none", H, F]
      }],
      "transition-behavior": [{
        transition: ["normal", "discrete"]
      }],
      duration: [{
        duration: [ue, "initial", H, F]
      }],
      ease: [{
        ease: ["linear", "initial", h, H, F]
      }],
      delay: [{
        delay: [ue, H, F]
      }],
      animate: [{
        animate: ["none", m, H, F]
      }],
      backface: [{
        backface: ["hidden", "visible"]
      }],
      perspective: [{
        perspective: [b, H, F]
      }],
      "perspective-origin": [{
        "perspective-origin": I()
      }],
      rotate: [{
        rotate: Ot()
      }],
      "rotate-x": [{
        "rotate-x": Ot()
      }],
      "rotate-y": [{
        "rotate-y": Ot()
      }],
      "rotate-z": [{
        "rotate-z": Ot()
      }],
      scale: [{
        scale: Yt()
      }],
      "scale-x": [{
        "scale-x": Yt()
      }],
      "scale-y": [{
        "scale-y": Yt()
      }],
      "scale-z": [{
        "scale-z": Yt()
      }],
      "scale-3d": ["scale-3d"],
      skew: [{
        skew: Ta()
      }],
      "skew-x": [{
        "skew-x": Ta()
      }],
      "skew-y": [{
        "skew-y": Ta()
      }],
      transform: [{
        transform: [H, F, "", "none", "gpu", "cpu"]
      }],
      "transform-origin": [{
        origin: I()
      }],
      "transform-style": [{
        transform: ["3d", "flat"]
      }],
      translate: [{
        translate: bn()
      }],
      "translate-x": [{
        "translate-x": bn()
      }],
      "translate-y": [{
        "translate-y": bn()
      }],
      "translate-z": [{
        "translate-z": bn()
      }],
      "translate-none": ["translate-none"],
      zoom: [{
        zoom: [Oa, H, F]
      }],
      accent: [{
        accent: y()
      }],
      appearance: [{
        appearance: ["none", "auto"]
      }],
      "caret-color": [{
        caret: y()
      }],
      "color-scheme": [{
        scheme: ["normal", "dark", "light", "light-dark", "only-dark", "only-light"]
      }],
      cursor: [{
        cursor: ["auto", "default", "pointer", "wait", "text", "move", "help", "not-allowed", "none", "context-menu", "progress", "cell", "crosshair", "vertical-text", "alias", "copy", "no-drop", "grab", "grabbing", "all-scroll", "col-resize", "row-resize", "n-resize", "e-resize", "s-resize", "w-resize", "ne-resize", "nw-resize", "se-resize", "sw-resize", "ew-resize", "ns-resize", "nesw-resize", "nwse-resize", "zoom-in", "zoom-out", H, F]
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
        "scrollbar-thumb": y()
      }],
      "scrollbar-track-color": [{
        "scrollbar-track": y()
      }],
      "scrollbar-gutter": [{
        "scrollbar-gutter": ["auto", "stable", "both"]
      }],
      "scrollbar-w": [{
        scrollbar: ["auto", "thin", "none"]
      }],
      "scroll-m": [{
        "scroll-m": A()
      }],
      "scroll-mx": [{
        "scroll-mx": A()
      }],
      "scroll-my": [{
        "scroll-my": A()
      }],
      "scroll-ms": [{
        "scroll-ms": A()
      }],
      "scroll-me": [{
        "scroll-me": A()
      }],
      "scroll-mbs": [{
        "scroll-mbs": A()
      }],
      "scroll-mbe": [{
        "scroll-mbe": A()
      }],
      "scroll-mt": [{
        "scroll-mt": A()
      }],
      "scroll-mr": [{
        "scroll-mr": A()
      }],
      "scroll-mb": [{
        "scroll-mb": A()
      }],
      "scroll-ml": [{
        "scroll-ml": A()
      }],
      "scroll-p": [{
        "scroll-p": A()
      }],
      "scroll-px": [{
        "scroll-px": A()
      }],
      "scroll-py": [{
        "scroll-py": A()
      }],
      "scroll-ps": [{
        "scroll-ps": A()
      }],
      "scroll-pe": [{
        "scroll-pe": A()
      }],
      "scroll-pbs": [{
        "scroll-pbs": A()
      }],
      "scroll-pbe": [{
        "scroll-pbe": A()
      }],
      "scroll-pt": [{
        "scroll-pt": A()
      }],
      "scroll-pr": [{
        "scroll-pr": A()
      }],
      "scroll-pb": [{
        "scroll-pb": A()
      }],
      "scroll-pl": [{
        "scroll-pl": A()
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
        "will-change": ["auto", "scroll", "contents", "transform", H, F]
      }],
      fill: [{
        fill: ["none", ...y()]
      }],
      "stroke-w": [{
        stroke: [ue, gi, Tr, dv]
      }],
      stroke: [{
        stroke: ["none", ...y()]
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
var Mv = AC(ZC);
// classNames (minified: V) — ──── App: cn() helper; shadcn-style UI components (Button, Input, Label, Card*); login form (qv: onLogin/error/loading) ────
// classNames (minified: V) — Joins class names (clsx) and merges conflicting Tailwind classes (tailwind-merge).
function classNames(...classInputs) {
  return Mv(qs(classInputs));
}
// jsxForButton (minified: Nv) — jsx runtime for this UI module. Also declares buttonVariants (cva classes: variant default / secondary / destructive / ghost / link, size default / sm / lg / icon) and Button, a themed <button> (shadcn-style) that forwards its ref.
var jsxForButton = G(oe()),
  buttonVariants = sv("inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-opacity focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 cursor-pointer border-none", {
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
  Button = (0, reactForButton.forwardRef)(({
    className: className,
    variant: variant,
    size: size,
    ...props
  }, ref) => (0, jsxForButton.jsx)("button", {
    className: classNames(buttonVariants({
      variant: variant,
      size: size,
      className: className
    })),
    ref: ref,
    ...props
  }));
Button.displayName = "Button";
var reactForInput = G(_e());
// jsxForInput (minified: Ov) — jsx runtime for Input: a themed text <input> that forwards its ref.
var jsxForInput = G(oe()),
  Input = (0, reactForInput.forwardRef)(({
    className: className,
    type: type,
    ...props
  }, ref) => (0, jsxForInput.jsx)("input", {
    type: type,
    className: classNames("flex h-9 w-full rounded-md border border-border bg-input px-3 py-1 text-sm text-input-foreground transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50", className),
    ref: ref,
    ...props
  }));
Input.displayName = "Input";
var reactForLabel = G(_e());
// jsxForLabel (minified: Uv) — jsx runtime for Label: a themed <label>.
var jsxForLabel = G(oe()),
  Label = (0, reactForLabel.forwardRef)(({
    className: className,
    ...props
  }, ref) => (0, jsxForLabel.jsx)("label", {
    className: classNames("text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className),
    ref: ref,
    ...props
  }));
Label.displayName = "Label";
var reactForCard = G(_e());
// jsxForCard (minified: jl) — jsx runtime for the Card parts: Card (bordered container), CardHeader, CardTitle, CardDescription, CardContent.
var jsxForCard = G(oe()),
  Card = (0, reactForCard.forwardRef)(({
    className: className,
    ...props
  }, ref) => (0, jsxForCard.jsx)("div", {
    ref: ref,
    className: classNames("rounded-lg border border-border bg-card text-card-foreground", className),
    ...props
  }));
Card.displayName = "Card";
var CardHeader = (0, reactForCard.forwardRef)(({
  className: className,
  ...props
}, ref) => (0, jsxForCard.jsx)("div", {
  ref: ref,
  className: classNames("flex flex-col space-y-1.5 p-4", className),
  ...props
}));
CardHeader.displayName = "CardHeader";
var CardTitle = (0, reactForCard.forwardRef)(({
  className: className,
  ...props
}, ref) => (0, jsxForCard.jsx)("h3", {
  ref: ref,
  className: classNames("font-semibold leading-none tracking-tight", className),
  ...props
}));
CardTitle.displayName = "CardTitle";
var CardDescription = (0, reactForCard.forwardRef)(({
  className: className,
  ...props
}, ref) => (0, jsxForCard.jsx)("p", {
  ref: ref,
  className: classNames("text-sm text-muted-foreground", className),
  ...props
}));
CardDescription.displayName = "CardDescription";
var CardContent = (0, reactForCard.forwardRef)(({
  className: className,
  ...props
}, ref) => (0, jsxForCard.jsx)("div", {
  ref: ref,
  className: classNames("p-4 pt-0", className),
  ...props
}));
CardContent.displayName = "CardContent";
var jsxForLogin = G(oe());
// LoginForm (minified: qv) — Sonover sign-in card (email + password); calls onLogin(email, password) on submit, shows error and a "Signing in..." state while loading.
function LoginForm({
  onLogin: onLogin,
  error: error,
  loading: loading
}) {
  let [email, setEmail] = (0, reactForLogin.useState)(""),
    [password, setPassword] = (0, reactForLogin.useState)("");
  return (0, jsxForLogin.jsx)("div", {
    className: "p-3",
    children: (0, jsxForLogin.jsxs)(Card, {
      children: [(0, jsxForLogin.jsxs)(CardHeader, {
        children: [(0, jsxForLogin.jsx)(CardTitle, {
          children: "Sonover Code"
        }), (0, jsxForLogin.jsx)(CardDescription, {
          children: "Sign in to get started"
        })]
      }), (0, jsxForLogin.jsx)(CardContent, {
        children: (0, jsxForLogin.jsxs)("form", {
          onSubmit: submitEvent => {
            submitEvent.preventDefault(), onLogin(email, password);
          },
          className: "flex flex-col gap-3",
          children: [(0, jsxForLogin.jsxs)("div", {
            className: "flex flex-col gap-1.5",
            children: [(0, jsxForLogin.jsx)(Label, {
              htmlFor: "email",
              children: "Email"
            }), (0, jsxForLogin.jsx)(Input, {
              id: "email",
              type: "email",
              value: email,
              onChange: changeEvent => setEmail(changeEvent.target.value),
              placeholder: "you@sonover.com"
            })]
          }), (0, jsxForLogin.jsxs)("div", {
            className: "flex flex-col gap-1.5",
            children: [(0, jsxForLogin.jsx)(Label, {
              htmlFor: "password",
              children: "Password"
            }), (0, jsxForLogin.jsx)(Input, {
              id: "password",
              type: "password",
              value: password,
              onChange: changeEvent => setPassword(changeEvent.target.value),
              placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
            })]
          }), error && (0, jsxForLogin.jsx)("p", {
            className: "text-xs text-destructive m-0",
            children: error
          }), (0, jsxForLogin.jsx)(Button, {
            type: "submit",
            disabled: loading,
            className: "w-full",
            children: loading ? "Signing in..." : "Sign In"
          })]
        })
      })]
    })
  });
}
// ──── Library: lucide-react (core + icons) (bundled from npm; unchanged, names left minified) ────
var Xs = G(_e(), 1);
var Gs = (...e) => e.filter((t, a, n) => !!t && t.trim() !== "" && n.indexOf(t) === a).join(" ").trim();
var Fv = e => e.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
var Hv = e => e.replace(/^([A-Z])|[\s-_]+(\w)/g, (t, a, n) => n ? n.toUpperCase() : a.toLowerCase());
var Dp = e => {
  let t = Hv(e);
  return t.charAt(0).toUpperCase() + t.slice(1);
};
var ki = G(_e(), 1);
var Vs = {
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
var _v = e => {
  for (let t in e) if (t.startsWith("aria-") || t === "role" || t === "title") return !0;
  return !1;
};
var Yl = G(_e(), 1);
var $C = (0, Yl.createContext)({});
var Gv = () => (0, Yl.useContext)($C);
var Vv = (0, ki.forwardRef)(({
  color: e,
  size: t,
  strokeWidth: a,
  absoluteStrokeWidth: n,
  className: r = "",
  children: l,
  iconNode: o,
  ...i
}, u) => {
  let {
      size: s = 24,
      strokeWidth: c = 2,
      absoluteStrokeWidth: f = !1,
      color: d = "currentColor",
      className: p = ""
    } = Gv() ?? {},
    x = n ?? f ? Number(a ?? c) * 24 / Number(t ?? s) : a ?? c;
  return (0, ki.createElement)("svg", {
    ref: u,
    ...Vs,
    width: t ?? s ?? Vs.width,
    height: t ?? s ?? Vs.height,
    stroke: e ?? d,
    strokeWidth: x,
    className: Gs("lucide", p, r),
    ...(!l && !_v(i) && {
      "aria-hidden": "true"
    }),
    ...i
  }, [...o.map(([b, C]) => (0, ki.createElement)(b, C)), ...(Array.isArray(l) ? l : [l])]);
});
var createLucideIcon = (e, t) => {
  let a = (0, Xs.forwardRef)(({
    className: n,
    ...r
  }, l) => (0, Xs.createElement)(Vv, {
    ref: l,
    iconNode: t,
    className: Gs(`lucide-${Fv(Dp(e))}`, `lucide-${e}`, n),
    ...r
  }));
  return a.displayName = Dp(e), a;
};
var arrowLeftIconNode = [["path", {
    d: "m12 19-7-7 7-7",
    key: "1l729n"
  }], ["path", {
    d: "M19 12H5",
    key: "x3x0zl"
  }]],
  ArrowLeftIcon = createLucideIcon("arrow-left", arrowLeftIconNode);
var arrowUpIconNode = [["path", {
    d: "m5 12 7-7 7 7",
    key: "hav0vg"
  }], ["path", {
    d: "M12 19V5",
    key: "x0mq9r"
  }]],
  ArrowUpIcon = createLucideIcon("arrow-up", arrowUpIconNode);
var brainIconNode = [["path", {
    d: "M12 18V5",
    key: "adv99a"
  }], ["path", {
    d: "M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4",
    key: "1e3is1"
  }], ["path", {
    d: "M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5",
    key: "1gqd8o"
  }], ["path", {
    d: "M17.997 5.125a4 4 0 0 1 2.526 5.77",
    key: "iwvgf7"
  }], ["path", {
    d: "M18 18a4 4 0 0 0 2-7.464",
    key: "efp6ie"
  }], ["path", {
    d: "M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517",
    key: "1gq6am"
  }], ["path", {
    d: "M6 18a4 4 0 0 1-2-7.464",
    key: "k1g0md"
  }], ["path", {
    d: "M6.003 5.125a4 4 0 0 0-2.526 5.77",
    key: "q97ue3"
  }]],
  BrainIcon = createLucideIcon("brain", brainIconNode);
var checkCheckIconNode = [["path", {
    d: "M18 6 7 17l-5-5",
    key: "116fxf"
  }], ["path", {
    d: "m22 10-7.5 7.5L13 16",
    key: "ke71qq"
  }]],
  CheckCheckIcon = createLucideIcon("check-check", checkCheckIconNode);
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
var circleDashedIconNode = [["path", {
    d: "M10.1 2.182a10 10 0 0 1 3.8 0",
    key: "5ilxe3"
  }], ["path", {
    d: "M13.9 21.818a10 10 0 0 1-3.8 0",
    key: "11zvb9"
  }], ["path", {
    d: "M17.609 3.721a10 10 0 0 1 2.69 2.7",
    key: "1iw5b2"
  }], ["path", {
    d: "M2.182 13.9a10 10 0 0 1 0-3.8",
    key: "c0bmvh"
  }], ["path", {
    d: "M20.279 17.609a10 10 0 0 1-2.7 2.69",
    key: "1ruxm7"
  }], ["path", {
    d: "M21.818 10.1a10 10 0 0 1 0 3.8",
    key: "qkgqxc"
  }], ["path", {
    d: "M3.721 6.391a10 10 0 0 1 2.7-2.69",
    key: "1mcia2"
  }], ["path", {
    d: "M6.391 20.279a10 10 0 0 1-2.69-2.7",
    key: "1fvljs"
  }]],
  CircleDashedIcon = createLucideIcon("circle-dashed", circleDashedIconNode);
var circleXIconNode = [["circle", {
    cx: "12",
    cy: "12",
    r: "10",
    key: "1mglay"
  }], ["path", {
    d: "m15 9-6 6",
    key: "1uzhvr"
  }], ["path", {
    d: "m9 9 6 6",
    key: "z0biqf"
  }]],
  CircleXIcon = createLucideIcon("circle-x", circleXIconNode);
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
var folderGit2IconNode = [["path", {
    d: "M18 19a5 5 0 0 1-5-5v8",
    key: "sz5oeg"
  }], ["path", {
    d: "M9 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v5",
    key: "1w6njk"
  }], ["circle", {
    cx: "13",
    cy: "12",
    r: "2",
    key: "1j92g6"
  }], ["circle", {
    cx: "20",
    cy: "19",
    r: "2",
    key: "1obnsp"
  }]],
  FolderGit2Icon = createLucideIcon("folder-git-2", folderGit2IconNode);
var folderOpenIconNode = [["path", {
    d: "m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2",
    key: "usdka0"
  }]],
  FolderOpenIcon = createLucideIcon("folder-open", folderOpenIconNode);
var gitMergeIconNode = [["circle", {
    cx: "18",
    cy: "18",
    r: "3",
    key: "1xkwt0"
  }], ["circle", {
    cx: "6",
    cy: "6",
    r: "3",
    key: "1lh9wr"
  }], ["path", {
    d: "M6 21V9a9 9 0 0 0 9 9",
    key: "7kw0sc"
  }]],
  GitMergeIcon = createLucideIcon("git-merge", gitMergeIconNode);
var imageIconNode = [["rect", {
    width: "18",
    height: "18",
    x: "3",
    y: "3",
    rx: "2",
    ry: "2",
    key: "1m3agn"
  }], ["circle", {
    cx: "9",
    cy: "9",
    r: "2",
    key: "af1f0g"
  }], ["path", {
    d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21",
    key: "1xmnt7"
  }]],
  ImageIcon = createLucideIcon("image", imageIconNode);
var infoIconNode = [["circle", {
    cx: "12",
    cy: "12",
    r: "10",
    key: "1mglay"
  }], ["path", {
    d: "M12 16v-4",
    key: "1dtifu"
  }], ["path", {
    d: "M12 8h.01",
    key: "e9boi3"
  }]],
  InfoIcon = createLucideIcon("info", infoIconNode);
var listTreeIconNode = [["path", {
    d: "M8 5h13",
    key: "1pao27"
  }], ["path", {
    d: "M13 12h8",
    key: "h98zly"
  }], ["path", {
    d: "M13 19h8",
    key: "c3s6r1"
  }], ["path", {
    d: "M3 10a2 2 0 0 0 2 2h3",
    key: "1npucw"
  }], ["path", {
    d: "M3 5v12a2 2 0 0 0 2 2h3",
    key: "x1gjn2"
  }]],
  ListTreeIcon = createLucideIcon("list-tree", listTreeIconNode);
var logOutIconNode = [["path", {
    d: "m16 17 5-5-5-5",
    key: "1bji2h"
  }], ["path", {
    d: "M21 12H9",
    key: "dn1m92"
  }], ["path", {
    d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",
    key: "1uf3rs"
  }]],
  LogOutIcon = createLucideIcon("log-out", logOutIconNode);
var messageSquarePlusIconNode = [["path", {
    d: "M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z",
    key: "18887p"
  }], ["path", {
    d: "M12 8v6",
    key: "1ib9pf"
  }], ["path", {
    d: "M9 11h6",
    key: "1fldmi"
  }]],
  MessageSquarePlusIcon = createLucideIcon("message-square-plus", messageSquarePlusIconNode);
var messageSquareIconNode = [["path", {
    d: "M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z",
    key: "18887p"
  }]],
  MessageSquareIcon = createLucideIcon("message-square", messageSquareIconNode);
var panelLeftIconNode = [["rect", {
    width: "18",
    height: "18",
    x: "3",
    y: "3",
    rx: "2",
    key: "afitv7"
  }], ["path", {
    d: "M9 3v18",
    key: "fh3hqa"
  }]],
  PanelLeftIcon = createLucideIcon("panel-left", panelLeftIconNode);
var pencilIconNode = [["path", {
    d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
    key: "1a8usu"
  }], ["path", {
    d: "m15 5 4 4",
    key: "1mk7zo"
  }]],
  PencilIcon = createLucideIcon("pencil", pencilIconNode);
var playIconNode = [["path", {
    d: "M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z",
    key: "10ikf1"
  }]],
  PlayIcon = createLucideIcon("play", playIconNode);
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
var rotateCcwClockIconNode = [["path", {
    d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",
    key: "1357e3"
  }], ["path", {
    d: "M3 3v5h5",
    key: "1xhq8a"
  }], ["path", {
    d: "M12 7v5l4 2",
    key: "1fdv2h"
  }]],
  RotateCcwClockIcon = createLucideIcon("rotate-ccw-clock", rotateCcwClockIconNode);
var settings2IconNode = [["path", {
    d: "M14 17H5",
    key: "gfn3mx"
  }], ["path", {
    d: "M19 7h-9",
    key: "6i9tg"
  }], ["circle", {
    cx: "17",
    cy: "17",
    r: "3",
    key: "18b49y"
  }], ["circle", {
    cx: "7",
    cy: "7",
    r: "3",
    key: "dfmy0x"
  }]],
  Settings2Icon = createLucideIcon("settings-2", settings2IconNode);
var serverIconNode = [["rect", {
    width: "20",
    height: "8",
    x: "2",
    y: "2",
    rx: "2",
    ry: "2",
    key: "ngkwjq"
  }], ["rect", {
    width: "20",
    height: "8",
    x: "2",
    y: "14",
    rx: "2",
    ry: "2",
    key: "iecqi9"
  }], ["line", {
    x1: "6",
    x2: "6.01",
    y1: "6",
    y2: "6",
    key: "16zg32"
  }], ["line", {
    x1: "6",
    x2: "6.01",
    y1: "18",
    y2: "18",
    key: "nzw8ys"
  }]],
  ServerIcon = createLucideIcon("server", serverIconNode);
var shieldQuestionMarkIconNode = [["path", {
    d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
    key: "oel41y"
  }], ["path", {
    d: "M9.1 9a3 3 0 0 1 5.82 1c0 2-3 3-3 3",
    key: "mhlwft"
  }], ["path", {
    d: "M12 17h.01",
    key: "p32p05"
  }]],
  ShieldQuestionMarkIcon = createLucideIcon("shield-question-mark", shieldQuestionMarkIconNode);
var sparklesIconNode = [["path", {
    d: "M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z",
    key: "1s2grr"
  }], ["path", {
    d: "M20 2v4",
    key: "1rf3ol"
  }], ["path", {
    d: "M22 4h-4",
    key: "gwowj6"
  }], ["circle", {
    cx: "4",
    cy: "20",
    r: "2",
    key: "6kqj1y"
  }]],
  SparklesIcon = createLucideIcon("sparkles", sparklesIconNode);
var squareArrowOutUpRightIconNode = [["path", {
    d: "M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6",
    key: "y09zxi"
  }], ["path", {
    d: "m21 3-9 9",
    key: "mpx6sq"
  }], ["path", {
    d: "M15 3h6v6",
    key: "1q9fwt"
  }]],
  SquareArrowOutUpRightIcon = createLucideIcon("square-arrow-out-up-right", squareArrowOutUpRightIconNode);
var squareIconNode = [["rect", {
    width: "18",
    height: "18",
    x: "3",
    y: "3",
    rx: "2",
    key: "afitv7"
  }]],
  SquareIcon = createLucideIcon("square", squareIconNode);
var starIconNode = [["path", {
    d: "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",
    key: "r04s7s"
  }]],
  StarIcon = createLucideIcon("star", starIconNode);
var terminalIconNode = [["path", {
    d: "M12 19h8",
    key: "baeox8"
  }], ["path", {
    d: "m4 17 6-6-6-6",
    key: "1yngyt"
  }]],
  TerminalIcon = createLucideIcon("terminal", terminalIconNode);
var ticketIconNode = [["path", {
    d: "M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z",
    key: "qn84l0"
  }], ["path", {
    d: "M13 5v2",
    key: "dyzc3o"
  }], ["path", {
    d: "M13 17v2",
    key: "1ont0d"
  }], ["path", {
    d: "M13 11v2",
    key: "1wjjxi"
  }]],
  TicketIcon = createLucideIcon("ticket", ticketIconNode);
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
// reactForAddInstance (minified: zr) — ──── App: Sidebar screens: add-instance form (Xv), instances list / home with Workflows/Menus/Pages/System Logs entries (jv, SL$ icon, GI), account view (Qv); agent chat state reducer (Zv, VI, Kv, Wv), MCP tool-name labels (Bp); chat composer (Jv), toolbar pickers for instance/CLI/profile ($v, eL, tL), chat header (aL), thread list (XI), relative time (jI); task board (nL); agent teams editor (rL, js, lL, iL, uL, Gi, Rp, KI, sL) ────
var reactForAddInstance = G(_e());
var jsxForAddInstance = G(oe());
// AddInstanceForm (minified: Xv) — Form to connect a Saturn instance: URL, sign-in by email & password or by API key, optional display name.
// Calls onSubmit({method, url, email, password, apiKey, displayName}); onCancel (if given) shows a Cancel button.
function AddInstanceForm({
  onSubmit: onSubmit,
  onCancel: onCancel,
  error: error,
  loading: loading
}) {
  let [url, setUrl] = (0, reactForAddInstance.useState)("https://"),
    [email, setEmail] = (0, reactForAddInstance.useState)(""),
    [password, setPassword] = (0, reactForAddInstance.useState)(""),
    [displayName, setDisplayName] = (0, reactForAddInstance.useState)(""),
    [method, setMethod] = (0, reactForAddInstance.useState)("password"),
    [apiKey, setApiKey] = (0, reactForAddInstance.useState)("");
  return (0, jsxForAddInstance.jsxs)("form", {
    onSubmit: submitEvent => {
      submitEvent.preventDefault(), onSubmit(method === "apiKey" ? {
        method: method,
        url: url.trim(),
        email: "",
        password: "",
        apiKey: apiKey.trim(),
        displayName: displayName.trim()
      } : {
        method: method,
        url: url.trim(),
        email: email.trim(),
        password: password,
        apiKey: "",
        displayName: displayName.trim()
      });
    },
    className: "flex flex-col gap-3",
    children: [(0, jsxForAddInstance.jsxs)("div", {
      className: "flex flex-col gap-1.5",
      children: [(0, jsxForAddInstance.jsx)(Label, {
        htmlFor: "saturn-url",
        children: "Instance URL"
      }), (0, jsxForAddInstance.jsx)(Input, {
        id: "saturn-url",
        type: "url",
        value: url,
        onChange: changeEvent => setUrl(changeEvent.target.value),
        placeholder: "https://demosaturn.saturn.gd",
        autoFocus: !0
      })]
    }), (0, jsxForAddInstance.jsx)("div", {
      className: "flex rounded-md border border-border p-0.5 text-xs",
      role: "tablist",
      "aria-label": "Sign in with",
      children: [["password", "Email & password"], ["apiKey", "API key"]].map(([tabMethod, tabLabel]) => (0, jsxForAddInstance.jsx)("button", {
        type: "button",
        role: "tab",
        "aria-selected": method === tabMethod,
        onClick: () => setMethod(tabMethod),
        className: classNames("flex-1 rounded px-2 py-1 border-none cursor-pointer", method === tabMethod ? "bg-[var(--vscode-button-background)] text-[var(--vscode-button-foreground)]" : "bg-transparent text-muted-foreground hover:text-foreground"),
        children: tabLabel
      }, tabMethod))
    }), method === "password" ? (0, jsxForAddInstance.jsxs)(jsxForAddInstance.Fragment, {
      children: [(0, jsxForAddInstance.jsxs)("div", {
        className: "flex flex-col gap-1.5",
        children: [(0, jsxForAddInstance.jsx)(Label, {
          htmlFor: "saturn-email",
          children: "Email"
        }), (0, jsxForAddInstance.jsx)(Input, {
          id: "saturn-email",
          type: "email",
          value: email,
          onChange: changeEvent => setEmail(changeEvent.target.value),
          placeholder: "you@example.com"
        })]
      }), (0, jsxForAddInstance.jsxs)("div", {
        className: "flex flex-col gap-1.5",
        children: [(0, jsxForAddInstance.jsx)(Label, {
          htmlFor: "saturn-password",
          children: "Password"
        }), (0, jsxForAddInstance.jsx)(Input, {
          id: "saturn-password",
          type: "password",
          value: password,
          onChange: changeEvent => setPassword(changeEvent.target.value),
          placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
        })]
      })]
    }) : (0, jsxForAddInstance.jsxs)("div", {
      className: "flex flex-col gap-1.5",
      children: [(0, jsxForAddInstance.jsx)(Label, {
        htmlFor: "saturn-api-key",
        children: "API key"
      }), (0, jsxForAddInstance.jsx)(Input, {
        id: "saturn-api-key",
        type: "password",
        value: apiKey,
        onChange: changeEvent => setApiKey(changeEvent.target.value),
        placeholder: "Paste the instance's API key",
        autoComplete: "off",
        spellCheck: !1
      }), (0, jsxForAddInstance.jsx)("p", {
        className: "m-0 text-[11px] text-muted-foreground",
        children: "For when you have no user account on the instance. It is checked with the instance first, then kept in VS Code's secret storage \u2014 never in settings or files."
      })]
    }), (0, jsxForAddInstance.jsxs)("div", {
      className: "flex flex-col gap-1.5",
      children: [(0, jsxForAddInstance.jsx)(Label, {
        htmlFor: "saturn-display-name",
        children: "Display name (optional)"
      }), (0, jsxForAddInstance.jsx)(Input, {
        id: "saturn-display-name",
        value: displayName,
        onChange: changeEvent => setDisplayName(changeEvent.target.value),
        placeholder: "Defaults to the instance's host"
      })]
    }), error && (0, jsxForAddInstance.jsx)("p", {
      className: "text-xs text-destructive m-0",
      children: error
    }), (0, jsxForAddInstance.jsxs)("div", {
      className: "flex gap-2",
      children: [onCancel && (0, jsxForAddInstance.jsx)(Button, {
        type: "button",
        variant: "ghost",
        onClick: onCancel,
        disabled: loading,
        className: "flex-1",
        children: "Cancel"
      }), (0, jsxForAddInstance.jsx)(Button, {
        type: "submit",
        disabled: loading,
        className: "flex-1",
        children: loading ? "Connecting..." : "Connect"
      })]
    })]
  });
}
var reactForInstances = G(_e());
// instanceLabel (minified: Hi) — Name shown for an instance: its display name if set, else its name.
function instanceLabel(instance) {
  return instance.displayName?.trim() || instance.name;
}
var jsxForInstances = G(oe());
// InstanceList (minified: jv) — Saturn instances list: starred ones first, each expandable to its actions (agent chat, Workflows, Menus, Pages, System Logs, Resources, Components, rename, remove).
// Renames inline (Enter / blur saves, Escape cancels); System Logs and Resources post saturn:openSystemLogs / saturn:openResources {instanceId} themselves, the rest go to the on* callbacks.
// A lone instance starts expanded; renamingRef stops a rename finishing twice (Enter then blur).
function InstanceList({
  instances: instances,
  onOpen: onOpen,
  onOpenWorkflows: onOpenWorkflows,
  onOpenMenus: onOpenMenus,
  onOpenPages: onOpenPages,
  onOpenChat: onOpenChat,
  onRemove: onRemove,
  onSetDisplayName: onSetDisplayName,
  onSetFavorite: onSetFavorite
}) {
  let sorted = [...instances.filter(instance => instance.favorite), ...instances.filter(instance => !instance.favorite)],
    favoriteCount = sorted.filter(instance => instance.favorite).length,
    [renamingId, setRenamingId] = (0, reactForInstances.useState)(null),
    [expandedIds, setExpandedIds] = (0, reactForInstances.useState)(() => new Set(instances.length === 1 ? [instances[0].id] : [])),
    toggleExpanded = instanceId => setExpandedIds(previous => {
      let next = new Set(previous);
      return next.has(instanceId) ? next.delete(instanceId) : next.add(instanceId), next;
    }),
    [draftName, setDraftName] = (0, reactForInstances.useState)(""),
    renamingRef = (0, reactForInstances.useRef)(null),
    startRename = instance => {
      renamingRef.current = instance.id, setRenamingId(instance.id), setDraftName(instance.displayName ?? "");
    },
    finishRename = (instance, save) => {
      // Saves only if asked to and the name actually changed.
      renamingRef.current === instance.id && (renamingRef.current = null, setRenamingId(null), save && draftName.trim() !== (instance.displayName ?? "") && onSetDisplayName(instance, draftName));
    };
  return (0, jsxForInstances.jsx)("div", {
    className: "flex flex-col gap-2",
    children: sorted.map((instance, index) => {
      let expanded = expandedIds.has(instance.id),
        label = instanceLabel(instance);
      return (0, jsxForInstances.jsxs)("div", {
        className: classNames("rounded-md border border-border", favoriteCount > 0 && index === favoriteCount && "mt-2"),
        children: [renamingId === instance.id ? (0, jsxForInstances.jsxs)("form", {
          className: "px-2.5 py-2",
          onSubmit: submitEvent => {
            submitEvent.preventDefault(), finishRename(instance, !0);
          },
          children: [(0, jsxForInstances.jsx)(Input, {
            autoFocus: !0,
            value: draftName,
            placeholder: instance.name,
            "aria-label": `Display name for ${instance.url}`,
            onChange: changeEvent => setDraftName(changeEvent.target.value),
            onBlur: () => finishRename(instance, !0),
            onKeyDown: keyEvent => {
              keyEvent.key === "Escape" && finishRename(instance, !1);
            }
          }), (0, jsxForInstances.jsxs)("p", {
            className: "text-xs text-muted-foreground m-0 mt-1 truncate",
            children: ['Only changes how it is shown. Leave empty for "', instance.name, '".']
          })]
        }) : (0, jsxForInstances.jsxs)("div", {
          className: "flex items-center pr-1.5",
          children: [(0, jsxForInstances.jsxs)("button", {
            type: "button",
            "aria-expanded": expanded,
            onClick: () => toggleExpanded(instance.id),
            title: expanded ? `Hide ${label}'s actions` : `Show ${label}'s actions`,
            className: "flex min-w-0 flex-1 cursor-pointer items-center gap-2 border-0 bg-transparent px-2.5 py-2 text-left",
            children: [(0, jsxForInstances.jsx)(ChevronRightIcon, {
              className: classNames("h-4 w-4 shrink-0 text-muted-foreground transition-transform", expanded && "rotate-90")
            }), (0, jsxForInstances.jsxs)("span", {
              className: "min-w-0 flex-1",
              children: [(0, jsxForInstances.jsx)("span", {
                className: "block text-sm text-foreground font-medium truncate",
                children: label
              }), (0, jsxForInstances.jsx)("span", {
                className: "block text-xs text-muted-foreground truncate",
                children: instance.url
              })]
            })]
          }), (0, jsxForInstances.jsx)("button", {
            type: "button",
            "aria-pressed": !!instance.favorite,
            onClick: () => onSetFavorite(instance, !instance.favorite),
            title: instance.favorite ? `Unstar ${label}` : `Star ${label} \u2014 starred instances are listed first`,
            className: classNames("flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded border-0 bg-transparent hover:bg-input", instance.favorite ? "text-[var(--vscode-editorWarning-foreground)]" : "text-muted-foreground opacity-60 hover:opacity-100"),
            children: (0, jsxForInstances.jsx)(StarIcon, {
              className: "h-4 w-4",
              fill: instance.favorite ? "currentColor" : "none"
            })
          })]
        }), expanded && renamingId !== instance.id && (0, jsxForInstances.jsx)(ActionGroups, {
          groups: [{
            title: "Open",
            items: [{
              label: "Agent Chat",
              icon: MessageSquareIcon,
              run: () => onOpenChat(instance)
            }, {
              label: "Workflows",
              icon: GitMergeIcon,
              run: () => onOpenWorkflows(instance)
            }, {
              label: "Menus",
              icon: PanelLeftIcon,
              run: () => onOpenMenus(instance)
            }, {
              label: "Pages",
              icon: FileCodeCornerIcon,
              run: () => onOpenPages(instance)
            }, {
              label: "System Logs",
              icon: SystemLogsIcon,
              run: () => vscodeApi.postMessage({
                type: "saturn:openSystemLogs",
                payload: {
                  instanceId: instance.id
                }
              })
            }, {
              // this project: the Resources screen (resource properties, required or not)
              label: "Resources",
              icon: ResourcesIcon,
              run: () => vscodeApi.postMessage({
                type: "saturn:openResources",
                payload: {
                  instanceId: instance.id
                }
              })
            }, {
              label: "Components",
              icon: ListTreeIcon,
              run: () => onOpen(instance)
            }]
          }, {
            title: "Manage",
            items: [{
              label: "Edit display name",
              icon: PencilIcon,
              run: () => startRename(instance)
            }, {
              label: "Remove instance",
              icon: Trash2Icon,
              run: () => onRemove(instance),
              destructive: !0
            }]
          }]
        })]
      }, instance.id);
    })
  });
}
// SystemLogsIcon (minified: SL$) — Icon for the System Logs entry (lines with a magnifier), drawn like a lucide icon.
function SystemLogsIcon({
  className: className
}) {
  return (0, jsxForInstances.jsxs)("svg", {
    className: className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
    children: [(0, jsxForInstances.jsx)("path", {
      d: "M4 6h16M4 12h11M4 18h8"
    }), (0, jsxForInstances.jsx)("circle", {
      cx: "18",
      cy: "17",
      r: "3"
    }), (0, jsxForInstances.jsx)("path", {
      d: "M20.2 19.2 22 21"
    })]
  });
}
// WhatsNewIcon — Icon for the What's new entry (a megaphone), drawn like a lucide icon. Added by this project.
function WhatsNewIcon({
  className: className
}) {
  return (0, jsxForInstances.jsxs)("svg", {
    className: className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
    children: [(0, jsxForInstances.jsx)("path", {
      d: "M3 11v2a1 1 0 0 0 1 1h3l5 4V6L7 10H4a1 1 0 0 0-1 1z"
    }), (0, jsxForInstances.jsx)("path", {
      d: "M16 9a4 4 0 0 1 0 6M19 6a8 8 0 0 1 0 12"
    })]
  });
}
// ResourcesIcon — Icon for the Resources entry (a database), drawn like a lucide icon. Added by this project.
function ResourcesIcon({
  className: className
}) {
  return (0, jsxForInstances.jsxs)("svg", {
    className: className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
    children: [(0, jsxForInstances.jsx)("ellipse", {
      cx: "12",
      cy: "5",
      rx: "8",
      ry: "3"
    }), (0, jsxForInstances.jsx)("path", {
      d: "M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5"
    }), (0, jsxForInstances.jsx)("path", {
      d: "M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"
    })]
  });
}
// ActionGroups (minified: GI) — Grid of labelled icon buttons, in titled groups ({title, items: [{label, icon, run, destructive?}]}).
function ActionGroups({
  groups: groups
}) {
  return (0, jsxForInstances.jsx)("div", {
    className: "flex flex-col gap-2 border-t border-border px-2.5 pb-2.5 pt-2",
    children: groups.map(group => (0, jsxForInstances.jsxs)("div", {
      className: "flex flex-col gap-1",
      children: [(0, jsxForInstances.jsx)("span", {
        className: "text-[10px] uppercase tracking-wider text-muted-foreground",
        children: group.title
      }), (0, jsxForInstances.jsx)("div", {
        className: "grid grid-cols-2 gap-1",
        children: group.items.map(item => {
          let ItemIcon = item.icon;
          return (0, jsxForInstances.jsxs)("button", {
            type: "button",
            onClick: item.run,
            className: classNames("flex min-w-0 cursor-pointer items-center gap-1.5 rounded-md border border-border bg-transparent px-2 py-1.5 text-left text-xs hover:bg-input", item.destructive ? "text-destructive" : "text-foreground"),
            children: [(0, jsxForInstances.jsx)(ItemIcon, {
              className: "h-3.5 w-3.5 shrink-0"
            }), (0, jsxForInstances.jsx)("span", {
              className: "truncate",
              children: item.label
            })]
          }, item.label);
        })
      })]
    }, group.title))
  });
}
var jsxForAccount = G(oe());
// SectionHeading (minified: Yv) — Small uppercase section heading.
function SectionHeading({
  children: children
}) {
  return (0, jsxForAccount.jsx)("p", {
    className: "text-[11px] uppercase tracking-wider text-muted-foreground m-0",
    children: children
  });
}
// AccountView (minified: Qv) — Signed-in home: the Sonover user with a log-out button, Tickets and AI Skills buttons (onNavigate("kanban" / "skills")),
// and the Saturn instances (the add-instance form, a "Connect" button when there are none, else InstanceList). saturn holds the instances state and its callbacks.
function AccountView({
  user: user,
  onNavigate: onNavigate,
  onLogout: onLogout,
  saturn: saturn
}) {
  let noInstances = saturn.instances.length === 0;
  return (0, jsxForAccount.jsxs)("div", {
    className: "flex flex-col gap-2 p-3",
    children: [(0, jsxForAccount.jsxs)("div", {
      className: "flex items-center justify-between",
      children: [(0, jsxForAccount.jsxs)("div", {
        children: [(0, jsxForAccount.jsxs)("p", {
          className: "text-sm text-foreground font-medium m-0",
          children: [user.first_name, " ", user.last_name]
        }), (0, jsxForAccount.jsx)("p", {
          className: "text-xs text-muted-foreground m-0",
          children: user.email
        })]
      }), (0, jsxForAccount.jsx)(Button, {
        variant: "ghost",
        size: "icon",
        onClick: onLogout,
        children: (0, jsxForAccount.jsx)(LogOutIcon, {
          className: "h-4 w-4"
        })
      })]
    }), (0, jsxForAccount.jsx)("div", {
      className: "mb-1 mt-2",
      children: (0, jsxForAccount.jsx)(SectionHeading, {
        children: "Navigation"
      })
    }), (0, jsxForAccount.jsxs)(Button, {
      variant: "secondary",
      className: "w-full justify-start gap-2",
      onClick: () => onNavigate("kanban"),
      children: [(0, jsxForAccount.jsx)(TicketIcon, {
        className: "h-4 w-4"
      }), "Tickets"]
    }), (0, jsxForAccount.jsxs)(Button, {
      variant: "secondary",
      className: "w-full justify-start gap-2",
      title: "Chat to an agent about an instance, and manage the skills it follows",
      onClick: () => onNavigate("skills"),
      children: [(0, jsxForAccount.jsx)(SparklesIcon, {
        className: "h-4 w-4"
      }), "AI Skills"]
    }), (0, jsxForAccount.jsxs)(Button, {
      // this project: Sonover Code's release notes on their own page
      variant: "secondary",
      className: "w-full justify-start gap-2",
      title: "What changed in each version of Sonover Code",
      onClick: () => vscodeApi.postMessage({
        type: "saturn:openWhatsNew"
      }),
      children: [(0, jsxForAccount.jsx)(WhatsNewIcon, {
        className: "h-4 w-4"
      }), "What's new"]
    }), (0, jsxForAccount.jsxs)("div", {
      className: "flex items-center justify-between mt-4 mb-1",
      children: [(0, jsxForAccount.jsx)(SectionHeading, {
        children: "Instances"
      }), !noInstances && !saturn.addingNew && (0, jsxForAccount.jsx)(Button, {
        variant: "ghost",
        size: "icon",
        className: "h-6 w-6",
        onClick: saturn.onStartAdd,
        title: "Connect another Saturn instance",
        children: (0, jsxForAccount.jsx)(PlusIcon, {
          className: "h-4 w-4"
        })
      })]
    }), saturn.addingNew ? (0, jsxForAccount.jsxs)(Card, {
      children: [(0, jsxForAccount.jsxs)(CardHeader, {
        children: [(0, jsxForAccount.jsx)(CardTitle, {
          children: "Connect a Saturn instance"
        }), (0, jsxForAccount.jsx)(CardDescription, {
          children: "Enter the URL and your credentials. The instance will be saved for future use."
        })]
      }), (0, jsxForAccount.jsx)(CardContent, {
        children: (0, jsxForAccount.jsx)(AddInstanceForm, {
          onSubmit: saturn.onAddInstance,
          onCancel: saturn.onCancelAdd,
          error: saturn.error,
          loading: saturn.loading
        })
      })]
    }) : noInstances ? (0, jsxForAccount.jsxs)(Button, {
      variant: "secondary",
      className: "w-full justify-start gap-2",
      onClick: saturn.onStartAdd,
      children: [(0, jsxForAccount.jsx)(PlusIcon, {
        className: "h-4 w-4"
      }), "Connect a Saturn instance"]
    }) : (0, jsxForAccount.jsx)(InstanceList, {
      instances: saturn.instances,
      onOpen: saturn.onOpenInstance,
      onOpenWorkflows: saturn.onOpenWorkflows,
      onOpenMenus: saturn.onOpenMenus,
      onOpenPages: saturn.onOpenPages,
      onOpenChat: saturn.onOpenChat,
      onRemove: saturn.onRemoveInstance,
      onSetDisplayName: saturn.onSetDisplayName,
      onSetFavorite: saturn.onSetFavorite
    })]
  });
}
var reactForChatState = G(_e());
var reactForChat = G(_e());
// applyChatEvent (minified: Zv) — Chat reducer: folds one streamed agent event into the chat's block list and returns the new list.
// Text and thinking append to the open block; a tool result fills in its tool call; nextId makes block ids.
function applyChatEvent(blocks, chatEvent, nextId) {
  let last = blocks[blocks.length - 1];
  switch (chatEvent.kind) {
    // Text joins the assistant block still streaming, else starts a new one.
    case "text":
      return last?.role === "assistant" && last.streaming ? [...blocks.slice(0, -1), {
        ...last,
        text: last.text + chatEvent.text
      }] : [...blocks, {
        id: nextId(),
        role: "assistant",
        text: chatEvent.text,
        streaming: !0
      }];
    case "thinking":
      return last?.role === "thinking" ? [...blocks.slice(0, -1), {
        ...last,
        text: last.text + chatEvent.text
      }] : [...blocks, {
        id: nextId(),
        role: "thinking",
        text: chatEvent.text
      }];
    case "tool":
      return [...blocks, {
        id: nextId(),
        role: "tool",
        name: chatEvent.name,
        callId: chatEvent.id,
        input: chatEvent.input,
        result: null,
        ok: null
      }];
    // Fills in the matching tool call; a result with no call shows as its own "result" block.
    case "toolResult":
      {
        let toolIndex = findOpenToolCall(blocks, chatEvent.id);
        if (toolIndex === -1) return [...blocks, {
          id: nextId(),
          role: "tool",
          name: "result",
          callId: chatEvent.id,
          input: null,
          result: chatEvent.text,
          ok: chatEvent.ok
        }];
        let toolBlock = blocks[toolIndex],
          updated = [...blocks];
        return updated[toolIndex] = {
          ...toolBlock,
          result: chatEvent.text,
          ok: chatEvent.ok
        }, updated;
      }
    case "notice":
      return [...blocks, {
        id: nextId(),
        role: "notice",
        text: chatEvent.text
      }];
    case "error":
      return [...blocks, {
        id: nextId(),
        role: "error",
        text: chatEvent.message
      }];
    // Usage with no numbers at all is dropped.
    case "usage":
      return chatEvent.inputTokens === null && chatEvent.outputTokens === null && chatEvent.costUsd === null ? blocks : [...blocks, {
        id: nextId(),
        role: "usage",
        inputTokens: chatEvent.inputTokens,
        outputTokens: chatEvent.outputTokens,
        costUsd: chatEvent.costUsd
      }];
    // Handled elsewhere: they don't change the block list.
    case "session":
    case "permission":
      return blocks;
  }
}
// findOpenToolCall (minified: VI) — Index of the tool call still waiting for its result: the one with callId, else the last unfinished one; -1 if none.
function findOpenToolCall(blocks, callId) {
  if (callId !== null) {
    let index = blocks.findIndex(block => block.role === "tool" && block.ok === null && block.callId === callId);
    if (index !== -1) return index;
  }
  for (let index = blocks.length - 1; index >= 0; index--) {
    let block = blocks[index];
    if (block.role === "tool" && block.ok === null) return index;
  }
  return -1;
}
// stopStreaming (minified: Kv) — Marks every streaming assistant block as finished (when a run ends).
function stopStreaming(blocks) {
  return blocks.map(block => block.role === "assistant" && block.streaming ? {
    ...block,
    streaming: !1
  } : block);
}
// groupChatBlocks (minified: Wv) — Turns the block list into display items: user / switch blocks stand alone; in each reply, thinking, tool calls and the
// assistant text before the last of them fold into one "process" item (live while the last reply is running); the rest show as answers / blocks.
function groupChatBlocks(blocks, running) {
  let items = [],
    pending = [],
    flush = isLastTurn => {
      let lastWorkIndex = -1;
      pending.forEach((block, index) => {
        (block.role === "thinking" || block.role === "tool") && (lastWorkIndex = index);
      });
      let isWork = (block, index) => block.role === "thinking" || block.role === "tool" || block.role === "assistant" && index < lastWorkIndex,
        workBlocks = pending.filter(isWork),
        placed = !1;
      pending.forEach((block, index) => {
        if (isWork(block, index)) {
          placed || (items.push({
            kind: "process",
            id: `work-${block.id}`,
            blocks: workBlocks,
            live: isLastTurn && running
          }), placed = !0);
          return;
        }
        items.push(block.role === "assistant" ? {
          kind: "answer",
          block: block
        } : {
          kind: "block",
          block: block
        });
      }), pending = [];
    };
  for (let block of blocks) block.role === "user" || block.role === "switch" ? (flush(!1), items.push({
    kind: "block",
    block: block
  })) : pending.push(block);
  return flush(!0), items;
}
// toolLabel (minified: Bp) — Readable label for a tool name: "mcp__server__tool_name" -> {label: "tool name", server}; the server prefix is dropped from the tool part. Other names are kept as they are.
function toolLabel(toolName) {
  let match = /^mcp__([^_]+(?:_[^_]+)*?)__(.+)$/.exec(toolName);
  if (!match) return {
    label: toolName,
    server: null
  };
  let server = match[1];
  return {
    label: (match[2].startsWith(`${server}_`) ? match[2].slice(server.length + 1) : match[2]).replace(/_/g, " "),
    server: server
  };
}
var reactForComposer = G(_e());
// jsxForComposer (minified: Ve) — jsx runtime for the chat composer. MAX_MESSAGE_CHARS (100,000) is the longest message it sends; a counter shows past 80% of it.
var jsxForComposer = G(oe()),
  MAX_MESSAGE_CHARS = 1e5;
// ChatComposer (minified: Jv) — Chat input box: a growing textarea (Enter sends, Shift+Enter new line), attachment chips, an attach button, the given toolbar controls,
// the Ask / Auto toggle (whether tool calls wait for approval) and Send / Stop. Calls onSend(text, autoApprove); files dropped or pasted are
// read as base64 and passed to onAttachData(name, base64, mimeType), up to maxAttachments. Disabled until a CLI is picked.
function ChatComposer({
  cli: cli,
  running: running,
  attachments: attachments,
  maxAttachments: maxAttachments,
  onSend: onSend,
  onCancel: onCancel,
  onPickAttachments: onPickAttachments,
  onAttachData: onAttachData,
  onRemoveAttachment: onRemoveAttachment,
  onOpenAttachment: onOpenAttachment,
  controls: controls,
  placeholder: placeholder
}) {
  let [text, setText] = (0, reactForComposer.useState)(""),
    [autoApprove, setAutoApprove] = (0, reactForComposer.useState)(!1),
    [dragging, setDragging] = (0, reactForComposer.useState)(!1),
    textareaRef = (0, reactForComposer.useRef)(null),
    atLimit = attachments.length >= maxAttachments,
    attachFile = (0, reactForComposer.useCallback)(file => {
      let reader = new FileReader();
      reader.onload = () => {
        let dataUrl = String(reader.result ?? ""),
          comma = dataUrl.indexOf(",");
        comma < 0 || onAttachData(file.name, dataUrl.slice(comma + 1), file.type || "");
      }, reader.readAsDataURL(file);
    }, [onAttachData]);
  // Grows the textarea with its text, up to 200 px.
  (0, reactForComposer.useEffect)(() => {
    let textarea = textareaRef.current;
    textarea && (textarea.style.height = "auto", textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`);
  }, [text]);
  let send = (0, reactForComposer.useCallback)(() => {
      let message = text.trim();
      // Sends only with text or attachments, while not running and with a CLI picked.
      message.length === 0 && attachments.length === 0 || running || !cli || (onSend(message.slice(0, MAX_MESSAGE_CHARS), autoApprove), setText(""));
    }, [text, running, cli, onSend, autoApprove, attachments.length]),
    noCli = !cli;
  return (0, jsxForComposer.jsx)("div", {
    className: "shrink-0 px-2 pb-2 pt-1.5",
    onDragOver: dragEvent => {
      noCli || atLimit || (dragEvent.preventDefault(), setDragging(!0));
    },
    onDragLeave: () => setDragging(!1),
    onDrop: dropEvent => {
      if (setDragging(!1), noCli || atLimit) return;
      let files = [...(dropEvent.dataTransfer?.files ?? [])];
      if (files.length !== 0) {
        dropEvent.preventDefault();
        for (let file of files.slice(0, maxAttachments - attachments.length)) attachFile(file);
      }
    },
    children: (0, jsxForComposer.jsxs)("div", {
      className: classNames("flex flex-col rounded-lg border border-border bg-input shadow-lg", "focus-within:border-[var(--vscode-focusBorder)]", dragging && "border-[var(--vscode-focusBorder)] border-dashed", noCli && "opacity-80"),
      children: [attachments.length > 0 && (0, jsxForComposer.jsxs)("div", {
        className: "flex flex-wrap gap-1.5 px-2 pt-2",
        children: [attachments.map(attachment => {
          let AttachmentIcon = attachment.error ? TriangleAlertIcon : attachment.kind === "image" ? ImageIcon : FileTextIcon;
          return (0, jsxForComposer.jsxs)("span", {
            className: classNames("flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[11px]", attachment.error ? "border-destructive text-destructive" : "border-border"),
            title: attachment.error ?? (attachment.kind === "image" ? `${attachment.size} \xB7 sent as a path for the agent to open` : attachment.inlined ? `${attachment.size} \xB7 ${attachment.truncated ? "beginning of the file" : "contents"} included in the message` : `${attachment.size} \xB7 too large to include, sent as a path`),
            children: [(0, jsxForComposer.jsx)(AttachmentIcon, {
              className: "h-3 w-3 shrink-0"
            }), (0, jsxForComposer.jsx)("button", {
              className: "max-w-[14rem] truncate cursor-pointer hover:underline bg-transparent border-0 p-0 text-inherit",
              title: "Open it, to check what is being sent",
              onClick: () => onOpenAttachment(attachment.id),
              children: attachment.name
            }), attachment.truncated && !attachment.error && (0, jsxForComposer.jsx)("span", {
              className: "text-muted-foreground",
              children: "part"
            }), (0, jsxForComposer.jsx)("button", {
              className: "cursor-pointer bg-transparent border-0 p-0 text-inherit opacity-70 hover:opacity-100",
              title: "Remove",
              onClick: () => onRemoveAttachment(attachment.id),
              children: (0, jsxForComposer.jsx)(XIcon, {
                className: "h-3 w-3"
              })
            })]
          }, attachment.id);
        }), !cli?.hasFileTools && attachments.some(attachment => attachment.kind === "image") && (0, jsxForComposer.jsxs)("span", {
          className: "text-[11px] text-muted-foreground",
          children: [cli?.label, " cannot open an image \u2014 it will say so rather than guess."]
        })]
      }), (0, jsxForComposer.jsx)("textarea", {
        ref: textareaRef,
        value: text,
        onChange: changeEvent => setText(changeEvent.target.value),
        onPaste: pasteEvent => {
          let files = [...(pasteEvent.clipboardData?.files ?? [])];
          if (!(files.length === 0 || atLimit)) {
            pasteEvent.preventDefault();
            for (let file of files.slice(0, maxAttachments - attachments.length)) attachFile(file);
          }
        },
        onKeyDown: keyEvent => {
          keyEvent.key === "Enter" && !keyEvent.shiftKey && (keyEvent.preventDefault(), send());
        },
        rows: 2,
        disabled: noCli,
        placeholder: noCli ? "Pick an AI CLI below to start" : running ? "Working\u2026 you can queue your next message" : placeholder ?? `Ask ${cli.label} about this instance`,
        className: classNames("w-full resize-none border-0 bg-transparent text-foreground", "px-3 pt-2.5 pb-1 text-sm leading-5 focus:outline-none", "disabled:cursor-not-allowed")
      }), (0, jsxForComposer.jsxs)("div", {
        className: "flex flex-wrap items-center gap-0.5 px-1.5 pb-1.5",
        children: [(0, jsxForComposer.jsx)(Button, {
          variant: "ghost",
          size: "icon",
          className: "h-6 w-6 shrink-0",
          title: atLimit ? `${maxAttachments} attachments is the limit for one message` : "Attach documents or images \u2014 you can also paste or drop them",
          disabled: noCli || atLimit,
          onClick: onPickAttachments,
          children: (0, jsxForComposer.jsx)(PlusIcon, {
            className: "h-3.5 w-3.5"
          })
        }), controls, (0, jsxForComposer.jsx)("span", {
          className: "flex-1"
        }), text.length > MAX_MESSAGE_CHARS * .8 && (0, jsxForComposer.jsxs)("span", {
          className: "text-[11px] text-muted-foreground font-mono px-1",
          children: [text.length.toLocaleString(), " / ", MAX_MESSAGE_CHARS.toLocaleString()]
        }), (0, jsxForComposer.jsxs)("button", {
          type: "button",
          "aria-pressed": autoApprove,
          onClick: () => setAutoApprove(!autoApprove),
          title: autoApprove ? "Act without asking: on. Tool calls run without waiting for you." : "Act without asking: off. Each tool call waits for you.",
          className: classNames("h-6 flex items-center gap-1 rounded-md border-0 px-1.5 text-[11px] cursor-pointer", "hover:bg-[var(--vscode-toolbar-hoverBackground)]", "bg-transparent", autoApprove ? "text-[var(--vscode-editorWarning-foreground)]" : "text-muted-foreground"),
          children: [(0, jsxForComposer.jsx)(ZapIcon, {
            className: "h-3 w-3"
          }), autoApprove ? "Auto" : "Ask"]
        }), running ? (0, jsxForComposer.jsx)(Button, {
          variant: "secondary",
          size: "icon",
          className: "h-7 w-7 shrink-0 rounded-md",
          title: "Stop",
          onClick: onCancel,
          children: (0, jsxForComposer.jsx)(SquareIcon, {
            className: "h-3.5 w-3.5"
          })
        }) : (0, jsxForComposer.jsx)(Button, {
          size: "icon",
          className: "h-7 w-7 shrink-0 rounded-md",
          title: "Send (Enter)",
          disabled: noCli || text.trim().length === 0 && attachments.length === 0,
          onClick: send,
          children: (0, jsxForComposer.jsx)(ArrowUpIcon, {
            className: "h-4 w-4"
          })
        })]
      })]
    })
  });
}
var reactForChatHeader = G(_e());
// jsxForChatHeader (minified: he) — jsx runtime for the chat header and toolbar pickers; TOOLBAR_SELECT_CLASSES styles their small <select>s / buttons.
var jsxForChatHeader = G(oe()),
  TOOLBAR_SELECT_CLASSES = "h-6 rounded-md border-0 bg-transparent text-foreground px-1 text-[11px] cursor-pointer hover:bg-[var(--vscode-toolbar-hoverBackground)] focus:outline-none focus:ring-1 focus:ring-ring";
// InstancePicker (minified: $v) — Toolbar <select> for which Saturn instance the conversation is about.
function InstancePicker({
  instances: instances,
  instanceId: instanceId,
  onSelectInstance: onSelectInstance
}) {
  return (0, jsxForChatHeader.jsxs)("select", {
    value: instanceId ?? "",
    onChange: changeEvent => onSelectInstance(changeEvent.target.value),
    title: "Which Saturn instance this conversation is about",
    className: classNames(TOOLBAR_SELECT_CLASSES, "max-w-[9rem] truncate"),
    children: [instances.length === 0 && (0, jsxForChatHeader.jsx)("option", {
      value: "",
      children: "No instances"
    }), instances.map(instance => (0, jsxForChatHeader.jsx)("option", {
      value: instance.id,
      children: instance.name
    }, instance.id))]
  });
}
// CliPicker (minified: eL) — Toolbar button showing the chosen AI CLI (and model); onSelectCli opens the CLI choice. Shows "Looking…" until the CLIs are detected.
function CliPicker({
  cli: cli,
  ready: ready,
  onSelectCli: onSelectCli
}) {
  return (0, jsxForChatHeader.jsxs)("button", {
    type: "button",
    onClick: onSelectCli,
    title: "Choose which AI CLI runs this conversation",
    className: classNames(TOOLBAR_SELECT_CLASSES, "flex items-center gap-1 max-w-[11rem]"),
    children: [(0, jsxForChatHeader.jsx)(SparklesIcon, {
      className: "h-3 w-3 shrink-0"
    }), (0, jsxForChatHeader.jsx)("span", {
      className: "truncate",
      children: ready ? cli ? `${cli.label}${cli.model ? ` \xB7 ${cli.model}` : ""}` : "Choose a CLI" : (0, jsxForChatHeader.jsx)("span", {
        className: "text-muted-foreground",
        children: "Looking\u2026"
      })
    })]
  });
}
// ProfilePicker (minified: tL) — Toolbar <select> for which agent profile to act as; hidden when there are no profiles.
function ProfilePicker({
  profiles: profiles,
  profileId: profileId,
  onSelectProfile: onSelectProfile
}) {
  return profiles.length === 0 ? null : (0, jsxForChatHeader.jsx)("select", {
    value: profileId,
    onChange: changeEvent => onSelectProfile(changeEvent.target.value),
    title: profiles.find(profile => profile.id === profileId)?.description ?? "Which agent to act as",
    className: TOOLBAR_SELECT_CLASSES,
    children: profiles.map(profile => (0, jsxForChatHeader.jsx)("option", {
      value: profile.id,
      children: profile.name
    }, profile.id))
  });
}
// ChatHeader (minified: aL) — Chat header: instance name (if showInstanceName), past-chats menu, New chat, Show system prompt and Edit instructions buttons;
// under it, what the agent is looking at (workflow › stage › action › command from focus) and notes when the CLI can't reach the instance or can't resume.
function ChatHeader({
  cli: cli,
  instanceName: instanceName,
  focus: focus,
  onNewThread: onNewThread,
  onShowPrompt: onShowPrompt,
  onEditInstructions: onEditInstructions,
  showInstanceName: showInstanceName,
  threads: threads,
  currentThread: currentThread,
  onLoadThread: onLoadThread,
  onOpenHistory: onOpenHistory,
  onRefreshThreads: onRefreshThreads
}) {
  let focusPath = focus ? [focus.workflowName, focus.stageLabel, focus.actionLabel, focus.commandName].filter(Boolean).join(" \u203A ") : null;
  return (0, jsxForChatHeader.jsxs)("header", {
    className: "shrink-0 border-b border-border px-3 py-1.5 flex flex-col gap-1",
    children: [(0, jsxForChatHeader.jsxs)("div", {
      className: "flex items-center gap-1 min-w-0",
      children: [showInstanceName && (0, jsxForChatHeader.jsx)("span", {
        className: "text-sm font-medium truncate",
        children: instanceName || "Saturn"
      }), (0, jsxForChatHeader.jsx)("span", {
        className: "flex-1"
      }), (0, jsxForChatHeader.jsx)(ThreadHistoryMenu, {
        threads: threads,
        currentThread: currentThread,
        onLoadThread: onLoadThread,
        onOpenHistory: onOpenHistory,
        onRefreshThreads: onRefreshThreads
      }), (0, jsxForChatHeader.jsx)(Button, {
        variant: "ghost",
        size: "icon",
        className: "h-6 w-6",
        title: "New chat \u2014 starts a new saved thread",
        onClick: onNewThread,
        children: (0, jsxForChatHeader.jsx)(MessageSquarePlusIcon, {
          className: "h-3.5 w-3.5"
        })
      }), (0, jsxForChatHeader.jsx)(Button, {
        variant: "ghost",
        size: "icon",
        className: "h-6 w-6",
        title: "Show the system prompt sent with every message",
        onClick: onShowPrompt,
        children: (0, jsxForChatHeader.jsx)(FileTextIcon, {
          className: "h-3.5 w-3.5"
        })
      }), (0, jsxForChatHeader.jsx)(Button, {
        variant: "ghost",
        size: "icon",
        className: "h-6 w-6",
        title: "Edit your own agent instructions",
        onClick: onEditInstructions,
        children: (0, jsxForChatHeader.jsx)(Settings2Icon, {
          className: "h-3.5 w-3.5"
        })
      })]
    }), focusPath && (0, jsxForChatHeader.jsxs)("p", {
      className: "m-0 text-[11px] text-muted-foreground truncate",
      children: ["Looking at ", (0, jsxForChatHeader.jsx)("span", {
        className: "text-foreground",
        children: focusPath
      })]
    }), cli && !cli.hasInstanceTools && (0, jsxForChatHeader.jsxs)("p", {
      className: "m-0 text-[11px] text-muted-foreground",
      children: ["Read-only: ", cli.label, " can read the context below and suggest changes, but can't reach this instance to apply them."]
    }), cli && !cli.canResume && (0, jsxForChatHeader.jsxs)("p", {
      className: "m-0 text-[11px] text-muted-foreground",
      children: [cli.label, " starts fresh each message \u2014 include what it needs to know."]
    })]
  });
}
// ThreadHistoryMenu (minified: XI) — "Past chats" dropdown: the instance's saved threads (preview, age, message count) and "Show the history folder".
// Refreshes the list on opening; closes on an outside click or Escape.
function ThreadHistoryMenu({
  threads: threads,
  currentThread: currentThread,
  onLoadThread: onLoadThread,
  onOpenHistory: onOpenHistory,
  onRefreshThreads: onRefreshThreads
}) {
  let [open, setOpen] = (0, reactForChatHeader.useState)(!1),
    menuRef = (0, reactForChatHeader.useRef)(null);
  return (0, reactForChatHeader.useEffect)(() => {
    if (!open) return;
    let onMouseDown = mouseEvent => {
        menuRef.current?.contains(mouseEvent.target) || setOpen(!1);
      },
      onKeyDown = keyEvent => {
        keyEvent.key === "Escape" && setOpen(!1);
      };
    return document.addEventListener("mousedown", onMouseDown), document.addEventListener("keydown", onKeyDown), () => {
      document.removeEventListener("mousedown", onMouseDown), document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]), (0, jsxForChatHeader.jsxs)("div", {
    ref: menuRef,
    className: "relative",
    children: [(0, jsxForChatHeader.jsx)(Button, {
      variant: "ghost",
      size: "icon",
      className: "h-6 w-6",
      title: "Past chats",
      onClick: () => {
        open || onRefreshThreads(), setOpen(!open);
      },
      children: (0, jsxForChatHeader.jsx)(RotateCcwClockIcon, {
        className: "h-3.5 w-3.5"
      })
    }), open && (0, jsxForChatHeader.jsxs)("div", {
      className: "absolute right-0 top-7 z-20 w-72 max-h-80 overflow-y-auto rounded-md border border-border bg-card shadow-lg py-1",
      children: [threads.length === 0 ? (0, jsxForChatHeader.jsx)("p", {
        className: "m-0 px-3 py-2 text-xs text-muted-foreground",
        children: "No saved chats for this instance yet."
      }) : threads.map(thread => (0, jsxForChatHeader.jsxs)("button", {
        type: "button",
        onClick: () => {
          onLoadThread(thread.threadId), setOpen(!1);
        },
        className: classNames("w-full text-left bg-transparent border-none cursor-pointer px-3 py-1.5", "hover:opacity-80", thread.threadId === currentThread && "bg-input"),
        children: [(0, jsxForChatHeader.jsx)("span", {
          className: "block text-xs text-foreground truncate",
          children: thread.preview
        }), (0, jsxForChatHeader.jsxs)("span", {
          className: "block text-[10px] text-muted-foreground",
          children: [timeAgo(thread.updatedAt), " \xB7 ", thread.messageCount, " message", thread.messageCount === 1 ? "" : "s"]
        })]
      }, thread.threadId)), (0, jsxForChatHeader.jsx)("div", {
        className: "border-t border-border mt-1 pt-1",
        children: (0, jsxForChatHeader.jsxs)("button", {
          type: "button",
          onClick: () => {
            onOpenHistory(), setOpen(!1);
          },
          className: "w-full flex items-center gap-1.5 text-left bg-transparent border-none cursor-pointer px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground",
          children: [(0, jsxForChatHeader.jsx)(FolderOpenIcon, {
            className: "h-3 w-3"
          }), "Show the history folder"]
        })
      })]
    })]
  });
}
// timeAgo (minified: jI) — Short relative time ("just now", "5m ago", "3h ago", "2d ago"), else the date; "unknown" for an unparseable date.
function timeAgo(date) {
  let time = new Date(date).getTime();
  if (Number.isNaN(time)) return "unknown";
  let minutes = Math.round((Date.now() - time) / 6e4);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  let hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  let days = Math.round(hours / 24);
  return days <= 7 ? `${days}d ago` : new Date(date).toLocaleDateString();
}
var reactForTaskBoard = G(_e());
// jsxForTaskBoard (minified: re) — jsx runtime for the task board. TASK_STATUS_ICONS / TASK_STATUS_COLOURS give each task status (todo, running, blocked, done, failed) its icon and text colour.
var jsxForTaskBoard = G(oe()),
  TASK_STATUS_ICONS = {
    todo: CircleDashedIcon,
    running: PlayIcon,
    blocked: TriangleAlertIcon,
    done: CircleCheckIcon,
    failed: CircleXIcon
  },
  TASK_STATUS_COLOURS = {
    todo: "text-muted-foreground",
    running: "text-primary",
    blocked: "text-amber-500",
    done: "text-muted-foreground",
    failed: "text-destructive"
  };
// TaskBoard (minified: nL) — Collapsible task list of the agent's plan: each task's status, agent profile, attempts, skills, dependencies, result and review,
// with Run (as its profile) and Mark done; "Run next" for the ready task (nextId); an add row (title, profile, skills switched on for that task).
// Calls onAdd(title, profileId, skillIds), onRun(id), onRunNext(), onUpdate(id, changes); blocked is why nothing can run.
function TaskBoard({
  tasks: tasks,
  profiles: profiles,
  nextId: nextId,
  blocked: blocked,
  activeProfileId: activeProfileId,
  skills: skills,
  running: running,
  onAdd: onAdd,
  onRun: onRun,
  onRunNext: onRunNext,
  onUpdate: onUpdate,
  floating = !1
}) {
  let [newTitle, setNewTitle] = (0, reactForTaskBoard.useState)(""),
    [newProfileId, setNewProfileId] = (0, reactForTaskBoard.useState)(activeProfileId),
    [newSkillIds, setNewSkillIds] = (0, reactForTaskBoard.useState)([]),
    [skillsOpen, setSkillsOpen] = (0, reactForTaskBoard.useState)(!1),
    [expanded, setExpanded] = (0, reactForTaskBoard.useState)(!1),
    previousCount = (0, reactForTaskBoard.useRef)(0);
  // Opens itself when the first tasks arrive or one is running.
  (0, reactForTaskBoard.useEffect)(() => {
    let anyRunning = tasks.some(task => task.status === "running");
    (previousCount.current === 0 && tasks.length > 0 || anyRunning) && setExpanded(!0), previousCount.current = tasks.length;
  }, [tasks]);
  let profileName = profileId => profiles.find(profile => profile.id === profileId)?.name ?? profileId,
    addTask = () => {
      let title = newTitle.trim();
      title.length !== 0 && (onAdd(title, newProfileId, newSkillIds), setNewTitle(""), setSkillsOpen(!1));
    },
    openTasks = tasks.filter(task => task.status !== "done"),
    runningTask = tasks.find(task => task.status === "running");
  return (0, jsxForTaskBoard.jsxs)("div", {
    className: classNames("flex flex-col", !floating && "border-t border-border"),
    children: [(0, jsxForTaskBoard.jsxs)("div", {
      className: "flex items-center gap-1 px-2 py-1",
      children: [(0, jsxForTaskBoard.jsxs)("button", {
        type: "button",
        onClick: () => setExpanded(wasExpanded => !wasExpanded),
        title: expanded ? "Hide tasks" : "Show tasks",
        className: "flex items-center gap-1 rounded px-1 py-0.5 text-[11px] text-muted-foreground hover:text-foreground cursor-pointer bg-transparent border-0",
        children: [expanded ? (0, jsxForTaskBoard.jsx)(ChevronDownIcon, {
          className: "h-3 w-3"
        }) : (0, jsxForTaskBoard.jsx)(ChevronRightIcon, {
          className: "h-3 w-3"
        }), "Tasks", tasks.length > 0 && (0, jsxForTaskBoard.jsx)("span", {
          className: "text-foreground",
          children: runningTask ? runningTask.title : `${openTasks.length} open`
        })]
      }), (0, jsxForTaskBoard.jsx)("span", {
        className: "flex-1"
      }), nextId && (0, jsxForTaskBoard.jsxs)(Button, {
        variant: "ghost",
        size: "sm",
        className: "h-6 gap-1 px-1.5 text-[11px]",
        disabled: running,
        title: "Run the next task that is ready",
        onClick: onRunNext,
        children: [(0, jsxForTaskBoard.jsx)(PlayIcon, {
          className: "h-3 w-3"
        }), "Run next"]
      }), blocked && !nextId && tasks.length > 0 && (0, jsxForTaskBoard.jsx)("span", {
        className: "text-[11px] text-amber-500 truncate max-w-[10rem]",
        title: blocked,
        children: "waiting"
      }), (0, jsxForTaskBoard.jsx)(Button, {
        variant: "ghost",
        size: "icon",
        className: "h-6 w-6",
        title: "Add a task",
        onClick: () => setExpanded(!0),
        children: (0, jsxForTaskBoard.jsx)(PlusIcon, {
          className: "h-3.5 w-3.5"
        })
      })]
    }), expanded ? (0, jsxForTaskBoard.jsxs)("div", {
      className: "flex flex-col gap-2 px-2 pb-2 max-h-[40vh] overflow-y-auto",
      children: [tasks.length === 0 && (0, jsxForTaskBoard.jsx)("p", {
        className: "m-0 text-[11px] text-muted-foreground",
        children: "Ask the agent to plan something, or add one \u2014 each task runs as the agent you pick for it."
      }), blocked && tasks.length > 0 && (0, jsxForTaskBoard.jsx)("p", {
        className: "m-0 text-[11px] text-amber-500",
        children: blocked
      }), tasks.map(task => {
        let StatusIcon = TASK_STATUS_ICONS[task.status];
        return (0, jsxForTaskBoard.jsxs)("div", {
          className: classNames("rounded-md border px-2 py-1.5 flex items-start gap-2", task.id === nextId ? "border-primary" : "border-border"),
          children: [(0, jsxForTaskBoard.jsx)(StatusIcon, {
            className: classNames("h-3.5 w-3.5 mt-0.5 shrink-0", TASK_STATUS_COLOURS[task.status])
          }), (0, jsxForTaskBoard.jsxs)("div", {
            className: "min-w-0 flex-1",
            children: [(0, jsxForTaskBoard.jsx)("p", {
              className: classNames("m-0 text-xs", task.status === "done" ? "text-muted-foreground line-through" : "text-foreground"),
              children: task.title
            }), (0, jsxForTaskBoard.jsxs)("p", {
              className: "m-0 text-[10px] text-muted-foreground",
              children: [task.worker ? `${task.worker} \xB7 ` : "", profileName(task.profileId), (task.attempts ?? 0) > 1 && ` \xB7 attempt ${task.attempts}`, task.skillIds.length > 0 && ` \xB7 ${task.skillIds.map(skillId => skills.find(skill => skill.id === skillId)?.name ?? skillId).join(", ")}`, task.dependsOn.length > 0 && ` \xB7 after ${task.dependsOn.join(", ")}`, task.createdBy === "agent" && " \xB7 planned by the agent", task.worker && " \xB7 from a team plan"]
            }), task.result && (0, jsxForTaskBoard.jsx)("p", {
              className: "m-0 text-[10px] text-muted-foreground line-clamp-3",
              title: task.result,
              children: task.result
            }), task.review && task.status !== "done" && (0, jsxForTaskBoard.jsxs)("p", {
              className: "m-0 text-[10px] text-amber-500 line-clamp-2",
              title: task.review,
              children: ["Review: ", task.review]
            })]
          }), task.status !== "done" && (0, jsxForTaskBoard.jsx)(Button, {
            variant: "ghost",
            size: "icon",
            className: "h-6 w-6 shrink-0",
            title: `Run as ${profileName(task.profileId)}`,
            disabled: running,
            onClick: () => onRun(task.id),
            children: (0, jsxForTaskBoard.jsx)(PlayIcon, {
              className: "h-3 w-3"
            })
          }), task.status !== "done" && (0, jsxForTaskBoard.jsx)(Button, {
            variant: "ghost",
            size: "icon",
            className: "h-6 w-6 shrink-0",
            title: "Mark done",
            onClick: () => onUpdate(task.id, {
              status: "done"
            }),
            children: (0, jsxForTaskBoard.jsx)(CircleCheckIcon, {
              className: "h-3 w-3"
            })
          })]
        }, task.id);
      }), (0, jsxForTaskBoard.jsxs)("div", {
        className: "flex items-center gap-1.5",
        children: [(0, jsxForTaskBoard.jsx)(Input, {
          value: newTitle,
          placeholder: "Add a task",
          className: "h-7 text-xs",
          onChange: changeEvent => setNewTitle(changeEvent.target.value),
          onKeyDown: keyEvent => {
            keyEvent.key === "Enter" && addTask();
          }
        }), (0, jsxForTaskBoard.jsx)("select", {
          value: newProfileId,
          onChange: changeEvent => setNewProfileId(changeEvent.target.value),
          title: "Which agent runs it",
          className: "h-7 rounded-md border border-border bg-input text-foreground px-1.5 text-[11px] focus:outline-none focus:ring-1 focus:ring-ring",
          children: profiles.map(profile => (0, jsxForTaskBoard.jsx)("option", {
            value: profile.id,
            children: profile.name
          }, profile.id))
        }), skills.length > 0 && (0, jsxForTaskBoard.jsx)(Button, {
          variant: newSkillIds.length > 0 ? "secondary" : "ghost",
          size: "icon",
          className: "h-7 w-7 shrink-0",
          title: newSkillIds.length > 0 ? `${newSkillIds.length} skill${newSkillIds.length === 1 ? "" : "s"} for this task` : "Pick skills for this task",
          onClick: () => setSkillsOpen(wasOpen => !wasOpen),
          children: (0, jsxForTaskBoard.jsx)(SparklesIcon, {
            className: "h-3.5 w-3.5"
          })
        }), (0, jsxForTaskBoard.jsx)(Button, {
          variant: "ghost",
          size: "icon",
          className: "h-7 w-7 shrink-0",
          title: "Add",
          disabled: newTitle.trim().length === 0,
          onClick: addTask,
          children: (0, jsxForTaskBoard.jsx)(PlusIcon, {
            className: "h-3.5 w-3.5"
          })
        })]
      }), skillsOpen && (0, jsxForTaskBoard.jsxs)("div", {
        className: "flex flex-col gap-1 rounded-md border border-border p-1.5",
        children: [(0, jsxForTaskBoard.jsx)("p", {
          className: "m-0 text-[10px] text-muted-foreground",
          children: "Switched on while this task runs, whether or not they are on globally."
        }), skills.map(skill => (0, jsxForTaskBoard.jsxs)("label", {
          className: "flex items-center gap-1.5 text-[11px] cursor-pointer",
          children: [(0, jsxForTaskBoard.jsx)("input", {
            type: "checkbox",
            checked: newSkillIds.includes(skill.id),
            onChange: changeEvent => setNewSkillIds(selected => changeEvent.target.checked ? [...selected, skill.id] : selected.filter(id => id !== skill.id))
          }), (0, jsxForTaskBoard.jsx)("span", {
            className: "truncate",
            children: skill.name
          })]
        }, skill.id))]
      })]
    }) : null]
  });
}
var reactForTeams = G(_e());
// newTeam (minified: rL) — A new team's defaults: an "explain" supervisor and one "act" builder on the given CLI / model, no reviewer, plan approval required.
function newTeam(id, cliId, model) {
  return {
    id: id,
    name: "New team",
    supervisor: {
      cliId: cliId,
      model: model,
      profileId: "explain"
    },
    workers: [{
      name: "builder",
      description: "Makes the change: edits files and the instance.",
      cliId: cliId,
      model: model,
      profileId: "act"
    }],
    reviewer: null,
    requirePlanApproval: !0,
    maxTurns: 12,
    maxAttempts: 2,
    parallel: !1,
    maxParallel: 3
  };
}
// teamSlug (minified: js) — Lower-case id from a name: runs of other characters become "-", trimmed, at most 40 characters.
function teamSlug(text) {
  return text.trim().toLowerCase().replace(/[^a-z0-9_-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40);
}
// teamProblems (minified: lL) — Problems that stop a team being saved (names, CLIs, profiles, limits), as messages; available ({clis, profiles} Sets) is checked when given.
function teamProblems(team, available) {
  let problems = [];
  team.name.trim() || problems.push("The team needs a name."), team.workers.length === 0 && problems.push("A team needs at least one worker.");
  let workerNames = team.workers.map(worker => worker.name);
  workerNames.some(workerName => !workerName) && problems.push("Every worker needs a name."), new Set(workerNames).size !== workerNames.length && problems.push("Two workers have the same name.");
  let members = [["Supervisor", team.supervisor], ["Reviewer", team.reviewer], ...team.workers.map(worker => [`Worker "${worker.name || "?"}"`, worker])];
  for (let [role, member] of members) member && (member.cliId ? available && !available.clis.has(member.cliId) && problems.push(`${role}: ${member.cliId} is not an available CLI.`) : problems.push(`${role}: choose a CLI.`), available && !available.profiles.has(member.profileId) && problems.push(`${role}: unknown agent profile ${member.profileId}.`));
  return team.maxTurns >= 2 && team.maxTurns <= 100 || problems.push("Turns per run must be between 2 and 100."), team.maxAttempts >= 1 && team.maxAttempts <= 5 || problems.push("Attempts per task must be between 1 and 5."), team.parallel && !(team.maxParallel >= 2 && team.maxParallel <= 6) && problems.push("Tasks at once must be between 2 and 6."), problems;
}
// jsxForTeams (minified: E) — jsx runtime for the agent teams UI. MANAGE_TEAMS_OPTION is the picker's "Manage teams…" entry value.
var jsxForTeams = G(oe()),
  MANAGE_TEAMS_OPTION = "__manage__";
// TeamPicker (minified: iL) — Toolbar <select>: send to a single agent or to one of the teams; the "Manage teams…" entry calls onManage instead of selecting.
function TeamPicker({
  teams: teams,
  teamId: teamId,
  disabled: disabled,
  onSelect: onSelect,
  onManage: onManage
}) {
  return (0, jsxForTeams.jsxs)("select", {
    value: teamId ?? "",
    disabled: disabled,
    onChange: changeEvent => {
      let value = changeEvent.target.value;
      // The "Manage teams…" entry opens the editor; it is never selected.
      if (value === MANAGE_TEAMS_OPTION) {
        onManage();
        return;
      }
      onSelect(value || null);
    },
    title: "Send to one agent, or to a team: a supervisor that plans, workers, and a reviewer",
    className: TOOLBAR_SELECT_CLASSES,
    children: [(0, jsxForTeams.jsx)("option", {
      value: "",
      children: "Single agent"
    }), teams.map(team => (0, jsxForTeams.jsxs)("option", {
      value: team.id,
      children: ["Team \xB7 ", team.name]
    }, team.id)), (0, jsxForTeams.jsx)("option", {
      value: MANAGE_TEAMS_OPTION,
      children: "Manage teams\u2026"
    })]
  });
}
// TeamRunBanner (minified: uL) — Banner for a team run: planning, the plan awaiting approval (its tasks, Run plan / Discard), or working (turn count, tasks now running, Stop all).
function TeamRunBanner({
  run: run,
  onRun: onRun,
  onDiscard: onDiscard,
  onStop: onStop
}) {
  return (0, jsxForTeams.jsxs)("div", {
    className: "mx-2 rounded-lg border border-border bg-[var(--vscode-editor-background)] shadow-lg px-3 py-2 text-xs flex flex-col gap-1.5",
    children: [(0, jsxForTeams.jsxs)("div", {
      className: "flex items-center gap-2",
      children: [(0, jsxForTeams.jsx)(UsersIcon, {
        className: "h-3.5 w-3.5 shrink-0"
      }), (0, jsxForTeams.jsx)("span", {
        className: "font-medium",
        children: run.teamName
      }), (0, jsxForTeams.jsx)("span", {
        className: "text-muted-foreground",
        children: run.phase === "planning" ? "The supervisor is planning\u2026" : run.phase === "awaiting" ? `Plan ready \u2014 ${run.plan.length} task${run.plan.length === 1 ? "" : "s"}` : `Working${run.parallel > 1 ? ` \xB7 up to ${run.parallel} at once` : ""} \xB7 turn ${run.turns} of ${run.maxTurns}`
      }), (0, jsxForTeams.jsx)("span", {
        className: "flex-1"
      }), run.phase === "awaiting" ? (0, jsxForTeams.jsxs)(jsxForTeams.Fragment, {
        children: [(0, jsxForTeams.jsxs)(Button, {
          size: "sm",
          className: "h-6 gap-1 text-[11px]",
          onClick: onRun,
          children: [(0, jsxForTeams.jsx)(PlayIcon, {
            className: "h-3 w-3"
          }), " Run plan"]
        }), (0, jsxForTeams.jsx)(Button, {
          size: "sm",
          variant: "ghost",
          className: "h-6 text-[11px]",
          onClick: onDiscard,
          children: "Discard"
        })]
      }) : (0, jsxForTeams.jsxs)(Button, {
        size: "sm",
        variant: "ghost",
        className: "h-6 gap-1 text-[11px]",
        onClick: onStop,
        title: "Stop the turn in flight, and everything after it",
        children: [(0, jsxForTeams.jsx)(SquareIcon, {
          className: "h-3 w-3"
        }), " Stop all"]
      })]
    }), run.phase === "running" && run.active.length > 0 && (0, jsxForTeams.jsxs)("p", {
      className: "m-0 text-muted-foreground truncate",
      title: run.active.join(`
`),
      children: ["Now: ", run.active.join(" \xB7 ")]
    }), run.phase === "awaiting" && (0, jsxForTeams.jsx)("ol", {
      className: "m-0 pl-5 flex flex-col gap-0.5 max-h-40 overflow-y-auto",
      children: run.plan.map(planTask => (0, jsxForTeams.jsxs)("li", {
        children: [planTask.title, (0, jsxForTeams.jsxs)("span", {
          className: "text-muted-foreground",
          children: [" ", "\xB7 ", planTask.worker, planTask.dependsOn.length > 0 && ` \xB7 after ${planTask.dependsOn.join(", ")}`]
        })]
      }, planTask.key))
    })]
  });
}
// TEAM_FIELD_CLASSES (minified: mn) — Classes for the inputs and selects in the teams editor.
var TEAM_FIELD_CLASSES = "h-7 rounded-md border border-input bg-[var(--vscode-input-background)] text-foreground px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring";
// TeamField (minified: Gi) — Labelled field for the teams editor: small uppercase label, the control, an optional hint under it.
function TeamField({
  label: label,
  hint: hint,
  children: children,
  className: className
}) {
  return (0, jsxForTeams.jsxs)("label", {
    className: classNames("flex flex-col gap-0.5 min-w-0", className),
    children: [(0, jsxForTeams.jsx)("span", {
      className: "text-[10px] uppercase tracking-wider text-muted-foreground",
      children: label
    }), children, hint && (0, jsxForTeams.jsx)("span", {
      className: "text-[10px] text-muted-foreground leading-snug",
      children: hint
    })]
  });
}
// AgentBindingFields (minified: Rp) — CLI / Model / Permissions (agent profile) selects for one team member (supervisor, worker or reviewer); onChange gets the whole new binding.
// Picking a CLI also picks its first model; unavailable CLIs are listed but disabled; a stored value not in the lists is still shown.
function AgentBindingFields({
  binding: binding,
  clis: clis,
  profiles: profiles,
  onChange: onChange
}) {
  let cli = clis.find(cliOption => cliOption.id === binding.cliId),
    models = cli?.models ?? [],
    profile = profiles.find(profileOption => profileOption.id === binding.profileId);
  return (0, jsxForTeams.jsxs)("div", {
    className: "grid grid-cols-3 gap-1.5 items-start",
    children: [(0, jsxForTeams.jsx)(TeamField, {
      label: "CLI",
      children: (0, jsxForTeams.jsxs)("select", {
        className: TEAM_FIELD_CLASSES,
        value: binding.cliId,
        onChange: changeEvent => {
          let picked = clis.find(cliOption => cliOption.id === changeEvent.target.value);
          onChange({
            ...binding,
            cliId: changeEvent.target.value,
            model: picked?.models[0] ?? null
          });
        },
        children: [!cli && (0, jsxForTeams.jsx)("option", {
          value: binding.cliId,
          children: binding.cliId || "Choose a CLI"
        }), clis.map(cliOption => (0, jsxForTeams.jsxs)("option", {
          value: cliOption.id,
          disabled: !cliOption.available,
          children: [cliOption.label, cliOption.available ? "" : " (not set up)"]
        }, cliOption.id))]
      })
    }), (0, jsxForTeams.jsx)(TeamField, {
      label: "Model",
      children: (0, jsxForTeams.jsxs)("select", {
        className: TEAM_FIELD_CLASSES,
        value: binding.model ?? "",
        onChange: changeEvent => onChange({
          ...binding,
          model: changeEvent.target.value || null
        }),
        children: [(0, jsxForTeams.jsx)("option", {
          value: "",
          children: "CLI default"
        }), binding.model && !models.includes(binding.model) && (0, jsxForTeams.jsx)("option", {
          value: binding.model,
          children: binding.model
        }), models.map(modelName => (0, jsxForTeams.jsx)("option", {
          value: modelName,
          children: modelName
        }, modelName))]
      })
    }), (0, jsxForTeams.jsx)(TeamField, {
      label: "Permissions",
      hint: profile?.description,
      children: (0, jsxForTeams.jsx)("select", {
        className: TEAM_FIELD_CLASSES,
        value: binding.profileId,
        onChange: changeEvent => onChange({
          ...binding,
          profileId: changeEvent.target.value
        }),
        children: profiles.map(profileOption => (0, jsxForTeams.jsx)("option", {
          value: profileOption.id,
          children: profileOption.name
        }, profileOption.id))
      })
    })]
  });
}
// WORKER_PRESETS (minified: ZI) — Ready-made workers offered when adding one to a team.
var WORKER_PRESETS = [{
  name: "builder",
  description: "Makes the change: edits files and the instance.",
  profileId: "act"
}, {
  name: "researcher",
  description: "Reads the code and the instance to answer questions. Changes nothing.",
  profileId: "explain"
}, {
  name: "tester",
  description: "Runs the tests and checks the change works, and reports what fails.",
  profileId: "act"
}];
// TeamSection (minified: Ys) — Titled section of the teams editor with a hint line and an optional action at the right of the title.
function TeamSection({
  title: title,
  hint: hint,
  children: children,
  action: action
}) {
  return (0, jsxForTeams.jsxs)("section", {
    className: "flex flex-col gap-1.5",
    children: [(0, jsxForTeams.jsxs)("div", {
      className: "flex items-center gap-2",
      children: [(0, jsxForTeams.jsx)("h3", {
        className: "m-0 text-xs font-medium",
        children: title
      }), (0, jsxForTeams.jsx)("span", {
        className: "flex-1"
      }), action]
    }), (0, jsxForTeams.jsx)("p", {
      className: "m-0 text-[11px] text-muted-foreground",
      children: hint
    }), children]
  });
}
// WorkerEditor (minified: KI) — Editor for one worker: name (shown as typed while editing, saved as its slug; a hint shows the slug plans will use),
// what it does (read by the supervisor to assign tasks), remove button, and its CLI / model / profile.
function WorkerEditor({
  worker: worker,
  clis: clis,
  profiles: profiles,
  canRemove: canRemove,
  onChange: onChange,
  onRemove: onRemove
}) {
  let [nameDraft, setNameDraft] = (0, reactForTeams.useState)(worker.name),
    [editingName, setEditingName] = (0, reactForTeams.useState)(!1),
    shownName = editingName ? nameDraft : worker.name,
    slug = teamSlug(nameDraft);
  return (0, jsxForTeams.jsxs)("div", {
    className: "rounded-md border border-border p-2 flex flex-col gap-2",
    children: [(0, jsxForTeams.jsxs)("div", {
      className: "grid grid-cols-[10rem_1fr_auto] gap-1.5 items-start",
      children: [(0, jsxForTeams.jsx)(TeamField, {
        label: "Name",
        hint: editingName && nameDraft && slug !== nameDraft ? `Plans call it ${slug || "\u2026"}` : "How the plan refers to it",
        children: (0, jsxForTeams.jsx)("input", {
          className: classNames(TEAM_FIELD_CLASSES, "font-mono"),
          value: shownName,
          placeholder: "builder",
          spellCheck: !1,
          onFocus: () => {
            setNameDraft(worker.name), setEditingName(!0);
          },
          onChange: changeEvent => {
            setNameDraft(changeEvent.target.value), onChange({
              name: teamSlug(changeEvent.target.value)
            });
          },
          onBlur: () => {
            setEditingName(!1), setNameDraft(teamSlug(nameDraft));
          }
        })
      }), (0, jsxForTeams.jsx)(TeamField, {
        label: "What it does",
        hint: "The supervisor reads this to decide who gets each task",
        children: (0, jsxForTeams.jsx)("input", {
          className: TEAM_FIELD_CLASSES,
          value: worker.description,
          placeholder: "e.g. Writes and edits Vue components",
          onChange: changeEvent => onChange({
            description: changeEvent.target.value
          })
        })
      }), (0, jsxForTeams.jsx)(Button, {
        variant: "ghost",
        size: "icon",
        className: "h-7 w-7 mt-3.5 shrink-0",
        title: canRemove ? "Remove this worker" : "A team needs at least one worker",
        disabled: !canRemove,
        onClick: onRemove,
        children: (0, jsxForTeams.jsx)(Trash2Icon, {
          className: "h-3.5 w-3.5"
        })
      })]
    }), (0, jsxForTeams.jsx)(AgentBindingFields, {
      binding: worker,
      clis: clis,
      profiles: profiles,
      onChange: binding => onChange(binding)
    })]
  });
}
// TeamsEditor (minified: sL) — Agent teams dialog: team list on the left, and the picked team's draft: name, supervisor, workers (up to 8, from presets or blank),
// optional reviewer, run order (in order / parallel), plan approval, turn and attempt limits. Shows problems (its own and those
// passed in) and disables Save while it has its own; calls onSave(team), onDelete(id), onClose().
// It edits a copy of the team, so nothing changes until Save; a new worker starts on the same CLI / model as the last one.
function TeamsEditor({
  teams: teams,
  clis: clis,
  profiles: profiles,
  problems: problems,
  initialId: initialId,
  onSave: onSave,
  onDelete: onDelete,
  onClose: onClose
}) {
  let defaultCli = clis.find(cli => cli.available) ?? clis[0],
    copyOfTeam = teamId => {
      let team = teams.find(candidate => candidate.id === teamId);
      return team ? structuredClone(team) : null;
    },
    [draft, setDraft] = (0, reactForTeams.useState)(() => copyOfTeam(initialId ?? teams[0]?.id ?? null)),
    startNewTeam = () => {
      let newId = `team-${Date.now().toString(36)}`;
      setDraft(newTeam(newId, defaultCli?.id ?? "", defaultCli?.models[0] ?? null));
    },
    available = {
      clis: new Set(clis.filter(cli => cli.available).map(cli => cli.id)),
      profiles: new Set(profiles.map(profile => profile.id))
    },
    draftProblems = draft ? teamProblems(draft, available) : [],
    updateDraft = changes => setDraft(current => current && {
      ...current,
      ...changes
    }),
    addWorker = worker => setDraft(current => {
      if (!current) return current;
      let lastWorker = current.workers[current.workers.length - 1];
      return {
        ...current,
        workers: [...current.workers, {
          cliId: lastWorker?.cliId ?? defaultCli?.id ?? "",
          model: lastWorker?.model ?? defaultCli?.models[0] ?? null,
          ...worker
        }]
      };
    }),
    updateWorker = (workerIndex, changes) => setDraft(current => current && {
      ...current,
      workers: current.workers.map((worker, index) => index === workerIndex ? {
        ...worker,
        ...changes
      } : worker)
    });
  return (0, jsxForTeams.jsx)("div", {
    className: "fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4",
    onClick: onClose,
    children: (0, jsxForTeams.jsxs)("div", {
      className: "w-full max-w-2xl max-h-full overflow-hidden rounded-lg border border-border bg-[var(--vscode-editor-background)] shadow-xl flex",
      onClick: clickEvent => clickEvent.stopPropagation(),
      children: [(0, jsxForTeams.jsxs)("aside", {
        className: "w-44 shrink-0 border-r border-border p-2 flex flex-col gap-1 overflow-y-auto",
        children: [(0, jsxForTeams.jsx)("p", {
          className: "m-0 px-1 text-[11px] uppercase tracking-wider text-muted-foreground",
          children: "Teams"
        }), teams.map(team => (0, jsxForTeams.jsx)("button", {
          type: "button",
          onClick: () => setDraft(copyOfTeam(team.id)),
          className: classNames("text-left rounded px-2 py-1 text-xs truncate hover:bg-[var(--vscode-list-hoverBackground)]", draft?.id === team.id && "bg-[var(--vscode-list-activeSelectionBackground)] text-[var(--vscode-list-activeSelectionForeground)]"),
          children: team.name
        }, team.id)), (0, jsxForTeams.jsxs)(Button, {
          variant: "ghost",
          size: "sm",
          className: "h-7 justify-start gap-1 text-xs",
          onClick: startNewTeam,
          children: [(0, jsxForTeams.jsx)(PlusIcon, {
            className: "h-3.5 w-3.5"
          }), " New team"]
        })]
      }), (0, jsxForTeams.jsxs)("div", {
        className: "flex-1 min-w-0 flex flex-col",
        children: [(0, jsxForTeams.jsxs)("div", {
          className: "flex items-center gap-2 border-b border-border px-3 py-2",
          children: [(0, jsxForTeams.jsx)(UsersIcon, {
            className: "h-4 w-4"
          }), (0, jsxForTeams.jsx)("span", {
            className: "text-sm font-medium flex-1",
            children: "Agent teams"
          }), (0, jsxForTeams.jsx)(Button, {
            variant: "ghost",
            size: "icon",
            className: "h-6 w-6",
            onClick: onClose,
            title: "Close",
            children: (0, jsxForTeams.jsx)(XIcon, {
              className: "h-4 w-4"
            })
          })]
        }), draft ? (0, jsxForTeams.jsxs)("div", {
          className: "flex-1 overflow-y-auto p-3 flex flex-col gap-4",
          children: [(0, jsxForTeams.jsx)("input", {
            className: classNames(TEAM_FIELD_CLASSES, "h-8 text-sm"),
            value: draft.name,
            placeholder: "Team name",
            onChange: changeEvent => updateDraft({
              name: changeEvent.target.value
            })
          }), (0, jsxForTeams.jsx)(TeamSection, {
            title: "Supervisor",
            hint: "Breaks the request into tasks and assigns each to a worker. Reports at the end.",
            children: (0, jsxForTeams.jsx)(AgentBindingFields, {
              binding: draft.supervisor,
              clis: clis,
              profiles: profiles,
              onChange: binding => updateDraft({
                supervisor: binding
              })
            })
          }), (0, jsxForTeams.jsxs)(TeamSection, {
            title: "Workers",
            hint: "Each task goes to one worker. The supervisor picks by name and description; what the worker may do is set here, not by the supervisor.",
            children: [draft.workers.map((worker, workerIndex) => (0, jsxForTeams.jsx)(WorkerEditor, {
              worker: worker,
              clis: clis,
              profiles: profiles,
              canRemove: draft.workers.length > 1,
              onChange: changes => updateWorker(workerIndex, changes),
              onRemove: () => updateDraft({
                workers: draft.workers.filter((worker, index) => index !== workerIndex)
              })
            }, workerIndex)), draft.workers.length < 8 && (0, jsxForTeams.jsxs)("div", {
              className: "flex flex-wrap items-center gap-1 text-[11px] text-muted-foreground",
              children: ["Add:", WORKER_PRESETS.filter(preset => !draft.workers.some(worker => worker.name === preset.name)).map(preset => (0, jsxForTeams.jsxs)(Button, {
                variant: "ghost",
                size: "sm",
                className: "h-6 gap-1 text-[11px]",
                title: preset.description,
                onClick: () => addWorker(preset),
                children: [(0, jsxForTeams.jsx)(PlusIcon, {
                  className: "h-3 w-3"
                }), " ", preset.name]
              }, preset.name)), (0, jsxForTeams.jsxs)(Button, {
                variant: "ghost",
                size: "sm",
                className: "h-6 gap-1 text-[11px]",
                onClick: () => addWorker({
                  name: `worker-${draft.workers.length + 1}`,
                  description: "",
                  profileId: "act"
                }),
                children: [(0, jsxForTeams.jsx)(PlusIcon, {
                  className: "h-3 w-3"
                }), " blank"]
              })]
            })]
          }), (0, jsxForTeams.jsx)(TeamSection, {
            title: "Reviewer",
            hint: "Checks each task against its brief. Sends it back to the worker with notes until it approves.",
            action: (0, jsxForTeams.jsxs)("label", {
              className: "flex items-center gap-1 text-[11px]",
              children: [(0, jsxForTeams.jsx)("input", {
                type: "checkbox",
                checked: draft.reviewer !== null,
                onChange: changeEvent => updateDraft({
                  reviewer: changeEvent.target.checked ? {
                    cliId: draft.supervisor.cliId,
                    model: draft.supervisor.model,
                    profileId: "explain"
                  } : null
                })
              }), "Review each task"]
            }),
            children: draft.reviewer && (0, jsxForTeams.jsx)(AgentBindingFields, {
              binding: draft.reviewer,
              clis: clis,
              profiles: profiles,
              onChange: binding => updateDraft({
                reviewer: binding
              })
            })
          }), (0, jsxForTeams.jsxs)(TeamSection, {
            title: "Running",
            hint: "How far a run may go without you.",
            children: [(0, jsxForTeams.jsxs)("div", {
              className: "flex flex-col gap-1 text-xs",
              children: [(0, jsxForTeams.jsxs)("label", {
                className: "flex items-center gap-2",
                children: [(0, jsxForTeams.jsx)("input", {
                  type: "radio",
                  name: "team-order",
                  checked: !draft.parallel,
                  onChange: () => updateDraft({
                    parallel: !1
                  })
                }), "In order \u2014 one task at a time"]
              }), (0, jsxForTeams.jsxs)("label", {
                className: "flex items-center gap-2",
                children: [(0, jsxForTeams.jsx)("input", {
                  type: "radio",
                  name: "team-order",
                  checked: draft.parallel,
                  onChange: () => updateDraft({
                    parallel: !0
                  })
                }), "In parallel \u2014 up to", (0, jsxForTeams.jsx)("input", {
                  type: "number",
                  min: 2,
                  max: 6,
                  className: classNames(TEAM_FIELD_CLASSES, "w-14"),
                  value: draft.maxParallel,
                  disabled: !draft.parallel,
                  onChange: changeEvent => updateDraft({
                    maxParallel: Number(changeEvent.target.value)
                  })
                }), "at once"]
              }), draft.parallel && (0, jsxForTeams.jsx)("p", {
                className: "m-0 pl-5 text-[11px] text-muted-foreground",
                children: "A task starts as soon as everything it waits on is done. Workers share the instance and the working directory, so give tasks that touch the same thing a dependency. Each answer appears when its task finishes."
              })]
            }), (0, jsxForTeams.jsxs)("label", {
              className: "flex items-center gap-2 text-xs",
              children: [(0, jsxForTeams.jsx)("input", {
                type: "checkbox",
                checked: draft.requirePlanApproval,
                onChange: changeEvent => updateDraft({
                  requirePlanApproval: changeEvent.target.checked
                })
              }), "Show me the plan before it runs"]
            }), (0, jsxForTeams.jsxs)("div", {
              className: "flex gap-4 text-xs",
              children: [(0, jsxForTeams.jsxs)("label", {
                className: "flex items-center gap-2",
                children: ["Turns per run", (0, jsxForTeams.jsx)("input", {
                  type: "number",
                  min: 2,
                  max: 100,
                  className: classNames(TEAM_FIELD_CLASSES, "w-16"),
                  value: draft.maxTurns,
                  onChange: changeEvent => updateDraft({
                    maxTurns: Number(changeEvent.target.value)
                  })
                })]
              }), (0, jsxForTeams.jsxs)("label", {
                className: "flex items-center gap-2",
                title: "How often a task may go back to its worker after review",
                children: ["Attempts per task", (0, jsxForTeams.jsx)("input", {
                  type: "number",
                  min: 1,
                  max: 5,
                  className: classNames(TEAM_FIELD_CLASSES, "w-16"),
                  value: draft.maxAttempts,
                  disabled: !draft.reviewer,
                  onChange: changeEvent => updateDraft({
                    maxAttempts: Number(changeEvent.target.value)
                  })
                })]
              })]
            })]
          }), (draftProblems.length > 0 || problems.length > 0) && (0, jsxForTeams.jsx)("ul", {
            className: "m-0 pl-4 text-[11px] text-[var(--vscode-errorForeground)]",
            children: [...new Set([...draftProblems, ...problems])].map(problem => (0, jsxForTeams.jsx)("li", {
              children: problem
            }, problem))
          })]
        }) : (0, jsxForTeams.jsxs)("div", {
          className: "p-6 text-xs text-muted-foreground flex flex-col gap-2 items-start",
          children: [(0, jsxForTeams.jsxs)("p", {
            className: "m-0",
            children: ["A team splits a request between agents: a ", (0, jsxForTeams.jsx)("b", {
              children: "supervisor"
            }), " plans it, ", (0, jsxForTeams.jsx)("b", {
              children: "workers"
            }), " carry out each task, and an optional ", (0, jsxForTeams.jsx)("b", {
              children: "reviewer"
            }), " checks each one before it counts as done. Each role runs on its own CLI and model."]
          }), (0, jsxForTeams.jsxs)(Button, {
            size: "sm",
            onClick: startNewTeam,
            className: "gap-1",
            children: [(0, jsxForTeams.jsx)(PlusIcon, {
              className: "h-3.5 w-3.5"
            }), " New team"]
          })]
        }), draft && (0, jsxForTeams.jsxs)("div", {
          className: "flex items-center gap-2 border-t border-border px-3 py-2",
          children: [teams.some(team => team.id === draft.id) && (0, jsxForTeams.jsxs)(Button, {
            variant: "ghost",
            size: "sm",
            className: "h-7 gap-1 text-xs",
            onClick: () => {
              onDelete(draft.id), setDraft(null);
            },
            children: [(0, jsxForTeams.jsx)(Trash2Icon, {
              className: "h-3.5 w-3.5"
            }), " Delete"]
          }), (0, jsxForTeams.jsx)("span", {
            className: "flex-1"
          }), (0, jsxForTeams.jsx)(Button, {
            size: "sm",
            className: "h-7 text-xs",
            disabled: draftProblems.length > 0,
            onClick: () => onSave(draft),
            children: "Save team"
          })]
        })]
      })]
    })
  });
}
// ReactForChat (minified: Fe) — ──── Library: hast-util-to-jsx-runtime and deps: comma-separated-tokens, estree-util-is-identifier-name, hast-util-whitespace, property-information, space-separated-tokens, unist-util-position, vfile-message, html-url-attributes (bundled from npm; unchanged, names left minified) ────
var ReactForChat = G(_e());
var ReactForMarkdown = G(_e());
function cL(e, t) {
  let a = t || {};
  return (e[e.length - 1] === "" ? [...e, ""] : e).join((a.padRight ? " " : "") + "," + (a.padLeft === !1 ? "" : " ")).trim();
}
var WI = /^[$_\p{ID_Start}][$_\u{200C}\u{200D}\p{ID_Continue}]*$/u,
  JI = /^[$_\p{ID_Start}][-$_\u{200C}\u{200D}\p{ID_Continue}]*$/u,
  $I = {};
function Zs(e, t) {
  return ((t || $I).jsx ? JI : WI).test(e);
}
var e2 = /[ \t\n\f\r]/g;
function Np(e) {
  return typeof e == "object" ? e.type === "text" ? fL(e.value) : !1 : fL(e);
}
function fL(e) {
  return e.replace(e2, "") === "";
}
var hn = class {
  constructor(t, a, n) {
    this.normal = a, this.property = t, n && (this.space = n);
  }
};
hn.prototype.normal = {};
hn.prototype.property = {};
hn.prototype.space = void 0;
function zp(e, t) {
  let a = {},
    n = {};
  for (let r of e) Object.assign(a, r.property), Object.assign(n, r.normal);
  return new hn(a, n, t);
}
function Vi(e) {
  return e.toLowerCase();
}
var bt = class {
  constructor(t, a) {
    this.attribute = a, this.property = t;
  }
};
bt.prototype.attribute = "";
bt.prototype.booleanish = !1;
bt.prototype.boolean = !1;
bt.prototype.commaOrSpaceSeparated = !1;
bt.prototype.commaSeparated = !1;
bt.prototype.defined = !1;
bt.prototype.mustUseProperty = !1;
bt.prototype.number = !1;
bt.prototype.overloadedBoolean = !1;
bt.prototype.property = "";
bt.prototype.spaceSeparated = !1;
bt.prototype.space = void 0;
var Xi = {};
hh(Xi, {
  boolean: () => te,
  booleanish: () => Ke,
  commaOrSpaceSeparated: () => jt,
  commaSeparated: () => gn,
  number: () => z,
  overloadedBoolean: () => Ks,
  spaceSeparated: () => ke
});
var t2 = 0,
  te = Or(),
  Ke = Or(),
  Ks = Or(),
  z = Or(),
  ke = Or(),
  gn = Or(),
  jt = Or();
function Or() {
  return 2 ** ++t2;
}
var Op = Object.keys(Xi),
  Pr = class extends bt {
    constructor(t, a, n, r) {
      let l = -1;
      if (super(t, a), dL(this, "space", r), typeof n == "number") for (; ++l < Op.length;) {
        let o = Op[l];
        dL(this, Op[l], (n & Xi[o]) === Xi[o]);
      }
    }
  };
Pr.prototype.defined = !0;
function dL(e, t, a) {
  a && (e[t] = a);
}
function ya(e) {
  let t = {},
    a = {};
  for (let [n, r] of Object.entries(e.properties)) {
    let l = new Pr(n, e.transform(e.attributes || {}, n), r, e.space);
    e.mustUseProperty && e.mustUseProperty.includes(n) && (l.mustUseProperty = !0), t[n] = l, a[Vi(n)] = n, a[Vi(l.attribute)] = n;
  }
  return new hn(t, a, e.space);
}
var Pp = ya({
  properties: {
    ariaActiveDescendant: null,
    ariaAtomic: Ke,
    ariaAutoComplete: null,
    ariaBusy: Ke,
    ariaChecked: Ke,
    ariaColCount: z,
    ariaColIndex: z,
    ariaColSpan: z,
    ariaControls: ke,
    ariaCurrent: null,
    ariaDescribedBy: ke,
    ariaDetails: null,
    ariaDisabled: Ke,
    ariaDropEffect: ke,
    ariaErrorMessage: null,
    ariaExpanded: Ke,
    ariaFlowTo: ke,
    ariaGrabbed: Ke,
    ariaHasPopup: null,
    ariaHidden: Ke,
    ariaInvalid: null,
    ariaKeyShortcuts: null,
    ariaLabel: null,
    ariaLabelledBy: ke,
    ariaLevel: z,
    ariaLive: null,
    ariaModal: Ke,
    ariaMultiLine: Ke,
    ariaMultiSelectable: Ke,
    ariaOrientation: null,
    ariaOwns: ke,
    ariaPlaceholder: null,
    ariaPosInSet: z,
    ariaPressed: Ke,
    ariaReadOnly: Ke,
    ariaRelevant: null,
    ariaRequired: Ke,
    ariaRoleDescription: ke,
    ariaRowCount: z,
    ariaRowIndex: z,
    ariaRowSpan: z,
    ariaSelected: Ke,
    ariaSetSize: z,
    ariaSort: null,
    ariaValueMax: z,
    ariaValueMin: z,
    ariaValueNow: z,
    ariaValueText: null,
    role: null
  },
  transform(e, t) {
    return t === "role" ? t : "aria-" + t.slice(4).toLowerCase();
  }
});
function Ws(e, t) {
  return t in e ? e[t] : t;
}
function Js(e, t) {
  return Ws(e, t.toLowerCase());
}
var pL = ya({
  attributes: {
    acceptcharset: "accept-charset",
    classname: "class",
    htmlfor: "for",
    httpequiv: "http-equiv"
  },
  mustUseProperty: ["checked", "multiple", "muted", "selected"],
  properties: {
    abbr: null,
    accept: gn,
    acceptCharset: ke,
    accessKey: ke,
    action: null,
    allow: null,
    allowFullScreen: te,
    allowPaymentRequest: te,
    allowUserMedia: te,
    alpha: te,
    alt: null,
    as: null,
    async: te,
    autoCapitalize: null,
    autoComplete: ke,
    autoFocus: te,
    autoPlay: te,
    blocking: ke,
    capture: null,
    charSet: null,
    checked: te,
    cite: null,
    className: ke,
    closedBy: null,
    colorSpace: null,
    cols: z,
    colSpan: z,
    command: null,
    commandFor: null,
    content: null,
    contentEditable: Ke,
    controls: te,
    controlsList: ke,
    coords: z | gn,
    crossOrigin: null,
    data: null,
    dateTime: null,
    decoding: null,
    default: te,
    defer: te,
    dir: null,
    dirName: null,
    disabled: te,
    download: Ks,
    draggable: Ke,
    encType: null,
    enterKeyHint: null,
    fetchPriority: null,
    form: null,
    formAction: null,
    formEncType: null,
    formMethod: null,
    formNoValidate: te,
    formTarget: null,
    headers: ke,
    height: z,
    hidden: Ks,
    high: z,
    href: null,
    hrefLang: null,
    htmlFor: ke,
    httpEquiv: ke,
    id: null,
    imageSizes: null,
    imageSrcSet: null,
    inert: te,
    inputMode: null,
    integrity: null,
    is: null,
    isMap: te,
    itemId: null,
    itemProp: ke,
    itemRef: ke,
    itemScope: te,
    itemType: ke,
    kind: null,
    label: null,
    lang: null,
    language: null,
    list: null,
    loading: null,
    loop: te,
    low: z,
    manifest: null,
    max: null,
    maxLength: z,
    media: null,
    method: null,
    min: null,
    minLength: z,
    multiple: te,
    muted: te,
    name: null,
    nonce: null,
    noModule: te,
    noValidate: te,
    onAbort: null,
    onAfterPrint: null,
    onAuxClick: null,
    onBeforeMatch: null,
    onBeforePrint: null,
    onBeforeToggle: null,
    onBeforeUnload: null,
    onBlur: null,
    onCancel: null,
    onCanPlay: null,
    onCanPlayThrough: null,
    onChange: null,
    onClick: null,
    onClose: null,
    onContextLost: null,
    onContextMenu: null,
    onContextRestored: null,
    onCopy: null,
    onCueChange: null,
    onCut: null,
    onDblClick: null,
    onDrag: null,
    onDragEnd: null,
    onDragEnter: null,
    onDragExit: null,
    onDragLeave: null,
    onDragOver: null,
    onDragStart: null,
    onDrop: null,
    onDurationChange: null,
    onEmptied: null,
    onEnded: null,
    onError: null,
    onFocus: null,
    onFormData: null,
    onHashChange: null,
    onInput: null,
    onInvalid: null,
    onKeyDown: null,
    onKeyPress: null,
    onKeyUp: null,
    onLanguageChange: null,
    onLoad: null,
    onLoadedData: null,
    onLoadedMetadata: null,
    onLoadEnd: null,
    onLoadStart: null,
    onMessage: null,
    onMessageError: null,
    onMouseDown: null,
    onMouseEnter: null,
    onMouseLeave: null,
    onMouseMove: null,
    onMouseOut: null,
    onMouseOver: null,
    onMouseUp: null,
    onOffline: null,
    onOnline: null,
    onPageHide: null,
    onPageShow: null,
    onPaste: null,
    onPause: null,
    onPlay: null,
    onPlaying: null,
    onPopState: null,
    onProgress: null,
    onRateChange: null,
    onRejectionHandled: null,
    onReset: null,
    onResize: null,
    onScroll: null,
    onScrollEnd: null,
    onSecurityPolicyViolation: null,
    onSeeked: null,
    onSeeking: null,
    onSelect: null,
    onSlotChange: null,
    onStalled: null,
    onStorage: null,
    onSubmit: null,
    onSuspend: null,
    onTimeUpdate: null,
    onToggle: null,
    onUnhandledRejection: null,
    onUnload: null,
    onVolumeChange: null,
    onWaiting: null,
    onWheel: null,
    open: te,
    optimum: z,
    pattern: null,
    ping: ke,
    placeholder: null,
    playsInline: te,
    popover: null,
    popoverTarget: null,
    popoverTargetAction: null,
    poster: null,
    preload: null,
    readOnly: te,
    referrerPolicy: null,
    rel: ke,
    required: te,
    reversed: te,
    rows: z,
    rowSpan: z,
    sandbox: ke,
    scope: null,
    scoped: te,
    seamless: te,
    selected: te,
    shadowRootClonable: te,
    shadowRootCustomElementRegistry: te,
    shadowRootDelegatesFocus: te,
    shadowRootMode: null,
    shadowRootSerializable: te,
    shape: null,
    size: z,
    sizes: null,
    slot: null,
    span: z,
    spellCheck: Ke,
    src: null,
    srcDoc: null,
    srcLang: null,
    srcSet: null,
    start: z,
    step: null,
    style: null,
    tabIndex: z,
    target: null,
    title: null,
    translate: null,
    type: null,
    typeMustMatch: te,
    useMap: null,
    value: Ke,
    width: z,
    wrap: null,
    writingSuggestions: null,
    align: null,
    aLink: null,
    archive: ke,
    axis: null,
    background: null,
    bgColor: null,
    border: z,
    borderColor: null,
    bottomMargin: z,
    cellPadding: null,
    cellSpacing: null,
    char: null,
    charOff: null,
    classId: null,
    clear: null,
    code: null,
    codeBase: null,
    codeType: null,
    color: null,
    compact: te,
    declare: te,
    event: null,
    face: null,
    frame: null,
    frameBorder: null,
    hSpace: z,
    leftMargin: z,
    link: null,
    longDesc: null,
    lowSrc: null,
    marginHeight: z,
    marginWidth: z,
    noResize: te,
    noHref: te,
    noShade: te,
    noWrap: te,
    object: null,
    profile: null,
    prompt: null,
    rev: null,
    rightMargin: z,
    rules: null,
    scheme: null,
    scrolling: Ke,
    standby: null,
    summary: null,
    text: null,
    topMargin: z,
    valueType: null,
    version: null,
    vAlign: null,
    vLink: null,
    vSpace: z,
    allowTransparency: null,
    autoCorrect: null,
    autoSave: null,
    credentialless: te,
    disablePictureInPicture: te,
    disableRemotePlayback: te,
    exportParts: gn,
    part: ke,
    prefix: null,
    property: null,
    results: z,
    security: null,
    unselectable: null
  },
  space: "html",
  transform: Js
});
var mL = ya({
  attributes: {
    accentHeight: "accent-height",
    alignmentBaseline: "alignment-baseline",
    arabicForm: "arabic-form",
    baselineShift: "baseline-shift",
    capHeight: "cap-height",
    className: "class",
    clipPath: "clip-path",
    clipRule: "clip-rule",
    colorInterpolation: "color-interpolation",
    colorInterpolationFilters: "color-interpolation-filters",
    colorProfile: "color-profile",
    colorRendering: "color-rendering",
    crossOrigin: "crossorigin",
    dataType: "datatype",
    dominantBaseline: "dominant-baseline",
    enableBackground: "enable-background",
    fillOpacity: "fill-opacity",
    fillRule: "fill-rule",
    floodColor: "flood-color",
    floodOpacity: "flood-opacity",
    fontFamily: "font-family",
    fontSize: "font-size",
    fontSizeAdjust: "font-size-adjust",
    fontStretch: "font-stretch",
    fontStyle: "font-style",
    fontVariant: "font-variant",
    fontWeight: "font-weight",
    glyphName: "glyph-name",
    glyphOrientationHorizontal: "glyph-orientation-horizontal",
    glyphOrientationVertical: "glyph-orientation-vertical",
    hrefLang: "hreflang",
    horizAdvX: "horiz-adv-x",
    horizOriginX: "horiz-origin-x",
    horizOriginY: "horiz-origin-y",
    imageRendering: "image-rendering",
    letterSpacing: "letter-spacing",
    lightingColor: "lighting-color",
    markerEnd: "marker-end",
    markerMid: "marker-mid",
    markerStart: "marker-start",
    maskType: "mask-type",
    navDown: "nav-down",
    navDownLeft: "nav-down-left",
    navDownRight: "nav-down-right",
    navLeft: "nav-left",
    navNext: "nav-next",
    navPrev: "nav-prev",
    navRight: "nav-right",
    navUp: "nav-up",
    navUpLeft: "nav-up-left",
    navUpRight: "nav-up-right",
    onAbort: "onabort",
    onActivate: "onactivate",
    onAfterPrint: "onafterprint",
    onBeforePrint: "onbeforeprint",
    onBegin: "onbegin",
    onCancel: "oncancel",
    onCanPlay: "oncanplay",
    onCanPlayThrough: "oncanplaythrough",
    onChange: "onchange",
    onClick: "onclick",
    onClose: "onclose",
    onCopy: "oncopy",
    onCueChange: "oncuechange",
    onCut: "oncut",
    onDblClick: "ondblclick",
    onDrag: "ondrag",
    onDragEnd: "ondragend",
    onDragEnter: "ondragenter",
    onDragExit: "ondragexit",
    onDragLeave: "ondragleave",
    onDragOver: "ondragover",
    onDragStart: "ondragstart",
    onDrop: "ondrop",
    onDurationChange: "ondurationchange",
    onEmptied: "onemptied",
    onEnd: "onend",
    onEnded: "onended",
    onError: "onerror",
    onFocus: "onfocus",
    onFocusIn: "onfocusin",
    onFocusOut: "onfocusout",
    onHashChange: "onhashchange",
    onInput: "oninput",
    onInvalid: "oninvalid",
    onKeyDown: "onkeydown",
    onKeyPress: "onkeypress",
    onKeyUp: "onkeyup",
    onLoad: "onload",
    onLoadedData: "onloadeddata",
    onLoadedMetadata: "onloadedmetadata",
    onLoadStart: "onloadstart",
    onMessage: "onmessage",
    onMouseDown: "onmousedown",
    onMouseEnter: "onmouseenter",
    onMouseLeave: "onmouseleave",
    onMouseMove: "onmousemove",
    onMouseOut: "onmouseout",
    onMouseOver: "onmouseover",
    onMouseUp: "onmouseup",
    onMouseWheel: "onmousewheel",
    onOffline: "onoffline",
    onOnline: "ononline",
    onPageHide: "onpagehide",
    onPageShow: "onpageshow",
    onPaste: "onpaste",
    onPause: "onpause",
    onPlay: "onplay",
    onPlaying: "onplaying",
    onPopState: "onpopstate",
    onProgress: "onprogress",
    onRateChange: "onratechange",
    onRepeat: "onrepeat",
    onReset: "onreset",
    onResize: "onresize",
    onScroll: "onscroll",
    onSeeked: "onseeked",
    onSeeking: "onseeking",
    onSelect: "onselect",
    onShow: "onshow",
    onStalled: "onstalled",
    onStorage: "onstorage",
    onSubmit: "onsubmit",
    onSuspend: "onsuspend",
    onTimeUpdate: "ontimeupdate",
    onToggle: "ontoggle",
    onUnload: "onunload",
    onVolumeChange: "onvolumechange",
    onWaiting: "onwaiting",
    onZoom: "onzoom",
    overlinePosition: "overline-position",
    overlineThickness: "overline-thickness",
    paintOrder: "paint-order",
    panose1: "panose-1",
    pointerEvents: "pointer-events",
    referrerPolicy: "referrerpolicy",
    renderingIntent: "rendering-intent",
    shapeRendering: "shape-rendering",
    stopColor: "stop-color",
    stopOpacity: "stop-opacity",
    strikethroughPosition: "strikethrough-position",
    strikethroughThickness: "strikethrough-thickness",
    strokeDashArray: "stroke-dasharray",
    strokeDashOffset: "stroke-dashoffset",
    strokeLineCap: "stroke-linecap",
    strokeLineJoin: "stroke-linejoin",
    strokeMiterLimit: "stroke-miterlimit",
    strokeOpacity: "stroke-opacity",
    strokeWidth: "stroke-width",
    tabIndex: "tabindex",
    textAnchor: "text-anchor",
    textDecoration: "text-decoration",
    textRendering: "text-rendering",
    transformOrigin: "transform-origin",
    typeOf: "typeof",
    underlinePosition: "underline-position",
    underlineThickness: "underline-thickness",
    unicodeBidi: "unicode-bidi",
    unicodeRange: "unicode-range",
    unitsPerEm: "units-per-em",
    vAlphabetic: "v-alphabetic",
    vHanging: "v-hanging",
    vIdeographic: "v-ideographic",
    vMathematical: "v-mathematical",
    vectorEffect: "vector-effect",
    vertAdvY: "vert-adv-y",
    vertOriginX: "vert-origin-x",
    vertOriginY: "vert-origin-y",
    wordSpacing: "word-spacing",
    writingMode: "writing-mode",
    xHeight: "x-height",
    playbackOrder: "playbackorder",
    timelineBegin: "timelinebegin"
  },
  properties: {
    about: jt,
    accentHeight: z,
    accumulate: null,
    additive: null,
    alignmentBaseline: null,
    alphabetic: z,
    amplitude: z,
    arabicForm: null,
    ascent: z,
    attributeName: null,
    attributeType: null,
    azimuth: z,
    bandwidth: null,
    baselineShift: null,
    baseFrequency: null,
    baseProfile: null,
    bbox: null,
    begin: null,
    bias: z,
    by: null,
    calcMode: null,
    capHeight: z,
    className: ke,
    clip: null,
    clipPath: null,
    clipPathUnits: null,
    clipRule: null,
    color: null,
    colorInterpolation: null,
    colorInterpolationFilters: null,
    colorProfile: null,
    colorRendering: null,
    content: null,
    contentScriptType: null,
    contentStyleType: null,
    crossOrigin: null,
    cursor: null,
    cx: null,
    cy: null,
    d: null,
    dataType: null,
    defaultAction: null,
    descent: z,
    diffuseConstant: z,
    direction: null,
    display: null,
    dur: null,
    divisor: z,
    dominantBaseline: null,
    download: te,
    dx: null,
    dy: null,
    edgeMode: null,
    editable: null,
    elevation: z,
    enableBackground: null,
    end: null,
    event: null,
    exponent: z,
    externalResourcesRequired: null,
    fill: null,
    fillOpacity: z,
    fillRule: null,
    filter: null,
    filterRes: null,
    filterUnits: null,
    floodColor: null,
    floodOpacity: null,
    focusable: null,
    focusHighlight: null,
    fontFamily: null,
    fontSize: null,
    fontSizeAdjust: null,
    fontStretch: null,
    fontStyle: null,
    fontVariant: null,
    fontWeight: null,
    format: null,
    fr: null,
    from: null,
    fx: null,
    fy: null,
    g1: gn,
    g2: gn,
    glyphName: gn,
    glyphOrientationHorizontal: null,
    glyphOrientationVertical: null,
    glyphRef: null,
    gradientTransform: null,
    gradientUnits: null,
    handler: null,
    hanging: z,
    hatchContentUnits: null,
    hatchUnits: null,
    height: null,
    href: null,
    hrefLang: null,
    horizAdvX: z,
    horizOriginX: z,
    horizOriginY: z,
    id: null,
    ideographic: z,
    imageRendering: null,
    initialVisibility: null,
    in: null,
    in2: null,
    intercept: z,
    k: z,
    k1: z,
    k2: z,
    k3: z,
    k4: z,
    kernelMatrix: jt,
    kernelUnitLength: null,
    keyPoints: null,
    keySplines: null,
    keyTimes: null,
    kerning: null,
    lang: null,
    lengthAdjust: null,
    letterSpacing: null,
    lightingColor: null,
    limitingConeAngle: z,
    local: null,
    markerEnd: null,
    markerMid: null,
    markerStart: null,
    markerHeight: null,
    markerUnits: null,
    markerWidth: null,
    mask: null,
    maskContentUnits: null,
    maskType: null,
    maskUnits: null,
    mathematical: null,
    max: null,
    media: null,
    mediaCharacterEncoding: null,
    mediaContentEncodings: null,
    mediaSize: z,
    mediaTime: null,
    method: null,
    min: null,
    mode: null,
    name: null,
    navDown: null,
    navDownLeft: null,
    navDownRight: null,
    navLeft: null,
    navNext: null,
    navPrev: null,
    navRight: null,
    navUp: null,
    navUpLeft: null,
    navUpRight: null,
    numOctaves: null,
    observer: null,
    offset: null,
    onAbort: null,
    onActivate: null,
    onAfterPrint: null,
    onBeforePrint: null,
    onBegin: null,
    onCancel: null,
    onCanPlay: null,
    onCanPlayThrough: null,
    onChange: null,
    onClick: null,
    onClose: null,
    onCopy: null,
    onCueChange: null,
    onCut: null,
    onDblClick: null,
    onDrag: null,
    onDragEnd: null,
    onDragEnter: null,
    onDragExit: null,
    onDragLeave: null,
    onDragOver: null,
    onDragStart: null,
    onDrop: null,
    onDurationChange: null,
    onEmptied: null,
    onEnd: null,
    onEnded: null,
    onError: null,
    onFocus: null,
    onFocusIn: null,
    onFocusOut: null,
    onHashChange: null,
    onInput: null,
    onInvalid: null,
    onKeyDown: null,
    onKeyPress: null,
    onKeyUp: null,
    onLoad: null,
    onLoadedData: null,
    onLoadedMetadata: null,
    onLoadStart: null,
    onMessage: null,
    onMouseDown: null,
    onMouseEnter: null,
    onMouseLeave: null,
    onMouseMove: null,
    onMouseOut: null,
    onMouseOver: null,
    onMouseUp: null,
    onMouseWheel: null,
    onOffline: null,
    onOnline: null,
    onPageHide: null,
    onPageShow: null,
    onPaste: null,
    onPause: null,
    onPlay: null,
    onPlaying: null,
    onPopState: null,
    onProgress: null,
    onRateChange: null,
    onRepeat: null,
    onReset: null,
    onResize: null,
    onScroll: null,
    onSeeked: null,
    onSeeking: null,
    onSelect: null,
    onShow: null,
    onStalled: null,
    onStorage: null,
    onSubmit: null,
    onSuspend: null,
    onTimeUpdate: null,
    onToggle: null,
    onUnload: null,
    onVolumeChange: null,
    onWaiting: null,
    onZoom: null,
    opacity: null,
    operator: null,
    order: null,
    orient: null,
    orientation: null,
    origin: null,
    overflow: null,
    overlay: null,
    overlinePosition: z,
    overlineThickness: z,
    paintOrder: null,
    panose1: null,
    path: null,
    pathLength: z,
    patternContentUnits: null,
    patternTransform: null,
    patternUnits: null,
    phase: null,
    ping: ke,
    pitch: null,
    playbackOrder: null,
    pointerEvents: null,
    points: null,
    pointsAtX: z,
    pointsAtY: z,
    pointsAtZ: z,
    preserveAlpha: null,
    preserveAspectRatio: null,
    primitiveUnits: null,
    propagate: null,
    property: jt,
    r: null,
    radius: null,
    referrerPolicy: null,
    refX: null,
    refY: null,
    rel: jt,
    rev: jt,
    renderingIntent: null,
    repeatCount: null,
    repeatDur: null,
    requiredExtensions: jt,
    requiredFeatures: jt,
    requiredFonts: jt,
    requiredFormats: jt,
    resource: null,
    restart: null,
    result: null,
    rotate: null,
    rx: null,
    ry: null,
    scale: null,
    seed: null,
    shapeRendering: null,
    side: null,
    slope: null,
    snapshotTime: null,
    specularConstant: z,
    specularExponent: z,
    spreadMethod: null,
    spacing: null,
    startOffset: null,
    stdDeviation: null,
    stemh: null,
    stemv: null,
    stitchTiles: null,
    stopColor: null,
    stopOpacity: null,
    strikethroughPosition: z,
    strikethroughThickness: z,
    string: null,
    stroke: null,
    strokeDashArray: jt,
    strokeDashOffset: null,
    strokeLineCap: null,
    strokeLineJoin: null,
    strokeMiterLimit: z,
    strokeOpacity: z,
    strokeWidth: null,
    style: null,
    surfaceScale: z,
    syncBehavior: null,
    syncBehaviorDefault: null,
    syncMaster: null,
    syncTolerance: null,
    syncToleranceDefault: null,
    systemLanguage: jt,
    tabIndex: z,
    tableValues: null,
    target: null,
    targetX: z,
    targetY: z,
    textAnchor: null,
    textDecoration: null,
    textRendering: null,
    textLength: null,
    timelineBegin: null,
    title: null,
    transformBehavior: null,
    type: null,
    typeOf: jt,
    to: null,
    transform: null,
    transformOrigin: null,
    u1: null,
    u2: null,
    underlinePosition: z,
    underlineThickness: z,
    unicode: null,
    unicodeBidi: null,
    unicodeRange: null,
    unitsPerEm: z,
    values: null,
    vAlphabetic: z,
    vMathematical: z,
    vectorEffect: null,
    vHanging: z,
    vIdeographic: z,
    version: null,
    vertAdvY: z,
    vertOriginX: z,
    vertOriginY: z,
    viewBox: null,
    viewTarget: null,
    visibility: null,
    width: null,
    widths: null,
    wordSpacing: null,
    writingMode: null,
    x: null,
    x1: null,
    x2: null,
    xChannelSelector: null,
    xHeight: z,
    y: null,
    y1: null,
    y2: null,
    yChannelSelector: null,
    z: null,
    zoomAndPan: null
  },
  space: "svg",
  transform: Ws
});
var Up = ya({
  properties: {
    xLinkActuate: null,
    xLinkArcRole: null,
    xLinkHref: null,
    xLinkRole: null,
    xLinkShow: null,
    xLinkTitle: null,
    xLinkType: null
  },
  space: "xlink",
  transform(e, t) {
    return "xlink:" + t.slice(5).toLowerCase();
  }
});
var qp = ya({
  attributes: {
    xmlnsxlink: "xmlns:xlink"
  },
  properties: {
    xmlnsXLink: null,
    xmlns: null
  },
  space: "xmlns",
  transform: Js
});
var Fp = ya({
  properties: {
    xmlBase: null,
    xmlLang: null,
    xmlSpace: null
  },
  space: "xml",
  transform(e, t) {
    return "xml:" + t.slice(3).toLowerCase();
  }
});
var Hp = {
  classId: "classID",
  dataType: "datatype",
  itemId: "itemID",
  strokeDashArray: "strokeDasharray",
  strokeDashOffset: "strokeDashoffset",
  strokeLineCap: "strokeLinecap",
  strokeLineJoin: "strokeLinejoin",
  strokeMiterLimit: "strokeMiterlimit",
  typeOf: "typeof",
  xLinkActuate: "xlinkActuate",
  xLinkArcRole: "xlinkArcrole",
  xLinkHref: "xlinkHref",
  xLinkRole: "xlinkRole",
  xLinkShow: "xlinkShow",
  xLinkTitle: "xlinkTitle",
  xLinkType: "xlinkType",
  xmlnsXLink: "xmlnsXlink"
};
var a2 = /[A-Z]/g,
  hL = /-[a-z]/g,
  n2 = /^data[-\w.:]+$/i;
function _p(e, t) {
  let a = Vi(t),
    n = t,
    r = bt;
  if (a in e.normal) return e.property[e.normal[a]];
  if (a.length > 4 && a.slice(0, 4) === "data" && n2.test(t)) {
    if (t.charAt(4) === "-") {
      let l = t.slice(5).replace(hL, l2);
      n = "data" + l.charAt(0).toUpperCase() + l.slice(1);
    } else {
      let l = t.slice(4);
      if (!hL.test(l)) {
        let o = l.replace(a2, r2);
        o.charAt(0) !== "-" && (o = "-" + o), t = "data" + o;
      }
    }
    r = Pr;
  }
  return new r(n, t);
}
function r2(e) {
  return "-" + e.toLowerCase();
}
function l2(e) {
  return e.charAt(1).toUpperCase();
}
var gL = zp([Pp, pL, Up, qp, Fp], "html"),
  $s = zp([Pp, mL, Up, qp, Fp], "svg");
function xL(e) {
  return e.join(" ").trim();
}
var EL = G(TL(), 1);
var tc = ML("end"),
  eo = ML("start");
function ML(e) {
  return t;
  function t(a) {
    let n = a && a.position && a.position[e] || {};
    if (typeof n.line == "number" && n.line > 0 && typeof n.column == "number" && n.column > 0) return {
      line: n.line,
      column: n.column,
      offset: typeof n.offset == "number" && n.offset > -1 ? n.offset : void 0
    };
  }
}
function Xp(e) {
  let t = eo(e),
    a = tc(e);
  if (t && a) return {
    start: t,
    end: a
  };
}
function ar(e) {
  return !e || typeof e != "object" ? "" : "position" in e || "type" in e ? DL(e.position) : "start" in e || "end" in e ? DL(e) : "line" in e || "column" in e ? jp(e) : "";
}
function jp(e) {
  return BL(e && e.line) + ":" + BL(e && e.column);
}
function DL(e) {
  return jp(e && e.start) + "-" + jp(e && e.end);
}
function BL(e) {
  return e && typeof e == "number" ? e : 1;
}
var at = class extends Error {
  constructor(t, a, n) {
    super(), typeof a == "string" && (n = a, a = void 0);
    let r = "",
      l = {},
      o = !1;
    if (a && ("line" in a && "column" in a ? l = {
      place: a
    } : "start" in a && "end" in a ? l = {
      place: a
    } : "type" in a ? l = {
      ancestors: [a],
      place: a.position
    } : l = {
      ...a
    }), typeof t == "string" ? r = t : !l.cause && t && (o = !0, r = t.message, l.cause = t), !l.ruleId && !l.source && typeof n == "string") {
      let u = n.indexOf(":");
      u === -1 ? l.ruleId = n : (l.source = n.slice(0, u), l.ruleId = n.slice(u + 1));
    }
    if (!l.place && l.ancestors && l.ancestors) {
      let u = l.ancestors[l.ancestors.length - 1];
      u && (l.place = u.position);
    }
    let i = l.place && "start" in l.place ? l.place.start : l.place;
    this.ancestors = l.ancestors || void 0, this.cause = l.cause || void 0, this.column = i ? i.column : void 0, this.fatal = void 0, this.file = "", this.message = r, this.line = i ? i.line : void 0, this.name = ar(l.place) || "1:1", this.place = l.place || void 0, this.reason = this.message, this.ruleId = l.ruleId || void 0, this.source = l.source || void 0, this.stack = o && l.cause && typeof l.cause.stack == "string" ? l.cause.stack : "", this.actual = void 0, this.expected = void 0, this.note = void 0, this.url = void 0;
  }
};
at.prototype.file = "";
at.prototype.name = "";
at.prototype.reason = "";
at.prototype.message = "";
at.prototype.stack = "";
at.prototype.column = void 0;
at.prototype.line = void 0;
at.prototype.ancestors = void 0;
at.prototype.cause = void 0;
at.prototype.fatal = void 0;
at.prototype.place = void 0;
at.prototype.ruleId = void 0;
at.prototype.source = void 0;
var Yp = {}.hasOwnProperty,
  B2 = new Map(),
  E2 = /[A-Z]/g,
  R2 = new Set(["table", "tbody", "thead", "tfoot", "tr"]),
  N2 = new Set(["td", "th"]),
  RL = "https://github.com/syntax-tree/hast-util-to-jsx-runtime";
function Qp(e, t) {
  if (!t || t.Fragment === void 0) throw new TypeError("Expected `Fragment` in options");
  let a = t.filePath || void 0,
    n;
  if (t.development) {
    if (typeof t.jsxDEV != "function") throw new TypeError("Expected `jsxDEV` in options when `development: true`");
    n = _2(a, t.jsxDEV);
  } else {
    if (typeof t.jsx != "function") throw new TypeError("Expected `jsx` in production options");
    if (typeof t.jsxs != "function") throw new TypeError("Expected `jsxs` in production options");
    n = H2(a, t.jsx, t.jsxs);
  }
  let r = {
      Fragment: t.Fragment,
      ancestors: [],
      components: t.components || {},
      create: n,
      elementAttributeNameCase: t.elementAttributeNameCase || "react",
      evaluater: t.createEvaluater ? t.createEvaluater() : void 0,
      filePath: a,
      ignoreInvalidStyle: t.ignoreInvalidStyle || !1,
      passKeys: t.passKeys !== !1,
      passNode: t.passNode || !1,
      schema: t.space === "svg" ? $s : gL,
      stylePropertyNameCase: t.stylePropertyNameCase || "dom",
      tableCellAlignToStyle: t.tableCellAlignToStyle !== !1
    },
    l = NL(r, e, void 0);
  return l && typeof l != "string" ? l : r.create(e, r.Fragment, {
    children: l || void 0
  }, void 0);
}
function NL(e, t, a) {
  if (t.type === "element") return z2(e, t, a);
  if (t.type === "mdxFlowExpression" || t.type === "mdxTextExpression") return O2(e, t);
  if (t.type === "mdxJsxFlowElement" || t.type === "mdxJsxTextElement") return U2(e, t, a);
  if (t.type === "mdxjsEsm") return P2(e, t);
  if (t.type === "root") return q2(e, t, a);
  if (t.type === "text") return F2(e, t);
}
function z2(e, t, a) {
  let n = e.schema,
    r = n;
  t.tagName.toLowerCase() === "svg" && n.space === "html" && (r = $s, e.schema = r), e.ancestors.push(t);
  let l = OL(e, t.tagName, !1),
    o = G2(e, t),
    i = Kp(e, t);
  return R2.has(t.tagName) && (i = i.filter(function (u) {
    return typeof u == "string" ? !Np(u) : !0;
  })), zL(e, o, l, t), Zp(o, i), e.ancestors.pop(), e.schema = n, e.create(t, l, o, a);
}
function O2(e, t) {
  if (t.data && t.data.estree && e.evaluater) {
    let n = t.data.estree.body[0];
    return n.type, e.evaluater.evaluateExpression(n.expression);
  }
  Yi(e, t.position);
}
function P2(e, t) {
  if (t.data && t.data.estree && e.evaluater) return e.evaluater.evaluateProgram(t.data.estree);
  Yi(e, t.position);
}
function U2(e, t, a) {
  let n = e.schema,
    r = n;
  t.name === "svg" && n.space === "html" && (r = $s, e.schema = r), e.ancestors.push(t);
  let l = t.name === null ? e.Fragment : OL(e, t.name, !0),
    o = V2(e, t),
    i = Kp(e, t);
  return zL(e, o, l, t), Zp(o, i), e.ancestors.pop(), e.schema = n, e.create(t, l, o, a);
}
function q2(e, t, a) {
  let n = {};
  return Zp(n, Kp(e, t)), e.create(t, e.Fragment, n, a);
}
function F2(e, t) {
  return t.value;
}
function zL(e, t, a, n) {
  typeof a != "string" && a !== e.Fragment && e.passNode && (t.node = n);
}
function Zp(e, t) {
  if (t.length > 0) {
    let a = t.length > 1 ? t : t[0];
    a && (e.children = a);
  }
}
function H2(e, t, a) {
  return n;
  function n(r, l, o, i) {
    let s = Array.isArray(o.children) ? a : t;
    return i ? s(l, o, i) : s(l, o);
  }
}
function _2(e, t) {
  return a;
  function a(n, r, l, o) {
    let i = Array.isArray(l.children),
      u = eo(n);
    return t(r, l, o, i, {
      columnNumber: u ? u.column - 1 : void 0,
      fileName: e,
      lineNumber: u ? u.line : void 0
    }, void 0);
  }
}
function G2(e, t) {
  let a = {},
    n,
    r;
  for (r in t.properties) if (r !== "children" && Yp.call(t.properties, r)) {
    let l = X2(e, r, t.properties[r]);
    if (l) {
      let [o, i] = l;
      e.tableCellAlignToStyle && o === "align" && typeof i == "string" && N2.has(t.tagName) ? n = i : a[o] = i;
    }
  }
  if (n) {
    let l = a.style || (a.style = {});
    l[e.stylePropertyNameCase === "css" ? "text-align" : "textAlign"] = n;
  }
  return a;
}
function V2(e, t) {
  let a = {};
  for (let n of t.attributes) if (n.type === "mdxJsxExpressionAttribute") {
    if (n.data && n.data.estree && e.evaluater) {
      let l = n.data.estree.body[0];
      l.type;
      let o = l.expression;
      o.type;
      let i = o.properties[0];
      i.type, Object.assign(a, e.evaluater.evaluateExpression(i.argument));
    } else Yi(e, t.position);
  } else {
    let r = n.name,
      l;
    if (n.value && typeof n.value == "object") {
      if (n.value.data && n.value.data.estree && e.evaluater) {
        let i = n.value.data.estree.body[0];
        i.type, l = e.evaluater.evaluateExpression(i.expression);
      } else Yi(e, t.position);
    } else l = n.value === null ? !0 : n.value;
    a[r] = l;
  }
  return a;
}
function Kp(e, t) {
  let a = [],
    n = -1,
    r = e.passKeys ? new Map() : B2;
  for (; ++n < t.children.length;) {
    let l = t.children[n],
      o;
    if (e.passKeys) {
      let u = l.type === "element" ? l.tagName : l.type === "mdxJsxFlowElement" || l.type === "mdxJsxTextElement" ? l.name : void 0;
      if (u) {
        let s = r.get(u) || 0;
        o = u + "-" + s, r.set(u, s + 1);
      }
    }
    let i = NL(e, l, o);
    i !== void 0 && a.push(i);
  }
  return a;
}
function X2(e, t, a) {
  let n = _p(e.schema, t);
  if (!(a == null || typeof a == "number" && Number.isNaN(a))) {
    if (Array.isArray(a) && (a = n.commaSeparated ? cL(a) : xL(a)), n.property === "style") {
      let r = typeof a == "object" ? a : j2(e, String(a));
      return e.stylePropertyNameCase === "css" && (r = Y2(r)), ["style", r];
    }
    return [e.elementAttributeNameCase === "react" && n.space ? Hp[n.property] || n.property : n.attribute, a];
  }
}
function j2(e, t) {
  try {
    return (0, EL.default)(t, {
      reactCompat: !0
    });
  } catch (a) {
    if (e.ignoreInvalidStyle) return {};
    let n = a,
      r = new at("Cannot parse `style` attribute", {
        ancestors: e.ancestors,
        cause: n,
        ruleId: "style",
        source: "hast-util-to-jsx-runtime"
      });
    throw r.file = e.filePath || void 0, r.url = RL + "#cannot-parse-style-attribute", r;
  }
}
function OL(e, t, a) {
  let n;
  if (!a) n = {
    type: "Literal",
    value: t
  };else if (t.includes(".")) {
    let r = t.split("."),
      l = -1,
      o;
    for (; ++l < r.length;) {
      let i = Zs(r[l]) ? {
        type: "Identifier",
        name: r[l]
      } : {
        type: "Literal",
        value: r[l]
      };
      o = o ? {
        type: "MemberExpression",
        object: o,
        property: i,
        computed: !!(l && i.type === "Literal"),
        optional: !1
      } : i;
    }
    n = o;
  } else n = Zs(t) && !/^[a-z]/.test(t) ? {
    type: "Identifier",
    name: t
  } : {
    type: "Literal",
    value: t
  };
  if (n.type === "Literal") {
    let r = n.value;
    return Yp.call(e.components, r) ? e.components[r] : r;
  }
  if (e.evaluater) return e.evaluater.evaluateExpression(n);
  Yi(e);
}
function Yi(e, t) {
  let a = new at("Cannot handle MDX estrees without `createEvaluater`", {
    ancestors: e.ancestors,
    place: t,
    ruleId: "mdx-estree",
    source: "hast-util-to-jsx-runtime"
  });
  throw a.file = e.filePath || void 0, a.url = RL + "#cannot-handle-mdx-estrees-without-createevaluater", a;
}
function Y2(e) {
  let t = {},
    a;
  for (a in e) Yp.call(e, a) && (t[Q2(a)] = e[a]);
  return t;
}
function Q2(e) {
  let t = e.replace(E2, Z2);
  return t.slice(0, 3) === "ms-" && (t = "-" + t), t;
}
function Z2(e) {
  return "-" + e.toLowerCase();
}
var Qi = {
  action: ["form"],
  cite: ["blockquote", "del", "ins", "q"],
  data: ["object"],
  formAction: ["button", "input"],
  href: ["a", "area", "base", "link"],
  icon: ["menuitem"],
  itemId: null,
  manifest: ["html"],
  ping: ["a", "area"],
  poster: ["video"],
  src: ["audio", "embed", "iframe", "img", "input", "script", "source", "track", "video"]
};
// ──── Library: react-markdown pipeline: mdast-util-to-string, decode-named-character-reference, micromark (+ util-*, core constructs), mdast-util-from-markdown, remark-parse, mdast-util-to-hast, @ungap/structured-clone, unist-util-is/visit-parents/visit, remark-rehype, bail, is-plain-obj, trough, vfile, unified, react-markdown (bundled from npm; unchanged, names left minified) ────
var ro = G(oe(), 1),
  s1 = G(_e(), 1);
var K2 = {};
function qr(e, t) {
  let a = t || K2,
    n = typeof a.includeImageAlt == "boolean" ? a.includeImageAlt : !0,
    r = typeof a.includeHtml == "boolean" ? a.includeHtml : !0;
  return UL(e, n, r);
}
function UL(e, t, a) {
  if (W2(e)) {
    if ("value" in e) return e.type === "html" && !a ? "" : e.value;
    if (t && "alt" in e && e.alt) return e.alt;
    if ("children" in e) return PL(e.children, t, a);
  }
  return Array.isArray(e) ? PL(e, t, a) : "";
}
function PL(e, t, a) {
  let n = [],
    r = -1;
  for (; ++r < e.length;) n[r] = UL(e[r], t, a);
  return n.join("");
}
function W2(e) {
  return !!(e && typeof e == "object");
}
var qL = document.createElement("i");
function to(e) {
  let t = "&" + e + ";";
  qL.innerHTML = t;
  let a = qL.textContent;
  return a.charCodeAt(a.length - 1) === 59 && e !== "semi" || a === t ? !1 : a;
}
function nt(e, t, a, n) {
  let r = e.length,
    l = 0,
    o;
  if (t < 0 ? t = -t > r ? 0 : r + t : t = t > r ? r : t, a = a > 0 ? a : 0, n.length < 1e4) o = Array.from(n), o.unshift(t, a), e.splice(...o);else for (a && e.splice(t, a); l < n.length;) o = n.slice(l, l + 1e4), o.unshift(t, 0), e.splice(...o), l += 1e4, t += 1e4;
}
function zt(e, t) {
  return e.length > 0 ? (nt(e, e.length, 0, t), e) : t;
}
var FL = {}.hasOwnProperty;
function ac(e) {
  let t = {},
    a = -1;
  for (; ++a < e.length;) J2(t, e[a]);
  return t;
}
function J2(e, t) {
  let a;
  for (a in t) {
    let r = (FL.call(e, a) ? e[a] : void 0) || (e[a] = {}),
      l = t[a],
      o;
    if (l) for (o in l) {
      FL.call(r, o) || (r[o] = []);
      let i = l[o];
      $2(r[o], Array.isArray(i) ? i : i ? [i] : []);
    }
  }
}
function $2(e, t) {
  let a = -1,
    n = [];
  for (; ++a < t.length;) (t[a].add === "after" ? e : n).push(t[a]);
  nt(e, 0, 0, n);
}
function nc(e, t) {
  let a = Number.parseInt(e, t);
  return a < 9 || a === 11 || a > 13 && a < 32 || a > 126 && a < 160 || a > 55295 && a < 57344 || a > 64975 && a < 65008 || (a & 65535) === 65535 || (a & 65535) === 65534 || a > 1114111 ? "\uFFFD" : String.fromCodePoint(a);
}
function Mt(e) {
  return e.replace(/[\t\n\r ]+/g, " ").replace(/^ | $/g, "").toLowerCase().toUpperCase();
}
var mt = nr(/[A-Za-z]/),
  We = nr(/[\dA-Za-z]/),
  HL = nr(/[#-'*+\--9=?A-Z^-~]/);
function Fr(e) {
  return e !== null && (e < 32 || e === 127);
}
var Zi = nr(/\d/),
  _L = nr(/[\dA-Fa-f]/),
  GL = nr(/[!-/:-@[-`{-~]/);
function U(e) {
  return e !== null && e < -2;
}
function ce(e) {
  return e !== null && (e < 0 || e === 32);
}
function W(e) {
  return e === -2 || e === -1 || e === 32;
}
var Hr = nr(/\p{P}|\p{S}/u),
  qa = nr(/\s/);
function nr(e) {
  return t;
  function t(a) {
    return a !== null && a > -1 && e.test(String.fromCharCode(a));
  }
}
function ba(e) {
  let t = [],
    a = -1,
    n = 0,
    r = 0;
  for (; ++a < e.length;) {
    let l = e.charCodeAt(a),
      o = "";
    if (l === 37 && We(e.charCodeAt(a + 1)) && We(e.charCodeAt(a + 2))) r = 2;else if (l < 128) /[!#$&-;=?-Z_a-z~]/.test(String.fromCharCode(l)) || (o = String.fromCharCode(l));else if (l > 55295 && l < 57344) {
      let i = e.charCodeAt(a + 1);
      l < 56320 && i > 56319 && i < 57344 ? (o = String.fromCharCode(l, i), r = 1) : o = "\uFFFD";
    } else o = String.fromCharCode(l);
    o && (t.push(e.slice(n, a), encodeURIComponent(o)), n = a + r + 1, o = ""), r && (a += r, r = 0);
  }
  return t.join("") + e.slice(n);
}
function Q(e, t, a, n) {
  let r = n ? n - 1 : Number.POSITIVE_INFINITY,
    l = 0;
  return o;
  function o(u) {
    return W(u) ? (e.enter(a), i(u)) : t(u);
  }
  function i(u) {
    return W(u) && l++ < r ? (e.consume(u), i) : (e.exit(a), t(u));
  }
}
var VL = {
  tokenize: eA
};
function eA(e) {
  let t = e.attempt(this.parser.constructs.contentInitial, n, r),
    a;
  return t;
  function n(i) {
    if (i === null) {
      e.consume(i);
      return;
    }
    return e.enter("lineEnding"), e.consume(i), e.exit("lineEnding"), Q(e, t, "linePrefix");
  }
  function r(i) {
    return e.enter("paragraph"), l(i);
  }
  function l(i) {
    let u = e.enter("chunkText", {
      contentType: "text",
      previous: a
    });
    return a && (a.next = u), a = u, o(i);
  }
  function o(i) {
    if (i === null) {
      e.exit("chunkText"), e.exit("paragraph"), e.consume(i);
      return;
    }
    return U(i) ? (e.consume(i), e.exit("chunkText"), l) : (e.consume(i), o);
  }
}
var jL = {
    tokenize: tA
  },
  XL = {
    tokenize: aA
  };
function tA(e) {
  let t = this,
    a = [],
    n = 0,
    r,
    l,
    o;
  return i;
  function i(g) {
    if (n < a.length) {
      let L = a[n];
      return t.containerState = L[1], e.attempt(L[0].continuation, u, s)(g);
    }
    return s(g);
  }
  function u(g) {
    if (n++, t.containerState._closeFlow) {
      t.containerState._closeFlow = void 0, r && m();
      let L = t.events.length,
        I = L,
        k;
      for (; I--;) if (t.events[I][0] === "exit" && t.events[I][1].type === "chunkFlow") {
        k = t.events[I][1].end;
        break;
      }
      h(n);
      let S = L;
      for (; S < t.events.length;) t.events[S][1].end = {
        ...k
      }, S++;
      return nt(t.events, I + 1, 0, t.events.slice(L)), t.events.length = S, s(g);
    }
    return i(g);
  }
  function s(g) {
    if (n === a.length) {
      if (!r) return d(g);
      if (r.currentConstruct && r.currentConstruct.concrete) return x(g);
      t.interrupt = !!(r.currentConstruct && !r._gfmTableDynamicInterruptHack);
    }
    return t.containerState = {}, e.check(XL, c, f)(g);
  }
  function c(g) {
    return r && m(), h(n), d(g);
  }
  function f(g) {
    return t.parser.lazy[t.now().line] = n !== a.length, o = t.now().offset, x(g);
  }
  function d(g) {
    return t.containerState = {}, e.attempt(XL, p, x)(g);
  }
  function p(g) {
    return n++, a.push([t.currentConstruct, t.containerState]), d(g);
  }
  function x(g) {
    if (g === null) {
      r && m(), h(0), e.consume(g);
      return;
    }
    return r = r || t.parser.flow(t.now()), e.enter("chunkFlow", {
      _tokenizer: r,
      contentType: "flow",
      previous: l
    }), b(g);
  }
  function b(g) {
    if (g === null) {
      C(e.exit("chunkFlow"), !0), h(0), e.consume(g);
      return;
    }
    return U(g) ? (e.consume(g), C(e.exit("chunkFlow")), n = 0, t.interrupt = void 0, i) : (e.consume(g), b);
  }
  function C(g, L) {
    let I = t.sliceStream(g);
    if (L && I.push(null), g.previous = l, l && (l.next = g), l = g, r.defineSkip(g.start), r.write(I), t.parser.lazy[g.start.line]) {
      let k = r.events.length;
      for (; k--;) if (r.events[k][1].start.offset < o && (!r.events[k][1].end || r.events[k][1].end.offset > o)) return;
      let S = t.events.length,
        A = S,
        R,
        w;
      for (; A--;) if (t.events[A][0] === "exit" && t.events[A][1].type === "chunkFlow") {
        if (R) {
          w = t.events[A][1].end;
          break;
        }
        R = !0;
      }
      for (h(n), k = S; k < t.events.length;) t.events[k][1].end = {
        ...w
      }, k++;
      nt(t.events, A + 1, 0, t.events.slice(S)), t.events.length = k;
    }
  }
  function h(g) {
    let L = a.length;
    for (; L-- > g;) {
      let I = a[L];
      t.containerState = I[1], I[0].exit.call(t, e);
    }
    a.length = g;
  }
  function m() {
    r.write([null]), l = void 0, r = void 0, t.containerState._closeFlow = void 0;
  }
}
function aA(e, t, a) {
  return Q(e, e.attempt(this.parser.constructs.document, t, a), "linePrefix", this.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4);
}
function xn(e) {
  if (e === null || ce(e) || qa(e)) return 1;
  if (Hr(e)) return 2;
}
function rr(e, t, a) {
  let n = [],
    r = -1;
  for (; ++r < e.length;) {
    let l = e[r].resolveAll;
    l && !n.includes(l) && (t = l(t, a), n.push(l));
  }
  return t;
}
var Ki = {
  name: "attention",
  resolveAll: nA,
  tokenize: rA
};
function nA(e, t) {
  let a = -1,
    n,
    r,
    l,
    o,
    i,
    u,
    s,
    c;
  for (; ++a < e.length;) if (e[a][0] === "enter" && e[a][1].type === "attentionSequence" && e[a][1]._close) {
    for (n = a; n--;) if (e[n][0] === "exit" && e[n][1].type === "attentionSequence" && e[n][1]._open && t.sliceSerialize(e[n][1]).charCodeAt(0) === t.sliceSerialize(e[a][1]).charCodeAt(0)) {
      if ((e[n][1]._close || e[a][1]._open) && (e[a][1].end.offset - e[a][1].start.offset) % 3 && !((e[n][1].end.offset - e[n][1].start.offset + e[a][1].end.offset - e[a][1].start.offset) % 3)) continue;
      u = e[n][1].end.offset - e[n][1].start.offset > 1 && e[a][1].end.offset - e[a][1].start.offset > 1 ? 2 : 1;
      let f = {
          ...e[n][1].end
        },
        d = {
          ...e[a][1].start
        };
      YL(f, -u), YL(d, u), o = {
        type: u > 1 ? "strongSequence" : "emphasisSequence",
        start: f,
        end: {
          ...e[n][1].end
        }
      }, i = {
        type: u > 1 ? "strongSequence" : "emphasisSequence",
        start: {
          ...e[a][1].start
        },
        end: d
      }, l = {
        type: u > 1 ? "strongText" : "emphasisText",
        start: {
          ...e[n][1].end
        },
        end: {
          ...e[a][1].start
        }
      }, r = {
        type: u > 1 ? "strong" : "emphasis",
        start: {
          ...o.start
        },
        end: {
          ...i.end
        }
      }, e[n][1].end = {
        ...o.start
      }, e[a][1].start = {
        ...i.end
      }, s = [], e[n][1].end.offset - e[n][1].start.offset && (s = zt(s, [["enter", e[n][1], t], ["exit", e[n][1], t]])), s = zt(s, [["enter", r, t], ["enter", o, t], ["exit", o, t], ["enter", l, t]]), s = zt(s, rr(t.parser.constructs.insideSpan.null, e.slice(n + 1, a), t)), s = zt(s, [["exit", l, t], ["enter", i, t], ["exit", i, t], ["exit", r, t]]), e[a][1].end.offset - e[a][1].start.offset ? (c = 2, s = zt(s, [["enter", e[a][1], t], ["exit", e[a][1], t]])) : c = 0, nt(e, n - 1, a - n + 3, s), a = n + s.length - c - 2;
      break;
    }
  }
  for (a = -1; ++a < e.length;) e[a][1].type === "attentionSequence" && (e[a][1].type = "data");
  return e;
}
function rA(e, t) {
  let a = this.parser.constructs.attentionMarkers.null,
    n = this.previous,
    r = xn(n),
    l;
  return o;
  function o(u) {
    return l = u, e.enter("attentionSequence"), i(u);
  }
  function i(u) {
    if (u === l) return e.consume(u), i;
    let s = e.exit("attentionSequence"),
      c = xn(u),
      f = !c || c === 2 && r || a.includes(u),
      d = !r || r === 2 && c || a.includes(n);
    return s._open = !!(l === 42 ? f : f && (r || !d)), s._close = !!(l === 42 ? d : d && (c || !f)), t(u);
  }
}
function YL(e, t) {
  e.column += t, e.offset += t, e._bufferIndex += t;
}
var Wp = {
  name: "autolink",
  tokenize: lA
};
function lA(e, t, a) {
  let n = 0;
  return r;
  function r(p) {
    return e.enter("autolink"), e.enter("autolinkMarker"), e.consume(p), e.exit("autolinkMarker"), e.enter("autolinkProtocol"), l;
  }
  function l(p) {
    return mt(p) ? (e.consume(p), o) : p === 64 ? a(p) : s(p);
  }
  function o(p) {
    return p === 43 || p === 45 || p === 46 || We(p) ? (n = 1, i(p)) : s(p);
  }
  function i(p) {
    return p === 58 ? (e.consume(p), n = 0, u) : (p === 43 || p === 45 || p === 46 || We(p)) && n++ < 32 ? (e.consume(p), i) : (n = 0, s(p));
  }
  function u(p) {
    return p === 62 ? (e.exit("autolinkProtocol"), e.enter("autolinkMarker"), e.consume(p), e.exit("autolinkMarker"), e.exit("autolink"), t) : p === null || p === 32 || p === 60 || Fr(p) ? a(p) : (e.consume(p), u);
  }
  function s(p) {
    return p === 64 ? (e.consume(p), c) : HL(p) ? (e.consume(p), s) : a(p);
  }
  function c(p) {
    return We(p) ? f(p) : a(p);
  }
  function f(p) {
    return p === 46 ? (e.consume(p), n = 0, c) : p === 62 ? (e.exit("autolinkProtocol").type = "autolinkEmail", e.enter("autolinkMarker"), e.consume(p), e.exit("autolinkMarker"), e.exit("autolink"), t) : d(p);
  }
  function d(p) {
    if ((p === 45 || We(p)) && n++ < 63) {
      let x = p === 45 ? d : f;
      return e.consume(p), x;
    }
    return a(p);
  }
}
var Fa = {
  partial: !0,
  tokenize: oA
};
function oA(e, t, a) {
  return n;
  function n(l) {
    return W(l) ? Q(e, r, "linePrefix")(l) : r(l);
  }
  function r(l) {
    return l === null || U(l) ? t(l) : a(l);
  }
}
var rc = {
  continuation: {
    tokenize: uA
  },
  exit: sA,
  name: "blockQuote",
  tokenize: iA
};
function iA(e, t, a) {
  let n = this;
  return r;
  function r(o) {
    if (o === 62) {
      let i = n.containerState;
      return i.open || (e.enter("blockQuote", {
        _container: !0
      }), i.open = !0), e.enter("blockQuotePrefix"), e.enter("blockQuoteMarker"), e.consume(o), e.exit("blockQuoteMarker"), l;
    }
    return a(o);
  }
  function l(o) {
    return W(o) ? (e.enter("blockQuotePrefixWhitespace"), e.consume(o), e.exit("blockQuotePrefixWhitespace"), e.exit("blockQuotePrefix"), t) : (e.exit("blockQuotePrefix"), t(o));
  }
}
function uA(e, t, a) {
  let n = this;
  return r;
  function r(o) {
    return W(o) ? Q(e, l, "linePrefix", n.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(o) : l(o);
  }
  function l(o) {
    return e.attempt(rc, t, a)(o);
  }
}
function sA(e) {
  e.exit("blockQuote");
}
var lc = {
  name: "characterEscape",
  tokenize: cA
};
function cA(e, t, a) {
  return n;
  function n(l) {
    return e.enter("characterEscape"), e.enter("escapeMarker"), e.consume(l), e.exit("escapeMarker"), r;
  }
  function r(l) {
    return GL(l) ? (e.enter("characterEscapeValue"), e.consume(l), e.exit("characterEscapeValue"), e.exit("characterEscape"), t) : a(l);
  }
}
var oc = {
  name: "characterReference",
  tokenize: fA
};
function fA(e, t, a) {
  let n = this,
    r = 0,
    l,
    o;
  return i;
  function i(f) {
    return e.enter("characterReference"), e.enter("characterReferenceMarker"), e.consume(f), e.exit("characterReferenceMarker"), u;
  }
  function u(f) {
    return f === 35 ? (e.enter("characterReferenceMarkerNumeric"), e.consume(f), e.exit("characterReferenceMarkerNumeric"), s) : (e.enter("characterReferenceValue"), l = 31, o = We, c(f));
  }
  function s(f) {
    return f === 88 || f === 120 ? (e.enter("characterReferenceMarkerHexadecimal"), e.consume(f), e.exit("characterReferenceMarkerHexadecimal"), e.enter("characterReferenceValue"), l = 6, o = _L, c) : (e.enter("characterReferenceValue"), l = 7, o = Zi, c(f));
  }
  function c(f) {
    if (f === 59 && r) {
      let d = e.exit("characterReferenceValue");
      return o === We && !to(n.sliceSerialize(d)) ? a(f) : (e.enter("characterReferenceMarker"), e.consume(f), e.exit("characterReferenceMarker"), e.exit("characterReference"), t);
    }
    return o(f) && r++ < l ? (e.consume(f), c) : a(f);
  }
}
var QL = {
    partial: !0,
    tokenize: pA
  },
  ic = {
    concrete: !0,
    name: "codeFenced",
    tokenize: dA
  };
function dA(e, t, a) {
  let n = this,
    r = {
      partial: !0,
      tokenize: I
    },
    l = 0,
    o = 0,
    i;
  return u;
  function u(k) {
    return s(k);
  }
  function s(k) {
    let S = n.events[n.events.length - 1];
    return l = S && S[1].type === "linePrefix" ? S[2].sliceSerialize(S[1], !0).length : 0, i = k, e.enter("codeFenced"), e.enter("codeFencedFence"), e.enter("codeFencedFenceSequence"), c(k);
  }
  function c(k) {
    return k === i ? (o++, e.consume(k), c) : o < 3 ? a(k) : (e.exit("codeFencedFenceSequence"), W(k) ? Q(e, f, "whitespace")(k) : f(k));
  }
  function f(k) {
    return k === null || U(k) ? (e.exit("codeFencedFence"), n.interrupt ? t(k) : e.check(QL, b, L)(k)) : (e.enter("codeFencedFenceInfo"), e.enter("chunkString", {
      contentType: "string"
    }), d(k));
  }
  function d(k) {
    return k === null || U(k) ? (e.exit("chunkString"), e.exit("codeFencedFenceInfo"), f(k)) : W(k) ? (e.exit("chunkString"), e.exit("codeFencedFenceInfo"), Q(e, p, "whitespace")(k)) : k === 96 && k === i ? a(k) : (e.consume(k), d);
  }
  function p(k) {
    return k === null || U(k) ? f(k) : (e.enter("codeFencedFenceMeta"), e.enter("chunkString", {
      contentType: "string"
    }), x(k));
  }
  function x(k) {
    return k === null || U(k) ? (e.exit("chunkString"), e.exit("codeFencedFenceMeta"), f(k)) : k === 96 && k === i ? a(k) : (e.consume(k), x);
  }
  function b(k) {
    return e.attempt(r, L, C)(k);
  }
  function C(k) {
    return e.enter("lineEnding"), e.consume(k), e.exit("lineEnding"), h;
  }
  function h(k) {
    return l > 0 && W(k) ? Q(e, m, "linePrefix", l + 1)(k) : m(k);
  }
  function m(k) {
    return k === null || U(k) ? e.check(QL, b, L)(k) : (e.enter("codeFlowValue"), g(k));
  }
  function g(k) {
    return k === null || U(k) ? (e.exit("codeFlowValue"), m(k)) : (e.consume(k), g);
  }
  function L(k) {
    return e.exit("codeFenced"), t(k);
  }
  function I(k, S, A) {
    let R = 0;
    return w;
    function w(J) {
      return k.enter("lineEnding"), k.consume(J), k.exit("lineEnding"), N;
    }
    function N(J) {
      return k.enter("codeFencedFence"), W(J) ? Q(k, $, "linePrefix", n.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(J) : $(J);
    }
    function $(J) {
      return J === i ? (k.enter("codeFencedFenceSequence"), q(J)) : A(J);
    }
    function q(J) {
      return J === i ? (R++, k.consume(J), q) : R >= o ? (k.exit("codeFencedFenceSequence"), W(J) ? Q(k, K, "whitespace")(J) : K(J)) : A(J);
    }
    function K(J) {
      return J === null || U(J) ? (k.exit("codeFencedFence"), S(J)) : A(J);
    }
  }
}
function pA(e, t, a) {
  let n = this;
  return r;
  function r(o) {
    return o === null ? a(o) : (e.enter("lineEnding"), e.consume(o), e.exit("lineEnding"), l);
  }
  function l(o) {
    return n.parser.lazy[n.now().line] ? a(o) : t(o);
  }
}
var Wi = {
    name: "codeIndented",
    tokenize: hA
  },
  mA = {
    partial: !0,
    tokenize: gA
  };
function hA(e, t, a) {
  let n = this;
  return r;
  function r(s) {
    return e.enter("codeIndented"), Q(e, l, "linePrefix", 5)(s);
  }
  function l(s) {
    let c = n.events[n.events.length - 1];
    return c && c[1].type === "linePrefix" && c[2].sliceSerialize(c[1], !0).length >= 4 ? o(s) : a(s);
  }
  function o(s) {
    return s === null ? u(s) : U(s) ? e.attempt(mA, o, u)(s) : (e.enter("codeFlowValue"), i(s));
  }
  function i(s) {
    return s === null || U(s) ? (e.exit("codeFlowValue"), o(s)) : (e.consume(s), i);
  }
  function u(s) {
    return e.exit("codeIndented"), t(s);
  }
}
function gA(e, t, a) {
  let n = this;
  return r;
  function r(o) {
    return n.parser.lazy[n.now().line] ? a(o) : U(o) ? (e.enter("lineEnding"), e.consume(o), e.exit("lineEnding"), r) : Q(e, l, "linePrefix", 5)(o);
  }
  function l(o) {
    let i = n.events[n.events.length - 1];
    return i && i[1].type === "linePrefix" && i[2].sliceSerialize(i[1], !0).length >= 4 ? t(o) : U(o) ? r(o) : a(o);
  }
}
var Jp = {
  name: "codeText",
  previous: yA,
  resolve: xA,
  tokenize: bA
};
function xA(e) {
  let t = e.length - 4,
    a = 3,
    n,
    r;
  if ((e[a][1].type === "lineEnding" || e[a][1].type === "space") && (e[t][1].type === "lineEnding" || e[t][1].type === "space")) {
    for (n = a; ++n < t;) if (e[n][1].type === "codeTextData") {
      e[a][1].type = "codeTextPadding", e[t][1].type = "codeTextPadding", a += 2, t -= 2;
      break;
    }
  }
  for (n = a - 1, t++; ++n <= t;) r === void 0 ? n !== t && e[n][1].type !== "lineEnding" && (r = n) : (n === t || e[n][1].type === "lineEnding") && (e[r][1].type = "codeTextData", n !== r + 2 && (e[r][1].end = e[n - 1][1].end, e.splice(r + 2, n - r - 2), t -= n - r - 2, n = r + 2), r = void 0);
  return e;
}
function yA(e) {
  return e !== 96 || this.events[this.events.length - 1][1].type === "characterEscape";
}
function bA(e, t, a) {
  let n = this,
    r = 0,
    l,
    o;
  return i;
  function i(d) {
    return e.enter("codeText"), e.enter("codeTextSequence"), u(d);
  }
  function u(d) {
    return d === 96 ? (e.consume(d), r++, u) : (e.exit("codeTextSequence"), s(d));
  }
  function s(d) {
    return d === null ? a(d) : d === 32 ? (e.enter("space"), e.consume(d), e.exit("space"), s) : d === 96 ? (o = e.enter("codeTextSequence"), l = 0, f(d)) : U(d) ? (e.enter("lineEnding"), e.consume(d), e.exit("lineEnding"), s) : (e.enter("codeTextData"), c(d));
  }
  function c(d) {
    return d === null || d === 32 || d === 96 || U(d) ? (e.exit("codeTextData"), s(d)) : (e.consume(d), c);
  }
  function f(d) {
    return d === 96 ? (e.consume(d), l++, f) : l === r ? (e.exit("codeTextSequence"), e.exit("codeText"), t(d)) : (o.type = "codeTextData", c(d));
  }
}
var uc = class {
  constructor(t) {
    this.left = t ? [...t] : [], this.right = [];
  }
  get(t) {
    if (t < 0 || t >= this.left.length + this.right.length) throw new RangeError("Cannot access index `" + t + "` in a splice buffer of size `" + (this.left.length + this.right.length) + "`");
    return t < this.left.length ? this.left[t] : this.right[this.right.length - t + this.left.length - 1];
  }
  get length() {
    return this.left.length + this.right.length;
  }
  shift() {
    return this.setCursor(0), this.right.pop();
  }
  slice(t, a) {
    let n = a ?? Number.POSITIVE_INFINITY;
    return n < this.left.length ? this.left.slice(t, n) : t > this.left.length ? this.right.slice(this.right.length - n + this.left.length, this.right.length - t + this.left.length).reverse() : this.left.slice(t).concat(this.right.slice(this.right.length - n + this.left.length).reverse());
  }
  splice(t, a, n) {
    let r = a || 0;
    this.setCursor(Math.trunc(t));
    let l = this.right.splice(this.right.length - r, Number.POSITIVE_INFINITY);
    return n && Ji(this.left, n), l.reverse();
  }
  pop() {
    return this.setCursor(Number.POSITIVE_INFINITY), this.left.pop();
  }
  push(t) {
    this.setCursor(Number.POSITIVE_INFINITY), this.left.push(t);
  }
  pushMany(t) {
    this.setCursor(Number.POSITIVE_INFINITY), Ji(this.left, t);
  }
  unshift(t) {
    this.setCursor(0), this.right.push(t);
  }
  unshiftMany(t) {
    this.setCursor(0), Ji(this.right, t.reverse());
  }
  setCursor(t) {
    if (!(t === this.left.length || t > this.left.length && this.right.length === 0 || t < 0 && this.left.length === 0)) if (t < this.left.length) {
      let a = this.left.splice(t, Number.POSITIVE_INFINITY);
      Ji(this.right, a.reverse());
    } else {
      let a = this.right.splice(this.left.length + this.right.length - t, Number.POSITIVE_INFINITY);
      Ji(this.left, a.reverse());
    }
  }
};
function Ji(e, t) {
  let a = 0;
  if (t.length < 1e4) e.push(...t);else for (; a < t.length;) e.push(...t.slice(a, a + 1e4)), a += 1e4;
}
function sc(e) {
  let t = {},
    a = -1,
    n,
    r,
    l,
    o,
    i,
    u,
    s,
    c = new uc(e);
  for (; ++a < c.length;) {
    for (; a in t;) a = t[a];
    if (n = c.get(a), a && n[1].type === "chunkFlow" && c.get(a - 1)[1].type === "listItemPrefix" && (u = n[1]._tokenizer.events, l = 0, l < u.length && u[l][1].type === "lineEndingBlank" && (l += 2), l < u.length && u[l][1].type === "content")) for (; ++l < u.length && u[l][1].type !== "content";) u[l][1].type === "chunkText" && (u[l][1]._isInFirstContentOfListItem = !0, l++);
    if (n[0] === "enter") n[1].contentType && (Object.assign(t, vA(c, a)), a = t[a], s = !0);else if (n[1]._container) {
      for (l = a, r = void 0; l--;) if (o = c.get(l), o[1].type === "lineEnding" || o[1].type === "lineEndingBlank") o[0] === "enter" && (r && (c.get(r)[1].type = "lineEndingBlank"), o[1].type = "lineEnding", r = l);else if (!(o[1].type === "linePrefix" || o[1].type === "listItemIndent")) break;
      r && (n[1].end = {
        ...c.get(r)[1].start
      }, i = c.slice(r, a), i.unshift(n), c.splice(r, a - r + 1, i));
    }
  }
  return nt(e, 0, Number.POSITIVE_INFINITY, c.slice(0)), !s;
}
function vA(e, t) {
  let a = e.get(t)[1],
    n = e.get(t)[2],
    r = t - 1,
    l = [],
    o = a._tokenizer;
  o || (o = n.parser[a.contentType](a.start), a._contentTypeTextTrailing && (o._contentTypeTextTrailing = !0));
  let i = o.events,
    u = [],
    s = {},
    c,
    f,
    d = -1,
    p = a,
    x = 0,
    b = 0,
    C = [b];
  for (; p;) {
    for (; e.get(++r)[1] !== p;);
    l.push(r), p._tokenizer || (c = n.sliceStream(p), p.next || c.push(null), f && o.defineSkip(p.start), p._isInFirstContentOfListItem && (o._gfmTasklistFirstContentOfListItem = !0), o.write(c), p._isInFirstContentOfListItem && (o._gfmTasklistFirstContentOfListItem = void 0)), f = p, p = p.next;
  }
  for (p = a; ++d < i.length;) i[d][0] === "exit" && i[d - 1][0] === "enter" && i[d][1].type === i[d - 1][1].type && i[d][1].start.line !== i[d][1].end.line && (b = d + 1, C.push(b), p._tokenizer = void 0, p.previous = void 0, p = p.next);
  for (o.events = [], p ? (p._tokenizer = void 0, p.previous = void 0) : C.pop(), d = C.length; d--;) {
    let h = i.slice(C[d], C[d + 1]),
      m = l.pop();
    u.push([m, m + h.length - 1]), e.splice(m, 2, h);
  }
  for (u.reverse(), d = -1; ++d < u.length;) s[x + u[d][0]] = x + u[d][1], x += u[d][1] - u[d][0] - 1;
  return s;
}
var $p = {
    resolve: kA,
    tokenize: wA
  },
  LA = {
    partial: !0,
    tokenize: SA
  };
function kA(e) {
  return sc(e), e;
}
function wA(e, t) {
  let a;
  return n;
  function n(i) {
    return e.enter("content"), a = e.enter("chunkContent", {
      contentType: "content"
    }), r(i);
  }
  function r(i) {
    return i === null ? l(i) : U(i) ? e.check(LA, o, l)(i) : (e.consume(i), r);
  }
  function l(i) {
    return e.exit("chunkContent"), e.exit("content"), t(i);
  }
  function o(i) {
    return e.consume(i), e.exit("chunkContent"), a.next = e.enter("chunkContent", {
      contentType: "content",
      previous: a
    }), a = a.next, r;
  }
}
function SA(e, t, a) {
  let n = this;
  return r;
  function r(o) {
    return e.exit("chunkContent"), e.enter("lineEnding"), e.consume(o), e.exit("lineEnding"), Q(e, l, "linePrefix");
  }
  function l(o) {
    if (o === null || U(o)) return a(o);
    let i = n.events[n.events.length - 1];
    return !n.parser.constructs.disable.null.includes("codeIndented") && i && i[1].type === "linePrefix" && i[2].sliceSerialize(i[1], !0).length >= 4 ? t(o) : e.interrupt(n.parser.constructs.flow, a, t)(o);
  }
}
function cc(e, t, a, n, r, l, o, i, u) {
  let s = u || Number.POSITIVE_INFINITY,
    c = 0;
  return f;
  function f(h) {
    return h === 60 ? (e.enter(n), e.enter(r), e.enter(l), e.consume(h), e.exit(l), d) : h === null || h === 32 || h === 41 || Fr(h) ? a(h) : (e.enter(n), e.enter(o), e.enter(i), e.enter("chunkString", {
      contentType: "string"
    }), b(h));
  }
  function d(h) {
    return h === 62 ? (e.enter(l), e.consume(h), e.exit(l), e.exit(r), e.exit(n), t) : (e.enter(i), e.enter("chunkString", {
      contentType: "string"
    }), p(h));
  }
  function p(h) {
    return h === 62 ? (e.exit("chunkString"), e.exit(i), d(h)) : h === null || h === 60 || U(h) ? a(h) : (e.consume(h), h === 92 ? x : p);
  }
  function x(h) {
    return h === 60 || h === 62 || h === 92 ? (e.consume(h), p) : p(h);
  }
  function b(h) {
    return !c && (h === null || h === 41 || ce(h)) ? (e.exit("chunkString"), e.exit(i), e.exit(o), e.exit(n), t(h)) : c < s && h === 40 ? (e.consume(h), c++, b) : h === 41 ? (e.consume(h), c--, b) : h === null || h === 32 || h === 40 || Fr(h) ? a(h) : (e.consume(h), h === 92 ? C : b);
  }
  function C(h) {
    return h === 40 || h === 41 || h === 92 ? (e.consume(h), b) : b(h);
  }
}
function fc(e, t, a, n, r, l) {
  let o = this,
    i = 0,
    u;
  return s;
  function s(p) {
    return e.enter(n), e.enter(r), e.consume(p), e.exit(r), e.enter(l), c;
  }
  function c(p) {
    return i > 999 || p === null || p === 91 || p === 93 && !u || p === 94 && !i && "_hiddenFootnoteSupport" in o.parser.constructs ? a(p) : p === 93 ? (e.exit(l), e.enter(r), e.consume(p), e.exit(r), e.exit(n), t) : U(p) ? (e.enter("lineEnding"), e.consume(p), e.exit("lineEnding"), c) : (e.enter("chunkString", {
      contentType: "string"
    }), f(p));
  }
  function f(p) {
    return p === null || p === 91 || p === 93 || U(p) || i++ > 999 ? (e.exit("chunkString"), c(p)) : (e.consume(p), u || (u = !W(p)), p === 92 ? d : f);
  }
  function d(p) {
    return p === 91 || p === 92 || p === 93 ? (e.consume(p), i++, f) : f(p);
  }
}
function dc(e, t, a, n, r, l) {
  let o;
  return i;
  function i(d) {
    return d === 34 || d === 39 || d === 40 ? (e.enter(n), e.enter(r), e.consume(d), e.exit(r), o = d === 40 ? 41 : d, u) : a(d);
  }
  function u(d) {
    return d === o ? (e.enter(r), e.consume(d), e.exit(r), e.exit(n), t) : (e.enter(l), s(d));
  }
  function s(d) {
    return d === o ? (e.exit(l), u(o)) : d === null ? a(d) : U(d) ? (e.enter("lineEnding"), e.consume(d), e.exit("lineEnding"), Q(e, s, "linePrefix")) : (e.enter("chunkString", {
      contentType: "string"
    }), c(d));
  }
  function c(d) {
    return d === o || d === null || U(d) ? (e.exit("chunkString"), s(d)) : (e.consume(d), d === 92 ? f : c);
  }
  function f(d) {
    return d === o || d === 92 ? (e.consume(d), c) : c(d);
  }
}
function _r(e, t) {
  let a;
  return n;
  function n(r) {
    return U(r) ? (e.enter("lineEnding"), e.consume(r), e.exit("lineEnding"), a = !0, n) : W(r) ? Q(e, n, a ? "linePrefix" : "lineSuffix")(r) : t(r);
  }
}
var em = {
    name: "definition",
    tokenize: IA
  },
  CA = {
    partial: !0,
    tokenize: AA
  };
function IA(e, t, a) {
  let n = this,
    r;
  return l;
  function l(p) {
    return e.enter("definition"), o(p);
  }
  function o(p) {
    return fc.call(n, e, i, a, "definitionLabel", "definitionLabelMarker", "definitionLabelString")(p);
  }
  function i(p) {
    return r = Mt(n.sliceSerialize(n.events[n.events.length - 1][1]).slice(1, -1)), p === 58 ? (e.enter("definitionMarker"), e.consume(p), e.exit("definitionMarker"), u) : a(p);
  }
  function u(p) {
    return ce(p) ? _r(e, s)(p) : s(p);
  }
  function s(p) {
    return cc(e, c, a, "definitionDestination", "definitionDestinationLiteral", "definitionDestinationLiteralMarker", "definitionDestinationRaw", "definitionDestinationString")(p);
  }
  function c(p) {
    return e.attempt(CA, f, f)(p);
  }
  function f(p) {
    return W(p) ? Q(e, d, "whitespace")(p) : d(p);
  }
  function d(p) {
    return p === null || U(p) ? (e.exit("definition"), n.parser.defined.push(r), t(p)) : a(p);
  }
}
function AA(e, t, a) {
  return n;
  function n(i) {
    return ce(i) ? _r(e, r)(i) : a(i);
  }
  function r(i) {
    return dc(e, l, a, "definitionTitle", "definitionTitleMarker", "definitionTitleString")(i);
  }
  function l(i) {
    return W(i) ? Q(e, o, "whitespace")(i) : o(i);
  }
  function o(i) {
    return i === null || U(i) ? t(i) : a(i);
  }
}
var tm = {
  name: "hardBreakEscape",
  tokenize: TA
};
function TA(e, t, a) {
  return n;
  function n(l) {
    return e.enter("hardBreakEscape"), e.consume(l), r;
  }
  function r(l) {
    return U(l) ? (e.exit("hardBreakEscape"), t(l)) : a(l);
  }
}
var am = {
  name: "headingAtx",
  resolve: MA,
  tokenize: DA
};
function MA(e, t) {
  let a = e.length - 2,
    n = 3,
    r,
    l;
  return e[n][1].type === "whitespace" && (n += 2), a - 2 > n && e[a][1].type === "whitespace" && (a -= 2), e[a][1].type === "atxHeadingSequence" && (n === a - 1 || a - 4 > n && e[a - 2][1].type === "whitespace") && (a -= n + 1 === a ? 2 : 4), a > n && (r = {
    type: "atxHeadingText",
    start: e[n][1].start,
    end: e[a][1].end
  }, l = {
    type: "chunkText",
    start: e[n][1].start,
    end: e[a][1].end,
    contentType: "text"
  }, nt(e, n, a - n + 1, [["enter", r, t], ["enter", l, t], ["exit", l, t], ["exit", r, t]])), e;
}
function DA(e, t, a) {
  let n = 0;
  return r;
  function r(c) {
    return e.enter("atxHeading"), l(c);
  }
  function l(c) {
    return e.enter("atxHeadingSequence"), o(c);
  }
  function o(c) {
    return c === 35 && n++ < 6 ? (e.consume(c), o) : c === null || ce(c) ? (e.exit("atxHeadingSequence"), i(c)) : a(c);
  }
  function i(c) {
    return c === 35 ? (e.enter("atxHeadingSequence"), u(c)) : c === null || U(c) ? (e.exit("atxHeading"), t(c)) : W(c) ? Q(e, i, "whitespace")(c) : (e.enter("atxHeadingText"), s(c));
  }
  function u(c) {
    return c === 35 ? (e.consume(c), u) : (e.exit("atxHeadingSequence"), i(c));
  }
  function s(c) {
    return c === null || c === 35 || ce(c) ? (e.exit("atxHeadingText"), i(c)) : (e.consume(c), s);
  }
}
var ZL = ["address", "article", "aside", "base", "basefont", "blockquote", "body", "caption", "center", "col", "colgroup", "dd", "details", "dialog", "dir", "div", "dl", "dt", "fieldset", "figcaption", "figure", "footer", "form", "frame", "frameset", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hr", "html", "iframe", "legend", "li", "link", "main", "menu", "menuitem", "nav", "noframes", "ol", "optgroup", "option", "p", "param", "search", "section", "summary", "table", "tbody", "td", "tfoot", "th", "thead", "title", "tr", "track", "ul"],
  nm = ["pre", "script", "style", "textarea"];
var rm = {
    concrete: !0,
    name: "htmlFlow",
    resolveTo: RA,
    tokenize: NA
  },
  BA = {
    partial: !0,
    tokenize: OA
  },
  EA = {
    partial: !0,
    tokenize: zA
  };
function RA(e) {
  let t = e.length;
  for (; t-- && !(e[t][0] === "enter" && e[t][1].type === "htmlFlow"););
  return t > 1 && e[t - 2][1].type === "linePrefix" && (e[t][1].start = e[t - 2][1].start, e[t + 1][1].start = e[t - 2][1].start, e.splice(t - 2, 2)), e;
}
function NA(e, t, a) {
  let n = this,
    r,
    l,
    o,
    i,
    u;
  return s;
  function s(v) {
    return c(v);
  }
  function c(v) {
    return e.enter("htmlFlow"), e.enter("htmlFlowData"), e.consume(v), f;
  }
  function f(v) {
    return v === 33 ? (e.consume(v), d) : v === 47 ? (e.consume(v), l = !0, b) : v === 63 ? (e.consume(v), r = 3, n.interrupt ? t : y) : mt(v) ? (e.consume(v), o = String.fromCharCode(v), C) : a(v);
  }
  function d(v) {
    return v === 45 ? (e.consume(v), r = 2, p) : v === 91 ? (e.consume(v), r = 5, i = 0, x) : mt(v) ? (e.consume(v), r = 4, n.interrupt ? t : y) : a(v);
  }
  function p(v) {
    return v === 45 ? (e.consume(v), n.interrupt ? t : y) : a(v);
  }
  function x(v) {
    let ct = "CDATA[";
    return v === ct.charCodeAt(i++) ? (e.consume(v), i === ct.length ? n.interrupt ? t : $ : x) : a(v);
  }
  function b(v) {
    return mt(v) ? (e.consume(v), o = String.fromCharCode(v), C) : a(v);
  }
  function C(v) {
    if (v === null || v === 47 || v === 62 || ce(v)) {
      let ct = v === 47,
        ze = o.toLowerCase();
      return !ct && !l && nm.includes(ze) ? (r = 1, n.interrupt ? t(v) : $(v)) : ZL.includes(o.toLowerCase()) ? (r = 6, ct ? (e.consume(v), h) : n.interrupt ? t(v) : $(v)) : (r = 7, n.interrupt && !n.parser.lazy[n.now().line] ? a(v) : l ? m(v) : g(v));
    }
    return v === 45 || We(v) ? (e.consume(v), o += String.fromCharCode(v), C) : a(v);
  }
  function h(v) {
    return v === 62 ? (e.consume(v), n.interrupt ? t : $) : a(v);
  }
  function m(v) {
    return W(v) ? (e.consume(v), m) : w(v);
  }
  function g(v) {
    return v === 47 ? (e.consume(v), w) : v === 58 || v === 95 || mt(v) ? (e.consume(v), L) : W(v) ? (e.consume(v), g) : w(v);
  }
  function L(v) {
    return v === 45 || v === 46 || v === 58 || v === 95 || We(v) ? (e.consume(v), L) : I(v);
  }
  function I(v) {
    return v === 61 ? (e.consume(v), k) : W(v) ? (e.consume(v), I) : g(v);
  }
  function k(v) {
    return v === null || v === 60 || v === 61 || v === 62 || v === 96 ? a(v) : v === 34 || v === 39 ? (e.consume(v), u = v, S) : W(v) ? (e.consume(v), k) : A(v);
  }
  function S(v) {
    return v === u ? (e.consume(v), u = null, R) : v === null || U(v) ? a(v) : (e.consume(v), S);
  }
  function A(v) {
    return v === null || v === 34 || v === 39 || v === 47 || v === 60 || v === 61 || v === 62 || v === 96 || ce(v) ? I(v) : (e.consume(v), A);
  }
  function R(v) {
    return v === 47 || v === 62 || W(v) ? g(v) : a(v);
  }
  function w(v) {
    return v === 62 ? (e.consume(v), N) : a(v);
  }
  function N(v) {
    return v === null || U(v) ? $(v) : W(v) ? (e.consume(v), N) : a(v);
  }
  function $(v) {
    return v === 45 && r === 2 ? (e.consume(v), se) : v === 60 && r === 1 ? (e.consume(v), ye) : v === 62 && r === 4 ? (e.consume(v), ie) : v === 63 && r === 3 ? (e.consume(v), y) : v === 93 && r === 5 ? (e.consume(v), Y) : U(v) && (r === 6 || r === 7) ? (e.exit("htmlFlowData"), e.check(BA, Re, q)(v)) : v === null || U(v) ? (e.exit("htmlFlowData"), q(v)) : (e.consume(v), $);
  }
  function q(v) {
    return e.check(EA, K, Re)(v);
  }
  function K(v) {
    return e.enter("lineEnding"), e.consume(v), e.exit("lineEnding"), J;
  }
  function J(v) {
    return v === null || U(v) ? q(v) : (e.enter("htmlFlowData"), $(v));
  }
  function se(v) {
    return v === 45 ? (e.consume(v), y) : $(v);
  }
  function ye(v) {
    return v === 47 ? (e.consume(v), o = "", st) : $(v);
  }
  function st(v) {
    if (v === 62) {
      let ct = o.toLowerCase();
      return nm.includes(ct) ? (e.consume(v), ie) : $(v);
    }
    return mt(v) && o.length < 8 ? (e.consume(v), o += String.fromCharCode(v), st) : $(v);
  }
  function Y(v) {
    return v === 93 ? (e.consume(v), y) : $(v);
  }
  function y(v) {
    return v === 62 ? (e.consume(v), ie) : v === 45 && r === 2 ? (e.consume(v), y) : $(v);
  }
  function ie(v) {
    return v === null || U(v) ? (e.exit("htmlFlowData"), Re(v)) : (e.consume(v), ie);
  }
  function Re(v) {
    return e.exit("htmlFlow"), t(v);
  }
}
function zA(e, t, a) {
  let n = this;
  return r;
  function r(o) {
    return U(o) ? (e.enter("lineEnding"), e.consume(o), e.exit("lineEnding"), l) : a(o);
  }
  function l(o) {
    return n.parser.lazy[n.now().line] ? a(o) : t(o);
  }
}
function OA(e, t, a) {
  return n;
  function n(r) {
    return e.enter("lineEnding"), e.consume(r), e.exit("lineEnding"), e.attempt(Fa, t, a);
  }
}
var lm = {
  name: "htmlText",
  tokenize: PA
};
function PA(e, t, a) {
  let n = this,
    r,
    l,
    o;
  return i;
  function i(y) {
    return e.enter("htmlText"), e.enter("htmlTextData"), e.consume(y), u;
  }
  function u(y) {
    return y === 33 ? (e.consume(y), s) : y === 47 ? (e.consume(y), I) : y === 63 ? (e.consume(y), g) : mt(y) ? (e.consume(y), A) : a(y);
  }
  function s(y) {
    return y === 45 ? (e.consume(y), c) : y === 91 ? (e.consume(y), l = 0, x) : mt(y) ? (e.consume(y), m) : a(y);
  }
  function c(y) {
    return y === 45 ? (e.consume(y), p) : a(y);
  }
  function f(y) {
    return y === null ? a(y) : y === 45 ? (e.consume(y), d) : U(y) ? (o = f, ye(y)) : (e.consume(y), f);
  }
  function d(y) {
    return y === 45 ? (e.consume(y), p) : f(y);
  }
  function p(y) {
    return y === 62 ? se(y) : y === 45 ? d(y) : f(y);
  }
  function x(y) {
    let ie = "CDATA[";
    return y === ie.charCodeAt(l++) ? (e.consume(y), l === ie.length ? b : x) : a(y);
  }
  function b(y) {
    return y === null ? a(y) : y === 93 ? (e.consume(y), C) : U(y) ? (o = b, ye(y)) : (e.consume(y), b);
  }
  function C(y) {
    return y === 93 ? (e.consume(y), h) : b(y);
  }
  function h(y) {
    return y === 62 ? se(y) : y === 93 ? (e.consume(y), h) : b(y);
  }
  function m(y) {
    return y === null || y === 62 ? se(y) : U(y) ? (o = m, ye(y)) : (e.consume(y), m);
  }
  function g(y) {
    return y === null ? a(y) : y === 63 ? (e.consume(y), L) : U(y) ? (o = g, ye(y)) : (e.consume(y), g);
  }
  function L(y) {
    return y === 62 ? se(y) : g(y);
  }
  function I(y) {
    return mt(y) ? (e.consume(y), k) : a(y);
  }
  function k(y) {
    return y === 45 || We(y) ? (e.consume(y), k) : S(y);
  }
  function S(y) {
    return U(y) ? (o = S, ye(y)) : W(y) ? (e.consume(y), S) : se(y);
  }
  function A(y) {
    return y === 45 || We(y) ? (e.consume(y), A) : y === 47 || y === 62 || ce(y) ? R(y) : a(y);
  }
  function R(y) {
    return y === 47 ? (e.consume(y), se) : y === 58 || y === 95 || mt(y) ? (e.consume(y), w) : U(y) ? (o = R, ye(y)) : W(y) ? (e.consume(y), R) : se(y);
  }
  function w(y) {
    return y === 45 || y === 46 || y === 58 || y === 95 || We(y) ? (e.consume(y), w) : N(y);
  }
  function N(y) {
    return y === 61 ? (e.consume(y), $) : U(y) ? (o = N, ye(y)) : W(y) ? (e.consume(y), N) : R(y);
  }
  function $(y) {
    return y === null || y === 60 || y === 61 || y === 62 || y === 96 ? a(y) : y === 34 || y === 39 ? (e.consume(y), r = y, q) : U(y) ? (o = $, ye(y)) : W(y) ? (e.consume(y), $) : (e.consume(y), K);
  }
  function q(y) {
    return y === r ? (e.consume(y), r = void 0, J) : y === null ? a(y) : U(y) ? (o = q, ye(y)) : (e.consume(y), q);
  }
  function K(y) {
    return y === null || y === 34 || y === 39 || y === 60 || y === 61 || y === 96 ? a(y) : y === 47 || y === 62 || ce(y) ? R(y) : (e.consume(y), K);
  }
  function J(y) {
    return y === 47 || y === 62 || ce(y) ? R(y) : a(y);
  }
  function se(y) {
    return y === 62 ? (e.consume(y), e.exit("htmlTextData"), e.exit("htmlText"), t) : a(y);
  }
  function ye(y) {
    return e.exit("htmlTextData"), e.enter("lineEnding"), e.consume(y), e.exit("lineEnding"), st;
  }
  function st(y) {
    return W(y) ? Q(e, Y, "linePrefix", n.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(y) : Y(y);
  }
  function Y(y) {
    return e.enter("htmlTextData"), o(y);
  }
}
var Gr = {
    name: "labelEnd",
    resolveAll: HA,
    resolveTo: _A,
    tokenize: GA
  },
  UA = {
    tokenize: VA
  },
  qA = {
    tokenize: XA
  },
  FA = {
    tokenize: jA
  };
function HA(e) {
  let t = -1,
    a = [];
  for (; ++t < e.length;) {
    let n = e[t][1];
    if (a.push(e[t]), n.type === "labelImage" || n.type === "labelLink" || n.type === "labelEnd") {
      let r = n.type === "labelImage" ? 4 : 2;
      n.type = "data", t += r;
    }
  }
  return e.length !== a.length && nt(e, 0, e.length, a), e;
}
function _A(e, t) {
  let a = e.length,
    n = 0,
    r,
    l,
    o,
    i;
  for (; a--;) if (r = e[a][1], l) {
    if (r.type === "link" || r.type === "labelLink" && r._inactive) break;
    e[a][0] === "enter" && r.type === "labelLink" && (r._inactive = !0);
  } else if (o) {
    if (e[a][0] === "enter" && (r.type === "labelImage" || r.type === "labelLink") && !r._balanced && (l = a, r.type !== "labelLink")) {
      n = 2;
      break;
    }
  } else r.type === "labelEnd" && (o = a);
  let u = {
      type: e[l][1].type === "labelLink" ? "link" : "image",
      start: {
        ...e[l][1].start
      },
      end: {
        ...e[e.length - 1][1].end
      }
    },
    s = {
      type: "label",
      start: {
        ...e[l][1].start
      },
      end: {
        ...e[o][1].end
      }
    },
    c = {
      type: "labelText",
      start: {
        ...e[l + n + 2][1].end
      },
      end: {
        ...e[o - 2][1].start
      }
    };
  return i = [["enter", u, t], ["enter", s, t]], i = zt(i, e.slice(l + 1, l + n + 3)), i = zt(i, [["enter", c, t]]), i = zt(i, rr(t.parser.constructs.insideSpan.null, e.slice(l + n + 4, o - 3), t)), i = zt(i, [["exit", c, t], e[o - 2], e[o - 1], ["exit", s, t]]), i = zt(i, e.slice(o + 1)), i = zt(i, [["exit", u, t]]), nt(e, l, e.length, i), e;
}
function GA(e, t, a) {
  let n = this,
    r = n.events.length,
    l,
    o;
  for (; r--;) if ((n.events[r][1].type === "labelImage" || n.events[r][1].type === "labelLink") && !n.events[r][1]._balanced) {
    l = n.events[r][1];
    break;
  }
  return i;
  function i(d) {
    return l ? l._inactive ? f(d) : (o = n.parser.defined.includes(Mt(n.sliceSerialize({
      start: l.end,
      end: n.now()
    }))), e.enter("labelEnd"), e.enter("labelMarker"), e.consume(d), e.exit("labelMarker"), e.exit("labelEnd"), u) : a(d);
  }
  function u(d) {
    return d === 40 ? e.attempt(UA, c, o ? c : f)(d) : d === 91 ? e.attempt(qA, c, o ? s : f)(d) : o ? c(d) : f(d);
  }
  function s(d) {
    return e.attempt(FA, c, f)(d);
  }
  function c(d) {
    return t(d);
  }
  function f(d) {
    return l._balanced = !0, a(d);
  }
}
function VA(e, t, a) {
  return n;
  function n(f) {
    return e.enter("resource"), e.enter("resourceMarker"), e.consume(f), e.exit("resourceMarker"), r;
  }
  function r(f) {
    return ce(f) ? _r(e, l)(f) : l(f);
  }
  function l(f) {
    return f === 41 ? c(f) : cc(e, o, i, "resourceDestination", "resourceDestinationLiteral", "resourceDestinationLiteralMarker", "resourceDestinationRaw", "resourceDestinationString", 32)(f);
  }
  function o(f) {
    return ce(f) ? _r(e, u)(f) : c(f);
  }
  function i(f) {
    return a(f);
  }
  function u(f) {
    return f === 34 || f === 39 || f === 40 ? dc(e, s, a, "resourceTitle", "resourceTitleMarker", "resourceTitleString")(f) : c(f);
  }
  function s(f) {
    return ce(f) ? _r(e, c)(f) : c(f);
  }
  function c(f) {
    return f === 41 ? (e.enter("resourceMarker"), e.consume(f), e.exit("resourceMarker"), e.exit("resource"), t) : a(f);
  }
}
function XA(e, t, a) {
  let n = this;
  return r;
  function r(i) {
    return fc.call(n, e, l, o, "reference", "referenceMarker", "referenceString")(i);
  }
  function l(i) {
    return n.parser.defined.includes(Mt(n.sliceSerialize(n.events[n.events.length - 1][1]).slice(1, -1))) ? t(i) : a(i);
  }
  function o(i) {
    return a(i);
  }
}
function jA(e, t, a) {
  return n;
  function n(l) {
    return e.enter("reference"), e.enter("referenceMarker"), e.consume(l), e.exit("referenceMarker"), r;
  }
  function r(l) {
    return l === 93 ? (e.enter("referenceMarker"), e.consume(l), e.exit("referenceMarker"), e.exit("reference"), t) : a(l);
  }
}
var om = {
  name: "labelStartImage",
  resolveAll: Gr.resolveAll,
  tokenize: YA
};
function YA(e, t, a) {
  let n = this;
  return r;
  function r(i) {
    return e.enter("labelImage"), e.enter("labelImageMarker"), e.consume(i), e.exit("labelImageMarker"), l;
  }
  function l(i) {
    return i === 91 ? (e.enter("labelMarker"), e.consume(i), e.exit("labelMarker"), e.exit("labelImage"), o) : a(i);
  }
  function o(i) {
    return i === 94 && "_hiddenFootnoteSupport" in n.parser.constructs ? a(i) : t(i);
  }
}
var im = {
  name: "labelStartLink",
  resolveAll: Gr.resolveAll,
  tokenize: QA
};
function QA(e, t, a) {
  let n = this;
  return r;
  function r(o) {
    return e.enter("labelLink"), e.enter("labelMarker"), e.consume(o), e.exit("labelMarker"), e.exit("labelLink"), l;
  }
  function l(o) {
    return o === 94 && "_hiddenFootnoteSupport" in n.parser.constructs ? a(o) : t(o);
  }
}
var $i = {
  name: "lineEnding",
  tokenize: ZA
};
function ZA(e, t) {
  return a;
  function a(n) {
    return e.enter("lineEnding"), e.consume(n), e.exit("lineEnding"), Q(e, t, "linePrefix");
  }
}
var Vr = {
  name: "thematicBreak",
  tokenize: KA
};
function KA(e, t, a) {
  let n = 0,
    r;
  return l;
  function l(s) {
    return e.enter("thematicBreak"), o(s);
  }
  function o(s) {
    return r = s, i(s);
  }
  function i(s) {
    return s === r ? (e.enter("thematicBreakSequence"), u(s)) : n >= 3 && (s === null || U(s)) ? (e.exit("thematicBreak"), t(s)) : a(s);
  }
  function u(s) {
    return s === r ? (e.consume(s), n++, u) : (e.exit("thematicBreakSequence"), W(s) ? Q(e, i, "whitespace")(s) : i(s));
  }
}
var Dt = {
    continuation: {
      tokenize: eT
    },
    exit: aT,
    name: "list",
    tokenize: $A
  },
  WA = {
    partial: !0,
    tokenize: nT
  },
  JA = {
    partial: !0,
    tokenize: tT
  };
function $A(e, t, a) {
  let n = this,
    r = n.events[n.events.length - 1],
    l = r && r[1].type === "linePrefix" ? r[2].sliceSerialize(r[1], !0).length : 0,
    o = 0;
  return i;
  function i(p) {
    let x = n.containerState.type || (p === 42 || p === 43 || p === 45 ? "listUnordered" : "listOrdered");
    if (x === "listUnordered" ? !n.containerState.marker || p === n.containerState.marker : Zi(p)) {
      if (n.containerState.type || (n.containerState.type = x, e.enter(x, {
        _container: !0
      })), x === "listUnordered") return e.enter("listItemPrefix"), p === 42 || p === 45 ? e.check(Vr, a, s)(p) : s(p);
      if (!n.interrupt || p === 49) return e.enter("listItemPrefix"), e.enter("listItemValue"), u(p);
    }
    return a(p);
  }
  function u(p) {
    return Zi(p) && ++o < 10 ? (e.consume(p), u) : (!n.interrupt || o < 2) && (n.containerState.marker ? p === n.containerState.marker : p === 41 || p === 46) ? (e.exit("listItemValue"), s(p)) : a(p);
  }
  function s(p) {
    return e.enter("listItemMarker"), e.consume(p), e.exit("listItemMarker"), n.containerState.marker = n.containerState.marker || p, e.check(Fa, n.interrupt ? a : c, e.attempt(WA, d, f));
  }
  function c(p) {
    return n.containerState.initialBlankLine = !0, l++, d(p);
  }
  function f(p) {
    return W(p) ? (e.enter("listItemPrefixWhitespace"), e.consume(p), e.exit("listItemPrefixWhitespace"), d) : a(p);
  }
  function d(p) {
    return n.containerState.size = l + n.sliceSerialize(e.exit("listItemPrefix"), !0).length, t(p);
  }
}
function eT(e, t, a) {
  let n = this;
  return n.containerState._closeFlow = void 0, e.check(Fa, r, l);
  function r(i) {
    return n.containerState.furtherBlankLines = n.containerState.furtherBlankLines || n.containerState.initialBlankLine, Q(e, t, "listItemIndent", n.containerState.size + 1)(i);
  }
  function l(i) {
    return n.containerState.furtherBlankLines || !W(i) ? (n.containerState.furtherBlankLines = void 0, n.containerState.initialBlankLine = void 0, o(i)) : (n.containerState.furtherBlankLines = void 0, n.containerState.initialBlankLine = void 0, e.attempt(JA, t, o)(i));
  }
  function o(i) {
    return n.containerState._closeFlow = !0, n.interrupt = void 0, Q(e, e.attempt(Dt, t, a), "linePrefix", n.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(i);
  }
}
function tT(e, t, a) {
  let n = this;
  return Q(e, r, "listItemIndent", n.containerState.size + 1);
  function r(l) {
    let o = n.events[n.events.length - 1];
    return o && o[1].type === "listItemIndent" && o[2].sliceSerialize(o[1], !0).length === n.containerState.size ? t(l) : a(l);
  }
}
function aT(e) {
  e.exit(this.containerState.type);
}
function nT(e, t, a) {
  let n = this;
  return Q(e, r, "listItemPrefixWhitespace", n.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 5);
  function r(l) {
    let o = n.events[n.events.length - 1];
    return !W(l) && o && o[1].type === "listItemPrefixWhitespace" ? t(l) : a(l);
  }
}
var pc = {
  name: "setextUnderline",
  resolveTo: rT,
  tokenize: lT
};
function rT(e, t) {
  let a = e.length,
    n,
    r,
    l;
  for (; a--;) if (e[a][0] === "enter") {
    if (e[a][1].type === "content") {
      n = a;
      break;
    }
    e[a][1].type === "paragraph" && (r = a);
  } else e[a][1].type === "content" && e.splice(a, 1), !l && e[a][1].type === "definition" && (l = a);
  let o = {
    type: "setextHeading",
    start: {
      ...e[n][1].start
    },
    end: {
      ...e[e.length - 1][1].end
    }
  };
  return e[r][1].type = "setextHeadingText", l ? (e.splice(r, 0, ["enter", o, t]), e.splice(l + 1, 0, ["exit", e[n][1], t]), e[n][1].end = {
    ...e[l][1].end
  }) : e[n][1] = o, e.push(["exit", o, t]), e;
}
function lT(e, t, a) {
  let n = this,
    r;
  return l;
  function l(s) {
    let c = n.events.length,
      f;
    for (; c--;) if (n.events[c][1].type !== "lineEnding" && n.events[c][1].type !== "linePrefix" && n.events[c][1].type !== "content") {
      f = n.events[c][1].type === "paragraph";
      break;
    }
    return !n.parser.lazy[n.now().line] && (n.interrupt || f) ? (e.enter("setextHeadingLine"), r = s, o(s)) : a(s);
  }
  function o(s) {
    return e.enter("setextHeadingLineSequence"), i(s);
  }
  function i(s) {
    return s === r ? (e.consume(s), i) : (e.exit("setextHeadingLineSequence"), W(s) ? Q(e, u, "lineSuffix")(s) : u(s));
  }
  function u(s) {
    return s === null || U(s) ? (e.exit("setextHeadingLine"), t(s)) : a(s);
  }
}
var KL = {
  tokenize: oT
};
function oT(e) {
  let t = this,
    a = e.attempt(Fa, n, e.attempt(this.parser.constructs.flowInitial, r, Q(e, e.attempt(this.parser.constructs.flow, r, e.attempt($p, r)), "linePrefix")));
  return a;
  function n(l) {
    if (l === null) {
      e.consume(l);
      return;
    }
    return e.enter("lineEndingBlank"), e.consume(l), e.exit("lineEndingBlank"), t.currentConstruct = void 0, a;
  }
  function r(l) {
    if (l === null) {
      e.consume(l);
      return;
    }
    return e.enter("lineEnding"), e.consume(l), e.exit("lineEnding"), t.currentConstruct = void 0, a;
  }
}
var WL = {
    resolveAll: t0()
  },
  JL = e0("string"),
  $L = e0("text");
function e0(e) {
  return {
    resolveAll: t0(e === "text" ? iT : void 0),
    tokenize: t
  };
  function t(a) {
    let n = this,
      r = this.parser.constructs[e],
      l = a.attempt(r, o, i);
    return o;
    function o(c) {
      return s(c) ? l(c) : i(c);
    }
    function i(c) {
      if (c === null) {
        a.consume(c);
        return;
      }
      return a.enter("data"), a.consume(c), u;
    }
    function u(c) {
      return s(c) ? (a.exit("data"), l(c)) : (a.consume(c), u);
    }
    function s(c) {
      if (c === null) return !0;
      let f = r[c],
        d = -1;
      if (f) for (; ++d < f.length;) {
        let p = f[d];
        if (!p.previous || p.previous.call(n, n.previous)) return !0;
      }
      return !1;
    }
  }
}
function t0(e) {
  return t;
  function t(a, n) {
    let r = -1,
      l;
    for (; ++r <= a.length;) l === void 0 ? a[r] && a[r][1].type === "data" && (l = r, r++) : (!a[r] || a[r][1].type !== "data") && (r !== l + 2 && (a[l][1].end = a[r - 1][1].end, a.splice(l + 2, r - l - 2), r = l + 2), l = void 0);
    return e ? e(a, n) : a;
  }
}
function iT(e, t) {
  let a = 0;
  for (; ++a <= e.length;) if ((a === e.length || e[a][1].type === "lineEnding") && e[a - 1][1].type === "data") {
    let n = e[a - 1][1],
      r = t.sliceStream(n),
      l = r.length,
      o = -1,
      i = 0,
      u;
    for (; l--;) {
      let s = r[l];
      if (typeof s == "string") {
        for (o = s.length; s.charCodeAt(o - 1) === 32;) i++, o--;
        if (o) break;
        o = -1;
      } else if (s === -2) u = !0, i++;else if (s !== -1) {
        l++;
        break;
      }
    }
    if (t._contentTypeTextTrailing && a === e.length && (i = 0), i) {
      let s = {
        type: a === e.length || u || i < 2 ? "lineSuffix" : "hardBreakTrailing",
        start: {
          _bufferIndex: l ? o : n.start._bufferIndex + o,
          _index: n.start._index + l,
          line: n.end.line,
          column: n.end.column - i,
          offset: n.end.offset - i
        },
        end: {
          ...n.end
        }
      };
      n.end = {
        ...s.start
      }, n.start.offset === n.end.offset ? Object.assign(n, s) : (e.splice(a, 0, ["enter", s, t], ["exit", s, t]), a += 2);
    }
    a++;
  }
  return e;
}
var um = {};
hh(um, {
  attentionMarkers: () => hT,
  contentInitial: () => sT,
  disable: () => gT,
  document: () => uT,
  flow: () => fT,
  flowInitial: () => cT,
  insideSpan: () => mT,
  string: () => dT,
  text: () => pT
});
var uT = {
    42: Dt,
    43: Dt,
    45: Dt,
    48: Dt,
    49: Dt,
    50: Dt,
    51: Dt,
    52: Dt,
    53: Dt,
    54: Dt,
    55: Dt,
    56: Dt,
    57: Dt,
    62: rc
  },
  sT = {
    91: em
  },
  cT = {
    [-2]: Wi,
    [-1]: Wi,
    32: Wi
  },
  fT = {
    35: am,
    42: Vr,
    45: [pc, Vr],
    60: rm,
    61: pc,
    95: Vr,
    96: ic,
    126: ic
  },
  dT = {
    38: oc,
    92: lc
  },
  pT = {
    [-5]: $i,
    [-4]: $i,
    [-3]: $i,
    33: om,
    38: oc,
    42: Ki,
    60: [Wp, lm],
    91: im,
    92: [tm, lc],
    93: Gr,
    95: Ki,
    96: Jp
  },
  mT = {
    null: [Ki, WL]
  },
  hT = {
    null: [42, 95]
  },
  gT = {
    null: []
  };
function a0(e, t, a) {
  let n = {
      _bufferIndex: -1,
      _index: 0,
      line: a && a.line || 1,
      column: a && a.column || 1,
      offset: a && a.offset || 0
    },
    r = {},
    l = [],
    o = [],
    i = [],
    u = !0,
    s = {
      attempt: R(S),
      check: R(A),
      consume: L,
      enter: I,
      exit: k,
      interrupt: R(A, {
        interrupt: !0
      })
    },
    c = {
      code: null,
      containerState: {},
      defineSkip: h,
      events: [],
      now: C,
      parser: e,
      previous: null,
      sliceSerialize: x,
      sliceStream: b,
      write: p
    },
    f = t.tokenize.call(c, s),
    d;
  return t.resolveAll && l.push(t), c;
  function p(q) {
    return o = zt(o, q), m(), o[o.length - 1] !== null ? [] : (w(t, 0), c.events = rr(l, c.events, c), c.events);
  }
  function x(q, K) {
    return yT(b(q), K);
  }
  function b(q) {
    return xT(o, q);
  }
  function C() {
    let {
      _bufferIndex: q,
      _index: K,
      line: J,
      column: se,
      offset: ye
    } = n;
    return {
      _bufferIndex: q,
      _index: K,
      line: J,
      column: se,
      offset: ye
    };
  }
  function h(q) {
    r[q.line] = q.column, $();
  }
  function m() {
    let q;
    for (; n._index < o.length;) {
      let K = o[n._index];
      if (typeof K == "string") for (q = n._index, n._bufferIndex < 0 && (n._bufferIndex = 0); n._index === q && n._bufferIndex < K.length;) g(K.charCodeAt(n._bufferIndex));else g(K);
    }
  }
  function g(q) {
    u = void 0, d = q, f = f(q);
  }
  function L(q) {
    U(q) ? (n.line++, n.column = 1, n.offset += q === -3 ? 2 : 1, $()) : q !== -1 && (n.column++, n.offset++), n._bufferIndex < 0 ? n._index++ : (n._bufferIndex++, n._bufferIndex === o[n._index].length && (n._bufferIndex = -1, n._index++)), c.previous = q, u = !0;
  }
  function I(q, K) {
    let J = K || {};
    return J.type = q, J.start = C(), c.events.push(["enter", J, c]), i.push(J), J;
  }
  function k(q) {
    let K = i.pop();
    return K.end = C(), c.events.push(["exit", K, c]), K;
  }
  function S(q, K) {
    w(q, K.from);
  }
  function A(q, K) {
    K.restore();
  }
  function R(q, K) {
    return J;
    function J(se, ye, st) {
      let Y, y, ie, Re;
      return Array.isArray(se) ? ct(se) : "tokenize" in se ? ct([se]) : v(se);
      function v(De) {
        return Ie;
        function Ie(vt) {
          let Ot = vt !== null && De[vt],
            Yt = vt !== null && De.null,
            Ta = [...(Array.isArray(Ot) ? Ot : Ot ? [Ot] : []), ...(Array.isArray(Yt) ? Yt : Yt ? [Yt] : [])];
          return ct(Ta)(vt);
        }
      }
      function ct(De) {
        return Y = De, y = 0, De.length === 0 ? st : ze(De[y]);
      }
      function ze(De) {
        return Ie;
        function Ie(vt) {
          return Re = N(), ie = De, De.partial || (c.currentConstruct = De), De.name && c.parser.constructs.disable.null.includes(De.name) ? va(vt) : De.tokenize.call(K ? Object.assign(Object.create(c), K) : c, s, $e, va)(vt);
        }
      }
      function $e(De) {
        return u = !0, q(ie, Re), ye;
      }
      function va(De) {
        return u = !0, Re.restore(), ++y < Y.length ? ze(Y[y]) : st;
      }
    }
  }
  function w(q, K) {
    q.resolveAll && !l.includes(q) && l.push(q), q.resolve && nt(c.events, K, c.events.length - K, q.resolve(c.events.slice(K), c)), q.resolveTo && (c.events = q.resolveTo(c.events, c));
  }
  function N() {
    let q = C(),
      K = c.previous,
      J = c.currentConstruct,
      se = c.events.length,
      ye = Array.from(i);
    return {
      from: se,
      restore: st
    };
    function st() {
      n = q, c.previous = K, c.currentConstruct = J, c.events.length = se, i = ye, $();
    }
  }
  function $() {
    n.line in r && n.column < 2 && (n.column = r[n.line], n.offset += r[n.line] - 1);
  }
}
function xT(e, t) {
  let a = t.start._index,
    n = t.start._bufferIndex,
    r = t.end._index,
    l = t.end._bufferIndex,
    o;
  if (a === r) o = [e[a].slice(n, l)];else {
    if (o = e.slice(a, r), n > -1) {
      let i = o[0];
      typeof i == "string" ? o[0] = i.slice(n) : o.shift();
    }
    l > 0 && o.push(e[r].slice(0, l));
  }
  return o;
}
function yT(e, t) {
  let a = -1,
    n = [],
    r;
  for (; ++a < e.length;) {
    let l = e[a],
      o;
    if (typeof l == "string") o = l;else switch (l) {
      case -5:
        {
          o = "\r";
          break;
        }
      case -4:
        {
          o = `
`;
          break;
        }
      case -3:
        {
          o = `\r
`;
          break;
        }
      case -2:
        {
          o = t ? " " : "	";
          break;
        }
      case -1:
        {
          if (!t && r) continue;
          o = " ";
          break;
        }
      default:
        o = String.fromCharCode(l);
    }
    r = l === -2, n.push(o);
  }
  return n.join("");
}
function sm(e) {
  let n = {
    constructs: ac([um, ...((e || {}).extensions || [])]),
    content: r(VL),
    defined: [],
    document: r(jL),
    flow: r(KL),
    lazy: {},
    string: r(JL),
    text: r($L)
  };
  return n;
  function r(l) {
    return o;
    function o(i) {
      return a0(n, l, i);
    }
  }
}
function cm(e) {
  for (; !sc(e););
  return e;
}
var n0 = /[\0\t\n\r]/g;
function fm() {
  let e = 1,
    t = "",
    a = !0,
    n;
  return r;
  function r(l, o, i) {
    let u = [],
      s,
      c,
      f,
      d,
      p;
    for (l = t + (typeof l == "string" ? l.toString() : new TextDecoder(o || void 0).decode(l)), f = 0, t = "", a && (l.charCodeAt(0) === 65279 && f++, a = void 0); f < l.length;) {
      if (n0.lastIndex = f, s = n0.exec(l), d = s && s.index !== void 0 ? s.index : l.length, p = l.charCodeAt(d), !s) {
        t = l.slice(f);
        break;
      }
      if (p === 10 && f === d && n) u.push(-3), n = void 0;else switch (n && (u.push(-5), n = void 0), f < d && (u.push(l.slice(f, d)), e += d - f), p) {
        case 0:
          {
            u.push(65533), e++;
            break;
          }
        case 9:
          {
            for (c = Math.ceil(e / 4) * 4, u.push(-2); e++ < c;) u.push(-1);
            break;
          }
        case 10:
          {
            u.push(-4), e = 1;
            break;
          }
        default:
          n = !0, e = 1;
      }
      f = d + 1;
    }
    return i && (n && u.push(-5), t && u.push(t), u.push(null)), u;
  }
}
var bT = /\\([!-/:-@[-`{-~])|&(#(?:\d{1,7}|x[\da-f]{1,6})|[\da-z]{1,31});/gi;
function r0(e) {
  return e.replace(bT, vT);
}
function vT(e, t, a) {
  if (t) return t;
  if (a.charCodeAt(0) === 35) {
    let r = a.charCodeAt(1),
      l = r === 120 || r === 88;
    return nc(a.slice(l ? 2 : 1), l ? 16 : 10);
  }
  return to(a) || e;
}
var o0 = {}.hasOwnProperty;
function dm(e, t, a) {
  return t && typeof t == "object" && (a = t, t = void 0), LT(a)(cm(sm(a).document().write(fm()(e, t, !0))));
}
function LT(e) {
  let t = {
    transforms: [],
    canContainEols: ["emphasis", "fragment", "heading", "paragraph", "strong"],
    enter: {
      autolink: l(co),
      autolinkProtocol: R,
      autolinkEmail: R,
      atxHeading: l(Wr),
      blockQuote: l(vt),
      characterEscape: R,
      characterReference: R,
      codeFenced: l(Ot),
      codeFencedFenceInfo: o,
      codeFencedFenceMeta: o,
      codeIndented: l(Ot, o),
      codeText: l(Yt, o),
      codeTextData: R,
      data: R,
      codeFlowValue: R,
      definition: l(Ta),
      definitionDestinationString: o,
      definitionLabelString: o,
      definitionTitleString: o,
      emphasis: l(bn),
      hardBreakEscape: l(so),
      hardBreakTrailing: l(so),
      htmlFlow: l(uu, o),
      htmlFlowData: R,
      htmlText: l(uu, o),
      htmlTextData: R,
      image: l(Rc),
      label: o,
      link: l(co),
      listItem: l(Nc),
      listItemValue: d,
      listOrdered: l(fo, f),
      listUnordered: l(fo),
      paragraph: l(zc),
      reference: v,
      referenceString: o,
      resourceDestinationString: o,
      resourceTitleString: o,
      setextHeading: l(Wr),
      strong: l(Oc),
      thematicBreak: l(Uc)
    },
    exit: {
      atxHeading: u(),
      atxHeadingSequence: I,
      autolink: u(),
      autolinkEmail: Ie,
      autolinkProtocol: De,
      blockQuote: u(),
      characterEscapeValue: w,
      characterReferenceMarkerHexadecimal: ze,
      characterReferenceMarkerNumeric: ze,
      characterReferenceValue: $e,
      characterReference: va,
      codeFenced: u(C),
      codeFencedFence: b,
      codeFencedFenceInfo: p,
      codeFencedFenceMeta: x,
      codeFlowValue: w,
      codeIndented: u(h),
      codeText: u(J),
      codeTextData: w,
      data: w,
      definition: u(),
      definitionDestinationString: L,
      definitionLabelString: m,
      definitionTitleString: g,
      emphasis: u(),
      hardBreakEscape: u($),
      hardBreakTrailing: u($),
      htmlFlow: u(q),
      htmlFlowData: w,
      htmlText: u(K),
      htmlTextData: w,
      image: u(ye),
      label: Y,
      labelText: st,
      lineEnding: N,
      link: u(se),
      listItem: u(),
      listOrdered: u(),
      listUnordered: u(),
      paragraph: u(),
      referenceString: ct,
      resourceDestinationString: y,
      resourceTitleString: ie,
      resource: Re,
      setextHeading: u(A),
      setextHeadingLineSequence: S,
      setextHeadingText: k,
      strong: u(),
      thematicBreak: u()
    }
  };
  i0(t, (e || {}).mdastExtensions || []);
  let a = {};
  return n;
  function n(D) {
    let M = {
        type: "root",
        children: []
      },
      X = {
        stack: [M],
        tokenStack: [],
        config: t,
        enter: i,
        exit: s,
        buffer: o,
        resume: c,
        data: a
      },
      O = [],
      Z = -1;
    for (; ++Z < D.length;) if (D[Z][1].type === "listOrdered" || D[Z][1].type === "listUnordered") if (D[Z][0] === "enter") O.push(Z);else {
      let de = O.pop();
      Z = r(D, de, Z);
    }
    for (Z = -1; ++Z < D.length;) {
      let de = t[D[Z][0]];
      o0.call(de, D[Z][1].type) && de[D[Z][1].type].call(Object.assign({
        sliceSerialize: D[Z][2].sliceSerialize
      }, X), D[Z][1]);
    }
    if (X.tokenStack.length > 0) {
      let de = X.tokenStack[X.tokenStack.length - 1];
      (de[1] || l0).call(X, void 0, de[0]);
    }
    for (M.position = {
      start: lr(D.length > 0 ? D[0][1].start : {
        line: 1,
        column: 1,
        offset: 0
      }),
      end: lr(D.length > 0 ? D[D.length - 2][1].end : {
        line: 1,
        column: 1,
        offset: 0
      })
    }, Z = -1; ++Z < t.transforms.length;) M = t.transforms[Z](M) || M;
    return M;
  }
  function r(D, M, X) {
    let O = M - 1,
      Z = -1,
      de = !1,
      Ye,
      rt,
      po,
      mo;
    for (; ++O <= X;) {
      let Qt = D[O];
      switch (Qt[1].type) {
        case "listUnordered":
        case "listOrdered":
        case "blockQuote":
          {
            Qt[0] === "enter" ? Z++ : Z--, mo = void 0;
            break;
          }
        case "lineEndingBlank":
          {
            Qt[0] === "enter" && (Ye && !mo && !Z && !po && (po = O), mo = void 0);
            break;
          }
        case "linePrefix":
        case "listItemValue":
        case "listItemMarker":
        case "listItemPrefix":
        case "listItemPrefixWhitespace":
          break;
        default:
          mo = void 0;
      }
      if (!Z && Qt[0] === "enter" && Qt[1].type === "listItemPrefix" || Z === -1 && Qt[0] === "exit" && (Qt[1].type === "listUnordered" || Qt[1].type === "listOrdered")) {
        if (Ye) {
          let Jr = O;
          for (rt = void 0; Jr--;) {
            let _a = D[Jr];
            if (_a[1].type === "lineEnding" || _a[1].type === "lineEndingBlank") {
              if (_a[0] === "exit") continue;
              rt && (D[rt][1].type = "lineEndingBlank", de = !0), _a[1].type = "lineEnding", rt = Jr;
            } else if (!(_a[1].type === "linePrefix" || _a[1].type === "blockQuotePrefix" || _a[1].type === "blockQuotePrefixWhitespace" || _a[1].type === "blockQuoteMarker" || _a[1].type === "listItemIndent")) break;
          }
          po && (!rt || po < rt) && (Ye._spread = !0), Ye.end = Object.assign({}, rt ? D[rt][1].start : Qt[1].end), D.splice(rt || O, 0, ["exit", Ye, Qt[2]]), O++, X++;
        }
        if (Qt[1].type === "listItemPrefix") {
          let Jr = {
            type: "listItem",
            _spread: !1,
            start: Object.assign({}, Qt[1].start),
            end: void 0
          };
          Ye = Jr, D.splice(O, 0, ["enter", Jr, Qt[2]]), O++, X++, po = void 0, mo = !0;
        }
      }
    }
    return D[M][1]._spread = de, X;
  }
  function l(D, M) {
    return X;
    function X(O) {
      i.call(this, D(O), O), M && M.call(this, O);
    }
  }
  function o() {
    this.stack.push({
      type: "fragment",
      children: []
    });
  }
  function i(D, M, X) {
    this.stack[this.stack.length - 1].children.push(D), this.stack.push(D), this.tokenStack.push([M, X || void 0]), D.position = {
      start: lr(M.start),
      end: void 0
    };
  }
  function u(D) {
    return M;
    function M(X) {
      D && D.call(this, X), s.call(this, X);
    }
  }
  function s(D, M) {
    let X = this.stack.pop(),
      O = this.tokenStack.pop();
    if (O) O[0].type !== D.type && (M ? M.call(this, D, O[0]) : (O[1] || l0).call(this, D, O[0]));else throw new Error("Cannot close `" + D.type + "` (" + ar({
      start: D.start,
      end: D.end
    }) + "): it\u2019s not open");
    X.position.end = lr(D.end);
  }
  function c() {
    return qr(this.stack.pop());
  }
  function f() {
    this.data.expectingFirstListItemValue = !0;
  }
  function d(D) {
    if (this.data.expectingFirstListItemValue) {
      let M = this.stack[this.stack.length - 2];
      M.start = Number.parseInt(this.sliceSerialize(D), 10), this.data.expectingFirstListItemValue = void 0;
    }
  }
  function p() {
    let D = this.resume(),
      M = this.stack[this.stack.length - 1];
    M.lang = D;
  }
  function x() {
    let D = this.resume(),
      M = this.stack[this.stack.length - 1];
    M.meta = D;
  }
  function b() {
    this.data.flowCodeInside || (this.buffer(), this.data.flowCodeInside = !0);
  }
  function C() {
    let D = this.resume(),
      M = this.stack[this.stack.length - 1];
    M.value = D.replace(/^(\r?\n|\r)|(\r?\n|\r)$/g, ""), this.data.flowCodeInside = void 0;
  }
  function h() {
    let D = this.resume(),
      M = this.stack[this.stack.length - 1];
    M.value = D.replace(/(\r?\n|\r)$/g, "");
  }
  function m(D) {
    let M = this.resume(),
      X = this.stack[this.stack.length - 1];
    X.label = M, X.identifier = Mt(this.sliceSerialize(D)).toLowerCase();
  }
  function g() {
    let D = this.resume(),
      M = this.stack[this.stack.length - 1];
    M.title = D;
  }
  function L() {
    let D = this.resume(),
      M = this.stack[this.stack.length - 1];
    M.url = D;
  }
  function I(D) {
    let M = this.stack[this.stack.length - 1];
    if (!M.depth) {
      let X = this.sliceSerialize(D).length;
      M.depth = X;
    }
  }
  function k() {
    this.data.setextHeadingSlurpLineEnding = !0;
  }
  function S(D) {
    let M = this.stack[this.stack.length - 1];
    M.depth = this.sliceSerialize(D).codePointAt(0) === 61 ? 1 : 2;
  }
  function A() {
    this.data.setextHeadingSlurpLineEnding = void 0;
  }
  function R(D) {
    let X = this.stack[this.stack.length - 1].children,
      O = X[X.length - 1];
    (!O || O.type !== "text") && (O = Pc(), O.position = {
      start: lr(D.start),
      end: void 0
    }, X.push(O)), this.stack.push(O);
  }
  function w(D) {
    let M = this.stack.pop();
    M.value += this.sliceSerialize(D), M.position.end = lr(D.end);
  }
  function N(D) {
    let M = this.stack[this.stack.length - 1];
    if (this.data.atHardBreak) {
      let X = M.children[M.children.length - 1];
      X.position.end = lr(D.end), this.data.atHardBreak = void 0;
      return;
    }
    !this.data.setextHeadingSlurpLineEnding && t.canContainEols.includes(M.type) && (R.call(this, D), w.call(this, D));
  }
  function $() {
    this.data.atHardBreak = !0;
  }
  function q() {
    let D = this.resume(),
      M = this.stack[this.stack.length - 1];
    M.value = D;
  }
  function K() {
    let D = this.resume(),
      M = this.stack[this.stack.length - 1];
    M.value = D;
  }
  function J() {
    let D = this.resume(),
      M = this.stack[this.stack.length - 1];
    M.value = D;
  }
  function se() {
    let D = this.stack[this.stack.length - 1];
    if (this.data.inReference) {
      let M = this.data.referenceType || "shortcut";
      D.type += "Reference", D.referenceType = M, delete D.url, delete D.title;
    } else delete D.identifier, delete D.label;
    this.data.referenceType = void 0;
  }
  function ye() {
    let D = this.stack[this.stack.length - 1];
    if (this.data.inReference) {
      let M = this.data.referenceType || "shortcut";
      D.type += "Reference", D.referenceType = M, delete D.url, delete D.title;
    } else delete D.identifier, delete D.label;
    this.data.referenceType = void 0;
  }
  function st(D) {
    let M = this.sliceSerialize(D),
      X = this.stack[this.stack.length - 2];
    X.label = r0(M), X.identifier = Mt(M).toLowerCase();
  }
  function Y() {
    let D = this.stack[this.stack.length - 1],
      M = this.resume(),
      X = this.stack[this.stack.length - 1];
    if (this.data.inReference = !0, X.type === "link") {
      let O = D.children;
      X.children = O;
    } else X.alt = M;
  }
  function y() {
    let D = this.resume(),
      M = this.stack[this.stack.length - 1];
    M.url = D;
  }
  function ie() {
    let D = this.resume(),
      M = this.stack[this.stack.length - 1];
    M.title = D;
  }
  function Re() {
    this.data.inReference = void 0;
  }
  function v() {
    this.data.referenceType = "collapsed";
  }
  function ct(D) {
    let M = this.resume(),
      X = this.stack[this.stack.length - 1];
    X.label = M, X.identifier = Mt(this.sliceSerialize(D)).toLowerCase(), this.data.referenceType = "full";
  }
  function ze(D) {
    this.data.characterReferenceType = D.type;
  }
  function $e(D) {
    let M = this.sliceSerialize(D),
      X = this.data.characterReferenceType,
      O;
    X ? (O = nc(M, X === "characterReferenceMarkerNumeric" ? 10 : 16), this.data.characterReferenceType = void 0) : O = to(M);
    let Z = this.stack[this.stack.length - 1];
    Z.value += O;
  }
  function va(D) {
    let M = this.stack.pop();
    M.position.end = lr(D.end);
  }
  function De(D) {
    w.call(this, D);
    let M = this.stack[this.stack.length - 1];
    M.url = this.sliceSerialize(D);
  }
  function Ie(D) {
    w.call(this, D);
    let M = this.stack[this.stack.length - 1];
    M.url = "mailto:" + this.sliceSerialize(D);
  }
  function vt() {
    return {
      type: "blockquote",
      children: []
    };
  }
  function Ot() {
    return {
      type: "code",
      lang: null,
      meta: null,
      value: ""
    };
  }
  function Yt() {
    return {
      type: "inlineCode",
      value: ""
    };
  }
  function Ta() {
    return {
      type: "definition",
      identifier: "",
      label: null,
      title: null,
      url: ""
    };
  }
  function bn() {
    return {
      type: "emphasis",
      children: []
    };
  }
  function Wr() {
    return {
      type: "heading",
      depth: 0,
      children: []
    };
  }
  function so() {
    return {
      type: "break"
    };
  }
  function uu() {
    return {
      type: "html",
      value: ""
    };
  }
  function Rc() {
    return {
      type: "image",
      title: null,
      url: "",
      alt: null
    };
  }
  function co() {
    return {
      type: "link",
      title: null,
      url: "",
      children: []
    };
  }
  function fo(D) {
    return {
      type: "list",
      ordered: D.type === "listOrdered",
      start: null,
      spread: D._spread,
      children: []
    };
  }
  function Nc(D) {
    return {
      type: "listItem",
      spread: D._spread,
      checked: null,
      children: []
    };
  }
  function zc() {
    return {
      type: "paragraph",
      children: []
    };
  }
  function Oc() {
    return {
      type: "strong",
      children: []
    };
  }
  function Pc() {
    return {
      type: "text",
      value: ""
    };
  }
  function Uc() {
    return {
      type: "thematicBreak"
    };
  }
}
function lr(e) {
  return {
    line: e.line,
    column: e.column,
    offset: e.offset
  };
}
function i0(e, t) {
  let a = -1;
  for (; ++a < t.length;) {
    let n = t[a];
    Array.isArray(n) ? i0(e, n) : kT(e, n);
  }
}
function kT(e, t) {
  let a;
  for (a in t) if (o0.call(t, a)) switch (a) {
    case "canContainEols":
      {
        let n = t[a];
        n && e[a].push(...n);
        break;
      }
    case "transforms":
      {
        let n = t[a];
        n && e[a].push(...n);
        break;
      }
    case "enter":
    case "exit":
      {
        let n = t[a];
        n && Object.assign(e[a], n);
        break;
      }
  }
}
function l0(e, t) {
  throw e ? new Error("Cannot close `" + e.type + "` (" + ar({
    start: e.start,
    end: e.end
  }) + "): a different token (`" + t.type + "`, " + ar({
    start: t.start,
    end: t.end
  }) + ") is open") : new Error("Cannot close document, a token (`" + t.type + "`, " + ar({
    start: t.start,
    end: t.end
  }) + ") is still open");
}
function mc(e) {
  let t = this;
  t.parser = a;
  function a(n) {
    return dm(n, {
      ...t.data("settings"),
      ...e,
      extensions: t.data("micromarkExtensions") || [],
      mdastExtensions: t.data("fromMarkdownExtensions") || []
    });
  }
}
function u0(e, t) {
  let a = {
    type: "element",
    tagName: "blockquote",
    properties: {},
    children: e.wrap(e.all(t), !0)
  };
  return e.patch(t, a), e.applyData(t, a);
}
function s0(e, t) {
  let a = {
    type: "element",
    tagName: "br",
    properties: {},
    children: []
  };
  return e.patch(t, a), [e.applyData(t, a), {
    type: "text",
    value: `
`
  }];
}
function c0(e, t) {
  let a = t.value ? t.value + `
` : "",
    n = {},
    r = t.lang ? t.lang.split(/\s+/) : [];
  r.length > 0 && (n.className = ["language-" + r[0]]);
  let l = {
    type: "element",
    tagName: "code",
    properties: n,
    children: [{
      type: "text",
      value: a
    }]
  };
  return t.meta && (l.data = {
    meta: t.meta
  }), e.patch(t, l), l = e.applyData(t, l), l = {
    type: "element",
    tagName: "pre",
    properties: {},
    children: [l]
  }, e.patch(t, l), l;
}
function f0(e, t) {
  let a = {
    type: "element",
    tagName: "del",
    properties: {},
    children: e.all(t)
  };
  return e.patch(t, a), e.applyData(t, a);
}
function d0(e, t) {
  let a = {
    type: "element",
    tagName: "em",
    properties: {},
    children: e.all(t)
  };
  return e.patch(t, a), e.applyData(t, a);
}
function p0(e, t) {
  let a = typeof e.options.clobberPrefix == "string" ? e.options.clobberPrefix : "user-content-",
    n = String(t.identifier).toUpperCase(),
    r = ba(n.toLowerCase()),
    l = e.footnoteOrder.indexOf(n),
    o,
    i = e.footnoteCounts.get(n);
  i === void 0 ? (i = 0, e.footnoteOrder.push(n), o = e.footnoteOrder.length) : o = l + 1, i += 1, e.footnoteCounts.set(n, i);
  let u = {
    type: "element",
    tagName: "a",
    properties: {
      href: "#" + a + "fn-" + r,
      id: a + "fnref-" + r + (i > 1 ? "-" + i : ""),
      dataFootnoteRef: !0,
      ariaDescribedBy: ["footnote-label"]
    },
    children: [{
      type: "text",
      value: String(o)
    }]
  };
  e.patch(t, u);
  let s = {
    type: "element",
    tagName: "sup",
    properties: {},
    children: [u]
  };
  return e.patch(t, s), e.applyData(t, s);
}
function m0(e, t) {
  let a = {
    type: "element",
    tagName: "h" + t.depth,
    properties: {},
    children: e.all(t)
  };
  return e.patch(t, a), e.applyData(t, a);
}
function h0(e, t) {
  if (e.options.allowDangerousHtml) {
    let a = {
      type: "raw",
      value: t.value
    };
    return e.patch(t, a), e.applyData(t, a);
  }
}
function hc(e, t) {
  let a = t.referenceType,
    n = "]";
  if (a === "collapsed" ? n += "[]" : a === "full" && (n += "[" + (t.label || t.identifier) + "]"), t.type === "imageReference") return [{
    type: "text",
    value: "![" + t.alt + n
  }];
  let r = e.all(t),
    l = r[0];
  l && l.type === "text" ? l.value = "[" + l.value : r.unshift({
    type: "text",
    value: "["
  });
  let o = r[r.length - 1];
  return o && o.type === "text" ? o.value += n : r.push({
    type: "text",
    value: n
  }), r;
}
function g0(e, t) {
  let a = String(t.identifier).toUpperCase(),
    n = e.definitionById.get(a);
  if (!n) return hc(e, t);
  let r = {
    src: ba(n.url || ""),
    alt: t.alt
  };
  n.title !== null && n.title !== void 0 && (r.title = n.title);
  let l = {
    type: "element",
    tagName: "img",
    properties: r,
    children: []
  };
  return e.patch(t, l), e.applyData(t, l);
}
function x0(e, t) {
  let a = {
    src: ba(t.url)
  };
  t.alt !== null && t.alt !== void 0 && (a.alt = t.alt), t.title !== null && t.title !== void 0 && (a.title = t.title);
  let n = {
    type: "element",
    tagName: "img",
    properties: a,
    children: []
  };
  return e.patch(t, n), e.applyData(t, n);
}
function y0(e, t) {
  let a = {
    type: "text",
    value: t.value.replace(/\r?\n|\r/g, " ")
  };
  e.patch(t, a);
  let n = {
    type: "element",
    tagName: "code",
    properties: {},
    children: [a]
  };
  return e.patch(t, n), e.applyData(t, n);
}
function b0(e, t) {
  let a = String(t.identifier).toUpperCase(),
    n = e.definitionById.get(a);
  if (!n) return hc(e, t);
  let r = {
    href: ba(n.url || "")
  };
  n.title !== null && n.title !== void 0 && (r.title = n.title);
  let l = {
    type: "element",
    tagName: "a",
    properties: r,
    children: e.all(t)
  };
  return e.patch(t, l), e.applyData(t, l);
}
function v0(e, t) {
  let a = {
    href: ba(t.url)
  };
  t.title !== null && t.title !== void 0 && (a.title = t.title);
  let n = {
    type: "element",
    tagName: "a",
    properties: a,
    children: e.all(t)
  };
  return e.patch(t, n), e.applyData(t, n);
}
function L0(e, t, a) {
  let n = e.all(t),
    r = a ? wT(a) : k0(t),
    l = {},
    o = [];
  if (typeof t.checked == "boolean") {
    let c = n[0],
      f;
    c && c.type === "element" && c.tagName === "p" ? f = c : (f = {
      type: "element",
      tagName: "p",
      properties: {},
      children: []
    }, n.unshift(f)), f.children.length > 0 && f.children.unshift({
      type: "text",
      value: " "
    }), f.children.unshift({
      type: "element",
      tagName: "input",
      properties: {
        type: "checkbox",
        checked: t.checked,
        disabled: !0
      },
      children: []
    }), l.className = ["task-list-item"];
  }
  let i = -1;
  for (; ++i < n.length;) {
    let c = n[i];
    (r || i !== 0 || c.type !== "element" || c.tagName !== "p") && o.push({
      type: "text",
      value: `
`
    }), c.type === "element" && c.tagName === "p" && !r ? o.push(...c.children) : o.push(c);
  }
  let u = n[n.length - 1];
  u && (r || u.type !== "element" || u.tagName !== "p") && o.push({
    type: "text",
    value: `
`
  });
  let s = {
    type: "element",
    tagName: "li",
    properties: l,
    children: o
  };
  return e.patch(t, s), e.applyData(t, s);
}
function wT(e) {
  let t = !1;
  if (e.type === "list") {
    t = e.spread || !1;
    let a = e.children,
      n = -1;
    for (; !t && ++n < a.length;) t = k0(a[n]);
  }
  return t;
}
function k0(e) {
  let t = e.spread;
  return t ?? e.children.length > 1;
}
function w0(e, t) {
  let a = {},
    n = e.all(t),
    r = -1;
  for (typeof t.start == "number" && t.start !== 1 && (a.start = t.start); ++r < n.length;) {
    let o = n[r];
    if (o.type === "element" && o.tagName === "li" && o.properties && Array.isArray(o.properties.className) && o.properties.className.includes("task-list-item")) {
      a.className = ["contains-task-list"];
      break;
    }
  }
  let l = {
    type: "element",
    tagName: t.ordered ? "ol" : "ul",
    properties: a,
    children: e.wrap(n, !0)
  };
  return e.patch(t, l), e.applyData(t, l);
}
function S0(e, t) {
  let a = {
    type: "element",
    tagName: "p",
    properties: {},
    children: e.all(t)
  };
  return e.patch(t, a), e.applyData(t, a);
}
function C0(e, t) {
  let a = {
    type: "root",
    children: e.wrap(e.all(t))
  };
  return e.patch(t, a), e.applyData(t, a);
}
function I0(e, t) {
  let a = {
    type: "element",
    tagName: "strong",
    properties: {},
    children: e.all(t)
  };
  return e.patch(t, a), e.applyData(t, a);
}
function A0(e, t) {
  let a = e.all(t),
    n = a.shift(),
    r = [];
  if (n) {
    let o = {
      type: "element",
      tagName: "thead",
      properties: {},
      children: e.wrap([n], !0)
    };
    e.patch(t.children[0], o), r.push(o);
  }
  if (a.length > 0) {
    let o = {
        type: "element",
        tagName: "tbody",
        properties: {},
        children: e.wrap(a, !0)
      },
      i = eo(t.children[1]),
      u = tc(t.children[t.children.length - 1]);
    i && u && (o.position = {
      start: i,
      end: u
    }), r.push(o);
  }
  let l = {
    type: "element",
    tagName: "table",
    properties: {},
    children: e.wrap(r, !0)
  };
  return e.patch(t, l), e.applyData(t, l);
}
function T0(e, t, a) {
  let n = a ? a.children : void 0,
    l = (n ? n.indexOf(t) : 1) === 0 ? "th" : "td",
    o = a && a.type === "table" ? a.align : void 0,
    i = o ? o.length : t.children.length,
    u = -1,
    s = [];
  for (; ++u < i;) {
    let f = t.children[u],
      d = {},
      p = o ? o[u] : void 0;
    p && (d.align = p);
    let x = {
      type: "element",
      tagName: l,
      properties: d,
      children: []
    };
    f && (x.children = e.all(f), e.patch(f, x), x = e.applyData(f, x)), s.push(x);
  }
  let c = {
    type: "element",
    tagName: "tr",
    properties: {},
    children: e.wrap(s, !0)
  };
  return e.patch(t, c), e.applyData(t, c);
}
function M0(e, t) {
  let a = {
    type: "element",
    tagName: "td",
    properties: {},
    children: e.all(t)
  };
  return e.patch(t, a), e.applyData(t, a);
}
function B0(e) {
  let t = String(e),
    a = /\r?\n|\r/g,
    n = a.exec(t),
    r = 0,
    l = [];
  for (; n;) l.push(D0(t.slice(r, n.index), r > 0, !0), n[0]), r = n.index + n[0].length, n = a.exec(t);
  return l.push(D0(t.slice(r), r > 0, !1)), l.join("");
}
function D0(e, t, a) {
  let n = 0,
    r = e.length;
  if (t) {
    let l = e.codePointAt(n);
    for (; l === 9 || l === 32;) n++, l = e.codePointAt(n);
  }
  if (a) {
    let l = e.codePointAt(r - 1);
    for (; l === 9 || l === 32;) r--, l = e.codePointAt(r - 1);
  }
  return r > n ? e.slice(n, r) : "";
}
function E0(e, t) {
  let a = {
    type: "text",
    value: B0(String(t.value))
  };
  return e.patch(t, a), e.applyData(t, a);
}
function R0(e, t) {
  let a = {
    type: "element",
    tagName: "hr",
    properties: {},
    children: []
  };
  return e.patch(t, a), e.applyData(t, a);
}
var N0 = {
  blockquote: u0,
  break: s0,
  code: c0,
  delete: f0,
  emphasis: d0,
  footnoteReference: p0,
  heading: m0,
  html: h0,
  imageReference: g0,
  image: x0,
  inlineCode: y0,
  linkReference: b0,
  link: v0,
  listItem: L0,
  list: w0,
  paragraph: S0,
  root: C0,
  strong: I0,
  table: A0,
  tableCell: M0,
  tableRow: T0,
  text: E0,
  thematicBreak: R0,
  toml: gc,
  yaml: gc,
  definition: gc,
  footnoteDefinition: gc
};
function gc() {}
var F0 = typeof self == "object" ? self : globalThis,
  z0 = (e, t) => {
    switch (e) {
      case "Function":
      case "SharedWorker":
      case "Worker":
      case "eval":
      case "setInterval":
      case "setTimeout":
        throw new TypeError("unable to deserialize " + e);
    }
    return new F0[e](t);
  },
  AT = (e, t) => {
    let a = (r, l) => (e.set(l, r), r),
      n = r => {
        if (e.has(r)) return e.get(r);
        let [l, o] = t[r];
        switch (l) {
          case 0:
          case -1:
            return a(o, r);
          case 1:
            {
              let i = a([], r);
              for (let u of o) i.push(n(u));
              return i;
            }
          case 2:
            {
              let i = a({}, r);
              for (let [u, s] of o) i[n(u)] = n(s);
              return i;
            }
          case 3:
            return a(new Date(o), r);
          case 4:
            {
              let {
                source: i,
                flags: u
              } = o;
              return a(new RegExp(i, u), r);
            }
          case 5:
            {
              let i = a(new Map(), r);
              for (let [u, s] of o) i.set(n(u), n(s));
              return i;
            }
          case 6:
            {
              let i = a(new Set(), r);
              for (let u of o) i.add(n(u));
              return i;
            }
          case 7:
            {
              let {
                name: i,
                message: u
              } = o;
              return a(typeof F0[i] == "function" ? z0(i, u) : new Error(u), r);
            }
          case 8:
            return a(BigInt(o), r);
          case "BigInt":
            return a(Object(BigInt(o)), r);
          case "ArrayBuffer":
            return a(new Uint8Array(o).buffer, o);
          case "DataView":
            {
              let {
                buffer: i
              } = new Uint8Array(o);
              return a(new DataView(i), o);
            }
        }
        return a(z0(l, o), r);
      };
    return n;
  },
  hm = e => AT(new Map(), e)(0);
var Xr = "",
  {
    toString: TT
  } = {},
  {
    keys: MT
  } = Object,
  eu = e => {
    let t = typeof e;
    if (t !== "object" || !e) return [0, t];
    let a = TT.call(e).slice(8, -1);
    switch (a) {
      case "Array":
        return [1, Xr];
      case "Object":
        return [2, Xr];
      case "Date":
        return [3, Xr];
      case "RegExp":
        return [4, Xr];
      case "Map":
        return [5, Xr];
      case "Set":
        return [6, Xr];
      case "DataView":
        return [1, a];
    }
    return a.includes("Array") ? [1, a] : e instanceof Error ? [7, e.name || "Error"] : [2, a];
  },
  yc = ([e, t]) => e === 0 && (t === "function" || t === "symbol"),
  DT = (e, t, a, n) => {
    let r = (o, i) => {
        let u = n.push(o) - 1;
        return a.set(i, u), u;
      },
      l = o => {
        if (a.has(o)) return a.get(o);
        let [i, u] = eu(o);
        switch (i) {
          case 0:
            {
              let c = o;
              switch (u) {
                case "bigint":
                  i = 8, c = o.toString();
                  break;
                case "function":
                case "symbol":
                  if (e) throw new TypeError("unable to serialize " + u);
                  c = null;
                  break;
                case "undefined":
                  return r([-1], o);
              }
              return r([i, c], o);
            }
          case 1:
            {
              if (u) {
                let d = o;
                return u === "DataView" ? d = new Uint8Array(o.buffer) : u === "ArrayBuffer" && (d = new Uint8Array(o)), r([u, [...d]], o);
              }
              let c = [],
                f = r([i, c], o);
              for (let d of o) c.push(l(d));
              return f;
            }
          case 2:
            {
              if (u) switch (u) {
                case "BigInt":
                  return r([u, o.toString()], o);
                case "Boolean":
                case "Number":
                case "String":
                  return r([u, o.valueOf()], o);
              }
              if (t && "toJSON" in o) return l(o.toJSON());
              let c = [],
                f = r([i, c], o);
              for (let d of MT(o)) (e || !yc(eu(o[d]))) && c.push([l(d), l(o[d])]);
              return f;
            }
          case 3:
            return r([i, isNaN(o.getTime()) ? Xr : o.toISOString()], o);
          case 4:
            {
              let {
                source: c,
                flags: f
              } = o;
              return r([i, {
                source: c,
                flags: f
              }], o);
            }
          case 5:
            {
              let c = [],
                f = r([i, c], o);
              for (let [d, p] of o) (e || !(yc(eu(d)) || yc(eu(p)))) && c.push([l(d), l(p)]);
              return f;
            }
          case 6:
            {
              let c = [],
                f = r([i, c], o);
              for (let d of o) (e || !yc(eu(d))) && c.push(l(d));
              return f;
            }
        }
        let {
          message: s
        } = o;
        return r([i, {
          name: u,
          message: s
        }], o);
      };
    return l;
  },
  gm = (e, {
    json: t,
    lossy: a
  } = {}) => {
    let n = [];
    return DT(!(t || a), !!t, new Map(), n)(e), n;
  };
var ao = typeof structuredClone == "function" ? (e, t) => t && ("json" in t || "lossy" in t) ? hm(gm(e, t)) : structuredClone(e) : (e, t) => hm(gm(e, t));
function BT(e, t) {
  let a = [{
    type: "text",
    value: "\u21A9"
  }];
  return t > 1 && a.push({
    type: "element",
    tagName: "sup",
    properties: {},
    children: [{
      type: "text",
      value: String(t)
    }]
  }), a;
}
function ET(e, t) {
  return "Back to reference " + (e + 1) + (t > 1 ? "-" + t : "");
}
function H0(e) {
  let t = typeof e.options.clobberPrefix == "string" ? e.options.clobberPrefix : "user-content-",
    a = e.options.footnoteBackContent || BT,
    n = e.options.footnoteBackLabel || ET,
    r = e.options.footnoteLabel || "Footnotes",
    l = e.options.footnoteLabelTagName || "h2",
    o = e.options.footnoteLabelProperties || {
      className: ["sr-only"]
    },
    i = [],
    u = -1;
  for (; ++u < e.footnoteOrder.length;) {
    let s = e.footnoteById.get(e.footnoteOrder[u]);
    if (!s) continue;
    let c = e.all(s),
      f = String(s.identifier).toUpperCase(),
      d = ba(f.toLowerCase()),
      p = 0,
      x = [],
      b = e.footnoteCounts.get(f);
    for (; b !== void 0 && ++p <= b;) {
      x.length > 0 && x.push({
        type: "text",
        value: " "
      });
      let m = typeof a == "string" ? a : a(u, p);
      typeof m == "string" && (m = {
        type: "text",
        value: m
      }), x.push({
        type: "element",
        tagName: "a",
        properties: {
          href: "#" + t + "fnref-" + d + (p > 1 ? "-" + p : ""),
          dataFootnoteBackref: "",
          ariaLabel: typeof n == "string" ? n : n(u, p),
          className: ["data-footnote-backref"]
        },
        children: Array.isArray(m) ? m : [m]
      });
    }
    let C = c[c.length - 1];
    if (C && C.type === "element" && C.tagName === "p") {
      let m = C.children[C.children.length - 1];
      m && m.type === "text" ? m.value += " " : C.children.push({
        type: "text",
        value: " "
      }), C.children.push(...x);
    } else c.push(...x);
    let h = {
      type: "element",
      tagName: "li",
      properties: {
        id: t + "fn-" + d
      },
      children: e.wrap(c, !0)
    };
    e.patch(s, h), i.push(h);
  }
  if (i.length !== 0) return {
    type: "element",
    tagName: "section",
    properties: {
      dataFootnotes: !0,
      className: ["footnotes"]
    },
    children: [{
      type: "element",
      tagName: l,
      properties: {
        ...ao(o),
        id: "footnote-label"
      },
      children: [{
        type: "text",
        value: r
      }]
    }, {
      type: "text",
      value: `
`
    }, {
      type: "element",
      tagName: "ol",
      properties: {},
      children: e.wrap(i, !0)
    }, {
      type: "text",
      value: `
`
    }]
  };
}
var or = function (e) {
  if (e == null) return OT;
  if (typeof e == "function") return bc(e);
  if (typeof e == "object") return Array.isArray(e) ? RT(e) : NT(e);
  if (typeof e == "string") return zT(e);
  throw new Error("Expected function, string, or object as test");
};
function RT(e) {
  let t = [],
    a = -1;
  for (; ++a < e.length;) t[a] = or(e[a]);
  return bc(n);
  function n(...r) {
    let l = -1;
    for (; ++l < t.length;) if (t[l].apply(this, r)) return !0;
    return !1;
  }
}
function NT(e) {
  let t = e;
  return bc(a);
  function a(n) {
    let r = n,
      l;
    for (l in e) if (r[l] !== t[l]) return !1;
    return !0;
  }
}
function zT(e) {
  return bc(t);
  function t(a) {
    return a && a.type === e;
  }
}
function bc(e) {
  return t;
  function t(a, n, r) {
    return !!(PT(a) && e.call(this, a, typeof n == "number" ? n : void 0, r || void 0));
  }
}
function OT() {
  return !0;
}
function PT(e) {
  return e !== null && typeof e == "object" && "type" in e;
}
var _0 = [],
  vc = !0,
  jr = !1,
  Lc = "skip";
function tu(e, t, a, n) {
  let r;
  typeof t == "function" && typeof a != "function" ? (n = a, a = t) : r = t;
  let l = or(r),
    o = n ? -1 : 1;
  i(e, void 0, [])();
  function i(u, s, c) {
    let f = u && typeof u == "object" ? u : {};
    if (typeof f.type == "string") {
      let p = typeof f.tagName == "string" ? f.tagName : typeof f.name == "string" ? f.name : void 0;
      Object.defineProperty(d, "name", {
        value: "node (" + (u.type + (p ? "<" + p + ">" : "")) + ")"
      });
    }
    return d;
    function d() {
      let p = _0,
        x,
        b,
        C;
      if ((!t || l(u, s, c[c.length - 1] || void 0)) && (p = UT(a(u, c)), p[0] === jr)) return p;
      if ("children" in u && u.children) {
        let h = u;
        if (h.children && p[0] !== Lc) for (b = (n ? h.children.length : -1) + o, C = c.concat(h); b > -1 && b < h.children.length;) {
          let m = h.children[b];
          if (x = i(m, b, C)(), x[0] === jr) return x;
          b = typeof x[1] == "number" ? x[1] : b + o;
        }
      }
      return p;
    }
  }
}
function UT(e) {
  return Array.isArray(e) ? e : typeof e == "number" ? [vc, e] : e == null ? _0 : [e];
}
function Yr(e, t, a, n) {
  let r, l, o;
  typeof t == "function" && typeof a != "function" ? (l = void 0, o = t, r = a) : (l = t, o = a, r = n), tu(e, l, i, r);
  function i(u, s) {
    let c = s[s.length - 1],
      f = c ? c.children.indexOf(u) : void 0;
    return o(u, f, c);
  }
}
var xm = {}.hasOwnProperty,
  qT = {};
function V0(e, t) {
  let a = t || qT,
    n = new Map(),
    r = new Map(),
    l = new Map(),
    o = {
      ...N0,
      ...a.handlers
    },
    i = {
      all: s,
      applyData: HT,
      definitionById: n,
      footnoteById: r,
      footnoteCounts: l,
      footnoteOrder: [],
      handlers: o,
      one: u,
      options: a,
      patch: FT,
      wrap: GT
    };
  return Yr(e, function (c) {
    if (c.type === "definition" || c.type === "footnoteDefinition") {
      let f = c.type === "definition" ? n : r,
        d = String(c.identifier).toUpperCase();
      f.has(d) || f.set(d, c);
    }
  }), i;
  function u(c, f) {
    let d = c.type,
      p = i.handlers[d];
    if (xm.call(i.handlers, d) && p) return p(i, c, f);
    if (i.options.passThrough && i.options.passThrough.includes(d)) {
      if ("children" in c) {
        let {
            children: b,
            ...C
          } = c,
          h = ao(C);
        return h.children = i.all(c), h;
      }
      return ao(c);
    }
    return (i.options.unknownHandler || _T)(i, c, f);
  }
  function s(c) {
    let f = [];
    if ("children" in c) {
      let d = c.children,
        p = -1;
      for (; ++p < d.length;) {
        let x = i.one(d[p], c);
        if (x) {
          if (p && d[p - 1].type === "break" && (!Array.isArray(x) && x.type === "text" && (x.value = G0(x.value)), !Array.isArray(x) && x.type === "element")) {
            let b = x.children[0];
            b && b.type === "text" && (b.value = G0(b.value));
          }
          Array.isArray(x) ? f.push(...x) : f.push(x);
        }
      }
    }
    return f;
  }
}
function FT(e, t) {
  e.position && (t.position = Xp(e));
}
function HT(e, t) {
  let a = t;
  if (e && e.data) {
    let n = e.data.hName,
      r = e.data.hChildren,
      l = e.data.hProperties;
    if (typeof n == "string") if (a.type === "element") a.tagName = n;else {
      let o = "children" in a ? a.children : [a];
      a = {
        type: "element",
        tagName: n,
        properties: {},
        children: o
      };
    }
    a.type === "element" && l && Object.assign(a.properties, ao(l)), "children" in a && a.children && r !== null && r !== void 0 && (a.children = r);
  }
  return a;
}
function _T(e, t) {
  let a = t.data || {},
    n = "value" in t && !(xm.call(a, "hProperties") || xm.call(a, "hChildren")) ? {
      type: "text",
      value: t.value
    } : {
      type: "element",
      tagName: "div",
      properties: {},
      children: e.all(t)
    };
  return e.patch(t, n), e.applyData(t, n);
}
function GT(e, t) {
  let a = [],
    n = -1;
  for (t && a.push({
    type: "text",
    value: `
`
  }); ++n < e.length;) n && a.push({
    type: "text",
    value: `
`
  }), a.push(e[n]);
  return t && e.length > 0 && a.push({
    type: "text",
    value: `
`
  }), a;
}
function G0(e) {
  let t = 0,
    a = e.charCodeAt(t);
  for (; a === 9 || a === 32;) t++, a = e.charCodeAt(t);
  return e.slice(t);
}
function kc(e, t) {
  let a = V0(e, t),
    n = a.one(e, void 0),
    r = H0(a),
    l = Array.isArray(n) ? {
      type: "root",
      children: n
    } : n || {
      type: "root",
      children: []
    };
  return r && ("children" in l, l.children.push({
    type: "text",
    value: `
`
  }, r)), l;
}
function wc(e, t) {
  return e && "run" in e ? async function (a, n) {
    let r = kc(a, {
      file: n,
      ...t
    });
    await e.run(r, n);
  } : function (a, n) {
    return kc(a, {
      file: n,
      ...(e || t)
    });
  };
}
function ym(e) {
  if (e) throw e;
}
var Ic = G($0(), 1);
function au(e) {
  if (typeof e != "object" || e === null) return !1;
  let t = Object.getPrototypeOf(e);
  return (t === null || t === Object.prototype || Object.getPrototypeOf(t) === null) && !(Symbol.toStringTag in e) && !(Symbol.iterator in e);
}
function bm() {
  let e = [],
    t = {
      run: a,
      use: n
    };
  return t;
  function a(...r) {
    let l = -1,
      o = r.pop();
    if (typeof o != "function") throw new TypeError("Expected function as last argument, not " + o);
    i(null, ...r);
    function i(u, ...s) {
      let c = e[++l],
        f = -1;
      if (u) {
        o(u);
        return;
      }
      for (; ++f < r.length;) (s[f] === null || s[f] === void 0) && (s[f] = r[f]);
      r = s, c ? e1(c, i)(...s) : o(null, ...s);
    }
  }
  function n(r) {
    if (typeof r != "function") throw new TypeError("Expected `middelware` to be a function, not " + r);
    return e.push(r), t;
  }
}
function e1(e, t) {
  let a;
  return n;
  function n(...o) {
    let i = e.length > o.length,
      u;
    i && o.push(r);
    try {
      u = e.apply(this, o);
    } catch (s) {
      let c = s;
      if (i && a) throw c;
      return r(c);
    }
    i || (u && u.then && typeof u.then == "function" ? u.then(l, r) : u instanceof Error ? r(u) : l(u));
  }
  function r(o, ...i) {
    a || (a = !0, t(o, ...i));
  }
  function l(o) {
    r(null, o);
  }
}
var Aa = {
  basename: VT,
  dirname: XT,
  extname: jT,
  join: YT,
  sep: "/"
};
function VT(e, t) {
  if (t !== void 0 && typeof t != "string") throw new TypeError('"ext" argument must be a string');
  nu(e);
  let a = 0,
    n = -1,
    r = e.length,
    l;
  if (t === void 0 || t.length === 0 || t.length > e.length) {
    for (; r--;) if (e.codePointAt(r) === 47) {
      if (l) {
        a = r + 1;
        break;
      }
    } else n < 0 && (l = !0, n = r + 1);
    return n < 0 ? "" : e.slice(a, n);
  }
  if (t === e) return "";
  let o = -1,
    i = t.length - 1;
  for (; r--;) if (e.codePointAt(r) === 47) {
    if (l) {
      a = r + 1;
      break;
    }
  } else o < 0 && (l = !0, o = r + 1), i > -1 && (e.codePointAt(r) === t.codePointAt(i--) ? i < 0 && (n = r) : (i = -1, n = o));
  return a === n ? n = o : n < 0 && (n = e.length), e.slice(a, n);
}
function XT(e) {
  if (nu(e), e.length === 0) return ".";
  let t = -1,
    a = e.length,
    n;
  for (; --a;) if (e.codePointAt(a) === 47) {
    if (n) {
      t = a;
      break;
    }
  } else n || (n = !0);
  return t < 0 ? e.codePointAt(0) === 47 ? "/" : "." : t === 1 && e.codePointAt(0) === 47 ? "//" : e.slice(0, t);
}
function jT(e) {
  nu(e);
  let t = e.length,
    a = -1,
    n = 0,
    r = -1,
    l = 0,
    o;
  for (; t--;) {
    let i = e.codePointAt(t);
    if (i === 47) {
      if (o) {
        n = t + 1;
        break;
      }
      continue;
    }
    a < 0 && (o = !0, a = t + 1), i === 46 ? r < 0 ? r = t : l !== 1 && (l = 1) : r > -1 && (l = -1);
  }
  return r < 0 || a < 0 || l === 0 || l === 1 && r === a - 1 && r === n + 1 ? "" : e.slice(r, a);
}
function YT(...e) {
  let t = -1,
    a;
  for (; ++t < e.length;) nu(e[t]), e[t] && (a = a === void 0 ? e[t] : a + "/" + e[t]);
  return a === void 0 ? "." : QT(a);
}
function QT(e) {
  nu(e);
  let t = e.codePointAt(0) === 47,
    a = ZT(e, !t);
  return a.length === 0 && !t && (a = "."), a.length > 0 && e.codePointAt(e.length - 1) === 47 && (a += "/"), t ? "/" + a : a;
}
function ZT(e, t) {
  let a = "",
    n = 0,
    r = -1,
    l = 0,
    o = -1,
    i,
    u;
  for (; ++o <= e.length;) {
    if (o < e.length) i = e.codePointAt(o);else {
      if (i === 47) break;
      i = 47;
    }
    if (i === 47) {
      if (!(r === o - 1 || l === 1)) if (r !== o - 1 && l === 2) {
        if (a.length < 2 || n !== 2 || a.codePointAt(a.length - 1) !== 46 || a.codePointAt(a.length - 2) !== 46) {
          if (a.length > 2) {
            if (u = a.lastIndexOf("/"), u !== a.length - 1) {
              u < 0 ? (a = "", n = 0) : (a = a.slice(0, u), n = a.length - 1 - a.lastIndexOf("/")), r = o, l = 0;
              continue;
            }
          } else if (a.length > 0) {
            a = "", n = 0, r = o, l = 0;
            continue;
          }
        }
        t && (a = a.length > 0 ? a + "/.." : "..", n = 2);
      } else a.length > 0 ? a += "/" + e.slice(r + 1, o) : a = e.slice(r + 1, o), n = o - r - 1;
      r = o, l = 0;
    } else i === 46 && l > -1 ? l++ : l = -1;
  }
  return a;
}
function nu(e) {
  if (typeof e != "string") throw new TypeError("Path must be a string. Received " + JSON.stringify(e));
}
var t1 = {
  cwd: KT
};
function KT() {
  return "/";
}
function no(e) {
  return !!(e !== null && typeof e == "object" && "href" in e && e.href && "protocol" in e && e.protocol && e.auth === void 0);
}
function a1(e) {
  if (typeof e == "string") e = new URL(e);else if (!no(e)) {
    let t = new TypeError('The "path" argument must be of type string or an instance of URL. Received `' + e + "`");
    throw t.code = "ERR_INVALID_ARG_TYPE", t;
  }
  if (e.protocol !== "file:") {
    let t = new TypeError("The URL must be of scheme file");
    throw t.code = "ERR_INVALID_URL_SCHEME", t;
  }
  return WT(e);
}
function WT(e) {
  if (e.hostname !== "") {
    let n = new TypeError('File URL host must be "localhost" or empty on darwin');
    throw n.code = "ERR_INVALID_FILE_URL_HOST", n;
  }
  let t = e.pathname,
    a = -1;
  for (; ++a < t.length;) if (t.codePointAt(a) === 37 && t.codePointAt(a + 1) === 50) {
    let n = t.codePointAt(a + 2);
    if (n === 70 || n === 102) {
      let r = new TypeError("File URL path must not include encoded / characters");
      throw r.code = "ERR_INVALID_FILE_URL_PATH", r;
    }
  }
  return decodeURIComponent(t);
}
var vm = ["history", "path", "basename", "stem", "extname", "dirname"],
  Qr = class {
    constructor(t) {
      let a;
      t ? no(t) ? a = {
        path: t
      } : typeof t == "string" || JT(t) ? a = {
        value: t
      } : a = t : a = {}, this.cwd = "cwd" in a ? "" : t1.cwd(), this.data = {}, this.history = [], this.messages = [], this.value, this.map, this.result, this.stored;
      let n = -1;
      for (; ++n < vm.length;) {
        let l = vm[n];
        l in a && a[l] !== void 0 && a[l] !== null && (this[l] = l === "history" ? [...a[l]] : a[l]);
      }
      let r;
      for (r in a) vm.includes(r) || (this[r] = a[r]);
    }
    get basename() {
      return typeof this.path == "string" ? Aa.basename(this.path) : void 0;
    }
    set basename(t) {
      km(t, "basename"), Lm(t, "basename"), this.path = Aa.join(this.dirname || "", t);
    }
    get dirname() {
      return typeof this.path == "string" ? Aa.dirname(this.path) : void 0;
    }
    set dirname(t) {
      n1(this.basename, "dirname"), this.path = Aa.join(t || "", this.basename);
    }
    get extname() {
      return typeof this.path == "string" ? Aa.extname(this.path) : void 0;
    }
    set extname(t) {
      if (Lm(t, "extname"), n1(this.dirname, "extname"), t) {
        if (t.codePointAt(0) !== 46) throw new Error("`extname` must start with `.`");
        if (t.includes(".", 1)) throw new Error("`extname` cannot contain multiple dots");
      }
      this.path = Aa.join(this.dirname, this.stem + (t || ""));
    }
    get path() {
      return this.history[this.history.length - 1];
    }
    set path(t) {
      no(t) && (t = a1(t)), km(t, "path"), this.path !== t && this.history.push(t);
    }
    get stem() {
      return typeof this.path == "string" ? Aa.basename(this.path, this.extname) : void 0;
    }
    set stem(t) {
      km(t, "stem"), Lm(t, "stem"), this.path = Aa.join(this.dirname || "", t + (this.extname || ""));
    }
    fail(t, a, n) {
      let r = this.message(t, a, n);
      throw r.fatal = !0, r;
    }
    info(t, a, n) {
      let r = this.message(t, a, n);
      return r.fatal = void 0, r;
    }
    message(t, a, n) {
      let r = new at(t, a, n);
      return this.path && (r.name = this.path + ":" + r.name, r.file = this.path), r.fatal = !1, this.messages.push(r), r;
    }
    toString(t) {
      return this.value === void 0 ? "" : typeof this.value == "string" ? this.value : new TextDecoder(t || void 0).decode(this.value);
    }
  };
function Lm(e, t) {
  if (e && e.includes(Aa.sep)) throw new Error("`" + t + "` cannot be a path: did not expect `" + Aa.sep + "`");
}
function km(e, t) {
  if (!e) throw new Error("`" + t + "` cannot be empty");
}
function n1(e, t) {
  if (!e) throw new Error("Setting `" + t + "` requires `path` to be set too");
}
function JT(e) {
  return !!(e && typeof e == "object" && "byteLength" in e && "byteOffset" in e);
}
var r1 = function (e) {
  let n = this.constructor.prototype,
    r = n[e],
    l = function () {
      return r.apply(l, arguments);
    };
  return Object.setPrototypeOf(l, n), l;
};
var $T = {}.hasOwnProperty,
  Im = class e extends r1 {
    constructor() {
      super("copy"), this.Compiler = void 0, this.Parser = void 0, this.attachers = [], this.compiler = void 0, this.freezeIndex = -1, this.frozen = void 0, this.namespace = {}, this.parser = void 0, this.transformers = bm();
    }
    copy() {
      let t = new e(),
        a = -1;
      for (; ++a < this.attachers.length;) {
        let n = this.attachers[a];
        t.use(...n);
      }
      return t.data((0, Ic.default)(!0, {}, this.namespace)), t;
    }
    data(t, a) {
      return typeof t == "string" ? arguments.length === 2 ? (Cm("data", this.frozen), this.namespace[t] = a, this) : $T.call(this.namespace, t) && this.namespace[t] || void 0 : t ? (Cm("data", this.frozen), this.namespace = t, this) : this.namespace;
    }
    freeze() {
      if (this.frozen) return this;
      let t = this;
      for (; ++this.freezeIndex < this.attachers.length;) {
        let [a, ...n] = this.attachers[this.freezeIndex];
        if (n[0] === !1) continue;
        n[0] === !0 && (n[0] = void 0);
        let r = a.call(t, ...n);
        typeof r == "function" && this.transformers.use(r);
      }
      return this.frozen = !0, this.freezeIndex = Number.POSITIVE_INFINITY, this;
    }
    parse(t) {
      this.freeze();
      let a = Cc(t),
        n = this.parser || this.Parser;
      return wm("parse", n), n(String(a), a);
    }
    process(t, a) {
      let n = this;
      return this.freeze(), wm("process", this.parser || this.Parser), Sm("process", this.compiler || this.Compiler), a ? r(void 0, a) : new Promise(r);
      function r(l, o) {
        let i = Cc(t),
          u = n.parse(i);
        n.run(u, i, function (c, f, d) {
          if (c || !f || !d) return s(c);
          let p = f,
            x = n.stringify(p, d);
          tM(x) ? d.value = x : d.result = x, s(c, d);
        });
        function s(c, f) {
          c || !f ? o(c) : l ? l(f) : a(void 0, f);
        }
      }
    }
    processSync(t) {
      let a = !1,
        n;
      return this.freeze(), wm("processSync", this.parser || this.Parser), Sm("processSync", this.compiler || this.Compiler), this.process(t, r), o1("processSync", "process", a), n;
      function r(l, o) {
        a = !0, ym(l), n = o;
      }
    }
    run(t, a, n) {
      l1(t), this.freeze();
      let r = this.transformers;
      return !n && typeof a == "function" && (n = a, a = void 0), n ? l(void 0, n) : new Promise(l);
      function l(o, i) {
        let u = Cc(a);
        r.run(t, u, s);
        function s(c, f, d) {
          let p = f || t;
          c ? i(c) : o ? o(p) : n(void 0, p, d);
        }
      }
    }
    runSync(t, a) {
      let n = !1,
        r;
      return this.run(t, a, l), o1("runSync", "run", n), r;
      function l(o, i) {
        ym(o), r = i, n = !0;
      }
    }
    stringify(t, a) {
      this.freeze();
      let n = Cc(a),
        r = this.compiler || this.Compiler;
      return Sm("stringify", r), l1(t), r(t, n);
    }
    use(t, ...a) {
      let n = this.attachers,
        r = this.namespace;
      if (Cm("use", this.frozen), t != null) if (typeof t == "function") u(t, a);else if (typeof t == "object") Array.isArray(t) ? i(t) : o(t);else throw new TypeError("Expected usable value, not `" + t + "`");
      return this;
      function l(s) {
        if (typeof s == "function") u(s, []);else if (typeof s == "object") {
          if (Array.isArray(s)) {
            let [c, ...f] = s;
            u(c, f);
          } else o(s);
        } else throw new TypeError("Expected usable value, not `" + s + "`");
      }
      function o(s) {
        if (!("plugins" in s) && !("settings" in s)) throw new Error("Expected usable value but received an empty preset, which is probably a mistake: presets typically come with `plugins` and sometimes with `settings`, but this has neither");
        i(s.plugins), s.settings && (r.settings = (0, Ic.default)(!0, r.settings, s.settings));
      }
      function i(s) {
        let c = -1;
        if (s != null) if (Array.isArray(s)) for (; ++c < s.length;) {
          let f = s[c];
          l(f);
        } else throw new TypeError("Expected a list of plugins, not `" + s + "`");
      }
      function u(s, c) {
        let f = -1,
          d = -1;
        for (; ++f < n.length;) if (n[f][0] === s) {
          d = f;
          break;
        }
        if (d === -1) n.push([s, ...c]);else if (c.length > 0) {
          let [p, ...x] = c,
            b = n[d][1];
          au(b) && au(p) && (p = (0, Ic.default)(!0, b, p)), n[d] = [s, p, ...x];
        }
      }
    }
  },
  Am = new Im().freeze();
function wm(e, t) {
  if (typeof t != "function") throw new TypeError("Cannot `" + e + "` without `parser`");
}
function Sm(e, t) {
  if (typeof t != "function") throw new TypeError("Cannot `" + e + "` without `compiler`");
}
function Cm(e, t) {
  if (t) throw new Error("Cannot call `" + e + "` on a frozen processor.\nCreate a new processor first, by calling it: use `processor()` instead of `processor`.");
}
function l1(e) {
  if (!au(e) || typeof e.type != "string") throw new TypeError("Expected node, got `" + e + "`");
}
function o1(e, t, a) {
  if (!a) throw new Error("`" + e + "` finished async. Use `" + t + "` instead");
}
function Cc(e) {
  return eM(e) ? e : new Qr(e);
}
function eM(e) {
  return !!(e && typeof e == "object" && "message" in e && "messages" in e);
}
function tM(e) {
  return typeof e == "string" || aM(e);
}
function aM(e) {
  return !!(e && typeof e == "object" && "byteLength" in e && "byteOffset" in e);
}
var nM = "https://github.com/remarkjs/react-markdown/blob/main/changelog.md",
  i1 = [],
  u1 = {
    allowDangerousHtml: !0
  },
  rM = /^(https?|ircs?|mailto|xmpp)$/i,
  lM = [{
    from: "astPlugins",
    id: "remove-buggy-html-in-markdown-parser"
  }, {
    from: "allowDangerousHtml",
    id: "remove-buggy-html-in-markdown-parser"
  }, {
    from: "allowNode",
    id: "replace-allownode-allowedtypes-and-disallowedtypes",
    to: "allowElement"
  }, {
    from: "allowedTypes",
    id: "replace-allownode-allowedtypes-and-disallowedtypes",
    to: "allowedElements"
  }, {
    from: "className",
    id: "remove-classname"
  }, {
    from: "disallowedTypes",
    id: "replace-allownode-allowedtypes-and-disallowedtypes",
    to: "disallowedElements"
  }, {
    from: "escapeHtml",
    id: "remove-buggy-html-in-markdown-parser"
  }, {
    from: "includeElementIndex",
    id: "#remove-includeelementindex"
  }, {
    from: "includeNodeIndex",
    id: "change-includenodeindex-to-includeelementindex"
  }, {
    from: "linkTarget",
    id: "remove-linktarget"
  }, {
    from: "plugins",
    id: "change-plugins-to-remarkplugins",
    to: "remarkPlugins"
  }, {
    from: "rawSourcePos",
    id: "#remove-rawsourcepos"
  }, {
    from: "renderers",
    id: "change-renderers-to-components",
    to: "components"
  }, {
    from: "source",
    id: "change-source-to-children",
    to: "children"
  }, {
    from: "sourcePos",
    id: "#remove-sourcepos"
  }, {
    from: "transformImageUri",
    id: "#add-urltransform",
    to: "urlTransform"
  }, {
    from: "transformLinkUri",
    id: "#add-urltransform",
    to: "urlTransform"
  }];
function Tm(e) {
  let t = oM(e),
    a = iM(e);
  return uM(t.runSync(t.parse(a), a), e);
}
function oM(e) {
  let t = e.rehypePlugins || i1,
    a = e.remarkPlugins || i1,
    n = e.remarkRehypeOptions ? {
      ...e.remarkRehypeOptions,
      ...u1
    } : u1;
  return Am().use(mc).use(a).use(wc, n).use(t);
}
function iM(e) {
  let t = e.children || "",
    a = new Qr();
  return typeof t == "string" ? a.value = t : ("" + t, void 0), a;
}
function uM(e, t) {
  let a = t.allowedElements,
    n = t.allowElement,
    r = t.components,
    l = t.disallowedElements,
    o = t.skipHtml,
    i = t.unwrapDisallowed,
    u = t.urlTransform || c1;
  for (let c of lM) Object.hasOwn(t, c.from) && ("" + c.from + (c.to ? "use `" + c.to + "` instead" : "remove it") + nM + c.id, void 0);
  return a && l && void 0, Yr(e, s), Qp(e, {
    Fragment: ro.Fragment,
    components: r,
    ignoreInvalidStyle: !0,
    jsx: ro.jsx,
    jsxs: ro.jsxs,
    passKeys: !0,
    passNode: !0
  });
  function s(c, f, d) {
    if (c.type === "raw" && d && typeof f == "number") return o ? d.children.splice(f, 1) : d.children[f] = {
      type: "text",
      value: c.value
    }, f;
    if (c.type === "element") {
      let p;
      for (p in Qi) if (Object.hasOwn(Qi, p) && Object.hasOwn(c.properties, p)) {
        let x = c.properties[p],
          b = Qi[p];
        (b === null || b.includes(c.tagName)) && (c.properties[p] = u(String(x || ""), p, c));
      }
    }
    if (c.type === "element") {
      let p = a ? !a.includes(c.tagName) : l ? l.includes(c.tagName) : !1;
      if (!p && n && typeof f == "number" && (p = !n(c, f, d)), p && d && typeof f == "number") return i && c.children ? d.children.splice(f, 1, ...c.children) : d.children.splice(f, 1), f;
    }
  }
}
function c1(e) {
  let t = e.indexOf(":"),
    a = e.indexOf("?"),
    n = e.indexOf("#"),
    r = e.indexOf("/");
  return t === -1 || r !== -1 && t > r || a !== -1 && t > a || n !== -1 && t > n || rM.test(e.slice(0, t)) ? e : "";
}
// ──── Library: remark-gfm: ccount, escape-string-regexp, mdast-util-find-and-replace, mdast-util-gfm-* (autolink-literal, footnote, strikethrough, table, task-list-item), markdown-table, mdast-util-to-markdown handlers, micromark-extension-gfm-* (bundled from npm; unchanged, names left minified) ────
function Mm(e, t) {
  let a = String(e);
  if (typeof t != "string") throw new TypeError("Expected character");
  let n = 0,
    r = a.indexOf(t);
  for (; r !== -1;) n++, r = a.indexOf(t, r + t.length);
  return n;
}
function Dm(e) {
  if (typeof e != "string") throw new TypeError("Expected a string");
  return e.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
}
function Bm(e, t, a) {
  let r = or((a || {}).ignore || []),
    l = sM(t),
    o = -1;
  for (; ++o < l.length;) tu(e, "text", i);
  function i(s, c) {
    let f = -1,
      d;
    for (; ++f < c.length;) {
      let p = c[f],
        x = d ? d.children : void 0;
      if (r(p, x ? x.indexOf(p) : void 0, d)) return;
      d = p;
    }
    if (d) return u(s, c);
  }
  function u(s, c) {
    let f = c[c.length - 1],
      d = l[o][0],
      p = l[o][1],
      x = 0,
      C = f.children.indexOf(s),
      h = !1,
      m = [];
    d.lastIndex = 0;
    let g = d.exec(s.value);
    for (; g;) {
      let L = g.index,
        I = {
          index: g.index,
          input: g.input,
          stack: [...c, s]
        },
        k = p(...g, I);
      if (typeof k == "string" && (k = k.length > 0 ? {
        type: "text",
        value: k
      } : void 0), k === !1 ? d.lastIndex = L + 1 : (x !== L && m.push({
        type: "text",
        value: s.value.slice(x, L)
      }), Array.isArray(k) ? m.push(...k) : k && m.push(k), x = L + g[0].length, h = !0), !d.global) break;
      g = d.exec(s.value);
    }
    return h ? (x < s.value.length && m.push({
      type: "text",
      value: s.value.slice(x)
    }), f.children.splice(C, 1, ...m)) : m = [s], C + m.length;
  }
}
function sM(e) {
  let t = [];
  if (!Array.isArray(e)) throw new TypeError("Expected find and replace tuple or list of tuples");
  let a = !e[0] || Array.isArray(e[0]) ? e : [e],
    n = -1;
  for (; ++n < a.length;) {
    let r = a[n];
    t.push([cM(r[0]), fM(r[1])]);
  }
  return t;
}
function cM(e) {
  return typeof e == "string" ? new RegExp(Dm(e), "g") : e;
}
function fM(e) {
  return typeof e == "function" ? e : function () {
    return e;
  };
}
var Em = "phrasing",
  Rm = ["autolink", "link", "image", "label"];
function zm() {
  return {
    transforms: [xM],
    enter: {
      literalAutolink: dM,
      literalAutolinkEmail: Nm,
      literalAutolinkHttp: Nm,
      literalAutolinkWww: Nm
    },
    exit: {
      literalAutolink: gM,
      literalAutolinkEmail: hM,
      literalAutolinkHttp: pM,
      literalAutolinkWww: mM
    }
  };
}
function Om() {
  return {
    unsafe: [{
      character: "@",
      before: "[+\\-.\\w]",
      after: "[\\-.\\w]",
      inConstruct: Em,
      notInConstruct: Rm
    }, {
      character: ".",
      before: "[Ww]",
      after: "[\\-.\\w]",
      inConstruct: Em,
      notInConstruct: Rm
    }, {
      character: ":",
      before: "[ps]",
      after: "\\/",
      inConstruct: Em,
      notInConstruct: Rm
    }]
  };
}
function dM(e) {
  this.enter({
    type: "link",
    title: null,
    url: "",
    children: []
  }, e);
}
function Nm(e) {
  this.config.enter.autolinkProtocol.call(this, e);
}
function pM(e) {
  this.config.exit.autolinkProtocol.call(this, e);
}
function mM(e) {
  this.config.exit.data.call(this, e);
  let t = this.stack[this.stack.length - 1];
  t.type, t.url = "http://" + this.sliceSerialize(e);
}
function hM(e) {
  this.config.exit.autolinkEmail.call(this, e);
}
function gM(e) {
  this.exit(e);
}
function xM(e) {
  Bm(e, [[/(https?:\/\/|www(?=\.))([-.\w]+)([^ \t\r\n]*)/gi, yM], [/(?<=^|\s|\p{P}|\p{S})([-.\w+]+)@([-\w]+(?:\.[-\w]+)+)/gu, bM]], {
    ignore: ["link", "linkReference"]
  });
}
function yM(e, t, a, n, r) {
  let l = "";
  if (!f1(r) || (/^w/i.test(t) && (a = t + a, t = "", l = "http://"), !vM(a))) return !1;
  let o = LM(a + n);
  if (!o[0]) return !1;
  let i = {
    type: "link",
    title: null,
    url: l + t + o[0],
    children: [{
      type: "text",
      value: t + o[0]
    }]
  };
  return o[1] ? [i, {
    type: "text",
    value: o[1]
  }] : i;
}
function bM(e, t, a, n) {
  return !f1(n, !0) || /[-\d_]$/.test(a) ? !1 : {
    type: "link",
    title: null,
    url: "mailto:" + t + "@" + a,
    children: [{
      type: "text",
      value: t + "@" + a
    }]
  };
}
function vM(e) {
  let t = e.split(".");
  return !(t.length < 2 || t[t.length - 1] && (/_/.test(t[t.length - 1]) || !/[a-zA-Z\d]/.test(t[t.length - 1])) || t[t.length - 2] && (/_/.test(t[t.length - 2]) || !/[a-zA-Z\d]/.test(t[t.length - 2])));
}
function LM(e) {
  let t = /[!"&'),.:;<>?\]}]+$/.exec(e);
  if (!t) return [e, void 0];
  e = e.slice(0, t.index);
  let a = t[0],
    n = a.indexOf(")"),
    r = Mm(e, "("),
    l = Mm(e, ")");
  for (; n !== -1 && r > l;) e += a.slice(0, n + 1), a = a.slice(n + 1), n = a.indexOf(")"), l++;
  return [e, a];
}
function f1(e, t) {
  let a = e.input.charCodeAt(e.index - 1);
  return (e.index === 0 || qa(a) || Hr(a)) && (!t || a !== 47);
}
d1.peek = DM;
function kM() {
  this.buffer();
}
function wM(e) {
  this.enter({
    type: "footnoteReference",
    identifier: "",
    label: ""
  }, e);
}
function SM() {
  this.buffer();
}
function CM(e) {
  this.enter({
    type: "footnoteDefinition",
    identifier: "",
    label: "",
    children: []
  }, e);
}
function IM(e) {
  let t = this.resume(),
    a = this.stack[this.stack.length - 1];
  a.type, a.identifier = Mt(this.sliceSerialize(e)).toLowerCase(), a.label = t;
}
function AM(e) {
  this.exit(e);
}
function TM(e) {
  let t = this.resume(),
    a = this.stack[this.stack.length - 1];
  a.type, a.identifier = Mt(this.sliceSerialize(e)).toLowerCase(), a.label = t;
}
function MM(e) {
  this.exit(e);
}
function DM() {
  return "[";
}
function d1(e, t, a, n) {
  let r = a.createTracker(n),
    l = r.move("[^"),
    o = a.enter("footnoteReference"),
    i = a.enter("reference");
  return l += r.move(a.safe(a.associationId(e), {
    after: "]",
    before: l
  })), i(), o(), l += r.move("]"), l;
}
function Pm() {
  return {
    enter: {
      gfmFootnoteCallString: kM,
      gfmFootnoteCall: wM,
      gfmFootnoteDefinitionLabelString: SM,
      gfmFootnoteDefinition: CM
    },
    exit: {
      gfmFootnoteCallString: IM,
      gfmFootnoteCall: AM,
      gfmFootnoteDefinitionLabelString: TM,
      gfmFootnoteDefinition: MM
    }
  };
}
function Um(e) {
  let t = !1;
  return e && e.firstLineBlank && (t = !0), {
    handlers: {
      footnoteDefinition: a,
      footnoteReference: d1
    },
    unsafe: [{
      character: "[",
      inConstruct: ["label", "phrasing", "reference"]
    }]
  };
  function a(n, r, l, o) {
    let i = l.createTracker(o),
      u = i.move("[^"),
      s = l.enter("footnoteDefinition"),
      c = l.enter("label");
    return u += i.move(l.safe(l.associationId(n), {
      before: u,
      after: "]"
    })), c(), u += i.move("]:"), n.children && n.children.length > 0 && (i.shift(4), u += i.move((t ? `
` : " ") + l.indentLines(l.containerFlow(n, i.current()), t ? p1 : BM))), s(), u;
  }
}
function BM(e, t, a) {
  return t === 0 ? e : p1(e, t, a);
}
function p1(e, t, a) {
  return (a ? "" : "    ") + e;
}
var EM = ["autolink", "destinationLiteral", "destinationRaw", "reference", "titleQuote", "titleApostrophe"];
m1.peek = zM;
function qm() {
  return {
    canContainEols: ["delete"],
    enter: {
      strikethrough: RM
    },
    exit: {
      strikethrough: NM
    }
  };
}
function Fm() {
  return {
    unsafe: [{
      character: "~",
      inConstruct: "phrasing",
      notInConstruct: EM
    }],
    handlers: {
      delete: m1
    }
  };
}
function RM(e) {
  this.enter({
    type: "delete",
    children: []
  }, e);
}
function NM(e) {
  this.exit(e);
}
function m1(e, t, a, n) {
  let r = a.createTracker(n),
    l = a.enter("strikethrough"),
    o = r.move("~~");
  return o += a.containerPhrasing(e, {
    ...r.current(),
    before: o,
    after: "~"
  }), o += r.move("~~"), l(), o;
}
function zM() {
  return "~";
}
function OM(e) {
  return e.length;
}
function g1(e, t) {
  let a = t || {},
    n = (a.align || []).concat(),
    r = a.stringLength || OM,
    l = [],
    o = [],
    i = [],
    u = [],
    s = 0,
    c = -1;
  for (; ++c < e.length;) {
    let b = [],
      C = [],
      h = -1;
    for (e[c].length > s && (s = e[c].length); ++h < e[c].length;) {
      let m = PM(e[c][h]);
      if (a.alignDelimiters !== !1) {
        let g = r(m);
        C[h] = g, (u[h] === void 0 || g > u[h]) && (u[h] = g);
      }
      b.push(m);
    }
    o[c] = b, i[c] = C;
  }
  let f = -1;
  if (typeof n == "object" && "length" in n) for (; ++f < s;) l[f] = h1(n[f]);else {
    let b = h1(n);
    for (; ++f < s;) l[f] = b;
  }
  f = -1;
  let d = [],
    p = [];
  for (; ++f < s;) {
    let b = l[f],
      C = "",
      h = "";
    b === 99 ? (C = ":", h = ":") : b === 108 ? C = ":" : b === 114 && (h = ":");
    let m = a.alignDelimiters === !1 ? 1 : Math.max(1, u[f] - C.length - h.length),
      g = C + "-".repeat(m) + h;
    a.alignDelimiters !== !1 && (m = C.length + m + h.length, m > u[f] && (u[f] = m), p[f] = m), d[f] = g;
  }
  o.splice(1, 0, d), i.splice(1, 0, p), c = -1;
  let x = [];
  for (; ++c < o.length;) {
    let b = o[c],
      C = i[c];
    f = -1;
    let h = [];
    for (; ++f < s;) {
      let m = b[f] || "",
        g = "",
        L = "";
      if (a.alignDelimiters !== !1) {
        let I = u[f] - (C[f] || 0),
          k = l[f];
        k === 114 ? g = " ".repeat(I) : k === 99 ? I % 2 ? (g = " ".repeat(I / 2 + .5), L = " ".repeat(I / 2 - .5)) : (g = " ".repeat(I / 2), L = g) : L = " ".repeat(I);
      }
      a.delimiterStart !== !1 && !f && h.push("|"), a.padding !== !1 && !(a.alignDelimiters === !1 && m === "") && (a.delimiterStart !== !1 || f) && h.push(" "), a.alignDelimiters !== !1 && h.push(g), h.push(m), a.alignDelimiters !== !1 && h.push(L), a.padding !== !1 && h.push(" "), (a.delimiterEnd !== !1 || f !== s - 1) && h.push("|");
    }
    x.push(a.delimiterEnd === !1 ? h.join("").replace(/ +$/, "") : h.join(""));
  }
  return x.join(`
`);
}
function PM(e) {
  return e == null ? "" : String(e);
}
function h1(e) {
  let t = typeof e == "string" ? e.codePointAt(0) : 0;
  return t === 67 || t === 99 ? 99 : t === 76 || t === 108 ? 108 : t === 82 || t === 114 ? 114 : 0;
}
function x1(e, t, a, n) {
  let r = a.enter("blockquote"),
    l = a.createTracker(n);
  l.move("> "), l.shift(2);
  let o = a.indentLines(a.containerFlow(e, l.current()), UM);
  return r(), o;
}
function UM(e, t, a) {
  return ">" + (a ? "" : " ") + e;
}
function b1(e, t) {
  return y1(e, t.inConstruct, !0) && !y1(e, t.notInConstruct, !1);
}
function y1(e, t, a) {
  if (typeof t == "string" && (t = [t]), !t || t.length === 0) return a;
  let n = -1;
  for (; ++n < t.length;) if (e.includes(t[n])) return !0;
  return !1;
}
function Hm(e, t, a, n) {
  let r = -1;
  for (; ++r < a.unsafe.length;) if (a.unsafe[r].character === `
` && b1(a.stack, a.unsafe[r])) return /[ \t]/.test(n.before) ? "" : " ";
  return `\\
`;
}
function v1(e, t) {
  let a = String(e),
    n = a.indexOf(t),
    r = n,
    l = 0,
    o = 0;
  if (typeof t != "string") throw new TypeError("Expected substring");
  for (; n !== -1;) n === r ? ++l > o && (o = l) : l = 1, r = n + t.length, n = a.indexOf(t, r);
  return o;
}
function L1(e, t) {
  return !!(t.options.fences === !1 && e.value && !e.lang && /[^ \r\n]/.test(e.value) && !/^[\t ]*(?:[\r\n]|$)|(?:^|[\r\n])[\t ]*$/.test(e.value));
}
function k1(e) {
  let t = e.options.fence || "`";
  if (t !== "`" && t !== "~") throw new Error("Cannot serialize code with `" + t + "` for `options.fence`, expected `` ` `` or `~`");
  return t;
}
function w1(e, t, a, n) {
  let r = k1(a),
    l = e.value || "",
    o = r === "`" ? "GraveAccent" : "Tilde";
  if (L1(e, a)) {
    let f = a.enter("codeIndented"),
      d = a.indentLines(l, qM);
    return f(), d;
  }
  let i = a.createTracker(n),
    u = r.repeat(Math.max(v1(l, r) + 1, 3)),
    s = a.enter("codeFenced"),
    c = i.move(u);
  if (e.lang) {
    let f = a.enter(`codeFencedLang${o}`);
    c += i.move(a.safe(e.lang, {
      before: c,
      after: " ",
      encode: ["`"],
      ...i.current()
    })), f();
  }
  if (e.lang && e.meta) {
    let f = a.enter(`codeFencedMeta${o}`);
    c += i.move(" "), c += i.move(a.safe(e.meta, {
      before: c,
      after: `
`,
      encode: ["`"],
      ...i.current()
    })), f();
  }
  return c += i.move(`
`), l && (c += i.move(l + `
`)), c += i.move(u), s(), c;
}
function qM(e, t, a) {
  return (a ? "" : "    ") + e;
}
function lo(e) {
  let t = e.options.quote || '"';
  if (t !== '"' && t !== "'") throw new Error("Cannot serialize title with `" + t + "` for `options.quote`, expected `\"`, or `'`");
  return t;
}
function S1(e, t, a, n) {
  let r = lo(a),
    l = r === '"' ? "Quote" : "Apostrophe",
    o = a.enter("definition"),
    i = a.enter("label"),
    u = a.createTracker(n),
    s = u.move("[");
  return s += u.move(a.safe(a.associationId(e), {
    before: s,
    after: "]",
    ...u.current()
  })), s += u.move("]: "), i(), !e.url || /[\0- \u007F]/.test(e.url) ? (i = a.enter("destinationLiteral"), s += u.move("<"), s += u.move(a.safe(e.url, {
    before: s,
    after: ">",
    ...u.current()
  })), s += u.move(">")) : (i = a.enter("destinationRaw"), s += u.move(a.safe(e.url, {
    before: s,
    after: e.title ? " " : `
`,
    ...u.current()
  }))), i(), e.title && (i = a.enter(`title${l}`), s += u.move(" " + r), s += u.move(a.safe(e.title, {
    before: s,
    after: r,
    ...u.current()
  })), s += u.move(r), i()), o(), s;
}
function C1(e) {
  let t = e.options.emphasis || "*";
  if (t !== "*" && t !== "_") throw new Error("Cannot serialize emphasis with `" + t + "` for `options.emphasis`, expected `*`, or `_`");
  return t;
}
function ir(e) {
  return "&#x" + e.toString(16).toUpperCase() + ";";
}
function oo(e, t, a) {
  let n = xn(e),
    r = xn(t);
  return n === void 0 ? r === void 0 ? a === "_" ? {
    inside: !0,
    outside: !0
  } : {
    inside: !1,
    outside: !1
  } : r === 1 ? {
    inside: !0,
    outside: !0
  } : {
    inside: !1,
    outside: !0
  } : n === 1 ? r === void 0 ? {
    inside: !1,
    outside: !1
  } : r === 1 ? {
    inside: !0,
    outside: !0
  } : {
    inside: !1,
    outside: !1
  } : r === void 0 ? {
    inside: !1,
    outside: !1
  } : r === 1 ? {
    inside: !0,
    outside: !1
  } : {
    inside: !1,
    outside: !1
  };
}
_m.peek = FM;
function _m(e, t, a, n) {
  let r = C1(a),
    l = a.enter("emphasis"),
    o = a.createTracker(n),
    i = o.move(r),
    u = o.move(a.containerPhrasing(e, {
      after: r,
      before: i,
      ...o.current()
    })),
    s = u.charCodeAt(0),
    c = oo(n.before.charCodeAt(n.before.length - 1), s, r);
  c.inside && (u = ir(s) + u.slice(1));
  let f = u.charCodeAt(u.length - 1),
    d = oo(n.after.charCodeAt(0), f, r);
  d.inside && (u = u.slice(0, -1) + ir(f));
  let p = o.move(r);
  return l(), a.attentionEncodeSurroundingInfo = {
    after: d.outside,
    before: c.outside
  }, i + u + p;
}
function FM(e, t, a) {
  return a.options.emphasis || "*";
}
function I1(e, t) {
  let a = !1;
  return Yr(e, function (n) {
    if ("value" in n && /\r?\n|\r/.test(n.value) || n.type === "break") return a = !0, jr;
  }), !!((!e.depth || e.depth < 3) && qr(e) && (t.options.setext || a));
}
function A1(e, t, a, n) {
  let r = Math.max(Math.min(6, e.depth || 1), 1),
    l = a.createTracker(n);
  if (I1(e, a)) {
    let c = a.enter("headingSetext"),
      f = a.enter("phrasing"),
      d = a.containerPhrasing(e, {
        ...l.current(),
        before: `
`,
        after: `
`
      });
    return f(), c(), d + `
` + (r === 1 ? "=" : "-").repeat(d.length - (Math.max(d.lastIndexOf("\r"), d.lastIndexOf(`
`)) + 1));
  }
  let o = "#".repeat(r),
    i = a.enter("headingAtx"),
    u = a.enter("phrasing");
  l.move(o + " ");
  let s = a.containerPhrasing(e, {
    before: "# ",
    after: `
`,
    ...l.current()
  });
  return /^[\t ]/.test(s) && (s = ir(s.charCodeAt(0)) + s.slice(1)), s = s ? o + " " + s : o, a.options.closeAtx && (s += " " + o), u(), i(), s;
}
Gm.peek = HM;
function Gm(e) {
  return e.value || "";
}
function HM() {
  return "<";
}
Vm.peek = _M;
function Vm(e, t, a, n) {
  let r = lo(a),
    l = r === '"' ? "Quote" : "Apostrophe",
    o = a.enter("image"),
    i = a.enter("label"),
    u = a.createTracker(n),
    s = u.move("![");
  return s += u.move(a.safe(e.alt, {
    before: s,
    after: "]",
    ...u.current()
  })), s += u.move("]("), i(), !e.url && e.title || /[\0- \u007F]/.test(e.url) ? (i = a.enter("destinationLiteral"), s += u.move("<"), s += u.move(a.safe(e.url, {
    before: s,
    after: ">",
    ...u.current()
  })), s += u.move(">")) : (i = a.enter("destinationRaw"), s += u.move(a.safe(e.url, {
    before: s,
    after: e.title ? " " : ")",
    ...u.current()
  }))), i(), e.title && (i = a.enter(`title${l}`), s += u.move(" " + r), s += u.move(a.safe(e.title, {
    before: s,
    after: r,
    ...u.current()
  })), s += u.move(r), i()), s += u.move(")"), o(), s;
}
function _M() {
  return "!";
}
Xm.peek = GM;
function Xm(e, t, a, n) {
  let r = e.referenceType,
    l = a.enter("imageReference"),
    o = a.enter("label"),
    i = a.createTracker(n),
    u = i.move("!["),
    s = a.safe(e.alt, {
      before: u,
      after: "]",
      ...i.current()
    });
  u += i.move(s + "]["), o();
  let c = a.stack;
  a.stack = [], o = a.enter("reference");
  let f = a.safe(a.associationId(e), {
    before: u,
    after: "]",
    ...i.current()
  });
  return o(), a.stack = c, l(), r === "full" || !s || s !== f ? u += i.move(f + "]") : r === "shortcut" ? u = u.slice(0, -1) : u += i.move("]"), u;
}
function GM() {
  return "!";
}
jm.peek = VM;
function jm(e, t, a) {
  let n = e.value || "",
    r = "`",
    l = -1;
  for (; new RegExp("(^|[^`])" + r + "([^`]|$)").test(n);) r += "`";
  for (/[^ \r\n]/.test(n) && (/^[ \r\n]/.test(n) && /[ \r\n]$/.test(n) || /^`|`$/.test(n)) && (n = " " + n + " "); ++l < a.unsafe.length;) {
    let o = a.unsafe[l],
      i = a.compilePattern(o),
      u;
    if (o.atBreak) for (; u = i.exec(n);) {
      let s = u.index;
      n.charCodeAt(s) === 10 && n.charCodeAt(s - 1) === 13 && s--, n = n.slice(0, s) + " " + n.slice(u.index + 1);
    }
  }
  return r + n + r;
}
function VM() {
  return "`";
}
function Ym(e, t) {
  let a = qr(e);
  return !!(!t.options.resourceLink && e.url && !e.title && e.children && e.children.length === 1 && e.children[0].type === "text" && (a === e.url || "mailto:" + a === e.url) && /^[a-z][a-z+.-]+:/i.test(e.url) && !/[\0- <>\u007F]/.test(e.url));
}
Qm.peek = XM;
function Qm(e, t, a, n) {
  let r = lo(a),
    l = r === '"' ? "Quote" : "Apostrophe",
    o = a.createTracker(n),
    i,
    u;
  if (Ym(e, a)) {
    let c = a.stack;
    a.stack = [], i = a.enter("autolink");
    let f = o.move("<");
    return f += o.move(a.containerPhrasing(e, {
      before: f,
      after: ">",
      ...o.current()
    })), f += o.move(">"), i(), a.stack = c, f;
  }
  i = a.enter("link"), u = a.enter("label");
  let s = o.move("[");
  return s += o.move(a.containerPhrasing(e, {
    before: s,
    after: "](",
    ...o.current()
  })), s += o.move("]("), u(), !e.url && e.title || /[\0- \u007F]/.test(e.url) ? (u = a.enter("destinationLiteral"), s += o.move("<"), s += o.move(a.safe(e.url, {
    before: s,
    after: ">",
    ...o.current()
  })), s += o.move(">")) : (u = a.enter("destinationRaw"), s += o.move(a.safe(e.url, {
    before: s,
    after: e.title ? " " : ")",
    ...o.current()
  }))), u(), e.title && (u = a.enter(`title${l}`), s += o.move(" " + r), s += o.move(a.safe(e.title, {
    before: s,
    after: r,
    ...o.current()
  })), s += o.move(r), u()), s += o.move(")"), i(), s;
}
function XM(e, t, a) {
  return Ym(e, a) ? "<" : "[";
}
Zm.peek = jM;
function Zm(e, t, a, n) {
  let r = e.referenceType,
    l = a.enter("linkReference"),
    o = a.enter("label"),
    i = a.createTracker(n),
    u = i.move("["),
    s = a.containerPhrasing(e, {
      before: u,
      after: "]",
      ...i.current()
    });
  u += i.move(s + "]["), o();
  let c = a.stack;
  a.stack = [], o = a.enter("reference");
  let f = a.safe(a.associationId(e), {
    before: u,
    after: "]",
    ...i.current()
  });
  return o(), a.stack = c, l(), r === "full" || !s || s !== f ? u += i.move(f + "]") : r === "shortcut" ? u = u.slice(0, -1) : u += i.move("]"), u;
}
function jM() {
  return "[";
}
function io(e) {
  let t = e.options.bullet || "*";
  if (t !== "*" && t !== "+" && t !== "-") throw new Error("Cannot serialize items with `" + t + "` for `options.bullet`, expected `*`, `+`, or `-`");
  return t;
}
function T1(e) {
  let t = io(e),
    a = e.options.bulletOther;
  if (!a) return t === "*" ? "-" : "*";
  if (a !== "*" && a !== "+" && a !== "-") throw new Error("Cannot serialize items with `" + a + "` for `options.bulletOther`, expected `*`, `+`, or `-`");
  if (a === t) throw new Error("Expected `bullet` (`" + t + "`) and `bulletOther` (`" + a + "`) to be different");
  return a;
}
function M1(e) {
  let t = e.options.bulletOrdered || ".";
  if (t !== "." && t !== ")") throw new Error("Cannot serialize items with `" + t + "` for `options.bulletOrdered`, expected `.` or `)`");
  return t;
}
function Ac(e) {
  let t = e.options.rule || "*";
  if (t !== "*" && t !== "-" && t !== "_") throw new Error("Cannot serialize rules with `" + t + "` for `options.rule`, expected `*`, `-`, or `_`");
  return t;
}
function D1(e, t, a, n) {
  let r = a.enter("list"),
    l = a.bulletCurrent,
    o = e.ordered ? M1(a) : io(a),
    i = e.ordered ? o === "." ? ")" : "." : T1(a),
    u = t && a.bulletLastUsed ? o === a.bulletLastUsed : !1;
  if (!e.ordered) {
    let c = e.children ? e.children[0] : void 0;
    if ((o === "*" || o === "-") && c && (!c.children || !c.children[0]) && a.stack[a.stack.length - 1] === "list" && a.stack[a.stack.length - 2] === "listItem" && a.stack[a.stack.length - 3] === "list" && a.stack[a.stack.length - 4] === "listItem" && a.indexStack[a.indexStack.length - 1] === 0 && a.indexStack[a.indexStack.length - 2] === 0 && a.indexStack[a.indexStack.length - 3] === 0 && (u = !0), Ac(a) === o && c) {
      let f = -1;
      for (; ++f < e.children.length;) {
        let d = e.children[f];
        if (d && d.type === "listItem" && d.children && d.children[0] && d.children[0].type === "thematicBreak") {
          u = !0;
          break;
        }
      }
    }
  }
  u && (o = i), a.bulletCurrent = o;
  let s = a.containerFlow(e, n);
  return a.bulletLastUsed = o, a.bulletCurrent = l, r(), s;
}
function B1(e) {
  let t = e.options.listItemIndent || "one";
  if (t !== "tab" && t !== "one" && t !== "mixed") throw new Error("Cannot serialize items with `" + t + "` for `options.listItemIndent`, expected `tab`, `one`, or `mixed`");
  return t;
}
function E1(e, t, a, n) {
  let r = B1(a),
    l = a.bulletCurrent || io(a);
  t && t.type === "list" && t.ordered && (l = (typeof t.start == "number" && t.start > -1 ? t.start : 1) + (a.options.incrementListMarker === !1 ? 0 : t.children.indexOf(e)) + l);
  let o = l.length + 1;
  (r === "tab" || r === "mixed" && (t && t.type === "list" && t.spread || e.spread)) && (o = Math.ceil(o / 4) * 4);
  let i = a.createTracker(n);
  i.move(l + " ".repeat(o - l.length)), i.shift(o);
  let u = a.enter("listItem"),
    s = a.indentLines(a.containerFlow(e, i.current()), c);
  return u(), s;
  function c(f, d, p) {
    return d ? (p ? "" : " ".repeat(o)) + f : (p ? l : l + " ".repeat(o - l.length)) + f;
  }
}
function R1(e, t, a, n) {
  let r = a.enter("paragraph"),
    l = a.enter("phrasing"),
    o = a.containerPhrasing(e, n);
  return l(), r(), o;
}
var Km = or(["break", "delete", "emphasis", "footnote", "footnoteReference", "image", "imageReference", "inlineCode", "inlineMath", "link", "linkReference", "mdxJsxTextElement", "mdxTextExpression", "strong", "text", "textDirective"]);
function N1(e, t, a, n) {
  return (e.children.some(function (o) {
    return Km(o);
  }) ? a.containerPhrasing : a.containerFlow).call(a, e, n);
}
function z1(e) {
  let t = e.options.strong || "*";
  if (t !== "*" && t !== "_") throw new Error("Cannot serialize strong with `" + t + "` for `options.strong`, expected `*`, or `_`");
  return t;
}
Wm.peek = YM;
function Wm(e, t, a, n) {
  let r = z1(a),
    l = a.enter("strong"),
    o = a.createTracker(n),
    i = o.move(r + r),
    u = o.move(a.containerPhrasing(e, {
      after: r,
      before: i,
      ...o.current()
    })),
    s = u.charCodeAt(0),
    c = oo(n.before.charCodeAt(n.before.length - 1), s, r);
  c.inside && (u = ir(s) + u.slice(1));
  let f = u.charCodeAt(u.length - 1),
    d = oo(n.after.charCodeAt(0), f, r);
  d.inside && (u = u.slice(0, -1) + ir(f));
  let p = o.move(r + r);
  return l(), a.attentionEncodeSurroundingInfo = {
    after: d.outside,
    before: c.outside
  }, i + u + p;
}
function YM(e, t, a) {
  return a.options.strong || "*";
}
function O1(e, t, a, n) {
  return a.safe(e.value, n);
}
function P1(e) {
  let t = e.options.ruleRepetition || 3;
  if (t < 3) throw new Error("Cannot serialize rules with repetition `" + t + "` for `options.ruleRepetition`, expected `3` or more");
  return t;
}
function U1(e, t, a) {
  let n = (Ac(a) + (a.options.ruleSpaces ? " " : "")).repeat(P1(a));
  return a.options.ruleSpaces ? n.slice(0, -1) : n;
}
var ru = {
  blockquote: x1,
  break: Hm,
  code: w1,
  definition: S1,
  emphasis: _m,
  hardBreak: Hm,
  heading: A1,
  html: Gm,
  image: Vm,
  imageReference: Xm,
  inlineCode: jm,
  link: Qm,
  linkReference: Zm,
  list: D1,
  listItem: E1,
  paragraph: R1,
  root: N1,
  strong: Wm,
  text: O1,
  thematicBreak: U1
};
function $m() {
  return {
    enter: {
      table: QM,
      tableData: q1,
      tableHeader: q1,
      tableRow: KM
    },
    exit: {
      codeText: WM,
      table: ZM,
      tableData: Jm,
      tableHeader: Jm,
      tableRow: Jm
    }
  };
}
function QM(e) {
  let t = e._align;
  this.enter({
    type: "table",
    align: t.map(function (a) {
      return a === "none" ? null : a;
    }),
    children: []
  }, e), this.data.inTable = !0;
}
function ZM(e) {
  this.exit(e), this.data.inTable = void 0;
}
function KM(e) {
  this.enter({
    type: "tableRow",
    children: []
  }, e);
}
function Jm(e) {
  this.exit(e);
}
function q1(e) {
  this.enter({
    type: "tableCell",
    children: []
  }, e);
}
function WM(e) {
  let t = this.resume();
  this.data.inTable && (t = t.replace(/\\([\\|])/g, JM));
  let a = this.stack[this.stack.length - 1];
  a.type, a.value = t, this.exit(e);
}
function JM(e, t) {
  return t === "|" ? t : e;
}
function eh(e) {
  let t = e || {},
    a = t.tableCellPadding,
    n = t.tablePipeAlign,
    r = t.stringLength,
    l = a ? " " : "|";
  return {
    unsafe: [{
      character: "\r",
      inConstruct: "tableCell"
    }, {
      character: `
`,
      inConstruct: "tableCell"
    }, {
      atBreak: !0,
      character: "|",
      after: "[	 :-]"
    }, {
      character: "|",
      inConstruct: "tableCell"
    }, {
      atBreak: !0,
      character: ":",
      after: "-"
    }, {
      atBreak: !0,
      character: "-",
      after: "[:|-]"
    }],
    handlers: {
      inlineCode: d,
      table: o,
      tableCell: u,
      tableRow: i
    }
  };
  function o(p, x, b, C) {
    return s(c(p, b, C), p.align);
  }
  function i(p, x, b, C) {
    let h = f(p, b, C),
      m = s([h]);
    return m.slice(0, m.indexOf(`
`));
  }
  function u(p, x, b, C) {
    let h = b.enter("tableCell"),
      m = b.enter("phrasing"),
      g = b.containerPhrasing(p, {
        ...C,
        before: l,
        after: l
      });
    return m(), h(), g;
  }
  function s(p, x) {
    return g1(p, {
      align: x,
      alignDelimiters: n,
      padding: a,
      stringLength: r
    });
  }
  function c(p, x, b) {
    let C = p.children,
      h = -1,
      m = [],
      g = x.enter("table");
    for (; ++h < C.length;) m[h] = f(C[h], x, b);
    return g(), m;
  }
  function f(p, x, b) {
    let C = p.children,
      h = -1,
      m = [],
      g = x.enter("tableRow");
    for (; ++h < C.length;) m[h] = u(C[h], p, x, b);
    return g(), m;
  }
  function d(p, x, b) {
    let C = ru.inlineCode(p, x, b);
    return b.stack.includes("tableCell") && (C = C.replace(/\|/g, "\\$&")), C;
  }
}
function th() {
  return {
    exit: {
      taskListCheckValueChecked: F1,
      taskListCheckValueUnchecked: F1,
      paragraph: $M
    }
  };
}
function ah() {
  return {
    unsafe: [{
      atBreak: !0,
      character: "-",
      after: "[:|-]"
    }],
    handlers: {
      listItem: eD
    }
  };
}
function F1(e) {
  let t = this.stack[this.stack.length - 2];
  t.type, t.checked = e.type === "taskListCheckValueChecked";
}
function $M(e) {
  let t = this.stack[this.stack.length - 2];
  if (t && t.type === "listItem" && typeof t.checked == "boolean") {
    let a = this.stack[this.stack.length - 1];
    a.type;
    let n = a.children[0];
    if (n && n.type === "text") {
      let r = t.children,
        l = -1,
        o;
      for (; ++l < r.length;) {
        let i = r[l];
        if (i.type === "paragraph") {
          o = i;
          break;
        }
      }
      o === a && (n.value = n.value.slice(1), n.value.length === 0 ? a.children.shift() : a.position && n.position && typeof n.position.start.offset == "number" && (n.position.start.column++, n.position.start.offset++, a.position.start = Object.assign({}, n.position.start)));
    }
  }
  this.exit(e);
}
function eD(e, t, a, n) {
  let r = e.children[0],
    l = typeof e.checked == "boolean" && r && r.type === "paragraph",
    o = "[" + (e.checked ? "x" : " ") + "] ",
    i = a.createTracker(n);
  l && i.move(o);
  let u = ru.listItem(e, t, a, {
    ...n,
    ...i.current()
  });
  return l && (u = u.replace(/^(?:[*+-]|\d+\.)([\r\n]| {1,3})/, s)), u;
  function s(c) {
    return c + o;
  }
}
function nh() {
  return [zm(), Pm(), qm(), $m(), th()];
}
function rh(e) {
  return {
    extensions: [Om(), Um(e), Fm(), eh(e), ah()]
  };
}
var tD = {
    tokenize: oD,
    partial: !0
  },
  H1 = {
    tokenize: iD,
    partial: !0
  },
  _1 = {
    tokenize: uD,
    partial: !0
  },
  G1 = {
    tokenize: sD,
    partial: !0
  },
  aD = {
    tokenize: cD,
    partial: !0
  },
  V1 = {
    name: "wwwAutolink",
    tokenize: rD,
    previous: j1
  },
  X1 = {
    name: "protocolAutolink",
    tokenize: lD,
    previous: Y1
  },
  yn = {
    name: "emailAutolink",
    tokenize: nD,
    previous: Q1
  },
  Ha = {};
function oh() {
  return {
    text: Ha
  };
}
var Zr = 48;
for (; Zr < 123;) Ha[Zr] = yn, Zr++, Zr === 58 ? Zr = 65 : Zr === 91 && (Zr = 97);
Ha[43] = yn;
Ha[45] = yn;
Ha[46] = yn;
Ha[95] = yn;
Ha[72] = [yn, X1];
Ha[104] = [yn, X1];
Ha[87] = [yn, V1];
Ha[119] = [yn, V1];
function nD(e, t, a) {
  let n = this,
    r,
    l;
  return o;
  function o(f) {
    return !lh(f) || !Q1.call(n, n.previous) || ih(n.events) ? a(f) : (e.enter("literalAutolink"), e.enter("literalAutolinkEmail"), i(f));
  }
  function i(f) {
    return lh(f) ? (e.consume(f), i) : f === 64 ? (e.consume(f), u) : a(f);
  }
  function u(f) {
    return f === 46 ? e.check(aD, c, s)(f) : f === 45 || f === 95 || We(f) ? (l = !0, e.consume(f), u) : c(f);
  }
  function s(f) {
    return e.consume(f), r = !0, u;
  }
  function c(f) {
    return l && r && mt(n.previous) ? (e.exit("literalAutolinkEmail"), e.exit("literalAutolink"), t(f)) : a(f);
  }
}
function rD(e, t, a) {
  let n = this;
  return r;
  function r(o) {
    return o !== 87 && o !== 119 || !j1.call(n, n.previous) || ih(n.events) ? a(o) : (e.enter("literalAutolink"), e.enter("literalAutolinkWww"), e.check(tD, e.attempt(H1, e.attempt(_1, l), a), a)(o));
  }
  function l(o) {
    return e.exit("literalAutolinkWww"), e.exit("literalAutolink"), t(o);
  }
}
function lD(e, t, a) {
  let n = this,
    r = "",
    l = !1;
  return o;
  function o(f) {
    return (f === 72 || f === 104) && Y1.call(n, n.previous) && !ih(n.events) ? (e.enter("literalAutolink"), e.enter("literalAutolinkHttp"), r += String.fromCodePoint(f), e.consume(f), i) : a(f);
  }
  function i(f) {
    if (mt(f) && r.length < 5) return r += String.fromCodePoint(f), e.consume(f), i;
    if (f === 58) {
      let d = r.toLowerCase();
      if (d === "http" || d === "https") return e.consume(f), u;
    }
    return a(f);
  }
  function u(f) {
    return f === 47 ? (e.consume(f), l ? s : (l = !0, u)) : a(f);
  }
  function s(f) {
    return f === null || Fr(f) || ce(f) || qa(f) || Hr(f) ? a(f) : e.attempt(H1, e.attempt(_1, c), a)(f);
  }
  function c(f) {
    return e.exit("literalAutolinkHttp"), e.exit("literalAutolink"), t(f);
  }
}
function oD(e, t, a) {
  let n = 0;
  return r;
  function r(o) {
    return (o === 87 || o === 119) && n < 3 ? (n++, e.consume(o), r) : o === 46 && n === 3 ? (e.consume(o), l) : a(o);
  }
  function l(o) {
    return o === null ? a(o) : t(o);
  }
}
function iD(e, t, a) {
  let n, r, l;
  return o;
  function o(s) {
    return s === 46 || s === 95 ? e.check(G1, u, i)(s) : s === null || ce(s) || qa(s) || s !== 45 && Hr(s) ? u(s) : (l = !0, e.consume(s), o);
  }
  function i(s) {
    return s === 95 ? n = !0 : (r = n, n = void 0), e.consume(s), o;
  }
  function u(s) {
    return r || n || !l ? a(s) : t(s);
  }
}
function uD(e, t) {
  let a = 0,
    n = 0;
  return r;
  function r(o) {
    return o === 40 ? (a++, e.consume(o), r) : o === 41 && n < a ? l(o) : o === 33 || o === 34 || o === 38 || o === 39 || o === 41 || o === 42 || o === 44 || o === 46 || o === 58 || o === 59 || o === 60 || o === 63 || o === 93 || o === 95 || o === 126 ? e.check(G1, t, l)(o) : o === null || ce(o) || qa(o) ? t(o) : (e.consume(o), r);
  }
  function l(o) {
    return o === 41 && n++, e.consume(o), r;
  }
}
function sD(e, t, a) {
  return n;
  function n(i) {
    return i === 33 || i === 34 || i === 39 || i === 41 || i === 42 || i === 44 || i === 46 || i === 58 || i === 59 || i === 63 || i === 95 || i === 126 ? (e.consume(i), n) : i === 38 ? (e.consume(i), l) : i === 93 ? (e.consume(i), r) : i === 60 || i === null || ce(i) || qa(i) ? t(i) : a(i);
  }
  function r(i) {
    return i === null || i === 40 || i === 91 || ce(i) || qa(i) ? t(i) : n(i);
  }
  function l(i) {
    return mt(i) ? o(i) : a(i);
  }
  function o(i) {
    return i === 59 ? (e.consume(i), n) : mt(i) ? (e.consume(i), o) : a(i);
  }
}
function cD(e, t, a) {
  return n;
  function n(l) {
    return e.consume(l), r;
  }
  function r(l) {
    return We(l) ? a(l) : t(l);
  }
}
function j1(e) {
  return e === null || e === 40 || e === 42 || e === 95 || e === 91 || e === 93 || e === 126 || ce(e);
}
function Y1(e) {
  return !mt(e);
}
function Q1(e) {
  return !(e === 47 || lh(e));
}
function lh(e) {
  return e === 43 || e === 45 || e === 46 || e === 95 || We(e);
}
function ih(e) {
  let t = e.length,
    a = !1;
  for (; t--;) {
    let n = e[t][1];
    if ((n.type === "labelLink" || n.type === "labelImage") && !n._balanced) {
      a = !0;
      break;
    }
    if (n._gfmAutolinkLiteralWalkedInto) {
      a = !1;
      break;
    }
  }
  return e.length > 0 && !a && (e[e.length - 1][1]._gfmAutolinkLiteralWalkedInto = !0), a;
}
var fD = {
  tokenize: yD,
  partial: !0
};
function uh() {
  return {
    document: {
      91: {
        name: "gfmFootnoteDefinition",
        tokenize: hD,
        continuation: {
          tokenize: gD
        },
        exit: xD
      }
    },
    text: {
      91: {
        name: "gfmFootnoteCall",
        tokenize: mD
      },
      93: {
        name: "gfmPotentialFootnoteCall",
        add: "after",
        tokenize: dD,
        resolveTo: pD
      }
    }
  };
}
function dD(e, t, a) {
  let n = this,
    r = n.events.length,
    l = n.parser.gfmFootnotes || (n.parser.gfmFootnotes = []),
    o;
  for (; r--;) {
    let u = n.events[r][1];
    if (u.type === "labelImage") {
      o = u;
      break;
    }
    if (u.type === "gfmFootnoteCall" || u.type === "labelLink" || u.type === "label" || u.type === "image" || u.type === "link") break;
  }
  return i;
  function i(u) {
    if (!o || !o._balanced) return a(u);
    let s = Mt(n.sliceSerialize({
      start: o.end,
      end: n.now()
    }));
    return s.codePointAt(0) !== 94 || !l.includes(s.slice(1)) ? a(u) : (e.enter("gfmFootnoteCallLabelMarker"), e.consume(u), e.exit("gfmFootnoteCallLabelMarker"), t(u));
  }
}
function pD(e, t) {
  let a = e.length,
    n;
  for (; a--;) if (e[a][1].type === "labelImage" && e[a][0] === "enter") {
    n = e[a][1];
    break;
  }
  e[a + 1][1].type = "data", e[a + 3][1].type = "gfmFootnoteCallLabelMarker";
  let r = {
      type: "gfmFootnoteCall",
      start: Object.assign({}, e[a + 3][1].start),
      end: Object.assign({}, e[e.length - 1][1].end)
    },
    l = {
      type: "gfmFootnoteCallMarker",
      start: Object.assign({}, e[a + 3][1].end),
      end: Object.assign({}, e[a + 3][1].end)
    };
  l.end.column++, l.end.offset++, l.end._bufferIndex++;
  let o = {
      type: "gfmFootnoteCallString",
      start: Object.assign({}, l.end),
      end: Object.assign({}, e[e.length - 1][1].start)
    },
    i = {
      type: "chunkString",
      contentType: "string",
      start: Object.assign({}, o.start),
      end: Object.assign({}, o.end)
    },
    u = [e[a + 1], e[a + 2], ["enter", r, t], e[a + 3], e[a + 4], ["enter", l, t], ["exit", l, t], ["enter", o, t], ["enter", i, t], ["exit", i, t], ["exit", o, t], e[e.length - 2], e[e.length - 1], ["exit", r, t]];
  return e.splice(a, e.length - a + 1, ...u), e;
}
function mD(e, t, a) {
  let n = this,
    r = n.parser.gfmFootnotes || (n.parser.gfmFootnotes = []),
    l = 0,
    o;
  return i;
  function i(f) {
    return e.enter("gfmFootnoteCall"), e.enter("gfmFootnoteCallLabelMarker"), e.consume(f), e.exit("gfmFootnoteCallLabelMarker"), u;
  }
  function u(f) {
    return f !== 94 ? a(f) : (e.enter("gfmFootnoteCallMarker"), e.consume(f), e.exit("gfmFootnoteCallMarker"), e.enter("gfmFootnoteCallString"), e.enter("chunkString").contentType = "string", s);
  }
  function s(f) {
    if (l > 999 || f === 93 && !o || f === null || f === 91 || ce(f)) return a(f);
    if (f === 93) {
      e.exit("chunkString");
      let d = e.exit("gfmFootnoteCallString");
      return r.includes(Mt(n.sliceSerialize(d))) ? (e.enter("gfmFootnoteCallLabelMarker"), e.consume(f), e.exit("gfmFootnoteCallLabelMarker"), e.exit("gfmFootnoteCall"), t) : a(f);
    }
    return ce(f) || (o = !0), l++, e.consume(f), f === 92 ? c : s;
  }
  function c(f) {
    return f === 91 || f === 92 || f === 93 ? (e.consume(f), l++, s) : s(f);
  }
}
function hD(e, t, a) {
  let n = this,
    r = n.parser.gfmFootnotes || (n.parser.gfmFootnotes = []),
    l,
    o = 0,
    i;
  return u;
  function u(x) {
    return e.enter("gfmFootnoteDefinition")._container = !0, e.enter("gfmFootnoteDefinitionLabel"), e.enter("gfmFootnoteDefinitionLabelMarker"), e.consume(x), e.exit("gfmFootnoteDefinitionLabelMarker"), s;
  }
  function s(x) {
    return x === 94 ? (e.enter("gfmFootnoteDefinitionMarker"), e.consume(x), e.exit("gfmFootnoteDefinitionMarker"), e.enter("gfmFootnoteDefinitionLabelString"), e.enter("chunkString").contentType = "string", c) : a(x);
  }
  function c(x) {
    if (o > 999 || x === 93 && !i || x === null || x === 91 || ce(x)) return a(x);
    if (x === 93) {
      e.exit("chunkString");
      let b = e.exit("gfmFootnoteDefinitionLabelString");
      return l = Mt(n.sliceSerialize(b)), e.enter("gfmFootnoteDefinitionLabelMarker"), e.consume(x), e.exit("gfmFootnoteDefinitionLabelMarker"), e.exit("gfmFootnoteDefinitionLabel"), d;
    }
    return ce(x) || (i = !0), o++, e.consume(x), x === 92 ? f : c;
  }
  function f(x) {
    return x === 91 || x === 92 || x === 93 ? (e.consume(x), o++, c) : c(x);
  }
  function d(x) {
    return x === 58 ? (e.enter("definitionMarker"), e.consume(x), e.exit("definitionMarker"), r.includes(l) || r.push(l), Q(e, p, "gfmFootnoteDefinitionWhitespace")) : a(x);
  }
  function p(x) {
    return t(x);
  }
}
function gD(e, t, a) {
  return e.check(Fa, t, e.attempt(fD, t, a));
}
function xD(e) {
  e.exit("gfmFootnoteDefinition");
}
function yD(e, t, a) {
  let n = this;
  return Q(e, r, "gfmFootnoteDefinitionIndent", 5);
  function r(l) {
    let o = n.events[n.events.length - 1];
    return o && o[1].type === "gfmFootnoteDefinitionIndent" && o[2].sliceSerialize(o[1], !0).length === 4 ? t(l) : a(l);
  }
}
function sh(e) {
  let a = (e || {}).singleTilde,
    n = {
      name: "strikethrough",
      tokenize: l,
      resolveAll: r
    };
  return a == null && (a = !0), {
    text: {
      126: n
    },
    insideSpan: {
      null: [n]
    },
    attentionMarkers: {
      null: [126]
    }
  };
  function r(o, i) {
    let u = -1;
    for (; ++u < o.length;) if (o[u][0] === "enter" && o[u][1].type === "strikethroughSequenceTemporary" && o[u][1]._close) {
      let s = u;
      for (; s--;) if (o[s][0] === "exit" && o[s][1].type === "strikethroughSequenceTemporary" && o[s][1]._open && o[u][1].end.offset - o[u][1].start.offset === o[s][1].end.offset - o[s][1].start.offset) {
        o[u][1].type = "strikethroughSequence", o[s][1].type = "strikethroughSequence";
        let c = {
            type: "strikethrough",
            start: Object.assign({}, o[s][1].start),
            end: Object.assign({}, o[u][1].end)
          },
          f = {
            type: "strikethroughText",
            start: Object.assign({}, o[s][1].end),
            end: Object.assign({}, o[u][1].start)
          },
          d = [["enter", c, i], ["enter", o[s][1], i], ["exit", o[s][1], i], ["enter", f, i]],
          p = i.parser.constructs.insideSpan.null;
        p && nt(d, d.length, 0, rr(p, o.slice(s + 1, u), i)), nt(d, d.length, 0, [["exit", f, i], ["enter", o[u][1], i], ["exit", o[u][1], i], ["exit", c, i]]), nt(o, s - 1, u - s + 3, d), u = s + d.length - 2;
        break;
      }
    }
    for (u = -1; ++u < o.length;) o[u][1].type === "strikethroughSequenceTemporary" && (o[u][1].type = "data");
    return o;
  }
  function l(o, i, u) {
    let s = this.previous,
      c = this.events,
      f = 0;
    return d;
    function d(x) {
      return s === 126 && c[c.length - 1][1].type !== "characterEscape" ? u(x) : (o.enter("strikethroughSequenceTemporary"), p(x));
    }
    function p(x) {
      let b = xn(s);
      if (x === 126) return f > 1 ? u(x) : (o.consume(x), f++, p);
      if (f < 2 && !a) return u(x);
      let C = o.exit("strikethroughSequenceTemporary"),
        h = xn(x);
      return C._open = !h || h === 2 && !!b, C._close = !b || b === 2 && !!h, i(x);
    }
  }
}
var Tc = class {
  constructor() {
    this.map = [];
  }
  add(t, a, n) {
    bD(this, t, a, n);
  }
  consume(t) {
    if (this.map.sort(function (l, o) {
      return l[0] - o[0];
    }), this.map.length === 0) return;
    let a = this.map.length,
      n = [];
    for (; a > 0;) a -= 1, n.push(t.slice(this.map[a][0] + this.map[a][1]), this.map[a][2]), t.length = this.map[a][0];
    n.push(t.slice()), t.length = 0;
    let r = n.pop();
    for (; r;) {
      for (let l of r) t.push(l);
      r = n.pop();
    }
    this.map.length = 0;
  }
};
function bD(e, t, a, n) {
  let r = 0;
  if (!(a === 0 && n.length === 0)) {
    for (; r < e.map.length;) {
      if (e.map[r][0] === t) {
        e.map[r][1] += a, e.map[r][2].push(...n);
        return;
      }
      r += 1;
    }
    e.map.push([t, a, n]);
  }
}
function Z1(e, t) {
  let a = !1,
    n = [];
  for (; t < e.length;) {
    let r = e[t];
    if (a) {
      if (r[0] === "enter") r[1].type === "tableContent" && n.push(e[t + 1][1].type === "tableDelimiterMarker" ? "left" : "none");else if (r[1].type === "tableContent") {
        if (e[t - 1][1].type === "tableDelimiterMarker") {
          let l = n.length - 1;
          n[l] = n[l] === "left" ? "center" : "right";
        }
      } else if (r[1].type === "tableDelimiterRow") break;
    } else r[0] === "enter" && r[1].type === "tableDelimiterRow" && (a = !0);
    t += 1;
  }
  return n;
}
function ch() {
  return {
    flow: {
      null: {
        name: "table",
        tokenize: vD,
        resolveAll: LD
      }
    }
  };
}
function vD(e, t, a) {
  let n = this,
    r = 0,
    l = 0,
    o;
  return i;
  function i(w) {
    let N = n.events.length - 1;
    for (; N > -1;) {
      let K = n.events[N][1].type;
      if (K === "lineEnding" || K === "linePrefix") N--;else break;
    }
    let $ = N > -1 ? n.events[N][1].type : null,
      q = $ === "tableHead" || $ === "tableRow" ? k : u;
    return q === k && n.parser.lazy[n.now().line] ? a(w) : q(w);
  }
  function u(w) {
    return e.enter("tableHead"), e.enter("tableRow"), s(w);
  }
  function s(w) {
    return w === 124 || (o = !0, l += 1), c(w);
  }
  function c(w) {
    return w === null ? a(w) : U(w) ? l > 1 ? (l = 0, n.interrupt = !0, e.exit("tableRow"), e.enter("lineEnding"), e.consume(w), e.exit("lineEnding"), p) : a(w) : W(w) ? Q(e, c, "whitespace")(w) : (l += 1, o && (o = !1, r += 1), w === 124 ? (e.enter("tableCellDivider"), e.consume(w), e.exit("tableCellDivider"), o = !0, c) : (e.enter("data"), f(w)));
  }
  function f(w) {
    return w === null || w === 124 || ce(w) ? (e.exit("data"), c(w)) : (e.consume(w), w === 92 ? d : f);
  }
  function d(w) {
    return w === 92 || w === 124 ? (e.consume(w), f) : f(w);
  }
  function p(w) {
    return n.interrupt = !1, n.parser.lazy[n.now().line] ? a(w) : (e.enter("tableDelimiterRow"), o = !1, W(w) ? Q(e, x, "linePrefix", n.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(w) : x(w));
  }
  function x(w) {
    return w === 45 || w === 58 ? C(w) : w === 124 ? (o = !0, e.enter("tableCellDivider"), e.consume(w), e.exit("tableCellDivider"), b) : I(w);
  }
  function b(w) {
    return W(w) ? Q(e, C, "whitespace")(w) : C(w);
  }
  function C(w) {
    return w === 58 ? (l += 1, o = !0, e.enter("tableDelimiterMarker"), e.consume(w), e.exit("tableDelimiterMarker"), h) : w === 45 ? (l += 1, h(w)) : w === null || U(w) ? L(w) : I(w);
  }
  function h(w) {
    return w === 45 ? (e.enter("tableDelimiterFiller"), m(w)) : I(w);
  }
  function m(w) {
    return w === 45 ? (e.consume(w), m) : w === 58 ? (o = !0, e.exit("tableDelimiterFiller"), e.enter("tableDelimiterMarker"), e.consume(w), e.exit("tableDelimiterMarker"), g) : (e.exit("tableDelimiterFiller"), g(w));
  }
  function g(w) {
    return W(w) ? Q(e, L, "whitespace")(w) : L(w);
  }
  function L(w) {
    return w === 124 ? x(w) : w === null || U(w) ? !o || r !== l ? I(w) : (e.exit("tableDelimiterRow"), e.exit("tableHead"), t(w)) : I(w);
  }
  function I(w) {
    return a(w);
  }
  function k(w) {
    return e.enter("tableRow"), S(w);
  }
  function S(w) {
    return w === 124 ? (e.enter("tableCellDivider"), e.consume(w), e.exit("tableCellDivider"), S) : w === null || U(w) ? (e.exit("tableRow"), t(w)) : W(w) ? Q(e, S, "whitespace")(w) : (e.enter("data"), A(w));
  }
  function A(w) {
    return w === null || w === 124 || ce(w) ? (e.exit("data"), S(w)) : (e.consume(w), w === 92 ? R : A);
  }
  function R(w) {
    return w === 92 || w === 124 ? (e.consume(w), A) : A(w);
  }
}
function LD(e, t) {
  let a = -1,
    n = !0,
    r = 0,
    l = [0, 0, 0, 0],
    o = [0, 0, 0, 0],
    i = !1,
    u = 0,
    s,
    c,
    f,
    d = new Tc();
  for (; ++a < e.length;) {
    let p = e[a],
      x = p[1];
    p[0] === "enter" ? x.type === "tableHead" ? (i = !1, u !== 0 && (K1(d, t, u, s, c), c = void 0, u = 0), s = {
      type: "table",
      start: Object.assign({}, x.start),
      end: Object.assign({}, x.end)
    }, d.add(a, 0, [["enter", s, t]])) : x.type === "tableRow" || x.type === "tableDelimiterRow" ? (n = !0, f = void 0, l = [0, 0, 0, 0], o = [0, a + 1, 0, 0], i && (i = !1, c = {
      type: "tableBody",
      start: Object.assign({}, x.start),
      end: Object.assign({}, x.end)
    }, d.add(a, 0, [["enter", c, t]])), r = x.type === "tableDelimiterRow" ? 2 : c ? 3 : 1) : r && (x.type === "data" || x.type === "tableDelimiterMarker" || x.type === "tableDelimiterFiller") ? (n = !1, o[2] === 0 && (l[1] !== 0 && (o[0] = o[1], f = Mc(d, t, l, r, void 0, f), l = [0, 0, 0, 0]), o[2] = a)) : x.type === "tableCellDivider" && (n ? n = !1 : (l[1] !== 0 && (o[0] = o[1], f = Mc(d, t, l, r, void 0, f)), l = o, o = [l[1], a, 0, 0])) : x.type === "tableHead" ? (i = !0, u = a) : x.type === "tableRow" || x.type === "tableDelimiterRow" ? (u = a, l[1] !== 0 ? (o[0] = o[1], f = Mc(d, t, l, r, a, f)) : o[1] !== 0 && (f = Mc(d, t, o, r, a, f)), r = 0) : r && (x.type === "data" || x.type === "tableDelimiterMarker" || x.type === "tableDelimiterFiller") && (o[3] = a);
  }
  for (u !== 0 && K1(d, t, u, s, c), d.consume(t.events), a = -1; ++a < t.events.length;) {
    let p = t.events[a];
    p[0] === "enter" && p[1].type === "table" && (p[1]._align = Z1(t.events, a));
  }
  return e;
}
function Mc(e, t, a, n, r, l) {
  let o = n === 1 ? "tableHeader" : n === 2 ? "tableDelimiter" : "tableData",
    i = "tableContent";
  a[0] !== 0 && (l.end = Object.assign({}, uo(t.events, a[0])), e.add(a[0], 0, [["exit", l, t]]));
  let u = uo(t.events, a[1]);
  if (l = {
    type: o,
    start: Object.assign({}, u),
    end: Object.assign({}, u)
  }, e.add(a[1], 0, [["enter", l, t]]), a[2] !== 0) {
    let s = uo(t.events, a[2]),
      c = uo(t.events, a[3]),
      f = {
        type: i,
        start: Object.assign({}, s),
        end: Object.assign({}, c)
      };
    if (e.add(a[2], 0, [["enter", f, t]]), n !== 2) {
      let d = t.events[a[2]],
        p = t.events[a[3]];
      if (d[1].end = Object.assign({}, p[1].end), d[1].type = "chunkText", d[1].contentType = "text", a[3] > a[2] + 1) {
        let x = a[2] + 1,
          b = a[3] - a[2] - 1;
        e.add(x, b, []);
      }
    }
    e.add(a[3] + 1, 0, [["exit", f, t]]);
  }
  return r !== void 0 && (l.end = Object.assign({}, uo(t.events, r)), e.add(r, 0, [["exit", l, t]]), l = void 0), l;
}
function K1(e, t, a, n, r) {
  let l = [],
    o = uo(t.events, a);
  r && (r.end = Object.assign({}, o), l.push(["exit", r, t])), n.end = Object.assign({}, o), l.push(["exit", n, t]), e.add(a + 1, 0, l);
}
function uo(e, t) {
  let a = e[t],
    n = a[0] === "enter" ? "start" : "end";
  return a[1][n];
}
var kD = {
  name: "tasklistCheck",
  tokenize: wD
};
function fh() {
  return {
    text: {
      91: kD
    }
  };
}
function wD(e, t, a) {
  let n = this;
  return r;
  function r(u) {
    return n.previous !== null || !n._gfmTasklistFirstContentOfListItem ? a(u) : (e.enter("taskListCheck"), e.enter("taskListCheckMarker"), e.consume(u), e.exit("taskListCheckMarker"), l);
  }
  function l(u) {
    return ce(u) ? (e.enter("taskListCheckValueUnchecked"), e.consume(u), e.exit("taskListCheckValueUnchecked"), o) : u === 88 || u === 120 ? (e.enter("taskListCheckValueChecked"), e.consume(u), e.exit("taskListCheckValueChecked"), o) : a(u);
  }
  function o(u) {
    return u === 93 ? (e.enter("taskListCheckMarker"), e.consume(u), e.exit("taskListCheckMarker"), e.exit("taskListCheck"), i) : a(u);
  }
  function i(u) {
    return U(u) ? t(u) : W(u) ? e.check({
      tokenize: SD
    }, t, a)(u) : a(u);
  }
}
function SD(e, t, a) {
  return Q(e, n, "whitespace");
  function n(r) {
    return r === null ? a(r) : t(r);
  }
}
function W1(e) {
  return ac([oh(), uh(), sh(e), ch(), fh()]);
}
var CD = {};
function Dc(e) {
  let t = this,
    a = e || CD,
    n = t.data(),
    r = n.micromarkExtensions || (n.micromarkExtensions = []),
    l = n.fromMarkdownExtensions || (n.fromMarkdownExtensions = []),
    o = n.toMarkdownExtensions || (n.toMarkdownExtensions = []);
  r.push(W1(a)), l.push(nh()), o.push(rh(a));
}
// jsxMarkdown (minified: le) — ──── App: Agent chat UI: Markdown renderer wrapper (Ec) and code block (ID), message list / blocks / tool calls / proposals / approvals / streaming text ($1, AD, TD, J1, DD, BD, ED, RD, ND, UD, ak, qD, lu), chat panel (nk), result / git view (rk, HD, _D), sidebar tabs (lk), root App with acquireVsCodeApi messaging (ok), createRoot mount ────
// jsxMarkdown (minified: le) — jsx runtime for the Markdown renderer and code block.
// ChatMarkdown (minified: Ec): renders chat text as Markdown (GFM) with compact sidebar styles. Links go to onOpenLink (opened by the host); fenced code becomes a ChatCodeBlock with a Copy button.
var jsxMarkdown = G(oe()),
  ChatMarkdown = (0, ReactForMarkdown.memo)(function ({
    text: text,
    onCopy: onCopy,
    onOpenLink: onOpenLink
  }) {
    return (0, jsxMarkdown.jsx)("div", {
      className: "text-sm leading-relaxed break-words",
      children: (0, jsxMarkdown.jsx)(Tm, {
        remarkPlugins: [Dc],
        components: {
          p: ({
            children: children
          }) => (0, jsxMarkdown.jsx)("p", {
            className: "m-0 mb-2 last:mb-0",
            children: children
          }),
          h1: ({
            children: children
          }) => (0, jsxMarkdown.jsx)("h3", {
            className: "m-0 mt-3 mb-1.5 text-base font-semibold first:mt-0",
            children: children
          }),
          h2: ({
            children: children
          }) => (0, jsxMarkdown.jsx)("h3", {
            className: "m-0 mt-3 mb-1.5 text-sm font-semibold first:mt-0",
            children: children
          }),
          h3: ({
            children: children
          }) => (0, jsxMarkdown.jsx)("h4", {
            className: "m-0 mt-2.5 mb-1 text-sm font-semibold first:mt-0",
            children: children
          }),
          h4: ({
            children: children
          }) => (0, jsxMarkdown.jsx)("h5", {
            className: "m-0 mt-2 mb-1 text-sm font-medium first:mt-0",
            children: children
          }),
          ul: ({
            children: children
          }) => (0, jsxMarkdown.jsx)("ul", {
            className: "m-0 mb-2 pl-5 flex flex-col gap-0.5 list-disc last:mb-0",
            children: children
          }),
          ol: ({
            children: children
          }) => (0, jsxMarkdown.jsx)("ol", {
            className: "m-0 mb-2 pl-5 flex flex-col gap-0.5 list-decimal last:mb-0",
            children: children
          }),
          li: ({
            children: children
          }) => (0, jsxMarkdown.jsx)("li", {
            className: "m-0",
            children: children
          }),
          strong: ({
            children: children
          }) => (0, jsxMarkdown.jsx)("strong", {
            className: "font-semibold text-foreground",
            children: children
          }),
          em: ({
            children: children
          }) => (0, jsxMarkdown.jsx)("em", {
            className: "italic",
            children: children
          }),
          del: ({
            children: children
          }) => (0, jsxMarkdown.jsx)("del", {
            className: "opacity-70",
            children: children
          }),
          hr: () => (0, jsxMarkdown.jsx)("hr", {
            className: "my-3 border-0 border-t border-border"
          }),
          blockquote: ({
            children: children
          }) => (0, jsxMarkdown.jsx)("blockquote", {
            className: "m-0 mb-2 pl-3 border-0 border-l-2 border-border text-muted-foreground",
            children: children
          }),
          a: ({
            href: href,
            children: linkChildren
          }) => (0, jsxMarkdown.jsx)("a", {
            href: href,
            onClick: clickEvent => {
              clickEvent.preventDefault(), href && onOpenLink(href);
            },
            className: "text-primary underline cursor-pointer",
            children: linkChildren
          }),
          table: ({
            children: children
          }) => (0, jsxMarkdown.jsx)("div", {
            className: "mb-2 overflow-x-auto",
            children: (0, jsxMarkdown.jsx)("table", {
              className: "border-collapse text-xs",
              children: children
            })
          }),
          thead: ({
            children: children
          }) => (0, jsxMarkdown.jsx)("thead", {
            children: children
          }),
          th: ({
            children: children
          }) => (0, jsxMarkdown.jsx)("th", {
            className: "border border-border px-2 py-1 text-left font-medium",
            children: children
          }),
          td: ({
            children: children
          }) => (0, jsxMarkdown.jsx)("td", {
            className: "border border-border px-2 py-1 align-top",
            children: children
          }),
          // Fenced blocks (a language class or a newline) become a CodeBlock; everything else is inline code.
          code: ({
            className: codeClassName,
            children: codeChildren,
            ...codeProps
          }) => {
            let codeText = String(codeChildren ?? ""),
              language = /language-(\w+)/.exec(codeClassName ?? "")?.[1];
            return language !== void 0 || codeText.includes(`
`) ? (0, jsxMarkdown.jsx)(ChatCodeBlock, {
              language: language ?? null,
              code: codeText.replace(/\n$/, ""),
              onCopy: onCopy
            }) : (0, jsxMarkdown.jsx)("code", {
              className: "rounded bg-input px-1 py-0.5 font-mono text-[0.85em]",
              ...codeProps,
              children: codeText
            });
          },
          // <pre> is dropped: CodeBlock draws its own.
          pre: ({
            children: children
          }) => (0, jsxMarkdown.jsx)(jsxMarkdown.Fragment, {
            children: children
          })
        },
        children: text
      })
    });
  });
// ChatCodeBlock (minified: ID) — a fenced code block in a chat message: language label, Copy button (shows "Copied" for 1.2 s) and the code.
function ChatCodeBlock({
  language: language,
  code: code,
  onCopy: onCopy
}) {
  let [copied, setCopied] = (0, ReactForMarkdown.useState)(!1);
  return (0, jsxMarkdown.jsxs)("div", {
    className: "mb-2 last:mb-0 rounded-md border border-border overflow-hidden",
    children: [(0, jsxMarkdown.jsxs)("div", {
      className: "flex items-center gap-2 px-2 py-1 border-b border-border bg-input",
      children: [(0, jsxMarkdown.jsx)("span", {
        className: "text-[10px] uppercase tracking-wide text-muted-foreground font-mono",
        children: language ?? "code"
      }), (0, jsxMarkdown.jsx)("span", {
        className: "flex-1"
      }), (0, jsxMarkdown.jsx)("button", {
        type: "button",
        onClick: () => {
          onCopy(code), setCopied(!0), window.setTimeout(() => setCopied(!1), 1200);
        },
        title: "Copy",
        className: classNames("flex items-center gap-1 bg-transparent border-none cursor-pointer", "text-[10px] text-muted-foreground hover:text-foreground p-0"),
        children: copied ? (0, jsxMarkdown.jsxs)(jsxMarkdown.Fragment, {
          children: [(0, jsxMarkdown.jsx)(CheckIcon, {
            className: "h-3 w-3"
          }), " Copied"]
        }) : (0, jsxMarkdown.jsxs)(jsxMarkdown.Fragment, {
          children: [(0, jsxMarkdown.jsx)(CopyIcon, {
            className: "h-3 w-3"
          }), " Copy"]
        })
      })]
    }), (0, jsxMarkdown.jsx)("pre", {
      className: "m-0 max-h-96 overflow-auto px-2.5 py-2 text-xs font-mono leading-relaxed",
      children: (0, jsxMarkdown.jsx)("code", {
        children: code
      })
    })]
  });
}
// jsxChatMessages (minified: T) — jsx runtime for the chat message list and its blocks.
// CHAT_PAGE_SIZE (minified: dh): how many message groups the chat shows at first, and how many more "Show earlier" adds.
var jsxChatMessages = G(oe()),
  CHAT_PAGE_SIZE = 80;
// ChatMessageList (minified: $1) — the scrolling chat transcript: groups blocks (groupChatBlocks), shows the last CHAT_PAGE_SIZE groups with a "Show earlier" button, and sticks to the bottom while new text arrives unless the user scrolled up. Shows ChatEmptyState when there are no blocks.
function ChatMessageList({
  blocks: blocks,
  cli: cli,
  instanceName: instanceName,
  running: running,
  onCopy: onCopy,
  onOpenLink: onOpenLink,
  onApplyProposal: onApplyProposal,
  onDecide: onDecide,
  bottomInset = 0
}) {
  let endRef = (0, ReactForChat.useRef)(null),
    scrollerRef = (0, ReactForChat.useRef)(null),
    stickToBottomRef = (0, ReactForChat.useRef)(!0);
  // Remembers whether the user is near the bottom (within 60 px); only then does new content scroll into view.
  // The next effect scrolls to the end on any DOM change (streamed text, expanded blocks), at most once per frame.
  (0, ReactForChat.useEffect)(() => {
    let scroller = scrollerRef.current;
    if (!scroller) return;
    let onScroll = () => {
      let distanceFromBottom = scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight;
      stickToBottomRef.current = distanceFromBottom < 60;
    };
    return scroller.addEventListener("scroll", onScroll), () => scroller.removeEventListener("scroll", onScroll);
  }, []), (0, ReactForChat.useEffect)(() => {
    let scroller = scrollerRef.current;
    if (!scroller) return;
    let frameId = 0,
      observer = new MutationObserver(() => {
        !stickToBottomRef.current || frameId || (frameId = requestAnimationFrame(() => {
          frameId = 0, endRef.current?.scrollIntoView({
            block: "end"
          });
        }));
      });
    return observer.observe(scroller, {
      childList: !0,
      subtree: !0,
      characterData: !0
    }), () => {
      observer.disconnect(), cancelAnimationFrame(frameId);
    };
  }, [blocks.length === 0]), (0, ReactForChat.useEffect)(() => {
    stickToBottomRef.current && endRef.current?.scrollIntoView({
      block: "end"
    });
  }, [blocks, bottomInset]);
  let groups = (0, ReactForChat.useMemo)(() => groupChatBlocks(blocks, running), [blocks, running]),
    [visibleCount, setVisibleCount] = (0, ReactForChat.useState)(CHAT_PAGE_SIZE);
  if (blocks.length === 0) return (0, jsxChatMessages.jsx)("div", {
    ref: scrollerRef,
    className: "flex-1 min-h-0 overflow-y-auto p-4",
    style: {
      paddingBottom: bottomInset + 16
    },
    children: (0, jsxChatMessages.jsx)(ChatEmptyState, {
      cli: cli,
      instanceName: instanceName
    })
  });
  let hiddenCount = Math.max(0, groups.length - visibleCount),
    visibleGroups = hiddenCount > 0 ? groups.slice(hiddenCount) : groups,
    hasLiveWork = visibleGroups.some(group => group.kind === "process" && group.live);
  return (0, jsxChatMessages.jsxs)("div", {
    ref: scrollerRef,
    className: "flex-1 min-h-0 overflow-y-auto px-3 py-3 flex flex-col gap-3",
    children: [hiddenCount > 0 && (0, jsxChatMessages.jsxs)("button", {
      type: "button",
      onClick: () => setVisibleCount(count => count + CHAT_PAGE_SIZE),
      className: "self-center rounded-md border border-border bg-transparent px-2 py-1 text-[11px] text-muted-foreground cursor-pointer hover:text-foreground",
      children: ["Show ", Math.min(hiddenCount, CHAT_PAGE_SIZE), " earlier"]
    }), visibleGroups.map(group => group.kind === "process" ? (0, jsxChatMessages.jsx)(WorkStepsGroup, {
      blocks: group.blocks,
      live: group.live,
      onCopy: onCopy,
      onOpenLink: onOpenLink
    }, group.id) : (0, jsxChatMessages.jsx)(ChatBlock, {
      block: group.block,
      answer: group.kind === "answer",
      onCopy: onCopy,
      onOpenLink: onOpenLink,
      onApplyProposal: onApplyProposal,
      onDecide: onDecide
    }, group.block.id)), running && !hasLiveWork && (0, jsxChatMessages.jsx)(WorkingIndicator, {}), (0, jsxChatMessages.jsx)("div", {
      className: "shrink-0",
      style: {
        height: bottomInset
      },
      "aria-hidden": !0
    }), (0, jsxChatMessages.jsx)("div", {
      ref: endRef
    })]
  });
}
// ChatEmptyState (minified: AD) — what an empty chat shows: example questions for the selected CLI, or a hint to pick a CLI when none is ready.
function ChatEmptyState({
  cli: cli,
  instanceName: instanceName
}) {
  return cli ? (0, jsxChatMessages.jsxs)("div", {
    className: "text-sm text-muted-foreground flex flex-col gap-2",
    children: [(0, jsxChatMessages.jsxs)("p", {
      className: "m-0 text-foreground",
      children: ["Ask ", cli.label, " about ", instanceName || "this instance", "."]
    }), (0, jsxChatMessages.jsx)("p", {
      className: "m-0",
      children: "It already knows this instance's workflows, stages, and operators, and how Saturn's flow documents are shaped \u2014 you don't need to paste any of that."
    }), (0, jsxChatMessages.jsxs)("ul", {
      className: "m-0 pl-4 flex flex-col gap-1",
      children: [(0, jsxChatMessages.jsx)("li", {
        children: "Which workflows send email, and from which stage?"
      }), (0, jsxChatMessages.jsx)("li", {
        children: "Explain what the Ticketing System's init action does."
      }), (0, jsxChatMessages.jsx)("li", {
        children: "Where is the Employee Balance Reconcile command used?"
      })]
    })]
  }) : (0, jsxChatMessages.jsxs)("div", {
    className: "text-sm text-muted-foreground flex flex-col gap-2",
    children: [(0, jsxChatMessages.jsx)("p", {
      className: "m-0 text-foreground",
      children: "No AI CLI is ready."
    }), (0, jsxChatMessages.jsx)("p", {
      className: "m-0",
      children: "Pick one from the bar under the message box. The CLI runs the model and keeps its own sign-in \u2014 this extension never stores an API key."
    })]
  });
}
// WorkStepsGroup (minified: TD) — a run of thinking / tool / interim assistant blocks. While live it is shown dimmed with "Working…"; afterwards it folds into a one-line summary ("Thought, used 3 tools · 1 failed") that expands. Memoised: re-renders only when the live flag, callbacks or a block object change.
var WorkStepsGroup = (0, ReactForChat.memo)(function ({
  blocks: blocks,
  live: live,
  onCopy: onCopy,
  onOpenLink: onOpenLink
}) {
  let [expanded, setExpanded] = (0, ReactForChat.useState)(!1),
    toolBlocks = blocks.filter(block => block.role === "tool"),
    failedCount = toolBlocks.filter(block => block.role === "tool" && block.ok === !1).length,
    hasThinking = blocks.some(block => block.role === "thinking"),
    summary = [hasThinking ? "Thought" : null, toolBlocks.length > 0 ? `${hasThinking ? "used" : "Used"} ${toolBlocks.length} tool${toolBlocks.length === 1 ? "" : "s"}` : null].filter(Boolean).join(", ") || "Worked";
  return live ? (0, jsxChatMessages.jsxs)("div", {
    className: "flex flex-col gap-1.5 opacity-60",
    children: [(0, jsxChatMessages.jsxs)("div", {
      className: "flex items-center gap-2 text-[11px] text-muted-foreground",
      children: [(0, jsxChatMessages.jsx)(TypingDots, {}), "Working\u2026"]
    }), (0, jsxChatMessages.jsx)("div", {
      className: "flex flex-col gap-1.5 border-l border-border pl-2.5",
      children: blocks.map(block => (0, jsxChatMessages.jsx)(WorkStep, {
        block: block,
        live: !0,
        onCopy: onCopy,
        onOpenLink: onOpenLink
      }, block.id))
    })]
  }) : (0, jsxChatMessages.jsxs)("div", {
    className: "flex flex-col gap-1.5",
    children: [(0, jsxChatMessages.jsxs)("button", {
      type: "button",
      onClick: () => setExpanded(!expanded),
      className: "self-start flex items-center gap-1.5 bg-transparent border-none px-0 cursor-pointer text-[11px] text-muted-foreground hover:text-foreground",
      children: [(0, jsxChatMessages.jsx)(ChevronRightIcon, {
        className: classNames("h-3 w-3 transition-transform", expanded && "rotate-90")
      }), summary, failedCount > 0 && (0, jsxChatMessages.jsxs)("span", {
        className: "text-destructive",
        children: ["\xB7 ", failedCount, " failed"]
      })]
    }), expanded && (0, jsxChatMessages.jsx)("div", {
      className: "flex flex-col gap-1.5 border-l border-border pl-2.5 ml-1.5 text-muted-foreground",
      children: blocks.map(block => (0, jsxChatMessages.jsx)(WorkStep, {
        block: block,
        live: !1,
        onCopy: onCopy,
        onOpenLink: onOpenLink
      }, block.id))
    })]
  });
}, (prev, next) => prev.live === next.live && prev.onCopy === next.onCopy && prev.onOpenLink === next.onOpenLink && prev.blocks.length === next.blocks.length && prev.blocks.every((block, index) => block === next.blocks[index]));
// WorkStep (minified: J1) — one block inside a WorkStepsGroup: a thinking line (clamped while live), a faint tool call, or interim assistant text.
function WorkStep({
  block: block,
  live: live,
  onCopy: onCopy,
  onOpenLink: onOpenLink
}) {
  switch (block.role) {
    case "thinking":
      return (0, jsxChatMessages.jsxs)("div", {
        className: "flex items-start gap-1.5 text-xs",
        children: [(0, jsxChatMessages.jsx)(BrainIcon, {
          className: "h-3 w-3 mt-0.5 shrink-0"
        }), (0, jsxChatMessages.jsx)("p", {
          className: classNames("m-0 italic whitespace-pre-wrap break-words", live && "line-clamp-4"),
          children: block.text
        })]
      });
    case "tool":
      return (0, jsxChatMessages.jsx)(ToolCallCard, {
        block: block,
        faint: !0
      });
    case "assistant":
      return (0, jsxChatMessages.jsx)("div", {
        className: "text-xs [&_p]:my-0.5",
        children: (0, jsxChatMessages.jsx)(ChatMarkdown, {
          text: block.text,
          onCopy: onCopy,
          onOpenLink: onOpenLink
        })
      });
    default:
      return null;
  }
}
// TypingDots (minified: ek) — three pulsing dots.
function TypingDots() {
  return (0, jsxChatMessages.jsx)("span", {
    className: "inline-flex gap-1",
    children: [0, 1, 2].map(dotIndex => (0, jsxChatMessages.jsx)("span", {
      className: "h-1.5 w-1.5 rounded-full bg-current opacity-60",
      style: {
        animation: `pulse 1.2s ease-in-out ${dotIndex * .15}s infinite`
      }
    }, dotIndex))
  });
}
// WorkingIndicator (minified: MD) — "Working…" with typing dots, shown while a turn runs and no work group is live.
function WorkingIndicator() {
  return (0, jsxChatMessages.jsxs)("div", {
    className: "flex items-center gap-2 text-xs text-muted-foreground",
    children: [(0, jsxChatMessages.jsx)(TypingDots, {}), "Working\u2026"]
  });
}
// ChatBlock (minified: DD) — one chat block by role: user message (with attachment chips), assistant answer (typewriter when it is the final answer), thinking, tool call, proposal, approval request, CLI/profile switch divider, notice, error, or token/cost usage line.
var ChatBlock = (0, ReactForChat.memo)(function ({
  block: block,
  answer = !1,
  onCopy: onCopy,
  onOpenLink: onOpenLink,
  onApplyProposal: onApplyProposal,
  onDecide: onDecide
}) {
  switch (block.role) {
    case "user":
      return (0, jsxChatMessages.jsxs)("div", {
        className: "self-end max-w-[85%] rounded-lg bg-input border border-border px-3 py-2",
        children: [block.text.length > 0 && (0, jsxChatMessages.jsx)("p", {
          className: "m-0 text-sm whitespace-pre-wrap break-words",
          children: block.text
        }), (block.attachments ?? []).length > 0 && (0, jsxChatMessages.jsx)("div", {
          className: classNames("flex flex-wrap gap-1.5", block.text.length > 0 && "mt-1.5"),
          children: (block.attachments ?? []).map((attachment, index) => (0, jsxChatMessages.jsxs)("span", {
            className: "flex items-center gap-1 rounded border border-border px-1.5 py-0.5 text-[11px] text-muted-foreground",
            children: [attachment.kind === "image" ? (0, jsxChatMessages.jsx)(ImageIcon, {
              className: "h-3 w-3 shrink-0"
            }) : (0, jsxChatMessages.jsx)(FileTextIcon, {
              className: "h-3 w-3 shrink-0"
            }), (0, jsxChatMessages.jsx)("span", {
              className: "max-w-[12rem] truncate",
              children: attachment.name
            })]
          }, `${attachment.name}-${index}`))
        })]
      });
    // The final answer of a turn is typed out (AnswerText); interim text is plain Markdown.
    case "assistant":
      return answer ? (0, jsxChatMessages.jsx)(AnswerText, {
        text: block.text,
        streaming: block.streaming,
        onCopy: onCopy,
        onOpenLink: onOpenLink
      }) : (0, jsxChatMessages.jsxs)("div", {
        className: "max-w-[92%]",
        children: [(0, jsxChatMessages.jsx)(ChatMarkdown, {
          text: block.text,
          onCopy: onCopy,
          onOpenLink: onOpenLink
        }), block.streaming && (0, jsxChatMessages.jsx)(StreamingCaret, {})]
      });
    case "thinking":
      return (0, jsxChatMessages.jsx)(CollapsibleNote, {
        icon: (0, jsxChatMessages.jsx)(BrainIcon, {
          className: "h-3 w-3"
        }),
        label: "Thought",
        text: block.text
      });
    case "tool":
      return (0, jsxChatMessages.jsx)(ToolCallCard, {
        block: block
      });
    case "proposal":
      return (0, jsxChatMessages.jsx)(ProposalCard, {
        block: block,
        onApply: onApplyProposal
      });
    case "approval":
      return (0, jsxChatMessages.jsx)(ApprovalCard, {
        block: block,
        onDecide: onDecide
      });
    case "switch":
      return (0, jsxChatMessages.jsx)(SwitchDivider, {
        text: block.text,
        detail: block.detail
      });
    case "notice":
      return (0, jsxChatMessages.jsxs)("div", {
        className: "flex items-start gap-1.5 text-[11px] text-muted-foreground",
        children: [(0, jsxChatMessages.jsx)(InfoIcon, {
          className: "h-3 w-3 mt-0.5 shrink-0"
        }), (0, jsxChatMessages.jsx)("span", {
          className: "whitespace-pre-wrap break-words",
          children: block.text
        })]
      });
    case "error":
      return (0, jsxChatMessages.jsxs)("div", {
        className: "flex items-start gap-1.5 rounded-md border border-destructive/40 px-2 py-1.5",
        children: [(0, jsxChatMessages.jsx)(TriangleAlertIcon, {
          className: "h-3.5 w-3.5 mt-0.5 shrink-0 text-destructive"
        }), (0, jsxChatMessages.jsx)("span", {
          className: "text-xs text-destructive whitespace-pre-wrap break-words",
          children: block.text
        })]
      });
    // Token counts and cost of the turn, when the CLI reports them.
    case "usage":
      {
        let parts = [];
        return block.inputTokens !== null && parts.push(`${block.inputTokens.toLocaleString()} in`), block.outputTokens !== null && parts.push(`${block.outputTokens.toLocaleString()} out`), block.costUsd !== null && parts.push(`$${block.costUsd.toFixed(4)}`), parts.length === 0 ? null : (0, jsxChatMessages.jsx)("p", {
          className: "m-0 text-[11px] text-muted-foreground font-mono",
          children: parts.join(" \xB7 ")
        });
      }
  }
});
// ProposalCard (minified: BD) — an action the agent proposes (e.g. a change to the instance): summary, "changes the instance" when risky, Apply (onApply(proposalId)), its state, and the action / result JSON folded below.
function ProposalCard({
  block: block,
  onApply: onApply
}) {
  let [expanded, setExpanded] = (0, ReactForChat.useState)(!1),
    {
      proposal: proposal,
      state: state,
      ok: ok,
      result: result
    } = block;
  return (0, jsxChatMessages.jsxs)("div", {
    className: "rounded-md border border-primary/40",
    children: [(0, jsxChatMessages.jsxs)("div", {
      className: "flex items-center gap-1.5 px-2 py-1.5",
      children: [(0, jsxChatMessages.jsx)(ZapIcon, {
        className: "h-3 w-3 shrink-0 text-primary"
      }), (0, jsxChatMessages.jsx)("span", {
        className: "text-xs font-mono truncate",
        children: proposal.summary
      }), proposal.risk === "write" && (0, jsxChatMessages.jsx)("span", {
        className: "text-[10px] uppercase tracking-wide text-muted-foreground shrink-0",
        children: "changes the instance"
      }), (0, jsxChatMessages.jsx)("span", {
        className: "flex-1"
      }), state === "offered" && (0, jsxChatMessages.jsxs)(Button, {
        size: "sm",
        className: "h-6 gap-1 px-2 text-[11px]",
        onClick: () => onApply(proposal.proposalId),
        children: [(0, jsxChatMessages.jsx)(PlayIcon, {
          className: "h-3 w-3"
        }), "Apply"]
      }), state === "running" && (0, jsxChatMessages.jsx)("span", {
        className: "text-[10px] text-muted-foreground shrink-0",
        children: "running\u2026"
      }), state === "done" && (0, jsxChatMessages.jsx)("span", {
        className: classNames("text-[10px] shrink-0", ok ? "text-muted-foreground" : "text-destructive"),
        children: ok ? "applied" : "failed"
      })]
    }), (0, jsxChatMessages.jsxs)("button", {
      type: "button",
      onClick: () => setExpanded(!expanded),
      className: "w-full flex items-center gap-1.5 px-2 pb-1.5 bg-transparent border-none cursor-pointer text-left text-[11px] text-muted-foreground",
      children: [(0, jsxChatMessages.jsx)(ChevronRightIcon, {
        className: classNames("h-3 w-3 transition-transform", expanded && "rotate-90")
      }), expanded ? "Hide" : "Show", " what this will do"]
    }), expanded && (0, jsxChatMessages.jsxs)("div", {
      className: "px-2 pb-2 flex flex-col gap-1.5",
      children: [(0, jsxChatMessages.jsx)(LabeledPre, {
        label: "Action",
        text: JSON.stringify({
          action: proposal.action,
          args: proposal.args
        }, null, 2)
      }), result && (0, jsxChatMessages.jsx)(LabeledPre, {
        label: ok ? "Result" : "Error",
        text: result
      })]
    })]
  });
}
// ApprovalCard (minified: ED) — a tool-permission request from the CLI: Allow once, Always allow (the tool, edits to one file, or reads of one resource's records) or Deny, sent through onDecide(requestId, allow, toolName, always, scope?). Shows the full input folded.
function ApprovalCard({
  block: block,
  onDecide: onDecide
}) {
  let [expanded, setExpanded] = (0, ReactForChat.useState)(!1),
    {
      approval: approval,
      state: state
    } = block,
    {
      label: label,
      server: serverLabel
    } = toolLabel(approval.toolName),
    summary = approval.summary && approval.summary !== approval.toolName ? approval.summary : null;
  return (0, jsxChatMessages.jsxs)("div", {
    className: classNames("rounded-md border", state === "pending" ? "border-primary" : "border-border"),
    children: [(0, jsxChatMessages.jsxs)("div", {
      className: "flex items-start gap-1.5 px-2 py-1.5",
      children: [(0, jsxChatMessages.jsx)(ShieldQuestionMarkIcon, {
        className: "h-3.5 w-3.5 mt-0.5 shrink-0 text-primary"
      }), (0, jsxChatMessages.jsxs)("div", {
        className: "min-w-0 flex-1",
        children: [(0, jsxChatMessages.jsxs)("p", {
          className: "m-0 text-xs text-foreground",
          title: approval.toolName,
          children: [state === "pending" ? "Allow" : state === "allowed" ? "Allowed" : "Denied", " ", (0, jsxChatMessages.jsx)("span", {
            className: "font-mono",
            children: label
          }), serverLabel && (0, jsxChatMessages.jsxs)("span", {
            className: "text-muted-foreground",
            children: [" \xB7 ", serverLabel]
          }), state === "pending" && "?"]
        }), summary && (0, jsxChatMessages.jsx)("p", {
          className: "m-0 text-[11px] text-muted-foreground font-mono truncate",
          children: summary
        })]
      })]
    }), state === "pending" && (0, jsxChatMessages.jsxs)("div", {
      className: "flex items-center gap-1.5 px-2 pb-2 flex-wrap",
      children: [(0, jsxChatMessages.jsxs)(Button, {
        size: "sm",
        className: "h-6 gap-1 px-2 text-[11px]",
        onClick: () => onDecide(approval.requestId, !0, approval.toolName, !1),
        children: [(0, jsxChatMessages.jsx)(CheckIcon, {
          className: "h-3 w-3"
        }), "Allow once"]
      }), approval.canAlways && (0, jsxChatMessages.jsxs)(Button, {
        variant: "secondary",
        size: "sm",
        className: "h-6 px-2 text-[11px]",
        onClick: () => onDecide(approval.requestId, !0, approval.toolName, !0),
        children: ["Always allow ", label]
      }), approval.editScopes && (0, jsxChatMessages.jsxs)(Button, {
        variant: "secondary",
        size: "sm",
        className: "h-6 px-2 text-[11px]",
        title: "Edits to this file stop asking until you switch profile or start a new chat",
        onClick: () => onDecide(approval.requestId, !0, approval.toolName, !0, "file"),
        children: ["Always allow edits to ", approval.editScopes.file]
      }), approval.recordResource && (0, jsxChatMessages.jsxs)(Button, {
        variant: "secondary",
        size: "sm",
        className: "h-6 px-2 text-[11px]",
        title: "Reads of this resource's records stop asking until you switch profile or start a new chat",
        onClick: () => onDecide(approval.requestId, !0, approval.toolName, !0, "records"),
        children: ["Always allow reading ", approval.recordResource, " records"]
      }), (0, jsxChatMessages.jsxs)(Button, {
        variant: "ghost",
        size: "sm",
        className: "h-6 gap-1 px-2 text-[11px]",
        onClick: () => onDecide(approval.requestId, !1, approval.toolName, !1),
        children: [(0, jsxChatMessages.jsx)(XIcon, {
          className: "h-3 w-3"
        }), "Deny"]
      })]
    }), state === "expired" && (0, jsxChatMessages.jsx)("p", {
      className: "m-0 px-2 pb-2 text-[11px] text-muted-foreground",
      children: "The turn ended before this was answered, so it was declined."
    }), (0, jsxChatMessages.jsxs)("button", {
      type: "button",
      onClick: () => setExpanded(!expanded),
      className: "w-full flex items-center gap-1.5 px-2 pb-1.5 bg-transparent border-none cursor-pointer text-left text-[11px] text-muted-foreground",
      children: [(0, jsxChatMessages.jsx)(ChevronRightIcon, {
        className: classNames("h-3 w-3 transition-transform", expanded && "rotate-90")
      }), expanded ? "Hide" : "Show", " the full request"]
    }), expanded && (0, jsxChatMessages.jsx)("div", {
      className: "px-2 pb-2",
      children: (0, jsxChatMessages.jsx)(LabeledPre, {
        label: "Input",
        text: JSON.stringify(approval.input, null, 2)
      })
    })]
  });
}
// SwitchDivider (minified: RD) — a centred divider line marking a CLI or profile switch in the transcript.
function SwitchDivider({
  text: text,
  detail: detail
}) {
  return (0, jsxChatMessages.jsxs)("div", {
    className: "flex flex-col items-center gap-0.5 py-1",
    children: [(0, jsxChatMessages.jsxs)("div", {
      className: "flex items-center gap-2 w-full",
      children: [(0, jsxChatMessages.jsx)("span", {
        className: "flex-1 h-px bg-border"
      }), (0, jsxChatMessages.jsx)("span", {
        className: "text-[11px] text-muted-foreground whitespace-nowrap",
        children: text
      }), (0, jsxChatMessages.jsx)("span", {
        className: "flex-1 h-px bg-border"
      })]
    }), detail && (0, jsxChatMessages.jsx)("span", {
      className: "text-[10px] text-muted-foreground",
      children: detail
    })]
  });
}
// AnswerText (minified: ND) — the final assistant answer, revealed with a typewriter effect (useTypewriter) and a caret while streaming or still typing.
function AnswerText({
  text: text,
  streaming: streaming,
  onCopy: onCopy,
  onOpenLink: onOpenLink
}) {
  let shownText = useTypewriter(text, streaming),
    showCaret = streaming || shownText.length < text.length;
  return (0, jsxChatMessages.jsxs)("div", {
    className: "max-w-[92%] text-foreground font-medium text-[13.5px] leading-relaxed",
    children: [(0, jsxChatMessages.jsx)(ChatMarkdown, {
      text: shownText,
      onCopy: onCopy,
      onOpenLink: onOpenLink
    }), showCaret && (0, jsxChatMessages.jsx)(StreamingCaret, {})]
  });
}
// TYPEWRITER_MIN_CHARS_PER_SEC (minified: zD) — slowest typewriter speed (characters per second).
// TYPEWRITER_FRAME_MS (minified: OD): minimum time between typewriter updates.
// TYPEWRITER_BACKLOG_RATE (minified: PD): fraction of the untyped backlog typed per second, so long answers catch up.
var TYPEWRITER_MIN_CHARS_PER_SEC = 45,
  TYPEWRITER_FRAME_MS = 50,
  TYPEWRITER_BACKLOG_RATE = .8;
// useTypewriter (minified: UD) — hook: returns a growing prefix of text while it streams, typing faster as the backlog grows. Off (returns the whole text) if the text was not streaming at first mount or the user prefers reduced motion.
function useTypewriter(text, streaming) {
  let [animate] = (0, ReactForChat.useState)(() => streaming && !window.matchMedia?.("(prefers-reduced-motion: reduce)").matches),
    [shownLength, setShownLength] = (0, ReactForChat.useState)(animate ? 0 : text.length),
    latestRef = (0, ReactForChat.useRef)({
      length: text.length,
      streaming: streaming
    });
  latestRef.current = {
    length: text.length,
    streaming: streaming
  };
  let typedRef = (0, ReactForChat.useRef)(0);
  return (0, ReactForChat.useEffect)(() => {
    if (!animate) return;
    let frameId = 0,
      lastTime = performance.now(),
      tick = now => {
        if (now - lastTime < TYPEWRITER_FRAME_MS) {
          frameId = requestAnimationFrame(tick);
          return;
        }
        let elapsed = Math.min(now - lastTime, 150);
        lastTime = now;
        let backlog = latestRef.current.length - typedRef.current;
        if (backlog > 0) {
          let charsPerSec = Math.max(TYPEWRITER_MIN_CHARS_PER_SEC, backlog * TYPEWRITER_BACKLOG_RATE);
          typedRef.current = Math.min(latestRef.current.length, typedRef.current + Math.max(1, Math.round(charsPerSec * elapsed / 1e3))), setShownLength(typedRef.current);
        } else // Caught up: keep ticking only while more text may arrive.
          if (!latestRef.current.streaming) return;
        frameId = requestAnimationFrame(tick);
      };
    return frameId = requestAnimationFrame(tick), () => cancelAnimationFrame(frameId);
  }, [animate]), animate ? text.slice(0, shownLength) : text;
}
// StreamingCaret (minified: tk) — the thin caret after text that is still arriving.
function StreamingCaret() {
  return (0, jsxChatMessages.jsx)("span", {
    className: "inline-block w-[2px] h-[1em] align-middle ml-0.5 bg-current opacity-70"
  });
}
// ToolCallCard (minified: ak) — a tool call the CLI made: readable tool name and MCP server (toolNameLabel), running / done / failed, with its input and result folded. faint = borderless, inside a work group.
function ToolCallCard({
  block: block,
  faint = !1
}) {
  let [expanded, setExpanded] = (0, ReactForChat.useState)(!1),
    running = block.ok === null,
    {
      label: label,
      server: serverLabel
    } = toolLabel(block.name);
  return (0, jsxChatMessages.jsxs)("div", {
    className: classNames("rounded-md", faint ? "border border-transparent hover:border-border" : "border border-border"),
    children: [(0, jsxChatMessages.jsxs)("button", {
      type: "button",
      onClick: () => setExpanded(!expanded),
      title: block.name,
      className: classNames("w-full flex items-center gap-1.5 bg-transparent border-none cursor-pointer text-left text-inherit", faint ? "px-1 py-0.5" : "px-2 py-1.5"),
      children: [(0, jsxChatMessages.jsx)(ChevronRightIcon, {
        className: classNames("h-3 w-3 shrink-0 transition-transform", expanded && "rotate-90")
      }), (0, jsxChatMessages.jsx)(TerminalIcon, {
        className: "h-3 w-3 shrink-0"
      }), (0, jsxChatMessages.jsx)("span", {
        className: "text-xs font-mono truncate",
        children: label
      }), serverLabel && (0, jsxChatMessages.jsx)("span", {
        className: "text-[10px] text-muted-foreground shrink-0",
        children: serverLabel
      }), (0, jsxChatMessages.jsx)("span", {
        className: "flex-1"
      }), (0, jsxChatMessages.jsx)("span", {
        className: classNames("text-[10px] shrink-0", running || block.ok ? "text-muted-foreground" : "text-destructive"),
        children: running ? "running" : block.ok ? "done" : "failed"
      })]
    }), expanded && (0, jsxChatMessages.jsxs)("div", {
      className: "px-2 pb-2 flex flex-col gap-1.5",
      children: [block.input && (0, jsxChatMessages.jsx)(LabeledPre, {
        label: "Input",
        text: block.input
      }), block.result && (0, jsxChatMessages.jsx)(LabeledPre, {
        label: "Result",
        text: block.result
      })]
    })]
  });
}
// CollapsibleNote (minified: qD) — a small toggle (icon + label) that shows a block of text, used for thinking blocks.
function CollapsibleNote({
  icon: icon,
  label: label,
  text: text
}) {
  let [expanded, setExpanded] = (0, ReactForChat.useState)(!1);
  return (0, jsxChatMessages.jsxs)("div", {
    className: "flex flex-col gap-1",
    children: [(0, jsxChatMessages.jsxs)("button", {
      type: "button",
      onClick: () => setExpanded(!expanded),
      className: "self-start flex items-center gap-1.5 bg-transparent border-none px-0 cursor-pointer text-[11px] text-muted-foreground hover:text-foreground",
      children: [(0, jsxChatMessages.jsx)(ChevronRightIcon, {
        className: classNames("h-3 w-3 transition-transform", expanded && "rotate-90")
      }), icon, label]
    }), expanded && (0, jsxChatMessages.jsx)("p", {
      className: "m-0 pl-4 text-xs text-muted-foreground whitespace-pre-wrap break-words",
      children: text
    })]
  });
}
// LabeledPre (minified: lu) — a small caption over a scrollable preformatted box (JSON input, results).
function LabeledPre({
  label: label,
  text: text
}) {
  return (0, jsxChatMessages.jsxs)("div", {
    className: "flex flex-col gap-0.5",
    children: [(0, jsxChatMessages.jsx)("span", {
      className: "text-[10px] uppercase tracking-wide text-muted-foreground",
      children: label
    }), (0, jsxChatMessages.jsx)("pre", {
      className: "m-0 max-h-48 overflow-auto rounded bg-input px-2 py-1 text-[11px] font-mono whitespace-pre-wrap break-words",
      children: text
    })]
  });
}
// jsxChatPanel (minified: je) — jsx runtime for the agent chat panel.
// chatBlockCounter (minified: FD) / nextChatBlockId (minified: Kr): local ids ("b1", "b2", …) for chat blocks made in this webview.
var jsxChatPanel = G(oe()),
  chatBlockCounter = 0,
  nextChatBlockId = () => `b${++chatBlockCounter}`;
// AgentChatPanel (minified: nk) — the agent chat: header (threads, prompt, instructions), the transcript, and a floating footer with the team plan, task board and composer (instance / team / CLI / profile pickers). Talks to the host through transport (post / subscribe): sends ready, listTasks, listTeams at start, then send / sendTeam, approve / deny, applyProposal, task, attachment and team messages; handles the host messages in the switch below.
function AgentChatPanel({
  transport: transport,
  instances: instances,
  instanceId: instanceId,
  onSelectInstance: onSelectInstance,
  compact = !1,
  instanceShownElsewhere = !1
}) {
  let [blocks, setBlocks] = (0, reactForChat.useState)([]),
    [cli, setCli] = (0, reactForChat.useState)(null),
    [instanceName, setInstanceName] = (0, reactForChat.useState)(""),
    [focusTarget, setFocusTarget] = (0, reactForChat.useState)(null),
    [running, setRunning] = (0, reactForChat.useState)(!1),
    [statusReceived, setStatusReceived] = (0, reactForChat.useState)(!1),
    [tasks, setTasks] = (0, reactForChat.useState)([]),
    [profiles, setProfiles] = (0, reactForChat.useState)([]),
    [profileId, setProfileId] = (0, reactForChat.useState)("explain"),
    [attachments, setAttachments] = (0, reactForChat.useState)([]),
    [maxAttachments, setMaxAttachments] = (0, reactForChat.useState)(10),
    [skills, setSkills] = (0, reactForChat.useState)([]),
    [nextTaskId, setNextTaskId] = (0, reactForChat.useState)(null),
    [blockedTask, setBlockedTask] = (0, reactForChat.useState)(null),
    [threads, setThreads] = (0, reactForChat.useState)([]),
    [currentThreadId, setCurrentThreadId] = (0, reactForChat.useState)(null),
    [teams, setTeams] = (0, reactForChat.useState)([]),
    [teamClis, setTeamClis] = (0, reactForChat.useState)([]),
    [teamProfiles, setTeamProfiles] = (0, reactForChat.useState)([]),
    [teamId, setTeamId] = (0, reactForChat.useState)(null),
    [teamRun, setTeamRun] = (0, reactForChat.useState)(null),
    [teamsEditorOpen, setTeamsEditorOpen] = (0, reactForChat.useState)(!1),
    [teamProblems, setTeamProblems] = (0, reactForChat.useState)([]),
    footerRef = (0, reactForChat.useRef)(null),
    [footerHeight, setFooterHeight] = (0, reactForChat.useState)(0);
  // Measures the floating footer so the transcript leaves room for it (bottomInset).
  (0, reactForChat.useEffect)(() => {
    let footer = footerRef.current;
    if (!footer) return;
    let observer = new ResizeObserver(() => setFooterHeight(footer.offsetHeight));
    return observer.observe(footer), () => observer.disconnect();
  }, []);
  // Agent events from the CLI are folded into the blocks by the chat reducer; endStreaming marks streamed text finished.
  let applyAgentEvent = (0, reactForChat.useCallback)(agentEvent => {
      setBlocks(prevBlocks => applyChatEvent(prevBlocks, agentEvent, nextChatBlockId));
    }, []),
    endStreaming = (0, reactForChat.useCallback)(() => {
      setBlocks(prevBlocks => stopStreaming(prevBlocks));
    }, []);
  (0, reactForChat.useEffect)(() => {
    let onHostMessage = message => {
        switch (message?.type) {
          // Which CLI is selected, the instance, what the agent is focused on, and whether a turn is running.
          case "status":
            setCli(message.cli ?? null), setInstanceName(message.instanceName ?? ""), setFocusTarget(message.focus ?? null), setRunning(!!message.running), setStatusReceived(!0);
            break;
          // The workflow / item the agent is focused on changed.
          case "focus":
            setFocusTarget(message.focus ?? null);
            break;
          // A turn started: add the user's message.
          case "turnStart":
            setBlocks(prev => [...prev, {
              id: nextChatBlockId(),
              role: "user",
              text: message.prompt,
              attachments: message.attachments ?? []
            }]), setRunning(!0);
            break;
          // One streamed agent event (text, thinking, tool call, usage, …).
          case "event":
            applyAgentEvent(message.event);
            break;
          // The turn finished: end streaming and add "Stopped." or the error.
          case "turnEnd":
            {
              endStreaming();
              let result = message.result;
              result.cancelled ? setBlocks(prev => [...prev, {
                id: nextChatBlockId(),
                role: "notice",
                text: "Stopped."
              }]) : result.error && setBlocks(prev => [...prev, {
                id: nextChatBlockId(),
                role: "error",
                text: result.error
              }]), setRunning(!1);
              break;
            }
          // A saved thread was loaded.
          case "history":
            setBlocks(message.blocks), setCurrentThreadId(message.threadId ?? null);
            break;
          // The list of saved threads and the current one.
          case "threads":
            setThreads(message.threads ?? []), setCurrentThreadId(message.current ?? null);
            break;
          // The CLI or profile changed: add a divider.
          case "switched":
            setBlocks(prev => [...prev, {
              id: nextChatBlockId(),
              role: "switch",
              text: message.text,
              detail: message.detail ?? null
            }]);
            break;
          // Files attached to the next message, and how many are allowed.
          case "attachments":
            setAttachments(message.attachments ?? []), typeof message.max == "number" && setMaxAttachments(message.max);
            break;
          // The task board: tasks, profiles, the active profile, skills, the next task to run, and what blocks it.
          case "tasks":
            setTasks(message.tasks ?? []), setProfiles(message.profiles ?? []), setProfileId(message.profileId ?? "explain"), setSkills(message.skills ?? []), setNextTaskId(message.next ?? null), setBlockedTask(message.blocked ?? null);
            break;
          // The CLI asks permission to use a tool.
          case "approval":
            setBlocks(prev => [...prev, {
              id: nextChatBlockId(),
              role: "approval",
              state: "pending",
              approval: {
                requestId: message.requestId,
                toolName: message.toolName,
                summary: message.summary,
                input: message.input,
                canAlways: !!message.canAlways,
                editScopes: message.editScopes ?? null,
                recordResource: message.recordResource ?? null
              }
            }]);
            break;
          // The host allowed these pending requests itself (an "always allow" rule now covers them).
          case "approvalsAllowed":
            {
              let allowedIds = new Set(message.requestIds ?? []);
              setBlocks(prev => prev.map(block => block.role === "approval" && block.state === "pending" && allowedIds.has(block.approval.requestId) ? {
                ...block,
                state: "allowed"
              } : block));
              break;
            }
          // The pending requests in this scope (or with no scope) can no longer be answered.
          case "approvalsCleared":
            {
              let scope = message.scope ?? null,
                inScope = requestId => scope ? requestId.startsWith(`${scope}:`) : !requestId.includes(":");
              setBlocks(prev => prev.map(block => block.role === "approval" && block.state === "pending" && inScope(block.approval.requestId) ? {
                ...block,
                state: "expired"
              } : block));
              break;
            }
          // The agent proposed actions to apply.
          case "proposals":
            setBlocks(prev => [...prev, ...message.proposals.map(proposal => ({
              id: nextChatBlockId(),
              role: "proposal",
              proposal: proposal,
              state: "offered",
              ok: null,
              result: null
            }))]);
            break;
          // A proposal is being applied.
          case "proposalRunning":
            setBlocks(prev => prev.map(block => block.role === "proposal" && block.proposal.proposalId === message.proposalId ? {
              ...block,
              state: "running"
            } : block));
            break;
          // A proposal finished, with its result.
          case "proposalDone":
            setBlocks(prev => prev.map(block => block.role === "proposal" && block.proposal.proposalId === message.proposalId ? {
              ...block,
              state: "done",
              ok: !!message.ok,
              result: message.content ?? null
            } : block));
            break;
          // A new thread: clear the transcript.
          case "threadReset":
            setBlocks([]), setCurrentThreadId(null);
            break;
          // Agent teams, the CLIs and profiles they can use; drops the selected team if it is gone.
          case "teams":
            {
              let teamList = message.teams ?? [];
              setTeams(teamList), setTeamClis(message.clis ?? []), setTeamProfiles(message.profiles ?? []), setTeamId(currentId => currentId && teamList.some(team => team.id === currentId) ? currentId : null);
              break;
            }
          // The running team plan (or none).
          case "teamState":
            setTeamRun(message.run ?? null);
            break;
          // Saving a team failed: show its problems.
          case "teamError":
            setTeamProblems(message.problems ?? []);
            break;
          // A team was saved: select it.
          case "teamSaved":
            setTeamProblems([]), setTeamId(message.teamId ?? null);
            break;
        }
      },
      unsubscribe = transport.subscribe(onHostMessage);
    return transport.post({
      type: "ready"
    }), transport.post({
      type: "listTasks"
    }), transport.post({
      type: "listTeams"
    }), unsubscribe;
  }, [applyAgentEvent, endStreaming, transport]);
  let copyText = (0, reactForChat.useCallback)(text => transport.post({
      type: "copy",
      text: text
    }), [transport]),
    openLink = (0, reactForChat.useCallback)(href => transport.post({
      type: "openLink",
      href: href
    }), [transport]),
    applyProposal = (0, reactForChat.useCallback)(proposalId => transport.post({
      type: "applyProposal",
      proposalId: proposalId
    }), [transport]),
    decideApproval = (0, reactForChat.useCallback)((requestId, allow, toolName, always, scope) => {
      // Answers an approval request (allow, optionally always, for a tool / file / records scope) and marks it in the transcript.
      transport.post(allow ? {
        type: "approve",
        requestId: requestId,
        toolName: toolName,
        always: always,
        scope: scope
      } : {
        type: "deny",
        requestId: requestId
      }), setBlocks(prev => prev.map(block => block.role === "approval" && block.approval.requestId === requestId ? {
        ...block,
        state: allow ? "allowed" : "denied"
      } : block));
    }, [transport]),
    sendPrompt = (0, reactForChat.useCallback)((prompt, autoApprove) => {
      // Sends the composer text to the selected team, or as a normal turn.
      transport.post(teamId ? {
        type: "sendTeam",
        teamId: teamId,
        prompt: prompt
      } : {
        type: "send",
        prompt: prompt,
        autoApprove: autoApprove
      });
    }, [teamId, transport]),
    selectedTeam = teams.find(team => team.id === teamId) ?? null;
  return (0, jsxChatPanel.jsxs)("div", {
    className: classNames("flex flex-col min-h-0 text-foreground", compact ? "flex-1" : "h-screen"),
    children: [(0, jsxChatPanel.jsx)(ChatHeader, {
      cli: cli,
      showInstanceName: !instanceShownElsewhere && !(instances && onSelectInstance),
      instanceName: instanceName,
      focus: focusTarget,
      onNewThread: () => transport.post({
        type: "newThread"
      }),
      threads: threads,
      currentThread: currentThreadId,
      onLoadThread: threadId => transport.post({
        type: "loadThread",
        threadId: threadId
      }),
      onOpenHistory: () => transport.post({
        type: "openHistoryFolder"
      }),
      onRefreshThreads: () => transport.post({
        type: "listThreads"
      }),
      onShowPrompt: () => transport.post({
        type: "showPrompt"
      }),
      onEditInstructions: () => transport.post({
        type: "editInstructions"
      })
    }), (0, jsxChatPanel.jsxs)("div", {
      className: "relative flex-1 min-h-0 flex flex-col",
      children: [(0, jsxChatPanel.jsx)(ChatMessageList, {
        blocks: blocks,
        cli: cli,
        instanceName: instanceName,
        running: running,
        bottomInset: footerHeight,
        onCopy: copyText,
        onApplyProposal: applyProposal,
        onDecide: decideApproval,
        onOpenLink: openLink
      }), (0, jsxChatPanel.jsxs)("div", {
        ref: footerRef,
        className: "pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-1 pt-6",
        style: {
          background: "linear-gradient(to bottom, transparent, var(--vscode-editor-background) 1.5rem)"
        },
        children: [teamRun && (0, jsxChatPanel.jsx)("div", {
          className: "pointer-events-auto",
          children: (0, jsxChatPanel.jsx)(TeamRunBanner, {
            run: teamRun,
            onRun: () => transport.post({
              type: "runPlan"
            }),
            onDiscard: () => transport.post({
              type: "cancelPlan"
            }),
            onStop: () => transport.post({
              type: "stopTeam"
            })
          })
        }), (0, jsxChatPanel.jsx)("div", {
          className: "pointer-events-auto mx-2 max-h-[40vh] overflow-y-auto rounded-lg border border-border bg-[var(--vscode-editor-background)] shadow-lg",
          children: (0, jsxChatPanel.jsx)(TaskBoard, {
            tasks: tasks,
            profiles: profiles,
            nextId: nextTaskId,
            blocked: blockedTask,
            activeProfileId: profileId,
            skills: skills,
            running: running,
            onAdd: (title, taskProfileId, skillIds) => transport.post({
              type: "addTask",
              title: title,
              profileId: taskProfileId,
              skillIds: skillIds
            }),
            onRun: taskId => transport.post({
              type: "runTask",
              taskId: taskId
            }),
            onRunNext: () => transport.post({
              type: "runNextTask"
            }),
            onUpdate: (taskId, patch) => transport.post({
              type: "updateTask",
              taskId: taskId,
              patch: patch
            }),
            floating: !0
          })
        }), (0, jsxChatPanel.jsx)("div", {
          className: "pointer-events-auto",
          children: (0, jsxChatPanel.jsx)(ChatComposer, {
            cli: cli,
            running: running || teamRun !== null,
            placeholder: selectedTeam ? `Ask ${selectedTeam.name} \u2014 its supervisor plans, then the workers do it` : void 0,
            attachments: attachments,
            maxAttachments: maxAttachments,
            onPickAttachments: () => transport.post({
              type: "pickAttachments"
            }),
            onAttachData: (fileName, data, mime) => transport.post({
              type: "attachData",
              name: fileName,
              data: data,
              mime: mime
            }),
            onRemoveAttachment: attachmentId => transport.post({
              type: "removeAttachment",
              id: attachmentId
            }),
            onOpenAttachment: attachmentId => transport.post({
              type: "openAttachment",
              id: attachmentId
            }),
            onSend: sendPrompt,
            onCancel: () => transport.post({
              type: "cancel"
            }),
            controls: (0, jsxChatPanel.jsxs)(jsxChatPanel.Fragment, {
              children: [instances && onSelectInstance && (0, jsxChatPanel.jsx)(InstancePicker, {
                instances: instances,
                instanceId: instanceId ?? null,
                onSelectInstance: onSelectInstance
              }), (0, jsxChatPanel.jsx)(TeamPicker, {
                teams: teams,
                teamId: teamId,
                disabled: teamRun !== null,
                onSelect: setTeamId,
                onManage: () => {
                  setTeamProblems([]), setTeamsEditorOpen(!0), transport.post({
                    type: "listTeams"
                  });
                }
              }), !selectedTeam && (0, jsxChatPanel.jsxs)(jsxChatPanel.Fragment, {
                children: [(0, jsxChatPanel.jsx)(CliPicker, {
                  cli: cli,
                  ready: statusReceived,
                  onSelectCli: () => transport.post({
                    type: "selectCli"
                  })
                }), (0, jsxChatPanel.jsx)(ProfilePicker, {
                  profiles: profiles,
                  profileId: profileId,
                  onSelectProfile: newProfileId => {
                    setProfileId(newProfileId), transport.post({
                      type: "setProfile",
                      profileId: newProfileId
                    });
                  }
                })]
              })]
            })
          })
        })]
      })]
    }), teamsEditorOpen && (0, jsxChatPanel.jsx)(TeamsEditor, {
      teams: teams,
      clis: teamClis,
      profiles: teamProfiles,
      problems: teamProblems,
      initialId: teamId,
      onSave: team => transport.post({
        type: "saveTeam",
        team: team
      }),
      onDelete: deletedTeamId => transport.post({
        type: "deleteTeam",
        teamId: deletedTeamId
      }),
      onClose: () => setTeamsEditorOpen(!1)
    })]
  });
}
var ReactForSkills = G(_e());
// jsxSkills (minified: _) — jsx runtime for the AI Skills view.
var jsxSkills = G(oe());
// SkillsView (minified: rk) — the AI Skills screen: link a Git repository of skills (owner/repo or a URL), refresh or unlink each, and switch skills on or off one by one or per repository. state = {repos, skills, busy, root} from the host; result = the last action's message. embedded hides its own Back header.
function SkillsView({
  state: state,
  result: result,
  embedded = !1,
  onBack: onBack,
  onLink: onLink,
  onRefresh: onRefresh,
  onUnlink: onUnlink,
  onToggle: onToggle,
  onToggleAll: onToggleAll,
  onOpen: onOpen
}) {
  let [source, setSource] = (0, ReactForSkills.useState)(""),
    [linking, setLinking] = (0, ReactForSkills.useState)(!1),
    submitLink = () => {
      let trimmed = source.trim();
      trimmed.length !== 0 && (onLink(trimmed), setSource(""), setLinking(!1));
    },
    skillsOfRepo = repoKey => (state?.skills ?? []).filter(skill => skill.repoKey === repoKey),
    enabledCount = (state?.skills ?? []).filter(skill => skill.enabled).length;
  return (0, jsxSkills.jsxs)("div", {
    className: "flex flex-col gap-3 p-3",
    children: [(0, jsxSkills.jsxs)("div", {
      className: "flex items-center gap-2",
      children: [!embedded && (0, jsxSkills.jsxs)(jsxSkills.Fragment, {
        children: [(0, jsxSkills.jsx)(Button, {
          variant: "ghost",
          size: "icon",
          onClick: onBack,
          title: "Back",
          children: (0, jsxSkills.jsx)(ArrowLeftIcon, {
            className: "h-4 w-4"
          })
        }), (0, jsxSkills.jsx)("p", {
          className: "text-sm text-foreground font-medium m-0",
          children: "AI Skills"
        })]
      }), (0, jsxSkills.jsx)("span", {
        className: "flex-1"
      }), (0, jsxSkills.jsx)(Button, {
        variant: "ghost",
        size: "icon",
        title: "Refresh every linked repository",
        disabled: state?.busy || (state?.repos.length ?? 0) === 0,
        onClick: () => onRefresh(),
        children: (0, jsxSkills.jsx)(RefreshCwIcon, {
          className: classNames("h-4 w-4", state?.busy && "animate-spin")
        })
      })]
    }), (0, jsxSkills.jsxs)("p", {
      className: "m-0 text-xs text-muted-foreground",
      children: ["Link a Git repository of skills - a folder with a ", (0, jsxSkills.jsx)("code", {
        children: "SKILL.md"
      }), " \u2014 and switch on the ones the agent should follow. Switched-on skills are added to the system prompt, so they work with every CLI."]
    }), linking ? (0, jsxSkills.jsxs)("div", {
      className: "flex flex-col gap-1.5 rounded-md border border-border p-2",
      children: [(0, jsxSkills.jsx)(Label, {
        htmlFor: "skills-source",
        children: "Repository"
      }), (0, jsxSkills.jsx)(Input, {
        id: "skills-source",
        autoFocus: !0,
        value: source,
        placeholder: "owner/repo, or a repository URL",
        onChange: changeEvent => setSource(changeEvent.target.value),
        onKeyDown: keyEvent => {
          keyEvent.key === "Enter" && submitLink(), keyEvent.key === "Escape" && setLinking(!1);
        }
      }), (0, jsxSkills.jsxs)("p", {
        className: "m-0 text-[11px] text-muted-foreground",
        children: ["GitHub, GitLab, Bitbucket, or any git remote \u2014 self-hosted included. A bare ", (0, jsxSkills.jsx)("code", {
          children: "owner/repo"
        }), " means GitHub. Add ", (0, jsxSkills.jsx)("code", {
          children: "#branch"
        }), " to pin one, or paste a URL with a path to use only part of the repo. Private repositories work if ", (0, jsxSkills.jsx)("code", {
          children: "git clone"
        }), " works for you in a terminal."]
      }), (0, jsxSkills.jsxs)("div", {
        className: "flex items-center gap-2 justify-end",
        children: [(0, jsxSkills.jsx)(Button, {
          variant: "ghost",
          size: "sm",
          onClick: () => setLinking(!1),
          children: "Cancel"
        }), (0, jsxSkills.jsx)(Button, {
          size: "sm",
          disabled: source.trim().length === 0,
          onClick: submitLink,
          children: "Link"
        })]
      })]
    }) : (0, jsxSkills.jsxs)(Button, {
      variant: "secondary",
      className: "w-full justify-center gap-2",
      onClick: () => setLinking(!0),
      children: [(0, jsxSkills.jsx)(PlusIcon, {
        className: "h-4 w-4"
      }), "Link a repository"]
    }), result && (0, jsxSkills.jsx)("p", {
      className: classNames("m-0 text-[11px]", result.ok ? "text-muted-foreground" : "text-destructive"),
      children: result.message
    }), state && state.repos.length === 0 ? (0, jsxSkills.jsx)("p", {
      className: "m-0 text-xs text-muted-foreground",
      children: "Nothing linked yet."
    }) : (0, jsxSkills.jsxs)(jsxSkills.Fragment, {
      children: [state && state.skills.length > 0 && (0, jsxSkills.jsxs)("p", {
        className: "m-0 text-[11px] uppercase tracking-wider text-muted-foreground",
        children: [enabledCount, " of ", state.skills.length, " switched on"]
      }), (state?.repos ?? []).map(repo => (0, jsxSkills.jsxs)("div", {
        className: "flex flex-col gap-2 rounded-md border border-border p-2",
        children: [(0, jsxSkills.jsxs)("div", {
          className: "flex items-start gap-2 min-w-0",
          children: [(0, jsxSkills.jsx)(FolderGit2Icon, {
            className: "h-4 w-4 mt-0.5 shrink-0 text-muted-foreground"
          }), (0, jsxSkills.jsxs)("div", {
            className: "min-w-0 flex-1",
            children: [(0, jsxSkills.jsxs)("p", {
              className: "m-0 text-sm text-foreground truncate",
              children: [repo.owner, "/", repo.repo, repo.ref && (0, jsxSkills.jsxs)("span", {
                className: "text-muted-foreground font-mono text-xs",
                children: [" #", repo.ref]
              })]
            }), (0, jsxSkills.jsxs)("p", {
              className: "m-0 text-[11px] text-muted-foreground truncate",
              children: [`${gitHostLabel(repo)} \xB7 `, repo.subdirectory ? `${repo.subdirectory} \xB7 ` : "", repo.skillCount, " skill", repo.skillCount === 1 ? "" : "s", repo.fetchedAt ? ` \xB7 ${fetchedAgo(repo.fetchedAt)}` : " \xB7 not fetched"]
            })]
          }), skillsOfRepo(repo.key).length > 0 && (() => {
            // "n/m" button that switches all of this repository's skills on (if any are off) or off.
            let repoSkills = skillsOfRepo(repo.key),
              enabledInRepo = repoSkills.filter(skill => skill.enabled).length,
              switchAllOn = enabledInRepo < repoSkills.length;
            return (0, jsxSkills.jsxs)("button", {
              type: "button",
              title: switchAllOn ? `Switch on all ${repoSkills.length} in this repository` : `Switch off all ${repoSkills.length} in this repository`,
              onClick: () => onToggleAll(repo.key, switchAllOn),
              className: "shrink-0 flex items-center gap-1 rounded border border-border bg-input px-1.5 py-0.5 text-[10px] text-foreground cursor-pointer hover:opacity-80",
              children: [switchAllOn ? (0, jsxSkills.jsx)(CheckCheckIcon, {
                className: "h-3 w-3"
              }) : (0, jsxSkills.jsx)(SquareIcon, {
                className: "h-3 w-3"
              }), enabledInRepo, "/", repoSkills.length]
            });
          })(), (0, jsxSkills.jsx)(Button, {
            variant: "ghost",
            size: "icon",
            title: "Refresh",
            disabled: state?.busy,
            onClick: () => onRefresh(repo.key),
            children: (0, jsxSkills.jsx)(RefreshCwIcon, {
              className: "h-3.5 w-3.5"
            })
          }), (0, jsxSkills.jsx)(Button, {
            variant: "ghost",
            size: "icon",
            title: "Unlink",
            onClick: () => onUnlink(repo.key),
            children: (0, jsxSkills.jsx)(Trash2Icon, {
              className: "h-3.5 w-3.5"
            })
          })]
        }), repo.error && (0, jsxSkills.jsxs)("p", {
          className: "m-0 flex items-start gap-1.5 text-[11px] text-destructive",
          children: [(0, jsxSkills.jsx)(TriangleAlertIcon, {
            className: "h-3 w-3 mt-0.5 shrink-0"
          }), repo.error]
        }), skillsOfRepo(repo.key).length === 0 && !repo.error && repo.fetchedAt && (0, jsxSkills.jsxs)("p", {
          className: "m-0 text-[11px] text-muted-foreground",
          children: ["Nothing found \u2014 this repo has no ", (0, jsxSkills.jsx)("code", {
            children: "SKILL.md"
          }), ", no ", (0, jsxSkills.jsx)("code", {
            children: "skills/"
          }), ", ", (0, jsxSkills.jsx)("code", {
            children: "agents/"
          }), " or", " ", (0, jsxSkills.jsx)("code", {
            children: "docs/"
          }), " folder, and no markdown declaring itself with frontmatter."]
        }), skillsOfRepo(repo.key).map(skill => (0, jsxSkills.jsxs)("label", {
          className: "flex items-start gap-2 rounded-md px-1.5 py-1 cursor-pointer hover:opacity-90",
          children: [(0, jsxSkills.jsx)("input", {
            type: "checkbox",
            checked: skill.enabled,
            onChange: checkEvent => onToggle(skill.id, checkEvent.target.checked),
            className: "mt-1 shrink-0"
          }), (0, jsxSkills.jsxs)("span", {
            className: "min-w-0 flex-1",
            children: [(0, jsxSkills.jsxs)("span", {
              className: "block text-xs text-foreground truncate",
              children: [skill.name, skill.origin === "doc" && (0, jsxSkills.jsx)("span", {
                className: "ml-1.5 text-[10px] text-muted-foreground",
                children: "reference"
              }), skill.origin === "agent" && (0, jsxSkills.jsx)("span", {
                className: "ml-1.5 text-[10px] text-muted-foreground",
                children: "agent"
              })]
            }), (0, jsxSkills.jsx)("span", {
              className: "block text-[10px] text-muted-foreground font-mono truncate",
              children: skill.relativePath
            }), (0, jsxSkills.jsx)("span", {
              className: "block text-[11px] text-muted-foreground",
              children: skill.description || "No description in its frontmatter."
            }), skill.resources.length > 0 && (0, jsxSkills.jsxs)("span", {
              className: "block text-[10px] text-muted-foreground font-mono truncate",
              title: skill.resources.join(`
`),
              children: [skill.resources.slice(0, 3).join(", "), skill.resources.length > 3 && ` +${skill.resources.length - 3} more`]
            })]
          }), (0, jsxSkills.jsx)(Button, {
            variant: "ghost",
            size: "icon",
            className: "h-6 w-6 shrink-0",
            title: "Open SKILL.md",
            onClick: clickEvent => {
              clickEvent.preventDefault(), clickEvent.stopPropagation(), onOpen(skill.id);
            },
            children: (0, jsxSkills.jsx)(FileTextIcon, {
              className: "h-3 w-3"
            })
          })]
        }, skill.id))]
      }, repo.key))]
    }), state && (0, jsxSkills.jsxs)("p", {
      className: "m-0 flex items-center gap-1 text-[10px] text-muted-foreground font-mono truncate",
      children: [(0, jsxSkills.jsx)(ExternalLinkIcon, {
        className: "h-3 w-3 shrink-0"
      }), state.root]
    })]
  });
}
// gitHostLabel (minified: HD) — the name of a linked repository's host (GitHub, GitLab, Bitbucket, else its hostname or "git").
function gitHostLabel(repo) {
  return {
    "github.com": "GitHub",
    "gitlab.com": "GitLab",
    "bitbucket.org": "Bitbucket"
  }[repo.hostname?.toLowerCase()] ?? repo.hostname ?? "git";
}
// fetchedAgo (minified: _D) — how long ago a timestamp was ("just now", "5m ago", "3h ago", "2d ago", else the date).
function fetchedAgo(timestamp) {
  let time = new Date(timestamp).getTime();
  if (Number.isNaN(time)) return "unknown";
  let minutes = Math.round((Date.now() - time) / 6e4);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  let hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  let days = Math.round(hours / 24);
  return days <= 7 ? `${days}d ago` : new Date(timestamp).toLocaleDateString();
}
// jsxAiTabs (minified: Le) — jsx runtime for the AI page tabs.
var jsxAiTabs = G(oe());
// AiTabsView (minified: lk) — the AI page: Chat and Skills tabs. Chat has an instance picker (favourites first) and the AgentChatPanel for the chosen instance (remounted per instance), or a list of instances to choose from; Skills shows SkillsView. Its callbacks are wired to host messages by the root App.
function AiTabsView({
  tab: tab,
  onTab: onTab,
  instances: instances,
  instanceId: instanceId,
  onSelectInstance: onSelectInstance,
  onOpenInEditor: onOpenInEditor,
  chatTransport: chatTransport,
  skills: skills,
  skillsResult: skillsResult,
  onBack: onBack,
  onLink: onLink,
  onRefresh: onRefresh,
  onUnlink: onUnlink,
  onToggle: onToggle,
  onToggleAll: onToggleAll,
  onOpen: onOpen
}) {
  let sortedInstances = (0, reactForChatState.useMemo)(() => [...instances.filter(instance => instance.favorite), ...instances.filter(instance => !instance.favorite)], [instances]),
    instanceOptions = (0, reactForChatState.useMemo)(() => sortedInstances.map(instance => ({
      id: instance.id,
      name: `${instance.favorite ? "\u2605 " : ""}${instanceLabel(instance)}`
    })), [sortedInstances]);
  return (0, jsxAiTabs.jsxs)("div", {
    className: "flex flex-col h-screen min-h-0",
    children: [(0, jsxAiTabs.jsxs)("div", {
      className: "shrink-0 flex items-center gap-1 px-2 pt-2",
      children: [onBack && (0, jsxAiTabs.jsx)(Button, {
        variant: "ghost",
        size: "icon",
        onClick: onBack,
        title: "Back",
        children: (0, jsxAiTabs.jsx)(ArrowLeftIcon, {
          className: "h-4 w-4"
        })
      }), (0, jsxAiTabs.jsx)("div", {
        className: "flex items-center gap-1",
        children: [["chat", "Chat", MessageSquareIcon], ["skills", "Skills", SparklesIcon]].map(([tabId, tabLabel, TabIcon]) => (0, jsxAiTabs.jsxs)("button", {
          type: "button",
          onClick: () => onTab(tabId),
          className: classNames("flex items-center gap-1 rounded-md px-2 py-1 text-xs cursor-pointer", tab === tabId ? "bg-input text-foreground border border-border" : "text-muted-foreground hover:text-foreground"),
          children: [(0, jsxAiTabs.jsx)(TabIcon, {
            className: "h-3.5 w-3.5"
          }), tabLabel]
        }, tabId))
      }), tab === "chat" && instances.length > 0 && (0, jsxAiTabs.jsxs)("label", {
        className: "ml-3 flex items-center gap-1.5 text-xs text-muted-foreground",
        children: [(0, jsxAiTabs.jsx)(ServerIcon, {
          className: "h-3.5 w-3.5"
        }), (0, jsxAiTabs.jsx)("span", {
          className: "sr-only",
          children: "Instance"
        }), (0, jsxAiTabs.jsxs)("select", {
          value: instanceId ?? "",
          onChange: changeEvent => {
            changeEvent.target.value && onSelectInstance(changeEvent.target.value);
          },
          title: "Which Saturn instance this conversation is about",
          className: "h-7 max-w-[16rem] rounded-md border border-border bg-input text-foreground px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring",
          children: [!instanceId && (0, jsxAiTabs.jsx)("option", {
            value: "",
            children: "Choose an instance\u2026"
          }), instanceOptions.map(option => (0, jsxAiTabs.jsx)("option", {
            value: option.id,
            children: option.name
          }, option.id))]
        })]
      }), (0, jsxAiTabs.jsx)("span", {
        className: "flex-1"
      }), tab === "chat" && onOpenInEditor && (0, jsxAiTabs.jsx)(Button, {
        variant: "ghost",
        size: "icon",
        title: "Open this conversation in an editor tab",
        disabled: !instanceId,
        onClick: onOpenInEditor,
        children: (0, jsxAiTabs.jsx)(SquareArrowOutUpRightIcon, {
          className: "h-4 w-4"
        })
      })]
    }), tab === "chat" ? instances.length === 0 ? (0, jsxAiTabs.jsx)("p", {
      className: "m-0 p-3 text-xs text-muted-foreground",
      children: "Connect a Saturn instance first \u2014 the chat is about an instance, and it needs one to read."
    }) : instanceId ? (0, jsxAiTabs.jsx)(AgentChatPanel, {
      compact: !0,
      transport: chatTransport,
      instanceShownElsewhere: !0
    }, instanceId ?? "none") : (0, jsxAiTabs.jsxs)("div", {
      className: "flex-1 min-h-0 overflow-y-auto p-6",
      children: [(0, jsxAiTabs.jsx)("p", {
        className: "m-0 text-sm text-foreground",
        children: "Choose an instance to chat about."
      }), (0, jsxAiTabs.jsx)("p", {
        className: "m-0 mt-1 text-xs text-muted-foreground",
        children: "Each instance has its own conversations, tasks and history."
      }), (0, jsxAiTabs.jsx)("div", {
        className: "mt-4 flex flex-col gap-2 max-w-md",
        children: sortedInstances.map(instance => (0, jsxAiTabs.jsxs)("button", {
          type: "button",
          onClick: () => onSelectInstance(instance.id),
          className: "flex items-center gap-2 rounded-md border border-border bg-transparent px-3 py-2 text-left cursor-pointer hover:bg-input",
          children: [(0, jsxAiTabs.jsx)(ServerIcon, {
            className: "h-4 w-4 shrink-0 text-muted-foreground"
          }), (0, jsxAiTabs.jsxs)("span", {
            className: "min-w-0",
            children: [(0, jsxAiTabs.jsx)("span", {
              className: "block text-sm text-foreground truncate",
              children: instanceLabel(instance)
            }), (0, jsxAiTabs.jsx)("span", {
              className: "block text-xs text-muted-foreground truncate",
              children: instance.url
            })]
          })]
        }, instance.id))
      })]
    }) : (0, jsxAiTabs.jsx)("div", {
      className: "flex-1 min-h-0 overflow-y-auto",
      children: (0, jsxAiTabs.jsx)(SkillsView, {
        state: skills,
        result: skillsResult,
        embedded: !0,
        onBack: onBack ?? (() => {}),
        onLink: onLink,
        onRefresh: onRefresh,
        onUnlink: onUnlink,
        onToggle: onToggle,
        onToggleAll: onToggleAll,
        onOpen: onOpen
      })
    })]
  });
}
// jsxSidebarApp (minified: iu) — jsx runtime for the root App.
// vscodeApi (minified: Ee): the webview's VS Code API handle.
// sidebarPage (minified: ou): "ai" when this webview is the AI page (body data-page="ai"), else "sidebar".
var jsxSidebarApp = G(oe()),
  vscodeApi = acquireVsCodeApi(),
  sidebarPage = document.body.dataset.page === "ai" ? "ai" : "sidebar";
// SidebarApp (minified: ok) — root of the sidebar webview (and of the AI page): login form until signed in, then the home screen (instances, Workflows / Menus / Pages / chat entries) or, on the "skills" view, AiTabsView. Relays agent chat messages between AgentChatPanel and the host ("chat:webview" out, "chat:host" in, only for the selected instance).
function SidebarApp() {
  let [user, setUser] = (0, ReactForApp.useState)(null),
    [loginError, setLoginError] = (0, ReactForApp.useState)(""),
    [loggingIn, setLoggingIn] = (0, ReactForApp.useState)(!1),
    [view, setView] = (0, ReactForApp.useState)(sidebarPage === "ai" ? "skills" : "home"),
    [instances, setInstances] = (0, ReactForApp.useState)([]),
    [addError, setAddError] = (0, ReactForApp.useState)(""),
    [adding, setAdding] = (0, ReactForApp.useState)(!1),
    [addFormOpen, setAddFormOpen] = (0, ReactForApp.useState)(!1),
    [aiTab, setAiTab] = (0, ReactForApp.useState)("chat"),
    [chatInstanceId, setChatInstanceId] = (0, ReactForApp.useState)(null),
    chatInstanceRef = (0, ReactForApp.useRef)(null);
  // Keeps the selected chat instance readable from the message listener without re-subscribing.
  (0, ReactForApp.useEffect)(() => {
    chatInstanceRef.current = chatInstanceId;
  }, [chatInstanceId]);
  // chatTransport is the transport AgentChatPanel uses: post wraps a message as "chat:webview"; subscribe registers a listener for "chat:host" messages.
  let [skillsState, setSkillsState] = (0, ReactForApp.useState)(null),
    [skillsResult, setSkillsResult] = (0, ReactForApp.useState)(null),
    chatListenersRef = (0, ReactForApp.useRef)(new Set()),
    chatTransport = (0, ReactForApp.useMemo)(() => ({
      post: chatMessage => vscodeApi.postMessage({
        type: "chat:webview",
        message: chatMessage
      }),
      subscribe: listener => (chatListenersRef.current.add(listener), () => {
        chatListenersRef.current.delete(listener);
      })
    }), []);
  (0, ReactForApp.useEffect)(() => {
    let onMessage = messageEvent => {
      let message = messageEvent.data;
      // Agent chat traffic: dropped if it is about another instance than the one selected.
      if (message?.type === "chat:host") {
        if (chatInstanceRef.current && message.instanceId !== chatInstanceRef.current) return;
        for (let listener of chatListenersRef.current) listener(message.message);
        return;
      }
      // The host chose the chat instance (e.g. opened from an instance's chat entry).
      if (message?.type === "chat:instance") {
        setChatInstanceId(message.payload?.instanceId ?? null);
        return;
      }
      switch (message.type) {
        // Signed in to Sonover.
        case "loginSuccess":
          setUser(message.payload.user), setLoggingIn(!1), setLoginError("");
          break;
        // Sign-in failed.
        case "loginError":
          setLoginError(message.payload?.message ?? "Login failed"), setLoggingIn(!1);
          break;
        // Signed out: back to the start view, no instances.
        case "loggedOut":
          setUser(null), setView(sidebarPage === "ai" ? "skills" : "home"), setInstances([]);
          break;
        // The saved Saturn instances.
        case "saturn:list":
          setInstances(message.payload.instances);
          break;
        // An instance was added: close the add form.
        case "saturn:addSuccess":
          setInstances(message.payload.instances), setAdding(!1), setAddError(""), setAddFormOpen(!1);
          break;
        // Adding an instance failed.
        case "saturn:addError":
          setAddError(message.payload?.message ?? "Failed to connect"), setAdding(!1);
          break;
        // The host asks to show the add-instance form (e.g. from a view command).
        case "saturn:showAddForm":
          setAddError(""), setAddFormOpen(!0), setView("home");
          break;
        // Linked skill repositories and skills.
        case "skills:state":
          setSkillsState(message.payload);
          break;
        // Result of the last skills action (link / refresh / …).
        case "skills:result":
          setSkillsResult(message.payload);
          break;
      }
    };
    // Listens for host messages and asks the host whether the user is signed in.
    return window.addEventListener("message", onMessage), vscodeApi.postMessage({
      type: "checkAuth"
    }), () => window.removeEventListener("message", onMessage);
  }, []), (0, ReactForApp.useEffect)(() => {
    // Loads what the current view needs: instances on home; skills, instances and the chat attachment on the skills view.
    view === "home" && user && vscodeApi.postMessage({
      type: "saturn:list"
    }), view === "skills" && user && (vscodeApi.postMessage({
      type: "skills:list"
    }), vscodeApi.postMessage({
      type: "saturn:list"
    }), vscodeApi.postMessage({
      type: "chat:attach"
    }));
  }, [view, user]);
  let login = (email, password) => {
      if (!email || !password) {
        setLoginError("Please fill in all fields");
        return;
      }
      setLoggingIn(!0), setLoginError(""), vscodeApi.postMessage({
        type: "login",
        payload: {
          email: email,
          password: password
        }
      });
    },
    navigate = target => {
      // Tickets open the kanban panel; Skills open the AI page.
      if (target === "kanban") {
        vscodeApi.postMessage({
          type: "openKanban"
        });
        return;
      }
      target === "skills" && vscodeApi.postMessage({
        type: "openAiPage"
      });
    },
    logout = () => {
      vscodeApi.postMessage({
        type: "logout"
      });
    },
    addInstance = form => {
      // Needs a URL and an API key, or a URL, email and password.
      if (form.method === "apiKey" ? !form.url || !form.apiKey : !form.url || !form.email || !form.password) {
        setAddError("Please fill in all fields");
        return;
      }
      setAdding(!0), setAddError(""), vscodeApi.postMessage({
        type: "saturn:add",
        payload: form
      });
    },
    openInstance = instance => {
      vscodeApi.postMessage({
        type: "saturn:open",
        payload: {
          instanceId: instance.id
        }
      });
    },
    openWorkflows = instance => {
      vscodeApi.postMessage({
        type: "saturn:openWorkflows",
        payload: {
          instanceId: instance.id
        }
      });
    },
    openAgentChat = instance => {
      vscodeApi.postMessage({
        type: "saturn:openAgentChat",
        payload: {
          instanceId: instance.id
        }
      });
    },
    removeInstance = instance => {
      vscodeApi.postMessage({
        type: "saturn:remove",
        payload: {
          instanceId: instance.id
        }
      });
    };
  if (!user) return (0, jsxSidebarApp.jsx)(LoginForm, {
    onLogin: login,
    error: loginError,
    loading: loggingIn
  });
  if (view === "skills") {
    let aiView = (0, jsxSidebarApp.jsx)(AiTabsView, {
      tab: aiTab,
      onTab: setAiTab,
      instances: instances,
      instanceId: chatInstanceId,
      onSelectInstance: selectedId => {
        chatInstanceRef.current = selectedId, setChatInstanceId(selectedId), vscodeApi.postMessage({
          type: "chat:selectInstance",
          payload: {
            instanceId: selectedId
          }
        });
      },
      onOpenInEditor: sidebarPage === "ai" ? void 0 : () => vscodeApi.postMessage({
        type: "saturn:openAgentChat",
        payload: {
          instanceId: chatInstanceId
        }
      }),
      chatTransport: chatTransport,
      skills: skillsState,
      skillsResult: skillsResult,
      onBack: sidebarPage === "ai" ? void 0 : () => {
        setSkillsResult(null), setView("home");
      },
      onLink: source => {
        setSkillsResult(null), vscodeApi.postMessage({
          type: "skills:link",
          payload: {
            source: source
          }
        });
      },
      onRefresh: repoKey => {
        setSkillsResult(null), vscodeApi.postMessage({
          type: "skills:refresh",
          payload: {
            key: repoKey
          }
        });
      },
      onUnlink: repoKey => vscodeApi.postMessage({
        type: "skills:unlink",
        payload: {
          key: repoKey
        }
      }),
      onToggle: (skillId, enabled) => {
        // Switched at once in the view; the host saves it.
        setSkillsState(prev => prev && {
          ...prev,
          skills: prev.skills.map(skill => skill.id === skillId ? {
            ...skill,
            enabled: enabled
          } : skill)
        }), vscodeApi.postMessage({
          type: "skills:toggle",
          payload: {
            skillId: skillId,
            enabled: enabled
          }
        });
      },
      onToggleAll: (repoKey, enabled) => {
        setSkillsState(prev => prev && {
          ...prev,
          skills: prev.skills.map(skill => skill.repoKey === repoKey ? {
            ...skill,
            enabled: enabled
          } : skill)
        }), vscodeApi.postMessage({
          type: "skills:toggleAll",
          payload: {
            key: repoKey,
            enabled: enabled
          }
        });
      },
      onOpen: skillId => vscodeApi.postMessage({
        type: "skills:open",
        payload: {
          skillId: skillId
        }
      })
    });
    return sidebarPage === "ai" ? (0, jsxSidebarApp.jsx)("div", {
      className: "w-full",
      children: aiView
    }) : aiView;
  }
  return (0, jsxSidebarApp.jsx)(AccountView, {
    user: user,
    onNavigate: navigate,
    onLogout: logout,
    saturn: {
      instances: instances,
      loading: adding,
      error: addError,
      addingNew: addFormOpen,
      onAddInstance: addInstance,
      onOpenInstance: openInstance,
      onOpenWorkflows: openWorkflows,
      onOpenMenus: instance => vscodeApi.postMessage({
        type: "saturn:openMenus",
        payload: {
          instanceId: instance.id
        }
      }),
      onOpenPages: instance => vscodeApi.postMessage({
        type: "saturn:openPages",
        payload: {
          instanceId: instance.id
        }
      }),
      onOpenChat: openAgentChat,
      onRemoveInstance: removeInstance,
      onSetFavorite: (instance, favorite) => vscodeApi.postMessage({
        type: "saturn:setFavorite",
        payload: {
          instanceId: instance.id,
          favorite: favorite
        }
      }),
      onSetDisplayName: (instance, displayName) => vscodeApi.postMessage({
        type: "saturn:setDisplayName",
        payload: {
          instanceId: instance.id,
          displayName: displayName
        }
      }),
      onStartAdd: () => {
        setAddError(""), setAddFormOpen(!0);
      },
      onCancelAdd: () => {
        setAddError(""), setAddFormOpen(!1);
      }
    }
  });
}
// jsxMount (minified: uk) — jsx runtime for mounting the app.
var jsxMount = G(oe());
// Mounts SidebarApp into #root.
(0, ReactDOMClient.createRoot)(document.getElementById("root")).render((0, jsxMount.jsx)(SidebarApp, {}));
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
lucide-react/dist/esm/icons/arrow-up.mjs:
lucide-react/dist/esm/icons/brain.mjs:
lucide-react/dist/esm/icons/check-check.mjs:
lucide-react/dist/esm/icons/check.mjs:
lucide-react/dist/esm/icons/chevron-down.mjs:
lucide-react/dist/esm/icons/chevron-right.mjs:
lucide-react/dist/esm/icons/circle-check.mjs:
lucide-react/dist/esm/icons/circle-dashed.mjs:
lucide-react/dist/esm/icons/circle-x.mjs:
lucide-react/dist/esm/icons/copy.mjs:
lucide-react/dist/esm/icons/external-link.mjs:
lucide-react/dist/esm/icons/file-code-corner.mjs:
lucide-react/dist/esm/icons/file-text.mjs:
lucide-react/dist/esm/icons/folder-git-2.mjs:
lucide-react/dist/esm/icons/folder-open.mjs:
lucide-react/dist/esm/icons/git-merge.mjs:
lucide-react/dist/esm/icons/image.mjs:
lucide-react/dist/esm/icons/info.mjs:
lucide-react/dist/esm/icons/list-tree.mjs:
lucide-react/dist/esm/icons/log-out.mjs:
lucide-react/dist/esm/icons/message-square-plus.mjs:
lucide-react/dist/esm/icons/message-square.mjs:
lucide-react/dist/esm/icons/panel-left.mjs:
lucide-react/dist/esm/icons/pencil.mjs:
lucide-react/dist/esm/icons/play.mjs:
lucide-react/dist/esm/icons/plus.mjs:
lucide-react/dist/esm/icons/refresh-cw.mjs:
lucide-react/dist/esm/icons/rotate-ccw-clock.mjs:
lucide-react/dist/esm/icons/settings-2.mjs:
lucide-react/dist/esm/icons/server.mjs:
lucide-react/dist/esm/icons/shield-question-mark.mjs:
lucide-react/dist/esm/icons/sparkles.mjs:
lucide-react/dist/esm/icons/square-arrow-out-up-right.mjs:
lucide-react/dist/esm/icons/square.mjs:
lucide-react/dist/esm/icons/star.mjs:
lucide-react/dist/esm/icons/terminal.mjs:
lucide-react/dist/esm/icons/ticket.mjs:
lucide-react/dist/esm/icons/trash-2.mjs:
lucide-react/dist/esm/icons/triangle-alert.mjs:
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
