<?php
namespace App\Test\TestCase\Model\Table;

use App\Model\Table\TrackersTable;
use Cake\ORM\TableRegistry;
use Cake\TestSuite\TestCase;

/**
 * App\Model\Table\TrackersTable Test Case
 */
class TrackersTableTest extends TestCase
{

    /**
     * Test subject
     *
     * @var \App\Model\Table\TrackersTable
     */
    public $Trackers;

    /**
     * Fixtures
     *
     * @var array
     */
    public $fixtures = [
        'app.trackers',
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
        $config = TableRegistry::exists('Trackers') ? [] : ['className' => 'App\Model\Table\TrackersTable'];
        $this->Trackers = TableRegistry::get('Trackers', $config);
    }

    /**
     * tearDown method
     *
     * @return void
     */
    public function tearDown()
    {
        unset($this->Trackers);

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
