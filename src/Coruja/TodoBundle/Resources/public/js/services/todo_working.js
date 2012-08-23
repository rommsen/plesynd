/**
 * Todo Rest Ressource
 */
todoApp.factory('Todo', ["$q", "$timeout", "$resource", "$rootScope", "LocalStorage", "onlineStatus",
    function ($q, $timeout, $resource, $rootScope, LocalStorage, onlineStatus) {
        var RemoteResource = $resource('todo/api/todos/:todoId', {todoId:'@id'}, {
            put:{method:'PUT' },
            post:{method:'POST' }
        });

        var localResource = LocalStorage('todos');
        var localResourceAdded = LocalStorage('todos.added');
        var localResourceChanged = LocalStorage('todos.changed');
        var localResourceDeleted = LocalStorage('todos.deleted');

        localResource.storeData([]);
        localResourceAdded.storeData([]);
        localResourceChanged.storeData([]);
        localResourceDeleted.storeData([]);

        var localIdPrefix = 'local_';

        var copy = angular.copy,
            forEach = angular.forEach,
            noop = angular.noop;

//    // this ist in diesem Fall keine Instanz von Resource
//    RemoteResource.save([{'title': 'dingdong', 'completed' : false}]);

//    var bla = new RemoteResource({'title': 'dingdong', 'completed' : false});
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
            $q.all([synchronizeAdded(), synchronizeDeleted(), synchronizeUpdated()]).then(function() {
                console.log('all resolved');
                (success || noop)();
            });
        }

        function synchronizeAdded() {
            var deferred = $q.defer();
            localResourceAdded.query(function (data) {
                forEach(data, function(item) {
                    // id war nur lokal und darf nicht mit übertragen werden
                    delete item.id;
                    Todo.post(item);
                    localResourceAdded.delete(item);
                });
                $timeout(function () {
                    console.log('resolve added');
                    deferred.resolve(data);
                }, 0);
            });
            return deferred.promise
        }


        function synchronizeUpdated() {
            var deferred = $q.defer();
            localResourceChanged.query(function (data) {
                forEach(data, function(item) {
                    Todo.put(item);
                    localResourceChanged.delete(item);
                });
                $timeout(function () {
                    console.log('resolve updated');
                    deferred.resolve(data);
                }, 0);
            });
            return deferred.promise
        }

        function synchronizeDeleted() {
            var deferred = $q.defer();
            localResourceDeleted.query(function (data) {
                forEach(data, function(item) {
                    Todo.delete(item);
                    localResourceDeleted.delete(item);
                });
                $timeout(function () {
                    console.log('resolve deleted');
                    deferred.resolve(data);
                }, 0);
            });
            return deferred.promise
        }

        var Todo = function (data) {
            copy(data || {}, this);
        }

        Todo.query = function (success) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            var todos = [];

            function resolveQueryDeferred(data) {
                $timeout(function () {
                    deferred.resolve(data);
                }, 0);
            }

            var resource = onlineStatus.isOnline() ? RemoteResource : localResource;
            resource.query(resolveQueryDeferred, function () {
                // falls remote nicht geklappt hat, dies ist das error Callback
                localResource.query(resolveQueryDeferred);
            });

            promise.then(function (data) {
                // sorge dafür, dass alle Objekte Todos sind und nicht Ressourcen
                forEach(data, function (item) {
                    todos.push(new Todo(deleteUnnecessaryProperties(item)));
                });
                localResource.storeData(todos);
                (success || noop)(todos);
            });
            return todos;
        };

        Todo.post = function (todo, success) {
            if (onlineStatus.isOnline()) {
                var resourceTodo = new RemoteResource(todo);
                resourceTodo.$post(function (t, header) {
                    var location = header('Location');
                    todo.id = location.substring(location.lastIndexOf('/') + 1);
                    localResource.post(todo);

                });
            } else {
                localResource.query(function (data) {
                    todo.id = 'local_' + data.length;
                    localResource.post(todo);
                    localResourceAdded.post(todo);
                });
            }
            (success || noop)(todo)
        };

        Todo.put = function (todo, success) {
            if (onlineStatus.isOnline()) {
                new RemoteResource(todo).$put(function () {
                    localResource.put(todo);
                    (success || noop)(todo);
                });
            } else {
                // speicher in lokale Resource
                localResource.put(todo);
                if (String(todo.id).substr(0, localIdPrefix.length) == localIdPrefix) {
                    // war nur lokal deshalb muss sie im added Bereich geändert werden
                    localResourceAdded.put(todo);
                } else {
                    // war remote, deshalb muss sie geändert werden
                    localResourceChanged.put(todo);
                }
                (success || noop)(todo);
            }
        };

        Todo.delete = function (todo, success) {
            if (onlineStatus.isOnline()) {
                new RemoteResource(todo).$delete(function () {
                    localResource.delete(todo);
                    (success || noop)(todo);
                });
            } else {
                localResource.delete(todo);
                if (String(todo.id).substr(0, localIdPrefix.length) == localIdPrefix) {
                    // war nur lokal, deshalb braucht sie nicht mehr hinzugefügt werden
                    localResourceAdded.delete(todo);
                } else {
                    // war remote deshalb muss sie gelöscht werden
                    localResourceDeleted.put(todo);
                    // war remote deshalb muss sie aus dem changed entfernt werden
                    localResourceChanged.delete(todo);
                }
                (success || noop)(todo);
            }
        };

        Todo.synchronizeWithRemote = function(success) {
            if (onlineStatus.isOnline()) {
                synchronizeData(success);
            } else {
                (success || noop)();
            }
        }

        return Todo;
    }]);