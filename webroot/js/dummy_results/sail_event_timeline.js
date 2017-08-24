var Timeline =  {
		
}

Timeline.init = function(){	
	this.$timeline = $('#timeline .track');
	this.$draggable = $('#draggable .current');	
	this.data = generated_data.slice().sort(function(a, b){ return a.length - b.length; })[0];
	this.draw();
	this.animateDraggableToggle(0);
}


// TODO ani time werkt niet goed 
// Als je de toggle naar een boei beweegt staat hij echter wel op het goede punt
Timeline.animateDraggableToggle = function(data_point){	
	var percentage = 1 - ( data_point / this.data.length );	
	var ani_time = ( Math.round( Simulator.race_duration * percentage ) / options.simulation_speed ) * 1000;
	this.$draggable.animate({left:'100%'}, ani_time)
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
		 		Timeline.$draggable.stop();		 	
		 },
		 stop: function() {
		 		Simulator.resetZoom();		 		        
            	$('#trail-container').empty();
	            var position = $(this).position().left;
	            var percentage = position / $(this).parent().width();	
	            //console.log(position);	 		        
		        var to_time = Math.abs( Math.round( Timeline.data.length * percentage )); // abs voor als de position kut doet en net op -1px staat
		        Timeline.animateDraggableToggle(Timeline.data.length * percentage );
		        if( race_stopwatch != null ) race_stopwatch.set( Math.round(to_time/2) );
		        
		        $.each(boats,function(i){
		        	boats[i].element.stop();
		        	boats[i].move(to_time);
		        });
		      }
	 });
	 
	 $('#toggle-timeline').on('click',function(){
		 
	 });
	 
 });



