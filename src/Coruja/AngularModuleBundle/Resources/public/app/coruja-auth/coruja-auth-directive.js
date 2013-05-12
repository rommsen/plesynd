'use strict';

/**
 * Angular Directives
 *
 * @module Application.Directives
 */

/**
 * Handles authentication (login/logout)
 *
 * @class auth
 */
Application.Directives.directive('auth', ['$http', '$window', 'configuration', 'authService', 'systemMessageService',
    /**
     * @method Factory
     * @param $http
     * @param $window
     * @param configuration
     * @param authService
     * @param systemMessageService
     * @returns {{restrict: string, controller: Array, link: Function}}
     */
    function ($http, $window, configuration, authService, systemMessageService) {
        return {
            restrict : 'C',
            /**
             * @method controller
             * @param $scope
             * @param $element
             * @param $attrs
             */
            controller : ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {
                var username_key = "username" + $window.name;

                $scope.active_username = localStorage.getItem(username_key);

                $scope.$watch('active_username', function(new_value){
                    localStorage.setItem(username_key, $scope.active_username);
                });

                $scope.authType = 'login';
                $scope.changeAuthType = function () {
                    $scope.authType = $scope.authType === 'login' ? 'register' : 'login';
                };

                $scope.registrationSuccessful = function () {
                    $scope.changeAuthType();
                    systemMessageService.addSuccessMessage('Registration successful. Check your mails for more infos!');
                };

                $scope.logout = function () {
                    delete $http.defaults.headers.common.Authorization;
                    $scope.active_username = null;
                    $http.get(configuration.LOGOUT_URL);
                    systemMessageService.addSuccessMessage('See you next time');
                    $scope.$emit('event:auth-logoutSuccessful');
                    $scope.$emit('event:auth-loginRequired');
                };

                $scope.login = function (header) {
                    var config = {
                            headers : {
                                'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
                            }
                        },

                        data = $.param({
                            '_username' : $scope.username,
                            '_password' : $scope.password,
                            '_csrf_token' : $scope.csrf
                        });
                    $http.post(configuration.LOGIN_URL, data, config)
                        .success(function () {
                            authService.loginConfirmed();
                            $scope.active_username = $scope.username;
                            $scope.username = '';
                            $scope.password = '';
                            systemMessageService.addSuccessMessage('Welcome back ' + $scope.active_username);
                        }).
                        error(function () {
                            systemMessageService.addErrorMessage('Login with username "' + $scope.username + '" was not successful');
                        });
                    return;
                };
            }
            ],
            link : function (scope, element) {
                var auth = element.find('#auth-container'),
                    content = element.find('#content');

                auth.hide();

                scope.$on('event:auth-loginRequired', function (event, csrf) {
                    scope.csrf = csrf;
                    scope.active_username = null;

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