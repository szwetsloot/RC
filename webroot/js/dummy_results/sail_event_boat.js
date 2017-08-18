/*
 * BOAT METHODS
 * moveToPoint
 * updateData
 * updatePosition
 * setTeam
 * checkBouys
 * averageRotation
 * calcDistanceBouy
 * calcPositionBoat
 * getRotationDegrees
 * 
 */

// the boat object 
function Boat(currentTime) {
    this.team = 0;
    this.north = 0;
    this.east = 0;
    this.speed = 0;
    this.direction = 170;
    this.element = '';
    this.bouyHistory = [];
    this.lastUpdate = currentTime;
    this.num = null; // nr array
    this.boatIcon = '';
    this.running = true;
    this.target = {
        'north': 0,
        'east': 0,
        'top': 0,
        'left': 0
    };
    this.drawn = {
        'north': 0,
        'east': 0,
        'top': 0,
        'left': 0,
        'direction': 0
    };
    this.log = [];
    this.nextBouy = 0;
    this.bouyStatus = null;
    // these variables are used to navigate the dummy data
    this.currentDummyPacket = null;
}
;
// extend the boat object
Boat.prototype = {
    'moveToPoint' : function( reset = null ){
    	var boat = this;
    	var $boat = this.element;
        var $boat_icon = $boat.find('.boat-icon');
    	// if this is the first time the function is ran
    	if( this.currentDummyPacket == null){
    		var data = tracker_data[0];
    		$boat.css({'top':data.top, 'left':data.left});
    		this.currentDummyPacket = 0;
    		simulation_running = true;
    	} 
    	if( reset != null ){
    		// TODO reset course progress sidebar
    		console.log('reset to '+reset);
    		var data = tracker_data[reset];
    		this.currentDummyPacket = reset;
    		$('#trail-container').empty();
    		$boat.css({'top':data.top, 'left':data.left});
    		simulation_running = true;
    	}
    	
    	// check if there is any data left
    	if( this.currentDummyPacket == tracker_data.length - 1 ){ 
    		if( options.run_once == true ){
    			this.running = false; 
        		return false;
    		} else{
    			// repeat simulation
        		this.currentDummyPacket = 0;
    		}
    	};
    	 
    	/* CHECKS FININISHED GET THE DATA */
    	var data_cur = tracker_data[ this.currentDummyPacket ];
    	var data_target = tracker_data[ this.currentDummyPacket + 1 ];    	
    	
    	// boat begint met ronden boei
    	if( data_cur.status != null ){ 
    		boat.bouyStatus = data_cur.status;
    		this.checkBouys(); 
    	}
  
    	boat.north = data_cur.north;
    	boat.east = data_cur.east;
    	
    	// calc distance current bouy to next
    	var dist = norm2Dist( data_cur, data_target );

    	var duration = ( ( dist / this.speed ) * 1000 ) / simulation_speed; 

    	// rotate boat icon   	
    	var dir_icon = 180 - toDegrees(getAngle(data_cur, data_target) ) + toDegrees(screenUTMRange.rotation);    	
    	var angle = toDegrees( getAngle(data_cur, data_target) );    	
    	this.direction = ( 270 - angle ) % 360 + toDegrees(screenUTMRange.rotation);    
    		
    	
    	
    	$boat_icon.css('transform', 'rotate(' + dir_icon + 'deg)');
    	    	
    	$boat.animate({
            left: data_target.left,
            top: data_target.top
        }, duration, 'linear', function() {
        	boat.currentDummyPacket += 1;
        	boat.north = data_target.north;
        	boat.east = data_target.east;
        	boat.top =  data_target.top;
            boat.left =  data_target.left;
            // run after the animation this function again for the next bouy
        	boat.moveToPoint();
        });   
    	

        boat.lastUpdate = millis();

    },
    'syncObjectData' : function(){

    	//if(this.running == false) return false;
    	var boat = this;
    
    	setTimeout(function(){ 
    		if(simulation_running) boat.syncObjectData();
    	}, 500);
    	    	
    	var data_cur = tracker_data[ this.currentDummyPacket ];
    	var data_target = tracker_data[ this.currentDummyPacket + 1 ];

    
    	var noise_dist = 2; // meters
    	
    	var noise_north = noise_dist * ( Math.random() * 2 - 1 );
    	var noise_east = noise_dist * ( Math.random() * 2 - 1 );
    	
    	// Calculate where the drawn boat is
        boat.drawn.north = this.north + noise_north + ( Math.cos(toRadians(boat.direction)) * boat.speed * ((millis() - boat.lastUpdate) / 1000) );
        boat.drawn.east = this.east + noise_east + ( Math.sin(toRadians(boat.direction)) * boat.speed * ((millis() - boat.lastUpdate) / 1000) );
        
        $element = $('#check');
        
        var target = convertToPixels($element,boat.drawn.east, boat.drawn.north);
        boat.left = target.left; 
        boat.top = target.top
       
        var log = {
        		north : boat.drawn.north,
        		east : boat.drawn.east,
        		top : boat.top,
        		left: boat.left,
        		status : boat.bouyStatus
        	}       
        boat.log.push(log);
        
        // rood vierkantje om te debuggen
        if( boat.id == 7 && debug == true ) $element.css({'left':target.left,'top':target.top});
       
        // get next bouy        
        $.each(bouys,function(i){
        	if(bouys[i].order == boat.nextBouy){
        		 boat.distance_bouy = Math.round( norm2Dist( boat.drawn, bouys[i] ) );
        		 return false;
        	}
        });
   
        boat.calcPositionBoat();    
        boat.updateData();
        boat.drawTrail();
        Dashboard.sortBoats();
        //Progress.moveBoats();    
    	
    },
    // THIS SHOULD BE THE ONLY FUNCTION THAT UPDATES ALL THE TEXT IN THE DOM ELEMENTS!!
    'updateData': function () {
    	if(this.running == false) return false;
        $overview = $('#boat-overview');
        $boat = $overview.find('#info-boat-'+this.id);
        $info = $boat.find('.counter'); 

        distance_bouy = (this.distance_bouy == null) ? 0 : this.distance_bouy;
        var knots = Math.round( ( convertSpeedtoKN(this.speed) + Math.random() * 1.2  ) * 10 ) / 10;
        this.element.find('.extra p').html(knots + 'kN ');
        $info.html(knots + 'kN / ' + Math.round(this.direction) + '&deg; / ' + distance_bouy + 'm');
    },
    /* 
     * By : Boat.moveToPoint();
     */
    'checkBouys': function () {  
    		if(this.running == false) return false;      
    		var boat = this;
    		var i = boat.numNextBouy; // bouy that is being rounded
    		
           // if( norm2Dist(boat,bouys[i]) > options.bouy_radius ) return false;
            	
            // status 1 entered
            if( boat.bouyStatus == 1){ 
            	bouys[i].boatEntered(this); 
            }
                                        
            // status 2 rounded
            if( boat.bouyStatus == 2 ){             
            	// look for next bouy
            	for (var j = 0; j < bouys.length; j++) {
                	if (bouys[j].prev == bouys[i].id) { 
                        	boat.nextBouy = bouys[j].order;
                        	boat.numNextBouy = j; // store the array index in the boat object
                        	boat.numPrevBouy = i;
                            break;
                	}
            	}

                boat.bouyHistory.push(bouys[i].name);
            	// Done rounding, send a message to the bouy
                bouys[boat.numPrevBouy].rounded(boat);
                boat.bouyStatus = null; 
            }
    }
};

// berekent normaal positie van de boat 
// by: syncObjectData
Boat.prototype.calcPositionBoat = function () {
	var boat = this;
	
    var prev_bouy = bouys[boat.numPrevBouy];
    var next_bouy = bouys[boat.numNextBouy];
    
    var bouys_dx = prev_bouy.east - next_bouy.east;
    var bouys_dy = prev_bouy.north - next_bouy.north;
    var boat_dx = this.drawn.east - next_bouy.east;
    var boat_dy = this.drawn.north - next_bouy.north;

    // projectie positie op normaal lijn
    var ab = (bouys_dx * boat_dx) + (bouys_dy * boat_dy);
    var afstand_boeien = Math.sqrt( ( Math.pow(bouys_dx, 2) + Math.pow(bouys_dy, 2) ) );
    var afstand_tot_boei = ab / Math.pow(afstand_boeien, 2);
    
    // als je in de bouys zit
    if( boat.bouyStatus == 1 ){
    	afstand_tot_boei = 0.001; // anders denkt de  Progress.moveBoats dat deze value 0 is
    }
    
    var rounded_bouys = this.bouyHistory.length;
    
    // tel elke geronde boei meer als 1
    this.location = rounded_bouys + ( 1 - afstand_tot_boei );   
};

Boat.prototype.drawTrail = function() {
	
	var x = ( this.left / $('#trail-container').width() ) * 100 + '%';
	var y = ( this.top / $('#trail-container').height() ) * 100 + '%';
	
	if( this.num_boat != 0 && options.show_all_trails == false ) return false;
	
	// drop breadcrumbs
	var breadcrumb = document.createElement('div');
	$(breadcrumb).addClass('start-'+this.start_nr)
				.addClass('breadcrumb')
				.css({'top':y,'left':x})
				.appendTo('#trail-container');
	setTimeout(function(){
		$(breadcrumb).fadeOut(3000);		
	},22000);
	setTimeout(function(){
		$(breadcrumb).remove();		
	},25000);

}


function getRotationDegrees(obj) {
    var matrix = obj.css("-webkit-transform") ||
            obj.css("-moz-transform") ||
            obj.css("-ms-transform") ||
            obj.css("-o-transform") ||
            obj.css("transform");
    if (matrix !== 'none') {
        var values = matrix.split('(')[1].split(')')[0].split(',');
        var a = values[0];
        var b = values[1];
        var angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
    } else {
        var angle = 0;
    }
    return (angle < 0) ? angle + 360 : angle;
}