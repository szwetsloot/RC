<?php
namespace App\Model\Table;

use Cake\ORM\Query;
use Cake\ORM\RulesChecker;
use Cake\ORM\Table;
use Cake\Validation\Validator;

/**
 * Bouys Model
 *
 * @property \Cake\ORM\Association\BelongsTo $Trackers
 *
 * @method \App\Model\Entity\Bouy get($primaryKey, $options = [])
 * @method \App\Model\Entity\Bouy newEntity($data = null, array $options = [])
 * @method \App\Model\Entity\Bouy[] newEntities(array $data, array $options = [])
 * @method \App\Model\Entity\Bouy|bool save(\Cake\Datasource\EntityInterface $entity, $options = [])
 * @method \App\Model\Entity\Bouy patchEntity(\Cake\Datasource\EntityInterface $entity, array $data, array $options = [])
 * @method \App\Model\Entity\Bouy[] patchEntities($entities, array $data, array $options = [])
 * @method \App\Model\Entity\Bouy findOrCreate($search, callable $callback = null, $options = [])
 */
class BouysTable extends Table
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

        $this->setTable('bouys');
        $this->setDisplayField('id');
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
            ->integer('type')
            ->allowEmpty('type');

        $validator
            ->integer('combination')
            ->allowEmpty('combination');

        $validator
            ->allowEmpty('name');

        $validator
            ->integer('prev')
            ->allowEmpty('prev');

        $validator
            ->integer('order')
            ->allowEmpty('order');

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
