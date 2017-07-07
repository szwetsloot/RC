<?php
namespace App\Controller;

use App\Controller\AppController;
use Cake\Event\Event;

/**
* Trackers Controller
*
* @property \App\Model\Table\TrackersTable $Trackers
*
* @method \App\Model\Entity\Tracker[] paginate($object = null, array $settings = [])
*/
class TrackersController extends AppController{
	
	public function beforeFilter(Event $event){
		parent::beforeFilter($event);
		
		// load required models
		$this->loadModel('SaillingCrews');
		
		// Set the default layout
		$this->viewBuilder()->setLayout('regattaAdmin');
	}

	/**
	* Index method
	*
	* @return \Cake\Http\Response|null
	*/
	public function index(){
		$this->paginate = [
			'contain' => ['SaillingCrews']
		];
		$trackers = $this->paginate($this->Trackers);

		$this->set(compact('trackers'));
		$this->set('_serialize', ['trackers']);
	}

	/**
	* View method
	*
	* @param string|null $id Tracker id.
	* @return \Cake\Http\Response|null
	* @throws \Cake\Datasource\Exception\RecordNotFoundException When record not found.
	*/
	public function view($id = null){
		$tracker = $this->Trackers->get($id, [
				'contain' => ['SaillingCrews']
			]);

		$this->set('tracker', $tracker);
		$this->set('_serialize', ['tracker']);
	}

	/**
	* Add method
	*
	* @return \Cake\Http\Response|null Redirects on successful add, renders view otherwise.
	*/
	public function add(){
		$tracker = $this->Trackers->newEntity();
		if($this->request->is('post')){
			$tracker = $this->Trackers->patchEntity($tracker, $this->request->getData());
			if($this->Trackers->save($tracker)){
				$this->Flash->success(__('The tracker has been saved.'));

				return $this->redirect(['action' => 'index']);
			}
			$this->Flash->error(__('The tracker could not be saved. Please, try again.'));
		}
		$saillingCrews = $this->Trackers->SaillingCrews->find('list', ['limit' => 200]);
		$this->set(compact('tracker', 'saillingCrews'));
		$this->set('_serialize', ['tracker']);
	}

	/**
	* Edit method
	*
	* @param string|null $id Tracker id.
	* @return \Cake\Http\Response|null Redirects on successful edit, renders view otherwise.
	* @throws \Cake\Network\Exception\NotFoundException When record not found.
	*/
	public function edit($id = null){
		$tracker = $this->Trackers->get($id, [
				'contain' => []
			]);
		if($this->request->is(['patch', 'post', 'put'])){
			$tracker = $this->Trackers->patchEntity($tracker, $this->request->getData());
			if($this->Trackers->save($tracker)){
				$this->Flash->success(__('The tracker has been saved.'));

				return $this->redirect(['action' => 'index']);
			}
			$this->Flash->error(__('The tracker could not be saved. Please, try again.'));
		}
		$saillingCrews = $this->Trackers->SaillingCrews->find('list', ['limit' => 200]);
		$this->set(compact('tracker', 'saillingCrews'));
		$this->set('_serialize', ['tracker']);
	}

	/**
	* Delete method
	*
	* @param string|null $id Tracker id.
	* @return \Cake\Http\Response|null Redirects to index.
	* @throws \Cake\Datasource\Exception\RecordNotFoundException When record not found.
	*/
	public function delete($id = null){
		$this->request->allowMethod(['post', 'delete']);
		$tracker = $this->Trackers->get($id);
		if($this->Trackers->delete($tracker)){
			$this->Flash->success(__('The tracker has been deleted.'));
		} else{
			$this->Flash->error(__('The tracker could not be deleted. Please, try again.'));
		}

		return $this->redirect(['action' => 'index']);
	}
}
