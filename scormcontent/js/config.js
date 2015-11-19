/*
	---- The module's JavaScript configuration file ----
	
	Holds any changeable constants/settings for the module's code.
*/

// ---- SETTINGS ---- //
// ------------------ //


// true for debug tools (button creator tool), false to turn them off
var DEBUG_TOOLS_ENABLED = false;
// controls red, transparent button color (true = visible buttons, false = invisible buttons)
var DEBUG_BUTTON_OPACITY = false;

// is this a journeyline style module?
var JOURNEYLINE_MODULE = false; // TODO this isn't used yet, and in the future, check for JourneylineScreen object instead

// true if the module is gated
var MODULE_GATED = false;
// display return screen, keep track of last visited screen
var MODULE_RETURN_SCREEN_ON = false;

// first lesson screen number (the screen number the first lesson begins on)
var FIRST_LESSON_SCREEN_NUMBER = 1;
// the menu's first lesson (the number after 'L' in the screen's name)
var MENU_FIRST_LESSON_NUMBER = 1;

// the first screen (or popup) to layer on top of an existing screen will add this amount to the z-index
var POPUP_MIN_Z_INDEX = 2;

// possible extension types for videos in the module
var VIDEO_EXTENSION_TYPES = [ "m4v", "mp4" ];

// cookie expiration time (in days)
var COOKIE_EXPIRATION_DAYS = 10;

// controls the level of opacity for 'dimmed' UI elements
var UI_DIMMED_OPACITY = .45;

// path to the screen files in the module
var MEDIA_SCREENS_PATH = "media/screens";
// path to the audio/video files in the module
var MEDIA_AUDIO_PATH = "media/audio";
// path to the xml files for the module
var MEDIA_XML_PATH = "media/xml";
// path to the shared image files in the module
var MEDIA_IMAGES_PATH = "media/global/images";
// path to the global popups for the module
var MEDIA_POPUPS_PATH = "media/global/popups";

// HTML/CSS for all animated images in the module (used in the Animator class)
var ANIMATION_IMAGE_HTML = '<img id="ID_REPLACE" src="SRC_REPLACE" width="100%" height="100%" style="position: absolute; top: 0px; left: 0px;">';
// HTML/CSS for main menu items
var MAIN_MENU_ITEM_HTML = '<div id="ID_REPLACE" class="CLASS_REPLACE" style="background-image:url(IMAGE_REPLACE)"></div>';
// HTML/CSS for content divs
var CONTENT_DIV_HTML = '<div id="ID_REPLACE" style="position:absolute; top:0px; left:0px; width:100%; height:100%; z-index:Z_REPLACE;"></div>';
// HTML/CSS for screen background images
var BACKGROUND_IMAGE_HTML = '<img src="SRC_REPLACE" width="100%" height="100%" style="position:absolute; top:0px; left:0px;">';
// HTML/CSS for the glossTerm divs
var GLOSS_TERM_HTML = '<div id="ID_REPLACE" style="position:relative; font-weight:bold;" onclick="ERS.glossary.termSelected(this,INDEX_REPLACE);"><p>LETTER_REPLACE</p></div>';
// HTML/CSS for the video play overlay image (for iPad)
var VIDEO_PLAY_OVERLAY = '<img src="media/global/images/video_play_overlay.png" style="position:absolute; z-index:1;" width="1024" height="650" />';