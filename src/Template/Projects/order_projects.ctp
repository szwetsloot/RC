<?php
/**
  * @var \App\View\AppView $this
  */
  
?>
<h2>Projects</h2>

<table>
	<thead>
		<tr>
			<th>Project</th>
			<th>Order</th>
		</tr>
	</thead>
	<tbody>
		<?php foreach ($projects as $project): ?>
		<tr>
			<td><?=str_repeat(' - ', $project->level) ?> <?= $project->name ?></td>
			<td>
				<?= $this->Form->control('', [
					'type'    => 'numeric',
					'class'   => 'project-quantity',
					'project' => $project->id,
					'value'   => '0'
				]); ?>
			</td>
		</tr>
		<?php endforeach; ?>
	</tbody>
</table>

<h2>Components</h2>
<table>
  <thead>
    <tr>
      <th><?= $this->Paginator->sort('name') ?></th>
      <th><?= $this->Paginator->sort('available') ?></th>
      <th><?= $this->Paginator->sort('required') ?></th>
    </tr>
  </thead>
  <tbody>
  <?php foreach ($types as $type): ?>
		<tr><td colspan='999'><b><?= $type ?>s</b></td></tr>
    <?php foreach ($components[$type] as $component): ?>
    <tr class='component' component='<?= $component->id?>'>
      <td><?= $this->Html->link($component->name, $component->url) ?></td>
      <td><?= $this->Number->format($component->available) ?></td>
      <td>0</td>
    </tr>
    <?php endforeach; ?>
  <?php endforeach; ?>
  </tbody>
</table>


<script type='text/javascript'>
var projects = <?= json_encode($projects) ?>;

$(function() {
	$('.project-quantity').keyup(function() {
		calculateComponents();
	});
	console.log(projects.size);
});

function calculateComponents() {
	// Set all necessary components to 0
	$('.component').each(function() {
		$(this).children('td').eq(2).html('0');
	});
	
	// Start looping through each project
	$('.project-quantity').each(function() {
		// Get the project object
		var project_num = $(this).attr('project');
		var quantity = $(this).val();
		
		if (quantity == 0) return true; // Continue if this number is 0
		
		// Get the project object
		for (num in projects)
			if (projects[num].id == project_num) break;
		var project = projects[num];
		
		// Update the numbers for the requird components
		for (num in project.components) {
			var td = $("tr.component[component='"+project.components[num].id+"']").children('td').eq(2);	
			td.html(parseInt(td.html()) + project.components[num]._joinData.required * quantity);
		}
	});
	
	// Check all components if we have enough
	$('tr.component').each(function() {
		if (parseInt($(this).children('td').eq(1).html()) < parseInt($(this).children('td').eq(2).html()))
			$(this).css('background-color', 'red');
		else
			$(this).css('background-color', '');
	});
}
</script>