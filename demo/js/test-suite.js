/*jshint devel:true */

////////////////////////////////
//// ENQUIRE TEST SUITE
////////////////////////////////

// Simple way to functionally test the library
// The test runner even automates most of it for you :)

(function(enquire, $){

	'use strict';

	enquire.listen(100);

	function pass($test) {
		$test.is('.test') && $test.addClass('test-pass');
	}

	var $test1 = $('#test1'),
		$test2 = $('#test2');

	enquire.register('screen and (min-width:600px)', {

		match : function() {
			pass($test1.find('.match'));
		},

		unmatch : function() {
			pass($test1.find('.unmatch'));
		},

		setup : function() {
			pass($test1.find('.setup'));
		},

		destroy : function() {
			pass($test1.find('.destroy'));
		}

	}).register('screen and (max-width: 500px)', {

		match : function(){},

		setup : function() {
			pass($test2.find('.setup'));
		},

		deferSetup : true,

		destroy : function() {
			pass($test2.find('.destroy'));
		}
	});

	$('.destroy-trigger').one('click', function() {
		enquire.unregister('screen and (max-width: 500px)');
		$(this).remove();
	});

}(window.enquire, window.jQuery || window.Zepto));

