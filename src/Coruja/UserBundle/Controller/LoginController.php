<?php

namespace Coruja\UserBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use FOS\Rest\Util\Codes as HttpCodes;

class LoginController extends Controller
{

    /**
     * when reached, login was successful
     * @Route("/login")
     */
    public function loginAction() {
        return new Response('', HttpCodes::HTTP_NO_CONTENT);
    }

    /**
     * @Route("/logout")
     */
    public function logout() {
        $this->get('security.context')->setToken(null);
        $this->get('request')->getSession()->invalidate();
        return new Response('');
    }
}