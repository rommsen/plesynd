'use strict';

Application.Controllers.controller('AccountActionCtrl', ['$scope', '$http', '$location', '$routeParams', 'confirmationService', 'systemMessageService', 'configuration', 'info',
    function ($scope, $http, $location, $routeParams, confirmationService, systemMessageService, configuration, info) {
        var msg, callback;
        switch(info.action) {
            case '/account_confirmation':
                msg = 'Click confirm to confirm your account';
                callback = function() {
                    $http.post(configuration.CONFIRM_URL + $routeParams.code)
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