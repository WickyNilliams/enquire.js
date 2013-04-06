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

	// declarative API
	$(function() {
		$("[data-code-view]").each(function() {
			var codeView = new CodeView($(this));
			codeView.init();
		});
	});

}(this, this.Zepto || this.jQuery, this.Prism));