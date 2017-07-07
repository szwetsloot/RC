<?php
/**
  * @var \App\View\AppView $this
  */
?>
<nav class="large-3 medium-4 columns" id="actions-sidebar">
    <ul class="side-nav">
        <li class="heading"><?= __('Actions') ?></li>
        <li><?= $this->Html->link(__('Edit Tracker'), ['action' => 'edit', $tracker->id]) ?> </li>
        <li><?= $this->Form->postLink(__('Delete Tracker'), ['action' => 'delete', $tracker->id], ['confirm' => __('Are you sure you want to delete # {0}?', $tracker->id)]) ?> </li>
        <li><?= $this->Html->link(__('List Trackers'), ['action' => 'index']) ?> </li>
        <li><?= $this->Html->link(__('New Tracker'), ['action' => 'add']) ?> </li>
        <li><?= $this->Html->link(__('List Sailling Crews'), ['controller' => 'Saillingcrews', 'action' => 'index']) ?> </li>
        <li><?= $this->Html->link(__('New Sailling Crew'), ['controller' => 'Saillingcrews', 'action' => 'add']) ?> </li>
    </ul>
</nav>
<div class="trackers view large-9 medium-8 columns content">
    <h3><?= h($tracker->id) ?></h3>
    <table class="vertical-table">
        <tr>
            <th scope="row"><?= __('Sailling Crew') ?></th>
            <td><?= $tracker->has('sailling_crew') ? $this->Html->link($tracker->sailling_crew->name, ['controller' => 'Saillingcrews', 'action' => 'view', $tracker->sailling_crew->id]) : '' ?></td>
        </tr>
        <tr>
            <th scope="row"><?= __('Type') ?></th>
            <td><?= h($tracker->type) ?></td>
        </tr>
        <tr>
            <th scope="row"><?= __('Id') ?></th>
            <td><?= $this->Number->format($tracker->id) ?></td>
        </tr>
        <tr>
            <th scope="row"><?= __('Latitude') ?></th>
            <td><?= $this->Number->format($tracker->latitude) ?></td>
        </tr>
        <tr>
            <th scope="row"><?= __('Longitude') ?></th>
            <td><?= $this->Number->format($tracker->longitude) ?></td>
        </tr>
        <tr>
            <th scope="row"><?= __('Heading') ?></th>
            <td><?= $this->Number->format($tracker->heading) ?></td>
        </tr>
        <tr>
            <th scope="row"><?= __('Roll Angle') ?></th>
            <td><?= $this->Number->format($tracker->roll_angle) ?></td>
        </tr>
        <tr>
            <th scope="row"><?= __('Pitch Angle') ?></th>
            <td><?= $this->Number->format($tracker->pitch_angle) ?></td>
        </tr>
        <tr>
            <th scope="row"><?= __('Velocity') ?></th>
            <td><?= $this->Number->format($tracker->velocity) ?></td>
        </tr>
        <tr>
            <th scope="row"><?= __('Utm North') ?></th>
            <td><?= $this->Number->format($tracker->utm_north) ?></td>
        </tr>
        <tr>
            <th scope="row"><?= __('Utm East') ?></th>
            <td><?= $this->Number->format($tracker->utm_east) ?></td>
        </tr>
        <tr>
            <th scope="row"><?= __('Last Message') ?></th>
            <td><?= h($tracker->last_message) ?></td>
        </tr>
        <tr>
            <th scope="row"><?= __('Created') ?></th>
            <td><?= h($tracker->created) ?></td>
        </tr>
    </table>
</div>
