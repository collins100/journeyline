/*
	--- ResultScreen class ---
	
	Inherits from the PopupScreen class.
		- instances of this class live in a list contained by this instance's corresponding Screen object.
		- controls the module's result screen (after assessments)
*/

// use the ERS namespace for all code
var ERS = ERS || {};

ERS.ResultScreen = function( a_screenName, a_mediaName, a_hasAnimation, a_parentScreenName ) {
	
	this._currentCorrect = false;
	this._lastAttempt = false;
};
// -- Make the ResultScreen class a child of the PopupScreen class
ERS.ResultScreen.prototype = Object.create( ERS.PopupScreen );

// ---- because the PopupScreen constructor calls on the DOM, we need to call it after the DOM is ready ----
ERS.ResultScreen.prototype.init = function() {
	// construct the arguments for PopupScreen parent constructor
	var args = [ "result", "", false, null ];
	ERS.PopupScreen.apply( this, args ); // initialize parent's constructor
	
	this._htmlPath = MEDIA_POPUPS_PATH + "/result/result.html";
	this._backgroundImageURL = null;
};

ERS.ResultScreen.prototype.display = function( a_display, a_correct, a_lastAttempt ) {
	
	if( !a_display )
	{
		this.unloadScreen();
		return;
	}
	
	this._currentCorrect = a_correct;
	this._lastAttempt = a_lastAttempt;
	
	this.loadScreen();
};

ERS.ResultScreen.prototype.loadScreen = function() {
	// call base function
	ERS.PopupScreen.prototype.loadScreen.call( this );
};

ERS.ResultScreen.prototype.animatorGetRequestComplete = function() {
	// call base function
	ERS.PopupScreen.prototype.animatorGetRequestComplete.call( this );
};

ERS.ResultScreen.prototype.unloadScreen = function() {
	// call base function
	ERS.PopupScreen.prototype.unloadScreen.call( this );
};

ERS.ResultScreen.prototype.timeUpdate = function() {
	// call base function
	ERS.PopupScreen.prototype.timeUpdate.call( this );
};

// ---- data getters ----
ERS.ResultScreen.prototype.getScreenName = function() {
	// call base function
	return ERS.PopupScreen.prototype.getScreenName.call( this );
};
ERS.ResultScreen.prototype.getDivContainerId = function() {
	// call base function
	return ERS.PopupScreen.prototype.getDivContainerId.call( this );
};
ERS.ResultScreen.prototype.getMediaPlayer = function() {
	// call base function
	return ERS.PopupScreen.prototype.getMediaPlayer.call( this );
};



// ---- Helper Functions ---- //
// -------------------------- //

ERS.ResultScreen.prototype._loadScreenComplete = function( a_DOMRef ) {
	// call base function
	ERS.PopupScreen.prototype._loadScreenComplete.call( this, a_DOMRef );
	
	// after we have finished loading the result popup, change the css accordingly
	var resultImage = document.getElementById( "result_img" );
	var resultClose = document.getElementById( "result" );
	var resultCloseOverride = null;
	
	// grab the current assessment's DOM, used to check for override result images
	var assessmentScreen = ERS.moduleData.getBaseScreenObject();
	var screenContainerDOM = assessmentScreen.getDivContainerId();
	var screenDOM = $( "#" + screenContainerDOM );
	
	var defaultImagePath = MEDIA_POPUPS_PATH + "/result/";
	// actually set the result image's source appropriately
	// this will also override the default result images if one exists in this assessment's HTML
	if( this._currentCorrect )
	{
		resultImage.src = defaultImagePath + "correct.png";
		// should we override the default correct image?
		if( screenDOM.find( "#correct" ).length > 0 )
		{
			resultImage.src = screenDOM.find( "#correct" )[0].src;
			resultCloseOverride = document.getElementById( "correct_close" );
		}
	}
	else if( this._lastAttempt )
	{
		resultImage.src = defaultImagePath + "incorrect2.png";
		// should we override the default correct image?
		if( screenDOM.find( "#incorrect2" ).length > 0 )
		{
			resultImage.src = screenDOM.find( "#incorrect2" )[0].src;
			resultCloseOverride = document.getElementById( "incorrect2_close" );
		}
	}
	else
	{
		resultImage.src = defaultImagePath + "incorrect1.png";
		// should we override the default correct image?
		if( screenDOM.find( "#incorrect1" ).length > 0 )
		{
			resultImage.src = screenDOM.find( "#incorrect1" )[0].src;
			resultCloseOverride = document.getElementById( "incorrect1_close" );
		}
	}
	
	// if the default result image was overriden, check if the default close button should be re-positioned
	if( resultCloseOverride != null )
	{
		resultClose.style.top = resultCloseOverride.style.top;
		resultClose.style.left = resultCloseOverride.style.left;
		resultClose.style.width = resultCloseOverride.style.width;
		resultClose.style.height = resultCloseOverride.style.height;
	}
};

ERS.ResultScreen.prototype._determineAudioOrVideo = function() {
	// call base function
	ERS.PopupScreen.prototype._determineAudioOrVideo.call( this );
};

ERS.ResultScreen.prototype._buildButtons = function() {
	// call base function
	ERS.PopupScreen.prototype._buildButtons.call( this );
};