<?php
namespace Coruja\TodoBundle\Controller;

use Coruja\TodoBundle\Entity\Todo;
use Nelmio\ApiDocBundle\Annotation\ApiDoc;
use FOS\RestBundle\Controller\FOSRestController;
use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\View\RouteRedirectView;
use FOS\RestBundle\View\View;
use FOS\Rest\Util\Codes as HttpCodes;

use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\Security\Acl\Domain\ObjectIdentity;
use Symfony\Component\Security\Acl\Domain\UserSecurityIdentity;
use Symfony\Component\Security\Acl\Permission\MaskBuilder;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;

/**
 * @Route("/todo/api/todos")
 */
class TodoController extends FOSRestController
{
    /**
     * @Route(".{_format}", defaults={"_format" = "~"}, name="get_todos")
     * @Method({"GET"})
     * @Rest\View()
     * @ApiDoc
     */
    public function getTodosAction()
    {
        $em = $this->get('doctrine')->getEntityManager();
        /* @var $em \Doctrine\ORM\EntityManager */
        $todos = $em->getRepository('CorujaTodoBundle:Todo')->findAll();

        $securityContext = $this->get('security.context');
        $todos = array_filter($todos, function(Todo $todo) use ($securityContext) {
            return $securityContext->isGranted('VIEW', $todo);
        });
        return View::create($todos, HttpCodes::HTTP_OK, array(
            'Access-Control-Allow-Origin' => '*',
        ));
        return $todos;
    }

    /**
     * @Route("/{id}.{_format}", defaults={"_format" = "~"}, name="get_todo")
     * @Method({"GET"})
     * @Rest\View()
     * @ApiDoc
     * @param $id
     */
    public function getTodoAction($id)
    {
        $em = /* @var $em \Doctrine\ORM\EntityManager */ $this->get('doctrine')->getEntityManager();
        $todo = $em->find('CorujaTodoBundle:Todo', $id);

        if($todo === NULL) {
            return View::create(null, HttpCodes::HTTP_NOT_FOUND);
        }

        $securityContext = $this->get('security.context');
        if($securityContext->isGranted('VIEW', $todo) === false) {
            throw new AccessDeniedException();
        }
        return $todo;
    }

    /**
     * @Route("", name="post_todo")
     * @Method({"POST"})
     * @Rest\View()
     * @ApiDoc
     */
    public function postTodosAction()
    {
        $data = $this->getRequest()->request;

        $em = /* @var $em \Doctrine\ORM\EntityManager */ $this->get('doctrine')->getEntityManager();

        $todo = new Todo;
        $todo->setTitle($data->get('title'));
        $todo->setCompleted($data->get('completed'));
        $todo_list = $data->get('todo_list');
        $todo->setTodoList($em->find('CorujaTodoBundle:TodoList', $todo_list['id']));
        $em->persist($todo);
        $em->flush();

        // creating the ACL
        $aclProvider = $this->get('security.acl.provider');
        $acl = $aclProvider->createAcl(ObjectIdentity::fromDomainObject($todo));

        // retrieving the security identity of the currently logged-in user
        $securityContext = $this->get('security.context');
        $securityIdentity = UserSecurityIdentity::fromAccount($securityContext->getToken()->getUser());

        // grant owner access
        $acl->insertObjectAce($securityIdentity, MaskBuilder::MASK_OWNER);
        $aclProvider->updateAcl($acl);

        // can not use simple location header due to Firefox Bug: https://github.com/angular/angular.js/issues/1468
        return View::create(array('id' => $todo->getId()), HttpCodes::HTTP_CREATED, array(
            'Location' => $this->container->get('router')->generate('get_todo', array('id' => $todo->getId()))
        ));
    }

    /**
     * @Route("/{id}", name="put_todo")
     * @Method({"PUT"})
     * @Rest\View()
     * @ApiDoc
     * @param $id
     */
    public function putTodoAction($id)
    {
        $data = $this->getRequest()->request;
        $em = /* @var $em \Doctrine\ORM\EntityManager */ $this->get('doctrine')->getEntityManager();
        $todo = $em->find('CorujaTodoBundle:Todo', $id);

        if($todo !== NULL) {
            $securityContext = $this->get('security.context');
            if($securityContext->isGranted('EDIT', $todo) === false) {
                throw new AccessDeniedException();
            }
            $todo->setTitle($data->get('title'));
            $todo->setCompleted($data->get('completed'));
            $em->flush();
            return View::create(null, HttpCodes::HTTP_NO_CONTENT);
        }
        return View::create(null, HttpCodes::HTTP_NOT_FOUND);
    }

    /**
     * @Route("/{id}", name="delete_todo")
     * @Method({"DELETE"})
     * @Rest\View()
     * @ApiDoc
     * @param $id
     */
    public function deleteTodoAction($id)
    {
        $em = /* @var $em \Doctrine\ORM\EntityManager */ $this->get('doctrine')->getEntityManager();

        $todo = $em->find('CorujaTodoBundle:Todo', $id);

        if($todo === NULL) {
            return View::create(null, HttpCodes::HTTP_NOT_FOUND);
        }

        $securityContext = $this->get('security.context');
        if ($securityContext->isGranted('DELETE', $todo) === false) {
            throw new AccessDeniedException();
        }

        $aclProvider = $this->get('security.acl.provider');
        $objectIdentity = ObjectIdentity::fromDomainObject($todo);
        $aclProvider->deleteAcl($objectIdentity);

        $em->remove($todo);
        $em->flush();
        return View::create(null, HttpCodes::HTTP_NO_CONTENT);
    }
}