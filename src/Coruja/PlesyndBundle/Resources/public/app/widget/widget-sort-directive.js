'use strict';

Application.Directives.directive('widgetSort', ['widgetService',
    function (widgetService) {
        return  {
            'restrict' : 'A',
            'link' : function (scope, element, attrs, ctrl) {
                function updateWidgets() {
                    var widget,
                        position = 1;
                    element.find('.widget').each(function(index, element){
                        widget = angular.element(element).scope().widget;
                        if(scope.isWidgetVisible(widget)) {
                            if(widget.position != position) {
                                widget.position = position;
                                widgetService.put(widget);
                            }
                            position += 1;
                        }
                    });
                }

                scope.$watch('widgets', function () {
                    updateWidgets();
                }, true);

                element.sortable({
                    items : '.widget',
                    cursorAt: { top: 5, left: 5 },
                    tolerance: "pointer",
                    stop : function (event, ui) {
                        updateWidgets();
                    }

                });
            }
        };
    }]);