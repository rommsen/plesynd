<?php

namespace Coruja\WookieConnectorBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

/**
 * @Route("/wookie")
 */
class DefaultController extends Controller
{
    /**
     * @Route("/")
     * @Template()
     */
    public function indexAction()
    {
        $connection = new \Coruja\WookieConnectorBundle\Connector\WookieConnectorService("http://localhost:8080/wookie/", "TEST", "localhost_dev", "demo_2");
        //$connection->getUser()->setLoginName("demo_2");
       // var_dump($connection);
        //get all available widgets
        $availableWidgets = $connection->getAvailableWidgets();
        var_dump($availableWidgets);

        $widget = $connection->getOrCreateInstance('http://wookie.apache.org/widgets/freeder');
        var_dump($widget);
        $connection->getUser()->setLoginName("demo_2");
        $widget = $connection->getOrCreateInstance('http://wookie.apache.org/widgets/freeder');
        var_dump($widget->getIdentifier());

        return array();
    }


    /**
     * @package org.wookie.php.test
     * @filesource
     */

    function bla()
    {

//test service
        ini_set('display_errors', 1);
        error_reporting(E_ALL & ~E_NOTICE);

        /** @ignore */
        require_once("connector/WookieConnectorService.php");

        $test = new WookieConnectorService("http://localhost:8080/wookie/", "TEST", "localhost_dev", "demo_1");
//set locale
        $test->setLocale("en");
//set logging path, if not set then logger doesnt do nohting
//$test->setLogPath("/home/raido/dev/www/php_framework/logs/");
//setup different userName
        $test->getUser()->setLoginName("demo_1");
//get all available widgets
        $availableWidgets = $test->getAvailableWidgets();
//print_r($availableWidgets);

//check connection
        if (!$test->getConnection()->Test()) {
            echo 'error' . '<br />';
        }

//create select menus
        echo '<pre>';
        echo '<form action="" method="GET">';
        echo '<select name="widget_id">';
        echo '<option value="">No widget selected</option>';

        foreach ($availableWidgets as $Widget) {
            unset($sel);

            if ($Widget->getIdentifier() == $_GET['widget_id']) {
                $sel = 'selected="selected"';
            }
            echo '<option value="' . $Widget->getIdentifier() . '" ' . $sel . '>' . $Widget->getTitle() . '</option>';

        }

        echo '</select>';

//second select menu

        echo '<select name="widget_id2">';
        echo '<option value="">No widget selected</option>';

        foreach ($availableWidgets as $Widget) {
            unset($sel);

            if ($Widget->getIdentifier() == $_GET['widget_id2']) {
                $sel = 'selected="selected"';
            }
            echo '<option value="' . $Widget->getIdentifier() . '" ' . $sel . '>' . $Widget->getTitle() . '</option>';
        }

        echo '</select>';
        echo '<input type="submit" value="Select" />';
        echo '</form>';

        if ($_GET['widget_id'] != '') {

            //setup different userName for current user
            $test->getUser()->setLoginName("demo_2");
            $widget = $test->getOrCreateInstance($_GET['widget_id']);
            var_dump($widget->getUrl());
            if ($widget) {
                echo '<iframe src="' . $widget->getUrl() . '" width="' . $widget->getWidth() . '" height="' . $widget->getHeight() . '"></iframe><br />';
            }
            //add participant
            $testUser = new User('demo_2', 'demo_2');
            $test->addParticipant($widget, $testUser);
            print_r($test->getUsers($widget));

            //delete participant
            $testUser = new User('demo_2', 'demo_2');
            $test->deleteParticipant($widget, $testUser);
            echo 'Users after delete <br />';
            print_r($test->getUsers($widget));


            //add property
            $newProperty = new Property('demo_property', 'demo_value');
            $result = $test->setProperty($widget, $newProperty);
            print_r($result);

            //get property from server
            $newProperty = new Property('demo_property');
            print_r($test->getProperty($widget, $newProperty)); // you can use property without value for get -> new Property('proovikas');

            //finally delete it from server
            $newProperty = new Property('demo_property');
            echo 'Properties after delete<br />';
            print_r($test->deleteProperty($widget, $newProperty)); // you can use property without value for get -> new Property('proovikas');
            echo '<br />';
        }

        if ($_GET['widget_id2'] != '') {
            //setup different userName for current user
            $test->getUser()->setLoginName("demo_425");
            $widget2 = $test->getOrCreateInstance($_GET['widget_id2']);
            $newProperty = new Property("test_id", "kasutaja_2");
            $result = $test->setProperty($widget2, $newProperty);
            if ($widget2) {
                echo '<iframe src="' . $widget2->getUrl() . '" width="' . $widget2->getWidth() . '" height="' . $widget2->getHeight() . '"></iframe><br />';
            }
            //add participant
            $testUser = new User('demo_3', 'demo_3');
            $test->addParticipant($widget2, $testUser);
            print_r($test->getUsers($widget2));
        }

//call WidgetInstances->get <-- after widgets has been initialized

        print_r($test->WidgetInstances->get());

    }
}


