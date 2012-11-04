'use strict';

Application.Directives.directive('widgetSort', ['widgetService',
    function (widgetService) {
        return  {
            'link' : function (scope, element, attrs, ctrl) {
                //var scope = this;
                // eventuell ein watch einbauen, um auf löschen etc von widgets reagieren zu können


                element.sortable({
                    items : '.widget',
                    cursorAt: { top: 5, left: 5 },
                    tolerance: "pointer",
                    stop : function (event, ui) {
                        var widget;
                        var position = 1;
                        $(".widget").each(function(index, element){
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

                });
            }
        };
    }]);