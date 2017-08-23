var pre_start = [/*{		
		lat : 52.106620,
		lng : 4.25359,
		east : 585853.36,
		north : 5773638.13,
	},{
		lat : 52.106177,
		lng : 4.253681,
		east : 585860.44,
		north : 5773588.97,
	},{
		lat : 52.106135,
		lng : 4.253744,
		east : 585864.83,
		north : 5773584.37,
	},{
		lat : 52.106135,
		lng : 4.253841,
		east : 585871.48,
		north : 5773584.49,
	},{
		lat : 52.106152,
		lng : 4.253924,
		east : 585877.13,
		north : 5773586.48,
	},{
		lat : 52.106212,
		lng : 4.253952,
		east : 585878.93,
		north : 5773593.18,
	},*/{
		lat : 52.106673,
		lng : 4.253871,
		east : 585872.50,
		north : 5773644.36,
	},{
		lat : 52.106704,
		lng : 4.253770,
		east : 585865.52,
		north : 5773647.69,
	},{
		lat : 52.106701,
		lng : 4.253658,
		east : 585857.86,
		north : 5773647.22,
	}];

// STARTLIJN
var start_A = [{
	lat : 52.106505,
	lng : 4.253491, 
	east : 585846.80,
	north : 5773625.22,
	status : 'started'
}];


var start_B = [{
	lat: 52.106399, 
	lng : 4.253471,
	east : 585845.63,
	north : 5773613.41,
	status : 'started'
}];

var start_C = [{
	lat: 52.106596, 
	lng : 4.253471,
	east : 585845.25,
	north : 5773635.32,
	status : 'started'
}];

var start_D = [{
	lat: 52.106277, 
	lng : 4.253471,
	east : 585845.86,
	north : 5773599.84,
	status : 'started'
}];

var finish_D = [{
	lat: 52.106277, 
	lng : 4.253471,
	east : 585845.86,
	north : 5773599.84,
	status : 'finished'
}];

var rak_1A = [{
			lat : 52.106012,
			lng : 4.251538,
			east : 585713.99,
			north : 5773568.09,
		},{
			lat : 52.106797,
			lng : 4.249585,
			east : 585578.74,
			north : 5773653.09,
		}];

var rak_1B = [{
		lat : 52.106175, 
		lng : 4.251947,
		east : 585741.69,
		north : 5773586.70,
	},{
		lat : 52.106927,
		lng : 4.249803,
		east : 585593.42,
		north : 5773667.80,
	}];

var rak_1C = [{
		lat : 52.106095,
		lng : 4.251604,
		east : 585718.35,
		north : 5773577.39,
	},{
		lat : 52.106807,
		lng : 4.249914,
		east : 585601.25,
		north : 5773654.59,
	}];

var rak_1D = [{
		lat : 52.105904,
		lng : 4.251534,
		east : 585713.93,
		north : 5773556.07,
	},{
		lat : 52.106932,
		lng : 4.249522,
		east : 585574.17,
		north : 5773668.03,
	}];


var round_bouy3B = [{
	lat : 52.106106,
	lng : 4.252915,
	east : 585808.12,
	north : 5773580.17,
	status : 1
},{
	lat : 52.106018,
	lng : 4.252911,
	east : 585808.01,
	north : 5773570.37,
},{
	lat : 52.105954,
	lng : 4.252806,
	east : 585800.94,
	north : 5773563.13,
},{
	lat : 52.105978,
	lng : 4.252650,
	east : 585790.21,
	north : 5773565.62,
	status : 2
}];

var rak_2A = [{
		lat : 52.106078,
		lng : 4.250014,
		east : 585609.50,
		north : 5773573.63,
	}];


var rak_2B = [{
	lat : 52.105906,
	lng : 4.250295,
	east : 585629.07,
	north : 5773554.83,
},{
	lat : 52.106450,
	lng : 4.252173,
	east : 585756.64,
	north : 5773617.55,
}];

var rak_2C = [{
	lat : 52.106642, 
	lng : 4.252666,
	east : 585790.03,
	north : 5773639.49,
}];


var rak_2D = [{
	lat : 52.106207,
	lng :  4.250424,
	east : 585637.33,
	north : 5773588.46,
},{
	lat : 52.106486, 
	lng : 4.252411,
	east : 585772.87,
	north : 5773621.83,
}];

var rak_3A = [{
		lat : 52.106451,
		lng : 4.250585,
		east : 585647.89,
		north : 5773615.79,
	},{
		lat : 52.106932,
		lng : 4.249522,
		east : 585574.17,
		north : 5773668.03,
	}];

var rak_3B = [{
	lat : 52.106306, 
	lng : 4.250531,
	east : 585629.58,
	north : 5773604.79,
},{
	lat : 52.106807,
	lng : 4.249914,
	east : 585601.25,
	north : 5773654.59,
}];

var rak_3C = [{
		lat : 52.106451,
		lng : 4.250585,
		east : 585647.89,
		north : 5773615.79,
	},{
		lat : 52.106927,
		lng : 4.249803,
		east : 585593.42,
		north : 5773667.80,
	}];

var rak_3D = [{
	lat : 52.106355,
	lng : 4.250315,
	east : 585629.58,
	north : 5773604.79,
},{
	lat : 52.106797,
	lng : 4.249585,
	east : 585578.74,
	north : 5773653.09,
}];

rak_4A = [{ // + rak 2
		lat : 52.106454,
		lng : 4.251881,
		east : 585736.64,
		north : 5773617.65,
	},{
		lat : 52.106157,
		lng : 4.252890,
		east : 585806.31,
		north : 5773585.81,
	}];

rak_4B = [{ // + rak 2
	lat : 52.106491,
	lng : 4.251647,
	east : 585720.54,
	north : 5773621.49,
},{
	lat : 52.106313, 
	lng : 4.252923,
	east : 585808.27,
	north : 5773603.20,
}];

rak_4C = [{ // + rak 2
	lat : 52.106367,
	lng : 4.251762,
	east : 585728.65,
	north : 5773607.83,
},{
	lat : 52.106273,
	lng : 4.253095,
	east : 585820.12,
	north : 5773598.95,
}];

rak_4D = [{ // + rak 2
	lat : 52.106499,
	lng : 4.252277,
	east : 585763.67,
	north : 5773623.12,
},{
	lat : 52.106234, 
	lng : 4.252773,
	east : 585798.15,
	north : 5773594.23,
}];

 

var finish = [{	
		lat : 52.106314,
		lng : 4.253473,
		east : 585845.93,
		north : 5773603.96,
	}];

var after_finish = [{
		lat : 52.106509,
		lng : 4.254344,
		east : 585905.21,
		north : 5773626.68,
	}];

var round_bouy2 = [{
			lat: 52.106686,  
			lng: 4.249315,
			east: 585560.46,
			north: 5773640.42,
			status : 1
		},{	
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
			north : 5773601.03,
			status : 2
		}];

var round_bouy3A = [{
		lat : 52.106707,
		lng : 4.252731,
		east : 585794.36,
		north : 5773646.79,
		status : 1
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
		north : 5773666.34,
		status : 2
	}];

// spoor 1 = boot nr 4
// spoor 2 = boot nr 2
// spoor 3 = boot nr 3
// spoor 4 = boot nr 1

var tracker_data_1 = pre_start.concat(start_A, rak_1C, round_bouy2, rak_2A, round_bouy3A, rak_3A, round_bouy2, rak_4A, finish_D, after_finish);
var tracker_data_2 = pre_start.concat(start_B, rak_1A, round_bouy2, rak_2B, round_bouy3B, rak_3B, round_bouy2, rak_4B, finish_D, after_finish);
var tracker_data_3 = pre_start.concat(start_C, rak_1B, round_bouy2, rak_2C, round_bouy3A, rak_3C, round_bouy2, rak_4C, finish_D, after_finish);
var tracker_data_4 = pre_start.concat(start_D, rak_1D, round_bouy2, rak_2D, round_bouy3B, rak_3D, round_bouy2, rak_4D, finish_D, after_finish);

var tracker_data_list = [];
tracker_data_list.push( tracker_data_1 );
tracker_data_list.push( tracker_data_2 );
tracker_data_list.push( tracker_data_3 );
tracker_data_list.push( tracker_data_4 );

//var tracker_data = start;