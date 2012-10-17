'use strict';

angular.module('corujaAuth', ['http-auth-interceptor'])
    .directive('auth', function ($http, authService, systemMessageService) {
        return {
            restrict:'C',
            controller:function ($scope, $element, $attrs) {
                $scope.authType = 'login'
                $scope.changeAuthType = function () {
                    $scope.authType = $scope.authType == 'login' ? 'register' : 'login';
                };
                $scope.login = function () {
                    $http.defaults.headers.common['Authorization'] = "Basic " + btoa($scope.username + ":" + $scope.password);
                    $scope.doLogin();
                };

                $scope.doLogin = function () {
                    $http.get('login')
                        .success(function () {
                            authService.loginConfirmed();
                            $scope.active_username = $scope.username;
                            $scope.username = '';
                            $scope.password = '';
                            $scope.is_authenticated = true;
                            systemMessageService.addSuccessMessage('Welcome back ' + $scope.active_username);
                        })
                        .error(function () {
                            systemMessageService.addErrorMessage('Login with username "' + $scope.username + '" was not successful');
                        });
                };
            },
            link:function (scope, element) {
                console.log('yo');
                var auth = element.find('#auth-container');
                var auth = element.find('#auth-container');
                var content = element.find('#content');

                auth.hide();

                scope.$on('event:auth-loginRequired', function () {
                    content.hide();
                    auth.slideDown('slow');
                });
                scope.$on('event:auth-loginConfirmed', function () {
                    content.show();
                    auth.slideUp();
                });

                scope.$watch('authType', function (type) {
                    if (type == 'register') {
                        auth.find('#login').slideUp('slow');
                        auth.find('#register').slideDown('slow');
                    }
                    if (type == 'login') {
                        auth.find('#register').slideUp('slow');
                        auth.find('#login').slideDown('slow');
                    }
                });
            }
        }
    })