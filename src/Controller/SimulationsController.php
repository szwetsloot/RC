<?php

namespace App\Controller;

use App\Controller\AppController;
use Cake\Event\Event;

define("SIMULATION", 1);
define("TEST", "test 1");
define("TEST_VELOCITY", 5);
define("BOUY_DIST", 10);

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
        $this->loadModel('Packets');

// Set the default layout
        $this->viewBuilder()->setLayout('ajax');
    }

    public function simulateSailEventV1($id) {
        
    }

    public function simulateSailEventBram($id) {
        
    }
    
    public function zvdtResults() {
        $this->GPoint = $this->loadComponent('GPoint');
        
        $crews = $this->SaillingCrews->find()
                ->where([
                    'OR' => [
                        ['id' => 12],
                        ['id' => 7],
                        ['id' => 9],
                        ['id' => 8]
                        ]
                ])
                ->all();
        
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
        
        
        $packets = $this->Packets->find()
                ->where([
                    'datetime >=' => '2017-07-30',
                    'datetime <' => '2017-07-31',
                    'time >=' => '82800',
                    'time <' => '85300'
                    ])
                ->all()
                ->toArray();
        
        $units = [];
        $lastTime = [];
        foreach ($packets as $packet) {
            $this->GPoint->setLongLat($packet->longitude, $packet->latitude);
            $this->GPoint->convertLLtoTM(0);
            $timeH = floor($packet->time / 10000) + 2;
            $timeM = floor($packet->time / 100) % 100;
            $timeS = floor($packet->time) % 100;
            $timeMS = $packet->time - floor($packet->time);
            $time = round(((($timeH * 60) + $timeM) * 60 + $timeS + $timeMS) * 1000);
            $units[$packet->tracker][] = (object)[
                'id' => $packet->id,
                'time' => $time,
                'heading' => $packet->heading,
                'velocity' => $packet->velocity,
                'lat' => $packet->latitude,
                'long' => $packet->longitude,
                'north' => $this->GPoint->N(),
                'east' => $this->GPoint->E()
            ];
            $lastTime[$packet->tracker] = $packet->time;
        }
        
        // Find the minimum time within the trackers
        $startTime = min(array_map(function ($q) {
            return min(array_map(function($r) {
                return $r->time;
            }, $q));
        }, $units));
        
        // Filter the wrong packets
        foreach ($units as $unit) {
            $oldPacket = null;
            foreach ($unit as $packet) {
                if (is_null($oldPacket)) {
                    $oldPacket = $packet;
                    continue;
                }
                if ($packet->north - $oldPacket->north > 2000) {
                    $this->print_rr($packet);
                    $this->print_rr($oldPacket);
                }
                if ($packet->east - $oldPacket->east > 2000) {
                    $this->print_rr($packet);
                    $this->print_rr($oldPacket);
                }
                $oldPacket = $packet;
            }
        }
        
        $this->set(compact('units', 'crews', 'bouys', 'startTime'));
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
            if (TEST == "test 1") { // This test is a simple round the bouy
                $startBouy = array_filter($bouys, function($q) {
                    return $q['order'] == 1;
                });
                $startBouy = array_shift($startBouy);
                $secondBouy = array_filter($bouys, function($q) use ($startBouy) {
                    return $q['prev'] == $startBouy['id'];
                });
                $secondBouy = array_shift($secondBouy);
                $angle = atan2($secondBouy['north'] - $startBouy['north'], $secondBouy['east'] - $startBouy['east']);
                foreach ($crews as $i => &$crew) {
                    // For this test we start 10m north of the startbouy
                    $crew['tracker']['north'] = $startBouy['north'] - (BOUY_DIST * sin($angle));
                    $crew['tracker']['east'] = $startBouy['east'] + (BOUY_DIST * cos($angle));
                    $crew['tracker']['heading'] = $angle * 180 / pi();
                    if ($i == 0) {
                        $crew['tracker']['velocity'] = TEST_VELOCITY;
                    } else {
                        $crew['tracker']['velocity'] = 0;
                    }
                }
            }

            /* foreach ($crews as $i => &$crew) {
              $crew['tracker']['north'] = $bouys[0]['north'];
              $crew['tracker']['east'] = $bouys[0]['east'];
              $this->Trackers->save($crew->tracker);
              } */
        }

        $data = $this->getWindWaveData();
        $wind = $data[1];
        $wave = $data[0];
        $startTime = round(microtime(true) * 1000);
        $this->set(
                compact(
                        'crews', 'bouys', 'wind', 'wave', 'startTime'
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
            $time = strtotime($item->dateTime) . "<br />";
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
            $time = strtotime($item->dateTime) . "<br />";
            if ($time > $maxTime) {
                $maxTime = $time;
                $windDirection = $item->value;
            }
        }

        return [$waveDirection, $windDirection];
    }

    public function sailEventListener($type = 0, $startTime = null) {
        if (SIMULATION) {
            die(json_encode($this->simulationListener($type, $startTime)));
        } else {
		// TODO - Here the data from the database should be loaded
        }
    }

    private function simulationListener($type, $startTime) {

        if ($type == 0) { // Get bouys
            return $this->simulationListenerGetBouys($startTime);
        } elseif ($type == 1) { // Get boats
            return $this->simulationListenerGetBoats($startTime);
        }
    }

    private function simulationListenerGetBouys($startTime) {
        return $unit;
    }

    private function simulationListenerGetBoats($startTime) {
    	
    	
        // Get the bouys
        $bouys = $this->Bouys->find()
                ->contain(['trackers'])
                ->all()
                ->toArray();
        $this->GPoint = $this->loadComponent('GPoint');
        foreach ($bouys as &$bouy) {
            $this->GPoint->setLongLat($bouy->Trackers['longitude'], $bouy->Trackers['latitude']);
            $this->GPoint->convertLLtoTM(0);
            $bouy['north'] = $this->GPoint->N();
            $bouy['east'] = $this->GPoint->E();
        } 
        
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

        $startBouy = array_filter($bouys, function($q) {
            return $q['order'] == 1;
        });
        $startBouy = array_shift($startBouy);
        $secondBouy = array_filter($bouys, function($q) use ($startBouy) {
            return $q['prev'] == $startBouy['id'];
        });
        $secondBouy = array_shift($secondBouy);
        $angle = atan2($secondBouy['north'] - $startBouy['north'], $secondBouy['east'] - $startBouy['east']);
                
        $start = array(
            'north' => $startBouy['north'] - (BOUY_DIST * sin($angle)),
            'east' => $startBouy['east'] + (BOUY_DIST * cos($angle))
        );
        $end = array(
            'north' => $secondBouy['north'] + (BOUY_DIST * sin($angle)),
            'east' => $secondBouy['east'] - (BOUY_DIST * cos($angle))
        );
        
        // IK heb nieuwe coordinaten van de boein in de database gezet en dit levert een nieuwe normaal afstand voor de boeien
        // $afstand_boeien = 160.67; // oude value
        //$afstand_boeien = 160.78027067537357;
        $afstand_boeien = sqrt( pow( $start['east'] - $end['east'] , 2 ) + pow( $start['north'] - $end['north'] , 2 ) );

        if (TEST == "test 1") {
            $mils = round(microtime(true) * 1000);
            foreach ($crews as $i => &$crew) {
                $velocity = TEST_VELOCITY * (1 - 0.05 * $i);
                // Go straight till above the first bouy
                $sElapsed = ($mils - $startTime) / 1000;
                $diff = (($afstand_boeien * 2 + BOUY_DIST * pi() * 2) / $velocity);
                while ($sElapsed > $diff) $sElapsed -= $diff;
                $crew['tracker']['time'] = $sElapsed;
                if ($sElapsed <= ($afstand_boeien / $velocity)) {
                    $crew['tracker']['north'] = $start['north'] + ($sElapsed * $velocity) * sin($angle);
                    $crew['tracker']['east'] = $start['east'] + ($sElapsed * $velocity) * cos($angle);
                    $crew['tracker']['heading'] = ($angle) * 180 / pi();
                    $crew['tracker']['velocity'] = $velocity;
                } else if (
                        $sElapsed > ($afstand_boeien / $velocity) &&
                        $sElapsed <= (($afstand_boeien + BOUY_DIST * pi()) / $velocity)
                ) {                	
                    $anglePerc = ($sElapsed - ($afstand_boeien / $velocity)) / (BOUY_DIST * pi()) * $velocity;
                    $crew['tracker']['test'] = $anglePerc;
                    $crew['tracker']['north'] = $secondBouy['north'] + BOUY_DIST * sin($angle - pi() * $anglePerc + pi() / 2);
                    $crew['tracker']['east'] = $secondBouy['east'] + BOUY_DIST  * cos($angle - pi() * $anglePerc + pi() / 2);
                    $crew['tracker']['heading'] = ($angle - $anglePerc * pi()) * 180 / pi();
                    $crew['tracker']['velocity'] = $velocity;
                } elseif (
                        $sElapsed > (($afstand_boeien + BOUY_DIST * pi()) / $velocity) && 
                        $sElapsed <= (($afstand_boeien * 2 + BOUY_DIST * pi()) / $velocity)
                ) {
                    $sElapsed -= (($afstand_boeien + BOUY_DIST * pi()) / $velocity);
                    $crew['tracker']['north'] = $end['north'] - ($sElapsed * $velocity) * sin($angle);
                    $crew['tracker']['east'] = $end['east'] - ($sElapsed * $velocity) * cos($angle);
                    $crew['tracker']['heading'] = $angle * 180 / pi() + 180;
                    $crew['tracker']['velocity'] = $velocity;
                } elseif (
                        $sElapsed > (($afstand_boeien * 2 + BOUY_DIST * pi()) / $velocity) && 
                        $sElapsed <= (($afstand_boeien * 2 + BOUY_DIST * pi() * 2) / $velocity)
                        ) {
                    $sElapsed -= (($afstand_boeien * 2 + BOUY_DIST * pi()) / $velocity);
                    $anglePerc = $crew['tracker']['north'] = $sElapsed / (BOUY_DIST * pi()) * $velocity;
                    $crew['tracker']['test'] = $anglePerc;
                    $crew['tracker']['north'] = $startBouy['north'] + BOUY_DIST * sin($angle - pi() * $anglePerc - pi() / 2);
                    $crew['tracker']['east'] = $startBouy['east'] + BOUY_DIST * cos($angle - pi() * $anglePerc - pi() / 2);
                    $crew['tracker']['heading'] = ($angle - $anglePerc * pi()) * 180 / pi() + 180;
                    $crew['tracker']['velocity'] = $velocity;
                }
            }
            return $crews;
        }

        // Conver the wgs84 to utm
        $this->GPoint = $this->loadComponent('GPoint');
        foreach ($crews as &$crew) {

            // Update the data (approximately a circle)
            $crew->tracker->north += sin($crew->tracker->heading / 180 * pi()) * $crew->tracker->velocity;
            $crew->tracker->east += cos($crew->tracker->heading / 180 * pi()) * $crew->tracker->velocity;

            $crew->tracker->velocity = 5 + rand(0, 4);
            $crew->tracker->heading += 360 / 10 + rand(-1, 1);
            $crew->tracker->heading %= 360;

            // Save the new data
            $this->Trackers->save($crew->tracker);
        }
        return $crews;
    }

}
