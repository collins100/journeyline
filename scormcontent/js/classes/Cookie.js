/*
	--- Cookie class ---

	Controls data persistence for the module.
*/

// use the ERS namespace for all code
var ERS = ERS || {};


ERS.Cookie = function() {
	
	// NOTE: CID stands for "Cookie Id"
	// the string id's for the cookies
	this._CID_SCREEN_NUMBER = "cookie_screenNumber";
	this._CID_SCREENS_COMPLETE = "cookie_screensComplete"; // cookie determines if screen has been previously visited (audio completion not required)
	this._CID_SCREENS_AUDIO_COMPLETE = "cookie_screensAudioComplete"; // determines if screen has been previously completed (audio was heard by user)
};

ERS.Cookie.prototype.checkForLastSession = function() {
	
	var lastScreenNumber = this.getLastSessionScreen();
	// if there is no last session saved, return false
	if( lastScreenNumber == null )
		return false;
	
	// there is a saved last screen, display the return popup screen
	this._displayReturnPopup();
	return true;
};

ERS.Cookie.prototype.loadLastSessionData = function( a_load ) {
	
	// if the user wants to load the old session data...
	if( a_load )
	{
		// set the screen appropriately before displaying the first screen
		ERS.moduleData.setCurrentScreenNumber( this.getLastSessionScreen() );
	}
	else
	{
		// otherwise, reset our cookie data
		this.resetScreensComplete();
	}
	
	// display proper new screen
	ERS.moduleData.displayNewScreen();
};

ERS.Cookie.prototype.setScreenComplete = function( a_screenNumber, a_audioComplete ) {
	var cID = a_audioComplete ? this._CID_SCREENS_AUDIO_COMPLETE : this._CID_SCREENS_COMPLETE;
	
	var screenList = this.getScreensComplete( a_audioComplete );
	screenList[a_screenNumber] = true;
	this._setCookieArray( cID, screenList );
};

ERS.Cookie.prototype.getScreensComplete = function( a_audioComplete ) {
	var cID = a_audioComplete ? this._CID_SCREENS_AUDIO_COMPLETE : this._CID_SCREENS_COMPLETE;
		
	var screenList = this._getCookieArray( cID );
	
	if( screenList == null )
		screenList = this._createScreensCompleteCookie();
	
	return screenList;
};

ERS.Cookie.prototype.resetScreensComplete = function() {
	this._setCookieArray( this._CID_SCREENS_COMPLETE, this._createScreensCompleteCookie() );
	this._setCookieArray( this._CID_SCREENS_AUDIO_COMPLETE, this._createScreensCompleteCookie() );
};

ERS.Cookie.prototype.setLastSessionScreen = function( a_screenNumber ) {
	this._setCookie( this._CID_SCREEN_NUMBER, a_screenNumber );
};

ERS.Cookie.prototype.getLastSessionScreen = function() {
	return this._getCookieNumber( this._CID_SCREEN_NUMBER );
};



// ---- Helper Functions ---- //
// -------------------------- //

// ---- returns data from cookie by name, returns null if cookie doesn't exist (or is blank) ----
ERS.Cookie.prototype._getCookie = function( a_name ) {
	var i,x,y,ARRcookies = document.cookie.split(";");
	for( i = 0; i < ARRcookies.length; i++ )
	{
		x = ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
		y = ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
		x = x.replace(/^\s+|\s+$/g,"");
		if( x == a_name )
		{
			y = unescape(y);
			if( y != "" )
				return y;
			else
				break;
		}
	}
	
	return null;
};
// ---- return cookie data, as an integer ----
ERS.Cookie.prototype._getCookieNumber = function( a_name ) {
	var cookieData = this._getCookie( a_name );
	if( cookieData == null )
		return null;
	else
		return parseInt( this._getCookie( a_name ) );
};
// ---- returns cookie data, as an array ----
ERS.Cookie.prototype._getCookieArray = function( a_name ) {
	var cookieData = this._getCookie( a_name );
	
	if( cookieData != null )
		cookieData = cookieData.split( "," );
	
	return cookieData;
};
// ---- set a cookie's value ----
ERS.Cookie.prototype._setCookie = function( a_name, a_value ) {
	// NOTE: COOKIE_EXPIRATION_DAYS constant is held in config.js
	var exdate = new Date();
	exdate.setDate(exdate.getDate() + COOKIE_EXPIRATION_DAYS);
	var c_value = escape(a_value) + ((COOKIE_EXPIRATION_DAYS==null) ? "" : "; expires="+exdate.toUTCString());
	document.cookie = a_name + "=" + c_value;
};
// ---- receives array in a_value, saves it as a comma-separated string ----
ERS.Cookie.prototype._setCookieArray = function( a_name, a_value ) {
	var cookieData = a_value.join();
	this._setCookie( a_name, cookieData );
};

ERS.Cookie.prototype._displayReturnPopup = function() {
	ERS.returnPopup.loadScreen();
};
// ---- creates and returns an array of false values, one for each screen in the lesson ----
ERS.Cookie.prototype._createScreensCompleteCookie = function() {
	var list = [];
	for( var i = 0; i < ERS.moduleData.getTotalScreenCount(); i++ )
		list.push( false );
		
	return list;
};