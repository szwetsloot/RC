<?php
namespace App\Test\TestCase\Controller\Component;

use App\Controller\Component\GPointComponent;
use Cake\Controller\ComponentRegistry;
use Cake\TestSuite\TestCase;

/**
 * App\Controller\Component\GPointComponent Test Case
 */
class GPointComponentTest extends TestCase
{

    /**
     * Test subject
     *
     * @var \App\Controller\Component\GPointComponent
     */
    public $GPoint;

    /**
     * setUp method
     *
     * @return void
     */
    public function setUp()
    {
        parent::setUp();
        $registry = new ComponentRegistry();
        $this->GPoint = new GPointComponent($registry);
    }

    /**
     * tearDown method
     *
     * @return void
     */
    public function tearDown()
    {
        unset($this->GPoint);

        parent::tearDown();
    }

    /**
     * Test initial setup
     *
     * @return void
     */
    public function testInitialization()
    {
        $this->markTestIncomplete('Not implemented yet.');
    }
}
