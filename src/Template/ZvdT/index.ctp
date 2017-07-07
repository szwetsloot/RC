<?php
/**
* @var \App\View\AppView $this
*/
?>

<nav class="large-3 medium-4 columns" id="actions-sidebar">
	<ul class="side-nav">
		<li class="heading"><?= __('Actions') ?></li>
		<li><?= $this->Html->link(__('Trackers'), ['controller' => 'trackers', 'action' => 'index', 0]) ?></li>
	</ul>
</nav>
<div class="times index large-9 medium-8 columns content">
	<h3>Zeilwedstrijd van de Toekomst</h3>
	<table class="vertical-table">
		<tr>
			<th scrope="row">Name</th>
			<td>Zeilwedstrijd van de toekomst</td>
		</tr>
		<tr>
      <th scrope="row">Start Date</th>
      <td>28/06/2017</td>
		</tr>
		<tr>
      <th scrope="row">Start Date</th>
      <td>30/06/2017</td>
		</tr>
	</table>
	
	<div class='related'>
		<div class='right'>
			<?= $this->Html->link(
				'Add crew',
				['action' => 'addCrew'],
				['class' => 'button']
			) ?>
		</div>
		<h4>Crews</h4>
		<table cellpadding="0" cellspacing="0">
			<tr>
				<th scope="col"><?= __("#") ?></th>
				<th scope="col"><?= __("Name") ?></th>
				<th scope="col"><?= __("Shortname") ?></th>
				<th scope="col"><?= __("Tracker") ?></th>
				<th scope="col"></th>
			</tr>
			<?php foreach ($crews as $crew): ?>
			<tr>
				<td><?= $crew->id ?></td>
				<td><?= $crew->name ?></td>
				<td><?= $crew->shortname ?></td>
				
				<td>
					<?= $this->Html->link('view', ['action' => 'viewCrew', $crew->id]) ?>
					<?= $this->Html->link(
						'delete',
						['action' => 'deleteCrew'],
						['confirm' => 'Are you sure you want to delete this crew?'])
					?>
				</td>
			</tr>
			<?php endforeach; ?>
		</table>
	</div>
</div>