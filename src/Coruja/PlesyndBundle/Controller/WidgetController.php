<?php
namespace Coruja\PlesyndBundle\Controller;

use Coruja\PlesyndBundle\Entity\Widget;
use Coruja\WookieConnectorBundle\Connector\WidgetProperty;
use Coruja\WookieConnectorBundle\Connector\Exception\WookieConnectorException;
use Nelmio\ApiDocBundle\Annotation\ApiDoc;
use FOS\RestBundle\Controller\FOSRestController;
use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\View\RouteRedirectView;
use FOS\RestBundle\View\View;
use FOS\Rest\Util\Codes as HttpCodes;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;

/**
 * @Route("/plesynd/api/widgets")
 */
class WidgetController extends FOSRestController
{
    /**
     * @Route("/available.{_format}", defaults={"_format" = "~"}, name="get_available_widgets")
     * @Method({"GET"})
     * @ApiDoc
     */
    public function getAvailableWidgetsAction()
    {
        $connection = $this->get('coruja_wookie_connector.connector');
        $widgets = $connection->getAvailableWidgets();

         $widgets = array_map(function(\Coruja\WookieConnectorBundle\Connector\Widget $widget) use($connection) {
             $instance = $connection->getOrCreateInstance($widget->getIdentifier());
             try {
                 $property = $connection->getProperty($instance, new WidgetProperty('plesynd_offline_compatible'));
                 $widget->setOffline($property->getValue());
             } catch(WookieConnectorException $e) {
                 $widget->setOffline(false);
             }
             return $widget;
         }, $widgets);



        return View::create($widgets);
    }

    /**
     * @Route("/{id}.{_format}", defaults={"_format" = "~"}, name="get_widget")
     * @Method({"GET"})
     * @ApiDoc
     */
    public function getWidgetAction($id)
    {
        $em = /* @var $em \Doctrine\ORM\EntityManager */ $this->get('doctrine')->getEntityManager();
        $widget = /* @var \Coruja\PlesyndBundle\Entity\Widget $widget */
            $em->getRepository('CorujaPlesyndBundle:Widget')->find($id);

        $connection = $this->get('coruja_wookie_connector.connector');
        $connection->getUser()->setLoginName($widget->getInstanceIdentifier());
        $widget->setInstance($connection->getOrCreateInstance($widget));
        $widget->setWorkspaceId($widget->getWorkspace()->getId());
        return View::create($widget);
    }


    /**
     * @Route(".{_format}", defaults={"_format" = "~"}, name="get_widgets")
     * @Method({"GET"})
     * @ApiDoc
     */
    public function getWidgetsAction()
    {
        $connection = $this->get('coruja_wookie_connector.connector');
        $em = /* @var $em \Doctrine\ORM\EntityManager */ $this->get('doctrine')->getEntityManager();
        $widgets = $em->getRepository('CorujaPlesyndBundle:Widget')->findAll();

        $widgets = array_map(function(Widget $widget) use($connection) {
            $connection->getUser()->setLoginName($widget->getInstanceIdentifier());
            $instance = $connection->getOrCreateInstance($widget);
            try {
                $property = $connection->getProperty($instance, new WidgetProperty('plesynd_offline_compatible'));
                $widget->setIsOfflineCompatible($property->getValue());
            } catch(WookieConnectorException $e) {
                $widget->setIsOfflineCompatible(false);
            }
            $widget->setInstance($connection->getOrCreateInstance($widget));
            $widget->setWorkspaceId($widget->getWorkspace()->getId());
            return $widget;
        }, $widgets) ;

        return View::create($widgets);
    }

    /**
     * @Route("/{id}", name="delete_widget")
     * @Method({"DELETE"})
     * @ApiDoc
     * @param $id
     */
    public function deleteWidgetAction($id)
    {
        $em = /* @var $em \Doctrine\ORM\EntityManager */ $this->get('doctrine')->getEntityManager();
        $widget = $em->find('CorujaPlesyndBundle:Widget', $id);
        if ($widget !== NULL) {
            $em->remove($widget);
            $em->flush();
            return View::create(null, HttpCodes::HTTP_NO_CONTENT);
        }
        return View::create(null, HttpCodes::HTTP_NOT_FOUND);
    }

    /**
     * @Route("", name="add_widget")
     * @Method({"POST"})
     * @ApiDoc
     */
    public function postWidgetAction()
    {
        $data = $this->getRequest()->request;
        $em = /* @var $em \Doctrine\ORM\EntityManager */ $this->get('doctrine')->getEntityManager();
        $widget = new Widget($data->get('identifier'), $data->get('title'), $data->get('description'), $data->get('title'));
        $widget->setWorkspace($em->getRepository('CorujaPlesyndBundle:Workspace')->findOneBy(array('id' => $data->get('workspace_id'))));
        $em->flush();

        return RouteRedirectView::create('get_widget', array('id' => $widget->getId()), HttpCodes::HTTP_CREATED);
    }
}