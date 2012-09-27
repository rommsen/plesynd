'use strict';

/* Controllers */
todoApp.controller('TodoCtrl', function TodoCtrl($window, $rootScope, $scope, $location, todoService, filterFilter, onlineStatus) {
    function synchronizeTodos() {
        todoService.synchronize(function () {
            $scope.todos = todoService.query(function () {
                $scope.remainingCount = filterFilter($scope.todos, {completed:false}).length;
                $scope.doneCount = filterFilter($scope.todos, {completed:true}).length;
                todoService.notifyParentAboutItems();
            });
            $scope.online_status_string = onlineStatus.getOnlineStatusString();
        });
    }

    synchronizeTodos();
    $scope.newTodo = "";
    $scope.editedTodo = null;

    if ($location.path() === '') {
        $location.path('/');
    }
    $scope.location = $location;

    $scope.$watch('location.path()', function (path) {
        $scope.statusFilter = (path == '/active') ?
        { completed:false } : (path == '/completed') ?
        { completed:true } : null;
    });

    $scope.$on('onlineChanged', synchronizeTodos);

    $scope.$watch('remainingCount == 0', function (val) {
        $scope.allChecked = val;
    });

    $scope.addTodo = function () {
        if ($scope.newTodo.length === 0) return;

        var todo = todoService.createEntity({
            title:$scope.newTodo,
            completed:false
        });

        todoService.post(todo, function () {
            $scope.todos.push(todo);
            $scope.newTodo = '';
            $scope.remainingCount++;
        });
    };

    $scope.editTodo = function (todo) {
        $scope.editedTodo = todo;
    };

    $scope.doneEditing = function (todo) {
        $scope.editedTodo = null;
        if (!todo.title) {
            $scope.removeTodo(todo);
        } else {
            todoService.put(todo);
        }
    };

    $scope.deleteTodo = function (todo) {
        todoService.delete(todo, function () {
            $scope.remainingCount -= todo.completed ? 0 : 1;
            $scope.doneCount -= todo.completed ? 1 : 0;
            $scope.todos.splice($scope.todos.indexOf(todo), 1);
        });
    };

    $scope.todoCompleted = function (todo) {
        todoService.put(todo, function () {
            if (todo.completed) {
                $scope.remainingCount--;
                $scope.doneCount++;
            } else {
                $scope.remainingCount++;
                $scope.doneCount--;
            }
        });
    };

    $scope.clearDoneTodos = function () {
        $scope.todos.forEach(function (todo) {
            if (todo.completed) {
                $scope.deleteTodo(todo);
            }
        });
    };

    $scope.markAll = function (done) {
        $scope.todos.forEach(function (todo) {
            if (todo.completed != done) {
                todo.completed = done;
                $scope.todoCompleted(todo);
            }
        });
    };
});

todoApp.controller('TestCtrl', function TestCtrl($scope) {
    $scope.test = function() {
        var moderator = Widget.preferences.getItem("moderator");
        console.log('Aus dem Widget', moderator);
        moderator = !moderator;
        console.log('neuer Wert', moderator);
        console.log('return aus dem setzen', Widget.preferences.setItem("moderator", moderator));
        console.log('erneutes holen der werte', Widget.preferences.getItem("moderator"));
    }

    $scope.test2 = function() {
        pm({
            target: window.parent,
            type: "message",
            data:{foo:"bar"},
            success: function(data) {
                $(document.body).append(JSON.stringify(data));
            }
        });
    }
});