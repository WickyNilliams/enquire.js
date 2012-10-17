/*jshint devel:true */
/*global $:true, enquire:true, verbose:true */

$(function() {


    var unregisterHandler = verbose("unregister test", {
        match : function() {},
        unmatch : function() {},
        destroy : function() {
            $("#unregister").remove();
        }
    }),
    unregisterQuery = "screen and (max-width:700px)";


    
    // enquire.register is the method you will be interested in.
    // It takes a media query string as it's first param
    // and a handler or array of handlers (more on this next) as it's second param

    enquire.register("screen and (max-width:1000px)", verbose("1000px", {

        // The match and unmatch functions are triggered when the
        // given query transitions between a matched and unmatched state.
        // The match function is required, the unmatch function is not.

        match : function() {
            $("p").css("font-weight", "bold");
        },

        unmatch : function() {
            $("p").css("font-weight", "normal");
        }

    })).register("screen and (max-width:500px)", [

        // Multiple handlers can be registered for a single query,
        // either with array (as here) or with multiple calls to register using the same query each time.
        // The array approach is cleaner, but the end result is the same either way.

        {
            match : function() {
                $("p").each(function() {
                    var $this = $(this);
                    $this.data("previousColour", $this.css("color")).css("color", "red");
                });
            },

            unmatch : function() {
                $("p").each(function() {
                    var $this = $(this);
                    $this.css("color", $this.data("previousColour"));
                });
            }
        },

        // And to prove this, a second handler for the query!

        verbose("500px", {
            match : function() {},
            unmatch : function() {}
        })

    ]).register("screen and (max-width:600px)", [

        // We can use setup functions to run one-time initialisation code.
        // this is great if we need to do expensive DOM manipulation or something.
        // The setup function is run immediately once the handler is registered for a query

        {
            setup : function() {

                var $init = $("<p></p>", {
                    "class" : "init"
                }).text("Handlers can have one-time initialisation code.");

                var $msg = $("<p></p>", {
                    "class" : "msg"
                });

                $("body").append($init).append($msg);
            },

            match : function() {
                $("p.msg").text("Handlers can also run code each time it's query matches...");
            },

            unmatch : function() {
                $("p.msg").text("...And can also run code when a media query no longer matches");
            }
        },

        // However, if you want your setup to be deferred, this can be achieved by setting the deferSetup flag to true.
        // Setup will then be run the first time a query is matched.
        // Note that if the query is matched when the handler is registered, it will be executed immediately

        verbose("600px", {
            setup : function() {
                console.log("600px setup - should be deferred!");
            },

            deferSetup : true,

            match : function() {},

            unmatch : function() {}
        })

    ])
    .register(unregisterQuery, unregisterHandler)
    .listen(400);

    // A call to listen() will register handlers for the browser's resize and orientation change events.
    // Registered queries will then be evaluated each time an event is fired. listen() also makes a call to fire(), read more on that below
    // listen() optionally accepts an int value representing the timeout between events (this stops events spamming the handlers).
    // The timeout defaults to 500ms if no value is supplied

    // If you don't care about browser events you can simply call fire
    // to have each query evaluated and (potentially) executed just the once. e.g:
    // enquire.fire();

    // If for some reason you want your handlers dynamically registered,
    // you can do that also. Seems a little pointless, but who am I to judge :)

    $("#dynamic").click(function() {
        enquire.register("screen and (max-width:500px)", verbose("dynamic handler", function() {}));
    });

    $("#unregister").click(function() {
        enquire.unregister(unregisterQuery, unregisterHandler);
    });
});