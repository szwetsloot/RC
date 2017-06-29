<?php
namespace App\Model\Entity;

use Cake\ORM\Entity;

/**
 * Component Entity
 *
 * @property int $id
 * @property string $type
 * @property string $name
 * @property string $footprint
 * @property string $MPN
 * @property string $SPN
 * @property string $supplier
 * @property string $manufacturer
 * @property string $url
 * @property int $available
 * @property int $on_order
 *
 * @property \App\Model\Entity\Attribute[] $attributes
 * @property \App\Model\Entity\Project[] $projects
 */
class Component extends Entity
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
