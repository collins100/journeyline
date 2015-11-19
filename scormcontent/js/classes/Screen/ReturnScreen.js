/*
	--- ReturnScreen class ---
	
	Inherits from the PopupScreen class.
		- instances of this class live in a list contained by this instance's corresponding Screen object.
		- controls functionality of "flash card" popup instances
*/

// use the ERS namespace for all code
var ERS = ERS || {};

ERS.ReturnScreen = function() {
	
};
// -- Make the ReturnScreen class a child of the PopupScreen class
ERS.ReturnScreen.prototype = Object.create( ERS.PopupScreen );

// ---- because the PopupScreen constructor calls on the DOM, we need to call it after the DOM is ready ----
ERS.ReturnScreen.prototype.init = function() {
	// construct the arguments for PopupScreen parent constructor
	var args = [ "return", "", false, null ];
	ERS.PopupScreen.apply( this, args ); // initialize parent's constructor
	
	this._htmlPath = MEDIA_POPUPS_PATH + "/return/return.html";
	this._backgroundImageURL = MEDIA_POPUPS_PATH + "/return/return.png";
};

ERS.ReturnScreen.prototype.loadScreen = function() {
	
	if( this._isDisplaying )
		return;
	
	// call base function
	ERS.PopupScreen.prototype.loadScreen.call( this );
};

ERS.ReturnScreen.prototype.animatorGetRequestComplete = function() {
	// call base function
	ERS.PopupScreen.prototype.animatorGetRequestComplete.call( this );
};

ERS.ReturnScreen.prototype.unloadScreen = function() {
	// call base function
	ERS.PopupScreen.prototype.unloadScreen.call( this );
	
	this._isDisplaying = false;
};

ERS.ReturnScreen.prototype.timeUpdate = function() {
	// call base function
	ERS.PopupScreen.prototype.timeUpdate.call( this );
};

// ---- data getters ----
ERS.ReturnScreen.prototype.getScreenName = function() {
	// call base function
	return ERS.PopupScreen.prototype.getScreenName.call( this );
};
ERS.ReturnScreen.prototype.getDivContainerId = function() {
	// call base function
	return ERS.PopupScreen.prototype.getDivContainerId.call( this );
};
ERS.ReturnScreen.prototype.getMediaPlayer = function() {
	// call base function
	return ERS.PopupScreen.prototype.getMediaPlayer.call( this );
};
ERS.ReturnScreen.prototype.getOptionByName = function( a_optionName ) {
	// call base function
	return ERS.Screen.prototype.getOptionByName.call( this, a_optionName );
};


// ---- Helper Functions ---- //
// -------------------------- //

ERS.ReturnScreen.prototype._loadScreenComplete = function( a_DOMRef ) {
	// call base function
	ERS.PopupScreen.prototype._loadScreenComplete.call( this, a_DOMRef );
	
	this._isDisplaying = true;
};

ERS.ReturnScreen.prototype._determineAudioOrVideo = function() {
	// call base function
	ERS.PopupScreen.prototype._determineAudioOrVideo.call( this );
};

ERS.ReturnScreen.prototype._buildButtons = function() {
	// call base function
	ERS.PopupScreen.prototype._buildButtons.call( this );
};
ERS.ReturnScreen.prototype._journeylineUnload = function() {
	// call base function
	ERS.PopupScreen.prototype._journeylineUnload.call( this );
}