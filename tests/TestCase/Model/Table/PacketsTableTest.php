<?php
namespace App\Test\TestCase\Model\Table;

use App\Model\Table\PacketsTable;
use Cake\ORM\TableRegistry;
use Cake\TestSuite\TestCase;

/**
 * App\Model\Table\PacketsTable Test Case
 */
class PacketsTableTest extends TestCase
{

    /**
     * Test subject
     *
     * @var \App\Model\Table\PacketsTable
     */
    public $Packets;

    /**
     * Fixtures
     *
     * @var array
     */
    public $fixtures = [
        'app.packets'
    ];

    /**
     * setUp method
     *
     * @return void
     */
    public function setUp()
    {
        parent::setUp();
        $config = TableRegistry::exists('Packets') ? [] : ['className' => 'App\Model\Table\PacketsTable'];
        $this->Packets = TableRegistry::get('Packets', $config);
    }

    /**
     * tearDown method
     *
     * @return void
     */
    public function tearDown()
    {
        unset($this->Packets);

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
