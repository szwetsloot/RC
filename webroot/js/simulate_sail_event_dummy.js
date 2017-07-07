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
var refresh_time = 6000;

var windDirection = 0;
var north_direction = 200;
var wind_direction = 280;
var boats = [];
var run = 1; // global variable for running the animation 1 = run & 0 = stop
var end_animation = 2; // stop the animation after 2 minutes

var screenUTMRange = {
    'centerEast': 1E9,
    'rangeEast': 0,
    'centerNorth': 1E9,
    'rangeNorth': 0,
    'rotation': 0,
    'bouy1': 0,
    'bouy2': 0
};

var dummyData = [
    {
        'number': 0,
        'direction': 145,
        'speed': 6.3
    }, {
        'number': 1,
        'direction': 235,
        'speed': 6.4
    }, {
        'number': 0,
        'direction': 145,
        'speed': 6.3
    }, {
        'number': 1,
        'direction': 235,
        'speed': 6.5
    }, {
        'number': 0,
        'direction': 145,
        'speed': 6.9
    }, {
        'number': 1,
        'direction': 90,
        'speed': 6.3
    }, {
        'number': 0,
        'direction': 0,
        'speed': 6.6
    }, {
        'number': 1,
        'direction': 0,
        'speed': 6.3
    }, {
        'number': 0,
        'direction': 0,
        'speed': 6.8
    }, {
        'number': 1,
        'direction': 0,
        'speed': 6.7
    }, {
        'number': 1,
        'direction': 270,
        'speed': 6.2
    }
];

var bouys = [
    {
        'number': 0,
        'lat': 52.112861,
        'lng': 4.256690,
        'north': 0,
        'east': 0
    },
    {
        'number': 1,
        'lat': 52.110038,
        'lng': 4.264921,
        'north': 0,
        'east': 0
    },
    {
        'number': 2,
        'lat': 52.117838,
        'lng': 4.264921,
        'north': 0,
        'east': 0
    },
    {
        'number': 3,
        'lat': 52.112861,
        'lng': 4.272109,
        'north': 0,
        'east': 0
    }
];

var teams = [
    {
        'name': 'Haarlemsche Jachtclub',
        'img': '1.Haarlem.png',
    }, {
        'name': 'WV Neptunus',
        'img': '17.DenBosch.png',
    }, {
        'name': 'Zeilteam Westeinder',
        'img': '18.Westeinder.png',
    }
];

// the boat object 
function Boat() {
    this.team = 0;
    this.north = 0;
    this.east = 0;
    this.speed = 0;
    this.direction = 170;
    this.element = '#boat-0'
}
;

// extend the boat object
Boat.prototype = {
	'updateData': function (speed, direction) {
	    this.speed = speed;
	    this.direction = direction;
	    var knots = Math.round(convertSpeedtoKN(speed) * 10) / 10;
	    $(this.element).find('.extra p').html(knots + 'kN  ' + this.direction + '&deg;')
	},
	'updatePosition': function (position) {
	    this.position = position;
	    var $boat = $(this.element);
	    var $boat_position = $boat.find('.boat-stats .position')
	    $boat_position.text(position);
	},
	'setTeam': function (i) {
	    this.team = i;
	    var $boat = $(this.element);
	    var $boat_name = $boat.find('.name');
	    var $boat_flag = $boat.find('.team-flag img');
	    console.log(crews[i]);
	    $boat_name.text(crews[i].shortname);
	
	    var src = $boat_flag.attr('src') + teams[i].img;
	    $boat_flag.attr('src', src);
	},
	'moveBoat': function (target_y, target_x, direction) {
	    if (run != 1)
	        return false; // check of de animatie moet lopen 
	
	    var $boat = $(this.element);
	    var $boat_icon = $boat.find('.boat-icon')
	
	    $boat_icon.animate({
	        textIndent: direction
	    }, {
	        step: function (now, fx) {
	            $(this).css('-webkit-transform', 'rotate(' + now + 'deg)')
	        },
	        duration: 0,
	        complete: function () {
	            $boat.animate({
	                'left': target_x + 'px',
	                'top': target_y + 'px'
	            }, refresh_time, 'linear') // stop verplaatsen 200 ms voor dat de boot weer draait naar een nieuwe direction
	        }
	    }, 'linear');
	
	    calcTrail(target_x, target_y, this.num); // draw the trail of the boat
	
	    // in de functie calcTrail wordt de huidge positie gebruikt
	    // update de positie pas na de calcTrail
	    this.top = target_y;
	    this.left = target_x;
	}
};
	

// calc distance between boat and next bouy
Boat.prototype.calcDistanceBouy = function(step = 0){
	// laat de functie
	var steps = 12;
	var d_t = refresh_time / 12;
	var self = this;
	
	// select next bouy
	var $bouy = $('#bouy-1');
	var bouy_pos = $bouy.position();
	var bouy_x = bouy_pos.top;
	var bouy_y = bouy_pos.left;
	
	var $boat = $(this.element);
	var boat_pos = $boat.position();
	var boat_x = boat_pos.top;
	var boat_y = boat_pos.left;
	
	var d_x = Math.abs( boat_x - bouy_x );
	var d_y = Math.abs( boat_y - bouy_y );

	// pythagoras a2 +b2 = c2 
	this.distance_bouy = Math.round( Math.sqrt( ( Math.pow(d_x, 2)  +  Math.pow(d_y, 2) ) ) );
	
	
	$boat.find('.name').text(this.distance_bouy+'px');
	
	if( step < steps )
		setTimeout(function(){ self.calcDistanceBouy( step+1 ); },d_t)
}

//converts meters to pixels and moves the object
//in de dummy worden alleen pixel gebruikt
$(function () {

    // Draw the elements
    drawHeightLines();
    drawWaves();
    createBoats();
    setArrows();

    // Convert the bouy's location to UTM
    for (var i = 0; i < bouys.length; i++)
        convertToUTM(bouys[i]);

    // Calculate the longest distance between two bouys to determine the horizontal location
    calculateLongestDistanceBouys();
    // Calculate the range of the screen based on the positions of the bouys
    calculateScreenRange();
    // Move the bouys to their correct location
    moveBouys();


    // run animation
    getDataBoats(0); // start met item 0 van de datareek

});


// get the data from the database or from the dummy object
<<<<<<< HEAD
function getDataBoats(reeks) {

    // loop through all the boats
    $.each(boats, function (i) {

        var rand_i = Math.floor((Math.random() * dummyData.length) + 1);

        //var data_obj = dummyData[reeks];
        var data_obj = dummyData[rand_i - 1 ];

        // get measured speed and direction
        var speed = data_obj.speed;
        var direction = data_obj.direction;

        var boat = boats[i];

        // show speed and direction in the boat label
        boat.updateData(speed, direction);
		boat.calcDistanceBouy();
		
        var target = calculateVector(boat, boat.speed, boat.direction);
        boat.moveBoat(target.top, target.left, boat.direction)

    });

    // repeat function after 2 sec
    var reeks = reeks + 1;
    if (reeks === (dummyData.length)) {
        reeks = 0
    }
    ;

    // retrieve new data after a few second
    setTimeout(function () {
        getDataBoats(reeks)
    }, refresh_time);
}


//calculate new position
function calculateVector(boat_obj, speed, direction) {

    var target = {}; // huidige positie
    var time = refresh_time / 1000;

    direction = toRadians(direction);

    // calculate target -> sos cas toa
    var vector_distance = time * speed; // afgelegde afstand in meters
    var vector_vertical = Math.sin(direction) * vector_distance; // verticale component in meters
    var vector_horizontal = Math.cos(direction) * vector_distance; // horizontale component

    // add vectors to current position
    target.top = boat_obj.top + vector_vertical;
    target.left = boat_obj.left + vector_horizontal;

    return target;
}

/* DRAW ELEMENTS */
//This function will calculate the longest distance between two bouys.
//This distance will be used as the horizontal line on the screen
function calculateLongestDistanceBouys() {
    var i, j;
    dist = 0;
    bouy1 = 0;
    bouy2 = 0;
    for (i = 0; i < bouys.length; i++) {
        for (j = 0; j < bouys.length; j++) {
            if (i == j)
                continue; // Don't compare the same bouys because the distance = 0
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
    if (screenUTMRange.rotation < -Math.PI / 2)
        screenUTMRange.rotation += Math.PI;
    if (screenUTMRange.rotation > Math.PI / 2)
        screenUTMRange.rotation -= Math.PI;
    screenUTMRange.bouy1 = bouy1;
    screenUTMRange.bouy2 = bouy2;
    ;
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
    for (i = 0; i < bouys.length; i++) {
        bouyEast = (bouys[i].east - screenEast) * Math.cos(rot) - (bouys[i].north - screenNorth) * Math.sin(rot);
        bouyNorth = (bouys[i].east - screenEast) * Math.sin(rot) + (bouys[i].north - screenNorth) * Math.cos(rot);
        if (Math.abs(bouyEast) > horMax)
            horMax = Math.abs(bouyEast);
        if (Math.abs(bouyNorth) > verMax)
            verMax = Math.abs(bouyNorth);
    }

    var factor = 1.5;
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

//This function will move the bouys to their correct location
function moveBouys() {
	// Get the screen size in pixel
	var screenWidth = $('html').width();
	var screenHeight = $('html').height();
	
	// Calculate the coordinates for each bouy
	for (var i = 0; i < bouys.length; i++) {
	    var element = $('#bouy-' + i);
	    rot = screenUTMRange.rotation;
	    cEast = screenUTMRange.centerEast;
	    cNorth = screenUTMRange.centerNorth;
	    rEast = screenUTMRange.rangeEast;
	    rNorth = screenUTMRange.rangeNorth;
	    east = (bouys[i].east - cEast) * Math.cos(rot) - (bouys[i].north - cNorth) * Math.sin(rot);
	    north = (bouys[i].east - cEast) * Math.sin(rot) + (bouys[i].north - cNorth) * Math.cos(rot);
	
	    var left = (east / rEast / 2 + 1 / 2) * screenWidth + element.width() / 2;
	    var top = (north / rNorth / 2 + 1 / 2) * screenHeight + element.height() / 2;
	
	    element.css('left', left + 'px');
	    element.css('top', top + 'px');
	}
}


function drawWaves() {
    $waves_container = $('#waves-container');
    $waves_container.empty();

    var container_width = $waves_container.width();
    var steps = 20;

    for (i = 0; i < 20; i++) {
        var wave = document.createElement('div');

        $(wave).addClass('wave')
                .appendTo($waves_container);
    }
}

//This function will draw height lines on the screen {
function drawHeightLines() {
    // Clear the container
    $('#height-line-container').empty();

    var direction = -90 + (windDirection + screenUTMRange.rotation * 180 / Math.PI);
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
        element = $('<div/>').addClass('height-line');
        element.css('top', (y + (z * offYc)) + 'px');
        element.css('left', (x + (z * offXc)) + 'px');
        element.css('-ms-transform', 'rotate(' + direction + 'deg)')
        element.css('-webkit-transform', 'rotate(' + direction + 'deg)')
        element.css('transform', 'rotate(' + direction + 'deg)')
        $('#height-line-container').append(element);

        if (z > 0) {
            element = $('<div/>').addClass('height-line');
            element.css('top', (y - (z * offYc)) + 'px');
            element.css('left', (x - (z * offXc)) + 'px');
            element.css('-ms-transform', 'rotate(' + direction + 'deg)')
            element.css('-webkit-transform', 'rotate(' + direction + 'deg)')
            element.css('transform', 'rotate(' + direction + 'deg)')
            $('#height-line-container').append(element);
        }

        z++;
    }
}

function setArrows() {

    var $north = $('#north-arrow img');
    var $wind = $('#wind-arrow img');
    var $waves = $('#waves-container');
    var wave_direction = wind_direction + 90;

    $north.css('-ms-transform', 'rotate(' + north_direction + 'deg)');
    $north.css('-webkit-transform', 'rotate(' + north_direction + 'deg)');
    $north.css('transform', 'rotate(' + north_direction + 'deg)');

    $wind.css('-ms-transform', 'rotate(' + wind_direction + 'deg)');
    $wind.css('-webkit-transform', 'rotate(' + wind_direction + 'deg)');
    $wind.css('transform', 'rotate(' + wind_direction + 'deg)');


    $waves.css('-ms-transform', 'rotate(' + wave_direction + 'deg)');
    $waves.css('-webkit-transform', 'rotate(' + wave_direction + 'deg)');
    $waves.css('transform', 'rotate(' + wave_direction + 'deg)');
}

function createBoats() {
    for (i = 0; i < crews.length; i++) {
        var crew = crews[i];
        var boat = boats[i  ] = new Boat();

        var boatElement = $('.boat#boat-' + crew.id);

        var x = boatElement.position();

        boat.top = x.top;
        boat.left = x.left;
        boat.element = '#boat-' + i;
        boat.id = crew.id;
        boat.num = i;
                boat.updatePosition(i + 1)
        boat.setTeam(i);

        // create for each boat a canvas to draw the trail
        createCanvas(i)
    }

}
;


// create canvas to draw the trail of the boats
function createCanvas(i) {
    var x = $('#boat-' + crews[i].id).position();

    //canvas
    var $canvas = document.querySelector('#canvas-' + crews[i].id);
    ctx = $canvas.getContext('2d');

    // set height and with of the canvas to cover the whole screen
    $('#canvas-' + i).attr('width', $('html').width());
    $('#canvas-' + i).attr('height', $('html').height());

    ctx.lineWidth = 1;
    ctx.strokeStyle = 'white';

    ctx.moveTo(x.left, x.top);
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

function calcTrail(x_target, y_target, boat) {

    var steps = 12;
    var d_t = refresh_time / steps;
    var waypoints = [];

    // get old coordinates
    var y_cur = boats[boat].top;
    var x_cur = boats[boat].left;

    var d_x = (x_target - x_cur) / steps;
    var d_y = (y_target - y_cur) / steps;

    for (i = 0; i < steps; i++) {

        var x_step = x_cur + (d_x * i);
        var y_step = y_cur + (d_y * i);

        waypoints.push({
            x: x_step,
            y: y_step
        });
    }

    drawTrail(waypoints, d_t, boat)

}

<<<<<<< HEAD
function drawTrail(waypoints, t,boat){
		
	if(waypoints.length === 0) return false;
	
	var x = waypoints[0].x;
	var y = waypoints[0].y;
		
	var $canvas =  document.querySelector('#canvas-'+boat);	
	var ctx = $canvas.getContext('2d');
	
	ctx.lineTo(waypoints[0].x, waypoints[0].y);
	ctx.stroke();
	
	waypoints.shift();  // remove first item of array
	
	setTimeout(function(){  drawTrail(waypoints, t, boat) }, t);
=======
function drawTrail(waypoints, t, boat) {

    if (waypoints.length === 0)
        return false;

    var x = waypoints[0].x;
    var y = waypoints[0].y;

    var $canvas = document.querySelector('#canvas-' + boats[boat].id);
    var ctx = $canvas.getContext('2d');

    ctx.lineTo(waypoints[0].x, waypoints[0].y);
    ctx.stroke();

    waypoints.shift();  // remove first item of array

    setTimeout(function () {
        drawTrail(waypoints, t, boat)
    }, t);
>>>>>>> c5d3996ea159c430d9112e018eccff27c4ac4a90
}


function convertSpeedtoKN(speed) {
    knots = speed * 1.94389;
    return knots;
}

// initialize your variables outside the function 
var count = 0;
var clearTime;
var seconds = 0, minutes = 0, hours = 0;
var clearState;
var secs, mins, gethours;

function startWatch() {

    if (minutes > end_animation)
        run = 0;

    //check if seconds is equal to 60 and add a +1 to minutes, and set seconds to 0 	
    if (seconds === 60) {
        seconds = 0;
        minutes += 1;
    }
    // you use the javascript tenary operator to format how the minutes should look and add
    // 0 to minutes if less than 10 
    mins = (minutes < 10) ? ('0' + minutes + ':') : (minutes + ':');

    // check if minutes is equal to 60 and add  a +1 to hours set minutes to 0 
    if (minutes === 60) {
        minutes = 0;
        hours = hours + 1;
    }

    /* you use the javascript tenary operator to format how the hours should look and add 0 to hours if less than 10 */
    gethours = (hours < 10) ? ('0' + hours + ':') : (hours + ':');
    //secs = ( seconds < 10 ) ? ( '0' + seconds ) : ( seconds ); 
    secs = seconds;

    // display the stopwatch 
    var x = $('#race-time .counter').text(gethours + mins + secs);
    $('#bouy-counter .counter').text('+' + mins + secs);

    // call the seconds counter after displaying the stop watch and increment seconds by +1 to keep it counting
    seconds++;

    // call the setTimeout( ) to keep the stop watch alive! 
    clearTime = setTimeout("startWatch()", 1000);
}

startWatch();


var athlete = 0;

rotateAthletes()

function rotateAthletes() {
    $athletes_list = $('#boat-info .team-members ul li');

    $athletes_list.eq(athlete).show().delay(2800).fadeOut();

    athlete = (athlete < ($athletes_list.length - 1)) ? athlete += 1 : 0;

    setTimeout('rotateAthletes()', 3000);

}
