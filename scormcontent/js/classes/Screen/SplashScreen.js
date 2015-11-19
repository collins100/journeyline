/*
	--- SplashScreen class ---
	
	Inherits from the Screen class.
		- a type of Screen object, used to overlay the entire module's view (hiding menus, playback buttons, etc.)
		- to create an instance, in screens.xml set any screen's <type> tag to 'splash'
*/

// use the ERS namespace for all code
var ERS = ERS || {};

ERS.SplashScreen = function( a_params ){

	ERS.Screen.call( this, a_params ); // initialize parent's constructor
	
	this._loadDOM = ERS.DOM.contentBG;
};
// -- Make the SplashScreen class a child of the PopupScreen class
ERS.SplashScreen.prototype = Object.create( ERS.Screen );


ERS.SplashScreen.prototype.loadScreen = function() {
	
	ERS.DOM.bottomBar.style.display = "none";
	
	// call base function
	ERS.Screen.prototype.loadScreen.call( this );
};

ERS.SplashScreen.prototype.animatorGetRequestComplete = function() {
	// call base function
	ERS.Screen.prototype.animatorGetRequestComplete.call( this );
};

ERS.SplashScreen.prototype.unloadScreen = function() {
	
	ERS.DOM.bottomBar.display = "inherit";
	
	// call base function
	ERS.Screen.prototype.unloadScreen.call( this );
};

ERS.SplashScreen.prototype.timeUpdate = function() {
	// call base function
	ERS.Screen.prototype.timeUpdate.call( this );
};

// ---- data getters ----
ERS.SplashScreen.prototype.getScreenName = function() {
	// call base function
	return ERS.Screen.prototype.getScreenName.call( this );
};
ERS.SplashScreen.prototype.getDivContainerId = function() {
	// call base function
	return ERS.Screen.prototype.getDivContainerId.call( this );
};
ERS.SplashScreen.prototype.getMediaPlayer = function() {
	// call base function
	return ERS.Screen.prototype.getMediaPlayer.call( this );
};



// ---- Helper Functions ---- //
// -------------------------- //

ERS.SplashScreen.prototype._loadScreenComplete = function( a_DOMRef ) {
	// call base function
	ERS.Screen.prototype._loadScreenComplete.call( this, a_DOMRef );
};

ERS.SplashScreen.prototype._determineAudioOrVideo = function() {
	// call base function
	ERS.Screen.prototype._determineAudioOrVideo.call( this );
};

ERS.SplashScreen.prototype._parsePopupData = function( a_popupData ) {
	// call base function
	return ERS.Screen.prototype._parsePopupData.call( this, a_popupData );
};

ERS.SplashScreen.prototype._buildButtons = function() {
	// call base function
	ERS.Screen.prototype._buildButtons.call( this );
};

ERS.SplashScreen.prototype._parseScreenType = function( a_type ) {
	// don't parse anymore... TODO remove this from all classes inheriting from Screen
};