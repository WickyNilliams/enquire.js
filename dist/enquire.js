// enquire v1.1.0 - Awesome media queries in JavaScript
// Copyright (c) 2012 Nick Williams - https://www.github.com/WickyNilliams/enquire.js
// License: MIT (http://www.opensource.org/licenses/mit-license.php)


window.enquire = (function(matchMedia) {

    "use strict";

    /**
     * Helper function for iterating over a collection
     *
     * @param collection
     * @param fn
     */
    function each(collection, fn) {
        var i = 0,
            length = collection.length,
            cont;

        for(i; i < length; i++) {
            cont = fn(collection[i], i);
            if(cont === false) {
                break; //allow early exit
            }
        }
    }

    /**
     * Helper function for determining whether target object is an array
     *
     * @param target the object under test
     * @return {Boolean} true if array, false otherwise
     */
    function isArray(target) {
        return Object.prototype.toString.apply(target) === "[object Array]";
    }

    /**
     * Delegate to handle a media query being matched and unmatched.
     *
     * @param {object} options
     * @param {function} options.match callback for when the media query is matched
     * @param {function} [options.unmatch] callback for when the media query is unmatched
     * @param {function} [options.setup] one-time callback triggered the first time a query is matched
     * @param {boolean} [options.deferSetup=false] should the setup callback be run immediately, rather than first time query is matched?
     * @constructor
     */
    function QueryHandler(options) {
        this.initialised = false;
        this.onMatch = options.match;
        this.onUnmatch = options.unmatch;
        this.onSetup = options.setup;

        if(!options.deferSetup) {
			this.setup();
		}
    }
    QueryHandler.prototype = {

        /**
         * coordinates setup of the handler
         *
         * @function
         */
        setup : function() {
            if(this.onSetup){
                this.onSetup();
            }
            this.initialised = true;
        },

        /**
         * coordinates setup and triggering of the handler
         *
         * @function
         * @param [e] the browser event which triggered a match
         */
        on : function(e) {
            if(!this.initialised){
                this.setup();
            }
            this.onMatch(e);
        },

        /**
         * coordinates the unmatch event for the handler
         *
         * @function
         * @param [e] the browser event which triggered a match
         */
        off : function(e) {
            if(this.onUnmatch){
                this.onUnmatch(e);
            }
        }

    };

/**
 * Represents a single media query and manages it's state
 *
 * @param query
 * @constructor
 */
function MediaQuery(query) {
    this.query = query;
    this.handlers = [];
    this.matched = this.matchMedia();
}
MediaQuery.prototype = {

    /**
     * tests whether this media query is currently matching
     *
     * @function
     * @returns {boolean} true if match, false otherwise
     */
    matchMedia : function() {
        return matchMedia(this.query).matches;
    },

    /**
     * add a handler for this query, triggering if already active
     *
     * @function
     * @param {object} handler
     * @param {function} handler.matched callback for when query is activated
     * @param {function} [handler.unmatch] callback for when query is deactivated
     * @param {function} [handler.setup] callback for immediate-execution when a query handler is registered
     * @param {boolean} [handler.deferSetup=false]
     */
    addHandler : function(handler) {
        var queryHandler = new QueryHandler(handler);
        this.handlers.push(queryHandler);

        if(this.matched) {
            queryHandler.on();
        }
    },

    /**
     * activates a query.
     * callbacks are fired only if the query is currently unmatched
     *
     * @function
     * @param {Event} [e] browser event if triggered as the result of a browser event
     */
    match : function(e) {
        if(this.matched) {
			return; //already on
		}

        each(this.handlers, function(handler) {
            handler.on(e);
        });
        this.matched = true;
    },

    /**
     * deactivates a query.
     * callbacks are fired only if the query is currently matched
     *
     * @function
     * @param {Event} [e] browser event if triggered as the result of a browser event
     */
    unmatch : function(e) {
        if(!this.matched) {
			return; //already off
        }

        each(this.handlers, function(handler){
            if(handler.off) {
				handler.off(e);
            }
        });
        this.matched = false;
    }

};
    /**
     * Allows for reigstration of query handlers.
     * Manages the  query handler's state and is responsible for wiring up browser events
     *
     * @constructor
     */
    function MediaQueryDispatch () {
        if(!matchMedia) {
            throw new Error("matchMedia is required for media query dispatcher");
        }

        this.queries = [];
        this.listening = false;
    }

    MediaQueryDispatch.prototype = {

        /**
         * Registers a handler for the media query
         *
         * @function
         * @param {string} q the media query
         * @param {object || Array} options either a single query handler object or a an array of query handlers
         * @param {function} options.match fired when query matched
         * @param {function} [options.unmatch] fired when a query is no longer matched
         * @param {function} [options.setup] fired when handler first triggered
         * @param {boolean} [options.deferSetup=false] whether setup should be run immediately or deferred until query is first matched
         */
        register : function(q, options) {

            var queries = this.queries,
                query;

            if(!queries.hasOwnProperty(q)) {
                queries[q] = new MediaQuery(q);
            }

            query = queries[q];

            if(!isArray(options)) {
                options = [options];
            }
            each(options, function(handler) {
                query.addHandler(handler);
            });

            return this;
        },

        /**
         * Tests all media queries and calls relevant methods depending whether
         * transitioning from unmatched->matched or matched->unmatched
         *
         * @function
         * @param {Event} [e] if fired as a result of a browser event,
         * an event can be supplied to propagate to the various media query handlers
         */
        fire : function(e) {

            var queries = this.queries,
                mediaQuery;

            for(mediaQuery in queries) {
                if(!queries.hasOwnProperty(mediaQuery)) {
					continue;
				}

                var mq = queries[mediaQuery];
                if(mq.matchMedia()){
					mq.match(e);
                } else{
					mq.unmatch(e);
				}
            }
            return this;
        },

        /**
         * sets up listeners for resize and orientation events
         *
         * @param {int} [timeout=500] the time (in milliseconds) after which the queries should be handled
         */
        listen : function(timeout) {

            var evt = window.addEventListener || window.attachEvent,
                self = this;

            timeout = timeout || 500;

            //prevent multiple event handlers
            if(this.listening) {
				return this;
			}

            //creates closure for separate timed event
            function wireFire(event) {
                var timer;

                evt(event, function(e) {
                    if(timer) {
						clearTimeout(timer);
					}

                    timer = setTimeout(function() {
                        self.fire(e);
                    }, timeout);
                });
            }

            //handle initial load then wait for events
            self.fire();
            wireFire("resize");
            wireFire("orientationChange");

            this.listening = true;

            return this;

        }
    };


    return new MediaQueryDispatch();

}(window.matchMedia));