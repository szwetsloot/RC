<?php
namespace App\Model\Table;

use Cake\ORM\Query;
use Cake\ORM\RulesChecker;
use Cake\ORM\Table;
use Cake\Validation\Validator;

/**
 * Crews Model
 *
 * @property \Cake\ORM\Association\BelongsTo $Clubs
 * @property \Cake\ORM\Association\BelongsTo $Events
 * @property \Cake\ORM\Association\BelongsTo $Trackers
 * @property \Cake\ORM\Association\HasMany $Saillingathletes
 * @property \Cake\ORM\Association\HasMany $Trackers
 *
 * @method \App\Model\Entity\Crew get($primaryKey, $options = [])
 * @method \App\Model\Entity\Crew newEntity($data = null, array $options = [])
 * @method \App\Model\Entity\Crew[] newEntities(array $data, array $options = [])
 * @method \App\Model\Entity\Crew|bool save(\Cake\Datasource\EntityInterface $entity, $options = [])
 * @method \App\Model\Entity\Crew patchEntity(\Cake\Datasource\EntityInterface $entity, array $data, array $options = [])
 * @method \App\Model\Entity\Crew[] patchEntities($entities, array $data, array $options = [])
 * @method \App\Model\Entity\Crew findOrCreate($search, callable $callback = null, $options = [])
 */
class CrewsTable extends Table
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

        $this->setTable('crews');
        $this->setDisplayField('name');
        $this->setPrimaryKey('id');

        $this->belongsTo('Clubs', [
            'foreignKey' => 'club_id'
        ]);
        $this->belongsTo('Events', [
            'foreignKey' => 'event_id'
        ]);
        $this->belongsTo('Trackers', [
            'foreignKey' => 'tracker_id'
        ]);
        $this->hasMany('Saillingathletes', [
            'foreignKey' => 'crew_id'
        ]);
        $this->hasMany('Trackers', [
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
            ->allowEmpty('name');

        $validator
            ->allowEmpty('shortname');

        $validator
            ->allowEmpty('combination');

        $validator
            ->allowEmpty('number');

        $validator
            ->integer('status')
            ->allowEmpty('status');

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
        $rules->add($rules->existsIn(['club_id'], 'Clubs'));
        $rules->add($rules->existsIn(['event_id'], 'Events'));
        $rules->add($rules->existsIn(['tracker_id'], 'Trackers'));

        return $rules;
    }
}
