'use strict';

var plesynd = angular.module('plesynd', ['ngResource', 'corujaResource', 'corujaStorage', 'corujaOnlineStatus'])
    .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/dashboard', {templateUrl: 'dashboard', controller: 'DashboardCtrl'});
    $routeProvider.when('/workspace/:slug', {templateUrl: 'workspaceContainer', controller: 'WorkspaceCtrl'});
    $routeProvider.otherwise({redirectTo: '/dashboard'});
}])
    .run(function ($rootScope, $window) {
        $window.addEventListener("online", function () {
            $rootScope.$broadcast('onlineChanged', true);
        }, true);

        $window.addEventListener("offline", function () {
            $rootScope.$broadcast('onlineChanged', false);
        }, true);
    });
