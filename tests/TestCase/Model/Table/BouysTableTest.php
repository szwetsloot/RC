<?php
namespace App\Test\TestCase\Model\Table;

use App\Model\Table\BouysTable;
use Cake\ORM\TableRegistry;
use Cake\TestSuite\TestCase;

/**
 * App\Model\Table\BouysTable Test Case
 */
class BouysTableTest extends TestCase
{

    /**
     * Test subject
     *
     * @var \App\Model\Table\BouysTable
     */
    public $Bouys;

    /**
     * Fixtures
     *
     * @var array
     */
    public $fixtures = [
        'app.bouys',
        'app.trackers',
        'app.crews',
        'app.clubs',
        'app.events',
        'app.saillingathletes',
        'app.sailling_crews',
        'app.saillingcrews'
    ];

    /**
     * setUp method
     *
     * @return void
     */
    public function setUp()
    {
        parent::setUp();
        $config = TableRegistry::exists('Bouys') ? [] : ['className' => 'App\Model\Table\BouysTable'];
        $this->Bouys = TableRegistry::get('Bouys', $config);
    }

    /**
     * tearDown method
     *
     * @return void
     */
    public function tearDown()
    {
        unset($this->Bouys);

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
