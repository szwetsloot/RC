<?php
/**
  * @var \App\View\AppView $this
  */
  
?>

<?= $this->Html->css('simulate_sail_event_v1') ?>

<?= $this->Html->script('http://code.jquery.com/jquery.min.js') ?>
<?= $this->Html->script('node_modules/proj4/dist/proj4') ?>

<?= $this->Html->script('simulate_sail_event_v1') ?>

<div id='background-image'></div>
<div id='compass'></div>
<div id='wind-arrow'></div>


<div id='bouy-container'>
	<div class='bouy' id='bouy-0'></div>
	<div class='bouy' id='bouy-1'></div>
	<div class='bouy' id='bouy-2'></div>
	<div class='bouy' id='bouy-3'></div>
</div>

<div id='boat-container'>
	<div class='boat' id='boat-0'></div>
</div>

<div id='height-line-container'>
	
</div>