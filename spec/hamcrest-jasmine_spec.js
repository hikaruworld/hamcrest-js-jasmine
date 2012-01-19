var Matchers;

Matchers = jasmine.hamcrest.Matchers;

describe("expectの拡張matcher", function() {
  return describe("=== core Matcher ====", function() {
    beforeEach(function() {
      return this.addMatchers(jasmine.hamcrest.Matchers.core);
    });
    describe(">>> toBeFunction", function() {
      it("関数である場合は成功する", function() {
        return expect(function() {}).toBeFunction();
      });
      it("nullの場合は失敗する", function() {
        return expect(null).not.toBeFunction();
      });
      it("文字列の場合は失敗する", function() {
        return expect("hamcrest...").not.toBeFunction();
      });
      return it("クラスの場合は失敗する", function() {
        return expect({}).not.toBeFunction();
      });
    });
    describe(">>> toBeFail", function() {
      it("常に失敗する", function() {
        return expect().not.toBeFail();
      });
      return it("引数は考慮しない", function() {
        return expect(true).not.toBeFail();
      });
    });
    describe(">>> toAllOf", function() {
      describe("falseつまり正しくないと判断されるパターン", function() {
        describe("引数を渡さずに処理する場合", function() {
          it("nullである", function() {
            var subject;
            subject = expect(null);
            subject.toAllOf = Matchers.core.toAllOf;
            return expect(subject.toAllOf()).toBeFalsy();
          });
          it("空である", function() {
            var subject;
            subject = expect([]);
            subject.toAllOf = Matchers.core.toAllOf;
            return expect(subject.toAllOf()).toBeFalsy();
          });
          it("関数である", function() {
            var subject;
            subject = expect(function() {});
            subject.toAllOf = Matchers.core.toAllOf;
            return expect(subject.toAllOf()).toBeFalsy();
          });
          return it("クラスである", function() {
            var subject;
            subject = expect({});
            subject.toAllOf = Matchers.core.toAllOf;
            return expect(subject.toAllOf()).toBeFalsy();
          });
        });
        return describe("引数を渡して処理する場合", function() {
          var expected, subject;
          subject = expect("dummy");
          expected = null;
          beforeEach(function() {
            var failFlag;
            subject.toAllOf = Matchers.core.toAllOf;
            failFlag = false;
            spyOn(subject, "toContain").andCallFake(function() {
              return failFlag = !this.env.contains_(expected, arguments[0]);
            });
            return spyOn(subject.spec, "results").andCallFake(function() {
              return {
                failedCount: failFlag ? 1 : 0
              };
            });
          });
          it("該当文字が含まれない", function() {
            subject.actual = expected = "abcdefg";
            return expect(subject.toAllOf("G")).toBeFalsy();
          });
          it("該当文字が全て含まれない", function() {
            subject.actual = expected = [1, 2, 3, 4, 5, 6];
            return expect(subject.toAllOf(20, 33, 0)).toBeFalsy();
          });
          it("該当文字が含まれているものと含まれていないものが混在している", function() {
            subject.actual = expected = "abcdefg";
            return expect(subject.toAllOf("a", 1)).toBeFalsy();
          });
          return afterEach(function() {
            expect(subject.toContain).toHaveBeenCalled();
            return expect(subject.spec.results).toHaveBeenCalled();
          });
        });
      });
      return describe("trueつまり正しいと判断されるパターン", function() {
        it("該当の文字が含まれている", function() {
          var subject;
          subject = expect("aiueokakikukeo");
          subject.toAllOf = Matchers.core.toAllOf;
          return expect(subject.toAllOf("eo")).toBeTruthy();
        });
        it("該当の文字が全て含まれている", function() {
          var subject;
          subject = expect("aiueokakikukeo");
          subject.toAllOf = Matchers.core.toAllOf;
          return expect(subject.toAllOf("eo", "ai")).toBeTruthy();
        });
        return it("別のexpectで失敗した場合にこのtoAllOfに影響が出ないこと(this.spectで検証しているため", function() {
          var subject;
          subject = expect([1, 2, 3, 4, 5]);
          subject.toAllOf = Matchers.core.toAllOf;
          subject.not.toEqual(1);
          return expect(subject.toAllOf(1, 5)).toBeTruthy();
        });
      });
    });
    describe(">>> toAnyOf", function() {
      describe("falseつまり正しくないと判断されるパターン", function() {
        describe("引数を渡さずに処理する場合", function() {
          it("nullである", function() {
            var subject;
            subject = expect(null);
            subject.toAnyOf = Matchers.core.toAnyOf;
            return expect(subject.toAnyOf()).toBeFalsy();
          });
          it("空である", function() {
            var subject;
            subject = expect([]);
            subject.toAnyOf = Matchers.core.toAnyOf;
            return expect(subject.toAnyOf()).toBeFalsy();
          });
          it("関数である", function() {
            var subject;
            subject = expect(function() {});
            subject.toAnyOf = Matchers.core.toAnyOf;
            return expect(subject.toAnyOf()).toBeFalsy();
          });
          return it("クラスである", function() {
            var subject;
            subject = expect({});
            subject.toAnyOf = Matchers.core.toAnyOf;
            return expect(subject.toAnyOf()).toBeFalsy();
          });
        });
        return describe("引数が存在する上で処理する場合", function() {
          return it("該当文字が含まれない", function() {
            var subject;
            subject = expect("123456");
            subject.toAnyOf = Matchers.core.toAnyOf;
            return expect(subject.toAnyOf("A")).toBeFalsy();
          });
        });
      });
      return describe("true:正しいと判断されるパターン", function() {
        it("期待する文字が含まれる", function() {
          var subject;
          subject = expect([1, 2, 3, 4, 5]);
          subject.toAnyOf = Matchers.core.toAnyOf;
          return expect(subject.toAnyOf(3)).toBeTruthy();
        });
        it("期待する文字のいずれかが含まれる", function() {
          var subject;
          subject = expect("ABCDEFG");
          subject.toAnyOf = Matchers.core.toAnyOf;
          return expect(subject.toAnyOf("A", 1)).toBeTruthy();
        });
        return it("期待する文字の全てが含まれる", function() {
          var subject;
          subject = expect(["A", "B", "C"]);
          subject.toAnyOf = Matchers.core.toAnyOf;
          return expect(subject.toAnyOf("A", "B", "C")).toBeTruthy();
        });
      });
    });
    describe(">>> toBeEveryItem", function() {
      describe("Falseになる仕様", function() {
        it("nullに対する比較は成立しない", function() {
          var subject;
          subject = expect(null);
          subject.toBeEveryItem = Matchers.core.toBeEveryItem;
          return expect(subject.toBeEveryItem()).toBeFalsy();
        });
        it("関数に対する比較は成立しない", function() {
          var subject;
          subject = expect(function() {});
          subject.toBeEveryItem = Matchers.core.toBeEveryItem;
          return expect(subject.toBeEveryItem()).toBeFalsy();
        });
        it("クラスに対する比較は成立しない", function() {
          var subject;
          subject = expect({});
          subject.toBeEveryItem = Matchers.core.toBeEveryItem;
          return expect(subject.toBeEveryItem()).toBeFalsy();
        });
        it("期待値が、『空文字空、空配列、関数, null、undefined』の場合には成立しない", function() {
          var item, subject, _i, _len, _ref, _results;
          _ref = ["", null, {}, [], void 0, function() {}];
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            item = _ref[_i];
            subject = expect(item);
            subject.toBeEveryItem = Matchers.core.toBeEveryItem;
            _results.push(expect(subject.toBeEveryItem(item)).toBeFalsy());
          }
          return _results;
        });
        return it("合致するものもあるが違うものも混在する場合は成立しない", function() {
          var subject;
          subject = expect(["ABC", "ABC", "ABCE"]);
          subject.toBeEveryItem = Matchers.core.toBeEveryItem;
          return expect(subject.toBeEveryItem("ABC")).toBeFalsy();
        });
      });
      return describe("Trueになる仕様", function() {
        it("配列の要素が全て同じである", function() {
          var subject;
          subject = expect(["ABC", "ABC", "ABC"]);
          subject.toBeEveryItem = Matchers.core.toBeEveryItem;
          return expect(subject.toBeEveryItem("ABC")).toBeTruthy();
        });
        return it("配列ではない任意の値が全て同じである", function() {
          var subject;
          subject = expect("ABCDEFG");
          subject.toBeEveryItem = Matchers.core.toBeEveryItem;
          return expect(subject.toBeEveryItem("ABCDEFG")).toBeTruthy();
        });
      });
    });
    describe(">>> toStartsWith", function() {
      describe("不成立になる仕様", function() {
        it("クラスに対しては成立しない", function() {
          var subject;
          subject = expect({});
          subject.toStartsWith = Matchers.core.toStartsWith;
          return expect(subject.toStartsWith({})).toBeFalsy();
        });
        it("関数に対しては成立しない", function() {
          var subject;
          subject = expect(function() {});
          subject.toStartsWith = Matchers.core.toStartsWith;
          return expect(subject.toStartsWith(function() {})).toBeFalsy();
        });
        it("配列に対しては成立しない", function() {
          var subject;
          subject = expect([1, 2, 3]);
          subject.toStartsWith = Matchers.core.toStartsWith;
          return expect(subject.toStartsWith(1)).toBeFalsy();
        });
        it("存在しない値(null, undefined)に対しては成立しない", function() {
          var item, subject, _i, _len, _ref, _results;
          _ref = [null, void 0];
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            item = _ref[_i];
            subject = expect(item);
            subject.toStartsWith = Matchers.core.toStartsWith;
            _results.push(expect(subject.toStartsWith(item)).toBeFalsy());
          }
          return _results;
        });
        it("空値('', [])に対しては成立しない", function() {
          var item, subject, _i, _len, _ref, _results;
          _ref = ["", []];
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            item = _ref[_i];
            subject = expect(item);
            subject.toStartsWith = Matchers.core.toStartsWith;
            _results.push(expect(subject.toStartsWith(item)).toBeFalsy());
          }
          return _results;
        });
        return it("期待値値が異なる場合に成立しない", function() {
          var subject;
          subject = expect("ebcdefg");
          subject.toStartsWith = Matchers.core.toStartsWith;
          return expect(subject.toStartsWith("bcdef")).toBeFalsy();
        });
      });
      return describe("成立する仕様", function() {
        it("期待値と全く同じ値の場合に成立する", function() {
          var subject;
          subject = expect("abcdefg");
          subject.toStartsWith = Matchers.core.toStartsWith;
          return expect(subject.toStartsWith("abcdefg")).toBeTruthy();
        });
        return it("期待値が結果のprefixとして同じ値の場合に成立する", function() {
          var subject;
          subject = expect("abcdefg");
          subject.toStartsWith = Matchers.core.toStartsWith;
          return expect(subject.toStartsWith("abc")).toBeTruthy();
        });
      });
    });
    describe(">>> toEndsWith", function() {
      describe("不成立になる仕様", function() {
        it("クラスに対しては成立しない", function() {
          var subject;
          subject = expect({});
          subject.toEndsWith = Matchers.core.toEndsWith;
          return expect(subject.toEndsWith({})).toBeFalsy();
        });
        it("関数に対しては成立しない", function() {
          var subject;
          subject = expect(function() {});
          subject.toEndsWith = Matchers.core.toEndsWith;
          return expect(subject.toEndsWith(function() {})).toBeFalsy();
        });
        it("配列に対しては成立しない", function() {
          var subject;
          subject = expect([1, 2, 3]);
          subject.toEndsWith = Matchers.core.toEndsWith;
          return expect(subject.toEndsWith([1, 2, 3])).toBeFalsy();
        });
        it("存在しない値(null, undefined)に対しては成立しない", function() {
          var item, subject, _i, _len, _ref, _results;
          _ref = [null, void 0];
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            item = _ref[_i];
            subject = expect(item);
            subject.toEndsWith = Matchers.core.toEndsWith;
            _results.push(expect(subject.toEndsWith(item)).toBeFalsy());
          }
          return _results;
        });
        it("空値('', [])に対しては成立しない", function() {
          var item, subject, _i, _len, _ref, _results;
          _ref = ["", []];
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            item = _ref[_i];
            subject = expect(item);
            subject.toEndsWith = Matchers.core.toEndsWith;
            _results.push(expect(subject.toEndsWith(item)).toBeFalsy());
          }
          return _results;
        });
        return it("期待値値が異なる場合に成立しない", function() {
          var subject;
          subject = expect("ABCDEF");
          subject.toEndsWith = Matchers.core.toEndsWith;
          return expect(subject.toEndsWith("a")).toBeFalsy();
        });
      });
      return describe("成立する仕様", function() {
        it("期待値と全く同じ値の場合に成立する", function() {
          var subject;
          subject = expect("ABCDEFG");
          subject.toEndsWith = Matchers.core.toEndsWith;
          return expect(subject.toEndsWith("ABCDEFG")).toBeTruthy();
        });
        return it("期待値が結果のsufixとして同じ値の場合に成立する", function() {
          var subject;
          subject = expect("ABCDEFG");
          subject.toEndsWith = Matchers.core.toEndsWith;
          return expect(subject.toEndsWith("FG")).toBeTruthy();
        });
      });
    });
    describe(">>> toBeEmpty", function() {
      describe("成立しないケース", function() {
        it("undefinedに対して成立しない", function() {
          var subject;
          subject = expect(void 0);
          subject.toBeEmpty = Matchers.core.toBeEmpty;
          return expect(subject.toBeEmpty()).toBeFalsy();
        });
        it("関数に対しては成立しない", function() {
          var subject;
          subject = expect(function() {});
          subject.toBeEmpty = Matchers.core.toBeEmpty;
          return expect(subject.toBeEmpty()).toBeFalsy();
        });
        it("boolean(true, false)に対しては成立しない", function() {
          var item, subject, _i, _len, _ref, _results;
          _ref = [true, false];
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            item = _ref[_i];
            subject = expect(item);
            subject.toBeEmpty = Matchers.core.toBeEmpty;
            _results.push(expect(subject.toBeEmpty()).toBeFalsy());
          }
          return _results;
        });
        it("マイナス値に対しては成立しない", function() {
          var subject;
          subject = expect(-100);
          subject.toBeEmpty = Matchers.core.toBeEmpty;
          return expect(subject.toBeEmpty()).toBeFalsy();
        });
        it("プラス値に対しては成立しない", function() {
          var subject;
          subject = expect(2500);
          subject.toBeEmpty = Matchers.core.toBeEmpty;
          return expect(subject.toBeEmpty()).toBeFalsy();
        });
        it("値を持つ配列に対して成立しない", function() {
          var subject;
          subject = expect([1, 2, 3]);
          subject.toBeEmpty = Matchers.core.toBeEmpty;
          return expect(subject.toBeEmpty()).toBeFalsy();
        });
        it("値を持つ文字列に対して成立しない", function() {
          var subject;
          subject = expect("BACB");
          subject.toBeEmpty = Matchers.core.toBeEmpty;
          return expect(subject.toBeEmpty()).toBeFalsy();
        });
        return it("プロパティを持つクラスに対して成立しない", function() {
          var subject;
          subject = expect({
            a: 1
          });
          subject.toBeEmpty = Matchers.core.toBeEmpty;
          return expect(subject.toBeEmpty()).toBeFalsy();
        });
      });
      return describe("成立するケース", function() {
        return it("nullに対して成立する", function() {
          var subject;
          subject = expect(null);
          subject.toBeEmpty = Matchers.core.toBeEmpty;
          return expect(subject.toBeEmpty()).toBeTruthy();
        });
      });
      /*
                      it "空の配列に対して成立する", ->
                          expect().toBeFail()
                      it "空文字に対して成立する", ->
                          expect().toBeFail()
                      it "数値型の0に対して成立する", ->
                          expect().toBeFail()
                      it "プロパティを持たないクラスに対して成立する", ->
                          expect().toBeFail()
      */
    });
    return describe(">>> toAnything", function() {
      return it("常に成立する", function() {
        var subject;
        subject = expect(false);
        subject.toAnything = Matchers.core.toAnything;
        return expect(subject.toAnything()).toBeTruthy();
      });
    });
  });
});

/*                    
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
*/
