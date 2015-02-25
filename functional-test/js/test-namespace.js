/*jshint devel:true */

////////////////////////////////
//// ENQUIRE TEST SUITE
////////////////////////////////

// Simple way to functionally test the library
// The test runner even automates most of it for you :)

(function(enquire, $){

  'use strict';

  document.getElementById('register').onclick = function() {
      enquire.register('screen and (min-width:600px)', {

        match: function(){},
        namespace : 'test.global'

      }).register('screen and (min-width:1023px)', {

        match: function(){},
        namespace : 'test.local'

      }).register('screen and (min-width:600px)', {

        match: function(){},
        namespace : 'myplugin.global'

      }).register('screen and (min-width:1023px)', {

        match: function(){},
        namespace : 'myplugin.local'

      }).register('screen and (min-width:1023px)', {

        match: function(){},
        namespace : 'local'

      }).register('screen and (min-width:1023px)', {

        match: function(){},
        namespace : '*'

      }).register('screen and (min-width:1023px)', {

        match: function(){},
        namespace : ''

      }).register('screen and (min-width:600px)', {

        match: function(){}

      });

      debug();
  };

  document.getElementById('unregister-all').onclick = function() {
      enquire.unregister('screen and (min-width:600px)').unregister('screen and (min-width:1023px)');

      debug();
  };

  document.getElementById('unregister-form').onsubmit = function() {
      var namespace = document.getElementById('namespace').value;
      var query = document.getElementById('query').value;
      query = query !== '' ? query : null;
      
      enquire.unregisterNamespace(namespace, query);
      
      query = query ? ', "'+query+'"' : '';
      document.getElementById('code').innerHTML = 'enquire.unregisterNamespace("'+namespace+'"'+query+');';

      debug();

      return false;
  };

  function debug() {

    var output = '';

    for (var query in enquire.queries) {
        if (enquire.queries.hasOwnProperty(query)) {
            for(var i=0; i < enquire.queries[query].handlers.length; i++) {
                output += '<li>Query = "' + query + '" - Namespace = "'+enquire.queries[query].handlers[i].options.namespace+'"</li>';
            }
        }
    }

    document.getElementById('queries').innerHTML = output;
  }

}(window.enquire, window.jQuery || window.Zepto));

