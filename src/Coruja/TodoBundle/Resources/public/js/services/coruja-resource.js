'use strict';

angular.module('corujaResource', []).factory('resourceService', ["$q", "$timeout", "$resource", "localStorage", "onlineStatus",
    function ($q, $timeout, $resource, localStorage, onlineStatus) {
        function resourceFactory(config) {
            var remoteResource = config.remoteResource;
            var localResource = config.localResource;
            var localResourceAdded = config.localResourceAdded;
            var localResourceChanged = config.localResourceChanged;
            var localResourceDeleted = config.localResourceDeleted;
            var entityFactory = config.entityFactory;

//            localResource.storeData([]);
//            localResourceAdded.storeData([]);
//            localResourceChanged.storeData([]);
//            localResourceDeleted.storeData([]);

            var localIdPrefix = 'local_';

            var forEach = angular.forEach,
                noop = angular.noop;

            function deleteUnnecessaryProperties(object) {
                var strippedObject = {};
                for (var property in object) {
                    if (property.charAt(0) != '$') {
                        strippedObject[property] = object[property];
                    }
                }
                return strippedObject;
            }

            function synchronizeData(success) {
                $q.all([synchronizeAdded(), synchronizeDeleted(), synchronizeUpdated()]).then(function () {
                    (success || noop)();
                });
            }

            function synchronizeAdded() {
                var deferred = $q.defer();
                localResourceAdded.query(function (data) {
                    forEach(data, function (item) {
                        // id war nur lokal und darf nicht mit übertragen werden
                        delete item.id;
                        resource.post(item);
                        localResourceAdded.delete(item);
                    });
                    $timeout(function () {
                        deferred.resolve(data);
                    });
                });
                return deferred.promise
            }

            function synchronizeUpdated() {
                var deferred = $q.defer();
                localResourceChanged.query(function (data) {
                    forEach(data, function (item) {
                        resource.put(item);
                        localResourceChanged.delete(item);
                    });
                    $timeout(function () {
                        deferred.resolve(data);
                    });
                });
                return deferred.promise
            }

            function synchronizeDeleted() {
                var deferred = $q.defer();
                localResourceDeleted.query(function (data) {
                    forEach(data, function (item) {
                        resource.delete(item);
                        localResourceDeleted.delete(item);
                    });
                    $timeout(function () {
                        deferred.resolve(data);
                    });
                });
                return deferred.promise
            }

            var resource = {};

            resource.query = function (success) {
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
                    // falls remote nicht geklappt hat, dies ist das error Callback
                    localResource.query(resolveQueryDeferred);
                });

                promise.then(function (data) {
                    // sorge dafür, dass alle Objekte vom richtigen Typ sind und nicht Ressourcen
                    forEach(data, function (item) {
                        items.push(entityFactory(deleteUnnecessaryProperties(item)));
                    });
                    localResource.storeData(items);
                    (success || noop)(items);
                });
                return items;
            };

            resource.post = function (item, success) {
                if (onlineStatus.isOnline()) {
                    remoteResource.post(item, function (t, header) {
                        var location = header('Location');
                        item.id = location.substring(location.lastIndexOf('/') + 1);
                        localResource.post(item);

                    });
                } else {
                    localResource.query(function (data) {
                        item.id = localIdPrefix + data.length;
                        localResource.post(item);
                        localResourceAdded.post(item);
                    });
                }
                (success || noop)(item)
            };

            resource.put = function (item, success) {
                if (onlineStatus.isOnline()) {
                    remoteResource.put(item, function () {
                        localResource.put(item);
                        (success || noop)(item);
                    });
                } else {
                    // speicher in lokale Resource
                    localResource.put(item);
                    if (String(item.id).substr(0, localIdPrefix.length) == localIdPrefix) {
                        // war nur lokal deshalb muss sie im added Bereich geändert werden
                        localResourceAdded.put(item);
                    } else {
                        // war remote, deshalb muss sie geändert werden
                        localResourceChanged.put(item);
                    }
                    (success || noop)(item);
                }
            };

            resource.delete = function (item, success) {
                if (onlineStatus.isOnline()) {
                    // remoteResource.delete(item, ... geht nicht
                    new remoteResource(item).$delete(function () {
                        localResource.delete(item);
                        (success || noop)(item);
                    });
                } else {
                    localResource.delete(item);
                    if (String(item.id).substr(0, localIdPrefix.length) == localIdPrefix) {
                        // war nur lokal, deshalb braucht sie nicht mehr hinzugefügt werden
                        localResourceAdded.delete(item);
                    } else {
                        // war remote deshalb muss sie gelöscht werden
                        localResourceDeleted.put(item);
                        // war remote deshalb muss sie aus dem changed entfernt werden
                        localResourceChanged.delete(item);
                    }
                    (success || noop)(item);
                }
            };

            resource.synchronize = function (success) {
                if (onlineStatus.isOnline()) {
                    synchronizeData(success);
                } else {
                    (success || noop)();
                }
            }
            return resource;
        }

        return resourceFactory;
    }]);

//    // this ist in diesem Fall keine Instanz von Resource
//    remoteResource.save([{'title': 'dingdong', 'completed' : false}]);

//    var bla = new remoteResource({'title': 'dingdong', 'completed' : false});
//      //  this ist in diesem Fall eine Instanz von Resource
//    bla.$save();


/*
 was brauche ich: eine Funktionalität, die in der Lage ist zu prüfen, ob das System online ist oder nicht
 wenn ja, soll das $resource Zeug benutzt werden, wenn nicht das offline zeug. Nach außen hin, soll die
 Benutzung aber vollkommen transparent sein. Das bedeutet, dass im Controller einfach
 var todo = new Todo(data) gesagt wird und dann mit todo.$save() gearbeitet werden kann.
 das System muss dann entscheiden was passiert. Wenn das System offline ist, müssen die Requests irgendwie
 zwischengespeichert werden und bei einem Wechsel auf online müssen die Sachen abgeschickt werden.

 wenn das system offline ist:

 löschen: lösche aus localstorage und schreibe in eigenen LocalStorage für die gelöschten
 hinzufügen: füge in LocalStorage hinzu, erzeuge eine künstliche ID und schreibe in extra localStorage für neue Einträge
 Bearbeiten: bearbeite in normalem Storage und füge in extra storage für bearbeitete Einträge ein. Wenn der Eintrag in
 den neuen zu finden ist, füge ihn nicht in die bearbeiteten ein, sondern ersetze den alten neuen durch den neuen neuen
 */

/**
 * Resource Objekte haben $ Methoden, z.B. $save. Diese sollen nicht im Entity vorkommen
 * @param object
 * @return {Object}
 */