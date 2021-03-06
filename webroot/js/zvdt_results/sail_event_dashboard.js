var browser_location = $(location).attr('href').replace('simulations/zvdt-results/10','');
var image_base_url = browser_location+'/img/sail_event_v2/teams/';

// define the global variables
var bouy_stopwatch; // stopwatch that runs when boat rounds a bouy
var race_stopwatch; // stopwatch which starts when screen is finished loading

var Dashboard = {
	crew : null,
	showBoats : [],
	athlete : 0,
	boatinfoTimeout: null,
	athleteTimeout : null,
	animatingAthletes : false,
	showBouy : null,
	numPassedBouys : 0,
}

Dashboard.startSimulation = function(){	
	Dashboard.showLiveStream();
	setTimeout(Dashboard.hideStartPanel,6000);
	
	// TODO fire this function when the actual race starts
	setTimeout(Dashboard.startRace,10000);

	Dashboard.sortBoats();
}

Dashboard.startRace = function(){						
	race_stopwatch = new Stopwatch('#race-time','race tijd'); // param = jquery element, tekst label
	drawClearedStartline(); // clear the start
	// show the fake/static results after 2 minutes
	if( show_finish ) setTimeout(Dashboard.showFinishResults,2*60*1000);
}

Dashboard.hideStartPanel = function(){
	$('#start-panel').fadeOut();
	$('#overlay').fadeOut();	
}

Dashboard.showFinishResults = function(){
	$('#overlay').fadeIn().delay(15000).fadeOut();
	$('#finish-panel').show().delay(15000).fadeOut();	
}

// called by bouy rounded event
// This function shows the right dashboard panels when a boat rounds a bouy
Dashboard.bouyRounded = function(boat, bouy){
	// als de eerste boat klaar is start stopwatch
	if( boat.position == 1 ){	
		Dashboard.startBouyCounter(bouy.name);		 
		setTimeout(Dashboard.resetZoom, 7000); // zoom weer uit 
		
		setTimeout(function(){
			// show random penalty
			// geef random boat een penalty voor de leuk
			var num = Math.floor((Math.random() * ( crews.length - 1 ) ) );
			Dashboard.showPenalty(crews[num].shortname);
		},5000)
	}
	
	// check of de volgende boten ook om dezelfde boei gaan
	// bouyHistory checkt of de boten om evenveel boeien gaan
	// voor als boten een boei achterlopen
	if( this.showBouy == bouy.name && boat.bouyHistory.length == this.numPassedBouys ){		

		Dashboard.addBoatToBouy(boat.id,boat.position);	
		
		// positie 1 wordt al eerder weergeven tijdens het activeren van de boei
		if( boat.position != 1 ){			
			// voeg boat id toe aan de animatie query
			this.showBoats.push(boat.id);			
			// if not animating initiate new rotation of athletes 
			if( this.animatingAthletes == false ) Dashboard.showCrewInfo(boat.id);					
		}
		
		// last boat rounding this bouy deactivate the bouy after 4s
		if( boat.position === boats.length ){
			bouy_stopwatch.stop();
			setTimeout(function(){
				Dashboard.deactivateBouy();
			},4000)
		}
	}
}

// Het horizontale panel op de onderrand van het scherm
Dashboard.showCrewInfo = function(crew_id){
	// reset athlete rotator
	this.athlete = 0;
	
	//start retrieving the new data
	Dashboard.updateCrewInfo(crew_id); // updates the info every 500ms 	
	Dashboard.rotateAthletes(); // show de atheletes van de crew
	
	var $panel = $('#boat-info');
	var $wave_bg = $('#wave-bg')
	
	$panel.switchClass('fadeOutDown','fadeInUp');
	$wave_bg.switchClass('fadeOutDown','fadeInUp');	
	$panel.show();
	$wave_bg.show();	
}

//deze functie update the informatie elke 500 ms
Dashboard.updateCrewInfo = function(crew_id){
	
	// stop ophalen van data van vorige boot
	clearTimeout(Dashboard.boatinfoTimeout);
	
	var crew;
	var boat;
	// select team
	for( i = 0; i < crews.length; i++ ){
		if(crews[i].id == crew_id ) crew = crews[i];
	}	
	
	for( i = 0; i < boats.length; i++ ){
		if(boats[i].id == crew_id ) boat = boats[i];
	}	
	
	var tracker = crew.tracker;
	var boat_speed = Math.round(convertSpeedtoKN(boat.speed) * 10 + ( Math.random() * 12 ) ) / 10;
	
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
	var $medal = $club_info.find('.medal')
	
	// check if variables are set in database -> otherwise set 0
	var roll_angle = tracker.roll_angle == null ? 0 : tracker.roll_angle;
	var ranking = crew.ranking == null ? 0 : crew.ranking;
	var points = crew.points == null ? 0 : crew.points;
	var target_bouy = boat.distance_bouy == null? 'unknown' : boat.distance_bouy+'m';
	var position = boat.position; // positie race --> positie en start nr wordt nu nog door elkaar gehaald
	
	if( ranking != 0 && ranking < 3 ){ 
		$medal.removeClass();
		$medal.addClass('medal-'+ranking); 
		$medal.show();
	} else{
		$medal.hide();
	}
	
	$position.removeClass();
	$position.addClass('position').addClass('start-'+crew.start_nr);
	
	// update information
	$position.text(crew.start_nr);
	$speed.text('Snelheid: '+ boat_speed +'Kn');
	$boat_roll.html('helling: '+roll_angle+'&deg;');
	$boat_location.text( Math.round(tracker.east)+'m, '+Math.round(tracker.north)+'m' );
	$boat_target.text( 'Volgende boei: '+target_bouy );
	$club_competition.text('positie:'+ ranking +', '+ points +' punten');
	
	$club_name.text(crew.name);
	$club_flag.attr('src', image_base_url+crew.flag_image)

	// repeat function every 500 ms
	this.boatinfoTimeout = setTimeout(function(){ Dashboard.updateCrewInfo(crew_id); },500);
}

Dashboard.hideCrewInfo = function(){
	$('#boat-info').switchClass('fadeInUp','fadeOutDown');
	$('#wave-bg').switchClass('fadeInUp','fadeOutDown');
	clearTimeout(Dashboard.boatinfoTimeout);
}

Dashboard.resetCrewInfo = function(crew_id){
	var crew_id = crew_id;	
	Dashboard.hideCrewInfo();
	setTimeout(function(){
		Dashboard.showCrewInfo(crew_id);
	},5000);	
}

Dashboard.toggleBouyData = function(){
	var bouy_nr = $(this).clone().children().remove().end().text().trim();
	var name = 'boei '+bouy_nr;
	var $data_panel = $('#bouy-data');
	$data_panel.find('.label').text(name);
	$data_panel.switchClass('fadeOutUp','fadeInDown').toggle();
	$data_panel.find('.li').show();
	
}

// called by bouy entered event
Dashboard.activateBouy = function(boat, bouy){
	
	var bouy_element = bouy.element;
	var name = 'boei ' + bouy.name;
	var boat_id = boat.id;
	var bouy_name = bouy.order;
	var bouy_element = bouy.element;
		
	// if this is the first boat restart the bouy info panel
	if( boat.position == 1 ){	
		$('#bouy-counter').hide();
		this.showBouy = bouy_name;
		this.numPassedBouys = boat.bouyHistory.length + 1; // + 1 want history wordt pas geupdate met bouy rounded event		
		Dashboard.zoomBouy(bouy_element);
		//this.showBoats.push(boat.id);
		//if( this.animatingAthletes == false ) Dashboard.showCrewInfo(boat.id);
	}
	
	// define dom elements
	var $data_panel = $('#bouy-data');
	var $bouy_info = $('#bouy-info');
	var $boat_overview = $('#boat-overview');
	var $list = $bouy_info.find('ul');
	var $veld = $bouy_info.find('.label');
	var $name = $bouy_info.find('.counter');
	
	$list.empty();	
	$bouy_info.switchClass('fadeOutUp','fadeInDown').show();
	$boat_overview.switchClass('fadeInLeft','fadeOutLeft').hide();
	$data_panel.switchClass('fadeOutUp','fadeInDown').show();
	$data_panel.find('.li').show();
	
	$('.bouy').removeClass('active');
	bouy_element.addClass('active');
	
	// update dom information
	$name.text(name);
	$veld.text(race_veld); // global variable from main js file
	$data_panel.find('.label').text(name);
}

Dashboard.deactivateBouy = function(){
	$('#bouy-data').switchClass('fadeInDown','fadeOutUp');
	$('#bouy-data').find('.li').hide();
	$('#boat-overview').switchClass('fadeOutLeft','fadeInLeft').show();
	$('#bouy-info').switchClass('fadeInDown','fadeOutUp');
	$('#bouy-counter').hide();
	$('.bouy').removeClass('active');
	Dashboard.showLiveStream();
}

// counter rechts onder
Dashboard.startBouyCounter = function(bouy_name){
	// if object already exists reset old stopwatch 
	if(bouy_stopwatch != null) bouy_stopwatch.stop(); 
	
	// start nieuwe counter
	bouy_stopwatch = new Stopwatch('#bouy-counter', 'boei '+bouy_name);
	
	// tellertje rechts onder
	$('#bouy-counter').show();	
}

// add the html of boat to the existing list
Dashboard.addBoatToBouy = function(boat_id, position){
	
	var crew = crews[boat_id - 1];	
	var start_nr = crew.start_nr;
	var flag_image = image_base_url + crew.flag_image;
	
	if(position == 1){
		var counter = race_stopwatch.time;
	} else{
		var counter = '+'+bouy_stopwatch.time; // deze wordt gestart wanneer de eerste boot de roei rond
	}
	
	var li = '<li class="animated fadeInLeft">';		
	li += '<div class="position start-'+start_nr+'">'+start_nr+'</div>';
	li += '<div class="team-flag"><img src="'+ flag_image + '" /> </div>';
	li += '<div class="name">'+crew.name+'</div>';
	li += '<div class="counter">'+ counter +'</div>';		
	li += '</li>';	
	
	$('#bouy-info ul').append(li);
}

Dashboard.sortBoats = function(){	
	var $overview = $('#boat-overview');	
	var positions = [];
	
	$.each(boats,function(i){
		var obj = {
				id : boats[i].id,
				location : boats[i].location
			};		
		positions.push(obj);
	});
	// sort boats according to their position
	positions.sort(function(a,b){return a.location - b.location});
		
	// boats with higest location in front
	positions.reverse();
	
	//if( positions[0].location == positions[1].location == positions[2].location ) positions.reverse();
	
	// sort dom elements
	$.each(positions,function(i){
		var boat_id = positions[i].id;
		var $boat_item = $overview.find('li#info-boat-'+boat_id);
		var height = $boat_item.outerHeight() + 3;
		var margin_top = 30;
		var top = margin_top+ ( height * i );
		$boat_item.animate({top: top },100);
	});
}

// zoom towards the bouy - units in pixels
Dashboard.zoomBouy = function(bouy_element){	
	// translate everything so the bouy is positioned in the center of the screen
	// scale everything
	var zoom_selector = '#height-line-container'; // add zoom class??? // translate-zoom
	var translate_selector = '#boat-container, #bouy-container, #trail-container';
	var $waves = $('#waves-container');
	var rotation = getRotationDegrees($waves);
	
	$(zoom_selector).addClass('ease-transform');
	$(translate_selector).addClass('ease-transform');
	$waves.addClass('ease-transform');
	
    // Get the screen size in pixel
    var screenWidth = $('html').width();
    var screenHeight = $('html').height();
    
    $bouy = bouy_element;
    var bouy_pos = $bouy.position();
    
    var d_x = ( screenWidth / 2 ) - bouy_pos.left;
    var d_y = ( screenHeight / 2 ) - bouy_pos.top;
    
    var scale = 1.5; // TODO define dynamic
    
    // translation should be multiplied with the scale factor
    d_x *= scale;
    d_y *= scale;
    
    // The elements have the css class ease-transform which forces them to animate transformation
    $(translate_selector).css('transform', 'translate('+d_x+'px,'+d_y+'px) scale('+scale+')');
    $(zoom_selector).css('transform', 'scale('+scale+')');
    $waves.css('transform', 'scale('+ (scale*2) +') rotate('+rotation+'deg)');
}

Dashboard.resetZoom = function(){
	var zoom_selector = '#height-line-container'; // add zoom class??? // translate-zoom
	var translate_selector = '#boat-container, #bouy-container, #trail-container';
	var $waves = $('#waves-container');
	var rotation = getRotationDegrees($waves);
		
	$(translate_selector).css('transform', 'translate(0px,0px) scale(1)');
    $(zoom_selector).css('transform', 'scale(1)');
    $waves.css('transform', 'scale(1) rotate('+rotation+'deg)');
}

// functie die de profiel foto's van de athletes laat in en uit faden
Dashboard.rotateAthletes = function() {
	var ref = this;
	this.animatingAthletes = true;
	clearTimeout(Dashboard.athleteTimeout);
	
    $athletes_list = $('#boat-info .team-members ul li');    
    $athletes_list.fadeOut(); // dit is om zeker te weten dat de vorige wordt gehide
    $athletes_list.eq(ref.athlete).show().delay(3000).fadeOut(0, function(){ 
    	
    	// Als dit de laatste athlete is
    	if( ref.athlete == ($athletes_list.length - 1) ){
        	ref.showBoats.shift(); // remove huidige crew van de queue
        	
        	// reset values
        	ref.athlete = 0;
        	// als er nog teams in de wachtrij staan restart bouy info
        	if( ref.showBoats.length >= 1){
        		Dashboard.resetCrewInfo( ref.showBoats[0] )
        	} else{ // klaar sluit alles af
            	ref.animatingAthletes = false;
        		//setTimeout('Dashboard.hideCrewInfo()',4000) // hide panel when all athletes have been shown
            	Dashboard.hideCrewInfo();
        	}        		
    	
    	} else{ // er zijn meer atheles dus run deze fuctie nog een keer	
    		
    		ref.athlete += 1;
            //Dashboard.athleteTimeout = setTimeout('Dashboard.rotateAthletes()', 3000);
    		Dashboard.rotateAthletes();
    	}
    });
}

Dashboard.showPenalty = function(name){
	$penalty = $('#penalty');
	$penalty.find('.counter').text(name);
	$penalty.show().delay(5000).fadeOut();
}

Dashboard.showLiveStream = function(){		
	if(show_livestream == true) $('#live-stream').fadeIn().delay(8000).fadeOut();	
}

Dashboard.showCrewResults = function(){
	if( !$(this).hasClass('active') ){
		$(this).addClass('active');
		$('#finish-panel .crew:not(".active")').hide();
	} else{
		$(this).hide();
		$('#finish-panel .crew').removeClass('active');
		$('#finish-panel .crew').show();
	}
}

// get the rotation degree from the css
function getRotationDegrees(obj) {
    var matrix = obj.css("transform");
    if(matrix !== 'none') {
        var values = matrix.split('(')[1].split(')')[0].split(',');
        var a = values[0];
        var b = values[1];
        var angle = Math.round(Math.atan2(b, a) * (180/Math.PI));
    } else { var angle = 0; }
    return (angle < 0) ? angle + 360 : angle;
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

// Stopwatch
Stopwatch.prototype.start = function(){
	
	$(this.obj).show();

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
