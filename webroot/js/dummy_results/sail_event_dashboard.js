/* DASHBOARD  :  handles all the info panels which are triggered by boats entering and rounding bouys
 *
 * init();
 * startRace();
 * bouyRounded();
 * toggleBouyInfo();
 * showBouyInfoPanels();
 * hideBouyInfoPanels();
 * startBouyTimer();
 * addBoatToBouy();
 * sortBoatOverviewList(); 
 * showPenalty();
 * showCrewResults();
 * showStartPanel();
 * showCrewResults();
 * hideStartPanel();
 * showFinishResults();
 */


var Dashboard = {
	curBouy 			: null, // name of bouy that currently is being rounded
	numPassedBouys 		: 0,
}

Dashboard.init = function(){    
	// cache DOM elements
	this.$bouyTimer = $('#bouy-counter');
	this.$bouyInfoPanel = $('#bouy-data');
	this.$boatOverviewPanel = $('#boat-overview');
	this.$boatListBouyPanel = $('#bouy-info');
	this.$penaltyPanel = $('#penalty');

	$('#loading-screen').delay(1000).fadeOut();
	setTimeout(Dashboard.hideStartPanel,6000);
	Dashboard.sortBoatOverviewList();
}

// triggerd by : boat.checkBouy when first boat crosses the startline
Dashboard.startRace = function(){						
	race_stopwatch = new Stopwatch('#race-time','race tijd'); // param = jquery element, tekst label
	Simulator.drawClearedStartline(); // clear the start
	$('#bouy-container #bouy-3').addClass('active'); // activate next bouy	
	Simulator.started = true;
}

// called by bouy rounded event
// This function shows the right dashboard panels when a boat rounds a bouy
Dashboard.bouyRounded = function(boat, bouy){	
	var ref = this;
	// bouyHistory checkt of de boten om evenveel boeien gaan
	if( boat.bouyHistory.length == this.numPassedBouys ){		
		if( boat.firstBoat ) Dashboard.startBouyTimer(bouy.name); // start the counter for this bouy		 

		Dashboard.addBoatToBouy(boat); // requires BouyTimer

		// last boat rounding this bouy deactivate the bouy after 4s
		if( bouy.boatsRounded.length === boats.length ){
			bouy_stopwatch.stop();
			Simulator.resetZoom(); // zoom out
    		bouy.targetNextBouy(); // set alleen de css class + dashed yellow border
			setTimeout(function(){Dashboard.hideBouyInfoPanels(ref)}, 5000); // hide all the info panels for this bouy 
		}
	}
}

// Show bouy info panel with dept, windspeed and flow
// called by click event
Dashboard.toggleBouyInfo = function(){
	var bouy_nr = $(this).clone().children().remove().end().text().trim();
	this.$bouyInfoPanel.find('.label').text('boei '+bouy_nr);
	this.$bouyInfoPanel.switchClass('fadeOutUp','fadeInDown').toggle();
	this.$bouyInfoPanel.find('.li').show();
}

// Triggered when first boat enters bouy
Dashboard.showBouyInfoPanels = function(boat, bouy){	
	var bouy_element = bouy.element;
	var name = 'boei ' + bouy.name;
	var boat_id = boat.id;
	var bouy_name = bouy.name;
	var bouy_element = bouy.element;
	
	this.$bouyTimer.hide();
	this.curBouy = bouy_name;
	this.numPassedBouys = boat.bouyHistory.length + 1; // + 1 want history wordt pas geupdate met bouy rounded event		

	// define dom elements
	var $list = this.$boatListBouyPanel.find('ul');
	var $veld = this.$boatListBouyPanel.find('.label');
	var $name = this.$boatListBouyPanel.find('.counter');
	
	$list.empty();	
	this.$boatListBouyPanel.switchClass('fadeOutUp','fadeInDown').show();
	this.$boatOverviewPanel.switchClass('fadeInLeft','fadeOutLeft').hide();
	this.$bouyInfoPanel.switchClass('fadeOutUp','fadeInDown').show();
	this.$bouyInfoPanel.find('.li').show();
		
	// update dom information
	$name.text(name);
	$veld.text(options.race_veld); // global variable from main js file
	this.$bouyInfoPanel.find('.label').text(name);
}


// Triggered by Last boat in dashboard.bouyRounded
// in timeout so this doesn't
Dashboard.hideBouyInfoPanels = function(ref){
	ref.$bouyInfoPanel.switchClass('fadeInDown','fadeOutUp');
	ref.$bouyInfoPanel.find('.li').hide();
	ref.$boatListBouyPanel.switchClass('fadeInDown','fadeOutUp');
	ref.$boatOverviewPanel.switchClass('fadeOutLeft','fadeInLeft').show();
	ref.$bouyTimer.hide();
}

// counter( rechts onder ) -> begint te tellen als de eerste boot de boei rond
Dashboard.startBouyTimer = function(bouy_name){
	// if object already exists reset old stopwatch 
	if(bouy_stopwatch != null) bouy_stopwatch.stop();	
	// start nieuwe counter
	bouy_stopwatch = new Stopwatch('#bouy-counter', 'boei '+bouy_name);	
	// tellertje rechts onder
	this.$bouyTimer.show();	
}


// add the html of boat to the existing list
Dashboard.addBoatToBouy = function(boat){
	//console.log('add boat '+boat.id+ ':'+boat.position);
	var crew = crews[boat.num];	
	var start_nr = boat.start_nr;
	var flag_image = image_base_url + crew.flag_image;
	
	// eerste boot krijgt de race tijd
	// de rest krijgt het verschil in seconden met de eerste boot
	if( boat.firstBoat == true ){
		var counter = race_stopwatch.time; // racetijd
	} else{
		var counter = '+'+bouy_stopwatch.time; // deze wordt gestart wanneer de eerste boot de roei rond
	}
	
	var li = '<li class="animated fadeInLeft">';		
	li += '<div class="position start-'+start_nr+'">'+start_nr+'</div>';
	li += '<div class="team-flag"><img src="'+ flag_image + '" /> </div>';
	li += '<div class="name">'+crew.name+'</div>';
	li += '<div class="counter">'+ counter +'</div>';		
	li += '</li>';	
	
	this.$boatListBouyPanel.find('ul').append(li);
}

// TODO exclude boats which are finished
Dashboard.sortBoatOverviewList = function(){

	setTimeout(function(){ 
		if( Simulator.running ) Dashboard.sortBoatOverviewList();
	}, 1000);    

	var $overview = this.$boatOverviewPanel;	
	var positions = [];
		
	$.each(boats,function(i){
		var obj = {
				id : boats[i].id,
				num : i,
				location : boats[i].location
			};		
		positions.push(obj);
	});
	// sort boats according to their position
	positions.sort(function(a,b){return a.location - b.location});	
	positions.reverse(); // boats with higest location in front
	
	// sort dom elements
	$.each(positions,function(i){
		var boat_id = positions[i].id;
		var $boat_item = $overview.find('li#info-boat-'+boat_id);
		var height = $boat_item.outerHeight() + 3;
		var margin_top = 30;
		var top = margin_top+ ( height * i );
		$boat_item.animate({top: top },100);
		var num = positions[i].num;
		boats[num].position = i;
	});
}

Dashboard.showPenalty = function(name){
	this.$penaltyPanel.find('.counter').text(name);
	this.$penaltyPanel.show().delay(5000).fadeOut();
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


Dashboard.hideStartPanel = function(){
	$('#start-panel').fadeOut();
	$('#overlay').fadeOut();	
}

Dashboard.showFinishResults = function(){
	$('#overlay').fadeIn().delay(15000).fadeOut();
	$('#finish-panel').show().delay(15000).fadeOut();	
}

