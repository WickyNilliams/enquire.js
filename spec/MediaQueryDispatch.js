/*global describe: true, beforeEach: true, afterEach: true, it: true, expect: true, spyOn:true, jasmine: true, MediaQueryDispatch:true */

(function(global) {

	describe("MediaQueryDispatch", function() {

		var query = "max-width:1000px";

		it("throws if matchMedia is not present", function() {
			//arrange
			var matchMedia    = global.matchMedia;
			global.matchMedia = undefined;

			//act & assert
			expect(function() {
				var a = new MediaQueryDispatch();
			}).toThrow("matchMedia is required");

			//cleanup
			global.matchMedia = matchMedia;
		});

		it("tests for browser capability", function() {
			//arrange
			var browserIsCapable = true,
				mqd;

			spyOn(global.MediaQuery.prototype, "matchMedia").andReturn(true);

			//act
			mqd = new MediaQueryDispatch();

			//assert
			expect(global.MediaQuery.prototype.matchMedia).toHaveBeenCalled();
			expect(mqd.browserIsIncapable).toBe(!browserIsCapable);
		});

		//todo: test for isUnconditional

		it("allows a match function to be registered", function() {
			//arrange
			var mqd = new MediaQueryDispatch(),
				mediaQuery;
				
			//act
			mqd.register(query, function(){});

			//assert
			mediaQuery = mqd.queries[query];
			expect(mediaQuery).not.toBe(undefined);
			expect(mediaQuery.handlers.length).toBe(1);

		});

		it("allows handler objects to be registered", function() {
			//arrange
			var mqd = new MediaQueryDispatch(),
				mediaQuery;
				
			//act
			mqd.register(query, {});

			//assert
			mediaQuery = mqd.queries[query];
			expect(mediaQuery.handlers.length).toBe(1);
		});

		it("allows arrays of handlers to be registered", function() {
			//arrange
			var mqd      = new MediaQueryDispatch(),
				handlers = [{}, {}, {}],
				mediaQuery;
				
			//act
			mqd.register(query, handlers);

			//assert
			mediaQuery = mqd.queries[query];
			expect(mediaQuery.handlers.length).toBe(handlers.length);
		});

		it("allows multiple handlers for same query to be registered at different times", function() {
			//arrange
			var mqd            = new MediaQueryDispatch(),
				instanceSpy    = jasmine.createSpyObj("mediaQueryInstance", ["addHandler"]),
				constructorSpy = spyOn(global, "MediaQuery").andReturn(instanceSpy),
				i;

			//act
			mqd.register(query, {});
			mqd.register(query, {});

			//assert
			expect(constructorSpy.calls.length).toBe(1);
			expect(instanceSpy.addHandler.calls.length).toBe(2);
		});

		it("calls assess on each media query when fired", function() {
			//arrange
			var mqd       = new MediaQueryDispatch(),
				assessSpy = spyOn(global.MediaQuery.prototype, "assess");

			mqd.register("a", {});
			mqd.register("b", {});
				
			//act
			mqd.fire();

			//assert
			expect(assessSpy).toHaveBeenCalled();
			expect(assessSpy.calls.length).toBe(2);
		});

		it("will propagate browser event to media query", function() {
			//arrange
			var mqd       = new MediaQueryDispatch(),
				assessSpy = spyOn(global.MediaQuery.prototype, "assess"),
				evt       = {};

			mqd.register("a", {});
				
			//act
			mqd.fire(evt);

			//assert
			expect(assessSpy).toHaveBeenCalledWith(evt);
		});

		it("will listen for browser events", function() {
			//arrange
			var mqd         = new MediaQueryDispatch(),
				addEventSpy = spyOn(global, "addEventListener");
	
			//act
			mqd.listen();

			expect(addEventSpy.calls.length).toBe(2);
			expect(addEventSpy).toHaveBeenCalledWith("resize", jasmine.any(Function));
			expect(addEventSpy).toHaveBeenCalledWith("orientationChange", jasmine.any(Function));
		});

		it("allows entire queries to be unregistered", function() {
			//arrange
			var mqd      = new MediaQueryDispatch(),
				destroy  = spyOn(global.QueryHandler.prototype, "destroy"),
				handlers = [
					jasmine.createSpyObj("handler1", ["match"]),
					jasmine.createSpyObj("handler2", ["match"])
				];

			mqd.register(query, handlers);
			
			//act
			mqd.unregister(query);

			//assert
			expect(destroy.calls.length).toBe(handlers.length);
			expect(mqd.queries[query]).toBe(undefined);
		});

		it("allows individual handlers to be unregistered", function() {
			//arrange
			var mqd       = new MediaQueryDispatch(),
				removeSpy = spyOn(global.MediaQuery.prototype, "removeHandler"),
				handlers  = [
					jasmine.createSpyObj("handler1", ["match"]),
					jasmine.createSpyObj("handler2", ["match"])
				];
			
			//act
			mqd.register(query, handlers);
			mqd.unregister(query, handlers[1]);

			//assert
			expect(removeSpy.calls.length).toBe(1);
		});

		it("returns if unregistering unrecognised media query", function() {
			//arrange
			var mqd        = new MediaQueryDispatch(),
				removeSpy  = spyOn(global.MediaQuery.prototype, "removeHandler"),
				destroySpy = spyOn(global.QueryHandler.prototype, "destroy"),
				handler    = jasmine.createSpyObj("handler1", ["match"]),
				result;
			
			//act
			mqd.register(query, handler);
			result = mqd.unregister("klgfjglkfdsajflkj", handler);

			//assert
			expect(removeSpy).not.toHaveBeenCalled();
			expect(destroySpy).not.toHaveBeenCalled();
			expect(result).toBe(mqd);
		});

	});

}(this));

