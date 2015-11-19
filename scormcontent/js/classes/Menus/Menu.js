/*
	--- Menu class ---
	
	All menus in the module inherit from this class.
*/

// use the ERS namespace for all code
var ERS = ERS || {};


ERS.Menu = function() {
	this._xmlFilePath = MEDIA_XML_PATH + "/menu.xml";
	this._menuDOMObject;
	this._menuButtonDOMObject;
	// contains the root name of the menu (in XML, etc.)
	this._menuRootName;
	// list of MenuItem objects contained in this menu
	this._menuItems = [];
	// list of screen numbers this menu is excluded from
	this._excludedScreens = [];
	
	this._isOpen = false;
};

// ---- get the menu data (from XML file) ----
ERS.Menu.prototype.getXMLData = function() {
	
	// no menu
	if( this._menuDOMObject == null )
	{
		// unregister this GET request
		ERS.getRequestComplete();
		return;
	}
	
	// get the XML data for menu.xml from the server, when complete, hand it to parseXML
	$.ajax({
        type: "GET",
        url: this._xmlFilePath,
        dataType: "xml",
        async: true, // getting the XML will happen asynchronously
		context: this, // make sure the 'this' keyword in parseXML refers to the current object
        success: this.parseXML,
		error: function (xhr, ajaxOptions, thrownError) {
			console.warn( "Menu ERROR: (status)" + xhr.status );
			console.warn( "Menu ERROR: " + thrownError );
		}
    });
};

// ---- parse the menu's XML file ----
// - a_XML: XML data
// - a_rootName: the name of the menu's root node in the XML file
ERS.Menu.prototype.parseXML = function( a_XML ) {
	// get all menu items for this menu
	var $menuRoot = $( a_XML ).find( this._menuRootName );
	var $items = $menuRoot.find( "item" );
	var classRef = this;
	var menuItemCount = 0;
	$items.each( function() {
		var source = $.trim( $(this).find( "src" ).text() );
		var action = $.trim( $(this).find( "action" ).text() );
		classRef._menuItems.push( new ERS.MenuItem( menuItemCount, classRef._menuDOMObject, classRef._menuRootName, source, action ) );
		menuItemCount++;
	});
	
	var $excludedScreens = $menuRoot.find( "excludeScreen" );
	$excludedScreens.each( function() {
		classRef._excludedScreens.push( $.trim($(this).text()) );
	});
	
	// unregister this GET request
	ERS.getRequestComplete();
};

// --- run the menu (open) ----
// - a_toggle: true = calling run will toggle the menu open/close, false = only open
ERS.Menu.prototype.run = function( a_toggle ) {
	
	// if the menu is open and the run function is allowed to toggle, close the menu
	if( this._isOpen && a_toggle )
	{
		this.close();
	}
	else
	{
		// otherwise, just open the menu normally
		this._menuDOMObject.style.display = "inherit";
		this._isOpen = true;
	}
};

// ---- close the menu ----
ERS.Menu.prototype.close = function() {
	this._menuDOMObject.style.display = "none";
	this._isOpen = false;
};

// ---- when the ModuleData's displayNewScreen is called, make sure this Menu is up to date ----
ERS.Menu.prototype.updateMenu = function( a_screenNumber ) {
	
	// no menu to update
	if( this._menuDOMObject == null || this._menuButtonDOMObject == null )
		return;
	
	for( var i = 0; i < this._excludedScreens.length; i++ )
	{	
		// if this menu is excluded from this screen, make the button invisible and return
		if( this._excludedScreens[i] == a_screenNumber )
		{
			this._menuDOMObject.style.display = "none";
			this._menuButtonDOMObject.style.display = "none";
			return;
		}
	}
	
	// otherwise, make sure the menu is reset and displaying normally
	this._menuDOMObject.style.display = "none";
	this._menuButtonDOMObject.style.display = "inherit";
};