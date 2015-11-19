/*
	--- HelpScreen class ---
	
	Inherits from the PopupScreen class.
		- instances of this class live in a list contained by this instance's corresponding Screen object.
		- controls the help screen popup for the module
*/

// use the ERS namespace for all code
var ERS = ERS || {};

ERS.HelpScreen = function() {
	
};
// -- Make the HelpScreen class a child of the PopupScreen class
ERS.HelpScreen.prototype = Object.create( ERS.PopupScreen );

// ---- because the PopupScreen constructor calls on the DOM, we need to call it after the DOM is ready ----
ERS.HelpScreen.prototype.init = function() {
	// construct the arguments for PopupScreen parent constructor
	var args = [ "help", "", false, null ];
	ERS.PopupScreen.apply( this, args ); // initialize parent's constructor
	
	// DUAL HELP SCREENS
	this._hasTwoHelpScreens = true;
	
	this._htmlPath = MEDIA_POPUPS_PATH + "/help/help.html";
	this._backgroundImageURL = MEDIA_POPUPS_PATH + "/help/help.png";
	
	this._firstScreen = true; // utility member for two help screens
};

ERS.HelpScreen.prototype.loadScreen = function() {
	
	if( this._isDisplaying )
		return;
	
	// call base function
	ERS.PopupScreen.prototype.loadScreen.call( this );
};

ERS.HelpScreen.prototype.animatorGetRequestComplete = function() {
	// call base function
	ERS.PopupScreen.prototype.animatorGetRequestComplete.call( this );
};

ERS.HelpScreen.prototype.unloadScreen = function() {
	// call base function
	ERS.PopupScreen.prototype.unloadScreen.call( this );
	
	// code for multiple help screens
	if( this._hasTwoHelpScreens && this._firstScreen )
	{
		this._firstScreen = false;
		this._backgroundImageURL = MEDIA_POPUPS_PATH + "/help/help2.png";
		ERS.helpPopup.loadScreen();
	}
	else
	{
		this._firstScreen = true;
		this._backgroundImageURL = MEDIA_POPUPS_PATH + "/help/help.png";
	}
	
	this._isDisplaying = false;
};

ERS.HelpScreen.prototype.timeUpdate = function() {
	// call base function
	ERS.PopupScreen.prototype.timeUpdate.call( this );
};

// ---- data getters ----
ERS.HelpScreen.prototype.getScreenName = function() {
	// call base function
	return ERS.PopupScreen.prototype.getScreenName.call( this );
};
ERS.HelpScreen.prototype.getDivContainerId = function() {
	// call base function
	return ERS.PopupScreen.prototype.getDivContainerId.call( this );
};
ERS.HelpScreen.prototype.getMediaPlayer = function() {
	// call base function
	return ERS.PopupScreen.prototype.getMediaPlayer.call( this );
};


// ---- Helper Functions ---- //
// -------------------------- //

ERS.HelpScreen.prototype._loadScreenComplete = function( a_DOMRef ) {
	// call base function
	ERS.PopupScreen.prototype._loadScreenComplete.call( this, a_DOMRef );
	
	this._isDisplaying = true;
};

ERS.HelpScreen.prototype._determineAudioOrVideo = function() {
	// call base function
	ERS.PopupScreen.prototype._determineAudioOrVideo.call( this );
};

ERS.HelpScreen.prototype._buildButtons = function() {
	// call base function
	ERS.PopupScreen.prototype._buildButtons.call( this );
};