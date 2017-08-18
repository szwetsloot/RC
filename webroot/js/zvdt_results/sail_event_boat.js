/*
 * BOAT METHODS
 * animateMarker
 * rotateMarker
 * moveBoat
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

// Global variables
var boat_packets;
var packets;

// the boat object 
function Boat(currentTime) {
    this.team = 0;
    this.north = 0;
    this.east = 0;
    this.speed = 6;
    this.direction = 170;
    this.element = '';
    this.bouyHistory = [],
    this.lastMessage = currentTime;
    this.lastUpdate = currentTime;
    this.lastDraw = currentTime;
    this.num = null; // start nr
    this.iconRotation = 0;
    this.currentRotation = 0;
    this.boatIcon = '';
    this.actual = {
        'time': 0,
        'north': 0,
        'east': 0,
        'top': 0,
        'left': 0,
        'direction': 0
    }
    this.drawn = {
        'north': 0,
        'east': 0,
        'top': 0,
        'left': 0,
        'direction': 0,
    };
    this.directionLog = [];
    this.directionLogCounter = 0;
    this.nextBouy = 0;
    this.bouyStatus = 0;
    // These variables are used to readout known packets
    this.currentPacket;
    this.nextPacket;
    // these variables are used to navigate the dummy data
    this.currentDummyPacket = null;
}
;
// extend the boat object
Boat.prototype = {
    'animateMarker': function () {
        setTimeout(function () {
            ref.animateMarker();
        }, 100);
        var boat = JSON.parse(JSON.stringify(this)); // Cache the object
        var ref = this;
        // This method will calculate where the boat has to go to stay close to the data
        // Calculate where the boat should be
        var expectedNorth = boat.actual.north + Math.sin(boat.direction / 180 * Math.PI) * boat.speed * (millis() - boat.actual.time) / 1000;
        var expectedEast = boat.actual.east + Math.cos(boat.direction / 180 * Math.PI) * boat.speed * (millis() - boat.actual.time) / 1000;

        // Calculate where the drawn boat is
        var drawnNorth = ref.drawn.north;
        var drawnEast = ref.drawn.east;
        ref.drawn.north += Math.sin(boat.direction / 180 * Math.PI) * boat.speed * (millis() - boat.lastUpdate) / 1000;
        ref.drawn.east += Math.cos(boat.direction / 180 * Math.PI) * boat.speed * (millis() - boat.lastUpdate) / 1000;

        // Correct for changes
        var factor = 0.92;
        ref.drawn.north = ref.drawn.north * factor + expectedNorth * (1 - factor);
        ref.drawn.east = ref.drawn.east * factor + expectedEast * (1 - factor);
        var direction = (-Math.atan2(ref.drawn.north - drawnNorth, ref.drawn.east - drawnEast) * 180 / Math.PI + 360) % 360;

        // TODO - slow down the boat if the last packet is a long time ago

        // Send the location to the element
        target = convertToPixels(ref.boatIcon, ref.drawn.east, ref.drawn.north);
        ref.element.animate({
            left: target.left,
            top: target.top
        }, {
            duration: 100,
            easing: 'linear'
        });
        ref.drawn.direction = direction;
        this.directionLog[(this.directionLogCounter++)%10] = direction;
        ref.drawn.top = target.top;
        ref.drawn.left = target.left;
        // Next run
        ref.lastUpdate = millis();
    },
    'rotateMarker': function() {
        //if(this.team != 0) return;
        var ref = this;
        setTimeout(function () {
            ref.rotateMarker();
        }, 50);
        
        // Rotate the marker
        var $boat_icon = ref.element.find('.boat-icon');
        var startRotation = ref.iconRotation
        
        var direction = this.averageRotation() - north_direction;
        
        startRotation = (startRotation + 360) % 360;
        direction = (direction + 360) % 360;
        
        var difRotation = direction - startRotation;
        while (difRotation > 180) difRotation -= 360;
        while (difRotation < -180) difRotation += 360;
        
        direction = startRotation + Math.min(Math.abs(difRotation), 1 * simulation_speed) * Math.sign(difRotation);
        ref.iconRotation = direction;
        $boat_icon.animate(
                {
                    deg: direction,
                },
                {
                    'easing': 'linear',
                    duration: 50,
                    step: function (now) {
                        $(this).css('-ms-transform', 'rotate(' + now + 'deg)');
                        $(this).css('-webkit-transform', 'rotate(' + now + 'deg)');
                        $(this).css('transform', 'rotate(' + now + 'deg)');
                    }
                }
        );
    },
    // Im this method the actual location of the boat will be updated based on the packets.
    'moveBoat': function (i) {
        // Set next run
        setTimeout(function () {
            ref.moveBoat(i);
        }, 500);

        // Required variables
        var ref = this; // This is a reference to the class variable for later use.
        var $boat = ref.element;

        // Start working with the packets
        var packet_id = boat_packets[crews[i].id];

        // Check whether this is the first packet
        if (ref.currentPacket === undefined) {
            ref.currentPacket = packets[packet_id][0];
            ref.nextPacket = packets[packet_id][1];
            crews[i].packetCount = 0;
            ref.drawn.north = ref.currentPacket.north;
            ref.drawn.east = ref.currentPacket.east;
        }

        // Check whether we need a next packet
        var currentTime = startTime + (millis() - jsTime);
        
        while (packets[packet_id][crews[i].packetCount].time < currentTime) {
            crews[i].packetCount++;
        }
        crews[i].packetCount--;

        // Get the current packet and next packet
        ref.currentPacket = packets[packet_id][crews[i].packetCount];
        ref.nextPacket = packets[packet_id][crews[i].packetCount + 1];
        if (ref.currentPacket == undefined)
            return;
        ref.direction = ref.currentPacket.heading;
        ref.speed = ref.currentPacket.velocity;

        // Interpolate the actual position from the current and previous position
        var timePerc = (currentTime - ref.currentPacket.time) / (ref.nextPacket.time - ref.currentPacket.time);
        ref.actual.north = ref.currentPacket.north * timePerc + ref.nextPacket.north * (1 - timePerc);
        ref.actual.east = ref.currentPacket.east * timePerc + ref.nextPacket.east * (1 - timePerc);
        ref.actual.time = millis();

        
        // UPDATE THE SIMULATION
        // calc the progress between the previous and next bouy
        ref.calcPositionBoat();
        
        ref.calcDistanceBouy();

    	Dashboard.sortBoats();
    	ref.calcPositionBoat();
        // Set the variables
        ref.updateData(
        		ref.actual.north,
        		ref.actual.east,
                ref.speed,
                ref.direction
                );
        
        drawTrail(ref.drawn.left, ref.drawn.top, ref.num);
        return;


        var packet = packets[boat_packets[crews[i].id]][crews[i].packetCount];
        var nextPacket = packets[boat_packets[crews[i].id]][crews[i].packetCount + 1];
        var timeDiff = (nextPacket.time - startTime - (millis() - jsTime)) / simulation_speed;

        return;

        // Run the next function when the packet is due
        setTimeout(function () {
            ref.moveBoat(i);
        }, timeDiff);

        // Move the boat to the new location
        this.north = packet.north;
        this.east = packet.east;

        var target = convertToPixels(ref.boatIcon, packet.east, packet.north, 1);
        $boat.animate({
            left: target.left,
            top: target.top
        }, {
            duration: timeDiff,
            easing: 'linear'
        });


        return;

        var boat = JSON.parse(JSON.stringify(this)); // Cache the object

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
        if (this.countMove < num) {
            this.countMove += 1;
        } else {
            this.countMove = 0;
            drawTrail(ref.drawn.left, ref.drawn.top, boat.num); // draw the trail of the boat
        }

        boat.top = ref.drawn.top;
        boat.left = ref.drawn.left;

        
        

    },
    'moveToPoint' : function(){
    	var boat = this;
    	var $boat = this.element;
        var $boat_icon = $boat.find('.boat-icon');
    	
    	// if this is the first time the function is ran
    	if( this.currentDummyPacket == null){
    		var data = tracker_data[0];
    		$boat.css({'top':data.top, 'left':data.left});
    		this.currentDummyPacket = 0;
    	} 
    	// check if there is any data left
    	if( this.currentDummyPacket == tracker_data.length - 1 ) this.currentDummyPacket = 0 //return false;
    	   
    	var data_cur = tracker_data[ this.currentDummyPacket ];
    	var data_target = tracker_data[ this.currentDummyPacket + 1 ];
    	
    	// calc distance current bouy to next
    	var dist = norm2Dist( data_cur, data_target );

    	var duration = ( ( dist / boat.speed ) * 1000 ) / simulation_speed; 

    	// rotate boat icon   	
    	var direction = 180 - toDegrees(getAngle(data_cur, data_target) ) - toDegrees(screenUTMRange.rotation) ;
    	$boat_icon.css('transform', 'rotate(' + direction + 'deg)')
    	
    	$boat.animate({
            left: data_target.left,
            top: data_target.top
        }, duration, 'linear', function() {
        	boat.currentDummyPacket += 1;
        	boat.top =  data_target.top;
            boat.left =  data_target.left;
            // run after the animation this function again for the next bouy
        	boat.moveToPoint();
        });   
    	
    	// UPDATE THE SIMULATION
        // calc the progress between the previous and next bouy
        boat.calcPositionBoat();
        
        boat.calcDistanceBouy();

    	Dashboard.sortBoats();
    	boat.calcPositionBoat();

        
        
        
    	
    },
    'syncObjectData' : function(){
    	var data_cur = tracker_data[ this.currentDummyPacket ];
    	var data_target = tracker_data[ this.currentDummyPacket + 1 ];
    	// calc distance current bouy to next
    	var dist = norm2Dist( data_cur, data_target );
    	var angle = toDegrees(getAngle(data_cur, data_target) );
    	var speed = 6; // m/s fixed value
    	
    	// Calculate where the drawn boat is
        var drawnNorth = this.drawn.north;
        var drawnEast = this.drawn.east;
        this.drawn.north += Math.sin(boat.direction / 180 * Math.PI) * boat.speed * (millis() - boat.lastUpdate) / 1000;
        this.drawn.east += Math.cos(boat.direction / 180 * Math.PI) * boat.speed * (millis() - boat.lastUpdate) / 1000;
        
        this.updateData();
    	
    },
    // THIS SHOULD BE THE ONLY FUNCTION THAT UPDATES ALL THE TEXT IN THE DOM ELEMENTS!!
    'updateData': function (north, east, speed, direction) {

        $overview = $('#boat-overview');
        $boat = $overview.find('#info-boat-' + this.id);
        $info = $boat.find('.counter');

        this.north = north;
        this.east = east;
        this.speed = speed;
        this.direction = Math.round(direction);
        this.lastMessage = millis();
        distance_bouy = (this.distance_bouy == null) ? 0 : this.distance_bouy;
        var knots = Math.round(convertSpeedtoKN(speed) * 10 + Math.random(1) * 1.2 ) / 10;

        var corrected_direction = (this.direction + 90) % 360;

        // this.element.find('.extra p').html(knots + 'kN  ' + corrected_direction + '&deg;');
        this.element.find('.extra p').html(knots + 'kN ');
        $info.html(knots + 'kN / ' + corrected_direction + '&deg; / ' + distance_bouy + 'm');
    },
    'updatePosition': function (position) {
        this.position = position;
        var $boat = this.element;
        var $boat_position = $boat.find('.boat-stats .position')
        $boat_position.text(position);
    },
    'setTeam': function (i) {
        this.team = i;
        var $boat = this.element;
        $boat.addClass('start-' + crews[i].start_nr);
        var $position = $boat.find('.position');
        var $boat_name = $boat.find('.name');
        var $boat_flag = $boat.find('.team-flag img');
        $position.text(crews[i].start_nr);
        $boat_name.text(crews[i].shortname);
        var src = $boat_flag.attr('src') + crews[i].flag_image;
        $boat_flag.attr('src', src);
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
               

               // if(this.id == "8" ) console.log("Update = "+bouyUpdate);
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
                        ref.bouyStatus = 0;  // done rounding so set back to 0
                        // Find the bouy which is next
                        for (var j = 0; j < bouys.length; j++) {
                            if (bouys[j].prev == bouys[i].id) {
                                ref.nextBouy = bouys[j].order;
                                //if(ref.id == 1)
                                console.log("next Bouy = "+ref.nextBouy);
                                break;
                            }
                            break;
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
    },
    'averageRotation': function() {
        var ref = this;
        var i, j;
        var x = 0;
        var y = 0;
        for (i = 0; i < 30; i++) {
            if (ref.directionLog[i] == undefined) {
                // Not set yet
                break;
            }
            x += Math.cos(ref.directionLog[i] / 180 * Math.PI);
            y += Math.sin(ref.directionLog[i] / 180 * Math.PI);
        }
        x /= i;
        y /= i;
        return Math.atan2(y,x) * 180 / Math.PI;
    }
};

//calc distance between boat and next bouy
Boat.prototype.calcDistanceBouy = function () {
	    
	 var bouy;
	 
	 // nextbouy refers to the name of the next bouy
	 for (var i = 0; i < bouys.length; i++) {
	    	if( bouys[i].order == this.nextBouy ) bouy = bouys[i];
	 }
	    
	 var boat_dx = Math.abs(this.drawn.east - bouy.east);
	 var boat_dy = Math.abs(this.drawn.north - bouy.north);

	 var distance_bouy = Math.sqrt(  (Math.pow(boat_dx, 2) + Math.pow(boat_dy, 2))  );
	 this.distance_bouy = Math.round(distance_bouy);
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

    var ab = (bouys_dx * boat_dx) + (bouys_dy * boat_dy);
    var afstand_boeien = Math.sqrt((Math.pow(bouys_dx, 2) + Math.pow(bouys_dy, 2)));

    var afstand_tot_boei = ab / Math.pow(afstand_boeien, 2);


    var rounded_bouys = this.bouyHistory.length;

    if (afstand_tot_boei < 0)
        afstand_tot_boei = 0;

    // tel elke geronde boei meer als 1
    this.location = rounded_bouys + (1 - afstand_tot_boei);
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