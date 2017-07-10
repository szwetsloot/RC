<?php

/**
  * @var \App\View\AppView $this
  */
  
?>

<script type='text/javascript'>
    // Initialize the crews
    var crews = <?= json_encode($crews) ?>;
    var bouys = <?= json_encode($bouys) ?>;
</script>

<?= $this->Html->css('animate') ?>
<?= $this->Html->css('simulate_sail_event_dummy') ?>

<?= $this->Html->script('http://code.jquery.com/jquery.min.js') ?>
<?= $this->Html->script('node_modules/proj4/dist/proj4') ?>

<?= $this->Html->script('simulate_sail_event_dummy') ?>
<?= $this->Html->script('simulate_sail_event_dashboard') ?>
<?= $this->Html->script('simulate_sail_event_boat') ?>

<div id='background-image'></div>
<div id='height-line-container'></div>
<div id="waves-container"></div>

<div id="boat-container">	
<?php foreach ($crews as $i => $crew): ?>
    <canvas id="canvas-<?= $crew->id ?>"></canvas>
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

<div id='bouy-container'>
	<div class="bouy" id='bouy-0'>
		1
		<div class="tooltip animated fadeInUp"></div>
	</div>
	<div class="bouy" id='bouy-1'>
		2A
		<div class="tooltip animated fadeInUp"></div>
	</div>
	<div class="bouy" id='bouy-2'>
		2B
		<div class="tooltip animated fadeInUp"></div>
	</div>
	<div class="bouy blue-bouy" id='bouy-3'>
		<div class="tooltip animated fadeInUp"></div>
	</div>
	<div class="bouy blue-bouy" id='bouy-4'>
		<div class="tooltip animated fadeInUp"></div>
	</div>
</div>




<div id="wedstrijdbaan"></div>
<div id="dashboard">

    <div id="bouy-info" class="animated fadeInDown">
        <div class="info-bar"><span class="label">Eredivisie zeilen J/70</span><span class="counter">Boei 1</span></div>
        <ul>
            <li class="animated fadeInLeft">
                <div class="position">1</div>
                <div class="team-flag"><?= $this->Html->image('sail_event_v2/teams/17.DenBosch.png') ?></div>
                <div class="name">WV Neptunes</div>
                <div class="counter">10:06,5</div>
            </li>
            <li class="animated fadeInLeft">
                <div class="position">2</div>
                <div class="team-flag"><?= $this->Html->image('sail_event_v2/teams/12.Giesbeek.png') ?></div>
                <div class="name">R.R. & Z.V. Maas en roer</div>
                <div class="counter">+2.1 S</div>
            </li>
            <li class="animated fadeInLeft">
                <div class="position">3</div>
                <div class="team-flag"><?= $this->Html->image('sail_event_v2/teams/18.Westeinder.png') ?></div>
                <div class="name">KWV de Kaag</div>
                <div class="counter">+13,5 S</div>
            </li>
            <li class="animated fadeInLeft">
                <div class="position">4</div>
                <div class="team-flag"><?= $this->Html->image('sail_event_v2/teams/2.DenHaag.png') ?></div>
                <div class="name">WVDTP Groningen</div>
                <div class="counter">+38,6</div>
            </li>
            <li class="animated fadeInLeft">
                <div class="position">5</div>
                <div class="team-flag"><?= $this->Html->image('sail_event_v2/teams/6.Roermond.png') ?></div>
                <div class="name">Zeilteam Westeinder</div>
                <div class="counter">+47,3</div>
            </li>
            <li class="animated fadeInLeft">
                <div class="position">6</div>
                <div class="team-flag"><?= $this->Html->image('sail_event_v2/teams/15.Braassem.png') ?></div>
                <div class="name">WV Braassemermeer</div>
                <div class="counter">80 m</div>
            </li>
        </ul>
    </div>
    <div id="race-time" class="info-bar animated fadeInRight"><span class="label">Race tijd</span><span class="counter">00:00,0</span></div>
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

    <div id="boat-info" class="animated fadeInUp">
        <div class="boat-data">
            <div class="position">1</div><h4>Snelheid: 6Kn</h4><h4>Helling: 26&deg;</h4><br>
            <h6>52.112861, 4.25669</h6><h6>Volgende boei 60m</h6>
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
                    <h5>Stuurvrouw, 22 jaar</h5>					
                </li>				
                <li class="animated fadeInRight">
                    <div class="profile-pic">
						<?= $this->Html->image('sail_event_v2/team-members/peterbisschop-kwvdekaag.jpg') ?>
                    </div>
                    <h4>Peter Bisschop</h4>
                    <h5>Stuurvrouw, 22 jaar</h5>					
                </li>
                <li class="animated fadeInRight">
                    <div class="profile-pic">
						<?= $this->Html->image('sail_event_v2/team-members/rutgervaneeuwijk-kwvdekaag.jpg') ?>
                    </div>
                    <h4>Rutger Van Eeuwijk</h4>
                    <h5>Stuurvrouw, 22 jaar</h5>					
                </li>
            </ul>
        </div>
        <div class="team-data-container">
            <div class="team-data">
                <h2>R.R. & Z.V. Maas en roer</h2>
                <div class="medal medal-1"></div>
                <h3 style="text-decoration: underline;">Ranking competitie</h3>
                <h3>Positie 1, 18 punten</h3>
			<?= $this->Html->image('sail_event_v2/teams/17.DenBosch.png') ?>
            </div>
        </div>
    </div>


    <div id="bouy-counter" class="info-bar animated fadeInRight"><span class="label">Boei 1</span><span class="counter">+00,0</span></div>
	<?= $this->Html->image('sail_event_v2/otis.png',['class' => 'otis-logo']) ?>
</div>