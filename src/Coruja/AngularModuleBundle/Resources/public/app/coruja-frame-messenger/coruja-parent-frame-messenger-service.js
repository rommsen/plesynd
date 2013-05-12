'use strict';

/**
 * Angular Services
 *
 * @module Application.Services
 */

/**
 * Enables parent frame to listen to child frame messages
 *
 * @class childFrameMessenger
 */

Application.Services.factory('parentFrameMessenger', ["$rootScope",
    /**
     * @method factory
     * @param $rootScope
     * @returns {ParentFrameMessenger}
     */
    function ($rootScope) {
        function ParentFrameMessenger() {
        }

        /**
         * Registers event listeners
         * @method initialize
         */
        ParentFrameMessenger.prototype.initialize = function () {
            pm.bind("register_child_frame", function (child) {
                if (child['id'] != undefined) {
                    $rootScope.$broadcast("childFrameRegistered", child);
                    return {success: true};
                }
            });

            pm.bind("notify_about_items", function (data) {
                if (data['id'] != undefined) {
                    $rootScope.$broadcast("incomingFrameData", data);
                }
            });
        };

        return new ParentFrameMessenger();
    }]);