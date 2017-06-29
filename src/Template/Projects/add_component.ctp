<?php
/**
  * @var \App\View\AppView $this
  */

?>

<?= $this->Form->create($component) ?>
<fieldset>
  <legend><?= __('Add Project') ?></legend>
  <?php
      echo $this->Form->control('type', [
      	'type' => 'select',
      	'multiple' => false,
      	'options' => $types,
      	'empty' => true,
      	'id' => 'component-type'
      ]);
      echo $this->Form->control('footprint', [
      	'type' => 'select',
      	'options' => [],
      	'multiple' => false,
      	'empty' => false,
      	'id' => 'component-footprint'
      ]);
      echo $this->Form->control('name', [
      	'type' => 'select',
      	'options' => [],
      	'multiple' => false,
      	'empty' => false,
      	'id' => 'component-name'
      ]);
      echo $this->Form->control('quantity', [
      	'type' => 'number',
      	'value' => '1'
      ]);
  ?>
	<?= $this->Form->button(__('Add')) ?><br />
</fieldset>
<?= $this->Form->end() ?>
<?= $this->Html->link('Back to project', ['action' => 'index', $project->id]) ?>


<script type='text/javascript'>

var components = <?= json_encode($components) ?>;

$(function() {
	console.log(components);
	$('#component-type').change(function() {
		getFootprints($(this).val());
	});
});

function getFootprints(type) {
	// Get the components of this type
	var component_list = components[type];
	
	// Get all footprints
	var footprints = [];
	for (var i = 0; i < component_list.length; i++) {
		var component = component_list[i];
		footprints.push(component.footprint);
	}
	
	// Get the unique footprints
	footprints = [...new Set(footprints)];
	
	// Put them in the select
	$('#component-footprint').empty();
	for (var i = 0; i < footprints.length; i++)
		$('#component-footprint').append("<option value='"+footprints[i]+"'>"+footprints[i]+"</option");
		
	getComponents(type, footprints[0]);
}

function getComponents(type, footprint) {
	// Get the components of this type
	var component_list = components[type];
	
	// Get the components with this footprint
	component_list.filter(function(a) {
		return a.footprint == footprint;
	});
	
	$('#component-name').empty();
	for (var i = 0; i < component_list.length; i++)
		$('#component-name').append("<option value='"+component_list[i].id+"'>"+component_list[i].name+" - ("+component_list[i].MPN+")</option");
}
</script>