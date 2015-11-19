/*
	--- MediaPlayer class ---

	Controls all media (audio/video) in the module
	NOTE: Both ERS.Audio and ERS.Video classes inherit from this class
*/

// use the ERS namespace for all code
var ERS = ERS || {};


// ---- MediaPlayer constructor ----
ERS.MediaPlayer = function( a_mediaPath, a_animatorRef, a_screenRef ) {
	this._mediaPath = a_mediaPath;
	this._animatorRef = a_animatorRef;
	this._screenRef = a_screenRef;
	this._isPopup = (this._screenRef instanceof ERS.PopupScreen) ? true : false;
	// assign the audio or video DOM object to load the media to
	this._mediaDOMObject = (this instanceof ERS.Audio) ? ERS.DOM.audio : ERS.DOM.video;
	
	if( a_screenRef instanceof ERS.GlossaryScreen )
		this._mediaDOMObject = document.getElementById( "glossAudioID" );
		
	// saves the current time of this MediaPlayer's audio/video element for pause/resume
	this._currentTime = 0;
	this._isPlaying = false;
	this._ended = false;
	this._hasEndedOnce = false;
};

// ---- called from the playPauseButton, toggles playing/pausing of media ----
ERS.MediaPlayer.prototype.togglePlayPause = function() {
	if( !this._mediaDOMObject.paused )
	{
		this.pause();
	}
	else if( this._ended )
	{
		// media ended, reset it and play again
		this.refresh();
	}
	else
	{
		this.play();
	}
};

ERS.MediaPlayer.prototype.togglePlayReset = function() {
	if( !this._mediaDOMObject.paused )
	{
		this.reset();
		this.pause();
	}
	else if( this._ended )
	{
		// media ended, reset it and play again
		this.refresh();
	}
	else
	{
		this.play();
	}
};

// ---- media re-play function (reset/play) ----
ERS.MediaPlayer.prototype.refresh = function() {
	
	// if this screen's media player is set to do full refreshes
	if( this._screenRef.getOptionByName( "refresh" ) == "full" )
	{
		ERS.navigator.gotoScreen( ERS.moduleData.getCurrentScreenNumber() );
		return;
	}
	
	// attempting to refresh a media player that has no loaded media
	if( this._mediaPath == "" )
	{
		return;
	}
	
	// otherwise, just standard refresh calls
	this.reset();
	this.play();
};

ERS.MediaPlayer.prototype.loadMedia = function( a_mediaPath, a_mediaDOM ) {
	
	if( a_mediaPath )
		this._mediaPath = a_mediaPath;
	
	if( a_mediaDOM )
		this._mediaDOMObject = a_mediaDOM;
	
	this._isPlaying = false;
	
	if( this instanceof ERS.Video )
	{
		if( this._isPopup )
		{
			this._mediaDOMObject = document.getElementById( "popupVideoID" );
		}
		
		ERS.DOM.video.style.display = "inherit";
	}
	
	// set the src, load, and resume from the old time
	this._mediaDOMObject.src = this._mediaPath;
	this._mediaDOMObject.load();
};

ERS.MediaPlayer.prototype.unloadMedia = function() {
	
	this.pause( false );
	
	if( this instanceof ERS.Video )
	{
		ERS.DOM.video.style.display = "none";
		this._mediaDOMObject.src = "";
		this._mediaDOMObject.load();
	}
	
	ERS.moduleData.activateNextScreenInBuffer();
};

// ---- parent play function ----
ERS.MediaPlayer.prototype.play = function() {
	
	// change the play button into a pause button
	$( "#" + ERS.DOM.playPauseButton.id ).switchClass( "play", "pause" );
	
	// use the old time (for resuming playback)
	this._setCurrentTime( this._currentTime );
	// if this media player object has already played through, don't replay until the user explicitly asks
	if( !this._ended )
		this._mediaDOMObject.play(); 
	
	this._isPlaying = true;
};
// ---- parent pause function ----
ERS.MediaPlayer.prototype.pause = function( a_effectUI ) {
	
	if( a_effectUI != false )
	{
		// change the pause button into a play button
		$( "#" + ERS.DOM.playPauseButton.id ).switchClass( "pause", "play" );
	}
	
	// if there is/was media playing AND if this is the current screen object
	if( (this._isPlaying || this._ended) && ERS.moduleData.getCurrentScreenObject() == this._screenRef )
	{
		//console.log( "saving current time for screen: " + this._screenRef.getScreenName() );
		// save the media's current time (for resuming)
		this._currentTime = this._mediaDOMObject.currentTime;
	}
	
	// pause the audio/video element
	this._mediaDOMObject.pause();
	
	this._isPlaying = false;
};

// ---- reset this MediaPlayer object as if it is being played for the first time ----
ERS.MediaPlayer.prototype.reset = function() {

	this._ended = false;
	this._currentTime = 0;
	this._setCurrentTime( 0 );
	ERS.DOM.scrubber.style.width = "0px";
	this.loadMedia();
	
	if( this._animatorRef != null )
		this._animatorRef.timeReset();
};

// ---- called on every ontimeupdate for this MediaPlayer's media DOM object ----
ERS.MediaPlayer.prototype.timeUpdate = function() {

	// keep track of the current time
	if( this._isPlaying )
	{
		this._currentTime = this._mediaDOMObject.currentTime;
	}
	// determine if the audio/video element is finished
	if( this._mediaDOMObject.ended )
	{
		this._ended = true;
		// save that the user has completed this audio (base screen only)
		if( this._screenRef instanceof ERS.Screen )
			ERS.cookie.setScreenComplete( ERS.moduleData.getCurrentScreenNumber(), true );
		
		// make sure the scrubber is sitting at the end of the bar
		var scrubberWidth = $( "#" + ERS.DOM.scrubberBackground.id ).width();
		ERS.DOM.scrubber.style.width = ((scrubberWidth * .01) * 100) + "px";
		
		this.pause();
		return;
	}
	
	this._ended = false;
	
	// set the scrubber according to the current time
    var progress_percent = Math.ceil( this._mediaDOMObject.currentTime / this._mediaDOMObject.duration * 100);
	var scrubberWidth = $( "#" + ERS.DOM.scrubberBackground.id ).width();
	ERS.DOM.scrubber.style.width = ((scrubberWidth * .01) * progress_percent) + "px";
};

// ---- called when the scrubber is clicked/touched, scrubs to the selected time in the media ----
ERS.MediaPlayer.prototype.scrubberTouched = function( e ) {
	// because we are making a sudden change in the currentTime, animator needs to make a full reset (unlike the media player)
	if( this._animatorRef != null )
		this._animatorRef.timeReset();
	
	var scrubberWidth = $( "#" + ERS.DOM.scrubberBackground.id ).width();
	var percentToSet = (e.offsetX / scrubberWidth);
	this._mediaDOMObject.currentTime = percentToSet * this._mediaDOMObject.duration;
};

ERS.MediaPlayer.prototype.getMediaDOM = function() {
	return this._mediaDOMObject;
};


// ---- Helper functions ----
// --------------------------

ERS.MediaPlayer.prototype._setCurrentTime = function( a_currentTime ) {

	var classRef = this;
	// special way to set the currentTime of a media element for iOS 7 (Mobile Safari 7.0)
	if( ERS.utility.isiOS7 )
	{
		this._mediaDOMObject.onreadystatechange = function() {
			classRef._mediaDOMObject.currentTime = a_currentTime;
		}
	}
	else //if( ERS.utility.isIE9 )
	{
		if( this._mediaDOMObject.readyState > 0 )
			this._mediaDOMObject.currentTime = a_currentTime;
	}
//	else
//	{
//		this._mediaDOMObject.currentTime = a_currentTime;
//	}
};