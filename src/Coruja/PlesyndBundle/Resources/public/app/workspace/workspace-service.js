'use strict';

Application.Services.factory('workspaceService', ["$resource", "localStorage", "resourceService", "configuration",
    function ($resource, localStorage, resourceService, configuration) {
        var copy = angular.copy,
            config,
            resource,
            service = {};

        function Workspace(data) {
            copy(data || {}, this);
        }

        function entityFactory(data) {
            return new Workspace(data);
        }

        config = {
            remoteResource : $resource(configuration.WORKSPACE_RESOURCE_URI, {id:'@id'}, {
                put:{method:'PUT' },
                post:{method:'POST' }
            }),
            localResource : localStorage('workspaces'),
            entityFactory : entityFactory
        };

        resource = resourceService(config);

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

        service.synchronize = function (success, error) {
            resource.synchronize(success, error);
        };

        service.createEntity = function (data) {
            return entityFactory(data);
        };

        return service;
    }]);