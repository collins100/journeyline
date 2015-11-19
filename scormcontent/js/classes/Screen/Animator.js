/*
	--- Animator class ---

	Controls the animations for one Screen.
*/

// use the ERS namespace for all code
var ERS = ERS || {};


ERS.Animator = function( a_screenRef, a_containerDivId, a_screenPath ) {
	// save a reference to the screen that contains this Animator
	this._screenRef = a_screenRef;
	this._screenName = a_screenRef.getScreenName();
	// which DOM element should this Animator append the animations to?
	this._containerDivId = a_containerDivId;
	this._screenPath = a_screenPath;
	
	// holds the list of 'animation' JSON objects this Animator will use
	this._animations = [];
};

ERS.Animator.prototype.getXMLData = function() {
	
	// if this animator already has data, just let this animator's parent screen know we're done with the XML and return
	if( this._animations.length > 0 )
	{
		this._screenRef.animatorGetRequestComplete();
		return;
	}
	// otherwise, get the animation data from the server
	$.ajax({
        type: "GET",
        url:  this._screenPath + "animation.xml",
        dataType: "xml",
        async: true, // getting the XML will happen asynchronously
		context: this, // make sure the 'this' keyword in parseXMLScreens refers to the current Module object
        success: this.parseXMLAnimations,
		error: function (xhr, ajaxOptions, thrownError) {
			console.warn( "Animator ERROR: (status)" + xhr.status );
			console.warn( "Animator ERROR: " + thrownError );
		}
    });
};

ERS.Animator.prototype.parseXMLAnimations = function( a_XML ) {
	var classRef = this;
	var $animations = $( a_XML ).find( "anim" );
	$animations.each( function() {
		// construct an 'animation' object out of this "anim" XML object
		var animation = {
			//src: $(this).find( "src" ).text() == "" ? "" : MEDIA_SCREENS_PATH+"/"+classRef._screenName+"/"+$(this).find( "src" ).text(),
			src: $(this).find( "src" ).text() == "" ? "" : classRef._screenPath + $(this).find( "src" ).text(),
			element: $.trim($(this).find( "element" ).text()),
			popup: $.trim($(this).find( "popup" ).text()),
			startTime: $.trim($(this).find( "time" ).text()),
			endTime: $.trim($(this).find( "end" ).text()),
			hasPlayed: false
		};
		// push it into this Animator's list of animations
		classRef._animations.push( animation );
	});
	
	this._screenRef.animatorGetRequestComplete();
}

// ---- updates the current animation images ----
// - a_mediaDOMObject: the DOM element being used for playback (audio/video element in HTML)
ERS.Animator.prototype.timeUpdate = function( a_mediaDOMObject ) {

	// grab the media's current play time
	var currentTime = a_mediaDOMObject.currentTime;
	
	// loop through this screens "animation" images, make sure that all images are being properly displayed given the media's current play time
	for( var i = 0; i < this._animations.length; i++ )
	{
		var animId = "anim"+i;
		// if we are past the start time for this animation
		if( currentTime >= this._animations[i].startTime )
		{
			// if we are also past the end time for this animation
			if( this._animations[i].endTime != "" && currentTime > this._animations[i].endTime )
			{
				if( this._animations[i].src != "" )
				{
					$( "#" + animId ).remove();
				}
				else if( this._animations[i].element != "" )
				{
					$( "[data-animId='"+this._animations[i].element+"']" ).attr( "display", "none" );
				}
				else
				{
					ERS.moduleData.getBaseScreenObject().getPopupByName(this._animations[i].popup).unloadScreen();
				}
			}
			else if( !this._animations[i].hasPlayed )
			{	
				// otherwise, if the animation hasn't played and we're not past the end time, draw this animation element
				
				this._animations[i].hasPlayed = true;
				if( this._animations[i].src != "" )
				{
					// get the HTML for the animation image, and replace the necessary data
					var rawImageHTML = ANIMATION_IMAGE_HTML;
					var correctImageHTML = rawImageHTML.replace( "ID_REPLACE", animId );
					correctImageHTML = correctImageHTML.replace( "SRC_REPLACE", this._animations[i].src );
					// finally, append the image to the correct content area of the screen
					$("#" + this._containerDivId ).append( correctImageHTML );
				}
				else if( this._animations[i].element != "" )
				{
					$( "[data-animId='"+this._animations[i].element+"']" ).css( "display", "initial" );
				}
				else
				{
					ERS.moduleData.getBaseScreenObject().getPopupByName(this._animations[i].popup).loadScreen();
				}
			}
		}
		else if( currentTime <= this._animations[i].startTime )
		{
			// else if the correct amount of time hasn't yet passed, ensure the element doesn't exist
			this._animations[i].hasPlayed = false;
			if( this._animations[i].src != "" )
			{
				$( "#" + animId ).remove();
			}
			else if( this._animations[i].element != "" )
			{
				$( "[data-animId='"+this._animations[i].element+"']" ).css( "display", "none" );
			}
			else
			{
				ERS.moduleData.getBaseScreenObject().getPopupByName(this._animations[i].popup).unloadScreen();
			}
		}
	}
};

// ---- called when the MediaPlayer is reset ----
ERS.Animator.prototype.timeReset = function() {
	for( var i = 0; i < this._animations.length; i++ )
	{
		var animId = "anim"+i;
		$( "#" + animId ).remove();
		this._animations[i].hasPlayed = false;
	}
};