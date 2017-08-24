var Timeline =  {
		
}

Timeline.init = function(){
	var race_duration = boats[0].raceDuration
	
	for( i = 0; i < boats.length ; i++){
		if(boats[i].raceDuration < race_duration){
			race_duration = boats[i].raceDuration;
		}
	}
	
	console.log('shortest race'+race_duration);
	
	
}

$( function() {
	 $( "#draggable .current" ).draggable({
		 axis:'x', 
		 containment : 'parent',
		 stop: function() {
	            var position = $(this).position().left - $(this).parent().position().left;
	            var percentage = position / $(this).parent().width();
		 
		        generated_data.sort(function(a, b){ return b.length - a.length; });
		        var to_time = Math.abs( Math.round(generated_data[0].length * percentage )); 
		        $.each(boats,function(i){
		        	boats[i].element.stop();
		        	boats[i].move(to_time);
		        });
		      }
	 });
	 
	 $('#toggle-timeline').on('click',function(){
		 
	 });
	 
 });



