aUser = function() {
	this.uid = 0;
	this.name = "anonymous";
	this.email = "test@example.com";
	this.password = "";
}

aUser.prototype.login = function(username, password) {

}




// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

$(document).ready(function() {
	myTimeLine = new aTimeLine({
		name: "nanoTEAM",
		username: "toni",
		password: "forever",
		apiLink: "linkcloud.status.net/api/statuses/friends_timeline/",
		id: "timeline01"
	});
	myTimeLine.init = function() {
		var dateNow = new Date();
		var myNow = Date.parse(dateNow)

		var getChanges = {
			id: "getChanges",
			checkInterval: 10000,
			nextCheckTime: 0,
			checkRule: true,
			done: false,
			myCheck: function() {
				myTimeLine.checkUpdates();
			}
		}
		if (typeof mySurveillance != "undefined") {
			mySurveillance.addCheck(getChanges);
		}
	}

	myPlugins.add(myTimeLine);
});




// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++




aTimeLine = function(mySettings) {
	this.name = mySettings.name;
	this.username = mySettings.username;
	this.password = mySettings.password;
	this.apiLink = mySettings.apiLink;
	this.entries = new Array();
	this.id = mySettings.id;
	this.initialized = false;
	
	this.EntryHTMLPattern = "<span class='css__entry_date'>[@#created_at#@]</span> <span class='css__entry_screen_name'>@#user.screen_name#@</span> <span class='css__entry_text'>@#text#@</span>";
	
	this.DOMelement = document.createElement("div");
	$(this.DOMelement).attr("id",this.id+"_wrapperDiv");
	$("body").append(this.DOMelement);
	
	this.DOMelement.myInput = document.createElement("input");
	$(this.DOMelement.myInput).attr("id",this.id+"_input");
	$(this.DOMelement.myInput).attr("size","100");
	$(this.DOMelement).append(this.DOMelement.myInput);
	$(this.DOMelement.myInput).keyup(function(e) {
		allFilters();
		/*if (e.which==13) {
			allFilters();
		}
		*/
	});
	
	
	this.DOMelement.myTable = document.createElement("table");
	$(this.DOMelement.myTable).attr("id",this.id+"_entriesTable");
	$(this.DOMelement).append(this.DOMelement.myTable);
	
}


/*
* entry : {
*		twitter_data : { ... },
*		visible : true/false,
*
*
*
* }
*/
aTimeLine.prototype.addEntry = function(newEntry) {
	if (this.findEntry(newEntry.twitter_data.id) == -1) {
		this.entries.push(newEntry);
		return true;
	}
	return false;
}

aTimeLine.prototype.filter = function(filterCallBack) {
	if (jQuery.isFunction(filterCallBack)) {
		for (var i=0;i<this.entries.length;i++) {
			this.entries[i].visible = filterCallBack(this.entries[i]);
			if (this.entries[i].visible) {
				$("#TR_"+this.entries[i].twitter_data.id).css("display","block");
			} else {
				$("#TR_"+this.entries[i].twitter_data.id).css("display","none");
			}
		}
	}
}

aTimeLine.prototype.findEntry = function(id2find) {
	for (var i=0; i<this.entries.length; i++) {
		if (this.entries[i].twitter_data.id == id2find) {
			return i;
		}
	}
	return -1;
}

aTimeLine.prototype.drawEntry = function(anEntry) {
	if ($("#TD_"+anEntry.twitter_data.id).length == 0) {
		var myTR = document.createElement("tr");
		$(myTR).attr("id","TR_"+anEntry.twitter_data.id);
		var myTD = document.createElement("td");
		$(myTD).attr("id","TD_"+anEntry.twitter_data.id);
		$(this.DOMelement.myTable).append(myTR);
		$(myTR).prepend(myTD);
	}
	var myHTML = this.EntryHTMLPattern;
	myHTML = myHTML.replace(/@#created_at#@/g, anEntry.twitter_data.created_at);
	myHTML = myHTML.replace(/@#user.screen_name#@/g, anEntry.twitter_data.user.screen_name);
	myHTML = myHTML.replace(/@#text#@/g, anEntry.twitter_data.text);
	
	$("#TD_"+anEntry.twitter_data.id).html(myHTML);
}

aTimeLine.prototype.receivePosts = function(data) {
	if (typeof data == "undefined") return false;
	var me = this;
	$.each(data, function(i, post){
		var thisEntry = { twitter_data: post, visible: true };
		if (me.addEntry(thisEntry)) {
			me.drawEntry(thisEntry);
		}
	});
}


aTimeLine.prototype.checkUpdates = function() {
	$.jStatusNet(myBrowser.URL_backend, this.username, this.password, this.apiLink, 10, function(data) { 
		myTimeLine.receivePosts(data); 
	} ); 
}






// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


function allFilters() {
	var FilterValue = $("#timeline01_input").val();
	var commands = FilterValue.split(",");
	for (var i=0; i<commands.length;i++) {
		if (commands[i].indexOf("^currentJobs")>-1) {
			Filter__currentJobs();
			return true;
		} else if (commands[i].indexOf("^lastJobs")>-1) {
			Filter__lastJobs();
			return true;
		} 
	}
	/*
	for (var i=myTimeLine.entries.length-1;i>-1;i--) {
		var thisEntryData = myTimeLine.entries[i].twitter_data;
		$("#TR_"+thisEntryData.id).css("display","block");
	}
	*/
	if (FilterValue.indexOf("^") == -1) {
		myTimeLine.filter(function(anEntry) {
			var FilterValue = $("#timeline01_input").val();
			if (anEntry.twitter_data.text.indexOf(FilterValue) > -1) {
				return true;
			}
			return false;
		});
	}
}


function Filter__currentJobs() {
	var OpenJobs = new Array();
	for (var i=myTimeLine.entries.length-1;i>-1;i--) {
		var thisEntryData = myTimeLine.entries[i].twitter_data;
		var pattern = /\#now/gi;
		var found = pattern.test(thisEntryData.text);
		if (found) {
			OpenJobs[thisEntryData.user.screen_name] = thisEntryData;
		}
		var pattern = /\#done/gi;
		var found = pattern.test(thisEntryData.text);
		if (found) {
			OpenJobs[thisEntryData.user.screen_name] = false;
		}
		$("#TR_"+thisEntryData.id).css("display","none");
	}
	for (entry in OpenJobs) {
		if (OpenJobs[entry] != false && jQuery.isFunction(OpenJobs[entry]) == false) {
			var myTR = $("#TR_"+OpenJobs[entry].id);
			myTR.css("display","block");
		}
	}
}

function Filter__lastJobs() {
	var DoneJobs = new Array();
	for (var i=myTimeLine.entries.length-1;i>-1;i--) {
		var thisEntryData = myTimeLine.entries[i].twitter_data;
		var pattern = /\#done/gi;
		var found = pattern.test(thisEntryData.text);
		if (found) {
			DoneJobs[thisEntryData.user.screen_name] = thisEntryData;
		}
		$("#TR_"+thisEntryData.id).css("display","none");
	}
	for (entry in DoneJobs) {
		if (DoneJobs[entry] != false && jQuery.isFunction(DoneJobs[entry]) == false) {
			var myTR = $("#TR_"+DoneJobs[entry].id);
			myTR.css("display","block");
		}
	}
}




