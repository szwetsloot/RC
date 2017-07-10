
$(function () { 
	
	$('.boat-icon').on('click', function(){
		var boat_id = $('this').parent().attr('id').replace('','');
		alert(boat_id);
	});
	
	
});

var Dashboard = {
	crew : null,
	crewmembers : [],
}

// Het horizontale panel op de onderrand van het scherm
Dashboard.showCrewInfo = function(crew_id){
	// select team
	// TODO crew id moet worden opgezocht in de array
	var crew = crews[crew_id];
	var tracker = crew.tracker;
	var boat = boats[crew_id];
	var boat_speed = Math.round(convertSpeedtoKN(boat.speed) * 10) / 10;
	console.log(tracker);
	
	// define dom elements
	var $panel = $('#boat-info');
	var $position = $panel.find('#boat-position');
	var $speed = $panel.find('#boat-speed');
	var $boat_roll = $panel.find('#boat-roll');
	var $boat_location = $panel.find('#boat-location');
	var $boat_target = $panel.find('#boat-target-bouy');
	
	// update information
	$speed.text('Snelheid: '+ boat_speed +'Kn');
	$boat_roll.html(tracker.roll_angle+'&deg;');
	$boat_location.text( Math.round(tracker.east)+'m, '+Math.round(tracker.north)+'m' );
	$boat_target.text( 'Volgende boei '+boat.distance_bouy+'m' );
	
	// repeat function every 500 ms
	setTimeout(function(){ Dashboard.showCrewInfo(crew_id); },500);
}

// Het panel met een lijst met doorkomsttijden van een boei
Dashboard.showBouyInfo = function(){
	
}

// Athlete slider
var athlete = 0;

rotateAthletes()

function rotateAthletes() {
    $athletes_list = $('#boat-info .team-members ul li');

    $athletes_list.eq(athlete).show().delay(2800).fadeOut();

    athlete = (athlete < ($athletes_list.length - 1)) ? athlete += 1 : 0;

    setTimeout('rotateAthletes()', 3000);

}

//initialize your variables outside the function 
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