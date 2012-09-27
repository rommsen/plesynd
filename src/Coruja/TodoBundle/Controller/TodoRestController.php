<?php
namespace Coruja\TodoBundle\Controller;

use Nelmio\ApiDocBundle\Annotation\ApiDoc;
use FOS\RestBundle\Controller\FOSRestController;
use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\View\RouteRedirectView;
use FOS\RestBundle\View\View;
use FOS\Rest\Util\Codes as HttpCodes;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;

/**
 * @Route("/todo/api/todos")
 */
class TodoRestController extends FOSRestController
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
        $em = $this->get('doctrine')->getEntityManager();
        /* @var $em \Doctrine\ORM\EntityManager */
        $todo = $em->find('CorujaTodoBundle:Todo', $id);
        return $todo;
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
     * @Route("", name="post_todo")
     * @Method({"POST"})
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

        return RouteRedirectView::create('get_todo', array('id' => $todo->getId()), HttpCodes::HTTP_CREATED);
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