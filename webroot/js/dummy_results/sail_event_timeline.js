var Timeline =  {
		timeout : null,
}

Timeline.init = function(){	
	this.$timeline = $('#timeline .track');
	this.$draggable = $('#draggable .current');	
	this.data = generated_data.slice().sort(function(a, b){ return a.length - b.length; })[0];
	this.draw();
	this.animateDraggableToggle();
}



// check every 500 ms the position of the datapoint
Timeline.animateDraggableToggle = function(){	
	Timeline.timeout = setTimeout(Timeline.animateDraggableToggle,500);
	
	var data_point = boats[2].currentDummyPacket;
	var percentage = ( data_point / Timeline.data.length ) * 100;	
	Timeline.$draggable.css('left', percentage+'%');
}

Timeline.draw = function(){
	this.bouy_order = []

	// get the datapoints of the start, bouys and finish
	for( i = 0; i < this.data.length; i++ ){
		// FYI status 2 = bouy rounded && status 1 = bouy entered
		if( this.data[i].status != null && this.data[i].status != 1 ){
			var p = i/this.data.length;
			this.bouy_order.push(p)
		} 
	}

	for( i = 0; i < this.bouy_order.length; i++ ){
		perc_course = this.bouy_order[i] * 100;
		this.$timeline.find('.bouy').eq(i).css('left', perc_course+'%');
	}
}

$( function() {
	 $( "#draggable .current" ).draggable({
		 axis:'x', 
		 containment : 'parent',
		 start : function(){
		 		Timeline.$draggable.stop();	// stop animating 
		 		clearTimeout(Timeline.timeout);	
		 		Timeline.$draggable.removeClass('ease-transform-fast');
		 },
		 stop: function() {
		 		Simulator.resetZoom();		 		        
            	$('#trail-container').empty();
	            var position = $(this).position().left;
	            var percentage = position / $(this).parent().width();	     
		        var to_time = Math.abs( Math.round( Timeline.data.length * percentage )); // abs voor als de position kut doet en net op -1px staat		        

		        if( race_stopwatch != null ){
					race_stopwatch.set( Math.round(to_time/2) );
		        } else{
		        	race_stopwatch = new Stopwatch('#race-time','race tijd'); 
		        	race_stopwatch.set( Math.round(to_time/2) );
		        }
		        
		        $.each(boats,function(i){
		        	boats[i].element.stop();
		        	boats[i].move(to_time);
		        });

				Timeline.animateDraggableToggle();
		 		Timeline.$draggable.addClass('ease-transform-fast');

		 		// set timers

		      }
	 });
	 
	 $('#toggle-timeline').on('click',function(){
		 
	 });
	 
 });



