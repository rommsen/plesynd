<?php
namespace Coruja\PlesyndBundle\EventListener;

use Symfony\Component\HttpKernel\Event\FilterResponseEvent;

class ResponseListener
{
    public function onKernelResponse(FilterResponseEvent $event)
    {
        $response = $event->getResponse();
        $this->removeWwwAuthenticateHeader($response);
    }


    protected function removeWwwAuthenticateHeader(\Symfony\Component\HttpFoundation\Response $response) {
        if($response->headers->has('www-authenticate')) {
            $response->headers->set('Content-Type', 'text/plain');
            $response->headers->remove('www-authenticate');
        }
    }
}