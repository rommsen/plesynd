<?php
namespace Coruja\PlesyndBundle\Controller;

use Coruja\PlesyndBundle\Entity\Workspace;
use FOS\RestBundle\Controller\FOSRestController;
use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\View\RouteRedirectView;
use FOS\RestBundle\View\View;
use FOS\Rest\Util\Codes as HttpCodes;

use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\Security\Acl\Domain\ObjectIdentity;
use Symfony\Component\Security\Acl\Domain\UserSecurityIdentity;
use Symfony\Component\Security\Acl\Permission\MaskBuilder;

use Nelmio\ApiDocBundle\Annotation\ApiDoc;
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
        $em = $this->get('doctrine')->getManager();
        /* @var $em \Doctrine\ORM\EntityManager */
        $workspaces = $em->getRepository('CorujaPlesyndBundle:Workspace')->findAll();

        $securityContext = $this->get('security.context');
        $workspaces = array_filter($workspaces, function(Workspace $workspace) use ($securityContext) {
            return $securityContext->isGranted('VIEW', $workspace);
        });

        $view = View::create();
        $view->setTemplate('CorujaPlesyndBundle:Workspace:workspaces.html.twig');
        $view->setData($workspaces);
        $view->setTemplateVar('workspaces');
        return $view;
    }

    /**
     * @Route("/{id}.{_format}", defaults={"_format" = "~"}, name="get_workspace")
     * @Method({"GET"})
     * @ApiDoc
     */
    public function getWorkspaceAction($id)
    {
        $em = $this->get('doctrine')->getManager();
        /* @var $em \Doctrine\ORM\EntityManager */
        $workspace = $em->getRepository('CorujaPlesyndBundle:Workspace')->findOneBy(array('id' => $id));

        if($workspace === NULL) {
            return View::create(null, HttpCodes::HTTP_NOT_FOUND);
        }

        $securityContext = $this->get('security.context');
        if($securityContext->isGranted('VIEW', $workspace) === false) {
            throw new AccessDeniedException();
        }
        $view = View::create();
        $view->setTemplate('CorujaPlesyndBundle:Workspace:workspaces.html.twig');
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
        $workspace = new Workspace();
        $workspace->setTitle($data->get('title'));

        $em = /* @var $em \Doctrine\ORM\EntityManager */ $this->get('doctrine')->getManager();
        $em->persist($workspace);
        $em->flush();

        // creating the ACL
        $aclProvider = $this->get('security.acl.provider');
        $acl = $aclProvider->createAcl(ObjectIdentity::fromDomainObject($workspace));

        // retrieving the security identity of the currently logged-in user
        $securityContext = $this->get('security.context');
        $securityIdentity = UserSecurityIdentity::fromAccount($securityContext->getToken()->getUser());

        // grant owner access
        $acl->insertObjectAce($securityIdentity, MaskBuilder::MASK_OWNER);
        $aclProvider->updateAcl($acl);

        return RouteRedirectView::create('get_workspace', array('id' => $workspace->getId()), HttpCodes::HTTP_CREATED);
    }

    /**
     * @Route("/{id}", name="put_workspace")
     * @Method({"PUT"})
     * @Rest\View()
     * @ApiDoc
     * @param $id
     */
    public function putWorkspaceAction($id)
    {
        $data = $this->getRequest()->request;
        $em = $this->get('doctrine')->getManager();
        /* @var $em \Doctrine\ORM\EntityManager */
        $workspace = $em->find('CorujaPlesyndBundle:Workspace', $id);
        if($workspace !== NULL) {
            $securityContext = $this->get('security.context');
            if ($securityContext->isGranted('EDIT', $workspace) === false) {
                throw new AccessDeniedException();
            }

            $workspace->setTitle($data->get('title'));
            $em->flush();
            return View::create(null, HttpCodes::HTTP_NO_CONTENT);
        }
        return View::create(null, HttpCodes::HTTP_NOT_FOUND);
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
        $em = $this->get('doctrine')->getManager();
        /* @var $em \Doctrine\ORM\EntityManager */
        $workspace = $em->find('CorujaPlesyndBundle:Workspace', $id);
        if($workspace === NULL) {
            return View::create(null, HttpCodes::HTTP_NOT_FOUND);
        }

        $securityContext = $this->get('security.context');
        if ($securityContext->isGranted('DELETE', $workspace) === false) {
            throw new AccessDeniedException();
        }

        $aclProvider = $this->get('security.acl.provider');
        $objectIdentity = ObjectIdentity::fromDomainObject($workspace);
        $aclProvider->deleteAcl($objectIdentity);

        $em->remove($workspace);
        $em->flush();
        return View::create(null, HttpCodes::HTTP_NO_CONTENT);
    }
}