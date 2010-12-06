/**
 * Starts the engines. everything that needs to be initialized should go here.
 * Basic global variables are set up here:
 * myBrowser - @see BrowserInstance
 * mySurveillance - @see aSurveillance
 * to add independent plugins and initiate them @see aPlugin function for more info
 *
 * @return true :)
 */

function bootstrap_1() {  // FIRE UP THE ENGINES!
	
	//this object holds all the general variables and information
	myBrowser = new BrowserInstance();

	// ################################################################################
	// ################################################################################
	// ###############		the SURVEILLANCE STARTS HERE								############################
	// ################################################################################
	// ################################################################################

	// this is a newly introduced object that will do constant checks and thereby work as  a global, subscibable timer...
	mySurveillance = new aSurveillance();
	mySurveillance.interval = 100;
	setTimeout("mySurveillance.runChecks();",mySurveillance.interval);
	setTimeout("checkSurveillance();",15000);  // we do that to have 2 instances constanly checking 
	setTimeout("checkSurveillance();",22000);  //

	// CREATE the side-docked menu
	myBrowser.menu = SideDock_menu();
	myBrowser.menu.updateButtonVisibility();
	
	// initiate the LoginPanel
	myBrowser.LoginPanel = $("#LoginPanel__ContainerDiv").dialog( {
		autoOpen : false,
		closeOnEscape : true,
		title: function() { 
			var a = localize("@#LOGINDIALOG__HeaderText#@"); 
			return a; 
		}
	} );
	
	// Run initialisation of Plugins that registered with the system
	myPlugins.initPlugins();
	
	// start talking to the server, say hello, ask for a still-open session and so on...
	AJAX__SessionCheck();

	// this will fill localized texts into the html objects identified by the .to_be_localized class
	$(".to_be_localized").each(function(i,val) { 
		var b = $(val).attr("localizefill"); 
		var a = localize(b); 
		$(val).html(a); 
	});
	
	return true;
}

