// Bouy object
function Bouy() {
    this.id = 0;
    this.north = 0;
    this.east = 0;
    this.number = 0;
    this.type = 0;
    this.prev = 0;
    this.element = '';
    this.dashboard = 0;
    
};

Bouy.prototype = {
    'move': function () {
        // This method will move the bouys to their  correct location on the screen
        var ref = this;
        var target = convertToPixels(ref.element, this.east, this.north);
        ref.element.css('left', target.left + 'px');
        ref.element.css('top', target.top + 'px');
    },
    'boatEntered': function(boat) {
        // This method is called when a boat entered this bouy.
        // If this is the firstboat to do this it should send a message to the dashboard
        // TODO - send message to the dashboard
        console.log("Entered!!!");
    },
    'rounded': function(boat) {
      // This method is called when a boat left this bouy.
      // The rounded time should be saved. This is done in the dashboard.
      // Send a message to the dashboard
      console.log('rounded!!!!');
      Dashboard.bouyRounded(boat,this.number);
    
    },
    'calculateBoatStatus': function (boat) {
        // This method will check if there are boats within range of this bouy   
        if (norm2Dist(boat, this) > 50)
            return 0;
        
        var bouy = this;
        
        if (this.type == 1) { // Start bouy
            // This bouy consist of either 2 bouys or a bouy and a ship.
            // TODO
        } else if (this.type == 2) { // Normal bouy
            // Find the previous and the next  bouy
            var prevBouy, nextBouy;
            for (var i = 0; i < bouys.length; i++) {
                if (bouys[i].prev == bouy.id) nextBouy = bouys[i];
                if (bouys[i].id == bouy.prev) prevBouy = bouys[i];
            }
            
            
            // Calculate the angle with the preivous bouy and the next bouy.
            var prevAngle = getAngle(bouy, prevBouy) * 180 / Math.PI;
            var nextAngle = getAngle(bouy, nextBouy) * 180 / Math.PI;
            var bissect = (prevAngle + nextAngle) / 2;

            // Get the angle between the boat and the bouy
            var cAngle = getAngle(bouy, boat) - bissect;
            while (Math.abs(cAngle) > 180)
                cAngle -= Math.sign(cAngle) * 360;
            if (cAngle > 0 && cAngle <= 90)
                return 1;
            if (cAngle < 0 && cAngle >= -90)
                return 2;
            if (cAngle > 90 && cAngle <= 180)
                return 3;
            if (cAngle < -90 && cAngle >= -180)
                return 4;
        } else if (this.type == 3) { // Finish bouy

        }
    },
};