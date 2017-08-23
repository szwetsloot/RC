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
    	var ref = this;
        // First boat activates the next bouy
    	if( boat.firstBoat ){    		
    		Dashboard.zoomBouy(ref.element);  
    		Dashboard.activateBouy(boat, ref); 
    	}	
    },
    'rounded': function(boat) { // This method is called when a boat left this bouy.
    	var ref = this;

    	if( boat.firstBoat ){
    		Dashboard.startBouyCounter(ref.name);	// start the counter for this bouy	
    		
    		setTimeout(function(){
    			Dashboard.resetZoom(); // zoom out
    			ref.targetNextBouy(); // set alleen de css class + dashed yellow border
    		},5000);    	
    	}
    	
    	// Talk to dashboard         
    	Dashboard.bouyRounded(boat,this); 
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
