<?php

namespace Coruja\PlesyndBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use FOS\Rest\Util\Codes as HttpCodes;

class PlesyndController extends Controller
{

    /**
     * @Route("/")
     */
    public function indexAction() {
        return $this->render('CorujaPlesyndBundle:Plesynd:index.html.twig');
    }

    /**
     * when reached, login was successful
     * @Route("/login")
     */
    public function loginAction() {
        return new Response('', HttpCodes::HTTP_NO_CONTENT);
    }

    /**
     * @Route("/plesynd/api/logout")
     */
    public function logout() {
        $this->get('security.context')->setToken(null);
        $this->get('request')->getSession()->invalidate();
        return new Response('');
    }

    /**
     * @Route("/cache.appcache")
     */
    public function appcacheAction() {
        $manifest = <<<EOF
CACHE MANIFEST
#Rev 1u66

CACHE:

#CSS
/css/compiled/plesynd/main_bootstrap_1.css
/css/compiled/plesynd/main_app_2.css
/css/compiled/plesynd/main_bootstrap-responsive_3.css

#JS
/js/compiled/plesynd/main_angular_1.js
/js/compiled/plesynd/main_angular-resource_2.js
/js/compiled/plesynd/main_app_3.js
/js/compiled/plesynd/main_controllers_4.js
/js/compiled/plesynd/main_workspace-service_5.js
/js/compiled/plesynd/main_coruja-online-status_6.js
/js/compiled/plesynd/main_coruja-storage_7.js
/js/compiled/plesynd/main_coruja-resource_8.js

NETWORK:
*
EOF;

        return new Response($manifest);
    }

}
