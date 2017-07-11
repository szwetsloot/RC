<?php

namespace App\Controller;

use App\Controller\AppController;
use Cake\Event\Event;

define("SIMULATION", 1);

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
        $this->loadModel('Bouys');
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
            return in_array($e['id'], $eventCrews);
        });

// Conver the wgs84 to utm
        $this->GPoint = $this->loadComponent('GPoint');
        foreach ($crews as &$crew) {
//die($this->print_rr($crew->tracker));
            $this->GPoint->setLongLat($crew['tracker']['longitude'], $crew['tracker']['latitude']);
            $this->GPoint->convertLLtoTM(0);
            $crew['tracker']['north'] = $this->GPoint->N();
            $crew['tracker']['east'] = $this->GPoint->E();
        }

// Get the bouys
        $bouys = $this->Bouys->find()
                ->contain(['trackers'])
                ->all()
                ->toArray();
        foreach ($bouys as &$bouy) {
            $this->GPoint->setLongLat($bouy->Trackers['longitude'], $bouy->Trackers['latitude']);
            $this->GPoint->convertLLtoTM(0);
            $bouy['north'] = $this->GPoint->N();
            $bouy['east'] = $this->GPoint->E();
        }
        
        // If the simulatiion is running, reset the location of the boats to the locations of the bouys
        if (SIMULATION) {
            foreach ($crews as $i => &$crew) {
                $crew['tracker']['north'] = $bouys[0]['north'];
                $crew['tracker']['east'] = $bouys[0]['east'];
                $this->Trackers->save($crew->tracker);
            }
        }

        $data = $this->getWindWaveData();
        $wind = $data[1];
        $wave = $data[0];

        $this->set(
                compact(
                        'crews', 'bouys', 'wind', 'wave'
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
        $maxTime = 0;
        $waveDirection = 0;
        foreach ($data->series[0]->data as $item) {
            // Parse the dateTime to check if it is most recent
            $time = strtotime($item->dateTime)."<br />";
            if ($time > $maxTime) {
                $maxTime = $time;
                $waveDirection = $item->value;
            }
        }

        $url = "https://waterinfo.rws.nl/api/details/chart?expertParameter=Windrichting___20Lucht___20t.o.v.___20ware___20Noorden___20in___20graad&values=-48,0&locationCode=4529";
        $context = stream_context_create($options);
        $result = file_get_contents($url, false, $context);
        $data = json_decode($result);
        $windDirection = 0;
        $maxTime = 0;
        foreach ($data->series[0]->data as $item) {
            // Parse the dateTime to check if it is most recent
            $time = strtotime($item->dateTime)."<br />";
            if ($time > $maxTime) {
                $maxTime = $time;
                $windDirection = $item->value;
            }
        }
        
        return [$waveDirection, $windDirection];
    }

    public function sailEventListener($type = 0, $unit = null) {
        if (SIMULATION) {
            die(json_encode($this->simulationListener($type, $unit)));
        } else {
// TODO - Here the data from the database should be loaded
        }
    }

    private function simulationListener($type, $unit) {

        if ($type == 0) { // Get bouys
            return $this->simulationListenerGetBouys($unit);
        } elseif ($type == 1) { // Get boats
            return $this->simulationListenerGetBoats($unit);
        }
    }

    private function simulationListenerGetBouys($unit) {
        return $unit;
    }

    private function simulationListenerGetBoats($unit) {
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
            
            // Update the data (approximately a circle)
            $crew->tracker->north += sin($crew->tracker->heading / 180 * pi()) * $crew->tracker->velocity;
            $crew->tracker->east  += cos($crew->tracker->heading / 180 * pi()) * $crew->tracker->velocity;
            
            $crew->tracker->velocity = 5 + rand(0, 4) ;
            $crew->tracker->heading += 360 / 10 + rand(-1,1);
            $crew->tracker->heading %= 360;
            
            // Save the new data
            $this->Trackers->save($crew->tracker);
        }
        return $crews;
    }

}
