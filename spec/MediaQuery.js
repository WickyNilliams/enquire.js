/*global describe: true, beforeEach: true, afterEach: true, it: true, expect: true, jasmine:true, MediaQuery:true */

(function(global) {
	describe("MediaQuery", function() {

		var handler,
			mq;

		beforeEach(function() {
			mq = new MediaQuery("max-width:1000px");
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

		it("can be short-circuited with isUnconditional flag", function() {
			//arrange
			mq.isUnconditional = true;

			//act
			mq.addHandler(handler);
			mq.assess();

			//assert
			expect(handler.match).toHaveBeenCalled();
		});

	});

}(this));
	