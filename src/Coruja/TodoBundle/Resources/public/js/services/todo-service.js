'use strict';

todoApp.factory('todoService', ["$resource", "$window", "$q", "localStorage", "resourceService", "childFrameMessenger", "todo_ressource_uri",
    function ($resource, $window, $q, localStorage, resourceService, childFrameMessenger, todo_ressource_uri) {
        var copy = angular.copy;
        var local_storage_prefix = "todos_"+$window.name;

        function Todo (data) {
            copy(data || {}, this);
        }

        function entityFactory(data) {
            return new Todo(data);
        }

        var config = {
            remoteResource : $resource(todo_ressource_uri, {todoId:'@id'}, {
                put:{method:'PUT' },
                post:{method:'POST' }
            }),
            localResource : localStorage(local_storage_prefix),
            localResourceAdded : localStorage(local_storage_prefix+'.added'),
            localResourceChanged : localStorage(local_storage_prefix+'.changed'),
            localResourceDeleted : localStorage(local_storage_prefix+'.deleted'),
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

        service.post = function (todo, success, error) {
            resource.post(todo, success, error);
            service.notifyParentAboutItems();
        };

        service.put = function (todo, success, error) {
            resource.put(todo, success, error);
            service.notifyParentAboutItems();
        };

        service.delete = function (todo, success, error) {
            resource.delete(todo, success, error);
            service.notifyParentAboutItems();
        };

        service.synchronize = function (success, error) {
            resource.synchronize(success, error);
        }

        service.createEntity = function (data) {
            return entityFactory(data);
        };

        service.notifyParentAboutItems = function() {
            function queryDeferred(storage) {
                var deferred = $q.defer();

                storage.query(function (data) {
                    deferred.resolve(data);
                });
                return deferred.promise;
            }

            var promises = [
                queryDeferred(config['localResource']),
                queryDeferred(config['localResourceAdded']),
                queryDeferred(config['localResourceChanged']),
                queryDeferred(config['localResourceDeleted'])
            ];
            $q.all(promises).then(function (results) {
                var data = {
                    'available' : results[0],
                    'added' : results[1],
                    'changed' : results[2],
                    'deleted' : results[3]
                }
                console.log('all storages resolved:', results);
                childFrameMessenger.notifyParentAboutItems(data);
            });
        }

        return service;
    }]);