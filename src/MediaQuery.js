
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