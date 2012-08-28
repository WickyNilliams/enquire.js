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

            //normalise to object
            if(isFunction(options)) {
                options = {
                    match : options
                };
            }

            //normalise to array
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

            var eventWireUp = window.addEventListener || window.attachEvent,
                self = this;

            timeout = timeout || 500;

            //prevent multiple event handlers
            if(this.listening) {
				return this;
			}

            //creates closure for separate timed event
            function wireFire(event) {
                var timer;

                eventWireUp(event, function(e) {
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
