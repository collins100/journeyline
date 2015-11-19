/*
	--- MenuItem class ---
	
	Holds data/functionality for a single item on a given menu.
*/

// use the ERS namespace for all code
var ERS = ERS || {};

// ---- MenuItem constructor ----
ERS.MenuItem = function( a_menuItemCount, a_menuDOMObject, a_menuRootName, a_source, a_action ) {
	this._menuItemCount = a_menuItemCount;
	this._menuDOMObject = a_menuDOMObject;
	this._menuRootName = a_menuRootName;
	this._source = a_source;
	this._action = a_action;
	
	this._on = false; // is this menu item in an on/off state?
	
	this._thisDOMObject;
	
	// actually create this item's visual DOM object in the HTML
	this._createItemDOM();
};

// define an enum list for the possible actions given by menu.xml
ERS.MenuItem.actionType = {};
ERS.MenuItem.actionType.GLOSSARY = "glossary";
ERS.MenuItem.actionType.GOTO_LESSON = "gotoLesson";
ERS.MenuItem.actionType.GOTO_SCREEN = "gotoScreen";
ERS.MenuItem.actionType.CLOSE = "close";
ERS.MenuItem.actionType.OPEN_URL = "openURL";

// ---- switches this menu item's image to the _on or _off version
ERS.MenuItem.prototype.turnOn = function( a_on ) {
	$( this._thisDOMObject ).removeClass( "on" );
	$( this._thisDOMObject ).removeClass( "off" );
	
	this._on = a_on;
	
	if( this._on )
		$( this._thisDOMObject ).addClass( "on" );
	else
		$( this._thisDOMObject ).addClass( "off" );
		
	this._changeImageOn( this._on );
};


// ---- Helper Functions ---- //
// -------------------------- //

// ---- actually create the DOM object that sits in the given menu ----
ERS.MenuItem.prototype._createItemDOM = function() {
	// determine this item's class list
	var itemClass;
	if( this._action == ERS.MenuItem.actionType.CLOSE )
		itemClass = ERS.DOM.MENU_CLOSE;
	else if( this._menuRootName == "resourcesMenu" )
		itemClass = ERS.DOM.RESOURCES_ITEM;
	else
		itemClass = ERS.DOM.MENU_ITEM;
	
	if( this._on )
		itemClass += " on";
	else
		itemClass += " off";
	
	// create the element HTML
	var rawHTML = MAIN_MENU_ITEM_HTML;
	var finalHTML = rawHTML.replace( "IMAGE_REPLACE", MEDIA_IMAGES_PATH + "/" + this._source );
	finalHTML = finalHTML.replace( "CLASS_REPLACE", itemClass );
	finalHTML = finalHTML.replace( "ID_REPLACE", this._menuItemCount );
	// create the element
	$("#" + this._menuDOMObject.id ).append( finalHTML );
	
	this._thisDOMObject = $( "#" + this._menuDOMObject.id ).children( "#" + this._menuItemCount );
	
	// properly change the image based on the on/off member variable
	this._changeImageOn( this._on );
	
	// add it's onclick action
	var onclickText = this._parseAction();
	$( this._thisDOMObject ).attr( "onclick", onclickText.toString() );
};

// ---- returns the correct text to be placed in this item's onclick attribute based on its given action ----
ERS.MenuItem.prototype._parseAction = function() {
	// get the final parsedAction (without parameter, if exists) and final parsedParam (the action's parameter, if exists)
	var colonParamIndex = this._action.indexOf( ":" ); // == -1 if no parameter for this action
	var parsedAction = colonParamIndex != -1 ? this._action.substring( 0, colonParamIndex ) : $.trim(this._action);
	var parsedParam  = colonParamIndex != -1 ? $.trim(this._action.substring( colonParamIndex+1, this._action.length )) : "";
	var returnOnclickText = "";
	
	// determine the correct text to place in this MenuItem's onclick function
	switch( parsedAction )
	{
		case ERS.MenuItem.actionType.GLOSSARY:
			returnOnclickText = "ERS.glossary.loadScreen();";
			break;
		case ERS.MenuItem.actionType.GOTO_LESSON:
			returnOnclickText = "ERS.navigator.gotoScreen( ERS.moduleData.getLessonList()["+(parsedParam-1)+"] );";
			break;
		case ERS.MenuItem.actionType.GOTO_SCREEN:
			returnOnclickText = "ERS.navigator.gotoScreen( "+parsedParam+" );";
			break;
		case ERS.MenuItem.actionType.CLOSE:
			returnOnclickText = "ERS."+this._menuRootName+".close();";
			break;
		case ERS.MenuItem.actionType.OPEN_URL:
			returnOnclickText = "window.open('"+parsedParam+"');";
			break;
		default:
			console.log( "MenuItem ERROR: _parseAction() error, could not recognize this action: "+this._action+", given in menu.xml." );
	}
	
	return returnOnclickText;
};

// ---- changes this menu item's image to either the _on or _off version of its image
ERS.MenuItem.prototype._changeImageOn = function( a_on ) {
	
	if( a_on && this._source.indexOf( "_off" ) > -1 )
		this._source = this._source.replace( "_off", "_on" );
	else if( !a_on && this._source.indexOf( "_on" ) > -1 )
		this._source = this._source.replace( "_on", "_off" );
	
	$( this._thisDOMObject ).css( "background-image", "url(" + MEDIA_IMAGES_PATH + "/" + this._source + ")" );
};