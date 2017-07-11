// the boat object 
function Boat(currentTime) {
    this.team = 0;
    this.north = 0;
    this.east = 0;
    this.speed = 0;
    this.direction = 170;
    this.element = '';
    this.lastMessage = currentTime;
    this.lastUpdate = currentTime;
    this.lastDraw = currentTime;
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
        console.log();
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
    'updateData': function (north, east, speed, direction) {
        this.north = north;
        this.east = east;
        this.speed = speed;
        this.direction = Math.round(direction);
        this.lastMessage = millis();
        var knots = Math.round(convertSpeedtoKN(speed) * 10) / 10;
        this.element.find('.extra p').html(knots + 'kN  ' + this.direction + '&deg;');
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
        var $boat_name = $boat.find('.name');
        var $boat_flag = $boat.find('.team-flag img');
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

        //calcTrail(target_x, target_y, boat.num); // draw the trail of the boat

        // in de functie calcTrail wordt de huidge positie gebruikt
        // update de positie pas na de calcTrail
        boat.top = ref.drawn.top;
        boat.left = ref.drawn.left;
    },
    'checkBouys': function() {
        var ref = this;
        setTimeout(function() { ref.checkBouys(); }, 100);
        /*if (this.id == 1)
            console.log("Status = "+ref.bouyStatus);*/
        // This method will check the status on the current bouy and keep track of rounding it
        for (var i = 0; i < bouys.length; i++) {
            if (bouys[i].order == this.nextBouy) {
                var bouyUpdate = bouys[i].calculateBoatStatus(this);
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
                    } else if (bouyUpdate == 0) {
                        // Done rounding, send a message to the bouy
                        bouys[i].rounded(ref);
                        ref.bouyStatus = 0;
                        // Find the bouy which is next
                        for (var j = 0; j < bouys.length; j++) {
                            if (bouys[j].prev == bouys[i].id) {
                                ref.nextBouy = bouys[j].order;
                                console.log("next Bouy = "+ref.nextBouy);
                                break;
                            }
                        }
                    }
                } else if (this.bouyStatus > 0) {
                    if (bouyUpdate == 0) {
                        // Don't update
                    } else {
                        this.bouyStatus = bouyUpdate;
                    }
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
Boat.prototype.calcDistanceBouy = function (step = 0) {
    // laat de functie
    var steps = 12;
    var d_t = refresh_time / 12;
    var self = this

    // data komt één keer in de 6 seconden
    // bereken zelf de tussen stappen
    var bouy_id = 0;
    var boat_id = this.id;
    var distance = this.speed * d_t * step;
    // select next bouy
    var $bouy = $('#bouy-1');
    var target_bouy = convertToPixels($bouy, bouys[bouy_id].east, bouys[bouy_id].north);
    var bouy_x = target_bouy.left;
    var bouy_y = target_bouy.top;
    var $boat = this.element;
    var boat_pos = convertToPixels($boat, crews[boat_id - 1].tracker['east'], crews[boat_id - 1].tracker['north']);
    var boat_x = boat_pos.top;
    var boat_y = boat_pos.left;
    var d_x = Math.abs(boat_x - bouy_x);
    var d_y = Math.abs(boat_y - bouy_y);
    // pythagoras a2 +b2 = c2 
    this.distance_bouy = Math.round(Math.sqrt((Math.pow(d_x, 2) + Math.pow(d_y, 2)) + distance));
    //this.distance_bouy = norm2Dist(bouys[bouy_id], crews[boat_id - 1].tracker);

    //$boat.find('.name').text(this.distance_bouy+'m');

    if (step < steps)
        setTimeout(function () {
            self.calcDistanceBouy(step + 1);
        }, d_t);
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