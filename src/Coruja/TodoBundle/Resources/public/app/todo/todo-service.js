'use strict';

/**
 * TodoWidget Services
 *
 * @module TodoWidget.Services
 */

/**
 * Uses the resourceService and the localStorage to work online and offline with a REST-API
 *
 * @class todoService
 */
Application.Services.factory('todoService', ["$resource", "$window", "$q", "localStorage", "resourceService", "childFrameMessenger", "configuration",
    /**
     * @method Factory
     * @param $resource
     * @param $window
     * @param $q
     * @param localStorage
     * @param resourceService
     * @param configuration
     * @returns {Object}
     */
    function ($resource, $window, $q, localStorage, resourceService, childFrameMessenger, configuration) {
        var copy = angular.copy,
            forEach = angular.forEach,
            local_storage_prefix = "todos_"+$window.name,
            config,
            resource,
            service = {},
            resolver;

        function Todo (data) {
            copy(data || {}, this);
        }

        function entityFactory(data) {
            return new Todo(data);
        }

        config = {
            remoteResource : $resource(configuration.TODO_RESOURCE_URI, {todoId:'@id'}, {
                put:{method:'PUT' },
                post:{method:'POST' }
            }),
            localResource : localStorage(local_storage_prefix),
            entityFactory : entityFactory,
            use_synchronization : true
        };

        resource = resourceService(config);

        resolver = function() {
            service.notifyParentAboutItems();
        };

        service.resetLocal = function() {
            config.localResource.reset();
        };

        service.query = function (success, error) {
            return resource.query({}, success, error);
        };

        service.get = function (params, success, error) {
            return resource.get(params, success, error);
        };

        service.post = function (item, success, error) {
            resource.post(item, success, error).then(resolver, resolver);
        };

        service.put = function (item, success, error) {
            resource.put(item, success, error).then(resolver, resolver);
        };

        service['delete'] = function (item, success, error) {
            resource['delete'](item, success, error).then(resolver, resolver);
        };

        service.synchronize = function (success, error) {
            resource.synchronize(success, error);
        };

        service.createEntity = function (data) {
            return entityFactory(data);
        };

        service.notifyParentAboutItems = function() {
            var information = {
                'available' : 0,
                'added'     : 0,
                'changed'   : 0,
                'deleted'   : 0,
                'data'      : null
                },

                method_translation = {
                'delete' : 'deleted',
                'post'   : 'added',
                'put'    : 'changed'
            };

            config.localResource.query(function (data) {
                forEach(data, function(item) {
                    information.available += 1;
                    if(item.synchronize_method !== undefined && method_translation[item.synchronize_method] !== undefined) {
                        information[method_translation[item.synchronize_method]] += 1;
                        if(item.synchronize_method === 'delete') {
                            information.available -= 1;
                        }
                    }
                    information.data = data;
                });
                childFrameMessenger.notifyParentAboutItems(information);
            });
        };

        return service;
    }]);