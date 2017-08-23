
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


//functie die de profiel foto's van de athletes laat in en uit faden
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
