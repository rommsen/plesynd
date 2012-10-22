'use strict';

Application.Services.factory('childFrameService', ["$rootScope", function ($rootScope) {
    function ChildFrameService() {
        this.childFrames = {};
        this.widgets = [];
    }

    var service = new ChildFrameService();

    ChildFrameService.prototype.addChild = function (child) {
        if (this.childFrames[child['id']] == undefined) {
            this.childFrames[child['id']] = {
                //  frame : child,
                data:null
            };
        }
    };

    ChildFrameService.prototype.setChildFrameData = function (data) {
        var self = this;
        var position;

        if (data['id'] !== undefined && this.childFrames[data['id']] !== undefined) {
            position = self.findWidgetPosition(data['id']);
            console.log(data);
            if (position !== undefined) {
                $rootScope.$apply(function () {
                    self.widgets[position]['data'] = data;
                    self.widgets[position]['data']['number_not_synchronized'] =
                        data['added'] + data['changed'] + data['deleted'];
                    console.log(self.widgets[position]);
                })
            }
        }
    };

    ChildFrameService.prototype.setWidgets = function (widgets) {
        this.widgets = widgets;
    };

    ChildFrameService.prototype.findWidgetPosition = function (instance_identifier) {
        var position;
        angular.forEach(this.widgets, function (widget, index) {
            if (widget['instance_identifier'] == instance_identifier) {
                position = index;
            }
        });
        return position;
    };

    $rootScope.$on("childFrameRegistered", function (event, child) {
        service.addChild(child);
    });

    $rootScope.$on("incomingFrameData", function (event, data) {
        service.setChildFrameData(data);
    });

    return service;
}]);