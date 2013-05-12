'use strict';

/**
 * Angular Services
 *
 * @module Application.Services
 */

/**
 * Enables child frames to communicate with parent frame
 *
 * @class childFrameMessenger
 */
Application.Services.factory('childFrameMessenger', ["$window", "$rootScope",
    /**
     * @method Factory
     * @param $window
     * @param $rootScope
     * @returns {ChildFrameMessenger}
     */
    function ($window, $rootScope) {
        var copy = angular.copy,
            forEach = angular.forEach,
            toJson = angular.toJson,
            fromJson = angular.fromJson,
            noop = angular.noop;

        function ChildFrameMessenger (name) {
            this.name = name;
        }

        /**
         * @method registerWithParent
         */
        ChildFrameMessenger.prototype.registerWithParent = function () {
            pm({
                target : $window.parent,
                type : "register_child_frame",
                data : {id : this.name},
                success : function (data) {
                    // if successful application is used as a widget
                    $rootScope.is_widget = true;
                }
            });
        };

        /**
         * @method notifyParentAboutItems
         * @param object data
         */
        ChildFrameMessenger.prototype.notifyParentAboutItems = function (data) {
            data.id = this.name;
            pm({
                target : $window.parent,
                type : "notify_about_items",
                data : data
            });
        };

        return new ChildFrameMessenger($window.name);
    }
]);
