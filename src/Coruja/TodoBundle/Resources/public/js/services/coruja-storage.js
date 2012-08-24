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
                    if (item.id == storedItem.id) {
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
             * @param success callback
             * @return {Array}
             */
            storage.query = function (success) {
                var value = [];
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
                    data.splice(findItemPosition(item, data), 1);
                    postData(data)
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
                    if (position == -1) {
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