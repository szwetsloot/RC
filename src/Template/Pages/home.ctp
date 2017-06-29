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
use Cake\Cache\Cache;
use Cake\Core\Configure;
use Cake\Core\Plugin;
use Cake\Datasource\ConnectionManager;
use Cake\Error\Debugger;
use Cake\Network\Exception\NotFoundException;
use Cake\ORM\TableRegistry;

$this->layout = false;
$this->Users = TableRegistry::get('Users');

$user = $this->Users->newEntity();

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
	</div>
	<div id='content'>
		<div id='login'>
			<div id='login-header'>Login</div>
			<?= $this->Form->create($user, ['id' => 'login-form', 'url' => ['controller' => 'Users', 'action' => 'login']]) ?>
			<?= $this->Form->control('username') ?>
			<?= $this->Form->control('password') ?>
			<?= $this->Form->submit('Login') ?>
			<?= $this->Form->end() ?>
		</div>
	</div>
</body>
</html>

<script type='text/javascript'>
$(function() {
	$('#login').hide();
	$('#login').fadeIn(1000);
	$('#information').fadeIn(1000);
	$('div').not('div #login').not('div #login-header').not('#login-form div').not('div#content').not('div#information').fadeTo(1000, 0.3);
	$('#Links a').bind('click', function(e){
        e.preventDefault();
	})
});
</script>