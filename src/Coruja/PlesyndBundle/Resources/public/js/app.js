'use strict';

var plesynd = angular.module('plesynd', ['ngResource', 'corujaResource', 'corujaStorage', 'corujaOnlineStatus'])
    .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/dashboard', {templateUrl:'dashboard', controller:'DashboardCtrl',
        resolve:{
            dashboard : function ($q, $route, $timeout) {
                var deferred = $q.defer();

                $timeout(function() {
                    deferred.resolve({
                        'info': 'my Dashboard'
                        });
                }, 1000);

                return deferred.promise;
            }
        }});
    $routeProvider.when('/workspace/:id', {templateUrl:'workspaceContainer', controller:'WorkspaceCtrl',
        resolve:{
            workspace : function ($q, $route, $timeout, workspaceService) {
                var deferred = $q.defer();

                var id = $route.current.params.id;
                 $timeout(function() {
                workspaceService.get({'workspaceId':id}, function(result) {
                    deferred.resolve(result);
                }); }, 1000);

                return deferred.promise;
            }
        }});
    $routeProvider.otherwise({redirectTo:'/dashboard'});
}])
    .run(function ($rootScope, $window) {
        pm.bind("message", function(data) {
            console.log(data, $('#yo'));
            return {hello:"world"};
        });
        console.log($('#yo'));


        $window.addEventListener("online", function () {
            $rootScope.$broadcast('onlineChanged', true);
        }, true);

        $window.addEventListener("offline", function () {
            $rootScope.$broadcast('onlineChanged', false);
        }, true);
    });
