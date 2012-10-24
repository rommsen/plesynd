'use strict';

Application.Services.factory('childFrameService', ["$rootScope",
    function ($rootScope) {
        var forEach = angular.forEach,
            service;

        function ChildFrameService() {
            this.childFrames = {};
            this.widgets = [];
        }

        ChildFrameService.prototype.addChild = function (child) {
            if (this.childFrames[child.id] === undefined) {
                this.childFrames[child.id] = {
                    data:null
                };
            }
        };

        ChildFrameService.prototype.setChildFrameData = function (data) {
            var self = this,
                position;

            if (data.id !== undefined && this.childFrames[data.id] !== undefined) {
                position = self.findWidgetPosition(data.id);
                if (position !== undefined) {
                    $rootScope.$apply(function () {
                        self.widgets[position].data = data;
                        self.widgets[position].data.number_not_synchronized =
                            data.added + data.changed + data.deleted;
                    });
                }
            }
        };

        ChildFrameService.prototype.setWidgets = function (widgets) {
            this.widgets = widgets;
        };

        ChildFrameService.prototype.findWidgetPosition = function (instance_identifier) {
            var position;
            forEach(this.widgets, function (widget, index) {
                if (widget.instance_identifier == instance_identifier) {
                    position = index;
                }
            });
            return position;
        };

        service = new ChildFrameService();

        $rootScope.$on("childFrameRegistered", function (event, child) {
            service.addChild(child);
        });

        $rootScope.$on("incomingFrameData", function (event, data) {
            service.setChildFrameData(data);
        });

        return service;
    }]);