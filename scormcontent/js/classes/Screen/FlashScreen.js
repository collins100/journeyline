/*
	--- FlashScreen class ---
	
	Inherits from the PopupScreen class.
		- instances of this class live in a list contained by this instance's corresponding Screen object.
		- controls functionality of "flash card" popup instances
*/

// use the ERS namespace for all code
var ERS = ERS || {};

ERS.FlashScreen = function( a_screenName, a_mediaName, a_hasAnimation, a_parentScreenName ) {
	
	// construct the arguments for PopupScreen parent constructor
	var args = [ a_screenName, a_mediaName, a_hasAnimation, a_parentScreenName ];
	ERS.PopupScreen.apply( this, args ); // initialize parent's constructor
	
	// flash screens don't have a traditional background image
	this._backgroundImageURL = null;
	
	// get the paths to this flash screens front/back images
	var rawPath = MEDIA_SCREENS_PATH + "/" + this._parentScreenName + "/" + this._screenName + "/" + this._screenName;
	this._frontSrcPath = rawPath + "_front.png";
	this._backSrcPath = rawPath + "_back.png";
	// flash card master HTML file path
	this._flashMasterHTMLPath = MEDIA_POPUPS_PATH + "/flashCard/flashCardMaster.html";
	this._cardDOMElement;
};
// -- Make the FlashScreen class a child of the PopupScreen class
ERS.FlashScreen.prototype = Object.create( ERS.PopupScreen );

// ---- when called, this function will flip this flash card ----
ERS.FlashScreen.prototype.flip = function() {
	// add/remove the flipped class appropriately
	if( $( this._cardDOMElement ).hasClass( "flipped" ) )
		$( this._cardDOMElement ).removeClass( "flipped" );
	else
		$( this._cardDOMElement ).addClass( "flipped" );
};

ERS.FlashScreen.prototype.loadScreen = function() {
	// call base function
	ERS.PopupScreen.prototype.loadScreen.call( this );
};

ERS.FlashScreen.prototype.animatorGetRequestComplete = function() {
	// call base function
	ERS.PopupScreen.prototype.animatorGetRequestComplete.call( this );
};

ERS.FlashScreen.prototype.unloadScreen = function() {
	// call base function
	ERS.PopupScreen.prototype.unloadScreen.call( this );
};

ERS.FlashScreen.prototype.timeUpdate = function() {
	// call base function
	ERS.PopupScreen.prototype.timeUpdate.call( this );
};

// ---- data getters ----
ERS.FlashScreen.prototype.getScreenName = function() {
	// call base function
	return ERS.PopupScreen.prototype.getScreenName.call( this );
};
ERS.FlashScreen.prototype.getDivContainerId = function() {
	// call base function
	return ERS.PopupScreen.prototype.getDivContainerId.call( this );
};
ERS.FlashScreen.prototype.getMediaPlayer = function() {
	// call base function
	return ERS.PopupScreen.prototype.getMediaPlayer.call( this );
};



// ---- Helper Functions ---- //
// -------------------------- //

ERS.FlashScreen.prototype._loadScreenComplete = function( a_DOMRef ) {
	// call base function
	ERS.PopupScreen.prototype._loadScreenComplete.call( this, a_DOMRef );
	
	// first, append a secondary container to 'load' the flash card master into
	var blankDiv = "<div id='flashMaster_container'></div>";
	$( "#" + this._containerDOM.id ).append( blankDiv );
	
	var classRef = this;
	// load the flash card master HTML data into this popup's container to make it a flash card
	$( "#flashMaster_container" ).load( this._flashMasterHTMLPath, function() {
		// append the front/back images to the flash card master HTML
		var imageHTML = BACKGROUND_IMAGE_HTML;
		imageHTML = imageHTML.replace( "SRC_REPLACE", classRef._frontSrcPath );
		$( "#flashFront" ).append( imageHTML );
		imageHTML = BACKGROUND_IMAGE_HTML;
		imageHTML = imageHTML.replace( "SRC_REPLACE", classRef._backSrcPath );
		$( "#flashBack" ).append( imageHTML );
		
		classRef._cardDOMElement = $( "#card" );
	});
};

ERS.FlashScreen.prototype._determineAudioOrVideo = function() {
	// call base function
	ERS.PopupScreen.prototype._determineAudioOrVideo.call( this );
};

ERS.FlashScreen.prototype._buildButtons = function() {
	// call base function
	ERS.PopupScreen.prototype._buildButtons.call( this );
};