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
  var THROW_CCE = kotlin_kotlin.$_$.a5;
  var CoroutineImpl = kotlin_kotlin.$_$.t2;
  var _Char___init__impl__6a9atx = kotlin_kotlin.$_$.z;
  var charArrayOf = kotlin_kotlin.$_$.z2;
  var trimEnd = kotlin_kotlin.$_$.q4;
  var await_0 = kotlin_org_jetbrains_kotlinx_kotlinx_coroutines_core.$_$.a;
  var get_COROUTINE_SUSPENDED = kotlin_kotlin.$_$.d2;
  var toString = kotlin_kotlin.$_$.a4;
  var IllegalStateException_init_$Create$ = kotlin_kotlin.$_$.q;
  var protoOf = kotlin_kotlin.$_$.y3;
  var initMetadataForCoroutine = kotlin_kotlin.$_$.m3;
  var Unit_getInstance = kotlin_kotlin.$_$.j1;
  var VOID = kotlin_kotlin.$_$.b;
  var Companion_getInstance = kotlin_kotlin.$_$.i1;
  var _Result___init__impl__xyqfz8 = kotlin_kotlin.$_$.b1;
  var createFailure = kotlin_kotlin.$_$.e5;
  var Result__exceptionOrNull_impl_p6xea9 = kotlin_kotlin.$_$.c1;
  var _Result___get_value__impl__bjfvqg = kotlin_kotlin.$_$.f1;
  var initMetadataForObject = kotlin_kotlin.$_$.p3;
  var listOf = kotlin_kotlin.$_$.v1;
  var numberToInt = kotlin_kotlin.$_$.v3;
  var toDoubleOrNull = kotlin_kotlin.$_$.m4;
  var CoroutineScope = kotlin_org_jetbrains_kotlinx_kotlinx_coroutines_core.$_$.e;
  var isInterface = kotlin_kotlin.$_$.r3;
  var initMetadataForLambda = kotlin_kotlin.$_$.o3;
  var launch = kotlin_org_jetbrains_kotlinx_kotlinx_coroutines_core.$_$.g;
  var initMetadataForClass = kotlin_kotlin.$_$.k3;
  var SuspendFunction1 = kotlin_kotlin.$_$.u2;
  var throwUninitializedPropertyAccessException = kotlin_kotlin.$_$.j5;
  var charSequenceLength = kotlin_kotlin.$_$.b3;
  var charSequenceGet = kotlin_kotlin.$_$.a3;
  var toString_0 = kotlin_kotlin.$_$.a1;
  var ensureNotNull = kotlin_kotlin.$_$.f5;
  var equals = kotlin_kotlin.$_$.e3;
  var checkIndexOverflow = kotlin_kotlin.$_$.p1;
  var Long = kotlin_kotlin.$_$.x4;
  var delay = kotlin_org_jetbrains_kotlinx_kotlinx_coroutines_core.$_$.b;
  var _Result___get_isSuccess__impl__sndoy8 = kotlin_kotlin.$_$.e1;
  var isBlank = kotlin_kotlin.$_$.h4;
  var emptyList = kotlin_kotlin.$_$.r1;
  var SupervisorJob = kotlin_org_jetbrains_kotlinx_kotlinx_coroutines_core.$_$.f;
  var Dispatchers_getInstance = kotlin_org_jetbrains_kotlinx_kotlinx_coroutines_core.$_$.c;
  var CoroutineScope_0 = kotlin_org_jetbrains_kotlinx_kotlinx_coroutines_core.$_$.d;
  var LinkedHashMap_init_$Create$ = kotlin_kotlin.$_$.g;
  var ArrayList_init_$Create$ = kotlin_kotlin.$_$.e;
  var to = kotlin_kotlin.$_$.l5;
  var coerceIn = kotlin_kotlin.$_$.c4;
  var filterNotNull = kotlin_kotlin.$_$.s1;
  var NoSuchElementException_init_$Create$ = kotlin_kotlin.$_$.s;
  var equals_0 = kotlin_kotlin.$_$.g4;
  var collectionSizeOrDefault = kotlin_kotlin.$_$.q1;
  var ArrayList_init_$Create$_0 = kotlin_kotlin.$_$.d;
  var listOf_0 = kotlin_kotlin.$_$.u1;
  var StringBuilder_init_$Create$ = kotlin_kotlin.$_$.l;
  var isFinite = kotlin_kotlin.$_$.g5;
  var isCharSequence = kotlin_kotlin.$_$.q3;
  var trim = kotlin_kotlin.$_$.r4;
  var noWhenBranchMatchedException = kotlin_kotlin.$_$.h5;
  var compareTo = kotlin_kotlin.$_$.c3;
  var split = kotlin_kotlin.$_$.j4;
  var getStringHashCode = kotlin_kotlin.$_$.i3;
  var average = kotlin_kotlin.$_$.o1;
  var minOrNull = kotlin_kotlin.$_$.x1;
  var maxOrNull = kotlin_kotlin.$_$.w1;
  var coerceAtLeast = kotlin_kotlin.$_$.b4;
  var isNumber = kotlin_kotlin.$_$.s3;
  var numberToDouble = kotlin_kotlin.$_$.u3;
  var _Result___get_isFailure__impl__jpiriv = kotlin_kotlin.$_$.d1;
  var LinkedHashSet_init_$Create$ = kotlin_kotlin.$_$.h;
  var sorted = kotlin_kotlin.$_$.b2;
  var THROW_IAE = kotlin_kotlin.$_$.b5;
  var enumEntries = kotlin_kotlin.$_$.w2;
  var Enum = kotlin_kotlin.$_$.t4;
  var getNumberHashCode = kotlin_kotlin.$_$.h3;
  var take = kotlin_kotlin.$_$.l4;
  var takeLast = kotlin_kotlin.$_$.k4;
  var get_indices = kotlin_kotlin.$_$.t1;
  var setOf = kotlin_kotlin.$_$.a2;
  var IllegalArgumentException_init_$Create$ = kotlin_kotlin.$_$.o;
  var toDouble = kotlin_kotlin.$_$.n4;
  var toInt = kotlin_kotlin.$_$.o4;
  var getBooleanHashCode = kotlin_kotlin.$_$.g3;
  var numberToLong = kotlin_kotlin.$_$.w3;
  //endregion
  //region block: pre-declaration
  initMetadataForCoroutine($requestCOROUTINE$0, CoroutineImpl);
  initMetadataForObject(ApiClient, 'ApiClient', VOID, VOID, VOID, [5]);
  initMetadataForLambda(DomAgentSettings$lambda$slambda, CoroutineImpl, [CoroutineImpl], [1]);
  initMetadataForCoroutine($applyToFleetCOROUTINE$0, CoroutineImpl);
  initMetadataForClass(DomAgentSettings, 'DomAgentSettings', VOID, VOID, VOID, [0]);
  initMetadataForLambda(DomApp$buildHistoryPage$lambda$slambda$lambda$slambda, CoroutineImpl, [CoroutineImpl], [1]);
  initMetadataForLambda(DomApp$mount$lambda$slambda, CoroutineImpl, [CoroutineImpl], [1]);
  initMetadataForLambda(DomApp$mount$lambda$slambda_1, CoroutineImpl, [CoroutineImpl], [1]);
  initMetadataForLambda(DomApp$mount$lambda$slambda_3, CoroutineImpl, [CoroutineImpl], [1]);
  initMetadataForLambda(DomApp$mount$lambda$slambda_5, CoroutineImpl, [CoroutineImpl], [1]);
  initMetadataForLambda(DomApp$mount$slambda, CoroutineImpl, [CoroutineImpl], [1]);
  initMetadataForLambda(DomApp$buildMapPage$lambda$slambda, CoroutineImpl, [CoroutineImpl], [1]);
  initMetadataForLambda(DomApp$buildHistoryPage$lambda$slambda, CoroutineImpl, [CoroutineImpl], [1]);
  initMetadataForLambda(DomApp$buildHistoryPage$lambda$slambda_1, CoroutineImpl, [CoroutineImpl], [1]);
  initMetadataForLambda(DomApp$renderHistoryArchive$lambda$slambda, CoroutineImpl, [CoroutineImpl], [1]);
  initMetadataForCoroutine($loadHistoryCOROUTINE$0, CoroutineImpl);
  initMetadataForCoroutine($refreshCOROUTINE$1, CoroutineImpl);
  initMetadataForObject(DomApp, 'DomApp', VOID, VOID, VOID, [2, 1]);
  initMetadataForClass(VehicleRangeStyle, 'VehicleRangeStyle');
  initMetadataForClass(DomMapView, 'DomMapView');
  initMetadataForLambda(DomRegisterModal$submit$slambda, CoroutineImpl, [CoroutineImpl], [1]);
  initMetadataForClass(DomRegisterModal, 'DomRegisterModal');
  initMetadataForObject(AgentRangeSettings, 'AgentRangeSettings');
  initMetadataForClass(MapAddMode, 'MapAddMode', VOID, Enum);
  initMetadataForClass(MapPoint, 'MapPoint');
  initMetadataForClass(MapRangePurpose, 'MapRangePurpose', VOID, Enum);
  initMetadataForClass(MapRangeDisc, 'MapRangeDisc');
  initMetadataForClass(MapPointKind, 'MapPointKind', VOID, Enum);
  initMetadataForClass(MapBounds, 'MapBounds');
  initMetadataForClass(GeoCoord, 'GeoCoord');
  initMetadataForCoroutine($submitCOROUTINE$3, CoroutineImpl);
  initMetadataForCoroutine($submitStationCOROUTINE$4, CoroutineImpl);
  initMetadataForCoroutine($submitAgentCOROUTINE$5, CoroutineImpl);
  initMetadataForClass(RegisterOverlayState, 'RegisterOverlayState', VOID, VOID, VOID, [1]);
  //endregion
  function main() {
    var tmp = document.getElementById('root');
    var root = tmp instanceof HTMLElement ? tmp : THROW_CCE();
    DomApp_getInstance().mount_dchvzh_k$(root);
  }
  function mainWrapper() {
    main();
  }
  function $requestCOROUTINE$0(_this__u8e3s4, backendUrl, path, method, body, admin, resultContinuation) {
    CoroutineImpl.call(this, resultContinuation);
    this._this__u8e3s4__1 = _this__u8e3s4;
    this.backendUrl_1 = backendUrl;
    this.path_1 = path;
    this.method_1 = method;
    this.body_1 = body;
    this.admin_1 = admin;
  }
  protoOf($requestCOROUTINE$0).doResume_5yljmg_k$ = function () {
    var suspendResult = this.get_result_iyg5d2_k$();
    $sm: do
      try {
        var tmp = this.get_state_iypx7s_k$();
        switch (tmp) {
          case 0:
            this.set_exceptionState_fex74n_k$(3);
            this.headers0__1 = {};
            this.headers0__1['Content-Type'] = 'application/json';
            if (this.admin_1) {
              this.headers0__1['X-User-Role'] = 'ADMIN';
            }

            this.init1__1 = {};
            this.init1__1.method = this.method_1;
            this.init1__1.headers = this.headers0__1;
            if (!(this.body_1 == null))
              this.init1__1.body = this.body_1;
            this.set_state_rjd8d0_k$(1);
            var tmp_0 = window;
            var tmp_1 = trimEnd(this.backendUrl_1, charArrayOf([_Char___init__impl__6a9atx(47)])) + this.path_1;
            var this_0 = this.init1__1;
            suspendResult = await_0(tmp_0.fetch(tmp_1, this_0), this);
            if (suspendResult === get_COROUTINE_SUSPENDED()) {
              return suspendResult;
            }

            continue $sm;
          case 1:
            this.response2__1 = suspendResult;
            this.set_state_rjd8d0_k$(2);
            suspendResult = await_0(this.response2__1.text(), this);
            if (suspendResult === get_COROUTINE_SUSPENDED()) {
              return suspendResult;
            }

            continue $sm;
          case 2:
            var text = suspendResult;
            if (!this.response2__1.ok) {
              var message = 'HTTP ' + this.response2__1.status + ': ' + text;
              throw IllegalStateException_init_$Create$(toString(message));
            }

            return text;
          case 3:
            throw this.get_exception_x0n6w6_k$();
        }
      } catch ($p) {
        var e = $p;
        if (this.get_exceptionState_wflpxn_k$() === 3) {
          throw e;
        } else {
          this.set_state_rjd8d0_k$(this.get_exceptionState_wflpxn_k$());
          this.set_exception_px07aa_k$(e);
        }
      }
     while (true);
  };
  function ApiClient() {
    ApiClient_instance = this;
  }
  protoOf(ApiClient).request_gu70ny_k$ = function (backendUrl, path, method, body, admin, $completion) {
    var tmp = new $requestCOROUTINE$0(this, backendUrl, path, method, body, admin, $completion);
    tmp.set_result_xj64lm_k$(Unit_getInstance());
    tmp.set_exception_px07aa_k$(null);
    return tmp.doResume_5yljmg_k$();
  };
  protoOf(ApiClient).request$default_u44nmf_k$ = function (backendUrl, path, method, body, admin, $completion, $super) {
    method = method === VOID ? 'GET' : method;
    body = body === VOID ? null : body;
    admin = admin === VOID ? false : admin;
    return $super === VOID ? this.request_gu70ny_k$(backendUrl, path, method, body, admin, $completion) : $super.request_gu70ny_k$.call(this, backendUrl, path, method, body, admin, $completion);
  };
  protoOf(ApiClient).pretty_6zexfg_k$ = function (json) {
    // Inline function 'kotlin.getOrElse' call
    // Inline function 'kotlin.runCatching' call
    var tmp;
    try {
      // Inline function 'kotlin.Companion.success' call
      Companion_getInstance();
      // Inline function 'pl.edu.wat.uavlogistics.frontend.api.ApiClient.pretty.<anonymous>' call
      var value = JSON.stringify(JSON.parse(json), null, 2);
      tmp = _Result___init__impl__xyqfz8(value);
    } catch ($p) {
      var tmp_0;
      if ($p instanceof Error) {
        var e = $p;
        // Inline function 'kotlin.Companion.failure' call
        Companion_getInstance();
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
  protoOf(ApiClient).jsonBody_4314q6_k$ = function (fields) {
    return JSON.stringify(this.jsonObject_af0vtd_k$(fields.slice()));
  };
  protoOf(ApiClient).jsonObject_af0vtd_k$ = function (fields) {
    var obj = {};
    // Inline function 'kotlin.collections.forEach' call
    var inductionVariable = 0;
    var last = fields.length;
    while (inductionVariable < last) {
      var element = fields[inductionVariable];
      inductionVariable = inductionVariable + 1 | 0;
      // Inline function 'pl.edu.wat.uavlogistics.frontend.api.ApiClient.jsonObject.<anonymous>' call
      var key = element.component1_7eebsc_k$();
      var value = element.component2_7eebsb_k$();
      obj[key] = value;
    }
    return obj;
  };
  protoOf(ApiClient).pathSegment_ut1190_k$ = function (value) {
    var tmp = encodeURIComponent(value);
    return (!(tmp == null) ? typeof tmp === 'string' : false) ? tmp : THROW_CCE();
  };
  var ApiClient_instance;
  function ApiClient_getInstance() {
    if (ApiClient_instance == null)
      new ApiClient();
    return ApiClient_instance;
  }
  function _get_scope__bi2zur($this) {
    return $this.scope_1;
  }
  function _get_backendUrl__zbacsw($this) {
    return $this.backendUrl_1;
  }
  function _get_onLog__d8u450($this) {
    return $this.onLog_1;
  }
  function _get_onApplied__rcbiq5($this) {
    return $this.onApplied_1;
  }
  function _get_host__d7qftv($this) {
    return $this.host_1;
  }
  function _get_uavInput__proq4r($this) {
    return $this.uavInput_1;
  }
  function _get_ugvInput__edwlff($this) {
    return $this.ugvInput_1;
  }
  function _get_reserveInput__ifkc4j($this) {
    return $this.reserveInput_1;
  }
  function _get_previewHost__4gton5($this) {
    return $this.previewHost_1;
  }
  function refreshFields($this) {
    $this.uavInput_1.value = uavMaxText($this);
    $this.ugvInput_1.value = ugvMaxText($this);
    $this.reserveInput_1.value = reserveText($this);
  }
  function applyToFleet($this, $completion) {
    var tmp = new $applyToFleetCOROUTINE$0($this, $completion);
    tmp.set_result_xj64lm_k$(Unit_getInstance());
    tmp.set_exception_px07aa_k$(null);
    return tmp.doResume_5yljmg_k$();
  }
  function renderPreview($this) {
    clearChildren($this.previewHost_1);
    $this.previewHost_1.appendChild(el('h3', 'state-section-title', 'Computed map radii'));
    // Inline function 'kotlin.collections.forEach' call
    var tmp0_iterator = listOf(['UAV', 'UGV']).iterator_jk1svi_k$();
    while (tmp0_iterator.hasNext_bitz1p_k$()) {
      var element = tmp0_iterator.next_20eer_k$();
      // Inline function 'pl.edu.wat.uavlogistics.frontend.dom.DomAgentSettings.renderPreview.<anonymous>' call
      var max = numberToInt(AgentRangeSettings_getInstance().maxRangeMetersForType_c56k1m_k$(element));
      var travel = numberToInt(AgentRangeSettings_getInstance().interStationRadiusMeters_412die_k$(element));
      var pickup = numberToInt(AgentRangeSettings_getInstance().packagePickupRadiusMeters$default_db3rpi_k$(element));
      var reserve = numberToInt(AgentRangeSettings_getInstance().get_routeReservePercent_5inh07_k$());
      $this.previewHost_1.appendChild(el('p', null, element + ' \xB7 max ' + max + ' m \xB7 reserve ' + reserve + '%'));
      $this.previewHost_1.appendChild(el('p', null, '  Inter-station travel (one-way): ' + travel + ' m'));
      $this.previewHost_1.appendChild(el('p', null, '  Package pickup (out & back): ' + pickup + ' m'));
    }
  }
  function uavMaxText($this) {
    return AgentRangeSettings_getInstance().get_uavMaxRangeMeters_udmtc4_k$().toString();
  }
  function ugvMaxText($this) {
    return AgentRangeSettings_getInstance().get_ugvMaxRangeMeters_ka4ate_k$().toString();
  }
  function reserveText($this) {
    return AgentRangeSettings_getInstance().get_routeReservePercent_5inh07_k$().toString();
  }
  function DomAgentSettings$lambda(this$0) {
    return function (draft) {
      var tmp = AgentRangeSettings_getInstance();
      var tmp0_elvis_lhs = toDoubleOrNull(draft);
      tmp.applyValues$default_906vcf_k$(tmp0_elvis_lhs == null ? AgentRangeSettings_getInstance().get_uavMaxRangeMeters_udmtc4_k$() : tmp0_elvis_lhs, AgentRangeSettings_getInstance().get_ugvMaxRangeMeters_ka4ate_k$(), AgentRangeSettings_getInstance().get_routeReservePercent_5inh07_k$());
      renderPreview(this$0);
      return Unit_getInstance();
    };
  }
  function DomAgentSettings$lambda_0(this$0) {
    return function (draft) {
      var tmp = AgentRangeSettings_getInstance();
      var tmp_0 = AgentRangeSettings_getInstance().get_uavMaxRangeMeters_udmtc4_k$();
      var tmp0_elvis_lhs = toDoubleOrNull(draft);
      tmp.applyValues$default_906vcf_k$(tmp_0, tmp0_elvis_lhs == null ? AgentRangeSettings_getInstance().get_ugvMaxRangeMeters_ka4ate_k$() : tmp0_elvis_lhs, AgentRangeSettings_getInstance().get_routeReservePercent_5inh07_k$());
      renderPreview(this$0);
      return Unit_getInstance();
    };
  }
  function DomAgentSettings$lambda_1(this$0) {
    return function (draft) {
      var tmp = AgentRangeSettings_getInstance();
      var tmp_0 = AgentRangeSettings_getInstance().get_uavMaxRangeMeters_udmtc4_k$();
      var tmp_1 = AgentRangeSettings_getInstance().get_ugvMaxRangeMeters_ka4ate_k$();
      var tmp0_elvis_lhs = toDoubleOrNull(draft);
      tmp.applyValues$default_906vcf_k$(tmp_0, tmp_1, tmp0_elvis_lhs == null ? AgentRangeSettings_getInstance().get_routeReservePercent_5inh07_k$() : tmp0_elvis_lhs);
      renderPreview(this$0);
      return Unit_getInstance();
    };
  }
  function DomAgentSettings$lambda$slambda(this$0, resultContinuation) {
    this.this$0__1 = this$0;
    CoroutineImpl.call(this, resultContinuation);
  }
  protoOf(DomAgentSettings$lambda$slambda).invoke_d9fzmj_k$ = function ($this$launch, $completion) {
    var tmp = this.create_rcuf4x_k$($this$launch, $completion);
    tmp.set_result_xj64lm_k$(Unit_getInstance());
    tmp.set_exception_px07aa_k$(null);
    return tmp.doResume_5yljmg_k$();
  };
  protoOf(DomAgentSettings$lambda$slambda).invoke_qns8j1_k$ = function (p1, $completion) {
    return this.invoke_d9fzmj_k$((!(p1 == null) ? isInterface(p1, CoroutineScope) : false) ? p1 : THROW_CCE(), $completion);
  };
  protoOf(DomAgentSettings$lambda$slambda).doResume_5yljmg_k$ = function () {
    var suspendResult = this.get_result_iyg5d2_k$();
    $sm: do
      try {
        var tmp = this.get_state_iypx7s_k$();
        switch (tmp) {
          case 0:
            this.set_exceptionState_fex74n_k$(2);
            this.set_state_rjd8d0_k$(1);
            suspendResult = applyToFleet(this.this$0__1, this);
            if (suspendResult === get_COROUTINE_SUSPENDED()) {
              return suspendResult;
            }

            continue $sm;
          case 1:
            return Unit_getInstance();
          case 2:
            throw this.get_exception_x0n6w6_k$();
        }
      } catch ($p) {
        var e = $p;
        if (this.get_exceptionState_wflpxn_k$() === 2) {
          throw e;
        } else {
          this.set_state_rjd8d0_k$(this.get_exceptionState_wflpxn_k$());
          this.set_exception_px07aa_k$(e);
        }
      }
     while (true);
  };
  protoOf(DomAgentSettings$lambda$slambda).create_rcuf4x_k$ = function ($this$launch, completion) {
    var i = new DomAgentSettings$lambda$slambda(this.this$0__1, completion);
    i.$this$launch_1 = $this$launch;
    return i;
  };
  protoOf(DomAgentSettings$lambda$slambda).create_wyq9v6_k$ = function (value, completion) {
    return this.create_rcuf4x_k$((!(value == null) ? isInterface(value, CoroutineScope) : false) ? value : THROW_CCE(), completion);
  };
  function DomAgentSettings$lambda$slambda_0(this$0, resultContinuation) {
    var i = new DomAgentSettings$lambda$slambda(this$0, resultContinuation);
    var l = function ($this$launch, $completion) {
      return i.invoke_d9fzmj_k$($this$launch, $completion);
    };
    l.$arity = 1;
    return l;
  }
  function DomAgentSettings$lambda_2(this$0) {
    return function () {
      launch(this$0.scope_1, VOID, VOID, DomAgentSettings$lambda$slambda_0(this$0, null));
      return Unit_getInstance();
    };
  }
  function DomAgentSettings$lambda_3(this$0) {
    return function () {
      AgentRangeSettings_getInstance().applyValues_l74jy7_k$(650.0, 600.0, 15.0, true);
      refreshFields(this$0);
      renderPreview(this$0);
      return Unit_getInstance();
    };
  }
  function $applyToFleetCOROUTINE$0(_this__u8e3s4, resultContinuation) {
    CoroutineImpl.call(this, resultContinuation);
    this._this__u8e3s4__1 = _this__u8e3s4;
  }
  protoOf($applyToFleetCOROUTINE$0).doResume_5yljmg_k$ = function () {
    var suspendResult = this.get_result_iyg5d2_k$();
    $sm: do
      try {
        var tmp = this.get_state_iypx7s_k$();
        switch (tmp) {
          case 0:
            this.set_exceptionState_fex74n_k$(4);
            var tmp_0 = AgentRangeSettings_getInstance();
            var tmp0_elvis_lhs = toDoubleOrNull(this._this__u8e3s4__1.uavInput_1.value);
            var tmp_1 = tmp0_elvis_lhs == null ? AgentRangeSettings_getInstance().get_uavMaxRangeMeters_udmtc4_k$() : tmp0_elvis_lhs;
            var tmp1_elvis_lhs = toDoubleOrNull(this._this__u8e3s4__1.ugvInput_1.value);
            var tmp_2 = tmp1_elvis_lhs == null ? AgentRangeSettings_getInstance().get_ugvMaxRangeMeters_ka4ate_k$() : tmp1_elvis_lhs;
            var tmp2_elvis_lhs = toDoubleOrNull(this._this__u8e3s4__1.reserveInput_1.value);
            tmp_0.applyValues_l74jy7_k$(tmp_1, tmp_2, tmp2_elvis_lhs == null ? AgentRangeSettings_getInstance().get_routeReservePercent_5inh07_k$() : tmp2_elvis_lhs, true);
            var tmp_3 = this;
            tmp_3.this0__1 = this._this__u8e3s4__1;
            this.set_exceptionState_fex74n_k$(2);
            var tmp_4 = this;
            tmp_4.this2__1 = Companion_getInstance();
            var tmp_5 = this;
            tmp_5.$this$runCatching3__1 = this.this0__1;
            this.set_state_rjd8d0_k$(1);
            suspendResult = ApiClient_getInstance().request$default_u44nmf_k$(this.$this$runCatching3__1.backendUrl_1(), '/api/settings/fleet-range', 'PUT', AgentRangeSettings_getInstance().toApiBody_ua0jc1_k$(), VOID, this);
            if (suspendResult === get_COROUTINE_SUSPENDED()) {
              return suspendResult;
            }

            continue $sm;
          case 1:
            var response = suspendResult;
            this.$this$runCatching3__1.onLog_1('Fleet range updated.\n\n' + ApiClient_getInstance().pretty_6zexfg_k$(response));
            var value = this.$this$runCatching3__1.onApplied_1();
            this.TRY_RESULT1__1 = _Result___init__impl__xyqfz8(value);
            this.set_exceptionState_fex74n_k$(4);
            this.set_state_rjd8d0_k$(3);
            continue $sm;
          case 2:
            this.set_exceptionState_fex74n_k$(4);
            var tmp_6 = this.get_exception_x0n6w6_k$();
            if (tmp_6 instanceof Error) {
              var e = this.get_exception_x0n6w6_k$();
              var tmp_7 = this;
              Companion_getInstance();
              tmp_7.TRY_RESULT1__1 = _Result___init__impl__xyqfz8(createFailure(e));
              this.set_state_rjd8d0_k$(3);
              continue $sm;
            } else {
              throw this.get_exception_x0n6w6_k$();
            }

          case 3:
            this.set_exceptionState_fex74n_k$(4);
            var this_0 = this.TRY_RESULT1__1;
            var tmp0_safe_receiver = Result__exceptionOrNull_impl_p6xea9(this_0);
            if (tmp0_safe_receiver == null)
              null;
            else {
              this._this__u8e3s4__1.onLog_1('ERROR: ' + failureMessage(tmp0_safe_receiver));
            }

            return Unit_getInstance();
          case 4:
            throw this.get_exception_x0n6w6_k$();
        }
      } catch ($p) {
        var e_0 = $p;
        if (this.get_exceptionState_wflpxn_k$() === 4) {
          throw e_0;
        } else {
          this.set_state_rjd8d0_k$(this.get_exceptionState_wflpxn_k$());
          this.set_exception_px07aa_k$(e_0);
        }
      }
     while (true);
  };
  function DomAgentSettings(scope, backendUrl, onLog, onApplied) {
    this.scope_1 = scope;
    this.backendUrl_1 = backendUrl;
    this.onLog_1 = onLog;
    this.onApplied_1 = onApplied;
    this.host_1 = el('div', 'settings-page');
    this.previewHost_1 = el('div', 'settings-preview');
    var panel = el('section', 'panel settings-form');
    panel.appendChild(el('h2', null, 'Agent range settings'));
    panel.appendChild(el('p', 'hint', 'Global max range per vehicle class. Map shows two radii per class at each station: inter-station travel (one-way + reserve) and package pickup (out & back + reserve, \xF72). UGV paths use factor 1.35. Apply updates every registered agent in the backend.'));
    var tmp = uavMaxText(this);
    var _destruct__k2r9zo = labeledInput('UAV max range (m)', tmp, 'number', DomAgentSettings$lambda(this));
    var uavLabel = _destruct__k2r9zo.component1_7eebsc_k$();
    var uavField = _destruct__k2r9zo.component2_7eebsb_k$();
    this.uavInput_1 = uavField;
    panel.appendChild(uavLabel);
    panel.appendChild(this.uavInput_1);
    var tmp_0 = ugvMaxText(this);
    var _destruct__k2r9zo_0 = labeledInput('UGV max range (m)', tmp_0, 'number', DomAgentSettings$lambda_0(this));
    var ugvLabel = _destruct__k2r9zo_0.component1_7eebsc_k$();
    var ugvField = _destruct__k2r9zo_0.component2_7eebsb_k$();
    this.ugvInput_1 = ugvField;
    panel.appendChild(ugvLabel);
    panel.appendChild(this.ugvInput_1);
    var tmp_1 = reserveText(this);
    var _destruct__k2r9zo_1 = labeledInput('Route energy reserve (%)', tmp_1, 'number', DomAgentSettings$lambda_1(this));
    var reserveLabel = _destruct__k2r9zo_1.component1_7eebsc_k$();
    var reserveField = _destruct__k2r9zo_1.component2_7eebsb_k$();
    this.reserveInput_1 = reserveField;
    panel.appendChild(reserveLabel);
    panel.appendChild(this.reserveInput_1);
    panel.appendChild(this.previewHost_1);
    renderPreview(this);
    var actions = el('div', 'settings-actions');
    actions.appendChild(button('Apply to fleet', VOID, DomAgentSettings$lambda_2(this)));
    actions.appendChild(button('Reset defaults', 'secondary', DomAgentSettings$lambda_3(this)));
    panel.appendChild(actions);
    this.host_1.appendChild(panel);
  }
  protoOf(DomAgentSettings).element_ri0d8k_k$ = function () {
    return this.host_1;
  };
  protoOf(DomAgentSettings).refreshFromSettings_uipw2g_k$ = function () {
    refreshFields(this);
    renderPreview(this);
  };
  function DomApp$buildHistoryPage$lambda$slambda$lambda$slambda($id, $timelineHost, resultContinuation) {
    this.$id_1 = $id;
    this.$timelineHost_1 = $timelineHost;
    CoroutineImpl.call(this, resultContinuation);
  }
  protoOf(DomApp$buildHistoryPage$lambda$slambda$lambda$slambda).invoke_d9fzmj_k$ = function ($this$launch, $completion) {
    var tmp = this.create_rcuf4x_k$($this$launch, $completion);
    tmp.set_result_xj64lm_k$(Unit_getInstance());
    tmp.set_exception_px07aa_k$(null);
    return tmp.doResume_5yljmg_k$();
  };
  protoOf(DomApp$buildHistoryPage$lambda$slambda$lambda$slambda).invoke_qns8j1_k$ = function (p1, $completion) {
    return this.invoke_d9fzmj_k$((!(p1 == null) ? isInterface(p1, CoroutineScope) : false) ? p1 : THROW_CCE(), $completion);
  };
  protoOf(DomApp$buildHistoryPage$lambda$slambda$lambda$slambda).doResume_5yljmg_k$ = function () {
    var suspendResult = this.get_result_iyg5d2_k$();
    $sm: do
      try {
        var tmp = this.get_state_iypx7s_k$();
        switch (tmp) {
          case 0:
            this.set_exceptionState_fex74n_k$(2);
            this.set_state_rjd8d0_k$(1);
            suspendResult = loadHistory(DomApp_getInstance(), this.$id_1, this.$timelineHost_1, this);
            if (suspendResult === get_COROUTINE_SUSPENDED()) {
              return suspendResult;
            }

            continue $sm;
          case 1:
            return Unit_getInstance();
          case 2:
            throw this.get_exception_x0n6w6_k$();
        }
      } catch ($p) {
        var e = $p;
        if (this.get_exceptionState_wflpxn_k$() === 2) {
          throw e;
        } else {
          this.set_state_rjd8d0_k$(this.get_exceptionState_wflpxn_k$());
          this.set_exception_px07aa_k$(e);
        }
      }
     while (true);
  };
  protoOf(DomApp$buildHistoryPage$lambda$slambda$lambda$slambda).create_rcuf4x_k$ = function ($this$launch, completion) {
    var i = new DomApp$buildHistoryPage$lambda$slambda$lambda$slambda(this.$id_1, this.$timelineHost_1, completion);
    i.$this$launch_1 = $this$launch;
    return i;
  };
  protoOf(DomApp$buildHistoryPage$lambda$slambda$lambda$slambda).create_wyq9v6_k$ = function (value, completion) {
    return this.create_rcuf4x_k$((!(value == null) ? isInterface(value, CoroutineScope) : false) ? value : THROW_CCE(), completion);
  };
  function DomApp$buildHistoryPage$lambda$slambda$lambda$slambda_0($id, $timelineHost, resultContinuation) {
    var i = new DomApp$buildHistoryPage$lambda$slambda$lambda$slambda($id, $timelineHost, resultContinuation);
    var l = function ($this$launch, $completion) {
      return i.invoke_d9fzmj_k$($this$launch, $completion);
    };
    l.$arity = 1;
    return l;
  }
  function DomApp$buildHistoryPage$lambda$slambda$lambda($shipmentId, $id, $shipmentInput, $timelineHost) {
    return function () {
      $shipmentId._v = $id;
      $shipmentInput.value = $id;
      var tmp = DomApp_getInstance().scope_1;
      launch(tmp, VOID, VOID, DomApp$buildHistoryPage$lambda$slambda$lambda$slambda_0($id, $timelineHost, null));
      return Unit_getInstance();
    };
  }
  function _get_scope__bi2zur_0($this) {
    return $this.scope_1;
  }
  function _set_backendInput__4tz533($this, _set____db54di) {
    $this.backendInput_1 = _set____db54di;
  }
  function _get_backendInput__aprlh1($this) {
    var tmp = $this.backendInput_1;
    if (!(tmp == null))
      return tmp;
    else {
      throwUninitializedPropertyAccessException('backendInput');
    }
  }
  function _set_refreshStatus__y8x39k($this, _set____db54di) {
    $this.refreshStatus_1 = _set____db54di;
  }
  function _get_refreshStatus__lkfg78($this) {
    var tmp = $this.refreshStatus_1;
    if (!(tmp == null))
      return tmp;
    else {
      throwUninitializedPropertyAccessException('refreshStatus');
    }
  }
  function _set_logPre__t1u4so($this, _set____db54di) {
    $this.logPre_1 = _set____db54di;
  }
  function _get_logPre__rl3k5w($this) {
    var tmp = $this.logPre_1;
    if (!(tmp == null))
      return tmp;
    else {
      throwUninitializedPropertyAccessException('logPre');
    }
  }
  function _set_pageMap__3ygkbc($this, _set____db54di) {
    $this.pageMap_1 = _set____db54di;
  }
  function _get_pageMap__lnrq1o($this) {
    var tmp = $this.pageMap_1;
    if (!(tmp == null))
      return tmp;
    else {
      throwUninitializedPropertyAccessException('pageMap');
    }
  }
  function _set_pageState__tnf8sd($this, _set____db54di) {
    $this.pageState_1 = _set____db54di;
  }
  function _get_pageState__cksdt($this) {
    var tmp = $this.pageState_1;
    if (!(tmp == null))
      return tmp;
    else {
      throwUninitializedPropertyAccessException('pageState');
    }
  }
  function _set_pageHistory__gct76o($this, _set____db54di) {
    $this.pageHistory_1 = _set____db54di;
  }
  function _get_pageHistory__odwogk($this) {
    var tmp = $this.pageHistory_1;
    if (!(tmp == null))
      return tmp;
    else {
      throwUninitializedPropertyAccessException('pageHistory');
    }
  }
  function _set_pageSettings__6hbmit($this, _set____db54di) {
    $this.pageSettings_1 = _set____db54di;
  }
  function _get_pageSettings__m12d2x($this) {
    var tmp = $this.pageSettings_1;
    if (!(tmp == null))
      return tmp;
    else {
      throwUninitializedPropertyAccessException('pageSettings');
    }
  }
  function _set_agentSettings__t2yo71($this, _set____db54di) {
    $this.agentSettings_1 = _set____db54di;
  }
  function _get_agentSettings__dv75op($this) {
    var tmp = $this.agentSettings_1;
    if (!(tmp == null))
      return tmp;
    else {
      throwUninitializedPropertyAccessException('agentSettings');
    }
  }
  function _set_mapView__7fn5h8($this, _set____db54di) {
    $this.mapView_1 = _set____db54di;
  }
  function _get_mapView__x1vfu8($this) {
    var tmp = $this.mapView_1;
    if (!(tmp == null))
      return tmp;
    else {
      throwUninitializedPropertyAccessException('mapView');
    }
  }
  function _set_stateHost__fzfh1o($this, _set____db54di) {
    $this.stateHost_1 = _set____db54di;
  }
  function _get_stateHost__pqu4iw($this) {
    var tmp = $this.stateHost_1;
    if (!(tmp == null))
      return tmp;
    else {
      throwUninitializedPropertyAccessException('stateHost');
    }
  }
  function _set_historyHost__zanz1l($this, _set____db54di) {
    $this.historyHost_1 = _set____db54di;
  }
  function _get_historyHost__5g1wln($this) {
    var tmp = $this.historyHost_1;
    if (!(tmp == null))
      return tmp;
    else {
      throwUninitializedPropertyAccessException('historyHost');
    }
  }
  function _set_historyShipmentsHost__liaimi($this, _set____db54di) {
    $this.historyShipmentsHost_1 = _set____db54di;
  }
  function _get_historyShipmentsHost__7k7um6($this) {
    return $this.historyShipmentsHost_1;
  }
  function _set_historyPackageTasksHost__psz15t($this, _set____db54di) {
    $this.historyPackageTasksHost_1 = _set____db54di;
  }
  function _get_historyPackageTasksHost__5btmwd($this) {
    return $this.historyPackageTasksHost_1;
  }
  function _set_historyStagingTasksHost__p5744q($this, _set____db54di) {
    $this.historyStagingTasksHost_1 = _set____db54di;
  }
  function _get_historyStagingTasksHost__perjky($this) {
    return $this.historyStagingTasksHost_1;
  }
  function _set_historyRebalanceTasksHost__jupnhg($this, _set____db54di) {
    $this.historyRebalanceTasksHost_1 = _set____db54di;
  }
  function _get_historyRebalanceTasksHost__hlv4j4($this) {
    return $this.historyRebalanceTasksHost_1;
  }
  function _set_historyTimelineHost__k7uyco($this, _set____db54di) {
    $this.historyTimelineHost_1 = _set____db54di;
  }
  function _get_historyTimelineHost__xil790($this) {
    return $this.historyTimelineHost_1;
  }
  function _set_historyShipmentInput__27b92z($this, _set____db54di) {
    $this.historyShipmentInput_1 = _set____db54di;
  }
  function _get_historyShipmentInput__bqrexd($this) {
    return $this.historyShipmentInput_1;
  }
  function _set_modal__hv5xko($this, _set____db54di) {
    $this.modal_1 = _set____db54di;
  }
  function _get_modal__e5yiws($this) {
    var tmp = $this.modal_1;
    if (!(tmp == null))
      return tmp;
    else {
      throwUninitializedPropertyAccessException('modal');
    }
  }
  function _set_backendUrl__k91rno($this, _set____db54di) {
    $this.backendUrl_1 = _set____db54di;
  }
  function _get_backendUrl__zbacsw_0($this) {
    return $this.backendUrl_1;
  }
  function _set_networkState__zieies($this, _set____db54di) {
    $this.networkState_1 = _set____db54di;
  }
  function _get_networkState__jyyt08($this) {
    return $this.networkState_1;
  }
  function _set_mapAddMode__msy65r($this, _set____db54di) {
    $this.mapAddMode_1 = _set____db54di;
  }
  function _get_mapAddMode__7qpl0j($this) {
    return $this.mapAddMode_1;
  }
  function _set_packageDraft__j5tms($this, _set____db54di) {
    $this.packageDraft_1 = _set____db54di;
  }
  function _get_packageDraft__f0kwxc($this) {
    return $this.packageDraft_1;
  }
  function _set_packagePickDestination__ce3pps($this, _set____db54di) {
    $this.packagePickDestination_1 = _set____db54di;
  }
  function _get_packagePickDestination__yn765g($this) {
    return $this.packagePickDestination_1;
  }
  function _get_modeButtons__78r2tp($this) {
    return $this.modeButtons_1;
  }
  function _get_navButtons__e5lxt9($this) {
    return $this.navButtons_1;
  }
  function buildMapPage($this, host) {
    var toolbar = el('div', 'map-toolbar');
    var modes = el('div', 'map-actions');
    // Inline function 'kotlin.collections.forEach' call
    var tmp0_iterator = get_entries().iterator_jk1svi_k$();
    while (tmp0_iterator.hasNext_bitz1p_k$()) {
      var element = tmp0_iterator.next_20eer_k$();
      // Inline function 'pl.edu.wat.uavlogistics.frontend.dom.DomApp.buildMapPage.<anonymous>' call
      // Inline function 'kotlin.text.replaceFirstChar' call
      // Inline function 'kotlin.text.lowercase' call
      // Inline function 'kotlin.js.asDynamic' call
      var this_0 = element.get_name_woqyms_k$().toLowerCase();
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
      DomApp_getInstance().modeButtons_1.put_4fpzoq_k$(element, btn);
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
    tmp_2.mapView_1 = new DomMapView(mapContainer, DomApp$buildMapPage$lambda_4);
    host.appendChild(mapContainer);
  }
  function buildHistoryPage($this, host) {
    var wrap = el('div');
    var shipmentId = {_v: ''};
    var tmp = document.createElement('input');
    var shipmentInput = tmp instanceof HTMLInputElement ? tmp : THROW_CCE();
    shipmentInput.placeholder = 'Shipment ID';
    shipmentInput.oninput = DomApp$buildHistoryPage$lambda(shipmentId, shipmentInput);
    $this.historyShipmentInput_1 = shipmentInput;
    wrap.appendChild(el('label', null, 'Shipment ID'));
    wrap.appendChild(shipmentInput);
    var listHost = el('div', 'list-panel');
    var timelineHost = el('div', 'timeline');
    $this.historyTimelineHost_1 = timelineHost;
    wrap.appendChild(button('Load all shipments', VOID, DomApp$buildHistoryPage$lambda_0(listHost, shipmentId, shipmentInput, timelineHost)));
    wrap.appendChild(button('Load history', 'secondary', DomApp$buildHistoryPage$lambda_1(shipmentId, timelineHost)));
    wrap.appendChild(listHost);
    wrap.appendChild(el('h3', 'state-section-title', 'Inactive shipments'));
    $this.historyShipmentsHost_1 = el('div', 'state-list');
    wrap.appendChild(ensureNotNull($this.historyShipmentsHost_1));
    wrap.appendChild(el('h3', 'state-section-title', 'Package tasks'));
    $this.historyPackageTasksHost_1 = el('div', 'state-list');
    wrap.appendChild(ensureNotNull($this.historyPackageTasksHost_1));
    wrap.appendChild(el('h3', 'state-section-title', 'Staging tasks'));
    $this.historyStagingTasksHost_1 = el('div', 'state-list');
    wrap.appendChild(ensureNotNull($this.historyStagingTasksHost_1));
    wrap.appendChild(el('h3', 'state-section-title', 'Rebalancing tasks'));
    $this.historyRebalanceTasksHost_1 = el('div', 'state-list');
    wrap.appendChild(ensureNotNull($this.historyRebalanceTasksHost_1));
    wrap.appendChild(el('h3', 'state-section-title', 'Shipment timeline'));
    wrap.appendChild(timelineHost);
    host.appendChild(wrap);
    renderHistoryArchive($this);
    return host;
  }
  function loadHistory($this, shipmentId, timelineHost, $completion) {
    var tmp = new $loadHistoryCOROUTINE$0($this, shipmentId, timelineHost, $completion);
    tmp.set_result_xj64lm_k$(Unit_getInstance());
    tmp.set_exception_px07aa_k$(null);
    return tmp.doResume_5yljmg_k$();
  }
  function onMapClick($this, coord) {
    var tmp0_elvis_lhs = $this.mapAddMode_1;
    var tmp;
    if (tmp0_elvis_lhs == null) {
      return Unit_getInstance();
    } else {
      tmp = tmp0_elvis_lhs;
    }
    var mode = tmp;
    if (mode.equals(MapAddMode_PACKAGE_getInstance())) {
      if ($this.packagePickDestination_1) {
        var tmp1_elvis_lhs = $this.packageDraft_1;
        var tmp_0;
        if (tmp1_elvis_lhs == null) {
          return Unit_getInstance();
        } else {
          tmp_0 = tmp1_elvis_lhs;
        }
        var draft = tmp_0;
        var updated = draft.copy$default_3uibqy_k$(VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, formatCoord_0(coord.get_lat_18j1l6_k$(), 5), formatCoord_0(coord.get_lon_18j19a_k$(), 5));
        $this.packageDraft_1 = updated;
        $this.packagePickDestination_1 = false;
        _get_modal__e5yiws($this).updateDraft_rglwsr_k$(updated);
        updateModeButtons($this);
        return Unit_getInstance();
      }
      var draft_0 = new RegisterOverlayState(mode, coord);
      $this.packageDraft_1 = draft_0;
      _get_mapView__x1vfu8($this).focusAfterPlacement_ofhbnl_k$(coord);
      _get_modal__e5yiws($this).show_c1m4t6_k$(draft_0);
      return Unit_getInstance();
    }
    _get_mapView__x1vfu8($this).focusAfterPlacement_ofhbnl_k$(coord);
    _get_modal__e5yiws($this).show_c1m4t6_k$(new RegisterOverlayState(mode, coord));
  }
  function updateModeButtons($this) {
    // Inline function 'kotlin.collections.forEach' call
    // Inline function 'kotlin.collections.iterator' call
    var tmp0_iterator = $this.modeButtons_1.get_entries_p20ztl_k$().iterator_jk1svi_k$();
    while (tmp0_iterator.hasNext_bitz1p_k$()) {
      var element = tmp0_iterator.next_20eer_k$();
      // Inline function 'pl.edu.wat.uavlogistics.frontend.dom.DomApp.updateModeButtons.<anonymous>' call
      // Inline function 'kotlin.collections.component1' call
      var mode = element.get_key_18j28a_k$();
      // Inline function 'kotlin.collections.component2' call
      var btn = element.get_value_j01efc_k$();
      btn.classList.toggle('active-mode', equals(DomApp_getInstance().mapAddMode_1, mode));
    }
    var hint = _get_pageMap__lnrq1o($this).querySelector('.map-hint');
    if (hint == null)
      null;
    else {
      var tmp;
      if ($this.packagePickDestination_1) {
        tmp = 'Click the map to set the package destination.';
      } else if (equals($this.mapAddMode_1, MapAddMode_PACKAGE_getInstance())) {
        tmp = 'Click the map to set the package origin (pick destination in the dialog).';
      } else if (!($this.mapAddMode_1 == null)) {
        // Inline function 'kotlin.text.lowercase' call
        // Inline function 'kotlin.js.asDynamic' call
        tmp = 'Click the map to place a ' + ensureNotNull($this.mapAddMode_1).get_name_woqyms_k$().toLowerCase() + '.';
      } else {
        tmp = 'Drag to pan \xB7 scroll to zoom (toward cursor) \xB7 hover markers for details';
      }
      hint.textContent = tmp;
    }
  }
  function showPage($this, index) {
    // Inline function 'kotlin.collections.forEachIndexed' call
    var index_0 = 0;
    var tmp0_iterator = listOf([_get_pageMap__lnrq1o($this), _get_pageState__cksdt($this), _get_pageHistory__odwogk($this), _get_pageSettings__m12d2x($this)]).iterator_jk1svi_k$();
    while (tmp0_iterator.hasNext_bitz1p_k$()) {
      var item = tmp0_iterator.next_20eer_k$();
      // Inline function 'pl.edu.wat.uavlogistics.frontend.dom.DomApp.showPage.<anonymous>' call
      var tmp1 = index_0;
      index_0 = tmp1 + 1 | 0;
      var i = checkIndexOverflow(tmp1);
      item.classList.toggle('active-page', i === index);
    }
    // Inline function 'kotlin.collections.forEachIndexed' call
    var index_1 = 0;
    var tmp0_iterator_0 = $this.navButtons_1.iterator_jk1svi_k$();
    while (tmp0_iterator_0.hasNext_bitz1p_k$()) {
      var item_0 = tmp0_iterator_0.next_20eer_k$();
      // Inline function 'pl.edu.wat.uavlogistics.frontend.dom.DomApp.showPage.<anonymous>' call
      var tmp1_0 = index_1;
      index_1 = tmp1_0 + 1 | 0;
      var i_0 = checkIndexOverflow(tmp1_0);
      item_0.classList.toggle('secondary', !(i_0 === index));
    }
    if (index === 2) {
      renderHistoryArchive($this);
    } else if (index === 3) {
      _get_agentSettings__dv75op($this).refreshFromSettings_uipw2g_k$();
    }
  }
  function tabButton($this, label, pageIndex, selected, onClick) {
    var btn = button(label, selected ? null : 'secondary', onClick);
    // Inline function 'kotlin.js.asDynamic' call
    btn.tabIndex = pageIndex;
    return btn;
  }
  function refresh($this, showInLog, $completion) {
    var tmp = new $refreshCOROUTINE$1($this, showInLog, $completion);
    tmp.set_result_xj64lm_k$(Unit_getInstance());
    tmp.set_exception_px07aa_k$(null);
    return tmp.doResume_5yljmg_k$();
  }
  function renderState($this) {
    replaceChildren(_get_stateHost__pqu4iw($this));
    var state = $this.networkState_1;
    if (state == null) {
      _get_stateHost__pqu4iw($this).appendChild(el('p', 'empty-state', 'Waiting for network state\u2026'));
      return Unit_getInstance();
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
    summary.appendChild(statCard($this, shipments.get_size_woubt6_k$().toString(), 'Active shipments'));
    summary.appendChild(statCard($this, tasks.get_size_woubt6_k$().toString(), 'Active tasks'));
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
    var tmp0_iterator = shipments.iterator_jk1svi_k$();
    while (tmp0_iterator.hasNext_bitz1p_k$()) {
      var element_1 = tmp0_iterator.next_20eer_k$();
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
    var tmp0_iterator_0 = tasks.iterator_jk1svi_k$();
    while (tmp0_iterator_0.hasNext_bitz1p_k$()) {
      var element_2 = tmp0_iterator_0.next_20eer_k$();
      // Inline function 'pl.edu.wat.uavlogistics.frontend.dom.DomApp.renderState.<anonymous>' call
      appendTaskRow(DomApp_getInstance(), taskList, element_2, allShipments);
    }
    _get_stateHost__pqu4iw($this).appendChild(taskList);
  }
  function renderHistoryArchive($this) {
    var tmp0_elvis_lhs = $this.historyShipmentsHost_1;
    var tmp;
    if (tmp0_elvis_lhs == null) {
      return Unit_getInstance();
    } else {
      tmp = tmp0_elvis_lhs;
    }
    var shipmentsHost = tmp;
    var tmp1_elvis_lhs = $this.historyPackageTasksHost_1;
    var tmp_0;
    if (tmp1_elvis_lhs == null) {
      return Unit_getInstance();
    } else {
      tmp_0 = tmp1_elvis_lhs;
    }
    var packageTasksHost = tmp_0;
    var tmp2_elvis_lhs = $this.historyStagingTasksHost_1;
    var tmp_1;
    if (tmp2_elvis_lhs == null) {
      return Unit_getInstance();
    } else {
      tmp_1 = tmp2_elvis_lhs;
    }
    var stagingTasksHost = tmp_1;
    var tmp3_elvis_lhs = $this.historyRebalanceTasksHost_1;
    var tmp_2;
    if (tmp3_elvis_lhs == null) {
      return Unit_getInstance();
    } else {
      tmp_2 = tmp3_elvis_lhs;
    }
    var rebalanceTasksHost = tmp_2;
    replaceChildren(shipmentsHost);
    replaceChildren(packageTasksHost);
    replaceChildren(stagingTasksHost);
    replaceChildren(rebalanceTasksHost);
    var state = $this.networkState_1;
    if (state == null) {
      var waiting = el('p', 'empty-state', 'Waiting for network state\u2026');
      shipmentsHost.appendChild(waiting);
      packageTasksHost.appendChild(el('p', 'empty-state', 'Waiting for network state\u2026'));
      stagingTasksHost.appendChild(el('p', 'empty-state', 'Waiting for network state\u2026'));
      rebalanceTasksHost.appendChild(el('p', 'empty-state', 'Waiting for network state\u2026'));
      return Unit_getInstance();
    }
    var allShipments = dynamicArray(state.shipments);
    var allTasks = dynamicArray(state.tasks);
    var inactiveShipmentList = inactiveShipments(allShipments);
    var inactivePackageTaskList = inactivePackageTasks(allTasks, allShipments);
    var inactiveStagingTaskList = inactiveStagingTasks(allTasks);
    var inactiveRebalanceTaskList = inactiveRebalanceTasks(allTasks);
    if (inactiveShipmentList.isEmpty_y1axqb_k$()) {
      shipmentsHost.appendChild(el('p', 'empty-state', 'No delivered or cancelled shipments.'));
    } else {
      // Inline function 'kotlin.collections.forEach' call
      var tmp0_iterator = inactiveShipmentList.iterator_jk1svi_k$();
      while (tmp0_iterator.hasNext_bitz1p_k$()) {
        var element = tmp0_iterator.next_20eer_k$();
        // Inline function 'pl.edu.wat.uavlogistics.frontend.dom.DomApp.renderHistoryArchive.<anonymous>' call
        var tmp_3 = element.id;
        var id = (!(tmp_3 == null) ? typeof tmp_3 === 'string' : false) ? tmp_3 : THROW_CCE();
        var tmp_4 = shortId(id) + ' \xB7 ' + element.status;
        var row = button(tmp_4, 'shipment-row', DomApp$renderHistoryArchive$lambda(id));
        shipmentsHost.appendChild(row);
      }
    }
    renderInactiveTaskSection($this, packageTasksHost, inactivePackageTaskList, allShipments, 'No completed or cancelled package tasks.');
    renderInactiveTaskSection($this, stagingTasksHost, inactiveStagingTaskList, allShipments, 'No completed or cancelled staging tasks.');
    renderInactiveTaskSection($this, rebalanceTasksHost, inactiveRebalanceTaskList, allShipments, 'No completed or cancelled rebalancing tasks.');
  }
  function renderInactiveTaskSection($this, host, tasks, shipments, emptyMessage) {
    if (tasks.isEmpty_y1axqb_k$()) {
      host.appendChild(el('p', 'empty-state', emptyMessage));
    } else {
      // Inline function 'kotlin.collections.forEach' call
      var tmp0_iterator = tasks.iterator_jk1svi_k$();
      while (tmp0_iterator.hasNext_bitz1p_k$()) {
        var element = tmp0_iterator.next_20eer_k$();
        // Inline function 'pl.edu.wat.uavlogistics.frontend.dom.DomApp.renderInactiveTaskSection.<anonymous>' call
        appendTaskRow(DomApp_getInstance(), host, element, shipments);
      }
    }
  }
  function appendTaskRow($this, host, task, shipments) {
    var row = el('div', 'task-row');
    var tmp = task.kind;
    var tmp0_safe_receiver = (!(tmp == null) ? typeof tmp === 'string' : false) ? tmp : null;
    var tmp_0;
    if (tmp0_safe_receiver == null) {
      tmp_0 = null;
    } else {
      // Inline function 'kotlin.text.uppercase' call
      // Inline function 'kotlin.js.asDynamic' call
      tmp_0 = tmp0_safe_receiver.toUpperCase();
    }
    var tmp1_elvis_lhs = tmp_0;
    var kind = tmp1_elvis_lhs == null ? 'PACKAGE' : tmp1_elvis_lhs;
    var tmp_1 = task.id;
    row.appendChild(el('strong', null, shortId((!(tmp_1 == null) ? typeof tmp_1 === 'string' : false) ? tmp_1 : THROW_CCE()) + ' \xB7 ' + kind + ' \xB7 ' + task.status));
    var tmp_2 = task.assignedAgentId;
    var agent = (tmp_2 == null ? true : typeof tmp_2 === 'string') ? tmp_2 : THROW_CCE();
    var tmp_3;
    switch (kind) {
      case 'STAGING':
        var tmp_4 = task.shipmentId;
        var packageShipment = shortId((!(tmp_4 == null) ? typeof tmp_4 === 'string' : false) ? tmp_4 : THROW_CCE());
        var tmp_5 = task.startStationId;
        var tmp3_elvis_lhs = (tmp_5 == null ? true : typeof tmp_5 === 'string') ? tmp_5 : THROW_CCE();
        var from = tmp3_elvis_lhs == null ? '\u2014' : tmp3_elvis_lhs;
        var tmp_6 = task.endStationId;
        var tmp4_elvis_lhs = (tmp_6 == null ? true : typeof tmp_6 === 'string') ? tmp_6 : THROW_CCE();
        var to = tmp4_elvis_lhs == null ? '\u2014' : tmp4_elvis_lhs;
        var tmp6_elvis_lhs = agent == null ? null : shortId(agent);
        tmp_3 = 'for shipment ' + packageShipment + ' \xB7 agent ' + (tmp6_elvis_lhs == null ? '\u2014' : tmp6_elvis_lhs) + ' \xB7 ' + from + ' \u2192 ' + to;
        break;
      case 'REBALANCE':
        var tmp_7 = task.startStationId;
        var tmp7_elvis_lhs = (tmp_7 == null ? true : typeof tmp_7 === 'string') ? tmp_7 : THROW_CCE();
        var from_0 = tmp7_elvis_lhs == null ? '\u2014' : tmp7_elvis_lhs;
        var tmp_8 = task.endStationId;
        var tmp8_elvis_lhs = (tmp_8 == null ? true : typeof tmp_8 === 'string') ? tmp_8 : THROW_CCE();
        var to_0 = tmp8_elvis_lhs == null ? '\u2014' : tmp8_elvis_lhs;
        var tmp10_elvis_lhs = agent == null ? null : shortId(agent);
        tmp_3 = 'agent ' + (tmp10_elvis_lhs == null ? '\u2014' : tmp10_elvis_lhs) + ' \xB7 ' + from_0 + ' \u2192 ' + to_0;
        break;
      default:
        var tmp$ret$3;
        $l$block: {
          // Inline function 'kotlin.collections.firstOrNull' call
          var indexedObject = dynamicArray(shipments);
          var inductionVariable = 0;
          var last = indexedObject.length;
          while (inductionVariable < last) {
            var element = indexedObject[inductionVariable];
            inductionVariable = inductionVariable + 1 | 0;
            // Inline function 'pl.edu.wat.uavlogistics.frontend.dom.DomApp.appendTaskRow.<anonymous>' call
            var tmp_9 = element.id;
            if (equals((!(tmp_9 == null) ? typeof tmp_9 === 'string' : false) ? tmp_9 : THROW_CCE(), task.shipmentId)) {
              tmp$ret$3 = element;
              break $l$block;
            }
          }
          tmp$ret$3 = null;
        }

        var shipment = tmp$ret$3;
        var required = shipment != null && shipment.packageSpec.requiresGroundTransport == true ? 'UGV' : 'any';
        var tmp_10 = task.shipmentId;
        var tmp_11 = shortId((!(tmp_10 == null) ? typeof tmp_10 === 'string' : false) ? tmp_10 : THROW_CCE());
        var tmp12_elvis_lhs = agent == null ? null : shortId(agent);
        tmp_3 = 'shipment ' + tmp_11 + ' \xB7 agent ' + (tmp12_elvis_lhs == null ? '\u2014' : tmp12_elvis_lhs) + ' \xB7 ' + ('requires ' + required + ' \xB7 ' + coord($this, task.startPoint) + ' \u2192 ' + coord($this, task.endPoint));
        break;
    }
    var details = tmp_3;
    row.appendChild(el('small', null, details));
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
    DomApp_getInstance().backendUrl_1 = _get_backendInput__aprlh1(DomApp_getInstance()).value;
    return null;
  }
  function DomApp$mount$lambda_0() {
    var tmp = DomApp_getInstance().scope_1;
    launch(tmp, VOID, VOID, DomApp$mount$lambda$slambda_0(null));
    return Unit_getInstance();
  }
  function DomApp$mount$lambda$slambda(resultContinuation) {
    CoroutineImpl.call(this, resultContinuation);
  }
  protoOf(DomApp$mount$lambda$slambda).invoke_d9fzmj_k$ = function ($this$launch, $completion) {
    var tmp = this.create_rcuf4x_k$($this$launch, $completion);
    tmp.set_result_xj64lm_k$(Unit_getInstance());
    tmp.set_exception_px07aa_k$(null);
    return tmp.doResume_5yljmg_k$();
  };
  protoOf(DomApp$mount$lambda$slambda).invoke_qns8j1_k$ = function (p1, $completion) {
    return this.invoke_d9fzmj_k$((!(p1 == null) ? isInterface(p1, CoroutineScope) : false) ? p1 : THROW_CCE(), $completion);
  };
  protoOf(DomApp$mount$lambda$slambda).doResume_5yljmg_k$ = function () {
    var suspendResult = this.get_result_iyg5d2_k$();
    $sm: do
      try {
        var tmp = this.get_state_iypx7s_k$();
        switch (tmp) {
          case 0:
            this.set_exceptionState_fex74n_k$(4);
            var tmp_0 = this;
            tmp_0.this0__1 = this.$this$launch_1;
            this.set_exceptionState_fex74n_k$(3);
            var tmp_1 = this;
            tmp_1.this2__1 = Companion_getInstance();
            var tmp_2 = this;
            tmp_2.$this$runCatching3__1 = this.this0__1;
            this.ARGUMENT4__1 = DomApp_getInstance();
            this.set_state_rjd8d0_k$(1);
            suspendResult = ApiClient_getInstance().request$default_u44nmf_k$(DomApp_getInstance().backendUrl_1, '/health', VOID, VOID, VOID, this);
            if (suspendResult === get_COROUTINE_SUSPENDED()) {
              return suspendResult;
            }

            continue $sm;
          case 1:
            this.ARGUMENT5__1 = suspendResult;
            setLog(this.ARGUMENT4__1, this.ARGUMENT5__1);
            this.set_state_rjd8d0_k$(2);
            suspendResult = refresh(DomApp_getInstance(), false, this);
            if (suspendResult === get_COROUTINE_SUSPENDED()) {
              return suspendResult;
            }

            continue $sm;
          case 2:
            this.TRY_RESULT1__1 = _Result___init__impl__xyqfz8(Unit_getInstance());
            this.set_exceptionState_fex74n_k$(4);
            this.set_state_rjd8d0_k$(5);
            continue $sm;
          case 3:
            this.set_exceptionState_fex74n_k$(4);
            var tmp_3 = this.get_exception_x0n6w6_k$();
            if (tmp_3 instanceof Error) {
              var e = this.get_exception_x0n6w6_k$();
              var tmp_4 = this;
              Companion_getInstance();
              tmp_4.TRY_RESULT1__1 = _Result___init__impl__xyqfz8(createFailure(e));
              this.set_state_rjd8d0_k$(5);
              continue $sm;
            } else {
              throw this.get_exception_x0n6w6_k$();
            }

          case 4:
            throw this.get_exception_x0n6w6_k$();
          case 5:
            this.set_exceptionState_fex74n_k$(4);
            var this_0 = this.TRY_RESULT1__1;
            var tmp0_safe_receiver = Result__exceptionOrNull_impl_p6xea9(this_0);
            if (tmp0_safe_receiver == null)
              null;
            else {
              setLog(DomApp_getInstance(), 'ERROR: ' + failureMessage(tmp0_safe_receiver));
            }

            return Unit_getInstance();
        }
      } catch ($p) {
        var e_0 = $p;
        if (this.get_exceptionState_wflpxn_k$() === 4) {
          throw e_0;
        } else {
          this.set_state_rjd8d0_k$(this.get_exceptionState_wflpxn_k$());
          this.set_exception_px07aa_k$(e_0);
        }
      }
     while (true);
  };
  protoOf(DomApp$mount$lambda$slambda).create_rcuf4x_k$ = function ($this$launch, completion) {
    var i = new DomApp$mount$lambda$slambda(completion);
    i.$this$launch_1 = $this$launch;
    return i;
  };
  protoOf(DomApp$mount$lambda$slambda).create_wyq9v6_k$ = function (value, completion) {
    return this.create_rcuf4x_k$((!(value == null) ? isInterface(value, CoroutineScope) : false) ? value : THROW_CCE(), completion);
  };
  function DomApp$mount$lambda$slambda_0(resultContinuation) {
    var i = new DomApp$mount$lambda$slambda(resultContinuation);
    var l = function ($this$launch, $completion) {
      return i.invoke_d9fzmj_k$($this$launch, $completion);
    };
    l.$arity = 1;
    return l;
  }
  function DomApp$mount$lambda_1() {
    var tmp = DomApp_getInstance().scope_1;
    launch(tmp, VOID, VOID, DomApp$mount$lambda$slambda_2(null));
    return Unit_getInstance();
  }
  function DomApp$mount$lambda$slambda_1(resultContinuation) {
    CoroutineImpl.call(this, resultContinuation);
  }
  protoOf(DomApp$mount$lambda$slambda_1).invoke_d9fzmj_k$ = function ($this$launch, $completion) {
    var tmp = this.create_rcuf4x_k$($this$launch, $completion);
    tmp.set_result_xj64lm_k$(Unit_getInstance());
    tmp.set_exception_px07aa_k$(null);
    return tmp.doResume_5yljmg_k$();
  };
  protoOf(DomApp$mount$lambda$slambda_1).invoke_qns8j1_k$ = function (p1, $completion) {
    return this.invoke_d9fzmj_k$((!(p1 == null) ? isInterface(p1, CoroutineScope) : false) ? p1 : THROW_CCE(), $completion);
  };
  protoOf(DomApp$mount$lambda$slambda_1).doResume_5yljmg_k$ = function () {
    var suspendResult = this.get_result_iyg5d2_k$();
    $sm: do
      try {
        var tmp = this.get_state_iypx7s_k$();
        switch (tmp) {
          case 0:
            this.set_exceptionState_fex74n_k$(3);
            var tmp_0 = this;
            tmp_0.this0__1 = this.$this$launch_1;
            this.set_exceptionState_fex74n_k$(2);
            var tmp_1 = this;
            tmp_1.this2__1 = Companion_getInstance();
            var tmp_2 = this;
            tmp_2.$this$runCatching3__1 = this.this0__1;
            this.set_state_rjd8d0_k$(1);
            suspendResult = refresh(DomApp_getInstance(), true, this);
            if (suspendResult === get_COROUTINE_SUSPENDED()) {
              return suspendResult;
            }

            continue $sm;
          case 1:
            this.TRY_RESULT1__1 = _Result___init__impl__xyqfz8(Unit_getInstance());
            this.set_exceptionState_fex74n_k$(3);
            this.set_state_rjd8d0_k$(4);
            continue $sm;
          case 2:
            this.set_exceptionState_fex74n_k$(3);
            var tmp_3 = this.get_exception_x0n6w6_k$();
            if (tmp_3 instanceof Error) {
              var e = this.get_exception_x0n6w6_k$();
              var tmp_4 = this;
              Companion_getInstance();
              tmp_4.TRY_RESULT1__1 = _Result___init__impl__xyqfz8(createFailure(e));
              this.set_state_rjd8d0_k$(4);
              continue $sm;
            } else {
              throw this.get_exception_x0n6w6_k$();
            }

          case 3:
            throw this.get_exception_x0n6w6_k$();
          case 4:
            this.set_exceptionState_fex74n_k$(3);
            var this_0 = this.TRY_RESULT1__1;
            var tmp0_safe_receiver = Result__exceptionOrNull_impl_p6xea9(this_0);
            if (tmp0_safe_receiver == null)
              null;
            else {
              setLog(DomApp_getInstance(), 'ERROR: ' + failureMessage(tmp0_safe_receiver));
            }

            return Unit_getInstance();
        }
      } catch ($p) {
        var e_0 = $p;
        if (this.get_exceptionState_wflpxn_k$() === 3) {
          throw e_0;
        } else {
          this.set_state_rjd8d0_k$(this.get_exceptionState_wflpxn_k$());
          this.set_exception_px07aa_k$(e_0);
        }
      }
     while (true);
  };
  protoOf(DomApp$mount$lambda$slambda_1).create_rcuf4x_k$ = function ($this$launch, completion) {
    var i = new DomApp$mount$lambda$slambda_1(completion);
    i.$this$launch_1 = $this$launch;
    return i;
  };
  protoOf(DomApp$mount$lambda$slambda_1).create_wyq9v6_k$ = function (value, completion) {
    return this.create_rcuf4x_k$((!(value == null) ? isInterface(value, CoroutineScope) : false) ? value : THROW_CCE(), completion);
  };
  function DomApp$mount$lambda$slambda_2(resultContinuation) {
    var i = new DomApp$mount$lambda$slambda_1(resultContinuation);
    var l = function ($this$launch, $completion) {
      return i.invoke_d9fzmj_k$($this$launch, $completion);
    };
    l.$arity = 1;
    return l;
  }
  function DomApp$mount$lambda_2() {
    showPage(DomApp_getInstance(), 0);
    return Unit_getInstance();
  }
  function DomApp$mount$lambda_3() {
    showPage(DomApp_getInstance(), 1);
    return Unit_getInstance();
  }
  function DomApp$mount$lambda_4() {
    showPage(DomApp_getInstance(), 2);
    return Unit_getInstance();
  }
  function DomApp$mount$lambda_5() {
    showPage(DomApp_getInstance(), 3);
    return Unit_getInstance();
  }
  function DomApp$mount$lambda_6() {
    return DomApp_getInstance().backendUrl_1;
  }
  function DomApp$mount$lambda_7(it) {
    setLog(DomApp_getInstance(), it);
    return Unit_getInstance();
  }
  function DomApp$mount$lambda_8() {
    var tmp = DomApp_getInstance().scope_1;
    launch(tmp, VOID, VOID, DomApp$mount$lambda$slambda_4(null));
    return Unit_getInstance();
  }
  function DomApp$mount$lambda$slambda_3(resultContinuation) {
    CoroutineImpl.call(this, resultContinuation);
  }
  protoOf(DomApp$mount$lambda$slambda_3).invoke_d9fzmj_k$ = function ($this$launch, $completion) {
    var tmp = this.create_rcuf4x_k$($this$launch, $completion);
    tmp.set_result_xj64lm_k$(Unit_getInstance());
    tmp.set_exception_px07aa_k$(null);
    return tmp.doResume_5yljmg_k$();
  };
  protoOf(DomApp$mount$lambda$slambda_3).invoke_qns8j1_k$ = function (p1, $completion) {
    return this.invoke_d9fzmj_k$((!(p1 == null) ? isInterface(p1, CoroutineScope) : false) ? p1 : THROW_CCE(), $completion);
  };
  protoOf(DomApp$mount$lambda$slambda_3).doResume_5yljmg_k$ = function () {
    var suspendResult = this.get_result_iyg5d2_k$();
    $sm: do
      try {
        var tmp = this.get_state_iypx7s_k$();
        switch (tmp) {
          case 0:
            this.set_exceptionState_fex74n_k$(2);
            this.set_state_rjd8d0_k$(1);
            suspendResult = refresh(DomApp_getInstance(), false, this);
            if (suspendResult === get_COROUTINE_SUSPENDED()) {
              return suspendResult;
            }

            continue $sm;
          case 1:
            return Unit_getInstance();
          case 2:
            throw this.get_exception_x0n6w6_k$();
        }
      } catch ($p) {
        var e = $p;
        if (this.get_exceptionState_wflpxn_k$() === 2) {
          throw e;
        } else {
          this.set_state_rjd8d0_k$(this.get_exceptionState_wflpxn_k$());
          this.set_exception_px07aa_k$(e);
        }
      }
     while (true);
  };
  protoOf(DomApp$mount$lambda$slambda_3).create_rcuf4x_k$ = function ($this$launch, completion) {
    var i = new DomApp$mount$lambda$slambda_3(completion);
    i.$this$launch_1 = $this$launch;
    return i;
  };
  protoOf(DomApp$mount$lambda$slambda_3).create_wyq9v6_k$ = function (value, completion) {
    return this.create_rcuf4x_k$((!(value == null) ? isInterface(value, CoroutineScope) : false) ? value : THROW_CCE(), completion);
  };
  function DomApp$mount$lambda$slambda_4(resultContinuation) {
    var i = new DomApp$mount$lambda$slambda_3(resultContinuation);
    var l = function ($this$launch, $completion) {
      return i.invoke_d9fzmj_k$($this$launch, $completion);
    };
    l.$arity = 1;
    return l;
  }
  function DomApp$mount$lambda_9() {
    return DomApp_getInstance().backendUrl_1;
  }
  function DomApp$mount$lambda_10() {
    DomApp_getInstance().mapAddMode_1 = null;
    DomApp_getInstance().packageDraft_1 = null;
    DomApp_getInstance().packagePickDestination_1 = false;
    updateModeButtons(DomApp_getInstance());
    _get_mapView__x1vfu8(DomApp_getInstance()).setAddMode_47v2kj_k$(null);
    return Unit_getInstance();
  }
  function DomApp$mount$lambda_11(it) {
    setLog(DomApp_getInstance(), ApiClient_getInstance().pretty_6zexfg_k$(it));
    var tmp = DomApp_getInstance().scope_1;
    launch(tmp, VOID, VOID, DomApp$mount$lambda$slambda_6(null));
    return Unit_getInstance();
  }
  function DomApp$mount$lambda$slambda_5(resultContinuation) {
    CoroutineImpl.call(this, resultContinuation);
  }
  protoOf(DomApp$mount$lambda$slambda_5).invoke_d9fzmj_k$ = function ($this$launch, $completion) {
    var tmp = this.create_rcuf4x_k$($this$launch, $completion);
    tmp.set_result_xj64lm_k$(Unit_getInstance());
    tmp.set_exception_px07aa_k$(null);
    return tmp.doResume_5yljmg_k$();
  };
  protoOf(DomApp$mount$lambda$slambda_5).invoke_qns8j1_k$ = function (p1, $completion) {
    return this.invoke_d9fzmj_k$((!(p1 == null) ? isInterface(p1, CoroutineScope) : false) ? p1 : THROW_CCE(), $completion);
  };
  protoOf(DomApp$mount$lambda$slambda_5).doResume_5yljmg_k$ = function () {
    var suspendResult = this.get_result_iyg5d2_k$();
    $sm: do
      try {
        var tmp = this.get_state_iypx7s_k$();
        switch (tmp) {
          case 0:
            this.set_exceptionState_fex74n_k$(2);
            this.set_state_rjd8d0_k$(1);
            suspendResult = refresh(DomApp_getInstance(), false, this);
            if (suspendResult === get_COROUTINE_SUSPENDED()) {
              return suspendResult;
            }

            continue $sm;
          case 1:
            return Unit_getInstance();
          case 2:
            throw this.get_exception_x0n6w6_k$();
        }
      } catch ($p) {
        var e = $p;
        if (this.get_exceptionState_wflpxn_k$() === 2) {
          throw e;
        } else {
          this.set_state_rjd8d0_k$(this.get_exceptionState_wflpxn_k$());
          this.set_exception_px07aa_k$(e);
        }
      }
     while (true);
  };
  protoOf(DomApp$mount$lambda$slambda_5).create_rcuf4x_k$ = function ($this$launch, completion) {
    var i = new DomApp$mount$lambda$slambda_5(completion);
    i.$this$launch_1 = $this$launch;
    return i;
  };
  protoOf(DomApp$mount$lambda$slambda_5).create_wyq9v6_k$ = function (value, completion) {
    return this.create_rcuf4x_k$((!(value == null) ? isInterface(value, CoroutineScope) : false) ? value : THROW_CCE(), completion);
  };
  function DomApp$mount$lambda$slambda_6(resultContinuation) {
    var i = new DomApp$mount$lambda$slambda_5(resultContinuation);
    var l = function ($this$launch, $completion) {
      return i.invoke_d9fzmj_k$($this$launch, $completion);
    };
    l.$arity = 1;
    return l;
  }
  function DomApp$mount$lambda_12(it) {
    setLog(DomApp_getInstance(), 'ERROR: ' + it);
    return Unit_getInstance();
  }
  function DomApp$mount$lambda_13(state) {
    DomApp_getInstance().packageDraft_1 = state;
    DomApp_getInstance().packagePickDestination_1 = true;
    updateModeButtons(DomApp_getInstance());
    return Unit_getInstance();
  }
  function DomApp$mount$slambda(resultContinuation) {
    CoroutineImpl.call(this, resultContinuation);
  }
  protoOf(DomApp$mount$slambda).invoke_d9fzmj_k$ = function ($this$launch, $completion) {
    var tmp = this.create_rcuf4x_k$($this$launch, $completion);
    tmp.set_result_xj64lm_k$(Unit_getInstance());
    tmp.set_exception_px07aa_k$(null);
    return tmp.doResume_5yljmg_k$();
  };
  protoOf(DomApp$mount$slambda).invoke_qns8j1_k$ = function (p1, $completion) {
    return this.invoke_d9fzmj_k$((!(p1 == null) ? isInterface(p1, CoroutineScope) : false) ? p1 : THROW_CCE(), $completion);
  };
  protoOf(DomApp$mount$slambda).doResume_5yljmg_k$ = function () {
    var suspendResult = this.get_result_iyg5d2_k$();
    $sm: do
      try {
        var tmp = this.get_state_iypx7s_k$();
        switch (tmp) {
          case 0:
            this.set_exceptionState_fex74n_k$(6);
            this.set_state_rjd8d0_k$(1);
            continue $sm;
          case 1:
            if (!true) {
              this.set_state_rjd8d0_k$(7);
              continue $sm;
            }

            var tmp_0 = this;
            tmp_0.this0__1 = this.$this$launch_1;
            this.set_exceptionState_fex74n_k$(3);
            var tmp_1 = this;
            tmp_1.this2__1 = Companion_getInstance();
            var tmp_2 = this;
            tmp_2.$this$runCatching3__1 = this.this0__1;
            this.set_state_rjd8d0_k$(2);
            suspendResult = refresh(DomApp_getInstance(), false, this);
            if (suspendResult === get_COROUTINE_SUSPENDED()) {
              return suspendResult;
            }

            continue $sm;
          case 2:
            var tmp_3 = this;
            tmp_3.value4__1 = Unit_getInstance();
            this.TRY_RESULT1__1 = _Result___init__impl__xyqfz8(this.value4__1);
            this.set_exceptionState_fex74n_k$(6);
            this.set_state_rjd8d0_k$(4);
            continue $sm;
          case 3:
            this.set_exceptionState_fex74n_k$(6);
            var tmp_4 = this.get_exception_x0n6w6_k$();
            if (tmp_4 instanceof Error) {
              this.e5__1 = this.get_exception_x0n6w6_k$();
              var tmp_5 = this;
              Companion_getInstance();
              var exception = this.e5__1;
              tmp_5.TRY_RESULT1__1 = _Result___init__impl__xyqfz8(createFailure(exception));
              this.set_state_rjd8d0_k$(4);
              continue $sm;
            } else {
              throw this.get_exception_x0n6w6_k$();
            }

          case 4:
            this.set_exceptionState_fex74n_k$(6);
            this.this6__1 = this.TRY_RESULT1__1;
            var tmp0_safe_receiver = Result__exceptionOrNull_impl_p6xea9(this.this6__1);
            if (tmp0_safe_receiver == null)
              null;
            else {
              setLog(DomApp_getInstance(), 'ERROR: ' + failureMessage(tmp0_safe_receiver));
            }

            this.set_state_rjd8d0_k$(5);
            suspendResult = delay(new Long(3000, 0), this);
            if (suspendResult === get_COROUTINE_SUSPENDED()) {
              return suspendResult;
            }

            continue $sm;
          case 5:
            this.set_state_rjd8d0_k$(1);
            continue $sm;
          case 6:
            throw this.get_exception_x0n6w6_k$();
          case 7:
            return Unit_getInstance();
        }
      } catch ($p) {
        var e = $p;
        if (this.get_exceptionState_wflpxn_k$() === 6) {
          throw e;
        } else {
          this.set_state_rjd8d0_k$(this.get_exceptionState_wflpxn_k$());
          this.set_exception_px07aa_k$(e);
        }
      }
     while (true);
  };
  protoOf(DomApp$mount$slambda).create_rcuf4x_k$ = function ($this$launch, completion) {
    var i = new DomApp$mount$slambda(completion);
    i.$this$launch_1 = $this$launch;
    return i;
  };
  protoOf(DomApp$mount$slambda).create_wyq9v6_k$ = function (value, completion) {
    return this.create_rcuf4x_k$((!(value == null) ? isInterface(value, CoroutineScope) : false) ? value : THROW_CCE(), completion);
  };
  function DomApp$mount$slambda_0(resultContinuation) {
    var i = new DomApp$mount$slambda(resultContinuation);
    var l = function ($this$launch, $completion) {
      return i.invoke_d9fzmj_k$($this$launch, $completion);
    };
    l.$arity = 1;
    return l;
  }
  function DomApp$buildMapPage$lambda($mode) {
    return function () {
      DomApp_getInstance().mapAddMode_1 = equals(DomApp_getInstance().mapAddMode_1, $mode) ? null : $mode;
      updateModeButtons(DomApp_getInstance());
      _get_mapView__x1vfu8(DomApp_getInstance()).setAddMode_47v2kj_k$(DomApp_getInstance().mapAddMode_1);
      return Unit_getInstance();
    };
  }
  function DomApp$buildMapPage$lambda_0() {
    _get_mapView__x1vfu8(DomApp_getInstance()).zoomIn_8hxnqw_k$();
    return Unit_getInstance();
  }
  function DomApp$buildMapPage$lambda_1() {
    _get_mapView__x1vfu8(DomApp_getInstance()).zoomOut_fu804r_k$();
    return Unit_getInstance();
  }
  function DomApp$buildMapPage$lambda_2() {
    _get_mapView__x1vfu8(DomApp_getInstance()).resetView_f1xryc_k$();
    return Unit_getInstance();
  }
  function DomApp$buildMapPage$lambda_3() {
    var tmp = DomApp_getInstance().scope_1;
    launch(tmp, VOID, VOID, DomApp$buildMapPage$lambda$slambda_0(null));
    return Unit_getInstance();
  }
  function DomApp$buildMapPage$lambda$slambda(resultContinuation) {
    CoroutineImpl.call(this, resultContinuation);
  }
  protoOf(DomApp$buildMapPage$lambda$slambda).invoke_d9fzmj_k$ = function ($this$launch, $completion) {
    var tmp = this.create_rcuf4x_k$($this$launch, $completion);
    tmp.set_result_xj64lm_k$(Unit_getInstance());
    tmp.set_exception_px07aa_k$(null);
    return tmp.doResume_5yljmg_k$();
  };
  protoOf(DomApp$buildMapPage$lambda$slambda).invoke_qns8j1_k$ = function (p1, $completion) {
    return this.invoke_d9fzmj_k$((!(p1 == null) ? isInterface(p1, CoroutineScope) : false) ? p1 : THROW_CCE(), $completion);
  };
  protoOf(DomApp$buildMapPage$lambda$slambda).doResume_5yljmg_k$ = function () {
    var suspendResult = this.get_result_iyg5d2_k$();
    $sm: do
      try {
        var tmp = this.get_state_iypx7s_k$();
        switch (tmp) {
          case 0:
            this.set_exceptionState_fex74n_k$(3);
            var tmp_0 = this;
            tmp_0.this0__1 = this.$this$launch_1;
            this.set_exceptionState_fex74n_k$(2);
            var tmp_1 = this;
            tmp_1.this2__1 = Companion_getInstance();
            var tmp_2 = this;
            tmp_2.$this$runCatching3__1 = this.this0__1;
            this.set_state_rjd8d0_k$(1);
            suspendResult = ApiClient_getInstance().request$default_u44nmf_k$(DomApp_getInstance().backendUrl_1, '/api/simulation/gazebo/gui', 'POST', VOID, VOID, this);
            if (suspendResult === get_COROUTINE_SUSPENDED()) {
              return suspendResult;
            }

            continue $sm;
          case 1:
            var value = suspendResult;
            this.TRY_RESULT1__1 = _Result___init__impl__xyqfz8(value);
            this.set_exceptionState_fex74n_k$(3);
            this.set_state_rjd8d0_k$(4);
            continue $sm;
          case 2:
            this.set_exceptionState_fex74n_k$(3);
            var tmp_3 = this.get_exception_x0n6w6_k$();
            if (tmp_3 instanceof Error) {
              var e = this.get_exception_x0n6w6_k$();
              var tmp_4 = this;
              Companion_getInstance();
              tmp_4.TRY_RESULT1__1 = _Result___init__impl__xyqfz8(createFailure(e));
              this.set_state_rjd8d0_k$(4);
              continue $sm;
            } else {
              throw this.get_exception_x0n6w6_k$();
            }

          case 3:
            throw this.get_exception_x0n6w6_k$();
          case 4:
            this.set_exceptionState_fex74n_k$(3);
            var this_0 = this.TRY_RESULT1__1;
            if (_Result___get_isSuccess__impl__sndoy8(this_0)) {
              var tmp_5 = _Result___get_value__impl__bjfvqg(this_0);
              var it = (tmp_5 == null ? true : !(tmp_5 == null)) ? tmp_5 : THROW_CCE();
              window.open('http://localhost:6080/vnc.html?autoconnect=true&resize=scale', '_blank');
              setLog(DomApp_getInstance(), ApiClient_getInstance().pretty_6zexfg_k$(it));
            }

            var tmp0_safe_receiver = Result__exceptionOrNull_impl_p6xea9(this_0);
            if (tmp0_safe_receiver == null)
              null;
            else {
              setLog(DomApp_getInstance(), 'ERROR: ' + failureMessage(tmp0_safe_receiver));
            }

            return Unit_getInstance();
        }
      } catch ($p) {
        var e_0 = $p;
        if (this.get_exceptionState_wflpxn_k$() === 3) {
          throw e_0;
        } else {
          this.set_state_rjd8d0_k$(this.get_exceptionState_wflpxn_k$());
          this.set_exception_px07aa_k$(e_0);
        }
      }
     while (true);
  };
  protoOf(DomApp$buildMapPage$lambda$slambda).create_rcuf4x_k$ = function ($this$launch, completion) {
    var i = new DomApp$buildMapPage$lambda$slambda(completion);
    i.$this$launch_1 = $this$launch;
    return i;
  };
  protoOf(DomApp$buildMapPage$lambda$slambda).create_wyq9v6_k$ = function (value, completion) {
    return this.create_rcuf4x_k$((!(value == null) ? isInterface(value, CoroutineScope) : false) ? value : THROW_CCE(), completion);
  };
  function DomApp$buildMapPage$lambda$slambda_0(resultContinuation) {
    var i = new DomApp$buildMapPage$lambda$slambda(resultContinuation);
    var l = function ($this$launch, $completion) {
      return i.invoke_d9fzmj_k$($this$launch, $completion);
    };
    l.$arity = 1;
    return l;
  }
  function DomApp$buildMapPage$lambda_4(coord) {
    onMapClick(DomApp_getInstance(), coord);
    return Unit_getInstance();
  }
  function DomApp$buildHistoryPage$lambda($shipmentId, $shipmentInput) {
    return function (it) {
      $shipmentId._v = $shipmentInput.value;
      return null;
    };
  }
  function DomApp$buildHistoryPage$lambda$slambda($listHost, $shipmentId, $shipmentInput, $timelineHost, resultContinuation) {
    this.$listHost_1 = $listHost;
    this.$shipmentId_1 = $shipmentId;
    this.$shipmentInput_1 = $shipmentInput;
    this.$timelineHost_1 = $timelineHost;
    CoroutineImpl.call(this, resultContinuation);
  }
  protoOf(DomApp$buildHistoryPage$lambda$slambda).invoke_d9fzmj_k$ = function ($this$launch, $completion) {
    var tmp = this.create_rcuf4x_k$($this$launch, $completion);
    tmp.set_result_xj64lm_k$(Unit_getInstance());
    tmp.set_exception_px07aa_k$(null);
    return tmp.doResume_5yljmg_k$();
  };
  protoOf(DomApp$buildHistoryPage$lambda$slambda).invoke_qns8j1_k$ = function (p1, $completion) {
    return this.invoke_d9fzmj_k$((!(p1 == null) ? isInterface(p1, CoroutineScope) : false) ? p1 : THROW_CCE(), $completion);
  };
  protoOf(DomApp$buildHistoryPage$lambda$slambda).doResume_5yljmg_k$ = function () {
    var suspendResult = this.get_result_iyg5d2_k$();
    $sm: do
      try {
        var tmp = this.get_state_iypx7s_k$();
        switch (tmp) {
          case 0:
            this.set_exceptionState_fex74n_k$(3);
            var tmp_0 = this;
            tmp_0.this0__1 = this.$this$launch_1;
            this.set_exceptionState_fex74n_k$(2);
            var tmp_1 = this;
            tmp_1.this2__1 = Companion_getInstance();
            var tmp_2 = this;
            tmp_2.$this$runCatching3__1 = this.this0__1;
            this.set_state_rjd8d0_k$(1);
            suspendResult = ApiClient_getInstance().request$default_u44nmf_k$(DomApp_getInstance().backendUrl_1, '/api/shipments', VOID, VOID, VOID, this);
            if (suspendResult === get_COROUTINE_SUSPENDED()) {
              return suspendResult;
            }

            continue $sm;
          case 1:
            var json = suspendResult;
            var shipments = customerShipments(dynamicArray(JSON.parse(json)));
            setLog(DomApp_getInstance(), ApiClient_getInstance().pretty_6zexfg_k$(json));
            replaceChildren(this.$listHost_1);
            var tmp0_iterator = shipments.iterator_jk1svi_k$();
            while (tmp0_iterator.hasNext_bitz1p_k$()) {
              var element = tmp0_iterator.next_20eer_k$();
              var tmp_3 = element.id;
              var id = (!(tmp_3 == null) ? typeof tmp_3 === 'string' : false) ? tmp_3 : THROW_CCE();
              var tmp_4 = shortId(id) + ' \xB7 ' + element.status;
              var row = button(tmp_4, 'shipment-row', DomApp$buildHistoryPage$lambda$slambda$lambda(this.$shipmentId_1, id, this.$shipmentInput_1, this.$timelineHost_1));
              this.$listHost_1.appendChild(row);
            }

            this.TRY_RESULT1__1 = _Result___init__impl__xyqfz8(Unit_getInstance());
            this.set_exceptionState_fex74n_k$(3);
            this.set_state_rjd8d0_k$(4);
            continue $sm;
          case 2:
            this.set_exceptionState_fex74n_k$(3);
            var tmp_5 = this.get_exception_x0n6w6_k$();
            if (tmp_5 instanceof Error) {
              var e = this.get_exception_x0n6w6_k$();
              var tmp_6 = this;
              Companion_getInstance();
              tmp_6.TRY_RESULT1__1 = _Result___init__impl__xyqfz8(createFailure(e));
              this.set_state_rjd8d0_k$(4);
              continue $sm;
            } else {
              throw this.get_exception_x0n6w6_k$();
            }

          case 3:
            throw this.get_exception_x0n6w6_k$();
          case 4:
            this.set_exceptionState_fex74n_k$(3);
            var this_0 = this.TRY_RESULT1__1;
            var tmp0_safe_receiver = Result__exceptionOrNull_impl_p6xea9(this_0);
            if (tmp0_safe_receiver == null)
              null;
            else {
              setLog(DomApp_getInstance(), 'ERROR: ' + failureMessage(tmp0_safe_receiver));
            }

            return Unit_getInstance();
        }
      } catch ($p) {
        var e_0 = $p;
        if (this.get_exceptionState_wflpxn_k$() === 3) {
          throw e_0;
        } else {
          this.set_state_rjd8d0_k$(this.get_exceptionState_wflpxn_k$());
          this.set_exception_px07aa_k$(e_0);
        }
      }
     while (true);
  };
  protoOf(DomApp$buildHistoryPage$lambda$slambda).create_rcuf4x_k$ = function ($this$launch, completion) {
    var i = new DomApp$buildHistoryPage$lambda$slambda(this.$listHost_1, this.$shipmentId_1, this.$shipmentInput_1, this.$timelineHost_1, completion);
    i.$this$launch_1 = $this$launch;
    return i;
  };
  protoOf(DomApp$buildHistoryPage$lambda$slambda).create_wyq9v6_k$ = function (value, completion) {
    return this.create_rcuf4x_k$((!(value == null) ? isInterface(value, CoroutineScope) : false) ? value : THROW_CCE(), completion);
  };
  function DomApp$buildHistoryPage$lambda$slambda_0($listHost, $shipmentId, $shipmentInput, $timelineHost, resultContinuation) {
    var i = new DomApp$buildHistoryPage$lambda$slambda($listHost, $shipmentId, $shipmentInput, $timelineHost, resultContinuation);
    var l = function ($this$launch, $completion) {
      return i.invoke_d9fzmj_k$($this$launch, $completion);
    };
    l.$arity = 1;
    return l;
  }
  function DomApp$buildHistoryPage$lambda_0($listHost, $shipmentId, $shipmentInput, $timelineHost) {
    return function () {
      var tmp = DomApp_getInstance().scope_1;
      launch(tmp, VOID, VOID, DomApp$buildHistoryPage$lambda$slambda_0($listHost, $shipmentId, $shipmentInput, $timelineHost, null));
      return Unit_getInstance();
    };
  }
  function DomApp$buildHistoryPage$lambda$slambda_1($shipmentId, $timelineHost, resultContinuation) {
    this.$shipmentId_1 = $shipmentId;
    this.$timelineHost_1 = $timelineHost;
    CoroutineImpl.call(this, resultContinuation);
  }
  protoOf(DomApp$buildHistoryPage$lambda$slambda_1).invoke_d9fzmj_k$ = function ($this$launch, $completion) {
    var tmp = this.create_rcuf4x_k$($this$launch, $completion);
    tmp.set_result_xj64lm_k$(Unit_getInstance());
    tmp.set_exception_px07aa_k$(null);
    return tmp.doResume_5yljmg_k$();
  };
  protoOf(DomApp$buildHistoryPage$lambda$slambda_1).invoke_qns8j1_k$ = function (p1, $completion) {
    return this.invoke_d9fzmj_k$((!(p1 == null) ? isInterface(p1, CoroutineScope) : false) ? p1 : THROW_CCE(), $completion);
  };
  protoOf(DomApp$buildHistoryPage$lambda$slambda_1).doResume_5yljmg_k$ = function () {
    var suspendResult = this.get_result_iyg5d2_k$();
    $sm: do
      try {
        var tmp = this.get_state_iypx7s_k$();
        switch (tmp) {
          case 0:
            this.set_exceptionState_fex74n_k$(2);
            this.set_state_rjd8d0_k$(1);
            suspendResult = loadHistory(DomApp_getInstance(), this.$shipmentId_1._v, this.$timelineHost_1, this);
            if (suspendResult === get_COROUTINE_SUSPENDED()) {
              return suspendResult;
            }

            continue $sm;
          case 1:
            return Unit_getInstance();
          case 2:
            throw this.get_exception_x0n6w6_k$();
        }
      } catch ($p) {
        var e = $p;
        if (this.get_exceptionState_wflpxn_k$() === 2) {
          throw e;
        } else {
          this.set_state_rjd8d0_k$(this.get_exceptionState_wflpxn_k$());
          this.set_exception_px07aa_k$(e);
        }
      }
     while (true);
  };
  protoOf(DomApp$buildHistoryPage$lambda$slambda_1).create_rcuf4x_k$ = function ($this$launch, completion) {
    var i = new DomApp$buildHistoryPage$lambda$slambda_1(this.$shipmentId_1, this.$timelineHost_1, completion);
    i.$this$launch_1 = $this$launch;
    return i;
  };
  protoOf(DomApp$buildHistoryPage$lambda$slambda_1).create_wyq9v6_k$ = function (value, completion) {
    return this.create_rcuf4x_k$((!(value == null) ? isInterface(value, CoroutineScope) : false) ? value : THROW_CCE(), completion);
  };
  function DomApp$buildHistoryPage$lambda$slambda_2($shipmentId, $timelineHost, resultContinuation) {
    var i = new DomApp$buildHistoryPage$lambda$slambda_1($shipmentId, $timelineHost, resultContinuation);
    var l = function ($this$launch, $completion) {
      return i.invoke_d9fzmj_k$($this$launch, $completion);
    };
    l.$arity = 1;
    return l;
  }
  function DomApp$buildHistoryPage$lambda_1($shipmentId, $timelineHost) {
    return function () {
      var tmp;
      if (isBlank($shipmentId._v)) {
        setLog(DomApp_getInstance(), 'Enter a shipment ID first.');
        return Unit_getInstance();
      }
      var tmp_0 = DomApp_getInstance().scope_1;
      launch(tmp_0, VOID, VOID, DomApp$buildHistoryPage$lambda$slambda_2($shipmentId, $timelineHost, null));
      return Unit_getInstance();
    };
  }
  function DomApp$renderHistoryArchive$lambda$slambda($id, $timeline, resultContinuation) {
    this.$id_1 = $id;
    this.$timeline_1 = $timeline;
    CoroutineImpl.call(this, resultContinuation);
  }
  protoOf(DomApp$renderHistoryArchive$lambda$slambda).invoke_d9fzmj_k$ = function ($this$launch, $completion) {
    var tmp = this.create_rcuf4x_k$($this$launch, $completion);
    tmp.set_result_xj64lm_k$(Unit_getInstance());
    tmp.set_exception_px07aa_k$(null);
    return tmp.doResume_5yljmg_k$();
  };
  protoOf(DomApp$renderHistoryArchive$lambda$slambda).invoke_qns8j1_k$ = function (p1, $completion) {
    return this.invoke_d9fzmj_k$((!(p1 == null) ? isInterface(p1, CoroutineScope) : false) ? p1 : THROW_CCE(), $completion);
  };
  protoOf(DomApp$renderHistoryArchive$lambda$slambda).doResume_5yljmg_k$ = function () {
    var suspendResult = this.get_result_iyg5d2_k$();
    $sm: do
      try {
        var tmp = this.get_state_iypx7s_k$();
        switch (tmp) {
          case 0:
            this.set_exceptionState_fex74n_k$(2);
            this.set_state_rjd8d0_k$(1);
            suspendResult = loadHistory(DomApp_getInstance(), this.$id_1, this.$timeline_1, this);
            if (suspendResult === get_COROUTINE_SUSPENDED()) {
              return suspendResult;
            }

            continue $sm;
          case 1:
            return Unit_getInstance();
          case 2:
            throw this.get_exception_x0n6w6_k$();
        }
      } catch ($p) {
        var e = $p;
        if (this.get_exceptionState_wflpxn_k$() === 2) {
          throw e;
        } else {
          this.set_state_rjd8d0_k$(this.get_exceptionState_wflpxn_k$());
          this.set_exception_px07aa_k$(e);
        }
      }
     while (true);
  };
  protoOf(DomApp$renderHistoryArchive$lambda$slambda).create_rcuf4x_k$ = function ($this$launch, completion) {
    var i = new DomApp$renderHistoryArchive$lambda$slambda(this.$id_1, this.$timeline_1, completion);
    i.$this$launch_1 = $this$launch;
    return i;
  };
  protoOf(DomApp$renderHistoryArchive$lambda$slambda).create_wyq9v6_k$ = function (value, completion) {
    return this.create_rcuf4x_k$((!(value == null) ? isInterface(value, CoroutineScope) : false) ? value : THROW_CCE(), completion);
  };
  function DomApp$renderHistoryArchive$lambda$slambda_0($id, $timeline, resultContinuation) {
    var i = new DomApp$renderHistoryArchive$lambda$slambda($id, $timeline, resultContinuation);
    var l = function ($this$launch, $completion) {
      return i.invoke_d9fzmj_k$($this$launch, $completion);
    };
    l.$arity = 1;
    return l;
  }
  function DomApp$renderHistoryArchive$lambda($id) {
    return function () {
      var tmp0_safe_receiver = DomApp_getInstance().historyShipmentInput_1;
      if (tmp0_safe_receiver == null)
        null;
      else {
        tmp0_safe_receiver.value = $id;
      }
      var timeline = DomApp_getInstance().historyTimelineHost_1;
      var tmp;
      if (!(timeline == null)) {
        var tmp_0 = DomApp_getInstance().scope_1;
        launch(tmp_0, VOID, VOID, DomApp$renderHistoryArchive$lambda$slambda_0($id, timeline, null));
        tmp = Unit_getInstance();
      }
      return Unit_getInstance();
    };
  }
  function $loadHistoryCOROUTINE$0(_this__u8e3s4, shipmentId, timelineHost, resultContinuation) {
    CoroutineImpl.call(this, resultContinuation);
    this._this__u8e3s4__1 = _this__u8e3s4;
    this.shipmentId_1 = shipmentId;
    this.timelineHost_1 = timelineHost;
  }
  protoOf($loadHistoryCOROUTINE$0).doResume_5yljmg_k$ = function () {
    var suspendResult = this.get_result_iyg5d2_k$();
    $sm: do
      try {
        var tmp = this.get_state_iypx7s_k$();
        switch (tmp) {
          case 0:
            this.set_exceptionState_fex74n_k$(3);
            var tmp_0 = this;
            tmp_0.this0__1 = this._this__u8e3s4__1;
            this.set_exceptionState_fex74n_k$(2);
            var tmp_1 = this;
            tmp_1.this2__1 = Companion_getInstance();
            var tmp_2 = this;
            tmp_2.$this$runCatching3__1 = this.this0__1;
            this.set_state_rjd8d0_k$(1);
            suspendResult = ApiClient_getInstance().request$default_u44nmf_k$(this.$this$runCatching3__1.backendUrl_1, '/api/shipments/' + ApiClient_getInstance().pathSegment_ut1190_k$(this.shipmentId_1) + '/history', VOID, VOID, VOID, this);
            if (suspendResult === get_COROUTINE_SUSPENDED()) {
              return suspendResult;
            }

            continue $sm;
          case 1:
            var json = suspendResult;
            var events = JSON.parse(json);
            setLog(this.$this$runCatching3__1, ApiClient_getInstance().pretty_6zexfg_k$(json));
            replaceChildren(this.timelineHost_1);
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
              this.timelineHost_1.appendChild(block);
            }

            this.TRY_RESULT1__1 = _Result___init__impl__xyqfz8(Unit_getInstance());
            this.set_exceptionState_fex74n_k$(3);
            this.set_state_rjd8d0_k$(4);
            continue $sm;
          case 2:
            this.set_exceptionState_fex74n_k$(3);
            var tmp_6 = this.get_exception_x0n6w6_k$();
            if (tmp_6 instanceof Error) {
              var e = this.get_exception_x0n6w6_k$();
              var tmp_7 = this;
              Companion_getInstance();
              tmp_7.TRY_RESULT1__1 = _Result___init__impl__xyqfz8(createFailure(e));
              this.set_state_rjd8d0_k$(4);
              continue $sm;
            } else {
              throw this.get_exception_x0n6w6_k$();
            }

          case 3:
            throw this.get_exception_x0n6w6_k$();
          case 4:
            this.set_exceptionState_fex74n_k$(3);
            var this_0 = this.TRY_RESULT1__1;
            var tmp0_safe_receiver = Result__exceptionOrNull_impl_p6xea9(this_0);
            if (tmp0_safe_receiver == null)
              null;
            else {
              setLog(DomApp_getInstance(), 'ERROR: ' + failureMessage(tmp0_safe_receiver));
            }

            return Unit_getInstance();
        }
      } catch ($p) {
        var e_0 = $p;
        if (this.get_exceptionState_wflpxn_k$() === 3) {
          throw e_0;
        } else {
          this.set_state_rjd8d0_k$(this.get_exceptionState_wflpxn_k$());
          this.set_exception_px07aa_k$(e_0);
        }
      }
     while (true);
  };
  function $refreshCOROUTINE$1(_this__u8e3s4, showInLog, resultContinuation) {
    CoroutineImpl.call(this, resultContinuation);
    this._this__u8e3s4__1 = _this__u8e3s4;
    this.showInLog_1 = showInLog;
  }
  protoOf($refreshCOROUTINE$1).doResume_5yljmg_k$ = function () {
    var suspendResult = this.get_result_iyg5d2_k$();
    $sm: do
      try {
        var tmp = this.get_state_iypx7s_k$();
        switch (tmp) {
          case 0:
            this.set_exceptionState_fex74n_k$(2);
            this.set_state_rjd8d0_k$(1);
            suspendResult = ApiClient_getInstance().request$default_u44nmf_k$(this._this__u8e3s4__1.backendUrl_1, '/api/network/state', VOID, VOID, VOID, this);
            if (suspendResult === get_COROUTINE_SUSPENDED()) {
              return suspendResult;
            }

            continue $sm;
          case 1:
            var json = suspendResult;
            this._this__u8e3s4__1.networkState_1 = parseNetworkState(json);
            AgentRangeSettings_getInstance().syncFromNetwork_3zgptl_k$(this._this__u8e3s4__1.networkState_1);
            var tmp_0 = _get_refreshStatus__lkfg78(this._this__u8e3s4__1);
            var tmp_1 = (new Date()).toLocaleTimeString();
            tmp_0.textContent = 'Updated ' + ((!(tmp_1 == null) ? typeof tmp_1 === 'string' : false) ? tmp_1 : THROW_CCE());
            if (this.showInLog_1) {
              setLog(this._this__u8e3s4__1, ApiClient_getInstance().pretty_6zexfg_k$(json));
            }

            var state = this._this__u8e3s4__1.networkState_1;
            var points = state != null ? networkToMapPoints(state) : emptyList();
            var ranges = state != null ? networkToStationRangeDiscs(state) : emptyList();
            _get_mapView__x1vfu8(this._this__u8e3s4__1).setDisplay_u6j9xy_k$(points, ranges);
            renderState(this._this__u8e3s4__1);
            renderHistoryArchive(this._this__u8e3s4__1);
            return Unit_getInstance();
          case 2:
            throw this.get_exception_x0n6w6_k$();
        }
      } catch ($p) {
        var e = $p;
        if (this.get_exceptionState_wflpxn_k$() === 2) {
          throw e;
        } else {
          this.set_state_rjd8d0_k$(this.get_exceptionState_wflpxn_k$());
          this.set_exception_px07aa_k$(e);
        }
      }
     while (true);
  };
  function DomApp() {
    DomApp_instance = this;
    this.scope_1 = CoroutineScope_0(SupervisorJob().plus_s13ygv_k$(Dispatchers_getInstance().get_Main_wo5vz6_k$()));
    this.historyShipmentsHost_1 = null;
    this.historyPackageTasksHost_1 = null;
    this.historyStagingTasksHost_1 = null;
    this.historyRebalanceTasksHost_1 = null;
    this.historyTimelineHost_1 = null;
    this.historyShipmentInput_1 = null;
    this.backendUrl_1 = 'http://localhost:8080';
    this.networkState_1 = null;
    this.mapAddMode_1 = null;
    this.packageDraft_1 = null;
    this.packagePickDestination_1 = false;
    var tmp = this;
    // Inline function 'kotlin.collections.mutableMapOf' call
    tmp.modeButtons_1 = LinkedHashMap_init_$Create$();
    var tmp_0 = this;
    // Inline function 'kotlin.collections.mutableListOf' call
    tmp_0.navButtons_1 = ArrayList_init_$Create$();
  }
  protoOf(DomApp).mount_dchvzh_k$ = function (root) {
    replaceChildren(root);
    root.appendChild(el('h1', null, 'UAV Logistics Console'));
    root.appendChild(el('p', 'subtitle', 'Open http://127.0.0.1:8081 \xB7 backend API on port 8080'));
    var toolbar = el('section', 'toolbar');
    var grow = el('div', 'toolbar-grow');
    grow.appendChild(el('label', null, 'Backend URL'));
    var tmp = this;
    var tmp_0 = document.createElement('input');
    tmp.backendInput_1 = tmp_0 instanceof HTMLInputElement ? tmp_0 : THROW_CCE();
    _get_backendInput__aprlh1(this).value = this.backendUrl_1;
    var tmp_1 = _get_backendInput__aprlh1(this);
    tmp_1.oninput = DomApp$mount$lambda;
    grow.appendChild(_get_backendInput__aprlh1(this));
    toolbar.appendChild(grow);
    toolbar.appendChild(button('Health check', VOID, DomApp$mount$lambda_0));
    toolbar.appendChild(button('Refresh now', 'secondary', DomApp$mount$lambda_1));
    this.refreshStatus_1 = el('span', 'refresh-status', '\u2014');
    toolbar.appendChild(_get_refreshStatus__lkfg78(this));
    root.appendChild(toolbar);
    var nav = el('nav', 'nav');
    this.navButtons_1.clear_j9egeb_k$();
    // Inline function 'kotlin.collections.plusAssign' call
    var this_0 = this.navButtons_1;
    var element = tabButton(this, 'Map', 0, true, DomApp$mount$lambda_2);
    this_0.add_utx5q5_k$(element);
    // Inline function 'kotlin.collections.plusAssign' call
    var this_1 = this.navButtons_1;
    var element_0 = tabButton(this, 'Network state', 1, false, DomApp$mount$lambda_3);
    this_1.add_utx5q5_k$(element_0);
    // Inline function 'kotlin.collections.plusAssign' call
    var this_2 = this.navButtons_1;
    var element_1 = tabButton(this, 'History', 2, false, DomApp$mount$lambda_4);
    this_2.add_utx5q5_k$(element_1);
    // Inline function 'kotlin.collections.plusAssign' call
    var this_3 = this.navButtons_1;
    var element_2 = tabButton(this, 'Agent settings', 3, false, DomApp$mount$lambda_5);
    this_3.add_utx5q5_k$(element_2);
    // Inline function 'kotlin.collections.forEach' call
    var tmp0_iterator = this.navButtons_1.iterator_jk1svi_k$();
    while (tmp0_iterator.hasNext_bitz1p_k$()) {
      var element_3 = tmp0_iterator.next_20eer_k$();
      // Inline function 'pl.edu.wat.uavlogistics.frontend.dom.DomApp.mount.<anonymous>' call
      nav.appendChild(element_3);
    }
    root.appendChild(nav);
    this.pageMap_1 = el('section', 'page panel active-page');
    buildMapPage(this, _get_pageMap__lnrq1o(this));
    root.appendChild(_get_pageMap__lnrq1o(this));
    this.pageState_1 = el('section', 'page panel');
    this.stateHost_1 = el('div');
    _get_pageState__cksdt(this).appendChild(_get_stateHost__pqu4iw(this));
    root.appendChild(_get_pageState__cksdt(this));
    this.pageHistory_1 = el('section', 'page panel');
    this.historyHost_1 = el('div');
    _get_pageHistory__odwogk(this).appendChild(buildHistoryPage(this, _get_historyHost__5g1wln(this)));
    root.appendChild(_get_pageHistory__odwogk(this));
    this.pageSettings_1 = el('section', 'page panel');
    var tmp_2 = this;
    var tmp_3 = DomApp$mount$lambda_6;
    var tmp_4 = DomApp$mount$lambda_7;
    tmp_2.agentSettings_1 = new DomAgentSettings(this.scope_1, tmp_3, tmp_4, DomApp$mount$lambda_8);
    _get_pageSettings__m12d2x(this).appendChild(_get_agentSettings__dv75op(this).element_ri0d8k_k$());
    root.appendChild(_get_pageSettings__m12d2x(this));
    var logPanel = el('section', 'panel output-panel');
    logPanel.appendChild(el('h3', null, 'Log'));
    this.logPre_1 = logPre();
    _get_logPre__rl3k5w(this).textContent = 'Ready.';
    logPanel.appendChild(_get_logPre__rl3k5w(this));
    root.appendChild(logPanel);
    var tmp_5 = this;
    var tmp0_scope = this.scope_1;
    var tmp_6 = DomApp$mount$lambda_9;
    var tmp_7 = DomApp$mount$lambda_10;
    var tmp_8 = DomApp$mount$lambda_11;
    var tmp_9 = DomApp$mount$lambda_12;
    tmp_5.modal_1 = new DomRegisterModal(tmp0_scope, tmp_6, tmp_7, tmp_8, tmp_9, DomApp$mount$lambda_13);
    root.appendChild(_get_modal__e5yiws(this).element_ri0d8k_k$());
    launch(this.scope_1, VOID, VOID, DomApp$mount$slambda_0(null));
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
  function get_DEFAULT_LAT() {
    return DEFAULT_LAT;
  }
  var DEFAULT_LAT;
  function get_DEFAULT_LON() {
    return DEFAULT_LON;
  }
  var DEFAULT_LON;
  function get_DEFAULT_HALF_SPAN_METERS() {
    return DEFAULT_HALF_SPAN_METERS;
  }
  var DEFAULT_HALF_SPAN_METERS;
  function get_MIN_HALF_SPAN_METERS() {
    return MIN_HALF_SPAN_METERS;
  }
  var MIN_HALF_SPAN_METERS;
  function get_VIEW_W() {
    return VIEW_W;
  }
  var VIEW_W;
  function get_VIEW_H() {
    return VIEW_H;
  }
  var VIEW_H;
  function get_PADDING() {
    return PADDING;
  }
  var PADDING;
  function get_SCREEN_GRID_SPACING() {
    return SCREEN_GRID_SPACING;
  }
  var SCREEN_GRID_SPACING;
  function get_MARKER_RADIUS() {
    return MARKER_RADIUS;
  }
  var MARKER_RADIUS;
  function get_MARKER_HIT_RADIUS() {
    return MARKER_HIT_RADIUS;
  }
  var MARKER_HIT_RADIUS;
  function _get_container__j851cg($this) {
    return $this.container_1;
  }
  function _get_onMapClick__ob5sio($this) {
    return $this.onMapClick_1;
  }
  function _get_svg__e6gxbh($this) {
    return $this.svg_1;
  }
  function _get_worldLayer__irhxtg($this) {
    return $this.worldLayer_1;
  }
  function _get_gridLayer__dpaw3e($this) {
    return $this.gridLayer_1;
  }
  function _get_rangesLayer__8v9kuu($this) {
    return $this.rangesLayer_1;
  }
  function _get_markersLayer__9ottzh($this) {
    return $this.markersLayer_1;
  }
  function _get_tooltip__iwqj5a($this) {
    return $this.tooltip_1;
  }
  function _set_points__tpdspg($this, _set____db54di) {
    $this.points_1 = _set____db54di;
  }
  function _get_points__v64dc8($this) {
    return $this.points_1;
  }
  function _set_rangeDiscs__ysg3g6($this, _set____db54di) {
    $this.rangeDiscs_1 = _set____db54di;
  }
  function _get_rangeDiscs__jq7iay($this) {
    return $this.rangeDiscs_1;
  }
  function _set_geoBounds__yo6bc1($this, _set____db54di) {
    $this.geoBounds_1 = _set____db54di;
  }
  function _get_geoBounds__5dbuxh($this) {
    return $this.geoBounds_1;
  }
  function _set_addMode__uyvkyn($this, _set____db54di) {
    $this.addMode_1 = _set____db54di;
  }
  function _get_addMode__eg06nh($this) {
    return $this.addMode_1;
  }
  function _set_panX__9s3qsc($this, _set____db54di) {
    $this.panX_1 = _set____db54di;
  }
  function _get_panX__dbvqds($this) {
    return $this.panX_1;
  }
  function _set_panY__9s3qt7($this, _set____db54di) {
    $this.panY_1 = _set____db54di;
  }
  function _get_panY__dbvqen($this) {
    return $this.panY_1;
  }
  function _set_zoom__9xuns4($this, _set____db54di) {
    $this.zoom_1 = _set____db54di;
  }
  function _get_zoom__dhmndk($this) {
    return $this.zoom_1;
  }
  function _set_dragging__wa0fvs($this, _set____db54di) {
    $this.dragging_1 = _set____db54di;
  }
  function _get_dragging__jh44f0($this) {
    return $this.dragging_1;
  }
  function _set_dragStartX__pncqsz($this, _set____db54di) {
    $this.dragStartX_1 = _set____db54di;
  }
  function _get_dragStartX__ubiq0x($this) {
    return $this.dragStartX_1;
  }
  function _set_dragStartY__pncqs4($this, _set____db54di) {
    $this.dragStartY_1 = _set____db54di;
  }
  function _get_dragStartY__ubiq1s($this) {
    return $this.dragStartY_1;
  }
  function _set_panStartX__5pqp72($this, _set____db54di) {
    $this.panStartX_1 = _set____db54di;
  }
  function _get_panStartX__nl3r7i($this) {
    return $this.panStartX_1;
  }
  function _set_panStartY__5pqp67($this, _set____db54di) {
    $this.panStartY_1 = _set____db54di;
  }
  function _get_panStartY__nl3r8d($this) {
    return $this.panStartY_1;
  }
  function _set_hoveredPoint__dn477m($this, _set____db54di) {
    $this.hoveredPoint_1 = _set____db54di;
  }
  function _get_hoveredPoint__t6uxrq($this) {
    return $this.hoveredPoint_1;
  }
  function _set_focusAfterNextDisplay__b4zcpy($this, _set____db54di) {
    $this.focusAfterNextDisplay_1 = _set____db54di;
  }
  function _get_focusAfterNextDisplay__halp5m($this) {
    return $this.focusAfterNextDisplay_1;
  }
  function zoomAt($this, screenX, screenY, factor) {
    var _destruct__k2r9zo = screenToWorld($this, screenX, screenY);
    var wx = _destruct__k2r9zo.component1_7eebsc_k$();
    var wy = _destruct__k2r9zo.component2_7eebsb_k$();
    var newZoom = coerceIn($this.zoom_1 * factor, 0.35, 12.0);
    $this.zoom_1 = newZoom;
    $this.panX_1 = screenX - wx * $this.zoom_1;
    $this.panY_1 = screenY - wy * $this.zoom_1;
    updateView($this);
  }
  function updateView($this) {
    $this.worldLayer_1.setAttribute('transform', 'translate(' + $this.panX_1 + ' ' + $this.panY_1 + ') scale(' + $this.zoom_1 + ')');
    renderGrid($this);
    renderRangeDiscs($this);
    renderMarkers($this);
    var tmp0_safe_receiver = $this.hoveredPoint_1;
    if (tmp0_safe_receiver == null)
      null;
    else {
      // Inline function 'kotlin.let' call
      // Inline function 'kotlin.contracts.contract' call
      var _destruct__k2r9zo = pointScreenPosition($this, tmp0_safe_receiver);
      var sx = _destruct__k2r9zo.component1_7eebsc_k$();
      var sy = _destruct__k2r9zo.component2_7eebsb_k$();
      showTooltip($this, tmp0_safe_receiver, sx, sy);
    }
  }
  function renderGrid($this) {
    while (!($this.gridLayer_1.firstChild == null)) {
      $this.gridLayer_1.removeChild(ensureNotNull($this.gridLayer_1.firstChild));
    }
    var bounds = $this.geoBounds_1;
    var _destruct__k2r9zo = screenToWorld($this, 0.0, 0.0);
    var wx0 = _destruct__k2r9zo.component1_7eebsc_k$();
    var wy0 = _destruct__k2r9zo.component2_7eebsb_k$();
    var _destruct__k2r9zo_0 = screenToWorld($this, 960.0, 520.0);
    var wx1 = _destruct__k2r9zo_0.component1_7eebsc_k$();
    var wy1 = _destruct__k2r9zo_0.component2_7eebsb_k$();
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
      return Unit_getInstance();
    var geoCorners = filterNotNull(listOf([worldToGeo($this, minWx, minWy, bounds), worldToGeo($this, maxWx, minWy, bounds), worldToGeo($this, minWx, maxWy, bounds), worldToGeo($this, maxWx, maxWy, bounds)]));
    if (geoCorners.isEmpty_y1axqb_k$())
      return Unit_getInstance();
    // Inline function 'kotlin.collections.minOf' call
    var iterator = geoCorners.iterator_jk1svi_k$();
    if (!iterator.hasNext_bitz1p_k$())
      throw NoSuchElementException_init_$Create$();
    // Inline function 'pl.edu.wat.uavlogistics.frontend.dom.DomMapView.renderGrid.<anonymous>' call
    var minValue = iterator.next_20eer_k$().get_lon_18j19a_k$();
    while (iterator.hasNext_bitz1p_k$()) {
      // Inline function 'pl.edu.wat.uavlogistics.frontend.dom.DomMapView.renderGrid.<anonymous>' call
      var v = iterator.next_20eer_k$().get_lon_18j19a_k$();
      // Inline function 'kotlin.comparisons.minOf' call
      var a = minValue;
      minValue = Math.min(a, v);
    }
    var visMinLon = minValue;
    // Inline function 'kotlin.collections.maxOf' call
    var iterator_0 = geoCorners.iterator_jk1svi_k$();
    if (!iterator_0.hasNext_bitz1p_k$())
      throw NoSuchElementException_init_$Create$();
    // Inline function 'pl.edu.wat.uavlogistics.frontend.dom.DomMapView.renderGrid.<anonymous>' call
    var maxValue = iterator_0.next_20eer_k$().get_lon_18j19a_k$();
    while (iterator_0.hasNext_bitz1p_k$()) {
      // Inline function 'pl.edu.wat.uavlogistics.frontend.dom.DomMapView.renderGrid.<anonymous>' call
      var v_0 = iterator_0.next_20eer_k$().get_lon_18j19a_k$();
      // Inline function 'kotlin.comparisons.maxOf' call
      var a_0 = maxValue;
      maxValue = Math.max(a_0, v_0);
    }
    var visMaxLon = maxValue;
    // Inline function 'kotlin.collections.minOf' call
    var iterator_1 = geoCorners.iterator_jk1svi_k$();
    if (!iterator_1.hasNext_bitz1p_k$())
      throw NoSuchElementException_init_$Create$();
    // Inline function 'pl.edu.wat.uavlogistics.frontend.dom.DomMapView.renderGrid.<anonymous>' call
    var minValue_0 = iterator_1.next_20eer_k$().get_lat_18j1l6_k$();
    while (iterator_1.hasNext_bitz1p_k$()) {
      // Inline function 'pl.edu.wat.uavlogistics.frontend.dom.DomMapView.renderGrid.<anonymous>' call
      var v_1 = iterator_1.next_20eer_k$().get_lat_18j1l6_k$();
      // Inline function 'kotlin.comparisons.minOf' call
      var a_1 = minValue_0;
      minValue_0 = Math.min(a_1, v_1);
    }
    var visMinLat = minValue_0;
    // Inline function 'kotlin.collections.maxOf' call
    var iterator_2 = geoCorners.iterator_jk1svi_k$();
    if (!iterator_2.hasNext_bitz1p_k$())
      throw NoSuchElementException_init_$Create$();
    // Inline function 'pl.edu.wat.uavlogistics.frontend.dom.DomMapView.renderGrid.<anonymous>' call
    var maxValue_0 = iterator_2.next_20eer_k$().get_lat_18j1l6_k$();
    while (iterator_2.hasNext_bitz1p_k$()) {
      // Inline function 'pl.edu.wat.uavlogistics.frontend.dom.DomMapView.renderGrid.<anonymous>' call
      var v_2 = iterator_2.next_20eer_k$().get_lat_18j1l6_k$();
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
      return Unit_getInstance();
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
      return Unit_getInstance();
    } else {
      tmp_2 = tmp1_elvis_lhs;
    }
    var visLatRange = tmp_2;
    var lonStep = niceGeoStep($this, 80.0 / $this.zoom_1 * visLonRange / worldW);
    var latStep = niceGeoStep($this, 80.0 / $this.zoom_1 * visLatRange / worldH);
    var lineMinWx = minWx - worldW * 0.01;
    var lineMaxWx = maxWx + worldW * 0.01;
    var lineMinWy = minWy - worldH * 0.01;
    var lineMaxWy = maxWy + worldH * 0.01;
    drawGridMeridians$default($this, visMinLon, visMaxLon, lonStep, lineMinWy, lineMaxWy, minWx, maxWx, true);
    drawGridParallels$default($this, visMinLat, visMaxLat, latStep, lineMinWx, lineMaxWx, minWy, maxWy, true);
    var minorLonStep = lonStep / 5.0;
    var minorLatStep = latStep / 5.0;
    if (minorLonStep * worldW / visLonRange * $this.zoom_1 >= 24.0) {
      drawGridMeridians($this, visMinLon, visMaxLon, minorLonStep, lineMinWy, lineMaxWy, minWx, maxWx, false, lonStep);
    }
    if (minorLatStep * worldH / visLatRange * $this.zoom_1 >= 24.0) {
      drawGridParallels($this, visMinLat, visMaxLat, minorLatStep, lineMinWx, lineMaxWx, minWy, maxWy, false, latStep);
    }
  }
  function drawGridMeridians($this, visMinLon, visMaxLon, step, lineMinWy, lineMaxWy, minWx, maxWx, major, skipMultipleOf) {
    if (step <= 0.0)
      return Unit_getInstance();
    var lon = snapDown($this, visMinLon - step, step);
    var lonEnd = visMaxLon + step;
    while (lon <= lonEnd) {
      if (skipMultipleOf == null || !isNearMultiple($this, lon, skipMultipleOf)) {
        var x = lonToViewportX($this, lon, visMinLon, visMaxLon, minWx, maxWx);
        $this.gridLayer_1.appendChild(gridLine($this, x, lineMinWy, x, lineMaxWy, major));
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
      return Unit_getInstance();
    var lat = snapDown($this, visMinLat - step, step);
    var latEnd = visMaxLat + step;
    while (lat <= latEnd) {
      if (skipMultipleOf == null || !isNearMultiple($this, lat, skipMultipleOf)) {
        var y = latToViewportY($this, lat, visMinLat, visMaxLat, minWy, maxWy);
        $this.gridLayer_1.appendChild(gridLine($this, lineMinWx, y, lineMaxWx, y, major));
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
    while (!($this.rangesLayer_1.firstChild == null)) {
      $this.rangesLayer_1.removeChild(ensureNotNull($this.rangesLayer_1.firstChild));
    }
    // Inline function 'kotlin.collections.forEach' call
    var tmp0_iterator = listOf([MapRangePurpose_INTER_STATION_getInstance(), MapRangePurpose_PACKAGE_PICKUP_getInstance()]).iterator_jk1svi_k$();
    while (tmp0_iterator.hasNext_bitz1p_k$()) {
      var element = tmp0_iterator.next_20eer_k$();
      // Inline function 'pl.edu.wat.uavlogistics.frontend.dom.DomMapView.renderRangeDiscs.<anonymous>' call
      // Inline function 'kotlin.collections.forEach' call
      var tmp0_iterator_0 = get_MAP_RANGE_VEHICLE_TYPES().iterator_jk1svi_k$();
      while (tmp0_iterator_0.hasNext_bitz1p_k$()) {
        var element_0 = tmp0_iterator_0.next_20eer_k$();
        // Inline function 'pl.edu.wat.uavlogistics.frontend.dom.DomMapView.renderRangeDiscs.<anonymous>.<anonymous>' call
        // Inline function 'kotlin.collections.filter' call
        // Inline function 'kotlin.collections.filterTo' call
        var this_0 = $this.rangeDiscs_1;
        var destination = ArrayList_init_$Create$();
        var tmp0_iterator_1 = this_0.iterator_jk1svi_k$();
        while (tmp0_iterator_1.hasNext_bitz1p_k$()) {
          var element_1 = tmp0_iterator_1.next_20eer_k$();
          // Inline function 'pl.edu.wat.uavlogistics.frontend.dom.DomMapView.renderRangeDiscs.<anonymous>.<anonymous>.<anonymous>' call
          if (equals_0(element_1.get_vehicleType_he01el_k$(), element_0, true) && element_1.get_purpose_2dpcy3_k$().equals(element)) {
            destination.add_utx5q5_k$(element_1);
          }
        }
        var typeDiscs = destination;
        var style = vehicleRangeStyle($this, element_0, element);
        var strokeWidth = coerceIn(1.5 / $this.zoom_1, 0.75, 2.5);
        var tmp;
        if (element.equals(MapRangePurpose_INTER_STATION_getInstance())) {
          // Inline function 'kotlin.collections.map' call
          // Inline function 'kotlin.collections.mapTo' call
          var destination_0 = ArrayList_init_$Create$_0(collectionSizeOrDefault(typeDiscs, 10));
          var tmp0_iterator_2 = typeDiscs.iterator_jk1svi_k$();
          while (tmp0_iterator_2.hasNext_bitz1p_k$()) {
            var item = tmp0_iterator_2.next_20eer_k$();
            // Inline function 'pl.edu.wat.uavlogistics.frontend.dom.DomMapView.renderRangeDiscs.<anonymous>.<anonymous>.<anonymous>' call
            var tmp$ret$3 = listOf_0(item);
            destination_0.add_utx5q5_k$(tmp$ret$3);
          }
          tmp = destination_0;
        } else {
          tmp = clusterOverlappingRangeDiscs(typeDiscs);
        }
        var renderClusters = tmp;
        // Inline function 'kotlin.collections.forEach' call
        var tmp0_iterator_3 = renderClusters.iterator_jk1svi_k$();
        while (tmp0_iterator_3.hasNext_bitz1p_k$()) {
          var element_2 = tmp0_iterator_3.next_20eer_k$();
          $l$block_0: {
            // Inline function 'pl.edu.wat.uavlogistics.frontend.dom.DomMapView.renderRangeDiscs.<anonymous>.<anonymous>.<anonymous>' call
            // Inline function 'kotlin.text.buildString' call
            // Inline function 'kotlin.contracts.contract' call
            // Inline function 'kotlin.apply' call
            var this_1 = StringBuilder_init_$Create$();
            // Inline function 'kotlin.contracts.contract' call
            // Inline function 'pl.edu.wat.uavlogistics.frontend.dom.DomMapView.renderRangeDiscs.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
            // Inline function 'kotlin.collections.forEach' call
            var tmp0_iterator_4 = element_2.iterator_jk1svi_k$();
            while (tmp0_iterator_4.hasNext_bitz1p_k$()) {
              var element_3 = tmp0_iterator_4.next_20eer_k$();
              $l$block: {
                // Inline function 'pl.edu.wat.uavlogistics.frontend.dom.DomMapView.renderRangeDiscs.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>' call
                var _destruct__k2r9zo = project($this, element_3.get_lat_18j1l6_k$(), element_3.get_lon_18j19a_k$(), $this.geoBounds_1);
                var wx = _destruct__k2r9zo.component1_7eebsc_k$();
                var wy = _destruct__k2r9zo.component2_7eebsb_k$();
                var radiusWorld = rangeWorldRadius($this, element_3);
                if (!isFinite(radiusWorld) || radiusWorld <= 0.0) {
                  break $l$block;
                }
                this_1.append_22ad7x_k$(circleWorldPath(wx, wy, radiusWorld));
              }
            }
            var pathData = this_1.toString();
            if (isBlank(pathData)) {
              break $l$block_0;
            }
            var tmp_0 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            var shape = tmp_0 instanceof SVGPathElement ? tmp_0 : THROW_CCE();
            // Inline function 'kotlin.text.trim' call
            var tmp$ret$10 = toString(trim(isCharSequence(pathData) ? pathData : THROW_CCE()));
            shape.setAttribute('d', tmp$ret$10);
            shape.setAttribute('fill', style.fill_1);
            shape.setAttribute('fill-rule', 'nonzero');
            shape.setAttribute('stroke', style.stroke_1);
            shape.setAttribute('stroke-width', strokeWidth.toString());
            if (element.equals(MapRangePurpose_INTER_STATION_getInstance())) {
              var dash = coerceIn(8.0 / $this.zoom_1, 4.0, 14.0);
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
            var tmp$ret$12 = element.get_name_woqyms_k$().toLowerCase();
            this_2.append_22ad7x_k$('map-range-' + tmp$ret$12);
            if (element_2.get_size_woubt6_k$() > 1) {
              this_2.append_22ad7x_k$(' map-range-merged');
            }
            var shapeClass = this_2.toString();
            shape.setAttribute('class', shapeClass);
            if (element_2.get_size_woubt6_k$() > 1) {
              shape.setAttribute('stroke-linejoin', 'round');
            }
            $this.rangesLayer_1.appendChild(shape);
          }
        }
      }
    }
  }
  function renderMarkers($this) {
    while (!($this.markersLayer_1.firstChild == null)) {
      $this.markersLayer_1.removeChild(ensureNotNull($this.markersLayer_1.firstChild));
    }
    var markerRadius = 10.0 / $this.zoom_1;
    var hitRadius = 14.0 / $this.zoom_1;
    // Inline function 'kotlin.collections.forEach' call
    var tmp0_iterator = $this.points_1.iterator_jk1svi_k$();
    while (tmp0_iterator.hasNext_bitz1p_k$()) {
      var element = tmp0_iterator.next_20eer_k$();
      // Inline function 'pl.edu.wat.uavlogistics.frontend.dom.DomMapView.renderMarkers.<anonymous>' call
      var _destruct__k2r9zo = project($this, element.get_lat_18j1l6_k$(), element.get_lon_18j19a_k$(), $this.geoBounds_1);
      var wx = _destruct__k2r9zo.component1_7eebsc_k$();
      var wy = _destruct__k2r9zo.component2_7eebsb_k$();
      var tmp;
      switch (element.get_kind_wop7ml_k$().get_ordinal_ip24qg_k$()) {
        case 0:
          tmp = '#34d399';
          break;
        case 1:
          tmp = agentMarkerColor($this, element.get_agentType_jm8bey_k$());
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
      var dot = circle($this, wx, wy, markerRadius, color, coerceIn(2.0 / $this.zoom_1, 0.75, 3.0).toString());
      group.appendChild(hit);
      group.appendChild(dot);
      $this.markersLayer_1.appendChild(group);
    }
  }
  function updateHover($this, screenX, screenY) {
    var tmp$ret$0;
    $l$block_0: {
      // Inline function 'kotlin.collections.minByOrNull' call
      var iterator = $this.points_1.iterator_jk1svi_k$();
      if (!iterator.hasNext_bitz1p_k$()) {
        tmp$ret$0 = null;
        break $l$block_0;
      }
      var minElem = iterator.next_20eer_k$();
      if (!iterator.hasNext_bitz1p_k$()) {
        tmp$ret$0 = minElem;
        break $l$block_0;
      }
      // Inline function 'pl.edu.wat.uavlogistics.frontend.dom.DomMapView.updateHover.<anonymous>' call
      var point = minElem;
      var _destruct__k2r9zo = pointScreenPosition($this, point);
      var px = _destruct__k2r9zo.component1_7eebsc_k$();
      var py = _destruct__k2r9zo.component2_7eebsb_k$();
      // Inline function 'kotlin.math.hypot' call
      var x = px - screenX;
      var y = py - screenY;
      var minValue = hypot(x, y);
      do {
        var e = iterator.next_20eer_k$();
        // Inline function 'pl.edu.wat.uavlogistics.frontend.dom.DomMapView.updateHover.<anonymous>' call
        var _destruct__k2r9zo_0 = pointScreenPosition($this, e);
        var px_0 = _destruct__k2r9zo_0.component1_7eebsc_k$();
        var py_0 = _destruct__k2r9zo_0.component2_7eebsb_k$();
        // Inline function 'kotlin.math.hypot' call
        var x_0 = px_0 - screenX;
        var y_0 = py_0 - screenY;
        var v = hypot(x_0, y_0);
        if (compareTo(minValue, v) > 0) {
          minElem = e;
          minValue = v;
        }
      }
       while (iterator.hasNext_bitz1p_k$());
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
      var px_1 = _destruct__k2r9zo_1.component1_7eebsc_k$();
      var py_1 = _destruct__k2r9zo_1.component2_7eebsb_k$();
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
    var tmp_1 = hit == null ? null : hit.get_id_kntnx8_k$();
    var tmp2_safe_receiver = $this.hoveredPoint_1;
    if (!(tmp_1 == (tmp2_safe_receiver == null ? null : tmp2_safe_receiver.get_id_kntnx8_k$()))) {
      $this.hoveredPoint_1 = hit;
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
    $this.tooltip_1.classList.remove('hidden');
    clearChildren($this.tooltip_1);
    var tmp;
    switch (point.get_kind_wop7ml_k$().get_ordinal_ip24qg_k$()) {
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
    $this.tooltip_1.appendChild(el('strong', 'map-tooltip-title', kind + ' \xB7 ' + point.get_label_iuj8p7_k$()));
    // Inline function 'kotlin.collections.forEach' call
    var tmp0_iterator = split(point.get_details_r0zbrt_k$(), ['\n']).iterator_jk1svi_k$();
    while (tmp0_iterator.hasNext_bitz1p_k$()) {
      var element = tmp0_iterator.next_20eer_k$();
      // Inline function 'pl.edu.wat.uavlogistics.frontend.dom.DomMapView.showTooltip.<anonymous>' call
      // Inline function 'kotlin.text.isNotBlank' call
      if (!isBlank(element)) {
        $this.tooltip_1.appendChild(el('div', 'map-tooltip-line', element));
      }
    }
    moveTooltip($this, screenX, screenY);
  }
  function moveTooltip($this, screenX, screenY) {
    var rect = $this.container_1.getBoundingClientRect();
    var scaleX = rect.width / 960.0;
    var scaleY = rect.height / 520.0;
    var left = screenX * scaleX + 14.0;
    var top = screenY * scaleY - 12.0;
    // Inline function 'kotlin.js.asDynamic' call
    $this.tooltip_1.style.left = '' + left + 'px';
    // Inline function 'kotlin.js.asDynamic' call
    $this.tooltip_1.style.top = '' + top + 'px';
  }
  function hideTooltip($this) {
    $this.tooltip_1.classList.add('hidden');
    $this.hoveredPoint_1 = null;
  }
  function pointScreenPosition($this, point) {
    var _destruct__k2r9zo = project($this, point.get_lat_18j1l6_k$(), point.get_lon_18j19a_k$(), $this.geoBounds_1);
    var wx = _destruct__k2r9zo.component1_7eebsc_k$();
    var wy = _destruct__k2r9zo.component2_7eebsb_k$();
    return worldToScreen($this, wx, wy);
  }
  function rangeWorldRadius($this, disc) {
    var scale = $this.geoBounds_1.get_metersPerUnit_nzl5f2_k$();
    if (!isFinite(scale) || scale <= 0.0)
      return 0.0;
    return disc.get_radiusMeters_5psdiz_k$() * scale;
  }
  function VehicleRangeStyle(fill, stroke) {
    this.fill_1 = fill;
    this.stroke_1 = stroke;
  }
  protoOf(VehicleRangeStyle).get_fill_wom0ng_k$ = function () {
    return this.fill_1;
  };
  protoOf(VehicleRangeStyle).get_stroke_jnpx6p_k$ = function () {
    return this.stroke_1;
  };
  protoOf(VehicleRangeStyle).component1_7eebsc_k$ = function () {
    return this.fill_1;
  };
  protoOf(VehicleRangeStyle).component2_7eebsb_k$ = function () {
    return this.stroke_1;
  };
  protoOf(VehicleRangeStyle).copy_plwnsl_k$ = function (fill, stroke) {
    return new VehicleRangeStyle(fill, stroke);
  };
  protoOf(VehicleRangeStyle).copy$default_1joont_k$ = function (fill, stroke, $super) {
    fill = fill === VOID ? this.fill_1 : fill;
    stroke = stroke === VOID ? this.stroke_1 : stroke;
    return $super === VOID ? this.copy_plwnsl_k$(fill, stroke) : $super.copy_plwnsl_k$.call(this, fill, stroke);
  };
  protoOf(VehicleRangeStyle).toString = function () {
    return 'VehicleRangeStyle(fill=' + this.fill_1 + ', stroke=' + this.stroke_1 + ')';
  };
  protoOf(VehicleRangeStyle).hashCode = function () {
    var result = getStringHashCode(this.fill_1);
    result = imul(result, 31) + getStringHashCode(this.stroke_1) | 0;
    return result;
  };
  protoOf(VehicleRangeStyle).equals = function (other) {
    if (this === other)
      return true;
    if (!(other instanceof VehicleRangeStyle))
      return false;
    var tmp0_other_with_cast = other instanceof VehicleRangeStyle ? other : THROW_CCE();
    if (!(this.fill_1 === tmp0_other_with_cast.fill_1))
      return false;
    if (!(this.stroke_1 === tmp0_other_with_cast.stroke_1))
      return false;
    return true;
  };
  function vehicleRangeStyle($this, vehicleType, purpose) {
    // Inline function 'kotlin.text.uppercase' call
    // Inline function 'kotlin.js.asDynamic' call
    var tmp;
    if (vehicleType.toUpperCase() === 'UGV') {
      var tmp_0;
      switch (purpose.get_ordinal_ip24qg_k$()) {
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
      switch (purpose.get_ordinal_ip24qg_k$()) {
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
    var _destruct__k2r9zo = project($this, lat, lon, $this.geoBounds_1);
    var wx = _destruct__k2r9zo.component1_7eebsc_k$();
    var wy = _destruct__k2r9zo.component2_7eebsb_k$();
    $this.panX_1 = 960.0 / 2.0 - wx * $this.zoom_1;
    $this.panY_1 = 520.0 / 2.0 - wy * $this.zoom_1;
  }
  function worldToScreen($this, wx, wy) {
    return to($this.panX_1 + wx * $this.zoom_1, $this.panY_1 + wy * $this.zoom_1);
  }
  function screenToWorld($this, sx, sy) {
    return to((sx - $this.panX_1) / $this.zoom_1, (sy - $this.panY_1) / $this.zoom_1);
  }
  function geoAt($this, clientX, clientY) {
    var _destruct__k2r9zo = clientToViewBox($this, clientX, clientY);
    var viewX = _destruct__k2r9zo.component1_7eebsc_k$();
    var viewY = _destruct__k2r9zo.component2_7eebsb_k$();
    var _destruct__k2r9zo_0 = screenToWorld($this, viewX, viewY);
    var wx = _destruct__k2r9zo_0.component1_7eebsc_k$();
    var wy = _destruct__k2r9zo_0.component2_7eebsb_k$();
    return worldToGeo($this, wx, wy, $this.geoBounds_1);
  }
  function clientToViewBox($this, clientX, clientY) {
    var point = $this.svg_1.createSVGPoint();
    point.x = clientX;
    point.y = clientY;
    var tmp0_safe_receiver = $this.svg_1.getScreenCTM();
    var inverse = tmp0_safe_receiver == null ? null : tmp0_safe_receiver.inverse();
    if (!(inverse == null)) {
      var local = point.matrixTransform(inverse);
      return to(local.x, local.y);
    }
    return to(svgOffsetX($this, clientX), svgOffsetY($this, clientY));
  }
  function worldToGeo($this, wx, wy, bounds) {
    var scale = bounds.get_metersPerUnit_nzl5f2_k$();
    if (!isFinite(scale) || scale <= 0.0)
      return null;
    var east = (wx - bounds.get_centerWorldX_5jvnyc_k$()) / scale;
    var north = (bounds.get_centerWorldY_5jvnyd_k$() - wy) / scale;
    return geoFromLocalMeters(east, north, bounds.get_refLat_iy6zv9_k$(), bounds.get_refLon_iy7075_k$());
  }
  function svgOffsetX($this, clientX) {
    var rect = $this.svg_1.getBoundingClientRect();
    return (clientX - rect.left) * (960.0 / rect.width);
  }
  function svgOffsetY($this, clientY) {
    var rect = $this.svg_1.getBoundingClientRect();
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
    line.setAttribute('stroke-width', coerceIn(width / $this.zoom_1, 0.35, 2.0).toString());
    return line;
  }
  function defaultBounds($this, points) {
    return computeBounds($this, points);
  }
  function computeBounds($this, points) {
    if (points.isEmpty_y1axqb_k$()) {
      return boundsFromHalfSpans($this, 47.397971, 8.546164, 400.0, 400.0);
    }
    // Inline function 'kotlin.collections.map' call
    // Inline function 'kotlin.collections.mapTo' call
    var destination = ArrayList_init_$Create$_0(collectionSizeOrDefault(points, 10));
    var tmp0_iterator = points.iterator_jk1svi_k$();
    while (tmp0_iterator.hasNext_bitz1p_k$()) {
      var item = tmp0_iterator.next_20eer_k$();
      // Inline function 'pl.edu.wat.uavlogistics.frontend.dom.DomMapView.computeBounds.<anonymous>' call
      var tmp$ret$0 = item.get_lat_18j1l6_k$();
      destination.add_utx5q5_k$(tmp$ret$0);
    }
    var refLat = average(destination);
    // Inline function 'kotlin.collections.map' call
    // Inline function 'kotlin.collections.mapTo' call
    var destination_0 = ArrayList_init_$Create$_0(collectionSizeOrDefault(points, 10));
    var tmp0_iterator_0 = points.iterator_jk1svi_k$();
    while (tmp0_iterator_0.hasNext_bitz1p_k$()) {
      var item_0 = tmp0_iterator_0.next_20eer_k$();
      // Inline function 'pl.edu.wat.uavlogistics.frontend.dom.DomMapView.computeBounds.<anonymous>' call
      var tmp$ret$3 = item_0.get_lon_18j19a_k$();
      destination_0.add_utx5q5_k$(tmp$ret$3);
    }
    var refLon = average(destination_0);
    // Inline function 'kotlin.collections.map' call
    // Inline function 'kotlin.collections.mapTo' call
    var destination_1 = ArrayList_init_$Create$_0(collectionSizeOrDefault(points, 10));
    var tmp0_iterator_1 = points.iterator_jk1svi_k$();
    while (tmp0_iterator_1.hasNext_bitz1p_k$()) {
      var item_1 = tmp0_iterator_1.next_20eer_k$();
      // Inline function 'pl.edu.wat.uavlogistics.frontend.dom.DomMapView.computeBounds.<anonymous>' call
      var tmp$ret$6 = geoEastMeters(item_1.get_lon_18j19a_k$(), refLon, refLat);
      destination_1.add_utx5q5_k$(tmp$ret$6);
    }
    var eastOffsets = destination_1;
    // Inline function 'kotlin.collections.map' call
    // Inline function 'kotlin.collections.mapTo' call
    var destination_2 = ArrayList_init_$Create$_0(collectionSizeOrDefault(points, 10));
    var tmp0_iterator_2 = points.iterator_jk1svi_k$();
    while (tmp0_iterator_2.hasNext_bitz1p_k$()) {
      var item_2 = tmp0_iterator_2.next_20eer_k$();
      // Inline function 'pl.edu.wat.uavlogistics.frontend.dom.DomMapView.computeBounds.<anonymous>' call
      var tmp$ret$9 = geoNorthMeters(item_2.get_lat_18j1l6_k$(), refLat);
      destination_2.add_utx5q5_k$(tmp$ret$9);
    }
    var northOffsets = destination_2;
    // Inline function 'kotlin.math.max' call
    // Inline function 'kotlin.math.abs' call
    var tmp0_elvis_lhs = minOrNull(eastOffsets);
    var x = tmp0_elvis_lhs == null ? 0.0 : tmp0_elvis_lhs;
    var a = Math.abs(x);
    // Inline function 'kotlin.math.abs' call
    var tmp1_elvis_lhs = maxOrNull(eastOffsets);
    var x_0 = tmp1_elvis_lhs == null ? 0.0 : tmp1_elvis_lhs;
    var b = Math.abs(x_0);
    var eastExtent = Math.max(a, b);
    // Inline function 'kotlin.math.max' call
    // Inline function 'kotlin.math.abs' call
    var tmp2_elvis_lhs = minOrNull(northOffsets);
    var x_1 = tmp2_elvis_lhs == null ? 0.0 : tmp2_elvis_lhs;
    var a_0 = Math.abs(x_1);
    // Inline function 'kotlin.math.abs' call
    var tmp3_elvis_lhs = maxOrNull(northOffsets);
    var x_2 = tmp3_elvis_lhs == null ? 0.0 : tmp3_elvis_lhs;
    var b_0 = Math.abs(x_2);
    var northExtent = Math.max(a_0, b_0);
    // Inline function 'kotlin.math.max' call
    var a_1 = eastExtent * 1.15;
    var paddedEast = Math.max(a_1, 150.0);
    // Inline function 'kotlin.math.max' call
    var a_2 = northExtent * 1.15;
    var paddedNorth = Math.max(a_2, 150.0);
    return boundsFromHalfSpans($this, refLat, refLon, paddedEast, paddedNorth);
  }
  function boundsFromHalfSpans($this, refLat, refLon, halfSpanEastMeters, halfSpanNorthMeters) {
    var innerW = 960.0 - 48.0 * 2;
    var innerH = 520.0 - 48.0 * 2;
    var halfEast = coerceAtLeast(halfSpanEastMeters, 150.0);
    var halfNorth = coerceAtLeast(halfSpanNorthMeters, 150.0);
    // Inline function 'kotlin.math.min' call
    var a = innerW / (2.0 * halfEast);
    var b = innerH / (2.0 * halfNorth);
    var metersPerUnit = Math.min(a, b);
    return new MapBounds(refLat, refLon, halfEast, halfNorth, metersPerUnit, 960.0, 520.0, 48.0);
  }
  function project($this, lat, lon, bounds) {
    var east = geoEastMeters(lon, bounds.get_refLon_iy7075_k$(), bounds.get_refLat_iy6zv9_k$());
    var north = geoNorthMeters(lat, bounds.get_refLat_iy6zv9_k$());
    var x = bounds.get_centerWorldX_5jvnyc_k$() + east * bounds.get_metersPerUnit_nzl5f2_k$();
    var y = bounds.get_centerWorldY_5jvnyd_k$() - north * bounds.get_metersPerUnit_nzl5f2_k$();
    return to(x, y);
  }
  function DomMapView$lambda(this$0) {
    return function (event) {
      var tmp;
      if (this$0.addMode_1 == null) {
        this$0.dragging_1 = true;
        this$0.container_1.classList.add('map-dragging');
        hideTooltip(this$0);
        this$0.dragStartX_1 = event.clientX;
        this$0.dragStartY_1 = event.clientY;
        this$0.panStartX_1 = this$0.panX_1;
        this$0.panStartY_1 = this$0.panY_1;
        tmp = Unit_getInstance();
      }
      return null;
    };
  }
  function DomMapView$lambda_0(this$0) {
    return function (event) {
      var _destruct__k2r9zo = clientToViewBox(this$0, event.clientX, event.clientY);
      var sx = _destruct__k2r9zo.component1_7eebsc_k$();
      var sy = _destruct__k2r9zo.component2_7eebsb_k$();
      var tmp;
      if (this$0.dragging_1) {
        this$0.panX_1 = this$0.panStartX_1 + (event.clientX - this$0.dragStartX_1);
        this$0.panY_1 = this$0.panStartY_1 + (event.clientY - this$0.dragStartY_1);
        updateView(this$0);
        tmp = Unit_getInstance();
      } else {
        updateHover(this$0, sx, sy);
        tmp = Unit_getInstance();
      }
      return null;
    };
  }
  function DomMapView$lambda_1(this$0) {
    return function (it) {
      this$0.dragging_1 = false;
      this$0.container_1.classList.remove('map-dragging');
      return null;
    };
  }
  function DomMapView$lambda_2(this$0) {
    return function (it) {
      this$0.dragging_1 = false;
      this$0.container_1.classList.remove('map-dragging');
      hideTooltip(this$0);
      return null;
    };
  }
  function DomMapView$lambda_3(this$0) {
    return function (event) {
      event.preventDefault();
      var _destruct__k2r9zo = clientToViewBox(this$0, event.clientX, event.clientY);
      var sx = _destruct__k2r9zo.component1_7eebsc_k$();
      var sy = _destruct__k2r9zo.component2_7eebsb_k$();
      var factor = event.deltaY < 0 ? 1.12 : 1.0 / 1.12;
      zoomAt(this$0, sx, sy, factor);
      return null;
    };
  }
  function DomMapView$lambda_4(this$0) {
    return function (event) {
      var tmp;
      if (!(this$0.addMode_1 == null)) {
        var tmp0_safe_receiver = geoAt(this$0, event.clientX, event.clientY);
        if (tmp0_safe_receiver == null)
          null;
        else {
          // Inline function 'kotlin.let' call
          // Inline function 'kotlin.contracts.contract' call
          this$0.onMapClick_1(tmp0_safe_receiver);
        }
        tmp = Unit_getInstance();
      }
      return null;
    };
  }
  function DomMapView(container, onMapClick) {
    this.container_1 = container;
    this.onMapClick_1 = onMapClick;
    var tmp = this;
    var tmp_0 = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    tmp.svg_1 = tmp_0 instanceof SVGSVGElement ? tmp_0 : THROW_CCE();
    var tmp_1 = this;
    var tmp_2 = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    tmp_1.worldLayer_1 = tmp_2 instanceof SVGGElement ? tmp_2 : THROW_CCE();
    var tmp_3 = this;
    var tmp_4 = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    tmp_3.gridLayer_1 = tmp_4 instanceof SVGGElement ? tmp_4 : THROW_CCE();
    var tmp_5 = this;
    var tmp_6 = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    tmp_5.rangesLayer_1 = tmp_6 instanceof SVGGElement ? tmp_6 : THROW_CCE();
    var tmp_7 = this;
    var tmp_8 = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    tmp_7.markersLayer_1 = tmp_8 instanceof SVGGElement ? tmp_8 : THROW_CCE();
    this.tooltip_1 = el('div', 'map-tooltip hidden');
    this.points_1 = emptyList();
    this.rangeDiscs_1 = emptyList();
    this.geoBounds_1 = defaultBounds(this, emptyList());
    this.addMode_1 = null;
    this.panX_1 = 0.0;
    this.panY_1 = 0.0;
    this.zoom_1 = 1.0;
    this.dragging_1 = false;
    this.dragStartX_1 = 0.0;
    this.dragStartY_1 = 0.0;
    this.panStartX_1 = 0.0;
    this.panStartY_1 = 0.0;
    this.hoveredPoint_1 = null;
    this.focusAfterNextDisplay_1 = null;
    this.container_1.className = 'map';
    this.svg_1.setAttribute('viewBox', '0 0 ' + 960.0 + ' ' + 520.0);
    this.svg_1.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    this.rangesLayer_1.setAttribute('class', 'map-agent-ranges');
    this.worldLayer_1.appendChild(this.gridLayer_1);
    this.worldLayer_1.appendChild(this.rangesLayer_1);
    this.worldLayer_1.appendChild(this.markersLayer_1);
    this.svg_1.appendChild(this.worldLayer_1);
    this.container_1.appendChild(this.svg_1);
    this.container_1.appendChild(this.tooltip_1);
    this.container_1.onmousedown = DomMapView$lambda(this);
    this.container_1.onmousemove = DomMapView$lambda_0(this);
    this.container_1.onmouseup = DomMapView$lambda_1(this);
    this.container_1.onmouseleave = DomMapView$lambda_2(this);
    this.container_1.onwheel = DomMapView$lambda_3(this);
    this.svg_1.onclick = DomMapView$lambda_4(this);
  }
  protoOf(DomMapView).setDisplay_u6j9xy_k$ = function (newPoints, newRangeDiscs) {
    this.points_1 = newPoints;
    this.rangeDiscs_1 = newRangeDiscs;
    this.geoBounds_1 = computeBounds(this, this.points_1);
    var tmp0_safe_receiver = this.focusAfterNextDisplay_1;
    if (tmp0_safe_receiver == null)
      null;
    else {
      // Inline function 'kotlin.let' call
      // Inline function 'kotlin.contracts.contract' call
      this.focusAfterNextDisplay_1 = null;
      centerViewOn(this, tmp0_safe_receiver.get_lat_18j1l6_k$(), tmp0_safe_receiver.get_lon_18j19a_k$());
    }
    updateView(this);
  };
  protoOf(DomMapView).focusAfterPlacement_ofhbnl_k$ = function (coord) {
    this.focusAfterNextDisplay_1 = coord;
  };
  protoOf(DomMapView).setAddMode_47v2kj_k$ = function (mode) {
    this.addMode_1 = mode;
    this.container_1.classList.toggle('map-add-mode', !(mode == null));
  };
  protoOf(DomMapView).resetView_f1xryc_k$ = function () {
    this.panX_1 = 0.0;
    this.panY_1 = 0.0;
    this.zoom_1 = 1.0;
    updateView(this);
  };
  protoOf(DomMapView).zoomIn_8hxnqw_k$ = function () {
    zoomAt(this, 960.0 / 2.0, 520.0 / 2.0, 1.2);
  };
  protoOf(DomMapView).zoomOut_fu804r_k$ = function () {
    zoomAt(this, 960.0 / 2.0, 520.0 / 2.0, 1.0 / 1.2);
  };
  function _get_scope__bi2zur_1($this) {
    return $this.scope_1;
  }
  function _get_backendUrl__zbacsw_1($this) {
    return $this.backendUrl_1;
  }
  function _get_onDismiss__sukxdy($this) {
    return $this.onDismiss_1;
  }
  function _get_onSuccess__9olhzn($this) {
    return $this.onSuccess_1;
  }
  function _get_onError__hm6iwo($this) {
    return $this.onError_1;
  }
  function _get_onPickDestinationOnMap__w7qr8k($this) {
    return $this.onPickDestinationOnMap_1;
  }
  function _get_overlay__r3wklb($this) {
    return $this.overlay_1;
  }
  function _get_formHost__gy4kld($this) {
    return $this.formHost_1;
  }
  function _get_titleEl__48eo5u($this) {
    return $this.titleEl_1;
  }
  function _set_draft__dncwqs($this, _set____db54di) {
    $this.draft_1 = _set____db54di;
  }
  function _get_draft__idrjqo($this) {
    return $this.draft_1;
  }
  function renderForm($this) {
    var tmp0_elvis_lhs = $this.draft_1;
    var tmp;
    if (tmp0_elvis_lhs == null) {
      return Unit_getInstance();
    } else {
      tmp = tmp0_elvis_lhs;
    }
    var state = tmp;
    var tmp_0;
    switch (state.get_mode_woqlt8_k$().get_ordinal_ip24qg_k$()) {
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
    $this.titleEl_1.textContent = tmp_0;
    replaceChildren_0($this.formHost_1);
    if (state.get_mode_woqlt8_k$().get_ordinal_ip24qg_k$() === 1) {
      $this.formHost_1.appendChild(el('p', 'hint', 'Origin: ' + formatCoord_0(state.get_coord_ipub4c_k$().get_lat_18j1l6_k$(), 5) + ', ' + formatCoord_0(state.get_coord_ipub4c_k$().get_lon_18j19a_k$(), 5)));
    } else {
      $this.formHost_1.appendChild(el('p', 'hint', 'Location: ' + formatCoord_0(state.get_coord_ipub4c_k$().get_lat_18j1l6_k$(), 5) + ', ' + formatCoord_0(state.get_coord_ipub4c_k$().get_lon_18j19a_k$(), 5)));
    }
    switch (state.get_mode_woqlt8_k$().get_ordinal_ip24qg_k$()) {
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
    var tmp = state.get_stationId_pwojei_k$();
    field($this, 'Station ID', tmp, DomRegisterModal$renderStationFields$lambda($this));
    var tmp_0 = state.get_stationName_yfkinq_k$();
    field($this, 'Name', tmp_0, DomRegisterModal$renderStationFields$lambda_0($this));
    var tmp_1 = state.get_storageCapacity_m95bak_k$();
    field($this, 'Storage capacity', tmp_1, DomRegisterModal$renderStationFields$lambda_1($this));
    var tmp_2 = state.get_parkingCapacity_udcw2f_k$();
    field($this, 'Parking capacity', tmp_2, DomRegisterModal$renderStationFields$lambda_2($this));
    var tmp_3 = state.get_activateStation_yuf0ew_k$();
    $this.formHost_1.appendChild(labeledCheckbox('Activate after create', tmp_3, DomRegisterModal$renderStationFields$lambda_3($this)));
  }
  function renderAgentFields($this, state) {
    var tmp = state.get_agentId_ga4ovd_k$();
    field($this, 'Agent ID', tmp, DomRegisterModal$renderAgentFields$lambda($this));
    var tmp_0 = state.get_agentType_jm8bey_k$();
    field($this, 'Type (UAV/UGV)', tmp_0, DomRegisterModal$renderAgentFields$lambda_0($this));
    var tmp_1 = state.get_agentAlt_7i96tv_k$();
    field($this, 'Altitude m', tmp_1, DomRegisterModal$renderAgentFields$lambda_1($this));
    var tmp_2 = state.get_agentRange_v3bpoh_k$();
    field($this, 'Range m', tmp_2, DomRegisterModal$renderAgentFields$lambda_2($this));
    var tmp_3 = state.get_agentPayload_hlq3gy_k$();
    field($this, 'Payload kg', tmp_3, DomRegisterModal$renderAgentFields$lambda_3($this));
    var tmp_4 = state.get_agentStationId_l32znx_k$();
    field($this, 'Station ID (optional)', tmp_4, DomRegisterModal$renderAgentFields$lambda_4($this));
    var tmp_5 = state.get_agentPx4Instance_opl5r9_k$();
    field($this, 'PX4 instance', tmp_5, DomRegisterModal$renderAgentFields$lambda_5($this));
    var tmp_6 = state.get_agentMavlinkPort_10ie81_k$();
    field($this, 'MAVLink port', tmp_6, DomRegisterModal$renderAgentFields$lambda_6($this));
    var tmp_7 = state.get_agentAutoStart_uei0ll_k$();
    $this.formHost_1.appendChild(labeledCheckbox('Auto-start runtime', tmp_7, DomRegisterModal$renderAgentFields$lambda_7($this)));
    var tmp_8 = state.get_activateAgent_p96ox5_k$();
    $this.formHost_1.appendChild(labeledCheckbox('Activate after register', tmp_8, DomRegisterModal$renderAgentFields$lambda_8($this)));
  }
  function renderPackageFields($this, state) {
    var tmp = state.get_customerId_opgpia_k$();
    field($this, 'Customer ID', tmp, DomRegisterModal$renderPackageFields$lambda($this));
    var tmp_0 = state.get_weightKg_urxiv1_k$();
    field($this, 'Weight kg', tmp_0, DomRegisterModal$renderPackageFields$lambda_0($this));
    var tmp_1 = state.get_volumeM3_8ayne1_k$();
    field($this, 'Volume m\xB3', tmp_1, DomRegisterModal$renderPackageFields$lambda_1($this));
    $this.formHost_1.appendChild(el('p', 'hint', 'Destination (map or coordinates)'));
    var tmp_2;
    var tmp_3;
    // Inline function 'kotlin.text.isNotBlank' call
    var this_0 = state.get_destLat_r0r25w_k$();
    if (!isBlank(this_0)) {
      // Inline function 'kotlin.text.isNotBlank' call
      var this_1 = state.get_destLon_r0r2hs_k$();
      tmp_3 = !isBlank(this_1);
    } else {
      tmp_3 = false;
    }
    if (tmp_3) {
      tmp_2 = 'Destination: ' + state.get_destLat_r0r25w_k$() + ', ' + state.get_destLon_r0r2hs_k$();
    } else {
      tmp_2 = 'Destination: not set \u2014 pick on map or enter coordinates below';
    }
    var destHint = tmp_2;
    $this.formHost_1.appendChild(el('p', 'hint', destHint));
    $this.formHost_1.appendChild(button('Pick destination on map', 'secondary', DomRegisterModal$renderPackageFields$lambda_2($this)));
    var tmp_4 = state.get_destLat_r0r25w_k$();
    field($this, 'Destination lat', tmp_4, DomRegisterModal$renderPackageFields$lambda_3($this));
    var tmp_5 = state.get_destLon_r0r2hs_k$();
    field($this, 'Destination lon', tmp_5, DomRegisterModal$renderPackageFields$lambda_4($this));
    var tmp_6 = state.get_groundTransport_o97o1l_k$();
    $this.formHost_1.appendChild(labeledCheckbox('Requires ground transport', tmp_6, DomRegisterModal$renderPackageFields$lambda_5($this)));
  }
  function field($this, label, value, onChange) {
    var _destruct__k2r9zo = labeledInput(label, value, VOID, onChange);
    var labelEl = _destruct__k2r9zo.component1_7eebsc_k$();
    var input = _destruct__k2r9zo.component2_7eebsb_k$();
    $this.formHost_1.appendChild(labelEl);
    $this.formHost_1.appendChild(input);
  }
  function dismiss($this) {
    $this.overlay_1.classList.add('hidden');
    $this.draft_1 = null;
    $this.onDismiss_1();
  }
  function submit($this) {
    var tmp0_elvis_lhs = $this.draft_1;
    var tmp;
    if (tmp0_elvis_lhs == null) {
      return Unit_getInstance();
    } else {
      tmp = tmp0_elvis_lhs;
    }
    var state = tmp;
    if (state.get_mode_woqlt8_k$().equals(MapAddMode_PACKAGE_getInstance()) && (isBlank(state.get_destLat_r0r25w_k$()) || isBlank(state.get_destLon_r0r2hs_k$()))) {
      $this.onError_1('Set the destination on the map or enter latitude and longitude.');
      return Unit_getInstance();
    }
    launch($this.scope_1, VOID, VOID, DomRegisterModal$submit$slambda_0(state, $this, null));
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
      return Unit_getInstance();
    };
  }
  function DomRegisterModal$lambda_1(this$0) {
    return function () {
      submit(this$0);
      return Unit_getInstance();
    };
  }
  function DomRegisterModal$lambda_2(this$0) {
    return function () {
      dismiss(this$0);
      return Unit_getInstance();
    };
  }
  function DomRegisterModal$renderStationFields$lambda(this$0) {
    return function (it) {
      this$0.draft_1 = ensureNotNull(this$0.draft_1).copy$default_3uibqy_k$(VOID, VOID, it);
      return Unit_getInstance();
    };
  }
  function DomRegisterModal$renderStationFields$lambda_0(this$0) {
    return function (it) {
      this$0.draft_1 = ensureNotNull(this$0.draft_1).copy$default_3uibqy_k$(VOID, VOID, VOID, it);
      return Unit_getInstance();
    };
  }
  function DomRegisterModal$renderStationFields$lambda_1(this$0) {
    return function (it) {
      this$0.draft_1 = ensureNotNull(this$0.draft_1).copy$default_3uibqy_k$(VOID, VOID, VOID, VOID, it);
      return Unit_getInstance();
    };
  }
  function DomRegisterModal$renderStationFields$lambda_2(this$0) {
    return function (it) {
      this$0.draft_1 = ensureNotNull(this$0.draft_1).copy$default_3uibqy_k$(VOID, VOID, VOID, VOID, VOID, it);
      return Unit_getInstance();
    };
  }
  function DomRegisterModal$renderStationFields$lambda_3(this$0) {
    return function (it) {
      this$0.draft_1 = ensureNotNull(this$0.draft_1).copy$default_3uibqy_k$(VOID, VOID, VOID, VOID, VOID, VOID, it);
      return Unit_getInstance();
    };
  }
  function DomRegisterModal$renderAgentFields$lambda(this$0) {
    return function (it) {
      this$0.draft_1 = ensureNotNull(this$0.draft_1).copy$default_3uibqy_k$(VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, it);
      return Unit_getInstance();
    };
  }
  function DomRegisterModal$renderAgentFields$lambda_0(this$0) {
    return function (value) {
      // Inline function 'kotlin.text.uppercase' call
      // Inline function 'kotlin.js.asDynamic' call
      var type = value.toUpperCase();
      var tmp = this$0;
      var tmp0_$this = ensureNotNull(this$0.draft_1);
      var tmp1_agentPx4Model = type === 'UGV' ? 'r1_rover' : 'x500';
      var tmp2_agentPayload = type === 'UGV' ? '20' : '5';
      var tmp3_agentRange = type === 'UGV' ? '8000' : '650';
      tmp.draft_1 = tmp0_$this.copy$default_3uibqy_k$(VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, type, VOID, tmp3_agentRange, tmp2_agentPayload, VOID, VOID, tmp1_agentPx4Model);
      return Unit_getInstance();
    };
  }
  function DomRegisterModal$renderAgentFields$lambda_1(this$0) {
    return function (it) {
      this$0.draft_1 = ensureNotNull(this$0.draft_1).copy$default_3uibqy_k$(VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, it);
      return Unit_getInstance();
    };
  }
  function DomRegisterModal$renderAgentFields$lambda_2(this$0) {
    return function (it) {
      this$0.draft_1 = ensureNotNull(this$0.draft_1).copy$default_3uibqy_k$(VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, it);
      return Unit_getInstance();
    };
  }
  function DomRegisterModal$renderAgentFields$lambda_3(this$0) {
    return function (it) {
      this$0.draft_1 = ensureNotNull(this$0.draft_1).copy$default_3uibqy_k$(VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, it);
      return Unit_getInstance();
    };
  }
  function DomRegisterModal$renderAgentFields$lambda_4(this$0) {
    return function (it) {
      this$0.draft_1 = ensureNotNull(this$0.draft_1).copy$default_3uibqy_k$(VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, it);
      return Unit_getInstance();
    };
  }
  function DomRegisterModal$renderAgentFields$lambda_5(this$0) {
    return function (it) {
      this$0.draft_1 = ensureNotNull(this$0.draft_1).copy$default_3uibqy_k$(VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, it);
      return Unit_getInstance();
    };
  }
  function DomRegisterModal$renderAgentFields$lambda_6(this$0) {
    return function (it) {
      this$0.draft_1 = ensureNotNull(this$0.draft_1).copy$default_3uibqy_k$(VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, it);
      return Unit_getInstance();
    };
  }
  function DomRegisterModal$renderAgentFields$lambda_7(this$0) {
    return function (it) {
      this$0.draft_1 = ensureNotNull(this$0.draft_1).copy$default_3uibqy_k$(VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, it);
      return Unit_getInstance();
    };
  }
  function DomRegisterModal$renderAgentFields$lambda_8(this$0) {
    return function (it) {
      this$0.draft_1 = ensureNotNull(this$0.draft_1).copy$default_3uibqy_k$(VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, it);
      return Unit_getInstance();
    };
  }
  function DomRegisterModal$renderPackageFields$lambda(this$0) {
    return function (it) {
      this$0.draft_1 = ensureNotNull(this$0.draft_1).copy$default_3uibqy_k$(VOID, VOID, VOID, VOID, VOID, VOID, VOID, it);
      return Unit_getInstance();
    };
  }
  function DomRegisterModal$renderPackageFields$lambda_0(this$0) {
    return function (it) {
      this$0.draft_1 = ensureNotNull(this$0.draft_1).copy$default_3uibqy_k$(VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, it);
      return Unit_getInstance();
    };
  }
  function DomRegisterModal$renderPackageFields$lambda_1(this$0) {
    return function (it) {
      this$0.draft_1 = ensureNotNull(this$0.draft_1).copy$default_3uibqy_k$(VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, it);
      return Unit_getInstance();
    };
  }
  function DomRegisterModal$renderPackageFields$lambda_2(this$0) {
    return function () {
      var tmp0_elvis_lhs = this$0.draft_1;
      var tmp;
      if (tmp0_elvis_lhs == null) {
        return Unit_getInstance();
      } else {
        tmp = tmp0_elvis_lhs;
      }
      var current = tmp;
      this$0.hideForMapPick_dlduu2_k$();
      this$0.onPickDestinationOnMap_1(current);
      return Unit_getInstance();
    };
  }
  function DomRegisterModal$renderPackageFields$lambda_3(this$0) {
    return function (it) {
      this$0.draft_1 = ensureNotNull(this$0.draft_1).copy$default_3uibqy_k$(VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, it);
      return Unit_getInstance();
    };
  }
  function DomRegisterModal$renderPackageFields$lambda_4(this$0) {
    return function (it) {
      this$0.draft_1 = ensureNotNull(this$0.draft_1).copy$default_3uibqy_k$(VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, it);
      return Unit_getInstance();
    };
  }
  function DomRegisterModal$renderPackageFields$lambda_5(this$0) {
    return function (it) {
      this$0.draft_1 = ensureNotNull(this$0.draft_1).copy$default_3uibqy_k$(VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, it);
      return Unit_getInstance();
    };
  }
  function DomRegisterModal$submit$slambda($state, this$0, resultContinuation) {
    this.$state_1 = $state;
    this.this$0__1 = this$0;
    CoroutineImpl.call(this, resultContinuation);
  }
  protoOf(DomRegisterModal$submit$slambda).invoke_d9fzmj_k$ = function ($this$launch, $completion) {
    var tmp = this.create_rcuf4x_k$($this$launch, $completion);
    tmp.set_result_xj64lm_k$(Unit_getInstance());
    tmp.set_exception_px07aa_k$(null);
    return tmp.doResume_5yljmg_k$();
  };
  protoOf(DomRegisterModal$submit$slambda).invoke_qns8j1_k$ = function (p1, $completion) {
    return this.invoke_d9fzmj_k$((!(p1 == null) ? isInterface(p1, CoroutineScope) : false) ? p1 : THROW_CCE(), $completion);
  };
  protoOf(DomRegisterModal$submit$slambda).doResume_5yljmg_k$ = function () {
    var suspendResult = this.get_result_iyg5d2_k$();
    $sm: do
      try {
        var tmp = this.get_state_iypx7s_k$();
        switch (tmp) {
          case 0:
            this.set_exceptionState_fex74n_k$(3);
            var tmp_0 = this;
            tmp_0.this0__1 = this.$this$launch_1;
            this.set_exceptionState_fex74n_k$(2);
            var tmp_1 = this;
            tmp_1.this2__1 = Companion_getInstance();
            var tmp_2 = this;
            tmp_2.$this$runCatching3__1 = this.this0__1;
            this.set_state_rjd8d0_k$(1);
            suspendResult = this.$state_1.submit_3qaam7_k$(this.this$0__1.backendUrl_1(), this);
            if (suspendResult === get_COROUTINE_SUSPENDED()) {
              return suspendResult;
            }

            continue $sm;
          case 1:
            var value = suspendResult;
            this.TRY_RESULT1__1 = _Result___init__impl__xyqfz8(value);
            this.set_exceptionState_fex74n_k$(3);
            this.set_state_rjd8d0_k$(4);
            continue $sm;
          case 2:
            this.set_exceptionState_fex74n_k$(3);
            var tmp_3 = this.get_exception_x0n6w6_k$();
            if (tmp_3 instanceof Error) {
              var e = this.get_exception_x0n6w6_k$();
              var tmp_4 = this;
              Companion_getInstance();
              tmp_4.TRY_RESULT1__1 = _Result___init__impl__xyqfz8(createFailure(e));
              this.set_state_rjd8d0_k$(4);
              continue $sm;
            } else {
              throw this.get_exception_x0n6w6_k$();
            }

          case 3:
            throw this.get_exception_x0n6w6_k$();
          case 4:
            this.set_exceptionState_fex74n_k$(3);
            var this_0 = this.TRY_RESULT1__1;
            if (_Result___get_isSuccess__impl__sndoy8(this_0)) {
              var tmp_5 = _Result___get_value__impl__bjfvqg(this_0);
              var it = (tmp_5 == null ? true : !(tmp_5 == null)) ? tmp_5 : THROW_CCE();
              dismiss(this.this$0__1);
              this.this$0__1.onSuccess_1(it);
            }

            var tmp0_safe_receiver = Result__exceptionOrNull_impl_p6xea9(this_0);
            if (tmp0_safe_receiver == null)
              null;
            else {
              var tmp0_elvis_lhs = tmp0_safe_receiver.message;
              this.this$0__1.onError_1(tmp0_elvis_lhs == null ? 'Request failed' : tmp0_elvis_lhs);
            }

            return Unit_getInstance();
        }
      } catch ($p) {
        var e_0 = $p;
        if (this.get_exceptionState_wflpxn_k$() === 3) {
          throw e_0;
        } else {
          this.set_state_rjd8d0_k$(this.get_exceptionState_wflpxn_k$());
          this.set_exception_px07aa_k$(e_0);
        }
      }
     while (true);
  };
  protoOf(DomRegisterModal$submit$slambda).create_rcuf4x_k$ = function ($this$launch, completion) {
    var i = new DomRegisterModal$submit$slambda(this.$state_1, this.this$0__1, completion);
    i.$this$launch_1 = $this$launch;
    return i;
  };
  protoOf(DomRegisterModal$submit$slambda).create_wyq9v6_k$ = function (value, completion) {
    return this.create_rcuf4x_k$((!(value == null) ? isInterface(value, CoroutineScope) : false) ? value : THROW_CCE(), completion);
  };
  function DomRegisterModal$submit$slambda_0($state, this$0, resultContinuation) {
    var i = new DomRegisterModal$submit$slambda($state, this$0, resultContinuation);
    var l = function ($this$launch, $completion) {
      return i.invoke_d9fzmj_k$($this$launch, $completion);
    };
    l.$arity = 1;
    return l;
  }
  function DomRegisterModal(scope, backendUrl, onDismiss, onSuccess, onError, onPickDestinationOnMap) {
    this.scope_1 = scope;
    this.backendUrl_1 = backendUrl;
    this.onDismiss_1 = onDismiss;
    this.onSuccess_1 = onSuccess;
    this.onError_1 = onError;
    this.onPickDestinationOnMap_1 = onPickDestinationOnMap;
    this.overlay_1 = el('div', 'overlay hidden');
    this.formHost_1 = el('div', 'overlay-form');
    this.titleEl_1 = el('h2');
    this.draft_1 = null;
    var backdrop = el('div', 'overlay-backdrop');
    backdrop.onclick = DomRegisterModal$lambda(this);
    var card = el('div', 'overlay-card');
    var header = el('header');
    header.appendChild(this.titleEl_1);
    header.appendChild(button('\xD7', 'secondary', DomRegisterModal$lambda_0(this)));
    card.appendChild(header);
    card.appendChild(this.formHost_1);
    var actions = el('div', 'overlay-actions');
    actions.appendChild(button('Submit', VOID, DomRegisterModal$lambda_1(this)));
    actions.appendChild(button('Cancel', 'secondary', DomRegisterModal$lambda_2(this)));
    card.appendChild(actions);
    this.overlay_1.appendChild(backdrop);
    this.overlay_1.appendChild(card);
  }
  protoOf(DomRegisterModal).element_ri0d8k_k$ = function () {
    return this.overlay_1;
  };
  protoOf(DomRegisterModal).show_c1m4t6_k$ = function (state) {
    this.draft_1 = state;
    this.overlay_1.classList.remove('hidden');
    renderForm(this);
  };
  protoOf(DomRegisterModal).updateDraft_rglwsr_k$ = function (state) {
    this.draft_1 = state;
    this.overlay_1.classList.remove('hidden');
    renderForm(this);
  };
  protoOf(DomRegisterModal).hideForMapPick_dlduu2_k$ = function () {
    this.overlay_1.classList.add('hidden');
  };
  function replaceChildren_0(_this__u8e3s4) {
    while (!(_this__u8e3s4.firstChild == null)) {
      _this__u8e3s4.removeChild(ensureNotNull(_this__u8e3s4.firstChild));
    }
  }
  function _get_STORAGE_KEY__9z5ac6($this) {
    return $this.STORAGE_KEY_1;
  }
  function _set_uavMaxRangeMeters__fcakp4($this, _set____db54di) {
    $this.uavMaxRangeMeters_1 = _set____db54di;
  }
  function _set_ugvMaxRangeMeters__n45xz6($this, _set____db54di) {
    $this.ugvMaxRangeMeters_1 = _set____db54di;
  }
  function _set_routeReservePercent__59rih9($this, _set____db54di) {
    $this.routeReservePercent_1 = _set____db54di;
  }
  function usableRangeFraction($this) {
    return 1.0 - $this.routeReservePercent_1 / 100.0;
  }
  function loadFromLocalStorage($this) {
    var tmp0_elvis_lhs = localStorage.getItem('uavlogistics.fleetRangeSettings');
    var tmp;
    if (tmp0_elvis_lhs == null) {
      return Unit_getInstance();
    } else {
      tmp = tmp0_elvis_lhs;
    }
    var raw = tmp;
    // Inline function 'kotlin.runCatching' call
    var tmp_0;
    try {
      // Inline function 'kotlin.Companion.success' call
      Companion_getInstance();
      var parsed = JSON.parse(raw);
      var tmp_1 = parsed.uavMaxRangeMeters;
      AgentRangeSettings_getInstance();
      var tmp_2 = optionalNumber($this, tmp_1, 650.0);
      var tmp_3 = parsed.ugvMaxRangeMeters;
      AgentRangeSettings_getInstance();
      var tmp_4 = optionalNumber($this, tmp_3, 600.0);
      var tmp_5 = parsed.routeReservePercent;
      AgentRangeSettings_getInstance();
      $this.applyValues_l74jy7_k$(tmp_2, tmp_4, optionalNumber($this, tmp_5, 15.0), false);
      tmp_0 = _Result___init__impl__xyqfz8(Unit_getInstance());
    } catch ($p) {
      var tmp_6;
      if ($p instanceof Error) {
        var e = $p;
        // Inline function 'kotlin.Companion.failure' call
        Companion_getInstance();
        tmp_6 = _Result___init__impl__xyqfz8(createFailure(e));
      } else {
        throw $p;
      }
      tmp_0 = tmp_6;
    }
  }
  function saveToLocalStorage($this) {
    localStorage.setItem('uavlogistics.fleetRangeSettings', $this.toApiBody_ua0jc1_k$());
  }
  function optionalNumber($this, value, default_0) {
    // Inline function 'kotlin.getOrElse' call
    // Inline function 'kotlin.runCatching' call
    var tmp;
    try {
      // Inline function 'kotlin.Companion.success' call
      Companion_getInstance();
      // Inline function 'pl.edu.wat.uavlogistics.frontend.model.AgentRangeSettings.optionalNumber.<anonymous>' call
      var value_0 = numberToDouble(isNumber(value) ? value : THROW_CCE());
      tmp = _Result___init__impl__xyqfz8(value_0);
    } catch ($p) {
      var tmp_0;
      if ($p instanceof Error) {
        var e = $p;
        // Inline function 'kotlin.Companion.failure' call
        Companion_getInstance();
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
    this.STORAGE_KEY_1 = 'uavlogistics.fleetRangeSettings';
    this.DEFAULT_UAV_MAX_RANGE_METERS_1 = 650.0;
    this.DEFAULT_UGV_MAX_RANGE_METERS_1 = 600.0;
    this.DEFAULT_ROUTE_RESERVE_PERCENT_1 = 15.0;
    this.UGV_ROUTE_DISTANCE_MULTIPLIER_1 = 1.35;
    this.uavMaxRangeMeters_1 = 650.0;
    this.ugvMaxRangeMeters_1 = 600.0;
    this.routeReservePercent_1 = 15.0;
    loadFromLocalStorage(this);
  }
  protoOf(AgentRangeSettings).get_DEFAULT_UAV_MAX_RANGE_METERS_uezsl9_k$ = function () {
    return this.DEFAULT_UAV_MAX_RANGE_METERS_1;
  };
  protoOf(AgentRangeSettings).get_DEFAULT_UGV_MAX_RANGE_METERS_rukjd5_k$ = function () {
    return this.DEFAULT_UGV_MAX_RANGE_METERS_1;
  };
  protoOf(AgentRangeSettings).get_DEFAULT_ROUTE_RESERVE_PERCENT_ce8l2d_k$ = function () {
    return this.DEFAULT_ROUTE_RESERVE_PERCENT_1;
  };
  protoOf(AgentRangeSettings).get_UGV_ROUTE_DISTANCE_MULTIPLIER_tcrslt_k$ = function () {
    return this.UGV_ROUTE_DISTANCE_MULTIPLIER_1;
  };
  protoOf(AgentRangeSettings).get_uavMaxRangeMeters_udmtc4_k$ = function () {
    return this.uavMaxRangeMeters_1;
  };
  protoOf(AgentRangeSettings).get_ugvMaxRangeMeters_ka4ate_k$ = function () {
    return this.ugvMaxRangeMeters_1;
  };
  protoOf(AgentRangeSettings).get_routeReservePercent_5inh07_k$ = function () {
    return this.routeReservePercent_1;
  };
  protoOf(AgentRangeSettings).syncFromNetwork_3zgptl_k$ = function (state) {
    var tmp1_elvis_lhs = state == null ? null : state.fleetRangeSettings;
    var tmp;
    if (tmp1_elvis_lhs == null) {
      return Unit_getInstance();
    } else {
      tmp = tmp1_elvis_lhs;
    }
    var settings = tmp;
    this.applyValues_l74jy7_k$(optionalNumber(this, settings.uavMaxRangeMeters, 650.0), optionalNumber(this, settings.ugvMaxRangeMeters, 600.0), optionalNumber(this, settings.routeReservePercent, 15.0), true);
  };
  protoOf(AgentRangeSettings).applyValues_l74jy7_k$ = function (uav, ugv, reserve, persistLocally) {
    this.uavMaxRangeMeters_1 = coerceAtLeast(uav, 1.0);
    this.ugvMaxRangeMeters_1 = coerceAtLeast(ugv, 1.0);
    this.routeReservePercent_1 = coerceIn(reserve, 0.0, 99.0);
    if (persistLocally) {
      saveToLocalStorage(this);
    }
  };
  protoOf(AgentRangeSettings).applyValues$default_906vcf_k$ = function (uav, ugv, reserve, persistLocally, $super) {
    persistLocally = persistLocally === VOID ? false : persistLocally;
    var tmp;
    if ($super === VOID) {
      this.applyValues_l74jy7_k$(uav, ugv, reserve, persistLocally);
      tmp = Unit_getInstance();
    } else {
      tmp = $super.applyValues_l74jy7_k$.call(this, uav, ugv, reserve, persistLocally);
    }
    return tmp;
  };
  protoOf(AgentRangeSettings).maxRangeMetersForType_c56k1m_k$ = function (vehicleType) {
    // Inline function 'kotlin.text.uppercase' call
    // Inline function 'kotlin.js.asDynamic' call
    return vehicleType.toUpperCase() === 'UGV' ? this.ugvMaxRangeMeters_1 : this.uavMaxRangeMeters_1;
  };
  protoOf(AgentRangeSettings).routeDistanceMultiplier_mn2d7f_k$ = function (vehicleType) {
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
  protoOf(AgentRangeSettings).rebalanceHopRadiusMeters_vpyf12_k$ = function (maxRangeMeters) {
    return coerceAtLeast(maxRangeMeters, 0.0);
  };
  protoOf(AgentRangeSettings).interStationRadiusMeters_9a67xc_k$ = function (vehicleType, maxRangeMeters) {
    return maxRangeMeters * usableRangeFraction(this) / this.routeDistanceMultiplier_mn2d7f_k$(vehicleType);
  };
  protoOf(AgentRangeSettings).interStationRadiusMeters$default_vlmmts_k$ = function (vehicleType, maxRangeMeters, $super) {
    maxRangeMeters = maxRangeMeters === VOID ? this.maxRangeMetersForType_c56k1m_k$(vehicleType) : maxRangeMeters;
    return $super === VOID ? this.interStationRadiusMeters_9a67xc_k$(vehicleType, maxRangeMeters) : $super.interStationRadiusMeters_9a67xc_k$.call(this, vehicleType, maxRangeMeters);
  };
  protoOf(AgentRangeSettings).interStationRadiusMeters_412die_k$ = function (vehicleType) {
    return this.interStationRadiusMeters_9a67xc_k$(vehicleType, this.maxRangeMetersForType_c56k1m_k$(vehicleType));
  };
  protoOf(AgentRangeSettings).packagePickupRadiusMeters_4td6uu_k$ = function (vehicleType, maxRangeMeters) {
    return maxRangeMeters * usableRangeFraction(this) / (2.0 * this.routeDistanceMultiplier_mn2d7f_k$(vehicleType));
  };
  protoOf(AgentRangeSettings).packagePickupRadiusMeters$default_db3rpi_k$ = function (vehicleType, maxRangeMeters, $super) {
    maxRangeMeters = maxRangeMeters === VOID ? this.maxRangeMetersForType_c56k1m_k$(vehicleType) : maxRangeMeters;
    return $super === VOID ? this.packagePickupRadiusMeters_4td6uu_k$(vehicleType, maxRangeMeters) : $super.packagePickupRadiusMeters_4td6uu_k$.call(this, vehicleType, maxRangeMeters);
  };
  protoOf(AgentRangeSettings).maxRangeMetersFromAgents_gd3h33_k$ = function (agents, vehicleType) {
    // Inline function 'kotlin.text.uppercase' call
    // Inline function 'kotlin.js.asDynamic' call
    var type = vehicleType.toUpperCase();
    var maxRange = null;
    // Inline function 'kotlin.collections.forEach' call
    var indexedObject = dynamicArray(agents);
    var inductionVariable = 0;
    var last = indexedObject.length;
    while (inductionVariable < last) {
      var element = indexedObject[inductionVariable];
      inductionVariable = inductionVariable + 1 | 0;
      $l$block_0: {
        // Inline function 'pl.edu.wat.uavlogistics.frontend.model.AgentRangeSettings.maxRangeMetersFromAgents.<anonymous>' call
        // Inline function 'kotlin.text.uppercase' call
        var tmp = element.type;
        // Inline function 'kotlin.js.asDynamic' call
        if (!(((!(tmp == null) ? typeof tmp === 'string' : false) ? tmp : THROW_CCE()).toUpperCase() === type)) {
          break $l$block_0;
        }
        // Inline function 'kotlin.Result.getOrNull' call
        // Inline function 'kotlin.runCatching' call
        AgentRangeSettings_getInstance();
        var tmp_0;
        try {
          // Inline function 'kotlin.Companion.success' call
          Companion_getInstance();
          // Inline function 'pl.edu.wat.uavlogistics.frontend.model.AgentRangeSettings.maxRangeMetersFromAgents.<anonymous>.<anonymous>' call
          var tmp_1 = element.maxRangeMeters;
          var value = numberToDouble(isNumber(tmp_1) ? tmp_1 : THROW_CCE());
          tmp_0 = _Result___init__impl__xyqfz8(value);
        } catch ($p) {
          var tmp_2;
          if ($p instanceof Error) {
            var e = $p;
            // Inline function 'kotlin.Companion.failure' call
            Companion_getInstance();
            tmp_2 = _Result___init__impl__xyqfz8(createFailure(e));
          } else {
            throw $p;
          }
          tmp_0 = tmp_2;
        }
        var this_0 = tmp_0;
        var tmp_3;
        if (_Result___get_isFailure__impl__jpiriv(this_0)) {
          tmp_3 = null;
        } else {
          var tmp_4 = _Result___get_value__impl__bjfvqg(this_0);
          tmp_3 = (tmp_4 == null ? true : !(tmp_4 == null)) ? tmp_4 : THROW_CCE();
        }
        var tmp0_elvis_lhs = tmp_3;
        var tmp_5;
        if (tmp0_elvis_lhs == null) {
          break $l$block_0;
        } else {
          tmp_5 = tmp0_elvis_lhs;
        }
        var range = tmp_5;
        var tmp_6;
        if (maxRange == null) {
          tmp_6 = range;
        } else {
          // Inline function 'kotlin.comparisons.maxOf' call
          var a = ensureNotNull(maxRange);
          tmp_6 = Math.max(a, range);
        }
        maxRange = tmp_6;
      }
    }
    return maxRange;
  };
  protoOf(AgentRangeSettings).registeredVehicleTypes_sf4dhr_k$ = function (agents) {
    if (agents == null)
      return emptyList();
    // Inline function 'kotlin.collections.mutableSetOf' call
    var types = LinkedHashSet_init_$Create$();
    // Inline function 'kotlin.collections.forEach' call
    var indexedObject = dynamicArray(agents);
    var inductionVariable = 0;
    var last = indexedObject.length;
    while (inductionVariable < last) {
      var element = indexedObject[inductionVariable];
      inductionVariable = inductionVariable + 1 | 0;
      // Inline function 'pl.edu.wat.uavlogistics.frontend.model.AgentRangeSettings.registeredVehicleTypes.<anonymous>' call
      // Inline function 'kotlin.text.uppercase' call
      var tmp = element.type;
      // Inline function 'kotlin.js.asDynamic' call
      var tmp$ret$2 = ((!(tmp == null) ? typeof tmp === 'string' : false) ? tmp : THROW_CCE()).toUpperCase();
      types.add_utx5q5_k$(tmp$ret$2);
    }
    return sorted(types);
  };
  protoOf(AgentRangeSettings).displayMaxRangeMeters_56fz2t_k$ = function (vehicleType, agents) {
    if (agents == null)
      return this.maxRangeMetersForType_c56k1m_k$(vehicleType);
    var tmp0_safe_receiver = this.maxRangeMetersFromAgents_gd3h33_k$(agents, vehicleType);
    if (tmp0_safe_receiver == null)
      null;
    else {
      // Inline function 'kotlin.let' call
      // Inline function 'kotlin.contracts.contract' call
      return tmp0_safe_receiver;
    }
    return this.maxRangeMetersForType_c56k1m_k$(vehicleType);
  };
  protoOf(AgentRangeSettings).effectiveServiceRadiusMeters_wd3n4g_k$ = function (vehicleType) {
    return this.packagePickupRadiusMeters$default_db3rpi_k$(vehicleType);
  };
  protoOf(AgentRangeSettings).toApiBody_ua0jc1_k$ = function () {
    var body = {};
    body.uavMaxRangeMeters = this.uavMaxRangeMeters_1;
    body.ugvMaxRangeMeters = this.ugvMaxRangeMeters_1;
    body.routeReservePercent = this.routeReservePercent_1;
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
  function valueOf(value) {
    switch (value) {
      case 'STATION':
        return MapAddMode_STATION_getInstance();
      case 'PACKAGE':
        return MapAddMode_PACKAGE_getInstance();
      case 'AGENT':
        return MapAddMode_AGENT_getInstance();
      default:
        MapAddMode_initEntries();
        THROW_IAE('No enum constant value.');
        break;
    }
  }
  function get_entries() {
    if ($ENTRIES == null)
      $ENTRIES = enumEntries(values());
    return $ENTRIES;
  }
  var MapAddMode_entriesInitialized;
  function MapAddMode_initEntries() {
    if (MapAddMode_entriesInitialized)
      return Unit_getInstance();
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
  function get_METERS_PER_DEGREE_LAT() {
    return METERS_PER_DEGREE_LAT;
  }
  var METERS_PER_DEGREE_LAT;
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
  function geoEastMeters(lon, refLon, refLat) {
    var tmp = (lon - refLon) * 111320.0;
    // Inline function 'kotlin.math.cos' call
    var x = refLat * 3.141592653589793 / 180.0;
    return tmp * Math.cos(x);
  }
  function geoNorthMeters(lat, refLat) {
    return (lat - refLat) * 111320.0;
  }
  function geoFromLocalMeters(eastMeters, northMeters, refLat, refLon) {
    var lat = refLat + northMeters / 111320.0;
    // Inline function 'kotlin.math.cos' call
    var x = refLat * 3.141592653589793 / 180.0;
    var tmp$ret$0 = Math.cos(x);
    var cosLat = coerceAtLeast(tmp$ret$0, 0.01);
    var lon = refLon + eastMeters / (111320.0 * cosLat);
    return new GeoCoord(lat, lon);
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
    this.id_1 = id;
    this.label_1 = label;
    this.details_1 = details;
    this.lat_1 = lat;
    this.lon_1 = lon;
    this.kind_1 = kind;
    this.agentType_1 = agentType;
  }
  protoOf(MapPoint).get_id_kntnx8_k$ = function () {
    return this.id_1;
  };
  protoOf(MapPoint).get_label_iuj8p7_k$ = function () {
    return this.label_1;
  };
  protoOf(MapPoint).get_details_r0zbrt_k$ = function () {
    return this.details_1;
  };
  protoOf(MapPoint).get_lat_18j1l6_k$ = function () {
    return this.lat_1;
  };
  protoOf(MapPoint).get_lon_18j19a_k$ = function () {
    return this.lon_1;
  };
  protoOf(MapPoint).get_kind_wop7ml_k$ = function () {
    return this.kind_1;
  };
  protoOf(MapPoint).get_agentType_jm8bey_k$ = function () {
    return this.agentType_1;
  };
  protoOf(MapPoint).component1_7eebsc_k$ = function () {
    return this.id_1;
  };
  protoOf(MapPoint).component2_7eebsb_k$ = function () {
    return this.label_1;
  };
  protoOf(MapPoint).component3_7eebsa_k$ = function () {
    return this.details_1;
  };
  protoOf(MapPoint).component4_7eebs9_k$ = function () {
    return this.lat_1;
  };
  protoOf(MapPoint).component5_7eebs8_k$ = function () {
    return this.lon_1;
  };
  protoOf(MapPoint).component6_7eebs7_k$ = function () {
    return this.kind_1;
  };
  protoOf(MapPoint).component7_7eebs6_k$ = function () {
    return this.agentType_1;
  };
  protoOf(MapPoint).copy_e09ruy_k$ = function (id, label, details, lat, lon, kind, agentType) {
    return new MapPoint(id, label, details, lat, lon, kind, agentType);
  };
  protoOf(MapPoint).copy$default_5oxtj7_k$ = function (id, label, details, lat, lon, kind, agentType, $super) {
    id = id === VOID ? this.id_1 : id;
    label = label === VOID ? this.label_1 : label;
    details = details === VOID ? this.details_1 : details;
    lat = lat === VOID ? this.lat_1 : lat;
    lon = lon === VOID ? this.lon_1 : lon;
    kind = kind === VOID ? this.kind_1 : kind;
    agentType = agentType === VOID ? this.agentType_1 : agentType;
    return $super === VOID ? this.copy_e09ruy_k$(id, label, details, lat, lon, kind, agentType) : $super.copy_e09ruy_k$.call(this, id, label, details, lat, lon, kind, agentType);
  };
  protoOf(MapPoint).toString = function () {
    return 'MapPoint(id=' + this.id_1 + ', label=' + this.label_1 + ', details=' + this.details_1 + ', lat=' + this.lat_1 + ', lon=' + this.lon_1 + ', kind=' + this.kind_1.toString() + ', agentType=' + this.agentType_1 + ')';
  };
  protoOf(MapPoint).hashCode = function () {
    var result = getStringHashCode(this.id_1);
    result = imul(result, 31) + getStringHashCode(this.label_1) | 0;
    result = imul(result, 31) + getStringHashCode(this.details_1) | 0;
    result = imul(result, 31) + getNumberHashCode(this.lat_1) | 0;
    result = imul(result, 31) + getNumberHashCode(this.lon_1) | 0;
    result = imul(result, 31) + this.kind_1.hashCode() | 0;
    result = imul(result, 31) + (this.agentType_1 == null ? 0 : getStringHashCode(this.agentType_1)) | 0;
    return result;
  };
  protoOf(MapPoint).equals = function (other) {
    if (this === other)
      return true;
    if (!(other instanceof MapPoint))
      return false;
    var tmp0_other_with_cast = other instanceof MapPoint ? other : THROW_CCE();
    if (!(this.id_1 === tmp0_other_with_cast.id_1))
      return false;
    if (!(this.label_1 === tmp0_other_with_cast.label_1))
      return false;
    if (!(this.details_1 === tmp0_other_with_cast.details_1))
      return false;
    if (!equals(this.lat_1, tmp0_other_with_cast.lat_1))
      return false;
    if (!equals(this.lon_1, tmp0_other_with_cast.lon_1))
      return false;
    if (!this.kind_1.equals(tmp0_other_with_cast.kind_1))
      return false;
    if (!(this.agentType_1 == tmp0_other_with_cast.agentType_1))
      return false;
    return true;
  };
  var MapRangePurpose_PACKAGE_PICKUP_instance;
  var MapRangePurpose_INTER_STATION_instance;
  function values_0() {
    return [MapRangePurpose_PACKAGE_PICKUP_getInstance(), MapRangePurpose_INTER_STATION_getInstance()];
  }
  function valueOf_0(value) {
    switch (value) {
      case 'PACKAGE_PICKUP':
        return MapRangePurpose_PACKAGE_PICKUP_getInstance();
      case 'INTER_STATION':
        return MapRangePurpose_INTER_STATION_getInstance();
      default:
        MapRangePurpose_initEntries();
        THROW_IAE('No enum constant value.');
        break;
    }
  }
  function get_entries_0() {
    if ($ENTRIES_0 == null)
      $ENTRIES_0 = enumEntries(values_0());
    return $ENTRIES_0;
  }
  var MapRangePurpose_entriesInitialized;
  function MapRangePurpose_initEntries() {
    if (MapRangePurpose_entriesInitialized)
      return Unit_getInstance();
    MapRangePurpose_entriesInitialized = true;
    MapRangePurpose_PACKAGE_PICKUP_instance = new MapRangePurpose('PACKAGE_PICKUP', 0);
    MapRangePurpose_INTER_STATION_instance = new MapRangePurpose('INTER_STATION', 1);
  }
  var $ENTRIES_0;
  function MapRangePurpose(name, ordinal) {
    Enum.call(this, name, ordinal);
  }
  function MapRangeDisc(stationId, vehicleType, purpose, lat, lon, radiusMeters) {
    this.stationId_1 = stationId;
    this.vehicleType_1 = vehicleType;
    this.purpose_1 = purpose;
    this.lat_1 = lat;
    this.lon_1 = lon;
    this.radiusMeters_1 = radiusMeters;
    this.id_1 = this.stationId_1 + '-' + this.vehicleType_1 + '-' + this.purpose_1.get_name_woqyms_k$();
  }
  protoOf(MapRangeDisc).get_stationId_pwojei_k$ = function () {
    return this.stationId_1;
  };
  protoOf(MapRangeDisc).get_vehicleType_he01el_k$ = function () {
    return this.vehicleType_1;
  };
  protoOf(MapRangeDisc).get_purpose_2dpcy3_k$ = function () {
    return this.purpose_1;
  };
  protoOf(MapRangeDisc).get_lat_18j1l6_k$ = function () {
    return this.lat_1;
  };
  protoOf(MapRangeDisc).get_lon_18j19a_k$ = function () {
    return this.lon_1;
  };
  protoOf(MapRangeDisc).get_radiusMeters_5psdiz_k$ = function () {
    return this.radiusMeters_1;
  };
  protoOf(MapRangeDisc).get_id_kntnx8_k$ = function () {
    return this.id_1;
  };
  protoOf(MapRangeDisc).component1_7eebsc_k$ = function () {
    return this.stationId_1;
  };
  protoOf(MapRangeDisc).component2_7eebsb_k$ = function () {
    return this.vehicleType_1;
  };
  protoOf(MapRangeDisc).component3_7eebsa_k$ = function () {
    return this.purpose_1;
  };
  protoOf(MapRangeDisc).component4_7eebs9_k$ = function () {
    return this.lat_1;
  };
  protoOf(MapRangeDisc).component5_7eebs8_k$ = function () {
    return this.lon_1;
  };
  protoOf(MapRangeDisc).component6_7eebs7_k$ = function () {
    return this.radiusMeters_1;
  };
  protoOf(MapRangeDisc).copy_89dru7_k$ = function (stationId, vehicleType, purpose, lat, lon, radiusMeters) {
    return new MapRangeDisc(stationId, vehicleType, purpose, lat, lon, radiusMeters);
  };
  protoOf(MapRangeDisc).copy$default_t4oabh_k$ = function (stationId, vehicleType, purpose, lat, lon, radiusMeters, $super) {
    stationId = stationId === VOID ? this.stationId_1 : stationId;
    vehicleType = vehicleType === VOID ? this.vehicleType_1 : vehicleType;
    purpose = purpose === VOID ? this.purpose_1 : purpose;
    lat = lat === VOID ? this.lat_1 : lat;
    lon = lon === VOID ? this.lon_1 : lon;
    radiusMeters = radiusMeters === VOID ? this.radiusMeters_1 : radiusMeters;
    return $super === VOID ? this.copy_89dru7_k$(stationId, vehicleType, purpose, lat, lon, radiusMeters) : $super.copy_89dru7_k$.call(this, stationId, vehicleType, purpose, lat, lon, radiusMeters);
  };
  protoOf(MapRangeDisc).toString = function () {
    return 'MapRangeDisc(stationId=' + this.stationId_1 + ', vehicleType=' + this.vehicleType_1 + ', purpose=' + this.purpose_1.toString() + ', lat=' + this.lat_1 + ', lon=' + this.lon_1 + ', radiusMeters=' + this.radiusMeters_1 + ')';
  };
  protoOf(MapRangeDisc).hashCode = function () {
    var result = getStringHashCode(this.stationId_1);
    result = imul(result, 31) + getStringHashCode(this.vehicleType_1) | 0;
    result = imul(result, 31) + this.purpose_1.hashCode() | 0;
    result = imul(result, 31) + getNumberHashCode(this.lat_1) | 0;
    result = imul(result, 31) + getNumberHashCode(this.lon_1) | 0;
    result = imul(result, 31) + getNumberHashCode(this.radiusMeters_1) | 0;
    return result;
  };
  protoOf(MapRangeDisc).equals = function (other) {
    if (this === other)
      return true;
    if (!(other instanceof MapRangeDisc))
      return false;
    var tmp0_other_with_cast = other instanceof MapRangeDisc ? other : THROW_CCE();
    if (!(this.stationId_1 === tmp0_other_with_cast.stationId_1))
      return false;
    if (!(this.vehicleType_1 === tmp0_other_with_cast.vehicleType_1))
      return false;
    if (!this.purpose_1.equals(tmp0_other_with_cast.purpose_1))
      return false;
    if (!equals(this.lat_1, tmp0_other_with_cast.lat_1))
      return false;
    if (!equals(this.lon_1, tmp0_other_with_cast.lon_1))
      return false;
    if (!equals(this.radiusMeters_1, tmp0_other_with_cast.radiusMeters_1))
      return false;
    return true;
  };
  var MapPointKind_STATION_instance;
  var MapPointKind_AGENT_instance;
  var MapPointKind_PACKAGE_instance;
  function values_1() {
    return [MapPointKind_STATION_getInstance(), MapPointKind_AGENT_getInstance(), MapPointKind_PACKAGE_getInstance()];
  }
  function valueOf_1(value) {
    switch (value) {
      case 'STATION':
        return MapPointKind_STATION_getInstance();
      case 'AGENT':
        return MapPointKind_AGENT_getInstance();
      case 'PACKAGE':
        return MapPointKind_PACKAGE_getInstance();
      default:
        MapPointKind_initEntries();
        THROW_IAE('No enum constant value.');
        break;
    }
  }
  function get_entries_1() {
    if ($ENTRIES_1 == null)
      $ENTRIES_1 = enumEntries(values_1());
    return $ENTRIES_1;
  }
  var MapPointKind_entriesInitialized;
  function MapPointKind_initEntries() {
    if (MapPointKind_entriesInitialized)
      return Unit_getInstance();
    MapPointKind_entriesInitialized = true;
    MapPointKind_STATION_instance = new MapPointKind('STATION', 0);
    MapPointKind_AGENT_instance = new MapPointKind('AGENT', 1);
    MapPointKind_PACKAGE_instance = new MapPointKind('PACKAGE', 2);
  }
  var $ENTRIES_1;
  function MapPointKind(name, ordinal) {
    Enum.call(this, name, ordinal);
  }
  function MapBounds(refLat, refLon, halfSpanEastMeters, halfSpanNorthMeters, metersPerUnit, width, height, padding) {
    this.refLat_1 = refLat;
    this.refLon_1 = refLon;
    this.halfSpanEastMeters_1 = halfSpanEastMeters;
    this.halfSpanNorthMeters_1 = halfSpanNorthMeters;
    this.metersPerUnit_1 = metersPerUnit;
    this.width_1 = width;
    this.height_1 = height;
    this.padding_1 = padding;
  }
  protoOf(MapBounds).get_refLat_iy6zv9_k$ = function () {
    return this.refLat_1;
  };
  protoOf(MapBounds).get_refLon_iy7075_k$ = function () {
    return this.refLon_1;
  };
  protoOf(MapBounds).get_halfSpanEastMeters_u3l7u5_k$ = function () {
    return this.halfSpanEastMeters_1;
  };
  protoOf(MapBounds).get_halfSpanNorthMeters_uqdkyf_k$ = function () {
    return this.halfSpanNorthMeters_1;
  };
  protoOf(MapBounds).get_metersPerUnit_nzl5f2_k$ = function () {
    return this.metersPerUnit_1;
  };
  protoOf(MapBounds).get_width_j0q4yl_k$ = function () {
    return this.width_1;
  };
  protoOf(MapBounds).get_height_e7t92o_k$ = function () {
    return this.height_1;
  };
  protoOf(MapBounds).get_padding_c2ipjs_k$ = function () {
    return this.padding_1;
  };
  protoOf(MapBounds).get_centerWorldX_5jvnyc_k$ = function () {
    return this.width_1 / 2.0;
  };
  protoOf(MapBounds).get_centerWorldY_5jvnyd_k$ = function () {
    return this.height_1 / 2.0;
  };
  protoOf(MapBounds).component1_7eebsc_k$ = function () {
    return this.refLat_1;
  };
  protoOf(MapBounds).component2_7eebsb_k$ = function () {
    return this.refLon_1;
  };
  protoOf(MapBounds).component3_7eebsa_k$ = function () {
    return this.halfSpanEastMeters_1;
  };
  protoOf(MapBounds).component4_7eebs9_k$ = function () {
    return this.halfSpanNorthMeters_1;
  };
  protoOf(MapBounds).component5_7eebs8_k$ = function () {
    return this.metersPerUnit_1;
  };
  protoOf(MapBounds).component6_7eebs7_k$ = function () {
    return this.width_1;
  };
  protoOf(MapBounds).component7_7eebs6_k$ = function () {
    return this.height_1;
  };
  protoOf(MapBounds).component8_7eebs5_k$ = function () {
    return this.padding_1;
  };
  protoOf(MapBounds).copy_a2jwj9_k$ = function (refLat, refLon, halfSpanEastMeters, halfSpanNorthMeters, metersPerUnit, width, height, padding) {
    return new MapBounds(refLat, refLon, halfSpanEastMeters, halfSpanNorthMeters, metersPerUnit, width, height, padding);
  };
  protoOf(MapBounds).copy$default_lutp5g_k$ = function (refLat, refLon, halfSpanEastMeters, halfSpanNorthMeters, metersPerUnit, width, height, padding, $super) {
    refLat = refLat === VOID ? this.refLat_1 : refLat;
    refLon = refLon === VOID ? this.refLon_1 : refLon;
    halfSpanEastMeters = halfSpanEastMeters === VOID ? this.halfSpanEastMeters_1 : halfSpanEastMeters;
    halfSpanNorthMeters = halfSpanNorthMeters === VOID ? this.halfSpanNorthMeters_1 : halfSpanNorthMeters;
    metersPerUnit = metersPerUnit === VOID ? this.metersPerUnit_1 : metersPerUnit;
    width = width === VOID ? this.width_1 : width;
    height = height === VOID ? this.height_1 : height;
    padding = padding === VOID ? this.padding_1 : padding;
    return $super === VOID ? this.copy_a2jwj9_k$(refLat, refLon, halfSpanEastMeters, halfSpanNorthMeters, metersPerUnit, width, height, padding) : $super.copy_a2jwj9_k$.call(this, refLat, refLon, halfSpanEastMeters, halfSpanNorthMeters, metersPerUnit, width, height, padding);
  };
  protoOf(MapBounds).toString = function () {
    return 'MapBounds(refLat=' + this.refLat_1 + ', refLon=' + this.refLon_1 + ', halfSpanEastMeters=' + this.halfSpanEastMeters_1 + ', halfSpanNorthMeters=' + this.halfSpanNorthMeters_1 + ', metersPerUnit=' + this.metersPerUnit_1 + ', width=' + this.width_1 + ', height=' + this.height_1 + ', padding=' + this.padding_1 + ')';
  };
  protoOf(MapBounds).hashCode = function () {
    var result = getNumberHashCode(this.refLat_1);
    result = imul(result, 31) + getNumberHashCode(this.refLon_1) | 0;
    result = imul(result, 31) + getNumberHashCode(this.halfSpanEastMeters_1) | 0;
    result = imul(result, 31) + getNumberHashCode(this.halfSpanNorthMeters_1) | 0;
    result = imul(result, 31) + getNumberHashCode(this.metersPerUnit_1) | 0;
    result = imul(result, 31) + getNumberHashCode(this.width_1) | 0;
    result = imul(result, 31) + getNumberHashCode(this.height_1) | 0;
    result = imul(result, 31) + getNumberHashCode(this.padding_1) | 0;
    return result;
  };
  protoOf(MapBounds).equals = function (other) {
    if (this === other)
      return true;
    if (!(other instanceof MapBounds))
      return false;
    var tmp0_other_with_cast = other instanceof MapBounds ? other : THROW_CCE();
    if (!equals(this.refLat_1, tmp0_other_with_cast.refLat_1))
      return false;
    if (!equals(this.refLon_1, tmp0_other_with_cast.refLon_1))
      return false;
    if (!equals(this.halfSpanEastMeters_1, tmp0_other_with_cast.halfSpanEastMeters_1))
      return false;
    if (!equals(this.halfSpanNorthMeters_1, tmp0_other_with_cast.halfSpanNorthMeters_1))
      return false;
    if (!equals(this.metersPerUnit_1, tmp0_other_with_cast.metersPerUnit_1))
      return false;
    if (!equals(this.width_1, tmp0_other_with_cast.width_1))
      return false;
    if (!equals(this.height_1, tmp0_other_with_cast.height_1))
      return false;
    if (!equals(this.padding_1, tmp0_other_with_cast.padding_1))
      return false;
    return true;
  };
  function GeoCoord(lat, lon) {
    this.lat_1 = lat;
    this.lon_1 = lon;
  }
  protoOf(GeoCoord).get_lat_18j1l6_k$ = function () {
    return this.lat_1;
  };
  protoOf(GeoCoord).get_lon_18j19a_k$ = function () {
    return this.lon_1;
  };
  protoOf(GeoCoord).component1_7eebsc_k$ = function () {
    return this.lat_1;
  };
  protoOf(GeoCoord).component2_7eebsb_k$ = function () {
    return this.lon_1;
  };
  protoOf(GeoCoord).copy_6r5gqz_k$ = function (lat, lon) {
    return new GeoCoord(lat, lon);
  };
  protoOf(GeoCoord).copy$default_isf4ud_k$ = function (lat, lon, $super) {
    lat = lat === VOID ? this.lat_1 : lat;
    lon = lon === VOID ? this.lon_1 : lon;
    return $super === VOID ? this.copy_6r5gqz_k$(lat, lon) : $super.copy_6r5gqz_k$.call(this, lat, lon);
  };
  protoOf(GeoCoord).toString = function () {
    return 'GeoCoord(lat=' + this.lat_1 + ', lon=' + this.lon_1 + ')';
  };
  protoOf(GeoCoord).hashCode = function () {
    var result = getNumberHashCode(this.lat_1);
    result = imul(result, 31) + getNumberHashCode(this.lon_1) | 0;
    return result;
  };
  protoOf(GeoCoord).equals = function (other) {
    if (this === other)
      return true;
    if (!(other instanceof GeoCoord))
      return false;
    var tmp0_other_with_cast = other instanceof GeoCoord ? other : THROW_CCE();
    if (!equals(this.lat_1, tmp0_other_with_cast.lat_1))
      return false;
    if (!equals(this.lon_1, tmp0_other_with_cast.lon_1))
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
    if (!a.get_purpose_2dpcy3_k$().equals(b.get_purpose_2dpcy3_k$()))
      return false;
    var gap = geoDistanceMeters(a.get_lat_18j1l6_k$(), a.get_lon_18j19a_k$(), b.get_lat_18j1l6_k$(), b.get_lon_18j19a_k$());
    return gap < a.get_radiusMeters_5psdiz_k$() + b.get_radiusMeters_5psdiz_k$() - 0.5;
  }
  function clusterOverlappingRangeDiscs(discs) {
    _init_properties_MapRangeClusters_kt__tnfwli();
    if (discs.isEmpty_y1axqb_k$())
      return emptyList();
    if (discs.get_size_woubt6_k$() === 1)
      return listOf_0(discs);
    var tmp = 0;
    var tmp_0 = discs.get_size_woubt6_k$();
    var tmp_1 = new Int32Array(tmp_0);
    while (tmp < tmp_0) {
      var tmp_2 = tmp;
      tmp_1[tmp_2] = tmp_2;
      tmp = tmp + 1 | 0;
    }
    var parent = tmp_1;
    var inductionVariable = 0;
    var last = discs.get_size_woubt6_k$() - 1 | 0;
    if (inductionVariable <= last)
      do {
        var i = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        var inductionVariable_0 = i + 1 | 0;
        var last_0 = discs.get_size_woubt6_k$();
        if (inductionVariable_0 < last_0)
          do {
            var j = inductionVariable_0;
            inductionVariable_0 = inductionVariable_0 + 1 | 0;
            if (rangeDiscsOverlap(discs.get_c1px32_k$(i), discs.get_c1px32_k$(j))) {
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
    var inductionVariable_1 = this_0.get_first_irdx8n_k$();
    var last_1 = this_0.get_last_wopotb_k$();
    if (inductionVariable_1 <= last_1)
      do {
        var element = inductionVariable_1;
        inductionVariable_1 = inductionVariable_1 + 1 | 0;
        // Inline function 'pl.edu.wat.uavlogistics.frontend.model.clusterOverlappingRangeDiscs.<anonymous>' call
        var it = element;
        var key = clusterOverlappingRangeDiscs$find(parent, it);
        // Inline function 'kotlin.collections.getOrPut' call
        var value = destination.get_wei43m_k$(key);
        var tmp_3;
        if (value == null) {
          // Inline function 'kotlin.collections.groupByTo.<anonymous>' call
          var answer = ArrayList_init_$Create$();
          destination.put_4fpzoq_k$(key, answer);
          tmp_3 = answer;
        } else {
          tmp_3 = value;
        }
        var list = tmp_3;
        list.add_utx5q5_k$(element);
      }
       while (!(element === last_1));
    var this_1 = destination.get_values_ksazhn_k$();
    // Inline function 'kotlin.collections.mapTo' call
    var destination_0 = ArrayList_init_$Create$_0(collectionSizeOrDefault(this_1, 10));
    var tmp0_iterator = this_1.iterator_jk1svi_k$();
    while (tmp0_iterator.hasNext_bitz1p_k$()) {
      var item = tmp0_iterator.next_20eer_k$();
      // Inline function 'pl.edu.wat.uavlogistics.frontend.model.clusterOverlappingRangeDiscs.<anonymous>' call
      // Inline function 'kotlin.collections.map' call
      // Inline function 'kotlin.collections.mapTo' call
      var destination_1 = ArrayList_init_$Create$_0(collectionSizeOrDefault(item, 10));
      var tmp0_iterator_0 = item.iterator_jk1svi_k$();
      while (tmp0_iterator_0.hasNext_bitz1p_k$()) {
        var item_0 = tmp0_iterator_0.next_20eer_k$();
        // Inline function 'pl.edu.wat.uavlogistics.frontend.model.clusterOverlappingRangeDiscs.<anonymous>.<anonymous>' call
        var tmp$ret$6 = discs.get_c1px32_k$(item_0);
        destination_1.add_utx5q5_k$(tmp$ret$6);
      }
      destination_0.add_utx5q5_k$(destination_1);
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
  function get_REBALANCE_SYSTEM_SHIPMENT_ID() {
    return REBALANCE_SYSTEM_SHIPMENT_ID;
  }
  var REBALANCE_SYSTEM_SHIPMENT_ID;
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
  function isCustomerShipment(shipment) {
    _init_properties_NetworkFilters_kt__fc2jw3();
    var tmp = shipment.id;
    return !(((!(tmp == null) ? typeof tmp === 'string' : false) ? tmp : null) === '00000000-0000-4000-8000-000000000001');
  }
  function customerShipments(shipments) {
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
      // Inline function 'pl.edu.wat.uavlogistics.frontend.model.customerShipments.<anonymous>' call
      if (isCustomerShipment(element)) {
        destination.add_utx5q5_k$(element);
      }
    }
    return destination;
  }
  function taskKind(task) {
    _init_properties_NetworkFilters_kt__fc2jw3();
    var kind = statusString(task.kind);
    // Inline function 'kotlin.text.ifEmpty' call
    // Inline function 'kotlin.contracts.contract' call
    var tmp;
    // Inline function 'kotlin.text.isEmpty' call
    if (charSequenceLength(kind) === 0) {
      // Inline function 'pl.edu.wat.uavlogistics.frontend.model.taskKind.<anonymous>' call
      tmp = 'PACKAGE';
    } else {
      tmp = kind;
    }
    return tmp;
  }
  function isPackageTask(task) {
    _init_properties_NetworkFilters_kt__fc2jw3();
    return taskKind(task) === 'PACKAGE';
  }
  function isStagingTask(task) {
    _init_properties_NetworkFilters_kt__fc2jw3();
    return taskKind(task) === 'STAGING';
  }
  function isRebalanceTask(task) {
    _init_properties_NetworkFilters_kt__fc2jw3();
    return taskKind(task) === 'REBALANCE';
  }
  function isInactiveShipment(shipment) {
    _init_properties_NetworkFilters_kt__fc2jw3();
    return get_INACTIVE_SHIPMENT_STATUSES().contains_aljjnj_k$(statusString(shipment.status));
  }
  function isInactiveTask(task, shipments) {
    _init_properties_NetworkFilters_kt__fc2jw3();
    if (get_INACTIVE_TASK_STATUSES().contains_aljjnj_k$(statusString(task.status)))
      return true;
    if (!isPackageTask(task))
      return false;
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
    var this_0 = customerShipments(shipments);
    var destination = ArrayList_init_$Create$();
    var tmp0_iterator = this_0.iterator_jk1svi_k$();
    while (tmp0_iterator.hasNext_bitz1p_k$()) {
      var element = tmp0_iterator.next_20eer_k$();
      // Inline function 'pl.edu.wat.uavlogistics.frontend.model.activeShipments.<anonymous>' call
      if (!isInactiveShipment(element)) {
        destination.add_utx5q5_k$(element);
      }
    }
    return destination;
  }
  function inactiveShipments(shipments) {
    _init_properties_NetworkFilters_kt__fc2jw3();
    // Inline function 'kotlin.collections.filter' call
    // Inline function 'kotlin.collections.filterTo' call
    var this_0 = customerShipments(shipments);
    var destination = ArrayList_init_$Create$();
    var tmp0_iterator = this_0.iterator_jk1svi_k$();
    while (tmp0_iterator.hasNext_bitz1p_k$()) {
      var element = tmp0_iterator.next_20eer_k$();
      // Inline function 'pl.edu.wat.uavlogistics.frontend.model.inactiveShipments.<anonymous>' call
      if (isInactiveShipment(element)) {
        destination.add_utx5q5_k$(element);
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
        destination.add_utx5q5_k$(element);
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
        destination.add_utx5q5_k$(element);
      }
    }
    return destination;
  }
  function inactivePackageTasks(tasks, shipments) {
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
      // Inline function 'pl.edu.wat.uavlogistics.frontend.model.inactivePackageTasks.<anonymous>' call
      if (isPackageTask(element) && isInactiveTask(element, shipmentList)) {
        destination.add_utx5q5_k$(element);
      }
    }
    return destination;
  }
  function inactiveStagingTasks(tasks) {
    _init_properties_NetworkFilters_kt__fc2jw3();
    // Inline function 'kotlin.collections.filter' call
    // Inline function 'kotlin.collections.filterTo' call
    var this_0 = dynamicArray(tasks);
    var destination = ArrayList_init_$Create$();
    var inductionVariable = 0;
    var last = this_0.length;
    while (inductionVariable < last) {
      var element = this_0[inductionVariable];
      inductionVariable = inductionVariable + 1 | 0;
      // Inline function 'pl.edu.wat.uavlogistics.frontend.model.inactiveStagingTasks.<anonymous>' call
      if (isStagingTask(element) && get_INACTIVE_TASK_STATUSES().contains_aljjnj_k$(statusString(element.status))) {
        destination.add_utx5q5_k$(element);
      }
    }
    return destination;
  }
  function inactiveRebalanceTasks(tasks) {
    _init_properties_NetworkFilters_kt__fc2jw3();
    // Inline function 'kotlin.collections.filter' call
    // Inline function 'kotlin.collections.filterTo' call
    var this_0 = dynamicArray(tasks);
    var destination = ArrayList_init_$Create$();
    var inductionVariable = 0;
    var last = this_0.length;
    while (inductionVariable < last) {
      var element = this_0[inductionVariable];
      inductionVariable = inductionVariable + 1 | 0;
      // Inline function 'pl.edu.wat.uavlogistics.frontend.model.inactiveRebalanceTasks.<anonymous>' call
      if (isRebalanceTask(element) && get_INACTIVE_TASK_STATUSES().contains_aljjnj_k$(statusString(element.status))) {
        destination.add_utx5q5_k$(element);
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
      var serviceTypes = AgentRangeSettings_getInstance().registeredVehicleTypes_sf4dhr_k$(state.agents);
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
      this_0.append_22ad7x_k$(value).append_am5a4z_k$(_Char___init__impl__6a9atx(10));
      // Inline function 'kotlin.text.appendLine' call
      var value_0 = 'Status: ' + element.status;
      // Inline function 'kotlin.text.appendLine' call
      this_0.append_22ad7x_k$(value_0).append_am5a4z_k$(_Char___init__impl__6a9atx(10));
      // Inline function 'kotlin.text.appendLine' call
      var value_1 = 'Storage: ' + element.occupiedStorage + '/' + element.storageCapacity;
      // Inline function 'kotlin.text.appendLine' call
      this_0.append_22ad7x_k$(value_1).append_am5a4z_k$(_Char___init__impl__6a9atx(10));
      // Inline function 'kotlin.text.appendLine' call
      var value_2 = 'Parking: ' + element.occupiedParking + '/' + element.parkingCapacity;
      // Inline function 'kotlin.text.appendLine' call
      this_0.append_22ad7x_k$(value_2).append_am5a4z_k$(_Char___init__impl__6a9atx(10));
      // Inline function 'kotlin.collections.forEach' call
      var tmp0_iterator = serviceTypes.iterator_jk1svi_k$();
      while (tmp0_iterator.hasNext_bitz1p_k$()) {
        var element_0 = tmp0_iterator.next_20eer_k$();
        // Inline function 'pl.edu.wat.uavlogistics.frontend.model.networkToMapPoints.<anonymous>.<anonymous>.<anonymous>' call
        var maxRange = numberToInt(AgentRangeSettings_getInstance().displayMaxRangeMeters_56fz2t_k$(element_0, state.agents));
        var pickup = numberToInt(AgentRangeSettings_getInstance().packagePickupRadiusMeters_4td6uu_k$(element_0, maxRange));
        var rebalanceHop = numberToInt(AgentRangeSettings_getInstance().rebalanceHopRadiusMeters_vpyf12_k$(maxRange));
        var hubDrive = numberToInt(AgentRangeSettings_getInstance().interStationRadiusMeters_9a67xc_k$(element_0, maxRange));
        // Inline function 'kotlin.text.appendLine' call
        var value_3 = element_0 + ' package pickup radius: ' + pickup + ' m';
        // Inline function 'kotlin.text.appendLine' call
        this_0.append_22ad7x_k$(value_3).append_am5a4z_k$(_Char___init__impl__6a9atx(10));
        // Inline function 'kotlin.text.appendLine' call
        var value_4 = element_0 + ' one-hop rebalance reach: ' + rebalanceHop + ' m';
        // Inline function 'kotlin.text.appendLine' call
        this_0.append_22ad7x_k$(value_4).append_am5a4z_k$(_Char___init__impl__6a9atx(10));
        // Inline function 'kotlin.text.appendLine' call
        var value_5 = element_0 + ' hub-drive radius (with reserve): ' + hubDrive + ' m';
        // Inline function 'kotlin.text.appendLine' call
        this_0.append_22ad7x_k$(value_5).append_am5a4z_k$(_Char___init__impl__6a9atx(10));
        // Inline function 'kotlin.text.appendLine' call
        var value_6 = element_0 + ' max range (registered fleet): ' + maxRange + ' m';
        // Inline function 'kotlin.text.appendLine' call
        this_0.append_22ad7x_k$(value_6).append_am5a4z_k$(_Char___init__impl__6a9atx(10));
      }
      this_0.append_22ad7x_k$('Position: ' + formatCoord(lat) + ', ' + formatCoord(lon));
      var tmp$ret$18 = this_0.toString();
      var element_1 = new MapPoint(stationId, tmp_1, tmp$ret$18, lat, lon, MapPointKind_STATION_getInstance());
      points.add_utx5q5_k$(element_1);
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
      var value_7 = (!(tmp_7 == null) ? typeof tmp_7 === 'string' : false) ? tmp_7 : THROW_CCE();
      // Inline function 'kotlin.text.appendLine' call
      this_1.append_22ad7x_k$(value_7).append_am5a4z_k$(_Char___init__impl__6a9atx(10));
      // Inline function 'kotlin.text.appendLine' call
      var value_8 = 'Type: ' + element_2.type + ' \xB7 Status: ' + element_2.status;
      // Inline function 'kotlin.text.appendLine' call
      this_1.append_22ad7x_k$(value_8).append_am5a4z_k$(_Char___init__impl__6a9atx(10));
      // Inline function 'kotlin.text.appendLine' call
      var value_9 = 'Energy: ' + number(element_2.energyLevelPercent) + '%';
      // Inline function 'kotlin.text.appendLine' call
      this_1.append_22ad7x_k$(value_9).append_am5a4z_k$(_Char___init__impl__6a9atx(10));
      var tmp_8 = element_2.type;
      var agentType = (!(tmp_8 == null) ? typeof tmp_8 === 'string' : false) ? tmp_8 : THROW_CCE();
      var agentMaxRange = number(element_2.maxRangeMeters);
      var agentMax = numberToInt(agentMaxRange);
      var pickup_0 = numberToInt(AgentRangeSettings_getInstance().packagePickupRadiusMeters_4td6uu_k$(agentType, agentMaxRange));
      var rebalanceHop_0 = numberToInt(AgentRangeSettings_getInstance().rebalanceHopRadiusMeters_vpyf12_k$(agentMaxRange));
      var hubDrive_0 = numberToInt(AgentRangeSettings_getInstance().interStationRadiusMeters_9a67xc_k$(agentType, agentMaxRange));
      // Inline function 'kotlin.text.appendLine' call
      var value_10 = agentType + ' package pickup radius: ' + pickup_0 + ' m';
      // Inline function 'kotlin.text.appendLine' call
      this_1.append_22ad7x_k$(value_10).append_am5a4z_k$(_Char___init__impl__6a9atx(10));
      // Inline function 'kotlin.text.appendLine' call
      var value_11 = agentType + ' one-hop rebalance reach: ' + rebalanceHop_0 + ' m';
      // Inline function 'kotlin.text.appendLine' call
      this_1.append_22ad7x_k$(value_11).append_am5a4z_k$(_Char___init__impl__6a9atx(10));
      // Inline function 'kotlin.text.appendLine' call
      var value_12 = agentType + ' hub-drive radius (with reserve): ' + hubDrive_0 + ' m';
      // Inline function 'kotlin.text.appendLine' call
      this_1.append_22ad7x_k$(value_12).append_am5a4z_k$(_Char___init__impl__6a9atx(10));
      // Inline function 'kotlin.text.appendLine' call
      var value_13 = agentType + ' max range: ' + agentMax + ' m';
      // Inline function 'kotlin.text.appendLine' call
      this_1.append_22ad7x_k$(value_13).append_am5a4z_k$(_Char___init__impl__6a9atx(10));
      // Inline function 'kotlin.text.appendLine' call
      var tmp0_elvis_lhs = element_2.currentStationId;
      var value_14 = 'Station: ' + (tmp0_elvis_lhs == null ? '\u2014' : tmp0_elvis_lhs);
      // Inline function 'kotlin.text.appendLine' call
      this_1.append_22ad7x_k$(value_14).append_am5a4z_k$(_Char___init__impl__6a9atx(10));
      this_1.append_22ad7x_k$('Position: ' + formatCoord(lat_0) + ', ' + formatCoord(lon_0));
      var tmp_9 = this_1.toString();
      var tmp_10 = MapPointKind_AGENT_getInstance();
      var tmp_11 = element_2.type;
      var element_3 = new MapPoint(tmp_4, tmp_6, tmp_9, lat_0, lon_0, tmp_10, (!(tmp_11 == null) ? typeof tmp_11 === 'string' : false) ? tmp_11 : THROW_CCE());
      points.add_utx5q5_k$(element_3);
    }
    // Inline function 'kotlin.collections.forEach' call
    var inductionVariable_1 = 0;
    var last_1 = shipments.length;
    while (inductionVariable_1 < last_1) {
      var element_4 = shipments[inductionVariable_1];
      inductionVariable_1 = inductionVariable_1 + 1 | 0;
      $l$block_0: {
        // Inline function 'pl.edu.wat.uavlogistics.frontend.model.networkToMapPoints.<anonymous>' call
        if (!isCustomerShipment(element_4)) {
          break $l$block_0;
        }
        if (isInactiveShipment(element_4)) {
          break $l$block_0;
        }
        var status = statusString(element_4.status);
        var _destruct__k2r9zo = shipmentPosition(element_4, stations, agents);
        var lat_1 = _destruct__k2r9zo.component1_7eebsc_k$();
        var lon_1 = _destruct__k2r9zo.component2_7eebsb_k$();
        // Inline function 'kotlin.collections.plusAssign' call
        var tmp_12 = element_4.id;
        var tmp_13 = (!(tmp_12 == null) ? typeof tmp_12 === 'string' : false) ? tmp_12 : THROW_CCE();
        var tmp_14 = element_4.id;
        var element_5 = new MapPoint(tmp_13, shortId((!(tmp_14 == null) ? typeof tmp_14 === 'string' : false) ? tmp_14 : THROW_CCE()) + ' \xB7 ' + status, packageDetails(element_4, lat_1, lon_1), lat_1, lon_1, MapPointKind_PACKAGE_getInstance());
        points.add_utx5q5_k$(element_5);
      }
    }
    return points;
  }
  function networkToStationRangeDiscs(state) {
    // Inline function 'kotlin.collections.mutableListOf' call
    var discs = ArrayList_init_$Create$();
    var agents = state.agents;
    var vehicleTypes = AgentRangeSettings_getInstance().registeredVehicleTypes_sf4dhr_k$(agents);
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
        var tmp0_iterator = vehicleTypes.iterator_jk1svi_k$();
        while (tmp0_iterator.hasNext_bitz1p_k$()) {
          var element_0 = tmp0_iterator.next_20eer_k$();
          $l$block_0: {
            // Inline function 'pl.edu.wat.uavlogistics.frontend.model.networkToStationRangeDiscs.<anonymous>.<anonymous>' call
            var tmp0_elvis_lhs = AgentRangeSettings_getInstance().maxRangeMetersFromAgents_gd3h33_k$(agents, element_0);
            var tmp_1;
            if (tmp0_elvis_lhs == null) {
              break $l$block_0;
            } else {
              tmp_1 = tmp0_elvis_lhs;
            }
            var maxRange = tmp_1;
            // Inline function 'kotlin.collections.forEach' call
            var tmp0_iterator_0 = listOf([to(MapRangePurpose_INTER_STATION_getInstance(), AgentRangeSettings_getInstance().rebalanceHopRadiusMeters_vpyf12_k$(maxRange)), to(MapRangePurpose_PACKAGE_PICKUP_getInstance(), AgentRangeSettings_getInstance().packagePickupRadiusMeters_4td6uu_k$(element_0, maxRange))]).iterator_jk1svi_k$();
            while (tmp0_iterator_0.hasNext_bitz1p_k$()) {
              var element_1 = tmp0_iterator_0.next_20eer_k$();
              $l$block_1: {
                // Inline function 'pl.edu.wat.uavlogistics.frontend.model.networkToStationRangeDiscs.<anonymous>.<anonymous>.<anonymous>' call
                var purpose = element_1.component1_7eebsc_k$();
                var radiusMeters = element_1.component2_7eebsb_k$();
                if (radiusMeters <= 0.0) {
                  break $l$block_1;
                }
                // Inline function 'kotlin.collections.plusAssign' call
                var element_2 = new MapRangeDisc(stationId, element_0, purpose, lat, lon, radiusMeters);
                discs.add_utx5q5_k$(element_2);
              }
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
    this_0.append_22ad7x_k$(value).append_am5a4z_k$(_Char___init__impl__6a9atx(10));
    // Inline function 'kotlin.text.appendLine' call
    var value_0 = 'Status: ' + shipment.status;
    // Inline function 'kotlin.text.appendLine' call
    this_0.append_22ad7x_k$(value_0).append_am5a4z_k$(_Char___init__impl__6a9atx(10));
    // Inline function 'kotlin.text.appendLine' call
    var value_1 = 'Customer: ' + shipment.customerId;
    // Inline function 'kotlin.text.appendLine' call
    this_0.append_22ad7x_k$(value_1).append_am5a4z_k$(_Char___init__impl__6a9atx(10));
    var tmp_0 = shipment.carryingAgentId;
    var carrier = (tmp_0 == null ? true : typeof tmp_0 === 'string') ? tmp_0 : THROW_CCE();
    if (!(carrier == null)) {
      // Inline function 'kotlin.text.appendLine' call
      var value_2 = 'Carrier: ' + carrier;
      // Inline function 'kotlin.text.appendLine' call
      this_0.append_22ad7x_k$(value_2).append_am5a4z_k$(_Char___init__impl__6a9atx(10));
    }
    var tmp_1 = shipment.currentStationId;
    var stationId = (tmp_1 == null ? true : typeof tmp_1 === 'string') ? tmp_1 : THROW_CCE();
    if (!(stationId == null)) {
      // Inline function 'kotlin.text.appendLine' call
      var value_3 = 'At station: ' + stationId;
      // Inline function 'kotlin.text.appendLine' call
      this_0.append_22ad7x_k$(value_3).append_am5a4z_k$(_Char___init__impl__6a9atx(10));
    }
    // Inline function 'kotlin.text.appendLine' call
    var value_4 = 'Origin: ' + coord_0(shipment.origin);
    // Inline function 'kotlin.text.appendLine' call
    this_0.append_22ad7x_k$(value_4).append_am5a4z_k$(_Char___init__impl__6a9atx(10));
    // Inline function 'kotlin.text.appendLine' call
    var value_5 = 'Destination: ' + coord_0(shipment.destination);
    // Inline function 'kotlin.text.appendLine' call
    this_0.append_22ad7x_k$(value_5).append_am5a4z_k$(_Char___init__impl__6a9atx(10));
    this_0.append_22ad7x_k$('Shown at: ' + formatCoord(lat) + ', ' + formatCoord(lon));
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
    var tmp = new $submitStationCOROUTINE$4($this, backendUrl, $completion);
    tmp.set_result_xj64lm_k$(Unit_getInstance());
    tmp.set_exception_px07aa_k$(null);
    return tmp.doResume_5yljmg_k$();
  }
  function submitAgent($this, backendUrl, $completion) {
    var tmp = new $submitAgentCOROUTINE$5($this, backendUrl, $completion);
    tmp.set_result_xj64lm_k$(Unit_getInstance());
    tmp.set_exception_px07aa_k$(null);
    return tmp.doResume_5yljmg_k$();
  }
  function submitPackage($this, backendUrl, $completion) {
    var tmp0_elvis_lhs = toDoubleOrNull($this.destLat_1);
    var tmp;
    if (tmp0_elvis_lhs == null) {
      throw IllegalArgumentException_init_$Create$('Destination latitude is invalid.');
    } else {
      tmp = tmp0_elvis_lhs;
    }
    var destLatValue = tmp;
    var tmp1_elvis_lhs = toDoubleOrNull($this.destLon_1);
    var tmp_0;
    if (tmp1_elvis_lhs == null) {
      throw IllegalArgumentException_init_$Create$('Destination longitude is invalid.');
    } else {
      tmp_0 = tmp1_elvis_lhs;
    }
    var destLonValue = tmp_0;
    var body = ApiClient_getInstance().jsonBody_4314q6_k$([to('customerId', $this.customerId_1), to('senderName', 'Sender'), to('recipientName', 'Recipient'), to('origin', ApiClient_getInstance().jsonObject_af0vtd_k$([to('latitude', $this.coord_1.get_lat_18j1l6_k$()), to('longitude', $this.coord_1.get_lon_18j19a_k$()), to('altitudeMeters', 0.0)])), to('destination', ApiClient_getInstance().jsonObject_af0vtd_k$([to('latitude', destLatValue), to('longitude', destLonValue), to('altitudeMeters', 0.0)])), to('packageSpec', ApiClient_getInstance().jsonObject_af0vtd_k$([to('weightKg', toDouble($this.weightKg_1)), to('volumeM3', toDouble($this.volumeM3__1)), to('requiresGroundTransport', $this.groundTransport_1)]))]);
    return ApiClient_getInstance().request$default_u44nmf_k$(backendUrl, '/api/shipments', 'POST', body, VOID, $completion);
  }
  function $submitCOROUTINE$3(_this__u8e3s4, backendUrl, resultContinuation) {
    CoroutineImpl.call(this, resultContinuation);
    this._this__u8e3s4__1 = _this__u8e3s4;
    this.backendUrl_1 = backendUrl;
  }
  protoOf($submitCOROUTINE$3).doResume_5yljmg_k$ = function () {
    var suspendResult = this.get_result_iyg5d2_k$();
    $sm: do
      try {
        var tmp = this.get_state_iypx7s_k$();
        switch (tmp) {
          case 0:
            this.set_exceptionState_fex74n_k$(5);
            this.tmp0_subject0__1 = this._this__u8e3s4__1.mode_1;
            this.tmp01__1 = this.tmp0_subject0__1.get_ordinal_ip24qg_k$();
            if (this.tmp01__1 === 0) {
              this.set_state_rjd8d0_k$(3);
              suspendResult = submitStation(this._this__u8e3s4__1, this.backendUrl_1, this);
              if (suspendResult === get_COROUTINE_SUSPENDED()) {
                return suspendResult;
              }
              continue $sm;
            } else {
              if (this.tmp01__1 === 2) {
                this.set_state_rjd8d0_k$(2);
                suspendResult = submitAgent(this._this__u8e3s4__1, this.backendUrl_1, this);
                if (suspendResult === get_COROUTINE_SUSPENDED()) {
                  return suspendResult;
                }
                continue $sm;
              } else {
                if (this.tmp01__1 === 1) {
                  this.set_state_rjd8d0_k$(1);
                  suspendResult = submitPackage(this._this__u8e3s4__1, this.backendUrl_1, this);
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
            this.WHEN_RESULT2__1 = suspendResult;
            this.set_state_rjd8d0_k$(4);
            continue $sm;
          case 2:
            this.WHEN_RESULT2__1 = suspendResult;
            this.set_state_rjd8d0_k$(4);
            continue $sm;
          case 3:
            this.WHEN_RESULT2__1 = suspendResult;
            this.set_state_rjd8d0_k$(4);
            continue $sm;
          case 4:
            return this.WHEN_RESULT2__1;
          case 5:
            throw this.get_exception_x0n6w6_k$();
        }
      } catch ($p) {
        var e = $p;
        if (this.get_exceptionState_wflpxn_k$() === 5) {
          throw e;
        } else {
          this.set_state_rjd8d0_k$(this.get_exceptionState_wflpxn_k$());
          this.set_exception_px07aa_k$(e);
        }
      }
     while (true);
  };
  function $submitStationCOROUTINE$4(_this__u8e3s4, backendUrl, resultContinuation) {
    CoroutineImpl.call(this, resultContinuation);
    this._this__u8e3s4__1 = _this__u8e3s4;
    this.backendUrl_1 = backendUrl;
  }
  protoOf($submitStationCOROUTINE$4).doResume_5yljmg_k$ = function () {
    var suspendResult = this.get_result_iyg5d2_k$();
    $sm: do
      try {
        var tmp = this.get_state_iypx7s_k$();
        switch (tmp) {
          case 0:
            this.set_exceptionState_fex74n_k$(4);
            this.body0__1 = ApiClient_getInstance().jsonBody_4314q6_k$([to('id', this._this__u8e3s4__1.stationId_1), to('name', this._this__u8e3s4__1.stationName_1), to('position', ApiClient_getInstance().jsonObject_af0vtd_k$([to('latitude', this._this__u8e3s4__1.coord_1.get_lat_18j1l6_k$()), to('longitude', this._this__u8e3s4__1.coord_1.get_lon_18j19a_k$()), to('altitudeMeters', 0.0)])), to('storageCapacity', toInt(this._this__u8e3s4__1.storageCapacity_1)), to('parkingCapacity', toInt(this._this__u8e3s4__1.parkingCapacity_1))]);
            this.set_state_rjd8d0_k$(1);
            suspendResult = ApiClient_getInstance().request_gu70ny_k$(this.backendUrl_1, '/api/stations', 'POST', this.body0__1, true, this);
            if (suspendResult === get_COROUTINE_SUSPENDED()) {
              return suspendResult;
            }

            continue $sm;
          case 1:
            this.created1__1 = suspendResult;
            if (this._this__u8e3s4__1.activateStation_1) {
              this.set_state_rjd8d0_k$(2);
              suspendResult = ApiClient_getInstance().request$default_u44nmf_k$(this.backendUrl_1, '/api/stations/' + ApiClient_getInstance().pathSegment_ut1190_k$(this._this__u8e3s4__1.stationId_1) + '/activate', 'POST', VOID, true, this);
              if (suspendResult === get_COROUTINE_SUSPENDED()) {
                return suspendResult;
              }
              continue $sm;
            } else {
              var tmp_0 = this;
              tmp_0.WHEN_RESULT2__1 = this.created1__1;
              this.set_state_rjd8d0_k$(3);
              continue $sm;
            }

          case 2:
            var ARGUMENT = suspendResult;
            this.WHEN_RESULT2__1 = this.created1__1 + '\n\n' + ARGUMENT;
            this.set_state_rjd8d0_k$(3);
            continue $sm;
          case 3:
            return this.WHEN_RESULT2__1;
          case 4:
            throw this.get_exception_x0n6w6_k$();
        }
      } catch ($p) {
        var e = $p;
        if (this.get_exceptionState_wflpxn_k$() === 4) {
          throw e;
        } else {
          this.set_state_rjd8d0_k$(this.get_exceptionState_wflpxn_k$());
          this.set_exception_px07aa_k$(e);
        }
      }
     while (true);
  };
  function $submitAgentCOROUTINE$5(_this__u8e3s4, backendUrl, resultContinuation) {
    CoroutineImpl.call(this, resultContinuation);
    this._this__u8e3s4__1 = _this__u8e3s4;
    this.backendUrl_1 = backendUrl;
  }
  protoOf($submitAgentCOROUTINE$5).doResume_5yljmg_k$ = function () {
    var suspendResult = this.get_result_iyg5d2_k$();
    $sm: do
      try {
        var tmp = this.get_state_iypx7s_k$();
        switch (tmp) {
          case 0:
            this.set_exceptionState_fex74n_k$(4);
            var tmp_0 = this;
            var tmp_1 = ApiClient_getInstance();
            var tmp_2 = to('id', this._this__u8e3s4__1.agentId_1);
            var tmp_3 = to('type', this._this__u8e3s4__1.agentType_1);
            var tmp_4 = to('position', ApiClient_getInstance().jsonObject_af0vtd_k$([to('latitude', this._this__u8e3s4__1.coord_1.get_lat_18j1l6_k$()), to('longitude', this._this__u8e3s4__1.coord_1.get_lon_18j19a_k$()), to('altitudeMeters', toDouble(this._this__u8e3s4__1.agentAlt_1))]));
            var tmp_5 = to('energyLevelPercent', 100.0);
            var tmp_6 = to('maxRangeMeters', toDouble(this._this__u8e3s4__1.agentRange_1));
            var tmp_7 = to('payloadCapacityKg', toDouble(this._this__u8e3s4__1.agentPayload_1));
            var this_0 = this._this__u8e3s4__1.agentStationId_1;
            var tmp_8;
            if (isBlank(this_0)) {
              tmp_8 = null;
            } else {
              tmp_8 = this_0;
            }

            tmp_0.body0__1 = tmp_1.jsonBody_4314q6_k$([tmp_2, tmp_3, tmp_4, tmp_5, tmp_6, tmp_7, to('currentStationId', tmp_8), to('runtime', ApiClient_getInstance().jsonObject_af0vtd_k$([to('autoStart', this._this__u8e3s4__1.agentAutoStart_1), to('px4Model', this._this__u8e3s4__1.agentPx4Model_1), to('px4Instance', toInt(this._this__u8e3s4__1.agentPx4Instance_1)), to('mavlinkPort', toInt(this._this__u8e3s4__1.agentMavlinkPort_1)), to('spawnInGazebo', true)]))]);
            this.set_state_rjd8d0_k$(1);
            suspendResult = ApiClient_getInstance().request$default_u44nmf_k$(this.backendUrl_1, '/api/agents', 'POST', this.body0__1, VOID, this);
            if (suspendResult === get_COROUTINE_SUSPENDED()) {
              return suspendResult;
            }

            continue $sm;
          case 1:
            this.registered1__1 = suspendResult;
            if (this._this__u8e3s4__1.activateAgent_1) {
              this.set_state_rjd8d0_k$(2);
              suspendResult = ApiClient_getInstance().request$default_u44nmf_k$(this.backendUrl_1, '/api/agents/' + ApiClient_getInstance().pathSegment_ut1190_k$(this._this__u8e3s4__1.agentId_1) + '/activate', 'POST', VOID, VOID, this);
              if (suspendResult === get_COROUTINE_SUSPENDED()) {
                return suspendResult;
              }
              continue $sm;
            } else {
              var tmp_9 = this;
              tmp_9.WHEN_RESULT2__1 = this.registered1__1;
              this.set_state_rjd8d0_k$(3);
              continue $sm;
            }

          case 2:
            var ARGUMENT = suspendResult;
            this.WHEN_RESULT2__1 = this.registered1__1 + '\n\n' + ARGUMENT;
            this.set_state_rjd8d0_k$(3);
            continue $sm;
          case 3:
            return this.WHEN_RESULT2__1;
          case 4:
            throw this.get_exception_x0n6w6_k$();
        }
      } catch ($p) {
        var e = $p;
        if (this.get_exceptionState_wflpxn_k$() === 4) {
          throw e;
        } else {
          this.set_state_rjd8d0_k$(this.get_exceptionState_wflpxn_k$());
          this.set_exception_px07aa_k$(e);
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
    this.mode_1 = mode;
    this.coord_1 = coord;
    this.stationId_1 = stationId;
    this.stationName_1 = stationName;
    this.storageCapacity_1 = storageCapacity;
    this.parkingCapacity_1 = parkingCapacity;
    this.activateStation_1 = activateStation;
    this.customerId_1 = customerId;
    this.weightKg_1 = weightKg;
    this.volumeM3__1 = volumeM3;
    this.destLat_1 = destLat;
    this.destLon_1 = destLon;
    this.groundTransport_1 = groundTransport;
    this.agentId_1 = agentId;
    this.agentType_1 = agentType;
    this.agentAlt_1 = agentAlt;
    this.agentRange_1 = agentRange;
    this.agentPayload_1 = agentPayload;
    this.agentStationId_1 = agentStationId;
    this.agentAutoStart_1 = agentAutoStart;
    this.agentPx4Model_1 = agentPx4Model;
    this.agentPx4Instance_1 = agentPx4Instance;
    this.agentMavlinkPort_1 = agentMavlinkPort;
    this.activateAgent_1 = activateAgent;
  }
  protoOf(RegisterOverlayState).get_mode_woqlt8_k$ = function () {
    return this.mode_1;
  };
  protoOf(RegisterOverlayState).get_coord_ipub4c_k$ = function () {
    return this.coord_1;
  };
  protoOf(RegisterOverlayState).get_stationId_pwojei_k$ = function () {
    return this.stationId_1;
  };
  protoOf(RegisterOverlayState).get_stationName_yfkinq_k$ = function () {
    return this.stationName_1;
  };
  protoOf(RegisterOverlayState).get_storageCapacity_m95bak_k$ = function () {
    return this.storageCapacity_1;
  };
  protoOf(RegisterOverlayState).get_parkingCapacity_udcw2f_k$ = function () {
    return this.parkingCapacity_1;
  };
  protoOf(RegisterOverlayState).get_activateStation_yuf0ew_k$ = function () {
    return this.activateStation_1;
  };
  protoOf(RegisterOverlayState).get_customerId_opgpia_k$ = function () {
    return this.customerId_1;
  };
  protoOf(RegisterOverlayState).get_weightKg_urxiv1_k$ = function () {
    return this.weightKg_1;
  };
  protoOf(RegisterOverlayState).get_volumeM3_8ayne1_k$ = function () {
    return this.volumeM3__1;
  };
  protoOf(RegisterOverlayState).get_destLat_r0r25w_k$ = function () {
    return this.destLat_1;
  };
  protoOf(RegisterOverlayState).get_destLon_r0r2hs_k$ = function () {
    return this.destLon_1;
  };
  protoOf(RegisterOverlayState).get_groundTransport_o97o1l_k$ = function () {
    return this.groundTransport_1;
  };
  protoOf(RegisterOverlayState).get_agentId_ga4ovd_k$ = function () {
    return this.agentId_1;
  };
  protoOf(RegisterOverlayState).get_agentType_jm8bey_k$ = function () {
    return this.agentType_1;
  };
  protoOf(RegisterOverlayState).get_agentAlt_7i96tv_k$ = function () {
    return this.agentAlt_1;
  };
  protoOf(RegisterOverlayState).get_agentRange_v3bpoh_k$ = function () {
    return this.agentRange_1;
  };
  protoOf(RegisterOverlayState).get_agentPayload_hlq3gy_k$ = function () {
    return this.agentPayload_1;
  };
  protoOf(RegisterOverlayState).get_agentStationId_l32znx_k$ = function () {
    return this.agentStationId_1;
  };
  protoOf(RegisterOverlayState).get_agentAutoStart_uei0ll_k$ = function () {
    return this.agentAutoStart_1;
  };
  protoOf(RegisterOverlayState).get_agentPx4Model_27wm93_k$ = function () {
    return this.agentPx4Model_1;
  };
  protoOf(RegisterOverlayState).get_agentPx4Instance_opl5r9_k$ = function () {
    return this.agentPx4Instance_1;
  };
  protoOf(RegisterOverlayState).get_agentMavlinkPort_10ie81_k$ = function () {
    return this.agentMavlinkPort_1;
  };
  protoOf(RegisterOverlayState).get_activateAgent_p96ox5_k$ = function () {
    return this.activateAgent_1;
  };
  protoOf(RegisterOverlayState).submit_3qaam7_k$ = function (backendUrl, $completion) {
    var tmp = new $submitCOROUTINE$3(this, backendUrl, $completion);
    tmp.set_result_xj64lm_k$(Unit_getInstance());
    tmp.set_exception_px07aa_k$(null);
    return tmp.doResume_5yljmg_k$();
  };
  protoOf(RegisterOverlayState).component1_7eebsc_k$ = function () {
    return this.mode_1;
  };
  protoOf(RegisterOverlayState).component2_7eebsb_k$ = function () {
    return this.coord_1;
  };
  protoOf(RegisterOverlayState).component3_7eebsa_k$ = function () {
    return this.stationId_1;
  };
  protoOf(RegisterOverlayState).component4_7eebs9_k$ = function () {
    return this.stationName_1;
  };
  protoOf(RegisterOverlayState).component5_7eebs8_k$ = function () {
    return this.storageCapacity_1;
  };
  protoOf(RegisterOverlayState).component6_7eebs7_k$ = function () {
    return this.parkingCapacity_1;
  };
  protoOf(RegisterOverlayState).component7_7eebs6_k$ = function () {
    return this.activateStation_1;
  };
  protoOf(RegisterOverlayState).component8_7eebs5_k$ = function () {
    return this.customerId_1;
  };
  protoOf(RegisterOverlayState).component9_7eebs4_k$ = function () {
    return this.weightKg_1;
  };
  protoOf(RegisterOverlayState).component10_gazzfo_k$ = function () {
    return this.volumeM3__1;
  };
  protoOf(RegisterOverlayState).component11_gazzfn_k$ = function () {
    return this.destLat_1;
  };
  protoOf(RegisterOverlayState).component12_gazzfm_k$ = function () {
    return this.destLon_1;
  };
  protoOf(RegisterOverlayState).component13_gazzfl_k$ = function () {
    return this.groundTransport_1;
  };
  protoOf(RegisterOverlayState).component14_gazzfk_k$ = function () {
    return this.agentId_1;
  };
  protoOf(RegisterOverlayState).component15_gazzfj_k$ = function () {
    return this.agentType_1;
  };
  protoOf(RegisterOverlayState).component16_gazzfi_k$ = function () {
    return this.agentAlt_1;
  };
  protoOf(RegisterOverlayState).component17_gazzfh_k$ = function () {
    return this.agentRange_1;
  };
  protoOf(RegisterOverlayState).component18_gazzfg_k$ = function () {
    return this.agentPayload_1;
  };
  protoOf(RegisterOverlayState).component19_gazzff_k$ = function () {
    return this.agentStationId_1;
  };
  protoOf(RegisterOverlayState).component20_gazzet_k$ = function () {
    return this.agentAutoStart_1;
  };
  protoOf(RegisterOverlayState).component21_gazzes_k$ = function () {
    return this.agentPx4Model_1;
  };
  protoOf(RegisterOverlayState).component22_gazzer_k$ = function () {
    return this.agentPx4Instance_1;
  };
  protoOf(RegisterOverlayState).component23_gazzeq_k$ = function () {
    return this.agentMavlinkPort_1;
  };
  protoOf(RegisterOverlayState).component24_gazzep_k$ = function () {
    return this.activateAgent_1;
  };
  protoOf(RegisterOverlayState).copy_kocxml_k$ = function (mode, coord, stationId, stationName, storageCapacity, parkingCapacity, activateStation, customerId, weightKg, volumeM3, destLat, destLon, groundTransport, agentId, agentType, agentAlt, agentRange, agentPayload, agentStationId, agentAutoStart, agentPx4Model, agentPx4Instance, agentMavlinkPort, activateAgent) {
    return new RegisterOverlayState(mode, coord, stationId, stationName, storageCapacity, parkingCapacity, activateStation, customerId, weightKg, volumeM3, destLat, destLon, groundTransport, agentId, agentType, agentAlt, agentRange, agentPayload, agentStationId, agentAutoStart, agentPx4Model, agentPx4Instance, agentMavlinkPort, activateAgent);
  };
  protoOf(RegisterOverlayState).copy$default_3uibqy_k$ = function (mode, coord, stationId, stationName, storageCapacity, parkingCapacity, activateStation, customerId, weightKg, volumeM3, destLat, destLon, groundTransport, agentId, agentType, agentAlt, agentRange, agentPayload, agentStationId, agentAutoStart, agentPx4Model, agentPx4Instance, agentMavlinkPort, activateAgent, $super) {
    mode = mode === VOID ? this.mode_1 : mode;
    coord = coord === VOID ? this.coord_1 : coord;
    stationId = stationId === VOID ? this.stationId_1 : stationId;
    stationName = stationName === VOID ? this.stationName_1 : stationName;
    storageCapacity = storageCapacity === VOID ? this.storageCapacity_1 : storageCapacity;
    parkingCapacity = parkingCapacity === VOID ? this.parkingCapacity_1 : parkingCapacity;
    activateStation = activateStation === VOID ? this.activateStation_1 : activateStation;
    customerId = customerId === VOID ? this.customerId_1 : customerId;
    weightKg = weightKg === VOID ? this.weightKg_1 : weightKg;
    volumeM3 = volumeM3 === VOID ? this.volumeM3__1 : volumeM3;
    destLat = destLat === VOID ? this.destLat_1 : destLat;
    destLon = destLon === VOID ? this.destLon_1 : destLon;
    groundTransport = groundTransport === VOID ? this.groundTransport_1 : groundTransport;
    agentId = agentId === VOID ? this.agentId_1 : agentId;
    agentType = agentType === VOID ? this.agentType_1 : agentType;
    agentAlt = agentAlt === VOID ? this.agentAlt_1 : agentAlt;
    agentRange = agentRange === VOID ? this.agentRange_1 : agentRange;
    agentPayload = agentPayload === VOID ? this.agentPayload_1 : agentPayload;
    agentStationId = agentStationId === VOID ? this.agentStationId_1 : agentStationId;
    agentAutoStart = agentAutoStart === VOID ? this.agentAutoStart_1 : agentAutoStart;
    agentPx4Model = agentPx4Model === VOID ? this.agentPx4Model_1 : agentPx4Model;
    agentPx4Instance = agentPx4Instance === VOID ? this.agentPx4Instance_1 : agentPx4Instance;
    agentMavlinkPort = agentMavlinkPort === VOID ? this.agentMavlinkPort_1 : agentMavlinkPort;
    activateAgent = activateAgent === VOID ? this.activateAgent_1 : activateAgent;
    return $super === VOID ? this.copy_kocxml_k$(mode, coord, stationId, stationName, storageCapacity, parkingCapacity, activateStation, customerId, weightKg, volumeM3, destLat, destLon, groundTransport, agentId, agentType, agentAlt, agentRange, agentPayload, agentStationId, agentAutoStart, agentPx4Model, agentPx4Instance, agentMavlinkPort, activateAgent) : $super.copy_kocxml_k$.call(this, mode, coord, stationId, stationName, storageCapacity, parkingCapacity, activateStation, customerId, weightKg, volumeM3, destLat, destLon, groundTransport, agentId, agentType, agentAlt, agentRange, agentPayload, agentStationId, agentAutoStart, agentPx4Model, agentPx4Instance, agentMavlinkPort, activateAgent);
  };
  protoOf(RegisterOverlayState).toString = function () {
    return 'RegisterOverlayState(mode=' + this.mode_1.toString() + ', coord=' + this.coord_1.toString() + ', stationId=' + this.stationId_1 + ', stationName=' + this.stationName_1 + ', storageCapacity=' + this.storageCapacity_1 + ', parkingCapacity=' + this.parkingCapacity_1 + ', activateStation=' + this.activateStation_1 + ', customerId=' + this.customerId_1 + ', weightKg=' + this.weightKg_1 + ', volumeM3=' + this.volumeM3__1 + ', destLat=' + this.destLat_1 + ', destLon=' + this.destLon_1 + ', groundTransport=' + this.groundTransport_1 + ', agentId=' + this.agentId_1 + ', agentType=' + this.agentType_1 + ', agentAlt=' + this.agentAlt_1 + ', agentRange=' + this.agentRange_1 + ', agentPayload=' + this.agentPayload_1 + ', agentStationId=' + this.agentStationId_1 + ', agentAutoStart=' + this.agentAutoStart_1 + ', agentPx4Model=' + this.agentPx4Model_1 + ', agentPx4Instance=' + this.agentPx4Instance_1 + ', agentMavlinkPort=' + this.agentMavlinkPort_1 + ', activateAgent=' + this.activateAgent_1 + ')';
  };
  protoOf(RegisterOverlayState).hashCode = function () {
    var result = this.mode_1.hashCode();
    result = imul(result, 31) + this.coord_1.hashCode() | 0;
    result = imul(result, 31) + getStringHashCode(this.stationId_1) | 0;
    result = imul(result, 31) + getStringHashCode(this.stationName_1) | 0;
    result = imul(result, 31) + getStringHashCode(this.storageCapacity_1) | 0;
    result = imul(result, 31) + getStringHashCode(this.parkingCapacity_1) | 0;
    result = imul(result, 31) + getBooleanHashCode(this.activateStation_1) | 0;
    result = imul(result, 31) + getStringHashCode(this.customerId_1) | 0;
    result = imul(result, 31) + getStringHashCode(this.weightKg_1) | 0;
    result = imul(result, 31) + getStringHashCode(this.volumeM3__1) | 0;
    result = imul(result, 31) + getStringHashCode(this.destLat_1) | 0;
    result = imul(result, 31) + getStringHashCode(this.destLon_1) | 0;
    result = imul(result, 31) + getBooleanHashCode(this.groundTransport_1) | 0;
    result = imul(result, 31) + getStringHashCode(this.agentId_1) | 0;
    result = imul(result, 31) + getStringHashCode(this.agentType_1) | 0;
    result = imul(result, 31) + getStringHashCode(this.agentAlt_1) | 0;
    result = imul(result, 31) + getStringHashCode(this.agentRange_1) | 0;
    result = imul(result, 31) + getStringHashCode(this.agentPayload_1) | 0;
    result = imul(result, 31) + getStringHashCode(this.agentStationId_1) | 0;
    result = imul(result, 31) + getBooleanHashCode(this.agentAutoStart_1) | 0;
    result = imul(result, 31) + getStringHashCode(this.agentPx4Model_1) | 0;
    result = imul(result, 31) + getStringHashCode(this.agentPx4Instance_1) | 0;
    result = imul(result, 31) + getStringHashCode(this.agentMavlinkPort_1) | 0;
    result = imul(result, 31) + getBooleanHashCode(this.activateAgent_1) | 0;
    return result;
  };
  protoOf(RegisterOverlayState).equals = function (other) {
    if (this === other)
      return true;
    if (!(other instanceof RegisterOverlayState))
      return false;
    var tmp0_other_with_cast = other instanceof RegisterOverlayState ? other : THROW_CCE();
    if (!this.mode_1.equals(tmp0_other_with_cast.mode_1))
      return false;
    if (!this.coord_1.equals(tmp0_other_with_cast.coord_1))
      return false;
    if (!(this.stationId_1 === tmp0_other_with_cast.stationId_1))
      return false;
    if (!(this.stationName_1 === tmp0_other_with_cast.stationName_1))
      return false;
    if (!(this.storageCapacity_1 === tmp0_other_with_cast.storageCapacity_1))
      return false;
    if (!(this.parkingCapacity_1 === tmp0_other_with_cast.parkingCapacity_1))
      return false;
    if (!(this.activateStation_1 === tmp0_other_with_cast.activateStation_1))
      return false;
    if (!(this.customerId_1 === tmp0_other_with_cast.customerId_1))
      return false;
    if (!(this.weightKg_1 === tmp0_other_with_cast.weightKg_1))
      return false;
    if (!(this.volumeM3__1 === tmp0_other_with_cast.volumeM3__1))
      return false;
    if (!(this.destLat_1 === tmp0_other_with_cast.destLat_1))
      return false;
    if (!(this.destLon_1 === tmp0_other_with_cast.destLon_1))
      return false;
    if (!(this.groundTransport_1 === tmp0_other_with_cast.groundTransport_1))
      return false;
    if (!(this.agentId_1 === tmp0_other_with_cast.agentId_1))
      return false;
    if (!(this.agentType_1 === tmp0_other_with_cast.agentType_1))
      return false;
    if (!(this.agentAlt_1 === tmp0_other_with_cast.agentAlt_1))
      return false;
    if (!(this.agentRange_1 === tmp0_other_with_cast.agentRange_1))
      return false;
    if (!(this.agentPayload_1 === tmp0_other_with_cast.agentPayload_1))
      return false;
    if (!(this.agentStationId_1 === tmp0_other_with_cast.agentStationId_1))
      return false;
    if (!(this.agentAutoStart_1 === tmp0_other_with_cast.agentAutoStart_1))
      return false;
    if (!(this.agentPx4Model_1 === tmp0_other_with_cast.agentPx4Model_1))
      return false;
    if (!(this.agentPx4Instance_1 === tmp0_other_with_cast.agentPx4Instance_1))
      return false;
    if (!(this.agentMavlinkPort_1 === tmp0_other_with_cast.agentMavlinkPort_1))
      return false;
    if (!(this.activateAgent_1 === tmp0_other_with_cast.activateAgent_1))
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
  DEFAULT_LAT = 47.397971;
  DEFAULT_LON = 8.546164;
  DEFAULT_HALF_SPAN_METERS = 400.0;
  MIN_HALF_SPAN_METERS = 150.0;
  VIEW_W = 960.0;
  VIEW_H = 520.0;
  PADDING = 48.0;
  SCREEN_GRID_SPACING = 80.0;
  MARKER_RADIUS = 10.0;
  MARKER_HIT_RADIUS = 14.0;
  METERS_PER_DEGREE_LAT = 111320.0;
  REBALANCE_SYSTEM_SHIPMENT_ID = '00000000-0000-4000-8000-000000000001';
  //endregion
  mainWrapper();
  return _;
}));

//# sourceMappingURL=uav-logistics-system-frontend.js.map
