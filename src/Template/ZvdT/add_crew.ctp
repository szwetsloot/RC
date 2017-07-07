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
	<?= $this->Form->create($crew) ?>
	<fieldset>
		<legend><?= __('Add Crew') ?></legend>
		<?php
		echo $this->Form->control('name');
		echo $this->Form->control('shortname');
		echo $this->Form->textarea('description');
		echo $this->Form->button('Save');
		?>
	</fieldset>
	<?= $this->Form->end() ?>
</div>