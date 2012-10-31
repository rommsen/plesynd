'use strict';

Application.Controllers.controller('ConfirmationCtrl', ['$scope', 'confirmationService',
    function ($scope, confirmationService) {
        $scope.confirmationService = confirmationService;
        $scope.$watch('confirmationService.confirmation_needed', function(confirmation_needed) {
            $scope.confirmationModalShown = confirmation_needed;
            $scope.confirmation_text = $scope.confirmationService.getConfirmationText();
        });

        $scope.confirm = function() {
            confirmationService.confirmed();
        };

        $scope.cancel = function() {
            $scope.confirmationService.cancelled();
        };
    }]);