'use strict';

todoApp.factory('todoService', ["$resource", "localStorage", "resourceService",
    function ($resource, localStorage, resourceService) {
        var copy = angular.copy;

        function Todo (data) {
            copy(data || {}, this);
        }

        function entityFactory(data) {
            return new Todo(data);
        }

        var config = {
            remoteResource : $resource('api/todos/:todoId', {todoId:'@id'}, {
                put:{method:'PUT' },
                post:{method:'POST' }
            }),
            localResource : localStorage('todos'),
            localResourceAdded : localStorage('todos.added'),
            localResourceChanged : localStorage('todos.changed'),
            localResourceDeleted : localStorage('todos.deleted'),
            entityFactory : entityFactory
        };

        var resource = resourceService(config);

        var service = {};

        service.query = function (success, error) {
            return resource.query(success, error);
        };

        service.post = function (todo, success, error) {
            resource.post(todo, success, error);
        };

        service.put = function (todo, success, error) {
            resource.put(todo, success, error);
        };

        service.delete = function (todo, success, error) {
            resource.delete(todo, success, error);
        };

        service.synchronize = function (success, error) {
            resource.synchronize(success, error);
        }

        service.createEntity = function (data) {
            return entityFactory(data);
        };

        return service;
    }]);