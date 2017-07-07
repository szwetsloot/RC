<?php
namespace App\Controller;

use App\Controller\AppController;
use Cake\Event\Event;

/**
* Components Controller
*
* @property \App\Model\Table\ComponentsTable $Components
*
* @method \App\Model\Entity\Component[] paginate($object = null, array $settings = [])
*/
class ZvdTController  extends AppController{

	public function beforeFilter(Event $event){
		parent::beforeFilter($event);
		
		// load required models
		$this->loadModel('SaillingCrews');
		$this->loadModel('SaillingAthletes');
		
		// Set the default layout
		$this->viewBuilder()->setLayout('regattaAdmin');
	}
	
	/**
	* Index method
	*
	* @return \Cake\Http\Response|null
	*/
	public function index(){
		// Get the crews
		$crews = $this->SaillingCrews->find()->all();
		
		// Send the data to the view
		$this->set(compact('crews'));
	}
	
	public function addCrew(){
		// Create an entity
		$crew = $this->SaillingCrews->newEntity();
		
		if ($this->request->is(['post', 'put'])){
			// Update the entity
			$this->SaillingCrews->patchEntity($crew, $this->request->getData());
			
			// Save the entity
			if ($this->SaillingCrews->save($crew)) 
				$this->Flash->success(__("The crew has been saved succesfully"));
			else
				$this->Flash->error(__("Something went wrong"));
			
			// Reset the entity
			$crew = $this->SaillingCrews->newEntity();
		}
		
		$this->set(compact('crew'));
	}
	
	public function viewCrew($id) {
		$crew = $this->SaillingCrews->get(
			$id,
			['contain' => ['SaillingAthletes']]
		);
		/*$this->print_rr($crew);
		die();*/
		$this->set(compact('crew'));
	}
	
	public function addAthlete($crew) {
		// Create a new entity
		$athlete = $this->SaillingAthletes->newEntity();
		
		// set the crew (preset from url)
		$athlete->crew_id = $crew;
		
		if($this->request->is(['post', 'put'])) {
			// Update the entity
			$data = $this->request->getData();
			$file = (object)$data['picture']; unset($data['picture']);
			$this->SaillingAthletes->patchEntity($athlete, $data);
			
			// Check and save the file
			try{
				// Check for file errors
				if ($file->error)
					throw new \Exception(__("Something went wrong with the file"));
				
				// Check the filetype
				$info = (object)pathinfo($file->name);
				if (!in_array($info->extension, ['jpg', 'jpeg', 'png']))
					throw new \Exception(__("Upload the image as jpg or png"));
					
				// Move the file to it's new location
				$dir = 'img/sailling';
				if (!file_exists($dir))
					mkdir($dir);
				$baseName = $info->filename;
				$i = 1;
				while (file_exists($dir.'/'.$info->filename.'.'.$info->extension))
					$info->filename = $baseName.'('.($i++).')';
				if (!move_uploaded_file($file->tmp_name, $dir."/".$info->filename.'.'.$info->extension))
					throw new \Exception(__("Failed to move the file to it's new location"));
				
				// Save the entity
				$athlete->image = $info->filename.'.'.$info->extension;
				$athlete->crew_id = $crew;
				
				if (!$this->SaillingAthletes->save($athlete))
					throw new \Exception(__("Failed to save the athlete"));
				else
					$this->Flash->success(__("Succesfully saved athlete"));
				
			} catch (\Exception $e) {
				
				$this->Flash->error($e->getMessage());
			}
		}
		
		$this->set(compact('athlete'));
	}
}
