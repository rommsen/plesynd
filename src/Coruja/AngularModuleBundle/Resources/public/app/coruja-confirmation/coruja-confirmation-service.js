'use strict';

/**
 * Angular Services
 *
 * @module Application.Services
 */

/**
 * Provides methods to get confirmations for specific actions from the user
 *
 * @class childFrameService
 */
Application.Services.factory('confirmationService', ["$rootScope",
    /**
     * @method Factory
     * @param $rootScope
     * @returns {{}}
     */
    function ($rootScope) {
        var noop = angular.noop,
            service = {},
            confirm_text,
            confirm_callback,
            cancel_callback;

        service.confirmation_needed = false;

        /**
         * Asks for confirmation
         * @method confirm
         * @param text
         * @param confirm
         * @param cancel
         */
        service.confirm = function(text, confirm, cancel) {
            confirm_text = text;
            confirm_callback = confirm;
            cancel_callback = cancel;
            service.confirmation_needed = true;
        };

        /**
         * confirmation confirmed
         * @method confirmed
         */
        service.confirmed = function() {
            (confirm_callback || noop)();
            service.reset();
        };

        /**
         * confirmation cancelled
         * @method cancelled
         */
        service.cancelled = function() {
            (cancel_callback || noop)();
            service.reset();
        };

        /**
         * resets all values
         * @method reset
         */
        service.reset = function() {
            confirm_text = null;
            confirm_callback = null;
            cancel_callback = null;
            service.confirmation_needed = false;
        };

        /**
         * @method getConfirmationText
         * @returns {*}
         */
        service.getConfirmationText = function() {
            return confirm_text;
        };

        return service;
    }]);