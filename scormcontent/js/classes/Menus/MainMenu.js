/*
*/

// use the ERS namespace for all code
var ERS = ERS || {};


ERS.MainMenu = function() {
	ERS.Menu.apply( this, arguments ); // initialize parent's constructor
	
	this._menuRootName = "mainMenu";
};
// -- Make the MainMenu class a child of the Menu class
ERS.MainMenu.prototype = Object.create( ERS.Menu );


ERS.MainMenu.prototype.getXMLData = function() {
	// before grabbing XML data, make sure the menu knows the correct DOM elements
	this._menuDOMObject = ERS.DOM.mainMenu;
	this._menuButtonDOMObject = ERS.DOM.mainMenuButton;
	
	// call base function
	ERS.Menu.prototype.getXMLData.call( this );
};

ERS.MainMenu.prototype.parseXML = function( a_XML ) {
	// call base function
	ERS.Menu.prototype.parseXML.call( this, a_XML, "mainMenu" );
};

ERS.MainMenu.prototype.run = function( a_toggle ) {
	// call base function
	ERS.Menu.prototype.run.call( this, a_toggle );
};

ERS.MainMenu.prototype.close = function() {
	// call base function
	ERS.Menu.prototype.close.call( this );
};

ERS.MainMenu.prototype.updateMenu = function( a_screenNumber ) {
	// call base function
	ERS.Menu.prototype.updateMenu.call( this, a_screenNumber );
	
	// no menu to update, return
	if( this._menuDOMObject == null )
		return;
	
	// NOTE: this section is a tad messy, I believe it was fairly late when I wrote it. maybe clean up later.
	
	// update this menu's items
	var screensComplete = ERS.cookie.getScreensComplete( false );
	var totalScreens = ERS.moduleData.getTotalScreenCount();
	var lessonScreens = ERS.moduleData.getLessonList();
	var currentScreen = 0;
	/* FOR EPIDUO ONLY uncomment the following to go back to ordinary usage
	for( var i = 0; i < lessonScreens.length; i++ )
	{
		// go through each screen in this lesson, check if each is complete
		var lessonComplete = true;
		for( var j = currentScreen; j < lessonScreens[i]; j++ )
		{
			// if one screen is NOT complete, then this lesson is not complete
			if( screensComplete[currentScreen] == "false" )
			{
				lessonComplete = false;
			}
			currentScreen++;
		}
		
		// turn this menu item on/off based on the lessonComplete variable set above
		if( i >= MENU_FIRST_LESSON_NUMBER )
			this._menuItems[i-MENU_FIRST_LESSON_NUMBER+1].turnOn( lessonComplete );
	}
	
	// doing the last lesson separately...
	var lessonComplete = true;
	for( var i = lessonScreens[lessonScreens.length-1]; i < totalScreens; i++ )
	{
		if( screensComplete[i] == "false" )
		{
			lessonComplete = false;
			break;
		}
	}
	
	// determine if the last menu item should be on/off
	if( a_screenNumber == totalScreens-1 || lessonComplete )
		this._menuItems[this._menuItems.length-1].turnOn( true );
	
	END EPIDUO ONLY */
	
	// FOR EDPIDUO ONLY
	for( var i = 0; i < lessonScreens.length; i++ )
	{
		// in essence, if ANY screen in this lesson has been seen, highlight it
		if( screensComplete[lessonScreens[i]] == "true" || screensComplete[lessonScreens[i+1]-1] == "true" || ERS.moduleData.getCurrentScreenNumber() == lessonScreens[i] || ERS.moduleData.getCurrentScreenNumber() == lessonScreens[i+1]-1 )
		{
			this._menuItems[i+1].turnOn( true );
		}
	}
	
	// Finally, update the lesson display number (for EpiDuo)
	this.updateLessonDisplay();
};

ERS.MainMenu.prototype.updateLessonDisplay = function() {
	
	// no lesson display, return
	if( ERS.DOM.lessonNumberDisplay == null )
		return;
	
	var currentLesson = ERS.moduleData.getCurrentLesson();
	
	if( currentLesson < 1 )
		return;
	
	// get the source image for the lesson display
	var lessonNumberDOM = ERS.DOM.lessonNumberDisplay;
	var originalSrc = lessonNumberDOM.src;
	
	// replace the number on the image if necessary
	var currentLessonNumberDisplaying = originalSrc.indexOf( "lesson_number-" ) + 14;
	var newSrc = originalSrc.substr(0,currentLessonNumberDisplaying) + currentLesson.toString() + originalSrc.substr(currentLessonNumberDisplaying+1);
	if( currentLessonNumberDisplaying != currentLesson.toString() )
	{
		lessonNumberDOM.src = newSrc;
	}
};