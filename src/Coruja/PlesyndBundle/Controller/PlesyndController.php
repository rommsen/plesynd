<?php

namespace Coruja\PlesyndBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

class PlesyndController extends Controller
{

    /**
     * @Route("/index")
     */
    public function indexAction() {
        return $this->render('CorujaPlesyndBundle:Plesynd:index.html.twig');
    }

    /**
     * @Route("/dashboard")
     */
    public function getDashboardAction() {
        return $this->render('CorujaPlesyndBundle:Plesynd:partials/dashboard_partial.html.twig');
    }

//    /**
//     * @Route("/workspaces")
//     */
//    public function getWorkspacesAction() {
//        $workspaces = array();
//        for($i = 0; $i<10;$i++) {
//            $workspaces[] = array(
//                'name' => 'Workspace '.$i,
//                'slug' => 'workspace-'.$i,
//            );
//        }
//        return new Response(json_encode($workspaces));
//    }
//
//    /**
//     * @Route("/workspace/{slug}")
//     */
//    public function getWorkspaceAction($slug)
//    {
//        return $this->render('CorujaPlesyndBundle:Plesynd:partials/workspace_partial.html.twig', array('slug' => $slug));
//    }

    /**
     * @Route("/cache.appcache")
     */
    public function appcacheAction() {
        $manifest = <<<EOF
CACHE MANIFEST
#Rev 7

CACHE:


NETWORK:
*
EOF;

        return new \Symfony\Component\HttpFoundation\Response($manifest);
    }

}
