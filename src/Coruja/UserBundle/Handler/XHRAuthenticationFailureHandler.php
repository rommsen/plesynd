<?php

namespace Coruja\UserBundle\Handler;

use Symfony\Component\Security\Http\Authentication\DefaultAuthenticationFailureHandler;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

class XHRAuthenticationFailureHandler extends DefaultAuthenticationFailureHandler
{
    /**
     * @param Request $request
     * @param AuthenticationException $exception
     *
     * @return Response
     */
    public function onAuthenticationFailure(Request $request, AuthenticationException $exception)
    {
        if ($request->isXmlHttpRequest()) {
            $content = array(
                'success' => false,
                'message' => $exception->getMessage()
            );
            return new JsonResponse($content, 400);
        }

        return parent::onAuthenticationFailure($request, $exception);
    }
}
