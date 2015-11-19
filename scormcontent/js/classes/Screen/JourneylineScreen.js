/*
	--- JourneylineScreen class ---
	
	Inherits from the Screen class.
		- a specialized type of screen for old school style Journeyline modules. Controls the scrolling background screen
*/

// use the ERS namespace for all code
var ERS = ERS || {};

ERS.JourneylineScreen = function( a_params ) {

	ERS.Screen.call( this, a_params ); // initialize parent's constructor
	
	this._scrollSpeed = 25;
};
// -- Make the JourneylineScreen class a child of the Screen class
ERS.JourneylineScreen.prototype = Object.create( ERS.Screen );

ERS.JourneylineScreen.prototype.loadScreen = function() {
	// call base function
	ERS.Screen.prototype.loadScreen.call( this );
};

ERS.JourneylineScreen.prototype.animatorGetRequestComplete = function() {
	// call base function
	ERS.Screen.prototype.animatorGetRequestComplete.call( this );
};

ERS.JourneylineScreen.prototype.unloadScreen = function() {
	
	// hide the playback buttons
	ERS.DOM.bottomBar.style.display = "none";
	
	// call base function
	ERS.Screen.prototype.unloadScreen.call( this );
};

ERS.JourneylineScreen.prototype.timeUpdate = function() {
	// call base function
	ERS.Screen.prototype.timeUpdate.call( this );
};

// ---- data getters ----
ERS.JourneylineScreen.prototype.getScreenName = function() {
	// call base function
	return ERS.Screen.prototype.getScreenName.call( this );
};
ERS.JourneylineScreen.prototype.getDivContainerId = function() {
	// call base function
	return ERS.Screen.prototype.getDivContainerId.call( this );
};
ERS.JourneylineScreen.prototype.getMediaPlayer = function() {
	// call base function
	return ERS.Screen.prototype.getMediaPlayer.call( this );
};

ERS.JourneylineScreen.prototype.getPopupByName = function( a_name ) {
	// call base function
	return ERS.Screen.prototype.getPopupByName.call( this, a_name );
};

ERS.JourneylineScreen.prototype.getOptionByName = function( a_optionName ) {
	// call base function
	return ERS.Screen.prototype.getOptionByName.call( this, a_optionName );
};

ERS.JourneylineScreen.prototype.getNextPopup = function( a_currentPopupName, a_nextPopup ) {
	// call base function
	return ERS.Screen.prototype.getNextPopup.call( this, a_currentPopupName, a_nextPopup );
};

ERS.JourneylineScreen.prototype.enableKeyboardScroll = function( a_enable ) {
	
	// disable the keyboard scrolling and return
	if( !a_enable )
	{
		$( document ).off( "keydown" );
		return;
	}
	
	// setup the keys for custom scrolling with keyboard
	var classRef = this;
	$( document ).keydown( function(event) {
		// left arrow key
		if( event.keyCode == 37 )
		{
			var currentPos = $( "#" + classRef._divContainerId ).scrollLeft();
			$( "#" + classRef._divContainerId ).scrollLeft(currentPos - classRef._scrollSpeed);
		}

		// right arrow key
		if( event.keyCode == 39 )
		{
			var currentPos = $( "#" + classRef._divContainerId ).scrollLeft();
			$( "#" + classRef._divContainerId ).scrollLeft(currentPos + classRef._scrollSpeed);
		}		
	});
};


// ---- Helper Functions ---- //
// -------------------------- //

ERS.JourneylineScreen.prototype._loadScreenComplete = function( a_DOMRef ) {
	// call base function
	ERS.Screen.prototype._loadScreenComplete.call( this, a_DOMRef );
	
	// hide the playback, it'll show on 'events' (popups)
	ERS.DOM.bottomBar.style.display = "none";
	// setup custom keyboard scrolling on PC
	this._disableKeyboardScroll();
	this.enableKeyboardScroll( true );
};

ERS.JourneylineScreen.prototype._determineAudioOrVideo = function() {
	// call base function
	return ERS.Screen.prototype._determineAudioOrVideo.call( this );
};

ERS.JourneylineScreen.prototype._parsePopupData = function( a_popupData ) {
	// call base function
	return ERS.Screen.prototype._parsePopupData.call( this, a_popupData );
};

ERS.JourneylineScreen.prototype._parseScreenType = function( a_type ) {
	// call base function
	ERS.Screen.prototype._parseScreenType.call( this );
};

ERS.JourneylineScreen.prototype._buildButtons = function() {
	// call base function
	ERS.Screen.prototype._buildButtons.call( this );
};

ERS.JourneylineScreen.prototype._dimUI = function( a_dim ) {
	// call base function
	ERS.Screen.prototype._dimUI.call( this, a_dim );
};

// ---- disables all standard keyboard scrolling for the module ----
ERS.JourneylineScreen.prototype._disableKeyboardScroll = function() {
	// NOTE: left: 37, up: 38, right: 39, down: 40,
	// NOTE: spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
	var keys = {37: 1, 38: 1, 39: 1, 40: 1};
	
	function preventDefault(e) {
	  e = e || window.event;
	  if (e.preventDefault)
		  e.preventDefault();
	  e.returnValue = false;  
	}
	
	document.onkeydown = function(e) {
		if (keys[e.keyCode]) {
			preventDefault(e);
			return false;
		}
	}
};