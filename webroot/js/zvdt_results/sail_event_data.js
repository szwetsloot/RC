var start = [
		{	
			lat : 52.106484,  /// Start
			lng : 4.253809,
			east : 585847.63,
			north : 5773580.96
		},{
			lat : 52.105439,
			lng : 4.251891,
			east : 585739.27,
			north : 5773504.77
		},{	
			lat : 52.106775,
			lng : 4.249575,
			east : 585578.10,
			north : 5773650.63
		}];

var finish = [{	
		lat : 52.106484,  /// Start/finish
		lng : 4.253809,
		east : 585847.63,
		north : 5773580.96
	}];

var round_bouy2 = [{	
			lat : 52.106560, // BEGINNEN RONDEN BOEI 2
			lng : 4.249043,
			east : 585542.08,
			north : 5773626.09
		},{	
			lat : 52.106533,
			lng : 4.248997,
			east : 585538.98,
			north : 5773623.03
		},{	
			lat : 52.106484,
			lng : 4.248962,
			east : 585536.67,
			north : 5773617.54
		},{	
			lat : 52.106426,
			lng : 4.248965,
			east : 585536.99,
			north : 5773611.09
		},{		
			lat : 52.106393,
			lng : 4.248999,
			east : 585539.38,
			north : 5773607.46
		},{	
			lat : 52.106362,
			lng : 4.249047,
			east : 585542.73,
			north : 5773604.07
		},{	
			lat : 52.106350,
			lng : 4.249108,
			east : 585546.93,
			north : 5773602.81
		},{	
			lat : 52.106333, // BOUY 2 ROUNDED
			lng : 4.249202,
			east : 585553.40,
			north : 5773601.03
		}];

var round_bouy3 = [{
		lat : 52.106707,
		lng : 4.252731,
		east : 585794.36,
		north : 5773646.79
	},{
		lat : 52.106725,
		lng : 4.252828,
		east : 585800.97,
		north : 5773648.91,
	},{
		lat : 52.106766,
		lng: 4.252885,
		east : 585804.79,
		north : 5773653.54,
	},{
		lat : 52.106809, 
		lng : 4.252885,
		east : 585804.71,
		north : 5773658.32,
	},{
		lat : 52.106863, 
		lng : 4.252863,
		east : 585803.10,
		north : 5773664.30,
	},{
		lat : 52.106901, 
		lng : 4.252798,
		east : 585798.58,
		north : 5773668.45,
	},{
		lat : 52.106883, 
		lng : 4.252710,
		east : 585792.59,
		north : 5773666.34
	}];

var tracker_data = start.concat( round_bouy2, round_bouy3, round_bouy2, finish);
