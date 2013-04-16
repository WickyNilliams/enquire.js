/*global describe: true, it: true, expect: true, spyOn:true, jasmine: true, MediaQueryDispatch:true */

(function(global) {

	'use strict';

	describe('MediaQueryDispatch', function() {

		var query = 'max-width:1000px';

		it('throws if matchMedia is not present', function() {
			// Arrange
			var matchMedia    = global.matchMedia;
			global.matchMedia = undefined;

			// Act & assert
			expect(function() {
				new MediaQueryDispatch();
			}).toThrow('matchMedia not present, legacy browsers require a polyfill');

			// Cleanup
			global.matchMedia = matchMedia;
		});

		it('tests for browser capability', function() {
			// Arrange
			var browserIsCapable = true,
				mqd;

			spyOn(global, 'matchMedia').andReturn({matches: browserIsCapable});

			// Act
			mqd = new MediaQueryDispatch();

			// Assert
			expect(global.matchMedia).toHaveBeenCalled();
			expect(mqd.browserIsIncapable).toBe(!browserIsCapable);
		});

		//TODO: test for isUnconditional

		it('allows a match function to be registered', function() {
			// Arrange
			var mqd = new MediaQueryDispatch(),
				mediaQuery;

			// Act
			mqd.register(query, function(){});

			// Assert
			mediaQuery = mqd.queries[query];
			expect(mediaQuery).not.toBe(undefined);
			expect(mediaQuery.handlers.length).toBe(1);

		});

		it('allows handler objects to be registered', function() {
			// Arrange
			var mqd = new MediaQueryDispatch(),
				mediaQuery;

			// Act
			mqd.register(query, {});

			// Assert
			mediaQuery = mqd.queries[query];
			expect(mediaQuery.handlers.length).toBe(1);
		});

		it('allows arrays of handlers to be registered', function() {
			// Arrange
			var mqd      = new MediaQueryDispatch(),
				handlers = [{}, {}, {}],
				mediaQuery;

			// Act
			mqd.register(query, handlers);

			// Assert
			mediaQuery = mqd.queries[query];
			expect(mediaQuery.handlers.length).toBe(handlers.length);
		});

		it('allows multiple handlers for same query to be registered at different times', function() {
			// Arrange
			var mqd            = new MediaQueryDispatch(),
				instanceSpy    = jasmine.createSpyObj('mediaQueryInstance', ['addHandler']),
				constructorSpy = spyOn(global, 'MediaQuery').andReturn(instanceSpy);

			// Act
			mqd.register(query, {});
			mqd.register(query, {});

			// Assert
			expect(constructorSpy.calls.length).toBe(1);
			expect(instanceSpy.addHandler.calls.length).toBe(2);
		});

		it('allows entire queries to be unregistered', function() {
			// Arrange
			var mqd      = new MediaQueryDispatch(),
				destroy  = spyOn(global.QueryHandler.prototype, 'destroy'),
				handlers = [
					jasmine.createSpyObj('handler1', ['match']),
					jasmine.createSpyObj('handler2', ['match'])
				];

			mqd.register(query, handlers);

			// Act
			mqd.unregister(query);

			// Assert
			expect(destroy.calls.length).toBe(handlers.length);
			expect(mqd.queries[query]).toBe(undefined);
		});

		it('allows individual handlers to be unregistered', function() {
			// Arrange
			var mqd       = new MediaQueryDispatch(),
				removeSpy = spyOn(global.MediaQuery.prototype, 'removeHandler'),
				handlers  = [
					jasmine.createSpyObj('handler1', ['match']),
					jasmine.createSpyObj('handler2', ['match'])
				];

			// Act
			mqd.register(query, handlers);
			mqd.unregister(query, handlers[1]);

			// Assert
			expect(removeSpy.calls.length).toBe(1);
		});

		it('returns if unregistering unrecognised media query', function() {
			// Arrange
			var mqd        = new MediaQueryDispatch(),
				removeSpy  = spyOn(global.MediaQuery.prototype, 'removeHandler'),
				destroySpy = spyOn(global.QueryHandler.prototype, 'destroy'),
				handler    = jasmine.createSpyObj('handler1', ['match']),
				result;

			// Act
			mqd.register(query, handler);
			result = mqd.unregister('klgfjglkfdsajflkj', handler);

			// Assert
			expect(removeSpy).not.toHaveBeenCalled();
			expect(destroySpy).not.toHaveBeenCalled();
			expect(result).toBe(mqd);
		});

	});

}(this));

