<?php
namespace Coruja\PlesyndBundle\Controller;

use Nelmio\ApiDocBundle\Annotation\ApiDoc;
use FOS\RestBundle\Controller\FOSRestController;
use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\View\RouteRedirectView;
use FOS\RestBundle\View\View;
use FOS\Rest\Util\Codes as HttpCodes;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;

/**
 * @Route("/plesynd/api/workspaces")
 */
class WorkspaceController extends FOSRestController
{
    /**
     * @Route(".{_format}", defaults={"_format" = "~"}, name="get_workspaces")
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
     * @Route("/{slug}.{_format}", defaults={"_format" = "~"}, name="get_workspace")
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

    /**
     * Add workspace
     * @Route("", name="add_workspace")
     * @Method({"POST"})
     * @ApiDoc
     */
    public function postWorkspaceAction()
    {
        $data = $this->getRequest()->request;
        $workspace = new \Coruja\PlesyndBundle\Entity\Workspace();
        $workspace->setTitle($data->get('title'));
        $em = $this->get('doctrine')->getEntityManager();
        /* @var $em \Doctrine\ORM\EntityManager */
        $em->persist($workspace);
        $em->flush();

        return RouteRedirectView::create('get_workspace', array('slug' => $workspace->getSlug()), HttpCodes::HTTP_CREATED);
    }
}