/*global describe: true, beforeEach: true, afterEach: true, it: true, expect: true, jasmine:true, spyOn:true, MediaQuery:true */

(function(global) {
	describe("MediaQuery", function() {

		var handler,
			mq;

		beforeEach(function() {
			mq      = new MediaQuery("max-width:1000px");
			handler = jasmine.createSpyObj("handler", ["match", "unmatch", "setup"]);
		});

		it("can accept new handlers", function() {
			//arrange
			var originalLength = mq.handlers.length;

			//act
			mq.addHandler(handler);

			//assert
			expect(originalLength).toBe(0);
			expect(mq.handlers.length).toBe(1);
		});

		it("can remove handlers", function() {
			//arrange
			var handler2 = jasmine.createSpyObj("handler", ["match", "unmatch"]),
				splice   = spyOn(Array.prototype, "splice").andCallThrough(),
				equals   = spyOn(global.QueryHandler.prototype, "equals").andCallThrough(),
				destroy  = spyOn(global.QueryHandler.prototype, "destroy"),
				length;

			mq.addHandler(handler);
			mq.addHandler(handler2);

			length = mq.handlers.length;

			//act
			mq.removeHandler(handler);

			//assert
			expect(mq.handlers.length).toBe(length-1);
			expect(equals.calls.length).not.toBe(length); //ensure early exit
			expect(destroy.calls.length).toBe(1); //destroy called just once
			expect(splice.calls.length).toBe(1); //splice called just once
			expect(splice).toHaveBeenCalledWith(0,1); //splice called with correct args
		});

		it("turns on handler if not yet matching", function() {
			//arrange
			mq.addHandler(handler);
			mq.matched = false;
			
			//act
			mq.match();

			//assert
			expect(handler.match).toHaveBeenCalled();
			expect(mq.matched).toBe(true);
		});

		it("does not turn on handler if already matching", function() {
			//arrange
			mq.addHandler(handler);
			mq.matched = true;
			
			//act
			mq.match();

			//assert
			expect(handler.match).not.toHaveBeenCalled();
			expect(mq.matched).toBe(true);
		});

		it("turns off handler if already matching", function() {
			//arrange
			mq.addHandler(handler);
			mq.matched = true;
			
			//act
			mq.unmatch();

			//assert
			expect(handler.unmatch).toHaveBeenCalled();
			expect(mq.matched).toBe(false);
		});

		it("does not turn off handler if not yet matching", function() {
			//arrange
			mq.addHandler(handler);
			mq.matched = false;
			
			//act
			mq.unmatch();

			//assert
			expect(handler.unmatch).not.toHaveBeenCalled();
			expect(mq.matched).toBe(false);
		});

		it("will call unmatch if media query doesn't match", function() {
			//arrange
			mq.addHandler(handler);
			mq.matched = true;

			//act
			mq.assess();

			//assert
			expect(handler.unmatch).toHaveBeenCalled();
			expect(mq.matched).toBe(false);
		});

		it("will propagate browser event to query handlers", function() {
			//arrange
			var evt = {};
			spyOn(mq, "unmatch");
			spyOn(mq, "match");

			//act
			mq.assess(evt);
			mq.isUnconditional = true; // forces match to be called
			mq.assess(evt);

			//assert
			expect(mq.unmatch).toHaveBeenCalledWith(evt);
			expect(mq.match).toHaveBeenCalledWith(evt);
		});

		it("can be short-circuited with isUnconditional flag", function() {
			//arrange
			mq.isUnconditional = true;

			//act
			mq.addHandler(handler);
			mq.assess();

			//assert
			expect(handler.match).toHaveBeenCalled();
		});

		it("calls matchMedia every time to workaround polyfill issue", function() {
			spyOn(global, "matchMedia").andReturn({matches:true});

			mq.matchMedia();
			mq.matchMedia();

			expect(global.matchMedia.calls.length).toBe(2);
		});

	});

}(this));
	