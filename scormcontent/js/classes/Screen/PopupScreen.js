/*
	--- PopupScreen class ---
	
	Inherits from the Screen class.
		- instances of this class live in a list contained by this instance's corresponding Screen object.
*/

// use the ERS namespace for all code
var ERS = ERS || {};

ERS.PopupScreen = function( a_params ) {
	
	this._parentScreenRef = a_params.parentScreenRef;
	this._parentScreenName = a_params.parentScreenName;
	
	// construct the arguments for Screen parent constructor
	var params = {
		screenName: a_params.name,
		mediaName: a_params.mediaName,
		hasAnimation: a_params.hasAnimation,
		assessmentType: a_params.assessmentType,
		assessmentOptions: a_params.assessmentOptions,
		options: a_params.options,
		screenPath: MEDIA_SCREENS_PATH + "/" + this._parentScreenName + "/" + a_params.name + "/"
	};
	ERS.Screen.call( this, params ); // initialize parent's constructor
	
	// change the path to this popup's HTML file
	this._htmlPath = MEDIA_SCREENS_PATH + "/" + this._parentScreenName + "/" + this._screenName + "/" + this._screenName + ".html";
	// change the popup's background image
	this._backgroundImageURL = MEDIA_SCREENS_PATH + "/" + this._parentScreenName + "/" + this._screenName + "/" + this._screenName + ".png";
	
	this._loadDOM = ERS.DOM.contentBG;
	
	this._isDisplaying = false;
};
// -- Make the PopupScreen class a child of the Screen class
ERS.PopupScreen.prototype = Object.create( ERS.Screen );

ERS.PopupScreen.prototype.loadScreen = function() {
	
	if( this._isDisplaying )
		return;
	
	// call base function
	ERS.Screen.prototype.loadScreen.call( this );
};

ERS.PopupScreen.prototype.animatorGetRequestComplete = function() {
	// call base function
	ERS.Screen.prototype.animatorGetRequestComplete.call( this );
};

ERS.PopupScreen.prototype.unloadScreen = function() {
	// call base function
	ERS.Screen.prototype.unloadScreen.call( this );
	
	this._isDisplaying = false;
	
	// Journeyline screens, and make sure it only affects secondary popups
	if( ERS.moduleData.getBaseScreenObject() instanceof ERS.JourneylineScreen && ERS.moduleData.getZBufferLength() <= 1 )
	{
		// hide the playback bar
		if( !(this instanceof ERS.HelpScreen) )
		{
			ERS.DOM.bottomBar.style.display = "none";
		}
		
		// enable keyboard scrolling when popups close
		ERS.moduleData.getBaseScreenObject().enableKeyboardScroll( true );
	}
};

ERS.PopupScreen.prototype.timeUpdate = function() {
	// call base function
	ERS.Screen.prototype.timeUpdate.call( this, this.getMediaPlayer().getMediaDOM() );
};

// ---- data getters ----
ERS.PopupScreen.prototype.getScreenName = function() {
	// call base function
	return ERS.Screen.prototype.getScreenName.call( this );
};
ERS.PopupScreen.prototype.getDivContainerId = function() {
	// call base function
	return ERS.Screen.prototype.getDivContainerId.call( this );
};
ERS.PopupScreen.prototype.getMediaPlayer = function() {
	// call base function
	return ERS.Screen.prototype.getMediaPlayer.call( this );
};

ERS.PopupScreen.prototype.getOptionByName = function( a_optionName ) {
	// call base function
	return ERS.Screen.prototype.getOptionByName.call( this, a_optionName );
};

// ---- Helper Functions ---- //
// -------------------------- //

ERS.PopupScreen.prototype._loadScreenComplete = function( a_DOMRef ) {
	// call base function
	ERS.Screen.prototype._loadScreenComplete.call( this, a_DOMRef );
	
	// Journeyline screens, and make sure it only affects secondary popups
	if( ERS.moduleData.getBaseScreenObject() instanceof ERS.JourneylineScreen && ERS.moduleData.getZBufferLength() <= 2 )
	{
		// disable keyboard scrolling when popups open
		ERS.moduleData.getBaseScreenObject().enableKeyboardScroll( false );
		// display the playback bar
		if( !(this instanceof ERS.HelpScreen) )
			ERS.DOM.bottomBar.style.display = "inherit";
	}
	
	this._isDisplaying = true;
};

ERS.PopupScreen.prototype._determineAudioOrVideo = function() {
	// call base function
	return ERS.Screen.prototype._determineAudioOrVideo.call( this );
};

ERS.PopupScreen.prototype._buildButtons = function() {
	// call base function
	ERS.Screen.prototype._buildButtons.call( this );
};

ERS.PopupScreen.prototype._parseAssessmentType = function( a_type, a_options ) {
	
	// call base function
	return ERS.Screen.prototype._parseAssessmentType.call( this, a_type, a_options );
};

ERS.PopupScreen.prototype._journeylineUnload = function() {
	// call base function
	ERS.Screen.prototype._journeylineUnload.call( this );
};