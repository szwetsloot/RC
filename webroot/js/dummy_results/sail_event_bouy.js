/*
 * BOUY METHODS
 *
 * move();
 * boatEntered();
 * rounded();
 * targetNextBouy();
 *
 */

// Bouy object
function Bouy(i) {
    this.id = bouys[i].id;
    this.north = bouys[i].north;
    this.east = bouys[i].east;
    this.left = null,
    this.top = null,
    this.num = i; 
    this.name = bouys[i].name // vb: 3B
    this.order = bouys[i].order,
    this.type = bouys[i].type;
    this.prev = bouys[i].prev;
    this.element = $('#bouy-' + this.id);
    this.boatsEntered =[];
    this.boatsRounded =[];
}

Bouy.prototype = {
	'move': function () { // This method will move the bouys to their  correct location on the screen
        var target = convertToPixels(this.element, this.east, this.north); // requires Simulator.calculateLongestDistanceBouys
        this.element.css('left', target.left + 'px');
        this.element.css('top', target.top + 'px');
        this.top = target.top;
        this.left = target.left;
    },
    'boatEntered': function (boat) {
    	var ref = this;        
    	if( boat.firstBoat ){  		
    		Simulator.zoomBouy(ref.element);  
    		Dashboard.showBouyInfoPanels(boat,ref); 
    	}	
        boat.activeBouyNum = this.num;
        this.boatsEntered.push(boat.id);
    },
    'rounded': function(boat) { // This method is called when a boat leaves this bouy.
        this.boatsRounded.push(boat.id);
    	Dashboard.bouyRounded(boat,this);  // Talk to dashboard    
    }, 
    'targetNextBouy' : function(){
    	var ref = this;
    	$('.bouy').removeClass('active');	
    	for( i = 0; i < bouys.length; i++){
    		if( bouys[i].order == ( ref.order + 1 ) ){ 
    			bouys[i].element.addClass('active');}
    	};
    }
}
