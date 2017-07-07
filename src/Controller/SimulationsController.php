<?php

namespace App\Controller;

use App\Controller\AppController;
use Cake\Event\Event;

/**
 * Simulations Controller
 *
 * @property \App\Model\Table\SimulationsTable $Simulations
 *
 * @method \App\Model\Entity\Simulation[] paginate($object = null, array $settings = [])
 */
class SimulationsController extends AppController {

    public function beforeFilter(Event $event) {
        parent::beforeFilter($event);

        // load required models
        $this->loadModel('SaillingCrews');
        $this->loadModel('SaillingAthletes');
        $this->loadModel('Trackers');

        // Set the default layout
        $this->viewBuilder()->setLayout('ajax');
    }

    public function simulateSailEventV1($id) {
        
    }

    public function simulateSailEventBram($id) {
        
    }

    public function simulateSailEventDummy() {
        // Retrieve the crews from the database
        $crews = $this->SaillingCrews->find()
                ->contain(['Trackers'])
                ->all()
                ->toArray();

        // Filter the crews to the ones we'll be working with
        $eventCrews = [1, 2, 3];
        $crews = array_filter($crews, function($e) use ($eventCrews) {
            return in_array($e->id, $eventCrews);
        });

        // Conver the wgs84 to utm
        $this->GPoint = $this->loadComponent('GPoint');
        foreach ($crews as &$crew) {
            //die($this->print_rr($crew->tracker));
            $this->GPoint->setLongLat($crew->tracker['longitude'], $crew->tracker['latitude']);
            $this->GPoint->convertLLtoTM(0);
            $crew->tracker->north = $this->GPoint->N();
            $crew->tracker->east = $this->GPoint->E();
        }

        // Get the bouys
        $bouys = $this->Trackers->find()
                ->where(['type' => 'Bouy'])
                ->all()
                ->toArray();
        foreach ($bouys as &$bouy) {
            $this->GPoint->setLongLat($bouy['longitude'], $bouy['latitude']);
            $this->GPoint->convertLLtoTM(0);
            $bouy['north'] = $this->GPoint->N();
            $bouy['east'] = $this->GPoint->E();
        }

        $data = $this->getWindWaveData();
        $wind = $data[0];
        $wave = $data[1];
        
        $this->set(
                compact(
                        'crews',
                        'bouys',
                        'wind',
                        'wave'
                )
        );
    }

    private function getWindWaveData() {
        // Get the wave direction from Rijkswaterstaat
        $url = "https://waterinfo.rws.nl/api/details/chart?expertParameter=Gemiddelde___20golfrichting___20in___20het___20spectrale___20domein___20Oppervlaktewater___20golffrequentie___20tussen___2030___20en___20500___20mHz___20in___20graad&values=-48,0&locationCode=2183";
        $options = array(
            "ssl" => array(
                "verify_peer" => false,
                "verify_peer_name" => false,
            )
        );
        $context = stream_context_create($options);
        $result = file_get_contents($url, false, $context);
        $data = json_decode($result);
        $waveDirection = $data->series[0]->data[0]->value;

        $url = "https://waterinfo.rws.nl/api/details/chart?expertParameter=Windrichting___20Lucht___20t.o.v.___20ware___20Noorden___20in___20graad&values=-48,0&locationCode=4529";
        $context = stream_context_create($options);
        $result = file_get_contents($url, false, $context);
        $data = json_decode($result);
        $windDirection = $data->series[0]->data[0]->value;

        return [$waveDirection, $windDirection];
    }

}
