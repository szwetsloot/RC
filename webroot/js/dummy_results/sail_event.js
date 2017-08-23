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
var debug = false;

/* Simulation variables */
var simulation = 1; // TODO - Set this to 0 when done building
var simulation_speed = 5;
var simulation_running = false; // global variable for running the animation 1 = run & 0 = stop

/* Others */
var utm = "+proj=utm +zone=31";
var wgs84 = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";
var refresh_time = 6000;

var boats = [];
var generated_data = [];
var race_veld = 'Zeilregatta Scheveningen'; // TODO get from backend 
var show_finish = false; // panel dat na 120 seconden wordt weergegeven
var show_startline = true; // teken de start line tussen boei nummer 3 en 4

var options = {
		simulation_speed 	: 1,
		lengthTrail 		: 250, 			// length of trail in meters
		bouy_radius 		: 50,			// distance to enter bouy (meters) 
		boat_speed 			: 6,
		run_once 			: true, 		// restart simulation at the end of the data?
		show_all_trails		: true, 		// Als dit false staat wordt alleen het spoor van boot 1 weergegeven
		generated_data 		: true,			// true als dit de data uit de log is
		testboat 			: 9, 			// id van testboat
		noise_rotation 		: 5, 			// degrees
}

var screenUTMRange = {
    'centerEast': 1E9,
    'rangeEast': 0,
    'centerNorth': 1E9,
    'rangeNorth': 0,
    'rotation': 0,
    'bouy1': 0,
    'bouy2': 0
};

var simulationDataDistance = 0;

$(function () {
    console.log('-------');

    // Create the bouys
    createBouys();

    // Calculate the longest distance between two bouys to determine the horizontal location
    calculateLongestDistanceBouys();
    // Calculate the range of the screen based on the positions of the bouys
    calculateScreenRange();
    prepareDummyData();
    
    // Draw the elements
    drawHeightLines();
    drawWaves();
    setArrows();
    moveBouys();
    createBoats();
    
    generateData(); // after create boats
    
    drawStartline();
    Progress.drawCourse();
    
    Timeline.draw();

    // TODO put in start simulation oid
    $.each(boats,function(i){
    	boats[i].move(); // runs every 500ms    	
    });
    
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

        prepareDummyData();
    });
});

// NOG NODIG VOOR HET BEREKENEN VAN DE LANGTE ROUTE
function prepareDummyData(){
	
	for( i = 0; i < tracker_data_list.length; i++ ){
		
	    var tracker_data = tracker_data_list[i];
	    
		 // convert dummy data to UTM values
		for( j = 0; j < tracker_data.length; j++ ){
			var $element = $('.boat-icon'); // voor deze functie hebben geen specifieke boot nodig
			target = convertToPixels($element,tracker_data[j].east, tracker_data[j].north);
			tracker_data[j].left = target.left;
			tracker_data[j].top = target.top;
			
			// bereken de afstand die de boten moeten afleggen
			if(j > 0 &&  i == 0 ) simulationDataDistance += norm2Dist(tracker_data[j - 1],tracker_data[j]);
			
		}
		
	}
	
}

function generateData(){
	// for each tracker_data trail of boat
	$.each(tracker_data_list, function(num_boat){	
		var boat_data = tracker_data_list[num_boat];
		// loop through all packets in array	
		$.each(boat_data, function(i){
			
			// get current and next packet 
			var cur_point = boat_data[i];
			var target_point = boat_data[i+1];
			
			if(target_point == null) return false; // laatste package stop met berekenen.
			
			// get boat
			var boat = boats[num_boat];
			var speed = boat.speed;
	    	var $boat = boat.element;
	        var $boat_icon = $boat.find('.boat-icon');
			
			// calc direction
			var angle = toDegrees( getAngle(cur_point, target_point) );    	
	    	var general_direction = ( 270 - angle ) % 360 + toDegrees(screenUTMRange.rotation);
			
			// calc duration bouys
			var dist = norm2Dist(cur_point,target_point);
			var duration = dist / speed; // duration in ms 
			
			// voor de for loop definieren zodat deze voor de gehele for loop gelijk is
			var noise_factor = 2 * ( Math.random() * 2 - 1 ) * ( duration / 20 );
			
	    	for( time = 0; time < duration; time += 0.5 ){
	    		
	    		// De noise wordt kleiner naarmate je dichter bij de boei komt
	    		var p = time / duration;
	    		var noise_amount = Math.sin( 2 * Math.PI * p ) * noise_factor; 
	        	var noise_north = 0.5 * ( Math.random() * 2 - 1 ) + noise_amount;// random = -1 of 1
	        	var noise_east = 0.5 * ( Math.random() * 2 - 1 ) + noise_amount;
	
	        	
	        	// calc new data point with rendered noise 
	            var calc_north = cur_point.north + noise_north + ( Math.cos(toRadians(general_direction)) * speed * time );
	            var calc_east = cur_point.east + noise_east + ( Math.sin(toRadians(general_direction)) * speed * time );
	    		
	            // convert to pixels 
	            var target = convertToPixels($boat_icon, calc_east, calc_north);				      
	            
				// create point obj
	            var new_point = {
	            		north : calc_north,
	            		east : calc_east,
	            		top : target.top,
	            		left: target.left,
	            		direction : general_direction
	            	} 
	            
	            // alleen het eerste punt een status, anders krijg je heel veel geronde boeien
	            if(	time == 0 ){
	            	new_point.status = cur_point.status
	            } else{
	            	new_point.status = null;
	            }

	            // store calculated datapoint
	            generated_data[num_boat].push(new_point);

	    	}				
		});		
	});
}


function drawStartline(){
	if(show_startline == false) return false;

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
        $(wave).addClass('wave').appendTo($waves_container);
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

    $waves.css('-ms-transform', 'rotate(' + (wave_direction + north_direction) + 'deg)');
    $waves.css('-webkit-transform', 'rotate(' + (wave_direction + north_direction) + 'deg)');
    $waves.css('transform', 'rotate(' + (wave_direction + north_direction) + 'deg)');
}


function createBoats() {
    // Check which bouy is first
    for (var i = 0; i < crews.length; i++) {
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
        boat.speed = 2 + ( boat.num / 16);
        boat.nextBouy = 2;
        boat.numNextBouy = 2;
        boat.start_nr = crew.start_nr
        boat.numPrevBouy = 0;
        boat.bouyStatus = null;
        boat.raceDuration = simulationDataDistance / boat.speed;
        boat.firstBoat = (i == 2)? true : false; // custom er ingegooid voor het ronden van de boei
        
        generated_data.push([]); // voeg lege array toe

    }
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
function convertToPixels(obj, obj_east, obj_north) {
    
    // Get the screen size in pixel
    var screenWidth = $('html').width();
    var screenHeight = $('html').height();

    var screenWidth = $('#simulator').width();
    var screenHeight = $('#simulator').height();

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



function convertSpeedtoKN(speed) {
    knots = speed * 1.94389;
    return knots;
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
        return (time - jsTime) * options.simulation_speed + jsTime;
    }
}

function deepcopy(item) {
    return JSON.parse(JSON.stringify(item));
}