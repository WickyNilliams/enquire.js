/*global Modernizr: true */

//bootstrap the test app
Modernizr.load([

    {
        test: window.matchMedia,
        nope: "js/libs/matchMedia.js"
    },

    'js/libs/jquery.1.7.1.js',
    
    "../dist/enquire.js",
    "js/test-suite.js"
]);