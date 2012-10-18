<?php

namespace Coruja\UserBundle\Controller;

use Symfony\Component\HttpFoundation\RedirectResponse;
use Nelmio\ApiDocBundle\Annotation\ApiDoc;
use FOS\RestBundle\View\View;
use FOS\UserBundle\Controller\RegistrationController as BaseController;
use FOS\Rest\Util\Codes as HttpCodes;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;

/**
 * @Route("/user")
 */
class RegistrationController extends BaseController
{
    /**
     * Register User
     * @Route("", name="register_user")
     * @Method({"POST"})
     * @ApiDoc
     */
    public function registerAction()
    {
        $data = $this->container->get('request')->request;
        $userManager = $this->container->get('fos_user.user_manager');

        $user = $userManager->createUser();
        $user->setUsername($data->get('username'));
        $user->setPlainPassword($data->get('password'));
        $user->setEmail($data->get('email'));

        $validator = $this->container->get('validator');
        $violations = $validator->validate($user, 'Registration');

        if(count($violations) > 0) {
            $errors = array();
            foreach($violations as $error) {
                $errors[] = array(
                    'propertyPath' => $error->getPropertyPath(),
                    'message' => $error->getMessage(),
                );
            }
            return View::create($errors, HttpCodes::HTTP_BAD_REQUEST);
        }

        return View::create(null, HttpCodes::HTTP_OK);
    }
}