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
    	//console.log('bouy entered');
        // This method is called when a boat entered this bouy.
        // First boat activates the next bouy
    	// if(boat.position == 1) Dashboard.activateBouy(boat,this);    	
    },
    'rounded': function(boat) {
    	var ref = this;
    	// This method is called when a boat left this bouy.
    	// Talk to dashboard       
    	Dashboard.bouyRounded(boat,this);    
    	if( boat.position == 0 ){
    		ref.targetNextBouy(); 
    	}
    	
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
