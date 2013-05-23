    /**
     * Allows for registration of query handlers.
     * Manages the query handler's state and is responsible for wiring up browser events
     *
     * @constructor
     */
    function MediaQueryDispatch () {
        if(!matchMedia) {
            throw new Error('matchMedia not present, legacy browsers require a polyfill');
        }

        this.queries = {};
        this.browserIsIncapable = !matchMedia('only all').matches;
    }

    MediaQueryDispatch.prototype = {

        /**
         * Registers a handler for the given media query
         *
         * @param {string} q the media query
         * @param {object || Array || Function} options either a single query handler object, a function, or an array of query handlers
         * @param {function} options.match fired when query matched
         * @param {function} [options.unmatch] fired when a query is no longer matched
         * @param {function} [options.setup] fired when handler first triggered
         * @param {boolean} [options.deferSetup=false] whether setup should be run immediately or deferred until query is first matched
         * @param {boolean} [shouldDegrade=false] whether this particular media query should always run on incapable browsers
         */
        register : function(q, options, shouldDegrade) {
            var key = q,
                queries = this.queries,
                isUnconditional = shouldDegrade && this.browserIsIncapable;

			//The collection that kept track of event handlers did not take in account the value "showDegrade".
			//We are now storing event handlers on separate keys according to the value of this parameter.
            if(isUnconditional){
                key = key + '-isUnconditional';
            }

            if (!queries[key]) {
                queries[key] = new MediaQuery(key, isUnconditional);
            }

            //normalise to object in an array            
            if (isFunction(options)) {
                options = { match: options };
            }
            if (!isArray(options)) {
                options = [options];
            }
            each(options, function (handler) {
                queries[key].addHandler(handler);
            });

            return this;
        },

        /**
         * unregisters a query and all it's handlers, or a specific handler for a query
         *
         * @param {string} q the media query to target
         * @param {object || function} [handler] specific handler to unregister
         */
        unregister : function(q, handler) {

			var self = this;

            function _unregister(q, handler) {
                var query = self.queries[q];

                if (query) {
                    if (handler) {
                        query.removeHandler(handler);
                    }
                    else {
                        query.clear();
                        delete self.queries[q];
                    }
                }
            }

            _unregister(q, handler);
            _unregister(q + '-isUnconditional', handler);

            return this;
        }
    };
