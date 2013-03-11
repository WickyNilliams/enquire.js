/*global describe: true, beforeEach: true, it: true, expect: true, jasmine:true, spyOn: true, QueryHandler:true */

(function(global) {

	describe('QueryHandler', function() {

		'use strict';

		var options;

		beforeEach(function() {
			options = jasmine.createSpyObj('options', ['match', 'unmatch', 'setup', 'destroy']);
		});

		it('is initialised if setup not deferred', function() {
			// Arrange & act
			var handler = new QueryHandler(options);

			// Assert
			expect(handler.initialised).toBe(true);
		});

		it('is not initialised if setup deferred', function () {
			// Arrange
			options.deferSetup = true;

			// Act
			var handler = new QueryHandler(options);

			// Assert
			expect(handler.initialised).toBeFalsy();
		});

		it('stores supplied handler', function() {
			// Arrange & act
			var handler = new QueryHandler(options);

			// Assert
			expect(handler.options).toBe(options);
		});

		it('calls setup handler and sets to initialised during setup', function() {
			// Arrange
			options.deferSetup = true;
			var handler = new QueryHandler(options);

			// Act
			handler.setup();

			// Assert
			expect(options.setup).toHaveBeenCalled();
			expect(handler.initialised).toBe(true);
		});

		it('will attempt to load anything that is not a function during setup', function() {
			// Arrange
			var handler;
			options.setup = {};
			spyOn(QueryHandler.prototype, 'load');
			handler = new QueryHandler(options);

			// Act
			handler.setup();

			// Assert
			expect(handler.load).toHaveBeenCalled();
		});

		it('will call a setup function followed by on', function() {
			// Arrange
			var handler;

			options.deferSetup = true;
			handler = new QueryHandler(options);

			// Act
			handler.on();

			// Assert
			expect(options.setup).toHaveBeenCalled();
			expect(options.match).toHaveBeenCalled();
		});

		it('will push match as callback to Modernizr.load if setup is deferred', function() {
			// Arrange
			var modernizrSpy = jasmine.createSpyObj('Modernizr', ['load']),
				modernizr,
				setup = [],
				handler;

			options.deferSetup = true;
			handler = new QueryHandler(options);
			modernizr = global.Modernizr;
			global.Modernizr = modernizrSpy;

			// Act
			handler.load(setup);

			// Assert
			expect(setup.length).toBe(1);
			expect(modernizrSpy.load).toHaveBeenCalled();

			global.Modernizr = modernizr;
		});

		it('calls match handler when turned on', function() {
			// Arrange
			var handler = new QueryHandler(options);

			// Act
			handler.on();

			// Assert
			expect(options.match).toHaveBeenCalled();
		});

		it('calls unmatch handler when turned off', function() {
			// Arrange
			var handler = new QueryHandler(options);

			// Act
			handler.off();

			// Assert
			expect(options.unmatch).toHaveBeenCalled();
		});

		it('can test for equality', function() {
			// Arrange
			var handler = new QueryHandler(options),
				equalityByObject,
				equalityByFunction;

			// Act
			equalityByObject = handler.equals(options);
			equalityByFunction = handler.equals(options.match);

			// Assert
			expect(equalityByObject).toBe(true);
			expect(equalityByFunction).toBe(true);
		});

		it('calls through to destroy if supplied', function() {
			// Arrange
			var handler = new QueryHandler(options);

			// Act
			handler.destroy();

			// Assert
			expect(options.destroy).toHaveBeenCalled();
		});

		it('calls through to unmatch if destroy not available', function() {
			// Arrange
			var spy     = jasmine.createSpyObj('options', ['match', 'unmatch']),
				handler = new QueryHandler(spy);

			// Act
			handler.destroy();

			// Assert
			expect(spy.unmatch).toHaveBeenCalled();
		});


	});

}(this));

