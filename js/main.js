/*jshint laxbreak:true */
/*global enquire:false, $:false, Modernizr:false */


(function() {

	var $toc, $main, load;

	load = [
		{
			load : "js/vendor/zepto.min.js",
			callback : function() {
				$toc  = $("<nav class='nav sidebar' data-spy='affix' data-offset-top='75' role='navigation'><h2 class='toc__title section-title'>Jump To&hellip;</h2></nav>");
				$main = $("[role=main], .main");
			}
		},
		{
			load: "js/toc.min.js",
			callback : function() {
				$main.toc({ destination: $toc, targets : ["h2"] });
				$("body").prepend($toc);
			}
		},
		"js/vendor/bootstrap.min.js"
	];

	enquire.register("screen and (min-width:75em)", {
		deferSetup : true,
		setup : function() {
			Modernizr.load(load);
		}
	});
}());
