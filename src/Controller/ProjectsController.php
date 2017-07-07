<?php
namespace App\Controller;

use App\Controller\AppController;
use Cake\Event\Event;
use Cake\I18n\Time;
use Cake\Utility\Xml;

/**
* Projects Controller
*
* @property \App\Model\Table\ProjectsTable $Projects
*
* @method \App\Model\Entity\Project[] paginate($object = null, array $settings = [])
*/
class ProjectsController extends AppController{
	
	public function beforeFilter(Event $event){
		parent::beforeFilter($event);
		
		// load required models
		$this->loadModel('Attributes');
		$this->loadModel('Components');
		$this->loadModel('ProjectsComponents');
	}

	/**
	* Index method
	*
	* @return \Cake\Http\Response|null
	*/
	public function index($id = null){
		// Load base project from overview page
		if(is_null($id)) $id = 0;
		elseif($id != 0) $project = $this->Projects->find()
		->where(['Projects.id' => $id])
		->contain(['Components' => function ($q){
					return $q->order(['type', 'footprint', 'name']);
				}])
		->first();
    
		$children = $this->Projects->find()
		->where(['parent' => $id])
		->all();

		$this->set(compact('project', 'children', 'id'));
		$this->set('_serialize', ['projects']);
	}

	/**
	* View method
	*
	* @param string|null $id Project id.
	* @return \Cake\Http\Response|null
	* @throws \Cake\Datasource\Exception\RecordNotFoundException When record not found.
	*/
	public function view($id = null){
		$project = $this->Projects->get($id, [
				'contain' => []
			]);

		$this->set('project', $project);
		$this->set('_serialize', ['project']);
	}

	/**
	* Add method
	*
	* @return \Cake\Http\Response|null Redirects on successful add, renders view otherwise.
	*/
	public function add(){
		$project = $this->Projects->newEntity();
		if($this->request->is('post')){
			$project = $this->Projects->patchEntity($project, $this->request->getData());
			$project->created_on = Time::now();
			if($this->Projects->save($project)){
				$this->Flash->success(__('The project has been saved.'));
				return $this->redirect(['action' => 'index', $project->parent]);
			}
			$this->Flash->error(__('The project could not be saved. Please, try again.'));
		}
    
		$parent = ['0' => 'No parent'];
		$this->findParentRecursive($parent, 0, 1);
    
    
    
		$this->set(compact('project', 'parent'));
		$this->set('_serialize', ['project']);
	}
  
	private function findParentRecursive(&$list, $parent, $level){
		if(is_null($parent)) $parent = 0;
		$project = $this->Projects->find()
		->where(['parent' => $parent])
		->select(['id','name'])
		->all()
		->toArray();
		foreach($project as $i => $child){
			$list[$child['id']] = str_repeat('- ', $level).$child['name'];
			$this->findParentRecursive($list, $child['id'], $level + 1);
		}
	}
	
	
	/**
	* Add component method
	*
	* @return \Cake\Http\Response|null Redirects on successful add, renders view otherwise.
	*/
	public function addComponent($project){
		$project = $this->Projects->get($project, [
				'contain' => 'Components'
			]);
		if($this->request->is('post')){
			$data = $this->request->getData();
			$component = $this->Components->get($data['name']);
			$component->_joinData = $this->ProjectsComponents->newEntity(['required' => $data['quantity']]);
			$this->Projects->Components->link($project, [$component]);
			$this->Flash->success(__('The project has been saved.'));
			return $this->redirect(['action' => 'addComponent', $project->id]);
		}
		$types = $this->Components->find()
		->select(['type'])	
		->distinct(['type'])
		->order(['type'])
		->all()
		->toArray();
		$types = array_map( function($r){ return $r->type; }, $types);
		$components = [];
		foreach($types as $type){
			$components[$type] = $this->Components->find()
			->where(['type' => $type])
			->order([
					'footprint',
					'name'
				])
			->all();
		}
		
		// Make keys and values equal
		foreach($types as $k => $v){
			$types[$v] = $v;
			unset($types[$k]);
		}
		
		// This variable is only for the form
		$component = $this->Components->newEntity();
		
		$this->set(compact('project', 'types', 'components', 'component'));
	}
	
	/* Import BOM method
	*
	* @return \Cake\Http\Response|null Redirects on successful add, renders view otherwise.
	*/
	public function importBOM($project){
		// Get the project
		$project = $this->Projects->get($project);
		
		// Check for form submission
		if($this->request->is('post')){
			$file = (object)$this->request->getData('BOM');
			if($file->error == 0){
				// Create a working filename 
				$filename = "BOM_project_".$project->id."_(".$project->name.").html";
				$i = 0;
				while(file_exists('files/BOM/'.$filename))
				$filename = "BOM_project_".$project->id."_(".$project->name.")(".$i++.").html";
				
				// Move the file to its new location
				move_uploaded_file($file->tmp_name, 'files/BOM/'.$filename);
				
				// Redirect to the processing page
				return $this->redirect(['action' => 'processBOM', $project->id, $i-1]);
			} else{
				$this->Flash->error(_("An error occurred uploading the file"));
			}
			die('Done');
		}
		
		// Render
		$this->set(compact('project'));
	}
	
	/* Process BOM method
	*
	* @return \Cake\Http\Response|null Redirects on successful add, renders view otherwise.
	*/
	public function processBOM($project, $i){
		// Load the Project
		$project = $this->Projects->get($project);
		
		// Get the fillename and load it
		if($i <= 0)
		$filename = $filename = "BOM_project_".$project->id."_(".$project->name.").html";
		else
		$filename = "BOM_project_".$project->id."_(".$project->name.")(".$i++.").html";
		
		// Load the file
		$htmlString = file_get_contents('files/BOM/'.$filename);
		
		// Process the HTML
		$dom = new \DOMDocument();
		$dom->loadHTML($htmlString);
		$table = $dom->getElementsByTagName('table')[0];
		$rows  = $table->getElementsByTagName('tr');
		// Remove the ehader row
		$notFound = [];
		$components = [];
		foreach($rows as $i =>  $row){
			if(!$i) continue; // Skip the first line
			// Load the data from the row
			$columns  = $row->getElementsByTagName('td');
			$component = (object) [
				'required' => $columns[0]->textContent,
				'value'    => $columns[1]->textContent,
				'device'   => $columns[2]->textContent,
				'parts'    => $columns[3]->textContent
			];
			
			// See if we have these columns in the finder table
			$q = $this->Attributes->find()
			->where([
					'name'  => $component->device,
					'value' => $component->value
				]);
			if(!$q->count()){ // Add it to the list of not found
				$notFound[] = $component;
				continue;
			}
			
			// Check if it already attached
			$res = $q->first();
			$search = $this->ProjectsComponents->find()
			->where([
					'component_id' => $res->component_id,
					'project_id'    => $project->id
				]);
			if($search->count()){ // Check if the required number is correct
				$search = $search->first();
				if($search->required != $component->required){
					$search->required = $component->required;
					$this->ProjectsComponents->save($search);
				}
			} else{ /// put the component in the array for linking
				$res = $this->Components->get($res->component_id);
				$res->_joinData = $this->ProjectsComponents->newEntity();
				$res->_joinData->required = $component->required;
				//die($this->print_rr($res));
				if(!$this->Projects->Components->link($project, [$res])){
					die($this->print_rr($res));
				}
			}
		}

		$project = $this->Projects->get($project->id, [
				'contain' => [
					'Components' => function($q){
						return $q->order(['type', 'name']);
					}
				]
			]);
		
		$this->set(compact('project', 'components', 'notFound'));
	}
	
	
	/* Clear components method
	*
	* @return \Cake\Http\Response|null Redirects on successful add, renders view otherwise.
	*/
	public function clearComponents($project){
		$this->ProjectsComponents->deleteAll(['project_id' => $project]);
		return $this->redirect(['action' => 'index', $project]);
	}
	
	/* Order projects method
	*
	* @return \Cake\Http\Response|null Redirects on successful add, renders view otherwise.
	*/
	public function orderProjects(){
		// Get all projects
		$projects = ['0' => 'No parent'];
		$this->findParentRecursive($projects, 0, 1);
		unset($projects[0]);
		foreach($projects as $id => &$child){
			// Find the first capital letter
			$matches = [];
			$pos = preg_match('/[A-Z]/', $child, $matches, PREG_OFFSET_CAPTURE);
			$matches = array_shift($matches);
			
			// Find the level of the project
			$level = substr_count(substr($child, 0, $matches[1]), '-') - 1;
			
			// Get the actual project 
			$child = $this->Projects->get($id, [
					'contain' => 'Components'
				]);
			
			$child->level = $level;
		}
		
		// Get a list of components
		$types = $this->Components->find()
		->select(['type'])	
		->distinct(['type'])
		->order(['type'])
		->all()
		->toArray();
		$types = array_map( function($r){ return $r->type; }, $types);
		$components = [];
		foreach($types as $type)
		$components[$type] = $this->Components->find()
		->where(['type' => $type])
		->order([
				'footprint',
				'name'
			])
		->all();
		
		$this->set(compact('types', 'components', 'projects'));
	}
	
	private function getChildren($parent){
		$tmp = $this->Projects->find()
		->where(['parent' => $parent])
		->all()
		->toArray();
		foreach($tmp as &$item)
		$item->children = $this->getChildren($item->id);
		return $tmp;
	}

	/**
	* Edit method
	*
	* @param string|null $id Project id.
	* @return \Cake\Http\Response|null Redirects on successful edit, renders view otherwise.
	* @throws \Cake\Network\Exception\NotFoundException When record not found.
	*/
	public function edit($id = null){
		$project = $this->Projects->get($id, [
				'contain' => []
			]);
		if($this->request->is(['patch', 'post', 'put'])){
			$project = $this->Projects->patchEntity($project, $this->request->getData());
			if($this->Projects->save($project)){
				$this->Flash->success(__('The project has been saved.'));

				return $this->redirect(['action' => 'index']);
			}
			$this->Flash->error(__('The project could not be saved. Please, try again.'));
		}
		$this->set(compact('project'));
		$this->set('_serialize', ['project']);
	}

	/**
	* Delete method
	*
	* @param string|null $id Project id.
	* @return \Cake\Http\Response|null Redirects to index.
	* @throws \Cake\Datasource\Exception\RecordNotFoundException When record not found.
	*/
	public function delete($id = null){
		$this->request->allowMethod(['post', 'delete']);
		$project = $this->Projects->tget($id);
		if($this->Projects->delete($project)){
			$this->Flash->success(__('The project has been deleted.'));
		} else{
			$this->Flash->error(__('The project could not be deleted. Please, try again.'));
		}

		return $this->redirect(['action' => 'index']);
	}
  
  
}
