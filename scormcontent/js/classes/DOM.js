/*
	--- DOM class ---
	
	NOTE: Declared as singleton/global object in main.js
	
	Contains static references to DOM elements in the HTML/CSS
		- any name (id, class) changes in the HTML/CSS will also need to be changed here
		- having this class removes the need to use literal strings in JS code for DOM id/class names,
		  and therefore only this class will need to be maintained for any DOM changes
		- can be thought of as the "glue" between JavaScript (the Controller) and HTML/CSS (the View)
*/

// use the ERS namespace for all code
var ERS = ERS || {};


// ---- DOM constructor ----
ERS.DOM = function() {
	this.MENU_CLOSE = "menuClose";
	this.MENU_ITEM = "menuItem";
	this.RESOURCES_ITEM = "resourceItem";
};

// ---- creates static references to all necessary DOM elements ----
// - must be called after HTML has loaded
ERS.DOM.prototype.init = function() {
	// declare/define all elements the JS code will need to reference in the DOM
	
	// page elements
	this.content = document.getElementById( "content" );
	this.contentBG = document.getElementById( "contentBG" );
	this.contentBGGraphic = document.getElementById( "contentBGGraphic" );
	this.title = document.getElementById( "titleM" );
	this.screenNumberDisplay = document.getElementById( "screenNum" );
	this.screenTotalDisplay = document.getElementById( "totalNum" );
	this.bottomBar = document.getElementById( "bottomBar" );
	
	// media elements
	this.audio = document.getElementById( "audioID" );
	this.video = document.getElementById( "videoID" );
	this.scrubberBackground = document.getElementById( "audioBG" );
	this.scrubber = document.getElementById( "audioScrub" );
	// playback buttons
	this.playPauseButton = document.getElementById( "playPauseButton" );
	this.refreshButton = document.getElementById( "refreshButton" );
	
	// menus
	this.mainMenu = document.getElementById( "mainMenu" );
	this.mainMenuButton = document.getElementById( "mainMenuButton" );
	this.resourcesMenu = document.getElementById( "resourcesMenu" );
	this.resourcesMenuButton = document.getElementById( "resourcesMenuButton" );
	this.lessonNumberDisplay = document.getElementById( "lessonNumber" );
};