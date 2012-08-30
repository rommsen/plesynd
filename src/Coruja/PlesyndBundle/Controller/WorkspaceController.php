<?php
namespace Coruja\PlesyndBundle\Controller;

use Nelmio\ApiDocBundle\Annotation\ApiDoc;
use FOS\RestBundle\Controller\FOSRestController;
use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\Controller\Annotations\Prefix;
use FOS\RestBundle\Controller\Annotations\NamePrefix;
use FOS\RestBundle\View\RouteRedirectView;
use FOS\RestBundle\View\View;
use FOS\Rest\Util\Codes as HttpCodes;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;

/**
 * @Prefix("workspace/api")
 * @NamePrefix("workspaces_api_")
 */
class WorkspaceController extends FOSRestController
{
    /**
     * @Route("/workspaces.{_format}", defaults={"_format" = "~"})
     * @Method({"GET"})
     * @ApiDoc
     */
    public function getWorkspacesAction()
    {
        $em = $this->get('doctrine')->getEntityManager();
        /* @var $em \Doctrine\ORM\EntityManager */
        $workspaces = $em->getRepository('CorujaPlesyndBundle:Workspace')->findAll();

        $view = View::create();
        $view->setTemplate('CorujaPlesyndBundle:Workspace:workspaces.html.twig');
        $view->setData($workspaces);
        $view->setTemplateVar('workspaces');
        return $view;
    }

    /**
     * @Route("/workspace/{slug}.{_format}", defaults={"_format" = "~"})
     * @Method({"GET"})
     * @ApiDoc
     */
    public function getWorkspaceAction($slug)
    {
        $em = $this->get('doctrine')->getEntityManager();
        /* @var $em \Doctrine\ORM\EntityManager */
        $workspace = $em->getRepository('CorujaPlesyndBundle:Workspace')->findOneBy(array('slug' => $slug));
        $view = View::create();
        $view->setTemplate('CorujaPlesyndBundle:Workspace:partial.html.twig');
        $view->setData($workspace);
        $view->setTemplateVar('workspace');
        return $view;
    }
}