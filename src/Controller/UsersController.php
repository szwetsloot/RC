<?php
namespace App\Controller;

use App\Controller\AppController;
use Cake\Auth\DefaultPasswordHasher;

/**
 * Users Controller
 *
 * @property \App\Model\Table\UsersTable $Users
 *
 * @method \App\Model\Entity\User[] paginate($object = null, array $settings = [])
 */
class UsersController extends AppController {
	
	public function initialize() {
		$this->loadComponent('Flash');
		$this->loadComponent('Auth', [
			'loginRedirect' => [
				'controller' => 'Customers',
				'action' => 'index'
			],
			'logoutRedirect' => [
				'controller' => 'Pages',
				'action' => 'display',
				'home'
			]
		]);
	}

  /**
   * Login method
   *
   * @return \Cake\Http\Response|null
   */
  public function login() {
    if ($this->request->is('post')) {
    	/*$pass = $this->request->getData('password');
    	$pass = "kbesamusca";
    	$pass = (new DefaultPasswordHasher)->hash($pass);
    	die($pass);*/
			$user = $this->Auth->identify();
			if ($user) {
				$this->Auth->setUser($user);
				return $this->redirect($this->Auth->redirectUrl());
			}
			$this->Flash->error(__("Invalid username of password. Please try again"));
		}
		return $this->redirect(['controller' => 'Pages']);
  }
}
