'use strict';

/* Controllers */
todoApp.controller('TodoCtrl', function TodoCtrl($window, $rootScope, $http, $scope, $location, todoListService, todoService, filterFilter, systemMessageService) {
    var todoListIdLocalStorageKey = "activeTodoListId"+$window.name;
    var forEach = angular.forEach;
    var fromJson = angular.fromJson;
    var toJson = angular.toJson;

    $scope.synchronize = function() {
        todoListService.synchronize(function () {
            $scope.todoLists = todoListService.query(function() {
                forEach($scope.todoLists, function(todoList) {
                    if(todoList.id == $scope.activeListId) {
                        $scope.activeTodoList = todoList;
                    }
                });
            });
            todoService.synchronize(function () {
                // todos are synchronized after the lists are synchronized
                $scope.todos = todoService.query(function () {
                    todoService.notifyParentAboutItems();
                });
            });
        });
    };

    $scope.prepareActiveTodos = function () {
        if($scope.todos && $scope.activeTodoList) {
            localStorage.setItem(todoListIdLocalStorageKey, toJson($scope.activeTodoList.id));
            $scope.activeTodos = filterFilter($scope.todos,  $scope.filterByActiveTodoList);
            $scope.remainingCount = filterFilter($scope.activeTodos, {completed:false}).length;
            $scope.doneCount = filterFilter($scope.activeTodos, {completed:true}).length;
        }
    };

    $scope.activeListId = fromJson(localStorage.getItem(todoListIdLocalStorageKey) || '[]');
    $scope.synchronize();

    $scope.newTodo = "";
    $scope.editedTodo = null;
    $scope.allDone = false;

    if ($location.path() === '') {
        $location.path('/');
    }
    $scope.location = $location;

    $scope.$watch('location.path()', function (path) {
        $scope.statusFilter = (path == '/active') ?
        { completed:false } : (path == '/completed') ?
        { completed:true } : null;
    });

    $scope.filterByActiveTodoList = function (todo) {
        if($scope.activeTodoList) {
            return todo.todo_list.id == $scope.activeTodoList.id;
        }
        return false;
    };

    $scope.$watch('activeTodoList', $scope.prepareActiveTodos);
    $scope.$watch('todos', $scope.prepareActiveTodos, true);
    $scope.$on('onlineChanged', $scope.synchronize);

    $scope.$watch('remainingCount == 0', function (val) {
        $scope.allChecked = val;
    });

    $scope.addTodo = function () {
        if ($scope.newTodo.length === 0) return;

        var todo = todoService.createEntity({
            title : $scope.newTodo,
            completed : false,
            todo_list : {id: $scope.activeTodoList.id}
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
        todo.completed = !todo.completed;
        // no need to change doneCount and remainingCount because todos are being watched
        todoService.put(todo);
    };

    $scope.clearDoneTodos = function () {
        $scope.todos.forEach(function (todo) {
            if(todo.completed) {
                $scope.deleteTodo(todo);
            }
        });
    };

    $scope.toggleAll = function () {
        $scope.activeTodos.forEach(function (todo) {
            if(todo.completed != $scope.allChecked) {
                $scope.todoCompleted(todo);
            }
        });
    };

    $scope.addTodoList = function () {
        $scope.add_todo_list = false;
        if ($scope.newTodoList.length === 0) return;

        var todoList = todoListService.createEntity({
            title : $scope.newTodoList
        });

        todoListService.post(todoList, function () {
            $scope.todoLists.push(todoList);
            $scope.newTodoList = '';
        });
    };

    $scope.deleteTodoList = function (todoList) {
        todoListService.delete(todoList, function () {
            $scope.todoLists.splice($scope.todoLists.indexOf(todoList), 1);
            $scope.activeTodoList = null;
            $scope.edit_todo_list = false;
        });
    };

    $scope.editTodoList = function(todoList) {
        $scope.edit_todo_list = false;
        if (todoList.title.length === 0) return;
        todoListService.put(todoList);
    };

    $scope.changeFilter = function (filter) {
        $location.path(filter);
    };

    $scope.logout = function () {
        //$scope.activeTodoList = null;
        $http.defaults.headers.common['Authorization'] = "Basic " + btoa('#' + ":" + '#');
        $http.get('plesynd/api/logout');
        systemMessageService.addSuccessMessage('See you next time');
    };
});