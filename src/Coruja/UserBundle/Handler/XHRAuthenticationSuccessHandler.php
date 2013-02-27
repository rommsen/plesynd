<?php

namespace Coruja\UserBundle\Handler;

use Symfony\Component\Security\Http\Authentication\DefaultAuthenticationSuccessHandler;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

class XHRAuthenticationSuccessHandler extends DefaultAuthenticationSuccessHandler
{
    /**
     * @param Request $request
     * @param TokenInterface $token
     *
     * @return Response
     */
    public function onAuthenticationSuccess(Request $request, TokenInterface $token)
    {
        if ($request->isXmlHttpRequest()) {
            $content = array(
                'success' => true
            );
            return new JsonResponse($content, 200);
        }

        return parent::onAuthenticationSuccess($request, $token);
    }
}
