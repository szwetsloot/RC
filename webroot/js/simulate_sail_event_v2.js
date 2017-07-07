/*
 * Author B. Bronswijk
 * 
 * lat = north
 * lng = east
 * 
 * 
 * lat -> north ( UTM ) -> left (px)
 * 
 * degrees = Math.atan2(x,y) * ( 180/Math.PI)
 * 
 */


var utm = "+proj=utm +zone=31";
var wgs84 = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";
var refresh_time = 2000;


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

var boats = [{
		'element' : $('#boat-0'),
		'number': 0,
		'lat':    52.110038,
		'lng':		4.264921,
		'north':	0,
		'east':		0,
		'speed' :	0,
		'direction': 0
	},{
		'element' : $('#boat-1'),
		'number': 1,
		'lat':    52.112861,
		'lng':		4.272109,
		'north':	0,
		'east':		0,
		'speed' :	0,
		'direction': 0	
	}];

var dummyData = [
	{
		'number': 0,
		//'lat':    52.110038,
		//'lng':		4.264921,
		'direction':	40,
		'speed': 300
	},{
		'number': 1,
		//'lat':    52.112861,
		//'lng':		4.272109,
		'direction':	180,
		'speed': 100
	},{
		'number': 2,
		//'lat':    52.117838,
		//'lng':		4.264921,
		'direction':	90,
		'speed': 600
	},	{
		'number': 3,
	//	'lat':    52.112861,
		//'lng':		4.256690,
		'direction':	20,
		'speed': 300
	},
];


$(function() {

		// Initialize the page
		drawObjects();	
		
		for (i = 0; i < dummyData.length; i++) 
			convertToUTM(dummyData[i]);
		
		// Convert the bouy's location to UTM
		for (var i = 0; i < bouys.length; i++)
			convertToUTM(bouys[i]);
	
		// Calculate the longest distance between two bouys to determine the horizontal location
		calculateLongestDistanceBouys();
	
		// Calculate the range of the screen based on the positions of the bouys
		calculateScreenRange();

		// Move the bouys to their correct location
		positionBouys();
		
		// Move Boats to start
		positionBoats();

		// Rotate the compass
		rotateCompass();

		// Rotate the wind arrow
		rotateWindArrow();
	
		// Draw the height lines
		drawHeightLines();
				
		// run animation
		getDataBoats(0);

	});


// combine the simulated target and the actual measure target
function calculateTarget(){
	//var k = 0.95 // of 0.98
	//var position_measured // from database // converted to UTM
	//var measured_target = position_measured + ( refresh_time * boat_speed * V->  ) // 
	
	//var position_simulated // from object property	
	//var position_simulated_target = position_simulated + ( refresh_time * boatspeed * V-> ) //
	
	//var position_simulated_correction = ( position_simulated_target * k ) + ( measured_target * ( 1 - k ) );
}


// This function calculates the target position and returns this in an object
function calculateVector(position, speed, direction){
	
	var rot        	= screenUTMRange.rotation;	
	var target = position; // huidige positie
	var time = refresh_time / 1000;

	direction = toRadians(direction);
	//direction += rot; 
	
	// calculate target -> sos cas toa
	var vector_distance = time * speed; // afgelegde afstand in meters
	var vector_vertical = Math.sin(direction) * vector_distance; // verticale component in meters
	var vector_horizontal = Math.cos(direction) * vector_distance; // horizontale component
	
	// add vectors to current position
	target.north += vector_vertical;
	target.east += vector_horizontal;
	return target;
}


function getDataBoats(reeks){
	
	var data_obj = dummyData[reeks];
	var boat = boats[0];
	// get measured position
	//var position = positionBoat( dummyData[reeks] )	// object.lng + object.lat properties
	convertToUTM(boat);
	//var north = data_obj.north;
	//var east = data_obj.east;
	
	// get measured speed and direction
	var boat_speed = dummyData[reeks].speed;
	var direction = dummyData[reeks].direction;
	
	boat.speed = dummyData[reeks].speed;
	boat.direction = dummyData[reeks].direction;
		
	// get simulated position 
	//var north_pos = boats[0].north;
	//var east_pos = boats[0].east;
	//var direction = dummyData[reeks].direction;
	
	/// -------------------------------------------	
	// get current postition
	// get new target
	
	var target = calculateVector(boat, boat_speed, direction);
		
	MoveBoat(target.north, target.east, direction); // converts meters to pixels and moves the object

	
	// repeat function after 2 sec
	var reeks = reeks + 1;
	if(reeks === (dummyData.length ) ){ reeks = 0 };
	
	setTimeout(function(){ getDataBoats(reeks) }, refresh_time);
}

// converts meters to pixels and moves the object
function MoveBoat(north, east, direction) {
	
	var screenWidth  = $('html').width();
	var screenHeight = $('html').height();
	var $boat = $('#boat-0');
	
	rot         = screenUTMRange.rotation;
	rot = 0;
	cEast       = screenUTMRange.centerEast;
	cNorth      = screenUTMRange.centerNorth;
	rEast       = screenUTMRange.rangeEast;
	rNorth      = screenUTMRange.rangeNorth;
	
	teast        = (east - cEast) * Math.cos(rot) - (north - cNorth) * Math.sin(rot);
	tnorth       = (east - cEast) * Math.sin(rot) + (north - cNorth) * Math.cos(rot);
	
	deast = east - cEast;
	dnorth = north - cNorth;
		
	var left    = (teast  / rEast / 2 + 1/2) * screenWidth + ( $boat.width() / 2 );
	var top     = (tnorth / rNorth / 2 + 1/2) * screenHeight + ( $boat.height() / 2 );

	
	direction = direction + toDegrees(screenUTMRange.rotation);

	$boat.css('transform','rotate('+direction+'deg)'); 
	
	$boat.animate({
		  'left': left,
		  'top': top
		},refresh_time ,'linear');

	boats[0].north = north;
	boats[0].east = east;
	
		
	//$boat.css('-ms-transform',     'rotate('+direction+'deg)')
	//$boat.css('-webkit-transform', 'rotate('+direction+'deg)')

}

function drawObjects(){
	// draw bouy's
	$bouyContainer = $('#bouy-container');
	$bouyContainer.empty();
	
	for (i = 0; i < bouys.length; i++) {
		
		var bouy = document.createElement('div');
		
		$(bouy).attr('id', 'bouy-'+i)
			.addClass('bouy')
		    .html('<div class="tooltip animated fadeInUp">lat: '+bouys[i].lat+'</br>lng: '+bouys[i].lng+'</div>')
		    .appendTo($bouyContainer);		
	}
	
	// draw boats
	$boatContainer = $('#boat-container');
	$boatContainer.empty();
	
	for (i = 0; i < boats.length; i++) {
		
		var boat = document.createElement('div');
		
		$(boat).attr('id', 'boat-'+i)
			.addClass('boat')
		    .appendTo($boatContainer);		
	}
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
	screenUTMRange.bouy2 = bouy2;
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
function positionBouys() {
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

function correctPositionRotation(position){
	
	ObjX = position.east;
	ObjY = position.north;
	
	rot         = screenUTMRange.rotation;	

	// centrum (x,y) in meters	
	OriginX      = screenUTMRange.centerEast;
	OriginY      = screenUTMRange.centerNorth;
	
	// rotation matrix
	var Xcor     = ( ObjX - OriginX) * Math.cos(rot) - (ObjY - OriginY) * Math.sin(rot);
	var Ycor     = (ObjX - OriginX) * Math.sin(rot) + (ObjY - OriginY) * Math.cos(rot);
	
	
}

function convertUtmToPixels(X,Y){

	UTMscreenWidth       = screenUTMRange.rangeEast;
	UTMscreenHeight      = screenUTMRange.rangeNorth;
	
	var left    = ( X  / UTMscreenWidth  / 2 + 1/2) * screenWidth + ( element.width() / 2 );
	var top     = ( Y / UTMscreenHeight / 2 + 1/2) * screenHeight + ( element.height() / 2 );
}

// brings the boats to the start position at pageload
function positionBoats(){
	for (var i = 0; i < boats.length; i++) {
		var obj = boats[i];
		
		convertToUTM(obj);
		
		// Get the screen size in pixel
		var screenWidth  = $('html').width();
		var screenHeight = $('html').height();
		
		// Calculate the coordinates for each bouy
		var $element = $('#boat-'+i);
		rot         = screenUTMRange.rotation;
		cEast       = screenUTMRange.centerEast;
		cNorth      = screenUTMRange.centerNorth;
		rEast       = screenUTMRange.rangeEast;
		rNorth      = screenUTMRange.rangeNorth;
		east        = (obj.east - cEast) * Math.cos(rot) - (obj.north - cNorth) * Math.sin(rot); // radius * 
		north       = (obj.east - cEast) * Math.sin(rot) + (obj.north - cNorth) * Math.cos(rot);
		
		var left    = (east  / rEast / 2 + 1/2) * screenWidth + $element.width() / 2;
		var top     = (north / rNorth / 2 + 1/2) * screenHeight + $element.height() / 2;
		
		$element.css('left', left+'px');
		$element.css('top', top+'px');
	}
}

function positionBoat(obj){
	
	var position = {};
	
	// lat -> UTM 
	convertToUTM(obj);
	
	
	
	// UTM -> px
	// Get the screen size in pixel
	var screenWidth  = $('html').width();
	var screenHeight = $('html').height();
	
	// Calculate the coordinates for the boat
	var element = $('.boat');
	rot         = screenUTMRange.rotation;
	cEast       = screenUTMRange.centerEast;
	cNorth      = screenUTMRange.centerNorth;
	rEast       = screenUTMRange.rangeEast;
	rNorth      = screenUTMRange.rangeNorth;
	east        = (obj.east - cEast) * Math.cos(rot) - (obj.north - cNorth) * Math.sin(rot);
	north       = (obj.east - cEast) * Math.sin(rot) + (obj.north - cNorth) * Math.cos(rot);
		
	position.left    = (east  / rEast / 2 + 1/2) * screenWidth + element.width() / 2;
	position.top     = (north / rNorth / 2 + 1/2) * screenHeight + element.height() / 2;

	return position;
	
}


// This function will rotate the compass so it points north
function rotateCompass() {
	var direction = toDegrees(screenUTMRange.rotation);
	$('#compass').css('-ms-transform',     'rotate('+direction+'deg)')
	$('#compass').css('-webkit-transform', 'rotate('+direction+'deg)')
	$('#compass').css('transform',         'rotate('+direction+'deg)')
}

// This function will rotate the wind arrow to the correct direction
function rotateWindArrow() {
	var direction = windDirection + toDegrees(screenUTMRange.rotation);
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

function toRadians(angle) {
	  return angle * (Math.PI / 180);
}

function toDegrees(angle) {
	  return angle * ( 180 / Math.PI );
}

/* prototype function to convert lat-lng to utm */
function convertToUTM(obj) {
	[obj.north, obj.east] = proj4(wgs84, utm, [obj.lat, obj.lng]);
}