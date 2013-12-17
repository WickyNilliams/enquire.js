;(function (name, context, factory) {
	var matchMedia = context.matchMedia;

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
}('enquire', window, function (matchMedia) {

	'use strict';

//= ../Util.js
//= ../QueryHandler.js
//= ../MediaQuery.js
//= ../MediaQueryDispatch.js

	return new MediaQueryDispatch();

}));