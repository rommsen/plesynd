'use strict';

angular.module('corujaResource', ['corujaStorage', 'corujaOnlineStatus']).factory('resourceService', ["$q", "$timeout", "$resource", "localStorage", "onlineStatus",
    function ($q, $timeout, $resource, localStorage, onlineStatus) {
        function resourceFactory(config) {
            var remoteResource = config.remoteResource;
            var localResource = config.localResource;
            var localResourceAdded = config.localResourceAdded;
            var localResourceChanged = config.localResourceChanged;
            var localResourceDeleted = config.localResourceDeleted;
            var entityFactory = config.entityFactory;

//            // uncomment to reset data
//            localResource.storeData([]);
//            localResourceAdded.storeData([]);
//            localResourceChanged.storeData([]);
//            localResourceDeleted.storeData([]);

            var localIdPrefix = 'local_';

            var forEach = angular.forEach,
                noop = angular.noop;

            /**
             * Deletes $save, $get etc methods from Resource Object
             * @param object
             * @return {Object}
             */
            function deleteUnnecessaryProperties(object) {
                var strippedObject = {};
                for (var property in object) {
                    if (property.charAt(0) != '$') {
                        strippedObject[property] = object[property];
                    }
                }
                return strippedObject;
            }

            /**
             * Synchronizes the local resources for added, changed and deleted Items
             * @param success
             */
            function synchronizeData(success) {
                var promises = [
                    synchronizeStorage(localResourceAdded, 'post'),
                    synchronizeStorage(localResourceChanged, 'put'),
                    synchronizeStorage(localResourceDeleted, 'delete')
                ]
                $q.all(promises).then(function (results) {
                    console.log('all (post put delete) resolved:', results);
                    (success || noop)(results);
                });
            }

            /**
             * Synchronizes local resource with remote resource
             * @param storage local resource
             * @param method put/post/delete
             * @return $q.defer().promise
             */
            function synchronizeStorage(storage, method) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                var data_length;
                var resolved = 0;
                var results = [];

                function resolve(object, header) {
                    var result = {};

                    // if headers are not defined, the synchronization of the
                    // item was not successful and the error callback was called
                    if(header !== undefined) {
                        // only delete item from local storage, if sync was successful
                        storage.delete(object);
                        result.item = object;
                        result.header = header;
                    } else {
                        result.response = object;
                    }
                    results.push(result);

                    resolved += 1;
                    // resolve when all items are handled (no matter if successful or not)
                    if (resolved === data_length) {
                        $timeout(function () {
                            console.log(method + ' resolved, all items are processed');
                            deferred.resolve(results);
                        });
                    }
                }
                // process each item of storage separately
                storage.query(function (data) {
                    data_length = data.length;
                    if (data_length == 0) {
                        $timeout(function () {
                            deferred.resolve([]);
                        });
                    } else {
                        forEach(data, function (item) {
                            if (method === 'post') {
                                // id was only set locally and should not be transferred
                                delete item.id;
                            }
                            console.log(method, item);
                            resource[method].call(resource, item, resolve, resolve);
                        });
                    }
                });
                return promise;
            }

            var resource = {};

            resource.query = function (success, error) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                var items = [];

                function resolveQueryDeferred(data) {
                    $timeout(function () {
                        deferred.resolve(data);
                    });
                }

                var resource = onlineStatus.isOnline() ? remoteResource : localResource;
                resource.query(resolveQueryDeferred, function () {
                    // if remote query is not successful query the local resource
                    localResource.query(resolveQueryDeferred);
                });

                promise.then(function (data) {
                    // we dont want to store the ngResource objects but our own
                    forEach(data, function (item) {
                        items.push(entityFactory(deleteUnnecessaryProperties(item)));
                    });
                    // local resources are always overwritten with last result
                    localResource.storeData(items);
                    (success || noop)(items);
                }, error);
                return items;
            };

            resource.post = function (item, success, error) {
                if (onlineStatus.isOnline()) {
                    remoteResource.post(item, function (data, header) {
                        // REST Server returns Location header with URI
                        var location = header('Location');
                        item.id = location.substring(location.lastIndexOf('/') + 1);
                        // always store in local resource
                        localResource.post(item);
                        (success || noop)(item, header);
                    }, error);
                } else {
                    localResource.query(function (data) {
                        item.id = localIdPrefix + data.length;
                        localResource.post(item);
                        // mark for adding
                        localResourceAdded.post(item);
                        (success || noop)(item)
                    });
                }
            };

            resource.put = function (item, success, error) {
                if (onlineStatus.isOnline()) {
                    remoteResource.put(item, function (data, header) {
                        localResource.put(item);
                        (success || noop)(item, header);
                    }, error);
                } else {
                    localResource.put(item);
                    if (String(item.id).substr(0, localIdPrefix.length) == localIdPrefix) {
                        // if item was only stored locally we need to change
                        // the local resource for added items
                        localResourceAdded.put(item);
                    } else {
                        // otherwise mark for update
                        localResourceChanged.put(item);
                    }
                    (success || noop)(item);
                }
            };

            resource.delete = function (item, success, error) {
                if (onlineStatus.isOnline()) {
                    // remoteResource.delete(item, ... geht nicht
                    new remoteResource(item).$delete(function (data, header) {
                        localResource.delete(item);
                        (success || noop)(item, header);
                    }, error);
                } else {
                    localResource.delete(item);
                    if (String(item.id).substr(0, localIdPrefix.length) == localIdPrefix) {
                        // if item was only stored locally it should not be added anymore
                        localResourceAdded.delete(item);
                    } else {
                        // otherwise it should not be marked as changed anymore
                        localResourceChanged.delete(item);
                        // mark for deletion
                        localResourceDeleted.put(item);
                    }
                    (success || noop)(item);
                }
            };

            resource.synchronize = function (success, error) {
                if (onlineStatus.isOnline()) {
                    synchronizeData(success, error);
                } else {
                    // can not synchronize when offline
                    (success || noop)();
                }
            }
            return resource;
        }

        return resourceFactory;
    }]);