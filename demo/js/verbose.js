/*jshint devel:true*/


(function(global, targets) {


    function wrap(handler, target, key, callback) {

        var wrapped = handler[target];

        handler[target] = function() {
            callback(key, target);
            wrapped.call(handler);
        };
    }

    function log(key, target) {
        console.log(key + ' - ' + target);
    }

    /**
     * verbose login mixin
     *
     * @function
     * @param {string} key unique identifier used when logging to console
     * @param {object || function} handler the handler to wrap
    */
    function verbose(key, handler) {

        var target;

        if(!handler) {
            return;
        }

        // normalise to object if only match callback supplied
        if (typeof handler === 'function') {
            handler = {
                match: handler
            };
        }

        // wrap all our targets in a verbose function
        for (target in targets) {
            target = targets[target];
            if (!handler[target]) {
                continue;
            }

            wrap(handler, target, key, log);
        }

        return handler;
    }

    global.verbose = verbose;


}(this, ['match', 'unmatch', 'destroy', 'setup']));
