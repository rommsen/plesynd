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
    .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/dashboard', {templateUrl : 'partials/dashboard', controller : 'DashboardCtrl',
        resolve                                    : {
            dashboard : function ($q, $route, $timeout) {
                var deferred = $q.defer();

                $timeout(function () {
                    deferred.resolve({
                        'info' : 'my Dashboard'
                    });
                });

                return deferred.promise;
            }
        }});
    $routeProvider.when('/workspace/:id', {templateUrl : 'partials/workspace', controller : 'WorkspaceCtrl',
        resolve                                        : {
            workspace : function ($q, $route, $location, $timeout, workspaceService, systemMessageService) {
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
            }
        }});
    $routeProvider.otherwise({redirectTo : '/dashboard'});
}])
    .run(function ($rootScope, $window, parentFrameMessenger) {
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
    });