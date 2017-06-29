var utm = "+proj=utm +zone=31";
var wgs84 = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";

var bouys = [
	{
		'number': 0,
		'lat':    52.112861,
		'lng':		4.256690,
		'north':	0,
		'east':		0
	},
	{
		'number': 1,
		'lat':    52.110038,
		'lng':		4.264921,
		'north':	0,
		'east':		0
	},
	{
		'number': 2,
		'lat':    52.117838,
		'lng':		4.264921,
		'north':	0,
		'east':		0
	},
	{
		'number': 3,
		'lat':    52.112861,
		'lng':		4.272109,
		'north':	0,
		'east':		0
	}
];

var screenUTMRange = {
	'centerEast' : 1E9,
	'rangeEast' : 	 0,
	'centerNorth': 1E9,
	'rangeNorth':    0,
	'rotation':   	 0,
	'bouy1':				 0,
	'bouy2':				 0
};

var windDirection = 60;



$(function() {
		// Initialize the page
		resizeObjects();					// Resize the bouys to the correct size

		// Convert the bouy's location to UTM
		for (var i = 0; i < bouys.length; i++)
		convertToUTM(bouys[i]);
	
		// Calculate the longest distance between two bouys to determine the horizontal location
		calculateLongestDistanceBouys();
	
		// Calculate the range of the screen based on the positions of the bouys
		calculateScreenRange();

		// Move the bouys to their correct location
		moveBouys();

		// Rotate the compass
		rotateCompass();

		// Rotate the wind arrow
		rotateWindArrow();
	
		// Draw the height lines
		drawHeightLines();
		
		// TMP
		tmpMoveBoat();
	});
	
function tmpMoveBoat() {
	var screenWidth  = $('html').width();
	var screenHeight = $('html').height();
	$('.boat').css('top',  (screenHeight * 0.2 - $('.boat').height() / 2)+'px');
	$('.boat').css('left', (screenWidth  * 0.5 - $('.boat').width()  / 2)+'px');
}


// This function will resize all objects so they're the correct shape
function resizeObjects() {
	// Resize the bouy's
	var w = $('html').width();
	$('.bouy').css('width',  (w * 0.02)+'px');
	$('.bouy').css('height', (w * 0.02)+'px');
	
	// Resize the compass
	$('#compass').css('width',  (w * 0.09)+'px');
	$('#compass').css('height', (w * 0.09)+'px');
	$('#compass').css('right',  (w * 0.02)+'px');
	$('#compass').css('top',    (w * 0.02)+'px');
	
	// Resize the wind arrow
	$('#wind-arrow').css('width',  (w * 0.08)+'px');
	$('#wind-arrow').css('height', (w * 0.08)+'px');
	$('#wind-arrow').css('left',   (w * 0.03)+'px');
	$('#wind-arrow').css('top',    (w * 0.03)+'px');
	
	// Resize the boats
	$('.boat').css('width', (w * 0.05)+'px');
	$('.boat').css('height', (w * 0.05 * 0.3533)+'px');
}

// This function will calculate the longest distance between two bouys.
// This distance will be used as the horizontal line on the screen
function calculateLongestDistanceBouys() {
	var i,j;
	dist = 0;
	bouy1 = 0;
	bouy2 = 0;
	for (i = 0; i < bouys.length; i++) {
		for (j = 0; j < bouys.length; j++) {
			if (i == j) continue; // Don't compare the same bouys because the distance = 0
			dist_c = Math.sqrt(
				Math.pow(bouys[i].north - bouys[j].north, 2) + 
				Math.pow(bouys[i].east - bouys[j].east, 2)
			);
			if (dist_c > dist) { // This distance is the longest
				dist = dist_c;
				bouy1 = i;
				bouy2 = j;
			}
		}
	}
	
	// Swap the bouys so that the lowest horizontal position is on the lowest bouy
	if (bouys[bouy1].east > bouys[bouy2].east) {
		var tmp = bouy1;
		bouy1 = bouy2;
		bouy2 = tmp;
	}
	
	// Calculate the Angle that we need to rotate so that these two horizontal
	screenUTMRange.rotation = -Math.atan2(bouys[bouy1].north - bouys[bouy2].north, bouys[bouy1].east - bouys[bouy2].east);
	// Correct 180 degrees if necessary
	if (screenUTMRange.rotation < -Math.PI / 2) screenUTMRange.rotation += Math.PI;
	if (screenUTMRange.rotation > Math.PI / 2)  screenUTMRange.rotation -= Math.PI;
	screenUTMRange.bouy1 = bouy1;
	screenUTMRange.bouy2 = bouy2;;
}

// This function will calculate the min and max x and y of the screen
function calculateScreenRange() {
	var i;
	
	// Calculate the boundary and center of the screen
	screenEastMax  = 0;
	screenEastMin  = Infinity;
	screenNorthMax = 0;
	screenNorthMin = Infinity
	for (i = 0; i < bouys.length; i++) {
		if (bouys[i].east  > screenEastMax)  screenEastMax  = bouys[i].east;
		if (bouys[i].east  < screenEastMin)  screenEastMin  = bouys[i].east;
		if (bouys[i].north > screenNorthMax) screenNorthMax = bouys[i].north;
		if (bouys[i].north < screenNorthMin) screenNorthMin = bouys[i].north;
	}
	screenEast  = (screenEastMax  + screenEastMin)  / 2;
	screenNorth = (screenNorthMax + screenNorthMin) / 2;
	
	// Rotate all bouys around this position
	var rot = screenUTMRange.rotation; // This variable is just for shorter notation
	horMax = 0;
	verMax = 0;
	for (i = 0; i < bouys.length; i++) {
		bouyEast  = (bouys[i].east - screenEast) * Math.cos(rot) - (bouys[i].north - screenNorth) * Math.sin(rot);
		bouyNorth = (bouys[i].east - screenEast) * Math.sin(rot) + (bouys[i].north - screenNorth) * Math.cos(rot);
		if (Math.abs(bouyEast)  > horMax) horMax = Math.abs(bouyEast);
		if (Math.abs(bouyNorth) > verMax) verMax = Math.abs(bouyNorth);
	}
	
	var factor = 1.5;
	screenUTMRange.centerEast  = screenEast;
	screenUTMRange.centerNorth = screenNorth;
	
	var screenWidth  = $('html').width();
	var screenHeight = $('html').height();
	if (screenWidth > screenHeight) {
		var screenFactor = screenWidth / screenHeight;
		screenUTMRange.rangeEast   = Math.max(horMax / screenFactor, verMax) * screenFactor * factor;
		screenUTMRange.rangeNorth  = Math.max(horMax / screenFactor, verMax) * factor;
	} else {
		var screenFactor = screenHeight / screenWidth;
		screenUTMRange.rangeEast   = Math.max(horMax, verMax / screenFactor) * factor;
		screenUTMRange.rangeNorth  = Math.max(horMax, verMax / screenFactor) * screenFactor * factor;
	}
	
	// Recalculate the screen center between the furthest horizontal bouys
	var screenHorMin = Infinity;
	var screenHorMax = -Infinity;
	for (i = 0; i < bouys.length; i++) {
		bouyEast  = (bouys[i].east - screenEast) * Math.cos(rot) - (bouys[i].north - screenNorth) * Math.sin(rot);
		if (bouyEast < screenHorMin) screenHorMin = bouyEast;
		if (bouyEast > screenHorMax) screenHorMax = bouyEast;
	}
	screenUTMRange.centerEast += (screenHorMax + screenHorMin) / 2;
}

// This function will move the bouys to their correct location
function moveBouys() {
	// Get the screen size in pixel
	var screenWidth  = $('html').width();
	var screenHeight = $('html').height();
	
	// Calculate the coordinates for each bouy
	for (var i = 0; i < bouys.length; i++) {
		var element = $('.bouy#bouy-'+i);
		rot         = screenUTMRange.rotation;
		cEast       = screenUTMRange.centerEast;
		cNorth      = screenUTMRange.centerNorth;
		rEast       = screenUTMRange.rangeEast;
		rNorth      = screenUTMRange.rangeNorth;
		east        = (bouys[i].east - cEast) * Math.cos(rot) - (bouys[i].north - cNorth) * Math.sin(rot);
		north       = (bouys[i].east - cEast) * Math.sin(rot) + (bouys[i].north - cNorth) * Math.cos(rot);
		
		var left    = (east  / rEast / 2 + 1/2) * screenWidth + element.width() / 2;
		var top     = (north / rNorth / 2 + 1/2) * screenHeight + element.height() / 2;
		
		element.css('left', left+'px');
		element.css('top', top+'px');
	}
}

// This function will rotate the compass so it points north
function rotateCompass() {
	var direction = screenUTMRange.rotation * 180 / Math.PI;
	$('#compass').css('-ms-transform',     'rotate('+direction+'deg)')
	$('#compass').css('-webkit-transform', 'rotate('+direction+'deg)')
	$('#compass').css('transform',         'rotate('+direction+'deg)')
}

// This function will rotate the wind arrow to the correct direction
function rotateWindArrow() {
	var direction = windDirection + screenUTMRange.rotation * 180 / Math.PI;
	$('#wind-arrow').css('-ms-transform',     'rotate('+direction +'deg)')
	$('#wind-arrow').css('-webkit-transform', 'rotate('+direction +'deg)')
	$('#wind-arrow').css('transform',         'rotate('+direction +'deg)')
}

// This function will draw height lines on the screen {
function drawHeightLines() {
	// Clear the container
	$('#height-line-container').empty();
	
	var direction = -90+(windDirection + screenUTMRange.rotation * 180 / Math.PI);
	var screenWidth  = $('html').width();
	var screenHeight = $('html').height();
	
	var dir_c = (0 + direction) / 180 * Math.PI;
	
	var x = screenWidth / 2;
	var y = screenHeight / 2;
	
	var z = 0;
	var steps = 6;
	
	var offY  = screenHeight / steps;
	var offX  = 0;
	var offYc =  offY * Math.cos(dir_c);
	var offXc = -offY * Math.sin(dir_c);
	
	while (z < steps) {
		element = $('<div/>').addClass('height-line');
		element.css('top',  (y + (z * offYc))+'px');
		element.css('left', (x + (z * offXc))+'px');
		element.css('-ms-transform',     'rotate('+direction +'deg)')
		element.css('-webkit-transform', 'rotate('+direction +'deg)')
		element.css('transform',         'rotate('+direction +'deg)')
		$('#height-line-container').append(element);
		
		if (z > 0) {
			element = $('<div/>').addClass('height-line');
			element.css('top',  (y - (z * offYc))+'px');
			element.css('left', (x - (z * offXc))+'px');
			element.css('-ms-transform',     'rotate('+direction +'deg)')
			element.css('-webkit-transform', 'rotate('+direction +'deg)')
			element.css('transform',         'rotate('+direction +'deg)')
			$('#height-line-container').append(element);
		}
		
		z++;
	}
}

/* prototype function to convert lat-lng to utm */
function convertToUTM(obj) {
	[obj.north, obj.east] = proj4(wgs84, utm, [obj.lat, obj.lng]);
}