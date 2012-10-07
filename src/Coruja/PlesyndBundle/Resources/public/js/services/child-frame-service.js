'use strict';

plesynd.factory('childFrameService', ["$rootScope", "widgetService",
    function ($rootScope, widgetService) {

        function ChildFrameService() {
            console.log('ChildFrameService Konstruktor');
            this.childFrames = {};
            this.widgets = [];
        }

        var service = new ChildFrameService();

        ChildFrameService.prototype.addChild = function(child) {
            if(this.childFrames[child['id']] == undefined) {
                this.childFrames[child['id']] = {
                  //  frame : child,
                    data  : null
                };
            }
        };

        ChildFrameService.prototype.setChildFrameData = function(data) {
            var self = this;
            var position;

            if(data['id'] != undefined && this.childFrames[data['id']] != undefined) {
                position = self.findWidgetPosition(data['id']);
                if(position != undefined) {
                    $rootScope.$apply(function() {
                        self.widgets[position]['data'] = data;
                        self.widgets[position]['data']['number_not_synchronized'] =
                            data['added'].length + data['changed'].length + data['deleted'].length
                    })
                }
            }
        };

        ChildFrameService.prototype.setWidgets = function(widgets) {
            this.widgets = widgets;
        };

        ChildFrameService.prototype.findWidgetPosition = function(instance_identifier) {
            var position;
            angular.forEach(this.widgets, function(widget, index) {
                if(widget['instance_identifier'] == instance_identifier) {
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