/**
 * @author  Toni Wagner
 * @version  1.0
 *
  */


/**
 * the aSurveillance Object 
 *
 * @return an aSurveillance object
 */
 
aSurveillance = function() {
	this.Checks = new Array();
	
	this.SurveillanceDialogId = "none";
	
	this.interval = 500; // callback to itself in milliseconds
	
	this.lastcheck = tools__NOW();
	// DIALOG__call(title, content, autoclosedelay, noclose, animate, uponClose,Position,noOverlay,resize,onShow) 
	
	return this;
}

/**
 * the aSurveillance Object Function that
 * allows to add new Checks-Objects to the surveillance object array Checks
 * CHECKOBJECT {
 *		id: "MyGreatTimedAndRuledCheck"
 * 	nextCheckTime: 0,
 *		checkInterval: 10000,   // this will be added to the nextCheckTime IF the time was reached before (=independent of checkRule!)
 *		checkRule: function() { return true; },
 *		myCheck: function() { what to do IF nextCheckTime is reached AND checkRule returns TRUE }
 *	}
 * @see aSurveillance
 * @return the id of the new CheckObject
 */
aSurveillance.prototype.addCheck = function(CheckObject) {
	var myIndex = this.getCheckIdxById(CheckObject.id);
	if (myIndex != -1) {
		this.Checks[myIndex] = CheckObject;
	} else {
		this.Checks.push(CheckObject);
	}
	return this.getCheckIdxById(CheckObject.id);
}

/**
 * the aSurveillance Object Function
 * that deletes a Check by its id
 *
 * @param CheckID: the ID of the Check to be found.
 * @return true/false depending on whether the Check was successfully removed.
 */
aSurveillance.prototype.removeCheck = function(CheckID) {
	var idx = this.getCheckIdxById(CheckID);
	if (idx == 1) return false;
	this.Checks.splice(idx,1);
	return true;
}

/**
 * the aSurveillance Object Function
 * that allows to find the index of a Check by its id
 *  this is useful internally to remove checks
 * @param CheckID: the ID of the Check to be found.
 * @return the array-index of a Check; -1 if no matching CheckID is found
 */
aSurveillance.prototype.getCheckIdxById = function(CheckID) {
	for (var i=0; i<this.Checks.length; i++) {
		if (this.Checks[i].id == CheckID) return i;
	}
	return -1;
}

/**
 * the aSurveillance Object Function that will display info on the current state of the surveillance instance
 *
  */
aSurveillance.prototype.InfoDialog = function() {
	//DIALOG__call(title, content, autoclosedelay, noclose, animate, uponClose,Position,noOverlay,resize,onShow) 
	this.SurveillanceDialogId = DIALOG__call("surveillance", "lastcheck <span id='surveillance_lastcheck'>0000</span>", 0, false,"",function() {}, null,true,false,function(){});
}

/**
 * aSurveillance Object Function that iterates through all checks
 * and handles their execution
 * setTImeouts its own next execution
 *
 */
aSurveillance.prototype.runChecks = function() {
	var now =  tools__NOW();
	if (this.SurveillanceDialogId!="none") {
		$("#"+this.SurveillanceDialogId).dialog("open");
		$("#surveillance_lastcheck").html(now);
	}
	for (var i=0;i<this.Checks.length;i++) {
		if (now>this.Checks[i].nextCheckTime) {
			if (this.Checks[i].checkRule) {
				this.Checks[i].nextCheckTime = now + this.Checks[i].checkInterval
				this.Checks[i].myCheck();
			}
		}
	}
	this.lastcheck = now;
	setTimeout("mySurveillance.runChecks();",mySurveillance.interval);
}


// *******************************************************************************************************
// *******************************************************************************************************
// *******************************************************************************************************
// *******************************************************************************************************


/**
 * generates the current microseconds time-format 
 *
 * @return NOW in microseconds
 */
 
function tools__NOW() {
	var dateNow = new Date();
	var ms = Date.parse(dateNow);
	return ms;
}


/**
 * checks, whether the surveillance self-callback is still running.
 * kind of a strange function, but it turns out, that there are instances where setTimeouts fail
 *
 * @see aSurveillance
 */

function checkSurveillance() {
	var dateNow = new Date();
	var myNow = Date.parse(dateNow)
	if (myNow >mySurveillance.lastcheck + mySurveillance.interval) {	
		setTimeout("mySurveillance.runChecks();",mySurveillance.interval);
	}
	setTimeout("checkSurveillance();",15000);
}


