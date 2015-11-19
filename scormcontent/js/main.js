/*
	Where the JavaScript control of the module begins.
*/

// use the ERS namespace for all code
var ERS = ERS || {};


ERS.debugTools = new ERS.DebugTools();

// global ModuleData object
ERS.moduleData = new ERS.ModuleData();
// global Navigator object
ERS.navigator = new ERS.Navigator();
// global DOM object
ERS.DOM = new ERS.DOM();
// global Cookie object
ERS.cookie = new ERS.Cookie();
// global Utility object
ERS.utility = new ERS.Utility();

// main menu
ERS.mainMenu = new ERS.MainMenu();
// resources menu
ERS.resourcesMenu = new ERS.ResourcesMenu();
// glossary popup
ERS.glossary = new ERS.GlossaryScreen();
// return popup
ERS.returnPopup = new ERS.ReturnScreen();
// assessment result popup
ERS.assessmentResult = new ERS.ResultScreen();
// help popup
ERS.helpPopup = new ERS.HelpScreen();

// ---- The ERS module's 'main' function ----
$( document ).ready( function() {	
	
	// initialize the DOM (get references to HTML DOM elements now that the document is ready)
	ERS.DOM.init();
	
	// init our debug tools if necessary
	ERS.debugTools.init();
	
	// initialize our global screens
	ERS.glossary.init();
	ERS.returnPopup.init();
	ERS.assessmentResult.init();
	ERS.helpPopup.init();
	
	// register 5 new asynchronous requests
	ERS.registerNewGetRequests( 5 );
	// grab XML data from server (these are ASYNCHRONOUS AJAX calls)
	ERS.moduleData.getXMLData();
	ERS.mainMenu.getXMLData();
	ERS.resourcesMenu.getXMLData();
	ERS.glossary.getXMLData();
	
	// When all AJAX GET requests for the XML data have completed, ERS._getXMLDataComplete() will be called (to finish the module's 'main' function)
});

// ---- called when all previously registered AJAX get requests have completed ----
ERS._getXMLDataComplete = function() {
	
	// not keeping track of last visited screen, display the default first screen
	if( !MODULE_RETURN_SCREEN_ON )
	{
		ERS.moduleData.displayNewScreen();
		return;
	}
	
	// display the "return" popup, if necessary
	if( !ERS.cookie.checkForLastSession() )
	{
		// if no previous session data exists, load the default first screen
		ERS.moduleData.displayNewScreen();
	}
};


// this global variable keeps track of any AJAX get requests that are in progress in the 'main' function (due to async. AJAX calls)
ERS._getRequestsPending = 0;
// ---- saves that a new AJAX get request is in progress ----
ERS.registerNewGetRequests = function( a_number ) {
	this._getRequestsPending += a_number;
}
// ---- marks that a previously registered AJAX get request has completed ----
ERS.getRequestComplete = function() {
	this._getRequestsPending--;
	
	if( this._getRequestsPending == 0 )
	{
		this._getXMLDataComplete();
	}
}

// TEMP
function lightWeightPopup( a_popupId ) {
	var currentDisplay = $( "#" + a_popupId ).css( "display" );
	
	currentDisplay = currentDisplay == "none" ? "inherit" : "none";
	$( "#" + a_popupId ).css( "display", currentDisplay );
}