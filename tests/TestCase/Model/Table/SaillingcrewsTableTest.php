<?php
namespace App\Test\TestCase\Model\Table;

use App\Model\Table\SaillingcrewsTable;
use Cake\ORM\TableRegistry;
use Cake\TestSuite\TestCase;

/**
 * App\Model\Table\SaillingcrewsTable Test Case
 */
class SaillingcrewsTableTest extends TestCase
{

    /**
     * Test subject
     *
     * @var \App\Model\Table\SaillingcrewsTable
     */
    public $Saillingcrews;

    /**
     * Fixtures
     *
     * @var array
     */
    public $fixtures = [
        'app.saillingcrews',
        'app.trackers',
        'app.crews',
        'app.clubs',
        'app.events',
        'app.saillingathletes',
        'app.sailling_crews',
        'app.bouys'
    ];

    /**
     * setUp method
     *
     * @return void
     */
    public function setUp()
    {
        parent::setUp();
        $config = TableRegistry::exists('Saillingcrews') ? [] : ['className' => 'App\Model\Table\SaillingcrewsTable'];
        $this->Saillingcrews = TableRegistry::get('Saillingcrews', $config);
    }

    /**
     * tearDown method
     *
     * @return void
     */
    public function tearDown()
    {
        unset($this->Saillingcrews);

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
