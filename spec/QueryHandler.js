/*global describe: true, beforeEach: true, afterEach: true, it: true, expect: true, QueryHandler:true */

describe("Specs for QueryHandler type", function() {

	var options;

	beforeEach(function() {
		options = {
			match : function () {},
			unmatch : function() {},
			setup : function() {}
		};
	});

	afterEach(function() {
		options = null;
	});


	it("is initialised if setup not deferred", function() {
		var handler = new QueryHandler(options);
		
		expect(handler.initialised).toBe(true);
	});

	it("is not initialised if setup deferred", function () {
		options.deferSetup = true;
		var handler = new QueryHandler(options);

		expect(handler.initialised).toBe(false);
	});

	it("stores supplied handlers", function() {
		var handler = new QueryHandler(options);

		expect(handler.onSetup).toBe(options.setup);
		expect(handler.onMatch).toBe(options.match);
		expect(handler.onUnmatch).toEqual(options.unmatch);
	});

	it("calls setup handler and sets to initialised during setup", function() {
		var setupWasCalled = false;

		options.deferSetup = true;
		options.setup = function() {
			setupWasCalled = true;
		};

		var handler = new QueryHandler(options);
		handler.setup();

		expect(setupWasCalled).toBe(true);
		expect(handler.initialised).toBe(true);
	});

	it("calls match handler when turned on", function() {
		var matchWasCalled = false;
		
		options.match = function() {
			matchWasCalled = true;
		};

		var handler = new QueryHandler(options);
		handler.on();

		expect(matchWasCalled).toBe(true);
	});

	it("calls unmatch handler when turned off", function() {
		var unmatchWasCalled = false;
		
		options.unmatch = function() {
			unmatchWasCalled = true;
		};

		var handler = new QueryHandler(options);
		handler.off();

		expect(unmatchWasCalled).toBe(true);
	});

});