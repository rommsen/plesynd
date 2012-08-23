'use strict';

angular.module('storage', [])
    .factory('localStorage', ["$timeout", "$q", function ($timeout, $q) {

    var copy = angular.copy,
        forEach = angular.forEach,
        toJson = angular.toJson,
        fromJson = angular.fromJson,
        noop = angular.noop;


    function storageFactory(storage_id) {
        function getData() {
            var deferred = $q.defer();

            // es muss kein $apply aufgerufen werden, da $timeout
            // dies erledigt wenn sein defer resolved wird
            $timeout(function () {
                deferred.resolve(fromJson(localStorage.getItem(storage_id) || '[]'));
            });

            return deferred.promise;
        }

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

        storage.query = function (success) {
            var value = [];
            getData().then(function (data) {
                copy(data, value);
                // rufe die Success Methode auf, die im Controller
                // als Callback mitgegeben werden kann
                success(value);
            });

            // gib hier nicht das promise Objekt sondern die Referenz auf value zurück,
            // wenn die Promise resolved wird, wird value im then gefüllt
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
                if(position == -1) {
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