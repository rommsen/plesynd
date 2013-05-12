'use strict';

/**
 * Angular Services
 *
 * @module Application.Services
 */

/**
 * Provides functions to display messages to the user
 *
 * @class systemMessageService
 */
Application.Services.factory('systemMessageService', ["$rootScope", "$timeout",
    /**
     * @method Factory
     * @param $rootScope
     * @param $timeout
     * @returns {MessageService}
     */
    function ($rootScope, $timeout) {
        function MessageService() {
        }

        /**
         * Broadcasts that a message was added
         * @method addMessageObject
         * @param message
         */
        MessageService.prototype.addMessageObject = function (message) {
            $timeout(function () {
                $rootScope.$broadcast("systemMessageAdded", message);
            });
        };

        /**
         * @method addMessage
         * @param message
         * @param sticky
         */
        MessageService.prototype.addMessage = function (message, sticky) {
            this.addMessageObject({
                'message':message,
                'sticky':sticky || false
            });
        };

        /**
         * @method addInfoMessage
         * @param message
         * @param sticky
         */
        MessageService.prototype.addInfoMessage = function (message, sticky) {
            this.addMessageObject({
                'message':message,
                'type':'info',
                'sticky':sticky || false
            });
        };

        /**
         * @method addErrorMessage
         * @param message
         * @param sticky
         */
        MessageService.prototype.addErrorMessage = function (message, sticky) {
            this.addMessageObject({
                'message':message,
                'type':'error',
                'sticky':sticky || false
            });
        };

        /**
         * @method addSuccessMessage
         * @param message
         * @param sticky
         */
        MessageService.prototype.addSuccessMessage = function (message, sticky) {
            this.addMessageObject({
                'message':message,
                'type':'success',
                'sticky':sticky || false
            });
        };

        return new MessageService();
    }]);