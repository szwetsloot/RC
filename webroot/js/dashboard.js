var dashboard = (function() { 
	
	events.on('PageReady',getDates);
	events.on('PageReady',getUsersStats);
	events.on('UsersReady',setProfiteur);
	events.on('UsersReady',setProfits);
	
	function setProfiteur(){
		
		if( !$('body').hasClass('dashboard-page')  && !$('body').hasClass('index-page') ) return false;
		
		$container = $('#profiteur-container');
		$name = $container.find('h3');
		$img = $container.find('.profiteur-img');
		$stats = $container.find('span');
		
		var profiteur_data = compareValue(user.complete,'profit');
		var profiteur_index = profiteur_data[2];
		var profiteur_id = user.complete[profiteur_index].id;
		var profiteur_name = user.complete[profiteur_index].last_name; 
		var profit = Math.round(profiteur_data[3] * 100) / 100;
		
		var src = 'http://graph.facebook.com/'+ profiteur_id +'/picture?type=large';
		
		$name.text(profiteur_name);
		$img.attr('src',src);
		$stats.html('Heeft <strong>'+ profit +'L</strong> op andermans kosten gezopen');
	}
	
	function setProfits(){
		
		if( !$('body').hasClass('dashboard-page')  && !$('body').hasClass('index-page') ) return false;
		
		var names = []
		var drunk = [];
		var bought = [];
		
		// CHART 4 staafdiagram horizontale bar met gedronken/gekocht
		$.each(user.complete,function(i){
			var cur_user = user.complete[i];
			names.push(cur_user.last_name);
			drunk.push( cur_user.saldo.toFixed(2) ) ;
			bought.push( cur_user.bought.toFixed(2) );
		});
		
		new Chartist.Bar('.barChart', {
		  labels: names,
		  series: [
		    drunk,
		    bought
		  ]
		}, {
		  seriesBarDistance: 11,
		  horizontalBars: true,
		  height: 350,
		  axisY: {
			    offset: 80
			  }
		});
		
		var trim_bought = bought;
		var trim_names = names;
		var trim_drunk = drunk;
		
		// trim boring data for radar chart
		$.each(trim_bought,function(i){
			var value = trim_bought[i];
			if( value == 0 ){
				// get index 
				var index = trim_bought.indexOf(value);
				
				// trim arrays
				trim_bought.splice(index,1);
				trim_names.splice(index,1);
				trim_drunk.splice(index,1);
			}
		});
		// if bought = 0;
		// get index
		
		// remove names, drunk & bought

		// RADAR CHART
		var ctx = document.getElementById("myRadarChart").getContext("2d");
		
		var data = {
			    labels: trim_names,
			    datasets: [
			        {
			            label: "Gezopen",
			            fillColor: "rgba(220,220,220,0.2)",
						strokeColor: "rgba(220,220,220,1)",
						pointColor: "rgba(220,220,220,1)",
						pointStrokeColor: "#fff",
						pointHighlightFill: "#fff",
						pointHighlightStroke: "rgba(220,220,220,1)",
			            data: trim_drunk
			        },
			        {
			            label: "Gekocht",
			            fillColor: "rgba(151,187,205,0.2)",
						strokeColor: "rgba(151,187,205,1)",
						pointColor: "rgba(151,187,205,1)",
						pointStrokeColor: "#fff",
						pointHighlightFill: "#fff",
						pointHighlightStroke: "rgba(151,187,205,1)",
			            data: trim_bought
			        }
			    ]
			};
		
		var myRadarChart = new Chart(ctx).Radar(data,{responsive : true});
				
	}
		
	function getDates(){
		
		if( !$('body').hasClass('dashboard-page')  && !$('body').hasClass('index-page') ) return false;
			
		$.get('dashboard/getDates', function(response) {
			//console.log(response);
			liters = 0;
			var data = [];
			var d = new Date(); // juni = 5 // jan = 0
			
			var months = ['Apr','Mei','Jun','Jul','Aug','Sept','Okt','Nov','Dec','Jan','Feb', 'Mrt','Apr','Mei','Jun','Jul','Aug','Sept','Okt','Nov','Dec','Jan','Feb', 'Mrt'];
			
			// function to calculate the amount of months from the start 
			function countMonths(date){
				  var a = new Date('2016-04-01 07:19:28'); // START WEBSITE:  datum van eerste fles 
				  var b = new Date(date);

				  var months = (b.getFullYear() - a.getFullYear()) * 12; // Months between years.
				  months += b.getMonth() - a.getMonth(); // Months between... months.

				  return (months); // add current month
			}

			var cur_date = new Date();
			
			var length_graph = countMonths(cur_date) + 1;
			
			// create a array with the length of all arrays to store number of bottles for each month
			for( i = 0; i < length_graph; i++ ){
				// datum = [0,0,0,0,0,0,0,0,0,0];
				// response is list of the colum dates of all bottles
				data.push(0);
			}	
						
			// loop trough dates from database
			$.each(response, function(i){

				var pos_array = countMonths(response[i].date);
				
				data[pos_array] += 1;
								
				liters += parseInt(response[i].size) / 100;
				
				// full date				
				var datum = response[i].date.split(" ")[0];
				//console.log('datum:'+datum);
				var year = datum.split("-")[0];
				var month = datum.split("-")[1];
				var day = datum.split("-")[2];
				
			});
						
			// website begonnen in april 
			var labels = months.slice(0,data.length);		
			var series = data;
			
			// select graph element
			var flowBottles = $(".aantal-borrels").get(0).getContext("2d");
						
			var data = {
				labels : labels,
				datasets : [{
					label : "Aantal Flessen",
					fillColor : "rgba(220,220,220,0.2)",
					strokeColor : "rgba(220,220,220,1)",
					pointColor : "rgba(220,220,220,1)",
					pointStrokeColor : "#fff",
					pointHighlightFill : "#fff",
					max : 12,
					pointHighlightStroke : "rgba(220,220,220,1)",
					data : series
				}]
			};
			
			var options = {
				responsive : true
			};
			
			var myLineChart = new Chart(flowBottles).Line(data, options);
						
			$('td.amount-liters').text(liters.toFixed(1)+' L');
			
		}, 'json');
	}
	
	// get XP users
	function getUsersStats(){
		// only run on dashboard page
		if( !$('body').hasClass('dashboard-page') && !$('body').hasClass('index-page') ) return false;
		
		var bottles = [];
		var bottlesLabels = [];
		var xps = [];
		var xpsLabels = [];
		var trophies = [];
		var trophiesLabels = [];
		var totalBottles = 0; 
		var totalTrophies = 0; 
		
		// THIS OBJECT IS ALREADY SET USING USERS.COMPLETE
		$.get('dashboard/getUsers', function(response) {
			//alert(JSON.stringify(response));
									
			for(var i = 0; i < response.length; i++){
				var lastName = response[i].last_name;
				var bottle = response[i].bottles;
				var xp = response[i].xp;
				var tax = response[i].tax;
				var trophie = response[i].trophies;
				
				if(bottle != null && bottle > 0){
					bottles.push( bottle );
					bottlesLabels.push( lastName );
					totalBottles += parseInt(bottle);
				}
				if(xp != null && xp > 0){
					if( tax == 1)
						xp /= 2;
					xps.push( xp );
					xpsLabels.push( lastName );
				}
				if(trophie != null && trophie > 0){
					trophies.push( trophie );
					trophiesLabels.push( lastName );
				}
				
				if(response[i].most == 1){
					mostBottlesUser = lastName;
				}
				
				if(response[i].koning == 1){
					stoliKoning = lastName;
				}
				
			}
			
			$('td.amount-bottles').text(totalBottles);
				
			totalUsers = response.length;
			$('td.amount-users').text(totalUsers);
			
			if(totalBottles == 0){ 	
				showAlert('error','Er zijn geen flessen gevonden in de Database. Voeg een fles Stoli toe om te statistieken op deze pagina te berekenen!');
				return false;
			}
						
			mostXP = xps.indexOf(Math.max.apply(Math, xps).toString());
			mostXPUser = xpsLabels[mostXP];		
			
			$('td.most-xp').text(mostXPUser);
			
			if(typeof mostBottlesUser != 'undefined') 
				$('td.most-bottles').text(mostBottlesUser);
						
			if(typeof stoliKoning != 'undefined') 			
				$('td.stoli-koning').text(stoliKoning);
			
			
			// GET USER LEVEL
			var user_level = user.returnLevel(xps[mostXP]);
			
			$('td.most-level').text(user_level);
			
			
			
			// CHART 2 VERDELING FLESSEN
			var data = [];
			
			$.each(bottles,function(i){
				var opacity = Math.pow(0.8 , i + 1 );
				
				label = {
							label : bottlesLabels[i],
							value : bottles[i],
							color: "rgba(75,192,192,"+ opacity +")"
						}
				
				data.push(label);
			});
		
			var oneBottles = $(".verdeling-flessen").get(0).getContext("2d");
			
			var myLineChart = new Chart(oneBottles).Doughnut(data,{responsive : true});
			
			// CHART 3 XPS and trophies
			new Chartist.Bar('.horBarChart', {
			  labels: xpsLabels,
			  series: [
			    xps
			  ]
			}, {
			  seriesBarDistance: 10,
			  reverseData: true,
			  height: 220,
			  horizontalBars: true,
			  chartPadding: {
			    right: 40
			  },
			  axisY: {
			    offset: 70
			  }
			});
			
			
			
			
		}, 'json');
	}
	
	
})();
