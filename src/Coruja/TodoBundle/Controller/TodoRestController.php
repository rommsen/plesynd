<?php
namespace Coruja\TodoBundle\Controller;

use Nelmio\ApiDocBundle\Annotation\ApiDoc;
use FOS\RestBundle\Controller\FOSRestController;
use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\Controller\Annotations\Prefix;
use FOS\RestBundle\Controller\Annotations\NamePrefix;
use FOS\RestBundle\View\RouteRedirectView;
use FOS\RestBundle\View\View;
use FOS\Rest\Util\Codes as HttpCodes;

/**
 * @Prefix("todo/api")
 * @NamePrefix("todo_api_")
 */
class TodoRestController extends FOSRestController
{
    /**
     * @Rest\View()
     * @ApiDoc
     */
    public function getTodosAction()
    {
        $em = $this->get('doctrine')->getEntityManager();
        /* @var $em \Doctrine\ORM\EntityManager */
        $todos = $em->getRepository('CorujaTodoBundle:Todo')->findAll();
        return $todos;
    }

    /**
     * @Rest\View()
     * @ApiDoc
     * @param $id
     */
    public function getTodoAction($id)
    {
        $em = $this->get('doctrine')->getEntityManager();
        /* @var $em \Doctrine\ORM\EntityManager */
        $todo = $em->find('CorujaTodoBundle:Todo', $id);
        return $todo;
    }

    /**
     * Update known resource
     * @Rest\View()
     * @ApiDoc
     */
    public function putTodoAction($id)
    {
        $data = $this->getRequest()->request;
        $em = $this->get('doctrine')->getEntityManager();
        /* @var $em \Doctrine\ORM\EntityManager */
        $todo = $em->find('CorujaTodoBundle:Todo', $id);

        if ($todo !== NULL) {
            $todo->setTitle($data->get('title'));
            $todo->setCompleted($data->get('completed'));
            $em->flush();
            return View::create(null, HttpCodes::HTTP_NO_CONTENT);
        }
        return View::create(null, HttpCodes::HTTP_NOT_FOUND);
    }

    /**
     * Insert new resource
     * @Rest\View()
     * @ApiDoc
     */
    public function postTodosAction()
    {
        $data = $this->getRequest()->request;
        $todo = new \Coruja\TodoBundle\Entity\Todo();
        $todo->setTitle($data->get('title'));
        $todo->setCompleted($data->get('completed'));

        $em = $this->get('doctrine')->getEntityManager();
        /* @var $em \Doctrine\ORM\EntityManager */
        $em->persist($todo);
        $em->flush();

        return RouteRedirectView::create('todo_api_get_todo', array('id' => $todo->getId()), HttpCodes::HTTP_CREATED);
    }


    /**
     * Deletes resource
     * @Rest\View()
     * @ApiDoc
     */
    public function deleteTodoAction($id)
    {
        $em = $this->get('doctrine')->getEntityManager();
        /* @var $em \Doctrine\ORM\EntityManager */
        $todo = $em->find('CorujaTodoBundle:Todo', $id);
        if ($todo !== NULL) {
            $em->remove($todo);
            $em->flush();
            return View::create(null, HttpCodes::HTTP_NO_CONTENT);
        }
        return View::create(null, HttpCodes::HTTP_NOT_FOUND);
    }
}