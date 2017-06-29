<?php
/**
  * @var \App\View\AppView $this
  */
  
  
?>
<?= $this->Form->create($project) ?>
<fieldset>
  <legend><?= __('Add Project') ?></legend>
  <?php
      echo $this->Form->control('parent', [
      	'type' => 'select',
      	'multiple' => false,
      	'options' => $parent,
      	'empty' => false
      ]);
      echo $this->Form->control('name');
      echo $this->Form->control('price');
      echo $this->Form->control('version');
  ?>
  <?= $this->Form->button(__('Add')) ?>
</fieldset>
<?= $this->Form->end() ?>
