/*jshint expr:true */

(function(global, $) {

	"use strict";

	function ExampleItem($elem) {
		this.$elem = $elem;
	}
	ExampleItem.states = {
		on : "example-state__item--on",
		off : "example-state__item--off"
	};
	ExampleItem.prototype = {
		constructor : ExampleItem,

		on : function() {
			this.$elem
				.removeClass(ExampleItem.states.off)
				.addClass(ExampleItem.states.on);
		},
		off : function() {
			this.$elem
				.removeClass(ExampleItem.states.on)
				.addClass(ExampleItem.states.off);
		},
		reset : function() {
			this.$elem.removeClass(ExampleItem.state.off + " " + ExampleItem.states.on);
		},
		text : function(text) {
			this.$elem.text(text);
		}
	};

	function Example($elem) {
		this.matchItem = new ExampleItem($elem.find(".example-state__item--matched"));
		this.setupItem   = new ExampleItem($elem.find(".example-state__item--setup"));
		this.destroyItem = new ExampleItem($elem.find(".example-state__item--destroy"));
	}
	Example.prototype = {
		constructor : Example,

		match : function(matched) {
			this.matchItem.on();
			this.matchItem.text("Matched");
		},
		unmatch : function() {
			this.matchItem.off();
			this.matchItem.text("Unmatched");
		},
		setup : function() {
			this.setupItem.on();
		},
		destroy : function() {
			this.destroyItem.on();
		}
	};

	function CodeView($elem) {
		this.$elem = $elem;
		this.init();
	}
	CodeView.prototype = {
		constructor : CodeView,

		init : function() {
			this.$target = this.$elem.children("code");
			this.$source = $(this.$elem.attr("data-code-view"));
			this.$elem.removeClass("code-view--inactive");

			this.render();
		},

		render : function() {
			var source = this.$source.text();
			this.$target.text(source);
			Prism.highlightElement(this.$target[0]);
		}
	};

	$(function() {
		$("[data-code-view]").each(function() {
			new CodeView($(this));
		});
	});


	global.Example = Example;
}(this, jQuery, Prism));