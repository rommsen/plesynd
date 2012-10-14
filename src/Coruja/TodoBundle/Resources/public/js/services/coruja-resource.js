'use strict';

angular.module('corujaResource', ['corujaStorage', 'corujaOnlineStatus']).factory('resourceService', ["$q", "$timeout", "$resource", "localStorage", "onlineStatus",
    function ($q, $timeout, $resource, localStorage, onlineStatus) {
        function resourceFactory(config) {
            var remoteResource = config.remoteResource;
            var localResource = config.localResource;
            var entityFactory = config.entityFactory;
            var use_synchronization = config.use_synchronization;

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
                    synchronizeStorage(localResource),
                ]
                $q.all(promises).then(function (results) {
                    console.log('all (post put delete) resolved:', results);
                    (success || noop)(results);
                });
            }

            /**
             * Synchronizes local resource with remote resource
             * @param storage local resource
             * @return $q.defer().promise
             */
            function synchronizeStorage(storage) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                var data_length;
                var resolved = 0;
                var results = [];

                function resolve(object, header) {
                    var result = {};

                    // if headers are not defined, the synchronization of the
                    // item was not successful and the error callback was called
                    if (header !== undefined) {
                        delete object.synchronize_method;
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
                            deferred.resolve(results);
                        });
                    }
                }

                // process each item of storage separately
                storage.query(function (data) {
                    var to_synchronize = [];
                    forEach(data, function (item) {
                        if (item.synchronize_method !== undefined) {
                            to_synchronize.push(item);
                        }
                    });
                    data_length = to_synchronize.length;
                    if (data_length == 0) {
                        $timeout(function () {
                            deferred.resolve([]);
                        });
                    } else {
                        forEach(to_synchronize, function (item) {
                            if (item.synchronize_method === 'post') {
                                // id was only set locally and should not be transferred
                                // but we need id for local storage deletion
                                item.local_id = item.id;
                                delete item.id;
                            }
                            resource[item.synchronize_method].call(resource, item, resolve, resolve);
                        });
                    }
                });
                return promise;
            }

            var resource = {};

            resource.query = function (params, success, error) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                var items = [];

                function resolveQueryDeferred(data) {
                    $timeout(function () {
                        deferred.resolve(data);
                    });
                }

                var resource = onlineStatus.isOnline() ? remoteResource : localResource;
                resource.query(params, resolveQueryDeferred, function () {
                    // if remote query is not successful query the local resource
                    localResource.query(resolveQueryDeferred);
                });

                promise.then(function (data) {
                    // we dont want to store the ngResource objects but our own
                    forEach(data, function (item) {
                        item = entityFactory(deleteUnnecessaryProperties(item));
                        items.push(item);
                    });

                    localResource.storeData(items);
                    (success || noop)(items);
                }, error);
                return items;
            };

            resource.get = function (params, success, error) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                var item;

                function resolveQueryDeferred(data) {
                    $timeout(function () {
                        deferred.resolve(data);
                    });
                }

                var resource = onlineStatus.isOnline() ? remoteResource : localResource;
                resource.get(params, resolveQueryDeferred, function () {
                    // if remote query is not successful query the local resource
                    localResource.query(params, resolveQueryDeferred);
                });

                promise.then(function (data) {
                    // we dont want to store the ngResource objects but our own
                    item = entityFactory(deleteUnnecessaryProperties(data));
                    // new items are added to local storage, existing items are updated
                    localResource.put(item);
                    (success || noop)(item);
                }, error);
                return item;
            };

            resource.post = function (item, success, error) {
                if (!onlineStatus.isOnline()) {
                    resource.localFallback(item, 'post', success, error);
                    return;
                }

                remoteResource.post(item,
                    function (data, header) {
                        // REST Server returns Location header with URI
                        var location = header('Location');
                        item.id = location.substring(location.lastIndexOf('/') + 1);
                        resource.updateLocalStorage(item, 'post', false);
                        (success || noop)(item, header);
                    }, function (response) {
                        resource.localFallback(item, 'post', success, error, response);
                    });
            };


            resource.put = function (item, success, error) {
                if (!onlineStatus.isOnline()) {
                    resource.localFallback(item, 'put', success, error);
                    return;
                }

                remoteResource.put(item,
                    function (data, header) {
                        resource.updateLocalStorage(item, 'put');
                        (success || noop)(item, header);
                    }, function (response) {
                        resource.localFallback(item, 'put', success, error, response);
                    });
            };

            resource.delete = function (item, success, error) {
                if (!onlineStatus.isOnline()) {
                    resource.localFallback(item, 'delete', success, error);
                    return;
                }

                // remoteResource.delete(item, ... does not work
                new remoteResource(item).$delete(
                    function (data, header) {
                        resource.updateLocalStorage(item, 'delete');
                        (success || noop)(item, header);
                    }, function (response) {
                        resource.localFallback(item, 'delete', success, error, response);
                    });
            };

            resource.localFallback = function (item, method, success, error, response) {
                if (use_synchronization) {
                    resource.updateLocalStorage(item, method, true);
                    (success || noop)(item);
                } else {
                    (error || noop)(response);
                }
            };

            resource.updateLocalStorage = function (item, method, to_synchronize) {
                var call_method = method;
                switch (method) {
                    case 'delete':
                        if (to_synchronize) {
                            item.synchronize_method = 'delete';
                            // when synchronization needed, do not delete from localStorage
                            call_method = 'put';
                        }
                        break;

                    case 'post':
                        if (to_synchronize) {
                            var date = new Date;
                            // generate local_id
                            item.id = localIdPrefix + date.getTime();
                            item.synchronize_method = 'post';
                        }
                        break;

                    case 'put':
                        // if there is a post or delete, stick with it
                        if (item.synchronize_method === undefined) {
                            item.synchronize_method = 'put';
                        }
                        break;
                }
                console.log(localResource);

                localResource[call_method].call(localResource, item);
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
    }])
;