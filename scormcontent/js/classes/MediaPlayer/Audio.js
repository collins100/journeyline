/*
	--- Audio class ---
	
	Inherits from the MediaPlayer class, controls all audio playback
*/

// use the ERS namespace for all code
var ERS = ERS || {};


// ---- Audio constructor ----
ERS.Audio = function() {
	ERS.MediaPlayer.apply( this, arguments ); // initialize parent's members
};
// -- Make the Audio class a child of the MediaPlayer class
ERS.Audio.prototype = Object.create( ERS.MediaPlayer );

// ---- toggle playPauseButton override ----
ERS.Audio.prototype.togglePlayPause = function() {
	// call base function
	ERS.MediaPlayer.prototype.togglePlayPause.call(this);
};
ERS.Audio.prototype.togglePlayReset = function() {
	// call base function
	ERS.MediaPlayer.prototype.togglePlayReset.call(this);
};
ERS.Audio.prototype.refresh = function() {
	// call base function
	ERS.MediaPlayer.prototype.refresh.call(this);
};

ERS.Audio.prototype.loadMedia = function( a_mediaPath, a_mediaDOM ) {
	// call base function
	ERS.MediaPlayer.prototype.loadMedia.call( this, a_mediaPath, a_mediaDOM );
};
ERS.Audio.prototype.unloadMedia = function() {
	// call base function
	ERS.MediaPlayer.prototype.unloadMedia.call( this );
};

// ---- play button override ----
ERS.Audio.prototype.play = function() {
	// call base function
	ERS.MediaPlayer.prototype.play.call(this);
};
// ---- pause button overrride ----
ERS.Audio.prototype.pause = function(a_effectUI) {
	// call base function
	ERS.MediaPlayer.prototype.pause.call(this, a_effectUI);
};
// ---- reset object override ----
ERS.Audio.prototype.reset = function() {
	// call base function
	ERS.MediaPlayer.prototype.reset.call(this);
};
// ---- timeUpdate override ----
ERS.Audio.prototype.timeUpdate = function() {
	// call base function
	ERS.MediaPlayer.prototype.timeUpdate.call(this);
};

ERS.Audio.prototype.scrubberTouched = function( e ) {
	// call base function
	ERS.MediaPlayer.prototype.scrubberTouched.call(this, e);
};

ERS.Audio.prototype.getMediaDOM = function() {
	// call base function
	return ERS.MediaPlayer.prototype.getMediaDOM.call(this);
};

// ---- Helper functions ----

ERS.Audio.prototype._setCurrentTime = function( a_currentTime ) {
	// call base function
	ERS.MediaPlayer.prototype._setCurrentTime.call(this, a_currentTime);
};