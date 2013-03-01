'use strict';

Application.Services.factory('childFrameMessenger', ["$window", "$rootScope",
    function ($window, $rootScope) {
        var copy = angular.copy,
            forEach = angular.forEach,
            toJson = angular.toJson,
            fromJson = angular.fromJson,
            noop = angular.noop;

        function ChildFrameMessenger (name) {
            this.name = name;
        }

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
