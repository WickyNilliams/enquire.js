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

	function fail($test) {
		$test.is('.test') && $test.addClass('test-fail');
	}

	if(enquire.browserIsIncapable) {
		$(document.body).addClass('incapable');
	}

	var $tests = $('.test-group');

	enquire.register('screen and (min-width:600px)', {

		match : function() {
			pass($tests.find('.match'));
		},

		unmatch : function() {
			pass($tests.find('.unmatch'));
		},

		setup : function() {
			pass($tests.find('.setup'));
		}

	}).register('screen and (max-width: 500px)', {

		match : function(){},

		setup : function() {
			pass($tests.find('.deferred-setup'));
		},

		deferSetup : true

	}).register('screen and (min-width: 1px)', {

		match : function() {},

		destroy : function() {
			pass($tests.find('.destroy'));
		}

	}).register('screen and (max-width:1px)', {

		match : function() {
			var $degrade = $tests.find('.should-degrade'),
				action = enquire.browserIsIncapable ? pass : fail;

			action($degrade);
		}

	}, true);

	$('.destroy-trigger').one('click', function() {
		enquire.unregister('screen and (min-width: 1px)');
		$(this).remove();
	});

}(window.enquire, window.jQuery || window.Zepto));

