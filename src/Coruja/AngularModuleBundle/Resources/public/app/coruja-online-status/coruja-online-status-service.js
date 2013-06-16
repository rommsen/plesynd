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
Application.Services.factory('onlineStatus', ["$window", "$rootScope",
    function ($window, $rootScope) {
        var onlineStatus = {};

        onlineStatus.onLine = $window.navigator.onLine;

        /**
         * Return whether system is online
         * @returns {boolean}
         */
        onlineStatus.isOnline = function () {
            return onlineStatus.onLine;
        };

        /**
         * Returns "online" or "offline"
         * @returns {string}
         */
        onlineStatus.getOnlineStatusString = function () {
            return onlineStatus.isOnline() ? 'online' : 'offline';
        };

        $rootScope.$on('onlineChanged', function (evt, isOnline) {
            onlineStatus.onLine = isOnline;
        });

        return onlineStatus;
    }]);