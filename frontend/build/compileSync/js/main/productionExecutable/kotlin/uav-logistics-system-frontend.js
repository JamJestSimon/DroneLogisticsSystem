(function (factory) {
  if (typeof define === 'function' && define.amd)
    define(['exports', './kotlin-kotlin-stdlib.js', './kotlinx-coroutines-core.js'], factory);
  else if (typeof exports === 'object')
    factory(module.exports, require('./kotlin-kotlin-stdlib.js'), require('./kotlinx-coroutines-core.js'));
  else {
    if (typeof globalThis['kotlin-kotlin-stdlib'] === 'undefined') {
      throw new Error("Error loading module 'pl.edu.wat.uavlogistics:frontend'. Its dependency 'kotlin-kotlin-stdlib' was not found. Please, check whether 'kotlin-kotlin-stdlib' is loaded prior to 'pl.edu.wat.uavlogistics:frontend'.");
    }
    if (typeof globalThis['kotlinx-coroutines-core'] === 'undefined') {
      throw new Error("Error loading module 'pl.edu.wat.uavlogistics:frontend'. Its dependency 'kotlinx-coroutines-core' was not found. Please, check whether 'kotlinx-coroutines-core' is loaded prior to 'pl.edu.wat.uavlogistics:frontend'.");
    }
    globalThis['pl.edu.wat.uavlogistics:frontend'] = factory(typeof globalThis['pl.edu.wat.uavlogistics:frontend'] === 'undefined' ? {} : globalThis['pl.edu.wat.uavlogistics:frontend'], globalThis['kotlin-kotlin-stdlib'], globalThis['kotlinx-coroutines-core']);
  }
}(function (_, kotlin_kotlin, kotlin_org_jetbrains_kotlinx_kotlinx_coroutines_core) {
  'use strict';
  //region block: imports
  var hypot = Math.hypot;
  var imul = Math.imul;
  var log10 = Math.log10;
  var THROW_CCE = kotlin_kotlin.$_$.z3;
  var CoroutineImpl = kotlin_kotlin.$_$.g2;
  var Unit_instance = kotlin_kotlin.$_$.d1;
  var _Char___init__impl__6a9atx = kotlin_kotlin.$_$.u;
  var charArrayOf = kotlin_kotlin.$_$.l2;
  var trimEnd = kotlin_kotlin.$_$.s3;
  var await_0 = kotlin_org_jetbrains_kotlinx_kotlinx_coroutines_core.$_$.a;
  var get_COROUTINE_SUSPENDED = kotlin_kotlin.$_$.r1;
  var toString = kotlin_kotlin.$_$.g3;
  var IllegalStateException_init_$Create$ = kotlin_kotlin.$_$.n;
  var protoOf = kotlin_kotlin.$_$.f3;
  var initMetadataForCoroutine = kotlin_kotlin.$_$.v2;
  var VOID = kotlin_kotlin.$_$.b;
  var Companion_instance = kotlin_kotlin.$_$.c1;
  var _Result___init__impl__xyqfz8 = kotlin_kotlin.$_$.w;
  var createFailure = kotlin_kotlin.$_$.c4;
  var Result__exceptionOrNull_impl_p6xea9 = kotlin_kotlin.$_$.x;
  var _Result___get_value__impl__bjfvqg = kotlin_kotlin.$_$.z;
  var initMetadataForObject = kotlin_kotlin.$_$.y2;
  var listOf = kotlin_kotlin.$_$.n1;
  var numberToInt = kotlin_kotlin.$_$.d3;
  var toDoubleOrNull = kotlin_kotlin.$_$.p3;
  var CoroutineScope = kotlin_org_jetbrains_kotlinx_kotlinx_coroutines_core.$_$.e;
  var isInterface = kotlin_kotlin.$_$.a3;
  var initMetadataForLambda = kotlin_kotlin.$_$.x2;
  var launch = kotlin_org_jetbrains_kotlinx_kotlinx_coroutines_core.$_$.g;
  var initMetadataForClass = kotlin_kotlin.$_$.u2;
  var throwUninitializedPropertyAccessException = kotlin_kotlin.$_$.g4;
  var charSequenceLength = kotlin_kotlin.$_$.n2;
  var charSequenceGet = kotlin_kotlin.$_$.m2;
  var toString_0 = kotlin_kotlin.$_$.v;
  var ensureNotNull = kotlin_kotlin.$_$.d4;
  var equals = kotlin_kotlin.$_$.p2;
  var checkIndexOverflow = kotlin_kotlin.$_$.h1;
  var Long = kotlin_kotlin.$_$.x3;
  var delay = kotlin_org_jetbrains_kotlinx_kotlinx_coroutines_core.$_$.b;
  var _Result___get_isSuccess__impl__sndoy8 = kotlin_kotlin.$_$.y;
  var isBlank = kotlin_kotlin.$_$.l3;
  var emptyList = kotlin_kotlin.$_$.j1;
  var SupervisorJob = kotlin_org_jetbrains_kotlinx_kotlinx_coroutines_core.$_$.f;
  var Dispatchers_getInstance = kotlin_org_jetbrains_kotlinx_kotlinx_coroutines_core.$_$.c;
  var CoroutineScope_0 = kotlin_org_jetbrains_kotlinx_kotlinx_coroutines_core.$_$.d;
  var LinkedHashMap_init_$Create$ = kotlin_kotlin.$_$.g;
  var ArrayList_init_$Create$ = kotlin_kotlin.$_$.e;
  var to = kotlin_kotlin.$_$.i4;
  var coerceIn = kotlin_kotlin.$_$.i3;
  var filterNotNull = kotlin_kotlin.$_$.k1;
  var NoSuchElementException_init_$Create$ = kotlin_kotlin.$_$.p;
  var equals_0 = kotlin_kotlin.$_$.k3;
  var StringBuilder_init_$Create$ = kotlin_kotlin.$_$.k;
  var isFinite = kotlin_kotlin.$_$.e4;
  var isCharSequence = kotlin_kotlin.$_$.z2;
  var trim = kotlin_kotlin.$_$.t3;
  var noWhenBranchMatchedException = kotlin_kotlin.$_$.f4;
  var compareTo = kotlin_kotlin.$_$.o2;
  var split = kotlin_kotlin.$_$.m3;
  var getStringHashCode = kotlin_kotlin.$_$.s2;
  var isNumber = kotlin_kotlin.$_$.b3;
  var numberToDouble = kotlin_kotlin.$_$.c3;
  var coerceAtLeast = kotlin_kotlin.$_$.h3;
  var enumEntries = kotlin_kotlin.$_$.i2;
  var Enum = kotlin_kotlin.$_$.u3;
  var getNumberHashCode = kotlin_kotlin.$_$.r2;
  var take = kotlin_kotlin.$_$.o3;
  var takeLast = kotlin_kotlin.$_$.n3;
  var listOf_0 = kotlin_kotlin.$_$.m1;
  var get_indices = kotlin_kotlin.$_$.l1;
  var collectionSizeOrDefault = kotlin_kotlin.$_$.i1;
  var ArrayList_init_$Create$_0 = kotlin_kotlin.$_$.d;
  var setOf = kotlin_kotlin.$_$.p1;
  var IllegalArgumentException_init_$Create$ = kotlin_kotlin.$_$.m;
  var toDouble = kotlin_kotlin.$_$.q3;
  var toInt = kotlin_kotlin.$_$.r3;
  var getBooleanHashCode = kotlin_kotlin.$_$.q2;
  var numberToLong = kotlin_kotlin.$_$.e3;
  //endregion
  //region block: pre-declaration
  initMetadataForCoroutine($requestCOROUTINE$0, CoroutineImpl);
  initMetadataForObject(ApiClient, 'ApiClient', VOID, VOID, VOID, [5]);
  initMetadataForLambda(DomAgentSettings$lambda$slambda, CoroutineImpl, VOID, [1]);
  initMetadataForCoroutine($applyToFleetCOROUTINE$1, CoroutineImpl);
  initMetadataForClass(DomAgentSettings, 'DomAgentSettings', VOID, VOID, VOID, [0]);
  initMetadataForLambda(DomApp$buildHistoryPage$lambda$slambda$lambda$slambda, CoroutineImpl, VOID, [1]);
  initMetadataForLambda(DomApp$mount$lambda$slambda, CoroutineImpl, VOID, [1]);
  initMetadataForLambda(DomApp$mount$lambda$slambda_1, CoroutineImpl, VOID, [1]);
  initMetadataForLambda(DomApp$mount$lambda$slambda_3, CoroutineImpl, VOID, [1]);
  initMetadataForLambda(DomApp$mount$lambda$slambda_5, CoroutineImpl, VOID, [1]);
  initMetadataForLambda(DomApp$mount$slambda, CoroutineImpl, VOID, [1]);
  initMetadataForLambda(DomApp$buildMapPage$lambda$slambda, CoroutineImpl, VOID, [1]);
  initMetadataForLambda(DomApp$buildHistoryPage$lambda$slambda, CoroutineImpl, VOID, [1]);
  initMetadataForLambda(DomApp$buildHistoryPage$lambda$slambda_1, CoroutineImpl, VOID, [1]);
  initMetadataForLambda(DomApp$renderHistoryArchive$lambda$slambda, CoroutineImpl, VOID, [1]);
  initMetadataForCoroutine($loadHistoryCOROUTINE$2, CoroutineImpl);
  initMetadataForCoroutine($refreshCOROUTINE$3, CoroutineImpl);
  initMetadataForObject(DomApp, 'DomApp', VOID, VOID, VOID, [2, 1]);
  initMetadataForClass(VehicleRangeStyle, 'VehicleRangeStyle');
  initMetadataForClass(DomMapView, 'DomMapView');
  initMetadataForLambda(DomRegisterModal$submit$slambda, CoroutineImpl, VOID, [1]);
  initMetadataForClass(DomRegisterModal, 'DomRegisterModal');
  initMetadataForObject(AgentRangeSettings, 'AgentRangeSettings');
  initMetadataForClass(MapAddMode, 'MapAddMode', VOID, Enum);
  initMetadataForClass(MapPoint, 'MapPoint');
  initMetadataForClass(MapRangePurpose, 'MapRangePurpose', VOID, Enum);
  initMetadataForClass(MapRangeDisc, 'MapRangeDisc');
  initMetadataForClass(MapPointKind, 'MapPointKind', VOID, Enum);
  initMetadataForClass(MapBounds, 'MapBounds');
  initMetadataForClass(GeoCoord, 'GeoCoord');
  initMetadataForCoroutine($submitCOROUTINE$4, CoroutineImpl);
  initMetadataForCoroutine($submitStationCOROUTINE$5, CoroutineImpl);
  initMetadataForCoroutine($submitAgentCOROUTINE$6, CoroutineImpl);
  initMetadataForClass(RegisterOverlayState, 'RegisterOverlayState', VOID, VOID, VOID, [1]);
  //endregion
  function main() {
    var tmp = document.getElementById('root');
    var root = tmp instanceof HTMLElement ? tmp : THROW_CCE();
    DomApp_getInstance().yl(root);
  }
  function mainWrapper() {
    main();
  }
  function $requestCOROUTINE$0(_this__u8e3s4, backendUrl, path, method, body, admin, resultContinuation) {
    CoroutineImpl.call(this, resultContinuation);
    this.hm_1 = _this__u8e3s4;
    this.im_1 = backendUrl;
    this.jm_1 = path;
    this.km_1 = method;
    this.lm_1 = body;
    this.mm_1 = admin;
  }
  protoOf($requestCOROUTINE$0).i6 = function () {
    var suspendResult = this.c6_1;
    $sm: do
      try {
        var tmp = this.a6_1;
        switch (tmp) {
          case 0:
            this.b6_1 = 3;
            this.nm_1 = {};
            this.nm_1['Content-Type'] = 'application/json';
            if (this.mm_1) {
              this.nm_1['X-User-Role'] = 'ADMIN';
            }

            this.om_1 = {};
            this.om_1.method = this.km_1;
            this.om_1.headers = this.nm_1;
            if (!(this.lm_1 == null))
              this.om_1.body = this.lm_1;
            this.a6_1 = 1;
            var tmp_0 = window;
            var tmp_1 = trimEnd(this.im_1, charArrayOf([_Char___init__impl__6a9atx(47)])) + this.jm_1;
            var this_0 = this.om_1;
            suspendResult = await_0(tmp_0.fetch(tmp_1, this_0), this);
            if (suspendResult === get_COROUTINE_SUSPENDED()) {
              return suspendResult;
            }

            continue $sm;
          case 1:
            this.pm_1 = suspendResult;
            this.a6_1 = 2;
            suspendResult = await_0(this.pm_1.text(), this);
            if (suspendResult === get_COROUTINE_SUSPENDED()) {
              return suspendResult;
            }

            continue $sm;
          case 2:
            var text = suspendResult;
            if (!this.pm_1.ok) {
              var message = 'HTTP ' + this.pm_1.status + ': ' + text;
              throw IllegalStateException_init_$Create$(toString(message));
            }

            return text;
          case 3:
            throw this.d6_1;
        }
      } catch ($p) {
        var e = $p;
        if (this.b6_1 === 3) {
          throw e;
        } else {
          this.a6_1 = this.b6_1;
          this.d6_1 = e;
        }
      }
     while (true);
  };
  function ApiClient() {
  }
  protoOf(ApiClient).qm = function (backendUrl, path, method, body, admin, $completion) {
    var tmp = new $requestCOROUTINE$0(this, backendUrl, path, method, body, admin, $completion);
    tmp.c6_1 = Unit_instance;
    tmp.d6_1 = null;
    return tmp.i6();
  };
  protoOf(ApiClient).rm = function (backendUrl, path, method, body, admin, $completion, $super) {
    method = method === VOID ? 'GET' : method;
    body = body === VOID ? null : body;
    admin = admin === VOID ? false : admin;
    return $super === VOID ? this.qm(backendUrl, path, method, body, admin, $completion) : $super.qm.call(this, backendUrl, path, method, body, admin, $completion);
  };
  protoOf(ApiClient).sm = function (json) {
    // Inline function 'kotlin.getOrElse' call
    // Inline function 'kotlin.runCatching' call
    var tmp;
    try {
      // Inline function 'kotlin.Companion.success' call
      // Inline function 'pl.edu.wat.uavlogistics.frontend.api.ApiClient.pretty.<anonymous>' call
      var value = JSON.stringify(JSON.parse(json), null, 2);
      tmp = _Result___init__impl__xyqfz8(value);
    } catch ($p) {
      var tmp_0;
      if ($p instanceof Error) {
        var e = $p;
        // Inline function 'kotlin.Companion.failure' call
        tmp_0 = _Result___init__impl__xyqfz8(createFailure(e));
      } else {
        throw $p;
      }
      tmp = tmp_0;
    }
    var this_0 = tmp;
    // Inline function 'kotlin.contracts.contract' call
    var exception = Result__exceptionOrNull_impl_p6xea9(this_0);
    var tmp_1;
    if (exception == null) {
      var tmp_2 = _Result___get_value__impl__bjfvqg(this_0);
      tmp_1 = (tmp_2 == null ? true : !(tmp_2 == null)) ? tmp_2 : THROW_CCE();
    } else {
      // Inline function 'pl.edu.wat.uavlogistics.frontend.api.ApiClient.pretty.<anonymous>' call
      tmp_1 = json;
    }
    return tmp_1;
  };
  protoOf(ApiClient).tm = function (fields) {
    return JSON.stringify(this.um(fields.slice()));
  };
  protoOf(ApiClient).um = function (fields) {
    var obj = {};
    // Inline function 'kotlin.collections.forEach' call
    var inductionVariable = 0;
    var last = fields.length;
    while (inductionVariable < last) {
      var element = fields[inductionVariable];
      inductionVariable = inductionVariable + 1 | 0;
      // Inline function 'pl.edu.wat.uavlogistics.frontend.api.ApiClient.jsonObject.<anonymous>' call
      var key = element.ua();
      var value = element.va();
      obj[key] = value;
    }
    return obj;
  };
  protoOf(ApiClient).vm = function (value) {
    var tmp = encodeURIComponent(value);
    return (!(tmp == null) ? typeof tmp === 'string' : false) ? tmp : THROW_CCE();
  };
  var ApiClient_instance;
  function ApiClient_getInstance() {
    return ApiClient_instance;
  }
  function refreshFields($this) {
    $this.bn_1.value = uavMaxText($this);
    $this.cn_1.value = ugvMaxText($this);
    $this.dn_1.value = reserveText($this);
  }
  function applyToFleet($this, $completion) {
    var tmp = new $applyToFleetCOROUTINE$1($this, $completion);
    tmp.c6_1 = Unit_instance;
    tmp.d6_1 = null;
    return tmp.i6();
  }
  function renderPreview($this) {
    clearChildren($this.en_1);
    $this.en_1.appendChild(el('h3', 'state-section-title', 'Computed map radii'));
    // Inline function 'kotlin.collections.forEach' call
    var tmp0_iterator = listOf(['UAV', 'UGV']).f();
    while (tmp0_iterator.g()) {
      var element = tmp0_iterator.h();
      // Inline function 'pl.edu.wat.uavlogistics.frontend.dom.DomAgentSettings.renderPreview.<anonymous>' call
      var max = numberToInt(AgentRangeSettings_getInstance().ao(element));
      var travel = numberToInt(AgentRangeSettings_getInstance().bo(element));
      var pickup = numberToInt(AgentRangeSettings_getInstance().co(element));
      var reserve = numberToInt(AgentRangeSettings_getInstance().zn_1);
      $this.en_1.appendChild(el('p', null, element + ' \xB7 max ' + max + ' m \xB7 reserve ' + reserve + '%'));
      $this.en_1.appendChild(el('p', null, '  Inter-station travel (one-way): ' + travel + ' m'));
      $this.en_1.appendChild(el('p', null, '  Package pickup (out & back): ' + pickup + ' m'));
    }
  }
  function uavMaxText($this) {
    return AgentRangeSettings_getInstance().xn_1.toString();
  }
  function ugvMaxText($this) {
    return AgentRangeSettings_getInstance().yn_1.toString();
  }
  function reserveText($this) {
    return AgentRangeSettings_getInstance().zn_1.toString();
  }
  function DomAgentSettings$lambda(this$0) {
    return function (draft) {
      var tmp = AgentRangeSettings_getInstance();
      var tmp0_elvis_lhs = toDoubleOrNull(draft);
      tmp.do(tmp0_elvis_lhs == null ? AgentRangeSettings_getInstance().xn_1 : tmp0_elvis_lhs, AgentRangeSettings_getInstance().yn_1, AgentRangeSettings_getInstance().zn_1);
      renderPreview(this$0);
      return Unit_instance;
    };
  }
  function DomAgentSettings$lambda_0(this$0) {
    return function (draft) {
      var tmp = AgentRangeSettings_getInstance();
      var tmp_0 = AgentRangeSettings_getInstance().xn_1;
      var tmp0_elvis_lhs = toDoubleOrNull(draft);
      tmp.do(tmp_0, tmp0_elvis_lhs == null ? AgentRangeSettings_getInstance().yn_1 : tmp0_elvis_lhs, AgentRangeSettings_getInstance().zn_1);
      renderPreview(this$0);
      return Unit_instance;
    };
  }
  function DomAgentSettings$lambda_1(this$0) {
    return function (draft) {
      var tmp = AgentRangeSettings_getInstance();
      var tmp_0 = AgentRangeSettings_getInstance().xn_1;
      var tmp_1 = AgentRangeSettings_getInstance().yn_1;
      var tmp0_elvis_lhs = toDoubleOrNull(draft);
      tmp.do(tmp_0, tmp_1, tmp0_elvis_lhs == null ? AgentRangeSettings_getInstance().zn_1 : tmp0_elvis_lhs);
      renderPreview(this$0);
      return Unit_instance;
    };
  }
  function DomAgentSettings$lambda$slambda(this$0, resultContinuation) {
    this.mo_1 = this$0;
    CoroutineImpl.call(this, resultContinuation);
  }
  protoOf(DomAgentSettings$lambda$slambda).oo = function ($this$launch, $completion) {
    var tmp = this.po($this$launch, $completion);
    tmp.c6_1 = Unit_instance;
    tmp.d6_1 = null;
    return tmp.i6();
  };
  protoOf(DomAgentSettings$lambda$slambda).s6 = function (p1, $completion) {
    return this.oo((!(p1 == null) ? isInterface(p1, CoroutineScope) : false) ? p1 : THROW_CCE(), $completion);
  };
  protoOf(DomAgentSettings$lambda$slambda).i6 = function () {
    var suspendResult = this.c6_1;
    $sm: do
      try {
        var tmp = this.a6_1;
        switch (tmp) {
          case 0:
            this.b6_1 = 2;
            this.a6_1 = 1;
            suspendResult = applyToFleet(this.mo_1, this);
            if (suspendResult === get_COROUTINE_SUSPENDED()) {
              return suspendResult;
            }

            continue $sm;
          case 1:
            return Unit_instance;
          case 2:
            throw this.d6_1;
        }
      } catch ($p) {
        var e = $p;
        if (this.b6_1 === 2) {
          throw e;
        } else {
          this.a6_1 = this.b6_1;
          this.d6_1 = e;
        }
      }
     while (true);
  };
  protoOf(DomAgentSettings$lambda$slambda).po = function ($this$launch, completion) {
    var i = new DomAgentSettings$lambda$slambda(this.mo_1, completion);
    i.no_1 = $this$launch;
    return i;
  };
  function DomAgentSettings$lambda$slambda_0(this$0, resultContinuation) {
    var i = new DomAgentSettings$lambda$slambda(this$0, resultContinuation);
    var l = function ($this$launch, $completion) {
      return i.oo($this$launch, $completion);
    };
    l.$arity = 1;
    return l;
  }
  function DomAgentSettings$lambda_2(this$0) {
    return function () {
      launch(this$0.wm_1, VOID, VOID, DomAgentSettings$lambda$slambda_0(this$0, null));
      return Unit_instance;
    };
  }
  function DomAgentSettings$lambda_3(this$0) {
    return function () {
      AgentRangeSettings_getInstance().qo(650.0, 600.0, 15.0, true);
      refreshFields(this$0);
      renderPreview(this$0);
      return Unit_instance;
    };
  }
  function $applyToFleetCOROUTINE$1(_this__u8e3s4, resultContinuation) {
    CoroutineImpl.call(this, resultContinuation);
    this.nn_1 = _this__u8e3s4;
  }
  protoOf($applyToFleetCOROUTINE$1).i6 = function () {
    var suspendResult = this.c6_1;
    $sm: do
      try {
        var tmp = this.a6_1;
        switch (tmp) {
          case 0:
            this.b6_1 = 4;
            var tmp_0 = AgentRangeSettings_getInstance();
            var tmp0_elvis_lhs = toDoubleOrNull(this.nn_1.bn_1.value);
            var tmp_1 = tmp0_elvis_lhs == null ? AgentRangeSettings_getInstance().xn_1 : tmp0_elvis_lhs;
            var tmp1_elvis_lhs = toDoubleOrNull(this.nn_1.cn_1.value);
            var tmp_2 = tmp1_elvis_lhs == null ? AgentRangeSettings_getInstance().yn_1 : tmp1_elvis_lhs;
            var tmp2_elvis_lhs = toDoubleOrNull(this.nn_1.dn_1.value);
            tmp_0.qo(tmp_1, tmp_2, tmp2_elvis_lhs == null ? AgentRangeSettings_getInstance().zn_1 : tmp2_elvis_lhs, true);
            var tmp_3 = this;
            tmp_3.on_1 = this.nn_1;
            this.b6_1 = 2;
            var tmp_4 = this;
            tmp_4.qn_1 = Companion_instance;
            var tmp_5 = this;
            tmp_5.rn_1 = this.on_1;
            this.a6_1 = 1;
            suspendResult = ApiClient_instance.rm(this.rn_1.xm_1(), '/api/settings/fleet-range', 'PUT', AgentRangeSettings_getInstance().ro(), VOID, this);
            if (suspendResult === get_COROUTINE_SUSPENDED()) {
              return suspendResult;
            }

            continue $sm;
          case 1:
            var response = suspendResult;
            this.rn_1.ym_1('Fleet range updated.\n\n' + ApiClient_instance.sm(response));
            var value = this.rn_1.zm_1();
            this.pn_1 = _Result___init__impl__xyqfz8(value);
            this.b6_1 = 4;
            this.a6_1 = 3;
            continue $sm;
          case 2:
            this.b6_1 = 4;
            var tmp_6 = this.d6_1;
            if (tmp_6 instanceof Error) {
              var e = this.d6_1;
              var tmp_7 = this;
              tmp_7.pn_1 = _Result___init__impl__xyqfz8(createFailure(e));
              this.a6_1 = 3;
              continue $sm;
            } else {
              throw this.d6_1;
            }

          case 3:
            this.b6_1 = 4;
            var this_0 = this.pn_1;
            var tmp0_safe_receiver = Result__exceptionOrNull_impl_p6xea9(this_0);
            if (tmp0_safe_receiver == null)
              null;
            else {
              this.nn_1.ym_1('ERROR: ' + failureMessage(tmp0_safe_receiver));
            }

            return Unit_instance;
          case 4:
            throw this.d6_1;
        }
      } catch ($p) {
        var e_0 = $p;
        if (this.b6_1 === 4) {
          throw e_0;
        } else {
          this.a6_1 = this.b6_1;
          this.d6_1 = e_0;
        }
      }
     while (true);
  };
  function DomAgentSettings(scope, backendUrl, onLog, onApplied) {
    this.wm_1 = scope;
    this.xm_1 = backendUrl;
    this.ym_1 = onLog;
    this.zm_1 = onApplied;
    this.an_1 = el('div', 'settings-page');
    this.en_1 = el('div', 'settings-preview');
    var panel = el('section', 'panel settings-form');
    panel.appendChild(el('h2', null, 'Agent range settings'));
    panel.appendChild(el('p', 'hint', 'Global max range per vehicle class. Map shows two radii per class at each station: inter-station travel (one-way + reserve) and package pickup (out & back + reserve, \xF72). UGV paths use factor 1.35. Apply updates every registered agent in the backend.'));
    var tmp = uavMaxText(this);
    var _destruct__k2r9zo = labeledInput('UAV max range (m)', tmp, 'number', DomAgentSettings$lambda(this));
    var uavLabel = _destruct__k2r9zo.ua();
    var uavField = _destruct__k2r9zo.va();
    this.bn_1 = uavField;
    panel.appendChild(uavLabel);
    panel.appendChild(this.bn_1);
    var tmp_0 = ugvMaxText(this);
    var _destruct__k2r9zo_0 = labeledInput('UGV max range (m)', tmp_0, 'number', DomAgentSettings$lambda_0(this));
    var ugvLabel = _destruct__k2r9zo_0.ua();
    var ugvField = _destruct__k2r9zo_0.va();
    this.cn_1 = ugvField;
    panel.appendChild(ugvLabel);
    panel.appendChild(this.cn_1);
    var tmp_1 = reserveText(this);
    var _destruct__k2r9zo_1 = labeledInput('Route energy reserve (%)', tmp_1, 'number', DomAgentSettings$lambda_1(this));
    var reserveLabel = _destruct__k2r9zo_1.ua();
    var reserveField = _destruct__k2r9zo_1.va();
    this.dn_1 = reserveField;
    panel.appendChild(reserveLabel);
    panel.appendChild(this.dn_1);
    panel.appendChild(this.en_1);
    renderPreview(this);
    var actions = el('div', 'settings-actions');
    actions.appendChild(button('Apply to fleet', VOID, DomAgentSettings$lambda_2(this)));
    actions.appendChild(button('Reset defaults', 'secondary', DomAgentSettings$lambda_3(this)));
    panel.appendChild(actions);
    this.an_1.appendChild(panel);
  }
  protoOf(DomAgentSettings).so = function () {
    return this.an_1;
  };
  protoOf(DomAgentSettings).to = function () {
    refreshFields(this);
    renderPreview(this);
  };
  function DomApp$buildHistoryPage$lambda$slambda$lambda$slambda($id, $timelineHost, resultContinuation) {
    this.cp_1 = $id;
    this.dp_1 = $timelineHost;
    CoroutineImpl.call(this, resultContinuation);
  }
  protoOf(DomApp$buildHistoryPage$lambda$slambda$lambda$slambda).oo = function ($this$launch, $completion) {
    var tmp = this.po($this$launch, $completion);
    tmp.c6_1 = Unit_instance;
    tmp.d6_1 = null;
    return tmp.i6();
  };
  protoOf(DomApp$buildHistoryPage$lambda$slambda$lambda$slambda).s6 = function (p1, $completion) {
    return this.oo((!(p1 == null) ? isInterface(p1, CoroutineScope) : false) ? p1 : THROW_CCE(), $completion);
  };
  protoOf(DomApp$buildHistoryPage$lambda$slambda$lambda$slambda).i6 = function () {
    var suspendResult = this.c6_1;
    $sm: do
      try {
        var tmp = this.a6_1;
        switch (tmp) {
          case 0:
            this.b6_1 = 2;
            this.a6_1 = 1;
            suspendResult = loadHistory(DomApp_getInstance(), this.cp_1, this.dp_1, this);
            if (suspendResult === get_COROUTINE_SUSPENDED()) {
              return suspendResult;
            }

            continue $sm;
          case 1:
            return Unit_instance;
          case 2:
            throw this.d6_1;
        }
      } catch ($p) {
        var e = $p;
        if (this.b6_1 === 2) {
          throw e;
        } else {
          this.a6_1 = this.b6_1;
          this.d6_1 = e;
        }
      }
     while (true);
  };
  protoOf(DomApp$buildHistoryPage$lambda$slambda$lambda$slambda).po = function ($this$launch, completion) {
    var i = new DomApp$buildHistoryPage$lambda$slambda$lambda$slambda(this.cp_1, this.dp_1, completion);
    i.ep_1 = $this$launch;
    return i;
  };
  function DomApp$buildHistoryPage$lambda$slambda$lambda$slambda_0($id, $timelineHost, resultContinuation) {
    var i = new DomApp$buildHistoryPage$lambda$slambda$lambda$slambda($id, $timelineHost, resultContinuation);
    var l = function ($this$launch, $completion) {
      return i.oo($this$launch, $completion);
    };
    l.$arity = 1;
    return l;
  }
  function DomApp$buildHistoryPage$lambda$slambda$lambda($shipmentId, $id, $shipmentInput, $timelineHost) {
    return function () {
      $shipmentId._v = $id;
      $shipmentInput.value = $id;
      var tmp = DomApp_getInstance().al_1;
      launch(tmp, VOID, VOID, DomApp$buildHistoryPage$lambda$slambda$lambda$slambda_0($id, $timelineHost, null));
      return Unit_instance;
    };
  }
  function _get_backendInput__aprlh1($this) {
    var tmp = $this.bl_1;
    if (!(tmp == null))
      return tmp;
    else {
      throwUninitializedPropertyAccessException('backendInput');
    }
  }
  function _get_refreshStatus__lkfg78($this) {
    var tmp = $this.cl_1;
    if (!(tmp == null))
      return tmp;
    else {
      throwUninitializedPropertyAccessException('refreshStatus');
    }
  }
  function _get_logPre__rl3k5w($this) {
    var tmp = $this.dl_1;
    if (!(tmp == null))
      return tmp;
    else {
      throwUninitializedPropertyAccessException('logPre');
    }
  }
  function _get_pageMap__lnrq1o($this) {
    var tmp = $this.el_1;
    if (!(tmp == null))
      return tmp;
    else {
      throwUninitializedPropertyAccessException('pageMap');
    }
  }
  function _get_pageState__cksdt($this) {
    var tmp = $this.fl_1;
    if (!(tmp == null))
      return tmp;
    else {
      throwUninitializedPropertyAccessException('pageState');
    }
  }
  function _get_pageHistory__odwogk($this) {
    var tmp = $this.gl_1;
    if (!(tmp == null))
      return tmp;
    else {
      throwUninitializedPropertyAccessException('pageHistory');
    }
  }
  function _get_pageSettings__m12d2x($this) {
    var tmp = $this.hl_1;
    if (!(tmp == null))
      return tmp;
    else {
      throwUninitializedPropertyAccessException('pageSettings');
    }
  }
  function _get_agentSettings__dv75op($this) {
    var tmp = $this.il_1;
    if (!(tmp == null))
      return tmp;
    else {
      throwUninitializedPropertyAccessException('agentSettings');
    }
  }
  function _get_mapView__x1vfu8($this) {
    var tmp = $this.jl_1;
    if (!(tmp == null))
      return tmp;
    else {
      throwUninitializedPropertyAccessException('mapView');
    }
  }
  function _get_stateHost__pqu4iw($this) {
    var tmp = $this.kl_1;
    if (!(tmp == null))
      return tmp;
    else {
      throwUninitializedPropertyAccessException('stateHost');
    }
  }
  function _get_historyHost__5g1wln($this) {
    var tmp = $this.ll_1;
    if (!(tmp == null))
      return tmp;
    else {
      throwUninitializedPropertyAccessException('historyHost');
    }
  }
  function _get_modal__e5yiws($this) {
    var tmp = $this.ql_1;
    if (!(tmp == null))
      return tmp;
    else {
      throwUninitializedPropertyAccessException('modal');
    }
  }
  function buildMapPage($this, host) {
    var toolbar = el('div', 'map-toolbar');
    var modes = el('div', 'map-actions');
    // Inline function 'kotlin.collections.forEach' call
    var tmp0_iterator = get_entries().f();
    while (tmp0_iterator.g()) {
      var element = tmp0_iterator.h();
      // Inline function 'pl.edu.wat.uavlogistics.frontend.dom.DomApp.buildMapPage.<anonymous>' call
      // Inline function 'kotlin.text.replaceFirstChar' call
      // Inline function 'kotlin.text.lowercase' call
      // Inline function 'kotlin.js.asDynamic' call
      var this_0 = element.a1_1.toLowerCase();
      var tmp;
      // Inline function 'kotlin.text.isNotEmpty' call
      if (charSequenceLength(this_0) > 0) {
        // Inline function 'pl.edu.wat.uavlogistics.frontend.dom.DomApp.buildMapPage.<anonymous>.<anonymous>' call
        // Inline function 'kotlin.text.uppercase' call
        var this_1 = charSequenceGet(this_0, 0);
        // Inline function 'kotlin.js.unsafeCast' call
        // Inline function 'kotlin.js.asDynamic' call
        var tmp$ret$6 = toString_0(this_1).toUpperCase();
        var tmp_0 = toString(tmp$ret$6);
        // Inline function 'kotlin.text.substring' call
        // Inline function 'kotlin.js.asDynamic' call
        tmp = tmp_0 + this_0.substring(1);
      } else {
        tmp = this_0;
      }
      var tmp_1 = tmp;
      var btn = button(tmp_1, 'secondary', DomApp$buildMapPage$lambda(element));
      // Inline function 'kotlin.collections.set' call
      DomApp_getInstance().wl_1.z2(element, btn);
      modes.appendChild(btn);
    }
    modes.appendChild(button('Zoom +', 'secondary', DomApp$buildMapPage$lambda_0));
    modes.appendChild(button('Zoom \u2212', 'secondary', DomApp$buildMapPage$lambda_1));
    modes.appendChild(button('Reset', 'secondary', DomApp$buildMapPage$lambda_2));
    modes.appendChild(button('Gazebo', 'secondary', DomApp$buildMapPage$lambda_3));
    toolbar.appendChild(modes);
    var legend = el('div', 'legend');
    legend.appendChild(legendItem($this, 'station', 'Stations'));
    legend.appendChild(legendItem($this, 'agent-uav', 'UAV'));
    legend.appendChild(legendItem($this, 'agent-ugv', 'UGV'));
    legend.appendChild(legendItem($this, 'range-uav-travel', 'UAV inter-station (dashed)'));
    legend.appendChild(legendItem($this, 'range-uav-pickup', 'UAV package pickup (solid)'));
    legend.appendChild(legendItem($this, 'range-ugv-travel', 'UGV inter-station (dashed)'));
    legend.appendChild(legendItem($this, 'range-ugv-pickup', 'UGV package pickup (solid)'));
    legend.appendChild(legendItem($this, 'package', 'Packages'));
    toolbar.appendChild(legend);
    host.appendChild(toolbar);
    var hint = el('p', 'map-hint hint', 'Drag to pan \xB7 scroll to zoom (toward cursor) \xB7 hover markers for details');
    host.appendChild(hint);
    var mapContainer = el('div');
    var tmp_2 = $this;
    tmp_2.jl_1 = new DomMapView(mapContainer, DomApp$buildMapPage$lambda_4);
    host.appendChild(mapContainer);
  }
  function buildHistoryPage($this, host) {
    var wrap = el('div');
    var shipmentId = {_v: ''};
    var tmp = document.createElement('input');
    var shipmentInput = tmp instanceof HTMLInputElement ? tmp : THROW_CCE();
    shipmentInput.placeholder = 'Shipment ID';
    shipmentInput.oninput = DomApp$buildHistoryPage$lambda(shipmentId, shipmentInput);
    $this.pl_1 = shipmentInput;
    wrap.appendChild(el('label', null, 'Shipment ID'));
    wrap.appendChild(shipmentInput);
    var listHost = el('div', 'list-panel');
    var timelineHost = el('div', 'timeline');
    $this.ol_1 = timelineHost;
    wrap.appendChild(button('Load all shipments', VOID, DomApp$buildHistoryPage$lambda_0(listHost, shipmentId, shipmentInput, timelineHost)));
    wrap.appendChild(button('Load history', 'secondary', DomApp$buildHistoryPage$lambda_1(shipmentId, timelineHost)));
    wrap.appendChild(listHost);
    wrap.appendChild(el('h3', 'state-section-title', 'Inactive shipments'));
    $this.ml_1 = el('div', 'state-list');
    wrap.appendChild(ensureNotNull($this.ml_1));
    wrap.appendChild(el('h3', 'state-section-title', 'Inactive tasks'));
    $this.nl_1 = el('div', 'state-list');
    wrap.appendChild(ensureNotNull($this.nl_1));
    wrap.appendChild(el('h3', 'state-section-title', 'Shipment timeline'));
    wrap.appendChild(timelineHost);
    host.appendChild(wrap);
    renderHistoryArchive($this);
    return host;
  }
  function loadHistory($this, shipmentId, timelineHost, $completion) {
    var tmp = new $loadHistoryCOROUTINE$2($this, shipmentId, timelineHost, $completion);
    tmp.c6_1 = Unit_instance;
    tmp.d6_1 = null;
    return tmp.i6();
  }
  function onMapClick($this, coord) {
    var tmp0_elvis_lhs = $this.tl_1;
    var tmp;
    if (tmp0_elvis_lhs == null) {
      return Unit_instance;
    } else {
      tmp = tmp0_elvis_lhs;
    }
    var mode = tmp;
    if (mode.equals(MapAddMode_PACKAGE_getInstance())) {
      if ($this.vl_1) {
        var tmp1_elvis_lhs = $this.ul_1;
        var tmp_0;
        if (tmp1_elvis_lhs == null) {
          return Unit_instance;
        } else {
          tmp_0 = tmp1_elvis_lhs;
        }
        var draft = tmp_0;
        var updated = draft.uq(VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, formatCoord_0(coord.up_1, 5), formatCoord_0(coord.vp_1, 5));
        $this.ul_1 = updated;
        $this.vl_1 = false;
        _get_modal__e5yiws($this).fr(updated);
        updateModeButtons($this);
        return Unit_instance;
      }
      var draft_0 = new RegisterOverlayState(mode, coord);
      $this.ul_1 = draft_0;
      _get_mapView__x1vfu8($this).cs(coord);
      _get_modal__e5yiws($this).ds(draft_0);
      return Unit_instance;
    }
    _get_mapView__x1vfu8($this).cs(coord);
    _get_modal__e5yiws($this).ds(new RegisterOverlayState(mode, coord));
  }
  function updateModeButtons($this) {
    // Inline function 'kotlin.collections.forEach' call
    // Inline function 'kotlin.collections.iterator' call
    var tmp0_iterator = $this.wl_1.z().f();
    while (tmp0_iterator.g()) {
      var element = tmp0_iterator.h();
      // Inline function 'pl.edu.wat.uavlogistics.frontend.dom.DomApp.updateModeButtons.<anonymous>' call
      // Inline function 'kotlin.collections.component1' call
      var mode = element.t();
      // Inline function 'kotlin.collections.component2' call
      var btn = element.u();
      btn.classList.toggle('active-mode', equals(DomApp_getInstance().tl_1, mode));
    }
    var hint = _get_pageMap__lnrq1o($this).querySelector('.map-hint');
    if (hint == null)
      null;
    else {
      var tmp;
      if ($this.vl_1) {
        tmp = 'Click the map to set the package destination.';
      } else if (equals($this.tl_1, MapAddMode_PACKAGE_getInstance())) {
        tmp = 'Click the map to set the package origin (pick destination in the dialog).';
      } else if (!($this.tl_1 == null)) {
        // Inline function 'kotlin.text.lowercase' call
        // Inline function 'kotlin.js.asDynamic' call
        tmp = 'Click the map to place a ' + ensureNotNull($this.tl_1).a1_1.toLowerCase() + '.';
      } else {
        tmp = 'Drag to pan \xB7 scroll to zoom (toward cursor) \xB7 hover markers for details';
      }
      hint.textContent = tmp;
    }
  }
  function showPage($this, index) {
    // Inline function 'kotlin.collections.forEachIndexed' call
    var index_0 = 0;
    var tmp0_iterator = listOf([_get_pageMap__lnrq1o($this), _get_pageState__cksdt($this), _get_pageHistory__odwogk($this), _get_pageSettings__m12d2x($this)]).f();
    while (tmp0_iterator.g()) {
      var item = tmp0_iterator.h();
      // Inline function 'pl.edu.wat.uavlogistics.frontend.dom.DomApp.showPage.<anonymous>' call
      var tmp1 = index_0;
      index_0 = tmp1 + 1 | 0;
      var i = checkIndexOverflow(tmp1);
      item.classList.toggle('active-page', i === index);
    }
    // Inline function 'kotlin.collections.forEachIndexed' call
    var index_1 = 0;
    var tmp0_iterator_0 = $this.xl_1.f();
    while (tmp0_iterator_0.g()) {
      var item_0 = tmp0_iterator_0.h();
      // Inline function 'pl.edu.wat.uavlogistics.frontend.dom.DomApp.showPage.<anonymous>' call
      var tmp1_0 = index_1;
      index_1 = tmp1_0 + 1 | 0;
      var i_0 = checkIndexOverflow(tmp1_0);
      item_0.classList.toggle('secondary', !(i_0 === index));
    }
    if (index === 2) {
      renderHistoryArchive($this);
    } else if (index === 3) {
      _get_agentSettings__dv75op($this).to();
    }
  }
  function tabButton($this, label, pageIndex, selected, onClick) {
    var btn = button(label, selected ? null : 'secondary', onClick);
    // Inline function 'kotlin.js.asDynamic' call
    btn.tabIndex = pageIndex;
    return btn;
  }
  function refresh($this, showInLog, $completion) {
    var tmp = new $refreshCOROUTINE$3($this, showInLog, $completion);
    tmp.c6_1 = Unit_instance;
    tmp.d6_1 = null;
    return tmp.i6();
  }
  function renderState($this) {
    replaceChildren(_get_stateHost__pqu4iw($this));
    var state = $this.sl_1;
    if (state == null) {
      _get_stateHost__pqu4iw($this).appendChild(el('p', 'empty-state', 'Waiting for network state\u2026'));
      return Unit_instance;
    }
    var stations = dynamicArray(state.stations);
    var agents = dynamicArray(state.agents);
    var allShipments = dynamicArray(state.shipments);
    var allTasks = dynamicArray(state.tasks);
    var shipments = activeShipments(allShipments);
    var tasks = activeTasks(allTasks, allShipments);
    var summary = el('div', 'state-summary');
    summary.appendChild(statCard($this, stations.length.toString(), 'Stations'));
    summary.appendChild(statCard($this, agents.length.toString(), 'Agents'));
    summary.appendChild(statCard($this, shipments.i().toString(), 'Active shipments'));
    summary.appendChild(statCard($this, tasks.i().toString(), 'Active tasks'));
    _get_stateHost__pqu4iw($this).appendChild(summary);
    _get_stateHost__pqu4iw($this).appendChild(el('h3', 'state-section-title', 'Stations'));
    var stationGrid = el('div', 'state-grid');
    // Inline function 'kotlin.collections.forEach' call
    var inductionVariable = 0;
    var last = stations.length;
    while (inductionVariable < last) {
      var element = stations[inductionVariable];
      inductionVariable = inductionVariable + 1 | 0;
      // Inline function 'pl.edu.wat.uavlogistics.frontend.dom.DomApp.renderState.<anonymous>' call
      var tmp = DomApp_getInstance();
      var tmp_0 = element.id;
      var tmp_1 = (!(tmp_0 == null) ? typeof tmp_0 === 'string' : false) ? tmp_0 : THROW_CCE();
      var tmp_2 = element.name;
      var tmp_3 = (!(tmp_2 == null) ? typeof tmp_2 === 'string' : false) ? tmp_2 : THROW_CCE();
      var tmp_4 = element.status;
      stationGrid.appendChild(entityCard(tmp, 'station-card', tmp_1, tmp_3, (!(tmp_4 == null) ? typeof tmp_4 === 'string' : false) ? tmp_4 : THROW_CCE(), stationDetails(DomApp_getInstance(), element)));
    }
    _get_stateHost__pqu4iw($this).appendChild(stationGrid);
    _get_stateHost__pqu4iw($this).appendChild(el('h3', 'state-section-title', 'Agents'));
    var agentGrid = el('div', 'state-grid');
    // Inline function 'kotlin.collections.forEach' call
    var inductionVariable_0 = 0;
    var last_0 = agents.length;
    while (inductionVariable_0 < last_0) {
      var element_0 = agents[inductionVariable_0];
      inductionVariable_0 = inductionVariable_0 + 1 | 0;
      // Inline function 'pl.edu.wat.uavlogistics.frontend.dom.DomApp.renderState.<anonymous>' call
      var tmp_5 = DomApp_getInstance();
      var tmp_6 = element_0.id;
      var tmp_7 = (!(tmp_6 == null) ? typeof tmp_6 === 'string' : false) ? tmp_6 : THROW_CCE();
      var tmp_8 = element_0.type;
      var tmp_9 = (!(tmp_8 == null) ? typeof tmp_8 === 'string' : false) ? tmp_8 : THROW_CCE();
      var tmp_10 = element_0.status;
      agentGrid.appendChild(entityCard(tmp_5, 'agent-card', tmp_7, tmp_9, (!(tmp_10 == null) ? typeof tmp_10 === 'string' : false) ? tmp_10 : THROW_CCE(), agentDetails(DomApp_getInstance(), element_0)));
    }
    _get_stateHost__pqu4iw($this).appendChild(agentGrid);
    _get_stateHost__pqu4iw($this).appendChild(el('h3', 'state-section-title', 'Shipments'));
    var shipmentGrid = el('div', 'state-grid');
    // Inline function 'kotlin.collections.forEach' call
    var tmp0_iterator = shipments.f();
    while (tmp0_iterator.g()) {
      var element_1 = tmp0_iterator.h();
      // Inline function 'pl.edu.wat.uavlogistics.frontend.dom.DomApp.renderState.<anonymous>' call
      var tmp_11 = DomApp_getInstance();
      var tmp_12 = element_1.id;
      var tmp_13 = shortId((!(tmp_12 == null) ? typeof tmp_12 === 'string' : false) ? tmp_12 : THROW_CCE());
      var tmp_14 = element_1.customerId;
      var tmp_15 = (!(tmp_14 == null) ? typeof tmp_14 === 'string' : false) ? tmp_14 : THROW_CCE();
      var tmp_16 = element_1.status;
      shipmentGrid.appendChild(entityCard(tmp_11, 'package-card', tmp_13, tmp_15, (!(tmp_16 == null) ? typeof tmp_16 === 'string' : false) ? tmp_16 : THROW_CCE(), shipmentDetails(DomApp_getInstance(), element_1)));
    }
    _get_stateHost__pqu4iw($this).appendChild(shipmentGrid);
    _get_stateHost__pqu4iw($this).appendChild(el('h3', 'state-section-title', 'Tasks'));
    var taskList = el('div', 'state-list');
    // Inline function 'kotlin.collections.forEach' call
    var tmp0_iterator_0 = tasks.f();
    while (tmp0_iterator_0.g()) {
      var element_2 = tmp0_iterator_0.h();
      // Inline function 'pl.edu.wat.uavlogistics.frontend.dom.DomApp.renderState.<anonymous>' call
      appendTaskRow(DomApp_getInstance(), taskList, element_2);
    }
    _get_stateHost__pqu4iw($this).appendChild(taskList);
  }
  function renderHistoryArchive($this) {
    var tmp0_elvis_lhs = $this.ml_1;
    var tmp;
    if (tmp0_elvis_lhs == null) {
      return Unit_instance;
    } else {
      tmp = tmp0_elvis_lhs;
    }
    var shipmentsHost = tmp;
    var tmp1_elvis_lhs = $this.nl_1;
    var tmp_0;
    if (tmp1_elvis_lhs == null) {
      return Unit_instance;
    } else {
      tmp_0 = tmp1_elvis_lhs;
    }
    var tasksHost = tmp_0;
    replaceChildren(shipmentsHost);
    replaceChildren(tasksHost);
    var state = $this.sl_1;
    if (state == null) {
      var waiting = el('p', 'empty-state', 'Waiting for network state\u2026');
      shipmentsHost.appendChild(waiting);
      tasksHost.appendChild(el('p', 'empty-state', 'Waiting for network state\u2026'));
      return Unit_instance;
    }
    var allShipments = dynamicArray(state.shipments);
    var allTasks = dynamicArray(state.tasks);
    var inactiveShipmentList = inactiveShipments(allShipments);
    var inactiveTaskList = inactiveTasks(allTasks, allShipments);
    if (inactiveShipmentList.q()) {
      shipmentsHost.appendChild(el('p', 'empty-state', 'No delivered or cancelled shipments.'));
    } else {
      // Inline function 'kotlin.collections.forEach' call
      var tmp0_iterator = inactiveShipmentList.f();
      while (tmp0_iterator.g()) {
        var element = tmp0_iterator.h();
        // Inline function 'pl.edu.wat.uavlogistics.frontend.dom.DomApp.renderHistoryArchive.<anonymous>' call
        var tmp_1 = element.id;
        var id = (!(tmp_1 == null) ? typeof tmp_1 === 'string' : false) ? tmp_1 : THROW_CCE();
        var tmp_2 = shortId(id) + ' \xB7 ' + element.status;
        var row = button(tmp_2, 'shipment-row', DomApp$renderHistoryArchive$lambda(id));
        shipmentsHost.appendChild(row);
      }
    }
    if (inactiveTaskList.q()) {
      tasksHost.appendChild(el('p', 'empty-state', 'No completed or cancelled tasks.'));
    } else {
      // Inline function 'kotlin.collections.forEach' call
      var tmp0_iterator_0 = inactiveTaskList.f();
      while (tmp0_iterator_0.g()) {
        var element_0 = tmp0_iterator_0.h();
        // Inline function 'pl.edu.wat.uavlogistics.frontend.dom.DomApp.renderHistoryArchive.<anonymous>' call
        appendTaskRow(DomApp_getInstance(), tasksHost, element_0);
      }
    }
  }
  function appendTaskRow($this, host, task) {
    var row = el('div', 'task-row');
    var tmp = task.id;
    row.appendChild(el('strong', null, shortId((!(tmp == null) ? typeof tmp === 'string' : false) ? tmp : THROW_CCE()) + ' \xB7 ' + task.status));
    var tmp_0 = task.assignedAgentId;
    var agent = (tmp_0 == null ? true : typeof tmp_0 === 'string') ? tmp_0 : THROW_CCE();
    var tmp_1 = task.shipmentId;
    var tmp_2 = shortId((!(tmp_1 == null) ? typeof tmp_1 === 'string' : false) ? tmp_1 : THROW_CCE());
    var tmp1_elvis_lhs = agent == null ? null : shortId(agent);
    var tmp_3 = 'shipment ' + tmp_2 + ' \xB7 agent ' + (tmp1_elvis_lhs == null ? '\u2014' : tmp1_elvis_lhs) + ' \xB7 ';
    var tmp2_elvis_lhs = task.requiredAgentType;
    row.appendChild(el('small', null, tmp_3 + ('requires ' + (tmp2_elvis_lhs == null ? 'any' : tmp2_elvis_lhs) + ' \xB7 ' + coord($this, task.startPoint) + ' \u2192 ' + coord($this, task.endPoint))));
    host.appendChild(row);
  }
  function statCard($this, value, label) {
    var card = el('div', 'stat-card');
    card.appendChild(el('span', 'stat-value', value));
    card.appendChild(el('span', 'stat-label', label));
    return card;
  }
  function entityCard($this, className, id, subtitle, status, details) {
    var card = el('article', 'entity-card ' + className);
    var header = el('header');
    header.appendChild(el('strong', null, id));
    // Inline function 'kotlin.text.lowercase' call
    // Inline function 'kotlin.js.asDynamic' call
    var tmp$ret$1 = status.toLowerCase();
    header.appendChild(el('span', 'status-badge status-' + tmp$ret$1, status));
    card.appendChild(header);
    card.appendChild(el('p', null, subtitle));
    card.appendChild(el('p', null, details));
    return card;
  }
  function legendItem($this, dotClass, label) {
    var item = el('span', 'legend-item');
    item.appendChild(el('span', 'dot ' + dotClass));
    item.append(' ' + label);
    return item;
  }
  function stationDetails($this, station) {
    var p = station.position;
    return coord($this, p) + ' \xB7 storage ' + station.occupiedStorage + '/' + station.storageCapacity + ' \xB7 parking ' + station.occupiedParking + '/' + station.parkingCapacity;
  }
  function agentDetails($this, agent) {
    var p = agent.position;
    var tmp = coord($this, p);
    var tmp_0 = agent.energyLevelPercent;
    var tmp0_elvis_lhs = agent.currentStationId;
    return tmp + ' \xB7 ' + tmp_0 + '% \xB7 station ' + (tmp0_elvis_lhs == null ? '\u2014' : tmp0_elvis_lhs);
  }
  function shipmentDetails($this, shipment) {
    var tmp = coord($this, shipment.origin);
    var tmp_0 = coord($this, shipment.destination);
    var tmp0_elvis_lhs = shipment.carryingAgentId;
    return tmp + ' \u2192 ' + tmp_0 + ' \xB7 carrier ' + (tmp0_elvis_lhs == null ? '\u2014' : tmp0_elvis_lhs);
  }
  function coord($this, point) {
    var tmp = point.latitude;
    var tmp_0 = formatCoord_0((!(tmp == null) ? typeof tmp === 'number' : false) ? tmp : THROW_CCE(), 5);
    var tmp_1 = point.longitude;
    return tmp_0 + ', ' + formatCoord_0((!(tmp_1 == null) ? typeof tmp_1 === 'number' : false) ? tmp_1 : THROW_CCE(), 5);
  }
  function setLog($this, text) {
    _get_logPre__rl3k5w($this).textContent = text;
  }
  function DomApp$mount$lambda(it) {
    DomApp_getInstance().rl_1 = _get_backendInput__aprlh1(DomApp_getInstance()).value;
    return null;
  }
  function DomApp$mount$lambda_0() {
    var tmp = DomApp_getInstance().al_1;
    launch(tmp, VOID, VOID, DomApp$mount$lambda$slambda_0(null));
    return Unit_instance;
  }
  function DomApp$mount$lambda$slambda(resultContinuation) {
    CoroutineImpl.call(this, resultContinuation);
  }
  protoOf(DomApp$mount$lambda$slambda).oo = function ($this$launch, $completion) {
    var tmp = this.po($this$launch, $completion);
    tmp.c6_1 = Unit_instance;
    tmp.d6_1 = null;
    return tmp.i6();
  };
  protoOf(DomApp$mount$lambda$slambda).s6 = function (p1, $completion) {
    return this.oo((!(p1 == null) ? isInterface(p1, CoroutineScope) : false) ? p1 : THROW_CCE(), $completion);
  };
  protoOf(DomApp$mount$lambda$slambda).i6 = function () {
    var suspendResult = this.c6_1;
    $sm: do
      try {
        var tmp = this.a6_1;
        switch (tmp) {
          case 0:
            this.b6_1 = 4;
            var tmp_0 = this;
            tmp_0.xs_1 = this.ws_1;
            this.b6_1 = 3;
            var tmp_1 = this;
            tmp_1.zs_1 = Companion_instance;
            var tmp_2 = this;
            tmp_2.at_1 = this.xs_1;
            this.bt_1 = DomApp_getInstance();
            this.a6_1 = 1;
            suspendResult = ApiClient_instance.rm(DomApp_getInstance().rl_1, '/health', VOID, VOID, VOID, this);
            if (suspendResult === get_COROUTINE_SUSPENDED()) {
              return suspendResult;
            }

            continue $sm;
          case 1:
            this.ct_1 = suspendResult;
            setLog(this.bt_1, this.ct_1);
            this.a6_1 = 2;
            suspendResult = refresh(DomApp_getInstance(), false, this);
            if (suspendResult === get_COROUTINE_SUSPENDED()) {
              return suspendResult;
            }

            continue $sm;
          case 2:
            this.ys_1 = _Result___init__impl__xyqfz8(Unit_instance);
            this.b6_1 = 4;
            this.a6_1 = 5;
            continue $sm;
          case 3:
            this.b6_1 = 4;
            var tmp_3 = this.d6_1;
            if (tmp_3 instanceof Error) {
              var e = this.d6_1;
              var tmp_4 = this;
              tmp_4.ys_1 = _Result___init__impl__xyqfz8(createFailure(e));
              this.a6_1 = 5;
              continue $sm;
            } else {
              throw this.d6_1;
            }

          case 4:
            throw this.d6_1;
          case 5:
            this.b6_1 = 4;
            var this_0 = this.ys_1;
            var tmp0_safe_receiver = Result__exceptionOrNull_impl_p6xea9(this_0);
            if (tmp0_safe_receiver == null)
              null;
            else {
              setLog(DomApp_getInstance(), 'ERROR: ' + failureMessage(tmp0_safe_receiver));
            }

            return Unit_instance;
        }
      } catch ($p) {
        var e_0 = $p;
        if (this.b6_1 === 4) {
          throw e_0;
        } else {
          this.a6_1 = this.b6_1;
          this.d6_1 = e_0;
        }
      }
     while (true);
  };
  protoOf(DomApp$mount$lambda$slambda).po = function ($this$launch, completion) {
    var i = new DomApp$mount$lambda$slambda(completion);
    i.ws_1 = $this$launch;
    return i;
  };
  function DomApp$mount$lambda$slambda_0(resultContinuation) {
    var i = new DomApp$mount$lambda$slambda(resultContinuation);
    var l = function ($this$launch, $completion) {
      return i.oo($this$launch, $completion);
    };
    l.$arity = 1;
    return l;
  }
  function DomApp$mount$lambda_1() {
    var tmp = DomApp_getInstance().al_1;
    launch(tmp, VOID, VOID, DomApp$mount$lambda$slambda_2(null));
    return Unit_instance;
  }
  function DomApp$mount$lambda$slambda_1(resultContinuation) {
    CoroutineImpl.call(this, resultContinuation);
  }
  protoOf(DomApp$mount$lambda$slambda_1).oo = function ($this$launch, $completion) {
    var tmp = this.po($this$launch, $completion);
    tmp.c6_1 = Unit_instance;
    tmp.d6_1 = null;
    return tmp.i6();
  };
  protoOf(DomApp$mount$lambda$slambda_1).s6 = function (p1, $completion) {
    return this.oo((!(p1 == null) ? isInterface(p1, CoroutineScope) : false) ? p1 : THROW_CCE(), $completion);
  };
  protoOf(DomApp$mount$lambda$slambda_1).i6 = function () {
    var suspendResult = this.c6_1;
    $sm: do
      try {
        var tmp = this.a6_1;
        switch (tmp) {
          case 0:
            this.b6_1 = 3;
            var tmp_0 = this;
            tmp_0.mt_1 = this.lt_1;
            this.b6_1 = 2;
            var tmp_1 = this;
            tmp_1.ot_1 = Companion_instance;
            var tmp_2 = this;
            tmp_2.pt_1 = this.mt_1;
            this.a6_1 = 1;
            suspendResult = refresh(DomApp_getInstance(), true, this);
            if (suspendResult === get_COROUTINE_SUSPENDED()) {
              return suspendResult;
            }

            continue $sm;
          case 1:
            this.nt_1 = _Result___init__impl__xyqfz8(Unit_instance);
            this.b6_1 = 3;
            this.a6_1 = 4;
            continue $sm;
          case 2:
            this.b6_1 = 3;
            var tmp_3 = this.d6_1;
            if (tmp_3 instanceof Error) {
              var e = this.d6_1;
              var tmp_4 = this;
              tmp_4.nt_1 = _Result___init__impl__xyqfz8(createFailure(e));
              this.a6_1 = 4;
              continue $sm;
            } else {
              throw this.d6_1;
            }

          case 3:
            throw this.d6_1;
          case 4:
            this.b6_1 = 3;
            var this_0 = this.nt_1;
            var tmp0_safe_receiver = Result__exceptionOrNull_impl_p6xea9(this_0);
            if (tmp0_safe_receiver == null)
              null;
            else {
              setLog(DomApp_getInstance(), 'ERROR: ' + failureMessage(tmp0_safe_receiver));
            }

            return Unit_instance;
        }
      } catch ($p) {
        var e_0 = $p;
        if (this.b6_1 === 3) {
          throw e_0;
        } else {
          this.a6_1 = this.b6_1;
          this.d6_1 = e_0;
        }
      }
     while (true);
  };
  protoOf(DomApp$mount$lambda$slambda_1).po = function ($this$launch, completion) {
    var i = new DomApp$mount$lambda$slambda_1(completion);
    i.lt_1 = $this$launch;
    return i;
  };
  function DomApp$mount$lambda$slambda_2(resultContinuation) {
    var i = new DomApp$mount$lambda$slambda_1(resultContinuation);
    var l = function ($this$launch, $completion) {
      return i.oo($this$launch, $completion);
    };
    l.$arity = 1;
    return l;
  }
  function DomApp$mount$lambda_2() {
    showPage(DomApp_getInstance(), 0);
    return Unit_instance;
  }
  function DomApp$mount$lambda_3() {
    showPage(DomApp_getInstance(), 1);
    return Unit_instance;
  }
  function DomApp$mount$lambda_4() {
    showPage(DomApp_getInstance(), 2);
    return Unit_instance;
  }
  function DomApp$mount$lambda_5() {
    showPage(DomApp_getInstance(), 3);
    return Unit_instance;
  }
  function DomApp$mount$lambda_6() {
    return DomApp_getInstance().rl_1;
  }
  function DomApp$mount$lambda_7(it) {
    setLog(DomApp_getInstance(), it);
    return Unit_instance;
  }
  function DomApp$mount$lambda_8() {
    var tmp = DomApp_getInstance().al_1;
    launch(tmp, VOID, VOID, DomApp$mount$lambda$slambda_4(null));
    return Unit_instance;
  }
  function DomApp$mount$lambda$slambda_3(resultContinuation) {
    CoroutineImpl.call(this, resultContinuation);
  }
  protoOf(DomApp$mount$lambda$slambda_3).oo = function ($this$launch, $completion) {
    var tmp = this.po($this$launch, $completion);
    tmp.c6_1 = Unit_instance;
    tmp.d6_1 = null;
    return tmp.i6();
  };
  protoOf(DomApp$mount$lambda$slambda_3).s6 = function (p1, $completion) {
    return this.oo((!(p1 == null) ? isInterface(p1, CoroutineScope) : false) ? p1 : THROW_CCE(), $completion);
  };
  protoOf(DomApp$mount$lambda$slambda_3).i6 = function () {
    var suspendResult = this.c6_1;
    $sm: do
      try {
        var tmp = this.a6_1;
        switch (tmp) {
          case 0:
            this.b6_1 = 2;
            this.a6_1 = 1;
            suspendResult = refresh(DomApp_getInstance(), false, this);
            if (suspendResult === get_COROUTINE_SUSPENDED()) {
              return suspendResult;
            }

            continue $sm;
          case 1:
            return Unit_instance;
          case 2:
            throw this.d6_1;
        }
      } catch ($p) {
        var e = $p;
        if (this.b6_1 === 2) {
          throw e;
        } else {
          this.a6_1 = this.b6_1;
          this.d6_1 = e;
        }
      }
     while (true);
  };
  protoOf(DomApp$mount$lambda$slambda_3).po = function ($this$launch, completion) {
    var i = new DomApp$mount$lambda$slambda_3(completion);
    i.yt_1 = $this$launch;
    return i;
  };
  function DomApp$mount$lambda$slambda_4(resultContinuation) {
    var i = new DomApp$mount$lambda$slambda_3(resultContinuation);
    var l = function ($this$launch, $completion) {
      return i.oo($this$launch, $completion);
    };
    l.$arity = 1;
    return l;
  }
  function DomApp$mount$lambda_9() {
    return DomApp_getInstance().rl_1;
  }
  function DomApp$mount$lambda_10() {
    DomApp_getInstance().tl_1 = null;
    DomApp_getInstance().ul_1 = null;
    DomApp_getInstance().vl_1 = false;
    updateModeButtons(DomApp_getInstance());
    _get_mapView__x1vfu8(DomApp_getInstance()).zt(null);
    return Unit_instance;
  }
  function DomApp$mount$lambda_11(it) {
    setLog(DomApp_getInstance(), ApiClient_instance.sm(it));
    var tmp = DomApp_getInstance().al_1;
    launch(tmp, VOID, VOID, DomApp$mount$lambda$slambda_6(null));
    return Unit_instance;
  }
  function DomApp$mount$lambda$slambda_5(resultContinuation) {
    CoroutineImpl.call(this, resultContinuation);
  }
  protoOf(DomApp$mount$lambda$slambda_5).oo = function ($this$launch, $completion) {
    var tmp = this.po($this$launch, $completion);
    tmp.c6_1 = Unit_instance;
    tmp.d6_1 = null;
    return tmp.i6();
  };
  protoOf(DomApp$mount$lambda$slambda_5).s6 = function (p1, $completion) {
    return this.oo((!(p1 == null) ? isInterface(p1, CoroutineScope) : false) ? p1 : THROW_CCE(), $completion);
  };
  protoOf(DomApp$mount$lambda$slambda_5).i6 = function () {
    var suspendResult = this.c6_1;
    $sm: do
      try {
        var tmp = this.a6_1;
        switch (tmp) {
          case 0:
            this.b6_1 = 2;
            this.a6_1 = 1;
            suspendResult = refresh(DomApp_getInstance(), false, this);
            if (suspendResult === get_COROUTINE_SUSPENDED()) {
              return suspendResult;
            }

            continue $sm;
          case 1:
            return Unit_instance;
          case 2:
            throw this.d6_1;
        }
      } catch ($p) {
        var e = $p;
        if (this.b6_1 === 2) {
          throw e;
        } else {
          this.a6_1 = this.b6_1;
          this.d6_1 = e;
        }
      }
     while (true);
  };
  protoOf(DomApp$mount$lambda$slambda_5).po = function ($this$launch, completion) {
    var i = new DomApp$mount$lambda$slambda_5(completion);
    i.iu_1 = $this$launch;
    return i;
  };
  function DomApp$mount$lambda$slambda_6(resultContinuation) {
    var i = new DomApp$mount$lambda$slambda_5(resultContinuation);
    var l = function ($this$launch, $completion) {
      return i.oo($this$launch, $completion);
    };
    l.$arity = 1;
    return l;
  }
  function DomApp$mount$lambda_12(it) {
    setLog(DomApp_getInstance(), 'ERROR: ' + it);
    return Unit_instance;
  }
  function DomApp$mount$lambda_13(state) {
    DomApp_getInstance().ul_1 = state;
    DomApp_getInstance().vl_1 = true;
    updateModeButtons(DomApp_getInstance());
    return Unit_instance;
  }
  function DomApp$mount$slambda(resultContinuation) {
    CoroutineImpl.call(this, resultContinuation);
  }
  protoOf(DomApp$mount$slambda).oo = function ($this$launch, $completion) {
    var tmp = this.po($this$launch, $completion);
    tmp.c6_1 = Unit_instance;
    tmp.d6_1 = null;
    return tmp.i6();
  };
  protoOf(DomApp$mount$slambda).s6 = function (p1, $completion) {
    return this.oo((!(p1 == null) ? isInterface(p1, CoroutineScope) : false) ? p1 : THROW_CCE(), $completion);
  };
  protoOf(DomApp$mount$slambda).i6 = function () {
    var suspendResult = this.c6_1;
    $sm: do
      try {
        var tmp = this.a6_1;
        switch (tmp) {
          case 0:
            this.b6_1 = 6;
            this.a6_1 = 1;
            continue $sm;
          case 1:
            if (!true) {
              this.a6_1 = 7;
              continue $sm;
            }

            var tmp_0 = this;
            tmp_0.su_1 = this.ru_1;
            this.b6_1 = 3;
            var tmp_1 = this;
            tmp_1.uu_1 = Companion_instance;
            var tmp_2 = this;
            tmp_2.vu_1 = this.su_1;
            this.a6_1 = 2;
            suspendResult = refresh(DomApp_getInstance(), false, this);
            if (suspendResult === get_COROUTINE_SUSPENDED()) {
              return suspendResult;
            }

            continue $sm;
          case 2:
            var tmp_3 = this;
            tmp_3.wu_1 = Unit_instance;
            this.tu_1 = _Result___init__impl__xyqfz8(this.wu_1);
            this.b6_1 = 6;
            this.a6_1 = 4;
            continue $sm;
          case 3:
            this.b6_1 = 6;
            var tmp_4 = this.d6_1;
            if (tmp_4 instanceof Error) {
              this.xu_1 = this.d6_1;
              var tmp_5 = this;
              var exception = this.xu_1;
              tmp_5.tu_1 = _Result___init__impl__xyqfz8(createFailure(exception));
              this.a6_1 = 4;
              continue $sm;
            } else {
              throw this.d6_1;
            }

          case 4:
            this.b6_1 = 6;
            this.yu_1 = this.tu_1;
            var tmp0_safe_receiver = Result__exceptionOrNull_impl_p6xea9(this.yu_1);
            if (tmp0_safe_receiver == null)
              null;
            else {
              setLog(DomApp_getInstance(), 'ERROR: ' + failureMessage(tmp0_safe_receiver));
            }

            this.a6_1 = 5;
            suspendResult = delay(new Long(3000, 0), this);
            if (suspendResult === get_COROUTINE_SUSPENDED()) {
              return suspendResult;
            }

            continue $sm;
          case 5:
            this.a6_1 = 1;
            continue $sm;
          case 6:
            throw this.d6_1;
          case 7:
            return Unit_instance;
        }
      } catch ($p) {
        var e = $p;
        if (this.b6_1 === 6) {
          throw e;
        } else {
          this.a6_1 = this.b6_1;
          this.d6_1 = e;
        }
      }
     while (true);
  };
  protoOf(DomApp$mount$slambda).po = function ($this$launch, completion) {
    var i = new DomApp$mount$slambda(completion);
    i.ru_1 = $this$launch;
    return i;
  };
  function DomApp$mount$slambda_0(resultContinuation) {
    var i = new DomApp$mount$slambda(resultContinuation);
    var l = function ($this$launch, $completion) {
      return i.oo($this$launch, $completion);
    };
    l.$arity = 1;
    return l;
  }
  function DomApp$buildMapPage$lambda($mode) {
    return function () {
      DomApp_getInstance().tl_1 = equals(DomApp_getInstance().tl_1, $mode) ? null : $mode;
      updateModeButtons(DomApp_getInstance());
      _get_mapView__x1vfu8(DomApp_getInstance()).zt(DomApp_getInstance().tl_1);
      return Unit_instance;
    };
  }
  function DomApp$buildMapPage$lambda_0() {
    _get_mapView__x1vfu8(DomApp_getInstance()).zu();
    return Unit_instance;
  }
  function DomApp$buildMapPage$lambda_1() {
    _get_mapView__x1vfu8(DomApp_getInstance()).av();
    return Unit_instance;
  }
  function DomApp$buildMapPage$lambda_2() {
    _get_mapView__x1vfu8(DomApp_getInstance()).bv();
    return Unit_instance;
  }
  function DomApp$buildMapPage$lambda_3() {
    var tmp = DomApp_getInstance().al_1;
    launch(tmp, VOID, VOID, DomApp$buildMapPage$lambda$slambda_0(null));
    return Unit_instance;
  }
  function DomApp$buildMapPage$lambda$slambda(resultContinuation) {
    CoroutineImpl.call(this, resultContinuation);
  }
  protoOf(DomApp$buildMapPage$lambda$slambda).oo = function ($this$launch, $completion) {
    var tmp = this.po($this$launch, $completion);
    tmp.c6_1 = Unit_instance;
    tmp.d6_1 = null;
    return tmp.i6();
  };
  protoOf(DomApp$buildMapPage$lambda$slambda).s6 = function (p1, $completion) {
    return this.oo((!(p1 == null) ? isInterface(p1, CoroutineScope) : false) ? p1 : THROW_CCE(), $completion);
  };
  protoOf(DomApp$buildMapPage$lambda$slambda).i6 = function () {
    var suspendResult = this.c6_1;
    $sm: do
      try {
        var tmp = this.a6_1;
        switch (tmp) {
          case 0:
            this.b6_1 = 3;
            var tmp_0 = this;
            tmp_0.lv_1 = this.kv_1;
            this.b6_1 = 2;
            var tmp_1 = this;
            tmp_1.nv_1 = Companion_instance;
            var tmp_2 = this;
            tmp_2.ov_1 = this.lv_1;
            this.a6_1 = 1;
            suspendResult = ApiClient_instance.rm(DomApp_getInstance().rl_1, '/api/simulation/gazebo/gui', 'POST', VOID, VOID, this);
            if (suspendResult === get_COROUTINE_SUSPENDED()) {
              return suspendResult;
            }

            continue $sm;
          case 1:
            var value = suspendResult;
            this.mv_1 = _Result___init__impl__xyqfz8(value);
            this.b6_1 = 3;
            this.a6_1 = 4;
            continue $sm;
          case 2:
            this.b6_1 = 3;
            var tmp_3 = this.d6_1;
            if (tmp_3 instanceof Error) {
              var e = this.d6_1;
              var tmp_4 = this;
              tmp_4.mv_1 = _Result___init__impl__xyqfz8(createFailure(e));
              this.a6_1 = 4;
              continue $sm;
            } else {
              throw this.d6_1;
            }

          case 3:
            throw this.d6_1;
          case 4:
            this.b6_1 = 3;
            var this_0 = this.mv_1;
            if (_Result___get_isSuccess__impl__sndoy8(this_0)) {
              var tmp_5 = _Result___get_value__impl__bjfvqg(this_0);
              var it = (tmp_5 == null ? true : !(tmp_5 == null)) ? tmp_5 : THROW_CCE();
              window.open('http://localhost:6080/vnc.html?autoconnect=true&resize=scale', '_blank');
              setLog(DomApp_getInstance(), ApiClient_instance.sm(it));
            }

            var tmp0_safe_receiver = Result__exceptionOrNull_impl_p6xea9(this_0);
            if (tmp0_safe_receiver == null)
              null;
            else {
              setLog(DomApp_getInstance(), 'ERROR: ' + failureMessage(tmp0_safe_receiver));
            }

            return Unit_instance;
        }
      } catch ($p) {
        var e_0 = $p;
        if (this.b6_1 === 3) {
          throw e_0;
        } else {
          this.a6_1 = this.b6_1;
          this.d6_1 = e_0;
        }
      }
     while (true);
  };
  protoOf(DomApp$buildMapPage$lambda$slambda).po = function ($this$launch, completion) {
    var i = new DomApp$buildMapPage$lambda$slambda(completion);
    i.kv_1 = $this$launch;
    return i;
  };
  function DomApp$buildMapPage$lambda$slambda_0(resultContinuation) {
    var i = new DomApp$buildMapPage$lambda$slambda(resultContinuation);
    var l = function ($this$launch, $completion) {
      return i.oo($this$launch, $completion);
    };
    l.$arity = 1;
    return l;
  }
  function DomApp$buildMapPage$lambda_4(coord) {
    onMapClick(DomApp_getInstance(), coord);
    return Unit_instance;
  }
  function DomApp$buildHistoryPage$lambda($shipmentId, $shipmentInput) {
    return function (it) {
      $shipmentId._v = $shipmentInput.value;
      return null;
    };
  }
  function DomApp$buildHistoryPage$lambda$slambda($listHost, $shipmentId, $shipmentInput, $timelineHost, resultContinuation) {
    this.xv_1 = $listHost;
    this.yv_1 = $shipmentId;
    this.zv_1 = $shipmentInput;
    this.aw_1 = $timelineHost;
    CoroutineImpl.call(this, resultContinuation);
  }
  protoOf(DomApp$buildHistoryPage$lambda$slambda).oo = function ($this$launch, $completion) {
    var tmp = this.po($this$launch, $completion);
    tmp.c6_1 = Unit_instance;
    tmp.d6_1 = null;
    return tmp.i6();
  };
  protoOf(DomApp$buildHistoryPage$lambda$slambda).s6 = function (p1, $completion) {
    return this.oo((!(p1 == null) ? isInterface(p1, CoroutineScope) : false) ? p1 : THROW_CCE(), $completion);
  };
  protoOf(DomApp$buildHistoryPage$lambda$slambda).i6 = function () {
    var suspendResult = this.c6_1;
    $sm: do
      try {
        var tmp = this.a6_1;
        switch (tmp) {
          case 0:
            this.b6_1 = 3;
            var tmp_0 = this;
            tmp_0.cw_1 = this.bw_1;
            this.b6_1 = 2;
            var tmp_1 = this;
            tmp_1.ew_1 = Companion_instance;
            var tmp_2 = this;
            tmp_2.fw_1 = this.cw_1;
            this.a6_1 = 1;
            suspendResult = ApiClient_instance.rm(DomApp_getInstance().rl_1, '/api/shipments', VOID, VOID, VOID, this);
            if (suspendResult === get_COROUTINE_SUSPENDED()) {
              return suspendResult;
            }

            continue $sm;
          case 1:
            var json = suspendResult;
            var shipments = dynamicArray(JSON.parse(json));
            setLog(DomApp_getInstance(), ApiClient_instance.sm(json));
            replaceChildren(this.xv_1);
            var inductionVariable = 0;
            var last = shipments.length;
            while (inductionVariable < last) {
              var element = shipments[inductionVariable];
              inductionVariable = inductionVariable + 1 | 0;
              var tmp_3 = element.id;
              var id = (!(tmp_3 == null) ? typeof tmp_3 === 'string' : false) ? tmp_3 : THROW_CCE();
              var tmp_4 = shortId(id) + ' \xB7 ' + element.status;
              var row = button(tmp_4, 'shipment-row', DomApp$buildHistoryPage$lambda$slambda$lambda(this.yv_1, id, this.zv_1, this.aw_1));
              this.xv_1.appendChild(row);
            }

            this.dw_1 = _Result___init__impl__xyqfz8(Unit_instance);
            this.b6_1 = 3;
            this.a6_1 = 4;
            continue $sm;
          case 2:
            this.b6_1 = 3;
            var tmp_5 = this.d6_1;
            if (tmp_5 instanceof Error) {
              var e = this.d6_1;
              var tmp_6 = this;
              tmp_6.dw_1 = _Result___init__impl__xyqfz8(createFailure(e));
              this.a6_1 = 4;
              continue $sm;
            } else {
              throw this.d6_1;
            }

          case 3:
            throw this.d6_1;
          case 4:
            this.b6_1 = 3;
            var this_0 = this.dw_1;
            var tmp0_safe_receiver = Result__exceptionOrNull_impl_p6xea9(this_0);
            if (tmp0_safe_receiver == null)
              null;
            else {
              setLog(DomApp_getInstance(), 'ERROR: ' + failureMessage(tmp0_safe_receiver));
            }

            return Unit_instance;
        }
      } catch ($p) {
        var e_0 = $p;
        if (this.b6_1 === 3) {
          throw e_0;
        } else {
          this.a6_1 = this.b6_1;
          this.d6_1 = e_0;
        }
      }
     while (true);
  };
  protoOf(DomApp$buildHistoryPage$lambda$slambda).po = function ($this$launch, completion) {
    var i = new DomApp$buildHistoryPage$lambda$slambda(this.xv_1, this.yv_1, this.zv_1, this.aw_1, completion);
    i.bw_1 = $this$launch;
    return i;
  };
  function DomApp$buildHistoryPage$lambda$slambda_0($listHost, $shipmentId, $shipmentInput, $timelineHost, resultContinuation) {
    var i = new DomApp$buildHistoryPage$lambda$slambda($listHost, $shipmentId, $shipmentInput, $timelineHost, resultContinuation);
    var l = function ($this$launch, $completion) {
      return i.oo($this$launch, $completion);
    };
    l.$arity = 1;
    return l;
  }
  function DomApp$buildHistoryPage$lambda_0($listHost, $shipmentId, $shipmentInput, $timelineHost) {
    return function () {
      var tmp = DomApp_getInstance().al_1;
      launch(tmp, VOID, VOID, DomApp$buildHistoryPage$lambda$slambda_0($listHost, $shipmentId, $shipmentInput, $timelineHost, null));
      return Unit_instance;
    };
  }
  function DomApp$buildHistoryPage$lambda$slambda_1($shipmentId, $timelineHost, resultContinuation) {
    this.ow_1 = $shipmentId;
    this.pw_1 = $timelineHost;
    CoroutineImpl.call(this, resultContinuation);
  }
  protoOf(DomApp$buildHistoryPage$lambda$slambda_1).oo = function ($this$launch, $completion) {
    var tmp = this.po($this$launch, $completion);
    tmp.c6_1 = Unit_instance;
    tmp.d6_1 = null;
    return tmp.i6();
  };
  protoOf(DomApp$buildHistoryPage$lambda$slambda_1).s6 = function (p1, $completion) {
    return this.oo((!(p1 == null) ? isInterface(p1, CoroutineScope) : false) ? p1 : THROW_CCE(), $completion);
  };
  protoOf(DomApp$buildHistoryPage$lambda$slambda_1).i6 = function () {
    var suspendResult = this.c6_1;
    $sm: do
      try {
        var tmp = this.a6_1;
        switch (tmp) {
          case 0:
            this.b6_1 = 2;
            this.a6_1 = 1;
            suspendResult = loadHistory(DomApp_getInstance(), this.ow_1._v, this.pw_1, this);
            if (suspendResult === get_COROUTINE_SUSPENDED()) {
              return suspendResult;
            }

            continue $sm;
          case 1:
            return Unit_instance;
          case 2:
            throw this.d6_1;
        }
      } catch ($p) {
        var e = $p;
        if (this.b6_1 === 2) {
          throw e;
        } else {
          this.a6_1 = this.b6_1;
          this.d6_1 = e;
        }
      }
     while (true);
  };
  protoOf(DomApp$buildHistoryPage$lambda$slambda_1).po = function ($this$launch, completion) {
    var i = new DomApp$buildHistoryPage$lambda$slambda_1(this.ow_1, this.pw_1, completion);
    i.qw_1 = $this$launch;
    return i;
  };
  function DomApp$buildHistoryPage$lambda$slambda_2($shipmentId, $timelineHost, resultContinuation) {
    var i = new DomApp$buildHistoryPage$lambda$slambda_1($shipmentId, $timelineHost, resultContinuation);
    var l = function ($this$launch, $completion) {
      return i.oo($this$launch, $completion);
    };
    l.$arity = 1;
    return l;
  }
  function DomApp$buildHistoryPage$lambda_1($shipmentId, $timelineHost) {
    return function () {
      var tmp;
      if (isBlank($shipmentId._v)) {
        setLog(DomApp_getInstance(), 'Enter a shipment ID first.');
        return Unit_instance;
      }
      var tmp_0 = DomApp_getInstance().al_1;
      launch(tmp_0, VOID, VOID, DomApp$buildHistoryPage$lambda$slambda_2($shipmentId, $timelineHost, null));
      return Unit_instance;
    };
  }
  function DomApp$renderHistoryArchive$lambda$slambda($id, $timeline, resultContinuation) {
    this.zw_1 = $id;
    this.ax_1 = $timeline;
    CoroutineImpl.call(this, resultContinuation);
  }
  protoOf(DomApp$renderHistoryArchive$lambda$slambda).oo = function ($this$launch, $completion) {
    var tmp = this.po($this$launch, $completion);
    tmp.c6_1 = Unit_instance;
    tmp.d6_1 = null;
    return tmp.i6();
  };
  protoOf(DomApp$renderHistoryArchive$lambda$slambda).s6 = function (p1, $completion) {
    return this.oo((!(p1 == null) ? isInterface(p1, CoroutineScope) : false) ? p1 : THROW_CCE(), $completion);
  };
  protoOf(DomApp$renderHistoryArchive$lambda$slambda).i6 = function () {
    var suspendResult = this.c6_1;
    $sm: do
      try {
        var tmp = this.a6_1;
        switch (tmp) {
          case 0:
            this.b6_1 = 2;
            this.a6_1 = 1;
            suspendResult = loadHistory(DomApp_getInstance(), this.zw_1, this.ax_1, this);
            if (suspendResult === get_COROUTINE_SUSPENDED()) {
              return suspendResult;
            }

            continue $sm;
          case 1:
            return Unit_instance;
          case 2:
            throw this.d6_1;
        }
      } catch ($p) {
        var e = $p;
        if (this.b6_1 === 2) {
          throw e;
        } else {
          this.a6_1 = this.b6_1;
          this.d6_1 = e;
        }
      }
     while (true);
  };
  protoOf(DomApp$renderHistoryArchive$lambda$slambda).po = function ($this$launch, completion) {
    var i = new DomApp$renderHistoryArchive$lambda$slambda(this.zw_1, this.ax_1, completion);
    i.bx_1 = $this$launch;
    return i;
  };
  function DomApp$renderHistoryArchive$lambda$slambda_0($id, $timeline, resultContinuation) {
    var i = new DomApp$renderHistoryArchive$lambda$slambda($id, $timeline, resultContinuation);
    var l = function ($this$launch, $completion) {
      return i.oo($this$launch, $completion);
    };
    l.$arity = 1;
    return l;
  }
  function DomApp$renderHistoryArchive$lambda($id) {
    return function () {
      var tmp0_safe_receiver = DomApp_getInstance().pl_1;
      if (tmp0_safe_receiver == null)
        null;
      else {
        tmp0_safe_receiver.value = $id;
      }
      var timeline = DomApp_getInstance().ol_1;
      var tmp;
      if (!(timeline == null)) {
        var tmp_0 = DomApp_getInstance().al_1;
        launch(tmp_0, VOID, VOID, DomApp$renderHistoryArchive$lambda$slambda_0($id, timeline, null));
        tmp = Unit_instance;
      }
      return Unit_instance;
    };
  }
  function $loadHistoryCOROUTINE$2(_this__u8e3s4, shipmentId, timelineHost, resultContinuation) {
    CoroutineImpl.call(this, resultContinuation);
    this.np_1 = _this__u8e3s4;
    this.op_1 = shipmentId;
    this.pp_1 = timelineHost;
  }
  protoOf($loadHistoryCOROUTINE$2).i6 = function () {
    var suspendResult = this.c6_1;
    $sm: do
      try {
        var tmp = this.a6_1;
        switch (tmp) {
          case 0:
            this.b6_1 = 3;
            var tmp_0 = this;
            tmp_0.qp_1 = this.np_1;
            this.b6_1 = 2;
            var tmp_1 = this;
            tmp_1.sp_1 = Companion_instance;
            var tmp_2 = this;
            tmp_2.tp_1 = this.qp_1;
            this.a6_1 = 1;
            suspendResult = ApiClient_instance.rm(this.tp_1.rl_1, '/api/shipments/' + ApiClient_instance.vm(this.op_1) + '/history', VOID, VOID, VOID, this);
            if (suspendResult === get_COROUTINE_SUSPENDED()) {
              return suspendResult;
            }

            continue $sm;
          case 1:
            var json = suspendResult;
            var events = JSON.parse(json);
            setLog(this.tp_1, ApiClient_instance.sm(json));
            replaceChildren(this.pp_1);
            var inductionVariable = 0;
            var last = events.length;
            while (inductionVariable < last) {
              var element = events[inductionVariable];
              inductionVariable = inductionVariable + 1 | 0;
              var block = el('div', 'timeline-event');
              var tmp_3 = element.type;
              block.appendChild(el('div', 'timeline-type', (!(tmp_3 == null) ? typeof tmp_3 === 'string' : false) ? tmp_3 : THROW_CCE()));
              var tmp_4 = element.occurredAt;
              block.appendChild(el('div', 'timeline-time', (!(tmp_4 == null) ? typeof tmp_4 === 'string' : false) ? tmp_4 : THROW_CCE()));
              var tmp_5 = element.description;
              block.appendChild(el('p', null, (!(tmp_5 == null) ? typeof tmp_5 === 'string' : false) ? tmp_5 : THROW_CCE()));
              this.pp_1.appendChild(block);
            }

            this.rp_1 = _Result___init__impl__xyqfz8(Unit_instance);
            this.b6_1 = 3;
            this.a6_1 = 4;
            continue $sm;
          case 2:
            this.b6_1 = 3;
            var tmp_6 = this.d6_1;
            if (tmp_6 instanceof Error) {
              var e = this.d6_1;
              var tmp_7 = this;
              tmp_7.rp_1 = _Result___init__impl__xyqfz8(createFailure(e));
              this.a6_1 = 4;
              continue $sm;
            } else {
              throw this.d6_1;
            }

          case 3:
            throw this.d6_1;
          case 4:
            this.b6_1 = 3;
            var this_0 = this.rp_1;
            var tmp0_safe_receiver = Result__exceptionOrNull_impl_p6xea9(this_0);
            if (tmp0_safe_receiver == null)
              null;
            else {
              setLog(DomApp_getInstance(), 'ERROR: ' + failureMessage(tmp0_safe_receiver));
            }

            return Unit_instance;
        }
      } catch ($p) {
        var e_0 = $p;
        if (this.b6_1 === 3) {
          throw e_0;
        } else {
          this.a6_1 = this.b6_1;
          this.d6_1 = e_0;
        }
      }
     while (true);
  };
  function $refreshCOROUTINE$3(_this__u8e3s4, showInLog, resultContinuation) {
    CoroutineImpl.call(this, resultContinuation);
    this.ms_1 = _this__u8e3s4;
    this.ns_1 = showInLog;
  }
  protoOf($refreshCOROUTINE$3).i6 = function () {
    var suspendResult = this.c6_1;
    $sm: do
      try {
        var tmp = this.a6_1;
        switch (tmp) {
          case 0:
            this.b6_1 = 2;
            this.a6_1 = 1;
            suspendResult = ApiClient_instance.rm(this.ms_1.rl_1, '/api/network/state', VOID, VOID, VOID, this);
            if (suspendResult === get_COROUTINE_SUSPENDED()) {
              return suspendResult;
            }

            continue $sm;
          case 1:
            var json = suspendResult;
            this.ms_1.sl_1 = parseNetworkState(json);
            AgentRangeSettings_getInstance().cx(this.ms_1.sl_1);
            var tmp_0 = _get_refreshStatus__lkfg78(this.ms_1);
            var tmp_1 = (new Date()).toLocaleTimeString();
            tmp_0.textContent = 'Updated ' + ((!(tmp_1 == null) ? typeof tmp_1 === 'string' : false) ? tmp_1 : THROW_CCE());
            if (this.ns_1) {
              setLog(this.ms_1, ApiClient_instance.sm(json));
            }

            var state = this.ms_1.sl_1;
            var points = state != null ? networkToMapPoints(state) : emptyList();
            var ranges = state != null ? networkToStationRangeDiscs(state) : emptyList();
            _get_mapView__x1vfu8(this.ms_1).dx(points, ranges);
            renderState(this.ms_1);
            renderHistoryArchive(this.ms_1);
            return Unit_instance;
          case 2:
            throw this.d6_1;
        }
      } catch ($p) {
        var e = $p;
        if (this.b6_1 === 2) {
          throw e;
        } else {
          this.a6_1 = this.b6_1;
          this.d6_1 = e;
        }
      }
     while (true);
  };
  function DomApp() {
    DomApp_instance = this;
    this.al_1 = CoroutineScope_0(SupervisorJob().o9(Dispatchers_getInstance().wi()));
    this.ml_1 = null;
    this.nl_1 = null;
    this.ol_1 = null;
    this.pl_1 = null;
    this.rl_1 = 'http://localhost:8080';
    this.sl_1 = null;
    this.tl_1 = null;
    this.ul_1 = null;
    this.vl_1 = false;
    var tmp = this;
    // Inline function 'kotlin.collections.mutableMapOf' call
    tmp.wl_1 = LinkedHashMap_init_$Create$();
    var tmp_0 = this;
    // Inline function 'kotlin.collections.mutableListOf' call
    tmp_0.xl_1 = ArrayList_init_$Create$();
  }
  protoOf(DomApp).yl = function (root) {
    replaceChildren(root);
    root.appendChild(el('h1', null, 'UAV Logistics Console'));
    root.appendChild(el('p', 'subtitle', 'Open http://127.0.0.1:8081 \xB7 backend API on port 8080'));
    var toolbar = el('section', 'toolbar');
    var grow = el('div', 'toolbar-grow');
    grow.appendChild(el('label', null, 'Backend URL'));
    var tmp = this;
    var tmp_0 = document.createElement('input');
    tmp.bl_1 = tmp_0 instanceof HTMLInputElement ? tmp_0 : THROW_CCE();
    _get_backendInput__aprlh1(this).value = this.rl_1;
    var tmp_1 = _get_backendInput__aprlh1(this);
    tmp_1.oninput = DomApp$mount$lambda;
    grow.appendChild(_get_backendInput__aprlh1(this));
    toolbar.appendChild(grow);
    toolbar.appendChild(button('Health check', VOID, DomApp$mount$lambda_0));
    toolbar.appendChild(button('Refresh now', 'secondary', DomApp$mount$lambda_1));
    this.cl_1 = el('span', 'refresh-status', '\u2014');
    toolbar.appendChild(_get_refreshStatus__lkfg78(this));
    root.appendChild(toolbar);
    var nav = el('nav', 'nav');
    this.xl_1.o2();
    // Inline function 'kotlin.collections.plusAssign' call
    var this_0 = this.xl_1;
    var element = tabButton(this, 'Map', 0, true, DomApp$mount$lambda_2);
    this_0.d(element);
    // Inline function 'kotlin.collections.plusAssign' call
    var this_1 = this.xl_1;
    var element_0 = tabButton(this, 'Network state', 1, false, DomApp$mount$lambda_3);
    this_1.d(element_0);
    // Inline function 'kotlin.collections.plusAssign' call
    var this_2 = this.xl_1;
    var element_1 = tabButton(this, 'History', 2, false, DomApp$mount$lambda_4);
    this_2.d(element_1);
    // Inline function 'kotlin.collections.plusAssign' call
    var this_3 = this.xl_1;
    var element_2 = tabButton(this, 'Agent settings', 3, false, DomApp$mount$lambda_5);
    this_3.d(element_2);
    // Inline function 'kotlin.collections.forEach' call
    var tmp0_iterator = this.xl_1.f();
    while (tmp0_iterator.g()) {
      var element_3 = tmp0_iterator.h();
      // Inline function 'pl.edu.wat.uavlogistics.frontend.dom.DomApp.mount.<anonymous>' call
      nav.appendChild(element_3);
    }
    root.appendChild(nav);
    this.el_1 = el('section', 'page panel active-page');
    buildMapPage(this, _get_pageMap__lnrq1o(this));
    root.appendChild(_get_pageMap__lnrq1o(this));
    this.fl_1 = el('section', 'page panel');
    this.kl_1 = el('div');
    _get_pageState__cksdt(this).appendChild(_get_stateHost__pqu4iw(this));
    root.appendChild(_get_pageState__cksdt(this));
    this.gl_1 = el('section', 'page panel');
    this.ll_1 = el('div');
    _get_pageHistory__odwogk(this).appendChild(buildHistoryPage(this, _get_historyHost__5g1wln(this)));
    root.appendChild(_get_pageHistory__odwogk(this));
    this.hl_1 = el('section', 'page panel');
    var tmp_2 = this;
    var tmp_3 = DomApp$mount$lambda_6;
    var tmp_4 = DomApp$mount$lambda_7;
    tmp_2.il_1 = new DomAgentSettings(this.al_1, tmp_3, tmp_4, DomApp$mount$lambda_8);
    _get_pageSettings__m12d2x(this).appendChild(_get_agentSettings__dv75op(this).so());
    root.appendChild(_get_pageSettings__m12d2x(this));
    var logPanel = el('section', 'panel output-panel');
    logPanel.appendChild(el('h3', null, 'Log'));
    this.dl_1 = logPre();
    _get_logPre__rl3k5w(this).textContent = 'Ready.';
    logPanel.appendChild(_get_logPre__rl3k5w(this));
    root.appendChild(logPanel);
    var tmp_5 = this;
    var tmp0_scope = this.al_1;
    var tmp_6 = DomApp$mount$lambda_9;
    var tmp_7 = DomApp$mount$lambda_10;
    var tmp_8 = DomApp$mount$lambda_11;
    var tmp_9 = DomApp$mount$lambda_12;
    tmp_5.ql_1 = new DomRegisterModal(tmp0_scope, tmp_6, tmp_7, tmp_8, tmp_9, DomApp$mount$lambda_13);
    root.appendChild(_get_modal__e5yiws(this).so());
    launch(this.al_1, VOID, VOID, DomApp$mount$slambda_0(null));
  };
  var DomApp_instance;
  function DomApp_getInstance() {
    if (DomApp_instance == null)
      new DomApp();
    return DomApp_instance;
  }
  function replaceChildren(_this__u8e3s4) {
    return clearChildren(_this__u8e3s4);
  }
  function el(tag, className, text) {
    className = className === VOID ? null : className;
    text = text === VOID ? null : text;
    var tmp = document.createElement(tag);
    var node = tmp instanceof HTMLElement ? tmp : THROW_CCE();
    if (!(className == null)) {
      node.className = className;
    }
    if (!(text == null)) {
      node.textContent = text;
    }
    return node;
  }
  function button(label, className, onClick) {
    className = className === VOID ? null : className;
    var node = el('button', className, label);
    node.onclick = button$lambda(onClick);
    return node;
  }
  function labeledInput(label, value, type, onChange) {
    value = value === VOID ? '' : value;
    type = type === VOID ? 'text' : type;
    onChange = onChange === VOID ? null : onChange;
    var tmp = document.createElement('label');
    var labelEl = tmp instanceof HTMLLabelElement ? tmp : THROW_CCE();
    labelEl.textContent = label;
    var tmp_0 = document.createElement('input');
    var input = tmp_0 instanceof HTMLInputElement ? tmp_0 : THROW_CCE();
    input.type = type;
    input.value = value;
    if (!(onChange == null)) {
      input.oninput = labeledInput$lambda(onChange, input);
    }
    return to(labelEl, input);
  }
  function labeledCheckbox(label, checked, onChange) {
    var wrap = el('label');
    var tmp = document.createElement('input');
    var input = tmp instanceof HTMLInputElement ? tmp : THROW_CCE();
    input.type = 'checkbox';
    input.checked = checked;
    input.onchange = labeledCheckbox$lambda(onChange, input);
    wrap.appendChild(input);
    wrap.append(' ' + label);
    return wrap;
  }
  function clearChildren(_this__u8e3s4) {
    while (!(_this__u8e3s4.firstChild == null)) {
      _this__u8e3s4.removeChild(ensureNotNull(_this__u8e3s4.firstChild));
    }
  }
  function failureMessage(cause) {
    var tmp0_safe_receiver = cause.message;
    var tmp;
    if (tmp0_safe_receiver == null) {
      tmp = null;
    } else {
      // Inline function 'kotlin.takeIf' call
      // Inline function 'kotlin.contracts.contract' call
      var tmp_0;
      // Inline function 'pl.edu.wat.uavlogistics.frontend.dom.failureMessage.<anonymous>' call
      // Inline function 'kotlin.text.isNotBlank' call
      if (!isBlank(tmp0_safe_receiver)) {
        tmp_0 = tmp0_safe_receiver;
      } else {
        tmp_0 = null;
      }
      tmp = tmp_0;
    }
    var tmp1_elvis_lhs = tmp;
    return tmp1_elvis_lhs == null ? cause.toString() : tmp1_elvis_lhs;
  }
  function logPre() {
    var tmp = document.createElement('pre');
    return tmp instanceof HTMLPreElement ? tmp : THROW_CCE();
  }
  function button$lambda($onClick) {
    return function (it) {
      $onClick();
      return null;
    };
  }
  function labeledInput$lambda($onChange, $input) {
    return function (it) {
      $onChange($input.value);
      return null;
    };
  }
  function labeledCheckbox$lambda($onChange, $input) {
    return function (it) {
      $onChange($input.checked);
      return null;
    };
  }
  function zoomAt($this, screenX, screenY, factor) {
    var _destruct__k2r9zo = screenToWorld($this, screenX, screenY);
    var wx = _destruct__k2r9zo.ua();
    var wy = _destruct__k2r9zo.va();
    var newZoom = coerceIn($this.ur_1 * factor, 0.35, 12.0);
    $this.ur_1 = newZoom;
    $this.sr_1 = screenX - wx * $this.ur_1;
    $this.tr_1 = screenY - wy * $this.ur_1;
    updateView($this);
  }
  function updateView($this) {
    $this.jr_1.setAttribute('transform', 'translate(' + $this.sr_1 + ' ' + $this.tr_1 + ') scale(' + $this.ur_1 + ')');
    renderGrid($this);
    renderRangeDiscs($this);
    renderMarkers($this);
    var tmp0_safe_receiver = $this.as_1;
    if (tmp0_safe_receiver == null)
      null;
    else {
      // Inline function 'kotlin.let' call
      // Inline function 'kotlin.contracts.contract' call
      var _destruct__k2r9zo = pointScreenPosition($this, tmp0_safe_receiver);
      var sx = _destruct__k2r9zo.ua();
      var sy = _destruct__k2r9zo.va();
      showTooltip($this, tmp0_safe_receiver, sx, sy);
    }
  }
  function renderGrid($this) {
    while (!($this.kr_1.firstChild == null)) {
      $this.kr_1.removeChild(ensureNotNull($this.kr_1.firstChild));
    }
    var bounds = $this.qr_1;
    var _destruct__k2r9zo = screenToWorld($this, 0.0, 0.0);
    var wx0 = _destruct__k2r9zo.ua();
    var wy0 = _destruct__k2r9zo.va();
    var _destruct__k2r9zo_0 = screenToWorld($this, 960.0, 520.0);
    var wx1 = _destruct__k2r9zo_0.ua();
    var wy1 = _destruct__k2r9zo_0.va();
    // Inline function 'kotlin.math.min' call
    var minWx = Math.min(wx0, wx1);
    // Inline function 'kotlin.math.max' call
    var maxWx = Math.max(wx0, wx1);
    // Inline function 'kotlin.math.min' call
    var minWy = Math.min(wy0, wy1);
    // Inline function 'kotlin.math.max' call
    var maxWy = Math.max(wy0, wy1);
    var worldW = maxWx - minWx;
    var worldH = maxWy - minWy;
    if (worldW <= 0.0 || worldH <= 0.0)
      return Unit_instance;
    var geoCorners = filterNotNull(listOf([worldToGeo($this, minWx, minWy, bounds), worldToGeo($this, maxWx, minWy, bounds), worldToGeo($this, minWx, maxWy, bounds), worldToGeo($this, maxWx, maxWy, bounds)]));
    if (geoCorners.q())
      return Unit_instance;
    // Inline function 'kotlin.collections.minOf' call
    var iterator = geoCorners.f();
    if (!iterator.g())
      throw NoSuchElementException_init_$Create$();
    // Inline function 'pl.edu.wat.uavlogistics.frontend.dom.DomMapView.renderGrid.<anonymous>' call
    var minValue = iterator.h().vp_1;
    while (iterator.g()) {
      // Inline function 'pl.edu.wat.uavlogistics.frontend.dom.DomMapView.renderGrid.<anonymous>' call
      var v = iterator.h().vp_1;
      // Inline function 'kotlin.comparisons.minOf' call
      var a = minValue;
      minValue = Math.min(a, v);
    }
    var visMinLon = minValue;
    // Inline function 'kotlin.collections.maxOf' call
    var iterator_0 = geoCorners.f();
    if (!iterator_0.g())
      throw NoSuchElementException_init_$Create$();
    // Inline function 'pl.edu.wat.uavlogistics.frontend.dom.DomMapView.renderGrid.<anonymous>' call
    var maxValue = iterator_0.h().vp_1;
    while (iterator_0.g()) {
      // Inline function 'pl.edu.wat.uavlogistics.frontend.dom.DomMapView.renderGrid.<anonymous>' call
      var v_0 = iterator_0.h().vp_1;
      // Inline function 'kotlin.comparisons.maxOf' call
      var a_0 = maxValue;
      maxValue = Math.max(a_0, v_0);
    }
    var visMaxLon = maxValue;
    // Inline function 'kotlin.collections.minOf' call
    var iterator_1 = geoCorners.f();
    if (!iterator_1.g())
      throw NoSuchElementException_init_$Create$();
    // Inline function 'pl.edu.wat.uavlogistics.frontend.dom.DomMapView.renderGrid.<anonymous>' call
    var minValue_0 = iterator_1.h().up_1;
    while (iterator_1.g()) {
      // Inline function 'pl.edu.wat.uavlogistics.frontend.dom.DomMapView.renderGrid.<anonymous>' call
      var v_1 = iterator_1.h().up_1;
      // Inline function 'kotlin.comparisons.minOf' call
      var a_1 = minValue_0;
      minValue_0 = Math.min(a_1, v_1);
    }
    var visMinLat = minValue_0;
    // Inline function 'kotlin.collections.maxOf' call
    var iterator_2 = geoCorners.f();
    if (!iterator_2.g())
      throw NoSuchElementException_init_$Create$();
    // Inline function 'pl.edu.wat.uavlogistics.frontend.dom.DomMapView.renderGrid.<anonymous>' call
    var maxValue_0 = iterator_2.h().up_1;
    while (iterator_2.g()) {
      // Inline function 'pl.edu.wat.uavlogistics.frontend.dom.DomMapView.renderGrid.<anonymous>' call
      var v_2 = iterator_2.h().up_1;
      // Inline function 'kotlin.comparisons.maxOf' call
      var a_2 = maxValue_0;
      maxValue_0 = Math.max(a_2, v_2);
    }
    var visMaxLat = maxValue_0;
    // Inline function 'kotlin.takeIf' call
    var this_0 = visMaxLon - visMinLon;
    // Inline function 'kotlin.contracts.contract' call
    var tmp;
    // Inline function 'pl.edu.wat.uavlogistics.frontend.dom.DomMapView.renderGrid.<anonymous>' call
    if (this_0 > 0.0) {
      tmp = this_0;
    } else {
      tmp = null;
    }
    var tmp0_elvis_lhs = tmp;
    var tmp_0;
    if (tmp0_elvis_lhs == null) {
      return Unit_instance;
    } else {
      tmp_0 = tmp0_elvis_lhs;
    }
    var visLonRange = tmp_0;
    // Inline function 'kotlin.takeIf' call
    var this_1 = visMaxLat - visMinLat;
    // Inline function 'kotlin.contracts.contract' call
    var tmp_1;
    // Inline function 'pl.edu.wat.uavlogistics.frontend.dom.DomMapView.renderGrid.<anonymous>' call
    if (this_1 > 0.0) {
      tmp_1 = this_1;
    } else {
      tmp_1 = null;
    }
    var tmp1_elvis_lhs = tmp_1;
    var tmp_2;
    if (tmp1_elvis_lhs == null) {
      return Unit_instance;
    } else {
      tmp_2 = tmp1_elvis_lhs;
    }
    var visLatRange = tmp_2;
    var lonStep = niceGeoStep($this, 80.0 / $this.ur_1 * visLonRange / worldW);
    var latStep = niceGeoStep($this, 80.0 / $this.ur_1 * visLatRange / worldH);
    var lineMinWx = minWx - worldW * 0.01;
    var lineMaxWx = maxWx + worldW * 0.01;
    var lineMinWy = minWy - worldH * 0.01;
    var lineMaxWy = maxWy + worldH * 0.01;
    drawGridMeridians$default($this, visMinLon, visMaxLon, lonStep, lineMinWy, lineMaxWy, minWx, maxWx, true);
    drawGridParallels$default($this, visMinLat, visMaxLat, latStep, lineMinWx, lineMaxWx, minWy, maxWy, true);
    var minorLonStep = lonStep / 5.0;
    var minorLatStep = latStep / 5.0;
    if (minorLonStep * worldW / visLonRange * $this.ur_1 >= 24.0) {
      drawGridMeridians($this, visMinLon, visMaxLon, minorLonStep, lineMinWy, lineMaxWy, minWx, maxWx, false, lonStep);
    }
    if (minorLatStep * worldH / visLatRange * $this.ur_1 >= 24.0) {
      drawGridParallels($this, visMinLat, visMaxLat, minorLatStep, lineMinWx, lineMaxWx, minWy, maxWy, false, latStep);
    }
  }
  function drawGridMeridians($this, visMinLon, visMaxLon, step, lineMinWy, lineMaxWy, minWx, maxWx, major, skipMultipleOf) {
    if (step <= 0.0)
      return Unit_instance;
    var lon = snapDown($this, visMinLon - step, step);
    var lonEnd = visMaxLon + step;
    while (lon <= lonEnd) {
      if (skipMultipleOf == null || !isNearMultiple($this, lon, skipMultipleOf)) {
        var x = lonToViewportX($this, lon, visMinLon, visMaxLon, minWx, maxWx);
        $this.kr_1.appendChild(gridLine($this, x, lineMinWy, x, lineMaxWy, major));
      }
      lon = lon + step;
    }
  }
  function drawGridMeridians$default($this, visMinLon, visMaxLon, step, lineMinWy, lineMaxWy, minWx, maxWx, major, skipMultipleOf, $super) {
    skipMultipleOf = skipMultipleOf === VOID ? null : skipMultipleOf;
    return drawGridMeridians($this, visMinLon, visMaxLon, step, lineMinWy, lineMaxWy, minWx, maxWx, major, skipMultipleOf);
  }
  function drawGridParallels($this, visMinLat, visMaxLat, step, lineMinWx, lineMaxWx, minWy, maxWy, major, skipMultipleOf) {
    if (step <= 0.0)
      return Unit_instance;
    var lat = snapDown($this, visMinLat - step, step);
    var latEnd = visMaxLat + step;
    while (lat <= latEnd) {
      if (skipMultipleOf == null || !isNearMultiple($this, lat, skipMultipleOf)) {
        var y = latToViewportY($this, lat, visMinLat, visMaxLat, minWy, maxWy);
        $this.kr_1.appendChild(gridLine($this, lineMinWx, y, lineMaxWx, y, major));
      }
      lat = lat + step;
    }
  }
  function drawGridParallels$default($this, visMinLat, visMaxLat, step, lineMinWx, lineMaxWx, minWy, maxWy, major, skipMultipleOf, $super) {
    skipMultipleOf = skipMultipleOf === VOID ? null : skipMultipleOf;
    return drawGridParallels($this, visMinLat, visMaxLat, step, lineMinWx, lineMaxWx, minWy, maxWy, major, skipMultipleOf);
  }
  function lonToViewportX($this, lon, minLon, maxLon, minWx, maxWx) {
    // Inline function 'kotlin.takeIf' call
    var this_0 = maxLon - minLon;
    // Inline function 'kotlin.contracts.contract' call
    var tmp;
    // Inline function 'pl.edu.wat.uavlogistics.frontend.dom.DomMapView.lonToViewportX.<anonymous>' call
    if (this_0 > 0.0) {
      tmp = this_0;
    } else {
      tmp = null;
    }
    var tmp0_elvis_lhs = tmp;
    var tmp_0;
    if (tmp0_elvis_lhs == null) {
      return minWx;
    } else {
      tmp_0 = tmp0_elvis_lhs;
    }
    var range = tmp_0;
    return minWx + (lon - minLon) / range * (maxWx - minWx);
  }
  function latToViewportY($this, lat, minLat, maxLat, minWy, maxWy) {
    // Inline function 'kotlin.takeIf' call
    var this_0 = maxLat - minLat;
    // Inline function 'kotlin.contracts.contract' call
    var tmp;
    // Inline function 'pl.edu.wat.uavlogistics.frontend.dom.DomMapView.latToViewportY.<anonymous>' call
    if (this_0 > 0.0) {
      tmp = this_0;
    } else {
      tmp = null;
    }
    var tmp0_elvis_lhs = tmp;
    var tmp_0;
    if (tmp0_elvis_lhs == null) {
      return maxWy;
    } else {
      tmp_0 = tmp0_elvis_lhs;
    }
    var range = tmp_0;
    return maxWy - (lat - minLat) / range * (maxWy - minWy);
  }
  function renderRangeDiscs($this) {
    while (!($this.lr_1.firstChild == null)) {
      $this.lr_1.removeChild(ensureNotNull($this.lr_1.firstChild));
    }
    // Inline function 'kotlin.collections.forEach' call
    var tmp0_iterator = listOf([MapRangePurpose_INTER_STATION_getInstance(), MapRangePurpose_PACKAGE_PICKUP_getInstance()]).f();
    while (tmp0_iterator.g()) {
      var element = tmp0_iterator.h();
      // Inline function 'pl.edu.wat.uavlogistics.frontend.dom.DomMapView.renderRangeDiscs.<anonymous>' call
      // Inline function 'kotlin.collections.forEach' call
      var tmp0_iterator_0 = get_MAP_RANGE_VEHICLE_TYPES().f();
      while (tmp0_iterator_0.g()) {
        var element_0 = tmp0_iterator_0.h();
        // Inline function 'pl.edu.wat.uavlogistics.frontend.dom.DomMapView.renderRangeDiscs.<anonymous>.<anonymous>' call
        // Inline function 'kotlin.collections.filter' call
        // Inline function 'kotlin.collections.filterTo' call
        var this_0 = $this.pr_1;
        var destination = ArrayList_init_$Create$();
        var tmp0_iterator_1 = this_0.f();
        while (tmp0_iterator_1.g()) {
          var element_1 = tmp0_iterator_1.h();
          // Inline function 'pl.edu.wat.uavlogistics.frontend.dom.DomMapView.renderRangeDiscs.<anonymous>.<anonymous>.<anonymous>' call
          if (equals_0(element_1.fx_1, element_0, true) && element_1.gx_1.equals(element)) {
            destination.d(element_1);
          }
        }
        var typeDiscs = destination;
        var style = vehicleRangeStyle($this, element_0, element);
        var strokeWidth = coerceIn(1.5 / $this.ur_1, 0.75, 2.5);
        // Inline function 'kotlin.collections.forEach' call
        var tmp0_iterator_2 = clusterOverlappingRangeDiscs(typeDiscs).f();
        while (tmp0_iterator_2.g()) {
          var element_2 = tmp0_iterator_2.h();
          $l$block_0: {
            // Inline function 'pl.edu.wat.uavlogistics.frontend.dom.DomMapView.renderRangeDiscs.<anonymous>.<anonymous>.<anonymous>' call
            // Inline function 'kotlin.text.buildString' call
            // Inline function 'kotlin.contracts.contract' call
            // Inline function 'kotlin.apply' call
            var this_1 = StringBuilder_init_$Create$();
            // Inline function 'kotlin.contracts.contract' call
            // Inline function 'pl.edu.wat.uavlogistics.frontend.dom.DomMapView.renderRangeDiscs.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
            // Inline function 'kotlin.collections.forEach' call
            var tmp0_iterator_3 = element_2.f();
            while (tmp0_iterator_3.g()) {
              var element_3 = tmp0_iterator_3.h();
              $l$block: {
                // Inline function 'pl.edu.wat.uavlogistics.frontend.dom.DomMapView.renderRangeDiscs.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
                var _destruct__k2r9zo = project($this, element_3.hx_1, element_3.ix_1, $this.qr_1);
                var wx = _destruct__k2r9zo.ua();
                var wy = _destruct__k2r9zo.va();
                var radiusWorld = rangeWorldRadius($this, element_3);
                if (!isFinite(radiusWorld) || radiusWorld <= 0.0) {
                  break $l$block;
                }
                this_1.t5(circleWorldPath(wx, wy, radiusWorld));
              }
            }
            var pathData = this_1.toString();
            if (isBlank(pathData)) {
              break $l$block_0;
            }
            var tmp = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            var shape = tmp instanceof SVGPathElement ? tmp : THROW_CCE();
            // Inline function 'kotlin.text.trim' call
            var tmp$ret$7 = toString(trim(isCharSequence(pathData) ? pathData : THROW_CCE()));
            shape.setAttribute('d', tmp$ret$7);
            shape.setAttribute('fill', style.lx_1);
            shape.setAttribute('fill-rule', 'nonzero');
            shape.setAttribute('stroke', style.mx_1);
            shape.setAttribute('stroke-width', strokeWidth.toString());
            if (element.equals(MapRangePurpose_INTER_STATION_getInstance())) {
              var dash = coerceIn(8.0 / $this.ur_1, 4.0, 14.0);
              shape.setAttribute('stroke-dasharray', '' + dash + ' ' + dash);
            }
            // Inline function 'kotlin.text.buildString' call
            // Inline function 'kotlin.contracts.contract' call
            // Inline function 'kotlin.apply' call
            var this_2 = StringBuilder_init_$Create$();
            // Inline function 'kotlin.contracts.contract' call
            // Inline function 'pl.edu.wat.uavlogistics.frontend.dom.DomMapView.renderRangeDiscs.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
            // Inline function 'kotlin.text.lowercase' call
            // Inline function 'kotlin.js.asDynamic' call
            var tmp$ret$9 = element.a1_1.toLowerCase();
            this_2.t5('map-range-' + tmp$ret$9);
            if (element_2.i() > 1) {
              this_2.t5(' map-range-merged');
            }
            var shapeClass = this_2.toString();
            shape.setAttribute('class', shapeClass);
            if (element_2.i() > 1) {
              shape.setAttribute('stroke-linejoin', 'round');
            }
            $this.lr_1.appendChild(shape);
          }
        }
      }
    }
  }
  function renderMarkers($this) {
    while (!($this.mr_1.firstChild == null)) {
      $this.mr_1.removeChild(ensureNotNull($this.mr_1.firstChild));
    }
    var markerRadius = 10.0 / $this.ur_1;
    var hitRadius = 14.0 / $this.ur_1;
    // Inline function 'kotlin.collections.forEach' call
    var tmp0_iterator = $this.or_1.f();
    while (tmp0_iterator.g()) {
      var element = tmp0_iterator.h();
      // Inline function 'pl.edu.wat.uavlogistics.frontend.dom.DomMapView.renderMarkers.<anonymous>' call
      var _destruct__k2r9zo = project($this, element.qx_1, element.rx_1, $this.qr_1);
      var wx = _destruct__k2r9zo.ua();
      var wy = _destruct__k2r9zo.va();
      var tmp;
      switch (element.sx_1.b1_1) {
        case 0:
          tmp = '#34d399';
          break;
        case 1:
          tmp = agentMarkerColor($this, element.tx_1);
          break;
        case 2:
          tmp = '#f59e0b';
          break;
        default:
          noWhenBranchMatchedException();
          break;
      }
      var color = tmp;
      var tmp_0 = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      var group = tmp_0 instanceof SVGGElement ? tmp_0 : THROW_CCE();
      group.setAttribute('class', 'map-marker');
      // Inline function 'kotlin.js.asDynamic' call
      group.mapPoint = element;
      var hit = circle($this, wx, wy, hitRadius, 'transparent', '0');
      var dot = circle($this, wx, wy, markerRadius, color, coerceIn(2.0 / $this.ur_1, 0.75, 3.0).toString());
      group.appendChild(hit);
      group.appendChild(dot);
      $this.mr_1.appendChild(group);
    }
  }
  function updateHover($this, screenX, screenY) {
    var tmp$ret$0;
    $l$block_0: {
      // Inline function 'kotlin.collections.minByOrNull' call
      var iterator = $this.or_1.f();
      if (!iterator.g()) {
        tmp$ret$0 = null;
        break $l$block_0;
      }
      var minElem = iterator.h();
      if (!iterator.g()) {
        tmp$ret$0 = minElem;
        break $l$block_0;
      }
      // Inline function 'pl.edu.wat.uavlogistics.frontend.dom.DomMapView.updateHover.<anonymous>' call
      var point = minElem;
      var _destruct__k2r9zo = pointScreenPosition($this, point);
      var px = _destruct__k2r9zo.ua();
      var py = _destruct__k2r9zo.va();
      // Inline function 'kotlin.math.hypot' call
      var x = px - screenX;
      var y = py - screenY;
      var minValue = hypot(x, y);
      do {
        var e = iterator.h();
        // Inline function 'pl.edu.wat.uavlogistics.frontend.dom.DomMapView.updateHover.<anonymous>' call
        var _destruct__k2r9zo_0 = pointScreenPosition($this, e);
        var px_0 = _destruct__k2r9zo_0.ua();
        var py_0 = _destruct__k2r9zo_0.va();
        // Inline function 'kotlin.math.hypot' call
        var x_0 = px_0 - screenX;
        var y_0 = py_0 - screenY;
        var v = hypot(x_0, y_0);
        if (compareTo(minValue, v) > 0) {
          minElem = e;
          minValue = v;
        }
      }
       while (iterator.g());
      tmp$ret$0 = minElem;
    }
    var tmp0_safe_receiver = tmp$ret$0;
    var tmp;
    if (tmp0_safe_receiver == null) {
      tmp = null;
    } else {
      // Inline function 'kotlin.takeIf' call
      // Inline function 'kotlin.contracts.contract' call
      var tmp_0;
      // Inline function 'pl.edu.wat.uavlogistics.frontend.dom.DomMapView.updateHover.<anonymous>' call
      var _destruct__k2r9zo_1 = pointScreenPosition($this, tmp0_safe_receiver);
      var px_1 = _destruct__k2r9zo_1.ua();
      var py_1 = _destruct__k2r9zo_1.va();
      // Inline function 'kotlin.math.hypot' call
      var x_1 = px_1 - screenX;
      var y_1 = py_1 - screenY;
      if (hypot(x_1, y_1) <= 14.0) {
        tmp_0 = tmp0_safe_receiver;
      } else {
        tmp_0 = null;
      }
      tmp = tmp_0;
    }
    var hit = tmp;
    var tmp_1 = hit == null ? null : hit.nx_1;
    var tmp2_safe_receiver = $this.as_1;
    if (!(tmp_1 == (tmp2_safe_receiver == null ? null : tmp2_safe_receiver.nx_1))) {
      $this.as_1 = hit;
      if (!(hit == null)) {
        showTooltip($this, hit, screenX, screenY);
      } else {
        hideTooltip($this);
      }
    } else {
      if (!(hit == null)) {
        moveTooltip($this, screenX, screenY);
      }
    }
  }
  function showTooltip($this, point, screenX, screenY) {
    $this.nr_1.classList.remove('hidden');
    clearChildren_0($this, $this.nr_1);
    var tmp;
    switch (point.sx_1.b1_1) {
      case 0:
        tmp = 'Station';
        break;
      case 1:
        tmp = 'Agent';
        break;
      case 2:
        tmp = 'Package';
        break;
      default:
        noWhenBranchMatchedException();
        break;
    }
    var kind = tmp;
    $this.nr_1.appendChild(el('strong', 'map-tooltip-title', kind + ' \xB7 ' + point.ox_1));
    // Inline function 'kotlin.collections.forEach' call
    var tmp0_iterator = split(point.px_1, ['\n']).f();
    while (tmp0_iterator.g()) {
      var element = tmp0_iterator.h();
      // Inline function 'pl.edu.wat.uavlogistics.frontend.dom.DomMapView.showTooltip.<anonymous>' call
      // Inline function 'kotlin.text.isNotBlank' call
      if (!isBlank(element)) {
        $this.nr_1.appendChild(el('div', 'map-tooltip-line', element));
      }
    }
    moveTooltip($this, screenX, screenY);
  }
  function moveTooltip($this, screenX, screenY) {
    var rect = $this.gr_1.getBoundingClientRect();
    var scaleX = rect.width / 960.0;
    var scaleY = rect.height / 520.0;
    var left = screenX * scaleX + 14.0;
    var top = screenY * scaleY - 12.0;
    // Inline function 'kotlin.js.asDynamic' call
    $this.nr_1.style.left = '' + left + 'px';
    // Inline function 'kotlin.js.asDynamic' call
    $this.nr_1.style.top = '' + top + 'px';
  }
  function hideTooltip($this) {
    $this.nr_1.classList.add('hidden');
    $this.as_1 = null;
  }
  function pointScreenPosition($this, point) {
    var _destruct__k2r9zo = project($this, point.qx_1, point.rx_1, $this.qr_1);
    var wx = _destruct__k2r9zo.ua();
    var wy = _destruct__k2r9zo.va();
    return worldToScreen($this, wx, wy);
  }
  function rangeWorldRadius($this, disc) {
    var bounds = $this.qr_1;
    var _destruct__k2r9zo = project($this, disc.hx_1, disc.ix_1, bounds);
    var cx = _destruct__k2r9zo.ua();
    var cy = _destruct__k2r9zo.va();
    var eastX = project($this, disc.hx_1, disc.ix_1 + metersToLonDegrees(disc.jx_1, disc.hx_1), bounds).ua();
    var northY = project($this, disc.hx_1 + metersToLatDegrees(disc.jx_1), disc.ix_1, bounds).va();
    // Inline function 'kotlin.math.abs' call
    var x = eastX - cx;
    var radiusEast = Math.abs(x);
    // Inline function 'kotlin.math.abs' call
    var x_0 = northY - cy;
    var radiusNorth = Math.abs(x_0);
    return (radiusEast + radiusNorth) / 2.0;
  }
  function VehicleRangeStyle(fill, stroke) {
    this.lx_1 = fill;
    this.mx_1 = stroke;
  }
  protoOf(VehicleRangeStyle).toString = function () {
    return 'VehicleRangeStyle(fill=' + this.lx_1 + ', stroke=' + this.mx_1 + ')';
  };
  protoOf(VehicleRangeStyle).hashCode = function () {
    var result = getStringHashCode(this.lx_1);
    result = imul(result, 31) + getStringHashCode(this.mx_1) | 0;
    return result;
  };
  protoOf(VehicleRangeStyle).equals = function (other) {
    if (this === other)
      return true;
    if (!(other instanceof VehicleRangeStyle))
      return false;
    var tmp0_other_with_cast = other instanceof VehicleRangeStyle ? other : THROW_CCE();
    if (!(this.lx_1 === tmp0_other_with_cast.lx_1))
      return false;
    if (!(this.mx_1 === tmp0_other_with_cast.mx_1))
      return false;
    return true;
  };
  function vehicleRangeStyle($this, vehicleType, purpose) {
    // Inline function 'kotlin.text.uppercase' call
    // Inline function 'kotlin.js.asDynamic' call
    var tmp;
    if (vehicleType.toUpperCase() === 'UGV') {
      var tmp_0;
      switch (purpose.b1_1) {
        case 1:
          tmp_0 = new VehicleRangeStyle('rgba(192, 132, 252, 0.10)', 'rgba(192, 132, 252, 0.40)');
          break;
        case 0:
          tmp_0 = new VehicleRangeStyle('rgba(192, 132, 252, 0.22)', 'rgba(192, 132, 252, 0.65)');
          break;
        default:
          noWhenBranchMatchedException();
          break;
      }
      tmp = tmp_0;
    } else {
      var tmp_1;
      switch (purpose.b1_1) {
        case 1:
          tmp_1 = new VehicleRangeStyle('rgba(96, 165, 250, 0.10)', 'rgba(96, 165, 250, 0.40)');
          break;
        case 0:
          tmp_1 = new VehicleRangeStyle('rgba(96, 165, 250, 0.22)', 'rgba(96, 165, 250, 0.65)');
          break;
        default:
          noWhenBranchMatchedException();
          break;
      }
      tmp = tmp_1;
    }
    return tmp;
  }
  function agentMarkerColor($this, agentType) {
    var tmp;
    if (agentType == null) {
      tmp = null;
    } else {
      // Inline function 'kotlin.text.uppercase' call
      // Inline function 'kotlin.js.asDynamic' call
      tmp = agentType.toUpperCase();
    }
    return tmp === 'UGV' ? '#c084fc' : '#60a5fa';
  }
  function centerViewOn($this, lat, lon) {
    var _destruct__k2r9zo = project($this, lat, lon, $this.qr_1);
    var wx = _destruct__k2r9zo.ua();
    var wy = _destruct__k2r9zo.va();
    $this.sr_1 = 960.0 / 2.0 - wx * $this.ur_1;
    $this.tr_1 = 520.0 / 2.0 - wy * $this.ur_1;
  }
  function worldToScreen($this, wx, wy) {
    return to($this.sr_1 + wx * $this.ur_1, $this.tr_1 + wy * $this.ur_1);
  }
  function screenToWorld($this, sx, sy) {
    return to((sx - $this.sr_1) / $this.ur_1, (sy - $this.tr_1) / $this.ur_1);
  }
  function geoAt($this, clientX, clientY) {
    var _destruct__k2r9zo = clientToViewBox($this, clientX, clientY);
    var viewX = _destruct__k2r9zo.ua();
    var viewY = _destruct__k2r9zo.va();
    var _destruct__k2r9zo_0 = screenToWorld($this, viewX, viewY);
    var wx = _destruct__k2r9zo_0.ua();
    var wy = _destruct__k2r9zo_0.va();
    return worldToGeo($this, wx, wy, $this.qr_1);
  }
  function clientToViewBox($this, clientX, clientY) {
    var point = $this.ir_1.createSVGPoint();
    point.x = clientX;
    point.y = clientY;
    var tmp0_safe_receiver = $this.ir_1.getScreenCTM();
    var inverse = tmp0_safe_receiver == null ? null : tmp0_safe_receiver.inverse();
    if (!(inverse == null)) {
      var local = point.matrixTransform(inverse);
      return to(local.x, local.y);
    }
    return to(svgOffsetX($this, clientX), svgOffsetY($this, clientY));
  }
  function worldToGeo($this, wx, wy, bounds) {
    var innerW = bounds.yx_1 - bounds.ay_1 * 2;
    var innerH = bounds.zx_1 - bounds.ay_1 * 2;
    if (innerW <= 0.0 || innerH <= 0.0)
      return null;
    // Inline function 'kotlin.takeIf' call
    var this_0 = bounds.xx_1 - bounds.wx_1;
    // Inline function 'kotlin.contracts.contract' call
    var tmp;
    // Inline function 'pl.edu.wat.uavlogistics.frontend.dom.DomMapView.worldToGeo.<anonymous>' call
    if (this_0 > 0.0) {
      tmp = this_0;
    } else {
      tmp = null;
    }
    var tmp0_elvis_lhs = tmp;
    var tmp_0;
    if (tmp0_elvis_lhs == null) {
      return null;
    } else {
      tmp_0 = tmp0_elvis_lhs;
    }
    var lonRange = tmp_0;
    // Inline function 'kotlin.takeIf' call
    var this_1 = bounds.vx_1 - bounds.ux_1;
    // Inline function 'kotlin.contracts.contract' call
    var tmp_1;
    // Inline function 'pl.edu.wat.uavlogistics.frontend.dom.DomMapView.worldToGeo.<anonymous>' call
    if (this_1 > 0.0) {
      tmp_1 = this_1;
    } else {
      tmp_1 = null;
    }
    var tmp1_elvis_lhs = tmp_1;
    var tmp_2;
    if (tmp1_elvis_lhs == null) {
      return null;
    } else {
      tmp_2 = tmp1_elvis_lhs;
    }
    var latRange = tmp_2;
    var lon = bounds.wx_1 + (wx - bounds.ay_1) / innerW * lonRange;
    var lat = bounds.ux_1 + (bounds.zx_1 - bounds.ay_1 - wy) / innerH * latRange;
    return new GeoCoord(lat, lon);
  }
  function svgOffsetX($this, clientX) {
    var rect = $this.ir_1.getBoundingClientRect();
    return (clientX - rect.left) * (960.0 / rect.width);
  }
  function svgOffsetY($this, clientY) {
    var rect = $this.ir_1.getBoundingClientRect();
    return (clientY - rect.top) * (520.0 / rect.height);
  }
  function niceGeoStep($this, approxDegrees) {
    if (!isFinite(approxDegrees) || approxDegrees <= 0.0)
      return 1.0E-6;
    // Inline function 'kotlin.math.floor' call
    // Inline function 'kotlin.math.log10' call
    var x = log10(approxDegrees);
    var exponent = Math.floor(x);
    // Inline function 'kotlin.math.pow' call
    var magnitude = Math.pow(10.0, exponent);
    var normalized = approxDegrees / magnitude;
    var nice = normalized <= 1.0 ? 1.0 : normalized <= 2.0 ? 2.0 : normalized <= 5.0 ? 5.0 : 10.0;
    return nice * magnitude;
  }
  function snapDown($this, value, step) {
    if (step <= 0.0)
      return value;
    // Inline function 'kotlin.math.floor' call
    var x = value / step;
    return Math.floor(x) * step;
  }
  function isNearMultiple($this, value, step) {
    if (step <= 0.0)
      return false;
    var remainder = value % step;
    return remainder < step * 1.0E-6 || step - remainder < step * 1.0E-6;
  }
  function circle($this, cx, cy, r, fill, strokeWidth) {
    var tmp = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    var circle = tmp instanceof SVGCircleElement ? tmp : THROW_CCE();
    circle.setAttribute('cx', cx.toString());
    circle.setAttribute('cy', cy.toString());
    circle.setAttribute('r', r.toString());
    circle.setAttribute('fill', fill);
    if (!(strokeWidth === '0')) {
      circle.setAttribute('stroke', '#0f172a');
      circle.setAttribute('stroke-width', strokeWidth);
    }
    return circle;
  }
  function gridLine($this, x1, y1, x2, y2, major) {
    var tmp = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    var line = tmp instanceof SVGLineElement ? tmp : THROW_CCE();
    line.setAttribute('x1', x1.toString());
    line.setAttribute('y1', y1.toString());
    line.setAttribute('x2', x2.toString());
    line.setAttribute('y2', y2.toString());
    line.setAttribute('stroke', major ? '#334155' : '#1e293b');
    var width = major ? 1.0 : 0.6;
    line.setAttribute('stroke-width', coerceIn(width / $this.ur_1, 0.35, 2.0).toString());
    return line;
  }
  function defaultBounds($this, points) {
    return computeBounds($this, points);
  }
  function computeBounds($this, points) {
    var tmp$ret$0;
    $l$block: {
      // Inline function 'kotlin.collections.minOfOrNull' call
      var iterator = points.f();
      if (!iterator.g()) {
        tmp$ret$0 = null;
        break $l$block;
      }
      // Inline function 'pl.edu.wat.uavlogistics.frontend.dom.DomMapView.computeBounds.<anonymous>' call
      var minValue = iterator.h().qx_1;
      while (iterator.g()) {
        // Inline function 'pl.edu.wat.uavlogistics.frontend.dom.DomMapView.computeBounds.<anonymous>' call
        var v = iterator.h().qx_1;
        // Inline function 'kotlin.comparisons.minOf' call
        var a = minValue;
        minValue = Math.min(a, v);
      }
      tmp$ret$0 = minValue;
    }
    var tmp0_elvis_lhs = tmp$ret$0;
    var minLat = tmp0_elvis_lhs == null ? 47.397971 - 8.0E-4 : tmp0_elvis_lhs;
    var tmp$ret$4;
    $l$block_0: {
      // Inline function 'kotlin.collections.maxOfOrNull' call
      var iterator_0 = points.f();
      if (!iterator_0.g()) {
        tmp$ret$4 = null;
        break $l$block_0;
      }
      // Inline function 'pl.edu.wat.uavlogistics.frontend.dom.DomMapView.computeBounds.<anonymous>' call
      var maxValue = iterator_0.h().qx_1;
      while (iterator_0.g()) {
        // Inline function 'pl.edu.wat.uavlogistics.frontend.dom.DomMapView.computeBounds.<anonymous>' call
        var v_0 = iterator_0.h().qx_1;
        // Inline function 'kotlin.comparisons.maxOf' call
        var a_0 = maxValue;
        maxValue = Math.max(a_0, v_0);
      }
      tmp$ret$4 = maxValue;
    }
    var tmp1_elvis_lhs = tmp$ret$4;
    var maxLat = tmp1_elvis_lhs == null ? 47.397971 + 8.0E-4 : tmp1_elvis_lhs;
    var tmp$ret$8;
    $l$block_1: {
      // Inline function 'kotlin.collections.minOfOrNull' call
      var iterator_1 = points.f();
      if (!iterator_1.g()) {
        tmp$ret$8 = null;
        break $l$block_1;
      }
      // Inline function 'pl.edu.wat.uavlogistics.frontend.dom.DomMapView.computeBounds.<anonymous>' call
      var minValue_0 = iterator_1.h().rx_1;
      while (iterator_1.g()) {
        // Inline function 'pl.edu.wat.uavlogistics.frontend.dom.DomMapView.computeBounds.<anonymous>' call
        var v_1 = iterator_1.h().rx_1;
        // Inline function 'kotlin.comparisons.minOf' call
        var a_1 = minValue_0;
        minValue_0 = Math.min(a_1, v_1);
      }
      tmp$ret$8 = minValue_0;
    }
    var tmp2_elvis_lhs = tmp$ret$8;
    var minLon = tmp2_elvis_lhs == null ? 8.546164 - 8.0E-4 : tmp2_elvis_lhs;
    var tmp$ret$12;
    $l$block_2: {
      // Inline function 'kotlin.collections.maxOfOrNull' call
      var iterator_2 = points.f();
      if (!iterator_2.g()) {
        tmp$ret$12 = null;
        break $l$block_2;
      }
      // Inline function 'pl.edu.wat.uavlogistics.frontend.dom.DomMapView.computeBounds.<anonymous>' call
      var maxValue_0 = iterator_2.h().rx_1;
      while (iterator_2.g()) {
        // Inline function 'pl.edu.wat.uavlogistics.frontend.dom.DomMapView.computeBounds.<anonymous>' call
        var v_2 = iterator_2.h().rx_1;
        // Inline function 'kotlin.comparisons.maxOf' call
        var a_2 = maxValue_0;
        maxValue_0 = Math.max(a_2, v_2);
      }
      tmp$ret$12 = maxValue_0;
    }
    var tmp3_elvis_lhs = tmp$ret$12;
    var maxLon = tmp3_elvis_lhs == null ? 8.546164 + 8.0E-4 : tmp3_elvis_lhs;
    var latSpan = maxLat - minLat;
    var lonSpan = maxLon - minLon;
    // Inline function 'kotlin.math.max' call
    var a_3 = 8.0E-4 * 0.5;
    var b = latSpan * 0.15;
    var tmp = minLat - Math.max(a_3, b);
    // Inline function 'kotlin.math.max' call
    var a_4 = 8.0E-4 * 0.5;
    var b_0 = latSpan * 0.15;
    var tmp_0 = maxLat + Math.max(a_4, b_0);
    // Inline function 'kotlin.math.max' call
    var a_5 = 8.0E-4 * 0.5;
    var b_1 = lonSpan * 0.15;
    var tmp_1 = minLon - Math.max(a_5, b_1);
    // Inline function 'kotlin.math.max' call
    var a_6 = 8.0E-4 * 0.5;
    var b_2 = lonSpan * 0.15;
    var tmp$ret$19 = Math.max(a_6, b_2);
    return new MapBounds(tmp, tmp_0, tmp_1, maxLon + tmp$ret$19, 960.0, 520.0, 48.0);
  }
  function project($this, lat, lon, bounds) {
    // Inline function 'kotlin.takeIf' call
    var this_0 = bounds.xx_1 - bounds.wx_1;
    // Inline function 'kotlin.contracts.contract' call
    var tmp;
    // Inline function 'pl.edu.wat.uavlogistics.frontend.dom.DomMapView.project.<anonymous>' call
    if (this_0 > 0.0) {
      tmp = this_0;
    } else {
      tmp = null;
    }
    var tmp0_elvis_lhs = tmp;
    var lonRange = tmp0_elvis_lhs == null ? 1.0 : tmp0_elvis_lhs;
    // Inline function 'kotlin.takeIf' call
    var this_1 = bounds.vx_1 - bounds.ux_1;
    // Inline function 'kotlin.contracts.contract' call
    var tmp_0;
    // Inline function 'pl.edu.wat.uavlogistics.frontend.dom.DomMapView.project.<anonymous>' call
    if (this_1 > 0.0) {
      tmp_0 = this_1;
    } else {
      tmp_0 = null;
    }
    var tmp1_elvis_lhs = tmp_0;
    var latRange = tmp1_elvis_lhs == null ? 1.0 : tmp1_elvis_lhs;
    var x = bounds.ay_1 + (lon - bounds.wx_1) / lonRange * (bounds.yx_1 - bounds.ay_1 * 2);
    var y = bounds.zx_1 - bounds.ay_1 - (lat - bounds.ux_1) / latRange * (bounds.zx_1 - bounds.ay_1 * 2);
    return to(x, y);
  }
  function clearChildren_0($this, node) {
    while (!(node.firstChild == null)) {
      node.removeChild(ensureNotNull(node.firstChild));
    }
  }
  function DomMapView$lambda(this$0) {
    return function (event) {
      var tmp;
      if (this$0.rr_1 == null) {
        this$0.vr_1 = true;
        this$0.gr_1.classList.add('map-dragging');
        hideTooltip(this$0);
        this$0.wr_1 = event.clientX;
        this$0.xr_1 = event.clientY;
        this$0.yr_1 = this$0.sr_1;
        this$0.zr_1 = this$0.tr_1;
        tmp = Unit_instance;
      }
      return null;
    };
  }
  function DomMapView$lambda_0(this$0) {
    return function (event) {
      var _destruct__k2r9zo = clientToViewBox(this$0, event.clientX, event.clientY);
      var sx = _destruct__k2r9zo.ua();
      var sy = _destruct__k2r9zo.va();
      var tmp;
      if (this$0.vr_1) {
        this$0.sr_1 = this$0.yr_1 + (event.clientX - this$0.wr_1);
        this$0.tr_1 = this$0.zr_1 + (event.clientY - this$0.xr_1);
        updateView(this$0);
        tmp = Unit_instance;
      } else {
        updateHover(this$0, sx, sy);
        tmp = Unit_instance;
      }
      return null;
    };
  }
  function DomMapView$lambda_1(this$0) {
    return function (it) {
      this$0.vr_1 = false;
      this$0.gr_1.classList.remove('map-dragging');
      return null;
    };
  }
  function DomMapView$lambda_2(this$0) {
    return function (it) {
      this$0.vr_1 = false;
      this$0.gr_1.classList.remove('map-dragging');
      hideTooltip(this$0);
      return null;
    };
  }
  function DomMapView$lambda_3(this$0) {
    return function (event) {
      event.preventDefault();
      var _destruct__k2r9zo = clientToViewBox(this$0, event.clientX, event.clientY);
      var sx = _destruct__k2r9zo.ua();
      var sy = _destruct__k2r9zo.va();
      var factor = event.deltaY < 0 ? 1.12 : 1.0 / 1.12;
      zoomAt(this$0, sx, sy, factor);
      return null;
    };
  }
  function DomMapView$lambda_4(this$0) {
    return function (event) {
      var tmp;
      if (!(this$0.rr_1 == null)) {
        var tmp0_safe_receiver = geoAt(this$0, event.clientX, event.clientY);
        if (tmp0_safe_receiver == null)
          null;
        else {
          // Inline function 'kotlin.let' call
          // Inline function 'kotlin.contracts.contract' call
          this$0.hr_1(tmp0_safe_receiver);
        }
        tmp = Unit_instance;
      }
      return null;
    };
  }
  function DomMapView(container, onMapClick) {
    this.gr_1 = container;
    this.hr_1 = onMapClick;
    var tmp = this;
    var tmp_0 = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    tmp.ir_1 = tmp_0 instanceof SVGSVGElement ? tmp_0 : THROW_CCE();
    var tmp_1 = this;
    var tmp_2 = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    tmp_1.jr_1 = tmp_2 instanceof SVGGElement ? tmp_2 : THROW_CCE();
    var tmp_3 = this;
    var tmp_4 = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    tmp_3.kr_1 = tmp_4 instanceof SVGGElement ? tmp_4 : THROW_CCE();
    var tmp_5 = this;
    var tmp_6 = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    tmp_5.lr_1 = tmp_6 instanceof SVGGElement ? tmp_6 : THROW_CCE();
    var tmp_7 = this;
    var tmp_8 = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    tmp_7.mr_1 = tmp_8 instanceof SVGGElement ? tmp_8 : THROW_CCE();
    this.nr_1 = el('div', 'map-tooltip hidden');
    this.or_1 = emptyList();
    this.pr_1 = emptyList();
    this.qr_1 = defaultBounds(this, emptyList());
    this.rr_1 = null;
    this.sr_1 = 0.0;
    this.tr_1 = 0.0;
    this.ur_1 = 1.0;
    this.vr_1 = false;
    this.wr_1 = 0.0;
    this.xr_1 = 0.0;
    this.yr_1 = 0.0;
    this.zr_1 = 0.0;
    this.as_1 = null;
    this.bs_1 = null;
    this.gr_1.className = 'map';
    this.ir_1.setAttribute('viewBox', '0 0 ' + 960.0 + ' ' + 520.0);
    this.ir_1.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    this.lr_1.setAttribute('class', 'map-agent-ranges');
    this.jr_1.appendChild(this.kr_1);
    this.jr_1.appendChild(this.lr_1);
    this.jr_1.appendChild(this.mr_1);
    this.ir_1.appendChild(this.jr_1);
    this.gr_1.appendChild(this.ir_1);
    this.gr_1.appendChild(this.nr_1);
    this.gr_1.onmousedown = DomMapView$lambda(this);
    this.gr_1.onmousemove = DomMapView$lambda_0(this);
    this.gr_1.onmouseup = DomMapView$lambda_1(this);
    this.gr_1.onmouseleave = DomMapView$lambda_2(this);
    this.gr_1.onwheel = DomMapView$lambda_3(this);
    this.ir_1.onclick = DomMapView$lambda_4(this);
  }
  protoOf(DomMapView).dx = function (newPoints, newRangeDiscs) {
    this.or_1 = newPoints;
    this.pr_1 = newRangeDiscs;
    this.qr_1 = computeBounds(this, this.or_1);
    var tmp0_safe_receiver = this.bs_1;
    if (tmp0_safe_receiver == null)
      null;
    else {
      // Inline function 'kotlin.let' call
      // Inline function 'kotlin.contracts.contract' call
      this.bs_1 = null;
      centerViewOn(this, tmp0_safe_receiver.up_1, tmp0_safe_receiver.vp_1);
    }
    updateView(this);
  };
  protoOf(DomMapView).cs = function (coord) {
    this.bs_1 = coord;
  };
  protoOf(DomMapView).zt = function (mode) {
    this.rr_1 = mode;
    this.gr_1.classList.toggle('map-add-mode', !(mode == null));
  };
  protoOf(DomMapView).bv = function () {
    this.sr_1 = 0.0;
    this.tr_1 = 0.0;
    this.ur_1 = 1.0;
    updateView(this);
  };
  protoOf(DomMapView).zu = function () {
    zoomAt(this, 960.0 / 2.0, 520.0 / 2.0, 1.2);
  };
  protoOf(DomMapView).av = function () {
    zoomAt(this, 960.0 / 2.0, 520.0 / 2.0, 1.0 / 1.2);
  };
  function renderForm($this) {
    var tmp0_elvis_lhs = $this.er_1;
    var tmp;
    if (tmp0_elvis_lhs == null) {
      return Unit_instance;
    } else {
      tmp = tmp0_elvis_lhs;
    }
    var state = tmp;
    var tmp_0;
    switch (state.wp_1.b1_1) {
      case 0:
        tmp_0 = 'Register transfer station';
        break;
      case 2:
        tmp_0 = 'Register agent';
        break;
      case 1:
        tmp_0 = 'Create shipment';
        break;
      default:
        noWhenBranchMatchedException();
        break;
    }
    $this.dr_1.textContent = tmp_0;
    replaceChildren_0($this.cr_1);
    if (state.wp_1.b1_1 === 1) {
      $this.cr_1.appendChild(el('p', 'hint', 'Origin: ' + formatCoord_0(state.xp_1.up_1, 5) + ', ' + formatCoord_0(state.xp_1.vp_1, 5)));
    } else {
      $this.cr_1.appendChild(el('p', 'hint', 'Location: ' + formatCoord_0(state.xp_1.up_1, 5) + ', ' + formatCoord_0(state.xp_1.vp_1, 5)));
    }
    switch (state.wp_1.b1_1) {
      case 0:
        renderStationFields($this, state);
        break;
      case 2:
        renderAgentFields($this, state);
        break;
      case 1:
        renderPackageFields($this, state);
        break;
      default:
        noWhenBranchMatchedException();
        break;
    }
  }
  function renderStationFields($this, state) {
    field($this, 'Station ID', state.yp_1, DomRegisterModal$renderStationFields$lambda($this));
    field($this, 'Name', state.zp_1, DomRegisterModal$renderStationFields$lambda_0($this));
    field($this, 'Storage capacity', state.aq_1, DomRegisterModal$renderStationFields$lambda_1($this));
    field($this, 'Parking capacity', state.bq_1, DomRegisterModal$renderStationFields$lambda_2($this));
    $this.cr_1.appendChild(labeledCheckbox('Activate after create', state.cq_1, DomRegisterModal$renderStationFields$lambda_3($this)));
  }
  function renderAgentFields($this, state) {
    field($this, 'Agent ID', state.jq_1, DomRegisterModal$renderAgentFields$lambda($this));
    field($this, 'Type (UAV/UGV)', state.kq_1, DomRegisterModal$renderAgentFields$lambda_0($this));
    field($this, 'Altitude m', state.lq_1, DomRegisterModal$renderAgentFields$lambda_1($this));
    field($this, 'Range m', state.mq_1, DomRegisterModal$renderAgentFields$lambda_2($this));
    field($this, 'Payload kg', state.nq_1, DomRegisterModal$renderAgentFields$lambda_3($this));
    field($this, 'Station ID (optional)', state.oq_1, DomRegisterModal$renderAgentFields$lambda_4($this));
    field($this, 'PX4 instance', state.rq_1, DomRegisterModal$renderAgentFields$lambda_5($this));
    field($this, 'MAVLink port', state.sq_1, DomRegisterModal$renderAgentFields$lambda_6($this));
    $this.cr_1.appendChild(labeledCheckbox('Auto-start runtime', state.pq_1, DomRegisterModal$renderAgentFields$lambda_7($this)));
    $this.cr_1.appendChild(labeledCheckbox('Activate after register', state.tq_1, DomRegisterModal$renderAgentFields$lambda_8($this)));
  }
  function renderPackageFields($this, state) {
    field($this, 'Customer ID', state.dq_1, DomRegisterModal$renderPackageFields$lambda($this));
    field($this, 'Weight kg', state.eq_1, DomRegisterModal$renderPackageFields$lambda_0($this));
    field($this, 'Volume m\xB3', state.fq_1, DomRegisterModal$renderPackageFields$lambda_1($this));
    $this.cr_1.appendChild(el('p', 'hint', 'Destination (map or coordinates)'));
    var tmp;
    var tmp_0;
    // Inline function 'kotlin.text.isNotBlank' call
    var this_0 = state.gq_1;
    if (!isBlank(this_0)) {
      // Inline function 'kotlin.text.isNotBlank' call
      var this_1 = state.hq_1;
      tmp_0 = !isBlank(this_1);
    } else {
      tmp_0 = false;
    }
    if (tmp_0) {
      tmp = 'Destination: ' + state.gq_1 + ', ' + state.hq_1;
    } else {
      tmp = 'Destination: not set \u2014 pick on map or enter coordinates below';
    }
    var destHint = tmp;
    $this.cr_1.appendChild(el('p', 'hint', destHint));
    $this.cr_1.appendChild(button('Pick destination on map', 'secondary', DomRegisterModal$renderPackageFields$lambda_2($this)));
    field($this, 'Destination lat', state.gq_1, DomRegisterModal$renderPackageFields$lambda_3($this));
    field($this, 'Destination lon', state.hq_1, DomRegisterModal$renderPackageFields$lambda_4($this));
    $this.cr_1.appendChild(labeledCheckbox('Requires ground transport', state.iq_1, DomRegisterModal$renderPackageFields$lambda_5($this)));
  }
  function field($this, label, value, onChange) {
    var _destruct__k2r9zo = labeledInput(label, value, VOID, onChange);
    var labelEl = _destruct__k2r9zo.ua();
    var input = _destruct__k2r9zo.va();
    $this.cr_1.appendChild(labelEl);
    $this.cr_1.appendChild(input);
  }
  function dismiss($this) {
    $this.br_1.classList.add('hidden');
    $this.er_1 = null;
    $this.xq_1();
  }
  function submit($this) {
    var tmp0_elvis_lhs = $this.er_1;
    var tmp;
    if (tmp0_elvis_lhs == null) {
      return Unit_instance;
    } else {
      tmp = tmp0_elvis_lhs;
    }
    var state = tmp;
    if (state.wp_1.equals(MapAddMode_PACKAGE_getInstance()) && (isBlank(state.gq_1) || isBlank(state.hq_1))) {
      $this.zq_1('Set the destination on the map or enter latitude and longitude.');
      return Unit_instance;
    }
    launch($this.vq_1, VOID, VOID, DomRegisterModal$submit$slambda_0(state, $this, null));
  }
  function DomRegisterModal$lambda(this$0) {
    return function (it) {
      dismiss(this$0);
      return null;
    };
  }
  function DomRegisterModal$lambda_0(this$0) {
    return function () {
      dismiss(this$0);
      return Unit_instance;
    };
  }
  function DomRegisterModal$lambda_1(this$0) {
    return function () {
      submit(this$0);
      return Unit_instance;
    };
  }
  function DomRegisterModal$lambda_2(this$0) {
    return function () {
      dismiss(this$0);
      return Unit_instance;
    };
  }
  function DomRegisterModal$renderStationFields$lambda(this$0) {
    return function (it) {
      this$0.er_1 = ensureNotNull(this$0.er_1).uq(VOID, VOID, it);
      return Unit_instance;
    };
  }
  function DomRegisterModal$renderStationFields$lambda_0(this$0) {
    return function (it) {
      this$0.er_1 = ensureNotNull(this$0.er_1).uq(VOID, VOID, VOID, it);
      return Unit_instance;
    };
  }
  function DomRegisterModal$renderStationFields$lambda_1(this$0) {
    return function (it) {
      this$0.er_1 = ensureNotNull(this$0.er_1).uq(VOID, VOID, VOID, VOID, it);
      return Unit_instance;
    };
  }
  function DomRegisterModal$renderStationFields$lambda_2(this$0) {
    return function (it) {
      this$0.er_1 = ensureNotNull(this$0.er_1).uq(VOID, VOID, VOID, VOID, VOID, it);
      return Unit_instance;
    };
  }
  function DomRegisterModal$renderStationFields$lambda_3(this$0) {
    return function (it) {
      this$0.er_1 = ensureNotNull(this$0.er_1).uq(VOID, VOID, VOID, VOID, VOID, VOID, it);
      return Unit_instance;
    };
  }
  function DomRegisterModal$renderAgentFields$lambda(this$0) {
    return function (it) {
      this$0.er_1 = ensureNotNull(this$0.er_1).uq(VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, it);
      return Unit_instance;
    };
  }
  function DomRegisterModal$renderAgentFields$lambda_0(this$0) {
    return function (value) {
      // Inline function 'kotlin.text.uppercase' call
      // Inline function 'kotlin.js.asDynamic' call
      var type = value.toUpperCase();
      var tmp = this$0;
      var tmp0_$this = ensureNotNull(this$0.er_1);
      var tmp1_agentPx4Model = type === 'UGV' ? 'r1_rover' : 'x500';
      var tmp2_agentPayload = type === 'UGV' ? '20' : '5';
      var tmp3_agentRange = type === 'UGV' ? '8000' : '650';
      tmp.er_1 = tmp0_$this.uq(VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, type, VOID, tmp3_agentRange, tmp2_agentPayload, VOID, VOID, tmp1_agentPx4Model);
      return Unit_instance;
    };
  }
  function DomRegisterModal$renderAgentFields$lambda_1(this$0) {
    return function (it) {
      this$0.er_1 = ensureNotNull(this$0.er_1).uq(VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, it);
      return Unit_instance;
    };
  }
  function DomRegisterModal$renderAgentFields$lambda_2(this$0) {
    return function (it) {
      this$0.er_1 = ensureNotNull(this$0.er_1).uq(VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, it);
      return Unit_instance;
    };
  }
  function DomRegisterModal$renderAgentFields$lambda_3(this$0) {
    return function (it) {
      this$0.er_1 = ensureNotNull(this$0.er_1).uq(VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, it);
      return Unit_instance;
    };
  }
  function DomRegisterModal$renderAgentFields$lambda_4(this$0) {
    return function (it) {
      this$0.er_1 = ensureNotNull(this$0.er_1).uq(VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, it);
      return Unit_instance;
    };
  }
  function DomRegisterModal$renderAgentFields$lambda_5(this$0) {
    return function (it) {
      this$0.er_1 = ensureNotNull(this$0.er_1).uq(VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, it);
      return Unit_instance;
    };
  }
  function DomRegisterModal$renderAgentFields$lambda_6(this$0) {
    return function (it) {
      this$0.er_1 = ensureNotNull(this$0.er_1).uq(VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, it);
      return Unit_instance;
    };
  }
  function DomRegisterModal$renderAgentFields$lambda_7(this$0) {
    return function (it) {
      this$0.er_1 = ensureNotNull(this$0.er_1).uq(VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, it);
      return Unit_instance;
    };
  }
  function DomRegisterModal$renderAgentFields$lambda_8(this$0) {
    return function (it) {
      this$0.er_1 = ensureNotNull(this$0.er_1).uq(VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, it);
      return Unit_instance;
    };
  }
  function DomRegisterModal$renderPackageFields$lambda(this$0) {
    return function (it) {
      this$0.er_1 = ensureNotNull(this$0.er_1).uq(VOID, VOID, VOID, VOID, VOID, VOID, VOID, it);
      return Unit_instance;
    };
  }
  function DomRegisterModal$renderPackageFields$lambda_0(this$0) {
    return function (it) {
      this$0.er_1 = ensureNotNull(this$0.er_1).uq(VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, it);
      return Unit_instance;
    };
  }
  function DomRegisterModal$renderPackageFields$lambda_1(this$0) {
    return function (it) {
      this$0.er_1 = ensureNotNull(this$0.er_1).uq(VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, it);
      return Unit_instance;
    };
  }
  function DomRegisterModal$renderPackageFields$lambda_2(this$0) {
    return function () {
      var tmp0_elvis_lhs = this$0.er_1;
      var tmp;
      if (tmp0_elvis_lhs == null) {
        return Unit_instance;
      } else {
        tmp = tmp0_elvis_lhs;
      }
      var current = tmp;
      this$0.by();
      this$0.ar_1(current);
      return Unit_instance;
    };
  }
  function DomRegisterModal$renderPackageFields$lambda_3(this$0) {
    return function (it) {
      this$0.er_1 = ensureNotNull(this$0.er_1).uq(VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, it);
      return Unit_instance;
    };
  }
  function DomRegisterModal$renderPackageFields$lambda_4(this$0) {
    return function (it) {
      this$0.er_1 = ensureNotNull(this$0.er_1).uq(VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, it);
      return Unit_instance;
    };
  }
  function DomRegisterModal$renderPackageFields$lambda_5(this$0) {
    return function (it) {
      this$0.er_1 = ensureNotNull(this$0.er_1).uq(VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, it);
      return Unit_instance;
    };
  }
  function DomRegisterModal$submit$slambda($state, this$0, resultContinuation) {
    this.ky_1 = $state;
    this.ly_1 = this$0;
    CoroutineImpl.call(this, resultContinuation);
  }
  protoOf(DomRegisterModal$submit$slambda).oo = function ($this$launch, $completion) {
    var tmp = this.po($this$launch, $completion);
    tmp.c6_1 = Unit_instance;
    tmp.d6_1 = null;
    return tmp.i6();
  };
  protoOf(DomRegisterModal$submit$slambda).s6 = function (p1, $completion) {
    return this.oo((!(p1 == null) ? isInterface(p1, CoroutineScope) : false) ? p1 : THROW_CCE(), $completion);
  };
  protoOf(DomRegisterModal$submit$slambda).i6 = function () {
    var suspendResult = this.c6_1;
    $sm: do
      try {
        var tmp = this.a6_1;
        switch (tmp) {
          case 0:
            this.b6_1 = 3;
            var tmp_0 = this;
            tmp_0.ny_1 = this.my_1;
            this.b6_1 = 2;
            var tmp_1 = this;
            tmp_1.py_1 = Companion_instance;
            var tmp_2 = this;
            tmp_2.qy_1 = this.ny_1;
            this.a6_1 = 1;
            suspendResult = this.ky_1.ry(this.ly_1.wq_1(), this);
            if (suspendResult === get_COROUTINE_SUSPENDED()) {
              return suspendResult;
            }

            continue $sm;
          case 1:
            var value = suspendResult;
            this.oy_1 = _Result___init__impl__xyqfz8(value);
            this.b6_1 = 3;
            this.a6_1 = 4;
            continue $sm;
          case 2:
            this.b6_1 = 3;
            var tmp_3 = this.d6_1;
            if (tmp_3 instanceof Error) {
              var e = this.d6_1;
              var tmp_4 = this;
              tmp_4.oy_1 = _Result___init__impl__xyqfz8(createFailure(e));
              this.a6_1 = 4;
              continue $sm;
            } else {
              throw this.d6_1;
            }

          case 3:
            throw this.d6_1;
          case 4:
            this.b6_1 = 3;
            var this_0 = this.oy_1;
            if (_Result___get_isSuccess__impl__sndoy8(this_0)) {
              var tmp_5 = _Result___get_value__impl__bjfvqg(this_0);
              var it = (tmp_5 == null ? true : !(tmp_5 == null)) ? tmp_5 : THROW_CCE();
              dismiss(this.ly_1);
              this.ly_1.yq_1(it);
            }

            var tmp0_safe_receiver = Result__exceptionOrNull_impl_p6xea9(this_0);
            if (tmp0_safe_receiver == null)
              null;
            else {
              var tmp0_elvis_lhs = tmp0_safe_receiver.message;
              this.ly_1.zq_1(tmp0_elvis_lhs == null ? 'Request failed' : tmp0_elvis_lhs);
            }

            return Unit_instance;
        }
      } catch ($p) {
        var e_0 = $p;
        if (this.b6_1 === 3) {
          throw e_0;
        } else {
          this.a6_1 = this.b6_1;
          this.d6_1 = e_0;
        }
      }
     while (true);
  };
  protoOf(DomRegisterModal$submit$slambda).po = function ($this$launch, completion) {
    var i = new DomRegisterModal$submit$slambda(this.ky_1, this.ly_1, completion);
    i.my_1 = $this$launch;
    return i;
  };
  function DomRegisterModal$submit$slambda_0($state, this$0, resultContinuation) {
    var i = new DomRegisterModal$submit$slambda($state, this$0, resultContinuation);
    var l = function ($this$launch, $completion) {
      return i.oo($this$launch, $completion);
    };
    l.$arity = 1;
    return l;
  }
  function DomRegisterModal(scope, backendUrl, onDismiss, onSuccess, onError, onPickDestinationOnMap) {
    this.vq_1 = scope;
    this.wq_1 = backendUrl;
    this.xq_1 = onDismiss;
    this.yq_1 = onSuccess;
    this.zq_1 = onError;
    this.ar_1 = onPickDestinationOnMap;
    this.br_1 = el('div', 'overlay hidden');
    this.cr_1 = el('div', 'overlay-form');
    this.dr_1 = el('h2');
    this.er_1 = null;
    var backdrop = el('div', 'overlay-backdrop');
    backdrop.onclick = DomRegisterModal$lambda(this);
    var card = el('div', 'overlay-card');
    var header = el('header');
    header.appendChild(this.dr_1);
    header.appendChild(button('\xD7', 'secondary', DomRegisterModal$lambda_0(this)));
    card.appendChild(header);
    card.appendChild(this.cr_1);
    var actions = el('div', 'overlay-actions');
    actions.appendChild(button('Submit', VOID, DomRegisterModal$lambda_1(this)));
    actions.appendChild(button('Cancel', 'secondary', DomRegisterModal$lambda_2(this)));
    card.appendChild(actions);
    this.br_1.appendChild(backdrop);
    this.br_1.appendChild(card);
  }
  protoOf(DomRegisterModal).so = function () {
    return this.br_1;
  };
  protoOf(DomRegisterModal).ds = function (state) {
    this.er_1 = state;
    this.br_1.classList.remove('hidden');
    renderForm(this);
  };
  protoOf(DomRegisterModal).fr = function (state) {
    this.er_1 = state;
    this.br_1.classList.remove('hidden');
    renderForm(this);
  };
  protoOf(DomRegisterModal).by = function () {
    this.br_1.classList.add('hidden');
  };
  function replaceChildren_0(_this__u8e3s4) {
    while (!(_this__u8e3s4.firstChild == null)) {
      _this__u8e3s4.removeChild(ensureNotNull(_this__u8e3s4.firstChild));
    }
  }
  function usableRangeFraction($this) {
    return 1.0 - $this.zn_1 / 100.0;
  }
  function loadFromLocalStorage($this) {
    var tmp0_elvis_lhs = localStorage.getItem('uavlogistics.fleetRangeSettings');
    var tmp;
    if (tmp0_elvis_lhs == null) {
      return Unit_instance;
    } else {
      tmp = tmp0_elvis_lhs;
    }
    var raw = tmp;
    // Inline function 'kotlin.runCatching' call
    var tmp_0;
    try {
      // Inline function 'kotlin.Companion.success' call
      var parsed = JSON.parse(raw);
      var tmp_1 = parsed.uavMaxRangeMeters;
      AgentRangeSettings_getInstance();
      var tmp_2 = optionalNumber($this, tmp_1, 650.0);
      var tmp_3 = parsed.ugvMaxRangeMeters;
      AgentRangeSettings_getInstance();
      var tmp_4 = optionalNumber($this, tmp_3, 600.0);
      var tmp_5 = parsed.routeReservePercent;
      AgentRangeSettings_getInstance();
      $this.qo(tmp_2, tmp_4, optionalNumber($this, tmp_5, 15.0), false);
      tmp_0 = _Result___init__impl__xyqfz8(Unit_instance);
    } catch ($p) {
      var tmp_6;
      if ($p instanceof Error) {
        var e = $p;
        // Inline function 'kotlin.Companion.failure' call
        tmp_6 = _Result___init__impl__xyqfz8(createFailure(e));
      } else {
        throw $p;
      }
      tmp_0 = tmp_6;
    }
  }
  function saveToLocalStorage($this) {
    localStorage.setItem('uavlogistics.fleetRangeSettings', $this.ro());
  }
  function optionalNumber($this, value, default_0) {
    // Inline function 'kotlin.getOrElse' call
    // Inline function 'kotlin.runCatching' call
    var tmp;
    try {
      // Inline function 'kotlin.Companion.success' call
      // Inline function 'pl.edu.wat.uavlogistics.frontend.model.AgentRangeSettings.optionalNumber.<anonymous>' call
      var value_0 = numberToDouble(isNumber(value) ? value : THROW_CCE());
      tmp = _Result___init__impl__xyqfz8(value_0);
    } catch ($p) {
      var tmp_0;
      if ($p instanceof Error) {
        var e = $p;
        // Inline function 'kotlin.Companion.failure' call
        tmp_0 = _Result___init__impl__xyqfz8(createFailure(e));
      } else {
        throw $p;
      }
      tmp = tmp_0;
    }
    var this_0 = tmp;
    // Inline function 'kotlin.contracts.contract' call
    var exception = Result__exceptionOrNull_impl_p6xea9(this_0);
    var tmp_1;
    if (exception == null) {
      var tmp_2 = _Result___get_value__impl__bjfvqg(this_0);
      tmp_1 = (tmp_2 == null ? true : !(tmp_2 == null)) ? tmp_2 : THROW_CCE();
    } else {
      // Inline function 'pl.edu.wat.uavlogistics.frontend.model.AgentRangeSettings.optionalNumber.<anonymous>' call
      tmp_1 = default_0;
    }
    return tmp_1;
  }
  function AgentRangeSettings() {
    AgentRangeSettings_instance = this;
    this.sn_1 = 'uavlogistics.fleetRangeSettings';
    this.tn_1 = 650.0;
    this.un_1 = 600.0;
    this.vn_1 = 15.0;
    this.wn_1 = 1.35;
    this.xn_1 = 650.0;
    this.yn_1 = 600.0;
    this.zn_1 = 15.0;
    loadFromLocalStorage(this);
  }
  protoOf(AgentRangeSettings).cx = function (state) {
    var tmp1_elvis_lhs = state == null ? null : state.fleetRangeSettings;
    var tmp;
    if (tmp1_elvis_lhs == null) {
      return Unit_instance;
    } else {
      tmp = tmp1_elvis_lhs;
    }
    var settings = tmp;
    this.qo(optionalNumber(this, settings.uavMaxRangeMeters, 650.0), optionalNumber(this, settings.ugvMaxRangeMeters, 600.0), optionalNumber(this, settings.routeReservePercent, 15.0), true);
  };
  protoOf(AgentRangeSettings).qo = function (uav, ugv, reserve, persistLocally) {
    this.xn_1 = coerceAtLeast(uav, 1.0);
    this.yn_1 = coerceAtLeast(ugv, 1.0);
    this.zn_1 = coerceIn(reserve, 0.0, 99.0);
    if (persistLocally) {
      saveToLocalStorage(this);
    }
  };
  protoOf(AgentRangeSettings).do = function (uav, ugv, reserve, persistLocally, $super) {
    persistLocally = persistLocally === VOID ? false : persistLocally;
    var tmp;
    if ($super === VOID) {
      this.qo(uav, ugv, reserve, persistLocally);
      tmp = Unit_instance;
    } else {
      tmp = $super.qo.call(this, uav, ugv, reserve, persistLocally);
    }
    return tmp;
  };
  protoOf(AgentRangeSettings).ao = function (vehicleType) {
    // Inline function 'kotlin.text.uppercase' call
    // Inline function 'kotlin.js.asDynamic' call
    return vehicleType.toUpperCase() === 'UGV' ? this.yn_1 : this.xn_1;
  };
  protoOf(AgentRangeSettings).sy = function (vehicleType) {
    var tmp;
    // Inline function 'kotlin.text.uppercase' call
    // Inline function 'kotlin.js.asDynamic' call
    if (vehicleType.toUpperCase() === 'UGV') {
      tmp = 1.35;
    } else {
      tmp = 1.0;
    }
    return tmp;
  };
  protoOf(AgentRangeSettings).bo = function (vehicleType) {
    var maxRange = this.ao(vehicleType);
    return maxRange * usableRangeFraction(this) / this.sy(vehicleType);
  };
  protoOf(AgentRangeSettings).co = function (vehicleType) {
    var maxRange = this.ao(vehicleType);
    return maxRange * usableRangeFraction(this) / (2.0 * this.sy(vehicleType));
  };
  protoOf(AgentRangeSettings).ro = function () {
    var body = {};
    body.uavMaxRangeMeters = this.xn_1;
    body.ugvMaxRangeMeters = this.yn_1;
    body.routeReservePercent = this.zn_1;
    return JSON.stringify(body);
  };
  var AgentRangeSettings_instance;
  function AgentRangeSettings_getInstance() {
    if (AgentRangeSettings_instance == null)
      new AgentRangeSettings();
    return AgentRangeSettings_instance;
  }
  var MapAddMode_STATION_instance;
  var MapAddMode_PACKAGE_instance;
  var MapAddMode_AGENT_instance;
  function values() {
    return [MapAddMode_STATION_getInstance(), MapAddMode_PACKAGE_getInstance(), MapAddMode_AGENT_getInstance()];
  }
  function get_entries() {
    if ($ENTRIES == null)
      $ENTRIES = enumEntries(values());
    return $ENTRIES;
  }
  var MapAddMode_entriesInitialized;
  function MapAddMode_initEntries() {
    if (MapAddMode_entriesInitialized)
      return Unit_instance;
    MapAddMode_entriesInitialized = true;
    MapAddMode_STATION_instance = new MapAddMode('STATION', 0);
    MapAddMode_PACKAGE_instance = new MapAddMode('PACKAGE', 1);
    MapAddMode_AGENT_instance = new MapAddMode('AGENT', 2);
  }
  var $ENTRIES;
  function MapAddMode(name, ordinal) {
    Enum.call(this, name, ordinal);
  }
  function MapAddMode_STATION_getInstance() {
    MapAddMode_initEntries();
    return MapAddMode_STATION_instance;
  }
  function MapAddMode_PACKAGE_getInstance() {
    MapAddMode_initEntries();
    return MapAddMode_PACKAGE_instance;
  }
  function MapAddMode_AGENT_getInstance() {
    MapAddMode_initEntries();
    return MapAddMode_AGENT_instance;
  }
  function metersToLatDegrees(meters) {
    return meters / 111320.0;
  }
  function metersToLonDegrees(meters, atLatitude) {
    // Inline function 'kotlin.math.cos' call
    var x = atLatitude * 3.141592653589793 / 180.0;
    var tmp$ret$0 = Math.cos(x);
    var cosLat = coerceAtLeast(tmp$ret$0, 0.01);
    return meters / (111320.0 * cosLat);
  }
  function geoDistanceMeters(lat1, lon1, lat2, lon2) {
    var meanLat = (lat1 + lat2) / 2.0;
    var dLat = (lat2 - lat1) * 111320.0;
    var tmp = (lon2 - lon1) * 111320.0;
    // Inline function 'kotlin.math.cos' call
    var x = meanLat * 3.141592653589793 / 180.0;
    var dLon = tmp * Math.cos(x);
    // Inline function 'kotlin.math.sqrt' call
    var x_0 = dLat * dLat + dLon * dLon;
    return Math.sqrt(x_0);
  }
  function MapPoint(id, label, details, lat, lon, kind, agentType) {
    agentType = agentType === VOID ? null : agentType;
    this.nx_1 = id;
    this.ox_1 = label;
    this.px_1 = details;
    this.qx_1 = lat;
    this.rx_1 = lon;
    this.sx_1 = kind;
    this.tx_1 = agentType;
  }
  protoOf(MapPoint).toString = function () {
    return 'MapPoint(id=' + this.nx_1 + ', label=' + this.ox_1 + ', details=' + this.px_1 + ', lat=' + this.qx_1 + ', lon=' + this.rx_1 + ', kind=' + this.sx_1.toString() + ', agentType=' + this.tx_1 + ')';
  };
  protoOf(MapPoint).hashCode = function () {
    var result = getStringHashCode(this.nx_1);
    result = imul(result, 31) + getStringHashCode(this.ox_1) | 0;
    result = imul(result, 31) + getStringHashCode(this.px_1) | 0;
    result = imul(result, 31) + getNumberHashCode(this.qx_1) | 0;
    result = imul(result, 31) + getNumberHashCode(this.rx_1) | 0;
    result = imul(result, 31) + this.sx_1.hashCode() | 0;
    result = imul(result, 31) + (this.tx_1 == null ? 0 : getStringHashCode(this.tx_1)) | 0;
    return result;
  };
  protoOf(MapPoint).equals = function (other) {
    if (this === other)
      return true;
    if (!(other instanceof MapPoint))
      return false;
    var tmp0_other_with_cast = other instanceof MapPoint ? other : THROW_CCE();
    if (!(this.nx_1 === tmp0_other_with_cast.nx_1))
      return false;
    if (!(this.ox_1 === tmp0_other_with_cast.ox_1))
      return false;
    if (!(this.px_1 === tmp0_other_with_cast.px_1))
      return false;
    if (!equals(this.qx_1, tmp0_other_with_cast.qx_1))
      return false;
    if (!equals(this.rx_1, tmp0_other_with_cast.rx_1))
      return false;
    if (!this.sx_1.equals(tmp0_other_with_cast.sx_1))
      return false;
    if (!(this.tx_1 == tmp0_other_with_cast.tx_1))
      return false;
    return true;
  };
  var MapRangePurpose_PACKAGE_PICKUP_instance;
  var MapRangePurpose_INTER_STATION_instance;
  var MapRangePurpose_entriesInitialized;
  function MapRangePurpose_initEntries() {
    if (MapRangePurpose_entriesInitialized)
      return Unit_instance;
    MapRangePurpose_entriesInitialized = true;
    MapRangePurpose_PACKAGE_PICKUP_instance = new MapRangePurpose('PACKAGE_PICKUP', 0);
    MapRangePurpose_INTER_STATION_instance = new MapRangePurpose('INTER_STATION', 1);
  }
  function MapRangePurpose(name, ordinal) {
    Enum.call(this, name, ordinal);
  }
  function MapRangeDisc(stationId, vehicleType, purpose, lat, lon, radiusMeters) {
    this.ex_1 = stationId;
    this.fx_1 = vehicleType;
    this.gx_1 = purpose;
    this.hx_1 = lat;
    this.ix_1 = lon;
    this.jx_1 = radiusMeters;
    this.kx_1 = this.ex_1 + '-' + this.fx_1 + '-' + this.gx_1.a1_1;
  }
  protoOf(MapRangeDisc).toString = function () {
    return 'MapRangeDisc(stationId=' + this.ex_1 + ', vehicleType=' + this.fx_1 + ', purpose=' + this.gx_1.toString() + ', lat=' + this.hx_1 + ', lon=' + this.ix_1 + ', radiusMeters=' + this.jx_1 + ')';
  };
  protoOf(MapRangeDisc).hashCode = function () {
    var result = getStringHashCode(this.ex_1);
    result = imul(result, 31) + getStringHashCode(this.fx_1) | 0;
    result = imul(result, 31) + this.gx_1.hashCode() | 0;
    result = imul(result, 31) + getNumberHashCode(this.hx_1) | 0;
    result = imul(result, 31) + getNumberHashCode(this.ix_1) | 0;
    result = imul(result, 31) + getNumberHashCode(this.jx_1) | 0;
    return result;
  };
  protoOf(MapRangeDisc).equals = function (other) {
    if (this === other)
      return true;
    if (!(other instanceof MapRangeDisc))
      return false;
    var tmp0_other_with_cast = other instanceof MapRangeDisc ? other : THROW_CCE();
    if (!(this.ex_1 === tmp0_other_with_cast.ex_1))
      return false;
    if (!(this.fx_1 === tmp0_other_with_cast.fx_1))
      return false;
    if (!this.gx_1.equals(tmp0_other_with_cast.gx_1))
      return false;
    if (!equals(this.hx_1, tmp0_other_with_cast.hx_1))
      return false;
    if (!equals(this.ix_1, tmp0_other_with_cast.ix_1))
      return false;
    if (!equals(this.jx_1, tmp0_other_with_cast.jx_1))
      return false;
    return true;
  };
  var MapPointKind_STATION_instance;
  var MapPointKind_AGENT_instance;
  var MapPointKind_PACKAGE_instance;
  var MapPointKind_entriesInitialized;
  function MapPointKind_initEntries() {
    if (MapPointKind_entriesInitialized)
      return Unit_instance;
    MapPointKind_entriesInitialized = true;
    MapPointKind_STATION_instance = new MapPointKind('STATION', 0);
    MapPointKind_AGENT_instance = new MapPointKind('AGENT', 1);
    MapPointKind_PACKAGE_instance = new MapPointKind('PACKAGE', 2);
  }
  function MapPointKind(name, ordinal) {
    Enum.call(this, name, ordinal);
  }
  function MapBounds(minLat, maxLat, minLon, maxLon, width, height, padding) {
    this.ux_1 = minLat;
    this.vx_1 = maxLat;
    this.wx_1 = minLon;
    this.xx_1 = maxLon;
    this.yx_1 = width;
    this.zx_1 = height;
    this.ay_1 = padding;
  }
  protoOf(MapBounds).toString = function () {
    return 'MapBounds(minLat=' + this.ux_1 + ', maxLat=' + this.vx_1 + ', minLon=' + this.wx_1 + ', maxLon=' + this.xx_1 + ', width=' + this.yx_1 + ', height=' + this.zx_1 + ', padding=' + this.ay_1 + ')';
  };
  protoOf(MapBounds).hashCode = function () {
    var result = getNumberHashCode(this.ux_1);
    result = imul(result, 31) + getNumberHashCode(this.vx_1) | 0;
    result = imul(result, 31) + getNumberHashCode(this.wx_1) | 0;
    result = imul(result, 31) + getNumberHashCode(this.xx_1) | 0;
    result = imul(result, 31) + getNumberHashCode(this.yx_1) | 0;
    result = imul(result, 31) + getNumberHashCode(this.zx_1) | 0;
    result = imul(result, 31) + getNumberHashCode(this.ay_1) | 0;
    return result;
  };
  protoOf(MapBounds).equals = function (other) {
    if (this === other)
      return true;
    if (!(other instanceof MapBounds))
      return false;
    var tmp0_other_with_cast = other instanceof MapBounds ? other : THROW_CCE();
    if (!equals(this.ux_1, tmp0_other_with_cast.ux_1))
      return false;
    if (!equals(this.vx_1, tmp0_other_with_cast.vx_1))
      return false;
    if (!equals(this.wx_1, tmp0_other_with_cast.wx_1))
      return false;
    if (!equals(this.xx_1, tmp0_other_with_cast.xx_1))
      return false;
    if (!equals(this.yx_1, tmp0_other_with_cast.yx_1))
      return false;
    if (!equals(this.zx_1, tmp0_other_with_cast.zx_1))
      return false;
    if (!equals(this.ay_1, tmp0_other_with_cast.ay_1))
      return false;
    return true;
  };
  function GeoCoord(lat, lon) {
    this.up_1 = lat;
    this.vp_1 = lon;
  }
  protoOf(GeoCoord).toString = function () {
    return 'GeoCoord(lat=' + this.up_1 + ', lon=' + this.vp_1 + ')';
  };
  protoOf(GeoCoord).hashCode = function () {
    var result = getNumberHashCode(this.up_1);
    result = imul(result, 31) + getNumberHashCode(this.vp_1) | 0;
    return result;
  };
  protoOf(GeoCoord).equals = function (other) {
    if (this === other)
      return true;
    if (!(other instanceof GeoCoord))
      return false;
    var tmp0_other_with_cast = other instanceof GeoCoord ? other : THROW_CCE();
    if (!equals(this.up_1, tmp0_other_with_cast.up_1))
      return false;
    if (!equals(this.vp_1, tmp0_other_with_cast.vp_1))
      return false;
    return true;
  };
  function shortId(_this__u8e3s4) {
    return _this__u8e3s4.length <= 14 ? _this__u8e3s4 : take(_this__u8e3s4, 6) + '\u2026' + takeLast(_this__u8e3s4, 4);
  }
  function MapRangePurpose_PACKAGE_PICKUP_getInstance() {
    MapRangePurpose_initEntries();
    return MapRangePurpose_PACKAGE_PICKUP_instance;
  }
  function MapRangePurpose_INTER_STATION_getInstance() {
    MapRangePurpose_initEntries();
    return MapRangePurpose_INTER_STATION_instance;
  }
  function MapPointKind_STATION_getInstance() {
    MapPointKind_initEntries();
    return MapPointKind_STATION_instance;
  }
  function MapPointKind_AGENT_getInstance() {
    MapPointKind_initEntries();
    return MapPointKind_AGENT_instance;
  }
  function MapPointKind_PACKAGE_getInstance() {
    MapPointKind_initEntries();
    return MapPointKind_PACKAGE_instance;
  }
  function get_MAP_RANGE_VEHICLE_TYPES() {
    _init_properties_MapRangeClusters_kt__tnfwli();
    return MAP_RANGE_VEHICLE_TYPES;
  }
  var MAP_RANGE_VEHICLE_TYPES;
  function rangeDiscsOverlap(a, b) {
    _init_properties_MapRangeClusters_kt__tnfwli();
    if (!a.gx_1.equals(b.gx_1))
      return false;
    var gap = geoDistanceMeters(a.hx_1, a.ix_1, b.hx_1, b.ix_1);
    return gap < a.jx_1 + b.jx_1 - 0.5;
  }
  function clusterOverlappingRangeDiscs(discs) {
    _init_properties_MapRangeClusters_kt__tnfwli();
    if (discs.q())
      return emptyList();
    if (discs.i() === 1)
      return listOf_0(discs);
    var tmp = 0;
    var tmp_0 = discs.i();
    var tmp_1 = new Int32Array(tmp_0);
    while (tmp < tmp_0) {
      var tmp_2 = tmp;
      tmp_1[tmp_2] = tmp_2;
      tmp = tmp + 1 | 0;
    }
    var parent = tmp_1;
    var inductionVariable = 0;
    var last = discs.i() - 1 | 0;
    if (inductionVariable <= last)
      do {
        var i = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        var inductionVariable_0 = i + 1 | 0;
        var last_0 = discs.i();
        if (inductionVariable_0 < last_0)
          do {
            var j = inductionVariable_0;
            inductionVariable_0 = inductionVariable_0 + 1 | 0;
            if (rangeDiscsOverlap(discs.j(i), discs.j(j))) {
              clusterOverlappingRangeDiscs$union(parent, i, j);
            }
          }
           while (inductionVariable_0 < last_0);
      }
       while (inductionVariable <= last);
    // Inline function 'kotlin.collections.map' call
    // Inline function 'kotlin.collections.groupBy' call
    // Inline function 'kotlin.collections.groupByTo' call
    var this_0 = get_indices(discs);
    var destination = LinkedHashMap_init_$Create$();
    var inductionVariable_1 = this_0.z9_1;
    var last_1 = this_0.aa_1;
    if (inductionVariable_1 <= last_1)
      do {
        var element = inductionVariable_1;
        inductionVariable_1 = inductionVariable_1 + 1 | 0;
        // Inline function 'pl.edu.wat.uavlogistics.frontend.model.clusterOverlappingRangeDiscs.<anonymous>' call
        var it = element;
        var key = clusterOverlappingRangeDiscs$find(parent, it);
        // Inline function 'kotlin.collections.getOrPut' call
        var value = destination.x(key);
        var tmp_3;
        if (value == null) {
          // Inline function 'kotlin.collections.groupByTo.<anonymous>' call
          var answer = ArrayList_init_$Create$();
          destination.z2(key, answer);
          tmp_3 = answer;
        } else {
          tmp_3 = value;
        }
        var list = tmp_3;
        list.d(element);
      }
       while (!(element === last_1));
    var this_1 = destination.y();
    // Inline function 'kotlin.collections.mapTo' call
    var destination_0 = ArrayList_init_$Create$_0(collectionSizeOrDefault(this_1, 10));
    var tmp0_iterator = this_1.f();
    while (tmp0_iterator.g()) {
      var item = tmp0_iterator.h();
      // Inline function 'pl.edu.wat.uavlogistics.frontend.model.clusterOverlappingRangeDiscs.<anonymous>' call
      // Inline function 'kotlin.collections.map' call
      // Inline function 'kotlin.collections.mapTo' call
      var destination_1 = ArrayList_init_$Create$_0(collectionSizeOrDefault(item, 10));
      var tmp0_iterator_0 = item.f();
      while (tmp0_iterator_0.g()) {
        var item_0 = tmp0_iterator_0.h();
        // Inline function 'pl.edu.wat.uavlogistics.frontend.model.clusterOverlappingRangeDiscs.<anonymous>.<anonymous>' call
        var tmp$ret$6 = discs.j(item_0);
        destination_1.d(tmp$ret$6);
      }
      destination_0.d(destination_1);
    }
    return destination_0;
  }
  function circleWorldPath(cx, cy, radius) {
    _init_properties_MapRangeClusters_kt__tnfwli();
    if (radius <= 0.0)
      return '';
    return 'M ' + (cx - radius) + ' ' + cy + ' ' + ('a ' + radius + ' ' + radius + ' 0 1 0 ' + radius * 2 + ' 0 ') + ('a ' + radius + ' ' + radius + ' 0 1 0 ' + -radius * 2 + ' 0 Z ');
  }
  function clusterOverlappingRangeDiscs$find(parent, index) {
    var root = index;
    while (!(parent[root] === root)) {
      root = parent[root];
    }
    var cursor = index;
    while (!(parent[cursor] === cursor)) {
      var next = parent[cursor];
      parent[cursor] = root;
      cursor = next;
    }
    return root;
  }
  function clusterOverlappingRangeDiscs$union(parent, left, right) {
    var rootLeft = clusterOverlappingRangeDiscs$find(parent, left);
    var rootRight = clusterOverlappingRangeDiscs$find(parent, right);
    if (!(rootLeft === rootRight)) {
      parent[rootRight] = rootLeft;
    }
  }
  var properties_initialized_MapRangeClusters_kt_52hokc;
  function _init_properties_MapRangeClusters_kt__tnfwli() {
    if (!properties_initialized_MapRangeClusters_kt_52hokc) {
      properties_initialized_MapRangeClusters_kt_52hokc = true;
      MAP_RANGE_VEHICLE_TYPES = listOf(['UAV', 'UGV']);
    }
  }
  function get_INACTIVE_SHIPMENT_STATUSES() {
    _init_properties_NetworkFilters_kt__fc2jw3();
    return INACTIVE_SHIPMENT_STATUSES;
  }
  var INACTIVE_SHIPMENT_STATUSES;
  function get_INACTIVE_TASK_STATUSES() {
    _init_properties_NetworkFilters_kt__fc2jw3();
    return INACTIVE_TASK_STATUSES;
  }
  var INACTIVE_TASK_STATUSES;
  function dynamicArray(value) {
    _init_properties_NetworkFilters_kt__fc2jw3();
    if (value == null) {
      // Inline function 'kotlin.emptyArray' call
      return [];
    }
    var tmp = Array.isArray(value);
    var isArray = (!(tmp == null) ? typeof tmp === 'boolean' : false) ? tmp : THROW_CCE();
    var tmp_0;
    if (isArray) {
      // Inline function 'kotlin.js.unsafeCast' call
      tmp_0 = value;
    } else {
      // Inline function 'kotlin.emptyArray' call
      tmp_0 = [];
    }
    return tmp_0;
  }
  function statusString(value) {
    _init_properties_NetworkFilters_kt__fc2jw3();
    var tmp;
    if (value == null) {
      tmp = '';
    } else {
      // Inline function 'kotlin.text.uppercase' call
      // Inline function 'kotlin.text.trim' call
      var this_0 = toString(value);
      // Inline function 'kotlin.js.asDynamic' call
      tmp = toString(trim(isCharSequence(this_0) ? this_0 : THROW_CCE())).toUpperCase();
    }
    return tmp;
  }
  function isInactiveShipment(shipment) {
    _init_properties_NetworkFilters_kt__fc2jw3();
    return get_INACTIVE_SHIPMENT_STATUSES().r(statusString(shipment.status));
  }
  function isInactiveTask(task, shipments) {
    _init_properties_NetworkFilters_kt__fc2jw3();
    if (get_INACTIVE_TASK_STATUSES().r(statusString(task.status)))
      return true;
    var tmp = task.shipmentId;
    var tmp0_elvis_lhs = (!(tmp == null) ? typeof tmp === 'string' : false) ? tmp : null;
    var tmp_0;
    if (tmp0_elvis_lhs == null) {
      return false;
    } else {
      tmp_0 = tmp0_elvis_lhs;
    }
    var shipmentId = tmp_0;
    var tmp$ret$1;
    $l$block: {
      // Inline function 'kotlin.collections.firstOrNull' call
      var inductionVariable = 0;
      var last = shipments.length;
      while (inductionVariable < last) {
        var element = shipments[inductionVariable];
        inductionVariable = inductionVariable + 1 | 0;
        // Inline function 'pl.edu.wat.uavlogistics.frontend.model.isInactiveTask.<anonymous>' call
        var tmp_1 = element.id;
        if (((!(tmp_1 == null) ? typeof tmp_1 === 'string' : false) ? tmp_1 : null) === shipmentId) {
          tmp$ret$1 = element;
          break $l$block;
        }
      }
      tmp$ret$1 = null;
    }
    var tmp1_elvis_lhs = tmp$ret$1;
    var tmp_2;
    if (tmp1_elvis_lhs == null) {
      return false;
    } else {
      tmp_2 = tmp1_elvis_lhs;
    }
    var shipment = tmp_2;
    return isInactiveShipment(shipment);
  }
  function activeShipments(shipments) {
    _init_properties_NetworkFilters_kt__fc2jw3();
    // Inline function 'kotlin.collections.filter' call
    // Inline function 'kotlin.collections.filterTo' call
    var this_0 = dynamicArray(shipments);
    var destination = ArrayList_init_$Create$();
    var inductionVariable = 0;
    var last = this_0.length;
    while (inductionVariable < last) {
      var element = this_0[inductionVariable];
      inductionVariable = inductionVariable + 1 | 0;
      // Inline function 'pl.edu.wat.uavlogistics.frontend.model.activeShipments.<anonymous>' call
      if (!isInactiveShipment(element)) {
        destination.d(element);
      }
    }
    return destination;
  }
  function inactiveShipments(shipments) {
    _init_properties_NetworkFilters_kt__fc2jw3();
    // Inline function 'kotlin.collections.filter' call
    // Inline function 'kotlin.collections.filterTo' call
    var this_0 = dynamicArray(shipments);
    var destination = ArrayList_init_$Create$();
    var inductionVariable = 0;
    var last = this_0.length;
    while (inductionVariable < last) {
      var element = this_0[inductionVariable];
      inductionVariable = inductionVariable + 1 | 0;
      // Inline function 'pl.edu.wat.uavlogistics.frontend.model.inactiveShipments.<anonymous>' call
      if (isInactiveShipment(element)) {
        destination.d(element);
      }
    }
    return destination;
  }
  function activeTasks(tasks, shipments) {
    _init_properties_NetworkFilters_kt__fc2jw3();
    var shipmentList = dynamicArray(shipments);
    // Inline function 'kotlin.collections.filter' call
    // Inline function 'kotlin.collections.filterTo' call
    var this_0 = dynamicArray(tasks);
    var destination = ArrayList_init_$Create$();
    var inductionVariable = 0;
    var last = this_0.length;
    while (inductionVariable < last) {
      var element = this_0[inductionVariable];
      inductionVariable = inductionVariable + 1 | 0;
      // Inline function 'pl.edu.wat.uavlogistics.frontend.model.activeTasks.<anonymous>' call
      if (!isInactiveTask(element, shipmentList)) {
        destination.d(element);
      }
    }
    return destination;
  }
  function inactiveTasks(tasks, shipments) {
    _init_properties_NetworkFilters_kt__fc2jw3();
    var shipmentList = dynamicArray(shipments);
    // Inline function 'kotlin.collections.filter' call
    // Inline function 'kotlin.collections.filterTo' call
    var this_0 = dynamicArray(tasks);
    var destination = ArrayList_init_$Create$();
    var inductionVariable = 0;
    var last = this_0.length;
    while (inductionVariable < last) {
      var element = this_0[inductionVariable];
      inductionVariable = inductionVariable + 1 | 0;
      // Inline function 'pl.edu.wat.uavlogistics.frontend.model.inactiveTasks.<anonymous>' call
      if (isInactiveTask(element, shipmentList)) {
        destination.d(element);
      }
    }
    return destination;
  }
  var properties_initialized_NetworkFilters_kt_lwpqwh;
  function _init_properties_NetworkFilters_kt__fc2jw3() {
    if (!properties_initialized_NetworkFilters_kt_lwpqwh) {
      properties_initialized_NetworkFilters_kt_lwpqwh = true;
      INACTIVE_SHIPMENT_STATUSES = setOf(['DELIVERED', 'CANCELLED']);
      INACTIVE_TASK_STATUSES = setOf(['COMPLETED', 'CANCELLED']);
    }
  }
  function parseNetworkState(json) {
    return JSON.parse(json);
  }
  function networkToMapPoints(state) {
    // Inline function 'kotlin.collections.mutableListOf' call
    var points = ArrayList_init_$Create$();
    var stations = dynamicArray(state.stations);
    var agents = dynamicArray(state.agents);
    var shipments = dynamicArray(state.shipments);
    var stationSlots = dynamicArray(state.stationSlots);
    // Inline function 'kotlin.collections.forEach' call
    var inductionVariable = 0;
    var last = stations.length;
    while (inductionVariable < last) {
      var element = stations[inductionVariable];
      inductionVariable = inductionVariable + 1 | 0;
      // Inline function 'pl.edu.wat.uavlogistics.frontend.model.networkToMapPoints.<anonymous>' call
      var lat = number(element.position.latitude);
      var lon = number(element.position.longitude);
      var tmp = element.id;
      var stationId = (!(tmp == null) ? typeof tmp === 'string' : false) ? tmp : THROW_CCE();
      var serviceTypes = get_MAP_RANGE_VEHICLE_TYPES();
      // Inline function 'kotlin.collections.plusAssign' call
      var tmp_0 = element.name;
      var tmp_1 = (!(tmp_0 == null) ? typeof tmp_0 === 'string' : false) ? tmp_0 : THROW_CCE();
      // Inline function 'kotlin.text.buildString' call
      // Inline function 'kotlin.contracts.contract' call
      // Inline function 'kotlin.apply' call
      var this_0 = StringBuilder_init_$Create$();
      // Inline function 'kotlin.contracts.contract' call
      // Inline function 'pl.edu.wat.uavlogistics.frontend.model.networkToMapPoints.<anonymous>.<anonymous>' call
      // Inline function 'kotlin.text.appendLine' call
      var tmp_2 = element.name;
      var value = (!(tmp_2 == null) ? typeof tmp_2 === 'string' : false) ? tmp_2 : THROW_CCE();
      // Inline function 'kotlin.text.appendLine' call
      this_0.t5(value).u5(_Char___init__impl__6a9atx(10));
      // Inline function 'kotlin.text.appendLine' call
      var value_0 = 'Status: ' + element.status;
      // Inline function 'kotlin.text.appendLine' call
      this_0.t5(value_0).u5(_Char___init__impl__6a9atx(10));
      // Inline function 'kotlin.text.appendLine' call
      var value_1 = 'Storage: ' + element.occupiedStorage + '/' + element.storageCapacity;
      // Inline function 'kotlin.text.appendLine' call
      this_0.t5(value_1).u5(_Char___init__impl__6a9atx(10));
      // Inline function 'kotlin.text.appendLine' call
      var value_2 = 'Parking: ' + element.occupiedParking + '/' + element.parkingCapacity;
      // Inline function 'kotlin.text.appendLine' call
      this_0.t5(value_2).u5(_Char___init__impl__6a9atx(10));
      // Inline function 'kotlin.collections.forEach' call
      var tmp0_iterator = serviceTypes.f();
      while (tmp0_iterator.g()) {
        var element_0 = tmp0_iterator.h();
        // Inline function 'pl.edu.wat.uavlogistics.frontend.model.networkToMapPoints.<anonymous>.<anonymous>.<anonymous>' call
        var maxRange = numberToInt(AgentRangeSettings_getInstance().ao(element_0));
        var pickup = numberToInt(AgentRangeSettings_getInstance().co(element_0));
        var travel = numberToInt(AgentRangeSettings_getInstance().bo(element_0));
        // Inline function 'kotlin.text.appendLine' call
        var value_3 = element_0 + ' package pickup radius: ' + pickup + ' m';
        // Inline function 'kotlin.text.appendLine' call
        this_0.t5(value_3).u5(_Char___init__impl__6a9atx(10));
        // Inline function 'kotlin.text.appendLine' call
        var value_4 = element_0 + ' inter-station travel radius: ' + travel + ' m';
        // Inline function 'kotlin.text.appendLine' call
        this_0.t5(value_4).u5(_Char___init__impl__6a9atx(10));
        // Inline function 'kotlin.text.appendLine' call
        var value_5 = element_0 + ' max range (global): ' + maxRange + ' m';
        // Inline function 'kotlin.text.appendLine' call
        this_0.t5(value_5).u5(_Char___init__impl__6a9atx(10));
      }
      this_0.t5('Position: ' + formatCoord(lat) + ', ' + formatCoord(lon));
      var tmp$ret$16 = this_0.toString();
      var element_1 = new MapPoint(stationId, tmp_1, tmp$ret$16, lat, lon, MapPointKind_STATION_getInstance());
      points.d(element_1);
    }
    // Inline function 'kotlin.collections.forEach' call
    var inductionVariable_0 = 0;
    var last_0 = agents.length;
    while (inductionVariable_0 < last_0) {
      var element_2 = agents[inductionVariable_0];
      inductionVariable_0 = inductionVariable_0 + 1 | 0;
      // Inline function 'pl.edu.wat.uavlogistics.frontend.model.networkToMapPoints.<anonymous>' call
      var lat_0 = number(element_2.position.latitude);
      var lon_0 = number(element_2.position.longitude);
      // Inline function 'kotlin.collections.plusAssign' call
      var tmp_3 = element_2.id;
      var tmp_4 = (!(tmp_3 == null) ? typeof tmp_3 === 'string' : false) ? tmp_3 : THROW_CCE();
      var tmp_5 = element_2.id;
      var tmp_6 = ((!(tmp_5 == null) ? typeof tmp_5 === 'string' : false) ? tmp_5 : THROW_CCE()) + ' \xB7 ' + element_2.type;
      // Inline function 'kotlin.text.buildString' call
      // Inline function 'kotlin.contracts.contract' call
      // Inline function 'kotlin.apply' call
      var this_1 = StringBuilder_init_$Create$();
      // Inline function 'kotlin.contracts.contract' call
      // Inline function 'pl.edu.wat.uavlogistics.frontend.model.networkToMapPoints.<anonymous>.<anonymous>' call
      // Inline function 'kotlin.text.appendLine' call
      var tmp_7 = element_2.id;
      var value_6 = (!(tmp_7 == null) ? typeof tmp_7 === 'string' : false) ? tmp_7 : THROW_CCE();
      // Inline function 'kotlin.text.appendLine' call
      this_1.t5(value_6).u5(_Char___init__impl__6a9atx(10));
      // Inline function 'kotlin.text.appendLine' call
      var value_7 = 'Type: ' + element_2.type + ' \xB7 Status: ' + element_2.status;
      // Inline function 'kotlin.text.appendLine' call
      this_1.t5(value_7).u5(_Char___init__impl__6a9atx(10));
      // Inline function 'kotlin.text.appendLine' call
      var value_8 = 'Energy: ' + number(element_2.energyLevelPercent) + '%';
      // Inline function 'kotlin.text.appendLine' call
      this_1.t5(value_8).u5(_Char___init__impl__6a9atx(10));
      var tmp_8 = element_2.type;
      var agentType = (!(tmp_8 == null) ? typeof tmp_8 === 'string' : false) ? tmp_8 : THROW_CCE();
      var fleetMax = numberToInt(AgentRangeSettings_getInstance().ao(agentType));
      var fleetPickup = numberToInt(AgentRangeSettings_getInstance().co(agentType));
      var fleetTravel = numberToInt(AgentRangeSettings_getInstance().bo(agentType));
      // Inline function 'kotlin.text.appendLine' call
      var value_9 = agentType + ' package pickup radius: ' + fleetPickup + ' m';
      // Inline function 'kotlin.text.appendLine' call
      this_1.t5(value_9).u5(_Char___init__impl__6a9atx(10));
      // Inline function 'kotlin.text.appendLine' call
      var value_10 = agentType + ' inter-station travel radius: ' + fleetTravel + ' m';
      // Inline function 'kotlin.text.appendLine' call
      this_1.t5(value_10).u5(_Char___init__impl__6a9atx(10));
      // Inline function 'kotlin.text.appendLine' call
      var value_11 = agentType + ' max range (global): ' + fleetMax + ' m';
      // Inline function 'kotlin.text.appendLine' call
      this_1.t5(value_11).u5(_Char___init__impl__6a9atx(10));
      // Inline function 'kotlin.text.appendLine' call
      var tmp0_elvis_lhs = element_2.currentStationId;
      var value_12 = 'Station: ' + (tmp0_elvis_lhs == null ? '\u2014' : tmp0_elvis_lhs);
      // Inline function 'kotlin.text.appendLine' call
      this_1.t5(value_12).u5(_Char___init__impl__6a9atx(10));
      this_1.t5('Position: ' + formatCoord(lat_0) + ', ' + formatCoord(lon_0));
      var tmp_9 = this_1.toString();
      var tmp_10 = MapPointKind_AGENT_getInstance();
      var tmp_11 = element_2.type;
      var element_3 = new MapPoint(tmp_4, tmp_6, tmp_9, lat_0, lon_0, tmp_10, (!(tmp_11 == null) ? typeof tmp_11 === 'string' : false) ? tmp_11 : THROW_CCE());
      points.d(element_3);
    }
    // Inline function 'kotlin.collections.forEach' call
    var inductionVariable_1 = 0;
    var last_1 = shipments.length;
    while (inductionVariable_1 < last_1) {
      var element_4 = shipments[inductionVariable_1];
      inductionVariable_1 = inductionVariable_1 + 1 | 0;
      $l$block: {
        // Inline function 'pl.edu.wat.uavlogistics.frontend.model.networkToMapPoints.<anonymous>' call
        if (isInactiveShipment(element_4)) {
          break $l$block;
        }
        var status = statusString(element_4.status);
        var _destruct__k2r9zo = shipmentPosition(element_4, stations, agents);
        var lat_1 = _destruct__k2r9zo.ua();
        var lon_1 = _destruct__k2r9zo.va();
        // Inline function 'kotlin.collections.plusAssign' call
        var tmp_12 = element_4.id;
        var tmp_13 = (!(tmp_12 == null) ? typeof tmp_12 === 'string' : false) ? tmp_12 : THROW_CCE();
        var tmp_14 = element_4.id;
        var element_5 = new MapPoint(tmp_13, shortId((!(tmp_14 == null) ? typeof tmp_14 === 'string' : false) ? tmp_14 : THROW_CCE()) + ' \xB7 ' + status, packageDetails(element_4, lat_1, lon_1), lat_1, lon_1, MapPointKind_PACKAGE_getInstance());
        points.d(element_5);
      }
    }
    return points;
  }
  function networkToStationRangeDiscs(state) {
    // Inline function 'kotlin.collections.mutableListOf' call
    var discs = ArrayList_init_$Create$();
    // Inline function 'kotlin.collections.forEach' call
    var indexedObject = dynamicArray(state.stations);
    var inductionVariable = 0;
    var last = indexedObject.length;
    while (inductionVariable < last) {
      var element = indexedObject[inductionVariable];
      inductionVariable = inductionVariable + 1 | 0;
      $l$block: {
        // Inline function 'pl.edu.wat.uavlogistics.frontend.model.networkToStationRangeDiscs.<anonymous>' call
        var tmp = element.status;
        if (!(((!(tmp == null) ? typeof tmp === 'string' : false) ? tmp : THROW_CCE()) === 'ACTIVE')) {
          break $l$block;
        }
        var tmp_0 = element.id;
        var stationId = (!(tmp_0 == null) ? typeof tmp_0 === 'string' : false) ? tmp_0 : THROW_CCE();
        var lat = number(element.position.latitude);
        var lon = number(element.position.longitude);
        // Inline function 'kotlin.collections.forEach' call
        var tmp0_iterator = get_MAP_RANGE_VEHICLE_TYPES().f();
        while (tmp0_iterator.g()) {
          var element_0 = tmp0_iterator.h();
          // Inline function 'pl.edu.wat.uavlogistics.frontend.model.networkToStationRangeDiscs.<anonymous>.<anonymous>' call
          // Inline function 'kotlin.collections.forEach' call
          var tmp0_iterator_0 = listOf([to(MapRangePurpose_INTER_STATION_getInstance(), AgentRangeSettings_getInstance().bo(element_0)), to(MapRangePurpose_PACKAGE_PICKUP_getInstance(), AgentRangeSettings_getInstance().co(element_0))]).f();
          while (tmp0_iterator_0.g()) {
            var element_1 = tmp0_iterator_0.h();
            $l$block_0: {
              // Inline function 'pl.edu.wat.uavlogistics.frontend.model.networkToStationRangeDiscs.<anonymous>.<anonymous>.<anonymous>' call
              var purpose = element_1.ua();
              var radiusMeters = element_1.va();
              if (radiusMeters <= 0.0) {
                break $l$block_0;
              }
              // Inline function 'kotlin.collections.plusAssign' call
              var element_2 = new MapRangeDisc(stationId, element_0, purpose, lat, lon, radiusMeters);
              discs.d(element_2);
            }
          }
        }
      }
    }
    return discs;
  }
  function packageDetails(shipment, lat, lon) {
    // Inline function 'kotlin.text.buildString' call
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'kotlin.apply' call
    var this_0 = StringBuilder_init_$Create$();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'pl.edu.wat.uavlogistics.frontend.model.packageDetails.<anonymous>' call
    // Inline function 'kotlin.text.appendLine' call
    var tmp = shipment.id;
    var value = shortId((!(tmp == null) ? typeof tmp === 'string' : false) ? tmp : THROW_CCE());
    // Inline function 'kotlin.text.appendLine' call
    this_0.t5(value).u5(_Char___init__impl__6a9atx(10));
    // Inline function 'kotlin.text.appendLine' call
    var value_0 = 'Status: ' + shipment.status;
    // Inline function 'kotlin.text.appendLine' call
    this_0.t5(value_0).u5(_Char___init__impl__6a9atx(10));
    // Inline function 'kotlin.text.appendLine' call
    var value_1 = 'Customer: ' + shipment.customerId;
    // Inline function 'kotlin.text.appendLine' call
    this_0.t5(value_1).u5(_Char___init__impl__6a9atx(10));
    var tmp_0 = shipment.carryingAgentId;
    var carrier = (tmp_0 == null ? true : typeof tmp_0 === 'string') ? tmp_0 : THROW_CCE();
    if (!(carrier == null)) {
      // Inline function 'kotlin.text.appendLine' call
      var value_2 = 'Carrier: ' + carrier;
      // Inline function 'kotlin.text.appendLine' call
      this_0.t5(value_2).u5(_Char___init__impl__6a9atx(10));
    }
    var tmp_1 = shipment.currentStationId;
    var stationId = (tmp_1 == null ? true : typeof tmp_1 === 'string') ? tmp_1 : THROW_CCE();
    if (!(stationId == null)) {
      // Inline function 'kotlin.text.appendLine' call
      var value_3 = 'At station: ' + stationId;
      // Inline function 'kotlin.text.appendLine' call
      this_0.t5(value_3).u5(_Char___init__impl__6a9atx(10));
    }
    // Inline function 'kotlin.text.appendLine' call
    var value_4 = 'Origin: ' + coord_0(shipment.origin);
    // Inline function 'kotlin.text.appendLine' call
    this_0.t5(value_4).u5(_Char___init__impl__6a9atx(10));
    // Inline function 'kotlin.text.appendLine' call
    var value_5 = 'Destination: ' + coord_0(shipment.destination);
    // Inline function 'kotlin.text.appendLine' call
    this_0.t5(value_5).u5(_Char___init__impl__6a9atx(10));
    this_0.t5('Shown at: ' + formatCoord(lat) + ', ' + formatCoord(lon));
    return this_0.toString();
  }
  function shipmentPosition(shipment, stations, agents) {
    var tmp = shipment.carryingAgentId;
    var carryingAgentId = (tmp == null ? true : typeof tmp === 'string') ? tmp : THROW_CCE();
    if (!(carryingAgentId == null)) {
      var tmp$ret$1;
      $l$block: {
        // Inline function 'kotlin.collections.firstOrNull' call
        var inductionVariable = 0;
        var last = agents.length;
        while (inductionVariable < last) {
          var element = agents[inductionVariable];
          inductionVariable = inductionVariable + 1 | 0;
          // Inline function 'pl.edu.wat.uavlogistics.frontend.model.shipmentPosition.<anonymous>' call
          var tmp_0 = element.id;
          if (((!(tmp_0 == null) ? typeof tmp_0 === 'string' : false) ? tmp_0 : THROW_CCE()) === carryingAgentId) {
            tmp$ret$1 = element;
            break $l$block;
          }
        }
        tmp$ret$1 = null;
      }
      var agent = tmp$ret$1;
      if (agent != null) {
        return to(number(agent.position.latitude), number(agent.position.longitude));
      }
    }
    var tmp_1 = shipment.currentStationId;
    var currentStationId = (tmp_1 == null ? true : typeof tmp_1 === 'string') ? tmp_1 : THROW_CCE();
    if (!(currentStationId == null)) {
      var tmp$ret$3;
      $l$block_0: {
        // Inline function 'kotlin.collections.firstOrNull' call
        var inductionVariable_0 = 0;
        var last_0 = stations.length;
        while (inductionVariable_0 < last_0) {
          var element_0 = stations[inductionVariable_0];
          inductionVariable_0 = inductionVariable_0 + 1 | 0;
          // Inline function 'pl.edu.wat.uavlogistics.frontend.model.shipmentPosition.<anonymous>' call
          var tmp_2 = element_0.id;
          if (((!(tmp_2 == null) ? typeof tmp_2 === 'string' : false) ? tmp_2 : THROW_CCE()) === currentStationId) {
            tmp$ret$3 = element_0;
            break $l$block_0;
          }
        }
        tmp$ret$3 = null;
      }
      var station = tmp$ret$3;
      if (station != null) {
        return to(number(station.position.latitude), number(station.position.longitude));
      }
    }
    return to(number(shipment.origin.latitude), number(shipment.origin.longitude));
  }
  function coord_0(point) {
    return formatCoord(number(point.latitude)) + ', ' + formatCoord(number(point.longitude));
  }
  function formatCoord(_this__u8e3s4) {
    // Inline function 'kotlin.js.asDynamic' call
    var tmp = _this__u8e3s4.toFixed(5);
    return (!(tmp == null) ? typeof tmp === 'string' : false) ? tmp : THROW_CCE();
  }
  function number(value) {
    return (!(value == null) ? typeof value === 'number' : false) ? value : THROW_CCE();
  }
  function submitStation($this, backendUrl, $completion) {
    var tmp = new $submitStationCOROUTINE$5($this, backendUrl, $completion);
    tmp.c6_1 = Unit_instance;
    tmp.d6_1 = null;
    return tmp.i6();
  }
  function submitAgent($this, backendUrl, $completion) {
    var tmp = new $submitAgentCOROUTINE$6($this, backendUrl, $completion);
    tmp.c6_1 = Unit_instance;
    tmp.d6_1 = null;
    return tmp.i6();
  }
  function submitPackage($this, backendUrl, $completion) {
    var tmp0_elvis_lhs = toDoubleOrNull($this.gq_1);
    var tmp;
    if (tmp0_elvis_lhs == null) {
      throw IllegalArgumentException_init_$Create$('Destination latitude is invalid.');
    } else {
      tmp = tmp0_elvis_lhs;
    }
    var destLatValue = tmp;
    var tmp1_elvis_lhs = toDoubleOrNull($this.hq_1);
    var tmp_0;
    if (tmp1_elvis_lhs == null) {
      throw IllegalArgumentException_init_$Create$('Destination longitude is invalid.');
    } else {
      tmp_0 = tmp1_elvis_lhs;
    }
    var destLonValue = tmp_0;
    var body = ApiClient_instance.tm([to('customerId', $this.dq_1), to('senderName', 'Sender'), to('recipientName', 'Recipient'), to('origin', ApiClient_instance.um([to('latitude', $this.xp_1.up_1), to('longitude', $this.xp_1.vp_1), to('altitudeMeters', 0.0)])), to('destination', ApiClient_instance.um([to('latitude', destLatValue), to('longitude', destLonValue), to('altitudeMeters', 0.0)])), to('packageSpec', ApiClient_instance.um([to('weightKg', toDouble($this.eq_1)), to('volumeM3', toDouble($this.fq_1)), to('requiresGroundTransport', $this.iq_1)]))]);
    return ApiClient_instance.rm(backendUrl, '/api/shipments', 'POST', body, VOID, $completion);
  }
  function $submitCOROUTINE$4(_this__u8e3s4, backendUrl, resultContinuation) {
    CoroutineImpl.call(this, resultContinuation);
    this.b10_1 = _this__u8e3s4;
    this.c10_1 = backendUrl;
  }
  protoOf($submitCOROUTINE$4).i6 = function () {
    var suspendResult = this.c6_1;
    $sm: do
      try {
        var tmp = this.a6_1;
        switch (tmp) {
          case 0:
            this.b6_1 = 5;
            this.d10_1 = this.b10_1.wp_1;
            this.e10_1 = this.d10_1.b1_1;
            if (this.e10_1 === 0) {
              this.a6_1 = 3;
              suspendResult = submitStation(this.b10_1, this.c10_1, this);
              if (suspendResult === get_COROUTINE_SUSPENDED()) {
                return suspendResult;
              }
              continue $sm;
            } else {
              if (this.e10_1 === 2) {
                this.a6_1 = 2;
                suspendResult = submitAgent(this.b10_1, this.c10_1, this);
                if (suspendResult === get_COROUTINE_SUSPENDED()) {
                  return suspendResult;
                }
                continue $sm;
              } else {
                if (this.e10_1 === 1) {
                  this.a6_1 = 1;
                  suspendResult = submitPackage(this.b10_1, this.c10_1, this);
                  if (suspendResult === get_COROUTINE_SUSPENDED()) {
                    return suspendResult;
                  }
                  continue $sm;
                } else {
                  var tmp_0 = this;
                  noWhenBranchMatchedException();
                }
              }
            }

            break;
          case 1:
            this.f10_1 = suspendResult;
            this.a6_1 = 4;
            continue $sm;
          case 2:
            this.f10_1 = suspendResult;
            this.a6_1 = 4;
            continue $sm;
          case 3:
            this.f10_1 = suspendResult;
            this.a6_1 = 4;
            continue $sm;
          case 4:
            return this.f10_1;
          case 5:
            throw this.d6_1;
        }
      } catch ($p) {
        var e = $p;
        if (this.b6_1 === 5) {
          throw e;
        } else {
          this.a6_1 = this.b6_1;
          this.d6_1 = e;
        }
      }
     while (true);
  };
  function $submitStationCOROUTINE$5(_this__u8e3s4, backendUrl, resultContinuation) {
    CoroutineImpl.call(this, resultContinuation);
    this.bz_1 = _this__u8e3s4;
    this.cz_1 = backendUrl;
  }
  protoOf($submitStationCOROUTINE$5).i6 = function () {
    var suspendResult = this.c6_1;
    $sm: do
      try {
        var tmp = this.a6_1;
        switch (tmp) {
          case 0:
            this.b6_1 = 4;
            this.dz_1 = ApiClient_instance.tm([to('id', this.bz_1.yp_1), to('name', this.bz_1.zp_1), to('position', ApiClient_instance.um([to('latitude', this.bz_1.xp_1.up_1), to('longitude', this.bz_1.xp_1.vp_1), to('altitudeMeters', 0.0)])), to('storageCapacity', toInt(this.bz_1.aq_1)), to('parkingCapacity', toInt(this.bz_1.bq_1))]);
            this.a6_1 = 1;
            suspendResult = ApiClient_instance.qm(this.cz_1, '/api/stations', 'POST', this.dz_1, true, this);
            if (suspendResult === get_COROUTINE_SUSPENDED()) {
              return suspendResult;
            }

            continue $sm;
          case 1:
            this.ez_1 = suspendResult;
            if (this.bz_1.cq_1) {
              this.a6_1 = 2;
              suspendResult = ApiClient_instance.rm(this.cz_1, '/api/stations/' + ApiClient_instance.vm(this.bz_1.yp_1) + '/activate', 'POST', VOID, true, this);
              if (suspendResult === get_COROUTINE_SUSPENDED()) {
                return suspendResult;
              }
              continue $sm;
            } else {
              var tmp_0 = this;
              tmp_0.fz_1 = this.ez_1;
              this.a6_1 = 3;
              continue $sm;
            }

          case 2:
            var ARGUMENT = suspendResult;
            this.fz_1 = this.ez_1 + '\n\n' + ARGUMENT;
            this.a6_1 = 3;
            continue $sm;
          case 3:
            return this.fz_1;
          case 4:
            throw this.d6_1;
        }
      } catch ($p) {
        var e = $p;
        if (this.b6_1 === 4) {
          throw e;
        } else {
          this.a6_1 = this.b6_1;
          this.d6_1 = e;
        }
      }
     while (true);
  };
  function $submitAgentCOROUTINE$6(_this__u8e3s4, backendUrl, resultContinuation) {
    CoroutineImpl.call(this, resultContinuation);
    this.oz_1 = _this__u8e3s4;
    this.pz_1 = backendUrl;
  }
  protoOf($submitAgentCOROUTINE$6).i6 = function () {
    var suspendResult = this.c6_1;
    $sm: do
      try {
        var tmp = this.a6_1;
        switch (tmp) {
          case 0:
            this.b6_1 = 4;
            var tmp_0 = this;
            var tmp_1 = ApiClient_instance;
            var tmp_2 = to('id', this.oz_1.jq_1);
            var tmp_3 = to('type', this.oz_1.kq_1);
            var tmp_4 = to('position', ApiClient_instance.um([to('latitude', this.oz_1.xp_1.up_1), to('longitude', this.oz_1.xp_1.vp_1), to('altitudeMeters', toDouble(this.oz_1.lq_1))]));
            var tmp_5 = to('energyLevelPercent', 100.0);
            var tmp_6 = to('maxRangeMeters', toDouble(this.oz_1.mq_1));
            var tmp_7 = to('payloadCapacityKg', toDouble(this.oz_1.nq_1));
            var this_0 = this.oz_1.oq_1;
            var tmp_8;
            if (isBlank(this_0)) {
              tmp_8 = null;
            } else {
              tmp_8 = this_0;
            }

            tmp_0.qz_1 = tmp_1.tm([tmp_2, tmp_3, tmp_4, tmp_5, tmp_6, tmp_7, to('currentStationId', tmp_8), to('runtime', ApiClient_instance.um([to('autoStart', this.oz_1.pq_1), to('px4Model', this.oz_1.qq_1), to('px4Instance', toInt(this.oz_1.rq_1)), to('mavlinkPort', toInt(this.oz_1.sq_1)), to('spawnInGazebo', true)]))]);
            this.a6_1 = 1;
            suspendResult = ApiClient_instance.rm(this.pz_1, '/api/agents', 'POST', this.qz_1, VOID, this);
            if (suspendResult === get_COROUTINE_SUSPENDED()) {
              return suspendResult;
            }

            continue $sm;
          case 1:
            this.rz_1 = suspendResult;
            if (this.oz_1.tq_1) {
              this.a6_1 = 2;
              suspendResult = ApiClient_instance.rm(this.pz_1, '/api/agents/' + ApiClient_instance.vm(this.oz_1.jq_1) + '/activate', 'POST', VOID, VOID, this);
              if (suspendResult === get_COROUTINE_SUSPENDED()) {
                return suspendResult;
              }
              continue $sm;
            } else {
              var tmp_9 = this;
              tmp_9.sz_1 = this.rz_1;
              this.a6_1 = 3;
              continue $sm;
            }

          case 2:
            var ARGUMENT = suspendResult;
            this.sz_1 = this.rz_1 + '\n\n' + ARGUMENT;
            this.a6_1 = 3;
            continue $sm;
          case 3:
            return this.sz_1;
          case 4:
            throw this.d6_1;
        }
      } catch ($p) {
        var e = $p;
        if (this.b6_1 === 4) {
          throw e;
        } else {
          this.a6_1 = this.b6_1;
          this.d6_1 = e;
        }
      }
     while (true);
  };
  function RegisterOverlayState(mode, coord, stationId, stationName, storageCapacity, parkingCapacity, activateStation, customerId, weightKg, volumeM3, destLat, destLon, groundTransport, agentId, agentType, agentAlt, agentRange, agentPayload, agentStationId, agentAutoStart, agentPx4Model, agentPx4Instance, agentMavlinkPort, activateAgent) {
    stationId = stationId === VOID ? 'station-' + timestamp() : stationId;
    stationName = stationName === VOID ? 'Transfer station' : stationName;
    storageCapacity = storageCapacity === VOID ? '4' : storageCapacity;
    parkingCapacity = parkingCapacity === VOID ? '2' : parkingCapacity;
    activateStation = activateStation === VOID ? true : activateStation;
    customerId = customerId === VOID ? 'client-1' : customerId;
    weightKg = weightKg === VOID ? '2.0' : weightKg;
    volumeM3 = volumeM3 === VOID ? '0.02' : volumeM3;
    destLat = destLat === VOID ? '' : destLat;
    destLon = destLon === VOID ? '' : destLon;
    groundTransport = groundTransport === VOID ? false : groundTransport;
    agentId = agentId === VOID ? 'uav-' + timestamp() : agentId;
    agentType = agentType === VOID ? 'UAV' : agentType;
    agentAlt = agentAlt === VOID ? '0' : agentAlt;
    agentRange = agentRange === VOID ? '650' : agentRange;
    agentPayload = agentPayload === VOID ? '5' : agentPayload;
    agentStationId = agentStationId === VOID ? '' : agentStationId;
    agentAutoStart = agentAutoStart === VOID ? true : agentAutoStart;
    agentPx4Model = agentPx4Model === VOID ? 'x500' : agentPx4Model;
    agentPx4Instance = agentPx4Instance === VOID ? '0' : agentPx4Instance;
    agentMavlinkPort = agentMavlinkPort === VOID ? '14580' : agentMavlinkPort;
    activateAgent = activateAgent === VOID ? true : activateAgent;
    this.wp_1 = mode;
    this.xp_1 = coord;
    this.yp_1 = stationId;
    this.zp_1 = stationName;
    this.aq_1 = storageCapacity;
    this.bq_1 = parkingCapacity;
    this.cq_1 = activateStation;
    this.dq_1 = customerId;
    this.eq_1 = weightKg;
    this.fq_1 = volumeM3;
    this.gq_1 = destLat;
    this.hq_1 = destLon;
    this.iq_1 = groundTransport;
    this.jq_1 = agentId;
    this.kq_1 = agentType;
    this.lq_1 = agentAlt;
    this.mq_1 = agentRange;
    this.nq_1 = agentPayload;
    this.oq_1 = agentStationId;
    this.pq_1 = agentAutoStart;
    this.qq_1 = agentPx4Model;
    this.rq_1 = agentPx4Instance;
    this.sq_1 = agentMavlinkPort;
    this.tq_1 = activateAgent;
  }
  protoOf(RegisterOverlayState).ry = function (backendUrl, $completion) {
    var tmp = new $submitCOROUTINE$4(this, backendUrl, $completion);
    tmp.c6_1 = Unit_instance;
    tmp.d6_1 = null;
    return tmp.i6();
  };
  protoOf(RegisterOverlayState).g10 = function (mode, coord, stationId, stationName, storageCapacity, parkingCapacity, activateStation, customerId, weightKg, volumeM3, destLat, destLon, groundTransport, agentId, agentType, agentAlt, agentRange, agentPayload, agentStationId, agentAutoStart, agentPx4Model, agentPx4Instance, agentMavlinkPort, activateAgent) {
    return new RegisterOverlayState(mode, coord, stationId, stationName, storageCapacity, parkingCapacity, activateStation, customerId, weightKg, volumeM3, destLat, destLon, groundTransport, agentId, agentType, agentAlt, agentRange, agentPayload, agentStationId, agentAutoStart, agentPx4Model, agentPx4Instance, agentMavlinkPort, activateAgent);
  };
  protoOf(RegisterOverlayState).uq = function (mode, coord, stationId, stationName, storageCapacity, parkingCapacity, activateStation, customerId, weightKg, volumeM3, destLat, destLon, groundTransport, agentId, agentType, agentAlt, agentRange, agentPayload, agentStationId, agentAutoStart, agentPx4Model, agentPx4Instance, agentMavlinkPort, activateAgent, $super) {
    mode = mode === VOID ? this.wp_1 : mode;
    coord = coord === VOID ? this.xp_1 : coord;
    stationId = stationId === VOID ? this.yp_1 : stationId;
    stationName = stationName === VOID ? this.zp_1 : stationName;
    storageCapacity = storageCapacity === VOID ? this.aq_1 : storageCapacity;
    parkingCapacity = parkingCapacity === VOID ? this.bq_1 : parkingCapacity;
    activateStation = activateStation === VOID ? this.cq_1 : activateStation;
    customerId = customerId === VOID ? this.dq_1 : customerId;
    weightKg = weightKg === VOID ? this.eq_1 : weightKg;
    volumeM3 = volumeM3 === VOID ? this.fq_1 : volumeM3;
    destLat = destLat === VOID ? this.gq_1 : destLat;
    destLon = destLon === VOID ? this.hq_1 : destLon;
    groundTransport = groundTransport === VOID ? this.iq_1 : groundTransport;
    agentId = agentId === VOID ? this.jq_1 : agentId;
    agentType = agentType === VOID ? this.kq_1 : agentType;
    agentAlt = agentAlt === VOID ? this.lq_1 : agentAlt;
    agentRange = agentRange === VOID ? this.mq_1 : agentRange;
    agentPayload = agentPayload === VOID ? this.nq_1 : agentPayload;
    agentStationId = agentStationId === VOID ? this.oq_1 : agentStationId;
    agentAutoStart = agentAutoStart === VOID ? this.pq_1 : agentAutoStart;
    agentPx4Model = agentPx4Model === VOID ? this.qq_1 : agentPx4Model;
    agentPx4Instance = agentPx4Instance === VOID ? this.rq_1 : agentPx4Instance;
    agentMavlinkPort = agentMavlinkPort === VOID ? this.sq_1 : agentMavlinkPort;
    activateAgent = activateAgent === VOID ? this.tq_1 : activateAgent;
    return $super === VOID ? this.g10(mode, coord, stationId, stationName, storageCapacity, parkingCapacity, activateStation, customerId, weightKg, volumeM3, destLat, destLon, groundTransport, agentId, agentType, agentAlt, agentRange, agentPayload, agentStationId, agentAutoStart, agentPx4Model, agentPx4Instance, agentMavlinkPort, activateAgent) : $super.g10.call(this, mode, coord, stationId, stationName, storageCapacity, parkingCapacity, activateStation, customerId, weightKg, volumeM3, destLat, destLon, groundTransport, agentId, agentType, agentAlt, agentRange, agentPayload, agentStationId, agentAutoStart, agentPx4Model, agentPx4Instance, agentMavlinkPort, activateAgent);
  };
  protoOf(RegisterOverlayState).toString = function () {
    return 'RegisterOverlayState(mode=' + this.wp_1.toString() + ', coord=' + this.xp_1.toString() + ', stationId=' + this.yp_1 + ', stationName=' + this.zp_1 + ', storageCapacity=' + this.aq_1 + ', parkingCapacity=' + this.bq_1 + ', activateStation=' + this.cq_1 + ', customerId=' + this.dq_1 + ', weightKg=' + this.eq_1 + ', volumeM3=' + this.fq_1 + ', destLat=' + this.gq_1 + ', destLon=' + this.hq_1 + ', groundTransport=' + this.iq_1 + ', agentId=' + this.jq_1 + ', agentType=' + this.kq_1 + ', agentAlt=' + this.lq_1 + ', agentRange=' + this.mq_1 + ', agentPayload=' + this.nq_1 + ', agentStationId=' + this.oq_1 + ', agentAutoStart=' + this.pq_1 + ', agentPx4Model=' + this.qq_1 + ', agentPx4Instance=' + this.rq_1 + ', agentMavlinkPort=' + this.sq_1 + ', activateAgent=' + this.tq_1 + ')';
  };
  protoOf(RegisterOverlayState).hashCode = function () {
    var result = this.wp_1.hashCode();
    result = imul(result, 31) + this.xp_1.hashCode() | 0;
    result = imul(result, 31) + getStringHashCode(this.yp_1) | 0;
    result = imul(result, 31) + getStringHashCode(this.zp_1) | 0;
    result = imul(result, 31) + getStringHashCode(this.aq_1) | 0;
    result = imul(result, 31) + getStringHashCode(this.bq_1) | 0;
    result = imul(result, 31) + getBooleanHashCode(this.cq_1) | 0;
    result = imul(result, 31) + getStringHashCode(this.dq_1) | 0;
    result = imul(result, 31) + getStringHashCode(this.eq_1) | 0;
    result = imul(result, 31) + getStringHashCode(this.fq_1) | 0;
    result = imul(result, 31) + getStringHashCode(this.gq_1) | 0;
    result = imul(result, 31) + getStringHashCode(this.hq_1) | 0;
    result = imul(result, 31) + getBooleanHashCode(this.iq_1) | 0;
    result = imul(result, 31) + getStringHashCode(this.jq_1) | 0;
    result = imul(result, 31) + getStringHashCode(this.kq_1) | 0;
    result = imul(result, 31) + getStringHashCode(this.lq_1) | 0;
    result = imul(result, 31) + getStringHashCode(this.mq_1) | 0;
    result = imul(result, 31) + getStringHashCode(this.nq_1) | 0;
    result = imul(result, 31) + getStringHashCode(this.oq_1) | 0;
    result = imul(result, 31) + getBooleanHashCode(this.pq_1) | 0;
    result = imul(result, 31) + getStringHashCode(this.qq_1) | 0;
    result = imul(result, 31) + getStringHashCode(this.rq_1) | 0;
    result = imul(result, 31) + getStringHashCode(this.sq_1) | 0;
    result = imul(result, 31) + getBooleanHashCode(this.tq_1) | 0;
    return result;
  };
  protoOf(RegisterOverlayState).equals = function (other) {
    if (this === other)
      return true;
    if (!(other instanceof RegisterOverlayState))
      return false;
    var tmp0_other_with_cast = other instanceof RegisterOverlayState ? other : THROW_CCE();
    if (!this.wp_1.equals(tmp0_other_with_cast.wp_1))
      return false;
    if (!this.xp_1.equals(tmp0_other_with_cast.xp_1))
      return false;
    if (!(this.yp_1 === tmp0_other_with_cast.yp_1))
      return false;
    if (!(this.zp_1 === tmp0_other_with_cast.zp_1))
      return false;
    if (!(this.aq_1 === tmp0_other_with_cast.aq_1))
      return false;
    if (!(this.bq_1 === tmp0_other_with_cast.bq_1))
      return false;
    if (!(this.cq_1 === tmp0_other_with_cast.cq_1))
      return false;
    if (!(this.dq_1 === tmp0_other_with_cast.dq_1))
      return false;
    if (!(this.eq_1 === tmp0_other_with_cast.eq_1))
      return false;
    if (!(this.fq_1 === tmp0_other_with_cast.fq_1))
      return false;
    if (!(this.gq_1 === tmp0_other_with_cast.gq_1))
      return false;
    if (!(this.hq_1 === tmp0_other_with_cast.hq_1))
      return false;
    if (!(this.iq_1 === tmp0_other_with_cast.iq_1))
      return false;
    if (!(this.jq_1 === tmp0_other_with_cast.jq_1))
      return false;
    if (!(this.kq_1 === tmp0_other_with_cast.kq_1))
      return false;
    if (!(this.lq_1 === tmp0_other_with_cast.lq_1))
      return false;
    if (!(this.mq_1 === tmp0_other_with_cast.mq_1))
      return false;
    if (!(this.nq_1 === tmp0_other_with_cast.nq_1))
      return false;
    if (!(this.oq_1 === tmp0_other_with_cast.oq_1))
      return false;
    if (!(this.pq_1 === tmp0_other_with_cast.pq_1))
      return false;
    if (!(this.qq_1 === tmp0_other_with_cast.qq_1))
      return false;
    if (!(this.rq_1 === tmp0_other_with_cast.rq_1))
      return false;
    if (!(this.sq_1 === tmp0_other_with_cast.sq_1))
      return false;
    if (!(this.tq_1 === tmp0_other_with_cast.tq_1))
      return false;
    return true;
  };
  function timestamp() {
    var tmp = Date.now();
    return numberToLong((!(tmp == null) ? typeof tmp === 'number' : false) ? tmp : THROW_CCE()).toString();
  }
  function formatCoord_0(_this__u8e3s4, decimals) {
    // Inline function 'kotlin.js.asDynamic' call
    var tmp = _this__u8e3s4.toFixed(decimals);
    return (!(tmp == null) ? typeof tmp === 'string' : false) ? tmp : THROW_CCE();
  }
  //region block: init
  ApiClient_instance = new ApiClient();
  //endregion
  mainWrapper();
  return _;
}));

//# sourceMappingURL=uav-logistics-system-frontend.js.map
