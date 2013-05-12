'use strict';

/**
 * Angular Controllers
 *
 * @module Application.Controllers
 */

/**
 * Handles confirmation messages
 *
 * @class ConfirmationCtrl
 */
Application.Controllers.controller('ConfirmationCtrl', ['$scope', 'confirmationService',
    /**
     * @method Factory
     * @param $scope
     * @param confirmationService
     */
    function ($scope, confirmationService) {
        $scope.confirmationService = confirmationService;
        $scope.$watch('confirmationService.confirmation_needed', function(confirmation_needed) {
            $scope.confirmationModalShown = confirmation_needed;
            $scope.confirmation_text = $scope.confirmationService.getConfirmationText();
        });

        /**
         * Confirms a message
         * @method confirm
         */
        $scope.confirm = function() {
            confirmationService.confirmed();
        };

        /**
         * Cancels a message
         * @method confirm
         */
        $scope.cancel = function() {
            $scope.confirmationService.cancelled();
        };
    }]);