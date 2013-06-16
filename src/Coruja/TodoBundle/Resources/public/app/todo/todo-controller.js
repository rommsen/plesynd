'use strict';

/**
 * TodoWidget Controllers
 *
 * @module Plesynd.Controllers
 */

/**
 * Main Controller of the widget
 *
 * @class TodoCtrl
 */
Application.Controllers.controller('TodoCtrl', ['$window', '$rootScope', '$http', '$scope', '$location', 'onlineStatus', 'todoListService', 'todoService', 'filterFilter', 'confirmationService',
    /**
     * @method Factory
     * @param $window
     * @param $rootScope
     * @param $http
     * @param $scope
     * @param $location
     * @param onlineStatus
     * @param todoListService
     * @param todoService
     * @param filterFilter
     * @param confirmationService
     */
    function ($window, $rootScope, $http, $scope, $location, onlineStatus, todoListService, todoService, filterFilter, confirmationService) {
        var todoListIdLocalStorageKey = "activeTodoListId" + $window.name,
            forEach = angular.forEach,
            fromJson = angular.fromJson,
            toJson = angular.toJson;

        /**
         * Synchronizes the Todo-Items and the lists with the backend
         * @method synchronize
         */
        $scope.synchronize = function () {
            $scope.todoLists = todoListService.query(function () {
                forEach($scope.todoLists, function (todoList) {
                    if (todoList.id == $scope.activeListId) {
                        $scope.activeTodoList = todoList;
                    }
                });
            });
            todoService.synchronize(function () {
                $scope.todos = todoService.query(function () {
                    todoService.notifyParentAboutItems();
                });
            });
        };

        /**
         * Counts the different todo-types based on the active todos
         * @method prepareActiveTodos
         */
        $scope.prepareActiveTodos = function () {
            if ($scope.todos && $scope.activeTodoList) {
                localStorage.setItem(todoListIdLocalStorageKey, toJson($scope.activeTodoList.id));
                $scope.activeTodos = filterFilter($scope.todos, $scope.filterByActiveTodoList);
                $scope.remainingCount = filterFilter($scope.activeTodos, {completed : false}).length;
                $scope.doneCount = filterFilter($scope.activeTodos, {completed : true}).length;
            }
        };

        $scope.activeListId = fromJson(localStorage.getItem(todoListIdLocalStorageKey) || '[]');
        $scope.isOnline = onlineStatus.isOnline();
        $scope.synchronize();
        todoService.notifyParentAboutItems();

        $scope.newTodo = "";
        $scope.editedTodo = null;
        $scope.allDone = false;

        if ($location.path() === '') {
            $location.path('/');
        }
        $scope.location = $location;

        $scope.$watch('location.path()', function (path) {
            $scope.statusFilter = (path === '/active') ?
            { completed : false } : (path === '/completed') ?
            { completed : true } : null;
        });

        /**
         * Filter which returns true when a todo-item is visible
         * @method filterByActiveTodoList
         * @param todo
         * @returns {boolean}
         */
        $scope.filterByActiveTodoList = function (todo) {
            if ($scope.activeTodoList) {
                return todo.todo_list.id == $scope.activeTodoList.id;
            }
            return false;
        };

        $scope.$watch('activeTodoList', $scope.prepareActiveTodos);

        $scope.$watch('todos', $scope.prepareActiveTodos, true);
        /**
         * Called when the online status of the widget has changed
         * @method onlineChanged Event-Listener
         */
        $rootScope.$on('onlineChanged', function (evt, isOnline) {
            $scope.isOnline = isOnline;
            $scope.synchronize();
        });
        $rootScope.$on('event:auth-loginConfirmed', $scope.synchronize);
        $rootScope.$on('event:auth-logoutSuccessful', function () {
            $scope.todos = null;
            $scope.activeTodoList = null;
            todoService.resetLocal();
            todoListService.resetLocal();
            localStorage.setItem(todoListIdLocalStorageKey, toJson(''));
        });

        $scope.$watch('remainingCount == 0', function (val) {
            $scope.allChecked = val;
        });

        /**
         * @method addTodo
         */
        $scope.addTodo = function () {
            if ($scope.newTodo.length === 0) {
                return;
            }

            var todo = todoService.createEntity({
                title : $scope.newTodo,
                completed : false,
                todo_list : {id : $scope.activeTodoList.id}
            });

            todoService.post(todo, function () {
                $scope.todos.push(todo);
                $scope.newTodo = '';
                $scope.remainingCount += 1;
            });
        };

        /**
         * Edits an item
         * @method editTodo
         * @param todo
         */
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

        /**
         * Deletes on item
         * @method deleteTodo
         * @param todo
         */
        $scope.deleteTodo = function (todo) {
            todoService.delete(todo, function () {
                $scope.remainingCount -= todo.completed ? 0 : 1;
                $scope.doneCount -= todo.completed ? 1 : 0;
                $scope.todos.splice($scope.todos.indexOf(todo), 1);
            });
        };

        /**
         * Toggles completed property of one items
         * @method toggleAll
         * @param todo
         */
        $scope.todoCompleted = function (todo) {
            todo.completed = !todo.completed;
            // no need to change doneCount and remainingCount because todos are being watched
            todoService.put(todo);
        };

        /**
         * @method clearDoneTodos
         */
        $scope.clearDoneTodos = function () {
            $scope.todos.forEach(function (todo) {
                if (todo.completed) {
                    $scope.deleteTodo(todo);
                }
            });
        };

        /**
         * Toggles completed property of all items
         * @method toggleAll
         */
        $scope.toggleAll = function () {
            $scope.activeTodos.forEach(function (todo) {
                if (todo.completed != $scope.allChecked) {
                    $scope.todoCompleted(todo);
                }
            });
        };

        /**
         * @method addTodoList
         */
        $scope.addTodoList = function () {
            $scope.add_todo_list = false;
            if ($scope.newTodoList.length === 0) {
                return;
            }

            var todoList = todoListService.createEntity({
                title : $scope.newTodoList
            });

            todoListService.post(todoList, function () {
                $scope.todoLists.push(todoList);
                $scope.newTodoList = '';
                $scope.activeTodoList = todoList;
            });
        };

        /**
         * @method deleteTodoList
         * @param {Object} todoList
         */
        $scope.deleteTodoList = function (todoList) {
            confirmationService.confirm('Do you really want to delete this list?', function () {
                todoListService['delete'](todoList, function () {
                    $scope.todoLists.splice($scope.todoLists.indexOf(todoList), 1);
                    $scope.activeTodoList = null;
                    $scope.edit_todo_list = false;
                    $scope.synchronize();
                });
            });
        };

        /**
         * @method editTodoList
         * @param {Object} todoList
         */
        $scope.editTodoList = function (todoList) {
            $scope.edit_todo_list = false;
            if (todoList.title.length === 0) {
                return;
            }
            todoListService.put(todoList);
        };

        $scope.changeFilter = function (filter) {
            $location.path(filter);
        };
    }]);