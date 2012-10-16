'use strict';

angular.module('corujaFrameMessenger', []).factory('childFrameMessenger', ["$window",
    function ($window) {
        var copy = angular.copy,
            forEach = angular.forEach,
            toJson = angular.toJson,
            fromJson = angular.fromJson,
            noop = angular.noop;

        function ChildFrameMessenger(name) {
            this.name = name;
        }

        ChildFrameMessenger.prototype.registerWithParent = function() {
            pm({
                target: $window.parent,
                type: "register_child_frame",
                data: {id: this.name}
            });
        };

        ChildFrameMessenger.prototype.notifyParentAboutItems = function(data) {
            data['id'] = this.name;
            console.log('im messenger', data);
            pm({
                target: $window.parent,
                type: "notify_about_items",
                data: data
            });
        };

        return new ChildFrameMessenger($window.name);
    }]);