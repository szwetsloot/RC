// Bouy object
function Bouy() {
    this.id = 0;
    this.north = 0;
    this.east = 0;
    this.left = null,
    this.top = null,
    this.number = 0;
    this.order = null,
    this.type = 0;
    this.prev = 0;
    this.element = '';
    this.dashboard = 0;
}
;
Bouy.prototype = {
    'move': function () {
    	// This method will move the bouys to their  correct location on the screen
        var ref = this;
        var target = convertToPixels(ref.element, this.east, this.north);
        ref.element.css('left', target.left + 'px');
        ref.element.css('top', target.top + 'px');
        ref.top = target.top;
        ref.left = target.left;
    },
    'boatEntered': function (boat) {
        // This method is called when a boat entered this bouy.
    	console.log('boat entered');
        // First boat activates the next bouy
    	// if(boat.position == 1) Dashboard.activateBouy(boat,this);    	
    },
    'rounded': function(boat) {
      // This method is called when a boat left this bouy.
      // Talk to dashboard 
    	console.log(rounded);
      boat.bouyHistory.push(this.order);
      Dashboard.bouyRounded(boat,this);    
    },
    'calculateBoatStatus': function (boat) {
        // This method will check if there are boats within range of this bouy   

        var bouy = this;

       // if (boat.id != 1) return;

        if (bouy.type == 1) { // Start bouy
            // This bouy consist of either 2 bouys or a bouy and a ship.
            // Get the second bouy that is part of this one
            for (var i = 0; i < bouys.length; i++) {
                if (bouys[i].id == bouy.id)
                    continue;
                if (bouys[i].order == bouy.order) {
                    bouyB = deepcopy(bouys[i]);
                }
            }

            if (bouy.id > bouyB.id)
                return;

            // Get the centre
            centerBouy = {
                'north': (bouy.north + bouyB.north) / 2,
                'east': (bouy.east + bouyB.east) / 2
            };

            if (norm2Dist(boat, centerBouy) > 50)
                return 0;

            // Find the previous and the next  bouy
            var prevBouy, nextBouy;
            for (var i = 0; i < bouys.length; i++) {
                if (bouys[i].prev == bouy.id)
                    nextBouy = bouys[i];
                if (bouys[i].id == bouy.prev)
                    prevBouy = bouys[i];
            }
            
            // Calculate the angles and the bissect
            var prevAngle = getAngle(prevBouy, bouy) * 180 / Math.PI;
            var nextAngle = getAngle(nextBouy, bouy) * 180 / Math.PI;
            var bissect = (prevAngle + nextAngle) / 2;
            var centerVector = {
                'north': Math.cos(bissect / 180 * Math.PI),
                'east': Math.sin(bissect / 180 * Math.PI)
            };
            var normal = normalComponent(centerVector, {
                'north': bouy.north - centerBouy.north,
                'east': bouy.east - centerBouy.east
            });
            var normalBoat = normalComponent(centerVector, {
                'north': boat.drawn.north - centerBouy.north,
                'east': boat.drawn.east - centerBouy.east
            });
            var alignBoat = alignComponent(centerVector, {
                'north': boat.drawn.north - centerBouy.north,
                'east': boat.drawn.east - centerBouy.east
            });
            if (normalBoat < normal && alignBoat < 0) {
                return 1;
            } else if (normalBoat < normal && alignBoat > 0) {
                return 3;
            } else if (normalBoat >= normal && alignBoat < 0) {
                return 2;
            } else if (normalBoat >= normal && alignBoat > 0) {
                return 4;
            }


        } else if (bouy.type == 2) { // Normal bouy
            if (norm2Dist(boat, this) > 50)
                return 0;
            // Find the previous and the next  bouy
            var prevBouy, nextBouy;
            for (var i = 0; i < bouys.length; i++) {
                if (bouys[i].prev == bouy.id)
                    nextBouy = bouys[i];
                if (bouys[i].id == bouy.prev)
                    prevBouy = bouys[i];
            }

            // Calculate the angle with the preivous bouy and the next bouy.
            var prevAngle = getAngle(bouy, prevBouy) * 180 / Math.PI;
            var nextAngle = getAngle(bouy, nextBouy) * 180 / Math.PI;
            var bissect = (prevAngle + nextAngle) / 2;
            // Get the angle between the boat and the bouy
            var cAngle = getAngle(bouy, boat) * 180 / Math.PI - bissect;
            while (Math.abs(cAngle) > 180)
                cAngle -= Math.sign(cAngle) * 360;
            //console.log("Angle = "+cAngle);
            if (cAngle > 0 && cAngle <= 90)
                return 2;
            if (cAngle < 0 && cAngle >= -90)
                return 1;
            if (cAngle > 90 && cAngle <= 180)
                return 4;
            if (cAngle < -90 && cAngle >= -180)
                return 3;
        } else if (bouy.type == 3) { // Finish bouy

        }
    },
}
;
function normalComponent(vectorA, vectorB) {
    var vB = deepcopy(vectorB);
    var vA = deepcopy(vectorA);
    // Do an inner product
    var normalBouyRatio = (
            vA.north * vB.north +
            vA.east * vB.east
            ) / Math.sqrt(
            Math.pow(vA.north, 2) +
            Math.pow(vA.east, 2)
            );
    
    // Calculate the parrallel component
    var normalBouy = {
        'north': normalBouyRatio * vA.north,
        'east': normalBouyRatio * vA.east
    };
    var normal = Math.sqrt(
            Math.pow(vB.north - normalBouy.north, 2) +
            Math.pow(vB.east - normalBouy.east, 2)
            );
    return normal;
}

function alignComponent(vectorA, vectorB) {
    var vB = deepcopy(vectorB);
    var vA = deepcopy(vectorA);
    // Do an inner product
    var normalBouyRatio = (
            vA.north * vB.north +
            vA.east * vB.east
            ) / Math.sqrt(
            Math.pow(vA.north, 2) +
            Math.pow(vA.east, 2)
            );
    return normalBouyRatio * Math.sqrt(
            Math.pow(vB.north, 2) + 
            Math.pow(vB.east, 2)
            );
}