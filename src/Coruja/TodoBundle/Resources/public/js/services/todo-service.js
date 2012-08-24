'use strict';

todoApp.factory('todoService', ["$resource", "localStorage", "resourceService",
    function ($resource, localStorage, resourceService) {
        var copy = angular.copy;

        function Todo (data) {
            copy(data || {}, this);
        }

        function todoFactory(data) {
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
            entityFactory : todoFactory
        };

        var resource = resourceService(config);

        var todoService = {};

        todoService.query = function (success, error) {
            return resource.query(success, error);
        };

        todoService.post = function (todo, success, error) {
            resource.post(todo, success, error);
        };

        todoService.put = function (todo, success, error) {
            resource.put(todo, success, error);
        };

        todoService.delete = function (todo, success, error) {
            resource.delete(todo, success, error);
        };

        todoService.synchronize = function (success, error) {
            resource.synchronize(success, error);
        }

        todoService.createEntity = function (data) {
            return todoFactory(data);
        };

        return todoService;
    }]);