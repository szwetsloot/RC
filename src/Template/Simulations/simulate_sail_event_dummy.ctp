<?php

/**
  * @var \App\View\AppView $this
  */
?>

<script type='text/javascript'>
    // Initialize the crews
    var crews = <?= json_encode($crews) ?>;
    var bouys = <?= json_encode($bouys) ?>;

    // Initialize the wind and wave direction
    var wave_direction = <?= $wave ?> + 90; // The +90 is to correct for the image
    var wind_direction = <?= $wind ?> + 180; // The + 180 is to correct for the different 0-direciton

    // Build the url for ajax requests
    var listenerUrl = <?= json_encode($this->Url->build(['action' => 'sailEventListener'])) ?>;
    
    // Extra variables
    var startTime = <?= json_encode($startTime) ?>;
</script>

<?= $this->Html->css('animate') ?>
<?= $this->Html->css('simulate_sail_event_dummy') ?>

<?= $this->Html->script('http://code.jquery.com/jquery.min.js') ?>
<?= $this->Html->script('https://code.jquery.com/ui/1.12.1/jquery-ui.min.js') ?>

<?= $this->Html->script('node_modules/proj4/dist/proj4') ?>

<?= $this->Html->script('simulate_sail_event_dummy') ?>
<?= $this->Html->script('simulate_sail_event_dashboard') ?>
<?= $this->Html->script('simulate_sail_event_boat') ?>
<?= $this->Html->script('simulate_sail_event_bouy') ?>

<div id="background-image"></div>
<div id="height-line-container"></div>
<div id="waves-container"></div>
<div id="trail-container"></div>

<div id='bouy-container'>
    <canvas id="canvas-start"></canvas>
    <?php foreach ($bouys as $bouy): ?>
    <div class="bouy" id='bouy-<?= $bouy->id ?>'>
        <?= $bouy->name; ?>
        <div class="tooltip animated fadeInUp">
        	lat: <?= $bouy->Trackers['latitude'] ?> <br>
        	lng: <?= $bouy->Trackers['longitude'] ?>
       	</div>
    </div>
    <?php endforeach; ?>
</div>

<div id="boat-container">	
<?php foreach ($crews as $i => $crew): ?>
    <div class="boat" id="boat-<?= $crew->id ?>">
        <div class="boat-stats">
            <div class="position"><?= ($i+1) ?></div>
            <div class="team-flag"><?= $this->Html->image('sail_event_v2/teams/') ?></div>
            <div class="name"><?= $crew->shortname ?></div>
            <div class="extra"><p>0Kn 0&deg;</p></div>
        </div>
        <div class="boat-icon"></div>
    </div> 
<?php endforeach; ?>
</div>

<div id="dashboard">
    <div id="bouy-info" class="info-list animated fadeInDown">
        <div class="info-bar"><span class="label">Eredivisie zeilen J/70</span><span class="counter">Boei 1</span></div>
        <ul></ul>
    </div>
    
     <div id="boat-overview" class="info-list animated fadeInLeft">
        <div class="info-bar"><span class="label">Eredivisie zeilen J/70</span></div>
        <ul>
        <?php foreach ($crews as $i => $crew): ?>
		    <li id="info-boat-<?= $crew->id ?>" class="animated fadeInLeft">
                <div class="position start-<?= $crew->start_nr ?>"><?= $crew->start_nr ?></div>
                <div class="team-flag"><?= $this->Html->image('sail_event_v2/teams/'.$crew->flag_image ) ?></div>
                <div class="name"><?= $crew->shortname ?></div>
                <div class="counter">14.6kN / 180&deg; / 82m</div>
            </li>
		<?php endforeach; ?>           
        </ul>
    </div>
    
    <div id="race-time" class="info-bar animated fadeInRight"><span class="label">Race tijd</span><span class="counter">00:00,0</span></div>
    <div id="penalty" class="info-bar animated fadeInUp"><span class="label">Penalty</span><span class="counter penalty">Scheveningen</span></div>
    <div id="arrow-container" class="animated fadeInRight">
        <div id="north-arrow" class="arrow">
            N
			<?= $this->Html->image('sail_event_v2/arrow.png',['class'=>'arrow-img']) ?>
            <div class="arrow-text">Noord</div>
        </div>
        <div id="wind-arrow" class="arrow">
            6
			<?= $this->Html->image('sail_event_v2/arrow.png',['class'=>'arrow-img']) ?>
            <div class="arrow-text">Windkracht<br>19Kn, NW</div>
        </div>

    </div>
    
    <div id="bouy-data" class="info-list right-list animated fadeInRight" >
        <div class="info-bar"><span class="label">Boei 1</span></div>
        <ul>
            <li class="animated fadeInLeft">
                <div class="position">D</div>
                <div class="name">diepte</div>
                <div class="counter">6 m</div>
            </li>
            <li class="animated fadeInLeft">
                <div class="position">S</div>
                <div class="name">Stroming</div>
                <div class="counter">0.5 m/s</div>
            </li>
            <li class="animated fadeInLeft">
                <div class="position">W</div>
                <div class="name">Wind</div>
               <div class="counter">5 Bft, NW</div>
            </li>
        </ul>
    </div>

    <div id="boat-info" class="animated fadeInUp">
        <div class="boat-data">
            <div id="boat-position" class="position">1</div><h4 id="boat-speed">Snelheid: 6Kn</h4><h4 id="boat-roll">Helling: 26&deg;</h4><br>
            <h6 id="boat-location">52.112861, 4.25669</h6><h6 id="boat-target-bouy">Volgende boei: 60m</h6>
            <span></span>
        </div>
        <div class="team-members">
            <ul>
                <li class="animated fadeInRight">
                    <div class="profile-pic straight">
						<?= $this->Html->image('sail_event_v2/team-members/DaphnevdVaart-DeKaag2.png') ?>
                    </div>
                    <h4>Daphne van der Vaart</h4>
                    <h5>Stuurvrouw, 22 jaar</h5>					
                </li>
                <li class="animated fadeInRight">
                    <div class="profile-pic">
						<?= $this->Html->image('sail_event_v2/team-members/alwinvandaelen-kwvdekaag.jpg') ?>
                    </div>
                    <h4>Alwin van Daelen</h4>
                    <h5>Schipper, 51 jaar</h5>					
                </li>				
                <li class="animated fadeInRight">
                    <div class="profile-pic">
						<?= $this->Html->image('sail_event_v2/team-members/peterbisschop-kwvdekaag.jpg') ?>
                    </div>
                    <h4>Peter Bisschop</h4>
                    <h5>53 jaar</h5>					
                </li>
                <li class="animated fadeInRight">
                    <div class="profile-pic">
						<?= $this->Html->image('sail_event_v2/team-members/rutgervaneeuwijk-kwvdekaag.jpg') ?>
                    </div>
                    <h4>Rutger Van Eeuwijk</h4>
                    <h5>25 jaar</h5>					
                </li>
            </ul>
        </div>
        <div class="team-data-container">
            <div class="team-data">
                <h2 class="club-name">R.R. &amp; Z.V. Maas en roer</h2>
                <div class="medal medal-1"></div>
                <h3 style="text-decoration: underline;">Ranking competitie</h3>
                <h3 class="competition">Positie 1, 18 punten</h3>
			<?= $this->Html->image('sail_event_v2/teams/17.DenBosch.png') ?>
            </div>
        </div>
    </div>
    <div id="wave-bg" class="animated fadeInUp"></div>


    <div id="bouy-counter" class="info-bar animated fadeInUp"><span class="label">Boei 1</span><span class="counter">+00,0</span></div>
    
     <div id="start-panel" class="panel info-list animated fadeInDown">
     	<div class="panel-header">
     		<?= $this->Html->image('sail_event_v2/logo-horizontaal.png',['class' => 'race-logo']) ?>
     		<h1>Start</h1>
     		<?= $this->Html->image('sail_event_v2/otis-blauw.png',['class' => 'dev-logo']) ?>
     		<div class="info-bar"><span class="label">Eredivisie zeilen J/70</span></div>
        </div>
              
        <div class="list-header">
        		<span>Start NR | </span>
             	<span class="name">Vereniging</span>
             	<span>Schipper</span>
             	<span class="ranking">Ranking competitie</span>
        </div>
        <ul>
            <li class="animated fadeInLeft">
                <div class="position start-1">1</div>
                <div class="team-flag"><?= $this->Html->image('sail_event_v2/teams/17.DenBosch.png') ?></div>
                <div class="name">WV Neptunes</div>
                <div class="medal medal-1"></div>
                <div class="skipper">Peter Bisshop</div>
                <div class="counter">1 | 20 punten</div>
            </li>
            <li class="animated fadeInLeft">
                <div class="position start-2">2</div>
                <div class="team-flag"><?= $this->Html->image('sail_event_v2/teams/12.Giesbeek.png') ?></div>
                <div class="name">R.R. & Z.V. Maas en roer</div>
                <div class="medal medal-2"></div>
                <div class="skipper">Peter Bisshop</div>
                <div class="counter">2 | 40 punten</div>
            </li>
            <li class="animated fadeInLeft">
                <div class="position start-3">3</div>
                <div class="team-flag"><?= $this->Html->image('sail_event_v2/teams/18.Westeinder.png') ?></div>
                <div class="name">KWV de Kaag</div>
                <div class="medal medal-3"></div>
                <div class="skipper">Peter Bisshop</div>
                <div class="counter">3 | 60 punten</div>
            </li>
            <li class="animated fadeInLeft">
                <div class="position start-4">4</div>
                <div class="team-flag"><?= $this->Html->image('sail_event_v2/teams/17.DenBosch.png') ?></div>
                <div class="name">WV Neptunes</div>
                <div class="medal"></div>
                <div class="skipper">Peter Bisshop</div>
                <div class="counter">4 | 80 punten</div>
            </li>
            <li class="animated fadeInLeft">
                <div class="position start-5">5</div>
                <div class="team-flag"><?= $this->Html->image('sail_event_v2/teams/12.Giesbeek.png') ?></div>
                <div class="name">R.R. & Z.V. Maas en roer</div>
                <div class="medal"></div>
                <div class="skipper">Peter Bisshop</div>
                <div class="counter">5 | 100 punten</div>
            </li>
            <li class="animated fadeInLeft">
                <div class="position start-6">6</div>
                <div class="team-flag"><?= $this->Html->image('sail_event_v2/teams/18.Westeinder.png') ?></div>
                <div class="name">KWV de Kaag</div>
                <div class="medal"></div>
                <div class="skipper">Peter Bisshop</div>
                <div class="counter">6 | 120 punten</div>
            </li>
        </ul>
        
    </div>
    
    <div id="finish-panel" class="panel info-list animated fadeInDown">
     	<div class="panel-header">
     		<?= $this->Html->image('sail_event_v2/logo-horizontaal.png',['class' => 'race-logo']) ?>
     		<h1>finish</h1>
     		<?= $this->Html->image('sail_event_v2/otis-blauw.png',['class' => 'dev-logo']) ?>
     		<div class="info-bar"><span class="label">Eredivisie zeilen J/70</span></div>
        </div>
              
        <div class="list-header">
        		<span>Start NR | </span>
             	<span class="name">Vereniging</span>
             	<span>Tijd</span>
             	<span class="ranking">Punten</span>
        </div>
        <ul>
            <li class="animated fadeInLeft">
            	<tr><td>
                <div class="position start-1">1</div>
                <div class="team-flag"><?= $this->Html->image('sail_event_v2/teams/17.DenBosch.png') ?></div>
                <div class="name">WV Neptunes</div>
                <div class="medal medal-1"></div>
                </td><td>
                <div class="result">24:03</div>
                <div class="counter">1</div>
                
            </li>
            <li class="animated fadeInLeft">
                <div class="position start-2">2</div>
                <div class="team-flag"><?= $this->Html->image('sail_event_v2/teams/12.Giesbeek.png') ?></div>
                <div class="name">R.R. & Z.V. Maas en roer</div>
                <div class="medal medal-2"></div>
                <div class="resukt">24:06 | + 3s</div>
                <div class="counter">2</div>
            </li>
            <li class="animated fadeInLeft">
                <div class="position start-3">3</div>
                <div class="team-flag"><?= $this->Html->image('sail_event_v2/teams/18.Westeinder.png') ?></div>
                <div class="name">KWV de Kaag</div>
                <div class="medal medal-3"></div>
                <div class="resukt">24:06 | + 3s</div>
                <div class="counter">2</div>
            </li>
            <li class="animated fadeInLeft">
                <div class="position start-4">4</div>
                <div class="team-flag"><?= $this->Html->image('sail_event_v2/teams/17.DenBosch.png') ?></div>
                <div class="name">WV Neptunes</div>
                <div class="medal"></div>
                <div class="resukt">24:06 | + 3s</div>
                <div class="counter">2</div>
            </li>
            <li class="animated fadeInLeft">
                <div class="position start-5">5</div>
                <div class="team-flag"><?= $this->Html->image('sail_event_v2/teams/12.Giesbeek.png') ?></div>
                <div class="name">R.R. & Z.V. Maas en roer</div>
                <div class="medal"></div>
                <div class="resukt">24:06 | + 3s</div>
                <div class="counter">2</div>
            </li>
            <li class="animated fadeInLeft">
                <div class="position start-6">6</div>
                <div class="team-flag"><?= $this->Html->image('sail_event_v2/teams/18.Westeinder.png') ?></div>
                <div class="name">KWV de Kaag</div>
                <div class="medal"></div>
                <div class="resukt">24:06 | + 3s</div>
                <div class="counter">2</div>
            </li>
        </ul>
        
    </div>
 
 	<!--  filmpje looped standaard maar loopt soms vast als je naar een andere tab gaat -->
    <iframe id="live-stream" src="https://www.youtube.com/embed/z8jors5jY64?rel=0&vq=hd720&controls=0&showinfo=0&end=124&mute=1&autoplay=1&loop=1&playlist=z8jors5jY64" frameborder="0"></iframe>

	<?= $this->Html->image('sail_event_v2/otis.png',['class' => 'otis-logo']) ?>
	
	<div id="overlay"></div>
</div>