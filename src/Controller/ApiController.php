<?php

namespace App\Controller;

use App\Controller\AppController;
use Cake\Event\Event;
use Cake\I18n\Time;

/**
 * Api Controller
 *
 * @property \App\Model\Table\ApiTable $Api
 *
 * @method \App\Model\Entity\Api[] paginate($object = null, array $settings = [])
 */
class ApiController extends AppController {

    public function beforeFilter(Event $event) {
        parent::beforeFilter($event);

// load required models
        $this->loadModel('Messages');
        $this->loadModel('Packets');
    }

    /**
     * Index method
     *
     * @return \Cake\Http\Response|null
     */
    public function index() {
        $this->viewBuilder()->setLayout('ajax');
        $message = $this->Messages->newEntity();
        $message->text = base64_encode(serialize($this->request));
        $this->Messages->save($message);
        $this->processPacket($message->id);
        die('Success');
    }

    public function batteryLive($tracker) {
        $packets = $this->Packets->find()
                ->where([
                    'tracker' => $tracker,
                    'datetime >=' => '2017-07-30',
                    'datetime <' => '2017-07-31',
                ])
                ->all();
        $startTime = 0;
        $prevTime = 0;
        $totalTime = 0;
        foreach ($packets as $packet) {
            if ($packet->time < $prevTime) {
                continue;
            }
            if ($packet->time <= 1) {
                continue;
            }
            //echo $packet->time." - ".$totalTime."<br />";
            if ($startTime <= $packet->time) {
                $startTime = $packet->time;
            }
            if ($packet->time - $prevTime < 30) {
                $totalTime += $packet->time - $prevTime;
            }
            $prevTime = $packet->time;
        }
        echo "Totaltime: " . $totalTime . "<br />";
        echo "Battery live min: <br />";
        echo "Hours: " . floor($totalTime / 3600) . "<br />";
        echo "Minutes: " . floor(($totalTime % 3600) / 60) . "<br />";
        echo "Seconds: " . floor(($totalTime % 60));
        die();
    }

    private function processPacket($id) {
        $trackers = [];
        $message = $this->Messages->get($id);
        $string = $message->text;
        $data = unserialize(base64_decode($string));
        if (!count($data->params['pass'])) {
            return;
        }
        $id = $data->params['pass'];
        $vars = $data->getData();
        if (!isset($vars['B']))
            return;
        if (strlen($vars['B']) < 40)
            return;
        $id = array_shift($id);
        //echo "Id = " . $id . "<br />";
        //die($this->print_rr($vars));
        $B = $vars['B'];
        $arr = array();
        for ($i = 0; $i < strlen($B) - 1; $i += 2) {
            $arr[$i] = chr(hexdec(substr($B, $i, 2)));
        }
        array_shift($arr);
        $B = implode($arr);
        for ($i = 0; $i <= count($arr) - 21; $i += 22) {
            // Get the variables
            $state = unpack('C', substr($B, $i + 1, 1))[1];
            $time = unpack('f', substr($B, $i + 2, 4))[1];
            $lat = unpack('f', substr($B, $i + 6, 4))[1];
            $long = unpack('f', substr($B, $i + 10, 4))[1];
            $velocity = unpack('f', substr($B, $i + 14, 4))[1];
            $heading = unpack('f', substr($B, $i + 18, 4))[1];

            echo "<tr>"
            . "<td>" . $message->id . " - " . intval($id) . "</td>"
            . "<td>" . $state . "</td>"
            . "<td>" . $time . "</td>"
            . "<td>" . $lat . "</td>"
            . "<td>" . $long . "</td>"
            . "<td>" . $velocity . "</td>"
            . "<td>" . $heading . "</td>"
            . "</tr>";

            $tracker = $this->Packets->newEntity();
            $tracker->tracker = intval($id);
            $tracker->time = $time;
            $now = Time::now();
            $tracker->datetime = $now;
            $tracker->state = $state;
            $tracker->longitude = $long;
            $tracker->latitude = $lat;
            $tracker->heading = $heading;
            $tracker->velocity = $velocity;
            $trackers[] = $tracker;
            //$this->Packets->save($tracker);
        }
        $message->processed = 1;
        //die($this->print_rr($message));
        $this->Messages->save($message);

        $this->Packets->saveMany($trackers);
    }

    public function process($id = 0) {
        // Set the time limit
        set_time_limit(0);

        $now = Time::now();
        die($this->print_rr($now));

        $messages = $this->Messages->find()
                ->where([
                    'id >= ' => 7001,
                    'processed' => '0'
                ])
                ->all();
        echo "<table>"
        . "<tr>"
        . "<td>Id</td>"
        . "<td>Latitude</td>"
        . "<td>Longitude</td>"
        . "<td>Velocity</td>"
        . "<td>Heading</td>"
        . "</tr>";
        $trackers = array();
        foreach ($messages as $message) {
            $string = $message->text;
            $data = unserialize(base64_decode($string));
            if (!count($data->params['pass'])) {
                continue;
            }
            $id = $data->params['pass'];
            $vars = $data->getData();
            if (!isset($vars['B']))
                continue;
            if (strlen($vars['B']) < 40)
                continue;
            $id = array_shift($id);
            //echo "Id = " . $id . "<br />";
            //die($this->print_rr($vars));
            $B = $vars['B'];
            $arr = array();
            for ($i = 0; $i < strlen($B) - 1; $i += 2) {
                $arr[$i] = chr(hexdec(substr($B, $i, 2)));
            }
            array_shift($arr);
            $B = implode($arr);
            for ($i = 0; $i <= count($arr) - 21; $i += 22) {
                // Get the variables
                $state = unpack('C', substr($B, $i + 1, 1))[1];
                $time = unpack('f', substr($B, $i + 2, 4))[1];
                $lat = unpack('f', substr($B, $i + 6, 4))[1];
                $long = unpack('f', substr($B, $i + 10, 4))[1];
                $velocity = unpack('f', substr($B, $i + 14, 4))[1];
                $heading = unpack('f', substr($B, $i + 18, 4))[1];

                echo "<tr>"
                . "<td>" . $message->id . " - " . intval($id) . "</td>"
                . "<td>" . $state . "</td>"
                . "<td>" . $time . "</td>"
                . "<td>" . $lat . "</td>"
                . "<td>" . $long . "</td>"
                . "<td>" . $velocity . "</td>"
                . "<td>" . $heading . "</td>"
                . "</tr>";

                $tracker = $this->Packets->newEntity();
                $tracker->tracker = intval($id);
                $tracker->time = $time;
                $tracker->state = $state;
                $tracker->longitude = $long;
                $tracker->latitude = $lat;
                $tracker->heading = $heading;
                $tracker->velocity = $velocity;
                $trackers[] = $tracker;
                //$this->Packets->save($tracker);
            }
            $message->processed = 1;
            //die($this->print_rr($message));
            $this->Messages->save($message);
        }
        $this->Packets->saveMany($trackers);
        //$this->print_rr($trackers);
        die('Done');
        $data = $data->getData();
        $data = $data['B'];

        for ($i = 0; $i < strlen($data) - 1; $i += 2) {
            $arr[$i] = chr(hexdec(substr($data, $i, 2)));
        }
        array_shift($arr);
        $data = implode($arr);
        for ($i = 0; $i <= count($arr) - 21; $i += 22) {
// Get the variables
            $state = unpack('C', substr($data, $i + 1, 1))[1];
            $time = unpack('f', substr($data, $i + 2, 4))[1];
            $lat = unpack('f', substr($data, $i + 6, 4))[1];
            $long = unpack('f', substr($data, $i + 10, 4))[1];
            $velocity = unpack('f', substr($data, $i + 14, 4))[1];
            $heading = unpack('f', substr($data, $i + 18, 4))[1];

            echo "State = " . $state . "<br />";
            echo "Time = " . $time . "<br />";
            echo "Lat = " . $lat . "<br />";
            echo "Long = " . $long . "<br />";
            echo "Heading = " . $heading . "<br />";
            echo "Velocity = " . $velocity . "<br />";
            echo "<hr />";
        }



        die();
    }

    public function view() {
        $this->viewBuilder()->setLayout('ajax');
        $tracker_ids = $this->Packets->find()
                ->select('tracker')
                ->distinct('tracker')
                ->all();
        $trackers = [];
        foreach ($tracker_ids as $id) {
            if (!$id->tracker)
                continue;
            $tracker = $this->Packets->find()
                    ->where(['tracker' => $id->tracker])
                    ->last();
            // Correct the data
            $timeH = floor($tracker->time / 10000) + 2;
            $timeM = str_pad(floor($tracker->time / 100) % 100, '0', STR_PAD_LEFT);
            $timeS = str_pad(floor($tracker->time) % 100, '0', STR_PAD_LEFT);
            $time = $timeH . ":" . $timeM . ":" . $timeS;
            $tracker->time = $time;
            $tracker->GPSConnection = $tracker->state == '86' ? 'No' : 'Yes';
            $trackers[] = $tracker;
        }
        //die($this->print_rr($trackers));

        $this->set(compact('trackers'));
//die($this->print_rr($tracker));
    }

    public function check($id) {
        // This function will return whether the unit can start.
        die("S=1500000;");
    }

    public function ajaxRefresh() {
        $tracker_ids = $this->Packets->find()
                ->select('tracker')
                ->distinct('tracker')
                ->all();
        $trackers = [];
        foreach ($tracker_ids as $id) {
            if (!$id->tracker)
                continue;
            $tracker = $this->Packets->find()
                    ->where(['tracker' => $id->tracker])
                    ->last();
            // Correct the data
            $timeH = floor($tracker->time / 10000) + 2;
            $timeM = str_pad(floor($tracker->time / 100) % 100, '0', STR_PAD_LEFT);
            $timeS = str_pad(floor($tracker->time) % 100, '0', STR_PAD_LEFT);
            $time = $timeH . ":" . $timeM . ":" . $timeS;
            $tracker->time = $time;
            $tracker->GPSConnection = $tracker->state == '86' ? 'No' : 'Yes';
            $trackers[] = $tracker;
        }
        die(json_encode($trackers));
    }

    private function hexTo32Float($arr) {
        foreach ($arr as $i => $v)
            $arr[$i] = decHex($v);
        $strHex = implode(array_reverse($arr));
        $v = hexdec($strHex);
        $x = ($v & ((1 << 23) - 1)) + (1 << 23) * ($v >> 31 | 1);
        $exp = ($v >> 23 & 0xFF) - 127;
        return ($x * pow(2, $exp - 23));
    }

}
