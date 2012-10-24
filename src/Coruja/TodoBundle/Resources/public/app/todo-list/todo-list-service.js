'use strict';

Application.Services.factory('todoListService', ["$resource", "$window", "$q", "localStorage", "resourceService", "configuration",
    function ($resource, $window, $q, localStorage, resourceService, configuration) {
        var copy = angular.copy,
            local_storage_prefix = "todoLists"+$window.name,
            config,
            resource,
            service = {};

        function TodoList (data) {
            copy(data || {}, this);
        }

        function entityFactory(data) {
            return new TodoList(data);
        }

        config = {
            remoteResource : $resource(configuration.TODO_LIST_RESOURCE_URI, {todoListId:'@id'}, {
                put:{method:'PUT' },
                post:{method:'POST' }
            }),
            localResource : localStorage(local_storage_prefix),
            entityFactory : entityFactory,
            use_synchronization : false
        };

        resource = resourceService(config);

        service = {};

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
            resource.post(item, success, error);
        };

        service.put = function (item, success, error) {
            resource.put(item, success, error);
        };

        service['delete'] = function (item, success, error) {
            resource['delete'](item, success, error);
        };

        service.createEntity = function (data) {
            return entityFactory(data);
        };

        return service;
    }]);