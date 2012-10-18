'use strict';

Application.Services.factory('workspaceService', ["$resource", "localStorage", "resourceService", "configuration",
    function ($resource, localStorage, resourceService, configuration) {
        var copy = angular.copy;

        function Workspace(data) {
            copy(data || {}, this);
        }

        function entityFactory(data) {
            return new Workspace(data);
        }

        var config = {
            remoteResource : $resource('plesynd/api/workspaces/:id', {id:'@id'}, {
                put:{method:'PUT' },
                post:{method:'POST' }
            }),
            localResource : localStorage('workspaces'),
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


        // workspace specific methods
        service.deleteWidget = function(workspace, widget) {

            var tmp = $resource('plesynd/api/workspaces/:workspaceId/widgets/:widgetId', {workspaceId:'@id'}, {
                put:{method:'PUT' },
                post:{method:'POST' }
            });

            tmp.delete({'workspaceId': workspace.id, "widgetId": widget.id});
        }

        return service;
    }]);