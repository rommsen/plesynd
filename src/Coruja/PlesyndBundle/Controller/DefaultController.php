<?php

namespace Coruja\PlesyndBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

/**
 * @Route("/test/")
 */
class DefaultController extends Controller
{
    /**
     * @Route("hello/{name}")
     * @Template()
     */
    public function indexAction($name)
    {
        return array('name' => $name);
    }


    /**
     * @Route("relation1")
     */
    public function testAction()
    {
        $em = $this->getDoctrine()->getEntityManager();
        $group1 = $em->find('CorujaPlesyndBundle:Group', 1);
        $group2 = $em->find('CorujaPlesyndBundle:Group', 3);

//        $em->detach($group1);
//        $em->detach($group2);

        $user = new \Coruja\PlesyndBundle\Entity\User();
        $user->addGroup($group1);
        $user->addGroup($group2);

        $session = $this->get('session');

        $session->set('user', $user);

        return new \Symfony\Component\HttpFoundation\Response('user in session');
    }

    /**
     * @Route("relation2")
     */
    public function relation2Action()
    {
        $em = $this->getDoctrine()->getEntityManager();
        $session = $this->get('session');
        $user = $session->get('user');
        $em->merge($user);
        $em->flush();
        return new \Symfony\Component\HttpFoundation\Response('user merged');
    }

    /**
     * @Route("create_group")
     */
    public function groupAction()
    {
        $em = $this->getDoctrine()->getEntityManager();
        $group = new \Coruja\PlesyndBundle\Entity\Group();

        $em->persist($group);
        $em->flush();
        return new \Symfony\Component\HttpFoundation\Response('group created');
    }
}
