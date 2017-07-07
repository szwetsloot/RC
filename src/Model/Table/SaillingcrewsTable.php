<?php
namespace App\Model\Table;

use Cake\ORM\Query;
use Cake\ORM\RulesChecker;
use Cake\ORM\Table;
use Cake\Validation\Validator;

/**
* Saillingcrews Model
*
* @method \App\Model\Entity\Saillingcrew get($primaryKey, $options = [])
* @method \App\Model\Entity\Saillingcrew newEntity($data = null, array $options = [])
* @method \App\Model\Entity\Saillingcrew[] newEntities(array $data, array $options = [])
* @method \App\Model\Entity\Saillingcrew|bool save(\Cake\Datasource\EntityInterface $entity, $options = [])
* @method \App\Model\Entity\Saillingcrew patchEntity(\Cake\Datasource\EntityInterface $entity, array $data, array $options = [])
* @method \App\Model\Entity\Saillingcrew[] patchEntities($entities, array $data, array $options = [])
* @method \App\Model\Entity\Saillingcrew findOrCreate($search, callable $callback = null, $options = [])
*/
class SaillingcrewsTable extends Table{

	/**
	* Initialize method
	*
	* @param array $config The configuration for the Table.
	* @return void
	*/
	public function initialize(array $config){
		parent::initialize($config);

		$this->setTable('saillingcrews');
		$this->setDisplayField('name');
		$this->setPrimaryKey('id');
        
		$this->hasMany('SaillingAthletes', [
				'foreignKey' => 'crew_id'
			]);
	}

	/**
	* Default validation rules.
	*
	* @param \Cake\Validation\Validator $validator Validator instance.
	* @return \Cake\Validation\Validator
	*/
	public function validationDefault(Validator $validator){
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

		return $validator;
	}
}
