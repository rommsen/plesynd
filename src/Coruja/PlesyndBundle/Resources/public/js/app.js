'use strict';

var plesynd = angular.module('plesynd', ['ngResource', 'corujaFrameMessenger', 'corujaOnlineStatus', 'corujaRemoteForm', 'corujaResource', 'corujaStorage', 'http-auth-interceptor'])
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
/**
 * This directive will find itself inside HTML as a class,
 * and will remove that class, so CSS will remove loading image and show app content.
 * It is also responsible for showing/hiding login form.
 */
    .directive('auth', function() {
        return {
            restrict: 'C',
            link: function(scope, elem, attrs) {
                //once Angular is started, remove class:
                elem.removeClass('waiting-for-angular');

                var login = elem.find('#login-holder');
                var main = elem.find('#content');

                login.hide();

                scope.$on('event:auth-loginRequired', function() {
                    login.slideDown('slow', function() {
                        main.hide();
                    });
                });
                scope.$on('event:auth-loginConfirmed', function() {
                    main.show();
                    login.slideUp();
                });
            }
        }
    })

    .run(function ($rootScope, $window, parentFrameMessenger) {
        parentFrameMessenger.initialize();

        $window.addEventListener("online", function () {
            $rootScope.$broadcast('onlineChanged', true);
        }, true);

        $window.addEventListener("offline", function () {
            $rootScope.$broadcast('onlineChanged', false);
        }, true);
    });
