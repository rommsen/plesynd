'use strict';

/* Controllers */
todoApp.controller('TodoCtrl', function TodoCtrl($rootScope, $scope, $location, todoService, filterFilter, onlineStatus) {
    function getTodos() {
        return todoService.query(function () {
            $scope.remainingCount = filterFilter($scope.todos, {completed:false}).length;
            $scope.doneCount = filterFilter($scope.todos, {completed:true}).length;
        });
    }

    $scope.newTodo = "";
    $scope.editedTodo = null;
    $scope.todos = getTodos();
    $scope.online_status_string = onlineStatus.getOnlineStatusString();

    if ($location.path() === '') {
        $location.path('/');
    }
    $scope.location = $location;

    $scope.$watch('location.path()', function (path) {
        $scope.statusFilter = (path == '/active') ?
        { completed:false } : (path == '/completed') ?
        { completed:true } : null;
    });

    $scope.$on('onlineChanged', function (evt, isOnline) {
        todoService.synchronize(function () {
            $scope.todos = getTodos();
            $scope.online_status_string = onlineStatus.getOnlineStatusString();
        });
    });

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