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
    public function dashboardAction() {
        return $this->render('CorujaPlesyndBundle:Plesynd:dashboard.html.twig');
    }

    /**
     * @Route("/partials/workspace")
     */
    public function workspaceAction() {
        return $this->render('CorujaPlesyndBundle:Plesynd:workspace.html.twig');
    }

    /**
     * @Route("/cache.appcache")
     */
    public function appcacheAction() {
        $manifest = <<<EOF
CACHE MANIFEST
#Rev dfgdf

CACHE:

#Partials
/partials/dashboard
/partials/workspace

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
