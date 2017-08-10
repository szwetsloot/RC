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


// Reference the global variables
var bouys;
var crews;
var wind_direction;
var wave_direction;
var north_direction = 0;
var listenerUrl;
var startTime;

/* Timing variables */
var jsTime = millis(0);

/* Debug */
var debug = 1;

/* Simulation variables */
var simulation = 1; // TODO - Set this to 0 when done building
var simulation_speed = 1;

/* Others */
var utm = "+proj=utm +zone=31";
var wgs84 = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";
var refresh_time = 6000;

var boats = [];
var run = 1; // global variable for running the animation 1 = run & 0 = stop
var race_veld = 'Zeilregatta Scheveningen'; // TODO get from backend 
var show_livestream = true; // het filmpje opd e achterrond
var show_finish = false; // panel dat na 120 seconden wordt weergegeven
var show_startline = true; // teken de start line tussen boei nummer 3 en 4
var show_all_trails = false; // Als dit false staat wordt alleen het spoor van boot 1 weergegeven

var screenUTMRange = {
    'centerEast': 1E9,
    'rangeEast': 0,
    'centerNorth': 1E9,
    'rangeNorth': 0,
    'rotation': 0,
    'bouy1': 0,
    'bouy2': 0
};

$(function () {
    console.log('-------');
    // Create the bouys
    createBouys();

    // Calculate the longest distance between two bouys to determine the horizontal location
    calculateLongestDistanceBouys();
    // Calculate the range of the screen based on the positions of the bouys
    calculateScreenRange();
    
    // Draw the elements
    drawHeightLines();
    drawWaves();
    setArrows();
    moveBouys();
    createBoats();
    drawStartline();
    Progress.moveBoats();

    // Start listenening
    //listen();
    
    // fades in the right panels
    Dashboard.startSimulation();
		
    // DOM EVENTS
    $('#finish-panel .crew').on('click',Dashboard.showCrewResults);

    $('#bouy-container').on('click','.bouy',Dashboard.toggleBouyData);
    
    $('#boat-container .boat').on('click',function(){
    	var boat_id = $(this).closest('.boat').attr('id').replace('boat-','');
    	Dashboard.showBoats.push(boat_id);			
		// if not animating initiate new rotation of athletes 
		if( Dashboard.animatingAthletes == false ) Dashboard.showCrewInfo(boat_id);		
    });
    
    
    // Recalculate variables on screen resize
    $(window).on('resize', function () {
        // Calculate the longest distance between two bouys to determine the horizontal location
        calculateLongestDistanceBouys();
        // Calculate the range of the screen based on the positions of the bouys
        calculateScreenRange();
        // Draw the elements
        moveBouys();
        
        $('canvas').attr('width', $('html').width());
    	$('canvas').attr('height', $('html').height());
    	drawClearedStartline();
    });
});

function drawStartline(){
	if(show_startline == false) return false;
	
	// TODO select bouys by startline type
        var j = 0, i = 0;
        var $bouy_1, $bouy_2;
        for (i = 0; i < bouys.length; i++) {
            if (bouys[i].type == 1) {
                if (!j) $bouy_1 = bouys[i];
                if (j)  $bouy_2 = bouys[i];
                j++
            }
        }

	var $canvas = document.getElementById("canvas-start");
	var ctx = $canvas.getContext("2d");
	
	$('canvas').attr('width', $('html').width());
	$('canvas').attr('height', $('html').height());
	
	ctx.beginPath();
	ctx.moveTo($bouy_1.left, $bouy_1.top);
	ctx.lineTo($bouy_2.left,$bouy_2.top);

	ctx.strokeStyle = 'rgba(220,30,30,0.6)';
	ctx.lineWidth = 3;
	
	ctx.stroke();
}

// Helaas kun je de oude lijn niet van kleur veranderen daarom moet je de canvas wissen en opnieuw tekenen
function drawClearedStartline(){
	if(show_startline == false) return false;
	
	// TODO select bouys by startline type
    var j = 0, i = 0;
    var $bouy_1, $bouy_2;
    for (i = 0; i < bouys.length; i++) {
        if (bouys[i].type == 1) {
            if (!j) $bouy_1 = bouys[i];
            if (j)  $bouy_2 = bouys[i];
            j++
        }
    }
		
	var $canvas = document.getElementById("canvas-start");
	var ctx = $canvas.getContext("2d");
	ctx.clearRect(0, 0, $canvas.width, $canvas.height);
	
	ctx.beginPath();
	ctx.moveTo($bouy_1.left, $bouy_1.top);
	ctx.lineTo($bouy_2.left,$bouy_2.top);
	ctx.lineWidth = 3;
	ctx.strokeStyle = 'rgba(225,225,225,0.6)';
	ctx.setLineDash([5,5]);
	ctx.stroke();
}

function createBouys() {
    for (var i = 0; i < bouys.length; i++) {
        var bouy = bouys[i];
        bouys[i] = new Bouy;
        bouys[i].id = bouy.id;
        bouys[i].north = bouy.north;
        bouys[i].east = bouy.east;
        bouys[i].number = bouy.id;
        bouys[i].name = bouy.name;
        bouys[i].type = bouy.type;
        bouys[i].prev = bouy.prev;
        bouys[i].order = bouy.order;
        bouys[i].element = $('#bouy-' + bouy.id);
    }
}

function moveBouys() {
    for (var i = 0; i < bouys.length; i++) {
        bouys[i].move();
    }
}

/* DRAW ELEMENTS */
//This function will calculate the longest distance between two bouys.
//This distance will be used as the horizontal line on the screen
function calculateLongestDistanceBouys() {
    var i, j;
    dist = 0;
    var bouy1, bouy2;
    for (i = 0; i < bouys.length; i++) {
        for (j = 0; j < bouys.length; j++) {
            if (i === j)
                continue; // Don't compare the same bouys because the distance = 0
            var bouyA = deepcopy(bouys[i]);
            var bouyB = deepcopy(bouys[j]);
            if (bouyA.order == bouyB.order)
                continue; // These are a pair
            if (bouyA.type == 1 || bouyA.type == 3) {
                // Find the other part of the pair
                var k;
                for (k = 0; k < bouys.length; k++) {
                    if (i == k) continue;
                    if (bouys[k].order == bouyA.order)
                        break;
                }
                // Get the centre of the pair
                bouyA.north = (bouyA.north + bouys[k].north) / 2;
                bouyA.east = (bouyA.east + bouys[k].east) / 2;
            }
            if (bouyB.type == 1 || bouyB.type == 3) {
                // Find the other part of the pair
                var k;
                for (k = 0; k < bouys.length; k++) {
                    if (j == k)
                        continue;
                    if (bouys[k].order == bouyB.order)
                        break;
                }
                
                // Get the centre of the pair
                bouyB.north = (bouyB.north + bouys[k].north) / 2;
                bouyB.east = (bouyB.east + bouys[k].east) / 2;
            }
            dist_c = norm2Dist(bouyA, bouyB);

            if (dist_c > dist) { // This distance is the longest
                dist = dist_c;
                bouy1 = bouyA;
                bouy2 = bouyB;
            }
        }
    }

    // Swap the bouys so that the lowest horizontal position is on the lowest bouy
    if (bouy1.east > bouy2.east) {
        var tmp = bouy1;
        bouy1 = bouy2;
        bouy2 = tmp;
    }
    
    if (debug) {
        console.log("----")
        console.log("Bouys");
        console.log("Distance = "+dist);
        console.log("Bouy 1 = "+bouy1.name);
        console.log(bouy1);
        console.log("Bouy 2 = "+bouy2.name);
        console.log(bouy2);
    }

    // Calculate the Angle that we need to rotate so that these two horizontal
    screenUTMRange.rotation = -Math.atan2(bouy1.north - bouy2.north, bouy1.east - bouy2.east);
    //screenUTMRange.rotation = 0;
    if (debug) {
        console.log("Screen rotation = "+screenUTMRange.rotation / Math.PI * 180);
    }
    // console.log(screenUTMRange.rotation);
    // Correct 180 degrees if necessary
    if (screenUTMRange.rotation < -Math.PI / 2)
        screenUTMRange.rotation += Math.PI;
    if (screenUTMRange.rotation > Math.PI / 2)
        screenUTMRange.rotation -= Math.PI;
    
    if (debug) {
        console.log("Corrected screen rotation = "+screenUTMRange.rotation / Math.PI * 180);
    }
    screenUTMRange.bouy1 = bouy1;
    screenUTMRange.bouy2 = bouy2;
}

//This function will calculate the min and max x and y of the screen
function calculateScreenRange() {
    var i;

    // Calculate the boundary and center of the screen
    screenEastMax = 0;
    screenEastMin = Infinity;
    screenNorthMax = 0;
    screenNorthMin = Infinity
    for (i = 0; i < bouys.length; i++) {
        if (bouys[i].east > screenEastMax)
            screenEastMax = bouys[i].east;
        if (bouys[i].east < screenEastMin)
            screenEastMin = bouys[i].east;
        if (bouys[i].north > screenNorthMax)
            screenNorthMax = bouys[i].north;
        if (bouys[i].north < screenNorthMin)
            screenNorthMin = bouys[i].north;
    }
    screenEast = (screenEastMax + screenEastMin) / 2;
    screenNorth = (screenNorthMax + screenNorthMin) / 2;

    // Rotate all bouys around this position
    var rot = screenUTMRange.rotation; // This variable is just for shorter notation
    horMax = 0;
    verMax = 0;
    for (var i = 0; i < bouys.length; i++) {
        bouyEast = (bouys[i].east - screenEast) * Math.cos(rot) - (bouys[i].north - screenNorth) * Math.sin(rot);
        bouyNorth = (bouys[i].east - screenEast) * Math.sin(rot) + (bouys[i].north - screenNorth) * Math.cos(rot);
        if (Math.abs(bouyEast) > horMax)
            horMax = Math.abs(bouyEast);
        if (Math.abs(bouyNorth) > verMax)
            verMax = Math.abs(bouyNorth);
    }

    var factor = 1.6;
    screenUTMRange.centerEast = screenEast;
    screenUTMRange.centerNorth = screenNorth;

    var screenWidth = $('html').width();
    var screenHeight = $('html').height();
    if (screenWidth > screenHeight) {
        var screenFactor = screenWidth / screenHeight;
        screenUTMRange.rangeEast = Math.max(horMax / screenFactor, verMax) * screenFactor * factor;
        screenUTMRange.rangeNorth = Math.max(horMax / screenFactor, verMax) * factor;
    } else {
        var screenFactor = screenHeight / screenWidth;
        screenUTMRange.rangeEast = Math.max(horMax, verMax / screenFactor) * factor;
        screenUTMRange.rangeNorth = Math.max(horMax, verMax / screenFactor) * screenFactor * factor;
    }

    // Recalculate the screen center between the furthest horizontal bouys
    var screenHorMin = Infinity;
    var screenHorMax = -Infinity;
    for (i = 0; i < bouys.length; i++) {
        bouyEast = (bouys[i].east - screenEast) * Math.cos(rot) - (bouys[i].north - screenNorth) * Math.sin(rot);
        if (bouyEast < screenHorMin)
            screenHorMin = bouyEast;
        if (bouyEast > screenHorMax)
            screenHorMax = bouyEast;
    }
    screenUTMRange.centerEast += (screenHorMax + screenHorMin) / 2;
}

// This function draws the wavves
function drawWaves() {
    $waves_container = $('#waves-container');
    $waves_container.empty();

    for (var i = 0; i < 20; i++) {
        var wave = document.createElement('div');
        $(wave).addClass('wave')
                .appendTo($waves_container);
    }
}

//This function will draw height lines on the screen {
function drawHeightLines() {
    // Clear the container
    $('#height-line-container').empty();

    var direction = (wind_direction + screenUTMRange.rotation * 180 / Math.PI);
    var screenWidth = $('html').width();
    var screenHeight = $('html').height();

    var dir_c = (0 + direction) / 180 * Math.PI;

    var x = screenWidth / 2;
    var y = screenHeight / 2;

    var z = 0;
    var steps = 6;

    var offY = screenHeight / steps;
    var offX = 0;
    var offYc = offY * Math.cos(dir_c);
    var offXc = -offY * Math.sin(dir_c);

    while (z < steps) {
        var element = $('<div/>').addClass('height-line');
        element.css('top', (y + (z * offYc)) + 'px');
        element.css('left', (x + (z * offXc)) + 'px');
        element.css('-ms-transform', 'rotate(' + direction + 'deg)');
        element.css('-webkit-transform', 'rotate(' + direction + 'deg)');
        element.css('transform', 'rotate(' + direction + 'deg)');
        $('#height-line-container').append(element);

        if (z > 0) {
            var element = $('<div/>').addClass('height-line');
            element.css('top', (y - (z * offYc)) + 'px');
            element.css('left', (x - (z * offXc)) + 'px');
            element.css('-ms-transform', 'rotate(' + direction + 'deg)');
            element.css('-webkit-transform', 'rotate(' + direction + 'deg)');
            element.css('transform', 'rotate(' + direction + 'deg)');
            $('#height-line-container').append(element);
        }
        z++;
    }
}

// This function alligns all directions correctly.
function setArrows() {

    var $north = $('#north-arrow img');
    var $wind = $('#wind-arrow img');
    var $waves = $('#waves-container');

    north_direction = screenUTMRange.rotation * 180 / Math.PI;
    $north.css('-ms-transform', 'rotate(' + north_direction + 'deg)');
    $north.css('-webkit-transform', 'rotate(' + north_direction + 'deg)');
    $north.css('transform', 'rotate(' + north_direction + 'deg)');


    $wind.css('-ms-transform', 'rotate(' + (wind_direction + north_direction) + 'deg)');
    $wind.css('-webkit-transform', 'rotate(' + (wind_direction + north_direction) + 'deg)');
    $wind.css('transform', 'rotate(' + (wind_direction + north_direction) + 'deg)');

    console.log("Wind = " + wind_direction);
    console.log("Wave = " + wave_direction);

    $waves.css('-ms-transform', 'rotate(' + (wave_direction + north_direction) + 'deg)');
    $waves.css('-webkit-transform', 'rotate(' + (wave_direction + north_direction) + 'deg)');
    $waves.css('transform', 'rotate(' + (wave_direction + north_direction) + 'deg)');
}

// This function continually gets data from the server
var listenTimer; // This variable is used to make sure we don't listen too quick in simulations
function listen() {
    listenTimer = millis();
    $.ajax({
        type: 'POST',
        url: listenerUrl + "/1/" + startTime,
        success: function (data) {
            crews = $.parseJSON(data);
            // Update the crews with the new data
            var boat;
            for (var i = 0; i < crews.length; i++) {
                var crew = crews[i];
                // Find the boat we need
                for (var j = 0; j < boats.length; j++) {
                    if (boats[i].id == crew.id) { // Found it
                        boat = boats[i];
                        break;
                    }
                }
                // calc the progress between the previous and next bouy
                boat.calcPositionBoat();
                
                boat.calcDistanceBouy();

            	Dashboard.sortBoats();
            	boat.calcPositionBoat();
                // Set the variables
                boat.updateData(
                        crew.tracker.north,
                        crew.tracker.east,
                        crew.tracker.velocity,
                        crew.tracker.heading
                        );
                
            }
        },
        complete: function (e, data) {
            if (millis() - listenTimer < 500 && simulation) {
                // Slow down for the simulation data
                setTimeout(listen, listenTimer + 500 - millis());
            } else {
                listen();
            }
        }
    });
}


function createBoats() {
    // Check which bouy is first
    for (var i = 0; i < crews.length; i++) {
        
        //if (i != 2) continue;
        var crew = crews[i];
        var boat = boats[i] = new Boat(millis());
        var boatElement = $('.boat#boat-' + crew.id);
        var x = boatElement.position();
        
        boat.top = x.top;
        boat.left = x.left;
        boat.element = boatElement;
        boat.boatIcon = boatElement.find('.boat-icon');
        boat.id = crew.id;
        boat.num = i;
        boat.north = crew.tracker.north;
        boat.east = crew.tracker.east;
        boat.direction = crew.tracker.heading;
        boat.speed = crew.tracker.velocity;
        boat.nextBouy = 2;
        boat.bouyStatus = 0;
        boat.drawn.north = boat.north;
        boat.drawn.east = boat.east;
        boat.updatePosition(i + 1);
        boat.checkBouys();
        boat.setTeam(i);
        
        boat.animateMarker();
        boat.rotateMarker();
        boat.moveBoat(i); // runs every 100 ms

        // create for each boat a canvas to draw the trail
        //createCanvas(i);
    }
}
;

// DEZE FUNCTIE WORDT NIET MEER GEBRUIKT
// create canvas to draw the trail of the boats
function createCanvas(i) {
    var x = $('#boat-' + crews[i].id).position();

    //canvas
    var $canvas = document.querySelector('#canvas-' + crews[i].id);
    ctx = $canvas.getContext('2d');

    // set height and with of the canvas to cover the whole screen
    $('#canvas-' + crews[i].id).attr('width', $('html').width());
    $('#canvas-' + crews[i].id).attr('height', $('html').height());

    ctx.setLineDash([2,15]);
    ctx.lineWidth = 1;
    
    var color;
    
    var boat_num = i + 1;
    
    switch(boat_num ) {
	    case 1:
	    	color = '#fff'; // wit
	        break;
	    case 2:
	        color = '#1b7ebc'; // blauw
	        break;
	    case 3:
	        color = '#383838';  // zwart
	        break;
	    case 4:
	    	color = '#13c54c'; // groen
	        break;
	    case 5:
	        color = '#fec835'; // geel
	        break;
	    case 6:
	        color = '#fe2d2d'; // rood
	        break;
	    default:
	    	color = '#fff';
	} 
    
    ctx.strokeStyle = color;

}


// util methods
/* prototype function to convert lat-lng to utm */
function convertToUTM(obj) {
    [obj.north, obj.east] = proj4(wgs84, utm, [obj.lat, obj.lng]);
}

function toRadians(angle) {
    return angle * (Math.PI / 180);
}

function toDegrees(angle) {
    return angle * (180 / Math.PI);
}

// obj is the physical jquery object
// obj_east is the value from the 
function convertToPixels(obj, obj_east, obj_north) {
    
    // Get the screen size in pixel
    var screenWidth = $('html').width();
    var screenHeight = $('html').height();

    rot = screenUTMRange.rotation;
    cEast = screenUTMRange.centerEast;
    cNorth = screenUTMRange.centerNorth;
    rEast = screenUTMRange.rangeEast;
    rNorth = screenUTMRange.rangeNorth;
    var east, north;
    
    // Rotate the location
    [east, north] = rotatePoint(rot, obj_east, obj_north, cEast, cNorth);
    east -= cEast;
    north -= cNorth;
    
    var target = {};

    target.left = (east / rEast / 2 + 1 / 2) * screenWidth + obj.width() / 2;
    target.top = screenHeight - (north / rNorth / 2 + 1 / 2) * screenHeight + obj.height() / 2;

    return target;
}

function drawTrail(x_target, y_target, num_boat) {
	var x = x_target;
	var y = y_target;
	
	if(num_boat != 0 && show_all_trails == false ) return false;
	
	// drop breadcrumbs
	var breadcrumb = document.createElement('div');
	$(breadcrumb).addClass('start-'+num_boat)
				.addClass('breadcrumb')
				.css({'top':y,'left':x})
				.appendTo('#trail-container');
	setTimeout(function(){
		$(breadcrumb).fadeOut(3000);		
	},22000);
	setTimeout(function(){
		$(breadcrumb).remove();		
	},25000);

    //var $canvas = document.querySelector('#canvas-' + boats[num_boat].id);
    //var ctx = $canvas.getContext('2d');

    //ctx.lineTo(x,y);
    //ctx.stroke();
}


function convertSpeedtoKN(speed) {
    knots = speed * 1.94389;
    return knots;
}


// This function will calculate the status of a boat near a bouy
// This is used to determine when the boat has rounded the bouy.
function bouyStatus(boat_id, bouy_id) {
    // Variables
    var boat = boats[boat_id];
    var bouy = bouys[bouy_id];

    // First check if the distance to the bouy is less than 50m
    if (norm2Dist(boat, bouy) > 50)
        return 0;

    // Calculate the the angle between this bouy and the two others
    if (bouy.type == 1) { // Start bouy
        // This bouy consist of either 2 bouys or a bouy and a ship.
        // TODO
    }
    if (bouy.type == 2) { // Normal bouy
        // Calculate the angle with the preivous bouy and the next bouy.
        var prevBouy = bouys[bouy_id - 1];
        var nextBouy = bouys[bouy_id + 1];
        var prevAngle = getAngle(bouy, prevBouy) * 180 / Math.PI;
        var nextAngle = getAngle(bouy, nextBouy) * 180 / Math.PI;
        var bissect = (prevAngle + nextAngle) / 2;

        // Get the angle between the boat and the bouy
        var cAngle = getAngle(bouy, boat) - bissect;
        while (Math.abs(cAngle) > 180)
            cAngle -= Math.sign(cAngle) * 360;
        if (cAngle > 0 && cAngle <= 90)
            return 1;
        if (cAngle < 0 && cAngle >= -90)
            return 2;
        if (cAngle > 90 && cAngle <= 180)
            return 3;
        if (cAngle < -90 && cAngle >= -180)
            return 4;
    }
    if (bouy.type == 3) { // Finish bouy
        // This bouy consist of either 2 bouys or a bouy and a ship.
        // TODO
    }
}

// This function calculates the distance between two objects
function norm2Dist(obj, obj2) {
    return Math.sqrt(
            Math.pow(obj.east - obj2.east, 2) +
            Math.pow(obj.north - obj2.north, 2)
            );
}

// This function will calculate the angle between two objects
function getAngle(obj, obj2) {
    return Math.atan2(
            obj.north - obj2.north,
            obj.east - obj2.east
            );
}

// This function will rotate a point around another point
function rotatePoint(rotation, start_east, start_north, center_east = 0, center_north = 0) {
    var ceast = Math.cos(rotation) * (start_east - center_east) -
            Math.sin(rotation) * (start_north - center_north) + center_east;
    var cnorth = Math.sin(rotation) * (start_east - center_east) +
            Math.cos(rotation) * (start_north - center_north) + center_north;
    return [ceast, cnorth];
}

function millis(speed_up = 1) {
    var d = new Date();
    var time = d.getTime();
    if (!speed_up) {
        return time;
    } else {
        return (time - jsTime) * simulation_speed + jsTime;
    }
}

function deepcopy(item) {
    return JSON.parse(JSON.stringify(item));
}