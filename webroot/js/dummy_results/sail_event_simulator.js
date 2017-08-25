/* 
 * SIMULATOR METHODS
 *
 * init(); 
 * createBouys();
 * createBoats();
 * drawStartline();
 * drawClearedStartline();
 * zoomBouy();
 * resetZoom();
 * calculateLongestDistanceBouys();
 * drawHeightlines();
 * calculateScreenRange();
 * drawWaves();
 * setArrows();
 * calculateSimulationDistance();
 * generateData();
*/

var Simulator = {
	running : false,
	courseLength : 0,
    race_duration : 0,
    started : false,
    finished : false,
};

Simulator.init = function(){
    // cache DOM elements	
    this.$simulator = $('#simulator');
    $('canvas').attr('width', this.$simulator .width());
    $('canvas').attr('height', this.$simulator .height());
	this.createBouys();
	this.calculateCourseLength(); // required to calculate the longest route
    this.drawHeightLines();
    this.drawWaves();
    this.setArrows(); // require waves
    this.drawStartline();
    this.createBoats();
    this.calculateRaceDuration(); // requires boats
    this.arrangeBoats();

    
}

Simulator.arrangeBoats = function(){
    setTimeout(Simulator.arrangeBoats,500)
    // get boats and sort them according to their top
    var sorted = boats.slice().sort(function(a, b){ return a.top - b.top; });
    $.each(sorted,function(i){
        var zIndex = i + 3; // werl helaas niet met decimals
        sorted[i].element.css('z-index',zIndex);
    });
}

Simulator.createBouys = function(){
    for (var i = 0; i < bouys.length; i++) {
        bouys[i] = new Bouy(i);
    }
    // Calculate the longest distance between two bouys to determine the horizontal location 
    Simulator.calculateLongestDistanceBouys();    
    Simulator.calculateScreenRange(); // Calculate the range of the screen based on the positions of the bouys

    for (var i = 0; i < bouys.length; i++) {
        bouys[i].move();
    }
}

Simulator.createBoats = function(){
    for (var i = 0; i < crews.length; i++) {
        boats[i] = new Boat(i);
    }

    Simulator.generateData(); 

    $.each(boats,function(i){
        boats[i].move(); // runs every 500ms        
    });
}

Simulator.drawStartline = function(){
	if(options.show_startline == false) return false;

    var j = 0, i = 0;
    var $bouy_1, $bouy_2;
    for (i = 0; i < bouys.length; i++) {
        if (bouys[i].type == 1) {
            if (!j) $bouy_1 = bouys[i];
            if (j)  $bouy_2 = bouys[i];
            j++
        }
    }

	var $canvas = document.getElementById("canvas-start");
	var ctx = $canvas.getContext("2d");
	
	$('canvas').attr('width', $('html').width());
	$('canvas').attr('height', $('html').height());
	
	ctx.beginPath();
	ctx.moveTo($bouy_1.left, $bouy_1.top);
	ctx.lineTo($bouy_2.left,$bouy_2.top);

	ctx.strokeStyle = 'rgba(220,30,30,0.6)';
	ctx.lineWidth = 3;
	
	ctx.stroke();
}

// Helaas kun je de oude lijn niet van kleur veranderen daarom moet je de canvas wissen en opnieuw tekenen
Simulator.drawClearedStartline = function(){
	if(options.show_startline == false) return false;

    var j = 0, i = 0;
    var $bouy_1, $bouy_2;
    for (i = 0; i < bouys.length; i++) {
        if (bouys[i].type == 1) {
            if (!j) $bouy_1 = bouys[i];
            if (j)  $bouy_2 = bouys[i];
            j++
        }
    }
		
	var $canvas = document.getElementById("canvas-start");
	var ctx = $canvas.getContext("2d");
	ctx.clearRect(0, 0, $canvas.width, $canvas.height);
	
	ctx.beginPath();
	ctx.moveTo($bouy_1.left, $bouy_1.top);
	ctx.lineTo($bouy_2.left,$bouy_2.top);
	ctx.lineWidth = 3;
	ctx.strokeStyle = 'rgba(225,225,225,0.6)';
	ctx.setLineDash([5,5]);
	ctx.stroke();
}

// zoom towards the bouy - units in pixels
Simulator.zoomBouy = function(bouy_element){    
    $bouy = bouy_element;
    var screenWidth = this.$simulator.width();
    var screenHeight = this.$simulator.height(); 
    var bouy_pos = $bouy.position();   
    var d_x = ( screenWidth / 2 ) - bouy_pos.left;
    var d_y = ( screenHeight / 2 ) - bouy_pos.top;    
    var scale = 1.5; // TODO define dynamic
    
    // translation should be multiplied with the scale factor
    d_x *= scale;
    d_y *= scale;
    
    // The elements have the css class ease-transform which forces them to animate css transformation
    this.$simulator.css('transform', 'translate('+d_x+'px,'+d_y+'px) scale('+scale+')');
}

Simulator.resetZoom = function(){       
    this.$simulator.css('transform', 'translate(0px,0px) scale(1)');
}

//This function will calculate the longest distance between two bouys.
//This distance will be used as the horizontal line on the screen
Simulator.calculateLongestDistanceBouys = function() {
    var i, j;
    dist = 0;
    var bouy1, bouy2;
    for (i = 0; i < bouys.length; i++) {
        for (j = 0; j < bouys.length; j++) {
            if (i === j)
                continue; // Don't compare the same bouys because the distance = 0
            var bouyA = deepcopy(bouys[i]);
            var bouyB = deepcopy(bouys[j]);
            if (bouyA.order == bouyB.order)
                continue; // These are a pair
            if (bouyA.type == 1 || bouyA.type == 3) {
                // Find the other part of the pair
                var k;
                for (k = 0; k < bouys.length; k++) {
                    if (i == k) continue;
                    if (bouys[k].order == bouyA.order)
                        break;
                }
                // Get the centre of the pair
                bouyA.north = (bouyA.north + bouys[k].north) / 2;
                bouyA.east = (bouyA.east + bouys[k].east) / 2;
            }
            if (bouyB.type == 1 || bouyB.type == 3) {
                // Find the other part of the pair
                var k;
                for (k = 0; k < bouys.length; k++) {
                    if (j == k)
                        continue;
                    if (bouys[k].order == bouyB.order)
                        break;
                }
                
                // Get the centre of the pair
                bouyB.north = (bouyB.north + bouys[k].north) / 2;
                bouyB.east = (bouyB.east + bouys[k].east) / 2;
            }
            dist_c = norm2Dist(bouyA, bouyB);

            if (dist_c > dist) { // This distance is the longest
                dist = dist_c;
                bouy1 = bouyA;
                bouy2 = bouyB;
            }
        }
    }

    // Swap the bouys so that the lowest horizontal position is on the lowest bouy
    if (bouy1.east > bouy2.east) {
        var tmp = bouy1;
        bouy1 = bouy2;
        bouy2 = tmp;
    }

    // Calculate the Angle that we need to rotate so that these two horizontal
    screenUTMRange.rotation = -Math.atan2(bouy1.north - bouy2.north, bouy1.east - bouy2.east);

    // Correct 180 degrees if necessary
    if (screenUTMRange.rotation < -Math.PI / 2)
        screenUTMRange.rotation += Math.PI;
    if (screenUTMRange.rotation > Math.PI / 2)
        screenUTMRange.rotation -= Math.PI;

    screenUTMRange.bouy1 = bouy1;
    screenUTMRange.bouy2 = bouy2;
}


//This function will draw height lines on the screen {
Simulator.drawHeightLines = function(){
    // Clear the container
    $('#height-line-container').empty();

    var direction = (options.wind_direction + screenUTMRange.rotation * 180 / Math.PI);
    var screenWidth = this.$simulator.width();
    var screenHeight = this.$simulator.height();

    var dir_c = (0 + direction) / 180 * Math.PI;

    var x = screenWidth / 2;
    var y = screenHeight / 2;

    var z = 0;
    var steps = 6;

    var offY = screenHeight / steps;
    var offX = 0;
    var offYc = offY * Math.cos(dir_c);
    var offXc = -offY * Math.sin(dir_c);

    while (z < steps) {
        var element = $('<div/>').addClass('height-line');
        element.css('top', (y + (z * offYc)) + 'px');
        element.css('left', (x + (z * offXc)) + 'px');
        element.css('-ms-transform', 'rotate(' + direction + 'deg)');
        element.css('-webkit-transform', 'rotate(' + direction + 'deg)');
        element.css('transform', 'rotate(' + direction + 'deg)');
        $('#height-line-container').append(element);

        if (z > 0) {
            var element = $('<div/>').addClass('height-line');
            element.css('top', (y - (z * offYc)) + 'px');
            element.css('left', (x - (z * offXc)) + 'px');
            element.css('-ms-transform', 'rotate(' + direction + 'deg)');
            element.css('-webkit-transform', 'rotate(' + direction + 'deg)');
            element.css('transform', 'rotate(' + direction + 'deg)');
            $('#height-line-container').append(element);
        }
        z++;
    }
}

//This function will calculate the min and max x and y of the screen
Simulator.calculateScreenRange = function(){
    var i;

    // Calculate the boundary and center of the screen
    screenEastMax = 0;
    screenEastMin = Infinity;
    screenNorthMax = 0;
    screenNorthMin = Infinity
    for (i = 0; i < bouys.length; i++) {
        if (bouys[i].east > screenEastMax)
            screenEastMax = bouys[i].east;
        if (bouys[i].east < screenEastMin)
            screenEastMin = bouys[i].east;
        if (bouys[i].north > screenNorthMax)
            screenNorthMax = bouys[i].north;
        if (bouys[i].north < screenNorthMin)
            screenNorthMin = bouys[i].north;
    }
    screenEast = (screenEastMax + screenEastMin) / 2;
    screenNorth = (screenNorthMax + screenNorthMin) / 2;

    // Rotate all bouys around this position
    var rot = screenUTMRange.rotation; // This variable is just for shorter notation
    horMax = 0;
    verMax = 0;
    for (var i = 0; i < bouys.length; i++) {
        bouyEast = (bouys[i].east - screenEast) * Math.cos(rot) - (bouys[i].north - screenNorth) * Math.sin(rot);
        bouyNorth = (bouys[i].east - screenEast) * Math.sin(rot) + (bouys[i].north - screenNorth) * Math.cos(rot);
        if (Math.abs(bouyEast) > horMax)
            horMax = Math.abs(bouyEast);
        if (Math.abs(bouyNorth) > verMax)
            verMax = Math.abs(bouyNorth);
    }

    var factor = 1.6;
    screenUTMRange.centerEast = screenEast;
    screenUTMRange.centerNorth = screenNorth;

    var screenWidth = $('html').width();
    var screenHeight = $('html').height();
    if (screenWidth > screenHeight) {
        var screenFactor = screenWidth / screenHeight;
        screenUTMRange.rangeEast = Math.max(horMax / screenFactor, verMax) * screenFactor * factor;
        screenUTMRange.rangeNorth = Math.max(horMax / screenFactor, verMax) * factor;
    } else {
        var screenFactor = screenHeight / screenWidth;
        screenUTMRange.rangeEast = Math.max(horMax, verMax / screenFactor) * factor;
        screenUTMRange.rangeNorth = Math.max(horMax, verMax / screenFactor) * screenFactor * factor;
    }

    // Recalculate the screen center between the furthest horizontal bouys
    var screenHorMin = Infinity;
    var screenHorMax = -Infinity;
    for (i = 0; i < bouys.length; i++) {
        bouyEast = (bouys[i].east - screenEast) * Math.cos(rot) - (bouys[i].north - screenNorth) * Math.sin(rot);
        if (bouyEast < screenHorMin)
            screenHorMin = bouyEast;
        if (bouyEast > screenHorMax)
            screenHorMax = bouyEast;
    }
    screenUTMRange.centerEast += (screenHorMax + screenHorMin) / 2;
}

// This function draws the wavves
Simulator.drawWaves = function(){
    $waves_container = $('#waves-container');
    $waves_container.empty();

    for (var i = 0; i < 20; i++) {
        var wave = document.createElement('div');
        $(wave).addClass('wave').appendTo($waves_container);
    }
}


// This function alligns all directions of the waves north and wind arrows correctly.
Simulator.setArrows = function() {

    var $north = $('#north-arrow img');
    var $wind = $('#wind-arrow img');
    var $waves = $('#waves-container');

    north_direction = screenUTMRange.rotation * 180 / Math.PI;
    $north.css('-ms-transform', 'rotate(' + north_direction + 'deg)');
    $north.css('-webkit-transform', 'rotate(' + north_direction + 'deg)');
    $north.css('transform', 'rotate(' + north_direction + 'deg)');

    $wind.css('-ms-transform', 'rotate(' + (options.wind_direction + north_direction) + 'deg)');
    $wind.css('-webkit-transform', 'rotate(' + (options.wind_direction + north_direction) + 'deg)');
    $wind.css('transform', 'rotate(' + (options.wind_direction + north_direction) + 'deg)');

    $waves.css('-ms-transform', 'rotate(' + (options.wave_direction + north_direction) + 'deg)');
    $waves.css('-webkit-transform', 'rotate(' + (options.wave_direction + north_direction) + 'deg)');
    $waves.css('transform', 'rotate(' + (options.wave_direction + north_direction) + 'deg)');
}

//  bereken de afstand die de boten moeten afleggen
Simulator.calculateCourseLength = function(){		
    var tracker_data = tracker_data_list[0];
	for( j = 0; j < tracker_data.length; j++ ){
		if(j > 0 ) Simulator.courseLength += norm2Dist(tracker_data[j - 1],tracker_data[j]);			
	}		    
}	

Simulator.calculateRaceDuration = function(){
    this.race_duration = boats[0].raceDuration;
    
    for( i = 1; i < boats.length ; i++){
        if(boats[i].raceDuration < this.race_duration){
            Simulator.race_duration = boats[i].raceDuration;
        }
    }
}

Simulator.generateData = function(){
	// for each tracker_data trail of boat
	$.each(tracker_data_list, function(num_boat){	
		var boat_data = tracker_data_list[num_boat];
		// loop through all packets in array	
		$.each(boat_data, function(i){			
			// get current and next packet 
			var cur_point = boat_data[i];
			var target_point = boat_data[i+1];
			
			if(target_point == null) return false; // laatste package stop met berekenen.
			
			// get boat
			var boat = boats[num_boat];
			var speed = boat.speed;
	    	var $boat = boat.element;
	        var $boat_icon = $boat.find('.boat-icon');
			
			// calc direction
			var angle = toDegrees( getAngle(cur_point, target_point) );    	
	    	var general_direction = ( 270 - angle ) % 360 + toDegrees(screenUTMRange.rotation);
			
			// calc duration bouys
			var dist = norm2Dist(cur_point,target_point);
			var duration = dist / speed; // duration in ms 
			
			// voor de for loop definieren zodat deze voor de gehele for loop gelijk is
			var noise_factor = 2 * ( Math.random() * 2 - 1 ) * ( duration / 20 );
			
	    	for( time = 0; time < duration; time += 0.5 ){
	    		
	    		// De noise wordt kleiner naarmate je dichter bij de boei komt
	    		var p = time / duration;
	    		var noise_amount = Math.sin( 2 * Math.PI * p ) * noise_factor; 
	        	var noise_north = 0.5 * ( Math.random() * 2 - 1 ) + noise_amount;// random = -1 of 1
	        	var noise_east = 0.5 * ( Math.random() * 2 - 1 ) + noise_amount;
	        	
	        	// calc new data point with rendered noise 
	            var calc_north = cur_point.north + noise_north + ( Math.cos(toRadians(general_direction)) * speed * time );
	            var calc_east = cur_point.east + noise_east + ( Math.sin(toRadians(general_direction)) * speed * time );
	    		
	            // convert to pixels 
	            var target = convertToPixels($boat_icon, calc_east, calc_north);				      
	            
				// create point obj
	            var new_point = {
	            		north : calc_north,
	            		east : calc_east,
	            		top : target.top,
	            		left: target.left,
	            		direction : general_direction
	            	} 
	            
	            // alleen het eerste punt een status, anders krijg je heel veel geronde boeien
	            if(	time == 0 ){
	            	new_point.status = cur_point.status
	            } else{
	            	new_point.status = null;
	            }

	            // store calculated datapoint
	            generated_data[num_boat].push(new_point);

	    	}				
		});		
	});
}