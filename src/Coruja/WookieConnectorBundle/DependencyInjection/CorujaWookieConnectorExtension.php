<?php

namespace Coruja\WookieConnectorBundle\DependencyInjection;

use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\Config\FileLocator;
use Symfony\Component\HttpKernel\DependencyInjection\Extension;
use Symfony\Component\DependencyInjection\Loader;

/**
 * This is the class that loads and manages your bundle configuration
 *
 * To learn more see {@link http://symfony.com/doc/current/cookbook/bundles/extension.html}
 */
class CorujaWookieConnectorExtension extends Extension
{
    /**
     * {@inheritDoc}
     */
    public function load(array $configs, ContainerBuilder $container)
    {
        $configuration = new Configuration();
        $config = $this->processConfiguration($configuration, $configs);

        $path = $config['path'];
        if($path !== null) {
            if(substr($path, strlen($path) -1 ) != '/' ) {
                $path .= '/';
            }
        }

        $port = $config['port'];
        if($port !== null) {
            $port = ':'.$port;
        }
        $container->setParameter('coruja_wookie_connector.url', sprintf('%s%s%s/%s', $config['protocol'], $config['host'], $port, $path));

        $container->setParameter('coruja_wookie_connector.api_key', $config['api_key']);
        $container->setParameter('coruja_wookie_connector.shared_data_key', $config['shared_data_key']);
        $container->setParameter('coruja_wookie_connector.login_name', $config['login_name']);
        $container->setParameter('coruja_wookie_connector.screen_name', $config['screen_name']);
        $loader = new Loader\XmlFileLoader($container, new FileLocator(__DIR__.'/../Resources/config'));
        $loader->load('services.xml');
    }
}
