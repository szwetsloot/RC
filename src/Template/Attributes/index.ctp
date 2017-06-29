<?php
/**
  * @var \App\View\AppView $this
  */
?>
<div class='right box text-center'>
	<?= $this->Html->link('Add Attribute', ['action' => 'add', $component->id]) ?>
</div>
<div class='right box text-center'>
	<?= $this->Html->link('Back to components', ['controller' => 'components', 'action' => 'index']) ?>
</div>
<h2><?= __('Attributes for ').$component->name ?></h2>
<table>
    <thead>
        <tr>
            <th><?= $this->Paginator->sort('id') ?></th>
            <th><?= $this->Paginator->sort('name') ?></th>
            <th><?= $this->Paginator->sort('value') ?></th>
            <th class="actions"><?= __('Actions') ?></th>
        </tr>
    </thead>
    <tbody>
        <?php foreach ($attributes as $attribute): ?>
        <tr>
            <td><?= $this->Number->format($attribute->id) ?></td>
            <td><?= h($attribute->name) ?></td>
            <td><?= h($attribute->value) ?></td>
            <td class="actions">
                <?= $this->Form->postLink(__('Delete'), ['action' => 'delete', $attribute->id], ['confirm' => __('Are you sure you want to delete # {0}?', $attribute->id)]) ?>
            </td>
        </tr>
        <?php endforeach; ?>
    </tbody>
</table>
