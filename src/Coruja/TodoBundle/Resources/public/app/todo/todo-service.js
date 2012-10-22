'use strict';

Application.Services.factory('todoService', ["$resource", "$window", "$q", "localStorage", "resourceService", "childFrameMessenger", "configuration",
    function ($resource, $window, $q, localStorage, resourceService, childFrameMessenger, configuration) {
        var copy = angular.copy;
        var forEach = angular.forEach;
        var local_storage_prefix = "todos_"+$window.name;

        function Todo (data) {
            copy(data || {}, this);
        }

        function entityFactory(data) {
            return new Todo(data);
        }

        var config = {
            remoteResource : $resource(configuration.TODO_RESOURCE_URI, {todoId:'@id'}, {
                put:{method:'PUT' },
                post:{method:'POST' }
            }),
            localResource : localStorage(local_storage_prefix),
            entityFactory : entityFactory,
            use_synchronization : true
        };

        var resource = resourceService(config);

        var service = {};

        var resolver = function() {
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

        service.delete = function (item, success, error) {
            resource.delete(item, success, error).then(resolver, resolver);
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
            };

            var method_translation = {
                'delete' : 'deleted',
                'post'   : 'added',
                'put'    : 'changed'
            }

            config.localResource.query(function (data) {
                forEach(data, function(item) {
                    information.available += 1;
                    if(item.synchronize_method !== undefined && method_translation[item.synchronize_method] !== undefined) {
                        information[method_translation[item.synchronize_method]] += 1;
                        if(item.synchronize_method == 'delete') {
                            information.available -= 1;
                        }
                    }
                    information.data = data;
                });
                console.log('information', information);
                childFrameMessenger.notifyParentAboutItems(information);
            });
        };

        return service;
    }]);