'use strict';

/**
 * Angular Controllers
 *
 * @module Application.Controllers
 */

/**
 * Handles account confirmation
 *
 * @class AccountActionCtrl
 */
Application.Controllers.controller('AccountActionCtrl', ['$scope', '$http', '$location', '$routeParams', 'confirmationService', 'systemMessageService', 'configuration', 'info',
    /**
     * @method Factory
     * @param $scope
     * @param $http
     * @param $location
     * @param $routeParams
     * @param confirmationService
     * @param systemMessageService
     * @param configuration
     * @param info
     */
    function ($scope, $http, $location, $routeParams, confirmationService, systemMessageService, configuration, info) {
        var msg, callback, code;
        switch(info.action) {
            case '/account_confirmation':
                msg = 'Click confirm to confirm your account';
                code = $routeParams.code;
                callback = function() {
                    $http.post(configuration.CONFIRM_URL + code)
                        .success(function(){
                            systemMessageService.addSuccessMessage('Account confirmed');
                            $location.path('/');
                        }).
                        error(function() {
                            systemMessageService.addErrorMessage('Account could not be confirmed');
                            $location.path('/');
                        });
                };
                break;
        }
        confirmationService.confirm(msg, callback);
    }]);