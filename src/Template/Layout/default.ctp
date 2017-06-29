<?php
/**
 * CakePHP(tm) : Rapid Development Framework (http://cakephp.org)
 * Copyright (c) Cake Software Foundation, Inc. (http://cakefoundation.org)
 *
 * Licensed under The MIT License
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright (c) Cake Software Foundation, Inc. (http://cakefoundation.org)
 * @link          http://cakephp.org CakePHP(tm) Project
 * @since         0.10.0
 * @license       http://www.opensource.org/licenses/mit-license.php MIT License
 */

$cakeDescription = 'Rowcoaching admin panel';
?>

<!DOCTYPE html>
<html>
<head>
    <?= $this->Html->charset() ?>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>
        <?= $cakeDescription ?>
    </title>

    <?= $this->Html->meta('icon') ?>
    <?= "<!-- -->"//$this->Html->css('base.css') ?>
    <?= "<!-- -->"//$this->Html->css('cake.css') ?>	
    <?= "<!-- -->"//$this->Html->css('home.css') ?>
    
    <?= $this->Html->css('style.css') ?>
    
    <?= $this->Html->script('https://code.jquery.com/jquery.min.js'); ?>
</head>
<body>

	<div id='header'>
			<h2>ROW COACHING</h2>
	</div>
	<div id='links'>
		<ul>
			<li>
				<?= $this->Html->image('icons/customers_w.png', [
					'alt' => ' Customers',
					'url' => ['controller' => 'Customers']
				]) ?>
				<?= $this->Html->link('Customers', ['controller' => 'Customers']) ?>
			</li>
			<li>
				<?= $this->Html->image('icons/finances_w.png', [
					'alt' => ' Finance',
					'url' => ['controller' => 'Finances']
				]) ?>
				<?= $this->Html->link('Finances', ['controller' => 'Finances']) ?>
			</li>
			<li>
				<?= $this->Html->image('icons/projects_w.png', [
					'alt' => ' Projects',
					'url' => ['controller' => 'Projects', 'action' => 'index']
				]) ?><br />
				<?= $this->Html->link('Projects', ['controller' => 'Projects', 'action' => 'index']) ?>
			</li>
			<li>
				<?= $this->Html->image('icons/components_w.png', [
					'alt' => ' Components',
					'url' => ['controller' => 'Components', 'action' => 'index']
				]) ?><br />
				<?= $this->Html->link('Components', ['controller' => 'Components', 'action' => 'index']) ?>
			</li>
			<li>
				<?= $this->Html->image('icons/logout_w.png', [
					'alt' => ' Users',
					'url' => ['controller' => 'Users']
				]) ?><br />
				<?= $this->Html->link('Logout', ['controller' => 'Users', 'action' => 'logout']) ?>
			</li>
	</div>
	<?= $this->Flash->render() ?>
	<div id='content'>
		<div class='box-item'>
    	<?= $this->fetch('content') ?>
    </div>
	</div>
</body>
</html>
