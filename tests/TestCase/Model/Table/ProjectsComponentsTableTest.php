<?php
namespace App\Test\TestCase\Model\Table;

use App\Model\Table\ProjectsComponentsTable;
use Cake\ORM\TableRegistry;
use Cake\TestSuite\TestCase;

/**
 * App\Model\Table\ProjectsComponentsTable Test Case
 */
class ProjectsComponentsTableTest extends TestCase
{

    /**
     * Test subject
     *
     * @var \App\Model\Table\ProjectsComponentsTable
     */
    public $ProjectsComponents;

    /**
     * Fixtures
     *
     * @var array
     */
    public $fixtures = [
        'app.projects_components',
        'app.projects',
        'app.components'
    ];

    /**
     * setUp method
     *
     * @return void
     */
    public function setUp()
    {
        parent::setUp();
        $config = TableRegistry::exists('ProjectsComponents') ? [] : ['className' => 'App\Model\Table\ProjectsComponentsTable'];
        $this->ProjectsComponents = TableRegistry::get('ProjectsComponents', $config);
    }

    /**
     * tearDown method
     *
     * @return void
     */
    public function tearDown()
    {
        unset($this->ProjectsComponents);

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

    /**
     * Test buildRules method
     *
     * @return void
     */
    public function testBuildRules()
    {
        $this->markTestIncomplete('Not implemented yet.');
    }
}
