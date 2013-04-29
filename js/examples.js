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
		on : "example__state--on",
		off : "example__state--off"
	};

	/**
	 * Represents an example in the enquire docs
	 * @constructor
	 * @param {Element} $elem
	 */
	function Example($elem) {
		this.matchItem = new ExampleItem($elem.find("[data-example-match]"));
		this.setupItem   = new ExampleItem($elem.find("[data-example-setup]"));
		this.destroyItem = new ExampleItem($elem.find("[data-example-destroy]"));
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
/*jshint expr:true */

(function(global, $, Prism) {

	"use strict";

	/**
	 * @constructor
	 * A helper for rendering example scripts into pre tags with syntax highlighting
	 */
	function CodeView($elem) {
		this.$elem = $elem;
	}
	CodeView.prototype = {
		constructor : CodeView,

		/**
		 * @function
		 * initialises the object
		 */
		init : function() {
			this.$target = this.$elem.children("code");
			this.$source = $(this.$elem.attr("data-code-view"));
			this.$elem.removeClass("code-view--inactive");

			this.render();
		},

		/**
		 * @function
		 * renders the elemtn
		 */
		render : function() {
			var source = this.$source.text();
			this.$target.text(source);
			Prism.highlightElement(this.$target[0]);
		}
	};

	// helper for working with jQuery
	var attachToElems = function ($elems) {
		$elems.each(function(){
			var codeView = new CodeView($(this));
			codeView.init();
		});
	};

	$.fn.codeView = function() {
		attachToElems(this);
	};

	// declarative API
	$(function() {
		attachToElems($("[data-code-view]"));
	});

}(this, this.Zepto || this.jQuery, this.Prism));