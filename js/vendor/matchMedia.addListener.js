/*! matchMedia() polyfill addListener/removeListener extension. Author & copyright (c) 2012: Scott Jehl. Dual MIT/BSD license */
(function(){
	// monkeypatch unsupported addListener/removeListener with polling
	if( !window.matchMedia( "all" ).addListener ){
		var oldMM = window.matchMedia;
		
		window.matchMedia = function( q ){
			var ret = oldMM( q ),
				listeners = [],
				last = ret.matches,
				timer,
				check = function(){
					var list = oldMM( q ),
						unmatchToMatch = list.matches && !last,
						matchToUnmatch = !list.matches && last;
                                                
                                        //fire callbacks only if transitioning to or from matched state
					if( unmatchToMatch || matchToUnmatch ){
						for( var i =0, il = listeners.length; i< il; i++ ){
							listeners[ i ].call( ret, list );
						}
					}
					last = list.matches;
				};
			
			ret.addListener = function( cb ){
				listeners.push( cb );
				if( !timer ){
					timer = setInterval( check, 1000 );
				}
			};

			ret.removeListener = function( cb ){
				for( var i =0, il = listeners.length; i< il; i++ ){
					if( listeners[ i ] === cb ){
						listeners.splice( i, 1 );
					}
				}
				if( !listeners.length && timer ){
					clearInterval( timer );
				}
			};
			
			return ret;
		};
	}
}());