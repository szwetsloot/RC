var Progress = {
}

Progress.init = function(){
	// DRAW THE COURSE
	var ref = this;
	$track = $('#course-track');
	$timeline = $('#timeline .track');
	$bouys = $track.find('.bouy');
	
	this.r1 = norm2Dist(bouys[0],bouys[2]);
	this.r2 = norm2Dist(bouys[2],bouys[4]);
	this.r3 = norm2Dist(bouys[4],bouys[2]);
	this.r4 = norm2Dist(bouys[2],bouys[0]);
	
	this.course = [ this.r1 , this.r2, this.r3, this.r4 ];
	this.course_length = this.r1 + this.r2 + this.r3 + this.r4;
	
	this.$container = $('#course-progress');
	this.$track = $('#course-track');
	
	$.each(bouys, function(i){
		var bouy = bouys[i];
		
		if(bouy.id == 1){ // start
			$track.find('#bouy-'+bouy.id).css('top','100%');
		} else if( bouy.id == 7 ){ // finish
			$track.find('#bouy-'+bouy.id).css('top','0%');
		} else{	
			var distance_bouy = 0;
			
			for( j = 0; j < bouy.order - 1; j++){
				distance_bouy += Progress.course[j];
			}
			
			var perc_course = (( ref.course_length - distance_bouy ) / ref.course_length ) * 100; 

			$track.find('#bouy-'+bouy.id).css('top','calc( '+perc_course+'% - 10px )');			

		}
	});

	Progress.moveBoats();	
}

/*
 *  by: Progress.init(); 
 */
Progress.moveBoats = function(){
	
	setTimeout(function(){ 
		if( Simulator.running ) Progress.moveBoats();
	}, 500);    

	var ref = this;
	var course_length = this.course_length;
	
	// abort when the location hasn't been calculated yet
	if( boats[0].location < 0 ||  boats[0].location == null ) return false;
	
	$.each( boats,function(i){
		var boat = boats[i];
		var bouys_rounded = ( boat.location != null )? boat.location - ( boat.location % 1 ) : 0;
		var distance_boat = 0;
		
    	if( boat.running == false || boat.finished ){ 
    		ref.$track.find('#boat-'+boat.id).css('top',0);
    	}		
		
		// boat.location  // 0 / 0.5 / 1.5
		var progress_cur_bouy = boat.location % 1;
		if( progress_cur_bouy == 0 ) progress_cur_bouy = boat.location;
		
	
		// tel de afstand van de al gevaren rakken op bij de totale afstand 
		if(bouys_rounded > 0){
			for( i = 0; i < bouys_rounded; i++){
				distance_boat += Progress.course[i];
			}
		}
		
		
		// bereken afstand huidige rak
		distance_boat += Progress.course[bouys_rounded] *  progress_cur_bouy; 
		var perc_course = (( course_length - distance_boat ) / course_length ) * 100; 
		
		ref.$track.find('#boat-'+boat.id).css('top',perc_course+'%');
		
		// geef de positie van de eerste boot door
		//if( boat.position == 0 ) ref.moveTrack( perc_course );
		
	});

}

Progress.moveTrack = function (perc){	
	if( perc < 10 ){
		this.$track.css('transform',' translateY(20px)');
		return false;
	}
	
	var offset = ( $track.height() * ( perc / 100 ) ) - ( this.$container.height() / 2 );		
	if( ( offset / $track.height() ) < 0.7 && offset > 0 ) this.$track.css('transform',' translateY(-'+offset+'px)');
}