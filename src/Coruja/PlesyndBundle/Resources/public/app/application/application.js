'use strict';

/**
 * The application file bootstraps the angular app by initializing the main module and
 * creating namespaces and moduled for controllers, filters, services, and directives.
 */

var Application = Application || {};

Application.Constants = angular.module('application.constants', []);
Application.Controllers = angular.module('application.controllers', []);
Application.Filters = angular.module('application.filters', []);
Application.Services = angular.module('application.services', ['ngResource']);
Application.Directives = angular.module('application.directives', ['http-auth-interceptor']);


angular.module('application', ['ui', 'application.constants', 'application.controllers', 'application.filters', 'application.services', 'application.directives'])
    .config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {

    // Send cookies with request by default
    $httpProvider.defaults.withCredentials = true;

    // workaround until https://github.com/angular/angular.js/pull/1196 is released
    // (resolve function breaks with anonymous function after minification, need $injector)
    var dashboardResolver,
        workspaceResolver,
        accountActionResolver;

    dashboardResolver = function ($q, $timeout) {
        var deferred = $q.defer();

        $timeout(function () {
            deferred.resolve({});
        });

        return deferred.promise;
    };

    dashboardResolver.$inject = ['$q', '$timeout'];

    workspaceResolver = function ($q, $route, $location, $timeout, workspaceService, systemMessageService) {
        var deferred = $q.defer(),
            id = $route.current.params.id;
        $timeout(function () {
            workspaceService.get({'id' : id}, function (result) {
                    deferred.resolve(result);
                },
                function () {
                    systemMessageService.addErrorMessage('Workspace not found');
                    $location.path('/dashboard');
                });
        }, 500);

        return deferred.promise;
    };

    workspaceResolver.$inject = ['$q', '$route', '$location', '$timeout', 'workspaceService', 'systemMessageService'];

    accountActionResolver = function ($q, $timeout, $location) {
        var deferred = $q.defer(),
            path = $location.path();

        $timeout(function () {
            deferred.resolve({
                'action' : path.substr(0, path.lastIndexOf('/'))
            });
        });

        return deferred.promise;
    };

    accountActionResolver.$inject = ['$q', '$timeout', '$location'];

    $routeProvider.when('/dashboard', {
        templateUrl : 'partials/dashboard',
        controller : 'DashboardCtrl',
        resolve : { dashboard : dashboardResolver }});

    $routeProvider.when('/workspace/:id', {
        templateUrl : 'partials/workspace',
        controller : 'WorkspaceCtrl',
        resolve : { workspace : workspaceResolver }
    });

    $routeProvider.when('/account_confirmation/:code', {
        template : ' ',
        controller : 'AccountActionCtrl',
        resolve : { info : accountActionResolver }
    });

    $routeProvider.otherwise({redirectTo : '/dashboard'});
}]).run(['$rootScope', '$window', 'parentFrameMessenger',
    function ($rootScope, $window, parentFrameMessenger) {
        parentFrameMessenger.initialize();

        $window.addEventListener("online", function () {
            $rootScope.$apply(function () {
                $rootScope.$broadcast('onlineChanged', true);
            });
        }, true);

        $window.addEventListener("offline", function () {
            $rootScope.$apply(function () {
                $rootScope.$broadcast('onlineChanged', false);
            });
        }, true);
    }]);