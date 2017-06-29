<?php
namespace App\Controller;

use App\Controller\AppController;
use Cake\Event\Event;

/**
 * Attributes Controller
 *
 * @property \App\Model\Table\AttributesTable $Attributes
 *
 * @method \App\Model\Entity\Attribute[] paginate($object = null, array $settings = [])
 */
class AttributesController extends AppController {

	public function beforeFilter(Event $event) {
		parent::beforeFilter($event);
		
		// load required models
    $this->loadModel('Components');
	}

  /**
   * Index method
   *
   * @return \Cake\Http\Response|null
   */
  public function index($component) {
      $this->paginate = [
          'contain' => ['Components']
      ];
      $attributes = $this->paginate($this->Attributes->find()->where(['component_id' => $component]));
      $component = $this->Components->get($component);

      $this->set(compact('attributes', 'component'));
      $this->set('_serialize', ['attributes']);
  }

  /**
   * Add method
   *
   * @return \Cake\Http\Response|null Redirects on successful add, renders view otherwise.
   */
  public function add($component) {
    $attribute = $this->Attributes->newEntity();
    if ($this->request->is('post')) {
        $attribute = $this->Attributes->patchEntity($attribute, $this->request->getData());
        $attribute->component_id = $component;
        if ($this->Attributes->save($attribute)) {
            $this->Flash->success(__('The attribute has been saved.'));

            return $this->redirect(['action' => 'index', $component]);
        }
        $this->Flash->error(__('The attribute could not be saved. Please, try again.'));
    }
      
    $this->set(compact('attribute', 'components', 'types'));
    $this->set('_serialize', ['attribute']);
  }

  /**
   * Edit method
   *
   * @param string|null $id Attribute id.
   * @return \Cake\Http\Response|null Redirects on successful edit, renders view otherwise.
   * @throws \Cake\Network\Exception\NotFoundException When record not found.
   */
  public function edit($id = null)
  {
      $attribute = $this->Attributes->get($id, [
          'contain' => []
      ]);
      if ($this->request->is(['patch', 'post', 'put'])) {
          $attribute = $this->Attributes->patchEntity($attribute, $this->request->getData());
          if ($this->Attributes->save($attribute)) {
              $this->Flash->success(__('The attribute has been saved.'));

              return $this->redirect(['action' => 'index']);
          }
          $this->Flash->error(__('The attribute could not be saved. Please, try again.'));
      }
      $components = $this->Attributes->Components->find('list', ['limit' => 200]);
      $this->set(compact('attribute', 'components'));
      $this->set('_serialize', ['attribute']);
  }

  /**
   * Delete method
   *
   * @param string|null $id Attribute id.
   * @return \Cake\Http\Response|null Redirects to index.
   * @throws \Cake\Datasource\Exception\RecordNotFoundException When record not found.
   */
  public function delete($id = null)
  {
      $this->request->allowMethod(['post', 'delete']);
      $attribute = $this->Attributes->get($id);
      if ($this->Attributes->delete($attribute)) {
          $this->Flash->success(__('The attribute has been deleted.'));
      } else {
          $this->Flash->error(__('The attribute could not be deleted. Please, try again.'));
      }

      return $this->redirect(['action' => 'index']);
  }
}
