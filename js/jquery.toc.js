(function($) {

	var defaults = {
		item : "<li class='toc__item'><a></a></li>",
		container : "<ul class='toc'></ul>",
		targets : ["h1","h2", "h3"],
		destination : "body"
	};

	function TOC (elem, options) {
		this.$elem = $(elem);
		this.options = $.extend({}, defaults, options);

		this.process();
	}
	TOC.prototype = {
	
		constructor : TOC,

		generateId : function($elem) {

			var id = $.trim($elem.text())
							.split(/\s+/, 10)
							.join("-")
							.replace(/[^\w\-]*/g, "");

			$elem.prop("id", id);
			return id;
		},

		getId : function ($elem) {
			var id = $elem.prop("id");
			return id ? id : this.generateId($elem);
		},

		process : function () {
			var query = this.options.targets.join(','),
				items = this.$elem.find(query);

			return this.render(items);
		},

		render : function ($items) {
			var self = this;

			$items = $items.map(function (i, item) {
				return self.renderItem(item);
			});

			$(this.options.container)
				.append($items)
				.appendTo(this.options.destination);

			return this;
		},

		linkify : function($anchor, $item) {
			var text = $item.data("tocTitle") || $item.text(),
				itemId = this.getId($item);

			$anchor.prop("href", "#" + itemId).text(text);
		},

		renderItem : function(item) {
			var $item = $(item),
				$template = $(this.options.item);

			$template.addClass(item.tagName.toLowerCase());
			this.linkify($template.find("a"), $item);
			return $template[0];
		}
	};

	$.fn.toc = function (opts) {
		return this.each(function () {
			var $this = $(this),
				data = $this.data("toc"),
				options = typeof opts === "object" && opts;

			if(!data) {
				data = new TOC($this, options);
				//$this.data("toc", data);
			}
		});
	};
	$.fn.toc.defaults = defaults;

}(window.jQuery || window.Zepto));