<?php
/**
* @var \App\View\AppView $this
*/
?>

<nav class="large-3 medium-4 columns" id="actions-sidebar">
	<ul class="side-nav">
		<li class="heading"><?= __('Actions') ?></li>
		<li><?= $this->Html->link(__('Back to overview'), ['action' => 'index', 0]) ?></li>
	</ul>
</nav>
<div class="times index large-9 medium-8 columns content">
	<h3><?= $crew->name ?></h3>
	<table class="vertical-table">
		<tr>
			<th scrope="row">Name</th>
			<td><?= $crew->name ?></td>
		</tr>
		<tr>
			<th scrope="row">Shortname</th>
			<td><?= $crew->shortname ?></td>
		</tr>
	</table>
	
	<div class='related'>
		<div class='right'>
			<?= $this->Html->link(
				'Add athlete',
				['action' => 'addAthlete', $crew->id],
				['class' => 'button']
			) ?>
		</div>
		<h4>The team</h4><br />
		<div>
			<?php foreach($crew->sailling_athletes as $athlete): ?>
			<div style='
				float: left;
				width: 30%;
				text-align: center;
				margin: 1.5% 1%;
			'>
				<?= $this->Html->image('sailling/'.$athlete->image, [
						'alt' => $athlete->firstname.' '.$athlete->lastname,
						'style' => 'border-radius: 20px; width: 80%;'
					]) ?><br />
					<?= $athlete->firstname.' '.$athlete->lastname ?><br />
					Age: <?= $athlete->age ?>
			</div>
			<?php endforeach; ?>
		</div>
	</div>
</div>