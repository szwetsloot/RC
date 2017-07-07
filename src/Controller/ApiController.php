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
		$string = "TzoyMzoiQ2FrZVxIdHRwXFNlcnZlclJlcXVlc3QiOjIwOntzOjY6InBhcmFtcyI7YTo2OntzOjEwOiJjb250cm9sbGVyIjtzOjM6IkFwaSI7czo0OiJwYXNzIjthOjA6e31zOjY6ImFjdGlvbiI7czo1OiJpbmRleCI7czo2OiJwbHVnaW4iO047czoxMzoiX21hdGNoZWRSb3V0ZSI7czoxMjoiLzpjb250cm9sbGVyIjtzOjY6ImlzQWpheCI7YjowO31zOjQ6ImRhdGEiO2E6MDp7fXM6NToicXVlcnkiO2E6MDp7fXM6NzoiY29va2llcyI7YTowOnt9czoxNToiACoAX2Vudmlyb25tZW50IjthOjM4OntzOjE0OiJDT05URU5UX0xFTkdUSCI7czozOiIxNTMiO3M6MTI6IkNPTlRFTlRfVFlQRSI7czozMzoiYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkIjtzOjIxOiJDT05URVhUX0RPQ1VNRU5UX1JPT1QiO3M6MjY6Ii9ob21lL3Jvd2NvYTJxL3B1YmxpY19odG1sIjtzOjE0OiJDT05URVhUX1BSRUZJWCI7czowOiIiO3M6MTM6IkRPQ1VNRU5UX1JPT1QiO3M6MjY6Ii9ob21lL3Jvd2NvYTJxL3B1YmxpY19odG1sIjtzOjE3OiJHQVRFV0FZX0lOVEVSRkFDRSI7czo3OiJDR0kvMS4xIjtzOjExOiJIVFRQX0FDQ0VQVCI7czozOiIqLyoiO3M6MTU6IkhUVFBfQ09OTkVDVElPTiI7czoxMDoiS2VlcC1BbGl2ZSI7czo5OiJIVFRQX0hPU1QiO3M6MTU6InJvd2NvYWNoaW5nLmNvbSI7czoxNToiSFRUUF9VU0VSX0FHRU5UIjtzOjE0OiJRVUVDVEVMX01PRFVMRSI7czo0OiJQQVRIIjtzOjEzOiIvYmluOi91c3IvYmluIjtzOjEyOiJRVUVSWV9TVFJJTkciO3M6MDoiIjtzOjI0OiJSRURJUkVDVF9SRURJUkVDVF9TVEFUVVMiO3M6MzoiMjAwIjtzOjE1OiJSRURJUkVDVF9TVEFUVVMiO3M6MzoiMjAwIjtzOjEyOiJSRURJUkVDVF9VUkwiO3M6MTk6Ii9hZG1pbi93ZWJyb290L2FwaS8iO3M6MTE6IlJFTU9URV9BRERSIjtzOjEzOiI1Mi4yMDguMzMuMTMyIjtzOjExOiJSRU1PVEVfUE9SVCI7czo1OiI1MzQ2NSI7czoxNDoiUkVRVUVTVF9NRVRIT0QiO3M6NDoiUE9TVCI7czoxNDoiUkVRVUVTVF9TQ0hFTUUiO3M6NDoiaHR0cCI7czoxMToiUkVRVUVTVF9VUkkiO3M6MTE6Ii9hZG1pbi9hcGkvIjtzOjE1OiJTQ1JJUFRfRklMRU5BTUUiO3M6NTA6Ii9ob21lL3Jvd2NvYTJxL3B1YmxpY19odG1sL2FkbWluL3dlYnJvb3QvaW5kZXgucGhwIjtzOjExOiJTQ1JJUFRfTkFNRSI7czoyNDoiL2FkbWluL3dlYnJvb3QvaW5kZXgucGhwIjtzOjExOiJTRVJWRVJfQUREUiI7czoxMzoiMTg1LjU2LjE0NS42MSI7czoxMjoiU0VSVkVSX0FETUlOIjtzOjI1OiJ3ZWJtYXN0ZXJAcm93Y29hY2hpbmcuY29tIjtzOjExOiJTRVJWRVJfTkFNRSI7czoxNToicm93Y29hY2hpbmcuY29tIjtzOjExOiJTRVJWRVJfUE9SVCI7czoyOiI4MCI7czoxNToiU0VSVkVSX1BST1RPQ09MIjtzOjg6IkhUVFAvMS4xIjtzOjE2OiJTRVJWRVJfU0lHTkFUVVJFIjtzOjA6IiI7czoxNToiU0VSVkVSX1NPRlRXQVJFIjtzOjU1OiJBcGFjaGUvMi40LjI1IChjUGFuZWwpIE9wZW5TU0wvMS4wLjJrIG1vZF9id2xpbWl0ZWQvMS40IjtzOjI6IlRaIjtzOjE2OiJFdXJvcGUvQW1zdGVyZGFtIjtzOjg6IlBIUF9TRUxGIjtzOjI0OiIvYWRtaW4vd2Vicm9vdC9pbmRleC5waHAiO3M6MTg6IlJFUVVFU1RfVElNRV9GTE9BVCI7ZDoxNDk5MzI0MjI3Ljc0NDQ5MjA1Mzk4NTU5NTcwMzEyNTtzOjEyOiJSRVFVRVNUX1RJTUUiO2k6MTQ5OTMyNDIyNztzOjQ6ImFyZ3YiO2E6MDp7fXM6NDoiYXJnYyI7aTowO3M6MjM6Ik9SSUdJTkFMX1JFUVVFU1RfTUVUSE9EIjtzOjQ6IlBPU1QiO3M6NToiSFRUUFMiO2I6MDtzOjIxOiJIVFRQX1hfUkVRVUVTVEVEX1dJVEgiO047fXM6MzoidXJsIjtzOjQ6ImFwaS8iO3M6NDoiYmFzZSI7czo2OiIvYWRtaW4iO3M6Nzoid2Vicm9vdCI7czo3OiIvYWRtaW4vIjtzOjQ6ImhlcmUiO3M6MTE6Ii9hZG1pbi9hcGkvIjtzOjEwOiJ0cnVzdFByb3h5IjtiOjA7czo5OiIAKgBfaW5wdXQiO047czoxNzoiACoAX2RldGVjdG9yQ2FjaGUiO2E6NTp7czo0OiJhamF4IjtiOjA7czozOiJnZXQiO2I6MDtzOjQ6ImhlYWQiO2I6MDtzOjc6Im9wdGlvbnMiO2I6MDtzOjQ6InBvc3QiO2I6MTt9czo5OiIAKgBzdHJlYW0iO086Mjk6IlplbmRcRGlhY3Rvcm9zXFBocElucHV0U3RyZWFtIjo0OntzOjM2OiIAWmVuZFxEaWFjdG9yb3NcUGhwSW5wdXRTdHJlYW0AY2FjaGUiO3M6MDoiIjtzOjQxOiIAWmVuZFxEaWFjdG9yb3NcUGhwSW5wdXRTdHJlYW0AcmVhY2hlZEVvZiI7YjowO3M6MTE6IgAqAHJlc291cmNlIjtpOjA7czo5OiIAKgBzdHJlYW0iO3M6MTE6InBocDovL2lucHV0Ijt9czo2OiIAKgB1cmkiO086MTg6IlplbmRcRGlhY3Rvcm9zXFVyaSI6MTE6e3M6MTc6IgAqAGFsbG93ZWRTY2hlbWVzIjthOjI6e3M6NDoiaHR0cCI7aTo4MDtzOjU6Imh0dHBzIjtpOjQ0Mzt9czoyNjoiAFplbmRcRGlhY3Rvcm9zXFVyaQBzY2hlbWUiO3M6NDoiaHR0cCI7czoyODoiAFplbmRcRGlhY3Rvcm9zXFVyaQB1c2VySW5mbyI7czowOiIiO3M6MjQ6IgBaZW5kXERpYWN0b3Jvc1xVcmkAaG9zdCI7czoxNToicm93Y29hY2hpbmcuY29tIjtzOjI0OiIAWmVuZFxEaWFjdG9yb3NcVXJpAHBvcnQiO047czoyNDoiAFplbmRcRGlhY3Rvcm9zXFVyaQBwYXRoIjtzOjU6Ii9hcGkvIjtzOjI1OiIAWmVuZFxEaWFjdG9yb3NcVXJpAHF1ZXJ5IjtzOjA6IiI7czoyODoiAFplbmRcRGlhY3Rvcm9zXFVyaQBmcmFnbWVudCI7czowOiIiO3M6Mjk6IgBaZW5kXERpYWN0b3Jvc1xVcmkAdXJpU3RyaW5nIjtOO3M6NDoiYmFzZSI7czo2OiIvYWRtaW4iO3M6Nzoid2Vicm9vdCI7czo3OiIvYWRtaW4vIjt9czoxMDoiACoAc2Vzc2lvbiI7TzoyMDoiQ2FrZVxOZXR3b3JrXFNlc3Npb24iOjQ6e3M6MTA6IgAqAF9lbmdpbmUiO047czoxMToiACoAX3N0YXJ0ZWQiO047czoxMjoiACoAX2xpZmV0aW1lIjtzOjQ6IjE0NDAiO3M6OToiACoAX2lzQ0xJIjtiOjA7fXM6MTM6IgAqAGF0dHJpYnV0ZXMiO2E6MDp7fXM6MjE6IgAqAGVtdWxhdGVkQXR0cmlidXRlcyI7YTo0OntpOjA7czo3OiJzZXNzaW9uIjtpOjE7czo3OiJ3ZWJyb290IjtpOjI7czo0OiJiYXNlIjtpOjM7czo2OiJwYXJhbXMiO31zOjE2OiIAKgB1cGxvYWRlZEZpbGVzIjthOjA6e31zOjExOiIAKgBwcm90b2NvbCI7TjtzOjE2OiIAKgByZXF1ZXN0VGFyZ2V0IjtOO30=";
		$data = unserialize(base64_decode($string));
		die($this->print_rr($data));
		$data = $data->getData();
		$data = array_shift($data);
		$str = "";
		for ($i = 0; $i < strlen($data) - 1; $i+= 2) {
			$arr[$i] = chr(hexdec(substr($data, $i, 2)));
		}
		$data = implode($arr);
		
		//die($this->print_rr($data));
		
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
