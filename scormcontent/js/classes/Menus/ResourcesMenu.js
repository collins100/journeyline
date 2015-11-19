/*
*/

// use the ERS namespace for all code
var ERS = ERS || {};


ERS.ResourcesMenu = function() {
	ERS.Menu.apply( this, arguments ); // initialize parent's constructor
	
	this._menuRootName = "resourcesMenu";
};
// -- Make the ResourcesMenu class a child of the Menu class
ERS.ResourcesMenu.prototype = Object.create( ERS.Menu );

ERS.ResourcesMenu.prototype.getXMLData = function() {
	// before grabbing XML data, make sure the menu knows the correct DOM element
	this._menuDOMObject = ERS.DOM.resourcesMenu;
	this._menuButtonDOMObject = ERS.DOM.resourcesMenuButton;
	
	// call base function
	ERS.Menu.prototype.getXMLData.call( this );
};

ERS.ResourcesMenu.prototype.parseXML = function( a_XML ) {
	// call base function
	ERS.Menu.prototype.parseXML.call( this, a_XML, "resourcesMenu" );
};
ERS.ResourcesMenu.prototype.run = function( a_toggle ) {
	// call base function
	ERS.Menu.prototype.run.call( this, a_toggle );
};

ERS.ResourcesMenu.prototype.close = function() {
	// call base function
	ERS.Menu.prototype.close.call( this );
};

ERS.ResourcesMenu.prototype.updateMenu = function( a_screenNumber ) {
	// call base function
	ERS.Menu.prototype.updateMenu.call( this, a_screenNumber );
};