<?php
namespace App\Model\Entity;

use Cake\ORM\Entity;

/**
 * Saillingathlete Entity
 *
 * @property int $id
 * @property int $crew_id
 * @property string $firstname
 * @property string $lastname
 * @property string $gender
 * @property int $age
 * @property string $description
 *
 * @property \App\Model\Entity\Crew $crew
 */
class Saillingathlete extends Entity
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
