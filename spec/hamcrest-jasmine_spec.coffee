Matchers = jasmine.hamcrest.Matchers

describe "expectの拡張matcher", ->
	# core = null
	
	describe "=== core Matcher ====", ->
		beforeEach ->
			# load custom matcher
			this.addMatchers jasmine.hamcrest.Matchers.core
	
		describe ">>> toBeFunction", ->
			it "関数である場合は成功する", ->
				expect(->).toBeFunction()
			it "nullの場合は失敗する", ->
				expect(null).not.toBeFunction()
			it "文字列の場合は失敗する", ->
				expect("hamcrest...").not.toBeFunction()
			it "クラスの場合は失敗する", ->
				expect({}).not.toBeFunction()
		describe ">>> toBeFail", ->
			it "常に失敗する", ->
				expect().not.toBeFail()
			it "引数は考慮しない", ->
                expect(true).not.toBeFail()
		describe ">>> toAllOf", ->
            describe "falseつまり正しくないと判断されるパターン", ->
                describe "引数を渡さずに処理する場合", ->
                    it "nullである", ->
                        subject =  expect(null)
                        subject.toAllOf = Matchers.core.toAllOf
                    
                        expect(subject.toAllOf()).toBeFalsy()
                    it "空である", ->
                        subject =  expect([])
                        subject.toAllOf = Matchers.core.toAllOf

                        expect(subject.toAllOf()).toBeFalsy()
                    it "関数である", ->
                        subject =  expect(->)
                        subject.toAllOf = Matchers.core.toAllOf

                        expect(subject.toAllOf()).toBeFalsy()
                    it "クラスである", ->
                        subject =  expect({})
                        subject.toAllOf = Matchers.core.toAllOf

                        expect(subject.toAllOf()).toBeFalsy()
                describe "引数を渡して処理する場合", ->
                    subject = expect("dummy")
                    expected = null
                    beforeEach ->
                        subject.toAllOf = Matchers.core.toAllOf

                        # toContainをそのまま実行されると画面上にエラーが通知されてしまうため、
                        # toContainのboolean判定に利用する実クラスにMockとして直結させる
                        failFlag = false
                        spyOn(subject, "toContain").andCallFake ->
                            failFlag = not this.env.contains_(expected, arguments[0])
                        spyOn(subject.spec, "results").andCallFake ->
                            failedCount: if failFlag then 1 else 0

                    it "該当文字が含まれない", ->
                        subject.actual = expected = "abcdefg"
                        expect(subject.toAllOf("G")).toBeFalsy()
                    it "該当文字が全て含まれない", ->
                        subject.actual = expected = [1,2,3,4,5,6]
                        expect(subject.toAllOf(20,33,0)).toBeFalsy()
                    it "該当文字が含まれているものと含まれていないものが混在している", ->
                        subject.actual = expected = "abcdefg"
                        expect(subject.toAllOf("a", 1)).toBeFalsy()

                    afterEach ->
                        expect(subject.toContain).toHaveBeenCalled()
                        expect(subject.spec.results).toHaveBeenCalled()

            describe "trueつまり正しいと判断されるパターン", ->
                it "該当の文字が含まれている", ->
                    subject =  expect("aiueokakikukeo")
                    subject.toAllOf = Matchers.core.toAllOf
                    
                    expect(subject.toAllOf("eo")).toBeTruthy()

                it "該当の文字が全て含まれている", ->
                    subject =  expect("aiueokakikukeo")
                    subject.toAllOf = Matchers.core.toAllOf

                    expect(subject.toAllOf("eo", "ai")).toBeTruthy()

                it "別のexpectで失敗した場合にこのtoAllOfに影響が出ないこと(this.spectで検証しているため", ->
                    subject =  expect([1,2,3,4,5])
                    subject.toAllOf = Matchers.core.toAllOf
                    subject.not.toEqual(1)

                    expect(subject.toAllOf(1,5)).toBeTruthy()

                    
        describe ">>> toAnyOf", ->
            describe "falseつまり正しくないと判断されるパターン", ->
                describe "引数を渡さずに処理する場合", ->
                    it "nullである", ->
                        subject =  expect(null)
                        subject.toAnyOf = Matchers.core.toAnyOf
                    
                        expect(subject.toAnyOf()).toBeFalsy()
                        
                    it "空である", ->
                        subject =  expect([])
                        subject.toAnyOf = Matchers.core.toAnyOf

                        expect(subject.toAnyOf()).toBeFalsy()
                        
                    it "関数である", ->
                        subject =  expect(->)
                        subject.toAnyOf = Matchers.core.toAnyOf

                        expect(subject.toAnyOf()).toBeFalsy()
                        
                    it "クラスである", ->
                        subject =  expect({})
                        subject.toAnyOf = Matchers.core.toAnyOf

                        expect(subject.toAnyOf()).toBeFalsy()
                        
                        
                describe "引数が存在する上で処理する場合", ->
                    it "該当文字が含まれない", ->
                        subject =  expect("123456")
                        subject.toAnyOf = Matchers.core.toAnyOf

                        expect(subject.toAnyOf("A")).toBeFalsy()
                        
            
            describe "true:正しいと判断されるパターン", ->
                it "期待する文字が含まれる", ->
                    subject =  expect([1,2,3,4,5])
                    subject.toAnyOf = Matchers.core.toAnyOf

                    expect(subject.toAnyOf(3)).toBeTruthy()
                    
                it "期待する文字のいずれかが含まれる", ->
                    subject =  expect("ABCDEFG")
                    subject.toAnyOf = Matchers.core.toAnyOf

                    expect(subject.toAnyOf("A", 1)).toBeTruthy()
                    
                it "期待する文字の全てが含まれる", ->
                    subject =  expect(["A", "B", "C"])
                    subject.toAnyOf = Matchers.core.toAnyOf

                    expect(subject.toAnyOf("A", "B", "C")).toBeTruthy()
        describe ">>> toBeEveryItem", ->
            describe "Falseになる仕様", ->
                it "nullに対する比較は成立しない", ->
                    subject = expect(null)
                    subject.toBeEveryItem = Matchers.core.toBeEveryItem

                    expect(subject.toBeEveryItem()).toBeFalsy()
                it "関数に対する比較は成立しない", ->
                    subject = expect( -> )
                    subject.toBeEveryItem = Matchers.core.toBeEveryItem

                    expect(subject.toBeEveryItem()).toBeFalsy()
                it "クラスに対する比較は成立しない", ->
                    subject = expect({})
                    subject.toBeEveryItem = Matchers.core.toBeEveryItem
                    
                    expect(subject.toBeEveryItem()).toBeFalsy()
                    
                it "期待値が、『空文字空、空配列、関数, null、undefined』の場合には成立しない", ->
                    for item in ["", null, {}, [], undefined, -> ]
                        subject = expect(item)
                        subject.toBeEveryItem = Matchers.core.toBeEveryItem
                    
                        expect(subject.toBeEveryItem(item)).toBeFalsy()

                it "合致するものもあるが違うものも混在する場合は成立しない", ->
                    subject = expect(["ABC", "ABC", "ABCE"])
                    subject.toBeEveryItem = Matchers.core.toBeEveryItem

                    expect(subject.toBeEveryItem("ABC")).toBeFalsy()

            describe "Trueになる仕様", ->
                it "配列の要素が全て同じである", ->
                    subject = expect(["ABC", "ABC", "ABC"])
                    subject.toBeEveryItem = Matchers.core.toBeEveryItem

                    expect(subject.toBeEveryItem("ABC")).toBeTruthy()

                it "配列ではない任意の値が全て同じである", ->
                    subject = expect("ABCDEFG")
                    subject.toBeEveryItem = Matchers.core.toBeEveryItem

                    expect(subject.toBeEveryItem("ABCDEFG")).toBeTruthy()
            
        describe ">>> toStartsWith", -> 
            describe "不成立になる仕様", ->
                it "クラスに対しては成立しない", ->
                    subject = expect( {} )
                    subject.toStartsWith = Matchers.core.toStartsWith
                    
                    expect(subject.toStartsWith( {} )).toBeFalsy()

                it "関数に対しては成立しない", ->
                    subject = expect( -> )
                    subject.toStartsWith = Matchers.core.toStartsWith
                    
                    expect(subject.toStartsWith( -> )).toBeFalsy()

                it "配列に対しては成立しない", ->
                    subject = expect([1,2,3])
                    subject.toStartsWith = Matchers.core.toStartsWith
                    
                    expect(subject.toStartsWith(1)).toBeFalsy()

                it "存在しない値(null, undefined)に対しては成立しない", ->
                    for item in [null, undefined]
                        subject = expect(item)
                        subject.toStartsWith = Matchers.core.toStartsWith
                    
                        expect(subject.toStartsWith(item)).toBeFalsy()
                it "空値('', [])に対しては成立しない", ->
                    for item in ["", []]
                        subject = expect(item)
                        subject.toStartsWith = Matchers.core.toStartsWith
                    
                        expect(subject.toStartsWith(item)).toBeFalsy()
                it "期待値値が異なる場合に成立しない", ->
                    subject = expect("ebcdefg")
                    subject.toStartsWith = Matchers.core.toStartsWith
                
                    expect(subject.toStartsWith("bcdef")).toBeFalsy()


            describe "成立する仕様", ->
                it "期待値と全く同じ値の場合に成立する", ->
                    subject = expect("abcdefg")
                    subject.toStartsWith = Matchers.core.toStartsWith
                
                    expect(subject.toStartsWith("abcdefg")).toBeTruthy()

                it "期待値が結果のprefixとして同じ値の場合に成立する", ->
                    subject = expect("abcdefg")
                    subject.toStartsWith = Matchers.core.toStartsWith
                
                    expect(subject.toStartsWith("abc")).toBeTruthy()

                    
        describe ">>> toEndsWith", ->
            describe "不成立になる仕様", ->
                it "クラスに対しては成立しない", ->
                    subject = expect( {} )
                    subject.toEndsWith = Matchers.core.toEndsWith
                    
                    expect(subject.toEndsWith( {} )).toBeFalsy()

                it "関数に対しては成立しない", ->
                    subject = expect( -> )
                    subject.toEndsWith = Matchers.core.toEndsWith
                    
                    expect(subject.toEndsWith( -> )).toBeFalsy()

                it "配列に対しては成立しない", ->
                    subject = expect( [1,2,3] )
                    subject.toEndsWith = Matchers.core.toEndsWith
                    
                    expect(subject.toEndsWith( [1,2,3] )).toBeFalsy()

                it "存在しない値(null, undefined)に対しては成立しない", ->
                    for item in [null, undefined]
                        subject = expect( item )
                        subject.toEndsWith = Matchers.core.toEndsWith
                        
                        expect(subject.toEndsWith( item )).toBeFalsy()
                
                it "空値('', [])に対しては成立しない", ->
                    for item in ["", []]
                        subject = expect( item )
                        subject.toEndsWith = Matchers.core.toEndsWith
                        
                        expect(subject.toEndsWith( item )).toBeFalsy()

                it "期待値値が異なる場合に成立しない", ->
                    subject = expect("ABCDEF")
                    subject.toEndsWith = Matchers.core.toEndsWith
                    
                    expect(subject.toEndsWith("a")).toBeFalsy()

            describe "成立する仕様", ->
                it "期待値と全く同じ値の場合に成立する", ->
                    subject = expect("ABCDEFG")
                    subject.toEndsWith = Matchers.core.toEndsWith
                    
                    expect(subject.toEndsWith("ABCDEFG")).toBeTruthy()
                it "期待値が結果のsufixとして同じ値の場合に成立する", ->
                    subject = expect("ABCDEFG")
                    subject.toEndsWith = Matchers.core.toEndsWith
                    
                    expect(subject.toEndsWith("FG")).toBeTruthy()

        describe ">>> toBeEmpty", ->
            describe "成立しないケース", ->
                it "undefinedに対して成立しない", ->
                    subject = expect(undefined)
                    subject.toBeEmpty = Matchers.core.toBeEmpty
                    
                    expect(subject.toBeEmpty()).toBeFalsy()

                it "関数に対しては成立しない", ->
                    subject = expect( -> )
                    subject.toBeEmpty = Matchers.core.toBeEmpty
                    
                    expect(subject.toBeEmpty()).toBeFalsy()

                it "boolean(true, false)に対しては成立しない", ->
                    for item in [true, false]
                        subject = expect(item)
                        subject.toBeEmpty = Matchers.core.toBeEmpty
                    
                        expect(subject.toBeEmpty()).toBeFalsy()

                it "マイナス値に対しては成立しない", ->
                    subject = expect(-100)
                    subject.toBeEmpty = Matchers.core.toBeEmpty
                    
                    expect(subject.toBeEmpty()).toBeFalsy()

                it "プラス値に対しては成立しない", ->
                    subject = expect(2500)
                    subject.toBeEmpty = Matchers.core.toBeEmpty
                    
                    expect(subject.toBeEmpty()).toBeFalsy()

                it "値を持つ配列に対して成立しない", ->
                    subject = expect([1,2,3])
                    subject.toBeEmpty = Matchers.core.toBeEmpty
                    
                    expect(subject.toBeEmpty()).toBeFalsy()

                it "値を持つ文字列に対して成立しない", ->
                    subject = expect("BACB")
                    subject.toBeEmpty = Matchers.core.toBeEmpty
                    
                    expect(subject.toBeEmpty()).toBeFalsy()

                it "プロパティを持つクラスに対して成立しない", ->
                    subject = expect({a: 1})
                    subject.toBeEmpty = Matchers.core.toBeEmpty
                    
                    expect(subject.toBeEmpty()).toBeFalsy()
            describe "成立するケース", ->
                it "nullに対して成立する", ->
                    subject = expect(null)
                    subject.toBeEmpty = Matchers.core.toBeEmpty
                    
                    expect(subject.toBeEmpty()).toBeTruthy()

            ###
                it "空の配列に対して成立する", ->
                    expect().toBeFail()
                it "空文字に対して成立する", ->
                    expect().toBeFail()
                it "数値型の0に対して成立する", ->
                    expect().toBeFail()
                it "プロパティを持たないクラスに対して成立する", ->
                    expect().toBeFail()
            ###
        describe ">>> toAnything", ->
            it "常に成立する", ->
                subject = expect(false)
                subject.toAnything = Matchers.core.toAnything
                
                expect(subject.toAnything()).toBeTruthy()

###                    
    describe "=== UI Matcher ====", ->
        describe "=== jQuery UI Matcher ===", ->
            beforeEach ->
                # load custom matcher
                this.addMatchers jasmine.hamcrest.Matchers.ui.jquery
            
            describe ">>> toBeOnEvent", ->
                expect().toBeFail()
            describe ">>> toBeOnEventAt", ->
                expect().toBeFail()
            
	describe "=== Spy Matcher ====", ->


		describe "toBeOnClick", ->
			it "clickイベントが引数にFunctionとともに設定された場合に成功する", ->
				expect(->).toBeFunction()
			it "clickイベント自体が空だった場合は処理に失敗する", ->
				expect(->).toBeFunction()
			# TODO 実装の拡張
		describe "toBeOnChange", ->
			it "changeイベントが発生した場合に成功する", ->
				expect().toBeFail()
			it "clickイベント自体が空だった場合は処理に失敗する", ->
				expect(->).toBeFunction()

	describe "Spy Matcher", ->
		beforeEach ->
			# load custom matcher
			this.addMatchers jasmine.hamcrest.Matchers.spy
		describe "toBeCount", ->
			expect().toBeFail()
		describe "toBeMostRecentCall", ->
			expect().toBeFail()
		describe "toBeMostPastCall", ->
			expect().toBeFail()
		describe "toBeCallAt", ->
			expect().toBeFail()

###
