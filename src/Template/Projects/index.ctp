<?php
/**
  * @var \App\View\AppView $this
  */
  
?>
<div class='right box text-center'>
	<?= $this->Html->link('New project', ['action' => 'add']) ?>
</div>
<div class='right box text-center'>
	<?= $this->Html->link('Order projects', ['action' => 'orderProjects']) ?>
</div>
<h2><?= __('Project').(isset($project)?" - ".$project->name:"") ?></h2>
<table>
  <thead>
    <tr>
      <th><?= $this->Paginator->sort('name') ?></th>
      <th><?= $this->Paginator->sort('price') ?></th>
      <th><?= $this->Paginator->sort('version') ?></th>
    </tr>
  </thead>
  <tbody>
  	<?php if ($id != 0): ?>
  	<tr>  		
  		<td><?= $this->Html->link('..', ['action' => 'index', $project->parent]) ?></td>
  		<td></td>
  		<td></td>
  	</tr>
  	<?php endif; ?>
    <?php foreach ($children as $child): ?>
    <tr>
      <td>
      	<?= (
      		(empty($child->conrtollers) && empty($child->action))?
      		$this->Html->link($child->name, ['action' => 'index', $child->id]):
      		$this->Html->link($child->name, [
      			'controller' => $child->controller,
      			'action' => $child->action,
      			$child->id
      		])
				)?>
      </td>
      <td><?= $this->Number->format($child->price) ?></td>
      <td><?= $this->Number->format($child->version) ?></td>
    </tr>
    <?php endforeach; ?>
  </tbody>
</table>

<?php if ($id > 0): ?>
<div class='related'>
	<div class='right box text-center'>
		<?= $this->Html->link('List components', ['controller' => 'components', 'action' => 'index']) 	?>
	</div>
	<div class='right box text-center'>
		<?= $this->Html->link('Add component', ['action' => 'addComponent', $project->id]) ?>
	</div>
	<div class='right box text-center'>
		<?= $this->Html->link('Clear components', ['action' => 'clearComponents', $project->id]) ?>
	</div>
	<div class='right box text-center'>
		<?= $this->Html->link('Import BOM', ['action' => 'importBOM', $project->id]) ?>
	</div>
	<h2>Components</h2>
	<table>
    <thead>
        <tr>
            <th><?= $this->Paginator->sort('type') ?></th>
            <th><?= $this->Paginator->sort('footprint') ?></th>
            <th><?= $this->Paginator->sort('name') ?></th>
            <th><?= $this->Paginator->sort('MPN') ?></th>
            <th><?= $this->Paginator->sort('required') ?></th>
            <th><?= $this->Paginator->sort('available') ?></th>
            <th class="actions"><?= __('Actions') ?></th>
        </tr>
    </thead>
    <tbody>
      <?php foreach ($project->components as $component): ?>
      <tr>
      	<td><?= h($component->type) ?></td>
      	<td><?= h($component->footprint) ?></td>
      	<td><?= h($component->name) ?></td>
      	<td><?= h($component->MPN) ?></td>
      	<td><?= h($component->_joinData->required) ?></td>
      	<td><?= h($component->available) ?></td>
      	<td></td>
      </tr>
      <?php endforeach; ?>
    </tbody>
	</table>
</div>



<?php endif; ?>