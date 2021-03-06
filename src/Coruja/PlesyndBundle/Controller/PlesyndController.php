<?php

namespace Coruja\PlesyndBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

class PlesyndController extends Controller
{

    /**
     * @Route("/")
     */
    public function indexAction() {
        return $this->render('CorujaPlesyndBundle:Plesynd:index.html.twig');
    }

    /**
     * @Route("/partials/dashboard")
     */
    public function dashboardPartialAction() {
        return $this->render('CorujaPlesyndBundle:Plesynd:dashboard.html.twig');
    }

    /**
     * @Route("/partials/workspace")
     */
    public function workspacePartialAction() {
        return $this->render('CorujaPlesyndBundle:Plesynd:workspace.html.twig');
    }

    /**
     * @Route("/cache.appcache")
     */
    public function appcacheAction() {
        $manifest = <<<EOF
CACHE MANIFEST
#Rev 10

CACHE:

#Partials
/partials/dashboard
/partials/workspace

#CSS
/css/compiled/plesynd/main.css

#JS
/js/compiled/plesynd/main.js

#ICONS
http://netdna.bootstrapcdn.com/twitter-bootstrap/2.1.1/img/glyphicons-halflings.png

NETWORK:
*
EOF;
        return new Response($manifest);
    }

}
