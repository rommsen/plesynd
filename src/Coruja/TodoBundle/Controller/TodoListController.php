<?php
namespace Coruja\TodoBundle\Controller;

use Coruja\TodoBundle\Entity\TodoList;
use Nelmio\ApiDocBundle\Annotation\ApiDoc;
use FOS\RestBundle\Controller\FOSRestController;
use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\View\RouteRedirectView;
use FOS\RestBundle\View\View;
use FOS\Rest\Util\Codes as HttpCodes;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;

/**
 * @Route("/todo/api/lists")
 */
class TodoListController extends FOSRestController
{
    /**
     * @Route(".{_format}", defaults={"_format" = "~"}, name="get_todo_lists")
     * @Method({"GET"})
     * @ApiDoc
     */
    public function getTodoListsAction()
    {
        $em = /* @var $em \Doctrine\ORM\EntityManager */ $this->get('doctrine')->getEntityManager();
        $todoLists = $em->getRepository('CorujaTodoBundle:TodoList')->findAll();
        return View::create($todoLists, HttpCodes::HTTP_OK, array(
            'Access-Control-Allow-Origin' => '*',
        ));
    }

    /**
     * @Route("/{id}.{_format}", defaults={"_format" = "~"}, name="get_todo_list")
     * @Method({"GET"})
     * @Rest\View()
     * @ApiDoc
     * @param $id
     */
    public function getTodoListAction($id)
    {
        $em = /* @var $em \Doctrine\ORM\EntityManager */ $this->get('doctrine')->getEntityManager();
        $todoList = $em->find('CorujaTodoBundle:TodoList', $id);
        return $todoList;
    }

    /**
     * @Route("/{id}", name="put_todo_list")
     * @Method({"PUT"})
     * @Rest\View()
     * @ApiDoc
     * @param $id
     */
    public function putTodoListAction($id)
    {
        $data = $this->getRequest()->request;
        $em = $this->get('doctrine')->getEntityManager();
        /* @var $em \Doctrine\ORM\EntityManager */
        $todoList = $em->find('CorujaTodoBundle:TodoList', $id);

        if ($todoList !== NULL) {
            $todoList->setTitle($data->get('title'));
            $em->flush();
            return View::create(null, HttpCodes::HTTP_NO_CONTENT);
        }
        return View::create(null, HttpCodes::HTTP_NOT_FOUND);
    }

    /**
     * @Route("", name="post_todo_list")
     * @Method({"POST"})
     * @Rest\View()
     * @ApiDoc
     */
    public function postTodoListAction()
    {
        $data = $this->getRequest()->request;
        $todoList = new TodoList;
        $todoList->setTitle($data->get('title'));

        $em = /* @var $em \Doctrine\ORM\EntityManager */ $this->get('doctrine')->getEntityManager();
        $em->persist($todoList);
        $em->flush();

        return RouteRedirectView::create('get_todo', array('id' => $todoList->getId()), HttpCodes::HTTP_CREATED);
    }


    /**
     * @Route("/{id}", name="delete_todo_list")
     * @Method({"DELETE"})
     * @Rest\View()
     * @ApiDoc
     * @param $id
     */
    public function deleteTodoListAction($id)
    {
        $em = $this->get('doctrine')->getEntityManager();
        /* @var $em \Doctrine\ORM\EntityManager */
        $todoList = $em->find('CorujaTodoBundle:TodoList', $id);
        if ($todoList !== NULL) {
            $em->remove($todoList);
            $em->flush();
            return View::create(null, HttpCodes::HTTP_NO_CONTENT);
        }
        return View::create(null, HttpCodes::HTTP_NOT_FOUND);
    }
}