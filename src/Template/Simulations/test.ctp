<?php
/**
 * Test page will which show where the tracker is right now
 */
?>
<?= $this->Html->script('http://code.jquery.com/jquery.min.js') ?>
<?= $this->Html->script("https://maps.googleapis.com/maps/api/js?key=AIzaSyAdnyJXKONouXBKSEg0XPooslt47VygDgM") ?>

<div id='map'></div>


<script>

    var locations = <?= json_encode($packets) ?>;
    

    var googleMap;
    function initMap() {
        googleMap = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 52.09980, lng: 4.23992},
            zoom: 15
        });
        var i;
        
        for (i = 0; i < locations.length; i++) {            
            marker = new google.maps.Marker({
                position: {
                    lng: parseFloat(locations[i].longitude),
                    lat: parseFloat(locations[i].latitude)
                },
                map: googleMap
            });
        }
    }

    $(function () {
        initMap();
    });
</script>

<style>
    html, body{
        overflow: hidden;
        margin: 0px;
        padding: 0px;
    }
    #map {
        float: left;
        width: 100%;
        height: 100%;
    }
</style>