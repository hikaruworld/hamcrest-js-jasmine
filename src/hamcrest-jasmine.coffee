###
*    jasmineのいわゆるhamcrestモジュールです(hamcrestプロジェクトとは無関係ですが)。
*    利用する場合はbeforeEachで事前に読み込んでおく必要があります。
*    =========================================================
*    usage(coffeescript)::
*    beforeEach ->
*        # load custom matcher
*        this.addMatchers jasmien.hamcrest.Matchers.core
*    =========================================================
###

exports = this
jasmine = exports.jasmine ?= {}
hamcrest = jasmine.hamcrest ?= {}
Matchers = hamcrest.Matchers ?= {}

Any = jasmine.Matchers.Any
anyFunc = new Any(Function)

# core modules
Matchers.core =
	###
	*	verify function
	*	==============================================
	*	expect( -> ).toBeFunction()
	*	==============================================
	###
	toBeFunction: ->
		anyFunc.matches this.actual

	###
	* 	Fails a test.
	*	==============================================
	*	expect().toBeFail()
	*	==============================================
	###
	toBeFail: ->
        false
    ###
    *
    *   全ての要素が対象に含まれるかを検証する
	*	==============================================
    *   expect([1,2,3,4]).toAllOf(1,2)
    *   expect("あいうえお").toAllOf("あ")
	*	==============================================
    ###
    toAllOf: (args...) ->
        return false if args.length is 0 

        this.toContain(item) for item in args
        # FIXME このカウンターだとspec全体を見てしまうため、複合するとおそらく失敗する
        return this.spec.results().failedCount is 0
        
    ###
    *
    *   いずれかの要素が対象に含まれているかを検証する
	*	==============================================
    *   expect([1,2,3,4]).toAnyOf(1,80)
    *   expect("あいうえお").toAnyOf("あ", "か", "さ")
	*	==============================================
    ###
    toAnyOf: (args...) ->
        return false if args.length is 0
        
        successed = 0
        (if this.env.contains_(this.actual, item) then successed++) for item in args
        
        successed > 0

    ###
    *
    *   全ての要素を保持しているか検証する
	*	==============================================
    *   expect([1,1,1,1]).toEveryItem(1)
    *   expect("あいうえお").toEveryItem("あいうえお")
	*	==============================================
    *
    ###
    toBeEveryItem: (item) ->
        return false if not item?.length > 0
        
        return this.env.equals_(item, this.actual) if not jasmine.isArray_(this.actual)

        successed = 0
        (if this.env.equals_(item, val) then successed++) for val in this.actual
        
        successed is this.actual.length

    ###
    * 
    * 指定した値で始まっていることを検証する
    ###
    toStartsWith: (substr) ->
        return this.actual?.lastIndexOf(substr, 0) is 0 if jasmine.isString_(substr) and substr.length > 0
        false
    toEndsWith: (substr) ->
        return this.actual?.lastIndexOf(substr, this.actual.length) is this.actual.length - substr.length if jasmine.isString_(substr) and substr.length > 0
        false
    toBeEmpty: ->
        return true if not this.actual?
        false
    toBeEmptyArray: ->
        expect().toBeFail()
    toAnything: ->
        expect().toBeFail()

# ui module
ui ?= Matchers.ui = {}
if $?
	jquery ?= ui.jquery = {}
    # depend jQuery(required 1.7 higher )
	jquery =
		###
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
		###
		toBeOnEvent: (eventType) ->
			_toBeOnEvent(eventType, true)

		###
		*	指定されたイベントがjqueryのonによって設定されていることを検証する。
		*	なお、toBeOnEventと異なり呼び出されていない場合も検証が成功する
		*	FIXME あとで内部クラス化する。
		*	==============================================
		*	toBeOnEventOrNone: (eventType) ->
		*		_toBeOnEvent(eventType, false)
		*	==============================================
		###
		_toBeOnEvent: (eventType, required) ->
			if required
				return false if this.actual.calls?.length is 0
			for item in this.actual.calls
				expect(item.args[0]).toEqual eventType
				expect(item.args[1]).toBeFunction()
			true
		
		###
		*	指定されたイベントの指定した呼び出し時にjqueryのonによって設定されていることを検証する。
		*	なお、必ず呼び出されている必要があり、呼び出し自体が行われていない場合は検証に失敗する。
		###
		toBeOnEventAt: (eventType, args) ->
			return false if this.actual.calls?.length is 0
			item = this.actual.calls[args]
			expect(item.args[0]).toEqual eventType
			expect(item.args[1]).toBeFunction()
			true

		###
		# @example
		###
		toBeOnClick: ->
			toBeOnEvent('click')
		###
		# @example
		###
		toBeOnClickAt: (args) ->
			toBeOnEventAt('click')
		###
		# @example
		###
		toBeOnChange: ->
			toBeOnEvent('change')
		###
		# @example
		###
		toBeOnChangeAt: (args) ->
			toBeOnEventAt('change', args)

# Spy's Matcher module
Matchers.spy =
    ###
    # 指定した回数呼ばれていることを検証する
    ###
    toBeCount: (args) ->
        expect().toBeFail()
    ###
    # 一回だけ呼ばれていることを検証する
    ###
    toBeCountOnec: ->
        expect().toBeFail()
    ###
    # 複数回呼ばれていることを検証する
    ###
    toBeCountMulitple: ->
        expect().toBeFail()
    ###
    # もっとも最後に呼ばれた値を検証する
    ###
    toBeMostRecentCall: (arguments) ->
        expect().toBeFail()
    ###
    # もっとも最初い呼ばれた値を検証する
    ###
    toBeMostPastCall: (arguments) ->
        expect().toBeFail()
    ###
    # 指定した回数時に呼ばれた値を検証する
    ###
	toBeCallAt: (i, arguments) ->
        expect().toBeFail()
