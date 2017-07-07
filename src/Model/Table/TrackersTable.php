<?php
namespace App\Model\Table;

use Cake\ORM\Query;
use Cake\ORM\RulesChecker;
use Cake\ORM\Table;
use Cake\Validation\Validator;

/**
 * Trackers Model
 *
 * @property \Cake\ORM\Association\BelongsTo $Crews
 *
 * @method \App\Model\Entity\Tracker get($primaryKey, $options = [])
 * @method \App\Model\Entity\Tracker newEntity($data = null, array $options = [])
 * @method \App\Model\Entity\Tracker[] newEntities(array $data, array $options = [])
 * @method \App\Model\Entity\Tracker|bool save(\Cake\Datasource\EntityInterface $entity, $options = [])
 * @method \App\Model\Entity\Tracker patchEntity(\Cake\Datasource\EntityInterface $entity, array $data, array $options = [])
 * @method \App\Model\Entity\Tracker[] patchEntities($entities, array $data, array $options = [])
 * @method \App\Model\Entity\Tracker findOrCreate($search, callable $callback = null, $options = [])
 *
 * @mixin \Cake\ORM\Behavior\TimestampBehavior
 */
class TrackersTable extends Table
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

        $this->setTable('trackers');
        $this->setDisplayField('id');
        $this->setPrimaryKey('id');

        $this->addBehavior('Timestamp');

        $this->belongsTo('Crews', [
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
            ->dateTime('last_message')
            ->allowEmpty('last_message');

        $validator
            ->numeric('latitude')
            ->allowEmpty('latitude');

        $validator
            ->numeric('longitude')
            ->allowEmpty('longitude');

        $validator
            ->numeric('heading')
            ->allowEmpty('heading');

        $validator
            ->numeric('roll_angle')
            ->allowEmpty('roll_angle');

        $validator
            ->numeric('pitch_angle')
            ->allowEmpty('pitch_angle');

        $validator
            ->numeric('velocity')
            ->allowEmpty('velocity');

        $validator
            ->allowEmpty('type');

        $validator
            ->numeric('utm_north')
            ->allowEmpty('utm_north');

        $validator
            ->numeric('utm_east')
            ->allowEmpty('utm_east');

        $validator
            ->allowEmpty('ip');

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
        $rules->add($rules->existsIn(['crew_id'], 'Crews'));

        return $rules;
    }
}
