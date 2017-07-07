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
class ApiController extends AppController{
	
	public function beforeFilter(Event $event){
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
	public function index(){
		$this->viewBuilder()->setLayout('ajax');
		$message = $this->Messages->newEntity();
		$message->text = base64_encode(serialize($this->request));
		$this->Messages->save($message);
		
		$data = $this->request->getData();
		$data = array_shift($data);
		$str = "";
		$arr = array();
		for ($i = 0; $i < strlen($data) - 1; $i+= 2)
			$arr[$i] = chr(hexdec(substr($data, $i, 2)));
		$data = implode($arr);
		
		// Get the variables
		$state    = unpack('C', substr($data, 0, 1))[1];
		$time     = unpack('f', substr($data, 1, 4))[1];
	 	$long	    = unpack('f', substr($data, 5, 4))[1];
	 	$lat  	  = unpack('f', substr($data, 9, 4))[1];
	 	$velocity = unpack('f', substr($data, 13, 4))[1];
	 	$heading  = unpack('f', substr($data, 17, 4))[1];
	 	
	 	$packet = $this->Packets->newEntity();
	 	$packet->time 			= $time;
	 	$packet->state			= $state;
	 	$packet->longitude	= $long;
	 	$packet->latitude		= $lat;
	 	$packet->heading		= $heading;
	 	$packet->velocity		= $velocity;
	 	$this->Packets->save($packet);

	 	
	 	echo "State = ".$state."<br />";
	 	echo "Lat = ".$lat."<br />";
	 	echo "Long = ".$long."<br />";
	 	echo "Heading = ".$heading."<br />";
	 	echo "Velocity = ".$velocity."<br />";
	 	die();
		
		$this->Messages->save($message);
		die('Success');
	}
	
	public function process() {
		$message = $this->Messages->get(1833);
		$string  = $message->text;
		$data = unserialize(base64_decode($string));
		$data = $data->getData();
		$data = array_shift($data);
		$str = "";
		for ($i = 0; $i < strlen($data) - 1; $i+= 2) {
			$arr[$i] = chr(hexdec(substr($data, $i, 2)));
		}
		$data = implode($arr);
		
		// Get the variables
		$state    = unpack('C', substr($data, 0, 1))[1];
		$time     = unpack('f', substr($data, 1, 4))[1];
	 	$lat	    = unpack('f', substr($data, 5, 4))[1];
	 	$long 	  = unpack('f', substr($data, 9, 4))[1];
	 	$velocity = unpack('f', substr($data, 13, 4))[1];
	 	$heading = unpack('f', substr($data, 17, 4))[1];
	 	
	 	echo "State = ".$state."<br />";
	 	echo "Time = ".$time."<br />";
	 	echo "Lat = ".$lat."<br />";
	 	echo "Long = ".$long."<br />";
	 	echo "Heading = ".$heading."<br />";
	 	echo "Velocity = ".$velocity."<br />";
	 	die();
	}
	
	public function view() {
		$this->viewBuilder()->setLayout('ajax');
		$tracker = $this->Packets->find()
			->last();
		// Correct the data
		$timeH = floor($tracker->time / 10000) + 2;
		$timeM = str_pad(floor($tracker->time / 100) % 100, '0', STR_PAD_LEFT);
		$timeS = str_pad(floor($tracker->time) % 100, '0', STR_PAD_LEFT);
		$time = $timeH.":".$timeM.":".$timeS;
		$tracker->time = $time;
		$tracker->GPSConnection = $tracker->state == '86'?'No':'Yes';
		$this->set(compact('tracker'));
		//die($this->print_rr($tracker));
	}
	
	public function ajaxRefresh($id) {
		$tracker = $this->Packets->find()
			->last();
		if ($tracker->id != $id) {
			$timeH = floor($tracker->time / 10000) + 2;
			$timeM = str_pad(floor($tracker->time / 100) % 100, '0', STR_PAD_LEFT);
			$timeS = str_pad(floor($tracker->time) % 100, '0', STR_PAD_LEFT);
			$time = $timeH.":".$timeM.":".$timeS;
			$tracker->time = $time;
			$tracker->GPSConnection = $tracker->state == '86'?'No':'Yes';
			die(json_encode($tracker));
		}
		else
			die('none');
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
