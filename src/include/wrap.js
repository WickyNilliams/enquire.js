;(function(global) {

'use strict';

var matchMedia = global.matchMedia;

//= ../Util.js
//= ../QueryHandler.js
//= ../MediaQuery.js
//= ../MediaQueryDispatch.js

global.enquire = global.enquire || new MediaQueryDispatch();

}(this));