/*global describe: true, beforeEach: true, it: true, expect: true, jasmine:true, spyOn:true, MediaQuery:true */

(function(global) {

	'use strict';

	describe('MediaQuery', function() {

		var handler,
			mq;

		beforeEach(function() {
			mq      = new MediaQuery('max-width:1000px');
			handler = jasmine.createSpyObj('handler', ['match', 'unmatch', 'setup']);
		});


		it('can accept new handlers', function() {
			// Arrange
			var originalLength = mq.handlers.length;

			// Act
			mq.addHandler(handler);

			// Assert
			expect(originalLength).toBe(0);
			expect(mq.handlers.length).toBe(1);
		});

		it('will turn on handler when added, if query is already matched and is listening', function() {
			// Arrange
			var handler2 = jasmine.createSpyObj('handler2', ['match', 'unmatch', 'setup']),
				handler3 = jasmine.createSpyObj('handler3', ['match', 'unmatch', 'setup']);

			// Act

			// not matched and not listening
			mq.addHandler(handler);

			// matched but not listening
			mq.matched = true;
			mq.addHandler(handler2);

			// matched and listening
			mq.addHandler(handler3, true);

			// Assert
			expect(handler.match).not.toHaveBeenCalled();
			expect(handler2.match).not.toHaveBeenCalled();
			expect(handler3.match).toHaveBeenCalled();
		});

		it('can remove handlers', function() {
			// Arrange
			var handler2 = jasmine.createSpyObj('handler', ['match', 'unmatch']),
				splice   = spyOn(Array.prototype, 'splice').andCallThrough(),
				equals   = spyOn(global.QueryHandler.prototype, 'equals').andCallThrough(),
				destroy  = spyOn(global.QueryHandler.prototype, 'destroy'),
				length;

			mq.addHandler(handler);
			mq.addHandler(handler2);

			length = mq.handlers.length;

			// Act
			mq.removeHandler(handler);

			// Assert
			expect(mq.handlers.length).toBe(length-1);
			expect(equals.calls.length).not.toBe(length); // ensure early exit
			expect(destroy.calls.length).toBe(1); // destroy called just once
			expect(splice.calls.length).toBe(1); // splice called just once
			expect(splice).toHaveBeenCalledWith(0,1); // splice called with correct args
		});

		it('turns on handler if not yet matching', function() {
			// Arrange
			mq.addHandler(handler);
			mq.matched = false;
			
			// Act
			mq.match();

			// Assert
			expect(handler.match).toHaveBeenCalled();
			expect(mq.matched).toBe(true);
		});

		it('does not turn on handler if already matching', function() {
			// Arrange
			mq.addHandler(handler);
			mq.matched = true;
			
			// Act
			mq.match();

			// Assert
			expect(handler.match).not.toHaveBeenCalled();
			expect(mq.matched).toBe(true);
		});

		it('turns off handler if already matching', function() {
			// Arrange
			mq.addHandler(handler);
			mq.matched = true;
			
			// Act
			mq.unmatch();

			// Assert
			expect(handler.unmatch).toHaveBeenCalled();
			expect(mq.matched).toBe(false);
		});

		it('does not turn off handler if not yet matching', function() {
			// Arrange
			mq.addHandler(handler);
			mq.matched = false;
			
			// Act
			mq.unmatch();

			// Assert
			expect(handler.unmatch).not.toHaveBeenCalled();
			expect(mq.matched).toBe(false);
		});

		it('will call unmatch if media query doesn\'t match', function() {
			// Arrange
			mq.addHandler(handler);
			mq.matched = true;

			// Act
			mq.assess();

			// Assert
			expect(handler.unmatch).toHaveBeenCalled();
			expect(mq.matched).toBe(false);
		});

		it('will propagate browser event to query handlers', function() {
			// Arrange
			var evt = {};
			spyOn(mq, 'unmatch');
			spyOn(mq, 'match');

			// Act
			mq.assess(evt);
			mq.isUnconditional = true; // forces match to be called
			mq.assess(evt);

			// Assert
			expect(mq.unmatch).toHaveBeenCalledWith(evt);
			expect(mq.match).toHaveBeenCalledWith(evt);
		});

		it('can be short-circuited with isUnconditional flag', function() {
			// Arrange
			mq.isUnconditional = true;

			// Act
			mq.addHandler(handler);
			mq.assess();

			// Assert
			expect(handler.match).toHaveBeenCalled();
		});

		it('calls matchMedia every time to workaround polyfill issue', function() {
			spyOn(global, 'matchMedia').andReturn({matches:true});

			mq.matchMedia();
			mq.matchMedia();

			expect(global.matchMedia.calls.length).toBe(2);
		});

	});

}(this));
	