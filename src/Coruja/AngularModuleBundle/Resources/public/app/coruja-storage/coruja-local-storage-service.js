'use strict';

/**
 * Angular Services
 *
 * @module Application.Services
 */

/**
 * Mimics a REST-API to work with the Local-Storage
 *
 * @class localStorage
 */
Application.Services.factory('localStorage', ["$timeout", "$q",
    /**
     * @method Factory
     * @param $timeout
     * @param $q
     * @returns {Function}
     */
    function ($timeout, $q) {
        var copy = angular.copy,
            forEach = angular.forEach,
            toJson = angular.toJson,
            fromJson = angular.fromJson,
            noop = angular.noop;


        /**
         * Factory that creates localStorage Objects
         * @method storageFactory
         * @param storage_id
         * @returns {{}}
         */
        function storageFactory(storage_id) {
            function getData() {
                var deferred = $q.defer();

                $timeout(function () {
                    deferred.resolve(fromJson(localStorage.getItem(storage_id) || '[]'));
                });

                return deferred.promise;
            }

            function findItemPosition(item, data) {
                var position = -1;
                forEach(data, function (storedItem, index) {
                    // find the position, if local_id is set use this because the item
                    // is stored with this id in the local storage
                    if ((item.local_id !== undefined ? item.local_id : item.id) == storedItem.id) {
                        position = index;
                    }
                });
                return position;
            }

            function postData(data) {
                localStorage.setItem(storage_id, toJson(data));
            }

            var storage = {};

            /**
             * Resets all stored data
             * @method reset
             */
            storage.reset = function () {
                postData([]);
            };

            /**
             * Queries the localStorage. Does not return a promise but the value array. This makes it
             * compatible with ngResource
             *
             * @method query
             * @param a1 callback or params object TODO maybe we can use params to filter the results
             * @param a2 params object or undefined
             * @return {Array}
             */
            storage.query = function (a1, a2) {
                var value = [],
                    params,
                    success;
                // necessary to be compatible with ngResource, params can be first parameter
                switch (arguments.length) {
                    case 1:
                        success = a1;
                        break;
                    default:
                        params = a1;
                        success = a2;
                        break;
                }
                getData().then(function (data) {
                    copy(data, value);
                    (success || noop)(data);
                });

                return value;
            };

            /**
             * GET data
             * @method query
             * @param params needs to include an id property
             * @param success callback
             * @param error callback
             * @return {*}
             */
            storage.get = function (params, success, error) {
                var value;
                getData().then(function (data) {
                    var position = findItemPosition(params, data);
                    if (position !== -1) {
                        value = data[position];
                        (success || noop)(value);
                    } else {
                        (error || noop)({status:404});
                    }
                });
                return value;
            };

            /**
             * Stores the given data within the storage
             * @method storeData
             * @param data
             */
            storage.storeData = function (data) {
                postData(data);
            };

            /**
             * DELETE data
             * @method delete
             * @param item
             */
            storage['delete'] = function (item) {
                getData().then(function (data) {
                    var position = findItemPosition(item, data);
                    if (position !== -1) {
                        data.splice(position, 1);
                        postData(data);
                    }
                });
            };


            /**
             * POST data
             * @method post
             * @param item
             */
            storage.post = function (item) {
                getData().then(function (data) {
                    data.push(item);
                    postData(data);
                });
            };

            /**
             * PUT data
             * @method put
             * @param item
             */
            storage.put = function (item) {
                getData().then(function (data) {
                    var position = findItemPosition(item, data);
                    // not found, post it
                    if (position === -1) {
                        data.push(item);
                    } else {
                        data[position] = item;
                    }
                    postData(data);
                });
            };

            return storage;
        }

        return storageFactory;
    }]);