'use strict';

Application.Services.factory('parentFrameMessenger', ["$rootScope", function ($rootScope) {
    function ParentFrameMessenger() {
    }

    ParentFrameMessenger.prototype.initialize = function () {
        var self = this;
        pm.bind("register_child_frame", function (child) {
            if (child['id'] != undefined) {
                $rootScope.$broadcast("childFrameRegistered", child);
            }
        });

        pm.bind("notify_about_items", function (data) {
            if (data['id'] != undefined) {
                $rootScope.$broadcast("incomingFrameData", data);
            }
        });
    }

    return new ParentFrameMessenger();
}]);