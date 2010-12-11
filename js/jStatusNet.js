(function( $ ){
	$.extend( {
		jStatusNet: function( backend, username, password, apiLink, numPosts, fnk ) {
			var info = {};
			
			// If no arguments are sent or only username is set
			if( username == 'undefined' || numPosts == 'undefined' ) {
				return;
			} else if( $.isFunction( numPosts ) ) {
				// If only username and callback function is set
				fnk = numPosts;
				numPosts = 5;
			}
			
			var myUrl = { 
				"apiLink" : "http://"+username+":"+password+"@"+apiLink+username+".json",
				
			}
				//+ username + ".json?count="+numPosts+"&callback=?";

			$.ajax({
				type: "POST",
				data: myUrl,
				url: backend + "StatusNetRelay.php",
				cache: false,
				success: function(doc){
					var jsondoc = tools_JSONparser(doc);
					if ($.isFunction(fnk)) {
						fnk.call(this, jsondoc);
					}
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					log("load error for "+myUrl);
					log("reason: "+errorThrown);
				}
			});
		}
	});
})( jQuery );