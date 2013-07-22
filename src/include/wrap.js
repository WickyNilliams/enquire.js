;(function (name, context, factory) {
	if (typeof module !== 'undefined' && module.exports) {
		module.exports = factory(context);
	}
	else if (typeof define === 'function' && define.amd) {
		define([], function() {
			factory(context);
		});
	}
	else {
		context[name] = factory(context);
	}
}('enquire', this, function (global) {

'use strict';

var matchMedia = global.matchMedia;

//= ../Util.js
//= ../QueryHandler.js
//= ../MediaQuery.js
//= ../MediaQueryDispatch.js
//
return new MediaQueryDispatch();

}));