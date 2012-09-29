'use strict';

var plesynd = angular.module('plesynd', ['ngResource', 'corujaFrameMessenger', 'corujaOnlineStatus', 'corujaResource', 'corujaStorage'])
    .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/dashboard', {templateUrl:'dashboard', controller:'DashboardCtrl',
        resolve:{
            dashboard:function ($q, $route, $timeout) {
                var deferred = $q.defer();

                $timeout(function () {
                    deferred.resolve({
                        'info':'my Dashboard'
                    });
                }, 500);

                return deferred.promise;
            }
        }});
    $routeProvider.when('/workspace/:id', {templateUrl:'workspaceContainer', controller:'WorkspaceCtrl',
        resolve:{
            workspace:function ($q, $route, $timeout, workspaceService) {
                var deferred = $q.defer();

                var id = $route.current.params.id;
                $timeout(function () {
                    workspaceService.get({'id':id}, function (result) {
                        deferred.resolve(result);
                    });
                }, 500);

                return deferred.promise;
            }
        }});
    $routeProvider.otherwise({redirectTo:'/dashboard'});
}])
    .run(function ($rootScope, $window, parentFrameMessenger) {
        parentFrameMessenger.initialize();

        $window.addEventListener("online", function () {
            $rootScope.$broadcast('onlineChanged', true);
        }, true);

        $window.addEventListener("offline", function () {
            $rootScope.$broadcast('onlineChanged', false);
        }, true);
    });
