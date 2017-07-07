<?php
namespace App\Model\Entity;

use Cake\ORM\Entity;

/**
 * Crew Entity
 *
 * @property int $id
 * @property int $club_id
 * @property int $event_id
 * @property string $name
 * @property string $shortname
 * @property string $combination
 * @property string $number
 * @property int $status
 * @property int $tracker_id
 *
 * @property \App\Model\Entity\Club $club
 * @property \App\Model\Entity\Event $event
 * @property \App\Model\Entity\Tracker[] $trackers
 * @property \App\Model\Entity\Saillingathlete[] $saillingathletes
 */
class Crew extends Entity
{

    /**
     * Fields that can be mass assigned using newEntity() or patchEntity().
     *
     * Note that when '*' is set to true, this allows all unspecified fields to
     * be mass assigned. For security purposes, it is advised to set '*' to false
     * (or remove it), and explicitly make individual fields accessible as needed.
     *
     * @var array
     */
    protected $_accessible = [
        '*' => true,
        'id' => false
    ];
}
