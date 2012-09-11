/*global Modernizr: true */

//bootstrap the test app
Modernizr.load([

    {
        test: window.matchMedia,
        nope: "js/libs/matchMedia.js"
    },

    // {
    //     load: '//ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.js',
    //     complete: function () {
    //         if ( !window.jQuery ) {
    //             Modernizr.load('js/libs/jquery.1.7.1.js');
    //         }
    //     }
    // },

    'js/libs/jquery.1.7.1.js',

    "../dist/enquire.js",
    "js/app.js"
]);
