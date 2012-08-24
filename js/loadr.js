/*global Modernizr:true */

Modernizr.load([
	{
		test : window.matchMedia,
		nope : "https://raw.github.com/paulirish/matchMedia.js/master/matchMedia.js"
	},

	"https://raw.github.com/WickyNilliams/enquire.js/master/dist/enquire.min.js",
	"js/main.js"
]);