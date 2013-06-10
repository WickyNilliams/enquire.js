/* global define */
/**
 * UMD amdWeb template from
 * https://github.com/umdjs/umd
 */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // Register as an anonymous module.
        define([], factory);
    } else {
        // Browser globals
        root.amdWeb = factory(root.b);
    }
}(this, function () {
//= include/intro.js
//= Util.js
//= QueryHandler.js
//= MediaQuery.js
//= MediaQueryDispatch.js
//= include/outro.js
}));
