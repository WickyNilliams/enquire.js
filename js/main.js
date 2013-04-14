/*jshint laxbreak:true */
/*global enquire:true, $:true, Modernizr:true */


(function() {

	var $toc, $main, load;

	load = [
		{
			load : "js/vendor/zepto.js",
			callback : function() {
				$toc  = $("<nav class='nav sidebar' data-spy='affix' data-offset-top='75' role='navigation'><h2 class='toc__title section-title'>Jump To&hellip;</h2></nav>");
				$main = $("[role=main], .main");
			}
		},
		{
			load: "js/jquery.toc.js",
			callback : function() {
				$main.toc({ destination: $toc, targets : ["h2"] });
				$("body").prepend($toc);
			}
		},
		"js/vendor/bootstrap.js"
	];

	enquire.register("screen and (min-width:75em)", {
		deferSetup : true,
		setup : function() {
			Modernizr.load(load);
		}
	});
}());
