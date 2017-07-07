// the boat object 
function Boat() {
    this.team = 0;
    this.north = 0;
    this.east = 0;
    this.speed = 0;
    this.direction = 170;
    this.element = '#boat-0'
}
;

// extend the boat object
Boat.prototype = {
    'updateData': function (speed, direction) {
        this.speed = speed;
        this.direction = direction;
        var knots = Math.round(convertSpeedtoKN(speed) * 10) / 10;
        $(this.element).find('.extra p').html(knots + 'kN  ' + this.direction + '&deg;')
    },
    'updatePosition': function (position) {
        this.position = position;
        var $boat = $(this.element);
        var $boat_position = $boat.find('.boat-stats .position')
        $boat_position.text(position);
    },
    'setTeam': function (i) {
        this.team = i;
        var $boat = $(this.element);
        var $boat_name = $boat.find('.name');
        var $boat_flag = $boat.find('.team-flag img');
        $boat_name.text(crews[i].shortname);
        var src = $boat_flag.attr('src') + crews[i].flag_image;
        $boat_flag.attr('src', src);
    },
    'moveBoat': function (target_y, target_x, direction) {
        if (run != 1)
            return false; // check of de animatie moet lopen 

        var $boat = $(this.element);
        var $boat_icon = $boat.find('.boat-icon')

        $boat_icon.animate({
            textIndent: direction
        }, {
            step: function (now, fx) {
                $(this).css('-webkit-transform', 'rotate(' + now + 'deg)')
            },
            duration: 0,
            complete: function () {
                $boat.animate({
                    'left': target_x + 'px',
                    'top': target_y + 'px'
                }, refresh_time, 'linear') // stop verplaatsen 200 ms voor dat de boot weer draait naar een nieuwe direction
            }
        }, 'linear');

        calcTrail(target_x, target_y, this.num); // draw the trail of the boat

        // in de functie calcTrail wordt de huidge positie gebruikt
        // update de positie pas na de calcTrail
        this.top = target_y;
        this.left = target_x;
    }
};