/*
	--- DragAndDrop class ---
	
	Inherits from the Assessment class.
		- controls a drag and drop assessment for one screen
*/

// use the ERS namespace for all code
var ERS = ERS || {};


ERS.DragAndDrop = function( a_classRef, a_options ) {
	
	// construct the arguments for Assessment parent constructor
	ERS.Assessment.apply( this, arguments ); // initialize parent's constructor
	
	// contains information about all draggable objects on this screen
	this._draggableItems = [];
};
// -- Make the DragAndDrop class a child of the Assessment class
ERS.DragAndDrop.prototype = Object.create( ERS.Assessment );

ERS.DragAndDrop.prototype.init = function() {
	// call base function
	ERS.Assessment.prototype.init.call( this );
	
	// clear the draggable items
	this._draggableItems = [];
	
	var classRef = this;
	var index; // hold the index of the draggable item currently being dragged
	
	// special meter drag and drop options
	var isMeter = this._options.find( "meter" ).text();
	var gridSize = null;
	if( isMeter )
	{
		var size = parseInt(this._options.find( "meterGrid" ).text());
		gridSize = [size,size];
	}
	
	// call the jQuery function 'draggable' on all DOM elements with the class, draggable
	// this function will setup these elements as draggable elements in our assessment
	$( ".draggable" ).draggable({
		create: function(){
            // Add this draggable item to the array for later reference
            var draggableObject = {
				id: $(this).attr("id"),
				posX: $("#" + $(this).attr("id")).position().left,
				posY: $("#" + $(this).attr("id")).position().top,
				currentDropPos: "",
				lastDropPos: "",
				correctDropPos: classRef._getCorrectDropPositions( $(this) )
			};
			classRef._draggableItems.push( draggableObject );
        },
		revert: isMeter ? false : true,
		start: function() {
			index = classRef._getDraggableItemIndexById( $(this).attr("id") );
		},
		drag: function() {
			var snapOrig = true;
            var curDropPos = "";
            // Go through each dropPos on the page, see if we should 'snap' to any of them
            $(".dropPos").each(function () {
                var dropPosX = $(this).position().left;
                var dropPosY = $(this).position().top;
				var thisDraggableId = classRef._draggableItems[index].id;
                var xDistance = Math.abs(dropPosX - $("#" + thisDraggableId).position().left);
                var yDistance = Math.abs(dropPosY - $("#" + thisDraggableId).position().top);

                // These determine how close the draggable item must be to a dropPos before it will 'snap' to it
                var snapThreshold_X = $("#" + thisDraggableId).width() * .8;
                var snapThreshold_Y = $("#" + thisDraggableId).height() * .8;

                // If the draggable element is currently within 'snapping' range of a dropPos element
                if (xDistance < snapThreshold_X && yDistance < snapThreshold_Y) {
                    // This draggable isn't snapping to its original location
                    snapOrig = false;
                    // Set the new location for this element to snap to
                    newSnapPosX = dropPosX - classRef._draggableItems[index].posX;
                    newSnapPosY = dropPosY - classRef._draggableItems[index].posY;
                    // Set a temporary variable to contain the id of the 'dropPos' we snapped to
                    curDropPos = $(this).attr("id");
                }
            });
			
			
			// If the draggable object is close enough, snap it to the position
            if (!snapOrig && !$("#" + curDropPos + ".dropPos").hasClass("dropFull")) {
                // Sort of a hack, set's this elements 'original position' to the dropPos and then allows the element to naturally revert to it
                $(this).data("uiDraggable").originalPosition = {
                    top: newSnapPosY + classRef._draggableItems[index].posY,
                    left: newSnapPosX + classRef._draggableItems[index].posX
                };
            } else if (!snapOrig && classRef._draggableItems[index].currentDropPos == curDropPos) {
                // else if, we snapped back to our same dropPos
                $(this).data("uiDraggable").originalPosition = {
                    top: newSnapPosY + classRef._draggableItems[index].posY,
                    left: newSnapPosX + classRef._draggableItems[index].posX
                };
            } else {
                // else, snap back to the start position
                $(this).data("uiDraggable").originalPosition = {
                    top: 0 + classRef._draggableItems[index].posY,
                    left: 0 + classRef._draggableItems[index].posX
                };
            }
			// special case drag and drop (the meter)
			// changes image based on current drop pos during the drag event
			if( isMeter )
			{
				// only change the image if we have to
				if( curDropPos != classRef._draggableItems[index].lastDropPos )
				{
					// hide/show appropriate image based on the current position of the draggable element
					$("#meterImages").find( "img" ).each(function() {
						if( $(this).attr("id") != curDropPos )
						{
							$(this).hide();
						}
						else
						{
							$(this).show();
						}
					});
				}
			}
			
			// save the curDropPos as this draggable element's last drop pos
			classRef._draggableItems[index].lastDropPos = curDropPos;
		},
		stop: function () {
            // Find the drop position this draggable stopped at
            var droppedOnDropPos = false;
			var index = classRef._getDraggableItemIndexById( $(this).attr("id") );
			var thisDraggableID = classRef._draggableItems[index].id;
			//var lastDropPos = classRef._draggableItems[index].currentDropPos;
            $(".dropPos").each(function () {
                // If the draggable has the same left and top
                if (($("#" + thisDraggableID).position().left == $(this).position().left) && ($("#" + thisDraggableID).position().top == $(this).position().top)) {
                    // If this draggable had a previous dropPos, clear it first
                    if( classRef._draggableItems[index].currentDropPos != "" )
						$("#" + classRef._draggableItems[index].currentDropPos + ".dropPos").removeClass("dropFull");

                    // Set this draggable's current dropPos element
                    classRef._draggableItems[index].currentDropPos = $(this).attr("id");
                    // Set that this dropPos is full
                    $(this).addClass("dropFull");

                    droppedOnDropPos = true;
                }
            });

            // If the draggable snapped back to its original position, clear its old dropPos if it had one
            if (!droppedOnDropPos && classRef._draggableItems[index].currentDropPos != "") {
                // Back at starting point
                if( classRef._draggableItems[index].currentDropPos != "" )
					$("#" + classRef._draggableItems[index].currentDropPos + ".dropPos").removeClass( "dropFull" );
				
                classRef._draggableItems[index].currentDropPos = "";
            }
        },
		axis: isMeter ? "x" : null,
		containment: "parent",
		snap: ".dropPos",
		snapMode: "inner",
		snapTolerance: 90
		//grid: gridSize
	});
};

ERS.DragAndDrop.prototype.selected = function( a_selectedElement ) {
	// call base function
	// if the base function takes care of the selected action, then just return
	if( ERS.Assessment.prototype.selected.call( this, a_selectedElement ) )
		return;
};

ERS.DragAndDrop.prototype.submit = function() {
	// call base function
	ERS.Assessment.prototype.submit.call( this );
};

ERS.DragAndDrop.prototype.reset = function() {
	// call base function
	ERS.Assessment.prototype.reset.call( this );
};



// ---- Helper Functions ---- //
// -------------------------- //

ERS.DragAndDrop.prototype._getDraggableItemIndexById = function( a_id ) {
	for( var i = 0; i < this._draggableItems.length; i++ )
	{
		if( this._draggableItems[i].id == a_id )
			return i;
	}
};	

ERS.DragAndDrop.prototype._checkAnswers = function() {
	
	for( var i = 0; i < this._draggableItems.length; i++ )
	{
		var correct = false;
		// make sure we check all possible drop pos' (there could be more than one)
		for( var j = 0; j < this._draggableItems[i].correctDropPos.length; j++ )
		{
			// if this draggable item's current drop pos is correct, jump out and check the next draggable item
			if( this._draggableItems[i].currentDropPos == this._draggableItems[i].correctDropPos[j] )
			{
				correct = true;
				continue;
			}
		}
		
		if( !correct )
			return false;
	}
	
	// all draggable items were on their correct drop pos', return true
	return true;
};

ERS.DragAndDrop.prototype._displayAnswers = function() {
	
	// remove the ability to drag items
	$( ".draggable" ).draggable( "destroy" );
	
	// place the item's in their correct locations
	for( var i = 0; i < this._draggableItems.length; i++ )
	{
		var endX = $( "#" + this._draggableItems[i].correctDropPos[0] + ".dropPos" ).position().left;
		var endY = $( "#" + this._draggableItems[i].correctDropPos[0] + ".dropPos" ).position().top;
		
		$( "#" + this._draggableItems[i].id ).css( "left", endX + "px" );
		$( "#" + this._draggableItems[i].id ).css( "top", endY + "px" );
	}
};

// returns an array containing a list of id's pertaining to a given draggable item's (a_this) correct drop positions
ERS.DragAndDrop.prototype._getCorrectDropPositions = function( a_this ) {
	var finalArray = [];
	this._answersData.find( "drag:contains("+a_this.attr("id")+")" ).parent().children( "drop" ).each( function() {
		finalArray.push( $(this).text() );
	});
	return finalArray;
};