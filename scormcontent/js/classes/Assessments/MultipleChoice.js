/*
	--- MultipleChoice class ---
	
	Inherits from the Assessment class.
		- controls a multiple choice assessment for one screen
*/

// use the ERS namespace for all code
var ERS = ERS || {};


ERS.MultipleChoice = function( a_classRef, a_options ) {
	
	// construct the arguments for Assessment parent constructor
	ERS.Assessment.apply( this, arguments ); // initialize parent's constructor
	
	this._currentSelection = [];
	this._answers = [];
	// does this multiple choice allow multiple selections/answers?
	this._multiSelect = this._options.find( "subtype:contains('multiSelect')" ).length > 0 ? true : false;
};
// -- Make the MultipleChoice class a child of the Assessment class
ERS.MultipleChoice.prototype = Object.create( ERS.Assessment );

ERS.MultipleChoice.prototype.init = function() {
	// call base function
	ERS.Assessment.prototype.init.call( this );
	
	this._answers = [];
	this._currentSelection = [];
	
	for( var i = 0; i < this._answersData.children( "answer" ).length; i++ )
	{
		this._answers.push( this._answersData.children( "answer" )[i].textContent );
	}
};

ERS.MultipleChoice.prototype.selected = function( a_selectedElement ) {
	// call base function
	// if the base function takes care of the selected action, then just return
	if( ERS.Assessment.prototype.selected.call( this, a_selectedElement ) )
		return;
	
	if( !this._multiSelect )
	{
		this._currentSelection = a_selectedElement.id;
		
		// clear button contents of any other check marks
		var checkBoxButtons = this._screenRef.getButtonsByType( "checkBox" );
		for( var i = 0; i < checkBoxButtons.length; i++ )
			checkBoxButtons[i].clearButtonContents();
	}
	else
	{
		// if we can select multiple answers, check if we 'deselected' an item
		for( var i = 0; i < this._currentSelection.length; i++ )
		{
			if( a_selectedElement.id == this._currentSelection[i] )
			{
				this._screenRef.getButtonById( a_selectedElement.id ).clearButtonContents();
				$(a_selectedElement).empty();
				this._currentSelection.splice( i, 1 );
				return;
			}
		}
		
		this._currentSelection.push( a_selectedElement.id );
	}
	
	// append the new check mark to the selected button div
	$( a_selectedElement ).append( "<img src='" + MEDIA_IMAGES_PATH + "/blank_image.gif' />" );
};

ERS.MultipleChoice.prototype.submit = function() {
	// call base function
	ERS.Assessment.prototype.submit.call( this );
};

ERS.MultipleChoice.prototype.reset = function() {
	// call base function
	ERS.Assessment.prototype.reset.call( this );
};



// ---- Helper Functions ---- //
// -------------------------- //

ERS.MultipleChoice.prototype._checkAnswers = function() {
	
	// check that every selection has an answer
	for( var i = 0; i < this._currentSelection.length; i++ )
	{
		var isCorrect = false;
		for( var j = 0; j < this._answers.length; j++ )
		{
			if( this._currentSelection[i] == this._answers[j] )
				isCorrect = true;
		}
		
		if( !isCorrect )
			return false;
	}
	// ... and every answer has a selection
	for( var i = 0; i < this._answers.length; i++ )
	{
		var isCorrect = false;
		for( var j = 0; j < this._currentSelection.length; j++ )
		{
			if( this._currentSelection[j] == this._answers[i] )
				isCorrect = true;
		}
		
		if( !isCorrect )
			return false;
	}
	
	return true;
};

ERS.MultipleChoice.prototype._displayAnswers = function() {
	var checkBoxButtons = this._screenRef.getButtonsByType( "checkBox" );
	for( var i = 0; i < checkBoxButtons.length; i++ )
	{
		checkBoxButtons[i].clearButtonContents();
		for( var j = 0; j < this._answers.length; j++ )
		{
			if( checkBoxButtons[i].getId() == this._answers[j] )
				checkBoxButtons[i].addButtonContents(  "<img src='" + MEDIA_IMAGES_PATH + "/blank_image.gif' />"  );
		}
	}
};