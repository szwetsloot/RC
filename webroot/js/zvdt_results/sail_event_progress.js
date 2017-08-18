var Progress = {
	r1 : 900,
	r2 : 810,
	r3 : 810,
	r4 : 900,
	course : [ 900, 810, 810, 900 ],
	course_length : this.r1 + this.r2 + this.r3 + this.r4,	
}

Progress.drawCourse = function(){
	$track = $('#course-track');
	$bouys = $track.find('.bouy');
	//TODO calc the leg distances with our norm2Dist function
	// nog niet gedaan omdat je door gecombineerde boeien niet eenvoudig door de boeien kunt loopen
}

Progress.moveBoats = function(){

	setTimeout( Progress.moveBoats,500);
	
	// abort when the location hasn't been calculated yet
	if( boats[0].location < 0 ||  boats[0].location == null )return false;

	$track = $('#course-track');
	$boats = $track.find('.position');
	
	for( i = 0; i < boats.length; i++){
		var boat = boats[i];
		var bouys_rounded = boat.bouyHistory.length; 
		var distance_boat = 0;
		
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
		var perc_course = (( 3420 - distance_boat ) / 3420 ) * 100; 

		$track.find('#boat-'+boat.id).animate({'top':perc_course+'%'},500);
		
	}

}