<?php
/**
* @var \App\View\AppView $this
*/
?>

<nav class="large-3 medium-4 columns" id="actions-sidebar">
	<ul class="side-nav">
		<li class="heading"><?= __('Actions') ?></li>
		<li><?= $this->Html->link(__('Zeilwedstrijd vd toekomst'), ['controller' => 'ZvdT', 'action' => 'index', 0]) ?></li>
		<li><?= $this->Html->link(__('Add tracker'), ['action' => 'add', 0]) ?></li>
	</ul>
</nav>
<div class="times index large-9 medium-8 columns content">
	<h3><?= __('Trackers') ?></h3>
	<table>
		<thead>
			<tr>
				<th><?= $this->Paginator->sort('id') ?></th>
				<th><?= $this->Paginator->sort('linked') ?></th>
				<th><?= $this->Paginator->sort('type') ?></th>
				<th><?= $this->Paginator->sort('last_message') ?></th>
				<th><?= $this->Paginator->sort('active') ?></th>
				<th class="actions"><?= __('Actions') ?></th>
			</tr>
		</thead>
		<tbody>
			<?php foreach($trackers as $tracker): ?>
			<tr>
				<td><?= $this->Number->format($tracker->id) ?></td>
				<td>Not linked</td>
				<td><?= h($tracker->type) ?></td>
				<td><?= h($tracker->last_message) ?></td>
				<td><div style='width: 22px; height: 22px; background-color: red; border-radius: 50%;'></div></td>
				<td class="actions">
					<?= $this->Html->link(__('View'), ['action' => 'view', $tracker->id]) ?>
					<?= $this->Html->link(__('Edit'), ['action' => 'edit', $tracker->id]) ?>
					<?= $this->Form->postLink(__('Delete'), ['action' => 'delete', $tracker->id], ['confirm' => __('Are you sure you want to delete # {0}?', $tracker->id)]) ?>
				</td>
			</tr>
			<?php endforeach; ?>
		</tbody>
	</table>
</div>