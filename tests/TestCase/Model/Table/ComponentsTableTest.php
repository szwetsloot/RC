<?php
namespace App\Test\TestCase\Model\Table;

use App\Model\Table\ComponentsTable;
use Cake\ORM\TableRegistry;
use Cake\TestSuite\TestCase;

/**
 * App\Model\Table\ComponentsTable Test Case
 */
class ComponentsTableTest extends TestCase
{

    /**
     * Test subject
     *
     * @var \App\Model\Table\ComponentsTable
     */
    public $Components;

    /**
     * Fixtures
     *
     * @var array
     */
    public $fixtures = [
        'app.components',
        'app.attributes',
        'app.projects',
        'app.projects_components'
    ];

    /**
     * setUp method
     *
     * @return void
     */
    public function setUp()
    {
        parent::setUp();
        $config = TableRegistry::exists('Components') ? [] : ['className' => 'App\Model\Table\ComponentsTable'];
        $this->Components = TableRegistry::get('Components', $config);
    }

    /**
     * tearDown method
     *
     * @return void
     */
    public function tearDown()
    {
        unset($this->Components);

        parent::tearDown();
    }

    /**
     * Test initialize method
     *
     * @return void
     */
    public function testInitialize()
    {
        $this->markTestIncomplete('Not implemented yet.');
    }

    /**
     * Test validationDefault method
     *
     * @return void
     */
    public function testValidationDefault()
    {
        $this->markTestIncomplete('Not implemented yet.');
    }
}
