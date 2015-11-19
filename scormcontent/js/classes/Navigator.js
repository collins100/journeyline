/*
	--- Navigator class ---

	NOTE: Declared as singleton/global object in main.js
	
	Allows dynamic navigation in the module
*/

// use the ERS namespace for all code
var ERS = ERS || {};


// ---- Navigator constructor ----
ERS.Navigator = function() {
	
};

// ---- Next screen navigation from index ----
ERS.Navigator.prototype.nextScreen = function() {

	if( MODULE_GATED )
	{
		if( !this._screenWasPreviouslyFinished( ERS.moduleData.getCurrentScreenNumber() ) )
			return;
	}

	// Journeyline modules
	if( ERS.moduleData.getBaseScreenObject() instanceof ERS.JourneylineScreen )
	{
		// navigate between popups, not base screens
		this._journeylinePopupNavigation( true );
		return;
	}
	this.gotoScreen( ERS.moduleData.getCurrentScreenNumber() + 1 );
};

// ---- Previous screen navigation from index ----
ERS.Navigator.prototype.previousScreen = function() {
	
	// Journeyline modules
	if( ERS.moduleData.getBaseScreenObject() instanceof ERS.JourneylineScreen )
	{
		// navigate between popups, not base screens
		this._journeylinePopupNavigation( false );
		return;
	}

	this.gotoScreen( ERS.moduleData.getCurrentScreenNumber() - 1 );
};

// ---- Jumps to a specific screen, if it exists ----
ERS.Navigator.prototype.gotoScreen = function( a_screenNumber ) {
	
	// if screen exists (was set), display that screen
	if( ERS.moduleData.setCurrentScreenNumber( a_screenNumber ) ){
		ERS.moduleData.displayNewScreen();
	}
};

ERS.Navigator.prototype.changeImage = function(){
	var currentPopupName = ERS.moduleData.getCurrentScreenObject().getScreenName();
	var imageF = document.getElementById("forwardButton");
	var imageB = document.getElementById("backButton");
	if(currentPopupName == "pop39"){
		imageF.src = "media/global/images/btn_next_blank.png";
	}
	else if (currentPopupName == "pop1"){
		imageB.src = "media/global/images/btn_next_blank.png";
	}
	else{imageF.src = "media/global/images/btn_next.png"; imageB.src = "media/global/images/btn_previous.png";}
};
ERS.Navigator.prototype.restoreImage = function(){
	//var currentPopupName = ERS.moduleData.getCurrentScreenObject().getScreenName();
	var imageF = document.getElementById("forwardButton");
	var imageB = document.getElementById("backButton");
	//if(currentPopupName != "pop38"){
	imageF.src = "media/global/images/btn_next.png";
	imageB.src = "media/global/images/btn_previous.png";
	//}
};


// ---- Helper functions ----
// --------------------------

ERS.Navigator.prototype._screenWasPreviouslyFinished = function( a_screenNumber ) {
	return ERS.cookie.getScreensComplete( true )[a_screenNumber] == "true" ? true : false;
};

// ---- a_forward determines next popup/last popup
ERS.Navigator.prototype._journeylinePopupNavigation = function( a_forward ) {
	// goto next popup screen instead of next base screen
	var currentPopupName = ERS.moduleData.getCurrentScreenObject().getScreenName();
	var currentPopupScreen = ERS.moduleData.getBaseScreenObject().getPopupByName( currentPopupName );
	var nextPopupScreen = ERS.moduleData.getBaseScreenObject().getNextPopup( currentPopupName, a_forward ? true : false );
	/*var imageF = document.getElementById("forwardButton");
	if(currentPopupName == "pop38" || currentPopupName == "pop39"){
		imageF.src = "media/global/images/btn_next_blank.png";
	}
	else{imageF.src = "media/global/images/btn_next.png";}
	/*if(currentPopupName == "pop39"){
		nextPopupScreen = null;
	}*/
	// there is no next popup, exit
	if( nextPopupScreen == null ){
		return;}
	
	currentPopupScreen.unloadScreen();
	nextPopupScreen.loadScreen();
};
