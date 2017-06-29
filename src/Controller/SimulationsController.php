<?php
namespace App\Controller;

use App\Controller\AppController;

/**
* Simulations Controller
*
* @property \App\Model\Table\SimulationsTable $Simulations
*
* @method \App\Model\Entity\Simulation[] paginate($object = null, array $settings = [])
*/
class SimulationsController extends AppController {

	public function simulateSailEventV1($id){
		$this->viewBuilder()->setLayout('ajax');
		
	}
    
}
