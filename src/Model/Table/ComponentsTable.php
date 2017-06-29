<?php
namespace App\Model\Table;

use Cake\ORM\Query;
use Cake\ORM\RulesChecker;
use Cake\ORM\Table;
use Cake\Validation\Validator;

/**
 * Components Model
 *
 * @property \Cake\ORM\Association\BelongsToMany $Projects
 *
 * @method \App\Model\Entity\Component get($primaryKey, $options = [])
 * @method \App\Model\Entity\Component newEntity($data = null, array $options = [])
 * @method \App\Model\Entity\Component[] newEntities(array $data, array $options = [])
 * @method \App\Model\Entity\Component|bool save(\Cake\Datasource\EntityInterface $entity, $options = [])
 * @method \App\Model\Entity\Component patchEntity(\Cake\Datasource\EntityInterface $entity, array $data, array $options = [])
 * @method \App\Model\Entity\Component[] patchEntities($entities, array $data, array $options = [])
 * @method \App\Model\Entity\Component findOrCreate($search, callable $callback = null, $options = [])
 */
class ComponentsTable extends Table
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

        $this->setTable('components');
        $this->setDisplayField('name');
        $this->setPrimaryKey('id');

        $this->belongsToMany('Projects', [
            'foreignKey' => 'component_id',
            'targetForeignKey' => 'project_id',
            'joinTable' => 'projects_components'
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
            ->allowEmpty('type');

        $validator
            ->allowEmpty('name');

        $validator
            ->allowEmpty('footprint');

        $validator
            ->allowEmpty('MPN');

        $validator
            ->allowEmpty('SPN');

        $validator
            ->allowEmpty('supplier');

        $validator
            ->allowEmpty('manufacturer');

        $validator
            ->allowEmpty('url');

        $validator
            ->integer('available')
            ->allowEmpty('available');

        $validator
            ->integer('on_order')
            ->allowEmpty('on_order');

        return $validator;
    }
}
