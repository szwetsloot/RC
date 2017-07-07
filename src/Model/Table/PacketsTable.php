<?php
namespace App\Model\Table;

use Cake\ORM\Query;
use Cake\ORM\RulesChecker;
use Cake\ORM\Table;
use Cake\Validation\Validator;

/**
 * Packets Model
 *
 * @method \App\Model\Entity\Packet get($primaryKey, $options = [])
 * @method \App\Model\Entity\Packet newEntity($data = null, array $options = [])
 * @method \App\Model\Entity\Packet[] newEntities(array $data, array $options = [])
 * @method \App\Model\Entity\Packet|bool save(\Cake\Datasource\EntityInterface $entity, $options = [])
 * @method \App\Model\Entity\Packet patchEntity(\Cake\Datasource\EntityInterface $entity, array $data, array $options = [])
 * @method \App\Model\Entity\Packet[] patchEntities($entities, array $data, array $options = [])
 * @method \App\Model\Entity\Packet findOrCreate($search, callable $callback = null, $options = [])
 */
class PacketsTable extends Table
{

    /**
     * Initialize method
     *
     * @param array $config The configuration for the Table.
     * @return void
     */
    public function initialize(array $config)
    {
        parent::initialize($config);

        $this->setTable('packets');
        $this->setDisplayField('id');
        $this->setPrimaryKey('id');
    }

    /**
     * Default validation rules.
     *
     * @param \Cake\Validation\Validator $validator Validator instance.
     * @return \Cake\Validation\Validator
     */
    public function validationDefault(Validator $validator)
    {
        $validator
            ->integer('id')
            ->allowEmpty('id', 'create');

        $validator
            ->dateTime('time')
            ->allowEmpty('time');

        $validator
            ->integer('state')
            ->allowEmpty('state');

        $validator
            ->numeric('longitude')
            ->allowEmpty('longitude');

        $validator
            ->numeric('latitude')
            ->allowEmpty('latitude');

        $validator
            ->numeric('heading')
            ->allowEmpty('heading');

        $validator
            ->numeric('velocity')
            ->allowEmpty('velocity');

        return $validator;
    }
}
