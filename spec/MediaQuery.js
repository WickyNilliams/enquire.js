/*global describe: true, beforeEach: true, it: true, xit: true, expect: true, jasmine:true, spyOn:true, MediaQuery:true */

(function(global) {

	'use strict';

	describe('MediaQuery', function() {

		var handler,
			mq;

		beforeEach(function() {
			mq      = new MediaQuery('((max-width:1000px))');
			handler = jasmine.createSpyObj('handler', ['match', 'unmatch', 'setup']);
		});

		it('will add a media query listener when constructed', function() {
			var mql = jasmine.createSpyObj('mql', ['addListener']),
				mq;
			spyOn(global, 'matchMedia').andReturn(mql);

			mq = new MediaQuery('(max-width: 1000px)');

			expect(mql.addListener).toHaveBeenCalledWith(mq.listener);
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

		it('will turn on handler when added if query is already matching', function() {
			// Arrange
			spyOn(global, 'matchMedia').andReturn({matches:true, addListener : function() {}});
			mq = new MediaQuery('(max-width:1000px)');

			// Act
			mq.addHandler(handler);

			// Assert
			expect(handler.match).toHaveBeenCalled();
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

		it('can be short-circuited with isUnconditional flag', function() {
			// Arrange
			mq.isUnconditional = true;

			// Act
			mq.addHandler(handler);
			mq.assess();

			// Assert
			expect(handler.match).toHaveBeenCalled();
		});

		it('destroys all handlers and removes listener when cleared', function() {
			var handler1 = jasmine.createSpyObj('handler', ['match', 'unmatch']),
				handler2 = jasmine.createSpyObj('handler', ['match', 'unmatch']);

			mq.mql = jasmine.createSpyObj('mql',['addListener', 'removeListener']);

			mq.addHandler(handler1);
			mq.addHandler(handler2);

			mq.clear();

			expect(handler1.unmatch).toHaveBeenCalled();
			expect(handler2.unmatch).toHaveBeenCalled();
			expect(mq.mql.removeListener).toHaveBeenCalledWith(mq.listener);
			expect(mq.handlers.length).toBe(0);
		});

		xit('calls matchMedia every time to workaround polyfill issue', function() {
			spyOn(global, 'matchMedia').andReturn({matches:true});

			mq.matchMedia();
			mq.matchMedia();

			expect(global.matchMedia.calls.length).toBe(2);
		});

	});

}(this));