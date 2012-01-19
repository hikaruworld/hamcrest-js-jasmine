/*
*    jasmineのいわゆるhamcrestモジュールです(hamcrestプロジェクトとは無関係ですが)。
*    利用する場合はbeforeEachで事前に読み込んでおく必要があります。
*    =========================================================
*    usage(coffeescript)::
*    beforeEach ->
*        # load custom matcher
*        this.addMatchers jasmien.hamcrest.Matchers.core
*    =========================================================
*/
var Any, Matchers, anyFunc, exports, hamcrest, jasmine, jquery, _ref, _ref2, _ref3,
  __slice = Array.prototype.slice;

exports = this;

jasmine = (_ref = exports.jasmine) != null ? _ref : exports.jasmine = {};

hamcrest = (_ref2 = jasmine.hamcrest) != null ? _ref2 : jasmine.hamcrest = {};

Matchers = (_ref3 = hamcrest.Matchers) != null ? _ref3 : hamcrest.Matchers = {};

Any = jasmine.Matchers.Any;

anyFunc = new Any(Function);

Matchers.core = {
  /*
  	*	verify function
  	*	==============================================
  	*	expect( -> ).toBeFunction()
  	*	==============================================
  */
  toBeFunction: function() {
    return anyFunc.matches(this.actual);
  },
  /*
  	* 	Fails a test.
  	*	==============================================
  	*	expect().toBeFail()
  	*	==============================================
  */
  toBeFail: function() {
    return false;
  },
  /*
      *
      *   全ての要素が対象に含まれるかを検証する
  	*	==============================================
      *   expect([1,2,3,4]).toAllOf(1,2)
      *   expect("あいうえお").toAllOf("あ")
  	*	==============================================
  */
  toAllOf: function() {
    var args, item, _i, _len;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    if (args.length === 0) return false;
    for (_i = 0, _len = args.length; _i < _len; _i++) {
      item = args[_i];
      this.toContain(item);
    }
    return this.spec.results().failedCount === 0;
  },
  /*
      *
      *   いずれかの要素が対象に含まれているかを検証する
  	*	==============================================
      *   expect([1,2,3,4]).toAnyOf(1,80)
      *   expect("あいうえお").toAnyOf("あ", "か", "さ")
  	*	==============================================
  */
  toAnyOf: function() {
    var args, item, successed, _i, _len;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    if (args.length === 0) return false;
    successed = 0;
    for (_i = 0, _len = args.length; _i < _len; _i++) {
      item = args[_i];
      if (this.env.contains_(this.actual, item)) successed++;
    }
    return successed > 0;
  },
  /*
      *
      *   全ての要素を保持しているか検証する
  	*	==============================================
      *   expect([1,1,1,1]).toEveryItem(1)
      *   expect("あいうえお").toEveryItem("あいうえお")
  	*	==============================================
      *
  */
  toBeEveryItem: function(item) {
    var successed, val, _i, _len, _ref4;
    if (!(item != null ? item.length : void 0) > 0) return false;
    if (!jasmine.isArray_(this.actual)) return this.env.equals_(item, this.actual);
    successed = 0;
    _ref4 = this.actual;
    for (_i = 0, _len = _ref4.length; _i < _len; _i++) {
      val = _ref4[_i];
      if (this.env.equals_(item, val)) successed++;
    }
    return successed === this.actual.length;
  },
  /*
      * 
      * 指定した値で始まっていることを検証する
  */
  toStartsWith: function(substr) {
    var _ref4;
    if (jasmine.isString_(substr) && substr.length > 0) {
      return ((_ref4 = this.actual) != null ? _ref4.lastIndexOf(substr, 0) : void 0) === 0;
    }
    return false;
  },
  toEndsWith: function(substr) {
    var _ref4;
    if (jasmine.isString_(substr) && substr.length > 0) {
      return ((_ref4 = this.actual) != null ? _ref4.lastIndexOf(substr, this.actual.length) : void 0) === this.actual.length - substr.length;
    }
    return false;
  },
  toBeEmpty: function() {
    if (!(this.actual != null)) return true;
    return false;
  },
  toBeEmptyArray: function() {
    return expect().toBeFail();
  },
  toAnything: function() {
    return expect().toBeFail();
  }
};

if (typeof ui === "undefined" || ui === null) ui = Matchers.ui = {};

if (typeof $ !== "undefined" && $ !== null) {
  if (typeof jquery === "undefined" || jquery === null) jquery = ui.jquery = {};
  jquery = {
    /*
    		*	指定されたイベントがjqueryのonによって設定されていることを検証する。
    		*	なお、必ず呼び出されている必要があり、呼び出し自体が行われていない場合は検証に失敗する。
    		*	==============================================
    		*	 @example
    		*	 # spy
    		*	 spyOn($.fn, 'on')
    		*	 # exec
    		*	 $("#hoge").on 'click', ->
    		*	     alert 'piyo'
    		*	 $("#hoge").on 'click', ->
    		*	     console.log 'hello'
    		*	 # verify
    		*	 expect($("#hoge").on).toBeOnEvent('click')
    		*	==============================================
    */
    toBeOnEvent: function(eventType) {
      return _toBeOnEvent(eventType, true);
    },
    /*
    		*	指定されたイベントがjqueryのonによって設定されていることを検証する。
    		*	なお、toBeOnEventと異なり呼び出されていない場合も検証が成功する
    		*	FIXME あとで内部クラス化する。
    		*	==============================================
    		*	toBeOnEventOrNone: (eventType) ->
    		*		_toBeOnEvent(eventType, false)
    		*	==============================================
    */
    _toBeOnEvent: function(eventType, required) {
      var item, _i, _len, _ref4, _ref5;
      if (required) {
        if (((_ref4 = this.actual.calls) != null ? _ref4.length : void 0) === 0) {
          return false;
        }
      }
      _ref5 = this.actual.calls;
      for (_i = 0, _len = _ref5.length; _i < _len; _i++) {
        item = _ref5[_i];
        expect(item.args[0]).toEqual(eventType);
        expect(item.args[1]).toBeFunction();
      }
      return true;
    },
    /*
    		*	指定されたイベントの指定した呼び出し時にjqueryのonによって設定されていることを検証する。
    		*	なお、必ず呼び出されている必要があり、呼び出し自体が行われていない場合は検証に失敗する。
    */
    toBeOnEventAt: function(eventType, args) {
      var item, _ref4;
      if (((_ref4 = this.actual.calls) != null ? _ref4.length : void 0) === 0) {
        return false;
      }
      item = this.actual.calls[args];
      expect(item.args[0]).toEqual(eventType);
      expect(item.args[1]).toBeFunction();
      return true;
    },
    /*
    		# @example
    */
    toBeOnClick: function() {
      return toBeOnEvent('click');
    },
    /*
    		# @example
    */
    toBeOnClickAt: function(args) {
      return toBeOnEventAt('click');
    },
    /*
    		# @example
    */
    toBeOnChange: function() {
      return toBeOnEvent('change');
    },
    /*
    		# @example
    */
    toBeOnChangeAt: function(args) {
      return toBeOnEventAt('change', args);
    }
  };
}

Matchers.spy = {
  /*
      # 指定した回数呼ばれていることを検証する
  */
  toBeCount: function(args) {
    return expect().toBeFail();
  },
  /*
      # 一回だけ呼ばれていることを検証する
  */
  toBeCountOnec: function() {
    return expect().toBeFail();
  },
  /*
      # 複数回呼ばれていることを検証する
  */
  toBeCountMulitple: function() {
    return expect().toBeFail();
  },
  /*
      # もっとも最後に呼ばれた値を検証する
  */
  toBeMostRecentCall: function(arguments) {
    return expect().toBeFail();
  },
  /*
      # もっとも最初い呼ばれた値を検証する
  */
  toBeMostPastCall: function(arguments) {
    return expect().toBeFail();
  }
  /*
      # 指定した回数時に呼ばれた値を検証する
  */
};

({
  toBeCallAt: function(i, arguments) {
    return expect().toBeFail();
  }
});
