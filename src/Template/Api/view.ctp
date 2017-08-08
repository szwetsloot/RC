<?php

/**
* Test page will which show where the tracker is right now
*/
?>
<?= $this->Html->script('http://code.jquery.com/jquery.min.js') ?>
<?= $this->Html->script("https://maps.googleapis.com/maps/api/js?key=AIzaSyAdnyJXKONouXBKSEg0XPooslt47VygDgM") ?>

<div id='map'></div>
<div id='right''>
    <h1>Tracker data</h1>
    <table>
        <tr>
            <td>Packet #</td>
            <td><?= $trackers[0]->id ?></td>
        </tr>
        <tr>
            <td>Last packet</td>
            <td><?= $trackers[0]->time ?></td>
        </tr>
        <tr>
            <td>GPS connection</td>
            <td><?= $trackers[0]->GPSConnection ?></td>
        </tr>
        <tr>
            <td>Longitude</td>
            <td><?= $trackers[0]->longitude ?></td>
        </tr>
        <tr>
            <td>Latitude</td>
            <td><?= $trackers[0]->latitude ?></td>
        </tr>
        <tr>
            <td>Heading</td>
            <td><?= round($trackers[0]->heading * 10) / 10 ?></td>
        </tr>
        <tr>
            <td>Velocity</td>
            <td><?= $trackers[0]->velocity ?></td>
        </tr>

    </table>
</div>

<script>

    var trackers = <?= json_encode($trackers) ?>;
    var markers = [];
    var marker;

    var googleMap;
    function initMap() {
        googleMap = new google.maps.Map(document.getElementById('map'), {
            center: {lat: <?=$trackers[0]->latitude ?>, lng: <?= $trackers[0]->longitude ?>},
            zoom: 15
        });
        var i;
        for (i = 0; i < trackers.length; i++) {
            console.log(trackers[i].tracker);
            marker = new google.maps.Marker({
                position: {
                    lng: parseFloat(trackers[i].longitude),
                    lat: parseFloat(trackers[i].latitude)
                },
                map: googleMap
            });
            markers[trackers[i].tracker] = marker;
        }
        console.log(markers);
    }

    $(function () {
        initMap();
        listen();
    });

    function listen() {
        $.ajax({
            type: 'POST',
            url: '<?= $this->Url->build(['action' => 'ajaxRefresh']) ?>/', // TODO: This needs to be changed!!!!
            success: function (data) {
                console.log(data);
                trackers = $.parseJSON(data);
                var i;
                for (i = 0; i < trackers.length; i++) {
                    markers[trackers[i].tracker].setPosition(new google.maps.LatLng(trackers[i].latitude, trackers[i].longitude));
                }
//                if (data != 'none') {
//                    tracker = $.parseJSON(data);
//                    var table = $('#right table');
//                    console.log(tracker);
//                    table.find('tr').eq(0).children('td').eq(1).html(tracker.id);
//                    table.find('tr').eq(1).children('td').eq(1).html(tracker.time);
//                    table.find('tr').eq(2).children('td').eq(1).html(tracker.GPSConnection);
//                    table.find('tr').eq(3).children('td').eq(1).html(tracker.longitude);
//                    table.find('tr').eq(4).children('td').eq(1).html(tracker.latitude);
//                    table.find('tr').eq(5).children('td').eq(1).html(Math.round(tracker.heading, 1));
//                    table.find('tr').eq(6).children('td').eq(1).html(tracker.velocity);
//                    marker.setPosition(new google.maps.LatLng(tracker.latitude, tracker.longitude));
//                }
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
        width: 100%;
        height: 100%;
    }
    #right {
        display: none;
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