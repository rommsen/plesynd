'use strict';

var todoApp = angular.module('todoApp', ['ngResource', 'corujaAuth', 'corujaFrameMessenger', 'corujaOnlineStatus', 'corujaMessageContainer', 'corujaSystemMessageService', 'corujaRemoteForm', 'corujaResource', 'corujaStorage'])
    .value('todo_resource_uri', 'http://plesynd/app_dev.php/todo/api/todos/:todoId')
    .value('todo_list_resource_uri', 'http://plesynd/app_dev.php/todo/api/lists/:todoListId')
    .run(function ($rootScope, $window, childFrameMessenger) {
        // register with parent system if available
        childFrameMessenger.registerWithParent();

        $window.addEventListener("online", function () {
            $rootScope.$broadcast('onlineChanged', true);
        }, true);

        $window.addEventListener("offline", function () {
            $rootScope.$broadcast('onlineChanged', false);
        }, true);
    });
