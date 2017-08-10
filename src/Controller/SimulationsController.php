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
class SimulationsController extends AppController
{

    public function beforeFilter(Event $event)
    {
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

    public function simulateSailEventV1($id)
    {
        
    }

    public function simulateSailEventBram($id)
    {
        
    }

    public function zvdtResults()
    {
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

        foreach ($bouys as &$bouy)
        {
            $this->GPoint->setLongLat($bouy->Trackers['longitude'], $bouy->Trackers['latitude']);
            $this->GPoint->convertLLtoTM(0);
            $bouy['north'] = $this->GPoint->N();
            $bouy['east'] = $this->GPoint->E();
        }


        $packets = $this->Packets->find()
                ->where([
                    'datetime >=' => '2017-07-30',
                    'datetime <' => '2017-07-31',
                    'time >=' => '83590', // 82800
                    'time <' => '85300'
                ])
                ->all()
                ->toArray();

        $units = [];
        $lastTime = [];
        foreach ($packets as $packet)
        {
            $this->GPoint->setLongLat($packet->longitude, $packet->latitude);
            $this->GPoint->convertLLtoTM(0);
            $timeH = floor($packet->time / 10000) + 2;
            $timeM = floor($packet->time / 100) % 100;
            $timeS = floor($packet->time) % 100;
            $timeMS = $packet->time - floor($packet->time);
            $time = round(((($timeH * 60) + $timeM) * 60 + $timeS + $timeMS) * 1000);
            $units[$packet->tracker][] = (object) [
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
        $startTime = min(array_map(function ($q)
                {
                    return min(array_map(function($r)
                            {
                                return $r->time;
                            }, $q));
                }, $units));

        // Apply a moving average filter over the points
        foreach ($units as $unit) {
            $northing = array_map(function (\stdClass $p) {
                return $p->north;
            }, $unit);
            $easting = array_map(function (\stdClass $p) {
                return $p->east;
            }, $unit);
            $northing = $this->movingAverage($northing, 30);
            $easting = $this->movingAverage($easting, 30);
            foreach ($unit as $i => $packet) {
                $packet->north = $northing[$i];
                $packet->east = $easting[$i];
            }
        }

        $this->set(compact('units', 'crews', 'bouys', 'startTime'));
    }

    /* This function is to test the movements of the results of the ZvdT */

    public function test()
    {
        $this->GPoint = $this->loadComponent('GPoint');
        $packets = $this->Packets->find()
                ->where([
                    'datetime >=' => '2017-07-30',
                    'datetime <' => '2017-07-31',
                    'time >=' => '82800',
                    'time <' => '85300',
                    'tracker' => '4'
                ])
                ->all()
                ->toArray();

        // Convert the packets to northing an#d easting
        foreach ($packets as &$packet)
        {
            $this->GPoint->setLongLat($packet->longitude, $packet->latitude);
            $this->GPoint->convertLLtoTM(0);
            $packet->north = $this->GPoint->N();
            $packet->east = $this->GPoint->E();
            $timeH = floor($packet->time / 10000) + 2;
            $timeM = floor($packet->time / 100) % 100;
            $timeS = floor($packet->time) % 100;
            $timeMS = $packet->time - floor($packet->time);
            $time = round(((($timeH * 60) + $timeM) * 60 + $timeS + $timeMS) * 1000);
            $packet->time = $time / 1000;
        }

        /* echo "<table>";
          foreach ($packets as $packet)
          {
          echo "<tr>"
          . "<td>" . $packet->north . "</td>"
          . "<td>" . $packet->east . "</td>"
          . "<td>" . $packet->time . "</td>"
          . "<td>" . $packet->velocity . "</td>"
          . "<td>" . $packet->heading . "</td>"
          . "</tr>";
          }
          echo "</table>";
          die(); */

        // Filter the data using a moving average
        $easting = array_map(function(\App\Model\Entity\Packet $p)
        {
            return $p->east;
        }, $packets);
        $northing = array_map(function(\App\Model\Entity\Packet $p)
        {
            return $p->north;
        }, $packets);
        $easting = $this->movingAverage($easting, 10);
        $northing = $this->movingAverage($northing, 10);

        foreach ($packets as $i => &$packet)
        {
            $packets[$i]->east = $easting[$i];
            $packets[$i]->north = $northing[$i];
        }

        // Convert the values back to latlon
        foreach ($packets as &$packet)
        {
            $obj = $this->ToLL($packet->north, $packet->east, 31);
            $packet->latitude = $obj['lat'];
            $packet->longitude = $obj['lon'];
        }

        /*
          // Cubic interpolation
          $splinesX = $this->cubicInterpolate(array_map(function(\App\Model\Entity\Packet $p)
          {
          return (object) ['t' => $p->time, 'x' => $p->east];
          }, $packets));
          $splinesY = $this->cubicInterpolate(array_map(function(\App\Model\Entity\Packet $p)
          {
          return (object) ['t' => $p->time, 'x' => $p->north];
          }, $packets));

          // Generate new values from the spines
          $startTime = floor(min(array_map(function(\App\Model\Entity\Packet $a)
          {
          return $a->time;
          }, $packets)));
          $endTime = ceil(max(array_map(function(\App\Model\Entity\Packet $a)
          {
          return $a->time;
          }, $packets)));
          //echo "StartTime = " . $startTime . "<br />";
          //echo "EndTime   = " . $endTime . "<br />";

          $splineCountX = 1;
          $splineCountY = 1;
          $locations = [];
          for ($time = $startTime; $time <= $endTime; $time += 0.500)
          {
          while ($splinesX[$splineCountX+2]->t < $time && $splineCountX < count($splinesX) - 4)
          {
          $splineCountX++;
          }
          while ($splinesY[$splineCountY+2]->t < $time && $splineCountY < count($splinesY) - 4)
          {
          $splineCountY++;
          }
          $SX = $splinesX[$splineCountX];
          $SY = $splinesY[$splineCountY];
          $tDX = (float) ($time - $SX->t);
          $tDY = (float) ($time - $SY->t);
          $X = $SX->a + $SX->b * $tDX + $SX->c * $tDX ** 2 + $SX->d * $tDX ** 3;
          $Y = $SY->a + $SY->b * $tDY + $SY->c * $tDY ** 2 + $SY->d * $tDY ** 3;
          $locations[] = (object) [
          'time' => $time,
          'east' => $X,
          'north' => $Y
          ];
          }

          // Another moving average
          $easting = array_map(function(\stdClass $p) {
          return $p->east;
          }, $locations);
          $northing = array_map(function(\stdClass $p) {
          return $p->north;
          }, $locations);
          $easting = $this->movingAverage($easting, 5);
          $northing = $this->movingAverage($northing, 5);

          foreach ($locations as $i => &$location) {
          $location->east = $easting[$i];
          $location->north = $northing[$i];
          }

          foreach ($locations as &$location)
          {
          $obj = $this->ToLL($location->north, $location->east, 31);
          $location->latitude = $obj['lat'];
          $location->longitude = $obj['lon'];
          } */

        $this->set(compact('packets'));
        //$this->set(compact('locations'));
    }

    private function movingAverage($arr, $count)
    {
        $c = count($arr);
        $av = array_values($arr);
        $res = [];
        for ($i = 0; $i < $c; $i++)
        {
            if ($count % 2)
            {
                $min = $i - ($count - 1) / 2;
                $max = $i + ($count - 1) / 2;
            } else
            {
                $min = $i - $count / 2 + 1;
                $max = $i + $count / 2;
            }
            if ($min < 0)
            {
                $min = 0;
            }
            if ($max >= $c)
            {
                $max = $c - 1;
            }
            $sum = 0;
            for ($j = $min; $j <= $max; $j++)
            {
                $sum += $arr[$j];
            }
            $res[$i] = $sum / ($max - $min + 1);
        }
        return $res;
    }

    private function ToLL($north, $east, $utmZone)
    {
        // This is the lambda knot value in the reference
        $LngOrigin = Deg2Rad($utmZone * 6 - 183);

        // The following set of class constants define characteristics of the
        // ellipsoid, as defined my the WGS84 datum.  These values need to be
        // changed if a different dataum is used.    

        $FalseNorth = 0;   // South or North?
        //if (lat < 0.) FalseNorth = 10000000.  // South or North?
        //else          FalseNorth = 0.   

        $Ecc = 0.081819190842622;       // Eccentricity
        $EccSq = $Ecc * $Ecc;
        $Ecc2Sq = $EccSq / (1. - $EccSq);
        $Ecc2 = sqrt($Ecc2Sq);      // Secondary eccentricity
        $E1 = ( 1 - sqrt(1 - $EccSq) ) / ( 1 + sqrt(1 - $EccSq) );
        $E12 = $E1 * $E1;
        $E13 = $E12 * $E1;
        $E14 = $E13 * $E1;

        $SemiMajor = 6378137.0;         // Ellipsoidal semi-major axis (Meters)
        $FalseEast = 500000.0;          // UTM East bias (Meters)
        $ScaleFactor = 0.9996;          // Scale at natural origin
        // Calculate the Cassini projection parameters

        $M1 = ($north - $FalseNorth) / $ScaleFactor;
        $Mu1 = $M1 / ( $SemiMajor * (1 - $EccSq / 4.0 - 3.0 * $EccSq * $EccSq / 64.0 - 5.0 * $EccSq * $EccSq * $EccSq / 256.0) );

        $Phi1 = $Mu1 + (3.0 * $E1 / 2.0 - 27.0 * $E13 / 32.0) * sin(2.0 * $Mu1);
        + (21.0 * $E12 / 16.0 - 55.0 * $E14 / 32.0) * sin(4.0 * $Mu1);
        + (151.0 * $E13 / 96.0) * sin(6.0 * $Mu1);
        + (1097.0 * $E14 / 512.0) * sin(8.0 * $Mu1);

        $sin2phi1 = sin($Phi1) * sin($Phi1);
        $Rho1 = ($SemiMajor * (1.0 - $EccSq) ) / pow(1.0 - $EccSq * $sin2phi1, 1.5);
        $Nu1 = $SemiMajor / sqrt(1.0 - $EccSq * $sin2phi1);

        // Compute parameters as defined in the POSC specification.  T, C and D

        $T1 = tan($Phi1) * tan($Phi1);
        $T12 = $T1 * $T1;
        $C1 = $Ecc2Sq * cos($Phi1) * cos($Phi1);
        $C12 = $C1 * $C1;
        $D = ($east - $FalseEast) / ($ScaleFactor * $Nu1);
        $D2 = $D * $D;
        $D3 = $D2 * $D;
        $D4 = $D3 * $D;
        $D5 = $D4 * $D;
        $D6 = $D5 * $D;

        // Compute the Latitude and Longitude and convert to degrees
        $lat = $Phi1 - $Nu1 * tan($Phi1) / $Rho1 * ( $D2 / 2.0 - (5.0 + 3.0 * $T1 + 10.0 * $C1 - 4.0 * $C12 - 9.0 * $Ecc2Sq) * $D4 / 24.0 + (61.0 + 90.0 * $T1 + 298.0 * $C1 + 45.0 * $T12 - 252.0 * $Ecc2Sq - 3.0 * $C12) * $D6 / 720.0 );

        $lat = Rad2Deg($lat);

        $lon = $LngOrigin + ($D - (1.0 + 2.0 * $T1 + $C1) * $D3 / 6.0 + (5.0 - 2.0 * $C1 + 28.0 * $T1 - 3.0 * $C12 + 8.0 * $Ecc2Sq + 24.0 * $T12) * $D5 / 120.0) / cos($Phi1);

        $lon = Rad2Deg($lon);

        // Create a object to store the calculated Latitude and Longitude values
        $PC_LatLon['lat'] = $lat;
        $PC_LatLon['lon'] = $lon;

        // Returns a PC_LatLon object
        return $PC_LatLon;
    }

    private function cubicInterpolate($arr)
    {
        // Use cubic interpolation between points;
        // https://en.wikipedia.org/wiki/Spline_(mathematics)#Algorithm_for_computing_natural_cubic_splines
        $n = count($arr);
        $i = 0;

        // Step 1
        $aX = array_fill(0, $n, 0);
        for ($i = 0; $i < $n; $i++)
        {
            $aX[$i] = $arr[$i]->x;
        }

        // Step 2
        $bX = array_fill(0, $n - 1, 0);
        $dX = array_fill(0, $n - 1, 0);

        // Step 3
        $hX = array_fill(0, $n - 1, 0);
        for ($i = 0; $i < $n - 1; $i++)
        {
            $hX[$i] = $arr[$i + 1]->t - $arr[$i]->t;
        }

        // Step 4
        $alphaX = array_fill(0, $n - 1, 0);
        for ($i = 1; $i < $n - 1; $i++)
        {
            $alphaX[$i] = 3 / $hX[$i] * ($aX[$i + 1] - $aX[$i]) - 3 / $hX[$i - 1] * ($aX[$i] - $aX[$i - 1]);
        }

        // Step 5
        $cX = array_fill(0, $n, 0);
        $lX = array_fill(0, $n, 0);
        $muX = array_fill(0, $n, 0);
        $zX = array_fill(0, $n, 0);

        // Step 6
        $lX[0] = 1;
        $muX[0] = $zX[0] = 0;

        // Step 7
        for ($i = 1; $i < $n - 1; $i++)
        {
            $lX[$i] = 2 * ($arr[$i + 1]->t - $arr[$i - 1]->t) - $hX[$i - 1] * $muX[$i - 1];
            $muX[$i] = $hX[$i] / $lX[$i];
            $zX[$i] = ($alphaX[$i] - $hX[$i - 1] * $zX[$i - 1]) / $lX[$i];
        }

        // Step 8
        $lX[$n] = 1;
        $zX[$n] = $cX[$n] = 0;

        // Step 9
        for ($i = $n - 2; $i >= 0; $i--)
        {
            $cX[$i] = $zX[$i] - $muX[$i] * $cX[$i + 1];
            $bX[$i] = ($aX[$i + 1] - $aX[$i]) / $hX[$i] - ($hX[$i] * ($cX[$i + 1] + 2 * $cX[$i])) / 3;
            $dX[$i] = ($cX[$i + 1] - $cX[$i]) / 3;
        }

        // Step 10
        $splines = [];
        for ($i = 0; $i < $n - 1; $i++)
        {
            $splines[$i] = (object) [
                        'a' => $aX[$i],
                        'b' => $bX[$i],
                        'c' => $cX[$i],
                        'd' => $dX[$i],
                        't' => $arr[$i]->t
            ];
        }
        return $splines;
    }

    public function simulateSailEventDummy()
    {
// Retrieve the crews from the database
        $crews = $this->SaillingCrews->find()
                ->contain(['Trackers'])
                ->all()
                ->toArray();

// Filter the crews to the ones we'll be working with
        $eventCrews = [1, 2, 3];
        $crews = array_filter($crews, function($e) use ($eventCrews)
        {
            return in_array($e['id'], $eventCrews);
        });

// Conver the wgs84 to utm
        $this->GPoint = $this->loadComponent('GPoint');
        foreach ($crews as &$crew)
        {
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
        foreach ($bouys as &$bouy)
        {
            $this->GPoint->setLongLat($bouy->Trackers['longitude'], $bouy->Trackers['latitude']);
            $this->GPoint->convertLLtoTM(0);
            $bouy['north'] = $this->GPoint->N();
            $bouy['east'] = $this->GPoint->E();
        }



        // If the simulatiion is running, reset the location of the boats to the locations of the bouys
        if (SIMULATION)
        {
            if (TEST == "test 1")
            { // This test is a simple round the bouy
                $startBouy = array_filter($bouys, function($q)
                {
                    return $q['order'] == 1;
                });
                $startBouy = array_shift($startBouy);
                $secondBouy = array_filter($bouys, function($q) use ($startBouy)
                {
                    return $q['prev'] == $startBouy['id'];
                });
                $secondBouy = array_shift($secondBouy);
                $angle = atan2($secondBouy['north'] - $startBouy['north'], $secondBouy['east'] - $startBouy['east']);
                foreach ($crews as $i => &$crew)
                {
                    // For this test we start 10m north of the startbouy
                    $crew['tracker']['north'] = $startBouy['north'] - (BOUY_DIST * sin($angle));
                    $crew['tracker']['east'] = $startBouy['east'] + (BOUY_DIST * cos($angle));
                    $crew['tracker']['heading'] = $angle * 180 / pi();
                    if ($i == 0)
                    {
                        $crew['tracker']['velocity'] = TEST_VELOCITY;
                    } else
                    {
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

    private function getWindWaveData()
    {
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
        foreach ($data->series[0]->data as $item)
        {
            // Parse the dateTime to check if it is most recent
            $time = strtotime($item->dateTime) . "<br />";
            if ($time > $maxTime)
            {
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
        foreach ($data->series[0]->data as $item)
        {
            // Parse the dateTime to check if it is most recent
            $time = strtotime($item->dateTime) . "<br />";
            if ($time > $maxTime)
            {
                $maxTime = $time;
                $windDirection = $item->value;
            }
        }

        return [$waveDirection, $windDirection];
    }

    public function sailEventListener($type = 0, $startTime = null)
    {
        if (SIMULATION)
        {
            die(json_encode($this->simulationListener($type, $startTime)));
        } else
        {
            // TODO - Here the data from the database should be loaded
        }
    }

    private function simulationListener($type, $startTime)
    {

        if ($type == 0)
        { // Get bouys
            return $this->simulationListenerGetBouys($startTime);
        } elseif ($type == 1)
        { // Get boats
            return $this->simulationListenerGetBoats($startTime);
        }
    }

    private function simulationListenerGetBouys($startTime)
    {
        return $unit;
    }

    private function simulationListenerGetBoats($startTime)
    {


        // Get the bouys
        $bouys = $this->Bouys->find()
                ->contain(['trackers'])
                ->all()
                ->toArray();
        $this->GPoint = $this->loadComponent('GPoint');
        foreach ($bouys as &$bouy)
        {
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
        $crews = array_filter($crews, function($e) use ($eventCrews)
        {
            return in_array($e->id, $eventCrews);
        });

        $startBouy = array_filter($bouys, function($q)
        {
            return $q['order'] == 1;
        });
        $startBouy = array_shift($startBouy);
        $secondBouy = array_filter($bouys, function($q) use ($startBouy)
        {
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
        $afstand_boeien = sqrt(pow($start['east'] - $end['east'], 2) + pow($start['north'] - $end['north'], 2));

        if (TEST == "test 1")
        {
            $mils = round(microtime(true) * 1000);
            foreach ($crews as $i => &$crew)
            {
                $velocity = TEST_VELOCITY * (1 - 0.05 * $i);
                // Go straight till above the first bouy
                $sElapsed = ($mils - $startTime) / 1000;
                $diff = (($afstand_boeien * 2 + BOUY_DIST * pi() * 2) / $velocity);
                while ($sElapsed > $diff)
                    $sElapsed -= $diff;
                $crew['tracker']['time'] = $sElapsed;
                if ($sElapsed <= ($afstand_boeien / $velocity))
                {
                    $crew['tracker']['north'] = $start['north'] + ($sElapsed * $velocity) * sin($angle);
                    $crew['tracker']['east'] = $start['east'] + ($sElapsed * $velocity) * cos($angle);
                    $crew['tracker']['heading'] = ($angle) * 180 / pi();
                    $crew['tracker']['velocity'] = $velocity;
                } else if (
                        $sElapsed > ($afstand_boeien / $velocity) &&
                        $sElapsed <= (($afstand_boeien + BOUY_DIST * pi()) / $velocity)
                )
                {
                    $anglePerc = ($sElapsed - ($afstand_boeien / $velocity)) / (BOUY_DIST * pi()) * $velocity;
                    $crew['tracker']['test'] = $anglePerc;
                    $crew['tracker']['north'] = $secondBouy['north'] + BOUY_DIST * sin($angle - pi() * $anglePerc + pi() / 2);
                    $crew['tracker']['east'] = $secondBouy['east'] + BOUY_DIST * cos($angle - pi() * $anglePerc + pi() / 2);
                    $crew['tracker']['heading'] = ($angle - $anglePerc * pi()) * 180 / pi();
                    $crew['tracker']['velocity'] = $velocity;
                } elseif (
                        $sElapsed > (($afstand_boeien + BOUY_DIST * pi()) / $velocity) &&
                        $sElapsed <= (($afstand_boeien * 2 + BOUY_DIST * pi()) / $velocity)
                )
                {
                    $sElapsed -= (($afstand_boeien + BOUY_DIST * pi()) / $velocity);
                    $crew['tracker']['north'] = $end['north'] - ($sElapsed * $velocity) * sin($angle);
                    $crew['tracker']['east'] = $end['east'] - ($sElapsed * $velocity) * cos($angle);
                    $crew['tracker']['heading'] = $angle * 180 / pi() + 180;
                    $crew['tracker']['velocity'] = $velocity;
                } elseif (
                        $sElapsed > (($afstand_boeien * 2 + BOUY_DIST * pi()) / $velocity) &&
                        $sElapsed <= (($afstand_boeien * 2 + BOUY_DIST * pi() * 2) / $velocity)
                )
                {
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
        foreach ($crews as &$crew)
        {

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
