<?php
namespace App\Model\Table;

use Cake\ORM\Query;
use Cake\ORM\RulesChecker;
use Cake\ORM\Table;
use Cake\Validation\Validator;

/**
 * Saillingcrews Model
 *
 * @property \Cake\ORM\Association\BelongsTo $Trackers
 *
 * @method \App\Model\Entity\Saillingcrew get($primaryKey, $options = [])
 * @method \App\Model\Entity\Saillingcrew newEntity($data = null, array $options = [])
 * @method \App\Model\Entity\Saillingcrew[] newEntities(array $data, array $options = [])
 * @method \App\Model\Entity\Saillingcrew|bool save(\Cake\Datasource\EntityInterface $entity, $options = [])
 * @method \App\Model\Entity\Saillingcrew patchEntity(\Cake\Datasource\EntityInterface $entity, array $data, array $options = [])
 * @method \App\Model\Entity\Saillingcrew[] patchEntities($entities, array $data, array $options = [])
 * @method \App\Model\Entity\Saillingcrew findOrCreate($search, callable $callback = null, $options = [])
 */
class SaillingcrewsTable extends Table
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

        $this->setTable('saillingcrews');
        $this->setDisplayField('name');
        $this->setPrimaryKey('id');

        $this->belongsTo('Trackers', [
            'foreignKey' => 'tracker_id'
        ]);
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
            ->allowEmpty('name');

        $validator
            ->allowEmpty('shortname');

        $validator
            ->integer('club')
            ->allowEmpty('club');

        $validator
            ->allowEmpty('description');

        $validator
            ->allowEmpty('flag_image');

        $validator
            ->integer('ranking')
            ->allowEmpty('ranking');

        $validator
            ->integer('points')
            ->allowEmpty('points');

        return $validator;
    }

    /**
     * Returns a rules checker object that will be used for validating
     * application integrity.
     *
     * @param \Cake\ORM\RulesChecker $rules The rules object to be modified.
     * @return \Cake\ORM\RulesChecker
     */
    public function buildRules(RulesChecker $rules)
    {
        $rules->add($rules->existsIn(['tracker_id'], 'Trackers'));

        return $rules;
    }
}
