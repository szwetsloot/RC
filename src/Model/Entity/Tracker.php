<?php
namespace App\Model\Entity;

use Cake\ORM\Entity;

/**
 * Tracker Entity
 *
 * @property int $id
 * @property int $crew_id
 * @property \Cake\I18n\FrozenTime $last_message
 * @property \Cake\I18n\FrozenTime $created
 * @property float $latitude
 * @property float $longitude
 * @property float $heading
 * @property float $roll_angle
 * @property float $pitch_angle
 * @property float $velocity
 * @property float $north
 * @property float $east
 *
 * @property \App\Model\Entity\Crew[] $crews
 * @property \App\Model\Entity\Bouy[] $bouys
 * @property \App\Model\Entity\Saillingcrew[] $saillingcrews
 */
class Tracker extends Entity
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
