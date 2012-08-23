'use strict';

// Declare app level module which depends on filters, and services
var todoApp = angular.module('todoApp', ['ngResource', 'storage'])
    .run(function ($rootScope, $window) {
        $window.addEventListener("online", function () {
            $rootScope.$broadcast('onlineChanged', true);
        }, true);

        $window.addEventListener("offline", function () {
            $rootScope.$broadcast('onlineChanged', false);
        }, true);
    });
