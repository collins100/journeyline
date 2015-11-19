/*
	--- DebugTools class ---
	
	All helper tools for creating modules are in here.
		- CSS Button Creator tool: creates top/left/width/height CSS for an invisible button element using mouse double-clicks
			- to use, double-click near the upper-left corner of desired the space, and then double-click near bottom-right corner
			- a prompt will appear containing CSS to build this hypothetical element, copy/paste

*/

// use the ERS namespace for all code
var ERS = ERS || {};


ERS.DebugTools = function() {
	this._startX = 0;
	this._startY = 0;
	this._selectionStarted = false;
};

ERS.DebugTools.prototype.init = function() {
	if( DEBUG_TOOLS_ENABLED )
		document.addEventListener( "dblclick", this._mouseDown, false );
};

ERS.DebugTools.prototype._mouseDown = function( element ) {

	var contentElement = ERS.DOM.content;
	
	// make the button creator work with the 'full-screen' screens
	if( ERS.moduleData.getCurrentScreenObject()._loadDOM == ERS.DOM.contentBG )
		contentElement = ERS.DOM.contentBG;

	//console.log( contentElement );
		
	if( !this._selectionStarted )
	{
		this._startX = element.pageX - $( "#" + contentElement.id ).offset().left;
		this._startY = element.pageY - $( "#" + contentElement.id ).offset().top;
		
		this._selectionStarted = true;
	}
	else
	{
		var endX = element.pageX - $( "#" + contentElement.id ).offset().left;
		var endY = element.pageY - $( "#" + contentElement.id ).offset().top;
		
		var left = Math.round(this._startX);
		var top = Math.round(this._startY);
		var width = Math.round(endX - left);
		var height = Math.round(endY - top);
		
		var finalCss = "<div id='ID_REPLACE' class='button ACTION_REPLACE' style='position:absolute; top:" + top + "px; left:" + left + "px; width:" + width + "px; height:" + height + "px;'></div>";
		
		var idName = window.prompt( "Add the button's id (element to effect onclick):", "pop1" );
		if( idName != null )
		{
			var className = window.prompt( "Add the button's class (action to take onclick):", "open" );
			
			finalCss = finalCss.replace( "ID_REPLACE", idName );
			finalCss = finalCss.replace( "ACTION_REPLACE", className );
			
			console.log( finalCss );
			window.prompt( "Button CSS! Copy to clipboard: Ctrl+C, Enter", finalCss );
		}
		
		this._selectionStarted = false;
	}
};