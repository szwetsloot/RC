var Timeline =  {
		
}

Timeline.init = function(){	
	this.$timeline = $('#timeline .track');
	this.$draggable = $('#draggable .current');	
	this.data = generated_data.sort(function(a, b){ return a.length - b.length; })[0];
	this.draw();
	this.animateDraggableToggle(0);
}

Timeline.animateDraggableToggle = function(data_point){	
	var percentage = 1 - ( data_point / this.data.length );	
	var ani_time = ( Math.round( Simulator.race_duration * percentage ) / options.simulation_speed ) * 1000;
	console.log(ani_time);
	this.$draggable.animate({left:'100%'}, ani_time)
}

Timeline.draw = function(){
	this.bouy_order = []

	// get the datapoints of the start, bouys and finish
	for( i = 0; i < this.data.length; i++ ){
		// FYI status 2 = bouy rounded > niet interessant voor deze
		if( this.data[i].status != null && this.data[i].status != 2 ){
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
	            var position = $(this).position().left - $(this).parent().position().left;
	            var percentage = position / $(this).parent().width();		 		        
		        var to_time = Math.abs( Math.round( Timeline.data.length * percentage )); // abs voor als de position kut doet en net op -1px staat
		        Timeline.animateDraggableToggle(to_time);

		        $.each(boats,function(i){
		        	boats[i].element.stop();
		        	boats[i].move(to_time);
		        });
		      }
	 });
	 
	 $('#toggle-timeline').on('click',function(){
		 
	 });
	 
 });



