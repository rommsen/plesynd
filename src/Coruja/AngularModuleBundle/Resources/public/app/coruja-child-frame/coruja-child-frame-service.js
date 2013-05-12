'use strict';

/**
 * Angular Services
 *
 * @module Application.Services
 */

/**
 * Stores and works with child frames (i.e. widgets)
 *
 * @class childFrameService
 */
Application.Services.factory('childFrameService', ["$rootScope",
    /**
     * @method Factory
     * @param $rootScope
     * @returns {ChildFrameService}
     */
    function ($rootScope) {
        var forEach = angular.forEach,
            service;

        /**
         * Constructor
         * @method ChildFrameService
         * @constructor
         */
        function ChildFrameService() {
            this.childFrames = {};
            this.widgets = [];
        }

        /**
         * Adds a child to the stored child frames
         * @method addChild
         * @param child
         */
        ChildFrameService.prototype.addChild = function (child) {
            if (this.childFrames[child.id] === undefined) {
                this.childFrames[child.id] = {
                    data:null
                };
            }
        };

        /**
         * Sets the data for a specific child frame
         * @method setChildFrameData
         * @param data
         */
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

        /**
         * @method setWidgets
         * @param widgets
         */
        ChildFrameService.prototype.setWidgets = function (widgets) {
            this.widgets = widgets;
        };

        /**
         * @method findWidgetPosition
         * @param instance_identifier
         * @returns {*}
         */
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