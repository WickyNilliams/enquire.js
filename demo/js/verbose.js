/*jshint devel:true */

/**
 * verbose login mixin
 *
 * @function
 * @param {string} key unique identifier used when logging to console
 * @param {object || function} handler the handler to wrap
*/
function verbose(key, handler) {

    var targets = ["match", "unmatch", "destroy", "setup"],
        target, i;

    function wrap(method) {

        var wrapped = handler[method];

        return function(e) {
            console.log(key + " " + method);
            if (e) {
                console.dir(e);
            }

            wrapped.call(handler, e);
        };
    }

    if(!handler) {
        return;
    }

    // normalise to object if only match callback supplied
    if (typeof handler === "function") {
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

        handler[target] = wrap(target);
    }

    return handler;
}
