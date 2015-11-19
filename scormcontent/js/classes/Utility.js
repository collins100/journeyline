/*
	--- Utility class ---

	NOTE: Declared as singleton/global object in main.js
	
	Holds static/utility based functions that aren't organizable or are necessary for use in multiple classes.
*/

// use the ERS namespace for all code
var ERS = ERS || {};


ERS.Utility = function() {

	// detecting various platforms
	this.isSafari = ($.browser.webkit && !$.browser.chrome) ? true : false;
	this.isiOS7 = (navigator.userAgent.match(/(iPad|iPhone|iPod touch);.*CPU.*OS 7_\d/i)) ? true : false;
	this.isIE9 = (/MSIE 9/i).test(navigator.userAgent);
	this.isiPad = navigator.userAgent.match(/iPad/i) != null;
	// double-check this web app is not in an iOS UIWebView (HTML5 embedded in an app)
	if( !this.isiPad )
	{
		var ua = navigator.userAgent;
		this.isiPad = /iPad/i.test(ua); //|| /iPhone OS 3_1_2/i.test(ua) || /iPhone OS 3_2_2/i.test(ua);
	}
};