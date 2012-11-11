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

    // workaround until https://github.com/angular/angular.js/pull/1196 is released
    // (resolve function breaks with anonymous function after minification, need $injector)
    var accountActionResolver  = function ($q, $timeout, $location) {
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

    $routeProvider.when('/account_confirmation/:code', {
        template : ' ',
        controller : 'AccountActionCtrl',
        resolve : { info : accountActionResolver }
    });

    $routeProvider.otherwise({redirectTo : '/'});
}])
    .run(['$rootScope', '$window', 'childFrameMessenger', function ($rootScope, $window, childFrameMessenger) {
        // register with parent system if available
        childFrameMessenger.registerWithParent();

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
