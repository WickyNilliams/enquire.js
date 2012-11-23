/*global describe: true, beforeEach: true, afterEach: true, it: true, expect: true, jasmine:true, QueryHandler:true */

describe('QueryHandler', function() {

	'use strict';

	var options;

	beforeEach(function() {
		options = jasmine.createSpyObj('options', ['match', 'unmatch', 'setup', 'destroy']);
	});

	afterEach(function() {
		//tear down
	});

	it('is initialised if setup not deferred', function() {
		//arrange & act
		var handler = new QueryHandler(options);
		
		//assert
		expect(handler.initialised).toBe(true);
	});

	it('is not initialised if setup deferred', function () {

		//arrange
		options.deferSetup = true;

		//act
		var handler = new QueryHandler(options);

		//assert
		expect(handler.initialised).toBe(false);
	});

	it('stores supplied handler', function() {
		//arrange & act
		var handler = new QueryHandler(options);

		//assert
		expect(handler.options).toBe(options);
	});

	it('calls setup handler and sets to initialised during setup', function() {
		
		//arrange
		options.deferSetup = true;
		var handler = new QueryHandler(options);

		//act
		handler.setup();

		//assert
		expect(options.setup).toHaveBeenCalled();
		expect(handler.initialised).toBe(true);
	});

	it('calls match handler when turned on', function() {
		//arrange
		var handler = new QueryHandler(options);

		//act
		handler.on();

		//assert
		expect(options.match).toHaveBeenCalled();
	});

	it('calls unmatch handler when turned off', function() {
		//arrange
		var handler = new QueryHandler(options);

		//act
		handler.off();

		//assert
		expect(options.unmatch).toHaveBeenCalled();
	});

	it('can test for equality', function() {
		//arrange
		var handler = new QueryHandler(options),
			equalityByObject,
			equalityByFunction;

		//act
		equalityByObject = handler.equals(options);
		equalityByFunction = handler.equals(options.match);

		//assert
		expect(equalityByObject).toBe(true);
		expect(equalityByFunction).toBe(true);
	});

	it('calls through to destroy if supplied', function() {
		//arrange
		var handler = new QueryHandler(options);

		//act
		handler.destroy();

		//assert
		expect(options.destroy).toHaveBeenCalled();
	});

	it('calls through to unmatch if destroy not available', function() {
		//arrange
		var spy     = jasmine.createSpyObj('options', ['match', 'unmatch']),
			handler = new QueryHandler(spy);

		//act
		handler.destroy();

		//assert
		expect(spy.unmatch).toHaveBeenCalled();
	});


});