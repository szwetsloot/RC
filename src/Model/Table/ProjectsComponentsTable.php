<?php
namespace App\Model\Table;

use Cake\ORM\Query;
use Cake\ORM\RulesChecker;
use Cake\ORM\Table;
use Cake\Validation\Validator;

/**
 * ProjectsComponents Model
 *
 * @property \Cake\ORM\Association\BelongsTo $Projects
 * @property \Cake\ORM\Association\BelongsTo $Components
 *
 * @method \App\Model\Entity\ProjectsComponent get($primaryKey, $options = [])
 * @method \App\Model\Entity\ProjectsComponent newEntity($data = null, array $options = [])
 * @method \App\Model\Entity\ProjectsComponent[] newEntities(array $data, array $options = [])
 * @method \App\Model\Entity\ProjectsComponent|bool save(\Cake\Datasource\EntityInterface $entity, $options = [])
 * @method \App\Model\Entity\ProjectsComponent patchEntity(\Cake\Datasource\EntityInterface $entity, array $data, array $options = [])
 * @method \App\Model\Entity\ProjectsComponent[] patchEntities($entities, array $data, array $options = [])
 * @method \App\Model\Entity\ProjectsComponent findOrCreate($search, callable $callback = null, $options = [])
 */
class ProjectsComponentsTable extends Table
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

        $this->setTable('projects_components');
        $this->setDisplayField(' id');
        $this->setPrimaryKey(' id');

        $this->belongsTo('Projects', [
            'foreignKey' => 'project_id'
        ]);
        $this->belongsTo('Components', [
            'foreignKey' => 'component_id'
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
            ->integer(' id')
            ->allowEmpty(' id', 'create');

        $validator
            ->integer('required')
            ->allowEmpty('required');

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
        $rules->add($rules->existsIn(['project_id'], 'Projects'));
        $rules->add($rules->existsIn(['component_id'], 'Components'));

        return $rules;
    }
}
