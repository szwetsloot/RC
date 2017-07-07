<?php
/**
  * @var \App\View\AppView $this
  */
  
?>

<?= $this->Html->css('animate') ?>
<?= $this->Html->css('simulate_sail_event_v2') ?>

<?= $this->Html->script('http://code.jquery.com/jquery.min.js') ?>
<?= $this->Html->script('node_modules/proj4/dist/proj4') ?>

<?= $this->Html->script('simulate_sail_event_v2') ?>

<div id='background-image'></div>
<div id='compass'></div>
<div id='wind-arrow'></div>


<div id='bouy-container'></div>

<div id='boat-container'></div>

<div id='height-line-container'></div>