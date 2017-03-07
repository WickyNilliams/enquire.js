;(function (name, context, factory) {
	if (typeof window !== 'undefined') {
	    var matchMediaPolyfill = function matchMediaPolyfill(mediaQuery) {
	      return {
		media: mediaQuery,
		matches: false,
		addListener: function addListener() {},
		removeListener: function removeListener() {}
	      };
	    };
	    window.matchMedia = window.matchMedia || matchMediaPolyfill;
	}
	
	var matchMedia = window.matchMedia;

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = factory(matchMedia);
	}
	else if (typeof define === 'function' && define.amd) {
		define(function() {
			return (context[name] = factory(matchMedia));
		});
	}
	else {
		context[name] = factory(matchMedia);
	}
}('enquire', this, function (matchMedia) {

	'use strict';

//= ../Util.js
//= ../QueryHandler.js
//= ../MediaQuery.js
//= ../MediaQueryDispatch.js

	return new MediaQueryDispatch();

}));
