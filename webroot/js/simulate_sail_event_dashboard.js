var browser_location = $(location).attr('href').replace('simulations/simulate-sail-event-dummy/7','');
var image_base_url = browser_location+'/img/sail_event_v2/teams/';
	
var bouy_stopwatch;
var race_stopwatch;


$(function () { 		

	Dashboard.rotateAthletes();
	
	race_stopwatch = new Stopwatch('#race-time');
	
	
	// TODO replace with event trigger when boat rounds a bouy
	$('.boat-icon').on('click', function(){
		$('#bouy-counter').show();
		
		// stop ophalen van data van vorige boot
		clearTimeout(Dashboard.boatinfoTimeout);
		
		// if object already exists reset old stopwatch 
		if(bouy_stopwatch != null) bouy_stopwatch.stop(); 
		
		// start nieuwe counter
		bouy_stopwatch = new Stopwatch('#bouy-counter');
		
		Dashboard.showBouyInfo();
		
		var boat_id = $(this).parent().attr('id').replace('boat-','');
		Dashboard.showCrewInfo(boat_id);
	});
	
	
});

var Dashboard = {
	crew : null,
	crewmembers : [],
	athlete : 0,
	boatinfoTimeout: null,
}

// Het horizontale panel op de onderrand van het scherm
Dashboard.showCrewInfo = function(crew_id){
	// select team
	// TODO crew id moet worden opgezocht in de array
	
	var crew = crews[crew_id - 1];
	var tracker = crew.tracker;
	var boat = boats[crew_id - 1];
	var boat_speed = Math.round(convertSpeedtoKN(boat.speed) * 10) / 10;
	
	// define dom elements
	var $panel = $('#boat-info');
	var $position = $panel.find('#boat-position');
	var $speed = $panel.find('#boat-speed');
	var $boat_roll = $panel.find('#boat-roll');
	var $boat_location = $panel.find('#boat-location');
	var $boat_target = $panel.find('#boat-target-bouy');
	
	var $club_info = $panel.find('.team-data');
	var $club_name = $club_info.find('.club-name');
	var $club_flag = $club_info.find('img');
	var $club_competition = $club_info.find('.competition');
	
	if( tracker.roll_angle == 0 )
		tracker.roll_angle = 0;
	
	// update information
	$speed.text('Snelheid: '+ boat_speed +'Kn');
	$boat_roll.html('helling: '+tracker.roll_angle+'&deg;');
	$boat_location.text( Math.round(tracker.east)+'m, '+Math.round(tracker.north)+'m' );
	$boat_target.text( 'Volgende boei '+boat.distance_bouy+'m' );
	$club_competition.text('positie:'+crew.ranking+', '+crew.points+' punten') // werkt plas als dit in de db staat
	
	$club_name.text(crew.name);
	$club_flag.attr('src', image_base_url+crew.flag_image)
	
	// repeat function every 500 ms
	this.boatinfoTimeout = setTimeout(function(){ Dashboard.showCrewInfo(crew_id); },500);
}



// Het panel met een lijst met doorkomsttijden van een boei
Dashboard.showBouyInfo = function(){
	
	// define dom elements
	var $panel = $('#bouy-info');
	var $list = $panel.find('ul');
	
	$list.empty();
			
	// simulate popups
	setTimeout(function(){
		Dashboard.addBoatToBouy(0,1);	
		}, 1000);
	
	setTimeout(function(){
		Dashboard.addBoatToBouy(1,2);	
		}, 4000);
	
	setTimeout(function(){
		Dashboard.addBoatToBouy(2,3);	
		}, 6000);
	
	
}


Dashboard.addBoatToBouy = function(boat_id, position){
	
	var crew = crews[boat_id];	
	
	var flag_image = image_base_url + crew.flag_image;
	
	if(position == 1){
		var counter = race_stopwatch.time;
	} else{
		var counter = '+'+bouy_stopwatch.time;
	}
	
	var li = '<li class="animated fadeInLeft">';		
	li += '<div class="position">'+position+'</div>';
	li += '<div class="team-flag"><img src="'+ flag_image + '" /> </div>';
	li += '<div class="name">'+crew.name+'</div>';
	li += '<div class="counter">'+ counter +'</div>';		
	li += '</li>';	
	
	$('#bouy-info ul').append(li);
}





// functie die de profiel foto's van de athletes laat in en uit faden
Dashboard.rotateAthletes = function() {
    $athletes_list = $('#boat-info .team-members ul li');    
    $athletes_list.eq(this.athlete).show().delay(2800).fadeOut();
    this.athlete = (this.athlete < ($athletes_list.length - 1)) ? this.athlete += 1 : 0;
    setTimeout('Dashboard.rotateAthletes()', 3000);
}

// Stopwatch
function Stopwatch(obj){
		this.obj = obj;
		this.count = 0;
		this.clearTime = null;
		this.clearState = null;
		this.seconds = 0;
		this.minutes = 0;
		this.hours = 0;
		this.secs = null;
		this.mins = null; 
		this.gethours = null;
		this.time = null;
		
		this.start();
}



Stopwatch.prototype.start = function(){
	// stop het bewegen van de bootjes na een tijd gedefineerd by end animation
    if (this.minutes > end_animation) run = 0;

    //check if seconds is equal to 60 and add a +1 to minutes, and set seconds to 0 	
    if (this.seconds === 60) {
    	this.seconds = 0;
    	this.minutes += 1;
    }
    // you use the javascript tenary operator to format how the minutes should look and add
    // 0 to minutes if less than 10 
    this.mins = (this.minutes < 10) ? ('0' + this.minutes + ':') : (this.minutes + ':');

    // check if minutes is equal to 60 and add  a +1 to hours set minutes to 0 
    if (this.minutes === 60) {
    	this.minutes = 0;
    	this.hours = this.hours + 1;
    }

    /* you use the javascript tenary operator to format how the hours should look and add 0 to hours if less than 10 */
    this.gethours = (this.hours < 10) ? ('0' + this.hours + ':') : (this.hours + ':');
    //secs = ( seconds < 10 ) ? ( '0' + seconds ) : ( seconds ); 
    this.secs = this.seconds;

    this.time = this.mins + this.secs;
    
    // display the stopwatch 
    $(this.obj).find('.counter').text(this.time);
   // $('#bouy-counter .counter').text('+' + this.mins + this.secs);
        
    // call the seconds counter after displaying the stop watch and increment seconds by +1 to keep it counting
    this.seconds++;

    var self = this;
    
    // call the setTimeout( ) to keep the stop watch alive! 
    this.clearTime = setTimeout(function(){self.start();}, 1000);
}

Stopwatch.prototype.stop = function(){
	clearTimeout(this.clearTime);
}
