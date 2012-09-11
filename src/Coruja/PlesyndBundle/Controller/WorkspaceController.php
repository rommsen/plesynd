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
        $connection = new \Coruja\WookieConnectorBundle\Connector\WookieConnectorService("http://localhost:8080/wookie/", "TEST", "localhost_dev", "demo_2");
        $em = $this->get('doctrine')->getEntityManager();
        /* @var $em \Doctrine\ORM\EntityManager */
        $workspaces = $em->getRepository('CorujaPlesyndBundle:Workspace')->findAll();

        foreach($workspaces as /* @var \Coruja\PlesyndBundle\Entity\Workspace $workspace */ $workspace) {
            foreach($workspace->getWidgets() as /* @var \Coruja\PlesyndBundle\Entity\Widget $widget */ $widget) {
                $connection->getUser()->setLoginName($widget->getInstanceIdentifier());
                $widget->setInstance($connection->getOrCreateInstance($widget));
            }
        }

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
        $em = /* @var $em \Doctrine\ORM\EntityManager */ $this->get('doctrine')->getEntityManager();
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

    /**
     * @Route("/{id}", name="delete_workspace")
     * @Method({"DELETE"})
     * @Rest\View()
     * @ApiDoc
     * @param $id
     */
    public function deleteWorkspaceAction($id)
    {
        $em = $this->get('doctrine')->getEntityManager();
        /* @var $em \Doctrine\ORM\EntityManager */
        $workspace = $em->find('CorujaPlesyndBundle:Workspace', $id);
        if ($workspace !== NULL) {
            $em->remove($workspace);
            $em->flush();
            return View::create(null, HttpCodes::HTTP_NO_CONTENT);
        }
        return View::create(null, HttpCodes::HTTP_NOT_FOUND);
    }
}