<?php
/**
  * @var \App\View\AppView $this
  */
?>
<div class='right box text-center'>
		<?= $this->Html->link('Add Component', ['action' => 'add']) ?>
	</div>
<h2><?= __('Components') ?></h2>
<?php foreach ($types as $type): ?>
<h3><?= __($type.'s') ?></h3>
<table>
  <thead>
    <tr>
      <th><?= $this->Paginator->sort('footprint') ?></th>
      <th><?= $this->Paginator->sort('name') ?></th>
      <th><?= $this->Paginator->sort('available') ?></th>
      <th><?= $this->Paginator->sort('on_order') ?></th>
      <th class="actions"><?= __('Actions') ?></th>
    </tr>
  </thead>
  <tbody>
    <?php foreach ($components[$type] as $component): ?>
    <tr>
    	<td><?= h($component->footprint) ?></td>
      <td><?= h($component->name) ?></td>
      <td><?= $this->Number->format($component->available) ?></td>
      <td><?= $this->Number->format($component->on_order) ?></td>
      <td class="actions">
    		<?= $this->Html->link(__('Attributes'), ['controller' => 'attributes', 'action' => 'index', $component->id]) ?>
        <?= $this->Html->link(__('Edit'), ['action' => 'edit', $component->id]) ?>
        <?= $this->Form->postLink(__('Delete'), ['action' => 'delete', $component->id], ['confirm' => __('Are you sure you want to delete # {0}?', $component->id)]) ?>
      </td>
    </tr>
    <?php endforeach; ?>
  </tbody>
</table>
<?php endforeach; ?>
