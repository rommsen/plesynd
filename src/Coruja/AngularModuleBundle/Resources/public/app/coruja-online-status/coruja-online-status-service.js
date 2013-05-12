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

        onlineStatus.isOnline = function () {
            return onlineStatus.onLine;
        };

        onlineStatus.getOnlineStatusString = function () {
            return onlineStatus.isOnline() ? 'online' : 'offline';
        };

        $rootScope.$on('onlineChanged', function (evt, isOnline) {
            onlineStatus.onLine = isOnline;
        });

        return onlineStatus;
    }]);