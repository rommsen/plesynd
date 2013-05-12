'use strict';

/**
 * Angular Services
 *
 * @module Application.Services
 */

/**
 * Unifies the work with Rest-Resurces and LocalStorage-Resources
 *
 * @class resourceService
 */
Application.Services.factory('resourceService', ["$q", "$timeout", "$resource", "localStorage", "onlineStatus",
    function ($q, $timeout, $resource, localStorage, onlineStatus) {
        function resourceFactory(config) {
            var remoteResource = config.remoteResource,
                localResource = config.localResource,
                entityFactory = config.entityFactory,
                use_synchronization = config.use_synchronization,
                localIdPrefix = 'local_',
                forEach = angular.forEach,
                noop = angular.noop,
                resource = {},
                resourceDeferred;

            // uncomment to reset data
//            localResource.reset();

            /**
             * Deletes $save, $get etc methods from Resource Object
             * @param object
             * @return {Object}
             */
            function deleteUnnecessaryProperties(object) {
                var strippedObject = {},
                    property;
                for (property in object) {
                    if (property.charAt(0) !== '$') {
                        strippedObject[property] = object[property];
                    }
                }
                return strippedObject;
            }

            /**
             * Synchronizes local resource with remote resource
             * @return $q.defer().promise
             */
            function synchronizeData() {
                var deferred = $q.defer(),
                    promise = deferred.promise,
                    data_length,
                    resolved = 0,
                    results = [];

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
                localResource.query(function (data) {
                    var to_synchronize = [];
                    forEach(data, function (item) {
                        if (item.synchronize_method !== undefined) {
                            to_synchronize.push(item);
                        }
                    });
                    data_length = to_synchronize.length;
                    if (data_length === 0) {
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

            /**
             * GET collection of items
             * @method query
             * @param params
             * @param success callback
             * @param error callback
             * @returns {Array}
             */
            resource.query = function (params, success, error) {
                var deferred = $q.defer(),
                    promise = deferred.promise,
                    items = [],
                    resource = onlineStatus.isOnline() ? remoteResource : localResource;

                function resolveQueryDeferred(data) {
                    $timeout(function () {
                        deferred.resolve(data);
                    });
                }

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

            /**
             * GET on item
             * @method get
             * @param params
             * @param success callback
             * @param error callback
             * @returns {*}
             */
            resource.get = function (params, success, error) {
                var deferred = $q.defer(),
                    promise = deferred.promise,
                    item,
                    resource = onlineStatus.isOnline() ? remoteResource : localResource;

                function resolveQueryDeferred(data) {
                    $timeout(function () {
                        deferred.resolve(data);
                    });
                }

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

            /**
             * POST
             * @method post
             * @param item to call method for
             * @param success callback
             * @param error callback
             * @returns promise
             */
            resource.post = function (item, success, error) {
                resourceDeferred = $q.defer();
                var promise = resourceDeferred.promise;

                if (!onlineStatus.isOnline()) {
                    resource.localFallback(item, 'post', success, error);
                    return promise;
                }

                remoteResource.post(item,
                    function (data, header) {
                        // REST Server returns Location header with URI
                        var location = header('Location');
                        // necessary due to Firefox Bug: https://github.com/angular/angular.js/issues/1468
                        if(location) {
                            item.id = location.substring(location.lastIndexOf('/') + 1);
                        } else {
                            item.id = data.id;
                        }
                        resource.updateLocalStorage(item, 'post');
                        resourceDeferred.resolve();
                        (success || noop)(item, header);
                    }, function (response) {
                        resource.localFallback(item, 'post', success, error, response);
                    });

                return promise;
            };

            /**
             * PUT
             * @method put
             * @param item to call method for
             * @param success callback
             * @param error callback
             * @returns promise
             */
            resource.put = function (item, success, error) {
                resourceDeferred = $q.defer();
                var promise = resourceDeferred.promise;

                if (!onlineStatus.isOnline()) {
                    resource.localFallback(item, 'put', success, error);
                    return promise;
                }

                remoteResource.put(item,
                    function (data, header) {
                        resource.updateLocalStorage(item, 'put');
                        resourceDeferred.resolve();
                        (success || noop)(item, header);
                    }, function (response) {
                        resource.localFallback(item, 'put', success, error, response);
                    });
                return promise;
            };

            /**
             * DELETE
             * @method delete
             * @param item to call method for
             * @param success callback
             * @param error callback
             * @returns promise
             */
            resource['delete'] = function (item, success, error) {
                resourceDeferred = $q.defer();
                var promise = resourceDeferred.promise;

                if (!onlineStatus.isOnline()) {
                    resource.localFallback(item, 'delete', success, error);
                    return promise;
                }

                // remoteResource.delete(item, ... does not work
                new remoteResource(item).$delete(
                    function (data, header) {
                        resource.updateLocalStorage(item, 'delete');
                        resourceDeferred.resolve();
                        (success || noop)(item, header);
                    }, function (response) {
                        resource.localFallback(item, 'delete', success, error, response);
                    });
                return promise;
            };

            /**
             * Registers a fallback when not online
             * @method localFallback
             * @param item to call method for
             * @param method
             * @param success callback
             * @param error callback
             * @param response
             */
            resource.localFallback = function (item, method, success, error, response) {
                if (use_synchronization) {
                    resource.updateLocalStorage(item, method, true);
                    resourceDeferred.resolve();
                    (success || noop)(item);
                } else {
                    resourceDeferred.reject();
                    (error || noop)(response);
                }
            };

            /**
             * Updates the localStorage according to the given method
             * @method updateLocalStorage
             * @param item to call method for
             * @param method post|delete|put
             * @param to_synchronize
             */
            resource.updateLocalStorage = function (item, method, to_synchronize) {
                var call_method = method,
                    date = new Date();
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
                            // generate local_id
                            item.id = localIdPrefix + date.getTime();
                            item.synchronize_method = 'post';
                        }
                        break;

                    case 'put':
                        // if there is a post or delete, stick to it
                        if (item.synchronize_method === undefined) {
                            item.synchronize_method = 'put';
                        }
                        break;
                }
                localResource[call_method].call(localResource, item);
            };

            /**
             * Synchronizes localStorage with the online backend
             * @method synchronize
             * @param success
             * @param error
             */
            resource.synchronize = function (success, error) {
                if (onlineStatus.isOnline()) {
                    synchronizeData().then(function (results) {
//                        console.log('all (post put delete) resolved:', results);
                        (success || noop)(results);
                    }, error);
                } else {
                    // can not synchronize when offline
                    (success || noop)();
                }
            };
            return resource;
        }

        return resourceFactory;
    }]);