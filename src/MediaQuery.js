    
/**
 * Represents a single media query, manages it's state and registered handlers for this query
 *
 * @param {string} query the media query string
 * @param {boolean} [isUnconditional=false] whether the media query should run regardless of whether the conditions are met. Primarily for helping older browsers deal with mobile-first design
 * @constructor
 */
function MediaQuery(query, isUnconditional) {
    this.query = query;
    this.handlers = [];
    this.matched = false;
    this.isUnconditional = isUnconditional;
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
     * @param {boolean} [handler.deferSetup=false] should the setup callback be deferred until the first time the handler is matched
     */
    addHandler : function(handler) {
        var queryHandler = new QueryHandler(handler);
        this.handlers.push(queryHandler);
    },

    /*
     * assesses the query, turning on all handlers if it matches, turning them off if it doesn't match
     *
     * @function
     */
    assess : function() {

        if(this.matchMedia() || this.isUnconditional) {
            this.match();
        }
        else {
            this.unmatch();
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
			handler.off(e);
        });
        this.matched = false;
    }

};