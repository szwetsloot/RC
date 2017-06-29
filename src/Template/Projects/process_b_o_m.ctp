<?php
/**
  * @var \App\View\AppView $this
  */
?>
<div class='right box text-center'>
	<?= $this->Html->link('Back to project', ['action' => 'index', $project->id]) ?>
</div>
<h2>Results of import</h2>
<h3>Listed components</h3>
<table>
  <thead>
    <tr>
    	<th><?= $this->Paginator->sort('type') ?></th>
      <th><?= $this->Paginator->sort('footprint') ?></th>
      <th><?= $this->Paginator->sort('name') ?></th>
      <th><?= $this->Paginator->sort('available') ?></th>
      <th><?= $this->Paginator->sort('required') ?></th>
    </tr>
  </thead>
  <tbody>
  	<?php foreach ($project->components as $component): ?>
  	<tr>
  		<td><?= $component->type ?></td>
  		<td><?= $component->footprint ?></td>
  		<td><?= $component->name." (".$component->MPN.")" ?></td>
  		<td><?= $component->available ?></td>
  		<td><?= $component->_joinData->required ?></td>
  	</tr>
  	<?php endforeach; ?>
  </tbody>
</table>
<h3>Not found</h3>
<table>
  <thead>
    <tr>
      <th><?= $this->Paginator->sort('Qty') ?></th>
      <th><?= $this->Paginator->sort('Value') ?></th>
      <th><?= $this->Paginator->sort('Device') ?></th>
      <th><?= $this->Paginator->sort('Parts') ?></th>
    </tr>
  </thead>
  <tbody>
  	<?php foreach ($notFound as $component): ?>
  	<tr>
  		<td><?= $component->required ?></td>
  		<td><?= $component->value?></td>
  		<td><?= $component->device ?></td>
  		<td><?= $component->parts ?></td>
  	</tr>
  	<?php endforeach; ?>
  </tbody>
</table>