<?php

namespace Coruja\WookieConnectorBundle\DependencyInjection;

use Symfony\Component\Config\Definition\Builder\TreeBuilder;
use Symfony\Component\Config\Definition\ConfigurationInterface;

/**
 * This is the class that validates and merges configuration from your app/config files
 *
 * To learn more see {@link http://symfony.com/doc/current/cookbook/bundles/extension.html#cookbook-bundles-extension-config-class}
 */
class Configuration implements ConfigurationInterface
{
    /**
     * {@inheritDoc}
     */
    public function getConfigTreeBuilder()
    {
        $treeBuilder = new TreeBuilder();
        $rootNode = $treeBuilder->root('coruja_wookie_connector');

        $rootNode
            ->children()
                ->variableNode('protocol')
                    ->defaultValue('http://')
                    ->info('host of wookie instance')
                    ->example('http://')
                    ->end()

                ->variableNode('host')
                    ->defaultValue('localhost')
                    ->info('host of wookie instance')
                    ->example('example.com')
                    ->end()

                ->scalarNode('port')
                    ->defaultValue('8080')
                    ->info('port of wookie instance')
                    ->example('8080')
                    ->end()

                ->variableNode('path')
                    ->defaultValue('wookie')
                    ->info('path of wookie instance')
                    ->example('wookie')
                    ->end()

                ->variableNode('api_key')
                    ->defaultValue('TEST')
                    ->info('api_key for wookie instance')
                    ->example('TEST')
                    ->end()

                ->variableNode('shared_data_key')
                    ->defaultValue('default_shared_data_key')
                    ->info('shared data key for wookie instance')
                    ->example('some_key')
                    ->end()

                ->variableNode('login_name')
                    ->defaultValue('user')
                    ->info('user login name')
                    ->example('username')
                    ->end()

                ->variableNode('screen_name')
                    ->defaultValue(null)
                    ->info('user screen name')
                    ->example('some screen name')
                    ->end()
            ->end();

        return $treeBuilder;
    }
}
