
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