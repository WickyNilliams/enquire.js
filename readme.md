#enquire.js

`enquire.js` is a pure javascript framework for programmatically responding to CSS media queries.

##Download

Downloads are located in the `dist` folder. Alternatively you can build from source by running the grunt task.
 
 * [Development](https://github.com/WickyNilliams/enquire.js/raw/master/dist/enquire.js) - unminified
 * [Production](https://github.com/WickyNilliams/enquire.js/raw/master/dist/enquire.min.js) - minified


##Full Details

Visit the [enquire.js project page](http://wickynilliams.github.com/enquire.js/) for full details of the API.

##Quick Start

The main method you will be dealing with is `register`. It's basic signature is as follows:

```javascript
enquire.register(query /* string */, handler /* object || array */);
```

`query` is the media query  you wish to handle, and `handler` is an object containing any logic to handle the query. An example of usage is as follows:

```javascript
enquire.register("screen and (max-width:1000px)", {

    match : function() {},      // REQUIRED
                                // Triggered when the media query transitions 
                                // *from an unmatched to a matched state*

    unmatch : function() {},    // OPTIONAL
                                // If supplied, triggered when the media query transitions 
                                // *from a matched state to an unmatched state*.

    setup : function() {},      // OPTIONAL
                                // If supplied, triggered once immediately upon registration of the handler

    deferSetup : true           // OPTIONAL, defaults to false
                                // If set to true, defers execution the setup function 
                                // until the media query is first matched. still triggered just once
}).fire();
```

This should be enough to get you going, **but please read the full [documentation](http://wickynilliams.github.com/enquire.js/) if you wish to learn about the other cool features**.

##License

License: MIT (http://www.opensource.org/licenses/mit-license.php)


