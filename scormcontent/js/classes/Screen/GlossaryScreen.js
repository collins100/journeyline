/*
	--- GlossaryScreen class ---
	
	NOTE: Declared as singleton/global object in main.js
	
	Inherits from the Screen class.
		- controls the module's Glossary screen popup
*/

// use the ERS namespace for all code
var ERS = ERS || {};

ERS.GlossaryScreen = function() {
	
};
// -- Make the GlossaryScreen class a child of the Screen class
ERS.GlossaryScreen.prototype = Object.create( ERS.Screen );

// ---- because the Screen constructor calls on the DOM, we need to call it after the DOM is ready ----
ERS.GlossaryScreen.prototype.init = function() {
	// construct the arguments for Screen parent constructor
	var args = {
		screenName: "glossary",
		mediaName: "",
		hasAnimation: false
	};
	ERS.Screen.call( this, args ); // initialize parent's constructor
	
	// holds the XML data for the glossary after getXMLData completes
	this._termData;
	// this is a 2D array of simple JSON objects (more like structs)
	// each object contains 4 members; "element": this term's DOM element, "title": this term's title, "def": the term's definition, "mediaName": name of media file
	// the first column in the array (_glossaryTerms[0][...]) will contain the "glossTerm" object data (or the alphabetical letter for the group of terms)
	// each row (after the first element in the row) will contain the "glossTermChild"'s object data (the actual terms)
	this._glossaryTerms = [];
	// holds the references to the dynamically created DOM elements after the screen finishes loading
	this._glossTermHolder;
	this._glossTermTitle;
	this._glossTermDef;
	
	this._loadDOM = ERS.DOM.contentBG;
	this._isDisplaying = false;
};

ERS.GlossaryScreen.prototype.getXMLData = function() {
	$.ajax({
        type: "GET",
        url: MEDIA_XML_PATH + "/glossary.xml",
        dataType: "xml",
        async: true, // getting the XML will happen asynchronously
		context: this, // make sure the 'this' keyword in parseXML refers to the current object
        success: this.parseXML,
		error: function (xhr, ajaxOptions, thrownError) {
			console.warn( "GlossaryScreen ERROR: (status)" + xhr.status );
			console.warn( "GlossaryScreen ERROR: " + thrownError );
		}
    });
};

ERS.GlossaryScreen.prototype.parseXML = function( a_XML ) {
	// just grab the termData XML from the XML file, it will be used later when the glossary is loaded
	this._termData = $( a_XML ).find( "term" );
	
	// unregister this GET request
	ERS.getRequestComplete();
};

ERS.GlossaryScreen.prototype.loadScreen = function() {
	
	if( this._isDisplaying )
		return;
	
	// change the path to this popup's HTML file
	this._htmlPath = MEDIA_POPUPS_PATH + "/" + this._screenName + "/" + this._screenName + ".html";
	// change the popup's background image
	this._backgroundImageURL = null;
	
	// call base function
	ERS.Screen.prototype.loadScreen.call( this );
};

ERS.GlossaryScreen.prototype.unloadScreen = function() {
	// call base function
	ERS.Screen.prototype.unloadScreen.call( this );
	
	this._isDisplaying = false;
};
ERS.GlossaryScreen.prototype.timeUpdate = function() {
	// call base function
	ERS.Screen.prototype.timeUpdate.call( this );
};
ERS.GlossaryScreen.prototype.animatorGetRequestComplete = function() {
	// call base function
	ERS.Screen.prototype.animatorGetRequestComplete.call( this );
};

// ---- placed in each term's onclick attribute in the DOM ----
ERS.GlossaryScreen.prototype.termSelected = function( a_DOMRef, a_termIndex, a_termChildIndex ) {
	
	// remove highlight from any old selected term, place a highlight on the new term
	$( "#" + this._glossTermHolder.id ).find( "p" ).removeClass( "on" );
	$( this._glossaryTerms[a_termIndex][a_termChildIndex].element ).children( "p" ).addClass( "on" );
	
	// determine what to do with this selected term based on it's DOM id
	switch( a_DOMRef.id )
	{
		// expandable letter selected
		case "glossTerm":
			// insert the necessary glossary terms into the DOM (in the proper order)
			for( var i = this._glossaryTerms[a_termIndex].length-1; i > 0; i-- )
			{
				$( this._glossaryTerms[a_termIndex][i].element ).insertAfter( this._glossaryTerms[a_termIndex][a_termChildIndex].element );
				
				// change the height of this new term if it takes up 2 lines
				var oneLineHeight = $( this._glossaryTerms[a_termIndex][a_termChildIndex].element ).height();
				var actualElementHeight = $( this._glossaryTerms[a_termIndex][i].element ).children( "p" ).height();
				if( actualElementHeight > oneLineHeight )
				{
					var cssHeight = $( this._glossaryTerms[a_termIndex][i].element ).height();
					$( this._glossaryTerms[a_termIndex][i].element ).css( "height", cssHeight*2 );
				}
			}
			break;
		// actual glossary term selected, throw its data into view and load its audio
		case "glossTermChild":
			this._glossTermTitle.innerHTML = this._glossaryTerms[a_termIndex][a_termChildIndex].title;
			this._glossTermDef.innerHTML = this._glossaryTerms[a_termIndex][a_termChildIndex].def;
			this.getMediaPlayer().loadMedia( MEDIA_AUDIO_PATH + "/" + this._glossaryTerms[a_termIndex][a_termChildIndex].mediaName, document.getElementById( "glossAudioID" ) );
			break;
	}
};

// ---- data getters ----
ERS.GlossaryScreen.prototype.getScreenName = function() {
	// call base function
	return ERS.Screen.prototype.getScreenName.call( this );
};
ERS.GlossaryScreen.prototype.getDivContainerId = function() {
	// call base function
	return ERS.Screen.prototype.getDivContainerId.call( this );
};
ERS.GlossaryScreen.prototype.getMediaPlayer = function() {
	// call base function
	return ERS.Screen.prototype.getMediaPlayer.call( this );
};
ERS.GlossaryScreen.prototype.getOptionByName = function( a_optionName ) {
	// call base function
	return ERS.Screen.prototype.getOptionByName.call( this, a_optionName );
};



// ---- Helper Functions ---- //
// -------------------------- //

ERS.GlossaryScreen.prototype._loadScreenComplete = function( a_DOMRef ) {
	// call base function
	ERS.Screen.prototype._loadScreenComplete.call( this, a_DOMRef );
	
	// now that the glossary is done loading, grab some of the dynamically created elements
	this._glossTermHolder = document.getElementById( "glossTermHolder" );
	this._glossTermTitle = document.getElementById( "TermTitle" );
	this._glossTermDef = document.getElementById( "TermTitleDef" );
	
	// when the glossary is done loading, build the glossary
	this._buildGlossary();
	
	this._isDisplaying = true;
};

ERS.GlossaryScreen.prototype._determineAudioOrVideo = function() {
	// call base function
	ERS.Screen.prototype._determineAudioOrVideo.call( this );
};


// ---- takes the XML data held in this object and builds the initial glossary (and _glossaryTerms array) ----
ERS.GlossaryScreen.prototype._buildGlossary = function() {
	this._glossaryTerms = [];
	
	var lastStartingLetter = null;
	var termAddedCount = 0;
	var classRef = this;
	// this loop builds the starting "glossTerm" list (highest level of accordion-style alphabetical list)
	this._termData.each( function() {
		
		var startingLetter = $.trim( $(this).children( "title" ).text() )[0];
		// if we have a new starting letter, append a new "glossTerm" div element to the glossaryTermHolder
		if( lastStartingLetter == null || startingLetter != lastStartingLetter )
		{
			// create the new jQuery HTML element for this term
			var termHTML = GLOSS_TERM_HTML;
			termHTML = termHTML.replace( "ID_REPLACE", "glossTerm" );
			termHTML = termHTML.replace( "LETTER_REPLACE", startingLetter.toUpperCase() );
			termHTML = termHTML.replace( "INDEX_REPLACE", termAddedCount + ",0" );
			var el = $( termHTML );
			// push it into our 2D array
			classRef._glossaryTerms.push( new Array() );
			var glossObject = {
				"element": el,
				"title": $(this).children( "title" ).text(),
				"def": $(this).children( "def" ).text(),
				"mediaName": $(this).children( "mediaName" ).text()
			};
			
			classRef._glossaryTerms[termAddedCount].push( glossObject );
			
			// actually append the "glossTerm" element to the glossary
			$( "#" + classRef._glossTermHolder.id ).append( el );
			
			lastStartingLetter = startingLetter;
			termAddedCount++;
		}
		
		// create the new jQuery HTML element for this CHILD term
		var termHTML = GLOSS_TERM_HTML;
		termHTML = termHTML.replace( "ID_REPLACE", "glossTermChild" );
		termHTML = termHTML.replace( "LETTER_REPLACE", $(this).children( "title" ).text() );
		termHTML = termHTML.replace( "INDEX_REPLACE", termAddedCount-1 + "," + (classRef._glossaryTerms[termAddedCount-1].length) );
		var el = $( termHTML );
	
		var glossObject = {
			"element": el,
			"title": $(this).children( "title" ).text(),
			"def": $(this).children( "def" ).text(),
			"mediaName": $(this).children( "mediaName" ).text()
		};
		classRef._glossaryTerms[termAddedCount-1].push( glossObject );
	});
};

ERS.GlossaryScreen.prototype._buildButtons = function() {
	// call base function
	ERS.Screen.prototype._buildButtons.call( this );
};