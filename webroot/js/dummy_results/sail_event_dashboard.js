var browser_location = $(location).attr('href').replace('simulations/dummy-results/','');
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

Dashboard.synchDashboard = function(){
	setTimeout(function(){ 
		if( simulation_running ) Dashboard.synchDashboard();
	}, 500);    

    Dashboard.sortBoats();
    Progress.moveBoats();       
}

Dashboard.startSimulation = function(){	
	$('#loading-screen').delay(1000).fadeOut();
	setTimeout(Dashboard.hideStartPanel,6000);
	Dashboard.synchDashboard();
	// TODO fire this function when the actual race starts
	setTimeout(Dashboard.startRace,1000);
}

Dashboard.startRace = function(){						
	race_stopwatch = new Stopwatch('#race-time','race tijd'); // param = jquery element, tekst label
	drawClearedStartline(); // clear the start
	// show the fake/static results after 2 minutes
	$('#bouy-container #bouy-3').addClass('active');
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
	// check of alle boten om dezelfde boei gaan
	// bouyHistory checkt of de boten om evenveel boeien gaan
	// voor als boten een boei achterlopen
	if( this.showBouy == bouy.name && boat.bouyHistory.length == this.numPassedBouys ){		
		Dashboard.addBoatToBouy(boat);	
		// last boat rounding this bouy deactivate the bouy after 4s
		if( boat.position === boats.length - 1 && boat.firstBoat != true ){
			bouy_stopwatch.stop();
			setTimeout(Dashboard.deactivateBouy, 2000);
		}
	}
}

// Show bouy info panel with dept, windspeed and flow
// called by click event
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
	var bouy_name = bouy.name;
	var bouy_element = bouy.element;
	
	$('#bouy-counter').hide();
	this.showBouy = bouy_name;
	this.numPassedBouys = boat.bouyHistory.length + 1; // + 1 want history wordt pas geupdate met bouy rounded event		

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
		
	// update dom information
	$name.text(name);
	$veld.text(race_veld); // global variable from main js file
	$data_panel.find('.label').text(name);
}


// 
Dashboard.deactivateBouy = function(){
	$('#bouy-data').switchClass('fadeInDown','fadeOutUp');
	$('#bouy-data').find('.li').hide();
	$('#boat-overview').switchClass('fadeOutLeft','fadeInLeft').show();
	$('#bouy-info').switchClass('fadeInDown','fadeOutUp');
	$('#bouy-counter').hide();
}

// counter( rechts onder ) -> begint te tellen als de eerste boot de boei rond
Dashboard.startBouyCounter = function(bouy_name){
	// if object already exists reset old stopwatch 
	if(bouy_stopwatch != null) bouy_stopwatch.stop();	
	// start nieuwe counter
	bouy_stopwatch = new Stopwatch('#bouy-counter', 'boei '+bouy_name);	
	// tellertje rechts onder
	$('#bouy-counter').show();	
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
	
	$('#bouy-info ul').append(li);
}

Dashboard.sortBoats = function(){	
	var $overview = $('#boat-overview');	
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
		
	// boats with higest location in front
	positions.reverse();
	
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

// zoom towards the bouy - units in pixels
Dashboard.zoomBouy = function(bouy_element){	
	$bouy = bouy_element;
    var screenWidth = $('#simulator').width();
    var screenHeight = $('#simulator').height(); 
    var bouy_pos = $bouy.position();   
    var d_x = ( screenWidth / 2 ) - bouy_pos.left + 100;
    var d_y = ( screenHeight / 2 ) - bouy_pos.top;    
    var scale = 1.5; // TODO define dynamic
    
    // translation should be multiplied with the scale factor
    d_x *= scale;
    d_y *= scale;
    
    // The elements have the css class ease-transform which forces them to animate css transformation
    $('#simulator').css('transform', 'translate('+d_x+'px,'+d_y+'px) scale('+scale+')');
}

Dashboard.resetZoom = function(){		
	$('#simulator').css('transform', 'translate(0px,0px) scale(1)');
}

Dashboard.showPenalty = function(name){
	$penalty = $('#penalty');
	$penalty.find('.counter').text(name);
	$penalty.show().delay(5000).fadeOut();
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
