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
			}).toThrow('matchMedia is required');

			// cleanup
			global.matchMedia = matchMedia;
		});

		it('tests for browser capability', function() {
			// Arrange
			var browserIsCapable = true,
				mqd;

			spyOn(global.MediaQuery.prototype, 'matchMedia').andReturn(true);

			// Act
			mqd = new MediaQueryDispatch();

			// Assert
			expect(global.MediaQuery.prototype.matchMedia).toHaveBeenCalled();
			expect(mqd.browserIsIncapable).toBe(!browserIsCapable);
		});

		//todo: test for isUnconditional

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

		it('tells media query addHandler whether currently listening', function() {
			// Arrange
			var mqd = new MediaQueryDispatch(),
				addSpy = spyOn(global.MediaQuery.prototype, 'addHandler'),
				handler = {},
				listening = true;

			mqd.listening = listening;

			// Act
			mqd.register('a', handler);

			// Assert
			expect(addSpy).toHaveBeenCalledWith(handler, listening);
		});

		it('assesses a new media query if already listening', function() {
			// Arrange
			var mqd = new MediaQueryDispatch(),
				assessSpy = spyOn(global.MediaQuery.prototype, 'assess'),
				handler = jasmine.createSpyObj('handler1', ['match']);

			spyOn(global.MediaQuery.prototype, 'matchMedia').andReturn(true);
			mqd.listening = true;

			// Act
			mqd.register('something', handler);


			// Assert
			expect(assessSpy).toHaveBeenCalled();
		});

		it('calls assess on each media query when fired', function() {
			// Arrange
			var mqd       = new MediaQueryDispatch(),
				assessSpy = spyOn(global.MediaQuery.prototype, 'assess');

			mqd.register('a', {});
			mqd.register('b', {});
				
			// Act
			mqd.fire();

			// Assert
			expect(assessSpy).toHaveBeenCalled();
			expect(assessSpy.calls.length).toBe(2);
		});

		it('will propagate browser event to media query', function() {
			// Arrange
			var mqd       = new MediaQueryDispatch(),
				assessSpy = spyOn(global.MediaQuery.prototype, 'assess'),
				evt       = {};

			mqd.register('a', {});
				
			// Act
			mqd.fire(evt);

			// Assert
			expect(assessSpy).toHaveBeenCalledWith(evt);
		});

		it('will listen for browser events', function() {
			// Arrange
			var mqd         = new MediaQueryDispatch(),
				addEventSpy = spyOn(global, 'addEventListener');

			spyOn(mqd, 'fire');
	
			// Act
			mqd.listen();

			// Assert
			expect(mqd.fire).toHaveBeenCalled();
			expect(addEventSpy.calls.length).toBe(2);
			expect(addEventSpy).toHaveBeenCalledWith('resize', jasmine.any(Function), false);
			expect(addEventSpy).toHaveBeenCalledWith('orientationChange', jasmine.any(Function), false);
		});

		it('will set listening to true and fire even if legacy browser', function() {
			// Arrange
			var mqd = new MediaQueryDispatch(),
				addEventListener = global.addEventListener;

			window.addEventListener = null;
			spyOn(mqd, 'fire');

			// Act
			mqd.listen();

			// Assert
			expect(mqd.listening).toBe(true);
			expect(mqd.fire).toHaveBeenCalled();

			window.addEventListener = addEventListener;
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

