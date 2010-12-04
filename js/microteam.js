// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


$(document).ready(function() {
	myMessages = new aMessagesInstance();
	myPlugins.add(myMessages);
});


// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++



aMessagesInstance = function() {
	this.messages = new Array();
	return this;
}

aMessagesInstance.prototype.init = function() {
	myBrowser.FileName_messages = "microteam.php";
	// CREATE the Message Dialogs
	loadHTML(myBrowser.URL_html+"MessagesColumn.html",function(html_ID) {
			var myhtml = localize(myBrowser.loadedhtml[html_ID].data);
			var myDialogID = Dialog_build(localized_text[myBrowser.language]["MessagesColumn__HeaderText"],myhtml);
			$("#"+myDialogID).dialog({autoOpen:false, width:"auto", resizable: false, modal: true});
			myBrowser.MessagesColumn = $("#"+myDialogID);
		},false);
	loadHTML(myBrowser.URL_html+"MessagesEntry.html",function(html_ID) {
			var myhtml = localize(myBrowser.loadedhtml[html_ID].data);
			var myDialogID = Dialog_build(localized_text[myBrowser.language]["MessagesEntry__HeaderText"],myhtml);
			$("#"+myDialogID).dialog({autoOpen:false, width:"auto", resizable: false, modal: true});
			myBrowser.MessagesEntry = $("#"+myDialogID);
		},false);
	
	var MessagesReady = {
		id: "MessagesReady",
		checkInterval: 1000,
		nextCheckTime: 0,
		checkRule: true,
		done: false,
		myCheck: function() {
			if (myBrowser.MessagesEntry != "undefined" && myBrowser.MessagesColumn != "undefined") {
				mySurveillance.removeCheck(this.id);
				this.done = true;
			}
		}
	}
	mySurveillance.addCheck(MessagesReady);
	
}

aMessagesInstance.prototype.ParseCommunication = function(JSONDOC) {
	
}

aMessagesInstance.prototype.RetrieveMessages = function(callback) {
	var postinfo = {};	// generate an object to pass via POST
	postinfo.job = "messages";		// this is passed to tell the serverside php what we want to do
	postinfo.browserID = myBrowser.id;  // with this we ID our script instance for the server...
	postinfo.command = "get";
	$.post(myBrowser.URL_backend+myBrowser.FileName_console, postinfo,	// POST VIA AJAX!
		function(doc){	// IF ajax call is returned do this...
			var JSONdoc = AJAX__ProcessAnswer(doc);
			if (jQuery.isFunction(callback)) callback(JSONdoc);
		}
	);
	
}


aMessagesInstance.prototype.SendMessage = function(content) {
	var SafeContent = this.VerifyMessage(content);
	if (!SafeContent) return false;
	
	var postinfo = {};	// generate an object to pass via POST
	postinfo.job = "messages";		// this is passed to tell the serverside php what we want to do
	postinfo.browserID = myBrowser.id;  // with this we ID our script instance for the server...
	postinfo.command = "add";
	postinfo.content = SafeContent;
	
	$.post(myBrowser.URL_backend+myBrowser.FileName_console, postinfo,	// POST VIA AJAX!
		function(doc){	// IF ajax call is returned do this...
			var JSONdoc = AJAX__ProcessAnswer(doc);
			if (jQuery.isFunction(callback)) callback(JSONdoc);
		}
	);
	
}

aMessagesInstance.prototype.VerifyMessage = function(message) {
	// needs all kinds of checks!
	return message;
}



// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

