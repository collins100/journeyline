/*
	--- ModuleData class ---

	NOTE: Declared as singleton/global object in main.js
	
	Holds the data for the module, acts as the module's controller
		- grabs necessary data from XML files
		- creates/holds array of Screen objects, containing the XML data
		- controls this Screen array (allows dislaying of screens, etc.)
*/

// use the ERS namespace for all code
var ERS = ERS || {};


// ---- define the Module's constructor ----
ERS.ModuleData = function() {
	// the module's current screen number
	this._currentScreen = 0;
	// how many screens in this module?
	this._screenCount = 0;
	
	// the module's z-buffer (used to determine which screen should display on top, via CSS' z-index)
	this._zBuffer = [];
	
	this._screenData;
	// the list of Screen objects for the module
	this._screenList = [];
	// screens with animations
	this._screensWithAnimation = [];
	// lesson list
	this._lessonList = [];
	
	this._isiOS = this._checkForBrowserVersion();
	
	// answers.xml data
	this._answersData;
};

// ---- gets XML data needed for the module ----
// - if successful, parses XML data into _screenList array as Screen objects
ERS.ModuleData.prototype.getXMLData = function() {
	
	// get the XML data for screens.xml from the server, when complete, hand it to parseXMLScreens
	$.ajax({
        type: "GET",
        url: MEDIA_XML_PATH + "/" + "screens.xml",
        dataType: "xml",
        async: true, // getting the XML will happen asynchronously
		context: this, // make sure the 'this' keyword in parseXMLScreens refers to the current Module object
        success: this.parseXMLScreens,
		error: function (xhr, ajaxOptions, thrownError) {
			console.warn( "ModuleData ERROR: (status)" + xhr.status );
			console.warn( "ModuleData ERROR: " + thrownError );
		}
    });
	
	// get the XML data for answers.xml from the server, when complete, hand it to parseXMLAnswers
	$.ajax({
        type: "GET",
        url: MEDIA_XML_PATH + "/" + "answers.xml",
        dataType: "xml",
        async: true, // getting the XML will happen asynchronously
		context: this, // make sure the 'this' keyword in parseXMLAnswers refers to the current Module object
        success: this.parseXMLAnswers,
		error: function (xhr, ajaxOptions, thrownError) {
			console.warn( "ModuleData ERROR: (status)" + xhr.status );
			console.warn( "ModuleData ERROR: " + thrownError );
		}
    });
};

// ---- parses the data from the getXMLData function ----
// - saves the screen XML data, builds the list of screens using this data
ERS.ModuleData.prototype.parseXMLScreens = function( a_XML ) {
	
	this._screenData = $( a_XML ).find( "screen" );
	
	this._buildScreenList();
	
	// unregister this GET request
	ERS.getRequestComplete();
};

// ---- parses the data from the getXMLData function ----
// - saves the answers XML data for later use in the Assessments
ERS.ModuleData.prototype.parseXMLAnswers = function( a_XML ) {
	
	this._answersData = $( a_XML );
	
	// unregister this GET request
	ERS.getRequestComplete();
};

// ---- currentScreen getter ----
ERS.ModuleData.prototype.getCurrentScreenNumber = function() {
	return this._currentScreen;
};
// ---- currentScreen setter ----
// - returns false if failed to set, true if successful
ERS.ModuleData.prototype.setCurrentScreenNumber = function( a_screenNumber ) {
	var screenCount = ERS.moduleData._screenCount;
	// if given screen doesn't exist, return false
	if( a_screenNumber < 0 || a_screenNumber >= screenCount )
		return false;
	
	// set the current screen, return true
	this._currentScreen = a_screenNumber;
	return true;
};

// ---- call this when you want a completely new screen ----
ERS.ModuleData.prototype.displayNewScreen = function() {
	
	// unload all screens in the z buffer
	for( var i = 0; i < this._zBuffer.length; )
	{
		this._zBuffer[0].unloadScreen(); // this call pops the given screen off of the zBuffer
	}
	
	// clear the z-buffer to be sure
	this._zBuffer.length = 0;
	
	// make sure the menus are up to date on this screen change
	ERS.mainMenu.updateMenu( this._currentScreen );
	ERS.resourcesMenu.updateMenu( this._currentScreen );
	
	// save the current screen as the last screen visited
	ERS.cookie.setLastSessionScreen( this.getCurrentScreenNumber() );
	// save the current screen as 'complete' now that the user will be viewing it
	ERS.cookie.setScreenComplete( this.getCurrentScreenNumber() );
	
	// load the current screen
	this.getCurrentScreenObject().loadScreen();
	
	// change the screen count display (for EpiDuo)
	this._updateScreenCountDisplay();
};

// ---- current Screen object getter ----
ERS.ModuleData.prototype.getCurrentScreenObject = function() {
	if( this._zBuffer.length > 0 && !JOURNEYLINE_MODULE )
		return this._zBuffer[this._zBuffer.length-1];
	else
		return this._screenList[this._currentScreen];
};
ERS.ModuleData.prototype.getBaseScreenObject = function() {
	return this._screenList[this._currentScreen];
};

ERS.ModuleData.prototype.getLessonList = function() {
	return this._lessonList;
};

// ---- zBuffer methods ----

// ---- add a screen to the zBuffer ----
ERS.ModuleData.prototype.pushScreenToZBuffer = function( a_screen ) {
	this._zBuffer.push( a_screen );
};
// ---- remove a screen from the zBuffer ----
ERS.ModuleData.prototype.removeScreenFromZBuffer = function( a_screen ) {
	var indexToRemove = this._findScreenInZBuffer( a_screen );
	
	if( indexToRemove == false && indexToRemove != 0 )
	{
		console.warn( "ModuleData ERROR: removeScreenFromZBuffer, screen doesn't exist." );
		return;
	}

	// remove the Screen from the zBuffer
	this._zBuffer.splice( indexToRemove, 1 );
	// make sure all existing screens in the zBuffer are still at their correct depths
	for( var i = 0; i < this._zBuffer.length; i++ )
	{
		var z = i+1;
		if( i > 0 )
			z += POPUP_MIN_Z_INDEX;
		
		$( "#" + this._zBuffer[i].getDivContainerId() ).zIndex( z );
	}
};
ERS.ModuleData.prototype.getScreenZBufferHeight = function( a_screen ) {
	return this._findScreenInZBuffer( a_screen );
};
// ---- get the length of the zBuffer ----
// - used to determine which z-index a given screen should use
ERS.ModuleData.prototype.getZBufferLength = function() {
	return this._zBuffer.length;
};
ERS.ModuleData.prototype.activateNextScreenInBuffer = function() {
	if( this._zBuffer.length <= 0 )
		return;
	
	var classRef = this;
	

	this._zBuffer[this._zBuffer.length-1].getMediaPlayer().loadMedia();
	this._zBuffer[this._zBuffer.length-1].getMediaPlayer().getMediaDOM().addEventListener( "canplay", function() {
		
		classRef._zBuffer[classRef._zBuffer.length-1].getMediaPlayer().play();
		// only run this function once
		this.removeEventListener( "canplay", arguments.callee );
	});
};

ERS.ModuleData.prototype.pauseMediaOnExistingScreens = function() {
	
	for( var i = 0; i < this._zBuffer.length; i++ )
	{
		this._zBuffer[i].getMediaPlayer().pause();
	}
};

// ---- returns the data from the answers.xml file ----
ERS.ModuleData.prototype.getAnswersData = function() {
	return this._answersData;
};

ERS.ModuleData.prototype.getTotalScreenCount = function() {
	return this._screenCount;
};
ERS.ModuleData.prototype.getCurrentLesson = function() {
	var screenName = this.getBaseScreenObject().getScreenName();
	var index = screenName.indexOf( "L" ) + 1;
	return parseInt( screenName[index] );
};


// ---- Helper Functions ---- //
// -------------------------- //

// ---- determines if this screen name is a different lesson then the last screen ----
// - return lessonNumber if new lesson, false if same
ERS.ModuleData.prototype._newLesson = function( a_screenName, a_lastLessonNumber ) {
	var lessonIndex = a_screenName.indexOf( "L" ) + 1;
	var lessonNumber = a_screenName[lessonIndex];
	
	if( lessonNumber == a_lastLessonNumber )
		return false;
	else
		return lessonNumber;
};


// ---- returns the index of a given Screen object in the z-buffer ----
ERS.ModuleData.prototype._findScreenInZBuffer = function( a_screen ) {

	for( var i = 0; i < this._zBuffer.length; i++ )
	{
		if( a_screen.getScreenName() == this._zBuffer[i].getScreenName() )
		{
			return i;	
		}
	}
	
	return false;
};

// ---- called after all AJAX GET requests have completed, builds the Screen list ----
ERS.ModuleData.prototype._buildScreenList = function() {
	var $screens = this._screenData;
	var screenNumber = 0; // keep a count of the screens
	var lastLessonNumber = FIRST_LESSON_SCREEN_NUMBER; // used to determine when the lesson changes (and save the screen number)
	
	var classRef = this;
	classRef._lessonList.push( lastLessonNumber );
	// loop through the "screen" XML from the server
	// each iteration will parse another <screen></screen> element from the XML
	// and in turn, create another Screen object to save to the ModuleData's list of Screens
	$screens.each( function() {
		// grab the necessary screen data from the XML (or construct it from the data) for the next Screen object
		var screenName = $.trim( $(this).children( "name" ).text() );
		var screenTitle = $(this).children( "title" ).text();
		// get the media file name
		var mediaName = $.trim( $(this).children( "mediaName" ).text() );
		// determine whether this screen has an associated animation file
		var hasAnimation = $.trim( $(this).children( "animation" ).text() );
		hasAnimation = hasAnimation != "" ? true : false;
		// get this screen's assessment and options if it has one
		var hasAssessment = $.trim( $(this).children( "assessment" ).children( "type" ).text() );
		hasAssessment = hasAssessment != "" ? hasAssessment : null;
		var $assessmentOptions = null;
		if( hasAssessment != null )
			$assessmentOptions = $(this).children( "assessment" ).children( "options" );
		
		var $options = $(this).children( "options" );
		$options = $options.length > 0 ? $options : null;
		
		// check if this screen starts a new lesson, if so save at what screen it changes
		var thisLessonNumber = classRef._newLesson( screenName, lastLessonNumber )
		if( thisLessonNumber != false )
		{
			classRef._lessonList.push( screenNumber );
			lastLessonNumber = thisLessonNumber;
		}
		
		// grab any popup XML data associated with this screen
		var $popupXML = $(this).children( "popup" );
		
		// determine what type of screen this is
		var type = $.trim( $(this).children( "type" ).text() );
		
		// create a new Screen object using the data parsed above
		var screenParams = {
			screenName: screenName,
			mediaName: mediaName,
			hasAnimation: hasAnimation,
			popupXML: $popupXML,
			screenTitle: screenTitle,
			assessmentType: hasAssessment,
			assessmentOptions: $assessmentOptions,
			screenType: type, 
			options: $options
		};
		var screen;
		switch( type )
		{
			case "journeyline":
				screen = new ERS.JourneylineScreen( screenParams );
				break;
			case "splash":
				screen = new ERS.SplashScreen( screenParams );
				break;
			default:
				screen = new ERS.Screen( screenParams );
				break;
		}
		
		// push the new Screen into ModuleData's list of screens
		classRef._screenList.push( screen );
		
		// increment our screen counter
		screenNumber++;
	});
	
	// save the total number of screens
	this._screenCount = $screens.length;
};

// the "Screen X of XX" display (id=screenCount) for EpiDuo
ERS.ModuleData.prototype._updateScreenCountDisplay = function() {
	if( currentScreenDisplayDOM == null )
		return;
	
	// on the menu before the first lesson
	if( this.getCurrentLesson() < 1 )
		return;
	// grab the DOM elements
	var currentScreenDisplayDOM = ERS.DOM.screenNumberDisplay;
	var totalLessonDisplayDOM = ERS.DOM.screenTotalDisplay;
	// determine the length of the current lesson
	var lessonStartScreen = this._lessonList[this.getCurrentLesson()-1];
	var lessonEndScreen = this._lessonList[this.getCurrentLesson()];
	var lessonLength = lessonEndScreen - lessonStartScreen;
	
	var currentScreenInLesson = this._currentScreen+1-lessonStartScreen;
	
	currentScreenDisplayDOM.innerHTML = (currentScreenInLesson).toString();
	totalLessonDisplayDOM.innerHTML = lessonLength.toString();
};

ERS.ModuleData.prototype._checkForBrowserVersion = function() {
	var iOS = false,
    p = navigator.platform;
	if( p === 'iPad' || p === 'iPhone' || p === 'iPod' )
		iOS = true;
	
	return iOS;
};