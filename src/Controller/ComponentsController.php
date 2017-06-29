<?php
namespace App\Controller;

use App\Controller\AppController;

/**
 * Components Controller
 *
 * @property \App\Model\Table\ComponentsTable $Components
 *
 * @method \App\Model\Entity\Component[] paginate($object = null, array $settings = [])
 */
class ComponentsController extends AppController {

    /**
     * Index method
     *
     * @return \Cake\Http\Response|null
     */
    public function index() {
        $types = $this->Components->find()
        	->select(['type'])
        	->distinct(['type'])
        	->order(['type'])
        	->all()
        	->toArray();
        $types = array_map(function($r) { return $r->type; }, $types);
        $components = [];
        foreach ($types as $type) {
					$components[$type] = $this->Components->find()
						->where(['type' => $type])
						->order([
							'footprint',
							'name'
						])
						->all();
				}
        
        $this->set(compact('types', 'components'));
    }

    /**
     * View method
     *
     * @param string|null $id Component id.
     * @return \Cake\Http\Response|null
     * @throws \Cake\Datasource\Exception\RecordNotFoundException When record not found.
     */
    public function view($id = null)
    {
        $component = $this->Components->get($id, [
            'contain' => []
        ]);

        $this->set('component', $component);
        $this->set('_serialize', ['component']);
    }

    /**
     * Add method
     *
     * @return \Cake\Http\Response|null Redirects on successful add, renders view otherwise.
     */
    public function add()
    {
        $component = $this->Components->newEntity();
        if ($this->request->is('post')) {
            $component = $this->Components->patchEntity($component, $this->request->getData());
            if ($this->Components->save($component)) {
                $this->Flash->success(__('The component has been saved.'));

                return $this->redirect(['action' => 'index']);
            }
            $this->Flash->error(__('The component could not be saved. Please, try again.'));
        }
        $this->set(compact('component'));
        $this->set('_serialize', ['component']);
    }

    /**
     * Edit method
     *
     * @param string|null $id Component id.
     * @return \Cake\Http\Response|null Redirects on successful edit, renders view otherwise.
     * @throws \Cake\Network\Exception\NotFoundException When record not found.
     */
    public function edit($id = null)
    {
        $component = $this->Components->get($id, [
            'contain' => []
        ]);
        if ($this->request->is(['patch', 'post', 'put'])) {
            $component = $this->Components->patchEntity($component, $this->request->getData());
            if ($this->Components->save($component)) {
                $this->Flash->success(__('The component has been saved.'));

                return $this->redirect(['action' => 'index']);
            }
            $this->Flash->error(__('The component could not be saved. Please, try again.'));
        }
        $this->set(compact('component'));
        $this->set('_serialize', ['component']);
    }

    /**
     * Delete method
     *
     * @param string|null $id Component id.
     * @return \Cake\Http\Response|null Redirects to index.
     * @throws \Cake\Datasource\Exception\RecordNotFoundException When record not found.
     */
    public function delete($id = null)
    {
        $this->request->allowMethod(['post', 'delete']);
        $component = $this->Components->get($id);
        if ($this->Components->delete($component)) {
            $this->Flash->success(__('The component has been deleted.'));
        } else {
            $this->Flash->error(__('The component could not be deleted. Please, try again.'));
        }

        return $this->redirect(['action' => 'index']);
    }
}
