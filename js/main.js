/*jshint laxbreak:true */
/*global enquire:true, $:true, Modernizr:true */


$(function() {

	var $toc = $("<div class='toc nav sidebar' data-spy='affix' data-offset-top='110' data-offsetop-bottom='200'><h2 class='title'>Jump To&hellip;</h2></div>"),
		$main = $("[role=main], .main");

	function setup() {
		Modernizr.load([
			{
				load: "js/jquery.toc.js",
				callback : function() {
					$main.toc({
						container : "<ul class='no-bullets'></ul>",
						destination: $toc,
						targets : ["h2"]
					});
					$("body").append($toc);
				}
			},
			{
				load : "js/vendor/scrollspy.js",
				callback : function() {
					$("body").scrollspy({offset: 50});
				}
			},
			"js/vendor/bootstrap-affix.js"
		]);
	}


	enquire.register("screen and (min-width:1310px)", [{

		deferSetup : true,

		setup : setup,

		match : function() {
			$toc.fadeIn();
		},

		unmatch : function() {
			$toc.hide();
		}
	}]).listen();

});
