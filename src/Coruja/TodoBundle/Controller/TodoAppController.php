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

    /**
     * @Route("/cache.appcache")
     */
    public function appcacheAction() {
        $manifest = <<<EOF
CACHE MANIFEST
#Rev 1

CACHE:

#CSS
/css/compiled/plesynd/main.css

#JS
/js/compiled/plesynd/main.js

NETWORK:
*
EOF;
        return new Response($manifest);
    }
}
