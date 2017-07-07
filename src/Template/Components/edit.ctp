<?php
/**
  * @var \App\View\AppView $this
  */
?>
<div class="components form large-9 medium-8 columns content">
    <?= $this->Form->create($component) ?>
    <fieldset>
        <legend><?= __('Edit Component') ?></legend>
        <?php
            echo $this->Form->control('type');
            echo $this->Form->control('name');
            echo $this->Form->control('footprint');
            echo $this->Form->control('MPN');
            echo $this->Form->control('SPN');
            echo $this->Form->control('supplier');
            echo $this->Form->control('manufacturer');
            echo $this->Form->control('url');
            echo $this->Form->control('available');
            echo $this->Form->control('on_order');
        ?>
        <?= $this->Form->button(__('Edit')) ?>
    </fieldset>
    <?= $this->Form->end() ?>
</div>
