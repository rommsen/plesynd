<?php

namespace Coruja\UserBundle\Controller;

use Symfony\Component\HttpFoundation\RedirectResponse;
use Nelmio\ApiDocBundle\Annotation\ApiDoc;
use FOS\RestBundle\View\View;
use FOS\UserBundle\Controller\RegistrationController as BaseController;
use FOS\Rest\Util\Codes as HttpCodes;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
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
     */
    public function registerAction()
    {
        $data = $this->container->get('request')->request;
        $userManager = $this->container->get('fos_user.user_manager');

        $user = $userManager->createUser();
        $user->setUsername($data->get('username'));
        $user->setPlainPassword($data->get('plainPassword'));
        $user->setEmail($data->get('email'));
        $user->setConfirmationToken($this->container->get('fos_user.util.token_generator')->generateToken());

        $this->container->get('session')->set('fos_user_send_confirmation_email/email', $user->getEmail());

        $validator = $this->container->get('validator');
        $violations = $validator->validate($user, 'Registration');

        $translator = $this->container->get('translator');

        if(count($violations) > 0) {
            $errors = array();
            foreach($violations as $error) {
                $errors[] = array(
                    'propertyPath' => $error->getPropertyPath(),
                    'message' => $translator->trans($error->getMessage(), array(), 'validators'),
                );
            }
            return View::create($errors, HttpCodes::HTTP_BAD_REQUEST);
        }

        $mailer = $this->container->get('fos_user.mailer');
        $mailer->sendConfirmationEmailMessage($user);

        $userManager->updateUser($user);
        return View::create(null, HttpCodes::HTTP_OK);
    }


    /**
     * Receive the confirmation token from user email provider, login the user
     * @Route("/confirm/{token}", name="confirm_user")
     * @Method({"POST"})
     * @ApiDoc
     */
    public function confirmAction($token)
    {
        $user = $this->container->get('fos_user.user_manager')->findUserByConfirmationToken($token);

        if (null === $user) {
            throw new NotFoundHttpException(sprintf('The user with confirmation token "%s" does not exist', $token));
        }

        $user->setConfirmationToken(null);
        $user->setEnabled(true);

        $this->container->get('fos_user.user_manager')->updateUser($user);

        return View::create(null, HttpCodes::HTTP_OK);
    }

}