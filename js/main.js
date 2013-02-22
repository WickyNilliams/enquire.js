/*jshint laxbreak:true */
/*global enquire:true, $:true, Modernizr:true */


$(function() {

	var $toc = $("<nav class='nav sidebar' data-spy='affix' data-offset-top='75' data-offsetop-bottom='200' role='navigation'><h2 class='toc__title section-title'>Jump To&hellip;</h2></nav>"),
		$main = $("[role=main], .main"),
		load;

	load = [{
		load: "js/jquery.toc.js",
		callback : function() {
			$main.toc({
				container : "<ul class='toc no-bullets'></ul>",
				item : "<li class='toc__item'><a></a></li>",
				destination: $toc,
				targets : ["h2"]
			});
			$("body").prepend($toc);
		}
		},
		"js/vendor/bootstrap-scrollspy.js",
		"js/vendor/bootstrap-affix.js"
	];


	enquire.register("screen and (min-width:70em)", {
		deferSetup : true,
		setup : load,
		match : function() {
			$toc.fadeIn();
		},
		unmatch : function() {
			$toc.hide();
		}
	});
});
