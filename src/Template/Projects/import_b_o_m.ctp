<?php
/**
  * @var \App\View\AppView $this
  */
?>
<?= $this->Form->create(null, ['type' => 'file']) ?>
<fieldset>
  <legend><?= __('Import BOM') ?></legend>
  <?= $this->Form->file('BOM') ?><br />
  <?= $this->Form->button(__('Import')) ?>
</fieldset>
<?= $this->Form->end() ?>
