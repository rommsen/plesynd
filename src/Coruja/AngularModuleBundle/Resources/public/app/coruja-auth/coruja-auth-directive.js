'use strict';

Application.Directives
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

                $scope.logout = function () {
                    $http.defaults.headers.common['Authorization'] = "Basic " + btoa('#' + ":" + '#');
                    $http.get('http://plesynd/app_dev.php/logout');
                    systemMessageService.addSuccessMessage('See you next time');
                    $scope.$emit('event:auth-logoutSuccessful');
                };

                $scope.doLogin = function () {
                    $http.get('http://plesynd/app_dev.php/login')
                        .success(function () {
                            authService.loginConfirmed();
                            $scope.active_username = $scope.username;
                            $scope.username = '';
                            $scope.password = '';
                            systemMessageService.addSuccessMessage('Welcome back ' + $scope.active_username);
                        })
                        .error(function () {
                            systemMessageService.addErrorMessage('Login with username "' + $scope.username + '" was not successful');
                        });
                };
            },
            link:function (scope, element) {
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