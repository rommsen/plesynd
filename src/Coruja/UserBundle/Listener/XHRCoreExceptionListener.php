<?php

namespace Coruja\UserBundle\Listener;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Event\GetResponseForExceptionEvent;
use Symfony\Component\HttpFoundation\Response;

class XHRCoreExceptionListener
{
    protected $csrfProvider;

    public function __construct(\Symfony\Component\Form\Extension\Csrf\CsrfProvider\CsrfProviderInterface $csrfProvider) {
        $this->csrfProvider = $csrfProvider;

    }
    /**
     * Handles security related exceptions.
     *
     * @param GetResponseForExceptionEvent $event An GetResponseForExceptionEvent instance
     */
    public function onCoreException(GetResponseForExceptionEvent $event)
    {
        $exception = $event->getException();
        $request = $event->getRequest();


        $statusCode = $exception->getCode();
        if (!array_key_exists($statusCode, Response::$statusTexts)) {
            $statusCode = 500;
        }

        $content = array('success' => false, 'message' => $exception->getMessage(), 'csrf' => $this->csrfProvider->generateCsrfToken('authenticate'));
        $response = new JsonResponse($content, $statusCode, array('Content-Type' => 'application/json'));

        $event->setResponse($response);
    }
}
