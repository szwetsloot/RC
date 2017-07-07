<?php
namespace App\Test\TestCase\Model\Table;

use App\Model\Table\CrewsTable;
use Cake\ORM\TableRegistry;
use Cake\TestSuite\TestCase;

/**
 * App\Model\Table\CrewsTable Test Case
 */
class CrewsTableTest extends TestCase
{

    /**
     * Test subject
     *
     * @var \App\Model\Table\CrewsTable
     */
    public $Crews;

    /**
     * Fixtures
     *
     * @var array
     */
    public $fixtures = [
        'app.crews',
        'app.clubs',
        'app.events',
        'app.trackers',
        'app.saillingathletes',
        'app.sailling_crews',
        'app.sailling_athletes'
    ];

    /**
     * setUp method
     *
     * @return void
     */
    public function setUp()
    {
        parent::setUp();
        $config = TableRegistry::exists('Crews') ? [] : ['className' => 'App\Model\Table\CrewsTable'];
        $this->Crews = TableRegistry::get('Crews', $config);
    }

    /**
     * tearDown method
     *
     * @return void
     */
    public function tearDown()
    {
        unset($this->Crews);

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
