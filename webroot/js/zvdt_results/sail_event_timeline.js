$( function() {
	 $( "#draggable .current" ).draggable({
		 axis:'x', 
		 containment : 'parent',
		 stop: function() {
	            var position = $(this).position().left - $(this).parent().position().left;
	            var percentage = position / $(this).parent().width();
		        console.log('position:'+percentage);
		      }
	 });
	 
	 $('#toggle-timeline').on('click',function(){
		 
	 });
	 
 });