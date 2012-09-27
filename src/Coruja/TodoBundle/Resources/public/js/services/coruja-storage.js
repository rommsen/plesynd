'use strict';

angular.module('corujaStorage', []).factory('localStorage', ["$timeout", "$q",
    function ($timeout, $q) {
        var copy = angular.copy,
            forEach = angular.forEach,
            toJson = angular.toJson,
            fromJson = angular.fromJson,
            noop = angular.noop;


        function storageFactory(storage_id) {
            /**
             * Gets the data from localStorage.
             * Uses deferred to make it integrate with ngResource
             * @return $q.defer().promise
             */
            function getData() {
                var deferred = $q.defer();

                $timeout(function () {
                    deferred.resolve(fromJson(localStorage.getItem(storage_id) || '[]'));
                });

                return deferred.promise;
            }

            /**
             * Uses the id property of the item to find its position
             * @param item
             * @param data
             * @return {Number}
             */
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
             * Queries the localStorage. Does not return a promise but the value array. This makes it
             * compatible with ngResource
             *
             * @param a1 callback or params object TODO maybe we can use params to filter the results
             * @param a2 params object or undefined
             * @return {Array}
             */
            storage.query = function (a1, a2) {
                var value = [];
                var params;
                var success;
                // necessary to be compatible with ngResource, params can be first parameter
                switch(arguments.length) {
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

            storage.storeData = function (data) {
                postData(data);
            };

            storage.delete = function (item) {
                getData().then(function (data) {
                    var position = findItemPosition(item, data);
                    if (position !== -1) {
                        data.splice(position, 1);
                        postData(data)
                    }
                });
            };

            storage.post = function (item) {
                getData().then(function (data) {
                    data.push(item);
                    postData(data);
                });
            };

            storage.put = function (item) {
                getData().then(function (data) {
                    var position = findItemPosition(item, data);
                    // not found, post it
                    if (position === -1) {
                        data.push(item);
                    } else {
                        data[position] = item;
                    }
                    postData(data)
                });
            };

            return storage;
        }

        return storageFactory;
    }]);