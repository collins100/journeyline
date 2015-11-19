/*
	--- Button class ----
	
	An instance of this class will control one button on one screen.
		- Each Screen object holds a list of Buttons
		- see docs/about.html for information on how to create the HTML for buttons
*/

// use the ERS namespace for all code
var ERS = ERS || {};


// ---- Button constructor ----
ERS.Button = function( a_buttonElement, a_zBufferHeight ) {
	
	this._buttonElement = a_buttonElement;
	// will contain a list of JSON objects, each corresponding to a piece of data from the data-button attribute
	this._buttonData = [];
	this._onclick = "";
	
	if( $(this._buttonElement).attr( "data-button" ) != null )
	{
		// turn the data-button attribute into a JSON object
		var data = JSON.parse("{"+$(this._buttonElement).attr( "data-button" )+"}" );
		// push each each property from the data as its own JSON object into the _buttonData variable
		for( var property in data )
		{
			var dataElement = JSON.parse("{\""+property+"\":\""+data[property]+"\"}");
			this._buttonData.push( dataElement );
		}
		
		// parse each action for this button, building its onclick attribute
		for( var i = 0; i < this._buttonData.length; i++ )
			this._parseButtonData( this._buttonData[i] );
		
		// set the button's final onclick attribute
		$(this._buttonElement).attr( "onclick", this._onclick );
	}
	else
	{
		// set this button's onclick attribute
		this._parseClassAction();
	}
	// set this button's z-index
	$(this._buttonElement).css( "z-index", a_zBufferHeight+1 );
	
	// TODO legacy code, remove when _V2 is complete
	// set this button's onclick attribute
	//this._parseClassAction();
	
	// debug_mode for buttons
	if( DEBUG_BUTTON_OPACITY )
	{
		$(this._buttonElement).css( "background-color", "red" );
		$(this._buttonElement).css( "opacity", ".5" );
	}
};

ERS.Button.prototype.isType = function( a_type ) {
	if( $(this._buttonElement).hasClass( a_type ) )
		return true;
	else
		return false;
};

ERS.Button.prototype.getId = function() {
	return $(this._buttonElement).attr( "id" );
}

ERS.Button.prototype.clearButtonContents = function() {
	$(this._buttonElement).empty();
};

ERS.Button.prototype.addButtonContents = function( a_contents ) {
	$(this._buttonElement).append( a_contents );
};

// ---- receives a JSON object, parses the action appropriately
ERS.Button.prototype._parseButtonData = function( a_data ) {
	if( a_data.open )
		this._onclick += " ERS.moduleData.getBaseScreenObject().getPopupByName('"+a_data.open+"').loadScreen();";
	else if( a_data.close )
		this._onclick += " ERS.moduleData.getBaseScreenObject().getPopupByName('"+a_data.close+"').unloadScreen();";
	else if( a_data.flip )
		this._onclick += " ERS.moduleData.getBaseScreenObject().getPopupByName('"+a_data.flip+"').flip();";
	else if( a_data.checkBox )
		this._onclick += " ERS.moduleData.getBaseScreenObject().getAssessment().selected(this);";
	else if( a_data.submit )
		this._onclick += " ERS.moduleData.getBaseScreenObject().getAssessment().selected(this);";
	else if( a_data.toggleAudio )
		this._onclick += " ERS.moduleData.getCurrentScreenObject().getMediaPlayer().togglePlayReset();";
};

// ---- takes the 'action' from the button element's class attribute, and appends the correct onclick attribute ----
ERS.Button.prototype._parseClassAction = function() {
	if( $(this._buttonElement).hasClass( "open" ) )
		$(this._buttonElement).attr( "onclick", "ERS.moduleData.getBaseScreenObject().getPopupByName(this.id).loadScreen();" );
	else if( $(this._buttonElement).hasClass( "close" ) )
		$(this._buttonElement).attr( "onclick", "ERS.moduleData.getBaseScreenObject().getPopupByName(this.id).unloadScreen();" );
	else if( this.isType( "closeAndOpen" ) )
		$(this._buttonElement).attr( "onclick", "ERS.moduleData.getBaseScreenObject().getPopupByName('"+$(this._buttonElement).attr( 'data-close' )+"').unloadScreen(); ERS.moduleData.getBaseScreenObject().getPopupByName('"+$(this._buttonElement).attr( 'data-open' )+"').loadScreen();" );
	else if( $(this._buttonElement).hasClass( "flip" ) )
		$(this._buttonElement).attr( "onclick", "ERS.moduleData.getBaseScreenObject().getPopupByName(this.id).flip();" );
	else if( $(this._buttonElement).hasClass( "checkBox" ) )
		$(this._buttonElement).attr( "onclick", "ERS.moduleData.getBaseScreenObject().getAssessment().selected( this );" );
	else if( this.isType( "submit" ) )
		$(this._buttonElement).attr( "onclick", "ERS.moduleData.getBaseScreenObject().getAssessment().selected( this );" );
	else if( this.isType( "toggleAudio" ) )
		$(this._buttonElement).attr( "onclick", "ERS.moduleData.getCurrentScreenObject().getMediaPlayer().togglePlayReset();" );
};