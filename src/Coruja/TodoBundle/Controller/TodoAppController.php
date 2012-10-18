<?php

namespace Coruja\TodoBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;

/**
 * @Route("/todo")
 */
class TodoAppController extends Controller
{
    /**
     * @Route("")
     * @Method({"GET"})
     */
    public function indexAction()
    {
        return $this->render('CorujaTodoBundle:Todo:index.html.twig');
    }

    public function appcacheAction() {
        $manifest = <<<EOF
CACHE MANIFEST
#Rev klk

CACHE:

#CSS
/css/compiled/todo/main_app_1.css

#JS
/js/compiled/todo/main_angular_1.js
/js/compiled/todo/main_angular-resource_2.js
/js/compiled/todo/main_app_3.js
/js/compiled/todo/main_controllers_4.js
/js/compiled/todo/main_todoBlur_5.js
/js/compiled/todo/main_todoFocus_6.js
/js/compiled/todo/main_coruja-online-status_7.js
/js/compiled/todo/main_coruja-storage_8.js
/js/compiled/todo/main_coruja-resource_9.js
/js/compiled/todo/main_todo-service_10.js

NETWORK:
*
EOF;
        return new Response($manifest);
    }
}
