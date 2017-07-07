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
	<?= $this->Form->create($tracker) ?>
	<fieldset>
		<legend><?= __('Add Tracker') ?></legend>
		<?php
		echo $this->Form->control('crew_id', ['options' => $saillingCrews, 'empty' => true]);
		echo $this->Form->control('type');
		?>
		<?= $this->Form->button(__('Add')) ?>
	</fieldset>
	<?= $this->Form->end() ?>
</div>
