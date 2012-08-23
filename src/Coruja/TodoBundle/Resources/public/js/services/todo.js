/**
 * Todo Rest Ressource
 */
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
            remoteResource : $resource('todo/api/todos/:todoId', {todoId:'@id'}, {
                put:{method:'PUT' },
                post:{method:'POST' }
            }),
            localResource : localStorage('todos'),
            localResourceAdded : localStorage('todos.added'),
            localResourceChanged : localStorage('todos.changed'),
            localResourceDeleted : localStorage('todos.deleted'),
            entityFactory : todoFactory
        }

        var resource = resourceService(config)

        var todoService = {};

        todoService.query = function (success) {
            return resource.query(success);
        };

        todoService.post = function (todo, success) {
            resource.post(todo, success);
        };

        todoService.put = function (todo, success) {
            resource.put(todo, success);
        };

        todoService.delete = function (todo, success) {
            resource.delete(todo, success);
        };

        todoService.synchronize = function (success) {
            resource.synchronize(success);
        }

        todoService.createEntity = function (data) {
            return todoFactory(data);
        };

        return todoService;
    }]);