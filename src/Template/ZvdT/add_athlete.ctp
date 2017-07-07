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
	<?= $this->Form->create($athlete, ['type' => 'file']) ?>
	<fieldset>
		<legend><?= __('Add Athlete') ?></legend>
		<?php
		echo $this->Form->control('firstname');
		echo $this->Form->control('lastname');
		echo $this->Form->control('gender', ['type' => 'radio', 'options' => ['Male' => 'm', 'Female' => 'v']]);
		echo $this->Form->control('age');
		echo $this->Form->control("picture", ['type' => 'file']);
		echo $this->Form->button('Save');
		?>
	</fieldset>
	<?= $this->Form->end() ?>
</div>