'use strict';

Application.Services.factory('todoService', ["$resource", "$window", "$q", "localStorage", "resourceService", "childFrameMessenger", "configuration",
    function ($resource, $window, $q, localStorage, resourceService, childFrameMessenger, configuration) {
        var copy = angular.copy;
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

        service.resetLocal = function() {
            config.localResource.reset();
        }

        service.query = function (success, error) {
            return resource.query({}, success, error);
        };

        service.get = function (params, success, error) {
            return resource.get(params, success, error);
        };

        service.post = function (item, success, error) {
            resource.post(item, success, error);
            service.notifyParentAboutItems();
        };

        service.put = function (item, success, error) {
            resource.put(item, success, error);
            service.notifyParentAboutItems();
        };

        service.delete = function (item, success, error) {
            resource.delete(item, success, error);
            service.notifyParentAboutItems();
        };

        service.synchronize = function (success, error) {
            resource.synchronize(success, error);
        }

        service.createEntity = function (data) {
            return entityFactory(data);
        };

        service.notifyParentAboutItems = function() {
            return;
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