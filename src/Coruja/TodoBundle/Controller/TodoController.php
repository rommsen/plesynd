<?php

namespace Coruja\TodoBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class TodoController extends Controller
{
    public function indexAction()
    {
        return $this->render('CorujaTodoBundle:Todo:index.html.twig');
    }
}
