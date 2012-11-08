'use strict';

Application.Directives.directive('widgetIframe', [
    function () {
        return  {
            'restrict' : 'E',
            'link' : function (scope, element, attrs, ctrl) {
                var widget = scope.widget;
                element.html('<iframe src="' + widget.instance.url + '" name="' + widget.instance_identifier + '" width=' + widget.instance.width + ' height=' + widget.instance.height + '></iframe>');
            }
        };
    }]);