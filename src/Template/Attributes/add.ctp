<?php
/**
  * @var \App\View\AppView $this
  */
?>
<div class="attributes form large-9 medium-8 columns content">
  <?= $this->Form->create($attribute) ?>
  <fieldset>
    <legend><?= __('Add Attribute') ?></legend>
    <?php
      echo $this->Form->control('name');
      echo $this->Form->control('value');
    ?>
    <?= $this->Form->button(__('Add')) ?>
  </fieldset>
  <?= $this->Form->end() ?>
</div>
