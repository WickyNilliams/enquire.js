//bootstrap the test app
Modernizr.load([

    //load polyfill if need be
    {
        test: window.matchMedia,
        nope: "js/libs/matchMedia.js"
    },

    //load jQuery from CDN, with local fallback
    {
        load: '//ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.js',
        complete: function () {
            if ( !window.jQuery ) {
                Modernizr.load('js/libs/jquery-1.7.1.min.js');
            }
        }
    },

    //load everything else
    "../src/enquire.js",
    "js/app.js"
]);
