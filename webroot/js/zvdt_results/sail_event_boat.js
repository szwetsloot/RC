// the boat object 
function Boat(currentTime) {
    this.team = 0;
    this.north = 0;
    this.east = 0;
    this.speed = 0;
    this.direction = 170;
    this.element = '';
    this.bouyHistory = [],
    this.lastMessage = currentTime;
    this.lastUpdate = currentTime;
    this.lastDraw = currentTime;
    this.num = null;
    this.boatIcon = '';
    this.drawn = {
        'north': 0,
        'east': 0,
        'top': 0,
        'left': 0,
        'direction': 0,
    };
    this.nextBouy = 0;
    this.bouyStatus = 0;
}
;
// extend the boat object
Boat.prototype = {
    'animateMarker': function () {
        var boat = JSON.parse(JSON.stringify(this)); // Cache the object
        var ref = this;
        // This method will calculate where the boat has to go to stay close to the data
        // Calculate where the boat should be
        var expectedNorth = boat.north + Math.sin(boat.direction / 180 * Math.PI) * boat.speed * (millis() - boat.lastMessage) / 1000;
        var expectedEast = boat.east + Math.cos(boat.direction / 180 * Math.PI) * boat.speed * (millis() - boat.lastMessage) / 1000;
        // Calculate where the drawn boat is
        var drawnNorth = ref.drawn.north;
        var drawnEast = ref.drawn.east;
        ref.drawn.north += Math.sin(boat.direction / 180 * Math.PI) * boat.speed * (millis() - boat.lastUpdate) / 1000;
        ref.drawn.east += Math.cos(boat.direction / 180 * Math.PI) * boat.speed * (millis() - boat.lastUpdate) / 1000;
        //console.log();
        // Correct for changes
        var factor = 0.7;
        ref.drawn.north = ref.drawn.north * factor + expectedNorth * (1 - factor);
        ref.drawn.east = ref.drawn.east * factor + expectedEast * (1 - factor);
        var direction = Math.atan2(ref.drawn.north - drawnNorth, ref.drawn.east - drawnEast) * 180 / Math.PI;
        // TODO - slow down the boat if the last packet is a long time ago

        // Send the location to the element
        target = convertToPixels(ref.boatIcon, ref.drawn.east, ref.drawn.north);
        ref.drawn.top = target.top;
        ref.drawn.left = target.left;
        ref.drawn.direction = direction;
        // Next run
        ref.lastUpdate = millis();
        setTimeout(function () {
            ref.animateMarker();
        }, 100);
    },
    // THIS SHOULD BE THE ONLY FUNCTION THAT UPDATES ALL THE TEXT IN THE DOM ELEMENTS!!
    'updateData': function (north, east, speed, direction) {
    	
    	$overview = $('#boat-overview');
    	$boat = $overview.find('#info-boat-'+this.id);
    	$info = $boat.find('.counter');
    	
        this.north = north;
        this.east = east;
        this.speed = speed;
        this.direction = Math.round(direction);
        this.lastMessage = millis();
        distance_bouy = ( this.distance_bouy == null )? 0 : this.distance_bouy ;
        // de Math random laat te snelheid max. 1.2 knopen verspringen
        var knots = Math.round(convertSpeedtoKN(speed) * 10 + ( Math.random() * 12 ) ) / 10;
        
        var corrected_direction = ( this.direction + 90 ) % 360;
        
       // this.element.find('.extra p').html(knots + 'kN  ' + corrected_direction + '&deg;');
        this.element.find('.extra p').html(knots + 'kN ');
        $info.html(knots+'kN / '+corrected_direction+'&deg; / '+distance_bouy+'m');
    },
    'updatePosition': function (position) {
        this.position = position;
        var $boat = this.element;
        var $boat_position = $boat.find('.boat-stats .position');
        $boat_position.text(position);
    },
    'setTeam': function (i) {
        this.team = i;
        var $boat = this.element;        
        $boat.addClass('start-'+crews[i].start_nr);
        var $position = $boat.find('.position');
        var $boat_name = $boat.find('.name');
        var $boat_flag = $boat.find('.team-flag img');
        $position.text(crews[i].start_nr);
        $boat_name.text(crews[i].shortname);
        var src = $boat_flag.attr('src') + crews[i].flag_image;
        $boat_flag.attr('src', src);
    },
    'moveBoat': function () {
        var boat = JSON.parse(JSON.stringify(this)); // Cache the object
        var ref = this;
        var $boat = this.element;
        var $boat_icon = $boat.find('.boat-icon');
        var direction = this.drawn.direction;
        direction += north_direction;
        var dur = this.lastDraw + 100 - millis();
        this.lastDraw += 100;
        var startRotation = getRotationDegrees($boat_icon);
        $boat.animate({
            left: ref.drawn.left,
            top: ref.drawn.top 
        }, {
            done: function () {
                ref.moveBoat();
            },
            easing: 'linear'
        });
        $boat_icon.animate(
                {
                    deg: direction - startRotation,
                },
                {
                    'easing': 'linear',
                    duration: dur,
                    step: function (now) {
                        var tmp = startRotation + now;
                        tmp += 360;
                        tmp %= 360;
                        //console.log(tmp);
                        $(this).css('-ms-transform', 'rotate(' + tmp + 'deg)');
                        $(this).css('-webkit-transform', 'rotate(' + tmp + 'deg)');
                        $(this).css('transform', 'rotate(' + tmp + 'deg)');
                    }
                }
        );
        
        //drawTrail(ref.drawn.left, ref.drawn.top, boat.num); // draw the trail of the boat
        
        // zorg dat niet te veel breadcrumbs worden achtergelaten
        var num = 15 / boat.speed;
        if( this.countMove < num ){
        	this.countMove += 1;
        } else{
        	this.countMove = 0;
        	drawTrail(ref.drawn.left, ref.drawn.top, boat.num); // draw the trail of the boat
        }
        
        
        boat.top = ref.drawn.top;
        boat.left = ref.drawn.left;

      
    },
    'checkBouys': function () {
        var ref = this;
        setTimeout(function () {
            ref.checkBouys();
        }, 100);
        
        
        // This method will check the status on the current bouy and keep track of rounding it
       
        for (var i = 0; i < bouys.length; i++) {

            if (bouys[i].order == this.nextBouy) {
                var bouyUpdate = bouys[i].calculateBoatStatus(this);
                if (bouyUpdate == undefined)
                    return;
                
                //console.log("Update = "+bouyUpdate);
                if (this.bouyStatus == 3) {
                    if (bouyUpdate == 4) {
                        this.bouyStatus = 4;
                    } else if (bouyUpdate != 0) {
                        this.bouyStatus = bouyUpdate;
                    }
                } else if (this.bouyStatus == 4) {
                    if (bouyUpdate == 3) {
                        this.bouyStatus = 3;
                    } else if (bouyUpdate == 2) {
                        // Done rounding, send a message to the bouy
                        bouys[i].rounded(ref);
                        ref.bouyStatus = 0; // done rounding so set back to 0
                        // Find the bouy which is next
                        for (var j = 0; j < bouys.length; j++) {
                            if (bouys[j].prev == bouys[i].id) {
                                ref.nextBouy = bouys[j].order;
                                //if(ref.id == 1)
                                //	console.log("next Bouy = "+ref.nextBouy);
                                break;
                            }
                        }
                    }
                } else if (this.bouyStatus == 1) {
                    if (bouyUpdate == 3)
                        this.bouyStatus = 3;
                } else if (this.bouyStatus == 2) {
                    if (bouyUpdate == 1)
                        this.bouyStatus = 1;
                } else if (this.bouyStatus == 0) {
                    // Started rounding, send a message to the bouy
                    if (bouyUpdate != 0) {
                        bouys[i].boatEntered(this);
                    }
                    this.bouyStatus = bouyUpdate;
                }
            }
        }
    }
};
//calc distance between boat and next bouy
Boat.prototype.calcDistanceBouy = function () {   
    var bouy_id = this.nextBouy - 1;
    var boat_id = this.id;

    var boat_dx = Math.abs( this.drawn.east - bouys[bouy_id].east );
	var boat_dy = Math.abs( this.drawn.north - bouys[bouy_id].north );
	
	var distance_bouy = Math.sqrt( ( Math.pow(boat_dx, 2) + Math.pow(boat_dy, 2) ) );	
	
	this.distance_bouy = Math.round( distance_bouy );
}

// berekent normaal positie van de boat 
// eenheid is in meters
Boat.prototype.calcPositionBoat = function () { 	
	var ref = this;
	var prev;
	var num_next;
	var num_prev;
	
	// get the array number of the next bouy
	for (var i = 0; i < bouys.length; i++) {
        if (bouys[i].order == this.nextBouy) {
        	prev = bouys[i].prev; // prev is id of next bouy
        	num_next = i;
        	break;
        }
	}
	// get the array number of the previous bouy
	for (var i = 0; i < bouys.length; i++) {
        if (bouys[i].id == prev) {
        	num_prev = i;
        	break;
        }
	}

	// console.log('prev bouy['+num_prev+']:id'+prev+' next_bouy['+num_next+']: id'+this.nextBouy);	
	// bouy[1].(id = 3) left .......  bouy[0] = right

	var prev_bouy = bouys[num_prev];
	var next_bouy = bouys[num_next];
	
	var bouys_dx = prev_bouy.east - next_bouy.east;
	var bouys_dy = prev_bouy.north - next_bouy.north;
	
	var boat_dx = ref.east - next_bouy.east;
	var boat_dy = ref.north - next_bouy.north;

	var ab = ( bouys_dx * boat_dx ) + ( bouys_dy * boat_dy ); 
	var afstand_boeien = Math.sqrt( ( Math.pow(bouys_dx, 2) + Math.pow(bouys_dy, 2) ) );

	var afstand_tot_boei = ab / Math.pow(afstand_boeien, 2);
	
	
	var rounded_bouys = this.bouyHistory.length;
	
	if( afstand_tot_boei < 0 ) afstand_tot_boei = 0;
	
	// tel elke geronde boei meer als 1
	this.location = rounded_bouys + ( 1 - afstand_tot_boei ); 	
};

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