<?php
/**
* Test page will which show where the tracker is right now
*/
?>
<?= $this->Html->script('http://code.jquery.com/jquery.min.js') ?>
<?= $this->Html->script("https://maps.googleapis.com/maps/api/js?key=AIzaSyAdnyJXKONouXBKSEg0XPooslt47VygDgM") ?>

<div id='map'></div>
<div id='right'>
	<h1>Tracker data</h1>
	<table>
		<tr>
			<td>Packet #</td>
			<td><?= $tracker->id ?></td>
		</tr>
		<tr>
			<td>Last packet</td>
			<td><?= $tracker->time ?></td>
		</tr>
		<tr>
			<td>GPS connection</td>
			<td><?= $tracker->GPSConnection ?></td>
		</tr>
		<tr>
			<td>Longitude</td>
			<td><?= $tracker->longitude ?></td>
		</tr>
		<tr>
			<td>Latitude</td>
			<td><?= $tracker->latitude ?></td>
		</tr>
		<tr>
			<td>Heading</td>
			<td><?= round($tracker->heading * 10) / 10 ?></td>
		</tr>
		<tr>
			<td>Velocity</td>
			<td><?= $tracker->velocity ?></td>
		</tr>
		
	</table>
</div>

<script>

	var tracker = <?= json_encode($tracker) ?>;
	var marker;

  var googleMap;
  function initMap() {
    googleMap = new google.maps.Map(document.getElementById('map'), {
      center: {lat: <?=$tracker->latitude ?>, lng: <?= $tracker->longitude ?>},
      zoom: 15
    });
    marker = new google.maps.Marker({
			position: {
				lng: parseFloat(tracker.longitude),
				lat: parseFloat(tracker.latitude)
			},
			map: googleMap
		});
  }
  
  $(function() {
  	initMap();
  	listen();
	});
	
	function listen() {
		$.ajax({
		type: 'POST',
		url: '<?= $this->Url->build(['action' => 'ajaxRefresh']) ?>/'+tracker.id, // TODO: This needs to be changed!!!!
		success: function(data) {
			if (data != 'none') {
				tracker = $.parseJSON(data);
				var table = $('#right table');
				console.log(tracker);
				table.find('tr').eq(0).children('td').eq(1).html(tracker.id);
				table.find('tr').eq(1).children('td').eq(1).html(tracker.time);
				table.find('tr').eq(2).children('td').eq(1).html(tracker.GPSConnection);
				table.find('tr').eq(3).children('td').eq(1).html(tracker.longitude);
				table.find('tr').eq(4).children('td').eq(1).html(tracker.latitude);
				table.find('tr').eq(5).children('td').eq(1).html(Math.round(tracker.heading, 1));
				table.find('tr').eq(6).children('td').eq(1).html(tracker.velocity);
				marker.setPosition(new google.maps.LatLng(tracker.latitude, tracker.longitude));
			}
		},
		complete: listen
	})
	}

	
</script>

<style>
html, body{
	background-color: #7490A6;
	overflow: hidden;
}
#map {
	float: left;
	width: 70%;
	height: 100%;
}
#right {
	float: right;
	width: 25%;
	height: 100%;
	color: white;
}
#right table {
	color: white;
	font-size: 24px;
	width: 100%;
}
#right table td {
	padding: 4px 8px;
}
</style>