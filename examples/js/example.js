/*jshint expr:true */

(function(global, $) {

	"use strict";

	/**
	 * Represents a single item in the state representation of an enquire example
	 * @constructor
	 * @param {Element} $elem The element the object will operate on
	 */
	function ExampleItem($elem) {
		this.$elem = $elem;
	}
	ExampleItem.prototype = {
		constructor : ExampleItem,

		/**
		 * sets an element's state to on
		 * @return {undefined}
		 */
		on : function() {
			this.$elem
				.removeClass(ExampleItem.states.off)
				.addClass(ExampleItem.states.on);
		},
		/**
		 * sets the element's state to off
		 * @return {undefined}
		 */
		off : function() {
			this.$elem
				.removeClass(ExampleItem.states.on)
				.addClass(ExampleItem.states.off);
		},
		/**
		 * resets an element's state
		 * @return {undefined}
		 */
		reset : function() {
			this.$elem.removeClass(ExampleItem.state.off + " " + ExampleItem.states.on);
		},
		/**
		 * sets the text of the element
		 * @param  {string} text
		 * @return {undefined}
		 */
		text : function(text) {
			this.$elem.text(text);
		}
	};
	/**
	 * Holds class names
	 * @type {Object}
	 */
	ExampleItem.states = {
		on : "example-state__item--on",
		off : "example-state__item--off"
	};

	/**
	 * Represents an example in the enquire docs
	 * @constructor
	 * @param {Element} $elem
	 */
	function Example($elem) {
		this.matchItem = new ExampleItem($elem.find(".example-state__item--matched"));
		this.setupItem   = new ExampleItem($elem.find(".example-state__item--setup"));
		this.destroyItem = new ExampleItem($elem.find(".example-state__item--destroy"));
	}
	Example.prototype = {
		constructor : Example,

		/**
		 * called when an example is matched
		 */
		match : function() {
			this.matchItem.on();
			this.matchItem.text("Matched");
		},
		/**
		 * called when an example is unmatched
		 */
		unmatch : function() {
			this.matchItem.off();
			this.matchItem.text("Unmatched");
		},
		/**
		 * called when an example is setup
		 */
		setup : function() {
			this.setupItem.on();
		},
		/**
		 * called when an example is destroyed
		 */
		destroy : function() {
			this.destroyItem.on();
		}
	};

	// latch onto global scope
	global.Example = Example;

}(this, this.Zepto || this.jQuery));