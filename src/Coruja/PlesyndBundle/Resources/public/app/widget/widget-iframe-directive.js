'use strict';

/**
 * Plesynd Directives
 *
 * @module Plesynd.Directives
 */

/**
 * Loads wifgets into an iframe dom element
 *
 * @class widgetIframe
 */
Application.Directives.directive('widgetIframe', [
    /**
     * @method Factory
     * @returns {{restrict: string, link: Function}}
     */
    function () {
        return  {
            'restrict' : 'E',
            'link' : function (scope, element, attrs, ctrl) {
                var widget = scope.widget;
                element.html('<iframe src="' + widget.instance.url + '" name="' + widget.instance_identifier + '" width=' + widget.instance.width + ' height=' + widget.instance.height + '></iframe>');
            }
        };
    }]);