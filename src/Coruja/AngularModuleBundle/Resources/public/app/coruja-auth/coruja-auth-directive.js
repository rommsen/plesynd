'use strict';

Application.Directives.directive('auth', ['$http', '$window', 'authService', 'systemMessageService',
    function ($http, $window, authService, systemMessageService) {
        return {
            restrict : 'C',
            controller : function ($scope, $element, $attrs) {
                var username_key = "username"+$window.name;
                $scope.active_username = sessionStorage.getItem(username_key);

                $scope.authType = 'login';
                $scope.changeAuthType = function () {
                    $scope.authType = $scope.authType === 'login' ? 'register' : 'login';
                };
                $scope.login = function () {
                    $scope.doLogin("Basic " + btoa($scope.username + ":" + $scope.password));
                };

                $scope.logout = function () {
                    delete $http.defaults.headers.common.Authorization;
                    $scope.active_username = null;
                    sessionStorage.removeItem(username_key);
                    $http.get('http://plesynd/app_dev.php/logout');
                    systemMessageService.addSuccessMessage('See you next time');
                    $scope.$emit('event:auth-logoutSuccessful');
                    $scope.$emit('event:auth-loginRequired');
                };

                $scope.doLogin = function (header) {
                    $http.defaults.headers.common.Authorization = header;
                    $http.get('http://plesynd/app_dev.php/login')
                        .success(function () {
                            authService.loginConfirmed();
                            $scope.active_username = $scope.username;
                            sessionStorage.setItem(username_key, $scope.active_username);
                            $scope.username = '';
                            $scope.password = '';
                            systemMessageService.addSuccessMessage('Welcome back ' + $scope.active_username);
                        })
                        .error(function () {
                            delete $http.defaults.headers.common.Authorization;
                            systemMessageService.addErrorMessage('Login with username "' + $scope.username + '" was not successful');
                        });
                };
            },
            link : function (scope, element) {
                var auth = element.find('#auth-container'),
                    content = element.find('#content');

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
                    if (type === 'register') {
                        auth.find('#login').slideUp('slow');
                        auth.find('#register').slideDown('slow');
                    }
                    if (type === 'login') {
                        auth.find('#register').slideUp('slow');
                        auth.find('#login').slideDown('slow');
                    }
                });
            }
        };
    }]);