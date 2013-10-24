/*jshint devel:true */

////////////////////////////////
//// ENQUIRE TEST SUITE
////////////////////////////////

// Simple way to functionally test the library
// The test runner even automates most of it for you :)

(function(enquire, $){

  'use strict';


  function pass($test) {
    $test.classList.contains('test') && $test.classList.add('test-pass');
  }

  function fail($test) {
    $test.classList.contains('test') && $test.classList.add('test-fail');
  }

  if(enquire.browserIsIncapable) {
    document.body.classList.add('incapable');
  }

  var tests = document.querySelector('.test-group');
  //var $tests = $('.test-group');

  enquire.register('screen and (min-width:600px)', {

    match : function() {
      pass(tests.querySelector('.match'));
    },

    unmatch : function() {
      pass(tests.querySelector('.unmatch'));
    },

    setup : function() {
      pass(tests.querySelector('.setup'));
    }

  }).register('screen and (max-width: 500px)', {

    setup : function() {
      pass(tests.querySelector('.deferred-setup'));
    },

    deferSetup : true

  }).register('screen and (min-width: 1px)', {

    setup : function() {
      setTimeout(function() {
        enquire.unregister('screen and (min-width: 1px)');
      }, 500);
    },

    destroy : function() {
      pass(tests.querySelector('.destroy'));
    }

  })
  .register('screen and (max-width:1px)', {

    match : function() {
      var degrade = tests.querySelector('.should-degrade'),
        action = enquire.browserIsIncapable ? pass : fail;

      action(degrade);
    }

  }, true);

}(window.enquire, window.jQuery || window.Zepto));

