<?php
namespace Coruja\PlesyndBundle\Controller;

use Coruja\PlesyndBundle\Entity\Widget;
use Coruja\WookieConnectorBundle\Connector\Widget as WookieWidget;
use Coruja\WookieConnectorBundle\Connector\WidgetProperty;
use Coruja\WookieConnectorBundle\Connector\Exception\WookieConnectorException;
use Nelmio\ApiDocBundle\Annotation\ApiDoc;
use FOS\RestBundle\Controller\FOSRestController;
use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\View\RouteRedirectView;
use FOS\RestBundle\View\View;
use FOS\Rest\Util\Codes as HttpCodes;

use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\Security\Acl\Domain\ObjectIdentity;
use Symfony\Component\Security\Acl\Domain\UserSecurityIdentity;
use Symfony\Component\Security\Acl\Permission\MaskBuilder;

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

         $widgets = array_map(function(WookieWidget $widget) use($connection) {
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
        $em = /* @var $em \Doctrine\ORM\EntityManager */ $this->get('doctrine')->getManager();
        $widget = /* @var \Coruja\PlesyndBundle\Entity\Widget $widget */
            $em->getRepository('CorujaPlesyndBundle:Widget')->find($id);

        $securityContext = $this->get('security.context');
        if($securityContext->isGranted('VIEW', $widget) === false) {
            throw new AccessDeniedException();
        }

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
        $em = /* @var $em \Doctrine\ORM\EntityManager */ $this->get('doctrine')->getManager();
        $widgets =  $em->createQueryBuilder()
            ->select('widget')
            ->from('CorujaPlesyndBundle:Widget', 'widget')
            ->orderBy('widget.position', 'asc')->getQuery()->getResult();

        $securityContext = $this->get('security.context');
        $widgets = array_filter($widgets, function(Widget $widget) use ($securityContext) {
            return $securityContext->isGranted('VIEW', $widget);
        });

        $widgets = array_map(function(Widget $widget) use($connection) {
            $connection->getUser()->setLoginName($widget->getInstanceIdentifier());
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
        $em = /* @var $em \Doctrine\ORM\EntityManager */ $this->get('doctrine')->getManager();
        $widget = $em->find('CorujaPlesyndBundle:Widget', $id);

        if($widget === NULL) {
            return View::create(null, HttpCodes::HTTP_NOT_FOUND);
        }

        $securityContext = $this->get('security.context');
        if ($securityContext->isGranted('DELETE', $widget) === false) {
            throw new AccessDeniedException();
        }

        $aclProvider = $this->get('security.acl.provider');
        $objectIdentity = ObjectIdentity::fromDomainObject($widget);
        $aclProvider->deleteAcl($objectIdentity);

        $em->remove($widget);
        $em->flush();
        return View::create(null, HttpCodes::HTTP_NO_CONTENT);
    }

    /**
     * @Route("", name="add_widget")
     * @Method({"POST"})
     * @ApiDoc
     */
    public function postWidgetAction()
    {
        $data = $this->getRequest()->request;
        $em = /* @var $em \Doctrine\ORM\EntityManager */ $this->get('doctrine')->getManager();
        $widget = new Widget($data->get('identifier'), $data->get('title'), $data->get('description'), $data->get('title'));
        $widget->setWorkspace($em->getRepository('CorujaPlesyndBundle:Workspace')->findOneBy(array('id' => $data->get('workspace_id'))));
        $widget->setIsOfflineCompatible($data->get('is_offline_compatible'));
        $em->flush();

        // creating the ACL
        $aclProvider = $this->get('security.acl.provider');
        $acl = $aclProvider->createAcl(ObjectIdentity::fromDomainObject($widget));

        // retrieving the security identity of the currently logged-in user
        $securityContext = $this->get('security.context');
        $securityIdentity = UserSecurityIdentity::fromAccount($securityContext->getToken()->getUser());

        // grant owner access
        $acl->insertObjectAce($securityIdentity, MaskBuilder::MASK_OWNER);
        $aclProvider->updateAcl($acl);

        return RouteRedirectView::create('get_widget', array('id' => $widget->getId()), HttpCodes::HTTP_CREATED);
    }

    /**
     * @Route("/{id}", name="put_widget")
     * @Method({"PUT"})
     * @Rest\View()
     * @ApiDoc
     * @param $id
     */
    public function putWidgetAction($id)
    {
        $data = $this->getRequest()->request;
        $em = $this->get('doctrine')->getManager();
        /* @var $em \Doctrine\ORM\EntityManager */
        $widget = $em->find('CorujaPlesyndBundle:Widget', $id);
        if($widget !== NULL) {
            $securityContext = $this->get('security.context');
            if ($securityContext->isGranted('EDIT', $widget) === false) {
                throw new AccessDeniedException();
            }

            $widget->setPosition($data->get('position'));
            $em->flush();
            return View::create(null, HttpCodes::HTTP_NO_CONTENT);
        }
        return View::create(null, HttpCodes::HTTP_NOT_FOUND);
    }
}