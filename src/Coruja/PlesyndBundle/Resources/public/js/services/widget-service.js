'use strict';

plesynd.factory('widgetService', ["$resource", "localStorage", "resourceService",
    function ($resource, localStorage, resourceService) {
        var copy = angular.copy;

        function Widget(data) {
            copy(data || {}, this);
        }

        function entityFactory(data) {
            return new Widget(data);
        }

        var config = {
            remoteResource : $resource('plesynd/api/widgets/:widgetId', {widgetId:'@id'}, {
                put:{method:'PUT' },
                post:{method:'POST' }
            }),
            localResource : localStorage('widgets'),
            localResourceAdded : localStorage('widgets.added'),
            localResourceChanged : localStorage('widgets.changed'),
            localResourceDeleted : localStorage('widgets.deleted'),
            entityFactory : entityFactory
        };

        var resource = resourceService(config);

        var service = {};

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

        service.delete = function (item, success, error) {
            resource.delete(item, success, error);
        };

        service.synchronize = function (success, error) {
            resource.synchronize(success, error);
        }

        service.createEntity = function (data) {
            return entityFactory(data);
        };

        return service;
    }]);