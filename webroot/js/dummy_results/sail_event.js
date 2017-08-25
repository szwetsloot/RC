// Reference the global variables
var bouys;
var crews;
var boats = [];
var wind_direction;
var wave_direction;
var north_direction = 0;
var listenerUrl;
var startTime;
var generated_data = [];
var bouy_stopwatch; // stopwatch that runs when boat rounds a bouy
var race_stopwatch; // stopwatch which starts when screen is finished loading
//var simulationDataDistance = 0;         // total distance the first boat has to move in meters
var utm = "+proj=utm +zone=31";
var wgs84 = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";
var browser_location = $(location).attr('href').replace('simulations/dummy-results/','');
var image_base_url = browser_location+'/img/sail_event_v2/teams/';
var debug = false;

var options = {
        race_veld           : 'Zeilregatta Scheveningen',
        simulation_speed    : 1,            // 1 - 5
        lengthTrail         : 250,          // length of trail in meters
        boat_speed          : 6,
        run_once            : true,         // restart simulation at the end of the data?
        show_all_trails     : true,         // Als dit false staat wordt alleen het spoor van boot 1 weergegeven
        generated_data      : true,         // true als dit de data uit de log is
        testboat            : 9,            // id van testboat
        noise_rotation      : 5,            // in degrees
        show_startline      : true,         
        wave_direction      : 45,
        wind_direction      : 100,
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

$(function () {
    console.log('-------');
    // Alle init functies worden vanaf hier aangeroepen
    Simulator.init(); // Draws simulation elements like waves, boats and renders the data
    Dashboard.init(); // Handles all the info panels
    Progress.init(); // Course progress sidebar on the right side
    Timeline.init(); // The timeline that allows users to navigate to a certain point of time during the race

    // DOM EVENTS
    $('#finish-panel .crew').on('click',Dashboard.showCrewResults);

    $('#bouy-container').on('click','.bouy',Dashboard.toggleBouyInfo);
    /*
    $('#boat-container .boat').on('click',function(){
    	var boat_id = $(this).closest('.boat').attr('id').replace('boat-','');
    	Dashboard.showBoats.push(boat_id);			
		// if not animating initiate new rotation of athletes 
		if( Dashboard.animatingAthletes == false ) Dashboard.showCrewInfo(boat_id);		
    });
    */
    
    // Recalculate variables on screen resize
    $(window).on('resize', function () {
        Simulator.init(); 
        Simulator.drawClearedStartline();   
    });
});

/* --------------------------
 * GLOBAL UTILITY METHODS
 * --------------------------
 */

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
    //var screenWidth = $('html').width();
    //var screenHeight = $('html').height();
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
