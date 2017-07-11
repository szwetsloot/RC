var browser_location = $(location).attr('href').replace('simulations/simulate-sail-event-dummy/7','');
var image_base_url = browser_location+'/img/sail_event_v2/teams/';

// define the 
var bouy_stopwatch; // stopwatch that runs when boat rounds a bouy
var race_stopwatch; // stopwatch which starts when screen is finished loading


$(function(){ 		
	// TODO fire this function when the actual race starts
	// vars = jquery element, tekst label
	race_stopwatch = new Stopwatch('#race-time','race tijd');
});

var Dashboard = {
	crew : null,
	crewmembers : [],
	athlete : 0,
	boatinfoTimeout: null,
}

// This function shows the right dashboard panels when a boat rounds a bouy
Dashboard.bouyRounded = function(boat, bouy_id){
	console.log(boat);
	
	var boat_id = boat.id;
	
	// if object already exists reset old stopwatch 
	if(bouy_stopwatch != null) bouy_stopwatch.stop(); 
	
	// tellertje rechts onder
	$('#bouy-counter').show();
	// start nieuwe counter
	bouy_stopwatch = new Stopwatch('#bouy-counter', 'boei '+bouy_id);
	
	// Show list ( top left ) met doorkomstentijden 
	Dashboard.showBouyInfo('boei '+bouy_id);
	
	// stop ophalen van data van vorige boot
	clearTimeout(Dashboard.boatinfoTimeout);
	// brede balk onderaan het scherm
	Dashboard.showCrewInfo(boat_id);
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
	var $medal = $club_info.find('#medal')
	
	// check if variables are set in database -> otherwise set 0
	var roll_angle = tracker.roll_angle == null ? 0 : tracker.roll_angle;
	var ranking = crew.ranking == null ? 0 : crew.ranking;
	var points = crew.points == null ? 0 : crew.points;
	var target_bouy = boat.distance_bouy == null? 'unknown' : boat.distance_bouy+'m';
	var position = boat.position; // positie race
	
	if(position < 3){ // tijdelijk met position --> moet worden vervangen met ranking
		$medal.removeClass();
		$medal.addClass('medal-'+position); // tijdelijk met position --> moet worden vervangen met ranking
		$medal.show();
	} else{
		$medal.hide();
	}
	
	// update information
	$position.text(position);
	$speed.text('Snelheid: '+ boat_speed +'Kn');
	$boat_roll.html('helling: '+roll_angle+'&deg;');
	$boat_location.text( Math.round(tracker.east)+'m, '+Math.round(tracker.north)+'m' );
	$boat_target.text( 'Volgende boei: '+target_bouy );
	$club_competition.text('positie:'+ ranking +', '+ points +' punten');
	
	$club_name.text(crew.name);
	$club_flag.attr('src', image_base_url+crew.flag_image)
	
	$panel.show();
	// start rotating the atletes
	Dashboard.rotateAthletes();
	
	// repeat function every 500 ms
	this.boatinfoTimeout = setTimeout(function(){ Dashboard.showCrewInfo(crew_id); },500);
}



// Het panel met een lijst met doorkomsttijden van een boei
Dashboard.showBouyInfo = function(name){
	
	// define dom elements
	var $panel = $('#bouy-info');
	var $list = $panel.find('ul');
	var $veld = $panel.find('.label');
	var $name = $panel.find('.counter');
	$list.empty();
	
	$panel.show();
	
	// update dom information
	$name.text(name);
	$veld.text(race_veld); // global variable from main js file
	
	// TO DO 
	// simulate popups --> needs to be called by the bouy object
	Dashboard.addBoatToBouy(0,1);	
	
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
		var counter = '+'+bouy_stopwatch.time; // deze wordt gestart wanneer de eerste boot de roei rond
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
function Stopwatch(obj, name){
		this.obj = obj;
		this.name = name;
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
    $(this.obj).find('.label').text(this.name);
        
    // call the seconds counter after displaying the stop watch and increment seconds by +1 to keep it counting
    this.seconds++;

    var self = this;
    
    // call the setTimeout( ) to keep the stop watch alive! 
    this.clearTime = setTimeout(function(){self.start();}, 1000);
}

Stopwatch.prototype.stop = function(){
	clearTimeout(this.clearTime);
}
