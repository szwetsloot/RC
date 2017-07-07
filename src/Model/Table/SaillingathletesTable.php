<?php
namespace App\Model\Table;

use Cake\ORM\Query;
use Cake\ORM\RulesChecker;
use Cake\ORM\Table;
use Cake\Validation\Validator;

/**
 * Saillingathletes Model
 *
 * @property \Cake\ORM\Association\BelongsTo $Crews
 *
 * @method \App\Model\Entity\Saillingathlete get($primaryKey, $options = [])
 * @method \App\Model\Entity\Saillingathlete newEntity($data = null, array $options = [])
 * @method \App\Model\Entity\Saillingathlete[] newEntities(array $data, array $options = [])
 * @method \App\Model\Entity\Saillingathlete|bool save(\Cake\Datasource\EntityInterface $entity, $options = [])
 * @method \App\Model\Entity\Saillingathlete patchEntity(\Cake\Datasource\EntityInterface $entity, array $data, array $options = [])
 * @method \App\Model\Entity\Saillingathlete[] patchEntities($entities, array $data, array $options = [])
 * @method \App\Model\Entity\Saillingathlete findOrCreate($search, callable $callback = null, $options = [])
 */
class SaillingathletesTable extends Table
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

        $this->setTable('saillingathletes');
        $this->setDisplayField('id');
        $this->setPrimaryKey('id');

        $this->belongsTo('SaillingCrews', [
            'foreignKey' => 'crew_id'
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
            ->allowEmpty('firstname');

        $validator
            ->allowEmpty('lastname');

        $validator
            ->allowEmpty('gender');

        $validator
            ->integer('age')
            ->allowEmpty('age');

        $validator
            ->allowEmpty('description');

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
        $rules->add($rules->existsIn(['crew_id'], 'SaillingCrews'));

        return $rules;
    }
}
