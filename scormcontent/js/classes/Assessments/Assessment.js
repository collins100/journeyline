/*
	--- Assessment class ---

	Controls the assessment for one Screen.  Parent class for all assessment classes.
*/

// use the ERS namespace for all code
var ERS = ERS || {};


ERS.Assessment = function( a_screenRef, a_options ) {
	
	this._screenRef = a_screenRef;
	this._options = a_options;
	
	this._answersData;
	this._attempts = 0;
	// default is 2 tries
	this._tries = this._options.find( "tries" ).length > 0 ? this._options.find( "tries" ).text() : 2;
	this._done = false;
};

// ---- called in this Screen's loadScreen function, used for any initializing for the assessment ----
ERS.Assessment.prototype.init = function() {
	// get this screen's answer.xml data
	this._answersData = ERS.moduleData.getAnswersData().find( this._screenRef.getScreenName() );
};

// ---- called when a button in this assessment is selected ----
// a_elementId: the id of the DOM element selected
// returns true if no further action in any child assessment classes is necessary
ERS.Assessment.prototype.selected = function( a_selectedElement ) {
	if( this._done )
		return true;
	
	if( $( a_selectedElement ).hasClass( "submit" ) )
	{
		this.submit();
		return true;
	}
	
	return false;
};

ERS.Assessment.prototype.submit = function() {
	var correct = this._checkAnswers();
	
	this._attempts++;
	if( this._attempts >= this._tries || correct )
	{
		this._displayAnswers();
		this._done = true;
	}
	
	ERS.assessmentResult.display( true, correct, this._done );
};

ERS.Assessment.prototype.reset = function() {
	this._attempts = 0;
	this._done = false;
};


// ---- Helper Functions ---- //
// -------------------------- //

ERS.Assessment.prototype._getAnswers = function() {
	
};

ERS.Assessment.prototype._checkAnswers = function() {
	
};

ERS.Assessment.prototype._displayAnswers = function() {
	
};