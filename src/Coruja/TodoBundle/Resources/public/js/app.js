'use strict';

var todoApp = angular.module('todoApp', ['ngResource', 'corujaResource', 'corujaStorage', 'corujaOnlineStatus'])
    .run(function ($rootScope, $window) {
        $window.addEventListener("online", function () {
            $rootScope.$broadcast('onlineChanged', true);
        }, true);

        $window.addEventListener("offline", function () {
            $rootScope.$broadcast('onlineChanged', false);
        }, true);
    });
