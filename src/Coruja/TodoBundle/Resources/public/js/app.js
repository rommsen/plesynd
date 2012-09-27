'use strict';

var todoApp = angular.module('todoApp', ['ngResource', 'corujaFrameMessenger', 'corujaOnlineStatus', 'corujaResource', 'corujaStorage'])
    .value('todo_ressource_uri', 'http://plesynd/app_dev.php/todo/api/todos/:todoId')
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
