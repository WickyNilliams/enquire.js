#enquire.js

##In a nutshell...

`enquire.js` is a pure javascript framework for programmatically responding to CSS media queries.

`enquire` does not aim to be a replacement for, but rather a supplement to, CSS media queries.
Some circumstances demand more than what CSS based media queries can offer and this is where `enquire` steps in.
In a responsive design, you may want to do some complex things with your markup e.g:

 * On a mobile device, generate a new a touch friendly main menu from your current menu
 * Replace images with higher resolution variants for screens with high DPI
 * Shuffle content around on smaller screens

`enquire` makes it trivial to do all of these things and more!

##Dependencies

None!

The most you will need to do is provide a [polyfill for matchMedia](https://github.com/paulirish/matchMedia.js/) support if you wish to support older browsers.

##Basic Usage

###enquire.register

The main method you will be dealing with is `register`. It's basic signature is as follows:

    enquire.register(string query, object handler);

`query` is the media query which we wish to handle, and `handler` is an object containing logic to handle the supplied query.
An example of usage is as follows.

    enquire.register("screen and (max-width:1000px)", {

        match : function() {},      // required,
                                    // triggered when the media query transitions *from an unmatched to a matched state*

        unmatch : function() {},    // optional,
                                    // if supplied, triggered when the media query transitions *from a matched state to an unmatched state*.

        setup : function() {},      // optional,
                                    // if supplied, triggered once immediately upon registration of the handler

        deferSetup : true           // optional, defaults to false
                                    // if set to true, defers execution the setup function until the media query is first matched. still triggered just once

    });


##Can I haz more than one handlerz?

It can be cumbersome to have all your logic in one handler,
so you can also supply an `Array` as the second parameter to `register` to support multiple handlers per query:

     enquire.register("screen and (max-width:1000px)", [
        { match : function() { console.log("handler 1 matched"); } },
        { match : function() { console.log("handler 2 matched"); } }
     ]);

###Alternatively...

You could, if you wish, achieve the same effect by calling register multiple times for the same query:

    var query = "screen and (max-width:1000px)";

    enquire.register(query, {
        match : function() {
            console.log("handler 1 matched");
        }
    });

    //later in code...

    enquire.register(query, {
        match : function() {
            console.log("handler 2 matched");
        }
     });

 Whilst the array pattern is generally preferred, this pattern of multiple calls to `register`
 is useful for when you don't want to register all handlers at one time, allowing you to perform work
 in between registration or even registering new handlers in response to other events.

 It is safe to do this without overwriting your previous handler for the query,
 as `enquire` uses the media query itself as a lookup key on it's internal dictionary. Thus, the second handler is just
 appended to a list of handlers already registered for that query.


##Multiple Queries

As well as multiple handlers per query, multiple queries can be registered with `enquire`.
Calls to `register` can be chained together for this purpose. *In fact, all methods on `enquire` can be chained!*


    enquire.register("screen and (max-width:1000px)", {

        // contrived example
        // changes text colour to red on match
        // and reverts colour on unmatch

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

    }).register("screen and (max-width:500px)", {

        // may as well show off deferred setup while we're here!

        setup : function() {
            console.log("500px setup, will be deferred");
        },

        deferSetup: true,

        match : function() {
            console.log("500px on");
        },

        unmatch : function() {
            console.log("500px off");
        }

    }).listen(); //read on for info on listen()



##Getting the show on the road

You may have noticed the call to `listen()` in the last example, so let's talk about that.
After you've registered your handlers you need to get `enquire` up and running.
For this you have two options, `fire` or `listen`.

###enquire.fire

`fire` evaluates each of the registered media queries at that time,
triggering the relevant functions for each of the query's handlers, if there has been a match/unmatch.

`fire` is handy if you don't care about browser events and want your handlers to be triggered just once on page load.

###enquire.listen

`listen` registers event handlers for the browser's resize and orientation change events.
Each time one of these events is triggered, `enquire` will iterate over each media query
checking whether any of their states have changed. If, and only if, a query's state has changed
(that is, matched to unmatched, or unmatched to matched) then the relevant functions will be called for
 each of the query's handlers.

 To avoid spamming `enquire` with browser events (e.g. if the browser window is rapidly changing size),
 `listen` delays evaluation of media queries until there have been no resize or orientation events in the last 500ms.
 This value can be configured by supplying a parameter to `listen`:

    enquire.listen(10000); //10 seconds, why not?!

`listen` also contains an implicit call to `fire`, so you do not have to do this manually -
one call to `listen` will have you covered now and in future.


##Summary

`enquire` should be capable of handling every situation you throw at it without breaking a sweat.

Feel free to make feature or pull requests.

##License

Licence: MIT (http://www.opensource.org/licenses/mit-license.php)


